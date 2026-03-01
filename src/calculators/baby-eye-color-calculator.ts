import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyEyeColorCalculator: CalculatorDefinition = {
  slug: "baby-eye-color-calculator",
  title: "Baby Eye Color Calculator",
  description: "Predict the likely eye color of a baby based on the eye colors of both parents using simplified genetic modeling.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["baby eye color", "eye color predictor", "genetic eye color calculator"],
  variants: [{
    id: "standard",
    name: "Baby Eye Color",
    description: "Predict the likely eye color of a baby based on the eye colors of both parents using simplified genetic modeling",
    fields: [
      { name: "parent1Eye", label: "Parent 1 Eye Color", type: "select", options: [{value:"brown",label:"Brown"},{value:"blue",label:"Blue"},{value:"green",label:"Green"},{value:"hazel",label:"Hazel"}], defaultValue: "brown" },
      { name: "parent2Eye", label: "Parent 2 Eye Color", type: "select", options: [{value:"brown",label:"Brown"},{value:"blue",label:"Blue"},{value:"green",label:"Green"},{value:"hazel",label:"Hazel"}], defaultValue: "blue" },
      { name: "grandparentLight", label: "Grandparents with Light Eyes", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1 grandparent"},{value:"2",label:"2 or more grandparents"}], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const p1 = inputs.parent1Eye as string;
      const p2 = inputs.parent2Eye as string;
      const gp = parseInt(inputs.grandparentLight as string) || 0;
      const probs: Record<string, Record<string, number[]>> = {
        "brown-brown": { brown: [75], green: [12], hazel: [6], blue: [6] },
        "brown-blue": { brown: [50], green: [6], hazel: [6], blue: [37] },
        "brown-green": { brown: [50], green: [25], hazel: [12], blue: [12] },
        "brown-hazel": { brown: [50], green: [12], hazel: [25], blue: [12] },
        "blue-blue": { brown: [1], green: [1], hazel: [0], blue: [98] },
        "blue-green": { brown: [0], green: [50], hazel: [0], blue: [50] },
        "blue-hazel": { brown: [12], green: [12], hazel: [25], blue: [50] },
        "green-green": { brown: [1], green: [75], hazel: [24], blue: [0] },
        "green-hazel": { brown: [12], green: [37], hazel: [37], blue: [13] },
        "hazel-hazel": { brown: [25], green: [25], hazel: [37], blue: [12] },
      };
      const key1 = p1 + "-" + p2;
      const key2 = p2 + "-" + p1;
      const data = probs[key1] || probs[key2] || probs["brown-brown"];
      let brown = (data.brown?.[0] || 0);
      let green = (data.green?.[0] || 0);
      let hazel = (data.hazel?.[0] || 0);
      let blue = (data.blue?.[0] || 0);
      if (gp >= 1) { blue += 3; brown -= 2; green += 1; hazel -= 2; }
      if (gp >= 2) { blue += 3; brown -= 3; }
      brown = Math.max(0, brown); green = Math.max(0, green); hazel = Math.max(0, hazel); blue = Math.max(0, blue);
      const total = brown + green + hazel + blue;
      const bP = Math.round(brown / total * 100);
      const gP = Math.round(green / total * 100);
      const hP = Math.round(hazel / total * 100);
      const blP = 100 - bP - gP - hP;
      const most = Math.max(bP, gP, hP, blP);
      const likely = most === bP ? "Brown" : most === gP ? "Green" : most === hP ? "Hazel" : "Blue";
      return {
        primary: { label: "Most Likely Eye Color", value: likely + " (" + formatNumber(most) + "%)" },
        details: [
          { label: "Brown", value: formatNumber(bP) + "%" },
          { label: "Blue", value: formatNumber(blP) + "%" },
          { label: "Green / Hazel", value: formatNumber(gP) + "% / " + formatNumber(hP) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["child-height-prediction-calculator", "chances-of-twins-calculator"],
  faq: [
    { question: "Can two brown-eyed parents have a blue-eyed baby?", answer: "Yes. If both parents carry a recessive gene for blue eyes, there is approximately a 25 percent chance of having a blue-eyed child. This is more likely when grandparents have light eyes." },
    { question: "When does a baby eye color become permanent?", answer: "Most babies are born with lighter eyes that may darken over time. Eye color typically stabilizes between 6 and 12 months of age, though subtle changes can occur up to age 3." },
  ],
  formula: "Probability based on simplified Mendelian genetics combining dominant (brown) and recessive (blue, green) alleles with family history modifier",
};
