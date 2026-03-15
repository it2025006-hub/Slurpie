async function test() {
  try {
    const res = await fetch("http://localhost:5000/api/chat/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What food is currently available on the site?" })
    });
    const text = await res.text();
    console.log("Response:", text);
  } catch(e) {
    console.log("Error:", e);
  }
}
test();
