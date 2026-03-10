import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const upworkFeeCalculator: CalculatorDefinition = {
  slug: "upwork-fee-calculator",
  title: "Upwork Fee Calculator",
  description:
    "Calculate your Upwork net earnings after service fees. See true hourly and project income on Upwork's tiered 5–20% commission structure.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Upwork fee calculator",
    "Upwork service fee",
    "Upwork net earnings",
    "how much does Upwork take",
    "Upwork freelancer income",
  ],
  variants: [
    {
      id: "hourly",
      name: "Hourly Contract",
      description: "Calculate net earnings for hourly Upwork work",
      fields: [
        {
          name: "hourlyRate",
          label: "Your Hourly Rate (billed to client)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          suffix: "/hr",
        },
        {
          name: "hoursPerMonth",
          label: "Hours Worked per Month",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "hours",
        },
        {
          name: "lifetimeBillings",
          label: "Lifetime Billings with This Client",
          type: "select",
          options: [
            { label: "Less than $500 (20% fee)", value: "20" },
            { label: "$500–$10,000 (10% fee)", value: "10" },
            { label: "Over $10,000 (5% fee)", value: "5" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.hourlyRate as string) || 0;
        const hours = parseFloat(inputs.hoursPerMonth as string) || 0;
        const feeRate = parseFloat(inputs.lifetimeBillings as string) || 10;

        const grossMonthly = rate * hours;
        const upworkFee = grossMonthly * (feeRate / 100);
        const netMonthly = grossMonthly - upworkFee;
        const effectiveRate = hours > 0 ? netMonthly / hours : 0;
        const neededRate = rate / (1 - feeRate / 100);

        return {
          primary: { label: "Monthly Net Earnings", value: `$${formatNumber(netMonthly, 2)}` },
          details: [
            { label: "Gross monthly billings", value: `$${formatNumber(grossMonthly, 2)}` },
            { label: "Upwork fee", value: `-$${formatNumber(upworkFee, 2)} (${feeRate}%)` },
            { label: "Net monthly earnings", value: `$${formatNumber(netMonthly, 2)}` },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveRate, 2)}/hr` },
            { label: "Rate to bill for $${rate}/hr net", value: `$${formatNumber(neededRate, 2)}/hr` },
            { label: "Annual net earnings", value: `$${formatNumber(netMonthly * 12, 2)}` },
          ],
          note: "After $500 with a client, your fee drops to 10%. After $10,000 with the same client, it drops to 5%. Long-term clients dramatically improve your effective rate.",
        };
      },
    },
  ],
  relatedSlugs: ["fiverr-seller-calculator", "freelancer-vs-employee-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How much does Upwork take from freelancers?",
      answer:
        "Upwork charges a tiered service fee: 20% on first $500 earned with a client, 10% from $500–$10,000, and 5% above $10,000. New freelancers often pay 20% until they build client relationships.",
    },
    {
      question: "How do I reduce Upwork fees?",
      answer:
        "Build long-term client relationships — after $10,000 with one client you pay only 5%. Alternatively, use Upwork's 'Bring Your Own Client' feature to invite existing clients and pay lower fees from day one.",
    },
    {
      question: "How much should I charge on Upwork?",
      answer:
        "Add your target fee to your desired net rate to account for Upwork's cut. If you want $45/hr net and pay 20% fee: charge $45 ÷ 0.80 = $56.25/hr. Research your category — entry-level is $15–$30, mid-level $40–$80, expert $80–$200+.",
    },
  ],
  formula: "Net Earnings = Gross Billings × (1 − Upwork Fee %)",
};
