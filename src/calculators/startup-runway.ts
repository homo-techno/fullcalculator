import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const startupRunwayCalculator: CalculatorDefinition = {
  slug: "startup-runway",
  title: "Startup Cash Runway Calculator",
  description:
    "Calculate how many months of runway your startup has based on cash reserves, monthly burn rate, revenue, and growth projections.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "startup runway",
    "burn rate",
    "cash runway",
    "startup finance",
    "runway calculator",
    "months of runway",
    "startup burn",
    "startup cash",
  ],
  variants: [
    {
      slug: "startup-runway",
      title: "Basic Runway Calculator",
      description:
        "Calculate your startup's cash runway based on burn rate and reserves.",
      fields: [
        {
          id: "cashOnHand",
          label: "Cash on Hand ($)",
          type: "number",
          defaultValue: 500000,
        },
        {
          id: "monthlyRevenue",
          label: "Monthly Revenue ($)",
          type: "number",
          defaultValue: 15000,
        },
        {
          id: "monthlyExpenses",
          label: "Monthly Expenses ($)",
          type: "number",
          defaultValue: 60000,
        },
        {
          id: "revenueGrowthRate",
          label: "Monthly Revenue Growth Rate (%)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "expenseGrowthRate",
          label: "Monthly Expense Growth Rate (%)",
          type: "number",
          defaultValue: 2,
        },
      ],
      calculate(inputs) {
        const cashOnHand = parseFloat(inputs.cashOnHand as string);
        const monthlyRevenue = parseFloat(inputs.monthlyRevenue as string);
        const monthlyExpenses = parseFloat(inputs.monthlyExpenses as string);
        const revenueGrowthRate =
          parseFloat(inputs.revenueGrowthRate as string) / 100;
        const expenseGrowthRate =
          parseFloat(inputs.expenseGrowthRate as string) / 100;

        const grossBurn = monthlyExpenses;
        const netBurn = monthlyExpenses - monthlyRevenue;

        // Calculate runway with growth projections
        let remainingCash = cashOnHand;
        let currentRevenue = monthlyRevenue;
        let currentExpenses = monthlyExpenses;
        let runwayMonths = 0;
        let breakEvenMonth = 0;

        for (let month = 1; month <= 120; month++) {
          const monthNetBurn = currentExpenses - currentRevenue;
          if (monthNetBurn <= 0 && breakEvenMonth === 0) {
            breakEvenMonth = month;
          }
          remainingCash -= monthNetBurn;
          if (remainingCash <= 0) {
            runwayMonths = month;
            break;
          }
          currentRevenue *= 1 + revenueGrowthRate;
          currentExpenses *= 1 + expenseGrowthRate;
          if (month === 120) runwayMonths = 120;
        }

        return {
          "Cash on Hand": "$" + formatNumber(cashOnHand),
          "Gross Monthly Burn": "$" + formatNumber(grossBurn),
          "Net Monthly Burn": "$" + formatNumber(netBurn),
          "Runway (months)": formatNumber(runwayMonths),
          "Runway (with growth)":
            runwayMonths >= 120
              ? "120+ months (sustainable)"
              : formatNumber(runwayMonths) + " months",
          "Break-Even Month":
            breakEvenMonth > 0
              ? "Month " + formatNumber(breakEvenMonth)
              : "Not within projection",
          "Simple Runway (no growth)":
            netBurn > 0
              ? formatNumber(Math.floor(cashOnHand / netBurn)) + " months"
              : "Profitable (infinite)",
          "Annual Burn Rate": "$" + formatNumber(netBurn * 12),
        };
      },
    },
    {
      slug: "startup-runway-detailed",
      title: "Detailed Startup Runway Planner",
      description:
        "Plan startup runway with detailed expense categories.",
      fields: [
        {
          id: "cashOnHand",
          label: "Cash on Hand ($)",
          type: "number",
          defaultValue: 1000000,
        },
        {
          id: "monthlyRevenue",
          label: "Monthly Revenue ($)",
          type: "number",
          defaultValue: 20000,
        },
        {
          id: "salaries",
          label: "Monthly Salaries & Benefits ($)",
          type: "number",
          defaultValue: 35000,
        },
        {
          id: "rent",
          label: "Monthly Rent & Office ($)",
          type: "number",
          defaultValue: 3000,
        },
        {
          id: "infrastructure",
          label: "Monthly Infrastructure (servers, tools) ($)",
          type: "number",
          defaultValue: 5000,
        },
        {
          id: "marketing",
          label: "Monthly Marketing ($)",
          type: "number",
          defaultValue: 8000,
        },
        {
          id: "other",
          label: "Other Monthly Expenses ($)",
          type: "number",
          defaultValue: 4000,
        },
      ],
      calculate(inputs) {
        const cashOnHand = parseFloat(inputs.cashOnHand as string);
        const monthlyRevenue = parseFloat(inputs.monthlyRevenue as string);
        const salaries = parseFloat(inputs.salaries as string);
        const rent = parseFloat(inputs.rent as string);
        const infrastructure = parseFloat(inputs.infrastructure as string);
        const marketing = parseFloat(inputs.marketing as string);
        const other = parseFloat(inputs.other as string);

        const totalExpenses = salaries + rent + infrastructure + marketing + other;
        const netBurn = totalExpenses - monthlyRevenue;
        const runwayMonths = netBurn > 0 ? cashOnHand / netBurn : Infinity;

        return {
          "Total Monthly Expenses": "$" + formatNumber(totalExpenses),
          "Salaries (% of total)":
            formatNumber((salaries / totalExpenses) * 100) + "%",
          "Net Monthly Burn": "$" + formatNumber(netBurn),
          "Runway":
            runwayMonths === Infinity
              ? "Profitable (infinite)"
              : formatNumber(Math.floor(runwayMonths)) + " months",
          "Deadline":
            runwayMonths === Infinity
              ? "N/A - Profitable"
              : formatNumber(Math.floor(runwayMonths)) + " months from now",
          "Revenue Needed for Break-Even":
            "$" + formatNumber(totalExpenses),
          "Revenue Gap": "$" + formatNumber(Math.max(0, totalExpenses - monthlyRevenue)),
        };
      },
    },
    {
      slug: "startup-funding-runway",
      title: "Post-Funding Runway Calculator",
      description:
        "Calculate runway after receiving a funding round.",
      fields: [
        {
          id: "existingCash",
          label: "Existing Cash ($)",
          type: "number",
          defaultValue: 100000,
        },
        {
          id: "fundingAmount",
          label: "Funding Amount ($)",
          type: "number",
          defaultValue: 2000000,
        },
        {
          id: "currentBurn",
          label: "Current Monthly Burn ($)",
          type: "number",
          defaultValue: 40000,
        },
        {
          id: "plannedHires",
          label: "Planned New Hires",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "avgSalary",
          label: "Average New Hire Monthly Cost ($)",
          type: "number",
          defaultValue: 8000,
        },
      ],
      calculate(inputs) {
        const existingCash = parseFloat(inputs.existingCash as string);
        const fundingAmount = parseFloat(inputs.fundingAmount as string);
        const currentBurn = parseFloat(inputs.currentBurn as string);
        const plannedHires = parseFloat(inputs.plannedHires as string);
        const avgSalary = parseFloat(inputs.avgSalary as string);

        const totalCash = existingCash + fundingAmount;
        const newBurn = currentBurn + plannedHires * avgSalary;
        const runwayCurrentBurn = totalCash / currentBurn;
        const runwayNewBurn = totalCash / newBurn;

        return {
          "Total Cash Post-Funding": "$" + formatNumber(totalCash),
          "Current Monthly Burn": "$" + formatNumber(currentBurn),
          "New Monthly Burn (with hires)": "$" + formatNumber(newBurn),
          "Runway at Current Burn":
            formatNumber(Math.floor(runwayCurrentBurn)) + " months",
          "Runway with New Hires":
            formatNumber(Math.floor(runwayNewBurn)) + " months",
          "Additional Hire Cost":
            "$" + formatNumber(plannedHires * avgSalary) + "/mo",
          "Runway Difference":
            formatNumber(
              Math.floor(runwayCurrentBurn) - Math.floor(runwayNewBurn)
            ) + " months",
        };
      },
    },
  ],
  relatedSlugs: [
    "equity-dilution",
    "stock-option-value",
    "saas-metrics",
    "cloud-hosting-cost",
  ],
  faq: [
    {
      question: "How much runway should a startup have?",
      answer:
        "Most investors and advisors recommend maintaining 12-18 months of runway. Startups should begin fundraising when they have 6-9 months of runway remaining, as fundraising typically takes 3-6 months. Having less than 6 months of runway creates significant risk.",
    },
    {
      question: "What is the difference between gross and net burn rate?",
      answer:
        "Gross burn rate is total monthly expenses before revenue. Net burn rate is gross burn minus revenue, representing actual cash loss per month. Net burn is the more important metric for calculating runway, as it accounts for incoming revenue.",
    },
    {
      question: "How do I reduce my startup's burn rate?",
      answer:
        "Common strategies include delaying non-essential hires, negotiating longer payment terms, using cloud credits, reducing office space, outsourcing non-core functions, and focusing marketing spend on highest-ROI channels. Salaries are typically 60-80% of startup burn.",
    },
  ],
  formula:
    "Simple Runway = Cash on Hand / Net Monthly Burn. Net Burn = Monthly Expenses - Monthly Revenue. Break-Even occurs when Revenue >= Expenses.",
};
