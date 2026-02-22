import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sukanyaSamriddhiCalculator: CalculatorDefinition = {
  slug: "sukanya-samriddhi-calculator",
  title: "Sukanya Samriddhi Yojana Calculator",
  description:
    "Free Sukanya Samriddhi Yojana (SSY) calculator. Calculate maturity amount for your girl child's savings scheme. Estimate returns and interest earned.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Sukanya Samriddhi calculator",
    "SSY calculator",
    "Sukanya Samriddhi Yojana",
    "girl child savings scheme",
    "SSY maturity",
    "SSY interest rate",
  ],
  variants: [
    {
      id: "basic",
      name: "SSY Maturity Calculator",
      description: "Calculate Sukanya Samriddhi Yojana maturity amount",
      fields: [
        {
          name: "yearlyDeposit",
          label: "Yearly Deposit",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "₹",
          min: 250,
          max: 150000,
        },
        {
          name: "girlAge",
          label: "Girl's Current Age",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "years",
          min: 0,
          max: 10,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 8.2",
          suffix: "%",
          min: 1,
          max: 12,
          step: 0.1,
          defaultValue: 8.2,
        },
      ],
      calculate: (inputs) => {
        const yearlyDeposit = inputs.yearlyDeposit as number;
        const girlAge = inputs.girlAge as number;
        const rate = inputs.rate as number;
        if (!yearlyDeposit || girlAge === undefined || !rate) return null;

        const depositYears = 15; // Deposits mandatory for 15 years
        const maturityYear = 21 - girlAge; // Matures when girl turns 21
        const r = rate / 100;

        let balance = 0;

        // Deposit phase (15 years)
        for (let i = 0; i < depositYears; i++) {
          balance = (balance + yearlyDeposit) * (1 + r);
        }

        // Growth phase (no deposits, only interest)
        const remainingYears = maturityYear - depositYears;
        for (let i = 0; i < remainingYears; i++) {
          balance = balance * (1 + r);
        }

        const totalDeposited = yearlyDeposit * depositYears;
        const totalInterest = balance - totalDeposited;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Yearly deposit", value: `₹${formatNumber(yearlyDeposit)}` },
            { label: "Total amount deposited (15 years)", value: `₹${formatNumber(totalDeposited)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Account matures in", value: `${maturityYear} years (at age 21)` },
            { label: "Deposit period", value: "15 years" },
            { label: "Growth-only period", value: `${remainingYears} years` },
          ],
          note: "Tax-free under Section 80C (EEE status). Partial withdrawal (50%) allowed after girl turns 18 for education/marriage.",
        };
      },
    },
    {
      id: "monthly",
      name: "Monthly Deposit Plan",
      description: "Plan SSY with monthly deposit amounts",
      fields: [
        {
          name: "monthlyDeposit",
          label: "Monthly Deposit",
          type: "number",
          placeholder: "e.g. 12500",
          prefix: "₹",
          min: 21,
          max: 12500,
        },
        {
          name: "girlAge",
          label: "Girl's Current Age",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "years",
          min: 0,
          max: 10,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 8.2",
          suffix: "%",
          min: 1,
          max: 12,
          step: 0.1,
          defaultValue: 8.2,
        },
      ],
      calculate: (inputs) => {
        const monthlyDeposit = inputs.monthlyDeposit as number;
        const girlAge = inputs.girlAge as number;
        const rate = inputs.rate as number;
        if (!monthlyDeposit || girlAge === undefined || !rate) return null;

        const yearlyDeposit = monthlyDeposit * 12;
        if (yearlyDeposit > 150000) {
          return {
            primary: { label: "Error", value: "Exceeds ₹1.5L annual limit" },
            note: "Maximum annual deposit in SSY is ₹1,50,000. Please reduce monthly amount.",
          };
        }

        const depositYears = 15;
        const maturityYear = 21 - girlAge;
        const r = rate / 100;

        let balance = 0;
        for (let i = 0; i < depositYears; i++) {
          balance = (balance + yearlyDeposit) * (1 + r);
        }
        const remainingYears = maturityYear - depositYears;
        for (let i = 0; i < remainingYears; i++) {
          balance = balance * (1 + r);
        }

        const totalDeposited = yearlyDeposit * depositYears;
        const totalInterest = balance - totalDeposited;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Monthly deposit", value: `₹${formatNumber(monthlyDeposit)}` },
            { label: "Yearly deposit", value: `₹${formatNumber(yearlyDeposit)}` },
            { label: "Total deposited", value: `₹${formatNumber(totalDeposited)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            { label: "Maturity in", value: `${maturityYear} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ppf-calculator", "fd-calculator", "rd-calculator"],
  faq: [
    {
      question: "What is Sukanya Samriddhi Yojana (SSY)?",
      answer:
        "SSY is a government-backed savings scheme for the girl child in India, launched under the 'Beti Bachao, Beti Padhao' campaign. It offers one of the highest interest rates among small savings schemes and has EEE tax status.",
    },
    {
      question: "What are the eligibility criteria for SSY?",
      answer:
        "The account can be opened for a girl child below 10 years of age by a parent or legal guardian. A maximum of two SSY accounts can be opened per family (one per girl child). The minimum deposit is ₹250 and maximum is ₹1,50,000 per year.",
    },
    {
      question: "When does SSY mature?",
      answer:
        "SSY matures 21 years from the date of account opening or on the marriage of the girl after she turns 18. Deposits are required for only the first 15 years, after which the balance earns interest until maturity.",
    },
  ],
  formula: "Maturity = Σ Deposit × (1+r)^remaining years + Growth phase interest",
};
