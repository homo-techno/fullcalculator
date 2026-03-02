import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printTime3dCalculator: CalculatorDefinition = {
  slug: "print-time-3d-calculator",
  title: "3D Print Time Calculator",
  description: "Estimate 3D printing time from volume and settings.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["3D print time","print duration calculator"],
  variants: [{
    id: "standard",
    name: "3D Print Time",
    description: "Estimate 3D printing time from volume and settings.",
    fields: [
      { name: "volume", label: "Part Volume (cm3)", type: "number", min: 0.1, max: 10000, defaultValue: 50 },
      { name: "layerHeight", label: "Layer Height (mm)", type: "number", min: 0.05, max: 0.6, defaultValue: 0.2 },
      { name: "printSpeed", label: "Print Speed (mm/s)", type: "number", min: 10, max: 300, defaultValue: 60 },
      { name: "infill", label: "Infill (%)", type: "number", min: 0, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const vol = inputs.volume as number;
      const layer = inputs.layerHeight as number;
      const speed = inputs.printSpeed as number;
      const infill = inputs.infill as number;
      if (!vol || !layer || !speed) return null;
      const effectiveVol = vol * (0.3 + infill / 100 * 0.7);
      const layerArea = effectiveVol * 1000 / (layer);
      const pathLength = layerArea / 0.4;
      const timeSeconds = pathLength / speed;
      const hours = Math.round(timeSeconds / 3600 * 10) / 10;
      const minutes = Math.round(timeSeconds / 60);
      return {
        primary: { label: "Estimated Print Time", value: hours >= 1 ? formatNumber(hours) + " hrs" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Volume", value: formatNumber(Math.round(effectiveVol * 10) / 10) + " cm3" },
          { label: "Total Path Length", value: formatNumber(Math.round(pathLength / 1000)) + " m" },
          { label: "Layer Height", value: formatNumber(layer) + " mm" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Does layer height affect print time?", answer: "Yes. Thinner layers increase quality but double the print time." },
    { question: "What is a good print speed?", answer: "Most FDM printers work well at 40 to 80 mm per second." },
  ],
  formula: "Time = Path Length / Print Speed",
};
