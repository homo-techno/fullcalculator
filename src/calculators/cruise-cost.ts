import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cruiseCostCalculator: CalculatorDefinition = {
  slug: "cruise-cost-calculator",
  title: "Cruise Cost Calculator",
  description:
    "Free cruise cost calculator. Estimate total cruise vacation costs including fare, gratuities, excursions, drinks, and onboard spending.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cruise cost",
    "cruise price",
    "cruise budget",
    "cruise vacation cost",
    "cruise expenses",
  ],
  variants: [
    {
      id: "total",
      name: "Total Cruise Cost",
      description: "Estimate your all-in cruise vacation cost",
      fields: [
        {
          name: "baseFare",
          label: "Base Cruise Fare (per person)",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
        },
        {
          name: "passengers",
          label: "Number of Passengers",
          type: "select",
          options: [
            { label: "1 passenger", value: "1" },
            { label: "2 passengers", value: "2" },
            { label: "3 passengers", value: "3" },
            { label: "4 passengers", value: "4" },
            { label: "5 passengers", value: "5" },
            { label: "6 passengers", value: "6" },
          ],
          defaultValue: "2",
        },
        {
          name: "nights",
          label: "Cruise Duration (nights)",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "cabinType",
          label: "Cabin Type",
          type: "select",
          options: [
            { label: "Inside cabin (base price)", value: "1.0" },
            { label: "Ocean view (+20-30%)", value: "1.25" },
            { label: "Balcony (+40-60%)", value: "1.5" },
            { label: "Suite (+100-200%)", value: "2.0" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "drinkPackage",
          label: "Drink Package",
          type: "select",
          options: [
            { label: "No package (pay per drink)", value: "0" },
            { label: "Non-alcoholic ($20/day/person)", value: "20" },
            { label: "Standard bar ($60/day/person)", value: "60" },
            { label: "Premium bar ($80/day/person)", value: "80" },
          ],
          defaultValue: "0",
        },
        {
          name: "excursionBudget",
          label: "Shore Excursion Budget (per person, total)",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
        },
        {
          name: "wifiBudget",
          label: "Wi-Fi Package",
          type: "select",
          options: [
            { label: "No Wi-Fi", value: "0" },
            { label: "Basic ($15/day)", value: "15" },
            { label: "Premium ($25/day)", value: "25" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const baseFare = inputs.baseFare as number;
        const passengers = parseInt(inputs.passengers as string) || 2;
        const nights = inputs.nights as number;
        const cabinMult = parseFloat(inputs.cabinType as string);
        const drinkPerDay = parseInt(inputs.drinkPackage as string) || 0;
        const excursionBudget = (inputs.excursionBudget as number) || 0;
        const wifiPerDay = parseInt(inputs.wifiBudget as string) || 0;
        if (!baseFare || !nights || baseFare <= 0 || nights <= 0) return null;

        const adjustedFare = baseFare * cabinMult;
        const totalFares = adjustedFare * passengers;
        const portTaxes = passengers * nights * 15;
        const gratuities = passengers * nights * 16;
        const totalDrinks = drinkPerDay * nights * passengers;
        const totalExcursions = excursionBudget * passengers;
        const totalWifi = wifiPerDay * nights;
        const onboardSpending = passengers * nights * 25;

        const grandTotal = totalFares + portTaxes + gratuities + totalDrinks + totalExcursions + totalWifi + onboardSpending;
        const perPerson = grandTotal / passengers;
        const perPersonPerNight = perPerson / nights;
        const farePercent = (totalFares / grandTotal) * 100;
        const extrasPercent = 100 - farePercent;

        return {
          primary: {
            label: "Total Cruise Cost",
            value: `$${formatNumber(grandTotal, 2)}`,
          },
          details: [
            { label: "Cruise fares", value: `$${formatNumber(totalFares, 2)} ($${formatNumber(adjustedFare, 2)}/person)` },
            { label: "Port taxes & fees", value: `$${formatNumber(portTaxes, 2)}` },
            { label: "Gratuities", value: `$${formatNumber(gratuities, 2)} ($${formatNumber(16, 0)}/person/night)` },
            { label: "Drink packages", value: `$${formatNumber(totalDrinks, 2)}` },
            { label: "Shore excursions", value: `$${formatNumber(totalExcursions, 2)}` },
            { label: "Wi-Fi", value: `$${formatNumber(totalWifi, 2)}` },
            { label: "Onboard spending (est.)", value: `$${formatNumber(onboardSpending, 2)}` },
            { label: "Grand total", value: `$${formatNumber(grandTotal, 2)}` },
            { label: "Per person", value: `$${formatNumber(perPerson, 2)}` },
            { label: "Per person/night", value: `$${formatNumber(perPersonPerNight, 2)}` },
            { label: "Extras % of total", value: `${formatNumber(extrasPercent, 1)}% beyond base fare` },
          ],
          note: `Your base fare of $${formatNumber(totalFares, 2)} becomes $${formatNumber(grandTotal, 2)} after all extras - that's ${formatNumber(extrasPercent, 0)}% more than the advertised price. Budget 40-80% on top of the base fare for the true cost.`,
        };
      },
    },
    {
      id: "compare",
      name: "Cruise vs Hotel Vacation",
      description: "Compare cruise cost to an equivalent land vacation",
      fields: [
        {
          name: "cruiseTotal",
          label: "Total Cruise Cost (all-in)",
          type: "number",
          placeholder: "e.g. 4000",
          prefix: "$",
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "people",
          label: "Number of People",
          type: "select",
          options: [
            { label: "1 person", value: "1" },
            { label: "2 people", value: "2" },
            { label: "3 people", value: "3" },
            { label: "4 people", value: "4" },
          ],
          defaultValue: "2",
        },
        {
          name: "hotelPerNight",
          label: "Equivalent Hotel Rate ($/night)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "dailyMeals",
          label: "Daily Meals Cost (per person)",
          type: "number",
          placeholder: "e.g. 75",
        },
      ],
      calculate: (inputs) => {
        const cruiseTotal = inputs.cruiseTotal as number;
        const nights = inputs.nights as number;
        const people = parseInt(inputs.people as string) || 2;
        const hotelRate = inputs.hotelPerNight as number;
        const dailyMeals = inputs.dailyMeals as number;
        if (!cruiseTotal || !nights || !hotelRate || !dailyMeals) return null;

        const hotelTotal = hotelRate * nights;
        const mealTotal = dailyMeals * nights * people;
        const transportEst = people * 50 * nights * 0.3;
        const activitiesEst = people * 40 * nights * 0.4;
        const landTotal = hotelTotal + mealTotal + transportEst + activitiesEst;

        const difference = cruiseTotal - landTotal;
        const cheaper = difference > 0 ? "Land vacation" : "Cruise";
        const cruisePerNight = cruiseTotal / nights / people;
        const landPerNight = landTotal / nights / people;

        return {
          primary: {
            label: `${cheaper} is Cheaper`,
            value: `Save $${formatNumber(Math.abs(difference), 2)}`,
          },
          details: [
            { label: "Cruise total", value: `$${formatNumber(cruiseTotal, 2)}` },
            { label: "Land vacation total", value: `$${formatNumber(landTotal, 2)}` },
            { label: "Land: Hotel", value: `$${formatNumber(hotelTotal, 2)}` },
            { label: "Land: Meals", value: `$${formatNumber(mealTotal, 2)}` },
            { label: "Land: Transport (est.)", value: `$${formatNumber(transportEst, 2)}` },
            { label: "Land: Activities (est.)", value: `$${formatNumber(activitiesEst, 2)}` },
            { label: "Cruise per person/night", value: `$${formatNumber(cruisePerNight, 2)}` },
            { label: "Land per person/night", value: `$${formatNumber(landPerNight, 2)}` },
          ],
          note: `The ${cheaper.toLowerCase()} option saves $${formatNumber(Math.abs(difference), 2)}. Note that cruises include meals, entertainment, and transportation between ports, which can make them excellent value.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-calculator", "hotel-cost-calculator"],
  faq: [
    {
      question: "How much does a cruise really cost beyond the fare?",
      answer:
        "The base fare is typically only 50-60% of your total cost. Expect to add: mandatory gratuities ($14-20/person/night), port taxes ($50-200 total), drink packages ($60-80/person/day), excursions ($50-150 each), Wi-Fi ($15-25/day), and onboard spending. Budget 40-80% above the fare.",
    },
    {
      question: "Are cruise drink packages worth it?",
      answer:
        "If you drink 5+ alcoholic drinks per day, the standard package ($60-80/day) usually pays for itself. Non-alcoholic packages ($20-30/day) are worth it if you drink specialty coffees and sodas regularly. Calculate your typical daily drink count to decide.",
    },
    {
      question: "What is the best time to book a cruise for the lowest price?",
      answer:
        "Book during 'wave season' (January-March) for the best deals. Also watch for last-minute deals 60-90 days before sailing. Repositioning cruises (when ships move between seasons) offer the deepest discounts. Shoulder seasons are cheaper than peak summer and holidays.",
    },
  ],
  formula:
    "Total = (Base Fare x Cabin Multiplier x Passengers) + Port Taxes + Gratuities + Drink Package + Excursions + Wi-Fi + Onboard Spending.",
};
