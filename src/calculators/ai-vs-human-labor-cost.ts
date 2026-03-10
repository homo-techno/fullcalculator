import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiVsHumanLaborCost: CalculatorDefinition = {
  slug: "ai-vs-human-labor-cost",
  title: "AI vs Human Labor Cost Comparison",
  description:
    "Compare total cost of automating tasks with AI versus hiring human workers. Calculate ROI, payback period, and long-term savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "AI automation cost",
    "labor cost vs AI",
    "automation ROI",
    "AI implementation cost",
    "employee vs automation",
  ],
  variants: [
    {
      id: "compare",
      name: "AI vs Human Cost",
      description: "Compare automation to hiring human workers",
      fields: [
        {
          name: "tasksPerMonth",
          label: "Tasks to Complete Per Month",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "tasks",
        },
        {
          name: "humanHourPerTask",
          label: "Human Hours Per Task",
          type: "number",
          placeholder: "e.g. 0.5",
          suffix: "hours",
          step: 0.1,
        },
        {
          name: "hourlyRate",
          label: "Human Hourly Rate",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          suffix: "/hour",
        },
        {
          name: "aiCostPerTask",
          label: "AI Cost Per Task",
          type: "number",
          placeholder: "e.g. 0.05",
          prefix: "$",
          suffix: "/task",
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const tasksPerMonth = parseFloat(inputs.tasksPerMonth as string) || 1000;
        const humanHourPerTask = parseFloat(inputs.humanHourPerTask as string) || 0.5;
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 25;
        const aiCostPerTask = parseFloat(inputs.aiCostPerTask as string) || 0.05;

        // Human labor calculation
        const monthlyHours = tasksPerMonth * humanHourPerTask;
        const humanMonthlyCost = monthlyHours * hourlyRate;
        const humanYearlyCost = humanMonthlyCost * 12;

        // AI calculation
        const aiMonthlyCost = tasksPerMonth * aiCostPerTask;
        const aiYearlyCost = aiMonthlyCost * 12;

        // Including one-time AI setup/training costs
        const setupCost = 5000; // Typical AI implementation
        const breakEvenMonths = setupCost / (humanMonthlyCost - aiMonthlyCost);

        const yearlyMonthlySavings = humanMonthlyCost - aiMonthlyCost;
        const yearlyNetSavings = humanYearlyCost - (aiYearlyCost + (breakEvenMonths > 12 ? 0 : setupCost / 12));

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(yearlyMonthlySavings, 2)}` },
          details: [
            { label: "Tasks per month", value: formatNumber(tasksPerMonth) },
            { label: "Human monthly cost", value: `$${formatNumber(humanMonthlyCost, 2)}` },
            { label: "AI monthly cost", value: `$${formatNumber(aiMonthlyCost, 2)}` },
            { label: "Monthly savings", value: `$${formatNumber(yearlyMonthlySavings, 2)}` },
            { label: "AI setup cost (one-time)", value: `$${formatNumber(setupCost, 2)}` },
            { label: "Break-even period", value: `${formatNumber(Math.max(0, breakEvenMonths), 1)} months` },
            { label: "Year 1 net savings", value: `$${formatNumber(yearlyNetSavings, 2)}` },
            { label: "Year 5 total savings", value: `$${formatNumber((yearlyMonthlySavings * 12 * 5) - setupCost, 2)}` },
          ],
          note: "Human costs include fully-loaded salary (wages + benefits + taxes ~1.3-1.5x). AI costs exclude implementation labor.",
        };
      },
    },
    {
      id: "quality",
      name: "Quality vs Cost Trade-off",
      description: "Account for accuracy differences between AI and human work",
      fields: [
        {
          name: "tasksPerMonth",
          label: "Tasks Per Month",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "tasks",
        },
        {
          name: "humanAccuracy",
          label: "Human Accuracy",
          type: "number",
          placeholder: "e.g. 95",
          suffix: "%",
          min: 0,
          max: 100,
        },
        {
          name: "aiAccuracy",
          label: "AI Accuracy",
          type: "number",
          placeholder: "e.g. 87",
          suffix: "%",
          min: 0,
          max: 100,
        },
        {
          name: "costPerError",
          label: "Business Cost Per Error",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const tasksPerMonth = parseFloat(inputs.tasksPerMonth as string) || 1000;
        const humanAccuracy = parseFloat(inputs.humanAccuracy as string) || 95;
        const aiAccuracy = parseFloat(inputs.aiAccuracy as string) || 87;
        const costPerError = parseFloat(inputs.costPerError as string) || 50;

        const humanErrors = tasksPerMonth * (1 - humanAccuracy / 100);
        const aiErrors = tasksPerMonth * (1 - aiAccuracy / 100);

        const humanErrorCost = humanErrors * costPerError;
        const aiErrorCost = aiErrors * costPerError;

        const humanTotalCost = 2500 + humanErrorCost; // Assume $2500 base labor cost
        const aiTotalCost = 500 + aiErrorCost; // Assume $500 base AI cost

        const qualityAdjustedSavings = humanTotalCost - aiTotalCost;

        return {
          primary: { label: "Quality-Adjusted Savings", value: `$${formatNumber(qualityAdjustedSavings, 2)}/mo` },
          details: [
            { label: "Human accuracy", value: `${humanAccuracy}%` },
            { label: "AI accuracy", value: `${aiAccuracy}%` },
            { label: "Human errors/month", value: formatNumber(humanErrors, 0) },
            { label: "AI errors/month", value: formatNumber(aiErrors, 0) },
            { label: "Human error cost", value: `$${formatNumber(humanErrorCost, 2)}` },
            { label: "AI error cost", value: `$${formatNumber(aiErrorCost, 2)}` },
            { label: "Human total cost", value: `$${formatNumber(humanTotalCost, 2)}` },
            { label: "AI total cost", value: `$${formatNumber(aiTotalCost, 2)}` },
          ],
          note: "If AI accuracy is lower, errors add significant cost. Consider AI for high-volume, low-cost-of-error tasks.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-startup-compute-budget"],
  faq: [
    {
      question: "When is AI cheaper than hiring?",
      answer:
        "AI is cheaper for: high-volume tasks, 24/7 availability needed, tasks under $0.10-$0.50 per unit. Human workers are better for: complex reasoning, customer relationships, creative work, tasks requiring context.",
    },
    {
      question: "What if AI makes mistakes?",
      answer:
        "For low-cost errors: AI works well alone. For high-cost errors: use AI-assisted (human reviews AI output). Calculate break-even: if cost of AI errors > cost of human labor, hire humans or hybrid approach.",
    },
    {
      question: "How long to implement AI automation?",
      answer:
        "Simple API integration: 1-2 weeks. Fine-tuned model: 4-8 weeks. Complex workflow: 2-3 months. Factor implementation time into ROI calculations, especially for small cost-per-task savings.",
    },
  ],
  formula: "Monthly Savings = (Tasks × Human Rate) - (Tasks × AI Cost Per Task) - (Setup Cost / Months to Break-Even)",
};
