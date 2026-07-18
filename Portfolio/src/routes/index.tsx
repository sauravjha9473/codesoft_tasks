import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import portraitAsset from "@/assets/saurav.jpeg.asset.json";

import resumeAsset from "@/assets/resume.pdf.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const RESUME_FILENAME = "Saurav_Jha_Resume.pdf";
const RESUME_SIZE_KB = Math.round(resumeAsset.size / 1024);

type DownloadStatus = "idle" | "downloading" | "done" | "error";


const styles = `
  .sj-root *, .sj-root *::before, .sj-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sj-root {
    --bg:#0b0f19; --surface:#131929; --card:#1a2235; --border:#243050;
    --accent:#4f8ef7; --accent2:#7c3aed; --glow:rgba(79,142,247,0.18);
    --text:#e2e8f7; --muted:#8898bb; --white:#fff;
    --grad:linear-gradient(135deg,#4f8ef7 0%,#7c3aed 100%);
    font-family:'Space Grotesk',sans-serif; background:var(--bg); color:var(--text);
    line-height:1.6; overflow-x:hidden; min-height:100vh; scroll-behavior:smooth;
  }
  .sj-root a { color:inherit; text-decoration:none; }
  .sj-root::before {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none; z-index:0;
  }
  .sj-nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:18px 6%; background:rgba(11,15,25,0.85); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
  .sj-logo { font-family:'Space Mono',monospace; font-size:1.1rem; font-weight:700; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .sj-nav ul { display:flex; gap:32px; list-style:none; }
  .sj-nav ul a { font-size:0.88rem; font-weight:500; color:var(--muted); letter-spacing:0.04em; transition:color .2s; }
  .sj-nav ul a:hover { color:var(--white); }

  .sj-hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 6% 80px; position:relative; }
  .sj-hero::after { content:''; position:absolute; width:600px; height:600px; background:radial-gradient(circle,rgba(79,142,247,0.12) 0%,transparent 70%); top:50%; left:50%; transform:translate(-50%,-55%); pointer-events:none; }
  .sj-tag { display:inline-block; font-family:'Space Mono',monospace; font-size:0.78rem; color:var(--accent); border:1px solid var(--accent); border-radius:20px; padding:5px 16px; margin-bottom:28px; letter-spacing:0.1em; }
  .sj-hero h1 { font-size:clamp(2.8rem,7vw,5.5rem); font-weight:700; line-height:1.08; letter-spacing:-0.02em; margin-bottom:18px; position:relative; z-index:1; }
  .sj-hero h1 span { background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .sj-sub { font-size:1.15rem; color:var(--muted); max-width:520px; margin:0 auto 40px; line-height:1.7; }
  .sj-cta { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .sj-btn-primary { padding:13px 32px; background:var(--grad); border-radius:8px; font-weight:600; font-size:0.95rem; color:var(--white); letter-spacing:0.02em; transition:opacity .2s,transform .2s; border:0; cursor:pointer; }
  .sj-btn-primary:hover { opacity:0.88; transform:translateY(-2px); }
  .sj-btn-outline { padding:13px 32px; background:transparent; border:1px solid var(--border); border-radius:8px; font-weight:500; font-size:0.95rem; color:var(--muted); transition:.2s; cursor:pointer; }
  .sj-btn-outline:hover { border-color:var(--accent); color:var(--white); transform:translateY(-2px); }
  .sj-scroll { position:absolute; bottom:36px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--muted); font-size:0.75rem; letter-spacing:0.1em; }
  .sj-scroll::after { content:''; width:1px; height:40px; background:linear-gradient(to bottom,var(--muted),transparent); }

  .sj-section { padding:90px 6%; max-width:1100px; margin:0 auto; position:relative; }
  .sj-section-wide { padding:90px 6%; background:var(--surface); }
  .sj-section-wide-inner { max-width:1100px; margin:0 auto; }
  .sj-label { font-family:'Space Mono',monospace; font-size:0.75rem; color:var(--accent); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:10px; }
  .sj-title { font-size:clamp(1.7rem,3.5vw,2.4rem); font-weight:700; color:var(--white); letter-spacing:-0.02em; margin-bottom:40px; line-height:1.2; }

  .sj-about { display:grid; grid-template-columns:340px 1fr; gap:60px; align-items:center; }
  .sj-portrait { position:relative; border-radius:20px; overflow:hidden; border:1px solid var(--border); aspect-ratio:1; box-shadow:0 20px 60px -20px rgba(79,142,247,0.35); }
  .sj-portrait img { width:100%; height:100%; object-fit:cover; display:block; }
  .sj-portrait::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 60%,rgba(124,58,237,0.25)); pointer-events:none; }
  .sj-about-text p { color:var(--muted); font-size:1rem; line-height:1.8; margin-bottom:18px; }
  .sj-about-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
  .sj-about-tag { display:inline-flex; align-items:center; gap:6px; font-size:0.82rem; font-weight:500; color:var(--text); background:var(--card); border:1px solid var(--border); border-radius:999px; padding:6px 12px; transition:.2s; }
  .sj-about-tag:hover { border-color:var(--accent); color:var(--white); transform:translateY(-1px); }

  .sj-stats { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
  .sj-stat { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:22px 20px; text-align:center; }
  .sj-stat .num { font-family:'Space Mono',monospace; font-size:2rem; font-weight:700; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .sj-stat .label { font-size:0.82rem; color:var(--muted); margin-top:4px; }

  .sj-skills { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:16px; }
  .sj-skill { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:18px 16px; text-align:center; transition:.2s; }
  .sj-skill:hover { border-color:var(--accent); transform:translateY(-3px); }
  .sj-skill .icon { font-size:1.6rem; margin-bottom:8px; display:block; }
  .sj-skill .name { font-size:0.88rem; font-weight:600; color:var(--text); }
  .sj-skill .level { font-size:0.75rem; color:var(--muted); margin-top:4px; }
  .sj-bar-wrap { margin-top:8px; background:var(--border); border-radius:4px; height:4px; }
  .sj-bar { height:4px; border-radius:4px; background:var(--grad); }

  .sj-projects { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
  .sj-project { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; position:relative; overflow:hidden; transition:.25s; }
  .sj-project:hover { border-color:var(--accent); transform:translateY(-4px); }
  .sj-project::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--grad); opacity:0; transition:.25s; }
  .sj-project:hover::before { opacity:1; }
  .sj-ptag { display:inline-block; font-size:0.72rem; font-weight:600; color:var(--accent); background:var(--glow); border-radius:4px; padding:3px 10px; margin-bottom:14px; letter-spacing:0.06em; text-transform:uppercase; }
  .sj-project h3 { font-size:1.1rem; font-weight:700; color:var(--white); margin-bottom:10px; }
  .sj-project p { font-size:0.9rem; color:var(--muted); line-height:1.65; margin-bottom:18px; }
  .sj-tech { display:flex; flex-wrap:wrap; gap:8px; }
  .sj-tech span { font-family:'Space Mono',monospace; font-size:0.72rem; color:var(--muted); background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:3px 10px; }
  .sj-badge { position:absolute; top:20px; right:20px; font-size:0.7rem; font-weight:700; color:var(--accent2); background:rgba(124,58,237,0.15); border:1px solid rgba(124,58,237,0.4); border-radius:20px; padding:3px 10px; letter-spacing:0.06em; }

  .sj-resume-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:44px; display:flex; align-items:center; justify-content:space-between; gap:32px; flex-wrap:wrap; position:relative; overflow:hidden; }
  .sj-resume-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 100% 0%,rgba(124,58,237,0.12),transparent 60%); pointer-events:none; }
  .sj-resume-card h3 { font-size:1.4rem; color:var(--white); font-weight:700; margin-bottom:8px; }
  .sj-resume-card p { color:var(--muted); max-width:460px; margin-bottom:14px; }
  .sj-resume-file { display:inline-flex; align-items:center; gap:10px; font-family:'Space Mono',monospace; font-size:0.78rem; color:var(--muted); background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:6px 12px; }
  .sj-resume-file .fname { color:var(--text); }
  .sj-resume-actions { display:flex; flex-direction:column; align-items:flex-end; gap:10px; position:relative; z-index:1; }
  .sj-resume-status { font-family:'Space Mono',monospace; font-size:0.74rem; letter-spacing:0.08em; text-transform:uppercase; display:inline-flex; align-items:center; gap:8px; }
  .sj-resume-status.idle { color:var(--muted); }
  .sj-resume-status.downloading { color:var(--accent); }
  .sj-resume-status.done { color:#4ade80; }
  .sj-resume-status.error { color:#f87171; }
  .sj-dot { width:8px; height:8px; border-radius:50%; background:currentColor; }
  .sj-dot.pulse { animation: sjPulse 1s ease-in-out infinite; }
  @keyframes sjPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(0.7);} }


  .sj-contact-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:60px 40px; position:relative; overflow:hidden; text-align:center; }
  .sj-contact-card::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%,rgba(79,142,247,0.08) 0%,transparent 65%); pointer-events:none; }
  .sj-contact-card h2 { font-size:clamp(1.6rem,3vw,2.2rem); font-weight:700; color:var(--white); margin-bottom:14px; }
  .sj-contact-card p { color:var(--muted); max-width:440px; margin:0 auto 36px; line-height:1.7; }
  .sj-contacts { display:flex; justify-content:center; gap:16px; flex-wrap:wrap; }
  .sj-contacts a { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:12px 22px; font-size:0.9rem; font-weight:500; color:var(--text); transition:.2s; position:relative; z-index:1; }
  .sj-contacts a:hover { border-color:var(--accent); color:var(--white); transform:translateY(-2px); }

  .sj-footer { text-align:center; padding:28px 6%; border-top:1px solid var(--border); color:var(--muted); font-size:0.82rem; }
  .sj-footer span { background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:600; }

  @media (max-width:768px){
    .sj-about { grid-template-columns:1fr; gap:36px; }
    .sj-nav ul { display:none; }
    .sj-hero h1 { font-size:2.6rem; }
    .sj-contact-card { padding:40px 20px; }
    .sj-resume-card { padding:32px 24px; }
  }
`;

const skills = [
  { icon: "🌐", name: "HTML5", level: "Comfortable", pct: 85 },
  { icon: "🎨", name: "CSS3", level: "Comfortable", pct: 80 },
  { icon: "☕", name: "Java", level: "Basics (OOP)", pct: 55 },
  { icon: "⚡", name: "JavaScript", level: "Learning", pct: 40 },
  { icon: "🛠️", name: "VS Code", level: "Daily Driver", pct: 90 },
  { icon: "🐙", name: "Git", level: "Basics", pct: 45 },
];

function Index() {
  const [status, setStatus] = useState<DownloadStatus>("idle");

  const handleDownload = async () => {
    setStatus("downloading");
    try {
      const res = await fetch(resumeAsset.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = RESUME_FILENAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Resume download failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const statusLabel: Record<DownloadStatus, string> = {
    idle: "Ready to download",
    downloading: "Downloading…",
    done: `Downloaded ${RESUME_FILENAME}`,
    error: "Download failed — try again",
  };

  return (
    <div className="sj-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />


      <nav className="sj-nav">
        <div className="sj-logo">SJ.dev</div>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#resume">Resume</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="sj-hero">
        <span className="sj-tag">👋 AVAILABLE FOR FREELANCE WORK</span>
        <h1>Hi, I'm <span>Saurav Jha</span></h1>
        <p className="sj-sub">
          Aspiring web developer & CS undergraduate building clean, purposeful websites — one line of code at a time.
        </p>
        <div className="sj-cta">
          <a className="sj-btn-primary" href="#projects">View Projects</a>
          <a className="sj-btn-outline" href="#contact">Get in Touch</a>
        </div>
        <div className="sj-scroll">SCROLL</div>
      </header>

      <section id="about" className="sj-section">
        <div className="sj-label">// about me</div>
        <h2 className="sj-title">Who I Am</h2>
        <div className="sj-about">
          <div className="sj-portrait">
            <img src={portraitAsset.url} alt="Portrait of Saurav Jha" width={1024} height={1024} />
          </div>
          <div className="sj-about-text">
            <p>I'm Saurav Jha, a 3rd-year B.Tech Computer Science student at KCC Institute of Technology and Management, Greater Noida.</p>
            <p>I'm passionate about building things for the web. Starting with HTML & CSS, I'm working my way toward becoming a full-stack web developer and taking on freelance projects for real clients.</p>
            <p>I believe in learning by doing — every project teaches me something new, and I'm just getting started.</p>
            <div className="sj-about-tags">
              {skills.map((s) => (
                <span key={s.name} className="sj-about-tag">
                  <span aria-hidden>{s.icon}</span> {s.name}
                </span>
              ))}
            </div>
            <div className="sj-stats">
              <div className="sj-stat"><div className="num">3rd</div><div className="label">Year B.Tech CSE</div></div>
              <div className="sj-stat"><div className="num">2+</div><div className="label">Languages Learning</div></div>
              <div className="sj-stat"><div className="num">∞</div><div className="label">Curiosity</div></div>
              <div className="sj-stat"><div className="num">1</div><div className="label">Goal: Build & Freelance</div></div>
            </div>

          </div>
        </div>
      </section>

      <section id="skills" className="sj-section-wide">
        <div className="sj-section-wide-inner">
          <div className="sj-label">// what i know</div>
          <h2 className="sj-title">Skills & Tools</h2>
          <div className="sj-skills">
            {skills.map((s) => (
              <div key={s.name} className="sj-skill">
                <span className="icon">{s.icon}</span>
                <div className="name">{s.name}</div>
                <div className="level">{s.level}</div>
                <div className="sj-bar-wrap"><div className="sj-bar" style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="sj-section">
        <div className="sj-label">// my work</div>
        <h2 className="sj-title">Projects</h2>
        <div className="sj-projects">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sj-project"
            aria-label="Open Personal Portfolio Website in a new tab"
          >
            <span className="sj-badge">LIVE</span>
            <div className="sj-ptag">Portfolio</div>
            <h3>Personal Portfolio Website ↗</h3>
            <p>This website itself — a clean, responsive portfolio to showcase my skills, projects, and contact information to potential clients and employers.</p>
            <div className="sj-tech"><span>HTML5</span><span>CSS3</span><span>Responsive</span></div>
          </a>

          <article className="sj-project">
            <span className="sj-badge">COMING SOON</span>
            <div className="sj-ptag">Web Dev</div>
            <h3>Restaurant Landing Page</h3>
            <p>A modern, visually rich landing page for a local restaurant — featuring a menu section, location, and contact details. Built for real-world freelance practice.</p>
            <div className="sj-tech"><span>HTML5</span><span>CSS3</span><span>Flexbox</span></div>
          </article>
          <article className="sj-project">
            <span className="sj-badge">COMING SOON</span>
            <div className="sj-ptag">JavaScript</div>
            <h3>Interactive Quiz App</h3>
            <p>A browser-based quiz app with score tracking and a timer — my first JavaScript project as I expand beyond HTML & CSS.</p>
            <div className="sj-tech"><span>HTML5</span><span>CSS3</span><span>JavaScript</span></div>
          </article>
        </div>
      </section>

      <section id="resume" className="sj-section">
        <div className="sj-label">// resume</div>
        <h2 className="sj-title">Grab My Resume</h2>
        <div className="sj-resume-card">
          <div>
            <h3>Saurav Jha — CV / Resume</h3>
            <p>A one-page snapshot of my education, skills, and projects. Perfect if you're thinking of hiring me for a freelance gig or an internship.</p>
            <div className="sj-resume-file">
              <span>📄</span>
              <span className="fname">{RESUME_FILENAME}</span>
              <span>·</span>
              <span>PDF</span>
              <span>·</span>
              <span>{RESUME_SIZE_KB} KB</span>
            </div>
          </div>
          <div className="sj-resume-actions">
            <button
              type="button"
              className="sj-btn-primary"
              onClick={handleDownload}
              disabled={status === "downloading"}
              style={status === "downloading" ? { opacity: 0.7, cursor: "wait" } : undefined}
            >
              {status === "downloading" ? "Downloading…" : status === "done" ? "✓ Downloaded" : "⬇ Download PDF"}
            </button>
            <div className={`sj-resume-status ${status}`} role="status" aria-live="polite">
              <span className={`sj-dot ${status === "downloading" ? "pulse" : ""}`} />
              {statusLabel[status]}
            </div>
          </div>
        </div>
      </section>


      <section id="contact" className="sj-section">
        <div className="sj-contact-card">
          <div className="sj-label">// let's connect</div>
          <h2>Open to Freelance & Opportunities</h2>
          <p>Whether you have a project in mind, a question, or just want to say hello — my inbox is always open.</p>
          <div className="sj-contacts">
            <a href="mailto:sauravjha9473@gmail.com"><span>✉️</span> sauravjha9473@gmail.com</a>
            <a href="tel:+916203254954"><span>📞</span> +91 6203254954</a>
            <a href="#" aria-label="LinkedIn"><span>💼</span> LinkedIn</a>
            <a href="#" aria-label="GitHub"><span>🐙</span> GitHub</a>
          </div>
        </div>
      </section>

      <footer className="sj-footer">
        Designed & built by <span>Saurav Jha</span> · Greater Noida, India · 2026
      </footer>
    </div>
  );
}
