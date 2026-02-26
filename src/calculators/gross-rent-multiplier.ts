import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grossRentMultiplierCalculator: CalculatorDefinition = {
  slug: "gross-rent-multiplier-calculator",
  title: "Gross Rent Multiplier (GRM) Calculator",
  description:
    "Free online Gross Rent Multiplier calculator. Evaluate rental property investments using GRM to quickly compare properties and estimate fair market value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "GRM calculator",
    "gross rent multiplier",
    "rental property calculator",
    "real estate GRM",
    "property valuation calculator",
  ],
  variants: [
    {
      id: "grm",
      name: "Calculate GRM",
      description: "Calculate the Gross Rent Multiplier for a property",
      fields: [
        { name: "price", label: "Property Price", type: "number", placeholder: "e.g. 250000", prefix: "$" },
        { name: "monthlyRent", label: "Monthly Gross Rent", type: "number", placeholder: "e.g. 2000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.price as string) || 0;
        const monthlyRent = parseFloat(inputs.monthlyRent as string) || 0;
        if (!price || !monthlyRent) return null;

        const annualRent = monthlyRent * 12;
        const grm = price / annualRent;
        const onePercentRule = (monthlyRent / price) * 100;

        return {
          primary: { label: "Gross Rent Multiplier", value: formatNumber(grm) },
          details: [
            { label: "Annual gross rent", value: `$${formatNumber(annualRent)}` },
            { label: "Property price", value: `$${formatNumber(price)}` },
            { label: "Rent-to-price ratio", value: `${formatNumber(onePercentRule)}%` },
            { label: "Years to recoup price (gross)", value: formatNumber(grm) },
          ],
          note: grm < 8 ? "A GRM under 8 is generally considered a good investment." : grm > 15 ? "A GRM above 15 may indicate the property is overpriced relative to rents." : "A GRM between 8-15 is typical for most markets.",
        };
      },
    },
    {
      id: "estimate-value",
      name: "Estimate Property Value from GRM",
      description: "Estimate fair market value using a target GRM",
      fields: [
        { name: "monthlyRent", label: "Monthly Gross Rent", type: "number", placeholder: "e.g. 2000", prefix: "$" },
        { name: "targetGrm", label: "Target GRM (market average)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const monthlyRent = parseFloat(inputs.monthlyRent as string) || 0;
        const targetGrm = parseFloat(inputs.targetGrm as string) || 0;
        if (!monthlyRent || !targetGrm) return null;

        const annualRent = monthlyRent * 12;
        const estimatedValue = annualRent * targetGrm;

        return {
          primary: { label: "Estimated Property Value", value: `$${formatNumber(estimatedValue)}` },
          details: [
            { label: "Annual gross rent", value: `$${formatNumber(annualRent)}` },
            { label: "Target GRM", value: formatNumber(targetGrm) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["noi-calculator", "roi-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "What is a good Gross Rent Multiplier?",
      answer:
        "GRM varies by market, but generally a lower GRM indicates a better value. In many markets, a GRM of 4-7 is excellent, 8-12 is average, and above 15 may be overpriced. Always compare GRM to local market averages.",
    },
    {
      question: "What is the difference between GRM and cap rate?",
      answer:
        "GRM uses gross rent (before expenses) and compares it to price, while cap rate uses Net Operating Income (rent minus expenses). Cap rate is more precise because it accounts for operating costs. GRM is simpler but less accurate.",
    },
  ],
  formula: "GRM = Property Price / Annual Gross Rent",
};
