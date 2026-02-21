import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meetingCostCalculator: CalculatorDefinition = {
  slug: "meeting-cost-calculator",
  title: "Meeting Cost Calculator",
  description: "Free meeting cost calculator. Calculate the true cost of meetings based on attendees, salaries, and duration. See the hidden cost of meetings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["meeting cost calculator", "cost of meetings", "meeting ROI", "meeting expense calculator", "meeting time cost"],
  variants: [
    {
      id: "single",
      name: "Single Meeting Cost",
      description: "Calculate the cost of a single meeting based on attendees and duration",
      fields: [
        { name: "attendees", label: "Number of Attendees", type: "number", placeholder: "e.g. 8", min: 1 },
        { name: "avgSalary", label: "Average Annual Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "durationMin", label: "Meeting Duration (minutes)", type: "number", placeholder: "e.g. 60", suffix: "min" },
        { name: "prepMin", label: "Prep Time per Person (minutes)", type: "number", placeholder: "e.g. 15", suffix: "min" },
      ],
      calculate: (inputs) => {
        const attendees = inputs.attendees as number;
        const avgSalary = inputs.avgSalary as number;
        const durationMin = inputs.durationMin as number;
        const prepMin = (inputs.prepMin as number) || 0;
        if (!attendees || !avgSalary || !durationMin) return null;
        const hourlyRate = avgSalary / 2080;
        const meetingHours = durationMin / 60;
        const prepHours = prepMin / 60;
        const totalPersonHours = attendees * (meetingHours + prepHours);
        const meetingCost = totalPersonHours * hourlyRate;
        const costPerMinute = meetingCost / durationMin;
        return {
          primary: { label: "Meeting Cost", value: `$${formatNumber(meetingCost)}` },
          details: [
            { label: "Cost per Minute", value: `$${formatNumber(costPerMinute)}` },
            { label: "Total Person-Hours", value: formatNumber(totalPersonHours, 1) },
            { label: "Avg Hourly Rate", value: `$${formatNumber(hourlyRate)}` },
            { label: "Meeting Time Cost", value: `$${formatNumber(attendees * meetingHours * hourlyRate)}` },
            { label: "Prep Time Cost", value: `$${formatNumber(attendees * prepHours * hourlyRate)}` },
          ],
        };
      },
    },
    {
      id: "recurring",
      name: "Recurring Meeting Cost",
      description: "Calculate the annual cost of a recurring meeting",
      fields: [
        { name: "attendees", label: "Number of Attendees", type: "number", placeholder: "e.g. 8", min: 1 },
        { name: "avgSalary", label: "Average Annual Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "durationMin", label: "Meeting Duration (minutes)", type: "number", placeholder: "e.g. 60", suffix: "min" },
        { name: "frequency", label: "Frequency", type: "select", options: [
          { label: "Daily", value: "260" },
          { label: "3x per Week", value: "156" },
          { label: "2x per Week", value: "104" },
          { label: "Weekly", value: "52" },
          { label: "Bi-Weekly", value: "26" },
          { label: "Monthly", value: "12" },
          { label: "Quarterly", value: "4" },
        ], defaultValue: "52" },
      ],
      calculate: (inputs) => {
        const attendees = inputs.attendees as number;
        const avgSalary = inputs.avgSalary as number;
        const durationMin = inputs.durationMin as number;
        const frequency = parseInt(inputs.frequency as string) || 52;
        if (!attendees || !avgSalary || !durationMin) return null;
        const hourlyRate = avgSalary / 2080;
        const meetingHours = durationMin / 60;
        const singleCost = attendees * meetingHours * hourlyRate;
        const annualCost = singleCost * frequency;
        const annualHours = attendees * meetingHours * frequency;
        return {
          primary: { label: "Annual Meeting Cost", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Cost per Meeting", value: `$${formatNumber(singleCost)}` },
            { label: "Meetings per Year", value: `${frequency}` },
            { label: "Total Person-Hours/Year", value: formatNumber(annualHours, 0) },
            { label: "FTE Equivalent", value: formatNumber(annualHours / 2080, 1) },
            { label: "Monthly Cost", value: `$${formatNumber(annualCost / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "employee-cost-calculator", "productivity-calculator"],
  faq: [
    { question: "How do you calculate meeting cost?", answer: "Meeting Cost = Number of Attendees × (Average Salary / 2080 hours) × Duration in Hours. For a 1-hour meeting with 8 people earning $75,000/year, the cost is 8 × $36.06 × 1 = $288.46." },
    { question: "What is the average cost of a meeting?", answer: "Harvard Business Review estimates the average meeting costs $338-$1,000+ depending on seniority. A weekly 1-hour meeting with 8 people can cost $15,000-$50,000+ per year." },
    { question: "How can I reduce meeting costs?", answer: "Reduce attendees (invite only essential people), shorten duration (try 25 or 50 min instead of 30/60), cancel recurring meetings that no longer add value, use async communication (email/Slack) when possible, and always have a clear agenda." },
  ],
  formula: "Meeting Cost = Attendees × (Annual Salary / 2080) × (Duration in Minutes / 60)",
};
