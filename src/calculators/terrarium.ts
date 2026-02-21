import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const terrariumCalculator: CalculatorDefinition = {
  slug: "terrarium-calculator",
  title: "Terrarium Calculator",
  description:
    "Free terrarium calculator. Calculate container volume, substrate, drainage layer, and soil amounts for your terrarium build.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "terrarium",
    "terrarium substrate",
    "terrarium soil",
    "plant terrarium",
    "drainage layer",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "diameter",
          label: "Container Diameter (inches)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "height",
          label: "Container Height (inches)",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const height = inputs.height as number;
        if (!diameter || !height || diameter <= 0 || height <= 0) return null;

        const radius = diameter / 2;
        const totalVolumeCuIn = Math.PI * radius * radius * height;
        const totalVolumeGal = totalVolumeCuIn / 231;
        const totalVolumeLiters = totalVolumeGal * 3.78541;

        // Drainage layer: 1 inch of pebbles at the bottom
        const drainageHeight = 1;
        const drainageVolume = Math.PI * radius * radius * drainageHeight;
        const drainageGal = drainageVolume / 231;

        // Substrate: 1/3 of the remaining height
        const remainingHeight = height - drainageHeight;
        const substrateHeight = remainingHeight / 3;
        const substrateVolume = Math.PI * radius * radius * substrateHeight;
        const substrateGal = substrateVolume / 231;

        // Charcoal layer: 0.5 inch
        const charcoalHeight = 0.5;
        const charcoalVolume = Math.PI * radius * radius * charcoalHeight;
        const charcoalCups = (charcoalVolume / 231) * 16;

        // Soil (part of substrate)
        const soilHeight = substrateHeight - charcoalHeight;
        const soilVolume = Math.PI * radius * radius * Math.max(soilHeight, 0);
        const soilGal = soilVolume / 231;

        return {
          primary: {
            label: "Total Container Volume",
            value: formatNumber(totalVolumeLiters, 1) + " liters",
          },
          details: [
            {
              label: "Volume (gallons)",
              value: formatNumber(totalVolumeGal, 1) + " gal",
            },
            {
              label: "Drainage Layer (1\")",
              value: formatNumber(drainageGal, 2) + " gal of pebbles",
            },
            {
              label: "Charcoal Layer (0.5\")",
              value: formatNumber(charcoalCups, 1) + " cups",
            },
            {
              label: "Soil Layer (" + formatNumber(soilHeight, 1) + "\")",
              value: formatNumber(soilGal, 2) + " gal of potting mix",
            },
            {
              label: "Total Substrate Height",
              value: formatNumber(drainageHeight + substrateHeight, 1) + " inches",
            },
            {
              label: "Open Space for Plants",
              value:
                formatNumber(height - drainageHeight - substrateHeight, 1) + " inches",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-calculator"],
  faq: [
    {
      question: "How deep should terrarium substrate be?",
      answer:
        "The total substrate (including drainage) should fill about 1/3 of the container height. Use a 1-inch drainage layer of pebbles, a thin layer of activated charcoal, then potting soil on top.",
    },
    {
      question: "Do I need a drainage layer in a terrarium?",
      answer:
        "Yes. Since most terrariums have no drainage holes, a 1-inch layer of pebbles or LECA at the bottom prevents root rot by allowing excess water to collect away from the soil.",
    },
  ],
  formula:
    "Volume = pi x (diameter/2)^2 x height. Drainage layer = 1 inch of pebbles. Substrate = 1/3 of remaining height (charcoal 0.5\" + soil). Volumes converted: cubic inches / 231 = gallons.",
};
