import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hashRateCalculator: CalculatorDefinition = {
  slug: "hash-rate-converter",
  title: "Hash Rate Converter",
  description:
    "Free hash rate converter. Convert between hash rate units including H/s, KH/s, MH/s, GH/s, TH/s, PH/s, and EH/s.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hash rate", "converter", "mining", "H/s", "TH/s", "GH/s", "MH/s", "PH/s"],
  variants: [
    {
      id: "convert",
      name: "Hash Rate Conversion",
      fields: [
        { name: "value", label: "Hash Rate Value", type: "number", placeholder: "e.g. 100" },
        {
          name: "fromUnit",
          label: "From Unit",
          type: "select",
          options: [
            { label: "H/s", value: "1" },
            { label: "KH/s", value: "1000" },
            { label: "MH/s", value: "1000000" },
            { label: "GH/s", value: "1000000000" },
            { label: "TH/s", value: "1000000000000" },
            { label: "PH/s", value: "1000000000000000" },
            { label: "EH/s", value: "1000000000000000000" },
          ],
          defaultValue: "1000000000000",
        },
        {
          name: "toUnit",
          label: "To Unit",
          type: "select",
          options: [
            { label: "H/s", value: "1" },
            { label: "KH/s", value: "1000" },
            { label: "MH/s", value: "1000000" },
            { label: "GH/s", value: "1000000000" },
            { label: "TH/s", value: "1000000000000" },
            { label: "PH/s", value: "1000000000000000" },
            { label: "EH/s", value: "1000000000000000000" },
          ],
          defaultValue: "1000000000",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const fromUnit = Number(inputs.fromUnit);
        const toUnit = Number(inputs.toUnit);

        if (!value || !fromUnit || !toUnit) return null;

        const baseValue = value * fromUnit;
        const result = baseValue / toUnit;

        const unitNames: Record<string, string> = {
          "1": "H/s",
          "1000": "KH/s",
          "1000000": "MH/s",
          "1000000000": "GH/s",
          "1000000000000": "TH/s",
          "1000000000000000": "PH/s",
          "1000000000000000000": "EH/s",
        };

        return {
          primary: { label: "Converted Hash Rate", value: `${formatNumber(result, 6)} ${unitNames[String(toUnit)] || ""}` },
          details: [
            { label: "Input", value: `${formatNumber(value, 6)} ${unitNames[String(fromUnit)] || ""}` },
            { label: "H/s", value: formatNumber(baseValue, 0) },
            { label: "KH/s", value: formatNumber(baseValue / 1e3, 6) },
            { label: "MH/s", value: formatNumber(baseValue / 1e6, 6) },
            { label: "GH/s", value: formatNumber(baseValue / 1e9, 6) },
            { label: "TH/s", value: formatNumber(baseValue / 1e12, 6) },
          ],
        };
      },
    },
    {
      id: "miningPower",
      name: "Mining Power Estimation",
      fields: [
        { name: "numMiners", label: "Number of Miners", type: "number", placeholder: "e.g. 10" },
        { name: "hashPerMiner", label: "Hash Rate per Miner", type: "number", placeholder: "e.g. 110" },
        {
          name: "unit",
          label: "Hash Rate Unit",
          type: "select",
          options: [
            { label: "MH/s", value: "1000000" },
            { label: "GH/s", value: "1000000000" },
            { label: "TH/s", value: "1000000000000" },
          ],
          defaultValue: "1000000000000",
        },
      ],
      calculate: (inputs) => {
        const numMiners = inputs.numMiners as number;
        const hashPerMiner = inputs.hashPerMiner as number;
        const unit = Number(inputs.unit);

        if (!numMiners || !hashPerMiner || !unit) return null;

        const totalHashBase = numMiners * hashPerMiner * unit;

        return {
          primary: { label: "Total Hash Rate", value: `${formatNumber(numMiners * hashPerMiner, 2)} ${unit === 1e12 ? "TH/s" : unit === 1e9 ? "GH/s" : "MH/s"}` },
          details: [
            { label: "Number of Miners", value: formatNumber(numMiners, 0) },
            { label: "Per Miner", value: `${formatNumber(hashPerMiner, 2)} ${unit === 1e12 ? "TH/s" : unit === 1e9 ? "GH/s" : "MH/s"}` },
            { label: "Total in TH/s", value: formatNumber(totalHashBase / 1e12, 6) },
            { label: "Total in PH/s", value: formatNumber(totalHashBase / 1e15, 6) },
            { label: "Total in EH/s", value: formatNumber(totalHashBase / 1e18, 9) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["crypto-mining-profit-calculator", "crypto-profit-calculator", "data-storage-calculator"],
  faq: [
    { question: "What is hash rate?", answer: "Hash rate measures the computational power used for cryptocurrency mining. It represents the number of hash calculations a miner can perform per second." },
    { question: "What are the hash rate units?", answer: "H/s (hashes per second), KH/s (kilo, 10^3), MH/s (mega, 10^6), GH/s (giga, 10^9), TH/s (tera, 10^12), PH/s (peta, 10^15), EH/s (exa, 10^18)." },
    { question: "Why does hash rate matter?", answer: "Higher hash rate means more computational power, which increases the probability of finding the next block and earning mining rewards. Network hash rate also determines mining difficulty." },
  ],
  formula: "Conversion: value x from_unit / to_unit; 1 TH/s = 1,000 GH/s = 1,000,000 MH/s",
};
