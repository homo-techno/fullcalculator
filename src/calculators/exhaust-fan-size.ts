import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exhaustFanSizeCalculator: CalculatorDefinition = {
  slug: "exhaust-fan-size-calculator",
  title: "Exhaust / Bathroom Fan Sizing Calculator",
  description:
    "Calculate the correct exhaust fan size in CFM for bathrooms, kitchens, garages, and workshops. Based on room size and ventilation requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "exhaust fan size",
    "exhaust fan CFM",
    "ventilation fan calculator",
    "kitchen exhaust fan",
    "workshop ventilation",
  ],
  variants: [
    {
      id: "by-room",
      name: "Exhaust Fan by Room Type",
      description: "Size an exhaust fan based on room type and dimensions",
      fields: [
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "height",
          label: "Ceiling Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "roomType",
          label: "Room Type",
          type: "select",
          options: [
            { label: "Bathroom (8 ACH)", value: "8" },
            { label: "Kitchen (15 ACH)", value: "15" },
            { label: "Laundry Room (8 ACH)", value: "8" },
            { label: "Garage (4 ACH)", value: "4" },
            { label: "Workshop (10 ACH)", value: "10" },
            { label: "Paint Booth (20 ACH)", value: "20" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const height = parseFloat(inputs.height as string) || 8;
        const ach = parseFloat(inputs.roomType as string);
        if (!length || !width || !ach) return null;

        const volume = length * width * height;
        const cfmNeeded = (volume * ach) / 60;

        // Standard fan sizes
        const standardSizes = [50, 70, 80, 100, 110, 130, 150, 200, 250, 300, 400, 500];
        const recommendedSize = standardSizes.find((s) => s >= cfmNeeded) || Math.ceil(cfmNeeded / 100) * 100;

        // Duct size recommendation
        let ductSize = 4;
        if (recommendedSize > 100) ductSize = 6;
        if (recommendedSize > 250) ductSize = 8;

        // Noise level guide
        let noiseGuide = "1.0-2.0 sones (quiet)";
        if (recommendedSize > 150) noiseGuide = "2.0-4.0 sones (moderate)";
        if (recommendedSize > 300) noiseGuide = "4.0+ sones (louder)";

        return {
          primary: {
            label: "Recommended Fan Size",
            value: `${formatNumber(recommendedSize)} CFM`,
          },
          details: [
            { label: "Room volume", value: `${formatNumber(volume)} cu ft` },
            { label: "Calculated CFM", value: formatNumber(cfmNeeded, 0) },
            { label: "Recommended fan", value: `${formatNumber(recommendedSize)} CFM` },
            { label: "Duct diameter", value: `${formatNumber(ductSize)}" minimum` },
            { label: "Noise guide", value: noiseGuide },
          ],
          note: "For bathrooms, HVI recommends 1 CFM per sq ft (minimum 50 CFM). Kitchen range hoods need 100 CFM per linear foot of range width, minimum.",
        };
      },
    },
    {
      id: "kitchen-hood",
      name: "Kitchen Range Hood",
      description: "Size a kitchen range hood exhaust fan",
      fields: [
        {
          name: "rangeWidth",
          label: "Range/Cooktop Width (inches)",
          type: "select",
          options: [
            { label: '24"', value: "24" },
            { label: '30"', value: "30" },
            { label: '36"', value: "36" },
            { label: '48" (pro)', value: "48" },
          ],
          defaultValue: "30",
        },
        {
          name: "rangeType",
          label: "Range Type",
          type: "select",
          options: [
            { label: "Electric Cooktop", value: "1.0" },
            { label: "Gas Cooktop", value: "1.5" },
            { label: "Commercial-style Gas", value: "2.0" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "ductType",
          label: "Duct Type",
          type: "select",
          options: [
            { label: "Ducted to exterior", value: "ducted" },
            { label: "Ductless (recirculating)", value: "ductless" },
          ],
          defaultValue: "ducted",
        },
      ],
      calculate: (inputs) => {
        const rangeWidth = parseFloat(inputs.rangeWidth as string);
        const rangeType = parseFloat(inputs.rangeType as string);
        const ductType = inputs.ductType as string;
        if (!rangeWidth || !rangeType) return null;

        // Base: 100 CFM per linear foot of range width
        const baseCFM = (rangeWidth / 12) * 100;
        const adjustedCFM = baseCFM * rangeType;
        const minCFM = Math.max(adjustedCFM, 150); // minimum 150 CFM

        const ductlessNote = ductType === "ductless"
          ? " Ductless hoods are less effective; ducted is always preferred."
          : "";

        let ductSize = 6;
        if (minCFM > 400) ductSize = 8;
        if (minCFM > 600) ductSize = 10;

        return {
          primary: {
            label: "Recommended CFM",
            value: `${formatNumber(minCFM, 0)} CFM`,
          },
          details: [
            { label: "Range width", value: `${formatNumber(rangeWidth)} inches` },
            { label: "Base CFM", value: formatNumber(baseCFM, 0) },
            { label: "Adjusted for range type", value: formatNumber(adjustedCFM, 0) },
            { label: "Recommended minimum", value: `${formatNumber(minCFM, 0)} CFM` },
            { label: "Duct size", value: `${formatNumber(ductSize)}" diameter` },
          ],
          note: `For wall-mounted hoods. Island hoods need 50% more CFM. Match hood width to range width or wider.${ductlessNote}`,
        };
      },
    },
  ],
  relatedSlugs: ["cfm-calculator", "bathroom-fan-size-calculator", "ac-tonnage-calculator"],
  faq: [
    {
      question: "What size exhaust fan do I need for my bathroom?",
      answer:
        "The HVI (Home Ventilating Institute) recommends 1 CFM per square foot of bathroom floor area, with a minimum of 50 CFM. For an 8x10 bathroom, you need at least an 80 CFM fan. Bathrooms with a jetted tub should add 50 CFM extra.",
    },
    {
      question: "How loud are exhaust fans?",
      answer:
        "Fan noise is measured in sones. Below 1.0 sone is nearly silent. 1.0-2.0 sones is quiet and comfortable for bathrooms. 2.0-4.0 sones is moderate. Above 4.0 sones is noticeable. Look for fans rated at 1.0 sone or less for bedrooms and bathrooms.",
    },
  ],
  formula:
    "CFM = (Room Volume x ACH) / 60 | Kitchen Hood CFM = Range Width (ft) x 100 x Fuel Factor",
};
