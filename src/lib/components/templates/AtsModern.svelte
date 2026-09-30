<script lang="ts">
  import type { CVData, SectionType } from '$lib/types/cv';

  let { data, sectionOrder }: { data: CVData; sectionOrder: SectionType[] } = $props();

  const b = $derived(data.basics || {});
</script>

<div class="ats-modern font-sans text-[10.5pt] leading-relaxed text-slate-900 bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm]">
  <!-- Header -->
  <header class="border-b border-slate-200 pb-4 mb-4">
    <h1 class="text-2xl font-extrabold tracking-tight text-slate-950">{b.name || 'YOUR NAME'}</h1>
    {#if b.headline}
      <p class="text-sm font-medium text-blue-700 mt-0.5">{b.headline}</p>
    {/if}
    <div class="text-xs flex flex-wrap gap-x-3 gap-y-1 text-slate-500 mt-2">
      {#if b.location}<span>{b.location}</span>{/if}
      {#if b.phone}<span>• {b.phone}</span>{/if}
      {#if b.email}<span>• <a href="mailto:{b.email}" class="text-slate-800 hover:underline">{b.email}</a></span>{/if}
      {#if b.linkedin}<span>• <a href={b.linkedin} target="_blank" class="text-slate-800 hover:underline">LinkedIn</a></span>{/if}
      {#if b.github}<span>• <a href={b.github} target="_blank" class="text-slate-800 hover:underline">GitHub</a></span>{/if}
      {#if b.website}<span>• <a href={b.website} target="_blank" class="text-slate-800 hover:underline">{b.website}</a></span>{/if}
    </div>
  </header>

  <!-- Summary -->
  {#if data.summary}
    <section class="mb-4">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Summary</h2>
      <p class="text-xs text-slate-700 leading-normal">{data.summary}</p>
    </section>
  {/if}

  <!-- Dynamic Sections -->
  {#each sectionOrder as section}
    {#if section === 'experience' && data.experience && data.experience.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Experience</h2>
        <div class="space-y-3">
          {#each data.experience as exp}
            <div>
              <div class="flex justify-between items-baseline text-xs">
                <span class="font-bold text-slate-950">{exp.position}</span>
                <span class="text-slate-500 text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div class="text-xs font-medium text-slate-700 mb-1">{exp.company} {#if exp.location}• <span class="text-slate-500">{exp.location}</span>{/if}</div>
              {#if exp.description}
                <p class="text-xs text-slate-600 mb-1">{exp.description}</p>
              {/if}
              {#if exp.achievements && exp.achievements.length > 0}
                <ul class="list-disc list-inside text-xs text-slate-700 space-y-0.5">
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
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Technical Skills</h2>
        <div class="text-xs space-y-1">
          {#each data.skills as cat}
            <div>
              <span class="font-bold text-slate-900">{cat.category}: </span>
              <span class="text-slate-700">{cat.skills.join(', ')}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'projects' && data.projects && data.projects.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Key Projects</h2>
        <div class="space-y-2">
          {#each data.projects as proj}
            <div>
              <div class="flex justify-between items-baseline text-xs">
                <span class="font-bold text-slate-950">{proj.name}</span>
                <div class="space-x-2 text-[10px] text-blue-700">
                  {#if proj.url}<a href={proj.url} target="_blank" class="hover:underline">Demo</a>{/if}
                  {#if proj.repoUrl}<a href={proj.repoUrl} target="_blank" class="hover:underline">Code</a>{/if}
                </div>
              </div>
              {#if proj.technologies && proj.technologies.length > 0}
                <div class="text-[11px] text-slate-500 mb-0.5">Tech: {proj.technologies.join(', ')}</div>
              {/if}
              {#if proj.description}
                <p class="text-xs text-slate-700">{proj.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'education' && data.education && data.education.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Education</h2>
        <div class="space-y-2">
          {#each data.education as edu}
            <div>
              <div class="flex justify-between items-baseline text-xs font-bold text-slate-950">
                <span>{edu.institution}</span>
                <span class="text-slate-500 font-normal text-[11px]">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div class="text-xs text-slate-700">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
              {#if edu.description}
                <p class="text-xs text-slate-600 mt-0.5">{edu.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'certifications' && data.certifications && data.certifications.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">Certifications</h2>
        <div class="space-y-1 text-xs">
          {#each data.certifications as cert}
            <div class="flex justify-between">
              <span><strong class="font-bold text-slate-900">{cert.name}</strong> • {cert.issuer}</span>
              <span class="text-slate-500 text-[11px]">{cert.date}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'languages' && data.languages && data.languages.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Languages</h2>
        <div class="text-xs flex flex-wrap gap-x-4 gap-y-1 text-slate-700">
          {#each data.languages as lang}
            <span><strong class="text-slate-900">{lang.language}</strong> ({lang.proficiency})</span>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
