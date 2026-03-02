add(
  "flight-fuel-cost-estimator-calculator",
  "Flight Fuel Cost Estimator Calculator",
  "Estimate fuel costs for a flight based on distance, aircraft type, and fuel price per gallon.",
  "Finance",
  "finance",
  "$",
  ["flight fuel cost", "aviation fuel", "jet fuel calculator", "airplane fuel expense"],
  [
    '{ name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 1500 }',
    '{ name: "aircraftType", label: "Aircraft Type", type: "select", options: [{ value: "1", label: "Small Prop (10 gal/hr)" }, { value: "2", label: "Turboprop (60 gal/hr)" }, { value: "3", label: "Light Jet (150 gal/hr)" }, { value: "4", label: "Mid-Size Jet (250 gal/hr)" }, { value: "5", label: "Heavy Jet (450 gal/hr)" }], defaultValue: "3" }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 2, max: 15, defaultValue: 6.5 }',
    '{ name: "cruiseSpeed", label: "Cruise Speed (mph)", type: "number", min: 100, max: 600, defaultValue: 450 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const aircraftType = inputs.aircraftType as string;
    const fuelPrice = inputs.fuelPrice as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const burnRates: Record<string, number> = { "1": 10, "2": 60, "3": 150, "4": 250, "5": 450 };
    const burnRate = burnRates[aircraftType] || 150;
    const flightHours = distance / cruiseSpeed;
    const totalGallons = burnRate * flightHours;
    const totalCost = totalGallons * fuelPrice;
    const costPerMile = totalCost / distance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Flight Time", value: formatNumber(Math.round(flightHours * 10) / 10) + " hours" },
        { label: "Fuel Burned", value: formatNumber(Math.round(totalGallons)) + " gallons" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does jet fuel cost?", a: "Jet-A fuel typically costs $5 to $8 per gallon at most FBOs, though prices vary by location and volume." },
    { q: "How much fuel does a private jet burn per hour?", a: "Light jets burn about 100 to 200 gallons per hour, mid-size jets 200 to 300, and heavy jets 350 to 500+ gallons per hour." },
    { q: "What affects flight fuel costs the most?", a: "Distance, aircraft size, headwinds, altitude, payload weight, and fuel prices at the departure airport all significantly impact fuel costs." }
  ],
  `Total Fuel Cost = (Distance / Cruise Speed) x Burn Rate x Fuel Price
Cost Per Mile = Total Fuel Cost / Distance`,
  ["flight-cost-per-mile-calculator", "road-trip-cost-calculator", "travel-budget-calculator"]
);

add(
  "jet-lag-recovery-time-calculator",
  "Jet Lag Recovery Time Calculator",
  "Estimate how many days it takes to recover from jet lag based on time zones crossed, travel direction, and personal factors.",
  "Health",
  "health",
  "H",
  ["jet lag recovery", "time zone adjustment", "circadian rhythm recovery", "travel fatigue"],
  [
    '{ name: "timeZonesCrossed", label: "Time Zones Crossed", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "direction", label: "Travel Direction", type: "select", options: [{ value: "1", label: "Eastbound" }, { value: "2", label: "Westbound" }], defaultValue: "1" }',
    '{ name: "age", label: "Your Age", type: "number", min: 10, max: 100, defaultValue: 35 }',
    '{ name: "sleepQuality", label: "Usual Sleep Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const zones = inputs.timeZonesCrossed as number;
    const direction = inputs.direction as string;
    const age = inputs.age as number;
    const sleepQuality = parseInt(inputs.sleepQuality as string);
    const baseDaysPerZone = direction === "1" ? 1.5 : 1.0;
    const baseDays = zones * baseDaysPerZone;
    const ageFactor = age > 50 ? 1.3 : age > 35 ? 1.1 : 1.0;
    const sleepFactor = [1.3, 1.0, 0.8][sleepQuality - 1] || 1.0;
    const recoveryDays = Math.round(baseDays * ageFactor * sleepFactor * 10) / 10;
    const peakSymptomDay = Math.min(Math.round(recoveryDays * 0.3), zones);
    const melatoninStartDay = direction === "1" ? 1 : 0;
    return {
      primary: { label: "Estimated Recovery Time", value: formatNumber(recoveryDays) + " days" },
      details: [
        { label: "Direction", value: direction === "1" ? "Eastbound (harder)" : "Westbound (easier)" },
        { label: "Peak Symptom Day", value: "Day " + formatNumber(peakSymptomDay) },
        { label: "Start Melatonin", value: "Day " + formatNumber(melatoninStartDay) + " at destination" },
        { label: "Age Adjustment", value: ageFactor > 1 ? "+" + formatNumber(Math.round((ageFactor - 1) * 100)) + "%" : "None" }
      ]
    };
  }`,
  [
    { q: "Why is eastbound jet lag worse?", a: "Traveling east shortens your day, requiring you to fall asleep earlier. The body naturally runs on a cycle slightly longer than 24 hours, making it easier to stay up later (westbound) than to sleep earlier." },
    { q: "How long does jet lag last per time zone?", a: "A common rule of thumb is 1 day per time zone crossed going east, and about two-thirds of a day per zone going west." },
    { q: "What helps jet lag recovery?", a: "Sunlight exposure at the right times, melatonin supplements, staying hydrated, avoiding alcohol, and gradually shifting sleep times before departure all help." }
  ],
  `Recovery Days (East) = Zones x 1.5 x Age Factor x Sleep Factor
Recovery Days (West) = Zones x 1.0 x Age Factor x Sleep Factor`,
  ["jet-lag-calculator", "travel-budget-calculator", "time-zone-meeting-calculator"]
);

add(
  "travel-daily-budget-calculator",
  "Travel Daily Budget Calculator",
  "Plan your daily travel budget by destination cost level, travel style, and trip length to estimate total trip expenses.",
  "Finance",
  "finance",
  "$",
  ["travel daily budget", "trip cost planner", "per diem travel", "vacation daily spend"],
  [
    '{ name: "costLevel", label: "Destination Cost Level", type: "select", options: [{ value: "1", label: "Budget (SE Asia, Central America)" }, { value: "2", label: "Moderate (Eastern Europe, Mexico)" }, { value: "3", label: "Average (US, Spain, Italy)" }, { value: "4", label: "Expensive (UK, Japan, Australia)" }, { value: "5", label: "Very Expensive (Switzerland, Norway)" }], defaultValue: "3" }',
    '{ name: "travelStyle", label: "Travel Style", type: "select", options: [{ value: "1", label: "Backpacker" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Luxury" }], defaultValue: "2" }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 365, defaultValue: 10 }',
    '{ name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 2 }'
  ],
  `(inputs) => {
    const costLevel = parseInt(inputs.costLevel as string);
    const travelStyle = parseInt(inputs.travelStyle as string);
    const tripDays = inputs.tripDays as number;
    const travelers = inputs.travelers as number;
    const baseCosts = [25, 50, 100, 150, 200];
    const styleMult = [0.6, 1.0, 2.5];
    const dailyCostPP = baseCosts[costLevel - 1] * styleMult[travelStyle - 1];
    const dailyTotal = dailyCostPP * travelers;
    const tripTotal = dailyTotal * tripDays;
    const accommodation = Math.round(dailyCostPP * 0.4 * 100) / 100;
    const food = Math.round(dailyCostPP * 0.3 * 100) / 100;
    const transport = Math.round(dailyCostPP * 0.15 * 100) / 100;
    const activities = Math.round(dailyCostPP * 0.15 * 100) / 100;
    return {
      primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(tripTotal)) },
      details: [
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyCostPP)) },
        { label: "Accommodation/day/person", value: "$" + formatNumber(accommodation) },
        { label: "Food/day/person", value: "$" + formatNumber(food) },
        { label: "Transport/day/person", value: "$" + formatNumber(transport) },
        { label: "Activities/day/person", value: "$" + formatNumber(activities) }
      ]
    };
  }`,
  [
    { q: "How much should I budget per day for travel?", a: "Budget travelers can spend $30 to $50 per day in cheap destinations. Mid-range travelers typically spend $100 to $200 per day in average-cost countries." },
    { q: "What percentage of a travel budget goes to accommodation?", a: "Accommodation typically accounts for 30 to 50 percent of a daily travel budget, followed by food at 25 to 35 percent." },
    { q: "How can I reduce daily travel costs?", a: "Stay in hostels or guesthouses, eat local street food, use public transportation, travel in the off-season, and book attractions in advance for discounts." }
  ],
  `Daily Cost Per Person = Base Cost x Style Multiplier
Total Trip Cost = Daily Cost x Travelers x Trip Days`,
  ["travel-budget-calculator", "currency-exchange-calculator", "hotel-vs-airbnb-calculator"]
);

add(
  "cruise-cabin-cost-comparison-calculator",
  "Cruise Cabin Cost Comparison Calculator",
  "Compare the total cost of different cruise cabin types including per-night rates, gratuities, and onboard expenses.",
  "Finance",
  "finance",
  "$",
  ["cruise cabin cost", "cruise comparison", "cruise budget", "cruise fare calculator"],
  [
    '{ name: "cabinType", label: "Cabin Type", type: "select", options: [{ value: "1", label: "Interior" }, { value: "2", label: "Ocean View" }, { value: "3", label: "Balcony" }, { value: "4", label: "Suite" }], defaultValue: "2" }',
    '{ name: "nightlyRate", label: "Nightly Rate Per Person ($)", type: "number", min: 30, max: 2000, defaultValue: 150 }',
    '{ name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 }',
    '{ name: "passengers", label: "Number of Passengers", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "dailyOnboard", label: "Est. Daily Onboard Spending ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const cabinType = inputs.cabinType as string;
    const nightlyRate = inputs.nightlyRate as number;
    const cruiseNights = inputs.cruiseNights as number;
    const passengers = inputs.passengers as number;
    const dailyOnboard = inputs.dailyOnboard as number;
    const cabinNames: Record<string, string> = { "1": "Interior", "2": "Ocean View", "3": "Balcony", "4": "Suite" };
    const gratPerDay = 16;
    const fareCost = nightlyRate * cruiseNights * passengers;
    const totalGrat = gratPerDay * cruiseNights * passengers;
    const totalOnboard = dailyOnboard * cruiseNights * passengers;
    const portFees = 125 * passengers;
    const grandTotal = fareCost + totalGrat + totalOnboard + portFees;
    const perNightTotal = grandTotal / cruiseNights;
    return {
      primary: { label: "Total Cruise Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cabin Type", value: cabinNames[cabinType] || "Standard" },
        { label: "Fare Total", value: "$" + formatNumber(Math.round(fareCost)) },
        { label: "Gratuities", value: "$" + formatNumber(Math.round(totalGrat)) },
        { label: "Onboard Spending", value: "$" + formatNumber(Math.round(totalOnboard)) },
        { label: "Port Fees & Taxes", value: "$" + formatNumber(portFees) },
        { label: "Cost Per Night (all-in)", value: "$" + formatNumber(Math.round(perNightTotal)) }
      ]
    };
  }`,
  [
    { q: "How much does a cruise really cost per person?", a: "Beyond the advertised fare, expect to add $100 to $200 per person per day for gratuities, drinks, excursions, and onboard spending." },
    { q: "Are cruise gratuities mandatory?", a: "Most cruise lines automatically charge $14 to $20 per person per day in gratuities. You can sometimes adjust this amount at guest services." },
    { q: "Which cruise cabin type offers the best value?", a: "Interior cabins offer the lowest price point. Balcony cabins are often considered the best value since the added cost per night is modest for a significantly better experience." }
  ],
  `Grand Total = (Nightly Rate x Nights x Passengers) + Gratuities + Onboard Spending + Port Fees`,
  ["travel-budget-calculator", "hotel-vs-airbnb-calculator", "travel-insurance-value-calculator"]
);

add(
  "passport-renewal-timeline-calculator",
  "Passport Renewal Timeline Calculator",
  "Estimate passport processing time and costs based on processing speed, application type, and expediting options.",
  "Everyday",
  "everyday",
  "~",
  ["passport renewal", "passport processing time", "passport timeline", "passport expedite"],
  [
    '{ name: "processingType", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Routine (8-11 weeks)" }, { value: "2", label: "Expedited (5-7 weeks)" }, { value: "3", label: "Urgent/Agency (same day-2 weeks)" }], defaultValue: "1" }',
    '{ name: "applicationType", label: "Application Type", type: "select", options: [{ value: "1", label: "Adult Renewal (mail)" }, { value: "2", label: "First-Time Adult" }, { value: "3", label: "Child Under 16" }, { value: "4", label: "Lost/Stolen Replacement" }], defaultValue: "1" }',
    '{ name: "needPassportCard", label: "Add Passport Card?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$30)" }], defaultValue: "0" }',
    '{ name: "travelDate", label: "Days Until Travel", type: "number", min: 0, max: 365, defaultValue: 60 }'
  ],
  `(inputs) => {
    const processingType = parseInt(inputs.processingType as string);
    const applicationType = parseInt(inputs.applicationType as string);
    const needCard = inputs.needPassportCard as string;
    const travelDate = inputs.travelDate as number;
    const processingWeeks = [[8, 11], [5, 7], [0, 2]];
    const range = processingWeeks[processingType - 1] || [8, 11];
    const minDays = range[0] * 7;
    const maxDays = range[1] * 7;
    const baseFee = applicationType === 3 ? 100 : 130;
    const executionFee = applicationType === 1 ? 0 : 35;
    const expediteFee = processingType >= 2 ? 60 : 0;
    const cardFee = needCard === "1" ? 30 : 0;
    const totalCost = baseFee + executionFee + expediteFee + cardFee;
    const willArrive = travelDate >= minDays;
    return {
      primary: { label: "Total Passport Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Processing Time", value: formatNumber(range[0]) + " - " + formatNumber(range[1]) + " weeks" },
        { label: "Application Fee", value: "$" + formatNumber(baseFee) },
        { label: "Execution Fee", value: "$" + formatNumber(executionFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Ready Before Travel?", value: willArrive ? "Likely Yes" : "Cutting It Close - Consider Faster Option" }
      ]
    };
  }`,
  [
    { q: "How long does a passport renewal take?", a: "Routine processing takes 8 to 11 weeks. Expedited processing takes 5 to 7 weeks. Urgent processing at a passport agency can be done in 1 to 2 business days." },
    { q: "How much does a passport cost?", a: "An adult passport book costs $130 for renewal by mail, plus $35 execution fee for first-time applicants. Expediting adds $60." },
    { q: "Can I renew my passport if it expired over 5 years ago?", a: "If your passport expired more than 5 years ago, you must apply in person as a first-time applicant with new photos and documentation." }
  ],
  `Total Cost = Application Fee + Execution Fee + Expedite Fee + Card Fee
Processing Range varies by speed selected`,
  ["travel-budget-calculator", "travel-insurance-value-calculator", "currency-exchange-calculator"]
);

add(
  "airline-miles-value-calculator",
  "Airline Miles Value Calculator",
  "Calculate the monetary value of your airline miles and whether redeeming for a flight is worth it versus paying cash.",
  "Finance",
  "finance",
  "$",
  ["airline miles value", "frequent flyer points", "miles redemption", "miles worth calculator"],
  [
    '{ name: "milesRequired", label: "Miles Required for Redemption", type: "number", min: 1000, max: 500000, defaultValue: 25000 }',
    '{ name: "cashPrice", label: "Cash Price of Same Flight ($)", type: "number", min: 50, max: 20000, defaultValue: 350 }',
    '{ name: "taxesOnAward", label: "Taxes/Fees on Award Ticket ($)", type: "number", min: 0, max: 1000, defaultValue: 25 }',
    '{ name: "totalMilesBalance", label: "Your Total Miles Balance", type: "number", min: 0, max: 5000000, defaultValue: 50000 }'
  ],
  `(inputs) => {
    const milesRequired = inputs.milesRequired as number;
    const cashPrice = inputs.cashPrice as number;
    const taxesOnAward = inputs.taxesOnAward as number;
    const totalMilesBalance = inputs.totalMilesBalance as number;
    const netCashSavings = cashPrice - taxesOnAward;
    const centsPerMile = (netCashSavings / milesRequired) * 100;
    const remainingMiles = totalMilesBalance - milesRequired;
    const worthIt = centsPerMile >= 1.2;
    return {
      primary: { label: "Value Per Mile", value: formatNumber(Math.round(centsPerMile * 100) / 100) + " cents" },
      details: [
        { label: "Cash Savings", value: "$" + formatNumber(Math.round(netCashSavings)) },
        { label: "Redemption Worth It?", value: worthIt ? "Yes (above 1.2 cpp)" : "Below average value" },
        { label: "Remaining Miles", value: formatNumber(remainingMiles) },
        { label: "Miles Balance After", value: remainingMiles >= 0 ? formatNumber(remainingMiles) : "Not enough miles" }
      ]
    };
  }`,
  [
    { q: "How much is an airline mile worth?", a: "On average, airline miles are worth 1 to 2 cents each, though premium cabin international redemptions can yield 3 to 10 cents per mile." },
    { q: "When should I use miles instead of cash?", a: "Use miles when the redemption value exceeds 1.2 cents per mile, especially for premium cabin tickets or expensive routes where cash prices are high." },
    { q: "Do airline miles expire?", a: "Many programs no longer expire miles, but some still do after 18 to 24 months of account inactivity. Check your specific program rules." }
  ],
  `Value Per Mile (cents) = ((Cash Price - Award Taxes) / Miles Required) x 100`,
  ["points-value-calculator", "flight-cost-per-mile-calculator", "travel-budget-calculator"]
);

add(
  "hotel-points-value-calculator",
  "Hotel Points Value Calculator",
  "Determine the value of your hotel loyalty points by comparing point redemptions against cash rates.",
  "Finance",
  "finance",
  "$",
  ["hotel points value", "hotel loyalty", "hotel reward points", "hotel redemption value"],
  [
    '{ name: "pointsRequired", label: "Points Required Per Night", type: "number", min: 1000, max: 200000, defaultValue: 30000 }',
    '{ name: "cashRate", label: "Cash Rate Per Night ($)", type: "number", min: 30, max: 5000, defaultValue: 200 }',
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 3 }',
    '{ name: "freeNightThreshold", label: "Free Night After X Paid Nights", type: "number", min: 0, max: 10, defaultValue: 4 }'
  ],
  `(inputs) => {
    const pointsPerNight = inputs.pointsRequired as number;
    const cashRate = inputs.cashRate as number;
    const nights = inputs.nights as number;
    const freeNightThreshold = inputs.freeNightThreshold as number;
    const totalPointsNeeded = pointsPerNight * nights;
    const totalCashCost = cashRate * nights;
    const centsPerPoint = (cashRate / pointsPerNight) * 100;
    const freeNights = freeNightThreshold > 0 ? Math.floor(nights / freeNightThreshold) : 0;
    const freeNightSavings = freeNights * cashRate;
    const effectiveSavings = totalCashCost;
    return {
      primary: { label: "Point Value", value: formatNumber(Math.round(centsPerPoint * 100) / 100) + " cents/point" },
      details: [
        { label: "Total Points Needed", value: formatNumber(totalPointsNeeded) },
        { label: "Cash Equivalent", value: "$" + formatNumber(Math.round(totalCashCost)) },
        { label: "Bonus Free Nights Earned", value: formatNumber(freeNights) },
        { label: "Free Night Savings", value: "$" + formatNumber(Math.round(freeNightSavings)) }
      ]
    };
  }`,
  [
    { q: "How much are hotel points worth?", a: "Hotel points typically range from 0.4 to 1.2 cents per point. Marriott Bonvoy points average about 0.7 cents, Hilton Honors about 0.5 cents, and Hyatt points about 1.5 to 2 cents." },
    { q: "When should I use hotel points?", a: "Points are most valuable during peak seasons, at luxury properties, or when cash rates are high relative to the points required." },
    { q: "Do hotel points expire?", a: "Most hotel programs keep points active as long as you have account activity every 12 to 24 months, which includes earning or redeeming points." }
  ],
  `Cents Per Point = (Cash Rate Per Night / Points Per Night) x 100
Total Points Needed = Points Per Night x Nights`,
  ["points-value-calculator", "hotel-vs-airbnb-calculator", "travel-budget-calculator"]
);

add(
  "luggage-weight-converter-calculator",
  "Luggage Weight Converter Calculator",
  "Convert luggage weight between pounds and kilograms and check against common airline limits for carry-on and checked bags.",
  "Conversion",
  "conversion",
  "R",
  ["luggage weight converter", "baggage weight", "kg to lbs luggage", "airline weight limit"],
  [
    '{ name: "weight", label: "Luggage Weight", type: "number", min: 0.1, max: 200, defaultValue: 50 }',
    '{ name: "unit", label: "Weight Unit", type: "select", options: [{ value: "1", label: "Pounds (lb)" }, { value: "2", label: "Kilograms (kg)" }], defaultValue: "1" }',
    '{ name: "bagType", label: "Bag Type", type: "select", options: [{ value: "1", label: "Carry-On (limit ~15-22 lb / 7-10 kg)" }, { value: "2", label: "Checked Bag (limit ~50 lb / 23 kg)" }, { value: "3", label: "Oversize Checked (limit ~70 lb / 32 kg)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const unit = inputs.unit as string;
    const bagType = parseInt(inputs.bagType as string);
    const weightLb = unit === "1" ? weight : weight * 2.20462;
    const weightKg = unit === "2" ? weight : weight / 2.20462;
    const limits = [[22, 10], [50, 23], [70, 32]];
    const limit = limits[bagType - 1] || [50, 23];
    const overLb = weightLb - limit[0];
    const overKg = weightKg - limit[1];
    const isOver = weightLb > limit[0];
    const overweightFee = isOver ? (overLb > 20 ? 200 : 100) : 0;
    return {
      primary: { label: "Weight", value: formatNumber(Math.round(weightLb * 10) / 10) + " lb / " + formatNumber(Math.round(weightKg * 10) / 10) + " kg" },
      details: [
        { label: "Airline Limit", value: formatNumber(limit[0]) + " lb / " + formatNumber(limit[1]) + " kg" },
        { label: "Status", value: isOver ? "OVERWEIGHT by " + formatNumber(Math.round(overLb * 10) / 10) + " lb" : "Within limit" },
        { label: "Estimated Overweight Fee", value: "$" + formatNumber(overweightFee) },
        { label: "Weight to Remove", value: isOver ? formatNumber(Math.round(overLb * 10) / 10) + " lb / " + formatNumber(Math.round(overKg * 10) / 10) + " kg" : "None" }
      ]
    };
  }`,
  [
    { q: "What is the standard checked bag weight limit?", a: "Most airlines limit checked bags to 50 pounds (23 kg) for economy class. Business and first class often allow 70 pounds (32 kg)." },
    { q: "How much is the overweight baggage fee?", a: "Typically $100 for bags 51 to 70 pounds and $200 for bags 71 to 100 pounds, though fees vary by airline." },
    { q: "How do I weigh my luggage at home?", a: "Use a handheld luggage scale or stand on a bathroom scale holding your bag, then subtract your body weight." }
  ],
  `Kilograms = Pounds / 2.20462
Pounds = Kilograms x 2.20462`,
  ["luggage-weight-calculator", "travel-budget-calculator", "flight-cost-per-mile-calculator"]
);

add(
  "duty-free-savings-calculator",
  "Duty Free Savings Calculator",
  "Calculate potential savings on duty-free purchases versus domestic retail prices including tax exemptions.",
  "Finance",
  "finance",
  "$",
  ["duty free savings", "tax free shopping", "airport shopping savings", "duty free value"],
  [
    '{ name: "retailPrice", label: "Retail Price at Home ($)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "dutyFreePrice", label: "Duty Free Price ($)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "localTaxRate", label: "Local Sales Tax Rate (%)", type: "number", min: 0, max: 25, defaultValue: 8.5 }',
    '{ name: "quantity", label: "Quantity", type: "number", min: 1, max: 50, defaultValue: 1 }',
    '{ name: "dutyAllowance", label: "Duty Exemption Allowance ($)", type: "number", min: 0, max: 10000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const retailPrice = inputs.retailPrice as number;
    const dutyFreePrice = inputs.dutyFreePrice as number;
    const localTaxRate = inputs.localTaxRate as number;
    const quantity = inputs.quantity as number;
    const dutyAllowance = inputs.dutyAllowance as number;
    const retailTotal = retailPrice * quantity * (1 + localTaxRate / 100);
    const dfTotal = dutyFreePrice * quantity;
    const savings = retailTotal - dfTotal;
    const savingsPct = (savings / retailTotal) * 100;
    const overAllowance = Math.max(dfTotal - dutyAllowance, 0);
    const dutyOwed = overAllowance * 0.03;
    const netSavings = savings - dutyOwed;
    return {
      primary: { label: "Net Savings", value: "$" + formatNumber(Math.round(netSavings * 100) / 100) },
      details: [
        { label: "Retail Total (with tax)", value: "$" + formatNumber(Math.round(retailTotal * 100) / 100) },
        { label: "Duty Free Total", value: "$" + formatNumber(Math.round(dfTotal * 100) / 100) },
        { label: "Savings Percentage", value: formatNumber(Math.round(savingsPct * 10) / 10) + "%" },
        { label: "Over Duty Allowance", value: "$" + formatNumber(Math.round(overAllowance)) },
        { label: "Estimated Duty Owed", value: "$" + formatNumber(Math.round(dutyOwed * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "Is duty free really cheaper?", a: "Duty free items save you the local sales tax and sometimes import duties. Savings are typically 10 to 30 percent on alcohol, tobacco, and perfume but less on electronics." },
    { q: "What is the US duty free allowance?", a: "US residents returning from abroad can bring back $800 worth of goods duty-free. The next $1,000 is taxed at a flat 3 percent rate." },
    { q: "What items are best to buy duty free?", a: "Spirits, wine, cigarettes, perfume, and luxury cosmetics offer the best savings duty free since they carry the highest domestic taxes." }
  ],
  `Net Savings = (Retail Price x (1 + Tax Rate) x Qty) - (Duty Free Price x Qty) - Duty Owed`,
  ["travel-budget-calculator", "currency-exchange-calculator", "travel-insurance-value-calculator"]
);

add(
  "visa-processing-time-calculator",
  "Visa Processing Time Calculator",
  "Estimate visa processing times and costs based on destination, visa type, and application method.",
  "Everyday",
  "everyday",
  "~",
  ["visa processing time", "visa application", "visa cost estimator", "visa timeline"],
  [
    '{ name: "visaType", label: "Visa Type", type: "select", options: [{ value: "1", label: "Tourist/Visitor" }, { value: "2", label: "Business" }, { value: "3", label: "Student" }, { value: "4", label: "Work/Employment" }, { value: "5", label: "Transit" }], defaultValue: "1" }',
    '{ name: "processing", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Standard" }, { value: "2", label: "Expedited" }, { value: "3", label: "Rush/Premium" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Application Complexity", type: "select", options: [{ value: "1", label: "Simple (e-Visa available)" }, { value: "2", label: "Moderate (embassy required)" }, { value: "3", label: "Complex (interview required)" }], defaultValue: "2" }',
    '{ name: "daysUntilTrip", label: "Days Until Trip", type: "number", min: 1, max: 365, defaultValue: 45 }'
  ],
  `(inputs) => {
    const visaType = parseInt(inputs.visaType as string);
    const processing = parseInt(inputs.processing as string);
    const complexity = parseInt(inputs.complexity as string);
    const daysUntilTrip = inputs.daysUntilTrip as number;
    const baseWeeks = [[2, 4], [3, 6], [4, 8], [6, 16], [1, 2]];
    const range = baseWeeks[visaType - 1] || [2, 4];
    const speedMult = [1, 0.6, 0.3][processing - 1] || 1;
    const complexMult = [0.5, 1, 1.5][complexity - 1] || 1;
    const minWeeks = Math.max(Math.round(range[0] * speedMult * complexMult * 10) / 10, 0.5);
    const maxWeeks = Math.round(range[1] * speedMult * complexMult * 10) / 10;
    const baseFee = [50, 80, 100, 200, 30][visaType - 1] || 50;
    const expediteFee = processing === 2 ? 50 : processing === 3 ? 150 : 0;
    const totalFee = baseFee + expediteFee;
    const enoughTime = daysUntilTrip >= minWeeks * 7;
    return {
      primary: { label: "Estimated Processing Time", value: formatNumber(minWeeks) + " - " + formatNumber(maxWeeks) + " weeks" },
      details: [
        { label: "Application Fee", value: "$" + formatNumber(totalFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Apply By Date", value: "At least " + formatNumber(Math.round(maxWeeks * 7)) + " days before travel" },
        { label: "Enough Time?", value: enoughTime ? "Yes" : "Apply immediately or expedite" }
      ]
    };
  }`,
  [
    { q: "How long does a tourist visa take to process?", a: "Tourist visas typically take 2 to 6 weeks for standard processing. E-visas for many countries can be processed in 1 to 5 business days." },
    { q: "How much does a visa application cost?", a: "Tourist visas range from $20 to $200 depending on the destination. US B1/B2 visas cost $185, Schengen visas cost about 80 euros." },
    { q: "Can I expedite my visa application?", a: "Many countries offer expedited processing for an additional fee, typically cutting processing time in half. Some premium services guarantee processing within days." }
  ],
  `Processing Time = Base Weeks x Speed Multiplier x Complexity Factor
Total Cost = Base Fee + Expedite Fee`,
  ["passport-renewal-timeline-calculator", "travel-budget-calculator", "travel-insurance-value-calculator"]
);

add(
  "international-calling-cost-calculator",
  "International Calling Cost Calculator",
  "Compare the cost of international calls using different methods including carrier, VoIP, and calling cards.",
  "Everyday",
  "everyday",
  "~",
  ["international calling cost", "overseas call rates", "calling abroad", "roaming charges"],
  [
    '{ name: "minutesPerDay", label: "Minutes Per Day", type: "number", min: 1, max: 300, defaultValue: 15 }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 180, defaultValue: 14 }',
    '{ name: "carrierRate", label: "Carrier Rate ($/min)", type: "number", min: 0.01, max: 10, defaultValue: 1.5 }',
    '{ name: "voipRate", label: "VoIP/WiFi Rate ($/min)", type: "number", min: 0, max: 2, defaultValue: 0.02 }',
    '{ name: "internationalPlan", label: "Carrier Int'l Plan ($/day)", type: "number", min: 0, max: 20, defaultValue: 10 }'
  ],
  `(inputs) => {
    const minutesPerDay = inputs.minutesPerDay as number;
    const tripDays = inputs.tripDays as number;
    const carrierRate = inputs.carrierRate as number;
    const voipRate = inputs.voipRate as number;
    const internationalPlan = inputs.internationalPlan as number;
    const totalMinutes = minutesPerDay * tripDays;
    const carrierCost = totalMinutes * carrierRate;
    const voipCost = totalMinutes * voipRate;
    const planCost = internationalPlan * tripDays;
    const cheapest = Math.min(carrierCost, voipCost, planCost);
    const bestOption = cheapest === voipCost ? "VoIP/WiFi Calling" : cheapest === planCost ? "International Plan" : "Pay-Per-Minute";
    return {
      primary: { label: "Best Option Cost", value: "$" + formatNumber(Math.round(cheapest * 100) / 100) },
      details: [
        { label: "Best Option", value: bestOption },
        { label: "Carrier Pay-Per-Minute", value: "$" + formatNumber(Math.round(carrierCost * 100) / 100) },
        { label: "VoIP/WiFi Calling", value: "$" + formatNumber(Math.round(voipCost * 100) / 100) },
        { label: "International Plan", value: "$" + formatNumber(Math.round(planCost * 100) / 100) },
        { label: "Total Minutes", value: formatNumber(totalMinutes) }
      ]
    };
  }`,
  [
    { q: "What is the cheapest way to call internationally?", a: "VoIP apps like WhatsApp, Skype, and FaceTime over WiFi are virtually free. For calls to landlines, services like Google Voice or Skype credit cost 1 to 5 cents per minute." },
    { q: "How much do international roaming charges cost?", a: "Without a plan, carrier roaming charges can be $1 to $5 per minute. Most carriers offer international day passes for $5 to $12 per day." },
    { q: "Should I get a local SIM card when traveling?", a: "A local SIM card is often the cheapest option for extended trips, providing local rates and data. Many countries offer tourist SIM cards for $10 to $30." }
  ],
  `Carrier Cost = Minutes/Day x Trip Days x Carrier Rate
VoIP Cost = Total Minutes x VoIP Rate
Plan Cost = Daily Plan Fee x Trip Days`,
  ["travel-budget-calculator", "travel-daily-budget-calculator", "currency-exchange-calculator"]
);

add(
  "travel-vaccination-cost-calculator",
  "Travel Vaccination Cost Calculator",
  "Estimate the total cost of required and recommended travel vaccinations for your destination.",
  "Health",
  "health",
  "H",
  ["travel vaccination cost", "travel immunization", "travel health", "vaccine cost estimator"],
  [
    '{ name: "numVaccines", label: "Number of Vaccines Needed", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "avgCostPerVaccine", label: "Average Cost Per Vaccine ($)", type: "number", min: 20, max: 500, defaultValue: 150 }',
    '{ name: "consultFee", label: "Travel Clinic Consultation ($)", type: "number", min: 0, max: 300, defaultValue: 50 }',
    '{ name: "malariaWeeks", label: "Weeks of Malaria Prophylaxis", type: "number", min: 0, max: 52, defaultValue: 0 }',
    '{ name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const numVaccines = inputs.numVaccines as number;
    const avgCost = inputs.avgCostPerVaccine as number;
    const consultFee = inputs.consultFee as number;
    const malariaWeeks = inputs.malariaWeeks as number;
    const travelers = inputs.travelers as number;
    const vaccineCost = numVaccines * avgCost;
    const malariaCost = malariaWeeks > 0 ? malariaWeeks * 12 : 0;
    const perPersonTotal = vaccineCost + consultFee + malariaCost;
    const grandTotal = perPersonTotal * travelers;
    return {
      primary: { label: "Total Vaccination Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Vaccines Cost", value: "$" + formatNumber(Math.round(vaccineCost * travelers)) },
        { label: "Consultation Fee", value: "$" + formatNumber(Math.round(consultFee * travelers)) },
        { label: "Malaria Prophylaxis", value: "$" + formatNumber(Math.round(malariaCost * travelers)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPersonTotal)) }
      ]
    };
  }`,
  [
    { q: "Which travel vaccines are most expensive?", a: "Yellow Fever ($200 to $350), Japanese Encephalitis ($300 to $400 for the series), and Rabies ($300 to $800 for the 3-dose series) are typically the most expensive." },
    { q: "Does insurance cover travel vaccinations?", a: "Some insurance plans cover recommended travel vaccines. Hepatitis A and B, Tdap, and flu shots are often covered, but yellow fever and Japanese encephalitis usually are not." },
    { q: "How far in advance should I get travel vaccines?", a: "Ideally 4 to 8 weeks before travel. Some vaccines require multiple doses over several weeks to be fully effective." }
  ],
  `Total Cost = (Vaccines x Avg Cost + Consultation + Malaria Meds) x Travelers`,
  ["travel-budget-calculator", "travel-insurance-value-calculator", "travel-daily-budget-calculator"]
);

add(
  "airport-parking-cost-calculator",
  "Airport Parking Cost Calculator",
  "Compare airport parking costs across different options including economy, garage, valet, and off-site lots.",
  "Finance",
  "finance",
  "$",
  ["airport parking cost", "airport parking comparison", "long term parking", "airport parking rates"],
  [
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 60, defaultValue: 7 }',
    '{ name: "economyRate", label: "Economy Lot Daily Rate ($)", type: "number", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "garageRate", label: "Garage Daily Rate ($)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "offSiteRate", label: "Off-Site Lot Daily Rate ($)", type: "number", min: 2, max: 25, defaultValue: 7 }',
    '{ name: "rideshareEach", label: "Rideshare Each Way ($)", type: "number", min: 10, max: 150, defaultValue: 35 }'
  ],
  `(inputs) => {
    const tripDays = inputs.tripDays as number;
    const economyRate = inputs.economyRate as number;
    const garageRate = inputs.garageRate as number;
    const offSiteRate = inputs.offSiteRate as number;
    const rideshareEach = inputs.rideshareEach as number;
    const economyTotal = economyRate * tripDays;
    const garageTotal = garageRate * tripDays;
    const offSiteTotal = offSiteRate * tripDays;
    const rideshareTotal = rideshareEach * 2;
    const cheapest = Math.min(economyTotal, garageTotal, offSiteTotal, rideshareTotal);
    const bestOption = cheapest === rideshareTotal ? "Rideshare" : cheapest === offSiteTotal ? "Off-Site Lot" : cheapest === economyTotal ? "Economy Lot" : "Garage";
    return {
      primary: { label: "Best Option", value: bestOption + " - $" + formatNumber(Math.round(cheapest)) },
      details: [
        { label: "Economy Lot", value: "$" + formatNumber(Math.round(economyTotal)) },
        { label: "Garage Parking", value: "$" + formatNumber(Math.round(garageTotal)) },
        { label: "Off-Site Lot", value: "$" + formatNumber(Math.round(offSiteTotal)) },
        { label: "Rideshare (round trip)", value: "$" + formatNumber(Math.round(rideshareTotal)) },
        { label: "Savings vs Garage", value: "$" + formatNumber(Math.round(garageTotal - cheapest)) }
      ]
    };
  }`,
  [
    { q: "How much does airport parking cost?", a: "Airport parking ranges from $5 to $15 per day for economy lots, $15 to $40 per day for covered garages, and $3 to $10 per day for off-site lots with shuttles." },
    { q: "When is rideshare cheaper than parking?", a: "Rideshare is typically cheaper than parking for trips of 3 days or fewer, especially at airports with expensive parking." },
    { q: "How can I save on airport parking?", a: "Book online in advance for discounts, use off-site lots with shuttle service, compare rates on apps, or use airport loyalty programs that include free parking perks." }
  ],
  `Option Cost = Daily Rate x Trip Days
Rideshare Cost = Per Trip Rate x 2`,
  ["travel-budget-calculator", "commute-cost-calculator", "road-trip-cost-calculator"]
);

add(
  "road-trip-fuel-planner-calculator",
  "Road Trip Fuel Planner Calculator",
  "Plan fuel stops and total fuel costs for a road trip based on distance, vehicle efficiency, and tank size.",
  "Everyday",
  "everyday",
  "~",
  ["road trip fuel planner", "gas stop planner", "fuel stop calculator", "road trip gas cost"],
  [
    '{ name: "totalDistance", label: "Total Trip Distance (miles)", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 5, max: 100, defaultValue: 28 }',
    '{ name: "tankSize", label: "Tank Size (gallons)", type: "number", min: 5, max: 50, defaultValue: 14 }',
    '{ name: "gasPrice", label: "Avg Gas Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 3.5 }',
    '{ name: "refillAt", label: "Refill at % Tank Remaining", type: "number", min: 5, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const totalDistance = inputs.totalDistance as number;
    const mpg = inputs.mpg as number;
    const tankSize = inputs.tankSize as number;
    const gasPrice = inputs.gasPrice as number;
    const refillAt = inputs.refillAt as number;
    const rangePerTank = mpg * tankSize;
    const usableRange = rangePerTank * (1 - refillAt / 100);
    const totalGallons = totalDistance / mpg;
    const totalFuelCost = totalGallons * gasPrice;
    const numStops = Math.max(Math.ceil(totalDistance / usableRange) - 1, 0);
    const milesPerStop = numStops > 0 ? Math.round(totalDistance / (numStops + 1)) : totalDistance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalFuelCost * 100) / 100) },
      details: [
        { label: "Total Gallons Needed", value: formatNumber(Math.round(totalGallons * 10) / 10) },
        { label: "Range Per Tank", value: formatNumber(Math.round(rangePerTank)) + " miles" },
        { label: "Fuel Stops Needed", value: formatNumber(numStops) },
        { label: "Avg Miles Between Stops", value: formatNumber(milesPerStop) + " miles" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(gasPrice / mpg * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fuel cost for a road trip?", a: "Divide total distance by your vehicle MPG to get gallons needed, then multiply by the average gas price along your route." },
    { q: "How often should I stop for gas on a road trip?", a: "Plan stops when your tank reaches about a quarter full. In remote areas, fill up whenever possible as stations may be far apart." },
    { q: "Does highway driving use more or less fuel?", a: "Most vehicles are most efficient at 45 to 65 mph. Highway driving at moderate speeds is typically more fuel efficient than city driving, but speeds above 65 mph reduce efficiency." }
  ],
  `Total Gallons = Distance / MPG
Total Fuel Cost = Total Gallons x Gas Price
Stops = ceil(Distance / Usable Range) - 1`,
  ["road-trip-cost-calculator", "commute-cost-calculator", "travel-budget-calculator"]
);

add(
  "flight-carbon-offset-calculator",
  "Flight Carbon Offset Calculator",
  "Calculate the carbon emissions from your flight and the cost to offset them through carbon credits.",
  "Science",
  "science",
  "A",
  ["flight carbon offset", "aviation emissions", "CO2 flight calculator", "carbon credit flight"],
  [
    '{ name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 2500 }',
    '{ name: "cabinClass", label: "Cabin Class", type: "select", options: [{ value: "1", label: "Economy" }, { value: "2", label: "Premium Economy" }, { value: "3", label: "Business" }, { value: "4", label: "First Class" }], defaultValue: "1" }',
    '{ name: "roundTrip", label: "Round Trip?", type: "select", options: [{ value: "1", label: "One Way" }, { value: "2", label: "Round Trip" }], defaultValue: "2" }',
    '{ name: "offsetPrice", label: "Carbon Offset Price ($/ton CO2)", type: "number", min: 5, max: 100, defaultValue: 15 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const cabinClass = parseInt(inputs.cabinClass as string);
    const roundTrip = inputs.roundTrip as string;
    const offsetPrice = inputs.offsetPrice as number;
    const distKm = distance * 1.60934;
    const multiplier = roundTrip === "2" ? 2 : 1;
    const classFactor = [1, 1.6, 2.9, 4.0][cabinClass - 1] || 1;
    const emissionFactor = distKm < 1500 ? 0.000255 : distKm < 4000 ? 0.000195 : 0.000170;
    const co2Tons = (distKm * emissionFactor * classFactor * multiplier);
    const offsetCost = co2Tons * offsetPrice;
    const treesEquivalent = Math.round(co2Tons / 0.022);
    return {
      primary: { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons * 100) / 100) + " metric tons" },
      details: [
        { label: "Offset Cost", value: "$" + formatNumber(Math.round(offsetCost * 100) / 100) },
        { label: "Distance", value: formatNumber(Math.round(distKm)) + " km (" + formatNumber(distance) + " mi)" },
        { label: "Class Multiplier", value: formatNumber(classFactor) + "x" },
        { label: "Equivalent Trees for 1 Year", value: formatNumber(treesEquivalent) + " trees" }
      ]
    };
  }`,
  [
    { q: "How much CO2 does a flight produce?", a: "A round-trip economy flight from New York to London produces about 1 to 1.5 metric tons of CO2 per passenger, roughly equal to driving 3,000 to 4,000 miles." },
    { q: "Why does business class have higher emissions?", a: "Premium cabins take up more floor space per passenger, meaning fewer people per flight. Business class produces about 3 times more emissions per passenger than economy." },
    { q: "Do carbon offsets actually help?", a: "Quality carbon offsets fund projects like reforestation and renewable energy. Look for Gold Standard or Verified Carbon Standard certifications for credible offsets." }
  ],
  `CO2 (tons) = Distance (km) x Emission Factor x Class Factor x Trip Multiplier
Offset Cost = CO2 Tons x Price Per Ton`,
  ["carbon-footprint-calculator", "tree-planting-offset-calculator", "travel-budget-calculator"]
);

add(
  "timezone-overlap-calculator",
  "Timezone Overlap Calculator",
  "Find overlapping working hours between two time zones for scheduling meetings with international contacts.",
  "Everyday",
  "everyday",
  "~",
  ["timezone overlap", "time zone meeting planner", "international meeting time", "working hours overlap"],
  [
    '{ name: "yourOffset", label: "Your UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: -5 }',
    '{ name: "theirOffset", label: "Their UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: 1 }',
    '{ name: "workStart", label: "Work Day Start Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 9 }',
    '{ name: "workEnd", label: "Work Day End Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 17 }'
  ],
  `(inputs) => {
    const yourOffset = inputs.yourOffset as number;
    const theirOffset = inputs.theirOffset as number;
    const workStart = inputs.workStart as number;
    const workEnd = inputs.workEnd as number;
    const diff = theirOffset - yourOffset;
    const theirStartInYourTime = workStart + diff;
    const theirEndInYourTime = workEnd + diff;
    const overlapStart = Math.max(workStart, theirStartInYourTime);
    const overlapEnd = Math.min(workEnd, theirEndInYourTime);
    const overlapHours = Math.max(overlapEnd - overlapStart, 0);
    const formatHour = (h: number) => {
      const normalized = ((h % 24) + 24) % 24;
      const ampm = normalized >= 12 ? "PM" : "AM";
      const hour12 = normalized % 12 || 12;
      return hour12 + ":00 " + ampm;
    };
    return {
      primary: { label: "Overlapping Work Hours", value: formatNumber(overlapHours) + " hours" },
      details: [
        { label: "Time Difference", value: formatNumber(Math.abs(diff)) + " hours " + (diff > 0 ? "ahead" : "behind") },
        { label: "Your Working Hours", value: formatHour(workStart) + " - " + formatHour(workEnd) },
        { label: "Their Hours (your time)", value: formatHour(theirStartInYourTime) + " - " + formatHour(theirEndInYourTime) },
        { label: "Best Meeting Window", value: overlapHours > 0 ? formatHour(overlapStart) + " - " + formatHour(overlapEnd) + " your time" : "No overlap" }
      ]
    };
  }`,
  [
    { q: "How do I find overlapping work hours across time zones?", a: "Convert both schedules to the same time zone, then find the intersection of working hours. Tools and calculators can automate this." },
    { q: "What is the biggest time difference possible?", a: "The maximum time difference is 26 hours, between UTC-12 (Baker Island) and UTC+14 (Line Islands, Kiribati)." },
    { q: "How do I handle meetings across many time zones?", a: "Rotate meeting times to share the inconvenience, use async communication when possible, and record meetings for those who cannot attend live." }
  ],
  `Time Difference = Their Offset - Your Offset
Overlap = max(0, min(Your End, Their End in Your Time) - max(Your Start, Their Start in Your Time))`,
  ["time-zone-meeting-calculator", "travel-budget-calculator", "jet-lag-recovery-time-calculator"]
);

add(
  "sailing-distance-calculator",
  "Sailing Distance Calculator",
  "Calculate sailing time and distance between waypoints based on boat speed, wind conditions, and current.",
  "Everyday",
  "everyday",
  "~",
  ["sailing distance", "nautical distance", "sailing time", "boat trip planner"],
  [
    '{ name: "distance", label: "Distance (nautical miles)", type: "number", min: 1, max: 5000, defaultValue: 120 }',
    '{ name: "boatSpeed", label: "Hull Speed / Avg Speed (knots)", type: "number", min: 1, max: 30, defaultValue: 6 }',
    '{ name: "currentKnots", label: "Current (knots, negative=against)", type: "number", min: -5, max: 5, defaultValue: 0.5 }',
    '{ name: "windEffect", label: "Wind Effect on Speed (%)", type: "number", min: -50, max: 50, defaultValue: 10 }',
    '{ name: "hoursPerDay", label: "Sailing Hours Per Day", type: "number", min: 4, max: 24, defaultValue: 10 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const boatSpeed = inputs.boatSpeed as number;
    const currentKnots = inputs.currentKnots as number;
    const windEffect = inputs.windEffect as number;
    const hoursPerDay = inputs.hoursPerDay as number;
    const effectiveSpeed = Math.max((boatSpeed * (1 + windEffect / 100)) + currentKnots, 0.5);
    const totalHours = distance / effectiveSpeed;
    const sailingDays = totalHours / hoursPerDay;
    const distStatute = distance * 1.15078;
    const distKm = distance * 1.852;
    return {
      primary: { label: "Total Sailing Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Sailing Days", value: formatNumber(Math.round(sailingDays * 10) / 10) + " days" },
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed * 10) / 10) + " knots" },
        { label: "Distance (statute miles)", value: formatNumber(Math.round(distStatute * 10) / 10) },
        { label: "Distance (km)", value: formatNumber(Math.round(distKm * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "How fast does a sailboat travel?", a: "Cruising sailboats average 5 to 8 knots. Racing sailboats can exceed 15 knots. A boat's hull speed in knots is approximately 1.34 times the square root of waterline length in feet." },
    { q: "How far can a sailboat travel in a day?", a: "A typical cruising sailboat covers 100 to 150 nautical miles per day in favorable conditions, sailing for 20 to 24 hours." },
    { q: "How does current affect sailing time?", a: "Favorable currents of 1 to 2 knots can significantly reduce travel time, while adverse currents can add hours or days to a passage." }
  ],
  `Effective Speed = (Boat Speed x (1 + Wind Effect%)) + Current
Sailing Time = Distance / Effective Speed
Sailing Days = Total Hours / Hours Per Day`,
  ["boat-fuel-consumption-calculator", "hull-speed-calculator", "anchor-rode-calculator"]
);

add(
  "nautical-mile-converter-calculator",
  "Nautical Mile Converter Calculator",
  "Convert distances between nautical miles, statute miles, kilometers, and meters for marine and aviation use.",
  "Conversion",
  "conversion",
  "R",
  ["nautical mile converter", "nm to miles", "nm to km", "maritime distance converter"],
  [
    '{ name: "value", label: "Distance Value", type: "number", min: 0.01, max: 100000, defaultValue: 100 }',
    '{ name: "fromUnit", label: "Convert From", type: "select", options: [{ value: "1", label: "Nautical Miles (nm)" }, { value: "2", label: "Statute Miles (mi)" }, { value: "3", label: "Kilometers (km)" }, { value: "4", label: "Meters (m)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const value = inputs.value as number;
    const fromUnit = inputs.fromUnit as string;
    let nm = 0;
    if (fromUnit === "1") nm = value;
    else if (fromUnit === "2") nm = value / 1.15078;
    else if (fromUnit === "3") nm = value / 1.852;
    else nm = value / 1852;
    const mi = nm * 1.15078;
    const km = nm * 1.852;
    const m = nm * 1852;
    const ft = m * 3.28084;
    return {
      primary: { label: "Nautical Miles", value: formatNumber(Math.round(nm * 10000) / 10000) + " nm" },
      details: [
        { label: "Statute Miles", value: formatNumber(Math.round(mi * 10000) / 10000) + " mi" },
        { label: "Kilometers", value: formatNumber(Math.round(km * 10000) / 10000) + " km" },
        { label: "Meters", value: formatNumber(Math.round(m * 100) / 100) + " m" },
        { label: "Feet", value: formatNumber(Math.round(ft * 100) / 100) + " ft" }
      ]
    };
  }`,
  [
    { q: "What is a nautical mile?", a: "A nautical mile is 1,852 meters or 1.15078 statute miles. It is based on one minute of arc of latitude on Earth, making it useful for navigation." },
    { q: "Why do ships and planes use nautical miles?", a: "Nautical miles correspond directly to degrees of latitude, making chart-based navigation easier. One degree of latitude equals 60 nautical miles." },
    { q: "What is a knot?", a: "A knot is one nautical mile per hour. The term comes from the old practice of counting knots on a rope trailing behind a ship to measure speed." }
  ],
  `1 Nautical Mile = 1.15078 Statute Miles = 1.852 Kilometers = 1,852 Meters`,
  ["sailing-distance-calculator", "hull-speed-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "flight-layover-optimizer-calculator",
  "Flight Layover Optimizer Calculator",
  "Evaluate whether a layover is worth it by comparing total travel time and savings against a direct flight.",
  "Finance",
  "finance",
  "$",
  ["layover optimizer", "flight connection", "layover worth it", "flight savings layover"],
  [
    '{ name: "directPrice", label: "Direct Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 600 }',
    '{ name: "layoverPrice", label: "Layover Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 350 }',
    '{ name: "directHours", label: "Direct Flight Time (hours)", type: "number", min: 0.5, max: 24, defaultValue: 5 }',
    '{ name: "layoverTotalHours", label: "Layover Total Travel Time (hours)", type: "number", min: 1, max: 48, defaultValue: 10 }',
    '{ name: "hourlyValue", label: "Value of Your Time ($/hour)", type: "number", min: 10, max: 500, defaultValue: 40 }'
  ],
  `(inputs) => {
    const directPrice = inputs.directPrice as number;
    const layoverPrice = inputs.layoverPrice as number;
    const directHours = inputs.directHours as number;
    const layoverTotalHours = inputs.layoverTotalHours as number;
    const hourlyValue = inputs.hourlyValue as number;
    const priceSavings = directPrice - layoverPrice;
    const extraHours = layoverTotalHours - directHours;
    const timeCost = extraHours * hourlyValue;
    const netSavings = priceSavings - timeCost;
    const worthIt = netSavings > 0;
    const breakEvenHourlyValue = extraHours > 0 ? priceSavings / extraHours : 0;
    return {
      primary: { label: "Net Savings", value: "$" + formatNumber(Math.round(netSavings)) },
      details: [
        { label: "Price Savings", value: "$" + formatNumber(Math.round(priceSavings)) },
        { label: "Extra Travel Time", value: formatNumber(Math.round(extraHours * 10) / 10) + " hours" },
        { label: "Time Cost", value: "$" + formatNumber(Math.round(timeCost)) },
        { label: "Worth It?", value: worthIt ? "Yes - Take the Layover" : "No - Take the Direct Flight" },
        { label: "Break-Even Time Value", value: "$" + formatNumber(Math.round(breakEvenHourlyValue)) + "/hour" }
      ]
    };
  }`,
  [
    { q: "When is a layover worth the savings?", a: "A layover is worth it when the ticket savings exceed the value of your extra time spent traveling. Consider fatigue, missed connection risk, and stress in your calculation." },
    { q: "What is a good layover length?", a: "Domestic layovers of 1 to 2 hours are ideal. International layovers should be at least 2 to 3 hours for customs and terminal changes." },
    { q: "What happens if I miss a connection?", a: "If booked on one ticket, the airline will rebook you on the next available flight. If on separate tickets, you bear the cost and risk of rebooking." }
  ],
  `Net Savings = (Direct Price - Layover Price) - (Extra Hours x Hourly Value)
Break-Even Value = Price Savings / Extra Hours`,
  ["flight-cost-per-mile-calculator", "travel-budget-calculator", "airline-miles-value-calculator"]
);

add(
  "travel-tip-by-country-calculator",
  "Travel Tip by Country Calculator",
  "Calculate appropriate tip amounts based on country tipping customs, service type, and bill amount.",
  "Everyday",
  "everyday",
  "~",
  ["travel tipping", "tip by country", "international tipping", "tipping customs abroad"],
  [
    '{ name: "region", label: "Region/Country", type: "select", options: [{ value: "1", label: "USA/Canada (15-20%)" }, { value: "2", label: "UK/Ireland (10-15%)" }, { value: "3", label: "Western Europe (5-10%)" }, { value: "4", label: "Japan/Korea (0% - Not Expected)" }, { value: "5", label: "Middle East (10-15%)" }, { value: "6", label: "Latin America (10%)" }, { value: "7", label: "Australia/NZ (0-10%)" }, { value: "8", label: "Southeast Asia (5-10%)" }], defaultValue: "1" }',
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1", label: "Restaurant" }, { value: "2", label: "Taxi/Driver" }, { value: "3", label: "Hotel Porter" }, { value: "4", label: "Tour Guide" }], defaultValue: "1" }',
    '{ name: "billAmount", label: "Bill Amount (local currency)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "serviceQuality", label: "Service Quality", type: "select", options: [{ value: "1", label: "Below Average" }, { value: "2", label: "Average" }, { value: "3", label: "Excellent" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const region = parseInt(inputs.region as string);
    const serviceType = parseInt(inputs.serviceType as string);
    const billAmount = inputs.billAmount as number;
    const serviceQuality = parseInt(inputs.serviceQuality as string);
    const tipRanges: Record<number, number[]> = {
      1: [15, 18, 22], 2: [10, 12, 15], 3: [5, 8, 10],
      4: [0, 0, 0], 5: [10, 12, 15], 6: [8, 10, 12],
      7: [0, 5, 10], 8: [5, 8, 10]
    };
    const ranges = tipRanges[region] || [10, 15, 20];
    const tipPct = ranges[serviceQuality - 1] || ranges[1];
    const tipAmount = billAmount * (tipPct / 100);
    const totalBill = billAmount + tipAmount;
    const notes: Record<number, string> = {
      1: "Tipping is expected and customary",
      2: "Check if service charge is included",
      3: "Small tips appreciated, not required",
      4: "Tipping can be considered rude",
      5: "Tipping is appreciated",
      6: "Tipping is appreciated but not mandatory",
      7: "Tipping is not expected but appreciated",
      8: "Small tips for good service"
    };
    return {
      primary: { label: "Recommended Tip", value: formatNumber(Math.round(tipAmount * 100) / 100) },
      details: [
        { label: "Tip Percentage", value: formatNumber(tipPct) + "%" },
        { label: "Total with Tip", value: formatNumber(Math.round(totalBill * 100) / 100) },
        { label: "Cultural Note", value: notes[region] || "Ask locally" }
      ]
    };
  }`,
  [
    { q: "Should I tip in Japan?", a: "Tipping is generally not practiced in Japan and can sometimes be considered rude. Excellent service is the cultural standard and does not require a monetary reward." },
    { q: "Is tipping expected in Europe?", a: "In most of Western Europe, a 5 to 10 percent tip is appreciated but not mandatory. Many restaurants include a service charge. Check your bill before adding extra." },
    { q: "How much should I tip a tour guide?", a: "In the US, tip tour guides $5 to $10 per person for a half-day tour and $10 to $20 for a full day. In other countries, $2 to $5 per person is common." }
  ],
  `Tip Amount = Bill Amount x (Tip Percentage / 100)
Total = Bill Amount + Tip Amount`,
  ["tipping-etiquette-calculator", "travel-daily-budget-calculator", "currency-exchange-calculator"]
);

add(
  "backpacking-gear-weight-calculator",
  "Backpacking Gear Weight Calculator",
  "Calculate your total pack weight including base weight, consumables, and worn items to optimize your backpacking load.",
  "Everyday",
  "everyday",
  "~",
  ["backpacking gear weight", "pack weight calculator", "hiking weight", "backpack load"],
  [
    '{ name: "shelterWeight", label: "Shelter Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3.5 }',
    '{ name: "sleepSystem", label: "Sleep System Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3 }',
    '{ name: "packWeight", label: "Backpack Weight (lb)", type: "number", min: 0.5, max: 10, defaultValue: 3 }',
    '{ name: "otherGear", label: "Other Base Gear (lb)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "foodPerDay", label: "Food Weight Per Day (lb)", type: "number", min: 0.5, max: 5, defaultValue: 2 }',
    '{ name: "waterLiters", label: "Water Carried (liters)", type: "number", min: 0.5, max: 8, defaultValue: 2 }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 30, defaultValue: 3 }'
  ],
  `(inputs) => {
    const shelter = inputs.shelterWeight as number;
    const sleep = inputs.sleepSystem as number;
    const pack = inputs.packWeight as number;
    const otherGear = inputs.otherGear as number;
    const foodPerDay = inputs.foodPerDay as number;
    const waterLiters = inputs.waterLiters as number;
    const tripDays = inputs.tripDays as number;
    const baseWeight = shelter + sleep + pack + otherGear;
    const foodWeight = foodPerDay * tripDays;
    const waterWeight = waterLiters * 2.20462;
    const totalWeight = baseWeight + foodWeight + waterWeight;
    const category = baseWeight < 10 ? "Ultralight" : baseWeight < 15 ? "Lightweight" : baseWeight < 20 ? "Traditional" : "Heavy";
    const totalKg = totalWeight / 2.20462;
    return {
      primary: { label: "Total Pack Weight", value: formatNumber(Math.round(totalWeight * 10) / 10) + " lb" },
      details: [
        { label: "Base Weight", value: formatNumber(Math.round(baseWeight * 10) / 10) + " lb" },
        { label: "Category", value: category },
        { label: "Food Weight", value: formatNumber(Math.round(foodWeight * 10) / 10) + " lb" },
        { label: "Water Weight", value: formatNumber(Math.round(waterWeight * 10) / 10) + " lb" },
        { label: "Total in Kilograms", value: formatNumber(Math.round(totalKg * 10) / 10) + " kg" }
      ]
    };
  }`,
  [
    { q: "What is a good base weight for backpacking?", a: "Ultralight is under 10 pounds, lightweight is 10 to 15 pounds, and traditional is 15 to 20 pounds. The big three (shelter, sleep system, pack) account for most of the base weight." },
    { q: "How much food should I carry per day?", a: "Plan for 1.5 to 2.5 pounds of food per day, providing about 2,500 to 4,500 calories depending on activity level and conditions." },
    { q: "How much water should I carry?", a: "Carry 1 to 2 liters between reliable water sources. In arid conditions, you may need 4 or more liters at a time." }
  ],
  `Base Weight = Shelter + Sleep System + Pack + Other Gear
Total Weight = Base Weight + (Food/Day x Days) + Water Weight`,
  ["travel-budget-calculator", "luggage-weight-converter-calculator", "travel-daily-budget-calculator"]
);

add(
  "ski-resort-value-comparison-calculator",
  "Ski Resort Value Comparison Calculator",
  "Compare the per-run and per-hour value of different ski resorts based on lift ticket price, vertical, and runs.",
  "Finance",
  "finance",
  "$",
  ["ski resort value", "lift ticket comparison", "ski cost calculator", "ski resort comparison"],
  [
    '{ name: "liftTicketPrice", label: "Lift Ticket Price ($)", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "verticalFeet", label: "Vertical Drop (feet)", type: "number", min: 200, max: 6000, defaultValue: 2500 }',
    '{ name: "totalRuns", label: "Total Runs Available", type: "number", min: 5, max: 300, defaultValue: 80 }',
    '{ name: "skiHours", label: "Hours You Will Ski", type: "number", min: 1, max: 10, defaultValue: 6 }',
    '{ name: "runsPerHour", label: "Est. Runs Per Hour", type: "number", min: 1, max: 15, defaultValue: 4 }'
  ],
  `(inputs) => {
    const price = inputs.liftTicketPrice as number;
    const vertical = inputs.verticalFeet as number;
    const totalRuns = inputs.totalRuns as number;
    const skiHours = inputs.skiHours as number;
    const runsPerHour = inputs.runsPerHour as number;
    const totalRunsTaken = Math.round(skiHours * runsPerHour);
    const costPerRun = price / totalRunsTaken;
    const costPerHour = price / skiHours;
    const totalVertical = totalRunsTaken * vertical;
    const costPer1000Vert = (price / totalVertical) * 1000;
    return {
      primary: { label: "Cost Per Run", value: "$" + formatNumber(Math.round(costPerRun * 100) / 100) },
      details: [
        { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
        { label: "Total Runs You Will Take", value: formatNumber(totalRunsTaken) },
        { label: "Total Vertical Skied", value: formatNumber(totalVertical) + " ft" },
        { label: "Cost Per 1,000 ft Vertical", value: "$" + formatNumber(Math.round(costPer1000Vert * 100) / 100) },
        { label: "Runs Available", value: formatNumber(totalRuns) }
      ]
    };
  }`,
  [
    { q: "How much do lift tickets cost?", a: "Major resorts range from $100 to $250 per day. Smaller regional resorts charge $40 to $100. Season passes often pay for themselves in 4 to 7 days of skiing." },
    { q: "What makes a ski resort good value?", a: "High vertical drop, many runs, short lift lines, and lower ticket prices all contribute to better value. More runs per hour means lower cost per run." },
    { q: "Are multi-day passes worth it?", a: "Multi-day passes typically save 10 to 25 percent per day compared to single-day tickets, and season passes are the best value for frequent skiers." }
  ],
  `Cost Per Run = Ticket Price / Total Runs Taken
Cost Per Hour = Ticket Price / Ski Hours
Total Vertical = Runs x Vertical Drop`,
  ["travel-budget-calculator", "travel-daily-budget-calculator", "hotel-vs-airbnb-calculator"]
);

add(
  "rental-car-cost-comparison-calculator",
  "Rental Car Cost Comparison Calculator",
  "Compare total rental car costs including insurance, fuel, tolls, and fees to find the cheapest option.",
  "Finance",
  "finance",
  "$",
  ["rental car cost", "car rental comparison", "rental car total cost", "rental car calculator"],
  [
    '{ name: "dailyRate", label: "Daily Rental Rate ($)", type: "number", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "rentalDays", label: "Rental Days", type: "number", min: 1, max: 60, defaultValue: 5 }',
    '{ name: "insurancePerDay", label: "Insurance Per Day ($)", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "estimatedMiles", label: "Estimated Miles Driven", type: "number", min: 10, max: 5000, defaultValue: 300 }',
    '{ name: "carMpg", label: "Car MPG", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", min: 2, max: 10, defaultValue: 3.5 }'
  ],
  `(inputs) => {
    const dailyRate = inputs.dailyRate as number;
    const rentalDays = inputs.rentalDays as number;
    const insurancePerDay = inputs.insurancePerDay as number;
    const estimatedMiles = inputs.estimatedMiles as number;
    const carMpg = inputs.carMpg as number;
    const gasPrice = inputs.gasPrice as number;
    const rentalCost = dailyRate * rentalDays;
    const insuranceCost = insurancePerDay * rentalDays;
    const fuelCost = (estimatedMiles / carMpg) * gasPrice;
    const taxes = rentalCost * 0.15;
    const totalCost = rentalCost + insuranceCost + fuelCost + taxes;
    const costPerDay = totalCost / rentalDays;
    const costPerMile = totalCost / estimatedMiles;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Rental Fee", value: "$" + formatNumber(Math.round(rentalCost)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insuranceCost)) },
        { label: "Fuel Estimate", value: "$" + formatNumber(Math.round(fuelCost * 100) / 100) },
        { label: "Taxes & Fees (~15%)", value: "$" + formatNumber(Math.round(taxes * 100) / 100) },
        { label: "True Cost Per Day", value: "$" + formatNumber(Math.round(costPerDay * 100) / 100) },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "Do I need rental car insurance?", a: "Check if your personal auto insurance or credit card covers rentals. If not, the collision damage waiver at $15 to $30 per day is worth considering for peace of mind." },
    { q: "How can I save money on rental cars?", a: "Book in advance, compare rates across agencies, decline insurance if already covered, return with a full tank, and avoid airport location surcharges." },
    { q: "What hidden fees should I watch for?", a: "Airport surcharges, additional driver fees, underage driver fees, GPS rental charges, toll transponder fees, and prepaid fuel options can significantly increase costs." }
  ],
  `Total Cost = (Daily Rate x Days) + (Insurance x Days) + Fuel + Taxes
Fuel = (Miles / MPG) x Gas Price`,
  ["road-trip-cost-calculator", "travel-budget-calculator", "commute-cost-calculator"]
);

add(
  "flight-time-estimator-calculator",
  "Flight Time Estimator Calculator",
  "Estimate total door-to-door travel time for a flight including airport time, flight duration, and ground transport.",
  "Everyday",
  "everyday",
  "~",
  ["flight time estimator", "total travel time", "door to door flight time", "air travel time"],
  [
    '{ name: "flightHours", label: "Flight Duration (hours)", type: "number", min: 0.5, max: 20, defaultValue: 4 }',
    '{ name: "flightType", label: "Flight Type", type: "select", options: [{ value: "1", label: "Domestic" }, { value: "2", label: "International" }], defaultValue: "1" }',
    '{ name: "driveToAirport", label: "Drive to Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 45 }',
    '{ name: "driveFromAirport", label: "Drive from Dest. Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 30 }',
    '{ name: "checkedBags", label: "Checked Bags?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const flightHours = inputs.flightHours as number;
    const flightType = inputs.flightType as string;
    const driveToAirport = inputs.driveToAirport as number;
    const driveFromAirport = inputs.driveFromAirport as number;
    const checkedBags = inputs.checkedBags as string;
    const earlyArrival = flightType === "2" ? 180 : 120;
    const securityMin = flightType === "2" ? 45 : 30;
    const baggageClaim = checkedBags === "1" ? 30 : 0;
    const customsMin = flightType === "2" ? 45 : 0;
    const boardingMin = 30;
    const taxiMin = 15;
    const totalMinutes = driveToAirport + earlyArrival + (flightHours * 60) + taxiMin + customsMin + baggageClaim + driveFromAirport;
    const totalHours = totalMinutes / 60;
    const overheadMinutes = totalMinutes - (flightHours * 60);
    const overheadPct = (overheadMinutes / totalMinutes) * 100;
    return {
      primary: { label: "Total Door-to-Door Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Flight Time", value: formatNumber(flightHours) + " hours" },
        { label: "Ground/Airport Overhead", value: formatNumber(Math.round(overheadMinutes)) + " minutes" },
        { label: "Arrive at Airport Before", value: formatNumber(earlyArrival) + " min early" },
        { label: "Security Estimate", value: formatNumber(securityMin) + " min" },
        { label: "Overhead % of Total", value: formatNumber(Math.round(overheadPct)) + "%" }
      ]
    };
  }`,
  [
    { q: "How early should I arrive at the airport?", a: "Arrive 2 hours before domestic flights and 3 hours before international flights. During peak travel seasons, add an extra 30 minutes." },
    { q: "How long does baggage claim take?", a: "Bags typically appear 20 to 45 minutes after landing for domestic flights. International flights with customs can take 30 to 60 minutes total." },
    { q: "Why is door-to-door time important?", a: "For short trips, airport overhead can make driving competitive with flying. A 2-hour flight often takes 5 to 6 hours door-to-door." }
  ],
  `Total Time = Drive To + Early Arrival + Flight + Taxi + Customs + Baggage + Drive From`,
  ["flight-cost-per-mile-calculator", "travel-budget-calculator", "airport-parking-cost-calculator"]
);

add(
  "cruise-packing-list-calculator",
  "Cruise Packing List Calculator",
  "Calculate the recommended number of outfits, formal wear, and essentials to pack based on cruise length and type.",
  "Everyday",
  "everyday",
  "~",
  ["cruise packing list", "cruise packing calculator", "what to pack cruise", "cruise wardrobe"],
  [
    '{ name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 }',
    '{ name: "cruiseType", label: "Cruise Type", type: "select", options: [{ value: "1", label: "Casual (river/expedition)" }, { value: "2", label: "Contemporary (Carnival, Royal)" }, { value: "3", label: "Premium (Celebrity, Holland)" }, { value: "4", label: "Luxury (Regent, Silversea)" }], defaultValue: "2" }',
    '{ name: "portDays", label: "Port Days", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "laundryAvailable", label: "Onboard Laundry?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const nights = inputs.cruiseNights as number;
    const cruiseType = parseInt(inputs.cruiseType as string);
    const portDays = inputs.portDays as number;
    const laundry = inputs.laundryAvailable as string;
    const laundryFactor = laundry === "1" ? 0.6 : 1;
    const formalNights = cruiseType === 1 ? 0 : cruiseType === 2 ? Math.floor(nights / 4) : cruiseType === 3 ? Math.floor(nights / 3) : Math.floor(nights / 2);
    const casualOutfits = Math.ceil((nights - formalNights) * laundryFactor);
    const formalOutfits = Math.ceil(formalNights * laundryFactor);
    const swimsuits = Math.min(Math.ceil(nights / 3), 4);
    const shoreOutfits = Math.min(portDays, casualOutfits);
    const totalOutfits = casualOutfits + formalOutfits;
    const estimatedWeight = totalOutfits * 1.5 + swimsuits * 0.5 + 5;
    return {
      primary: { label: "Total Outfits Needed", value: formatNumber(totalOutfits) },
      details: [
        { label: "Casual/Smart Casual", value: formatNumber(casualOutfits) },
        { label: "Formal/Dressy", value: formatNumber(formalOutfits) },
        { label: "Formal Nights", value: formatNumber(formalNights) },
        { label: "Swimsuits", value: formatNumber(swimsuits) },
        { label: "Shore Excursion Outfits", value: formatNumber(shoreOutfits) },
        { label: "Est. Clothing Weight", value: formatNumber(Math.round(estimatedWeight * 10) / 10) + " lb" }
      ]
    };
  }`,
  [
    { q: "How many outfits do I need for a 7-day cruise?", a: "For a 7-night cruise, plan for 5 to 6 casual outfits, 1 to 2 formal outfits, 2 to 3 swimsuits, and shore excursion clothes. Mix and match to pack lighter." },
    { q: "What are formal nights on a cruise?", a: "Formal nights typically occur once per 3 to 4 cruise nights. Men wear suits or tuxedos, women wear cocktail dresses or evening gowns. Contemporary lines are more relaxed." },
    { q: "How can I pack lighter for a cruise?", a: "Choose a color-coordinated wardrobe, use mix-and-match pieces, take advantage of onboard laundry, and remember that casual dining options do not require dressy clothes." }
  ],
  `Formal Nights = Cruise Nights / Formality Factor
Total Outfits = Casual + Formal (adjusted for laundry)`,
  ["cruise-cabin-cost-comparison-calculator", "luggage-weight-converter-calculator", "travel-budget-calculator"]
);
