import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financialAidCalculator: CalculatorDefinition = {
  slug: "financial-aid-calculator",
  title: "Financial Aid Estimator",
  description:
    "Free financial aid estimator. Estimate your Expected Family Contribution (EFC/SAI) and potential financial aid eligibility based on income and family size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "financial aid calculator",
    "efc calculator",
    "fafsa calculator",
    "expected family contribution",
    "student aid index calculator",
  ],
  variants: [
    {
      id: "efc",
      name: "EFC / SAI Estimator",
      description: "Estimate your Expected Family Contribution (now called Student Aid Index)",
      fields: [
        { name: "parentIncome", label: "Parent Adjusted Gross Income ($)", type: "number", placeholder: "e.g. 75000" },
        { name: "studentIncome", label: "Student Income ($)", type: "number", placeholder: "e.g. 5000", defaultValue: 0 },
        { name: "parentAssets", label: "Parent Assets (savings, investments, $)", type: "number", placeholder: "e.g. 50000", defaultValue: 0 },
        { name: "familySize", label: "Family Size (household members)", type: "number", placeholder: "e.g. 4", min: 1, max: 12 },
        { name: "numberInCollege", label: "Number in College", type: "number", placeholder: "e.g. 1", min: 1, max: 6 },
      ],
      calculate: (inputs) => {
        const parentIncome = inputs.parentIncome as number;
        const studentIncome = (inputs.studentIncome as number) || 0;
        const parentAssets = (inputs.parentAssets as number) || 0;
        const familySize = inputs.familySize as number;
        const inCollege = inputs.numberInCollege as number;
        if (!parentIncome || !familySize || !inCollege) return null;

        // Simplified EFC estimation (this is an approximation of the federal methodology)
        // Income protection allowance varies by family size
        const incomeProtection: Record<number, number> = {
          2: 19000, 3: 23700, 4: 29200, 5: 34500,
          6: 40300, 7: 45500, 8: 50500,
        };

        const ipa = incomeProtection[Math.min(familySize, 8)] || incomeProtection[4];

        // Student income protection: $7,040 (2024-2025)
        const studentProtection = 7040;
        const studentContribution = Math.max(0, (studentIncome - studentProtection) * 0.5);

        // Available income from parents
        const availableIncome = Math.max(0, parentIncome - ipa);

        // Tax rate approximation based on income (progressive)
        let taxRate: number;
        if (availableIncome <= 17400) taxRate = 0.22;
        else if (availableIncome <= 21800) taxRate = 0.25;
        else if (availableIncome <= 26300) taxRate = 0.29;
        else if (availableIncome <= 30700) taxRate = 0.34;
        else if (availableIncome <= 35100) taxRate = 0.40;
        else taxRate = 0.47;

        const parentContribution = availableIncome * taxRate;

        // Asset contribution (5.64% of net assets)
        const assetContribution = parentAssets * 0.0564;

        // Total EFC
        const totalEFC = Math.max(0, (parentContribution + assetContribution) / inCollege + studentContribution);

        // Estimate aid
        const avgPublicCOA = 27000;
        const avgPrivateCOA = 58000;
        const publicNeed = Math.max(0, avgPublicCOA - totalEFC);
        const privateNeed = Math.max(0, avgPrivateCOA - totalEFC);

        let pellEligible: string;
        if (totalEFC <= 7395) pellEligible = "Likely eligible for Pell Grant";
        else pellEligible = "Likely not Pell eligible";

        return {
          primary: { label: "Estimated EFC / SAI", value: `$${formatNumber(totalEFC, 0)}` },
          details: [
            { label: "Parent contribution", value: `$${formatNumber(parentContribution / inCollege, 0)}` },
            { label: "Student contribution", value: `$${formatNumber(studentContribution, 0)}` },
            { label: "Asset contribution", value: `$${formatNumber(assetContribution / inCollege, 0)}` },
            { label: "Pell Grant status", value: pellEligible },
            { label: "Financial need (public avg)", value: `$${formatNumber(publicNeed, 0)}` },
            { label: "Financial need (private avg)", value: `$${formatNumber(privateNeed, 0)}` },
          ],
          note: "This is a simplified estimate. Actual EFC/SAI depends on many additional factors. Complete the FAFSA for your official determination.",
        };
      },
    },
    {
      id: "aidPackage",
      name: "Aid Package Breakdown",
      description: "Understand your financial aid package and what you still owe",
      fields: [
        { name: "costOfAttendance", label: "Cost of Attendance ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "grants", label: "Grants & Scholarships ($)", type: "number", placeholder: "e.g. 12000" },
        { name: "workStudy", label: "Work-Study ($)", type: "number", placeholder: "e.g. 2500", defaultValue: 0 },
        { name: "subsidizedLoans", label: "Subsidized Loans Offered ($)", type: "number", placeholder: "e.g. 3500", defaultValue: 0 },
        { name: "unsubsidizedLoans", label: "Unsubsidized Loans Offered ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const coa = inputs.costOfAttendance as number;
        const grants = (inputs.grants as number) || 0;
        const workStudy = (inputs.workStudy as number) || 0;
        const subLoans = (inputs.subsidizedLoans as number) || 0;
        const unsubLoans = (inputs.unsubsidizedLoans as number) || 0;
        if (!coa) return null;

        const freeAid = grants + workStudy;
        const totalAid = freeAid + subLoans + unsubLoans;
        const gap = coa - totalAid;
        const netCost = coa - grants; // true cost after free money
        const grantPercent = (grants / coa) * 100;

        return {
          primary: { label: "Net Cost (after free aid)", value: `$${formatNumber(netCost, 0)}` },
          details: [
            { label: "Cost of attendance", value: `$${formatNumber(coa, 0)}` },
            { label: "Free aid (grants + scholarships)", value: `$${formatNumber(grants, 0)}` },
            { label: "Work-study", value: `$${formatNumber(workStudy, 0)}` },
            { label: "Subsidized loans", value: `$${formatNumber(subLoans, 0)}` },
            { label: "Unsubsidized loans", value: `$${formatNumber(unsubLoans, 0)}` },
            { label: "Total aid package", value: `$${formatNumber(totalAid, 0)}` },
            { label: "Remaining gap", value: `$${formatNumber(Math.max(0, gap), 0)}` },
            { label: "Grant coverage", value: `${formatNumber(grantPercent, 1)}%` },
          ],
          note: gap > 0 ? "You have a remaining gap that will need to be covered by parent PLUS loans, private loans, savings, or out-of-pocket payments." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["scholarship-calculator", "student-loan-calculator", "tuition-cost-calculator"],
  faq: [
    {
      question: "What is the Expected Family Contribution (EFC)?",
      answer:
        "The EFC (now called the Student Aid Index or SAI) is a number calculated from your FAFSA that represents how much your family is expected to contribute toward college costs. It is used to determine your financial need: Need = Cost of Attendance - EFC.",
    },
    {
      question: "What is the Pell Grant and who qualifies?",
      answer:
        "The Federal Pell Grant is free money from the government for undergraduates with financial need. For 2024-2025, the maximum Pell Grant is $7,395. Generally, students with an EFC/SAI under this amount qualify for at least a partial Pell Grant.",
    },
    {
      question: "What is the difference between grants and loans?",
      answer:
        "Grants and scholarships are free money you do not repay. Loans must be repaid with interest. Always maximize grants and scholarships before accepting loans. Subsidized loans are better than unsubsidized because the government pays interest while you are in school.",
    },
  ],
  formula: "Financial Need = Cost of Attendance - Expected Family Contribution (EFC/SAI)",
};
