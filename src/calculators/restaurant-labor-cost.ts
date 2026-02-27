import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantLaborCostCalculator: CalculatorDefinition = {
  slug: "restaurant-labor-cost",
  title: "Restaurant Labor Cost Calculator",
  description:
    "Calculate your restaurant labor cost percentage including wages, benefits, payroll taxes, and overtime to optimize staffing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "restaurant",
    "labor cost",
    "staffing",
    "payroll",
    "wages",
    "overtime",
    "labor percentage",
  ],
  variants: [
    {
      slug: "restaurant-labor-cost",
      title: "Restaurant Labor Cost Percentage",
      description:
        "Calculate total labor cost as a percentage of revenue and compare to targets.",
      fields: [
        {
          name: "totalSales",
          label: "Total Monthly Sales ($)",
          type: "number",
          defaultValue: "80000",
        },
        {
          name: "hourlyWages",
          label: "Total Monthly Hourly Wages ($)",
          type: "number",
          defaultValue: "16000",
        },
        {
          name: "salariedManagement",
          label: "Monthly Salaried Management ($)",
          type: "number",
          defaultValue: "6000",
        },
        {
          name: "overtimeHours",
          label: "Monthly Overtime Hours",
          type: "number",
          defaultValue: "40",
        },
        {
          name: "avgHourlyRate",
          label: "Average Hourly Rate ($)",
          type: "number",
          defaultValue: "14",
        },
        {
          name: "benefitsCost",
          label: "Monthly Benefits Cost ($)",
          type: "number",
          defaultValue: "2000",
        },
        {
          name: "targetLaborPercent",
          label: "Target Labor Cost (%)",
          type: "number",
          defaultValue: "30",
        },
      ],
      calculate(inputs) {
        const sales = parseFloat(inputs.totalSales as string);
        const hourlyWages = parseFloat(inputs.hourlyWages as string);
        const salaried = parseFloat(inputs.salariedManagement as string);
        const otHours = parseFloat(inputs.overtimeHours as string);
        const avgRate = parseFloat(inputs.avgHourlyRate as string);
        const benefits = parseFloat(inputs.benefitsCost as string);
        const target = parseFloat(inputs.targetLaborPercent as string);

        const overtimeCost = otHours * avgRate * 0.5;
        const payrollTaxes = (hourlyWages + salaried + overtimeCost) * 0.0765;
        const totalLaborCost =
          hourlyWages + salaried + overtimeCost + benefits + payrollTaxes;
        const laborPercent = (totalLaborCost / sales) * 100;
        const targetLabor = sales * (target / 100);
        const variance = totalLaborCost - targetLabor;
        const salesPerLaborDollar = sales / totalLaborCost;
        const primeCoast = totalLaborCost + sales * 0.3;
        const primeCostPercent = (primeCoast / sales) * 100;

        return {
          "Total Hourly Wages": `$${formatNumber(hourlyWages)}`,
          "Salaried Management": `$${formatNumber(salaried)}`,
          "Overtime Premium": `$${formatNumber(overtimeCost)}`,
          "Payroll Taxes (7.65%)": `$${formatNumber(payrollTaxes)}`,
          "Benefits": `$${formatNumber(benefits)}`,
          "Total Labor Cost": `$${formatNumber(totalLaborCost)}`,
          "Labor Cost %": `${formatNumber(laborPercent)}%`,
          "Target Labor Cost": `$${formatNumber(targetLabor)}`,
          "Variance from Target": `$${formatNumber(variance)}`,
          "Sales Per Labor Dollar": `$${formatNumber(salesPerLaborDollar)}`,
          "Prime Cost (Food+Labor)": `$${formatNumber(primeCoast)}`,
          "Prime Cost %": `${formatNumber(primeCostPercent)}%`,
        };
      },
    },
    {
      slug: "restaurant-labor-cost-scheduling",
      title: "Labor Scheduling Optimizer",
      description: "Optimize staff scheduling based on sales projections.",
      fields: [
        {
          name: "projectedDailySales",
          label: "Projected Daily Sales ($)",
          type: "number",
          defaultValue: "3000",
        },
        {
          name: "targetLaborPercent",
          label: "Target Labor Cost (%)",
          type: "number",
          defaultValue: "28",
        },
        {
          name: "avgHourlyWage",
          label: "Average Hourly Wage ($)",
          type: "number",
          defaultValue: "14",
        },
        {
          name: "managersOnDuty",
          label: "Managers On Duty",
          type: "number",
          defaultValue: "1",
        },
        {
          name: "managerHourlyRate",
          label: "Manager Hourly Rate ($)",
          type: "number",
          defaultValue: "22",
        },
        {
          name: "operatingHours",
          label: "Operating Hours Per Day",
          type: "number",
          defaultValue: "12",
        },
      ],
      calculate(inputs) {
        const dailySales = parseFloat(inputs.projectedDailySales as string);
        const targetPercent = parseFloat(inputs.targetLaborPercent as string) / 100;
        const avgWage = parseFloat(inputs.avgHourlyWage as string);
        const managers = parseFloat(inputs.managersOnDuty as string);
        const mgrRate = parseFloat(inputs.managerHourlyRate as string);
        const hours = parseFloat(inputs.operatingHours as string);

        const laborBudget = dailySales * targetPercent;
        const managerCost = managers * mgrRate * hours;
        const hourlyBudget = laborBudget - managerCost;
        const maxHourlyLabor = hourlyBudget / avgWage;
        const avgStaffPerHour = maxHourlyLabor / hours;
        const salesPerLaborHour = dailySales / (maxHourlyLabor + managers * hours);

        return {
          "Daily Labor Budget": `$${formatNumber(laborBudget)}`,
          "Manager Cost": `$${formatNumber(managerCost)}`,
          "Hourly Staff Budget": `$${formatNumber(hourlyBudget)}`,
          "Max Hourly Labor Hours": formatNumber(maxHourlyLabor),
          "Avg Staff Per Hour": formatNumber(avgStaffPerHour),
          "Sales Per Labor Hour": `$${formatNumber(salesPerLaborHour)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "restaurant-food-cost",
    "tip-credit-calculator",
    "small-business-tax",
  ],
  faq: [
    {
      question: "What is a good labor cost percentage for a restaurant?",
      answer:
        "Most restaurants target 25-35% labor cost. Quick service restaurants aim for 25-28%, casual dining 28-32%, and fine dining 30-35%. Combined with food cost, your prime cost (food + labor) should be under 65% of sales.",
    },
    {
      question: "How can I reduce restaurant labor costs?",
      answer:
        "Key strategies include cross-training staff, using sales forecasting for scheduling, reducing overtime, implementing prep schedules, investing in labor-saving equipment, and tracking labor cost in real-time with POS analytics.",
    },
  ],
  formula:
    "Total Labor = Hourly Wages + Salaried + Overtime Premium + Payroll Tax (7.65%) + Benefits. Labor % = Total Labor / Sales x 100. Prime Cost = Food Cost + Labor Cost.",
};
