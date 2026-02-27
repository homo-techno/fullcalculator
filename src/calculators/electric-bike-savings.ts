import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricBikeSavingsCalculator: CalculatorDefinition = {
  slug: "electric-bike-savings-calculator",
  title: "E-Bike vs Car Commute Savings Calculator",
  description:
    "Calculate how much you can save by replacing car trips with an electric bike. Compare costs including purchase price, fuel, maintenance, parking, and insurance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ebike savings",
    "electric bike cost",
    "ebike vs car",
    "bike commute savings",
    "ebike commuter",
    "transportation savings",
  ],
  variants: [
    {
      id: "commute",
      name: "Commute Comparison",
      description: "Compare daily commute costs between e-bike and car",
      fields: [
        { name: "commuteDistance", label: "One-Way Commute Distance (miles)", type: "number", placeholder: "e.g. 8" },
        { name: "workDays", label: "Work Days per Year", type: "number", placeholder: "e.g. 250" },
        { name: "ebikeCost", label: "E-Bike Purchase Price ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "ebikeLifespan", label: "E-Bike Lifespan (years)", type: "number", placeholder: "e.g. 5" },
        { name: "carMpg", label: "Car Fuel Economy (MPG)", type: "number", placeholder: "e.g. 28" },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", step: 0.01 },
        { name: "carInsurance", label: "Monthly Car Insurance ($)", type: "number", placeholder: "e.g. 150" },
        { name: "parkingCost", label: "Monthly Parking Cost ($)", type: "number", placeholder: "e.g. 100" },
        { name: "carMaintenance", label: "Annual Car Maintenance ($)", type: "number", placeholder: "e.g. 1200" },
        { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", placeholder: "e.g. 0.13", step: 0.01 },
      ],
      calculate: (inputs) => {
        const commuteDistance = parseFloat(inputs.commuteDistance as string);
        const workDays = parseFloat(inputs.workDays as string);
        const ebikeCost = parseFloat(inputs.ebikeCost as string);
        const ebikeLifespan = parseFloat(inputs.ebikeLifespan as string);
        const carMpg = parseFloat(inputs.carMpg as string);
        const gasPrice = parseFloat(inputs.gasPrice as string);
        const carInsurance = parseFloat(inputs.carInsurance as string) || 0;
        const parkingCost = parseFloat(inputs.parkingCost as string) || 0;
        const carMaintenance = parseFloat(inputs.carMaintenance as string) || 0;
        const electricityRate = parseFloat(inputs.electricityRate as string) || 0.13;

        if (!commuteDistance || !workDays || !ebikeCost || !ebikeLifespan || !carMpg || !gasPrice) return null;

        const dailyMiles = commuteDistance * 2;
        const annualMiles = dailyMiles * workDays;

        const carFuelCost = (annualMiles / carMpg) * gasPrice;
        const carInsuranceAnnual = carInsurance * 12;
        const carParkingAnnual = parkingCost * 12;
        const carDepreciation = annualMiles * 0.10;
        const totalCarAnnual = carFuelCost + carInsuranceAnnual + carParkingAnnual + carMaintenance + carDepreciation;

        const ebikeWhPerMile = 20;
        const ebikeElectricityCost = (annualMiles * ebikeWhPerMile / 1000) * electricityRate;
        const ebikeMaintenance = 200;
        const ebikeBatteryReplace = 500 / ebikeLifespan;
        const ebikeAnnualCost = (ebikeCost / ebikeLifespan) + ebikeElectricityCost + ebikeMaintenance + ebikeBatteryReplace;

        const annualSavings = totalCarAnnual - ebikeAnnualCost;
        const monthlySavings = annualSavings / 12;
        const paybackMonths = ebikeCost / (annualSavings / 12);
        const co2Saved = annualMiles * 0.000404 * 2204.6;

        return {
          primary: {
            label: "Annual Savings with E-Bike",
            value: `$${formatNumber(annualSavings, 2)}`,
          },
          details: [
            { label: "Annual Car Cost (commute)", value: `$${formatNumber(totalCarAnnual, 2)}` },
            { label: "Annual E-Bike Cost", value: `$${formatNumber(ebikeAnnualCost, 2)}` },
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "E-Bike Payback", value: `${formatNumber(paybackMonths, 1)} months` },
            { label: "Car Fuel Cost/yr", value: `$${formatNumber(carFuelCost, 2)}` },
            { label: "E-Bike Electricity/yr", value: `$${formatNumber(ebikeElectricityCost, 2)}` },
            { label: "Annual Commute Miles", value: formatNumber(annualMiles, 0) },
            { label: "CO₂ Saved per Year", value: `${formatNumber(co2Saved, 0)} lbs` },
          ],
          note: `E-bikes cost about $${formatNumber(ebikeElectricityCost / annualMiles * 100, 1)} cents/mile vs $${formatNumber((carFuelCost / annualMiles) * 100, 1)} cents/mile for gas. Health and parking benefits not fully quantified.`,
        };
      },
    },
    {
      id: "quick",
      name: "Quick Savings Estimate",
      fields: [
        { name: "milesReplaced", label: "Weekly Car Miles Replaced by E-Bike", type: "number", placeholder: "e.g. 50" },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", step: 0.01 },
        { name: "carMpg", label: "Car MPG", type: "number", placeholder: "e.g. 28" },
        { name: "ebikeCost", label: "E-Bike Cost ($)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const weeklyMiles = parseFloat(inputs.milesReplaced as string);
        const gasPrice = parseFloat(inputs.gasPrice as string);
        const carMpg = parseFloat(inputs.carMpg as string);
        const ebikeCost = parseFloat(inputs.ebikeCost as string);

        if (!weeklyMiles || !gasPrice || !carMpg || !ebikeCost) return null;

        const annualMiles = weeklyMiles * 52;
        const fuelSaved = (annualMiles / carMpg) * gasPrice;
        const wearSaved = annualMiles * 0.10;
        const totalSaved = fuelSaved + wearSaved;
        const payback = ebikeCost / totalSaved;

        return {
          primary: { label: "Annual Savings", value: `$${formatNumber(totalSaved, 2)}` },
          details: [
            { label: "Fuel Savings", value: `$${formatNumber(fuelSaved, 2)}` },
            { label: "Wear & Tear Savings", value: `$${formatNumber(wearSaved, 2)}` },
            { label: "E-Bike Payback", value: `${formatNumber(payback * 12, 1)} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-vs-gas-total-cost-calculator", "ev-road-trip-planner-calculator", "carbon-credit-value-calculator"],
  faq: [
    {
      question: "How much can I save by commuting on an e-bike?",
      answer:
        "The average car commuter spends $5,000-$10,000/year on fuel, insurance, parking, and maintenance. An e-bike costs about $200-$400/year to operate. For a typical 8-mile commute, you could save $3,000-$8,000 annually, with the e-bike paying for itself in 3-8 months.",
    },
    {
      question: "How much does it cost to charge an e-bike?",
      answer:
        "An e-bike battery costs roughly $0.05-$0.10 per full charge (about 0.4-0.5 kWh). For a 10-mile daily commute, that's less than $20 per year in electricity. Compare that to $600+ in gas for the same distance by car.",
    },
    {
      question: "Are there tax credits for e-bikes?",
      answer:
        "As of 2024, there is no federal e-bike tax credit, though several bills have been proposed. However, many states and cities offer rebates of $200-$1,500 for e-bike purchases. Check your local government and utility programs for available incentives.",
    },
  ],
  formula:
    "Car Cost = Fuel + Insurance + Parking + Maintenance + Depreciation; E-Bike Cost = Purchase/Lifespan + Electricity + Maintenance + Battery; Savings = Car Cost − E-Bike Cost",
};
