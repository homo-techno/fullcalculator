import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbonCreditValueCalculator: CalculatorDefinition = {
  slug: "carbon-credit-value-calculator",
  title: "Carbon Credit Market Value Estimator",
  description:
    "Estimate the market value of carbon credits from emissions reduction projects. Calculate potential revenue from voluntary and compliance carbon markets.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "carbon credit value",
    "carbon offset price",
    "carbon market",
    "carbon credit calculator",
    "emissions reduction value",
    "carbon offset revenue",
  ],
  variants: [
    {
      id: "projectBased",
      name: "Project-Based Credits",
      description: "Estimate carbon credit revenue from a reduction project",
      fields: [
        {
          name: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            { label: "Solar Installation", value: "solar" },
            { label: "Reforestation", value: "forest" },
            { label: "Methane Capture", value: "methane" },
            { label: "Energy Efficiency", value: "efficiency" },
            { label: "EV Fleet Transition", value: "ev" },
          ],
          defaultValue: "solar",
        },
        { name: "annualReduction", label: "Annual CO₂ Reduction (metric tons)", type: "number", placeholder: "e.g. 100" },
        { name: "projectYears", label: "Project Duration (years)", type: "number", placeholder: "e.g. 10" },
        {
          name: "marketType",
          label: "Carbon Market",
          type: "select",
          options: [
            { label: "Voluntary (VCM) - ~$5-50/ton", value: "voluntary" },
            { label: "EU ETS - ~$60-100/ton", value: "eu_ets" },
            { label: "California Cap-and-Trade - ~$25-40/ton", value: "california" },
            { label: "RGGI (NE US) - ~$10-15/ton", value: "rggi" },
          ],
          defaultValue: "voluntary",
        },
        {
          name: "creditQuality",
          label: "Credit Quality / Standard",
          type: "select",
          options: [
            { label: "Gold Standard / Verra VCS (premium)", value: "1.5" },
            { label: "Standard certified", value: "1.0" },
            { label: "Uncertified / basic", value: "0.5" },
          ],
          defaultValue: "1.0",
        },
        { name: "verificationCost", label: "Annual Verification Cost ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "priceEscalation", label: "Annual Price Escalation (%)", type: "number", placeholder: "e.g. 5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const annualReduction = parseFloat(inputs.annualReduction as string);
        const projectYears = parseFloat(inputs.projectYears as string);
        const marketType = inputs.marketType as string;
        const qualityFactor = parseFloat(inputs.creditQuality as string);
        const verificationCost = parseFloat(inputs.verificationCost as string) || 0;
        const priceEscalation = parseFloat(inputs.priceEscalation as string) || 5;

        if (!annualReduction || !projectYears) return null;

        const basePrices: Record<string, number> = {
          voluntary: 15,
          eu_ets: 80,
          california: 32,
          rggi: 13,
        };

        const basePrice = (basePrices[marketType] || 15) * qualityFactor;
        let totalRevenue = 0;
        let totalVerificationCost = verificationCost * projectYears;

        for (let y = 0; y < projectYears; y++) {
          const yearPrice = basePrice * Math.pow(1 + priceEscalation / 100, y);
          totalRevenue += annualReduction * yearPrice;
        }

        const netRevenue = totalRevenue - totalVerificationCost;
        const firstYearRevenue = annualReduction * basePrice;
        const totalCredits = annualReduction * projectYears;
        const avgPricePerTon = totalRevenue / totalCredits;
        const revenuePerTon = netRevenue / totalCredits;

        return {
          primary: {
            label: `${projectYears}-Year Net Revenue`,
            value: `$${formatNumber(netRevenue, 2)}`,
          },
          details: [
            { label: "Current Price per Ton", value: `$${formatNumber(basePrice, 2)}` },
            { label: "First Year Revenue", value: `$${formatNumber(firstYearRevenue, 2)}` },
            { label: "Total Gross Revenue", value: `$${formatNumber(totalRevenue, 2)}` },
            { label: "Total Verification Costs", value: `$${formatNumber(totalVerificationCost, 2)}` },
            { label: "Total Credits Generated", value: `${formatNumber(totalCredits, 0)} tCO₂e` },
            { label: "Avg Price per Ton", value: `$${formatNumber(avgPricePerTon, 2)}` },
            { label: "Net Revenue per Ton", value: `$${formatNumber(revenuePerTon, 2)}` },
          ],
          note: `Carbon credit prices are volatile. Voluntary market prices range $5-$50+/ton depending on project type and quality. Compliance markets tend to have higher, more stable prices.`,
        };
      },
    },
    {
      id: "personalOffset",
      name: "Personal Carbon Offset",
      description: "Calculate the cost to offset your personal carbon footprint",
      fields: [
        { name: "annualMiles", label: "Annual Driving Miles", type: "number", placeholder: "e.g. 12000" },
        { name: "flights", label: "Round-Trip Flights per Year", type: "number", placeholder: "e.g. 4" },
        { name: "homeEnergy", label: "Monthly Energy Bill ($)", type: "number", placeholder: "e.g. 200" },
        { name: "offsetPrice", label: "Offset Price ($/ton CO₂)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const annualMiles = parseFloat(inputs.annualMiles as string) || 0;
        const flights = parseFloat(inputs.flights as string) || 0;
        const homeEnergy = parseFloat(inputs.homeEnergy as string) || 0;
        const offsetPrice = parseFloat(inputs.offsetPrice as string) || 15;

        const drivingCO2 = annualMiles * 0.000404;
        const flightCO2 = flights * 1.6;
        const homeCO2 = homeEnergy * 12 * 0.0048;
        const totalCO2 = drivingCO2 + flightCO2 + homeCO2;
        const offsetCost = totalCO2 * offsetPrice;

        if (totalCO2 === 0) return null;

        return {
          primary: { label: "Annual Offset Cost", value: `$${formatNumber(offsetCost, 2)}` },
          details: [
            { label: "Total Carbon Footprint", value: `${formatNumber(totalCO2, 1)} tons CO₂` },
            { label: "Driving Emissions", value: `${formatNumber(drivingCO2, 1)} tons` },
            { label: "Flight Emissions", value: `${formatNumber(flightCO2, 1)} tons` },
            { label: "Home Energy Emissions", value: `${formatNumber(homeCO2, 1)} tons` },
            { label: "Monthly Offset Cost", value: `$${formatNumber(offsetCost / 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-payback-period-calculator", "ev-vs-gas-total-cost-calculator", "home-electrification-calculator"],
  faq: [
    {
      question: "How much is a carbon credit worth?",
      answer:
        "Carbon credit prices vary widely by market. Voluntary credits trade at $5-$50+ per ton, with premium nature-based or tech-based removal credits reaching $100+. EU ETS compliance credits are $60-100/ton. California Cap-and-Trade credits are around $25-40/ton. Quality, verification, and co-benefits significantly affect pricing.",
    },
    {
      question: "What is the difference between voluntary and compliance carbon markets?",
      answer:
        "Compliance markets (EU ETS, California Cap-and-Trade) are government-regulated, requiring certain companies to buy credits to meet emission caps. Voluntary markets allow businesses and individuals to purchase offsets voluntarily. Compliance credits are typically more expensive but more stable in price.",
    },
  ],
  formula:
    "Revenue = Σ(Annual Reduction × Base Price × Quality Factor × (1 + Escalation)^year); Net Revenue = Gross Revenue − Verification Costs; Personal CO₂ = Driving + Flights + Home Energy emissions",
};
