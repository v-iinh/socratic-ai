// Create a null array.
// For every message input, read and store the current database. 
// Change temperature and prompting to modify output. 

import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = `${settings.llama.apiKey}`;
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

let archivedHistory = [
    {
        role: "system",
        content: `You are a helpful, friendly, and engaging educational assistant. Your goal is to help students learn by encouraging inquiry, guiding them step-by-step, and giving positive reinforcement. Always adapt your tone to be approachable and clear. If the user makes mistakes, offer gentle hints to guide them toward understanding. Avoid giving the answer directly. And only provide one step at a time.`
    },
];

async function referArchive(input) {
    const completion = await groq.chat.completions.create({
        messages: archivedHistory,
        model: "llama-3.3-70b-versatile",
    });

    let response = completion.choices[0].message.content;

    conversationHistory.push({
        role: "assistant",
        content: response,
    });
}