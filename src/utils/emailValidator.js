// Mirror of the backend regex so we can validate locally before submitting
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parse arbitrary user input (comma-, semicolon-, space- or newline-separated)
 * into deduplicated valid and invalid email buckets.
 */
export const parseRecipients = (input) => {
  if (!input) return { valid: [], invalid: [], total: 0 };

  const tokens = String(input)
    .split(/[\s,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const seen = new Set();
  const valid = [];
  const invalid = [];

  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);

    if (EMAIL_REGEX.test(token)) {
      valid.push(token);
    } else {
      invalid.push(token);
    }
  }

  return { valid, invalid, total: valid.length + invalid.length };
};

export const isValidEmail = (email) =>
  typeof email === "string" && EMAIL_REGEX.test(email.trim());
