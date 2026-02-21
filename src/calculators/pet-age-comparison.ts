import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petAgeComparisonCalculator: CalculatorDefinition = {
  slug: "pet-age-comparison-calculator",
  title: "Pet Age Comparison Calculator",
  description:
    "Free pet age comparison calculator. Compare ages across species - convert dog, cat, rabbit, hamster, horse, and bird years to human years.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet age comparison calculator",
    "animal age to human years",
    "pet years calculator",
    "animal lifespan calculator",
    "pet age converter",
  ],
  variants: [
    {
      id: "speciesAge",
      name: "Pet Age to Human Years",
      fields: [
        {
          name: "species",
          label: "Pet Species",
          type: "select",
          options: [
            { label: "Dog (small breed)", value: "dog_small" },
            { label: "Dog (medium breed)", value: "dog_medium" },
            { label: "Dog (large breed)", value: "dog_large" },
            { label: "Cat", value: "cat" },
            { label: "Rabbit", value: "rabbit" },
            { label: "Hamster", value: "hamster" },
            { label: "Guinea Pig", value: "guinea_pig" },
            { label: "Rat", value: "rat" },
            { label: "Horse", value: "horse" },
            { label: "Parrot (small - budgie)", value: "parrot_small" },
            { label: "Parrot (large - macaw)", value: "parrot_large" },
            { label: "Goldfish", value: "goldfish" },
            { label: "Turtle/Tortoise", value: "turtle" },
          ],
        },
        {
          name: "petAge",
          label: "Pet's Age (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.1,
          max: 200,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const species = (inputs.species as string) || "cat";
        const petAge = inputs.petAge as number;
        if (!petAge || petAge < 0) return null;

        // Conversion data: { firstYearHuman, secondYearHuman, subsequentYearHuman, avgLifespan }
        const speciesData: Record<
          string,
          { firstYear: number; secondYear: number; perYear: number; lifespan: string; maxAge: string }
        > = {
          dog_small: { firstYear: 15, secondYear: 9, perYear: 4, lifespan: "12-16 years", maxAge: "20+ years" },
          dog_medium: { firstYear: 15, secondYear: 9, perYear: 5, lifespan: "10-13 years", maxAge: "17+ years" },
          dog_large: { firstYear: 15, secondYear: 9, perYear: 6, lifespan: "8-12 years", maxAge: "14+ years" },
          cat: { firstYear: 15, secondYear: 9, perYear: 4, lifespan: "12-18 years", maxAge: "30+ years (record)" },
          rabbit: { firstYear: 21, secondYear: 6, perYear: 3, lifespan: "8-12 years", maxAge: "18+ years" },
          hamster: { firstYear: 26, secondYear: 26, perYear: 26, lifespan: "2-3 years", maxAge: "4.5 years" },
          guinea_pig: { firstYear: 14, secondYear: 10, perYear: 8, lifespan: "5-7 years", maxAge: "14+ years" },
          rat: { firstYear: 30, secondYear: 24, perYear: 24, lifespan: "2-3 years", maxAge: "7 years" },
          horse: { firstYear: 6.5, secondYear: 6.5, perYear: 3.5, lifespan: "25-30 years", maxAge: "62 years (record)" },
          parrot_small: { firstYear: 8, secondYear: 6, perYear: 4, lifespan: "5-10 years", maxAge: "15+ years" },
          parrot_large: { firstYear: 2, secondYear: 2, perYear: 1.3, lifespan: "50-80 years", maxAge: "100+ years" },
          goldfish: { firstYear: 4, secondYear: 4, perYear: 3, lifespan: "10-15 years", maxAge: "43 years (record)" },
          turtle: { firstYear: 1, secondYear: 1, perYear: 0.6, lifespan: "30-100+ years", maxAge: "250+ years" },
        };

        const data = speciesData[species] || speciesData.cat;
        let humanAge = 0;

        if (petAge <= 1) {
          humanAge = petAge * data.firstYear;
        } else if (petAge <= 2) {
          humanAge = data.firstYear + (petAge - 1) * data.secondYear;
        } else {
          humanAge = data.firstYear + data.secondYear + (petAge - 2) * data.perYear;
        }

        // Life stage
        const lifespanAvg = parseFloat(data.lifespan.split("-")[1] || data.lifespan.split("-")[0]);
        const lifePercent = (petAge / lifespanAvg) * 100;
        let lifeStage = "";
        if (lifePercent < 15) lifeStage = "Baby/Young";
        else if (lifePercent < 35) lifeStage = "Young Adult";
        else if (lifePercent < 60) lifeStage = "Adult";
        else if (lifePercent < 80) lifeStage = "Mature/Senior";
        else lifeStage = "Geriatric";

        const speciesName = species.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          primary: {
            label: `${formatNumber(petAge, 1)} ${speciesName} years`,
            value: `≈ ${formatNumber(humanAge, 1)} human years`,
          },
          details: [
            { label: "Life Stage", value: lifeStage },
            { label: "Life Progress", value: formatNumber(Math.min(100, lifePercent), 0) + "%" },
            { label: "Average Lifespan", value: data.lifespan },
            { label: "Maximum Recorded", value: data.maxAge },
            { label: "Year 1 Equivalent", value: data.firstYear + " human years" },
            { label: "Year 2 Equivalent", value: data.secondYear + " human years" },
            { label: "Each Year After", value: data.perYear + " human years" },
          ],
        };
      },
    },
    {
      id: "comparePets",
      name: "Compare Two Pets",
      description: "See equivalent ages between two different pets",
      fields: [
        {
          name: "species1",
          label: "First Pet Species",
          type: "select",
          options: [
            { label: "Dog (small)", value: "dog_small" },
            { label: "Dog (large)", value: "dog_large" },
            { label: "Cat", value: "cat" },
            { label: "Rabbit", value: "rabbit" },
            { label: "Hamster", value: "hamster" },
            { label: "Horse", value: "horse" },
          ],
        },
        {
          name: "age1",
          label: "First Pet's Age (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.1,
          max: 100,
          step: 0.5,
        },
        {
          name: "species2",
          label: "Second Pet Species",
          type: "select",
          options: [
            { label: "Dog (small)", value: "dog_small" },
            { label: "Dog (large)", value: "dog_large" },
            { label: "Cat", value: "cat" },
            { label: "Rabbit", value: "rabbit" },
            { label: "Hamster", value: "hamster" },
            { label: "Horse", value: "horse" },
          ],
        },
      ],
      calculate: (inputs) => {
        const species1 = (inputs.species1 as string) || "dog_small";
        const age1 = inputs.age1 as number;
        const species2 = (inputs.species2 as string) || "cat";
        if (!age1 || age1 < 0) return null;

        const speciesData: Record<string, { firstYear: number; secondYear: number; perYear: number }> = {
          dog_small: { firstYear: 15, secondYear: 9, perYear: 4 },
          dog_large: { firstYear: 15, secondYear: 9, perYear: 6 },
          cat: { firstYear: 15, secondYear: 9, perYear: 4 },
          rabbit: { firstYear: 21, secondYear: 6, perYear: 3 },
          hamster: { firstYear: 26, secondYear: 26, perYear: 26 },
          horse: { firstYear: 6.5, secondYear: 6.5, perYear: 3.5 },
        };

        const toHuman = (species: string, age: number): number => {
          const d = speciesData[species] || speciesData.cat;
          if (age <= 1) return age * d.firstYear;
          if (age <= 2) return d.firstYear + (age - 1) * d.secondYear;
          return d.firstYear + d.secondYear + (age - 2) * d.perYear;
        };

        const fromHuman = (species: string, humanAge: number): number => {
          const d = speciesData[species] || speciesData.cat;
          if (humanAge <= d.firstYear) return humanAge / d.firstYear;
          if (humanAge <= d.firstYear + d.secondYear) return 1 + (humanAge - d.firstYear) / d.secondYear;
          return 2 + (humanAge - d.firstYear - d.secondYear) / d.perYear;
        };

        const humanAge = toHuman(species1, age1);
        const equivalentAge2 = fromHuman(species2, humanAge);

        const name1 = species1.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const name2 = species2.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          primary: {
            label: `${formatNumber(age1, 1)} yr ${name1}`,
            value: `= ${formatNumber(equivalentAge2, 1)} yr ${name2}`,
          },
          details: [
            { label: "Human Age Equivalent", value: formatNumber(humanAge, 1) + " human years" },
            { label: name1 + " Age", value: formatNumber(age1, 1) + " years" },
            { label: name2 + " Equivalent", value: formatNumber(equivalentAge2, 1) + " years" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-age-calculator", "dog-years-calculator", "pet-food-calculator"],
  faq: [
    {
      question: "Do all animals age at the same rate?",
      answer:
        "No. Aging rates vary enormously across species. A hamster at 2 years old is equivalent to about a 70-year-old human, while a 2-year-old horse is only about 13 in human years. Generally, smaller animals with faster metabolisms age more quickly relative to humans.",
    },
    {
      question: "Which pet lives the longest?",
      answer:
        "Among common pets, tortoises can live 100+ years, and large parrots (macaws, cockatoos) can live 50-80+ years. Koi fish can live 25-35 years (record 226 years). Horses live 25-30 years. Cats typically live 12-18 years, dogs 8-16 years depending on size, and hamsters 2-3 years.",
    },
    {
      question: "Why do larger dogs age faster than smaller dogs?",
      answer:
        "Research suggests larger dogs age faster because their bodies work harder to grow and maintain their size, accelerating cellular wear and increasing free radical damage. Large breeds also have higher rates of cancer. A Great Dane may live 7-10 years, while a Chihuahua can live 15-20 years.",
    },
  ],
  formula:
    "Human age = Year 1 equivalent + Year 2 equivalent + (remaining years x per-year rate). Rates vary by species. Conversion between species: convert pet 1 to human years, then convert human years to pet 2 years.",
};
