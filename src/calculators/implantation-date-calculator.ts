import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const implantationDateCalculator: CalculatorDefinition = {
  slug: "implantation-date-calculator",
  title: "Implantation Date Calculator",
  description: "Estimate the implantation window based on ovulation date or last menstrual period to predict when implantation likely occurred.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["implantation date", "implantation window", "when does implantation occur"],
  variants: [{
    id: "standard",
    name: "Implantation Date",
    description: "Estimate the implantation window based on ovulation date or last menstrual period to predict when implantation likely occurred",
    fields: [
      { name: "cycleDay", label: "Cycle Day of Ovulation", type: "number", suffix: "day", min: 8, max: 30, defaultValue: 14 },
      { name: "daysPostOvulation", label: "Days Post Ovulation (DPO)", type: "number", suffix: "days", min: 0, max: 20, defaultValue: 0 },
      { name: "cycleLength", label: "Average Cycle Length", type: "number", suffix: "days", min: 21, max: 40, defaultValue: 28 },
    ],
    calculate: (inputs) => {
      const ovDay = inputs.cycleDay as number;
      const dpo = inputs.daysPostOvulation as number;
      const cycleLen = inputs.cycleLength as number;
      if (!ovDay || !cycleLen) return null;
      const earlyImplant = 6;
      const lateImplant = 12;
      const avgImplant = 9;
      const earlyDPO = earlyImplant;
      const lateDPO = lateImplant;
      const avgDPO = avgImplant;
      const earlyTestDay = earlyImplant + 3;
      const reliableTestDay = lateImplant + 3;
      return {
        primary: { label: "Most Likely Implantation", value: formatNumber(avgDPO) + " DPO (days post ovulation)" },
        details: [
          { label: "Earliest Implantation", value: formatNumber(earlyDPO) + " DPO" },
          { label: "Latest Implantation", value: formatNumber(lateDPO) + " DPO" },
          { label: "Earliest Reliable Test Day", value: formatNumber(reliableTestDay) + " DPO" },
        ],
      };
    },
  }],
  relatedSlugs: ["hcg-doubling-time-calculator", "reverse-due-date-calculator"],
  faq: [
    { question: "When does implantation typically occur after ovulation?", answer: "Implantation most commonly occurs between 6 and 12 days post ovulation, with the majority happening around 8 to 10 days after ovulation." },
    { question: "What are common signs of implantation?", answer: "Some people experience light spotting, mild cramping, or breast tenderness around the time of implantation, though many have no noticeable symptoms at all." },
  ],
  formula: "Implantation Window = Ovulation Day + 6 to 12 days; Test Day = Implantation + 3 days",
};
