import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const sigma = 5.670374419e-8; // Stefan-Boltzmann constant (W/(m²·K⁴))
const b = 2.897771955e-3; // Wien's displacement constant (m·K)
const h = 6.62607015e-34;
const c = 2.99792458e8;
const kB = 1.380649e-23; // Boltzmann constant (J/K)

export const blackbodyRadiationCalculator: CalculatorDefinition = {
  slug: "blackbody-radiation-calculator",
  title: "Blackbody Radiation Calculator",
  description: "Free blackbody radiation calculator. Compute peak wavelength (Wien's law), total radiated power (Stefan-Boltzmann), and spectral radiance for thermal emitters.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["blackbody radiation", "Wien's law", "Stefan-Boltzmann", "thermal radiation", "peak wavelength", "spectral radiance"],
  variants: [
    {
      id: "wien",
      name: "Wien's Law & Stefan-Boltzmann",
      description: "Calculate peak wavelength and total power from blackbody temperature",
      fields: [
        { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "e.g. 5778", min: 1 },
        { name: "area", label: "Surface Area (m²)", type: "number", placeholder: "e.g. 1 (optional)", min: 0.0001, defaultValue: 1 },
        { name: "emissivity", label: "Emissivity (0-1)", type: "number", placeholder: "e.g. 1", min: 0.01, max: 1, step: 0.01, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const T = parseFloat(inputs.temperature as string);
        const A = parseFloat(inputs.area as string) || 1;
        const eps = parseFloat(inputs.emissivity as string) || 1;
        if (isNaN(T) || T <= 0) return null;

        // Wien's displacement law: λ_max * T = b
        const lambdaMax = b / T; // meters
        const lambdaMaxNm = lambdaMax * 1e9;
        const lambdaMaxUm = lambdaMax * 1e6;

        // Stefan-Boltzmann: P/A = εσT⁴
        const flux = eps * sigma * Math.pow(T, 4); // W/m²
        const totalPower = flux * A; // W

        // Peak frequency (Wien's for frequency): f_max = 2.821 kT/h
        const freqMax = (2.821439 * kB * T) / h;

        // Classify color appearance
        let color = "Infrared (not visible)";
        if (T >= 800 && T < 1300) color = "Dark red glow";
        else if (T >= 1300 && T < 2000) color = "Cherry red to orange";
        else if (T >= 2000 && T < 3500) color = "Orange to yellowish white";
        else if (T >= 3500 && T < 5000) color = "Yellow-white";
        else if (T >= 5000 && T < 7000) color = "White (like sunlight)";
        else if (T >= 7000 && T < 10000) color = "Bluish-white";
        else if (T >= 10000) color = "Blue-white to deep blue";

        return {
          primary: { label: "Peak Wavelength", value: lambdaMaxUm >= 0.1 ? `${formatNumber(lambdaMaxUm, 3)} μm` : `${formatNumber(lambdaMaxNm, 1)} nm` },
          details: [
            { label: "Temperature", value: `${formatNumber(T, 1)} K` },
            { label: "Peak Wavelength", value: `${formatNumber(lambdaMaxNm, 1)} nm (${formatNumber(lambdaMaxUm, 3)} μm)` },
            { label: "Peak Frequency", value: `${formatNumber(freqMax / 1e12, 2)} THz` },
            { label: "Radiant Flux", value: `${formatNumber(flux, 2)} W/m²` },
            { label: "Total Power", value: totalPower >= 1e6 ? `${formatNumber(totalPower / 1e6, 4)} MW` : `${formatNumber(totalPower, 4)} W` },
            { label: "Emissivity", value: formatNumber(eps, 2) },
            { label: "Apparent Color", value: color },
          ],
        };
      },
    },
    {
      id: "from-wavelength",
      name: "Temperature from Peak Wavelength",
      description: "Determine blackbody temperature from the observed peak emission wavelength",
      fields: [
        { name: "peakWavelength", label: "Peak Wavelength", type: "number", placeholder: "e.g. 500", min: 0.001 },
        {
          name: "unit",
          label: "Wavelength Unit",
          type: "select",
          options: [
            { label: "nm", value: "nm" },
            { label: "μm", value: "um" },
            { label: "mm", value: "mm" },
          ],
          defaultValue: "nm",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.peakWavelength as string);
        const unit = (inputs.unit as string) || "nm";
        if (isNaN(val) || val <= 0) return null;

        let lambdaM: number;
        switch (unit) {
          case "nm": lambdaM = val * 1e-9; break;
          case "um": lambdaM = val * 1e-6; break;
          case "mm": lambdaM = val * 1e-3; break;
          default: lambdaM = val * 1e-9;
        }

        const T = b / lambdaM;
        const flux = sigma * Math.pow(T, 4);

        // Compare to known objects
        let comparison = "";
        if (T < 300) comparison = "Colder than room temperature";
        else if (T < 400) comparison = "Near body/room temperature";
        else if (T < 1000) comparison = "Hot iron / campfire";
        else if (T < 3000) comparison = "Incandescent bulb filament";
        else if (T < 6000) comparison = "Sun-like star";
        else if (T < 10000) comparison = "Hot blue-white star (A-type)";
        else if (T < 30000) comparison = "Very hot star (B-type)";
        else comparison = "Extremely hot star (O-type)";

        return {
          primary: { label: "Temperature", value: `${formatNumber(T, 1)} K` },
          details: [
            { label: "Peak Wavelength", value: `${formatNumber(val, 4)} ${unit}` },
            { label: "Temperature", value: `${formatNumber(T, 1)} K (${formatNumber(T - 273.15, 1)} °C)` },
            { label: "Radiant Flux", value: `${formatNumber(flux, 2)} W/m²` },
            { label: "Comparison", value: comparison },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electromagnetic-wave-calculator", "photoelectric-effect-calculator", "wavelength-calculator"],
  faq: [
    { question: "What is Wien's displacement law?", answer: "Wien's law states that the peak wavelength of blackbody emission is inversely proportional to temperature: λ_max = b/T, where b ≈ 2.898×10⁻³ m·K. Hotter objects peak at shorter wavelengths — the Sun (5778 K) peaks at ~502 nm (green), while humans (310 K) peak at ~9.35 μm (infrared)." },
    { question: "What is the Stefan-Boltzmann law?", answer: "The total power radiated per unit area is proportional to the fourth power of temperature: P/A = εσT⁴, where σ ≈ 5.67×10⁻⁸ W/(m²·K⁴) and ε is emissivity (1 for a perfect blackbody). Doubling temperature increases radiated power by 16×." },
    { question: "What is a blackbody?", answer: "A blackbody is an idealized object that absorbs all incident radiation and re-emits it in a characteristic spectrum determined only by its temperature. Real objects approximate blackbodies — stars, furnaces, and even the cosmic microwave background (2.725 K) follow blackbody curves closely." },
  ],
  formula: "λ_max = b/T (Wien) | P/A = εσT⁴ (Stefan-Boltzmann) | b = 2.898×10⁻³ m·K | σ = 5.67×10⁻⁸ W/(m²·K⁴)",
};
