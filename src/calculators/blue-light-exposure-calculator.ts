import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const blueLightExposureCalculator: CalculatorDefinition = {
  slug: "blue-light-exposure-calculator",
  title: "Blue Light Exposure Calculator",
  description: "Estimate daily blue light dose from screen time and devices.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["blue light exposure","screen time blue light","digital eye strain calculator"],
  variants: [{
    id: "standard",
    name: "Blue Light Exposure",
    description: "Estimate daily blue light dose from screen time and devices.",
    fields: [
      { name: "phoneHours", label: "Phone Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 4 },
      { name: "computerHours", label: "Computer Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 6 },
      { name: "tvHours", label: "TV Screen Time (hours/day)", type: "number", min: 0, max: 12, defaultValue: 2 },
      { name: "blueFilter", label: "Blue Light Filter", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Software Filter" }, { value: "2", label: "Blue Light Glasses" }] },
    ],
    calculate: (inputs) => {
    const phoneHours = inputs.phoneHours as number;
    const computerHours = inputs.computerHours as number;
    const tvHours = inputs.tvHours as number;
    const blueFilter = inputs.blueFilter as string;
    const phoneBlue = phoneHours * 0.9;
    const computerBlue = computerHours * 0.7;
    const tvBlue = tvHours * 0.4;
    let totalBlue = phoneBlue + computerBlue + tvBlue;
    let filterReduction = 0;
    if (blueFilter === "1") filterReduction = 0.30;
    else if (blueFilter === "2") filterReduction = 0.50;
    const filteredBlue = totalBlue * (1 - filterReduction);
    const totalScreenTime = phoneHours + computerHours + tvHours;
    let riskLevel = "Low";
    if (filteredBlue > 8) riskLevel = "High";
    else if (filteredBlue > 5) riskLevel = "Moderate";
    return {
      primary: { label: "Daily Blue Light Score", value: formatNumber(Math.round(filteredBlue * 10) / 10) },
      details: [
        { label: "Total Screen Time", value: formatNumber(totalScreenTime) + " hours" },
        { label: "Phone Contribution", value: formatNumber(Math.round(phoneBlue * 10) / 10) },
        { label: "Computer Contribution", value: formatNumber(Math.round(computerBlue * 10) / 10) },
        { label: "TV Contribution", value: formatNumber(Math.round(tvBlue * 10) / 10) },
        { label: "Filter Reduction", value: (filterReduction * 100) + "%" },
        { label: "Risk Level", value: riskLevel }
      ]
    };
  },
  }],
  relatedSlugs: ["reading-glasses-strength-calculator","eyeglass-prescription-calculator","eye-exam-cost-calculator"],
  faq: [
    { question: "Does blue light from screens damage your eyes?", answer: "Research is ongoing, but prolonged exposure may contribute to digital eye strain." },
    { question: "Do blue light glasses actually work?", answer: "Blue light glasses can reduce exposure by up to 50% and may reduce eye fatigue." },
    { question: "How can I reduce blue light exposure?", answer: "Use night mode settings, take screen breaks, and consider blue light filtering glasses." },
  ],
  formula: "Blue Light Score = (Phone x 0.9 + Computer x 0.7 + TV x 0.4) x (1 - Filter%)",
};
