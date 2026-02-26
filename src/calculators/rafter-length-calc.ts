import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rafterLengthCalculator: CalculatorDefinition = {
  slug: "rafter-length-calculator",
  title: "Rafter Length Calculator",
  description:
    "Calculate rafter length based on roof pitch and building span. Determine rafter dimensions, ridge height, and birdsmouth cuts for common rafters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rafter length calculator",
    "roof rafter calculator",
    "rafter span",
    "roof pitch rafter",
    "common rafter length",
  ],
  variants: [
    {
      id: "by-pitch-span",
      name: "Rafter by Pitch & Span",
      description: "Calculate rafter length from roof pitch and building span",
      fields: [
        {
          name: "span",
          label: "Building Span (feet)",
          type: "number",
          placeholder: "e.g. 24",
        },
        {
          name: "pitch",
          label: "Roof Pitch (rise per 12 run)",
          type: "select",
          options: [
            { label: "3/12", value: "3" },
            { label: "4/12", value: "4" },
            { label: "5/12", value: "5" },
            { label: "6/12", value: "6" },
            { label: "7/12", value: "7" },
            { label: "8/12", value: "8" },
            { label: "9/12", value: "9" },
            { label: "10/12", value: "10" },
            { label: "12/12", value: "12" },
          ],
          defaultValue: "6",
        },
        {
          name: "overhang",
          label: "Eave Overhang (inches)",
          type: "number",
          placeholder: "e.g. 12",
          defaultValue: 12,
        },
      ],
      calculate: (inputs) => {
        const span = parseFloat(inputs.span as string);
        const pitch = parseFloat(inputs.pitch as string);
        const overhang = parseFloat(inputs.overhang as string) || 0;
        if (!span || !pitch) return null;

        const run = span / 2;
        const rise = run * (pitch / 12);
        const rafterLength = Math.sqrt(run * run + rise * rise);
        const overhangFt = overhang / 12;
        const overhangRise = overhangFt * (pitch / 12);
        const tailLength = Math.sqrt(overhangFt * overhangFt + overhangRise * overhangRise);
        const totalLength = rafterLength + tailLength;
        const angle = Math.atan(pitch / 12) * (180 / Math.PI);

        return {
          primary: {
            label: "Total Rafter Length",
            value: `${formatNumber(totalLength, 2)} feet`,
          },
          details: [
            { label: "Rafter length (no overhang)", value: `${formatNumber(rafterLength, 2)} ft` },
            { label: "Tail length (overhang)", value: `${formatNumber(tailLength, 2)} ft` },
            { label: "Total rise", value: `${formatNumber(rise, 2)} ft` },
            { label: "Run (half span)", value: `${formatNumber(run, 2)} ft` },
            { label: "Roof angle", value: `${formatNumber(angle, 1)} degrees` },
            { label: "Ridge height above plate", value: `${formatNumber(rise, 2)} ft` },
          ],
          note: "Measurement is along the top edge of the rafter from ridge to fascia. Add for ridge board thickness if applicable.",
        };
      },
    },
    {
      id: "by-rise-run",
      name: "Rafter by Rise & Run",
      description: "Calculate rafter length from known rise and run distances",
      fields: [
        {
          name: "run",
          label: "Horizontal Run (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "rise",
          label: "Total Rise (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "overhang",
          label: "Eave Overhang (inches)",
          type: "number",
          placeholder: "e.g. 12",
          defaultValue: 12,
        },
      ],
      calculate: (inputs) => {
        const run = parseFloat(inputs.run as string);
        const rise = parseFloat(inputs.rise as string);
        const overhang = parseFloat(inputs.overhang as string) || 0;
        if (!run || !rise) return null;

        const rafterLength = Math.sqrt(run * run + rise * rise);
        const pitchPer12 = (rise / run) * 12;
        const overhangFt = overhang / 12;
        const overhangRise = overhangFt * (rise / run);
        const tailLength = Math.sqrt(overhangFt * overhangFt + overhangRise * overhangRise);
        const totalLength = rafterLength + tailLength;
        const angle = Math.atan(rise / run) * (180 / Math.PI);

        return {
          primary: {
            label: "Total Rafter Length",
            value: `${formatNumber(totalLength, 2)} feet`,
          },
          details: [
            { label: "Rafter length (no overhang)", value: `${formatNumber(rafterLength, 2)} ft` },
            { label: "Tail length", value: `${formatNumber(tailLength, 2)} ft` },
            { label: "Equivalent pitch", value: `${formatNumber(pitchPer12, 1)}/12` },
            { label: "Roof angle", value: `${formatNumber(angle, 1)} degrees` },
          ],
          note: "Uses Pythagorean theorem: Rafter = sqrt(Run^2 + Rise^2).",
        };
      },
    },
  ],
  relatedSlugs: ["pythagorean-calculator", "square-footage-calculator", "wood-beam-span-calculator"],
  faq: [
    {
      question: "How do I calculate rafter length from roof pitch?",
      answer:
        "Divide the building span by 2 to get the run. Multiply the run by the pitch (rise per foot) to get the total rise. Then use the Pythagorean theorem: Rafter Length = sqrt(Run^2 + Rise^2). Add the overhang tail length separately.",
    },
    {
      question: "What is the most common roof pitch?",
      answer:
        "The most common residential roof pitches are 4/12 to 6/12. A 4/12 pitch rises 4 inches for every 12 inches of horizontal run. Steeper pitches (8/12 to 12/12) are used for architectural style and better snow shedding.",
    },
  ],
  formula:
    "Rafter Length = sqrt(Run^2 + Rise^2) | Rise = Run x (Pitch / 12) | Run = Span / 2",
};
