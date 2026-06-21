import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#0a0a0a",
  panel: "#0f0f0f",
  panel2: "#151515",
  border: "#262626",
  borderHi: "#444444",
  text: "#e6e6e6",
  muted: "#7a7a7a",
  dim: "#4a4a4a",
  bright: "#ffffff",
  mono: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
};

const LANG_COLOR = {
  Go: "#ffffff",
  Rust: "#cfcfcf",
  C: "#b4b4b4",
  "C++": "#9c9c9c",
};

const PORTRAIT_SRC = "/portrait.png";

const PROJECTS = [
  {
    id: "trainers-manager",
    name: "trainers-manager",
    lang: "Go",
    healthUrl: "https://trainers.zik-zikurrat.dev/api/v1/health",
    tagline: "LLM Workout Generator",
    concept: "Kafka-saga · Outbox · background generation via LLM with interleaving in code",
    stack: ["Kafka", "PostgreSQL", "Redis", "Outbox", "LLM"],
    demo: "https://trainers.zik-zikurrat.dev",
    source: "https://github.com/zik-zikurrat/trainers-manager",
  },
  {
    id: "in-memory-db",
    name: "in-memory-db",
    lang: "Go",
    healthUrl: null,
    tagline: "In-memory KV database with CLI and TCP-server",
    concept: "WAL with group commit · future/promise · recovery on start",
    stack: ["WAL", "TCP", "CLI", "concurrency"],
    demo: null,
    source: "https://github.com/zik-zikurrat/in-memory-db",
  },
  {
    id: "basic-golang-structures",
    name: "basic-golang-structures",
    lang: "C",
    healthUrl: null,
    tagline: "Go data structures rebuilt on raw C",
    concept: "Slice, HashTable, Mutex/RWMutex, Channel — written by hand in C",
    stack: ["pthreads", "data-structures", "memory"],
    demo: null,
    source: "https://github.com/zik-zikurrat/basic-golang-structures",
  },
];

const SKILLS = [
  { name: "Go", level: 95, note: "production · microservices · internals" },
  { name: "C / C++", level: 80, note: "systems · data structures · pthreads" },
  { name: "Rust", level: 70, note: "low-level · safe concurrency · for fun" },
  { name: "PostgreSQL", level: 85, note: "indexing · query plans · MVCC" },
  { name: "Kafka", level: 80, note: "saga · outbox · event-driven" },
  { name: "Docker / k8s", level: 80, note: "compose · deploy · nginx" },
  { name: "Embedded", level: 65, note: "Arduino · ESP32 · Raspberry Pi" },
];

const STACK = ["Go", "Kafka", "PostgreSQL", "Redis", "gRPC", "Kubernetes", "Docker", "Rust", "C", "C++", "Arduino/ESP32/Raspberry Pi"];

const CONTACT = {
  github: "https://github.com/zik-zikurrat",
  telegram: "https://t.me/zpolev",
  email: "zakariyapolevchshikov@proton.me",
};

const TUX = [
  "      .--.      ",
  "     |o_o |     ",
  "     |:_/ |     ",
  "    //   \\ \\    ",
  "   (|     | )   ",
  "  /'\\_   _/`\\   ",
  "  \\___)=(___/   ",
];

const BOOT_LINES = [
  "[ 0.000000] zik-zikurrat — booting…",
  "[ 0.000412] cpu: backend engineer / go · rust · c/c++",
  "[ 0.001120] loc: almaty, kz",
  "[ 0.002340] loading services…",
  "[ 0.004511] trainers-manager …………… ok",
  "[ 0.005903] in-memory-db ………………………… ok",
  "[ 0.007288] basic-golang-structures … idle",
  "[ 0.009140] mounting /dev/curiosity … ok",
  "[ 0.010002] ready.",
];

/* ───────────────────────── boot ───────────────────────── */
function BootSequence({ onDone }) {
  const [lines, setLines] = useState([]);
  const idx = useRef(0);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(finish, 450);
        return;
      }
      const line = BOOT_LINES[idx.current];
      idx.current += 1;
      setLines((prev) => [...prev, line]);
    }, 150);
    return () => clearInterval(t);
  }, [finish]);

  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [finish]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: C.mono, fontSize: 14, padding: "40px 24px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: 0.92, color: l.includes("ready.") ? C.bright : C.text }}>{l}</div>
      ))}
      <span style={{
        display: "inline-block", width: 8, height: 16,
        background: C.bright, animation: "blink 1s step-end infinite",
      }} />
      <div style={{ marginTop: 24, color: C.muted, fontSize: 12 }}>
        press any key to skip
      </div>
    </div>
  );
}

/* ───────────────────────── reveal-on-scroll ───────────────────────── */
function useReveal() {
  const [node, setNode] = useState(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node]);
  return [setNode, shown];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s cubic-bezier(.2,.7,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── live ascii portrait ───────────────────────── */
const ASCII_RAMP = " .:-=+*#%@";
const SCRAMBLE = "01<>[]{}/\\|=+*#01:.";

function AsciiPortrait({ src, cols = 92 }) {
  const preRef = useRef(null);
  const finalRef = useRef(null);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);
  const [revealRef, visible] = useReveal();

  // build ascii from image luminance (dark → dense, so the subject reads as ink on black)
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const rows = Math.max(1, Math.round(cols * (img.height / img.width) * 0.5));
      const cv = document.createElement("canvas");
      cv.width = cols;
      cv.height = rows;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, cols, rows);
      const { data } = ctx.getImageData(0, 0, cols, rows);
      const n = cols * rows;
      // pass 1: luminance + min/max for contrast normalization
      const lum = new Float32Array(n);
      let mn = 1, mx = 0;
      for (let p = 0; p < n; p++) {
        const i = p * 4;
        const v = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        lum[p] = v;
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      const range = Math.max(1e-3, mx - mn);
      const last = ASCII_RAMP.length - 1;
      const GAMMA = 1.5; // push midtones so the face clears up, silhouette stays dense
      const lines = [];
      for (let y = 0; y < rows; y++) {
        let s = "";
        for (let x = 0; x < cols; x++) {
          const norm = (lum[y * cols + x] - mn) / range; // 0 = darkest, 1 = brightest
          const density = Math.pow(Math.max(0, 1 - norm), GAMMA); // dark pixels → denser glyph (clamp avoids NaN at the brightest pixel)
          const idx = Math.min(last, Math.round(density * last));
          s += ASCII_RAMP[idx];
        }
        lines.push(s);
      }
      finalRef.current = lines;
      if (preRef.current) preRef.current.textContent = lines.join("\n");
      setReady(true);
    };
    img.onerror = () => setReady(false);
    img.src = src;
    return () => { cancelled = true; };
  }, [src, cols]);

  // "decrypt" reveal once visible
  useEffect(() => {
    if (!ready || !visible || !finalRef.current) return;
    const lines = finalRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (preRef.current) preRef.current.textContent = lines.join("\n");
      return;
    }
    const rows = lines.length;
    const thr = lines.map((line, y) =>
      Array.from(line, () => (y / rows) * 0.5 + Math.random() * 0.5)
    );
    let start = 0;
    const dur = 1500;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      let out = "";
      for (let y = 0; y < rows; y++) {
        const line = lines[y];
        const tr = thr[y];
        for (let x = 0; x < line.length; x++) {
          if (tr[x] <= p) out += line[x];
          else out += SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
        }
        out += "\n";
      }
      if (preRef.current) preRef.current.textContent = out;
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, visible]);

  return (
    <div
      ref={revealRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#070707", border: `1px solid ${C.border}`, borderRadius: 6,
        overflow: "hidden", boxShadow: "0 16px 50px rgba(0,0,0,.6)",
      }}
    >
      {/* window bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
        background: C.panel, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={dot} /><span style={dot} /><span style={dot} />
        <span style={{ marginLeft: 6, fontSize: 11, color: C.muted }}>~/portrait.png — ascii({cols})</span>
      </div>

      {/* render area */}
      <div style={{ position: "relative", padding: "14px 10px", display: "flex", justifyContent: "center" }}>
        <pre
          ref={preRef}
          aria-hidden="true"
          style={{
            margin: 0, fontFamily: C.mono, whiteSpace: "pre",
            fontSize: "clamp(3.6px, 1.5vw, 7px)", lineHeight: 1,
            letterSpacing: 0, color: C.text, userSelect: "none",
            opacity: hover ? 0.1 : 0.95, transition: "opacity .35s ease",
            textShadow: "0 0 1px rgba(255,255,255,0.15)",
          }}
        />
        <img
          src={src}
          alt="zik-zikurrat"
          style={{
            position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
            height: "84%", borderRadius: 3, objectFit: "cover",
            filter: "grayscale(1) contrast(1.08) brightness(1.02)",
            opacity: hover ? 0.96 : 0, transition: "opacity .35s ease", pointerEvents: "none",
          }}
        />
      </div>
      <div style={{
        padding: "8px 12px", borderTop: `1px solid ${C.border}`,
        fontSize: 11, color: C.muted, display: "flex", justifyContent: "space-between",
      }}>
        <span>{ready ? "rendered from pixels" : "loading…"}</span>
        <span style={{ color: C.dim }}>hover → photo</span>
      </div>
    </div>
  );
}

const dot = { width: 10, height: 10, borderRadius: "50%", background: C.border, border: `1px solid ${C.borderHi}` };

/* ───────────────────────── interactive terminal ───────────────────────── */
const HELP = [
  ["help", "list available commands"],
  ["whoami", "short bio"],
  ["ls", "list sections"],
  ["skills", "tech proficiency"],
  ["stack", "tools I work with"],
  ["projects", "list projects"],
  ["open <id>", "open a project demo"],
  ["contact", "how to reach me"],
  ["neofetch", "system info"],
  ["tux", "say hi to tux"],
  ["clear", "clear the screen"],
];

function buildCommands() {
  return {
    help: () => [
      { text: "available commands:", color: C.muted },
      ...HELP.map(([cmd, desc]) => ({ text: `  ${cmd.padEnd(12)} ${desc}` })),
    ],
    whoami: () => [
      { text: "zik-zikurrat — backend engineer, almaty/kz" },
      { text: "go in production, rust & c/c++ just because I like it.", color: C.muted },
    ],
    about: () => [
      { text: "senior go backend developer." },
      { text: "low-level projects in rust & c/c++, embedded on arduino/esp32/rpi.", color: C.muted },
      { text: "reading DDIA, digging into go internals, postgres, kafka.", color: C.muted },
    ],
    ls: () => [{ text: "projects/  skills/  about.txt  contact.txt", color: C.bright }],
    skills: () =>
      SKILLS.map((s) => ({
        text: `  ${s.name.padEnd(14)} ${"#".repeat(Math.round(s.level / 10)).padEnd(10, "·")} ${s.level}%`,
      })),
    stack: () => [{ text: STACK.join(" · "), color: C.text }],
    projects: () =>
      PROJECTS.flatMap((p) => [
        { text: `  ${p.id}  [${p.lang}]`, color: C.bright },
        { text: `    ${p.tagline}`, color: C.muted },
      ]),
    contact: () => [
      { text: `  github   ${CONTACT.github}` },
      { text: `  telegram ${CONTACT.telegram}` },
      { text: `  email    ${CONTACT.email}` },
    ],
    tux: () => TUX.map((l) => ({ text: l, color: C.bright })),
    neofetch: () => {
      const info = [
        "zik@dev — kernel space",
        "os     : linux",
        "shell  : zsh",
        "lang   : go · rust · c/c++",
        "editor : nvim",
        "loc    : almaty, kz",
        "mood   : compiling",
      ];
      return TUX.map((art, i) => ({
        text: `${art}  ${info[i] || ""}`,
        color: i === 0 ? C.bright : C.text,
      }));
    },
    date: () => [{ text: new Date().toString(), color: C.muted }],
    uname: () => [{ text: "zik-os 6.0.0-backend x86_64 GNU/Linux", color: C.muted }],
    sudo: () => [{ text: "nice try. permission denied.", color: C.muted }],
    "rm -rf /": () => [{ text: "rm: refusing to remove '/': are you serious? :)", color: C.text }],
  };
}

const BANNER = [
  { text: "zik-zikurrat — interactive shell ", color: C.bright },
  { text: "type 'help' to get started, 'neofetch' for vibes.", color: C.muted },
];

function Terminal() {
  const commands = useRef(buildCommands());
  const [history, setHistory] = useState([{ prompt: null, lines: BANNER }]);
  const [value, setValue] = useState("");
  const [past, setPast] = useState([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const run = (raw) => {
    const cmd = raw.trim();
    const block = { prompt: raw, lines: [] };
    if (!cmd) {
      setHistory((h) => [...h, block]);
      return;
    }
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    const cmds = commands.current;
    let out;
    if (cmd.startsWith("open ")) {
      const id = cmd.slice(5).trim();
      const p = PROJECTS.find((x) => x.id === id || x.name === id);
      if (!p) out = [{ text: `open: '${id}' not found. try 'projects'.`, color: C.muted }];
      else if (!p.demo) out = [{ text: `${p.id}: demo offline.`, color: C.muted }];
      else {
        window.open(p.demo, "_blank", "noopener");
        out = [{ text: `launching ${p.id} → ${p.demo}`, color: C.bright }];
      }
    } else if (cmd === "cat about.txt" || cmd === "cat about") {
      out = cmds.about();
    } else if (cmds[cmd]) {
      out = cmds[cmd]();
    } else if (cmd.startsWith("echo ")) {
      out = [{ text: cmd.slice(5) }];
    } else {
      out = [{ text: `command not found: ${cmd}. try 'help'.`, color: C.muted }];
    }
    block.lines = out;
    setHistory((h) => [...h, block]);
    setPast((p) => [...p, raw]);
    setPastIdx(-1);
  };

  const onKey = (e) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.length) return;
      const ni = pastIdx === -1 ? past.length - 1 : Math.max(0, pastIdx - 1);
      setPastIdx(ni);
      setValue(past[ni]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (pastIdx === -1) return;
      const ni = pastIdx + 1;
      if (ni >= past.length) {
        setPastIdx(-1);
        setValue("");
      } else {
        setPastIdx(ni);
        setValue(past[ni]);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#070707", border: `1px solid ${C.border}`,
        borderRadius: 6, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,.5)",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
        background: C.panel, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={dot} /><span style={dot} /><span style={dot} />
        <span style={{ marginLeft: 8, fontSize: 12, color: C.muted }}>zik@dev: ~/portfolio</span>
      </div>
      <div
        ref={bodyRef}
        style={{ height: 320, overflowY: "auto", padding: 16, fontSize: 13, lineHeight: 1.65, fontFamily: C.mono }}
      >
        {history.map((b, i) => (
          <div key={i}>
            {b.prompt !== null && (
              <div>
                <span style={{ color: C.bright }}>zik@dev</span>
                <span style={{ color: C.muted }}>:~$ </span>
                <span style={{ color: C.text }}>{b.prompt}</span>
              </div>
            )}
            {b.lines.map((l, j) => (
              <div key={j} style={{ color: l.color || C.text, whiteSpace: "pre-wrap" }}>{l.text}</div>
            ))}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: C.bright }}>zik@dev</span>
          <span style={{ color: C.muted }}>:~$ </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="terminal input"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: C.text, fontFamily: C.mono, fontSize: 13, caretColor: C.bright, marginLeft: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── status / cards ───────────────────────── */
function StatusDot({ status, latency }) {
  const color = status === "online" ? C.bright : status === "checking" ? C.muted : C.dim;
  const label =
    status === "online" ? (latency ? `online ${latency}ms` : "online") :
      status === "checking" ? "pinging…" : "offline";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", background: color,
        boxShadow: status === "online" ? `0 0 8px ${C.bright}` : "none",
        animation: status === "online" ? "pulse 2s ease-in-out infinite" : "none",
      }} />
      <span style={{ fontSize: 11, color, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
    </span>
  );
}

function ProjectCard({ p }) {
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState(p.healthUrl ? "checking" : "offline");
  const [latency, setLatency] = useState(null);
  const langColor = LANG_COLOR[p.lang] || C.text;

  useEffect(() => {
    if (!p.healthUrl) return;
    let alive = true;
    const ping = async () => {
      const t0 = performance.now();
      try {
        await fetch(p.healthUrl, { mode: "no-cors" });
        if (!alive) return;
        setLatency(Math.round(performance.now() - t0));
        setStatus("online");
      } catch {
        if (alive) setStatus("offline");
      }
    };
    ping();
    const t = setInterval(ping, 15000);
    return () => { alive = false; clearInterval(t); };
  }, [p.healthUrl]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel, border: `1px solid ${hover ? C.borderHi : C.border}`,
        borderRadius: 6, padding: 22,
        transition: "border-color .15s, transform .15s, box-shadow .15s",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover ? "0 10px 30px rgba(0,0,0,.5)" : "none",
        display: "flex", flexDirection: "column", gap: 14, height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontFamily: C.mono, padding: "2px 8px",
            border: `1px solid ${langColor}`, color: langColor, borderRadius: 3,
          }}>{p.lang}</span>
          <span style={{ fontFamily: C.mono, fontSize: 15, color: C.text }}>{p.name}</span>
        </div>
        <StatusDot status={status} latency={latency} />
      </div>

      <div>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 6 }}>{p.tagline}</div>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: C.mono, lineHeight: 1.6 }}>{p.concept}</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {p.stack.map((s) => (
          <span key={s} style={{
            fontSize: 11, fontFamily: C.mono, padding: "2px 8px",
            background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 3, color: C.muted,
          }}>{s}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 4 }}>
        <a
          href={p.demo || undefined}
          target={p.demo ? "_blank" : undefined}
          rel={p.demo ? "noopener noreferrer" : undefined}
          style={{
            flex: 1, textAlign: "center", fontFamily: C.mono, fontSize: 12,
            padding: "9px 0", borderRadius: 3, textDecoration: "none",
            background: p.demo ? C.bright : "transparent",
            color: p.demo ? C.bg : C.muted,
            border: p.demo ? "none" : `1px solid ${C.border}`,
            cursor: p.demo ? "pointer" : "not-allowed",
            fontWeight: p.demo ? 700 : 400,
          }}
        >
          {p.demo ? "▶ run demo" : "demo offline"}
        </a>
        <a
          href={p.source}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: "center", fontFamily: C.mono, fontSize: 12,
            padding: "9px 0", borderRadius: 3, textDecoration: "none",
            background: "transparent", color: C.text, border: `1px solid ${C.border}`,
          }}
        >
          source
        </a>
      </div>
    </div>
  );
}

function SkillBar({ s, shown, delay }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, color: C.text }}>{s.name}</span>
        <span style={{ fontSize: 11, color: C.muted }}>{s.note}</span>
      </div>
      <div style={{ height: 8, background: C.panel2, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{
          height: "100%", width: shown ? `${s.level}%` : "0%",
          background: `linear-gradient(90deg, ${C.dim}, ${C.bright})`,
          borderRadius: 4, transition: `width .9s cubic-bezier(.2,.7,.3,1) ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>{children}</div>;
}

/* ───────────────────────── app ───────────────────────── */
export default function App() {
  const [booted, setBooted] = useState(false);
  const [skillsRef, skillsShown] = useReveal();

  if (!booted) return (
    <>
      <GlobalStyles />
      <BootSequence onDone={() => setBooted(true)} />
    </>
  );

  return (
    <>
      <GlobalStyles />
      <CRTOverlay />
      <div style={{
        minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.mono,
        backgroundImage: `linear-gradient(${C.panel2} 1px, transparent 1px), linear-gradient(90deg, ${C.panel2} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

          {/* nav */}
          <nav style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 0", borderBottom: `1px solid ${C.border}`,
            position: "sticky", top: 0, zIndex: 5,
            background: `${C.bg}e6`, backdropFilter: "blur(6px)",
          }}>
            <span style={{ color: C.bright, fontWeight: 700 }}>
              zik-zikurrat<span style={{ color: C.muted }}>.dev</span>
            </span>
            <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
              <a href="#projects" style={navLink}>projects</a>
              <a href="#skills" style={navLink}>skills</a>
              <a href="#about" style={navLink}>about</a>
              <a href="#contact" style={navLink}>contact</a>
            </div>
          </nav>

          {/* hero */}
          <section style={{
            display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 36,
            alignItems: "center", padding: "64px 0 48px",
          }} className="hero-grid">
            <div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
                <span style={{ color: C.bright }}>$</span> whoami
              </div>
              <h1 style={{
                fontSize: "clamp(28px, 4.6vw, 44px)", lineHeight: 1.15, margin: 0,
                fontWeight: 700, letterSpacing: "-0.5px", color: C.text,
              }}>
                Backend engineer.<br />
                <span style={{ color: C.bright }}>Go</span> in production,{" "}
                <span style={{ color: C.bright }}>Rust</span> and{" "}
                <span style={{ color: C.bright }}>C/C++</span> just because I like it.
              </h1>
              <p style={{ maxWidth: 520, color: C.muted, fontSize: 15, lineHeight: 1.7, marginTop: 20 }}>
                I write microservices, sometimes monoliths, and love low-level
                systems. Below are live projects — you can run them right in the
                browser and try them out.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a href="#projects" style={{ ...btn, background: C.bright, color: C.bg, fontWeight: 700 }}>▶ view projects</a>
                <a href="#contact" style={{ ...btn, background: "transparent", color: C.text, border: `1px solid ${C.border}` }}>contact</a>
              </div>
            </div>
            <AsciiPortrait src={PORTRAIT_SRC} />
          </section>

          {/* interactive terminal */}
          <Reveal style={{ paddingBottom: 60 }}>
            <SectionLabel>// TERMINAL — go ahead, type something</SectionLabel>
            <Terminal />
          </Reveal>

          {/* stack */}
          <Reveal style={{ paddingBottom: 60 }}>
            <SectionLabel>// STACK</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STACK.map((t) => (
                <span key={t} style={{
                  fontSize: 12, fontFamily: C.mono, padding: "5px 11px",
                  background: C.panel, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text,
                }}>{t}</span>
              ))}
            </div>
          </Reveal>

          {/* projects */}
          <Reveal>
            <section id="projects" style={{ paddingBottom: 60, scrollMarginTop: 80 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, margin: 0, color: C.text }}>
                  <span style={{ color: C.bright }}>~/</span>projects
                </h2>
                <span style={{ fontSize: 12, color: C.muted }}>{PROJECTS.length} total</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                {PROJECTS.map((p) => <ProjectCard key={p.id} p={p} />)}
              </div>
            </section>
          </Reveal>

          {/* skills */}
          <section id="skills" ref={skillsRef} style={{ paddingBottom: 60, scrollMarginTop: 80 }}>
            <SectionLabel>// SKILLS</SectionLabel>
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6,
              padding: 24, display: "flex", flexDirection: "column", gap: 18,
            }}>
              {SKILLS.map((s, i) => <SkillBar key={s.name} s={s} shown={skillsShown} delay={i * 90} />)}
            </div>
          </section>

          {/* about */}
          <Reveal>
            <section id="about" style={{ paddingBottom: 60, scrollMarginTop: 80 }}>
              <SectionLabel>// ABOUT</SectionLabel>
              <div style={{
                background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: 24, fontSize: 14, lineHeight: 1.8, color: C.text, maxWidth: 680,
              }}>
                Senior Go backend developer. Besides work, I build low-level projects in
                Rust and C/C++, and play with embedded on Arduino/ESP32/Raspberry Pi.
                I read DDIA and dig into Go's internals, Postgres and Kafka.
                I learn by building with my hands — step by step, you know.
              </div>
            </section>
          </Reveal>

          {/* contact */}
          <Reveal>
            <section id="contact" style={{ paddingBottom: 80, scrollMarginTop: 80 }}>
              <SectionLabel>// CONTACT</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" style={contactLink}>
                  <span style={{ color: C.muted }}>github   </span>github.com/zik-zikurrat
                </a>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" style={contactLink}>
                  <span style={{ color: C.muted }}>telegram </span>@zpolev
                </a>
                <a href={`mailto:${CONTACT.email}`} style={contactLink}>
                  <span style={{ color: C.muted }}>email    </span>{CONTACT.email}
                </a>
              </div>
            </section>
          </Reveal>

          <footer style={{
            borderTop: `1px solid ${C.border}`, padding: "24px 0 40px",
            fontSize: 12, color: C.muted, display: "flex",
            justifyContent: "space-between", flexWrap: "wrap", gap: 8,
          }}>
            <span>© 2026 zik-zikurrat</span>
            <span style={{ color: C.dim }}>built from scratch · no frameworks harmed</span>
          </footer>
        </div>
      </div>
    </>
  );
}

const navLink = { color: C.muted, textDecoration: "none", transition: "color .15s" };
const contactLink = { color: C.text, textDecoration: "none" };
const btn = { fontFamily: C.mono, fontSize: 13, padding: "11px 20px", borderRadius: 3, textDecoration: "none" };

function CRTOverlay() {
  return (
    <div
      aria-hidden
      style={{
        pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9999,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)",
        animation: "flicker 7s infinite",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)",
      }} />
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${C.bg}; }
      a:hover { opacity: 0.85; }
      nav a:hover { color: ${C.bright}; }
      @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      @keyframes flicker {
        0%, 100% { opacity: 0.5; }
        48% { opacity: 0.5; }
        50% { opacity: 0.35; }
        52% { opacity: 0.55; }
      }
      ::selection { background: ${C.text}; color: ${C.bg}; }
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 5px; }
      ::-webkit-scrollbar-thumb:hover { background: ${C.borderHi}; }
      @media (max-width: 720px) {
        .hero-grid { grid-template-columns: 1fr !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}
