import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rvFuelCalculator: CalculatorDefinition = {
  slug: "rv-fuel-calculator",
  title: "RV Fuel Cost Calculator",
  description: "Free RV fuel cost calculator. Estimate fuel costs for RV trips based on vehicle type, distance, and fuel prices.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rv fuel calculator", "rv gas cost", "motorhome fuel cost", "rv trip cost", "rv mpg calculator"],
  variants: [
    {
      id: "trip",
      name: "RV Trip Fuel Cost",
      description: "Calculate fuel cost for an RV trip",
      fields: [
        { name: "distance", label: "Trip Distance (miles)", type: "number", placeholder: "e.g. 1200" },
        { name: "rvType", label: "RV Type", type: "select", options: [
          { label: "Class A Motorhome (gas) - 7-10 MPG", value: "classA-gas" },
          { label: "Class A Motorhome (diesel) - 8-12 MPG", value: "classA-diesel" },
          { label: "Class B Van (camper van) - 18-22 MPG", value: "classB" },
          { label: "Class C Motorhome - 10-14 MPG", value: "classC" },
          { label: "Travel Trailer (tow vehicle) - 8-12 MPG", value: "trailer" },
          { label: "5th Wheel (tow vehicle) - 8-10 MPG", value: "fifthwheel" },
        ], defaultValue: "classC" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 3.75", prefix: "$", step: 0.01 },
        { name: "customMpg", label: "Custom MPG (optional, overrides type)", type: "number", placeholder: "Leave empty to use estimate" },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const rvType = (inputs.rvType as string) || "classC";
        const fuelPrice = (inputs.fuelPrice as number) || 3.75;
        const customMpg = inputs.customMpg as number;
        if (!distance) return null;

        // Average MPG by RV type
        const mpgRanges: Record<string, { avg: number; fuel: string }> = {
          "classA-gas": { avg: 8, fuel: "gasoline" },
          "classA-diesel": { avg: 10, fuel: "diesel" },
          "classB": { avg: 20, fuel: "gasoline" },
          "classC": { avg: 12, fuel: "gasoline" },
          "trailer": { avg: 10, fuel: "gasoline" },
          "fifthwheel": { avg: 9, fuel: "gasoline" },
        };

        const info = mpgRanges[rvType] || { avg: 10, fuel: "gasoline" };
        const mpg = customMpg || info.avg;

        const gallons = distance / mpg;
        const fuelCost = gallons * fuelPrice;
        const costPerMile = fuelCost / distance;

        // Typical daily RV driving = ~250 miles
        const drivingDays = Math.ceil(distance / 250);
        const dailyFuelCost = fuelCost / drivingDays;

        return {
          primary: { label: "Trip Fuel Cost", value: `$${formatNumber(fuelCost)}` },
          details: [
            { label: "Gallons needed", value: formatNumber(gallons, 1) },
            { label: "MPG used", value: `${formatNumber(mpg, 1)} MPG` },
            { label: "Cost per mile", value: `$${formatNumber(costPerMile, 2)}` },
            { label: "Estimated driving days (~250 mi/day)", value: `${drivingDays} days` },
            { label: "Daily fuel cost", value: `$${formatNumber(dailyFuelCost)}` },
            { label: "Round trip cost", value: `$${formatNumber(fuelCost * 2)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "RV vs Flying Cost",
      description: "Compare driving an RV vs flying to a destination",
      fields: [
        { name: "distance", label: "One-Way Distance (miles)", type: "number", placeholder: "e.g. 800" },
        { name: "mpg", label: "RV MPG", type: "number", placeholder: "e.g. 10" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 3.75", prefix: "$" },
        { name: "campingPerNight", label: "Campground Cost per Night", type: "number", placeholder: "e.g. 45", prefix: "$" },
        { name: "travelers", label: "Number of Travelers", type: "select", options: [
          { label: "1 person", value: "1" },
          { label: "2 people", value: "2" },
          { label: "3 people", value: "3" },
          { label: "4 people", value: "4" },
          { label: "5 people", value: "5" },
        ], defaultValue: "2" },
        { name: "flightCost", label: "Flight Cost per Person (round trip)", type: "number", placeholder: "e.g. 350", prefix: "$" },
        { name: "hotelPerNight", label: "Hotel Cost per Night", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "vacationNights", label: "Vacation Nights", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const fuelPrice = (inputs.fuelPrice as number) || 3.75;
        const campCost = (inputs.campingPerNight as number) || 45;
        const travelers = parseInt(inputs.travelers as string) || 2;
        const flightCost = (inputs.flightCost as number) || 350;
        const hotelCost = (inputs.hotelPerNight as number) || 150;
        const vacNights = (inputs.vacationNights as number) || 7;
        if (!distance || !mpg) return null;

        // RV costs
        const roundTripMiles = distance * 2;
        const fuelGallons = roundTripMiles / mpg;
        const totalFuel = fuelGallons * fuelPrice;
        const drivingDays = Math.ceil(distance / 250);
        const totalCampNights = vacNights + (drivingDays * 2); // travel nights + vacation
        const totalCamping = totalCampNights * campCost;
        const totalRV = totalFuel + totalCamping;

        // Fly costs
        const totalFlights = flightCost * travelers;
        const totalHotel = hotelCost * vacNights;
        const rentalCar = vacNights * 50; // estimate $50/day rental
        const totalFly = totalFlights + totalHotel + rentalCar;

        const savings = totalFly - totalRV;

        return {
          primary: { label: `${savings > 0 ? "RV" : "Flying"} Saves`, value: `$${formatNumber(Math.abs(savings))}` },
          details: [
            { label: "RV total cost", value: `$${formatNumber(totalRV)}` },
            { label: "  - Fuel (round trip)", value: `$${formatNumber(totalFuel)}` },
            { label: "  - Camping/RV parks", value: `$${formatNumber(totalCamping)} (${totalCampNights} nights)` },
            { label: "Flying total cost", value: `$${formatNumber(totalFly)}` },
            { label: "  - Flights", value: `$${formatNumber(totalFlights)} (${travelers} people)` },
            { label: "  - Hotel", value: `$${formatNumber(totalHotel)} (${vacNights} nights)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gas-cost-trip-calculator", "fuel-cost-calculator", "boat-fuel-calculator"],
  faq: [
    { question: "What is the average MPG for an RV?", answer: "It varies widely by type: Class A gas motorhomes get 7-10 MPG, Class A diesel 8-12 MPG, Class B vans 18-22 MPG, Class C 10-14 MPG. When towing a travel trailer or 5th wheel, most trucks get 8-12 MPG. Wind, terrain, and weight significantly affect these numbers." },
    { question: "How much does it cost per mile to drive an RV?", answer: "At 10 MPG and $3.75/gallon gas, an RV costs about $0.38 per mile in fuel alone. A Class B van at 20 MPG costs about $0.19/mile. Add maintenance, tires, and depreciation, and the true cost is typically $0.50-$1.50+ per mile for a motorhome." },
    { question: "Is RVing cheaper than flying and staying in hotels?", answer: "For families (3+ people) and longer trips, RVing is often cheaper since you save on multiple airfares and hotel rooms. For solo travelers or couples on short trips, flying is usually more economical. RVing offers flexibility and no baggage/rental fees, but fuel costs add up on long drives." },
  ],
  formula: "Fuel Cost = (Distance / MPG) x Fuel Price; Cost Per Mile = Fuel Cost / Distance",
};
