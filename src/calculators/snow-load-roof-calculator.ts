import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowLoadRoofCalculator: CalculatorDefinition = {
  slug: "snow-load-roof-calculator",
  title: "Snow Load Roof Calculator",
  description: "Calculate the snow load stress on your roof based on snow depth, density, and roof area.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["snow load", "roof snow weight", "snow load calculation"],
  variants: [{
    id: "standard",
    name: "Snow Load Roof",
    description: "Calculate the snow load stress on your roof based on snow depth, density, and roof area",
    fields: [
      { name: "roofArea", label: "Roof Area", type: "number", suffix: "sq ft", min: 100, max: 50000, defaultValue: 2000 },
      { name: "snowDepth", label: "Snow Depth", type: "number", suffix: "inches", min: 1, max: 120, defaultValue: 12 },
      { name: "snowType", label: "Snow Type", type: "select", options: [{value:"fresh",label:"Fresh/Light Snow"},{value:"packed",label:"Packed Snow"},{value:"wet",label:"Wet/Heavy Snow"},{value:"ice",label:"Ice Crust"}], defaultValue: "packed" },
      { name: "roofPitch", label: "Roof Pitch", type: "select", options: [{value:"flat",label:"Flat (0-2/12)"},{value:"low",label:"Low (3-5/12)"},{value:"medium",label:"Medium (6-8/12)"},{value:"steep",label:"Steep (9-12/12)"}], defaultValue: "medium" },
    ],
    calculate: (inputs) => {
      const area = inputs.roofArea as number;
      const depth = inputs.snowDepth as number;
      const snowType = inputs.snowType as string;
      const pitch = inputs.roofPitch as string;
      if (!area || !depth) return null;
      const densityPcf: Record<string, number> = { fresh: 5, packed: 15, wet: 30, ice: 57 };
      const pitchFactor: Record<string, number> = { flat: 1.0, low: 0.85, medium: 0.6, steep: 0.3 };
      const density = densityPcf[snowType] || 15;
      const pFactor = pitchFactor[pitch] || 0.6;
      const psfLoad = (depth / 12) * density * pFactor;
      const totalWeight = Math.round(psfLoad * area);
      const safeLimit = 30;
      const status = psfLoad > safeLimit ? "DANGER - Exceeds typical limit" : psfLoad > 20 ? "Caution - Monitor closely" : "Within safe range";
      return {
        primary: { label: "Snow Load", value: psfLoad.toFixed(1) + " psf" },
        details: [
          { label: "Total Weight on Roof", value: formatNumber(totalWeight) + " lbs" },
          { label: "Status", value: status },
          { label: "Snow Density", value: density + " pcf" },
        ],
      };
    },
  }],
  relatedSlugs: ["ice-dam-prevention-calculator", "winter-heating-cost-calculator"],
  faq: [
    { question: "How much snow can a roof hold?", answer: "Most residential roofs can support 20-30 pounds per square foot of snow load. Flat roofs are more vulnerable than steep roofs because snow accumulates more." },
    { question: "When should I remove snow from my roof?", answer: "Consider removing snow when the load exceeds 20 psf or when you notice doors sticking, cracks in walls, or creaking sounds from the structure." },
  ],
  formula: "Snow Load (psf) = (Snow Depth / 12) x Snow Density x Pitch Factor",
};
