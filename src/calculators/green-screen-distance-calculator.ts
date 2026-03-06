import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenScreenDistanceCalculator: CalculatorDefinition = {
  slug: "green-screen-distance-calculator",
  title: "Green Screen Distance Calculator",
  description: "Calculate optimal distances between subject, green screen, and lights to minimize spill and achieve clean keying.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["green screen distance","chroma key setup","green screen lighting","chromakey calculator"],
  variants: [{
    id: "standard",
    name: "Green Screen Distance",
    description: "Calculate optimal distances between subject, green screen, and lights to minimize spill and achieve clean keying.",
    fields: [
      { name: "screenWidth", label: "Green Screen Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 },
      { name: "screenHeight", label: "Green Screen Height (ft)", type: "number", min: 4, max: 30, defaultValue: 9 },
      { name: "subjectCount", label: "Number of Subjects", type: "number", min: 1, max: 10, defaultValue: 1 },
      { name: "lensFL", label: "Lens Focal Length (mm)", type: "number", min: 16, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const screenW = inputs.screenWidth as number;
    const screenH = inputs.screenHeight as number;
    const subjects = inputs.subjectCount as number;
    const fl = inputs.lensFL as number;
    const subjectToScreen = Math.max(6, Math.round(screenW * 0.5));
    const minSpillDist = 6 + (subjects - 1) * 2;
    const subjectDist = Math.max(subjectToScreen, minSpillDist);
    const cameraToSubject = Math.round(fl / 10 * subjects * 1.5);
    const totalDepth = subjectDist + cameraToSubject;
    const lightToScreen = Math.round(screenW * 0.6);
    return {
      primary: { label: "Subject to Screen Distance", value: formatNumber(subjectDist) + " ft" },
      details: [
        { label: "Camera to Subject", value: formatNumber(cameraToSubject) + " ft" },
        { label: "Total Room Depth Needed", value: formatNumber(totalDepth) + " ft" },
        { label: "Screen Lights Distance", value: formatNumber(lightToScreen) + " ft from screen" },
        { label: "Min Screen Coverage", value: formatNumber(screenW) + " x " + formatNumber(screenH) + " ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["lighting-setup-cost-calculator","film-budget-estimator"],
  faq: [
    { question: "How far should the subject be from the green screen?", answer: "At minimum 6-8 feet to avoid green spill on the subject. More distance gives cleaner results but requires a larger screen." },
    { question: "What color green screen is best?", answer: "Chroma key green (Pantone 354C) is the most common. Blue screens are preferred for scenes with green elements or for digital skin tone preservation." },
    { question: "How do I light a green screen?", answer: "Light the screen evenly and separately from your subject. Place lights 4-6 feet from the screen at 45 degree angles to minimize hot spots." },
  ],
  formula: "Subject Distance = max(6 ft, Screen Width x 0.5); Camera Distance = Focal Length / 10 x Subjects x 1.5; Total Depth = Subject Distance + Camera Distance",
};
