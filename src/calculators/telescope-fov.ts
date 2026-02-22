import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const telescopeFovCalculator: CalculatorDefinition = {
  slug: "telescope-fov-calculator",
  title: "Telescope Field of View Calculator",
  description: "Free telescope field of view calculator. Calculate the true field of view from eyepiece apparent FOV and magnification.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["telescope field of view", "telescope fov", "true field of view", "apparent fov", "eyepiece fov"],
  variants: [
    {
      id: "fov",
      name: "Calculate True Field of View",
      description: "TFOV = AFOV / Magnification",
      fields: [
        { name: "afov", label: "Eyepiece Apparent FOV (degrees)", type: "number", placeholder: "e.g. 52" },
        { name: "objFocal", label: "Objective Focal Length (mm)", type: "number", placeholder: "e.g. 1200" },
        { name: "eyeFocal", label: "Eyepiece Focal Length (mm)", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const afov = inputs.afov as number;
        const objF = inputs.objFocal as number;
        const eyeF = inputs.eyeFocal as number;
        if (!afov || !objF || !eyeF) return null;
        const mag = objF / eyeF;
        const tfov = afov / mag;
        const tfovArcmin = tfov * 60;
        return {
          primary: { label: "True Field of View", value: `${formatNumber(tfov, 3)} degrees` },
          details: [
            { label: "True FOV (arcmin)", value: formatNumber(tfovArcmin, 1) },
            { label: "Magnification", value: `${formatNumber(mag, 1)}x` },
            { label: "Apparent FOV", value: `${formatNumber(afov)} degrees` },
            { label: "Full Moons across FOV", value: formatNumber(tfov / 0.52, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["telescope-magnification-calculator", "telescope-aperture-calculator", "angular-diameter-calculator"],
  faq: [
    { question: "What is true field of view?", answer: "The actual angular extent of sky visible through the telescope. It equals the eyepiece apparent FOV divided by magnification." },
    { question: "What is a good field of view?", answer: "Wide-field eyepieces (60-82 degree AFOV) give larger true fields. Lower magnification also gives wider fields." },
  ],
  formula: "True FOV = Apparent FOV / Magnification",
};
