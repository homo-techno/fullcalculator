import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const mu0 = 4 * Math.PI * 1e-7; // Permeability of free space (T·m/A)

export const magneticFieldCalculator: CalculatorDefinition = {
  slug: "magnetic-field-calculator",
  title: "Magnetic Field Calculator",
  description: "Free magnetic field calculator. Compute the magnetic field strength for solenoids, straight wires, and circular loops using Ampere's law and Biot-Savart law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["magnetic field", "solenoid", "Biot-Savart", "ampere's law", "magnetic flux", "electromagnetism"],
  variants: [
    {
      id: "solenoid",
      name: "Solenoid",
      description: "Calculate the magnetic field inside an ideal solenoid (B = μ₀nI)",
      fields: [
        { name: "current", label: "Current (A)", type: "number", placeholder: "e.g. 2", min: 0.001 },
        { name: "turns", label: "Number of Turns (N)", type: "number", placeholder: "e.g. 500", min: 1 },
        { name: "length", label: "Solenoid Length (m)", type: "number", placeholder: "e.g. 0.2", min: 0.001 },
      ],
      calculate: (inputs) => {
        const I = parseFloat(inputs.current as string);
        const N = parseFloat(inputs.turns as string);
        const L = parseFloat(inputs.length as string);
        if (isNaN(I) || isNaN(N) || isNaN(L)) return null;
        if (I <= 0 || N < 1 || L <= 0) return null;

        const n = N / L; // turns per meter
        const B = mu0 * n * I; // Tesla
        const BmT = B * 1000; // milliTesla
        const BGauss = B * 10000; // Gauss

        // Inductance: L = μ₀n²Al (need area, approximate with reasonable radius)
        // Magnetic flux per turn: Φ = BA (would need area)

        return {
          primary: { label: "Magnetic Field (B)", value: `${formatNumber(BmT, 4)} mT` },
          details: [
            { label: "B (Tesla)", value: `${formatNumber(B, 6)} T` },
            { label: "B (milliTesla)", value: `${formatNumber(BmT, 4)} mT` },
            { label: "B (Gauss)", value: `${formatNumber(BGauss, 4)} G` },
            { label: "Current (I)", value: `${formatNumber(I, 4)} A` },
            { label: "Turns (N)", value: formatNumber(N, 0) },
            { label: "Length", value: `${formatNumber(L, 4)} m` },
            { label: "Turns/meter (n)", value: `${formatNumber(n, 1)} /m` },
          ],
          note: "This gives the field inside an ideal (infinitely long) solenoid. The field outside is approximately zero. For finite solenoids, the field at the ends is about B/2.",
        };
      },
    },
    {
      id: "straight-wire",
      name: "Straight Wire",
      description: "Calculate the magnetic field at distance r from a long straight current-carrying wire",
      fields: [
        { name: "current", label: "Current (A)", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "distance", label: "Distance from Wire (m)", type: "number", placeholder: "e.g. 0.05", min: 0.0001 },
      ],
      calculate: (inputs) => {
        const I = parseFloat(inputs.current as string);
        const r = parseFloat(inputs.distance as string);
        if (isNaN(I) || isNaN(r)) return null;
        if (I <= 0 || r <= 0) return null;

        // B = μ₀I / (2πr)
        const B = (mu0 * I) / (2 * Math.PI * r);
        const BmT = B * 1000;
        const BGauss = B * 10000;
        const BuT = B * 1e6;

        // Force per unit length between two parallel wires with same current at this distance
        const forcePerLength = (mu0 * I * I) / (2 * Math.PI * r);

        return {
          primary: { label: "Magnetic Field (B)", value: BmT >= 0.01 ? `${formatNumber(BmT, 4)} mT` : `${formatNumber(BuT, 4)} μT` },
          details: [
            { label: "B (Tesla)", value: `${formatNumber(B, 8)} T` },
            { label: "B (milliTesla)", value: `${formatNumber(BmT, 4)} mT` },
            { label: "B (microTesla)", value: `${formatNumber(BuT, 4)} μT` },
            { label: "B (Gauss)", value: `${formatNumber(BGauss, 6)} G` },
            { label: "Current", value: `${formatNumber(I, 4)} A` },
            { label: "Distance", value: `${formatNumber(r, 4)} m` },
            { label: "Force/length (2 parallel wires)", value: `${formatNumber(forcePerLength, 6)} N/m` },
          ],
          note: "The field forms concentric circles around the wire (right-hand rule). For Earth's magnetic field comparison: ~25-65 μT.",
        };
      },
    },
    {
      id: "circular-loop",
      name: "Circular Loop (on axis)",
      description: "Calculate the magnetic field along the axis of a circular current loop",
      fields: [
        { name: "current", label: "Current (A)", type: "number", placeholder: "e.g. 5", min: 0.001 },
        { name: "radius", label: "Loop Radius (m)", type: "number", placeholder: "e.g. 0.1", min: 0.0001 },
        { name: "distance", label: "Distance from Center Along Axis (m)", type: "number", placeholder: "e.g. 0 (at center)", min: 0 },
      ],
      calculate: (inputs) => {
        const I = parseFloat(inputs.current as string);
        const R = parseFloat(inputs.radius as string);
        const x = parseFloat(inputs.distance as string);
        if (isNaN(I) || isNaN(R) || isNaN(x)) return null;
        if (I <= 0 || R <= 0 || x < 0) return null;

        // B = μ₀IR² / (2(R² + x²)^(3/2))
        const B = (mu0 * I * R * R) / (2 * Math.pow(R * R + x * x, 1.5));
        const BmT = B * 1000;
        const BuT = B * 1e6;

        // At center (x = 0): B = μ₀I/(2R)
        const Bcenter = (mu0 * I) / (2 * R);

        // Magnetic dipole moment
        const area = Math.PI * R * R;
        const dipoleMoment = I * area; // A·m²

        return {
          primary: { label: "Magnetic Field (B)", value: BmT >= 0.01 ? `${formatNumber(BmT, 4)} mT` : `${formatNumber(BuT, 4)} μT` },
          details: [
            { label: "B (Tesla)", value: `${formatNumber(B, 8)} T` },
            { label: "B at center (x=0)", value: `${formatNumber(Bcenter * 1000, 4)} mT` },
            { label: "B at distance x", value: BmT >= 0.01 ? `${formatNumber(BmT, 4)} mT` : `${formatNumber(BuT, 4)} μT` },
            { label: "B/B_center ratio", value: formatNumber(B / Bcenter, 4) },
            { label: "Magnetic Moment (m)", value: `${formatNumber(dipoleMoment, 6)} A·m²` },
            { label: "Loop Area", value: `${formatNumber(area, 6)} m²` },
            { label: "Current", value: `${formatNumber(I, 4)} A` },
            { label: "Radius", value: `${formatNumber(R, 4)} m` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electromagnetic-wave-calculator", "force-calculator"],
  faq: [
    { question: "How do you calculate the magnetic field of a solenoid?", answer: "For an ideal solenoid: B = μ₀nI, where n = N/L is the turn density (turns per meter), I is the current, and μ₀ = 4π×10⁻⁷ T·m/A. The field is uniform inside and nearly zero outside. A 1000-turn, 0.5m solenoid with 1A produces B ≈ 2.51 mT." },
    { question: "What is the Biot-Savart law?", answer: "The Biot-Savart law gives the magnetic field dB from a small current element: dB = (μ₀/4π)(Idl × r̂)/r². For a long straight wire, integration gives B = μ₀I/(2πr). For a circular loop at center: B = μ₀I/(2R)." },
    { question: "How strong is Earth's magnetic field?", answer: "Earth's magnetic field is approximately 25-65 μT (0.25-0.65 Gauss) at the surface. For comparison, a refrigerator magnet is about 5 mT, an MRI machine is 1.5-3 T, and a neodymium magnet is about 1.4 T." },
  ],
  formula: "Solenoid: B = μ₀nI | Wire: B = μ₀I/(2πr) | Loop: B = μ₀IR²/(2(R²+x²)^(3/2)) | μ₀ = 4π×10⁻⁷ T·m/A",
};
