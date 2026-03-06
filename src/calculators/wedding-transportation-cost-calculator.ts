import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingTransportationCostCalculator: CalculatorDefinition = {
  slug: "wedding-transportation-cost-calculator",
  title: "Wedding Transportation Cost Calculator",
  description: "Estimate wedding day transportation costs for the couple, bridal party, and guest shuttles including limos, party buses, and car services.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding transportation","wedding limo cost","party bus rental","guest shuttle cost"],
  variants: [{
    id: "standard",
    name: "Wedding Transportation Cost",
    description: "Estimate wedding day transportation costs for the couple, bridal party, and guest shuttles including limos, party buses, and car services.",
    fields: [
      { name: "coupleTransport", label: "Couple Vehicle Type", type: "select", options: [{ value: "300", label: "Sedan ($300)" }, { value: "600", label: "Limousine ($600)" }, { value: "900", label: "Vintage/Luxury ($900)" }, { value: "150", label: "Personal Vehicle ($150)" }], defaultValue: "600" },
      { name: "bridalPartySize", label: "Bridal Party Size", type: "number", min: 0, max: 20, defaultValue: 10 },
      { name: "partyTransport", label: "Party Transport Type", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "400", label: "SUV Limos ($400)" }, { value: "800", label: "Party Bus ($800)" }, { value: "300", label: "Sedan Service ($300)" }], defaultValue: "400" },
      { name: "guestShuttles", label: "Guest Shuttles Needed", type: "number", min: 0, max: 5, defaultValue: 1 },
      { name: "shuttleCost", label: "Cost Per Shuttle ($)", type: "number", min: 0, max: 2000, defaultValue: 500 },
      { name: "hours", label: "Total Service Hours", type: "number", min: 2, max: 12, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const coupleVehicle = parseFloat(inputs.coupleTransport as unknown as string);
    const partySize = inputs.bridalPartySize as number;
    const partyVehicle = parseFloat(inputs.partyTransport as unknown as string);
    const shuttleCount = inputs.guestShuttles as number;
    const shuttleCost = inputs.shuttleCost as number;
    const hours = inputs.hours as number;
    const coupleTotal = coupleVehicle;
    const partyTotal = partyVehicle;
    const shuttleTotal = shuttleCount * shuttleCost;
    const gratuity = (coupleTotal + partyTotal + shuttleTotal) * 0.18;
    const total = coupleTotal + partyTotal + shuttleTotal + gratuity;
    return {
      primary: { label: "Total Transportation Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Couple Vehicle", value: "$" + formatNumber(coupleVehicle) },
        { label: "Bridal Party Transport", value: "$" + formatNumber(partyVehicle) },
        { label: "Guest Shuttles", value: "$" + formatNumber(Math.round(shuttleTotal)) },
        { label: "Gratuity (18%)", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Service Hours", value: formatNumber(hours) + " hours" }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","reception-venue-cost-calculator","destination-wedding-savings-calculator"],
  faq: [
    { question: "How much does wedding transportation cost?", answer: "Wedding transportation typically costs $500 to $2,500. A single limousine costs $400-$800, party buses $600-$1,200, and guest shuttles $300-$600 each." },
    { question: "Do you need guest shuttles for a wedding?", answer: "Guest shuttles are recommended when the ceremony and reception are at different locations, or when parking is limited. They also help ensure guest safety when alcohol is served." },
    { question: "How much should you tip wedding drivers?", answer: "Standard gratuity for wedding drivers is 15-20% of the total fare. Some companies include gratuity in the contract, so always check before adding extra." },
  ],
  formula: "Total = CoupleVehicle + PartyTransport + (Shuttles x ShuttleCost) + Gratuity
Gratuity = (CoupleVehicle + PartyTransport + ShuttleCost) x 18%",
};
