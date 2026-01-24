import { API_BASE_URL } from "./config";

const BASE_URL = `${API_BASE_URL}/api/interview`;
const DEFAULT_TIMEOUT_MS = 40000;

// ⏱️ Timeout wrapper for fetch
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return res;

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;

  } finally {
    clearTimeout(id);
  }
}

// 🔧 Unified response handler
async function handleResponse(res, fallbackMessage) {
  let data = null;

  try {
    data = await res.json();
  } catch {
    // Non-JSON or empty body
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      fallbackMessage ||
      "Request failed";

    throw new Error(message);
  }

  return data;
}

export async function startInterview(payload) {
  const res = await fetchWithTimeout(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "Failed to start interview");
}

export async function submitTheory(payload) {
  const res = await fetchWithTimeout(`${BASE_URL}/submit-theory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "Failed to submit answers");
}

export async function submitCode(interviewId, code) {
  const res = await fetchWithTimeout(`${BASE_URL}/submit-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviewId, code }),
  });

  return handleResponse(res, "Code submission failed");
}
