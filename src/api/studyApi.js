export async function generateStudy(payload) {
  const response = await fetch("http://localhost:8080/api/study/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to generate study material");
  }

  return response.json();
}


