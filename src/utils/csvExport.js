/**
 * Trigger a browser download for a CSV file produced from the given rows.
 *
 * @param {string} filename - Output filename including the .csv extension
 * @param {Array<Array<string|number>>} rows - 2D array of rows; the first row should be headers
 */
export const downloadCSV = (filename, rows) => {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell == null ? "" : String(cell);
          // Escape any value that contains a comma, quote, or newline
          if (/[",\n\r]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportFailedEmails = (failedEmails, campaignSubject = "campaign") => {
  if (!failedEmails || failedEmails.length === 0) return;
  const safeName = campaignSubject
    .replace(/[^a-z0-9-_]+/gi, "_")
    .slice(0, 40) || "campaign";
  const rows = [["email"], ...failedEmails.map((e) => [e])];
  downloadCSV(`failed_emails_${safeName}.csv`, rows);
};
