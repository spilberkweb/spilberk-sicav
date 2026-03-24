import React, { useState, useEffect, useRef } from "react";
import { translations, type Language } from "./translations";
import { getProjectDesc, getTeamData } from "./projectData";

function Counter({ end, suffix = "", prefix = "", decimals = 0, duration = 2000 }: {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - t0) / duration, 1);
          setVal((1 - Math.pow(1 - t, 3)) * end);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("cs-CZ")}
      {suffix}
    </span>
  );
}

function SRIGauge() {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div
          key={i}
          style={{
            width: 38,
            height: 30,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: i <= 3 ? (i === 3 ? "var(--chart-3)" : "color-mix(in srgb, var(--chart-3) 15%, transparent)") : "var(--accent)",
            border: i === 3 ? "2px solid var(--chart-3)" : "1px solid var(--border)",
            fontSize: 13,
            fontWeight: i === 3 ? 800 : 500,
            color: i === 3 ? "var(--primary-foreground)" : (i < 3 ? "var(--foreground)" : "var(--muted-foreground)"),
          }}
        >
          {i}
        </div>
      ))}
    </div>
  );
}

function NAVChart({ label }: { label: string }) {
  const data = [
    { y: "2019", v: 620 },
    { y: "2020", v: 780 },
    { y: "2021", v: 950 },
    { y: "2022", v: 1120 },
    { y: "2023", v: 1273 },
    { y: "2024", v: 1277 }
  ];
  const max = 1500, w = 540, h = 200, px = 48, py = 16, cW = w - px * 2, cH = h - py * 2;
  const pts = data.map((d, i) => ({
    x: px + i / (data.length - 1) * cW,
    y: py + cH - d.v / max * cH,
    year: d.y,
    v: d.v
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h - py} L${pts[0].x},${h - py} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%" }}>
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 500, 1000, 1500].map(v => (
        <g key={v}>
          <line
            x1={px}
            x2={w - px}
            y1={py + cH - v / max * cH}
            y2={py + cH - v / max * cH}
            stroke="var(--border)"
            strokeDasharray="3,3"
          />
          <text
            x={px - 6}
            y={py + cH - v / max * cH + 4}
            textAnchor="end"
            fill="var(--muted-foreground)"
            fontSize="9"
            fontFamily="inherit"
          >
            {v === 0 ? "0" : `${(v / 1000).toFixed(1)}`}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#ng)" />
      <path d={line} fill="none" stroke="var(--chart-3)" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(p => (
        <g key={p.year}>
          <circle cx={p.x} cy={p.y} r="4" fill="var(--card)" stroke="var(--chart-3)" strokeWidth="2" />
          <text
            x={p.x}
            y={h - 2}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="9"
            fontFamily="inherit"
          >
            {p.year}
          </text>
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fill="var(--foreground)"
            fontSize="9"
            fontWeight="700"
            fontFamily="inherit"
          >
            {(p.v / 1000).toFixed(2)}
          </text>
        </g>
      ))}
      <text
        x={w / 2}
        y={12}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="9"
        fontFamily="inherit"
        fontWeight="600"
        style={{ textTransform: "uppercase" }}
        letterSpacing="1px"
      >
        {label}
      </text>
    </svg>
  );
}

function PerfBar({ year, val }: { year: string; val: number }) {
  const heightPercent = Math.max(5, (val - 6) / 2 * 100);
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--chart-3)", marginBottom: 12 }}>
        <Counter end={val} decimals={2} suffix="%" />
      </div>
      <div style={{
        height: 120,
        width: "100%",
        maxWidth: 40,
        background: "color-mix(in srgb, var(--chart-3) 8%, transparent)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        marginBottom: 12,
        position: "relative",
        boxShadow: "inset 0 1px 4px color-mix(in srgb, var(--foreground) 5%, transparent)"
      }}>
        <div style={{
          width: "100%",
          height: `${heightPercent}%`,
          background: "linear-gradient(180deg, var(--chart-3) 0%, color-mix(in srgb, var(--chart-3) 80%, black) 100%)",
          borderRadius: "4px 4px 2px 2px",
          transition: "height 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 4px 12px color-mix(in srgb, var(--chart-3) 30%, transparent)",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)", borderRadius: "4px 4px 0 0" }} />
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>{year}</div>
    </div>
  );
}

const CDN = "https://cdn.sanity.io/images/by9osh4f/production";
const IMG = {
  v24: `${CDN}/798ca72b1c8a3026f61ef19bad8e693c29fbed93-2080x1387.jpg?w=600&h=400&fit=crop`,
  b45: `${CDN}/5a8fad7d390aaea7511975995860985f56277e8c-1200x799.jpg?w=600&h=400&fit=crop`,
  cejl: `${CDN}/fb84e2d9fab1ec7f19782543095d1f04b7d930af-2000x1653.jpg?w=600&h=400&fit=crop`,
  b47: `${CDN}/d946b4fd18b764f0f7ed39f8023160d035ac1378-2844x1582.png?w=600&h=400&fit=crop`,
  kladno: `${CDN}/1f447c85bdcb2489e0177731c41f4d3e73b8e4dc-1721x942.png?w=600&h=400&fit=crop`,
  platany: `${CDN}/e17bff0e3b809a32fd7090015e296d6818e95061-2041x1275.png?w=600&h=400&fit=crop`,
  vysk: `${CDN}/7b6c6c14ec8da194a6d3331c840bff08395a22f2-2560x1709.jpg?w=600&h=400&fit=crop`,
  lans: `${CDN}/71e673b390ed795381cec8a024b909810d1470fe-2560x1708.jpg?w=600&h=400&fit=crop`,
  kyjov: `${CDN}/ef5ffc9b981b31b41715268f0422091315101fb9-4032x3024.jpg?w=600&h=400&fit=crop`,
  ski: `${CDN}/3b1479de3607c10d11bc9b06e3dfa92cc570dd56-2163x1079.png?w=600&h=400&fit=crop`,
  chodov: `${CDN}/7865947080abca2b61570c0dc9de6e690048af1c-505x269.jpg?w=600&h=400&fit=crop`,
  invest: `${CDN}/3ab25d31d11776d100528160faefd6f9f7d8db6e-1650x800.webp?w=800&h=400`,
  martin: `${CDN}/9d1f18c37bbccae372fc8601f2f5c13120b836b0-1366x2048.jpg?rect=0,162,1366,1366&w=200&h=200&fit=crop`,
  robert: `${CDN}/6ced2722ca5d0738bbc033fe71c51120d13f01d3-2048x1535.jpg?rect=599,288,892,892&w=200&h=200&fit=crop`,
  jaromir: `${CDN}/d6aba59d75b744b16fa89d46555ff7b924f04989-1535x2048.jpg?rect=63,297,1415,1415&w=200&h=200&fit=crop`,
  matej: `${CDN}/89715f22b242ad8f3168e22187de0dea17863efc-1535x2048.jpg?rect=86,62,1432,1432&w=200&h=200&fit=crop`,
  sarka: `${CDN}/4066695b5b221af939e72fc638910cf8c86f42de-1535x2048.jpg?rect=0,220,1535,1535&w=200&h=200&fit=crop`,
  dominika: `${CDN}/075cf3e8abce5e6eece0c25174c329d9e8caaa72-2048x1535.jpg?rect=582,137,1022,1022&w=200&h=200&fit=crop`,
};

export default function App() {
  const [tab, setTab] = useState("all");
  const [scrollY, setScrollY] = useState(0);
  const [lang, setLang] = useState<Language>("cs");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const h = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const projects = [
    { key: "v24", name: "Urbanblok V24", loc: "Vlhká, Brno", units: 101, cat: "rental", status: "new", img: IMG.v24, link: "v24.urbanblok.cz" },
    { key: "b45", name: "Urbanblok B45", loc: "Bratislavská, Brno", units: 162, cat: "rental", status: "active", img: IMG.b45, link: "b45.urbanblok.cz" },
    { key: "cejl", name: "Nový Cejl", loc: "Cejl 79, Brno", units: 101, cat: "rental", status: "active", img: IMG.cejl, link: "novy-cejl.cz" },
    { key: "b47", name: "Bratislavská 47", loc: "Bratislavská, Brno", units: 330, cat: "development", status: "new", img: IMG.b47 },
    { key: "kladno", name: "Kladno - Na Šestém", loc: "Kladno, ČR", units: 488, cat: "development", status: "prep", img: IMG.kladno },
    { key: "platany", name: "Pod Platany", loc: "Židenice, Brno", units: 110, cat: "development", status: "prep", img: IMG.platany },
    { key: "vysk", name: "Retail Park Vyškov", loc: "Vyškov, ČR", units: null, cat: "retail", status: "active", img: IMG.vysk },
    { key: "lans", name: "Retail Park Lanškroun", loc: "Lanškroun, ČR", units: null, cat: "retail", status: "active", img: IMG.lans },
    { key: "kyjov", name: "Retail Park Kyjov", loc: "Kyjov, ČR", units: null, cat: "retail", status: "active", img: IMG.kyjov },
    { key: "ski", name: "Projekt Klínovec", loc: "Klínovec", units: null, cat: "prep", status: "prep", img: IMG.ski },
    { key: "chodov", name: "Projekt Praha", loc: "Praha", units: null, cat: "prep", status: "prep", img: IMG.chodov },
  ];

  const cats = [
    { key: "all", label: t.projects.all },
    { key: "rental", label: t.projects.rental },
    { key: "development", label: t.projects.development },
    { key: "retail", label: t.projects.retail },
    { key: "prep", label: t.projects.prep },
  ];

  const filtered = tab === "all" ? projects : projects.filter(p => p.cat === tab);

  const teamData = getTeamData(lang);
  const team = [
    { ...teamData[0], img: IMG.martin },
    { ...teamData[1], img: IMG.robert },
    { ...teamData[2], img: null },
    { ...teamData[3], img: IMG.matej },
    { ...teamData[4], img: IMG.sarka },
    { ...teamData[5], img: IMG.dominika },
    { ...teamData[6], img: null },
  ];

  const c = {
    gold: "var(--chart-3)",
    bg: "var(--background)",
    card: "var(--card)",
    text: "var(--foreground)",
    border: "var(--border)",
    muted: "var(--muted-foreground)",
    faint: "color-mix(in srgb, var(--foreground) 50%, transparent)",
    ghostHover: "color-mix(in srgb, var(--foreground) 10%, transparent)"
  };

  const S = {
    section: { maxWidth: 1120, margin: "0 auto", padding: "90px 36px" },
    label: { fontSize: 10, textTransform: "uppercase" as const, letterSpacing: 3, color: c.gold, fontWeight: 700, marginBottom: 10, display: "block" },
    h2: { fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: c.text },
    sub: { fontSize: 15, color: c.muted, lineHeight: 1.7, marginBottom: 40, maxWidth: "100%" },
    card: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s, transform 0.3s", boxShadow: "0 4px 15px color-mix(in srgb, var(--foreground) 3%, transparent)" },
    kpi: { background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "26px 28px", textAlign: "center" as const, boxShadow: "0 4px 15px color-mix(in srgb, var(--foreground) 3%, transparent)" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", background: c.gold, color: "var(--primary-foreground)", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 50, cursor: "pointer", transition: "opacity 0.2s" },
    ghost: { display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "transparent", color: c.text, fontWeight: 600, fontSize: 13, border: `1px solid color-mix(in srgb, var(--foreground) 20%, transparent)`, borderRadius: 50, cursor: "pointer" },
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: c.bg, color: c.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        .main-nav, .main-footer {
          background: var(--nav-bg) !important;
          backdrop-filter: none !important;
          --foreground: var(--nav-text);
          --border: color-mix(in srgb, var(--nav-text) 15%, transparent);
          --background: var(--nav-bg);
          color: var(--nav-text); /* Ensure direct text inherits correctly */
        }
        .main-nav {
          border-bottom: 1px solid color-mix(in srgb, var(--nav-text) 15%, transparent) !important;
        }
        .main-footer {
          border-top: 1px solid color-mix(in srgb, var(--nav-text) 15%, transparent) !important;
        }
        .desktop-menu { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        @media (max-width: 899px) {
          .mobile-menu-dropdown {
            background: var(--nav-bg) !important;
            backdrop-filter: none !important;
          }
        }
        @media (min-width: 900px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-menu-dropdown { display: none !important; }
        }
      `}</style>

      <nav className="dark main-nav" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "14px 20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        background: scrollY > 60 || menuOpen ? "color-mix(in srgb, var(--background) 96%, transparent)" : "transparent",
        backdropFilter: scrollY > 60 || menuOpen ? "blur(24px)" : "none",
        borderBottom: scrollY > 60 || menuOpen ? `1px solid ${c.border}` : "none",
        transition: "all 0.35s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            background: c.gold,
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: c.bg,
            fontSize: 15
          }}>S</div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2.5, color: c.text }}>SPILBERK</span>
            <span style={{ fontSize: 9, color: c.faint, letterSpacing: 1.5, marginLeft: 6 }}>investiční fond SICAV</span>
          </div>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: c.ghostHover,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: "8px",
            color: c.text,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="desktop-menu" style={{ gap: 28, alignItems: "center" }}>
          {[
            { label: t.nav.about, href: "#o-fondu" },
            { label: t.nav.strategy, href: "#strategie" },
            { label: t.nav.projects, href: "#projekty" },
            { label: t.nav.performance, href: "#vykonnost" },
            { label: t.nav.team, href: "#tym" },
            { label: t.nav.contact, href: "#kontakt" },
            { label: t.nav.documents, href: "https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/#funds-files-block_66a00e4ba6bdae49f7f97f19e0c54fe3", external: true }
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (item.external) return;
                e.preventDefault();
                const element = document.querySelector(item.href);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                color: c.faint,
                textDecoration: "none",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = c.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = c.faint)}
            >
              {item.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            {(["cs", "en", "it"] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "5px 9px",
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  border: lang === l ? `1px solid ${c.gold}` : `1px solid ${c.border}`,
                  background: lang === l ? "color-mix(in srgb, var(--chart-3) 15%, transparent)" : "transparent",
                  color: lang === l ? c.gold : c.faint,
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => window.open("https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/", "_blank")} style={{ ...S.cta, padding: "9px 22px", fontSize: 12.5, whiteSpace: "nowrap" }}>{t.nav.invest}</button>
        </div>

        <div
          className="mobile-menu-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "color-mix(in srgb, var(--background) 96%, transparent)",
            backdropFilter: "blur(24px)",
            borderBottom: menuOpen ? `1px solid ${c.border}` : "none",
            borderTop: menuOpen ? `1px solid ${c.border}` : "none",
            padding: menuOpen ? "24px 20px" : "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 99,
            boxShadow: menuOpen ? "0 20px 40px color-mix(in srgb, var(--foreground) 80%, transparent)" : "none",
            transition: "all 0.3s ease",
            maxHeight: menuOpen ? "100vh" : 0,
            overflow: "hidden",
            opacity: menuOpen ? 1 : 0,
            visibility: menuOpen ? "visible" : "hidden"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: t.nav.about, href: "#o-fondu" },
              { label: t.nav.strategy, href: "#strategie" },
              { label: t.nav.projects, href: "#projekty" },
              { label: t.nav.performance, href: "#vykonnost" },
              { label: t.nav.team, href: "#tym" },
              { label: t.nav.contact, href: "#kontakt" },
              { label: t.nav.documents, href: "https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/#funds-files-block_66a00e4ba6bdae49f7f97f19e0c54fe3", external: true }
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (item.external) {
                    setMenuOpen(false);
                    return;
                  }
                  e.preventDefault();
                  setMenuOpen(false);
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  color: c.text,
                  textDecoration: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "6px 0",
                  borderBottom: `1px solid ${c.border}`
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["cs", "en", "it"] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setMenuOpen(false);
                  }}
                  style={{
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    border: lang === l ? `1px solid ${c.gold}` : `1px solid ${c.border}`,
                    background: lang === l ? "color-mix(in srgb, var(--chart-3) 15%, transparent)" : "transparent",
                    color: lang === l ? c.gold : c.faint,
                    borderRadius: 6,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => window.open("https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/", "_blank")} style={{ ...S.cta, padding: "12px 24px", fontSize: 13, whiteSpace: "nowrap" }}>{t.nav.invest}</button>
          </div>
        </div>
      </nav>

      <header className="dark" style={{ position: "relative", overflow: "hidden", color: c.text, background: c.bg, minHeight: "100vh" }}>
        <div style={{ position: "absolute", inset: "0 0 0px 0", backgroundImage: `url(${IMG.invest})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.10, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: "0 0 0px 0", background: `linear-gradient(180deg, color-mix(in srgb, var(--background) 20%, transparent) 0%, var(--background) 100%)`, zIndex: 0 }} />
        <div style={{ position: "absolute", top: -150, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--chart-3) 8%, transparent) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "100px 20px 40px", width: "100%", position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={S.label}>{t.hero.label}</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.08, maxWidth: 680, marginBottom: 10, marginTop: 12 }}>
            {t.hero.title1}<br />
            <span style={{ color: c.gold }}>
              {t.hero.title2}
            </span>
          </h1>
          <p style={{ fontSize: 14, color: c.muted, marginBottom: 24, letterSpacing: 0.5 }}>{t.hero.subtitle}</p>
          <p style={{ fontSize: 17, color: c.faint, maxWidth: 540, lineHeight: 1.75, marginBottom: 36 }}>
            {t.hero.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <button onClick={() => window.open("https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/", "_blank")} style={S.cta}>{t.nav.invest} →</button>
            <button onClick={() => window.open("https://spilberk.com", "_blank")} style={S.ghost}>{t.hero.ctaSecondary}</button>
          </div>

          <div className="dark" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 16, marginTop: 70 }}>
            {[
              { v: <Counter end={2.6} decimals={1} />, u: "mld CZK", l: t.hero.kpi1, a: false },
              { v: <span><Counter end={7.16} decimals={2} /></span>, u: "% p.a.", l: t.hero.kpi2, a: true },
              { v: "3 / 7", u: "", l: t.hero.kpi3, a: true },
              { v: <Counter end={36} />, u: "SPV", l: t.hero.kpi4, a: false },
            ].map((k, i) => (
              <div key={i} style={{ ...S.kpi, background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: k.a ? c.gold : "inherit" }}>
                  {k.v}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)", marginLeft: 5 }}>{k.u}</span>
                </div>
                <div style={{ fontSize: 11, color: "color-mix(in srgb, var(--foreground) 60%, transparent)", marginTop: 4 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section style={{ background: c.bg, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "45px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={S.label}>{t.trackRecord.label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 16 }}>
            {[
              { v: <span><Counter end={725} />+</span>, l: t.trackRecord.metric1, sub: t.trackRecord.metric1sub },
              { v: <span><Counter end={15} />+</span>, l: t.trackRecord.metric2, sub: t.trackRecord.metric2sub },
              { v: "1 354", l: t.trackRecord.metric3, sub: t.trackRecord.metric3sub },
              { v: "60 000", l: t.trackRecord.metric4, sub: t.trackRecord.metric4sub },
              { v: <span><Counter end={300} />+</span>, l: t.trackRecord.metric5, sub: t.trackRecord.metric5sub },
            ].map((k, i) => (
              <div key={i} style={S.kpi}>
                <div style={{ fontSize: 28, fontWeight: 700, color: i === 0 || i === 2 ? c.gold : c.text }}>{k.v}</div>
                <div style={{ fontSize: 11, color: c.muted, marginTop: 4, lineHeight: 1.4 }}>{k.l}</div>
                <div style={{ fontSize: 10, color: c.faint, marginTop: 6, borderTop: `1px solid ${c.border}`, paddingTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))", gap: 8, marginTop: 20, textAlign: "center" }}>
            {[
              { v: "2,6+", u: "mld CZK", l: t.trackRecord.extra1 },
              { v: "1,28", u: "mld CZK", l: t.trackRecord.extra2 },
              { v: "min 7%", u: "p.a.", l: t.trackRecord.extra3 },
              { v: "7,2%", u: "p.a.", l: t.trackRecord.extra4 },
              { v: "5 : 1", u: "", l: t.trackRecord.extra5 },
              { v: "3 měs.", u: "", l: t.trackRecord.extra6 },
              { v: "124", u: "MWp", l: t.trackRecord.extra7 },
              { v: "~30", u: "", l: t.trackRecord.extra8 },
            ].map((k, i) => (
              <div key={i} style={{ padding: "10px 4px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: i < 2 ? c.text : c.gold }}>
                  {k.v} <span style={{ fontSize: 10, color: c.faint }}>{k.u}</span>
                </div>
                <div style={{ fontSize: 9, color: c.faint, marginTop: 2 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="o-fondu" style={{ ...S.section, padding: "90px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 50 }}>
          <div>
            <span style={S.label}>{t.about.label}</span>
            <h2 style={S.h2}>{t.about.title}</h2>
            <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, marginBottom: 30 }}>
              {t.about.subtitle}
            </p>
            {[
              [t.about.row1key, "2,6+ mld CZK"],
              [t.about.row2key, "1 276 796 tis. CZK"],
              [t.about.row3key, "80 997 tis. CZK"],
              [t.about.row4key, t.about.row4val],
              [t.about.row5key, t.about.row5val],
              [t.about.row6key, "CZ0008042645"],
              [t.about.row7key, "051 94 148"],
              [t.about.row8key, t.about.row8val],
              [t.about.row9key, "36"],
              [t.about.row10key, t.about.row10val],
              [t.about.row11key, "min. 7 % p.a."],
              [t.about.row12key, "7,2 % p.a."],
              [t.about.row13key, t.about.row13val],
              [t.about.row14key, t.about.row14val],
              [t.about.row15key, t.about.row15val],
              [t.about.row16key, t.about.row16val],
              [t.about.row17key, t.about.row17val],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${c.border}`, fontSize: 12.5 }}>
                <span style={{ color: c.muted }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "55%", color: c.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={S.kpi}><NAVChart label={t.performance.chartLabel} /></div>
            <div style={{ ...S.kpi, textAlign: "left" }}>
              <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
                {t.about.sriTitle}
              </div>
              <SRIGauge />
              <p style={{ fontSize: 11.5, color: c.faint, marginTop: 14, lineHeight: 1.6 }}>
                {t.about.sriDesc}
              </p>
            </div>
            <div style={{ ...S.kpi, background: "color-mix(in srgb, var(--chart-3) 5%, transparent)", borderColor: "color-mix(in srgb, var(--chart-3) 20%, transparent)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: 12 }}>
                {[
                  { v: "min. 7 %", l: t.about.guaranteeTitle1 },
                  { v: "7,16 %", l: t.about.guaranteeTitle2 },
                  { v: "7,2 %", l: t.about.guaranteeTitle3 }
                ].map((d, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.gold }}>{d.v}</div>
                    <div style={{ fontSize: 9, color: c.faint, marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.4 }}>{d.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: c.faint, marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>
                {t.about.guaranteeDesc}
              </p>
            </div>
            <div style={{ ...S.kpi, textAlign: "left", padding: "20px 24px" }}>
              <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                {t.about.governanceTitle}
              </div>
              {[
                [t.about.gov1key, t.about.gov1val],
                [t.about.gov2key, t.about.gov2val],
                [t.about.gov3key, t.about.gov3val],
                [t.about.gov4key, t.about.gov4val],
                [t.about.gov5key, t.about.gov5val],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? `1px solid ${c.border}` : "none", fontSize: 11.5 }}>
                  <span style={{ color: c.faint }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 11, color: c.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="strategie" style={{ background: c.bg, borderTop: `1px solid ${c.border}`, padding: "0 20px" }}>
        <div style={S.section}>
          <span style={S.label}>{t.strategy.label}</span>
          <h2 style={S.h2}>{t.strategy.title}</h2>
          <p style={S.sub}>{t.strategy.subtitle}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16 }}>
            {[
              { icon: "🏗", name: t.strategy.pillar1name, stat: t.strategy.pillar1stat, stat2: t.strategy.pillar1stat2, color: "var(--chart-3)", desc: t.strategy.pillar1desc },
              { icon: "🏠", name: t.strategy.pillar2name, stat: t.strategy.pillar2stat, stat2: t.strategy.pillar2stat2, color: "var(--chart-2)", desc: t.strategy.pillar2desc },
              { icon: "⚡", name: t.strategy.pillar3name, stat: t.strategy.pillar3stat, stat2: t.strategy.pillar3stat2, color: "var(--chart-1)", desc: t.strategy.pillar3desc },
              { icon: "🏬", name: t.strategy.pillar4name, stat: t.strategy.pillar4stat, stat2: t.strategy.pillar4stat2, color: "var(--chart-4)", desc: t.strategy.pillar4desc },
            ].map((p, i) => (
              <div key={i} style={{ ...S.kpi, textAlign: "left", borderTop: `3px solid ${p.color}`, padding: "24px 22px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{p.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: c.text }}>{p.name}</h3>
                <p style={{ fontSize: 11.5, color: c.faint, lineHeight: 1.6, marginBottom: 16, minHeight: 56 }}>{p.desc}</p>
                <div style={{ background: "color-mix(in srgb, var(--foreground) 3%, transparent)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c.text }}>{p.stat}</div>
                  <div style={{ fontSize: 10, color: c.faint, marginTop: 2 }}>{p.stat2}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projekty" style={{ ...S.section, padding: "90px 20px" }}>
        <span style={S.label}>{t.projects.label}</span>
        <h2 style={S.h2}>{t.projects.title}</h2>
        <p style={S.sub}>{lang === "cs" ? "Strategická přítomnost v klíčových regionech ČR: Brno · Praha · Kladno · Klínovec · Mikulov" : lang === "en" ? "Strategic presence in key Czech regions: Brno · Prague · Kladno · Klínovec · Mikulov" : "Presenza strategica nelle regioni chiave della Repubblica Ceca: Brno · Praga · Kladno · Klínovec · Mikulov"}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
          {cats.map(c2 => (
            <button
              key={c2.key}
              onClick={() => setTab(c2.key)}
              style={{
                padding: "8px 18px",
                borderRadius: 50,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${tab === c2.key ? c.gold : c.border}`,
                background: tab === c2.key ? "color-mix(in srgb, var(--chart-3) 10%, transparent)" : "transparent",
                color: tab === c2.key ? c.gold : c.muted,
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
            >
              {c2.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
          {filtered.map((p, i) => (
            <div
              key={i}
              style={{ ...S.card, cursor: p.link ? "pointer" : "default" }}
              onClick={() => {
                if (p.link) window.open(`https://${p.link}`, '_blank', 'noopener,noreferrer');
              }}
            >
              <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute",
                  inset: (p.key === "ski" || p.key === "chodov") ? -10 : 0,
                  backgroundImage: `url(${p.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: (p.key === "ski" || p.key === "chodov") ? "blur(8px)" : "none",
                }} />
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: p.status === "active" ? c.gold : p.status === "new" ? "var(--primary)" : "var(--background)",
                  color: p.status === "prep" ? "var(--foreground)" : "var(--background)",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  boxShadow: "0 2px 8px color-mix(in srgb, var(--foreground) 10%, transparent)",
                  zIndex: 2
                }}>
                  {p.status === "active" ? t.projects.statusActive : p.status === "new" ? t.projects.statusNew : t.projects.statusPrep}
                </div>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: 11, color: c.faint, marginBottom: 4 }}>{p.loc}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: c.text }}>{p.name}</h3>
                <p style={{ fontSize: 11.5, color: c.muted, lineHeight: 1.5, marginBottom: 12, minHeight: 32 }}>{getProjectDesc(p.key, lang)}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {p.units && (
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: c.text }}>{p.units}</span>
                      <span style={{ fontSize: 11, color: c.faint, marginLeft: 4 }}>{t.projects.units}</span>
                    </div>
                  )}
                  {p.link && <span style={{ fontSize: 10, color: c.gold }}>{p.link} →</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="vykonnost" style={{ background: c.bg, borderTop: `1px solid ${c.border}`, padding: "0 20px" }}>
        <div style={S.section}>
          <span style={S.label}>{t.performance.label}</span>
          <h2 style={S.h2}>{t.performance.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 40 }}>
            <div style={{ ...S.kpi, padding: "40px 30px 40px 45px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1, minHeight: 180 }}>
                {/* Horizontal grid lines for context */}
                <div style={{ position: "absolute", inset: "33px 0 31px 0", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", opacity: 0.35 }}>
                  {[8, 7, 6].map(v => (
                    <div key={v} style={{ borderTop: `1px dashed ${c.border}`, width: "100%", position: "relative" }}>
                      <span style={{ position: "absolute", left: -32, top: -7, fontSize: 10, color: c.faint, fontWeight: 700 }}>{v}%</span>
                    </div>
                  ))}
                </div>
                
                {[
                  { y: "2019", v: 7.0 },
                  { y: "2020", v: 7.0 },
                  { y: "2021", v: 7.0 },
                  { y: "2022", v: 7.16 },
                  { y: "2023", v: 7.16 },
                  { y: "2024", v: 7.0 }
                ].map(d => <PerfBar key={d.y} year={d.y} val={d.v} />)}
              </div>
              <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: c.faint, marginTop: 32, textTransform: "uppercase", letterSpacing: "1px" }}>
                {t.performance.annualReturns}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {t.performance.piaValueTitle}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: c.text }}>
                  {lang === "en" ? "1.9149" : "1,9149"} <span style={{ fontSize: 14, color: c.muted }}>CZK</span>
                </div>
                <div style={{ fontSize: 11, color: c.gold, marginTop: 4 }}>{t.performance.piaValueChange}</div>
              </div>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {t.performance.revenueTitle}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))", gap: 8, marginTop: 8 }}>
                  {[
                    { l: t.performance.revenue1, v: lang === "en" ? "64.7 mil" : "64,7 mil" },
                    { l: t.performance.revenue2, v: lang === "en" ? "43.3 mil" : "43,3 mil" },
                    { l: t.performance.revenue3, v: lang === "en" ? "26.5 mil" : "26,5 mil" }
                  ].map(d => (
                    <div key={d.l}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: c.gold }}>{d.v}</div>
                      <div style={{ fontSize: 9, color: c.faint }}>{d.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {t.performance.leverageTitle}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: c.text }}>169%</div>
                    <div style={{ fontSize: 9, color: c.faint }}>{t.performance.leverage1}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: c.text }}>171%</div>
                    <div style={{ fontSize: 9, color: c.faint }}>{t.performance.leverage2}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${c.border}`, padding: "0 20px" }}>
        <div style={S.section}>
          <span style={S.label}>{t.benefits.label}</span>
          <h2 style={S.h2}>{t.benefits.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {[
              { icon: "📊", t: t.benefits.benefit1title, d: t.benefits.benefit1desc },
              { icon: "🛡", t: t.benefits.benefit2title, d: t.benefits.benefit2desc },
              { icon: "⚖️", t: t.benefits.benefit3title, d: t.benefits.benefit3desc },
              { icon: "💧", t: t.benefits.benefit4title, d: t.benefits.benefit4desc },
              { icon: "📉", t: t.benefits.benefit5title, d: t.benefits.benefit5desc },
              { icon: "🏢", t: t.benefits.benefit6title, d: t.benefits.benefit6desc },
            ].map((v, i) => (
              <div key={i} style={{ ...S.kpi, textAlign: "left", padding: "22px 24px" }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{v.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: c.text }}>{v.t}</h3>
                <p style={{ fontSize: 12, color: c.faint, lineHeight: 1.6 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tym" style={{ background: c.bg, borderTop: `1px solid ${c.border}`, padding: "0 20px" }}>
        <div style={S.section}>
          <span style={S.label}>{t.team.label}</span>
          <h2 style={S.h2}>{t.team.title}</h2>
          <p style={S.sub}>{lang === "cs" ? "Tým cca 30 profesionálů v oblastech developmentu, financí, marketingu a správy nemovitostí." : lang === "en" ? "Team of approximately 30 professionals in development, finance, marketing and property management." : "Team di circa 30 professionisti nello sviluppo, finanza, marketing e gestione immobiliare."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16, marginBottom: 20 }}>
            {team.slice(0, 3).map((m, i) => (
              <div key={i} style={{ ...S.kpi, display: "flex", gap: 16, textAlign: "left", padding: "22px", borderColor: i === 2 ? "color-mix(in srgb, var(--chart-3) 30%, transparent)" : c.border }}>
                {m.img ? (
                  <img src={m.img} alt={m.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${c.border}` }} />
                ) : (
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--chart-3) 15%, transparent), color-mix(in srgb, var(--primary) 10%, transparent))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: c.gold
                  }}>
                    {m.name.split(" ").slice(-1)[0]?.[0] || "?"}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: c.gold, fontWeight: 600, marginBottom: 6 }}>{m.role}</div>
                  <p style={{ fontSize: 11, color: c.faint, lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, marginTop: 20 }}>
            {t.team.managementLabel}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
            {team.slice(3).map((m, i) => (
              <div key={i} style={{ ...S.kpi, display: "flex", gap: 14, textAlign: "left", padding: "18px" }}>
                {m.img ? (
                  <img src={m.img} alt={m.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${c.border}` }} />
                ) : (
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "color-mix(in srgb, var(--foreground) 4%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: c.faint
                  }}>
                    {m.name.split(" ").slice(-1)[0]?.[0] || "?"}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: c.gold, fontWeight: 600, marginBottom: 4 }}>{m.role}</div>
                  <p style={{ fontSize: 10.5, color: c.faint, lineHeight: 1.4 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${c.border}`, padding: "0 20px" }}>
        <div style={S.section}>
          <span style={S.label}>{t.steps.label}</span>
          <h2 style={S.h2}>{t.steps.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 30, marginTop: 30 }}>
            {[
              { s: t.steps.step1num, t: t.steps.step1title, d: t.steps.step1desc },
              { s: t.steps.step2num, t: t.steps.step2title, d: t.steps.step2desc },
              { s: t.steps.step3num, t: t.steps.step3title, d: t.steps.step3desc },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: "color-mix(in srgb, var(--foreground) 3%, transparent)", position: "absolute", top: -25, left: -8 }}>
                  {s.s}
                </div>
                <div style={{ position: "relative", zIndex: 1, paddingTop: 44 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: c.text }}>{s.t}</h3>
                  <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark" style={{ background: c.bg, borderTop: `1px solid ${c.border}`, padding: "0 20px", color: c.text }}>
        <div style={{ ...S.section, textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
          <span style={S.label}>{t.cta.label}</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginTop: 12, marginBottom: 18, lineHeight: 1.15 }}>
            {t.cta.title}
          </h2>
          <p style={{ fontSize: 15, color: c.muted, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
            {t.cta.subtitle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginBottom: 40 }}>
            <button onClick={() => window.open("https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/", "_blank")} style={S.cta}>{t.nav.invest} →</button>
            <a href="mailto:invest@spilberk.com" style={{ ...S.ghost, textDecoration: "none" }}>invest@spilberk.com</a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 50px" }}>
            {[
              { v: "SRI 3/7", l: t.cta.badge1 },
              { v: "7–7,2 %", l: t.cta.badge2 },
              { v: "5 : 1", l: t.cta.badge3 },
              { v: "2,6+ mld", l: t.cta.badge4 },
              { v: "725+", l: t.cta.badge5 },
              { v: "36", l: t.cta.badge6 }
            ].map((b, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: c.gold }}>{b.v}</div>
                <div style={{ fontSize: 10, color: c.faint }}>{b.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="kontakt" className="dark main-footer" style={{ background: c.bg, borderTop: `1px solid ${c.border}` }}>
        <div style={{ ...S.section, paddingBottom: 30, padding: "90px 20px 30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 30,
                  height: 30,
                  background: c.gold,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "var(--background)",
                  fontSize: 13
                }}>S</div>
                <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: c.text }}>SPILBERK</span>
                  <span style={{ fontSize: 9, color: c.faint, letterSpacing: 1.5, marginLeft: 6 }}>investiční fond SICAV</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: c.faint, lineHeight: 1.7, maxWidth: 500 }}>
                {t.footer.disclaimer}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
                {t.footer.fundLabel}
              </div>
              {["spilberkfund.com", "ISIN: CZ0008042645", lang === "cs" ? "IČO: 051 94 148" : "ID: 051 94 148", "LEI: 315700AKR2M5RKLX8220", lang === "cs" ? "Založen: 26. 6. 2016" : lang === "en" ? "Founded: June 26, 2016" : "Fondato: 26 giugno 2016"].map(item => (
                <div key={item} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{item}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
                {t.footer.contactLabel}
              </div>
              {["invest@spilberk.com", "office@spilberk.com", "+420 725 926 580", "Triniti Office Center", "Trnitá 500/9, 602 00 Brno"].map(t => {
                const isEmail = t.includes("@");
                const isPhone = t.startsWith("+");
                const href = isEmail ? `mailto:${t}` : isPhone ? `tel:${t.replace(/ /g, "")}` : undefined;
                return href ? (
                  <a key={t} href={href} style={{ display: "block", fontSize: 11, color: c.faint, marginBottom: 5, textDecoration: "none" }}>{t}</a>
                ) : (
                  <div key={t} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{t}</div>
                );
              })}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
                Governance
              </div>
              {["AVANT investiční společnost", "ČSOB (depozitář)", "ČNB (regulátor)", "AUDIT ONE (auditor)", "BDO Czech Republic (daně)"].map(t => (
                <div key={t} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 60, paddingTop: 30, borderTop: `1px solid ${c.border}`, textAlign: "center" }}>
            <div style={{
              fontSize: 11,
              color: c.faint,
              lineHeight: 1.6,
              maxWidth: 1000,
              margin: "0 auto",
              whiteSpace: "pre-wrap"
            }}>
              {t.footer.extendedLegal}
            </div>
          </div>
        </div>
        <div style={{
          borderTop: `1px solid ${c.border}`,
          padding: "20px",
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 9.5,
          color: "color-mix(in srgb, var(--foreground) 30%, transparent)"
        }}>
          <span>© 2016–2026 SPILBERK investiční fond SICAV, a.s. Všechna práva vyhrazena.</span>
          <span style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/#funds-files-block_66a00e4ba6bdae49f7f97f19e0c54fe3" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>KID na avantfunds.cz</a>
            <span>·</span>
            <a href="https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/#funds-files-block_66a00e4ba6bdae49f7f97f19e0c54fe3" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Statut fondu</a>
            <span>·</span>
            <a href="https://www.avantfunds.cz/fondy/spilberk-investicni-fond-sicav-a-s/#funds-files-block_66a00e4ba6bdae49f7f97f19e0c54fe3" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>Výroční zpráva 2024</a>
            <span>·</span>
            <a href="https://www.spilberk.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>www.spilberk.com</a>
            <span>·</span>
            <a href="https://www.urbanblok.cz" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>www.urbanblok.cz</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
