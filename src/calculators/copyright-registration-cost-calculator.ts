import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const copyrightRegistrationCostCalculator: CalculatorDefinition = {
  slug: "copyright-registration-cost-calculator",
  title: "Copyright Registration Cost Calculator",
  description: "Calculate copyright registration costs with the US Copyright Office.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["copyright registration","copyright filing","copyright cost","USCO fee"],
  variants: [{
    id: "standard",
    name: "Copyright Registration Cost",
    description: "Calculate copyright registration costs with the US Copyright Office.",
    fields: [
      { name: "workType", label: "Type of Work", type: "select", options: [{ value: "1", label: "Single Work - Single Author" }, { value: "2", label: "Single Work - Multiple Authors" }, { value: "3", label: "Collection/Group" }, { value: "4", label: "Sound Recording" }], defaultValue: "1" },
      { name: "filingMethod", label: "Filing Method", type: "select", options: [{ value: "1", label: "Online (Standard)" }, { value: "2", label: "Paper Filing" }], defaultValue: "1" },
      { name: "works", label: "Number of Registrations", type: "number", min: 1, max: 50, defaultValue: 1 },
      { name: "expedited", label: "Expedited Processing", type: "select", options: [{ value: "0", label: "Standard (3-6 months)" }, { value: "1", label: "Expedited ($800 extra)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const workType = parseInt(inputs.workType as string);
    const filingMethod = parseInt(inputs.filingMethod as string);
    const works = inputs.works as number;
    const expedited = parseInt(inputs.expedited as string);
    const typeNames = ["", "Single Work - Single Author", "Single Work - Multiple Authors", "Collection/Group", "Sound Recording"];
    const baseFees = [0, 45, 65, 65, 65];
    const paperSurcharge = filingMethod === 2 ? 40 : 0;
    const perRegistration = (baseFees[workType] || 65) + paperSurcharge;
    const totalFiling = perRegistration * works;
    const expeditedFee = expedited === 1 ? 800 * works : 0;
    const totalCost = totalFiling + expeditedFee;
    return {
      primary: { label: "Total Copyright Registration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Work Type", value: typeNames[workType] || "Standard" },
        { label: "Fee Per Registration", value: "$" + formatNumber(perRegistration) },
        { label: "Number of Registrations", value: formatNumber(works) },
        { label: "Expedited Fee", value: "$" + formatNumber(expeditedFee) }
      ]
    };
  },
  }],
  relatedSlugs: ["trademark-registration-cost-calculator","patent-filing-cost-calculator","intellectual-property-value-calculator"],
  faq: [
    { question: "How much does copyright registration cost?", answer: "Online registration with the US Copyright Office costs $45 for a single work by one author and $65 for other works. Paper filing adds approximately $40." },
    { question: "Is copyright registration required?", answer: "No, copyright exists automatically upon creation. However, registration is required to sue for infringement and enables statutory damages and attorney fee recovery." },
    { question: "How long does copyright registration take?", answer: "Standard processing takes 3 to 6 months for online filings. Expedited processing (Special Handling) costs $800 and takes 5 to 10 business days." },
  ],
  formula: "Total Cost = (Base Fee + Paper Surcharge) x Registrations + Expedited Fees",
};
