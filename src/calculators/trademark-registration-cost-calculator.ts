import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trademarkRegistrationCostCalculator: CalculatorDefinition = {
  slug: "trademark-registration-cost-calculator",
  title: "Trademark Registration Cost Calculator",
  description: "Estimate total costs for trademark registration including filing and attorney fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["trademark registration","trademark filing","trademark cost","brand registration"],
  variants: [{
    id: "standard",
    name: "Trademark Registration Cost",
    description: "Estimate total costs for trademark registration including filing and attorney fees.",
    fields: [
      { name: "classes", label: "Number of Classes", type: "number", min: 1, max: 45, defaultValue: 1 },
      { name: "filingBasis", label: "Filing Basis", type: "select", options: [{ value: "1", label: "TEAS Plus ($250/class)" }, { value: "2", label: "TEAS Standard ($350/class)" }], defaultValue: "1" },
      { name: "useAttorney", label: "Attorney Assistance", type: "select", options: [{ value: "0", label: "Self-Filing" }, { value: "1", label: "Attorney ($1,000-$2,000)" }], defaultValue: "1" },
      { name: "searchType", label: "Trademark Search", type: "select", options: [{ value: "0", label: "No Search" }, { value: "1", label: "Basic Search ($100)" }, { value: "2", label: "Comprehensive Search ($500)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const classes = inputs.classes as number;
    const filingBasis = parseInt(inputs.filingBasis as string);
    const useAttorney = parseInt(inputs.useAttorney as string);
    const searchType = parseInt(inputs.searchType as string);
    const filingFee = filingBasis === 1 ? 250 * classes : 350 * classes;
    const attorneyFee = useAttorney === 1 ? 1500 : 0;
    const searchFees = [0, 100, 500][searchType] || 0;
    const maintenanceFee = 225 * classes;
    const totalInitial = filingFee + attorneyFee + searchFees;
    return {
      primary: { label: "Total Initial Registration Cost", value: "$" + formatNumber(totalInitial) },
      details: [
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Search Fee", value: "$" + formatNumber(searchFees) },
        { label: "Maintenance (Year 5-6)", value: "$" + formatNumber(maintenanceFee) + " per class" }
      ]
    };
  },
  }],
  relatedSlugs: ["patent-filing-cost-calculator","copyright-registration-cost-calculator","intellectual-property-value-calculator"],
  faq: [
    { question: "How much does it cost to register a trademark?", answer: "Federal trademark registration costs $250 to $350 per class for filing fees, plus optional attorney fees of $1,000 to $2,000 or more." },
    { question: "How long does trademark registration take?", answer: "The USPTO process typically takes 8 to 12 months if there are no issues, and longer if an office action or opposition is filed." },
    { question: "Do I need a lawyer to file a trademark?", answer: "While not required for US applicants, an attorney can help avoid costly mistakes, respond to office actions, and ensure comprehensive protection." },
  ],
  formula: "Total Cost = (Filing Fee x Classes) + Attorney Fee + Search Fee",
};
