import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wireAmpacityCalculator: CalculatorDefinition = {
  slug: "wire-ampacity-calculator",
  title: "Wire Ampacity Calculator",
  description:
    "Free wire ampacity calculator. Find the maximum current capacity for copper and aluminum conductors based on NEC ampacity tables and temperature ratings.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "wire ampacity",
    "ampacity calculator",
    "wire current capacity",
    "NEC ampacity",
    "conductor sizing",
    "wire current rating",
  ],
  variants: [
    {
      id: "by-gauge",
      name: "Ampacity by Wire Gauge",
      description: "Look up ampacity for standard wire gauges per NEC Table 310.16",
      fields: [
        {
          name: "gauge",
          label: "Wire Gauge (AWG/kcmil)",
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
            { label: "60°C (TW, UF)", value: "60" },
            { label: "75°C (THW, THWN, XHHW)", value: "75" },
            { label: "90°C (THHN, XHHW-2)", value: "90" },
          ],
          defaultValue: "75",
        },
      ],
      calculate: (inputs) => {
        const gauge = inputs.gauge as string;
        const material = inputs.material as string;
        const temp = inputs.tempRating as string;

        // NEC 310.16 Ampacity Table (simplified)
        const copperAmpacity: Record<string, Record<string, number>> = {
          "14":  { "60": 15, "75": 20, "90": 25 },
          "12":  { "60": 20, "75": 25, "90": 30 },
          "10":  { "60": 30, "75": 35, "90": 40 },
          "8":   { "60": 40, "75": 50, "90": 55 },
          "6":   { "60": 55, "75": 65, "90": 75 },
          "4":   { "60": 70, "75": 85, "90": 95 },
          "3":   { "60": 85, "75": 100, "90": 115 },
          "2":   { "60": 95, "75": 115, "90": 130 },
          "1":   { "60": 110, "75": 130, "90": 145 },
          "0":   { "60": 125, "75": 150, "90": 170 },
          "-1":  { "60": 145, "75": 175, "90": 195 },
          "-2":  { "60": 165, "75": 200, "90": 225 },
          "-3":  { "60": 195, "75": 230, "90": 260 },
        };

        const aluminumAmpacity: Record<string, Record<string, number>> = {
          "14":  { "60": 0, "75": 0, "90": 0 },
          "12":  { "60": 15, "75": 20, "90": 25 },
          "10":  { "60": 25, "75": 30, "90": 35 },
          "8":   { "60": 35, "75": 40, "90": 45 },
          "6":   { "60": 40, "75": 50, "90": 55 },
          "4":   { "60": 55, "75": 65, "90": 75 },
          "3":   { "60": 65, "75": 75, "90": 85 },
          "2":   { "60": 75, "75": 90, "90": 100 },
          "1":   { "60": 85, "75": 100, "90": 115 },
          "0":   { "60": 100, "75": 120, "90": 135 },
          "-1":  { "60": 115, "75": 135, "90": 150 },
          "-2":  { "60": 130, "75": 155, "90": 175 },
          "-3":  { "60": 150, "75": 180, "90": 205 },
        };

        const table = material === "copper" ? copperAmpacity : aluminumAmpacity;
        const ampacity = table[gauge]?.[temp];
        if (ampacity === undefined) return null;

        // Wire cross-section area
        const gaugeNum = Number(gauge);
        const areaCmil = gaugeNum >= 1
          ? Math.round(Math.pow(92, (36 - gaugeNum) / 19.5) * 1000) / 1000
          : Math.round(Math.pow(92, (36 - gaugeNum) / 19.5) * 1000) / 1000;
        const areaMm2 = areaCmil * 0.0005067;

        const gaugeLabel: Record<string, string> = {
          "0": "1/0", "-1": "2/0", "-2": "3/0", "-3": "4/0",
        };
        const displayGauge = gaugeLabel[gauge] || gauge;

        // 80% NEC rule for continuous loads
        const continuousAmp = ampacity * 0.8;

        return {
          primary: {
            label: "Ampacity",
            value: ampacity === 0 ? "Not Permitted" : `${ampacity} A`,
          },
          details: [
            { label: "Max Ampacity", value: `${ampacity} A` },
            { label: "80% (Continuous Load)", value: `${formatNumber(continuousAmp, 0)} A` },
            { label: "Wire Gauge", value: `${displayGauge} AWG` },
            { label: "Material", value: material === "copper" ? "Copper" : "Aluminum" },
            { label: "Insulation Rating", value: `${temp}°C` },
            { label: "Cross-Section", value: `~${formatNumber(areaMm2, 2)} mm²` },
          ],
          note: "Based on NEC Table 310.16. For continuous loads, use 80% of the rated ampacity per NEC 210.20(A).",
        };
      },
    },
    {
      id: "by-current",
      name: "Wire Size for Current",
      description: "Find the minimum wire gauge for a given current",
      fields: [
        {
          name: "current",
          label: "Required Current (A)",
          type: "number",
          placeholder: "e.g. 30",
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
            { label: "60°C (TW, UF)", value: "60" },
            { label: "75°C (THW, THWN, XHHW)", value: "75" },
            { label: "90°C (THHN, XHHW-2)", value: "90" },
          ],
          defaultValue: "75",
        },
        {
          name: "continuous",
          label: "Load Type",
          type: "select",
          options: [
            { label: "Continuous (3+ hours)", value: "continuous" },
            { label: "Non-Continuous", value: "non-continuous" },
          ],
          defaultValue: "continuous",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number;
        const material = inputs.material as string;
        const temp = inputs.tempRating as string;
        const loadType = inputs.continuous as string;
        if (!current) return null;

        const requiredAmpacity = loadType === "continuous" ? current / 0.8 : current;

        const copperAmpacity: Record<string, number> = {
          "14": temp === "60" ? 15 : temp === "75" ? 20 : 25,
          "12": temp === "60" ? 20 : temp === "75" ? 25 : 30,
          "10": temp === "60" ? 30 : temp === "75" ? 35 : 40,
          "8": temp === "60" ? 40 : temp === "75" ? 50 : 55,
          "6": temp === "60" ? 55 : temp === "75" ? 65 : 75,
          "4": temp === "60" ? 70 : temp === "75" ? 85 : 95,
          "3": temp === "60" ? 85 : temp === "75" ? 100 : 115,
          "2": temp === "60" ? 95 : temp === "75" ? 115 : 130,
          "1": temp === "60" ? 110 : temp === "75" ? 130 : 145,
          "1/0": temp === "60" ? 125 : temp === "75" ? 150 : 170,
          "2/0": temp === "60" ? 145 : temp === "75" ? 175 : 195,
          "3/0": temp === "60" ? 165 : temp === "75" ? 200 : 225,
          "4/0": temp === "60" ? 195 : temp === "75" ? 230 : 260,
        };

        const aluminumAmpacity: Record<string, number> = {
          "12": temp === "60" ? 15 : temp === "75" ? 20 : 25,
          "10": temp === "60" ? 25 : temp === "75" ? 30 : 35,
          "8": temp === "60" ? 35 : temp === "75" ? 40 : 45,
          "6": temp === "60" ? 40 : temp === "75" ? 50 : 55,
          "4": temp === "60" ? 55 : temp === "75" ? 65 : 75,
          "3": temp === "60" ? 65 : temp === "75" ? 75 : 85,
          "2": temp === "60" ? 75 : temp === "75" ? 90 : 100,
          "1": temp === "60" ? 85 : temp === "75" ? 100 : 115,
          "1/0": temp === "60" ? 100 : temp === "75" ? 120 : 135,
          "2/0": temp === "60" ? 115 : temp === "75" ? 135 : 150,
          "3/0": temp === "60" ? 130 : temp === "75" ? 155 : 175,
          "4/0": temp === "60" ? 150 : temp === "75" ? 180 : 205,
        };

        const table = material === "copper" ? copperAmpacity : aluminumAmpacity;
        const gauges = Object.keys(table);

        let selectedGauge = "4/0";
        let selectedAmpacity = table["4/0"];
        for (const g of gauges) {
          if (table[g] >= requiredAmpacity) {
            selectedGauge = g;
            selectedAmpacity = table[g];
          }
        }

        // Find smallest wire that meets requirement
        const orderedGauges = material === "copper"
          ? ["14", "12", "10", "8", "6", "4", "3", "2", "1", "1/0", "2/0", "3/0", "4/0"]
          : ["12", "10", "8", "6", "4", "3", "2", "1", "1/0", "2/0", "3/0", "4/0"];

        let minGauge = orderedGauges[orderedGauges.length - 1];
        let minAmpacity = table[minGauge];
        for (const g of orderedGauges) {
          if (table[g] >= requiredAmpacity) {
            minGauge = g;
            minAmpacity = table[g];
            break;
          }
        }

        if (minAmpacity < requiredAmpacity) {
          return {
            primary: { label: "Error", value: "Current exceeds 4/0 AWG capacity. Use larger conductors." },
            details: [],
          };
        }

        return {
          primary: {
            label: "Minimum Wire Size",
            value: `${minGauge} AWG`,
          },
          details: [
            { label: "Wire Gauge", value: `${minGauge} AWG` },
            { label: "Wire Ampacity", value: `${minAmpacity} A` },
            { label: "Required Current", value: `${formatNumber(current, 2)} A` },
            { label: "Required Ampacity", value: `${formatNumber(requiredAmpacity, 2)} A` },
            { label: "Load Type", value: loadType === "continuous" ? "Continuous (80% rule)" : "Non-Continuous" },
            { label: "Material", value: material === "copper" ? "Copper" : "Aluminum" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wire-gauge-calculator", "voltage-drop-calculator", "fuse-sizing-calculator"],
  faq: [
    {
      question: "What is wire ampacity?",
      answer:
        "Ampacity is the maximum current a conductor can carry continuously without exceeding its temperature rating. It depends on conductor size, material (copper or aluminum), insulation temperature rating, and installation conditions. NEC Table 310.16 is the primary reference.",
    },
    {
      question: "What is the 80% rule for continuous loads?",
      answer:
        "Per NEC 210.20(A), conductors for continuous loads (operating 3+ hours) must be rated at 125% of the continuous load current, which means you can only use 80% of the conductor's ampacity. For example, a 20A circuit can only serve a 16A continuous load.",
    },
    {
      question: "When should I use aluminum vs. copper wire?",
      answer:
        "Copper has higher ampacity and is more common for branch circuits. Aluminum is lighter and less expensive, making it preferred for large feeders and service entrance conductors (4 AWG and larger). Aluminum requires anti-oxidant compound and compatible connectors.",
    },
  ],
  formula:
    "Ampacity from NEC Table 310.16 | Continuous load: Wire ampacity ≥ 125% × load current | Derating for conduit fill and ambient temperature may apply",
};
