require("dotenv").config();

async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await res.json();
  const validModels = data.models.filter(m => 
    m.supportedGenerationMethods.includes("generateContent") && 
    m.name.includes("gemini")
  ).map(m => m.name);
  console.log(validModels);
}

run();
