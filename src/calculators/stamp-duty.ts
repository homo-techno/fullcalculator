import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stampDutyCalculator: CalculatorDefinition = {
  slug: "stamp-duty-calculator",
  title: "Stamp Duty Calculator",
  description:
    "Free stamp duty calculator. Calculate property transfer tax, stamp duty land tax (SDLT), and real estate transfer fees based on property price and buyer type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "stamp duty calculator",
    "SDLT calculator",
    "property transfer tax",
    "stamp duty land tax",
    "real estate transfer tax",
  ],
  variants: [
    {
      id: "uk-sdlt",
      name: "UK Stamp Duty (SDLT)",
      description: "Calculate UK stamp duty land tax",
      fields: [
        { name: "propertyPrice", label: "Property Price", type: "number", placeholder: "e.g. 500000", prefix: "$", min: 0 },
        {
          name: "buyerType",
          label: "Buyer Type",
          type: "select",
          options: [
            { label: "First-time buyer", value: "first" },
            { label: "Home mover", value: "mover" },
            { label: "Additional property", value: "additional" },
          ],
          defaultValue: "mover",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.propertyPrice as number;
        const buyerType = inputs.buyerType as string;
        if (!price) return null;

        // UK SDLT bands (standard rates for home movers)
        const bands = [
          { threshold: 250000, rate: 0 },
          { threshold: 925000, rate: 0.05 },
          { threshold: 1500000, rate: 0.10 },
          { threshold: Infinity, rate: 0.12 },
        ];

        // First-time buyer adjustments (0% up to £425K, 5% up to £625K)
        const firstTimeBands = [
          { threshold: 425000, rate: 0 },
          { threshold: 625000, rate: 0.05 },
          { threshold: 925000, rate: 0.05 },
          { threshold: 1500000, rate: 0.10 },
          { threshold: Infinity, rate: 0.12 },
        ];

        const surcharge = buyerType === "additional" ? 0.03 : 0;
        const activeBands = buyerType === "first" && price <= 625000 ? firstTimeBands : bands;

        let tax = 0;
        let prev = 0;
        for (const band of activeBands) {
          if (price <= prev) break;
          const taxable = Math.min(price, band.threshold) - prev;
          if (taxable > 0) {
            tax += taxable * (band.rate + surcharge);
          }
          prev = band.threshold;
        }

        const effectiveRate = (tax / price) * 100;

        return {
          primary: { label: "Stamp Duty", value: `$${formatNumber(tax)}` },
          details: [
            { label: "Property price", value: `$${formatNumber(price)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "Buyer type", value: buyerType === "first" ? "First-time buyer" : buyerType === "additional" ? "Additional property (+3%)" : "Home mover" },
            { label: "Price after stamp duty", value: `$${formatNumber(price + tax)}` },
          ],
          note: buyerType === "first" && price > 625000 ? "First-time buyer relief is not available for properties over £625,000. Standard rates applied." : undefined,
        };
      },
    },
    {
      id: "flat-rate",
      name: "Flat Rate Transfer Tax",
      description: "Calculate property transfer tax with a flat percentage rate",
      fields: [
        { name: "propertyPrice", label: "Property Price", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
        { name: "taxRate", label: "Transfer Tax Rate", type: "number", placeholder: "e.g. 2", suffix: "%", min: 0, max: 20, step: 0.01 },
        { name: "otherFees", label: "Other Recording Fees", type: "number", placeholder: "e.g. 500", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const price = inputs.propertyPrice as number;
        const rate = (inputs.taxRate as number) || 0;
        const fees = (inputs.otherFees as number) || 0;
        if (!price) return null;

        const tax = price * (rate / 100);
        const total = tax + fees;

        return {
          primary: { label: "Total Transfer Tax & Fees", value: `$${formatNumber(total)}` },
          details: [
            { label: "Transfer tax", value: `$${formatNumber(tax)}` },
            { label: "Recording / other fees", value: `$${formatNumber(fees)}` },
            { label: "Effective rate (total)", value: `${formatNumber((total / price) * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["closing-cost-calculator", "mortgage-calculator", "home-value-calculator"],
  faq: [
    {
      question: "What is stamp duty?",
      answer:
        "Stamp duty (or stamp duty land tax / property transfer tax) is a tax you pay when purchasing real estate. The amount depends on the property price, your buyer status (first-time, home mover, or investor), and your jurisdiction's tax bands.",
    },
    {
      question: "Do first-time buyers pay less stamp duty?",
      answer:
        "In many jurisdictions, yes. For example, in the UK, first-time buyers pay no SDLT on properties up to £425,000 and 5% on the portion between £425,001 and £625,000. Properties over £625,000 receive no first-time buyer relief.",
    },
    {
      question: "Is stamp duty the same as closing costs?",
      answer:
        "Stamp duty is one component of closing costs. Other closing costs include legal fees, home inspection, appraisal fees, lender fees, and title insurance. Stamp duty (or transfer tax) specifically is the government tax on the property transfer.",
    },
  ],
  formula:
    "Stamp Duty = Sum of (Taxable Amount in Each Band × Band Rate) | Flat Rate Tax = Property Price × Tax Rate",
};
