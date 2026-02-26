import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteBlockFillCalculator: CalculatorDefinition = {
  slug: "concrete-block-fill-calculator",
  title: "Concrete Block Fill Calculator",
  description:
    "Calculate the volume of concrete or grout needed to fill CMU (concrete masonry unit) block cores. Estimate cubic yards and bags for block wall fills.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "concrete block fill",
    "CMU core fill",
    "block wall grout",
    "cinder block fill",
    "masonry fill calculator",
  ],
  variants: [
    {
      id: "standard-block",
      name: "Standard CMU Block Fill",
      description:
        "Calculate fill volume for standard 8×8×16 CMU blocks",
      fields: [
        {
          name: "numBlocks",
          label: "Number of Blocks",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "blockSize",
          label: "Block Width (inches)",
          type: "select",
          options: [
            { label: '6"', value: "6" },
            { label: '8"', value: "8" },
            { label: '10"', value: "10" },
            { label: '12"', value: "12" },
          ],
          defaultValue: "8",
        },
        {
          name: "fillPercent",
          label: "Cores to Fill (%)",
          type: "number",
          placeholder: "e.g. 100",
          defaultValue: 100,
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const numBlocks = parseFloat(inputs.numBlocks as string);
        const blockSize = parseFloat(inputs.blockSize as string);
        const fillPercent = parseFloat(inputs.fillPercent as string) || 100;
        if (!numBlocks || !blockSize) return null;

        // Core volume per block in cubic inches based on block width
        const coreVolumes: Record<number, number> = {
          6: 75,
          8: 116,
          10: 160,
          12: 208,
        };
        const coreVol = coreVolumes[blockSize] || 116;

        const totalCubicInches = numBlocks * coreVol * (fillPercent / 100);
        const cubicFeet = totalCubicInches / 1728;
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1;
        const bags80lb = Math.ceil(cubicFeet / 0.6);

        return {
          primary: {
            label: "Fill Volume Needed",
            value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards`,
          },
          details: [
            { label: "Exact volume", value: `${formatNumber(cubicYards, 2)} cu yd` },
            { label: "With 10% waste", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "80-lb bags of concrete", value: formatNumber(bags80lb) },
            { label: "Core volume per block", value: `${formatNumber(coreVol)} cu in` },
          ],
          note: "Includes 10% extra for waste and settling. Actual core volumes vary by manufacturer.",
        };
      },
    },
    {
      id: "by-wall-area",
      name: "Fill by Wall Area",
      description: "Estimate fill volume from wall dimensions",
      fields: [
        {
          name: "wallLength",
          label: "Wall Length (feet)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "wallHeight",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "blockSize",
          label: "Block Width (inches)",
          type: "select",
          options: [
            { label: '6"', value: "6" },
            { label: '8"', value: "8" },
            { label: '10"', value: "10" },
            { label: '12"', value: "12" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const wallLength = parseFloat(inputs.wallLength as string);
        const wallHeight = parseFloat(inputs.wallHeight as string);
        const blockSize = parseFloat(inputs.blockSize as string);
        if (!wallLength || !wallHeight || !blockSize) return null;

        // Standard 8x16 block: 1.125 blocks per sq ft of wall face
        const blocksPerSqFt = 1.125;
        const wallArea = wallLength * wallHeight;
        const numBlocks = Math.ceil(wallArea * blocksPerSqFt);

        const coreVolumes: Record<number, number> = {
          6: 75,
          8: 116,
          10: 160,
          12: 208,
        };
        const coreVol = coreVolumes[blockSize] || 116;

        const totalCubicInches = numBlocks * coreVol;
        const cubicFeet = totalCubicInches / 1728;
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1;
        const bags80lb = Math.ceil(cubicFeet / 0.6);

        return {
          primary: {
            label: "Fill Volume Needed",
            value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards`,
          },
          details: [
            { label: "Wall area", value: `${formatNumber(wallArea)} sq ft` },
            { label: "Estimated blocks", value: formatNumber(numBlocks) },
            { label: "Cubic feet of fill", value: formatNumber(cubicFeet, 1) },
            { label: "80-lb bags", value: formatNumber(bags80lb) },
          ],
          note: "Estimate based on standard 8×16 block layout (1.125 blocks/sq ft). Add 10% waste included.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "cement-calculator", "wall-square-footage-calculator"],
  faq: [
    {
      question: "How much concrete does it take to fill a CMU block?",
      answer:
        "A standard 8-inch CMU block has approximately 116 cubic inches of core space. It takes about 0.067 cubic feet of concrete per block. For a wall of 100 blocks, you need roughly 6.7 cubic feet or 0.25 cubic yards of fill material.",
    },
    {
      question: "Should I fill all cores in a block wall?",
      answer:
        "Building codes typically require filling all cores in foundation walls and any wall with rebar. Above-grade walls may only require filling cores at rebar locations, corners, and around openings. Check local building codes for specific requirements.",
    },
    {
      question: "What material should I use to fill block cores?",
      answer:
        "Use fine grout (a flowable concrete mix) for structural fills. For non-structural fills, loose fill concrete or sand can be used. Pre-mixed grout bags are available for small projects, while ready-mix grout trucks are more economical for large jobs.",
    },
  ],
  formula:
    "Fill Volume = Number of Blocks x Core Volume per Block | Cubic Yards = Cubic Inches / 46,656 | Add 10% for waste",
};
