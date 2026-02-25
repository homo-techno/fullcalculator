import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const satToActCalculator: CalculatorDefinition = {
  slug: "sat-to-act-calculator",
  title: "SAT to ACT Score Converter",
  description:
    "Free SAT to ACT score converter. Convert between SAT and ACT scores using the official College Board concordance tables.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "sat to act converter",
    "act to sat converter",
    "score conversion calculator",
    "sat act concordance",
    "test score comparison",
  ],
  variants: [
    {
      id: "sat-to-act",
      name: "SAT to ACT",
      description: "Convert your SAT score (400-1600) to an equivalent ACT score (1-36)",
      fields: [
        { name: "satScore", label: "SAT Total Score (400-1600)", type: "number", placeholder: "e.g. 1200", min: 400, max: 1600, step: 10 },
      ],
      calculate: (inputs) => {
        const sat = inputs.satScore as number;
        if (!sat || sat < 400 || sat > 1600) return null;

        // Concordance table approximation (based on College Board data)
        let act: number;
        if (sat >= 1570) act = 36;
        else if (sat >= 1530) act = 35;
        else if (sat >= 1490) act = 34;
        else if (sat >= 1450) act = 33;
        else if (sat >= 1420) act = 32;
        else if (sat >= 1390) act = 31;
        else if (sat >= 1360) act = 30;
        else if (sat >= 1330) act = 29;
        else if (sat >= 1300) act = 28;
        else if (sat >= 1260) act = 27;
        else if (sat >= 1230) act = 26;
        else if (sat >= 1200) act = 25;
        else if (sat >= 1160) act = 24;
        else if (sat >= 1130) act = 23;
        else if (sat >= 1100) act = 22;
        else if (sat >= 1060) act = 21;
        else if (sat >= 1030) act = 20;
        else if (sat >= 990) act = 19;
        else if (sat >= 960) act = 18;
        else if (sat >= 920) act = 17;
        else if (sat >= 880) act = 16;
        else if (sat >= 830) act = 15;
        else if (sat >= 780) act = 14;
        else if (sat >= 730) act = 13;
        else if (sat >= 690) act = 12;
        else if (sat >= 650) act = 11;
        else act = 10;

        let percentile: string;
        if (act >= 34) percentile = "Top 1%";
        else if (act >= 30) percentile = "Top 5%";
        else if (act >= 27) percentile = "Top 15%";
        else if (act >= 24) percentile = "Top 30%";
        else if (act >= 21) percentile = "Top 50%";
        else percentile = "Below 50th percentile";

        return {
          primary: { label: "Equivalent ACT Score", value: formatNumber(act, 0) },
          details: [
            { label: "SAT score entered", value: formatNumber(sat, 0) },
            { label: "Approximate percentile", value: percentile },
            { label: "Score range", value: `ACT ${act - 1} to ${Math.min(36, act + 1)}` },
          ],
        };
      },
    },
    {
      id: "act-to-sat",
      name: "ACT to SAT",
      description: "Convert your ACT composite score (1-36) to an equivalent SAT score (400-1600)",
      fields: [
        { name: "actScore", label: "ACT Composite Score (1-36)", type: "number", placeholder: "e.g. 28", min: 1, max: 36 },
      ],
      calculate: (inputs) => {
        const act = inputs.actScore as number;
        if (!act || act < 1 || act > 36) return null;

        // Concordance table (reverse lookup)
        const actToSat: Record<number, number> = {
          36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430,
          31: 1400, 30: 1370, 29: 1340, 28: 1310, 27: 1280,
          26: 1240, 25: 1210, 24: 1180, 23: 1140, 22: 1110,
          21: 1080, 20: 1040, 19: 1010, 18: 970, 17: 930,
          16: 890, 15: 850, 14: 800, 13: 760, 12: 710,
          11: 670, 10: 630, 9: 590, 8: 560, 7: 530,
          6: 500, 5: 470, 4: 440, 3: 420, 2: 410, 1: 400,
        };

        const sat = actToSat[act] || 400;

        let percentile: string;
        if (act >= 34) percentile = "Top 1%";
        else if (act >= 30) percentile = "Top 5%";
        else if (act >= 27) percentile = "Top 15%";
        else if (act >= 24) percentile = "Top 30%";
        else if (act >= 21) percentile = "Top 50%";
        else percentile = "Below 50th percentile";

        return {
          primary: { label: "Equivalent SAT Score", value: formatNumber(sat, 0) },
          details: [
            { label: "ACT score entered", value: formatNumber(act, 0) },
            { label: "Approximate percentile", value: percentile },
            { label: "SAT score range", value: `${sat - 30} to ${sat + 30}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sat-score-calculator", "act-score-calculator"],
  faq: [
    {
      question: "Is the SAT or ACT easier?",
      answer:
        "Neither is inherently easier. The SAT emphasizes reasoning and data analysis, while the ACT is more straightforward and fast-paced. Take a practice test of each to see which suits your strengths.",
    },
    {
      question: "How accurate is the SAT to ACT conversion?",
      answer:
        "The College Board concordance tables are based on large student samples but are approximations. Individual scores may vary by 1-2 points on the ACT scale.",
    },
  ],
  formula: "Based on College Board / ACT concordance tables",
};
