import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const telescopeMagnificationCalculator: CalculatorDefinition = {
  slug: "telescope-magnification-calculator",
  title: "Telescope Magnification Calculator",
  description: "Free telescope magnification calculator. Calculate the magnification power of a telescope from focal length and eyepiece.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["telescope magnification", "telescope power", "eyepiece magnification", "focal length calculator"],
  variants: [
    {
      id: "magnification",
      name: "Calculate Magnification",
      description: "M = objective focal length / eyepiece focal length",
      fields: [
        { name: "objectiveFocal", label: "Objective Focal Length (mm)", type: "number", placeholder: "e.g. 1200" },
        { name: "eyepieceFocal", label: "Eyepiece Focal Length (mm)", type: "number", placeholder: "e.g. 25" },
        { name: "aperture", label: "Aperture (mm, optional)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const objF = inputs.objectiveFocal as number;
        const eyeF = inputs.eyepieceFocal as number;
        const ap = inputs.aperture as number;
        if (!objF || !eyeF) return null;
        const mag = objF / eyeF;
        const details: { label: string; value: string }[] = [
          { label: "Objective Focal Length", value: `${formatNumber(objF)} mm` },
          { label: "Eyepiece Focal Length", value: `${formatNumber(eyeF)} mm` },
        ];
        if (ap) {
          details.unshift({ label: "Focal Ratio (f/)", value: formatNumber(objF / ap, 1) });
          details.push({ label: "Max Useful Magnification", value: `${formatNumber(ap * 2, 0)}x` });
          details.push({ label: "Exit Pupil", value: `${formatNumber(ap / mag, 2)} mm` });
        }
        return {
          primary: { label: "Magnification", value: `${formatNumber(mag, 1)}x` },
          details,
        };
      },
    },
    {
      id: "eyepiece",
      name: "Find Eyepiece for Target Magnification",
      fields: [
        { name: "objectiveFocal", label: "Objective Focal Length (mm)", type: "number", placeholder: "e.g. 1200" },
        { name: "targetMag", label: "Desired Magnification (x)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const objF = inputs.objectiveFocal as number;
        const tgt = inputs.targetMag as number;
        if (!objF || !tgt) return null;
        return {
          primary: { label: "Required Eyepiece Focal Length", value: `${formatNumber(objF / tgt, 1)} mm` },
          details: [
            { label: "Desired Magnification", value: `${formatNumber(tgt)}x` },
            { label: "Objective Focal Length", value: `${formatNumber(objF)} mm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["telescope-aperture-calculator", "telescope-fov-calculator", "angular-diameter-calculator"],
  faq: [
    { question: "How is telescope magnification calculated?", answer: "Divide the objective focal length by the eyepiece focal length. A 1200mm scope with a 25mm eyepiece gives 48x." },
    { question: "What is the maximum useful magnification?", answer: "About 2x the aperture in mm. Beyond this the image becomes dim and blurry." },
    { question: "What is exit pupil?", answer: "Exit pupil is aperture divided by magnification. 5 to 7mm is ideal for dark sky viewing." },
  ],
  formula: "Magnification = Objective Focal Length / Eyepiece Focal Length",
};
