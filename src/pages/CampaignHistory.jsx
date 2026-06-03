import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StatisticsCard from "../components/StatisticsCard";
import Loader from "../components/Loader";
import { listCampaigns } from "../services/api";
import { exportFailedEmails } from "../utils/csvExport";

const PAGE_SIZE = 10;

/**
 * CampaignHistory - lists previously sent campaigns with search + pagination
 * and aggregate statistics across the visible page.
 */
const CampaignHistory = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const res = await listCampaigns({ page, limit: PAGE_SIZE, search: searchTerm });
      setItems(res.data.items || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      toast.error(err?.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, "");
  }, []);

  // Debounced search
  useEffect(() => {
    const handle = setTimeout(() => fetchData(1, search.trim()), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const totals = items.reduce(
    (acc, c) => {
      acc.total += c.totalRecipients || 0;
      acc.success += c.successCount || 0;
      acc.failed += c.failedCount || 0;
      return acc;
    },
    { total: 0, success: 0, failed: 0 }
  );

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 4px" }}>Campaign history</h1>
        <p className="muted" style={{ margin: 0 }}>
          Browse and search the campaigns you have sent.
        </p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatisticsCard label="Campaigns" value={pagination.total} icon="📨" tone="primary" />
        <StatisticsCard label="Total sent" value={totals.total} icon="∑" />
        <StatisticsCard label="Delivered" value={totals.success} icon="✓" tone="success" />
        <StatisticsCard label="Failures" value={totals.failed} icon="✗" tone={totals.failed ? "danger" : "default"} />
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <input
            type="search"
            placeholder="Search by subject or sender email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
          />
          <div className="spacer" />
          {loading && <Loader label="Loading..." />}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <Th>Date</Th>
                <Th>Sender</Th>
                <Th>Subject</Th>
                <Th align="right">Total</Th>
                <Th align="right">Sent</Th>
                <Th align="right">Failed</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: "center" }} className="muted">
                    No campaigns found.
                  </td>
                </tr>
              )}
              {items.map((c) => (
                <CampaignRow
                  key={c._id}
                  campaign={c}
                  expanded={expandedId === c._id}
                  onToggle={() => setExpandedId(expandedId === c._id ? null : c._id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="row" style={{ marginTop: 16, justifyContent: "center" }}>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={pagination.page <= 1 || loading}
              onClick={() => fetchData(pagination.page - 1, search.trim())}
            >
              ← Prev
            </button>
            <span className="muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => fetchData(pagination.page + 1, search.trim())}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Th = ({ children, align = "left" }) => (
  <th style={{ padding: "10px 12px", textAlign: align, borderBottom: "1px solid var(--border)" }}>
    {children}
  </th>
);

const Td = ({ children, align = "left" }) => (
  <td style={{ padding: "12px", textAlign: align, borderBottom: "1px solid var(--border)", verticalAlign: "top" }}>
    {children}
  </td>
);

const CampaignRow = ({ campaign, expanded, onToggle }) => {
  const date = new Date(campaign.createdAt).toLocaleString();
  const failed = campaign.failedCount || 0;

  return (
    <>
      <tr>
        <Td>{date}</Td>
        <Td>{campaign.senderEmail}</Td>
        <Td>{campaign.subject}</Td>
        <Td align="right">{campaign.totalRecipients}</Td>
        <Td align="right"><span className="badge success">{campaign.successCount}</span></Td>
        <Td align="right">
          {failed > 0 ? <span className="badge danger">{failed}</span> : <span className="badge">0</span>}
        </Td>
        <Td align="right">
          <button type="button" className="btn btn-ghost" onClick={onToggle}>
            {expanded ? "Hide" : "View"}
          </button>
        </Td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ background: "var(--surface-2)", padding: 16 }}>
            <div style={{ marginBottom: 10 }}>
              <strong>Message:</strong>
              <div
                style={{
                  marginTop: 6,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 12,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: campaign.message }}
              />
            </div>
            {failed > 0 && (
              <div>
                <div className="row">
                  <strong>Failed emails ({failed})</strong>
                  <div className="spacer" />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => exportFailedEmails(campaign.failedEmails, campaign.subject)}
                  >
                    ⬇ Export CSV
                  </button>
                </div>
                <div
                  style={{
                    marginTop: 6,
                    maxHeight: 160,
                    overflowY: "auto",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 10,
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  {(campaign.failedEmails || []).map((e) => <div key={e}>{e}</div>)}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default CampaignHistory;
