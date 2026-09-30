<script lang="ts">
  import { Plus, Copy, Trash2, Edit3, LogOut, FileText, Calendar } from 'lucide-svelte';

  let { data }: { data: any } = $props();
  let resumes = $state(data.resumes || []);
  let creating = $state(false);

  async function handleCreateCV() {
    if (creating) return;
    creating = true;
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Software Engineer CV' })
      });
      if (res.ok) {
        const json = await res.json();
        window.location.href = `/editor/${json.resume.id}`;
      } else {
        alert('Gagal membuat CV. Silakan coba lagi.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      creating = false;
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const res = await fetch(`/api/resumes/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        resumes = [json.resume, ...resumes];
      }
    } catch {
      alert('Gagal menduplikasi CV.');
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus resume "${title}"? Tindakan ini permanen.`)) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        resumes = resumes.filter((r: any) => r.id !== id);
      }
    } catch {
      alert('Gagal menghapus CV.');
    }
  }

  function formatDate(d: string | Date) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<div class="min-h-screen flex flex-col justify-between">
  <!-- Header -->
  <header class="border-b-4 border-black bg-white px-6 py-4 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000]">
            CV
          </div>
          <span class="font-black text-xl tracking-tighter">CVFORGE</span>
        </a>
        <span class="brutal-badge">DASHBOARD</span>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs font-bold text-slate-700 hidden sm:inline-block">
          {data.user?.email}
        </span>
        <a href="/logout" class="brutal-btn text-xs py-1.5 px-3 flex items-center gap-1.5">
          <LogOut class="w-3.5 h-3.5" /> LOGOUT
        </a>
      </div>
    </div>
  </header>

  <!-- Content -->
  <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-6 mb-8">
      <div>
        <h1 class="text-3xl font-black uppercase tracking-tight">MY RESUMES</h1>
        <p class="text-sm font-semibold text-slate-600 mt-1">Manage, update, and tailor your ATS-compliant CVs</p>
      </div>

      <button
        onclick={handleCreateCV}
        disabled={creating}
        class="brutal-btn brutal-btn-accent text-sm py-2.5 px-5 flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> {creating ? 'CREATING...' : 'CREATE NEW CV'}
      </button>
    </div>

    <!-- Grid Resumes -->
    {#if resumes.length === 0}
      <div class="brutal-card p-12 text-center bg-white space-y-4 max-w-lg mx-auto my-12">
        <div class="w-12 h-12 bg-yellow-300 border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
          <FileText class="w-6 h-6" />
        </div>
        <h2 class="text-xl font-black uppercase">NO RESUMES FOUND</h2>
        <p class="text-sm text-slate-600 font-medium">You haven't created any CVs yet. Start building your first ATS-friendly CV now.</p>
        <button onclick={handleCreateCV} class="brutal-btn brutal-btn-primary text-xs py-2 px-5">
          + CREATE FIRST CV
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each resumes as cv (cv.id)}
          <div class="brutal-card p-5 bg-white flex flex-col justify-between h-56 group">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-mono font-bold bg-slate-100 border border-black px-1.5 py-0.5 uppercase">
                  {cv.template}
                </span>
                <span class="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Calendar class="w-3 h-3" /> {formatDate(cv.updatedAt)}
                </span>
              </div>
              <h3 class="font-black text-lg text-slate-950 group-hover:text-blue-700 transition-colors line-clamp-2">
                {cv.title}
              </h3>
            </div>

            <div class="pt-4 border-t-2 border-black flex items-center justify-between gap-2">
              <a href={`/editor/${cv.id}`} class="brutal-btn brutal-btn-primary text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5">
                <Edit3 class="w-3.5 h-3.5" /> EDIT
              </a>
              <button
                onclick={() => handleDuplicate(cv.id)}
                class="brutal-btn text-xs py-1.5 px-2.5"
                title="Duplicate CV"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
              <button
                onclick={() => handleDelete(cv.id, cv.title)}
                class="brutal-btn brutal-btn-danger text-xs py-1.5 px-2.5"
                title="Delete CV"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>
