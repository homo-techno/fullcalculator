import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventLightingCostCalculator: CalculatorDefinition = {
  slug: "event-lighting-cost-calculator",
  title: "Event Lighting Cost Calculator",
  description: "Estimate event lighting costs for weddings and parties including uplighting, string lights, spotlights, and gobo projections.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["event lighting cost","wedding lighting","uplighting rental","party lights budget"],
  variants: [{
    id: "standard",
    name: "Event Lighting Cost",
    description: "Estimate event lighting costs for weddings and parties including uplighting, string lights, spotlights, and gobo projections.",
    fields: [
      { name: "uplights", label: "Number of Uplights", type: "number", min: 0, max: 50, defaultValue: 12 },
      { name: "uplightCost", label: "Cost Per Uplight ($)", type: "number", min: 10, max: 100, defaultValue: 25 },
      { name: "stringLightFeet", label: "String Lights (feet)", type: "number", min: 0, max: 1000, defaultValue: 200 },
      { name: "stringLightRate", label: "String Light Rate ($/ft)", type: "number", min: 1, max: 15, defaultValue: 4 },
      { name: "spotlights", label: "Spotlights/Pin Spots", type: "number", min: 0, max: 20, defaultValue: 4 },
      { name: "spotlightCost", label: "Cost Per Spotlight ($)", type: "number", min: 20, max: 150, defaultValue: 50 },
      { name: "goboProjection", label: "Gobo/Monogram Projection", type: "select", options: [{ value: "0", label: "None" }, { value: "150", label: "Standard ($150)" }, { value: "350", label: "Custom Design ($350)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const uplights = inputs.uplights as number;
    const uplightCost = inputs.uplightCost as number;
    const stringFeet = inputs.stringLightFeet as number;
    const stringRate = inputs.stringLightRate as number;
    const spots = inputs.spotlights as number;
    const spotCost = inputs.spotlightCost as number;
    const gobo = parseFloat(inputs.goboProjection as unknown as string);
    const totalUplighting = uplights * uplightCost;
    const totalString = stringFeet * stringRate;
    const totalSpots = spots * spotCost;
    const subtotal = totalUplighting + totalString + totalSpots + gobo;
    const setupFee = subtotal * 0.15;
    const total = subtotal + setupFee;
    return {
      primary: { label: "Total Lighting Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Uplighting", value: "$" + formatNumber(Math.round(totalUplighting)) },
        { label: "String Lights", value: "$" + formatNumber(Math.round(totalString)) },
        { label: "Spotlights", value: "$" + formatNumber(Math.round(totalSpots)) },
        { label: "Gobo Projection", value: "$" + formatNumber(gobo) },
        { label: "Setup/Teardown (15%)", value: "$" + formatNumber(Math.round(setupFee)) }
      ]
    };
  },
  }],
  relatedSlugs: ["tent-rental-cost-calculator","reception-venue-cost-calculator","dj-vs-band-cost-calculator"],
  faq: [
    { question: "How much does event lighting cost?", answer: "Basic uplighting packages start at $200-$500. Full lighting design with string lights, spots, and gobos ranges from $1,000 to $3,000 or more." },
    { question: "How many uplights do you need for a wedding?", answer: "Plan one uplight every 6-8 feet along walls. A typical ballroom needs 12-20 uplights for full coverage." },
    { question: "What is a gobo projection?", answer: "A gobo is a stencil placed in front of a light to project a pattern or monogram. Custom gobos with your initials or wedding date add a personal touch to the dance floor." },
  ],
  formula: "Total = Uplighting + StringLights + Spotlights + Gobo + SetupFee
Setup Fee = Subtotal x 0.15",
};
