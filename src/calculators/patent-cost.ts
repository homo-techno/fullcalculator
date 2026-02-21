import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patentCostCalculator: CalculatorDefinition = {
  slug: "patent-cost-calculator",
  title: "Patent Filing Cost Calculator",
  description: "Free patent cost calculator. Estimate the total cost of filing a patent including USPTO fees, attorney fees, and maintenance costs for utility, design, and provisional patents.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["patent cost calculator", "patent filing fee", "patent attorney cost", "how much does a patent cost", "USPTO patent fee calculator"],
  variants: [
    {
      id: "patent-cost",
      name: "Patent Cost Estimator",
      description: "Estimate total patent costs including filing, prosecution, and maintenance fees",
      fields: [
        { name: "patentType", label: "Patent Type", type: "select", options: [
          { label: "Utility Patent (most common)", value: "utility" },
          { label: "Design Patent", value: "design" },
          { label: "Provisional Patent Application", value: "provisional" },
          { label: "Plant Patent", value: "plant" },
        ], defaultValue: "utility" },
        { name: "entitySize", label: "Entity Size (affects USPTO fees)", type: "select", options: [
          { label: "Large entity (500+ employees)", value: "large" },
          { label: "Small entity (under 500 employees)", value: "small" },
          { label: "Micro entity (income under $229,269)", value: "micro" },
        ], defaultValue: "small" },
        { name: "complexity", label: "Invention Complexity", type: "select", options: [
          { label: "Simple (mechanical, basic software)", value: "simple" },
          { label: "Moderate (electrical, moderate software)", value: "moderate" },
          { label: "Complex (biotech, advanced software, chemical)", value: "complex" },
        ], defaultValue: "moderate" },
        { name: "useAttorney", label: "Patent Attorney?", type: "select", options: [
          { label: "Yes (recommended)", value: "yes" },
          { label: "No (self-filing)", value: "no" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const patentType = inputs.patentType as string;
        const entitySize = inputs.entitySize as string;
        const complexity = inputs.complexity as string;
        const useAttorney = inputs.useAttorney as string;

        // USPTO filing fees (2024 approximate)
        const filingFees: Record<string, Record<string, number>> = {
          utility: { large: 1820, small: 910, micro: 455 },
          design: { large: 1060, small: 530, micro: 265 },
          provisional: { large: 320, small: 160, micro: 80 },
          plant: { large: 1420, small: 710, micro: 355 },
        };

        const searchFees: Record<string, Record<string, number>> = {
          utility: { large: 700, small: 350, micro: 175 },
          design: { large: 200, small: 100, micro: 50 },
          provisional: { large: 0, small: 0, micro: 0 },
          plant: { large: 500, small: 250, micro: 125 },
        };

        const examinationFees: Record<string, Record<string, number>> = {
          utility: { large: 800, small: 400, micro: 200 },
          design: { large: 760, small: 380, micro: 190 },
          provisional: { large: 0, small: 0, micro: 0 },
          plant: { large: 620, small: 310, micro: 155 },
        };

        const issueFees: Record<string, Record<string, number>> = {
          utility: { large: 1200, small: 600, micro: 300 },
          design: { large: 760, small: 380, micro: 190 },
          provisional: { large: 0, small: 0, micro: 0 },
          plant: { large: 920, small: 460, micro: 230 },
        };

        const filing = filingFees[patentType]?.[entitySize] || 0;
        const search = searchFees[patentType]?.[entitySize] || 0;
        const examination = examinationFees[patentType]?.[entitySize] || 0;
        const issue = issueFees[patentType]?.[entitySize] || 0;
        const totalUSPTO = filing + search + examination + issue;

        // Attorney fees by complexity
        const attorneyFees: Record<string, Record<string, number>> = {
          utility: { simple: 8000, moderate: 12000, complex: 18000 },
          design: { simple: 2500, moderate: 3500, complex: 5000 },
          provisional: { simple: 2000, moderate: 3000, complex: 5000 },
          plant: { simple: 5000, moderate: 7000, complex: 10000 },
        };

        const attorney = useAttorney === "yes" ? (attorneyFees[patentType]?.[complexity] || 0) : 0;

        // Maintenance fees for utility patents (20-year total)
        let maintenanceFees = 0;
        if (patentType === "utility") {
          const maintenanceRates: Record<string, number[]> = {
            large: [2000, 3760, 7700],
            small: [1000, 1880, 3850],
            micro: [500, 940, 1925],
          };
          const rates = maintenanceRates[entitySize] || maintenanceRates.small;
          maintenanceFees = rates[0] + rates[1] + rates[2];
        }

        const totalInitial = totalUSPTO + attorney;
        const grandTotal = totalInitial + maintenanceFees;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(grandTotal)}` },
          details: [
            { label: "USPTO filing fee", value: `$${formatNumber(filing)}` },
            { label: "USPTO search fee", value: `$${formatNumber(search)}` },
            { label: "USPTO examination fee", value: `$${formatNumber(examination)}` },
            { label: "USPTO issue fee", value: `$${formatNumber(issue)}` },
            { label: "Total USPTO fees", value: `$${formatNumber(totalUSPTO)}` },
            { label: "Attorney fees", value: useAttorney === "yes" ? `$${formatNumber(attorney)}` : "Self-filing" },
            { label: "Initial filing cost", value: `$${formatNumber(totalInitial)}` },
            { label: "Maintenance fees (20-year)", value: patentType === "utility" ? `$${formatNumber(maintenanceFees)}` : "N/A" },
          ],
          note: "Patent costs vary significantly based on the invention's complexity and the number of office actions during prosecution. Additional costs may include drawings ($300-$1,000), international filings ($5,000-$15,000+ per country), and continuation applications. A provisional patent gives 12 months to file a full utility patent.",
        };
      },
    },
  ],
  relatedSlugs: ["trademark-cost-calculator", "business-license-calculator", "llc-cost-calculator"],
  faq: [
    { question: "How much does a patent cost?", answer: "Total costs range from $5,000-$25,000+ for a utility patent. USPTO fees alone are $2,000-$4,500 depending on entity size. Attorney fees add $8,000-$18,000+ depending on complexity. Simple inventions cost less; biotech/software patents cost more. Provisional patents are cheaper at $2,000-$5,000 total." },
    { question: "What is the difference between a provisional and utility patent?", answer: "A provisional patent application (PPA) is a placeholder that establishes a filing date for 12 months at lower cost ($80-$320 USPTO fee). It's not examined and expires after 12 months unless you file a full utility patent application. A utility patent provides 20 years of protection but costs more and takes 2-3 years to process." },
    { question: "What are patent maintenance fees?", answer: "Utility patents require maintenance fees at 3.5, 7.5, and 11.5 years after issuance to keep the patent active for its full 20-year term. Total maintenance fees range from $3,365 (micro entity) to $13,460 (large entity). Design and plant patents have no maintenance fees." },
  ],
  formula: "Total Cost = USPTO Filing Fee + Search Fee + Examination Fee + Issue Fee + Attorney Fees + Maintenance Fees (utility patents only). Entity size discounts: small = 50%, micro = 75% off base fees.",
};
