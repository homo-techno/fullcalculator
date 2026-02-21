import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const attendanceRateCalculator: CalculatorDefinition = {
  slug: "attendance-rate-calculator",
  title: "Attendance Rate Calculator",
  description:
    "Free attendance rate calculator. Calculate your attendance percentage, see how many classes you can miss, and check if you meet minimum requirements.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "attendance rate calculator",
    "attendance percentage calculator",
    "how many classes can I miss",
    "absence calculator",
    "attendance tracker",
  ],
  variants: [
    {
      id: "rate",
      name: "Calculate Attendance Rate",
      description: "Find your attendance percentage based on classes attended and total classes",
      fields: [
        { name: "attended", label: "Classes Attended", type: "number", placeholder: "e.g. 42" },
        { name: "total", label: "Total Classes Held", type: "number", placeholder: "e.g. 45" },
      ],
      calculate: (inputs) => {
        const attended = inputs.attended as number;
        const total = inputs.total as number;
        if (attended === undefined || !total || total <= 0) return null;

        const rate = (attended / total) * 100;
        const absences = total - attended;
        const absenceRate = (absences / total) * 100;

        let status: string;
        if (rate >= 95) status = "Excellent attendance";
        else if (rate >= 90) status = "Good attendance";
        else if (rate >= 85) status = "Acceptable (borderline)";
        else if (rate >= 80) status = "At risk - may affect grade";
        else if (rate >= 75) status = "Warning - excessive absences";
        else status = "Critical - may fail due to absences";

        // Many schools have 75% or 80% minimum
        const meetsMin75 = rate >= 75;
        const meetsMin80 = rate >= 80;

        return {
          primary: { label: "Attendance Rate", value: `${formatNumber(rate, 1)}%` },
          details: [
            { label: "Classes attended", value: `${formatNumber(attended, 0)} / ${formatNumber(total, 0)}` },
            { label: "Absences", value: formatNumber(absences, 0) },
            { label: "Absence rate", value: `${formatNumber(absenceRate, 1)}%` },
            { label: "Status", value: status },
            { label: "Meets 75% minimum", value: meetsMin75 ? "Yes" : "No" },
            { label: "Meets 80% minimum", value: meetsMin80 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "missable",
      name: "How Many Classes Can I Miss?",
      description: "Find out how many more classes you can miss while staying above a minimum threshold",
      fields: [
        { name: "totalClasses", label: "Total Classes in Semester", type: "number", placeholder: "e.g. 45" },
        { name: "classesSoFar", label: "Classes Held So Far", type: "number", placeholder: "e.g. 30" },
        { name: "absencesSoFar", label: "Absences So Far", type: "number", placeholder: "e.g. 3" },
        {
          name: "minAttendance",
          label: "Minimum Attendance Required",
          type: "select",
          options: [
            { label: "75% minimum", value: "75" },
            { label: "80% minimum", value: "80" },
            { label: "85% minimum", value: "85" },
            { label: "90% minimum", value: "90" },
          ],
        },
      ],
      calculate: (inputs) => {
        const totalClasses = inputs.totalClasses as number;
        const classesSoFar = inputs.classesSoFar as number;
        const absencesSoFar = (inputs.absencesSoFar as number) || 0;
        const minAttendance = parseInt(inputs.minAttendance as string, 10);
        if (!totalClasses || !classesSoFar || !minAttendance) return null;

        const attendedSoFar = classesSoFar - absencesSoFar;
        const remainingClasses = totalClasses - classesSoFar;
        const currentRate = (attendedSoFar / classesSoFar) * 100;

        // How many can be missed total: minAttendance% of totalClasses must be attended
        const minAttended = Math.ceil(totalClasses * (minAttendance / 100));
        const maxAbsencesTotal = totalClasses - minAttended;
        const absencesRemaining = Math.max(0, maxAbsencesTotal - absencesSoFar);

        return {
          primary: { label: "Additional Absences Allowed", value: formatNumber(absencesRemaining, 0) },
          details: [
            { label: "Current attendance rate", value: `${formatNumber(currentRate, 1)}%` },
            { label: "Absences so far", value: formatNumber(absencesSoFar, 0) },
            { label: "Classes remaining", value: formatNumber(remainingClasses, 0) },
            { label: "Minimum attendance", value: `${minAttendance}%` },
            { label: "Max total absences allowed", value: formatNumber(maxAbsencesTotal, 0) },
            { label: "Must attend at least", value: `${formatNumber(minAttended, 0)} classes` },
          ],
          note: absencesRemaining === 0 ? "You cannot miss any more classes without falling below the minimum. Attend all remaining sessions." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["grade-calculator", "semester-hours-calculator", "test-score-calculator"],
  faq: [
    {
      question: "How is attendance rate calculated?",
      answer:
        "Attendance Rate = (Classes Attended / Total Classes) x 100. If you attended 42 out of 45 classes, your attendance rate is (42/45) x 100 = 93.3%.",
    },
    {
      question: "What is the minimum attendance requirement?",
      answer:
        "Most schools and colleges require 75-80% attendance. Some institutions or specific courses may require 85-90%. Falling below the minimum can result in grade penalties, failing the course, or being debarred from exams.",
    },
    {
      question: "Does attendance affect grades?",
      answer:
        "Research consistently shows that higher attendance correlates with better grades. Many courses also have direct attendance policies where missing too many classes results in grade deductions or course failure.",
    },
  ],
  formula: "Attendance Rate = (Classes Attended / Total Classes) x 100",
};
