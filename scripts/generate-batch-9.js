const fs = require('fs');
const path = require('path');
const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

const existingSlugs = new Set();
for (const file of fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  const m = fs.readFileSync(path.join(CALC_DIR, file), 'utf8').match(/slug:\s*"([^"]+)"/);
  if (m) existingSlugs.add(m[1]);
}
console.log(`Existing: ${existingSlugs.size}`);

function eName(slug) {
  const c = slug.replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c.endsWith('Calculator') ? c : c + 'Calculator';
}

const calcs = [];

function add(slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel) {
  calcs.push({ slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel: rel || [] });
}

// === BATCH 9: 100 CALCULATORS ===

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
add('security-camera-calculator', 'Security Camera Calculator',
  'Calculate the number of cameras needed for property coverage.',
  'Everyday', 'everyday', '~',
  ['security camera', 'surveillance camera calculator'],
  [
      '{ name: "perimeterFt", label: "Perimeter Length (ft)", type: "number", min: 10, max: 5000, defaultValue: 200 }',
      '{ name: "fov", label: "Camera Field of View (degrees)", type: "number", min: 30, max: 180, defaultValue: 90 }',
      '{ name: "entryPoints", label: "Entry Points", type: "number", min: 1, max: 50, defaultValue: 4 }',
      '{ name: "indoorCams", label: "Indoor Cameras", type: "number", min: 0, max: 50, defaultValue: 2 }',
  ],
  `(inputs) => {
      const p = inputs.perimeterFt as number;
      const fov = inputs.fov as number;
      const entry = inputs.entryPoints as number;
      const indoor = inputs.indoorCams as number;
      if (!p || !fov) return null;
      const coverage = fov / 360;
      const perimeterCams = Math.ceil(1 / coverage);
      const totalPerimeter = Math.ceil(p / 50) > perimeterCams ? Math.ceil(p / 50) : perimeterCams;
      const entryDedicated = Math.max(entry, 0);
      const total = totalPerimeter + entryDedicated + indoor;
      return {
        primary: { label: "Total Cameras Needed", value: formatNumber(total) },
        details: [
          { label: "Perimeter Cameras", value: formatNumber(totalPerimeter) },
          { label: "Entry Point Cameras", value: formatNumber(entryDedicated) },
          { label: "Indoor Cameras", value: formatNumber(indoor) },
        ],
      };
  }`,
  [{ q: 'How many cameras do I need for my home?', a: 'Most homes need 4 to 8 cameras covering all entry points and key areas.' },
   { q: 'What field of view is best for security cameras?', a: 'A 90 to 110 degree field of view covers most residential applications.' }],
  'Total = Perimeter Cameras + Entry Cameras + Indoor Cameras',
  []
);
add('security-system-cost-calculator', 'Security System Cost Calculator',
  'Estimate the total cost of a home security system.',
  'Finance', 'finance', '$',
  ['security system cost', 'home security price'],
  [
      '{ name: "cameras", label: "Number of Cameras", type: "number", min: 0, max: 50, defaultValue: 4 }',
      '{ name: "cameraCost", label: "Cost Per Camera ($)", type: "number", min: 20, max: 500, defaultValue: 100 }',
      '{ name: "sensors", label: "Door/Window Sensors", type: "number", min: 0, max: 50, defaultValue: 8 }',
      '{ name: "sensorCost", label: "Cost Per Sensor ($)", type: "number", min: 5, max: 100, defaultValue: 25 }',
      '{ name: "monthlySub", label: "Monthly Monitoring ($)", type: "number", min: 0, max: 100, defaultValue: 30 }',
      '{ name: "installFee", label: "Installation Fee ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
  ],
  `(inputs) => {
      const cams = inputs.cameras as number;
      const camCost = inputs.cameraCost as number;
      const sens = inputs.sensors as number;
      const sensCost = inputs.sensorCost as number;
      const monthly = inputs.monthlySub as number;
      const install = inputs.installFee as number;
      const equipTotal = cams * camCost + sens * sensCost;
      const yearOne = equipTotal + install + monthly * 12;
      const yearlyAfter = monthly * 12;
      return {
        primary: { label: "First Year Cost", value: "$" + formatNumber(Math.round(yearOne)) },
        details: [
          { label: "Equipment Cost", value: "$" + formatNumber(Math.round(equipTotal)) },
          { label: "Installation Fee", value: "$" + formatNumber(Math.round(install)) },
          { label: "Annual Monitoring", value: "$" + formatNumber(Math.round(yearlyAfter)) },
        ],
      };
  }`,
  [{ q: 'How much does a home security system cost?', a: 'A basic system costs $200 to $600 for equipment plus $20 to $50 per month.' },
   { q: 'Is professional monitoring worth it?', a: 'Professional monitoring provides 24/7 response and may lower insurance costs.' }],
  'Year 1 = Equipment + Install + Monthly x 12',
  []
);
add('motion-sensor-calculator', 'Motion Sensor Calculator',
  'Determine how many motion sensors are needed for an area.',
  'Everyday', 'everyday', '~',
  ['motion sensor', 'motion detector calculator'],
  [
      '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 5, max: 200, defaultValue: 20 }',
      '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 5, max: 200, defaultValue: 15 }',
      '{ name: "sensorRange", label: "Sensor Range (ft)", type: "number", min: 5, max: 60, defaultValue: 30 }',
      '{ name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 50, defaultValue: 4 }',
  ],
  `(inputs) => {
      const l = inputs.roomLength as number;
      const w = inputs.roomWidth as number;
      const r = inputs.sensorRange as number;
      const rooms = inputs.rooms as number;
      if (!l || !w || !r || !rooms) return null;
      const roomArea = l * w;
      const sensorCoverage = Math.PI * r * r;
      const sensorsPerRoom = Math.ceil(roomArea / sensorCoverage);
      const total = sensorsPerRoom * rooms;
      return {
        primary: { label: "Total Sensors Needed", value: formatNumber(total) },
        details: [
          { label: "Sensors Per Room", value: formatNumber(sensorsPerRoom) },
          { label: "Room Area", value: formatNumber(roomArea) + " sq ft" },
          { label: "Sensor Coverage", value: formatNumber(Math.round(sensorCoverage)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'Where should I place motion sensors?', a: 'Place sensors in hallways, stairways, and main living areas at 6 to 8 feet high.' },
   { q: 'Do motion sensors work with pets?', a: 'Pet-immune sensors ignore animals under 40 to 80 pounds depending on the model.' }],
  'Sensors = ceil(Room Area / Sensor Coverage) x Rooms',
  []
);
add('smart-lock-cost-calculator', 'Smart Lock Cost Calculator',
  'Estimate the cost to install smart locks on your doors.',
  'Finance', 'finance', '$',
  ['smart lock cost', 'electronic lock calculator'],
  [
      '{ name: "doors", label: "Number of Doors", type: "number", min: 1, max: 20, defaultValue: 3 }',
      '{ name: "lockCost", label: "Cost Per Lock ($)", type: "number", min: 50, max: 500, defaultValue: 200 }',
      '{ name: "installCost", label: "Install Per Lock ($)", type: "number", min: 0, max: 300, defaultValue: 75 }',
      '{ name: "bridgeHub", label: "Hub/Bridge Cost ($)", type: "number", min: 0, max: 200, defaultValue: 50 }',
  ],
  `(inputs) => {
      const doors = inputs.doors as number;
      const lock = inputs.lockCost as number;
      const inst = inputs.installCost as number;
      const hub = inputs.bridgeHub as number;
      if (!doors || !lock) return null;
      const lockTotal = doors * lock;
      const installTotal = doors * inst;
      const total = lockTotal + installTotal + hub;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Lock Hardware", value: "$" + formatNumber(Math.round(lockTotal)) },
          { label: "Installation", value: "$" + formatNumber(Math.round(installTotal)) },
          { label: "Hub/Bridge", value: "$" + formatNumber(Math.round(hub)) },
        ],
      };
  }`,
  [{ q: 'Are smart locks secure?', a: 'Quality smart locks meet ANSI Grade 1 or 2 standards and use AES encryption.' },
   { q: 'Do smart locks need Wi-Fi?', a: 'Some use Bluetooth only while others require Wi-Fi or a hub for remote access.' }],
  'Total = (Doors x Lock Cost) + (Doors x Install) + Hub',
  []
);
add('safe-size-calculator', 'Safe Size Calculator',
  'Determine the right safe dimensions for your valuables.',
  'Everyday', 'everyday', '~',
  ['safe size', 'safe capacity calculator'],
  [
      '{ name: "documents", label: "Document Folders", type: "number", min: 0, max: 50, defaultValue: 5 }',
      '{ name: "cashBundles", label: "Cash/Envelope Bundles", type: "number", min: 0, max: 50, defaultValue: 3 }',
      '{ name: "jewelryBoxes", label: "Jewelry Boxes", type: "number", min: 0, max: 20, defaultValue: 2 }',
      '{ name: "firearms", label: "Handguns", type: "number", min: 0, max: 20, defaultValue: 0 }',
      '{ name: "electronics", label: "Small Electronics", type: "number", min: 0, max: 20, defaultValue: 1 }',
  ],
  `(inputs) => {
      const docs = inputs.documents as number;
      const cash = inputs.cashBundles as number;
      const jewel = inputs.jewelryBoxes as number;
      const guns = inputs.firearms as number;
      const elec = inputs.electronics as number;
      const docVol = docs * 100;
      const cashVol = cash * 30;
      const jewelVol = jewel * 200;
      const gunVol = guns * 300;
      const elecVol = elec * 150;
      const totalCuIn = docVol + cashVol + jewelVol + gunVol + elecVol;
      const cuFt = Math.round((totalCuIn / 1728) * 100) / 100;
      const recommended = Math.round(cuFt * 1.5 * 100) / 100;
      return {
        primary: { label: "Recommended Safe Size", value: formatNumber(recommended) + " cu ft" },
        details: [
          { label: "Item Volume", value: formatNumber(totalCuIn) + " cu in" },
          { label: "Minimum Capacity", value: formatNumber(cuFt) + " cu ft" },
          { label: "Buffer Factor", value: "1.5x" },
        ],
      };
  }`,
  [{ q: 'What size safe do I need for documents?', a: 'A 0.5 to 1.0 cubic foot safe holds important papers and small valuables.' },
   { q: 'Should I bolt down my safe?', a: 'Yes, bolting the safe to the floor or wall greatly increases security.' }],
  'Recommended = (Total Item Volume / 1728) x 1.5',
  []
);
add('emergency-water-supply-calculator', 'Emergency Water Supply Calculator',
  'Calculate water storage needed for emergency preparedness.',
  'Everyday', 'everyday', '~',
  ['emergency water', 'water storage calculator'],
  [
      '{ name: "people", label: "Number of People", type: "number", min: 1, max: 50, defaultValue: 4 }',
      '{ name: "days", label: "Days of Supply", type: "number", min: 1, max: 90, defaultValue: 14 }',
      '{ name: "gallonsPerDay", label: "Gallons Per Person Per Day", type: "number", min: 0.5, max: 5, defaultValue: 1 }',
      '{ name: "pets", label: "Number of Pets", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const days = inputs.days as number;
      const gpd = inputs.gallonsPerDay as number;
      const pets = inputs.pets as number;
      if (!people || !days || !gpd) return null;
      const humanWater = people * days * gpd;
      const petWater = pets * days * 0.5;
      const total = Math.round((humanWater + petWater) * 100) / 100;
      const liters = Math.round(total * 3.785 * 100) / 100;
      return {
        primary: { label: "Total Water Needed", value: formatNumber(total) + " gallons" },
        details: [
          { label: "Human Water", value: formatNumber(humanWater) + " gallons" },
          { label: "Pet Water", value: formatNumber(petWater) + " gallons" },
          { label: "In Liters", value: formatNumber(liters) + " L" },
        ],
      };
  }`,
  [{ q: 'How much water should I store per person?', a: 'Store at least one gallon per person per day for drinking and sanitation.' },
   { q: 'How long does stored water last?', a: 'Commercially bottled water lasts up to two years; rotate home-stored water every 6 months.' }],
  'Total = (People x Days x Gal/Day) + (Pets x Days x 0.5)',
  []
);
add('emergency-food-supply-calculator', 'Emergency Food Supply Calculator',
  'Calculate food supplies needed for family emergency prep.',
  'Everyday', 'everyday', '~',
  ['emergency food', 'food storage calculator'],
  [
      '{ name: "people", label: "Number of People", type: "number", min: 1, max: 50, defaultValue: 4 }',
      '{ name: "days", label: "Days of Supply", type: "number", min: 1, max: 365, defaultValue: 14 }',
      '{ name: "calsPerDay", label: "Calories Per Person Per Day", type: "number", min: 1000, max: 4000, defaultValue: 2000 }',
      '{ name: "costPerMeal", label: "Cost Per Meal ($)", type: "number", min: 1, max: 20, defaultValue: 4 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const days = inputs.days as number;
      const cals = inputs.calsPerDay as number;
      const cost = inputs.costPerMeal as number;
      if (!people || !days || !cals) return null;
      const totalCals = people * days * cals;
      const meals = people * days * 3;
      const totalCost = meals * cost;
      return {
        primary: { label: "Total Calories Needed", value: formatNumber(totalCals) },
        details: [
          { label: "Total Meals", value: formatNumber(meals) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Calories Per Person", value: formatNumber(days * cals) },
        ],
      };
  }`,
  [{ q: 'What foods are best for emergency storage?', a: 'Canned goods, freeze-dried meals, rice, and beans have long shelf lives.' },
   { q: 'How many calories do I need daily in an emergency?', a: 'Plan for 2000 calories per adult per day at minimum.' }],
  'Total Calories = People x Days x Calories/Day',
  []
);
add('emergency-generator-fuel-calculator', 'Emergency Generator Fuel Calculator',
  'Estimate fuel needed to run a generator during outages.',
  'Everyday', 'everyday', '~',
  ['generator fuel', 'generator runtime calculator'],
  [
      '{ name: "wattage", label: "Generator Wattage (W)", type: "number", min: 500, max: 20000, defaultValue: 5000 }',
      '{ name: "loadPct", label: "Average Load (%)", type: "number", min: 10, max: 100, defaultValue: 50 }',
      '{ name: "hours", label: "Hours of Use Per Day", type: "number", min: 1, max: 24, defaultValue: 12 }',
      '{ name: "days", label: "Number of Days", type: "number", min: 1, max: 30, defaultValue: 3 }',
      '{ name: "fuelRate", label: "Fuel Rate (gal/hr at full)", type: "number", min: 0.2, max: 5, defaultValue: 0.75 }',
  ],
  `(inputs) => {
      const watt = inputs.wattage as number;
      const load = inputs.loadPct as number;
      const hrs = inputs.hours as number;
      const days = inputs.days as number;
      const rate = inputs.fuelRate as number;
      if (!watt || !load || !hrs || !days || !rate) return null;
      const actualRate = rate * (load / 100);
      const dailyFuel = Math.round(actualRate * hrs * 100) / 100;
      const totalFuel = Math.round(dailyFuel * days * 100) / 100;
      return {
        primary: { label: "Total Fuel Needed", value: formatNumber(totalFuel) + " gallons" },
        details: [
          { label: "Daily Consumption", value: formatNumber(dailyFuel) + " gal/day" },
          { label: "Hourly Rate at Load", value: formatNumber(Math.round(actualRate * 100) / 100) + " gal/hr" },
          { label: "Total Runtime", value: formatNumber(hrs * days) + " hours" },
        ],
      };
  }`,
  [{ q: 'How much fuel does a generator use per hour?', a: 'A 5000W generator uses about 0.5 to 0.75 gallons per hour at half load.' },
   { q: 'How should I store generator fuel?', a: 'Use approved containers in a ventilated area and add stabilizer for long storage.' }],
  'Total Fuel = Fuel Rate x (Load/100) x Hours/Day x Days',
  []
);
add('first-aid-kit-calculator', 'First Aid Kit Calculator',
  'Determine first aid supplies needed for your group size.',
  'Everyday', 'everyday', '~',
  ['first aid kit', 'first aid supplies calculator'],
  [
      '{ name: "people", label: "Number of People", type: "number", min: 1, max: 200, defaultValue: 10 }',
      '{ name: "kitType", label: "Kit Type", type: "select", options: [{ value: "1", label: "Basic Home" }, { value: "2", label: "Workplace" }, { value: "3", label: "Wilderness/Travel" }], defaultValue: "1" }',
      '{ name: "duration", label: "Duration (days)", type: "number", min: 1, max: 365, defaultValue: 30 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const kt = Number(inputs.kitType as number);
      const dur = inputs.duration as number;
      if (!people || !kt || !dur) return null;
      const multiplier = kt === 3 ? 2 : kt === 2 ? 1.5 : 1;
      const bandages = Math.ceil(people * 2 * multiplier);
      const gauze = Math.ceil(people * 1 * multiplier);
      const antiseptic = Math.ceil(people * 0.5 * multiplier);
      const gloves = Math.ceil(people * 2 * multiplier);
      return {
        primary: { label: "Bandages Needed", value: formatNumber(bandages) },
        details: [
          { label: "Gauze Pads", value: formatNumber(gauze) },
          { label: "Antiseptic Wipes", value: formatNumber(antiseptic) },
          { label: "Pairs of Gloves", value: formatNumber(gloves) },
        ],
      };
  }`,
  [{ q: 'What should be in a basic first aid kit?', a: 'Include bandages, gauze, antiseptic, tape, scissors, and pain relievers at minimum.' },
   { q: 'How often should I replace first aid supplies?', a: 'Check expiration dates every 6 months and replace used or expired items.' }],
  'Supplies = People x Base Quantity x Kit Multiplier',
  []
);
add('evacuation-time-calculator', 'Evacuation Time Calculator',
  'Estimate building evacuation time based on occupancy.',
  'Everyday', 'everyday', '~',
  ['evacuation time', 'building evacuation calculator'],
  [
      '{ name: "occupants", label: "Building Occupants", type: "number", min: 1, max: 10000, defaultValue: 200 }',
      '{ name: "exits", label: "Number of Exits", type: "number", min: 1, max: 20, defaultValue: 4 }',
      '{ name: "exitWidth", label: "Exit Width (inches)", type: "number", min: 20, max: 72, defaultValue: 36 }',
      '{ name: "floors", label: "Number of Floors", type: "number", min: 1, max: 50, defaultValue: 3 }',
  ],
  `(inputs) => {
      const occ = inputs.occupants as number;
      const exits = inputs.exits as number;
      const ew = inputs.exitWidth as number;
      const floors = inputs.floors as number;
      if (!occ || !exits || !ew || !floors) return null;
      const persPerUnit = ew / 22;
      const flowRate = Math.floor(persPerUnit * 60);
      const totalFlow = flowRate * exits;
      const baseTime = Math.ceil(occ / totalFlow);
      const travelTime = Math.ceil(floors * 0.5);
      const totalMin = baseTime + travelTime;
      return {
        primary: { label: "Estimated Evacuation Time", value: formatNumber(totalMin) + " min" },
        details: [
          { label: "Flow Rate Per Exit", value: formatNumber(flowRate) + " persons/min" },
          { label: "Total Flow Capacity", value: formatNumber(totalFlow) + " persons/min" },
          { label: "Stairwell Travel Time", value: formatNumber(travelTime) + " min" },
        ],
      };
  }`,
  [{ q: 'How fast can a building be evacuated?', a: 'Most commercial buildings target full evacuation in under 3 to 5 minutes.' },
   { q: 'How wide should exit doors be?', a: 'Fire codes typically require at least 32 to 36 inches of clear exit width.' }],
  'Time = ceil(Occupants / (Flow Rate x Exits)) + Floor Travel',
  []
);
add('fire-extinguisher-calculator', 'Fire Extinguisher Calculator',
  'Calculate the number of extinguishers needed for a building.',
  'Everyday', 'everyday', '~',
  ['fire extinguisher', 'fire extinguisher placement'],
  [
      '{ name: "sqft", label: "Building Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 5000 }',
      '{ name: "floors", label: "Number of Floors", type: "number", min: 1, max: 50, defaultValue: 2 }',
      '{ name: "hazardLevel", label: "Hazard Level", type: "select", options: [{ value: "1", label: "Light (Office)" }, { value: "2", label: "Ordinary (Retail)" }, { value: "3", label: "Extra (Industrial)" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const floors = inputs.floors as number;
      const hazard = Number(inputs.hazardLevel as number);
      if (!sqft || !floors || !hazard) return null;
      const maxTravel = hazard === 3 ? 50 : hazard === 2 ? 50 : 75;
      const coveragePerUnit = Math.PI * maxTravel * maxTravel;
      const perFloor = Math.ceil((sqft / floors) / coveragePerUnit);
      const minPerFloor = hazard === 3 ? 3 : 2;
      const actual = Math.max(perFloor, minPerFloor);
      const total = actual * floors;
      return {
        primary: { label: "Extinguishers Needed", value: formatNumber(total) },
        details: [
          { label: "Per Floor", value: formatNumber(actual) },
          { label: "Max Travel Distance", value: formatNumber(maxTravel) + " ft" },
          { label: "Coverage Per Unit", value: formatNumber(Math.round(coveragePerUnit)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How far apart should fire extinguishers be?', a: 'NFPA code requires no more than 75 feet of travel for light hazard areas.' },
   { q: 'What type of extinguisher do I need?', a: 'ABC-rated extinguishers cover most ordinary fire risks in commercial buildings.' }],
  'Total = max(ceil(Floor Area / Coverage), Min Per Floor) x Floors',
  []
);
add('smoke-detector-calculator', 'Smoke Detector Calculator',
  'Determine how many smoke detectors your building needs.',
  'Everyday', 'everyday', '~',
  ['smoke detector', 'smoke alarm calculator'],
  [
      '{ name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 0, max: 30, defaultValue: 3 }',
      '{ name: "floors", label: "Number of Floors", type: "number", min: 1, max: 10, defaultValue: 2 }',
      '{ name: "commonRooms", label: "Common Rooms", type: "number", min: 0, max: 20, defaultValue: 3 }',
      '{ name: "basement", label: "Has Basement (0=No, 1=Yes)", type: "number", min: 0, max: 1, defaultValue: 1 }',
  ],
  `(inputs) => {
      const beds = inputs.bedrooms as number;
      const floors = inputs.floors as number;
      const common = inputs.commonRooms as number;
      const bsmt = inputs.basement as number;
      const bedroomDetectors = beds;
      const hallDetectors = floors;
      const commonDetectors = common;
      const basementDetector = bsmt > 0 ? 1 : 0;
      const total = bedroomDetectors + hallDetectors + commonDetectors + basementDetector;
      return {
        primary: { label: "Smoke Detectors Needed", value: formatNumber(total) },
        details: [
          { label: "Bedroom Detectors", value: formatNumber(bedroomDetectors) },
          { label: "Hallway/Floor Detectors", value: formatNumber(hallDetectors) },
          { label: "Common Room Detectors", value: formatNumber(commonDetectors) },
        ],
      };
  }`,
  [{ q: 'Where should I install smoke detectors?', a: 'Install in each bedroom, outside sleeping areas, on every level, and in the basement.' },
   { q: 'How often should I replace smoke detectors?', a: 'Replace smoke detectors every 10 years and test them monthly.' }],
  'Total = Bedrooms + Floors + Common Rooms + Basement',
  []
);
add('lightning-rod-calculator', 'Lightning Rod Calculator',
  'Calculate lightning protection requirements for a building.',
  'Science', 'science', 'A',
  ['lightning rod', 'lightning protection calculator'],
  [
      '{ name: "roofLength", label: "Roof Length (ft)", type: "number", min: 10, max: 500, defaultValue: 60 }',
      '{ name: "roofWidth", label: "Roof Width (ft)", type: "number", min: 10, max: 500, defaultValue: 40 }',
      '{ name: "buildingHeight", label: "Building Height (ft)", type: "number", min: 10, max: 300, defaultValue: 30 }',
      '{ name: "rodSpacing", label: "Rod Spacing (ft)", type: "number", min: 10, max: 25, defaultValue: 20 }',
  ],
  `(inputs) => {
      const rl = inputs.roofLength as number;
      const rw = inputs.roofWidth as number;
      const bh = inputs.buildingHeight as number;
      const sp = inputs.rodSpacing as number;
      if (!rl || !rw || !bh || !sp) return null;
      const rodsLength = Math.ceil(rl / sp) + 1;
      const rodsWidth = Math.ceil(rw / sp) + 1;
      const totalRods = 2 * (rodsLength + rodsWidth) - 4;
      const conductorFt = Math.round((rl + rw) * 2 + bh * 4 + 20);
      const groundRods = Math.max(2, Math.ceil(totalRods / 4));
      return {
        primary: { label: "Air Terminals Needed", value: formatNumber(totalRods) },
        details: [
          { label: "Conductor Cable", value: formatNumber(conductorFt) + " ft" },
          { label: "Ground Rods", value: formatNumber(groundRods) },
          { label: "Protection Zone Radius", value: formatNumber(bh) + " ft" },
        ],
      };
  }`,
  [{ q: 'How does a lightning rod work?', a: 'It provides a low-resistance path to safely direct lightning current into the ground.' },
   { q: 'How far apart should lightning rods be?', a: 'NFPA 780 requires air terminals spaced no more than 20 to 25 feet apart.' }],
  'Rods = 2 x (ceil(L/Spacing) + ceil(W/Spacing) + 2) - 4',
  []
);
add('flood-insurance-calculator', 'Flood Insurance Calculator',
  'Estimate annual flood insurance premium costs.',
  'Finance', 'finance', '$',
  ['flood insurance', 'flood insurance cost'],
  [
      '{ name: "homeValue", label: "Home Value ($)", type: "number", min: 50000, max: 2000000, defaultValue: 300000 }',
      '{ name: "coverage", label: "Coverage Amount ($)", type: "number", min: 20000, max: 250000, defaultValue: 250000 }',
      '{ name: "floodZone", label: "Flood Zone Risk", type: "select", options: [{ value: "1", label: "Low (X Zone)" }, { value: "2", label: "Moderate (B/C Zone)" }, { value: "3", label: "High (A/V Zone)" }], defaultValue: "2" }',
      '{ name: "deductible", label: "Deductible ($)", type: "number", min: 1000, max: 10000, defaultValue: 2000 }',
  ],
  `(inputs) => {
      const hv = inputs.homeValue as number;
      const cov = inputs.coverage as number;
      const zone = Number(inputs.floodZone as number);
      const ded = inputs.deductible as number;
      if (!hv || !cov || !zone) return null;
      const baseRate = zone === 3 ? 0.012 : zone === 2 ? 0.005 : 0.002;
      const dedFactor = ded >= 5000 ? 0.85 : ded >= 2000 ? 0.95 : 1;
      const annualPremium = Math.round(cov * baseRate * dedFactor);
      const monthlyPremium = Math.round(annualPremium / 12);
      return {
        primary: { label: "Annual Premium", value: "$" + formatNumber(annualPremium) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(monthlyPremium) },
          { label: "Coverage Amount", value: "$" + formatNumber(cov) },
          { label: "Deductible", value: "$" + formatNumber(ded) },
        ],
      };
  }`,
  [{ q: 'Do I need flood insurance?', a: 'Lenders require it in high-risk zones; it is recommended in moderate zones too.' },
   { q: 'What does flood insurance cover?', a: 'It covers building structure and contents damaged by flooding up to policy limits.' }],
  'Premium = Coverage x Base Rate x Deductible Factor',
  []
);
add('earthquake-retrofit-calculator', 'Earthquake Retrofit Calculator',
  'Estimate the cost of seismic retrofitting for a building.',
  'Finance', 'finance', '$',
  ['earthquake retrofit', 'seismic retrofit cost'],
  [
      '{ name: "sqft", label: "Building Area (sq ft)", type: "number", min: 500, max: 50000, defaultValue: 2000 }',
      '{ name: "stories", label: "Number of Stories", type: "number", min: 1, max: 10, defaultValue: 2 }',
      '{ name: "foundation", label: "Foundation Type", type: "select", options: [{ value: "1", label: "Bolted Slab" }, { value: "2", label: "Raised/Cripple Wall" }, { value: "3", label: "Unreinforced Masonry" }], defaultValue: "2" }',
      '{ name: "yearBuilt", label: "Year Built", type: "number", min: 1900, max: 2025, defaultValue: 1970 }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const stories = inputs.stories as number;
      const fdn = Number(inputs.foundation as number);
      const year = inputs.yearBuilt as number;
      if (!sqft || !stories || !fdn) return null;
      const baseCost = fdn === 3 ? 15 : fdn === 2 ? 8 : 4;
      const ageFactor = year < 1950 ? 1.4 : year < 1980 ? 1.2 : 1;
      const storyFactor = 1 + (stories - 1) * 0.15;
      const totalCost = Math.round(sqft * baseCost * ageFactor * storyFactor);
      return {
        primary: { label: "Estimated Retrofit Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost Per Sq Ft", value: "$" + formatNumber(Math.round(baseCost * ageFactor * storyFactor * 100) / 100) },
          { label: "Age Factor", value: ageFactor + "x" },
          { label: "Story Factor", value: Math.round(storyFactor * 100) / 100 + "x" },
        ],
      };
  }`,
  [{ q: 'How much does earthquake retrofitting cost?', a: 'Typical residential retrofits cost $3,000 to $7,000 for bolting and bracing.' },
   { q: 'Is earthquake retrofitting worth it?', a: 'Yes, it significantly reduces structural damage and can lower insurance premiums.' }],
  'Cost = Sq Ft x Base Rate x Age Factor x Story Factor',
  []
);
add('ada-compliance-calculator', 'ADA Compliance Calculator',
  'Check ADA ramp slope and doorway width requirements.',
  'Everyday', 'everyday', '~',
  ['ADA compliance', 'ADA ramp calculator'],
  [
      '{ name: "riseInches", label: "Ramp Rise (inches)", type: "number", min: 1, max: 60, defaultValue: 12 }',
      '{ name: "runFeet", label: "Ramp Run (feet)", type: "number", min: 1, max: 100, defaultValue: 10 }',
      '{ name: "doorWidth", label: "Doorway Width (inches)", type: "number", min: 20, max: 60, defaultValue: 36 }',
      '{ name: "landingDepth", label: "Landing Depth (inches)", type: "number", min: 30, max: 120, defaultValue: 60 }',
  ],
  `(inputs) => {
      const rise = inputs.riseInches as number;
      const run = inputs.runFeet as number;
      const door = inputs.doorWidth as number;
      const landing = inputs.landingDepth as number;
      if (!rise || !run) return null;
      const runInches = run * 12;
      const slope = rise / runInches;
      const slopeRatio = Math.round((1 / slope) * 10) / 10;
      const slopePass = slope <= (1 / 12);
      const doorPass = door >= 32;
      const landingPass = landing >= 60;
      const allPass = slopePass && doorPass && landingPass;
      return {
        primary: { label: "ADA Compliance", value: allPass ? "PASSES" : "FAILS" },
        details: [
          { label: "Ramp Slope", value: "1:" + formatNumber(slopeRatio) + (slopePass ? " (Pass)" : " (Fail, need 1:12+)") },
          { label: "Door Width", value: formatNumber(door) + " in" + (doorPass ? " (Pass)" : " (Fail, need 32+)") },
          { label: "Landing Depth", value: formatNumber(landing) + " in" + (landingPass ? " (Pass)" : " (Fail, need 60+)") },
        ],
      };
  }`,
  [{ q: 'What is the maximum ADA ramp slope?', a: 'The maximum slope is 1:12, meaning 1 inch of rise for every 12 inches of run.' },
   { q: 'What is the minimum ADA door width?', a: 'ADA requires a minimum clear opening width of 32 inches.' }],
  'Slope = Rise / Run; Must be <= 1:12',
  []
);
add('osha-noise-exposure-calculator', 'OSHA Noise Exposure Calculator',
  'Calculate noise dose and time-weighted average for OSHA.',
  'Health', 'health', 'H',
  ['OSHA noise', 'noise exposure calculator', 'TWA noise'],
  [
      '{ name: "noiseLevel", label: "Noise Level (dBA)", type: "number", min: 60, max: 140, defaultValue: 90 }',
      '{ name: "hours", label: "Exposure Hours", type: "number", min: 0.25, max: 16, defaultValue: 8 }',
      '{ name: "noiseLevel2", label: "Second Noise Level (dBA)", type: "number", min: 0, max: 140, defaultValue: 0 }',
      '{ name: "hours2", label: "Second Exposure Hours", type: "number", min: 0, max: 16, defaultValue: 0 }',
  ],
  `(inputs) => {
      const db1 = inputs.noiseLevel as number;
      const h1 = inputs.hours as number;
      const db2 = inputs.noiseLevel2 as number;
      const h2 = inputs.hours2 as number;
      if (!db1 || !h1) return null;
      const allowed1 = 8 / Math.pow(2, (db1 - 90) / 5);
      const dose1 = (h1 / allowed1) * 100;
      let totalDose = dose1;
      if (db2 > 0 && h2 > 0) {
        const allowed2 = 8 / Math.pow(2, (db2 - 90) / 5);
        totalDose += (h2 / allowed2) * 100;
      }
      const twa = 90 + 16.61 * Math.log10(totalDose / 100);
      return {
        primary: { label: "Noise Dose", value: formatNumber(Math.round(totalDose * 10) / 10) + "%" },
        details: [
          { label: "TWA (8-hr)", value: formatNumber(Math.round(twa * 10) / 10) + " dBA" },
          { label: "OSHA Limit", value: totalDose <= 100 ? "Within Limit" : "EXCEEDS LIMIT" },
          { label: "Allowed Time at " + db1 + " dBA", value: formatNumber(Math.round(allowed1 * 100) / 100) + " hrs" },
        ],
      };
  }`,
  [{ q: 'What is the OSHA noise exposure limit?', a: 'OSHA allows 90 dBA for 8 hours with a 5 dB exchange rate.' },
   { q: 'What is a noise dose?', a: 'Noise dose is the percentage of allowable exposure received during a work shift.' }],
  'Dose = (Hours / Allowed Hours) x 100; TWA = 90 + 16.61 x log10(Dose/100)',
  []
);
add('fire-code-occupancy-calculator', 'Fire Code Occupancy Calculator',
  'Calculate maximum occupancy per fire code standards.',
  'Everyday', 'everyday', '~',
  ['fire code occupancy', 'max occupancy calculator'],
  [
      '{ name: "sqft", label: "Floor Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 2000 }',
      '{ name: "useType", label: "Occupancy Type", type: "select", options: [{ value: "7", label: "Assembly (standing) - 7 sqft" }, { value: "15", label: "Assembly (seating) - 15 sqft" }, { value: "100", label: "Business/Office - 100 sqft" }, { value: "200", label: "Industrial - 200 sqft" }, { value: "50", label: "Mercantile - 50 sqft" }], defaultValue: "15" }',
      '{ name: "exits", label: "Number of Exits", type: "number", min: 1, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const factor = Number(inputs.useType as number);
      const exits = inputs.exits as number;
      if (!sqft || !factor || !exits) return null;
      const maxByArea = Math.floor(sqft / factor);
      const maxByExit = exits * 250;
      const maxOccupancy = Math.min(maxByArea, maxByExit);
      return {
        primary: { label: "Maximum Occupancy", value: formatNumber(maxOccupancy) },
        details: [
          { label: "By Floor Area", value: formatNumber(maxByArea) + " persons" },
          { label: "By Exit Capacity", value: formatNumber(maxByExit) + " persons" },
          { label: "Load Factor Used", value: formatNumber(factor) + " sq ft/person" },
        ],
      };
  }`,
  [{ q: 'How is maximum occupancy calculated?', a: 'Divide the floor area by the occupancy load factor for the use type.' },
   { q: 'How many exits are required?', a: 'Two exits are required when occupancy exceeds 49 people in most jurisdictions.' }],
  'Max Occupancy = min(Floor Area / Load Factor, Exits x 250)',
  []
);
add('parking-lot-striping-calculator', 'Parking Lot Striping Calculator',
  'Calculate parking spaces and paint needed for a lot.',
  'Everyday', 'everyday', '~',
  ['parking lot striping', 'parking space calculator'],
  [
      '{ name: "lotLength", label: "Lot Length (ft)", type: "number", min: 20, max: 2000, defaultValue: 200 }',
      '{ name: "lotWidth", label: "Lot Width (ft)", type: "number", min: 20, max: 2000, defaultValue: 100 }',
      '{ name: "spaceWidth", label: "Space Width (ft)", type: "number", min: 7, max: 12, defaultValue: 9 }',
      '{ name: "spaceLength", label: "Space Length (ft)", type: "number", min: 15, max: 25, defaultValue: 18 }',
      '{ name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 12, max: 30, defaultValue: 24 }',
  ],
  `(inputs) => {
      const ll = inputs.lotLength as number;
      const lw = inputs.lotWidth as number;
      const sw = inputs.spaceWidth as number;
      const sl = inputs.spaceLength as number;
      const aw = inputs.aisleWidth as number;
      if (!ll || !lw || !sw || !sl || !aw) return null;
      const rowDepth = sl * 2 + aw;
      const rows = Math.floor(lw / rowDepth);
      const spacesPerRow = Math.floor(ll / sw) * 2;
      const totalSpaces = rows * spacesPerRow;
      const stripeFt = totalSpaces * (sl + 0.33) * 2;
      const paintGal = Math.ceil(stripeFt / 600);
      return {
        primary: { label: "Total Parking Spaces", value: formatNumber(totalSpaces) },
        details: [
          { label: "Double Rows", value: formatNumber(rows) },
          { label: "Stripe Length", value: formatNumber(Math.round(stripeFt)) + " ft" },
          { label: "Paint Needed", value: formatNumber(paintGal) + " gallons" },
        ],
      };
  }`,
  [{ q: 'What is a standard parking space size?', a: 'A standard space is 9 feet wide by 18 feet long with a 24-foot aisle.' },
   { q: 'How many ADA spaces are required?', a: 'One ADA space per 25 standard spaces for lots with 1 to 25 total spaces.' }],
  'Spaces = Rows x (Lot Length / Space Width) x 2',
  []
);
add('sign-size-calculator', 'Sign Size Calculator',
  'Determine sign dimensions for readability at a distance.',
  'Everyday', 'everyday', '~',
  ['sign size', 'sign visibility calculator'],
  [
      '{ name: "viewingDist", label: "Viewing Distance (ft)", type: "number", min: 10, max: 2000, defaultValue: 200 }',
      '{ name: "numChars", label: "Number of Characters", type: "number", min: 1, max: 50, defaultValue: 12 }',
      '{ name: "signType", label: "Sign Type", type: "select", options: [{ value: "1", label: "Roadway (1 in per 50 ft)" }, { value: "0.67", label: "Pedestrian (1 in per 30 ft)" }, { value: "1.5", label: "Highway (1 in per 67 ft)" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const dist = inputs.viewingDist as number;
      const chars = inputs.numChars as number;
      const ratio = Number(inputs.signType as number);
      if (!dist || !chars || !ratio) return null;
      const letterHeight = Math.ceil(dist / (50 / ratio));
      const letterWidth = Math.round(letterHeight * 0.6);
      const signWidth = Math.ceil(letterWidth * chars * 1.2 + 12);
      const signHeight = Math.ceil(letterHeight * 2 + 12);
      return {
        primary: { label: "Minimum Sign Size", value: formatNumber(signWidth) + " x " + formatNumber(signHeight) + " in" },
        details: [
          { label: "Letter Height", value: formatNumber(letterHeight) + " in" },
          { label: "Letter Width", value: formatNumber(letterWidth) + " in" },
          { label: "Viewing Distance", value: formatNumber(dist) + " ft" },
        ],
      };
  }`,
  [{ q: 'How big should sign letters be?', a: 'Use 1 inch of letter height for every 50 feet of viewing distance on roads.' },
   { q: 'What font is best for signs?', a: 'Sans-serif fonts like Helvetica or Highway Gothic provide the best readability.' }],
  'Letter Height = Distance / 50; Sign Size includes margins',
  []
);
add('loading-dock-calculator', 'Loading Dock Calculator',
  'Calculate loading dock dimensions and requirements.',
  'Everyday', 'everyday', '~',
  ['loading dock', 'loading dock size calculator'],
  [
      '{ name: "dockPositions", label: "Number of Dock Positions", type: "number", min: 1, max: 30, defaultValue: 4 }',
      '{ name: "truckType", label: "Truck Type", type: "select", options: [{ value: "48", label: "Standard Semi (48 ft)" }, { value: "53", label: "Long Semi (53 ft)" }, { value: "24", label: "Box Truck (24 ft)" }], defaultValue: "48" }',
      '{ name: "dockWidth", label: "Dock Door Width (ft)", type: "number", min: 8, max: 14, defaultValue: 10 }',
      '{ name: "apronDepth", label: "Approach Apron Depth (ft)", type: "number", min: 30, max: 120, defaultValue: 60 }',
  ],
  `(inputs) => {
      const positions = inputs.dockPositions as number;
      const truckLen = Number(inputs.truckType as number);
      const dw = inputs.dockWidth as number;
      const apron = inputs.apronDepth as number;
      if (!positions || !truckLen || !dw) return null;
      const centerSpacing = dw + 4;
      const totalWidth = positions * centerSpacing;
      const dockDepth = 8;
      const totalDepth = truckLen + apron + dockDepth;
      const totalArea = totalWidth * totalDepth;
      return {
        primary: { label: "Total Dock Area", value: formatNumber(totalArea) + " sq ft" },
        details: [
          { label: "Dock Wall Width", value: formatNumber(totalWidth) + " ft" },
          { label: "Total Depth Required", value: formatNumber(totalDepth) + " ft" },
          { label: "Center-to-Center Spacing", value: formatNumber(centerSpacing) + " ft" },
        ],
      };
  }`,
  [{ q: 'How wide should a loading dock door be?', a: 'Standard dock doors are 8 to 10 feet wide and 8 to 10 feet tall.' },
   { q: 'How much apron space does a truck need?', a: 'A standard semi needs at least 60 feet of approach apron for turning.' }],
  'Dock Area = (Positions x Spacing) x (Truck Length + Apron + Dock Depth)',
  []
);
add('commercial-kitchen-ventilation-calculator', 'Commercial Kitchen Ventilation Calculator',
  'Calculate kitchen exhaust hood CFM requirements.',
  'Science', 'science', 'A',
  ['kitchen ventilation', 'kitchen hood CFM calculator'],
  [
      '{ name: "hoodLength", label: "Hood Length (ft)", type: "number", min: 3, max: 30, defaultValue: 10 }',
      '{ name: "hoodWidth", label: "Hood Width (ft)", type: "number", min: 2, max: 10, defaultValue: 4 }',
      '{ name: "cookingType", label: "Cooking Type", type: "select", options: [{ value: "300", label: "Light Duty (300 CFM/ft)" }, { value: "400", label: "Medium Duty (400 CFM/ft)" }, { value: "500", label: "Heavy Duty (500 CFM/ft)" }], defaultValue: "400" }',
      '{ name: "hoodType", label: "Hood Style", type: "select", options: [{ value: "1", label: "Wall Canopy" }, { value: "1.4", label: "Island Canopy" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const hl = inputs.hoodLength as number;
      const hw = inputs.hoodWidth as number;
      const cfmPerFt = Number(inputs.cookingType as number);
      const hoodFactor = Number(inputs.hoodType as number);
      if (!hl || !hw || !cfmPerFt) return null;
      const baseCFM = cfmPerFt * hl;
      const totalCFM = Math.round(baseCFM * hoodFactor);
      const makeupAir = Math.round(totalCFM * 0.8);
      const ductDia = Math.ceil(Math.sqrt((totalCFM / 1500) * 4 / Math.PI) * 12);
      return {
        primary: { label: "Exhaust CFM Required", value: formatNumber(totalCFM) + " CFM" },
        details: [
          { label: "Makeup Air Needed", value: formatNumber(makeupAir) + " CFM" },
          { label: "Estimated Duct Diameter", value: formatNumber(ductDia) + " in" },
          { label: "Hood Area", value: formatNumber(hl * hw) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How many CFM does a commercial kitchen need?', a: 'Light duty needs 300 CFM per linear foot; heavy duty needs 400 to 500 CFM per foot.' },
   { q: 'What is makeup air?', a: 'Makeup air replaces exhausted air to maintain proper building pressure balance.' }],
  'CFM = CFM Per Linear Foot x Hood Length x Hood Factor',
  []
);
add('restaurant-seating-calculator', 'Restaurant Seating Calculator',
  'Plan restaurant seating capacity from floor area.',
  'Everyday', 'everyday', '~',
  ['restaurant seating', 'restaurant capacity calculator'],
  [
      '{ name: "diningArea", label: "Dining Area (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 1500 }',
      '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "12", label: "Fast Casual (12 sqft/seat)" }, { value: "15", label: "Casual Dining (15 sqft/seat)" }, { value: "20", label: "Fine Dining (20 sqft/seat)" }], defaultValue: "15" }',
      '{ name: "barSeats", label: "Bar Seats", type: "number", min: 0, max: 50, defaultValue: 8 }',
      '{ name: "avgCheck", label: "Average Check ($)", type: "number", min: 5, max: 200, defaultValue: 25 }',
  ],
  `(inputs) => {
      const area = inputs.diningArea as number;
      const sqPerSeat = Number(inputs.serviceType as number);
      const bar = inputs.barSeats as number;
      const check = inputs.avgCheck as number;
      if (!area || !sqPerSeat) return null;
      const diningSeats = Math.floor(area / sqPerSeat);
      const totalSeats = diningSeats + bar;
      const turnsPerDay = sqPerSeat <= 12 ? 4 : sqPerSeat <= 15 ? 2.5 : 1.5;
      const dailyRevenue = Math.round(totalSeats * turnsPerDay * check);
      return {
        primary: { label: "Total Seating Capacity", value: formatNumber(totalSeats) + " seats" },
        details: [
          { label: "Dining Seats", value: formatNumber(diningSeats) },
          { label: "Estimated Daily Revenue", value: "$" + formatNumber(dailyRevenue) },
          { label: "Table Turns Per Day", value: formatNumber(turnsPerDay) },
        ],
      };
  }`,
  [{ q: 'How much space per restaurant seat?', a: 'Allow 12 to 15 square feet per seat for casual dining and 18 to 20 for fine dining.' },
   { q: 'What is a good table turn rate?', a: 'Casual restaurants average 2 to 3 turns per meal period.' }],
  'Seats = Floor Area / Sq Ft Per Seat + Bar Seats',
  []
);
add('bar-inventory-calculator', 'Bar Inventory Calculator',
  'Calculate the value of bar liquor inventory.',
  'Finance', 'finance', '$',
  ['bar inventory', 'liquor inventory calculator'],
  [
      '{ name: "wellBottles", label: "Well/House Bottles", type: "number", min: 0, max: 200, defaultValue: 20 }',
      '{ name: "wellCost", label: "Avg Well Bottle Cost ($)", type: "number", min: 5, max: 50, defaultValue: 15 }',
      '{ name: "premiumBottles", label: "Premium Bottles", type: "number", min: 0, max: 200, defaultValue: 30 }',
      '{ name: "premiumCost", label: "Avg Premium Bottle Cost ($)", type: "number", min: 15, max: 200, defaultValue: 35 }',
      '{ name: "beerKegs", label: "Beer Kegs", type: "number", min: 0, max: 50, defaultValue: 6 }',
      '{ name: "kegCost", label: "Avg Keg Cost ($)", type: "number", min: 50, max: 400, defaultValue: 150 }',
  ],
  `(inputs) => {
      const wb = inputs.wellBottles as number;
      const wc = inputs.wellCost as number;
      const pb = inputs.premiumBottles as number;
      const pc = inputs.premiumCost as number;
      const kegs = inputs.beerKegs as number;
      const kc = inputs.kegCost as number;
      const wellVal = wb * wc;
      const premVal = pb * pc;
      const kegVal = kegs * kc;
      const total = wellVal + premVal + kegVal;
      const pourCostTarget = Math.round(total * 4);
      return {
        primary: { label: "Total Inventory Value", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Well Liquor Value", value: "$" + formatNumber(Math.round(wellVal)) },
          { label: "Premium Liquor Value", value: "$" + formatNumber(Math.round(premVal)) },
          { label: "Beer Keg Value", value: "$" + formatNumber(Math.round(kegVal)) },
        ],
      };
  }`,
  [{ q: 'What is a good pour cost percentage?', a: 'A well-managed bar targets 18 to 24 percent pour cost for spirits.' },
   { q: 'How often should I count bar inventory?', a: 'Count inventory weekly for high-volume bars and biweekly for lower volume.' }],
  'Total = (Well x Cost) + (Premium x Cost) + (Kegs x Cost)',
  []
);
add('food-waste-cost-calculator', 'Food Waste Cost Calculator',
  'Estimate the cost of food waste in a restaurant.',
  'Finance', 'finance', '$',
  ['food waste cost', 'restaurant waste calculator'],
  [
      '{ name: "dailyCovers", label: "Daily Covers (Meals)", type: "number", min: 10, max: 2000, defaultValue: 150 }',
      '{ name: "avgFoodCost", label: "Avg Food Cost Per Meal ($)", type: "number", min: 2, max: 50, defaultValue: 8 }',
      '{ name: "wastePct", label: "Waste Percentage (%)", type: "number", min: 1, max: 30, defaultValue: 8 }',
      '{ name: "daysOpen", label: "Days Open Per Year", type: "number", min: 100, max: 365, defaultValue: 312 }',
  ],
  `(inputs) => {
      const covers = inputs.dailyCovers as number;
      const foodCost = inputs.avgFoodCost as number;
      const waste = inputs.wastePct as number;
      const days = inputs.daysOpen as number;
      if (!covers || !foodCost || !waste || !days) return null;
      const dailyFoodSpend = covers * foodCost;
      const dailyWaste = Math.round(dailyFoodSpend * (waste / 100) * 100) / 100;
      const annualWaste = Math.round(dailyWaste * days);
      const monthlyWaste = Math.round(annualWaste / 12);
      return {
        primary: { label: "Annual Waste Cost", value: "$" + formatNumber(annualWaste) },
        details: [
          { label: "Daily Waste Cost", value: "$" + formatNumber(dailyWaste) },
          { label: "Monthly Waste Cost", value: "$" + formatNumber(monthlyWaste) },
          { label: "Daily Food Spend", value: "$" + formatNumber(Math.round(dailyFoodSpend)) },
        ],
      };
  }`,
  [{ q: 'What is the average food waste percentage in restaurants?', a: 'Restaurants waste 4 to 10 percent of purchased food on average.' },
   { q: 'How can I reduce food waste?', a: 'Track waste daily, use FIFO rotation, adjust portion sizes, and cross-use ingredients.' }],
  'Annual Waste = Daily Covers x Food Cost x Waste% x Days',
  []
);
add(
  "pallet-load-calculator",
  "Pallet Load Calculator",
  "Calculate how many items fit on a pallet by dimensions.",
  "Everyday",
  "~",
  "Package",
  ["pallet", "load", "items", "dimensions", "stacking"],
  [
    '{ name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 }',
    '{ name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 }',
    '{ name: "palletHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 }',
    '{ name: "itemLength", label: "Item Length (in)", type: "number", min: 0.1, max: 120, defaultValue: 12 }',
    '{ name: "itemWidth", label: "Item Width (in)", type: "number", min: 0.1, max: 120, defaultValue: 10 }',
    '{ name: "itemHeight", label: "Item Height (in)", type: "number", min: 0.1, max: 120, defaultValue: 8 }'
  ],
  `(inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const palletHeight = inputs.palletHeight as number;
    const itemLength = inputs.itemLength as number;
    const itemWidth = inputs.itemWidth as number;
    const itemHeight = inputs.itemHeight as number;
    const itemsPerRow = Math.floor(palletLength / itemLength);
    const itemsPerCol = Math.floor(palletWidth / itemWidth);
    const layers = Math.floor(palletHeight / itemHeight);
    const perLayer = itemsPerRow * itemsPerCol;
    const totalItems = perLayer * layers;
    return {
      primary: { label: "Total Items on Pallet", value: formatNumber(totalItems) },
      details: [
        { label: "Items Per Layer", value: formatNumber(perLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Items Per Row", value: formatNumber(itemsPerRow) },
        { label: "Items Per Column", value: formatNumber(itemsPerCol) }
      ]
    };
  }`,
  [
    { q: "How do I calculate items per pallet?", a: "Divide pallet dimensions by item dimensions to find rows, columns, and layers." },
    { q: "What is a standard pallet size?", a: "The most common US pallet is 48 by 40 inches." }
  ],
  "Total Items = floor(PL / IL) x floor(PW / IW) x floor(PH / IH)",
  ["container-load-calculator", "palletizing-calculator", "cbm-calculator"]
);

add(
  "container-load-calculator",
  "Container Load Calculator",
  "Calculate how many boxes fit in a shipping container.",
  "Everyday",
  "~",
  "Package",
  ["container", "shipping", "boxes", "load", "cargo"],
  [
    '{ name: "containerLength", label: "Container Length (ft)", type: "number", min: 1, max: 60, defaultValue: 40 }',
    '{ name: "containerWidth", label: "Container Width (ft)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "containerHeight", label: "Container Height (ft)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "boxLength", label: "Box Length (ft)", type: "number", min: 0.1, max: 20, defaultValue: 2 }',
    '{ name: "boxWidth", label: "Box Width (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }',
    '{ name: "boxHeight", label: "Box Height (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const containerLength = inputs.containerLength as number;
    const containerWidth = inputs.containerWidth as number;
    const containerHeight = inputs.containerHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const containerVol = containerLength * containerWidth * containerHeight;
    const boxVol = boxLength * boxWidth * boxHeight;
    const lengthFit = Math.floor(containerLength / boxLength);
    const widthFit = Math.floor(containerWidth / boxWidth);
    const heightFit = Math.floor(containerHeight / boxHeight);
    const totalBoxes = lengthFit * widthFit * heightFit;
    const utilization = (totalBoxes * boxVol) / containerVol * 100;
    return {
      primary: { label: "Total Boxes", value: formatNumber(totalBoxes) },
      details: [
        { label: "Container Volume (cu ft)", value: formatNumber(containerVol) },
        { label: "Box Volume (cu ft)", value: formatNumber(boxVol) },
        { label: "Space Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  }`,
  [
    { q: "What are standard container sizes?", a: "Common sizes are 20-foot and 40-foot containers with 8-foot width and height." },
    { q: "How is container utilization calculated?", a: "Divide total box volume by container volume and multiply by 100." }
  ],
  "Total Boxes = floor(CL/BL) x floor(CW/BW) x floor(CH/BH)",
  ["pallet-load-calculator", "cbm-calculator", "container-weight-calculator"]
);

add(
  "freight-class-calculator",
  "Freight Class Calculator",
  "Determine freight density and NMFC class for shipping.",
  "Everyday",
  "~",
  "Truck",
  ["freight", "class", "density", "NMFC", "LTL"],
  [
    '{ name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 50000, defaultValue: 500 }',
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 600, defaultValue: 48 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 600, defaultValue: 40 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 600, defaultValue: 36 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const cubicFeet = (length * width * height) / 1728;
    const density = weight / cubicFeet;
    let freightClass = "500";
    if (density >= 50) freightClass = "50";
    else if (density >= 35) freightClass = "55";
    else if (density >= 30) freightClass = "60";
    else if (density >= 22.5) freightClass = "65";
    else if (density >= 15) freightClass = "70";
    else if (density >= 13.5) freightClass = "77.5";
    else if (density >= 12) freightClass = "85";
    else if (density >= 10.5) freightClass = "92.5";
    else if (density >= 9) freightClass = "100";
    else if (density >= 8) freightClass = "110";
    else if (density >= 7) freightClass = "125";
    else if (density >= 6) freightClass = "150";
    else if (density >= 5) freightClass = "175";
    else if (density >= 4) freightClass = "200";
    else if (density >= 3) freightClass = "250";
    else if (density >= 2) freightClass = "300";
    else if (density >= 1) freightClass = "400";
    return {
      primary: { label: "Freight Class", value: freightClass },
      details: [
        { label: "Density (lbs/cu ft)", value: formatNumber(density) },
        { label: "Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Weight (lbs)", value: formatNumber(weight) }
      ]
    };
  }`,
  [
    { q: "What is freight class?", a: "A classification system from 50 to 500 based on density, value, and handling." },
    { q: "How is freight density calculated?", a: "Divide the weight in pounds by the volume in cubic feet." }
  ],
  "Density = Weight / (L x W x H / 1728)",
  ["ltl-freight-cost-calculator", "dimensional-weight-calculator", "cbm-calculator"]
);

add(
  "dimensional-weight-calculator",
  "Dimensional Weight Calculator",
  "Calculate DIM weight for shipping packages.",
  "Everyday",
  "~",
  "Package",
  ["dimensional", "weight", "DIM", "shipping", "package"],
  [
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "actualWeight", label: "Actual Weight (lbs)", type: "number", min: 0.1, max: 5000, defaultValue: 25 }',
    '{ name: "dimFactor", label: "DIM Factor", type: "number", min: 100, max: 250, defaultValue: 139 }'
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const actualWeight = inputs.actualWeight as number;
    const dimFactor = inputs.dimFactor as number;
    const cubicInches = length * width * height;
    const dimWeight = cubicInches / dimFactor;
    const billableWeight = Math.max(actualWeight, dimWeight);
    const useDim = dimWeight > actualWeight;
    return {
      primary: { label: "Billable Weight (lbs)", value: formatNumber(billableWeight) },
      details: [
        { label: "Dimensional Weight (lbs)", value: formatNumber(dimWeight) },
        { label: "Actual Weight (lbs)", value: formatNumber(actualWeight) },
        { label: "Cubic Inches", value: formatNumber(cubicInches) },
        { label: "Billed By", value: useDim ? "DIM Weight" : "Actual Weight" }
      ]
    };
  }`,
  [
    { q: "What is dimensional weight?", a: "A pricing method based on package volume rather than actual weight." },
    { q: "What DIM factor should I use?", a: "UPS and FedEx typically use 139 for domestic shipments." }
  ],
  "DIM Weight = (L x W x H) / DIM Factor",
  ["freight-class-calculator", "container-load-calculator", "cbm-calculator"]
);

add(
  "ltl-freight-cost-calculator",
  "LTL Freight Cost Calculator",
  "Estimate less-than-truckload shipping costs.",
  "Finance",
  "$",
  "DollarSign",
  ["LTL", "freight", "cost", "shipping", "trucking"],
  [
    '{ name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 20000, defaultValue: 1000 }',
    '{ name: "distance", label: "Distance (miles)", type: "number", min: 1, max: 5000, defaultValue: 500 }',
    '{ name: "freightClass", label: "Freight Class", type: "number", min: 50, max: 500, defaultValue: 100 }',
    '{ name: "ratePerCwt", label: "Rate per CWT ($)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "fuelSurchargePercent", label: "Fuel Surcharge (%)", type: "number", min: 0, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const distance = inputs.distance as number;
    const freightClass = inputs.freightClass as number;
    const ratePerCwt = inputs.ratePerCwt as number;
    const fuelSurchargePercent = inputs.fuelSurchargePercent as number;
    const cwt = weight / 100;
    const baseCharge = cwt * ratePerCwt;
    const fuelSurcharge = baseCharge * (fuelSurchargePercent / 100);
    const totalCost = baseCharge + fuelSurcharge;
    const costPerPound = totalCost / weight;
    return {
      primary: { label: "Total LTL Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Base Charge", value: "$" + formatNumber(baseCharge) },
        { label: "Fuel Surcharge", value: "$" + formatNumber(fuelSurcharge) },
        { label: "Cost Per Pound", value: "$" + formatNumber(costPerPound) },
        { label: "CWT (Hundredweight)", value: formatNumber(cwt) }
      ]
    };
  }`,
  [
    { q: "What is LTL freight?", a: "Less-than-truckload shipping for loads that do not fill an entire trailer." },
    { q: "What is CWT?", a: "CWT stands for hundredweight and equals 100 pounds." }
  ],
  "Total = (Weight / 100) x Rate per CWT x (1 + Fuel Surcharge %)",
  ["freight-class-calculator", "fuel-surcharge-calculator", "deadhead-miles-calculator"]
);

add(
  "warehouse-space-calculator",
  "Warehouse Space Calculator",
  "Calculate the warehouse square footage needed for inventory.",
  "Everyday",
  "~",
  "Warehouse",
  ["warehouse", "space", "storage", "sqft", "inventory"],
  [
    '{ name: "palletCount", label: "Number of Pallets", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "palletSqft", label: "Pallet Footprint (sq ft)", type: "number", min: 1, max: 100, defaultValue: 13.33 }',
    '{ name: "stackHeight", label: "Stack Height (levels)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "aislePercent", label: "Aisle Space (%)", type: "number", min: 10, max: 60, defaultValue: 40 }'
  ],
  `(inputs) => {
    const palletCount = inputs.palletCount as number;
    const palletSqft = inputs.palletSqft as number;
    const stackHeight = inputs.stackHeight as number;
    const aislePercent = inputs.aislePercent as number;
    const storageFloorSqft = (palletCount / stackHeight) * palletSqft;
    const aisleSqft = storageFloorSqft * (aislePercent / 100);
    const totalSqft = storageFloorSqft + aisleSqft;
    return {
      primary: { label: "Total Warehouse Sq Ft Needed", value: formatNumber(totalSqft) },
      details: [
        { label: "Storage Floor Area (sq ft)", value: formatNumber(storageFloorSqft) },
        { label: "Aisle Area (sq ft)", value: formatNumber(aisleSqft) },
        { label: "Pallet Positions on Floor", value: formatNumber(palletCount / stackHeight) }
      ]
    };
  }`,
  [
    { q: "How much warehouse space do I need?", a: "Divide pallets by stack height, multiply by footprint, and add aisle space." },
    { q: "What percentage of warehouse is aisles?", a: "Typically 35 to 45 percent of total floor area is used for aisles." }
  ],
  "Total Sq Ft = (Pallets / Stack Height) x Footprint x (1 + Aisle %)",
  ["pallet-load-calculator", "pick-pack-time-calculator", "container-load-calculator"]
);

add(
  "pick-pack-time-calculator",
  "Pick and Pack Time Calculator",
  "Estimate order fulfillment pick and pack time.",
  "Everyday",
  "~",
  "Clock",
  ["pick", "pack", "fulfillment", "warehouse", "order"],
  [
    '{ name: "orderCount", label: "Number of Orders", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "itemsPerOrder", label: "Avg Items Per Order", type: "number", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "pickTimePerItem", label: "Pick Time Per Item (sec)", type: "number", min: 1, max: 300, defaultValue: 30 }',
    '{ name: "packTimePerOrder", label: "Pack Time Per Order (sec)", type: "number", min: 10, max: 600, defaultValue: 120 }',
    '{ name: "workers", label: "Number of Workers", type: "number", min: 1, max: 100, defaultValue: 5 }'
  ],
  `(inputs) => {
    const orderCount = inputs.orderCount as number;
    const itemsPerOrder = inputs.itemsPerOrder as number;
    const pickTimePerItem = inputs.pickTimePerItem as number;
    const packTimePerOrder = inputs.packTimePerOrder as number;
    const workers = inputs.workers as number;
    const totalItems = orderCount * itemsPerOrder;
    const totalPickSec = totalItems * pickTimePerItem;
    const totalPackSec = orderCount * packTimePerOrder;
    const totalSec = totalPickSec + totalPackSec;
    const totalHours = totalSec / 3600;
    const hoursPerWorker = totalHours / workers;
    return {
      primary: { label: "Total Fulfillment Time (hrs)", value: formatNumber(totalHours) },
      details: [
        { label: "Hours Per Worker", value: formatNumber(hoursPerWorker) },
        { label: "Total Pick Time (hrs)", value: formatNumber(totalPickSec / 3600) },
        { label: "Total Pack Time (hrs)", value: formatNumber(totalPackSec / 3600) },
        { label: "Total Items to Pick", value: formatNumber(totalItems) }
      ]
    };
  }`,
  [
    { q: "How do I estimate pick and pack time?", a: "Multiply items by pick time, add pack time per order, then divide by workers." },
    { q: "What is a good pick rate?", a: "A typical manual pick rate is 60 to 120 items per hour per worker." }
  ],
  "Total Time = (Items x Pick Time + Orders x Pack Time) / Workers",
  ["warehouse-space-calculator", "pallet-load-calculator", "conveyor-speed-calculator"]
);

add(
  "forklift-capacity-calculator",
  "Forklift Capacity Calculator",
  "Calculate forklift load capacity at a given load center.",
  "Science",
  "A",
  "Truck",
  ["forklift", "capacity", "load", "center", "lifting"],
  [
    '{ name: "ratedCapacity", label: "Rated Capacity (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 5000 }',
    '{ name: "ratedLoadCenter", label: "Rated Load Center (in)", type: "number", min: 12, max: 60, defaultValue: 24 }',
    '{ name: "actualLoadCenter", label: "Actual Load Center (in)", type: "number", min: 12, max: 120, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ratedCapacity = inputs.ratedCapacity as number;
    const ratedLoadCenter = inputs.ratedLoadCenter as number;
    const actualLoadCenter = inputs.actualLoadCenter as number;
    const actualCapacity = (ratedCapacity * ratedLoadCenter) / actualLoadCenter;
    const capacityLoss = ratedCapacity - actualCapacity;
    const percentOfRated = (actualCapacity / ratedCapacity) * 100;
    return {
      primary: { label: "Actual Capacity (lbs)", value: formatNumber(actualCapacity) },
      details: [
        { label: "Rated Capacity (lbs)", value: formatNumber(ratedCapacity) },
        { label: "Capacity Reduction (lbs)", value: formatNumber(capacityLoss) },
        { label: "Percent of Rated", value: formatNumber(percentOfRated) + "%" }
      ]
    };
  }`,
  [
    { q: "What is load center on a forklift?", a: "The horizontal distance from the fork face to the center of gravity of the load." },
    { q: "How does load center affect capacity?", a: "As load center increases, the effective lifting capacity decreases." }
  ],
  "Actual Capacity = Rated Capacity x Rated Center / Actual Center",
  ["pallet-load-calculator", "trailer-tongue-weight-calculator", "towing-capacity-calculator"]
);

add(
  "conveyor-speed-calculator",
  "Conveyor Speed Calculator",
  "Calculate conveyor belt throughput and speed.",
  "Science",
  "A",
  "Activity",
  ["conveyor", "belt", "speed", "throughput", "material"],
  [
    '{ name: "beltSpeed", label: "Belt Speed (ft/min)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "beltWidth", label: "Belt Width (in)", type: "number", min: 6, max: 96, defaultValue: 24 }',
    '{ name: "materialDepth", label: "Material Depth (in)", type: "number", min: 0.5, max: 24, defaultValue: 3 }',
    '{ name: "materialDensity", label: "Material Density (lbs/cu ft)", type: "number", min: 1, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const beltSpeed = inputs.beltSpeed as number;
    const beltWidth = inputs.beltWidth as number;
    const materialDepth = inputs.materialDepth as number;
    const materialDensity = inputs.materialDensity as number;
    const crossSectionSqFt = (beltWidth / 12) * (materialDepth / 12);
    const volumePerMin = crossSectionSqFt * beltSpeed;
    const volumePerHour = volumePerMin * 60;
    const tonsPerHour = (volumePerHour * materialDensity) / 2000;
    return {
      primary: { label: "Throughput (tons/hr)", value: formatNumber(tonsPerHour) },
      details: [
        { label: "Volume Per Minute (cu ft)", value: formatNumber(volumePerMin) },
        { label: "Volume Per Hour (cu ft)", value: formatNumber(volumePerHour) },
        { label: "Cross Section (sq ft)", value: formatNumber(crossSectionSqFt) }
      ]
    };
  }`,
  [
    { q: "How is conveyor throughput calculated?", a: "Multiply cross-sectional area by belt speed and material density." },
    { q: "What is a typical conveyor belt speed?", a: "Common speeds range from 50 to 400 feet per minute depending on the application." }
  ],
  "Tons/hr = Belt Width x Depth x Speed x Density / 2000",
  ["pick-pack-time-calculator", "warehouse-space-calculator", "forklift-capacity-calculator"]
);

add(
  "fleet-fuel-cost-calculator",
  "Fleet Fuel Cost Calculator",
  "Calculate total fuel cost for a vehicle fleet.",
  "Finance",
  "$",
  "DollarSign",
  ["fleet", "fuel", "cost", "vehicles", "mileage"],
  [
    '{ name: "vehicleCount", label: "Number of Vehicles", type: "number", min: 1, max: 10000, defaultValue: 20 }',
    '{ name: "milesPerVehicle", label: "Miles Per Vehicle/Month", type: "number", min: 100, max: 50000, defaultValue: 5000 }',
    '{ name: "mpg", label: "Average MPG", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gal)", type: "number", min: 0.5, max: 15, defaultValue: 3.75 }'
  ],
  `(inputs) => {
    const vehicleCount = inputs.vehicleCount as number;
    const milesPerVehicle = inputs.milesPerVehicle as number;
    const mpg = inputs.mpg as number;
    const fuelPrice = inputs.fuelPrice as number;
    const totalMiles = vehicleCount * milesPerVehicle;
    const totalGallons = totalMiles / mpg;
    const totalCost = totalGallons * fuelPrice;
    const costPerVehicle = totalCost / vehicleCount;
    const costPerMile = totalCost / totalMiles;
    return {
      primary: { label: "Total Monthly Fuel Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Vehicle", value: "$" + formatNumber(costPerVehicle) },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Total Gallons", value: formatNumber(totalGallons) },
        { label: "Total Fleet Miles", value: formatNumber(totalMiles) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fleet fuel cost?", a: "Multiply total miles by fuel price and divide by average miles per gallon." },
    { q: "What is a good MPG for trucks?", a: "Class 8 trucks average 5 to 8 MPG while delivery vans get 10 to 15 MPG." }
  ],
  "Total Cost = (Vehicles x Miles / MPG) x Fuel Price",
  ["fuel-surcharge-calculator", "deadhead-miles-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "vehicle-depreciation-schedule-calculator",
  "Vehicle Depreciation Schedule Calculator",
  "Calculate fleet vehicle depreciation over time.",
  "Finance",
  "$",
  "TrendingDown",
  ["vehicle", "depreciation", "fleet", "asset", "schedule"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 1000, max: 500000, defaultValue: 80000 }',
    '{ name: "salvageValue", label: "Salvage Value ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 }',
    '{ name: "usefulLifeYears", label: "Useful Life (years)", type: "number", min: 1, max: 30, defaultValue: 7 }',
    '{ name: "currentYear", label: "Current Year Number", type: "number", min: 1, max: 30, defaultValue: 1 }'
  ],
  `(inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const salvageValue = inputs.salvageValue as number;
    const usefulLifeYears = inputs.usefulLifeYears as number;
    const currentYear = inputs.currentYear as number;
    const depreciableAmount = purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLifeYears;
    const accumulatedDep = Math.min(annualDepreciation * currentYear, depreciableAmount);
    const bookValue = purchasePrice - accumulatedDep;
    return {
      primary: { label: "Current Book Value", value: "$" + formatNumber(bookValue) },
      details: [
        { label: "Annual Depreciation", value: "$" + formatNumber(annualDepreciation) },
        { label: "Accumulated Depreciation", value: "$" + formatNumber(accumulatedDep) },
        { label: "Depreciable Amount", value: "$" + formatNumber(depreciableAmount) }
      ]
    };
  }`,
  [
    { q: "How is straight-line depreciation calculated?", a: "Subtract salvage value from cost and divide by the useful life in years." },
    { q: "What is useful life for a fleet truck?", a: "Fleet trucks are commonly depreciated over 5 to 10 years." }
  ],
  "Annual Depreciation = (Purchase Price - Salvage Value) / Useful Life",
  ["fleet-fuel-cost-calculator", "brake-pad-life-calculator", "tire-rotation-schedule-calculator"]
);

add(
  "tire-rotation-schedule-calculator",
  "Tire Rotation Schedule Calculator",
  "Calculate when your next tire rotation is due.",
  "Everyday",
  "~",
  "RefreshCw",
  ["tire", "rotation", "schedule", "mileage", "maintenance"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 35000 }',
    '{ name: "lastRotationMileage", label: "Last Rotation Mileage", type: "number", min: 0, max: 1000000, defaultValue: 30000 }',
    '{ name: "rotationInterval", label: "Rotation Interval (miles)", type: "number", min: 3000, max: 15000, defaultValue: 7500 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 }'
  ],
  `(inputs) => {
    const currentMileage = inputs.currentMileage as number;
    const lastRotationMileage = inputs.lastRotationMileage as number;
    const rotationInterval = inputs.rotationInterval as number;
    const monthlyMiles = inputs.monthlyMiles as number;
    const milesSinceLast = currentMileage - lastRotationMileage;
    const milesUntilNext = rotationInterval - milesSinceLast;
    const nextRotationMileage = lastRotationMileage + rotationInterval;
    const monthsUntilDue = milesUntilNext > 0 ? milesUntilNext / monthlyMiles : 0;
    return {
      primary: { label: "Next Rotation At", value: formatNumber(nextRotationMileage) + " mi" },
      details: [
        { label: "Miles Since Last Rotation", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilNext, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Status", value: milesUntilNext <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should I rotate tires?", a: "Most manufacturers recommend every 5000 to 7500 miles." },
    { q: "Why is tire rotation important?", a: "It promotes even tread wear and extends the life of your tires." }
  ],
  "Next Rotation = Last Rotation Mileage + Rotation Interval",
  ["oil-change-interval-calculator", "brake-pad-life-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "oil-change-interval-calculator",
  "Oil Change Interval Calculator",
  "Calculate when your next oil change is due.",
  "Everyday",
  "~",
  "Droplet",
  ["oil", "change", "interval", "maintenance", "engine"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 48000 }',
    '{ name: "lastChangeMileage", label: "Last Oil Change Mileage", type: "number", min: 0, max: 1000000, defaultValue: 43000 }',
    '{ name: "changeInterval", label: "Change Interval (miles)", type: "number", min: 1000, max: 20000, defaultValue: 5000 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1000 }',
    '{ name: "oilCost", label: "Oil Change Cost ($)", type: "number", min: 10, max: 500, defaultValue: 65 }'
  ],
  `(inputs) => {
    const currentMileage = inputs.currentMileage as number;
    const lastChangeMileage = inputs.lastChangeMileage as number;
    const changeInterval = inputs.changeInterval as number;
    const monthlyMiles = inputs.monthlyMiles as number;
    const oilCost = inputs.oilCost as number;
    const milesSinceLast = currentMileage - lastChangeMileage;
    const milesUntilNext = changeInterval - milesSinceLast;
    const nextChangeMileage = lastChangeMileage + changeInterval;
    const monthsUntilDue = milesUntilNext > 0 ? milesUntilNext / monthlyMiles : 0;
    const changesPerYear = (monthlyMiles * 12) / changeInterval;
    const annualCost = changesPerYear * oilCost;
    return {
      primary: { label: "Next Oil Change At", value: formatNumber(nextChangeMileage) + " mi" },
      details: [
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilNext, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Changes Per Year", value: formatNumber(changesPerYear) },
        { label: "Annual Oil Change Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How often should I change my oil?", a: "Most modern vehicles need an oil change every 5000 to 7500 miles." },
    { q: "Does synthetic oil last longer?", a: "Yes, full synthetic oil can often go 7500 to 15000 miles between changes." }
  ],
  "Next Change = Last Change Mileage + Change Interval",
  ["tire-rotation-schedule-calculator", "brake-pad-life-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "brake-pad-life-calculator",
  "Brake Pad Life Calculator",
  "Estimate when brake pads need replacement.",
  "Everyday",
  "~",
  "AlertCircle",
  ["brake", "pad", "life", "replacement", "wear"],
  [
    '{ name: "currentThickness", label: "Current Thickness (mm)", type: "number", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "newThickness", label: "New Pad Thickness (mm)", type: "number", min: 8, max: 15, defaultValue: 12 }',
    '{ name: "minThickness", label: "Min Safe Thickness (mm)", type: "number", min: 1, max: 5, defaultValue: 3 }',
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 45000 }',
    '{ name: "installMileage", label: "Install Mileage", type: "number", min: 0, max: 1000000, defaultValue: 30000 }'
  ],
  `(inputs) => {
    const currentThickness = inputs.currentThickness as number;
    const newThickness = inputs.newThickness as number;
    const minThickness = inputs.minThickness as number;
    const currentMileage = inputs.currentMileage as number;
    const installMileage = inputs.installMileage as number;
    const milesDriven = currentMileage - installMileage;
    const wornMm = newThickness - currentThickness;
    const wearRatePerMile = wornMm / milesDriven;
    const remainingMm = currentThickness - minThickness;
    const milesRemaining = remainingMm / wearRatePerMile;
    const replacementMileage = currentMileage + milesRemaining;
    const percentWorn = (wornMm / (newThickness - minThickness)) * 100;
    return {
      primary: { label: "Replace At Mileage", value: formatNumber(replacementMileage) + " mi" },
      details: [
        { label: "Miles Remaining", value: formatNumber(milesRemaining) },
        { label: "Percent Worn", value: formatNumber(percentWorn) + "%" },
        { label: "Remaining Thickness (mm)", value: formatNumber(remainingMm) },
        { label: "Wear Rate (mm/1000 mi)", value: formatNumber(wearRatePerMile * 1000) }
      ]
    };
  }`,
  [
    { q: "When should brake pads be replaced?", a: "Replace them when thickness reaches 3 mm or less." },
    { q: "How long do brake pads last?", a: "Brake pads typically last 25000 to 70000 miles depending on driving habits." }
  ],
  "Miles Remaining = (Current - Min Thickness) / Wear Rate Per Mile",
  ["tire-rotation-schedule-calculator", "oil-change-interval-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "trailer-tongue-weight-calculator",
  "Trailer Tongue Weight Calculator",
  "Calculate tongue weight for safe towing.",
  "Science",
  "A",
  "Scale",
  ["tongue", "weight", "trailer", "towing", "hitch"],
  [
    '{ name: "trailerWeight", label: "Loaded Trailer Weight (lbs)", type: "number", min: 100, max: 50000, defaultValue: 5000 }',
    '{ name: "tonguePercent", label: "Target Tongue Weight (%)", type: "number", min: 5, max: 25, defaultValue: 12 }',
    '{ name: "hitchRating", label: "Hitch Rating (lbs)", type: "number", min: 100, max: 20000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const trailerWeight = inputs.trailerWeight as number;
    const tonguePercent = inputs.tonguePercent as number;
    const hitchRating = inputs.hitchRating as number;
    const tongueWeight = trailerWeight * (tonguePercent / 100);
    const isSafe = tongueWeight <= hitchRating;
    const margin = hitchRating - tongueWeight;
    const actualPercent = (tongueWeight / trailerWeight) * 100;
    return {
      primary: { label: "Tongue Weight (lbs)", value: formatNumber(tongueWeight) },
      details: [
        { label: "Tongue Weight Percent", value: formatNumber(actualPercent) + "%" },
        { label: "Hitch Rating (lbs)", value: formatNumber(hitchRating) },
        { label: "Safety Margin (lbs)", value: formatNumber(margin) },
        { label: "Status", value: isSafe ? "Within Rating" : "Exceeds Hitch Rating" }
      ]
    };
  }`,
  [
    { q: "What is the ideal tongue weight?", a: "Tongue weight should be 10 to 15 percent of total loaded trailer weight." },
    { q: "What happens with too little tongue weight?", a: "Too little tongue weight can cause trailer sway and loss of control." }
  ],
  "Tongue Weight = Trailer Weight x Tongue Weight Percentage",
  ["towing-capacity-calculator", "forklift-capacity-calculator", "container-weight-calculator"]
);

add(
  "towing-capacity-calculator",
  "Towing Capacity Calculator",
  "Check if your vehicle can safely tow a load.",
  "Everyday",
  "~",
  "Truck",
  ["towing", "capacity", "vehicle", "trailer", "weight"],
  [
    '{ name: "gcwr", label: "GCWR (lbs)", type: "number", min: 5000, max: 50000, defaultValue: 15000 }',
    '{ name: "curbWeight", label: "Vehicle Curb Weight (lbs)", type: "number", min: 2000, max: 15000, defaultValue: 5500 }',
    '{ name: "passengers", label: "Passenger Weight (lbs)", type: "number", min: 0, max: 2000, defaultValue: 350 }',
    '{ name: "cargo", label: "Cargo in Vehicle (lbs)", type: "number", min: 0, max: 5000, defaultValue: 200 }',
    '{ name: "trailerWeight", label: "Loaded Trailer Weight (lbs)", type: "number", min: 100, max: 40000, defaultValue: 6000 }'
  ],
  `(inputs) => {
    const gcwr = inputs.gcwr as number;
    const curbWeight = inputs.curbWeight as number;
    const passengers = inputs.passengers as number;
    const cargo = inputs.cargo as number;
    const trailerWeight = inputs.trailerWeight as number;
    const vehicleLoaded = curbWeight + passengers + cargo;
    const totalCombined = vehicleLoaded + trailerWeight;
    const maxTowCapacity = gcwr - vehicleLoaded;
    const remaining = gcwr - totalCombined;
    const isSafe = remaining >= 0;
    return {
      primary: { label: "Max Tow Capacity (lbs)", value: formatNumber(maxTowCapacity) },
      details: [
        { label: "Total Combined Weight (lbs)", value: formatNumber(totalCombined) },
        { label: "GCWR (lbs)", value: formatNumber(gcwr) },
        { label: "Remaining Capacity (lbs)", value: formatNumber(remaining) },
        { label: "Status", value: isSafe ? "Safe to Tow" : "Exceeds GCWR" }
      ]
    };
  }`,
  [
    { q: "What is GCWR?", a: "Gross Combined Weight Rating is the max total weight of vehicle, cargo, and trailer." },
    { q: "How do I find my towing capacity?", a: "Subtract your loaded vehicle weight from the GCWR listed by the manufacturer." }
  ],
  "Max Tow Capacity = GCWR - (Curb Weight + Passengers + Cargo)",
  ["trailer-tongue-weight-calculator", "container-weight-calculator", "forklift-capacity-calculator"]
);

add(
  "fuel-surcharge-calculator",
  "Fuel Surcharge Calculator",
  "Calculate the fuel surcharge percentage for freight.",
  "Finance",
  "$",
  "DollarSign",
  ["fuel", "surcharge", "freight", "shipping", "diesel"],
  [
    '{ name: "currentFuelPrice", label: "Current Fuel Price ($/gal)", type: "number", min: 1, max: 15, defaultValue: 4.25 }',
    '{ name: "baseFuelPrice", label: "Base Fuel Price ($/gal)", type: "number", min: 1, max: 10, defaultValue: 1.25 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 1, max: 50, defaultValue: 6 }',
    '{ name: "lineHaul", label: "Line Haul Charge ($)", type: "number", min: 100, max: 100000, defaultValue: 2500 }'
  ],
  `(inputs) => {
    const currentFuelPrice = inputs.currentFuelPrice as number;
    const baseFuelPrice = inputs.baseFuelPrice as number;
    const mpg = inputs.mpg as number;
    const lineHaul = inputs.lineHaul as number;
    const priceDiff = currentFuelPrice - baseFuelPrice;
    const surchargePercent = (priceDiff / mpg) / (baseFuelPrice / mpg) * 100;
    const surchargeAmount = lineHaul * (surchargePercent / 100);
    const totalCharge = lineHaul + surchargeAmount;
    return {
      primary: { label: "Fuel Surcharge", value: formatNumber(surchargePercent) + "%" },
      details: [
        { label: "Surcharge Amount", value: "$" + formatNumber(surchargeAmount) },
        { label: "Total with Surcharge", value: "$" + formatNumber(totalCharge) },
        { label: "Fuel Price Difference", value: "$" + formatNumber(priceDiff) },
        { label: "Line Haul Charge", value: "$" + formatNumber(lineHaul) }
      ]
    };
  }`,
  [
    { q: "How is fuel surcharge calculated?", a: "It is based on the difference between current and base fuel prices." },
    { q: "What is the base fuel price?", a: "A threshold price set by the carrier below which no surcharge applies." }
  ],
  "Surcharge % = ((Current - Base Fuel Price) / Base Price) x 100",
  ["fleet-fuel-cost-calculator", "ltl-freight-cost-calculator", "deadhead-miles-calculator"]
);

add(
  "deadhead-miles-calculator",
  "Deadhead Miles Calculator",
  "Calculate the cost of empty return miles.",
  "Finance",
  "$",
  "DollarSign",
  ["deadhead", "empty", "miles", "trucking", "cost"],
  [
    '{ name: "totalMiles", label: "Total Trip Miles", type: "number", min: 1, max: 10000, defaultValue: 800 }',
    '{ name: "loadedMiles", label: "Loaded Miles", type: "number", min: 0, max: 10000, defaultValue: 600 }',
    '{ name: "costPerMile", label: "Operating Cost Per Mile ($)", type: "number", min: 0.5, max: 10, defaultValue: 1.85 }',
    '{ name: "revenuePerLoadedMile", label: "Revenue Per Loaded Mile ($)", type: "number", min: 0.5, max: 20, defaultValue: 3.00 }'
  ],
  `(inputs) => {
    const totalMiles = inputs.totalMiles as number;
    const loadedMiles = inputs.loadedMiles as number;
    const costPerMile = inputs.costPerMile as number;
    const revenuePerLoadedMile = inputs.revenuePerLoadedMile as number;
    const deadheadMiles = totalMiles - loadedMiles;
    const deadheadPercent = (deadheadMiles / totalMiles) * 100;
    const deadheadCost = deadheadMiles * costPerMile;
    const revenue = loadedMiles * revenuePerLoadedMile;
    const totalOperatingCost = totalMiles * costPerMile;
    const netProfit = revenue - totalOperatingCost;
    return {
      primary: { label: "Deadhead Cost", value: "$" + formatNumber(deadheadCost) },
      details: [
        { label: "Deadhead Miles", value: formatNumber(deadheadMiles) },
        { label: "Deadhead Percentage", value: formatNumber(deadheadPercent) + "%" },
        { label: "Trip Revenue", value: "$" + formatNumber(revenue) },
        { label: "Net Profit", value: "$" + formatNumber(netProfit) }
      ]
    };
  }`,
  [
    { q: "What are deadhead miles?", a: "Miles driven without any cargo, generating no revenue for the carrier." },
    { q: "What is a good deadhead percentage?", a: "Most carriers aim to keep deadhead miles below 15 percent of total." }
  ],
  "Deadhead Cost = (Total Miles - Loaded Miles) x Cost Per Mile",
  ["fleet-fuel-cost-calculator", "fuel-surcharge-calculator", "driver-pay-calculator"]
);

add(
  "driver-pay-calculator",
  "Driver Pay Calculator",
  "Estimate truck driver pay for a trip or period.",
  "Finance",
  "$",
  "DollarSign",
  ["driver", "pay", "trucking", "salary", "wages"],
  [
    '{ name: "payType", label: "Pay Type", type: "select", options: [{ value: "mile", label: "Per Mile" }, { value: "hour", label: "Per Hour" }, { value: "percent", label: "Percent of Load" }] }',
    '{ name: "rate", label: "Rate ($/mi, $/hr, or %)", type: "number", min: 0.1, max: 100, defaultValue: 0.55 }',
    '{ name: "miles", label: "Total Miles", type: "number", min: 0, max: 20000, defaultValue: 2500 }',
    '{ name: "hours", label: "Total Hours", type: "number", min: 0, max: 500, defaultValue: 50 }',
    '{ name: "loadRevenue", label: "Load Revenue ($)", type: "number", min: 0, max: 100000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const payType = inputs.payType as string;
    const rate = inputs.rate as number;
    const miles = inputs.miles as number;
    const hours = inputs.hours as number;
    const loadRevenue = inputs.loadRevenue as number;
    let grossPay = 0;
    if (payType === "mile") {
      grossPay = rate * miles;
    } else if (payType === "hour") {
      grossPay = rate * hours;
    } else {
      grossPay = loadRevenue * (rate / 100);
    }
    const effectivePerMile = miles > 0 ? grossPay / miles : 0;
    const effectivePerHour = hours > 0 ? grossPay / hours : 0;
    return {
      primary: { label: "Gross Pay", value: "$" + formatNumber(grossPay) },
      details: [
        { label: "Pay Type", value: payType === "mile" ? "Per Mile" : payType === "hour" ? "Per Hour" : "Percent of Load" },
        { label: "Effective $/Mile", value: "$" + formatNumber(effectivePerMile) },
        { label: "Effective $/Hour", value: "$" + formatNumber(effectivePerHour) },
        { label: "Total Miles", value: formatNumber(miles) }
      ]
    };
  }`,
  [
    { q: "How are truck drivers paid?", a: "Common methods include per mile, per hour, or a percentage of load revenue." },
    { q: "What is average truck driver pay per mile?", a: "Company drivers typically earn 0.45 to 0.65 per mile." }
  ],
  "Gross Pay = Rate x Miles (or Hours or % of Revenue)",
  ["deadhead-miles-calculator", "eld-hours-calculator", "fleet-fuel-cost-calculator"]
);

add(
  "eld-hours-calculator",
  "ELD Hours of Service Calculator",
  "Calculate remaining ELD hours of service.",
  "Everyday",
  "~",
  "Clock",
  ["ELD", "hours", "service", "driving", "HOS"],
  [
    '{ name: "drivingUsed", label: "Driving Hours Used Today", type: "number", min: 0, max: 11, defaultValue: 6 }',
    '{ name: "onDutyUsed", label: "On-Duty Hours Used Today", type: "number", min: 0, max: 14, defaultValue: 8 }',
    '{ name: "cycleUsed", label: "70-Hr Cycle Hours Used", type: "number", min: 0, max: 70, defaultValue: 45 }',
    '{ name: "avgSpeed", label: "Average Speed (mph)", type: "number", min: 10, max: 80, defaultValue: 55 }'
  ],
  `(inputs) => {
    const drivingUsed = inputs.drivingUsed as number;
    const onDutyUsed = inputs.onDutyUsed as number;
    const cycleUsed = inputs.cycleUsed as number;
    const avgSpeed = inputs.avgSpeed as number;
    const drivingRemain = 11 - drivingUsed;
    const onDutyRemain = 14 - onDutyUsed;
    const cycleRemain = 70 - cycleUsed;
    const effectiveRemain = Math.min(drivingRemain, onDutyRemain, cycleRemain);
    const milesRemaining = effectiveRemain * avgSpeed;
    return {
      primary: { label: "Effective Hours Remaining", value: formatNumber(effectiveRemain) + " hrs" },
      details: [
        { label: "Driving Hours Left (11-hr)", value: formatNumber(drivingRemain) },
        { label: "On-Duty Hours Left (14-hr)", value: formatNumber(onDutyRemain) },
        { label: "Cycle Hours Left (70-hr)", value: formatNumber(cycleRemain) },
        { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) }
      ]
    };
  }`,
  [
    { q: "What are ELD hours of service rules?", a: "Drivers may drive 11 hours within a 14-hour on-duty window after 10 hours off." },
    { q: "What is the 70-hour rule?", a: "Drivers cannot exceed 70 hours of on-duty time in 8 consecutive days." }
  ],
  "Effective Remaining = min(11 - Driving, 14 - OnDuty, 70 - Cycle)",
  ["driver-pay-calculator", "deadhead-miles-calculator", "fleet-fuel-cost-calculator"]
);

add(
  "customs-duty-calculator",
  "Customs Duty Calculator",
  "Estimate import customs duty for goods.",
  "Finance",
  "$",
  "DollarSign",
  ["customs", "duty", "import", "tariff", "trade"],
  [
    '{ name: "goodsValue", label: "Value of Goods ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "dutyRate", label: "Duty Rate (%)", type: "number", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "freightCost", label: "Freight Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 1500 }',
    '{ name: "insuranceCost", label: "Insurance Cost ($)", type: "number", min: 0, max: 100000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const goodsValue = inputs.goodsValue as number;
    const dutyRate = inputs.dutyRate as number;
    const freightCost = inputs.freightCost as number;
    const insuranceCost = inputs.insuranceCost as number;
    const cifValue = goodsValue + freightCost + insuranceCost;
    const dutyAmount = cifValue * (dutyRate / 100);
    const totalLandedCost = cifValue + dutyAmount;
    const effectiveDutyPercent = (dutyAmount / goodsValue) * 100;
    return {
      primary: { label: "Customs Duty", value: "$" + formatNumber(dutyAmount) },
      details: [
        { label: "CIF Value", value: "$" + formatNumber(cifValue) },
        { label: "Total After Duty", value: "$" + formatNumber(totalLandedCost) },
        { label: "Effective Duty on Goods", value: formatNumber(effectiveDutyPercent) + "%" },
        { label: "Duty Rate Applied", value: formatNumber(dutyRate) + "%" }
      ]
    };
  }`,
  [
    { q: "What is CIF value?", a: "CIF stands for Cost, Insurance, and Freight and is used as the duty basis." },
    { q: "How do I find the duty rate?", a: "Look up the Harmonized Tariff Schedule for your product classification." }
  ],
  "Duty = (Goods Value + Freight + Insurance) x Duty Rate",
  ["landed-cost-calculator", "cbm-calculator", "container-weight-calculator"]
);

add(
  "landed-cost-calculator",
  "Landed Cost Calculator",
  "Calculate total landed cost of imported goods.",
  "Finance",
  "$",
  "DollarSign",
  ["landed", "cost", "import", "shipping", "total"],
  [
    '{ name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "shippingCost", label: "Shipping Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 2000 }',
    '{ name: "insurance", label: "Insurance ($)", type: "number", min: 0, max: 100000, defaultValue: 300 }',
    '{ name: "customsDuty", label: "Customs Duty ($)", type: "number", min: 0, max: 1000000, defaultValue: 500 }',
    '{ name: "handlingFees", label: "Handling Fees ($)", type: "number", min: 0, max: 50000, defaultValue: 250 }',
    '{ name: "units", label: "Total Units", type: "number", min: 1, max: 1000000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const productCost = inputs.productCost as number;
    const shippingCost = inputs.shippingCost as number;
    const insurance = inputs.insurance as number;
    const customsDuty = inputs.customsDuty as number;
    const handlingFees = inputs.handlingFees as number;
    const units = inputs.units as number;
    const totalLanded = productCost + shippingCost + insurance + customsDuty + handlingFees;
    const costPerUnit = totalLanded / units;
    const addonCosts = shippingCost + insurance + customsDuty + handlingFees;
    const addonPercent = (addonCosts / productCost) * 100;
    return {
      primary: { label: "Total Landed Cost", value: "$" + formatNumber(totalLanded) },
      details: [
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Add-On Costs", value: "$" + formatNumber(addonCosts) },
        { label: "Add-On Percentage", value: formatNumber(addonPercent) + "%" },
        { label: "Product Cost", value: "$" + formatNumber(productCost) }
      ]
    };
  }`,
  [
    { q: "What is landed cost?", a: "The total cost of a product including purchase, shipping, duty, and fees." },
    { q: "Why is landed cost important?", a: "It gives the true cost of imported goods for accurate pricing and margins." }
  ],
  "Landed Cost = Product + Shipping + Insurance + Duty + Handling",
  ["customs-duty-calculator", "cbm-calculator", "ltl-freight-cost-calculator"]
);

add(
  "cbm-calculator",
  "CBM Calculator",
  "Calculate cubic meters for a shipment.",
  "Conversion",
  "R",
  "Box",
  ["CBM", "cubic", "meters", "shipment", "volume"],
  [
    '{ name: "length", label: "Length (cm)", type: "number", min: 1, max: 10000, defaultValue: 120 }',
    '{ name: "width", label: "Width (cm)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "height", label: "Height (cm)", type: "number", min: 1, max: 10000, defaultValue: 60 }',
    '{ name: "quantity", label: "Number of Packages", type: "number", min: 1, max: 100000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const quantity = inputs.quantity as number;
    const cbmPerUnit = (length * width * height) / 1000000;
    const totalCbm = cbmPerUnit * quantity;
    const cubicFeet = totalCbm * 35.3147;
    return {
      primary: { label: "Total CBM", value: formatNumber(totalCbm) + " m3" },
      details: [
        { label: "CBM Per Package", value: formatNumber(cbmPerUnit) },
        { label: "Total Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Number of Packages", value: formatNumber(quantity) }
      ]
    };
  }`,
  [
    { q: "What is CBM?", a: "CBM stands for cubic meter, the standard volume unit for international shipping." },
    { q: "How is CBM calculated?", a: "Multiply length by width by height in centimeters and divide by 1000000." }
  ],
  "CBM = (Length x Width x Height in cm) / 1,000,000",
  ["container-load-calculator", "dimensional-weight-calculator", "container-weight-calculator"]
);

add(
  "container-weight-calculator",
  "Container Weight Calculator",
  "Calculate shipping container gross weight.",
  "Everyday",
  "~",
  "Package",
  ["container", "weight", "gross", "tare", "shipping"],
  [
    '{ name: "tareWeight", label: "Container Tare Weight (lbs)", type: "number", min: 1000, max: 20000, defaultValue: 5070 }',
    '{ name: "cargoWeight", label: "Cargo Weight (lbs)", type: "number", min: 0, max: 100000, defaultValue: 35000 }',
    '{ name: "maxGross", label: "Max Gross Weight (lbs)", type: "number", min: 10000, max: 100000, defaultValue: 67200 }',
    '{ name: "palletCount", label: "Number of Pallets", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "palletWeight", label: "Pallet Weight Each (lbs)", type: "number", min: 0, max: 100, defaultValue: 40 }'
  ],
  `(inputs) => {
    const tareWeight = inputs.tareWeight as number;
    const cargoWeight = inputs.cargoWeight as number;
    const maxGross = inputs.maxGross as number;
    const palletCount = inputs.palletCount as number;
    const palletWeight = inputs.palletWeight as number;
    const totalPalletWeight = palletCount * palletWeight;
    const grossWeight = tareWeight + cargoWeight + totalPalletWeight;
    const remainingCapacity = maxGross - grossWeight;
    const utilization = (grossWeight / maxGross) * 100;
    return {
      primary: { label: "Gross Weight (lbs)", value: formatNumber(grossWeight) },
      details: [
        { label: "Cargo Weight (lbs)", value: formatNumber(cargoWeight) },
        { label: "Pallet Weight Total (lbs)", value: formatNumber(totalPalletWeight) },
        { label: "Remaining Capacity (lbs)", value: formatNumber(remainingCapacity) },
        { label: "Weight Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  }`,
  [
    { q: "What is tare weight?", a: "The weight of the empty container before any cargo is loaded." },
    { q: "What is the max weight for a 40-foot container?", a: "A standard 40-foot container has a max gross weight of about 67200 lbs." }
  ],
  "Gross Weight = Tare Weight + Cargo Weight + Pallet Weight",
  ["container-load-calculator", "cbm-calculator", "pallet-load-calculator"]
);

add(
  "palletizing-calculator",
  "Palletizing Calculator",
  "Calculate optimal pallet stacking layers and arrangement.",
  "Math",
  "+",
  "Layers",
  ["palletizing", "stacking", "layers", "arrangement", "boxes"],
  [
    '{ name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 }',
    '{ name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 }',
    '{ name: "maxHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 }',
    '{ name: "boxLength", label: "Box Length (in)", type: "number", min: 0.5, max: 60, defaultValue: 16 }',
    '{ name: "boxWidth", label: "Box Width (in)", type: "number", min: 0.5, max: 60, defaultValue: 12 }',
    '{ name: "boxHeight", label: "Box Height (in)", type: "number", min: 0.5, max: 60, defaultValue: 10 }',
    '{ name: "boxWeight", label: "Box Weight (lbs)", type: "number", min: 0.1, max: 500, defaultValue: 25 }'
  ],
  `(inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const maxHeight = inputs.maxHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const boxWeight = inputs.boxWeight as number;
    const opt1Row = Math.floor(palletLength / boxLength);
    const opt1Col = Math.floor(palletWidth / boxWidth);
    const opt1PerLayer = opt1Row * opt1Col;
    const opt2Row = Math.floor(palletLength / boxWidth);
    const opt2Col = Math.floor(palletWidth / boxLength);
    const opt2PerLayer = opt2Row * opt2Col;
    const bestPerLayer = Math.max(opt1PerLayer, opt2PerLayer);
    const layers = Math.floor(maxHeight / boxHeight);
    const totalBoxes = bestPerLayer * layers;
    const totalWeight = totalBoxes * boxWeight;
    const palletArea = palletLength * palletWidth;
    const boxArea = bestPerLayer * boxLength * boxWidth;
    const areaUtil = Math.min((boxArea / palletArea) * 100, 100);
    return {
      primary: { label: "Total Boxes on Pallet", value: formatNumber(totalBoxes) },
      details: [
        { label: "Boxes Per Layer", value: formatNumber(bestPerLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Total Weight (lbs)", value: formatNumber(totalWeight) },
        { label: "Area Utilization", value: formatNumber(areaUtil) + "%" }
      ]
    };
  }`,
  [
    { q: "How do I optimize pallet stacking?", a: "Try both orientations of the box and choose the one that fits more per layer." },
    { q: "What limits pallet stacking height?", a: "Height is limited by warehouse clearance, weight, and box crush strength." }
  ],
  "Total = max(Orientation1, Orientation2) per Layer x Layers",
  ["pallet-load-calculator", "container-load-calculator", "warehouse-space-calculator"]
);
add('antenna-gain-calculator', 'Antenna Gain Calculator',
  'Calculate antenna gain in dBi from efficiency and aperture.',
  'Science', 'science', 'A',
  ['antenna gain', 'dBi calculator'],
  [
    '{ name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 100000, defaultValue: 2400 }',
    '{ name: "diameter", label: "Dish Diameter (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 }',
    '{ name: "efficiency", label: "Aperture Efficiency (%)", type: "number", min: 10, max: 100, defaultValue: 55 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const dia = inputs.diameter as number;
      const eff = inputs.efficiency as number;
      if (!freq || !dia || !eff) return null;
      const wavelength = 300 / freq;
      const area = Math.PI * Math.pow(dia / 2, 2);
      const gainLinear = (eff / 100) * 4 * Math.PI * area / Math.pow(wavelength, 2);
      const gainDbi = Math.round(10 * Math.log10(gainLinear) * 100) / 100;
      return {
        primary: { label: "Antenna Gain", value: formatNumber(gainDbi) + " dBi" },
        details: [
          { label: "Wavelength", value: formatNumber(Math.round(wavelength * 1000) / 1000) + " m" },
          { label: "Aperture Area", value: formatNumber(Math.round(area * 1000) / 1000) + " sq m" },
          { label: "Linear Gain", value: formatNumber(Math.round(gainLinear * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'What is antenna gain in dBi?', a: 'Gain in dBi is the directional power relative to an isotropic radiator.' },
   { q: 'Does a larger dish mean more gain?', a: 'Yes. Doubling the diameter roughly adds 6 dB of gain.' }],
  'Gain (dBi) = 10 log10(efficiency x 4 pi A / wavelength^2)',
  []
);

add('link-budget-calculator', 'Link Budget Calculator',
  'Calculate RF link margin from transmit power and losses.',
  'Science', 'science', 'A',
  ['link budget', 'RF link margin calculator'],
  [
    '{ name: "txPower", label: "Transmit Power (dBm)", type: "number", min: -30, max: 60, defaultValue: 30 }',
    '{ name: "txGain", label: "Tx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 }',
    '{ name: "rxGain", label: "Rx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 }',
    '{ name: "pathLoss", label: "Path Loss (dB)", type: "number", min: 0, max: 300, defaultValue: 100 }',
    '{ name: "rxSensitivity", label: "Rx Sensitivity (dBm)", type: "number", min: -130, max: 0, defaultValue: -90 }',
  ],
  `(inputs) => {
      const txP = inputs.txPower as number;
      const txG = inputs.txGain as number;
      const rxG = inputs.rxGain as number;
      const pl = inputs.pathLoss as number;
      const rxS = inputs.rxSensitivity as number;
      if (txP === undefined || !txG || !rxG || !pl || !rxS) return null;
      const received = txP + txG + rxG - pl;
      const margin = Math.round((received - rxS) * 100) / 100;
      return {
        primary: { label: "Link Margin", value: formatNumber(margin) + " dB" },
        details: [
          { label: "Received Power", value: formatNumber(received) + " dBm" },
          { label: "EIRP", value: formatNumber(txP + txG) + " dBm" },
          { label: "Status", value: margin > 0 ? "Link Viable" : "Link Fails" },
        ],
      };
  }`,
  [{ q: 'What is a link budget?', a: 'It sums gains and subtracts losses to find the received signal margin.' },
   { q: 'What link margin is considered safe?', a: 'A margin of at least 10 dB provides a reliable link.' }],
  'Margin = Tx Power + Tx Gain + Rx Gain - Path Loss - Rx Sensitivity',
  []
);

add('free-space-path-loss-calculator', 'Free Space Path Loss Calculator',
  'Calculate free space path loss in dB for a given distance.',
  'Science', 'science', 'A',
  ['FSPL', 'free space path loss'],
  [
    '{ name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 300000, defaultValue: 2400 }',
    '{ name: "distance", label: "Distance (km)", type: "number", min: 0.001, max: 100000, defaultValue: 1 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const dist = inputs.distance as number;
      if (!freq || !dist) return null;
      const fspl = Math.round((20 * Math.log10(dist) + 20 * Math.log10(freq) + 32.44) * 100) / 100;
      const wavelength = Math.round(300 / freq * 10000) / 10000;
      return {
        primary: { label: "Free Space Path Loss", value: formatNumber(fspl) + " dB" },
        details: [
          { label: "Frequency", value: formatNumber(freq) + " MHz" },
          { label: "Distance", value: formatNumber(dist) + " km" },
          { label: "Wavelength", value: formatNumber(wavelength) + " m" },
        ],
      };
  }`,
  [{ q: 'What is free space path loss?', a: 'It is the signal attenuation over distance in open air with no obstacles.' },
   { q: 'Does FSPL depend on frequency?', a: 'Yes. Higher frequencies have greater free space path loss.' }],
  'FSPL (dB) = 20 log10(d) + 20 log10(f) + 32.44',
  []
);

add('coax-cable-loss-calculator', 'Coax Cable Loss Calculator',
  'Calculate signal attenuation through coaxial cable.',
  'Science', 'science', 'A',
  ['coax loss', 'cable attenuation calculator'],
  [
    '{ name: "cableLength", label: "Cable Length (ft)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "lossPerFt", label: "Loss Per 100 ft (dB)", type: "number", min: 0.1, max: 50, defaultValue: 6.1 }',
    '{ name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "connLoss", label: "Loss Per Connector (dB)", type: "number", min: 0, max: 3, defaultValue: 0.5 }',
  ],
  `(inputs) => {
      const len = inputs.cableLength as number;
      const lossPer = inputs.lossPerFt as number;
      const conn = inputs.connectors as number;
      const connL = inputs.connLoss as number;
      if (!len || !lossPer) return null;
      const cableLoss = Math.round(len / 100 * lossPer * 100) / 100;
      const connectorLoss = Math.round(conn * connL * 100) / 100;
      const totalLoss = Math.round((cableLoss + connectorLoss) * 100) / 100;
      return {
        primary: { label: "Total Loss", value: formatNumber(totalLoss) + " dB" },
        details: [
          { label: "Cable Loss", value: formatNumber(cableLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connectorLoss) + " dB" },
          { label: "Cable Length", value: formatNumber(len) + " ft" },
        ],
      };
  }`,
  [{ q: 'What causes loss in coaxial cable?', a: 'Resistance in the conductor and dielectric absorption cause signal loss.' },
   { q: 'Which coax cable has the lowest loss?', a: 'LMR-400 and similar low-loss cables are best for long runs.' }],
  'Total Loss = (Length / 100 x Loss per 100 ft) + (Connectors x Connector Loss)',
  []
);

add('fiber-optic-loss-calculator', 'Fiber Optic Loss Calculator',
  'Calculate total loss in a fiber optic link.',
  'Science', 'science', 'A',
  ['fiber optic loss', 'fiber link budget'],
  [
    '{ name: "fiberLength", label: "Fiber Length (km)", type: "number", min: 0.01, max: 200, defaultValue: 10 }',
    '{ name: "fiberLoss", label: "Fiber Loss (dB/km)", type: "number", min: 0.1, max: 5, defaultValue: 0.35 }',
    '{ name: "splices", label: "Number of Splices", type: "number", min: 0, max: 50, defaultValue: 4 }',
    '{ name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 }',
  ],
  `(inputs) => {
      const len = inputs.fiberLength as number;
      const loss = inputs.fiberLoss as number;
      const splices = inputs.splices as number;
      const conn = inputs.connectors as number;
      if (!len || !loss) return null;
      const fiberAtten = Math.round(len * loss * 100) / 100;
      const spliceLoss = Math.round(splices * 0.1 * 100) / 100;
      const connLoss = Math.round(conn * 0.5 * 100) / 100;
      const total = Math.round((fiberAtten + spliceLoss + connLoss) * 100) / 100;
      return {
        primary: { label: "Total Link Loss", value: formatNumber(total) + " dB" },
        details: [
          { label: "Fiber Attenuation", value: formatNumber(fiberAtten) + " dB" },
          { label: "Splice Loss", value: formatNumber(spliceLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connLoss) + " dB" },
        ],
      };
  }`,
  [{ q: 'What is typical fiber loss per km?', a: 'Single mode fiber has about 0.35 dB/km at 1310 nm wavelength.' },
   { q: 'How much loss does a splice add?', a: 'A fusion splice adds about 0.1 dB of loss.' }],
  'Total = (Length x dB/km) + (Splices x 0.1) + (Connectors x 0.5)',
  []
);

add('signal-to-noise-calculator', 'Signal to Noise Calculator',
  'Calculate signal-to-noise ratio in decibels.',
  'Science', 'science', 'A',
  ['SNR calculator', 'signal to noise ratio'],
  [
    '{ name: "signalPower", label: "Signal Power (dBm)", type: "number", min: -120, max: 60, defaultValue: -40 }',
    '{ name: "noisePower", label: "Noise Power (dBm)", type: "number", min: -150, max: 0, defaultValue: -90 }',
  ],
  `(inputs) => {
      const sig = inputs.signalPower as number;
      const noise = inputs.noisePower as number;
      if (sig === undefined || noise === undefined) return null;
      const snr = Math.round((sig - noise) * 100) / 100;
      const sigLin = Math.pow(10, sig / 10);
      const noiseLin = Math.pow(10, noise / 10);
      const ratioLin = Math.round(sigLin / noiseLin * 100) / 100;
      const quality = snr > 40 ? "Excellent" : snr > 25 ? "Good" : snr > 15 ? "Fair" : "Poor";
      return {
        primary: { label: "SNR", value: formatNumber(snr) + " dB" },
        details: [
          { label: "Linear Ratio", value: formatNumber(ratioLin) },
          { label: "Signal Quality", value: quality },
          { label: "Signal Power", value: formatNumber(sig) + " dBm" },
        ],
      };
  }`,
  [{ q: 'What is a good SNR value?', a: 'An SNR above 25 dB is considered good for most communication systems.' },
   { q: 'How is SNR calculated in dB?', a: 'SNR in dB equals signal power in dBm minus noise power in dBm.' }],
  'SNR (dB) = Signal Power (dBm) - Noise Power (dBm)',
  []
);

add('sampling-rate-calculator', 'Sampling Rate Calculator',
  'Calculate the minimum Nyquist sampling rate.',
  'Science', 'science', 'A',
  ['Nyquist rate', 'sampling frequency calculator'],
  [
    '{ name: "maxFrequency", label: "Max Signal Frequency (Hz)", type: "number", min: 1, max: 100000000000, defaultValue: 20000 }',
    '{ name: "oversampling", label: "Oversampling Factor", type: "number", min: 1, max: 64, defaultValue: 1 }',
  ],
  `(inputs) => {
      const fMax = inputs.maxFrequency as number;
      const over = inputs.oversampling as number;
      if (!fMax || !over) return null;
      const nyquist = 2 * fMax;
      const actual = nyquist * over;
      const period = Math.round(1 / actual * 1e12) / 1e6;
      return {
        primary: { label: "Minimum Sampling Rate", value: formatNumber(nyquist) + " Hz" },
        details: [
          { label: "With Oversampling", value: formatNumber(actual) + " Hz" },
          { label: "Sample Period", value: formatNumber(period) + " us" },
          { label: "Oversampling Factor", value: formatNumber(over) + "x" },
        ],
      };
  }`,
  [{ q: 'What is the Nyquist theorem?', a: 'It states the sampling rate must be at least twice the maximum frequency.' },
   { q: 'Why use oversampling?', a: 'Oversampling improves resolution and reduces aliasing artifacts.' }],
  'Nyquist Rate = 2 x Maximum Frequency',
  []
);

add('fft-bin-resolution-calculator', 'FFT Bin Resolution Calculator',
  'Calculate FFT frequency resolution from sample rate and size.',
  'Science', 'science', 'A',
  ['FFT resolution', 'frequency bin calculator'],
  [
    '{ name: "sampleRate", label: "Sample Rate (Hz)", type: "number", min: 1, max: 1000000000, defaultValue: 44100 }',
    '{ name: "fftSize", label: "FFT Size (points)", type: "number", min: 16, max: 1048576, defaultValue: 4096 }',
  ],
  `(inputs) => {
      const fs = inputs.sampleRate as number;
      const n = inputs.fftSize as number;
      if (!fs || !n) return null;
      const binRes = Math.round(fs / n * 10000) / 10000;
      const maxFreq = fs / 2;
      const numBins = n / 2;
      const windowTime = Math.round(n / fs * 10000) / 10000;
      return {
        primary: { label: "Frequency Resolution", value: formatNumber(binRes) + " Hz" },
        details: [
          { label: "Number of Bins", value: formatNumber(numBins) },
          { label: "Max Frequency", value: formatNumber(maxFreq) + " Hz" },
          { label: "Window Duration", value: formatNumber(windowTime) + " s" },
        ],
      };
  }`,
  [{ q: 'How do I improve FFT frequency resolution?', a: 'Increase the FFT size or lower the sample rate to get finer bins.' },
   { q: 'What is an FFT bin?', a: 'Each bin represents a frequency range equal to sample rate divided by FFT size.' }],
  'Bin Resolution = Sample Rate / FFT Size',
  []
);

add('decibel-addition-calculator', 'Decibel Addition Calculator',
  'Add two or more decibel levels together correctly.',
  'Science', 'science', 'A',
  ['dB addition', 'decibel sum calculator'],
  [
    '{ name: "db1", label: "Level 1 (dB)", type: "number", min: 0, max: 200, defaultValue: 90 }',
    '{ name: "db2", label: "Level 2 (dB)", type: "number", min: 0, max: 200, defaultValue: 87 }',
    '{ name: "db3", label: "Level 3 (dB, 0 to skip)", type: "number", min: 0, max: 200, defaultValue: 0 }',
  ],
  `(inputs) => {
      const d1 = inputs.db1 as number;
      const d2 = inputs.db2 as number;
      const d3 = inputs.db3 as number;
      if (!d1 && !d2) return null;
      let sum = Math.pow(10, d1 / 10) + Math.pow(10, d2 / 10);
      if (d3 > 0) sum += Math.pow(10, d3 / 10);
      const total = Math.round(10 * Math.log10(sum) * 100) / 100;
      const increase = Math.round((total - Math.max(d1, d2, d3)) * 100) / 100;
      return {
        primary: { label: "Combined Level", value: formatNumber(total) + " dB" },
        details: [
          { label: "Increase Over Loudest", value: formatNumber(increase) + " dB" },
          { label: "Source Count", value: d3 > 0 ? "3" : "2" },
          { label: "Loudest Source", value: formatNumber(Math.max(d1, d2, d3)) + " dB" },
        ],
      };
  }`,
  [{ q: 'Can you simply add dB values?', a: 'No. Decibels are logarithmic, so you must convert to linear first.' },
   { q: 'What does adding two equal dB levels give?', a: 'Two equal sources add about 3 dB to the individual level.' }],
  'Total dB = 10 log10(10^(dB1/10) + 10^(dB2/10) + ...)',
  []
);

add('sound-intensity-calculator', 'Sound Intensity Calculator',
  'Calculate sound intensity in watts per square meter from dB.',
  'Science', 'science', 'A',
  ['sound intensity', 'dB to intensity'],
  [
    '{ name: "spl", label: "Sound Pressure Level (dB)", type: "number", min: 0, max: 194, defaultValue: 85 }',
  ],
  `(inputs) => {
      const spl = inputs.spl as number;
      if (spl === undefined) return null;
      const refIntensity = 1e-12;
      const intensity = refIntensity * Math.pow(10, spl / 10);
      const pressure = 0.00002 * Math.pow(10, spl / 20);
      const desc = spl < 60 ? "Quiet" : spl < 85 ? "Moderate" : spl < 120 ? "Loud" : "Dangerous";
      return {
        primary: { label: "Sound Intensity", value: intensity.toExponential(3) + " W/sq m" },
        details: [
          { label: "Sound Pressure", value: (Math.round(pressure * 10000) / 10000) + " Pa" },
          { label: "SPL", value: formatNumber(spl) + " dB" },
          { label: "Loudness Category", value: desc },
        ],
      };
  }`,
  [{ q: 'What is the reference intensity for dB?', a: 'The reference is 10^-12 W/sq m, the threshold of human hearing.' },
   { q: 'At what dB level is sound dangerous?', a: 'Prolonged exposure above 85 dB can cause hearing damage.' }],
  'Intensity = 10^-12 x 10^(SPL/10) W/sq m',
  []
);

add('reverberation-distance-calculator', 'Reverberation Distance Calculator',
  'Calculate the critical distance in a room from RT60.',
  'Science', 'science', 'A',
  ['critical distance', 'reverberation distance'],
  [
    '{ name: "roomVolume", label: "Room Volume (cu m)", type: "number", min: 10, max: 100000, defaultValue: 200 }',
    '{ name: "rt60", label: "RT60 Reverberation Time (s)", type: "number", min: 0.1, max: 10, defaultValue: 1.2 }',
  ],
  `(inputs) => {
      const vol = inputs.roomVolume as number;
      const rt = inputs.rt60 as number;
      if (!vol || !rt) return null;
      const absorption = 0.161 * vol / rt;
      const dc = Math.round(0.057 * Math.sqrt(vol / rt) * 1000) / 1000;
      return {
        primary: { label: "Critical Distance", value: formatNumber(dc) + " m" },
        details: [
          { label: "RT60", value: formatNumber(rt) + " s" },
          { label: "Total Absorption", value: formatNumber(Math.round(absorption * 100) / 100) + " sabins" },
          { label: "Room Volume", value: formatNumber(vol) + " cu m" },
        ],
      };
  }`,
  [{ q: 'What is critical distance?', a: 'It is the distance where direct sound and reverberant sound are equal.' },
   { q: 'What is a good RT60 for a studio?', a: 'A recording studio typically targets an RT60 of 0.3 to 0.5 seconds.' }],
  'Dc = 0.057 x sqrt(Volume / RT60)',
  []
);

add('lens-focal-length-calculator', 'Lens Focal Length Calculator',
  'Calculate focal length from object and image distances.',
  'Science', 'science', 'A',
  ['focal length', 'thin lens calculator'],
  [
    '{ name: "objectDist", label: "Object Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 30 }',
    '{ name: "imageDist", label: "Image Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 60 }',
  ],
  `(inputs) => {
      const dO = inputs.objectDist as number;
      const dI = inputs.imageDist as number;
      if (!dO || !dI) return null;
      const f = Math.round(1 / (1 / dO + 1 / dI) * 1000) / 1000;
      const mag = Math.round(dI / dO * 1000) / 1000;
      const power = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Magnification", value: formatNumber(mag) + "x" },
          { label: "Optical Power", value: formatNumber(power) + " diopters" },
          { label: "Image Type", value: dI > 0 ? "Real" : "Virtual" },
        ],
      };
  }`,
  [{ q: 'What is the thin lens equation?', a: '1/f = 1/do + 1/di where f is focal length and d is distance.' },
   { q: 'What does a shorter focal length mean?', a: 'A shorter focal length means a stronger, more converging lens.' }],
  '1/f = 1/object_distance + 1/image_distance',
  []
);

add('magnifying-glass-calculator', 'Magnifying Glass Calculator',
  'Calculate magnification from the focal length of a lens.',
  'Science', 'science', 'A',
  ['magnification', 'magnifying glass power'],
  [
    '{ name: "focalLength", label: "Focal Length (cm)", type: "number", min: 0.5, max: 100, defaultValue: 10 }',
    '{ name: "nearPoint", label: "Near Point Distance (cm)", type: "number", min: 15, max: 40, defaultValue: 25 }',
  ],
  `(inputs) => {
      const f = inputs.focalLength as number;
      const np = inputs.nearPoint as number;
      if (!f || !np) return null;
      const magRelaxed = Math.round(np / f * 100) / 100;
      const magStrained = Math.round((np / f + 1) * 100) / 100;
      const powerDiopters = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Magnification (relaxed)", value: formatNumber(magRelaxed) + "x" },
        details: [
          { label: "Magnification (strained)", value: formatNumber(magStrained) + "x" },
          { label: "Lens Power", value: formatNumber(powerDiopters) + " diopters" },
          { label: "Focal Length", value: formatNumber(f) + " cm" },
        ],
      };
  }`,
  [{ q: 'How is magnification calculated?', a: 'Magnification equals the near point distance divided by the focal length.' },
   { q: 'What is the standard near point?', a: 'The standard near point of the human eye is 25 cm.' }],
  'Magnification = Near Point / Focal Length',
  []
);

add('mirror-focal-point-calculator', 'Mirror Focal Point Calculator',
  'Calculate the focal point of a concave mirror.',
  'Science', 'science', 'A',
  ['concave mirror', 'mirror focal point'],
  [
    '{ name: "radiusCurvature", label: "Radius of Curvature (cm)", type: "number", min: 1, max: 10000, defaultValue: 40 }',
    '{ name: "objectDist", label: "Object Distance (cm)", type: "number", min: 1, max: 100000, defaultValue: 60 }',
  ],
  `(inputs) => {
      const r = inputs.radiusCurvature as number;
      const dO = inputs.objectDist as number;
      if (!r || !dO) return null;
      const f = r / 2;
      const dI = Math.round(1 / (1 / f - 1 / dO) * 100) / 100;
      const mag = Math.round(-dI / dO * 1000) / 1000;
      const imageType = dI > 0 ? "Real and Inverted" : "Virtual and Upright";
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Image Distance", value: formatNumber(dI) + " cm" },
          { label: "Magnification", value: formatNumber(Math.abs(mag)) + "x" },
          { label: "Image Type", value: imageType },
        ],
      };
  }`,
  [{ q: 'How is focal length related to radius of curvature?', a: 'The focal length is exactly half the radius of curvature.' },
   { q: 'When does a concave mirror form a virtual image?', a: 'When the object is between the focal point and the mirror surface.' }],
  'f = R / 2; 1/f = 1/do + 1/di',
  []
);

add('snells-law-calculator', 'Snell Law Calculator',
  'Calculate the angle of refraction using Snell law.',
  'Science', 'science', 'A',
  ['Snell law', 'refraction angle calculator'],
  [
    '{ name: "n1", label: "Refractive Index n1", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "n2", label: "Refractive Index n2", type: "number", min: 1, max: 4, defaultValue: 1.5 }',
    '{ name: "angle1", label: "Incident Angle (degrees)", type: "number", min: 0, max: 90, defaultValue: 30 }',
  ],
  `(inputs) => {
      const n1 = inputs.n1 as number;
      const n2 = inputs.n2 as number;
      const theta1 = inputs.angle1 as number;
      if (!n1 || !n2 || theta1 === undefined) return null;
      const rad1 = theta1 * Math.PI / 180;
      const sinTheta2 = n1 * Math.sin(rad1) / n2;
      if (Math.abs(sinTheta2) > 1) {
        const critAngle = Math.round(Math.asin(n2 / n1) * 180 / Math.PI * 100) / 100;
        return { primary: { label: "Result", value: "Total Internal Reflection" }, details: [{ label: "Critical Angle", value: formatNumber(critAngle) + " deg" }] };
      }
      const theta2 = Math.round(Math.asin(sinTheta2) * 180 / Math.PI * 100) / 100;
      return {
        primary: { label: "Refracted Angle", value: formatNumber(theta2) + " deg" },
        details: [
          { label: "Incident Angle", value: formatNumber(theta1) + " deg" },
          { label: "n1", value: formatNumber(n1) },
          { label: "n2", value: formatNumber(n2) },
        ],
      };
  }`,
  [{ q: 'What is Snell law?', a: 'n1 sin(theta1) = n2 sin(theta2) describes light bending at an interface.' },
   { q: 'What causes total internal reflection?', a: 'It occurs when light goes from a denser to a less dense medium above critical angle.' }],
  'n1 sin(theta1) = n2 sin(theta2)',
  []
);

add('diffraction-grating-calculator', 'Diffraction Grating Calculator',
  'Calculate diffraction angles from grating line spacing.',
  'Science', 'science', 'A',
  ['diffraction grating', 'grating angle calculator'],
  [
    '{ name: "wavelength", label: "Wavelength (nm)", type: "number", min: 100, max: 2000, defaultValue: 550 }',
    '{ name: "linesMm", label: "Lines Per mm", type: "number", min: 10, max: 10000, defaultValue: 600 }',
    '{ name: "order", label: "Diffraction Order", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const wl = inputs.wavelength as number;
      const lines = inputs.linesMm as number;
      const m = inputs.order as number;
      if (!wl || !lines || !m) return null;
      const d = 1e6 / lines;
      const sinTheta = m * wl / d;
      if (sinTheta > 1) return { primary: { label: "Result", value: "Order not observable" }, details: [{ label: "Reason", value: "sin(theta) exceeds 1" }] };
      const theta = Math.round(Math.asin(sinTheta) * 180 / Math.PI * 100) / 100;
      return {
        primary: { label: "Diffraction Angle", value: formatNumber(theta) + " deg" },
        details: [
          { label: "Grating Spacing", value: formatNumber(Math.round(d * 100) / 100) + " nm" },
          { label: "Order", value: formatNumber(m) },
          { label: "Wavelength", value: formatNumber(wl) + " nm" },
        ],
      };
  }`,
  [{ q: 'What is a diffraction grating?', a: 'It is a surface with many parallel slits that disperses light by wavelength.' },
   { q: 'What does diffraction order mean?', a: 'Order is the integer m in d sin(theta) = m x wavelength.' }],
  'd sin(theta) = m x wavelength',
  []
);

add('youngs-modulus-calculator', 'Young Modulus Calculator',
  'Calculate stress-to-strain ratio for a material.',
  'Science', 'science', 'A',
  ['Young modulus', 'elastic modulus calculator'],
  [
    '{ name: "force", label: "Applied Force (N)", type: "number", min: 0.1, max: 10000000, defaultValue: 1000 }',
    '{ name: "area", label: "Cross Section Area (sq mm)", type: "number", min: 0.01, max: 100000, defaultValue: 100 }',
    '{ name: "originalLength", label: "Original Length (mm)", type: "number", min: 1, max: 100000, defaultValue: 1000 }',
    '{ name: "extension", label: "Extension (mm)", type: "number", min: 0.001, max: 1000, defaultValue: 0.5 }',
  ],
  `(inputs) => {
      const f = inputs.force as number;
      const a = inputs.area as number;
      const l0 = inputs.originalLength as number;
      const dl = inputs.extension as number;
      if (!f || !a || !l0 || !dl) return null;
      const stress = f / (a * 1e-6);
      const strain = dl / l0;
      const modulus = stress / strain;
      const modulusGpa = Math.round(modulus / 1e9 * 1000) / 1000;
      const stressMpa = Math.round(stress / 1e6 * 1000) / 1000;
      return {
        primary: { label: "Young Modulus", value: formatNumber(modulusGpa) + " GPa" },
        details: [
          { label: "Stress", value: formatNumber(stressMpa) + " MPa" },
          { label: "Strain", value: formatNumber(Math.round(strain * 100000) / 100000) },
          { label: "Extension", value: formatNumber(dl) + " mm" },
        ],
      };
  }`,
  [{ q: 'What is Young modulus?', a: 'It is the ratio of stress to strain, measuring material stiffness.' },
   { q: 'What are typical Young modulus values?', a: 'Steel is about 200 GPa, aluminum is about 70 GPa.' }],
  'E = (F / A) / (dL / L0)',
  []
);

add('thermal-conductivity-calculator', 'Thermal Conductivity Calculator',
  'Calculate heat flow through a material slab.',
  'Science', 'science', 'A',
  ['thermal conductivity', 'heat transfer calculator'],
  [
    '{ name: "conductivity", label: "Conductivity (W/m K)", type: "number", min: 0.01, max: 500, defaultValue: 0.6 }',
    '{ name: "area", label: "Area (sq m)", type: "number", min: 0.001, max: 1000, defaultValue: 1 }',
    '{ name: "thickness", label: "Thickness (m)", type: "number", min: 0.001, max: 10, defaultValue: 0.1 }',
    '{ name: "tempDiff", label: "Temperature Difference (K)", type: "number", min: 0.1, max: 1000, defaultValue: 20 }',
  ],
  `(inputs) => {
      const k = inputs.conductivity as number;
      const a = inputs.area as number;
      const t = inputs.thickness as number;
      const dT = inputs.tempDiff as number;
      if (!k || !a || !t || !dT) return null;
      const heatFlow = Math.round(k * a * dT / t * 100) / 100;
      const rValue = Math.round(t / k * 1000) / 1000;
      return {
        primary: { label: "Heat Flow", value: formatNumber(heatFlow) + " W" },
        details: [
          { label: "Thermal Resistance", value: formatNumber(rValue) + " m2 K/W" },
          { label: "Conductivity", value: formatNumber(k) + " W/m K" },
          { label: "Temperature Difference", value: formatNumber(dT) + " K" },
        ],
      };
  }`,
  [{ q: 'What is thermal conductivity?', a: 'It measures how well a material conducts heat, in watts per meter kelvin.' },
   { q: 'What material has the highest thermal conductivity?', a: 'Diamond has the highest at about 2000 W/m K.' }],
  'Q = k x A x dT / thickness',
  []
);

add('specific-heat-calculator', 'Specific Heat Calculator',
  'Calculate energy needed for a temperature change.',
  'Science', 'science', 'A',
  ['specific heat', 'heat energy calculator'],
  [
    '{ name: "mass", label: "Mass (kg)", type: "number", min: 0.001, max: 100000, defaultValue: 1 }',
    '{ name: "specificHeat", label: "Specific Heat (J/kg K)", type: "number", min: 1, max: 10000, defaultValue: 4186 }',
    '{ name: "tempChange", label: "Temperature Change (K)", type: "number", min: 0.1, max: 5000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const m = inputs.mass as number;
      const c = inputs.specificHeat as number;
      const dT = inputs.tempChange as number;
      if (!m || !c || !dT) return null;
      const energy = m * c * dT;
      const energyKj = Math.round(energy / 1000 * 100) / 100;
      const energyCal = Math.round(energy / 4.184 * 100) / 100;
      return {
        primary: { label: "Energy Required", value: formatNumber(energyKj) + " kJ" },
        details: [
          { label: "Energy (J)", value: formatNumber(Math.round(energy * 100) / 100) + " J" },
          { label: "Energy (cal)", value: formatNumber(energyCal) + " cal" },
          { label: "Mass", value: formatNumber(m) + " kg" },
        ],
      };
  }`,
  [{ q: 'What is specific heat capacity?', a: 'It is the energy needed to raise 1 kg of a substance by 1 kelvin.' },
   { q: 'What is the specific heat of water?', a: 'Water has a specific heat of about 4186 J/kg K.' }],
  'Q = mass x specific heat x temperature change',
  []
);

add('viscosity-calculator', 'Viscosity Calculator',
  'Calculate dynamic viscosity from shear stress and rate.',
  'Science', 'science', 'A',
  ['viscosity', 'fluid viscosity calculator'],
  [
    '{ name: "shearStress", label: "Shear Stress (Pa)", type: "number", min: 0.0001, max: 100000, defaultValue: 10 }',
    '{ name: "shearRate", label: "Shear Rate (1/s)", type: "number", min: 0.001, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const stress = inputs.shearStress as number;
      const rate = inputs.shearRate as number;
      if (!stress || !rate) return null;
      const viscosity = stress / rate;
      const viscCp = Math.round(viscosity * 1000 * 1000) / 1000;
      const kinematic = Math.round(viscosity / 1000 * 1e6 * 1000) / 1000;
      return {
        primary: { label: "Dynamic Viscosity", value: formatNumber(Math.round(viscosity * 10000) / 10000) + " Pa s" },
        details: [
          { label: "Viscosity (cP)", value: formatNumber(viscCp) + " cP" },
          { label: "Shear Stress", value: formatNumber(stress) + " Pa" },
          { label: "Shear Rate", value: formatNumber(rate) + " 1/s" },
        ],
      };
  }`,
  [{ q: 'What is dynamic viscosity?', a: 'It measures a fluid resistance to flow under an applied shear stress.' },
   { q: 'What is the viscosity of water?', a: 'Water at 20 degrees C has a viscosity of about 1 cP or 0.001 Pa s.' }],
  'Viscosity = Shear Stress / Shear Rate',
  []
);

add('reynolds-number-calculator', 'Reynolds Number Calculator',
  'Calculate the Reynolds number to determine flow regime.',
  'Science', 'science', 'A',
  ['Reynolds number', 'flow regime calculator'],
  [
    '{ name: "velocity", label: "Flow Velocity (m/s)", type: "number", min: 0.001, max: 1000, defaultValue: 2 }',
    '{ name: "diameter", label: "Pipe Diameter (m)", type: "number", min: 0.001, max: 10, defaultValue: 0.05 }',
    '{ name: "density", label: "Fluid Density (kg/cu m)", type: "number", min: 0.1, max: 20000, defaultValue: 1000 }',
    '{ name: "viscosity", label: "Dynamic Viscosity (Pa s)", type: "number", min: 0.000001, max: 100, defaultValue: 0.001 }',
  ],
  `(inputs) => {
      const v = inputs.velocity as number;
      const d = inputs.diameter as number;
      const rho = inputs.density as number;
      const mu = inputs.viscosity as number;
      if (!v || !d || !rho || !mu) return null;
      const re = Math.round(rho * v * d / mu * 100) / 100;
      const regime = re < 2300 ? "Laminar" : re < 4000 ? "Transitional" : "Turbulent";
      return {
        primary: { label: "Reynolds Number", value: formatNumber(re) },
        details: [
          { label: "Flow Regime", value: regime },
          { label: "Velocity", value: formatNumber(v) + " m/s" },
          { label: "Pipe Diameter", value: formatNumber(d) + " m" },
        ],
      };
  }`,
  [{ q: 'What does Reynolds number indicate?', a: 'It predicts whether flow is laminar, transitional, or turbulent.' },
   { q: 'At what Reynolds number does turbulence start?', a: 'Flow becomes turbulent above approximately 4000 in a pipe.' }],
  'Re = density x velocity x diameter / viscosity',
  []
);

add('buoyancy-calculator', 'Buoyancy Calculator',
  'Calculate the buoyant force on a submerged object.',
  'Science', 'science', 'A',
  ['buoyancy', 'buoyant force calculator'],
  [
    '{ name: "volume", label: "Object Volume (cu m)", type: "number", min: 0.0001, max: 10000, defaultValue: 0.01 }',
    '{ name: "fluidDensity", label: "Fluid Density (kg/cu m)", type: "number", min: 0.1, max: 20000, defaultValue: 1000 }',
    '{ name: "objectMass", label: "Object Mass (kg)", type: "number", min: 0.001, max: 1000000, defaultValue: 5 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const rho = inputs.fluidDensity as number;
      const mass = inputs.objectMass as number;
      if (!vol || !rho || !mass) return null;
      const buoyantForce = Math.round(rho * vol * 9.81 * 100) / 100;
      const weight = Math.round(mass * 9.81 * 100) / 100;
      const netForce = Math.round((buoyantForce - weight) * 100) / 100;
      const floats = buoyantForce >= weight ? "Floats" : "Sinks";
      return {
        primary: { label: "Buoyant Force", value: formatNumber(buoyantForce) + " N" },
        details: [
          { label: "Object Weight", value: formatNumber(weight) + " N" },
          { label: "Net Force", value: formatNumber(netForce) + " N" },
          { label: "Result", value: floats },
        ],
      };
  }`,
  [{ q: 'What is Archimedes principle?', a: 'The buoyant force equals the weight of displaced fluid.' },
   { q: 'When does an object float?', a: 'An object floats when the buoyant force equals or exceeds its weight.' }],
  'Buoyant Force = fluid density x volume x g',
  []
);

add('spring-constant-calculator', 'Spring Constant Calculator',
  'Calculate spring stiffness using Hooke law.',
  'Science', 'science', 'A',
  ['spring constant', 'Hooke law calculator'],
  [
    '{ name: "force", label: "Applied Force (N)", type: "number", min: 0.01, max: 100000, defaultValue: 10 }',
    '{ name: "displacement", label: "Displacement (m)", type: "number", min: 0.0001, max: 10, defaultValue: 0.05 }',
  ],
  `(inputs) => {
      const f = inputs.force as number;
      const x = inputs.displacement as number;
      if (!f || !x) return null;
      const k = Math.round(f / x * 100) / 100;
      const pe = Math.round(0.5 * k * x * x * 10000) / 10000;
      const kNm = Math.round(k / 1000 * 1000) / 1000;
      return {
        primary: { label: "Spring Constant", value: formatNumber(k) + " N/m" },
        details: [
          { label: "Stored Energy", value: formatNumber(pe) + " J" },
          { label: "Force Applied", value: formatNumber(f) + " N" },
          { label: "Displacement", value: formatNumber(x) + " m" },
        ],
      };
  }`,
  [{ q: 'What is Hooke law?', a: 'F = k x says force is proportional to spring displacement.' },
   { q: 'What does a higher spring constant mean?', a: 'A higher k means a stiffer spring that requires more force to stretch.' }],
  'k = F / x (Hooke law)',
  []
);

add('pendulum-period-calculator', 'Pendulum Period Calculator',
  'Calculate the period of a simple pendulum.',
  'Science', 'science', 'A',
  ['pendulum period', 'simple pendulum calculator'],
  [
    '{ name: "length", label: "Pendulum Length (m)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "gravity", label: "Gravity (m/s2)", type: "number", min: 0.1, max: 30, defaultValue: 9.81 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const g = inputs.gravity as number;
      if (!l || !g) return null;
      const period = Math.round(2 * Math.PI * Math.sqrt(l / g) * 10000) / 10000;
      const frequency = Math.round(1 / period * 10000) / 10000;
      const angularFreq = Math.round(2 * Math.PI * frequency * 1000) / 1000;
      return {
        primary: { label: "Period", value: formatNumber(period) + " s" },
        details: [
          { label: "Frequency", value: formatNumber(frequency) + " Hz" },
          { label: "Angular Frequency", value: formatNumber(angularFreq) + " rad/s" },
          { label: "Length", value: formatNumber(l) + " m" },
        ],
      };
  }`,
  [{ q: 'Does pendulum mass affect the period?', a: 'No. The period depends only on length and gravity, not mass.' },
   { q: 'What is the formula for a simple pendulum?', a: 'T = 2 pi sqrt(L / g) for small angle oscillations.' }],
  'T = 2 pi sqrt(L / g)',
  []
);

add('projectile-range-calculator', 'Projectile Range Calculator',
  'Calculate the horizontal distance of a projectile.',
  'Science', 'science', 'A',
  ['projectile range', 'projectile motion calculator'],
  [
    '{ name: "velocity", label: "Launch Velocity (m/s)", type: "number", min: 0.1, max: 10000, defaultValue: 20 }',
    '{ name: "angle", label: "Launch Angle (degrees)", type: "number", min: 1, max: 89, defaultValue: 45 }',
    '{ name: "height", label: "Launch Height (m)", type: "number", min: 0, max: 10000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const v = inputs.velocity as number;
      const deg = inputs.angle as number;
      const h = inputs.height as number;
      if (!v || !deg) return null;
      const g = 9.81;
      const rad = deg * Math.PI / 180;
      const vx = v * Math.cos(rad);
      const vy = v * Math.sin(rad);
      const tUp = vy / g;
      const maxH = h + vy * tUp - 0.5 * g * tUp * tUp;
      const tTotal = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
      const range = Math.round(vx * tTotal * 100) / 100;
      return {
        primary: { label: "Range", value: formatNumber(range) + " m" },
        details: [
          { label: "Max Height", value: formatNumber(Math.round(maxH * 100) / 100) + " m" },
          { label: "Time of Flight", value: formatNumber(Math.round(tTotal * 100) / 100) + " s" },
          { label: "Launch Angle", value: formatNumber(deg) + " deg" },
        ],
      };
  }`,
  [{ q: 'What angle gives maximum range?', a: '45 degrees gives the maximum range on level ground with no air resistance.' },
   { q: 'Does launch height affect range?', a: 'Yes. A higher launch point increases the total range.' }],
  'Range = vx x (vy + sqrt(vy^2 + 2gh)) / g',
  []
);

// === FOOTER: Generate files ===

function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: ${JSON.stringify(c.kw)},
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '')}",
    description: "${c.desc}",
    fields: [
      ${c.fields.join(',\n      ')},
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: ${JSON.stringify(c.rel)},
  faq: [
${c.faq.map(f => `    { question: "${f.q}", answer: "${f.a}" },`).join('\n')}
  ],
  formula: "${c.formula}",
};
`;
}

let generated = 0, skipped = 0;
for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  fs.writeFileSync(filePath, genFile(c));
  generated++;
}

console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);

const newImports = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `import { ${eName(c.slug)} } from "./${c.slug}";`);
const newRegs = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `  ${eName(c.slug)},`);
fs.writeFileSync(path.join(__dirname, 'new-imports-batch9.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch9.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch9.txt`);
console.log(`Registry saved to: scripts/new-regs-batch9.txt`);
