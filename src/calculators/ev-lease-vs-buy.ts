import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evLeaseVsBuyCalculator: CalculatorDefinition = {
  slug: "ev-lease-vs-buy-calculator",
  title: "EV Lease vs Buy Calculator",
  description:
    "Compare the total cost of leasing versus buying an electric vehicle. Factor in federal tax credits, depreciation, loan interest, and maintenance to find your best option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ev lease vs buy",
    "electric vehicle lease",
    "ev purchase",
    "ev financing",
    "ev tax credit lease",
    "electric car lease",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Comparison",
      description: "Full lease vs buy comparison with tax credits and residual value",
      fields: [
        { name: "vehiclePrice", label: "Vehicle MSRP ($)", type: "number", placeholder: "e.g. 45000" },
        { name: "downPayment", label: "Down Payment ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "loanRate", label: "Loan APR (%)", type: "number", placeholder: "e.g. 5.5", step: 0.1 },
        { name: "loanTerm", label: "Loan Term (months)", type: "number", placeholder: "e.g. 60" },
        { name: "monthlyLease", label: "Monthly Lease Payment ($)", type: "number", placeholder: "e.g. 450" },
        { name: "leaseTerm", label: "Lease Term (months)", type: "number", placeholder: "e.g. 36" },
        { name: "leaseDownPayment", label: "Lease Down / Due at Signing ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "federalCredit", label: "Federal Tax Credit ($)", type: "number", placeholder: "e.g. 7500" },
        { name: "residualPercent", label: "Residual Value after Lease Term (%)", type: "number", placeholder: "e.g. 55" },
        { name: "annualInsurance", label: "Annual Insurance ($)", type: "number", placeholder: "e.g. 1800" },
      ],
      calculate: (inputs) => {
        const vehiclePrice = parseFloat(inputs.vehiclePrice as string);
        const downPayment = parseFloat(inputs.downPayment as string);
        const loanRate = parseFloat(inputs.loanRate as string);
        const loanTerm = parseFloat(inputs.loanTerm as string);
        const monthlyLease = parseFloat(inputs.monthlyLease as string);
        const leaseTerm = parseFloat(inputs.leaseTerm as string);
        const leaseDownPayment = parseFloat(inputs.leaseDownPayment as string);
        const federalCredit = parseFloat(inputs.federalCredit as string) || 0;
        const residualPercent = parseFloat(inputs.residualPercent as string);
        const annualInsurance = parseFloat(inputs.annualInsurance as string) || 0;

        if (!vehiclePrice || !loanRate || !loanTerm || !monthlyLease || !leaseTerm || !residualPercent) return null;

        const monthlyRate = loanRate / 100 / 12;
        const loanAmount = vehiclePrice - downPayment;
        const monthlyPayment =
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
          (Math.pow(1 + monthlyRate, loanTerm) - 1);
        const totalLoanPayments = monthlyPayment * loanTerm + downPayment;
        const totalLoanInterest = totalLoanPayments - vehiclePrice;
        const residualValue = vehiclePrice * (residualPercent / 100);
        const buyNetCost = totalLoanPayments - federalCredit - residualValue;
        const leaseInsurance = (annualInsurance * leaseTerm) / 12;
        const buyInsurance = (annualInsurance * loanTerm) / 12;
        const totalLeaseCost = monthlyLease * leaseTerm + leaseDownPayment + leaseInsurance;
        const totalBuyCost = buyNetCost + buyInsurance;
        const monthlyBuyEquiv = totalBuyCost / loanTerm;
        const monthlyLeaseEquiv = totalLeaseCost / leaseTerm;
        const savings = totalBuyCost - totalLeaseCost;

        return {
          primary: {
            label: savings > 0 ? "Leasing Saves You" : "Buying Saves You",
            value: `$${formatNumber(Math.abs(savings), 2)}`,
          },
          details: [
            { label: "Total Buy Cost (net)", value: `$${formatNumber(totalBuyCost, 2)}` },
            { label: "Monthly Loan Payment", value: `$${formatNumber(monthlyPayment, 2)}` },
            { label: "Total Loan Interest", value: `$${formatNumber(totalLoanInterest, 2)}` },
            { label: "Tax Credit Savings (Buy)", value: `$${formatNumber(federalCredit, 2)}` },
            { label: "Vehicle Residual Value", value: `$${formatNumber(residualValue, 2)}` },
            { label: "Total Lease Cost", value: `$${formatNumber(totalLeaseCost, 2)}` },
            { label: "Effective Monthly Cost (Buy)", value: `$${formatNumber(monthlyBuyEquiv, 2)}` },
            { label: "Effective Monthly Cost (Lease)", value: `$${formatNumber(monthlyLeaseEquiv, 2)}` },
          ],
          note: savings > 0
            ? "Leasing appears cheaper over this period, but you build no equity."
            : "Buying costs less overall and you own the vehicle at the end.",
        };
      },
    },
    {
      id: "quick",
      name: "Quick Comparison",
      description: "Simplified lease vs buy with fewer inputs",
      fields: [
        { name: "vehiclePrice", label: "Vehicle Price ($)", type: "number", placeholder: "e.g. 45000" },
        { name: "downPayment", label: "Down Payment ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "loanRate", label: "Loan APR (%)", type: "number", placeholder: "e.g. 5.5", step: 0.1 },
        { name: "monthlyLease", label: "Monthly Lease Payment ($)", type: "number", placeholder: "e.g. 450" },
        { name: "termMonths", label: "Comparison Period (months)", type: "number", placeholder: "e.g. 36" },
        { name: "federalCredit", label: "Federal Tax Credit ($)", type: "number", placeholder: "e.g. 7500" },
      ],
      calculate: (inputs) => {
        const vehiclePrice = parseFloat(inputs.vehiclePrice as string);
        const downPayment = parseFloat(inputs.downPayment as string) || 0;
        const loanRate = parseFloat(inputs.loanRate as string);
        const monthlyLease = parseFloat(inputs.monthlyLease as string);
        const termMonths = parseFloat(inputs.termMonths as string);
        const federalCredit = parseFloat(inputs.federalCredit as string) || 0;

        if (!vehiclePrice || !loanRate || !monthlyLease || !termMonths) return null;

        const r = loanRate / 100 / 12;
        const loanAmt = vehiclePrice - downPayment;
        const monthlyLoan = (loanAmt * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
        const totalBuy = monthlyLoan * termMonths + downPayment - federalCredit;
        const totalLease = monthlyLease * termMonths;
        const diff = totalBuy - totalLease;

        return {
          primary: {
            label: diff > 0 ? "Leasing Saves" : "Buying Saves",
            value: `$${formatNumber(Math.abs(diff), 2)}`,
          },
          details: [
            { label: "Total Buy Payments", value: `$${formatNumber(totalBuy, 2)}` },
            { label: "Monthly Loan Payment", value: `$${formatNumber(monthlyLoan, 2)}` },
            { label: "Total Lease Payments", value: `$${formatNumber(totalLease, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-vs-gas-total-cost-calculator", "ev-tax-credit-calculator", "ev-home-charger-cost-calculator"],
  faq: [
    {
      question: "Is it better to lease or buy an electric vehicle?",
      answer:
        "It depends on your situation. Leasing often has lower monthly costs and lets you upgrade every few years as EV technology improves. Buying is better long-term since EVs have low maintenance costs and you benefit from tax credits directly. If you drive a lot, buying avoids mileage penalties.",
    },
    {
      question: "Can I get the federal EV tax credit if I lease?",
      answer:
        "When you lease, the leasing company (not you) technically claims the federal tax credit. However, many lessors pass some or all of that savings through as a reduced lease price or cap cost reduction. Always ask the dealer how the credit is applied.",
    },
    {
      question: "How does EV depreciation compare to gas cars?",
      answer:
        "EVs have historically depreciated faster than gas cars, though this gap is narrowing with popular models like Tesla. Battery longevity concerns drive some depreciation, but newer EVs with better batteries are holding value better.",
    },
  ],
  formula:
    "Buy Cost = (Monthly Payment × Term) + Down Payment − Tax Credit − Residual Value; Lease Cost = (Monthly Lease × Term) + Due at Signing; Monthly Payment = P × r(1+r)^n / ((1+r)^n − 1)",
};
