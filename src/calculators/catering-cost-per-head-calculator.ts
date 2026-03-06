import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cateringCostPerHeadCalculator: CalculatorDefinition = {
  slug: "catering-cost-per-head-calculator",
  title: "Catering Cost Per Head Calculator",
  description: "Estimate total catering costs and per-person pricing for events by selecting service style, menu complexity, staff needs, and equipment rentals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["catering cost per head","catering price per person","event catering budget","banquet catering cost"],
  variants: [{
    id: "standard",
    name: "Catering Cost Per Head",
    description: "Estimate total catering costs and per-person pricing for events by selecting service style, menu complexity, staff needs, and equipment rentals.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 5000, defaultValue: 100 },
      { name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Buffet ($25-40/head)" }, { value: "2", label: "Plated Dinner ($40-75/head)" }, { value: "3", label: "Food Stations ($30-50/head)" }, { value: "4", label: "Family Style ($35-55/head)" }], defaultValue: "2" },
      { name: "menuTier", label: "Menu Tier", type: "select", options: [{ value: "1", label: "Standard" }, { value: "2", label: "Premium" }, { value: "3", label: "Luxury" }], defaultValue: "2" },
      { name: "barService", label: "Bar Service", type: "select", options: [{ value: "0", label: "No Bar" }, { value: "1", label: "Beer and Wine ($15/head)" }, { value: "2", label: "Open Bar ($30/head)" }, { value: "3", label: "Premium Open Bar ($45/head)" }], defaultValue: "1" },
      { name: "rentalCost", label: "Equipment and Rental Cost ($)", type: "number", min: 0, max: 50000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const style = parseInt(inputs.serviceStyle as string);
    const tier = parseInt(inputs.menuTier as string);
    const bar = parseInt(inputs.barService as string);
    const rentals = inputs.rentalCost as number;
    const styleBase = { 1: 32, 2: 55, 3: 40, 4: 45 };
    const tierMult = { 1: 0.85, 2: 1.0, 3: 1.4 };
    const barCost = { 0: 0, 1: 15, 2: 30, 3: 45 };
    const foodPerHead = (styleBase[style] || 45) * (tierMult[tier] || 1);
    const barPerHead = barCost[bar] || 0;
    const totalPerHead = foodPerHead + barPerHead;
    const subtotal = totalPerHead * guests;
    const grandTotal = subtotal + rentals;
    const costPerHead = guests > 0 ? grandTotal / guests : 0;
    return {
      primary: { label: "Total Cost Per Head", value: "$" + formatNumber(Math.round(costPerHead * 100) / 100) },
      details: [
        { label: "Food Per Head", value: "$" + formatNumber(Math.round(foodPerHead * 100) / 100) },
        { label: "Bar Per Head", value: "$" + formatNumber(barPerHead) },
        { label: "Subtotal (Food + Bar)", value: "$" + formatNumber(Math.round(subtotal)) },
        { label: "Rentals and Equipment", value: "$" + formatNumber(Math.round(rentals)) },
        { label: "Grand Total", value: "$" + formatNumber(Math.round(grandTotal)) }
      ]
    };
  },
  }],
  relatedSlugs: ["banquet-hall-rental-cost-calculator","buffet-quantity-calculator"],
  faq: [
    { question: "How much does catering cost per person?", answer: "Catering costs range widely: buffets average $25 to $40 per person, plated dinners $40 to $75, and premium events can exceed $100 per person including bar service, rentals, and staffing." },
    { question: "What is included in a catering per-head price?", answer: "Per-head pricing typically includes food preparation, service staff, basic table settings, and sometimes beverages. Equipment rentals, linens, specialty decor, and premium bar packages are usually extra." },
    { question: "How do I choose between buffet and plated service?", answer: "Buffets are more budget-friendly and work well for casual events. Plated dinners provide an elevated experience for formal occasions. Food stations offer a middle ground with interactive variety." },
  ],
  formula: "Food Per Head = Style Base Price x Menu Tier Multiplier
Total Per Head = Food Per Head + Bar Per Head
Grand Total = (Total Per Head x Guests) + Rentals",
};
