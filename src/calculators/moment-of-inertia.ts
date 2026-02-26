import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const momentOfInertiaCalculator: CalculatorDefinition = {
  slug: "moment-of-inertia-calculator",
  title: "Moment of Inertia Calculator",
  description: "Free moment of inertia calculator. Compute rotational inertia for common shapes including solid and hollow cylinders, spheres, rods, and disks.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["moment of inertia", "rotational inertia", "angular mass", "cylinder inertia", "sphere inertia", "parallel axis theorem"],
  variants: [
    {
      id: "common-shapes",
      name: "Common Shapes",
      description: "Calculate moment of inertia for standard geometric shapes",
      fields: [
        {
          name: "shape",
          label: "Shape",
          type: "select",
          options: [
            { label: "Solid Cylinder / Disk (axis through center)", value: "solid-cylinder" },
            { label: "Hollow Cylinder (axis through center)", value: "hollow-cylinder" },
            { label: "Solid Sphere (axis through center)", value: "solid-sphere" },
            { label: "Hollow Sphere (thin shell)", value: "hollow-sphere" },
            { label: "Thin Rod (axis through center)", value: "rod-center" },
            { label: "Thin Rod (axis through end)", value: "rod-end" },
            { label: "Rectangular Plate (axis through center)", value: "rectangle" },
          ],
          defaultValue: "solid-cylinder",
        },
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 5", min: 0.001 },
        { name: "radius", label: "Radius / Length (m)", type: "number", placeholder: "e.g. 0.5", min: 0.001 },
        { name: "radius2", label: "Inner Radius or Width (m)", type: "number", placeholder: "e.g. 0.3 (if needed)", min: 0 },
      ],
      calculate: (inputs) => {
        const shape = (inputs.shape as string) || "solid-cylinder";
        const m = parseFloat(inputs.mass as string);
        const r = parseFloat(inputs.radius as string);
        const r2 = parseFloat(inputs.radius2 as string) || 0;
        if (isNaN(m) || isNaN(r) || m <= 0 || r <= 0) return null;

        let I: number;
        let formula: string;
        let description: string;

        switch (shape) {
          case "solid-cylinder":
            I = 0.5 * m * r * r;
            formula = "I = ½mr²";
            description = `Solid cylinder/disk, R = ${formatNumber(r, 4)} m`;
            break;
          case "hollow-cylinder":
            if (r2 >= r) return null;
            I = 0.5 * m * (r * r + r2 * r2);
            formula = "I = ½m(R₁² + R₂²)";
            description = `Hollow cylinder, R₁ = ${formatNumber(r, 4)} m, R₂ = ${formatNumber(r2, 4)} m`;
            break;
          case "solid-sphere":
            I = (2 / 5) * m * r * r;
            formula = "I = ⅖mr²";
            description = `Solid sphere, R = ${formatNumber(r, 4)} m`;
            break;
          case "hollow-sphere":
            I = (2 / 3) * m * r * r;
            formula = "I = ⅔mr²";
            description = `Hollow sphere (thin shell), R = ${formatNumber(r, 4)} m`;
            break;
          case "rod-center":
            I = (1 / 12) * m * r * r;
            formula = "I = (1/12)mL²";
            description = `Thin rod (center axis), L = ${formatNumber(r, 4)} m`;
            break;
          case "rod-end":
            I = (1 / 3) * m * r * r;
            formula = "I = (1/3)mL²";
            description = `Thin rod (end axis), L = ${formatNumber(r, 4)} m`;
            break;
          case "rectangle":
            I = (1 / 12) * m * (r * r + r2 * r2);
            formula = "I = (1/12)m(a² + b²)";
            description = `Rectangular plate, a = ${formatNumber(r, 4)} m, b = ${formatNumber(r2, 4)} m`;
            break;
          default:
            return null;
        }

        const radiusOfGyration = Math.sqrt(I / m);

        return {
          primary: { label: "Moment of Inertia", value: `${formatNumber(I, 6)} kg·m²` },
          details: [
            { label: "Shape", value: description },
            { label: "Formula", value: formula },
            { label: "Mass", value: `${formatNumber(m, 4)} kg` },
            { label: "Moment of Inertia (I)", value: `${formatNumber(I, 6)} kg·m²` },
            { label: "Radius of Gyration (k)", value: `${formatNumber(radiusOfGyration, 6)} m` },
          ],
        };
      },
    },
    {
      id: "parallel-axis",
      name: "Parallel Axis Theorem",
      description: "Calculate moment of inertia about a parallel axis using I = I_cm + md²",
      fields: [
        { name: "iCm", label: "I about center of mass (kg·m²)", type: "number", placeholder: "e.g. 0.25", min: 0 },
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 5", min: 0.001 },
        { name: "distance", label: "Distance to new axis (m)", type: "number", placeholder: "e.g. 0.3", min: 0 },
      ],
      calculate: (inputs) => {
        const iCm = parseFloat(inputs.iCm as string);
        const m = parseFloat(inputs.mass as string);
        const d = parseFloat(inputs.distance as string);
        if (isNaN(iCm) || isNaN(m) || isNaN(d)) return null;
        if (iCm < 0 || m <= 0 || d < 0) return null;

        const iNew = iCm + m * d * d;
        const kCm = Math.sqrt(iCm / m);
        const kNew = Math.sqrt(iNew / m);

        return {
          primary: { label: "I (new axis)", value: `${formatNumber(iNew, 6)} kg·m²` },
          details: [
            { label: "I_cm", value: `${formatNumber(iCm, 6)} kg·m²` },
            { label: "md²", value: `${formatNumber(m * d * d, 6)} kg·m²` },
            { label: "I_new = I_cm + md²", value: `${formatNumber(iNew, 6)} kg·m²` },
            { label: "Radius of Gyration (cm)", value: `${formatNumber(kCm, 6)} m` },
            { label: "Radius of Gyration (new)", value: `${formatNumber(kNew, 6)} m` },
            { label: "Increase Factor", value: `${formatNumber(iNew / iCm, 4)}×` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["angular-momentum-calculator", "force-calculator", "acceleration-calculator"],
  faq: [
    { question: "What is moment of inertia?", answer: "Moment of inertia (I) is the rotational equivalent of mass. It measures an object's resistance to angular acceleration. It depends on both mass and how that mass is distributed relative to the axis of rotation: I = Σm_i·r_i². Units are kg·m²." },
    { question: "What is the parallel axis theorem?", answer: "The parallel axis theorem states I = I_cm + md², where I_cm is the moment of inertia about the center of mass, m is the total mass, and d is the distance between the two parallel axes. It lets you find I about any axis parallel to a known one." },
    { question: "What is radius of gyration?", answer: "The radius of gyration k = √(I/m) is the distance from the rotation axis at which all the mass could be concentrated to give the same moment of inertia. It simplifies comparing rotational properties of different shapes." },
  ],
  formula: "Solid cylinder: I = ½mr² | Solid sphere: I = ⅖mr² | Rod (center): I = (1/12)mL² | Parallel axis: I = I_cm + md²",
};
