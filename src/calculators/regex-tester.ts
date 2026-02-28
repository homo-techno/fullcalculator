import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const regexTesterCalculator: CalculatorDefinition = {
  slug: "regex-tester",
  title: "Regex Tester & Cheat Sheet",
  description: "Free regular expression tester with common patterns and a quick reference cheat sheet. Test regex patterns against sample text.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["regex tester online", "regex validator", "regular expression tester"],
  variants: [{
    id: "standard",
    name: "Regex Tester & Cheat Sheet",
    description: "Free regular expression tester with common patterns and a quick reference cheat sheet",
    fields: [
      { name: "charCount", label: "Pattern Length (chars)", type: "number", min: 1, max: 500, defaultValue: 10 },
      { name: "complexity", label: "Complexity", type: "select", options: [{ label: "Simple (literal match)", value: "1" }, { label: "Medium (character classes, quantifiers)", value: "2" }, { label: "Complex (lookahead, groups, backrefs)", value: "3" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const len = inputs.charCount as number;
      const complexity = parseInt(inputs.complexity as string);
      if (!len) return null;
      const common = [
        { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", desc: "Email validation" },
        { pattern: "^\\d{3}-\\d{3}-\\d{4}$", desc: "US Phone (xxx-xxx-xxxx)" },
        { pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$", desc: "Password (8+, uppercase, digit)" },
        { pattern: "^https?://[\\w.-]+\\.[a-z]{2,}(/.*)?$", desc: "URL validation" },
      ];
      return {
        primary: { label: "Common Patterns", value: common.length + " examples" },
        details: common.map(c => ({ label: c.desc, value: c.pattern })),
        note: "Quick reference: . (any char), \\d (digit), \\w (word char), * (0+), + (1+), ? (optional), [] (char class), () (group), ^ (start), $ (end).",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a regular expression?", answer: "A regex is a pattern that describes a set of strings. Used for validation, search/replace, and text extraction in programming." },
    { question: "What does \d+ mean?", answer: "\d matches any digit (0-9). + means one or more. So \d+ matches one or more consecutive digits." },
  ],
  formula: "Regex: pattern matching syntax for text validation and extraction",
};
