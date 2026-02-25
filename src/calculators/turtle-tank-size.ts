import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turtleTankSizeCalculator: CalculatorDefinition = {
  slug: "turtle-tank-size-calculator",
  title: "Turtle Tank Size Calculator",
  description:
    "Free turtle tank size calculator. Determine the minimum aquarium or enclosure size for your turtle based on species, shell length, and number of turtles.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "turtle tank size",
    "turtle aquarium calculator",
    "turtle enclosure size",
    "red eared slider tank",
    "turtle habitat size",
  ],
  variants: [
    {
      id: "tank-size",
      name: "Turtle Tank Size",
      description: "Calculate the minimum tank size for your turtle",
      fields: [
        {
          name: "turtleSpecies",
          label: "Turtle Type",
          type: "select",
          options: [
            { label: "Red-Eared Slider", value: "res" },
            { label: "Painted Turtle", value: "painted" },
            { label: "Map Turtle", value: "map" },
            { label: "Musk/Mud Turtle", value: "musk" },
            { label: "Box Turtle (semi-aquatic)", value: "box" },
          ],
          defaultValue: "res",
        },
        {
          name: "shellLength",
          label: "Shell Length (SCL)",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "inches",
          min: 1,
          max: 18,
        },
        {
          name: "numberOfTurtles",
          label: "Number of Turtles",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 5,
        },
        {
          name: "isJuvenile",
          label: "Turtle Age",
          type: "select",
          options: [
            { label: "Juvenile (still growing)", value: "juvenile" },
            { label: "Adult (full grown)", value: "adult" },
          ],
          defaultValue: "adult",
        },
      ],
      calculate: (inputs) => {
        const turtleSpecies = inputs.turtleSpecies as string;
        const shellLength = inputs.shellLength as number;
        const numberOfTurtles = inputs.numberOfTurtles as number;
        const isJuvenile = inputs.isJuvenile as string;
        if (!shellLength || !numberOfTurtles) return null;

        // Rule: 10 gallons per inch of shell for the first turtle
        let gallonsPerInch = 10;
        if (turtleSpecies === "musk") gallonsPerInch = 8; // Smaller, less active
        else if (turtleSpecies === "box") gallonsPerInch = 6; // Semi-aquatic, needs more land

        let baseGallons = shellLength * gallonsPerInch;

        // Additional turtles need ~50% more
        const totalGallons = Math.round(baseGallons + (numberOfTurtles - 1) * baseGallons * 0.5);

        // If juvenile, calculate for expected adult size
        let adultSize: number;
        switch (turtleSpecies) {
          case "res": adultSize = 10; break;
          case "painted": adultSize = 8; break;
          case "map": adultSize = 7; break;
          case "musk": adultSize = 5; break;
          case "box": adultSize = 6; break;
          default: adultSize = 8;
        }

        const adultGallons = Math.round(
          adultSize * gallonsPerInch + (numberOfTurtles - 1) * adultSize * gallonsPerInch * 0.5
        );

        // Water depth: at least 1.5x shell length
        const waterDepth = Math.round(shellLength * 1.5);

        // Basking area: ~25% of tank surface
        const tankLengthInches = Math.round(Math.sqrt(totalGallons * 231 / (12 * 12)) * 2.5);
        const tankWidthInches = Math.round(tankLengthInches * 0.5);

        // UVB and heating requirements
        const waterTemp = turtleSpecies === "musk" ? "72-78F" : "75-82F";
        const baskingTemp = "85-95F";

        return {
          primary: {
            label: "Minimum Tank Size",
            value: `${formatNumber(totalGallons)} gallons`,
          },
          details: [
            { label: "Adult Size Tank Needed", value: isJuvenile === "juvenile" ? `${formatNumber(adultGallons)} gallons` : "Current size is adult" },
            { label: "Expected Adult Shell Length", value: `${adultSize} inches` },
            { label: "Minimum Water Depth", value: `${waterDepth} inches` },
            { label: "Water Temperature", value: waterTemp },
            { label: "Basking Temperature", value: baskingTemp },
            { label: "UVB Light Required", value: "Yes (10.0 or 12% UVB)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fish-tank-stocking-calculator", "aquarium-heater-calculator"],
  faq: [
    {
      question: "How big of a tank does a red-eared slider need?",
      answer:
        "Red-eared sliders need 10 gallons of water per inch of shell length. An adult red-eared slider with a 10-inch shell needs at least a 100-gallon tank. They are one of the larger common pet turtles, so plan for adult size when buying a tank.",
    },
    {
      question: "Do turtles need a basking area?",
      answer:
        "Yes, most aquatic and semi-aquatic turtles need a dry basking area where they can completely leave the water. The basking spot should have a heat lamp (85-95F) and UVB lighting. Without proper basking, turtles can develop shell rot and metabolic bone disease.",
    },
    {
      question: "Can turtles live together?",
      answer:
        "Some turtle species can cohabitate, but it requires significantly more space (at least 50% more per additional turtle). Turtles can be territorial, so monitor for aggression. Mixing species is generally not recommended.",
    },
  ],
  formula:
    "Tank Size (gallons) = Shell Length (inches) x 10 gallons per inch | Additional Turtle = +50% base gallons",
};
