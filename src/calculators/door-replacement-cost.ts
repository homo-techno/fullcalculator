import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doorReplacementCostCalculator: CalculatorDefinition = {
  slug: "door-replacement-cost-calculator",
  title: "Door Replacement Cost Calculator",
  description: "Free door replacement cost calculator. Estimate the cost of replacing interior and exterior doors including hardware and installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["door replacement cost", "door installation cost", "how much to replace a door", "new door cost", "exterior door cost"],
  variants: [
    {
      id: "exterior",
      name: "Exterior Door",
      fields: [
        { name: "numDoors", label: "Number of Doors", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "doorType", label: "Door Type", type: "select", options: [
          { label: "Steel entry door ($200-$800)", value: "500" },
          { label: "Fiberglass entry door ($300-$2,000)", value: "900" },
          { label: "Solid wood entry door ($500-$3,000)", value: "1500" },
          { label: "Sliding glass door ($400-$2,500)", value: "1200" },
          { label: "French doors ($600-$4,000)", value: "2000" },
          { label: "Storm door ($100-$500)", value: "250" },
        ], defaultValue: "900" },
        { name: "hardware", label: "Hardware", type: "select", options: [
          { label: "Basic lockset ($30-$80)", value: "50" },
          { label: "Deadbolt + handle set ($80-$200)", value: "140" },
          { label: "Smart lock set ($200-$500)", value: "350" },
        ], defaultValue: "140" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($200-$500/door)", value: "350" },
          { label: "Full frame replacement ($400-$1,000/door)", value: "700" },
        ], defaultValue: "350" },
      ],
      calculate: (inputs) => {
        const numDoors = (inputs.numDoors as number) || 1;
        const doorCost = parseInt(inputs.doorType as string) || 900;
        const hardwareCost = parseInt(inputs.hardware as string) || 140;
        const installCost = parseInt(inputs.installation as string) || 0;
        const weatherstrip = 25;
        const trim = 75;
        const perDoor = doorCost + hardwareCost + installCost + weatherstrip + trim;
        const totalCost = perDoor * numDoors;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Door cost", value: `$${formatNumber(doorCost * numDoors)}` },
            { label: "Hardware", value: `$${formatNumber(hardwareCost * numDoors)}` },
            { label: "Installation", value: installCost > 0 ? `$${formatNumber(installCost * numDoors)}` : "DIY" },
            { label: "Trim & weatherstrip", value: `$${formatNumber((weatherstrip + trim) * numDoors)}` },
            { label: "Cost per door", value: `$${formatNumber(perDoor)}` },
            { label: "Number of doors", value: `${numDoors}` },
          ],
        };
      },
    },
    {
      id: "interior",
      name: "Interior Doors",
      fields: [
        { name: "numDoors", label: "Number of Doors", type: "number", placeholder: "e.g. 6" },
        { name: "doorStyle", label: "Door Style", type: "select", options: [
          { label: "Hollow-core ($50-$150)", value: "100" },
          { label: "Solid-core ($100-$300)", value: "200" },
          { label: "Solid wood ($200-$800)", value: "400" },
          { label: "Barn door ($150-$600)", value: "350" },
          { label: "French interior ($200-$700)", value: "450" },
        ], defaultValue: "200" },
        { name: "prehung", label: "Door Type", type: "select", options: [
          { label: "Prehung (with frame)", value: "1.3" },
          { label: "Slab only (existing frame)", value: "1.0" },
        ], defaultValue: "1.3" },
        { name: "hardware", label: "Hardware", type: "select", options: [
          { label: "Basic knob ($10-$25)", value: "15" },
          { label: "Standard lever ($25-$60)", value: "40" },
          { label: "Premium hardware ($60-$150)", value: "100" },
        ], defaultValue: "40" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($100-$250/door)", value: "175" },
        ], defaultValue: "175" },
      ],
      calculate: (inputs) => {
        const numDoors = inputs.numDoors as number;
        const doorCost = parseInt(inputs.doorStyle as string) || 200;
        const prehungFactor = parseFloat(inputs.prehung as string) || 1.0;
        const hardwareCost = parseInt(inputs.hardware as string) || 40;
        const installCost = parseInt(inputs.installation as string) || 0;
        if (!numDoors) return null;
        const perDoor = doorCost * prehungFactor + hardwareCost + installCost + 30; // +30 for trim/paint touch-up
        const totalCost = perDoor * numDoors;
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Door cost", value: `$${formatNumber(doorCost * prehungFactor * numDoors)}` },
            { label: "Hardware", value: `$${formatNumber(hardwareCost * numDoors)}` },
            { label: "Installation", value: installCost > 0 ? `$${formatNumber(installCost * numDoors)}` : "DIY" },
            { label: "Trim & touch-up", value: `$${formatNumber(30 * numDoors)}` },
            { label: "Cost per door", value: `$${formatNumber(perDoor)}` },
            { label: "Number of doors", value: `${numDoors}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["window-replacement-cost-calculator", "garage-door-cost-calculator", "room-paint-cost-calculator"],
  faq: [
    { question: "How much does it cost to replace a door?", answer: "Interior doors: $150-$600 installed ($50-$400 for door + $100-$250 labor). Exterior entry doors: $500-$2,500 installed. Fiberglass and steel are most popular for exteriors. Prehung doors cost more but are easier to install than slab-only doors." },
  ],
  formula: "Total = (Door Cost × Prehung Factor + Hardware + Installation + Trim) × Number of Doors",
};
