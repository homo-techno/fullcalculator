import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogYardSizeCalculator: CalculatorDefinition = {
  slug: "dog-yard-size-calculator",
  title: "Dog Yard Size Calculator",
  description:
    "Free dog yard size calculator. Determine the ideal fenced yard or outdoor space needed for your dog based on breed, size, energy level, and activities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog yard size",
    "dog yard calculator",
    "fenced yard for dogs",
    "dog exercise space",
    "dog outdoor area",
  ],
  variants: [
    {
      id: "yard-size",
      name: "Dog Yard Size",
      description: "Calculate the recommended yard size for your dog",
      fields: [
        {
          name: "dogWeight",
          label: "Dog Weight",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "lbs",
          min: 5,
          max: 200,
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
          name: "energyLevel",
          label: "Energy Level",
          type: "select",
          options: [
            { label: "Low (Bulldog, Shih Tzu)", value: "low" },
            { label: "Medium (Lab, Poodle)", value: "medium" },
            { label: "High (Border Collie, Husky, GSD)", value: "high" },
            { label: "Very High (Working/Herding breeds)", value: "vhigh" },
          ],
          defaultValue: "medium",
        },
        {
          name: "activities",
          label: "Planned Activities",
          type: "select",
          options: [
            { label: "Basic potty breaks & strolling", value: "basic" },
            { label: "Fetch & moderate play", value: "fetch" },
            { label: "Agility / active play", value: "agility" },
            { label: "Free running / zoomies", value: "running" },
          ],
          defaultValue: "fetch",
        },
        {
          name: "dailyWalks",
          label: "Daily Walks/Exercise Outside Yard",
          type: "select",
          options: [
            { label: "None (yard is primary exercise)", value: "none" },
            { label: "Short walks (under 30 min)", value: "short" },
            { label: "Long walks/runs (30+ min)", value: "long" },
          ],
          defaultValue: "short",
        },
      ],
      calculate: (inputs) => {
        const dogWeight = inputs.dogWeight as number;
        const numberOfDogs = inputs.numberOfDogs as number;
        const energyLevel = inputs.energyLevel as string;
        const activities = inputs.activities as string;
        const dailyWalks = inputs.dailyWalks as string;
        if (!dogWeight || !numberOfDogs) return null;

        // Base yard size by dog weight
        let baseSqFt: number;
        if (dogWeight <= 15) baseSqFt = 200;
        else if (dogWeight <= 40) baseSqFt = 400;
        else if (dogWeight <= 70) baseSqFt = 600;
        else if (dogWeight <= 100) baseSqFt = 900;
        else baseSqFt = 1200;

        // Energy level multiplier
        let energyMultiplier = 1.0;
        if (energyLevel === "high") energyMultiplier = 1.5;
        else if (energyLevel === "vhigh") energyMultiplier = 2.0;
        else if (energyLevel === "low") energyMultiplier = 0.7;

        // Activity multiplier
        let activityMultiplier = 1.0;
        if (activities === "agility") activityMultiplier = 1.5;
        else if (activities === "running") activityMultiplier = 2.0;
        else if (activities === "basic") activityMultiplier = 0.6;

        // Walk adjustment
        let walkAdjustment = 1.0;
        if (dailyWalks === "none") walkAdjustment = 1.4;
        else if (dailyWalks === "long") walkAdjustment = 0.75;

        let totalSqFt = Math.round(
          baseSqFt * energyMultiplier * activityMultiplier * walkAdjustment
        );

        // Multiple dogs
        totalSqFt = Math.round(totalSqFt * (1 + (numberOfDogs - 1) * 0.5));

        // Fence height recommendation
        let fenceHeight: string;
        if (dogWeight > 70 || energyLevel === "high" || energyLevel === "vhigh") {
          fenceHeight = "6 feet";
        } else if (dogWeight > 30) {
          fenceHeight = "5 feet";
        } else {
          fenceHeight = "4 feet";
        }

        // Approximate dimensions (roughly square)
        const sideFt = Math.round(Math.sqrt(totalSqFt));
        const fencingFt = sideFt * 4;

        return {
          primary: {
            label: "Recommended Yard Size",
            value: `${formatNumber(totalSqFt)} sq ft`,
          },
          details: [
            { label: "Approximate Dimensions", value: `${sideFt} x ${sideFt} ft` },
            { label: "Fencing Needed (perimeter)", value: `${formatNumber(fencingFt)} linear ft` },
            { label: "Minimum Fence Height", value: fenceHeight },
            { label: "As Fraction of Acre", value: `${formatNumber(totalSqFt / 43560, 2)} acres` },
            { label: "Shade Area Needed", value: `${formatNumber(Math.round(totalSqFt * 0.2))} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-kennel-size-calculator", "dog-collar-size-calculator"],
  faq: [
    {
      question: "How big of a yard does a dog need?",
      answer:
        "Yard size depends greatly on breed and energy level. Small, low-energy dogs can be happy with 200 sq ft, while large, high-energy breeds benefit from 1,000+ sq ft. Supplementing with daily walks and park visits can compensate for a smaller yard.",
    },
    {
      question: "How high should a fence be for dogs?",
      answer:
        "Small dogs need a 4-foot fence, medium dogs need 5 feet, and large or athletic breeds need at least 6 feet. Some breeds known for jumping (like Huskies) may require even higher fencing or coyote rollers on top.",
    },
    {
      question: "Can dogs be happy without a yard?",
      answer:
        "Yes, many dogs live happily without yards if they receive adequate daily exercise through walks, runs, dog parks, and indoor play. Some breeds (especially small, low-energy dogs) adapt very well to apartment living with regular outdoor outings.",
    },
  ],
  formula:
    "Yard Size = Base (by weight) x Energy Multiplier x Activity Multiplier x Walk Adjustment x Dog Count Factor",
};
