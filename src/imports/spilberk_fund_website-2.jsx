import { useState, useEffect, useRef } from "react";

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "", prefix = "", decimals = 0, duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const step = (now) => {
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
  return <span ref={ref}>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("cs-CZ")}{suffix}</span>;
}

/* ─── SRI Gauge ─── */
function SRIGauge() {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} style={{
          width: 38, height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
          background: i <= 3 ? (i === 3 ? "#C8A96E" : "rgba(200,169,110,0.4)") : "rgba(255,255,255,0.06)",
          border: i === 3 ? "2px solid #FFE292" : "1px solid rgba(255,255,255,0.08)",
          fontSize: 13, fontWeight: i === 3 ? 800 : 500,
          color: i <= 3 ? "#0D0536" : "rgba(255,255,255,0.25)",
        }}>{i}</div>
      ))}
    </div>
  );
}

/* ─── NAV Area Chart ─── */
function NAVChart() {
  const data = [{ y: "2019", v: 620 }, { y: "2020", v: 780 }, { y: "2021", v: 950 }, { y: "2022", v: 1120 }, { y: "2023", v: 1273 }, { y: "2024", v: 1277 }];
  const max = 1500, w = 540, h = 200, px = 48, py = 16, cW = w - px * 2, cH = h - py * 2;
  const pts = data.map((d, i) => ({ x: px + i / (data.length - 1) * cW, y: py + cH - d.v / max * cH, ...d }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${h - py} L${pts[0].x},${h - py} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%" }}>
      <defs><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C8A96E" stopOpacity="0.25" /><stop offset="100%" stopColor="#C8A96E" stopOpacity="0" /></linearGradient></defs>
      {[0, 500, 1000, 1500].map(v => (<g key={v}><line x1={px} x2={w - px} y1={py + cH - v / max * cH} y2={py + cH - v / max * cH} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" /><text x={px - 6} y={py + cH - v / max * cH + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="inherit">{v === 0 ? "0" : `${(v / 1000).toFixed(1)}`}</text></g>))}
      <path d={area} fill="url(#ng)" /><path d={line} fill="none" stroke="#C8A96E" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map(p => (<g key={p.y}><circle cx={p.x} cy={p.y} r="4" fill="#0D0536" stroke="#C8A96E" strokeWidth="2" /><text x={p.x} y={h - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="inherit">{p.y}</text><text x={p.x} y={p.y - 10} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="inherit">{(p.v / 1000).toFixed(2)}</text></g>))}
      <text x={w / 2} y={12} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="inherit">Fondový kapitál (NAV) v mld CZK</text>
    </svg>
  );
}

function PerfBar({ year, val }) {
  return (<div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{year}</div><div style={{ height: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 6 }}><div style={{ width: 36, height: `${(val / 8) * 100}%`, background: "linear-gradient(180deg, #FFE292 0%, #C8A96E 100%)", borderRadius: "4px 4px 0 0" }} /></div><div style={{ fontSize: 16, fontWeight: 700, color: "#C8A96E" }}>{val}%</div></div>);
}

/* ─── Sanity CDN images ─── */
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

/* ─── Main ─── */
export default function SpilberkFund() {
  const [tab, setTab] = useState("all");
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY || 0); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const projects = [
    { name: "Urbanblok V24", loc: "Vlhká, Brno", units: 101, cat: "rental", status: "new", img: IMG.v24, link: "v24.urbanblok.cz", desc: "Moderní nájemní bydlení v centru Brna, kolaudace 09/2025" },
    { name: "Urbanblok B45", loc: "Bratislavská, Brno", units: 162, cat: "rental", status: "active", img: IMG.b45, link: "b45.urbanblok.cz", desc: "162 jednotek nájemního bydlení, plně pronajato od 2023" },
    { name: "Nový Cejl", loc: "Cejl 79, Brno", units: 101, cat: "rental", status: "active", img: IMG.cejl, link: "novy-cejl.cz", desc: "3 bytové domy, dokončeno podzim 2024, 7 jednotek Airbnb" },
    { name: "Bratislavská 47", loc: "Bratislavská, Brno", units: 330, cat: "development", status: "new", img: IMG.b47, desc: "Vysokoškolské koleje hotelového typu, 690 lůžek, SP 10/2025" },
    { name: "Kladno - Na Šestém", loc: "Kladno, ČR", units: 488, cat: "development", status: "prep", img: IMG.kladno, desc: "31 bytových domů, 5 etap, domov seniorů 85 míst, kolaudace 06/2032" },
    { name: "Pod Platany", loc: "Židenice, Brno", units: 110, cat: "development", status: "prep", img: IMG.platany, desc: "4 bytové domy, 1+kk a 2+kk, 61 park. stání, SP 02/2025" },
    { name: "Retail Park Vyškov", loc: "Vyškov, ČR", units: null, cat: "retail", status: "active", img: IMG.vysk, desc: "3 300 m² GLA, 100% obsazenost — Pro Spánek, Mountfield, Oresi" },
    { name: "Retail Park Lanškroun", loc: "Lanškroun, ČR", units: null, cat: "retail", status: "active", img: IMG.lans, desc: "2 500 m² GLA, 100% obsazenost — TETA, KIK, Datart, Dr. Max" },
    { name: "Retail Park Kyjov", loc: "Kyjov, ČR", units: null, cat: "retail", status: "active", img: IMG.kyjov, desc: "1 000 m² GLA, 100% obsazenost — Super zoo, TETA, Pepco" },
    { name: "Ski Apartments Klínovec", loc: "Klínovec, ČR", units: 84, cat: "prep", status: "prep", img: IMG.ski, desc: "5 apartmánových domů, wellness, restaurant, 95 park. stání" },
    { name: "Rezidenční projekt Chodov", loc: "Praha – Chodov", units: null, cat: "prep", status: "prep", img: IMG.chodov, desc: "4 objekty, ubytovací a rezidenční areál, občanská vybavenost" },
  ];

  const cats = [
    { key: "all", label: "Vše" }, { key: "rental", label: "Nájemní bydlení" },
    { key: "development", label: "Development" }, { key: "retail", label: "Retail Parky" }, { key: "prep", label: "Připravujeme" },
  ];
  const filtered = tab === "all" ? projects : projects.filter(p => p.cat === tab);

  const team = [
    { name: "Ing. Martin Pěnčík", role: "Zakladatel & Člen DR", img: IMG.martin, desc: "Spoluzakladatel fondu, 50 % zakladatelských akcií. Operační řízení, development a stavebnictví. Zodpovědnost za projektový rozvoj." },
    { name: "Mgr. Robert Sedláček", role: "Zakladatel & Předseda DR", img: IMG.robert, desc: "Spoluzakladatel fondu, 50 % zakladatelských akcií. Advokát — právo nemovitostí, korporátní právo, právní architektura struktury." },
    { name: "Ing. Jan Hevessy", role: "CEO", img: null, desc: "15+ let v řízení investic a transformaci firem. Wharton School, Columbia Business School. Governance a profesionalizace fondových struktur." },
    { name: "Jaromír Zavřel", role: "CCMO", img: IMG.jaromir, desc: "Obchodní a marketingové aktivity, fundraising, investor relations a strategická komunikace fondu na trhu." },
    { name: "Ing. Matěj Schánilec, ACCA", role: "CFO", img: IMG.matej, desc: "Finanční řízení fondu, reporting a compliance. Držitel kvalifikace ACCA. Strategické plánování kapitálu." },
    { name: "Šárka Tomanová", role: "HR & Office Manager", img: IMG.sarka, desc: "Řízení lidských zdrojů, kancelářský provoz a podpora interních procesů fondu." },
    { name: "Dominika Dočkalová", role: "Property Manager", img: IMG.dominika, desc: "Řízení divize správy nemovitostí. Správa domu, SVJ, koordinace pronájmů a facility management." },
    { name: "Martin Šimek", role: "Vedoucí retail segmentu", img: null, desc: "Správa a rozvoj portfolia komerčních nemovitostí a retail parků. Koordinace s partnery FUERTES." },
  ];

  const c = { gold: "#C8A96E", goldLight: "#FFE292", bg: "#0A0428", bgCard: "rgba(255,255,255,0.035)", border: "rgba(255,255,255,0.07)", muted: "rgba(255,255,255,0.45)", faint: "rgba(255,255,255,0.3)" };
  const S = {
    section: { maxWidth: 1120, margin: "0 auto", padding: "90px 36px" },
    label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: c.gold, fontWeight: 700, marginBottom: 10, display: "block" },
    h2: { fontSize: 34, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 },
    sub: { fontSize: 15, color: c.muted, lineHeight: 1.7, marginBottom: 40, maxWidth: 600 },
    card: { background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s, transform 0.3s" },
    kpi: { background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 14, padding: "26px 28px", textAlign: "center" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 34px", background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight})`, color: c.bg, fontWeight: 700, fontSize: 14, border: "none", borderRadius: 50, cursor: "pointer" },
    ghost: { display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "transparent", color: "white", fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.18)", borderRadius: 50, cursor: "pointer" },
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: c.bg, color: "white", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Fonts loaded via system stack */}

      {/* ═══ NAV ═══ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "14px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrollY > 60 ? "rgba(10,4,40,0.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(24px)" : "none", borderBottom: scrollY > 60 ? `1px solid ${c.border}` : "none", transition: "all 0.35s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${c.gold},${c.goldLight})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: c.bg, fontSize: 15 }}>S</div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2.5 }}>SPILBERK</span>
          <span style={{ fontSize: 9, color: c.faint, letterSpacing: 1.5, marginLeft: 4 }}>FUND</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["O fondu", "Strategie", "Projekty", "Výkonnost", "Tým", "Kontakt"].map(t => (
            <a key={t} href="#" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 12.5, fontWeight: 500 }}>{t}</a>
          ))}
          <button style={{ ...S.cta, padding: "9px 22px", fontSize: 12.5 }}>Investujte s námi</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMG.invest})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,4,40,0.4) 0%, rgba(10,4,40,1) 90%)" }} />
        <div style={{ position: "absolute", top: -150, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "130px 36px 110px", position: "relative", zIndex: 1 }}>
          <span style={S.label}>fund.spilberk.com · SPILBERK investiční fond SICAV, a.s.</span>
          <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.08, maxWidth: 680, marginBottom: 10, marginTop: 12 }}>
            Stavíme nemovitosti,<br /><span style={{ background: `linear-gradient(135deg,${c.gold},${c.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>garantujeme výnos.</span>
          </h1>
          <p style={{ fontSize: 14, color: c.faint, marginBottom: 24, letterSpacing: 0.5 }}>Základní kámen Vašeho portfolia</p>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 540, lineHeight: 1.75, marginBottom: 36 }}>
            Konzervativní nemovitostní fond s 9+ lety na trhu. Garantovaný výnos min. 7 % p.a., SRI 3/7, likvidita do 3 měsíců. Čtyři pilíře diverzifikace, 36 SPV entit pod správou.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button style={S.cta}>Investujte s námi →</button>
            <button style={S.ghost}>Stáhnout factsheet</button>
          </div>
          {/* Hero KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 70 }}>
            {[
              { v: <Counter end={2.6} decimals={1} />, u: "mld CZK", l: "Majetek fondu pod správou", a: false },
              { v: <span><Counter end={7.16} decimals={2} /></span>, u: "% p.a.", l: "Výnos PIA za posledních 12M", a: true },
              { v: "3 / 7", u: "", l: "Souhrnný ukazatel rizik (SRI)", a: false },
              { v: <Counter end={36} />, u: "SPV", l: "Entit ve struktuře fondu", a: false },
            ].map((k, i) => (
              <div key={i} style={S.kpi}>
                <div style={{ fontSize: 30, fontWeight: 700, color: k.a ? c.gold : "white" }}>{k.v}<span style={{ fontSize: 13, fontWeight: 500, color: c.muted, marginLeft: 5 }}>{k.u}</span></div>
                <div style={{ fontSize: 11, color: c.faint, marginTop: 4 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ TRACK RECORD STRIP ═══ */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "45px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={S.label}>Track record, kterému můžete důvěřovat</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {[
              { v: <span><Counter end={725} />+</span>, l: "postavených bytových jednotek", sub: "20 000+ m2 CPP" },
              { v: <span><Counter end={15} />+</span>, l: "dokončených projektů", sub: "9+ let na trhu" },
              { v: "1 354", l: "bytů v pipeline", sub: "15 projektů běží + příprava" },
              { v: "60 000", l: "m² plánované ČPP", sub: "Brno · Praha · Kladno · Klínovec" },
              { v: <Counter end={263} />, l: "nájemních jednotek Urbanblok", sub: "60 % nájemníků — expaté, studenti" },
            ].map((k, i) => (
              <div key={i} style={S.kpi}>
                <div style={{ fontSize: 28, fontWeight: 700, color: i === 0 || i === 2 ? c.gold : "white" }}>{k.v}</div>
                <div style={{ fontSize: 11, color: c.muted, marginTop: 4, lineHeight: 1.4 }}>{k.l}</div>
                <div style={{ fontSize: 10, color: c.faint, marginTop: 6, borderTop: `1px solid ${c.border}`, paddingTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          {/* Extra metrics row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8, marginTop: 20, textAlign: "center" }}>
            {[
              { v: "2,6+", u: "mld CZK", l: "majetek fondu" },
              { v: "1,28", u: "mld CZK", l: "vlastní kapitál" },
              { v: "min 7%", u: "p.a.", l: "garant. výnos" },
              { v: "7,2%", u: "p.a.", l: "max. výnos PIA" },
              { v: "5 : 1", u: "", l: "VIA : PIA zajištění" },
              { v: "3 měs.", u: "", l: "splatnost odkupů" },
              { v: "124", u: "MWp", l: "FVE Žatec" },
              { v: "~30", u: "", l: "profesionálů v týmu" },
            ].map((k, i) => (
              <div key={i} style={{ padding: "10px 4px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: i < 2 ? "white" : c.gold }}>{k.v} <span style={{ fontSize: 10, color: c.faint }}>{k.u}</span></div>
                <div style={{ fontSize: 9, color: c.faint, marginTop: 2 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ O FONDU ═══ */}
      <section style={S.section}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50 }}>
          <div>
            <span style={S.label}>O fondu</span>
            <h2 style={S.h2}>Fond v číslech</h2>
            <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7, marginBottom: 30 }}>SPILBERK je český fond kvalifikovaných investorů zaměřený na dlouhodobé budování diverzifikovaného portfolia nemovitostních a energetických projektů. Investiční strategií je vytvoření odolného portfolia s využitím synergie čtyř pilířů.</p>
            {[
              ["Majetek fondu pod správou", "2,6+ mld CZK"],
              ["Fondový kapitál (NAV)", "1 276 796 tis. CZK"],
              ["Čistý zisk 2024", "80 997 tis. CZK"],
              ["Typ fondu", "Fond kvalifikovaných investorů"],
              ["Právní forma", "SICAV (akciová společnost)"],
              ["ISIN (PIA)", "CZ0008042645"],
              ["IČO", "051 94 148"],
              ["Založení", "26. 6. 2016 (doba neurčitá)"],
              ["SPV entit", "36"],
              ["Min. investice", "FKI: 1 mil. CZK / AVANT Flex: 100 tis."],
              ["Garantované zhodnocení", "min. 7 % p.a."],
              ["Max. výnos PIA", "7,2 % p.a."],
              ["Investiční horizont", "Střednědobý, 4 roky"],
              ["Frekvence úpisu/odkupů", "Měsíčně"],
              ["Splatnost odkupů", "Do 3 měsíců"],
              ["Výstupní poplatek", "3 % do 3 let / 0 % po 3 letech"],
              ["Zdanění FO", "15 % do 3 let / 0 % po 3 letech"],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${c.border}`, fontSize: 12.5 }}>
                <span style={{ color: c.muted }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={S.kpi}><NAVChart /></div>
            <div style={{ ...S.kpi, textAlign: "left" }}>
              <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Souhrnný ukazatel rizik (SRI)</div>
              <SRIGauge />
              <p style={{ fontSize: 11.5, color: c.faint, marginTop: 14, lineHeight: 1.6 }}>Fond zařazen do třídy 3 ze 7 — třetí nejnižší třída rizik. Nízká volatilita podkladových aktiv i celého portfolia. Ukazatel předpokládá držbu 4 roky.</p>
            </div>
            <div style={{ ...S.kpi, background: "rgba(200,169,110,0.04)", borderColor: "rgba(200,169,110,0.15)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[{ v: "min. 7 %", l: "Garantované\nzhodnocení p.a." }, { v: "7,16 %", l: "Výkonnost PIA\nza posledních 12M" }, { v: "7,2 %", l: "Maximální\nvýnos PIA p.a." }].map((d, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: c.gold }}>{d.v}</div>
                    <div style={{ fontSize: 9, color: c.faint, marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.4 }}>{d.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: c.faint, marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>Garance min. výnosu PIA se uplatní i v případě nižšího zisku či ztráty fondu — redistribuce fondového kapitálu od VIA ve prospěch PIA. Údaje k 31. 12. 2024.</p>
            </div>
            {/* Governance box */}
            <div style={{ ...S.kpi, textAlign: "left", padding: "20px 24px" }}>
              <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Struktura a governance</div>
              {[
                ["Obhospodařovatel", "AVANT investiční společnost, a.s."],
                ["Depozitář", "ČSOB, a.s."],
                ["Regulátor", "Česká národní banka (ČNB)"],
                ["Auditor", "AUDIT ONE s.r.o."],
                ["Účetní a daňový poradce", "BDO Czech Republic s.r.o."],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? `1px solid ${c.border}` : "none", fontSize: 11.5 }}>
                  <span style={{ color: c.faint }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 11 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STRATEGIE ═══ */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${c.border}` }}>
        <div style={S.section}>
          <span style={S.label}>Investiční strategie</span>
          <h2 style={S.h2}>Čtyři pilíře diverzifikace</h2>
          <p style={S.sub}>Synergie čtyř investičních oblastí zvyšuje výkonnost a dlouhodobou stabilitu celého fondu.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { icon: "🏗", name: "Development", stat: "725+ jednotek", stat2: "15+ dokončených projektů", color: c.gold, desc: "Malometrážní byty v atraktivních městských lokalitách. 1 354 bytů v pipeline, 60 000 m² plánované ČPP." },
              { icon: "🏠", name: "Nájemní bydlení", stat: "263 jednotek", stat2: "2 Urbanblok projekty", color: "#6B6BAA", desc: "Urbanblok B45 + V24. 60 % nájemníků expaté a studenti z 9+ zemí. Nájmy nad tržním průměrem." },
              { icon: "⚡", name: "Energetika", stat: "124 MWp", stat2: "FVE Žatec, 3 etapy", color: "#40408A", desc: "Jedna z největších FVE v ČR. FVE na střechách vlastních budov, LDS, tepelná čerpadla." },
              { icon: "🏬", name: "Retail Parky", stat: "3 → 8 parků", stat2: "Cíl do roku 2027", color: "#8888BB", desc: "100% obsazenost všech 3 aktivních parků. Partnerství FUERTES. Menší města, regionální centra." },
            ].map((p, i) => (
              <div key={i} style={{ ...S.kpi, textAlign: "left", borderTop: `3px solid ${p.color}`, padding: "24px 22px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{p.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 11.5, color: c.faint, lineHeight: 1.6, marginBottom: 16, minHeight: 56 }}>{p.desc}</p>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{p.stat}</div>
                  <div style={{ fontSize: 10, color: c.faint, marginTop: 2 }}>{p.stat2}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJEKTY ═══ */}
      <section style={S.section}>
        <span style={S.label}>Portfolio projektů</span>
        <h2 style={S.h2}>Naše projekty</h2>
        <p style={S.sub}>Strategická přítomnost v klíčových regionech ČR: Brno · Praha · Kladno · Klínovec · Mikulov</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
          {cats.map(c2 => (
            <button key={c2.key} onClick={() => setTab(c2.key)} style={{ padding: "8px 18px", borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${tab === c2.key ? c.gold : "rgba(255,255,255,0.12)"}`, background: tab === c2.key ? "rgba(200,169,110,0.12)" : "transparent", color: tab === c2.key ? c.goldLight : c.muted, transition: "all 0.2s" }}>{c2.label}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filtered.map((p, i) => (
            <div key={i} style={S.card}>
              <div style={{ height: 180, backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 10, left: 10, background: p.status === "active" ? "rgba(200,169,110,0.9)" : p.status === "new" ? "rgba(64,64,138,0.9)" : "rgba(255,255,255,0.15)", color: p.status === "active" ? c.bg : "white", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  {p.status === "active" ? "V provozu" : p.status === "new" ? "Nový projekt" : "V přípravě"}
                </div>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: 11, color: c.faint, marginBottom: 4 }}>{p.loc}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 11.5, color: c.muted, lineHeight: 1.5, marginBottom: 12, minHeight: 32 }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {p.units && <div><span style={{ fontSize: 18, fontWeight: 700 }}>{p.units}</span><span style={{ fontSize: 11, color: c.faint, marginLeft: 4 }}>jednotek</span></div>}
                  {p.link && <span style={{ fontSize: 10, color: c.gold }}>{p.link} →</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ VÝKONNOST ═══ */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${c.border}` }}>
        <div style={S.section}>
          <span style={S.label}>Výkonnost</span>
          <h2 style={S.h2}>Stabilní zhodnocení pro investory</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div style={{ ...S.kpi, padding: "30px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                {[{ y: "2019", v: 7.0 }, { y: "2020", v: 7.0 }, { y: "2021", v: 7.0 }, { y: "2022", v: 7.16 }, { y: "2023", v: 7.16 }, { y: "2024", v: 7.0 }].map(d => <PerfBar key={d.y} year={d.y} val={d.v} />)}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: c.faint, marginTop: 14 }}>Roční výkonnost PIA (% p.a.)</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Hodnota PIA k 31. 12. 2024</div>
                <div style={{ fontSize: 32, fontWeight: 700 }}>1,9149 <span style={{ fontSize: 14, color: c.muted }}>CZK</span></div>
                <div style={{ fontSize: 11, color: c.gold, marginTop: 4 }}>+7,00 % za rok 2024 (z 1,7896 CZK)</div>
              </div>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Výnosy fondu 2024</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                  {[{ l: "Prodej majetku", v: "64,7 mil" }, { l: "Přecenění", v: "43,3 mil" }, { l: "Nájmy", v: "26,5 mil" }].map(d => (
                    <div key={d.l}><div style={{ fontSize: 16, fontWeight: 700, color: c.gold }}>{d.v}</div><div style={{ fontSize: 9, color: c.faint }}>{d.l}</div></div>
                  ))}
                </div>
              </div>
              <div style={S.kpi}>
                <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Pákový efekt</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
                  <div><div style={{ fontSize: 24, fontWeight: 700 }}>169%</div><div style={{ fontSize: 9, color: c.faint }}>hrubá hodnota aktiv</div></div>
                  <div><div style={{ fontSize: 24, fontWeight: 700 }}>171%</div><div style={{ fontSize: 9, color: c.faint }}>závazková metoda</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROČ INVESTOVAT ═══ */}
      <section style={{ borderTop: `1px solid ${c.border}` }}>
        <div style={S.section}>
          <span style={S.label}>Proč investovat</span>
          <h2 style={S.h2}>Klíčové výhody fondu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "📊", t: "Široce diverzifikované portfolio", d: "Čtyři silné oblasti – Development, Nájemní bydlení, Energetika, Retail Parky – ve vzájemné synergii." },
              { icon: "🛡", t: "Garance minimálního výnosu", d: "Min. 7 % p.a. pro držitele PIA, a to i v případě nižšího zisku či ztráty fondu." },
              { icon: "⚖️", t: "Vysoká míra zajištění", d: "Poměr výkonnostních a prioritních investičních akcií dosahuje hodnoty přibližně 5:1." },
              { icon: "💧", t: "Vysoká likvidita", d: "Investované prostředky s výplatou do 3 měsíců – fond jako likvidní složka portfolia." },
              { icon: "📉", t: "Nízký ukazatel rizik", d: "SRI na úrovni 3 – historicky nízká volatilita a stabilita portfolia." },
              { icon: "🏢", t: "Minimální volatilita", d: "Stabilní výnosy podložené reálnými nemovitostními aktivy v klíčových regionech ČR." },
            ].map((v, i) => (
              <div key={i} style={{ ...S.kpi, textAlign: "left", padding: "22px 24px" }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{v.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{v.t}</h3>
                <p style={{ fontSize: 12, color: c.faint, lineHeight: 1.6 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TÝM ═══ */}
      <section style={{ background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${c.border}` }}>
        <div style={S.section}>
          <span style={S.label}>Vedení fondu</span>
          <h2 style={S.h2}>Zakladatelé, výkonné řízení a management</h2>
          <p style={S.sub}>Tým cca 30 profesionálů v oblastech developmentu, financí, marketingu a správy nemovitostí.</p>
          {/* Founders + CEO */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
            {team.slice(0, 3).map((m, i) => (
              <div key={i} style={{ ...S.kpi, display: "flex", gap: 16, textAlign: "left", padding: "22px", borderColor: i === 2 ? "rgba(200,169,110,0.2)" : c.border }}>
                {m.img ? <img src={m.img} alt={m.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${c.border}` }} /> : <div style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, rgba(200,169,110,0.25), rgba(64,64,138,0.3))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: c.gold }}>{m.name.split(" ").pop()[0]}</div>}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: c.gold, fontWeight: 600, marginBottom: 6 }}>{m.role}</div>
                  <p style={{ fontSize: 11, color: c.faint, lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Management */}
          <div style={{ fontSize: 10, color: c.faint, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, marginTop: 20 }}>Management tým</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {team.slice(3).map((m, i) => (
              <div key={i} style={{ ...S.kpi, display: "flex", gap: 14, textAlign: "left", padding: "18px" }}>
                {m.img ? <img src={m.img} alt={m.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${c.border}` }} /> : <div style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: c.faint }}>{m.name.split(" ").pop()[0]}</div>}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: c.gold, fontWeight: 600, marginBottom: 4 }}>{m.role}</div>
                  <p style={{ fontSize: 10.5, color: c.faint, lineHeight: 1.4 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JAK INVESTOVAT ═══ */}
      <section style={{ borderTop: `1px solid ${c.border}` }}>
        <div style={S.section}>
          <span style={S.label}>Jak investovat</span>
          <h2 style={S.h2}>Tři kroky k investici</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30, marginTop: 30 }}>
            {[
              { s: "01", t: "Kontaktujte nás", d: "Napište na invest@spilberk.com nebo nás kontaktujte na +420 725 926 580. Připravíme individuální nabídku." },
              { s: "02", t: "Onboarding investora", d: "Ověření kvalifikovaného investora dle § 272 ZISIF zajišťuje AVANT. Min. investice FKI: 1 mil. CZK." },
              { s: "03", t: "Úpis akcií", d: "Měsíční frekvence úpisu PIA. Garantovaný výnos min. 7 % p.a. (max. 7,2 %). Zajištění VIA:PIA = 5:1." },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: "rgba(200,169,110,0.06)", position: "absolute", top: -25, left: -8 }}>{s.s}</div>
                <div style={{ position: "relative", zIndex: 1, paddingTop: 44 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.t}</h3>
                  <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background: "linear-gradient(135deg, #12094A 0%, #0A0428 100%)", borderTop: `1px solid rgba(200,169,110,0.12)` }}>
        <div style={{ ...S.section, textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
          <span style={S.label}>Připraveni investovat?</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, marginTop: 12, marginBottom: 18, lineHeight: 1.15 }}>Stavíme nemovitosti, garantujeme výnos.</h2>
          <p style={{ fontSize: 15, color: c.muted, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
            2,6+ mld CZK pod správou · 36 SPV · SRI 3/7 · Garance min. 7 % p.a. · Likvidita do 3 měsíců
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 40 }}>
            <button style={S.cta}>Investujte s námi →</button>
            <button style={S.ghost}>invest@spilberk.com</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
            {[{ v: "SRI 3/7", l: "Nízké riziko" }, { v: "7–7,2 %", l: "Výnos PIA p.a." }, { v: "5 : 1", l: "VIA : PIA" }, { v: "2,6+ mld", l: "Aktiva fondu" }, { v: "725+", l: "Postavených bytů" }, { v: "36", l: "SPV entit" }].map((b, i) => (
              <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: c.gold }}>{b.v}</div><div style={{ fontSize: 10, color: c.faint }}>{b.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${c.border}` }}>
        <div style={{ ...S.section, paddingBottom: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${c.gold},${c.goldLight})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: c.bg, fontSize: 13 }}>S</div>
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>SPILBERK</span>
              </div>
              <p style={{ fontSize: 10.5, color: c.faint, lineHeight: 1.7, maxWidth: 300 }}>SPILBERK investiční fond SICAV, a.s. je fondem kvalifikovaných investorů dle zákona č. 240/2013 Sb. (ZISIF). Hodnota investice může klesat i stoupat. KID na avantfunds.cz.</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Fond</div>
              {["fund.spilberk.com", "ISIN: CZ0008042645", "IČO: 051 94 148", "LEI: 315700AKR2M5RKLX8220", "Založen: 26. 6. 2016"].map(t => <div key={t} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{t}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Kontakt</div>
              {["invest@spilberk.com", "office@spilberk.com", "+420 725 926 580", "Triniti Office Center", "Trnitá 500/9, 602 00 Brno"].map(t => <div key={t} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{t}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.faint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Governance</div>
              {["AVANT investiční společnost", "ČSOB (depozitář)", "ČNB (regulátor)", "AUDIT ONE (auditor)", "BDO Czech Republic (daně)"].map(t => <div key={t} style={{ fontSize: 11, color: c.faint, marginBottom: 5 }}>{t}</div>)}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${c.border}`, padding: "20px 36px", maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "rgba(255,255,255,0.2)" }}>
          <span>© 2016–2026 SPILBERK investiční fond SICAV, a.s. Všechna práva vyhrazena.</span>
          <span>KID na avantfunds.cz · Statut fondu · Výroční zpráva 2024 · www.spilberk.com · www.urbanblok.cz</span>
        </div>
      </footer>
    </div>
  );
}
