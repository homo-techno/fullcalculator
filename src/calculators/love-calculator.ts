import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const loveCalculator: CalculatorDefinition = {
  slug: "love-calculator",
  title: "Love Calculator",
  description: "Free love calculator. Enter two names to calculate a fun compatibility score. Purely for entertainment!",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["love calculator", "compatibility calculator", "love meter", "love tester", "name compatibility"],
  variants: [
    {
      id: "calc",
      name: "Calculate Love Compatibility",
      fields: [
        { name: "name1", label: "Your Name", type: "number", placeholder: "Enter your name" },
        { name: "name2", label: "Their Name", type: "number", placeholder: "Enter their name" },
      ],
      calculate: (inputs) => {
        const name1 = String(inputs.name1 || "").trim();
        const name2 = String(inputs.name2 || "").trim();
        if (!name1 || !name2) return null;

        // Calculate score by summing character codes
        const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, "");
        let sum = 0;
        for (let i = 0; i < combined.length; i++) {
          sum += combined.charCodeAt(i);
        }

        // Use name-pair-specific hash for consistent results
        const sorted = [name1.toLowerCase(), name2.toLowerCase()].sort().join("");
        let hash = 0;
        for (let i = 0; i < sorted.length; i++) {
          hash = ((hash << 5) - hash) + sorted.charCodeAt(i);
          hash = hash & hash; // Convert to 32bit integer
        }
        const score = Math.abs(hash % 101); // 0-100

        // Fun messages based on score
        let message: string;
        let rating: string;
        if (score >= 90) {
          message = "A perfect match! The stars are aligned for you two.";
          rating = "Soulmates";
        } else if (score >= 75) {
          message = "Strong connection! You two have great potential together.";
          rating = "Excellent Match";
        } else if (score >= 60) {
          message = "Good compatibility! With effort, this could be something special.";
          rating = "Good Match";
        } else if (score >= 45) {
          message = "There's a spark here. Communication will be key to making it work.";
          rating = "Moderate Match";
        } else if (score >= 30) {
          message = "Opposites attract? You might need to work on finding common ground.";
          rating = "Needs Work";
        } else if (score >= 15) {
          message = "Challenging combination, but great love stories have started with less!";
          rating = "Challenging";
        } else {
          message = "The universe has other plans... but never say never!";
          rating = "Low Match";
        }

        // Fun facts
        const loveLanguages = ["Words of Affirmation", "Acts of Service", "Receiving Gifts", "Quality Time", "Physical Touch"];
        const suggestedLanguage = loveLanguages[score % 5];

        return {
          primary: { label: "Love Score", value: `${score}%` },
          details: [
            { label: "Rating", value: rating },
            { label: "Message", value: message },
            { label: "Names Combined", value: `${name1} + ${name2}` },
            { label: "Suggested Love Language", value: suggestedLanguage },
            { label: "Lucky Number", value: `${(score % 9) + 1}` },
          ],
          note: "This is purely for entertainment! Real compatibility depends on communication, shared values, mutual respect, and effort from both partners.",
        };
      },
    },
  ],
  relatedSlugs: ["numerology-calculator", "age-difference-calculator", "angel-number-calculator"],
  faq: [
    { question: "Is the love calculator accurate?", answer: "No! This is purely for entertainment. Real relationship compatibility depends on communication, shared values, emotional intelligence, and mutual effort — not name-based algorithms." },
    { question: "How does the love calculator work?", answer: "It creates a deterministic score by hashing the combined character codes of both names. The same two names will always produce the same score, regardless of order." },
    { question: "Why do I get the same score when I swap the names?", answer: "The calculator sorts the names alphabetically before hashing, so the order doesn't matter. 'Alice + Bob' gives the same result as 'Bob + Alice'." },
  ],
  formula: "Score = abs(hash(sorted names)) mod 101 — deterministic hash of combined name characters",
};
