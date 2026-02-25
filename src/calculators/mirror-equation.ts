import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mirrorEquationCalculator: CalculatorDefinition = {
  slug: "mirror-equation",
  title: "Mirror Equation Calculator",
  description:
    "Calculate image distance, object distance, or focal length for a spherical mirror using 1/f = 1/do + 1/di.",
  category: "Science",
  categorySlug: "science",
  icon: "Square",
  keywords: [
    "mirror equation",
    "concave mirror",
    "convex mirror",
    "focal length",
    "image distance",
    "optics",
    "physics",
  ],
  variants: [
    {
      id: "image-distance-mirror",
      name: "Image Distance from Focal Length & Object Distance",
      fields: [
        {
          name: "focalLength",
          label: "Focal Length f (cm)",
          type: "number",
          placeholder: "Enter focal length (+ concave, - convex)",
        },
        {
          name: "objectDistance",
          label: "Object Distance do (cm)",
          type: "number",
          placeholder: "Enter object distance in cm",
        },
      ],
      calculate: (inputs) => {
        const f = parseFloat(inputs.focalLength as string);
        const dObj = parseFloat(inputs.objectDistance as string);
        if (isNaN(f) || isNaN(dObj) || f === 0) {
          return { primary: { label: "Image Distance", value: "Invalid input" }, details: [] };
        }
        const invDi = 1 / f - 1 / dObj;
        if (invDi === 0) {
          return { primary: { label: "Image Distance", value: "Image at infinity" }, details: [] };
        }
        const di = 1 / invDi;
        const magnification = -di / dObj;
        const imageType = di > 0 ? "Real" : "Virtual";
        const orientation = magnification > 0 ? "Upright" : "Inverted";
        const radiusOfCurvature = 2 * f;
        return {
          primary: { label: "Image Distance", value: `${formatNumber(di)} cm` },
          details: [
            { label: "Focal Length", value: `${formatNumber(f)} cm` },
            { label: "Radius of Curvature", value: `${formatNumber(radiusOfCurvature)} cm` },
            { label: "Object Distance", value: `${formatNumber(dObj)} cm` },
            { label: "Magnification", value: formatNumber(magnification) },
            { label: "Image Type", value: imageType },
            { label: "Orientation", value: orientation },
          ],
        };
      },
    },
    {
      id: "focal-length-mirror",
      name: "Focal Length from Radius of Curvature",
      fields: [
        {
          name: "radius",
          label: "Radius of Curvature R (cm)",
          type: "number",
          placeholder: "Enter radius of curvature (+ concave, - convex)",
        },
      ],
      calculate: (inputs) => {
        const R = parseFloat(inputs.radius as string);
        if (isNaN(R)) {
          return { primary: { label: "Focal Length", value: "Invalid input" }, details: [] };
        }
        const f = R / 2;
        const mirrorType = f > 0 ? "Concave" : "Convex";
        return {
          primary: { label: "Focal Length", value: `${formatNumber(f)} cm` },
          details: [
            { label: "Radius of Curvature", value: `${formatNumber(R)} cm` },
            { label: "Mirror Type", value: mirrorType },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["thin-lens", "snells-law", "frequency-wavelength"],
  faq: [
    {
      question: "What is the mirror equation?",
      answer:
        "The mirror equation has the same form as the thin lens equation: 1/f = 1/do + 1/di. The focal length equals half the radius of curvature: f = R/2.",
    },
    {
      question: "What is the difference between concave and convex mirrors?",
      answer:
        "A concave mirror (positive focal length) can form both real and virtual images depending on object placement. A convex mirror (negative focal length) always forms a virtual, upright, and diminished image.",
    },
  ],
  formula:
    "1/f = 1/do + 1/di, where f = R/2. f is focal length, R is radius of curvature, do is object distance, and di is image distance.",
};
