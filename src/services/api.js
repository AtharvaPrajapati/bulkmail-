import axios from "axios";

// Resolve the API base URL with sensible defaults:
//   - If VITE_API_BASE_URL is set (build-time), use it as-is.
//   - Otherwise, in production assume the API is on the same origin (single-
//     artifact deployment where the backend serves the built frontend).
//   - In development, fall back to the local backend port.
const resolveBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.PROD) return "/api";
  return "http://localhost:3000/api";
};

const baseURL = resolveBaseURL();

// Configured Axios instance shared across the app
const api = axios.create({
  baseURL,
  // Bulk sends can take a while when there are thousands of recipients
  timeout: 5 * 60 * 1000,
  headers: { "Content-Type": "application/json" },
});

// Centralised error normalisation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected network error";
    const errors = error.response?.data?.errors || [];
    return Promise.reject({ message, errors, status: error.response?.status });
  }
);

/**
 * Trigger a bulk email send.
 * @param {{senderEmail:string, appPassword:string, subject:string, message:string, recipients:string[]|string}} payload
 */
export const sendBulkEmail = async (payload) => {
  const { data } = await api.post("/email/send", payload);
  return data;
};

/** Paginated campaign history. */
export const listCampaigns = async ({ page = 1, limit = 20, search = "" } = {}) => {
  const { data } = await api.get("/campaigns", {
    params: { page, limit, search },
  });
  return data;
};

/** Fetch a single campaign by id. */
export const getCampaign = async (id) => {
  const { data } = await api.get(`/campaigns/${id}`);
  return data;
};

export default api;
