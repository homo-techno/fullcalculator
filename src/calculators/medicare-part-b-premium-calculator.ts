import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicarePartBPremiumCalculator: CalculatorDefinition = {
  slug: "medicare-part-b-premium-calculator",
  title: "Medicare Part B Premium Calculator",
  description: "Calculate your Medicare Part B premium including any IRMAA surcharge based on income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medicare part b premium", "IRMAA calculator", "medicare cost"],
  variants: [{
    id: "standard",
    name: "Medicare Part B Premium",
    description: "Calculate your Medicare Part B premium including any IRMAA surcharge based on income",
    fields: [
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"separate",label:"Married Filing Separately"}], defaultValue: "single" },
      { name: "magi", label: "Modified Adjusted Gross Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 100000 },
    ],
    calculate: (inputs) => {
      const status = inputs.filingStatus as string;
      const magi = inputs.magi as number;
      if (!magi || magi < 0) return null;
      const basePremium = 174.70;
      let surcharge = 0;
      if (status === "married") {
        if (magi > 750000) surcharge = 419.30;
        else if (magi > 500000) surcharge = 349.40;
        else if (magi > 386000) surcharge = 279.50;
        else if (magi > 306000) surcharge = 209.60;
        else if (magi > 206000) surcharge = 69.90;
      } else if (status === "separate") {
        if (magi > 403000) surcharge = 419.30;
        else if (magi > 103000) surcharge = 349.40;
      } else {
        if (magi > 500000) surcharge = 419.30;
        else if (magi > 330000) surcharge = 349.40;
        else if (magi > 193000) surcharge = 279.50;
        else if (magi > 153000) surcharge = 209.60;
        else if (magi > 103000) surcharge = 69.90;
      }
      const totalMonthly = basePremium + surcharge;
      return {
        primary: { label: "Monthly Part B Premium", value: "$" + formatNumber(totalMonthly) },
        details: [
          { label: "Base Premium", value: "$" + formatNumber(basePremium) },
          { label: "IRMAA Surcharge", value: "$" + formatNumber(surcharge) },
          { label: "Annual Cost", value: "$" + formatNumber(totalMonthly * 12) },
        ],
      };
    },
  }],
  relatedSlugs: ["medicare-part-d-coverage-gap-calculator", "medigap-plan-comparison-calculator"],
  faq: [
    { question: "What is the Medicare Part B IRMAA surcharge?", answer: "IRMAA is an extra charge added to your Part B premium if your income exceeds certain thresholds, based on your tax return from two years ago." },
    { question: "How can I reduce my Medicare premium?", answer: "You can file a life-changing event appeal if your income has dropped since the tax year used for the IRMAA determination." },
  ],
  formula: "Monthly Premium = Base Premium ($174.70) + IRMAA Surcharge based on income bracket",
};
