import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishingRodWeightCalculator: CalculatorDefinition = {
  slug: "fishing-rod-weight-calculator",
  title: "Fishing Rod & Line Size Calculator",
  description:
    "Free fishing rod, line, and lure size selector. Find the right rod power, line weight, and lure size based on your target species and fishing conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fishing rod calculator",
    "fishing line weight",
    "lure size calculator",
    "rod power selector",
    "fishing tackle calculator",
  ],
  variants: [
    {
      id: "species-match",
      name: "Species-Based Selector",
      description: "Get rod/line/lure recommendations by target species",
      fields: [
        {
          name: "species",
          label: "Target Species",
          type: "select",
          options: [
            { label: "Panfish / Crappie", value: "panfish" },
            { label: "Trout", value: "trout" },
            { label: "Bass (Largemouth)", value: "bass" },
            { label: "Walleye", value: "walleye" },
            { label: "Pike / Musky", value: "pike" },
            { label: "Catfish", value: "catfish" },
            { label: "Salmon / Steelhead", value: "salmon" },
            { label: "Redfish / Snook (Inshore)", value: "inshore" },
            { label: "Offshore (Tuna / Mahi)", value: "offshore" },
          ],
          defaultValue: "bass",
        },
        {
          name: "technique",
          label: "Technique",
          type: "select",
          options: [
            { label: "Casting", value: "casting" },
            { label: "Spinning", value: "spinning" },
            { label: "Trolling", value: "trolling" },
            { label: "Fly Fishing", value: "fly" },
          ],
          defaultValue: "spinning",
        },
      ],
      calculate: (inputs) => {
        const species = inputs.species as string;
        const technique = inputs.technique as string;

        const specData: Record<string, { rod: string; power: string; line: string; lure: string; leader: string }> = {
          panfish: { rod: "5'6\" - 6'6\" Ultralight", power: "Ultra-Light", line: "2-6 lb mono", lure: "1/64 - 1/8 oz", leader: "None needed" },
          trout: { rod: "6' - 7' Light", power: "Light", line: "4-8 lb mono/fluoro", lure: "1/16 - 3/8 oz", leader: "4-6 lb fluoro" },
          bass: { rod: "6'6\" - 7'6\" Medium-Heavy", power: "Medium to Medium-Heavy", line: "10-17 lb mono/fluoro or 30-50 lb braid", lure: "1/4 - 1 oz", leader: "12-15 lb fluoro" },
          walleye: { rod: "6'6\" - 7' Medium-Light", power: "Medium-Light", line: "6-10 lb mono/fluoro", lure: "1/8 - 1/2 oz", leader: "6-8 lb fluoro" },
          pike: { rod: "7' - 8' Heavy", power: "Medium-Heavy to Heavy", line: "17-30 lb mono or 50-80 lb braid", lure: "1/2 - 3 oz", leader: "Steel leader required" },
          catfish: { rod: "7' - 8' Heavy", power: "Medium-Heavy to Heavy", line: "20-50 lb mono or 50-80 lb braid", lure: "1 - 4 oz sinkers", leader: "30-50 lb mono" },
          salmon: { rod: "8'6\" - 10'6\" Medium-Heavy", power: "Medium to Medium-Heavy", line: "12-20 lb mono or 30-50 lb braid", lure: "1/2 - 2 oz", leader: "12-20 lb fluoro" },
          inshore: { rod: "7' - 7'6\" Medium", power: "Medium to Medium-Heavy", line: "10-20 lb braid", lure: "1/4 - 1 oz", leader: "20-30 lb fluoro" },
          offshore: { rod: "6' - 7' Heavy", power: "Heavy to Extra-Heavy", line: "50-80 lb braid or 30-50 lb mono", lure: "2 - 8 oz", leader: "60-100 lb fluoro/wire" },
        };

        const data = specData[species] || specData.bass;

        let flyWeight = "";
        if (technique === "fly") {
          const flyMap: Record<string, string> = {
            panfish: "2-4 weight", trout: "4-5 weight", bass: "6-8 weight",
            walleye: "5-6 weight", pike: "8-10 weight", catfish: "8-10 weight",
            salmon: "7-9 weight", inshore: "7-9 weight", offshore: "10-14 weight",
          };
          flyWeight = flyMap[species] || "6 weight";
        }

        const details = [
          { label: "Rod Length & Class", value: data.rod },
          { label: "Rod Power", value: data.power },
          { label: "Line Weight", value: data.line },
          { label: "Lure Weight Range", value: data.lure },
          { label: "Leader", value: data.leader },
        ];

        if (technique === "fly") {
          details.push({ label: "Fly Rod Weight", value: flyWeight });
        }

        return {
          primary: {
            label: "Recommended Setup",
            value: data.power + " Rod",
          },
          details,
          note: "Recommendations are general guidelines. Adjust based on specific conditions, water clarity, and local regulations.",
        };
      },
    },
    {
      id: "line-diameter",
      name: "Line Strength Calculator",
      description: "Calculate line diameter and breaking strength",
      fields: [
        {
          name: "lineType",
          label: "Line Type",
          type: "select",
          options: [
            { label: "Monofilament", value: "mono" },
            { label: "Fluorocarbon", value: "fluoro" },
            { label: "Braided", value: "braid" },
          ],
          defaultValue: "mono",
        },
        {
          name: "targetLbs",
          label: "Target Breaking Strength (lbs)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          max: 200,
        },
      ],
      calculate: (inputs) => {
        const lineType = inputs.lineType as string;
        const targetLbs = parseFloat(inputs.targetLbs as string);
        if (!targetLbs) return null;

        // Approximate diameter in mm based on line type and strength
        let diameter: number;
        let visibility: string;
        let stretch: string;
        let abrasionResistance: string;

        if (lineType === "mono") {
          diameter = 0.1 * Math.pow(targetLbs, 0.45);
          visibility = "Medium";
          stretch = "High (25-30%)";
          abrasionResistance = "Good";
        } else if (lineType === "fluoro") {
          diameter = 0.105 * Math.pow(targetLbs, 0.44);
          visibility = "Low (nearly invisible underwater)";
          stretch = "Low (10-15%)";
          abrasionResistance = "Excellent";
        } else {
          diameter = 0.055 * Math.pow(targetLbs, 0.4);
          visibility = "High (visible)";
          stretch = "Near zero";
          abrasionResistance = "Low to Medium";
        }

        const diameterInches = diameter / 25.4;

        return {
          primary: {
            label: "Line Diameter",
            value: formatNumber(diameter, 3) + " mm",
          },
          details: [
            { label: "Diameter (inches)", value: formatNumber(diameterInches, 4) },
            { label: "Breaking Strength", value: formatNumber(targetLbs, 0) + " lbs" },
            { label: "Visibility", value: visibility },
            { label: "Stretch", value: stretch },
            { label: "Abrasion Resistance", value: abrasionResistance },
          ],
          note: "Diameters are approximate and vary by manufacturer. Braid is significantly thinner than mono at the same breaking strength.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "speed-converter"],
  faq: [
    {
      question: "How do I choose the right fishing rod weight?",
      answer:
        "Match your rod power to your target species: ultra-light for panfish, light for trout, medium for walleye, medium-heavy for bass, and heavy for pike/catfish. The rod should handle the line weight and lure sizes you plan to use.",
    },
    {
      question: "What fishing line should I use?",
      answer:
        "Monofilament is versatile and forgiving (good for beginners). Fluorocarbon is nearly invisible underwater (great for clear water). Braided line has zero stretch and high sensitivity (ideal for heavy cover and deep water). Many anglers use braid as mainline with a fluorocarbon leader.",
    },
  ],
  formula:
    "Rod Power matches Line Weight and Lure Weight | Mono Diameter ≈ 0.1 × lb^0.45 mm | Braid Diameter ≈ 0.055 × lb^0.4 mm",
};
