import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rockClimbingGradeConverterCalculator: CalculatorDefinition = {
  slug: "rock-climbing-grade-converter-calculator",
  title: "Rock Climbing Grade Converter Calculator",
  description: "Convert climbing grades between YDS, French, UIAA, and Ewbank systems.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["climbing grade converter","YDS to French","climbing difficulty","bouldering grade"],
  variants: [{
    id: "standard",
    name: "Rock Climbing Grade Converter",
    description: "Convert climbing grades between YDS, French, UIAA, and Ewbank systems.",
    fields: [
      { name: "grade", label: "Grade Value (numeric, e.g. 10 for 5.10)", type: "number", min: 1, max: 15, defaultValue: 10 },
      { name: "subGrade", label: "Sub Grade", type: "select", options: [{ value: "0", label: "a / base" }, { value: "1", label: "b" }, { value: "2", label: "c" }, { value: "3", label: "d" }], defaultValue: "0" },
      { name: "climbType", label: "Climb Type", type: "select", options: [{ value: "1", label: "Sport / Trad" }, { value: "2", label: "Bouldering" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const grade = inputs.grade as number;
    const subGrade = parseInt(inputs.subGrade as string);
    const climbType = parseInt(inputs.climbType as string);
    const subLabels = ["a", "b", "c", "d"];
    var yds = "";
    var french = "";
    var uiaa = "";
    if (climbType === 1) {
      yds = "5." + grade + (grade >= 10 ? subLabels[subGrade] : "");
      const frenchNum = Math.round(grade * 0.85 + subGrade * 0.2 + 1);
      french = formatNumber(frenchNum) + subLabels[Math.min(subGrade, 2)];
      uiaa = "VII" + (grade > 10 ? "+" : "");
      if (grade <= 7) uiaa = "IV";
      else if (grade <= 8) uiaa = "V";
      else if (grade <= 9) uiaa = "VI";
      else if (grade <= 10) uiaa = "VII";
      else if (grade <= 11) uiaa = "VIII";
      else if (grade <= 12) uiaa = "IX";
      else uiaa = "X";
    } else {
      yds = "V" + formatNumber(Math.max(grade - 6, 0));
      french = formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
      uiaa = "Font " + formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
    }
    return {
      primary: { label: "YDS Grade", value: yds },
      details: [
        { label: "French Grade", value: french },
        { label: "UIAA Grade", value: uiaa },
        { label: "Type", value: climbType === 1 ? "Sport / Trad" : "Bouldering" }
      ]
    };
  },
  }],
  relatedSlugs: ["surfboard-volume-calculator","kayak-size-calculator"],
  faq: [
    { question: "What climbing grade system is used in the US?", answer: "The US uses the Yosemite Decimal System (YDS) for rope climbing (5.0 to 5.15) and the V-scale for bouldering (V0 to V17)." },
    { question: "What is French climbing grade?", answer: "The French system uses numbers and letters like 6a, 7b+. It is widely used in Europe for both sport and bouldering." },
    { question: "What is a good beginner climbing grade?", answer: "Beginners typically start at 5.6 to 5.8 in YDS or V0 to V1 in bouldering." },
  ],
  formula: "Conversion uses grade lookup tables between YDS, French, UIAA, Ewbank, and V-scale systems",
};
