import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frequencyWavelengthCalculator: CalculatorDefinition = {
  slug: "frequency-wavelength",
  title: "Frequency to Wavelength Calculator",
  description:
    "Convert between frequency and wavelength for electromagnetic waves using the relationship c = fλ, where c is the speed of light.",
  category: "Science",
  categorySlug: "science",
  icon: "Radio",
  keywords: [
    "frequency",
    "wavelength",
    "electromagnetic",
    "light",
    "radio",
    "spectrum",
    "physics",
  ],
  variants: [
    {
      id: "wavelength-from-frequency",
      name: "Wavelength from Frequency",
      fields: [
        {
          name: "frequency",
          label: "Frequency (Hz)",
          type: "number",
          placeholder: "Enter frequency in hertz",
        },
      ],
      calculate: (inputs) => {
        const f = parseFloat(inputs.frequency as string);
        if (isNaN(f) || f <= 0) {
          return { primary: { label: "Wavelength", value: "Invalid input" }, details: [] };
        }
        const c = 299792458;
        const lambda = c / f;
        let band = "Unknown";
        if (f < 3e4) band = "Extremely Low Frequency (ELF)";
        else if (f < 3e5) band = "Low Frequency (LF)";
        else if (f < 3e6) band = "Medium Frequency (MF)";
        else if (f < 3e7) band = "High Frequency (HF)";
        else if (f < 3e8) band = "Very High Frequency (VHF)";
        else if (f < 3e9) band = "Ultra High Frequency (UHF)";
        else if (f < 3e10) band = "Super High Frequency (SHF)";
        else if (f < 3e11) band = "Extremely High Frequency (EHF)";
        else if (f < 4e14) band = "Infrared";
        else if (f < 7.5e14) band = "Visible Light";
        else if (f < 3e16) band = "Ultraviolet";
        else if (f < 3e19) band = "X-ray";
        else band = "Gamma Ray";
        return {
          primary: { label: "Wavelength", value: `${formatNumber(lambda)} m` },
          details: [
            { label: "Frequency", value: `${formatNumber(f)} Hz` },
            { label: "Wavelength (nm)", value: `${formatNumber(lambda * 1e9)} nm` },
            { label: "Wavelength (cm)", value: `${formatNumber(lambda * 100)} cm` },
            { label: "EM Band", value: band },
          ],
        };
      },
    },
    {
      id: "frequency-from-wavelength",
      name: "Frequency from Wavelength",
      fields: [
        {
          name: "wavelength",
          label: "Wavelength (m)",
          type: "number",
          placeholder: "Enter wavelength in meters",
        },
      ],
      calculate: (inputs) => {
        const lambda = parseFloat(inputs.wavelength as string);
        if (isNaN(lambda) || lambda <= 0) {
          return { primary: { label: "Frequency", value: "Invalid input" }, details: [] };
        }
        const c = 299792458;
        const f = c / lambda;
        return {
          primary: { label: "Frequency", value: `${formatNumber(f)} Hz` },
          details: [
            { label: "Wavelength", value: `${formatNumber(lambda)} m` },
            { label: "Frequency (MHz)", value: `${formatNumber(f / 1e6)} MHz` },
            { label: "Frequency (GHz)", value: `${formatNumber(f / 1e9)} GHz` },
            { label: "Period", value: `${formatNumber(1 / f)} s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wave-speed", "snells-law", "thin-lens"],
  faq: [
    {
      question: "What is the relationship between frequency and wavelength?",
      answer:
        "For electromagnetic waves, frequency and wavelength are inversely proportional: as frequency increases, wavelength decreases. They are related by c = fλ, where c is the speed of light.",
    },
    {
      question: "What is the visible light spectrum range?",
      answer:
        "Visible light has wavelengths from about 380 nm (violet) to 700 nm (red), corresponding to frequencies from about 430 THz to 790 THz.",
    },
  ],
  formula:
    "λ = c/f and f = c/λ, where c = 299,792,458 m/s (speed of light), f is frequency in Hz, and λ is wavelength in meters.",
};
