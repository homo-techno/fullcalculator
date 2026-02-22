import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventSpaceCapacityCalculator: CalculatorDefinition = {
  slug: "event-space-capacity",
  title: "Event Space Capacity Calculator",
  description: "Free event space capacity calculator. Determine how many guests your venue can accommodate based on room dimensions and event layout.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event space", "venue capacity", "room capacity", "event layout", "space planning"],
  variants: [
    {
      id: "byDimensions",
      name: "By Room Dimensions",
      fields: [
        { name: "roomLength", label: "Room Length (ft)", type: "number", placeholder: "e.g. 80" },
        { name: "roomWidth", label: "Room Width (ft)", type: "number", placeholder: "e.g. 60" },
        { name: "layoutType", label: "Layout Type", type: "select", options: [
          { label: "Seated Dinner (round tables)", value: "seated" },
          { label: "Cocktail/Standing", value: "cocktail" },
          { label: "Theater Style", value: "theater" },
          { label: "Classroom Style", value: "classroom" },
          { label: "Banquet (long tables)", value: "banquet" },
        ] },
        { name: "danceFloor", label: "Include Dance Floor?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ] },
        { name: "stageArea", label: "Stage/Band Area (sq ft)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const roomLength = (inputs.roomLength as number) || 0;
        const roomWidth = (inputs.roomWidth as number) || 0;
        const layoutType = (inputs.layoutType as string) || "seated";
        const danceFloor = (inputs.danceFloor as string) || "no";
        const stageArea = (inputs.stageArea as number) || 0;
        if (roomLength <= 0 || roomWidth <= 0) return null;
        const totalSqFt = roomLength * roomWidth;
        const danceFloorSqFt = danceFloor === "yes" ? Math.ceil(totalSqFt * 0.15) : 0;
        const usableSqFt = totalSqFt - danceFloorSqFt - stageArea;
        const sqftPerPerson: Record<string, number> = {
          seated: 12, cocktail: 6, theater: 7, classroom: 18, banquet: 10,
        };
        const sqft = sqftPerPerson[layoutType] || 12;
        const capacity = Math.floor(usableSqFt / sqft);
        return {
          primary: { label: "Maximum Capacity", value: formatNumber(capacity) + " guests" },
          details: [
            { label: "Total Room Size", value: formatNumber(totalSqFt) + " sq ft" },
            { label: "Usable Space", value: formatNumber(usableSqFt) + " sq ft" },
            { label: "Sq Ft Per Person", value: formatNumber(sqft) },
            { label: "Dance Floor Area", value: danceFloorSqFt > 0 ? formatNumber(danceFloorSqFt) + " sq ft" : "None" },
            { label: "Stage/Band Area", value: stageArea > 0 ? formatNumber(stageArea) + " sq ft" : "None" },
            { label: "Layout Type", value: layoutType.charAt(0).toUpperCase() + layoutType.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-seating", "wedding-guest-list", "event-parking"],
  faq: [
    { question: "How many square feet per person for a seated dinner?", answer: "Plan for 10-12 square feet per person for seated dinner with round tables. For cocktail receptions, 6-8 square feet per person is sufficient." },
    { question: "How big should a dance floor be?", answer: "A good rule of thumb is 4.5 square feet per dancer, with about 40-50% of guests expected to dance at any given time." },
  ],
  formula: "Capacity = (Total Sq Ft - Dance Floor - Stage) / Sq Ft Per Person",
};
