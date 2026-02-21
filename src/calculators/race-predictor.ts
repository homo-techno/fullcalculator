import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const racePredictorCalculator: CalculatorDefinition = {
  slug: "race-predictor-calculator",
  title: "Race Predictor Calculator",
  description:
    "Free race time predictor. Predict your finish time for 5K, 10K, half marathon, and marathon using the Riegel and Cameron formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "race predictor",
    "race time predictor",
    "5K to marathon predictor",
    "running race calculator",
    "predict race time",
  ],
  variants: [
    {
      id: "predict",
      name: "Predict Race Times",
      description: "Enter a known race result to predict times for other distances",
      fields: [
        {
          name: "knownDistance",
          label: "Known Race Distance",
          type: "select",
          options: [
            { label: "1 Mile", value: "1.60934" },
            { label: "5K", value: "5" },
            { label: "10K", value: "10" },
            { label: "15K", value: "15" },
            { label: "Half Marathon", value: "21.0975" },
            { label: "Marathon", value: "42.195" },
          ],
          defaultValue: "5",
        },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 25", min: 0, max: 59 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const d1 = parseFloat(inputs.knownDistance as string);
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        if (!d1) return null;

        const t1 = hours * 3600 + minutes * 60 + seconds;
        if (t1 <= 0) return null;

        const distances = [
          { name: "5K", km: 5 },
          { name: "10K", km: 10 },
          { name: "Half Marathon", km: 21.0975 },
          { name: "Marathon", km: 42.195 },
        ];

        const formatTime = (totalSec: number) => {
          const h = Math.floor(totalSec / 3600);
          const m = Math.floor((totalSec % 3600) / 60);
          const s = Math.round(totalSec % 60);
          return h > 0
            ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
            : `${m}:${s.toString().padStart(2, "0")}`;
        };

        const predictions = distances.map((d) => {
          const riegelTime = t1 * Math.pow(d.km / d1, 1.06);
          return { label: `${d.name} (Riegel)`, value: formatTime(riegelTime) };
        });

        const vo2 = (-4.6 + 0.182258 * (d1 * 1000 / t1 * 60) +
          0.000104 * Math.pow(d1 * 1000 / t1 * 60, 2)) /
          (0.8 + 0.1894393 * Math.exp(-0.012778 * (t1 / 60)) +
          0.2989558 * Math.exp(-0.1932605 * (t1 / 60)));

        return {
          primary: {
            label: "Predicted Marathon Time",
            value: formatTime(t1 * Math.pow(42.195 / d1, 1.06)),
          },
          details: [
            ...predictions,
            { label: "Estimated VO2max", value: `${formatNumber(vo2 > 0 ? vo2 : 0, 1)} ml/kg/min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["marathon-predictor-calculator", "pace-calculator", "running-splits-calculator"],
  faq: [
    {
      question: "How does the race predictor work?",
      answer:
        "It uses the Riegel formula: T2 = T1 x (D2/D1)^1.06. This formula assumes that as race distance increases, your average pace slows by a predictable factor (the 1.06 exponent). It works best for trained runners.",
    },
    {
      question: "How accurate are race predictions?",
      answer:
        "For well-trained runners racing between 5K and marathon, predictions are typically within 2-5% of actual results. Less trained runners may see larger discrepancies, especially when predicting longer distances from short race times.",
    },
    {
      question: "Can I predict a 5K time from a marathon time?",
      answer:
        "Yes, the formula works in both directions. However, predicting shorter races from longer ones may be less accurate since shorter races depend more on speed than endurance.",
    },
  ],
  formula: "Riegel: T2 = T1 x (D2/D1)^1.06",
};
