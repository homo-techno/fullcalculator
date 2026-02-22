import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const michaelisMentenCalculator: CalculatorDefinition = {
  slug: "michaelis-menten-calculator",
  title: "Michaelis-Menten Kinetics Calculator",
  description:
    "Free Michaelis-Menten kinetics calculator. Calculate reaction velocity, Km, Vmax, and catalytic efficiency for enzyme kinetics.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "michaelis-menten",
    "enzyme kinetics",
    "Km",
    "Vmax",
    "substrate concentration",
    "reaction velocity",
    "catalytic efficiency",
  ],
  variants: [
    {
      id: "velocity",
      name: "Calculate Reaction Velocity",
      description: "Find V from substrate concentration, Vmax, and Km",
      fields: [
        {
          name: "vmax",
          label: "Vmax (µmol/min)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "km",
          label: "Km (µM or mM)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "substrate",
          label: "Substrate Concentration [S] (same unit as Km)",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const Vmax = inputs.vmax as number;
        const Km = inputs.km as number;
        const S = inputs.substrate as number;
        if (!Vmax || !Km || S == null || Vmax <= 0 || Km <= 0 || S < 0)
          return null;

        const V = (Vmax * S) / (Km + S);
        const fractionVmax = (V / Vmax) * 100;

        return {
          primary: {
            label: "Reaction Velocity (V)",
            value: formatNumber(V, 4) + " µmol/min",
          },
          details: [
            { label: "V as % of Vmax", value: formatNumber(fractionVmax, 1) + "%" },
            { label: "Vmax", value: formatNumber(Vmax, 4) },
            { label: "Km", value: formatNumber(Km, 4) },
            { label: "[S]", value: formatNumber(S, 4) },
            { label: "[S]/Km ratio", value: formatNumber(S / Km, 3) },
            {
              label: "1/V (Lineweaver-Burk)",
              value: V > 0 ? formatNumber(1 / V, 6) : "N/A",
            },
            {
              label: "1/[S] (Lineweaver-Burk)",
              value: S > 0 ? formatNumber(1 / S, 6) : "N/A",
            },
          ],
        };
      },
    },
    {
      id: "find-km",
      name: "Estimate Km from Two Data Points",
      description: "Estimate Km and Vmax from two velocity-substrate pairs",
      fields: [
        {
          name: "s1",
          label: "[S]₁ - Substrate Concentration 1",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "v1",
          label: "V₁ - Velocity at [S]₁",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
        },
        {
          name: "s2",
          label: "[S]₂ - Substrate Concentration 2",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "v2",
          label: "V₂ - Velocity at [S]₂",
          type: "number",
          placeholder: "e.g. 70",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const S1 = inputs.s1 as number;
        const V1 = inputs.v1 as number;
        const S2 = inputs.s2 as number;
        const V2 = inputs.v2 as number;
        if (!S1 || !V1 || !S2 || !V2) return null;
        if (S1 === S2) return null;

        // From V = Vmax*S/(Km+S), rearrange two equations to solve for Vmax and Km
        // V1*(Km+S1) = Vmax*S1 and V2*(Km+S2) = Vmax*S2
        // V1*Km + V1*S1 = Vmax*S1, V2*Km + V2*S2 = Vmax*S2
        // Km = (Vmax*S1/V1) - S1 = (Vmax*S2/V2) - S2
        // Solving: Vmax = (V1*S2*(Km+S1)) ... use Lineweaver-Burk
        const invS1 = 1 / S1;
        const invV1 = 1 / V1;
        const invS2 = 1 / S2;
        const invV2 = 1 / V2;

        const slope = (invV2 - invV1) / (invS2 - invS1);
        const intercept = invV1 - slope * invS1;

        if (intercept <= 0) return null;

        const Vmax = 1 / intercept;
        const Km = slope * Vmax;

        if (Km < 0) return null;

        return {
          primary: {
            label: "Estimated Km",
            value: formatNumber(Km, 4),
          },
          details: [
            { label: "Estimated Vmax", value: formatNumber(Vmax, 4) },
            { label: "Catalytic efficiency (Vmax/Km)", value: formatNumber(Vmax / Km, 4) },
            { label: "Data point 1", value: `[S]=${S1}, V=${V1}` },
            { label: "Data point 2", value: `[S]=${S2}, V=${V2}` },
            { label: "L-B slope (Km/Vmax)", value: formatNumber(slope, 6) },
            { label: "L-B intercept (1/Vmax)", value: formatNumber(intercept, 6) },
          ],
          note: "Estimates from two points are approximate. Use nonlinear regression with multiple data points for accuracy.",
        };
      },
    },
  ],
  relatedSlugs: [
    "enzyme-activity-calculator",
    "protein-molecular-weight-calculator",
    "beer-lambert-bio-calculator",
  ],
  faq: [
    {
      question: "What is the Michaelis-Menten equation?",
      answer:
        "The Michaelis-Menten equation describes enzyme kinetics: V = Vmax × [S] / (Km + [S]). Vmax is the maximum velocity and Km is the Michaelis constant — the substrate concentration at which V = Vmax/2.",
    },
    {
      question: "What does Km represent?",
      answer:
        "Km (Michaelis constant) is the substrate concentration at which the reaction velocity is half of Vmax. A low Km indicates high affinity for the substrate, while a high Km indicates low affinity.",
    },
    {
      question: "What is catalytic efficiency?",
      answer:
        "Catalytic efficiency is kcat/Km and measures how efficiently an enzyme converts substrate to product. The theoretical upper limit is the diffusion limit (~10⁸–10⁹ M⁻¹s⁻¹).",
    },
  ],
  formula:
    "V = Vmax × [S] / (Km + [S]). Lineweaver-Burk: 1/V = (Km/Vmax)(1/[S]) + 1/Vmax. Catalytic efficiency = kcat/Km.",
};
