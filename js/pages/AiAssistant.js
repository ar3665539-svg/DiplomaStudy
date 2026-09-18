/**
 * AiAssistant — AI Chat placeholder
 */

import { AppShell } from "../components/AppShell.js";
import { Toast } from "../components/Toast.js";

export function renderAiAssistant() {
  AppShell.updateHeader({
    title: "AI Tutor",
    subtitle: "Study assistant",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `
    <div style="padding:20px;background:linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);border-radius:20px;margin-bottom:20px;color:#FFFFFF;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.15),transparent 70%);"></div>
      <div style="position:relative;">
        <div style="font-size:40px;margin-bottom:10px;">🤖</div>
        <div style="font-size:20px;font-weight:900;letter-spacing:-0.3px;margin-bottom:6px;">AI Study Tutor</div>
        <div style="font-size:12.5px;opacity:0.9;font-weight:600;line-height:1.5;">যেকোনো প্রশ্ন জিজ্ঞেস করুন — AI উত্তর দেবে।</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
      <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#DBEAFE,#BFDBFE);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">💡</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:4px;">প্রশ্নের ব্যাখ্যা</div>
            <div style="font-size:12px;color:#84968B;font-weight:600;line-height:1.5;">কঠিন প্রশ্নের সহজ ব্যাখ্যা নিন</div>
          </div>
        </div>
      </div>

      <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">📝</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:4px;">Practice Question</div>
            <div style="font-size:12px;color:#84968B;font-weight:600;line-height:1.5;">যেকোনো topic থেকে প্রশ্ন তৈরি করুন</div>
          </div>
        </div>
      </div>

      <div style="padding:16px;background:#FFFFFF;border:1.5px solid #E1E8E1;border-radius:16px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">📚</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13.5px;font-weight:800;color:#1C3E2C;margin-bottom:4px;">Study Plan</div>
            <div style="font-size:12px;color:#84968B;font-weight:600;line-height:1.5;">আপনার জন্য custom রুটিন বানান</div>
          </div>
        </div>
      </div>
    </div>

    <div style="padding:20px;background:linear-gradient(135deg, #FFFBEB, #FEF3C7);border:1.5px solid #FCD34D;border-radius:16px;text-align:center;">
      <div style="font-size:40px;margin-bottom:10px;">🚧</div>
      <div style="font-size:14px;font-weight:800;color:#92400E;margin-bottom:6px;">AI Tutor Coming Soon</div>
      <div style="font-size:12px;color:#B45309;line-height:1.55;font-weight:600;">এই feature শীঘ্রই যুক্ত করা হবে। Admin Panel থেকে API key set করলে কাজ শুরু হবে।</div>
    </div>

    <div style="height:20px;"></div>
  `;
}