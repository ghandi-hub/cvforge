<script lang="ts">
  import type { CVData, SectionType } from '$lib/types/cv';
  import AtsClassic from './templates/AtsClassic.svelte';
  import AtsModern from './templates/AtsModern.svelte';
  import AtsBrutalist from './templates/AtsBrutalist.svelte';

  let {
    data,
    template = 'ats-classic',
    sectionOrder = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages']
  }: {
    data: CVData;
    template?: string;
    sectionOrder?: SectionType[];
  } = $props();
</script>

<div class="cv-preview-wrapper w-full overflow-x-auto p-4 flex justify-center bg-slate-200/50 min-h-[500px]">
  <div class="shadow-2xl border border-slate-300">
    {#if template === 'ats-classic'}
      <AtsClassic {data} {sectionOrder} />
    {:else if template === 'ats-modern'}
      <AtsModern {data} {sectionOrder} />
    {:else if template === 'ats-brutalist'}
      <AtsBrutalist {data} {sectionOrder} />
    {:else}
      <AtsClassic {data} {sectionOrder} />
    {/if}
  </div>
</div>
