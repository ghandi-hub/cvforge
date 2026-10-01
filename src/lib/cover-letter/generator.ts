import type { CVData } from '$lib/types/cv';

export interface CoverLetterInput {
  cvData: CVData;
  recipientName?: string;
  companyName?: string;
  companyLocation?: string;
  jobTitle?: string;
  letterDate?: string;
  tone?: 'formal-id' | 'modern-id' | 'professional-en';
  jobDescription?: string;
}

export function generateCoverLetterText(input: CoverLetterInput): string {
  const {
    cvData,
    recipientName = 'Hiring Manager',
    companyName = 'Nama Perusahaan',
    companyLocation = '',
    jobTitle = '',
    tone = 'formal-id',
    jobDescription = ''
  } = input;

  const candidateName = cvData.basics.name || 'Pelamar';
  const headline = cvData.basics.headline || '';
  const targetRole = jobTitle.trim() || headline || 'posisi yang relevan';
  const targetCompany = companyName.trim() || 'perusahaan Bapak/Ibu';

  // Ambil pengalaman kerja terbaru
  const latestExp = cvData.experience && cvData.experience.length > 0 ? cvData.experience[0] : null;

  // Kumpulkan keahlian utama
  const allSkills = cvData.skills?.flatMap((s) => s.skills) || [];
  const topSkills = allSkills.slice(0, 6);
  const skillsTextId = topSkills.length > 0 ? topSkills.join(', ') : 'pengembangan perangkat lunak dan analisis teknis';
  const skillsTextEn = topSkills.length > 0 ? topSkills.join(', ') : 'software engineering and technical problem solving';

  // Proyek relevan
  const topProject = cvData.projects && cvData.projects.length > 0 ? cvData.projects[0] : null;

  if (tone === 'modern-id') {
    // Gaya Modern / Startup / Agresif & Percaya Diri
    const opening = `Halo ${recipientName || 'Tim Rekrutmen'} & Tim ${targetCompany},

Saya menulis surat ini untuk menyatakan antusiasme besar saya melamar posisi ${targetRole} di ${targetCompany}. Mengikuti perkembangan produk dan inovasi yang dibangun oleh ${targetCompany}, saya sangat terinspirasi oleh dampak nyata yang dihasilkan bagi para penggunanya, dan saya bersemangat untuk membawa keahlian saya ke dalam tim Anda.`;

    const experienceParagraph = latestExp
      ? `Selama berkarier sebagai ${latestExp.position} di ${latestExp.company}, fokus utama saya adalah membangun solusi yang scalable, andal, dan efisien. ${
          latestExp.description
            ? `Saya ${latestExp.description}`
            : 'Saya terbiasa bekerja dalam lingkungan agile yang dinamis dan berorientasi pada pencapaian target bisnis yang terukur.'
        }${
          latestExp.achievements && latestExp.achievements.length > 0
            ? ` Salah satu pencapaian yang membanggakan adalah ${latestExp.achievements[0]}.`
            : ''
        }`
      : `Saya memiliki pola pikir solutif, daya adaptasi yang tinggi terhadap teknologi baru, serta komitmen kuat untuk mengeksekusi inisiatif produk dengan kualitas terbaik.`;

    const skillsParagraph = `Keahlian inti saya mencakup ${skillsTextId}.${
      topProject
        ? ` Pada proyek "${topProject.name}", saya ${topProject.description || 'berhasil mengimplementasikan solusi teknis yang meningkatkan efisiensi dan pengalaman pengguna'}.`
        : ''
    } Dengan kombinasi pemahaman teknis yang mendalam dan orientasi pada kebutuhan pengguna, saya yakin dapat langsung memberikan kontribusi aktif sejak hari pertama di ${targetCompany}.`;

    const closing = `Saya sangat menyambut kesempatan untuk mendiskusikan lebih lanjut bagaimana kompetensi dan energi saya dapat membantu ${targetCompany} mencapai milestone berikutnya.

Terima kasih banyak atas waktu dan pertimbangannya.

Salam hangat,
${candidateName}`;

    return `${opening}\n\n${experienceParagraph}\n\n${skillsParagraph}\n\n${closing}`;
  }

  if (tone === 'professional-en') {
    // Gaya Professional English (Global ATS Standard)
    const opening = `Dear ${recipientName || 'Hiring Team'},

I am writing to express my strong interest in the ${targetRole} position at ${targetCompany}. With a proven track record in ${
      headline || 'technology and engineering'
    }, along with hands-on experience delivering reliable, high-impact solutions, I am eager to contribute to ${targetCompany}'s ongoing success.`;

    const experienceParagraph = latestExp
      ? `In my previous role as ${latestExp.position} at ${latestExp.company}, I ${
          latestExp.description
            ? latestExp.description
            : 'led and contributed to key initiatives, optimizing system workflows and collaborating cross-functionally to achieve measurable results.'
        }${
          latestExp.achievements && latestExp.achievements.length > 0
            ? ` Notably, I successfully ${latestExp.achievements[0]}.`
            : ''
        }`
      : `Throughout my professional journey, I have cultivated a strong foundation in rapid problem-solving, architectural consistency, and collaborative project execution.`;

    const skillsParagraph = `My core technical competencies include ${skillsTextEn}.${
      topProject
        ? ` Furthermore, on projects such as "${topProject.name}", I ${topProject.description || 'engineered robust architectures that solved critical operational challenges'}.`
        : ''
    } I am deeply drawn to ${targetCompany}'s mission and engineering standards, and I am confident that my technical expertise and proactive approach make me a strong fit for your team.`;

    const closing = `I would welcome the opportunity to discuss in greater detail how my qualifications and passion align with the strategic goals of ${targetCompany}. Thank you for your time and thoughtful consideration.

Sincerely,
${candidateName}`;

    return `${opening}\n\n${experienceParagraph}\n\n${skillsParagraph}\n\n${closing}`;
  }

  // Default: 'formal-id' (Bahasa Indonesia Formal & Profesional)
  const opening = `Dengan hormat,

Sehubungan dengan informasi lowongan pekerjaan yang saya peroleh mengenai posisi ${targetRole} di ${targetCompany}, melalui surat ini saya bermaksud mengajukan diri untuk bergabung dengan tim profesional di perusahaan yang Bapak/Ibu pimpin. ${
    cvData.summary
      ? cvData.summary
      : `Dengan latar belakang dan dedikasi saya di bidang ${headline || targetRole}, saya meyakini bahwa kompetensi yang saya miliki selaras dengan kualifikasi yang dibutuhkan oleh ${targetCompany}.`
  }`;

  const experienceParagraph = latestExp
    ? `Selama menjalankan peran sebagai ${latestExp.position} di ${latestExp.company}, saya bertanggung jawab dalam ${
        latestExp.description
          ? latestExp.description
          : 'pengembangan sistem serta pengelolaan alur kerja operasional secara efektif.'
      }${
        latestExp.achievements && latestExp.achievements.length > 0
          ? ` Di samping itu, saya berhasil ${latestExp.achievements[0]}.`
          : ''
      } Pengalaman ini telah memperkuat kapasitas saya dalam memecahkan masalah kompleks, berpikir kritis, serta berkolaborasi secara produktif lintas divisi.`
    : `Saya senantiasa berkomitmen untuk mempertahankan standar kualitas kerja yang tinggi, cepat beradaptasi dengan alur kerja baru, serta berdedikasi penuh dalam menyelesaikan setiap target yang diamanatkan.`;

  const skillsParagraph = `Adapun penguasaan teknis dan keahlian utama saya meliputi ${skillsTextId}.${
    topProject
      ? ` Keahlian tersebut juga telah saya terapkan secara praktis, antara lain melalui proyek "${topProject.name}", di mana saya ${topProject.description || 'merancang dan mengimplementasikan solusi yang terstruktur'}.`
      : ''
  } Saya percaya bahwa kombinasi antara keahlian teknis, integritas, dan antusiasme belajar yang berkelanjutan akan memungkinkan saya memberikan nilai tambah yang signifikan bagi kemajuan ${targetCompany}.`;

  const closing = `Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara, agar saya dapat menguraikan lebih lanjut mengenai latar belakang pengalaman dan bagaimana saya dapat berkontribusi secara konkret bagi perkembangan ${targetCompany}. Terlampir berkas Curriculum Vitae (CV) saya sebagai bahan pertimbangan Bapak/Ibu.

Demikian surat lamaran ini saya sampaikan. Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih.

Hormat saya,
${candidateName}`;

  return `${opening}\n\n${experienceParagraph}\n\n${skillsParagraph}\n\n${closing}`;
}
