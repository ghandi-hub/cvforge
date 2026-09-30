<script lang="ts">
  import type { CVData, SectionType } from '$lib/types/cv';

  let { data, sectionOrder }: { data: CVData; sectionOrder: SectionType[] } = $props();

  const b = $derived(data.basics || {});
</script>

<div class="ats-brutalist font-mono text-[10pt] leading-normal text-black bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm]">
  <!-- Header -->
  <header class="border-4 border-black p-4 mb-4 bg-yellow-300 shadow-[4px_4px_0px_#000]">
    <h1 class="text-2xl font-black uppercase tracking-wider">{b.name || 'YOUR NAME'}</h1>
    {#if b.headline}
      <div class="inline-block bg-black text-white px-2 py-0.5 text-xs font-bold mt-1 uppercase">{b.headline}</div>
    {/if}
    <div class="text-[10px] font-bold flex flex-wrap gap-x-3 gap-y-1 mt-2 text-black border-t-2 border-black pt-2">
      {#if b.location}<span>LOC: {b.location}</span>{/if}
      {#if b.phone}<span>TEL: {b.phone}</span>{/if}
      {#if b.email}<span>EML: {b.email}</span>{/if}
      {#if b.linkedin}<span>LI: {b.linkedin}</span>{/if}
      {#if b.github}<span>GH: {b.github}</span>{/if}
      {#if b.website}<span>WEB: {b.website}</span>{/if}
    </div>
  </header>

  <!-- Summary -->
  {#if data.summary}
    <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
      <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-1.5">[ PROFILE_SUMMARY ]</h2>
      <p class="text-xs text-justify">{data.summary}</p>
    </section>
  {/if}

  <!-- Dynamic Sections -->
  {#each sectionOrder as section}
    {#if section === 'experience' && data.experience && data.experience.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-2">[ EXPERIENCE ]</h2>
        <div class="space-y-3">
          {#each data.experience as exp}
            <div class="border-l-2 border-black pl-2">
              <div class="flex justify-between items-baseline text-xs font-black">
                <span>{exp.position} // {exp.company}</span>
                <span class="text-[10px] bg-slate-200 px-1 border border-black">{exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}</span>
              </div>
              {#if exp.location}
                <div class="text-[10px] text-slate-700">@ {exp.location}</div>
              {/if}
              {#if exp.description}
                <p class="text-xs text-slate-900 mt-1">{exp.description}</p>
              {/if}
              {#if exp.achievements && exp.achievements.length > 0}
                <ul class="list-disc list-inside text-xs space-y-0.5 mt-1">
                  {#each exp.achievements as ach}
                    <li>{ach}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'skills' && data.skills && data.skills.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-1.5">[ SKILLS_MATRIX ]</h2>
        <div class="text-xs space-y-1">
          {#each data.skills as cat}
            <div>
              <span class="font-bold underline">{cat.category}:</span>
              <span> {cat.skills.join(' • ')}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'projects' && data.projects && data.projects.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-2">[ PROJECTS ]</h2>
        <div class="space-y-2">
          {#each data.projects as proj}
            <div class="border-l-2 border-black pl-2">
              <div class="flex justify-between items-baseline text-xs font-black">
                <span>{proj.name}</span>
                {#if proj.technologies && proj.technologies.length > 0}
                  <span class="text-[10px] font-normal">[{proj.technologies.join(', ')}]</span>
                {/if}
              </div>
              {#if proj.description}
                <p class="text-xs mt-0.5">{proj.description}</p>
              {/if}
              {#if proj.url || proj.repoUrl}
                <div class="text-[10px] space-x-2 mt-0.5">
                  {#if proj.url}<a href={proj.url} target="_blank" class="underline font-bold">LINK</a>{/if}
                  {#if proj.repoUrl}<a href={proj.repoUrl} target="_blank" class="underline font-bold">REPO</a>{/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'education' && data.education && data.education.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-2">[ EDUCATION ]</h2>
        <div class="space-y-2">
          {#each data.education as edu}
            <div class="border-l-2 border-black pl-2">
              <div class="flex justify-between items-baseline text-xs font-black">
                <span>{edu.institution}</span>
                <span class="text-[10px] bg-slate-200 px-1 border border-black">{edu.startYear} - {edu.endYear}</span>
              </div>
              <div class="text-xs">{edu.degree} // {edu.field}</div>
              {#if edu.description}
                <p class="text-xs text-slate-800 mt-0.5">{edu.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'certifications' && data.certifications && data.certifications.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-2">[ CERTIFICATIONS ]</h2>
        <div class="space-y-1 text-xs">
          {#each data.certifications as cert}
            <div class="flex justify-between">
              <span><strong>{cert.name}</strong> / {cert.issuer}</span>
              <span class="text-[10px] font-bold">{cert.date}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'languages' && data.languages && data.languages.length > 0}
      <section class="border-2 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
        <h2 class="text-xs font-black uppercase tracking-widest bg-black text-white inline-block px-1.5 py-0.5 mb-1.5">[ LANGUAGES ]</h2>
        <div class="text-xs flex flex-wrap gap-x-4 gap-y-1">
          {#each data.languages as lang}
            <span><strong>{lang.language}</strong>: {lang.proficiency}</span>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
