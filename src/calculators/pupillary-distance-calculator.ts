import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pupillaryDistanceCalculator: CalculatorDefinition = {
  slug: "pupillary-distance-calculator",
  title: "Pupillary Distance Calculator",
  description: "Estimate pupillary distance from frame measurements and fit.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pupillary distance measurement","PD calculator glasses","interpupillary distance"],
  variants: [{
    id: "standard",
    name: "Pupillary Distance",
    description: "Estimate pupillary distance from frame measurements and fit.",
    fields: [
      { name: "rightPD", label: "Right Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 31 },
      { name: "leftPD", label: "Left Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 32 },
      { name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "1", label: "Child (4-12)" }, { value: "2", label: "Teen (13-17)" }, { value: "3", label: "Adult (18+)" }] },
    ],
    calculate: (inputs) => {
    const rightPD = inputs.rightPD as number;
    const leftPD = inputs.leftPD as number;
    const ageGroup = inputs.ageGroup as string;
    const totalPD = rightPD + leftPD;
    const ranges: Record<string, number[]> = { "1": [43, 54], "2": [54, 62], "3": [57, 72] };
    const range = ranges[ageGroup] || [57, 72];
    let status = "Within Normal Range";
    if (totalPD < range[0]) status = "Below Normal Range";
    else if (totalPD > range[1]) status = "Above Normal Range";
    const groupNames: Record<string, string> = { "1": "Child", "2": "Teen", "3": "Adult" };
    return {
      primary: { label: "Total PD", value: totalPD + " mm" },
      details: [
        { label: "Right Eye PD", value: rightPD + " mm" },
        { label: "Left Eye PD", value: leftPD + " mm" },
        { label: "Normal Range", value: range[0] + " - " + range[1] + " mm" },
        { label: "Status", value: status },
        { label: "Age Group", value: groupNames[ageGroup] || "Adult" }
      ]
    };
  },
  }],
  relatedSlugs: ["eyeglass-prescription-calculator","reading-glasses-strength-calculator","contact-lens-cost-calculator"],
  faq: [
    { question: "What is pupillary distance used for?", answer: "PD is used to align the optical center of lenses with your pupils for clear vision." },
    { question: "What is the average adult PD?", answer: "The average adult PD ranges from 57 to 65 mm, with 63 mm being common." },
    { question: "Can I measure my own PD?", answer: "Yes, you can use a ruler and mirror or a smartphone app to measure your PD at home." },
  ],
  formula: "Total PD = Right Eye PD + Left Eye PD",
};
