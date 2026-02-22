import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const embroideryHoopCalculator: CalculatorDefinition = {
  slug: "embroidery-hoop-calculator",
  title: "Embroidery Hoop Size Calculator",
  description: "Free embroidery hoop size calculator. Find the right hoop size for your embroidery or cross stitch project based on design dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["embroidery hoop size calculator", "hoop size for cross stitch", "embroidery hoop guide", "what size embroidery hoop", "hoop size chart"],
  variants: [
    {
      id: "by-design-size",
      name: "By Design Size",
      description: "Find the best hoop size for your design dimensions",
      fields: [
        { name: "designWidth", label: "Design Width", type: "number", placeholder: "e.g. 6", suffix: "in", step: 0.25 },
        { name: "designHeight", label: "Design Height", type: "number", placeholder: "e.g. 8", suffix: "in", step: 0.25 },
        { name: "purpose", label: "Purpose", type: "select", options: [
          { label: "Working hoop (stitching)", value: "working" },
          { label: "Display hoop (framing)", value: "display" },
        ], defaultValue: "working" },
        { name: "shape", label: "Hoop Shape", type: "select", options: [
          { label: "Round hoop", value: "round" },
          { label: "Oval hoop", value: "oval" },
          { label: "Square/rectangular frame", value: "square" },
        ], defaultValue: "round" },
      ],
      calculate: (inputs) => {
        const designWidth = inputs.designWidth as number;
        const designHeight = inputs.designHeight as number;
        const purpose = inputs.purpose as string;
        const shape = inputs.shape as string;
        if (!designWidth || !designHeight) return null;

        // Standard hoop sizes (inches)
        const roundHoops = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14];
        const ovalHoops = [
          { label: "3×5", w: 3, h: 5 },
          { label: "4×6", w: 4, h: 6 },
          { label: "5×8", w: 5, h: 8 },
          { label: "5×9", w: 5, h: 9 },
          { label: "6×10", w: 6, h: 10 },
          { label: "8×12", w: 8, h: 12 },
        ];

        let recommendation: string;
        let fabricMinSize: string;
        const margin = purpose === "display" ? 0.5 : 1;

        if (shape === "round") {
          const minDiameter = Math.max(designWidth, designHeight) + (margin * 2);
          const bestHoop = roundHoops.find(h => h >= minDiameter) || roundHoops[roundHoops.length - 1];
          const alternateHoop = roundHoops.find(h => h > bestHoop);
          recommendation = `${bestHoop}-inch round hoop${alternateHoop ? ` (or ${alternateHoop}-inch for more room)` : ""}`;
          const fabricSize = bestHoop + 4;
          fabricMinSize = `${fabricSize} × ${fabricSize} inches`;
        } else if (shape === "oval") {
          const bestOval = ovalHoops.find(h => h.w >= designWidth + margin && h.h >= designHeight + margin)
            || ovalHoops[ovalHoops.length - 1];
          recommendation = `${bestOval.label}-inch oval hoop`;
          fabricMinSize = `${bestOval.w + 4} × ${bestOval.h + 4} inches`;
        } else {
          const frameW = Math.ceil(designWidth + margin * 2);
          const frameH = Math.ceil(designHeight + margin * 2);
          recommendation = `${frameW} × ${frameH}-inch scroll frame or Q-snap`;
          fabricMinSize = `${frameW + 4} × ${frameH + 4} inches`;
        }

        // For display hoop, check if design fills hoop nicely
        const largerDim = Math.max(designWidth, designHeight);
        const fillPercentage = purpose === "display"
          ? (largerDim / (largerDim + margin * 2)) * 100
          : null;

        return {
          primary: { label: "Recommended Hoop", value: recommendation },
          details: [
            { label: "Design Size", value: `${formatNumber(designWidth, 1)} × ${formatNumber(designHeight, 1)} in` },
            { label: "Minimum Fabric", value: fabricMinSize },
            { label: "Purpose", value: purpose === "working" ? "Working/stitching" : "Display/framing" },
            { label: "Margin Around Design", value: `${margin} inches` },
            ...(fillPercentage ? [{ label: "Hoop Fill", value: `~${formatNumber(fillPercentage, 0)}%` }] : []),
            { label: "Shape", value: shape.charAt(0).toUpperCase() + shape.slice(1) },
          ],
          note: purpose === "working"
            ? "For stitching, the hoop should be larger than the design so you can reposition as needed. Cut fabric at least 2 inches larger than the hoop on all sides."
            : "For display, choose a hoop that frames the design with a small border. Trim excess fabric and glue or stitch it to the back of the hoop.",
        };
      },
    },
    {
      id: "by-stitch-count",
      name: "By Stitch Count",
      description: "Find hoop size from cross stitch pattern dimensions",
      fields: [
        { name: "stitchWidth", label: "Pattern Width (stitches)", type: "number", placeholder: "e.g. 80", min: 1, step: 1 },
        { name: "stitchHeight", label: "Pattern Height (stitches)", type: "number", placeholder: "e.g. 100", min: 1, step: 1 },
        { name: "fabricCount", label: "Fabric Count", type: "select", options: [
          { label: "11 count Aida", value: "11" },
          { label: "14 count Aida", value: "14" },
          { label: "16 count Aida", value: "16" },
          { label: "18 count Aida", value: "18" },
        ], defaultValue: "14" },
      ],
      calculate: (inputs) => {
        const stitchWidth = inputs.stitchWidth as number;
        const stitchHeight = inputs.stitchHeight as number;
        const fabricCount = parseInt(inputs.fabricCount as string);
        if (!stitchWidth || !stitchHeight) return null;

        const designWidth = stitchWidth / fabricCount;
        const designHeight = stitchHeight / fabricCount;
        const maxDim = Math.max(designWidth, designHeight);

        const roundHoops = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14];
        const workingHoop = roundHoops.find(h => h >= maxDim + 2) || roundHoops[roundHoops.length - 1];
        const displayHoop = roundHoops.find(h => h >= maxDim + 1) || roundHoops[roundHoops.length - 1];

        const fabricSize = workingHoop + 4;

        return {
          primary: { label: "Design Size", value: `${formatNumber(designWidth, 1)} × ${formatNumber(designHeight, 1)}`, suffix: "inches" },
          details: [
            { label: "Working Hoop", value: `${workingHoop}-inch` },
            { label: "Display Hoop", value: `${displayHoop}-inch` },
            { label: "Fabric Needed", value: `${fabricSize} × ${fabricSize} in minimum` },
            { label: "Pattern Dimensions", value: `${stitchWidth} × ${stitchHeight} stitches` },
            { label: "Fabric Count", value: `${fabricCount} count` },
          ],
          note: "If your design is much larger than 14 inches, consider using scroll bars or a floor stand frame instead of a hoop. For rectangular designs, consider an oval hoop or Q-snap frame.",
        };
      },
    },
  ],
  relatedSlugs: ["cross-stitch-calculator", "fabric-yardage-calculator", "thread-calculator"],
  faq: [
    { question: "What size embroidery hoop should I use?", answer: "For stitching, use a hoop at least 2 inches larger than your design in each direction so you can reposition. For display, use a hoop just slightly larger than the finished design. Common sizes are 4-8 inches for most projects." },
    { question: "What is the difference between a hoop and a frame?", answer: "Hoops are round or oval and clamp the fabric between two rings. Frames (like Q-snaps or scroll frames) are rectangular and keep fabric taut without the circular limitation. Frames are better for large or rectangular projects." },
    { question: "Should I leave fabric in the hoop when not stitching?", answer: "Remove fabric from the hoop when not working to prevent permanent hoop marks. For display in a hoop, the fabric stays in permanently. If hoop marks appear, a gentle wash and iron usually removes them." },
  ],
  formula: "Design size = Stitch count / Fabric count | Minimum hoop = Max dimension + Margin | Fabric = Hoop size + 4 inches",
};
