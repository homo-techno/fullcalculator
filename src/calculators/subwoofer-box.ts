import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subwooferBoxCalculator: CalculatorDefinition = {
  slug: "subwoofer-box-calculator",
  title: "Subwoofer Box Calculator",
  description:
    "Free subwoofer box volume calculator. Calculate sealed and ported enclosure dimensions for any subwoofer driver size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "subwoofer box calculator",
    "speaker box volume",
    "enclosure calculator",
    "sealed box",
    "ported box",
    "subwoofer enclosure",
    "sub box design",
  ],
  variants: [
    {
      id: "sealed-box",
      name: "Sealed Box Volume",
      description: "Calculate sealed enclosure internal volume and dimensions",
      fields: [
        {
          name: "driverSize",
          label: "Driver Size (inches)",
          type: "select",
          options: [
            { label: "8 inch", value: "8" },
            { label: "10 inch", value: "10" },
            { label: "12 inch", value: "12" },
            { label: "15 inch", value: "15" },
            { label: "18 inch", value: "18" },
          ],
          defaultValue: "12",
        },
        {
          name: "targetVolume",
          label: "Target Internal Volume (cubic feet)",
          type: "number",
          placeholder: "e.g. 1.25",
          step: 0.05,
          min: 0.1,
        },
        {
          name: "woodThickness",
          label: "Wood Thickness (inches)",
          type: "select",
          options: [
            { label: "1/2 inch (0.5\")", value: "0.5" },
            { label: "5/8 inch (0.625\")", value: "0.625" },
            { label: "3/4 inch (0.75\")", value: "0.75" },
            { label: "1 inch (1.0\")", value: "1.0" },
          ],
          defaultValue: "0.75",
        },
      ],
      calculate: (inputs) => {
        const driverSize = parseFloat(inputs.driverSize as string);
        const woodThickness = parseFloat(inputs.woodThickness as string);
        if (!driverSize) return null;

        // Recommended sealed volumes by driver size (cubic feet)
        const recommendedVolumes: Record<number, { min: number; max: number; typical: number }> = {
          8: { min: 0.3, max: 0.75, typical: 0.5 },
          10: { min: 0.5, max: 1.25, typical: 0.75 },
          12: { min: 0.75, max: 2.0, typical: 1.25 },
          15: { min: 1.5, max: 4.0, typical: 2.5 },
          18: { min: 2.5, max: 6.0, typical: 4.0 },
        };

        const rec = recommendedVolumes[driverSize] || recommendedVolumes[12];
        const targetVol = (inputs.targetVolume as number) || rec.typical;
        const volumeCuIn = targetVol * 1728; // cubic inches

        // Calculate cube-root based dimensions (golden ratio proportions)
        const ratio = 1.618; // golden ratio
        const depthBase = Math.pow(volumeCuIn / (ratio * ratio), 1 / 3);
        const internalDepth = depthBase;
        const internalWidth = depthBase * ratio;
        const internalHeight = depthBase * ratio;

        // Adjust for wood thickness
        const externalDepth = internalDepth + 2 * woodThickness;
        const externalWidth = internalWidth + 2 * woodThickness;
        const externalHeight = internalHeight + 2 * woodThickness;

        // Verify volume
        const actualVolCuIn = internalDepth * internalWidth * internalHeight;
        const actualVolCuFt = actualVolCuIn / 1728;

        return {
          primary: { label: "Internal Volume", value: formatNumber(actualVolCuFt, 2) + " cu ft" },
          details: [
            { label: "Volume (cubic inches)", value: formatNumber(actualVolCuIn, 1) },
            { label: "Volume (liters)", value: formatNumber(actualVolCuFt * 28.3168, 1) },
            { label: "Internal Dimensions (W x H x D)", value: `${formatNumber(internalWidth, 1)} x ${formatNumber(internalHeight, 1)} x ${formatNumber(internalDepth, 1)} in` },
            { label: "External Dimensions (W x H x D)", value: `${formatNumber(externalWidth, 1)} x ${formatNumber(externalHeight, 1)} x ${formatNumber(externalDepth, 1)} in` },
            { label: "Recommended Range", value: `${rec.min} - ${rec.max} cu ft for ${driverSize}" driver` },
            { label: "Wood Thickness", value: `${woodThickness}" (${woodThickness * 25.4} mm)` },
            { label: "Box Type", value: "Sealed (acoustic suspension)" },
          ],
          note: targetVol < rec.min || targetVol > rec.max
            ? `Warning: Target volume is outside the recommended ${rec.min}-${rec.max} cu ft range for a ${driverSize}" driver.`
            : undefined,
        };
      },
    },
    {
      id: "ported-box",
      name: "Ported Box & Port Length",
      description: "Calculate port dimensions for a ported (bass reflex) enclosure",
      fields: [
        {
          name: "boxVolume",
          label: "Box Internal Volume (cubic feet)",
          type: "number",
          placeholder: "e.g. 2.0",
          step: 0.1,
          min: 0.5,
        },
        {
          name: "tuningFreq",
          label: "Tuning Frequency (Hz)",
          type: "number",
          placeholder: "e.g. 35",
          min: 15,
          max: 100,
        },
        {
          name: "portDiameter",
          label: "Port Diameter (inches)",
          type: "select",
          options: [
            { label: "2 inch", value: "2" },
            { label: "3 inch", value: "3" },
            { label: "4 inch", value: "4" },
            { label: "6 inch", value: "6" },
          ],
          defaultValue: "4",
        },
        {
          name: "numPorts",
          label: "Number of Ports",
          type: "select",
          options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const vol = inputs.boxVolume as number;
        const freq = inputs.tuningFreq as number;
        const portDia = parseFloat(inputs.portDiameter as string);
        const numPorts = parseInt(inputs.numPorts as string) || 1;
        if (!vol || !freq || !portDia) return null;

        const volCuIn = vol * 1728;
        const portRadius = portDia / 2;
        const portArea = Math.PI * portRadius * portRadius; // per port
        const totalPortArea = portArea * numPorts;

        // Port length formula: L = (23562.5 x D^2 x N) / (Fb^2 x Vb) - 0.825 x D
        // Where D = port diameter (inches), Fb = tuning freq, Vb = volume (cubic inches), N = number of ports
        // Simplified: L = ((23562.5 x portArea_total) / (freq^2 x volCuIn / 1728)) - (0.825 x portDia)
        // Standard formula: L = (23562.5 x Sv) / (Fb^2 x Vb) - k
        // Using: L = (23562.5 x totalPortArea) / (freq^2 x vol) - 0.825 * Math.sqrt(totalPortArea / Math.PI) * 2
        const portLength = (23562.5 * totalPortArea) / (freq * freq * vol) - 0.825 * portDia;

        const portVelocityEstimate = freq * 2 * Math.PI * vol * 1728 / (totalPortArea * 12); // rough estimate

        return {
          primary: { label: "Port Length", value: formatNumber(Math.max(portLength, 1), 1) + " inches" },
          details: [
            { label: "Port Diameter", value: `${portDia}" (per port)` },
            { label: "Port Area (per port)", value: formatNumber(portArea, 2) + " sq in" },
            { label: "Total Port Area", value: formatNumber(totalPortArea, 2) + " sq in" },
            { label: "Number of Ports", value: `${numPorts}` },
            { label: "Tuning Frequency", value: `${freq} Hz` },
            { label: "Box Volume", value: `${vol} cu ft (${formatNumber(vol * 28.3168, 1)} liters)` },
            { label: "Box Type", value: "Ported (bass reflex)" },
          ],
          note: portLength < 2 ? "Port length is very short. Consider using a smaller port diameter or lower tuning frequency." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["speaker-placement-calculator", "volume-calculator", "cable-length-audio-calculator"],
  faq: [
    {
      question: "Sealed vs ported subwoofer box: which is better?",
      answer:
        "Sealed boxes produce tighter, more accurate bass with a gentle roll-off and are easier to build. Ported boxes are louder and extend deeper but require precise port tuning. Sealed is better for music accuracy; ported for maximum SPL.",
    },
    {
      question: "What volume box do I need for a 12 inch subwoofer?",
      answer:
        "A typical 12\" subwoofer needs 0.75-2.0 cubic feet for a sealed box, or 1.5-3.0 cubic feet for a ported box. Always check the manufacturer's Thiele-Small parameters for optimal volume.",
    },
    {
      question: "What wood should I use for a subwoofer box?",
      answer:
        "3/4\" MDF (Medium Density Fiberboard) is the most popular choice for subwoofer enclosures. It's dense, affordable, and damps vibrations well. Plywood is lighter and stronger but more expensive. Avoid particle board.",
    },
  ],
  formula:
    "Port Length = (23562.5 x Port Area) / (Fb^2 x Volume) - 0.825 x Port Diameter | Port Area = pi x (D/2)^2 | 1 cu ft = 1728 cu in = 28.32 liters",
};
