import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vinylRpmCalculator: CalculatorDefinition = {
  slug: "vinyl-rpm-calculator",
  title: "Vinyl RPM Calculator",
  description:
    "Free vinyl RPM calculator. Calculate record playback time, groove length, and speed for 33, 45, and 78 RPM records.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "vinyl RPM calculator",
    "record playing time",
    "vinyl record calculator",
    "LP calculator",
    "turntable speed",
    "33 RPM",
    "45 RPM",
  ],
  variants: [
    {
      id: "playback-time",
      name: "Playback Time Estimate",
      description: "Estimate playback time based on record size and RPM",
      fields: [
        {
          name: "rpm",
          label: "Speed (RPM)",
          type: "select",
          options: [
            { label: "33 1/3 RPM (LP)", value: "33.333" },
            { label: "45 RPM (Single)", value: "45" },
            { label: "78 RPM (Shellac)", value: "78" },
          ],
          defaultValue: "33.333",
        },
        {
          name: "diameter",
          label: "Record Diameter",
          type: "select",
          options: [
            { label: "12 inch (30 cm)", value: "12" },
            { label: "10 inch (25 cm)", value: "10" },
            { label: "7 inch (17.5 cm)", value: "7" },
          ],
          defaultValue: "12",
        },
        {
          name: "grooveSpacing",
          label: "Groove Spacing (lines per inch)",
          type: "number",
          placeholder: "e.g. 100",
          defaultValue: 100,
          min: 30,
          max: 300,
        },
      ],
      calculate: (inputs) => {
        const rpm = parseFloat(inputs.rpm as string);
        const diameter = parseFloat(inputs.diameter as string);
        const lpi = (inputs.grooveSpacing as number) || 100;
        if (!rpm || !diameter) return null;

        const outerRadius = diameter / 2; // inches
        // Inner radius: ~2.25 inches for 12", ~1.75 for 7"
        const innerRadius = diameter >= 10 ? 2.25 : 1.75;
        const grooveWidth = outerRadius - innerRadius; // usable groove area in inches
        const totalGrooves = grooveWidth * lpi;
        const totalRevolutions = totalGrooves;
        const playbackMinutes = totalRevolutions / rpm;
        const playbackSeconds = playbackMinutes * 60;

        // Approximate total groove length
        const avgRadius = (outerRadius + innerRadius) / 2;
        const avgCircumference = 2 * Math.PI * avgRadius; // inches
        const totalGrooveLength = avgCircumference * totalRevolutions; // inches
        const totalGrooveFeet = totalGrooveLength / 12;

        // Outer groove speed (linear)
        const outerSpeed = 2 * Math.PI * outerRadius * rpm / 12; // feet per minute

        return {
          primary: {
            label: "Estimated Playing Time (per side)",
            value: `${Math.floor(playbackMinutes)}:${String(Math.round(playbackSeconds % 60)).padStart(2, "0")}`,
          },
          details: [
            { label: "Playing Time", value: formatNumber(playbackMinutes, 1) + " minutes" },
            { label: "Record Size", value: `${diameter}" diameter` },
            { label: "Speed", value: `${rpm} RPM` },
            { label: "Groove Spacing", value: `${lpi} lines per inch` },
            { label: "Usable Groove Width", value: formatNumber(grooveWidth, 2) + " inches" },
            { label: "Total Grooves", value: formatNumber(totalGrooves, 0) },
            { label: "Total Groove Length", value: formatNumber(totalGrooveFeet, 0) + " feet" },
            { label: "Outer Edge Linear Speed", value: formatNumber(outerSpeed, 1) + " ft/min" },
          ],
        };
      },
    },
    {
      id: "speed-correction",
      name: "Speed / Pitch Correction",
      description: "Calculate pitch change when playing a record at the wrong speed",
      fields: [
        {
          name: "intendedRpm",
          label: "Intended Speed (RPM)",
          type: "select",
          options: [
            { label: "33 1/3 RPM", value: "33.333" },
            { label: "45 RPM", value: "45" },
            { label: "78 RPM", value: "78" },
          ],
          defaultValue: "33.333",
        },
        {
          name: "actualRpm",
          label: "Actual Playback Speed (RPM)",
          type: "select",
          options: [
            { label: "33 1/3 RPM", value: "33.333" },
            { label: "45 RPM", value: "45" },
            { label: "78 RPM", value: "78" },
          ],
          defaultValue: "45",
        },
      ],
      calculate: (inputs) => {
        const intended = parseFloat(inputs.intendedRpm as string);
        const actual = parseFloat(inputs.actualRpm as string);
        if (!intended || !actual) return null;

        const speedRatio = actual / intended;
        const semitoneShift = 12 * Math.log2(speedRatio);
        const percentChange = (speedRatio - 1) * 100;

        return {
          primary: { label: "Pitch Shift", value: formatNumber(semitoneShift, 2) + " semitones" },
          details: [
            { label: "Speed Ratio", value: formatNumber(speedRatio, 4) + "x" },
            { label: "Tempo Change", value: `${percentChange >= 0 ? "+" : ""}${formatNumber(percentChange, 1)}%` },
            { label: "Pitch Direction", value: speedRatio > 1 ? "Higher (faster)" : speedRatio < 1 ? "Lower (slower)" : "No change" },
          ],
          note: speedRatio !== 1 ? "Playing at the wrong speed changes both pitch and tempo." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["bpm-calculator", "frequency-to-note-calculator", "music-tempo-calculator"],
  faq: [
    {
      question: "What is the difference between 33, 45, and 78 RPM?",
      answer:
        "33 1/3 RPM is for LPs (long play albums, typically 12\"). 45 RPM is for singles (typically 7\"). 78 RPM is the oldest format used for shellac records. Higher RPM generally means better audio quality but shorter playing time.",
    },
    {
      question: "How long does a vinyl record play per side?",
      answer:
        "A standard 12\" LP at 33 1/3 RPM plays about 20-25 minutes per side. A 7\" single at 45 RPM plays about 4-5 minutes per side. Actual times depend on groove spacing and loudness of the recording.",
    },
    {
      question: "What happens if I play a record at the wrong speed?",
      answer:
        "Playing at the wrong speed changes both pitch and tempo. A 33 RPM record played at 45 RPM will sound about 5.1 semitones higher and 35% faster. A 45 played at 33 will sound lower and slower.",
    },
  ],
  formula:
    "Playing Time = Total Grooves / RPM | Total Grooves = Groove Width x Lines Per Inch | Pitch Shift = 12 x log2(actual RPM / intended RPM)",
};
