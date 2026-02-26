import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const personalInjurySettlementCalculator: CalculatorDefinition = {
  slug: "personal-injury-settlement",
  title: "Personal Injury Settlement Calculator",
  description: "Free online personal injury settlement estimator. Estimate potential settlement value based on medical expenses, lost wages, and pain and suffering.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["personal injury", "settlement", "injury settlement", "accident settlement", "pain and suffering", "medical expenses", "lost wages"],
  variants: [
    {
      id: "settlement-estimate",
      name: "Estimate Settlement Value",
      fields: [
        {
          name: "medicalExpenses",
          label: "Total Medical Expenses ($)",
          type: "number",
          placeholder: "e.g. 25000",
          min: 0,
        },
        {
          name: "futureMedical",
          label: "Estimated Future Medical Costs ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "lostWages",
          label: "Lost Wages ($)",
          type: "number",
          placeholder: "e.g. 15000",
          min: 0,
        },
        {
          name: "futureLostWages",
          label: "Future Lost Earning Capacity ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "injurySeverity",
          label: "Injury Severity",
          type: "select",
          options: [
            { label: "Minor (soft tissue, bruises)", value: "minor" },
            { label: "Moderate (fractures, herniated discs)", value: "moderate" },
            { label: "Serious (surgery required, TBI)", value: "serious" },
            { label: "Severe (permanent disability)", value: "severe" },
            { label: "Catastrophic (paralysis, amputation)", value: "catastrophic" },
          ],
        },
        {
          name: "sharedFault",
          label: "Your Percentage of Fault (%)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const medicalExpenses = parseFloat(inputs.medicalExpenses as string) || 0;
        const futureMedical = parseFloat(inputs.futureMedical as string) || 0;
        const lostWages = parseFloat(inputs.lostWages as string) || 0;
        const futureLostWages = parseFloat(inputs.futureLostWages as string) || 0;
        const injurySeverity = inputs.injurySeverity as string;
        const sharedFault = parseFloat(inputs.sharedFault as string) || 0;

        const totalMedical = medicalExpenses + futureMedical;
        const totalLostWages = lostWages + futureLostWages;
        const specialDamages = totalMedical + totalLostWages;

        const multipliers: Record<string, number> = {
          minor: 1.5,
          moderate: 3,
          serious: 5,
          severe: 7,
          catastrophic: 10,
        };
        const multiplier = multipliers[injurySeverity] || 1.5;

        const painAndSuffering = totalMedical * multiplier;
        const grossSettlement = specialDamages + painAndSuffering;
        const faultReduction = grossSettlement * (sharedFault / 100);
        const netSettlement = grossSettlement - faultReduction;
        const attorneyFees = netSettlement * 0.33;
        const afterAttorney = netSettlement - attorneyFees;

        return {
          primary: { label: "Estimated Settlement Range", value: "$" + formatNumber(netSettlement * 0.75) + " - $" + formatNumber(netSettlement * 1.25) },
          details: [
            { label: "Total Medical Expenses", value: "$" + formatNumber(totalMedical) },
            { label: "Total Lost Wages", value: "$" + formatNumber(totalLostWages) },
            { label: "Special Damages", value: "$" + formatNumber(specialDamages) },
            { label: "Pain & Suffering (x" + multiplier + ")", value: "$" + formatNumber(painAndSuffering) },
            { label: "Gross Settlement", value: "$" + formatNumber(grossSettlement) },
            { label: "Fault Reduction (" + sharedFault + "%)", value: "-$" + formatNumber(faultReduction) },
            { label: "Net Settlement Estimate", value: "$" + formatNumber(netSettlement) },
            { label: "Attorney Fees (33%)", value: "-$" + formatNumber(attorneyFees) },
            { label: "Your Take-Home (est.)", value: "$" + formatNumber(afterAttorney) },
          ],
          note: "This is a rough estimate. Actual settlements depend on many factors including evidence, jurisdiction, and insurance limits.",
        };
      },
    },
  ],
  relatedSlugs: ["bail-calculator", "legal-fee-calc", "wrongful-termination"],
  faq: [
    {
      question: "How are personal injury settlements calculated?",
      answer: "Settlements are typically based on special damages (medical bills + lost wages) plus general damages (pain and suffering). The multiplier method multiplies medical expenses by a factor based on severity (1.5x to 10x) to estimate pain and suffering.",
    },
    {
      question: "What is the multiplier method?",
      answer: "The multiplier method estimates pain and suffering by multiplying total medical expenses by a factor (1.5 for minor injuries up to 10 for catastrophic injuries). This is then added to economic damages for the total settlement value.",
    },
    {
      question: "How does shared fault affect a settlement?",
      answer: "In comparative negligence states, your settlement is reduced by your percentage of fault. For example, if you are 20% at fault and the total settlement is $100,000, you would receive $80,000. Some states bar recovery if you are 50% or more at fault.",
    },
  ],
  formula: "Settlement = (Medical Expenses + Lost Wages) + (Medical Expenses x Severity Multiplier) - Fault Reduction",
};
