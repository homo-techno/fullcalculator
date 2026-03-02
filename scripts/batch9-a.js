add(
  "moving-cost-calculator",
  "Moving Cost Calculator",
  "Estimate the total cost of a long distance move.",
  "Finance",
  "finance",
  "$",
  ["moving", "cost", "long distance", "relocation"],
  [
    '{ name: "distance", label: "Distance (miles)", type: "number", min: 50, max: 5000, defaultValue: 500 }',
    '{ name: "weight", label: "Shipment Weight (lbs)", type: "number", min: 500, max: 30000, defaultValue: 5000 }',
    '{ name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "packing", label: "Packing Service", type: "select", options: [{ value: "0", label: "Self Pack" }, { value: "1", label: "Full Service" }] }',
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const weight = inputs.weight as number;
    const bedrooms = inputs.bedrooms as number;
    const packing = inputs.packing as number;
    const baseCost = bedrooms * 400 + weight * 0.5 + distance * 0.8;
    const packingCost = packing === 1 ? bedrooms * 300 : 0;
    const totalCost = baseCost + packingCost;
    const insuranceCost = totalCost * 0.03;
    const grandTotal = totalCost + insuranceCost;
    return { primary: { label: "Estimated Moving Cost", value: "$" + formatNumber(grandTotal) }, details: [{ label: "Base Cost", value: "$" + formatNumber(baseCost) }, { label: "Packing Cost", value: "$" + formatNumber(packingCost) }, { label: "Insurance (3%)", value: "$" + formatNumber(insuranceCost) }] };
  }`,
  [
    { q: "How much does a long distance move cost?", a: "Typically $2,000 to $10,000 depending on distance and weight." },
    { q: "Does distance affect moving cost?", a: "Yes, cost per mile adds up significantly for long moves." },
    { q: "Should I get packing service?", a: "Full service packing saves time but adds $300 or more per room." }
  ],
  "Total = Base + Packing + Insurance; Base = Bedrooms * 400 + Weight * 0.5 + Distance * 0.8",
  ["moving-truck-size-calculator", "moving-box-calculator", "relocation-cost-of-living-calculator"]
);

add(
  "moving-truck-size-calculator",
  "Moving Truck Size Calculator",
  "Determine the right truck size for your household items.",
  "Everyday",
  "everyday",
  "~",
  ["moving", "truck", "size", "household"],
  [
    '{ name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "extraItems", label: "Large Extra Items", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "density", label: "Stuff Density", type: "select", options: [{ value: "0.8", label: "Minimal" }, { value: "1", label: "Average" }, { value: "1.3", label: "Packed Full" }] }',
  ],
  `(inputs) => {
    const bedrooms = inputs.bedrooms as number;
    const extraItems = inputs.extraItems as number;
    const density = inputs.density as number;
    const baseCubicFt = bedrooms * 400 * density;
    const extraCubicFt = extraItems * 30;
    const totalCubicFt = baseCubicFt + extraCubicFt;
    let truckSize = "10 ft";
    if (totalCubicFt > 400) truckSize = "15 ft";
    if (totalCubicFt > 700) truckSize = "20 ft";
    if (totalCubicFt > 1000) truckSize = "26 ft";
    return { primary: { label: "Recommended Truck Size", value: truckSize }, details: [{ label: "Estimated Volume", value: formatNumber(totalCubicFt) + " cu ft" }, { label: "Base Volume", value: formatNumber(baseCubicFt) + " cu ft" }, { label: "Extra Items Volume", value: formatNumber(extraCubicFt) + " cu ft" }] };
  }`,
  [
    { q: "What truck size do I need for a 2-bedroom apartment?", a: "A 15 to 20 ft truck usually works for a 2-bedroom." },
    { q: "Can I fit everything in one trip?", a: "Choose the next size up if you have many large items." },
    { q: "What counts as a large extra item?", a: "Pianos, large appliances, and oversized furniture." }
  ],
  "Volume = Bedrooms * 400 * Density + Extra Items * 30",
  ["moving-cost-calculator", "moving-box-calculator", "furniture-moving-weight-calculator"]
);

add(
  "moving-box-calculator",
  "Moving Box Calculator",
  "Calculate the number of boxes needed by room count.",
  "Everyday",
  "everyday",
  "~",
  ["moving", "boxes", "packing", "rooms"],
  [
    '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "boxesPerRoom", label: "Boxes Per Room", type: "number", min: 5, max: 30, defaultValue: 12 }',
    '{ name: "fragile", label: "Fragile Item Rooms", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const boxesPerRoom = inputs.boxesPerRoom as number;
    const fragile = inputs.fragile as number;
    const standardBoxes = rooms * boxesPerRoom;
    const fragileBoxes = fragile * 5;
    const totalBoxes = standardBoxes + fragileBoxes;
    const tapRolls = Math.ceil(totalBoxes / 15);
    return { primary: { label: "Total Boxes Needed", value: formatNumber(totalBoxes) }, details: [{ label: "Standard Boxes", value: formatNumber(standardBoxes) }, { label: "Fragile Item Boxes", value: formatNumber(fragileBoxes) }, { label: "Tape Rolls Needed", value: formatNumber(tapRolls) }] };
  }`,
  [
    { q: "How many boxes per room on average?", a: "About 10 to 15 boxes per room for an average household." },
    { q: "Do I need special boxes for fragile items?", a: "Yes, use dish packs and padded boxes for breakables." },
    { q: "Where can I get free moving boxes?", a: "Liquor stores, bookstores, and online marketplaces." }
  ],
  "Total = Rooms * BoxesPerRoom + FragileRooms * 5",
  ["moving-cost-calculator", "packing-tape-calculator", "moving-truck-size-calculator"]
);

add(
  "moving-timeline-calculator",
  "Moving Timeline Calculator",
  "Estimate the weeks needed to plan and execute a move.",
  "Everyday",
  "everyday",
  "~",
  ["moving", "timeline", "planning", "schedule"],
  [
    '{ name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 1, max: 8, defaultValue: 3 }',
    '{ name: "distance", label: "Move Distance (miles)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "helpers", label: "Number of Helpers", type: "number", min: 1, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
    const bedrooms = inputs.bedrooms as number;
    const distance = inputs.distance as number;
    const helpers = inputs.helpers as number;
    const packingWeeks = Math.ceil(bedrooms / helpers);
    const planningWeeks = distance > 500 ? 6 : 3;
    const totalWeeks = packingWeeks + planningWeeks + 1;
    const startDate = totalWeeks + " weeks before move day";
    return { primary: { label: "Recommended Timeline", value: totalWeeks + " weeks" }, details: [{ label: "Planning Phase", value: planningWeeks + " weeks" }, { label: "Packing Phase", value: packingWeeks + " weeks" }, { label: "Start Preparing", value: startDate }] };
  }`,
  [
    { q: "How early should I start planning a move?", a: "Start at least 4 to 8 weeks before your move date." },
    { q: "What is the first step when planning a move?", a: "Declutter and inventory your belongings first." },
    { q: "Does distance affect planning time?", a: "Yes, long distance moves need more lead time." }
  ],
  "Timeline = PlanningWeeks + ceil(Bedrooms / Helpers) + 1",
  ["moving-cost-calculator", "moving-box-calculator", "packing-tape-calculator"]
);

add(
  "storage-unit-size-calculator",
  "Storage Unit Size Calculator",
  "Determine the storage unit size you need.",
  "Everyday",
  "everyday",
  "~",
  ["storage", "unit", "size", "space"],
  [
    '{ name: "bedrooms", label: "Bedrooms of Stuff", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "largeItems", label: "Large Items (sofas, etc.)", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "duration", label: "Storage Duration (months)", type: "number", min: 1, max: 24, defaultValue: 3 }',
  ],
  `(inputs) => {
    const bedrooms = inputs.bedrooms as number;
    const largeItems = inputs.largeItems as number;
    const duration = inputs.duration as number;
    const sqft = bedrooms * 50 + largeItems * 10;
    let unitSize = "5x5";
    if (sqft > 30) unitSize = "5x10";
    if (sqft > 60) unitSize = "10x10";
    if (sqft > 120) unitSize = "10x15";
    if (sqft > 180) unitSize = "10x20";
    if (sqft > 250) unitSize = "10x30";
    const monthlyCost = sqft * 1.2;
    const totalCost = monthlyCost * duration;
    return { primary: { label: "Recommended Unit Size", value: unitSize }, details: [{ label: "Estimated Space Needed", value: formatNumber(sqft) + " sq ft" }, { label: "Monthly Cost Estimate", value: "$" + formatNumber(monthlyCost) }, { label: "Total Cost (" + duration + " months)", value: "$" + formatNumber(totalCost) }] };
  }`,
  [
    { q: "What size storage unit do I need?", a: "A 2-bedroom home typically needs a 10x10 unit." },
    { q: "How much does a storage unit cost?", a: "About $1 to $2 per square foot per month on average." },
    { q: "Should I get climate controlled storage?", a: "Yes, for electronics, wood furniture, and documents." }
  ],
  "SqFt = Bedrooms * 50 + LargeItems * 10",
  ["moving-truck-size-calculator", "moving-cost-calculator", "furniture-moving-weight-calculator"]
);

add(
  "packing-tape-calculator",
  "Packing Tape Calculator",
  "Estimate the rolls of tape needed for moving boxes.",
  "Everyday",
  "everyday",
  "~",
  ["packing", "tape", "rolls", "moving"],
  [
    '{ name: "boxes", label: "Number of Boxes", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "stripsPerBox", label: "Tape Strips Per Box", type: "number", min: 2, max: 6, defaultValue: 3 }',
    '{ name: "rollLength", label: "Roll Length (yards)", type: "number", min: 30, max: 110, defaultValue: 55 }',
  ],
  `(inputs) => {
    const boxes = inputs.boxes as number;
    const stripsPerBox = inputs.stripsPerBox as number;
    const rollLength = inputs.rollLength as number;
    const totalStrips = boxes * stripsPerBox;
    const tapeYards = totalStrips * 1.5;
    const rollsNeeded = Math.ceil(tapeYards / rollLength);
    return { primary: { label: "Rolls of Tape Needed", value: formatNumber(rollsNeeded) }, details: [{ label: "Total Tape Strips", value: formatNumber(totalStrips) }, { label: "Total Tape Length", value: formatNumber(tapeYards) + " yards" }, { label: "Roll Length", value: rollLength + " yards each" }] };
  }`,
  [
    { q: "How many rolls of tape do I need for moving?", a: "About 1 roll per 15 to 20 boxes on average." },
    { q: "What type of packing tape is best?", a: "Use 2-inch wide heavy-duty acrylic tape for boxes." },
    { q: "How much tape per box?", a: "Use about 3 strips per box for a secure seal." }
  ],
  "Rolls = ceil((Boxes * StripsPerBox * 1.5) / RollLength)",
  ["moving-box-calculator", "moving-cost-calculator", "moving-timeline-calculator"]
);

add(
  "furniture-moving-weight-calculator",
  "Furniture Moving Weight Calculator",
  "Estimate the total weight of furniture to move.",
  "Everyday",
  "everyday",
  "~",
  ["furniture", "weight", "moving", "heavy"],
  [
    '{ name: "sofas", label: "Sofas and Couches", type: "number", min: 0, max: 10, defaultValue: 1 }',
    '{ name: "beds", label: "Beds (with mattress)", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "dressers", label: "Dressers and Desks", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "tables", label: "Tables and Chairs", type: "number", min: 0, max: 20, defaultValue: 4 }',
  ],
  `(inputs) => {
    const sofas = inputs.sofas as number;
    const beds = inputs.beds as number;
    const dressers = inputs.dressers as number;
    const tables = inputs.tables as number;
    const sofaWeight = sofas * 180;
    const bedWeight = beds * 150;
    const dresserWeight = dressers * 120;
    const tableWeight = tables * 50;
    const totalWeight = sofaWeight + bedWeight + dresserWeight + tableWeight;
    return { primary: { label: "Total Furniture Weight", value: formatNumber(totalWeight) + " lbs" }, details: [{ label: "Sofas", value: formatNumber(sofaWeight) + " lbs" }, { label: "Beds", value: formatNumber(bedWeight) + " lbs" }, { label: "Dressers and Desks", value: formatNumber(dresserWeight) + " lbs" }, { label: "Tables and Chairs", value: formatNumber(tableWeight) + " lbs" }] };
  }`,
  [
    { q: "How much does a sofa weigh?", a: "An average sofa weighs about 150 to 200 pounds." },
    { q: "Do movers charge by weight?", a: "Yes, long distance movers typically charge by total weight." },
    { q: "How do I reduce furniture weight?", a: "Remove drawers and cushions before moving large pieces." }
  ],
  "Total = Sofas * 180 + Beds * 150 + Dressers * 120 + Tables * 50",
  ["moving-cost-calculator", "moving-truck-size-calculator", "storage-unit-size-calculator"]
);

add(
  "relocation-cost-of-living-calculator",
  "Relocation Cost of Living Calculator",
  "Compare cost of living between two locations.",
  "Finance",
  "finance",
  "$",
  ["relocation", "cost of living", "comparison", "salary"],
  [
    '{ name: "currentSalary", label: "Current Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 60000 }',
    '{ name: "currentIndex", label: "Current City Index", type: "number", min: 50, max: 200, defaultValue: 100 }',
    '{ name: "newIndex", label: "New City Index", type: "number", min: 50, max: 200, defaultValue: 120 }',
  ],
  `(inputs) => {
    const currentSalary = inputs.currentSalary as number;
    const currentIndex = inputs.currentIndex as number;
    const newIndex = inputs.newIndex as number;
    const ratio = newIndex / currentIndex;
    const equivalentSalary = currentSalary * ratio;
    const difference = equivalentSalary - currentSalary;
    const percentChange = ((ratio - 1) * 100);
    return { primary: { label: "Equivalent Salary Needed", value: "$" + formatNumber(equivalentSalary) }, details: [{ label: "Cost of Living Ratio", value: ratio.toFixed(2) }, { label: "Salary Difference", value: "$" + formatNumber(difference) }, { label: "Percent Change", value: percentChange.toFixed(1) + "%" }] };
  }`,
  [
    { q: "What is a cost of living index?", a: "A score comparing living costs; 100 is the national average." },
    { q: "How do I find my city index?", a: "Use BLS data or cost of living comparison websites." },
    { q: "Should I negotiate salary for a higher cost area?", a: "Yes, request a salary that matches the cost ratio." }
  ],
  "EquivalentSalary = CurrentSalary * (NewIndex / CurrentIndex)",
  ["moving-cost-calculator", "commute-comparison-calculator", "neighborhood-affordability-calculator"]
);

add(
  "commute-comparison-calculator",
  "Commute Comparison Calculator",
  "Compare commute costs between two options.",
  "Finance",
  "finance",
  "$",
  ["commute", "comparison", "driving", "transit"],
  [
    '{ name: "driveMiles", label: "Driving Distance (miles one way)", type: "number", min: 1, max: 100, defaultValue: 20 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 10, max: 60, defaultValue: 28 }',
    '{ name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", min: 1, max: 8, defaultValue: 3.5 }',
    '{ name: "transitMonthly", label: "Monthly Transit Pass ($)", type: "number", min: 0, max: 500, defaultValue: 100 }',
  ],
  `(inputs) => {
    const driveMiles = inputs.driveMiles as number;
    const mpg = inputs.mpg as number;
    const gasPrice = inputs.gasPrice as number;
    const transitMonthly = inputs.transitMonthly as number;
    const dailyGasCost = (driveMiles * 2 / mpg) * gasPrice;
    const monthlyDriveCost = dailyGasCost * 22;
    const yearlyDriveCost = monthlyDriveCost * 12;
    const yearlyTransitCost = transitMonthly * 12;
    const savings = yearlyDriveCost - yearlyTransitCost;
    return { primary: { label: "Monthly Driving Cost", value: "$" + formatNumber(monthlyDriveCost) }, details: [{ label: "Daily Gas Cost", value: "$" + formatNumber(dailyGasCost) }, { label: "Yearly Driving Cost", value: "$" + formatNumber(yearlyDriveCost) }, { label: "Yearly Transit Cost", value: "$" + formatNumber(yearlyTransitCost) }, { label: "Annual Savings with Transit", value: "$" + formatNumber(savings) }] };
  }`,
  [
    { q: "Is driving or transit cheaper?", a: "Transit is usually cheaper if your commute is over 15 miles." },
    { q: "What costs are not included in driving?", a: "Parking, insurance, maintenance, and depreciation." },
    { q: "How many work days per month?", a: "This calculator uses 22 work days per month." }
  ],
  "MonthlyDrive = (Miles * 2 / MPG) * GasPrice * 22",
  ["relocation-cost-of-living-calculator", "neighborhood-affordability-calculator", "moving-cost-calculator"]
);

add(
  "neighborhood-affordability-calculator",
  "Neighborhood Affordability Calculator",
  "Calculate a housing affordability index for a neighborhood.",
  "Finance",
  "finance",
  "$",
  ["neighborhood", "affordability", "housing", "income"],
  [
    '{ name: "medianIncome", label: "Household Income ($)", type: "number", min: 20000, max: 500000, defaultValue: 65000 }',
    '{ name: "medianHomePrice", label: "Median Home Price ($)", type: "number", min: 50000, max: 2000000, defaultValue: 350000 }',
    '{ name: "interestRate", label: "Mortgage Rate (%)", type: "number", min: 2, max: 12, defaultValue: 6.5 }',
  ],
  `(inputs) => {
    const medianIncome = inputs.medianIncome as number;
    const medianHomePrice = inputs.medianHomePrice as number;
    const interestRate = inputs.interestRate as number;
    const monthlyRate = interestRate / 100 / 12;
    const loanAmount = medianHomePrice * 0.8;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, 360)) / (Math.pow(1 + monthlyRate, 360) - 1);
    const monthlyIncome = medianIncome / 12;
    const ratio = (monthlyPayment / monthlyIncome) * 100;
    const affordable = ratio <= 28 ? "Yes" : "No";
    return { primary: { label: "Housing Cost Ratio", value: ratio.toFixed(1) + "%" }, details: [{ label: "Monthly Mortgage Payment", value: "$" + formatNumber(monthlyPayment) }, { label: "Monthly Income", value: "$" + formatNumber(monthlyIncome) }, { label: "Meets 28% Rule", value: affordable }] };
  }`,
  [
    { q: "What is the 28% rule for housing?", a: "Spend no more than 28% of gross income on housing costs." },
    { q: "What is a good affordability ratio?", a: "Below 28% is considered affordable by lender standards." },
    { q: "Does this include taxes and insurance?", a: "No, add about 1.5% of home value yearly for those costs." }
  ],
  "Ratio = MonthlyMortgage / MonthlyIncome * 100",
  ["relocation-cost-of-living-calculator", "commute-comparison-calculator", "moving-cost-calculator"]
);

add(
  "house-cleaning-time-calculator",
  "House Cleaning Time Calculator",
  "Estimate cleaning time based on room count.",
  "Everyday",
  "everyday",
  "~",
  ["cleaning", "time", "house", "rooms"],
  [
    '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 20, defaultValue: 6 }',
    '{ name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "cleanLevel", label: "Cleaning Level", type: "select", options: [{ value: "15", label: "Light" }, { value: "25", label: "Standard" }, { value: "40", label: "Deep" }] }',
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const bathrooms = inputs.bathrooms as number;
    const cleanLevel = inputs.cleanLevel as number;
    const roomTime = rooms * cleanLevel;
    const bathroomTime = bathrooms * (cleanLevel + 10);
    const totalMinutes = roomTime + bathroomTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { primary: { label: "Total Cleaning Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Room Cleaning Time", value: roomTime + " minutes" }, { label: "Bathroom Cleaning Time", value: bathroomTime + " minutes" }, { label: "Total Minutes", value: formatNumber(totalMinutes) }] };
  }`,
  [
    { q: "How long does it take to clean a house?", a: "About 1 to 3 hours depending on size and depth of clean." },
    { q: "Which room takes the longest to clean?", a: "Kitchens and bathrooms take the most time." },
    { q: "How often should I deep clean?", a: "Deep clean once a month for best results." }
  ],
  "TotalMinutes = Rooms * Level + Bathrooms * (Level + 10)",
  ["deep-cleaning-checklist-calculator", "maid-service-cost-calculator", "cleaning-supply-calculator"]
);

add(
  "carpet-cleaning-cost-calculator",
  "Carpet Cleaning Cost Calculator",
  "Estimate professional carpet cleaning cost.",
  "Finance",
  "finance",
  "$",
  ["carpet", "cleaning", "cost", "professional"],
  [
    '{ name: "sqft", label: "Carpet Area (sq ft)", type: "number", min: 100, max: 5000, defaultValue: 800 }',
    '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "method", label: "Cleaning Method", type: "select", options: [{ value: "0.25", label: "Steam Clean" }, { value: "0.20", label: "Dry Clean" }, { value: "0.35", label: "Shampooing" }] }',
  ],
  `(inputs) => {
    const sqft = inputs.sqft as number;
    const rooms = inputs.rooms as number;
    const method = inputs.method as number;
    const areaCost = sqft * method;
    const perRoomMin = rooms * 50;
    const totalCost = Math.max(areaCost, perRoomMin);
    const stainTreatment = rooms * 15;
    const grandTotal = totalCost + stainTreatment;
    return { primary: { label: "Estimated Carpet Cleaning Cost", value: "$" + formatNumber(grandTotal) }, details: [{ label: "Area-Based Cost", value: "$" + formatNumber(areaCost) }, { label: "Stain Treatment", value: "$" + formatNumber(stainTreatment) }, { label: "Minimum (by room)", value: "$" + formatNumber(perRoomMin) }] };
  }`,
  [
    { q: "How much does carpet cleaning cost?", a: "About $0.20 to $0.40 per square foot on average." },
    { q: "How often should carpets be cleaned?", a: "Professionally clean carpets every 12 to 18 months." },
    { q: "Which method is best for carpets?", a: "Steam cleaning is most effective for deep stains." }
  ],
  "Cost = max(SqFt * Rate, Rooms * 50) + Rooms * 15",
  ["house-cleaning-time-calculator", "cleaning-supply-calculator", "pressure-washing-calculator"]
);

add(
  "pressure-washing-calculator",
  "Pressure Washing Calculator",
  "Calculate the area and time for pressure washing.",
  "Everyday",
  "everyday",
  "~",
  ["pressure", "washing", "area", "outdoor"],
  [
    '{ name: "sqft", label: "Area to Wash (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 500 }',
    '{ name: "surface", label: "Surface Type", type: "select", options: [{ value: "3", label: "Concrete" }, { value: "5", label: "Wood Deck" }, { value: "2", label: "Vinyl Siding" }] }',
    '{ name: "dirtLevel", label: "Dirt Level", type: "select", options: [{ value: "1", label: "Light" }, { value: "1.5", label: "Moderate" }, { value: "2", label: "Heavy" }] }',
  ],
  `(inputs) => {
    const sqft = inputs.sqft as number;
    const surface = inputs.surface as number;
    const dirtLevel = inputs.dirtLevel as number;
    const minutesPerSqFt = (surface / 60) * dirtLevel;
    const totalMinutes = Math.ceil(sqft * minutesPerSqFt);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const waterGallons = sqft * 0.5;
    return { primary: { label: "Estimated Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Total Minutes", value: formatNumber(totalMinutes) }, { label: "Area", value: formatNumber(sqft) + " sq ft" }, { label: "Water Usage", value: formatNumber(waterGallons) + " gallons" }] };
  }`,
  [
    { q: "How long does pressure washing take?", a: "About 2 to 5 minutes per 100 sq ft depending on surface." },
    { q: "What PSI should I use?", a: "Use 1500 to 2000 PSI for decks and 2500 to 3000 for concrete." },
    { q: "Can pressure washing damage surfaces?", a: "Yes, use lower PSI on wood and painted surfaces." }
  ],
  "Time = SqFt * (SurfaceFactor / 60) * DirtLevel",
  ["house-cleaning-time-calculator", "gutter-cleaning-cost-calculator", "window-cleaning-calculator"]
);

add(
  "window-cleaning-calculator",
  "Window Cleaning Calculator",
  "Estimate window cleaning cost by window count.",
  "Finance",
  "finance",
  "$",
  ["window", "cleaning", "cost", "glass"],
  [
    '{ name: "windows", label: "Number of Windows", type: "number", min: 1, max: 50, defaultValue: 12 }',
    '{ name: "stories", label: "Number of Stories", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "condition", label: "Window Condition", type: "select", options: [{ value: "1", label: "Lightly Dirty" }, { value: "1.3", label: "Moderately Dirty" }, { value: "1.6", label: "Very Dirty" }] }',
  ],
  `(inputs) => {
    const windows = inputs.windows as number;
    const stories = inputs.stories as number;
    const condition = inputs.condition as number;
    const basePerWindow = 8;
    const storyMultiplier = 1 + (stories - 1) * 0.25;
    const costPerWindow = basePerWindow * storyMultiplier * condition;
    const totalCost = windows * costPerWindow;
    const timeMinutes = windows * 10 * condition;
    return { primary: { label: "Estimated Cleaning Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Cost Per Window", value: "$" + formatNumber(costPerWindow) }, { label: "Number of Windows", value: formatNumber(windows) }, { label: "Estimated Time", value: formatNumber(timeMinutes) + " minutes" }] };
  }`,
  [
    { q: "How much does window cleaning cost?", a: "About $5 to $15 per window depending on size and access." },
    { q: "How often should windows be cleaned?", a: "Clean windows at least twice a year." },
    { q: "Does story height affect cost?", a: "Yes, higher floors cost more due to safety equipment." }
  ],
  "Cost = Windows * BaseRate * StoryMultiplier * Condition",
  ["house-cleaning-time-calculator", "gutter-cleaning-cost-calculator", "pressure-washing-calculator"]
);

add(
  "gutter-cleaning-cost-calculator",
  "Gutter Cleaning Cost Calculator",
  "Estimate the cost of professional gutter cleaning.",
  "Finance",
  "finance",
  "$",
  ["gutter", "cleaning", "cost", "maintenance"],
  [
    '{ name: "linearFeet", label: "Gutter Length (linear ft)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "stories", label: "Number of Stories", type: "number", min: 1, max: 3, defaultValue: 2 }',
    '{ name: "clogging", label: "Clog Level", type: "select", options: [{ value: "1", label: "Light" }, { value: "1.4", label: "Moderate" }, { value: "1.8", label: "Heavy" }] }',
  ],
  `(inputs) => {
    const linearFeet = inputs.linearFeet as number;
    const stories = inputs.stories as number;
    const clogging = inputs.clogging as number;
    const baseRate = 1.5;
    const storyMultiplier = 1 + (stories - 1) * 0.3;
    const costPerFoot = baseRate * storyMultiplier * clogging;
    const totalCost = linearFeet * costPerFoot;
    const minCost = 75;
    const finalCost = Math.max(totalCost, minCost);
    return { primary: { label: "Gutter Cleaning Cost", value: "$" + formatNumber(finalCost) }, details: [{ label: "Cost Per Linear Foot", value: "$" + costPerFoot.toFixed(2) }, { label: "Total Gutter Length", value: formatNumber(linearFeet) + " ft" }, { label: "Minimum Service Fee", value: "$" + formatNumber(minCost) }] };
  }`,
  [
    { q: "How much does gutter cleaning cost?", a: "Typically $100 to $300 for an average home." },
    { q: "How often should gutters be cleaned?", a: "At least twice a year, spring and fall." },
    { q: "Can clogged gutters cause damage?", a: "Yes, they can cause water damage and foundation issues." }
  ],
  "Cost = max(LinearFeet * BaseRate * StoryMult * ClogLevel, 75)",
  ["window-cleaning-calculator", "pressure-washing-calculator", "house-cleaning-time-calculator"]
);

add(
  "maid-service-cost-calculator",
  "Maid Service Cost Calculator",
  "Estimate the cost of recurring maid service.",
  "Finance",
  "finance",
  "$",
  ["maid", "service", "cost", "housekeeping"],
  [
    '{ name: "sqft", label: "Home Size (sq ft)", type: "number", min: 500, max: 5000, defaultValue: 1500 }',
    '{ name: "frequency", label: "Visits Per Month", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "serviceType", label: "Service Level", type: "select", options: [{ value: "0.08", label: "Basic" }, { value: "0.12", label: "Standard" }, { value: "0.18", label: "Deep Clean" }] }',
  ],
  `(inputs) => {
    const sqft = inputs.sqft as number;
    const frequency = inputs.frequency as number;
    const serviceType = inputs.serviceType as number;
    const perVisitCost = sqft * serviceType;
    const monthlyCost = perVisitCost * frequency;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Monthly Maid Service Cost", value: "$" + formatNumber(monthlyCost) }, details: [{ label: "Per Visit Cost", value: "$" + formatNumber(perVisitCost) }, { label: "Visits Per Month", value: formatNumber(frequency) }, { label: "Annual Cost", value: "$" + formatNumber(yearlyCost) }] };
  }`,
  [
    { q: "How much does a maid service cost?", a: "About $100 to $250 per visit for an average home." },
    { q: "How often should I hire a maid?", a: "Bi-weekly is the most popular schedule." },
    { q: "What does basic maid service include?", a: "Vacuuming, dusting, mopping, and bathroom cleaning." }
  ],
  "Monthly = SqFt * Rate * Frequency",
  ["house-cleaning-time-calculator", "cleaning-supply-calculator", "deep-cleaning-checklist-calculator"]
);

add(
  "deep-cleaning-checklist-calculator",
  "Deep Cleaning Checklist Calculator",
  "Estimate total deep cleaning time for your home.",
  "Everyday",
  "everyday",
  "~",
  ["deep", "cleaning", "checklist", "time"],
  [
    '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 15, defaultValue: 5 }',
    '{ name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "kitchen", label: "Kitchen Deep Clean", type: "select", options: [{ value: "60", label: "Standard" }, { value: "90", label: "Thorough" }, { value: "120", label: "Full Detail" }] }',
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const bathrooms = inputs.bathrooms as number;
    const kitchen = inputs.kitchen as number;
    const roomTime = rooms * 40;
    const bathroomTime = bathrooms * 45;
    const kitchenTime = kitchen;
    const totalMinutes = roomTime + bathroomTime + kitchenTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { primary: { label: "Total Deep Clean Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Room Time", value: roomTime + " minutes" }, { label: "Bathroom Time", value: bathroomTime + " minutes" }, { label: "Kitchen Time", value: kitchenTime + " minutes" }] };
  }`,
  [
    { q: "How long does a deep clean take?", a: "About 3 to 6 hours for an average-sized home." },
    { q: "What is included in a deep clean?", a: "Baseboards, vents, inside appliances, and grout scrubbing." },
    { q: "How often should you deep clean?", a: "Every 1 to 3 months for best results." }
  ],
  "Total = Rooms * 40 + Bathrooms * 45 + KitchenTime",
  ["house-cleaning-time-calculator", "maid-service-cost-calculator", "cleaning-supply-calculator"]
);

add(
  "cleaning-supply-calculator",
  "Cleaning Supply Calculator",
  "Estimate your monthly cleaning supply budget.",
  "Finance",
  "finance",
  "$",
  ["cleaning", "supply", "budget", "products"],
  [
    '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "cleanFrequency", label: "Cleans Per Month", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "productTier", label: "Product Tier", type: "select", options: [{ value: "0.5", label: "Budget" }, { value: "1", label: "Standard" }, { value: "1.8", label: "Premium/Eco" }] }',
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const cleanFrequency = inputs.cleanFrequency as number;
    const productTier = inputs.productTier as number;
    const baseCostPerClean = rooms * 1.5 * productTier;
    const monthlyCost = baseCostPerClean * cleanFrequency;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Monthly Supply Budget", value: "$" + formatNumber(monthlyCost) }, details: [{ label: "Cost Per Cleaning", value: "$" + formatNumber(baseCostPerClean) }, { label: "Cleans Per Month", value: formatNumber(cleanFrequency) }, { label: "Yearly Supply Cost", value: "$" + formatNumber(yearlyCost) }] };
  }`,
  [
    { q: "How much should I spend on cleaning supplies?", a: "About $20 to $50 per month for an average home." },
    { q: "Are eco-friendly products more expensive?", a: "Yes, they typically cost 50% to 100% more than standard." },
    { q: "What are the essential cleaning supplies?", a: "All-purpose cleaner, sponges, microfiber cloths, and mop." }
  ],
  "Monthly = Rooms * 1.5 * ProductTier * Frequency",
  ["maid-service-cost-calculator", "house-cleaning-time-calculator", "deep-cleaning-checklist-calculator"]
);

add(
  "laundry-cost-calculator",
  "Laundry Cost Calculator",
  "Estimate your monthly laundry expenses.",
  "Finance",
  "finance",
  "$",
  ["laundry", "cost", "monthly", "washing"],
  [
    '{ name: "loadsPerWeek", label: "Loads Per Week", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "waterCost", label: "Water Cost Per Load ($)", type: "number", min: 0.05, max: 1, defaultValue: 0.15 }',
    '{ name: "electricityCost", label: "Electricity Per Load ($)", type: "number", min: 0.1, max: 2, defaultValue: 0.5 }',
    '{ name: "detergentCost", label: "Detergent Per Load ($)", type: "number", min: 0.1, max: 1, defaultValue: 0.25 }',
  ],
  `(inputs) => {
    const loadsPerWeek = inputs.loadsPerWeek as number;
    const waterCost = inputs.waterCost as number;
    const electricityCost = inputs.electricityCost as number;
    const detergentCost = inputs.detergentCost as number;
    const costPerLoad = waterCost + electricityCost + detergentCost;
    const monthlyCost = costPerLoad * loadsPerWeek * 4.33;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Monthly Laundry Cost", value: "$" + formatNumber(monthlyCost) }, details: [{ label: "Cost Per Load", value: "$" + costPerLoad.toFixed(2) }, { label: "Loads Per Month", value: formatNumber(loadsPerWeek * 4.33) }, { label: "Annual Cost", value: "$" + formatNumber(yearlyCost) }] };
  }`,
  [
    { q: "How much does a load of laundry cost?", a: "About $0.50 to $1.50 per load at home." },
    { q: "How can I reduce laundry costs?", a: "Wash with cold water and air dry when possible." },
    { q: "Is it cheaper to do laundry at home?", a: "Yes, home laundry is usually half the cost of a laundromat." }
  ],
  "Monthly = (Water + Electricity + Detergent) * Loads * 4.33",
  ["laundry-load-calculator", "dryer-energy-cost-calculator", "clothesline-savings-calculator"]
);

add(
  "laundry-load-calculator",
  "Laundry Load Calculator",
  "Estimate weekly laundry loads from household size.",
  "Everyday",
  "everyday",
  "~",
  ["laundry", "loads", "household", "weekly"],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "activity", label: "Activity Level", type: "select", options: [{ value: "0.8", label: "Low" }, { value: "1", label: "Average" }, { value: "1.4", label: "Active/Sports" }] }',
  ],
  `(inputs) => {
    const adults = inputs.adults as number;
    const children = inputs.children as number;
    const activity = inputs.activity as number;
    const adultLoads = adults * 2.5 * activity;
    const childLoads = children * 2 * activity;
    const weeklyLoads = Math.ceil(adultLoads + childLoads);
    const monthlyLoads = Math.ceil(weeklyLoads * 4.33);
    const yearlyLoads = weeklyLoads * 52;
    return { primary: { label: "Loads Per Week", value: formatNumber(weeklyLoads) }, details: [{ label: "Adult Loads", value: adultLoads.toFixed(1) + " per week" }, { label: "Child Loads", value: childLoads.toFixed(1) + " per week" }, { label: "Monthly Loads", value: formatNumber(monthlyLoads) }, { label: "Yearly Loads", value: formatNumber(yearlyLoads) }] };
  }`,
  [
    { q: "How many loads of laundry per week is normal?", a: "About 5 to 8 loads per week for a family of four." },
    { q: "Do children create more laundry?", a: "Children generate about 2 loads per week each." },
    { q: "How can I reduce laundry loads?", a: "Wear items more than once when appropriate." }
  ],
  "WeeklyLoads = Adults * 2.5 * Activity + Children * 2 * Activity",
  ["laundry-cost-calculator", "dryer-energy-cost-calculator", "clothesline-savings-calculator"]
);

add(
  "dryer-energy-cost-calculator",
  "Dryer Energy Cost Calculator",
  "Calculate dryer electricity cost per load.",
  "Finance",
  "finance",
  "$",
  ["dryer", "energy", "cost", "electricity"],
  [
    '{ name: "wattage", label: "Dryer Wattage", type: "number", min: 1000, max: 6000, defaultValue: 3000 }',
    '{ name: "dryTime", label: "Dry Time (minutes)", type: "number", min: 20, max: 90, defaultValue: 50 }',
    '{ name: "costPerKwh", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.13 }',
    '{ name: "loadsPerWeek", label: "Loads Per Week", type: "number", min: 1, max: 20, defaultValue: 5 }',
  ],
  `(inputs) => {
    const wattage = inputs.wattage as number;
    const dryTime = inputs.dryTime as number;
    const costPerKwh = inputs.costPerKwh as number;
    const loadsPerWeek = inputs.loadsPerWeek as number;
    const kwhPerLoad = (wattage / 1000) * (dryTime / 60);
    const costPerLoad = kwhPerLoad * costPerKwh;
    const monthlyCost = costPerLoad * loadsPerWeek * 4.33;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Cost Per Dryer Load", value: "$" + costPerLoad.toFixed(2) }, details: [{ label: "kWh Per Load", value: kwhPerLoad.toFixed(2) + " kWh" }, { label: "Monthly Dryer Cost", value: "$" + formatNumber(monthlyCost) }, { label: "Annual Dryer Cost", value: "$" + formatNumber(yearlyCost) }] };
  }`,
  [
    { q: "How much electricity does a dryer use?", a: "About 2 to 5 kWh per load depending on the model." },
    { q: "Are gas dryers cheaper to run?", a: "Yes, gas dryers typically cost less per load than electric." },
    { q: "How can I reduce dryer energy costs?", a: "Clean the lint filter and use dryer balls." }
  ],
  "CostPerLoad = (Wattage / 1000) * (Minutes / 60) * Rate",
  ["laundry-cost-calculator", "clothesline-savings-calculator", "laundry-load-calculator"]
);

add(
  "clothesline-savings-calculator",
  "Clothesline Savings Calculator",
  "Estimate savings from air drying your clothes.",
  "Finance",
  "finance",
  "$",
  ["clothesline", "savings", "air dry", "energy"],
  [
    '{ name: "loadsPerWeek", label: "Loads Per Week", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "dryerCostPerLoad", label: "Dryer Cost Per Load ($)", type: "number", min: 0.1, max: 2, defaultValue: 0.5 }',
    '{ name: "percentLineDried", label: "Percent Line Dried", type: "number", min: 10, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const loadsPerWeek = inputs.loadsPerWeek as number;
    const dryerCostPerLoad = inputs.dryerCostPerLoad as number;
    const percentLineDried = inputs.percentLineDried as number;
    const lineDriedLoads = loadsPerWeek * (percentLineDried / 100);
    const weeklySavings = lineDriedLoads * dryerCostPerLoad;
    const monthlySavings = weeklySavings * 4.33;
    const yearlySavings = monthlySavings * 12;
    return { primary: { label: "Monthly Savings", value: "$" + formatNumber(monthlySavings) }, details: [{ label: "Line Dried Loads Per Week", value: lineDriedLoads.toFixed(1) }, { label: "Weekly Savings", value: "$" + formatNumber(weeklySavings) }, { label: "Annual Savings", value: "$" + formatNumber(yearlySavings) }] };
  }`,
  [
    { q: "How much can I save by air drying clothes?", a: "About $100 to $200 per year for an average family." },
    { q: "Does air drying damage clothes?", a: "No, it is gentler and extends the life of fabrics." },
    { q: "How long does air drying take?", a: "About 2 to 4 hours depending on weather and fabric." }
  ],
  "Monthly = LoadsPerWeek * (Percent / 100) * DryerCost * 4.33",
  ["dryer-energy-cost-calculator", "laundry-cost-calculator", "laundry-load-calculator"]
);

add(
  "stain-removal-calculator",
  "Stain Removal Calculator",
  "Get treatment method and time by stain type.",
  "Everyday",
  "everyday",
  "~",
  ["stain", "removal", "treatment", "laundry"],
  [
    '{ name: "stainType", label: "Stain Type", type: "select", options: [{ value: "1", label: "Grease/Oil" }, { value: "2", label: "Wine/Juice" }, { value: "3", label: "Ink" }, { value: "4", label: "Blood" }, { value: "5", label: "Grass" }] }',
    '{ name: "items", label: "Number of Items", type: "number", min: 1, max: 20, defaultValue: 2 }',
    '{ name: "age", label: "Stain Age", type: "select", options: [{ value: "1", label: "Fresh (under 1 hour)" }, { value: "1.5", label: "Set (1 to 24 hours)" }, { value: "2", label: "Old (over 24 hours)" }] }',
  ],
  `(inputs) => {
    const stainType = inputs.stainType as number;
    const items = inputs.items as number;
    const age = inputs.age as number;
    const treatments = ["", "Dish soap and hot water soak", "Cold water and salt, then vinegar", "Rubbing alcohol and blotting", "Cold water rinse then hydrogen peroxide", "White vinegar and baking soda paste"];
    const baseTimes = [0, 15, 20, 25, 10, 15];
    const treatmentTime = Math.ceil(baseTimes[stainType] * age * items);
    const successRate = Math.max(50, 95 - (age - 1) * 20);
    const treatment = treatments[stainType];
    return { primary: { label: "Treatment Time", value: treatmentTime + " minutes" }, details: [{ label: "Recommended Treatment", value: treatment }, { label: "Number of Items", value: formatNumber(items) }, { label: "Estimated Success Rate", value: successRate + "%" }] };
  }`,
  [
    { q: "How do I remove grease stains?", a: "Apply dish soap directly and soak in hot water." },
    { q: "Can old stains be removed?", a: "Old stains are harder but multiple treatments can help." },
    { q: "Does cold or hot water work better?", a: "Cold water for blood and wine, hot for grease." }
  ],
  "Time = BaseTime[Type] * AgeFactor * Items",
  ["laundry-cost-calculator", "ironing-time-calculator", "dry-cleaning-cost-calculator"]
);

add(
  "ironing-time-calculator",
  "Ironing Time Calculator",
  "Estimate total ironing time for your garments.",
  "Everyday",
  "everyday",
  "~",
  ["ironing", "time", "garments", "wrinkles"],
  [
    '{ name: "shirts", label: "Dress Shirts", type: "number", min: 0, max: 30, defaultValue: 5 }',
    '{ name: "pants", label: "Pants and Trousers", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "dresses", label: "Dresses and Skirts", type: "number", min: 0, max: 15, defaultValue: 1 }',
    '{ name: "skill", label: "Skill Level", type: "select", options: [{ value: "1.5", label: "Beginner" }, { value: "1", label: "Intermediate" }, { value: "0.7", label: "Expert" }] }',
  ],
  `(inputs) => {
    const shirts = inputs.shirts as number;
    const pants = inputs.pants as number;
    const dresses = inputs.dresses as number;
    const skill = inputs.skill as number;
    const shirtTime = shirts * 6 * skill;
    const pantsTime = pants * 5 * skill;
    const dressTime = dresses * 8 * skill;
    const totalMinutes = Math.ceil(shirtTime + pantsTime + dressTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { primary: { label: "Total Ironing Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Shirts", value: Math.ceil(shirtTime) + " minutes" }, { label: "Pants", value: Math.ceil(pantsTime) + " minutes" }, { label: "Dresses and Skirts", value: Math.ceil(dressTime) + " minutes" }] };
  }`,
  [
    { q: "How long does it take to iron a shirt?", a: "About 5 to 8 minutes for a dress shirt." },
    { q: "What temperature should I iron at?", a: "Follow garment labels; cotton needs high heat, silk low." },
    { q: "Can I skip ironing?", a: "A steamer works well for light wrinkles on most fabrics." }
  ],
  "Total = Shirts * 6 + Pants * 5 + Dresses * 8, adjusted by skill",
  ["laundry-cost-calculator", "dry-cleaning-cost-calculator", "stain-removal-calculator"]
);

add(
  "dry-cleaning-cost-calculator",
  "Dry Cleaning Cost Calculator",
  "Estimate your monthly dry cleaning budget.",
  "Finance",
  "finance",
  "$",
  ["dry cleaning", "cost", "budget", "garments"],
  [
    '{ name: "suits", label: "Suits Per Month", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "shirts", label: "Dress Shirts Per Month", type: "number", min: 0, max: 30, defaultValue: 4 }',
    '{ name: "dresses", label: "Dresses Per Month", type: "number", min: 0, max: 15, defaultValue: 1 }',
    '{ name: "other", label: "Other Items Per Month", type: "number", min: 0, max: 20, defaultValue: 2 }',
  ],
  `(inputs) => {
    const suits = inputs.suits as number;
    const shirts = inputs.shirts as number;
    const dresses = inputs.dresses as number;
    const other = inputs.other as number;
    const suitCost = suits * 15;
    const shirtCost = shirts * 5;
    const dressCost = dresses * 12;
    const otherCost = other * 8;
    const monthlyCost = suitCost + shirtCost + dressCost + otherCost;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Monthly Dry Cleaning Cost", value: "$" + formatNumber(monthlyCost) }, details: [{ label: "Suits", value: "$" + formatNumber(suitCost) }, { label: "Dress Shirts", value: "$" + formatNumber(shirtCost) }, { label: "Dresses", value: "$" + formatNumber(dressCost) }, { label: "Other Items", value: "$" + formatNumber(otherCost) }, { label: "Annual Cost", value: "$" + formatNumber(yearlyCost) }] };
  }`,
  [
    { q: "How much does dry cleaning a suit cost?", a: "Typically $10 to $20 depending on location and service." },
    { q: "How often should suits be dry cleaned?", a: "After 3 to 4 wears or when visibly soiled." },
    { q: "Are there alternatives to dry cleaning?", a: "Home dry cleaning kits work for lightly soiled items." }
  ],
  "Monthly = Suits * 15 + Shirts * 5 + Dresses * 12 + Other * 8",
  ["laundry-cost-calculator", "ironing-time-calculator", "stain-removal-calculator"]
);
