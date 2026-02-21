import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dopplerEffectCalculator: CalculatorDefinition = {
  slug: "doppler-effect-calculator",
  title: "Doppler Effect Calculator",
  description:
    "Free Doppler effect calculator. Compute the observed frequency shift for moving sources and observers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "doppler effect",
    "frequency shift",
    "sound waves",
    "moving source",
    "observed frequency",
  ],
  variants: [
    {
      id: "approaching",
      name: "Source Approaching Observer",
      fields: [
        {
          name: "f0",
          label: "Source Frequency (Hz)",
          type: "number",
          placeholder: "e.g. 440",
        },
        {
          name: "vs",
          label: "Source Velocity (m/s)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "vo",
          label: "Observer Velocity (m/s) — toward source",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "v",
          label: "Speed of Sound (m/s) — default 343",
          type: "number",
          placeholder: "343",
        },
      ],
      calculate: (inputs) => {
        const f0 = inputs.f0 as number;
        const vs = inputs.vs as number;
        const vo = (inputs.vo as number) || 0;
        const v = (inputs.v as number) || 343;
        if (!f0 || vs === undefined || vs === null) return null;
        if (vs >= v) return null; // source cannot exceed speed of sound in this model
        // Approaching: observer moves toward source (+vo), source moves toward observer (-vs)
        const fPrime = f0 * ((v + vo) / (v - vs));
        const shift = fPrime - f0;
        return {
          primary: {
            label: "Observed Frequency",
            value: formatNumber(fPrime, 4) + " Hz",
          },
          details: [
            { label: "Source Frequency", value: formatNumber(f0, 4) + " Hz" },
            {
              label: "Frequency Shift",
              value: formatNumber(shift, 4) + " Hz",
            },
            {
              label: "Percentage Shift",
              value: formatNumber((shift / f0) * 100, 2) + "%",
            },
            {
              label: "Speed of Sound",
              value: formatNumber(v, 2) + " m/s",
            },
            {
              label: "Source Velocity",
              value: formatNumber(vs, 4) + " m/s",
            },
            {
              label: "Observer Velocity",
              value: formatNumber(vo, 4) + " m/s",
            },
          ],
        };
      },
    },
    {
      id: "receding",
      name: "Source Receding from Observer",
      fields: [
        {
          name: "f0",
          label: "Source Frequency (Hz)",
          type: "number",
          placeholder: "e.g. 440",
        },
        {
          name: "vs",
          label: "Source Velocity (m/s)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "vo",
          label: "Observer Velocity (m/s) — away from source",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "v",
          label: "Speed of Sound (m/s) — default 343",
          type: "number",
          placeholder: "343",
        },
      ],
      calculate: (inputs) => {
        const f0 = inputs.f0 as number;
        const vs = inputs.vs as number;
        const vo = (inputs.vo as number) || 0;
        const v = (inputs.v as number) || 343;
        if (!f0 || vs === undefined || vs === null) return null;
        // Receding: observer moves away (-vo), source moves away (+vs)
        const fPrime = f0 * ((v - vo) / (v + vs));
        const shift = fPrime - f0;
        return {
          primary: {
            label: "Observed Frequency",
            value: formatNumber(fPrime, 4) + " Hz",
          },
          details: [
            { label: "Source Frequency", value: formatNumber(f0, 4) + " Hz" },
            {
              label: "Frequency Shift",
              value: formatNumber(shift, 4) + " Hz",
            },
            {
              label: "Percentage Shift",
              value: formatNumber((shift / f0) * 100, 2) + "%",
            },
            {
              label: "Speed of Sound",
              value: formatNumber(v, 2) + " m/s",
            },
            {
              label: "Source Velocity",
              value: formatNumber(vs, 4) + " m/s",
            },
            {
              label: "Observer Velocity",
              value: formatNumber(vo, 4) + " m/s",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["refractive-index-calculator", "pendulum-calculator"],
  faq: [
    {
      question: "What is the Doppler effect?",
      answer:
        "The Doppler effect is the change in observed frequency of a wave when the source or observer is moving. An approaching source produces a higher frequency; a receding source produces a lower frequency.",
    },
    {
      question: "What happens if the source moves faster than sound?",
      answer:
        "When the source exceeds the speed of sound, it creates a shock wave (sonic boom). The standard Doppler formula does not apply in that regime.",
    },
  ],
  formula:
    "f' = f₀ × (v ± vₒ) / (v ∓ vₛ), where f₀ is source frequency, v is speed of sound (343 m/s), vₒ is observer velocity, vₛ is source velocity.",
};
