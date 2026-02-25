import type { CalculatorDefinition } from "./types";

export const babyShoeSizeCalculator: CalculatorDefinition = {
  slug: "baby-shoe-size-calculator",
  title: "Baby Shoe Size Calculator",
  description:
    "Free baby shoe size calculator. Find the right shoe size for your baby or toddler based on foot length and age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby shoe size",
    "toddler shoe size",
    "infant shoe size",
    "baby foot size",
    "kids shoe size chart",
  ],
  variants: [
    {
      id: "by-foot",
      name: "By Foot Length",
      description: "Find shoe size based on foot measurement",
      fields: [
        {
          name: "footLengthIn",
          label: "Foot Length (inches)",
          type: "number",
          placeholder: "e.g. 4.5",
          min: 2,
          max: 8,
          step: 0.125,
        },
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 12",
          min: 0,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const footIn = inputs.footLengthIn as number;
        const age = inputs.ageMonths as number;
        if (!footIn) return null;

        const footCm = footIn * 2.54;

        // US baby/toddler shoe sizes by foot length (inches)
        const sizeChart = [
          { minIn: 2.0, maxIn: 2.75, usSize: "0 (Newborn)", euSize: "15" },
          { minIn: 2.75, maxIn: 3.125, usSize: "0.5", euSize: "16" },
          { minIn: 3.125, maxIn: 3.5, usSize: "1", euSize: "16" },
          { minIn: 3.5, maxIn: 3.625, usSize: "1.5", euSize: "17" },
          { minIn: 3.625, maxIn: 3.75, usSize: "2", euSize: "17" },
          { minIn: 3.75, maxIn: 4.0, usSize: "2.5", euSize: "18" },
          { minIn: 4.0, maxIn: 4.125, usSize: "3", euSize: "18-19" },
          { minIn: 4.125, maxIn: 4.25, usSize: "3.5", euSize: "19" },
          { minIn: 4.25, maxIn: 4.5, usSize: "4", euSize: "19-20" },
          { minIn: 4.5, maxIn: 4.625, usSize: "4.5", euSize: "20" },
          { minIn: 4.625, maxIn: 4.75, usSize: "5", euSize: "20-21" },
          { minIn: 4.75, maxIn: 5.0, usSize: "5.5", euSize: "21" },
          { minIn: 5.0, maxIn: 5.125, usSize: "6", euSize: "22" },
          { minIn: 5.125, maxIn: 5.25, usSize: "6.5", euSize: "22" },
          { minIn: 5.25, maxIn: 5.5, usSize: "7", euSize: "23" },
          { minIn: 5.5, maxIn: 5.625, usSize: "7.5", euSize: "23-24" },
          { minIn: 5.625, maxIn: 5.75, usSize: "8", euSize: "24" },
          { minIn: 5.75, maxIn: 6.0, usSize: "8.5", euSize: "25" },
          { minIn: 6.0, maxIn: 6.125, usSize: "9", euSize: "25-26" },
          { minIn: 6.125, maxIn: 6.25, usSize: "9.5", euSize: "26" },
          { minIn: 6.25, maxIn: 6.5, usSize: "10", euSize: "27" },
        ];

        let match = sizeChart[sizeChart.length - 1];
        for (const entry of sizeChart) {
          if (footIn >= entry.minIn && footIn < entry.maxIn) {
            match = entry;
            break;
          }
        }

        const details: { label: string; value: string }[] = [
          { label: "EU Size", value: match.euSize },
          { label: "Foot length", value: `${footIn}" (${footCm.toFixed(1)} cm)` },
        ];

        if (age !== undefined && age > 0) {
          details.push({ label: "Baby age", value: `${age} months` });
        }

        details.push(
          { label: "Tip", value: "Add ~0.5\" to foot length for wiggle room" },
          { label: "Recheck", value: "Measure feet every 2-3 months; babies grow fast!" }
        );

        return {
          primary: { label: "US Shoe Size", value: match.usSize },
          details,
          note: "Sizes vary between brands. Always measure both feet and use the larger measurement. Shoes should have about a thumb's width of space at the toe.",
        };
      },
    },
    {
      id: "by-age",
      name: "By Age (Quick Estimate)",
      description: "Approximate shoe size by age",
      fields: [
        {
          name: "ageRange",
          label: "Age Range",
          type: "select",
          options: [
            { label: "0-3 months", value: "0-3" },
            { label: "3-6 months", value: "3-6" },
            { label: "6-9 months", value: "6-9" },
            { label: "9-12 months", value: "9-12" },
            { label: "12-18 months", value: "12-18" },
            { label: "18-24 months", value: "18-24" },
            { label: "2-3 years", value: "24-36" },
            { label: "3-4 years", value: "36-48" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ageRange = inputs.ageRange as string;
        if (!ageRange) return null;

        const data: Record<string, { us: string; eu: string; footIn: string }> = {
          "0-3": { us: "0-1", eu: "15-16", footIn: "2.75-3.5" },
          "3-6": { us: "1.5-2.5", eu: "17-18", footIn: "3.5-4.0" },
          "6-9": { us: "2.5-3.5", eu: "18-19", footIn: "4.0-4.25" },
          "9-12": { us: "3.5-4.5", eu: "19-20", footIn: "4.25-4.625" },
          "12-18": { us: "4.5-5.5", eu: "20-21", footIn: "4.625-5.0" },
          "18-24": { us: "5.5-7", eu: "21-23", footIn: "5.0-5.5" },
          "24-36": { us: "7-9", eu: "23-26", footIn: "5.5-6.125" },
          "36-48": { us: "9-10", eu: "26-27", footIn: "6.125-6.5" },
        };

        const info = data[ageRange];
        if (!info) return null;

        return {
          primary: { label: "Typical US Size Range", value: info.us },
          details: [
            { label: "EU size range", value: info.eu },
            { label: "Typical foot length", value: `${info.footIn} inches` },
            { label: "Best practice", value: "Measure foot for accurate sizing" },
          ],
          note: "Age-based sizing is approximate. Foot size varies widely among children of the same age. Always measure for best fit.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-clothing-size-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "How do I measure my baby's foot?",
      answer:
        "Place baby's foot on a piece of paper. Mark the heel and the longest toe. Measure the distance in inches. Measure both feet and use the larger measurement. Add about 0.5 inches for wiggle room.",
    },
    {
      question: "How often do baby shoe sizes change?",
      answer:
        "Baby feet grow very quickly. In the first year, feet grow about half a size every 2 months. From ages 1-3, check every 2-3 months. From ages 3-5, check every 3-4 months.",
    },
  ],
  formula:
    "US baby shoe sizes correlate to foot length in inches. Size 0 = ~2.75\", Size 1 = ~3.5\", increasing ~0.25\" per half size. EU sizes start at 15 for newborns.",
};
