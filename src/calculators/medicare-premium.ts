import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicarePremiumCalculator: CalculatorDefinition = {
  slug: "medicare-premium-calculator",
  title: "Medicare Premium Calculator",
  description: "Free Medicare premium calculator. Estimate your Medicare Part B and Part D premiums including IRMAA surcharges based on income. See your total Medicare costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medicare calculator", "medicare premium calculator", "IRMAA calculator", "medicare part b cost", "medicare part d premium"],
  variants: [
    {
      id: "medicare-premium",
      name: "Medicare Premium Estimator",
      description: "Estimate Medicare Part B and Part D premiums based on income (includes IRMAA)",
      fields: [
        { name: "magi", label: "Modified Adjusted Gross Income (MAGI)", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "filingStatus", label: "Tax Filing Status", type: "select", options: [
          { label: "Single / Head of Household", value: "single" },
          { label: "Married Filing Jointly", value: "married" },
          { label: "Married Filing Separately", value: "separate" },
        ], defaultValue: "single" },
        { name: "partD", label: "Part D (Prescription Drug) Plan?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "yes" },
        { name: "partDBasePremium", label: "Part D Plan Monthly Premium", type: "number", placeholder: "e.g. 33", prefix: "$", defaultValue: 33 },
      ],
      calculate: (inputs) => {
        const magi = inputs.magi as number;
        const filingStatus = inputs.filingStatus as string;
        const hasPartD = inputs.partD as string === "yes";
        const partDBasePremium = (inputs.partDBasePremium as number) || 33;

        if (!magi) return null;

        const standardPartB = 174.70; // 2024 standard premium

        // IRMAA brackets for Part B (2024, based on 2022 MAGI)
        const singleBrackets = [
          { limit: 103000, surcharge: 0 },
          { limit: 129000, surcharge: 69.90 },
          { limit: 161000, surcharge: 174.70 },
          { limit: 193000, surcharge: 279.50 },
          { limit: 500000, surcharge: 384.30 },
          { limit: Infinity, surcharge: 419.30 },
        ];

        const marriedBrackets = [
          { limit: 206000, surcharge: 0 },
          { limit: 258000, surcharge: 69.90 },
          { limit: 322000, surcharge: 174.70 },
          { limit: 386000, surcharge: 279.50 },
          { limit: 750000, surcharge: 384.30 },
          { limit: Infinity, surcharge: 419.30 },
        ];

        const separateBrackets = [
          { limit: 103000, surcharge: 0 },
          { limit: 397000, surcharge: 384.30 },
          { limit: Infinity, surcharge: 419.30 },
        ];

        let brackets;
        if (filingStatus === "married") brackets = marriedBrackets;
        else if (filingStatus === "separate") brackets = separateBrackets;
        else brackets = singleBrackets;

        let irmaaPartB = 0;
        for (const bracket of brackets) {
          if (magi <= bracket.limit) {
            irmaaPartB = bracket.surcharge;
            break;
          }
        }

        const totalPartB = standardPartB + irmaaPartB;

        // IRMAA for Part D
        const partDSurcharges = filingStatus === "married"
          ? [
            { limit: 206000, surcharge: 0 },
            { limit: 258000, surcharge: 12.90 },
            { limit: 322000, surcharge: 33.30 },
            { limit: 386000, surcharge: 53.80 },
            { limit: 750000, surcharge: 74.20 },
            { limit: Infinity, surcharge: 81.00 },
          ]
          : [
            { limit: 103000, surcharge: 0 },
            { limit: 129000, surcharge: 12.90 },
            { limit: 161000, surcharge: 33.30 },
            { limit: 193000, surcharge: 53.80 },
            { limit: 500000, surcharge: 74.20 },
            { limit: Infinity, surcharge: 81.00 },
          ];

        let irmaaPartD = 0;
        for (const bracket of partDSurcharges) {
          if (magi <= bracket.limit) {
            irmaaPartD = bracket.surcharge;
            break;
          }
        }

        const totalPartD = hasPartD ? partDBasePremium + irmaaPartD : 0;
        const totalMonthly = totalPartB + totalPartD;
        const totalAnnual = totalMonthly * 12;

        return {
          primary: { label: "Total Monthly Medicare Premium", value: `$${formatNumber(totalMonthly)}` },
          details: [
            { label: "Part B standard premium", value: `$${formatNumber(standardPartB)}` },
            { label: "Part B IRMAA surcharge", value: irmaaPartB > 0 ? `$${formatNumber(irmaaPartB)}` : "None" },
            { label: "Total Part B", value: `$${formatNumber(totalPartB)}/month` },
            { label: "Part D plan premium", value: hasPartD ? `$${formatNumber(partDBasePremium)}` : "N/A" },
            { label: "Part D IRMAA surcharge", value: hasPartD && irmaaPartD > 0 ? `$${formatNumber(irmaaPartD)}` : "None" },
            { label: "Total Part D", value: hasPartD ? `$${formatNumber(totalPartD)}/month` : "N/A" },
            { label: "Annual Medicare premiums", value: `$${formatNumber(totalAnnual)}` },
          ],
          note: "IRMAA surcharges are based on MAGI from 2 years prior (e.g., 2024 premiums use 2022 income). Part A is usually premium-free if you or your spouse have 40+ quarters of Medicare-covered employment. Premiums are adjusted annually.",
        };
      },
    },
  ],
  relatedSlugs: ["social-security-benefit-calculator", "health-insurance-subsidy-calculator", "retirement-calculator"],
  faq: [
    { question: "What is IRMAA?", answer: "IRMAA (Income-Related Monthly Adjustment Amount) is a surcharge added to Medicare Part B and Part D premiums for higher-income beneficiaries. It's based on your MAGI from 2 years prior. For 2024, individuals earning above $103,000 (single) or $206,000 (married filing jointly) pay higher premiums." },
    { question: "How much is Medicare Part B?", answer: "The standard Medicare Part B premium is $174.70/month in 2024. Higher-income beneficiaries pay more due to IRMAA surcharges, which can increase the Part B premium up to $594.00/month for the highest income bracket." },
    { question: "Can I appeal my IRMAA surcharge?", answer: "Yes. If your income has decreased due to life-changing events (retirement, divorce, death of spouse, etc.), you can request a new determination using Form SSA-44. The Social Security Administration may use more recent income to reduce your IRMAA." },
  ],
  formula: "Total Monthly Premium = Part B Standard ($174.70) + Part B IRMAA + Part D Plan Premium + Part D IRMAA. IRMAA is based on MAGI from 2 years prior and filing status.",
};
