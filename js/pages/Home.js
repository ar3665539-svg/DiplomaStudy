/**
 * DiplomaStudy - Home Page
 * Supabase থেকে subjects load করে (department + semester অনুযায়ী)
 * Department + Semester পরিবর্তনের Modal সহ
 */

import { AppShell } from "../components/AppShell.js";
import { DepartmentDropdown } from "../components/DepartmentDropdown.js";
import { SelectionModal } from "../components/SelectionModal.js";
import { getDepartmentById } from "../../data/departments.js";
import { comingSoonFeatures } from "../../data/comingSoonFeatures.js";
import { router } from "../core/router.js";
import { showComingSoon } from "../core/comingSoonHelper.js";
import { storage, STORAGE_KEYS } from "../core/storage.js";
import { getSubjects } from "../services/api.js";

export async function renderHome() {
  AppShell.updateHeader({ showBack: false });

  const main = AppShell.getMainView();
  if (!main) return;

  // ─── Show loading ───
  main.innerHTML = `
    <div style="text-align: center; padding: 80px 20px;">
      <div class="spinner"></div>
      <p style="margin-top: 14px; color: #84968B; font-size: 13px; font-weight: 500;">
        Subjects loading...
      </p>
    </div>
  `;

  // ─── Load settings ───
  const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
  const userName = settings.userName || "Student";
  const currentDeptId = settings.department || "civil";
  const currentSemester = settings.semester || 1;

  const currentDept = getDepartmentById(currentDeptId);

  const semesterNames = {
    1: "1st Semester • ১ম পর্ব",
    2: "2nd Semester • ২য় পর্ব",
    3: "3rd Semester • ৩য় পর্ব",
    4: "4th Semester • ৪র্থ পর্ব",
    5: "5th Semester • ৫ম পর্ব",
    6: "6th Semester • ৬ষ্ঠ পর্ব",
    7: "7th Semester • ৭ম পর্ব",
    8: "8th Semester • ৮ম পর্ব"
  };
  const semName = semesterNames[currentSemester] || semesterNames[1];

  // ─── Load subjects from Supabase ───
  let subjects = [];
  try {
    subjects = await getSubjects();
  } catch (err) {
    console.error('[Home] Subjects load failed:', err);
  }

  // ─── Greeting ───
  const hour = new Date().getHours();
  let greeting = "শুভ সকাল";
  let greetingEmoji = "🌅";
  if (hour >= 12 && hour < 17) { greeting = "শুভ দুপুর"; greetingEmoji = "☀️"; }
  else if (hour >= 17 && hour < 20) { greeting = "শুভ সন্ধ্যা"; greetingEmoji = "🌆"; }
  else if (hour >= 20 || hour < 5) { greeting = "শুভ রাত্রি"; greetingEmoji = "🌙"; }

  // ─── Tip ───
  const tips = [
    "প্রতিদিন ৩০ মিনিট পড়ুন — ধারাবাহিকতাই আসল শক্তি।",
    "নতুন টপিকের আগে আগেরগুলো রিভিশন দিন।",
    "বোর্ড প্রশ্ন সমাধান করলে প্যাটার্ন বুঝবেন।",
    "প্রতি ২৫ মিনিটে ছোট বিরতি নিন।",
    "সূত্র ৩ বার লিখলে মুখস্থ হয়ে যাবে।"
  ];
  const todayTip = tips[new Date().getDate() % tips.length];

  // ─── Render ───
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
          <div class="home-hero-title-content">
            <h1 class="home-hero-title">${currentDept.name}</h1>
            <p class="home-hero-subtitle">${semName}</p>
          </div>
          <button class="home-hero-change-btn" id="hero-change-btn" aria-label="Change Department & Semester" title="Change">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 1l4 4-4 4"></path>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <path d="M7 23l-4-4 4-4"></path>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </button>
        </div>
        
        <div class="home-hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-value">${subjects.length}</span>
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
         DEPARTMENT DROPDOWN
         ═══════════════════════════════════ -->
    <div id="dept-dropdown-slot"></div>

    <!-- ═══════════════════════════════════
         DAILY TIP
         ═══════════════════════════════════ -->
    <div class="daily-tip-card">
      <div class="tip-icon-box">💡</div>
      <div class="tip-content">
        <span class="tip-label">আজকের টিপস</span>
        <p class="tip-text">${todayTip}</p>
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
      <span class="home-section-count">${subjects.length}টি বিষয়</span>
    </div>

    ${subjects.length > 0 ? `
      <div class="subject-cards-grid" id="home-subject-grid">
        ${subjects.map((sub) => `
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
    ` : `
      <div class="empty-state" style="margin-top: 20px;">
        <div class="empty-state-icon">📭</div>
        <h2 class="empty-state-title">No Subjects Available</h2>
        <p class="empty-state-desc">
          এই Department + Semester এর subject এখনো যোগ করা হয়নি। উপরে 🔄 বাটন চেপে অন্য Department বা Semester try করুন।
        </p>
      </div>
    `}

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
         COMING SOON
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
        <h4 class="hib-title">Server Connected</h4>
        <p class="hib-text">সব content Supabase থেকে load হচ্ছে। Offline এও কাজ করবে।</p>
      </div>
    </div>

    <div style="height: 20px;"></div>
  `;

  // ═══════════════════════════════════════════
  // Bind Department Dropdown
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

  // ═══════════════════════════════════════════
  // Hero Change Button — Change Department + Semester
  // ═══════════════════════════════════════════
  main.querySelector("#hero-change-btn")?.addEventListener("click", () => {
    SelectionModal.show((newDept, newSem) => {
      console.log("[Home] Changed to:", newDept, newSem);
      // Reload home page with new selection
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  });

  // ═══════════════════════════════════════════
  // Hero CTA
  // ═══════════════════════════════════════════
  main.querySelector("#hero-continue-btn")?.addEventListener("click", () => {
    router.navigate("#/subjects");
  });

  // ═══════════════════════════════════════════
  // Subject Cards
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // Coming Soon Cards
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // View All Features
  // ═══════════════════════════════════════════
  main.querySelector("#home-view-all-features")?.addEventListener("click", () => {
    router.navigate("#/more");
  });
}