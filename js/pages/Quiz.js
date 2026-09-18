/**
 * Quiz — MCQ Practice Mode
 * Random MCQs from all chapters
 */

import { AppShell } from "../components/AppShell.js";
import { getSubjects, getChaptersBySubject, getQuestionsByChapter } from "../services/api.js";
import { emptyState } from "../utils/errorState.js";
import { Toast } from "../components/Toast.js";

let quizState = null;

export async function renderQuiz() {
  AppShell.updateHeader({
    title: "Quiz Mode",
    subtitle: "Test your knowledge",
    showBack: true,
    showSearch: false,
    showTheme: true,
    showSettings: false
  });

  const main = AppShell.getMainView();
  if (!main) return;

  main.innerHTML = `<div style="text-align:center;padding:60px 20px;"><div class="spinner"></div><p style="margin-top:12px;color:#84968B;font-size:13px;">Loading MCQs...</p></div>`;

  // Load all MCQs
  let mcqs = [];
  try {
    const subjects = await getSubjects();
    for (const sub of subjects) {
      const chapters = await getChaptersBySubject(sub.id);
      for (const ch of chapters) {
        const qs = await getQuestionsByChapter(ch.id, "mcq");
        qs.forEach((q) => {
          if (q.options && q.options.length > 0 && q.answer) {
            mcqs.push({ ...q, subjectName: sub.name, chapterName: ch.name });
          }
        });
      }
    }
  } catch (e) {}

  if (mcqs.length === 0) {
    main.innerHTML = emptyState({
      icon: "🎯",
      title: "কোনো MCQ নেই",
      message: "Admin Panel থেকে MCQ যোগ করলে quiz খেলা যাবে।",
      actionFn: () => window.location.hash = "#/home",
      actionLabel: "🏠 Home"
    });
    return;
  }

  // Shuffle + take 10
  const shuffled = [...mcqs].sort(() => Math.random() - 0.5).slice(0, Math.min(10, mcqs.length));

  quizState = {
    questions: shuffled,
    current: 0,
    score: 0,
    answers: [],
    total: shuffled.length
  };

  renderQuestion(main);
}

function renderQuestion(main) {
  const s = quizState;
  if (!s) return;

  if (s.current >= s.total) {
    renderResult(main);
    return;
  }

  const q = s.questions[s.current];
  const progress = Math.round(((s.current) / s.total) * 100);

  main.innerHTML = `
    <div style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#57675D;margin-bottom:8px;">
        <span>প্রশ্ন ${s.current + 1} / ${s.total}</span>
        <span>✅ ${s.score} correct</span>
      </div>
      <div style="height:6px;background:#E8EFE8;border-radius:999px;overflow:hidden;">
        <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#10B981,#059669);border-radius:999px;transition:width 0.4s;"></div>
      </div>
    </div>

    <div style="padding:20px;background:linear-gradient(135deg, rgba(28,62,44,0.06), transparent);border-left:4px solid #1C3E2C;border-radius:16px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:800;color:#84968B;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">${escapeHtml(q.subjectName)} • ${escapeHtml(q.chapterName)}</div>
      <div style="font-size:16px;font-weight:800;color:#1C3E2C;line-height:1.5;">${escapeHtml(q.question)}</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;">
      ${q.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        return `
          <button class="opt-btn" data-opt="${escapeHtml(opt)}" type="button" style="
            display:flex;align-items:center;gap:14px;
            padding:16px;background:#FFFFFF;
            border:1.5px solid #E1E8E1;border-radius:14px;
            cursor:pointer;font-family:inherit;text-align:left;width:100%;
            transition:all 0.2s ease;
          ">
            <div style="width:34px;height:34px;border-radius:10px;background:#F2F5F2;color:#57675D;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;font-family:ui-monospace,monospace;">${letter}</div>
            <span style="flex:1;font-size:14px;font-weight:600;color:#1C3E2C;">${escapeHtml(opt)}</span>
          </button>
        `;
      }).join("")}
    </div>

    <button id="quit-quiz" style="width:100%;margin-top:20px;padding:12px;background:transparent;border:1.5px solid #E1E8E1;color:#57675D;border-radius:12px;font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit;">
      ⏹ Quit Quiz
    </button>
  `;

  main.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-opt");
      const correct = selected === q.answer;

      // Disable all
      main.querySelectorAll(".opt-btn").forEach((b) => {
        b.disabled = true;
        b.style.cursor = "default";
        const optVal = b.getAttribute("data-opt");
        if (optVal === q.answer) {
          b.style.background = "linear-gradient(135deg,#DCFCE7,#BBF7D0)";
          b.style.borderColor = "#10B981";
        } else if (optVal === selected && !correct) {
          b.style.background = "linear-gradient(135deg,#FEE2E2,#FECACA)";
          b.style.borderColor = "#DC2626";
        }
      });

      if (correct) s.score++;
      s.answers.push({ q: q.question, selected, correct: q.answer, isCorrect: correct });

      Toast.show(correct ? "✅ সঠিক!" : "❌ ভুল", correct ? "success" : "error", 1200);

      setTimeout(() => {
        s.current++;
        renderQuestion(main);
      }, 1200);
    });
  });

  main.querySelector("#quit-quiz")?.addEventListener("click", () => {
    if (confirm("Quiz বন্ধ করবেন?")) {
      window.location.hash = "#/home";
    }
  });
}

function renderResult(main) {
  const s = quizState;
  const percent = Math.round((s.score / s.total) * 100);
  const emoji = percent >= 80 ? "🏆" : percent >= 60 ? "🎯" : percent >= 40 ? "💪" : "📚";
  const msg = percent >= 80 ? "অসাধারণ!" : percent >= 60 ? "ভালো করেছ!" : percent >= 40 ? "আরো practice দরকার" : "চালিয়ে যাও!";

  main.innerHTML = `
    <div style="text-align:center;padding:40px 20px;">
      <div style="font-size:80px;margin-bottom:16px;">${emoji}</div>
      <h2 style="font-size:24px;font-weight:900;color:#1C3E2C;margin:0 0 6px;">${msg}</h2>
      <p style="font-size:14px;color:#84968B;font-weight:600;margin:0 0 24px;">${s.total}টির মধ্যে ${s.score}টি সঠিক</p>

      <div style="display:inline-block;padding:20px 32px;background:linear-gradient(135deg,#DCFCE7,#BBF7D0);border-radius:20px;margin-bottom:24px;">
        <div style="font-size:48px;font-weight:900;color:#065F46;line-height:1;">${percent}%</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;max-width:300px;margin:0 auto;">
        <button id="retry-quiz" style="padding:14px;background:linear-gradient(135deg,#1C3E2C,#2A5540);color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 8px 20px -4px rgba(28,62,44,0.4);">
          🔄 আবার খেলুন
        </button>
        <button id="go-home" style="padding:14px;background:#FFFFFF;color:#1C3E2C;border:1.5px solid #E1E8E1;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;">
          🏠 Home
        </button>
      </div>
    </div>

    <div style="margin-top:32px;">
      <div style="font-size:13px;font-weight:800;color:#1C3E2C;margin-bottom:12px;">📝 Review Answers</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${s.answers.map((a, i) => `
          <div style="padding:14px;background:#FFFFFF;border:1.5px solid ${a.isCorrect ? "#10B981" : "#DC2626"};border-radius:14px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:18px;">${a.isCorrect ? "✅" : "❌"}</span>
              <span style="font-size:11px;font-weight:800;color:#84968B;">প্রশ্ন ${i + 1}</span>
            </div>
            <div style="font-size:13px;font-weight:700;color:#1C3E2C;margin-bottom:8px;line-height:1.4;">${escapeHtml(a.q)}</div>
            <div style="font-size:12px;color:#57675D;line-height:1.5;">
              ${!a.isCorrect ? `<div style="margin-bottom:4px;">তোমার উত্তর: <span style="color:#DC2626;font-weight:700;">${escapeHtml(a.selected)}</span></div>` : ""}
              <div>সঠিক উত্তর: <span style="color:#10B981;font-weight:700;">${escapeHtml(a.correct)}</span></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div style="height:20px;"></div>
  `;

  main.querySelector("#retry-quiz")?.addEventListener("click", () => {
    quizState = null;
    renderQuiz();
  });
  main.querySelector("#go-home")?.addEventListener("click", () => {
    quizState = null;
    window.location.hash = "#/home";
  });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}