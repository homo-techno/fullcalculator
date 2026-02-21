import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contactLensCalculator: CalculatorDefinition = {
  slug: "contact-lens-calculator",
  title: "Contact Lens Power Calculator",
  description:
    "Free contact lens power calculator. Convert your glasses prescription to contact lens power using vertex distance adjustment. Calculate effective power for contact lenses.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "contact lens calculator",
    "contact lens power",
    "glasses to contacts conversion",
    "vertex distance",
    "contact lens prescription",
    "lens power conversion",
  ],
  variants: [
    {
      id: "glasses-to-contacts",
      name: "Glasses to Contact Lens Conversion",
      description: "Convert spectacle prescription to contact lens power",
      fields: [
        {
          name: "sphere",
          label: "Glasses Sphere (SPH)",
          type: "number",
          placeholder: "e.g. -4.50",
          suffix: "D",
          min: -20,
          max: 20,
          step: 0.25,
        },
        {
          name: "vertexDistance",
          label: "Vertex Distance",
          type: "select",
          options: [
            { label: "12 mm (standard)", value: "12" },
            { label: "10 mm", value: "10" },
            { label: "14 mm", value: "14" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sph = inputs.sphere as number;
        const vdStr = inputs.vertexDistance as string;
        if (sph === undefined || !vdStr) return null;
        const vd = parseFloat(vdStr);

        // Vertex distance formula: CL power = SPH / (1 - (vd/1000) × SPH)
        const vdMeters = vd / 1000;
        const clPower = sph / (1 - vdMeters * sph);

        // Round to nearest 0.25
        const clPowerRounded = Math.round(clPower * 4) / 4;

        const difference = Math.abs(clPowerRounded - sph);
        const significantDiff = Math.abs(sph) >= 4;

        let explanation: string;
        if (Math.abs(sph) < 4) {
          explanation = "For prescriptions below +/-4.00 D, the difference is clinically insignificant. Your contact lens power is essentially the same as your glasses.";
        } else {
          explanation = `For your prescription (${formatNumber(sph, 2)} D), vertex distance adjustment is important. The contact lens sits closer to the eye, changing the effective power by ${formatNumber(difference, 2)} D.`;
        }

        return {
          primary: { label: "Contact Lens Power", value: `${formatNumber(clPowerRounded, 2)} D` },
          details: [
            { label: "Glasses power", value: `${formatNumber(sph, 2)} D` },
            { label: "Contact lens power (exact)", value: `${formatNumber(clPower, 2)} D` },
            { label: "Contact lens power (rounded to 0.25)", value: `${formatNumber(clPowerRounded, 2)} D` },
            { label: "Vertex distance used", value: `${vd} mm` },
            { label: "Power difference", value: `${formatNumber(difference, 2)} D` },
            { label: "Adjustment significant?", value: significantDiff ? "Yes — use adjusted power" : "No — adjustment is minimal" },
          ],
          note: explanation + " Contact lens fitting also requires base curve and diameter measurements from your eye care provider. This calculator only converts spherical power — astigmatism requires toric lenses. Never order contacts without a valid contact lens prescription.",
        };
      },
    },
    {
      id: "lens-comparison",
      name: "Both Eyes Conversion",
      description: "Convert both eyes from glasses to contact lens power",
      fields: [
        {
          name: "odSphere",
          label: "Right Eye (OD) Sphere",
          type: "number",
          placeholder: "e.g. -3.50",
          suffix: "D",
          min: -20,
          max: 20,
          step: 0.25,
        },
        {
          name: "osSphere",
          label: "Left Eye (OS) Sphere",
          type: "number",
          placeholder: "e.g. -4.00",
          suffix: "D",
          min: -20,
          max: 20,
          step: 0.25,
        },
        {
          name: "vertexDistance",
          label: "Vertex Distance",
          type: "select",
          options: [
            { label: "12 mm (standard)", value: "12" },
            { label: "10 mm", value: "10" },
            { label: "14 mm", value: "14" },
          ],
        },
      ],
      calculate: (inputs) => {
        const odSph = inputs.odSphere as number;
        const osSph = inputs.osSphere as number;
        const vdStr = inputs.vertexDistance as string;
        if (odSph === undefined || osSph === undefined || !vdStr) return null;
        const vd = parseFloat(vdStr);
        const vdMeters = vd / 1000;

        const odCl = odSph / (1 - vdMeters * odSph);
        const osCl = osSph / (1 - vdMeters * osSph);
        const odClRound = Math.round(odCl * 4) / 4;
        const osClRound = Math.round(osCl * 4) / 4;

        return {
          primary: { label: "Contact Lens Powers", value: `OD: ${formatNumber(odClRound, 2)} / OS: ${formatNumber(osClRound, 2)}` },
          details: [
            { label: "Right eye (OD) glasses", value: `${formatNumber(odSph, 2)} D` },
            { label: "Right eye (OD) contacts", value: `${formatNumber(odClRound, 2)} D` },
            { label: "Left eye (OS) glasses", value: `${formatNumber(osSph, 2)} D` },
            { label: "Left eye (OS) contacts", value: `${formatNumber(osClRound, 2)} D` },
            { label: "Vertex distance", value: `${vd} mm` },
          ],
          note: "This converts spherical power only. For astigmatism, toric contact lenses are needed and require additional parameters (cylinder and axis). A contact lens exam and fitting by an eye care provider is required before ordering contact lenses.",
        };
      },
    },
  ],
  relatedSlugs: ["vision-prescription-calculator", "glasses-size-calculator"],
  faq: [
    {
      question: "Why is my contact lens prescription different from my glasses?",
      answer:
        "Glasses sit about 12mm from your eye (vertex distance), while contacts sit directly on the eye. This changes the effective power of the lens. The difference is significant for prescriptions above +/-4.00 D.",
    },
    {
      question: "What is vertex distance?",
      answer:
        "Vertex distance is the distance between the back surface of a spectacle lens and the front of the cornea. Standard is 12mm. Since contact lenses have zero vertex distance, a power adjustment is needed.",
    },
    {
      question: "Can I just use my glasses prescription for contacts?",
      answer:
        "No. Contact lenses require a separate prescription that includes base curve, diameter, and brand, plus the power may differ from glasses. A contact lens fitting exam is legally required in most places.",
    },
    {
      question: "When does the power difference matter?",
      answer:
        "For prescriptions weaker than +/-4.00 D, the difference is less than 0.25 D and usually clinically insignificant. For stronger prescriptions, the adjustment becomes increasingly important.",
    },
  ],
  formula:
    "Contact Lens Power = Glasses Power / (1 - (vertex distance in meters x Glasses Power)) | Standard vertex distance = 0.012 m (12 mm) | Results rounded to nearest 0.25 D",
};
