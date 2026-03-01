import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageSalePricingCalculator: CalculatorDefinition = {
  slug: "garage-sale-pricing-calculator",
  title: "Garage Sale Pricing Calculator",
  description: "Get recommended pricing for used items at your garage sale based on condition and category.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["garage sale pricing", "yard sale prices", "used item pricing guide"],
  variants: [{
    id: "standard",
    name: "Garage Sale Pricing",
    description: "Get recommended pricing for used items at your garage sale based on condition and category",
    fields: [
      { name: "originalPrice", label: "Original Purchase Price", type: "number", prefix: "$", min: 1, max: 10000, defaultValue: 50 },
      { name: "condition", label: "Item Condition", type: "select", options: [{value:"likenew",label:"Like New"},{value:"good",label:"Good (Minor Wear)"},{value:"fair",label:"Fair (Visible Wear)"},{value:"worn",label:"Worn (Heavy Use)"}], defaultValue: "good" },
      { name: "category", label: "Item Category", type: "select", options: [{value:"electronics",label:"Electronics"},{value:"clothing",label:"Clothing"},{value:"furniture",label:"Furniture"},{value:"toys",label:"Toys/Games"},{value:"books",label:"Books/Media"}], defaultValue: "electronics" },
      { name: "age", label: "Item Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const original = inputs.originalPrice as number;
      const condition = inputs.condition as string;
      const category = inputs.category as string;
      const age = inputs.age as number;
      if (!original || original <= 0) return null;
      const condMod: Record<string, number> = { likenew: 0.50, good: 0.33, fair: 0.20, worn: 0.10 };
      const catMod: Record<string, number> = { electronics: 0.8, clothing: 0.6, furniture: 1.0, toys: 0.7, books: 0.5 };
      const ageMod = Math.max(0.3, 1.0 - (age * 0.08));
      const suggestedPrice = original * (condMod[condition] || 0.33) * (catMod[category] || 0.7) * ageMod;
      const minPrice = suggestedPrice * 0.7;
      const maxPrice = suggestedPrice * 1.3;
      return {
        primary: { label: "Suggested Price", value: "$" + formatNumber(Math.round(suggestedPrice * 100) / 100) },
        details: [
          { label: "Price Range", value: "$" + formatNumber(Math.round(minPrice * 100) / 100) + " - $" + formatNumber(Math.round(maxPrice * 100) / 100) },
          { label: "Percentage of Original", value: formatNumber(Math.round((suggestedPrice / original) * 100)) + "%" },
          { label: "Negotiation Floor", value: "$" + formatNumber(Math.round(minPrice * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["estate-sale-calculator", "tipping-etiquette-calculator"],
  faq: [
    { question: "How do I price items for a garage sale?", answer: "A general rule is to price items at 10 to 33 percent of the original price, depending on condition. Like-new items can go for up to 50 percent of original price." },
    { question: "What sells best at garage sales?", answer: "Furniture, tools, electronics, baby items, and kitchen appliances tend to sell quickly at garage sales. Price these competitively and display them prominently." },
  ],
  formula: "Price = Original Price x Condition Modifier x Category Modifier x Age Modifier",
};
