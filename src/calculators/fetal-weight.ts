import type { CalculatorDefinition } from "./types";

export const fetalWeightCalculator: CalculatorDefinition = {
  slug: "fetal-weight-calculator",
  title: "Fetal Weight Estimator",
  description:
    "Free fetal weight estimator calculator. Estimate your baby's weight during pregnancy based on gestational age and ultrasound measurements.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "fetal weight",
    "baby weight in womb",
    "estimated fetal weight",
    "ultrasound weight",
    "fetal weight calculator",
  ],
  variants: [
    {
      id: "by-week",
      name: "By Gestational Week",
      description: "Estimate fetal weight based on current gestational week",
      fields: [
        {
          name: "gestWeeks",
          label: "Gestational Age (weeks)",
          type: "number",
          placeholder: "e.g. 30",
          min: 8,
          max: 42,
        },
      ],
      calculate: (inputs) => {
        const weeks = inputs.gestWeeks as number;
        if (!weeks) return null;

        // Average fetal weight by gestational week (grams)
        const weightByWeek: Record<number, number> = {
          8: 1, 9: 2, 10: 4, 11: 7, 12: 14, 13: 23, 14: 43, 15: 70,
          16: 100, 17: 140, 18: 190, 19: 240, 20: 300, 21: 360,
          22: 430, 23: 501, 24: 600, 25: 660, 26: 760, 27: 875,
          28: 1005, 29: 1153, 30: 1319, 31: 1502, 32: 1702, 33: 1918,
          34: 2146, 35: 2383, 36: 2622, 37: 2859, 38: 3083, 39: 3288,
          40: 3462, 41: 3597, 42: 3685,
        };

        const weightG = weightByWeek[weeks];
        if (weightG === undefined) return null;

        const weightLbs = weightG / 453.592;
        const weightOz = weightG / 28.3495;
        const weightKg = weightG / 1000;

        // Length estimate (cm, crown-heel from ~20 weeks)
        const lengthByWeek: Record<number, number> = {
          8: 1.6, 10: 3.1, 12: 5.4, 14: 8.7, 16: 11.6, 18: 14.2,
          20: 25.6, 22: 27.8, 24: 30, 26: 35.6, 28: 37.6, 30: 39.9,
          32: 42.4, 34: 45, 36: 47.4, 38: 49.8, 40: 51.2, 42: 52,
        };

        const lengthKeys = Object.keys(lengthByWeek).map(Number).sort((a, b) => a - b);
        let closestLength = lengthKeys[0];
        for (const k of lengthKeys) {
          if (Math.abs(k - weeks) < Math.abs(closestLength - weeks)) closestLength = k;
        }
        const lengthCm = lengthByWeek[closestLength];
        const lengthIn = lengthCm / 2.54;

        // Percentile ranges (10th and 90th approximate)
        const low10 = weightG * 0.8;
        const high90 = weightG * 1.2;

        let displayWeight: string;
        if (weightG < 1000) {
          displayWeight = `${weightG} g (${weightOz.toFixed(1)} oz)`;
        } else {
          displayWeight = `${weightG} g (${weightLbs.toFixed(2)} lbs / ${weightKg.toFixed(2)} kg)`;
        }

        return {
          primary: { label: "Estimated Fetal Weight", value: displayWeight },
          details: [
            { label: "Gestational age", value: `${weeks} weeks` },
            {
              label: "Normal range (10th-90th %ile)",
              value: `${Math.round(low10)} - ${Math.round(high90)} g`,
            },
            {
              label: "Estimated length",
              value: `${lengthCm.toFixed(1)} cm (${lengthIn.toFixed(1)} in)`,
            },
            {
              label: "Weekly weight gain",
              value:
                weeks >= 28
                  ? "~200-250 g/week in third trimester"
                  : weeks >= 20
                  ? "~100-150 g/week in second trimester"
                  : "Rapid proportional growth",
            },
            {
              label: "Average birth weight",
              value: "3,400 g (7.5 lbs) at 40 weeks",
            },
          ],
          note: "These are average values. Actual fetal weight varies. Ultrasound estimates have a margin of error of ±10-15%.",
        };
      },
    },
    {
      id: "hadlock",
      name: "By Ultrasound Measurements",
      description: "Estimate weight using biparietal diameter and abdominal circumference",
      fields: [
        {
          name: "bpdMm",
          label: "Biparietal Diameter - BPD (mm)",
          type: "number",
          placeholder: "e.g. 78",
          min: 20,
          max: 105,
        },
        {
          name: "acMm",
          label: "Abdominal Circumference - AC (mm)",
          type: "number",
          placeholder: "e.g. 280",
          min: 50,
          max: 400,
        },
      ],
      calculate: (inputs) => {
        const bpd = inputs.bpdMm as number;
        const ac = inputs.acMm as number;
        if (!bpd || !ac) return null;

        // Simplified Hadlock formula using BPD and AC
        // log10(EFW) = 1.1134 + 0.05845*AC(cm) - 0.000604*AC(cm)^2 - 0.007365*BPD(cm)^2 + 0.000595*BPD(cm)*AC(cm) + 0.1694*BPD(cm)
        const bpdCm = bpd / 10;
        const acCm = ac / 10;

        const logEfw =
          1.1134 +
          0.05845 * acCm -
          0.000604 * acCm * acCm -
          0.007365 * bpdCm * bpdCm +
          0.000595 * bpdCm * acCm +
          0.1694 * bpdCm;

        const efwG = Math.pow(10, logEfw);
        const efwLbs = efwG / 453.592;
        const efwKg = efwG / 1000;

        let displayWeight: string;
        if (efwG < 1000) {
          displayWeight = `${Math.round(efwG)} g (${(efwG / 28.3495).toFixed(1)} oz)`;
        } else {
          displayWeight = `${Math.round(efwG)} g (${efwLbs.toFixed(2)} lbs / ${efwKg.toFixed(2)} kg)`;
        }

        return {
          primary: { label: "Estimated Fetal Weight (Hadlock)", value: displayWeight },
          details: [
            { label: "BPD", value: `${bpd} mm (${bpdCm.toFixed(1)} cm)` },
            { label: "AC", value: `${ac} mm (${acCm.toFixed(1)} cm)` },
            { label: "Method", value: "Hadlock formula (BPD + AC)" },
            {
              label: "Margin of error",
              value: "±10-15% is typical for ultrasound estimates",
            },
          ],
          note: "Ultrasound weight estimates have inherent variability. Your doctor uses multiple measurements for the most accurate estimate.",
        };
      },
    },
  ],
  relatedSlugs: ["gestational-age-calculator", "pregnancy-due-date-calculator"],
  faq: [
    {
      question: "How accurate are fetal weight estimates?",
      answer:
        "Ultrasound fetal weight estimates have a margin of error of about ±10-15%. The accuracy depends on the gestational age, baby's position, and the measurements used. Multiple measurement formulas (like Hadlock) improve accuracy.",
    },
    {
      question: "What is a normal fetal weight?",
      answer:
        "Normal fetal weight varies by gestational age. At 20 weeks, average is about 300g (10.6 oz). At 30 weeks, about 1,300g (2.9 lbs). At 40 weeks (full term), average birth weight is about 3,400g (7.5 lbs). The normal range is quite wide.",
    },
  ],
  formula:
    "Hadlock formula: log10(EFW) = 1.1134 + 0.05845*AC - 0.000604*AC^2 - 0.007365*BPD^2 + 0.000595*BPD*AC + 0.1694*BPD (measurements in cm, weight in grams).",
};
