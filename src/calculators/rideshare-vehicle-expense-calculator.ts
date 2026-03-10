import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rideshareVehicleExpenseCalculator: CalculatorDefinition = {
  slug: "rideshare-vehicle-expense-calculator",
  title: "Rideshare Vehicle Expense Calculator",
  description:
    "Calculate your true vehicle costs per mile for Uber, Lyft, or delivery driving. Compare IRS mileage deduction vs actual expense method.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rideshare vehicle expense calculator",
    "Uber driver vehicle costs",
    "IRS mileage deduction vs actual",
    "gig driver car expense",
    "rideshare cost per mile",
  ],
  variants: [
    {
      id: "actual",
      name: "Actual Expense Method",
      description: "Calculate real vehicle cost per mile for rideshare/delivery",
      fields: [
        {
          name: "monthlyMiles",
          label: "Total Miles Driven per Month",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "miles",
        },
        {
          name: "businessMilesPct",
          label: "Business Use Percentage",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "%",
          defaultValue: 80,
        },
        {
          name: "monthlyGas",
          label: "Monthly Gas Cost",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
        },
        {
          name: "monthlyInsurance",
          label: "Monthly Insurance",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          defaultValue: 150,
        },
        {
          name: "carPayment",
          label: "Monthly Car Payment / Lease",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "vehicleAge",
          label: "Vehicle Age / Type",
          type: "select",
          options: [
            { label: "New (0–3 years) — high depreciation", value: "new" },
            { label: "Mid-age (4–7 years)", value: "mid" },
            { label: "Older (8+ years) — lower depreciation", value: "old" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const monthlyMiles = parseFloat(inputs.monthlyMiles as string) || 1;
        const bizPct = parseFloat(inputs.businessMilesPct as string) / 100 || 0.8;
        const gas = parseFloat(inputs.monthlyGas as string) || 0;
        const insurance = parseFloat(inputs.monthlyInsurance as string) || 150;
        const carPayment = parseFloat(inputs.carPayment as string) || 0;
        const age = inputs.vehicleAge as string;

        const depreciationPerMile: Record<string, number> = { new: 0.12, mid: 0.07, old: 0.04 };
        const maintenancePerMile: Record<string, number> = { new: 0.04, mid: 0.06, old: 0.09 };

        const depPM = depreciationPerMile[age] || 0.07;
        const mntPM = maintenancePerMile[age] || 0.06;

        const monthlyDepreciation = monthlyMiles * depPM;
        const monthlyMaintenance = monthlyMiles * mntPM;
        const totalMonthlyCost = gas + insurance + carPayment + monthlyDepreciation + monthlyMaintenance;
        const businessCost = totalMonthlyCost * bizPct;
        const costPerMile = monthlyMiles > 0 ? totalMonthlyCost / monthlyMiles : 0;
        const businessCostPerMile = monthlyMiles > 0 ? businessCost / (monthlyMiles * bizPct) : 0;

        // IRS standard mileage for comparison
        const irsRate = 0.67; // 2024 rate
        const irsMileageDeduction = monthlyMiles * bizPct * irsRate;
        const actualDeduction = businessCost;
        const betterMethod = irsMileageDeduction > actualDeduction ? "IRS Mileage Rate" : "Actual Expenses";

        return {
          primary: { label: "Cost per Mile", value: `$${formatNumber(costPerMile, 3)}/mile` },
          details: [
            { label: "Monthly gas", value: `$${formatNumber(gas, 2)}` },
            { label: "Monthly insurance", value: `$${formatNumber(insurance, 2)}` },
            { label: "Car payment", value: `$${formatNumber(carPayment, 2)}` },
            { label: "Depreciation", value: `$${formatNumber(monthlyDepreciation, 2)}` },
            { label: "Maintenance estimate", value: `$${formatNumber(monthlyMaintenance, 2)}` },
            { label: "Total monthly vehicle cost", value: `$${formatNumber(totalMonthlyCost, 2)}` },
            { label: "Business portion", value: `$${formatNumber(businessCost, 2)}/mo` },
            { label: "IRS mileage deduction (67¢/mi)", value: `$${formatNumber(irsMileageDeduction, 2)}/mo` },
            { label: "Better tax method", value: betterMethod },
          ],
          note: `Use the ${betterMethod} for your tax deduction. IRS standard rate is simpler; actual expenses may save more if you drive a newer, expensive vehicle.`,
        };
      },
    },
  ],
  relatedSlugs: ["mileage-tax-deduction-calculator", "uber-driver-net-earnings-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "What is the IRS mileage rate for 2024?",
      answer:
        "The 2024 IRS standard mileage rate is 67 cents per mile for business use. You multiply your business miles by 0.67 to get your deduction. This is simpler than tracking actual expenses and often more beneficial for newer, fuel-efficient vehicles.",
    },
    {
      question: "Should I use IRS mileage or actual expenses for my rideshare taxes?",
      answer:
        "Use IRS mileage if you drive a fuel-efficient car with low operating costs — the flat 67¢/mile often exceeds actual costs. Use actual expenses if you drive a newer, expensive vehicle with high depreciation, insurance, or if you drive fewer miles. You must choose one method consistently.",
    },
    {
      question: "What vehicle costs can rideshare drivers deduct?",
      answer:
        "Rideshare drivers can deduct the business portion of: gas, insurance, maintenance, depreciation (or lease payments), registration, and car washes. You cannot deduct personal commuting miles — only miles driven for the app (including deadhead miles between pickups).",
    },
  ],
  formula: "Cost/Mile = (Gas + Insurance + Payment + Depreciation + Maintenance) ÷ Total Miles",
};
