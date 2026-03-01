import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyLineSurveyCalculator: CalculatorDefinition = {
  slug: "property-line-survey-calculator",
  title: "Property Line Survey Calculator",
  description: "Estimate the cost of a property line or boundary survey based on lot size, terrain, and survey type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["property survey cost", "land survey cost", "boundary survey estimate"],
  variants: [{
    id: "standard",
    name: "Property Line Survey",
    description: "Estimate the cost of a property line or boundary survey based on lot size, terrain, and survey type",
    fields: [
      { name: "lotSize", label: "Lot Size", type: "number", suffix: "acres", min: 0.1, max: 500, step: 0.1, defaultValue: 1 },
      { name: "surveyType", label: "Survey Type", type: "select", options: [{value:"boundary",label:"Boundary Survey"},{value:"topographic",label:"Topographic Survey"},{value:"alta",label:"ALTA/NSPS Survey"},{value:"subdivision",label:"Subdivision Plat"}], defaultValue: "boundary" },
      { name: "terrain", label: "Terrain Difficulty", type: "select", options: [{value:"easy",label:"Flat, Clear Access"},{value:"moderate",label:"Some Slopes or Vegetation"},{value:"difficult",label:"Steep, Dense Vegetation"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const lotSize = inputs.lotSize as number;
      const surveyType = inputs.surveyType as string;
      const terrain = inputs.terrain as string;
      if (!lotSize || lotSize <= 0) return null;
      const baseCost: Record<string, number> = { boundary: 400, topographic: 800, alta: 2000, subdivision: 3000 };
      const perAcreCost: Record<string, number> = { boundary: 100, topographic: 200, alta: 300, subdivision: 500 };
      const terrainMod: Record<string, number> = { easy: 1.0, moderate: 1.25, difficult: 1.6 };
      const cost = ((baseCost[surveyType] || 400) + lotSize * (perAcreCost[surveyType] || 100)) * (terrainMod[terrain] || 1.25);
      const timeEstimate = surveyType === "alta" || surveyType === "subdivision" ? "2-4 weeks" : "1-2 weeks";
      return {
        primary: { label: "Estimated Survey Cost", value: "$" + formatNumber(Math.round(cost)) },
        details: [
          { label: "Survey Type", value: surveyType === "alta" ? "ALTA/NSPS" : surveyType.charAt(0).toUpperCase() + surveyType.slice(1) },
          { label: "Lot Size", value: formatNumber(lotSize) + " acres" },
          { label: "Estimated Turnaround", value: timeEstimate },
        ],
      };
    },
  }],
  relatedSlugs: ["home-appraisal-cost-calculator", "title-insurance-calculator"],
  faq: [
    { question: "How much does a property survey cost?", answer: "A basic boundary survey for a standard residential lot typically costs $300 to $800. Larger lots, ALTA surveys, and difficult terrain can increase the cost to $2,000 or more." },
    { question: "When do you need a property survey?", answer: "Property surveys are commonly needed when buying or selling land, resolving boundary disputes, building a fence or structure near a property line, or subdividing land." },
  ],
  formula: "Survey Cost = (Base Fee + Lot Size x Per Acre Rate) x Terrain Modifier",
};
