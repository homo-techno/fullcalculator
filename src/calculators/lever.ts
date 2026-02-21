import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leverCalculator: CalculatorDefinition = {
  slug: "lever-calculator",
  title: "Lever Calculator",
  description:
    "Free lever calculator. Calculate force or distance using the lever principle F1 × d1 = F2 × d2. Find the unknown force or distance from the fulcrum.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "lever calculator",
    "lever principle",
    "torque balance",
    "fulcrum calculator",
    "moment calculator",
    "simple machines",
  ],
  variants: [
    {
      id: "find-force",
      name: "Find Unknown Force",
      description: "F2 = F1 × d1 / d2",
      fields: [
        {
          name: "force1",
          label: "Known Force F1 (lbs)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "distance1",
          label: "Distance of F1 from Fulcrum (ft)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "distance2",
          label: "Distance of F2 from Fulcrum (ft)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const f1 = inputs.force1 as number;
        const d1 = inputs.distance1 as number;
        const d2 = inputs.distance2 as number;
        if (!f1 || !d1 || !d2) return null;

        const f2 = (f1 * d1) / d2;
        const ma = d1 / d2;
        const moment = f1 * d1;
        const f1N = f1 * 4.44822;
        const f2N = f2 * 4.44822;

        return {
          primary: {
            label: "Unknown Force (F2)",
            value: `${formatNumber(f2, 4)} lbs`,
          },
          details: [
            { label: "F2", value: `${formatNumber(f2, 4)} lbs (${formatNumber(f2N, 2)} N)` },
            { label: "F1", value: `${formatNumber(f1, 4)} lbs (${formatNumber(f1N, 2)} N)` },
            { label: "Mechanical Advantage", value: formatNumber(d2 / d1, 4) },
            { label: "Moment/Torque", value: `${formatNumber(moment, 4)} ft-lbs` },
            { label: "Total Lever Length", value: `${formatNumber(d1 + d2, 4)} ft` },
          ],
        };
      },
    },
    {
      id: "find-distance",
      name: "Find Unknown Distance",
      description: "d2 = F1 × d1 / F2",
      fields: [
        {
          name: "force1",
          label: "Force F1 (lbs)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "distance1",
          label: "Distance of F1 from Fulcrum (ft)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "force2",
          label: "Force F2 (lbs)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const f1 = inputs.force1 as number;
        const d1 = inputs.distance1 as number;
        const f2 = inputs.force2 as number;
        if (!f1 || !d1 || !f2) return null;

        const d2 = (f1 * d1) / f2;
        const moment = f1 * d1;

        return {
          primary: {
            label: "Required Distance (d2)",
            value: `${formatNumber(d2, 4)} ft`,
          },
          details: [
            { label: "d2 from Fulcrum", value: `${formatNumber(d2, 4)} ft` },
            { label: "d2 in Inches", value: `${formatNumber(d2 * 12, 2)} in` },
            { label: "Mechanical Advantage", value: formatNumber(d2 / d1, 4) },
            { label: "Moment/Torque", value: `${formatNumber(moment, 4)} ft-lbs` },
            { label: "Total Lever Length", value: `${formatNumber(d1 + d2, 4)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pulley-calculator", "inclined-plane-calculator", "torque-calculator"],
  faq: [
    {
      question: "What is the lever principle?",
      answer:
        "The lever principle states that F1 × d1 = F2 × d2, where F is force and d is distance from the fulcrum. When balanced, the moments (torques) on each side of the fulcrum are equal.",
    },
    {
      question: "How does a lever provide mechanical advantage?",
      answer:
        "By placing the fulcrum closer to the load and farther from the effort, a lever multiplies force. The mechanical advantage equals the effort arm length divided by the load arm length. A longer effort arm means less force is needed.",
    },
  ],
  formula: "F1 × d1 = F2 × d2 | MA = d_effort / d_load",
};
