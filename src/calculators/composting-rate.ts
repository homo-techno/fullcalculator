import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostingRateCalculator: CalculatorDefinition = {
  slug: "composting-rate-calculator",
  title: "Composting Rate Calculator",
  description:
    "Free composting rate calculator. Estimate compost production time, volume yield, and waste diversion from your composting setup.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "composting rate",
    "compost calculator",
    "composting time",
    "compost production",
    "organic waste",
    "composting yield",
  ],
  variants: [
    {
      id: "rate",
      name: "Composting Estimate",
      fields: [
        {
          name: "weeklyWaste",
          label: "Weekly Organic Waste (lbs)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "method",
          label: "Composting Method",
          type: "select",
          options: [
            { label: "Cold Composting (pile)", value: "cold" },
            { label: "Hot Composting (managed)", value: "hot" },
            { label: "Vermicomposting (worms)", value: "worm" },
            { label: "Tumbler", value: "tumbler" },
            { label: "Bokashi", value: "bokashi" },
          ],
        },
        {
          name: "greenBrown",
          label: "Green-to-Brown Ratio",
          type: "select",
          options: [
            { label: "Mostly Greens (too wet)", value: "green" },
            { label: "Balanced (ideal 1:3)", value: "balanced" },
            { label: "Mostly Browns (too dry)", value: "brown" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weeklyWaste = inputs.weeklyWaste as number;
        const method = (inputs.method as string) || "cold";
        const ratio = (inputs.greenBrown as string) || "balanced";
        if (!weeklyWaste) return null;

        // Weeks to finished compost
        const baseTimes: Record<string, number> = {
          cold: 26,
          hot: 8,
          worm: 12,
          tumbler: 6,
          bokashi: 4,
        };

        const ratioMultiplier: Record<string, number> = {
          green: 1.4,
          balanced: 1.0,
          brown: 1.3,
        };

        const weeksToFinish = Math.round((baseTimes[method] || 12) * (ratioMultiplier[ratio] || 1.0));
        const volumeReduction = 0.4; // compost is ~40% of original volume
        const annualWasteLbs = weeklyWaste * 52;
        const annualCompostLbs = annualWasteLbs * volumeReduction;
        const annualCompostCuFt = annualCompostLbs / 40; // ~40 lbs per cubic foot
        const co2Diverted = annualWasteLbs * 0.58; // lbs CO2e saved vs landfill
        const fertilizerValue = annualCompostCuFt * 8; // ~$8 per cubic foot retail

        return {
          primary: {
            label: "Time to Finished Compost",
            value: weeksToFinish + " weeks",
          },
          details: [
            { label: "Annual Waste Composted", value: formatNumber(annualWasteLbs, 0) + " lbs" },
            { label: "Annual Compost Produced", value: formatNumber(annualCompostLbs, 0) + " lbs" },
            { label: "Annual Volume", value: formatNumber(annualCompostCuFt, 1) + " cu ft" },
            { label: "CO2 Diverted from Landfill", value: formatNumber(co2Diverted, 0) + " lbs/yr" },
            { label: "Compost Retail Value", value: "$" + formatNumber(fertilizerValue, 0) + "/yr" },
            { label: "Green:Brown Ratio", value: ratio === "balanced" ? "Ideal" : "Needs adjustment" },
          ],
          note: "Maintain a 1:3 green-to-brown ratio by volume for fastest decomposition. Turn hot compost weekly and keep moisture like a wrung-out sponge.",
        };
      },
    },
  ],
  relatedSlugs: ["food-waste-calculator", "recycling-savings-calculator"],
  faq: [
    {
      question: "What can I compost?",
      answer:
        "Greens (nitrogen-rich): fruit/vegetable scraps, coffee grounds, grass clippings. Browns (carbon-rich): dried leaves, cardboard, newspaper, straw. Avoid: meat, dairy, oils, pet waste, and diseased plants.",
    },
    {
      question: "What is the ideal green-to-brown ratio?",
      answer:
        "The ideal ratio is roughly 1 part green to 3 parts brown by volume (or 25-30:1 carbon-to-nitrogen ratio by weight). Too many greens create a smelly, wet pile; too many browns slow decomposition.",
    },
  ],
  formula:
    "Time = Base Time x Ratio Multiplier. Annual Compost = Weekly Waste x 52 x 0.4 volume reduction. CO2 Diverted = Annual Waste x 0.58 lbs CO2e/lb.",
};
