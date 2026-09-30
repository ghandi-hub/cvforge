<script lang="ts">
  import { onMount } from 'svelte';
  import type { CVData, SectionType } from '$lib/types/cv';
  import AtsClassic from './templates/AtsClassic.svelte';
  import AtsModern from './templates/AtsModern.svelte';
  import AtsBrutalist from './templates/AtsBrutalist.svelte';

  let {
    data,
    template = 'ats-classic',
    sectionOrder = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
    staticSize = false
  }: {
    data: CVData;
    template?: string;
    sectionOrder?: SectionType[];
    /** true = render pada ukuran A4 asli tanpa penskalaan (dipakai untuk salinan cetak) */
    staticSize?: boolean;
  } = $props();

  // A4 dokumen lebar = 794px (210mm @96dpi)
  const A4_WIDTH = 794;

  let wrapperEl: HTMLDivElement;
  let docEl: HTMLDivElement;
  let scale = $state(1);
  let docHeight = $state(1123); // A4 height default

  function updateScale() {
    if (staticSize) return;
    if (!wrapperEl || !docEl) return;
    const avail = wrapperEl.clientWidth - 32; // padding kiri-kanan
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

  // Re-scale saat konten/template berubah
  $effect(() => {
    void data;
    void template;
    void sectionOrder;
    if (staticSize) return;
    requestAnimationFrame(() => updateScale());
  });
</script>

{#snippet cvDocument()}
  {#if template === 'ats-classic'}
    <AtsClassic {data} {sectionOrder} />
  {:else if template === 'ats-modern'}
    <AtsModern {data} {sectionOrder} />
  {:else if template === 'ats-brutalist'}
    <AtsBrutalist {data} {sectionOrder} />
  {:else}
    <AtsClassic {data} {sectionOrder} />
  {/if}
{/snippet}

{#if staticSize}
  <!-- Salinan khusus cetak: ukuran A4 asli, tanpa penskalaan -->
  <div class="cv-preview-wrapper w-full bg-white">
    <div class="cv-print-area mx-auto bg-white">
      {@render cvDocument()}
    </div>
  </div>
{:else}
  <div
    class="cv-preview-wrapper w-full overflow-x-hidden p-4 bg-slate-200/50"
    bind:this={wrapperEl}
  >
    <!-- Kanvas A4 yang diskalakan proporsional sesuai lebar layar -->
    <div
      class="relative mx-auto shadow-2xl border border-slate-300 bg-white"
      style="width: {A4_WIDTH * scale}px; height: {docHeight * scale}px;"
    >
      <div
        class="cv-print-area absolute top-0 left-0"
        style="width: {A4_WIDTH}px; transform: scale({scale}); transform-origin: top left;"
        bind:this={docEl}
      >
        {@render cvDocument()}
      </div>
    </div>
  </div>
{/if}