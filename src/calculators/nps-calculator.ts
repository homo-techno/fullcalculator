import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const npsCalculator: CalculatorDefinition = {
  slug: "nps-calculator",
  title: "NPS Calculator",
  description:
    "Free NPS calculator. Calculate National Pension System returns, pension amount, and lump sum at retirement. Plan your NPS investments for a secure retirement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "NPS calculator",
    "national pension system calculator",
    "NPS returns calculator",
    "NPS pension calculator",
    "NPS maturity",
    "NPS investment",
  ],
  variants: [
    {
      id: "basic",
      name: "NPS Returns Calculator",
      description: "Calculate NPS corpus and estimated pension at retirement",
      fields: [
        {
          name: "monthlyContribution",
          label: "Monthly Contribution",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "currentAge",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 18,
          max: 59,
        },
        {
          name: "retirementAge",
          label: "Retirement Age",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "years",
          min: 60,
          max: 70,
          defaultValue: 60,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "select",
          options: [
            { label: "8% (Conservative - Govt. Securities)", value: "8" },
            { label: "10% (Moderate - Corporate Bonds Mix)", value: "10" },
            { label: "12% (Aggressive - Equity Heavy)", value: "12" },
            { label: "14% (Very Aggressive)", value: "14" },
          ],
          defaultValue: "10",
        },
        {
          name: "annuityRate",
          label: "Annuity Purchase (%)",
          type: "select",
          options: [
            { label: "40% (Minimum Required)", value: "40" },
            { label: "50%", value: "50" },
            { label: "60%", value: "60" },
            { label: "80%", value: "80" },
            { label: "100%", value: "100" },
          ],
          defaultValue: "40",
        },
      ],
      calculate: (inputs) => {
        const monthlyContribution = inputs.monthlyContribution as number;
        const currentAge = inputs.currentAge as number;
        const retirementAge = parseInt(inputs.retirementAge as string) || 60;
        const expectedReturn = parseFloat(inputs.expectedReturn as string);
        const annuityPercent = parseFloat(inputs.annuityRate as string);
        if (!monthlyContribution || !currentAge) return null;

        const years = retirementAge - currentAge;
        if (years <= 0) return null;

        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        const totalContribution = monthlyContribution * months;

        const corpus =
          monthlyContribution *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);

        const annuityCorpus = corpus * (annuityPercent / 100);
        const lumpSum = corpus - annuityCorpus;
        const estimatedMonthlyPension = annuityCorpus * 0.06 / 12; // ~6% annuity rate

        return {
          primary: { label: "Total NPS Corpus", value: `₹${formatNumber(corpus)}` },
          details: [
            { label: "Total contribution", value: `₹${formatNumber(totalContribution)}` },
            { label: "Total interest/returns", value: `₹${formatNumber(corpus - totalContribution)}` },
            { label: `Lump sum (${100 - annuityPercent}%)`, value: `₹${formatNumber(lumpSum)}` },
            { label: `Annuity investment (${annuityPercent}%)`, value: `₹${formatNumber(annuityCorpus)}` },
            { label: "Estimated monthly pension", value: `₹${formatNumber(estimatedMonthlyPension)}` },
            { label: "Investment period", value: `${years} years` },
          ],
          note: "Pension estimate assumes ~6% annuity rate. Actual pension depends on the annuity plan chosen at retirement.",
        };
      },
    },
    {
      id: "taxBenefit",
      name: "NPS Tax Benefit",
      description: "Calculate tax benefits from NPS contributions",
      fields: [
        {
          name: "annualContribution",
          label: "Annual NPS Contribution",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "taxBracket",
          label: "Tax Bracket",
          type: "select",
          options: [
            { label: "5% (₹2.5L - ₹5L)", value: "5" },
            { label: "20% (₹5L - ₹10L)", value: "20" },
            { label: "30% (Above ₹10L)", value: "30" },
          ],
          defaultValue: "30",
        },
        {
          name: "regime",
          label: "Tax Regime",
          type: "select",
          options: [
            { label: "Old Regime", value: "old" },
            { label: "New Regime", value: "new" },
          ],
          defaultValue: "old",
        },
      ],
      calculate: (inputs) => {
        const annualContribution = inputs.annualContribution as number;
        const taxBracket = parseFloat(inputs.taxBracket as string);
        const regime = inputs.regime as string;
        if (!annualContribution || !taxBracket) return null;

        let section80CCD1 = Math.min(annualContribution, 150000); // Part of 80C limit
        const section80CCD1B = Math.min(annualContribution, 50000); // Additional 50k
        let totalDeduction = 0;

        if (regime === "old") {
          totalDeduction = section80CCD1 + section80CCD1B;
        } else {
          section80CCD1 = 0; // No 80C in new regime
          totalDeduction = section80CCD1B; // Only 80CCD(1B) available in new regime
        }

        const taxSaved = totalDeduction * (taxBracket / 100);
        const cessSaved = taxSaved * 0.04;
        const totalSaved = taxSaved + cessSaved;

        return {
          primary: { label: "Total Tax Saved", value: `₹${formatNumber(totalSaved)}` },
          details: [
            { label: "Sec 80CCD(1) deduction", value: `₹${formatNumber(section80CCD1)}` },
            { label: "Sec 80CCD(1B) additional deduction", value: `₹${formatNumber(section80CCD1B)}` },
            { label: "Total deduction claimed", value: `₹${formatNumber(totalDeduction)}` },
            { label: "Tax saved (before cess)", value: `₹${formatNumber(taxSaved)}` },
            { label: "Cess saved (4%)", value: `₹${formatNumber(cessSaved)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["epf-calculator", "retirement-calculator", "ppf-calculator"],
  faq: [
    {
      question: "What is NPS?",
      answer:
        "NPS (National Pension System) is a government-backed pension scheme in India. It allows you to invest regularly during your working years and receive a pension after retirement. NPS offers equity, corporate bonds, and government securities investment options.",
    },
    {
      question: "What are the tax benefits of NPS?",
      answer:
        "NPS offers tax benefits under Section 80CCD(1) up to ₹1.5 lakh (within the 80C limit) and an additional ₹50,000 under Section 80CCD(1B). At maturity, 60% of the corpus can be withdrawn tax-free, while 40% must be used to purchase an annuity.",
    },
    {
      question: "What is the minimum NPS contribution?",
      answer:
        "The minimum annual contribution for NPS Tier-I is ₹1,000 (₹500 per contribution). For Tier-II, the minimum is ₹250. There is no maximum limit on contributions, though tax benefits are capped.",
    },
  ],
  formula: "NPS Corpus = PMT × ((1+r)^n - 1) / r × (1+r)",
};
