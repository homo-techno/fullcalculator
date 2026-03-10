import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireHealthcareCostEstimator: CalculatorDefinition = {
  slug: "fire-healthcare-cost-estimator",
  title: "FIRE Healthcare Cost Estimator",
  description:
    "Estimate healthcare costs before Medicare at 65. Plan for ACA insurance, out-of-pocket maximums, and prescription costs during early retirement gap.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FIRE healthcare costs",
    "early retirement healthcare",
    "ACA insurance cost",
    "pre-Medicare healthcare",
    "healthcare gap coverage",
  ],
  variants: [
    {
      id: "calculate",
      name: "Estimate Healthcare Costs",
      description: "Calculate healthcare expenses before Medicare",
      fields: [
        {
          name: "retirementAge",
          label: "Retirement Age",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "householdSize",
          label: "Household Size",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
        },
        {
          name: "incomeLevelM",
          label: "Annual Income Level",
          type: "select",
          options: [
            { label: "Low (<$50k)", value: "low" },
            { label: "Moderate ($50-100k)", value: moderate" },
            { label: "High ($100k+)", value: "high" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const retirementAge = parseFloat(inputs.retirementAge as string) || 50;
        const householdSize = parseFloat(inputs.householdSize as string) || 2;
        const incomeLevel = inputs.incomeLevelM as string;

        const yearsToMedicare = 65 - retirementAge;

        // ACA insurance costs (premiums)
        let monthlyPremium = 400;
        if (incomeLevel === "low") monthlyPremium = 200; // Subsidies
        if (incomeLevel === "high") monthlyPremium = 600;

        const annualPremiums = monthlyPremium * 12 * householdSize;

        // Out-of-pocket max: ~$8000-15000/person/year
        const oopMax = 10000 * householdSize;

        // Total annual healthcare
        const annualHealthcare = annualPremiums + (oopMax * 0.5); // Assume 50% of max spent

        // Lifetime cost
        const totalHealthcareCost = annualHealthcare * yearsToMedicare;
        const monthlyNeeded = annualHealthcare / 12;

        return {
          primary: { label: "Total Healthcare (Until Medicare)", value: `$${formatNumber(totalHealthcareCost, 0)}` },
          details: [
            { label: "Retirement age", value: formatNumber(retirementAge) },
            { label: "Years until Medicare", value: formatNumber(yearsToMedicare) },
            { label: "Household size", value: formatNumber(householdSize) },
            { label: "Monthly insurance premium", value: `$${formatNumber(monthlyPremium, 0)}` },
            { label: "Annual premiums", value: `$${formatNumber(annualPremiums, 0)}` },
            { label: "Estimated OOP max", value: `$${formatNumber(oopMax, 0)}` },
            { label: "Annual healthcare total", value: `$${formatNumber(annualHealthcare, 0)}` },
            { label: "Lifetime healthcare cost", value: `$${formatNumber(totalHealthcareCost, 0)}` },
            { label: "Need to budget monthly", value: `$${formatNumber(monthlyNeeded, 0)}` },
          ],
          note: "Plans: ACA marketplace, short-term health plans, or expat insurance. Factor this into FIRE number!",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "fire-with-kids-calculator"],
  faq: [
    {
      question: "How much should I budget for healthcare in early FIRE?",
      answer:
        "Typical: $15-25k/year for family before subsidies, $5-12k with ACA subsidies if lower income. Highly variable by state and family health.",
    },
    {
      question: "Can I get subsidies on ACA?",
      answer:
        "Yes! If Modified Adjusted Gross Income (MAGI) is low (taxable withdrawals + ~$14.5k exclusion). Many FIRE folks optimize taxes to stay under subsidy thresholds.",
    },
  ],
  formula: "Total Healthcare Cost = Annual Healthcare × Years Until Medicare",
};
