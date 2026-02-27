import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeSolarLoanCalculator: CalculatorDefinition = {
  slug: "home-solar-loan-calculator",
  title: "Solar Loan Payment & Net Savings Calculator",
  description:
    "Calculate your monthly solar loan payment and determine your net savings from day one. Compare loan payments against electric bill savings to find your net monthly cost or benefit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "solar loan",
    "solar financing",
    "solar panel payment",
    "solar loan calculator",
    "solar monthly payment",
    "finance solar panels",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Solar Loan Analysis",
      description: "Full loan payment and savings analysis with ITC",
      fields: [
        { name: "systemCost", label: "Total System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "downPayment", label: "Down Payment ($)", type: "number", placeholder: "e.g. 0" },
        { name: "loanRate", label: "Loan APR (%)", type: "number", placeholder: "e.g. 5.99", step: 0.01 },
        { name: "loanTerm", label: "Loan Term (years)", type: "number", placeholder: "e.g. 20" },
        {
          name: "itcUsage",
          label: "Federal ITC Strategy",
          type: "select",
          options: [
            { label: "Apply 30% ITC to principal after year 1", value: "principal" },
            { label: "Pocket the ITC savings", value: "pocket" },
            { label: "No ITC", value: "none" },
          ],
          defaultValue: "principal",
        },
        { name: "monthlyBillSavings", label: "Monthly Electric Bill Savings ($)", type: "number", placeholder: "e.g. 150" },
        { name: "annualProduction", label: "Annual Solar Production (kWh)", type: "number", placeholder: "e.g. 10000" },
        { name: "electricityRate", label: "Current Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.15", step: 0.01 },
        { name: "rateEscalation", label: "Annual Rate Escalation (%)", type: "number", placeholder: "e.g. 3", step: 0.1 },
      ],
      calculate: (inputs) => {
        const systemCost = parseFloat(inputs.systemCost as string);
        const downPayment = parseFloat(inputs.downPayment as string) || 0;
        const loanRate = parseFloat(inputs.loanRate as string);
        const loanTermYears = parseFloat(inputs.loanTerm as string);
        const itcUsage = inputs.itcUsage as string;
        const monthlyBillSavings = parseFloat(inputs.monthlyBillSavings as string);
        const rateEscalation = parseFloat(inputs.rateEscalation as string) || 3;

        if (!systemCost || !loanRate || !loanTermYears || !monthlyBillSavings) return null;

        const itcAmount = itcUsage !== "none" ? systemCost * 0.30 : 0;
        const loanAmount = systemCost - downPayment;
        const monthlyRate = loanRate / 100 / 12;
        const numPayments = loanTermYears * 12;
        const monthlyPayment =
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

        let reducedPayment = monthlyPayment;
        if (itcUsage === "principal") {
          const reducedLoan = loanAmount - itcAmount;
          const remainingPayments = numPayments - 12;
          if (remainingPayments > 0) {
            let balanceAtYear1 = loanAmount;
            for (let m = 0; m < 12; m++) {
              balanceAtYear1 = balanceAtYear1 * (1 + monthlyRate) - monthlyPayment;
            }
            balanceAtYear1 -= itcAmount;
            reducedPayment =
              (balanceAtYear1 * monthlyRate * Math.pow(1 + monthlyRate, remainingPayments)) /
              (Math.pow(1 + monthlyRate, remainingPayments) - 1);
          }
        }

        const totalInterest = monthlyPayment * numPayments - loanAmount;
        const netMonthlyCostYear1 = monthlyPayment - monthlyBillSavings;

        let totalLoanPayments = 0;
        let totalSavings = 0;
        for (let year = 1; year <= loanTermYears; year++) {
          const yearPayment = (year === 1 || itcUsage !== "principal" ? monthlyPayment : reducedPayment) * 12;
          const yearSavings = monthlyBillSavings * 12 * Math.pow(1 + rateEscalation / 100, year - 1);
          totalLoanPayments += yearPayment;
          totalSavings += yearSavings;
        }

        const itcBenefit = itcUsage === "pocket" ? itcAmount : 0;
        const netCostOverLoan = totalLoanPayments - totalSavings - itcBenefit + downPayment;
        const costPerMonth = netCostOverLoan / (loanTermYears * 12);

        return {
          primary: {
            label: "Monthly Loan Payment",
            value: `$${formatNumber(monthlyPayment, 2)}`,
          },
          details: [
            { label: "Net Monthly Cost (Year 1)", value: netMonthlyCostYear1 > 0 ? `$${formatNumber(netMonthlyCostYear1, 2)}` : `-$${formatNumber(Math.abs(netMonthlyCostYear1), 2)} (savings!)` },
            { label: "Monthly Bill Savings (Year 1)", value: `$${formatNumber(monthlyBillSavings, 2)}` },
            { label: "Loan Amount", value: `$${formatNumber(loanAmount, 2)}` },
            { label: "Total Interest Paid", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Federal ITC (30%)", value: `$${formatNumber(itcAmount, 2)}` },
            ...(itcUsage === "principal"
              ? [{ label: "Payment After ITC Applied", value: `$${formatNumber(reducedPayment, 2)}` }]
              : []),
            { label: `${loanTermYears}-Year Total Payments`, value: `$${formatNumber(totalLoanPayments, 2)}` },
            { label: `${loanTermYears}-Year Total Savings`, value: `$${formatNumber(totalSavings, 2)}` },
            { label: "Avg Net Monthly Cost", value: costPerMonth > 0 ? `$${formatNumber(costPerMonth, 2)}` : `-$${formatNumber(Math.abs(costPerMonth), 2)} (net savings)` },
          ],
          note: netMonthlyCostYear1 < 0
            ? "Your solar savings exceed your loan payment from day one!"
            : `Your net monthly cost is $${formatNumber(netMonthlyCostYear1, 2)}. As electricity rates rise ${rateEscalation}%/year, savings will grow.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Payment Estimate",
      fields: [
        { name: "systemCost", label: "System Cost ($)", type: "number", placeholder: "e.g. 25000" },
        { name: "loanRate", label: "APR (%)", type: "number", placeholder: "e.g. 5.99", step: 0.01 },
        { name: "loanYears", label: "Loan Term (years)", type: "number", placeholder: "e.g. 20" },
        { name: "monthlyBill", label: "Current Monthly Electric Bill ($)", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const cost = parseFloat(inputs.systemCost as string);
        const rate = parseFloat(inputs.loanRate as string);
        const years = parseFloat(inputs.loanYears as string);
        const bill = parseFloat(inputs.monthlyBill as string);

        if (!cost || !rate || !years || !bill) return null;

        const itc = cost * 0.30;
        const loan = cost;
        const r = rate / 100 / 12;
        const n = years * 12;
        const payment = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const billSavings = bill * 0.90;
        const netMonthly = payment - billSavings;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(payment, 2)}` },
          details: [
            { label: "Monthly Bill Savings (~90%)", value: `$${formatNumber(billSavings, 2)}` },
            { label: "Net Monthly Cost", value: netMonthly > 0 ? `$${formatNumber(netMonthly, 2)}` : `-$${formatNumber(Math.abs(netMonthly), 2)} savings` },
            { label: "Federal ITC Available", value: `$${formatNumber(itc, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "solar-tax-credit-calculator", "net-metering-savings-calculator"],
  faq: [
    {
      question: "Are solar loans worth it?",
      answer:
        "Solar loans are worth it when your monthly loan payment is close to or less than your current electric bill savings. Many homeowners see positive cash flow from day one. The key is getting a competitive interest rate (5-7%) and properly sizing the system. The 30% ITC significantly reduces the effective cost.",
    },
    {
      question: "Should I apply the ITC to my solar loan principal?",
      answer:
        "Applying the 30% ITC to your loan principal after year 1 is usually the best strategy. It reduces your remaining balance, lowering your monthly payment for the rest of the loan term. Some people prefer to pocket the cash, which is also valid if you have higher-interest debt to pay off.",
    },
    {
      question: "What is a good interest rate for a solar loan?",
      answer:
        "As of 2024, good solar loan rates range from 4.5-8% APR depending on credit score and loan term. Rates under 6% are considered very good. Be cautious of 0% dealer rates, which often include hidden fees built into a higher system price. Compare the total cost, not just the rate.",
    },
  ],
  formula:
    "Monthly Payment = P × r(1+r)^n / ((1+r)^n − 1); Net Monthly = Payment − Bill Savings; ITC = 30% × System Cost; Adjusted Payment recalculated after ITC applied to principal at month 12",
};
