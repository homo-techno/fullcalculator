import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogBootSizeCalculator: CalculatorDefinition = {
  slug: "dog-boot-size-calculator",
  title: "Dog Boot Size Calculator",
  description:
    "Free dog boot size calculator. Find the correct boot or shoe size for your dog based on paw measurements, breed size, and intended use.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog boot size",
    "dog shoe size",
    "dog paw measurement",
    "dog boot calculator",
    "dog paw size chart",
  ],
  variants: [
    {
      id: "boot-size",
      name: "Dog Boot Size",
      description: "Calculate the correct boot size for your dog's paws",
      fields: [
        {
          name: "pawWidth",
          label: "Paw Width (widest point)",
          type: "number",
          placeholder: "e.g. 2.5",
          suffix: "inches",
          min: 1,
          max: 6,
          step: 0.1,
        },
        {
          name: "pawLength",
          label: "Paw Length (toe to heel pad)",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "inches",
          min: 1,
          max: 7,
          step: 0.1,
        },
        {
          name: "dogWeight",
          label: "Dog Weight",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "lbs",
          min: 3,
          max: 200,
        },
        {
          name: "bootPurpose",
          label: "Primary Use",
          type: "select",
          options: [
            { label: "Hot Pavement Protection", value: "heat" },
            { label: "Snow/Ice/Cold Weather", value: "cold" },
            { label: "Hiking/Rough Terrain", value: "hiking" },
            { label: "Indoor Traction (senior dogs)", value: "indoor" },
            { label: "Injury/Paw Protection", value: "injury" },
          ],
          defaultValue: "cold",
        },
      ],
      calculate: (inputs) => {
        const pawWidth = inputs.pawWidth as number;
        const pawLength = inputs.pawLength as number;
        const dogWeight = inputs.dogWeight as number;
        const bootPurpose = inputs.bootPurpose as string;
        if (!pawWidth || !pawLength || !dogWeight) return null;

        // Use the larger measurement for sizing
        const maxDimension = Math.max(pawWidth, pawLength);

        // Boot size chart (general industry sizing)
        let sizeLabel: string;
        let sizeNumber: number;
        if (maxDimension <= 1.5) { sizeLabel = "XXS"; sizeNumber = 1; }
        else if (maxDimension <= 2.0) { sizeLabel = "XS"; sizeNumber = 2; }
        else if (maxDimension <= 2.5) { sizeLabel = "S"; sizeNumber = 3; }
        else if (maxDimension <= 3.0) { sizeLabel = "M"; sizeNumber = 4; }
        else if (maxDimension <= 3.5) { sizeLabel = "M/L"; sizeNumber = 5; }
        else if (maxDimension <= 4.0) { sizeLabel = "L"; sizeNumber = 6; }
        else if (maxDimension <= 4.5) { sizeLabel = "XL"; sizeNumber = 7; }
        else { sizeLabel = "XXL"; sizeNumber = 8; }

        // Boot type recommendation
        let bootType: string;
        switch (bootPurpose) {
          case "heat":
            bootType = "Breathable mesh boots with thick rubber soles";
            break;
          case "cold":
            bootType = "Insulated waterproof boots with fleece lining";
            break;
          case "hiking":
            bootType = "Rugged boots with Vibram-style soles and ankle support";
            break;
          case "indoor":
            bootType = "Lightweight socks with rubber grip pads";
            break;
          case "injury":
            bootType = "Medical/protective boots with secure closures";
            break;
          default:
            bootType = "All-purpose boots";
        }

        // Note: front and rear paws often differ
        const pawNote = "Front paws are typically wider than rear paws. Measure both and size for the larger paw if buying one set.";

        return {
          primary: {
            label: "Recommended Boot Size",
            value: `${sizeLabel} (Size ${sizeNumber})`,
          },
          details: [
            { label: "Paw Width", value: `${formatNumber(pawWidth, 1)} inches` },
            { label: "Paw Length", value: `${formatNumber(pawLength, 1)} inches` },
            { label: "Sizing Dimension (larger)", value: `${formatNumber(maxDimension, 1)} inches` },
            { label: "Recommended Boot Type", value: bootType },
            { label: "Boots Needed", value: "4 (full set)" },
          ],
          note: pawNote,
        };
      },
    },
  ],
  relatedSlugs: ["dog-collar-size-calculator", "dog-sweater-size-calculator"],
  faq: [
    {
      question: "How do I measure my dog's paw for boots?",
      answer:
        "Place your dog's paw on a piece of paper and press down gently to simulate standing weight. Trace around the paw including the nails. Measure the width at the widest point and the length from the longest toe to the back of the heel pad. Use the larger measurement for boot sizing.",
    },
    {
      question: "Do dogs really need boots?",
      answer:
        "Dog boots are beneficial in extreme temperatures (hot pavement over 120F can burn paw pads, and ice/salt can cause cracking), on rough terrain, for senior dogs needing traction on slippery floors, and for dogs with paw injuries or allergies.",
    },
    {
      question: "How do I get my dog to accept wearing boots?",
      answer:
        "Introduce boots gradually. Start by letting your dog sniff the boots, then put them on for short periods indoors with lots of treats and praise. Gradually increase wearing time. Most dogs adapt within a week of consistent, positive introduction.",
    },
  ],
  formula:
    "Boot Size based on max(Paw Width, Paw Length) mapped to size chart: XXS (<1.5\") to XXL (>4.5\")",
};
