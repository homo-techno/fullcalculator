import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxEquivalentYieldCalculator: CalculatorDefinition = {
  slug: "tax-equivalent-yield-calculator",
  title: "Tax-Equivalent Yield Calculator",
  description:
    "Free tax-equivalent yield calculator for municipal bonds. Compare tax-free muni bond yields to taxable bond yields based on your marginal tax bracket.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tax equivalent yield",
    "municipal bond calculator",
    "muni bond yield",
    "tax free yield",
    "taxable equivalent yield",
  ],
  variants: [
    {
      id: "muni-to-taxable",
      name: "Muni Yield to Taxable Equivalent",
      description:
        "Find the taxable yield equivalent of a tax-free municipal bond",
      fields: [
        {
          name: "muniYield",
          label: "Municipal Bond Yield (Tax-Free)",
          type: "number",
          placeholder: "e.g. 3.5",
          suffix: "%",
        },
        {
          name: "federalBracket",
          label: "Federal Marginal Tax Bracket",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "24",
        },
        {
          name: "stateTaxRate",
          label: "State Income Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 0,
        },
        {
          name: "stateExempt",
          label: "State Tax Exempt?",
          type: "select",
          options: [
            { label: "Yes (in-state muni)", value: "yes" },
            { label: "No (out-of-state muni)", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const muniYield = parseFloat(inputs.muniYield as string);
        const fedRate = parseFloat(inputs.federalBracket as string);
        const stateRate = parseFloat(inputs.stateTaxRate as string) || 0;
        const stateExempt = inputs.stateExempt as string;

        if (!muniYield || muniYield <= 0 || !fedRate) return null;

        const effectiveFedRate = fedRate / 100;
        const effectiveStateRate = stateExempt === "yes" ? 0 : stateRate / 100;
        const combinedRate = effectiveFedRate + effectiveStateRate * (1 - effectiveFedRate);

        const taxEquivYield = muniYield / (1 - combinedRate);
        const taxSavingsPerThousand = (taxEquivYield - muniYield) * 10;

        return {
          primary: {
            label: "Tax-Equivalent Yield",
            value: `${formatNumber(taxEquivYield)}%`,
          },
          details: [
            { label: "Municipal bond yield", value: `${formatNumber(muniYield)}%` },
            { label: "Federal tax bracket", value: `${formatNumber(fedRate)}%` },
            { label: "State tax rate", value: `${formatNumber(stateRate)}%` },
            { label: "Combined effective tax rate", value: `${formatNumber(combinedRate * 100)}%` },
            { label: "Yield advantage", value: `${formatNumber(taxEquivYield - muniYield)}%` },
            { label: "Tax savings per $1,000 invested", value: `$${formatNumber(taxSavingsPerThousand)}` },
          ],
          note: "A taxable bond would need to yield this rate to match the after-tax return of the municipal bond. Higher tax brackets benefit more from tax-free muni bonds.",
        };
      },
    },
    {
      id: "taxable-to-muni",
      name: "Taxable Yield to Muni Equivalent",
      description:
        "Find the muni bond yield needed to match a taxable bond after taxes",
      fields: [
        {
          name: "taxableYield",
          label: "Taxable Bond Yield",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
        },
        {
          name: "federalBracket",
          label: "Federal Marginal Tax Bracket",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "24",
        },
        {
          name: "stateTaxRate",
          label: "State Income Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const taxableYield = parseFloat(inputs.taxableYield as string);
        const fedRate = parseFloat(inputs.federalBracket as string);
        const stateRate = parseFloat(inputs.stateTaxRate as string) || 0;

        if (!taxableYield || taxableYield <= 0 || !fedRate) return null;

        const combinedRate =
          fedRate / 100 + (stateRate / 100) * (1 - fedRate / 100);
        const afterTaxYield = taxableYield * (1 - combinedRate);
        const taxPaid = taxableYield - afterTaxYield;

        return {
          primary: {
            label: "Equivalent Muni Yield Needed",
            value: `${formatNumber(afterTaxYield)}%`,
          },
          details: [
            { label: "Taxable yield", value: `${formatNumber(taxableYield)}%` },
            { label: "After-tax yield", value: `${formatNumber(afterTaxYield)}%` },
            { label: "Tax on yield", value: `${formatNumber(taxPaid)}%` },
            { label: "Combined tax rate", value: `${formatNumber(combinedRate * 100)}%` },
          ],
          note: "A muni bond yielding this rate or more would be better than the taxable bond. Any tax-free muni yield above this level beats the taxable alternative after taxes.",
        };
      },
    },
  ],
  relatedSlugs: ["investment-calculator", "tax-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is tax-equivalent yield?",
      answer:
        "Tax-equivalent yield is the pre-tax yield a taxable bond must offer to match the after-tax return of a tax-free municipal bond. Formula: TEY = Muni Yield / (1 - Tax Rate). A 3.5% muni in the 32% bracket equals a 5.15% taxable bond.",
    },
    {
      question: "When are municipal bonds better than taxable bonds?",
      answer:
        "Muni bonds become more attractive as your tax bracket increases. In the 37% bracket, a 3.5% muni equals a 5.56% taxable yield. In the 12% bracket, the same muni only equals 3.98%. Compare the tax-equivalent yield to available taxable bond yields.",
    },
  ],
  formula:
    "Tax-Equivalent Yield = Municipal Bond Yield / (1 - Combined Marginal Tax Rate)",
};
