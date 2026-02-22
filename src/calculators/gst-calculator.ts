import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gstCalculator: CalculatorDefinition = {
  slug: "gst-calculator",
  title: "GST Calculator",
  description:
    "Free GST calculator. Calculate Goods and Services Tax for India including CGST, SGST, and IGST. Add or remove GST from any amount.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "GST calculator",
    "GST calculator India",
    "CGST SGST calculator",
    "IGST calculator",
    "goods and services tax",
    "add GST",
    "remove GST",
  ],
  variants: [
    {
      id: "add-gst",
      name: "Add GST",
      description: "Calculate price after adding GST",
      fields: [
        {
          name: "amount",
          label: "Original Amount",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "GST Rate",
          type: "select",
          options: [
            { label: "5%", value: "5" },
            { label: "12%", value: "12" },
            { label: "18%", value: "18" },
            { label: "28%", value: "28" },
          ],
          defaultValue: "18",
        },
        {
          name: "taxType",
          label: "Tax Type",
          type: "select",
          options: [
            { label: "IGST (Inter-State)", value: "igst" },
            { label: "CGST + SGST (Intra-State)", value: "cgst_sgst" },
          ],
          defaultValue: "cgst_sgst",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rate = parseFloat(inputs.rate as string);
        const taxType = inputs.taxType as string;
        if (!amount || !rate) return null;

        const gstAmount = amount * (rate / 100);
        const totalAmount = amount + gstAmount;

        const details = [
          { label: "Original amount", value: `₹${formatNumber(amount)}` },
          { label: `GST (${rate}%)`, value: `₹${formatNumber(gstAmount)}` },
        ];

        if (taxType === "cgst_sgst") {
          details.push(
            { label: `CGST (${rate / 2}%)`, value: `₹${formatNumber(gstAmount / 2)}` },
            { label: `SGST (${rate / 2}%)`, value: `₹${formatNumber(gstAmount / 2)}` }
          );
        } else {
          details.push({ label: `IGST (${rate}%)`, value: `₹${formatNumber(gstAmount)}` });
        }

        return {
          primary: { label: "Total Amount (incl. GST)", value: `₹${formatNumber(totalAmount)}` },
          details,
        };
      },
    },
    {
      id: "remove-gst",
      name: "Remove GST",
      description: "Calculate original price by removing GST from the total",
      fields: [
        {
          name: "totalAmount",
          label: "Amount (incl. GST)",
          type: "number",
          placeholder: "e.g. 11800",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "GST Rate",
          type: "select",
          options: [
            { label: "5%", value: "5" },
            { label: "12%", value: "12" },
            { label: "18%", value: "18" },
            { label: "28%", value: "28" },
          ],
          defaultValue: "18",
        },
        {
          name: "taxType",
          label: "Tax Type",
          type: "select",
          options: [
            { label: "IGST (Inter-State)", value: "igst" },
            { label: "CGST + SGST (Intra-State)", value: "cgst_sgst" },
          ],
          defaultValue: "cgst_sgst",
        },
      ],
      calculate: (inputs) => {
        const totalAmount = inputs.totalAmount as number;
        const rate = parseFloat(inputs.rate as string);
        const taxType = inputs.taxType as string;
        if (!totalAmount || !rate) return null;

        const originalAmount = totalAmount / (1 + rate / 100);
        const gstAmount = totalAmount - originalAmount;

        const details = [
          { label: `GST (${rate}%)`, value: `₹${formatNumber(gstAmount)}` },
          { label: "Total amount (incl. GST)", value: `₹${formatNumber(totalAmount)}` },
        ];

        if (taxType === "cgst_sgst") {
          details.push(
            { label: `CGST (${rate / 2}%)`, value: `₹${formatNumber(gstAmount / 2)}` },
            { label: `SGST (${rate / 2}%)`, value: `₹${formatNumber(gstAmount / 2)}` }
          );
        } else {
          details.push({ label: `IGST (${rate}%)`, value: `₹${formatNumber(gstAmount)}` });
        }

        return {
          primary: { label: "Original Amount (excl. GST)", value: `₹${formatNumber(originalAmount)}` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["sales-tax-calculator", "vat-calculator", "tax-calculator"],
  faq: [
    {
      question: "What is GST?",
      answer:
        "GST (Goods and Services Tax) is an indirect tax levied in India on the supply of goods and services. It replaced multiple cascading taxes levied by the central and state governments. GST rates are 5%, 12%, 18%, and 28%.",
    },
    {
      question: "What is the difference between CGST, SGST, and IGST?",
      answer:
        "CGST (Central GST) and SGST (State GST) apply to intra-state transactions (within the same state). IGST (Integrated GST) applies to inter-state transactions. For intra-state, the GST rate is split equally between CGST and SGST.",
    },
    {
      question: "How do I calculate GST on an amount?",
      answer:
        "To add GST: Total = Amount × (1 + GST Rate/100). To remove GST: Original Amount = Total / (1 + GST Rate/100). For example, 18% GST on ₹10,000: GST = ₹1,800, Total = ₹11,800.",
    },
  ],
  formula: "GST Amount = Original Price × (GST Rate / 100)",
};
