import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingCakeCostEstimatorCalculator: CalculatorDefinition = {
  slug: "wedding-cake-cost-estimator",
  title: "Wedding Cake Cost Estimator",
  description: "Estimate detailed wedding cake costs based on servings, tiers, filling options, fondant versus buttercream, and specialty decorations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding cake cost","tiered cake pricing","cake per serving cost","wedding dessert budget"],
  variants: [{
    id: "standard",
    name: "Wedding Cake Cost Estimator",
    description: "Estimate detailed wedding cake costs based on servings, tiers, filling options, fondant versus buttercream, and specialty decorations.",
    fields: [
      { name: "servings", label: "Number of Servings", type: "number", min: 10, max: 500, defaultValue: 120 },
      { name: "tiers", label: "Number of Tiers", type: "number", min: 1, max: 7, defaultValue: 3 },
      { name: "icingType", label: "Icing Type", type: "select", options: [{ value: "1", label: "Buttercream" }, { value: "1.5", label: "Fondant" }, { value: "1.8", label: "Ganache" }], defaultValue: "1" },
      { name: "fillingUpgrade", label: "Premium Filling", type: "select", options: [{ value: "0", label: "Standard (included)" }, { value: "1", label: "Fruit Curd (+$1/serving)" }, { value: "2", label: "Mousse (+$2/serving)" }, { value: "3", label: "Specialty (+$3/serving)" }], defaultValue: "0" },
      { name: "decorLevel", label: "Decoration Level", type: "select", options: [{ value: "0", label: "Simple/Minimal" }, { value: "200", label: "Fresh Flowers ($200)" }, { value: "400", label: "Sugar Flowers ($400)" }, { value: "800", label: "Elaborate Design ($800)" }], defaultValue: "200" },
      { name: "delivery", label: "Delivery and Setup ($)", type: "number", min: 0, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const servings = inputs.servings as number;
    const tiers = inputs.tiers as number;
    const icingMult = parseFloat(inputs.icingType as unknown as string);
    const filling = parseFloat(inputs.fillingUpgrade as unknown as string);
    const decor = parseFloat(inputs.decorLevel as unknown as string);
    const delivery = inputs.delivery as number;
    const basePerServing = 4 + (tiers * 0.75);
    const cakeCost = servings * basePerServing * icingMult;
    const fillingCost = servings * filling;
    const total = cakeCost + fillingCost + decor + delivery;
    const perServing = total / servings;
    return {
      primary: { label: "Total Cake Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Cake Cost", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Filling Upgrade", value: "$" + formatNumber(Math.round(fillingCost)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Delivery and Setup", value: "$" + formatNumber(delivery) },
        { label: "Cost Per Serving", value: "$" + formatNumber(Math.round(perServing * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-cake-calculator","wedding-budget-calculator","event-catering-calculator"],
  faq: [
    { question: "How much does a wedding cake cost per serving?", answer: "Wedding cakes typically cost $4 to $12 per serving. Simple buttercream designs start lower, while fondant cakes with elaborate details cost $8 to $15 per slice." },
    { question: "How many tiers do you need for a wedding cake?", answer: "A 3-tier cake serves 75-100 guests. For 150+ guests, consider a 4-5 tier cake or a smaller display cake with additional sheet cakes for serving." },
    { question: "Is fondant or buttercream more expensive?", answer: "Fondant is typically 30-50% more expensive than buttercream due to the labor-intensive application process. Buttercream is more popular for taste, fondant for smooth visual appeal." },
  ],
  formula: "Base Per Serving = $4 + (Tiers x $0.75)
Cake Cost = Servings x BasePerServing x IcingMultiplier
Total = CakeCost + FillingUpgrade + Decorations + Delivery",
};
