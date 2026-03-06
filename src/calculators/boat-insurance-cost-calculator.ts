import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatInsuranceCostCalculator: CalculatorDefinition = {
  slug: "boat-insurance-cost-calculator",
  title: "Boat Insurance Cost Calculator",
  description: "Estimate your annual boat insurance premium based on boat value, type, usage, experience, and coverage level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["boat insurance cost","marine insurance calculator","boat insurance premium","watercraft insurance"],
  variants: [{
    id: "standard",
    name: "Boat Insurance Cost",
    description: "Estimate your annual boat insurance premium based on boat value, type, usage, experience, and coverage level.",
    fields: [
      { name: "boatValue", label: "Boat Value ($)", type: "number", min: 1000, max: 5000000, defaultValue: 45000 },
      { name: "boatType", label: "Boat Type", type: "select", options: [{ value: "1.0", label: "Sailboat" }, { value: "1.2", label: "Bowrider / Deck" }, { value: "1.4", label: "Pontoon" }, { value: "1.5", label: "Center Console" }, { value: "1.8", label: "Performance / Speed" }, { value: "2.0", label: "Yacht (40+ ft)" }], defaultValue: "1.2" },
      { name: "experience", label: "Years of Boating Experience", type: "number", min: 0, max: 50, defaultValue: 5 },
      { name: "deductible", label: "Deductible ($)", type: "number", min: 250, max: 25000, defaultValue: 1000 },
      { name: "navigation", label: "Navigation Area", type: "select", options: [{ value: "1.0", label: "Inland / Lakes" }, { value: "1.3", label: "Coastal (nearshore)" }, { value: "1.6", label: "Offshore / Ocean" }], defaultValue: "1.0" },
    ],
    calculate: (inputs) => {
    const value = inputs.boatValue as number;
    const typeMult = parseFloat(inputs.boatType as string);
    const experience = inputs.experience as number;
    const deductible = inputs.deductible as number;
    const navMult = parseFloat(inputs.navigation as string);
    const baseRate = 0.015;
    const expDiscount = Math.min(0.3, experience * 0.03);
    const deductDiscount = Math.min(0.2, (deductible - 250) / 25000 * 0.2);
    const annualPremium = value * baseRate * typeMult * navMult * (1 - expDiscount) * (1 - deductDiscount);
    const monthlyPremium = annualPremium / 12;
    const premiumPerFoot = annualPremium / 30;
    return {
      primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(annualPremium)) },
      details: [
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyPremium)) },
        { label: "Experience Discount", value: formatNumber(Math.round(expDiscount * 100)) + "%" },
        { label: "Deductible Discount", value: formatNumber(Math.round(deductDiscount * 100)) + "%" },
        { label: "Rate as % of Value", value: formatNumber(Math.round((annualPremium / value) * 10000) / 100) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-depreciation-calculator","marina-slip-cost-calculator"],
  faq: [
    { question: "How much does boat insurance cost?", answer: "Boat insurance typically costs 1 to 3 percent of the boat value per year. A $30,000 boat might cost $300 to $900 annually. Factors include boat type, usage area, experience, and coverage level." },
    { question: "What does boat insurance cover?", answer: "Standard policies cover hull damage, theft, liability, medical payments, and sometimes towing and salvage. Some policies also cover personal property, fuel spills, and uninsured boater coverage." },
    { question: "Do I need boat insurance if I only use lakes?", answer: "While not legally required in most states for lake use, boat insurance is strongly recommended. Liability from accidents, storms, and theft can result in significant financial exposure." },
  ],
  formula: "Base Premium = Boat Value x Base Rate (1.5%); Adjusted Premium = Base Premium x Boat Type Factor x Navigation Factor; Final Premium = Adjusted Premium x (1 - Experience Discount) x (1 - Deductible Discount)",
};
