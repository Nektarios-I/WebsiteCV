/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    🎨 SITE CONFIGURATION — EDIT ME! 🎨
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This is the SINGLE FILE where you configure ALL your personal information.
 * Everything you see on your portfolio website comes from this file.
 *
 * HOW TO USE:
 * 1. Replace all placeholder values with your real information
 * 2. Save the file
 * 3. Run `pnpm dev` to see your changes
 * 4. Deploy when ready!
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// 👤 PERSONAL INFORMATION
// ─────────────────────────────────────────────────────────────────────────────

export const PERSONAL = {
  /** Your full name (shown in hero, metadata, etc.) */
  name: 'Nektarios Ioannou',

  /** Your professional title (e.g., "Full Stack Developer", "UX Designer") */
  title: 'Computer Science Student',

  /** A short bio/summary about yourself (2-4 sentences) */
  bio: `Computer Science student at the University of Cyprus, passionate about solving complex and intricate problems through well-crafted, impactful software. Deeply interested in Artificial Intelligence and its application to real-world challenges, with hands-on experience building and deploying end-to-end machine learning pipelines. Eager to explore new areas of Computer Science both theoretically and practically and contribute to projects that make a meaningful difference.`,

  /** Your profile photo (place in public/images/ folder) */
  photo: '/images/profile.webp',

  /** Your location (city, country) */
  location: 'Nicosia, Cyprus',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 📧 CONTACT & SOCIAL LINKS
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT = {
  /** Your email address */
  email: 'ioannou.nektarios@ucy.ac.cy',

  /** Your phone number (optional, leave empty string to hide) */
  phone: '+357 97621017',

  /** Your personal website URL (this site!) */
  website: 'https://website-cv-rho.vercel.app',

  /** LinkedIn profile URL */
  linkedin: '',

  /** GitHub profile URL */
  github: 'https://github.com/Nektarios-I',

  /** Twitter/X profile URL (optional, leave empty string to hide) */
  twitter: '',

  /** Other social links (optional) */
  dribbble: '',
  behance: '',
  youtube: '',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 💼 WORK EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────
// Add your jobs in REVERSE chronological order (newest first)

export const EXPERIENCE = [
  {
    id: 'exp-humeral-intern',
    company: 'Humeral',
    role: 'Software Engineering Intern',
    startDate: '2024-06',
    endDate: '2024-08',
    location: 'Remote / Cyprus',
    description:
      'Designed and implemented an end-to-end machine learning pipeline to predict Standing Long Jump distance from video data.',
    highlights: [
      'Designed and implemented an end-to-end ML pipeline to predict Standing Long Jump (SLJ) distance from video data, applying state-of-the-art pose estimation and regression techniques',
      'Processed and engineered features from raw motion-capture datasets, improving model accuracy through iterative experimentation with multiple ML architectures',
      'Delivered a fully documented, reproducible pipeline within a 3-month internship cycle, collaborating closely with a medical researcher to validate results against clinical benchmarks',
    ],
    technologies: [
      'Python',
      'Scikit-learn',
      'Pose Estimation',
      'Machine Learning',
      'Data Engineering',
    ],
    companyUrl: '',
  },
  {
    id: 'exp-humeral-freelance',
    company: 'Humeral',
    role: 'ML Research Collaborator (Freelance)',
    startDate: '2023',
    endDate: '2023',
    location: 'Remote / Cyprus',
    description:
      'Collaborated with a mechanical engineer and medical doctor to build, train, and evaluate machine learning models for sports science research.',
    highlights: [
      'Built, trained, and evaluated machine learning models analysing human jumping motion (CMJ) for sports science research',
      "Integrated a voice-command feature into the company's web platform using NLP intent-recognition models, enabling hands-free navigation for end users",
    ],
    technologies: ['Python', 'Machine Learning', 'NLP', 'Data Analysis'],
    companyUrl: '',
  },
  {
    id: 'exp-decathlon',
    company: 'Decathlon',
    role: 'Sales Assistant',
    startDate: '2023-06',
    endDate: '2023-08',
    location: 'Larnaca, Cyprus',
    description:
      'Developed customer communication and coordination skills in a high-traffic retail environment, gaining practical understanding of team operations and professional hierarchy.',
    highlights: [
      'Developed strong customer communication and coordination skills in a high-traffic retail environment',
    ],
    technologies: [],
    companyUrl: 'https://www.decathlon.com',
  },
  {
    id: 'exp-military',
    company: 'Cyprus National Army',
    role: 'Military Service',
    startDate: '2022',
    endDate: '2023',
    location: 'Cyprus',
    description:
      'Completed mandatory national service; strengthened discipline, adaptability under pressure, and the ability to operate effectively within structured team environments.',
    highlights: [
      'Strengthened discipline, adaptability under pressure, and effective teamwork within structured environments',
    ],
    technologies: [],
    companyUrl: '',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 🎓 EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

export const EDUCATION = [
  {
    id: 'edu-ucy',
    institution: 'University of Cyprus',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2022-09',
    endDate: 'Present',
    gpa: '9.5 / 10',
    description:
      'Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Databases, Operating Systems, Computer Architecture, Discrete Mathematics, Software Engineering, Machine Learning.',
  },
  {
    id: 'edu-highschool',
    institution: 'Aradippou High School',
    degree: 'Apolytirion',
    field: 'General Studies',
    startDate: '2016-09',
    endDate: '2022-06',
    gpa: '19.90 / 20',
    description:
      'Graduated with distinction from Aradippou High School in Larnaca, Cyprus.',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
// Featured projects appear first. Add your best work!

export const PROJECTS = [
  {
    id: 'project-slj',
    title: 'SLJ Prediction Pipeline',
    description:
      'End-to-end ML pipeline predicting Standing Long Jump distance from raw video input using computer vision and machine learning.',
    longDescription:
      'Built a complete, production-ready pipeline that predicts Standing Long Jump (SLJ) distance from raw video input using modern computer vision and machine learning methods. Achieved strong predictive accuracy through systematic feature engineering and model evaluation across multiple regression architectures. Developed during internship at Humeral.',
    category: 'ml',
    technologies: [
      'Python',
      'Scikit-learn',
      'Pose Estimation',
      'Machine Learning',
    ],
    image: '/images/projects/slj.webp',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    date: '2024',
  },
  {
    id: 'project-cmj',
    title: 'CMJ Jump Analysis',
    description:
      'ML models analysing Counter-Movement Jump biomechanics for sports science research.',
    longDescription:
      'Developed and evaluated machine learning models to analyse Counter-Movement Jump (CMJ) biomechanics, contributing to a sports science research study. Processed raw sensor and video data to extract meaningful motion features used for model training and evaluation.',
    category: 'ml',
    technologies: ['Python', 'Machine Learning', 'Data Analysis'],
    image: '/images/projects/cmj.webp',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    date: '2023',
  },
  {
    id: 'project-kouppi',
    title: 'Kouppi – Card Game Web App',
    description:
      'Fully interactive browser-based card game with game logic, UI state management, and responsive design.',
    longDescription:
      'Designed and developed a fully interactive browser-based card game from scratch, implementing game logic, UI state management, and responsive design. Demonstrates ability to independently deliver a complete, user-facing product end-to-end.',
    category: 'web',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: '/images/projects/kouppi.webp',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    date: '2024',
  },
  {
    id: 'project-cv-website',
    title: 'Interactive CV Website',
    description:
      'Personal interactive CV presented as an engaging, structured 3D gallery experience.',
    longDescription:
      'Built and deployed a personal interactive CV as a website, presenting professional experience and projects in an engaging, structured web format with a 3D gallery mode featuring explorable rooms, animated robot character, and interactive exhibits.',
    category: 'web',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Three.js',
      'Tailwind CSS',
    ],
    image: '/images/projects/cv-website.webp',
    liveUrl: 'https://website-cv-rho.vercel.app',
    githubUrl: 'https://github.com/Nektarios-I',
    featured: true,
    date: '2025',
  },
  {
    id: 'project-university',
    title: 'University CS Projects',
    description:
      'Academic projects spanning algorithms, data structures, database design, and object-oriented systems.',
    longDescription:
      'Completed a range of academic projects spanning algorithms, data structures, database design, and object-oriented systems as part of the B.Sc. curriculum at the University of Cyprus. Covers topics including sorting algorithms, graph traversal, SQL database design, and OOP design patterns.',
    category: 'other',
    technologies: ['Java', 'C', 'SQL', 'Various'],
    image: '/images/projects/university.webp',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    date: '2022 – Present',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 🛠 SKILLS
// ─────────────────────────────────────────────────────────────────────────────
// Group your skills by category. Proficiency: "beginner" | "intermediate" | "advanced" | "expert"

export const SKILLS = [
  {
    category: 'Proficient',
    skills: [
      { name: 'Java', proficiency: 'expert' },
      { name: 'Machine Learning', proficiency: 'expert' },
      { name: 'Python', proficiency: 'expert' },
    ],
  },
  {
    category: 'Familiar',
    skills: [
      { name: 'C', proficiency: 'advanced' },
      { name: 'SQL & Databases', proficiency: 'advanced' },
      { name: 'HTML/CSS/JavaScript', proficiency: 'advanced' },
    ],
  },
  {
    category: 'Exposure',
    skills: [
      { name: 'Computer Architecture', proficiency: 'intermediate' },
      { name: 'OS Fundamentals', proficiency: 'intermediate' },
    ],
  },
  {
    category: 'Soft Skills',
    skills: [
      { name: 'Problem-solving', proficiency: 'expert' },
      { name: 'Analytical Thinking', proficiency: 'expert' },
      { name: 'Team Collaboration', proficiency: 'advanced' },
      { name: 'Communication', proficiency: 'advanced' },
      { name: 'Adaptability', proficiency: 'advanced' },
    ],
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 SITE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
  /** Site title (shown in browser tab) */
  title: `${PERSONAL.name} — CV`,

  /** Site description (for SEO) */
  description: `${PERSONAL.name}'s interactive CV website. ${PERSONAL.title} at the University of Cyprus.`,

  /** Your domain (used for sitemap, OG images) */
  url: 'https://website-cv-rho.vercel.app',

  /** Default language */
  language: 'en',

  /** Theme color (hex) */
  themeColor: '#14b8a6', // Teal accent

  /** Enable/disable sections */
  sections: {
    about: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    contact: true,
    certifications: true,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 📊 CERTIFICATIONS (Optional)
// ─────────────────────────────────────────────────────────────────────────────

export const CERTIFICATIONS = [
  {
    id: 'cert-frontend',
    name: 'Frontend Web Development Certificate',
    issuer: 'Professional Certification',
    date: '',
    url: '',
    badge: '',
  },
  {
    id: 'cert-ielts',
    name: 'IELTS – English Proficiency Certificate',
    issuer: 'British Council / IDP',
    date: '',
    url: '',
    badge: '',
  },
  {
    id: 'cert-bouzouki',
    name: 'Bouzouki Performance Degree',
    issuer: 'Music Conservatory',
    date: '',
    url: '',
    badge: '',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 💬 TESTIMONIALS (Optional)
// ─────────────────────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  // {
  //   id: 'testimonial-1',
  //   quote: 'Amazing developer, highly recommended!',
  //   author: 'John Doe',
  //   role: 'CTO at TechCorp',
  //   avatar: '/images/testimonials/john.webp',
  // },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// 📝 RESUME/CV DOWNLOAD
// ─────────────────────────────────────────────────────────────────────────────

export const RESUME = {
  /** Enable resume download button */
  enabled: true,

  /** Path to your PDF resume (place in public/ folder) */
  file: '/resume.pdf',

  /** Button text */
  buttonText: 'Download Resume',
} as const;
