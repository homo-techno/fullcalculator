import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelPackingCalculator: CalculatorDefinition = {
  slug: "travel-packing-calculator",
  title: "Travel Packing List Calculator",
  description:
    "Free travel packing list calculator. Get a customized packing list based on trip length, climate, activities, and destination type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel packing list",
    "packing calculator",
    "what to pack",
    "trip packing",
    "suitcase planner",
  ],
  variants: [
    {
      id: "clothing",
      name: "Clothing Items Calculator",
      description: "Calculate how many clothing items to pack",
      fields: [
        {
          name: "tripDays",
          label: "Trip Length (days)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "climate",
          label: "Destination Climate",
          type: "select",
          options: [
            { label: "Tropical / Hot (80-100F)", value: "hot" },
            { label: "Warm / Moderate (65-80F)", value: "warm" },
            { label: "Cool / Mild (45-65F)", value: "cool" },
            { label: "Cold / Winter (below 45F)", value: "cold" },
            { label: "Mixed / Variable", value: "mixed" },
          ],
          defaultValue: "warm",
        },
        {
          name: "laundry",
          label: "Laundry Access",
          type: "select",
          options: [
            { label: "No laundry available", value: "none" },
            { label: "Laundry every 5 days", value: "5" },
            { label: "Laundry every 3 days", value: "3" },
            { label: "Daily laundry", value: "1" },
          ],
          defaultValue: "none",
        },
        {
          name: "tripType",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "Business", value: "business" },
            { label: "Casual vacation", value: "casual" },
            { label: "Beach / Resort", value: "beach" },
            { label: "Adventure / Hiking", value: "adventure" },
            { label: "City sightseeing", value: "city" },
          ],
          defaultValue: "casual",
        },
      ],
      calculate: (inputs) => {
        const tripDays = inputs.tripDays as number;
        const climate = inputs.climate as string;
        const laundry = inputs.laundry as string;
        const tripType = inputs.tripType as string;
        if (!tripDays || tripDays <= 0) return null;

        const laundryCycle = laundry === "none" ? tripDays : parseInt(laundry);
        const packDays = Math.min(tripDays, laundryCycle + 1);

        const tops = Math.min(packDays, 10);
        const bottoms = Math.min(Math.ceil(packDays * 0.5), 5);
        const underwear = Math.min(packDays + 1, 14);
        const socks = Math.min(packDays + 1, 14);
        const sleepwear = Math.min(2, Math.ceil(packDays / 5));

        let extras = 0;
        let extraItems = "";
        if (climate === "cold" || climate === "mixed") {
          extras += 2;
          extraItems += "2 sweaters/layers, ";
        }
        if (climate === "cold") {
          extras += 1;
          extraItems += "1 heavy coat, ";
        }
        if (tripType === "beach") {
          extras += 2;
          extraItems += "2 swimsuits, ";
        }
        if (tripType === "business") {
          extras += 1;
          extraItems += "1 formal outfit, ";
        }
        if (tripType === "adventure") {
          extras += 2;
          extraItems += "2 athletic outfits, ";
        }

        const totalItems = tops + bottoms + underwear + socks + sleepwear + extras;
        const jackets = climate === "cold" ? 2 : climate === "cool" || climate === "mixed" ? 1 : 0;

        return {
          primary: {
            label: "Total Clothing Items",
            value: `${formatNumber(totalItems, 0)} items`,
          },
          details: [
            { label: "Tops/shirts", value: `${tops}` },
            { label: "Bottoms (pants/shorts)", value: `${bottoms}` },
            { label: "Underwear", value: `${underwear}` },
            { label: "Socks (pairs)", value: `${socks}` },
            { label: "Sleepwear", value: `${sleepwear}` },
            { label: "Jackets/outerwear", value: `${jackets}` },
            { label: "Extra items", value: extraItems || "None" },
            { label: "Pack for days", value: `${packDays} (laundry every ${laundryCycle} days)` },
            { label: "Total items", value: `${formatNumber(totalItems, 0)}` },
          ],
          note: `Pack for ${packDays} days with laundry every ${laundryCycle} days. Use the capsule wardrobe approach: choose items in 2-3 coordinating colors that mix and match.`,
        };
      },
    },
    {
      id: "weight",
      name: "Packing Weight Estimate",
      description: "Estimate total luggage weight from packed items",
      fields: [
        {
          name: "clothingItems",
          label: "Number of Clothing Items",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "shoes",
          label: "Pairs of Shoes",
          type: "select",
          options: [
            { label: "1 pair", value: "1" },
            { label: "2 pairs", value: "2" },
            { label: "3 pairs", value: "3" },
            { label: "4 pairs", value: "4" },
          ],
          defaultValue: "2",
        },
        {
          name: "toiletries",
          label: "Toiletry Kit Size",
          type: "select",
          options: [
            { label: "Minimal (travel-size only)", value: "1" },
            { label: "Standard", value: "2" },
            { label: "Full-size products", value: "3.5" },
          ],
          defaultValue: "2",
        },
        {
          name: "electronics",
          label: "Electronics",
          type: "select",
          options: [
            { label: "Phone + charger only", value: "0.5" },
            { label: "Laptop + phone", value: "3" },
            { label: "Laptop + camera + phone", value: "5" },
            { label: "Heavy gear (DSLR, drone, etc.)", value: "8" },
          ],
          defaultValue: "3",
        },
        {
          name: "suitcaseWeight",
          label: "Empty Suitcase Weight (lbs)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const clothingItems = inputs.clothingItems as number;
        const shoes = parseInt(inputs.shoes as string) || 2;
        const toiletries = parseFloat(inputs.toiletries as string) || 2;
        const electronics = parseFloat(inputs.electronics as string) || 3;
        const suitcaseWeight = (inputs.suitcaseWeight as number) || 8;
        if (!clothingItems || clothingItems <= 0) return null;

        const avgClothingWeight = 0.4;
        const avgShoeWeight = 1.5;
        const clothingLbs = clothingItems * avgClothingWeight;
        const shoesLbs = shoes * avgShoeWeight;
        const toiletriesLbs = toiletries;
        const electronicsLbs = electronics;
        const miscLbs = 2;

        const contentsWeight = clothingLbs + shoesLbs + toiletriesLbs + electronicsLbs + miscLbs;
        const totalWeight = contentsWeight + suitcaseWeight;
        const totalKg = totalWeight * 0.453592;

        return {
          primary: {
            label: "Estimated Total Weight",
            value: `${formatNumber(totalWeight, 1)} lbs (${formatNumber(totalKg, 1)} kg)`,
          },
          details: [
            { label: "Clothing", value: `${formatNumber(clothingLbs, 1)} lbs` },
            { label: "Shoes", value: `${formatNumber(shoesLbs, 1)} lbs` },
            { label: "Toiletries", value: `${formatNumber(toiletriesLbs, 1)} lbs` },
            { label: "Electronics", value: `${formatNumber(electronicsLbs, 1)} lbs` },
            { label: "Misc (books, snacks, etc.)", value: `${formatNumber(miscLbs, 1)} lbs` },
            { label: "Suitcase", value: `${formatNumber(suitcaseWeight, 1)} lbs` },
            { label: "Total weight", value: `${formatNumber(totalWeight, 1)} lbs / ${formatNumber(totalKg, 1)} kg` },
          ],
          note: totalKg > 23
            ? "Warning: Your bag may exceed the standard 23 kg (50 lbs) checked luggage limit. Consider removing items."
            : `Your estimated weight of ${formatNumber(totalKg, 1)} kg is within the standard 23 kg checked luggage limit.`,
        };
      },
    },
  ],
  relatedSlugs: ["luggage-weight-calculator", "carry-on-size-calculator"],
  faq: [
    {
      question: "How do I pack light for a long trip?",
      answer:
        "Use a capsule wardrobe of 2-3 colors that mix and match. Pack for 5-7 days and do laundry. Choose quick-dry fabrics. Wear your bulkiest items on the plane. Use packing cubes. Roll clothes instead of folding. Leave room for souvenirs.",
    },
    {
      question: "What items are commonly forgotten when packing?",
      answer:
        "The most forgotten items include phone chargers, adapters, medications, sunscreen, a rain jacket, comfortable walking shoes, copies of travel documents, snacks for the flight, a reusable water bottle, and ear plugs or a sleep mask.",
    },
    {
      question: "How many shoes should I bring on a trip?",
      answer:
        "For most trips, 2-3 pairs is ideal: comfortable walking shoes, sandals or flip-flops, and one dressier pair if needed. Shoes are heavy and bulky, so limit them. Wear the heaviest pair on the plane.",
    },
  ],
  formula:
    "Pack Days = min(Trip Days, Laundry Cycle + 1); Tops = min(Pack Days, 10); Bottoms = min(ceil(Pack Days x 0.5), 5); Weight = Items x 0.4 lbs avg.",
};
