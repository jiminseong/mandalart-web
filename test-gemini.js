const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(
    "Using Key ending in:",
    process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(-4) : "None",
  );
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to get access? No, usually separate method.
    // Actually the SDK doesn't expose listModels directly on the main class in some versions, but let's check.
    // Documentation says we might need to use the API directly or check if the SDK has it.
    // Let's try to just run a generation with a simple model name 'gemini-pro' again to see if it works in isolation.
    // Or better, let's use the fetch implementation to list models if SDK doesn't support it easily.

    // Actually, let's try to run a simple generateContent with "gemini-1.5-flash" to verify it outside of Next.js env.
    const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await modelFlash.generateContent("Hello");
    console.log("Flash response:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
