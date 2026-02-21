import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pmiCalculator2: CalculatorDefinition = {
  slug: "pmi-calculator",
  title: "PMI Calculator",
  description:
    "Free PMI calculator. Estimate your private mortgage insurance cost based on home price, down payment, and PMI rate. See when PMI drops off at 80% LTV.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "pmi calculator",
    "private mortgage insurance calculator",
    "pmi cost calculator",
    "mortgage insurance calculator",
    "pmi removal calculator",
  ],
  variants: [
    {
      id: "pmi-cost",
      name: "Calculate PMI",
      description: "Estimate monthly PMI cost and when it drops off",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 35000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Mortgage Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "pmiRate",
          label: "Annual PMI Rate",
          type: "number",
          placeholder: "e.g. 0.75",
          suffix: "%",
          min: 0.1,
          max: 3,
          step: 0.01,
          defaultValue: 0.75,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const homePrice = inputs.homePrice as number;
        const downPayment = (inputs.downPayment as number) || 0;
        const interestRate = inputs.interestRate as number;
        const pmiRate = (inputs.pmiRate as number) || 0.75;
        const years = parseInt(inputs.term as string) || 30;
        if (!homePrice || !interestRate) return null;

        const loanAmount = homePrice - downPayment;
        const ltv = (loanAmount / homePrice) * 100;

        if (ltv <= 80) {
          return {
            primary: { label: "PMI Required", value: "No" },
            details: [
              { label: "Loan-to-value (LTV)", value: `${formatNumber(ltv, 1)}%` },
              { label: "Down payment %", value: `${formatNumber(100 - ltv, 1)}%` },
            ],
            note: "PMI is not required when your down payment is 20% or more (LTV ≤ 80%).",
          };
        }

        const monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
        const annualPMI = loanAmount * (pmiRate / 100);

        // Calculate when LTV reaches 80% (PMI drops off)
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = years * 12;
        const monthlyPayment =
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

        const target80LTV = homePrice * 0.80;
        let balance = loanAmount;
        let monthsUntilPMIDrops = 0;
        for (let m = 1; m <= numPayments; m++) {
          const interestPortion = balance * monthlyRate;
          const principalPortion = monthlyPayment - interestPortion;
          balance -= principalPortion;
          if (balance <= target80LTV) {
            monthsUntilPMIDrops = m;
            break;
          }
        }

        const yearsUntilDrop = Math.floor(monthsUntilPMIDrops / 12);
        const monthsRemainder = monthsUntilPMIDrops % 12;
        const totalPMICost = monthlyPMI * monthsUntilPMIDrops;

        return {
          primary: {
            label: "Monthly PMI Cost",
            value: `$${formatNumber(monthlyPMI)}`,
          },
          details: [
            { label: "Annual PMI cost", value: `$${formatNumber(annualPMI)}` },
            { label: "Current LTV", value: `${formatNumber(ltv, 1)}%` },
            { label: "PMI drops off in", value: `${yearsUntilDrop} yr ${monthsRemainder} mo` },
            { label: "Total PMI paid", value: `$${formatNumber(totalPMICost)}` },
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Monthly P&I payment", value: `$${formatNumber(monthlyPayment)}` },
            { label: "Total monthly (P&I + PMI)", value: `$${formatNumber(monthlyPayment + monthlyPMI)}` },
          ],
          note: "PMI automatically terminates when your loan balance reaches 78% of the original home value. You can request removal at 80% LTV.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "fha-loan-calculator"],
  faq: [
    {
      question: "What is PMI and when is it required?",
      answer:
        "Private Mortgage Insurance (PMI) is required on conventional loans when the down payment is less than 20% (LTV above 80%). It protects the lender if you default. PMI typically costs 0.5% to 1% of the loan amount annually.",
    },
    {
      question: "When does PMI go away?",
      answer:
        "PMI automatically terminates when your loan balance reaches 78% of the original purchase price. You can request PMI removal when you reach 80% LTV. Some lenders also allow removal based on a new appraisal showing sufficient equity.",
    },
    {
      question: "How can I avoid PMI?",
      answer:
        "You can avoid PMI by making a 20% down payment, using a piggyback loan (80/10/10), choosing a VA loan (no PMI), or opting for lender-paid PMI (which typically means a slightly higher interest rate).",
    },
  ],
  formula:
    "Monthly PMI = (Loan Amount × Annual PMI Rate) / 12. LTV = Loan Amount / Home Price × 100. PMI drops at 80% LTV.",
};
