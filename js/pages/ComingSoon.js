/**
 * ComingSoon — Placeholder page
 */

import { AppShell } from "../components/AppShell.js";

export function renderComingSoon(params = {}) {
  AppShell.updateHeader({
    title: "Coming Soon",
    subtitle: "শীঘ্রই আসছে",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="text-align:center;padding:60px 24px;background:#FFFFFF;border:1.5px dashed #E1E8E1;border-radius:22px;margin-top:20px;">
      <div style="font-size:72px;margin-bottom:16px;">🚧</div>
      <h2 style="font-size:20px;font-weight:900;color:#1C3E2C;letter-spacing:-0.3px;margin:0 0 8px;">
        Coming Soon
      </h2>
      <p style="font-size:13.5px;color:#84968B;line-height:1.6;max-width:300px;margin:0 auto 20px;">
        এই feature টা শীঘ্রই যুক্ত করা হবে। একটু ধৈর্য ধরুন।
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:24px;">
        <span style="font-size:11px;font-weight:700;padding:6px 12px;background:#F2F5F2;color:#57675D;border-radius:999px;border:1px solid #E1E8E1;">⚡ Faster</span>
        <span style="font-size:11px;font-weight:700;padding:6px 12px;background:#F2F5F2;color:#57675D;border-radius:999px;border:1px solid #E1E8E1;">🎯 Better UX</span>
        <span style="font-size:11px;font-weight:700;padding:6px 12px;background:#F2F5F2;color:#57675D;border-radius:999px;border:1px solid #E1E8E1;">✨ New Features</span>
      </div>

      <button id="cs-home" style="padding:14px 28px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;font-family:inherit;cursor:pointer;box-shadow:0 10px 24px -6px rgba(28,62,44,0.4);">
        🏠 Home এ ফিরুন
      </button>
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelector("#cs-home")?.addEventListener("click", () => {
    window.location.hash = "#/home";
  });
}