
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),

  post: (endpoint, body) => apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) => apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  }),

  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};
