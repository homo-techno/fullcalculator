import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageSalePriceCalculator: CalculatorDefinition = {
  slug: "garage-sale-price-calculator",
  title: "Garage Sale Pricing Calculator",
  description:
    "Free garage sale pricing calculator. Determine fair garage sale prices for your items based on original cost, age, condition, and item category.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "garage sale pricing",
    "yard sale prices",
    "garage sale calculator",
    "how to price garage sale items",
    "used item pricing",
  ],
  variants: [
    {
      id: "by-original-price",
      name: "By Original Price",
      description: "Calculate a fair garage sale price from original cost",
      fields: [
        {
          name: "originalPrice",
          label: "Original Purchase Price",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 1,
          max: 10000,
          step: 1,
        },
        {
          name: "ageYears",
          label: "Age of Item",
          type: "select",
          options: [
            { label: "Less than 1 year", value: "0.5" },
            { label: "1-2 years", value: "1.5" },
            { label: "2-5 years", value: "3" },
            { label: "5-10 years", value: "7" },
            { label: "Over 10 years", value: "12" },
          ],
          defaultValue: "3",
        },
        {
          name: "condition",
          label: "Condition",
          type: "select",
          options: [
            { label: "Like New (with tags/packaging)", value: "like_new" },
            { label: "Excellent (barely used)", value: "excellent" },
            { label: "Good (normal wear)", value: "good" },
            { label: "Fair (visible wear)", value: "fair" },
            { label: "Poor (damaged/stained)", value: "poor" },
          ],
          defaultValue: "good",
        },
        {
          name: "category",
          label: "Item Category",
          type: "select",
          options: [
            { label: "Electronics", value: "electronics" },
            { label: "Clothing", value: "clothing" },
            { label: "Furniture", value: "furniture" },
            { label: "Books", value: "books" },
            { label: "Toys/Games", value: "toys" },
            { label: "Kitchen Items", value: "kitchen" },
            { label: "Sports Equipment", value: "sports" },
            { label: "Tools", value: "tools" },
          ],
          defaultValue: "electronics",
        },
      ],
      calculate: (inputs) => {
        const original = parseFloat(inputs.originalPrice as string);
        const age = parseFloat(inputs.ageYears as string);
        const condition = inputs.condition as string;
        const category = inputs.category as string;
        if (!original || !age) return null;

        // Base depreciation by category (% retained per year)
        const categoryRetention: Record<string, number> = {
          electronics: 0.7,
          clothing: 0.6,
          furniture: 0.85,
          books: 0.5,
          toys: 0.6,
          kitchen: 0.75,
          sports: 0.75,
          tools: 0.85,
        };

        // Condition multiplier
        const conditionMult: Record<string, number> = {
          like_new: 1.0,
          excellent: 0.85,
          good: 0.7,
          fair: 0.5,
          poor: 0.25,
        };

        const retention = categoryRetention[category] || 0.7;
        const depreciatedValue = original * Math.pow(retention, age);
        const conditionValue = depreciatedValue * (conditionMult[condition] || 0.7);

        // Garage sale discount (people expect bargains)
        const garageSaleDiscount = 0.5; // 50% off depreciated value
        let suggestedPrice = conditionValue * garageSaleDiscount;

        // Minimum price floor
        suggestedPrice = Math.max(0.5, suggestedPrice);

        // Round to nearest quarter for easy pricing
        suggestedPrice = Math.round(suggestedPrice * 4) / 4;

        const highPrice = Math.round(suggestedPrice * 1.25 * 4) / 4;
        const lowPrice = Math.round(suggestedPrice * 0.75 * 4) / 4;

        return {
          primary: { label: "Suggested Price", value: `$${formatNumber(suggestedPrice)}` },
          details: [
            { label: "Price Range", value: `$${formatNumber(lowPrice)} - $${formatNumber(highPrice)}` },
            { label: "Original Price", value: `$${formatNumber(original)}` },
            { label: "Depreciated Value", value: `$${formatNumber(conditionValue)}` },
            { label: "Percent of Original", value: `${formatNumber((suggestedPrice / original) * 100, 0)}%` },
          ],
          note: "Start at the higher end and be ready to negotiate. Most garage sale shoppers expect to bargain. Price items in round numbers or quarters for easy transactions.",
        };
      },
    },
    {
      id: "quick-price",
      name: "Quick Price Guide",
      description: "Get typical garage sale prices by item type",
      fields: [
        {
          name: "itemType",
          label: "Item Type",
          type: "select",
          options: [
            { label: "Hardcover Book", value: "book_hard" },
            { label: "Paperback Book", value: "book_paper" },
            { label: "DVD/Blu-ray", value: "dvd" },
            { label: "T-shirt/Top", value: "shirt" },
            { label: "Jeans/Pants", value: "pants" },
            { label: "Dress/Suit", value: "dress" },
            { label: "Children's Clothing", value: "kids_clothes" },
            { label: "Children's Toy", value: "toy" },
            { label: "Board Game (complete)", value: "board_game" },
            { label: "Kitchen Gadget", value: "kitchen" },
            { label: "Small Appliance", value: "small_appliance" },
            { label: "Piece of Furniture", value: "furniture" },
          ],
          defaultValue: "shirt",
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 100,
          step: 1,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const itemType = inputs.itemType as string;
        const qty = parseFloat(inputs.quantity as string);
        if (!itemType || !qty) return null;

        const priceGuide: Record<string, { low: number; mid: number; high: number }> = {
          book_hard: { low: 1, mid: 2, high: 4 },
          book_paper: { low: 0.25, mid: 0.5, high: 1 },
          dvd: { low: 0.5, mid: 1, high: 3 },
          shirt: { low: 1, mid: 3, high: 5 },
          pants: { low: 2, mid: 4, high: 8 },
          dress: { low: 3, mid: 8, high: 15 },
          kids_clothes: { low: 0.5, mid: 1, high: 3 },
          toy: { low: 0.5, mid: 2, high: 5 },
          board_game: { low: 2, mid: 4, high: 8 },
          kitchen: { low: 1, mid: 3, high: 7 },
          small_appliance: { low: 5, mid: 10, high: 20 },
          furniture: { low: 15, mid: 40, high: 100 },
        };

        const prices = priceGuide[itemType];
        if (!prices) return null;

        const totalLow = prices.low * qty;
        const totalMid = prices.mid * qty;
        const totalHigh = prices.high * qty;

        return {
          primary: { label: "Suggested Price Each", value: `$${formatNumber(prices.mid)}` },
          details: [
            { label: "Budget Price", value: `$${formatNumber(prices.low)} each` },
            { label: "Premium Price", value: `$${formatNumber(prices.high)} each` },
            { label: "Quantity", value: formatNumber(qty, 0) },
            { label: "Total (budget)", value: `$${formatNumber(totalLow)}` },
            { label: "Total (suggested)", value: `$${formatNumber(totalMid)}` },
            { label: "Total (premium)", value: `$${formatNumber(totalHigh)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["thrift-store-markup-calculator", "coupon-savings-calculator"],
  faq: [
    {
      question: "What is the general rule for garage sale pricing?",
      answer:
        "A common rule is to price items at 10-30% of the original retail price for standard used goods. Like-new items can go up to 50%. Electronics and brand-name items hold more value, while books and clothing should be priced low to move.",
    },
    {
      question: "How do I price items that were expensive when new?",
      answer:
        "High-value items like electronics and furniture should be researched online (eBay sold listings, Facebook Marketplace) to see current market value. Garage sale prices are typically 40-60% below online resale prices since buyers expect bargains.",
    },
  ],
  formula:
    "Suggested Price = Original Price x Retention^Age x Condition Factor x 0.5 (garage sale discount)",
};
