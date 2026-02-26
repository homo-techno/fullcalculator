import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bathroomFanSizeCalculator: CalculatorDefinition = {
  slug: "bathroom-fan-size-calculator",
  title: "Bathroom Ventilation Fan CFM Calculator",
  description:
    "Calculate the correct bathroom exhaust fan size in CFM. Based on bathroom square footage, fixtures, and HVI ventilation standards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bathroom fan size",
    "bathroom exhaust CFM",
    "bathroom ventilation",
    "bath fan calculator",
    "bathroom vent fan sizing",
  ],
  variants: [
    {
      id: "by-sqft",
      name: "By Bathroom Size",
      description: "Size a bath fan using the 1 CFM per sq ft rule",
      fields: [
        {
          name: "length",
          label: "Bathroom Length (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "width",
          label: "Bathroom Width (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "ceilingHeight",
          label: "Ceiling Height (feet)",
          type: "select",
          options: [
            { label: "8 ft (standard)", value: "8" },
            { label: "9 ft", value: "9" },
            { label: "10 ft", value: "10" },
            { label: "12 ft (vaulted)", value: "12" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const ceilingHeight = parseFloat(inputs.ceilingHeight as string) || 8;
        if (!length || !width) return null;

        const sqFt = length * width;
        // HVI recommends 1 CFM per sq ft for bathrooms up to 100 sq ft
        const baseCFM = Math.max(sqFt, 50); // minimum 50 CFM

        // Adjust for ceiling height above 8 ft
        const heightFactor = ceilingHeight / 8;
        const adjustedCFM = Math.ceil(baseCFM * heightFactor);

        // Standard fan sizes
        const standardSizes = [50, 70, 80, 100, 110, 130, 150];
        const recommendedSize = standardSizes.find((s) => s >= adjustedCFM) || adjustedCFM;

        // 8 ACH check
        const volume = sqFt * ceilingHeight;
        const cfmFor8ACH = Math.ceil((volume * 8) / 60);

        return {
          primary: {
            label: "Recommended Fan Size",
            value: `${formatNumber(recommendedSize)} CFM`,
          },
          details: [
            { label: "Bathroom area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Room volume", value: `${formatNumber(volume)} cu ft` },
            { label: "Base CFM (1/sqft)", value: formatNumber(baseCFM) },
            { label: "Adjusted for ceiling height", value: formatNumber(adjustedCFM) },
            { label: "CFM for 8 ACH", value: formatNumber(cfmFor8ACH) },
            { label: "Recommended fan", value: `${formatNumber(recommendedSize)} CFM` },
          ],
          note: "HVI standard: 1 CFM per square foot (minimum 50 CFM) for bathrooms up to 100 sq ft. For larger bathrooms, calculate by fixture count instead.",
        };
      },
    },
    {
      id: "by-fixtures",
      name: "By Fixture Count",
      description: "Size a bath fan for larger bathrooms using the fixture method",
      fields: [
        {
          name: "numToilets",
          label: "Toilets",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
        {
          name: "numShowers",
          label: "Showers",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
        {
          name: "numTubs",
          label: "Bathtubs",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 0,
        },
        {
          name: "hasJettedTub",
          label: "Jetted/Soaking Tub",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const numToilets = parseFloat(inputs.numToilets as string) || 0;
        const numShowers = parseFloat(inputs.numShowers as string) || 0;
        const numTubs = parseFloat(inputs.numTubs as string) || 0;
        const hasJetted = parseFloat(inputs.hasJettedTub as string) || 0;

        // HVI fixture method: 50 CFM per toilet, shower, or tub
        const toiletCFM = numToilets * 50;
        const showerCFM = numShowers * 50;
        const tubCFM = numTubs * 50;
        const jettedCFM = hasJetted * 50; // extra 50 CFM for jetted tub

        const totalCFM = Math.max(toiletCFM + showerCFM + tubCFM + jettedCFM, 50);

        const standardSizes = [50, 70, 80, 100, 110, 130, 150, 200, 250, 300];
        const recommendedSize = standardSizes.find((s) => s >= totalCFM) || totalCFM;

        // Duct size
        let ductSize = 4;
        if (recommendedSize > 100) ductSize = 6;

        return {
          primary: {
            label: "Recommended Fan Size",
            value: `${formatNumber(recommendedSize)} CFM`,
          },
          details: [
            { label: "Toilet ventilation", value: `${formatNumber(toiletCFM)} CFM (${formatNumber(numToilets)} x 50)` },
            { label: "Shower ventilation", value: `${formatNumber(showerCFM)} CFM (${formatNumber(numShowers)} x 50)` },
            { label: "Tub ventilation", value: `${formatNumber(tubCFM)} CFM (${formatNumber(numTubs)} x 50)` },
            { label: "Jetted tub extra", value: `${formatNumber(jettedCFM)} CFM` },
            { label: "Total calculated", value: `${formatNumber(totalCFM)} CFM` },
            { label: "Recommended fan", value: `${formatNumber(recommendedSize)} CFM` },
            { label: "Minimum duct size", value: `${formatNumber(ductSize)}" diameter` },
          ],
          note: "For master bathrooms or bathrooms over 100 sq ft, the fixture method is more accurate. You can use one large fan or multiple smaller fans in a multi-fixture bathroom.",
        };
      },
    },
  ],
  relatedSlugs: ["exhaust-fan-size-calculator", "cfm-calculator", "ac-tonnage-calculator"],
  faq: [
    {
      question: "What size bathroom fan do I need?",
      answer:
        "For bathrooms up to 100 sq ft, use 1 CFM per square foot (minimum 50 CFM). For larger bathrooms, add 50 CFM for each toilet, shower, and bathtub. Add another 50 CFM if you have a jetted tub. A standard 8x10 bathroom needs an 80 CFM fan.",
    },
    {
      question: "Should I run the bathroom fan during a shower?",
      answer:
        "Yes, run the bathroom fan during and for 20-30 minutes after a shower to properly remove moisture. A humidity-sensing fan switch can automate this. Proper ventilation prevents mold growth, paint peeling, and structural moisture damage.",
    },
    {
      question: "Can a bathroom fan be too big?",
      answer:
        "A slightly oversized fan is better than undersized. However, a drastically oversized fan can depressurize the bathroom, potentially causing backdrafting from water heaters or furnaces. Stay within 20% of the calculated CFM for best results.",
    },
  ],
  formula:
    "Small Bath: CFM = Sq Ft x 1 (min 50) | Large Bath: CFM = (Toilets + Showers + Tubs) x 50 + 50 if jetted tub",
};
