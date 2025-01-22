import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaServer,
  FaTools,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaLink,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaEye,
  FaStore,
  FaPaintBrush,
  FaLaptopCode,
  FaSchool,
  FaAward,
  FaChevronDown,
  FaWhatsapp
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import { truncateText, getLanguageIconComponents } from '../utils/projectUtils';

// Carousel di skills e esperienze
const SkillsAndExperienceCarousel = () => {
  const [activeView, setActiveView] = useState('skills');
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const [activeExperienceCategory, setActiveExperienceCategory] = useState(0);

  // Primi 3 categorie di skills
  const skillCategories = [
    {
      name: "Frontend",
      icon: <FaCode className="text-blue-400" />,
      skills: [
        { name: "React", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "HTML/CSS", level: 90 },
        { name: "Tailwind", level: 85 }
      ]
    },
    {
      name: "Backend",
      icon: <FaServer className="text-green-400" />,
      skills: [
        { name: "Laravel", level: 80 },
        { name: "PHP", level: 75 },
        { name: "MySQL", level: 75 },
        { name: "API", level: 80 }
      ]
    },
    {
      name: "Tools & Others",
      icon: <FaTools className="text-purple-400" />,
      skills: [
        { name: "Git", level: 85 },
        { name: "Figma", level: 80 },
        { name: "Premiere Pro", level: 90 },
        { name: "Photoshop / Illustrator", level: 90 }
      ]
    }
  ];

  // Esperienze professionali, educazione e certificazioni
  const experienceData = [
    {
      icon: <FaBriefcase className="text-blue-400" />,
      title: "Professional Experience",
      experiences: [
        {
          name: "La Siesta",
          role: "Business Owner",
          period: "OCT 2020 - Present",
          description: "Managed and developed business strategies for a local enterprise.",
          icon: <FaStore className="text-blue-500" />
        },
        {
          name: "Meta Danza",
          role: "Graphic Designer & Social Media Manager",
          period: "AUG 2017 - Present",
          description: "Created visual content and managed social media marketing strategies.",
          icon: <FaPaintBrush className="text-purple-500" />
        }
      ]
    },
    {
      icon: <FaGraduationCap className="text-green-400" />,
      title: "Education",
      experiences: [
        {
          name: "Aulab Hackademy+",
          role: "Full Stack Web Developer JR - React.js Specialization",
          period: "JUN 2024 - DEC 2024",
          description: "Intensive bootcamp focusing on modern web development technologies.",
          icon: <FaLaptopCode className="text-green-500" />
        },
        {
          name: "IIS FERMI",
          role: "High School Diploma in Transport & Logistics",
          period: "JUL 2021",
          description: "Comprehensive education in logistics and transportation management.",
          icon: <FaSchool className="text-teal-500" />
        }
      ]
    },
    {
      icon: <FaCertificate className="text-purple-400" />,
      title: "Certifications",
      experiences: [
        {
          name: "Full Stack Web Developer JR",
          role: "Aulab Certification",
          period: "2024",
          description: "Professional certification in Full Stack Web Development.",
          icon: <FaAward className="text-violet-500" />,
          link: "https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/129722312"
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveView('skills')}
          className={`
            px-6 py-3 rounded-lg flex items-center space-x-2
            transition-all duration-300 
            ${activeView === 'skills'
              ? 'bg-violet-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'}
          `}
        >
          <FaCode /> <span>Skills</span>
        </button>
        <button
          onClick={() => setActiveView('experience')}
          className={`
            px-6 py-3 rounded-lg flex items-center space-x-2
            transition-all duration-300 
            ${activeView === 'experience'
              ? 'bg-violet-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'}
          `}
        >
          <FaBriefcase /> <span>Experience</span>
        </button>
      </div>

      {activeView === 'skills' ? (
        <>
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 flex-wrap">
            {skillCategories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveSkillCategory(index)}
                className={`
                  px-3 py-2 sm:px-6 sm:py-3 rounded-full flex items-center space-x-2 
                  transition-all duration-300 text-xs sm:text-sm mb-2
                  ${activeSkillCategory === index
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'}
                  ${activeSkillCategory === index ? 'hover:bg-violet-700' : ''}
                `}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkillCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 px-4 sm:px-0"
            >
              {skillCategories[activeSkillCategory].skills.map((skill, index) => (
                <div key={skill.name} className="w-full">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full min-w-[10%]"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="space-y-6 px-4 sm:px-0">
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 flex-wrap">
            {experienceData.map((category, index) => (
              <button
                key={category.title}
                onClick={() => setActiveExperienceCategory(index)}
                className={`
              px-3 py-2 sm:px-6 sm:py-3 rounded-full flex items-center space-x-2 
              transition-all duration-300 text-xs sm:text-sm mb-2
              ${activeExperienceCategory === index
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'}
              ${activeExperienceCategory === index ? 'hover:bg-violet-700' : ''}
            `}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.title}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {experienceData[activeExperienceCategory].experiences.map((exp, index) => (
              <motion.div
                key={exp.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 w-16 h-16 bg-black border-2 border-white/10 rounded-full flex items-center justify-center">
                  {exp.icon}
                </div>
                <div className="bg-white/5 p-4 sm:p-6 rounded-lg pt-12 sm:pt-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white">{exp.name}</h3>
                    <span className="text-xs sm:text-sm text-white/60">{exp.period}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 italic">{exp.role}</p>
                  <p className="text-xs text-white/70 mt-1 sm:mt-2">{exp.description}</p>
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400 hover:text-violet-300 mt-1 sm:mt-2 inline-block"
                    >
                      View Certification
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Typing Component
const TypingEffect = ({ texts, speed = 100, backSpeed = 50 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[currentTextIndex];

      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          // Move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    const typingTimer = setTimeout(handleTyping, isDeleting ? backSpeed : speed);
    return () => clearTimeout(typingTimer);
  }, [displayText, currentTextIndex, isDeleting, texts, speed, backSpeed]);

  return (
    <div className="h-[30px] min-h-[30px] flex items-center">
      <span>{displayText}&nbsp;</span>
    </div>
  );
};

const Home = () => {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProjects, setVisibleProjects] = useState(6);

  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + 6);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/antodav00/repos', {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const allRepos = await response.json();

        const userResponse = await fetch('https://api.github.com/users/antodav00');
        const userData = await userResponse.json();

        const personalProjects = allRepos
          .filter(repo =>
            !repo.fork &&
            !repo.name.includes('template') &&
            !repo.name.includes('example') &&
            repo.description
          )
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map(repo => ({
            id: repo.id,
            name: repo.name.replace(/-/g, ' '),
            description: truncateText(repo.description),
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            updated_at: new Date(repo.updated_at).toLocaleDateString(),
            owner: {
              login: userData.login,
              avatar_url: userData.avatar_url
            }
          }))
          .slice(0, visibleProjects);

        setProjects(personalProjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Errore nel recupero dei progetti:', error);
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [visibleProjects]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    message: '',
    type: '',
    errors: {}
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [capVal, setCapVal] = useState(null);
  const recaptchaRef = useRef(null);

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      console.error('ReCAPTCHA site key is missing!');
    }
  }, []);

  const handleRecaptchaChange = (val) => {
    setCapVal(val);
  };

  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    // Remove HTML tags and limit length
    return input
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/[<>&'"]/g, '')  // Remove potentially dangerous characters
      .trim()
      .substring(0, 500);  // Limit input length
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sanitize inputs
    const sanitizedFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    };

    // Check ReCAPTCHA first
    if (!capVal) {
      setFormStatus({
        isSubmitting: false,
        message: 'Please complete the ReCAPTCHA ',
        type: 'error',
        errors: {}
      });
      return;
    }

    // Reset previous error states
    const newFormErrors = {
      name: '',
      email: '',
      message: ''
    };

    // Validation with sanitized data
    if (!sanitizedFormData.name) {
      newFormErrors.name = 'Please enter your name';
    }

    if (!validateEmail(sanitizedFormData.email)) {
      newFormErrors.email = 'Please enter a valid email address';
    }

    if (!sanitizedFormData.message) {
      newFormErrors.message = 'Please enter a message';
    }

    // If any errors exist, set them and stop submission
    if (newFormErrors.name || newFormErrors.email || newFormErrors.message) {
      setFormStatus({
        isSubmitting: false, 
        message: '', 
        type: '',
        errors: newFormErrors
      });
      return;
    }

    // Proceed with form submission using sanitized data
    try {
      setFormStatus({ 
        isSubmitting: true, 
        message: '', 
        type: '',
        errors: {}
      });

      const response = await emailjs.send(
        'service_3ti30tg',
        'template_9rwl1xo',
        {
          from_name: sanitizedFormData.name,
          from_email: sanitizedFormData.email,
          message: sanitizedFormData.message,
          reply_to: sanitizedFormData.email
        },
        'MN7sxWzDfWf1jy68i'
      );

      setFormStatus({
        isSubmitting: false,
        message: 'Message sent successfully!',
        type: 'success',
        errors: {}
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCapVal(null);

    } catch (err) {
      console.error('EmailJS Error:', err);
      setFormStatus({
        isSubmitting: false,
        message: `Failed to send message: ${err.text || 'Unknown error'}`,
        type: 'error',
        errors: {}
      });

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCapVal(null);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|it|uk|fr|de|es|jp|br|info|biz|online|site|tech|eu|co|me|tv|ai|dev)$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear previous error messages when user starts typing
    if (formStatus.message) {
      setFormStatus({ isSubmitting: false, message: '', type: '', errors: {} });
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
            ref={homeRef}
            className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:pl-32 text-white py-20 min-h-screen space-y-8"
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

            {/* Name with Dynamic Gradient */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-left"> Hi, I'm </h1>
              <span
                className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-300 to-violet-500 text-transparent bg-clip-text text-left block"
              >
                Antonio D'Aversa
              </span>
            </div>

            {/* Typing Animation */}
            <div className="my-4 md:my-6 self-start text-xl text-gray-200">
              <TypingEffect
                texts={[
                  'Full Stack Developer',
                  'UI/UX Designer',
                  'React.JS Specialist',
                  'Clean Code Enthusiast',
                  'Graphical Designer'
                ]}
              />
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-300 mb-6 text-left w-full md:w-2/3">
              Building modern web applications with a focus on user experience and clean code.
            </p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 h-[120px] sm:h-auto"
            >
              <button
                className="flex items-center justify-center bg-violet-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
              >
                <FaPaperPlane className="mr-2" />
                Let's Connect
              </button>
              <button
                onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center border border-white text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
              >
                <FaEye className="mr-2" /> View Projects
              </button>
            </motion.div>

            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://bit.ly/GitAntoDav"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visita il mio profilo GitHub"
                className="text-white hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://bit.ly/LinkedinAntonio"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Connettiti con me su LinkedIn"
                className="text-white hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:pr-32 text-white py-12">
            {/* Cards for Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 gap-4 w-full md:hidden"
            >
              {[
                { emoji: '⚛️', title: 'React', description: 'Frontend Development' },
                { emoji: '🚀', title: 'Laravel', description: 'Backend Solutions' },
                { emoji: '🎨', title: 'UI/UX', description: 'Design Systems' },
                { emoji: '💻', title: 'Full Stack', description: 'End-to-end Development' }
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="outline outline-1 outline-white/20 bg-white/10 rounded-lg p-4 flex flex-col items-start transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-1">{card.emoji}</div>
                  <h2 className="text-lg font-semibold mb-1 text-white">{card.title}</h2>
                  <p className="text-sm text-gray-300">{card.description}</p>
                </div>
              ))}
            </motion.div>

            {/* Cards for Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl"
            >
              {[
                { emoji: '⚛️', title: 'React', description: 'Frontend Development' },
                { emoji: '🚀', title: 'Laravel', description: 'Backend Solutions' },
                { emoji: '🎨', title: 'UI/UX', description: 'Design Systems' },
                { emoji: '💻', title: 'Full Stack', description: 'End-to-end Development' }
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="outline outline-1 outline-white/20 bg-white/10 rounded-lg p-2 md:p-4 flex flex-col items-start transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl md:text-3xl mb-1">{card.emoji}</div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1 text-white">{card.title}</h2>
                  <p className="text-xs md:text-sm text-gray-300">{card.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div
          id="about"
          ref={aboutRef}
          className="w-full min-h-screen flex flex-col justify-center items-center text-center relative bg-black pt-24 pb-24 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${new URL('../assets/media/bg.jpg', import.meta.url).href})` }}
          />

          <div className="relative z-10 w-full max-w-6xl px-4 mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-500 text-transparent bg-clip-text mb-6 text-center">
              About Me
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto text-center">
              🚀 Full Stack Developer
              Passionate about building innovative, secure web applications using React, creating elegant, scalable digital solutions.
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
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center bg-violet-600 text-white px-8 py-4 rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaEye className="mr-3 text-xl" /> Download CV
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Colonna Destra: Skills e Esperienze */}
            <div className="w-full">
              <SkillsAndExperienceCarousel />
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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-500 text-transparent bg-clip-text lg:mb-12 mb-6 text-center">
              My Projects
            </h2>

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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [&>*:last-child]:mb-16">
                {projects.map((project) => (
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
                            border-3 border-violet-500 
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
                            {project.name.replace(/-/g, ' ')}
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
                        "{truncateText(project.description)}"
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
                            className="text-white/80 hover:text-violet-400 transition-colors duration-300 group"
                          >
                            <FaGithub className="mr-2 group-hover:scale-125 transition-transform" />
                            <span className="text-sm">Repository</span>
                          </a>

                          {project.homepage && (
                            <a
                              href={project.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/80 hover:text-violet-400 transition-colors duration-300 group"
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
          {projects.length < 6 ? null : (
            <button
              onClick={loadMoreProjects}
              className="flex items-center justify-center bg-violet-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 text-base sm:text-lg font-semibold"
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
              <h2
                id="contact-form-title"
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-blue-500 text-transparent bg-clip-text mb-4 text-center"
              >
                Contact Me
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
                      Nome
                    </label>
                    <input
                      aria-required="true"
                      aria-invalid={formStatus.errors.name}
                      aria-describedby="name-error"
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
                      aria-invalid={formStatus.errors.email}
                      aria-describedby="email-error"
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
                      Messaggio
                    </label>
                    <textarea
                      aria-required="true"
                      aria-invalid={formStatus.errors.message}
                      aria-describedby="message-error"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
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

                  <div className="flex justify-center mt-4 overflow-x-auto w-full items-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      theme="dark"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`
                      w-full py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base font-semibold
                      ${formStatus.isSubmitting
                        ? 'bg-violet-800 text-white/50 cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:scale-105'}
                    `}
                  >
                    {formStatus.isSubmitting ? 'Sending...' : (
                      <>
                        <FaPaperPlane className="mr-2 inline" />
                        Send Message
                      </>
                    )}
                  </button>
                  {formStatus.message && (
                    <div className={`text-xs sm:text-sm mt-2 ${formStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
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