/**
 * DiplomaStudy - AI Study Assistant Service
 * Works in DEMO MODE without any API key or external dependency.
 * Provides thoughtful engineering tutoring, formula breakdowns, and exam tips in Bangla & English.
 * Has a safe future API hook for optional Gemini API endpoints.
 */

import { storage } from "../../core/storage.js";

const AI_STORAGE_KEY = "diplomastudy_ai_chat";

export const aiService = {
  getChatHistory() {
    return storage.get(AI_STORAGE_KEY, [
      {
        role: "assistant",
        text: "আসসালামু আলাইকুম! আমি DiplomaStudy AI Assistant 🎓। ডিপ্লোমা ইঞ্জিনিয়ারিংয়ের যেকোনো বিষয়, সূত্র, থিওরি কিংবা পরীক্ষার সাজেশন নিয়ে আমাকে প্রশ্ন করতে পারেন। নিচে দেওয়া সাজেস্টেড প্রম্পটগুলোতে ট্যাপ করতে পারেন!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  },

  saveChatHistory(history) {
    storage.set(AI_STORAGE_KEY, history);
  },

  clearChatHistory() {
    storage.remove(AI_STORAGE_KEY);
  },

  async askQuestion(questionText) {
    const q = questionText.toLowerCase().trim();

    // 1. Check for local intelligent matching (Demo Mode)
    let response = "";

    if (q.includes("ohm") || q.includes("ওহম")) {
      response = `⚡ **Ohm's Law (ওহমের সূত্র):**\n\n- **বিবৃতি:** নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহ (I) ঐ পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের (V) সমানুপাতিক।\n- **সূত্র:** V = I × R (যেখানে V = ভোল্টেজ, I = কারেন্ট, R = রোধ)।\n- **সীমাবদ্ধতা:** এটি শুধুমাত্র অহমিক পরিবাহীতে সত্য। ডায়োড, ট্রানজিস্টর বা নন-লিনিয়ার ডিভাইসে ওহমের সূত্র প্রযোজ্য নয়।\n- **বোর্ড টিপ:** BTEB পরীক্ষায় প্রায়ই V-I গ্রাফ ও নির্দিষ্ট রোধের গাণিতিক সমস্যা আসে।`;
    } else if (q.includes("cramer") || q.includes("ক্রেমার") || q.includes("ম্যাট্রিক্স") || q.includes("matrix")) {
      response = `📐 **ক্রেমারের নিয়ম (Cramer's Rule for Linear Systems):**\n\n- ক্রেমারের নিয়ম মূলত নির্ণায়ক (Determinant) ব্যবহার করে একাধিক অজ্ঞাত চলক বিশিষ্ট সমীকরণ সমাধানের পদ্ধতি।\n- চলক নির্ণয়ের সূত্র:\n  • x = Dx / D\n  • y = Dy / D\n  • z = Dz / D\n- **শর্ত:** মূল নির্ণায়ক D অবশ্যই শূন্য হওয়া যাবে না (D ≠ 0)। যদি D = 0 হয় তবে এই পদ্ধতিতে সমাধান সম্ভব নয়।\n- **পরীক্ষার জন্য গুরুত্বপূর্ণ:** ম্যাথমেটিক্স-১ এর ১ম অধ্যায়ের ২য় ও ৩য় ক্রমের ক্রেমারের অংক প্রতি বছর প্রায় নিশ্চিত আসে।`;
    } else if (q.includes("c programming") || q.includes("prime") || q.includes("মৌলিক") || q.includes("লুপ") || q.includes("loop")) {
      response = `💻 **C Programming - মৌলিক সংখ্যা ও লুপ টেকনিক:**\n\n- কোনো সংখ্যা N মৌলিক কি না তা যাচাই করতে ২ থেকে শুরু করে √N পর্যন্ত ভাগ করে দেখতে হয়।\n- যদি কোনো সংখ্যা দিয়ে বিভাজ্য হয়, তবে সংখ্যাটি মৌলিক নয় (isPrime = 0)।\n- **For Loop স্ট্রাকচার:**\n\`\`\`c\nfor (i = 2; i * i <= n; i++) {\n    if (n % i == 0) { isPrime = 0; break; }\n}\n\`\`\`\n- এটি O(√n) সময়ের মধ্যে ফলাফল দেয়, যা পরীক্ষায় পূর্ণ নম্বর পাওয়ার জন্য সবচেয়ে কার্যকর অ্যালগরিদম।`;
    } else if (q.includes("sfd") || q.includes("bmd") || q.includes("পীড়ন") || q.includes("stress") || q.includes("civil")) {
      response = `🏗️ **Structural Mechanics - SFD & BMD টিপস:**\n\n1. **Point of Contraflexure:** যে বিন্দুতে বিমের বেন্ডিং মোমেন্ট চিহ্ন পরিবর্তন করে (ধনাত্মক থেকে ঋণাত্মক বা বিপরীত) এবং মোমেন্টের মান শূন্য হয়, তাকে ইনফ্লেকশন পয়েন্ট বা পয়েন্ট অব কন্ট্রাফ্লেক্সার বলে।\n2. **SFD ও BMD সম্পর্ক:** dM/dx = V (শিয়ার ফোর্সের মান যেখানে শূন্য, সেখানে বেন্ডিং মোমেন্ট সর্বোচ্চ বা সর্বনিম্ন হয়)।\n3. সিম্পলি সাপোর্টেড বিমে UDL থাকলে SFD হবে হেলানো সরলরেখা এবং BMD হবে প্যারাবলিক কার্ভ।`;
    } else if (q.includes("mcq") || q.includes("question") || q.includes("প্রশ্ন")) {
      response = `📝 **পরীক্ষার গুরুত্বপূর্ণ নমুনা MCQ:**\n\n**প্রশ্ন:** কার্শফের কারেন্ট সূত্র (KCL) কোন রাশির সংরক্ষণশীলতা নির্দেশ করে?\n**ক)** শক্তি\n**খ)** চার্জ\n**গ)** ভরবেগ\n**ঘ)** ভর\n\n✅ **সঠিক উত্তর:** খ) চার্জ (Electric Charge)\n**ব্যাখ্যা:** কোনো নোডে আগত কারেন্টের সমষ্টি ও নির্গত কারেন্টের সমষ্টি সমান হয়, কারণ বৈদ্যুতিক চার্জ কোনো বিন্দুতে সঞ্চিত বা বিনষ্ট হতে পারে না।`;
    } else if (q.includes("bangla") || q.includes("বাংলা")) {
      response = `🇧🇩 **সহজ বাংলায় অধ্যয়ন পরামর্শ:**\n\nডিপ্লোমা ইন ইঞ্জিনিয়ারিং পরীক্ষায় ভালো ফলাফল করতে হলে:\n১. প্রতিদিন প্রতিটি বিষয়ের মূল সংজ্ঞা ও সূত্রগুলো একটি আলাদা খাতায় নোট করে রাখুন।\n২. বিগত ৩-৪ বছরের BTEB বোর্ড ফাইনাল প্রশ্ন বিশ্লেষণ করে গুরুত্বপূর্ণ প্রশ্নগুলো আগে সমাধান করুন।\n৩. ব্যবহারিক ল্যাব এক্সপেরিমেন্টগুলোর সার্কিট ডায়াগ্রাম ও ওয়ার্কিং প্রিন্সিপাল ভালোভাবে আঁকতে শিখুন।`;
    } else {
      response = `🎓 **DiplomaStudy স্টাডি পরামর্শ:**\n\nআপনার প্রশ্ন: "${questionText}"\n\n- **মূল ধারণা:** ডিপ্লোমা প্রকৌশলে প্রতিটি তাত্ত্বিক বিষয়ের সাথে ব্যবহারিক প্রয়োগের সরাসরি সংযোগ থাকে। গাণিতিক সমস্যা সমাধানের সময় সবসময় এস.আই (SI) একক উল্লেখ করবেন।\n- **পরীক্ষার প্রস্তুতি:**\n  ১. বিষয়ের সূত্রগুলো আগে মুখস্থ করুন।\n  ২. অধ্যায়ের প্রশ্নব্যাংক থেকে MCQ এবং সংক্ষিপ্ত প্রশ্নগুলো রিভিশন দিন।\n  ৩. আমাদের অ্যাপের "Quiz" সেকশন থেকে প্রতিদিন ৫ মিনিটের প্র্যাকটিস টেস্ট দিন।\n\nঅন্য কোনো সুনির্দিষ্ট টপিক (যেমন ওহমের সূত্র, ম্যাট্রিক্স, সি প্রোগ্রামিং ইত্যাদি) বিস্তারিত জানতে চাইলে লিখে পাঠান!`;
    }

    // Return response with a small natural async typing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          role: "assistant",
          text: response,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }, 350);
    });
  }
};
