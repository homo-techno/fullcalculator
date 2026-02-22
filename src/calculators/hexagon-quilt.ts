import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hexagonQuiltCalculator: CalculatorDefinition = {
  slug: "hexagon-quilt-calculator",
  title: "Hexagon Quilt Calculator",
  description: "Free hexagon quilt calculator. Calculate the number of hexagons, fabric yardage, and layout for hexie quilts and grandmother's flower garden quilts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hexagon quilt calculator", "hexie calculator", "grandmother flower garden quilt", "hexagon patchwork", "EPP hexagon calculator"],
  variants: [
    {
      id: "hexagon-count",
      name: "Hexagon Count",
      description: "Calculate how many hexagons you need for your quilt",
      fields: [
        { name: "quiltWidth", label: "Desired Quilt Width", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "quiltLength", label: "Desired Quilt Length", type: "number", placeholder: "e.g. 80", suffix: "in", step: 1 },
        { name: "hexSize", label: "Hexagon Side Length", type: "select", options: [
          { label: "1/2 inch (tiny)", value: "0.5" },
          { label: "3/4 inch", value: "0.75" },
          { label: "1 inch (standard EPP)", value: "1" },
          { label: "1.5 inches", value: "1.5" },
          { label: "2 inches", value: "2" },
          { label: "3 inches (large)", value: "3" },
        ], defaultValue: "1" },
        { name: "method", label: "Construction Method", type: "select", options: [
          { label: "English Paper Piecing (EPP)", value: "epp" },
          { label: "Machine pieced", value: "machine" },
        ], defaultValue: "epp" },
      ],
      calculate: (inputs) => {
        const quiltWidth = inputs.quiltWidth as number;
        const quiltLength = inputs.quiltLength as number;
        const hexSize = parseFloat(inputs.hexSize as string);
        const method = inputs.method as string;
        if (!quiltWidth || !quiltLength) return null;

        // Hexagon dimensions: side = s, width (flat-to-flat) = s * sqrt(3), height (point-to-point) = 2 * s
        const hexWidth = hexSize * Math.sqrt(3); // flat-to-flat distance
        const hexHeight = hexSize * 2; // point-to-point distance
        const rowHeight = hexHeight * 0.75; // rows overlap by 1/4 of height

        const hexAcross = Math.ceil(quiltWidth / hexWidth) + 1;
        const hexDown = Math.ceil(quiltLength / rowHeight) + 1;
        const totalHex = hexAcross * hexDown;

        // Cutting size: hexagon side + seam allowance on all sides
        const seamAllowance = method === "epp" ? 0.25 : 0.25;
        const cuttingWidth = hexWidth + (seamAllowance * 2);
        const cuttingHeight = hexHeight + (seamAllowance * 2);

        // Fabric estimation
        const hexPerFatQuarter = Math.floor(18 / cuttingHeight) * Math.floor(22 / cuttingWidth);
        const fatQuartersNeeded = Math.ceil(totalHex / hexPerFatQuarter);
        const yardageEquiv = fatQuartersNeeded * 0.25;

        const actualWidth = hexAcross * hexWidth;
        const actualLength = hexDown * rowHeight + (hexHeight * 0.25);

        return {
          primary: { label: "Hexagons Needed", value: `${totalHex}` },
          details: [
            { label: "Layout", value: `~${hexAcross} across × ${hexDown} rows` },
            { label: "Hexagon Side Length", value: `${hexSize} in` },
            { label: "Hex Width (flat-to-flat)", value: `${formatNumber(hexWidth, 2)} in` },
            { label: "Approx. Quilt Size", value: `${formatNumber(actualWidth, 1)} × ${formatNumber(actualLength, 1)} in` },
            { label: "Fat Quarters Needed", value: `~${fatQuartersNeeded}` },
            { label: "Yardage Equivalent", value: `~${formatNumber(yardageEquiv, 1)} yards` },
            { label: "Method", value: method === "epp" ? "English Paper Piecing" : "Machine Pieced" },
          ],
          note: "Hexagon quilts are time-intensive. For EPP, purchase pre-cut paper templates. Allow extra hexagons (10-15%) for color placement flexibility and mistakes.",
        };
      },
    },
    {
      id: "flower-garden",
      name: "Flower Garden Layout",
      description: "Calculate hexagons for grandmother's flower garden blocks",
      fields: [
        { name: "flowerCount", label: "Number of Flowers", type: "number", placeholder: "e.g. 20", min: 1, step: 1 },
        { name: "rings", label: "Rings Per Flower", type: "select", options: [
          { label: "1 ring (7 hexies per flower)", value: "1" },
          { label: "2 rings (19 hexies per flower)", value: "2" },
          { label: "3 rings (37 hexies per flower)", value: "3" },
        ], defaultValue: "2" },
        { name: "hexSize", label: "Hexagon Side Length", type: "select", options: [
          { label: "3/4 inch", value: "0.75" },
          { label: "1 inch", value: "1" },
          { label: "1.5 inches", value: "1.5" },
          { label: "2 inches", value: "2" },
        ], defaultValue: "1" },
        { name: "pathHexies", label: "Include Garden Path?", type: "select", options: [
          { label: "No path (flowers touching)", value: "no" },
          { label: "Yes (1 row of background hexies)", value: "yes" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const flowerCount = inputs.flowerCount as number;
        const rings = parseInt(inputs.rings as string);
        const hexSize = parseFloat(inputs.hexSize as string);
        const pathHexies = inputs.pathHexies as string;
        if (!flowerCount) return null;

        // Hexies per flower: 1 ring = 1+6=7, 2 rings = 7+12=19, 3 rings = 19+18=37
        const hexiesPerRing: Record<number, number> = { 1: 7, 2: 19, 3: 37 };
        const hexPerFlower = hexiesPerRing[rings] || 19;
        const flowerHexies = flowerCount * hexPerFlower;

        // Center hexies (1 per flower)
        const centerHexies = flowerCount;
        const petalHexies = flowerHexies - centerHexies;

        // Path hexies estimation (roughly equal to outer ring count per flower)
        const pathEstimate = pathHexies === "yes" ? flowerCount * (rings === 1 ? 6 : rings === 2 ? 12 : 18) * 0.7 : 0;
        const totalHexies = Math.ceil(flowerHexies + pathEstimate);

        const hexWidth = hexSize * Math.sqrt(3);
        const flowerDiameter = hexWidth * (1 + rings * 2);

        return {
          primary: { label: "Total Hexagons", value: `${totalHexies}` },
          details: [
            { label: "Flowers", value: `${flowerCount}` },
            { label: "Hexies Per Flower", value: `${hexPerFlower}` },
            { label: "Flower Hexies", value: `${flowerHexies}` },
            { label: "Center Hexies", value: `${centerHexies}` },
            { label: "Petal Hexies", value: `${petalHexies}` },
            { label: "Path/Background Hexies", value: `~${Math.ceil(pathEstimate)}` },
            { label: "Flower Diameter", value: `~${formatNumber(flowerDiameter, 1)} in` },
          ],
          note: "The garden path hexies are an estimate — exact count depends on your layout arrangement. Sort fabrics into center, petal, and background groups for efficient cutting.",
        };
      },
    },
  ],
  relatedSlugs: ["quilt-size-calculator", "half-square-triangle-calculator", "fabric-yardage-calculator"],
  faq: [
    { question: "How many hexagons do I need for a quilt?", answer: "It depends on hexagon size and quilt dimensions. A 60×80 inch quilt with 1-inch hexagons needs roughly 2,700-3,000 hexagons. Larger hexagons dramatically reduce the count — 2-inch hexagons cut it to about 750." },
    { question: "What is English Paper Piecing (EPP)?", answer: "EPP is a hand-sewing method where fabric is wrapped around paper templates and whip-stitched together. It is ideal for hexagons because it produces precise shapes. It is portable and relaxing but slower than machine piecing." },
    { question: "What size hexagon should I use?", answer: "1-inch side length is the most popular for EPP. Beginners may prefer 1.5-2 inch hexagons for easier handling. Smaller hexagons (1/2-3/4 inch) create stunning detail but require significantly more time and pieces." },
  ],
  formula: "Hex width = Side × √3 | Row height = Side × 1.5 | Hexies across = Quilt width / Hex width | Flower hexies: 1 ring = 7, 2 rings = 19, 3 rings = 37",
};
