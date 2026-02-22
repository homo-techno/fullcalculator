import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resourceAllocationCalculator: CalculatorDefinition = {
  slug: "resource-allocation-calculator",
  title: "Resource Allocation Calculator",
  description: "Free resource allocation calculator. Determine optimal resource distribution across projects, calculate allocation percentages, and identify over- or under-allocation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["resource allocation calculator", "resource planning", "team allocation", "project staffing calculator", "resource distribution"],
  variants: [
    {
      id: "allocation",
      name: "Multi-Project Allocation",
      description: "Calculate allocation across multiple projects",
      fields: [
        { name: "totalHoursAvailable", label: "Total Available Hours per Week", type: "number", placeholder: "e.g. 40", suffix: "hours", defaultValue: 40 },
        { name: "project1Hours", label: "Project A Hours per Week", type: "number", placeholder: "e.g. 20", suffix: "hours" },
        { name: "project2Hours", label: "Project B Hours per Week", type: "number", placeholder: "e.g. 12", suffix: "hours" },
        { name: "project3Hours", label: "Project C Hours per Week", type: "number", placeholder: "e.g. 5", suffix: "hours", defaultValue: 0 },
        { name: "adminHours", label: "Admin / Overhead Hours", type: "number", placeholder: "e.g. 3", suffix: "hours", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const total = (inputs.totalHoursAvailable as number) || 40;
        const p1 = (inputs.project1Hours as number) || 0;
        const p2 = (inputs.project2Hours as number) || 0;
        const p3 = (inputs.project3Hours as number) || 0;
        const admin = (inputs.adminHours as number) || 0;
        if (!total) return null;

        const allocated = p1 + p2 + p3 + admin;
        const unallocated = total - allocated;
        const utilization = (allocated / total) * 100;

        let status = "Balanced";
        if (utilization > 100) status = "Over-allocated";
        else if (utilization < 70) status = "Under-allocated";

        const details = [
          { label: "Project A", value: `${formatNumber(p1)} hrs (${formatNumber((p1 / total) * 100, 1)}%)` },
          { label: "Project B", value: `${formatNumber(p2)} hrs (${formatNumber((p2 / total) * 100, 1)}%)` },
        ];
        if (p3 > 0) details.push({ label: "Project C", value: `${formatNumber(p3)} hrs (${formatNumber((p3 / total) * 100, 1)}%)` });
        if (admin > 0) details.push({ label: "Admin / Overhead", value: `${formatNumber(admin)} hrs (${formatNumber((admin / total) * 100, 1)}%)` });
        details.push({ label: "Total allocated", value: `${formatNumber(allocated)} hrs` });
        details.push({ label: "Unallocated", value: `${formatNumber(unallocated)} hrs` });
        details.push({ label: "Status", value: status });

        return {
          primary: { label: "Utilization", value: `${formatNumber(utilization, 1)}%` },
          details,
        };
      },
    },
    {
      id: "team",
      name: "Team Allocation for Project",
      description: "Calculate how many people a project needs",
      fields: [
        { name: "projectHours", label: "Project Total Hours Needed", type: "number", placeholder: "e.g. 500" },
        { name: "durationWeeks", label: "Project Duration", type: "number", placeholder: "e.g. 8", suffix: "weeks" },
        { name: "hoursPerWeek", label: "Hours per Person per Week", type: "number", placeholder: "e.g. 30", suffix: "hours", defaultValue: 30 },
        { name: "allocationPct", label: "Max Allocation per Person", type: "number", placeholder: "e.g. 80", suffix: "%", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const projectHrs = inputs.projectHours as number;
        const weeks = inputs.durationWeeks as number;
        const hpw = (inputs.hoursPerWeek as number) || 30;
        const allocPct = (inputs.allocationPct as number) || 80;
        if (!projectHrs || !weeks) return null;

        const effectiveHpw = hpw * (allocPct / 100);
        const totalPersonWeeks = projectHrs / effectiveHpw;
        const fteNeeded = totalPersonWeeks / weeks;
        const headcount = Math.ceil(fteNeeded);

        return {
          primary: { label: "People Needed", value: `${headcount}` },
          details: [
            { label: "FTE required", value: formatNumber(fteNeeded, 2) },
            { label: "Effective hours/person/week", value: formatNumber(effectiveHpw, 1) },
            { label: "Total person-weeks", value: formatNumber(totalPersonWeeks, 1) },
            { label: "Hours per person total", value: formatNumber(projectHrs / headcount, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capacity-planning-calculator", "project-timeline-calculator", "sprint-velocity-calculator"],
  faq: [
    { question: "What is resource allocation?", answer: "Resource allocation is the process of assigning available resources (people, time, budget) to projects and tasks. Effective allocation ensures no one is over-allocated (leading to burnout) or under-allocated (wasted capacity)." },
    { question: "What is over-allocation?", answer: "Over-allocation occurs when a person is assigned more work than they have capacity for (e.g., 120% of their available hours). This leads to missed deadlines, quality issues, and burnout. Sustainable allocation is typically 75-85%." },
  ],
  formula: "Utilization = Allocated Hours / Available Hours x 100 | FTE Needed = Total Project Hours / (Effective Hours per Week x Duration Weeks)",
};
