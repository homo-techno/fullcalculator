import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldOreGradeValueCalculator: CalculatorDefinition = {
  slug: "gold-ore-grade-value-calculator",
  title: "Gold Ore Grade Value Calculator",
  description: "Calculate the value of gold ore based on grade (grams per tonne), tonnage, gold price, and estimated recovery rate from processing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gold ore grade","ore value","gold mining value","ore grade calculator","gold recovery"],
  variants: [{
    id: "standard",
    name: "Gold Ore Grade Value",
    description: "Calculate the value of gold ore based on grade (grams per tonne), tonnage, gold price, and estimated recovery rate from processing.",
    fields: [
      { name: "oreGrade", label: "Ore Grade (g/tonne)", type: "number", min: 0.1, max: 500, defaultValue: 5 },
      { name: "tonnage", label: "Ore Tonnage (tonnes)", type: "number", min: 1, max: 10000000, defaultValue: 10000 },
      { name: "goldPrice", label: "Gold Price ($/oz)", type: "number", min: 500, max: 5000, defaultValue: 2000 },
      { name: "recoveryRate", label: "Recovery Rate (%)", type: "number", min: 50, max: 99, defaultValue: 90 },
      { name: "processingCost", label: "Processing Cost ($/tonne)", type: "number", min: 5, max: 200, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const grade = inputs.oreGrade as number;
    const tonnes = inputs.tonnage as number;
    const price = inputs.goldPrice as number;
    const recovery = inputs.recoveryRate as number / 100;
    const procCost = inputs.processingCost as number;
    const goldGrams = grade * tonnes;
    const recoveredGrams = goldGrams * recovery;
    const troyOz = recoveredGrams / 31.1035;
    const grossValue = troyOz * price;
    const totalProcessing = procCost * tonnes;
    const netValue = grossValue - totalProcessing;
    const valuePerTonne = tonnes > 0 ? netValue / tonnes : 0;
    const breakEvenGrade = (procCost * 31.1035) / (price * recovery);
    return {
      primary: { label: "Net Ore Value", value: "$" + formatNumber(Math.round(netValue)) },
      details: [
        { label: "Gross Gold Value", value: "$" + formatNumber(Math.round(grossValue)) },
        { label: "Recovered Gold", value: formatNumber(parseFloat(troyOz.toFixed(2))) + " troy oz" },
        { label: "Total Processing Cost", value: "$" + formatNumber(Math.round(totalProcessing)) },
        { label: "Net Value Per Tonne", value: "$" + formatNumber(parseFloat(valuePerTonne.toFixed(2))) },
        { label: "Break-Even Grade", value: formatNumber(parseFloat(breakEvenGrade.toFixed(2))) + " g/t" }
      ]
    };
  },
  }],
  relatedSlugs: ["mining-equipment-cost-per-ton-calculator","gemstone-carat-to-mm-calculator","coal-heating-value-calculator"],
  faq: [
    { question: "What is a good gold ore grade?", answer: "A grade of 5 to 10 grams per tonne is considered good for open-pit mining. Underground mines typically need 8+ g/t to be profitable. Some high-grade deposits exceed 30 g/t." },
    { question: "What is the recovery rate?", answer: "Recovery rate is the percentage of gold successfully extracted from ore during processing. Modern cyanide leaching achieves 85-95% recovery. Gravity methods recover 50-70% depending on ore characteristics." },
    { question: "What does break-even grade mean?", answer: "Break-even grade is the minimum ore grade needed for the gold recovered to cover processing costs. Below this grade, mining the ore results in a financial loss." },
  ],
  formula: "Total Gold = Grade x Tonnage
Recovered Gold = Total Gold x Recovery Rate
Troy Ounces = Recovered Grams / 31.1035
Net Value = (Troy Oz x Price) - (Tonnage x Processing Cost)
Break-Even Grade = (Processing Cost x 31.1035) / (Price x Recovery)",
};
