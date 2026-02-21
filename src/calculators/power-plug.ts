import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerPlugCalculator: CalculatorDefinition = {
  slug: "power-plug-calculator",
  title: "Power Plug & Voltage by Country Calculator",
  description:
    "Free power plug and voltage checker by country. Find out what plug adapter and voltage converter you need for international travel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "power plug adapter",
    "voltage converter",
    "travel adapter",
    "plug type by country",
    "electrical outlet abroad",
  ],
  variants: [
    {
      id: "check",
      name: "Check Power Requirements",
      description: "Find plug type and voltage for your destination",
      fields: [
        {
          name: "homeCountry",
          label: "Home Country/Region",
          type: "select",
          options: [
            { label: "USA / Canada (Type A/B, 120V)", value: "us" },
            { label: "UK / Ireland (Type G, 230V)", value: "uk" },
            { label: "Europe - Continental (Type C/E/F, 230V)", value: "eu" },
            { label: "Australia / NZ (Type I, 230V)", value: "au" },
            { label: "China (Type A/C/I, 220V)", value: "cn" },
            { label: "Japan (Type A/B, 100V)", value: "jp" },
            { label: "India (Type C/D/M, 230V)", value: "in" },
            { label: "Brazil (Type N, 127/220V)", value: "br" },
          ],
          defaultValue: "us",
        },
        {
          name: "destination",
          label: "Destination Country/Region",
          type: "select",
          options: [
            { label: "USA / Canada (Type A/B, 120V)", value: "us" },
            { label: "UK / Ireland (Type G, 230V)", value: "uk" },
            { label: "Europe - Continental (Type C/E/F, 230V)", value: "eu" },
            { label: "Australia / NZ (Type I, 230V)", value: "au" },
            { label: "China (Type A/C/I, 220V)", value: "cn" },
            { label: "Japan (Type A/B, 100V)", value: "jp" },
            { label: "India (Type C/D/M, 230V)", value: "in" },
            { label: "Brazil (Type N, 127/220V)", value: "br" },
            { label: "Thailand (Type A/B/C, 220V)", value: "th" },
            { label: "South Korea (Type C/F, 220V)", value: "kr" },
            { label: "South Africa (Type M/N, 230V)", value: "za" },
            { label: "Israel (Type H/C, 230V)", value: "il" },
          ],
          defaultValue: "uk",
        },
      ],
      calculate: (inputs) => {
        const homeCountry = inputs.homeCountry as string;
        const destination = inputs.destination as string;

        const countryData: Record<string, { voltage: number; frequency: number; plugTypes: string; plugDesc: string }> = {
          us: { voltage: 120, frequency: 60, plugTypes: "A, B", plugDesc: "Flat 2-pin / 3-pin" },
          uk: { voltage: 230, frequency: 50, plugTypes: "G", plugDesc: "3 rectangular pins" },
          eu: { voltage: 230, frequency: 50, plugTypes: "C, E, F", plugDesc: "2 round pins" },
          au: { voltage: 230, frequency: 50, plugTypes: "I", plugDesc: "Angled flat pins" },
          cn: { voltage: 220, frequency: 50, plugTypes: "A, C, I", plugDesc: "Mixed (US/EU/AU)" },
          jp: { voltage: 100, frequency: 50, plugTypes: "A, B", plugDesc: "Flat 2-pin (same as US)" },
          in: { voltage: 230, frequency: 50, plugTypes: "C, D, M", plugDesc: "Round pins (various sizes)" },
          br: { voltage: 127, frequency: 60, plugTypes: "N", plugDesc: "3 round pins" },
          th: { voltage: 220, frequency: 50, plugTypes: "A, B, C", plugDesc: "Mixed flat/round" },
          kr: { voltage: 220, frequency: 60, plugTypes: "C, F", plugDesc: "2 round pins" },
          za: { voltage: 230, frequency: 50, plugTypes: "M, N", plugDesc: "3 large round pins" },
          il: { voltage: 230, frequency: 50, plugTypes: "H, C", plugDesc: "3 pins (V-shape)" },
        };

        const home = countryData[homeCountry];
        const dest = countryData[destination];
        if (!home || !dest) return null;

        const needsAdapter = home.plugTypes !== dest.plugTypes;
        const voltageDiff = Math.abs(home.voltage - dest.voltage);
        const needsConverter = voltageDiff > 20;
        const sameFrequency = home.frequency === dest.frequency;

        const dualVoltageNote = "Most modern phone chargers, laptops, and camera chargers are dual-voltage (100-240V) and only need a plug adapter, not a voltage converter.";

        return {
          primary: {
            label: needsAdapter ? "Adapter Needed" : "No Adapter Needed",
            value: needsConverter ? "Adapter + Converter Required" : needsAdapter ? "Plug Adapter Only" : "Compatible",
          },
          details: [
            { label: "Home voltage", value: `${home.voltage}V / ${home.frequency}Hz` },
            { label: "Home plug type(s)", value: `Type ${home.plugTypes} (${home.plugDesc})` },
            { label: "Destination voltage", value: `${dest.voltage}V / ${dest.frequency}Hz` },
            { label: "Destination plug type(s)", value: `Type ${dest.plugTypes} (${dest.plugDesc})` },
            { label: "Voltage difference", value: `${voltageDiff}V` },
            { label: "Plug adapter needed?", value: needsAdapter ? "Yes" : "No" },
            { label: "Voltage converter needed?", value: needsConverter ? "Yes (for non-dual-voltage devices)" : "No" },
            { label: "Frequency compatible?", value: sameFrequency ? "Yes" : `No (${home.frequency}Hz vs ${dest.frequency}Hz)` },
          ],
          note: needsConverter
            ? `The voltage difference is ${voltageDiff}V. ${dualVoltageNote} For hair dryers, curling irons, and other heat appliances, you WILL need a voltage converter or should buy locally.`
            : needsAdapter
            ? `You only need a plug adapter (no voltage converter). ${dualVoltageNote}`
            : "Your plugs and voltage are compatible with your destination. No adapter or converter needed.",
        };
      },
    },
    {
      id: "devices",
      name: "Check Device Compatibility",
      description: "Check if your devices need a voltage converter",
      fields: [
        {
          name: "deviceVoltage",
          label: "Device Input Voltage",
          type: "select",
          options: [
            { label: "100-240V (dual voltage - most chargers)", value: "dual" },
            { label: "100-120V only (US/Japan devices)", value: "120" },
            { label: "220-240V only (EU/UK devices)", value: "240" },
          ],
          defaultValue: "dual",
        },
        {
          name: "deviceWatts",
          label: "Device Wattage",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "destinationVoltage",
          label: "Destination Voltage",
          type: "select",
          options: [
            { label: "100V (Japan)", value: "100" },
            { label: "120V (USA/Canada)", value: "120" },
            { label: "220V (China/Thailand/Korea)", value: "220" },
            { label: "230V (Europe/UK/Australia)", value: "230" },
            { label: "240V (Parts of Africa/Asia)", value: "240" },
          ],
          defaultValue: "230",
        },
      ],
      calculate: (inputs) => {
        const deviceVoltage = inputs.deviceVoltage as string;
        const deviceWatts = (inputs.deviceWatts as number) || 65;
        const destVoltage = parseInt(inputs.destinationVoltage as string);
        if (!destVoltage) return null;

        const isDualVoltage = deviceVoltage === "dual";
        const isCompatible = isDualVoltage ||
          (deviceVoltage === "120" && (destVoltage >= 100 && destVoltage <= 127)) ||
          (deviceVoltage === "240" && (destVoltage >= 220 && destVoltage <= 240));

        const converterSize = deviceWatts < 100 ? "Small (up to 200W)" :
          deviceWatts < 500 ? "Medium (up to 1000W)" : "Large (1000W+, heavy)";
        const converterCost = deviceWatts < 100 ? 25 : deviceWatts < 500 ? 50 : 100;

        return {
          primary: {
            label: isCompatible ? "Compatible" : "Converter Needed",
            value: isCompatible ? "Safe to use with adapter" : `Need ${converterSize} converter`,
          },
          details: [
            { label: "Device voltage", value: isDualVoltage ? "100-240V (universal)" : `${deviceVoltage}V only` },
            { label: "Device wattage", value: `${deviceWatts}W` },
            { label: "Destination voltage", value: `${destVoltage}V` },
            { label: "Compatible?", value: isCompatible ? "Yes" : "No" },
            { label: "Converter needed?", value: isCompatible ? "No" : "Yes" },
            { label: "Converter size (if needed)", value: !isCompatible ? converterSize : "N/A" },
            { label: "Est. converter cost", value: !isCompatible ? `$${converterCost}` : "N/A" },
          ],
          note: isCompatible
            ? "Your device is compatible with the destination voltage. You only need a plug adapter to fit the outlet shape."
            : `Your device is NOT compatible with ${destVoltage}V power. Using it without a converter will damage or destroy the device. Consider buying a travel version of the device or purchasing one at your destination.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-checklist-calculator", "travel-packing-calculator"],
  faq: [
    {
      question: "Do I need a voltage converter or just a plug adapter?",
      answer:
        "Check the label on your device or charger. If it says 'Input: 100-240V,' you only need a plug adapter. If it says '120V' only and you're going to a 220-240V country, you need a voltage converter. Most modern electronics (laptops, phones, cameras) are dual-voltage.",
    },
    {
      question: "What devices need a voltage converter?",
      answer:
        "Hair dryers, curling irons, flat irons, electric razors (older models), and some older electronics often need converters. These heat-producing devices are usually NOT dual-voltage. It's often cheaper and easier to buy a local version at your destination.",
    },
    {
      question: "What is the best universal travel adapter?",
      answer:
        "Look for a universal adapter that covers Types A, B, C, G, and I (covers 95% of countries). Good options include built-in USB ports for charging phones/tablets without a separate charger. Avoid cheap adapters; invest in one with surge protection.",
    },
  ],
  formula:
    "Compatibility = device voltage range includes destination voltage; Converter wattage must exceed device wattage by 25% for safety.",
};
