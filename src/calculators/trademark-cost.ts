import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trademarkCostCalculator: CalculatorDefinition = {
  slug: "trademark-cost-calculator",
  title: "Trademark Registration Cost Calculator",
  description: "Free trademark cost calculator. Estimate the total cost of registering a trademark with the USPTO, including filing fees, attorney fees, and renewal costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["trademark cost calculator", "trademark registration fee", "trademark filing cost", "USPTO trademark fee", "how much to trademark"],
  variants: [
    {
      id: "trademark-cost",
      name: "Trademark Cost Estimator",
      description: "Estimate total cost to register a trademark with the USPTO",
      fields: [
        { name: "filingBasis", label: "Filing Type", type: "select", options: [
          { label: "TEAS Plus ($250/class - requires pre-approved goods/services)", value: "teas-plus" },
          { label: "TEAS Standard ($350/class)", value: "teas-standard" },
        ], defaultValue: "teas-plus" },
        { name: "numClasses", label: "Number of International Classes", type: "select", options: [
          { label: "1 class (most common)", value: "1" },
          { label: "2 classes", value: "2" },
          { label: "3 classes", value: "3" },
          { label: "4 classes", value: "4" },
          { label: "5 classes", value: "5" },
        ], defaultValue: "1" },
        { name: "useAttorney", label: "Use a Trademark Attorney?", type: "select", options: [
          { label: "Yes (recommended)", value: "yes" },
          { label: "No (self-filing)", value: "no" },
          { label: "Online filing service", value: "service" },
        ], defaultValue: "yes" },
        { name: "searchType", label: "Trademark Search", type: "select", options: [
          { label: "Free search (USPTO TESS only)", value: "free" },
          { label: "Comprehensive professional search", value: "comprehensive" },
        ], defaultValue: "free" },
        { name: "intentToUse", label: "Filing Basis", type: "select", options: [
          { label: "Already in use (Section 1(a))", value: "in-use" },
          { label: "Intent-to-use (Section 1(b))", value: "itu" },
        ], defaultValue: "in-use" },
      ],
      calculate: (inputs) => {
        const filingBasis = inputs.filingBasis as string;
        const numClasses = parseInt(inputs.numClasses as string) || 1;
        const useAttorney = inputs.useAttorney as string;
        const searchType = inputs.searchType as string;
        const intentToUse = inputs.intentToUse as string;

        const perClassFee = filingBasis === "teas-plus" ? 250 : 350;
        const filingFee = perClassFee * numClasses;

        // Intent-to-use additional fees
        const ituFee = intentToUse === "itu" ? 100 * numClasses : 0; // Statement of use fee

        // Attorney fees
        let attorneyFee = 0;
        if (useAttorney === "yes") {
          attorneyFee = 1000 + (numClasses - 1) * 250; // Base + per additional class
        } else if (useAttorney === "service") {
          attorneyFee = 350 + (numClasses - 1) * 100; // Online service fee
        }

        // Search costs
        const searchFee = searchType === "comprehensive" ? 500 : 0;

        // Office action response (estimate ~30% probability)
        const officeActionEstimate = 250;

        const totalInitial = filingFee + ituFee + attorneyFee + searchFee;
        const totalWithContingency = totalInitial + officeActionEstimate;

        // Renewal costs (every 10 years)
        const renewalFee = 325 * numClasses; // Section 8 & 9
        const maintenanceFee = 225 * numClasses; // Section 8 (between years 5-6)

        return {
          primary: { label: "Estimated Total Initial Cost", value: `$${formatNumber(totalInitial)}` },
          details: [
            { label: "USPTO filing fee", value: `$${formatNumber(filingFee)} ($${perClassFee} × ${numClasses} class${numClasses > 1 ? "es" : ""})` },
            { label: "Intent-to-use fee", value: intentToUse === "itu" ? `$${formatNumber(ituFee)}` : "N/A (already in use)" },
            { label: "Attorney/service fee", value: attorneyFee > 0 ? `$${formatNumber(attorneyFee)}` : "Self-filing" },
            { label: "Trademark search", value: searchFee > 0 ? `$${formatNumber(searchFee)}` : "Free (USPTO TESS)" },
            { label: "Contingency (office action)", value: `~$${formatNumber(officeActionEstimate)} (if needed)` },
            { label: "Total with contingency", value: `$${formatNumber(totalWithContingency)}` },
            { label: "Section 8 maintenance (yr 5-6)", value: `$${formatNumber(maintenanceFee)}` },
            { label: "Renewal (every 10 years)", value: `$${formatNumber(renewalFee)}` },
          ],
          note: "Trademark registration typically takes 8-12 months with the USPTO. Additional costs may apply if the examining attorney issues an office action or if you need to respond to opposition proceedings. A trademark lasts indefinitely if properly maintained and renewed.",
        };
      },
    },
  ],
  relatedSlugs: ["patent-cost-calculator", "business-license-calculator", "llc-cost-calculator"],
  faq: [
    { question: "How much does it cost to trademark a name?", answer: "The minimum USPTO filing fee is $250 per class (TEAS Plus) or $350 per class (TEAS Standard). With an attorney, total costs are typically $1,000-$2,000 for a single-class trademark. Self-filing saves on attorney fees but increases the risk of errors and rejections." },
    { question: "How long does trademark registration take?", answer: "The typical timeline is 8-12 months from filing to registration if there are no issues. If the USPTO examining attorney raises concerns (office actions), it can take 12-18 months or longer. Intent-to-use applications may take even longer as you need to show actual use." },
    { question: "Do I need a trademark attorney?", answer: "While not legally required, the USPTO recommends using a trademark attorney. Applications filed with attorneys have significantly higher success rates. An attorney can conduct proper clearance searches, correctly identify goods/services classes, and handle office actions effectively." },
  ],
  formula: "Total Cost = USPTO Filing Fee ($250-$350 × Classes) + ITU Fee (if applicable) + Attorney Fee + Search Fee. Ongoing: Section 8 maintenance at years 5-6 and renewal every 10 years.",
};
