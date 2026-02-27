import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledUpgradeRoiCalculator: CalculatorDefinition = {
  slug: "led-upgrade-roi-calculator",
  title: "LED Lighting Upgrade ROI Calculator",
  description:
    "Calculate the return on investment of upgrading to LED lighting. Compare energy costs, bulb lifespan, and total savings of LEDs vs incandescent or CFL bulbs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "led upgrade roi",
    "led savings",
    "led vs incandescent",
    "lighting upgrade",
    "led bulb savings",
    "energy efficient lighting",
  ],
  variants: [
    {
      id: "wholehouse",
      name: "Whole House LED Upgrade",
      description: "Calculate savings from replacing all bulbs with LEDs",
      fields: [
        { name: "totalBulbs", label: "Total Bulbs to Replace", type: "number", placeholder: "e.g. 30" },
        {
          name: "currentType",
          label: "Current Bulb Type",
          type: "select",
          options: [
            { label: "Incandescent (60W)", value: "60" },
            { label: "Halogen (43W)", value: "43" },
            { label: "CFL (13W)", value: "13" },
          ],
          defaultValue: "60",
        },
        { name: "ledWattage", label: "LED Replacement Wattage", type: "number", placeholder: "e.g. 9" },
        { name: "hoursPerDay", label: "Average Hours On per Day", type: "number", placeholder: "e.g. 5" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
        { name: "ledCostPerBulb", label: "LED Bulb Cost ($)", type: "number", placeholder: "e.g. 3", step: 0.5 },
        { name: "oldBulbCost", label: "Old Bulb Replacement Cost ($)", type: "number", placeholder: "e.g. 1", step: 0.5 },
      ],
      calculate: (inputs) => {
        const totalBulbs = parseFloat(inputs.totalBulbs as string);
        const currentWattage = parseFloat(inputs.currentType as string);
        const ledWattage = parseFloat(inputs.ledWattage as string);
        const hoursPerDay = parseFloat(inputs.hoursPerDay as string);
        const electricityRate = parseFloat(inputs.electricityRate as string);
        const ledCost = parseFloat(inputs.ledCostPerBulb as string);
        const oldBulbCost = parseFloat(inputs.oldBulbCost as string) || 1;

        if (!totalBulbs || !currentWattage || !ledWattage || !hoursPerDay || !electricityRate || !ledCost) return null;

        const annualHours = hoursPerDay * 365;
        const oldAnnualKwh = (currentWattage * totalBulbs * annualHours) / 1000;
        const ledAnnualKwh = (ledWattage * totalBulbs * annualHours) / 1000;
        const kwhSaved = oldAnnualKwh - ledAnnualKwh;
        const annualSavings = kwhSaved * electricityRate;

        const ledLifeHours = 25000;
        const oldLifeHours = currentWattage >= 40 ? 1000 : 8000;
        const yearsLedLasts = ledLifeHours / annualHours;
        const oldReplacementsPerYear = annualHours / oldLifeHours;

        const totalLedCost = ledCost * totalBulbs;
        const annualOldBulbCost = oldReplacementsPerYear * oldBulbCost * totalBulbs;
        const totalAnnualSavings = annualSavings + annualOldBulbCost;
        const paybackMonths = totalAnnualSavings > 0 ? (totalLedCost / totalAnnualSavings) * 12 : 0;
        const tenYearSavings = totalAnnualSavings * 10 - totalLedCost;

        return {
          primary: {
            label: "Annual Savings",
            value: `$${formatNumber(totalAnnualSavings, 2)}`,
          },
          details: [
            { label: "Energy Savings per Year", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "Bulb Replacement Savings/yr", value: `$${formatNumber(annualOldBulbCost, 2)}` },
            { label: "kWh Saved per Year", value: formatNumber(kwhSaved, 0) },
            { label: "Total LED Investment", value: `$${formatNumber(totalLedCost, 2)}` },
            { label: "Payback Period", value: `${formatNumber(paybackMonths, 1)} months` },
            { label: "LED Lifespan", value: `${formatNumber(yearsLedLasts, 1)} years` },
            { label: "10-Year Net Savings", value: `$${formatNumber(tenYearSavings, 2)}` },
            { label: "CO₂ Reduced/yr", value: `${formatNumber(kwhSaved * 0.86, 0)} lbs` },
          ],
          note: `LEDs use ${formatNumber(((currentWattage - ledWattage) / currentWattage) * 100, 0)}% less energy and last ${formatNumber(ledLifeHours / oldLifeHours, 0)}x longer than your current bulbs.`,
        };
      },
    },
    {
      id: "singleBulb",
      name: "Single Bulb Comparison",
      fields: [
        { name: "oldWattage", label: "Current Bulb Wattage", type: "number", placeholder: "e.g. 60" },
        { name: "ledWattage", label: "LED Replacement Wattage", type: "number", placeholder: "e.g. 9" },
        { name: "hoursPerDay", label: "Hours On per Day", type: "number", placeholder: "e.g. 5" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
      ],
      calculate: (inputs) => {
        const old = parseFloat(inputs.oldWattage as string);
        const led = parseFloat(inputs.ledWattage as string);
        const hours = parseFloat(inputs.hoursPerDay as string);
        const rate = parseFloat(inputs.electricityRate as string);

        if (!old || !led || !hours || !rate) return null;

        const annualHours = hours * 365;
        const savedKwh = ((old - led) * annualHours) / 1000;
        const savedDollars = savedKwh * rate;

        return {
          primary: { label: "Annual Savings per Bulb", value: `$${formatNumber(savedDollars, 2)}` },
          details: [
            { label: "kWh Saved per Year", value: formatNumber(savedKwh, 1) },
            { label: "Wattage Reduction", value: `${formatNumber(old - led, 0)}W (${formatNumber(((old - led) / old) * 100, 0)}%)` },
            { label: "LED Lifespan", value: `${formatNumber(25000 / annualHours, 1)} years` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-energy-score-calculator", "smart-thermostat-savings-calculator", "energy-rebate-calculator"],
  faq: [
    {
      question: "How much can I save by switching to LED bulbs?",
      answer:
        "A typical household with 30 bulbs switching from incandescent to LED saves $150-$300 per year on electricity plus $30-$50 in bulb replacement costs. LEDs use 75-80% less energy and last 25 times longer than incandescent bulbs. The investment pays for itself in 3-6 months.",
    },
    {
      question: "Are LED bulbs worth the higher upfront cost?",
      answer:
        "Absolutely. While an LED costs $2-$5 vs $1 for an incandescent, it lasts 25,000 hours vs 1,000 hours and uses 80% less electricity. Over its lifetime, a single LED saves $80-$150 in energy and replacement costs. LED prices have dropped 90% in the last decade.",
    },
  ],
  formula:
    "kWh Saved = (Old Watts − LED Watts) × Bulbs × Annual Hours / 1000; Energy Savings = kWh × Rate; Replacement Savings = (Annual Hours / Old Lifespan) × Old Bulb Cost × Bulbs; Payback = LED Cost / (Energy + Replacement Savings)",
};
