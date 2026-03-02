import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyeglassPrescriptionCalculator: CalculatorDefinition = {
  slug: "eyeglass-prescription-calculator",
  title: "Eyeglass Prescription Calculator",
  description: "Estimate lens thickness based on prescription strength and lens type.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["eyeglass lens thickness","prescription lens calculator","lens index guide"],
  variants: [{
    id: "standard",
    name: "Eyeglass Prescription",
    description: "Estimate lens thickness based on prescription strength and lens type.",
    fields: [
      { name: "sphere", label: "Sphere Power (diopters)", type: "number", min: -20, max: 20, defaultValue: -3 },
      { name: "lensIndex", label: "Lens Index", type: "select", options: [{ value: "1", label: "1.50 Standard" }, { value: "2", label: "1.59 Polycarbonate" }, { value: "3", label: "1.67 High Index" }, { value: "4", label: "1.74 Ultra High Index" }] },
      { name: "frameWidth", label: "Frame Lens Width (mm)", type: "number", min: 40, max: 70, defaultValue: 52 },
    ],
    calculate: (inputs) => {
    const sphere = inputs.sphere as number;
    const lensIndex = inputs.lensIndex as string;
    const frameWidth = inputs.frameWidth as number;
    const indexValues: Record<string, number> = { "1": 1.50, "2": 1.59, "3": 1.67, "4": 1.74 };
    const indexNames: Record<string, string> = { "1": "1.50 Standard", "2": "1.59 Polycarbonate", "3": "1.67 High Index", "4": "1.74 Ultra High Index" };
    const idx = indexValues[lensIndex] || 1.50;
    const absSphere = Math.abs(sphere);
    const radius = frameWidth / 2;
    const edgeThickness = sphere < 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const centerThickness = sphere > 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const maxThickness = Math.max(edgeThickness, centerThickness);
    return {
      primary: { label: "Max Lens Thickness", value: formatNumber(Math.round(maxThickness * 10) / 10) + " mm" },
      details: [
        { label: "Lens Index", value: indexNames[lensIndex] || "Standard" },
        { label: "Edge Thickness", value: formatNumber(Math.round(edgeThickness * 10) / 10) + " mm" },
        { label: "Center Thickness", value: formatNumber(Math.round(centerThickness * 10) / 10) + " mm" },
        { label: "Sphere Power", value: sphere + " D" }
      ]
    };
  },
  }],
  relatedSlugs: ["contact-lens-cost-calculator","pupillary-distance-calculator","reading-glasses-strength-calculator"],
  faq: [
    { question: "What lens index should I choose?", answer: "Prescriptions over -4 or +4 benefit from 1.67 or 1.74 high index lenses." },
    { question: "Are thinner lenses worth the extra cost?", answer: "For strong prescriptions, high index lenses are lighter and more comfortable." },
    { question: "Does frame size affect lens thickness?", answer: "Yes, larger frames require thicker lenses, especially for strong prescriptions." },
  ],
  formula: "Thickness = Base + (|Sphere| x Radius) / (2 x (Index - 1) x 10)",
};
