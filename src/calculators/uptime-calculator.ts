import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uptimeCalculator: CalculatorDefinition = {
  slug: "uptime-calculator",
  title: "Uptime/Availability Calculator (Nines)",
  description: "Free uptime calculator. Convert between availability percentages and allowed downtime. Understand the nines of availability (99.9%, 99.99%, etc.).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["uptime calculator", "availability calculator", "nines calculator", "downtime calculator", "SLA calculator"],
  variants: [
    {
      id: "nines",
      name: "Nines of Availability",
      description: "Calculate allowed downtime from availability percentage",
      fields: [
        { name: "availability", label: "Availability (%)", type: "select", options: [
          { label: "99% (Two Nines)", value: "99" },
          { label: "99.5%", value: "99.5" },
          { label: "99.9% (Three Nines)", value: "99.9" },
          { label: "99.95%", value: "99.95" },
          { label: "99.99% (Four Nines)", value: "99.99" },
          { label: "99.999% (Five Nines)", value: "99.999" },
          { label: "99.9999% (Six Nines)", value: "99.9999" },
        ], defaultValue: "99.9" },
      ],
      calculate: (inputs) => {
        const availability = parseFloat(inputs.availability as string) || 99.9;

        const downtimePercent = 100 - availability;
        const minutesPerYear = 365.25 * 24 * 60;
        const minutesPerMonth = 30 * 24 * 60;
        const minutesPerWeek = 7 * 24 * 60;
        const minutesPerDay = 24 * 60;

        const downtimePerYear = minutesPerYear * (downtimePercent / 100);
        const downtimePerMonth = minutesPerMonth * (downtimePercent / 100);
        const downtimePerWeek = minutesPerWeek * (downtimePercent / 100);
        const downtimePerDay = minutesPerDay * (downtimePercent / 100);

        const formatDuration = (minutes: number) => {
          if (minutes >= 1440) return `${formatNumber(minutes / 1440, 1)} days`;
          if (minutes >= 60) return `${formatNumber(minutes / 60, 1)} hours`;
          if (minutes >= 1) return `${formatNumber(minutes, 1)} minutes`;
          return `${formatNumber(minutes * 60, 1)} seconds`;
        };

        // Count nines
        const nines = availability.toString().replace(".", "").replace(/^9+/, (m) => m).length;

        return {
          primary: { label: "Downtime per Year", value: formatDuration(downtimePerYear) },
          details: [
            { label: "Availability", value: `${availability}%` },
            { label: "Downtime per Year", value: formatDuration(downtimePerYear) },
            { label: "Downtime per Month", value: formatDuration(downtimePerMonth) },
            { label: "Downtime per Week", value: formatDuration(downtimePerWeek) },
            { label: "Downtime per Day", value: formatDuration(downtimePerDay) },
            { label: "Uptime per Year", value: formatDuration(minutesPerYear - downtimePerYear) },
          ],
        };
      },
    },
    {
      id: "composite",
      name: "Composite Availability",
      description: "Calculate combined availability of dependent components",
      fields: [
        { name: "component1", label: "Component 1 Availability (%)", type: "number", placeholder: "e.g. 99.99", min: 0, max: 100, step: 0.001, defaultValue: 99.99 },
        { name: "component2", label: "Component 2 Availability (%)", type: "number", placeholder: "e.g. 99.95", min: 0, max: 100, step: 0.001, defaultValue: 99.95 },
        { name: "component3", label: "Component 3 Availability (%)", type: "number", placeholder: "e.g. 99.9", min: 0, max: 100, step: 0.001, defaultValue: 99.9 },
        { name: "topology", label: "Topology", type: "select", options: [
          { label: "Series (all required)", value: "series" },
          { label: "Parallel (any one sufficient)", value: "parallel" },
        ], defaultValue: "series" },
      ],
      calculate: (inputs) => {
        const c1 = (inputs.component1 as number) / 100;
        const c2 = (inputs.component2 as number) / 100;
        const c3 = (inputs.component3 as number) / 100;
        const topology = inputs.topology as string;
        if (!c1 || !c2 || !c3) return null;

        let composite = 0;
        if (topology === "series") {
          composite = c1 * c2 * c3;
        } else {
          // Parallel: 1 - (1-c1)(1-c2)(1-c3)
          composite = 1 - (1 - c1) * (1 - c2) * (1 - c3);
        }

        const compositePercent = composite * 100;
        const downtimeMinutesPerYear = 365.25 * 24 * 60 * (1 - composite);

        const formatDuration = (minutes: number) => {
          if (minutes >= 1440) return `${formatNumber(minutes / 1440, 1)} days`;
          if (minutes >= 60) return `${formatNumber(minutes / 60, 1)} hours`;
          if (minutes >= 1) return `${formatNumber(minutes, 1)} minutes`;
          return `${formatNumber(minutes * 60, 1)} seconds`;
        };

        return {
          primary: { label: "Composite Availability", value: `${formatNumber(compositePercent, 6)}%` },
          details: [
            { label: "Topology", value: topology === "series" ? "Series (all required)" : "Parallel (redundant)" },
            { label: "Component 1", value: `${formatNumber(c1 * 100, 4)}%` },
            { label: "Component 2", value: `${formatNumber(c2 * 100, 4)}%` },
            { label: "Component 3", value: `${formatNumber(c3 * 100, 4)}%` },
            { label: "Composite Availability", value: `${formatNumber(compositePercent, 6)}%` },
            { label: "Annual Downtime", value: formatDuration(downtimeMinutesPerYear) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["network-latency-calculator", "server-bandwidth-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "What do the 'nines' mean?", answer: "The nines refer to the number of 9s in the availability percentage. Two nines (99%) = 3.65 days downtime/year. Three nines (99.9%) = 8.76 hours. Four nines (99.99%) = 52.6 minutes. Five nines (99.999%) = 5.26 minutes. Each additional nine represents a 10x reduction in allowed downtime." },
    { question: "How is composite availability calculated?", answer: "For series (dependent) components: multiply all availabilities (A1 x A2 x A3). For parallel (redundant) components: 1 - product of unavailabilities: 1 - (1-A1)(1-A2)(1-A3). Two 99% components in series = 98.01%. Two 99% components in parallel = 99.99%." },
  ],
  formula: "Downtime/Year = 525,960 min x (1 - Availability/100) | Series = A1 x A2 x A3 | Parallel = 1 - (1-A1)(1-A2)(1-A3)",
};
