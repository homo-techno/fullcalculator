import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pillowSizeCalculator: CalculatorDefinition = {
  slug: "pillow-size-calculator",
  title: "Pillow Size Calculator",
  description: "Free pillow size calculator. Find the right pillow size, pillow cover dimensions, and stuffing amounts for bed and decorative pillows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pillow size calculator", "pillow cover size", "pillow stuffing calculator", "throw pillow size", "pillow insert size"],
  variants: [
    {
      id: "pillow-cover",
      name: "Pillow Cover / Sham",
      description: "Calculate fabric needed for a pillow cover or sham",
      fields: [
        { name: "pillowSize", label: "Pillow Insert Size", type: "select", options: [
          { label: "12 x 12 in (small accent)", value: "12x12" },
          { label: "14 x 14 in (accent)", value: "14x14" },
          { label: "16 x 16 in (throw pillow)", value: "16x16" },
          { label: "18 x 18 in (standard throw)", value: "18x18" },
          { label: "20 x 20 in (large throw)", value: "20x20" },
          { label: "22 x 22 in (euro-style)", value: "22x22" },
          { label: "24 x 24 in (euro sham)", value: "24x24" },
          { label: "26 x 26 in (euro sham large)", value: "26x26" },
          { label: "12 x 20 in (lumbar)", value: "12x20" },
          { label: "14 x 36 in (long lumbar)", value: "14x36" },
          { label: "20 x 26 in (standard bed pillow)", value: "20x26" },
          { label: "20 x 36 in (king bed pillow)", value: "20x36" },
        ], defaultValue: "18x18" },
        { name: "closureType", label: "Closure Type", type: "select", options: [
          { label: "Envelope back (no zipper)", value: "envelope" },
          { label: "Zipper closure", value: "zipper" },
          { label: "Button closure", value: "button" },
        ], defaultValue: "envelope" },
        { name: "seamAllowance", label: "Seam Allowance", type: "select", options: [
          { label: "3/8 inch", value: "0.375" },
          { label: "1/2 inch (standard)", value: "0.5" },
          { label: "5/8 inch", value: "0.625" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const pillowSize = inputs.pillowSize as string;
        const closureType = inputs.closureType as string;
        const seamAllowance = parseFloat(inputs.seamAllowance as string);

        const [h, w] = pillowSize.split("x").map(Number);
        if (!h || !w) return null;

        const totalSeam = seamAllowance * 2;

        // Front panel cut size
        const frontWidth = w + totalSeam;
        const frontHeight = h + totalSeam;

        // Back panel(s) cut size
        let backPieces: string;
        let totalFabricWidth: number;
        let totalFabricHeight: number;

        if (closureType === "envelope") {
          // Two overlapping back pieces
          const overlapH = Math.ceil(h * 0.6) + totalSeam; // each piece is ~60% of height
          backPieces = `2 pieces: ${formatNumber(frontWidth, 1)} × ${formatNumber(overlapH, 1)} in each`;
          totalFabricHeight = frontHeight + (overlapH * 2) + 2; // rough layout
          totalFabricWidth = frontWidth;
        } else {
          // Single back piece (same as front)
          backPieces = `1 piece: ${formatNumber(frontWidth, 1)} × ${formatNumber(frontHeight, 1)} in`;
          totalFabricHeight = frontHeight * 2 + 2;
          totalFabricWidth = frontWidth;
        }

        const totalYards = Math.ceil((totalFabricHeight / 36) * 4) / 4;
        const insertRecommendation = `Use a ${w + 2}x${h + 2} inch insert for a plump look, or ${w}x${h} for standard fill`;

        return {
          primary: { label: "Front Cut Size", value: `${formatNumber(frontWidth, 1)} × ${formatNumber(frontHeight, 1)} in` },
          details: [
            { label: "Pillow Insert", value: `${h} × ${w} inches` },
            { label: "Back Panel(s)", value: backPieces },
            { label: "Closure", value: closureType.charAt(0).toUpperCase() + closureType.slice(1) },
            { label: "Seam Allowance", value: `${seamAllowance} inch per side` },
            { label: "Fabric Needed", value: `~${formatNumber(totalYards, 2)} yards (at 45\"+ width)` },
            { label: "Insert Tip", value: insertRecommendation },
          ],
          note: "For a professional look, use an insert 1-2 inches larger than the cover. Envelope closures are beginner-friendly and require no hardware.",
        };
      },
    },
    {
      id: "bed-pillows",
      name: "Bed Pillow Guide",
      description: "Find the right pillow size and arrangement for your bed",
      fields: [
        { name: "bedSize", label: "Bed Size", type: "select", options: [
          { label: "Twin (39 in wide)", value: "twin" },
          { label: "Full / Double (54 in wide)", value: "full" },
          { label: "Queen (60 in wide)", value: "queen" },
          { label: "King (76 in wide)", value: "king" },
          { label: "Cal King (72 in wide)", value: "calking" },
        ], defaultValue: "queen" },
        { name: "style", label: "Styling Preference", type: "select", options: [
          { label: "Minimal (sleeping pillows only)", value: "minimal" },
          { label: "Standard (sleeping + accents)", value: "standard" },
          { label: "Layered / hotel style", value: "layered" },
          { label: "Maximum / designer", value: "maximum" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const bedSize = inputs.bedSize as string;
        const style = inputs.style as string;

        const arrangements: Record<string, Record<string, { pillows: string; shams: string; accents: string; total: number }>> = {
          twin: {
            minimal: { pillows: "1 Standard (20x26)", shams: "1 standard sham", accents: "None", total: 1 },
            standard: { pillows: "1 Standard", shams: "1 standard sham", accents: "1 throw pillow (16x16)", total: 2 },
            layered: { pillows: "1 Standard", shams: "1 standard sham + 1 Euro (26x26)", accents: "1 throw pillow (16x16)", total: 3 },
            maximum: { pillows: "1 Standard", shams: "1 standard sham + 1 Euro", accents: "1 throw + 1 bolster", total: 4 },
          },
          full: {
            minimal: { pillows: "2 Standard (20x26)", shams: "2 standard shams", accents: "None", total: 2 },
            standard: { pillows: "2 Standard", shams: "2 standard shams", accents: "1 throw pillow (18x18)", total: 3 },
            layered: { pillows: "2 Standard", shams: "2 standard shams + 2 Euros", accents: "1 throw pillow", total: 5 },
            maximum: { pillows: "2 Standard", shams: "2 standard + 2 Euro shams", accents: "2 throw pillows + 1 lumbar", total: 7 },
          },
          queen: {
            minimal: { pillows: "2 Queen (20x30)", shams: "2 queen shams", accents: "None", total: 2 },
            standard: { pillows: "2 Queen", shams: "2 queen shams", accents: "2 throw pillows (18x18)", total: 4 },
            layered: { pillows: "2 Queen", shams: "2 queen shams + 2 Euros (26x26)", accents: "2 throw pillows", total: 6 },
            maximum: { pillows: "2 Queen", shams: "2 queen + 2 Euro + 2 standard shams", accents: "3 throw pillows", total: 9 },
          },
          king: {
            minimal: { pillows: "2 King (20x36)", shams: "2 king shams", accents: "None", total: 2 },
            standard: { pillows: "2 King", shams: "2 king shams", accents: "2 throw pillows (20x20)", total: 4 },
            layered: { pillows: "2 King", shams: "2 king shams + 3 Euros", accents: "2 throw pillows", total: 7 },
            maximum: { pillows: "2 King", shams: "2 king + 3 Euro + 2 standard shams", accents: "3 throw + 1 lumbar", total: 10 },
          },
          calking: {
            minimal: { pillows: "2 King (20x36)", shams: "2 king shams", accents: "None", total: 2 },
            standard: { pillows: "2 King", shams: "2 king shams", accents: "2 throw pillows (20x20)", total: 4 },
            layered: { pillows: "2 King", shams: "2 king shams + 3 Euros", accents: "2 throw pillows", total: 7 },
            maximum: { pillows: "2 King", shams: "2 king + 3 Euro + 2 standard shams", accents: "3 throw + 1 lumbar", total: 10 },
          },
        };

        const arr = arrangements[bedSize]?.[style];
        if (!arr) return null;

        return {
          primary: { label: "Total Pillows", value: `${arr.total} pillows` },
          details: [
            { label: "Sleeping Pillows", value: arr.pillows },
            { label: "Shams", value: arr.shams },
            { label: "Accent/Throw", value: arr.accents },
            { label: "Arrangement Style", value: style.charAt(0).toUpperCase() + style.slice(1) },
          ],
          note: "Layer front to back: Euro shams → sleeping pillows → accent pillows → bolster/lumbar. All decorative pillows go in front of sleeping pillows.",
        };
      },
    },
  ],
  relatedSlugs: ["quilt-size-calculator", "tablecloth-size-calculator", "curtain-fabric-calculator"],
  faq: [
    { question: "What size pillow insert should I use for my cover?", answer: "Use a pillow insert 1-2 inches larger than your cover for a full, plump look. For an 18x18 cover, use a 20x20 insert. For a more relaxed look, use the same size insert as the cover." },
    { question: "What are standard pillow sizes?", answer: "Throw pillows: 12x12, 16x16, 18x18, 20x20, 22x22. Euro shams: 26x26. Bed pillows: Standard (20x26), Queen (20x30), King (20x36). Lumbar: 12x20 or 14x36." },
    { question: "How many throw pillows should I put on a couch?", answer: "A standard 3-seat sofa looks good with 3-5 throw pillows. Use an odd number for visual interest. Mix 2-3 sizes (e.g., two 20-inch, two 18-inch, one lumbar). Coordinate but do not match exactly." },
  ],
  formula: "Pillow cover cut size = Insert size + (2 × Seam allowance) | For plump look: Insert = Cover size + 2 inches | Envelope back: each piece ≈ 60% of height + seam allowance",
};
