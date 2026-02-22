import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bishopScoreCalculator: CalculatorDefinition = {
  slug: "bishop-score",
  title: "Bishop Score Calculator",
  description: "Free Bishop score calculator. Assess cervical readiness for labor induction using dilation, effacement, station, consistency, and position.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bishop score", "bishop score calculator", "cervical assessment", "labor induction score", "cervical ripeness"],
  variants: [
    {
      id: "bishop-score",
      name: "Bishop Score Assessment",
      description: "Calculate Bishop score for cervical favorability",
      fields: [
        { name: "dilation", label: "Dilation (cm)", type: "select", options: [{ label: "Closed (0 cm)", value: "0" }, { label: "1-2 cm", value: "1" }, { label: "3-4 cm", value: "2" }, { label: "5+ cm", value: "3" }] },
        { name: "effacement", label: "Effacement (%)", type: "select", options: [{ label: "0-30%", value: "0" }, { label: "40-50%", value: "1" }, { label: "60-70%", value: "2" }, { label: "80+%", value: "3" }] },
        { name: "station", label: "Station", type: "select", options: [{ label: "-3", value: "0" }, { label: "-2", value: "1" }, { label: "-1 to 0", value: "2" }, { label: "+1 to +2", value: "3" }] },
        { name: "consistency", label: "Cervical Consistency", type: "select", options: [{ label: "Firm", value: "0" }, { label: "Medium", value: "1" }, { label: "Soft", value: "2" }] },
        { name: "position", label: "Cervical Position", type: "select", options: [{ label: "Posterior", value: "0" }, { label: "Mid-position", value: "1" }, { label: "Anterior", value: "2" }] },
      ],
      calculate: (inputs) => {
        const dl = parseInt(inputs.dilation as string);
        const ef = parseInt(inputs.effacement as string);
        const st = parseInt(inputs.station as string);
        const co = parseInt(inputs.consistency as string);
        const po = parseInt(inputs.position as string);
        if (isNaN(dl) || isNaN(ef) || isNaN(st) || isNaN(co) || isNaN(po)) return null;
        const score = dl + ef + st + co + po;
        let interp = "";
        let rec = "";
        if (score <= 3) { interp = "Unfavorable cervix"; rec = "Cervical ripening agent recommended before induction"; }
        else if (score <= 5) { interp = "Moderately unfavorable"; rec = "Consider cervical ripening; induction may be prolonged"; }
        else if (score <= 7) { interp = "Moderately favorable"; rec = "Induction likely to succeed"; }
        else { interp = "Favorable cervix"; rec = "High likelihood of successful vaginal delivery with induction"; }
        return {
          primary: { label: "Bishop Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 13" },
            { label: "Interpretation", value: interp },
            { label: "Recommendation", value: rec },
            { label: "Dilation Points", value: formatNumber(dl, 0) },
            { label: "Effacement Points", value: formatNumber(ef, 0) },
            { label: "Station Points", value: formatNumber(st, 0) },
            { label: "Consistency Points", value: formatNumber(co, 0) },
            { label: "Position Points", value: formatNumber(po, 0) },
          ],
          note: "A Bishop score >= 8 is favorable for induction. Scores <= 5 suggest the cervix is not ripe. Always combine with clinical judgment.",
        };
      },
    },
  ],
  relatedSlugs: ["pediatric-gcs", "apache-score", "parkland-formula"],
  faq: [
    { question: "What is the Bishop score?", answer: "The Bishop score assesses cervical favorability for labor induction, evaluating dilation, effacement, station, consistency, and position on a 0-13 scale." },
    { question: "What Bishop score is favorable?", answer: "A score of 8 or higher is considered favorable. Scores of 6 or less may require cervical ripening." },
    { question: "Who uses the Bishop score?", answer: "Obstetricians, midwives, and L&D nurses use it to plan labor induction timing and method." },
  ],
  formula: "Bishop Score = Dilation + Effacement + Station + Consistency + Position (0-13)",
};
