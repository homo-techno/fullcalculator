import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wristCircumferenceCalculator: CalculatorDefinition = {
  slug: "wrist-circumference-calculator",
  title: "Wrist Circumference Frame Size Calculator",
  description: "Free wrist circumference calculator. Determine your body frame size (small, medium, large) based on wrist measurement and height.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["wrist circumference", "body frame size", "frame size calculator", "bone structure", "wrist measurement", "small medium large frame"],
  variants: [
    {
      id: "frame-size",
      name: "Body Frame Size",
      description: "Determine your frame size from wrist circumference and height",
      fields: [
        { name: "wrist", label: "Wrist Circumference", type: "number", placeholder: "e.g. 17", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 175", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const wrist = inputs.wrist as number;
        const height = inputs.height as number;
        const gender = inputs.gender as string;
        if (!wrist || !height) return null;
        const heightIn = height / 2.54;
        const wristIn = wrist / 2.54;
        const ratio = height / wrist;
        let frameSize: string;
        if (gender === "male") {
          if (wristIn < 6.5) frameSize = "Small Frame";
          else if (wristIn <= 7.5) frameSize = "Medium Frame";
          else frameSize = "Large Frame";
        } else {
          if (heightIn < 62) {
            if (wristIn < 5.5) frameSize = "Small Frame";
            else if (wristIn <= 5.75) frameSize = "Medium Frame";
            else frameSize = "Large Frame";
          } else if (heightIn <= 65) {
            if (wristIn < 6.0) frameSize = "Small Frame";
            else if (wristIn <= 6.25) frameSize = "Medium Frame";
            else frameSize = "Large Frame";
          } else {
            if (wristIn < 6.25) frameSize = "Small Frame";
            else if (wristIn <= 6.5) frameSize = "Medium Frame";
            else frameSize = "Large Frame";
          }
        }
        let idealWeightAdj: string;
        if (frameSize === "Small Frame") idealWeightAdj = "Subtract ~10% from standard ideal weight";
        else if (frameSize === "Large Frame") idealWeightAdj = "Add ~10% to standard ideal weight";
        else idealWeightAdj = "Standard ideal weight applies";
        return {
          primary: { label: "Frame Size", value: frameSize },
          details: [
            { label: "Wrist Circumference", value: `${formatNumber(wrist, 1)} cm (${formatNumber(wristIn, 1)} in)` },
            { label: "Height", value: `${formatNumber(height, 1)} cm (${formatNumber(heightIn, 1)} in)` },
            { label: "Height-to-Wrist Ratio", value: formatNumber(ratio, 2) },
            { label: "Ideal Weight Adjustment", value: idealWeightAdj },
          ],
          note: "Frame size is important for interpreting ideal weight charts. Larger-framed individuals naturally weigh more without being overweight.",
        };
      },
    },
    {
      id: "muscular-potential",
      name: "Wrist-Based Muscular Potential",
      description: "Estimate maximum muscular measurements based on wrist size (Casey Butt method)",
      fields: [
        { name: "wrist", label: "Wrist Circumference", type: "number", placeholder: "e.g. 17.5", suffix: "cm" },
        { name: "ankle", label: "Ankle Circumference", type: "number", placeholder: "e.g. 22", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const wrist = inputs.wrist as number;
        const ankle = inputs.ankle as number;
        const height = inputs.height as number;
        if (!wrist || !ankle || !height) return null;
        const heightIn = height / 2.54;
        const wristIn = wrist / 2.54;
        const ankleIn = ankle / 2.54;
        const maxChest = 1.625 * wristIn + 1.3682 * ankleIn + 0.3 * heightIn;
        const maxBicep = 1.1709 * wristIn + 0.1350 * ankleIn;
        const maxForearm = 0.950 * wristIn + 0.1041 * ankleIn;
        const maxThigh = 1.4737 * ankleIn + 0.1918 * wristIn;
        const maxCalf = 0.9812 * ankleIn + 0.1250 * wristIn;
        return {
          primary: { label: "Max Chest (at ~10% BF)", value: `${formatNumber(maxChest * 2.54, 1)} cm` },
          details: [
            { label: "Max Bicep", value: `${formatNumber(maxBicep * 2.54, 1)} cm (${formatNumber(maxBicep, 1)} in)` },
            { label: "Max Forearm", value: `${formatNumber(maxForearm * 2.54, 1)} cm (${formatNumber(maxForearm, 1)} in)` },
            { label: "Max Thigh", value: `${formatNumber(maxThigh * 2.54, 1)} cm (${formatNumber(maxThigh, 1)} in)` },
            { label: "Max Calf", value: `${formatNumber(maxCalf * 2.54, 1)} cm (${formatNumber(maxCalf, 1)} in)` },
          ],
          note: "These represent approximate natural muscular potential at ~10% body fat. Based on Casey Butt's research on natural bodybuilders' bone structure correlations.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "ideal-weight-calculator", "body-symmetry-calculator"],
  faq: [
    { question: "How does wrist size determine frame size?", answer: "Wrist circumference is used because it has minimal fat and muscle. It reflects bone structure (frame size) accurately. Men: <6.5in small, 6.5-7.5in medium, >7.5in large. Women vary by height." },
    { question: "Why does frame size matter?", answer: "Frame size affects ideal weight ranges. A large-framed person may be healthy at a weight that would be overweight for a small-framed person. It also correlates with natural muscular potential." },
  ],
  formula: "Male: Small <6.5in, Medium 6.5-7.5in, Large >7.5in wrist | Female varies by height",
};
