import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nailSalonCostCalculator: CalculatorDefinition = {
  slug: "nail-salon-cost-calculator",
  title: "Nail Salon Cost Calculator",
  description: "Estimate manicure and pedicure service costs at a salon.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nail salon cost","manicure cost","pedicure cost","nail pricing"],
  variants: [{
    id: "standard",
    name: "Nail Salon Cost",
    description: "Estimate manicure and pedicure service costs at a salon.",
    fields: [
      { name: "serviceType", label: "Service Type", type: "select", options: [{ value: "25", label: "Basic Manicure" }, { value: "40", label: "Gel Manicure" }, { value: "35", label: "Basic Pedicure" }, { value: "55", label: "Gel Pedicure" }, { value: "70", label: "Mani + Pedi Combo" }] },
      { name: "nailArt", label: "Nail Art Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 0 },
      { name: "frequency", label: "Visits Per Month", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const nailArt = inputs.nailArt as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = serviceType + nailArt;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const monthlyCost = totalPerVisit * frequency;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Nail Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["eyelash-extension-cost-calculator","spa-day-cost-calculator"],
  faq: [
    { question: "How much does a manicure cost?", answer: "Basic manicures cost $20 to $30. Gel manicures cost $35 to $60." },
    { question: "How often should you get your nails done?", answer: "Gel nails last 2 to 3 weeks. Regular polish lasts about 1 week." },
    { question: "Is gel or acrylic more expensive?", answer: "Acrylic nails typically cost more due to additional application time." },
  ],
  formula: "Monthly Cost = (Service + Art + Tip) x Visits Per Month",
};
