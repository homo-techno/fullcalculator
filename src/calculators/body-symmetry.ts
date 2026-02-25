import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodySymmetryCalculator: CalculatorDefinition = {
  slug: "body-symmetry-calculator",
  title: "Body Symmetry Calculator",
  description: "Free body symmetry calculator based on the Grecian ideal proportions. Compare your measurements to classical aesthetic standards of physical symmetry.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body symmetry", "grecian ideal", "body proportions", "aesthetic proportions", "ideal measurements", "bodybuilding proportions"],
  variants: [
    {
      id: "grecian-ideal",
      name: "Grecian Ideal Proportions",
      description: "Calculate your ideal proportions based on wrist circumference (Steve Reeves method)",
      fields: [
        { name: "wrist", label: "Wrist Circumference", type: "number", placeholder: "e.g. 17.5", suffix: "cm" },
        { name: "chest", label: "Chest (actual)", type: "number", placeholder: "e.g. 105", suffix: "cm" },
        { name: "waist", label: "Waist (actual)", type: "number", placeholder: "e.g. 80", suffix: "cm" },
        { name: "hip", label: "Hip (actual)", type: "number", placeholder: "e.g. 98", suffix: "cm" },
        { name: "bicep", label: "Bicep (actual)", type: "number", placeholder: "e.g. 38", suffix: "cm" },
        { name: "thigh", label: "Thigh (actual)", type: "number", placeholder: "e.g. 60", suffix: "cm" },
        { name: "calf", label: "Calf (actual)", type: "number", placeholder: "e.g. 38", suffix: "cm" },
        { name: "neck", label: "Neck (actual)", type: "number", placeholder: "e.g. 40", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const wrist = inputs.wrist as number;
        const chest = inputs.chest as number;
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        const bicep = inputs.bicep as number;
        const thigh = inputs.thigh as number;
        const calf = inputs.calf as number;
        const neck = inputs.neck as number;
        if (!wrist) return null;
        const idealChest = wrist * 6.5;
        const idealWaist = wrist * 4.57;
        const idealHip = wrist * 5.57;
        const idealBicep = wrist * 2.28;
        const idealThigh = wrist * 3.43;
        const idealCalf = wrist * 2.28;
        const idealNeck = wrist * 2.28;
        const details: { label: string; value: string }[] = [];
        let totalScore = 0;
        let count = 0;
        const addComparison = (label: string, actual: number | undefined, ideal: number) => {
          if (actual) {
            const pct = (actual / ideal) * 100;
            totalScore += pct;
            count++;
            details.push({ label: `${label} (actual/ideal)`, value: `${formatNumber(actual, 1)} / ${formatNumber(ideal, 1)} cm (${formatNumber(pct, 1)}%)` });
          } else {
            details.push({ label: `${label} (ideal)`, value: `${formatNumber(ideal, 1)} cm` });
          }
        };
        addComparison("Chest", chest, idealChest);
        addComparison("Waist", waist, idealWaist);
        addComparison("Hip", hip, idealHip);
        addComparison("Bicep", bicep, idealBicep);
        addComparison("Thigh", thigh, idealThigh);
        addComparison("Calf", calf, idealCalf);
        addComparison("Neck", neck, idealNeck);
        const avgScore = count > 0 ? totalScore / count : 0;
        return {
          primary: { label: "Symmetry Score", value: count > 0 ? `${formatNumber(avgScore, 1)}%` : "Enter measurements" },
          details,
          note: "100% means you match the Grecian ideal based on your wrist size. These are classical aesthetic standards based on bone structure proportionality.",
        };
      },
    },
    {
      id: "golden-ratio",
      name: "Golden Ratio Check",
      description: "Check if your waist-to-shoulder ratio matches the golden ratio (1:1.618)",
      fields: [
        { name: "waist", label: "Waist Circumference", type: "number", placeholder: "e.g. 80", suffix: "cm" },
        { name: "shoulders", label: "Shoulder Circumference", type: "number", placeholder: "e.g. 120", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const shoulders = inputs.shoulders as number;
        if (!waist || !shoulders) return null;
        const ratio = shoulders / waist;
        const idealShoulders = waist * 1.618;
        const deviation = ((ratio - 1.618) / 1.618) * 100;
        let assessment: string;
        if (Math.abs(deviation) < 3) assessment = "Very close to the golden ratio!";
        else if (Math.abs(deviation) < 8) assessment = "Near the golden ratio";
        else if (deviation > 0) assessment = "Shoulders wider than golden ratio";
        else assessment = "Need wider shoulders or smaller waist for golden ratio";
        return {
          primary: { label: "Shoulder:Waist Ratio", value: `1:${formatNumber(ratio, 3)}` },
          details: [
            { label: "Golden Ratio Target", value: "1:1.618" },
            { label: "Ideal Shoulders (for your waist)", value: `${formatNumber(idealShoulders, 1)} cm` },
            { label: "Deviation", value: `${formatNumber(deviation, 1)}%` },
            { label: "Assessment", value: assessment },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator"],
  faq: [
    { question: "What is the Grecian ideal?", answer: "The Grecian ideal refers to classical Greek standards of physical proportions, later adapted by Steve Reeves. Ideal measurements are calculated as multiples of wrist circumference, representing bone structure-proportional muscular development." },
    { question: "What is the golden ratio for body proportions?", answer: "The golden ratio (1.618) applied to physique means your shoulder circumference should be about 1.618 times your waist. This ratio is considered universally attractive and is seen throughout nature and art." },
  ],
  formula: "Grecian: Chest = wrist x 6.5, Waist = wrist x 4.57, Bicep = wrist x 2.28 | Golden ratio: Shoulders/Waist = 1.618",
};
