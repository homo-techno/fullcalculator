import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hamsterCageSizeCalculator: CalculatorDefinition = {
  slug: "hamster-cage-size-calculator",
  title: "Hamster & Small Pet Cage Size Calculator",
  description:
    "Free hamster cage size calculator. Find the minimum cage size for hamsters, gerbils, guinea pigs, and other small pets based on species and count.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hamster cage size calculator",
    "guinea pig cage size",
    "gerbil cage size",
    "small pet enclosure calculator",
    "hamster habitat size",
  ],
  variants: [
    {
      id: "smallPetCage",
      name: "Cage Size Calculator",
      fields: [
        {
          name: "species",
          label: "Pet Species",
          type: "select",
          options: [
            { label: "Syrian Hamster", value: "syrian" },
            { label: "Dwarf Hamster", value: "dwarf" },
            { label: "Guinea Pig", value: "guinea_pig" },
            { label: "Gerbil", value: "gerbil" },
            { label: "Rat", value: "rat" },
            { label: "Mouse", value: "mouse" },
            { label: "Chinchilla", value: "chinchilla" },
            { label: "Ferret", value: "ferret" },
          ],
        },
        {
          name: "petCount",
          label: "Number of Pets",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const species = (inputs.species as string) || "syrian";
        const petCount = (inputs.petCount as number) || 1;
        if (petCount <= 0) return null;

        // Minimum floor space in square inches per pet, plus base dimensions
        const specs: Record<
          string,
          {
            sqInBase: number;
            sqInPer: number;
            minH: number;
            bedding: string;
            social: string;
            wheelSize: string;
          }
        > = {
          syrian: { sqInBase: 620, sqInPer: 620, minH: 15, bedding: '6+ inches deep', social: "Must be housed alone", wheelSize: '10-12" wheel' },
          dwarf: { sqInBase: 480, sqInPer: 200, minH: 15, bedding: '6+ inches deep', social: "Can be kept in same-sex pairs", wheelSize: '8" wheel' },
          guinea_pig: { sqInBase: 1080, sqInPer: 540, minH: 14, bedding: 'Fleece liner or 2" paper bedding', social: "Social; keep in pairs/groups", wheelSize: "No wheel needed" },
          gerbil: { sqInBase: 480, sqInPer: 200, minH: 12, bedding: '8+ inches deep (they burrow)', social: "Social; keep in pairs", wheelSize: '8" wheel' },
          rat: { sqInBase: 432, sqInPer: 288, minH: 24, bedding: 'Fleece liners or paper bedding', social: "Social; keep in same-sex pairs", wheelSize: '12"+ wheel (optional)' },
          mouse: { sqInBase: 360, sqInPer: 144, minH: 12, bedding: '3+ inches deep', social: "Females social; males often solo", wheelSize: '6-8" wheel' },
          chinchilla: { sqInBase: 576, sqInPer: 432, minH: 36, bedding: 'Fleece liners (avoid shavings)', social: "Can be kept in same-sex pairs", wheelSize: '15"+ saucer wheel' },
          ferret: { sqInBase: 864, sqInPer: 576, minH: 36, bedding: 'Fleece blankets/hammocks', social: "Social; keep in pairs/groups", wheelSize: "No wheel; need out-of-cage time" },
        };

        const spec = specs[species] || specs.syrian;
        const totalSqIn = spec.sqInBase + Math.max(0, petCount - 1) * spec.sqInPer;
        const totalSqFt = totalSqIn / 144;

        // Suggest approximate dimensions
        const suggestedW = Math.ceil(Math.sqrt(totalSqIn * 1.5));
        const suggestedD = Math.ceil(totalSqIn / suggestedW);

        return {
          primary: {
            label: "Minimum Floor Space",
            value: formatNumber(totalSqIn, 0) + " sq inches (" + formatNumber(totalSqFt, 1) + " sq ft)",
          },
          details: [
            {
              label: "Suggested Dimensions",
              value: `${formatNumber(suggestedW, 0)}" x ${formatNumber(suggestedD, 0)}" x ${spec.minH}" tall`,
            },
            { label: "Bedding", value: spec.bedding },
            { label: "Exercise", value: spec.wheelSize },
            { label: "Social Needs", value: spec.social },
            { label: "Number of Pets", value: String(petCount) },
            {
              label: "Note",
              value: "These are minimums. Bigger is always better for your pet's wellbeing.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bird-cage-size-calculator", "rabbit-hutch-size-calculator", "reptile-enclosure-calculator"],
  faq: [
    {
      question: "What size cage does a Syrian hamster need?",
      answer:
        "A Syrian hamster needs a minimum of 620 square inches (about 4.3 sq ft) of unbroken floor space. This is approximately a 30\" x 20\" cage. Syrian hamsters must be housed alone as they are territorial. The cage should have at least 6 inches of bedding for burrowing and a 10-12 inch wheel.",
    },
    {
      question: "How big should a guinea pig cage be?",
      answer:
        "One guinea pig needs at least 7.5 square feet (1,080 sq inches) of floor space, and guinea pigs should always be kept in pairs or groups. Two guinea pigs need at least 10.5 square feet. C&C (cubes and coroplast) cages are popular and allow for customizable sizing.",
    },
    {
      question: "Can I keep hamsters together?",
      answer:
        "Syrian hamsters must always be housed alone after 8 weeks of age, as they are strictly solitary and will fight. Dwarf hamsters (Campbell's, Winter White, Roborovski) can sometimes be kept in same-sex pairs if introduced young, but not all will tolerate a companion.",
    },
  ],
  formula:
    "Total floor space = base minimum (sq in) + additional pets x per-pet space. Guinea pigs: 1,080 sq in for 1, +540 per additional. Syrian hamsters: 620 sq in minimum (must be solitary). Always exceed minimums when possible.",
};
