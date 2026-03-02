import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const safeSizeCalculator: CalculatorDefinition = {
  slug: "safe-size-calculator",
  title: "Safe Size Calculator",
  description: "Determine the right safe dimensions for your valuables.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["safe size","safe capacity calculator"],
  variants: [{
    id: "standard",
    name: "Safe Size",
    description: "Determine the right safe dimensions for your valuables.",
    fields: [
      { name: "documents", label: "Document Folders", type: "number", min: 0, max: 50, defaultValue: 5 },
      { name: "cashBundles", label: "Cash/Envelope Bundles", type: "number", min: 0, max: 50, defaultValue: 3 },
      { name: "jewelryBoxes", label: "Jewelry Boxes", type: "number", min: 0, max: 20, defaultValue: 2 },
      { name: "firearms", label: "Handguns", type: "number", min: 0, max: 20, defaultValue: 0 },
      { name: "electronics", label: "Small Electronics", type: "number", min: 0, max: 20, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const docs = inputs.documents as number;
      const cash = inputs.cashBundles as number;
      const jewel = inputs.jewelryBoxes as number;
      const guns = inputs.firearms as number;
      const elec = inputs.electronics as number;
      const docVol = docs * 100;
      const cashVol = cash * 30;
      const jewelVol = jewel * 200;
      const gunVol = guns * 300;
      const elecVol = elec * 150;
      const totalCuIn = docVol + cashVol + jewelVol + gunVol + elecVol;
      const cuFt = Math.round((totalCuIn / 1728) * 100) / 100;
      const recommended = Math.round(cuFt * 1.5 * 100) / 100;
      return {
        primary: { label: "Recommended Safe Size", value: formatNumber(recommended) + " cu ft" },
        details: [
          { label: "Item Volume", value: formatNumber(totalCuIn) + " cu in" },
          { label: "Minimum Capacity", value: formatNumber(cuFt) + " cu ft" },
          { label: "Buffer Factor", value: "1.5x" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size safe do I need for documents?", answer: "A 0.5 to 1.0 cubic foot safe holds important papers and small valuables." },
    { question: "Should I bolt down my safe?", answer: "Yes, bolting the safe to the floor or wall greatly increases security." },
  ],
  formula: "Recommended = (Total Item Volume / 1728) x 1.5",
};
