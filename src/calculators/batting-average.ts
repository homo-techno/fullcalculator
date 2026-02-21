import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const battingAverageCalculator: CalculatorDefinition = {
  slug: "batting-average-calculator",
  title: "Batting Average Calculator",
  description:
    "Free batting average calculator. Calculate BA, on-base percentage (OBP), and other key batting statistics for baseball and softball.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "batting average",
    "baseball stats",
    "OBP",
    "on-base percentage",
    "hitting stats",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Batting Average",
      fields: [
        {
          name: "hits",
          label: "Hits (H)",
          type: "number",
          placeholder: "e.g. 45",
        },
        {
          name: "atBats",
          label: "At-Bats (AB)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "walks",
          label: "Walks / BB (optional)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "hbp",
          label: "Hit By Pitch (optional)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "sf",
          label: "Sacrifice Flies (optional)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const hits = inputs.hits as number;
        const atBats = inputs.atBats as number;
        const walks = (inputs.walks as number) || 0;
        const hbp = (inputs.hbp as number) || 0;
        const sf = (inputs.sf as number) || 0;

        if (!hits && hits !== 0) return null;
        if (!atBats || atBats <= 0) return null;

        const battingAvg = hits / atBats;

        // OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
        const obpNumerator = hits + walks + hbp;
        const obpDenominator = atBats + walks + hbp + sf;
        const obp = obpDenominator > 0 ? obpNumerator / obpDenominator : 0;

        // Format batting average to .XXX format
        const baFormatted = battingAvg.toFixed(3);
        const obpFormatted = obp.toFixed(3);

        return {
          primary: {
            label: "Batting Average",
            value: baFormatted,
          },
          details: [
            { label: "Hits", value: formatNumber(hits, 0) },
            { label: "At-Bats", value: formatNumber(atBats, 0) },
            { label: "Batting Average (BA)", value: baFormatted },
            {
              label: "On-Base Percentage (OBP)",
              value: obpFormatted,
            },
            { label: "Walks (BB)", value: formatNumber(walks, 0) },
            { label: "Hit By Pitch (HBP)", value: formatNumber(hbp, 0) },
            {
              label: "Sacrifice Flies (SF)",
              value: formatNumber(sf, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["era-calculator", "quarterback-rating-calculator"],
  faq: [
    {
      question: "How is batting average calculated?",
      answer:
        "Batting Average (BA) = Hits / At-Bats. It is expressed as a three-decimal number (e.g., .300 means 30% of at-bats result in hits).",
    },
    {
      question: "What is On-Base Percentage (OBP)?",
      answer:
        "OBP = (Hits + Walks + Hit By Pitch) / (At-Bats + Walks + Hit By Pitch + Sacrifice Flies). It measures how often a batter reaches base.",
    },
  ],
  formula:
    "BA = H / AB. OBP = (H + BB + HBP) / (AB + BB + HBP + SF).",
};
