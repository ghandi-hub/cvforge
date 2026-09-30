<script lang="ts">
  import { ArrowRight, Terminal } from 'lucide-svelte';

  let { data }: { data: any } = $props();
</script>

<div class="min-h-screen flex flex-col justify-between selection:bg-yellow-300">
  <!-- Navbar -->
  <header class="border-b-4 border-black bg-white px-6 py-4 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0px_#000]">
          CV
        </div>
        <span class="font-black text-xl tracking-tighter">CVFORGE</span>
        <span class="brutal-badge hidden sm:inline-block">BETA</span>
      </div>

      <div>
        {#if data?.user}
          <a href="/dashboard" class="brutal-btn brutal-btn-primary text-xs py-2 px-4">
            GO TO DASHBOARD <ArrowRight class="w-4 h-4 ml-1" />
          </a>
        {:else}
          <a href="/login" class="brutal-btn brutal-btn-primary text-xs py-2 px-4">
            LOGIN WITH GOOGLE
          </a>
        {/if}
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-flex items-center gap-2 border-2 border-black bg-yellow-300 px-3 py-1 font-bold text-xs uppercase shadow-[3px_3px_0px_#000]">
          <Terminal class="w-4 h-4" /> NO AI SLOP. REAL STRUCTURED DATA.
        </div>

        <h1 class="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.05]">
          BUILD A CV.<br />
          <span class="bg-black text-white px-2">MAKE IT READABLE</span><br />
          FOR THE ATS.
        </h1>

        <p class="text-lg text-slate-800 font-medium max-w-xl leading-relaxed">
          Create structured, ATS-friendly resumes without fighting complicated editors. Built-in Job Description keyword matcher to ensure zero missed requirements.
        </p>

        <div class="flex flex-wrap gap-4 pt-2">
          {#if data?.user}
            <a href="/dashboard" class="brutal-btn brutal-btn-accent text-base py-3 px-6">
              CREATE YOUR CV NOW <ArrowRight class="w-5 h-5 ml-2" />
            </a>
          {:else}
            <a href="/auth/google" class="brutal-btn brutal-btn-accent text-base py-3 px-6">
              START BUILDING FREE <ArrowRight class="w-5 h-5 ml-2" />
            </a>
          {/if}
          <a href="#how-it-works" class="brutal-btn text-base py-3 px-6">
            HOW IT WORKS
          </a>
        </div>
      </div>

      <!-- Preview Mockup Card -->
      <div class="lg:col-span-5">
        <div class="brutal-card p-6 bg-white relative">
          <div class="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full border border-black bg-red-400"></div>
              <div class="w-3 h-3 rounded-full border border-black bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full border border-black bg-green-400"></div>
            </div>
            <span class="font-mono text-xs font-bold text-slate-500">ATS_SCAN_PREVIEW.V1</span>
          </div>

          <div class="space-y-4 font-mono text-xs">
            <div class="border-2 border-black p-3 bg-slate-50">
              <span class="text-slate-500 font-bold">// MATCHED_KEYWORDS</span>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span class="bg-emerald-100 text-emerald-900 border border-black px-1.5 py-0.5 font-bold">✓ TypeScript</span>
                <span class="bg-emerald-100 text-emerald-900 border border-black px-1.5 py-0.5 font-bold">✓ Node.js</span>
                <span class="bg-emerald-100 text-emerald-900 border border-black px-1.5 py-0.5 font-bold">✓ MongoDB</span>
                <span class="bg-emerald-100 text-emerald-900 border border-black px-1.5 py-0.5 font-bold">✓ Docker</span>
              </div>
            </div>

            <div class="border-2 border-black p-3 bg-red-50">
              <span class="text-slate-500 font-bold">// MISSING_IN_CV</span>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span class="bg-rose-100 text-rose-900 border border-black px-1.5 py-0.5 font-bold">× GraphQL</span>
                <span class="bg-rose-100 text-rose-900 border border-black px-1.5 py-0.5 font-bold">× Kubernetes</span>
              </div>
            </div>

            <div class="border-t-2 border-black pt-3 flex justify-between items-center text-sm font-bold">
              <span>SCORE MATCH:</span>
              <span class="text-emerald-700 bg-emerald-100 border border-black px-2 py-0.5 font-black text-base">82%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Pillars -->
    <div id="how-it-works" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
      <div class="brutal-card p-6 bg-white">
        <div class="w-10 h-10 border-2 border-black bg-yellow-300 flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_#000]">
          1
        </div>
        <h3 class="font-black text-lg uppercase mb-2">STRUCTURED DATA</h3>
        <p class="text-sm text-slate-700 font-medium">
          Fill your experience once. Switch between clean ATS templates seamlessly without re-typing.
        </p>
      </div>

      <div class="brutal-card p-6 bg-white">
        <div class="w-10 h-10 border-2 border-black bg-blue-300 flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_#000]">
          2
        </div>
        <h3 class="font-black text-lg uppercase mb-2">DETERMINISTIC ATS ANALYZER</h3>
        <p class="text-sm text-slate-700 font-medium">
          Paste the target Job Description. Compare technical keywords directly with your CV before sending.
        </p>
      </div>

      <div class="brutal-card p-6 bg-white">
        <div class="w-10 h-10 border-2 border-black bg-emerald-300 flex items-center justify-center font-black mb-4 shadow-[2px_2px_0px_#000]">
          3
        </div>
        <h3 class="font-black text-lg uppercase mb-2">CLEAN PDF EXPORT</h3>
        <p class="text-sm text-slate-700 font-medium">
          Generate selectable, standard A4 PDF files. No screenshots, no weird multi-column glitches in ATS scanners.
        </p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t-4 border-black bg-white px-6 py-8">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
      <div class="flex items-center gap-2">
        <span>© 2026 CVFORGE</span>
        <span>•</span>
        <span class="text-slate-500">BUILT WITH SVELTEKIT & BUN</span>
      </div>
      <div class="text-slate-500">
        A serious developer tool for building serious resumes.
      </div>
    </div>
  </footer>
</div>
