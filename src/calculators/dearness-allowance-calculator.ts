import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dearnessAllowanceCalculator: CalculatorDefinition = {
  slug: "dearness-allowance-calculator",
  title: "Dearness Allowance Calculator",
  description: "Calculate Dearness Allowance for Indian central government employees based on basic pay and current DA rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dearness allowance calculator", "da calculator", "government employee da"],
  variants: [{
    id: "standard",
    name: "Dearness Allowance",
    description: "Calculate Dearness Allowance for Indian central government employees based on basic pay and current DA rate",
    fields: [
      { name: "basicPay", label: "Basic Pay", type: "number", prefix: "Rs.", min: 1000, max: 500000, step: 500, defaultValue: 56100 },
      { name: "daRate", label: "Current DA Rate", type: "number", suffix: "%", min: 0, max: 100, step: 1, defaultValue: 46 },
      { name: "hraCity", label: "HRA City Classification", type: "select", options: [{value:"x",label:"X (Metro)"},{value:"y",label:"Y (Large City)"},{value:"z",label:"Z (Others)"}], defaultValue: "x" },
    ],
    calculate: (inputs) => {
      const basic = inputs.basicPay as number;
      const daRate = inputs.daRate as number;
      const city = inputs.hraCity as string;
      if (!basic || basic <= 0) return null;
      const daAmount = basic * (daRate / 100);
      const hraRates: Record<string, number> = { x: 27, y: 18, z: 9 };
      const hraRate = hraRates[city] || 27;
      const hraAmount = basic * (hraRate / 100);
      const grossWithDA = basic + daAmount + hraAmount;
      return {
        primary: { label: "Monthly Dearness Allowance", value: "Rs. " + formatNumber(Math.round(daAmount)) },
        details: [
          { label: "HRA Amount", value: "Rs. " + formatNumber(Math.round(hraAmount)) },
          { label: "Basic + DA + HRA", value: "Rs. " + formatNumber(Math.round(grossWithDA)) },
          { label: "Annual DA", value: "Rs. " + formatNumber(Math.round(daAmount * 12)) },
        ],
      };
    },
  }],
  relatedSlugs: ["section-80c-deduction-calculator", "sip-step-up-calculator"],
  faq: [
    { question: "How often is Dearness Allowance revised?", answer: "Dearness Allowance for central government employees is revised twice a year, effective January and July, based on the All India Consumer Price Index (AICPI) for the preceding 12 months." },
    { question: "Does DA affect retirement benefits?", answer: "Yes. DA at the time of retirement is merged into basic pay for calculating pension and gratuity. Higher DA at retirement leads to higher retirement benefits for government employees." },
  ],
  formula: "DA = Basic Pay x DA Rate / 100; HRA = Basic Pay x HRA Rate (based on city classification)",
};
