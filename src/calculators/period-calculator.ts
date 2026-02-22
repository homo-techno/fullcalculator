import type { CalculatorDefinition } from "./types";

export const periodCalculator: CalculatorDefinition = {
  slug: "period-calculator",
  title: "Period Calculator",
  description:
    "Free period calculator. Predict your next menstrual period, track cycle regularity, and estimate upcoming periods based on your cycle history.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "period calculator",
    "menstrual cycle calculator",
    "next period predictor",
    "period tracker",
    "menstruation calculator",
  ],
  variants: [
    {
      id: "next-period",
      name: "Next Period Predictor",
      description: "Predict when your next period will start",
      fields: [
        {
          name: "lastPeriodDay",
          label: "Day of Month Last Period Started",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 31,
        },
        {
          name: "lastPeriodMonth",
          label: "Month Last Period Started (1-12)",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 12,
        },
        {
          name: "cycleLength",
          label: "Average Cycle Length (days)",
          type: "number",
          placeholder: "e.g. 28",
          min: 21,
          max: 45,
          defaultValue: 28,
        },
        {
          name: "periodLength",
          label: "Average Period Length (days)",
          type: "number",
          placeholder: "e.g. 5",
          min: 2,
          max: 10,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const day = inputs.lastPeriodDay as number;
        const month = inputs.lastPeriodMonth as number;
        const cycleLength = (inputs.cycleLength as number) || 28;
        const periodLength = (inputs.periodLength as number) || 5;
        if (!day || !month) return null;

        const year = new Date().getFullYear();
        const lastPeriod = new Date(year, month - 1, day);
        const nextPeriod = new Date(lastPeriod.getTime() + cycleLength * 86400000);
        const ovulationDate = new Date(nextPeriod.getTime() - 14 * 86400000);
        const period2 = new Date(nextPeriod.getTime() + cycleLength * 86400000);
        const period3 = new Date(period2.getTime() + cycleLength * 86400000);

        const fmt = (d: Date) =>
          d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return {
          primary: {
            label: "Next Period Starts",
            value: fmt(nextPeriod),
          },
          details: [
            { label: "Next Period Ends (approx)", value: fmt(new Date(nextPeriod.getTime() + periodLength * 86400000)) },
            { label: "Ovulation Date (est.)", value: fmt(ovulationDate) },
            { label: "2nd Next Period", value: fmt(period2) },
            { label: "3rd Next Period", value: fmt(period3) },
            { label: "Cycle Length", value: `${cycleLength} days` },
            { label: "Period Duration", value: `${periodLength} days` },
          ],
          note: "Predictions assume a regular cycle. Stress, illness, weight changes, and other factors can cause variations. Track multiple cycles for better accuracy.",
        };
      },
    },
    {
      id: "cycle-regularity",
      name: "Cycle Regularity Check",
      description: "Assess how regular your menstrual cycles are",
      fields: [
        {
          name: "cycle1",
          label: "Cycle 1 Length (days)",
          type: "number",
          placeholder: "e.g. 28",
          min: 18,
          max: 50,
        },
        {
          name: "cycle2",
          label: "Cycle 2 Length (days)",
          type: "number",
          placeholder: "e.g. 30",
          min: 18,
          max: 50,
        },
        {
          name: "cycle3",
          label: "Cycle 3 Length (days)",
          type: "number",
          placeholder: "e.g. 27",
          min: 18,
          max: 50,
        },
        {
          name: "cycle4",
          label: "Cycle 4 Length (days)",
          type: "number",
          placeholder: "e.g. 29",
          min: 18,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const c1 = inputs.cycle1 as number;
        const c2 = inputs.cycle2 as number;
        const c3 = inputs.cycle3 as number;
        const c4 = inputs.cycle4 as number;
        if (!c1 || !c2 || !c3 || !c4) return null;

        const cycles = [c1, c2, c3, c4];
        const avg = cycles.reduce((a, b) => a + b, 0) / 4;
        const maxDiff = Math.max(...cycles) - Math.min(...cycles);
        const variance = cycles.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / 4;
        const stdDev = Math.sqrt(variance);

        let regularity: string;
        if (maxDiff <= 2) regularity = "Very Regular";
        else if (maxDiff <= 5) regularity = "Moderately Regular";
        else if (maxDiff <= 8) regularity = "Somewhat Irregular";
        else regularity = "Irregular";

        return {
          primary: {
            label: "Cycle Regularity",
            value: regularity,
          },
          details: [
            { label: "Average Cycle Length", value: `${avg.toFixed(1)} days` },
            { label: "Shortest Cycle", value: `${Math.min(...cycles)} days` },
            { label: "Longest Cycle", value: `${Math.max(...cycles)} days` },
            { label: "Range (variation)", value: `${maxDiff} days` },
            { label: "Standard Deviation", value: `${stdDev.toFixed(1)} days` },
          ],
          note: "A normal menstrual cycle ranges from 21-35 days. Variation of up to 7-9 days between cycles is considered within normal range. Consult a doctor if cycles are consistently shorter than 21 or longer than 35 days.",
        };
      },
    },
  ],
  relatedSlugs: ["ovulation-calculator", "fertility-window-calculator", "pregnancy-calculator"],
  faq: [
    {
      question: "How long is a normal menstrual cycle?",
      answer:
        "A normal menstrual cycle lasts between 21 and 35 days, with the average being about 28 days. The cycle is counted from the first day of one period to the first day of the next period. Periods typically last 3-7 days.",
    },
    {
      question: "What can cause an irregular period?",
      answer:
        "Common causes include stress, significant weight changes, excessive exercise, hormonal imbalances (PCOS, thyroid issues), perimenopause, starting or stopping birth control, pregnancy, breastfeeding, and certain medications.",
    },
    {
      question: "When should I see a doctor about my period?",
      answer:
        "See a doctor if your periods are consistently shorter than 21 days or longer than 35 days, if you bleed for more than 7 days, if you soak through a pad or tampon every hour, or if you experience severe pain that interferes with daily activities.",
    },
  ],
  formula:
    "Next Period = Last Period Start + Cycle Length | Ovulation ≈ Next Period - 14 days | Regularity = Max Cycle - Min Cycle variance",
};
