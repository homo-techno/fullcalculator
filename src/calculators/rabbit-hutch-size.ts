import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rabbitHutchSizeCalculator: CalculatorDefinition = {
  slug: "rabbit-hutch-size-calculator",
  title: "Rabbit Hutch Size Calculator",
  description:
    "Free rabbit hutch size calculator. Determine the minimum enclosure size for your rabbit based on breed size, number of rabbits, and housing type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rabbit hutch size calculator",
    "rabbit cage size",
    "bunny enclosure size",
    "rabbit housing calculator",
    "how big should a rabbit cage be",
  ],
  variants: [
    {
      id: "rabbitEnclosure",
      name: "Hutch/Enclosure Size",
      fields: [
        {
          name: "breed",
          label: "Rabbit Size",
          type: "select",
          options: [
            { label: "Small (under 5 lbs - Netherland Dwarf, Mini Rex)", value: "small" },
            { label: "Medium (5-8 lbs - Holland Lop, Dutch)", value: "medium" },
            { label: "Large (8-12 lbs - Rex, New Zealand)", value: "large" },
            { label: "Giant (12+ lbs - Flemish Giant, Continental)", value: "giant" },
          ],
        },
        {
          name: "rabbitCount",
          label: "Number of Rabbits",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
          defaultValue: 1,
        },
        {
          name: "housingType",
          label: "Housing Type",
          type: "select",
          options: [
            { label: "Indoor Enclosure", value: "indoor" },
            { label: "Outdoor Hutch", value: "outdoor" },
            { label: "Free-Roam (room/area)", value: "free_roam" },
          ],
        },
      ],
      calculate: (inputs) => {
        const breed = (inputs.breed as string) || "medium";
        const rabbitCount = (inputs.rabbitCount as number) || 1;
        const housingType = (inputs.housingType as string) || "indoor";
        if (rabbitCount <= 0) return null;

        // Minimum sq ft for one rabbit (RSPCA guidelines: 12 sq ft hutch + 32 sq ft run)
        const sizes: Record<string, { hutchSqFt: number; runSqFt: number; minHeight: number; weight: string }> = {
          small: { hutchSqFt: 8, runSqFt: 24, minHeight: 18, weight: "2-5 lbs" },
          medium: { hutchSqFt: 12, runSqFt: 32, minHeight: 24, weight: "5-8 lbs" },
          large: { hutchSqFt: 16, runSqFt: 40, minHeight: 30, weight: "8-12 lbs" },
          giant: { hutchSqFt: 24, runSqFt: 48, minHeight: 36, weight: "12-20+ lbs" },
        };

        const spec = sizes[breed] || sizes.medium;
        const totalHutch = spec.hutchSqFt * rabbitCount;
        const totalRun = spec.runSqFt * rabbitCount;
        const totalSpace = totalHutch + totalRun;

        // Suggest dimensions
        const hutchW = Math.ceil(Math.sqrt(totalHutch * 144 * 2)); // wider than deep
        const hutchD = Math.ceil((totalHutch * 144) / hutchW);

        let exerciseNote = "";
        if (housingType === "free_roam") {
          exerciseNote = "Free-roam is ideal. Ensure rabbit-proofed space of at least " + formatNumber(totalSpace, 0) + " sq ft.";
        } else if (housingType === "indoor") {
          exerciseNote = "Provide " + formatNumber(totalRun, 0) + "+ sq ft exercise area and 3+ hours daily out-of-cage time.";
        } else {
          exerciseNote = "Attach a secure run of " + formatNumber(totalRun, 0) + "+ sq ft. Protect from predators and weather.";
        }

        return {
          primary: {
            label: "Minimum Hutch/Cage Size",
            value: formatNumber(totalHutch, 0) + " sq ft",
          },
          details: [
            {
              label: "Suggested Dimensions",
              value: `${formatNumber(hutchW, 0)}" W x ${formatNumber(hutchD, 0)}" D x ${spec.minHeight}" H minimum`,
            },
            { label: "Exercise Area Needed", value: formatNumber(totalRun, 0) + " sq ft" },
            { label: "Total Space", value: formatNumber(totalSpace, 0) + " sq ft (hutch + run)" },
            { label: "Rabbit Weight Range", value: spec.weight },
            { label: "Number of Rabbits", value: String(rabbitCount) },
            { label: "Exercise", value: exerciseNote },
            { label: "Height", value: "Rabbit should stand fully upright on hind legs without ears touching top." },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hamster-cage-size-calculator", "bird-cage-size-calculator", "chicken-coop-size-calculator"],
  faq: [
    {
      question: "How big should a rabbit cage be?",
      answer:
        "A medium-sized rabbit (5-8 lbs) needs at least 12 square feet of living space plus 32 square feet of exercise area. The cage should be tall enough for the rabbit to stand up fully on its hind legs. Many rabbit welfare organizations recommend at least 3 hops in length (about 4x the rabbit's body length).",
    },
    {
      question: "Can rabbits be kept in small cages?",
      answer:
        "Pet store cages are almost always too small for rabbits. Confined rabbits can develop skeletal problems, obesity, depression, and aggression. Use an x-pen, large cage, or provide free-roam access to a rabbit-proofed room. Even with a large cage, rabbits need several hours of exercise time daily.",
    },
    {
      question: "Should rabbits be kept indoors or outdoors?",
      answer:
        "Indoor housing is generally safer and healthier. Indoor rabbits are protected from predators, extreme temperatures, and parasites. They also tend to be more socialized. If kept outdoors, the hutch must be predator-proof, weatherproof, insulated, and attached to a secure exercise run.",
    },
  ],
  formula:
    "Hutch size = base sq ft per rabbit x number of rabbits. Exercise area = run sq ft per rabbit x number of rabbits. Height must allow full upright standing. RSPCA guidelines: minimum 12 sq ft hutch + 32 sq ft run for medium rabbits.",
};
