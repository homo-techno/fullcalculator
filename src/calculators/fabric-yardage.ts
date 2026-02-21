import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fabricYardageCalculator: CalculatorDefinition = {
  slug: "fabric-yardage-calculator",
  title: "Fabric Yardage Calculator",
  description: "Free fabric yardage calculator for sewing. Estimate how much fabric you need for common garments and projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fabric yardage calculator", "how much fabric do I need", "fabric calculator for sewing", "yardage estimator", "fabric requirements"],
  variants: [
    {
      id: "garment",
      name: "By Garment Type",
      description: "Estimate fabric needed for common garment types",
      fields: [
        { name: "garmentType", label: "Garment Type", type: "select", options: [
          { label: "Simple top / blouse", value: "top" },
          { label: "Button-up shirt", value: "shirt" },
          { label: "Simple skirt (knee length)", value: "skirt" },
          { label: "Pants / trousers", value: "pants" },
          { label: "Simple dress (knee length)", value: "dress" },
          { label: "Maxi dress / gown", value: "maxidress" },
          { label: "Jacket / blazer", value: "jacket" },
          { label: "Coat (knee length)", value: "coat" },
        ], defaultValue: "dress" },
        { name: "size", label: "Your Size Category", type: "select", options: [
          { label: "XS-S (US 0-6)", value: "small" },
          { label: "M-L (US 8-14)", value: "medium" },
          { label: "XL-2XL (US 16-22)", value: "large" },
          { label: "3XL+ (US 24+)", value: "xlarge" },
        ], defaultValue: "medium" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "36 inches (90 cm) — quilting cotton", value: "36" },
          { label: "45 inches (115 cm) — apparel fabric", value: "45" },
          { label: "54 inches (137 cm) — suiting", value: "54" },
          { label: "60 inches (150 cm) — knits, wide fabric", value: "60" },
        ], defaultValue: "45" },
      ],
      calculate: (inputs) => {
        const garmentType = inputs.garmentType as string;
        const size = inputs.size as string;
        const fabricWidth = parseInt(inputs.fabricWidth as string);

        // Base yardage at 45" width for medium size
        const baseYardage: Record<string, number> = {
          top: 1.75,
          shirt: 2.5,
          skirt: 1.5,
          pants: 2.5,
          dress: 3.0,
          maxidress: 4.5,
          jacket: 2.75,
          coat: 3.5,
        };

        let yardage = baseYardage[garmentType] || 2;

        // Size adjustment
        const sizeMultiplier: Record<string, number> = {
          small: 0.85,
          medium: 1.0,
          large: 1.2,
          xlarge: 1.4,
        };
        yardage *= sizeMultiplier[size] || 1;

        // Width adjustment (narrower fabric needs more yardage)
        if (fabricWidth === 36) yardage *= 1.3;
        else if (fabricWidth === 45) yardage *= 1.0;
        else if (fabricWidth === 54) yardage *= 0.85;
        else if (fabricWidth === 60) yardage *= 0.75;

        // Round up to nearest 1/4 yard
        yardage = Math.ceil(yardage * 4) / 4;

        const meters = yardage * 0.9144;

        return {
          primary: { label: "Fabric Needed", value: formatNumber(yardage, 2), suffix: "yards" },
          details: [
            { label: "In Meters", value: formatNumber(meters, 2) },
            { label: "Garment", value: garmentType.charAt(0).toUpperCase() + garmentType.slice(1) },
            { label: "Fabric Width", value: `${fabricWidth} inches` },
            { label: "Size Category", value: size.charAt(0).toUpperCase() + size.slice(1) },
            { label: "Extra for Matching", value: "Add 0.25-0.5 yd for plaids/stripes" },
          ],
          note: "Add 10-15% extra for pattern matching, directional prints, or nap fabrics. These estimates include seam allowances but not lining.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Project",
      description: "Calculate fabric for a custom rectangle-based project",
      fields: [
        { name: "length", label: "Piece Length Needed", type: "number", placeholder: "e.g. 48", suffix: "in", step: 0.5 },
        { name: "width", label: "Piece Width Needed", type: "number", placeholder: "e.g. 24", suffix: "in", step: 0.5 },
        { name: "quantity", label: "Number of Pieces", type: "number", placeholder: "e.g. 2", min: 1, defaultValue: 1 },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "36 inches", value: "36" },
          { label: "45 inches", value: "45" },
          { label: "54 inches", value: "54" },
          { label: "60 inches", value: "60" },
        ], defaultValue: "45" },
        { name: "seamAllowance", label: "Seam Allowance", type: "select", options: [
          { label: "None (already included)", value: "0" },
          { label: "3/8 inch", value: "0.375" },
          { label: "1/2 inch", value: "0.5" },
          { label: "5/8 inch (standard)", value: "0.625" },
          { label: "1 inch", value: "1" },
        ], defaultValue: "0.625" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const quantity = inputs.quantity as number;
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        const seamAllowance = parseFloat(inputs.seamAllowance as string);
        if (!length || !width || !quantity) return null;

        const pieceW = width + (seamAllowance * 2);
        const pieceL = length + (seamAllowance * 2);

        // How many pieces fit across the fabric width
        const piecesAcross = Math.floor(fabricWidth / pieceW);
        if (piecesAcross <= 0) return { primary: { label: "Error", value: "Piece too wide for fabric" }, note: "Your piece width exceeds the fabric width. Use wider fabric or reduce piece size." };

        // How many rows needed
        const rowsNeeded = Math.ceil(quantity / piecesAcross);
        const totalLengthIn = rowsNeeded * pieceL;
        const totalYards = totalLengthIn / 36;
        const roundedYards = Math.ceil(totalYards * 4) / 4;

        return {
          primary: { label: "Fabric Needed", value: formatNumber(roundedYards, 2), suffix: "yards" },
          details: [
            { label: "Total Length", value: `${formatNumber(totalLengthIn, 1)} inches` },
            { label: "Pieces Across Width", value: `${piecesAcross}` },
            { label: "Rows Needed", value: `${rowsNeeded}` },
            { label: "Piece Size (with seam)", value: `${formatNumber(pieceL, 1)} x ${formatNumber(pieceW, 1)} in` },
            { label: "In Meters", value: formatNumber(roundedYards * 0.9144, 2) },
          ],
          note: "This assumes pieces are laid out efficiently. Irregularly shaped pieces or directional fabrics will need more fabric.",
        };
      },
    },
  ],
  relatedSlugs: ["thread-calculator", "quilt-size-calculator", "body-measurement-calculator"],
  faq: [
    { question: "How much fabric do I need for a dress?", answer: "A simple knee-length dress typically needs 3 yards of 45-inch wide fabric for a medium size. Add 0.5 yards for long sleeves, 1-1.5 yards for a maxi length, and extra for pattern matching." },
    { question: "Does fabric width affect how much I need?", answer: "Yes. Wider fabric means fewer yards needed. A project requiring 3 yards of 45-inch fabric might only need 2.25 yards of 60-inch fabric. Always check your pattern's fabric requirements for the specific width." },
    { question: "How much extra should I buy for mistakes?", answer: "Buy 10-15% extra fabric as a general rule. Add more for: directional prints (+0.5 yd), plaids/stripes needing matching (+0.5-1 yd), or if this is your first time making the garment." },
  ],
  formula: "Yardage = (Rows needed × Piece length) / 36 | Rows = ceil(Quantity / Pieces across width) | Adjust for size, fabric width, and pattern matching",
};
