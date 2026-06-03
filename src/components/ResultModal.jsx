import { exportFailedEmails } from "../utils/csvExport";

/**
 * ResultModal - shown after a bulk send completes. Reports success/failure
 * counts and lets the user export the failed email list to CSV.
 *
 * Props:
 *   - open   : boolean
 *   - result : { successCount, failedCount, failedEmails, totalRecipients }
 *   - subject: campaign subject (used for the CSV filename)
 *   - onClose: handler
 */
const ResultModal = ({ open, result, subject, onClose }) => {
  if (!open || !result) return null;

  const { successCount = 0, failedCount = 0, failedEmails = [], totalRecipients = 0 } = result;
  const allSucceeded = failedCount === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 40,
        padding: 16,
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: allSucceeded ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)",
              color: allSucceeded ? "var(--success)" : "var(--warning)",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden
          >
            {allSucceeded ? "✓" : "!"}
          </div>
          <div>
            <h3 id="result-modal-title" style={{ margin: 0 }}>
              {allSucceeded ? "Campaign sent successfully" : "Campaign completed with errors"}
            </h3>
            <div className="muted">{totalRecipients} recipient{totalRecipients === 1 ? "" : "s"} processed</div>
          </div>
        </div>

        <hr className="hr" />

        <div className="grid grid-3" style={{ gap: 12 }}>
          <Stat label="Total" value={totalRecipients} />
          <Stat label="Success" value={successCount} tone="success" />
          <Stat label="Failed" value={failedCount} tone={failedCount ? "danger" : "default"} />
        </div>

        {failedCount > 0 && (
          <>
            <hr className="hr" />
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Failed recipients ({failedCount})</div>
            <div
              style={{
                maxHeight: 160,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 10,
                background: "var(--surface-2)",
                fontSize: 13,
                fontFamily: "monospace",
              }}
            >
              {failedEmails.map((e) => (
                <div key={e}>{e}</div>
              ))}
            </div>
          </>
        )}

        <div className="row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
          {failedCount > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => exportFailedEmails(failedEmails, subject)}
            >
              ⬇ Export failed CSV
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone = "default" }) => {
  const colors = {
    default: "var(--text)",
    success: "var(--success)",
    danger: "var(--danger)",
  };
  return (
    <div
      style={{
        background: "var(--surface-2)",
        borderRadius: 10,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div className="muted" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: colors[tone] }}>{value}</div>
    </div>
  );
};

export default ResultModal;
