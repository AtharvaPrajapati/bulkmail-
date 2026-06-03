/**
 * Inline loader / spinner. Pass `label` to render text next to the spinner,
 * or use `fullscreen` to overlay the entire viewport while a send is in flight.
 */
const Loader = ({ label = "Loading...", fullscreen = false, size = 22 }) => {
  const spinner = (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        border: "3px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        display: "inline-block",
        animation: "bes-spin 0.8s linear infinite",
      }}
    />
  );

  const content = (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
    >
      {spinner}
      {label && <span style={{ color: "var(--text)", fontWeight: 600 }}>{label}</span>}
    </div>
  );

  if (!fullscreen) return <>{content}<KeyframeStyles /></>;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {spinner}
        <div>
          <div style={{ fontWeight: 700 }}>{label}</div>
          <div className="muted">This may take a moment for large lists...</div>
        </div>
      </div>
      <KeyframeStyles />
    </div>
  );
};

const KeyframeStyles = () => (
  <style>{`@keyframes bes-spin { to { transform: rotate(360deg); } }`}</style>
);

export default Loader;
