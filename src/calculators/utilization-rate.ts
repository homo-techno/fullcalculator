import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const utilizationRateCalculator: CalculatorDefinition = {
  slug: "utilization-rate-calculator",
  title: "Employee Utilization Rate Calculator",
  description: "Free employee utilization rate calculator. Calculate billable utilization, capacity utilization, and revenue impact for professional services teams.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["utilization rate calculator", "employee utilization", "billable utilization", "capacity utilization", "workforce utilization"],
  variants: [
    {
      id: "individual",
      name: "Individual Utilization",
      description: "Calculate one employee's utilization rate",
      fields: [
        { name: "billableHours", label: "Billable Hours (period)", type: "number", placeholder: "e.g. 120", suffix: "hours" },
        { name: "totalAvailable", label: "Total Available Hours (period)", type: "number", placeholder: "e.g. 160", suffix: "hours", defaultValue: 160 },
        { name: "billRate", label: "Billing Rate (optional)", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "costRate", label: "Employee Cost Rate (optional)", type: "number", placeholder: "e.g. 75", prefix: "$" },
      ],
      calculate: (inputs) => {
        const billable = inputs.billableHours as number;
        const available = (inputs.totalAvailable as number) || 160;
        const billRate = inputs.billRate as number;
        const costRate = inputs.costRate as number;
        if (!billable) return null;

        const utilization = (billable / available) * 100;
        const nonBillable = available - billable;

        const details: { label: string; value: string }[] = [
          { label: "Billable hours", value: `${formatNumber(billable)}` },
          { label: "Non-billable hours", value: `${formatNumber(nonBillable)}` },
          { label: "Available hours", value: `${formatNumber(available)}` },
        ];

        if (billRate) {
          const revenue = billable * billRate;
          details.push({ label: "Revenue generated", value: `$${formatNumber(revenue)}` });
          if (costRate) {
            const cost = available * costRate;
            const margin = revenue - cost;
            const marginPct = (margin / revenue) * 100;
            details.push({ label: "Employee cost", value: `$${formatNumber(cost)}` });
            details.push({ label: "Gross margin", value: `$${formatNumber(margin)}` });
            details.push({ label: "Margin %", value: `${formatNumber(marginPct, 1)}%` });
          }
        }

        return {
          primary: { label: "Utilization Rate", value: formatNumber(utilization, 1), suffix: "%" },
          details,
        };
      },
    },
    {
      id: "team",
      name: "Team Utilization",
      description: "Calculate team-wide utilization metrics",
      fields: [
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 10" },
        { name: "totalBillableHours", label: "Total Team Billable Hours", type: "number", placeholder: "e.g. 1100", suffix: "hours" },
        { name: "hoursPerPerson", label: "Available Hours per Person", type: "number", placeholder: "e.g. 160", suffix: "hours", defaultValue: 160 },
        { name: "targetUtilization", label: "Target Utilization %", type: "number", placeholder: "e.g. 80", suffix: "%", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const team = inputs.teamSize as number;
        const totalBillable = inputs.totalBillableHours as number;
        const hpp = (inputs.hoursPerPerson as number) || 160;
        const target = (inputs.targetUtilization as number) || 80;
        if (!team || !totalBillable) return null;

        const totalAvailable = team * hpp;
        const utilization = (totalBillable / totalAvailable) * 100;
        const avgBillable = totalBillable / team;
        const gap = utilization - target;
        const targetHours = totalAvailable * (target / 100);
        const hoursGap = totalBillable - targetHours;

        return {
          primary: { label: "Team Utilization", value: formatNumber(utilization, 1), suffix: "%" },
          details: [
            { label: "Total billable hours", value: formatNumber(totalBillable) },
            { label: "Total available hours", value: formatNumber(totalAvailable) },
            { label: "Avg billable per person", value: formatNumber(avgBillable, 1) },
            { label: "Target utilization", value: `${formatNumber(target)}%` },
            { label: "vs. Target", value: `${gap >= 0 ? "+" : ""}${formatNumber(gap, 1)}%` },
            { label: "Hours above/below target", value: `${hoursGap >= 0 ? "+" : ""}${formatNumber(hoursGap, 0)} hrs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["billable-hours-calculator", "time-card-calculator", "roi-calculator"],
  faq: [
    { question: "What is a good utilization rate?", answer: "For professional services firms, target utilization rates are typically: 75-85% for consultants, 65-75% for managers (more admin/sales), and 50-60% for partners/directors. Rates above 85% risk burnout, while below 60% may indicate underutilization." },
    { question: "What is the difference between billable and capacity utilization?", answer: "Billable utilization measures time billed to clients vs total available time. Capacity utilization measures all productive work (billable + internal projects) vs available time. A person may have 70% billable utilization but 90% capacity utilization." },
  ],
  formula: "Utilization Rate = (Billable Hours / Available Hours) x 100 | Gross Margin = (Revenue - Cost) / Revenue x 100",
};
