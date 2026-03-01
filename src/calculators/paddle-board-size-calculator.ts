import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paddleBoardSizeCalculator: CalculatorDefinition = {
  slug: "paddle-board-size-calculator",
  title: "Paddle Board Size Calculator",
  description: "Find the right stand-up paddle board size based on your weight, skill level, and intended use.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paddle board size", "SUP sizing", "stand up paddle board"],
  variants: [{
    id: "standard",
    name: "Paddle Board Size",
    description: "Find the right stand-up paddle board size based on your weight, skill level, and intended use",
    fields: [
      { name: "weight", label: "Rider Weight", type: "number", suffix: "lbs", min: 50, max: 400, defaultValue: 175 },
      { name: "skill", label: "Skill Level", type: "select", options: [{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"advanced",label:"Advanced"}], defaultValue: "beginner" },
      { name: "use", label: "Primary Use", type: "select", options: [{value:"allround",label:"All-Around"},{value:"touring",label:"Touring"},{value:"surf",label:"Surfing"},{value:"yoga",label:"Yoga/Fitness"}], defaultValue: "allround" },
    ],
    calculate: (inputs) => {
      const weight = inputs.weight as number;
      const skill = inputs.skill as string;
      const use = inputs.use as string;
      if (!weight) return null;
      const volumeMultiplier = skill === "beginner" ? 2.0 : skill === "intermediate" ? 1.5 : 1.2;
      const volume = Math.round(weight * 0.453592 * volumeMultiplier);
      const lengthMap: Record<string, string> = { allround: "10 ft 6 in", touring: "12 ft 6 in", surf: "9 ft 0 in", yoga: "10 ft 8 in" };
      const widthMap: Record<string, string> = { allround: "32 in", touring: "30 in", surf: "29 in", yoga: "34 in" };
      const boardLength = lengthMap[use] || "10 ft 6 in";
      const boardWidth = widthMap[use] || "32 in";
      return {
        primary: { label: "Recommended Volume", value: volume + " liters" },
        details: [
          { label: "Board Length", value: boardLength },
          { label: "Board Width", value: boardWidth },
          { label: "Rider Weight", value: formatNumber(weight) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["skateboard-size-calculator", "rock-climbing-rope-length-calculator"],
  faq: [
    { question: "How do I choose a paddle board size?", answer: "Your board volume in liters should be about 1.2 to 2.0 times your body weight in kilograms, depending on skill level." },
    { question: "What width paddle board do I need?", answer: "Beginners should choose boards 32-34 inches wide for stability. Advanced paddlers can use narrower boards for speed." },
  ],
  formula: "Board Volume (L) = Rider Weight (kg) x Skill Multiplier",
};
