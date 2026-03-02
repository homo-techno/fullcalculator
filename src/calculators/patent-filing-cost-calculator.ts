import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patentFilingCostCalculator: CalculatorDefinition = {
  slug: "patent-filing-cost-calculator",
  title: "Patent Filing Cost Calculator",
  description: "Estimate patent filing costs including USPTO fees, attorney fees, and maintenance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["patent filing cost","patent application","USPTO fees","patent attorney cost"],
  variants: [{
    id: "standard",
    name: "Patent Filing Cost",
    description: "Estimate patent filing costs including USPTO fees, attorney fees, and maintenance.",
    fields: [
      { name: "patentType", label: "Patent Type", type: "select", options: [{ value: "1", label: "Utility Patent" }, { value: "2", label: "Design Patent" }, { value: "3", label: "Provisional Application" }], defaultValue: "1" },
      { name: "entitySize", label: "Entity Size", type: "select", options: [{ value: "1", label: "Micro Entity" }, { value: "2", label: "Small Entity" }, { value: "3", label: "Large Entity" }], defaultValue: "2" },
      { name: "complexity", label: "Invention Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" },
      { name: "claims", label: "Number of Claims", type: "number", min: 1, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const patentType = parseInt(inputs.patentType as string);
    const entitySize = parseInt(inputs.entitySize as string);
    const complexity = parseInt(inputs.complexity as string);
    const claims = inputs.claims as number;
    const typeNames = ["", "Utility Patent", "Design Patent", "Provisional Application"];
    const baseFiling = [0, 1600, 1000, 320][patentType] || 1600;
    const entityDiscount = [0, 0.25, 0.5, 1][entitySize] || 0.5;
    const filingFee = baseFiling * entityDiscount;
    const excessClaims = Math.max(claims - 20, 0);
    const claimFee = excessClaims * 80 * entityDiscount;
    const attorneyBase = [0, 8000, 3000, 2000][patentType] || 8000;
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const attorneyFee = attorneyBase * complexityMult;
    const drawingFee = patentType === 2 ? 800 : 500;
    const searchFee = [0, 700, 500, 0][patentType] * entityDiscount;
    const totalCost = filingFee + claimFee + attorneyFee + drawingFee + searchFee;
    return {
      primary: { label: "Estimated Total Patent Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Patent Type", value: typeNames[patentType] || "Utility" },
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Excess Claims Fee", value: "$" + formatNumber(claimFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Drawings & Search", value: "$" + formatNumber(drawingFee + searchFee) }
      ]
    };
  },
  }],
  relatedSlugs: ["trademark-registration-cost-calculator","copyright-registration-cost-calculator","intellectual-property-value-calculator"],
  faq: [
    { question: "How much does a patent cost?", answer: "A utility patent typically costs $8,000 to $25,000+ including USPTO fees and attorney costs. Provisional patents are much cheaper at $2,000 to $5,000." },
    { question: "What is the difference between a provisional and nonprovisional patent?", answer: "A provisional patent provides a 12-month placeholder filing date at lower cost but does not itself become a patent. A nonprovisional is the full application examined by the USPTO." },
    { question: "How long does it take to get a patent?", answer: "The average time from filing to grant is 2 to 3 years for utility patents. Design patents typically take 12 to 18 months." },
  ],
  formula: "Total Cost = Filing Fee + Claims Fee + Attorney Fee + Drawings + Search",
};
