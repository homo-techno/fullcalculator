import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const antennaLengthCalculator: CalculatorDefinition = {
  slug: "antenna-length-calculator",
  title: "Antenna Length Calculator",
  description:
    "Free antenna length calculator. Calculate dipole, quarter-wave, and full-wave antenna lengths for any frequency. Essential for RF and ham radio design.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "antenna length",
    "antenna calculator",
    "dipole antenna",
    "quarter wave antenna",
    "ham radio antenna",
    "rf antenna design",
  ],
  variants: [
    {
      id: "frequency-to-length",
      name: "Frequency to Antenna Length",
      description: "Calculate antenna length from frequency",
      fields: [
        {
          name: "frequency",
          label: "Frequency",
          type: "number",
          placeholder: "e.g. 144",
        },
        {
          name: "freqUnit",
          label: "Frequency Unit",
          type: "select",
          options: [
            { label: "Hz", value: "1" },
            { label: "kHz", value: "1000" },
            { label: "MHz", value: "1000000" },
            { label: "GHz", value: "1000000000" },
          ],
          defaultValue: "1000000",
        },
        {
          name: "antennaType",
          label: "Antenna Type",
          type: "select",
          options: [
            { label: "Half-Wave Dipole (λ/2)", value: "0.5" },
            { label: "Quarter-Wave (λ/4)", value: "0.25" },
            { label: "Full-Wave (λ)", value: "1" },
            { label: "5/8 Wave", value: "0.625" },
          ],
          defaultValue: "0.5",
        },
      ],
      calculate: (inputs) => {
        const freq = inputs.frequency as number;
        const freqMult = Number(inputs.freqUnit);
        const fraction = Number(inputs.antennaType);
        if (!freq || !freqMult) return null;

        const freqHz = freq * freqMult;
        const speedOfLight = 299792458; // m/s
        const wavelength = speedOfLight / freqHz;
        const antennaLength = wavelength * fraction;

        // Practical antenna factor (0.95 for wire antennas)
        const practicalLength = antennaLength * 0.95;

        return {
          primary: {
            label: "Antenna Length",
            value: antennaLength >= 1
              ? `${formatNumber(antennaLength, 4)} m`
              : `${formatNumber(antennaLength * 100, 4)} cm`,
          },
          details: [
            { label: "Theoretical Length", value: `${formatNumber(antennaLength, 4)} m` },
            { label: "Practical Length (×0.95)", value: `${formatNumber(practicalLength, 4)} m` },
            { label: "Length (feet)", value: `${formatNumber(antennaLength * 3.28084, 4)} ft` },
            { label: "Length (inches)", value: `${formatNumber(antennaLength * 39.3701, 4)} in` },
            { label: "Full Wavelength (λ)", value: `${formatNumber(wavelength, 4)} m` },
            { label: "Frequency", value: `${formatNumber(freqHz / 1e6, 6)} MHz` },
          ],
        };
      },
    },
    {
      id: "length-to-frequency",
      name: "Antenna Length to Frequency",
      description: "Calculate resonant frequency from antenna length",
      fields: [
        {
          name: "length",
          label: "Antenna Length",
          type: "number",
          placeholder: "e.g. 1.04",
        },
        {
          name: "lengthUnit",
          label: "Length Unit",
          type: "select",
          options: [
            { label: "Meters", value: "1" },
            { label: "Centimeters", value: "0.01" },
            { label: "Feet", value: "0.3048" },
            { label: "Inches", value: "0.0254" },
          ],
          defaultValue: "1",
        },
        {
          name: "antennaType",
          label: "Antenna Type",
          type: "select",
          options: [
            { label: "Half-Wave Dipole (λ/2)", value: "0.5" },
            { label: "Quarter-Wave (λ/4)", value: "0.25" },
            { label: "Full-Wave (λ)", value: "1" },
            { label: "5/8 Wave", value: "0.625" },
          ],
          defaultValue: "0.5",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const lengthMult = Number(inputs.lengthUnit);
        const fraction = Number(inputs.antennaType);
        if (!length || !lengthMult) return null;

        const lengthMeters = length * lengthMult;
        const speedOfLight = 299792458;
        const wavelength = lengthMeters / fraction;
        const freqHz = speedOfLight / wavelength;

        return {
          primary: {
            label: "Resonant Frequency",
            value: freqHz >= 1e9
              ? `${formatNumber(freqHz / 1e9, 4)} GHz`
              : freqHz >= 1e6
                ? `${formatNumber(freqHz / 1e6, 4)} MHz`
                : `${formatNumber(freqHz / 1e3, 4)} kHz`,
          },
          details: [
            { label: "Frequency (Hz)", value: `${formatNumber(freqHz, 2)} Hz` },
            { label: "Frequency (MHz)", value: `${formatNumber(freqHz / 1e6, 6)} MHz` },
            { label: "Full Wavelength (λ)", value: `${formatNumber(wavelength, 4)} m` },
            { label: "Antenna Length", value: `${formatNumber(lengthMeters, 4)} m` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wavelength-calculator", "resonant-frequency-calculator"],
  faq: [
    {
      question: "What is a half-wave dipole antenna?",
      answer:
        "A half-wave dipole is the most common antenna type, consisting of two conductive elements each approximately one-quarter wavelength long. The total length is approximately half the wavelength of the desired frequency. It provides about 2.15 dBi gain.",
    },
    {
      question: "Why is the practical antenna length shorter than theoretical?",
      answer:
        "The practical antenna length is typically 2-5% shorter than the theoretical length due to the 'end effect'. The finite thickness of the wire and capacitance at the ends effectively make the antenna electrically longer than its physical length. A factor of 0.95 is commonly used.",
    },
    {
      question: "What antenna type should I use?",
      answer:
        "A half-wave dipole is the most versatile choice for general use. Quarter-wave antennas require a ground plane and are common in mobile applications. 5/8 wave antennas provide more gain for VHF/UHF verticals. Full-wave loop antennas are used for directional reception.",
    },
  ],
  formula:
    "λ = c / f | Antenna Length = λ × fraction | c = 299,792,458 m/s | Practical factor ≈ 0.95",
};
