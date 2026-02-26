import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxLossHarvestCalculator: CalculatorDefinition = {
  slug: "tax-loss-harvesting-calculator",
  title: "Tax Loss Harvesting Calculator",
  description:
    "Free tax loss harvesting calculator. See how much you can save by offsetting capital gains with realized losses, including the $3,000 ordinary income deduction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tax loss harvesting",
    "capital loss offset",
    "tax loss selling",
    "wash sale",
    "capital gains offset",
  ],
  variants: [
    {
      id: "standard",
      name: "Tax Loss Harvesting Savings",
      description:
        "Calculate tax savings from offsetting gains with losses",
      fields: [
        {
          name: "shortTermGains",
          label: "Short-Term Capital Gains",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "longTermGains",
          label: "Long-Term Capital Gains",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "shortTermLosses",
          label: "Short-Term Capital Losses",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "longTermLosses",
          label: "Long-Term Capital Losses",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "ordinaryTaxRate",
          label: "Ordinary Income Tax Rate",
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
          defaultValue: "22",
        },
        {
          name: "ltcgRate",
          label: "Long-Term Capital Gains Tax Rate",
          type: "select",
          options: [
            { label: "0%", value: "0" },
            { label: "15%", value: "15" },
            { label: "20%", value: "20" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const stGains = parseFloat(inputs.shortTermGains as string) || 0;
        const ltGains = parseFloat(inputs.longTermGains as string) || 0;
        const stLosses = parseFloat(inputs.shortTermLosses as string) || 0;
        const ltLosses = parseFloat(inputs.longTermLosses as string) || 0;
        const ordRate = parseFloat(inputs.ordinaryTaxRate as string) / 100;
        const ltRate = parseFloat(inputs.ltcgRate as string) / 100;

        const totalGains = stGains + ltGains;
        const totalLosses = stLosses + ltLosses;
        if (totalGains <= 0 && totalLosses <= 0) return null;

        // Net ST and LT separately first
        let netST = stGains - stLosses;
        let netLT = ltGains - ltLosses;

        // If one is positive and the other is negative, offset
        if (netST > 0 && netLT < 0) {
          const offset = Math.min(netST, Math.abs(netLT));
          netST -= offset;
          netLT += offset;
        } else if (netLT > 0 && netST < 0) {
          const offset = Math.min(netLT, Math.abs(netST));
          netLT -= offset;
          netST += offset;
        }

        const netGain = Math.max(0, netST) + Math.max(0, netLT);
        const netLoss = Math.abs(Math.min(0, netST)) + Math.abs(Math.min(0, netLT));

        // $3,000 ordinary income deduction from excess losses
        const ordinaryDeduction = Math.min(netLoss, 3000);
        const carryForward = Math.max(0, netLoss - 3000);

        // Tax on gains without harvesting
        const taxWithoutHarvesting = stGains * ordRate + ltGains * ltRate;

        // Tax after harvesting
        const taxOnNetST = Math.max(0, netST) * ordRate;
        const taxOnNetLT = Math.max(0, netLT) * ltRate;
        const ordinaryTaxSavings = ordinaryDeduction * ordRate;
        const taxAfterHarvesting = taxOnNetST + taxOnNetLT - ordinaryTaxSavings;

        const totalTaxSavings = taxWithoutHarvesting - taxAfterHarvesting;

        return {
          primary: { label: "Tax Savings from Harvesting", value: `$${formatNumber(totalTaxSavings)}` },
          details: [
            { label: "Tax without harvesting", value: `$${formatNumber(taxWithoutHarvesting)}` },
            { label: "Tax after harvesting", value: `$${formatNumber(Math.max(0, taxAfterHarvesting))}` },
            { label: "Net taxable gains", value: `$${formatNumber(netGain)}` },
            { label: "Ordinary income deduction ($3K max)", value: `$${formatNumber(ordinaryDeduction)}` },
            { label: "Loss carry-forward to next year", value: `$${formatNumber(carryForward)}` },
          ],
          note: "Losses first offset same-type gains, then cross-offset. Excess losses deduct up to $3,000 from ordinary income. Remaining losses carry forward indefinitely. Beware of the wash-sale rule (30-day window).",
        };
      },
    },
  ],
  relatedSlugs: ["capital-gains-tax-detailed-calculator", "tax-calculator", "stock-return-calculator"],
  faq: [
    {
      question: "What is tax loss harvesting?",
      answer:
        "Tax loss harvesting is selling investments at a loss to offset capital gains and reduce your tax bill. Short-term losses first offset short-term gains, and long-term losses offset long-term gains. Excess losses can offset up to $3,000 of ordinary income per year.",
    },
    {
      question: "What is the wash-sale rule?",
      answer:
        "The wash-sale rule prohibits claiming a loss if you buy a substantially identical security within 30 days before or after the sale. If triggered, the loss is added to the cost basis of the replacement security rather than being deductible.",
    },
    {
      question: "Can capital losses carry forward?",
      answer:
        "Yes. After offsetting all capital gains and deducting $3,000 from ordinary income, any remaining capital losses carry forward to future tax years indefinitely until fully used.",
    },
  ],
  formula:
    "Net Gain/Loss = (ST Gains - ST Losses) + (LT Gains - LT Losses). Tax Savings = Tax on gross gains - Tax on net position - ordinary income deduction benefit",
};
