import { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import { parseRecipients, isValidEmail } from "../utils/emailValidator";
import StatisticsCard from "./StatisticsCard";
import Loader from "./Loader";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const EMPTY = {
  senderEmail: "",
  appPassword: "",
  subject: "",
  message: "",
  recipientsRaw: "",
};

/**
 * EmailForm - the primary dashboard form. Owns all input state, derives
 * the recipient stats from the textarea contents and surfaces them via the
 * `onChange` callback so the parent can render a preview alongside.
 *
 * Props:
 *   - onSubmit(payload) : async submit handler invoked with a sanitised payload
 *   - submitting        : boolean, disables the form while a send is in flight
 *   - onChange(state)   : optional callback receiving the latest form state
 */
const EmailForm = ({ onSubmit, submitting = false, onChange }) => {
  const [form, setForm] = useState(EMPTY);

  const update = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    onChange?.(next);
  };

  const stats = useMemo(
    () => parseRecipients(form.recipientsRaw),
    [form.recipientsRaw]
  );

  const senderEmailValid =
    form.senderEmail === "" || isValidEmail(form.senderEmail);

  const canSubmit =
    !submitting &&
    isValidEmail(form.senderEmail) &&
    form.appPassword.trim().length > 0 &&
    form.subject.trim().length > 0 &&
    form.message.replace(/<[^>]*>/g, "").trim().length > 0 &&
    stats.valid.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      senderEmail: form.senderEmail.trim(),
      appPassword: form.appPassword,
      subject: form.subject.trim(),
      message: form.message,
      recipients: stats.valid,
    });
  };

  const handleClear = () => {
    setForm(EMPTY);
    onChange?.(EMPTY);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="card">
        <h2 style={{ margin: "0 0 4px" }}>Compose campaign</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Provide your Gmail credentials and recipient list to send a bulk campaign.
        </p>
        <hr className="hr" />

        <div className="grid grid-2">
          <div>
            <label htmlFor="senderEmail">Sender email</label>
            <input
              id="senderEmail"
              type="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              value={form.senderEmail}
              onChange={(e) => update({ senderEmail: e.target.value })}
              disabled={submitting}
            />
            {!senderEmailValid && (
              <div className="muted" style={{ color: "var(--danger)", marginTop: 4 }}>
                Enter a valid email address.
              </div>
            )}
          </div>
          <div>
            <label htmlFor="appPassword">Gmail App Password</label>
            <input
              id="appPassword"
              type="password"
              autoComplete="off"
              placeholder="16-character app password"
              value={form.appPassword}
              onChange={(e) => update({ appPassword: e.target.value })}
              disabled={submitting}
            />
            <div className="muted" style={{ marginTop: 4 }}>
              Generate one at{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
              >
                myaccount.google.com/apppasswords
              </a>
              .
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="Your campaign subject line"
            value={form.subject}
            onChange={(e) => update({ subject: e.target.value })}
            disabled={submitting}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label>Message</label>
          <ReactQuill
            theme="snow"
            value={form.message}
            onChange={(html) => update({ message: html })}
            modules={QUILL_MODULES}
            readOnly={submitting}
            placeholder="Write your message. Use the toolbar for formatting..."
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label htmlFor="recipients">
            Recipients{" "}
            <span className="muted" style={{ fontWeight: 500 }}>
              (comma, semicolon, space or newline separated)
            </span>
          </label>
          <textarea
            id="recipients"
            placeholder={"user1@gmail.com\nuser2@gmail.com\nuser3@gmail.com"}
            value={form.recipientsRaw}
            onChange={(e) => update({ recipientsRaw: e.target.value })}
            disabled={submitting}
            spellCheck={false}
            style={{ minHeight: 160, fontFamily: "monospace", fontSize: 13 }}
          />
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <StatisticsCard label="Total entered" value={stats.total} icon="∑" tone="primary" />
          <StatisticsCard label="Valid" value={stats.valid.length} icon="✓" tone="success" />
          <StatisticsCard label="Invalid" value={stats.invalid.length} icon="✗" tone={stats.invalid.length ? "danger" : "default"} />
        </div>

        {stats.invalid.length > 0 && (
          <details style={{ marginTop: 12 }}>
            <summary className="muted" style={{ cursor: "pointer" }}>
              Show {stats.invalid.length} invalid entr{stats.invalid.length === 1 ? "y" : "ies"}
            </summary>
            <div
              style={{
                marginTop: 8,
                maxHeight: 120,
                overflowY: "auto",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 10,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {stats.invalid.map((e) => <div key={e}>{e}</div>)}
            </div>
          </details>
        )}

        <hr className="hr" />

        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={handleClear} disabled={submitting}>
            Clear form
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            {submitting ? <Loader label="Sending..." size={16} /> : `Send to ${stats.valid.length} recipient${stats.valid.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmailForm;
