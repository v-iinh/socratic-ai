// Create a null array.
// For every message input, read and store the current database. 
// Change temperature and prompting to modify output. 

import Groq from "https://cdn.skypack.dev/groq-sdk";

const llama_key = `${settings.llama.apiKey}`;
const groq = new Groq({ apiKey: llama_key, dangerouslyAllowBrowser: true });

let archivedHistory = [
    {
        role: "system",
        content: ``
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