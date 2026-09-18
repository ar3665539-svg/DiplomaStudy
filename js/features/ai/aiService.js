/**
 * AI Tutor Feature - Service (placeholder)
 */

export const aiService = {
  isEnabled() {
    return false; // Future: enable when API key set
  },

  async ask(question) {
    if (!this.isEnabled()) {
      throw new Error("AI Tutor এখনো চালু হয়নি");
    }
    return null;
  },

  async explain(text) {
    return this.ask(`Explain: ${text}`);
  },

  async generateQuestions(topic, count = 5) {
    return this.ask(`Generate ${count} MCQs on ${topic}`);
  }
};

export default aiService;