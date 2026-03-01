import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closetSpaceCalculator: CalculatorDefinition = {
  slug: "closet-space-calculator",
  title: "Closet Space Calculator",
  description: "Calculate optimal closet storage space and organization based on wardrobe size and closet dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["closet space", "closet organization", "wardrobe storage"],
  variants: [{
    id: "standard",
    name: "Closet Space",
    description: "Calculate optimal closet storage space and organization based on wardrobe size and closet dimensions",
    fields: [
      { name: "closetWidth", label: "Closet Width", type: "number", suffix: "feet", min: 2, max: 20, defaultValue: 6 },
      { name: "closetDepth", label: "Closet Depth", type: "number", suffix: "feet", min: 1, max: 10, defaultValue: 2 },
      { name: "closetHeight", label: "Closet Height", type: "number", suffix: "feet", min: 6, max: 12, defaultValue: 8 },
      { name: "wardrobeSize", label: "Wardrobe Size", type: "select", options: [{value:"minimal",label:"Minimal (30 items)"},{value:"average",label:"Average (80 items)"},{value:"large",label:"Large (150 items)"},{value:"extensive",label:"Extensive (250+ items)"}], defaultValue: "average" },
    ],
    calculate: (inputs) => {
      const w = inputs.closetWidth as number;
      const d = inputs.closetDepth as number;
      const h = inputs.closetHeight as number;
      const wardrobe = inputs.wardrobeSize as string;
      if (!w || !d || !h) return null;
      const totalCuFt = w * d * h;
      const hangingFt = w;
      const itemsPerFt: Record<string, number> = { minimal: 3, average: 8, large: 15, extensive: 25 };
      const items = itemsPerFt[wardrobe] || 8;
      const hangingNeeded = Math.ceil(items / 8);
      const doubleHang = h >= 8 ? Math.min(w, hangingNeeded / 2) : 0;
      const shelfFt = Math.max(0, w - hangingNeeded + doubleHang);
      const fitsWell = hangingNeeded <= w * (h >= 8 ? 1.5 : 1);
      return {
        primary: { label: "Hanging Space Available", value: hangingFt.toFixed(1) + " linear ft" },
        details: [
          { label: "Hanging Space Needed", value: hangingNeeded + " linear ft" },
          { label: "Shelf Space Available", value: shelfFt.toFixed(1) + " ft" },
          { label: "Wardrobe Fit", value: fitsWell ? "Good fit" : "Consider additional storage" },
        ],
      };
    },
  }],
  relatedSlugs: ["mattress-replacement-calculator", "pantry-inventory-calculator"],
  faq: [
    { question: "How much closet space do I need?", answer: "The average person needs about 4-6 linear feet of hanging space and 10-15 square feet of shelf space for a standard wardrobe." },
    { question: "How can I maximize closet space?", answer: "Use double hanging rods for shorter items, add shelf dividers, use the back of the door, and install hooks for accessories to maximize available space." },
  ],
  formula: "Hanging Space = Closet Width (double-hang adds 50% if height allows)",
};
