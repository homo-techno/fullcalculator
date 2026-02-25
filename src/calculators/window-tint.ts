import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowTintCalculator: CalculatorDefinition = {
  slug: "window-tint-calculator",
  title: "Window Tint Percentage Calculator",
  description: "Free window tint percentage calculator. Calculate combined VLT, estimate costs, and check legal tint limits for your vehicle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window tint calculator", "tint percentage calculator", "VLT calculator", "car tint cost", "window tint darkness"],
  variants: [
    {
      id: "vlt",
      name: "Combined VLT",
      description: "Calculate combined visible light transmission when layering tints",
      fields: [
        { name: "factoryTint", label: "Factory Glass VLT", type: "number", placeholder: "e.g. 70", suffix: "%" },
        { name: "filmTint", label: "Tint Film VLT", type: "number", placeholder: "e.g. 35", suffix: "%" },
      ],
      calculate: (inputs) => {
        const factory = inputs.factoryTint as number;
        const film = inputs.filmTint as number;
        if (!factory || !film) return null;

        const combinedVLT = (factory / 100) * (film / 100) * 100;
        const lightBlocked = 100 - combinedVLT;
        const uvBlocked = Math.min(99, film < 50 ? 99 : 95);

        return {
          primary: { label: "Combined VLT", value: `${formatNumber(combinedVLT, 1)}%` },
          details: [
            { label: "Light blocked", value: `${formatNumber(lightBlocked, 1)}%` },
            { label: "Factory glass VLT", value: `${factory}%` },
            { label: "Tint film VLT", value: `${film}%` },
            { label: "Estimated UV blocked", value: `${uvBlocked}%` },
            { label: "Appearance", value: combinedVLT > 50 ? "Light" : combinedVLT > 30 ? "Medium" : combinedVLT > 15 ? "Dark" : "Very dark" },
          ],
        };
      },
    },
    {
      id: "cost",
      name: "Tint Installation Cost",
      description: "Estimate window tint installation costs",
      fields: [
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 5" },
        { name: "filmType", label: "Film Type", type: "select", options: [
          { label: "Dyed film (budget)", value: "dyed" },
          { label: "Metalized film", value: "metalized" },
          { label: "Carbon film", value: "carbon" },
          { label: "Ceramic film (premium)", value: "ceramic" },
        ], defaultValue: "carbon" },
        { name: "includeWindshield", label: "Include Windshield Strip?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const windows = (inputs.windows as number) || 5;
        const filmType = inputs.filmType as string;
        const windshield = (inputs.includeWindshield as string) === "yes";

        let pricePerWindow = 0;
        if (filmType === "dyed") pricePerWindow = 30;
        else if (filmType === "metalized") pricePerWindow = 50;
        else if (filmType === "carbon") pricePerWindow = 70;
        else pricePerWindow = 100;

        const windowsCost = windows * pricePerWindow;
        const windshieldCost = windshield ? pricePerWindow * 1.5 : 0;
        const totalCost = windowsCost + windshieldCost;

        return {
          primary: { label: "Estimated Tint Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Side/rear windows", value: `$${formatNumber(windowsCost)}` },
            { label: "Windshield strip", value: windshield ? `$${formatNumber(windshieldCost)}` : "Not included" },
            { label: "Price per window", value: `$${formatNumber(pricePerWindow)}` },
            { label: "Film type", value: filmType.charAt(0).toUpperCase() + filmType.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "car-maintenance-cost-calculator"],
  faq: [
    { question: "What does VLT mean for window tint?", answer: "VLT stands for Visible Light Transmission. It measures the percentage of light that passes through the tint. A 35% VLT tint allows 35% of light through and blocks 65%. Lower VLT means darker tint." },
    { question: "What is the darkest legal tint?", answer: "Legal limits vary by state and window position. Most states allow 35% VLT on front side windows, while rear windows can often be darker. Some states allow any darkness on rear windows. Always check your local laws." },
  ],
  formula: "Combined VLT = (Factory Glass VLT / 100) × (Film VLT / 100) × 100",
};
