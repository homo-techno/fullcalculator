import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recyclingSavingsCalculator: CalculatorDefinition = {
  slug: "recycling-savings-calculator",
  title: "Recycling Savings Calculator",
  description:
    "Free recycling savings calculator. Estimate the environmental and energy savings from recycling paper, plastic, glass, and aluminum.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "recycling savings",
    "recycle calculator",
    "recycling benefits",
    "waste reduction",
    "recycling environmental impact",
    "recycle energy savings",
  ],
  variants: [
    {
      id: "monthly",
      name: "Monthly Recycling Impact",
      fields: [
        {
          name: "paperLbs",
          label: "Paper/Cardboard (lbs/month)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "plasticLbs",
          label: "Plastic (lbs/month)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "glassLbs",
          label: "Glass (lbs/month)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "aluminumLbs",
          label: "Aluminum/Metal (lbs/month)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const paper = (inputs.paperLbs as number) || 0;
        const plastic = (inputs.plasticLbs as number) || 0;
        const glass = (inputs.glassLbs as number) || 0;
        const aluminum = (inputs.aluminumLbs as number) || 0;
        if (!paper && !plastic && !glass && !aluminum) return null;

        // Energy saved per lb recycled (kWh equivalent)
        const energySaved = {
          paper: 2.5,
          plastic: 5.8,
          glass: 0.4,
          aluminum: 7.0,
        };

        // CO2 saved per lb recycled (lbs CO2)
        const co2Saved = {
          paper: 1.4,
          plastic: 2.2,
          glass: 0.6,
          aluminum: 4.0,
        };

        const monthlyEnergy =
          paper * energySaved.paper +
          plastic * energySaved.plastic +
          glass * energySaved.glass +
          aluminum * energySaved.aluminum;

        const monthlyCO2 =
          paper * co2Saved.paper +
          plastic * co2Saved.plastic +
          glass * co2Saved.glass +
          aluminum * co2Saved.aluminum;

        const annualEnergy = monthlyEnergy * 12;
        const annualCO2 = monthlyCO2 * 12;
        const annualCO2Tons = annualCO2 / 2204.6;
        const treesEquiv = annualCO2 / 48;
        const totalLbs = (paper + plastic + glass + aluminum) * 12;

        return {
          primary: {
            label: "Annual CO2 Saved",
            value: formatNumber(annualCO2Tons, 3) + " metric tons",
          },
          details: [
            { label: "Annual Energy Saved", value: formatNumber(annualEnergy, 0) + " kWh" },
            { label: "Annual CO2 Saved", value: formatNumber(annualCO2, 0) + " lbs" },
            { label: "Total Recycled/Year", value: formatNumber(totalLbs, 0) + " lbs" },
            { label: "Tree Equivalent", value: formatNumber(treesEquiv, 1) + " trees" },
            { label: "Monthly Energy Saved", value: formatNumber(monthlyEnergy, 1) + " kWh" },
          ],
          note: "Recycling aluminum saves the most energy per pound -- producing new aluminum from ore uses 20x more energy than recycling it.",
        };
      },
    },
  ],
  relatedSlugs: ["plastic-footprint-calculator", "carbon-footprint-calculator"],
  faq: [
    {
      question: "How much energy does recycling actually save?",
      answer:
        "Recycling aluminum saves 95% of the energy needed to make new aluminum. Recycling paper saves about 60-70% of energy, plastic saves about 70%, and glass saves about 30% compared to producing from raw materials.",
    },
    {
      question: "Is recycling really worth it environmentally?",
      answer:
        "Yes. Recycling reduces landfill waste, conserves natural resources, saves energy, and reduces greenhouse gas emissions. Even accounting for collection and processing energy, recycling has a net positive environmental impact for most materials.",
    },
  ],
  formula:
    "Annual Savings = Sum of (monthly lbs x savings factor x 12). Energy factors (kWh/lb): Paper 2.5, Plastic 5.8, Glass 0.4, Aluminum 7.0. CO2 factors (lbs/lb): Paper 1.4, Plastic 2.2, Glass 0.6, Aluminum 4.0.",
};
