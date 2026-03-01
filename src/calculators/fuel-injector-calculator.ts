import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelInjectorCalculator: CalculatorDefinition = {
  slug: "fuel-injector-calculator",
  title: "Fuel Injector Flow Calculator",
  description: "Calculate the required fuel injector size based on engine horsepower, number of cylinders, and fuel type.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fuel injector sizing", "injector flow rate", "injector cc calculator"],
  variants: [{
    id: "standard",
    name: "Fuel Injector Flow",
    description: "Calculate the required fuel injector size based on engine horsepower, number of cylinders, and fuel type",
    fields: [
      { name: "horsepower", label: "Target Horsepower", type: "number", suffix: "hp", min: 50, max: 2000, defaultValue: 300 },
      { name: "cylinders", label: "Number of Cylinders", type: "number", min: 2, max: 16, defaultValue: 8 },
      { name: "dutyCycle", label: "Max Duty Cycle", type: "number", suffix: "%", min: 50, max: 100, defaultValue: 80 },
      { name: "fuelType", label: "Fuel Type", type: "select", options: [{value:"gasoline",label:"Gasoline"},{value:"e85",label:"E85 Ethanol"},{value:"methanol",label:"Methanol"}], defaultValue: "gasoline" },
    ],
    calculate: (inputs) => {
      const hp = inputs.horsepower as number;
      const cyl = inputs.cylinders as number;
      const duty = inputs.dutyCycle as number;
      const fuel = inputs.fuelType as string;
      if (!hp || !cyl || !duty) return null;
      const bsfc: Record<string, number> = { gasoline: 0.50, e85: 0.68, methanol: 1.05 };
      const fuelRate = bsfc[fuel] || 0.50;
      const totalFuel = hp * fuelRate;
      const perInjector = totalFuel / cyl;
      const requiredFlow = (perInjector / (duty / 100)) * 10.5;
      return {
        primary: { label: "Required Injector Size", value: formatNumber(Math.round(requiredFlow)) + " cc/min" },
        details: [
          { label: "Total Fuel Flow", value: formatNumber(Math.round(totalFuel * 10) / 10) + " lb/hr" },
          { label: "Per Injector Flow", value: formatNumber(Math.round(perInjector * 10) / 10) + " lb/hr" },
          { label: "Duty Cycle", value: duty + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["engine-displacement-calculator", "turbo-boost-calculator"],
  faq: [
    { question: "How do I size fuel injectors?", answer: "Divide total fuel demand by the number of cylinders, then account for maximum duty cycle (typically 80%)." },
    { question: "What duty cycle should fuel injectors run at?", answer: "Most tuners recommend a maximum of 80% duty cycle to allow headroom for fuel pressure changes and safety." },
  ],
  formula: "Injector Size = (HP x BSFC / Cylinders / Duty Cycle) x 10.5",
};
