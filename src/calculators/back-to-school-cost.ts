import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backToSchoolCostCalculator: CalculatorDefinition = {
  slug: "back-to-school-cost-calculator",
  title: "Back-to-School Cost Calculator",
  description:
    "Estimate back-to-school costs by grade level. Calculate expenses for supplies, clothing, electronics, and fees to prepare your budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "back to school",
    "school supplies",
    "school cost",
    "school budget",
    "school shopping",
  ],
  variants: [
    {
      id: "byGrade",
      name: "By Grade Level",
      description: "Estimate costs based on the student's grade level",
      fields: [
        { name: "gradeLevel", label: "Grade Level", type: "select", options: [
          { label: "Elementary (K-5)", value: "elementary" },
          { label: "Middle School (6-8)", value: "middle" },
          { label: "High School (9-12)", value: "high" },
          { label: "College", value: "college" },
        ], defaultValue: "elementary" },
        { name: "numChildren", label: "Number of Students", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "newClothing", label: "New Clothing Budget ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "needsElectronics", label: "Need Electronics?", type: "select", options: [
          { label: "No new electronics", value: "none" },
          { label: "Basic (calculator, etc.) $30", value: "basic" },
          { label: "Tablet/Chromebook $250", value: "tablet" },
          { label: "Laptop $500+", value: "laptop" },
        ], defaultValue: "none" },
        { name: "schoolFees", label: "School/Activity Fees ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const gradeLevel = inputs.gradeLevel as string;
        const numChildren = parseFloat(inputs.numChildren as string);
        const newClothing = parseFloat(inputs.newClothing as string);
        const needsElectronics = inputs.needsElectronics as string;
        const schoolFees = parseFloat(inputs.schoolFees as string);

        if (isNaN(numChildren) || numChildren <= 0) return null;

        const supplyCosts: Record<string, number> = {
          elementary: 50,
          middle: 75,
          high: 100,
          college: 150,
        };
        const electronicsCosts: Record<string, number> = {
          none: 0,
          basic: 30,
          tablet: 250,
          laptop: 500,
        };

        const supplies = supplyCosts[gradeLevel] || 75;
        const electronics = electronicsCosts[needsElectronics] || 0;
        const clothing = newClothing || 0;
        const fees = schoolFees || 0;
        const perChild = supplies + electronics + clothing + fees;
        const total = perChild * numChildren;

        return {
          primary: { label: "Total Back-to-School Cost", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Supplies per Student", value: `$${formatNumber(supplies, 2)}` },
            { label: "Electronics", value: `$${formatNumber(electronics, 2)}` },
            { label: "Clothing per Student", value: `$${formatNumber(clothing, 2)}` },
            { label: "Fees per Student", value: `$${formatNumber(fees, 2)}` },
            { label: "Cost per Student", value: `$${formatNumber(perChild, 2)}` },
            { label: "Number of Students", value: formatNumber(numChildren, 0) },
          ],
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Breakdown",
      description: "Enter specific amounts for each category",
      fields: [
        { name: "notebooks", label: "Notebooks & Paper ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "writingSupplies", label: "Pens, Pencils, Markers ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "binders", label: "Binders & Folders ($)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "backpack", label: "Backpack ($)", type: "number", placeholder: "e.g. 35", defaultValue: 35 },
        { name: "lunchbox", label: "Lunchbox & Bottle ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "clothing", label: "Clothing & Shoes ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "electronics", label: "Electronics ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "fees", label: "Fees & Other ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const notebooks = parseFloat(inputs.notebooks as string) || 0;
        const writingSupplies = parseFloat(inputs.writingSupplies as string) || 0;
        const binders = parseFloat(inputs.binders as string) || 0;
        const backpack = parseFloat(inputs.backpack as string) || 0;
        const lunchbox = parseFloat(inputs.lunchbox as string) || 0;
        const clothing = parseFloat(inputs.clothing as string) || 0;
        const electronics = parseFloat(inputs.electronics as string) || 0;
        const fees = parseFloat(inputs.fees as string) || 0;

        const suppliesTotal = notebooks + writingSupplies + binders + backpack + lunchbox;
        const grandTotal = suppliesTotal + clothing + electronics + fees;

        if (grandTotal <= 0) return null;

        return {
          primary: { label: "Total Back-to-School Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Supplies Subtotal", value: `$${formatNumber(suppliesTotal, 2)}` },
            { label: "Clothing & Shoes", value: `$${formatNumber(clothing, 2)}` },
            { label: "Electronics", value: `$${formatNumber(electronics, 2)}` },
            { label: "Fees & Other", value: `$${formatNumber(fees, 2)}` },
            { label: "Supplies % of Total", value: `${formatNumber((suppliesTotal / grandTotal) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["college-move-in-cost-calculator", "christmas-budget-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does back-to-school shopping cost on average?",
      answer:
        "The average family spends $600-$900 per child on back-to-school shopping, with clothing and electronics being the biggest expenses. Elementary students cost less ($400-$600), while high schoolers and college students cost more ($800-$1,200+).",
    },
    {
      question: "How can I save on back-to-school shopping?",
      answer:
        "Shop tax-free weekends, buy generic/store brands, reuse supplies from last year, shop clearance sales, buy in bulk with other families, and check for school supply drives. Wait on electronics for holiday sales if possible.",
    },
    {
      question: "When should I start back-to-school shopping?",
      answer:
        "Start in July when stores begin putting out supplies. The best deals are typically 2-3 weeks before school starts. Clothing can wait until after school starts when you know what your child actually needs.",
    },
  ],
  formula:
    "Total Cost = (Supplies + Electronics + Clothing + Fees) × Number of Students",
};
