import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visionPrescriptionCalculator: CalculatorDefinition = {
  slug: "vision-prescription-calculator",
  title: "Vision Prescription Converter Calculator",
  description:
    "Free vision prescription converter calculator. Convert between diopter formats, understand your eyeglass prescription, and convert between plus and minus cylinder notation.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "vision prescription converter",
    "diopter calculator",
    "eyeglass prescription",
    "lens power calculator",
    "sphere cylinder axis",
    "plus minus cylinder",
    "prescription converter",
  ],
  variants: [
    {
      id: "cylinder-transpose",
      name: "Plus/Minus Cylinder Transpose",
      description: "Convert between plus and minus cylinder notation",
      fields: [
        {
          name: "sphere",
          label: "Sphere (SPH)",
          type: "number",
          placeholder: "e.g. -2.50",
          suffix: "D",
          min: -20,
          max: 20,
          step: 0.25,
        },
        {
          name: "cylinder",
          label: "Cylinder (CYL)",
          type: "number",
          placeholder: "e.g. -1.00",
          suffix: "D",
          min: -10,
          max: 10,
          step: 0.25,
        },
        {
          name: "axis",
          label: "Axis",
          type: "number",
          placeholder: "e.g. 90",
          suffix: "degrees",
          min: 1,
          max: 180,
        },
      ],
      calculate: (inputs) => {
        const sph = inputs.sphere as number;
        const cyl = inputs.cylinder as number;
        const axis = inputs.axis as number;
        if (sph === undefined || cyl === undefined || !axis) return null;

        // Transpose: new SPH = SPH + CYL, new CYL = -CYL, new AXIS = AXIS ± 90
        const newSph = sph + cyl;
        const newCyl = -cyl;
        let newAxis = axis <= 90 ? axis + 90 : axis - 90;
        if (newAxis <= 0) newAxis += 180;
        if (newAxis > 180) newAxis -= 180;

        // Spherical equivalent
        const sphericalEquiv = sph + (cyl / 2);

        // Determine condition
        let condition: string;
        if (sph < 0 && cyl === 0) condition = "Myopia (nearsightedness)";
        else if (sph > 0 && cyl === 0) condition = "Hyperopia (farsightedness)";
        else if (cyl !== 0 && sph === 0) condition = "Astigmatism";
        else if (sph < 0 && cyl !== 0) condition = "Myopia with astigmatism";
        else if (sph > 0 && cyl !== 0) condition = "Hyperopia with astigmatism";
        else condition = "Plano (no correction needed for this component)";

        let severity: string;
        const absSph = Math.abs(sphericalEquiv);
        if (absSph <= 0.5) severity = "Very mild";
        else if (absSph <= 3) severity = "Mild";
        else if (absSph <= 6) severity = "Moderate";
        else if (absSph <= 10) severity = "High";
        else severity = "Very high";

        return {
          primary: { label: "Transposed Rx", value: `${formatNumber(newSph, 2)} / ${formatNumber(newCyl, 2)} x ${newAxis}` },
          details: [
            { label: "Original", value: `SPH ${formatNumber(sph, 2)} / CYL ${formatNumber(cyl, 2)} x ${axis}` },
            { label: "Transposed", value: `SPH ${formatNumber(newSph, 2)} / CYL ${formatNumber(newCyl, 2)} x ${newAxis}` },
            { label: "Spherical equivalent", value: `${formatNumber(sphericalEquiv, 2)} D` },
            { label: "Condition", value: condition },
            { label: "Severity", value: severity },
          ],
          note: "Plus and minus cylinder notations describe the same prescription in different formats. Ophthalmologists typically use plus cylinder while optometrists use minus cylinder. Both are optically equivalent. Always verify prescriptions with your eye care provider.",
        };
      },
    },
    {
      id: "prescription-meaning",
      name: "Understand Your Prescription",
      description: "Enter your prescription to understand what each value means",
      fields: [
        {
          name: "sphere",
          label: "Sphere (SPH)",
          type: "number",
          placeholder: "e.g. -2.50",
          suffix: "D",
          min: -20,
          max: 20,
          step: 0.25,
        },
        {
          name: "cylinder",
          label: "Cylinder (CYL) — enter 0 if none",
          type: "number",
          placeholder: "e.g. -0.75",
          suffix: "D",
          min: -10,
          max: 10,
          step: 0.25,
        },
        {
          name: "add",
          label: "ADD Power (for bifocals/progressives, 0 if none)",
          type: "number",
          placeholder: "e.g. 2.00",
          suffix: "D",
          min: 0,
          max: 4,
          step: 0.25,
        },
      ],
      calculate: (inputs) => {
        const sph = inputs.sphere as number;
        const cyl = inputs.cylinder as number;
        const add = inputs.add as number;
        if (sph === undefined) return null;

        const cylVal = cyl || 0;
        const addVal = add || 0;

        let sphMeaning: string;
        if (sph < 0) sphMeaning = "Myopic (nearsighted) — difficulty seeing far objects";
        else if (sph > 0) sphMeaning = "Hyperopic (farsighted) — difficulty seeing near objects";
        else sphMeaning = "Plano — no spherical correction needed";

        let cylMeaning: string;
        if (Math.abs(cylVal) > 0) cylMeaning = `Astigmatism present (${Math.abs(cylVal)} D of corneal irregularity)`;
        else cylMeaning = "No astigmatism";

        let addMeaning: string;
        if (addVal > 0) addMeaning = `Presbyopia correction — ADD +${formatNumber(addVal, 2)} for reading/near vision`;
        else addMeaning = "No near vision correction needed";

        const sphericalEquiv = sph + (cylVal / 2);

        // Approximate uncorrected visual acuity based on spherical equivalent
        let approxVa: string;
        const absSe = Math.abs(sphericalEquiv);
        if (absSe <= 0.25) approxVa = "~20/20 to 20/25";
        else if (absSe <= 0.5) approxVa = "~20/30 to 20/40";
        else if (absSe <= 1.0) approxVa = "~20/40 to 20/80";
        else if (absSe <= 2.0) approxVa = "~20/80 to 20/160";
        else if (absSe <= 3.0) approxVa = "~20/200 to 20/300";
        else approxVa = "~20/400 or worse";

        return {
          primary: { label: "Spherical Equivalent", value: `${formatNumber(sphericalEquiv, 2)} D` },
          details: [
            { label: "Sphere meaning", value: sphMeaning },
            { label: "Cylinder meaning", value: cylMeaning },
            { label: "ADD meaning", value: addMeaning },
            { label: "Approx. uncorrected VA", value: approxVa },
            { label: "Spherical equivalent", value: `${formatNumber(sphericalEquiv, 2)} D` },
          ],
          note: "Approximate visual acuity estimates are rough and vary significantly between individuals. Your actual vision depends on many factors including pupil size, lighting, and corneal health. Always consult your eye care provider for accurate assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["contact-lens-calculator", "glasses-size-calculator"],
  faq: [
    {
      question: "What do SPH, CYL, and AXIS mean?",
      answer:
        "SPH (sphere) corrects myopia (minus) or hyperopia (plus). CYL (cylinder) corrects astigmatism. AXIS (1-180 degrees) indicates the orientation of astigmatism. Together they define the lens power needed.",
    },
    {
      question: "What is the difference between plus and minus cylinder?",
      answer:
        "They are two ways to write the same prescription. Ophthalmologists typically use plus cylinder; optometrists use minus cylinder. Transposing converts between them: add CYL to SPH, negate CYL, rotate AXIS by 90 degrees.",
    },
    {
      question: "What is spherical equivalent?",
      answer:
        "Spherical equivalent (SE) = SPH + (CYL / 2). It represents the overall refractive error as a single number and is commonly used for contact lens fitting and refractive surgery planning.",
    },
    {
      question: "Can I use my glasses prescription for contacts?",
      answer:
        "No. Contact lens prescriptions differ from glasses prescriptions because contacts sit directly on the eye. For prescriptions stronger than about +/-4.00 D, a vertex distance adjustment is needed. Contact lenses also require base curve and diameter measurements.",
    },
  ],
  formula:
    "Cylinder Transpose: New SPH = SPH + CYL | New CYL = -CYL | New AXIS = AXIS +/- 90 | Spherical Equivalent = SPH + (CYL / 2)",
};
