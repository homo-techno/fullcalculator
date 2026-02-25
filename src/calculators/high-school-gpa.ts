import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const highSchoolGpaCalculator: CalculatorDefinition = {
  slug: "high-school-gpa-calculator",
  title: "High School GPA Calculator",
  description:
    "Free high school GPA calculator. Calculate your unweighted and weighted high school GPA for college applications.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "high school gpa calculator",
    "unweighted gpa",
    "high school grades",
    "college application gpa",
    "secondary school gpa",
  ],
  variants: [
    {
      id: "unweighted",
      name: "Unweighted GPA",
      description: "Calculate standard unweighted GPA on a 4.0 scale for up to 6 classes",
      fields: [
        { name: "grade1", label: "Class 1 Grade (0-4)", type: "number", placeholder: "e.g. 4.0", min: 0, max: 4, step: 0.1 },
        { name: "grade2", label: "Class 2 Grade (0-4)", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.1 },
        { name: "grade3", label: "Class 3 Grade (0-4)", type: "number", placeholder: "e.g. 3.3", min: 0, max: 4, step: 0.1 },
        { name: "grade4", label: "Class 4 Grade (0-4)", type: "number", placeholder: "e.g. 3.0", min: 0, max: 4, step: 0.1 },
        { name: "grade5", label: "Class 5 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "grade6", label: "Class 6 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
      ],
      calculate: (inputs) => {
        let total = 0;
        let count = 0;

        for (let i = 1; i <= 6; i++) {
          const grade = inputs[`grade${i}`] as number;
          if (grade !== undefined && grade >= 0) {
            total += grade;
            count++;
          }
        }

        if (count === 0) return null;

        const gpa = total / count;
        let assessment: string;
        if (gpa >= 3.8) assessment = "Excellent - Competitive for top colleges";
        else if (gpa >= 3.5) assessment = "Very Good - Strong college applications";
        else if (gpa >= 3.0) assessment = "Good - Meets most college requirements";
        else if (gpa >= 2.5) assessment = "Average";
        else assessment = "Below average";

        return {
          primary: { label: "Unweighted GPA", value: formatNumber(gpa, 2) },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Number of classes", value: formatNumber(count, 0) },
            { label: "Total grade points", value: formatNumber(total, 1) },
          ],
        };
      },
    },
    {
      id: "cumulative",
      name: "Cumulative HS GPA",
      description: "Combine multiple years of high school grades",
      fields: [
        { name: "freshmanGPA", label: "Freshman Year GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "freshmanClasses", label: "Freshman Classes Count", type: "number", placeholder: "e.g. 7", min: 1, max: 10 },
        { name: "sophomoreGPA", label: "Sophomore Year GPA", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.01 },
        { name: "sophomoreClasses", label: "Sophomore Classes Count", type: "number", placeholder: "e.g. 7", min: 1, max: 10 },
        { name: "juniorGPA", label: "Junior Year GPA", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.01 },
        { name: "juniorClasses", label: "Junior Classes Count", type: "number", placeholder: "optional", min: 1, max: 10 },
        { name: "seniorGPA", label: "Senior Year GPA", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.01 },
        { name: "seniorClasses", label: "Senior Classes Count", type: "number", placeholder: "optional", min: 1, max: 10 },
      ],
      calculate: (inputs) => {
        const years = ["freshman", "sophomore", "junior", "senior"];
        let totalPoints = 0;
        let totalClasses = 0;

        for (const year of years) {
          const gpa = inputs[`${year}GPA`] as number;
          const classes = inputs[`${year}Classes`] as number;
          if (gpa !== undefined && gpa >= 0 && classes && classes > 0) {
            totalPoints += gpa * classes;
            totalClasses += classes;
          }
        }

        if (totalClasses === 0) return null;

        const cumGPA = totalPoints / totalClasses;

        return {
          primary: { label: "Cumulative HS GPA", value: formatNumber(cumGPA, 2) },
          details: [
            { label: "Total classes counted", value: formatNumber(totalClasses, 0) },
            { label: "Total grade points", value: formatNumber(totalPoints, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "college-gpa-calculator"],
  faq: [
    {
      question: "What GPA do I need for college?",
      answer:
        "Most 4-year colleges require a minimum 2.5 GPA. Competitive schools typically expect 3.5+, and Ivy League schools often expect 3.9+.",
    },
    {
      question: "Do colleges look at unweighted or weighted GPA?",
      answer:
        "Most colleges consider both. Unweighted GPA shows consistent performance, while weighted GPA reflects the rigor of your course load.",
    },
  ],
  formula: "Unweighted GPA = Sum(Grade Points) / Number of Classes",
};
