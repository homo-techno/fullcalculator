import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const courtFeeCalculator: CalculatorDefinition = {
  slug: "court-fee-calculator",
  title: "Court Fee Calculator",
  description: "Free court fee calculator. Estimate court filing fees for civil cases, divorce, small claims, and more. Fees vary by jurisdiction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["court fee calculator", "filing fee calculator", "court costs", "legal fees calculator", "small claims court fee"],
  variants: [
    {
      id: "court-filing",
      name: "Court Filing Fee Estimator",
      description: "Estimate court filing fees based on case type and amount in dispute",
      fields: [
        { name: "caseType", label: "Case Type", type: "select", options: [
          { label: "Small Claims (under $10,000)", value: "small-claims" },
          { label: "Civil (General)", value: "civil" },
          { label: "Divorce (No Children)", value: "divorce-no-kids" },
          { label: "Divorce (With Children)", value: "divorce-kids" },
          { label: "Bankruptcy (Chapter 7)", value: "bankruptcy-7" },
          { label: "Bankruptcy (Chapter 13)", value: "bankruptcy-13" },
          { label: "Name Change", value: "name-change" },
          { label: "Restraining Order", value: "restraining" },
        ], defaultValue: "small-claims" },
        { name: "amount", label: "Amount in Dispute (if applicable)", type: "number", placeholder: "e.g. 5000", prefix: "$", defaultValue: 0 },
        { name: "attorney", label: "Using an Attorney?", type: "select", options: [
          { label: "No (Self-represented)", value: "no" },
          { label: "Yes", value: "yes" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const caseType = inputs.caseType as string;
        const amount = (inputs.amount as number) || 0;
        const attorney = inputs.attorney as string;

        const feeTable: Record<string, { filing: number; service: number; other: number; description: string }> = {
          "small-claims": { filing: 75, service: 40, other: 0, description: "Small Claims Court" },
          "civil": { filing: 320, service: 75, other: 50, description: "Civil Case (General)" },
          "divorce-no-kids": { filing: 350, service: 75, other: 30, description: "Divorce (No Children)" },
          "divorce-kids": { filing: 400, service: 75, other: 50, description: "Divorce (With Children)" },
          "bankruptcy-7": { filing: 338, service: 0, other: 78, description: "Chapter 7 Bankruptcy" },
          "bankruptcy-13": { filing: 313, service: 0, other: 78, description: "Chapter 13 Bankruptcy" },
          "name-change": { filing: 150, service: 30, other: 20, description: "Legal Name Change" },
          "restraining": { filing: 0, service: 40, other: 0, description: "Restraining Order (filing is free)" },
        };

        const fees = feeTable[caseType] || feeTable["small-claims"];
        let totalFees = fees.filing + fees.service + fees.other;

        let attorneyEstimate = 0;
        if (attorney === "yes") {
          const attorneyRates: Record<string, number> = {
            "small-claims": 500,
            "civil": 3000,
            "divorce-no-kids": 2500,
            "divorce-kids": 5000,
            "bankruptcy-7": 1500,
            "bankruptcy-13": 3500,
            "name-change": 500,
            "restraining": 1500,
          };
          attorneyEstimate = attorneyRates[caseType] || 2000;
        }

        const grandTotal = totalFees + attorneyEstimate;

        return {
          primary: { label: "Estimated Total Court Costs", value: `$${formatNumber(grandTotal)}` },
          details: [
            { label: "Case type", value: fees.description },
            { label: "Filing fee", value: `$${formatNumber(fees.filing)}` },
            { label: "Service/process fee", value: `$${formatNumber(fees.service)}` },
            { label: "Other court costs", value: `$${formatNumber(fees.other)}` },
            { label: "Total court fees", value: `$${formatNumber(totalFees)}` },
            { label: "Estimated attorney fees", value: attorney === "yes" ? `$${formatNumber(attorneyEstimate)}` : "N/A (self-represented)" },
          ],
          note: "Court fees vary significantly by state and county. These are national averages for estimation purposes. Fee waivers may be available for low-income individuals. Contact your local court clerk for exact fees.",
        };
      },
    },
  ],
  relatedSlugs: ["late-fee-calculator", "notary-fee-calculator", "alimony-calculator"],
  faq: [
    { question: "Can I get court fees waived?", answer: "Yes. Most courts offer fee waivers (in forma pauperis) for individuals who meet income guidelines, typically at or below 125-200% of the federal poverty level. You'll need to file a fee waiver application with proof of income." },
    { question: "What are typical small claims court fees?", answer: "Small claims filing fees typically range from $30 to $200 depending on the state and the amount being claimed. California charges $30-$75 for claims under $10,000. Some states also charge service fees of $20-$75." },
    { question: "Do I get court fees back if I win?", answer: "In many cases, the winner can ask the judge to order the losing party to reimburse court costs and filing fees. However, this is not automatic and varies by case type and jurisdiction." },
  ],
  formula: "Total Cost = Filing Fee + Service/Process Fee + Other Court Costs + Attorney Fees (if applicable). Fees are based on national averages and vary by jurisdiction.",
};
