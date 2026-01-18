const BASE_URL = "http://localhost:8080/api/interview";

export async function startInterview(payload) {
  const res = await fetch(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to start interview");
  return res.json();
}

export async function submitTheory(payload) {
  const res = await fetch(`${BASE_URL}/submit-theory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit answers");
  return res.json();
}

export async function submitCode(interviewId, code) {
  const res = await fetch(`${BASE_URL}/submit-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviewId, code })
  });

  if (!res.ok) {
    throw new Error("Code submission failed");
  }

  return res.json();
}
