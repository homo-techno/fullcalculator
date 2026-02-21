import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuseSizingCalculator: CalculatorDefinition = {
  slug: "fuse-sizing-calculator",
  title: "Fuse Sizing Calculator",
  description:
    "Free fuse sizing calculator. Calculate the correct fuse or circuit breaker size for your electrical circuit based on load current, wire size, and NEC requirements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "fuse sizing",
    "fuse calculator",
    "circuit breaker sizing",
    "overcurrent protection",
    "fuse size calculator",
    "breaker size calculator",
  ],
  variants: [
    {
      id: "by-load",
      name: "Fuse Size by Load Current",
      description: "Calculate fuse rating based on load current and NEC rules",
      fields: [
        {
          name: "loadCurrent",
          label: "Load Current (A)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "loadType",
          label: "Load Type",
          type: "select",
          options: [
            { label: "Continuous Load (3+ hours)", value: "continuous" },
            { label: "Non-Continuous Load", value: "non-continuous" },
            { label: "Motor Load", value: "motor" },
          ],
          defaultValue: "continuous",
        },
        {
          name: "fuseType",
          label: "Fuse/Breaker Type",
          type: "select",
          options: [
            { label: "Standard (inverse-time breaker)", value: "standard" },
            { label: "Time-Delay Fuse (dual-element)", value: "time-delay" },
            { label: "Fast-Acting Fuse", value: "fast" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const loadA = inputs.loadCurrent as number;
        const loadType = inputs.loadType as string;
        const fuseType = inputs.fuseType as string;
        if (!loadA) return null;

        let multiplier: number;
        if (loadType === "continuous") {
          multiplier = 1.25; // NEC 210.20(A) - 125% for continuous loads
        } else if (loadType === "motor") {
          // NEC 430.52 - motor branch circuit protection
          if (fuseType === "time-delay") {
            multiplier = 1.75; // 175% for time-delay fuse
          } else if (fuseType === "fast") {
            multiplier = 3.0; // 300% for non-time-delay fuse
          } else {
            multiplier = 2.5; // 250% for inverse-time breaker
          }
        } else {
          multiplier = 1.0; // 100% for non-continuous
        }

        const minRating = loadA * multiplier;

        // Standard fuse/breaker sizes per NEC 240.6(A)
        const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
          110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600];

        let selectedSize = standardSizes[standardSizes.length - 1];
        for (const size of standardSizes) {
          if (size >= minRating) {
            selectedSize = size;
            break;
          }
        }

        // For non-motor continuous, NEC allows next standard size up if min rating doesn't match
        // For motor loads, NEC 430.52 allows next standard size if calculated value doesn't match

        // Recommended wire size for the fuse
        const wireForFuse: Record<number, string> = {
          15: "14 AWG", 20: "12 AWG", 25: "10 AWG", 30: "10 AWG",
          35: "8 AWG", 40: "8 AWG", 45: "6 AWG", 50: "6 AWG",
          60: "6 AWG", 70: "4 AWG", 80: "4 AWG", 90: "3 AWG",
          100: "3 AWG",
        };
        const wireSize = wireForFuse[selectedSize] || "See NEC Table 310.16";

        return {
          primary: {
            label: "Fuse/Breaker Size",
            value: `${selectedSize} A`,
          },
          details: [
            { label: "Selected Standard Size", value: `${selectedSize} A` },
            { label: "Minimum Rating Required", value: `${formatNumber(minRating, 2)} A` },
            { label: "Load Current", value: `${formatNumber(loadA, 2)} A` },
            { label: "Multiplier Applied", value: `${multiplier * 100}%` },
            { label: "Load Type", value: loadType === "continuous" ? "Continuous" : loadType === "motor" ? "Motor" : "Non-Continuous" },
            { label: "Min Wire Size (Cu, 75°C)", value: wireSize },
          ],
          note: loadType === "motor"
            ? "Motor fuse sizing per NEC 430.52. Motor overload protection sized separately per NEC 430.32."
            : "Per NEC 240.6(A) standard sizes. Wire must be sized for the fuse/breaker rating, not just the load.",
        };
      },
    },
    {
      id: "by-wire",
      name: "Max Fuse Size by Wire Gauge",
      description: "Maximum overcurrent protection for a given wire size",
      fields: [
        {
          name: "wireGauge",
          label: "Wire Gauge (AWG)",
          type: "select",
          options: [
            { label: "14 AWG", value: "14" },
            { label: "12 AWG", value: "12" },
            { label: "10 AWG", value: "10" },
            { label: "8 AWG", value: "8" },
            { label: "6 AWG", value: "6" },
            { label: "4 AWG", value: "4" },
            { label: "3 AWG", value: "3" },
            { label: "2 AWG", value: "2" },
            { label: "1 AWG", value: "1" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "-1" },
            { label: "3/0 AWG", value: "-2" },
            { label: "4/0 AWG", value: "-3" },
          ],
          defaultValue: "12",
        },
        {
          name: "material",
          label: "Conductor Material",
          type: "select",
          options: [
            { label: "Copper", value: "copper" },
            { label: "Aluminum", value: "aluminum" },
          ],
          defaultValue: "copper",
        },
        {
          name: "tempRating",
          label: "Insulation Temperature Rating",
          type: "select",
          options: [
            { label: "60°C", value: "60" },
            { label: "75°C", value: "75" },
            { label: "90°C", value: "90" },
          ],
          defaultValue: "75",
        },
      ],
      calculate: (inputs) => {
        const gauge = inputs.wireGauge as string;
        const material = inputs.material as string;
        const temp = inputs.tempRating as string;

        const copperAmp: Record<string, Record<string, number>> = {
          "14": { "60": 15, "75": 20, "90": 25 },
          "12": { "60": 20, "75": 25, "90": 30 },
          "10": { "60": 30, "75": 35, "90": 40 },
          "8": { "60": 40, "75": 50, "90": 55 },
          "6": { "60": 55, "75": 65, "90": 75 },
          "4": { "60": 70, "75": 85, "90": 95 },
          "3": { "60": 85, "75": 100, "90": 115 },
          "2": { "60": 95, "75": 115, "90": 130 },
          "1": { "60": 110, "75": 130, "90": 145 },
          "0": { "60": 125, "75": 150, "90": 170 },
          "-1": { "60": 145, "75": 175, "90": 195 },
          "-2": { "60": 165, "75": 200, "90": 225 },
          "-3": { "60": 195, "75": 230, "90": 260 },
        };

        const alAmp: Record<string, Record<string, number>> = {
          "12": { "60": 15, "75": 20, "90": 25 },
          "10": { "60": 25, "75": 30, "90": 35 },
          "8": { "60": 35, "75": 40, "90": 45 },
          "6": { "60": 40, "75": 50, "90": 55 },
          "4": { "60": 55, "75": 65, "90": 75 },
          "3": { "60": 65, "75": 75, "90": 85 },
          "2": { "60": 75, "75": 90, "90": 100 },
          "1": { "60": 85, "75": 100, "90": 115 },
          "0": { "60": 100, "75": 120, "90": 135 },
          "-1": { "60": 115, "75": 135, "90": 150 },
          "-2": { "60": 130, "75": 155, "90": 175 },
          "-3": { "60": 150, "75": 180, "90": 205 },
        };

        const table = material === "copper" ? copperAmp : alAmp;
        const ampacity = table[gauge]?.[temp];
        if (ampacity === undefined) return null;

        // NEC 240.4(D) - max OCPD for small conductors
        const maxOcpd: Record<string, number> = { "14": 15, "12": 20, "10": 30 };
        const necLimit = maxOcpd[gauge];

        const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
          110, 125, 150, 175, 200, 225, 250, 300, 350, 400];

        let maxFuse: number;
        if (necLimit) {
          maxFuse = necLimit;
        } else {
          // Next standard size up from ampacity
          maxFuse = standardSizes[standardSizes.length - 1];
          for (const s of standardSizes) {
            if (s >= ampacity) {
              maxFuse = s;
              break;
            }
          }
        }

        const maxContinuousLoad = maxFuse * 0.8;

        const gaugeLabel: Record<string, string> = {
          "0": "1/0", "-1": "2/0", "-2": "3/0", "-3": "4/0",
        };
        const displayGauge = gaugeLabel[gauge] || gauge;

        return {
          primary: {
            label: "Maximum Fuse/Breaker",
            value: `${maxFuse} A`,
          },
          details: [
            { label: "Max OCPD Size", value: `${maxFuse} A` },
            { label: "Wire Ampacity", value: `${ampacity} A` },
            { label: "Max Continuous Load", value: `${formatNumber(maxContinuousLoad, 0)} A` },
            { label: "Wire", value: `${displayGauge} AWG ${material}` },
            { label: "Insulation", value: `${temp}°C` },
            ...(necLimit ? [{ label: "NEC 240.4(D)", value: `${displayGauge} AWG limited to ${necLimit}A OCPD` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wire-ampacity-calculator", "wire-gauge-calculator", "electrical-load-calculator"],
  faq: [
    {
      question: "How do I size a fuse or circuit breaker?",
      answer:
        "For continuous loads: fuse ≥ 125% of load current. For non-continuous loads: fuse ≥ 100% of load current. For motors: varies by fuse type (175-300% of FLC per NEC 430.52). Always use the next standard size up per NEC 240.6(A).",
    },
    {
      question: "What is NEC 240.4(D)?",
      answer:
        "NEC 240.4(D) limits the maximum overcurrent protection for small conductors: 14 AWG = 15A, 12 AWG = 20A, 10 AWG = 30A. These are absolute maximums regardless of insulation rating or actual ampacity. Larger wires can use overcurrent protection up to their ampacity.",
    },
    {
      question: "What is the difference between fuses and circuit breakers?",
      answer:
        "Fuses are single-use devices that melt when overcurrent flows. They are faster-acting and less expensive. Circuit breakers are resettable switches that trip on overcurrent. They are more convenient but slightly slower. Both provide overcurrent protection per NEC Article 240.",
    },
  ],
  formula:
    "Continuous: Fuse ≥ 125% × Load | Non-Continuous: Fuse ≥ 100% × Load | Motor: Fuse varies by type (175-300% FLC) | NEC 240.6(A) standard sizes",
};
