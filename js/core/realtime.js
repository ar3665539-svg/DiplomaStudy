/**
 * DiplomaStudy - Realtime Sync Service
 * Listens to Supabase changes, invalidates cache, notifies listeners
 */

import { supabase } from "./supabase.js";

const WATCHED_TABLES = [
  "departments",
  "semesters",
  "subjects",
  "subject_assignments",
  "chapters",
  "topics",
  "questions",
  "suggestions",
  "formulas",
  "pdfs",
  "notices",
  "quizzes"
];

let channel = null;
let isConnected = false;
let reconnectTimer = null;
let changeListeners = new Set();
let statusListeners = new Set();

export function onContentChange(callback) {
  changeListeners.add(callback);
  return () => changeListeners.delete(callback);
}

export function onConnectionChange(callback) {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
}

export function initRealtime() {
  if (channel || isConnected) return;

  try {
    console.log("[Realtime] 🚀 Initializing...");

    channel = supabase.channel("ds-content-sync", {
      config: {
        broadcast: { self: false },
        presence: { key: "" }
      }
    });

    WATCHED_TABLES.forEach((table) => {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          handleChange(table, payload);
        }
      );
    });

    channel.subscribe((status) => {
      console.log("[Realtime] Status:", status);

      if (status === "SUBSCRIBED") {
        isConnected = true;
        notifyStatus("connected");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        isConnected = false;
        notifyStatus("disconnected");
        scheduleReconnect();
      } else if (status === "CLOSED") {
        isConnected = false;
        notifyStatus("closed");
      }
    });
  } catch (err) {
    console.error("[Realtime] Init error:", err);
    scheduleReconnect();
  }
}

export function stopRealtime() {
  if (channel) {
    try { supabase.removeChannel(channel); } catch (e) {}
    channel = null;
  }
  isConnected = false;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

export function isRealtimeConnected() {
  return isConnected;
}

function handleChange(table, payload) {
  const eventType = payload.eventType;
  console.log(`[Realtime] ${eventType} on ${table}`);

  const event = {
    table,
    eventType,
    newRecord: payload.new,
    oldRecord: payload.old,
    timestamp: Date.now()
  };

  changeListeners.forEach((cb) => {
    try { cb(event); } catch (e) { console.warn("[Realtime] Listener error:", e); }
  });

  try {
    window.dispatchEvent(new CustomEvent("ds:content-change", { detail: event }));
  } catch (e) {}
}

function notifyStatus(status) {
  statusListeners.forEach((cb) => {
    try { cb(status); } catch (e) {}
  });

  try {
    window.dispatchEvent(new CustomEvent("ds:realtime-status", { detail: status }));
  } catch (e) {}
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    console.log("[Realtime] 🔄 Reconnecting...");
    if (channel) {
      try { supabase.removeChannel(channel); } catch (e) {}
      channel = null;
    }
    initRealtime();
  }, 5000);
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => { stopRealtime(); });
}

console.log("[Realtime] Service loaded");