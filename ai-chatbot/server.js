/**
 * Express backend for the AI chatbot.
 *
 * The browser never calls Gemini. It only posts to /chat.
 * This file reads GEMINI_API_KEY from .env, sends the user's question
 * to Gemini, and returns Gemini's generated text as { reply }.
 */

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Default model: gemini-2.5-flash
 * Official Google Gen AI SDK (@google/genai) generateContent method.
 * Fast and suitable for a general chatbot. Override with GEMINI_MODEL.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const GENERIC_ERROR = "Sorry, I couldn't process your request right now. Please try again.";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  const value = typeof key === "string" ? key.trim() : "";
  const placeholders = new Set(["", "YOUR_API_KEY", "YOUR_API_KEY_HERE"]);
  if (placeholders.has(value)) return null;
  return value;
}

function friendlyError(error) {
  const status = error?.status || error?.statusCode || error?.code;
  const raw = String(error?.message || error || "").toLowerCase();

  if (status === 401 || status === 403 || raw.includes("api key") || raw.includes("permission") || raw.includes("unauthenticated") || raw.includes("invalid")) {
    return { status: 401, reply: "Sorry, I couldn't process your request right now. Please check the Gemini API key and try again." };
  }

  if (status === 429 || raw.includes("resource exhausted") || raw.includes("rate") || raw.includes("quota")) {
    return { status: 429, reply: "Sorry, I couldn't process your request right now. Please wait a moment and try again." };
  }

  if (raw.includes("fetch") || raw.includes("network") || raw.includes("enotfound") || raw.includes("econnrefused") || raw.includes("timeout")) {
    return { status: 503, reply: GENERIC_ERROR };
  }

  return { status: 500, reply: GENERIC_ERROR };
}

/**
 * Gemini conversation format: roles are "user" and "model".
 */
function buildGeminiContents(history, currentMessage) {
  const contents = [];

  if (Array.isArray(history)) {
    for (const item of history) {
      const text = typeof item?.text === "string" ? item.text.trim() : "";
      if (!text) continue;
      const role = item.role === "assistant" || item.role === "model" ? "model" : "user";
      contents.push({ role, parts: [{ text }] });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: currentMessage }]
  });

  return contents;
}

/** Pull the generated text from the official SDK response. */
function extractReply(response) {
  if (response?.text && String(response.text).trim()) {
    return String(response.text).trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts || [];
  const fromParts = parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return fromParts;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    model: GEMINI_MODEL,
    apiKeyConfigured: Boolean(getApiKey())
  });
});

/**
 * POST /chat
 * Incoming JSON: { "message": "user's question", "history": optional }
 * Outgoing JSON: { "reply": "Gemini's generated answer" }
 */
app.post("/chat", async (req, res) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return res.status(500).json({
      error: true,
      reply: "The chatbot is not configured yet. Add your Gemini API key to the .env file and restart the server."
    });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({
      error: true,
      reply: "Please type a message before sending."
    });
  }

  if (message.length > 8000) {
    return res.status(400).json({
      error: true,
      reply: "That message is too long. Please shorten it and try again."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Keep last 8 messages for history to maximize speed
    const rawHistory = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
    const contents = buildGeminiContents(rawHistory, message);

    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction:
          "You are AI Assistant, a helpful chatbot. Answer the user's question clearly and accurately. Do not use canned replies."
      }
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini API error:", error);
    if (!res.headersSent) {
      const mapped = friendlyError(error);
      return res.status(mapped.status).json({
        error: true,
        reply: mapped.reply
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: true, text: "\n[Error generating response]" })}\n\n`);
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`AI Chatbot server running at http://localhost:${PORT}`);
  console.log(`Gemini model: ${GEMINI_MODEL}`);

  if (!getApiKey()) {
    console.warn("GEMINI_API_KEY is missing or still a placeholder.");
    console.warn("Get a key from https://aistudio.google.com/apikey and put it in .env");
  }
});
