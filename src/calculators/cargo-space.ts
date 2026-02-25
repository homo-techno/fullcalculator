import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cargoSpaceCalculator: CalculatorDefinition = {
  slug: "cargo-space-calculator",
  title: "Cargo Space Calculator",
  description: "Free cargo space calculator. Calculate how many items fit in your vehicle's cargo area based on dimensions and cargo volume.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cargo space calculator", "trunk space calculator", "vehicle cargo volume", "car storage capacity", "cargo fit calculator"],
  variants: [
    {
      id: "volume",
      name: "Cargo Volume",
      description: "Calculate cargo area volume from dimensions",
      fields: [
        { name: "length", label: "Cargo Area Length", type: "number", placeholder: "e.g. 40", suffix: "inches" },
        { name: "width", label: "Cargo Area Width", type: "number", placeholder: "e.g. 48", suffix: "inches" },
        { name: "height", label: "Cargo Area Height", type: "number", placeholder: "e.g. 30", suffix: "inches" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;

        const cubicInches = length * width * height;
        const cubicFeet = cubicInches / 1728;
        const liters = cubicInches * 0.016387;
        const standardBoxes = Math.floor(cubicFeet / 1.5);
        const suitcases = Math.floor(cubicFeet / 4);

        return {
          primary: { label: "Cargo Volume", value: `${formatNumber(cubicFeet, 1)} cu ft` },
          details: [
            { label: "Volume in liters", value: `${formatNumber(liters, 0)} L` },
            { label: "Volume in cubic inches", value: `${formatNumber(cubicInches, 0)} cu in` },
            { label: "Standard moving boxes", value: `~${standardBoxes} boxes` },
            { label: "Large suitcases", value: `~${suitcases} suitcases` },
          ],
        };
      },
    },
    {
      id: "items",
      name: "Will It Fit?",
      description: "Check if specific items fit in your cargo area",
      fields: [
        { name: "cargoLength", label: "Cargo Area Length", type: "number", placeholder: "e.g. 40", suffix: "in" },
        { name: "cargoWidth", label: "Cargo Area Width", type: "number", placeholder: "e.g. 48", suffix: "in" },
        { name: "cargoHeight", label: "Cargo Area Height", type: "number", placeholder: "e.g. 30", suffix: "in" },
        { name: "itemLength", label: "Item Length", type: "number", placeholder: "e.g. 36", suffix: "in" },
        { name: "itemWidth", label: "Item Width", type: "number", placeholder: "e.g. 24", suffix: "in" },
        { name: "itemHeight", label: "Item Height", type: "number", placeholder: "e.g. 18", suffix: "in" },
      ],
      calculate: (inputs) => {
        const cL = inputs.cargoLength as number;
        const cW = inputs.cargoWidth as number;
        const cH = inputs.cargoHeight as number;
        const iL = inputs.itemLength as number;
        const iW = inputs.itemWidth as number;
        const iH = inputs.itemHeight as number;
        if (!cL || !cW || !cH || !iL || !iW || !iH) return null;

        const fits = (iL <= cL && iW <= cW && iH <= cH) ||
                     (iL <= cL && iH <= cW && iW <= cH) ||
                     (iW <= cL && iL <= cW && iH <= cH) ||
                     (iW <= cL && iH <= cW && iL <= cH) ||
                     (iH <= cL && iL <= cW && iW <= cH) ||
                     (iH <= cL && iW <= cW && iL <= cH);

        const cargoVol = cL * cW * cH;
        const itemVol = iL * iW * iH;
        const maxItems = Math.floor(cargoVol / itemVol);
        const utilization = (itemVol / cargoVol) * 100;

        return {
          primary: { label: "Will It Fit?", value: fits ? "Yes" : "No" },
          details: [
            { label: "Cargo volume", value: `${formatNumber(cargoVol / 1728, 1)} cu ft` },
            { label: "Item volume", value: `${formatNumber(itemVol / 1728, 1)} cu ft` },
            { label: "Space used by 1 item", value: `${formatNumber(utilization, 1)}%` },
            { label: "Max items (by volume)", value: `${maxItems}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How is cargo space measured?", answer: "Cargo space is typically measured in cubic feet. It's calculated by measuring the length, width, and height of the cargo area. Most SUVs have 30-80 cu ft behind the rear seats, while sedans typically have 12-16 cu ft trunk space." },
    { question: "What is a good cargo space for an SUV?", answer: "A compact SUV typically offers 25-35 cu ft behind the rear seats. A mid-size SUV offers 35-45 cu ft, and a full-size SUV can have 40-90+ cu ft. With rear seats folded, these numbers roughly double." },
  ],
  formula: "Volume (cu ft) = (Length × Width × Height) / 1,728",
};
