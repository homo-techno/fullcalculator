import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const whiteboardSizeCalculator: CalculatorDefinition = {
  slug: "whiteboard-size-calc",
  title: "Whiteboard & Display Size Calculator",
  description:
    "Free whiteboard and display size calculator for rooms. Calculate the optimal screen or whiteboard size based on room dimensions, viewer distance, and content type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "whiteboard size calculator",
    "display size for room",
    "projector screen size",
    "TV size for room",
    "conference room display",
    "viewing distance calculator",
    "screen size recommendation",
  ],
  variants: [
    {
      id: "display-size",
      name: "Display/TV Size for Room",
      description: "Calculate recommended display size based on viewing distance",
      fields: [
        {
          name: "viewingDistance",
          label: "Farthest Viewer Distance (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "contentType",
          label: "Primary Content",
          type: "select",
          options: [
            { label: "Presentations/Text", value: "text" },
            { label: "Mixed (text + video)", value: "mixed" },
            { label: "Video/Movies only", value: "video" },
            { label: "Data/Spreadsheets", value: "data" },
          ],
          defaultValue: "mixed",
        },
        {
          name: "resolution",
          label: "Display Resolution",
          type: "select",
          options: [
            { label: "1080p (Full HD)", value: "1080" },
            { label: "4K UHD", value: "4k" },
          ],
          defaultValue: "4k",
        },
      ],
      calculate: (inputs) => {
        const distance = parseFloat(inputs.viewingDistance as string);
        const contentType = inputs.contentType as string;
        const resolution = inputs.resolution as string;
        if (isNaN(distance) || distance <= 0) return null;

        // AVIXA/InfoComm standards for display sizing
        // Text readability: screen height = distance / 4 (for text)
        // Mixed: screen height = distance / 6
        // Video: screen height = distance / 8
        const heightRatios: Record<string, number> = {
          "data": 3,
          "text": 4,
          "mixed": 6,
          "video": 8,
        };

        const ratio = heightRatios[contentType] || 6;
        const screenHeightFt = distance / ratio;
        const screenHeightIn = screenHeightFt * 12;
        const screenWidthIn = screenHeightIn * 16 / 9;
        const diagonalIn = Math.sqrt(screenWidthIn * screenWidthIn + screenHeightIn * screenHeightIn);

        // Min distance for resolution
        const minDistance1080 = diagonalIn * 1.5 / 12;
        const minDistance4K = diagonalIn * 1.0 / 12;

        // Round up to nearest common size
        const commonSizes = [43, 50, 55, 65, 75, 85, 86, 98];
        const recommendedSize = commonSizes.find((s) => s >= diagonalIn) || diagonalIn;

        return {
          primary: {
            label: "Recommended Display Size",
            value: formatNumber(Math.ceil(diagonalIn)),
            suffix: "inches (diagonal)",
          },
          details: [
            { label: "Nearest Common Size", value: formatNumber(recommendedSize) + "\"" },
            { label: "Calculated Diagonal", value: formatNumber(diagonalIn, 1) + "\"" },
            { label: "Screen Width", value: formatNumber(screenWidthIn, 1) + "\" (" + formatNumber(screenWidthIn / 12, 1) + " ft)" },
            { label: "Screen Height", value: formatNumber(screenHeightIn, 1) + "\" (" + formatNumber(screenHeightIn / 12, 1) + " ft)" },
            { label: "Viewing Distance", value: formatNumber(distance) + " ft" },
            { label: "Min Distance for 1080p", value: formatNumber(minDistance1080, 1) + " ft" },
          ],
          note: resolution === "1080" && distance < minDistance1080
            ? "Viewers may see pixels at this distance with 1080p. Consider 4K."
            : undefined,
        };
      },
    },
    {
      id: "whiteboard-size",
      name: "Whiteboard Size for Room",
      description: "Calculate recommended whiteboard size",
      fields: [
        {
          name: "roomWidth",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "roomDepth",
          label: "Room Depth (feet)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "seating",
          label: "Seating Arrangement",
          type: "select",
          options: [
            { label: "Classroom (rows)", value: "classroom" },
            { label: "Conference table", value: "conference" },
            { label: "U-shape", value: "ushape" },
            { label: "Open/standing", value: "open" },
          ],
          defaultValue: "classroom",
        },
      ],
      calculate: (inputs) => {
        const roomWidth = parseFloat(inputs.roomWidth as string);
        const roomDepth = parseFloat(inputs.roomDepth as string);
        const seating = inputs.seating as string;
        if (isNaN(roomWidth) || isNaN(roomDepth)) return null;
        if (roomWidth <= 0 || roomDepth <= 0) return null;

        // Whiteboard should be about 60-80% of wall width
        const boardWidth = roomWidth * 0.7;
        // Height based on farthest viewer
        const maxDistance = seating === "conference" ? roomDepth * 0.8 : roomDepth * 0.9;
        const minBoardHeight = maxDistance / 5; // 1:5 ratio for legibility
        const boardHeight = Math.max(minBoardHeight, 3); // minimum 3 feet

        // Mounting height: bottom at 3 ft from floor for standing, 2.5 for seated
        const mountBottom = seating === "open" ? 3 : 2.5;

        const areaFt = boardWidth * boardHeight;

        return {
          primary: {
            label: "Recommended Whiteboard Size",
            value: `${formatNumber(Math.ceil(boardWidth))} x ${formatNumber(Math.ceil(boardHeight))}`,
            suffix: "feet (W x H)",
          },
          details: [
            { label: "Board Width", value: formatNumber(boardWidth, 1) + " ft (" + formatNumber(boardWidth * 12, 0) + "\")" },
            { label: "Board Height", value: formatNumber(boardHeight, 1) + " ft (" + formatNumber(boardHeight * 12, 0) + "\")" },
            { label: "Board Area", value: formatNumber(areaFt, 1) + " sq ft" },
            { label: "Mount Bottom Edge", value: formatNumber(mountBottom, 1) + " ft from floor" },
            { label: "Max Viewing Distance", value: formatNumber(maxDistance, 1) + " ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["screen-resolution-calc", "aspect-ratio-calc", "square-footage-calculator"],
  faq: [
    {
      question: "What size display do I need for a conference room?",
      answer:
        "Use the 4/6/8 rule: for text-heavy content, screen height should be 1/4 of the farthest viewer distance. For mixed content, 1/6. For video, 1/8. A 15-foot room showing presentations needs about a 75\" display.",
    },
    {
      question: "How high should I mount a whiteboard?",
      answer:
        "For seated viewers, mount the bottom edge at 2.5 feet (30 inches) from the floor. For standing use, mount at 3 feet (36 inches). The top should not exceed 7 feet for comfortable writing access.",
    },
    {
      question: "Is a bigger display always better?",
      answer:
        "Not always. For text and data, too large a display at close range causes viewers to turn their heads excessively. The ideal field of view for presentations is 30-40 degrees. For video entertainment, wider is acceptable.",
    },
  ],
  formula:
    "Screen Height = Farthest Distance / Ratio (4 for text, 6 for mixed, 8 for video) | Diagonal = sqrt(W² + H²)",
};
