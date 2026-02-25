import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const campingChecklistCost: CalculatorDefinition = {
  slug: "camping-checklist-cost",
  title: "Camping Checklist & Cost Calculator",
  description:
    "Free online camping cost calculator. Estimate camping gear and trip costs including equipment, campsite fees, food, and supplies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "camping cost",
    "camping gear",
    "campsite fees",
    "camping trip budget",
    "outdoor equipment",
  ],
  variants: [
    {
      id: "trip-cost",
      name: "Camping Trip Cost",
      fields: [
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "campers",
          label: "Number of Campers",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "campsiteType",
          label: "Campsite Type",
          type: "select",
          options: [
            { label: "Primitive/Free", value: "primitive" },
            { label: "Basic (State/National Park)", value: "basic" },
            { label: "Full Hookup (RV Park)", value: "hookup" },
            { label: "Glamping", value: "glamping" },
          ],
        },
        {
          name: "hasGear",
          label: "Gear Status",
          type: "select",
          options: [
            { label: "Already Have All Gear", value: "owned" },
            { label: "Need Basic Gear", value: "basic" },
            { label: "Need Full Setup", value: "full" },
          ],
        },
      ],
      calculate: (inputs) => {
        const nights = parseFloat(inputs.nights as string) || 0;
        const campers = parseFloat(inputs.campers as string) || 1;
        const campsiteType = inputs.campsiteType as string;
        const hasGear = inputs.hasGear as string;

        const campsiteCosts: Record<string, number> = {
          primitive: 0,
          basic: 30,
          hookup: 50,
          glamping: 150,
        };

        const gearCosts: Record<string, number> = {
          owned: 0,
          basic: 250,
          full: 600,
        };

        const campsitePerNight = campsiteCosts[campsiteType] || 30;
        const totalCampsite = campsitePerNight * nights;
        const gearCost = gearCosts[hasGear] || 0;
        const foodPerPersonPerDay = 15;
        const totalFood = foodPerPersonPerDay * campers * (nights + 1);
        const firewood = nights * 8;
        const supplies = campers * 10;
        const fuelEstimate = 50;
        const totalCost = totalCampsite + gearCost + totalFood + firewood + supplies + fuelEstimate;
        const perPerson = totalCost / campers;

        return {
          primary: { label: "Total Trip Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Campsite Fees", value: "$" + formatNumber(totalCampsite, 2) },
            { label: "Gear Investment", value: "$" + formatNumber(gearCost, 2) },
            { label: "Food & Drinks", value: "$" + formatNumber(totalFood, 2) },
            { label: "Firewood", value: "$" + formatNumber(firewood, 2) },
            { label: "Supplies & Misc", value: "$" + formatNumber(supplies, 2) },
            { label: "Fuel (est.)", value: "$" + formatNumber(fuelEstimate, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
          ],
        };
      },
    },
    {
      id: "gear-cost",
      name: "Camping Gear Cost Estimator",
      fields: [
        {
          name: "gearLevel",
          label: "Quality Level",
          type: "select",
          options: [
            { label: "Budget", value: "budget" },
            { label: "Mid-Range", value: "midrange" },
            { label: "Premium", value: "premium" },
          ],
        },
        {
          name: "campingStyle",
          label: "Camping Style",
          type: "select",
          options: [
            { label: "Car Camping", value: "car" },
            { label: "Backpacking", value: "backpacking" },
            { label: "Family Camping", value: "family" },
          ],
        },
      ],
      calculate: (inputs) => {
        const gearLevel = inputs.gearLevel as string;
        const campingStyle = inputs.campingStyle as string;

        const tentCost: Record<string, Record<string, number>> = {
          car: { budget: 50, midrange: 150, premium: 400 },
          backpacking: { budget: 80, midrange: 250, premium: 500 },
          family: { budget: 100, midrange: 250, premium: 600 },
        };

        const sleepingBag: Record<string, number> = { budget: 30, midrange: 100, premium: 250 };
        const pad: Record<string, number> = { budget: 20, midrange: 60, premium: 150 };
        const cookware: Record<string, number> = { budget: 25, midrange: 75, premium: 200 };
        const misc: Record<string, number> = { budget: 30, midrange: 80, premium: 200 };

        const tent = (tentCost[campingStyle] || tentCost.car)[gearLevel] || 150;
        const bag = sleepingBag[gearLevel] || 100;
        const padCost = pad[gearLevel] || 60;
        const cook = cookware[gearLevel] || 75;
        const miscCost = misc[gearLevel] || 80;
        const total = tent + bag + padCost + cook + miscCost;

        return {
          primary: { label: "Total Gear Cost", value: "$" + formatNumber(total, 2) },
          details: [
            { label: "Tent", value: "$" + formatNumber(tent, 2) },
            { label: "Sleeping Bag", value: "$" + formatNumber(bag, 2) },
            { label: "Sleeping Pad", value: "$" + formatNumber(padCost, 2) },
            { label: "Cookware & Stove", value: "$" + formatNumber(cook, 2) },
            { label: "Misc (Headlamp, First Aid, etc.)", value: "$" + formatNumber(miscCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["backpacking-cost", "road-trip-cost", "altitude-adjustment"],
  faq: [
    {
      question: "How much does a camping trip cost?",
      answer:
        "A basic camping trip costs $50-$200 for a weekend if you already have gear. Campsite fees range from free (dispersed camping) to $30-50/night for developed sites. Food typically runs $15/person/day.",
    },
    {
      question: "What gear do I need for camping?",
      answer:
        "Essential gear includes a tent, sleeping bag, sleeping pad, headlamp, camp stove, cookware, cooler, first aid kit, and weather-appropriate clothing. A basic setup costs $150-$400.",
    },
    {
      question: "Is camping cheaper than a hotel?",
      answer:
        "Yes, camping is significantly cheaper. A campsite costs $0-50/night compared to $100-300+ for a hotel. Over time, gear pays for itself in just a few trips.",
    },
  ],
  formula:
    "Total Cost = Campsite Fees + Gear Cost + (Food/Person/Day x Campers x Days) + Firewood + Supplies + Fuel",
};
