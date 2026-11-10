// Curated case studies. Edit freely: add `image` (an imported screenshot) to
// replace the generated preview, and tweak problem/role to tell the real story.
export const FEATURED = [
  {
    repo: 'ReHacktor',
    title: 'ReHacktor',
    tagline: 'Game discovery platform',
    problem:
      'Finding your next game means jumping between stores, wikis and forums. ReHacktor puts discovery, tracking and discussion in one place.',
    role: 'Solo project — design, frontend, API integration',
    stack: ['React', 'RAWG API', 'Tailwind', 'Netlify'],
    live: 'https://rehacktor.netlify.app',
    code: 'https://github.com/AntoDav00/ReHacktor',
    accent: 'from-violet-600/40 via-fuchsia-500/20 to-transparent',
  },
  {
    repo: 'Presto.it',
    title: 'Presto.it',
    tagline: 'Second-hand marketplace',
    problem:
      'A safe, simple place to list and buy used items, inspired by Vinted and Wallapop — built as the final project of the Aulab bootcamp.',
    role: 'Team project — full stack (Laravel, auth, listings)',
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    code: 'https://github.com/AntoDav00/Presto.it',
    accent: 'from-sky-500/30 via-violet-500/20 to-transparent',
  },
  {
    repo: 'Portfolio',
    title: 'This portfolio',
    tagline: 'Personal site with a terminal',
    problem:
      'A portfolio that feels like a developer made it: an interactive terminal hero, live GitHub projects and a protected contact form.',
    role: 'Solo project — design and development',
    stack: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    live: 'https://antoniodaversa.netlify.app',
    code: 'https://github.com/AntoDav00/Portfolio',
    accent: 'from-emerald-500/25 via-violet-500/20 to-transparent',
  },
];

export const FEATURED_REPOS = FEATURED.map((p) => p.repo.toLowerCase());
