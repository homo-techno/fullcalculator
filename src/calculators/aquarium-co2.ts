import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumCo2Calculator: CalculatorDefinition = {
  slug: "aquarium-co2-calculator",
  title: "Aquarium CO2 Injection Calculator",
  description: "Free online aquarium CO2 injection calculator. Calculate optimal CO2 levels, bubble rates, and tank duration for planted aquariums.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["aquarium co2 calculator", "co2 injection calculator", "planted tank co2", "bubble rate calculator", "co2 tank duration"],
  variants: [
    {
      id: "co2-level",
      name: "CO2 Level from pH & KH",
      description: "Calculate dissolved CO2 concentration from pH and carbonate hardness",
      fields: [
        { name: "ph", label: "Aquarium pH", type: "number", placeholder: "e.g. 6.8" },
        { name: "kh", label: "Carbonate Hardness (dKH)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const ph = parseFloat(inputs.ph as string) || 0;
        const kh = parseFloat(inputs.kh as string) || 0;
        if (!ph || !kh) return null;

        const co2 = 3.0 * kh * Math.pow(10, 7 - ph);
        let status: string;
        if (co2 < 10) status = "Low - plants may struggle";
        else if (co2 < 20) status = "Moderate - adequate for low-tech plants";
        else if (co2 <= 35) status = "Optimal - ideal for planted tanks";
        else if (co2 <= 50) status = "High - monitor fish behavior";
        else status = "Dangerous - reduce CO2 immediately";

        return {
          primary: { label: "Dissolved CO2", value: `${formatNumber(co2, 1)} ppm` },
          details: [
            { label: "Status", value: status },
            { label: "pH", value: formatNumber(ph, 1) },
            { label: "KH", value: `${formatNumber(kh, 1)} dKH` },
            { label: "Target range", value: "20-30 ppm" },
          ],
          note: "CO2 above 30 ppm can stress fish. Always use a drop checker as a visual indicator. The pH/KH method can be inaccurate if other acids are present.",
        };
      },
    },
    {
      id: "tank-duration",
      name: "CO2 Tank Duration",
      description: "Estimate how long a CO2 cylinder will last",
      fields: [
        { name: "cylinderSize", label: "CO2 Cylinder Size", type: "select", options: [
          { label: "20 oz (paintball)", value: "567" },
          { label: "5 lb tank", value: "2268" },
          { label: "10 lb tank", value: "4536" },
          { label: "15 lb tank", value: "6804" },
          { label: "20 lb tank", value: "9072" },
        ], defaultValue: "2268" },
        { name: "bubbleRate", label: "Bubble Rate (bubbles/sec)", type: "number", placeholder: "e.g. 2" },
        { name: "hoursPerDay", label: "Hours CO2 On per Day", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "tankVolume", label: "Aquarium Volume (gallons)", type: "number", placeholder: "e.g. 55" },
      ],
      calculate: (inputs) => {
        const cylinderGrams = parseFloat(inputs.cylinderSize as string) || 2268;
        const bps = parseFloat(inputs.bubbleRate as string) || 0;
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string) || 8;
        const tankVolume = parseFloat(inputs.tankVolume as string) || 55;
        if (!bps) return null;

        const gramsPerBubble = 0.003;
        const gramsPerSecond = bps * gramsPerBubble;
        const gramsPerHour = gramsPerSecond * 3600;
        const gramsPerDay = gramsPerHour * hoursPerDay;
        const daysTotal = cylinderGrams / gramsPerDay;
        const weeksTotal = daysTotal / 7;
        const monthsTotal = daysTotal / 30.44;
        const refillCost = cylinderGrams < 1000 ? 5 : (cylinderGrams / 453.6) * 3;

        return {
          primary: { label: "Estimated Duration", value: `${formatNumber(daysTotal, 0)} days` },
          details: [
            { label: "Duration (weeks)", value: formatNumber(weeksTotal, 1) },
            { label: "Duration (months)", value: formatNumber(monthsTotal, 1) },
            { label: "CO2 per day", value: `${formatNumber(gramsPerDay, 1)} g` },
            { label: "CO2 per hour", value: `${formatNumber(gramsPerHour, 2)} g` },
            { label: "Cylinder capacity", value: `${formatNumber(cylinderGrams)} g` },
            { label: "Tank volume", value: `${formatNumber(tankVolume)} gallons` },
            { label: "Est. refill cost", value: `$${formatNumber(refillCost, 2)}` },
          ],
          note: "Actual duration varies with regulator efficiency, temperature, and leak-free connections. Use a solenoid on a timer to save CO2.",
        };
      },
    },
  ],
  relatedSlugs: ["ph-calculator", "volume-calculator"],
  faq: [
    { question: "How much CO2 do I need for a planted aquarium?", answer: "Most planted tanks target 20-30 ppm of dissolved CO2 during the photoperiod. Start with 1 bubble per second for tanks under 30 gallons and increase gradually while monitoring pH and fish behavior." },
    { question: "How do I measure CO2 in my aquarium?", answer: "The most common methods are: 1) pH/KH chart (measure pH and KH, use the formula CO2 = 3 × KH × 10^(7-pH)), 2) Drop checker with 4 dKH reference solution (green = ~30 ppm)." },
    { question: "When should I run CO2 injection?", answer: "Run CO2 during the photoperiod (when lights are on) and turn it off 30-60 minutes before lights off. Use a solenoid valve on a timer for automatic control. CO2 is not needed when lights are off." },
  ],
  formula: "CO2 (ppm) = 3.0 × KH (dKH) × 10^(7 - pH)",
};
