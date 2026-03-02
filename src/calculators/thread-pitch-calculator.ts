import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const threadPitchCalculator: CalculatorDefinition = {
  slug: "thread-pitch-calculator",
  title: "Thread Pitch Calculator",
  description: "Calculate thread dimensions from gauge and pitch.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["thread pitch","thread gauge calculator"],
  variants: [{
    id: "standard",
    name: "Thread Pitch",
    description: "Calculate thread dimensions from gauge and pitch.",
    fields: [
      { name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.5 },
      { name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 13 },
    ],
    calculate: (inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      if (!maj || !tpi) return null;
      const pitch = 1 / tpi;
      const pitchDia = Math.round((maj - 0.6495 * pitch) * 10000) / 10000;
      const minorDia = Math.round((maj - 1.299 * pitch) * 10000) / 10000;
      const threadDepth = Math.round((0.6134 * pitch) * 10000) / 10000;
      return {
        primary: { label: "Pitch Diameter", value: formatNumber(pitchDia) + " in" },
        details: [
          { label: "Minor Diameter", value: formatNumber(minorDia) + " in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Depth", value: formatNumber(threadDepth) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the pitch diameter?", answer: "The pitch diameter is where the thread width equals the space between threads." },
    { question: "What is the difference between UNC and UNF?", answer: "UNC is coarse thread with fewer TPI. UNF is fine thread with more TPI." },
  ],
  formula: "Pitch Dia = Major - 0.6495 x Pitch; Minor = Major - 1.299 x Pitch",
};
