import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipCreditCalculator: CalculatorDefinition = {
  slug: "tip-credit-calculator",
  title: "Employer Tip Credit Calculator",
  description:
    "Calculate the employer tip credit amount and ensure tipped employees meet minimum wage requirements by state.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tip credit",
    "tipped employee",
    "minimum wage",
    "restaurant wage",
    "tip income",
    "employer tip credit",
  ],
  variants: [
    {
      slug: "tip-credit-calculator",
      title: "Tip Credit & Minimum Wage Compliance",
      description:
        "Calculate tip credits and verify tipped employees meet minimum wage.",
      fields: [
        {
          name: "stateMinWage",
          label: "State Minimum Wage ($/hr)",
          type: "number",
          defaultValue: "7.25",
        },
        {
          name: "tippedMinWage",
          label: "Tipped Minimum Wage ($/hr)",
          type: "number",
          defaultValue: "2.13",
        },
        {
          name: "hoursWorked",
          label: "Hours Worked Per Week",
          type: "number",
          defaultValue: "35",
        },
        {
          name: "weeklyTips",
          label: "Weekly Tips Earned ($)",
          type: "number",
          defaultValue: "400",
        },
        {
          name: "tipPoolPercent",
          label: "Tip Pool Contribution (%)",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "numberOfEmployees",
          label: "Number of Tipped Employees",
          type: "number",
          defaultValue: "8",
        },
      ],
      calculate(inputs) {
        const stateMin = parseFloat(inputs.stateMinWage as string);
        const tippedMin = parseFloat(inputs.tippedMinWage as string);
        const hours = parseFloat(inputs.hoursWorked as string);
        const weeklyTips = parseFloat(inputs.weeklyTips as string);
        const tipPoolPct = parseFloat(inputs.tipPoolPercent as string) / 100;
        const employees = parseFloat(inputs.numberOfEmployees as string);

        const maxTipCredit = stateMin - tippedMin;
        const tipPoolContribution = weeklyTips * tipPoolPct;
        const tipsRetained = weeklyTips - tipPoolContribution;
        const tipsPerHour = tipsRetained / hours;
        const directWages = tippedMin * hours;
        const totalHourlyEarning = tippedMin + tipsPerHour;
        const meetsMinWage = totalHourlyEarning >= stateMin;
        const makeUpPayPerHour = meetsMinWage ? 0 : stateMin - totalHourlyEarning;
        const makeUpPayWeekly = makeUpPayPerHour * hours;
        const actualTipCredit = Math.min(maxTipCredit, tipsPerHour);
        const employerCostPerHour = stateMin - actualTipCredit;
        const weeklyEmployerCost = employerCostPerHour * hours;
        const weeklySavings = (stateMin - tippedMin) * hours;
        const monthlySavingsAllEmployees = weeklySavings * employees * 4.33;

        return {
          "State Minimum Wage": `$${formatNumber(stateMin)}/hr`,
          "Max Tip Credit": `$${formatNumber(maxTipCredit)}/hr`,
          "Tips Retained (after pool)": `$${formatNumber(tipsRetained)}/wk`,
          "Tips Per Hour": `$${formatNumber(tipsPerHour)}/hr`,
          "Total Hourly Earnings": `$${formatNumber(totalHourlyEarning)}/hr`,
          "Meets Min Wage": meetsMinWage ? "Yes" : "No",
          "Make-Up Pay Required": `$${formatNumber(makeUpPayWeekly)}/wk`,
          "Actual Tip Credit Used": `$${formatNumber(actualTipCredit)}/hr`,
          "Employer Cost Per Hour": `$${formatNumber(employerCostPerHour)}`,
          "Weekly Employer Cost": `$${formatNumber(weeklyEmployerCost)}`,
          "Monthly Savings (All Staff)": `$${formatNumber(monthlySavingsAllEmployees)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "restaurant-labor-cost",
    "restaurant-food-cost",
    "small-business-tax",
  ],
  faq: [
    {
      question: "What is the tip credit?",
      answer:
        "The tip credit allows employers to pay tipped employees a lower direct wage (as low as $2.13/hr federally) and count tips toward the minimum wage requirement. The employer must ensure total earnings (wages + tips) meet or exceed the full minimum wage.",
    },
    {
      question: "Which states do not allow tip credits?",
      answer:
        "States that require full minimum wage for tipped employees (no tip credit) include Alaska, California, Minnesota, Montana, Nevada, Oregon, and Washington. These states require employers to pay the full state minimum wage before tips.",
    },
    {
      question: "What happens if tips do not meet minimum wage?",
      answer:
        "If an employee's direct wages plus tips do not equal or exceed the applicable minimum wage for all hours worked, the employer must make up the difference. This is calculated on a workweek basis, not per shift.",
    },
  ],
  formula:
    "Max Tip Credit = State Minimum Wage - Tipped Minimum Wage. Tips Per Hour = (Weekly Tips - Tip Pool) / Hours. Total Hourly = Tipped Wage + Tips/Hr. Make-Up Pay = max(0, Min Wage - Total Hourly) x Hours.",
};
