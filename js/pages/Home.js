/**
 * Home v17 - Header matches Home theme colors
 */

import { AppShell } from "../components/AppShell.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { isRouteActive } from "../core/router.js";
import {
  getDepartments,
  getSemestersByDepartment,
  getSubjects,
  getNotices,
  getRecentSubjectsFromServer,
  recordRecentSubject
} from "../services/api.js";
import { homeSkeleton } from "../utils/skeleton.js";
import { errorState, emptyState } from "../utils/errorState.js";
import { attachPullToRefresh } from "../utils/pullToRefresh.js";
import { Toast } from "../components/Toast.js";
import { isOnline, onConnectionChange } from "../utils/apiWrapper.js";

var currentCleanup = null;

// ═══════════════════════════════════════════
// THEME VARIABLES
// ☀️ Day = Sunrise Gold   🌙 Dark = Aurora Emerald
// ═══════════════════════════════════════════
function injectThemeVariables() {
  if (document.getElementById("ds-home-theme-v17")) return;
  var st = document.createElement("style");
  st.id = "ds-home-theme-v17";
  st.textContent = [
    // ☀️ LIGHT — Sunrise Gold
    ":root, html:not([data-theme='dark']) {",
    "  --hp-bg: #FDFAF4;",
    "  --hp-hero-1: #78350F;",
    "  --hp-hero-2: #B45309;",
    "  --hp-hero-3: #D97706;",
    "  --hp-hero-glow-1: rgba(251, 191, 36, 0.35);",
    "  --hp-hero-glow-2: rgba(217, 119, 6, 0.3);",
    "  --hp-accent: #D97706;",
    "  --hp-accent-soft: rgba(217, 119, 6, 0.15);",
    "  --hp-progress-bar: linear-gradient(90deg, #F59E0B, #FBBF24);",
    "  --hp-surface: #FFFFFF;",
    "  --hp-surface-soft: #FEF6E7;",
    "  --hp-border: #F0E0C8;",
    "  --hp-text: #422006;",
    "  --hp-text-muted: #78624E;",
    "  --hp-text-dim: #A89680;",
    "  --hp-chart-bar-today: linear-gradient(180deg, #F59E0B, #D97706);",
    "  --hp-chart-bar-past: linear-gradient(180deg, #FDE68A, #FBBF24);",
    "  --hp-chart-bar-empty: #F5EDE0;",
    "  --hp-notice-bg: #FFF8E7;",
    "  --hp-notice-border: rgba(245, 158, 11, 0.4);",
    "  --hp-notice-text: #78350F;",
    "  --hp-notice-accent: #D97706;",
    "  --hp-quote-bg: #FDF2F8;",
    "  --hp-quote-border: rgba(219, 39, 119, 0.3);",
    "  --hp-quote-text: #831843;",
    "  --hp-quote-accent: #DB2777;",
    "  --hp-tip-bg: #EFF6FF;",
    "  --hp-tip-border: rgba(59, 130, 246, 0.3);",
    "  --hp-tip-text: #1E3A8A;",
    "  --hp-tip-accent: #2563EB;",
    "  --hp-stat-1: #16A34A; --hp-stat-1-bg: rgba(22, 163, 74, 0.12);",
    "  --hp-stat-2: #EA580C; --hp-stat-2-bg: rgba(234, 88, 12, 0.12);",
    "  --hp-stat-3: #2563EB; --hp-stat-3-bg: rgba(37, 99, 235, 0.12);",
    "  --hp-fire-grad-1: rgba(245, 158, 11, 0.4);",
    "  --hp-fire-grad-2: rgba(245, 158, 11, 0.15);",
    "  --hp-fire-border: rgba(245, 158, 11, 0.5);",
    "  --hp-fire-text: #FEF3C7;",
    "}",

    // 🌙 DARK — Aurora Emerald
    "[data-theme='dark'] {",
    "  --hp-bg: #040A08;",
    "  --hp-hero-1: #022C22;",
    "  --hp-hero-2: #065F46;",
    "  --hp-hero-3: #10B981;",
    "  --hp-hero-glow-1: rgba(16, 185, 129, 0.55);",
    "  --hp-hero-glow-2: rgba(6, 182, 212, 0.35);",
    "  --hp-accent: #34D399;",
    "  --hp-accent-soft: rgba(16, 185, 129, 0.15);",
    "  --hp-progress-bar: linear-gradient(90deg, #10B981, #6EE7B7);",
    "  --hp-surface: #0A1712;",
    "  --hp-surface-soft: #0F1F19;",
    "  --hp-border: #1A2E26;",
    "  --hp-text: #ECFDF5;",
    "  --hp-text-muted: #A7F3D0;",
    "  --hp-text-dim: #6EE7B7;",
    "  --hp-chart-bar-today: linear-gradient(180deg, #34D399, #10B981);",
    "  --hp-chart-bar-past: linear-gradient(180deg, #059669, #065F46);",
    "  --hp-chart-bar-empty: #142620;",
    "  --hp-notice-bg: rgba(245, 158, 11, 0.08);",
    "  --hp-notice-border: rgba(245, 158, 11, 0.35);",
    "  --hp-notice-text: #FDE68A;",
    "  --hp-notice-accent: #FBBF24;",
    "  --hp-quote-bg: rgba(6, 182, 212, 0.10);",
    "  --hp-quote-border: rgba(34, 211, 238, 0.3);",
    "  --hp-quote-text: #A5F3FC;",
    "  --hp-quote-accent: #22D3EE;",
    "  --hp-tip-bg: rgba(232, 121, 249, 0.10);",
    "  --hp-tip-border: rgba(232, 121, 249, 0.3);",
    "  --hp-tip-text: #F5D0FE;",
    "  --hp-tip-accent: #E879F9;",
    "  --hp-stat-1: #34D399; --hp-stat-1-bg: rgba(16, 185, 129, 0.18);",
    "  --hp-stat-2: #FBBF24; --hp-stat-2-bg: rgba(251, 191, 36, 0.18);",
    "  --hp-stat-3: #22D3EE; --hp-stat-3-bg: rgba(34, 211, 238, 0.18);",
    "  --hp-fire-grad-1: rgba(16, 185, 129, 0.45);",
    "  --hp-fire-grad-2: rgba(16, 185, 129, 0.15);",
    "  --hp-fire-border: rgba(52, 211, 153, 0.5);",
    "  --hp-fire-text: #D1FAE5;",
    "}",

    // ═══════════════════════════════════════════
    // When home route is active — override header background
    // to match home page theme.
    // ═══════════════════════════════════════════
    "body.ds-route-home #header-mount {",
    "  background: var(--hp-bg) !important;",
    "  transition: background 0.25s ease;",
    "}",
    "body.ds-route-home #header-mount .app-header {",
    "  border-bottom: 1px solid var(--hp-border) !important;",
    "  box-shadow: none !important;",
    "}",
    "body.ds-route-home #header-mount .app-header.scrolled {",
    "  box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;",
    "}",
    "[data-theme='dark'] body.ds-route-home #header-mount .app-header.scrolled {",
    "  box-shadow: 0 2px 12px rgba(0,0,0,0.4) !important;",
    "}"
  ].join("\n");
  document.head.appendChild(st);
}

var T = {
  morning:   "\u09B6\u09C1\u09AD \u09B8\u0995\u09BE\u09B2",
  noon:      "\u09B6\u09C1\u09AD \u09A6\u09C1\u09AA\u09C1\u09B0",
  evening:   "\u09B6\u09C1\u09AD \u09B8\u09A8\u09CD\u09A7\u09CD\u09AF\u09BE",
  night:     "\u09B6\u09C1\u09AD \u09B0\u09BE\u09A4\u09CD\u09B0\u09BF",
  todayGoal: "\u0986\u099C\u0995\u09C7\u09B0 \u09B2\u0995\u09CD\u09B7\u09CD\u09AF",
  continue:  "\u09AA\u09A1\u09BC\u09BE \u099A\u09BE\u09B2\u09BF\u09AF\u09BC\u09C7 \u09AF\u09BE\u09A8",
  quickAct:  "\u09A6\u09CD\u09B0\u09C1\u09A4 \u0995\u09BE\u099C",
  notices:   "\u09A8\u09CB\u099F\u09BF\u09B6",
  seeAll:    "\u09B8\u09AC \u09A6\u09C7\u0996\u09C1\u09A8",
  readMore:  "\u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4",
  tip:       "\u09AA\u09A1\u09BC\u09BE\u09B0 \u099F\u09BF\u09AA\u09B8",
  subjects:  "\u09B8\u09BE\u09AC\u099C\u09C7\u0995\u09CD\u099F",
  streak:    "\u09A6\u09BF\u09A8",
  goalLabel: "\u099F\u09BE\u09B0\u09CD\u0997\u09C7\u099F",
  noDept:    "\u0995\u09CB\u09A8\u09CB \u09A1\u09BF\u09AA\u09BE\u09B0\u09CD\u099F\u09AE\u09C7\u09A8\u09CD\u099F \u09A8\u09C7\u0987",
  today:     "\u0986\u099C",
  yesterday: "\u0997\u09A4\u0995\u09BE\u09B2",
  daysAgo:   " \u09A6\u09BF\u09A8 \u0986\u0997\u09C7",
  weekly:    "\u09B8\u09BE\u09AA\u09CD\u09A4\u09BE\u09B9\u09BF\u0995 \u0985\u0997\u09CD\u09B0\u0997\u09A4\u09BF",
  recent:    "\u09B8\u09AE\u09CD\u09AA\u09CD\u09B0\u09A4\u09BF \u09A6\u09C7\u0996\u09BE",
  activity:  "\u09B8\u09AE\u09CD\u09AA\u09CD\u09B0\u09A4\u09BF \u0995\u09BE\u099C",
  quote:     "\u0986\u099C\u0995\u09C7\u09B0 \u09AC\u09BE\u09A8\u09C0",
  minutes:   "\u09AE\u09BF\u09A8\u09BF\u099F",
  congrats:  "\u0985\u09AD\u09BF\u09A8\u09A8\u09CD\u09A6\u09A8",
  milestone: "\u09A6\u09BF\u09A8\u09C7\u09B0 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0995 \u09AA\u09C2\u09B0\u09CD\u09A3"
};

var E = {
  fire:   "\uD83D\uDD25",
  books:  "\uD83D\uDCDA",
  target: "\uD83C\uDFAF",
  note:   "\uD83D\uDCDD",
  star:   "\u2B50",
  pdf:    "\uD83D\uDCC4",
  calc:   "\uD83E\uDDEE",
  cal:    "\uD83D\uDCC5",
  robot:  "\uD83E\uDD16",
  play:   "\u25B6",
  megaph: "\uD83D\uDCE2",
  bulb:   "\uD83D\uDCA1",
  dept:   "\uD83C\uDFDB\uFE0F",
  book:   "\uD83D\uDCD8",
  clock:  "\u23F0",
  party:  "\uD83C\uDF89",
  chart:  "\uD83D\uDCCA",
  quote:  "\uD83D\uDCAC",
  check:  "\u2705"
};

var QUOTES = [
  "প্রতিদিন ছোট ছোট পদক্ষেপ বড় সফলতা আনে।",
  "আজ যা শিখবে, কাল সেটাই তোমার শক্তি।",
  "পরিশ্রমের কোনো বিকল্প নেই।",
  "সফলতা রাতারাতি আসে না।",
  "পড়াশোনার সেরা সময় এখনই।",
  "নিজের উপর বিশ্বাস রাখো।",
  "আজকের কষ্ট কালকের সাফল্য।",
  "যারা হারে না, তারাই জেতে।",
  "ছোট ছোট জয়ই বড় জয়ের সিঁড়ি।",
  "জ্ঞানই প্রকৃত সম্পদ।",
  "মন দিয়ে পড়লে কিছুই কঠিন নয়।",
  "প্রতিদিন এক পা এগোলেও একদিন লক্ষ্যে পৌঁছাবে।",
  "অনুপ্রেরণা নয়, অভ্যাসই সাফল্য আনে।",
  "তোমার ভবিষ্যৎ আজকের পড়াশোনায় লেখা।",
  "যে পড়ে, সে জানে। যে জানে, সে পারে।",
  "ভয় নয়, সাহস নিয়ে এগিয়ে যাও।",
  "একটা অধ্যায় ভালোভাবে পড়া, দশটা আধাপড়ার চেয়ে ভালো।",
  "আজকের ত্যাগ কালকের সাফল্য।",
  "যেখানে ইচ্ছা, সেখানে উপায়।",
  "কষ্ট করলে ফল পাবেই।",
  "প্রতিদিন নতুন কিছু শেখার চেষ্টা করো।",
  "সময়ের মূল্য বোঝো, কারণ সময় ফিরে আসে না।",
  "তোমার চেষ্টাই তোমার পরিচয়।",
  "লক্ষ্য স্থির রাখো, পথ আপনি খুঁজে পাবে।",
  "হেরে গেলে হতাশ হয়ো না, শেখো।",
  "একাগ্রতা অর্ধেক সাফল্য।",
  "প্রতিটি সকাল নতুন সুযোগ।",
  "আজকের পড়াশোনাই তোমার কালকের ভিত্তি।",
  "সাধনা ছাড়া সফলতা অসম্ভব।",
  "প্রতিটা ভুল একটা শিক্ষা।",
  "সংকল্প থাকলে পাহাড়ও ডিঙানো যায়।",
  "সময় নষ্ট করলে সময় তোমাকে নষ্ট করবে।",
  "কঠোর পরিশ্রমেই সৌভাগ্য তৈরি হয়।",
  "নিজের উপর দৃঢ় বিশ্বাস রাখো।",
  "সফলতার কোনো শর্টকাট নেই।",
  "ভবিষ্যতের তুমি আজকের তোমার কাছে কৃতজ্ঞ থাকবে।",
  "একটি বই একটি বন্ধু।",
  "যত পড়বে, তত জানবে। যত জানবে, তত এগিয়ে যাবে।",
  "আলস্য সফলতার সবচেয়ে বড় শত্রু।",
  "আজকের পরিশ্রম, কালকের বিজয়।"
];

var TIPS = [
  "প্রতিদিন ২৫ মিনিট পড়লে মাসে ১২ ঘণ্টা হয়।",
  "কঠিন বিষয় সকালে পড়ুন, মন সতেজ থাকে।",
  "সূত্রগুলো কার্ডে লিখে রাখুন, বারবার দেখুন।",
  "প্রতি ২৫ মিনিট পড়ার পর ৫ মিনিট বিশ্রাম নিন।",
  "বন্ধুকে বুঝিয়ে বললে ৯০% মনে থাকে।",
  "পরীক্ষার আগের রাতে না পড়ে, আগেই ভালোভাবে পড়ুন।",
  "দিনে ৭-৮ ঘণ্টা ঘুমান — মস্তিষ্ক স্মৃতি গঠন করে।",
  "একই অধ্যায় ২৪ ঘণ্টার মধ্যে রিভিশন দিন।",
  "ছবি বা ডায়াগ্রাম এঁকে পড়ুন — মনে রাখা সহজ হয়।",
  "কেবল পড়বেন না, নিজেই প্রশ্ন বানিয়ে উত্তর দিন।",
  "একসাথে অনেক বিষয় পড়বেন না — একটা একটা করে।",
  "হাতের লেখায় নোট করুন — টাইপ করার চেয়ে ভালো মনে থাকে।",
  "প্রতিদিন একঘণ্টা মনোযোগ দিয়ে পড়া, চারঘণ্টা এলোমেলো পড়ার চেয়ে ভালো।",
  "মোবাইল দূরে রাখুন পড়ার সময়।",
  "যেটা বুঝতে পারছেন না, সাথে সাথে লিখে রাখুন।",
  "বড় টপিক ছোট ছোট অংশে ভাগ করুন।",
  "প্রতিদিন এক নতুন সূত্র শিখুন।",
  "রাতে ঘুমানোর আগে যা শিখেছেন তা রিভিশন দিন।",
  "জল খান পড়ার সময় — মস্তিষ্ক সক্রিয় থাকে।",
  "প্রতিদিন ২০ মিনিট ব্যায়াম করুন।",
  "সকালের নাস্তা বাদ দেবেন না।",
  "পড়ার ঘরে আলো ভালো থাকুক।",
  "প্রতিদিন একই জায়গায় পড়ুন — অভ্যাস তৈরি হয়।",
  "গত বছরের প্রশ্ন সমাধান করুন।",
  "প্রশ্ন পড়ার পর উত্তর ভাবুন — তারপর বইয়ের সাথে মিলিয়ে নিন।",
  "প্রতি সপ্তাহে নিজেই একটা পরীক্ষা দিন।",
  "ভুলের খাতা রাখুন, প্রতি সপ্তাহে রিভিশন দিন।",
  "সহজ প্রশ্ন আগে করুন, আত্মবিশ্বাস বাড়ে।",
  "কঠিন প্রশ্ন সবচেয়ে সতেজ মাথায় করুন।",
  "নোট রঙিন কলম দিয়ে লিখুন।",
  "মাইন্ড ম্যাপ বানিয়ে পড়ুন।",
  "প্রতিটা অধ্যায়ের শেষে সারসংক্ষেপ লিখুন।",
  "গণিত হাতে-কলমে করুন, শুধু দেখে যাবেন না।",
  "নিজের ভাষায় লিখুন, বইয়ের হুবহু নকল না।",
  "টাইমার দিয়ে পড়ুন — সময় নষ্ট হবে না।",
  "টেবিলে শুধু পড়ার বই রাখুন।",
  "বন্ধুর সাথে আলোচনা করুন কঠিন টপিক।",
  "প্রতিদিনের পড়ার হিসাব রাখুন।",
  "নিজেকে ছোট ছোট পুরস্কার দিন।",
  "ফর্মুলা ডায়েরি বানান।",
  "পরীক্ষার আগে নোটের বাইরে কিছু নতুন পড়বেন না।",
  "পরীক্ষায় উত্তর দেওয়ার আগে দুইবার প্রশ্ন পড়ুন।",
  "ডায়াগ্রাম পরিষ্কারভাবে আঁকুন।",
  "সময় ভাগ করে লেখা অভ্যাস করুন।"
];

function randomItem(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

var WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getStudyProgress() {
  try {
    var today = new Date().toISOString().slice(0, 10);
    var raw = localStorage.getItem("diplomastudy_goal");
    var goal = raw ? JSON.parse(raw) : { date: today, minutes: 0, target: 45 };
    if (goal.date !== today) { goal.date = today; goal.minutes = 0; }
    return goal;
  } catch (e) {
    return { date: "", minutes: 0, target: 45 };
  }
}

function updateStreak() {
  try {
    var today = new Date().toISOString().slice(0, 10);
    var raw = localStorage.getItem("diplomastudy_streak");
    var streak = raw ? JSON.parse(raw) : { dates: [], best: 0 };
    if (streak.dates.indexOf(today) === -1) {
      streak.dates.push(today);
      if (streak.dates.length > 90) streak.dates = streak.dates.slice(-90);
    }
    var current = 0;
    var dateSet = {};
    streak.dates.forEach(function (d) { dateSet[d] = true; });
    var d = new Date(today);
    while (dateSet[d.toISOString().slice(0, 10)]) {
      current++;
      d.setDate(d.getDate() - 1);
    }
    if (current > streak.best) streak.best = current;
    localStorage.setItem("diplomastudy_streak", JSON.stringify(streak));
    return { current: current, best: streak.best, dates: streak.dates };
  } catch (e) {
    return { current: 1, best: 1, dates: [] };
  }
}

function getWeeklyMinutes() {
  try {
    var raw = localStorage.getItem("diplomastudy_weekly_minutes");
    var data = raw ? JSON.parse(raw) : {};
    var days = [];
    var today = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      var key = d.toISOString().slice(0, 10);
      days.push({ key: key, weekday: d.getDay(), minutes: data[key] || 0 });
    }
    return days;
  } catch (e) {
    return [];
  }
}

function saveTodayMinutes(minutes) {
  try {
    var today = new Date().toISOString().slice(0, 10);
    var raw = localStorage.getItem("diplomastudy_weekly_minutes");
    var data = raw ? JSON.parse(raw) : {};
    data[today] = minutes;
    var keys = Object.keys(data).sort();
    if (keys.length > 60) {
      keys.slice(0, keys.length - 60).forEach(function (k) { delete data[k]; });
    }
    localStorage.setItem("diplomastudy_weekly_minutes", JSON.stringify(data));
  } catch (e) {}
}

function getRecentSubjects() {
  try {
    var raw = localStorage.getItem("diplomastudy_recent_subjects");
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveRecentSubject(id, name, code, icon) {
  try {
    var list = getRecentSubjects();
    list = list.filter(function (s) { return s.id !== id; });
    list.unshift({ id: id, name: name, code: code, icon: icon, at: Date.now() });
    list = list.slice(0, 8);
    localStorage.setItem("diplomastudy_recent_subjects", JSON.stringify(list));
  } catch (e) {}
  try { recordRecentSubject(id).catch(function () {}); } catch (e) {}
}

function getRecentActivity() {
  try {
    var raw = localStorage.getItem("diplomastudy_recent_activity");
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function addActivity(text) {
  try {
    var list = getRecentActivity();
    list.unshift({ text: text, at: Date.now() });
    list = list.slice(0, 5);
    localStorage.setItem("diplomastudy_recent_activity", JSON.stringify(list));
  } catch (e) {}
}

function checkMilestone(streak) {
  var milestones = [3, 7, 14, 30, 50, 100, 200, 365];
  for (var i = 0; i < milestones.length; i++) {
    if (streak === milestones[i]) return streak;
  }
  return null;
}

function getSeenMilestone() {
  try {
    return parseInt(localStorage.getItem("diplomastudy_seen_milestone") || "0", 10);
  } catch (e) { return 0; }
}

function markMilestoneSeen(n) {
  try { localStorage.setItem("diplomastudy_seen_milestone", String(n)); } catch (e) {}
}

function showInlineModal(title, message) {
  var old = document.getElementById("ds-inline-modal");
  if (old) old.remove();
  var overlay = document.createElement("div");
  overlay.id = "ds-inline-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
  overlay.innerHTML =
    '<div style="background:var(--hp-surface,#FFFFFF);border-radius:20px;padding:24px;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
      '<div style="font-size:48px;margin-bottom:12px;">&#128679;</div>' +
      '<h3 style="font-size:17px;font-weight:800;color:var(--hp-text,#1C3E2C);margin:0 0 8px;">' + escapeHtml(title || "Coming Soon") + '</h3>' +
      '<p style="font-size:13px;color:var(--hp-text-muted,#84968B);line-height:1.5;margin:0 0 18px;">' + escapeHtml(message || "This feature is coming soon.") + '</p>' +
      '<button data-close style="width:100%;padding:12px;border-radius:12px;border:none;background:var(--hp-accent,#1C3E2C);color:#FFFFFF;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;">OK</button>' +
    '</div>';
  document.body.appendChild(overlay);
  var close = function () { overlay.remove(); };
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
}

function showMilestoneModal(days) {
  var old = document.getElementById("ds-milestone-modal");
  if (old) old.remove();
  var overlay = document.createElement("div");
  overlay.id = "ds-milestone-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.8);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;";
  overlay.innerHTML =
    '<div style="background:linear-gradient(135deg,var(--hp-hero-1,#1C3E2C),var(--hp-hero-3,#2D5A40));border-radius:24px;padding:28px 24px;max-width:340px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.4);position:relative;overflow:hidden;">' +
      '<div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,var(--hp-hero-glow-1) 0%,transparent 70%);"></div>' +
      '<div style="position:relative;z-index:2;">' +
        '<div style="font-size:64px;margin-bottom:12px;">' + E.party + '</div>' +
        '<h3 style="font-size:20px;font-weight:900;color:#FFFFFF;margin:0 0 8px;">' + T.congrats + '!</h3>' +
        '<p style="font-size:14px;color:rgba(255,255,255,0.85);line-height:1.5;margin:0 0 20px;">You reached a <strong style="color:#FBBF24;">' + days + ' ' + T.streak + '</strong> streak!</p>' +
        '<button data-close style="width:100%;padding:13px;border-radius:12px;border:none;background:#FFFFFF;color:var(--hp-accent,#1C3E2C);font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;">Continue</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  var close = function () { overlay.remove(); };
  overlay.querySelector("[data-close]").onclick = close;
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
}

async function showDeptSemPicker(currentDeptId, currentSemId) {
  var old = document.getElementById("ds-picker");
  if (old) old.remove();

  var overlay = document.createElement("div");
  overlay.id = "ds-picker";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:flex-end;justify-content:center;";
  overlay.innerHTML =
    '<div style="background:var(--hp-surface,#FFFFFF);width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:24px;max-height:85vh;overflow-y:auto;box-shadow:0 -12px 40px rgba(0,0,0,0.3);">' +
      '<div style="width:40px;height:4px;background:var(--hp-border,#E1E8E1);border-radius:999px;margin:0 auto 20px;"></div>' +
      '<div style="text-align:center;padding:40px 20px;"><div class="spinner"></div></div>' +
    '</div>';
  document.body.appendChild(overlay);
  var close = function () { overlay.remove(); };
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

  var departments = [];
  try { departments = await getDepartments(); } catch (e) {}

  if (departments.length === 0) {
    overlay.querySelector("div").innerHTML =
      '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:56px;margin-bottom:12px;">' + E.dept + '</div>' +
        '<h3 style="font-size:16px;font-weight:800;color:var(--hp-text,#1C3E2C);margin:0 0 8px;">' + T.noDept + '</h3>' +
      '</div>';
    return;
  }

  var modal = overlay.querySelector("div");
  modal.innerHTML =
    '<div style="width:40px;height:4px;background:var(--hp-border,#E1E8E1);border-radius:999px;margin:0 auto 16px;"></div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
      '<h3 style="font-size:17px;font-weight:900;color:var(--hp-text,#1C3E2C);margin:0;">Department &amp; Semester</h3>' +
      '<button data-close style="width:32px;height:32px;border-radius:10px;background:var(--hp-surface-soft,#F2F5F2);border:none;color:var(--hp-text-muted,#57675D);font-size:14px;cursor:pointer;font-family:inherit;">X</button>' +
    '</div>' +
    '<div id="step-dept">' +
      '<div style="font-size:11px;font-weight:800;color:var(--hp-text-dim,#84968B);letter-spacing:0.8px;margin-bottom:10px;">1. SELECT DEPARTMENT</div>' +
      '<div id="dept-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;"></div>' +
    '</div>' +
    '<div id="step-sem" style="display:none;">' +
      '<div style="font-size:11px;font-weight:800;color:var(--hp-text-dim,#84968B);letter-spacing:0.8px;margin-bottom:10px;">2. SELECT SEMESTER</div>' +
      '<div id="sem-list" style="display:flex;flex-direction:column;gap:8px;"></div>' +
    '</div>';
  modal.querySelector("[data-close]").onclick = close;

  var deptList = modal.querySelector("#dept-list");

  function renderDepartments() {
    deptList.innerHTML = departments.map(function (d) {
      return '<button class="dept-opt" data-dept-id="' + d.id + '" style="display:flex;align-items:center;gap:12px;padding:14px;background:' + (d.id === currentDeptId ? "var(--hp-accent-soft)" : "var(--hp-surface-soft)") + ';border:1.5px solid ' + (d.id === currentDeptId ? "var(--hp-accent)" : "var(--hp-border)") + ';border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;width:100%;">' +
        '<div style="width:44px;height:44px;border-radius:13px;background:var(--hp-surface,#FFFFFF);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + (d.icon || E.dept) + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13.5px;font-weight:800;color:var(--hp-text,#1C3E2C);margin-bottom:2px;">' + escapeHtml(d.name) + '</div>' +
          (d.banglaName ? '<div style="font-size:11px;color:var(--hp-text-dim,#84968B);font-weight:600;">' + escapeHtml(d.banglaName) + '</div>' : "") +
        '</div>' +
      '</button>';
    }).join("");
    deptList.querySelectorAll(".dept-opt").forEach(function (btn) {
      btn.addEventListener("click", function () { loadSemesters(btn.getAttribute("data-dept-id")); });
    });
  }

  async function loadSemesters(deptId) {
    var stepSem = modal.querySelector("#step-sem");
    var semList = modal.querySelector("#sem-list");
    deptList.querySelectorAll(".dept-opt").forEach(function (btn) {
      var isThis = btn.getAttribute("data-dept-id") === deptId;
      btn.style.background = isThis ? "var(--hp-accent-soft)" : "var(--hp-surface-soft)";
      btn.style.borderColor = isThis ? "var(--hp-accent)" : "var(--hp-border)";
    });
    stepSem.style.display = "block";
    semList.innerHTML = '<div style="text-align:center;padding:24px;"><div class="spinner" style="margin:0 auto;"></div></div>';

    var semesters = [];
    try { semesters = await getSemestersByDepartment(deptId); } catch (e) {}

    if (semesters.length === 0) {
      semList.innerHTML = '<div style="padding:24px 16px;text-align:center;background:var(--hp-notice-bg);border:1.5px dashed var(--hp-notice-border);border-radius:14px;font-size:13px;font-weight:800;color:var(--hp-notice-text);">No Semesters</div>';
      return;
    }

    semList.innerHTML = semesters.map(function (s) {
      return '<button class="sem-opt" data-sem-id="' + s.id + '" data-sem-num="' + s.number + '" style="display:flex;align-items:center;gap:12px;padding:14px;background:' + (s.id === currentSemId ? "var(--hp-accent-soft)" : "var(--hp-surface-soft)") + ';border:1.5px solid ' + (s.id === currentSemId ? "var(--hp-accent)" : "var(--hp-border)") + ';border-radius:14px;cursor:pointer;font-family:inherit;text-align:left;width:100%;">' +
        '<div style="width:44px;height:44px;border-radius:13px;background:var(--hp-surface,#FFFFFF);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + (s.icon || E.cal) + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13.5px;font-weight:800;color:var(--hp-text,#1C3E2C);margin-bottom:2px;">' + escapeHtml(s.name) + '</div>' +
          '<div style="font-size:11px;color:var(--hp-text-dim,#84968B);font-weight:600;">Semester ' + s.number + '</div>' +
        '</div>' +
      '</button>';
    }).join("");

    semList.querySelectorAll(".sem-opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var semId = btn.getAttribute("data-sem-id");
        var semNum = parseInt(btn.getAttribute("data-sem-num"), 10);
        var ns = storage.get(STORAGE_KEYS.SETTINGS, {});
        ns.department = deptId; ns.departmentId = deptId;
        ns.semester = semId; ns.semesterId = semId;
        ns.semesterNumber = semNum;
        storage.set(STORAGE_KEYS.SETTINGS, ns);
        Toast.success("Selection saved");
        close();
        setTimeout(function () { window.location.reload(); }, 300);
      });
    });
    setTimeout(function () { stepSem.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
  }

  renderDepartments();
  if (currentDeptId) loadSemesters(currentDeptId);
}

export async function renderHome(container, params, routeToken) {
  injectThemeVariables();

  // Mark body so header CSS applies theme-matched colors
  try { document.body.classList.add("ds-route-home"); } catch (e) {}

  var stillActive = function () { return routeToken === undefined || isRouteActive(routeToken); };

  if (currentCleanup) {
    try { currentCleanup(); } catch (e) {}
    currentCleanup = null;
  }

  AppShell.updateHeader({ showBack: false, showSettings: true, showSearch: true, showTheme: true });

  var main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = homeSkeleton();

  if (!isOnline()) {
    if (!stillActive()) return;
    main.innerHTML = errorState({
      type: "network",
      customBangla: "No internet connection.",
      retryFn: function () { renderHome(container, params, routeToken); }
    });
    return;
  }

  var departments = [], subjects = [], notices = [];
  var loadError = null;

  try {
    var results = await Promise.all([
      getDepartments().catch(function (e) { loadError = e; return []; }),
      getSubjects().catch(function (e) { loadError = e; return []; }),
      getNotices().catch(function (e) { loadError = e; return []; })
    ]);
    departments = results[0];
    subjects = results[1];
    notices = results[2];
  } catch (err) {
    loadError = err;
  }

  if (!stillActive()) return;

  if (departments.length === 0 && subjects.length === 0 && notices.length === 0 && loadError) {
    main.innerHTML = errorState({
      type: "server",
      message: loadError.message,
      retryFn: function () { renderHome(container, params, routeToken); }
    });
    return;
  }

  if (departments.length === 0) {
    main.innerHTML = emptyState({
      icon: E.dept,
      title: "No Departments",
      message: "Add departments from Admin Panel.",
      actionFn: function () { window.location.reload(); },
      actionLabel: "Retry"
    });
    return;
  }

  var settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  var userName = settings.userName || "Student";

  var currentDept = null;
  var curDeptKey = settings.department || settings.departmentId || "";
  if (curDeptKey) {
    currentDept = departments.filter(function (d) {
      return d.id === curDeptKey || (d.code && d.code.toLowerCase() === String(curDeptKey).toLowerCase());
    })[0];
  }
  if (!currentDept) {
    currentDept = departments[0];
    settings.department = currentDept.id;
    settings.departmentId = currentDept.id;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }

  var currentSemesters = [];
  try { currentSemesters = await getSemestersByDepartment(currentDept.id); } catch (e) {}

  if (!stillActive()) return;

  var currentSem = null;
  var curSemKey = settings.semesterId || settings.semester || "";
  if (curSemKey) {
    currentSem = currentSemesters.filter(function (s) {
      return s.id === curSemKey || String(s.number) === String(curSemKey);
    })[0];
  }
  if (!currentSem && currentSemesters.length > 0) {
    currentSem = currentSemesters[0];
    settings.semester = currentSem.id;
    settings.semesterId = currentSem.id;
    settings.semesterNumber = currentSem.number;
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  }

  var currentSemName = currentSem ? currentSem.name : "No Semester";
  var streak = updateStreak();
  var goal = getStudyProgress();
  var goalPercent = Math.min(Math.round((goal.minutes / goal.target) * 100), 100);

  saveTodayMinutes(goal.minutes);
  var weeklyData = getWeeklyMinutes();

  var hour = new Date().getHours();
  var greeting = T.morning;
  if (hour >= 12 && hour < 17) greeting = T.noon;
  else if (hour >= 17 && hour < 20) greeting = T.evening;
  else if (hour >= 20 || hour < 5) greeting = T.night;

  var latestNotices = notices.slice(0, 2);

  var storedRecent = getRecentSubjects();
  var serverRecent = [];
  try {
    serverRecent = await getRecentSubjectsFromServer(subjects.map(function (s) { return s.id; }));
  } catch (e) {}

  var recentSource = serverRecent.length > 0 ? serverRecent : storedRecent;
  var recentSubjects = recentSource
    .map(function (r) {
      var live = subjects.filter(function (s) { return s.id === r.id; })[0];
      if (!live) return null;
      return {
        id: live.id,
        name: live.name,
        code: live.code || "",
        icon: live.icon || E.book,
        at: r.at
      };
    })
    .filter(Boolean)
    .slice(0, 5);

  var continueSubject = null;
  if (recentSubjects.length > 0) {
    continueSubject = subjects.filter(function (s) { return s.id === recentSubjects[0].id; })[0] || null;
  }
  if (!continueSubject && subjects.length > 0) {
    continueSubject = subjects[0];
  }

  var todaysTip = randomItem(TIPS);
  var todaysQuote = randomItem(QUOTES);

  var milestone = checkMilestone(streak.current);
  var seenMilestone = getSeenMilestone();
  var showMilestone = milestone && milestone > seenMilestone;

  if (!stillActive()) return;

  var html = [];

  // HERO
  html.push(
    '<div style="position:relative;border-radius:24px;padding:22px 20px 20px;margin-bottom:22px;overflow:hidden;background:linear-gradient(135deg,var(--hp-hero-1) 0%,var(--hp-hero-2) 50%,var(--hp-hero-3) 100%);box-shadow:0 16px 40px -12px var(--hp-hero-glow-2),0 0 0 1px rgba(255,255,255,0.06);">',
      '<div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,var(--hp-hero-glow-1) 0%,transparent 70%);"></div>',
      '<div style="position:relative;z-index:2;">',
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;gap:12px;">',
          '<div style="flex:1;min-width:0;">',
            '<div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.75);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:4px;">' + greeting + ' ' + E.clock + '</div>',
            '<div style="font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1.15;">' + escapeHtml(userName) + '</div>',
          '</div>',
          (streak.current > 0
            ? '<div style="display:flex;align-items:center;gap:5px;padding:7px 12px;background:linear-gradient(135deg,var(--hp-fire-grad-1),var(--hp-fire-grad-2));border:1px solid var(--hp-fire-border);border-radius:999px;font-size:11.5px;font-weight:800;color:var(--hp-fire-text);flex-shrink:0;">' +
                '<span style="font-size:13px;">' + E.fire + '</span>' +
                '<span>' + streak.current + ' ' + T.streak + '</span>' +
              '</div>'
            : ""),
        '</div>',
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">',
          '<button id="hero-dept-btn" style="display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);border-radius:999px;color:#FFFFFF;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;backdrop-filter:blur(10px);">' +
            '<span style="font-size:13px;">' + (currentDept.icon || E.dept) + '</span>' +
            '<span>' + escapeHtml(currentDept.name) + '</span>' +
          '</button>',
          '<button id="hero-sem-btn" style="display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);border-radius:999px;color:#FFFFFF;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;backdrop-filter:blur(10px);">' +
            '<span style="font-size:13px;">' + E.cal + '</span>' +
            '<span>' + escapeHtml(currentSemName) + '</span>' +
          '</button>',
        '</div>',
        '<div style="background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.18);border-radius:14px;padding:12px 14px;backdrop-filter:blur(10px);">',
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">',
            '<span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);">' + T.todayGoal + '</span>',
            '<span style="font-size:11.5px;font-weight:800;color:#FFFFFF;">' + goal.minutes + ' / ' + goal.target + ' ' + T.minutes + '</span>',
          '</div>',
          '<div style="height:6px;background:rgba(255,255,255,0.2);border-radius:999px;overflow:hidden;">',
            '<div style="height:100%;width:' + goalPercent + '%;background:linear-gradient(90deg,#FFFFFF,#D1FAE5);border-radius:999px;"></div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  );

  // STATS
  html.push(
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:24px;">',
      statCard(E.books, subjects.length, T.subjects, "var(--hp-stat-1-bg)", "var(--hp-stat-1)"),
      statCard(E.fire, streak.current, T.streak, "var(--hp-stat-2-bg)", "var(--hp-stat-2)"),
      statCard(E.target, goalPercent + "%", T.goalLabel, "var(--hp-stat-3-bg)", "var(--hp-stat-3)"),
    '</div>'
  );

  // WEEKLY CHART
  var maxMin = 1;
  weeklyData.forEach(function (d) { if (d.minutes > maxMin) maxMin = d.minutes; });

  html.push(
    '<div style="padding:16px;background:var(--hp-surface);border:1px solid var(--hp-border);border-radius:18px;box-shadow:0 3px 12px rgba(0,0,0,0.15);margin-bottom:24px;">',
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">',
        '<h3 style="font-size:13px;font-weight:800;color:var(--hp-text);margin:0;">' + E.chart + ' ' + T.weekly + '</h3>',
        '<span style="font-size:11px;font-weight:800;color:var(--hp-accent);">' + goal.minutes + ' ' + T.minutes + ' ' + T.today + '</span>',
      '</div>',
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;height:80px;gap:6px;">',
        weeklyData.map(function (d, i) {
          var height = Math.max(8, Math.round((d.minutes / maxMin) * 70));
          var isToday = i === weeklyData.length - 1;
          var barColor = isToday ? "var(--hp-chart-bar-today)" : (d.minutes > 0 ? "var(--hp-chart-bar-past)" : "var(--hp-chart-bar-empty)");
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;">' +
            '<div style="flex:1;display:flex;align-items:flex-end;width:100%;">' +
              '<div style="width:100%;height:' + height + '%;background:' + barColor + ';border-radius:6px 6px 3px 3px;"></div>' +
            '</div>' +
            '<span style="font-size:10px;font-weight:800;color:' + (isToday ? "var(--hp-accent)" : "var(--hp-text-dim)") + ';">' + WEEKDAYS[d.weekday] + '</span>' +
          '</div>';
        }).join(""),
      '</div>',
    '</div>'
  );

  // RECENT SUBJECTS
  if (recentSubjects.length > 0) {
    html.push(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 4px 12px;">',
        '<h2 style="font-size:15px;font-weight:800;color:var(--hp-text);margin:0;">' + E.clock + ' ' + T.recent + '</h2>',
      '</div>',
      '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -16px 24px;padding:0 16px;">',
        '<div style="display:flex;gap:10px;width:max-content;padding-bottom:4px;">',
          recentSubjects.map(function (r) {
            return '<button class="recent-subject" data-subject-id="' + r.id + '" style="display:flex;flex-direction:column;gap:10px;padding:14px;background:var(--hp-surface);border:1.5px solid var(--hp-border);border-radius:16px;cursor:pointer;font-family:inherit;text-align:left;width:140px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);">' +
              '<div style="width:44px;height:44px;border-radius:13px;background:var(--hp-accent-soft);display:flex;align-items:center;justify-content:center;font-size:22px;">' + (r.icon || E.book) + '</div>' +
              '<div style="min-width:0;width:100%;">' +
                '<div style="font-size:12.5px;font-weight:800;color:var(--hp-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px;">' + escapeHtml(r.name || "") + '</div>' +
                '<div style="font-size:10.5px;color:var(--hp-text-dim);font-weight:700;">' + escapeHtml(r.code || "") + '</div>' +
              '</div>' +
            '</button>';
          }).join(""),
        '</div>',
      '</div>'
    );
  }

  // CONTINUE LEARNING
  if (continueSubject) {
    html.push(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 4px 12px;">',
        '<h2 style="font-size:15px;font-weight:800;color:var(--hp-text);margin:0;">' + T.continue + '</h2>',
      '</div>',
      '<button class="continue-card" data-subject-id="' + continueSubject.id + '" style="width:100%;display:flex;align-items:center;gap:14px;padding:16px;background:var(--hp-surface);border:1.5px solid var(--hp-border);border-radius:18px;cursor:pointer;font-family:inherit;text-align:left;box-shadow:0 4px 14px rgba(0,0,0,0.2);margin-bottom:24px;position:relative;overflow:hidden;">',
        '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--hp-accent),var(--hp-hero-3));"></div>',
        '<div style="width:56px;height:56px;border-radius:16px;background:var(--hp-accent-soft);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">' + (continueSubject.icon || E.book) + '</div>',
        '<div style="flex:1;min-width:0;">',
          '<div style="font-size:10px;font-weight:800;color:var(--hp-text-dim);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;">' + E.book + ' PICK UP WHERE YOU LEFT</div>' +
          '<div style="font-size:15px;font-weight:800;color:var(--hp-text);margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(continueSubject.name) + '</div>' +
          '<div style="font-size:11.5px;color:var(--hp-text-dim);font-weight:600;">' + escapeHtml(continueSubject.code || "") + (continueSubject.credits ? ' \u2022 ' + continueSubject.credits + ' credits' : '') + '</div>',
        '</div>',
        '<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--hp-hero-2),var(--hp-hero-3));color:#FFFFFF;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;">' + E.play + '</div>',
      '</button>'
    );
  }

  // QUICK ACTIONS
  html.push(
    '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 4px 12px;">',
      '<h2 style="font-size:15px;font-weight:800;color:var(--hp-text);margin:0;">' + T.quickAct + '</h2>',
      '<button id="home-all-subjects" style="font-size:11.5px;font-weight:800;color:var(--hp-text);background:transparent;border:none;font-family:inherit;cursor:pointer;padding:0;">' + T.seeAll + ' &rarr;</button>',
    '</div>',
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;">',
      quickBtn(E.books,  "Study",   "rgba(16,185,129,0.15)", "#10B981", "#/subjects"),
      quickBtn(E.target, "Quiz",    "rgba(245,158,11,0.15)", "#F59E0B", "#/quiz"),
      quickBtn(E.note,   "Notes",   "rgba(59,130,246,0.15)", "#3B82F6", "#/notes"),
      quickBtn(E.star,   "Saved",   "rgba(244,63,94,0.15)",  "#F43F5E", "#/bookmarks"),
      quickBtn(E.pdf,    "PDFs",    "rgba(99,102,241,0.15)", "#6366F1", "#/pdfs"),
      quickBtn(E.calc,   "Formula", "rgba(6,182,212,0.15)",  "#06B6D4", "#/formulas"),
      quickBtn(E.cal,    "Planner", "rgba(168,85,247,0.15)", "#A855F7", "#/planner"),
      quickBtn(E.robot,  "AI",      "rgba(236,72,153,0.15)", "#EC4899", "#/ai"),
    '</div>'
  );

  // NOTICES
  if (latestNotices.length > 0) {
    html.push(
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:0 4px 12px;">',
        '<h2 style="font-size:15px;font-weight:800;color:var(--hp-text);margin:0;">' + E.megaph + ' ' + T.notices + '</h2>',
        '<button id="home-all-notices" style="font-size:11.5px;font-weight:800;color:var(--hp-text);background:transparent;border:none;font-family:inherit;cursor:pointer;padding:0;">' + T.seeAll + ' &rarr;</button>',
      '</div>'
    );
    latestNotices.forEach(function (n, idx) {
      var dateText = formatDate(n.publishedAt || n.createdAt);
      var contentText = stripMarkdown(n.content || "").substring(0, 100);
      html.push(
        '<div class="home-notice-card" data-notice-idx="' + idx + '" style="padding:14px 16px;background:var(--hp-notice-bg);border:1.5px solid var(--hp-notice-border);border-radius:16px;margin-bottom:10px;cursor:pointer;position:relative;overflow:hidden;">',
          '<div style="position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,var(--hp-notice-accent),var(--hp-hero-1));"></div>',
          '<div style="padding-left:8px;">',
            '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">',
              '<span style="font-size:9.5px;font-weight:800;color:var(--hp-notice-accent);background:rgba(255,255,255,0.1);padding:3px 9px;border-radius:6px;text-transform:uppercase;letter-spacing:0.5px;">' + escapeHtml(n.audience || "Notice") + '</span>',
              '<span style="font-size:10.5px;color:var(--hp-notice-text);font-weight:600;opacity:0.85;">' + dateText + '</span>',
            '</div>',
            '<h3 style="font-size:13.5px;font-weight:800;color:var(--hp-notice-text);margin:0 0 5px;line-height:1.3;">' + escapeHtml(n.title || "") + '</h3>',
            '<p style="font-size:11.5px;color:var(--hp-notice-text);opacity:0.85;line-height:1.5;margin:0 0 8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">' + escapeHtml(contentText) + '</p>',
            '<div style="display:flex;align-items:center;gap:4px;font-size:11px;font-weight:800;color:var(--hp-notice-accent);">' + T.readMore + ' &rarr;</div>',
          '</div>',
        '</div>'
      );
    });
    html.push('<div style="height:6px;"></div>');
  }

  // QUOTE
  html.push(
    '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:var(--hp-quote-bg);border:1.5px solid var(--hp-quote-border);border-radius:16px;margin-bottom:12px;">',
      '<div style="width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + E.quote + '</div>',
      '<div style="flex:1;min-width:0;">',
        '<div style="font-size:10px;font-weight:800;color:var(--hp-quote-accent);letter-spacing:0.6px;text-transform:uppercase;margin-bottom:3px;">' + T.quote + '</div>',
        '<div id="ds-quote-text" style="font-size:13px;color:var(--hp-quote-text);line-height:1.55;font-weight:600;font-style:italic;transition:opacity 0.3s ease;">' + escapeHtml(todaysQuote) + '</div>',
      '</div>',
    '</div>'
  );

  // TIP
  html.push(
    '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:var(--hp-tip-bg);border:1.5px solid var(--hp-tip-border);border-radius:16px;margin-bottom:20px;">',
      '<div style="width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + E.bulb + '</div>',
      '<div style="flex:1;min-width:0;">',
        '<div style="font-size:10px;font-weight:800;color:var(--hp-tip-accent);letter-spacing:0.6px;text-transform:uppercase;margin-bottom:3px;">' + T.tip + '</div>',
        '<div id="ds-tip-text" style="font-size:13px;color:var(--hp-tip-text);line-height:1.55;font-weight:600;transition:opacity 0.3s ease;">' + escapeHtml(todaysTip) + '</div>',
      '</div>',
    '</div>'
  );

  html.push('<div style="height:20px;"></div>');

  main.innerHTML = html.join("");

  // AUTO-ROTATE
  var _rotateTimer = setInterval(function () {
    var quoteEl = main.querySelector("#ds-quote-text");
    var tipEl = main.querySelector("#ds-tip-text");
    if (!quoteEl || !tipEl) return;
    quoteEl.style.opacity = "0";
    tipEl.style.opacity = "0";
    setTimeout(function () {
      quoteEl.textContent = randomItem(QUOTES);
      tipEl.textContent = randomItem(TIPS);
      quoteEl.style.opacity = "1";
      tipEl.style.opacity = "1";
    }, 300);
  }, 45000);

  var openPicker = function () { showDeptSemPicker(currentDept.id, currentSem ? currentSem.id : null); };
  main.querySelector("#hero-dept-btn") && main.querySelector("#hero-dept-btn").addEventListener("click", openPicker);
  main.querySelector("#hero-sem-btn") && main.querySelector("#hero-sem-btn").addEventListener("click", openPicker);

  main.querySelector("#home-all-subjects") && main.querySelector("#home-all-subjects").addEventListener("click", function (e) {
    e.preventDefault(); window.location.hash = "#/subjects";
  });
  main.querySelector("#home-all-notices") && main.querySelector("#home-all-notices").addEventListener("click", function (e) {
    e.preventDefault(); window.location.hash = "#/notices";
  });

  main.querySelectorAll("[data-quick]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var route = btn.getAttribute("data-route");
      var label = btn.getAttribute("data-quick");
      if (!route) { showInlineModal(label, "This feature is coming soon."); }
      else { window.location.hash = route; }
    });
  });

  main.querySelectorAll(".continue-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var id = card.getAttribute("data-subject-id");
      if (id) {
        var sub = subjects.filter(function (s) { return s.id === id; })[0];
        if (sub) saveRecentSubject(sub.id, sub.name, sub.code, sub.icon);
        window.location.hash = "#/subject?subjectId=" + id;
      }
    });
  });

  main.querySelectorAll(".recent-subject").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var id = card.getAttribute("data-subject-id");
      if (id) {
        var sub = subjects.filter(function (s) { return s.id === id; })[0];
        if (sub) saveRecentSubject(sub.id, sub.name, sub.code, sub.icon);
        window.location.hash = "#/subject?subjectId=" + id;
      }
    });
  });

  main.querySelectorAll(".home-notice-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.hash = "#/notices";
    });
  });

  if (showMilestone) {
    setTimeout(function () {
      showMilestoneModal(milestone);
      markMilestoneSeen(milestone);
      addActivity("Reached " + milestone + " day streak!");
    }, 600);
  }

  var cleanupPull = attachPullToRefresh(main, async function () {
    Toast.info("Refreshing...");
    await renderHome(container, params, routeToken);
    Toast.success("Updated");
  });

  var cleanupConn = onConnectionChange(function (online) {
    if (!online) Toast.warning("No internet");
    else Toast.success("Internet restored");
  });

  currentCleanup = function () {
    try { document.body.classList.remove("ds-route-home"); } catch (e) {}
    try { if (_rotateTimer) clearInterval(_rotateTimer); } catch (e) {}
    try { cleanupPull && cleanupPull(); } catch (e) {}
    try { cleanupConn && cleanupConn(); } catch (e) {}
  };
}

function statCard(icon, value, label, bg, color) {
  return '<div style="padding:14px 10px;background:var(--hp-surface);border:1px solid var(--hp-border);border-radius:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);">' +
    '<div style="width:34px;height:34px;border-radius:11px;background:' + bg + ';color:' + color + ';display:flex;align-items:center;justify-content:center;font-size:15px;margin:0 auto 8px;">' + icon + '</div>' +
    '<div style="font-size:17px;font-weight:900;color:var(--hp-text);letter-spacing:-0.3px;line-height:1;">' + value + '</div>' +
    '<div style="font-size:10px;font-weight:700;color:var(--hp-text-dim);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">' + label + '</div>' +
  '</div>';
}

function quickBtn(icon, label, bg, color, route) {
  return '<button data-quick="' + label + '" data-route="' + (route || "") + '" style="position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px 10px;background:var(--hp-surface);border:1px solid var(--hp-border);border-radius:16px;cursor:pointer;font-family:inherit;box-shadow:0 2px 6px rgba(0,0,0,0.15);">' +
    '<div style="width:42px;height:42px;border-radius:13px;background:' + bg + ';color:' + color + ';display:flex;align-items:center;justify-content:center;font-size:20px;">' + icon + '</div>' +
    '<span style="font-size:10.5px;font-weight:800;color:var(--hp-text);">' + label + '</span>' +
  '</button>';
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function stripMarkdown(text) {
  return String(text || "").replace(/[#*_`>]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\n+/g, " ").trim();
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    var d = new Date(iso);
    var now = new Date();
    var diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return T.today;
    if (diff === 1) return T.yesterday;
    if (diff < 7) return diff + T.daysAgo;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch (e) { return ""; }
}