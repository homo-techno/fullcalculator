import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaGstCalculator: CalculatorDefinition = {
  slug: "india-gst-calculator",
  title: "India GST Calculator",
  description: "Free GST calculator for India. Calculate GST amount, CGST, SGST, and total price with 5%, 12%, 18%, or 28% GST rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gst calculator india", "gst calculator", "cgst sgst calculator"],
  variants: [{
    id: "standard",
    name: "India GST",
    description: "Free GST calculator for India",
    fields: [
      { name: "amount", label: "Amount (excl. GST)", type: "number", placeholder: "e.g. 10000", prefix: "₹", min: 0 },
      { name: "rate", label: "GST Rate", type: "select", options: [{ label: "5%", value: "5" }, { label: "12%", value: "12" }, { label: "18%", value: "18" }, { label: "28%", value: "28" }], defaultValue: "18" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const rate = parseFloat(inputs.rate as string);
      if (!amount || amount <= 0) return null;
      const gst = amount * rate / 100;
      const half = gst / 2;
      return {
        primary: { label: "Total (incl. GST)", value: "₹" + formatNumber(amount + gst) },
        details: [
          { label: "GST Amount", value: "₹" + formatNumber(gst) },
          { label: "CGST (" + (rate/2) + "%)", value: "₹" + formatNumber(half) },
          { label: "SGST (" + (rate/2) + "%)", value: "₹" + formatNumber(half) },
          { label: "Base Amount", value: "₹" + formatNumber(amount) },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the GST rates in India?", answer: "India has 4 main GST slabs: 5% (essential goods), 12% (standard goods), 18% (most services), and 28% (luxury/sin goods)." },
    { question: "What is CGST and SGST?", answer: "CGST (Central GST) and SGST (State GST) are equal halves of the total GST rate for intra-state transactions. For inter-state, IGST applies at the full rate." },
  ],
  formula: "GST = Amount × Rate%. Total = Amount + GST. CGST = SGST = GST / 2",
};
