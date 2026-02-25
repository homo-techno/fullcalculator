import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thinLensCalculator: CalculatorDefinition = {
  slug: "thin-lens",
  title: "Thin Lens Equation Calculator",
  description:
    "Calculate image distance, object distance, or focal length using the thin lens equation: 1/f = 1/do + 1/di.",
  category: "Science",
  categorySlug: "science",
  icon: "Eye",
  keywords: [
    "thin lens",
    "focal length",
    "image distance",
    "object distance",
    "optics",
    "magnification",
    "physics",
  ],
  variants: [
    {
      id: "image-distance",
      name: "Image Distance from Focal Length & Object Distance",
      fields: [
        {
          name: "focalLength",
          label: "Focal Length f (cm)",
          type: "number",
          placeholder: "Enter focal length in cm (+ for converging, - for diverging)",
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
        return {
          primary: { label: "Image Distance", value: `${formatNumber(di)} cm` },
          details: [
            { label: "Focal Length", value: `${formatNumber(f)} cm` },
            { label: "Object Distance", value: `${formatNumber(dObj)} cm` },
            { label: "Magnification", value: formatNumber(magnification) },
            { label: "Image Type", value: imageType },
            { label: "Orientation", value: orientation },
          ],
        };
      },
    },
    {
      id: "focal-length",
      name: "Focal Length from Object & Image Distance",
      fields: [
        {
          name: "objectDistance",
          label: "Object Distance do (cm)",
          type: "number",
          placeholder: "Enter object distance in cm",
        },
        {
          name: "imageDistance",
          label: "Image Distance di (cm)",
          type: "number",
          placeholder: "Enter image distance in cm (+ real, - virtual)",
        },
      ],
      calculate: (inputs) => {
        const dObj = parseFloat(inputs.objectDistance as string);
        const di = parseFloat(inputs.imageDistance as string);
        if (isNaN(dObj) || isNaN(di) || dObj === 0 || di === 0) {
          return { primary: { label: "Focal Length", value: "Invalid input" }, details: [] };
        }
        const f = 1 / (1 / dObj + 1 / di);
        const lensType = f > 0 ? "Converging (convex)" : "Diverging (concave)";
        return {
          primary: { label: "Focal Length", value: `${formatNumber(f)} cm` },
          details: [
            { label: "Object Distance", value: `${formatNumber(dObj)} cm` },
            { label: "Image Distance", value: `${formatNumber(di)} cm` },
            { label: "Lens Type", value: lensType },
            { label: "Magnification", value: formatNumber(-di / dObj) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mirror-equation", "snells-law", "frequency-wavelength"],
  faq: [
    {
      question: "What is the thin lens equation?",
      answer:
        "The thin lens equation relates the focal length (f), object distance (do), and image distance (di) of a thin lens: 1/f = 1/do + 1/di. It applies to both converging and diverging lenses.",
    },
    {
      question: "What is the sign convention?",
      answer:
        "By convention, distances are positive when measured in the direction of light propagation. Object distance is positive when the object is on the incoming side of the lens. Image distance is positive for real images (opposite side) and negative for virtual images (same side as the object). Focal length is positive for converging lenses and negative for diverging lenses.",
    },
  ],
  formula:
    "1/f = 1/do + 1/di, where f is focal length, do is object distance, and di is image distance. Magnification M = -di/do.",
};
