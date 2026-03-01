import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeschoolCurriculumCalculator: CalculatorDefinition = {
  slug: "homeschool-curriculum-calculator",
  title: "Homeschool Curriculum Calculator",
  description: "Estimate the annual cost of homeschooling including curriculum, materials, and activities.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["homeschool cost", "curriculum cost", "homeschooling budget"],
  variants: [{
    id: "standard",
    name: "Homeschool Curriculum",
    description: "Estimate the annual cost of homeschooling including curriculum, materials, and activities",
    fields: [
      { name: "children", label: "Number of Children", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "approach", label: "Curriculum Approach", type: "select", options: [{value:"free",label:"Free/Online Resources"},{value:"budget",label:"Budget Mix"},{value:"boxed",label:"Boxed Curriculum"},{value:"premium",label:"Premium/Accredited"}], defaultValue: "budget" },
      { name: "coopFee", label: "Monthly Co-op or Class Fee", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 50 },
      { name: "fieldTrips", label: "Field Trips per Year", type: "number", min: 0, max: 50, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const children = inputs.children as number;
      const approach = inputs.approach as string;
      const coopFee = inputs.coopFee as number;
      const trips = inputs.fieldTrips as number;
      if (!children || children <= 0) return null;
      const curriculumPerChild: Record<string, number> = { free: 50, budget: 300, boxed: 800, premium: 2000 };
      const curriculumCost = (curriculumPerChild[approach] || 300) * children;
      const annualCoop = coopFee * 12;
      const tripCost = trips * 25 * children;
      const supplies = 150 * children;
      const total = curriculumCost + annualCoop + tripCost + supplies;
      const perChild = total / children;
      return {
        primary: { label: "Annual Homeschool Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Curriculum", value: "$" + formatNumber(Math.round(curriculumCost)) },
          { label: "Co-op/Classes", value: "$" + formatNumber(Math.round(annualCoop)) },
          { label: "Field Trips", value: "$" + formatNumber(Math.round(tripCost)) },
          { label: "Cost per Child", value: "$" + formatNumber(Math.round(perChild)) },
        ],
      };
    },
  }],
  relatedSlugs: ["private-school-cost-calculator", "extracurricular-cost-calculator"],
  faq: [
    { question: "How much does homeschooling cost?", answer: "Homeschooling costs range from nearly free using online resources to $2,000-$5,000 per child for premium accredited programs." },
    { question: "What are the hidden costs of homeschooling?", answer: "Hidden costs include lost income for the teaching parent, supplies, printer ink, internet, co-op fees, and enrichment activities." },
  ],
  formula: "Total = (Curriculum per Child x Children) + Co-op Fees + Field Trips + Supplies",
};
