import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodTypeInheritanceCalculator: CalculatorDefinition = {
  slug: "blood-type-inheritance",
  title: "Blood Type Inheritance Calculator",
  description:
    "Free online blood type inheritance calculator to predict possible blood types of offspring based on parent blood types.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood type",
    "genetics",
    "inheritance",
    "ABO",
    "Rh factor",
    "paternity",
    "blood group",
    "alleles",
  ],
  variants: [
    {
      id: "blood-type",
      name: "ABO Blood Type Inheritance",
      description:
        "Predict the possible blood types of a child from parent blood types using Mendelian genetics.",
      fields: [
        {
          name: "parent1Type",
          label: "Parent 1 Blood Type",
          type: "select",
          options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "AB", value: "AB" },
            { label: "O", value: "O" },
          ],
        },
        {
          name: "parent2Type",
          label: "Parent 2 Blood Type",
          type: "select",
          options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "AB", value: "AB" },
            { label: "O", value: "O" },
          ],
        },
        {
          name: "parent1Rh",
          label: "Parent 1 Rh Factor",
          type: "select",
          options: [
            { label: "Positive (+)", value: "pos" },
            { label: "Negative (-)", value: "neg" },
          ],
        },
        {
          name: "parent2Rh",
          label: "Parent 2 Rh Factor",
          type: "select",
          options: [
            { label: "Positive (+)", value: "pos" },
            { label: "Negative (-)", value: "neg" },
          ],
        },
      ],
      calculate: (inputs) => {
        const p1 = inputs.parent1Type as string;
        const p2 = inputs.parent2Type as string;
        const rh1 = inputs.parent1Rh as string;
        const rh2 = inputs.parent2Rh as string;

        // Get possible alleles for each parent
        const getAlleles = (type: string): string[][] => {
          switch (type) {
            case "A":
              return [["A", "A"], ["A", "O"]];
            case "B":
              return [["B", "B"], ["B", "O"]];
            case "AB":
              return [["A", "B"]];
            case "O":
              return [["O", "O"]];
            default:
              return [];
          }
        };

        const parent1Alleles = getAlleles(p1);
        const parent2Alleles = getAlleles(p2);

        // Count offspring types
        const typeCounts: Record<string, number> = { A: 0, B: 0, AB: 0, O: 0 };
        let totalCombinations = 0;

        for (const p1a of parent1Alleles) {
          for (const p2a of parent2Alleles) {
            // Each genotype pair contributes 4 gamete combinations
            const gametes1 = [p1a[0], p1a[1]];
            const gametes2 = [p2a[0], p2a[1]];
            for (const g1 of gametes1) {
              for (const g2 of gametes2) {
                const pair = [g1, g2].sort().join("");
                let phenotype: string;
                if (pair === "AA" || pair === "AO") phenotype = "A";
                else if (pair === "BB" || pair === "BO") phenotype = "B";
                else if (pair === "AB") phenotype = "AB";
                else phenotype = "O";
                typeCounts[phenotype]++;
                totalCombinations++;
              }
            }
          }
        }

        // Normalize to probabilities
        const possibleTypes: string[] = [];
        const probabilities: Record<string, number> = {};
        for (const type of ["A", "B", "AB", "O"]) {
          if (typeCounts[type] > 0) {
            possibleTypes.push(type);
            probabilities[type] = (typeCounts[type] / totalCombinations) * 100;
          }
        }

        // Rh factor
        // Rh+ can be Dd or DD; Rh- is dd
        // If parent is Rh+, could be DD or Dd (assume equal probability)
        // If parent is Rh-, must be dd
        let rhPosProb: number;
        if (rh1 === "neg" && rh2 === "neg") {
          rhPosProb = 0;
        } else if (rh1 === "neg" || rh2 === "neg") {
          // One Rh-, one Rh+: Rh+ parent is Dd (50%) or DD (50%)
          // If DD × dd: all Dd (pos), If Dd × dd: 50% Dd, 50% dd
          // Average: 75% pos, 25% neg
          rhPosProb = 75;
        } else {
          // Both Rh+: each could be DD or Dd
          // DD×DD=100%, DD×Dd=100%, Dd×DD=100%, Dd×Dd=75%
          // Average: ~93.75%
          rhPosProb = 93.75;
        }
        const rhNegProb = 100 - rhPosProb;

        const details = [];
        for (const type of ["A", "B", "AB", "O"]) {
          if (probabilities[type] !== undefined) {
            details.push({
              label: `Type ${type} Probability`,
              value: formatNumber(probabilities[type]) + "%",
            });
          }
        }
        details.push({ label: "Rh Positive Probability", value: formatNumber(rhPosProb) + "%" });
        details.push({ label: "Rh Negative Probability", value: formatNumber(rhNegProb) + "%" });

        const impossibleTypes = ["A", "B", "AB", "O"].filter((t) => !probabilities[t]);
        if (impossibleTypes.length > 0) {
          details.push({
            label: "Impossible Blood Types",
            value: impossibleTypes.join(", "),
          });
        }

        return {
          primary: {
            label: "Possible Child Blood Types",
            value: possibleTypes.join(", "),
          },
          details,
          note: "Probabilities are estimates based on assumed genotype frequencies. Actual results depend on the exact genotypes of the parents (e.g., whether type A is AA or AO). Rare genetic phenomena (Bombay phenotype, cis-AB) are not considered.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-percentile", "pregnancy-weight-gain", "life-expectancy-calc"],
  faq: [
    {
      question: "How is blood type inherited?",
      answer:
        "Blood type is determined by the ABO gene on chromosome 9. There are three alleles: A, B, and O. A and B are co-dominant (both expressed when present), while O is recessive. Each parent contributes one allele. For example, a parent with type A blood can be genotype AA or AO.",
    },
    {
      question: "Can two type O parents have a child with a different blood type?",
      answer:
        "No, under standard genetics. If both parents are type O (genotype OO), all children will be type O. However, extremely rare genetic variants (like Bombay phenotype or cis-AB) can produce unexpected results.",
    },
    {
      question: "What is the Rh factor?",
      answer:
        "The Rh factor (Rh D antigen) is a protein on the surface of red blood cells. If present, you are Rh positive (+); if absent, Rh negative (-). The Rh gene (RHD) has two alleles: D (dominant, Rh+) and d (recessive, Rh-). Two Rh negative parents will always have Rh negative children.",
    },
  ],
  formula:
    "ABO inheritance follows Mendelian genetics with three alleles (A, B, O). A and B are co-dominant over O. Genotype possibilities: Type A = AA or AO, Type B = BB or BO, Type AB = AB, Type O = OO. Rh follows simple dominant/recessive with D (positive) dominant over d (negative).",
};
