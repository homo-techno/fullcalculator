import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const qtcCalculator: CalculatorDefinition = {
  slug: "qtc-calculator",
  title: "QTc Interval Calculator",
  description:
    "Free online QTc interval calculator using Bazett, Fridericia, Framingham, and Hodges correction formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "QTc",
    "QT interval",
    "Bazett",
    "Fridericia",
    "ECG",
    "EKG",
    "long QT",
    "arrhythmia",
    "cardiology",
    "corrected QT",
  ],
  variants: [
    {
      id: "qtc-calc",
      name: "QTc Calculation",
      description:
        "Calculate corrected QT interval using multiple formulas from QT interval and heart rate.",
      fields: [
        {
          name: "qtInterval",
          label: "QT Interval",
          type: "number",
          placeholder: "e.g. 400",
          suffix: "ms",
        },
        {
          name: "heartRate",
          label: "Heart Rate",
          type: "number",
          placeholder: "e.g. 75",
          suffix: "bpm",
        },
        {
          name: "sex",
          label: "Sex (for interpretation)",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
      calculate: (inputs) => {
        const qt = parseFloat(inputs.qtInterval as string) || 0;
        const hr = parseFloat(inputs.heartRate as string) || 0;
        const sex = inputs.sex as string;

        if (qt <= 0 || hr <= 0) return null;

        // RR interval in seconds
        const rr = 60 / hr;

        // Bazett: QTc = QT / √(RR)
        const qtcBazett = qt / Math.sqrt(rr);

        // Fridericia: QTc = QT / ∛(RR)
        const qtcFridericia = qt / Math.cbrt(rr);

        // Framingham: QTc = QT + 154(1 - RR)
        const qtcFramingham = qt + 154 * (1 - rr);

        // Hodges: QTc = QT + 1.75(HR - 60)
        const qtcHodges = qt + 1.75 * (hr - 60);

        // Interpretation thresholds
        const prolongedThreshold = sex === "male" ? 450 : 470;
        const borderlineThreshold = sex === "male" ? 430 : 450;

        const interpret = (qtc: number): string => {
          if (qtc < borderlineThreshold) return "Normal";
          if (qtc < prolongedThreshold) return "Borderline";
          if (qtc < 500) return "Prolonged";
          return "Markedly prolonged (high risk of TdP)";
        };

        const bazettInterpretation = interpret(qtcBazett);

        let riskAssessment: string;
        if (qtcBazett >= 500) {
          riskAssessment = "High risk of Torsades de Pointes (TdP) and sudden cardiac death";
        } else if (qtcBazett >= prolongedThreshold) {
          riskAssessment = "Increased risk of arrhythmia; review QT-prolonging medications";
        } else if (qtcBazett >= borderlineThreshold) {
          riskAssessment = "Borderline; monitor and avoid additional QT-prolonging factors";
        } else {
          riskAssessment = "Normal QTc; low arrhythmia risk from QT prolongation";
        }

        return {
          primary: {
            label: "QTc (Bazett)",
            value: formatNumber(qtcBazett),
            suffix: "ms",
          },
          details: [
            { label: "Bazett Interpretation", value: bazettInterpretation },
            { label: "QTc Fridericia", value: formatNumber(qtcFridericia) + " ms" },
            { label: "QTc Framingham", value: formatNumber(qtcFramingham) + " ms" },
            { label: "QTc Hodges", value: formatNumber(qtcHodges) + " ms" },
            { label: "RR Interval", value: formatNumber(rr * 1000) + " ms" },
            { label: "Risk Assessment", value: riskAssessment },
            {
              label: "Prolonged Threshold",
              value: formatNumber(prolongedThreshold) + " ms (" + sex + ")",
            },
            { label: "Measured QT", value: formatNumber(qt) + " ms" },
            { label: "Heart Rate", value: formatNumber(hr) + " bpm" },
          ],
          note: "Bazett formula overestimates QTc at high heart rates and underestimates at low heart rates. Fridericia is more accurate at extreme heart rates. QTc > 500 ms is associated with significantly increased risk of Torsades de Pointes.",
        };
      },
    },
  ],
  relatedSlugs: ["map-blood-pressure", "cardiac-output", "drug-half-life"],
  faq: [
    {
      question: "What is QTc?",
      answer:
        "QTc is the heart rate-corrected QT interval on an electrocardiogram (ECG). The QT interval represents the time for ventricular depolarization and repolarization. Since the QT interval shortens with increasing heart rate, correction formulas normalize it to a rate of 60 bpm for proper comparison.",
    },
    {
      question: "Which QTc formula should I use?",
      answer:
        "Bazett is the most commonly used and widely recognized formula, but it overestimates QTc at higher heart rates. Fridericia is considered more accurate across a wider range of heart rates and is preferred by the FDA for drug safety studies. Framingham and Hodges are linear corrections that avoid the over-correction issue.",
    },
    {
      question: "What causes prolonged QT?",
      answer:
        "Prolonged QT can be congenital (Long QT Syndrome types 1-17) or acquired. Common acquired causes include medications (antiarrhythmics, antibiotics like azithromycin/fluoroquinolones, antipsychotics, methadone), electrolyte abnormalities (hypokalemia, hypomagnesemia, hypocalcemia), bradycardia, and structural heart disease.",
    },
    {
      question: "What is Torsades de Pointes?",
      answer:
        "Torsades de Pointes (TdP) is a life-threatening polymorphic ventricular tachycardia associated with prolonged QT intervals. It can degenerate into ventricular fibrillation and cause sudden cardiac death. Treatment includes IV magnesium, overdrive pacing, and stopping offending medications.",
    },
  ],
  formula:
    "Bazett: QTc = QT / √(RR). Fridericia: QTc = QT / ∛(RR). Framingham: QTc = QT + 154(1 - RR). Hodges: QTc = QT + 1.75(HR - 60). RR = 60 / HR (seconds). Normal QTc: < 430 ms (male), < 450 ms (female). Prolonged: > 450 ms (male), > 470 ms (female).",
};
