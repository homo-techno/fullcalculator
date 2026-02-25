import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const textbookCostCalculator: CalculatorDefinition = {
  slug: "textbook-cost-calculator",
  title: "Textbook Cost Calculator",
  description:
    "Free textbook cost calculator. Compare buying, renting, and digital textbook options to find the most affordable choice for your semester.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "textbook cost calculator",
    "textbook budget",
    "rent vs buy textbooks",
    "college textbook cost",
    "textbook savings calculator",
  ],
  variants: [
    {
      id: "semester",
      name: "Semester Textbook Cost",
      description: "Estimate total textbook costs for the semester",
      fields: [
        { name: "numCourses", label: "Number of Courses", type: "number", placeholder: "e.g. 5", min: 1, max: 10 },
        { name: "avgBookPrice", label: "Average Textbook Price ($)", type: "number", placeholder: "e.g. 120", min: 0 },
        { name: "booksPerCourse", label: "Books per Course (avg)", type: "number", placeholder: "e.g. 1.5", min: 0.5, max: 5, step: 0.5, defaultValue: 1.5 },
        { name: "usedDiscount", label: "% Buying Used (0-100)", type: "number", placeholder: "e.g. 50", min: 0, max: 100, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const courses = inputs.numCourses as number;
        const avgPrice = inputs.avgBookPrice as number;
        const booksPerCourse = (inputs.booksPerCourse as number) || 1.5;
        const usedPct = ((inputs.usedDiscount as number) || 0) / 100;
        if (!courses || avgPrice === undefined) return null;

        const totalBooks = courses * booksPerCourse;
        const newBooks = Math.round(totalBooks * (1 - usedPct));
        const usedBooks = Math.round(totalBooks * usedPct);
        const newCost = newBooks * avgPrice;
        const usedCost = usedBooks * avgPrice * 0.6;
        const totalCost = newCost + usedCost;
        const costPerCourse = totalCost / courses;
        const savings = (newBooks + usedBooks) * avgPrice - totalCost;

        return {
          primary: { label: "Total Textbook Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Total books needed", value: formatNumber(totalBooks, 0) },
            { label: "Cost per course", value: `$${formatNumber(costPerCourse, 2)}` },
            { label: "Savings from used books", value: `$${formatNumber(savings, 2)}` },
            { label: "New / Used split", value: `${newBooks} new / ${usedBooks} used` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Buy vs Rent vs Digital",
      description: "Compare the cost of buying, renting, and digital textbook options",
      fields: [
        { name: "buyNewPrice", label: "Buy New Price ($)", type: "number", placeholder: "e.g. 150", min: 0 },
        { name: "numTextbooks", label: "Number of Textbooks", type: "number", placeholder: "e.g. 5", min: 1, max: 20 },
        { name: "resalePercent", label: "Expected Resale Value (%)", type: "number", placeholder: "e.g. 30", min: 0, max: 100, defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const price = inputs.buyNewPrice as number;
        const num = inputs.numTextbooks as number;
        const resale = ((inputs.resalePercent as number) || 30) / 100;
        if (price === undefined || !num) return null;

        const buyNew = price * num;
        const buyNewNet = buyNew - buyNew * resale;
        const buyUsed = price * 0.6 * num;
        const rent = price * 0.45 * num;
        const digital = price * 0.5 * num;

        const cheapest = Math.min(buyNewNet, buyUsed, rent, digital);
        let recommendation: string;
        if (cheapest === rent) recommendation = "Renting is cheapest";
        else if (cheapest === digital) recommendation = "Digital is cheapest";
        else if (cheapest === buyUsed) recommendation = "Buying used is cheapest";
        else recommendation = "Buying new (with resale) is cheapest";

        return {
          primary: { label: "Best Option", value: recommendation },
          details: [
            { label: "Buy new (after resale)", value: `$${formatNumber(buyNewNet, 2)}` },
            { label: "Buy used (~60% of new)", value: `$${formatNumber(buyUsed, 2)}` },
            { label: "Rent (~45% of new)", value: `$${formatNumber(rent, 2)}` },
            { label: "Digital (~50% of new)", value: `$${formatNumber(digital, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-budget-calculator", "tuition-cost-calculator"],
  faq: [
    {
      question: "How much do college textbooks cost on average?",
      answer:
        "The average college student spends $500-$1,200 per year on textbooks. Individual textbooks range from $50 to over $300, with STEM textbooks being the most expensive.",
    },
    {
      question: "How can I save money on textbooks?",
      answer:
        "Buy used, rent, use digital versions, check library reserves, look for international editions, or use open educational resources (OER). Older editions often have the same content at a fraction of the price.",
    },
  ],
  formula: "Total Cost = (New Books x Price) + (Used Books x Price x 0.6)",
};
