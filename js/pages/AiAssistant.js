/**
 * DiplomaStudy - AI Study Assistant Page View
 * Interactive chat assistant with suggested prompts and instant engineering responses
 */

import { AppShell } from "../components/AppShell.js";
import { aiService } from "../features/ai/aiService.js";
import { Toast } from "../components/Toast.js";

export function renderAiAssistant() {
  AppShell.updateHeader({
    title: "AI Study Tutor",
    subtitle: "Ask formulas, concepts & exam prep",
    showBack: true,
    showSearch: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  let messages = aiService.getChatHistory();

  const suggestedPrompts = [
    "Explain Ohm's Law simply in Bangla",
    "Explain Cramer's Rule for Math-1",
    "Give me important questions for C programming",
    "Explain Point of Contraflexure in Civil",
    "Create MCQ with answer and explanation",
    "How to prepare for BTEB semester finals?"
  ];

  const renderMessages = () => {
    const chatBox = main.querySelector("#ai-chat-messages");
    if (!chatBox) return;

    chatBox.innerHTML = messages.map((m, idx) => {
      const isUser = m.role === "user";
      return `
        <div class="flex flex-col mb-md ${isUser ? "items-end" : "items-start"}" id="msg-${idx}">
          <div class="flex items-center gap-xs mb-xs">
            <span class="text-xs font-bold ${isUser ? "text-forest" : "text-accent"}">${isUser ? "You" : "🤖 DiplomaStudy AI"}</span>
            <span class="text-xs text-dim">${m.time || ""}</span>
          </div>

          <div class="p-md" style="
            max-width: 90%; 
            border-radius: var(--radius-md); 
            background-color: ${isUser ? "var(--color-forest)" : "var(--color-surface)"}; 
            color: ${isUser ? "#FFFFFF" : "var(--color-text)"};
            border: 1px solid ${isUser ? "var(--color-forest)" : "var(--color-border)"};
            box-shadow: var(--shadow-sm);
            line-height: 1.5;
            font-size: 13px;
            white-space: pre-wrap;
          ">
            ${m.text}
          </div>

          ${!isUser ? `
            <button class="btn-copy-msg text-xs text-dim mt-xs hover:text-forest" data-index="${idx}" style="background: none; border: none; cursor: pointer; padding: 2px 4px;">
              📋 Copy explanation
            </button>
          ` : ""}
        </div>
      `;
    }).join("");

    chatBox.querySelectorAll(".btn-copy-msg").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        const text = messages[idx]?.text || "";
        navigator.clipboard.writeText(text).then(() => {
          Toast.show("Explanation copied to clipboard", "success");
        });
      });
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  };

  main.innerHTML = `
    <!-- Mode Badge -->
    <div class="flex items-center justify-between p-xs mb-sm text-xs text-muted" style="background-color: var(--color-surface-hover); border-radius: var(--radius-xs);">
      <span>⚡ Running in <strong>Local Engineering Tutor Mode</strong></span>
      <button class="btn btn-secondary btn-sm" id="btn-clear-chat" style="padding: 2px 8px; font-size: 11px;">Clear Chat</button>
    </div>

    <!-- Chat Messages Scroll Container -->
    <div id="ai-chat-messages" style="height: 380px; overflow-y: auto; padding: 4px; display: flex; flex-direction: column;"></div>

    <!-- Suggested Prompts Chips -->
    <div class="my-sm">
      <span class="text-xs font-bold text-muted block mb-xs">Suggested Inquiries:</span>
      <div class="flex items-center gap-xs overflow-x-auto pb-xs" id="ai-prompt-chips" style="scrollbar-width: none;">
        ${suggestedPrompts.map((p) => `
          <button class="badge badge-sage prompt-chip" style="white-space: nowrap; cursor: pointer; padding: 6px 10px;">${p}</button>
        `).join("")}
      </div>
    </div>

    <!-- Input Form -->
    <form id="ai-chat-form" class="flex items-center gap-xs mt-xs">
      <input 
        type="text" 
        id="ai-user-input" 
        class="search-input flex-1" 
        placeholder="Type engineering question or topic in Bangla or English..." 
        autocomplete="off"
      />
      <button type="submit" class="btn btn-primary" id="ai-send-btn" style="padding: 10px 18px;">
        <span>Send</span>
      </button>
    </form>
  `;

  renderMessages();

  // Handle send message
  const handleSend = async (text) => {
    if (!text || !text.trim()) return;
    const userText = text.trim();
    const input = main.querySelector("#ai-user-input");
    if (input) input.value = "";

    const userMsg = {
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    messages.push(userMsg);
    aiService.saveChatHistory(messages);
    renderMessages();

    // Show temporary typing indicator
    const chatBox = main.querySelector("#ai-chat-messages");
    if (chatBox) {
      const typingEl = document.createElement("div");
      typingEl.id = "ai-typing-indicator";
      typingEl.className = "flex items-center gap-xs p-sm text-xs text-muted";
      typingEl.innerHTML = `<span>🤖 Analyzing engineering concepts...</span>`;
      chatBox.appendChild(typingEl);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    const aiResp = await aiService.askQuestion(userText);
    const typing = document.getElementById("ai-typing-indicator");
    if (typing) typing.remove();

    messages.push(aiResp);
    aiService.saveChatHistory(messages);
    renderMessages();
  };

  main.querySelector("#ai-chat-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = main.querySelector("#ai-user-input");
    handleSend(input?.value);
  });

  main.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      handleSend(chip.textContent);
    });
  });

  main.querySelector("#btn-clear-chat")?.addEventListener("click", () => {
    aiService.clearChatHistory();
    messages = aiService.getChatHistory();
    renderMessages();
    Toast.show("Chat history cleared", "info");
  });
}
