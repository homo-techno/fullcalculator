import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const securityCameraCalculator: CalculatorDefinition = {
  slug: "security-camera-calculator",
  title: "Security Camera Calculator",
  description: "Calculate the number of cameras needed for property coverage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["security camera","surveillance camera calculator"],
  variants: [{
    id: "standard",
    name: "Security Camera",
    description: "Calculate the number of cameras needed for property coverage.",
    fields: [
      { name: "perimeterFt", label: "Perimeter Length (ft)", type: "number", min: 10, max: 5000, defaultValue: 200 },
      { name: "fov", label: "Camera Field of View (degrees)", type: "number", min: 30, max: 180, defaultValue: 90 },
      { name: "entryPoints", label: "Entry Points", type: "number", min: 1, max: 50, defaultValue: 4 },
      { name: "indoorCams", label: "Indoor Cameras", type: "number", min: 0, max: 50, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const p = inputs.perimeterFt as number;
      const fov = inputs.fov as number;
      const entry = inputs.entryPoints as number;
      const indoor = inputs.indoorCams as number;
      if (!p || !fov) return null;
      const coverage = fov / 360;
      const perimeterCams = Math.ceil(1 / coverage);
      const totalPerimeter = Math.ceil(p / 50) > perimeterCams ? Math.ceil(p / 50) : perimeterCams;
      const entryDedicated = Math.max(entry, 0);
      const total = totalPerimeter + entryDedicated + indoor;
      return {
        primary: { label: "Total Cameras Needed", value: formatNumber(total) },
        details: [
          { label: "Perimeter Cameras", value: formatNumber(totalPerimeter) },
          { label: "Entry Point Cameras", value: formatNumber(entryDedicated) },
          { label: "Indoor Cameras", value: formatNumber(indoor) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many cameras do I need for my home?", answer: "Most homes need 4 to 8 cameras covering all entry points and key areas." },
    { question: "What field of view is best for security cameras?", answer: "A 90 to 110 degree field of view covers most residential applications." },
  ],
  formula: "Total = Perimeter Cameras + Entry Cameras + Indoor Cameras",
};
