import { useState, useEffect, useRef } from "react";


const C = {
  bg: "#0a0e0a",
  panel: "#0f140f",
  panel2: "#141a14",
  border: "#1e2a1e",
  text: "#d6e8d6",
  muted: "#6b8068",
  phosphor: "#4ade5e",
  phosphorDim: "#2a8a38",
  amber: "#e8a33d",
  red: "#e25b5b",
  mono: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
};

const PROJECTS = [
  {
    id: "trainers-manager",
    name: "trainers-manager",
    lang: "Go",
    status: "online",
    tagline: "LLM Workout Generator",
    concept: "Kafka-saga · Outbox · background generation via LLM with interleaving in code",
    demo: "http://37.27.33.141",
    source: "https://github.com/zik-zikurrat/trainers-manager",
  },
  {
    id: "in-memory-db",
    name: "in-memory-db",
    lang: "Go",
    status: "offline",
    tagline: "In-memory KV database with CLI and TCP-server",
    concept: "WAL with group commit · future/promise · recovery on start",
    demo: null,
    source: "https://github.com/zik-zikurrat/in-memory-db",
  },
  {
    id: "basic-golang-structures",
    name: "basic-golang-structures",
    lang: "C",
    status: "offline",
    tagline: "Golang data structures on raw C",
    concept: "Slice, HashTable, Mutes/RWMutex, Channel writing by myself on C",
    demo: null,
    source: "https://github.com/zik-zikurrat/basic-golang-structures",
  },
];

const LANG_COLOR = {
  Go: "#4ade5e",
  Rust: "#e8a33d",
  C: "#7ab8e8",
  "C++": "#c97ae8",
};

const BOOT_LINES = [
  "[ 0.000000] zik-zikurrat.dev — booting…",
  "[ 0.000412] cpu: backend engineer / go · rust · c/c++",
  "[ 0.001120] loc: almaty, kz",
  "[ 0.002340] loading services…",
  "[ 0.004511] trainers-manager …… ok",
  "[ 0.005903] kv-store ……………… ok",
  "[ 0.007288] c-structures ………… idle",
  "[ 0.008601] esp32-lab …………… idle",
  "[ 0.010002] ready.",
];

function BootSequence({ onDone }) {
  const [lines, setLines] = useState([]);
  const idx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(onDone, 500);
        return;
      }
      setLines((prev) => [...prev, BOOT_LINES[idx.current]]);
      idx.current += 1;
    }, 180);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.phosphor,
      fontFamily: C.mono, fontSize: 14, padding: "40px 24px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: 0.9 }}>{l}</div>
      ))}
      <span style={{
        display: "inline-block", width: 8, height: 16,
        background: C.phosphor, animation: "blink 1s step-end infinite",
      }} />
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === "online" ? C.phosphor : C.muted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", background: color,
        boxShadow: status === "online" ? `0 0 8px ${C.phosphor}` : "none",
        animation: status === "online" ? "pulse 2s ease-in-out infinite" : "none",
      }} />
      <span style={{ fontSize: 11, color, textTransform: "uppercase", letterSpacing: 1 }}>
        {status}
      </span>
    </span>
  );
}

function ProjectCard({ p }) {
  const [hover, setHover] = useState(false);
  const langColor = LANG_COLOR[p.lang] || C.phosphor;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel, border: `1px solid ${hover ? C.phosphorDim : C.border}`,
        borderRadius: 4, padding: 22, transition: "border-color .15s, transform .15s",
        transform: hover ? "translateY(-2px)" : "none", display: "flex",
        flexDirection: "column", gap: 14,
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
        <StatusDot status={p.status} />
      </div>

      <div>
        <div style={{ fontSize: 14, color: C.text, marginBottom: 6 }}>{p.tagline}</div>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: C.mono, lineHeight: 1.6 }}>
          {p.concept}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <a
          href={p.demo || undefined}
          style={{
            flex: 1, textAlign: "center", fontFamily: C.mono, fontSize: 12,
            padding: "9px 0", borderRadius: 3, textDecoration: "none",
            background: p.demo ? C.phosphor : "transparent",
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

export default function App() {
  const [booted, setBooted] = useState(false);

  if (!booted) return (
    <>
      <GlobalStyles />
      <BootSequence onDone={() => setBooted(true)} />
    </>
  );

  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: "100vh", background: C.bg, color: C.text,
        fontFamily: C.mono,
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>

          {/* nav */}
          <nav style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 0", borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ color: C.phosphor, fontWeight: 700 }}>zik-zikurrat<span style={{ color: C.muted }}>.dev</span></span>
            <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
              <a href="#projects" style={{ color: C.muted, textDecoration: "none" }}>projects</a>
              <a href="#about" style={{ color: C.muted, textDecoration: "none" }}>about</a>
              <a href="#contact" style={{ color: C.muted, textDecoration: "none" }}>contact</a>
            </div>
          </nav>

          {/* hero */}
          <section style={{ padding: "80px 0 60px" }}>
            <div style={{ color: C.phosphor, fontSize: 13, marginBottom: 16 }}>
              <span style={{ color: C.muted }}>$</span> whoami
            </div>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 46px)", lineHeight: 1.15, margin: 0,
              fontWeight: 700, letterSpacing: "-0.5px", color: C.text,
            }}>
              Backend-engineer.<br />
              <span style={{ color: C.phosphor }}>Go</span> in production,{" "}
              <span style={{ color: C.amber }}>Rust</span> and{" "}
              <span style={{ color: "#7ab8e8" }}>C/C++</span> just because I like it.
            </h1>
            <p style={{
              maxWidth: 560, color: C.muted, fontSize: 15, lineHeight: 1.7,
              marginTop: 20,
            }}>
              I write microservices, sometimes monoliths. I love low-level
              programming languages. Below are live projects: you can run them
              right in the browser and try them out.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <a href="#projects" style={{
                fontFamily: C.mono, fontSize: 13, padding: "11px 20px",
                background: C.phosphor, color: C.bg, borderRadius: 3,
                textDecoration: "none", fontWeight: 700,
              }}>▶ view projects</a>
              <a href="#contact" style={{
                fontFamily: C.mono, fontSize: 13, padding: "11px 20px",
                background: "transparent", color: C.text,
                border: `1px solid ${C.border}`, borderRadius: 3, textDecoration: "none",
              }}>contact</a>
            </div>
          </section>

          {/* stack */}
          <section style={{ paddingBottom: 60 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
              // STACK
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Go", "Kafka", "PostgreSQL", "Redis", "gRPC", "Kubernetes", "Docker", "Rust", "C", "C++", "ESP32"].map((t) => (
                <span key={t} style={{
                  fontSize: 12, fontFamily: C.mono, padding: "5px 11px",
                  background: C.panel, border: `1px solid ${C.border}`,
                  borderRadius: 3, color: C.text,
                }}>{t}</span>
              ))}
            </div>
          </section>

          {/* projects */}
          <section id="projects" style={{ paddingBottom: 60 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              marginBottom: 24,
            }}>
              <h2 style={{ fontSize: 20, margin: 0, color: C.text }}>
                <span style={{ color: C.phosphor }}>~/</span>projects
              </h2>
              <span style={{ fontSize: 12, color: C.muted }}>
                {PROJECTS.filter((p) => p.status === "online").length} online ·{" "}
                {PROJECTS.length} total
              </span>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}>
              {PROJECTS.map((p) => <ProjectCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* about */}
          <section id="about" style={{ paddingBottom: 60 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
              // ABOUT
            </div>
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`, borderRadius: 4,
              padding: 24, fontSize: 14, lineHeight: 1.8, color: C.text, maxWidth: 680,
            }}>
              Senior Go Backend Developer.
              Besides work, I work on low-level projects in Rust and C/C++., embedded on
              Arduino/ESP32/Raspberry Pi, reading DDIA and digging into Go's internals, Postgres, Kafka.
              I learn by collecting with my hands - step by step you know.
            </div>
          </section>

          {/* contact / footer */}
          <section id="contact" style={{ paddingBottom: 80 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
              // CONTACT
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <a href="https://github.com/zik-zikurrat" style={{ color: C.phosphor, textDecoration: "none" }}>
                <span style={{ color: C.muted }}>github  </span>github.com/zik-zikurrat
              </a>
              <a href="https://t.me/zik-zikurrat" style={{ color: C.phosphor, textDecoration: "none" }}>
                <span style={{ color: C.muted }}>telegram</span> @zpolev
              </a>
              <a href="mailto:zakariyapolevchshikov@proton.me" style={{ color: C.phosphor, textDecoration: "none" }}>
                <span style={{ color: C.muted }}>email   </span>zakariyapolevchshikov@proton.me
              </a>
            </div>
          </section>

          <footer style={{
            borderTop: `1px solid ${C.border}`, padding: "24px 0 40px",
            fontSize: 12, color: C.muted, display: "flex", justifyContent: "space-between",
          }}>
            <span>© 2026 zik-zikurrat</span>
            <span style={{ color: C.phosphorDim }}>built from scratch · no frameworks harmed</span>
          </footer>
        </div>
      </div>
    </>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; }
      a:hover { opacity: 0.85; }
      @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      ::selection { background: ${C.phosphorDim}; color: ${C.bg}; }
    `}</style>
  );
}
