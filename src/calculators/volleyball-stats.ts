import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const volleyballStatsCalculator: CalculatorDefinition = {
  slug: "volleyball-stats-calculator",
  title: "Volleyball Stats Calculator",
  description:
    "Free volleyball statistics calculator. Calculate hitting percentage, serve percentage, passing rating, and other key volleyball performance metrics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "volleyball stats calculator",
    "hitting percentage",
    "volleyball statistics",
    "serve percentage",
    "volleyball efficiency",
  ],
  variants: [
    {
      id: "hitting",
      name: "Hitting Percentage",
      description: "Calculate attack efficiency / hitting percentage",
      fields: [
        {
          name: "kills",
          label: "Kills",
          type: "number",
          placeholder: "e.g. 15",
          min: 0,
        },
        {
          name: "errors",
          label: "Hitting Errors",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "totalAttempts",
          label: "Total Attempts",
          type: "number",
          placeholder: "e.g. 40",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const kills = parseFloat(inputs.kills as string);
        const errors = parseFloat(inputs.errors as string);
        const total = parseFloat(inputs.totalAttempts as string);
        if (isNaN(kills) || isNaN(errors) || !total) return null;

        const hittingPct = (kills - errors) / total;
        const killPct = (kills / total) * 100;
        const errorPct = (errors / total) * 100;

        let rating = "Poor";
        if (hittingPct >= 0.4) rating = "Elite";
        else if (hittingPct >= 0.3) rating = "Excellent";
        else if (hittingPct >= 0.2) rating = "Good";
        else if (hittingPct >= 0.1) rating = "Average";

        return {
          primary: {
            label: "Hitting Percentage",
            value: formatNumber(hittingPct * 100, 1) + "%",
          },
          details: [
            { label: "Decimal", value: formatNumber(hittingPct, 3) },
            { label: "Kill %", value: formatNumber(killPct, 1) + "%" },
            { label: "Error %", value: formatNumber(errorPct, 1) + "%" },
            { label: "Rating", value: rating },
            { label: "Kills", value: formatNumber(kills, 0) },
            { label: "Errors", value: formatNumber(errors, 0) },
          ],
          note: "Hitting % = (Kills - Errors) / Total Attempts. NCAA D1 average is ~.200, elite is .350+.",
        };
      },
    },
    {
      id: "serving",
      name: "Serve Statistics",
      description: "Calculate serve percentage and ace rate",
      fields: [
        {
          name: "totalServes",
          label: "Total Serves",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
        },
        {
          name: "aces",
          label: "Aces",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
        },
        {
          name: "serviceErrors",
          label: "Service Errors",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const total = parseFloat(inputs.totalServes as string);
        const aces = parseFloat(inputs.aces as string);
        const errors = parseFloat(inputs.serviceErrors as string);
        if (!total || isNaN(aces) || isNaN(errors)) return null;

        const servePct = ((total - errors) / total) * 100;
        const acePct = (aces / total) * 100;
        const errorPct = (errors / total) * 100;
        const successfulServes = total - errors;

        return {
          primary: {
            label: "Serve Percentage",
            value: formatNumber(servePct, 1) + "%",
          },
          details: [
            { label: "Ace %", value: formatNumber(acePct, 1) + "%" },
            { label: "Error %", value: formatNumber(errorPct, 1) + "%" },
            { label: "Successful Serves", value: formatNumber(successfulServes, 0) },
            { label: "Aces", value: formatNumber(aces, 0) },
            { label: "Service Errors", value: formatNumber(errors, 0) },
          ],
          note: "Good serve percentage is 90%+. Ace rates of 8-12% are considered strong.",
        };
      },
    },
    {
      id: "passing",
      name: "Passing Rating",
      description: "Calculate pass rating on 0-3 scale",
      fields: [
        {
          name: "threes",
          label: "3-Point Passes (Perfect)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
        },
        {
          name: "twos",
          label: "2-Point Passes (Good)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "ones",
          label: "1-Point Passes (Playable)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "zeros",
          label: "0-Point Passes (Errors/Shanks)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const threes = parseFloat(inputs.threes as string) || 0;
        const twos = parseFloat(inputs.twos as string) || 0;
        const ones = parseFloat(inputs.ones as string) || 0;
        const zeros = parseFloat(inputs.zeros as string) || 0;
        const total = threes + twos + ones + zeros;
        if (total === 0) return null;

        const rating = (threes * 3 + twos * 2 + ones * 1 + zeros * 0) / total;
        const perfectPct = (threes / total) * 100;

        let level = "Needs Improvement";
        if (rating >= 2.5) level = "Elite";
        else if (rating >= 2.2) level = "Excellent";
        else if (rating >= 2.0) level = "Good";
        else if (rating >= 1.5) level = "Average";

        return {
          primary: {
            label: "Pass Rating",
            value: formatNumber(rating, 2),
          },
          details: [
            { label: "Total Passes", value: formatNumber(total, 0) },
            { label: "Perfect Pass %", value: formatNumber(perfectPct, 1) + "%" },
            { label: "Level", value: level },
            { label: "3-Point", value: formatNumber(threes, 0) },
            { label: "2-Point", value: formatNumber(twos, 0) },
            { label: "1-Point", value: formatNumber(ones, 0) },
            { label: "0-Point", value: formatNumber(zeros, 0) },
          ],
          note: "Pass rating is on a 0-3 scale. College average is ~2.0, elite is 2.4+.",
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "average-calculator", "grade-calculator"],
  faq: [
    {
      question: "What is a good hitting percentage in volleyball?",
      answer:
        "A hitting percentage of .200 is considered average at the college level. A percentage of .300+ is excellent, and .400+ is elite. The formula is (Kills - Errors) / Total Attempts.",
    },
    {
      question: "How is passing rating calculated in volleyball?",
      answer:
        "Passing rating uses a 0-3 scale: 3 = perfect pass to target, 2 = good pass (setter can set all options), 1 = playable pass (limited options), 0 = error/ace. The average of all passes gives the rating.",
    },
  ],
  formula:
    "Hitting % = (Kills - Errors) / Total Attempts | Serve % = (Total - Errors) / Total × 100",
};
