import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogCollarSizeCalculator: CalculatorDefinition = {
  slug: "dog-collar-size-calculator",
  title: "Dog Collar Size Calculator",
  description:
    "Free dog collar size calculator. Find the perfect collar size for your dog based on neck measurement, breed size, and collar type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog collar size",
    "dog collar calculator",
    "dog neck size",
    "collar measurement",
    "dog collar fitting",
  ],
  variants: [
    {
      id: "collar-size",
      name: "Dog Collar Size",
      description: "Calculate the correct collar size for your dog",
      fields: [
        {
          name: "neckCircumference",
          label: "Neck Circumference",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "inches",
          min: 4,
          max: 40,
        },
        {
          name: "dogSize",
          label: "Dog Size Category",
          type: "select",
          options: [
            { label: "Toy (under 10 lbs)", value: "toy" },
            { label: "Small (10-25 lbs)", value: "small" },
            { label: "Medium (25-55 lbs)", value: "medium" },
            { label: "Large (55-85 lbs)", value: "large" },
            { label: "Extra Large (over 85 lbs)", value: "xlarge" },
          ],
          defaultValue: "medium",
        },
        {
          name: "collarType",
          label: "Collar Type",
          type: "select",
          options: [
            { label: "Flat/Buckle Collar", value: "flat" },
            { label: "Martingale", value: "martingale" },
            { label: "Harness (chest)", value: "harness" },
            { label: "Head Halter", value: "head" },
          ],
          defaultValue: "flat",
        },
        {
          name: "furType",
          label: "Fur/Coat Type",
          type: "select",
          options: [
            { label: "Short/Smooth", value: "short" },
            { label: "Medium", value: "medium" },
            { label: "Long/Thick/Fluffy", value: "long" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const neckCircumference = inputs.neckCircumference as number;
        const dogSize = inputs.dogSize as string;
        const collarType = inputs.collarType as string;
        const furType = inputs.furType as string;
        if (!neckCircumference) return null;

        // Add 2 inches for standard fit (two-finger rule)
        let adjustment = 2;
        if (furType === "long") adjustment = 2.5;
        else if (furType === "short") adjustment = 1.5;

        const collarSize = neckCircumference + adjustment;

        // Collar width recommendation
        let collarWidth: string;
        if (dogSize === "toy") collarWidth = "3/8 to 1/2 inch";
        else if (dogSize === "small") collarWidth = "1/2 to 3/4 inch";
        else if (dogSize === "medium") collarWidth = "3/4 to 1 inch";
        else if (dogSize === "large") collarWidth = "1 to 1.5 inches";
        else collarWidth = "1.5 to 2 inches";

        // Size label
        let sizeLabel: string;
        if (collarSize <= 10) sizeLabel = "XS";
        else if (collarSize <= 14) sizeLabel = "S";
        else if (collarSize <= 18) sizeLabel = "M";
        else if (collarSize <= 24) sizeLabel = "L";
        else sizeLabel = "XL";

        // Martingale adjustment
        let martingaleNote = "";
        if (collarType === "martingale") {
          martingaleNote = "For martingale collars, the loose setting should match your collar size. When tightened, it should be snug but not choking.";
        }

        // Harness sizing
        let chestSize = "";
        if (collarType === "harness") {
          const chestEstimate = neckCircumference * 1.6;
          chestSize = `${formatNumber(chestEstimate, 1)} inches (estimated)`;
        }

        return {
          primary: {
            label: "Recommended Collar Size",
            value: `${formatNumber(collarSize, 1)} inches`,
          },
          details: [
            { label: "Size Label", value: sizeLabel },
            { label: "Neck Measurement", value: `${formatNumber(neckCircumference)} inches` },
            { label: "Fit Adjustment (+2 finger rule)", value: `+${adjustment} inches` },
            { label: "Recommended Width", value: collarWidth },
            ...(chestSize ? [{ label: "Estimated Chest Girth", value: chestSize }] : []),
            { label: "Collar Type", value: collarType === "flat" ? "Flat/Buckle" : collarType === "martingale" ? "Martingale" : collarType === "harness" ? "Harness" : "Head Halter" },
          ],
          note: martingaleNote || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["dog-boot-size-calculator", "dog-sweater-size-calculator"],
  faq: [
    {
      question: "How do I measure my dog's neck for a collar?",
      answer:
        "Use a soft measuring tape and wrap it around the base of your dog's neck where the collar naturally sits. You should be able to fit two fingers between the tape and the neck for a comfortable fit. This is the 'two-finger rule.'",
    },
    {
      question: "How tight should a dog collar be?",
      answer:
        "A properly fitted collar should allow you to slip two fingers between the collar and your dog's neck. It should be snug enough that it won't slip over the head, but loose enough that it doesn't restrict breathing or cause discomfort.",
    },
    {
      question: "When should I use a harness instead of a collar?",
      answer:
        "Harnesses are recommended for dogs that pull on the leash, brachycephalic (flat-faced) breeds, dogs with neck or trachea issues, toy breeds susceptible to tracheal collapse, and puppies still learning to walk on a leash.",
    },
  ],
  formula:
    "Collar Size = Neck Circumference + Fit Adjustment (2 inches for two-finger rule)",
};
