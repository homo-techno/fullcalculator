import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passwordStrengthCalculator: CalculatorDefinition = {
  slug: "password-strength-calculator",
  title: "Password Strength Calculator",
  description: "Free password strength calculator. Analyze password entropy and estimate crack time based on length and character types.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["password strength", "password calculator", "password entropy", "how strong is my password", "password checker"],
  variants: [
    {
      id: "byLength",
      name: "Estimate by Composition",
      fields: [
        { name: "length", label: "Password Length", type: "number", placeholder: "e.g. 12" },
        { name: "charset", label: "Character Types Used", type: "select", options: [
          { label: "Lowercase only (26)", value: "26" },
          { label: "Lower + Upper (52)", value: "52" },
          { label: "Lower + Upper + Digits (62)", value: "62" },
          { label: "All + Symbols (95)", value: "95" },
        ]},
      ],
      calculate: (inputs) => {
        const len = inputs.length as number;
        const pool = parseInt((inputs.charset as string) || "62");
        if (!len) return null;
        const entropy = len * Math.log2(pool);
        const combinations = Math.pow(pool, len);
        const guessesPerSec = 1e10;
        const seconds = combinations / guessesPerSec / 2;
        let crackTime: string;
        if (seconds < 1) crackTime = "Instantly";
        else if (seconds < 60) crackTime = `${formatNumber(seconds, 1)} seconds`;
        else if (seconds < 3600) crackTime = `${formatNumber(seconds / 60, 1)} minutes`;
        else if (seconds < 86400) crackTime = `${formatNumber(seconds / 3600, 1)} hours`;
        else if (seconds < 31536000) crackTime = `${formatNumber(seconds / 86400, 1)} days`;
        else if (seconds < 31536000 * 1000) crackTime = `${formatNumber(seconds / 31536000, 1)} years`;
        else if (seconds < 31536000 * 1e6) crackTime = `${formatNumber(seconds / 31536000, 0)} years`;
        else crackTime = `${formatNumber(seconds / 31536000, 0)} years`;
        let strength = "Very Weak";
        if (entropy >= 80) strength = "Very Strong";
        else if (entropy >= 60) strength = "Strong";
        else if (entropy >= 40) strength = "Moderate";
        else if (entropy >= 28) strength = "Weak";
        return {
          primary: { label: "Strength", value: strength },
          details: [
            { label: "Entropy", value: `${formatNumber(entropy, 1)} bits` },
            { label: "Character pool", value: String(pool) },
            { label: "Combinations", value: entropy > 100 ? `2^${formatNumber(entropy, 0)}` : formatNumber(combinations, 0) },
            { label: "Crack time (10B/sec)", value: crackTime },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["random-number-generator", "binary-hex-calculator", "probability-calculator"],
  faq: [{ question: "How long should my password be?", answer: "Use at least 12 characters with mixed types (upper, lower, digits, symbols). A 12-character password with all types has ~79 bits of entropy. 16+ characters is recommended for high-security accounts." }],
  formula: "Entropy = Length × log₂(Pool Size) bits",
};
