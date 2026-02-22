import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pleatedSkirtCalculator: CalculatorDefinition = {
  slug: "pleated-skirt-calculator",
  title: "Pleated Skirt Calculator",
  description: "Free pleated skirt calculator. Calculate pleat count, fabric yardage, and pleat spacing for box pleats, knife pleats, and accordion pleats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pleated skirt calculator", "box pleat calculator", "knife pleat calculator", "pleat spacing", "pleat fabric calculator"],
  variants: [
    {
      id: "pleat-fabric",
      name: "Pleat Fabric Calculator",
      description: "Calculate how much fabric you need for pleats",
      fields: [
        { name: "waist", label: "Waist Measurement", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.25 },
        { name: "skirtLength", label: "Skirt Length", type: "number", placeholder: "e.g. 22", suffix: "in", step: 0.5 },
        { name: "pleatType", label: "Pleat Type", type: "select", options: [
          { label: "Knife pleats (one direction)", value: "knife" },
          { label: "Box pleats", value: "box" },
          { label: "Inverted box pleats", value: "inverted" },
          { label: "Accordion pleats", value: "accordion" },
        ], defaultValue: "knife" },
        { name: "pleatDepth", label: "Pleat Depth", type: "select", options: [
          { label: "1 inch (narrow)", value: "1" },
          { label: "1.5 inches", value: "1.5" },
          { label: "2 inches (standard)", value: "2" },
          { label: "3 inches (deep)", value: "3" },
        ], defaultValue: "2" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "36 inches", value: "36" },
          { label: "45 inches", value: "45" },
          { label: "54 inches", value: "54" },
          { label: "60 inches", value: "60" },
        ], defaultValue: "45" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const skirtLength = inputs.skirtLength as number;
        const pleatType = inputs.pleatType as string;
        const pleatDepth = parseFloat(inputs.pleatDepth as string);
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        if (!waist || !skirtLength) return null;

        // Fabric multiplier depends on pleat type and depth
        let fabricMultiplier: number;
        if (pleatType === "knife") {
          fabricMultiplier = 3; // each pleat uses 3x its visible width
        } else if (pleatType === "box" || pleatType === "inverted") {
          fabricMultiplier = 3; // box pleats also use 3x
        } else {
          fabricMultiplier = 2.5; // accordion pleats
        }

        const totalFabricWidth = waist * fabricMultiplier;
        const pleatVisible = pleatDepth; // visible pleat width
        const pleatCount = Math.floor(waist / pleatVisible);
        const adjustedPleatWidth = waist / pleatCount;

        // Fabric yardage
        const panelsNeeded = Math.ceil(totalFabricWidth / (fabricWidth - 1)); // -1 for seam
        const totalLength = (skirtLength + 4) * panelsNeeded; // +4 for waistband seam + hem
        const fabricYards = Math.ceil((totalLength / 36) * 4) / 4;

        // Waistband fabric
        const waistbandLength = waist + 4; // overlap + seam
        const waistbandYards = 0.25;

        const typeLabels: Record<string, string> = {
          knife: "Knife Pleats",
          box: "Box Pleats",
          inverted: "Inverted Box Pleats",
          accordion: "Accordion Pleats",
        };

        return {
          primary: { label: "Fabric Needed", value: formatNumber(fabricYards + waistbandYards, 2), suffix: "yards" },
          details: [
            { label: "Pleat Type", value: typeLabels[pleatType] || pleatType },
            { label: "Number of Pleats", value: `${pleatCount}` },
            { label: "Visible Pleat Width", value: `${formatNumber(adjustedPleatWidth, 2)} in` },
            { label: "Pleat Depth", value: `${pleatDepth} in` },
            { label: "Total Fabric Width Needed", value: `${formatNumber(totalFabricWidth, 1)} in` },
            { label: "Fabric Panels", value: `${panelsNeeded}` },
            { label: "Fabric Multiplier", value: `${fabricMultiplier}x waist` },
          ],
          note: "Pleated skirts require significantly more fabric than plain skirts. Press pleats with a hot iron and use a pressing cloth. Consider using pleat-friendly fabrics like wool, polyester, or cotton blends.",
        };
      },
    },
    {
      id: "pleat-spacing",
      name: "Pleat Spacing",
      description: "Calculate even pleat spacing for a specific number of pleats",
      fields: [
        { name: "waist", label: "Waist Measurement", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.25 },
        { name: "pleatCount", label: "Desired Number of Pleats", type: "number", placeholder: "e.g. 20", min: 4, step: 1 },
        { name: "pleatType", label: "Pleat Type", type: "select", options: [
          { label: "Knife pleats", value: "knife" },
          { label: "Box pleats", value: "box" },
        ], defaultValue: "knife" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const pleatCount = inputs.pleatCount as number;
        if (!waist || !pleatCount) return null;

        const pleatWidth = waist / pleatCount;
        const pleatDepth = pleatWidth; // standard: depth equals width
        const totalFabric = pleatWidth * 3 * pleatCount; // 3x for folding

        const markingInterval = pleatWidth;
        const totalMarks = pleatCount * 3; // each pleat has 3 marks

        return {
          primary: { label: "Pleat Width", value: formatNumber(pleatWidth, 3), suffix: "inches" },
          details: [
            { label: "Number of Pleats", value: `${pleatCount}` },
            { label: "Pleat Depth", value: `${formatNumber(pleatDepth, 3)} in` },
            { label: "Marking Interval", value: `${formatNumber(markingInterval, 3)} in` },
            { label: "Total Marks on Fabric", value: `${totalMarks}` },
            { label: "Total Fabric Width", value: `${formatNumber(totalFabric, 1)} in` },
            { label: "Waist Circumference", value: `${formatNumber(waist, 1)} in` },
          ],
          note: "Mark every pleat width interval on the fabric. For knife pleats, fold each mark to the next. For box pleats, fold two marks toward a center mark. Use chalk or disappearing ink for marking.",
        };
      },
    },
  ],
  relatedSlugs: ["circle-skirt-calculator", "fabric-yardage-calculator", "seam-allowance-calculator"],
  faq: [
    { question: "How much fabric do I need for a pleated skirt?", answer: "Pleated skirts typically need 3 times your waist measurement in fabric width. A 28-inch waist needs about 84 inches of fabric width, which translates to roughly 3-4 yards of 45-inch fabric depending on skirt length." },
    { question: "What is the difference between knife and box pleats?", answer: "Knife pleats fold in one direction and are the most common. Box pleats have two folds facing away from each other, creating a flat front. Inverted box pleats fold toward each other. All use similar amounts of fabric." },
    { question: "How deep should pleats be?", answer: "Standard pleat depth is 1-2 inches for most skirts. Deeper pleats (2-3 inches) create more volume and movement. The pleat depth should generally equal the visible pleat width for a balanced look." },
  ],
  formula: "Total fabric width = Waist × Multiplier (3× for knife/box pleats) | Pleat count = Waist / Pleat width | Fabric yards = (Panels × Skirt length) / 36",
};
