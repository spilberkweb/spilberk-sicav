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
      <style>{`
        @media (max-width: 680px) {
          .pdf-frame { display: none !important; }
          .mobile-view { display: flex !important; }
          .logo-sub { display: none; }
        }
      `}</style>

      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
        background: "rgba(13,13,13,0.95)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <div style={{
            width: 30, height: 30,
            background: "#c9a84c",
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#0d0d0d", fontSize: 13, flexShrink: 0,
          }}>S</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2.5px" }}>SPILBERK</span>
            <span className="logo-sub" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", marginLeft: 6 }}>
              investiční fond SICAV
            </span>
          </div>
        </a>
        <a
          href="/catalogue.pdf"
          download="Spilberk-katalog.pdf"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 18px",
            background: "#c9a84c", color: "#0d0d0d",
            fontWeight: 700, fontSize: 12,
            border: "none", borderRadius: 50,
            textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Stáhnout PDF
        </a>
      </header>

      <div className="pdf-frame" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <iframe
          src="/catalogue.pdf"
          title="Spilberk investiční fond — katalog"
          style={{ flex: 1, width: "100%", border: "none" }}
        />
      </div>

      <div className="mobile-view" style={{
        display: "none",
        flex: 1,
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
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Katalog fondu</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 280 }}>
          Pro zobrazení katalogu otevřete soubor nebo si jej stáhněte do zařízení.
        </p>
        <a href="/catalogue.pdf" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 22px",
          background: "#c9a84c", color: "#0d0d0d",
          fontWeight: 700, fontSize: 12,
          borderRadius: 50, textDecoration: "none",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Otevřít katalog
        </a>
        <a href="/catalogue.pdf" download="Spilberk-katalog.pdf" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 22px",
          background: "transparent", color: "rgba(255,255,255,0.6)",
          fontSize: 12, fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 50, textDecoration: "none",
        }}>
          Stáhnout PDF
        </a>
      </div>
    </div>
  );
}
