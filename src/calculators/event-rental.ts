import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventRentalCalculator: CalculatorDefinition = {
  slug: "event-rental",
  title: "Event Rental Cost Estimator",
  description: "Free event rental cost estimator. Calculate the cost of renting tables, chairs, linens, tableware, and other event essentials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event rentals", "table rental", "chair rental", "linen rental", "wedding rentals"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Rental Estimate",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 150" },
        { name: "tables", label: "Tables Needed", type: "number", placeholder: "e.g. 18" },
        { name: "tableCost", label: "Cost Per Table ($)", type: "number", placeholder: "e.g. 15" },
        { name: "chairCost", label: "Cost Per Chair ($)", type: "number", placeholder: "e.g. 5" },
        { name: "linenCost", label: "Cost Per Linen ($)", type: "number", placeholder: "e.g. 12" },
        { name: "placeSetting", label: "Place Setting Cost ($)", type: "number", placeholder: "e.g. 8" },
        { name: "tentNeeded", label: "Tent Needed?", type: "select", options: [
          { label: "No Tent", value: "none" },
          { label: "Small (up to 60 guests)", value: "small" },
          { label: "Medium (60-120 guests)", value: "medium" },
          { label: "Large (120+ guests)", value: "large" },
        ] },
        { name: "danceFloor", label: "Dance Floor Rental ($)", type: "number", placeholder: "e.g. 500" },
        { name: "lighting", label: "Lighting Package ($)", type: "number", placeholder: "e.g. 300" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const tables = (inputs.tables as number) || 0;
        const tableCost = (inputs.tableCost as number) || 15;
        const chairCost = (inputs.chairCost as number) || 5;
        const linenCost = (inputs.linenCost as number) || 12;
        const placeSetting = (inputs.placeSetting as number) || 8;
        const tentNeeded = (inputs.tentNeeded as string) || "none";
        const danceFloor = (inputs.danceFloor as number) || 0;
        const lighting = (inputs.lighting as number) || 0;
        if (guestCount <= 0) return null;
        const tableCostTotal = tables * tableCost;
        const chairCostTotal = guestCount * chairCost;
        const linenCostTotal = tables * linenCost;
        const placeSettingTotal = guestCount * placeSetting;
        const tentCost = tentNeeded === "small" ? 800 : tentNeeded === "medium" ? 2000 : tentNeeded === "large" ? 4000 : 0;
        const subtotal = tableCostTotal + chairCostTotal + linenCostTotal + placeSettingTotal + tentCost + danceFloor + lighting;
        const deliveryFee = subtotal * 0.15;
        const totalCost = subtotal + deliveryFee;
        return {
          primary: { label: "Total Rental Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Tables", value: "$" + formatNumber(tableCostTotal, 2) },
            { label: "Chairs", value: "$" + formatNumber(chairCostTotal, 2) },
            { label: "Linens", value: "$" + formatNumber(linenCostTotal, 2) },
            { label: "Place Settings", value: "$" + formatNumber(placeSettingTotal, 2) },
            { label: "Tent", value: tentCost > 0 ? "$" + formatNumber(tentCost, 2) : "None" },
            { label: "Dance Floor + Lighting", value: "$" + formatNumber(danceFloor + lighting, 2) },
            { label: "Delivery & Setup (15%)", value: "$" + formatNumber(deliveryFee, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-seating", "event-space-capacity", "wedding-flower"],
  faq: [
    { question: "What is the average cost of event rentals?", answer: "Event rental costs typically range from $1,500 to $5,000 for a 150-person wedding, depending on the quality of items and whether a tent is needed." },
    { question: "What does delivery and setup cost?", answer: "Most rental companies charge 10-20% of the rental total for delivery, setup, and pickup. Some include this in their pricing." },
  ],
  formula: "Total = (Tables + Chairs + Linens + Place Settings + Tent + Extras) x 1.15 delivery",
};
