export const DICTIONARY: Record<string, string[]> = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'r', 'dart', 'shell', 'bash'
  ],
  frameworks: [
    'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'vuejs',
    'nuxt', 'nuxtjs', 'svelte', 'sveltekit', 'angular', 'express', 'express.js',
    'nest', 'nestjs', 'fastapi', 'flask', 'django', 'spring', 'spring boot', 'laravel',
    'rails', 'ruby on rails', 'asp.net', 'tailwind', 'tailwindcss', 'bootstrap'
  ],
  databases: [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle',
    'cassandra', 'elasticsearch', 'dynamodb', 'mariadb', 'supabase', 'firebase'
  ],
  cloud_devops: [
    'docker', 'kubernetes', 'k8s', 'aws', 'amazon web services', 'gcp', 'google cloud',
    'azure', 'ci/cd', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'linux',
    'nginx', 'cloudflare', 'prometheus', 'grafana'
  ],
  concepts_tools: [
    'rest api', 'restful', 'graphql', 'grpc', 'microservices', 'websocket',
    'agile', 'scrum', 'kanban', 'git', 'unit test', 'tdd', 'jest', 'vitest', 'playwright',
    'kafka', 'rabbitmq', 'clean architecture', 'oop'
  ]
};

// Normalization mappings (e.g. "node js", "nodejs" -> "node.js")
export const CANONICAL_MAP: Record<string, string> = {
  'nodejs': 'node.js',
  'node js': 'node.js',
  'node.js': 'node.js',
  'reactjs': 'react',
  'react.js': 'react',
  'nextjs': 'next.js',
  'next js': 'next.js',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'golang': 'go',
  'postgres': 'postgresql',
  'k8s': 'kubernetes',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'tailwindcss': 'tailwind css',
  'tailwind': 'tailwind css',
  'restful api': 'rest api',
  'restful': 'rest api'
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\+#\/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalizeKeyword(kw: string): string {
  const norm = normalizeText(kw);
  return CANONICAL_MAP[norm] || norm;
}

export interface ATSAnalysisResult {
  foundKeywords: string[];
  missingKeywords: string[];
  scorePercentage: number;
  structureCheck: {
    hasContactInfo: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
  };
}

export function extractKeywordsFromJobDesc(jdText: string): string[] {
  const normalized = normalizeText(jdText);
  const keywordsSet = new Set<string>();

  // Check all dictionary items
  const allDict = Object.values(DICTIONARY).flat();
  for (const item of allDict) {
    // Regex matching with word boundaries
    const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|[.,;()\\/])${escaped}($|\\s|[.,;()\\/])`, 'i');
    if (regex.test(normalized)) {
      keywordsSet.add(canonicalizeKeyword(item));
    }
  }

  return Array.from(keywordsSet);
}

export function analyzeCVAgainstJD(cvText: string, jdText: string, cvStructure: any): ATSAnalysisResult {
  const jdKeywords = extractKeywordsFromJobDesc(jdText);
  const normalizedCV = normalizeText(cvText);

  const found: string[] = [];
  const missing: string[] = [];

  for (const kw of jdKeywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|[.,;()\\/])${escaped}($|\\s|[.,;()\\/])`, 'i');
    if (regex.test(normalizedCV)) {
      found.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const score = jdKeywords.length > 0
    ? Math.round((found.length / jdKeywords.length) * 100)
    : 100;

  const structureCheck = {
    hasContactInfo: Boolean(cvStructure?.basics?.email || cvStructure?.basics?.phone),
    hasSummary: Boolean(cvStructure?.summary?.trim()),
    hasExperience: Boolean(cvStructure?.experience?.length > 0),
    hasEducation: Boolean(cvStructure?.education?.length > 0),
    hasSkills: Boolean(cvStructure?.skills?.length > 0)
  };

  return {
    foundKeywords: found,
    missingKeywords: missing,
    scorePercentage: score,
    structureCheck
  };
}
