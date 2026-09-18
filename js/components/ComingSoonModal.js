/**
 * ComingSoonModal — Modal for "coming soon" features
 */

import { Modal } from "./Modal.js";

export function showComingSoon(featureName = "এই feature") {
  const bodyHtml = `
    <div style="text-align:center;padding:12px 0;">
      <div style="font-size:64px;margin-bottom:14px;">🚧</div>
      <h3 style="font-size:17px;font-weight:900;color:#1C3E2C;margin:0 0 8px;letter-spacing:-0.3px;">
        ${escapeHtml(featureName)} Coming Soon
      </h3>
      <p style="font-size:13px;color:#84968B;line-height:1.6;margin:0 0 8px;font-weight:500;">
        এই feature টা শীঘ্রই যুক্ত করা হবে। Admin Panel থেকে content যোগ হলে সাথে সাথে এখানে দেখা যাবে।
      </p>
      <div style="display:inline-block;padding:6px 12px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:999px;font-size:11px;font-weight:800;color:#92400E;margin-top:8px;">
        ⏳ অপেক্ষা করুন
      </div>
    </div>
  `;

  Modal.show({
    title: "",
    bodyHtml,
    confirmText: "ঠিক আছে",
    showCancel: false,
    onConfirm: () => {}
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}