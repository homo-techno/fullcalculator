import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasLawCalculator: CalculatorDefinition = {
  slug: "gas-law-calculator",
  title: "Gas Law Calculator",
  description: "Solve for any variable in the ideal gas law equation PV = nRT given the other three values.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ideal gas law", "PV nRT calculator", "gas law calculator"],
  variants: [{
    id: "standard",
    name: "Gas Law",
    description: "Solve for any variable in the ideal gas law equation PV = nRT given the other three values",
    fields: [
      { name: "solveFor", label: "Solve For", type: "select", options: [{value:"P",label:"Pressure (P)"},{value:"V",label:"Volume (V)"},{value:"n",label:"Moles (n)"},{value:"T",label:"Temperature (T)"}], defaultValue: "P" },
      { name: "pressure", label: "Pressure", type: "number", suffix: "atm", min: 0.001, max: 1000, step: 0.01, defaultValue: 1 },
      { name: "volume", label: "Volume", type: "number", suffix: "L", min: 0.001, max: 100000, step: 0.1, defaultValue: 22.4 },
      { name: "temperature", label: "Temperature", type: "number", suffix: "K", min: 1, max: 10000, step: 1, defaultValue: 273 },
    ],
    calculate: (inputs) => {
      const solveFor = inputs.solveFor as string;
      const P = inputs.pressure as number;
      const V = inputs.volume as number;
      const T = inputs.temperature as number;
      const R = 0.08206;
      let result = 0;
      let label = "";
      let unit = "";
      if (solveFor === "P") {
        const n = (P * V) / (R * T);
        result = (n * R * T) / V;
        label = "Pressure";
        unit = " atm";
      } else if (solveFor === "V") {
        const n = (P * V) / (R * T);
        result = (n * R * T) / P;
        label = "Volume";
        unit = " L";
      } else if (solveFor === "n") {
        result = (P * V) / (R * T);
        label = "Moles";
        unit = " mol";
      } else {
        const n = (P * V) / (R * T);
        result = (P * V) / (n * R);
        label = "Temperature";
        unit = " K";
      }
      if (!result || result <= 0) return null;
      const n = (P * V) / (R * T);
      return {
        primary: { label: label, value: formatNumber(Math.round(result * 10000) / 10000) + unit },
        details: [
          { label: "Moles (n)", value: formatNumber(Math.round(n * 10000) / 10000) + " mol" },
          { label: "Gas Constant (R)", value: "0.08206 L atm / mol K" },
          { label: "Equation", value: "PV = nRT" },
        ],
      };
    },
  }],
  relatedSlugs: ["molar-mass-calculator", "reaction-yield-calculator"],
  faq: [
    { question: "What is the ideal gas law?", answer: "The ideal gas law, PV = nRT, relates the pressure, volume, moles, and temperature of an ideal gas. R is the gas constant (0.08206 L atm per mol K)." },
    { question: "When does the ideal gas law not apply?", answer: "The ideal gas law is less accurate at very high pressures, very low temperatures, and for gases with strong intermolecular forces. In these cases, the van der Waals equation provides better results." },
  ],
  formula: "PV = nRT, where R = 0.08206 L atm / mol K",
};
