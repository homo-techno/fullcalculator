import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const correctedQtCalculator: CalculatorDefinition = {
  slug: "corrected-qt",
  title: "Corrected QT Interval Calculator",
  description: "Free corrected QT interval calculator. Calculate QTc using Bazett, Fridericia, Framingham, and Hodges formulas from QT interval and heart rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["corrected qt", "qtc calculator", "bazett formula", "qt interval", "long qt", "electrocardiogram calculator"],
  variants: [
    {
      id: "qtc-bazett",
      name: "QTc (Bazett Formula)",
      fields: [
        { name: "qt", label: "QT Interval (ms)", type: "number", placeholder: "e.g. 400", min: 200, max: 700, step: 1 },
        { name: "heartRate", label: "Heart Rate (bpm)", type: "number", placeholder: "e.g. 72", min: 30, max: 250, step: 1 },
      ],
      calculate: (inputs) => {
        const qt = inputs.qt as number;
        const hr = inputs.heartRate as number;
        if (!qt || !hr) return null;
        const rr = 60 / hr;
        const qtcBazett = qt / Math.sqrt(rr);
        const qtcFridericia = qt / Math.pow(rr, 1 / 3);
        const qtcFramingham = qt + 0.154 * (1 - rr) * 1000;
        const qtcHodges = qt + 1.75 * (hr - 60);
        let interpretation = "";
        if (qtcBazett > 500) interpretation = "Markedly prolonged - high risk for torsades de pointes";
        else if (qtcBazett > 470) interpretation = "Prolonged (female threshold) - increased arrhythmia risk";
        else if (qtcBazett > 450) interpretation = "Borderline prolonged (male threshold)";
        else if (qtcBazett >= 350) interpretation = "Normal QTc";
        else interpretation = "Short QTc - may indicate short QT syndrome";
        return {
          primary: { label: "QTc (Bazett)", value: formatNumber(qtcBazett, 0) + " ms" },
          details: [
            { label: "QTc Bazett", value: formatNumber(qtcBazett, 0) + " ms" },
            { label: "QTc Fridericia", value: formatNumber(qtcFridericia, 0) + " ms" },
            { label: "QTc Framingham", value: formatNumber(qtcFramingham, 0) + " ms" },
            { label: "QTc Hodges", value: formatNumber(qtcHodges, 0) + " ms" },
            { label: "Interpretation", value: interpretation },
            { label: "RR Interval", value: formatNumber(rr, 3) + " sec" },
            { label: "Normal Male", value: "< 450 ms" },
            { label: "Normal Female", value: "< 470 ms" },
          ],
          note: "Bazett formula is most commonly used but less accurate at extreme heart rates. Fridericia may be more accurate at high/low heart rates. QTc > 500 ms carries significant arrhythmia risk.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-pressure", "framingham-score", "news-score"],
  faq: [
    { question: "What is the corrected QT interval?", answer: "QTc adjusts the QT interval for heart rate. The Bazett formula (QTc = QT / sqrt(RR)) is most widely used. Normal QTc is 350-450 ms in males and 350-470 ms in females." },
    { question: "What is a dangerous QTc?", answer: "QTc > 500 ms is associated with significantly increased risk of torsades de pointes and sudden cardiac death. QTc > 450 ms (male) or > 470 ms (female) is considered prolonged." },
    { question: "What causes prolonged QT?", answer: "Causes include medications (antiarrhythmics, antibiotics, antipsychotics), electrolyte imbalances (hypokalemia, hypomagnesemia), and congenital long QT syndrome." },
  ],
  formula: "QTc (Bazett) = QT / sqrt(RR) | QTc (Fridericia) = QT / RR^(1/3) | RR = 60 / HR",
};
