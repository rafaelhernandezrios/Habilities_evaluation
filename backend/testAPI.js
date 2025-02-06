// testOpenAi.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Hello, can you summarize yourself?" }
      ],
    });
    console.log("OpenAI response:", response.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI error:", err);
  }
})();
