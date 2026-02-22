import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emailTimeCalculator: CalculatorDefinition = {
  slug: "email-time-calculator",
  title: "Email Time Calculator",
  description: "Free email time calculator. Calculate how much time and money your organization spends on email each day, week, and year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["email time calculator", "email cost calculator", "email productivity", "time spent on email", "email overhead calculator"],
  variants: [
    {
      id: "individual",
      name: "Individual Email Cost",
      description: "Calculate your personal email time and cost",
      fields: [
        { name: "emailsPerDay", label: "Emails Received per Day", type: "number", placeholder: "e.g. 80" },
        { name: "avgReadMin", label: "Avg Time to Read/Process", type: "number", placeholder: "e.g. 1.5", suffix: "min", step: 0.5, defaultValue: 1.5 },
        { name: "sentPerDay", label: "Emails Sent per Day", type: "number", placeholder: "e.g. 30" },
        { name: "avgWriteMin", label: "Avg Time to Write/Reply", type: "number", placeholder: "e.g. 3", suffix: "min", defaultValue: 3 },
        { name: "hourlyRate", label: "Hourly Rate / Cost", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const received = inputs.emailsPerDay as number;
        const readMin = (inputs.avgReadMin as number) || 1.5;
        const sent = (inputs.sentPerDay as number) || 0;
        const writeMin = (inputs.avgWriteMin as number) || 3;
        const rate = inputs.hourlyRate as number;
        if (!received) return null;

        const readTimeMin = received * readMin;
        const writeTimeMin = sent * writeMin;
        const dailyMin = readTimeMin + writeTimeMin;
        const dailyHours = dailyMin / 60;
        const weeklyHours = dailyHours * 5;
        const yearlyHours = dailyHours * 260;
        const pctOfDay = (dailyHours / 8) * 100;

        const details: { label: string; value: string }[] = [
          { label: "Reading time per day", value: `${formatNumber(readTimeMin, 0)} min` },
          { label: "Writing time per day", value: `${formatNumber(writeTimeMin, 0)} min` },
          { label: "Daily email hours", value: formatNumber(dailyHours, 1) },
          { label: "Weekly email hours", value: formatNumber(weeklyHours, 1) },
          { label: "Annual email hours", value: formatNumber(yearlyHours, 0) },
          { label: "% of 8-hour day", value: `${formatNumber(pctOfDay, 1)}%` },
        ];

        if (rate) {
          const dailyCost = dailyHours * rate;
          const annualCost = yearlyHours * rate;
          details.push({ label: "Daily email cost", value: `$${formatNumber(dailyCost)}` });
          details.push({ label: "Annual email cost", value: `$${formatNumber(annualCost)}` });
        }

        return {
          primary: { label: "Daily Email Time", value: `${formatNumber(dailyHours, 1)} hours` },
          details,
        };
      },
    },
    {
      id: "team",
      name: "Team Email Cost",
      description: "Calculate email cost for an entire team",
      fields: [
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 25" },
        { name: "avgEmailsPerPerson", label: "Avg Emails per Person per Day", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "avgMinPerEmail", label: "Avg Minutes per Email (overall)", type: "number", placeholder: "e.g. 2", suffix: "min", defaultValue: 2 },
        { name: "avgHourlyCost", label: "Avg Hourly Cost per Person", type: "number", placeholder: "e.g. 45", prefix: "$" },
      ],
      calculate: (inputs) => {
        const team = inputs.teamSize as number;
        const emails = (inputs.avgEmailsPerPerson as number) || 80;
        const minPer = (inputs.avgMinPerEmail as number) || 2;
        const rate = inputs.avgHourlyCost as number;
        if (!team || !rate) return null;

        const dailyMinPerPerson = emails * minPer;
        const dailyHrsPerPerson = dailyMinPerPerson / 60;
        const teamDailyHrs = dailyHrsPerPerson * team;
        const teamWeeklyHrs = teamDailyHrs * 5;
        const teamAnnualHrs = teamDailyHrs * 260;
        const annualCost = teamAnnualHrs * rate;

        return {
          primary: { label: "Annual Team Email Cost", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Daily team email hours", value: formatNumber(teamDailyHrs, 1) },
            { label: "Weekly team email hours", value: formatNumber(teamWeeklyHrs, 1) },
            { label: "Annual team email hours", value: formatNumber(teamAnnualHrs, 0) },
            { label: "Hours per person per day", value: formatNumber(dailyHrsPerPerson, 1) },
            { label: "Annual cost per person", value: `$${formatNumber(annualCost / team)}` },
            { label: "Monthly team cost", value: `$${formatNumber(annualCost / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["time-tracking-calculator", "billable-hours-calculator", "utilization-rate-calculator"],
  faq: [
    { question: "How much time does the average worker spend on email?", answer: "Studies show the average professional spends 2.5-3 hours per day on email, or about 28-30% of their workday. This amounts to over 650 hours per year. Managers and executives often spend even more." },
    { question: "How can I reduce email time?", answer: "Batch email processing (check 2-3 times per day), use templates for common responses, unsubscribe from unnecessary lists, use instant messaging for quick questions, and set clear email expectations with your team." },
  ],
  formula: "Daily Time = (Received x Read Time) + (Sent x Write Time) | Annual Cost = Daily Hours x 260 x Hourly Rate",
};
