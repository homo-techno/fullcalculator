import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lumensToWattsCalculator: CalculatorDefinition = {
  slug: "lumens-to-watts-calculator",
  title: "Lumens to Watts Converter",
  description:
    "Convert lumens to watts and watts to lumens for LED, CFL, halogen, and incandescent bulbs. Find the right bulb brightness for your lighting needs.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "lumens to watts",
    "watts to lumens",
    "LED watt equivalent",
    "light bulb converter",
    "brightness calculator",
  ],
  variants: [
    {
      id: "lumens-to-watts",
      name: "Lumens to Watts",
      description: "Convert lumens (brightness) to watts for different bulb types",
      fields: [
        {
          name: "lumens",
          label: "Lumens (brightness)",
          type: "number",
          placeholder: "e.g. 800",
        },
        {
          name: "bulbType",
          label: "Bulb Type",
          type: "select",
          options: [
            { label: "LED", value: "led" },
            { label: "CFL (Compact Fluorescent)", value: "cfl" },
            { label: "Halogen", value: "halogen" },
            { label: "Incandescent", value: "incandescent" },
          ],
          defaultValue: "led",
        },
      ],
      calculate: (inputs) => {
        const lumens = parseFloat(inputs.lumens as string);
        const bulbType = inputs.bulbType as string;
        if (!lumens) return null;

        // Lumens per watt efficiency for each bulb type
        const efficiency: Record<string, number> = {
          led: 90,
          cfl: 60,
          halogen: 20,
          incandescent: 14,
        };

        const eff = efficiency[bulbType] || 90;
        const watts = lumens / eff;

        // Calculate equivalent watts for all types
        const ledWatts = lumens / efficiency.led;
        const cflWatts = lumens / efficiency.cfl;
        const halogenWatts = lumens / efficiency.halogen;
        const incandescentWatts = lumens / efficiency.incandescent;

        // Annual cost estimate (3 hrs/day, $0.12/kWh)
        const annualHours = 3 * 365;
        const annualCost = (watts / 1000) * annualHours * 0.12;
        const annualCostIncandescent = (incandescentWatts / 1000) * annualHours * 0.12;

        return {
          primary: {
            label: `${bulbType.toUpperCase()} Watts`,
            value: `${formatNumber(watts, 1)} W`,
          },
          details: [
            { label: "LED equivalent", value: `${formatNumber(ledWatts, 1)} W` },
            { label: "CFL equivalent", value: `${formatNumber(cflWatts, 1)} W` },
            { label: "Halogen equivalent", value: `${formatNumber(halogenWatts, 1)} W` },
            { label: "Incandescent equivalent", value: `${formatNumber(incandescentWatts, 1)} W` },
            { label: "Annual cost (LED, 3hrs/day)", value: `$${formatNumber((ledWatts / 1000) * annualHours * 0.12, 2)}` },
            { label: "Annual cost (incandescent)", value: `$${formatNumber(annualCostIncandescent, 2)}` },
          ],
          note: "Efficiency varies by specific bulb model. LED: 70-120 lm/W, CFL: 50-70 lm/W, Halogen: 15-25 lm/W, Incandescent: 10-17 lm/W.",
        };
      },
    },
    {
      id: "watts-to-lumens",
      name: "Watts to Lumens",
      description: "Convert watts to lumens for different bulb types",
      fields: [
        {
          name: "watts",
          label: "Watts",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "bulbType",
          label: "Original Bulb Type",
          type: "select",
          options: [
            { label: "Incandescent (replacing old bulb)", value: "incandescent" },
            { label: "LED", value: "led" },
            { label: "CFL", value: "cfl" },
            { label: "Halogen", value: "halogen" },
          ],
          defaultValue: "incandescent",
        },
      ],
      calculate: (inputs) => {
        const watts = parseFloat(inputs.watts as string);
        const bulbType = inputs.bulbType as string;
        if (!watts) return null;

        const efficiency: Record<string, number> = {
          led: 90,
          cfl: 60,
          halogen: 20,
          incandescent: 14,
        };

        const lumens = watts * (efficiency[bulbType] || 14);
        const ledReplacement = lumens / efficiency.led;

        return {
          primary: {
            label: "Brightness",
            value: `${formatNumber(lumens)} lumens`,
          },
          details: [
            { label: "Lumens output", value: formatNumber(lumens) },
            { label: "LED replacement wattage", value: `${formatNumber(ledReplacement, 1)} W` },
            { label: "Energy savings (LED vs original)", value: `${formatNumber(watts - ledReplacement, 1)} W (${formatNumber(((watts - ledReplacement) / watts) * 100, 0)}%)` },
          ],
          note: `A ${formatNumber(watts)}W ${bulbType} bulb produces about ${formatNumber(lumens)} lumens. Replace with a ${formatNumber(ledReplacement, 0)}W LED for the same brightness.`,
        };
      },
    },
    {
      id: "room-lighting",
      name: "Room Lighting Guide",
      description: "Calculate total lumens needed for a room",
      fields: [
        {
          name: "roomSqFt",
          label: "Room Size (sq ft)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "roomType",
          label: "Room Type",
          type: "select",
          options: [
            { label: "Bedroom (10-20 lm/sqft)", value: "15" },
            { label: "Living Room (10-20 lm/sqft)", value: "15" },
            { label: "Kitchen (30-40 lm/sqft)", value: "35" },
            { label: "Bathroom (70-80 lm/sqft)", value: "75" },
            { label: "Office/Study (40-50 lm/sqft)", value: "45" },
            { label: "Garage/Workshop (50-80 lm/sqft)", value: "65" },
          ],
          defaultValue: "35",
        },
      ],
      calculate: (inputs) => {
        const roomSqFt = parseFloat(inputs.roomSqFt as string);
        const lumensPerSqFt = parseFloat(inputs.roomType as string);
        if (!roomSqFt || !lumensPerSqFt) return null;

        const totalLumens = roomSqFt * lumensPerSqFt;
        const ledWatts = totalLumens / 90;
        const num800lmBulbs = Math.ceil(totalLumens / 800);
        const num1600lmBulbs = Math.ceil(totalLumens / 1600);

        return {
          primary: {
            label: "Total Lumens Needed",
            value: `${formatNumber(totalLumens)} lumens`,
          },
          details: [
            { label: "Room area", value: `${formatNumber(roomSqFt)} sq ft` },
            { label: "Lumens per sq ft", value: formatNumber(lumensPerSqFt) },
            { label: "Total lumens needed", value: formatNumber(totalLumens) },
            { label: "Total LED watts", value: `${formatNumber(ledWatts, 1)} W` },
            { label: "800-lumen bulbs (60W equiv)", value: formatNumber(num800lmBulbs) },
            { label: "1600-lumen bulbs (100W equiv)", value: formatNumber(num1600lmBulbs) },
          ],
          note: "Lumens requirements vary by task. Ambient lighting needs less; task lighting (reading, cooking) needs more. Layer multiple light sources for best results.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-calculator", "energy-calculator", "unit-converter"],
  faq: [
    {
      question: "How many lumens is a 60-watt bulb?",
      answer:
        "A traditional 60-watt incandescent bulb produces about 800 lumens. To get the same brightness from an LED, you only need about 9-10 watts. A CFL would use about 13 watts for the same 800 lumens.",
    },
    {
      question: "How do I choose the right LED bulb brightness?",
      answer:
        "Look for lumens, not watts. For a 40W replacement, look for 450 lumens. For 60W, look for 800 lumens. For 75W, look for 1,100 lumens. For 100W, look for 1,600 lumens. The lumen count is printed on every bulb package.",
    },
  ],
  formula:
    "Watts = Lumens / Efficiency(lm/W) | Lumens = Watts x Efficiency | LED ~90 lm/W | CFL ~60 lm/W | Incandescent ~14 lm/W",
};
