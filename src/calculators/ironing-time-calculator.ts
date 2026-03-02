import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ironingTimeCalculator: CalculatorDefinition = {
  slug: "ironing-time-calculator",
  title: "Ironing Time Calculator",
  description: "Estimate total ironing time for your garments.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ironing","time","garments","wrinkles"],
  variants: [{
    id: "standard",
    name: "Ironing Time",
    description: "Estimate total ironing time for your garments.",
    fields: [
      { name: "shirts", label: "Dress Shirts", type: "number", min: 0, max: 30, defaultValue: 5 },
      { name: "pants", label: "Pants and Trousers", type: "number", min: 0, max: 20, defaultValue: 3 },
      { name: "dresses", label: "Dresses and Skirts", type: "number", min: 0, max: 15, defaultValue: 1 },
      { name: "skill", label: "Skill Level", type: "select", options: [{ value: "1.5", label: "Beginner" }, { value: "1", label: "Intermediate" }, { value: "0.7", label: "Expert" }] },
    ],
    calculate: (inputs) => {
    const shirts = inputs.shirts as number;
    const pants = inputs.pants as number;
    const dresses = inputs.dresses as number;
    const skill = inputs.skill as number;
    const shirtTime = shirts * 6 * skill;
    const pantsTime = pants * 5 * skill;
    const dressTime = dresses * 8 * skill;
    const totalMinutes = Math.ceil(shirtTime + pantsTime + dressTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { primary: { label: "Total Ironing Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Shirts", value: Math.ceil(shirtTime) + " minutes" }, { label: "Pants", value: Math.ceil(pantsTime) + " minutes" }, { label: "Dresses and Skirts", value: Math.ceil(dressTime) + " minutes" }] };
  },
  }],
  relatedSlugs: ["laundry-cost-calculator","dry-cleaning-cost-calculator","stain-removal-calculator"],
  faq: [
    { question: "How long does it take to iron a shirt?", answer: "About 5 to 8 minutes for a dress shirt." },
    { question: "What temperature should I iron at?", answer: "Follow garment labels; cotton needs high heat, silk low." },
    { question: "Can I skip ironing?", answer: "A steamer works well for light wrinkles on most fabrics." },
  ],
  formula: "Total = Shirts * 6 + Pants * 5 + Dresses * 8, adjusted by skill",
};
