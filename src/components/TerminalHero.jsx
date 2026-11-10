import { useEffect, useRef, useState } from 'react';

const PROMPT_USER = 'antonio@portfolio';

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const Accent = ({ children }) => <span className="text-violet-300">{children}</span>;
const Muted = ({ children }) => <span className="text-white/50">{children}</span>;

// Each command returns the lines to print; side effects (scroll, open) run alongside.
const COMMANDS = {
  help: {
    description: 'list available commands',
    run: () => [
      <span key="h">Available commands:</span>,
      ...Object.entries(COMMANDS)
        .filter(([, cmd]) => !cmd.hidden)
        .map(([name, cmd]) => (
          <span key={name}>
            {'  '}
            <Accent>{name.padEnd(10)}</Accent>
            <Muted>{cmd.description}</Muted>
          </span>
        )),
    ],
  },
  whoami: {
    description: 'who is behind this terminal',
    run: () => [
      <span key="1">
        <Accent>Antonio D&apos;Aversa</Accent> — Full Stack Developer
      </span>,
      <Muted key="2">React · Laravel · UI/UX. Building clean, fast web apps.</Muted>,
    ],
  },
  about: {
    description: 'jump to my story, skills and experience',
    run: () => {
      scrollToSection('about');
      return [<Muted key="1">→ scrolling to /about …</Muted>];
    },
  },
  projects: {
    description: 'see what I have built',
    run: () => {
      scrollToSection('projects');
      return [<Muted key="1">→ scrolling to /projects …</Muted>];
    },
  },
  skills: {
    description: 'my main stack, in one line',
    run: () => [
      <span key="1">
        <Accent>frontend</Accent>  React, JavaScript, Tailwind, Framer Motion
      </span>,
      <span key="2">
        <Accent>backend</Accent>   Laravel, PHP, MySQL, REST APIs
      </span>,
      <span key="3">
        <Accent>design</Accent>    Figma, UI/UX, graphic design
      </span>,
    ],
  },
  contact: {
    description: "let's talk — opens the contact form",
    run: () => {
      scrollToSection('contact');
      return [<Muted key="1">→ scrolling to /contact …</Muted>];
    },
  },
  github: {
    description: 'open my GitHub profile',
    run: () => {
      openLink('https://bit.ly/GitAntoDav');
      return [<Muted key="1">→ opening github.com/AntoDav00 …</Muted>];
    },
  },
  linkedin: {
    description: 'open my LinkedIn profile',
    run: () => {
      openLink('https://bit.ly/LinkedinAntonio');
      return [<Muted key="1">→ opening LinkedIn …</Muted>];
    },
  },
  clear: {
    description: 'clear the terminal',
    run: () => null,
  },
  sudo: {
    hidden: true,
    run: () => [<span key="1">Nice try. You are not in the sudoers file. 😄</span>],
  },
};

const SUGGESTED = ['whoami', 'projects', 'about', 'skills', 'contact'];

const Prompt = () => (
  <span className="select-none">
    <span className="text-violet-400">{PROMPT_USER}</span>
    <span className="text-white/40">:</span>
    <span className="text-sky-300">~</span>
    <span className="text-white/40">$ </span>
  </span>
);

let entryId = 0;

const TerminalHero = () => {
  const [entries, setEntries] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booting, setBooting] = useState(true);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const execute = (raw) => {
    const value = raw.trim();
    if (!value) return;

    const name = value.toLowerCase().split(/\s+/)[0];
    const command = COMMANDS[name] ?? (value.toLowerCase().startsWith('sudo') ? COMMANDS.sudo : null);

    setHistory((prev) => [...prev, value]);
    setHistoryIndex(-1);

    if (name === 'clear') {
      setEntries([]);
      return;
    }

    const output = command
      ? command.run()
      : [
          <span key="e">
            command not found: <span className="text-red-300">{name}</span>. Try <Accent>help</Accent>.
          </span>,
        ];

    setEntries((prev) => [...prev, { id: ++entryId, command: value, output }]);
  };

  // Boot sequence: type "whoami" once, then hand control to the visitor.
  useEffect(() => {
    const target = 'whoami';
    let i = 0;
    let typer;
    const start = setTimeout(() => {
      typer = setInterval(() => {
        i += 1;
        setInput(target.slice(0, i));
        if (i >= target.length) {
          clearInterval(typer);
          setTimeout(() => {
            setEntries([{ id: ++entryId, command: target, output: COMMANDS.whoami.run() }]);
            setEntries((prev) => [
              ...prev,
              {
                id: ++entryId,
                command: null,
                output: [
                  <Muted key="hint">
                    Type a command or click one below. <Accent>help</Accent> lists everything.
                  </Muted>,
                ],
              },
            ]);
            setInput('');
            setBooting(false);
          }, 350);
        }
      }, 90);
    }, 600);

    return () => {
      clearTimeout(start);
      clearInterval(typer);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === 'Tab') {
      const match = Object.keys(COMMANDS).find(
        (name) => !COMMANDS[name].hidden && input && name.startsWith(input.toLowerCase())
      );
      if (match) {
        e.preventDefault();
        setInput(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-[#0d0b14]/90 shadow-[0_0_80px_-20px_rgba(139,92,246,0.45)] backdrop-blur font-mono text-sm overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3 text-white/40 text-xs truncate">{PROMPT_USER}: ~ — zsh</span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="h-72 sm:h-80 overflow-y-auto px-4 py-4 text-left text-white/90 leading-relaxed cursor-text"
        role="log"
        aria-live="polite"
        aria-label="Interactive terminal"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.command !== null && (
              <div>
                <Prompt />
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output?.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-words">
                {line}
              </div>
            ))}
          </div>
        ))}

        <label className="flex items-center">
          <Prompt />
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={booting}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="send"
            className="flex-1 min-w-0 bg-transparent outline-none text-white caret-violet-400 disabled:opacity-100"
          />
        </label>
      </div>

      {/* Clickable suggestions */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-white/10 bg-white/[0.02]">
        {SUGGESTED.map((name) => (
          <button
            key={name}
            type="button"
            disabled={booting}
            onClick={() => execute(name)}
            className="px-3 py-1 rounded-md border border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/25 hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors disabled:opacity-40 text-xs sm:text-sm"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TerminalHero;
