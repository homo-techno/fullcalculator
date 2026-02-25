import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightedGpaCalcCalculator: CalculatorDefinition = {
  slug: "weighted-gpa-calculator",
  title: "Weighted GPA Calculator",
  description:
    "Free weighted GPA calculator. Calculate your weighted GPA with honors, AP, and IB course bonuses on a 5.0 scale.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "weighted gpa calculator",
    "ap gpa calculator",
    "honors gpa",
    "ib gpa calculator",
    "weighted grade point average",
  ],
  variants: [
    {
      id: "weighted",
      name: "Weighted GPA",
      description: "Enter each course grade (0-4 scale) and level: Regular (+0), Honors (+0.5), AP/IB (+1.0)",
      fields: [
        { name: "grade1", label: "Course 1 Grade (0-4)", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.1 },
        { name: "level1", label: "Course 1 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
        { name: "grade2", label: "Course 2 Grade (0-4)", type: "number", placeholder: "e.g. 4.0", min: 0, max: 4, step: 0.1 },
        { name: "level2", label: "Course 2 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
        { name: "grade3", label: "Course 3 Grade (0-4)", type: "number", placeholder: "e.g. 3.3", min: 0, max: 4, step: 0.1 },
        { name: "level3", label: "Course 3 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
        { name: "grade4", label: "Course 4 Grade (0-4)", type: "number", placeholder: "e.g. 3.0", min: 0, max: 4, step: 0.1 },
        { name: "level4", label: "Course 4 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
        { name: "grade5", label: "Course 5 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "level5", label: "Course 5 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
        { name: "grade6", label: "Course 6 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "level6", label: "Course 6 Level", type: "select", options: [{ label: "Regular", value: "0" }, { label: "Honors (+0.5)", value: "0.5" }, { label: "AP/IB (+1.0)", value: "1" }], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        let weightedTotal = 0;
        let unweightedTotal = 0;
        let count = 0;

        for (let i = 1; i <= 6; i++) {
          const grade = inputs[`grade${i}`] as number;
          const level = parseFloat(inputs[`level${i}`] as string || "0");
          if (grade !== undefined && grade >= 0) {
            weightedTotal += grade + level;
            unweightedTotal += grade;
            count++;
          }
        }

        if (count === 0) return null;

        const weightedGPA = weightedTotal / count;
        const unweightedGPA = unweightedTotal / count;

        return {
          primary: { label: "Weighted GPA", value: formatNumber(weightedGPA, 2) },
          details: [
            { label: "Unweighted GPA", value: formatNumber(unweightedGPA, 2) },
            { label: "GPA boost from weighting", value: `+${formatNumber(weightedGPA - unweightedGPA, 2)}` },
            { label: "Number of courses", value: formatNumber(count, 0) },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Target Weighted GPA",
      description: "Calculate what grades you need to reach a target weighted GPA",
      fields: [
        { name: "currentWeightedGPA", label: "Current Weighted GPA", type: "number", placeholder: "e.g. 4.2", min: 0, max: 5, step: 0.01 },
        { name: "classesTaken", label: "Classes Completed", type: "number", placeholder: "e.g. 20", min: 1 },
        { name: "targetGPA", label: "Target Weighted GPA", type: "number", placeholder: "e.g. 4.5", min: 0, max: 5, step: 0.01 },
        { name: "remainingClasses", label: "Remaining Classes", type: "number", placeholder: "e.g. 8", min: 1 },
      ],
      calculate: (inputs) => {
        const curGPA = inputs.currentWeightedGPA as number;
        const taken = inputs.classesTaken as number;
        const target = inputs.targetGPA as number;
        const remaining = inputs.remainingClasses as number;
        if (curGPA === undefined || !taken || target === undefined || !remaining) return null;

        const totalNeeded = target * (taken + remaining);
        const currentTotal = curGPA * taken;
        const neededPerClass = (totalNeeded - currentTotal) / remaining;

        const feasible = neededPerClass <= 5.0;

        return {
          primary: { label: "Needed GPA per Class", value: formatNumber(neededPerClass, 2) },
          details: [
            { label: "Feasible?", value: feasible ? "Yes" : "No (exceeds 5.0 max)" },
            { label: "Current total points", value: formatNumber(currentTotal, 1) },
            { label: "Total points needed", value: formatNumber(totalNeeded, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "high-school-gpa-calculator"],
  faq: [
    {
      question: "What is a weighted GPA?",
      answer:
        "A weighted GPA adds extra points for advanced courses. Typically, Honors courses add 0.5 and AP/IB courses add 1.0 to the standard 4.0 scale, making a 5.0 the maximum.",
    },
    {
      question: "Do all schools use the same weighting system?",
      answer:
        "No. Some schools use a 5.0 scale, others use a 6.0 scale, and some have different bonus amounts. Check with your school for their specific weighting policy.",
    },
  ],
  formula: "Weighted GPA = Sum(Base Grade + Level Bonus) / Number of Classes",
};
