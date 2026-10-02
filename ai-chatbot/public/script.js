/**
 * Frontend chat logic.
 * Messages are sent with Fetch to POST /chat on this project's Express server.
 * The Gemini API key stays on the server and is never used in this file.
 */

const STORAGE_KEY = "ai-assistant-session";

const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const menuBtn = document.getElementById("menuBtn");
const newChatBtn = document.getElementById("newChatBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const historyList = document.getElementById("historyList");
const messagesEl = document.getElementById("messages");
const welcomeScreen = document.getElementById("welcomeScreen");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const promptGrid = document.getElementById("promptGrid");

let conversations = [];
let activeId = null;
let isWaiting = false;

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Lightweight formatting so code replies stay readable without a library. */
function formatMessage(text) {
  const escaped = escapeHtml(text);
  const withBlocks = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  const withInline = withBlocks.replace(/`([^`]+)`/g, "<code>$1</code>");
  const withBold = withInline.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return withBold.replace(/\n/g, "<br>");
}

function saveSession() {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ conversations, activeId })
  );
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    conversations = Array.isArray(data.conversations) ? data.conversations : [];
    activeId = data.activeId || null;
  } catch {
    conversations = [];
    activeId = null;
  }
}

function getActiveConversation() {
  return conversations.find((item) => item.id === activeId) || null;
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarBackdrop.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
}

function openSidebar() {
  sidebar.classList.add("open");
  sidebarBackdrop.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
}

function setWaiting(waiting) {
  isWaiting = waiting;
  sendBtn.disabled = waiting;
  messageInput.disabled = waiting;
}

function autoResizeInput() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 160)}px`;
}

function scrollToLatest() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (!conversations.length) {
    historyList.innerHTML = `<p class="empty-history">No chats yet. Start a new conversation.</p>`;
    return;
  }

  conversations.forEach((chat) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `history-item${chat.id === activeId ? " active" : ""}`;
    button.innerHTML = `<strong>${escapeHtml(chat.title)}</strong><span class="meta">${escapeHtml(chat.updatedAt)}</span>`;
    button.addEventListener("click", () => {
      activeId = chat.id;
      saveSession();
      renderHistory();
      renderMessages();
      closeSidebar();
    });
    historyList.appendChild(button);
  });
}

function createMessageRow(role, html, time, extraClass = "") {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role === "user" ? "user-avatar" : "ai-avatar"}`;
  avatar.setAttribute("aria-hidden", "true");
  avatar.innerHTML =
    role === "user"
      ? `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.8"/><path d="M5 19c1.5-3.2 3.8-4.8 7-4.8s5.5 1.6 7 4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M12 3.5c.8 2.4 2.1 3.7 4.5 4.5-2.4.8-3.7 2.1-4.5 4.5-.8-2.4-2.1-3.7-4.5-4.5 2.4-.8 3.7-2.1 4.5-4.5Z" fill="currentColor"/></svg>`;

  const wrap = document.createElement("div");
  const bubble = document.createElement("div");
  bubble.className = `bubble ${extraClass}`.trim();
  bubble.innerHTML = html;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = time;

  wrap.append(bubble, meta);
  row.append(avatar, wrap);
  return row;
}

function renderMessages() {
  const chat = getActiveConversation();
  messagesEl.innerHTML = "";

  if (!chat || chat.messages.length === 0) {
    welcomeScreen.hidden = false;
    return;
  }

  welcomeScreen.hidden = true;
  chat.messages.forEach((item) => {
    messagesEl.appendChild(
      createMessageRow(item.role === "user" ? "user" : "ai", formatMessage(item.text), item.time, item.error ? "error" : "")
    );
  });
  scrollToLatest();
}

function ensureConversation() {
  let chat = getActiveConversation();
  if (chat) return chat;

  chat = {
    id: createId(),
    title: "New chat",
    updatedAt: formatTime(),
    messages: []
  };
  conversations.unshift(chat);
  activeId = chat.id;
  saveSession();
  renderHistory();
  return chat;
}

function addTypingIndicator() {
  const row = createMessageRow(
    "ai",
    `<div class="typing" aria-label="AI is thinking"><span></span><span></span><span></span><em>AI is thinking...</em></div>`,
    "Just now"
  );
  row.id = "typingRow";
  messagesEl.appendChild(row);
  scrollToLatest();
}

function removeTypingIndicator() {
  document.getElementById("typingRow")?.remove();
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content || isWaiting) return;

  const chat = ensureConversation();
  welcomeScreen.hidden = true;

  if (chat.messages.length === 0) {
    chat.title = content.slice(0, 42);
  }

  const time = formatTime();
  chat.messages.push({ role: "user", text: content, time });
  chat.updatedAt = time;
  saveSession();
  renderHistory();
  renderMessages();

  setWaiting(true);
  addTypingIndicator();

  const history = chat.messages
    .slice(0, -1)
    .filter((item) => !item.error)
    .map((item) => ({ role: item.role, text: item.text }));

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content, history })
    });

    if (!response.ok) {
      let data = {};
      try { data = await response.json(); } catch { data = {}; }
      removeTypingIndicator();
      const reply = data.reply || "Sorry, I couldn't process your request right now. Please try again.";
      chat.messages.push({
        role: "assistant",
        text: reply,
        time: formatTime(),
        error: true
      });
    } else {
      removeTypingIndicator();

      const aiMsg = {
        role: "assistant",
        text: "",
        time: formatTime()
      };
      chat.messages.push(aiMsg);

      const aiRow = createMessageRow("ai", "", aiMsg.time);
      messagesEl.appendChild(aiRow);
      const bubbleEl = aiRow.querySelector(".bubble");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                aiMsg.text += parsed.text;
                if (bubbleEl) {
                  bubbleEl.innerHTML = formatMessage(aiMsg.text);
                  scrollToLatest();
                }
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch {
    removeTypingIndicator();
    let errorText = "Sorry, I couldn't process your request right now. Please try again.";
    if (window.location.protocol === "file:") {
      errorText = "⚠️ Please open http://localhost:3000 in your browser address bar instead of opening the HTML file directly.";
    }
    chat.messages.push({
      role: "assistant",
      text: errorText,
      time: formatTime(),
      error: true
    });
  }

  chat.updatedAt = formatTime();
  saveSession();
  renderHistory();
  renderMessages();
  setWaiting(false);
  messageInput.focus();
}

function confirmAction(message) {
  return window.confirm(message);
}

function startNewChat() {
  const current = getActiveConversation();
  if (current && current.messages.length === 0) {
    renderMessages();
    closeSidebar();
    messageInput.focus();
    return;
  }

  activeId = null;
  ensureConversation();
  renderMessages();
  closeSidebar();
  messageInput.focus();
}

menuBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) closeSidebar();
  else openSidebar();
});

sidebarBackdrop.addEventListener("click", closeSidebar);

newChatBtn.addEventListener("click", startNewChat);

clearChatBtn.addEventListener("click", () => {
  const chat = getActiveConversation();
  if (!chat || chat.messages.length === 0) return;
  if (!confirmAction("Clear this conversation? This cannot be undone.")) return;
  chat.messages = [];
  chat.title = "New chat";
  chat.updatedAt = formatTime();
  saveSession();
  renderHistory();
  renderMessages();
});

clearHistoryBtn.addEventListener("click", () => {
  if (!conversations.length) return;
  if (!confirmAction("Clear all chat history for this session?")) return;
  conversations = [];
  activeId = null;
  saveSession();
  renderHistory();
  renderMessages();
  closeSidebar();
});

promptGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".prompt-card");
  if (!card) return;
  sendMessage(card.dataset.prompt);
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = messageInput.value.trim();
  if (!value) return;
  messageInput.value = "";
  autoResizeInput();
  sendMessage(value);
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

messageInput.addEventListener("input", autoResizeInput);

loadSession();
if (!getActiveConversation()) {
  ensureConversation();
}
renderHistory();
renderMessages();
messageInput.focus();
