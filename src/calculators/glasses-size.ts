import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glassesSizeCalculator: CalculatorDefinition = {
  slug: "glasses-size-calculator",
  title: "Glasses Size Calculator",
  description: "Free glasses size calculator. Find your ideal eyeglass frame size based on face width and feature measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["glasses size calculator", "eyeglasses size chart", "frame size calculator", "glasses fitting guide", "spectacle size"],
  variants: [
    {
      id: "face-width",
      name: "From Face Width",
      description: "Determine frame size based on face width",
      fields: [
        { name: "faceWidth", label: "Face Width (temple to temple)", type: "number", placeholder: "e.g. 138", suffix: "mm", step: 1 },
        { name: "noseWidth", label: "Nose Bridge Width", type: "number", placeholder: "e.g. 18", suffix: "mm", step: 1 },
        { name: "faceShape", label: "Face Shape", type: "select", options: [
          { label: "Oval", value: "oval" },
          { label: "Round", value: "round" },
          { label: "Square", value: "square" },
          { label: "Heart / Triangle", value: "heart" },
          { label: "Oblong / Rectangle", value: "oblong" },
        ], defaultValue: "oval" },
      ],
      calculate: (inputs) => {
        const faceWidth = inputs.faceWidth as number;
        const noseWidth = inputs.noseWidth as number;
        const faceShape = inputs.faceShape as string;
        if (!faceWidth) return null;

        // Frame width should roughly match face width
        // Glasses frame widths: S <129mm, M 129-138mm, L 139-145mm, XL >145mm
        let frameCategory: string;
        let frameWidthRange: string;
        if (faceWidth < 125) { frameCategory = "Extra Small"; frameWidthRange = "118-124 mm"; }
        else if (faceWidth < 130) { frameCategory = "Small"; frameWidthRange = "125-129 mm"; }
        else if (faceWidth < 136) { frameCategory = "Medium"; frameWidthRange = "130-135 mm"; }
        else if (faceWidth < 142) { frameCategory = "Large"; frameWidthRange = "136-141 mm"; }
        else { frameCategory = "Extra Large"; frameWidthRange = "142+ mm"; }

        // Lens width estimate (frame width minus bridge and hinges / 2)
        const bridgeSize = noseWidth || 18;
        const estimatedLensWidth = Math.round((faceWidth - bridgeSize - 10) / 2);

        // Bridge size recommendation
        let bridgeRec: string;
        if (bridgeSize < 16) bridgeRec = "14-16 mm (narrow bridge)";
        else if (bridgeSize < 19) bridgeRec = "17-19 mm (medium bridge)";
        else bridgeRec = "20-22 mm (wide bridge)";

        // Frame style recommendations based on face shape
        const styleRecs: Record<string, string> = {
          oval: "Most frame shapes work well. Try square, rectangular, or aviator styles.",
          round: "Angular or rectangular frames add definition. Avoid round frames.",
          square: "Round or oval frames soften angular features. Try browline or cat-eye styles.",
          heart: "Bottom-heavy frames balance a wider forehead. Try aviator or rimless styles.",
          oblong: "Oversized or deep frames add width. Try square, round, or decorative temples.",
        };

        return {
          primary: { label: "Frame Category", value: frameCategory },
          details: [
            { label: "Recommended Frame Width", value: frameWidthRange },
            { label: "Est. Lens Width", value: `${estimatedLensWidth} mm` },
            { label: "Bridge Size", value: bridgeRec },
            { label: "Face Width", value: `${formatNumber(faceWidth, 0)} mm` },
            { label: "Frame Style Tip", value: styleRecs[faceShape] || "" },
          ],
          note: "The three numbers on glasses frames (e.g., 52-18-140) represent: lens width, bridge width, and temple arm length in mm.",
        };
      },
    },
    {
      id: "existing-frames",
      name: "From Existing Frames",
      description: "Understand your current frame measurements",
      fields: [
        { name: "lensWidth", label: "Lens Width", type: "number", placeholder: "e.g. 52", suffix: "mm", step: 1 },
        { name: "bridgeWidth", label: "Bridge Width", type: "number", placeholder: "e.g. 18", suffix: "mm", step: 1 },
        { name: "templeLength", label: "Temple Arm Length", type: "number", placeholder: "e.g. 140", suffix: "mm", step: 1 },
      ],
      calculate: (inputs) => {
        const lensWidth = inputs.lensWidth as number;
        const bridgeWidth = inputs.bridgeWidth as number;
        const templeLength = inputs.templeLength as number;
        if (!lensWidth || !bridgeWidth) return null;

        const totalFrameWidth = (lensWidth * 2) + bridgeWidth + 10; // ~10mm for hinges

        let fitCategory: string;
        if (totalFrameWidth < 125) fitCategory = "Extra Small";
        else if (totalFrameWidth < 130) fitCategory = "Small";
        else if (totalFrameWidth < 136) fitCategory = "Medium";
        else if (totalFrameWidth < 142) fitCategory = "Large";
        else fitCategory = "Extra Large";

        // Lens size categories
        let lensCategory: string;
        if (lensWidth < 46) lensCategory = "Small lens";
        else if (lensWidth < 50) lensCategory = "Small-Medium lens";
        else if (lensWidth < 54) lensCategory = "Medium lens";
        else if (lensWidth < 58) lensCategory = "Large lens";
        else lensCategory = "Oversized lens";

        return {
          primary: { label: "Frame Measurements", value: `${lensWidth}-${bridgeWidth}-${templeLength || "?"}` },
          details: [
            { label: "Total Frame Width", value: `~${totalFrameWidth} mm` },
            { label: "Frame Category", value: fitCategory },
            { label: "Lens Category", value: lensCategory },
            { label: "Lens Width", value: `${lensWidth} mm` },
            { label: "Bridge Width", value: `${bridgeWidth} mm` },
            ...(templeLength ? [{ label: "Temple Length", value: `${templeLength} mm` }] : []),
          ],
          note: "When shopping for new frames, look for similar measurements. Lens width within 2mm and bridge width within 1mm of your current frames will feel familiar.",
        };
      },
    },
  ],
  relatedSlugs: ["hat-size-calculator", "watch-size-calculator"],
  faq: [
    { question: "Where do I find my glasses frame size?", answer: "Look on the inside of the temple arm (the part that goes over your ear). You will see three numbers like 52-18-140. These are: lens width (52mm), bridge width (18mm), and temple length (140mm)." },
    { question: "How do I measure my face width for glasses?", answer: "Use a ruler or tape measure across the widest part of your face (temple to temple). This measurement helps determine what frame width will look proportional on your face." },
    { question: "What frame shape suits my face?", answer: "Oval faces suit most shapes. Round faces look best with angular frames. Square faces pair well with round or oval frames. Heart-shaped faces look great with bottom-heavy frames. Oblong faces benefit from oversized or deep frames." },
  ],
  formula: "Frame width ≈ (Lens width × 2) + Bridge width + ~10mm | Frame numbers: Lens-Bridge-Temple (e.g., 52-18-140)",
};
