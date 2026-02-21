import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilityWindowCalculator: CalculatorDefinition = {
  slug: "fertility-window-calculator",
  title: "Fertility Window Calculator",
  description:
    "Free fertility window calculator. Identify your most fertile days based on cycle length and last menstrual period to maximize chances of conception.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "fertility window",
    "fertile days calculator",
    "best days to conceive",
    "fertility calculator",
    "when am I fertile",
  ],
  variants: [
    {
      id: "fertility-window",
      name: "Calculate Fertility Window",
      description: "Find your most fertile days this cycle",
      fields: [
        {
          name: "lastPeriodDay",
          label: "First Day of Last Period (day of month)",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 31,
        },
        {
          name: "cycleLength",
          label: "Average Cycle Length (days)",
          type: "number",
          placeholder: "e.g. 28",
          min: 21,
          max: 40,
          defaultValue: 28,
        },
        {
          name: "cycleRegularity",
          label: "Cycle Regularity",
          type: "select",
          options: [
            { label: "Very regular (±1 day)", value: "regular" },
            { label: "Somewhat regular (±3 days)", value: "somewhat" },
            { label: "Irregular (±5+ days)", value: "irregular" },
          ],
          defaultValue: "somewhat",
        },
      ],
      calculate: (inputs) => {
        const lastPeriodDay = inputs.lastPeriodDay as number;
        const cycleLength = (inputs.cycleLength as number) || 28;
        const regularity = inputs.cycleRegularity as string;
        if (!lastPeriodDay) return null;

        // Ovulation occurs ~14 days before the NEXT period
        const ovulationDay = cycleLength - 14;
        const fertileStart = ovulationDay - 5;
        const fertileEnd = ovulationDay + 1;
        const peakStart = ovulationDay - 2;
        const peakEnd = ovulationDay;

        // Adjust window for irregular cycles
        let windowNote: string;
        let adjustedStart = fertileStart;
        let adjustedEnd = fertileEnd;
        if (regularity === "regular") {
          windowNote = "Your regular cycle makes timing more predictable.";
        } else if (regularity === "somewhat") {
          adjustedStart = fertileStart - 2;
          adjustedEnd = fertileEnd + 2;
          windowNote = "Window widened by 2 days on each side to account for cycle variation.";
        } else {
          adjustedStart = fertileStart - 4;
          adjustedEnd = fertileEnd + 4;
          windowNote = "Window widened significantly. Consider using ovulation predictor kits (OPKs) for better accuracy.";
        }

        const nextPeriodDay = cycleLength;
        const implantationEarliest = ovulationDay + 6;
        const implantationLatest = ovulationDay + 12;
        const testDay = ovulationDay + 14;

        return {
          primary: {
            label: "Ovulation Day",
            value: `Cycle Day ${ovulationDay}`,
          },
          details: [
            { label: "Fertile Window", value: `Cycle Day ${adjustedStart} to Day ${adjustedEnd}` },
            { label: "Peak Fertility", value: `Cycle Day ${peakStart} to Day ${peakEnd} (3 days before & day of ovulation)` },
            { label: "Ovulation Day", value: `Cycle Day ${ovulationDay} (${cycleLength - 14} days after period start)` },
            { label: "Implantation Window", value: `Cycle Day ${implantationEarliest} to Day ${implantationLatest}` },
            { label: "Earliest Pregnancy Test", value: `Cycle Day ${testDay} (~${testDay - cycleLength} days after missed period expected)` },
            { label: "Next Period Expected", value: `Cycle Day ${nextPeriodDay}` },
            { label: "Note", value: windowNote },
          ],
          note: "Sperm can survive up to 5 days in the reproductive tract, while an egg lives only 12-24 hours after ovulation. The best conception chances are from 3 days before ovulation through ovulation day itself. For accuracy, combine cycle tracking with OPKs and/or basal body temperature.",
        };
      },
    },
  ],
  relatedSlugs: ["ovulation-calculator", "pregnancy-calculator", "conception-calculator"],
  faq: [
    {
      question: "What is the fertility window?",
      answer:
        "The fertility window is a roughly 6-day period each cycle when pregnancy is possible: the 5 days before ovulation and the day of ovulation itself. This is because sperm can survive up to 5 days, while the egg lives only 12-24 hours. Peak fertility is the 2-3 days before and including ovulation.",
    },
    {
      question: "How can I confirm when I'm ovulating?",
      answer:
        "Methods to detect ovulation include: ovulation predictor kits (OPKs) that detect LH surge 24-36 hours before ovulation, basal body temperature tracking (temp rises 0.4-0.8 degrees F after ovulation), cervical mucus changes (becomes clear and stretchy), and fertility monitors.",
    },
    {
      question: "What are the chances of getting pregnant during the fertile window?",
      answer:
        "When timing intercourse during the fertile window, the chances of conception per cycle are: 1 day before ovulation ~30%, 2 days before ~27%, ovulation day ~10-12%, 3 days before ~7-8%. Cumulative chance with well-timed intercourse throughout the window is about 25-30% per cycle for healthy couples under 35.",
    },
  ],
  formula:
    "Ovulation Day = Cycle Length - 14 | Fertile Window = Ovulation Day - 5 to Ovulation Day + 1 | Peak Fertility = Ovulation Day - 2 to Ovulation Day | Implantation = Ovulation + 6 to 12 days.",
};
