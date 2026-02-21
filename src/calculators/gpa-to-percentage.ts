import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gpaToPercentageCalculator: CalculatorDefinition = {
  slug: "gpa-to-percentage-calculator",
  title: "GPA to Percentage Converter",
  description:
    "Free GPA to percentage converter. Convert your 4.0 scale GPA to a percentage, and see the equivalent letter grade and international grade equivalents.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "gpa to percentage",
    "gpa to percent converter",
    "4.0 to percentage",
    "gpa conversion chart",
    "convert gpa to percentage",
  ],
  variants: [
    {
      id: "gpaToPercent",
      name: "GPA to Percentage",
      description: "Convert a GPA on the 4.0 scale to an approximate percentage",
      fields: [
        { name: "gpa", label: "GPA (0-4.0 scale)", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
      ],
      calculate: (inputs) => {
        const gpa = inputs.gpa as number;
        if (gpa === undefined || gpa < 0) return null;

        // Linear conversion: percentage = (GPA / 4.0) * 100 is too simplistic
        // Better approximation based on standard grade scales
        let percentage: number;
        let letterGrade: string;

        if (gpa >= 4.0) { percentage = 96.5; letterGrade = "A / A+"; }
        else if (gpa >= 3.7) { percentage = 91.5; letterGrade = "A-"; }
        else if (gpa >= 3.3) { percentage = 88; letterGrade = "B+"; }
        else if (gpa >= 3.0) { percentage = 84.5; letterGrade = "B"; }
        else if (gpa >= 2.7) { percentage = 81; letterGrade = "B-"; }
        else if (gpa >= 2.3) { percentage = 78; letterGrade = "C+"; }
        else if (gpa >= 2.0) { percentage = 74.5; letterGrade = "C"; }
        else if (gpa >= 1.7) { percentage = 71; letterGrade = "C-"; }
        else if (gpa >= 1.3) { percentage = 68; letterGrade = "D+"; }
        else if (gpa >= 1.0) { percentage = 64.5; letterGrade = "D"; }
        else if (gpa >= 0.7) { percentage = 61; letterGrade = "D-"; }
        else { percentage = Math.max(0, gpa * 15); letterGrade = "F"; }

        // Interpolation for smoother results
        const gpaBreakpoints = [0, 0.7, 1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];
        const pctBreakpoints = [0, 61, 64.5, 68, 71, 74.5, 78, 81, 84.5, 88, 91.5, 96.5];

        for (let i = 0; i < gpaBreakpoints.length - 1; i++) {
          if (gpa >= gpaBreakpoints[i] && gpa < gpaBreakpoints[i + 1]) {
            const ratio = (gpa - gpaBreakpoints[i]) / (gpaBreakpoints[i + 1] - gpaBreakpoints[i]);
            percentage = pctBreakpoints[i] + ratio * (pctBreakpoints[i + 1] - pctBreakpoints[i]);
            break;
          }
        }

        // International equivalents (approximate)
        let ukClass: string;
        if (percentage >= 70) ukClass = "First Class Honours";
        else if (percentage >= 60) ukClass = "Upper Second (2:1)";
        else if (percentage >= 50) ukClass = "Lower Second (2:2)";
        else if (percentage >= 40) ukClass = "Third Class";
        else ukClass = "Fail";

        let indianPercent: string;
        if (gpa >= 3.7) indianPercent = "75-100% (First Division with Distinction)";
        else if (gpa >= 3.0) indianPercent = "60-74% (First Division)";
        else if (gpa >= 2.0) indianPercent = "50-59% (Second Division)";
        else if (gpa >= 1.0) indianPercent = "40-49% (Third Division)";
        else indianPercent = "Below 40% (Fail)";

        return {
          primary: { label: "Percentage Equivalent", value: `${formatNumber(percentage, 1)}%` },
          details: [
            { label: "GPA", value: formatNumber(gpa, 2) },
            { label: "Letter grade", value: letterGrade },
            { label: "UK equivalent", value: ukClass },
            { label: "Indian equivalent", value: indianPercent },
            { label: "On 4.0 scale", value: `${formatNumber(gpa, 2)} / 4.0` },
            { label: "Percentile (approx.)", value: `${formatNumber(Math.min(99, gpa * 25), 0)}th` },
          ],
        };
      },
    },
    {
      id: "percentToGpa",
      name: "Percentage to GPA",
      description: "Convert a percentage grade to GPA on the 4.0 scale",
      fields: [
        { name: "percentage", label: "Percentage (%)", type: "number", placeholder: "e.g. 88", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const pct = inputs.percentage as number;
        if (pct === undefined || pct < 0) return null;

        let gpa: number;
        let letter: string;

        if (pct >= 93) { gpa = 4.0; letter = "A"; }
        else if (pct >= 90) { gpa = 3.7; letter = "A-"; }
        else if (pct >= 87) { gpa = 3.3; letter = "B+"; }
        else if (pct >= 83) { gpa = 3.0; letter = "B"; }
        else if (pct >= 80) { gpa = 2.7; letter = "B-"; }
        else if (pct >= 77) { gpa = 2.3; letter = "C+"; }
        else if (pct >= 73) { gpa = 2.0; letter = "C"; }
        else if (pct >= 70) { gpa = 1.7; letter = "C-"; }
        else if (pct >= 67) { gpa = 1.3; letter = "D+"; }
        else if (pct >= 63) { gpa = 1.0; letter = "D"; }
        else if (pct >= 60) { gpa = 0.7; letter = "D-"; }
        else { gpa = 0.0; letter = "F"; }

        // Interpolate within ranges for smoother results
        const pctBreakpoints = [0, 60, 63, 67, 70, 73, 77, 80, 83, 87, 90, 93, 100];
        const gpaBreakpoints = [0, 0.7, 1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 4.0];

        for (let i = 0; i < pctBreakpoints.length - 1; i++) {
          if (pct >= pctBreakpoints[i] && pct < pctBreakpoints[i + 1]) {
            const ratio = (pct - pctBreakpoints[i]) / (pctBreakpoints[i + 1] - pctBreakpoints[i]);
            gpa = gpaBreakpoints[i] + ratio * (gpaBreakpoints[i + 1] - gpaBreakpoints[i]);
            break;
          }
        }

        return {
          primary: { label: "GPA Equivalent", value: formatNumber(gpa, 2) },
          details: [
            { label: "Percentage", value: `${formatNumber(pct, 1)}%` },
            { label: "Letter grade", value: letter },
            { label: "On 4.0 scale", value: formatNumber(gpa, 2) },
            { label: "On 5.0 weighted scale", value: formatNumber(gpa + 1.0, 2) },
            { label: "Passing", value: pct >= 60 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "letter-grade-calculator", "cumulative-gpa-calculator"],
  faq: [
    {
      question: "How do you convert GPA to percentage?",
      answer:
        "There is no single universal conversion. A common approximation: A (4.0) = 93-96%, A- (3.7) = 90-92%, B+ (3.3) = 87-89%, B (3.0) = 83-86%, B- (2.7) = 80-82%, C (2.0) = 73-76%, D (1.0) = 63-66%. Each school may use slightly different scales.",
    },
    {
      question: "Is a 3.5 GPA good?",
      answer:
        "A 3.5 GPA (roughly 88%) is considered very good. It falls between a B+ and A- and typically qualifies for Dean's List at most universities. It is competitive for many graduate programs.",
    },
    {
      question: "How does the US GPA system compare to other countries?",
      answer:
        "The US 4.0 scale differs from other systems. In the UK, 70%+ is a First Class Honours. In India, 60%+ is First Division. In Germany, 1.0 is the best grade. Conversion between systems is approximate and varies by institution.",
    },
  ],
  formula: "Approximate: Percentage = GPA-based grade range midpoint (e.g., 3.0 GPA ~ 84.5%)",
};
