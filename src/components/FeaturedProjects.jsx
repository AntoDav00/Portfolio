import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FEATURED } from '../data/featuredProjects';


const Preview = ({ project }) => (
  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10 bg-[#0d0b14]">
    {project.image ? (
      <img src={project.image} alt={`${project.title} screenshot`} className="h-full w-full object-cover" loading="lazy" />
    ) : (
      <>
        <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/30">
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span className="ml-2 h-3 flex-1 max-w-[60%] rounded bg-white/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pt-6">
          <span className="font-mono text-3xl md:text-4xl font-bold text-white/90 tracking-tight">
            {project.title}
          </span>
        </div>
      </>
    )}
  </div>
);

const FeaturedProjects = () => (
  <div className="flex flex-col gap-10 md:gap-14 mb-20">
    {FEATURED.map((project, idx) => (
      <motion.article
        key={project.repo}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-5 md:p-8 text-left"
      >
        <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
          <Preview project={project} />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs text-violet-300 mb-1">
              {String(idx + 1).padStart(2, '0')} / {project.tagline}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h3>
          </div>

          <dl className="space-y-3 text-sm md:text-base">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-white/40">Problem</dt>
              <dd className="text-white/80">{project.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-white/40">Role</dt>
              <dd className="text-white/80">{project.role}</dd>
            </div>
          </dl>

          <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="font-mono text-xs px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-200"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-1">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <FaExternalLinkAlt size={12} /> Live demo
              </a>
            )}
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/30 hover:border-white text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <FaGithub /> Code
            </a>
          </div>
        </div>
      </motion.article>
    ))}
  </div>
);

export default FeaturedProjects;
