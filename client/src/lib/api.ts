const BASE = "http://localhost:5000/api";

type ApiResponse<T> = Promise<T>;

export const api = {
  get: async <T>(url: string): ApiResponse<T> => {
    const res = await fetch(BASE + url);
    return res.json();
  },

  post: async <T, B = unknown>(url: string, body: B): ApiResponse<T> => {
    const res = await fetch(BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  put: async <T, B = unknown>(url: string, body: B): ApiResponse<T> => {
    const res = await fetch(BASE + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  del: async <T>(url: string): ApiResponse<T> => {
    const res = await fetch(BASE + url, {
      method: "DELETE",
    });
    return res.json();
  },
};