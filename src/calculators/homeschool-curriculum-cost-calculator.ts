import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeschoolCurriculumCostCalculator: CalculatorDefinition = {
  slug: "homeschool-curriculum-cost-calculator",
  title: "Homeschool Curriculum Cost Calculator",
  description: "Estimate the total cost of homeschool materials and resources per year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["homeschool","curriculum","cost","materials","education"],
  variants: [{
    id: "standard",
    name: "Homeschool Curriculum Cost",
    description: "Estimate the total cost of homeschool materials and resources per year.",
    fields: [
      { name: "textbooks", label: "Textbooks and Workbooks ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 400 },
      { name: "onlinePrograms", label: "Online Programs ($)", type: "number", min: 0, max: 1500, step: 25, defaultValue: 200 },
      { name: "supplies", label: "Art and Science Supplies ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 150 },
      { name: "fieldTrips", label: "Field Trips and Activities ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 200 },
      { name: "numStudents", label: "Number of Students", type: "number", min: 1, max: 8, step: 1, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const textbooks = inputs.textbooks as number;
    const onlinePrograms = inputs.onlinePrograms as number;
    const supplies = inputs.supplies as number;
    const fieldTrips = inputs.fieldTrips as number;
    const numStudents = inputs.numStudents as number;
    const perStudentCost = textbooks + onlinePrograms + supplies + fieldTrips;
    const totalCost = perStudentCost * numStudents;
    const monthlyCost = totalCost / 12;
    return {
      primary: { label: "Annual Total", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Per Student Cost", value: "$" + formatNumber(perStudentCost) },
        { label: "Textbooks and Workbooks", value: "$" + formatNumber(textbooks * numStudents) },
        { label: "Online Programs", value: "$" + formatNumber(onlinePrograms * numStudents) },
        { label: "Monthly Average", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["tutoring-cost-calculator","school-supply-list-calculator","school-lunch-cost-calculator"],
  faq: [
    { question: "How much does homeschooling cost per year?", answer: "Homeschool curriculum costs typically range from $500 to $2,500 per student per year." },
    { question: "Are homeschool expenses tax deductible?", answer: "Most states do not offer tax deductions for homeschool expenses but some offer credits." },
  ],
  formula: "Annual Total = (Textbooks + Online Programs + Supplies + Field Trips) x Students",
};
