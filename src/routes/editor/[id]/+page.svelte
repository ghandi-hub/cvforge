<script lang="ts">
  import {
    Save, ArrowLeft, Download, Search, Layout, FileText, CheckCircle2,
    Plus, Trash2, GripVertical, AlertTriangle, Eye, RefreshCw
  } from 'lucide-svelte';
  import CvRenderer from '$lib/components/CvRenderer.svelte';
  import type { Resume, CVData, SectionType } from '$lib/types/cv';

  let { data }: { data: any } = $props();

  // State
  let resume = $state<Resume>(data.resume);
  let cvData = $state<CVData>(data.resume.data || {});
  let activeTab = $state<'editor' | 'preview' | 'ats'>('editor');
  let saveStatus = $state<'saved' | 'saving' | 'error'>('saved');
  let selectedTemplate = $state(resume.template || 'ats-classic');
  let sectionOrder = $state<SectionType[]>(resume.sectionOrder || [
    'experience', 'education', 'skills', 'projects', 'certifications', 'languages'
  ]);

  // ATS Analyzer state
  let jobDescription = $state('');
  let isAnalyzing = $state(false);
  let atsReport = $state<any>(null);

  // Debounced Autosave
  let saveTimeout: any = null;
  function triggerAutosave() {
    saveStatus = 'saving';
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/resumes/${resume.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: resume.title,
            template: selectedTemplate,
            sectionOrder,
            data: cvData
          })
        });
        if (res.ok) {
          saveStatus = 'saved';
        } else {
          saveStatus = 'error';
        }
      } catch {
        saveStatus = 'error';
      }
    }, 1200);
  }

  // Section additions
  function addExperience() {
    cvData.experience = [
      ...cvData.experience,
      {
        id: crypto.randomUUID(),
        company: 'Nama Perusahaan',
        position: 'Posisi / Role',
        location: 'Jakarta, Indonesia',
        startDate: '2024',
        endDate: 'Sekarang',
        current: true,
        description: 'Memimpin pengembangan fitur dan arsitektur sistem...',
        achievements: []
      }
    ];
    triggerAutosave();
  }

  function removeExperience(id: string) {
    cvData.experience = cvData.experience.filter((e) => e.id !== id);
    triggerAutosave();
  }

  function addEducation() {
    cvData.education = [
      ...cvData.education,
      {
        id: crypto.randomUUID(),
        institution: 'Nama Universitas / Kampus',
        degree: 'Sarjana Komputer (S.Kom)',
        field: 'Teknik Informatika',
        startYear: '2020',
        endYear: '2024',
        description: ''
      }
    ];
    triggerAutosave();
  }

  function removeEducation(id: string) {
    cvData.education = cvData.education.filter((e) => e.id !== id);
    triggerAutosave();
  }

  function addProject() {
    cvData.projects = [
      ...cvData.projects,
      {
        id: crypto.randomUUID(),
        name: 'Nama Proyek / Aplikasi',
        description: 'Deskripsi ringkas mengenai solusi dan dampak proyek...',
        technologies: ['TypeScript', 'SvelteKit', 'MongoDB'],
        url: '',
        repoUrl: ''
      }
    ];
    triggerAutosave();
  }

  function removeProject(id: string) {
    cvData.projects = cvData.projects.filter((p) => p.id !== id);
    triggerAutosave();
  }

  function addSkillCategory() {
    cvData.skills = [
      ...cvData.skills,
      {
        id: crypto.randomUUID(),
        category: 'Bahasa & Framework',
        skills: ['TypeScript', 'Node.js', 'MongoDB']
      }
    ];
    triggerAutosave();
  }

  function removeSkillCategory(id: string) {
    cvData.skills = cvData.skills.filter((s) => s.id !== id);
    triggerAutosave();
  }

  // Section Ordering Reorder Helpers
  function moveSection(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const item = sectionOrder[index];
    const newOrder = [...sectionOrder];
    newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, item);
    sectionOrder = newOrder;
    triggerAutosave();
  }

  // ATS Keyword analysis
  async function runATSAnalysis() {
    if (!jobDescription.trim()) return;
    isAnalyzing = true;
    try {
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          cvData
        })
      });
      if (res.ok) {
        const json = await res.json();
        atsReport = json.result;
      }
    } catch {
      alert('Gagal menganalisis Job Description.');
    } finally {
      isAnalyzing = false;
    }
  }

  // Cetak / ekspor PDF: pakai kelas penanda agar CSS print hanya mengeluarkan dokumen CV
  function exportPrint() {
    document.body.classList.add('printing-cv');
    const cleanup = () => {
      document.body.classList.remove('printing-cv');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    // Fallback untuk browser yang tidak memicu afterprint
    setTimeout(cleanup, 2000);
  }
</script>

<div class="min-h-screen flex flex-col bg-slate-100 overflow-x-hidden">
  <!-- Top Editor Navbar -->
  <header class="border-b-4 border-black bg-white px-3 sm:px-4 py-3 sticky top-0 z-50 no-print">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-center gap-2 md:gap-3">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <a href="/dashboard" class="brutal-btn text-xs py-1.5 px-2.5 shrink-0" title="Kembali ke Dashboard">
          <ArrowLeft class="w-4 h-4" />
        </a>
        <input
          type="text"
          bind:value={resume.title}
          oninput={triggerAutosave}
          class="font-black text-base sm:text-lg uppercase bg-transparent border-b-2 border-transparent hover:border-black focus:border-black outline-none px-1 min-w-0 flex-1"
        />
        <span class="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 border border-black rounded-full whitespace-nowrap shrink-0"
          class:bg-emerald-100={saveStatus === 'saved'}
          class:text-emerald-800={saveStatus === 'saved'}
          class:bg-yellow-100={saveStatus === 'saving'}
          class:text-yellow-800={saveStatus === 'saving'}
          class:bg-red-100={saveStatus === 'error'}
          class:text-red-800={saveStatus === 'error'}
        >
          {saveStatus === 'saved' ? '✓ TERSIMPAN' : saveStatus === 'saving' ? 'MENYIMPAN...' : 'GAGAL SIMPAN'}
        </span>
      </div>

      <!-- Action Toolbar -->
      <div class="flex items-center gap-2 flex-wrap w-full md:w-auto">
        <!-- Template Picker -->
        <select
          bind:value={selectedTemplate}
          onchange={triggerAutosave}
          class="brutal-input text-xs py-1.5 px-3 font-bold w-auto min-w-0 flex-1 md:flex-none"
        >
          <option value="ats-classic">Template: ATS Klasik</option>
          <option value="ats-modern">Template: ATS Modern</option>
          <option value="ats-brutalist">Template: ATS Brutalist</option>
        </select>

        <button onclick={exportPrint} class="brutal-btn brutal-btn-accent text-xs py-2 px-3 sm:px-4 flex items-center gap-1.5 whitespace-nowrap">
          <Download class="w-4 h-4" /> <span class="hidden xs:inline sm:inline">CETAK / </span>PDF
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile View Toggle Tabs -->
  <div class="lg:hidden flex border-b-2 border-black bg-white no-print">
    <button
      onclick={() => (activeTab = 'editor')}
      class="flex-1 py-3 text-center text-xs font-black uppercase border-r border-black"
      class:bg-black={activeTab === 'editor'}
      class:text-white={activeTab === 'editor'}
    >
      [ FORM EDIT ]
    </button>
    <button
      onclick={() => (activeTab = 'preview')}
      class="flex-1 py-3 text-center text-xs font-black uppercase border-r border-black"
      class:bg-black={activeTab === 'preview'}
      class:text-white={activeTab === 'preview'}
    >
      [ PRATINJAU ]
    </button>
    <button
      onclick={() => (activeTab = 'ats')}
      class="flex-1 py-3 text-center text-xs font-black uppercase"
      class:bg-black={activeTab === 'ats'}
      class:text-white={activeTab === 'ats'}
    >
      [ CEK ATS ]
    </button>
  </div>

  <!-- Workspace Container -->
  <div class="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-6 items-start">
    <!-- LEFT COLUMN: Forms Editor -->
    <div
      class="lg:col-span-6 space-y-6 no-print"
      class:hidden={activeTab !== 'editor'}
      class:lg:block={true}
    >
      <!-- Personal Info -->
      <div class="brutal-card p-5 bg-white space-y-4">
        <h2 class="font-black text-sm uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2">
          <FileText class="w-4 h-4" /> INFORMASI PRIBADI & KONTAK
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Nama Lengkap</label>
            <input type="text" bind:value={cvData.basics.name} oninput={triggerAutosave} placeholder="Budi Santoso" class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Headline / Posisi</label>
            <input type="text" bind:value={cvData.basics.headline} oninput={triggerAutosave} placeholder="Senior Software Engineer" class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Email</label>
            <input type="email" bind:value={cvData.basics.email} oninput={triggerAutosave} placeholder="budi@email.com" class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Nomor Telepon / WhatsApp</label>
            <input type="text" bind:value={cvData.basics.phone} oninput={triggerAutosave} placeholder="+62 812 3456 7890" class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Domisili / Lokasi</label>
            <input type="text" bind:value={cvData.basics.location} oninput={triggerAutosave} placeholder="Jakarta, Indonesia" class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">URL LinkedIn</label>
            <input type="text" bind:value={cvData.basics.linkedin} oninput={triggerAutosave} placeholder="https://linkedin.com/in/..." class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">URL GitHub</label>
            <input type="text" bind:value={cvData.basics.github} oninput={triggerAutosave} placeholder="https://github.com/..." class="brutal-input text-xs" />
          </div>
          <div>
            <label class="text-[11px] font-bold uppercase block mb-1">Website / Portfolio</label>
            <input type="text" bind:value={cvData.basics.website} oninput={triggerAutosave} placeholder="https://portofolio-saya.com" class="brutal-input text-xs" />
          </div>
        </div>
      </div>

      <!-- Professional Summary -->
      <div class="brutal-card p-5 bg-white space-y-3">
        <h2 class="font-black text-sm uppercase tracking-wider border-b-2 border-black pb-2">
          RINGKASAN PROFESIONAL (SUMMARY)
        </h2>
        <textarea
          bind:value={cvData.summary}
          oninput={triggerAutosave}
          rows="4"
          placeholder="Tulis ringkasan singkat profil Anda, pengalaman inti, spesialisasi teknologi, dan pencapaian utama..."
          class="brutal-input text-xs leading-relaxed"
        ></textarea>
      </div>

      <!-- Section Reordering -->
      <div class="brutal-card p-4 bg-yellow-50 border-2 border-black space-y-2">
        <span class="text-xs font-black uppercase">// ATUR URUTAN BAGIAN (SECTION)</span>
        <div class="flex flex-wrap gap-2">
          {#each sectionOrder as sec, idx}
            <div class="flex items-center gap-1 bg-white border border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
              <span class="capitalize">{sec}</span>
              <button onclick={() => moveSection(idx, 'up')} class="hover:text-blue-600 px-0.5" disabled={idx === 0}>↑</button>
              <button onclick={() => moveSection(idx, 'down')} class="hover:text-blue-600 px-0.5" disabled={idx === sectionOrder.length - 1}>↓</button>
            </div>
          {/each}
        </div>
      </div>

      <!-- Experience Section -->
      <div class="brutal-card p-5 bg-white space-y-4">
        <div class="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 class="font-black text-sm uppercase tracking-wider">PENGALAMAN KERJA</h2>
          <button onclick={addExperience} class="brutal-btn text-xs py-1 px-3 flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> TAMBAH PEKERJAAN
          </button>
        </div>

        {#each cvData.experience as exp, idx (exp.id)}
          <div class="border-2 border-black p-4 bg-slate-50 space-y-3 relative">
            <button
              onclick={() => removeExperience(exp.id)}
              class="absolute top-3 right-3 text-red-600 hover:text-red-800"
              title="Hapus Pekerjaan"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Posisi / Jabatan</label>
                <input type="text" bind:value={exp.position} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Nama Perusahaan</label>
                <input type="text" bind:value={exp.company} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Tanggal Mulai</label>
                <input type="text" bind:value={exp.startDate} oninput={triggerAutosave} placeholder="contoh: Jan 2022" class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Tanggal Berakhir</label>
                <input type="text" bind:value={exp.endDate} oninput={triggerAutosave} placeholder="contoh: Sekarang" class="brutal-input text-xs" />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase block mb-0.5">Deskripsi Tanggung Jawab & Kontribusi</label>
              <textarea
                bind:value={exp.description}
                oninput={triggerAutosave}
                rows="3"
                class="brutal-input text-xs"
              ></textarea>
            </div>
          </div>
        {/each}
      </div>

      <!-- Skills Section -->
      <div class="brutal-card p-5 bg-white space-y-4">
        <div class="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 class="font-black text-sm uppercase tracking-wider">KEAHLIAN & TEKNOLOGI (SKILLS)</h2>
          <button onclick={addSkillCategory} class="brutal-btn text-xs py-1 px-3 flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> TAMBAH KATEGORI
          </button>
        </div>

        {#each cvData.skills as cat, idx (cat.id)}
          <div class="border-2 border-black p-3 bg-slate-50 space-y-2 relative">
            <button
              onclick={() => removeSkillCategory(cat.id)}
              class="absolute top-2.5 right-2.5 text-red-600 hover:text-red-800"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
            <div class="pr-8">
              <label class="text-[10px] font-bold uppercase block mb-0.5">Nama Kategori</label>
              <input type="text" bind:value={cat.category} oninput={triggerAutosave} placeholder="contoh: Backend & Database" class="brutal-input text-xs" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase block mb-0.5">Daftar Keahlian (pisahkan dengan koma)</label>
              <input
                type="text"
                value={cat.skills.join(', ')}
                oninput={(e: any) => {
                  cat.skills = e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean);
                  triggerAutosave();
                }}
                placeholder="TypeScript, Node.js, Express, MongoDB, Docker"
                class="brutal-input text-xs"
              />
            </div>
          </div>
        {/each}
      </div>

      <!-- Projects Section -->
      <div class="brutal-card p-5 bg-white space-y-4">
        <div class="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 class="font-black text-sm uppercase tracking-wider">PROYEK / PORTOFOLIO</h2>
          <button onclick={addProject} class="brutal-btn text-xs py-1 px-3 flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> TAMBAH PROYEK
          </button>
        </div>

        {#each cvData.projects as proj, idx (proj.id)}
          <div class="border-2 border-black p-3 bg-slate-50 space-y-2 relative">
            <button onclick={() => removeProject(proj.id)} class="absolute top-2.5 right-2.5 text-red-600 hover:text-red-800">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Nama Proyek</label>
                <input type="text" bind:value={proj.name} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Teknologi yang Digunakan</label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  oninput={(e: any) => {
                    proj.technologies = e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean);
                    triggerAutosave();
                  }}
                  class="brutal-input text-xs"
                />
              </div>
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase block mb-0.5">Deskripsi Proyek</label>
              <textarea bind:value={proj.description} oninput={triggerAutosave} rows="2" class="brutal-input text-xs"></textarea>
            </div>
          </div>
        {/each}
      </div>

      <!-- Education Section -->
      <div class="brutal-card p-5 bg-white space-y-4">
        <div class="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 class="font-black text-sm uppercase tracking-wider">RIWAYAT PENDIDIKAN</h2>
          <button onclick={addEducation} class="brutal-btn text-xs py-1 px-3 flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> TAMBAH PENDIDIKAN
          </button>
        </div>

        {#each cvData.education as edu, idx (edu.id)}
          <div class="border-2 border-black p-3 bg-slate-50 space-y-2 relative">
            <button onclick={() => removeEducation(edu.id)} class="absolute top-2.5 right-2.5 text-red-600 hover:text-red-800">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Nama Institusi / Universitas</label>
                <input type="text" bind:value={edu.institution} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Gelar & Jurusan</label>
                <input type="text" bind:value={edu.degree} oninput={triggerAutosave} placeholder="S.Kom - Teknik Informatika" class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Tahun Masuk</label>
                <input type="text" bind:value={edu.startYear} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase block mb-0.5">Tahun Lulus (atau Ekspektasi)</label>
                <input type="text" bind:value={edu.endYear} oninput={triggerAutosave} class="brutal-input text-xs" />
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- RIGHT COLUMN: Live Preview or ATS Analyzer -->
    <div class="lg:col-span-6 space-y-6">
      <!-- Desktop Sub-Navigation (Preview vs ATS) -->
      <div class="hidden lg:flex gap-2 border-b-2 border-black pb-3 no-print">
        <button
          onclick={() => (activeTab = 'editor')}
          class="brutal-btn text-xs py-1.5 px-4"
          class:brutal-btn-primary={activeTab !== 'ats'}
        >
          <Eye class="w-3.5 h-3.5 mr-1" /> PRATINJAU DOKUMEN
        </button>
        <button
          onclick={() => (activeTab = 'ats')}
          class="brutal-btn text-xs py-1.5 px-4"
          class:brutal-btn-primary={activeTab === 'ats'}
        >
          <Search class="w-3.5 h-3.5 mr-1" /> ANALYZER KATA KUNCI ATS
        </button>
      </div>

      <!-- Preview Panel -->
      <div
        class="border-4 border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden"
        class:hidden={activeTab !== 'preview'}
        class:lg:block={activeTab !== 'ats'}
      >
        <div class="bg-black text-white px-3 sm:px-4 py-2 font-mono text-[10px] sm:text-xs font-bold flex justify-between items-center gap-2 no-print">
          <span class="truncate">PRATINJAU // {selectedTemplate.toUpperCase()}</span>
          <span class="text-slate-400 shrink-0">A4</span>
        </div>
        <CvRenderer data={cvData} template={selectedTemplate} {sectionOrder} />
      </div>

      <!-- ATS Analyzer Panel -->
      <div
        class="brutal-card p-6 bg-white space-y-6"
        class:hidden={activeTab !== 'ats'}
      >
        <div class="border-b-2 border-black pb-3">
          <h2 class="font-black text-lg uppercase flex items-center gap-2">
            <Search class="w-5 h-5 text-blue-600" /> PEMINDAI KATA KUNCI ATS
          </h2>
          <p class="text-xs text-slate-600 font-medium mt-1">
            Salin teks kualifikasi/deskripsi pekerjaan yang ingin Anda lamar. Sistem akan memvalidasi apakah kata kunci teknis tersebut sudah ada di CV Anda.
          </p>
        </div>

        <div>
          <label class="text-xs font-black uppercase block mb-1">TEKS JOB DESCRIPTION</label>
          <textarea
            bind:value={jobDescription}
            rows="6"
            placeholder="Tempel seluruh teks persyaratan pekerjaan di sini..."
            class="brutal-input text-xs leading-relaxed font-mono"
          ></textarea>
          <button
            onclick={runATSAnalysis}
            disabled={isAnalyzing || !jobDescription.trim()}
            class="brutal-btn brutal-btn-accent w-full text-xs py-2.5 mt-3 flex items-center justify-center gap-2"
          >
            {#if isAnalyzing}
              <RefreshCw class="w-4 h-4 animate-spin" /> MEMINDAI KATA KUNCI...
            {:else}
              <Search class="w-4 h-4" /> ANALISIS KECOCOKAN KATA KUNCI
            {/if}
          </button>
        </div>

        {#if atsReport}
          <div class="space-y-4 border-t-2 border-black pt-4">
            <div class="flex justify-between items-center bg-slate-100 p-4 border-2 border-black">
              <div>
                <span class="text-xs font-mono font-bold text-slate-500 uppercase">SKOR KECOCOKAN KEYWORD</span>
                <div class="text-2xl font-black text-slate-900 mt-0.5">{atsReport.scorePercentage}% COCOK</div>
              </div>
              <div class="w-12 h-12 bg-white border-2 border-black flex items-center justify-center font-black text-lg">
                {atsReport.foundKeywords.length}/{atsReport.foundKeywords.length + atsReport.missingKeywords.length}
              </div>
            </div>

            <!-- Found Keywords -->
            <div class="border-2 border-black p-3 bg-emerald-50">
              <span class="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5 mb-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" /> KATA KUNCI DITEMUKAN PADA CV ({atsReport.foundKeywords.length})
              </span>
              <div class="flex flex-wrap gap-1.5">
                {#each atsReport.foundKeywords as kw}
                  <span class="bg-white border border-emerald-800 text-emerald-900 px-2 py-0.5 text-xs font-bold shadow-[1px_1px_0px_#065f46]">
                    ✓ {kw}
                  </span>
                {/each}
              </div>
            </div>

            <!-- Missing Keywords -->
            {#if atsReport.missingKeywords.length > 0}
              <div class="border-2 border-black p-3 bg-rose-50">
                <span class="text-xs font-black uppercase text-rose-950 flex items-center gap-1.5 mb-2">
                  <AlertTriangle class="w-4 h-4 text-rose-600" /> KATA KUNCI BELUM ADA DI CV ({atsReport.missingKeywords.length})
                </span>
                <p class="text-[11px] text-slate-600 font-medium mb-2">
                  Pertimbangkan untuk menambahkan keahlian ini ke dalam deskripsi pekerjaan atau daftar skill Anda jika memang memiliki kompetensi tersebut:
                </p>
                <div class="flex flex-wrap gap-1.5">
                  {#each atsReport.missingKeywords as kw}
                    <span class="bg-white border border-rose-800 text-rose-900 px-2 py-0.5 text-xs font-bold shadow-[1px_1px_0px_#9f1239]">
                      × {kw}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Structure Checklist -->
            <div class="border-2 border-black p-3 bg-slate-50 space-y-1.5 text-xs font-bold">
              <span class="text-slate-500 uppercase block mb-1">// PEMERIKSAAN STRUKTUR DOKUMEN</span>
              <div class="flex items-center gap-2">
                <span class={atsReport.structureCheck.hasContactInfo ? 'text-emerald-600' : 'text-rose-600'}>
                  {atsReport.structureCheck.hasContactInfo ? '✓' : '×'}
                </span>
                <span>Informasi kontak lengkap (Email / Nomor Telepon)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class={atsReport.structureCheck.hasExperience ? 'text-emerald-600' : 'text-rose-600'}>
                  {atsReport.structureCheck.hasExperience ? '✓' : '×'}
                </span>
                <span>Daftar pengalaman kerja</span>
              </div>
              <div class="flex items-center gap-2">
                <span class={atsReport.structureCheck.hasEducation ? 'text-emerald-600' : 'text-rose-600'}>
                  {atsReport.structureCheck.hasEducation ? '✓' : '×'}
                </span>
                <span>Kredensial riwayat pendidikan</span>
              </div>
              <div class="flex items-center gap-2">
                <span class={atsReport.structureCheck.hasSkills ? 'text-emerald-600' : 'text-rose-600'}>
                  {atsReport.structureCheck.hasSkills ? '✓' : '×'}
                </span>
                <span>Matriks keahlian & teknologi</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
