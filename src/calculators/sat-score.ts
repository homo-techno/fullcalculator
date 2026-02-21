import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const satScoreCalculator: CalculatorDefinition = {
  slug: "sat-score-calculator",
  title: "SAT Score Calculator",
  description:
    "Free SAT score calculator. Estimate your SAT composite score, convert between old and new SAT, and find your percentile ranking.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "sat score calculator",
    "sat calculator",
    "sat percentile",
    "sat composite score",
    "sat to act conversion",
  ],
  variants: [
    {
      id: "composite",
      name: "SAT Composite Score",
      description: "Calculate your total SAT score and estimated percentile (new SAT: 400-1600)",
      fields: [
        { name: "readingWriting", label: "Evidence-Based Reading & Writing (200-800)", type: "number", placeholder: "e.g. 650", min: 200, max: 800 },
        { name: "math", label: "Math (200-800)", type: "number", placeholder: "e.g. 700", min: 200, max: 800 },
      ],
      calculate: (inputs) => {
        const rw = inputs.readingWriting as number;
        const math = inputs.math as number;
        if (!rw || !math) return null;

        const composite = rw + math;

        // Approximate percentile based on 2024 SAT data
        let percentile: number;
        if (composite >= 1550) percentile = 99;
        else if (composite >= 1500) percentile = 98;
        else if (composite >= 1450) percentile = 96;
        else if (composite >= 1400) percentile = 94;
        else if (composite >= 1350) percentile = 91;
        else if (composite >= 1300) percentile = 87;
        else if (composite >= 1250) percentile = 82;
        else if (composite >= 1200) percentile = 76;
        else if (composite >= 1150) percentile = 69;
        else if (composite >= 1100) percentile = 61;
        else if (composite >= 1050) percentile = 53;
        else if (composite >= 1000) percentile = 45;
        else if (composite >= 950) percentile = 36;
        else if (composite >= 900) percentile = 28;
        else if (composite >= 850) percentile = 20;
        else if (composite >= 800) percentile = 14;
        else if (composite >= 750) percentile = 8;
        else if (composite >= 700) percentile = 4;
        else percentile = 1;

        // Approximate ACT equivalent
        let actEquiv: string;
        if (composite >= 1570) actEquiv = "36";
        else if (composite >= 1530) actEquiv = "35";
        else if (composite >= 1500) actEquiv = "34";
        else if (composite >= 1460) actEquiv = "33";
        else if (composite >= 1430) actEquiv = "32";
        else if (composite >= 1400) actEquiv = "31";
        else if (composite >= 1370) actEquiv = "30";
        else if (composite >= 1340) actEquiv = "29";
        else if (composite >= 1300) actEquiv = "28";
        else if (composite >= 1260) actEquiv = "27";
        else if (composite >= 1230) actEquiv = "26";
        else if (composite >= 1190) actEquiv = "25";
        else if (composite >= 1160) actEquiv = "24";
        else if (composite >= 1130) actEquiv = "23";
        else if (composite >= 1100) actEquiv = "22";
        else if (composite >= 1060) actEquiv = "21";
        else if (composite >= 1020) actEquiv = "20";
        else if (composite >= 980) actEquiv = "19";
        else if (composite >= 940) actEquiv = "18";
        else actEquiv = "17 or below";

        let competitiveness: string;
        if (composite >= 1400) competitiveness = "Highly competitive (Ivy League range)";
        else if (composite >= 1300) competitiveness = "Very competitive";
        else if (composite >= 1200) competitiveness = "Competitive";
        else if (composite >= 1100) competitiveness = "Above average";
        else if (composite >= 1000) competitiveness = "Average";
        else competitiveness = "Below average";

        return {
          primary: { label: "SAT Composite Score", value: formatNumber(composite, 0) },
          details: [
            { label: "Reading & Writing", value: formatNumber(rw, 0) },
            { label: "Math", value: formatNumber(math, 0) },
            { label: "Estimated percentile", value: `${percentile}th` },
            { label: "ACT equivalent (approx.)", value: actEquiv },
            { label: "Competitiveness", value: competitiveness },
          ],
        };
      },
    },
    {
      id: "percentNeeded",
      name: "Score Needed for Percentile",
      description: "Estimate the SAT score needed to reach a target percentile",
      fields: [
        {
          name: "targetPercentile",
          label: "Target Percentile",
          type: "select",
          options: [
            { label: "99th (Top 1%)", value: "99" },
            { label: "95th (Top 5%)", value: "95" },
            { label: "90th (Top 10%)", value: "90" },
            { label: "85th (Top 15%)", value: "85" },
            { label: "75th (Top 25%)", value: "75" },
            { label: "50th (Average)", value: "50" },
            { label: "25th", value: "25" },
          ],
        },
      ],
      calculate: (inputs) => {
        const target = parseInt(inputs.targetPercentile as string, 10);
        if (!target) return null;

        // Approximate score thresholds
        const scoreMap: Record<number, number> = {
          99: 1550, 95: 1430, 90: 1350, 85: 1280,
          75: 1200, 50: 1050, 25: 900,
        };

        const score = scoreMap[target] || 1050;
        const halfScore = Math.round(score / 2);

        return {
          primary: { label: "Estimated Score Needed", value: formatNumber(score, 0) },
          details: [
            { label: "Target percentile", value: `${target}th` },
            { label: "Approx. per-section score", value: `~${halfScore} each` },
            { label: "Score range", value: `${score - 30} to ${score + 30}` },
          ],
          note: "These are approximate thresholds based on recent SAT score distributions. Actual percentiles may vary by test date.",
        };
      },
    },
  ],
  relatedSlugs: ["act-score-calculator", "gpa-calculator", "class-rank-calculator"],
  faq: [
    {
      question: "What is a good SAT score?",
      answer:
        "The average SAT score is around 1050. A score of 1200+ is competitive for most colleges, 1300+ is very competitive, and 1400+ puts you in range for highly selective schools including Ivy League universities.",
    },
    {
      question: "How is the SAT scored?",
      answer:
        "The SAT has two sections: Evidence-Based Reading & Writing (200-800) and Math (200-800). Your composite score is the sum of both sections, ranging from 400 to 1600.",
    },
    {
      question: "How do I convert SAT to ACT?",
      answer:
        "A 1600 SAT equals a 36 ACT, 1400 equals about a 31 ACT, 1200 equals about a 25 ACT, and 1000 equals about a 20 ACT. College Board provides official concordance tables for precise conversions.",
    },
  ],
  formula: "Composite Score = Reading & Writing (200-800) + Math (200-800)",
};
