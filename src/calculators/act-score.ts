import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const actScoreCalculator: CalculatorDefinition = {
  slug: "act-score-calculator",
  title: "ACT Score Calculator",
  description:
    "Free ACT score calculator. Calculate your ACT composite score, find your percentile, and convert to SAT equivalent.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "act score calculator",
    "act calculator",
    "act composite score",
    "act percentile",
    "act to sat conversion",
  ],
  variants: [
    {
      id: "composite",
      name: "ACT Composite Score",
      description: "Calculate your ACT composite from section scores (each 1-36)",
      fields: [
        { name: "english", label: "English (1-36)", type: "number", placeholder: "e.g. 28", min: 1, max: 36 },
        { name: "math", label: "Math (1-36)", type: "number", placeholder: "e.g. 30", min: 1, max: 36 },
        { name: "reading", label: "Reading (1-36)", type: "number", placeholder: "e.g. 29", min: 1, max: 36 },
        { name: "science", label: "Science (1-36)", type: "number", placeholder: "e.g. 27", min: 1, max: 36 },
      ],
      calculate: (inputs) => {
        const english = inputs.english as number;
        const math = inputs.math as number;
        const reading = inputs.reading as number;
        const science = inputs.science as number;
        if (!english || !math || !reading || !science) return null;

        const composite = Math.round((english + math + reading + science) / 4);
        const stem = Math.round((math + science) / 2);

        // Approximate percentile
        let percentile: number;
        if (composite >= 36) percentile = 99;
        else if (composite >= 35) percentile = 99;
        else if (composite >= 34) percentile = 99;
        else if (composite >= 33) percentile = 98;
        else if (composite >= 32) percentile = 97;
        else if (composite >= 31) percentile = 96;
        else if (composite >= 30) percentile = 94;
        else if (composite >= 29) percentile = 92;
        else if (composite >= 28) percentile = 89;
        else if (composite >= 27) percentile = 86;
        else if (composite >= 26) percentile = 82;
        else if (composite >= 25) percentile = 78;
        else if (composite >= 24) percentile = 73;
        else if (composite >= 23) percentile = 68;
        else if (composite >= 22) percentile = 62;
        else if (composite >= 21) percentile = 56;
        else if (composite >= 20) percentile = 50;
        else if (composite >= 19) percentile = 43;
        else if (composite >= 18) percentile = 37;
        else if (composite >= 17) percentile = 30;
        else if (composite >= 16) percentile = 24;
        else percentile = Math.max(1, composite * 1.5);

        // SAT equivalent (approximate)
        const satMap: Record<number, number> = {
          36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430,
          31: 1400, 30: 1370, 29: 1340, 28: 1300, 27: 1260,
          26: 1230, 25: 1190, 24: 1160, 23: 1130, 22: 1100,
          21: 1060, 20: 1020, 19: 980, 18: 940, 17: 900,
        };
        const satEquiv = satMap[composite] || (composite > 36 ? 1600 : composite < 17 ? 860 : 900);

        let competitiveness: string;
        if (composite >= 33) competitiveness = "Highly competitive (Ivy League range)";
        else if (composite >= 30) competitiveness = "Very competitive";
        else if (composite >= 27) competitiveness = "Competitive";
        else if (composite >= 24) competitiveness = "Above average";
        else if (composite >= 20) competitiveness = "Average";
        else competitiveness = "Below average";

        return {
          primary: { label: "ACT Composite Score", value: `${composite}` },
          details: [
            { label: "English", value: `${english}` },
            { label: "Math", value: `${math}` },
            { label: "Reading", value: `${reading}` },
            { label: "Science", value: `${science}` },
            { label: "STEM score", value: `${stem}` },
            { label: "Estimated percentile", value: `${Math.round(percentile)}th` },
            { label: "SAT equivalent (approx.)", value: formatNumber(satEquiv, 0) },
            { label: "Competitiveness", value: competitiveness },
          ],
        };
      },
    },
    {
      id: "superscore",
      name: "ACT Superscore",
      description: "Calculate your superscore from two test attempts (best section scores)",
      fields: [
        { name: "eng1", label: "Attempt 1 English", type: "number", placeholder: "e.g. 28", min: 1, max: 36 },
        { name: "math1", label: "Attempt 1 Math", type: "number", placeholder: "e.g. 26", min: 1, max: 36 },
        { name: "read1", label: "Attempt 1 Reading", type: "number", placeholder: "e.g. 30", min: 1, max: 36 },
        { name: "sci1", label: "Attempt 1 Science", type: "number", placeholder: "e.g. 27", min: 1, max: 36 },
        { name: "eng2", label: "Attempt 2 English", type: "number", placeholder: "e.g. 30", min: 1, max: 36 },
        { name: "math2", label: "Attempt 2 Math", type: "number", placeholder: "e.g. 29", min: 1, max: 36 },
        { name: "read2", label: "Attempt 2 Reading", type: "number", placeholder: "e.g. 28", min: 1, max: 36 },
        { name: "sci2", label: "Attempt 2 Science", type: "number", placeholder: "e.g. 30", min: 1, max: 36 },
      ],
      calculate: (inputs) => {
        const eng1 = inputs.eng1 as number;
        const math1 = inputs.math1 as number;
        const read1 = inputs.read1 as number;
        const sci1 = inputs.sci1 as number;
        const eng2 = inputs.eng2 as number;
        const math2 = inputs.math2 as number;
        const read2 = inputs.read2 as number;
        const sci2 = inputs.sci2 as number;

        if (!eng1 || !math1 || !read1 || !sci1 || !eng2 || !math2 || !read2 || !sci2) return null;

        const bestEng = Math.max(eng1, eng2);
        const bestMath = Math.max(math1, math2);
        const bestRead = Math.max(read1, read2);
        const bestSci = Math.max(sci1, sci2);
        const superscore = Math.round((bestEng + bestMath + bestRead + bestSci) / 4);
        const composite1 = Math.round((eng1 + math1 + read1 + sci1) / 4);
        const composite2 = Math.round((eng2 + math2 + read2 + sci2) / 4);

        return {
          primary: { label: "ACT Superscore", value: `${superscore}` },
          details: [
            { label: "Best English", value: `${bestEng}` },
            { label: "Best Math", value: `${bestMath}` },
            { label: "Best Reading", value: `${bestRead}` },
            { label: "Best Science", value: `${bestSci}` },
            { label: "Attempt 1 composite", value: `${composite1}` },
            { label: "Attempt 2 composite", value: `${composite2}` },
            { label: "Superscore improvement", value: `+${superscore - Math.max(composite1, composite2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sat-score-calculator", "gpa-calculator", "class-rank-calculator"],
  faq: [
    {
      question: "What is a good ACT score?",
      answer:
        "The average ACT score is about 20. A 24+ is above average, 27+ is competitive for selective schools, 30+ is very competitive, and 33+ puts you in range for highly selective universities.",
    },
    {
      question: "How is the ACT scored?",
      answer:
        "The ACT has four sections: English, Math, Reading, and Science, each scored 1-36. Your composite score is the average of all four sections, rounded to the nearest whole number.",
    },
    {
      question: "What is an ACT superscore?",
      answer:
        "A superscore takes the highest section scores from multiple ACT test dates and averages them. Many colleges accept superscores, which can boost your composite by 1-3 points on average.",
    },
  ],
  formula: "Composite = Round((English + Math + Reading + Science) / 4)",
};
