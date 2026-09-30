<script lang="ts">
  import type { CVData, SectionType } from '$lib/types/cv';

  let { data, sectionOrder }: { data: CVData; sectionOrder: SectionType[] } = $props();

  const b = $derived(data.basics || {});
</script>

<div class="ats-classic font-serif text-[11pt] leading-normal text-black bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm]">
  <!-- Header -->
  <header class="text-center border-b-2 border-black pb-4 mb-4">
    <h1 class="text-2xl font-bold uppercase tracking-wider mb-1">{b.name || 'YOUR NAME'}</h1>
    {#if b.headline}
      <p class="text-sm font-semibold italic text-slate-800 mb-2">{b.headline}</p>
    {/if}
    <div class="text-xs flex flex-wrap justify-center gap-x-3 gap-y-1 text-slate-700">
      {#if b.location}<span>{b.location}</span>{/if}
      {#if b.phone}<span>• {b.phone}</span>{/if}
      {#if b.email}<span>• <a href="mailto:{b.email}" class="underline">{b.email}</a></span>{/if}
      {#if b.linkedin}<span>• <a href={b.linkedin} target="_blank" class="underline">LinkedIn</a></span>{/if}
      {#if b.github}<span>• <a href={b.github} target="_blank" class="underline">GitHub</a></span>{/if}
      {#if b.website}<span>• <a href={b.website} target="_blank" class="underline">{b.website}</a></span>{/if}
    </div>
  </header>

  <!-- Summary -->
  {#if data.summary}
    <section class="mb-4">
      <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">Professional Summary</h2>
      <p class="text-xs text-justify leading-relaxed">{data.summary}</p>
    </section>
  {/if}

  <!-- Dynamic Sections -->
  {#each sectionOrder as section}
    {#if section === 'experience' && data.experience && data.experience.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">Work Experience</h2>
        <div class="space-y-3">
          {#each data.experience as exp}
            <div>
              <div class="flex justify-between items-baseline text-xs font-bold">
                <span>{exp.position} <span class="font-normal italic">— {exp.company}</span></span>
                <span class="text-slate-700 font-normal">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {#if exp.location}
                <div class="text-[10px] text-slate-600 mb-1">{exp.location}</div>
              {/if}
              {#if exp.description}
                <p class="text-xs text-slate-800 mb-1">{exp.description}</p>
              {/if}
              {#if exp.achievements && exp.achievements.length > 0}
                <ul class="list-disc list-inside text-xs text-slate-800 space-y-0.5">
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

    {#if section === 'education' && data.education && data.education.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">Education</h2>
        <div class="space-y-2">
          {#each data.education as edu}
            <div>
              <div class="flex justify-between items-baseline text-xs font-bold">
                <span>{edu.institution}</span>
                <span class="text-slate-700 font-normal">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div class="text-xs italic text-slate-800">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
              {#if edu.description}
                <p class="text-xs text-slate-700 mt-0.5">{edu.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'skills' && data.skills && data.skills.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">Skills</h2>
        <div class="text-xs space-y-1">
          {#each data.skills as cat}
            <div>
              <span class="font-bold">{cat.category}: </span>
              <span class="text-slate-800">{cat.skills.join(', ')}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'projects' && data.projects && data.projects.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">Projects</h2>
        <div class="space-y-2">
          {#each data.projects as proj}
            <div>
              <div class="flex justify-between items-baseline text-xs font-bold">
                <span>{proj.name}</span>
                {#if proj.technologies && proj.technologies.length > 0}
                  <span class="text-slate-600 font-normal italic">({proj.technologies.join(', ')})</span>
                {/if}
              </div>
              {#if proj.description}
                <p class="text-xs text-slate-800 mt-0.5">{proj.description}</p>
              {/if}
              {#if proj.url || proj.repoUrl}
                <div class="text-[10px] space-x-2 text-slate-600 mt-0.5">
                  {#if proj.url}<a href={proj.url} target="_blank" class="underline">Demo</a>{/if}
                  {#if proj.repoUrl}<a href={proj.repoUrl} target="_blank" class="underline">Repository</a>{/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'certifications' && data.certifications && data.certifications.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">Certifications</h2>
        <div class="space-y-1.5 text-xs">
          {#each data.certifications as cert}
            <div class="flex justify-between">
              <span><strong class="font-bold">{cert.name}</strong> — {cert.issuer}</span>
              <span class="text-slate-700">{cert.date}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if section === 'languages' && data.languages && data.languages.length > 0}
      <section class="mb-4">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">Languages</h2>
        <div class="text-xs flex flex-wrap gap-x-4 gap-y-1">
          {#each data.languages as lang}
            <span><strong>{lang.language}</strong>: <span class="text-slate-700">{lang.proficiency}</span></span>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>
