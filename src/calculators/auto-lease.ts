import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const autoLeaseCalculator: CalculatorDefinition = {
  slug: "auto-lease-calculator",
  title: "Auto Lease Calculator",
  description:
    "Free auto lease calculator. Estimate monthly lease payments based on MSRP, residual value, money factor, and lease term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["auto lease", "car lease", "lease payment", "residual value", "money factor"],
  variants: [
    {
      id: "standard",
      name: "Lease Payment",
      fields: [
        { name: "msrp", label: "MSRP / Negotiated Price ($)", type: "number", placeholder: "e.g. 35000" },
        { name: "residualPct", label: "Residual Value (%)", type: "number", placeholder: "e.g. 55" },
        { name: "moneyFactor", label: "Money Factor", type: "number", placeholder: "e.g. 0.0025" },
        { name: "leaseTerm", label: "Lease Term (months)", type: "number", placeholder: "e.g. 36" },
        { name: "downPayment", label: "Down Payment ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "tradeIn", label: "Trade-In Value ($)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const msrp = inputs.msrp as number;
        const residualPct = inputs.residualPct as number;
        const moneyFactor = inputs.moneyFactor as number;
        const leaseTerm = inputs.leaseTerm as number;
        const downPayment = inputs.downPayment as number || 0;
        const tradeIn = inputs.tradeIn as number || 0;

        if (!msrp || !residualPct || !moneyFactor || !leaseTerm) return null;

        const residualValue = msrp * (residualPct / 100);
        const netCapCost = msrp - downPayment - tradeIn;
        const depreciation = (netCapCost - residualValue) / leaseTerm;
        const financeCharge = (netCapCost + residualValue) * moneyFactor;
        const monthlyPayment = depreciation + financeCharge;
        const totalCost = monthlyPayment * leaseTerm + downPayment;
        const equivalentAPR = moneyFactor * 2400;

        return {
          primary: { label: "Monthly Lease Payment", value: `$${formatNumber(monthlyPayment, 2)}` },
          details: [
            { label: "Depreciation Charge", value: `$${formatNumber(depreciation, 2)}/mo` },
            { label: "Finance Charge", value: `$${formatNumber(financeCharge, 2)}/mo` },
            { label: "Residual Value", value: `$${formatNumber(residualValue, 2)}` },
            { label: "Net Capitalized Cost", value: `$${formatNumber(netCapCost, 2)}` },
            { label: "Equivalent APR", value: `${formatNumber(equivalentAPR, 2)}%` },
            { label: "Total Lease Cost", value: `$${formatNumber(totalCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "leaseVsBuy",
      name: "Lease vs Buy Comparison",
      fields: [
        { name: "msrp", label: "Vehicle Price ($)", type: "number", placeholder: "e.g. 35000" },
        { name: "residualPct", label: "Residual Value (%)", type: "number", placeholder: "e.g. 55" },
        { name: "moneyFactor", label: "Money Factor", type: "number", placeholder: "e.g. 0.0025" },
        { name: "leaseTerm", label: "Lease Term (months)", type: "number", placeholder: "e.g. 36" },
        { name: "loanRate", label: "Loan Interest Rate (%)", type: "number", placeholder: "e.g. 5" },
        { name: "loanTerm", label: "Loan Term (months)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const msrp = inputs.msrp as number;
        const residualPct = inputs.residualPct as number;
        const moneyFactor = inputs.moneyFactor as number;
        const leaseTerm = inputs.leaseTerm as number;
        const loanRate = inputs.loanRate as number;
        const loanTerm = inputs.loanTerm as number;

        if (!msrp || !residualPct || !moneyFactor || !leaseTerm || !loanRate || !loanTerm) return null;

        // Lease calculation
        const residualValue = msrp * (residualPct / 100);
        const depreciation = (msrp - residualValue) / leaseTerm;
        const financeCharge = (msrp + residualValue) * moneyFactor;
        const leasePayment = depreciation + financeCharge;
        const totalLeaseCost = leasePayment * leaseTerm;

        // Loan calculation
        const monthlyLoanRate = (loanRate / 100) / 12;
        const loanPayment = msrp * (monthlyLoanRate * Math.pow(1 + monthlyLoanRate, loanTerm)) /
          (Math.pow(1 + monthlyLoanRate, loanTerm) - 1);
        const totalLoanCost = loanPayment * loanTerm;

        return {
          primary: { label: "Monthly Lease Payment", value: `$${formatNumber(leasePayment, 2)}` },
          details: [
            { label: "Monthly Loan Payment", value: `$${formatNumber(loanPayment, 2)}` },
            { label: "Monthly Savings (Lease)", value: `$${formatNumber(loanPayment - leasePayment, 2)}` },
            { label: "Total Lease Cost", value: `$${formatNumber(totalLeaseCost, 2)}` },
            { label: "Total Loan Cost", value: `$${formatNumber(totalLoanCost, 2)}` },
            { label: "Vehicle Value After Lease", value: "$0 (returned)" },
            { label: "Vehicle Value After Loan", value: `$${formatNumber(residualValue, 2)} (estimated)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["business-loan-calculator", "budget-calculator", "depreciation-calculator"],
  faq: [
    { question: "What is a money factor?", answer: "A money factor is the lease equivalent of an interest rate. Multiply by 2,400 to get the approximate APR. For example, a money factor of 0.0025 equals about 6% APR." },
    { question: "What is residual value?", answer: "Residual value is the estimated value of the vehicle at the end of the lease term, expressed as a percentage of MSRP. A higher residual value means lower monthly payments." },
  ],
  formula: "Monthly Lease = Depreciation + Finance Charge; Depreciation = (Net Cap Cost - Residual) / Term; Finance = (Net Cap Cost + Residual) × Money Factor",
};
