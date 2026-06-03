import { useState } from "react";
import toast from "react-hot-toast";

import EmailForm from "../components/EmailForm";
import EmailPreview from "../components/EmailPreview";
import ResultModal from "../components/ResultModal";
import Loader from "../components/Loader";
import { sendBulkEmail } from "../services/api";

/**
 * Dashboard - main page where the user composes and sends a bulk campaign.
 * Manages submission state, preview state and the result modal.
 */
const Dashboard = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formSnapshot, setFormSnapshot] = useState({
    senderEmail: "",
    subject: "",
    message: "",
    recipientsRaw: "",
  });
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    const toastId = toast.loading(
      `Sending to ${payload.recipients.length} recipient${
        payload.recipients.length === 1 ? "" : "s"
      }...`
    );

    try {
      const res = await sendBulkEmail(payload);
      const data = res.data || {};
      setResult({
        successCount: data.successCount,
        failedCount: data.failedCount,
        failedEmails: data.failedEmails,
        totalRecipients: data.totalRecipients,
        subject: payload.subject,
      });
      setModalOpen(true);

      if (data.failedCount === 0) {
        toast.success(`All ${data.successCount} emails sent`, { id: toastId });
      } else {
        toast(
          `Sent ${data.successCount}/${data.totalRecipients} — ${data.failedCount} failed`,
          { id: toastId, icon: "⚠️" }
        );
      }
    } catch (err) {
      const message = err?.message || "Failed to send emails";
      toast.error(message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const sampleRecipient = (() => {
    const tokens = (formSnapshot.recipientsRaw || "")
      .split(/[\s,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    return tokens[0] || "recipient@example.com";
  })();

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 4px" }}>Dashboard</h1>
        <p className="muted" style={{ margin: 0 }}>
          Send a single campaign to hundreds or thousands of recipients in one click.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)" }}>
        <EmailForm
          onSubmit={handleSubmit}
          submitting={submitting}
          onChange={setFormSnapshot}
        />
        <div style={{ position: "sticky", top: 80, alignSelf: "start" }}>
          <EmailPreview
            senderEmail={formSnapshot.senderEmail}
            subject={formSnapshot.subject}
            message={formSnapshot.message}
            sampleRecipient={sampleRecipient}
          />
        </div>
      </div>

      {submitting && <Loader fullscreen label="Sending campaign..." />}

      <ResultModal
        open={modalOpen}
        result={result}
        subject={result?.subject}
        onClose={() => setModalOpen(false)}
      />

      <style>{`
        @media (max-width: 1000px) {
          .container > .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
