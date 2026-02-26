import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paverSandCalculator: CalculatorDefinition = {
  slug: "paver-sand-calc",
  title: "Paver Base Sand Calculator",
  description:
    "Free online paver sand calculator. Estimate how much base sand and joint sand you need for a paver patio, walkway, or driveway.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "paver",
    "sand",
    "base",
    "joint",
    "patio",
    "walkway",
    "driveway",
    "gravel",
    "leveling",
  ],
  variants: [
    {
      id: "paver-sand",
      name: "Paver Base & Joint Sand",
      description: "Calculate sand needed for paver installation",
      fields: [
        {
          name: "length",
          label: "Area Length",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "ft",
        },
        {
          name: "width",
          label: "Area Width",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "ft",
        },
        {
          name: "baseDepth",
          label: "Sand Base Depth",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "in",
          defaultValue: 1,
        },
        {
          name: "jointDepth",
          label: "Joint Sand Depth",
          type: "number",
          placeholder: "e.g. 0.5",
          suffix: "in",
          defaultValue: 0.5,
        },
        {
          name: "gravelDepth",
          label: "Gravel Sub-Base Depth (optional)",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "in",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const baseDepth = parseFloat(inputs.baseDepth as string) || 1;
        const jointDepth = parseFloat(inputs.jointDepth as string) || 0.5;
        const gravelDepth = parseFloat(inputs.gravelDepth as string) || 0;

        if (length <= 0 || width <= 0) return null;

        const areaSqFt = length * width;

        // Base sand volume
        const baseCuFt = areaSqFt * (baseDepth / 12);
        const baseCuYd = baseCuFt / 27;
        const baseTons = baseCuYd * 1.35; // sand ~1.35 tons per cu yd

        // Joint sand: approximately 10-15% of surface coverage
        const jointCuFt = areaSqFt * (jointDepth / 12) * 0.12; // ~12% joint area
        const jointCuYd = jointCuFt / 27;
        const jointTons = jointCuYd * 1.35;

        // Gravel sub-base
        const gravelCuFt = areaSqFt * (gravelDepth / 12);
        const gravelCuYd = gravelCuFt / 27;
        const gravelTons = gravelCuYd * 1.4; // gravel ~1.4 tons per cu yd

        const details: { label: string; value: string }[] = [
          { label: "Area", value: formatNumber(areaSqFt) + " sq ft" },
          { label: "Base sand", value: formatNumber(baseCuYd) + " cu yd" },
          { label: "Base sand weight", value: formatNumber(baseTons) + " tons" },
          { label: "Joint sand", value: formatNumber(jointCuYd) + " cu yd" },
          { label: "Joint sand weight", value: formatNumber(jointTons) + " tons" },
        ];

        if (gravelDepth > 0) {
          details.push(
            { label: "Gravel sub-base", value: formatNumber(gravelCuYd) + " cu yd" },
            { label: "Gravel weight", value: formatNumber(gravelTons) + " tons" }
          );
        }

        const totalCuYd = baseCuYd + jointCuYd;

        return {
          primary: {
            label: "Total Sand Needed",
            value: formatNumber(totalCuYd) + " cubic yards",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["topsoil-calculator", "concrete-slab", "grout-calculator"],
  faq: [
    {
      question: "How deep should paver base sand be?",
      answer:
        "The bedding sand layer for pavers should typically be 1 inch deep after compaction. Below that, a gravel sub-base of 4-6 inches is standard for patios, and 8-12 inches for driveways.",
    },
    {
      question: "What type of sand should I use for pavers?",
      answer:
        "Use coarse concrete sand (also called C-33 sand) for the bedding layer. For joint sand, use polymeric sand which hardens when wet and prevents weed growth and ant intrusion.",
    },
  ],
  formula:
    "Base Sand (cu yd) = (Area × BaseDepth/12) / 27; Joint Sand (cu yd) = (Area × JointDepth/12 × 0.12) / 27",
};
