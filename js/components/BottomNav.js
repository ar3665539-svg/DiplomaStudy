/**
 * BottomNav v5 - AI FAB with animated purple rings + "AI Assistant" label
 */

function injectNavStyles() {
  if (document.getElementById("ds-nav-override-v7")) return;
  var style = document.createElement("style");
  style.id = "ds-nav-override-v7";
  style.textContent = [
    "/* Reset */",
    "#bottom-nav, #bottom-nav * { box-sizing: border-box; }",
    "#bottom-nav { overflow: visible !important; }",
    "#bottom-nav .bottom-nav-inner { overflow: visible !important; }",
    "#bottom-nav .nav-item { -webkit-tap-highlight-color: transparent; }",
    "#bottom-nav .ds-ai-fab { -webkit-tap-highlight-color: transparent; }",

    "/* Ripple for regular items */",
    "@keyframes dsRipple { to { transform: scale(2.5); opacity: 0; } }",

    "/* AI Fab ring animations - ALWAYS RUNNING */",
    "@keyframes dsAIRing {",
    "  0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.75; }",
    "  70%  { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }",
    "  100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }",
    "}",
    "@keyframes dsAIRingDelay {",
    "  0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }",
    "  70%  { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }",
    "  100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }",
    "}",
    "@keyframes dsAIGlow {",
    "  0%, 100% { box-shadow: 0 10px 28px rgba(124,58,237,0.45), inset 0 0 0 0 rgba(255,255,255,0.2); }",
    "  50%      { box-shadow: 0 10px 36px rgba(124,58,237,0.7), inset 0 0 0 3px rgba(255,255,255,0.15); }",
    "}",
    "@keyframes dsAIIconSpin {",
    "  0%   { transform: rotate(0deg) scale(1); }",
    "  50%  { transform: rotate(8deg) scale(1.08); }",
    "  100% { transform: rotate(0deg) scale(1); }",
    "}",

    "/* AI FAB container */",
    "#bottom-nav .ds-ai-fab {",
    "  position: absolute;",
    "  top: -34px;",
    "  left: 50%;",
    "  transform: translateX(-50%);",
    "  z-index: 100;",
    "  display: flex;",
    "  flex-direction: column;",
    "  align-items: center;",
    "  gap: 4px;",
    "  text-decoration: none;",
    "  pointer-events: auto;",
    "}",

    "/* Outer ring wrapper - holds the animated rings */",
    "#bottom-nav .ds-ai-fab-ring-wrap {",
    "  position: relative;",
    "  width: 62px;",
    "  height: 62px;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "}",

    "/* Animated expanding rings */",
    "#bottom-nav .ds-ai-fab-ring {",
    "  position: absolute;",
    "  top: 50%;",
    "  left: 50%;",
    "  width: 58px;",
    "  height: 58px;",
    "  border-radius: 50%;",
    "  border: 2px solid #A855F7;",
    "  pointer-events: none;",
    "  animation: dsAIRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
    "}",

    "#bottom-nav .ds-ai-fab-ring.ring-2 {",
    "  border-color: #C084FC;",
    "  animation: dsAIRingDelay 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
    "  animation-delay: 1.2s;",
    "}",

    "/* Main circle */",
    "#bottom-nav .ds-ai-fab-circle {",
    "  position: relative;",
    "  width: 58px;",
    "  height: 58px;",
    "  min-width: 58px;",
    "  min-height: 58px;",
    "  max-width: 58px;",
    "  max-height: 58px;",
    "  aspect-ratio: 1 / 1;",
    "  border-radius: 50%;",
    "  background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 45%, #A855F7 100%);",
    "  color: #FFFFFF;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  flex-shrink: 0;",
    "  box-shadow:",
    "    0 10px 28px rgba(124,58,237,0.45),",
    "    0 0 0 4px var(--color-bg, #F7F5EF);",
    "  animation: dsAIGlow 2.6s ease-in-out infinite;",
    "  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);",
    "  border: none;",
    "  outline: none;",
    "  overflow: hidden;",
    "  padding: 0;",
    "  z-index: 2;",
    "}",

    "#bottom-nav .ds-ai-fab-circle svg {",
    "  width: 28px;",
    "  height: 28px;",
    "  display: block;",
    "  flex-shrink: 0;",
    "  animation: dsAIIconSpin 3.6s ease-in-out infinite;",
    "  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));",
    "}",

    "/* Inner highlight for 3D effect */",
    "#bottom-nav .ds-ai-fab-circle::before {",
    "  content: '';",
    "  position: absolute;",
    "  top: 4px;",
    "  left: 6px;",
    "  right: 6px;",
    "  height: 40%;",
    "  border-radius: 50%;",
    "  background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%);",
    "  pointer-events: none;",
    "}",

    "/* Press state */",
    "#bottom-nav .ds-ai-fab:active .ds-ai-fab-circle {",
    "  transform: scale(0.92);",
    "}",

    "#bottom-nav .ds-ai-fab:active .ds-ai-fab-ring {",
    "  animation-play-state: paused;",
    "}",

    "/* Label */",
    "#bottom-nav .ds-ai-fab-label {",
    "  font-size: 10px;",
    "  font-weight: 800;",
    "  color: #7C3AED;",
    "  line-height: 1;",
    "  letter-spacing: 0.2px;",
    "  white-space: nowrap;",
    "  text-shadow: 0 1px 2px rgba(255,255,255,0.5);",
    "}",

    "/* Active state - bigger glow */",
    "#bottom-nav .ds-ai-fab.is-active .ds-ai-fab-label {",
    "  color: #6D28D9;",
    "}",

    "#bottom-nav .ds-ai-fab.is-active .ds-ai-fab-ring {",
    "  animation-duration: 1.8s;",
    "}",

    "/* Dark mode adjustments */",
    "[data-theme='dark'] #bottom-nav .ds-ai-fab-circle {",
    "  background: linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #C084FC 100%);",
    "  box-shadow:",
    "    0 10px 28px rgba(168,85,247,0.6),",
    "    0 0 0 4px var(--color-bg, #101712);",
    "}",

    "[data-theme='dark'] #bottom-nav .ds-ai-fab-label {",
    "  color: #C084FC;",
    "  text-shadow: none;",
    "}",

    "[data-theme='dark'] #bottom-nav .ds-ai-fab-ring {",
    "  border-color: #9333EA;",
    "}",

    "[data-theme='dark'] #bottom-nav .ds-ai-fab-ring.ring-2 {",
    "  border-color: #C084FC;",
    "}",

    "/* Desktop hover */",
    "@media (min-width: 481px) {",
    "  #bottom-nav .ds-ai-fab:hover .ds-ai-fab-circle {",
    "    transform: translateY(-3px) scale(1.05);",
    "  }",
    "}",

    "/* Regular nav item hover */",
    "#bottom-nav .nav-item:not(.ds-ai-fab):hover .nav-item-icon {",
    "  background: rgba(28, 62, 44, 0.06);",
    "}"
  ].join("\n");
  document.head.appendChild(style);
}

var ICO_HOME  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
var ICO_STUDY = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
var ICO_AI    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>';
var ICO_SAVED = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
var ICO_MORE  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>';

export var BottomNav = {
  items: [
    { id: "home",  label: "Home",  icon: ICO_HOME,  route: "#/home" },
    { id: "study", label: "Study", icon: ICO_STUDY, route: "#/subjects" },
    { id: "saved", label: "Saved", icon: ICO_SAVED, route: "#/bookmarks" },
    { id: "more",  label: "More",  icon: ICO_MORE,  route: "#/more" }
  ],

  render: function () {
    injectNavStyles();

    var navStyle = [
      "position:fixed",
      "bottom:0",
      "left:0",
      "right:0",
      "width:100%",
      "height:auto",
      "z-index:50",
      "background:var(--color-surface, #FFFFFF)",
      "border-top:1px solid var(--color-border, #E1E8E1)",
      "box-shadow:0 -6px 24px rgba(28,62,44,0.08)",
      "padding-bottom:env(safe-area-inset-bottom, 0px)",
      "display:block",
      "margin:0",
      "font-family:inherit",
      "border-radius:22px 22px 0 0",
      "overflow:visible"
    ].join(";");

    var innerStyle = [
      "display:grid",
      "grid-template-columns:repeat(5, 1fr)",
      "height:68px",
      "max-width:680px",
      "margin:0 auto",
      "padding:0 6px",
      "align-items:stretch",
      "width:100%",
      "position:relative",
      "overflow:visible"
    ].join(";");

    var homeItem  = this.renderItem(this.items[0]);
    var studyItem = this.renderItem(this.items[1]);
    var savedItem = this.renderItem(this.items[2]);
    var moreItem  = this.renderItem(this.items[3]);

    var fabHtml = [
      '<a class="ds-ai-fab" id="ds-ai-fab" data-route="#/ai" href="#/ai" aria-label="AI Assistant">',
        '<div class="ds-ai-fab-ring-wrap">',
          '<span class="ds-ai-fab-ring"></span>',
          '<span class="ds-ai-fab-ring ring-2"></span>',
          '<div class="ds-ai-fab-circle">' + ICO_AI + '</div>',
        '</div>',
        '<span class="ds-ai-fab-label">AI Assistant</span>',
      '</a>'
    ].join("");

    return [
      '<nav class="bottom-nav" id="bottom-nav" style="' + navStyle + '">',
        '<div class="bottom-nav-inner" style="' + innerStyle + '">',
          homeItem,
          studyItem,
          '<div class="nav-slot-center" aria-hidden="true"></div>',
          savedItem,
          moreItem,
        '</div>',
        fabHtml,
      '</nav>'
    ].join("");
  },

  renderItem: function (item) {
    var itemStyle = [
      "position:relative",
      "display:flex",
      "flex-direction:column",
      "align-items:center",
      "justify-content:center",
      "gap:4px",
      "padding:8px 2px",
      "background:transparent",
      "border:none",
      "cursor:pointer",
      "color:#84968B",
      "text-decoration:none",
      "font-family:inherit",
      "transition:color 0.2s ease",
      "overflow:visible",
      "border-radius:12px"
    ].join(";");

    var iconWrapperStyle = [
      "position:relative",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "width:40px",
      "height:28px",
      "border-radius:10px",
      "transition:background 0.2s ease"
    ].join(";");

    var labelStyle = [
      "display:block",
      "font-size:10px",
      "font-weight:700",
      "line-height:1",
      "letter-spacing:0.1px",
      "text-align:center",
      "color:inherit"
    ].join(";");

    return '<a class="nav-item" data-nav-id="' + item.id + '" data-route="' + item.route + '" href="' + item.route + '" aria-label="' + item.label + '" style="' + itemStyle + '">' +
      '<div class="nav-item-icon" style="' + iconWrapperStyle + '">' + item.icon + '</div>' +
      '<span class="nav-item-label" style="' + labelStyle + '">' + item.label + '</span>' +
    '</a>';
  },

  bindEvents: function () {
    var nav = document.getElementById("bottom-nav");
    if (!nav) return;
    nav.querySelectorAll(".nav-item, .ds-ai-fab").forEach(function (item) {
      item.addEventListener("click", function (e) { createRipple(item, e); });
    });
    this.updateActive();
  },

  updateActive: function () {
    var nav = document.getElementById("bottom-nav");
    if (!nav) return;
    var hash = window.location.hash || "#/home";

    var fab = nav.querySelector("#ds-ai-fab");
    if (fab) {
      if (hash.indexOf("#/ai") === 0) fab.classList.add("is-active");
      else fab.classList.remove("is-active");
    }

    nav.querySelectorAll(".nav-item").forEach(function (item) {
      var route = item.getAttribute("data-route");
      var itemId = item.getAttribute("data-nav-id");
      var iconWrapper = item.querySelector(".nav-item-icon");
      var label = item.querySelector(".nav-item-label");

      var isActive = false;
      if (hash === route) isActive = true;
      else if (itemId === "study" && (hash.indexOf("#/subject") === 0 || hash.indexOf("#/content") === 0 || hash.indexOf("#/chapter") === 0)) isActive = true;
      else if (itemId === "home" && (hash === "" || hash === "#/" || hash === "#/home")) isActive = true;
      else if (itemId === "saved" && (hash.indexOf("#/bookmarks") === 0 || hash.indexOf("#/notes") === 0)) isActive = true;

      item.style.color = "#84968B";
      if (iconWrapper) iconWrapper.style.background = "transparent";

      if (isActive) {
        item.style.color = "#1C3E2C";
        if (iconWrapper) iconWrapper.style.background = "rgba(28, 62, 44, 0.08)";
        if (label) label.style.fontWeight = "800";
      } else {
        if (label) label.style.fontWeight = "700";
      }
    });
  },

  init: function () {
    this.bindEvents();
    var self = this;
    window.addEventListener("hashchange", function () { self.updateActive(); });
  }
};

function createRipple(el, e) {
  try {
    var rect = el.getBoundingClientRect();
    var ripple = document.createElement("span");
    var size = Math.max(rect.width, rect.height) * 1.5;
    var cx = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || (rect.left + rect.width / 2)) - rect.left;
    var cy = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || (rect.top + rect.height / 2)) - rect.top;
    ripple.style.cssText = "position:absolute;left:" + (cx - size / 2) + "px;top:" + (cy - size / 2) + "px;width:" + size + "px;height:" + size + "px;background:radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);border-radius:50%;pointer-events:none;transform:scale(0);opacity:1;animation:dsRipple 0.6s ease-out forwards;";
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 650);
  } catch (err) {}
}