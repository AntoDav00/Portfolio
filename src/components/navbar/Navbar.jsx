import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Navbar,
    Typography,
    Collapse,
    IconButton
} from "@material-tailwind/react";

const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
];

export function CustomNavbar() {
    const [openNav, setOpenNav] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const observerRef = useRef(null);

    const scrollToSection = useCallback((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
            setOpenNav(false);
        }
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const entryHeight = entry.boundingClientRect.height;
                    
                    const visiblePercentage = 
                        entry.intersectionRect.height / Math.min(entryHeight, viewportHeight);

                    if (
                        entry.isIntersecting && 
                        (visiblePercentage >= 0.3 || 
                         (entry.boundingClientRect.top <= viewportHeight / 2 && 
                          entry.boundingClientRect.bottom >= viewportHeight / 2))
                    ) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { 
                root: null, 
                rootMargin: '0px', 
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
            }
        );

        navLinks.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) {
                observerRef.current.observe(section);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderNavLinks = (mobile = false) => (
        <ul className={`
            ${mobile 
                ? 'flex flex-col gap-4 items-center' 
                : 'hidden lg:flex flex-row items-center gap-6'
            } 
            w-full
        `}>
            {navLinks.map(({ id, label }) => (
                <Typography
                    key={id}
                    as="li"
                    variant="small"
                    color="white"
                    className={`
                        p-1 font-mono text-center w-full
                        ${mobile ? 'text-xl' : ''}
                    `}
                >
                    <a 
                        href={`#${id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(id);
                        }}
                        className={`
                            flex items-center justify-center 
                            transition-all duration-300 
                            ${activeSection === id 
                                ? 'text-white font-bold' 
                                : 'text-white/70 hover:text-white'
                            }
                            ${mobile 
                                ? 'py-2 rounded-lg hover:bg-white/10' 
                                : 'relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-blue-500 ' + 
                                  (activeSection === id ? 'after:w-full' : 'after:w-0 hover:after:w-full after:transition-all')
                            }
                        `}
                    >
                        {label}
                    </a>
                </Typography>
            ))}
        </ul>
    );

    return (
        <Navbar 
            className={`
                fixed top-0 left-0 w-full z-10 
                bg-black/70 backdrop-blur-md 
                rounded-none border-none
            `}
        >
            <div className="container mx-auto flex items-center justify-between text-white lg:p-2 md:p-4">
                <Typography
                    as="a"
                    onClick={() => scrollToSection('home')}
                    href="#home"
                    className="cursor-pointer font-mono font-bold text-base md:text-lg flex items-center"
                >
                    Antonio D'Aversa
                </Typography>
                
                <div className="flex items-center">
                    <div className="mr-4 hidden lg:block">
                        {renderNavLinks()}
                    </div>
                    <IconButton
                        variant="text"
                        className="ml-auto h-8 w-8 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden relative"
                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>
            </div>
            
            <Collapse open={openNav} className="lg:hidden">
                <div className="container mx-auto px-4 pb-4">
                    {renderNavLinks(true)}
                </div>
            </Collapse>
        </Navbar>
    );
}

export default CustomNavbar;