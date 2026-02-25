import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beachVacationCost: CalculatorDefinition = {
  slug: "beach-vacation-cost",
  title: "Beach Vacation Cost Calculator",
  description:
    "Free online beach vacation cost calculator. Estimate total beach vacation costs including flights, hotel, food, and activities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "beach vacation",
    "vacation cost",
    "beach trip",
    "holiday budget",
    "resort cost",
  ],
  variants: [
    {
      id: "total-cost",
      name: "Estimate Total Beach Vacation Cost",
      fields: [
        {
          name: "destination",
          label: "Destination Type",
          type: "select",
          options: [
            { label: "Caribbean (e.g. Cancun, Jamaica)", value: "caribbean" },
            { label: "Southeast Asia (e.g. Bali, Thailand)", value: "sea" },
            { label: "Mediterranean (e.g. Greece, Spain)", value: "med" },
            { label: "Hawaii", value: "hawaii" },
            { label: "Florida / US Coast", value: "uscoast" },
            { label: "Australia (e.g. Gold Coast)", value: "australia" },
          ],
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "travelers",
          label: "Number of Travelers",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "hotelTier",
          label: "Accommodation Level",
          type: "select",
          options: [
            { label: "Budget (Hostel/Guesthouse)", value: "budget" },
            { label: "Mid-Range (3-Star Hotel)", value: "midrange" },
            { label: "Upscale (4-Star Resort)", value: "upscale" },
            { label: "Luxury (5-Star Resort)", value: "luxury" },
          ],
        },
      ],
      calculate: (inputs) => {
        const nights = parseFloat(inputs.nights as string) || 0;
        const travelers = parseFloat(inputs.travelers as string) || 1;
        const destination = inputs.destination as string;
        const hotelTier = inputs.hotelTier as string;

        // Average round-trip flight cost per person
        const flightCosts: Record<string, number> = {
          caribbean: 400,
          sea: 800,
          med: 700,
          hawaii: 500,
          uscoast: 250,
          australia: 1200,
        };

        // Nightly accommodation costs per room
        const hotelCosts: Record<string, Record<string, number>> = {
          caribbean: { budget: 40, midrange: 120, upscale: 250, luxury: 500 },
          sea: { budget: 15, midrange: 60, upscale: 150, luxury: 350 },
          med: { budget: 50, midrange: 130, upscale: 250, luxury: 500 },
          hawaii: { budget: 80, midrange: 200, upscale: 350, luxury: 700 },
          uscoast: { budget: 60, midrange: 150, upscale: 280, luxury: 500 },
          australia: { budget: 50, midrange: 140, upscale: 280, luxury: 550 },
        };

        // Daily food cost per person
        const foodCosts: Record<string, number> = {
          caribbean: 40,
          sea: 15,
          med: 45,
          hawaii: 60,
          uscoast: 50,
          australia: 50,
        };

        const rooms = Math.ceil(travelers / 2);
        const flightPerPerson = flightCosts[destination] || 500;
        const totalFlights = flightPerPerson * travelers;
        const hotelPerNight = (hotelCosts[destination] || hotelCosts.caribbean)[hotelTier] || 120;
        const totalHotel = hotelPerNight * nights * rooms;
        const dailyFood = (foodCosts[destination] || 40) * travelers;
        const totalFood = dailyFood * nights;
        const dailyActivities = 30 * travelers;
        const totalActivities = dailyActivities * nights;
        const totalCost = totalFlights + totalHotel + totalFood + totalActivities;
        const perPerson = totalCost / travelers;

        return {
          primary: { label: "Total Vacation Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Flights", value: "$" + formatNumber(totalFlights, 2) },
            { label: "Accommodation", value: "$" + formatNumber(totalHotel, 2) },
            { label: "Food & Dining", value: "$" + formatNumber(totalFood, 2) },
            { label: "Activities & Excursions", value: "$" + formatNumber(totalActivities, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
            { label: "Cost per Night (total)", value: "$" + formatNumber(totalCost / nights, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-daily", "ski-trip-cost", "disney-trip-cost"],
  faq: [
    {
      question: "How much does a beach vacation cost?",
      answer:
        "A 7-night beach vacation for two typically costs $2,000-$6,000 depending on destination, accommodation level, and travel style. Southeast Asia is the most affordable, while Hawaii and Australia are more expensive.",
    },
    {
      question: "When is the cheapest time for a beach vacation?",
      answer:
        "Shoulder seasons (just before or after peak season) typically offer the best value with good weather and lower prices. Avoid school holidays and major holidays for the best deals.",
    },
    {
      question: "What hidden costs should I budget for?",
      answer:
        "Common hidden costs include resort fees, travel insurance, airport transfers, baggage fees, tips, souvenirs, and sunscreen/beach gear. Add 10-15% to your estimate for these extras.",
    },
  ],
  formula:
    "Total Cost = Flights + (Hotel/Night x Nights x Rooms) + (Food/Day x Days x Travelers) + (Activities/Day x Days x Travelers)",
};
