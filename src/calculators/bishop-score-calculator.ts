import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bishopScoreCalculator: CalculatorDefinition = {
  slug: "bishop-score-calculator",
  title: "Bishop Score Calculator",
  description: "Calculate the Bishop score to assess cervical readiness for labor induction based on clinical exam findings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bishop score", "cervical readiness", "labor induction score"],
  variants: [{
    id: "standard",
    name: "Bishop Score",
    description: "Calculate the Bishop score to assess cervical readiness for labor induction based on clinical exam findings",
    fields: [
      { name: "dilation", label: "Cervical Dilation", type: "select", options: [{value:"0",label:"Closed (0 cm)"},{value:"1",label:"1-2 cm"},{value:"2",label:"3-4 cm"},{value:"3",label:"5+ cm"}], defaultValue: "0" },
      { name: "effacement", label: "Effacement", type: "select", options: [{value:"0",label:"0-30%"},{value:"1",label:"40-50%"},{value:"2",label:"60-70%"},{value:"3",label:"80%+"}], defaultValue: "0" },
      { name: "station", label: "Fetal Station", type: "select", options: [{value:"0",label:"-3"},{value:"1",label:"-2"},{value:"2",label:"-1 to 0"},{value:"3",label:"+1 or +2"}], defaultValue: "0" },
      { name: "consistency", label: "Cervical Consistency", type: "select", options: [{value:"0",label:"Firm"},{value:"1",label:"Medium"},{value:"2",label:"Soft"}], defaultValue: "0" },
    ],
    calculate: (inputs) => {
      const dilation = parseInt(inputs.dilation as string) || 0;
      const effacement = parseInt(inputs.effacement as string) || 0;
      const station = parseInt(inputs.station as string) || 0;
      const consistency = parseInt(inputs.consistency as string) || 0;
      const totalScore = dilation + effacement + station + consistency;
      const maxScore = 11;
      const favorable = totalScore >= 8;
      const assessment = totalScore >= 8 ? "Favorable - high likelihood of successful induction" : totalScore >= 5 ? "Moderately favorable - reasonable chance of successful induction" : "Unfavorable - cervical ripening may be needed";
      return {
        primary: { label: "Bishop Score", value: formatNumber(totalScore) + " / " + formatNumber(maxScore) },
        details: [
          { label: "Assessment", value: assessment },
          { label: "Dilation Score", value: formatNumber(dilation) },
          { label: "Effacement Score", value: formatNumber(effacement) },
        ],
      };
    },
  }],
  relatedSlugs: ["vbac-success-rate-calculator", "fertility-by-age-calculator"],
  faq: [
    { question: "What Bishop score is considered favorable for induction?", answer: "A Bishop score of 8 or higher is considered favorable and indicates a high probability of successful labor induction. Scores below 6 suggest that cervical ripening agents may be needed first." },
    { question: "What factors make up the Bishop score?", answer: "The Bishop score is based on five cervical characteristics: dilation, effacement, station, consistency, and position. Each is scored from 0 to 2 or 3, with a maximum total of 13." },
  ],
  formula: "Bishop Score = Dilation Score + Effacement Score + Station Score + Consistency Score + Position Score",
};
