import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customsDuty: CalculatorDefinition = {
  slug: "customs-duty",
  title: "Customs Duty Calculator",
  description:
    "Free online customs duty calculator. Estimate customs duty and taxes on goods brought back from international travel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "customs duty",
    "import tax",
    "duty free allowance",
    "customs declaration",
    "import duty",
  ],
  variants: [
    {
      id: "us-duty",
      name: "US Customs Duty Estimate",
      fields: [
        {
          name: "totalValue",
          label: "Total Value of Goods ($)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "goodsCategory",
          label: "Goods Category",
          type: "select",
          options: [
            { label: "Clothing & Textiles", value: "clothing" },
            { label: "Electronics", value: "electronics" },
            { label: "Jewelry & Watches", value: "jewelry" },
            { label: "Alcohol (up to 1 liter duty-free)", value: "alcohol" },
            { label: "Tobacco / Cigarettes", value: "tobacco" },
            { label: "Perfume & Cosmetics", value: "perfume" },
            { label: "Food & Groceries", value: "food" },
            { label: "Art & Antiques", value: "art" },
            { label: "General Merchandise", value: "general" },
          ],
        },
        {
          name: "travelers",
          label: "Number of Travelers in Party",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const totalValue = parseFloat(inputs.totalValue as string) || 0;
        const goodsCategory = inputs.goodsCategory as string;
        const travelers = parseFloat(inputs.travelers as string) || 1;

        // US personal exemption is $800 per person
        const exemption = 800 * travelers;
        const dutiableAmount = Math.max(0, totalValue - exemption);

        // Approximate duty rates by category
        const dutyRates: Record<string, number> = {
          clothing: 0.12,
          electronics: 0.0,
          jewelry: 0.065,
          alcohol: 0.03,
          tobacco: 0.15,
          perfume: 0.05,
          food: 0.05,
          art: 0.0,
          general: 0.03,
        };

        const dutyRate = dutyRates[goodsCategory] || 0.03;
        const dutyAmount = dutiableAmount * dutyRate;

        // Flat duty rate for next $1000 above exemption
        const flatRateAmount = Math.min(1000 * travelers, dutiableAmount);
        const flatDuty = flatRateAmount * 0.03;
        const regularDuty = Math.max(0, dutiableAmount - flatRateAmount) * dutyRate;
        const totalDuty = flatDuty + regularDuty;

        return {
          primary: { label: "Estimated Duty", value: "$" + formatNumber(totalDuty, 2) },
          details: [
            { label: "Total Goods Value", value: "$" + formatNumber(totalValue, 2) },
            { label: "Personal Exemption", value: "$" + formatNumber(exemption, 2) },
            { label: "Dutiable Amount", value: "$" + formatNumber(dutiableAmount, 2) },
            { label: "Flat Rate Portion (3%)", value: "$" + formatNumber(flatDuty, 2) },
            { label: "Regular Duty Rate", value: formatNumber(dutyRate * 100, 1) + "%" },
            { label: "Regular Duty Portion", value: "$" + formatNumber(regularDuty, 2) },
          ],
          note: "Estimates only. Actual duty may vary. Certain items may be restricted.",
        };
      },
    },
  ],
  relatedSlugs: ["duty-free-savings", "currency-converter-trip", "carry-on-weight"],
  faq: [
    {
      question: "What is the US customs duty-free allowance?",
      answer:
        "US residents can bring back up to $800 worth of goods duty-free per person. The next $1,000 is subject to a flat 3% duty rate. Values above that are taxed at the normal duty rate for the goods category.",
    },
    {
      question: "Do I need to declare everything at customs?",
      answer:
        "Yes, you must declare all items acquired abroad, even if they are within the duty-free exemption. Failure to declare can result in penalties and seizure of goods.",
    },
    {
      question: "What items cannot be brought into the US?",
      answer:
        "Prohibited items include most fresh fruits and vegetables, meats, certain plants, counterfeit goods, Cuban cigars (in excess of limits), and items made from endangered species.",
    },
  ],
  formula:
    "Duty = (First $1000 above exemption x 3%) + (Remaining amount x Category Duty Rate)\nExemption = $800 per traveler",
};
