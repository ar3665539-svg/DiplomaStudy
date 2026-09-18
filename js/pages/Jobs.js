/**
 * Jobs — Job/Internship listings (placeholder for now)
 */

import { AppShell } from "../components/AppShell.js";
import { emptyState } from "../utils/errorState.js";

export function renderJobs() {
  AppShell.updateHeader({
    title: "Jobs & Internships",
    subtitle: "Career opportunities",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="padding:20px;background:linear-gradient(135deg, #163524 0%, #1F4A32 100%);border-radius:20px;margin-bottom:20px;color:#FFFFFF;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30px;right:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(200,122,30,0.2),transparent 70%);"></div>
      <div style="position:relative;">
        <div style="font-size:36px;margin-bottom:10px;">💼</div>
        <div style="font-size:20px;font-weight:900;letter-spacing:-0.3px;margin-bottom:6px;">Career Hub</div>
        <div style="font-size:12.5px;opacity:0.85;font-weight:600;line-height:1.5;">নতুন job ও internship opportunity এখানে আসবে।</div>
      </div>
    </div>

    ${emptyState({
      icon: "🚧",
      title: "Coming Soon",
      message: "Jobs & Internships feature শীঘ্রই যুক্ত করা হবে। Admin Panel থেকে job listing যোগ করা যাবে।"
    })}

    <div style="padding:16px;background:#F8FBF8;border:1.5px dashed #E1E8E1;border-radius:16px;margin-top:16px;">
      <div style="font-size:12px;font-weight:800;color:#1C3E2C;margin-bottom:8px;">🎯 যা যা আসবে</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:#57675D;font-weight:600;line-height:1.5;">
        <div>✓ Job listing by department</div>
        <div>✓ Internship opportunities</div>
        <div>✓ Apply link / contact</div>
        <div>✓ Deadline reminder</div>
        <div>✓ Save job feature</div>
      </div>
    </div>

    <div style="height:20px;"></div>
  `;
}