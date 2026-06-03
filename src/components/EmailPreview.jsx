/**
 * EmailPreview - renders the campaign exactly as it will arrive in the
 * recipient's inbox (sender, subject, then the HTML body).
 */
const EmailPreview = ({ senderEmail, subject, message, sampleRecipient }) => {
  const hasContent = subject?.trim() || message?.trim();

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }} aria-hidden>👁</span>
        <strong>Email preview</strong>
        <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>
          What recipients will see
        </span>
      </div>

      {!hasContent ? (
        <div style={{ padding: 24 }} className="muted">
          Fill in the subject and message to see a live preview here.
        </div>
      ) : (
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span className="muted">From: </span>
            <strong>{senderEmail || "your-email@gmail.com"}</strong>
          </div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span className="muted">To: </span>
            <strong>{sampleRecipient || "recipient@example.com"}</strong>
          </div>
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            <span className="muted">Subject: </span>
            <strong>{subject || "(no subject)"}</strong>
          </div>
          <hr className="hr" />
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 16,
              minHeight: 120,
              maxHeight: 360,
              overflowY: "auto",
              lineHeight: 1.55,
            }}
            // The message is HTML produced by the rich text editor. It originates
            // from the same user submitting the form, so dangerouslySetInnerHTML
            // is acceptable here. Avoid rendering untrusted third-party HTML.
            dangerouslySetInnerHTML={{ __html: message || "<em>(empty body)</em>" }}
          />
        </div>
      )}
    </div>
  );
};

export default EmailPreview;
