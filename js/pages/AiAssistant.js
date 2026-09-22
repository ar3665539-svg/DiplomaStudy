/**
 * AiAssistant v9 - contenteditable input (no dark box)
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

var I = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  sigma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4H6l6 8-6 8h12"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  home2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  flash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
};

var ROBOT_SVG =
'<svg viewBox="0 0 120 120" width="100%" height="100%" style="display:block;">' +
  '<defs>' +
    '<linearGradient id="rFace" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#F0FDFF"/>' +
      '<stop offset="0.6" stop-color="#CFFAFE"/>' +
      '<stop offset="1" stop-color="#A5F3FC"/>' +
    '</linearGradient>' +
    '<linearGradient id="rBody" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#67E8F9"/>' +
      '<stop offset="1" stop-color="#0891B2"/>' +
    '</linearGradient>' +
    '<radialGradient id="rAntGlow" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#FFFFFF"/>' +
      '<stop offset="0.35" stop-color="#67E8F9"/>' +
      '<stop offset="1" stop-color="#0891B2" stop-opacity="0"/>' +
    '</radialGradient>' +
    '<radialGradient id="rBlush" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#FB7185" stop-opacity="0.9"/>' +
      '<stop offset="1" stop-color="#FB7185" stop-opacity="0"/>' +
    '</radialGradient>' +
  '</defs>' +
  '<circle cx="60" cy="18" r="12" fill="url(#rAntGlow)"/>' +
  '<circle cx="60" cy="18" r="7" fill="#67E8F9"/>' +
  '<circle cx="60" cy="18" r="4" fill="#FFFFFF"/>' +
  '<rect x="58" y="24" width="4" height="12" rx="2" fill="#A5F3FC"/>' +
  '<rect x="6" y="60" width="10" height="20" rx="5" fill="#0891B2"/>' +
  '<rect x="8" y="64" width="6" height="12" rx="3" fill="#22D3EE"/>' +
  '<rect x="104" y="60" width="10" height="20" rx="5" fill="#0891B2"/>' +
  '<rect x="106" y="64" width="6" height="12" rx="3" fill="#22D3EE"/>' +
  '<rect x="16" y="32" width="88" height="76" rx="28" fill="url(#rFace)" stroke="#67E8F9" stroke-width="2"/>' +
  '<ellipse cx="60" cy="45" rx="34" ry="8" fill="#FFFFFF" opacity="0.45"/>' +
  '<ellipse cx="44" cy="68" rx="13" ry="15" fill="#0E3A4D"/>' +
  '<ellipse cx="76" cy="68" rx="13" ry="15" fill="#0E3A4D"/>' +
  '<ellipse cx="48" cy="62" rx="5" ry="6" fill="#FFFFFF"/>' +
  '<ellipse cx="80" cy="62" rx="5" ry="6" fill="#FFFFFF"/>' +
  '<circle cx="40" cy="74" r="2.2" fill="#FFFFFF" opacity="0.85"/>' +
  '<circle cx="72" cy="74" r="2.2" fill="#FFFFFF" opacity="0.85"/>' +
  '<circle cx="49" cy="70" r="1.2" fill="#FFFFFF" opacity="0.9"/>' +
  '<circle cx="81" cy="70" r="1.2" fill="#FFFFFF" opacity="0.9"/>' +
  '<ellipse cx="26" cy="82" rx="9" ry="5" fill="url(#rBlush)"/>' +
  '<ellipse cx="94" cy="82" rx="9" ry="5" fill="url(#rBlush)"/>' +
  '<path d="M 50 90 Q 60 97 70 90" stroke="#0E3A4D" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
  '<circle cx="44" cy="86" r="0.9" fill="#0E3A4D" opacity="0.4"/>' +
  '<circle cx="76" cy="86" r="0.9" fill="#0E3A4D" opacity="0.4"/>' +
  '<rect x="46" y="104" width="28" height="12" rx="4" fill="url(#rBody)"/>' +
  '<rect x="40" y="112" width="40" height="8" rx="4" fill="#0891B2"/>' +
'</svg>';

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
    "Great question! Full version will give detailed answers.",
    "Let me think about that... (Demo mode)",
    "\u0986\u09AE\u09BF \u098F\u0996\u09A8\u0993 \u09B6\u09BF\u0996\u099B\u09BF! \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u09B0\u09BF\u09AF\u09BC\u09C7\u09B2 \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u0964"
  ];
  var r = replies[replyIndex % replies.length];
  replyIndex++;
  return r;
}

function injectStyles() {
  if (document.getElementById("ds-ai-v9")) return;
  var st = document.createElement("style");
  st.id = "ds-ai-v9";
  st.textContent = [
    "@keyframes dsFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
    "@keyframes dsDotBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}",
    "@keyframes dsFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}",
    "@keyframes dsPulse{0%,100%{opacity:1}50%{opacity:0.4}}",

    ".dsv9-page{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;",
    "  background:radial-gradient(140% 80% at 50% -20%, #0E3A4D 0%, #07202E 45%, #04131B 100%);",
    "  color:#E0F7FA;font-family:inherit;overflow:hidden;",
    "}",
    ".dsv9-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:16px 16px 20px;-webkit-overflow-scrolling:touch}",
    ".dsv9-scroll::-webkit-scrollbar{width:0}",

    ".dsv9-top{display:flex;align-items:center;gap:10px;padding:14px 16px 6px;flex-shrink:0}",
    ".dsv9-icon-btn{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:12px;border:none;",
    "  background:rgba(255,255,255,0.05);color:#94D5E1;cursor:pointer;flex-shrink:0}",
    ".dsv9-icon-btn:active{background:rgba(6,182,212,0.25);transform:scale(0.94)}",
    ".dsv9-icon-btn svg{width:19px;height:19px}",
    ".dsv9-brand{flex:1;display:flex;align-items:center;gap:10px;min-width:0}",
    ".dsv9-brand-icon{width:40px;height:40px;border-radius:13px;",
    "  background:linear-gradient(135deg,#0891B2 0%,#06B6D4 50%,#22D3EE 100%);",
    "  color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;",
    "  box-shadow:0 8px 20px rgba(6,182,212,0.4)}",
    ".dsv9-brand-icon svg{width:21px;height:21px}",
    ".dsv9-brand-text{min-width:0;overflow:hidden}",
    ".dsv9-brand-name{font-size:16px;font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.3px}",
    ".dsv9-brand-sub{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:#7DD3E1;margin-top:2px}",
    ".dsv9-brand-dot{width:6px;height:6px;border-radius:50%;background:#10B981;box-shadow:0 0 0 3px rgba(16,185,129,0.25);animation:dsPulse 2s ease-in-out infinite}",
    ".dsv9-bell-dot{position:relative}",
    ".dsv9-bell-dot::after{content:'';position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:#FB7185;border:1.5px solid #04131B;box-shadow:0 0 8px rgba(251,113,133,0.6)}",

    ".dsv9-status{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}",
    ".dsv9-status-card{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:15px;",
    "  background:linear-gradient(135deg,rgba(6,182,212,0.10) 0%,rgba(6,182,212,0.02) 100%);",
    "  border:1px solid rgba(34,211,238,0.2);cursor:pointer;min-width:0}",
    ".dsv9-status-card:active{background:rgba(6,182,212,0.2);transform:scale(0.98)}",
    ".dsv9-status-icon{width:34px;height:34px;border-radius:11px;",
    "  background:linear-gradient(135deg,rgba(6,182,212,0.3),rgba(34,211,238,0.15));",
    "  color:#22D3EE;display:flex;align-items:center;justify-content:center;flex-shrink:0;",
    "  border:1px solid rgba(34,211,238,0.15)}",
    ".dsv9-status-icon svg{width:16px;height:16px}",
    ".dsv9-status-info{min-width:0;flex:1}",
    ".dsv9-status-title{font-size:12px;font-weight:800;color:#fff;display:flex;align-items:center;gap:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".dsv9-status-title svg{width:11px;height:11px;color:#7DD3E1;flex-shrink:0}",
    ".dsv9-status-sub{font-size:9.5px;font-weight:600;color:#7DD3E1;margin-top:1px}",

    ".dsv9-hero{position:relative;padding:22px 20px;border-radius:22px;margin-bottom:20px;overflow:hidden;",
    "  background:linear-gradient(135deg,#0F4C5C 0%,#0E7490 45%,#0891B2 100%);",
    "  box-shadow:0 16px 40px rgba(6,182,212,0.35),inset 0 1px 0 rgba(255,255,255,0.12)}",
    ".dsv9-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;",
    "  background:radial-gradient(circle,rgba(251,146,60,0.25) 0%,transparent 70%)}",
    ".dsv9-hero::after{content:'';position:absolute;bottom:-60px;left:-30px;width:160px;height:160px;border-radius:50%;",
    "  background:radial-gradient(circle,rgba(34,211,238,0.4) 0%,transparent 70%)}",
    ".dsv9-hero-inner{position:relative;z-index:2;display:flex;gap:14px;align-items:center}",
    ".dsv9-hero-robot{width:88px;height:88px;flex-shrink:0;",
    "  background:rgba(255,255,255,0.14);border-radius:24px;",
    "  display:flex;align-items:center;justify-content:center;padding:8px;",
    "  animation:dsFloat 3.5s ease-in-out infinite;",
    "  border:1.5px solid rgba(255,255,255,0.28);",
    "  backdrop-filter:blur(10px);",
    "  box-shadow:0 10px 28px rgba(0,0,0,0.22),inset 0 1px 0 rgba(255,255,255,0.25)}",
    ".dsv9-hero-robot svg{width:100%;height:100%}",
    ".dsv9-hero-body{flex:1;min-width:0}",
    ".dsv9-hero-title{font-size:19px;font-weight:900;color:#fff;line-height:1.2;margin-bottom:4px}",
    ".dsv9-hero-sub{font-size:12.5px;font-weight:700;color:rgba(224,247,250,0.95);margin-bottom:8px}",
    ".dsv9-hero-desc{font-size:11.5px;font-weight:500;color:rgba(224,247,250,0.8);line-height:1.5;margin-bottom:12px}",
    ".dsv9-hero-online{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;",
    "  background:rgba(255,255,255,0.18);border-radius:999px;font-size:10.5px;font-weight:800;color:#fff;",
    "  border:1px solid rgba(255,255,255,0.15)}",
    ".dsv9-hero-dot{width:6px;height:6px;border-radius:50%;background:#22D3EE;",
    "  box-shadow:0 0 0 3px rgba(34,211,238,0.4),0 0 12px rgba(34,211,238,0.8);",
    "  animation:dsPulse 2s ease-in-out infinite}",

    ".dsv9-sec{display:flex;align-items:center;gap:8px;margin:0 4px 12px}",
    ".dsv9-sec-line{width:3px;height:16px;border-radius:2px;background:linear-gradient(180deg,#22D3EE,#06B6D4);box-shadow:0 0 8px rgba(34,211,238,0.6)}",
    ".dsv9-sec-title{font-size:13.5px;font-weight:900;color:#fff}",
    ".dsv9-sec-spark{margin-left:auto;width:16px;height:16px;color:#22D3EE}",

    ".dsv9-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}",
    ".dsv9-card{display:flex;align-items:flex-start;gap:11px;padding:13px;border-radius:15px;",
    "  background:linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));",
    "  border:1px solid rgba(34,211,238,0.15);cursor:pointer;text-align:left;font-family:inherit;",
    "  transition:all 0.2s ease}",
    ".dsv9-card:active{transform:scale(0.97);border-color:rgba(34,211,238,0.4)}",
    ".dsv9-card-icon{width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;",
    "  box-shadow:0 4px 10px rgba(0,0,0,0.15)}",
    ".dsv9-card-icon svg{width:18px;height:18px;color:#fff}",
    ".dsv9-card-text{flex:1;min-width:0}",
    ".dsv9-card-title{font-size:12.5px;font-weight:800;color:#fff;line-height:1.25;margin-bottom:3px}",
    ".dsv9-card-sub{font-size:10px;font-weight:500;color:#7DD3E1;line-height:1.3}",

    ".dsv9-c-cyan{background:linear-gradient(135deg,#0891B2,#22D3EE)}",
    ".dsv9-c-teal{background:linear-gradient(135deg,#0D9488,#14B8A6)}",
    ".dsv9-c-blue{background:linear-gradient(135deg,#2563EB,#3B82F6)}",
    ".dsv9-c-coral{background:linear-gradient(135deg,#F43F5E,#FB7185)}",
    ".dsv9-c-amber{background:linear-gradient(135deg,#F59E0B,#FBBF24)}",
    ".dsv9-c-violet{background:linear-gradient(135deg,#7C3AED,#A855F7)}",

    ".dsv9-msg{display:flex;align-items:flex-start;gap:9px;margin-bottom:16px;animation:dsFadeIn 0.3s ease}",
    ".dsv9-msg.user{justify-content:flex-end}",
    ".dsv9-avatar{width:34px;height:34px;border-radius:11px;",
    "  background:linear-gradient(135deg,#0891B2,#22D3EE);",
    "  display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:3px;",
    "  box-shadow:0 4px 12px rgba(6,182,212,0.35)}",
    ".dsv9-avatar svg{width:100%;height:100%}",
    ".dsv9-bubble{max-width:78%;padding:11px 15px;font-size:14px;font-weight:500;line-height:1.55;",
    "  white-space:pre-wrap;word-break:break-word}",
    ".dsv9-msg.user .dsv9-bubble{background:linear-gradient(135deg,#F43F5E,#FB7185);color:#fff;",
    "  border-radius:17px 17px 5px 17px;box-shadow:0 6px 16px rgba(244,63,94,0.3)}",
    ".dsv9-msg.ai .dsv9-bubble{background:linear-gradient(135deg,rgba(6,182,212,0.12),rgba(6,182,212,0.04));",
    "  color:#E0F7FA;border:1px solid rgba(34,211,238,0.2);border-radius:17px 17px 17px 5px}",
    ".dsv9-time{font-size:9.5px;font-weight:600;color:#7DD3E1;margin-top:5px;padding:0 4px;opacity:0.7}",
    ".dsv9-msg.user .dsv9-time{text-align:right}",
    ".dsv9-typing{display:flex;align-items:center;gap:5px;padding:12px 15px}",
    ".dsv9-typing i{width:6px;height:6px;border-radius:50%;background:#22D3EE;animation:dsDotBounce 1.2s infinite;",
    "  box-shadow:0 0 6px rgba(34,211,238,0.6)}",
    ".dsv9-typing i:nth-child(2){animation-delay:.15s}",
    ".dsv9-typing i:nth-child(3){animation-delay:.3s}",

    // ═══════════════════════════════════════════
    // INPUT — solid cyan, no dark box anywhere
    // ═══════════════════════════════════════════
    ".dsv9-input-wrap{flex-shrink:0;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));",
    "  background:transparent;border-top:1px solid rgba(34,211,238,0.12);backdrop-filter:blur(20px)}",

    ".dsv9-input-card{display:flex;align-items:center;gap:8px;padding:6px;",
    "  background:linear-gradient(135deg,#0891B2 0%,#06B6D4 50%,#22D3EE 100%);",
    "  border:1.5px solid rgba(255,255,255,0.2);",
    "  border-radius:28px;",
    "  box-shadow:0 10px 28px rgba(6,182,212,0.45),inset 0 1px 0 rgba(255,255,255,0.25);",
    "  transition:all 0.2s ease}",
    ".dsv9-input-card:focus-within{",
    "  box-shadow:0 12px 32px rgba(6,182,212,0.6),inset 0 1px 0 rgba(255,255,255,0.3),0 0 0 3px rgba(34,211,238,0.25)}",

    ".dsv9-input-plus{width:38px;height:38px;border-radius:50%;",
    "  background:rgba(255,255,255,0.22);color:#FFFFFF;border:none;",
    "  display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}",
    ".dsv9-input-plus:active{background:rgba(255,255,255,0.35)}",
    ".dsv9-input-plus svg{width:19px;height:19px}",

    // ★ contenteditable div — fully transparent, no default browser styling
    ".dsv9-input{flex:1;min-height:26px;max-height:100px;padding:8px 6px;",
    "  background:transparent;",
    "  border:none;outline:none;",
    "  color:#FFFFFF;",
    "  font:15px inherit;line-height:1.4;font-weight:500;",
    "  overflow-y:auto;overflow-x:hidden;",
    "  white-space:pre-wrap;word-wrap:break-word;",
    "  -webkit-user-modify:read-write-plaintext-only;",
    "  caret-color:#FFFFFF;}",
    ".dsv9-input:empty::before{",
    "  content:attr(data-placeholder);",
    "  color:rgba(255,255,255,0.78);",
    "  font-weight:500;",
    "  pointer-events:none;}",
    ".dsv9-input::-webkit-scrollbar{width:0}",

    ".dsv9-input-mic{width:38px;height:38px;border-radius:50%;background:transparent;color:#FFFFFF;",
    "  border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;",
    "  opacity:0.9}",
    ".dsv9-input-mic:active{opacity:1}",
    ".dsv9-input-mic svg{width:19px;height:19px}",

    ".dsv9-input-send{width:42px;height:42px;border-radius:50%;border:none;",
    "  background:#FFFFFF;color:#0891B2;",
    "  display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;",
    "  box-shadow:0 4px 12px rgba(0,0,0,0.2);transition:all 0.2s ease}",
    ".dsv9-input-send:active{transform:scale(0.92)}",
    ".dsv9-input-send:disabled{background:rgba(255,255,255,0.4);color:rgba(255,255,255,0.75);box-shadow:none}",
    ".dsv9-input-send svg{width:19px;height:19px}"
  ].join("\n");
  document.head.appendChild(st);
}

function renderWelcome(userName) {
  var cards = [
    { icon: I.book,   cls: "dsv9-c-cyan",   title: "Explain a topic", sub: "Easy concepts" },
    { icon: I.sigma,  cls: "dsv9-c-violet", title: "Solve a problem", sub: "Step by step" },
    { icon: I.doc,    cls: "dsv9-c-amber",  title: "Make notes",      sub: "Short & simple" },
    { icon: I.target, cls: "dsv9-c-coral",  title: "Important Q",     sub: "MCQ, CQ" },
    { icon: I.bulb,   cls: "dsv9-c-teal",   title: "Study plan",      sub: "Weekly routine" },
    { icon: I.flash,  cls: "dsv9-c-blue",   title: "Ask anything",    sub: "Any question" }
  ];

  return [
    '<div class="dsv9-status">',
      '<div class="dsv9-status-card">',
        '<div class="dsv9-status-icon">' + I.home2 + '</div>',
        '<div class="dsv9-status-info">',
          '<div class="dsv9-status-title">Civil Engineering ' + I.chevDown + '</div>',
          '<div class="dsv9-status-sub">Department</div>',
        '</div>',
      '</div>',
      '<div class="dsv9-status-card">',
        '<div class="dsv9-status-icon">' + I.cal + '</div>',
        '<div class="dsv9-status-info">',
          '<div class="dsv9-status-title">1st Semester ' + I.chevDown + '</div>',
          '<div class="dsv9-status-sub">Current</div>',
        '</div>',
      '</div>',
    '</div>',

    '<div class="dsv9-hero">',
      '<div class="dsv9-hero-inner">',
        '<div class="dsv9-hero-robot">' + ROBOT_SVG + '</div>',
        '<div class="dsv9-hero-body">',
          '<div class="dsv9-hero-title">Hi, ' + esc(userName) + '! \uD83D\uDC4B</div>',
          '<div class="dsv9-hero-sub">Your Diploma study assistant</div>',
          '<div class="dsv9-hero-desc">Ask questions, get explanations, and stay ahead in your studies.</div>',
          '<div class="dsv9-hero-online"><span class="dsv9-hero-dot"></span><span>Online</span></div>',
        '</div>',
      '</div>',
    '</div>',

    '<div class="dsv9-sec">',
      '<div class="dsv9-sec-line"></div>',
      '<div class="dsv9-sec-title">Try asking</div>',
      '<span class="dsv9-sec-spark">' + I.spark + '</span>',
    '</div>',
    '<div class="dsv9-grid">',
      cards.map(function (c) {
        return '<button class="dsv9-card" type="button" data-prompt="' + esc(c.title) + '">' +
          '<div class="dsv9-card-icon ' + c.cls + '">' + c.icon + '</div>' +
          '<div class="dsv9-card-text">' +
            '<div class="dsv9-card-title">' + esc(c.title) + '</div>' +
            '<div class="dsv9-card-sub">' + esc(c.sub) + '</div>' +
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
      return '<div class="dsv9-msg user">' +
        '<div>' +
          '<div class="dsv9-bubble">' + esc(m.text) + '</div>' +
          '<div class="dsv9-time">' + timeLabel(m.at) + '</div>' +
        '</div>' +
      '</div>';
    }
    return '<div class="dsv9-msg ai">' +
      '<div class="dsv9-avatar">' + ROBOT_SVG + '</div>' +
      '<div>' +
        '<div class="dsv9-bubble">' + esc(m.text) + '</div>' +
        '<div class="dsv9-time">' + timeLabel(m.at) + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
}

export function renderAiAssistant(container, params) {
  injectStyles();

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
    '<div class="dsv9-page">' +

      '<div class="dsv9-top">' +
        '<button class="dsv9-icon-btn" id="dsv9-back" type="button" aria-label="Back">' + I.menu + '</button>' +
        '<div class="dsv9-brand">' +
          '<div class="dsv9-brand-icon">' + I.cap + '</div>' +
          '<div class="dsv9-brand-text">' +
            '<div class="dsv9-brand-name">DiplomaStudy</div>' +
            '<div class="dsv9-brand-sub"><span class="dsv9-brand-dot"></span>AI Assistant</div>' +
          '</div>' +
        '</div>' +
        '<button class="dsv9-icon-btn" type="button" aria-label="Search">' + I.search + '</button>' +
        '<button class="dsv9-icon-btn dsv9-bell-dot" type="button" aria-label="Notifications">' + I.bell + '</button>' +
        '<button class="dsv9-icon-btn" type="button" aria-label="Profile">' + I.user + '</button>' +
      '</div>' +

      '<div class="dsv9-scroll" id="dsv9-scroll"></div>' +

      '<div class="dsv9-input-wrap">' +
        '<div class="dsv9-input-card">' +
          '<button class="dsv9-input-plus" type="button" aria-label="Attach">' + I.plus + '</button>' +
          '<div class="dsv9-input" id="dsv9-input" contenteditable="true" data-placeholder="Ask anything..." spellcheck="false"></div>' +
          '<button class="dsv9-input-mic" type="button" aria-label="Voice">' + I.mic + '</button>' +
          '<button class="dsv9-input-send" id="dsv9-send" type="button" disabled aria-label="Send">' + I.send + '</button>' +
        '</div>' +
      '</div>' +

    '</div>';

  var scroll = main.querySelector("#dsv9-scroll");
  var input = main.querySelector("#dsv9-input");
  var send = main.querySelector("#dsv9-send");
  var backBtn = main.querySelector("#dsv9-back");

  function getInputText() {
    return (input.textContent || "").trim();
  }
  function clearInput() {
    input.textContent = "";
  }

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
        input.textContent = btn.getAttribute("data-prompt") || "";
        refreshSend();
        input.focus();
        // Move caret to end
        try {
          var range = document.createRange();
          range.selectNodeContents(input);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {}
      });
    });
  }

  function scrollBottom() { try { scroll.scrollTop = scroll.scrollHeight; } catch (e) {} }
  function refreshSend() { send.disabled = !getInputText(); }

  function sendMessage() {
    var text = getInputText();
    if (!text || send.disabled) return;
    var wasEmpty = messages.length === 0;

    messages.push({ role: "user", text: text, at: Date.now() });
    writeMessages(messages);

    clearInput();
    refreshSend();

    if (wasEmpty) {
      scroll.innerHTML = '<div style="padding-top:6px">' + renderMessageList(messages) + '</div>';
    } else {
      var last = messages[messages.length - 1];
      scroll.insertAdjacentHTML("beforeend",
        '<div class="dsv9-msg user">' +
          '<div>' +
            '<div class="dsv9-bubble">' + esc(last.text) + '</div>' +
            '<div class="dsv9-time">' + timeLabel(last.at) + '</div>' +
          '</div>' +
        '</div>'
      );
    }

    scroll.insertAdjacentHTML("beforeend",
      '<div class="dsv9-msg ai" id="dsv9-typing">' +
        '<div class="dsv9-avatar">' + ROBOT_SVG + '</div>' +
        '<div class="dsv9-bubble"><div class="dsv9-typing"><i></i><i></i><i></i></div></div>' +
      '</div>'
    );
    scrollBottom();

    setTimeout(function () {
      var t = main.querySelector("#dsv9-typing");
      if (t) t.remove();
      var reply = { role: "assistant", text: mockReply(), at: Date.now() };
      messages.push(reply);
      writeMessages(messages);
      scroll.insertAdjacentHTML("beforeend",
        '<div class="dsv9-msg ai">' +
          '<div class="dsv9-avatar">' + ROBOT_SVG + '</div>' +
          '<div>' +
            '<div class="dsv9-bubble">' + esc(reply.text) + '</div>' +
            '<div class="dsv9-time">' + timeLabel(reply.at) + '</div>' +
          '</div>' +
        '</div>'
      );
      scrollBottom();
    }, 900);
  }

  input.addEventListener("input", refreshSend);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  input.addEventListener("paste", function (e) {
    // Force plain text paste (prevent rich formatting)
    try {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, text);
    } catch (err) {}
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