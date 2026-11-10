import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaLink,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaEye,
  FaDownload,
  FaChevronDown,
  FaWhatsapp
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import { truncateText, getLanguageIconComponents } from '../utils/projectUtils';
import TerminalHero from '../components/TerminalHero';
import FeaturedProjects from '../components/FeaturedProjects';
import { FEATURED_REPOS } from '../data/featuredProjects';
import { SKILL_GROUPS, TIMELINE } from '../data/about';

const TIMELINE_TYPES = {
  work: { label: 'work', icon: FaBriefcase, color: 'text-sky-300 border-sky-400/40 bg-sky-400/10' },
  education: { label: 'education', icon: FaGraduationCap, color: 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10' },
  cert: { label: 'certification', icon: FaCertificate, color: 'text-violet-300 border-violet-400/40 bg-violet-400/10' },
};

// Order of the experience blocks; `flag` is shown as `$ git log --<flag>`
const TIMELINE_GROUPS = [
  { type: 'work', flag: 'work' },
  { type: 'education', flag: 'education' },
  { type: 'cert', flag: 'certifications' },
];

// Skills grouped by usage + one timeline per experience type
const SkillsAndExperience = () => (
  <div className="space-y-10 text-left px-2 sm:px-0">
    <section aria-labelledby="skills-title">
      <h3 id="skills-title" className="font-mono text-sm text-white/50 mb-4">
        <span className="text-violet-400">$</span> ls skills/
      </h3>
      <div className="space-y-4">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">{group.title}</p>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-100"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {TIMELINE_GROUPS.map((group) => {
      const type = TIMELINE_TYPES[group.type];
      const Icon = type.icon;
      const items = TIMELINE.filter((item) => item.type === group.type);
      if (!items.length) return null;
      return (
        <section key={group.type} aria-labelledby={`timeline-${group.type}`}>
          <h3 id={`timeline-${group.type}`} className="font-mono text-sm text-white/50 mb-4">
            <span className="text-violet-400">$</span> git log --{group.flag}
          </h3>
          <ol className="relative border-l border-white/15 ml-3 space-y-6">
            {items.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative pl-8"
              >
                <span
                  className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center bg-black ${type.color}`}
                  aria-hidden="true"
                >
                  <Icon size={11} />
                </span>
                <p className="font-mono text-xs text-white/50 mb-1">{item.period}</p>
                <h4 className="text-base sm:text-lg font-semibold text-white">{item.name}</h4>
                <p className="text-sm text-white/80 italic">{item.role}</p>
                <p className="text-sm text-white/60 mt-1">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-violet-400 hover:text-violet-300 mt-1 inline-block"
                  >
                    View certification →
                  </a>
                )}
              </motion.li>
            ))}
          </ol>
        </section>
      );
    })}
  </div>
);

const GITHUB_USER = 'antodav00';
const PROJECTS_PAGE_SIZE = 6;

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_3ti30tg';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_9rwl1xo';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'MN7sxWzDfWf1jy68i';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

const FIELD_LIMITS = { name: 100, email: 254, message: 2000 };

// Plain-text normalisation only: EmailJS renders template variables escaped,
// so there is no need to strip quotes/apostrophes (which broke names like D'Aversa).
const cleanText = (value, maxLength) =>
  String(value ?? '')
    // eslint-disable-next-line no-control-regex -- intentionally strips control characters
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);

const validateForm = ({ name, email, message }) => {
  const errors = {};
  if (name.length < 2) errors.name = 'Please enter your name';
  if (!validateEmail(email)) errors.email = 'Please enter a valid email address';
  if (message.length < 10) errors.message = 'Message should be at least 10 characters';
  return errors;
};

const Home = () => {
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(PROJECTS_PAGE_SIZE);

  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + PROJECTS_PAGE_SIZE);
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
          {
            headers: { Accept: 'application/vnd.github+json' },
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const allRepos = await response.json();

        const personalProjects = allRepos
          .filter(repo =>
            !repo.fork &&
            !repo.archived &&
            !repo.name.includes('template') &&
            !repo.name.includes('example') &&
            repo.description &&
            !FEATURED_REPOS.includes(repo.name.toLowerCase())
          )
          .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at))
          .map(repo => ({
            id: repo.id,
            name: repo.name.replace(/[-_]/g, ' '),
            description: truncateText(repo.description),
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            updated_at: new Date(repo.pushed_at || repo.updated_at).toLocaleDateString(),
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url
            }
          }));

        setProjects(personalProjects);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Failed to load projects:', error);
        setProjectsError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const shownProjects = projects.slice(0, visibleProjects);
  const hasMoreProjects = visibleProjects < projects.length;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    message: '',
    type: '',
    errors: {}
  });
  const [capVal, setCapVal] = useState(null);
  const recaptchaRef = useRef(null);

  const handleRecaptchaChange = (val) => {
    setCapVal(val);
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setCapVal(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear the error for the field being edited and any global message
    if (formStatus.message || formStatus.errors?.[name]) {
      setFormStatus(prev => ({
        ...prev,
        message: '',
        type: '',
        errors: { ...prev.errors, [name]: undefined }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStatus.isSubmitting) return;

    // Honeypot: bots fill hidden fields. Pretend success and drop the message silently.
    if (formData.honeypot) {
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setFormStatus({ isSubmitting: false, message: 'Message sent successfully!', type: 'success', errors: {} });
      return;
    }

    const cleanData = {
      name: cleanText(formData.name, FIELD_LIMITS.name),
      email: cleanText(formData.email, FIELD_LIMITS.email),
      message: cleanText(formData.message, FIELD_LIMITS.message)
    };

    const errors = validateForm(cleanData);
    if (Object.keys(errors).length > 0) {
      setFormStatus({
        isSubmitting: false,
        message: 'Please fix the highlighted fields',
        type: 'error',
        errors
      });
      return;
    }

    if (RECAPTCHA_SITE_KEY && !capVal) {
      setFormStatus({
        isSubmitting: false,
        message: 'Please complete the reCAPTCHA',
        type: 'error',
        errors: {}
      });
      return;
    }

    try {
      setFormStatus({ isSubmitting: true, message: '', type: '', errors: {} });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: cleanData.name,
          from_email: cleanData.email,
          message: cleanData.message,
          reply_to: cleanData.email,
          ...(capVal ? { 'g-recaptcha-response': capVal } : {})
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setFormStatus({
        isSubmitting: false,
        message: 'Message sent successfully!',
        type: 'success',
        errors: {}
      });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      setFormStatus({
        isSubmitting: false,
        message: 'Failed to send message. Please try again or reach me on LinkedIn.',
        type: 'error',
        errors: {}
      });
    } finally {
      resetRecaptcha();
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://bit.ly/GitAntoDav',
      icon: FaGithub
    },
    {
      name: 'LinkedIn',
      url: 'https://bit.ly/LinkedinAntonio',
      icon: FaLinkedin
    },
    {
      name: 'Whatsapp',
      url: 'https://bit.ly/WpAntoDav',
      icon: FaWhatsapp
    }

  ];

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-100"></div>
      <video
        src={new URL('../assets/media/Abstract_Computer_Code_Running_Virtual_Space_video_stock_100_roy.webm', import.meta.url).href}
        className="absolute top-0 left-0 w-full h-screen object-cover opacity-10"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full overflow-y-auto">
        {/* Contenuto Home */}
        <div className="flex flex-col md:flex-row font-mono min-h-full pt-4 md:pt-0">
          <div
            id="home"
            className="w-full md:w-1/2 flex flex-col justify-center items-start px-6 sm:px-8 md:pl-16 lg:pl-32 text-white pt-28 pb-10 md:py-20 md:min-h-screen space-y-7"
          >
            {/* Available for Work Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-4 md:mb-5 outline outline-1 outline-white/20 text-left bg-white/10 px-3 py-1 rounded-full"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-3 h-3 bg-violet-500 rounded-full mr-2"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-full h-full bg-violet-500 rounded-full"
                />
              </motion.div>
              <span className="text-sm font-semibold">Available for Work</span>
            </motion.div>

            {/* Name */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-violet-300 to-violet-500 text-transparent bg-clip-text text-left leading-tight">
                Antonio D&apos;Aversa
              </h1>
              <p className="text-lg md:text-xl text-gray-200 text-left">
                Full Stack Developer <span className="text-violet-400">·</span> React &amp; Laravel
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-300 text-left w-full md:w-4/5">
              I build modern web applications with a focus on user experience and clean code.
              <span className="hidden md:inline"> Don&apos;t want to scroll? Ask the terminal.</span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={scrollToContact}
                className="flex items-center justify-center bg-violet-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
              >
                <FaPaperPlane className="mr-2" />
                Let&apos;s Connect
              </button>
              <button
                type="button"
                onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center border border-white text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
              >
                <FaEye className="mr-2" /> View Projects
              </button>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://bit.ly/GitAntoDav"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my GitHub profile"
                className="text-white hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://bit.ly/LinkedinAntonio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with me on LinkedIn"
                className="text-white hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:pr-16 lg:pr-32 text-white pb-20 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full flex justify-center"
            >
              <TerminalHero />
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div
          id="about"
          className="w-full min-h-screen flex flex-col justify-center items-center text-center relative bg-black pt-24 pb-24 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${new URL('../assets/media/bg.jpg', import.meta.url).href})` }}
          />

          <div className="relative z-10 w-full max-w-6xl px-4 mb-12">
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              <span className="text-violet-400">~/</span>about<span className="text-violet-400 animate-pulse">_</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto text-center">
              Full Stack Developer passionate about building innovative, secure web applications using React, creating elegant, scalable digital solutions.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 w-full max-w-6xl px-2 md:px-10 lg:px-2 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center md:sticky md:top-32"
          >
            {/* Colonna Sinistra: Profilo */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <motion.img
                src={new URL('../assets/media/profile.jpg', import.meta.url).href}
                alt="Antonio D'Aversa"
                className="w-32 md:w-48 h-32 md:h-48 object-cover rounded-full border-4 border-violet-500 shadow-2xl"
              />
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-violet-300 to-violet-500 text-transparent bg-clip-text">
                  Antonio D'Aversa
                </h2>
                <p className="text-white/80 leading-relaxed max-w-xl text-lg">
                  As a Full Stack Developer, I blend technical proficiency with innovative problem-solving to craft efficient and intuitive applications. My experience in web development has provided me with a comprehensive skill set spanning frontend and backend technologies, enabling me to create holistic digital solutions.
                </p>
                <div className="flex justify-center lg:justify-start space-x-4">
                  <motion.a
                    href={new URL('../assets/media/cv-2.pdf', import.meta.url).href}
                    download="Antonio_DAversa_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center bg-violet-600 text-white px-8 py-4 rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaDownload className="mr-3 text-xl" /> Download CV
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Colonna Destra: Skills e Esperienze */}
            <div className="w-full">
              <SkillsAndExperience />
            </div>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div
          id="projects"
          ref={projectsRef}
          className="w-full min-h-screen flex flex-col justify-start items-center text-center relative bg-black py-32 pb-48 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${new URL('../assets/media/bg1.jpg', import.meta.url).href})` }}
          />

          <div className="relative z-10 w-full max-w-6xl px-4">
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 lg:mb-12 text-center">
              <span className="text-violet-400">~/</span>projects<span className="text-violet-400 animate-pulse">_</span>
            </h2>

            <FeaturedProjects />

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-left">More on GitHub</h3>
            <p className="text-white/60 mb-8 text-left">Fetched live from my GitHub — experiments, exercises and side projects.</p>

            {isLoading ? (
              <div className="flex justify-center items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear"
                  }}
                  className="w-12 h-12 border-4 border-t-violet-600 border-white/20 rounded-full"
                />
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center gap-4 text-white/70">
                <p>
                  {projectsError
                    ? "Couldn't load projects from GitHub right now."
                    : 'No projects to show yet.'}
                </p>
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-violet-300 hover:text-violet-200"
                >
                  <FaGithub /> See them on GitHub
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [&>*:last-child]:mb-16">
                {shownProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "tween" }}
                    className="relative 
                      bg-gradient-to-br from-[#1a1a2e] to-[#16213e]
                      rounded-2xl 
                      overflow-hidden 
                      border border-white/10
                      hover:border-violet-500/30
                      transition-all duration-300
                      shadow-lg
                      hover:shadow-xl hover:shadow-violet-500/20
                      h-full
                      flex flex-col"
                  >
                    {/* Decorative Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 
                      bg-gradient-to-r from-violet-600 to-indigo-600 
                      transform -skew-x-12 origin-top-left"
                    />

                    <div className="p-6 relative z-10 flex flex-col flex-grow">
                      {/* Project Header */}
                      <div className="flex items-center mb-4">
                        <div className="relative mr-4">
                          <img
                            src={project.owner.avatar_url}
                            alt={project.owner.login}
                            className="w-14 h-14 rounded-full 
                            border-2 border-violet-500 
                            object-cover 
                            shadow-md 
                            group-hover:scale-110 
                            transition-transform"
                          />
                          <div className="absolute -bottom-1 -right-1 
                            w-4 h-4 
                            bg-violet-500 
                            rounded-full 
                            animate-pulse"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white 
                            group-hover:text-violet-300 
                            transition-colors 
                            line-clamp-1">
                            {project.name}
                          </h3>
                          <p className="text-sm text-white/60">
                            @{project.owner.login}
                          </p>
                        </div>
                        {project.language && (
                          <div className="
                            bg-gray-800/50 
                            rounded-lg 
                            text-white 
                            p-2 
                            flex items-center 
                            justify-center">
                            {getLanguageIconComponents(project.language).map((Icon, index) => (
                              <Icon key={index} className="text-xl mr-1 last:mr-0" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Project Description */}
                      <p className="text-white/80 mb-4 
                        italic text-sm 
                        h-[72px] 
                        overflow-hidden 
                        text-overflow-ellipsis 
                        line-clamp-3 
                        break-words 
                        hover:text-white 
                        transition-colors 
                        cursor-pointer 
                        relative 
                        before:absolute 
                        before:bottom-0 
                        before:right-0 
                        before:w-8 
                        before:h-full 
                        before:bg-gradient-to-l 
                        before:from-[#1a1a2e] 
                        before:to-transparent flex-grow">
                        "{project.description}"
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {project.topics && project.topics.slice(0, 3).map(topic => (
                          <span
                            key={topic}
                            className="bg-white/10 
                              text-white/70 
                              rounded-full 
                              px-3 py-1 
                              text-xs 
                              hover:bg-violet-500/20 
                              transition-colors"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Project Actions */}
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex space-x-3">
                          <a
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-white/80 hover:text-violet-400 transition-colors duration-300 group"
                          >
                            <FaGithub className="mr-2 group-hover:scale-125 transition-transform" />
                            <span className="text-sm">Repository</span>
                          </a>

                          {project.homepage && (
                            <a
                              href={project.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-white/80 hover:text-violet-400 transition-colors duration-300 group"
                            >
                              <FaLink className="mr-2 group-hover:scale-125 transition-transform" />
                              <span className="text-sm">Live Site</span>
                            </a>
                          )}
                        </div>

                        <div className="text-xs text-white/50">
                          {project.updated_at}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {hasMoreProjects && (
            <button
              type="button"
              onClick={loadMoreProjects}
              className="relative z-10 mt-8 flex items-center justify-center bg-violet-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
            >
              <FaChevronDown className="mr-2" /> Load More
            </button>
          )}
        </div>

        {/* Contact Section */}
        <div
          id="contact"
          ref={contactRef}
          className="w-full min-h-screen flex flex-col justify-center items-center text-center relative bg-black py-24 overflow-y-auto"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${new URL('../assets/media/bg.jpg', import.meta.url).href})` }}
          />

          <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 w-full"
            >
              <h2 id="contact-form-title" className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                <span className="text-violet-400">~/</span>contact<span className="text-violet-400 animate-pulse">_</span>
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Have a project in mind? Let's discuss how we can bring your ideas to life.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 w-full relative">
              {/* Sezione Sinistra: Form di Contatto */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-white/20 w-full relative 
                  will-change-transform 
                  transform transition-transform duration-300
                  hover:scale-[1.02]
                  bg-opacity-20"
              >
                <form 
                  onSubmit={handleSubmit} 
                  aria-labelledby="contact-form-title"
                  className="space-y-6"
                >
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-white/70 mb-2 text-sm"
                    >
                      Name
                    </label>
                    <input
                      aria-required="true"
                      aria-invalid={Boolean(formStatus.errors.name)}
                      aria-describedby={formStatus.errors.name ? 'name-error' : undefined}
                      autoComplete="name"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="Your Name"
                    />
                    {formStatus.errors.name && (
                      <p 
                        id="name-error" 
                        className="text-red-500 text-sm mt-1"
                      >
                        {formStatus.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-white/70 mb-2 text-sm"
                    >
                      Email
                    </label>
                    <input
                      aria-required="true"
                      aria-invalid={Boolean(formStatus.errors.email)}
                      aria-describedby={formStatus.errors.email ? 'email-error' : undefined}
                      autoComplete="email"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="Your Email"
                    />
                    {formStatus.errors.email && (
                      <p 
                        id="email-error"
                        className="text-red-500 text-sm mt-1"
                      >
                        {formStatus.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-white/70 mb-2 text-sm"
                    >
                      Message
                    </label>
                    <textarea
                      aria-required="true"
                      aria-invalid={Boolean(formStatus.errors.message)}
                      aria-describedby={formStatus.errors.message ? 'message-error' : undefined}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      maxLength={FIELD_LIMITS.message}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="Write your message..."
                    ></textarea>
                    {formStatus.errors.message && (
                      <p 
                        id="message-error" 
                        className="text-red-500 text-sm mt-1"
                      >
                        {formStatus.errors.message}
                      </p>
                    )}
                  </div>

                  {RECAPTCHA_SITE_KEY && (
                    <div className="flex justify-center mt-4 overflow-x-auto w-full items-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptchaChange}
                        theme="dark"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ display: 'none' }}
                    value={formData.honeypot}
                    onChange={handleChange}
                  />

                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`
                      w-full py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-semibold
                      ${formStatus.isSubmitting
                        ? 'bg-violet-800 text-white/50 cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:scale-105'}
                      flex items-center justify-center
                    `}
                  >
                    {formStatus.isSubmitting ? 'Sending...' : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                  {formStatus.message && (
                    <div role="status" aria-live="polite" className={`text-xs sm:text-sm mt-2 ${formStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                      {formStatus.message}
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Sezione Destra: Connessioni */}
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 w-full relative mb-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Connect With Me</h3>
                  <div className="flex justify-center space-x-4 sm:space-x-6">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white transition-colors duration-300 group"
                        aria-label={`${link.name} profile`}
                      >
                        <link.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="sr-only">{link.name}</span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-white/70 mb-2 text-sm">Or email me directly</p>
                    <a
                      href="mailto:antoniodaversa71@gmail.com"
                      className="text-white/70 text-sm"
                    >
                      antoniodaversa71@gmail.com
                    </a>
                  </div>
                </motion.div>

                {/* Firma */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.7, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center items-center"
                >
                  <img 
                    src={new URL('../assets/media/firma.png', import.meta.url).href} 
                    alt="Antonio D'Aversa Signature" 
                    className="w-48 h-auto opacity-70"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;