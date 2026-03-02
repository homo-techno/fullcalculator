import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowTintDarknessCalculator: CalculatorDefinition = {
  slug: "window-tint-darkness-calculator",
  title: "Window Tint Darkness Calculator",
  description: "Calculate window tint percentages, visible light transmission, and estimated cost for different tint levels and window counts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window tint","tint darkness","VLT calculator","car window tint cost","tint percentage"],
  variants: [{
    id: "standard",
    name: "Window Tint Darkness",
    description: "Calculate window tint percentages, visible light transmission, and estimated cost for different tint levels and window counts.",
    fields: [
      { name: "tintLevel", label: "Tint Darkness", type: "select", options: [{ value: "1", label: "Light (50% VLT)" }, { value: "2", label: "Medium (35% VLT)" }, { value: "3", label: "Dark (20% VLT)" }, { value: "4", label: "Very Dark (5% VLT - Limo)" }], defaultValue: "2" },
      { name: "filmType", label: "Film Type", type: "select", options: [{ value: "1", label: "Dyed ($)" }, { value: "2", label: "Metallic ($$)" }, { value: "3", label: "Carbon ($$$)" }, { value: "4", label: "Ceramic ($$$$)" }], defaultValue: "3" },
      { name: "windowCount", label: "Number of Windows", type: "number", min: 2, max: 10, defaultValue: 5 },
      { name: "includeWindshield", label: "Include Windshield Strip", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$50)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const tintLevel = parseInt(inputs.tintLevel as string);
    const filmType = parseInt(inputs.filmType as string);
    const windowCount = inputs.windowCount as number;
    const includeWindshield = parseInt(inputs.includeWindshield as string);
    const vltValues = { 1: 50, 2: 35, 3: 20, 4: 5 };
    const costPerWindow = { 1: 25, 2: 40, 3: 55, 4: 80 };
    const heatRejection = { 1: 15, 2: 35, 3: 50, 4: 70 };
    const uvRejection = { 1: 90, 2: 95, 3: 97, 4: 99 };
    const vlt = vltValues[tintLevel] || 35;
    const perWindow = costPerWindow[filmType] || 55;
    const totalCost = (windowCount * perWindow) + (includeWindshield * 50);
    const heatReject = heatRejection[filmType] || 50;
    const uvReject = uvRejection[filmType] || 97;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Visible Light Transmission", value: formatNumber(vlt) + "%" },
        { label: "Heat Rejection", value: formatNumber(heatReject) + "%" },
        { label: "UV Rejection", value: formatNumber(uvReject) + "%" },
        { label: "Cost Per Window", value: "$" + formatNumber(perWindow) },
        { label: "Windows Tinted", value: formatNumber(windowCount) + (includeWindshield ? " + windshield strip" : "") }
      ]
    };
  },
  }],
  relatedSlugs: ["car-tint-cost-calculator","paint-protection-film-cost-calculator"],
  faq: [
    { question: "What tint percentage is legal?", answer: "Legal VLT varies by state and window position. Most states allow 35 percent or darker on rear windows but restrict front side windows to 35 to 70 percent VLT. Always check local laws before tinting." },
    { question: "What does VLT mean?", answer: "VLT stands for Visible Light Transmission, the percentage of visible light that passes through the film. Lower VLT means darker tint. A 5 percent VLT allows only 5 percent of light through." },
    { question: "Is ceramic tint worth the extra cost?", answer: "Ceramic tint provides the best heat rejection without interfering with electronics, and it does not fade over time like dyed films. It offers the best combination of visibility and heat reduction." },
  ],
  formula: "Total Cost = (Number of Windows x Cost Per Window) + Windshield Strip
VLT = Percentage of visible light passing through
Heat Rejection varies by film type (15% dyed to 70% ceramic)",
};
