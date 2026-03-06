import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enzymeUnitConversionCalculator: CalculatorDefinition = {
  slug: "enzyme-unit-conversion-calculator",
  title: "Enzyme Unit Conversion Calculator",
  description: "Convert between enzyme activity units including International Units (IU), katal, specific activity, and volumetric activity for biochemistry experiments.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["enzyme unit conversion","international unit katal","specific activity enzyme","enzyme activity calculator","iu to katal"],
  variants: [{
    id: "standard",
    name: "Enzyme Unit Conversion",
    description: "Convert between enzyme activity units including International Units (IU), katal, specific activity, and volumetric activity for biochemistry experiments.",
    fields: [
      { name: "activityValue", label: "Enzyme Activity Value", type: "number", min: 0.0001, max: 1e10, defaultValue: 500 },
      { name: "unitFrom", label: "Input Unit", type: "select", options: [{ value: "1", label: "IU (umol/min)" }, { value: "2", label: "nkat (nmol/s)" }, { value: "3", label: "ukat (umol/s)" }], defaultValue: "1" },
      { name: "proteinMass", label: "Total Protein (mg)", type: "number", min: 0.001, max: 100000, defaultValue: 10 },
      { name: "volume", label: "Solution Volume (mL)", type: "number", min: 0.01, max: 10000, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const activityValue = inputs.activityValue as number;
    const unitFrom = inputs.unitFrom as number;
    const proteinMass = inputs.proteinMass as number;
    const volume = inputs.volume as number;
    var iu = activityValue;
    if (unitFrom === 2) { iu = activityValue * 0.06; }
    if (unitFrom === 3) { iu = activityValue * 60; }
    const nkat = iu / 0.06;
    const ukat = iu / 60;
    const specificActivity = iu / proteinMass;
    const volumetricActivity = iu / volume;
    return {
      primary: { label: "Activity (IU)", value: formatNumber(Math.round(iu * 1000) / 1000) + " IU" },
      details: [
        { label: "Activity (nkat)", value: formatNumber(Math.round(nkat * 1000) / 1000) },
        { label: "Activity (ukat)", value: formatNumber(Math.round(ukat * 10000) / 10000) },
        { label: "Specific Activity", value: formatNumber(Math.round(specificActivity * 100) / 100) + " IU/mg" },
        { label: "Volumetric Activity", value: formatNumber(Math.round(volumetricActivity * 100) / 100) + " IU/mL" }
      ]
    };
  },
  }],
  relatedSlugs: ["bradford-assay-protein-calculator","molarity-calculator","spectrophotometer-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "1 IU = 1 umol/min = 16.67 nkat; 1 ukat = 1 umol/s = 60 IU; Specific Activity = Total Activity / Total Protein; Volumetric Activity = Total Activity / Volume",
};
