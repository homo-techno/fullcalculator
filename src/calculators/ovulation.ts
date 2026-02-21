import type { CalculatorDefinition } from "./types";

export const ovulationCalculator: CalculatorDefinition = {
  slug: "ovulation-calculator",
  title: "Ovulation Calculator",
  description: "Free ovulation calculator. Estimate your fertile window and ovulation date based on your menstrual cycle to help plan or prevent pregnancy.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ovulation calculator", "fertility calculator", "fertile window calculator", "ovulation date", "when do I ovulate"],
  variants: [
    {
      id: "ovulation",
      name: "Ovulation & Fertile Window",
      fields: [
        { name: "cycleDay", label: "First Day of Last Period (day of month)", type: "number", placeholder: "e.g. 5", min: 1, max: 31 },
        { name: "cycleLength", label: "Average Cycle Length (days)", type: "number", placeholder: "e.g. 28", defaultValue: 28, min: 21, max: 40 },
      ],
      calculate: (inputs) => {
        const startDay = inputs.cycleDay as number;
        const cycleLen = (inputs.cycleLength as number) || 28;
        if (!startDay) return null;
        const ovulationDay = cycleLen - 14;
        const fertileStart = ovulationDay - 5;
        const fertileEnd = ovulationDay + 1;
        const nextPeriod = cycleLen;
        return {
          primary: { label: "Estimated Ovulation", value: `Day ${ovulationDay} of your cycle` },
          details: [
            { label: "Fertile window", value: `Day ${fertileStart} to Day ${fertileEnd}` },
            { label: "Most fertile days", value: `Day ${ovulationDay - 2} to Day ${ovulationDay}` },
            { label: "Next period expected", value: `Day ${nextPeriod} (~${nextPeriod - ovulationDay} days after ovulation)` },
            { label: "Cycle length", value: `${cycleLen} days` },
          ],
          note: "Ovulation timing varies between cycles. This estimate assumes a regular cycle with ovulation ~14 days before the next period. For accuracy, track basal body temperature or use ovulation test kits.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-due-date-calculator", "date-calculator", "age-calculator"],
  faq: [
    { question: "When do I ovulate?", answer: "Ovulation typically occurs about 14 days before your next period. For a 28-day cycle, that's around day 14. For a 32-day cycle, around day 18. The fertile window is about 5 days before ovulation and 1 day after." },
    { question: "How can I track ovulation?", answer: "Methods include: ovulation predictor kits (OPKs), basal body temperature tracking (temp rises 0.4-0.8°F after ovulation), cervical mucus monitoring, and fertility tracking apps." },
  ],
  formula: "Ovulation Day ≈ Cycle Length - 14 | Fertile Window = Ovulation Day - 5 to Ovulation Day + 1",
};
