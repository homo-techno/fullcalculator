import type { CalculatorDefinition } from "./types";

export const nurseryRoomCalculator: CalculatorDefinition = {
  slug: "nursery-room-calculator",
  title: "Nursery Room Size Calculator",
  description:
    "Free nursery room size calculator. Determine if your room can fit essential nursery furniture and plan your baby's nursery layout.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "nursery room size",
    "nursery calculator",
    "baby room layout",
    "nursery furniture fit",
    "nursery planning",
  ],
  variants: [
    {
      id: "fit",
      name: "Nursery Fit Calculator",
      description: "Check if essential furniture fits your nursery room",
      fields: [
        {
          name: "roomLengthFt",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
          min: 5,
          max: 30,
        },
        {
          name: "roomWidthFt",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
          min: 5,
          max: 30,
        },
        {
          name: "furniture",
          label: "Furniture Plan",
          type: "select",
          options: [
            { label: "Essentials Only (crib + dresser)", value: "essentials" },
            { label: "Standard (crib + dresser + rocker)", value: "standard" },
            { label: "Full (crib + dresser + rocker + changing table)", value: "full" },
            { label: "Shared Room (crib only + parent bed space)", value: "shared" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.roomLengthFt as number;
        const width = inputs.roomWidthFt as number;
        const plan = inputs.furniture as string;
        if (!length || !width || !plan) return null;

        const roomSqFt = length * width;

        // Typical furniture footprints (sq ft)
        const furnitureSizes: Record<string, { name: string; sqFt: number; dims: string }[]> = {
          essentials: [
            { name: "Standard Crib", sqFt: 10.5, dims: "28\" x 52\"" },
            { name: "Dresser/Changing Combo", sqFt: 9, dims: "18\" x 54\"" },
          ],
          standard: [
            { name: "Standard Crib", sqFt: 10.5, dims: "28\" x 52\"" },
            { name: "Dresser", sqFt: 9, dims: "18\" x 54\"" },
            { name: "Glider/Rocker", sqFt: 8, dims: "30\" x 36\"" },
          ],
          full: [
            { name: "Standard Crib", sqFt: 10.5, dims: "28\" x 52\"" },
            { name: "Dresser", sqFt: 9, dims: "18\" x 54\"" },
            { name: "Glider/Rocker", sqFt: 8, dims: "30\" x 36\"" },
            { name: "Changing Table", sqFt: 7, dims: "20\" x 38\"" },
          ],
          shared: [
            { name: "Mini Crib", sqFt: 7, dims: "24\" x 38\"" },
            { name: "Small Dresser", sqFt: 6, dims: "16\" x 40\"" },
          ],
        };

        const items = furnitureSizes[plan] || furnitureSizes.essentials;
        const totalFurnitureSqFt = items.reduce((sum, item) => sum + item.sqFt, 0);

        // Need walking space (~40% of room free)
        const usableSpace = roomSqFt * 0.6;
        const fits = totalFurnitureSqFt <= usableSpace;
        const remainingSqFt = roomSqFt - totalFurnitureSqFt;
        const percentUsed = ((totalFurnitureSqFt / roomSqFt) * 100).toFixed(1);

        let verdict = "";
        if (fits && remainingSqFt > roomSqFt * 0.5) {
          verdict = "Spacious - Plenty of room!";
        } else if (fits) {
          verdict = "Good Fit - Comfortable layout possible";
        } else if (remainingSqFt > 0) {
          verdict = "Tight Fit - Will work but limited walking space";
        } else {
          verdict = "Too Small - Consider fewer or smaller pieces";
        }

        const details: { label: string; value: string }[] = [
          { label: "Room area", value: `${roomSqFt} sq ft (${length}' x ${width}')` },
          { label: "Furniture space needed", value: `${totalFurnitureSqFt.toFixed(1)} sq ft (${percentUsed}% of room)` },
          { label: "Remaining space", value: `${remainingSqFt.toFixed(1)} sq ft` },
        ];

        for (const item of items) {
          details.push({ label: item.name, value: `${item.dims} (~${item.sqFt} sq ft)` });
        }

        return {
          primary: { label: "Nursery Assessment", value: verdict },
          details,
          note: "Keep the crib away from windows, cords, and shelves. Allow at least 3 feet of clearance around the crib for safe access.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "paint-calculator"],
  faq: [
    {
      question: "What is the minimum room size for a nursery?",
      answer:
        "A minimum of about 70 sq ft (e.g., 7x10 or 8x9) works for a basic nursery with a crib and small dresser. For a full nursery with a rocker, aim for at least 100 sq ft (10x10).",
    },
    {
      question: "What furniture is essential for a nursery?",
      answer:
        "The essentials are a crib that meets current safety standards and a dresser or storage for clothes. A glider/rocker is highly recommended for feeding and soothing. A separate changing table is nice but a changing pad on top of a dresser works well.",
    },
  ],
  formula:
    "Room area = length x width. Furniture should occupy no more than 60% of floor space. Standard crib: ~10.5 sq ft, dresser: ~9 sq ft, rocker: ~8 sq ft.",
};
