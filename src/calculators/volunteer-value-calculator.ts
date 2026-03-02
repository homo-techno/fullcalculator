import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const volunteerValueCalculator: CalculatorDefinition = {
  slug: "volunteer-value-calculator",
  title: "Volunteer Value Calculator",
  description: "Calculate the economic value of volunteer hours contributed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["volunteer","value","nonprofit","hours"],
  variants: [{
    id: "standard",
    name: "Volunteer Value",
    description: "Calculate the economic value of volunteer hours contributed.",
    fields: [
      { name: "volunteers", label: "Number of Volunteers", type: "number", min: 1, max: 5000, defaultValue: 20 },
      { name: "hoursPerWeek", label: "Hours Per Week Each", type: "number", min: 1, max: 40, defaultValue: 4 },
      { name: "weeks", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 48 },
      { name: "hourlyValue", label: "Value Per Hour ($)", type: "number", min: 10, max: 100, defaultValue: 31 },
    ],
    calculate: (inputs) => {
    const volunteers = inputs.volunteers as number;
    const hoursPerWeek = inputs.hoursPerWeek as number;
    const weeks = inputs.weeks as number;
    const hourlyValue = inputs.hourlyValue as number;
    const totalHours = volunteers * hoursPerWeek * weeks;
    const totalValue = totalHours * hourlyValue;
    const valuePerVolunteer = totalValue / volunteers;
    const fteEquivalent = totalHours / 2080;
    return { primary: { label: "Total Volunteer Value", value: "$" + formatNumber(totalValue) }, details: [{ label: "Total Hours", value: formatNumber(totalHours) + " hours" }, { label: "Value Per Volunteer", value: "$" + formatNumber(valuePerVolunteer) }, { label: "FTE Equivalent", value: formatNumber(fteEquivalent) + " employees" }] };
  },
  }],
  relatedSlugs: ["grant-match-calculator","donor-retention-calculator","nonprofit-overhead-rate-calculator"],
  faq: [
    { question: "What is the current value of a volunteer hour?", answer: "The Independent Sector estimates about $31.80 per hour nationally." },
    { question: "Why calculate volunteer value?", answer: "It helps demonstrate community support for grants and annual reports." },
    { question: "Can volunteer hours count as grant match?", answer: "Yes, many grants accept volunteer time as an in-kind contribution." },
  ],
  formula: "TotalValue = Volunteers * HoursPerWeek * Weeks * HourlyValue",
};
