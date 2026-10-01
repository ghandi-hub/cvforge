<script lang="ts">
  import { onMount } from 'svelte';
  import type { CVData, CoverLetter } from '$lib/types/cv';

  let {
    cvData,
    coverLetter,
    template = 'ats-classic',
    staticSize = false
  }: {
    cvData: CVData;
    coverLetter: CoverLetter;
    template?: string;
    staticSize?: boolean;
  } = $props();

  const A4_WIDTH = 794;

  let wrapperEl: HTMLDivElement;
  let docEl: HTMLDivElement;
  let scale = $state(1);
  let docHeight = $state(1123);

  function updateScale() {
    if (staticSize) return;
    if (!wrapperEl || !docEl) return;
    const avail = wrapperEl.clientWidth - 32;
    if (avail <= 0) return;
    const s = Math.min(1, avail / A4_WIDTH);
    scale = s > 0 ? s : 1;
    docHeight = docEl.scrollHeight || 1123;
  }

  onMount(() => {
    if (staticSize) return;
    updateScale();
    const roWrapper = new ResizeObserver(() => updateScale());
    const roDoc = new ResizeObserver(() => updateScale());
    roWrapper.observe(wrapperEl);
    roDoc.observe(docEl);
    return () => {
      roWrapper.disconnect();
      roDoc.disconnect();
    };
  });

  $effect(() => {
    void cvData;
    void coverLetter;
    void template;
    if (staticSize) return;
    requestAnimationFrame(() => updateScale());
  });

  function getDisplayDate() {
    if (coverLetter.letterDate) return coverLetter.letterDate;
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
</script>

{#snippet classicLetter()}
  <div class="bg-white p-12 text-slate-900 font-serif leading-relaxed min-h-[1123px]">
    <!-- Header Kontak Pengirim -->
    <header class="border-b-2 border-black pb-4 mb-6 text-center">
      <h1 class="text-2xl font-bold tracking-wide uppercase">
        {cvData.basics.name || 'NAMA LENGKAP'}
      </h1>
      {#if cvData.basics.headline}
        <p class="text-xs uppercase tracking-widest text-slate-600 mt-0.5">
          {cvData.basics.headline}
        </p>
      {/if}
      <div class="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 mt-2">
        {#if cvData.basics.email}<span>{cvData.basics.email}</span>{/if}
        {#if cvData.basics.phone}<span>•</span><span>{cvData.basics.phone}</span>{/if}
        {#if cvData.basics.location}<span>•</span><span>{cvData.basics.location}</span>{/if}
        {#if cvData.basics.linkedin}<span>•</span><span>{cvData.basics.linkedin}</span>{/if}
      </div>
    </header>

    <!-- Tanggal & Penerima -->
    <div class="text-[12px] mb-6 flex justify-between items-start">
      <div class="space-y-0.5">
        <p class="text-slate-500 text-[11px]">Kepada Yth.</p>
        <p class="font-bold">{coverLetter.recipientName || 'Hiring Manager'}</p>
        <p class="font-semibold text-slate-800">{coverLetter.companyName || '[Nama Perusahaan]'}</p>
        {#if coverLetter.companyLocation}
          <p class="text-slate-600">{coverLetter.companyLocation}</p>
        {/if}
      </div>
      <div class="text-right text-slate-600 text-[11px]">
        {getDisplayDate()}
      </div>
    </div>

    <!-- Perihal -->
    <div class="mb-5 pb-2 border-b border-slate-200">
      <span class="font-bold text-xs uppercase tracking-wide">
        Hal: Lamaran Pekerjaan — {coverLetter.jobTitle || cvData.basics.headline || '[Posisi Pekerjaan]'}
      </span>
    </div>

    <!-- Isi Surat -->
    <main class="text-[12px] leading-relaxed text-justify space-y-4 whitespace-pre-line text-slate-800">
      {#if coverLetter.content}
        {coverLetter.content}
      {:else}
        <p class="italic text-slate-400">
          Isi surat lamaran masih kosong. Gunakan tombol "GENERATE DARI DATA CV" di panel editor untuk menghasilkan surat lamaran otomatis.
        </p>
      {/if}
    </main>

    <!-- Tanda Tangan / Penutup -->
    <footer class="mt-10 pt-4 text-[12px] space-y-12">
      <div>
        <p>Hormat saya,</p>
      </div>
      <div>
        <p class="font-bold border-t border-slate-300 pt-1 inline-block min-w-[160px]">
          {cvData.basics.name || 'Nama Pelamar'}
        </p>
      </div>
    </footer>
  </div>
{/snippet}

{#snippet modernLetter()}
  <div class="bg-white p-12 text-slate-900 font-sans leading-relaxed min-h-[1123px]">
    <!-- Modern Header -->
    <header class="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900 uppercase">
          {cvData.basics.name || 'NAMA LENGKAP'}
        </h1>
        <p class="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
          {cvData.basics.headline || 'PROFESIONAL'}
        </p>
      </div>
      <div class="text-right text-[11px] text-slate-600 space-y-0.5 font-medium">
        {#if cvData.basics.email}<p>{cvData.basics.email}</p>{/if}
        {#if cvData.basics.phone}<p>{cvData.basics.phone}</p>{/if}
        {#if cvData.basics.location}<p>{cvData.basics.location}</p>{/if}
      </div>
    </header>

    <!-- Metadata Row -->
    <div class="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 border border-slate-200">
      <div>
        <span class="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">DITUJUKAN KEPADA:</span>
        <p class="font-bold text-xs text-slate-900">{coverLetter.recipientName || 'Hiring Manager'}</p>
        <p class="text-xs font-semibold text-slate-700">{coverLetter.companyName || '[Nama Perusahaan]'}</p>
        {#if coverLetter.companyLocation}
          <p class="text-[11px] text-slate-500">{coverLetter.companyLocation}</p>
        {/if}
      </div>
      <div class="text-right">
        <span class="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">TANGGAL & POSISI:</span>
        <p class="text-xs font-bold text-slate-900">{getDisplayDate()}</p>
        <span class="inline-block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 mt-1 uppercase">
          {coverLetter.jobTitle || cvData.basics.headline || 'PELAMAR'}
        </span>
      </div>
    </div>

    <!-- Isi Surat -->
    <main class="text-[12px] leading-relaxed text-slate-700 space-y-4 whitespace-pre-line">
      {#if coverLetter.content}
        {coverLetter.content}
      {:else}
        <p class="italic text-slate-400">
          Isi surat lamaran masih kosong. Klik tombol "GENERATE DARI DATA CV" untuk membuat surat secara otomatis.
        </p>
      {/if}
    </main>

    <!-- Penutup Modern -->
    <footer class="mt-10 pt-4 text-[12px] flex justify-between items-end border-t border-slate-200">
      <div>
        <p class="text-slate-500 text-[11px] mb-1">Salam hangat,</p>
        <p class="font-black text-sm text-slate-900">{cvData.basics.name || 'Nama Pelamar'}</p>
        {#if cvData.basics.headline}
          <p class="text-[10px] text-slate-500 font-semibold">{cvData.basics.headline}</p>
        {/if}
      </div>
      <div class="text-[10px] font-mono text-slate-400">
        CVFORGE // COVER LETTER
      </div>
    </footer>
  </div>
{/snippet}

{#snippet brutalistLetter()}
  <div class="bg-white p-10 text-black font-sans leading-relaxed min-h-[1123px] border-4 border-black">
    <!-- Brutalist Header Box -->
    <header class="border-4 border-black bg-yellow-300 p-4 shadow-[4px_4px_0px_#000] mb-6">
      <div class="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 class="text-2xl font-black uppercase tracking-tight">
            {cvData.basics.name || 'NAMA LENGKAP'}
          </h1>
          <span class="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 mt-1 inline-block uppercase">
            {cvData.basics.headline || 'PROFESIONAL'}
          </span>
        </div>
        <div class="text-right font-mono text-[10px] font-bold space-y-0.5">
          {#if cvData.basics.email}<p>{cvData.basics.email}</p>{/if}
          {#if cvData.basics.phone}<p>{cvData.basics.phone}</p>{/if}
          {#if cvData.basics.location}<p>{cvData.basics.location}</p>{/if}
        </div>
      </div>
    </header>

    <!-- Recipient & Meta Section -->
    <div class="border-2 border-black p-3 bg-slate-100 shadow-[3px_3px_0px_#000] mb-6 grid grid-cols-2 gap-3 text-xs">
      <div>
        <span class="font-mono font-black text-[10px] text-slate-500 block mb-0.5">// PENERIMA</span>
        <p class="font-black">{coverLetter.recipientName || 'Hiring Manager'}</p>
        <p class="font-bold text-slate-800">{coverLetter.companyName || '[Nama Perusahaan]'}</p>
        {#if coverLetter.companyLocation}
          <p class="font-mono text-[11px] text-slate-600">{coverLetter.companyLocation}</p>
        {/if}
      </div>
      <div class="text-right">
        <span class="font-mono font-black text-[10px] text-slate-500 block mb-0.5">// TANGGAL & ROLE</span>
        <p class="font-mono font-bold">{getDisplayDate()}</p>
        <span class="inline-block bg-black text-white font-mono text-[10px] font-bold px-2 py-0.5 mt-1 uppercase">
          ROLE: {coverLetter.jobTitle || cvData.basics.headline || 'UMUM'}
        </span>
      </div>
    </div>

    <!-- Isi Surat -->
    <main class="text-[12px] leading-relaxed text-black space-y-4 whitespace-pre-line font-medium border-l-4 border-black pl-4 my-6">
      {#if coverLetter.content}
        {coverLetter.content}
      {:else}
        <p class="italic text-slate-500">
          Isi surat lamaran masih kosong. Gunakan fitur "GENERATE DARI DATA CV" di panel sebelah kiri.
        </p>
      {/if}
    </main>

    <!-- Sign-off Brutalist -->
    <footer class="mt-8 pt-4 border-t-2 border-black flex justify-between items-center text-xs">
      <div>
        <p class="font-mono text-[10px] font-bold text-slate-500">// PENGIRIM</p>
        <p class="font-black text-sm">{cvData.basics.name || 'Nama Pelamar'}</p>
      </div>
      <div class="border-2 border-black px-3 py-1 font-mono text-[10px] font-black bg-white shadow-[2px_2px_0px_#000]">
        STATUS: RESMI
      </div>
    </footer>
  </div>
{/snippet}

{#snippet renderContent()}
  {#if template === 'ats-classic'}
    {@render classicLetter()}
  {:else if template === 'ats-modern'}
    {@render modernLetter()}
  {:else if template === 'ats-brutalist'}
    {@render brutalistLetter()}
  {:else}
    {@render classicLetter()}
  {/if}
{/snippet}

{#if staticSize}
  <!-- Salinan khusus cetak: A4 asli tanpa skala -->
  <div class="cl-preview-wrapper w-full bg-white">
    <div class="cl-print-area mx-auto bg-white">
      {@render renderContent()}
    </div>
  </div>
{:else}
  <!-- Pratinjau di layar berskala responsif -->
  <div
    class="cl-preview-wrapper w-full overflow-x-hidden p-4 bg-slate-200/50"
    bind:this={wrapperEl}
  >
    <div
      class="relative mx-auto shadow-2xl border border-slate-300 bg-white"
      style="width: {A4_WIDTH * scale}px; height: {docHeight * scale}px;"
    >
      <div
        class="cl-print-area absolute top-0 left-0"
        style="width: {A4_WIDTH}px; transform: scale({scale}); transform-origin: top left;"
        bind:this={docEl}
      >
        {@render renderContent()}
      </div>
    </div>
  </div>
{/if}
