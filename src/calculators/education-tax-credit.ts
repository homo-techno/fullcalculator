import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const educationTaxCreditCalculator: CalculatorDefinition = {
  slug: "education-tax-credit-calculator",
  title: "Education Tax Credit Calculator",
  description:
    "Free education tax credit calculator. Compare the American Opportunity Credit and Lifetime Learning Credit to maximize your education tax benefit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "education tax credit",
    "American Opportunity Credit",
    "Lifetime Learning Credit",
    "tuition tax credit",
    "college tax credit",
  ],
  variants: [
    {
      id: "education-credit",
      name: "Education Tax Credit Comparison",
      description:
        "Compare American Opportunity Credit (AOC) and Lifetime Learning Credit (LLC)",
      fields: [
        {
          name: "tuitionExpenses",
          label: "Qualified Tuition & Fees",
          type: "number",
          placeholder: "e.g. 12000",
          prefix: "$",
        },
        {
          name: "booksSupplies",
          label: "Books & Supplies (AOC only)",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "agi",
          label: "Adjusted Gross Income (AGI)",
          type: "number",
          placeholder: "e.g. 70000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single / Head of Household", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
        },
        {
          name: "yearInCollege",
          label: "Year in College",
          type: "select",
          options: [
            { label: "1st Year", value: "1" },
            { label: "2nd Year", value: "2" },
            { label: "3rd Year", value: "3" },
            { label: "4th Year", value: "4" },
            { label: "5th+ Year / Graduate", value: "5" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const tuition = inputs.tuitionExpenses as number;
        const books = (inputs.booksSupplies as number) || 0;
        const agi = inputs.agi as number;
        const status = inputs.filingStatus as string;
        const year = parseInt(inputs.yearInCollege as string) || 1;

        if (!tuition || tuition <= 0 || !agi) return null;

        // American Opportunity Credit
        const aocPhaseoutStart = status === "married" ? 160000 : 80000;
        const aocPhaseoutEnd = status === "married" ? 180000 : 90000;
        const aocEligible = year <= 4;

        let aocCredit = 0;
        if (aocEligible) {
          const qualifiedExpenses = tuition + books;
          const first2000 = Math.min(qualifiedExpenses, 2000);
          const next2000 = Math.min(Math.max(0, qualifiedExpenses - 2000), 2000);
          aocCredit = first2000 + next2000 * 0.25;

          if (agi > aocPhaseoutStart) {
            const phaseoutFraction = Math.min(
              1,
              (agi - aocPhaseoutStart) / (aocPhaseoutEnd - aocPhaseoutStart)
            );
            aocCredit *= 1 - phaseoutFraction;
          }
        }

        // Lifetime Learning Credit
        const llcPhaseoutStart = status === "married" ? 160000 : 80000;
        const llcPhaseoutEnd = status === "married" ? 180000 : 90000;
        const llcQualified = Math.min(tuition, 10000);
        let llcCredit = llcQualified * 0.2;

        if (agi > llcPhaseoutStart) {
          const phaseoutFraction = Math.min(
            1,
            (agi - llcPhaseoutStart) / (llcPhaseoutEnd - llcPhaseoutStart)
          );
          llcCredit *= 1 - phaseoutFraction;
        }

        const recommended = aocCredit >= llcCredit ? "American Opportunity" : "Lifetime Learning";
        const bestCredit = Math.max(aocCredit, llcCredit);
        const refundableAmount = recommended === "American Opportunity" ? bestCredit * 0.4 : 0;

        return {
          primary: {
            label: "Best Education Credit",
            value: `$${formatNumber(bestCredit)}`,
          },
          details: [
            {
              label: "Recommended credit",
              value: recommended,
            },
            {
              label: "American Opportunity Credit",
              value: aocEligible
                ? `$${formatNumber(aocCredit)}`
                : "Not eligible (5th+ year)",
            },
            {
              label: "Lifetime Learning Credit",
              value: `$${formatNumber(llcCredit)}`,
            },
            {
              label: "Refundable portion (AOC only, 40%)",
              value: `$${formatNumber(refundableAmount)}`,
            },
            {
              label: "Non-refundable portion",
              value: `$${formatNumber(bestCredit - refundableAmount)}`,
            },
          ],
          note: "You cannot claim both credits for the same student. AOC is available for the first 4 years of college only, while LLC is available for any post-secondary education.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "dependent-tax-credit-calculator",
    "529-tax-benefit-calculator",
  ],
  faq: [
    {
      question: "What is the American Opportunity Credit?",
      answer:
        "The AOC provides up to $2,500 per eligible student for the first 4 years of college. It covers tuition, fees, and course materials. 40% ($1,000) is refundable, meaning you can get it even if you owe no tax.",
    },
    {
      question: "Can I claim both the AOC and LLC?",
      answer:
        "You cannot claim both credits for the same student in the same year, but you can claim different credits for different students. Choose the one that gives you the larger benefit.",
    },
  ],
  formula:
    "AOC = 100% of first $2,000 + 25% of next $2,000 (max $2,500); LLC = 20% of first $10,000 (max $2,000)",
};
