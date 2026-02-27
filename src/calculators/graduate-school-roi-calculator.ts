import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const graduateSchoolRoiCalculator: CalculatorDefinition = {
  slug: "graduate-school-roi-calculator",
  title: "Graduate School Roi Calculator",
  description: "Free graduate school roi calculator. Academic planning and education cost tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["graduate school roi calculator", "education calculator", "student tool"],
  variants: [{
    id: "standard",
    name: "Graduate School Roi",
    description: "",
    fields: [
      { name: "credits", label: "Credit Hours", type: "number", placeholder: "e.g. 15", min: 1, max: 30 },
      { name: "costPerCredit", label: "Cost per Credit", type: "number", placeholder: "e.g. 500", prefix: "$", min: 0 },
      { name: "semesters", label: "Semesters", type: "number", placeholder: "e.g. 8", min: 1, max: 20 },
    ],
    calculate: (inputs)=>{const cr=inputs.credits as number;const cpc=inputs.costPerCredit as number;const sem=inputs.semesters as number;if(!cr||!cpc||!sem)return null;const perSem=cr*cpc;const total=perSem*sem;const perYear=perSem*2;return{primary:{label:"Total Cost",value:"$"+formatNumber(total)},details:[{label:"Per semester",value:"$"+formatNumber(perSem)},{label:"Per year",value:"$"+formatNumber(perYear)},{label:"Per credit hour",value:"$"+formatNumber(cpc)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How do I plan my education budget?", answer: "Consider tuition, fees, books, housing, and living expenses. This calculator covers tuition costs based on credit hours." },
    { question: "Are there ways to reduce costs?", answer: "Community college transfers, scholarships, FAFSA, work-study programs, and textbook rentals can significantly reduce education costs." },
  ],
  formula: "Total = Credits x Cost per Credit x Semesters",
};
