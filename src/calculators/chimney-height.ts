import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chimneyHeightCalculator: CalculatorDefinition = {
  slug: "chimney-height-calculator",
  title: "Chimney Height Calculator",
  description: "Free chimney height calculator. Calculate required chimney height based on the 2-foot/10-foot/3-foot rule, roof pitch, and building codes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chimney height calculator", "chimney height rule", "2 10 3 rule chimney", "chimney above roofline", "chimney code requirements"],
  variants: [
    {
      id: "chimney-height",
      name: "Chimney Height (2-10-3 Rule)",
      description: "Calculate minimum chimney height per building code",
      fields: [
        { name: "distanceToRidge", label: "Horizontal Distance to Ridge (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "roofPitch", label: "Roof Pitch", type: "select", options: [
          { label: "3/12", value: "3" },
          { label: "4/12", value: "4" },
          { label: "5/12", value: "5" },
          { label: "6/12", value: "6" },
          { label: "7/12", value: "7" },
          { label: "8/12", value: "8" },
          { label: "9/12", value: "9" },
          { label: "10/12", value: "10" },
          { label: "12/12", value: "12" },
        ], defaultValue: "6" },
        { name: "chimneyLocation", label: "Chimney Location", type: "select", options: [
          { label: "On Ridge (0 ft from peak)", value: "ridge" },
          { label: "Near Ridge (within 10 ft)", value: "near" },
          { label: "Far from Ridge (over 10 ft)", value: "far" },
        ], defaultValue: "near" },
      ],
      calculate: (inputs) => {
        const distanceToRidge = inputs.distanceToRidge as number;
        const pitch = parseInt(inputs.roofPitch as string) || 6;
        const location = inputs.chimneyLocation as string;
        if (distanceToRidge === undefined || distanceToRidge === null) return null;

        // 2-10-3 Rule:
        // Within 10 ft horizontally: chimney must be 2 ft above any part of roof within 10 ft
        // Beyond 10 ft: chimney must be at least 3 ft above where it passes through roof

        const roofRise = distanceToRidge * (pitch / 12); // Height of ridge above chimney penetration point

        let minHeightAbovePenetration: number;
        let rule: string;

        if (location === "ridge" || distanceToRidge <= 0) {
          minHeightAbovePenetration = 2; // 2 ft above ridge
          rule = "2 feet above ridge (chimney at ridge)";
        } else if (distanceToRidge <= 10) {
          // Must be 2 ft above ridge; ridge is roofRise higher than penetration point
          minHeightAbovePenetration = roofRise + 2;
          rule = "2 feet above any roof surface within 10 horizontal feet";
        } else {
          // Must be 3 ft above penetration point, but also check 10-ft rule
          // The roof within 10 ft of chimney rises: 10 * pitch/12 (portion toward ridge)
          const roofAt10ft = 10 * (pitch / 12);
          const heightNeededFor10ftRule = roofAt10ft + 2 - (distanceToRidge - 10) * (pitch / 12);
          minHeightAbovePenetration = Math.max(3, heightNeededFor10ftRule > 0 ? heightNeededFor10ftRule : 3);
          rule = "3 feet above roof penetration (beyond 10 ft from ridge)";
        }

        // Also must be at least 3 ft above highest point where chimney passes through roof
        minHeightAbovePenetration = Math.max(minHeightAbovePenetration, 3);

        const totalChimneyAboveRoof = minHeightAbovePenetration;

        return {
          primary: { label: "Minimum Chimney Height Above Roof", value: `${formatNumber(totalChimneyAboveRoof, 1)} feet` },
          details: [
            { label: "Applicable rule", value: rule },
            { label: "Roof pitch", value: `${pitch}/12` },
            { label: "Distance to ridge", value: `${formatNumber(distanceToRidge, 1)} ft horizontal` },
            { label: "Roof rise to ridge", value: `${formatNumber(roofRise, 1)} ft` },
            { label: "Min. height above penetration", value: `${formatNumber(minHeightAbovePenetration, 1)} ft` },
          ],
          note: "The 2-10-3 rule: Chimney must extend 3 ft above the point where it passes through the roof AND be 2 ft higher than anything within 10 horizontal feet. Check local codes for additional requirements.",
        };
      },
    },
    {
      id: "chimney-draft",
      name: "Chimney Draft & Flue Size",
      description: "Estimate chimney draft and recommended flue size",
      fields: [
        { name: "chimneyHeight", label: "Total Chimney Height (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "flueSize", label: "Flue Size", type: "select", options: [
          { label: "6\" Round (Wood Stove)", value: "6" },
          { label: "8\" Round (Fireplace/Furnace)", value: "8" },
          { label: "8\" × 8\" Square (Fireplace)", value: "8s" },
          { label: "8\" × 12\" Rectangular", value: "8x12" },
          { label: "12\" × 12\" Square (Large Fireplace)", value: "12s" },
        ], defaultValue: "8" },
        { name: "applianceType", label: "Appliance Type", type: "select", options: [
          { label: "Wood-Burning Fireplace", value: "fireplace" },
          { label: "Wood Stove", value: "stove" },
          { label: "Gas Fireplace", value: "gas" },
          { label: "Oil/Gas Furnace", value: "furnace" },
        ], defaultValue: "fireplace" },
      ],
      calculate: (inputs) => {
        const chimneyHeight = inputs.chimneyHeight as number;
        const flueSize = inputs.flueSize as string;
        const applianceType = inputs.applianceType as string;
        if (!chimneyHeight) return null;

        // Flue area in square inches
        let flueArea: number;
        switch (flueSize) {
          case "6": flueArea = Math.PI * 9; break;
          case "8": flueArea = Math.PI * 16; break;
          case "8s": flueArea = 64; break;
          case "8x12": flueArea = 96; break;
          case "12s": flueArea = 144; break;
          default: flueArea = Math.PI * 16;
        }

        // Draft increases with height; minimum 15 ft for good draft
        const draftQuality = chimneyHeight >= 20 ? "Excellent" : chimneyHeight >= 15 ? "Good" : chimneyHeight >= 12 ? "Marginal" : "Poor - may backdraft";

        // Recommended minimum flue size based on appliance
        let recommendedMinFlue: string;
        switch (applianceType) {
          case "fireplace": recommendedMinFlue = "8\" × 12\" or 10\" round"; break;
          case "stove": recommendedMinFlue = "6\" round (match stove outlet)"; break;
          case "gas": recommendedMinFlue = "4\"-6\" (per manufacturer specs)"; break;
          case "furnace": recommendedMinFlue = "6\"-8\" (per BTU rating)"; break;
          default: recommendedMinFlue = "8\" round";
        }

        return {
          primary: { label: "Draft Quality", value: draftQuality },
          details: [
            { label: "Chimney height", value: `${formatNumber(chimneyHeight, 0)} ft` },
            { label: "Flue area", value: `${formatNumber(flueArea, 1)} sq in` },
            { label: "Recommended minimum flue", value: recommendedMinFlue },
            { label: "Minimum height for good draft", value: "15 ft" },
            { label: "Optimal height range", value: "15-35 ft" },
          ],
          note: "Taller chimneys produce stronger draft. Flue size should be 1/10 to 1/12 of fireplace opening area for wood-burning fireplaces. Always follow manufacturer recommendations for stoves and furnaces.",
        };
      },
    },
  ],
  relatedSlugs: ["roofing-calculator", "roof-pitch-calculator", "foundation-calculator"],
  faq: [
    { question: "What is the 2-10-3 chimney rule?", answer: "The chimney must extend at least 3 feet above the point where it passes through the roof, AND it must be at least 2 feet taller than any part of the building within 10 horizontal feet. This rule ensures proper draft and prevents downdrafts from nearby roof sections." },
    { question: "How tall should my chimney be for good draft?", answer: "Minimum 15 feet from the firebox or appliance connection to the top of the chimney for reliable draft. 20-35 feet is optimal. Chimneys under 12 feet may experience poor draft and smoke spillage." },
  ],
  formula: "Min Height = Max(3 ft above penetration, 2 ft above roof within 10 ft) | Flue Area ≥ Fireplace Opening / 10",
};
