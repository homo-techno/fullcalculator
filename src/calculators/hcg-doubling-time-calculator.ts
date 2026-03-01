import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hcgDoublingTimeCalculator: CalculatorDefinition = {
  slug: "hcg-doubling-time-calculator",
  title: "hCG Doubling Time Calculator",
  description: "Calculate the doubling time of hCG levels between two blood draws to assess early pregnancy viability.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hcg doubling time", "hcg levels", "beta hcg calculator"],
  variants: [{
    id: "standard",
    name: "hCG Doubling Time",
    description: "Calculate the doubling time of hCG levels between two blood draws to assess early pregnancy viability",
    fields: [
      { name: "firstLevel", label: "First hCG Level", type: "number", suffix: "mIU/mL", min: 1, max: 200000, defaultValue: 120 },
      { name: "secondLevel", label: "Second hCG Level", type: "number", suffix: "mIU/mL", min: 1, max: 400000, defaultValue: 300 },
      { name: "hoursBetween", label: "Hours Between Tests", type: "number", suffix: "hours", min: 12, max: 240, defaultValue: 48 },
    ],
    calculate: (inputs) => {
      const first = inputs.firstLevel as number;
      const second = inputs.secondLevel as number;
      const hours = inputs.hoursBetween as number;
      if (!first || !second || !hours || first <= 0 || second <= 0) return null;
      const doublingTime = (hours * Math.log(2)) / Math.log(second / first);
      const percentIncrease = ((second - first) / first) * 100;
      const isNormal = doublingTime > 0 && doublingTime <= 72;
      return {
        primary: { label: "hCG Doubling Time", value: formatNumber(Math.round(doublingTime * 10) / 10) + " hours" },
        details: [
          { label: "Percent Increase", value: formatNumber(Math.round(percentIncrease * 10) / 10) + "%" },
          { label: "First Level", value: formatNumber(first) + " mIU/mL" },
          { label: "Assessment", value: isNormal ? "Within normal doubling range" : "Outside typical range - consult provider" },
        ],
      };
    },
  }],
  relatedSlugs: ["implantation-date-calculator", "reverse-due-date-calculator"],
  faq: [
    { question: "What is a normal hCG doubling time?", answer: "In early pregnancy, hCG levels typically double every 48 to 72 hours. Doubling times slower than 72 hours may warrant further evaluation but do not always indicate a problem." },
    { question: "When do hCG levels stop doubling?", answer: "hCG levels rise rapidly in the first 8 to 11 weeks of pregnancy, then plateau and gradually decline for the rest of the pregnancy. After about 6,000 mIU/mL, doubling slows naturally." },
  ],
  formula: "Doubling Time = (Hours Between Tests x ln(2)) / ln(Second Level / First Level)",
};
