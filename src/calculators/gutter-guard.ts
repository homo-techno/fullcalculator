import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterGuardCalculator: CalculatorDefinition = {
  slug: "gutter-guard-calculator",
  title: "Gutter Guard Calculator",
  description: "Free gutter guard calculator. Calculate gutter guard materials, cost, and labor for your home based on gutter length and guard type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter guard calculator", "gutter guard cost", "leaf guard calculator", "gutter protection calculator", "gutter screen calculator"],
  variants: [
    {
      id: "gutter-guard-materials",
      name: "Gutter Guard Materials & Cost",
      description: "Calculate gutter guard materials and installation costs",
      fields: [
        { name: "gutterLength", label: "Total Gutter Length (feet)", type: "number", placeholder: "e.g. 150" },
        { name: "guardType", label: "Gutter Guard Type", type: "select", options: [
          { label: "Mesh / Screen (DIY, $0.50-$1.50/ft)", value: "mesh" },
          { label: "Foam Insert ($2-$4/ft)", value: "foam" },
          { label: "Brush Insert ($2-$4/ft)", value: "brush" },
          { label: "Reverse Curve / Surface Tension ($5-$10/ft)", value: "reverse" },
          { label: "Micro-Mesh (Professional, $8-$15/ft)", value: "micromesh" },
          { label: "Perforated Aluminum ($3-$6/ft)", value: "perforated" },
        ], defaultValue: "mesh" },
        { name: "gutterSize", label: "Gutter Size", type: "select", options: [
          { label: "5\" K-Style", value: "5" },
          { label: "6\" K-Style", value: "6" },
          { label: "5\" Half-Round", value: "5hr" },
          { label: "6\" Half-Round", value: "6hr" },
        ], defaultValue: "5" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($3-$8/ft)", value: "5" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const gutterLength = inputs.gutterLength as number;
        const guardType = inputs.guardType as string;
        const installation = parseInt(inputs.installation as string) || 0;
        if (!gutterLength) return null;

        let costPerFt: number;
        let warranty: string;
        let effectiveness: string;

        switch (guardType) {
          case "mesh":
            costPerFt = 1; warranty = "1-5 years"; effectiveness = "Good (blocks leaves, not small debris)"; break;
          case "foam":
            costPerFt = 3; warranty = "3-5 years"; effectiveness = "Fair (may degrade in sun, seeds can root)"; break;
          case "brush":
            costPerFt = 3; warranty = "5 years"; effectiveness = "Fair (easy to install, needs periodic cleaning)"; break;
          case "reverse":
            costPerFt = 7.5; warranty = "20+ years"; effectiveness = "Very Good (can struggle with heavy rain)"; break;
          case "micromesh":
            costPerFt = 12; warranty = "25+ years / Lifetime"; effectiveness = "Excellent (blocks nearly all debris)"; break;
          case "perforated":
            costPerFt = 4.5; warranty = "10-20 years"; effectiveness = "Good (durable, allows good water flow)"; break;
          default:
            costPerFt = 1; warranty = "Varies"; effectiveness = "Varies";
        }

        const materialCost = gutterLength * costPerFt;
        const installCost = gutterLength * installation;
        const gutterCleaning = gutterLength * 0.5; // Pre-install cleaning
        const totalCost = materialCost + installCost + gutterCleaning;

        // Sections needed (most guards come in 3-4 ft sections)
        const sectionsNeeded = Math.ceil(gutterLength / 4);

        // Annual savings from not cleaning gutters
        const annualCleaningSaved = gutterLength * 1.5; // Typical cleaning cost

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Guard material cost", value: `$${formatNumber(materialCost, 0)}` },
            { label: "Installation cost", value: `$${formatNumber(installCost, 0)}` },
            { label: "Pre-install gutter cleaning", value: `$${formatNumber(gutterCleaning, 0)}` },
            { label: "Sections needed (~4 ft each)", value: `${sectionsNeeded}` },
            { label: "Debris effectiveness", value: effectiveness },
            { label: "Typical warranty", value: warranty },
            { label: "Annual cleaning savings", value: `$${formatNumber(annualCleaningSaved, 0)}/year` },
          ],
          note: "Clean gutters thoroughly before installing guards. No gutter guard eliminates all maintenance - inspect annually. Micro-mesh guards offer the best protection but cost the most.",
        };
      },
    },
  ],
  relatedSlugs: ["gutter-size-calculator", "gutter-calculator", "downspout-calculator"],
  faq: [
    { question: "Are gutter guards worth the investment?", answer: "Gutter guards reduce (but don't eliminate) cleaning frequency. They're worth it if: you have many trees, your roof is high/dangerous to access, or you pay for professional cleaning 2+ times per year. Budget guards ($1-$3/ft) pay for themselves in 1-2 years. Premium guards ($8-$15/ft) take 5-10 years." },
    { question: "What is the best type of gutter guard?", answer: "Micro-mesh guards are the most effective, blocking even small debris like pine needles and shingle grit. Reverse-curve guards are good for leaves but can fail in heavy rain. Screen/mesh guards are the best value for most homes. Foam and brush inserts are least effective long-term." },
  ],
  formula: "Material Cost = Gutter Length × Cost Per Foot | Total = Material + Installation + Cleaning | Sections = Length / 4",
};
