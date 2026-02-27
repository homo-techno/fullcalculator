import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const therapyCostCalculator: CalculatorDefinition = {
  slug: "therapy-cost-calculator",
  title: "Therapy Cost Calculator",
  description:
    "Compare therapy and counseling costs by type, frequency, and payment method. Estimate annual spending for in-person vs online therapy with and without insurance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "therapy cost",
    "counseling cost",
    "therapist cost",
    "therapy without insurance",
    "online therapy cost",
    "betterhelp cost",
    "mental health cost",
  ],
  variants: [
    {
      id: "inPerson",
      name: "In-Person Therapy",
      description: "Estimate costs for traditional in-person therapy sessions",
      fields: [
        {
          name: "therapistType",
          label: "Therapist Type",
          type: "select",
          options: [
            { label: "Licensed counselor (LPC/LMHC)", value: "lpc" },
            { label: "Licensed social worker (LCSW)", value: "lcsw" },
            { label: "Psychologist (PhD/PsyD)", value: "psychologist" },
            { label: "Psychiatrist (MD)", value: "psychiatrist" },
          ],
          defaultValue: "lcsw",
        },
        {
          name: "frequency",
          label: "Session Frequency",
          type: "select",
          options: [
            { label: "Weekly", value: "52" },
            { label: "Biweekly", value: "26" },
            { label: "Monthly", value: "12" },
          ],
          defaultValue: "52",
        },
        {
          name: "paymentMethod",
          label: "Payment Method",
          type: "select",
          options: [
            { label: "Self-pay (no insurance)", value: "selfpay" },
            { label: "Insurance (in-network)", value: "in_network" },
            { label: "Insurance (out-of-network)", value: "out_network" },
            { label: "Sliding scale", value: "sliding" },
          ],
          defaultValue: "selfpay",
        },
        {
          name: "sessionLength",
          label: "Session Length",
          type: "select",
          options: [
            { label: "45 minutes", value: "45" },
            { label: "60 minutes", value: "60" },
            { label: "90 minutes (initial/intensive)", value: "90" },
          ],
          defaultValue: "60",
        },
      ],
      calculate: (inputs) => {
        const therapistType = inputs.therapistType as string;
        const sessionsPerYear = parseFloat(inputs.frequency as string);
        const payment = inputs.paymentMethod as string;
        const sessionLength = parseFloat(inputs.sessionLength as string);
        if (!sessionsPerYear) return null;

        const baseRates: Record<string, number> = {
          lpc: 130, lcsw: 140, psychologist: 200, psychiatrist: 300,
        };
        const lengthMultiplier = sessionLength === 45 ? 0.85 : sessionLength === 90 ? 1.5 : 1.0;
        const fullRate = (baseRates[therapistType] || 150) * lengthMultiplier;

        let sessionCost: number;
        switch (payment) {
          case "in_network":
            sessionCost = fullRate * 0.20; // Typical copay ~20%
            break;
          case "out_network":
            sessionCost = fullRate * 0.50; // After deductible, ~50% coinsurance
            break;
          case "sliding":
            sessionCost = fullRate * 0.45; // ~55% discount on average
            break;
          default:
            sessionCost = fullRate;
        }

        const annualCost = sessionCost * sessionsPerYear;
        const monthlyCost = annualCost / 12;

        return {
          primary: { label: "Cost Per Session", value: `$${formatNumber(sessionCost, 0)}` },
          details: [
            { label: "Full Rate", value: `$${formatNumber(fullRate, 0)}` },
            { label: "Annual Cost", value: `$${formatNumber(annualCost, 0)}` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 0)}` },
            { label: "Sessions Per Year", value: formatNumber(sessionsPerYear, 0) },
            { label: "Session Length", value: `${formatNumber(sessionLength, 0)} min` },
          ],
          note: "Rates vary significantly by location, specialization, and individual provider. Out-of-network costs assume deductible has been met. Many therapists offer free 15-minute consultations.",
        };
      },
    },
    {
      id: "online",
      name: "Online Therapy Comparison",
      description: "Compare popular online therapy platforms",
      fields: [
        {
          name: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "BetterHelp", value: "betterhelp" },
            { label: "Talkspace", value: "talkspace" },
            { label: "Cerebral", value: "cerebral" },
            { label: "Private practice (telehealth)", value: "private" },
          ],
          defaultValue: "betterhelp",
        },
        {
          name: "months",
          label: "Duration",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "months",
          min: 1,
          max: 24,
          defaultValue: 6,
        },
      ],
      calculate: (inputs) => {
        const platform = inputs.platform as string;
        const months = parseFloat(inputs.months as string);
        if (!months) return null;

        const monthlyCosts: Record<string, number> = {
          betterhelp: 300, talkspace: 316, cerebral: 330, private: 560,
        };
        const sessionsPerMonth: Record<string, number> = {
          betterhelp: 4, talkspace: 4, cerebral: 4, private: 4,
        };

        const monthly = monthlyCosts[platform] || 300;
        const totalCost = monthly * months;
        const perSession = monthly / (sessionsPerMonth[platform] || 4);

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthly, 0)}` },
          details: [
            { label: "Total Cost", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Per Session (est.)", value: `$${formatNumber(perSession, 0)}` },
            { label: "Duration", value: `${formatNumber(months, 0)} months` },
            { label: "Includes Messaging", value: platform !== "private" ? "Yes" : "No" },
          ],
          note: "Online therapy platforms often include unlimited messaging with your therapist between video sessions. Prices may change. Some platforms accept insurance. Private practice telehealth rates equal in-person rates.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "sleep-calculator", "heart-rate-calculator"],
  faq: [
    {
      question: "How much does therapy cost without insurance?",
      answer:
        "Without insurance, therapy typically costs $100-$200 per session for licensed counselors/social workers and $150-$300+ for psychologists. Psychiatrists charge $200-$400+. Online platforms offer plans at $60-$100 per week. Sliding scale fees are available from many therapists based on income.",
    },
    {
      question: "Does insurance cover therapy?",
      answer:
        "Most health insurance plans cover mental health services under parity laws. In-network copays are typically $20-$50 per session. Out-of-network reimbursement varies (usually 50-80% after deductible). Check your specific plan for covered session limits and pre-authorization requirements.",
    },
    {
      question: "Is online therapy as effective as in-person?",
      answer:
        "Research shows online therapy (video-based) is comparably effective to in-person therapy for many conditions including depression, anxiety, and PTSD. Text-based therapy has less research support. In-person may be preferred for severe conditions, couples therapy, or when strong therapeutic alliance is needed.",
    },
  ],
  formula:
    "Annual Cost = Session Cost x Sessions Per Year | Session Cost = Full Rate x Payment Discount Factor",
};
