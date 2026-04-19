export default function KatalogPage() {
  return (
    <div style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#0d0d0d",
      color: "#fff",
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{
            width: 30, height: 30,
            background: "#c9a84c",
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#0d0d0d", fontSize: 13,
          }}>S</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2.5px" }}>SPILBERK</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", marginLeft: 6 }}>
              investiční fond SICAV
            </span>
          </div>
        </a>
      </header>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72,
          background: "rgba(201,168,76,0.1)",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Katalog fondu</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 300 }}>
            Kompletní katalog Spilberk investičního fondu SICAV.
          </p>
        </div>
        <a
          href="/catalogue.pdf"
          download="Spilberk-katalog.pdf"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px",
            background: "#c9a84c", color: "#0d0d0d",
            fontWeight: 700, fontSize: 14,
            borderRadius: 50, textDecoration: "none",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Stáhnout katalog
        </a>
      </div>
    </div>
  );
}
