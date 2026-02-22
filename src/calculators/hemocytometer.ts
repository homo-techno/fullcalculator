import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hemocytometerCalculator: CalculatorDefinition = {
  slug: "hemocytometer-calculator",
  title: "Hemocytometer Cell Count Calculator",
  description:
    "Free hemocytometer calculator. Calculate cell concentration from hemocytometer counts with dilution factor correction.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "hemocytometer",
    "cell count",
    "cell concentration",
    "cell counting",
    "Neubauer chamber",
    "viability",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Hemocytometer Count",
      description: "Calculate cell concentration from a standard hemocytometer counting",
      fields: [
        {
          name: "totalCells",
          label: "Total Cells Counted",
          type: "number",
          placeholder: "e.g. 200",
          min: 0,
        },
        {
          name: "squaresCounted",
          label: "Number of Squares Counted",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          defaultValue: 5,
        },
        {
          name: "dilutionFactor",
          label: "Dilution Factor (e.g., 2 for 1:2)",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          defaultValue: 2,
        },
        {
          name: "squareVolume",
          label: "Volume per Square (µL)",
          type: "number",
          placeholder: "e.g. 0.0001",
          defaultValue: 0.0001,
          step: 0.0001,
        },
      ],
      calculate: (inputs) => {
        const totalCells = inputs.totalCells as number;
        const squares = inputs.squaresCounted as number;
        const df = inputs.dilutionFactor as number;
        const vol = inputs.squareVolume as number;
        if (!totalCells || !squares || !df || !vol) return null;
        if (squares <= 0 || df < 1 || vol <= 0) return null;

        const avgPerSquare = totalCells / squares;
        // Volume factor: each large square on a standard hemocytometer is 0.1 µL = 0.0001 mL
        const volumeML = vol / 1000; // convert µL to mL
        const concentration = (avgPerSquare / volumeML) * df; // cells/mL

        return {
          primary: {
            label: "Cell Concentration",
            value: formatNumber(concentration, 0) + " cells/mL",
          },
          details: [
            { label: "Average cells per square", value: formatNumber(avgPerSquare, 1) },
            { label: "Dilution factor", value: df + "×" },
            { label: "Squares counted", value: String(squares) },
            { label: "Total cells counted", value: String(totalCells) },
            {
              label: "Volume per square",
              value: vol + " µL",
            },
            {
              label: "Concentration (cells/µL)",
              value: formatNumber(concentration / 1000, 2),
            },
          ],
        };
      },
    },
    {
      id: "viability",
      name: "With Viability (Trypan Blue)",
      description: "Calculate cell concentration and viability using trypan blue exclusion",
      fields: [
        {
          name: "liveCells",
          label: "Live Cells Counted (unstained)",
          type: "number",
          placeholder: "e.g. 180",
          min: 0,
        },
        {
          name: "deadCells",
          label: "Dead Cells Counted (stained blue)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
        },
        {
          name: "squaresCounted",
          label: "Number of Squares Counted",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          defaultValue: 4,
        },
        {
          name: "dilutionFactor",
          label: "Dilution Factor",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const live = inputs.liveCells as number;
        const dead = inputs.deadCells as number;
        const squares = inputs.squaresCounted as number;
        const df = inputs.dilutionFactor as number;
        if (live == null || dead == null || !squares || !df) return null;
        const total = live + dead;
        if (total === 0) return null;

        const viability = (live / total) * 100;
        const avgPerSquare = total / squares;
        const factor = 10000; // standard hemocytometer factor for cells/mL
        const totalConc = avgPerSquare * df * factor;
        const viableConc = (live / squares) * df * factor;

        return {
          primary: {
            label: "Viable Cell Concentration",
            value: formatNumber(viableConc, 0) + " cells/mL",
          },
          details: [
            { label: "Total cell concentration", value: formatNumber(totalConc, 0) + " cells/mL" },
            { label: "Viability", value: formatNumber(viability, 1) + "%" },
            { label: "Live cells counted", value: String(live) },
            { label: "Dead cells counted", value: String(dead) },
            { label: "Total cells counted", value: String(total) },
            { label: "Dilution factor", value: df + "×" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cell-dilution-calculator",
    "serial-dilution-calculator",
    "generation-time-calculator",
  ],
  faq: [
    {
      question: "What is a hemocytometer?",
      answer:
        "A hemocytometer (Neubauer chamber) is a specialized glass microscope slide with an etched grid used to count cells. Each large square has a defined volume (typically 0.1 µL), allowing calculation of cell concentration.",
    },
    {
      question: "How do you calculate cell concentration with a hemocytometer?",
      answer:
        "Cell concentration (cells/mL) = (average cells per square) × (dilution factor) × 10,000. The factor of 10,000 converts from the 0.1 µL chamber volume to 1 mL.",
    },
    {
      question: "What is trypan blue exclusion?",
      answer:
        "Trypan blue is a dye that penetrates dead cells (with compromised membranes) but is excluded by living cells. Counting stained vs. unstained cells gives cell viability percentage.",
    },
  ],
  formula:
    "Cells/mL = (Average cells per square) × (Dilution factor) × 10,000. Viability (%) = (Live cells / Total cells) × 100.",
};
