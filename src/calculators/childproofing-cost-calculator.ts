import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childproofingCostCalculator: CalculatorDefinition = {
  slug: "childproofing-cost-calculator",
  title: "Childproofing Cost Calculator",
  description: "Estimate the total cost of childproofing your home including safety gates, outlet covers, cabinet locks, and furniture anchors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["childproofing cost","baby proofing","home safety baby","child safety products","baby gate cost"],
  variants: [{
    id: "standard",
    name: "Childproofing Cost",
    description: "Estimate the total cost of childproofing your home including safety gates, outlet covers, cabinet locks, and furniture anchors.",
    fields: [
      { name: "rooms", label: "Number of Rooms to Childproof", type: "number", min: 1, max: 15, defaultValue: 6 },
      { name: "gates", label: "Safety Gates Needed", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "gateCost", label: "Average Gate Cost ($)", type: "number", min: 20, max: 150, defaultValue: 45 },
      { name: "outlets", label: "Outlet Covers Needed", type: "number", min: 5, max: 50, defaultValue: 20 },
      { name: "cabinetLocks", label: "Cabinet/Drawer Locks", type: "number", min: 5, max: 30, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const rooms = inputs.rooms as number;
    const gates = inputs.gates as number;
    const gateCost = inputs.gateCost as number;
    const outlets = inputs.outlets as number;
    const cabinetLocks = inputs.cabinetLocks as number;
    const gateTotal = gates * gateCost;
    const outletTotal = outlets * 2.5;
    const lockTotal = cabinetLocks * 5;
    const cornerGuards = rooms * 4 * 1.5;
    const furnitureAnchors = rooms * 2 * 8;
    const miscSafety = rooms * 10;
    const totalCost = gateTotal + outletTotal + lockTotal + cornerGuards + furnitureAnchors + miscSafety;
    const perRoom = totalCost / rooms;
    return {
      primary: { label: "Total Childproofing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Safety Gates", value: "$" + formatNumber(Math.round(gateTotal)) },
        { label: "Outlet Covers", value: "$" + formatNumber(Math.round(outletTotal)) },
        { label: "Cabinet/Drawer Locks", value: "$" + formatNumber(Math.round(lockTotal)) },
        { label: "Corner Guards", value: "$" + formatNumber(Math.round(cornerGuards)) },
        { label: "Furniture Anchors", value: "$" + formatNumber(Math.round(furnitureAnchors)) },
        { label: "Cost Per Room", value: "$" + formatNumber(Math.round(perRoom)) }
      ]
    };
  },
  }],
  relatedSlugs: ["nursery-setup-cost-calculator","car-seat-expiration-calculator","nanny-share-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = Gate Cost + Outlet Covers + Locks + Corner Guards + Furniture Anchors + Misc; Per Room = Total / Number of Rooms",
};
