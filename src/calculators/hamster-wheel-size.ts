import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hamsterWheelSizeCalculator: CalculatorDefinition = {
  slug: "hamster-wheel-size-calculator",
  title: "Hamster Wheel Size Calculator",
  description:
    "Free hamster wheel size calculator. Find the correct exercise wheel diameter for your hamster species to prevent back problems and ensure safe exercise.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hamster wheel size",
    "hamster wheel calculator",
    "exercise wheel diameter",
    "hamster running wheel",
    "hamster cage wheel",
  ],
  variants: [
    {
      id: "wheel-size",
      name: "Hamster Wheel Size",
      description: "Calculate the correct wheel size for your hamster",
      fields: [
        {
          name: "hamsterSpecies",
          label: "Hamster Species",
          type: "select",
          options: [
            { label: "Dwarf (Roborovski)", value: "robo" },
            { label: "Dwarf (Winter White / Campbell)", value: "dwarf" },
            { label: "Chinese Hamster", value: "chinese" },
            { label: "Syrian (Golden) Hamster", value: "syrian" },
          ],
          defaultValue: "syrian",
        },
        {
          name: "hamsterLength",
          label: "Hamster Body Length (optional)",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "inches",
          min: 2,
          max: 10,
        },
        {
          name: "wheelType",
          label: "Wheel Type Preference",
          type: "select",
          options: [
            { label: "Solid Surface (recommended)", value: "solid" },
            { label: "Mesh/Wire", value: "mesh" },
            { label: "Flying Saucer", value: "saucer" },
          ],
          defaultValue: "solid",
        },
      ],
      calculate: (inputs) => {
        const hamsterSpecies = inputs.hamsterSpecies as string;
        const hamsterLength = inputs.hamsterLength as number;
        const wheelType = inputs.wheelType as string;

        // Minimum wheel diameters by species
        let minDiameter: number;
        let idealDiameter: number;
        let avgBodyLength: number;

        switch (hamsterSpecies) {
          case "robo":
            minDiameter = 6.5;
            idealDiameter = 8;
            avgBodyLength = 2;
            break;
          case "dwarf":
            minDiameter = 8;
            idealDiameter = 10;
            avgBodyLength = 3.5;
            break;
          case "chinese":
            minDiameter = 8;
            idealDiameter = 10;
            avgBodyLength = 4;
            break;
          case "syrian":
            minDiameter = 10;
            idealDiameter = 12;
            avgBodyLength = 6;
            break;
          default:
            minDiameter = 8;
            idealDiameter = 10;
            avgBodyLength = 4;
        }

        // If body length is provided, use it to refine recommendation
        if (hamsterLength && hamsterLength > 0) {
          const calculatedMin = hamsterLength * 2;
          if (calculatedMin > minDiameter) {
            minDiameter = Math.ceil(calculatedMin);
            idealDiameter = Math.ceil(calculatedMin * 1.3);
          }
        }

        // Saucer wheels need to be larger
        let saucerNote = "";
        if (wheelType === "saucer") {
          minDiameter = Math.ceil(minDiameter * 1.4);
          idealDiameter = Math.ceil(idealDiameter * 1.4);
          saucerNote = "Flying saucer wheels need to be larger due to the angled running surface.";
        }

        const meshWarning =
          wheelType === "mesh"
            ? "Warning: Wire/mesh wheels can cause bumblefoot. Solid surface wheels are strongly recommended."
            : "";

        // Cage size recommendation based on species
        const minCageSize =
          hamsterSpecies === "syrian" ? "620 sq inches" : "450 sq inches";

        return {
          primary: {
            label: "Minimum Wheel Diameter",
            value: `${formatNumber(minDiameter)} inches`,
          },
          details: [
            { label: "Ideal Wheel Diameter", value: `${formatNumber(idealDiameter)} inches` },
            { label: "Body Length (avg for species)", value: `${avgBodyLength} inches` },
            { label: "Wheel Type", value: wheelType === "solid" ? "Solid (Recommended)" : wheelType === "saucer" ? "Flying Saucer" : "Mesh (Not Recommended)" },
            { label: "Minimum Cage Floor Space", value: minCageSize },
            { label: "Daily Run Distance (avg)", value: `5-8 miles` },
          ],
          note: meshWarning || saucerNote || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["guinea-pig-cage-calculator", "rabbit-enclosure-calculator"],
  faq: [
    {
      question: "Why does hamster wheel size matter?",
      answer:
        "A wheel that is too small forces the hamster to arch its back while running, which can cause permanent spinal damage over time. The wheel should be large enough that the hamster's back remains straight or slightly curved while running.",
    },
    {
      question: "What type of wheel is safest?",
      answer:
        "Solid surface wheels are the safest option. Wire or mesh wheels can cause a condition called bumblefoot (pododermatitis) and toes or legs can get caught in the gaps. Look for wheels with a solid, non-slip running surface.",
    },
    {
      question: "How far do hamsters run at night?",
      answer:
        "Hamsters are very active runners and can cover 5-8 miles per night on their wheel. Syrian hamsters tend to run the most. This is why having a properly sized, quiet wheel is essential for their health and your sleep.",
    },
  ],
  formula:
    "Minimum Wheel Diameter = Hamster Body Length x 2 | Ideal Diameter = Minimum x 1.3",
};
