import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financialAidEstimateCalculator: CalculatorDefinition = {
  slug: "financial-aid-estimate-calculator",
  title: "Financial Aid Estimator",
  description:
    "Free financial aid estimator. Estimate your Expected Family Contribution (EFC) and potential financial aid package for college.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "financial aid estimator",
    "efc calculator",
    "fafsa estimate",
    "college financial aid",
    "expected family contribution",
  ],
  variants: [
    {
      id: "efc",
      name: "EFC Estimate",
      description: "Estimate your Expected Family Contribution based on income and assets",
      fields: [
        { name: "familyIncome", label: "Annual Family Income ($)", type: "number", placeholder: "e.g. 65000", min: 0 },
        { name: "familyAssets", label: "Family Assets (savings, investments) ($)", type: "number", placeholder: "e.g. 20000", min: 0 },
        { name: "familySize", label: "Family Size", type: "number", placeholder: "e.g. 4", min: 1, max: 15 },
        { name: "studentsInCollege", label: "Students in College", type: "number", placeholder: "e.g. 1", min: 1, max: 10 },
        { name: "costOfAttendance", label: "Annual Cost of Attendance ($)", type: "number", placeholder: "e.g. 30000", min: 0 },
      ],
      calculate: (inputs) => {
        const income = (inputs.familyIncome as number) || 0;
        const assets = (inputs.familyAssets as number) || 0;
        const famSize = (inputs.familySize as number) || 4;
        const students = (inputs.studentsInCollege as number) || 1;
        const coa = (inputs.costOfAttendance as number) || 0;
        if (!income && !assets) return null;

        // Simplified EFC model (actual FAFSA is much more complex)
        const incomeProtection = 15000 + (famSize - 3) * 5000;
        const availableIncome = Math.max(0, income - incomeProtection) * 0.22;
        const assetContribution = assets * 0.056;
        const efc = Math.max(0, (availableIncome + assetContribution) / students);

        const estimatedAid = Math.max(0, coa - efc);
        const aidPercent = coa > 0 ? (estimatedAid / coa) * 100 : 0;

        let aidLevel: string;
        if (efc === 0) aidLevel = "Likely eligible for full need-based aid";
        else if (efc < 6000) aidLevel = "Eligible for significant aid including Pell Grant";
        else if (efc < 15000) aidLevel = "Moderate aid expected";
        else aidLevel = "Limited need-based aid; consider merit scholarships";

        return {
          primary: { label: "Estimated EFC", value: `$${formatNumber(efc, 0)}` },
          details: [
            { label: "Aid eligibility", value: aidLevel },
            { label: "Estimated financial need", value: `$${formatNumber(estimatedAid, 0)}` },
            { label: "Aid covers", value: `${formatNumber(aidPercent, 0)}% of cost` },
            { label: "Cost of attendance", value: `$${formatNumber(coa, 0)}` },
          ],
        };
      },
    },
    {
      id: "aid-package",
      name: "Aid Package Breakdown",
      description: "Estimate what your financial aid package might look like",
      fields: [
        { name: "totalNeed", label: "Total Financial Need ($)", type: "number", placeholder: "e.g. 25000", min: 0 },
        { name: "pellEligible", label: "Pell Grant Eligible?", type: "select", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }], defaultValue: "no" },
        { name: "meritScholarship", label: "Merit Scholarship ($)", type: "number", placeholder: "e.g. 5000", min: 0 },
        { name: "stateAid", label: "State Aid / Other Grants ($)", type: "number", placeholder: "e.g. 2000", min: 0 },
      ],
      calculate: (inputs) => {
        const need = (inputs.totalNeed as number) || 0;
        const pellEligible = inputs.pellEligible === "yes";
        const merit = (inputs.meritScholarship as number) || 0;
        const stateAid = (inputs.stateAid as number) || 0;

        const pellGrant = pellEligible ? Math.min(7395, need * 0.3) : 0;
        const subsidizedLoan = Math.min(5500, Math.max(0, need - pellGrant - merit - stateAid));
        const totalGrants = pellGrant + merit + stateAid;
        const remainingNeed = Math.max(0, need - totalGrants - subsidizedLoan);
        const totalPackage = totalGrants + subsidizedLoan;

        return {
          primary: { label: "Estimated Aid Package", value: `$${formatNumber(totalPackage, 0)}` },
          details: [
            { label: "Free money (grants/scholarships)", value: `$${formatNumber(totalGrants, 0)}` },
            { label: "Pell Grant estimate", value: `$${formatNumber(pellGrant, 0)}` },
            { label: "Subsidized loan estimate", value: `$${formatNumber(subsidizedLoan, 0)}` },
            { label: "Remaining unmet need", value: `$${formatNumber(remainingNeed, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pell-grant-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "What is the Expected Family Contribution (EFC)?",
      answer:
        "The EFC (now called Student Aid Index or SAI) is a number calculated from your FAFSA that represents how much your family can contribute to college costs. Lower EFC = more financial aid eligibility.",
    },
    {
      question: "When should I fill out the FAFSA?",
      answer:
        "The FAFSA opens October 1st each year. Apply as early as possible since some aid is first-come, first-served. Use the prior-prior year's tax information.",
    },
  ],
  formula: "EFC = ((Income - Protection Allowance) x 0.22 + Assets x 0.056) / Students in College",
};
