import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLeaseVsBuyCalculator: CalculatorDefinition = {
  slug: "car-lease-vs-buy-calculator",
  title: "Car Lease vs Buy Calculator",
  description: "Free lease vs buy calculator. Compare the total cost of leasing versus buying a car to determine which option saves you more money.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lease vs buy car", "car lease calculator", "lease or buy", "auto lease comparison", "buy vs lease vehicle"],
  variants: [
    {
      id: "compare",
      name: "Compare Lease vs Buy",
      description: "Compare total costs of leasing versus buying a vehicle",
      fields: [
        { name: "price", label: "Vehicle Price (MSRP)", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "leaseMonthly", label: "Lease Monthly Payment", type: "number", placeholder: "e.g. 350", prefix: "$" },
        { name: "leaseTerm", label: "Lease Term", type: "select", options: [
          { label: "24 months", value: "24" },
          { label: "36 months", value: "36" },
          { label: "48 months", value: "48" },
        ], defaultValue: "36" },
        { name: "buyRate", label: "Loan Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", suffix: "%" },
        { name: "buyTerm", label: "Loan Term", type: "select", options: [
          { label: "48 months", value: "48" },
          { label: "60 months", value: "60" },
          { label: "72 months", value: "72" },
        ], defaultValue: "60" },
        { name: "residualPct", label: "Residual Value (%)", type: "number", placeholder: "e.g. 55", suffix: "%" },
        { name: "yearsToKeep", label: "Years You Plan to Keep Car", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const down = (inputs.downPayment as number) || 0;
        const leaseMonthly = inputs.leaseMonthly as number;
        const leaseTerm = parseInt(inputs.leaseTerm as string) || 36;
        const buyRate = (inputs.buyRate as number) || 0;
        const buyTerm = parseInt(inputs.buyTerm as string) || 60;
        const residualPct = (inputs.residualPct as number) || 55;
        const yearsToKeep = (inputs.yearsToKeep as number) || 5;
        if (!price || !leaseMonthly) return null;

        // Lease cost
        const totalLeasePayments = leaseMonthly * leaseTerm + down;
        const leaseCount = Math.ceil((yearsToKeep * 12) / leaseTerm);
        const totalLeaseCost = totalLeasePayments * leaseCount;

        // Buy cost
        const principal = price - down;
        let buyMonthly: number;
        let totalBuyPayments: number;
        if (buyRate === 0) {
          buyMonthly = principal / buyTerm;
          totalBuyPayments = principal + down;
        } else {
          const r = buyRate / 100 / 12;
          buyMonthly = principal * (r * Math.pow(1 + r, buyTerm)) / (Math.pow(1 + r, buyTerm) - 1);
          totalBuyPayments = buyMonthly * buyTerm + down;
        }

        // Depreciation for the buy option
        const depreciationRate = 0.15; // avg 15% per year
        const resaleValue = price * Math.pow(1 - depreciationRate, yearsToKeep);
        const netBuyCost = totalBuyPayments - resaleValue;

        const savings = totalLeaseCost - netBuyCost;
        const winner = savings > 0 ? "Buying" : "Leasing";

        return {
          primary: { label: `${winner} Saves You`, value: `$${formatNumber(Math.abs(savings))}` },
          details: [
            { label: "Total lease cost (over period)", value: `$${formatNumber(totalLeaseCost)}` },
            { label: "Total buy cost (payments)", value: `$${formatNumber(totalBuyPayments)}` },
            { label: "Estimated resale value", value: `$${formatNumber(resaleValue)}` },
            { label: "Net buy cost (after resale)", value: `$${formatNumber(netBuyCost)}` },
            { label: "Monthly buy payment", value: `$${formatNumber(buyMonthly)}` },
            { label: "Better option", value: winner },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-payment-calculator", "car-depreciation-calculator"],
  faq: [
    { question: "Is it better to lease or buy a car?", answer: "It depends on your situation. Leasing is better if you want lower monthly payments, always drive a new car, and drive under 12,000-15,000 miles/year. Buying is better for long-term savings, unlimited mileage, and building equity. Over 5+ years, buying usually costs less overall." },
    { question: "What is residual value in a lease?", answer: "Residual value is the estimated value of the vehicle at the end of the lease term. It is set by the leasing company and is expressed as a percentage of MSRP. Higher residual values mean lower lease payments because you are paying for less depreciation." },
    { question: "What costs are not included in this comparison?", answer: "This estimate does not include insurance (often higher for leased cars), maintenance, lease-end fees, excess mileage charges, wear-and-tear charges, or opportunity cost of your down payment. Factor these in for a complete comparison." },
  ],
  formula: "Lease Cost = (Monthly Payment x Term + Down) x Number of Leases; Buy Net Cost = Total Payments - Resale Value",
};
