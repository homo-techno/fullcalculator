import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ankleCircumferenceCalculator: CalculatorDefinition = {
  slug: "ankle-circumference-calculator",
  title: "Ankle Circumference Calculator",
  description: "Free ankle circumference calculator. Assess body frame, muscular potential, and ideal calf-to-ankle proportions from ankle measurement.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ankle circumference", "ankle measurement", "calf ankle ratio", "lower body frame", "ankle size", "bone structure"],
  variants: [
    {
      id: "ankle-assessment",
      name: "Ankle Health & Frame Assessment",
      description: "Evaluate your lower body frame and proportions from ankle circumference",
      fields: [
        { name: "ankle", label: "Ankle Circumference (narrowest)", type: "number", placeholder: "e.g. 22", suffix: "cm" },
        { name: "calf", label: "Calf Circumference (widest)", type: "number", placeholder: "e.g. 38", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 175", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const ankle = inputs.ankle as number;
        const calf = inputs.calf as number;
        const height = inputs.height as number;
        const gender = inputs.gender as string;
        if (!ankle) return null;
        const ankleIn = ankle / 2.54;
        const isMale = gender === "male";
        let lowerFrame: string;
        if (isMale) {
          if (ankleIn < 8.5) lowerFrame = "Small lower-body frame";
          else if (ankleIn <= 9.5) lowerFrame = "Medium lower-body frame";
          else lowerFrame = "Large lower-body frame";
        } else {
          if (ankleIn < 7.5) lowerFrame = "Small lower-body frame";
          else if (ankleIn <= 8.5) lowerFrame = "Medium lower-body frame";
          else lowerFrame = "Large lower-body frame";
        }
        const details: { label: string; value: string }[] = [
          { label: "Lower Body Frame", value: lowerFrame },
          { label: "Ankle Circumference", value: `${formatNumber(ankle, 1)} cm (${formatNumber(ankleIn, 1)} in)` },
        ];
        if (calf) {
          const calfToAnkle = calf / ankle;
          const idealCalfMax = ankle * 1.9;
          let calfDev: string;
          if (calfToAnkle < 1.5) calfDev = "Calf underdeveloped relative to ankle";
          else if (calfToAnkle < 1.7) calfDev = "Below average calf development";
          else if (calfToAnkle < 1.9) calfDev = "Good calf development";
          else calfDev = "Excellent calf development";
          details.push(
            { label: "Calf-to-Ankle Ratio", value: formatNumber(calfToAnkle, 2) },
            { label: "Calf Development", value: calfDev },
            { label: "Max Natural Calf Size (est.)", value: `${formatNumber(idealCalfMax, 1)} cm` },
          );
        }
        if (height) {
          const ankleToHeight = (ankle / height) * 100;
          details.push({ label: "Ankle-to-Height %", value: `${formatNumber(ankleToHeight, 2)}%` });
        }
        return {
          primary: { label: "Lower Frame", value: lowerFrame },
          details,
        };
      },
    },
    {
      id: "ankle-ideal-proportions",
      name: "Ideal Lower Body Proportions",
      description: "Calculate ideal thigh and calf sizes based on ankle circumference",
      fields: [
        { name: "ankle", label: "Ankle Circumference", type: "number", placeholder: "e.g. 22", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const ankle = inputs.ankle as number;
        const gender = inputs.gender as string;
        if (!ankle) return null;
        const isMale = gender === "male";
        const idealCalf = ankle * (isMale ? 1.82 : 1.70);
        const idealThigh = ankle * (isMale ? 2.80 : 2.60);
        const idealKnee = ankle * 1.25;
        return {
          primary: { label: "Ideal Calf Size", value: `${formatNumber(idealCalf, 1)} cm` },
          details: [
            { label: "Ankle", value: `${formatNumber(ankle, 1)} cm` },
            { label: "Ideal Calf", value: `${formatNumber(idealCalf, 1)} cm (${formatNumber(idealCalf / ankle, 2)}x ankle)` },
            { label: "Ideal Thigh", value: `${formatNumber(idealThigh, 1)} cm (${formatNumber(idealThigh / ankle, 2)}x ankle)` },
            { label: "Expected Knee", value: `${formatNumber(idealKnee, 1)} cm` },
          ],
          note: "These proportions represent aesthetically balanced lower body development. Actual muscle potential depends on genetics, training, and body fat level.",
        };
      },
    },
  ],
  relatedSlugs: ["wrist-circumference-calculator", "body-symmetry-calculator", "bmi-calculator"],
  faq: [
    { question: "How do I measure ankle circumference?", answer: "Measure at the narrowest point of your ankle, just above the ankle bones (malleoli). Keep the tape snug but not tight. Measure both ankles and use the average if they differ." },
    { question: "What does ankle size tell you?", answer: "Ankle circumference reflects lower-body bone structure. It predicts natural calf and leg muscular potential, helps determine lower body frame size, and is used in body composition formulas. Larger ankles generally correlate with larger overall frame." },
  ],
  formula: "Lower frame: Male small <8.5in, medium 8.5-9.5in, large >9.5in | Ideal calf = ankle x 1.82 (men)",
};
