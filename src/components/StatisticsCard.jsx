/**
 * Compact KPI tile used both on the dashboard and on the history page.
 *
 * Props:
 *   - label    : caption
 *   - value    : main metric (string or number)
 *   - tone     : "default" | "success" | "danger" | "warning" | "primary"
 *   - hint     : optional small descriptor under the value
 *   - icon     : optional emoji/icon node
 */
const toneStyles = {
  default: { color: "var(--text)", bg: "var(--surface-2)" },
  primary: { color: "var(--primary)", bg: "rgba(79,70,229,0.12)" },
  success: { color: "var(--success)", bg: "rgba(22,163,74,0.12)" },
  danger:  { color: "var(--danger)",  bg: "rgba(220,38,38,0.12)" },
  warning: { color: "var(--warning)", bg: "rgba(217,119,6,0.12)" },
};

const StatisticsCard = ({ label, value, tone = "default", hint, icon }) => {
  const styles = toneStyles[tone] || toneStyles.default;

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: styles.bg,
              color: styles.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>
            {label}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: styles.color,
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
          {hint && <div className="muted" style={{ fontSize: 12 }}>{hint}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
