/**
 * DiplomaStudy - Home Page
 * আগের সব design + নতুন Department Dropdown
 */

import { AppShell } from "../components/AppShell.js";
import { DepartmentDropdown } from "../components/DepartmentDropdown.js";
import { getDepartmentById } from "../../data/departments.js";
import { civilSubjects } from "../../data/civilSubjects.js";
import { comingSoonFeatures } from "../../data/comingSoonFeatures.js";
import { router } from "../core/router.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";

export function renderHome() {
  AppShell.updateHeader({ showBack: false });

  const main = AppShell.getMainView();
  if (!main) return;

  // User info
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const userName = settings.userName || "Student";
  const currentDeptId = settings.department || "civil";
  const currentDept = getDepartmentById(currentDeptId);

  // Greeting
  const hour = new Date().getHours();
  let greeting = "শুভ সকাল";
  let greetingEmoji = "🌅";
  if (hour >= 12 && hour < 17) { greeting = "শুভ দুপুর"; greetingEmoji = "☀️"; }
  else if (hour >= 17 && hour < 20) { greeting = "শুভ সন্ধ্যা"; greetingEmoji = "🌆"; }
  else if (hour >= 20 || hour < 5) { greeting = "শুভ রাত্রি"; greetingEmoji = "🌙"; }

  // Tips
  const tips = [
    { bn: "প্রতিদিন ৩০ মিনিট পড়ুন — ধারাবাহিকতাই আসল শক্তি।" },
    { bn: "নতুন টপিকের আগে আগেরগুলো রিভিশন দিন।" },
    { bn: "বোর্ড প্রশ্ন সমাধান করলে প্যাটার্ন বুঝবেন।" },
    { bn: "প্রতি ২৫ মিনিটে ছোট বিরতি নিন।" },
    { bn: "সূত্র ৩ বার লিখলে মুখস্থ হয়ে যাবে।" }
  ];
  const todayTip = tips[new Date().getDate() % tips.length];

  main.innerHTML = `
    <!-- ═══════════════════════════════════
         HERO BANNER
         ═══════════════════════════════════ -->
    <div class="home-hero">
      <div class="home-hero-bg-pattern"></div>
      
      <div class="home-hero-content">
        <div class="home-greeting">
          <span class="home-greeting-emoji">${greetingEmoji}</span>
          <span class="home-greeting-text">${greeting}, ${userName}!</span>
        </div>
        
        <div class="home-hero-title-box">
          <div class="home-hero-icon">${currentDept.icon}</div>
          <div>
            <h1 class="home-hero-title">${currentDept.name}</h1>
            <p class="home-hero-subtitle">Diploma in Engineering</p>
          </div>
        </div>
        
        <div class="home-hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-value">${civilSubjects.length}</span>
            <span class="hero-stat-label">Subjects</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <span class="hero-stat-value">BTEB</span>
            <span class="hero-stat-label">Curriculum</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <span class="hero-stat-value">2026</span>
            <span class="hero-stat-label">Session</span>
          </div>
        </div>
        
        <button class="hero-cta-btn" id="hero-continue-btn">
          <span>📖 শেখা শুরু করুন</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         🆕 DEPARTMENT DROPDOWN (নতুন)
         ═══════════════════════════════════ -->
    <div id="dept-dropdown-slot"></div>

    <!-- ═══════════════════════════════════
         DAILY TIP CARD
         ═══════════════════════════════════ -->
    <div class="daily-tip-card">
      <div class="tip-icon-box">💡</div>
      <div class="tip-content">
        <span class="tip-label">আজকের টিপস</span>
        <p class="tip-text">${todayTip.bn}</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         SUBJECTS SECTION
         ═══════════════════════════════════ -->
    <div class="home-section-header">
      <div class="home-section-title-box">
        <span class="home-section-icon">📚</span>
        <h2 class="home-section-title">Your Subjects</h2>
      </div>
      <span class="home-section-count">${civilSubjects.length}টি বিষয়</span>
    </div>

    <div class="subject-cards-grid" id="home-subject-grid">
      ${civilSubjects.map((sub, idx) => `
        <div 
          class="subject-card-pro" 
          data-subject-id="${sub.id}"
          role="button"
          tabindex="0"
          aria-label="${sub.name}"
        >
          <div class="subj-pro-glow"></div>
          <div class="subj-pro-header">
            <div class="subj-pro-icon">${sub.icon}</div>
            <span class="subj-pro-code">${sub.code}</span>
          </div>
          
          <div class="subj-pro-body">
            <h3 class="subj-pro-name">${sub.name}</h3>
            <p class="subj-pro-bangla">${sub.banglaName}</p>
          </div>
          
          <div class="subj-pro-footer">
            <div class="subj-pro-badges">
              <span class="pro-badge">${sub.type}</span>
              <span class="pro-badge pro-badge-credits">${sub.credits} cr</span>
            </div>
            <div class="subj-pro-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          
          <div class="subj-pro-tap-hint">ট্যাপ করুন</div>
        </div>
      `).join("")}
    </div>

    <!-- ═══════════════════════════════════
         QUICK ACCESS
         ═══════════════════════════════════ -->
    <div class="home-section-header">
      <div class="home-section-title-box">
        <span class="home-section-icon">⚡</span>
        <h2 class="home-section-title">Quick Access</h2>
      </div>
    </div>

    <div class="quick-access-grid">
      ${[
        { icon: "📝", label: "Notes", bangla: "নোটস" },
        { icon: "⭐", label: "Saved", bangla: "সেভড" },
        { icon: "🎯", label: "Quiz", bangla: "কুইজ" },
        { icon: "📄", label: "PDFs", bangla: "পিডিএফ" },
        { icon: "🤖", label: "AI Tutor", bangla: "এআই" },
        { icon: "📊", label: "Progress", bangla: "অগ্রগতি" }
      ].map((item) => `
        <div 
          class="quick-access-card" 
          data-coming-soon="${item.label} (${item.bangla})"
          role="button"
          tabindex="0"
        >
          <div class="qa-icon">${item.icon}</div>
          <span class="qa-label">${item.label}</span>
          <span class="qa-bangla">${item.bangla}</span>
          <span class="qa-lock">🔒</span>
        </div>
      `).join("")}
    </div>

    <!-- ═══════════════════════════════════
         COMING SOON SECTION
         ═══════════════════════════════════ -->
    <div class="home-section-header">
      <div class="home-section-title-box">
        <span class="home-section-icon">🔒</span>
        <h2 class="home-section-title">Coming Soon</h2>
      </div>
      <span class="home-section-count">শীঘ্রই আসছে</span>
    </div>

    <div class="coming-soon-list">
      ${comingSoonFeatures.filter(f => ["planner", "jobs", "notices", "tools"].includes(f.id)).map((f) => `
        <div 
          class="cs-list-card" 
          data-coming-soon="${f.title} (${f.banglaTitle})"
          role="button"
          tabindex="0"
        >
          <div class="cs-list-icon">${f.icon}</div>
          <div class="cs-list-body">
            <h4 class="cs-list-title">${f.title}</h4>
            <p class="cs-list-bangla">${f.banglaTitle}</p>
          </div>
          <span class="cs-list-lock">🔒</span>
        </div>
      `).join("")}
      
      <div class="view-all-card" id="home-view-all-features">
        <span>সব Feature দেখুন</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         INFO BANNER
         ═══════════════════════════════════ -->
    <div class="home-info-banner">
      <div class="hib-icon">🚀</div>
      <div class="hib-body">
        <h4 class="hib-title">Content Coming Soon</h4>
        <p class="hib-text">সব বিষয়ের chapter, প্রশ্ন, সাজেশন ও PDF server থেকে যুক্ত করা হবে।</p>
      </div>
    </div>

    <div style="height: 20px;"></div>
  `;

  // ═══════════════════════════════════════════
  // RENDER DEPARTMENT DROPDOWN
  // ═══════════════════════════════════════════
  const dropdownSlot = main.querySelector("#dept-dropdown-slot");
  if (dropdownSlot) {
    dropdownSlot.innerHTML = DepartmentDropdown.render(currentDeptId);
    DepartmentDropdown.bindEvents(dropdownSlot, (deptId) => {
      const dept = getDepartmentById(deptId);
      if (!dept) return;

      const newSettings = storage.get(STORAGE_KEYS.SETTINGS, {});
      newSettings.department = deptId;
      storage.set(STORAGE_KEYS.SETTINGS, newSettings);

      if (dept.hasPdf) {
        router.navigate(`#/dept-pdf?deptId=${deptId}`);
      } else {
        showComingSoon(`${dept.banglaName} এর PDF`);
      }
    });
  }

  // Hero CTA
  main.querySelector("#hero-continue-btn")?.addEventListener("click", () => {
    router.navigate("#/subjects");
  });

  // Subject cards
  main.querySelectorAll(".subject-card-pro").forEach((card) => {
    const navigate = () => {
      const id = card.getAttribute("data-subject-id");
      if (id) router.navigate(`#/subject?subjectId=${id}`);
    };
    card.addEventListener("click", navigate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate();
      }
    });
  });

  // Coming soon cards
  main.querySelectorAll("[data-coming-soon]").forEach((card) => {
    const handle = () => {
      const name = card.getAttribute("data-coming-soon");
      showComingSoon(name);
    };
    card.addEventListener("click", handle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handle();
      }
    });
  });

  // View all features
  main.querySelector("#home-view-all-features")?.addEventListener("click", () => {
    router.navigate("#/more");
  });
}