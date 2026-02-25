import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogKennelSizeCalculator: CalculatorDefinition = {
  slug: "dog-kennel-size-calculator",
  title: "Dog Kennel Run Size Calculator",
  description:
    "Free dog kennel run size calculator. Determine the ideal kennel or dog run dimensions based on your dog's size, breed, number of dogs, and usage pattern.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog kennel size",
    "dog run size",
    "kennel calculator",
    "outdoor dog kennel",
    "dog pen dimensions",
  ],
  variants: [
    {
      id: "kennel-size",
      name: "Dog Kennel/Run Size",
      description: "Calculate the ideal kennel or run size for your dog",
      fields: [
        {
          name: "dogLength",
          label: "Dog Length (nose to tail base)",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "inches",
          min: 10,
          max: 60,
        },
        {
          name: "dogHeight",
          label: "Dog Height (floor to shoulder)",
          type: "number",
          placeholder: "e.g. 22",
          suffix: "inches",
          min: 6,
          max: 40,
        },
        {
          name: "numberOfDogs",
          label: "Number of Dogs",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 5,
        },
        {
          name: "usageType",
          label: "Usage Type",
          type: "select",
          options: [
            { label: "Indoor Crate (sleeping/travel)", value: "crate" },
            { label: "Outdoor Kennel Run (daytime)", value: "outdoor_day" },
            { label: "Outdoor Kennel Run (extended stay)", value: "outdoor_ext" },
            { label: "Indoor Exercise Pen", value: "xpen" },
          ],
          defaultValue: "outdoor_day",
        },
        {
          name: "energyLevel",
          label: "Dog Energy Level",
          type: "select",
          options: [
            { label: "Low (Bulldog, Basset)", value: "low" },
            { label: "Medium (Lab, Golden)", value: "medium" },
            { label: "High (Border Collie, Husky)", value: "high" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const dogLength = inputs.dogLength as number;
        const dogHeight = inputs.dogHeight as number;
        const numberOfDogs = inputs.numberOfDogs as number;
        const usageType = inputs.usageType as string;
        const energyLevel = inputs.energyLevel as string;
        if (!dogLength || !dogHeight || !numberOfDogs) return null;

        let runLength: number;
        let runWidth: number;
        let runHeight: number;

        if (usageType === "crate") {
          // Crate: dog should stand, turn, lie down
          runLength = Math.round(dogLength + 4);
          runWidth = Math.round(dogLength * 0.6 + 4);
          runHeight = Math.round(dogHeight + 4);
        } else if (usageType === "xpen") {
          // Exercise pen: room to play
          const baseArea = dogLength * dogLength * 4;
          const scaledArea = baseArea * numberOfDogs;
          runLength = Math.round(Math.sqrt(scaledArea * 1.5));
          runWidth = Math.round(scaledArea / runLength);
          runHeight = Math.round(dogHeight * 2);
        } else {
          // Outdoor kennel run
          let lengthMultiplier = usageType === "outdoor_ext" ? 5 : 4;
          let widthMultiplier = usageType === "outdoor_ext" ? 3 : 2;

          if (energyLevel === "high") {
            lengthMultiplier *= 1.3;
            widthMultiplier *= 1.2;
          } else if (energyLevel === "low") {
            lengthMultiplier *= 0.85;
            widthMultiplier *= 0.9;
          }

          runLength = Math.round(dogLength * lengthMultiplier);
          runWidth = Math.round(dogLength * widthMultiplier);
          runHeight = Math.round(Math.max(dogHeight * 2.5, 48));

          // Scale for multiple dogs
          if (numberOfDogs > 1) {
            runLength = Math.round(runLength * (1 + (numberOfDogs - 1) * 0.4));
            runWidth = Math.round(runWidth * (1 + (numberOfDogs - 1) * 0.3));
          }
        }

        const areaSqFt = Math.round((runLength * runWidth) / 144);

        // Shelter recommendation
        const shelterNeeded = usageType.startsWith("outdoor") ? "Yes - weatherproof shelter required" : "No";

        return {
          primary: {
            label: "Recommended Kennel Size",
            value: `${runLength} x ${runWidth} x ${runHeight} inches`,
          },
          details: [
            { label: "Length", value: `${runLength} inches (${formatNumber(runLength / 12, 1)} ft)` },
            { label: "Width", value: `${runWidth} inches (${formatNumber(runWidth / 12, 1)} ft)` },
            { label: "Height", value: `${runHeight} inches (${formatNumber(runHeight / 12, 1)} ft)` },
            { label: "Total Area", value: `${formatNumber(areaSqFt)} sq ft` },
            { label: "Weather Shelter", value: shelterNeeded },
            { label: "Fresh Water Station", value: "Required" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-yard-size-calculator", "dog-collar-size-calculator"],
  faq: [
    {
      question: "How big should a dog kennel run be?",
      answer:
        "A dog kennel run should be at least 4x the dog's body length in length and 2x in width for daytime use. For extended stays, increase to 5x by 3x. High-energy breeds need 20-30% more space. Always include shelter, water, and shade.",
    },
    {
      question: "What size crate does my dog need?",
      answer:
        "A crate should be large enough for your dog to stand up fully, turn around completely, and lie down stretched out. Add about 4 inches to your dog's length and height for the crate dimensions. The crate should feel like a den, not a prison.",
    },
    {
      question: "How long can a dog stay in a kennel?",
      answer:
        "Adult dogs should not be crated for more than 4-6 hours at a time during the day. Puppies can handle fewer hours (roughly 1 hour per month of age). Outdoor kennel runs allow for longer stays if shelter, water, and adequate space are provided, but dogs still need regular exercise and socialization.",
    },
  ],
  formula:
    "Crate: Length = Dog Length + 4 | Kennel Run: Length = Dog Length x 4-5 multiplier | Height = Dog Height x 2.5",
};
