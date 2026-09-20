import { AppShell } from "../components/AppShell.js";
import { storage } from "../core/storage.js";

var ICONS = {
  robot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M9 3h6M8.5 13h.01M15.5 13h.01M9 17h6"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M8 22h8"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
};

var CHAT_KEY = "diplomastudy_ai_chat";
var MAX_MESSAGES = 50;
var replyIndex = 0;

function getLanguage() {
  try { return storage.get("diplomastudy_language", "mixed") || "mixed"; }
  catch (e) { return "mixed"; }
}

function getCopy() {
  if (getLanguage() === "bangla") {
    return {
      title: "AI Tutor", subtitle: "\u09AA\u09DC\u09BE\u09B6\u09CB\u09A8\u09BE\u09B0 \u09B8\u09B9\u0995\u09BE\u09B0\u09C0", beta: "AI Tutor \u2022 Beta", clear: "\u099A\u09CD\u09AF\u09BE\u099F \u09AE\u09C1\u099B\u09C1\u09A8", greeting: "\u0986\u09AE\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 Study Buddy", subtitleText: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09DC\u09BE\u09B6\u09CB\u09A8\u09BE\u09B0 \u09B8\u09B9\u0995\u09BE\u09B0\u09C0", placeholder: "\u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8...", send: "\u09AA\u09BE\u09A0\u09BE\u09A8", noResults: "\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8", confirm: "\u099A\u09CD\u09AF\u09BE\u099F \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09AC\u09C7\u09A8?", replies: ["\u0986\u09AE\u09BF \u098F\u0996\u09A8\u0993 \u09B6\u09BF\u0996\u099B\u09BF! \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u0986\u09B8\u099B\u09C7\u0964", "\u09AD\u09BE\u09B2\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8! \u09B0\u09BF\u09DF\u09C7\u09B2 AI \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u0986\u09B8\u09AC\u09C7\u0964", "\u0986\u09AE\u09BF \u09AD\u09BE\u09AC\u099B\u09BF... Demo mode\u0964"], chips: ["Explain photosynthesis", "Solve: 2x + 5 = 15", "Give me a study plan"]
    };
  }
  return {
    title: "AI Tutor", subtitle: "Your study companion", beta: "AI Tutor \u2022 Beta", clear: "Clear chat", greeting: "Hi, I'm your Study Buddy", subtitleText: "\u09AA\u09BE\u09A0\u09BE\u09B6\u09CB\u09A8\u09BE\u09B0 \u09B8\u09B9\u0995\u09BE\u09B0\u09C0", placeholder: "Ask anything... / \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8...", send: "Send", noResults: "Ask a question", confirm: "Clear this chat?", replies: ["I'm still learning! This is a placeholder response.", "Great question! Real AI coming soon.", "Let me think about that... (Demo mode)", "\u0986\u09AE\u09BF \u098F\u0996\u09A8\u0993 \u09B6\u09BF\u0996\u099B\u09BF! \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u0986\u09B8\u099B\u09C7\u0964"], chips: ["Explain photosynthesis", "Solve: 2x + 5 = 15", "Give me a study plan"]
  };
}

function readMessages() {
  try {
    var raw = localStorage.getItem(CHAT_KEY);
    var data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.slice(-MAX_MESSAGES) : [];
  } catch (e) { return []; }
}

function writeMessages(messages) {
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch (e) {}
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function timeLabel(value) {
  try { return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}

function injectStyles() {
  if (document.getElementById("ds-ai-styles")) return;
  var style = document.createElement("style");
  style.id = "ds-ai-styles";
  style.textContent = `
    @keyframes dsDotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
    @keyframes dsMessageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .ds-ai-chat-page{display:flex;flex-direction:column;min-height:calc(100dvh - 136px);max-width:760px;margin:0 auto;padding:0 0 calc(64px + env(safe-area-inset-bottom,0px));background:#fff;color:#1C3E2C}
    .ds-ai-chat-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 4px;border-bottom:1px solid #E1E8E1}.ds-ai-chat-pill{display:inline-flex;align-items:center;gap:7px;color:#1C3E2C;font-size:13px;font-weight:800}.ds-ai-chat-pill i{width:7px;height:7px;border-radius:50%;background:#C87A1E;box-shadow:0 0 0 3px rgba(200,122,30,.13)}.ds-ai-chat-clear{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;border-radius:10px;background:transparent;color:#84968B;cursor:pointer;transition:background .2s,color .2s}.ds-ai-chat-clear:hover,.ds-ai-chat-clear:active{background:#F2F5F2;color:#1C3E2C}.ds-ai-chat-clear svg{width:18px;height:18px}
    .ds-ai-chat-messages{display:flex;flex:1;flex-direction:column;gap:20px;overflow-y:auto;padding:24px max(4px,calc((100% - 680px)/2)) 24px;scroll-behavior:smooth}.ds-ai-welcome{display:flex;align-items:center;justify-content:center;min-height:360px;flex-direction:column;text-align:center}.ds-ai-bot-large{display:flex;align-items:center;justify-content:center;width:64px;height:64px;margin-bottom:14px;border-radius:50%;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#fff;box-shadow:0 10px 22px rgba(28,62,44,.2)}.ds-ai-bot-large svg{width:32px;height:32px}.ds-ai-welcome h1{margin:0 0 6px;color:#1C3E2C;font-size:18px;font-weight:900}.ds-ai-welcome p{margin:0;color:#57675D;font-size:14px}.ds-ai-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:360px;margin-top:20px}.ds-ai-chip{padding:9px 11px;border:1px solid #E1E8E1;border-radius:999px;background:#fff;color:#1C3E2C;font:600 11px inherit;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}.ds-ai-chip:hover,.ds-ai-chip:active{background:#F8FBF8;border-color:#7A9B7A;transform:translateY(-1px)}
    .ds-ai-msg-in{animation:dsMessageIn .3s ease}.ds-ai-message{display:flex;align-items:flex-start;gap:10px;width:100%;max-width:680px}.ds-ai-message.user{align-self:flex-end;justify-content:flex-end}.ds-ai-message.ai{align-self:center}.ds-ai-small-avatar{display:flex;align-items:center;justify-content:center;width:28px;height:28px;flex-shrink:0;border-radius:8px;background:#1C3E2C;color:#fff}.ds-ai-small-avatar svg{width:16px;height:16px}.ds-ai-bubble{padding:10px 14px;border-radius:15px;color:#1C3E2C;font-size:15px;line-height:1.6;white-space:pre-wrap}.ds-ai-message.user .ds-ai-bubble{max-width:80%;border-radius:18px 18px 4px 18px;background:#E8EFE8;color:#1C3E2C}.ds-ai-message.ai .ds-ai-bubble{flex:1;padding:2px 0;border:0;border-radius:0;background:transparent;box-shadow:none}.ds-ai-time{margin-top:4px;color:#84968B;font-size:10px}.ds-ai-message.user .ds-ai-time{text-align:right}.ds-ai-typing{display:flex;align-items:center;gap:4px;min-width:48px}.ds-ai-typing i{width:6px;height:6px;border-radius:50%;background:#7A9B7A;animation:dsDotBounce 1.2s infinite}.ds-ai-typing i:nth-child(2){animation-delay:.15s}.ds-ai-typing i:nth-child(3){animation-delay:.3s}
    .ds-ai-input-shell{position:sticky;bottom:0;padding:12px max(4px,calc((100% - 680px)/2)) 10px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff 24%)}.ds-ai-input-card{display:flex;align-items:flex-end;gap:8px;padding:8px 10px 8px 14px;border:1px solid #D8E1DB;border-radius:22px;background:#fff;box-shadow:0 2px 12px rgba(28,62,44,.1)}.ds-ai-input{min-height:40px;max-height:112px;flex:1;resize:none;padding:10px 4px;border:0;outline:none;background:transparent;color:#1C3E2C;font:14px inherit;line-height:1.4}.ds-ai-input:focus{border-color:#1C3E2C}.ds-ai-send{display:flex;align-items:center;justify-content:center;width:38px;height:38px;flex-shrink:0;border:0;border-radius:50%;background:#1C3E2C;color:#fff;cursor:pointer;transition:transform .2s,opacity .2s}.ds-ai-send:hover{transform:translateY(-1px)}.ds-ai-send:disabled{background:#CBD5E1;cursor:not-allowed;transform:none}.ds-ai-send svg{width:18px;height:18px}.ds-ai-hint{padding-top:6px;color:#84968B;font-size:10px;text-align:center}
    .ds-ai-chat-page{max-width:860px;background:var(--color-bg);color:var(--color-text)}.ds-ai-chat-bar{padding:10px 4px;border-color:var(--color-border)}.ds-ai-model{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:9px;background:transparent;color:var(--color-text);font:800 13px inherit;cursor:pointer}.ds-ai-model:hover,.ds-ai-icon-btn:hover,.ds-ai-chat-clear:hover{background:var(--color-surface-hover);color:var(--color-text)}.ds-ai-model-icon{display:flex;width:22px;height:22px;align-items:center;justify-content:center;border-radius:7px;background:var(--color-forest);color:#fff}.ds-ai-model-icon svg{width:14px;height:14px}.ds-ai-model>svg{width:14px;height:14px;color:var(--color-text-dim)}.ds-ai-actions{display:flex;align-items:center;gap:4px}.ds-ai-icon-btn,.ds-ai-chat-clear{display:flex;align-items:center;justify-content:center;width:35px;height:35px;border:0;border-radius:9px;background:transparent;color:var(--color-text-dim);cursor:pointer}.ds-ai-icon-btn svg,.ds-ai-chat-clear svg{width:18px;height:18px}.ds-ai-chat-messages{padding:30px max(8px,calc((100% - 720px)/2)) 24px}.ds-ai-bot-large{width:56px;height:56px;border-radius:16px;background:var(--color-forest)}.ds-ai-welcome h1{color:var(--color-text);font-size:24px}.ds-ai-welcome p{color:var(--color-text-dim)}.ds-ai-chip{padding:10px 13px;border-radius:10px;border-color:var(--color-border);background:var(--color-surface);color:var(--color-text)}.ds-ai-chip:hover,.ds-ai-chip:active{background:var(--color-surface-hover);border-color:var(--color-forest)}.ds-ai-input-shell{padding:12px max(8px,calc((100% - 720px)/2)) 10px;background:linear-gradient(180deg,transparent,var(--color-bg) 24%)}.ds-ai-input-card{gap:5px;padding:8px 9px;border-color:var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:var(--shadow-md)}.ds-ai-input{color:var(--color-text)}.ds-ai-send{border-radius:10px;background:var(--color-forest)}.ds-ai-hint{color:var(--color-text-dim)}@media(max-width:520px){.ds-ai-welcome h1{font-size:21px}.ds-ai-chip{font-size:10px}}
    [data-theme="dark"] .ds-ai-chat-page{background:var(--color-bg)}[data-theme="dark"] .ds-ai-chat-bar{border-color:var(--color-border)}[data-theme="dark"] .ds-ai-chip,[data-theme="dark"] .ds-ai-input-card{border-color:var(--color-border);background:var(--color-surface)}[data-theme="dark"] .ds-ai-input-shell{background:linear-gradient(180deg,rgba(11,18,16,0),var(--color-bg) 24%)}[data-theme="dark"] .ds-ai-input{color:var(--color-text)}[data-theme="dark"] .ds-ai-message.user .ds-ai-bubble{background:var(--color-surface-hover);color:var(--color-text)}[data-theme="dark"] .ds-ai-welcome h1{color:var(--color-text)}
  `;
  document.head.appendChild(style);
}

function mockReply(copy) {
  var replies = copy.replies;
  var reply = replies[replyIndex % replies.length];
  replyIndex++;
  return reply;
}

function renderMessages(container, messages, copy) {
  var html = "";
  if (!messages.length) {
    html = '<div class="ds-ai-welcome" id="ds-ai-welcome"><div class="ds-ai-bot-large">' + ICONS.robot + '</div><h1>Hi, I\'m your Study Buddy</h1><p>' + copy.subtitleText + '</p><div class="ds-ai-chips">' + copy.chips.map(function (chip) { return '<button class="ds-ai-chip" type="button" data-suggestion="' + escapeHtml(chip) + '">' + escapeHtml(chip) + '</button>'; }).join("") + '</div></div>';
  } else {
    html = messages.map(function (message) {
      var isUser = message.role === "user";
      return '<div class="ds-ai-message ' + (isUser ? "user" : "ai") + ' ds-ai-msg-in">' + (!isUser ? '<div class="ds-ai-small-avatar">' + ICONS.robot + '</div>' : "") + '<div><div class="ds-ai-bubble">' + escapeHtml(message.text) + '</div><div class="ds-ai-time">' + timeLabel(message.at) + '</div></div></div>';
    }).join("");
  }
  container.innerHTML = html;
}

function timeLabel(value) {
  try { return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}

export function renderAiAssistant(container, params) {
  injectStyles();
  var copy = getCopy();
  AppShell.updateHeader({ title: copy.title, subtitle: copy.subtitle, showBack: true, showSearch: false, showTheme: true, showSettings: false });
  var main = container && typeof container.innerHTML !== "undefined" ? container : AppShell.getMainView();
  if (!main) return "";

  var messages = readMessages();
  main.innerHTML = '<div class="ds-ai-chat-page"><div class="ds-ai-chat-bar"><button class="ds-ai-model" id="ds-ai-model" type="button" title="Select model"><span class="ds-ai-model-icon">' + ICONS.robot + '</span><span>Study Buddy</span>' + ICONS.chevron + '</button><div class="ds-ai-actions"><button class="ds-ai-icon-btn" id="ds-ai-new" type="button" title="New chat" aria-label="New chat">' + ICONS.plus + '</button><button class="ds-ai-chat-clear" id="ds-ai-clear" type="button" title="' + copy.clear + '" aria-label="' + copy.clear + '">' + ICONS.trash + '</button></div></div><div class="ds-ai-chat-messages" id="ds-ai-messages"></div><div class="ds-ai-input-shell"><div class="ds-ai-input-card"><button class="ds-ai-icon-btn" id="ds-ai-attach" type="button" title="Attach a file" aria-label="Attach a file">' + ICONS.paperclip + '</button><input id="ds-ai-file" type="file" hidden><textarea class="ds-ai-input" id="ds-ai-input" rows="1" placeholder="' + copy.placeholder + '"></textarea><button class="ds-ai-icon-btn" id="ds-ai-mic" type="button" title="Voice input" aria-label="Voice input">' + ICONS.mic + '</button><button class="ds-ai-send" id="ds-ai-send" type="button" disabled aria-label="' + copy.send + '">' + ICONS.send + '</button></div><div class="ds-ai-hint">Study Buddy demo • Press Enter to send</div></div></div>';

  var messageBox = main.querySelector("#ds-ai-messages");
  var input = main.querySelector("#ds-ai-input");
  var send = main.querySelector("#ds-ai-send");
  var clear = main.querySelector("#ds-ai-clear");
  var newChat = main.querySelector("#ds-ai-new");
  var model = main.querySelector("#ds-ai-model");
  var attach = main.querySelector("#ds-ai-attach");
  var file = main.querySelector("#ds-ai-file");
  var mic = main.querySelector("#ds-ai-mic");
  renderMessages(messageBox, messages, copy);

  function scrollBottom() { messageBox.scrollTop = messageBox.scrollHeight; }
  function refreshSend() { send.disabled = !input.value.trim(); }
  function resizeInput() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 112) + "px"; }
  function sendMessage() {
    var text = input.value.trim();
    if (!text || send.disabled) return;
    var now = Date.now();
    messages.push({ role: "user", text: text, at: now });
    writeMessages(messages);
    input.value = "";
    resizeInput();
    refreshSend();
    renderMessages(messageBox, messages, copy);
    messageBox.insertAdjacentHTML("beforeend", '<div class="ds-ai-message ai ds-ai-msg-in" id="ds-ai-typing-row"><div class="ds-ai-small-avatar">' + ICONS.robot + '</div><div><div class="ds-ai-bubble ds-ai-typing"><i></i><i></i><i></i></div></div></div>');
    scrollBottom();
    setTimeout(function () {
      var typing = main.querySelector("#ds-ai-typing-row");
      if (typing) typing.remove();
      messages.push({ role: "assistant", text: mockReply(copy), at: Date.now() });
      writeMessages(messages);
      renderMessages(messageBox, messages, copy);
      scrollBottom();
    }, 800);
  }

  input.addEventListener("input", function () { resizeInput(); refreshSend(); });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
  });
  send.addEventListener("click", sendMessage);
  main.querySelectorAll("[data-suggestion]").forEach(function (chip) {
    chip.addEventListener("click", function () { input.value = chip.getAttribute("data-suggestion") || ""; resizeInput(); refreshSend(); input.focus(); });
  });
  clear.addEventListener("click", function () {
    if (!messages.length || window.confirm(copy.confirm)) {
      messages = [];
      try { localStorage.removeItem(CHAT_KEY); } catch (e) {}
      renderMessages(messageBox, messages, copy);
      main.querySelectorAll("[data-suggestion]").forEach(function (chip) { chip.addEventListener("click", function () { input.value = chip.getAttribute("data-suggestion") || ""; resizeInput(); refreshSend(); input.focus(); }); });
    }
  });
  newChat.addEventListener("click", function () { clear.click(); });
  model.addEventListener("click", function () {
    model.title = "Study Buddy is the available model";
    setTimeout(function () { model.title = "Select model"; }, 2000);
  });
  attach.addEventListener("click", function () { file.click(); });
  file.addEventListener("change", function () {
    var selected = file.files && file.files[0];
    if (selected) {
      input.value = "Please help me with this file: " + selected.name;
      resizeInput();
      refreshSend();
      input.focus();
    }
  });
  mic.addEventListener("click", function () {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      input.placeholder = "Voice input is not supported in this browser";
      setTimeout(function () { input.placeholder = copy.placeholder; }, 2500);
      return;
    }
    var recognition = new SpeechRecognition();
    recognition.lang = getLanguage() === "bangla" ? "bn-BD" : "en-US";
    recognition.onresult = function (event) {
      input.value = input.value + (input.value ? " " : "") + event.results[0][0].transcript;
      resizeInput();
      refreshSend();
    };
    recognition.start();
  });
  scrollBottom();
  return main.innerHTML;
}

export default renderAiAssistant;
