import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const popupShopCostCalculator: CalculatorDefinition = {
  slug: "popup-shop-cost",
  title: "Pop-Up Shop Cost Estimator",
  description:
    "Estimate the total cost of running a pop-up shop including rent, fixtures, staffing, marketing, and permits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "pop-up shop",
    "temporary retail",
    "retail costs",
    "event booth",
    "popup store",
    "market stall",
    "vendor booth",
  ],
  variants: [
    {
      slug: "popup-shop-cost",
      title: "Pop-Up Shop Total Cost",
      description:
        "Calculate the total investment and break-even for a pop-up shop.",
      fields: [
        {
          name: "duration",
          label: "Duration (days)",
          type: "number",
          defaultValue: "7",
        },
        {
          name: "dailyRent",
          label: "Daily Rent/Space Fee ($)",
          type: "number",
          defaultValue: "200",
        },
        {
          name: "fixturesDecor",
          label: "Fixtures & Decor ($)",
          type: "number",
          defaultValue: "1500",
        },
        {
          name: "inventoryCost",
          label: "Inventory Investment ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "staffPerDay",
          label: "Staff Members Per Day",
          type: "number",
          defaultValue: "2",
        },
        {
          name: "hourlyWage",
          label: "Hourly Wage ($)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "hoursPerDay",
          label: "Operating Hours Per Day",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "marketing",
          label: "Marketing & Signage ($)",
          type: "number",
          defaultValue: "500",
        },
        {
          name: "permits",
          label: "Permits & Insurance ($)",
          type: "number",
          defaultValue: "300",
        },
        {
          name: "avgTransactionValue",
          label: "Avg Transaction Value ($)",
          type: "number",
          defaultValue: "35",
        },
        {
          name: "profitMarginPercent",
          label: "Profit Margin on Products (%)",
          type: "number",
          defaultValue: "60",
        },
      ],
      calculate(inputs) {
        const days = parseFloat(inputs.duration as string);
        const dailyRent = parseFloat(inputs.dailyRent as string);
        const fixtures = parseFloat(inputs.fixturesDecor as string);
        const inventory = parseFloat(inputs.inventoryCost as string);
        const staff = parseFloat(inputs.staffPerDay as string);
        const wage = parseFloat(inputs.hourlyWage as string);
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string);
        const marketing = parseFloat(inputs.marketing as string);
        const permits = parseFloat(inputs.permits as string);
        const avgTransaction = parseFloat(inputs.avgTransactionValue as string);
        const marginPct = parseFloat(inputs.profitMarginPercent as string) / 100;

        const totalRent = dailyRent * days;
        const totalLabor = staff * wage * hoursPerDay * days;
        const payrollTax = totalLabor * 0.0765;
        const totalOperatingCost =
          totalRent + fixtures + totalLabor + payrollTax + marketing + permits;
        const totalInvestment = totalOperatingCost + inventory;

        const grossProfitPerSale = avgTransaction * marginPct;
        const breakEvenSales = Math.ceil(totalOperatingCost / grossProfitPerSale);
        const breakEvenRevenue = breakEvenSales * avgTransaction;
        const dailyBreakEven = Math.ceil(breakEvenSales / days);
        const costPerDay = totalOperatingCost / days;

        return {
          "Total Rent": `$${formatNumber(totalRent)}`,
          "Fixtures & Decor": `$${formatNumber(fixtures)}`,
          "Total Labor": `$${formatNumber(totalLabor)}`,
          "Payroll Tax": `$${formatNumber(payrollTax)}`,
          "Marketing & Signage": `$${formatNumber(marketing)}`,
          "Permits & Insurance": `$${formatNumber(permits)}`,
          "Total Operating Cost": `$${formatNumber(totalOperatingCost)}`,
          "Inventory Investment": `$${formatNumber(inventory)}`,
          "Total Investment": `$${formatNumber(totalInvestment)}`,
          "Cost Per Day": `$${formatNumber(costPerDay)}`,
          "Break-Even Sales": `${formatNumber(breakEvenSales)} transactions`,
          "Daily Sales Needed": `${formatNumber(dailyBreakEven)} transactions`,
          "Break-Even Revenue": `$${formatNumber(breakEvenRevenue)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "food-truck-cost",
    "product-pricing",
    "business-insurance-cost",
  ],
  faq: [
    {
      question: "How much does a pop-up shop cost?",
      answer:
        "Pop-up shop costs vary widely: $50-500/day for market booths, $200-2,000/day for retail spaces, and $1,000-10,000/day for premium locations. Total costs including fixtures, inventory, staff, and marketing typically range from $2,000-$20,000 for a weekend to $5,000-$50,000+ for a month.",
    },
    {
      question: "What permits do I need for a pop-up shop?",
      answer:
        "Typical requirements include a temporary business license, seller's permit (for sales tax collection), health department permit (if selling food), fire marshal approval for indoor spaces, and liability insurance. Requirements vary by city and state.",
    },
  ],
  formula:
    "Operating Cost = Rent + Fixtures + Labor + Payroll Tax + Marketing + Permits. Break-Even Sales = Operating Cost / (Avg Transaction x Profit Margin). Total Investment = Operating Cost + Inventory.",
};
