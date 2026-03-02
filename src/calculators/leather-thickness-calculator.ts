import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leatherThicknessCalculator: CalculatorDefinition = {
  slug: "leather-thickness-calculator",
  title: "Leather Thickness Calculator",
  description: "Convert leather thickness between ounces and millimeters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["leather thickness","leather oz to mm"],
  variants: [{
    id: "standard",
    name: "Leather Thickness",
    description: "Convert leather thickness between ounces and millimeters.",
    fields: [
      { name: "value", label: "Thickness Value", type: "number", min: 0.1, max: 50, defaultValue: 5 },
      { name: "unit", label: "Input Unit", type: "select", options: [{ value: "oz", label: "Ounces (oz)" }, { value: "mm", label: "Millimeters (mm)" }], defaultValue: "oz" },
    ],
    calculate: (inputs) => {
      const val = inputs.value as number;
      const unit = inputs.unit as string;
      if (!val) return null;
      let mm, oz, inches;
      if (unit === "oz") {
        mm = Math.round(val / 64 * 25.4 * 100) / 100;
        oz = val;
        inches = Math.round(val / 64 * 1000) / 1000;
      } else {
        mm = val;
        oz = Math.round(val / 25.4 * 64 * 100) / 100;
        inches = Math.round(val / 25.4 * 1000) / 1000;
      }
      const weight = oz <= 3 ? "Light" : oz <= 6 ? "Medium" : "Heavy";
      return {
        primary: { label: "Thickness", value: formatNumber(mm) + " mm / " + formatNumber(oz) + " oz" },
        details: [
          { label: "Inches", value: formatNumber(inches) + " in" },
          { label: "Weight Class", value: weight },
          { label: "Common Use", value: oz <= 3 ? "Garments and linings" : oz <= 6 ? "Bags and belts" : "Saddles and armor" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What does leather oz mean?", answer: "Each ounce equals 1/64 of an inch of thickness." },
    { question: "What thickness is best for wallets?", answer: "Use 2 to 3 oz (0.8 to 1.2 mm) leather for wallets." },
  ],
  formula: "1 oz = 1/64 inch = 0.397 mm",
};
