import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capacitorChargeCalculator: CalculatorDefinition = {
  slug: "capacitor-charge-calculator",
  title: "Capacitor Charge Calculator",
  description: "Calculate RC circuit charge time to a target level.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rc charge time","capacitor charge calculator"],
  variants: [{
    id: "standard",
    name: "Capacitor Charge",
    description: "Calculate RC circuit charge time to a target level.",
    fields: [
      { name: "resistance", label: "Resistance (ohms)", type: "number", min: 1, max: 100000000, defaultValue: 10000 },
      { name: "capacitance", label: "Capacitance (uF)", type: "number", min: 0.001, max: 1000000, defaultValue: 100 },
      { name: "targetPercent", label: "Target Charge (%)", type: "number", min: 1, max: 99, defaultValue: 63 },
    ],
    calculate: (inputs) => {
      const r = inputs.resistance as number;
      const c = inputs.capacitance as number;
      const target = inputs.targetPercent as number;
      if (!r || !c || !target) return null;
      const tau = r * (c / 1000000);
      const time = -tau * Math.log(1 - target / 100);
      const timeConst5 = 5 * tau;
      return {
        primary: { label: "Charge Time", value: (time * 1000).toFixed(2) + " ms" },
        details: [
          { label: "Time Constant (tau)", value: (tau * 1000).toFixed(3) + " ms" },
          { label: "Full Charge (5 tau)", value: (timeConst5 * 1000).toFixed(2) + " ms" },
          { label: "Target", value: target + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a time constant?", answer: "Tau = R x C. It is the time to reach 63.2% charge." },
    { question: "How long to fully charge a capacitor?", answer: "About 5 time constants to reach 99.3% of full charge." },
  ],
  formula: "Time = -R x C x ln(1 - target%)",
};
