import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bailCalculator: CalculatorDefinition = {
  slug: "bail-calculator",
  title: "Bail Amount Calculator",
  description: "Free online bail amount estimator. Estimate bail amounts by charge type, criminal history, and jurisdiction factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bail", "bond", "bail amount", "bail calculator", "criminal bail", "bail bond cost", "pretrial release"],
  variants: [
    {
      id: "bail-estimate",
      name: "Estimate Bail Amount",
      fields: [
        {
          name: "chargeType",
          label: "Charge Type",
          type: "select",
          options: [
            { label: "Misdemeanor - Minor", value: "misdemeanorMinor" },
            { label: "Misdemeanor - Serious", value: "misdemeanorSerious" },
            { label: "Felony - Non-Violent", value: "felonyNonViolent" },
            { label: "Felony - Violent", value: "felonyViolent" },
            { label: "DUI / DWI", value: "dui" },
            { label: "Drug Offense", value: "drug" },
            { label: "White Collar Crime", value: "whiteCollar" },
          ],
        },
        {
          name: "priorOffenses",
          label: "Number of Prior Offenses",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
        {
          name: "flightRisk",
          label: "Flight Risk Level",
          type: "select",
          options: [
            { label: "Low - Strong community ties", value: "low" },
            { label: "Medium - Some ties", value: "medium" },
            { label: "High - Limited ties", value: "high" },
          ],
        },
      ],
      calculate: (inputs) => {
        const chargeType = inputs.chargeType as string;
        const priorOffenses = parseFloat(inputs.priorOffenses as string) || 0;
        const flightRisk = inputs.flightRisk as string;

        const baseBailAmounts: Record<string, number> = {
          misdemeanorMinor: 500,
          misdemeanorSerious: 2500,
          felonyNonViolent: 10000,
          felonyViolent: 50000,
          dui: 5000,
          drug: 15000,
          whiteCollar: 25000,
        };

        const baseBail = baseBailAmounts[chargeType] || 5000;

        const priorMultiplier = 1 + priorOffenses * 0.25;

        const flightMultipliers: Record<string, number> = {
          low: 1.0,
          medium: 1.5,
          high: 2.5,
        };
        const flightMult = flightMultipliers[flightRisk] || 1.0;

        const estimatedBail = baseBail * priorMultiplier * flightMult;
        const bondPremium = estimatedBail * 0.10;

        return {
          primary: { label: "Estimated Bail Amount", value: "$" + formatNumber(estimatedBail) },
          details: [
            { label: "Base Bail for Charge", value: "$" + formatNumber(baseBail) },
            { label: "Prior Offense Multiplier", value: formatNumber(priorMultiplier, 2) + "x" },
            { label: "Flight Risk Multiplier", value: formatNumber(flightMult, 1) + "x" },
            { label: "Bail Bond Premium (10%)", value: "$" + formatNumber(bondPremium) },
          ],
          note: "This is an estimate only. Actual bail amounts are set by judges and vary by jurisdiction.",
        };
      },
    },
  ],
  relatedSlugs: ["legal-fee-calc", "personal-injury-settlement"],
  faq: [
    {
      question: "How is bail amount determined?",
      answer: "Bail is set by a judge based on the severity of the charge, criminal history, flight risk, community ties, and local bail schedules. This calculator provides rough estimates based on common factors.",
    },
    {
      question: "What is a bail bond premium?",
      answer: "A bail bond premium is the non-refundable fee (typically 10% of the bail amount) you pay to a bail bondsman to post bail on your behalf. If you pay bail directly to the court, you get it back when the case concludes.",
    },
    {
      question: "Can bail be denied?",
      answer: "Yes. Judges can deny bail in cases involving serious violent felonies, if the defendant poses a significant flight risk, or if public safety is a concern.",
    },
  ],
  formula: "Estimated Bail = Base Bail Amount x Prior Offense Multiplier x Flight Risk Multiplier",
};
