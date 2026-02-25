import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogSweaterSizeCalculator: CalculatorDefinition = {
  slug: "dog-sweater-size-calculator",
  title: "Dog Sweater Size Calculator",
  description:
    "Free dog sweater size calculator. Find the right sweater, coat, or jacket size for your dog based on body measurements, breed, and clothing type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog sweater size",
    "dog coat size",
    "dog jacket size",
    "dog clothing calculator",
    "dog sweater measurement",
  ],
  variants: [
    {
      id: "sweater-size",
      name: "Dog Sweater/Coat Size",
      description: "Calculate the correct sweater or coat size for your dog",
      fields: [
        {
          name: "backLength",
          label: "Back Length (collar to tail base)",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "inches",
          min: 5,
          max: 40,
          step: 0.5,
        },
        {
          name: "chestGirth",
          label: "Chest Girth (widest part of ribcage)",
          type: "number",
          placeholder: "e.g. 22",
          suffix: "inches",
          min: 8,
          max: 50,
          step: 0.5,
        },
        {
          name: "neckGirth",
          label: "Neck Circumference",
          type: "number",
          placeholder: "e.g. 14",
          suffix: "inches",
          min: 5,
          max: 35,
          step: 0.5,
        },
        {
          name: "garmentType",
          label: "Garment Type",
          type: "select",
          options: [
            { label: "Sweater/Pullover", value: "sweater" },
            { label: "Jacket/Coat (zip/velcro)", value: "jacket" },
            { label: "Rain Coat", value: "rain" },
            { label: "Winter Parka (heavy)", value: "parka" },
          ],
          defaultValue: "sweater",
        },
        {
          name: "bodyType",
          label: "Body Type",
          type: "select",
          options: [
            { label: "Slim/Athletic (Greyhound, Whippet)", value: "slim" },
            { label: "Standard (Lab, Golden)", value: "standard" },
            { label: "Barrel-chested (Bulldog, Pug)", value: "barrel" },
            { label: "Long/Low (Dachshund, Corgi)", value: "long" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const backLength = inputs.backLength as number;
        const chestGirth = inputs.chestGirth as number;
        const neckGirth = inputs.neckGirth as number;
        const garmentType = inputs.garmentType as string;
        const bodyType = inputs.bodyType as string;
        if (!backLength || !chestGirth || !neckGirth) return null;

        // Size determination based on back length (primary measurement)
        let sizeLabel: string;
        if (backLength <= 8) sizeLabel = "XXS";
        else if (backLength <= 10) sizeLabel = "XS";
        else if (backLength <= 13) sizeLabel = "S";
        else if (backLength <= 17) sizeLabel = "M";
        else if (backLength <= 21) sizeLabel = "L";
        else if (backLength <= 25) sizeLabel = "XL";
        else if (backLength <= 30) sizeLabel = "2XL";
        else sizeLabel = "3XL";

        // Fit adjustments for body type
        let fitNote = "";
        if (bodyType === "barrel") {
          fitNote = "Barrel-chested breeds often need to size up for chest girth. Prioritize chest measurement over back length.";
        } else if (bodyType === "slim") {
          fitNote = "Slim breeds may need breed-specific sizing. Standard garments may be too loose around the chest.";
        } else if (bodyType === "long") {
          fitNote = "Long-bodied breeds need extended back length. Look for breed-specific or custom options.";
        }

        // Garment-specific advice
        let garmentAdvice: string;
        switch (garmentType) {
          case "sweater":
            garmentAdvice = "Choose stretchy material for easier dressing";
            break;
          case "jacket":
            garmentAdvice = "Velcro/zip closures are easier to adjust for fit";
            break;
          case "rain":
            garmentAdvice = "Size up slightly for waterproof materials (less stretch)";
            break;
          case "parka":
            garmentAdvice = "Account for insulation bulk; may need to size up";
            break;
          default:
            garmentAdvice = "Standard sizing";
        }

        // Ease: add 1-2 inches to chest for comfort
        const garmentChest = garmentType === "parka" ? chestGirth + 3 : chestGirth + 2;

        return {
          primary: {
            label: "Recommended Size",
            value: sizeLabel,
          },
          details: [
            { label: "Back Length", value: `${formatNumber(backLength, 1)} inches` },
            { label: "Chest Girth", value: `${formatNumber(chestGirth, 1)} inches` },
            { label: "Neck Girth", value: `${formatNumber(neckGirth, 1)} inches` },
            { label: "Garment Chest (with ease)", value: `${formatNumber(garmentChest, 1)} inches` },
            { label: "Garment Advice", value: garmentAdvice },
          ],
          note: fitNote || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["dog-collar-size-calculator", "dog-boot-size-calculator"],
  faq: [
    {
      question: "How do I measure my dog for a sweater?",
      answer:
        "You need three measurements: (1) Back length - from the base of the neck (where the collar sits) to the base of the tail; (2) Chest girth - around the widest part of the ribcage, just behind the front legs; (3) Neck circumference - around the base of the neck where a collar sits.",
    },
    {
      question: "Which dogs need sweaters?",
      answer:
        "Dogs that benefit most from sweaters include small breeds, toy breeds, short-haired breeds, senior dogs, puppies, dogs with thin coats (like Greyhounds), and any dog that shivers in cold weather. Breeds with thick double coats (Huskies, Malamutes) typically do not need sweaters.",
    },
    {
      question: "What if my dog is between sizes?",
      answer:
        "If your dog is between sizes, generally size up for comfort. A slightly loose garment is better than one that restricts movement or breathing. For barrel-chested breeds, always prioritize the chest girth measurement.",
    },
  ],
  formula:
    "Size based on Back Length: XXS (<=8\"), XS (<=10\"), S (<=13\"), M (<=17\"), L (<=21\"), XL (<=25\"), 2XL (<=30\"), 3XL (>30\")",
};
