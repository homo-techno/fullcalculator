import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freightClassCalculator: CalculatorDefinition = {
  slug: "freight-class-calculator",
  title: "Freight Class Calculator",
  description: "Determine freight density and NMFC class for shipping.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Truck",
  keywords: ["freight","class","density","NMFC","LTL"],
  variants: [{
    id: "standard",
    name: "Freight Class",
    description: "Determine freight density and NMFC class for shipping.",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 50000, defaultValue: 500 },
      { name: "length", label: "Length (in)", type: "number", min: 1, max: 600, defaultValue: 48 },
      { name: "width", label: "Width (in)", type: "number", min: 1, max: 600, defaultValue: 40 },
      { name: "height", label: "Height (in)", type: "number", min: 1, max: 600, defaultValue: 36 },
    ],
    calculate: (inputs) => {
    const weight = inputs.weight as number;
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const cubicFeet = (length * width * height) / 1728;
    const density = weight / cubicFeet;
    let freightClass = "500";
    if (density >= 50) freightClass = "50";
    else if (density >= 35) freightClass = "55";
    else if (density >= 30) freightClass = "60";
    else if (density >= 22.5) freightClass = "65";
    else if (density >= 15) freightClass = "70";
    else if (density >= 13.5) freightClass = "77.5";
    else if (density >= 12) freightClass = "85";
    else if (density >= 10.5) freightClass = "92.5";
    else if (density >= 9) freightClass = "100";
    else if (density >= 8) freightClass = "110";
    else if (density >= 7) freightClass = "125";
    else if (density >= 6) freightClass = "150";
    else if (density >= 5) freightClass = "175";
    else if (density >= 4) freightClass = "200";
    else if (density >= 3) freightClass = "250";
    else if (density >= 2) freightClass = "300";
    else if (density >= 1) freightClass = "400";
    return {
      primary: { label: "Freight Class", value: freightClass },
      details: [
        { label: "Density (lbs/cu ft)", value: formatNumber(density) },
        { label: "Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Weight (lbs)", value: formatNumber(weight) }
      ]
    };
  },
  }],
  relatedSlugs: ["ltl-freight-cost-calculator","dimensional-weight-calculator","cbm-calculator"],
  faq: [
    { question: "What is freight class?", answer: "A classification system from 50 to 500 based on density, value, and handling." },
    { question: "How is freight density calculated?", answer: "Divide the weight in pounds by the volume in cubic feet." },
  ],
  formula: "Density = Weight / (L x W x H / 1728)",
};
