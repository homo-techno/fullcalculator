import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marathonPredictorCalculator: CalculatorDefinition = {
  slug: "marathon-predictor-calculator",
  title: "Marathon Predictor Calculator",
  description:
    "Free marathon predictor calculator using the Riegel formula. Predict race times for any distance based on a known performance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["marathon predictor", "Riegel formula", "race predictor", "running time prediction"],
  variants: [
    {
      id: "riegel",
      name: "Riegel Formula Prediction",
      fields: [
        {
          name: "knownDistance",
          label: "Known Race Distance",
          type: "select",
          options: [
            { label: "5K", value: "5" },
            { label: "10K", value: "10" },
            { label: "Half Marathon", value: "21.0975" },
            { label: "Marathon", value: "42.195" },
          ],
        },
        {
          name: "knownHours",
          label: "Known Time \u2013 Hours",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "knownMinutes",
          label: "Known Time \u2013 Minutes",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "knownSeconds",
          label: "Known Time \u2013 Seconds",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "targetDistance",
          label: "Predict Distance",
          type: "select",
          options: [
            { label: "5K", value: "5" },
            { label: "10K", value: "10" },
            { label: "Half Marathon", value: "21.0975" },
            { label: "Marathon", value: "42.195" },
          ],
        },
      ],
      calculate: (inputs) => {
        const d1 = parseFloat(inputs.knownDistance as string);
        const d2 = parseFloat(inputs.targetDistance as string);
        const hours = (inputs.knownHours as number) || 0;
        const minutes = (inputs.knownMinutes as number) || 0;
        const seconds = (inputs.knownSeconds as number) || 0;
        if (!d1 || !d2) return null;

        const t1 = hours * 3600 + minutes * 60 + seconds;
        if (t1 === 0) return null;

        const t2 = t1 * Math.pow(d2 / d1, 1.06);

        const predH = Math.floor(t2 / 3600);
        const predM = Math.floor((t2 % 3600) / 60);
        const predS = t2 % 60;

        const distanceNames: Record<string, string> = {
          "5": "5K",
          "10": "10K",
          "21.0975": "Half Marathon",
          "42.195": "Marathon",
        };

        const pacePerKm = t2 / d2;
        const paceMin = Math.floor(pacePerKm / 60);
        const paceSec = pacePerKm % 60;

        return {
          primary: {
            label: `Predicted ${distanceNames[String(d2)] || d2 + "K"} Time`,
            value: predH > 0
              ? `${predH}:${predM < 10 ? "0" : ""}${predM}:${predS < 10 ? "0" : ""}${formatNumber(predS, 0)}`
              : `${predM}:${predS < 10 ? "0" : ""}${formatNumber(predS, 0)}`,
          },
          details: [
            {
              label: "Known Race",
              value: `${distanceNames[String(d1)] || d1 + "K"} in ${hours > 0 ? hours + "h " : ""}${minutes}m ${formatNumber(seconds, 0)}s`,
            },
            {
              label: "Predicted Pace",
              value: `${paceMin}:${paceSec < 10 ? "0" : ""}${formatNumber(paceSec, 0)} /km`,
            },
            { label: "Formula", value: "Riegel: T2 = T1 \u00D7 (D2/D1)^1.06" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["running-splits-calculator", "training-zone-calculator"],
  faq: [
    {
      question: "What is the Riegel formula?",
      answer:
        "The Riegel formula predicts race times using T2 = T1 \u00D7 (D2/D1)^1.06, where T1 is your known time, D1 is the known distance, and D2 is the target distance. The exponent 1.06 accounts for the natural slowing over longer distances.",
    },
    {
      question: "How accurate is the Riegel formula?",
      answer:
        "The Riegel formula is reasonably accurate for trained runners racing distances between 5K and marathon. It may be less accurate for untrained runners or for very short/long distances.",
    },
  ],
  formula: "T2 = T1 \u00D7 (D2 / D1)^1.06",
};
