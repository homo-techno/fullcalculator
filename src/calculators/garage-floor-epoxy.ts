import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageFloorEpoxyCalculator: CalculatorDefinition = {
  slug: "garage-floor-epoxy-calculator",
  title: "Garage Floor Epoxy Calculator",
  description: "Free garage floor epoxy calculator. Calculate how much epoxy coating, primer, and decorative flakes you need for your garage floor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage floor epoxy calculator", "epoxy floor calculator", "garage epoxy cost", "epoxy coating calculator", "garage floor coating"],
  variants: [
    {
      id: "epoxy-materials",
      name: "Epoxy Materials Needed",
      description: "Calculate epoxy and coating materials for your garage floor",
      fields: [
        { name: "length", label: "Garage Length (feet)", type: "number", placeholder: "e.g. 24" },
        { name: "width", label: "Garage Width (feet)", type: "number", placeholder: "e.g. 24" },
        { name: "coatingType", label: "Coating System", type: "select", options: [
          { label: "1-Part Epoxy (DIY basic)", value: "1part" },
          { label: "2-Part Epoxy (Standard)", value: "2part" },
          { label: "100% Solids Epoxy (Professional)", value: "100solid" },
          { label: "Polyurea / Polyaspartic (Premium)", value: "polyurea" },
        ], defaultValue: "2part" },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 Coat", value: "1" },
          { label: "2 Coats (Recommended)", value: "2" },
          { label: "3 Coats (Heavy Duty)", value: "3" },
        ], defaultValue: "2" },
        { name: "flakes", label: "Decorative Flakes", type: "select", options: [
          { label: "None", value: "0" },
          { label: "Light Broadcast", value: "0.25" },
          { label: "Medium Broadcast", value: "0.5" },
          { label: "Full Broadcast (covers surface)", value: "1" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const coatingType = inputs.coatingType as string;
        const coats = parseInt(inputs.coats as string) || 2;
        const flakeDensity = parseFloat(inputs.flakes as string) || 0;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Coverage per gallon varies by product type
        let coveragePerGal: number;
        let costPerGal: number;
        switch (coatingType) {
          case "1part":
            coveragePerGal = 250; costPerGal = 35; break;
          case "2part":
            coveragePerGal = 200; costPerGal = 65; break;
          case "100solid":
            coveragePerGal = 150; costPerGal = 120; break;
          case "polyurea":
            coveragePerGal = 200; costPerGal = 150; break;
          default:
            coveragePerGal = 200; costPerGal = 65;
        }

        const gallonsPerCoat = areaSqFt / coveragePerGal;
        const totalGallons = gallonsPerCoat * coats;
        const totalGallonsRounded = Math.ceil(totalGallons);

        // Primer/conditioner: 1 gallon per 200-300 sq ft
        const primerGallons = Math.ceil(areaSqFt / 250);

        // Decorative flakes: ~1 lb per 10 sq ft for full broadcast
        const flakeLbs = areaSqFt * flakeDensity / 10;
        const flakeBags = Math.ceil(flakeLbs / 1); // 1-lb bags typical

        // Clear topcoat (if using flakes)
        const topcoatGallons = flakeDensity > 0 ? Math.ceil(areaSqFt / 200) : 0;

        // Concrete etcher/cleaner
        const etcherGallons = Math.ceil(areaSqFt / 200);

        const epoxyCost = totalGallonsRounded * costPerGal;
        const primerCost = primerGallons * 30;
        const flakeCost = flakeBags * 15;
        const topcoatCost = topcoatGallons * 75;
        const etcherCost = etcherGallons * 20;
        const totalCost = epoxyCost + primerCost + flakeCost + topcoatCost + etcherCost;

        return {
          primary: { label: "Epoxy Needed", value: `${totalGallonsRounded} gallons` },
          details: [
            { label: "Garage floor area", value: `${formatNumber(areaSqFt, 0)} sq ft` },
            { label: "Epoxy coating", value: `${totalGallonsRounded} gallons (${coats} coats)` },
            { label: "Primer / Conditioner", value: `${primerGallons} gallons` },
            { label: "Concrete etcher / Cleaner", value: `${etcherGallons} gallons` },
            { label: "Decorative flakes", value: flakeLbs > 0 ? `${formatNumber(flakeLbs, 1)} lbs` : "None" },
            { label: "Clear topcoat", value: topcoatGallons > 0 ? `${topcoatGallons} gallons` : "Not needed" },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost, 0)}` },
          ],
          note: "Surface prep is critical: degrease, etch or grind the concrete, and let it dry completely. Concrete moisture test is recommended. Apply when temperature is 50-85°F and humidity is below 85%.",
        };
      },
    },
    {
      id: "epoxy-cost",
      name: "Garage Floor Coating Cost",
      description: "Compare DIY vs professional garage floor coating costs",
      fields: [
        { name: "areaSqFt", label: "Garage Floor Area (sq ft)", type: "number", placeholder: "e.g. 576" },
        { name: "garageSize", label: "Garage Size (for quick estimate)", type: "select", options: [
          { label: "1-Car Garage (~240 sq ft)", value: "240" },
          { label: "2-Car Garage (~480 sq ft)", value: "480" },
          { label: "3-Car Garage (~720 sq ft)", value: "720" },
          { label: "Custom (use area above)", value: "0" },
        ], defaultValue: "0" },
        { name: "quality", label: "Quality Level", type: "select", options: [
          { label: "DIY Kit (basic 1-part)", value: "diy-basic" },
          { label: "DIY Kit (2-part with flakes)", value: "diy-premium" },
          { label: "Professional (2-part epoxy)", value: "pro-epoxy" },
          { label: "Professional (polyurea/polyaspartic)", value: "pro-polyurea" },
        ], defaultValue: "diy-premium" },
      ],
      calculate: (inputs) => {
        let areaSqFt = inputs.areaSqFt as number;
        const garageSize = parseInt(inputs.garageSize as string) || 0;
        const quality = inputs.quality as string;
        if (garageSize > 0) areaSqFt = garageSize;
        if (!areaSqFt) return null;

        let costPerSqFt: number;
        let prepIncluded: string;
        let durability: string;
        let cureTime: string;

        switch (quality) {
          case "diy-basic":
            costPerSqFt = 1.5; prepIncluded = "Manual acid etch"; durability = "2-5 years"; cureTime = "3-7 days";
            break;
          case "diy-premium":
            costPerSqFt = 3; prepIncluded = "Acid etch + primer"; durability = "5-10 years"; cureTime = "3-7 days";
            break;
          case "pro-epoxy":
            costPerSqFt = 6; prepIncluded = "Diamond grinding + primer"; durability = "10-20 years"; cureTime = "3-5 days";
            break;
          case "pro-polyurea":
            costPerSqFt = 10; prepIncluded = "Diamond grinding + moisture barrier"; durability = "15-25+ years"; cureTime = "1 day";
            break;
          default:
            costPerSqFt = 3; prepIncluded = "Acid etch + primer"; durability = "5-10 years"; cureTime = "3-7 days";
        }

        const totalCost = areaSqFt * costPerSqFt;

        return {
          primary: { label: "Estimated Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Floor area", value: `${formatNumber(areaSqFt, 0)} sq ft` },
            { label: "Cost per sq ft", value: `$${formatNumber(costPerSqFt, 2)}` },
            { label: "Surface preparation", value: prepIncluded },
            { label: "Expected durability", value: durability },
            { label: "Cure time before driving", value: cureTime },
            { label: "Hot tire pickup resistance", value: quality.includes("pro") ? "High" : "Low-Medium" },
          ],
          note: "Professional coatings use diamond grinding for surface prep (superior to acid etching). Polyurea/polyaspartic coatings cure in one day and are more resistant to hot tire pickup, UV, and chemicals than standard epoxy.",
        };
      },
    },
  ],
  relatedSlugs: ["epoxy-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much epoxy do I need for a 2-car garage?", answer: "A typical 2-car garage (20'×24' = 480 sq ft) needs 4-5 gallons of 2-part epoxy for 2 coats, plus 2 gallons of primer and 2 gallons of clear topcoat if using decorative flakes. A DIY kit for this size costs $300-$600; professional installation costs $2,500-$5,000." },
    { question: "How long does garage floor epoxy last?", answer: "DIY 1-part epoxy: 2-5 years. DIY 2-part epoxy: 5-10 years. Professional 2-part epoxy: 10-20 years. Polyurea/polyaspartic: 15-25+ years. Lifespan depends heavily on surface preparation quality. Diamond grinding produces the best adhesion." },
  ],
  formula: "Gallons = (Area / Coverage Per Gallon) × Number of Coats | Flakes (lbs) = Area × Density / 10 | Primer = Area / 250",
};
