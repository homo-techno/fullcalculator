import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photographyExposureCalculator: CalculatorDefinition = {
  slug: "photography-exposure-calculator",
  title: "Photography Exposure Calculator",
  description:
    "Free photography exposure calculator. Calculate exposure value (EV) from ISO, aperture, and shutter speed settings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "exposure value",
    "photography",
    "EV calculator",
    "aperture",
    "shutter speed",
    "ISO",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "iso",
          label: "ISO",
          type: "select",
          options: [
            { label: "100", value: "100" },
            { label: "200", value: "200" },
            { label: "400", value: "400" },
            { label: "800", value: "800" },
            { label: "1600", value: "1600" },
            { label: "3200", value: "3200" },
            { label: "6400", value: "6400" },
          ],
        },
        {
          name: "aperture",
          label: "Aperture (f-stop)",
          type: "select",
          options: [
            { label: "f/1.4", value: "1.4" },
            { label: "f/2", value: "2" },
            { label: "f/2.8", value: "2.8" },
            { label: "f/4", value: "4" },
            { label: "f/5.6", value: "5.6" },
            { label: "f/8", value: "8" },
            { label: "f/11", value: "11" },
            { label: "f/16", value: "16" },
            { label: "f/22", value: "22" },
          ],
        },
        {
          name: "shutterSpeed",
          label: "Shutter Speed (seconds)",
          type: "select",
          options: [
            { label: "1/8000", value: "0.000125" },
            { label: "1/4000", value: "0.00025" },
            { label: "1/2000", value: "0.0005" },
            { label: "1/1000", value: "0.001" },
            { label: "1/500", value: "0.002" },
            { label: "1/250", value: "0.004" },
            { label: "1/125", value: "0.008" },
            { label: "1/60", value: "0.01667" },
            { label: "1/30", value: "0.03333" },
            { label: "1/15", value: "0.06667" },
            { label: "1/8", value: "0.125" },
            { label: "1/4", value: "0.25" },
            { label: "1/2", value: "0.5" },
            { label: "1 sec", value: "1" },
            { label: "2 sec", value: "2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const iso = parseFloat(inputs.iso as string) || 100;
        const aperture = parseFloat(inputs.aperture as string) || 8;
        const shutterSpeed = parseFloat(inputs.shutterSpeed as string) || 0.008;
        if (!iso || !aperture || !shutterSpeed) return null;

        // EV at ISO 100 = log2(f^2 / t)
        const ev100 = Math.log2((aperture * aperture) / shutterSpeed);
        // Adjust for ISO: EV = EV100 + log2(ISO/100)
        const ev = ev100 - Math.log2(iso / 100);

        let lighting = "";
        if (ev >= 15) lighting = "Bright sunlight / snow / sand";
        else if (ev >= 13) lighting = "Daylight / sunny";
        else if (ev >= 11) lighting = "Overcast / open shade";
        else if (ev >= 9) lighting = "Cloudy / twilight";
        else if (ev >= 7) lighting = "Indoor, well-lit";
        else if (ev >= 5) lighting = "Indoor, average lighting";
        else if (ev >= 3) lighting = "Dim indoor / candle-lit";
        else if (ev >= 0) lighting = "Very dim / night with some light";
        else lighting = "Night / very dark";

        const depthOfField =
          aperture <= 2.8
            ? "Very shallow (background very blurred)"
            : aperture <= 5.6
              ? "Shallow (some background blur)"
              : aperture <= 11
                ? "Moderate (mostly sharp)"
                : "Deep (everything sharp)";

        return {
          primary: {
            label: "Exposure Value (EV)",
            value: formatNumber(ev, 1),
          },
          details: [
            { label: "EV at ISO 100", value: formatNumber(ev100, 1) },
            { label: "Suitable Lighting", value: lighting },
            { label: "Depth of Field", value: depthOfField },
            { label: "ISO", value: String(iso) },
            { label: "Aperture", value: "f/" + aperture },
            {
              label: "Shutter Speed",
              value:
                shutterSpeed >= 1
                  ? shutterSpeed + " sec"
                  : "1/" + Math.round(1 / shutterSpeed),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["projector-size-calculator"],
  faq: [
    {
      question: "What is Exposure Value (EV)?",
      answer:
        "EV is a single number that represents a combination of aperture and shutter speed. Higher EV values correspond to brighter conditions. EV 0 is defined as f/1 at 1 second at ISO 100.",
    },
    {
      question: "How do I use the exposure triangle?",
      answer:
        "The exposure triangle is ISO, aperture, and shutter speed. Changing one setting requires adjusting another to maintain the same exposure. For example, doubling ISO allows you to halve the shutter speed or close the aperture by one stop.",
    },
  ],
  formula:
    "EV (at ISO 100) = log2(f-number^2 / shutter speed in seconds). Adjusted EV = EV100 - log2(ISO/100). EV 15 = bright sun, EV 10 = overcast, EV 5 = indoor, EV 0 = very dim.",
};
