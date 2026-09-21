/**
 * AiAssistant v5 - Simple, clean design (no bottom nav)
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

// ═══════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════
var I = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  sigma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/></svg>',
  home2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
};

var CHAT_KEY = "diplomastudy_ai_chat";
var MAX_MESSAGES = 80;
var replyIndex = 0;

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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
function timeLabel(v) {
  try { return new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
function mockReply() {
  var replies = [
    "I'm still learning! Real AI responses coming soon.",
    "Great question! Full version will give you detailed answers.",
    "Let me think about that... (Demo mode)",
    "\u0986\u09AE\u09BF \u098F\u0996\u09A8\u0993 \u09B6\u09BF\u0996\u099B\u09BF! \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u09B0\u09BF\u09AF\u09BC\u09C7\u09B2 \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u0964"
  ];
  var r = replies[replyIndex % replies.length];
  replyIndex++;
  return r;
}

// ═══════════════════════════════════════════
// STYLES — simple, clean, purple theme
// ═══════════════════════════════════════════
function injectStyles() {
  if (document.getElementById("ds-ai-simple-v5")) return;
  var st = document.createElement("style");
  st.id = "ds-ai-simple-v5";
  st.textContent = [
    "@keyframes dsAIFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
    "@keyframes dsAIDotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}",
    "@keyframes dsAIFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}",
    "@keyframes dsAIPulse{0%,100%{opacity:1}50%{opacity:0.4}}",

    ".dsp-page{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;",
    "  background:radial-gradient(120% 60% at 50% 0%, #231347 0%, #0D0B1C 55%, #08080F 100%);",
    "  color:#EDE9FE;font-family:inherit;overflow:hidden;",
    "}",
    ".dsp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px 20px;-webkit-overflow-scrolling:touch}",
    ".dsp-scroll::-webkit-scrollbar{width:0}",

    // Top bar
    ".dsp-top{display:flex;align-items:center;gap:10px;padding:14px 16px 6px;flex-shrink:0}",
    ".dsp-icon-btn{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:12px;border:none;background:rgba(255,255,255,0.06);color:#D6CCFF;cursor:pointer;flex-shrink:0;transition:background 0.15s}",
    ".dsp-icon-btn:active{background:rgba(168,85,247,0.25)}",
    ".dsp-icon-btn svg{width:19px;height:19px}",
    ".dsp-brand{flex:1;display:flex;align-items:center;gap:10px;min-width:0}",
    ".dsp-brand-icon{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 6px 18px rgba(124,58,237,0.4)}",
    ".dsp-brand-icon svg{width:20px;height:20px}",
    ".dsp-brand-text{min-width:0;overflow:hidden}",
    ".dsp-brand-name{font-size:16px;font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.3px}",
    ".dsp-brand-sub{font-size:11px;font-weight:600;color:#A99FCF;margin-top:2px}",
    ".dsp-bell-dot{position:relative}",
    ".dsp-bell-dot::after{content:'';position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:#F43F5E;border:1.5px solid #0D0B1C}",

    // Status
    ".dsp-status{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}",
    ".dsp-status-card{display:flex;align-items:center;gap:9px;padding:11px;border-radius:14px;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.18);cursor:pointer;min-width:0}",
    ".dsp-status-icon{width:32px;height:32px;border-radius:10px;background:rgba(168,85,247,0.2);color:#C084FC;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    ".dsp-status-icon svg{width:16px;height:16px}",
    ".dsp-status-info{min-width:0;flex:1}",
    ".dsp-status-title{font-size:11.5px;font-weight:800;color:#fff;display:flex;align-items:center;gap:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".dsp-status-title svg{width:11px;height:11px;color:#A99FCF;flex-shrink:0}",
    ".dsp-status-sub{font-size:9.5px;font-weight:600;color:#A99FCF;margin-top:1px}",

    // Hero
    ".dsp-hero{position:relative;padding:18px;border-radius:20px;margin-bottom:18px;overflow:hidden;",
    "  background:linear-gradient(135deg,#4C1D95 0%,#6D28D9 50%,#7C3AED 100%);",
    "  box-shadow:0 12px 30px rgba(124,58,237,0.35)}",
    ".dsp-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.18) 0%,transparent 70%)}",
    ".dsp-hero-inner{position:relative;z-index:2;display:flex;gap:12px;align-items:flex-start}",
    ".dsp-hero-robot{width:60px;height:60px;flex-shrink:0;border-radius:18px;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:34px;animation:dsAIFloat 3.5s ease-in-out infinite;border:1px solid rgba(255,255,255,0.2)}",
    ".dsp-hero-body{flex:1;min-width:0}",
    ".dsp-hero-title{font-size:18px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:4px;letter-spacing:-0.3px}",
    ".dsp-hero-sub{font-size:12px;font-weight:700;color:rgba(255,255,255,0.92);margin-bottom:8px;line-height:1.35}",
    ".dsp-hero-desc{font-size:11.5px;font-weight:500;color:rgba(255,255,255,0.78);line-height:1.5;margin-bottom:10px}",
    ".dsp-hero-online{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(255,255,255,0.15);border-radius:999px;font-size:10px;font-weight:800;color:#fff}",
    ".dsp-hero-dot{width:6px;height:6px;border-radius:50%;background:#10B981;box-shadow:0 0 0 3px rgba(16,185,129,0.35);animation:dsAIPulse 2s ease-in-out infinite}",

    // Section title
    ".dsp-sec-title{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:900;color:#fff;margin:0 2px 12px;letter-spacing:-0.2px}",
    ".dsp-sec-title svg{width:16px;height:16px;color:#A855F7}",

    // Cards grid
    ".dsp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}",
    ".dsp-card{display:flex;align-items:flex-start;gap:10px;padding:13px;border-radius:14px;background:rgba(255,255,255,0.045);border:1px solid rgba(168,85,247,0.15);cursor:pointer;text-align:left;font-family:inherit;transition:all 0.15s ease}",
    ".dsp-card:active{background:rgba(168,85,247,0.15);transform:scale(0.98)}",
    ".dsp-card-icon{width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    ".dsp-card-icon svg{width:17px;height:17px;color:#fff}",
    ".dsp-card-text{flex:1;min-width:0}",
    ".dsp-card-title{font-size:12px;font-weight:800;color:#fff;line-height:1.25;margin-bottom:3px}",
    ".dsp-card-sub{font-size:10px;font-weight:500;color:#A99FCF;line-height:1.3}",

    ".dsp-c-blue{background:linear-gradient(135deg,#3B82F6,#60A5FA)}",
    ".dsp-c-purple{background:linear-gradient(135deg,#7C3AED,#A855F7)}",
    ".dsp-c-orange{background:linear-gradient(135deg,#F97316,#FB923C)}",
    ".dsp-c-pink{background:linear-gradient(135deg,#EC4899,#F472B6)}",
    ".dsp-c-teal{background:linear-gradient(135deg,#0D9488,#14B8A6)}",
    ".dsp-c-yellow{background:linear-gradient(135deg,#F59E0B,#FBBF24)}",

    // Messages
    ".dsp-msg{display:flex;align-items:flex-start;gap:9px;margin-bottom:14px;animation:dsAIFadeIn 0.3s ease}",
    ".dsp-msg.user{justify-content:flex-end}",
    ".dsp-avatar{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    ".dsp-avatar svg{width:15px;height:15px}",
    ".dsp-bubble{max-width:78%;padding:10px 14px;font-size:14px;font-weight:500;line-height:1.55;white-space:pre-wrap;word-break:break-word}",
    ".dsp-msg.user .dsp-bubble{background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;border-radius:16px 16px 4px 16px;box-shadow:0 4px 12px rgba(124,58,237,0.3)}",
    ".dsp-msg.ai .dsp-bubble{background:rgba(255,255,255,0.06);color:#EDE9FE;border:1px solid rgba(168,85,247,0.15);border-radius:16px 16px 16px 4px}",
    ".dsp-time{font-size:9.5px;font-weight:600;color:#A99FCF;margin-top:4px;padding:0 3px}",
    ".dsp-msg.user .dsp-time{text-align:right}",
    ".dsp-typing{display:flex;align-items:center;gap:5px;padding:12px 14px}",
    ".dsp-typing i{width:6px;height:6px;border-radius:50%;background:#A855F7;animation:dsAIDotBounce 1.2s infinite}",
    ".dsp-typing i:nth-child(2){animation-delay:.15s}",
    ".dsp-typing i:nth-child(3){animation-delay:.3s}",

    // Input
    ".dsp-input-wrap{flex-shrink:0;padding:10px 14px calc(14px + env(safe-area-inset-bottom,0px));background:rgba(8,8,15,0.9);border-top:1px solid rgba(168,85,247,0.12);backdrop-filter:blur(20px)}",
    ".dsp-input-card{display:flex;align-items:flex-end;gap:6px;padding:6px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(168,85,247,0.25);border-radius:24px;transition:border-color 0.2s}",
    ".dsp-input-card:focus-within{border-color:#A855F7;box-shadow:0 0 0 3px rgba(168,85,247,0.15)}",
    ".dsp-input-plus{width:36px;height:36px;border-radius:50%;background:rgba(168,85,247,0.15);color:#C084FC;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}",
    ".dsp-input-plus svg{width:18px;height:18px}",
    ".dsp-input{flex:1;min-height:28px;max-height:100px;padding:8px 4px;border:none;outline:none;resize:none;background:transparent;color:#fff;font:14.5px inherit;line-height:1.4}",
    ".dsp-input::placeholder{color:#A99FCF;opacity:0.7}",
    ".dsp-input-mic{width:36px;height:36px;border-radius:50%;background:transparent;color:#A99FCF;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}",
    ".dsp-input-mic svg{width:18px;height:18px}",
    ".dsp-input-send{width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 4px 12px rgba(124,58,237,0.5);transition:all 0.15s}",
    ".dsp-input-send:disabled{background:rgba(255,255,255,0.1);color:#A99FCF;box-shadow:none}",
    ".dsp-input-send svg{width:18px;height:18px}"
  ].join("\n");
  document.head.appendChild(st);
}

// ═══════════════════════════════════════════
// WELCOME CONTENT
// ═══════════════════════════════════════════
function renderWelcome(userName) {
  var cards = [
    { icon: I.book,   cls: "dsp-c-blue",   title: "Explain a topic", sub: "Easy concepts" },
    { icon: I.sigma,  cls: "dsp-c-purple", title: "Solve a problem", sub: "Step by step" },
    { icon: I.doc,    cls: "dsp-c-orange", title: "Make notes",      sub: "Short & simple" },
    { icon: I.target, cls: "dsp-c-pink",   title: "Important Q",     sub: "MCQ, CQ" },
    { icon: I.bulb,   cls: "dsp-c-teal",   title: "Study plan",      sub: "Weekly routine" },
    { icon: I.spark,  cls: "dsp-c-yellow", title: "Ask anything",    sub: "Any question" }
  ];

  return [
    // Status row
    '<div class="dsp-status">',
      '<div class="dsp-status-card">',
        '<div class="dsp-status-icon">' + I.home2 + '</div>',
        '<div class="dsp-status-info">',
          '<div class="dsp-status-title">Civil Engineering ' + I.chevDown + '</div>',
          '<div class="dsp-status-sub">Department</div>',
        '</div>',
      '</div>',
      '<div class="dsp-status-card">',
        '<div class="dsp-status-icon">' + I.cal + '</div>',
        '<div class="dsp-status-info">',
          '<div class="dsp-status-title">1st Semester ' + I.chevDown + '</div>',
          '<div class="dsp-status-sub">Current</div>',
        '</div>',
      '</div>',
    '</div>',

    // Hero
    '<div class="dsp-hero">',
      '<div class="dsp-hero-inner">',
        '<div class="dsp-hero-robot">\uD83E\uDD16</div>',
        '<div class="dsp-hero-body">',
          '<div class="dsp-hero-title">Hi, ' + esc(userName) + '! \uD83D\uDC4B</div>',
          '<div class="dsp-hero-sub">Your Diploma study assistant</div>',
          '<div class="dsp-hero-desc">Ask questions, get explanations, and stay ahead in your studies.</div>',
          '<div class="dsp-hero-online"><span class="dsp-hero-dot"></span><span>Online</span></div>',
        '</div>',
      '</div>',
    '</div>',

    // Try asking
    '<div class="dsp-sec-title">' + I.spark + ' Try asking</div>',
    '<div class="dsp-grid">',
      cards.map(function (c) {
        return '<button class="dsp-card" type="button" data-prompt="' + esc(c.title) + '">' +
          '<div class="dsp-card-icon ' + c.cls + '">' + c.icon + '</div>' +
          '<div class="dsp-card-text">' +
            '<div class="dsp-card-title">' + esc(c.title) + '</div>' +
            '<div class="dsp-card-sub">' + esc(c.sub) + '</div>' +
          '</div>' +
        '</button>';
      }).join(""),
    '</div>'
  ].join("");
}

function renderMessageList(messages) {
  return messages.map(function (m) {
    var isUser = m.role === "user";
    if (isUser) {
      return '<div class="dsp-msg user">' +
        '<div>' +
          '<div class="dsp-bubble">' + esc(m.text) + '</div>' +
          '<div class="dsp-time">' + timeLabel(m.at) + '</div>' +
        '</div>' +
      '</div>';
    }
    return '<div class="dsp-msg ai">' +
      '<div class="dsp-avatar">' + I.spark + '</div>' +
      '<div>' +
        '<div class="dsp-bubble">' + esc(m.text) + '</div>' +
        '<div class="dsp-time">' + timeLabel(m.at) + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ═══════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════
export function renderAiAssistant(container, params) {
  injectStyles();

  // Hide app header + nav
  try {
    document.body.classList.add("ds-immersive-mode");
    var hm = document.getElementById("header-mount");
    var nm = document.getElementById("bottom-nav-mount");
    if (hm) hm.style.display = "none";
    if (nm) nm.style.display = "none";
  } catch (e) {}

  var main = (container && typeof container.innerHTML !== "undefined")
    ? container
    : AppShell.getMainView();
  if (!main) return "";

  var settings = {};
  try { settings = storage.get(STORAGE_KEYS.SETTINGS, {}) || {}; } catch (e) {}
  var userName = settings.userName || "Student";

  var messages = readMessages();

  main.innerHTML =
    '<div class="dsp-page">' +

      // TOP BAR
      '<div class="dsp-top">' +
        '<button class="dsp-icon-btn" id="dsp-back" type="button" aria-label="Back">' + I.menu + '</button>' +
        '<div class="dsp-brand">' +
          '<div class="dsp-brand-icon">' + I.cap + '</div>' +
          '<div class="dsp-brand-text">' +
            '<div class="dsp-brand-name">DiplomaStudy</div>' +
            '<div class="dsp-brand-sub">AI Study Assistant</div>' +
          '</div>' +
        '</div>' +
        '<button class="dsp-icon-btn" type="button" aria-label="Search">' + I.search + '</button>' +
        '<button class="dsp-icon-btn dsp-bell-dot" type="button" aria-label="Notifications">' + I.bell + '</button>' +
        '<button class="dsp-icon-btn" type="button" aria-label="Profile">' + I.user + '</button>' +
      '</div>' +

      // SCROLL
      '<div class="dsp-scroll" id="dsp-scroll"></div>' +

      // INPUT
      '<div class="dsp-input-wrap">' +
        '<div class="dsp-input-card">' +
          '<button class="dsp-input-plus" type="button" aria-label="Attach">' + I.plus + '</button>' +
          '<textarea class="dsp-input" id="dsp-input" rows="1" placeholder="Ask anything..."></textarea>' +
          '<button class="dsp-input-mic" type="button" aria-label="Voice">' + I.mic + '</button>' +
          '<button class="dsp-input-send" id="dsp-send" type="button" disabled aria-label="Send">' + I.send + '</button>' +
        '</div>' +
      '</div>' +

    '</div>';

  var scroll = main.querySelector("#dsp-scroll");
  var input = main.querySelector("#dsp-input");
  var send = main.querySelector("#dsp-send");
  var backBtn = main.querySelector("#dsp-back");

  function paint() {
    if (!messages.length) {
      scroll.innerHTML = renderWelcome(userName);
      bindWelcome();
    } else {
      scroll.innerHTML = '<div style="padding-top:6px">' + renderMessageList(messages) + '</div>';
    }
  }

  function bindWelcome() {
    scroll.querySelectorAll("[data-prompt]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        input.value = btn.getAttribute("data-prompt") || "";
        resizeInput();
        refreshSend();
        input.focus();
      });
    });
  }

  function scrollBottom() {
    try { scroll.scrollTop = scroll.scrollHeight; } catch (e) {}
  }
  function refreshSend() {
    send.disabled = !input.value.trim();
  }
  function resizeInput() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 100) + "px";
  }

  function sendMessage() {
    var text = input.value.trim();
    if (!text || send.disabled) return;

    var wasEmpty = messages.length === 0;

    messages.push({ role: "user", text: text, at: Date.now() });
    writeMessages(messages);

    input.value = "";
    resizeInput();
    refreshSend();

    if (wasEmpty) {
      scroll.innerHTML = '<div style="padding-top:6px">' + renderMessageList(messages) + '</div>';
    } else {
      var last = messages[messages.length - 1];
      scroll.insertAdjacentHTML("beforeend",
        '<div class="dsp-msg user">' +
          '<div>' +
            '<div class="dsp-bubble">' + esc(last.text) + '</div>' +
            '<div class="dsp-time">' + timeLabel(last.at) + '</div>' +
          '</div>' +
        '</div>'
      );
    }

    scroll.insertAdjacentHTML("beforeend",
      '<div class="dsp-msg ai" id="dsp-typing">' +
        '<div class="dsp-avatar">' + I.spark + '</div>' +
        '<div class="dsp-bubble"><div class="dsp-typing"><i></i><i></i><i></i></div></div>' +
      '</div>'
    );
    scrollBottom();

    setTimeout(function () {
      var t = main.querySelector("#dsp-typing");
      if (t) t.remove();
      var reply = { role: "assistant", text: mockReply(), at: Date.now() };
      messages.push(reply);
      writeMessages(messages);
      scroll.insertAdjacentHTML("beforeend",
        '<div class="dsp-msg ai">' +
          '<div class="dsp-avatar">' + I.spark + '</div>' +
          '<div>' +
            '<div class="dsp-bubble">' + esc(reply.text) + '</div>' +
            '<div class="dsp-time">' + timeLabel(reply.at) + '</div>' +
          '</div>' +
        '</div>'
      );
      scrollBottom();
    }, 900);
  }

  input.addEventListener("input", function () {
    resizeInput();
    refreshSend();
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  send.addEventListener("click", sendMessage);

  backBtn.addEventListener("click", function () {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = "#/home";
  });

  paint();
  scrollBottom();

  return main.innerHTML;
}

export default renderAiAssistant;