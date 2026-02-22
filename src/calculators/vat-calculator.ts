import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vatCalculator: CalculatorDefinition = {
  slug: "vat-calculator",
  title: "VAT Calculator",
  description:
    "Free VAT calculator. Add or remove Value Added Tax from any amount. Supports UK, EU, and international VAT rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "VAT calculator",
    "value added tax calculator",
    "add VAT",
    "remove VAT",
    "VAT inclusive",
    "VAT exclusive",
    "UK VAT calculator",
    "EU VAT",
  ],
  variants: [
    {
      id: "add-vat",
      name: "Add VAT",
      description: "Calculate the price including VAT",
      fields: [
        {
          name: "amount",
          label: "Net Amount (excl. VAT)",
          type: "number",
          placeholder: "e.g. 1000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "VAT Rate",
          type: "select",
          options: [
            { label: "5%", value: "5" },
            { label: "7%", value: "7" },
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "15%", value: "15" },
            { label: "17%", value: "17" },
            { label: "19%", value: "19" },
            { label: "20% (UK Standard)", value: "20" },
            { label: "21%", value: "21" },
            { label: "23%", value: "23" },
            { label: "25%", value: "25" },
            { label: "27%", value: "27" },
          ],
          defaultValue: "20",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rate = parseFloat(inputs.rate as string);
        if (!amount || !rate) return null;

        const vatAmount = amount * (rate / 100);
        const totalAmount = amount + vatAmount;

        return {
          primary: { label: "Gross Amount (incl. VAT)", value: `$${formatNumber(totalAmount, 2)}` },
          details: [
            { label: "Net amount (excl. VAT)", value: `$${formatNumber(amount, 2)}` },
            { label: `VAT amount (${rate}%)`, value: `$${formatNumber(vatAmount, 2)}` },
          ],
        };
      },
    },
    {
      id: "remove-vat",
      name: "Remove VAT",
      description: "Calculate the price excluding VAT from a gross amount",
      fields: [
        {
          name: "grossAmount",
          label: "Gross Amount (incl. VAT)",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "VAT Rate",
          type: "select",
          options: [
            { label: "5%", value: "5" },
            { label: "7%", value: "7" },
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "15%", value: "15" },
            { label: "17%", value: "17" },
            { label: "19%", value: "19" },
            { label: "20% (UK Standard)", value: "20" },
            { label: "21%", value: "21" },
            { label: "23%", value: "23" },
            { label: "25%", value: "25" },
            { label: "27%", value: "27" },
          ],
          defaultValue: "20",
        },
      ],
      calculate: (inputs) => {
        const grossAmount = inputs.grossAmount as number;
        const rate = parseFloat(inputs.rate as string);
        if (!grossAmount || !rate) return null;

        const netAmount = grossAmount / (1 + rate / 100);
        const vatAmount = grossAmount - netAmount;

        return {
          primary: { label: "Net Amount (excl. VAT)", value: `$${formatNumber(netAmount, 2)}` },
          details: [
            { label: `VAT amount (${rate}%)`, value: `$${formatNumber(vatAmount, 2)}` },
            { label: "Gross amount (incl. VAT)", value: `$${formatNumber(grossAmount, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gst-calculator", "sales-tax-calculator", "tax-calculator"],
  faq: [
    {
      question: "What is VAT?",
      answer:
        "VAT (Value Added Tax) is a consumption tax placed on a product whenever value is added at each stage of the supply chain, from production to the point of sale. Unlike sales tax, VAT is collected incrementally at each stage.",
    },
    {
      question: "How do I calculate VAT?",
      answer:
        "To add VAT: Gross = Net × (1 + VAT Rate/100). To remove VAT: Net = Gross / (1 + VAT Rate/100). For example, at 20% VAT on $1,000: VAT = $200, Gross = $1,200.",
    },
    {
      question: "What are common VAT rates worldwide?",
      answer:
        "Common VAT rates include: UK 20%, Germany 19%, France 20%, India replaced VAT with GST, Canada 5% (federal GST), Australia 10% GST, Japan 10%, Brazil varies by state. Hungary has the highest standard rate at 27%.",
    },
  ],
  formula: "VAT = Net Amount × (VAT Rate / 100) | Gross = Net × (1 + Rate/100)",
};
