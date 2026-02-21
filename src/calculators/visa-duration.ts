import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visaDurationCalculator: CalculatorDefinition = {
  slug: "visa-duration-calculator",
  title: "Visa Duration Calculator",
  description:
    "Free visa duration calculator. Calculate remaining visa days, overstay risk, and plan multi-country trips within visa-free allowances.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "visa duration",
    "visa calculator",
    "visa free days",
    "tourist visa",
    "visa overstay",
    "schengen visa",
  ],
  variants: [
    {
      id: "remaining",
      name: "Visa Days Remaining",
      description: "Calculate how many visa days you have left",
      fields: [
        {
          name: "visaType",
          label: "Visa/Entry Type",
          type: "select",
          options: [
            { label: "30-day visa free", value: "30" },
            { label: "60-day visa free", value: "60" },
            { label: "90-day visa free", value: "90" },
            { label: "90/180 Schengen", value: "schengen" },
            { label: "180-day visa", value: "180" },
            { label: "Custom duration", value: "custom" },
          ],
          defaultValue: "90",
        },
        {
          name: "customDays",
          label: "Custom Visa Duration (days)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "daysUsed",
          label: "Days Already Spent",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const visaType = inputs.visaType as string;
        const customDays = inputs.customDays as number;
        const daysUsed = inputs.daysUsed as number;
        if (daysUsed === undefined || daysUsed === null) return null;

        let totalDays: number;
        if (visaType === "custom") {
          if (!customDays || customDays <= 0) return null;
          totalDays = customDays;
        } else if (visaType === "schengen") {
          totalDays = 90;
        } else {
          totalDays = parseInt(visaType);
        }

        const remaining = totalDays - daysUsed;
        const percentUsed = (daysUsed / totalDays) * 100;
        const weeksRemaining = remaining / 7;
        const isOverstay = remaining < 0;

        return {
          primary: {
            label: isOverstay ? "OVERSTAY" : "Days Remaining",
            value: isOverstay
              ? `${formatNumber(Math.abs(remaining), 0)} days over`
              : `${formatNumber(remaining, 0)} days left`,
          },
          details: [
            { label: "Visa duration", value: `${formatNumber(totalDays, 0)} days` },
            { label: "Days used", value: `${formatNumber(daysUsed, 0)} days` },
            { label: "Days remaining", value: `${formatNumber(Math.max(remaining, 0), 0)} days` },
            { label: "Weeks remaining", value: `${formatNumber(Math.max(weeksRemaining, 0), 1)} weeks` },
            { label: "Percent used", value: `${formatNumber(percentUsed, 1)}%` },
          ],
          note: isOverstay
            ? "WARNING: You have exceeded your visa duration. Overstaying can result in fines, deportation, and future entry bans."
            : remaining <= 7
            ? "Caution: You have 7 or fewer days remaining. Plan your departure soon."
            : `You have ${formatNumber(remaining, 0)} days remaining on your visa.`,
        };
      },
    },
    {
      id: "multiCountry",
      name: "Multi-Country Trip Planner",
      description: "Plan stays across multiple countries within visa limits",
      fields: [
        {
          name: "totalAllowance",
          label: "Total Visa Allowance (days)",
          type: "number",
          placeholder: "e.g. 90",
        },
        {
          name: "country1Days",
          label: "Country 1 Stay (days)",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "country2Days",
          label: "Country 2 Stay (days)",
          type: "number",
          placeholder: "e.g. 21",
        },
        {
          name: "country3Days",
          label: "Country 3 Stay (days)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "country4Days",
          label: "Country 4 Stay (days, optional)",
          type: "number",
          placeholder: "e.g. 7",
        },
      ],
      calculate: (inputs) => {
        const totalAllowance = inputs.totalAllowance as number;
        const c1 = (inputs.country1Days as number) || 0;
        const c2 = (inputs.country2Days as number) || 0;
        const c3 = (inputs.country3Days as number) || 0;
        const c4 = (inputs.country4Days as number) || 0;
        if (!totalAllowance || totalAllowance <= 0) return null;

        const totalPlanned = c1 + c2 + c3 + c4;
        const remaining = totalAllowance - totalPlanned;
        const travelDays = Math.ceil(totalPlanned * 0.1);
        const totalWithTravel = totalPlanned + travelDays;
        const remainingWithTravel = totalAllowance - totalWithTravel;

        return {
          primary: {
            label: "Total Planned Days",
            value: `${formatNumber(totalPlanned, 0)} of ${formatNumber(totalAllowance, 0)} days`,
          },
          details: [
            { label: "Country 1", value: `${formatNumber(c1, 0)} days` },
            { label: "Country 2", value: `${formatNumber(c2, 0)} days` },
            { label: "Country 3", value: `${formatNumber(c3, 0)} days` },
            { label: "Country 4", value: `${formatNumber(c4, 0)} days` },
            { label: "Total stay days", value: `${formatNumber(totalPlanned, 0)} days` },
            { label: "Est. travel days (~10%)", value: `${formatNumber(travelDays, 0)} days` },
            { label: "Total with travel", value: `${formatNumber(totalWithTravel, 0)} days` },
            { label: "Remaining allowance", value: `${formatNumber(remainingWithTravel, 0)} days` },
          ],
          note: remainingWithTravel >= 0
            ? `Your trip plan fits within your ${formatNumber(totalAllowance, 0)}-day allowance with ${formatNumber(remainingWithTravel, 0)} days to spare.`
            : `Your trip exceeds the allowance by ${formatNumber(Math.abs(remainingWithTravel), 0)} days. Reduce stays or check if countries have separate visa allowances.`,
        };
      },
    },
  ],
  relatedSlugs: ["passport-expiry-calculator", "travel-checklist-calculator"],
  faq: [
    {
      question: "What is the Schengen 90/180 rule?",
      answer:
        "The Schengen 90/180 rule allows visa-free travelers to stay a maximum of 90 days within any 180-day rolling period across all 27 Schengen Area countries combined. Days spent in any Schengen country count toward the same 90-day total.",
    },
    {
      question: "What happens if I overstay my visa?",
      answer:
        "Overstaying can result in fines (often $50-$500 per day), deportation, entry bans ranging from 1-10 years, and even criminal charges in some countries. Always ensure you depart before your authorized stay expires.",
    },
    {
      question: "Do transit days count toward visa duration?",
      answer:
        "Yes, in most cases every day you spend within the country counts, including arrival and departure days. Some countries count partial days as full days. International transit zones at airports are typically an exception.",
    },
  ],
  formula:
    "Days Remaining = Total Visa Duration - Days Used; Overstay = Days Used - Total Duration (if negative remaining).",
};
