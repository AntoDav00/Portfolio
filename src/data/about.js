// Skills grouped by how often they are used, instead of self-rated percentages.
export const SKILL_GROUPS = [
  {
    label: 'daily',
    title: 'Every day',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML / CSS', 'Git', 'Figma'],
  },
  {
    label: 'projects',
    title: 'Used in projects',
    skills: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'Framer Motion'],
  },
  {
    label: 'design',
    title: 'Design & media',
    skills: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Social media content'],
  },
];

// One chronological timeline, most recent first. `type` drives the badge and icon.
export const TIMELINE = [
  {
    type: 'work',
    name: 'Meta Danza',
    role: 'Graphic Designer & Social Media Manager',
    period: 'AUG 2017 — Present',
    description: 'Created visual content and managed social media marketing strategies.',
  },
  {
    type: 'cert',
    name: 'Full Stack Web Developer JR',
    role: 'Aulab Certification',
    period: '2024',
    description: 'Professional certification in Full Stack Web Development.',
    link: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/129722312',
  },
  {
    type: 'education',
    name: 'Aulab Hackademy+',
    role: 'Full Stack Web Developer JR — React.js Specialization',
    period: 'JUN 2024 — DEC 2024',
    description: 'Intensive bootcamp focusing on modern web development technologies.',
  },
  {
    type: 'work',
    name: 'La Siesta',
    role: 'Business Owner',
    period: 'OCT 2020 — JAN 2024',
    description: 'Managed and developed business strategies for a local enterprise.',
  },
  {
    type: 'education',
    name: 'IIS Fermi',
    role: 'High School Diploma in Transport & Logistics',
    period: 'JUL 2021',
    description: 'Comprehensive education in logistics and transportation management.',
  },
];
