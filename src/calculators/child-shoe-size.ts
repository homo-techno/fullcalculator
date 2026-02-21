import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childShoeSizeCalculator: CalculatorDefinition = {
  slug: "child-shoe-size-calculator",
  title: "Children's Shoe Size Calculator",
  description:
    "Free children's shoe size calculator. Find the right shoe size for your child based on foot length, with US, EU, and UK size conversions.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "children shoe size",
    "kids shoe size chart",
    "toddler shoe size",
    "baby shoe size",
    "child foot measurement",
  ],
  variants: [
    {
      id: "shoe-size",
      name: "Find Shoe Size by Foot Length",
      description: "Measure foot length to find the right shoe size",
      fields: [
        {
          name: "footLength",
          label: "Foot Length (inches)",
          type: "number",
          placeholder: "e.g. 5.5",
          min: 3,
          max: 10,
          step: 0.125,
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Baby (0-12 months)", value: "baby" },
            { label: "Toddler (1-3 years)", value: "toddler" },
            { label: "Little Kid (4-7 years)", value: "littlekid" },
            { label: "Big Kid (8-12 years)", value: "bigkid" },
          ],
          defaultValue: "toddler",
        },
      ],
      calculate: (inputs) => {
        const footLength = inputs.footLength as number;
        const ageGroup = inputs.ageGroup as string;
        if (!footLength) return null;

        // Shoe size charts (foot length in inches -> US size)
        const babySizes = [
          { length: 3.25, us: "0", eu: "15", uk: "0" },
          { length: 3.5, us: "1", eu: "16", uk: "0.5" },
          { length: 3.75, us: "1.5", eu: "17", uk: "1" },
          { length: 4.0, us: "2", eu: "17", uk: "1" },
          { length: 4.13, us: "2.5", eu: "18", uk: "1.5" },
          { length: 4.25, us: "3", eu: "18", uk: "2" },
          { length: 4.5, us: "3.5", eu: "19", uk: "2.5" },
          { length: 4.63, us: "4", eu: "19", uk: "3" },
        ];

        const toddlerSizes = [
          { length: 4.75, us: "4.5", eu: "20", uk: "3.5" },
          { length: 5.0, us: "5", eu: "20", uk: "4" },
          { length: 5.13, us: "5.5", eu: "21", uk: "4.5" },
          { length: 5.25, us: "6", eu: "22", uk: "5" },
          { length: 5.5, us: "6.5", eu: "22", uk: "5.5" },
          { length: 5.63, us: "7", eu: "23", uk: "6" },
          { length: 5.75, us: "7.5", eu: "23", uk: "6.5" },
          { length: 6.0, us: "8", eu: "24", uk: "7" },
          { length: 6.13, us: "8.5", eu: "25", uk: "7.5" },
          { length: 6.25, us: "9", eu: "25", uk: "8" },
        ];

        const littleKidSizes = [
          { length: 6.5, us: "9.5", eu: "26", uk: "8.5" },
          { length: 6.63, us: "10", eu: "27", uk: "9" },
          { length: 6.75, us: "10.5", eu: "27", uk: "9.5" },
          { length: 7.0, us: "11", eu: "28", uk: "10" },
          { length: 7.13, us: "11.5", eu: "29", uk: "10.5" },
          { length: 7.25, us: "12", eu: "30", uk: "11" },
          { length: 7.5, us: "12.5", eu: "30", uk: "11.5" },
          { length: 7.63, us: "13", eu: "31", uk: "12" },
          { length: 7.75, us: "13.5", eu: "31", uk: "12.5" },
        ];

        const bigKidSizes = [
          { length: 8.0, us: "1Y", eu: "32", uk: "13" },
          { length: 8.13, us: "1.5Y", eu: "33", uk: "13.5" },
          { length: 8.25, us: "2Y", eu: "33", uk: "1" },
          { length: 8.5, us: "2.5Y", eu: "34", uk: "1.5" },
          { length: 8.63, us: "3Y", eu: "34", uk: "2" },
          { length: 8.75, us: "3.5Y", eu: "35", uk: "2.5" },
          { length: 9.0, us: "4Y", eu: "36", uk: "3" },
          { length: 9.13, us: "4.5Y", eu: "36", uk: "3.5" },
          { length: 9.25, us: "5Y", eu: "37", uk: "4" },
          { length: 9.5, us: "5.5Y", eu: "37", uk: "4.5" },
          { length: 9.63, us: "6Y", eu: "38", uk: "5" },
          { length: 9.75, us: "6.5Y", eu: "38", uk: "5.5" },
          { length: 10.0, us: "7Y", eu: "39", uk: "6" },
        ];

        const chartMap: Record<string, typeof babySizes> = {
          baby: babySizes,
          toddler: toddlerSizes,
          littlekid: littleKidSizes,
          bigkid: bigKidSizes,
        };

        const chart = chartMap[ageGroup] || toddlerSizes;

        // Find best match (round up for comfort)
        let match = chart[chart.length - 1];
        for (const entry of chart) {
          if (footLength <= entry.length) {
            match = entry;
            break;
          }
        }

        // Recommend half size up for growing room
        const matchIdx = chart.indexOf(match);
        const sizeUp = matchIdx < chart.length - 1 ? chart[matchIdx + 1] : match;

        return {
          primary: {
            label: "US Shoe Size",
            value: match.us,
          },
          details: [
            { label: "EU Size", value: match.eu },
            { label: "UK Size", value: match.uk },
            { label: "Foot Length", value: `${formatNumber(footLength, 2)} inches (${formatNumber(footLength * 2.54, 1)} cm)` },
            { label: "Size with Growing Room", value: `US ${sizeUp.us} (EU ${sizeUp.eu})` },
            { label: "Age Group", value: ageGroup === "baby" ? "Baby (0-12mo)" : ageGroup === "toddler" ? "Toddler (1-3yr)" : ageGroup === "littlekid" ? "Little Kid (4-7yr)" : "Big Kid (8-12yr)" },
          ],
          note: "Measure feet in the afternoon when they are largest. Leave about a thumb's width (0.5 in) between the longest toe and the shoe tip. Children's feet grow 1-2 sizes per year - check fit every 2-3 months.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-clothing-size-calculator", "baby-growth-calculator", "shoe-size-calculator"],
  faq: [
    {
      question: "How do I measure my child's foot for shoes?",
      answer:
        "Have your child stand on a piece of paper with their heel against a wall. Mark the tip of their longest toe. Measure the distance from the wall to the mark. Measure both feet and use the larger measurement. Measure in the afternoon when feet are naturally slightly larger.",
    },
    {
      question: "How much growing room should children's shoes have?",
      answer:
        "Children's shoes should have about 0.5 inches (a thumb's width) of space between the longest toe and the end of the shoe. This allows room for growth without being so large that the shoe causes tripping or blisters.",
    },
    {
      question: "How often do children's shoe sizes change?",
      answer:
        "Children's feet grow rapidly: about 1 size every 2-3 months for toddlers, every 3-4 months for preschoolers, and every 4-6 months for school-age children. Check fit regularly, especially during growth spurts.",
    },
  ],
  formula:
    "US shoe size matched to foot length in inches using standard children's shoe size charts. EU and UK conversions provided. Growing room recommendation: half size up from measured fit.",
};
