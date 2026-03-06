import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightingSetupCostCalculator: CalculatorDefinition = {
  slug: "lighting-setup-cost-calculator",
  title: "Lighting Setup Cost Calculator",
  description: "Estimate the cost of photography and video lighting equipment packages for different production levels.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lighting equipment cost","studio lighting budget","video light setup","photography lighting kit"],
  variants: [{
    id: "standard",
    name: "Lighting Setup Cost",
    description: "Estimate the cost of photography and video lighting equipment packages for different production levels.",
    fields: [
      { name: "setupType", label: "Setup Type", type: "select", options: [{ value: "1", label: "Beginner YouTube" }, { value: "2", label: "Portrait Studio" }, { value: "3", label: "Product Photography" }, { value: "4", label: "Video Production" }, { value: "5", label: "Film Set" }], defaultValue: "2" },
      { name: "quality", label: "Equipment Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Professional" }], defaultValue: "2" },
      { name: "lightsCount", label: "Number of Lights", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "includeModifiers", label: "Include Modifiers", type: "select", options: [{ value: "1", label: "Basic (reflectors)" }, { value: "2", label: "Standard (softboxes + reflectors)" }, { value: "3", label: "Full (soft boxes, scrims, flags, gels)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const setup = parseInt(inputs.setupType as string);
    const quality = parseInt(inputs.quality as string);
    const lights = inputs.lightsCount as number;
    const modifiers = parseInt(inputs.includeModifiers as string);
    const perLightCost = [0, [0, 50, 200, 600], [0, 100, 350, 900], [0, 80, 300, 800], [0, 150, 500, 1200], [0, 300, 800, 2000]][setup][quality];
    const modCost = [0, 30, 100, 300][modifiers] * lights;
    const standsCost = lights * [0, 25, 60, 150][quality];
    const accessoryCost = [0, 50, 150, 400][quality];
    const lightsCost = perLightCost * lights;
    const total = lightsCost + modCost + standsCost + accessoryCost;
    return {
      primary: { label: "Total Lighting Setup Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Lights Cost", value: "$" + formatNumber(lightsCost) + " (" + formatNumber(lights) + " lights)" },
        { label: "Modifiers", value: "$" + formatNumber(modCost) },
        { label: "Stands & Mounts", value: "$" + formatNumber(standsCost) },
        { label: "Accessories", value: "$" + formatNumber(accessoryCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["film-budget-estimator","green-screen-distance-calculator"],
  faq: [
    { question: "How many lights do I need for portraits?", answer: "A classic portrait setup uses 2-3 lights: a key light, fill light, and optional hair/rim light. One-light setups with a reflector can also produce excellent results." },
    { question: "Are LED lights better than strobes?", answer: "LEDs offer continuous light (great for video and beginners) and lower heat. Strobes provide more power per dollar and freeze motion. Many studios use both." },
    { question: "What light modifiers should I start with?", answer: "Start with a large softbox or umbrella for your key light and a reflector for fill. Add a strip box for rim light as your second modifier." },
  ],
  formula: "Total = (Light Cost x Count) + (Modifier Cost x Count) + Stands + Accessories; Costs vary by equipment tier and setup type",
};
