import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const standingDeskHeightCalculator: CalculatorDefinition = {
  slug: "standing-desk-height-calculator",
  title: "Standing Desk Height Calculator",
  description: "Determine the ergonomic desk height based on your stature.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["standing desk","ergonomic","height","workspace"],
  variants: [{
    id: "standard",
    name: "Standing Desk Height",
    description: "Determine the ergonomic desk height based on your stature.",
    fields: [
      { name: "heightInches", label: "Your Height (inches)", type: "number", min: 54, max: 84, defaultValue: 68 },
      { name: "shoeHeight", label: "Shoe Height (inches)", type: "number", min: 0, max: 4, defaultValue: 1 },
      { name: "monitorSize", label: "Monitor Size (inches)", type: "number", min: 13, max: 42, defaultValue: 24 },
    ],
    calculate: (inputs) => {
    const heightInches = inputs.heightInches as number;
    const shoeHeight = inputs.shoeHeight as number;
    const monitorSize = inputs.monitorSize as number;
    const totalHeight = heightInches + shoeHeight;
    const elbowHeight = totalHeight * 0.63;
    const deskHeight = Math.round(elbowHeight);
    const monitorTop = totalHeight * 0.85;
    const monitorCenter = monitorTop - (monitorSize * 0.5);
    const keyboardHeight = deskHeight - 1;
    return { primary: { label: "Recommended Desk Height", value: formatNumber(deskHeight) + " inches" }, details: [{ label: "Elbow Height", value: formatNumber(elbowHeight) + " inches" }, { label: "Keyboard Tray Height", value: formatNumber(keyboardHeight) + " inches" }, { label: "Monitor Center Height", value: formatNumber(monitorCenter) + " inches" }, { label: "Total Standing Height", value: formatNumber(totalHeight) + " inches" }] };
  },
  }],
  relatedSlugs: ["cubicle-layout-calculator","office-space-per-employee-calculator","conference-room-calculator"],
  faq: [
    { question: "What is the correct standing desk height?", answer: "Your desk should be at elbow height, roughly 63% of your total height." },
    { question: "How high should my monitor be?", answer: "The top of the screen should be at or slightly below eye level." },
    { question: "Should I stand all day at a standing desk?", answer: "No, alternate between sitting and standing every 30 to 60 minutes." },
  ],
  formula: "DeskHeight = (HeightInches + ShoeHeight) * 0.63; Rounded to nearest inch",
};
