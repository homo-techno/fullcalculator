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

// === BATCH 15: 100 CALCULATORS ===

add(
  "boat-fuel-consumption-calculator",
  "Boat Fuel Consumption Calculator",
  "Calculate your boat fuel consumption rate based on engine horsepower, RPM, and fuel type to estimate gallons per hour and cost per trip.",
  "Everyday",
  "everyday",
  "~",
  ["boat fuel consumption", "marine fuel calculator", "gallons per hour boat", "boat fuel cost"],
  [
    '{ name: "horsepower", label: "Engine Horsepower", type: "number", min: 5, max: 3000, defaultValue: 200 }',
    '{ name: "rpmPercent", label: "Throttle Setting (%)", type: "number", min: 10, max: 100, defaultValue: 75 }',
    '{ name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "0.06", label: "Gasoline (2-stroke)" }, { value: "0.05", label: "Gasoline (4-stroke)" }, { value: "0.04", label: "Diesel" }], defaultValue: "0.05" }',
    '{ name: "fuelPrice", label: "Fuel Price Per Gallon ($)", type: "number", min: 1, max: 15, defaultValue: 4.50 }',
    '{ name: "tripHours", label: "Trip Duration (hours)", type: "number", min: 0.5, max: 48, defaultValue: 4 }'
  ],
  `(inputs) => {
    const hp = inputs.horsepower as number;
    const throttle = inputs.rpmPercent as number / 100;
    const consumptionRate = parseFloat(inputs.fuelType as string);
    const price = inputs.fuelPrice as number;
    const hours = inputs.tripHours as number;
    const gph = hp * throttle * consumptionRate;
    const tripGallons = gph * hours;
    const tripCost = tripGallons * price;
    const costPerHour = gph * price;
    return {
      primary: { label: "Gallons Per Hour", value: formatNumber(Math.round(gph * 100) / 100) + " GPH" },
      details: [
        { label: "Trip Fuel Usage", value: formatNumber(Math.round(tripGallons * 10) / 10) + " gallons" },
        { label: "Trip Fuel Cost", value: "$" + formatNumber(Math.round(tripCost * 100) / 100) },
        { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
        { label: "Annual Cost (100 hrs)", value: "$" + formatNumber(Math.round(costPerHour * 100)) }
      ]
    };
  }`,
  [
    { q: "How do I calculate boat fuel consumption?", a: "A common rule of thumb is to multiply engine horsepower by the throttle percentage and a fuel consumption factor. Gasoline 2-stroke engines use about 0.06 gallons per horsepower hour, 4-stroke engines about 0.05, and diesel engines about 0.04." },
    { q: "Does boat speed affect fuel consumption?", a: "Yes. Running at full throttle can consume two to three times more fuel than cruising at 60 to 70 percent throttle. Most boats achieve their best fuel economy at displacement or semi-planing speeds." },
    { q: "How can I reduce my boat fuel costs?", a: "Keep the hull clean, maintain proper trim, reduce excess weight, cruise at economical RPM ranges, keep the engine properly tuned, and use the correct propeller pitch for your typical use." }
  ],
  `Gallons Per Hour (GPH) = Horsepower x Throttle % x Fuel Consumption Factor
Trip Fuel = GPH x Trip Duration
Trip Cost = Trip Fuel x Price Per Gallon`,
  ["marina-slip-cost-calculator", "boat-engine-hours-maintenance-calculator"]
);

add(
  "marina-slip-cost-calculator",
  "Marina Slip Cost Calculator",
  "Estimate annual marina slip rental costs based on boat length, marina location type, and seasonal versus year-round berthing to budget your docking expenses.",
  "Finance",
  "finance",
  "$",
  ["marina slip cost", "boat docking fees", "marina rental", "boat slip price"],
  [
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 200, defaultValue: 30 }',
    '{ name: "costPerFoot", label: "Monthly Cost Per Foot ($)", type: "number", min: 5, max: 200, defaultValue: 25 }',
    '{ name: "months", label: "Months Per Year", type: "number", min: 1, max: 12, defaultValue: 12 }',
    '{ name: "electricFee", label: "Monthly Electric Fee ($)", type: "number", min: 0, max: 500, defaultValue: 50 }',
    '{ name: "liveaboard", label: "Liveaboard Surcharge", type: "select", options: [{ value: "0", label: "None" }, { value: "200", label: "$200/month" }, { value: "400", label: "$400/month" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const costPerFoot = inputs.costPerFoot as number;
    const months = inputs.months as number;
    const electric = inputs.electricFee as number;
    const liveaboard = parseFloat(inputs.liveaboard as string);
    const monthlySlip = length * costPerFoot;
    const monthlyTotal = monthlySlip + electric + liveaboard;
    const annualTotal = monthlyTotal * months;
    const dailyCost = monthlyTotal / 30;
    return {
      primary: { label: "Monthly Slip Cost", value: "$" + formatNumber(Math.round(monthlySlip)) },
      details: [
        { label: "Monthly Total (all fees)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Annual Total", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) },
        { label: "Cost Per Foot Per Year", value: "$" + formatNumber(Math.round(costPerFoot * months * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does a marina slip cost?", a: "Marina slip costs vary widely based on location, ranging from $10 to $200 or more per foot per month. Popular coastal areas like Southern California, South Florida, and the Northeast tend to be the most expensive." },
    { q: "What is included in marina slip fees?", a: "Basic slip fees typically cover the dock space and water access. Electricity, Wi-Fi, pump-out, laundry, showers, and parking may be included or charged separately depending on the marina." },
    { q: "Is it cheaper to trailer a boat versus keeping it in a slip?", a: "For boats under 25 feet, trailering is often cheaper. You save on marina fees but need to account for the trailer cost, storage lot rental, vehicle fuel, and the time spent launching and retrieving." }
  ],
  `Monthly Slip Cost = Boat Length x Cost Per Foot
Monthly Total = Slip Cost + Electric Fee + Liveaboard Surcharge
Annual Total = Monthly Total x Months Per Year`,
  ["boat-fuel-consumption-calculator", "boat-depreciation-calculator"]
);

add(
  "boat-engine-hours-maintenance-calculator",
  "Boat Engine Hours Maintenance Calculator",
  "Track engine hours and determine when maintenance is due for oil changes, impeller replacement, lower unit service, and other scheduled boat engine care.",
  "Everyday",
  "everyday",
  "~",
  ["boat engine maintenance", "engine hours service", "marine engine schedule", "boat oil change interval"],
  [
    '{ name: "currentHours", label: "Current Engine Hours", type: "number", min: 0, max: 20000, defaultValue: 250 }',
    '{ name: "lastOilChange", label: "Hours at Last Oil Change", type: "number", min: 0, max: 20000, defaultValue: 200 }',
    '{ name: "lastImpeller", label: "Hours at Last Impeller Change", type: "number", min: 0, max: 20000, defaultValue: 100 }',
    '{ name: "lastLowerUnit", label: "Hours at Last Lower Unit Service", type: "number", min: 0, max: 20000, defaultValue: 0 }',
    '{ name: "hoursPerYear", label: "Estimated Annual Usage (hours)", type: "number", min: 10, max: 1000, defaultValue: 100 }'
  ],
  `(inputs) => {
    const current = inputs.currentHours as number;
    const lastOil = inputs.lastOilChange as number;
    const lastImpeller = inputs.lastImpeller as number;
    const lastLower = inputs.lastLowerUnit as number;
    const annual = inputs.hoursPerYear as number;
    const oilRemaining = Math.max(0, 100 - (current - lastOil));
    const impellerRemaining = Math.max(0, 300 - (current - lastImpeller));
    const lowerRemaining = Math.max(0, 500 - (current - lastLower));
    const nextService = Math.min(oilRemaining, impellerRemaining, lowerRemaining);
    const oilMonths = annual > 0 ? Math.round((oilRemaining / annual) * 12) : 0;
    return {
      primary: { label: "Next Service Due In", value: formatNumber(nextService) + " hours" },
      details: [
        { label: "Oil Change Due In", value: formatNumber(oilRemaining) + " hours (~" + oilMonths + " months)" },
        { label: "Impeller Due In", value: formatNumber(impellerRemaining) + " hours" },
        { label: "Lower Unit Service Due In", value: formatNumber(lowerRemaining) + " hours" },
        { label: "Hours Since Last Oil Change", value: formatNumber(current - lastOil) + " hours" },
        { label: "Total Engine Hours", value: formatNumber(current) }
      ]
    };
  }`,
  [
    { q: "How often should I change boat engine oil?", a: "Most marine engine manufacturers recommend changing oil every 100 hours of operation or at least once per year, whichever comes first. New engines may require a break-in oil change at 20 to 25 hours." },
    { q: "When should I replace my water pump impeller?", a: "Replace the water pump impeller every 300 hours or every two to three years. If you notice reduced water flow from the tell-tale, replace it immediately regardless of hours." },
    { q: "What is considered high hours on a boat engine?", a: "For gasoline inboard engines, 1,500 hours is considered high. Diesel engines can run 5,000 or more hours. Outboard engines typically last 1,500 to 3,000 hours with proper maintenance." }
  ],
  `Oil Change Interval = 100 hours
Impeller Replacement Interval = 300 hours
Lower Unit Service Interval = 500 hours
Hours Remaining = Interval - (Current Hours - Hours at Last Service)`,
  ["boat-fuel-consumption-calculator", "boat-depreciation-calculator"]
);

add(
  "anchor-size-calculator",
  "Anchor Size Calculator",
  "Determine the recommended anchor size and rode length for your boat based on vessel length, displacement, and typical anchoring conditions.",
  "Everyday",
  "everyday",
  "~",
  ["anchor size calculator", "boat anchor weight", "anchor rode length", "anchor scope ratio"],
  [
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 150, defaultValue: 28 }',
    '{ name: "displacement", label: "Boat Displacement (lbs)", type: "number", min: 500, max: 200000, defaultValue: 6000 }',
    '{ name: "waterDepth", label: "Water Depth (feet)", type: "number", min: 3, max: 200, defaultValue: 15 }',
    '{ name: "conditions", label: "Wind Conditions", type: "select", options: [{ value: "5", label: "Light (5:1 scope)" }, { value: "7", label: "Moderate (7:1 scope)" }, { value: "10", label: "Storm (10:1 scope)" }], defaultValue: "7" }',
    '{ name: "freeboard", label: "Bow Height Above Water (feet)", type: "number", min: 2, max: 20, defaultValue: 4 }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const displacement = inputs.displacement as number;
    const depth = inputs.waterDepth as number;
    const scope = parseFloat(inputs.conditions as string);
    const freeboard = inputs.freeboard as number;
    const totalDepth = depth + freeboard;
    const rodeLength = totalDepth * scope;
    const anchorWeight = Math.ceil(displacement / 500) * 2 + length * 0.2;
    const swingRadius = rodeLength + length;
    const chainLength = Math.max(6, length * 0.5);
    return {
      primary: { label: "Recommended Anchor Weight", value: formatNumber(Math.round(anchorWeight)) + " lbs" },
      details: [
        { label: "Rode Length Needed", value: formatNumber(Math.round(rodeLength)) + " feet" },
        { label: "Scope Ratio", value: scope + ":1" },
        { label: "Swing Radius", value: formatNumber(Math.round(swingRadius)) + " feet" },
        { label: "Recommended Chain Length", value: formatNumber(Math.round(chainLength)) + " feet" }
      ]
    };
  }`,
  [
    { q: "How do I choose the right anchor size?", a: "Anchor size is primarily determined by boat displacement and length. Heavier boats need larger anchors. Always err on the side of a slightly oversized anchor, as undersized anchors can drag in changing conditions." },
    { q: "What is anchor scope?", a: "Scope is the ratio of anchor rode length to the total depth (water depth plus bow height). A 7 to 1 scope is standard for moderate conditions. In storms, use a 10 to 1 scope or greater." },
    { q: "Should I use chain or rope for anchor rode?", a: "An all-chain rode provides the best holding and is most durable but is heavy. A combination of chain (at least one boat length) connected to nylon rope is lighter and works well for most recreational boaters." }
  ],
  `Rode Length = (Water Depth + Freeboard) x Scope Ratio
Anchor Weight = (Displacement / 500) x 2 + Boat Length x 0.2
Swing Radius = Rode Length + Boat Length`,
  ["boat-fuel-consumption-calculator", "hull-speed-calculator"]
);

add(
  "boat-bottom-paint-calculator",
  "Boat Bottom Paint Calculator",
  "Calculate how much antifouling bottom paint you need based on boat dimensions and number of coats, plus estimated material cost.",
  "Everyday",
  "everyday",
  "~",
  ["boat bottom paint", "antifouling paint calculator", "hull paint coverage", "bottom paint cost"],
  [
    '{ name: "boatLength", label: "Waterline Length (feet)", type: "number", min: 10, max: 150, defaultValue: 28 }',
    '{ name: "boatBeam", label: "Beam at Waterline (feet)", type: "number", min: 4, max: 40, defaultValue: 9 }',
    '{ name: "draft", label: "Draft (feet)", type: "number", min: 1, max: 20, defaultValue: 3.5 }',
    '{ name: "coats", label: "Number of Coats", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "paintCost", label: "Paint Cost Per Gallon ($)", type: "number", min: 50, max: 500, defaultValue: 180 }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const beam = inputs.boatBeam as number;
    const draft = inputs.draft as number;
    const coats = inputs.coats as number;
    const costPerGallon = inputs.paintCost as number;
    const hullArea = length * (beam + draft) * 0.85;
    const totalArea = hullArea * coats;
    const gallonsNeeded = totalArea / 350;
    const totalCost = Math.ceil(gallonsNeeded) * costPerGallon;
    return {
      primary: { label: "Paint Needed", value: formatNumber(Math.round(gallonsNeeded * 10) / 10) + " gallons" },
      details: [
        { label: "Hull Surface Area", value: formatNumber(Math.round(hullArea)) + " sq ft" },
        { label: "Total Coverage Area", value: formatNumber(Math.round(totalArea)) + " sq ft (" + coats + " coats)" },
        { label: "Gallons to Purchase", value: Math.ceil(gallonsNeeded) + " gallons" },
        { label: "Estimated Paint Cost", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  }`,
  [
    { q: "How often should I repaint the bottom of my boat?", a: "Most antifouling paints last one to two seasons depending on water temperature, salinity, and how often the boat is used. Boats kept in warm saltwater may need annual repainting." },
    { q: "How many coats of bottom paint do I need?", a: "Two coats are standard for most applications. Apply three coats on the waterline area and any leading edges that experience more wear. New boats or bare hulls may need a primer coat first." },
    { q: "What type of bottom paint should I use?", a: "Ablative paint wears away slowly and is ideal for boats used regularly. Hard modified epoxy paint is better for high-speed boats. Consult your marina for local environmental regulations on copper content." }
  ],
  `Hull Surface Area = Waterline Length x (Beam + Draft) x 0.85
Total Coverage Area = Hull Area x Number of Coats
Gallons Needed = Total Coverage Area / 350 sq ft per gallon`,
  ["marina-slip-cost-calculator", "boat-depreciation-calculator"]
);

add(
  "marine-battery-sizing-calculator",
  "Marine Battery Sizing Calculator",
  "Size your marine battery bank based on electrical loads, usage hours, and desired reserve capacity to ensure reliable power on the water.",
  "Science",
  "science",
  "A",
  ["marine battery sizing", "boat battery calculator", "battery bank amp hours", "marine electrical load"],
  [
    '{ name: "totalLoad", label: "Total Load (amps)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "usageHours", label: "Daily Usage (hours)", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "reservePercent", label: "Reserve Capacity (%)", type: "number", min: 10, max: 100, defaultValue: 50 }',
    '{ name: "batteryVoltage", label: "System Voltage", type: "select", options: [{ value: "12", label: "12V" }, { value: "24", label: "24V" }, { value: "48", label: "48V" }], defaultValue: "12" }',
    '{ name: "batteryType", label: "Battery Type", type: "select", options: [{ value: "0.5", label: "Lead Acid (50% DoD)" }, { value: "0.8", label: "AGM (80% DoD)" }, { value: "0.9", label: "Lithium (90% DoD)" }], defaultValue: "0.5" }'
  ],
  `(inputs) => {
    const load = inputs.totalLoad as number;
    const hours = inputs.usageHours as number;
    const reserve = inputs.reservePercent as number / 100;
    const voltage = parseFloat(inputs.batteryVoltage as string);
    const dod = parseFloat(inputs.batteryType as string);
    const dailyAh = load * hours;
    const withReserve = dailyAh * (1 + reserve);
    const requiredAh = dod > 0 ? withReserve / dod : withReserve;
    const watts = load * voltage;
    const kwhNeeded = (requiredAh * voltage) / 1000;
    return {
      primary: { label: "Battery Bank Size", value: formatNumber(Math.round(requiredAh)) + " Ah" },
      details: [
        { label: "Daily Consumption", value: formatNumber(Math.round(dailyAh)) + " Ah" },
        { label: "With Reserve", value: formatNumber(Math.round(withReserve)) + " Ah" },
        { label: "Total Load", value: formatNumber(Math.round(watts)) + " watts" },
        { label: "Energy Required", value: formatNumber(Math.round(kwhNeeded * 100) / 100) + " kWh" }
      ]
    };
  }`,
  [
    { q: "How do I size a marine battery bank?", a: "Calculate your total amp-hour consumption per day, add a reserve margin of 25 to 50 percent, then divide by the maximum depth of discharge for your battery type. Lead acid batteries should not be discharged below 50 percent, while lithium can safely go to 80 to 90 percent." },
    { q: "What type of marine battery is best?", a: "Lithium iron phosphate batteries offer the longest lifespan, lightest weight, and deepest discharge, but cost more upfront. AGM batteries are a good mid-range choice. Flooded lead acid batteries are the most affordable but require maintenance." },
    { q: "How long do marine batteries last?", a: "Flooded lead acid batteries last 2 to 4 years, AGM batteries 4 to 7 years, and lithium batteries 8 to 15 years depending on charge cycles and maintenance." }
  ],
  `Daily Amp-Hours = Total Load (amps) x Usage Hours
With Reserve = Daily Ah x (1 + Reserve %)
Battery Bank Size = With Reserve / Max Depth of Discharge`,
  ["marine-generator-sizing-calculator", "bilge-pump-sizing-calculator"]
);

add(
  "boat-trailer-weight-calculator",
  "Boat Trailer Weight Calculator",
  "Calculate the total tow weight of your boat, motor, trailer, and gear to determine if your tow vehicle can safely handle the load.",
  "Everyday",
  "everyday",
  "~",
  ["boat trailer weight", "tow weight calculator", "boat towing capacity", "trailer gross weight"],
  [
    '{ name: "boatWeight", label: "Boat Dry Weight (lbs)", type: "number", min: 200, max: 50000, defaultValue: 3500 }',
    '{ name: "motorWeight", label: "Engine Weight (lbs)", type: "number", min: 50, max: 3000, defaultValue: 400 }',
    '{ name: "trailerWeight", label: "Trailer Weight (lbs)", type: "number", min: 200, max: 10000, defaultValue: 1200 }',
    '{ name: "fuelGallons", label: "Fuel on Board (gallons)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "gearWeight", label: "Gear and Equipment (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "towCapacity", label: "Tow Vehicle Capacity (lbs)", type: "number", min: 1000, max: 30000, defaultValue: 7500 }'
  ],
  `(inputs) => {
    const boat = inputs.boatWeight as number;
    const motor = inputs.motorWeight as number;
    const trailer = inputs.trailerWeight as number;
    const fuel = inputs.fuelGallons as number * 6.3;
    const gear = inputs.gearWeight as number;
    const capacity = inputs.towCapacity as number;
    const totalWeight = boat + motor + trailer + fuel + gear;
    const tongueWeight = totalWeight * 0.1;
    const remaining = capacity - totalWeight;
    const withinCapacity = totalWeight <= capacity;
    return {
      primary: { label: "Total Tow Weight", value: formatNumber(Math.round(totalWeight)) + " lbs" },
      details: [
        { label: "Estimated Tongue Weight (10%)", value: formatNumber(Math.round(tongueWeight)) + " lbs" },
        { label: "Fuel Weight", value: formatNumber(Math.round(fuel)) + " lbs" },
        { label: "Remaining Capacity", value: formatNumber(Math.round(remaining)) + " lbs" },
        { label: "Within Tow Capacity", value: withinCapacity ? "Yes" : "No - Over Limit!" }
      ]
    };
  }`,
  [
    { q: "How do I calculate total boat tow weight?", a: "Add the dry weight of the boat, engine weight, trailer weight, fuel weight (about 6.3 pounds per gallon of gasoline), and all gear and equipment on board." },
    { q: "What should tongue weight be for a boat trailer?", a: "Tongue weight should be 7 to 11 percent of the total trailer weight for proper stability. Too little tongue weight causes trailer sway, while too much can overload the rear axle of the tow vehicle." },
    { q: "Can I tow my boat with an SUV?", a: "It depends on the SUV towing capacity. Most mid-size SUVs can tow 3,500 to 5,000 pounds, while full-size SUVs and trucks can handle 7,000 to 13,000 pounds or more. Always check your vehicle manual." }
  ],
  `Total Tow Weight = Boat Weight + Engine + Trailer + (Fuel Gallons x 6.3) + Gear
Tongue Weight = Total Weight x 10%
Remaining Capacity = Tow Vehicle Capacity - Total Weight`,
  ["boat-fuel-consumption-calculator", "boat-registration-cost-calculator"]
);

add(
  "scuba-tank-duration-calculator",
  "Scuba Tank Duration Calculator",
  "Estimate how long your scuba tank will last based on tank size, working pressure, depth, and your surface air consumption rate.",
  "Science",
  "science",
  "A",
  ["scuba tank duration", "air consumption rate", "dive time calculator", "scuba air supply"],
  [
    '{ name: "tankVolume", label: "Tank Volume (cubic feet)", type: "number", min: 19, max: 130, defaultValue: 80 }',
    '{ name: "tankPressure", label: "Starting Pressure (PSI)", type: "number", min: 1000, max: 4500, defaultValue: 3000 }',
    '{ name: "reservePressure", label: "Reserve Pressure (PSI)", type: "number", min: 300, max: 1000, defaultValue: 500 }',
    '{ name: "depth", label: "Dive Depth (feet)", type: "number", min: 10, max: 200, defaultValue: 60 }',
    '{ name: "sac", label: "Surface Air Consumption (cu ft/min)", type: "number", min: 0.3, max: 2.0, defaultValue: 0.75 }'
  ],
  `(inputs) => {
    const volume = inputs.tankVolume as number;
    const startPsi = inputs.tankPressure as number;
    const reservePsi = inputs.reservePressure as number;
    const depth = inputs.depth as number;
    const sac = inputs.sac as number;
    const ata = (depth / 33) + 1;
    const actualConsumption = sac * ata;
    const usablePsi = startPsi - reservePsi;
    const usableAir = volume * (usablePsi / startPsi);
    const diveTime = actualConsumption > 0 ? usableAir / actualConsumption : 0;
    return {
      primary: { label: "Estimated Dive Time", value: formatNumber(Math.round(diveTime)) + " minutes" },
      details: [
        { label: "Depth Pressure (ATA)", value: formatNumber(Math.round(ata * 100) / 100) },
        { label: "Air Consumption at Depth", value: formatNumber(Math.round(actualConsumption * 100) / 100) + " cu ft/min" },
        { label: "Usable Air Volume", value: formatNumber(Math.round(usableAir * 10) / 10) + " cu ft" },
        { label: "Reserve Air", value: formatNumber(Math.round(volume * (reservePsi / startPsi) * 10) / 10) + " cu ft" }
      ]
    };
  }`,
  [
    { q: "What is SAC rate in scuba diving?", a: "Surface Air Consumption (SAC) rate measures how much air you breathe per minute at the surface. Average SAC rates range from 0.5 to 1.0 cubic feet per minute. New divers tend to have higher SAC rates that improve with experience." },
    { q: "How deep can you go on a standard scuba tank?", a: "Recreational scuba limits are typically 60 feet for beginners and 130 feet for advanced open water certified divers. Air supply decreases faster at greater depths because pressure increases air consumption." },
    { q: "Why does air last less time at greater depths?", a: "At depth, water pressure compresses air so you breathe denser air with each breath. At 33 feet (2 ATA), you consume air twice as fast as at the surface. At 99 feet (4 ATA), four times as fast." }
  ],
  `ATA (Atmospheres Absolute) = (Depth / 33) + 1
Air Consumption at Depth = SAC Rate x ATA
Usable Air = Tank Volume x (Usable PSI / Starting PSI)
Dive Time = Usable Air / Consumption at Depth`,
  ["dive-decompression-calculator", "paddleboard-size-calculator"]
);

add(
  "dive-decompression-calculator",
  "Dive Decompression Calculator",
  "Estimate no-decompression limits and safety stop requirements based on dive depth and bottom time using recreational dive tables.",
  "Science",
  "science",
  "A",
  ["dive decompression", "no deco limit", "safety stop calculator", "dive table calculator"],
  [
    '{ name: "depth", label: "Maximum Depth (feet)", type: "number", min: 15, max: 190, defaultValue: 60 }',
    '{ name: "bottomTime", label: "Bottom Time (minutes)", type: "number", min: 5, max: 240, defaultValue: 30 }',
    '{ name: "safetyStop", label: "Safety Stop", type: "select", options: [{ value: "3", label: "Standard (3 min at 15 ft)" }, { value: "5", label: "Extended (5 min at 15 ft)" }], defaultValue: "3" }',
    '{ name: "surfaceInterval", label: "Surface Interval Before Next Dive (min)", type: "number", min: 0, max: 720, defaultValue: 60 }'
  ],
  `(inputs) => {
    const depth = inputs.depth as number;
    const bottomTime = inputs.bottomTime as number;
    const stopDuration = parseFloat(inputs.safetyStop as string);
    const surfaceInterval = inputs.surfaceInterval as number;
    const ndlTable = [[35, 205], [40, 140], [50, 80], [60, 55], [70, 40], [80, 30], [90, 25], [100, 20], [110, 16], [120, 13], [130, 10], [140, 8], [150, 7], [160, 6], [170, 5], [180, 4], [190, 3]];
    let ndl = 300;
    for (let i = 0; i < ndlTable.length; i++) {
      if (depth <= ndlTable[i][0]) { ndl = ndlTable[i][1]; break; }
    }
    const withinNdl = bottomTime <= ndl;
    const usedPercent = ndl > 0 ? Math.min(100, (bottomTime / ndl) * 100) : 100;
    const totalDiveTime = bottomTime + stopDuration + Math.round(depth / 30);
    const offgasCredit = Math.min(100, surfaceInterval / 6);
    return {
      primary: { label: "No-Deco Limit", value: formatNumber(ndl) + " minutes" },
      details: [
        { label: "Bottom Time Used", value: formatNumber(Math.round(usedPercent)) + "% of NDL" },
        { label: "Within No-Deco Limits", value: withinNdl ? "Yes" : "No - Deco Required" },
        { label: "Safety Stop", value: stopDuration + " min at 15 feet" },
        { label: "Total Dive Time (est.)", value: formatNumber(totalDiveTime) + " minutes" },
        { label: "Off-Gassing Credit", value: formatNumber(Math.round(offgasCredit)) + "%" }
      ]
    };
  }`,
  [
    { q: "What is a no-decompression limit?", a: "The no-decompression limit (NDL) is the maximum time you can spend at a given depth without requiring mandatory decompression stops during ascent. Exceeding the NDL requires staged stops to safely off-gas nitrogen." },
    { q: "Do I always need a safety stop?", a: "A safety stop at 15 feet for 3 minutes is strongly recommended on all dives deeper than 20 feet. While not mandatory for dives within no-deco limits, it provides an extra margin of safety." },
    { q: "How long should I wait between dives?", a: "A minimum surface interval of 60 minutes is recommended. For deeper or longer dives, wait at least 2 to 4 hours. Before flying, wait at least 12 hours after a single dive or 18 hours after repetitive dives." }
  ],
  `No-Deco Limit is based on standard recreational dive tables for depth
NDL Usage = (Bottom Time / NDL) x 100
Total Dive Time = Bottom Time + Safety Stop + Ascent Time`,
  ["scuba-tank-duration-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "fishing-rod-power-calculator",
  "Fishing Rod Power Calculator",
  "Determine the ideal fishing rod power, action, and line weight based on your target species, fishing technique, and water conditions.",
  "Everyday",
  "everyday",
  "~",
  ["fishing rod power", "rod selection guide", "fishing rod weight", "rod action calculator"],
  [
    '{ name: "targetWeight", label: "Target Fish Weight (lbs)", type: "number", min: 0.5, max: 500, defaultValue: 10 }',
    '{ name: "fishingStyle", label: "Fishing Style", type: "select", options: [{ value: "1", label: "Finesse / Light" }, { value: "2", label: "Casting / Jigging" }, { value: "3", label: "Trolling / Bottom" }, { value: "4", label: "Heavy Offshore" }], defaultValue: "2" }',
    '{ name: "waterType", label: "Water Type", type: "select", options: [{ value: "1", label: "Freshwater" }, { value: "2", label: "Inshore Saltwater" }, { value: "3", label: "Offshore Saltwater" }], defaultValue: "1" }',
    '{ name: "lureWeight", label: "Lure Weight (oz)", type: "number", min: 0.1, max: 32, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const fishWeight = inputs.targetWeight as number;
    const style = parseInt(inputs.fishingStyle as string);
    const water = parseInt(inputs.waterType as string);
    const lure = inputs.lureWeight as number;
    const powers = ["Ultra-Light", "Light", "Medium-Light", "Medium", "Medium-Heavy", "Heavy", "Extra-Heavy"];
    const actions = ["Slow", "Moderate", "Moderate-Fast", "Fast", "Extra-Fast"];
    let powerIdx = 0;
    if (fishWeight <= 2) powerIdx = 0;
    else if (fishWeight <= 5) powerIdx = 1;
    else if (fishWeight <= 10) powerIdx = 2;
    else if (fishWeight <= 20) powerIdx = 3;
    else if (fishWeight <= 40) powerIdx = 4;
    else if (fishWeight <= 100) powerIdx = 5;
    else powerIdx = 6;
    if (water === 3) powerIdx = Math.min(6, powerIdx + 1);
    const actionIdx = Math.min(4, Math.max(0, style));
    const lineMin = Math.max(2, Math.round(fishWeight * 0.8));
    const lineMax = Math.max(4, Math.round(fishWeight * 2.5));
    const rodLength = fishWeight <= 5 ? "5.5 - 6.5" : fishWeight <= 20 ? "6.5 - 7.5" : "7.0 - 9.0";
    return {
      primary: { label: "Recommended Rod Power", value: powers[powerIdx] },
      details: [
        { label: "Recommended Action", value: actions[actionIdx] },
        { label: "Line Weight Range", value: lineMin + " - " + lineMax + " lb test" },
        { label: "Suggested Rod Length", value: rodLength + " feet" },
        { label: "Lure Weight Rating", value: formatNumber(Math.round(lure * 0.5 * 10) / 10) + " - " + formatNumber(Math.round(lure * 2 * 10) / 10) + " oz" }
      ]
    };
  }`,
  [
    { q: "What rod power do I need for bass fishing?", a: "For largemouth bass, a medium to medium-heavy power rod is ideal. Use medium power for finesse techniques and lighter lures, and medium-heavy for flipping, pitching, and heavier baits like jigs and swimbaits." },
    { q: "What is the difference between rod power and action?", a: "Power refers to the overall stiffness of the rod and determines how much force is needed to bend it. Action describes where along the rod it bends - fast action bends near the tip while slow action bends throughout the rod." },
    { q: "Does water type affect rod selection?", a: "Yes. Saltwater fishing generally requires heavier rods due to larger fish, stronger currents, and corrosive conditions. Saltwater rods also need corrosion-resistant guides and reel seats." }
  ],
  `Rod Power is matched to target fish weight and fishing conditions
Line Weight Range = Fish Weight x 0.8 to Fish Weight x 2.5
Rod power increases with fish size, water type, and structure density`,
  ["fishing-lure-weight-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "boat-insurance-cost-calculator",
  "Boat Insurance Cost Calculator",
  "Estimate your annual boat insurance premium based on boat value, type, usage, experience, and coverage level.",
  "Finance",
  "finance",
  "$",
  ["boat insurance cost", "marine insurance calculator", "boat insurance premium", "watercraft insurance"],
  [
    '{ name: "boatValue", label: "Boat Value ($)", type: "number", min: 1000, max: 5000000, defaultValue: 45000 }',
    '{ name: "boatType", label: "Boat Type", type: "select", options: [{ value: "1.0", label: "Sailboat" }, { value: "1.2", label: "Bowrider / Deck" }, { value: "1.4", label: "Pontoon" }, { value: "1.5", label: "Center Console" }, { value: "1.8", label: "Performance / Speed" }, { value: "2.0", label: "Yacht (40+ ft)" }], defaultValue: "1.2" }',
    '{ name: "experience", label: "Years of Boating Experience", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "deductible", label: "Deductible ($)", type: "number", min: 250, max: 25000, defaultValue: 1000 }',
    '{ name: "navigation", label: "Navigation Area", type: "select", options: [{ value: "1.0", label: "Inland / Lakes" }, { value: "1.3", label: "Coastal (nearshore)" }, { value: "1.6", label: "Offshore / Ocean" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const value = inputs.boatValue as number;
    const typeMult = parseFloat(inputs.boatType as string);
    const experience = inputs.experience as number;
    const deductible = inputs.deductible as number;
    const navMult = parseFloat(inputs.navigation as string);
    const baseRate = 0.015;
    const expDiscount = Math.min(0.3, experience * 0.03);
    const deductDiscount = Math.min(0.2, (deductible - 250) / 25000 * 0.2);
    const annualPremium = value * baseRate * typeMult * navMult * (1 - expDiscount) * (1 - deductDiscount);
    const monthlyPremium = annualPremium / 12;
    const premiumPerFoot = annualPremium / 30;
    return {
      primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(annualPremium)) },
      details: [
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyPremium)) },
        { label: "Experience Discount", value: formatNumber(Math.round(expDiscount * 100)) + "%" },
        { label: "Deductible Discount", value: formatNumber(Math.round(deductDiscount * 100)) + "%" },
        { label: "Rate as % of Value", value: formatNumber(Math.round((annualPremium / value) * 10000) / 100) + "%" }
      ]
    };
  }`,
  [
    { q: "How much does boat insurance cost?", a: "Boat insurance typically costs 1 to 3 percent of the boat value per year. A $30,000 boat might cost $300 to $900 annually. Factors include boat type, usage area, experience, and coverage level." },
    { q: "What does boat insurance cover?", a: "Standard policies cover hull damage, theft, liability, medical payments, and sometimes towing and salvage. Some policies also cover personal property, fuel spills, and uninsured boater coverage." },
    { q: "Do I need boat insurance if I only use lakes?", a: "While not legally required in most states for lake use, boat insurance is strongly recommended. Liability from accidents, storms, and theft can result in significant financial exposure." }
  ],
  `Base Premium = Boat Value x Base Rate (1.5%)
Adjusted Premium = Base Premium x Boat Type Factor x Navigation Factor
Final Premium = Adjusted Premium x (1 - Experience Discount) x (1 - Deductible Discount)`,
  ["boat-depreciation-calculator", "marina-slip-cost-calculator"]
);

add(
  "jet-ski-cost-per-hour-calculator",
  "Jet Ski Cost Per Hour Calculator",
  "Calculate the true cost per hour of jet ski ownership including purchase price, maintenance, insurance, fuel, and storage costs.",
  "Finance",
  "finance",
  "$",
  ["jet ski cost per hour", "pwc operating cost", "jet ski expense", "personal watercraft cost"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 2000, max: 30000, defaultValue: 12000 }',
    '{ name: "yearsOwned", label: "Expected Years of Ownership", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "hoursPerYear", label: "Hours Used Per Year", type: "number", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "fuelCostPerHour", label: "Fuel Cost Per Hour ($)", type: "number", min: 5, max: 60, defaultValue: 20 }',
    '{ name: "annualInsurance", label: "Annual Insurance ($)", type: "number", min: 100, max: 2000, defaultValue: 350 }',
    '{ name: "annualStorage", label: "Annual Storage ($)", type: "number", min: 0, max: 5000, defaultValue: 600 }',
    '{ name: "annualMaintenance", label: "Annual Maintenance ($)", type: "number", min: 100, max: 5000, defaultValue: 400 }'
  ],
  `(inputs) => {
    const price = inputs.purchasePrice as number;
    const years = inputs.yearsOwned as number;
    const hoursYear = inputs.hoursPerYear as number;
    const fuelPerHour = inputs.fuelCostPerHour as number;
    const insurance = inputs.annualInsurance as number;
    const storage = inputs.annualStorage as number;
    const maintenance = inputs.annualMaintenance as number;
    const totalHours = hoursYear * years;
    const resaleValue = price * Math.pow(0.85, years);
    const depreciation = price - resaleValue;
    const annualFixed = insurance + storage + maintenance;
    const annualFuel = fuelPerHour * hoursYear;
    const annualTotal = (depreciation / years) + annualFixed + annualFuel;
    const costPerHour = hoursYear > 0 ? annualTotal / hoursYear : 0;
    return {
      primary: { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
      details: [
        { label: "Annual Total Cost", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Annual Depreciation", value: "$" + formatNumber(Math.round(depreciation / years)) },
        { label: "Annual Fixed Costs", value: "$" + formatNumber(Math.round(annualFixed)) },
        { label: "Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuel)) },
        { label: "Estimated Resale Value", value: "$" + formatNumber(Math.round(resaleValue)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to own a jet ski per year?", a: "Annual jet ski ownership costs typically range from $1,500 to $4,000 including insurance, storage, maintenance, and fuel. This does not include the purchase price or depreciation." },
    { q: "How many hours does a jet ski engine last?", a: "Most modern jet ski engines last 300 to 500 hours with proper maintenance. Some 4-stroke models can exceed 500 hours. Regular oil changes, impeller inspections, and winterization extend engine life." },
    { q: "Is it cheaper to rent or buy a jet ski?", a: "If you ride fewer than 30 to 40 hours per year, renting at $75 to $150 per hour is usually cheaper than owning. If you ride more frequently, ownership becomes more economical over time." }
  ],
  `Annual Depreciation = (Purchase Price - Resale Value) / Years
Annual Total = Depreciation + Insurance + Storage + Maintenance + Fuel
Cost Per Hour = Annual Total / Hours Per Year`,
  ["boat-fuel-consumption-calculator", "boat-insurance-cost-calculator"]
);

add(
  "boat-winterization-cost-calculator",
  "Boat Winterization Cost Calculator",
  "Estimate the cost to winterize your boat based on engine type, number of engines, and whether you choose professional or DIY service.",
  "Finance",
  "finance",
  "$",
  ["boat winterization cost", "winterize boat", "boat winter storage", "boat seasonal maintenance"],
  [
    '{ name: "engineType", label: "Engine Type", type: "select", options: [{ value: "1", label: "Outboard" }, { value: "2", label: "Inboard/Stern Drive" }, { value: "3", label: "Inboard Diesel" }], defaultValue: "1" }',
    '{ name: "numEngines", label: "Number of Engines", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1.0", label: "DIY" }, { value: "2.5", label: "Professional" }], defaultValue: "2.5" }',
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 12, max: 100, defaultValue: 24 }',
    '{ name: "shrinkWrap", label: "Shrink Wrap", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const engineType = parseInt(inputs.engineType as string);
    const numEngines = inputs.numEngines as number;
    const serviceMult = parseFloat(inputs.serviceType as string);
    const length = inputs.boatLength as number;
    const wrap = parseInt(inputs.shrinkWrap as string);
    const engineCosts = [150, 250, 350];
    const baseCost = engineCosts[engineType - 1] * numEngines;
    const fuelStabilizer = 15;
    const antifreeze = 25 * numEngines;
    const oilChange = (engineType === 1 ? 40 : 80) * numEngines;
    const wrapCost = wrap === 1 ? length * 12 : 0;
    const materialCost = baseCost + fuelStabilizer + antifreeze + oilChange;
    const totalCost = materialCost * serviceMult + wrapCost;
    return {
      primary: { label: "Total Winterization Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Engine Service", value: "$" + formatNumber(Math.round(baseCost * serviceMult)) },
        { label: "Oil Change", value: "$" + formatNumber(Math.round(oilChange * serviceMult)) },
        { label: "Antifreeze and Stabilizer", value: "$" + formatNumber(Math.round((antifreeze + fuelStabilizer) * serviceMult)) },
        { label: "Shrink Wrap", value: wrapCost > 0 ? "$" + formatNumber(Math.round(wrapCost)) : "None" },
        { label: "Service Type", value: serviceMult > 1 ? "Professional" : "DIY" }
      ]
    };
  }`,
  [
    { q: "When should I winterize my boat?", a: "Winterize your boat before the first hard freeze, typically in October or November depending on your region. Engine damage from frozen water can be extremely costly to repair." },
    { q: "What does boat winterization include?", a: "Winterization includes draining and flushing the cooling system, fogging the engine, changing oil and filters, adding fuel stabilizer, draining water systems, disconnecting batteries, and covering or shrink-wrapping the boat." },
    { q: "Can I winterize my boat myself?", a: "Yes, DIY winterization is possible with basic mechanical skills. You will need antifreeze, fogging oil, fuel stabilizer, and oil change supplies. Outboard engines are the easiest to winterize yourself." }
  ],
  `Engine Service Cost = Base Cost per Engine x Number of Engines
Material Cost = Engine Service + Fuel Stabilizer + Antifreeze + Oil Change
Total Cost = Material Cost x Service Multiplier + Shrink Wrap Cost`,
  ["boat-engine-hours-maintenance-calculator", "marina-slip-cost-calculator"]
);

add(
  "marine-generator-sizing-calculator",
  "Marine Generator Sizing Calculator",
  "Size your marine generator based on onboard electrical loads including air conditioning, appliances, and electronics to ensure adequate power output.",
  "Science",
  "science",
  "A",
  ["marine generator sizing", "boat generator calculator", "onboard power", "marine genset size"],
  [
    '{ name: "acLoad", label: "Air Conditioning (watts)", type: "number", min: 0, max: 30000, defaultValue: 5000 }',
    '{ name: "waterHeater", label: "Water Heater (watts)", type: "number", min: 0, max: 5000, defaultValue: 1500 }',
    '{ name: "appliances", label: "Kitchen Appliances (watts)", type: "number", min: 0, max: 5000, defaultValue: 1200 }',
    '{ name: "electronics", label: "Electronics and Lighting (watts)", type: "number", min: 50, max: 3000, defaultValue: 500 }',
    '{ name: "batteryCharger", label: "Battery Charger (watts)", type: "number", min: 0, max: 5000, defaultValue: 800 }',
    '{ name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 10, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const ac = inputs.acLoad as number;
    const heater = inputs.waterHeater as number;
    const appliances = inputs.appliances as number;
    const electronics = inputs.electronics as number;
    const charger = inputs.batteryCharger as number;
    const margin = inputs.safetyMargin as number / 100;
    const totalLoad = ac + heater + appliances + electronics + charger;
    const withMargin = totalLoad * (1 + margin);
    const kw = withMargin / 1000;
    const fuelPerHour = kw * 0.08;
    const amps120 = withMargin / 120;
    return {
      primary: { label: "Minimum Generator Size", value: formatNumber(Math.round(kw * 10) / 10) + " kW" },
      details: [
        { label: "Total Electrical Load", value: formatNumber(Math.round(totalLoad)) + " watts" },
        { label: "With Safety Margin", value: formatNumber(Math.round(withMargin)) + " watts" },
        { label: "Estimated Current Draw", value: formatNumber(Math.round(amps120 * 10) / 10) + " amps at 120V" },
        { label: "Estimated Fuel Usage", value: formatNumber(Math.round(fuelPerHour * 100) / 100) + " gal/hr" }
      ]
    };
  }`,
  [
    { q: "How do I size a marine generator?", a: "Add up the wattage of all electrical loads that may run simultaneously, then add a 20 to 25 percent safety margin. Generator size is rated in kilowatts, so divide the total watts by 1,000." },
    { q: "Can a generator run air conditioning on a boat?", a: "Yes, but air conditioning is typically the largest load on a boat. A single 12,000 BTU marine AC unit draws about 1,200 to 1,500 watts. Most boats with AC need a generator of 5 kW or larger." },
    { q: "How much fuel does a marine generator use?", a: "Marine generators typically consume 0.06 to 0.1 gallons per kilowatt hour. A 6 kW generator running at 50 percent load uses roughly 0.25 to 0.3 gallons per hour." }
  ],
  `Total Load = AC + Water Heater + Appliances + Electronics + Battery Charger
With Safety Margin = Total Load x (1 + Safety Margin %)
Generator Size (kW) = Total Load with Margin / 1000`,
  ["marine-battery-sizing-calculator", "bilge-pump-sizing-calculator"]
);

add(
  "bilge-pump-sizing-calculator",
  "Bilge Pump Sizing Calculator",
  "Determine the right bilge pump capacity for your boat based on hull size, number of through-hull fittings, and worst-case flooding scenarios.",
  "Science",
  "science",
  "A",
  ["bilge pump sizing", "boat bilge pump capacity", "marine bilge pump", "bilge pump GPH"],
  [
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 100, defaultValue: 25 }',
    '{ name: "boatBeam", label: "Beam (feet)", type: "number", min: 4, max: 30, defaultValue: 8 }',
    '{ name: "throughHulls", label: "Number of Through-Hull Fittings", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "hullType", label: "Hull Type", type: "select", options: [{ value: "1.0", label: "Flat Bottom" }, { value: "1.2", label: "Modified V" }, { value: "1.4", label: "Deep V" }], defaultValue: "1.2" }',
    '{ name: "pumpHead", label: "Discharge Height (feet)", type: "number", min: 1, max: 10, defaultValue: 3 }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const beam = inputs.boatBeam as number;
    const throughHulls = inputs.throughHulls as number;
    const hullFactor = parseFloat(inputs.hullType as string);
    const head = inputs.pumpHead as number;
    const bilgeVolume = length * beam * 0.5 * hullFactor;
    const minGPH = bilgeVolume * 5 * (1 + throughHulls * 0.1);
    const headLoss = minGPH * (head * 0.05);
    const requiredGPH = minGPH + headLoss;
    const standardSizes = [500, 800, 1000, 1500, 2000, 3000, 3700, 4000];
    let recommended = 4000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= requiredGPH) { recommended = standardSizes[i]; break; }
    }
    return {
      primary: { label: "Recommended Pump Size", value: formatNumber(recommended) + " GPH" },
      details: [
        { label: "Minimum Required Flow", value: formatNumber(Math.round(requiredGPH)) + " GPH" },
        { label: "Estimated Bilge Volume", value: formatNumber(Math.round(bilgeVolume)) + " gallons" },
        { label: "Head Loss Deduction", value: formatNumber(Math.round(headLoss)) + " GPH" },
        { label: "Through-Hull Risk Factor", value: formatNumber(throughHulls) + " fittings" }
      ]
    };
  }`,
  [
    { q: "How do I choose a bilge pump size?", a: "Select a bilge pump that can handle at least the volume of your bilge area times 5 per hour. Consider the discharge head height, as pump capacity drops significantly with increased vertical lift." },
    { q: "Should I have two bilge pumps?", a: "Yes, the Coast Guard recommends a primary automatic bilge pump and a secondary manual backup. Larger boats should have an additional high-water alarm and a secondary automatic pump." },
    { q: "How much capacity do bilge pumps lose at height?", a: "Bilge pumps lose 5 to 10 percent of their rated capacity for every foot of vertical lift. A pump rated at 2,000 GPH at zero head may only deliver 1,400 GPH at a 4-foot discharge height." }
  ],
  `Bilge Volume = Length x Beam x 0.5 x Hull Factor
Minimum GPH = Bilge Volume x 5 x (1 + Through-Hulls x 0.1)
Head Loss = Minimum GPH x (Discharge Height x 5%)
Required GPH = Minimum GPH + Head Loss`,
  ["marine-generator-sizing-calculator", "marine-battery-sizing-calculator"]
);

add(
  "boat-canvas-cover-cost-calculator",
  "Boat Canvas Cover Cost Calculator",
  "Estimate the cost of a custom boat canvas cover or top based on boat size, cover type, material quality, and installation options.",
  "Finance",
  "finance",
  "$",
  ["boat cover cost", "marine canvas cost", "bimini top cost", "boat enclosure price"],
  [
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 10, max: 80, defaultValue: 22 }',
    '{ name: "coverType", label: "Cover Type", type: "select", options: [{ value: "1", label: "Mooring Cover" }, { value: "2", label: "Bimini Top" }, { value: "3", label: "Full Enclosure" }, { value: "4", label: "T-Top" }], defaultValue: "1" }',
    '{ name: "material", label: "Material Grade", type: "select", options: [{ value: "1.0", label: "Economy Polyester" }, { value: "1.5", label: "Sunbrella Marine" }, { value: "2.0", label: "Stamoid Premium" }], defaultValue: "1.5" }',
    '{ name: "installation", label: "Installation", type: "select", options: [{ value: "0", label: "Self Install" }, { value: "300", label: "Professional ($300)" }, { value: "600", label: "Professional with Frame ($600)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const coverType = parseInt(inputs.coverType as string);
    const materialMult = parseFloat(inputs.material as string);
    const installCost = parseFloat(inputs.installation as string);
    const baseCosts = [0, 15, 25, 40, 45];
    const basePerFoot = baseCosts[coverType];
    const coverCost = length * basePerFoot * materialMult;
    const totalCost = coverCost + installCost;
    const lifespanYears = materialMult >= 2.0 ? 10 : materialMult >= 1.5 ? 7 : 4;
    const annualCost = totalCost / lifespanYears;
    return {
      primary: { label: "Estimated Cover Cost", value: "$" + formatNumber(Math.round(coverCost)) },
      details: [
        { label: "Installation Cost", value: installCost > 0 ? "$" + formatNumber(installCost) : "Self Install" },
        { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Lifespan", value: lifespanYears + " years" },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    { q: "How much does a boat cover cost?", a: "Boat covers range from $200 to $2,000 or more depending on boat size, cover type, and material quality. Custom Sunbrella covers for a 22-foot boat typically cost $400 to $800." },
    { q: "What is the best material for a boat cover?", a: "Sunbrella marine canvas is the industry standard, offering excellent UV protection, water resistance, and breathability. It typically lasts 7 to 10 years. Stamoid is a premium PVC-coated polyester used for high-end applications." },
    { q: "How long does a boat cover last?", a: "Economy polyester covers last 3 to 5 years. Sunbrella marine canvas lasts 7 to 10 years. Premium PVC-coated materials can last 10 or more years with proper care and UV protectant treatment." }
  ],
  `Cover Cost = Boat Length x Base Cost Per Foot x Material Multiplier
Total Cost = Cover Cost + Installation Cost
Annual Cost = Total Cost / Expected Lifespan`,
  ["marina-slip-cost-calculator", "boat-winterization-cost-calculator"]
);

add(
  "fishing-lure-weight-calculator",
  "Fishing Lure Weight Calculator",
  "Calculate the optimal lure weight and casting distance based on your rod rating, reel type, line weight, and wind conditions.",
  "Everyday",
  "everyday",
  "~",
  ["fishing lure weight", "casting distance calculator", "lure selection", "fishing tackle weight"],
  [
    '{ name: "rodMaxLure", label: "Rod Max Lure Rating (oz)", type: "number", min: 0.1, max: 16, defaultValue: 1.0 }',
    '{ name: "rodMinLure", label: "Rod Min Lure Rating (oz)", type: "number", min: 0.05, max: 8, defaultValue: 0.25 }',
    '{ name: "lineWeight", label: "Line Weight (lb test)", type: "number", min: 2, max: 100, defaultValue: 10 }',
    '{ name: "lureWeight", label: "Your Lure Weight (oz)", type: "number", min: 0.05, max: 16, defaultValue: 0.5 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 5 }'
  ],
  `(inputs) => {
    const maxLure = inputs.rodMaxLure as number;
    const minLure = inputs.rodMinLure as number;
    const line = inputs.lineWeight as number;
    const lure = inputs.lureWeight as number;
    const wind = inputs.windSpeed as number;
    const inRange = lure >= minLure && lure <= maxLure;
    const optimalWeight = (maxLure + minLure) / 2;
    const baseDistance = lure * 80;
    const windPenalty = wind * 0.8;
    const linePenalty = line > 12 ? (line - 12) * 0.5 : 0;
    const castDistance = Math.max(10, baseDistance - windPenalty - linePenalty);
    const matchPercent = inRange ? Math.round(100 - Math.abs(lure - optimalWeight) / optimalWeight * 100) : 0;
    return {
      primary: { label: "Lure Match", value: inRange ? matchPercent + "% Optimal" : "Out of Range" },
      details: [
        { label: "Rod Lure Range", value: minLure + " - " + maxLure + " oz" },
        { label: "Optimal Lure Weight", value: formatNumber(Math.round(optimalWeight * 100) / 100) + " oz" },
        { label: "Estimated Cast Distance", value: formatNumber(Math.round(castDistance)) + " feet" },
        { label: "Within Rod Rating", value: inRange ? "Yes" : "No" },
        { label: "Wind Effect", value: wind > 15 ? "Significant" : wind > 5 ? "Moderate" : "Minimal" }
      ]
    };
  }`,
  [
    { q: "Does lure weight affect casting distance?", a: "Yes, heavier lures cast farther because they have more momentum. However, using a lure heavier than your rod rating can stress or damage the rod. Stay within the rated lure weight range printed on your rod." },
    { q: "How do I match lure weight to my rod?", a: "Check the lure weight rating printed on your rod blank near the handle. The optimal casting performance is usually in the middle of the rated range. Lures at the extremes of the range sacrifice accuracy or distance." },
    { q: "How does wind affect lure selection?", a: "In windy conditions, use slightly heavier lures and more aerodynamic shapes to maintain casting distance and accuracy. Wind can reduce casting distance by 10 to 30 percent depending on speed and direction." }
  ],
  `Optimal Lure Weight = (Min Rating + Max Rating) / 2
Cast Distance = Lure Weight x 80 - Wind Penalty - Line Penalty
Match % = 100 - |Lure Weight - Optimal| / Optimal x 100`,
  ["fishing-rod-power-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "paddleboard-size-calculator",
  "Paddleboard Size Calculator",
  "Find the right stand-up paddleboard dimensions based on your weight, skill level, and paddling style for optimal stability and performance.",
  "Everyday",
  "everyday",
  "~",
  ["paddleboard size", "SUP size guide", "paddleboard volume", "stand up paddle board dimensions"],
  [
    '{ name: "riderWeight", label: "Rider Weight (lbs)", type: "number", min: 50, max: 400, defaultValue: 170 }',
    '{ name: "skillLevel", label: "Skill Level", type: "select", options: [{ value: "1.2", label: "Beginner" }, { value: "1.0", label: "Intermediate" }, { value: "0.85", label: "Advanced" }], defaultValue: "1.2" }',
    '{ name: "paddleStyle", label: "Paddling Style", type: "select", options: [{ value: "1", label: "All-Around" }, { value: "2", label: "Touring" }, { value: "3", label: "Surfing" }, { value: "4", label: "Yoga / Fitness" }, { value: "5", label: "Racing" }], defaultValue: "1" }',
    '{ name: "gearWeight", label: "Gear Weight (lbs)", type: "number", min: 0, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const weight = inputs.riderWeight as number;
    const skill = parseFloat(inputs.skillLevel as string);
    const style = parseInt(inputs.paddleStyle as string);
    const gear = inputs.gearWeight as number;
    const totalWeight = weight + gear;
    const volumeMultiplier = skill * (style === 4 ? 1.15 : style === 3 ? 0.9 : 1.0);
    const volume = Math.round(totalWeight * volumeMultiplier);
    const widths = [0, 32, 30, 29, 34, 27];
    const boardWidth = widths[style];
    const boardLength = style === 2 ? 12.5 : style === 3 ? 9.0 : style === 5 ? 14.0 : style === 4 ? 10.5 : totalWeight > 200 ? 11.0 : 10.5;
    const thickness = totalWeight > 200 ? 6 : 5;
    const capacityLbs = volume * 1.0;
    return {
      primary: { label: "Recommended Volume", value: formatNumber(volume) + " liters" },
      details: [
        { label: "Board Length", value: boardLength + " feet" },
        { label: "Board Width", value: boardWidth + " inches" },
        { label: "Board Thickness", value: thickness + " inches" },
        { label: "Total Rider + Gear Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Weight Capacity", value: formatNumber(capacityLbs) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How do I choose the right paddleboard size?", a: "Your paddleboard volume in liters should roughly equal your body weight in pounds, adjusted for skill level. Beginners need 10 to 20 percent more volume for stability, while advanced paddlers can use less." },
    { q: "What width paddleboard do I need?", a: "Wider boards (32 to 34 inches) are more stable for beginners and yoga. Touring boards are typically 30 to 31 inches. Surfing SUPs are 28 to 30 inches. Racing boards are narrow at 25 to 28 inches." },
    { q: "Does board thickness matter?", a: "Yes, thicker boards (6 inches) support more weight and perform better with heavier riders. Standard 5-inch boards work well for riders under 200 pounds. Inflatable boards should always be 6 inches for rigidity." }
  ],
  `Volume (liters) = (Rider Weight + Gear) x Skill Multiplier x Style Factor
Board dimensions are selected based on paddling style and weight class
Beginners: add 20% volume | Advanced: subtract 15% volume`,
  ["scuba-tank-duration-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "boat-registration-cost-calculator",
  "Boat Registration Cost Calculator",
  "Estimate your boat registration and titling fees based on boat length, type, engine size, and state of registration.",
  "Finance",
  "finance",
  "$",
  ["boat registration cost", "boat title fees", "vessel registration", "boat license cost"],
  [
    '{ name: "boatLength", label: "Boat Length (feet)", type: "number", min: 8, max: 200, defaultValue: 22 }',
    '{ name: "boatType", label: "Boat Type", type: "select", options: [{ value: "1.0", label: "Non-Motorized" }, { value: "1.2", label: "Motorized (under 50 HP)" }, { value: "1.5", label: "Motorized (50-200 HP)" }, { value: "1.8", label: "Motorized (over 200 HP)" }], defaultValue: "1.5" }',
    '{ name: "boatAge", label: "Boat Age (years)", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "registrationPeriod", label: "Registration Period", type: "select", options: [{ value: "1", label: "1 Year" }, { value: "2", label: "2 Years" }, { value: "3", label: "3 Years" }], defaultValue: "2" }',
    '{ name: "titleFee", label: "Title Fee ($)", type: "number", min: 5, max: 200, defaultValue: 15 }'
  ],
  `(inputs) => {
    const length = inputs.boatLength as number;
    const typeMult = parseFloat(inputs.boatType as string);
    const age = inputs.boatAge as number;
    const period = parseInt(inputs.registrationPeriod as string);
    const title = inputs.titleFee as number;
    let baseFee = 0;
    if (length <= 16) baseFee = 25;
    else if (length <= 26) baseFee = 40;
    else if (length <= 40) baseFee = 65;
    else if (length <= 65) baseFee = 100;
    else baseFee = 150;
    const regFee = baseFee * typeMult * period;
    const ageSurcharge = age <= 1 ? 15 : 0;
    const totalCost = regFee + title + ageSurcharge;
    const perYear = totalCost / period;
    return {
      primary: { label: "Total Registration Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Base Registration Fee", value: "$" + formatNumber(Math.round(regFee)) },
        { label: "Title Fee", value: "$" + formatNumber(title) },
        { label: "New Boat Surcharge", value: ageSurcharge > 0 ? "$" + formatNumber(ageSurcharge) : "N/A" },
        { label: "Cost Per Year", value: "$" + formatNumber(Math.round(perYear)) },
        { label: "Registration Period", value: period + " year(s)" }
      ]
    };
  }`,
  [
    { q: "How much does it cost to register a boat?", a: "Boat registration fees vary by state and range from $15 to over $300 depending on boat length, type, and engine size. Most states charge between $25 and $100 for typical recreational boats." },
    { q: "Do I need to register a kayak or canoe?", a: "Requirements vary by state. Many states exempt non-motorized vessels under a certain length. Some states require registration for all vessels, while others only require a launch permit or sticker." },
    { q: "How often do I renew boat registration?", a: "Most states offer annual or biennial (every 2 years) registration. Some states offer 3-year options. Registration typically expires on a fixed date regardless of when you register." }
  ],
  `Base Fee is determined by boat length bracket
Registration Fee = Base Fee x Boat Type Multiplier x Registration Period
Total Cost = Registration Fee + Title Fee + Surcharges`,
  ["boat-insurance-cost-calculator", "boat-trailer-weight-calculator"]
);

add(
  "marine-radio-range-calculator",
  "Marine Radio Range Calculator",
  "Estimate the effective communication range of your marine VHF radio based on antenna height, power output, and receiving station height.",
  "Science",
  "science",
  "A",
  ["marine radio range", "VHF range calculator", "marine antenna height", "radio line of sight"],
  [
    '{ name: "txAntennaHeight", label: "Your Antenna Height (feet)", type: "number", min: 3, max: 150, defaultValue: 15 }',
    '{ name: "rxAntennaHeight", label: "Other Station Antenna Height (feet)", type: "number", min: 3, max: 500, defaultValue: 50 }',
    '{ name: "power", label: "Transmit Power", type: "select", options: [{ value: "1", label: "1 Watt (Low)" }, { value: "5", label: "5 Watts (Handheld)" }, { value: "25", label: "25 Watts (Fixed Mount)" }], defaultValue: "25" }',
    '{ name: "conditions", label: "Atmospheric Conditions", type: "select", options: [{ value: "1.0", label: "Normal" }, { value: "1.15", label: "Favorable (ducting)" }, { value: "0.8", label: "Degraded (rain/fog)" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const txH = inputs.txAntennaHeight as number;
    const rxH = inputs.rxAntennaHeight as number;
    const power = parseInt(inputs.power as string);
    const condFactor = parseFloat(inputs.conditions as string);
    const txRange = 1.42 * Math.sqrt(txH);
    const rxRange = 1.42 * Math.sqrt(rxH);
    const lineOfSight = (txRange + rxRange) * condFactor;
    const effectiveRange = Math.min(lineOfSight, power === 1 ? 5 : power === 5 ? 12 : lineOfSight);
    const boatToBoat = 1.42 * Math.sqrt(txH) * 2 * condFactor;
    return {
      primary: { label: "Estimated Range", value: formatNumber(Math.round(effectiveRange * 10) / 10) + " nautical miles" },
      details: [
        { label: "Line of Sight Distance", value: formatNumber(Math.round(lineOfSight * 10) / 10) + " NM" },
        { label: "Your Horizon Distance", value: formatNumber(Math.round(txRange * 10) / 10) + " NM" },
        { label: "Other Station Horizon", value: formatNumber(Math.round(rxRange * 10) / 10) + " NM" },
        { label: "Boat-to-Boat Range (same height)", value: formatNumber(Math.round(boatToBoat * 10) / 10) + " NM" },
        { label: "Transmit Power", value: power + " watts" }
      ]
    };
  }`,
  [
    { q: "How far can a marine VHF radio reach?", a: "VHF marine radio range depends primarily on antenna height, not power. A typical 25-watt fixed-mount radio on a sailboat with a 15-foot antenna can reach about 5 to 8 nautical miles to another boat, or 15 to 20 miles to a coast guard tower." },
    { q: "Does antenna height affect radio range?", a: "Yes, antenna height is the most important factor in VHF range because VHF signals travel in straight lines. Doubling the antenna height increases range by about 40 percent. This is why tall mast-mounted antennas perform much better." },
    { q: "What VHF channel should I use for emergencies?", a: "Channel 16 (156.800 MHz) is the international distress, safety, and calling frequency. All mariners should monitor Channel 16 at all times while underway. Use it only for distress calls and initial contact." }
  ],
  `Horizon Distance = 1.42 x Square Root of Antenna Height (feet)
Line of Sight Range = Your Horizon + Other Station Horizon
Range is also limited by transmit power and atmospheric conditions`,
  ["marine-battery-sizing-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "boat-depreciation-calculator",
  "Boat Depreciation Calculator",
  "Calculate your boat depreciation and current market value based on purchase price, age, condition, and type using standard marine depreciation curves.",
  "Finance",
  "finance",
  "$",
  ["boat depreciation", "boat value calculator", "marine depreciation", "used boat value"],
  [
    '{ name: "purchasePrice", label: "Original Purchase Price ($)", type: "number", min: 1000, max: 5000000, defaultValue: 50000 }',
    '{ name: "boatAge", label: "Current Age (years)", type: "number", min: 0, max: 40, defaultValue: 5 }',
    '{ name: "condition", label: "Condition", type: "select", options: [{ value: "0.85", label: "Excellent" }, { value: "0.75", label: "Good" }, { value: "0.65", label: "Fair" }, { value: "0.50", label: "Poor" }], defaultValue: "0.75" }',
    '{ name: "boatType", label: "Boat Type", type: "select", options: [{ value: "0.12", label: "Runabout / Bowrider" }, { value: "0.10", label: "Center Console" }, { value: "0.08", label: "Sailboat" }, { value: "0.15", label: "Pontoon" }, { value: "0.18", label: "Jet Ski / PWC" }], defaultValue: "0.12" }',
    '{ name: "engineHours", label: "Engine Hours", type: "number", min: 0, max: 10000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const price = inputs.purchasePrice as number;
    const age = inputs.boatAge as number;
    const condition = parseFloat(inputs.condition as string);
    const depRate = parseFloat(inputs.boatType as string);
    const hours = inputs.engineHours as number;
    const baseValue = price * Math.pow(1 - depRate, age);
    const hoursAdjust = hours > 500 ? 0.95 : hours > 1000 ? 0.88 : 1.0;
    const currentValue = baseValue * condition * hoursAdjust;
    const totalDepreciation = price - currentValue;
    const depPercent = (totalDepreciation / price) * 100;
    const annualDep = age > 0 ? totalDepreciation / age : price * depRate;
    const fiveYearValue = price * Math.pow(1 - depRate, 5) * condition;
    return {
      primary: { label: "Estimated Current Value", value: "$" + formatNumber(Math.round(currentValue)) },
      details: [
        { label: "Total Depreciation", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Depreciation Percentage", value: formatNumber(Math.round(depPercent)) + "%" },
        { label: "Average Annual Depreciation", value: "$" + formatNumber(Math.round(annualDep)) },
        { label: "5-Year Value Estimate", value: "$" + formatNumber(Math.round(fiveYearValue)) },
        { label: "Value Retained", value: formatNumber(Math.round(100 - depPercent)) + "%" }
      ]
    };
  }`,
  [
    { q: "How fast do boats depreciate?", a: "Boats typically lose 10 to 15 percent of their value in the first year and 5 to 10 percent each subsequent year. After 10 years, most boats retain 30 to 50 percent of their original value depending on type and condition." },
    { q: "What boats hold their value best?", a: "Center console fishing boats, quality sailboats, and well-known brands like Boston Whaler tend to hold value best. Pontoon boats and personal watercraft generally depreciate faster." },
    { q: "Do engine hours affect boat value?", a: "Yes, high engine hours reduce value similar to high mileage on a car. Boats with under 500 hours are generally considered low-use. Over 1,000 hours on a gasoline engine may significantly reduce resale value." }
  ],
  `Base Value = Purchase Price x (1 - Annual Depreciation Rate) ^ Age
Current Value = Base Value x Condition Factor x Engine Hours Adjustment
Total Depreciation = Purchase Price - Current Value`,
  ["boat-insurance-cost-calculator", "marina-slip-cost-calculator"]
);

add(
  "dock-building-cost-calculator",
  "Dock Building Cost Calculator",
  "Estimate the cost to build a residential boat dock based on size, materials, water depth, and whether you choose fixed or floating construction.",
  "Finance",
  "finance",
  "$",
  ["dock building cost", "boat dock cost", "pier construction cost", "dock installation price"],
  [
    '{ name: "dockLength", label: "Dock Length (feet)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "dockWidth", label: "Dock Width (feet)", type: "number", min: 4, max: 20, defaultValue: 6 }',
    '{ name: "dockType", label: "Dock Type", type: "select", options: [{ value: "1", label: "Fixed / Piling" }, { value: "2", label: "Floating" }, { value: "3", label: "Combination" }], defaultValue: "1" }',
    '{ name: "material", label: "Decking Material", type: "select", options: [{ value: "20", label: "Pressure-Treated Wood ($20/sqft)" }, { value: "35", label: "Composite ($35/sqft)" }, { value: "50", label: "Aluminum ($50/sqft)" }], defaultValue: "35" }',
    '{ name: "addOns", label: "Add-Ons", type: "select", options: [{ value: "0", label: "None" }, { value: "2000", label: "Lighting ($2,000)" }, { value: "5000", label: "Boat Lift ($5,000)" }, { value: "7000", label: "Both ($7,000)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const length = inputs.dockLength as number;
    const width = inputs.dockWidth as number;
    const dockType = parseInt(inputs.dockType as string);
    const materialCost = parseFloat(inputs.material as string);
    const addOns = parseFloat(inputs.addOns as string);
    const sqft = length * width;
    const deckingCost = sqft * materialCost;
    const typeMult = dockType === 1 ? 1.0 : dockType === 2 ? 1.3 : 1.5;
    const structureCost = deckingCost * typeMult;
    const permits = 500 + length * 10;
    const totalCost = structureCost + permits + addOns;
    const costPerFoot = totalCost / length;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Deck Area", value: formatNumber(sqft) + " sq ft" },
        { label: "Structure and Decking", value: "$" + formatNumber(Math.round(structureCost)) },
        { label: "Permits (est.)", value: "$" + formatNumber(Math.round(permits)) },
        { label: "Add-Ons", value: addOns > 0 ? "$" + formatNumber(addOns) : "None" },
        { label: "Cost Per Linear Foot", value: "$" + formatNumber(Math.round(costPerFoot)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to build a dock?", a: "Residential dock costs range from $3,000 to $50,000 or more. A basic 20-foot pressure-treated wood dock costs $3,000 to $6,000. A 40-foot composite floating dock with accessories can run $20,000 to $40,000." },
    { q: "Do I need a permit to build a dock?", a: "Yes, almost all waterfront construction requires permits from local, state, and sometimes federal agencies (Army Corps of Engineers). Permit costs and timelines vary significantly by location." },
    { q: "Which dock type is best?", a: "Fixed piling docks are durable and stable but do not adjust to water level changes. Floating docks move with the water and are better for areas with tidal or seasonal water level changes. Combination docks offer the benefits of both." }
  ],
  `Deck Area = Length x Width
Decking Cost = Area x Material Cost Per Sq Ft
Structure Cost = Decking Cost x Dock Type Multiplier
Total = Structure + Permits + Add-Ons`,
  ["boat-lift-capacity-calculator", "marina-slip-cost-calculator"]
);

add(
  "boat-lift-capacity-calculator",
  "Boat Lift Capacity Calculator",
  "Determine the required boat lift capacity based on your boat weight, engine, fuel, and gear to choose the right lift for safe storage.",
  "Everyday",
  "everyday",
  "~",
  ["boat lift capacity", "boat lift size", "boat hoist calculator", "boat lift weight rating"],
  [
    '{ name: "boatWeight", label: "Boat Dry Weight (lbs)", type: "number", min: 500, max: 50000, defaultValue: 4500 }',
    '{ name: "engineWeight", label: "Engine Weight (lbs)", type: "number", min: 50, max: 3000, defaultValue: 500 }',
    '{ name: "fuelCapacity", label: "Fuel Capacity (gallons)", type: "number", min: 5, max: 500, defaultValue: 60 }',
    '{ name: "gearWeight", label: "Gear and Accessories (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "safetyFactor", label: "Safety Factor (%)", type: "number", min: 10, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const boat = inputs.boatWeight as number;
    const engine = inputs.engineWeight as number;
    const fuel = inputs.fuelCapacity as number * 6.3;
    const gear = inputs.gearWeight as number;
    const safety = inputs.safetyFactor as number / 100;
    const totalWeight = boat + engine + fuel + gear;
    const requiredCapacity = totalWeight * (1 + safety);
    const standardSizes = [3000, 4000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000, 25000];
    let recommended = 25000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= requiredCapacity) { recommended = standardSizes[i]; break; }
    }
    const liftCostEst = recommended * 1.5;
    return {
      primary: { label: "Minimum Lift Capacity", value: formatNumber(Math.round(requiredCapacity)) + " lbs" },
      details: [
        { label: "Total Boat Weight", value: formatNumber(Math.round(totalWeight)) + " lbs" },
        { label: "Fuel Weight", value: formatNumber(Math.round(fuel)) + " lbs" },
        { label: "Recommended Lift Size", value: formatNumber(recommended) + " lbs" },
        { label: "Estimated Lift Cost", value: "$" + formatNumber(Math.round(liftCostEst)) },
        { label: "Remaining Capacity", value: formatNumber(recommended - Math.round(totalWeight)) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How do I choose the right boat lift capacity?", a: "Add up the total weight of your boat including engine, full fuel, gear, and accessories. Then add a 20 to 25 percent safety margin. Always round up to the next available lift size." },
    { q: "How much does a boat lift cost?", a: "Boat lifts range from $2,000 for small PWC lifts to over $30,000 for large cradle lifts. A standard 5,000-pound capacity lift costs approximately $5,000 to $8,000 installed." },
    { q: "What types of boat lifts are available?", a: "Common types include vertical lifts (most popular), cantilever lifts (shallow water), floating lifts, hydraulic lifts, and elevator lifts. The best choice depends on water depth, bottom type, and boat weight." }
  ],
  `Total Weight = Boat + Engine + (Fuel Gallons x 6.3 lbs) + Gear
Minimum Capacity = Total Weight x (1 + Safety Factor %)
Select the standard lift size that meets or exceeds the minimum capacity`,
  ["dock-building-cost-calculator", "boat-trailer-weight-calculator"]
);

add(
  "hull-speed-calculator",
  "Hull Speed Calculator",
  "Calculate the theoretical hull speed of a displacement vessel based on waterline length, and estimate the power needed to reach it.",
  "Science",
  "science",
  "A",
  ["hull speed calculator", "displacement speed", "boat speed formula", "waterline length speed"],
  [
    '{ name: "waterlineLength", label: "Waterline Length (feet)", type: "number", min: 8, max: 300, defaultValue: 30 }',
    '{ name: "displacement", label: "Displacement (lbs)", type: "number", min: 500, max: 500000, defaultValue: 8000 }',
    '{ name: "currentSpeed", label: "Current Speed (knots)", type: "number", min: 0, max: 50, defaultValue: 6 }',
    '{ name: "hullType", label: "Hull Type", type: "select", options: [{ value: "1.34", label: "Traditional Displacement (1.34)" }, { value: "1.5", label: "Semi-Displacement (1.5)" }, { value: "2.5", label: "Planing Hull (2.5)" }], defaultValue: "1.34" }'
  ],
  `(inputs) => {
    const lwl = inputs.waterlineLength as number;
    const displacement = inputs.displacement as number;
    const currentSpeed = inputs.currentSpeed as number;
    const speedFactor = parseFloat(inputs.hullType as string);
    const hullSpeed = speedFactor * Math.sqrt(lwl);
    const speedRatio = hullSpeed > 0 ? currentSpeed / hullSpeed : 0;
    const hullSpeedMph = hullSpeed * 1.15078;
    const displacementTons = displacement / 2240;
    const slRatio = currentSpeed / Math.sqrt(lwl);
    return {
      primary: { label: "Hull Speed", value: formatNumber(Math.round(hullSpeed * 100) / 100) + " knots" },
      details: [
        { label: "Hull Speed (MPH)", value: formatNumber(Math.round(hullSpeedMph * 100) / 100) + " mph" },
        { label: "Speed/Length Ratio at Current", value: formatNumber(Math.round(slRatio * 100) / 100) },
        { label: "Current vs Hull Speed", value: formatNumber(Math.round(speedRatio * 100)) + "%" },
        { label: "Displacement", value: formatNumber(Math.round(displacementTons * 100) / 100) + " long tons" },
        { label: "Waterline Length", value: formatNumber(lwl) + " feet" }
      ]
    };
  }`,
  [
    { q: "What is hull speed?", a: "Hull speed is the maximum efficient speed of a displacement vessel, limited by the wave it creates. It occurs when the bow wave and stern wave have a wavelength equal to the waterline length. The formula is 1.34 times the square root of the waterline length in feet." },
    { q: "Can a boat exceed hull speed?", a: "Displacement hulls cannot efficiently exceed hull speed without enormous power increases. Planing hulls can exceed this limit by rising up and riding on top of the water, greatly reducing wave-making resistance." },
    { q: "How does waterline length affect speed?", a: "Longer waterline means higher hull speed. A 25-foot waterline yields about 6.7 knots hull speed, while a 36-foot waterline yields about 8.0 knots. This is why longer sailboats are generally faster." }
  ],
  `Hull Speed (knots) = Speed Factor x Square Root of Waterline Length (feet)
Speed Factor: 1.34 for displacement, 1.5 for semi-displacement
Speed/Length Ratio = Current Speed / Square Root of Waterline Length`,
  ["propeller-pitch-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "propeller-pitch-calculator",
  "Propeller Pitch Calculator",
  "Find the optimal propeller pitch for your boat engine based on current RPM, desired RPM, and existing propeller specifications for best performance.",
  "Science",
  "science",
  "A",
  ["propeller pitch", "boat prop calculator", "prop pitch change", "marine propeller sizing"],
  [
    '{ name: "currentPitch", label: "Current Prop Pitch (inches)", type: "number", min: 5, max: 40, defaultValue: 19 }',
    '{ name: "currentRPM", label: "Current WOT RPM", type: "number", min: 1000, max: 8000, defaultValue: 5200 }',
    '{ name: "targetRPM", label: "Target WOT RPM", type: "number", min: 1000, max: 8000, defaultValue: 5800 }',
    '{ name: "propDiameter", label: "Propeller Diameter (inches)", type: "number", min: 6, max: 30, defaultValue: 14 }',
    '{ name: "boatSpeed", label: "Current Top Speed (mph)", type: "number", min: 5, max: 80, defaultValue: 38 }'
  ],
  `(inputs) => {
    const currentPitch = inputs.currentPitch as number;
    const currentRPM = inputs.currentRPM as number;
    const targetRPM = inputs.targetRPM as number;
    const diameter = inputs.propDiameter as number;
    const speed = inputs.boatSpeed as number;
    const rpmDiff = targetRPM - currentRPM;
    const pitchChange = Math.round(rpmDiff / 200);
    const newPitch = currentPitch - pitchChange;
    const theoreticalSpeed = (currentRPM * currentPitch) / 1056;
    const slipPercent = theoreticalSpeed > 0 ? ((theoreticalSpeed - speed) / theoreticalSpeed) * 100 : 0;
    const newTheoreticalSpeed = (targetRPM * newPitch) / 1056;
    const estimatedSpeed = newTheoreticalSpeed * (1 - slipPercent / 100);
    return {
      primary: { label: "Recommended Pitch", value: formatNumber(Math.round(newPitch)) + " inches" },
      details: [
        { label: "Pitch Change", value: (pitchChange > 0 ? "-" : "+") + formatNumber(Math.abs(pitchChange)) + " inches" },
        { label: "Current Prop Slip", value: formatNumber(Math.round(slipPercent)) + "%" },
        { label: "Estimated New Top Speed", value: formatNumber(Math.round(estimatedSpeed * 10) / 10) + " mph" },
        { label: "Propeller Size", value: diameter + " x " + Math.round(newPitch) },
        { label: "RPM Change per inch of pitch", value: "~200 RPM" }
      ]
    };
  }`,
  [
    { q: "How does propeller pitch affect performance?", a: "Lower pitch increases acceleration and RPM but reduces top speed. Higher pitch increases top speed and fuel efficiency at cruise but reduces hole shot and acceleration. Each inch of pitch changes RPM by approximately 150 to 200." },
    { q: "What is propeller slip?", a: "Prop slip is the difference between theoretical speed based on pitch and RPM versus actual speed. Normal slip is 10 to 20 percent. High slip may indicate a worn or incorrectly sized propeller." },
    { q: "How do I know if my prop pitch is correct?", a: "Your engine should reach the manufacturer recommended wide-open-throttle RPM range with your normal load. If WOT RPM is below the range, reduce pitch. If above, increase pitch." }
  ],
  `RPM Change Per Inch of Pitch = ~200 RPM
New Pitch = Current Pitch - (RPM Difference / 200)
Theoretical Speed = (RPM x Pitch) / 1056
Prop Slip = (Theoretical Speed - Actual Speed) / Theoretical Speed x 100`,
  ["hull-speed-calculator", "boat-fuel-consumption-calculator"]
);
add(
  "wire-gauge-ampacity-calculator",
  "Wire Gauge Ampacity Calculator",
  "Determine the maximum current carrying capacity of electrical wire based on AWG gauge size, insulation type, and ambient temperature for safe residential and commercial wiring.",
  "Everyday",
  "everyday",
  "~",
  ["wire gauge ampacity", "AWG current capacity", "wire size calculator", "electrical wire ampacity"],
  [
    '{ name: "awgGauge", label: "AWG Wire Gauge", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }, { value: "4", label: "4 AWG" }, { value: "2", label: "2 AWG" }, { value: "1", label: "1 AWG" }], defaultValue: "12" }',
    '{ name: "insulationType", label: "Insulation Type", type: "select", options: [{ value: "1", label: "TW (60C)" }, { value: "2", label: "THW (75C)" }, { value: "3", label: "THHN (90C)" }], defaultValue: "2" }',
    '{ name: "ambientTemp", label: "Ambient Temperature (F)", type: "number", min: 50, max: 150, defaultValue: 86 }',
    '{ name: "conductorsInConduit", label: "Conductors in Conduit", type: "select", options: [{ value: "3", label: "1-3" }, { value: "6", label: "4-6" }, { value: "9", label: "7-9" }], defaultValue: "3" }'
  ],
  `(inputs) => {
    const gauge = parseInt(inputs.awgGauge as string);
    const insType = parseInt(inputs.insulationType as string);
    const ambTemp = inputs.ambientTemp as number;
    const condCount = parseInt(inputs.conductorsInConduit as string);
    const baseAmpacity = { 14: [15, 20, 25], 12: [20, 25, 30], 10: [30, 35, 40], 8: [40, 50, 55], 6: [55, 65, 75], 4: [70, 85, 95], 2: [95, 115, 130], 1: [110, 130, 150] };
    const amps = baseAmpacity[gauge] ? baseAmpacity[gauge][insType - 1] : 20;
    const tempDerate = ambTemp > 86 ? Math.max(0.5, 1 - (ambTemp - 86) * 0.01) : 1.0;
    const conduitDerate = condCount <= 3 ? 1.0 : condCount <= 6 ? 0.8 : 0.7;
    const adjustedAmps = amps * tempDerate * conduitDerate;
    const breakerSize = Math.floor(adjustedAmps / 5) * 5;
    return {
      primary: { label: "Adjusted Ampacity", value: formatNumber(Math.round(adjustedAmps * 10) / 10) + " A" },
      details: [
        { label: "Base Ampacity", value: formatNumber(amps) + " A" },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Conduit Fill Derating", value: formatNumber(Math.round(conduitDerate * 100)) + "%" },
        { label: "Recommended Breaker", value: formatNumber(breakerSize) + " A" }
      ]
    };
  }`,
  [
    "Q: What wire gauge do I need for 20 amps?||A: For a 20-amp circuit you typically need 12 AWG copper wire with standard THW insulation. Always check local electrical codes as requirements may vary by jurisdiction.",
    "Q: How does temperature affect wire ampacity?||A: Higher ambient temperatures reduce wire ampacity because the insulation cannot dissipate heat as effectively. For every degree above 86F (30C) the ampacity must be derated.",
    "Q: Why does the number of wires in conduit matter?||A: More conductors in a conduit generate more heat and reduce the ability of each wire to dissipate that heat. NEC requires derating ampacity when more than 3 current-carrying conductors share a conduit."
  ],
  `Base Ampacity = NEC Table 310.16 lookup by gauge and insulation\nTemp Derating = 1 - (Ambient - 86) x 0.01 (if above 86F)\nConduit Derating = 1.0 (1-3), 0.8 (4-6), 0.7 (7-9)\nAdjusted Ampacity = Base x Temp Derating x Conduit Derating`,
  ["voltage-drop-calculator", "circuit-breaker-sizing-calculator"]
);

add(
  "conduit-fill-calculator",
  "Conduit Fill Calculator",
  "Calculate the maximum number of wires that can be safely pulled through electrical conduit based on conduit size, wire gauge, and NEC fill percentage rules.",
  "Everyday",
  "everyday",
  "~",
  ["conduit fill", "NEC conduit calculator", "wire conduit capacity", "electrical conduit sizing"],
  [
    '{ name: "conduitSize", label: "Conduit Size (inches)", type: "select", options: [{ value: "0.5", label: "1/2 inch" }, { value: "0.75", label: "3/4 inch" }, { value: "1", label: "1 inch" }, { value: "1.25", label: "1-1/4 inch" }, { value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }], defaultValue: "0.75" }',
    '{ name: "conduitType", label: "Conduit Type", type: "select", options: [{ value: "1", label: "EMT" }, { value: "2", label: "IMC" }, { value: "3", label: "PVC Schedule 40" }], defaultValue: "1" }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }], defaultValue: "12" }',
    '{ name: "wireCount", label: "Number of Wires", type: "number", min: 1, max: 50, defaultValue: 4 }'
  ],
  `(inputs) => {
    const conduitSize = parseFloat(inputs.conduitSize as string);
    const conduitType = parseInt(inputs.conduitType as string);
    const wireGauge = parseInt(inputs.wireGauge as string);
    const wireCount = inputs.wireCount as number;
    const conduitArea = { 0.5: [0.122, 0.137, 0.131], 0.75: [0.213, 0.235, 0.228], 1: [0.346, 0.384, 0.37], 1.25: [0.598, 0.66, 0.65], 1.5: [0.814, 0.89, 0.88], 2: [1.342, 1.452, 1.44] };
    const wireArea = { 14: 0.0097, 12: 0.0133, 10: 0.0211, 8: 0.0366, 6: 0.0507 };
    const condArea = conduitArea[conduitSize] ? conduitArea[conduitSize][conduitType - 1] : 0.213;
    const singleWireArea = wireArea[wireGauge] || 0.0133;
    const fillLimit = wireCount <= 1 ? 0.53 : wireCount === 2 ? 0.31 : 0.40;
    const allowableArea = condArea * fillLimit;
    const totalWireArea = singleWireArea * wireCount;
    const fillPct = (totalWireArea / condArea) * 100;
    const maxWires = Math.floor(allowableArea / singleWireArea);
    const passes = totalWireArea <= allowableArea ? "Yes" : "No";
    return {
      primary: { label: "Fill Percentage", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
      details: [
        { label: "Passes NEC Fill Rules", value: passes },
        { label: "Max Wires Allowed", value: formatNumber(maxWires) },
        { label: "Conduit Area", value: formatNumber(Math.round(condArea * 1000) / 1000) + " sq in" },
        { label: "Total Wire Area", value: formatNumber(Math.round(totalWireArea * 10000) / 10000) + " sq in" }
      ]
    };
  }`,
  [
    "Q: What is the NEC conduit fill rule?||A: The NEC allows 53 percent fill for one wire, 31 percent for two wires, and 40 percent for three or more wires. These limits prevent overheating and allow easy wire pulling.",
    "Q: What conduit size do I need for 4 wires of 12 AWG?||A: Four 12 AWG THHN wires require a minimum of 1/2 inch EMT conduit. The total wire area is about 0.053 sq in which is within the 40 percent fill limit of 0.049 sq in for 1/2 inch EMT.",
    "Q: What happens if I overfill conduit?||A: Overfilling conduit makes pulling wires difficult, can damage insulation, causes heat buildup, and violates electrical code. It can lead to premature wire failure or fire hazards."
  ],
  `Fill Limit = 53% (1 wire), 31% (2 wires), 40% (3+ wires)\nAllowable Area = Conduit Internal Area x Fill Limit\nTotal Wire Area = Single Wire Area x Number of Wires\nFill Percentage = (Total Wire Area / Conduit Area) x 100`,
  ["wire-gauge-ampacity-calculator", "voltage-drop-calculator"]
);

add(
  "voltage-drop-calculator",
  "Voltage Drop Calculator",
  "Calculate voltage drop in electrical circuits based on wire length, gauge, load current, and voltage to ensure installations meet NEC recommended limits.",
  "Science",
  "science",
  "A",
  ["voltage drop", "wire voltage loss", "electrical voltage drop", "NEC voltage drop calculator"],
  [
    '{ name: "voltage", label: "System Voltage (V)", type: "select", options: [{ value: "120", label: "120V" }, { value: "208", label: "208V" }, { value: "240", label: "240V" }, { value: "277", label: "277V" }, { value: "480", label: "480V" }], defaultValue: "120" }',
    '{ name: "current", label: "Load Current (Amps)", type: "number", min: 0.5, max: 500, defaultValue: 20 }',
    '{ name: "wireLength", label: "One-Way Wire Length (ft)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }, { value: "4", label: "4 AWG" }, { value: "2", label: "2 AWG" }], defaultValue: "12" }'
  ],
  `(inputs) => {
    const voltage = parseFloat(inputs.voltage as string);
    const current = inputs.current as number;
    const length = inputs.wireLength as number;
    const gauge = parseInt(inputs.wireGauge as string);
    const resistance = { 14: 3.14, 12: 1.98, 10: 1.24, 8: 0.778, 6: 0.491, 4: 0.308, 2: 0.194 };
    const rPer1000 = resistance[gauge] || 1.98;
    const totalR = (rPer1000 * length * 2) / 1000;
    const vDrop = current * totalR;
    const vDropPct = (vDrop / voltage) * 100;
    const voltageAtLoad = voltage - vDrop;
    const powerLoss = current * current * totalR;
    const status = vDropPct <= 3 ? "Acceptable (under 3%)" : vDropPct <= 5 ? "Marginal (3-5%)" : "Excessive (over 5%)";
    return {
      primary: { label: "Voltage Drop", value: formatNumber(Math.round(vDrop * 100) / 100) + " V (" + formatNumber(Math.round(vDropPct * 100) / 100) + "%)" },
      details: [
        { label: "Voltage at Load", value: formatNumber(Math.round(voltageAtLoad * 100) / 100) + " V" },
        { label: "Total Wire Resistance", value: formatNumber(Math.round(totalR * 1000) / 1000) + " ohms" },
        { label: "Power Loss in Wire", value: formatNumber(Math.round(powerLoss * 10) / 10) + " W" },
        { label: "Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is acceptable voltage drop per NEC?||A: The NEC recommends no more than 3 percent voltage drop for branch circuits and 5 percent total for feeder plus branch circuit combined. These are recommendations, not hard requirements in most cases.",
    "Q: How do I reduce voltage drop?||A: You can reduce voltage drop by using a larger wire gauge, shortening the wire run, reducing the load current, or increasing the system voltage. Larger gauge wire has lower resistance per foot.",
    "Q: Why does voltage drop matter?||A: Excessive voltage drop causes equipment to underperform, motors to overheat, lights to dim, and sensitive electronics to malfunction. It also wastes energy as heat in the wiring."
  ],
  `Total Resistance = (Resistance per 1000ft x Length x 2) / 1000\nVoltage Drop = Current x Total Resistance\nVoltage Drop % = (Voltage Drop / System Voltage) x 100\nPower Loss = Current^2 x Total Resistance`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "electrical-panel-load-calculator",
  "Electrical Panel Load Calculator",
  "Calculate total electrical panel load and determine if your service panel has sufficient capacity for existing circuits and planned additions.",
  "Everyday",
  "everyday",
  "~",
  ["electrical panel load", "service panel capacity", "breaker panel calculator", "home electrical load"],
  [
    '{ name: "panelAmps", label: "Panel Rating (Amps)", type: "select", options: [{ value: "100", label: "100A" }, { value: "150", label: "150A" }, { value: "200", label: "200A" }, { value: "400", label: "400A" }], defaultValue: "200" }',
    '{ name: "systemVoltage", label: "System Voltage", type: "select", options: [{ value: "240", label: "240V Split Phase" }, { value: "208", label: "208V Three Phase" }], defaultValue: "240" }',
    '{ name: "generalLoad", label: "General Lighting and Receptacles (W)", type: "number", min: 0, max: 50000, defaultValue: 10000 }',
    '{ name: "applianceLoad", label: "Fixed Appliance Load (W)", type: "number", min: 0, max: 50000, defaultValue: 8000 }',
    '{ name: "hvacLoad", label: "HVAC Load (W)", type: "number", min: 0, max: 30000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const panelAmps = parseFloat(inputs.panelAmps as string);
    const voltage = parseFloat(inputs.systemVoltage as string);
    const general = inputs.generalLoad as number;
    const appliance = inputs.applianceLoad as number;
    const hvac = inputs.hvacLoad as number;
    const panelCapacity = panelAmps * voltage;
    const first10k = Math.min(general, 10000);
    const over10k = Math.max(general - 10000, 0) * 0.4;
    const demandGeneral = first10k + over10k;
    const demandAppliance = appliance * 0.75;
    const totalDemand = demandGeneral + demandAppliance + hvac;
    const totalAmps = totalDemand / voltage;
    const utilization = (totalDemand / panelCapacity) * 100;
    const remaining = panelCapacity - totalDemand;
    return {
      primary: { label: "Total Demand Load", value: formatNumber(Math.round(totalDemand)) + " W" },
      details: [
        { label: "Demand Current", value: formatNumber(Math.round(totalAmps * 10) / 10) + " A" },
        { label: "Panel Capacity", value: formatNumber(Math.round(panelCapacity)) + " W" },
        { label: "Panel Utilization", value: formatNumber(Math.round(utilization)) + "%" },
        { label: "Remaining Capacity", value: formatNumber(Math.round(remaining)) + " W" }
      ]
    };
  }`,
  [
    "Q: How do I know if my panel is overloaded?||A: If your panel utilization exceeds 80 percent, you are near capacity and should consider upgrading. Signs include frequently tripping breakers, warm panel surfaces, or flickering lights.",
    "Q: What size panel do I need for a house?||A: Most modern homes need a 200-amp panel. Smaller homes may use 100-amp panels, while large homes with electric heating, EV chargers, and pools may need 400-amp service.",
    "Q: What is demand factor in load calculation?||A: Demand factor accounts for the fact that not all circuits operate at full load simultaneously. NEC allows 100 percent for the first 10,000W of general load and 40 percent for the remainder."
  ],
  `Demand General = First 10,000W at 100% + Remainder at 40%\nDemand Appliance = Appliance Load x 75%\nTotal Demand = Demand General + Demand Appliance + HVAC\nPanel Utilization = (Total Demand / Panel Capacity) x 100`,
  ["circuit-breaker-sizing-calculator", "voltage-drop-calculator"]
);

add(
  "circuit-breaker-sizing-calculator",
  "Circuit Breaker Sizing Calculator",
  "Determine the correct circuit breaker size for your electrical load based on continuous and non-continuous loads, wire gauge, and NEC 80 percent rule.",
  "Everyday",
  "everyday",
  "~",
  ["circuit breaker size", "breaker sizing calculator", "NEC breaker sizing", "electrical breaker calculator"],
  [
    '{ name: "continuousLoad", label: "Continuous Load (Amps)", type: "number", min: 0, max: 200, defaultValue: 12 }',
    '{ name: "nonContinuousLoad", label: "Non-Continuous Load (Amps)", type: "number", min: 0, max: 200, defaultValue: 5 }',
    '{ name: "systemVoltage", label: "System Voltage", type: "select", options: [{ value: "120", label: "120V Single Phase" }, { value: "240", label: "240V Single Phase" }, { value: "208", label: "208V Three Phase" }], defaultValue: "120" }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG (15A max)" }, { value: "12", label: "12 AWG (20A max)" }, { value: "10", label: "10 AWG (30A max)" }, { value: "8", label: "8 AWG (40A max)" }, { value: "6", label: "6 AWG (55A max)" }], defaultValue: "12" }'
  ],
  `(inputs) => {
    const contLoad = inputs.continuousLoad as number;
    const nonContLoad = inputs.nonContinuousLoad as number;
    const voltage = parseFloat(inputs.systemVoltage as string);
    const gauge = parseInt(inputs.wireGauge as string);
    const wireMaxAmps = { 14: 15, 12: 20, 10: 30, 8: 40, 6: 55 };
    const maxWireAmps = wireMaxAmps[gauge] || 20;
    const totalAdjusted = contLoad * 1.25 + nonContLoad;
    const totalActual = contLoad + nonContLoad;
    const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
    let breakerSize = 15;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= totalAdjusted) { breakerSize = standardSizes[i]; break; }
    }
    const safeLoad = breakerSize * 0.8;
    const loadPct = (totalActual / breakerSize) * 100;
    const wireOk = breakerSize <= maxWireAmps ? "Wire is adequate" : "Wire gauge too small";
    return {
      primary: { label: "Recommended Breaker", value: formatNumber(breakerSize) + " A" },
      details: [
        { label: "Adjusted Load (125% continuous)", value: formatNumber(Math.round(totalAdjusted * 10) / 10) + " A" },
        { label: "Actual Total Load", value: formatNumber(Math.round(totalActual * 10) / 10) + " A" },
        { label: "Safe Continuous Load (80%)", value: formatNumber(safeLoad) + " A" },
        { label: "Wire Check", value: wireOk }
      ]
    };
  }`,
  [
    "Q: Why is the 80 percent rule used for breaker sizing?||A: NEC requires that continuous loads (running 3+ hours) not exceed 80 percent of the breaker rating. This provides a safety margin to prevent overheating and nuisance tripping.",
    "Q: Can I use a larger breaker to stop tripping?||A: Never upsize a breaker without also upsizing the wire. The breaker protects the wire from overheating. Using a larger breaker with undersized wire creates a fire hazard.",
    "Q: What is the difference between continuous and non-continuous loads?||A: A continuous load runs for 3 or more hours, such as lighting or electric heating. Non-continuous loads run intermittently, like a garbage disposal or power tools."
  ],
  `Adjusted Load = (Continuous Load x 1.25) + Non-Continuous Load\nBreaker Size = Next standard size >= Adjusted Load\nSafe Continuous Load = Breaker Size x 0.80\nLoad Percentage = (Actual Load / Breaker Size) x 100`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "pipe-flow-rate-calculator",
  "Pipe Flow Rate Calculator",
  "Calculate water flow rate through pipes based on pipe diameter, length, pressure, and material using the Hazen-Williams equation for plumbing design.",
  "Science",
  "science",
  "A",
  ["pipe flow rate", "water flow calculator", "plumbing flow rate", "Hazen-Williams calculator"],
  [
    '{ name: "pipeDiameter", label: "Pipe Inner Diameter (inches)", type: "select", options: [{ value: "0.5", label: "1/2 inch" }, { value: "0.75", label: "3/4 inch" }, { value: "1", label: "1 inch" }, { value: "1.25", label: "1-1/4 inch" }, { value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }], defaultValue: "0.75" }',
    '{ name: "pipeLength", label: "Pipe Length (ft)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "pressureDrop", label: "Available Pressure (psi)", type: "number", min: 1, max: 150, defaultValue: 40 }',
    '{ name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{ value: "150", label: "Copper (C=150)" }, { value: "140", label: "PVC/CPVC (C=140)" }, { value: "130", label: "Steel (C=130)" }, { value: "100", label: "Galvanized Iron (C=100)" }], defaultValue: "150" }'
  ],
  `(inputs) => {
    const diameter = parseFloat(inputs.pipeDiameter as string);
    const length = inputs.pipeLength as number;
    const pressure = inputs.pressureDrop as number;
    const cFactor = parseFloat(inputs.pipeMaterial as string);
    const dFt = diameter / 12;
    const headLoss = pressure * 2.31;
    const slope = headLoss / length;
    const velocity = 1.318 * cFactor * Math.pow(dFt / 4, 0.63) * Math.pow(slope, 0.54);
    const areaSqFt = Math.PI * Math.pow(dFt / 2, 2);
    const flowCFS = velocity * areaSqFt;
    const flowGPM = flowCFS * 448.831;
    const velocityFPS = velocity;
    const status = velocityFPS > 8 ? "High velocity - may cause noise" : velocityFPS > 5 ? "Acceptable" : "Good";
    return {
      primary: { label: "Flow Rate", value: formatNumber(Math.round(flowGPM * 100) / 100) + " GPM" },
      details: [
        { label: "Water Velocity", value: formatNumber(Math.round(velocityFPS * 100) / 100) + " ft/s" },
        { label: "Head Loss", value: formatNumber(Math.round(headLoss * 10) / 10) + " ft" },
        { label: "Pipe Cross Section", value: formatNumber(Math.round(areaSqFt * 10000) / 10000) + " sq ft" },
        { label: "Velocity Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is a good water velocity in pipes?||A: Residential plumbing should have water velocity between 2 and 5 feet per second. Above 5 fps may cause noise and above 8 fps can cause pipe erosion and water hammer.",
    "Q: What is the Hazen-Williams C factor?||A: The C factor represents pipe roughness. Higher values mean smoother pipes with less friction. New copper is 150, PVC is 140, steel is 130, and old galvanized iron can be as low as 80.",
    "Q: How does pipe diameter affect flow rate?||A: Flow rate increases dramatically with diameter. Doubling the pipe diameter can increase flow by about 5 to 6 times because flow depends on diameter raised to the 2.63 power."
  ],
  `Head Loss = Pressure (psi) x 2.31\nSlope = Head Loss / Pipe Length\nVelocity = 1.318 x C x (D/4)^0.63 x Slope^0.54\nFlow Rate (GPM) = Velocity x Pipe Area x 448.831`,
  ["pipe-sizing-calculator", "drain-slope-calculator"]
);

add(
  "water-heater-sizing-calculator",
  "Water Heater Sizing Calculator",
  "Determine the right water heater size for your household based on number of occupants, usage patterns, and fixture count to ensure adequate hot water supply.",
  "Everyday",
  "everyday",
  "~",
  ["water heater size", "hot water heater calculator", "water heater capacity", "tankless water heater sizing"],
  [
    '{ name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "heaterType", label: "Heater Type", type: "select", options: [{ value: "1", label: "Tank (Storage)" }, { value: "2", label: "Tankless" }, { value: "3", label: "Heat Pump" }], defaultValue: "1" }',
    '{ name: "usageLevel", label: "Usage Level", type: "select", options: [{ value: "1", label: "Low (quick showers)" }, { value: "2", label: "Medium (average)" }, { value: "3", label: "High (long showers, baths)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const occupants = inputs.occupants as number;
    const bathrooms = inputs.bathrooms as number;
    const heaterType = parseInt(inputs.heaterType as string);
    const usage = parseInt(inputs.usageLevel as string);
    const gallonsPerPerson = { 1: 15, 2: 20, 3: 30 };
    const dailyGallons = occupants * (gallonsPerPerson[usage] || 20);
    const peakGPM = bathrooms * 2.0 + 1.0;
    const fhr = dailyGallons * 0.7;
    let tankSize = 0;
    if (heaterType === 1) {
      if (fhr <= 40) tankSize = 40;
      else if (fhr <= 55) tankSize = 50;
      else if (fhr <= 70) tankSize = 65;
      else tankSize = 80;
    }
    const tanklessGPM = Math.ceil(peakGPM * 10) / 10;
    const btuNeeded = heaterType === 2 ? Math.round(tanklessGPM * 500 * 60) : Math.round(dailyGallons * 8.33 * 60 * 0.8);
    const annualCostEstimate = heaterType === 3 ? Math.round(dailyGallons * 365 * 0.005) : heaterType === 2 ? Math.round(dailyGallons * 365 * 0.008) : Math.round(dailyGallons * 365 * 0.012);
    return {
      primary: { label: heaterType === 2 ? "Required Flow Rate" : "Recommended Tank Size", value: heaterType === 2 ? formatNumber(tanklessGPM) + " GPM" : formatNumber(tankSize) + " gallons" },
      details: [
        { label: "Daily Hot Water Usage", value: formatNumber(dailyGallons) + " gallons" },
        { label: "First Hour Rating", value: formatNumber(Math.round(fhr)) + " gallons" },
        { label: "Peak Demand", value: formatNumber(Math.round(peakGPM * 10) / 10) + " GPM" },
        { label: "Est. Annual Operating Cost", value: "$" + formatNumber(annualCostEstimate) }
      ]
    };
  }`,
  [
    "Q: What size water heater do I need for a family of 4?||A: A family of 4 with average usage typically needs a 50-gallon tank water heater or a tankless unit rated for at least 5 GPM to handle simultaneous fixtures.",
    "Q: Are tankless water heaters worth it?||A: Tankless heaters cost more upfront but save 20-30 percent on energy by heating water on demand. They last 20+ years versus 10-15 for tanks and provide unlimited hot water.",
    "Q: What is first hour rating?||A: First hour rating (FHR) measures how many gallons of hot water a tank heater can deliver in its first hour of use. It accounts for both stored hot water and heating recovery rate."
  ],
  `Daily Usage = Occupants x Gallons Per Person\nFirst Hour Rating = Daily Usage x 0.7\nPeak GPM = Bathrooms x 2.0 + 1.0\nTank Size = Based on FHR (40-80 gallons)`,
  ["pipe-flow-rate-calculator", "btu-heating-calculator"]
);

add(
  "drain-slope-calculator",
  "Drain Slope Calculator",
  "Calculate the correct drainage pipe slope and fall over a given distance to meet plumbing code requirements for proper wastewater flow.",
  "Everyday",
  "everyday",
  "~",
  ["drain slope", "drainage pipe grade", "plumbing slope calculator", "sewer pipe fall calculator"],
  [
    '{ name: "pipeSize", label: "Drain Pipe Size (inches)", type: "select", options: [{ value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }, { value: "3", label: "3 inch" }, { value: "4", label: "4 inch" }, { value: "6", label: "6 inch" }], defaultValue: "3" }',
    '{ name: "runLength", label: "Horizontal Run (ft)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "slopeType", label: "Slope Standard", type: "select", options: [{ value: "0.25", label: "1/4 inch per foot (standard)" }, { value: "0.125", label: "1/8 inch per foot (3 inch+ pipe)" }, { value: "0.5", label: "1/2 inch per foot (steep)" }], defaultValue: "0.25" }'
  ],
  `(inputs) => {
    const pipeSize = parseFloat(inputs.pipeSize as string);
    const runLength = inputs.runLength as number;
    const slopePerFt = parseFloat(inputs.slopeType as string);
    const totalFall = slopePerFt * runLength;
    const slopePct = (slopePerFt / 12) * 100;
    const minSlope = pipeSize >= 3 ? 0.125 : 0.25;
    const meetsCode = slopePerFt >= minSlope ? "Yes" : "No - increase slope";
    const slopeRatio = Math.round(12 / slopePerFt);
    const velocityEst = Math.sqrt(slopePerFt / 12) * 4.5;
    return {
      primary: { label: "Total Fall", value: formatNumber(Math.round(totalFall * 100) / 100) + " inches" },
      details: [
        { label: "Slope", value: formatNumber(slopePerFt) + " in/ft (" + formatNumber(Math.round(slopePct * 100) / 100) + "%)" },
        { label: "Slope Ratio", value: "1:" + formatNumber(slopeRatio) },
        { label: "Estimated Flow Velocity", value: formatNumber(Math.round(velocityEst * 100) / 100) + " ft/s" },
        { label: "Meets Code Minimum", value: meetsCode }
      ]
    };
  }`,
  [
    "Q: What is the correct slope for a drain pipe?||A: Standard plumbing code requires 1/4 inch per foot slope for pipes 3 inches and smaller, and 1/8 inch per foot for pipes larger than 3 inches.",
    "Q: Can a drain pipe have too much slope?||A: Yes, excessive slope causes liquids to flow too fast while solids lag behind, leading to clogs. The maximum recommended slope is typically 1/2 inch per foot.",
    "Q: How do I measure drain pipe slope?||A: Use a level and tape measure. Place the level on the pipe, raise one end until level, and measure the gap. Divide the gap by the distance between supports to get the slope per foot."
  ],
  `Total Fall = Slope Per Foot x Run Length\nSlope Percentage = (Slope Per Foot / 12) x 100\nMinimum Slope = 1/4 in/ft (pipes <= 3 in) or 1/8 in/ft (pipes > 3 in)`,
  ["pipe-sizing-calculator", "pipe-flow-rate-calculator"]
);

add(
  "pipe-sizing-calculator",
  "Pipe Sizing Calculator",
  "Determine the correct plumbing pipe diameter for water supply lines based on fixture units, flow demand, and available pressure for residential and commercial buildings.",
  "Everyday",
  "everyday",
  "~",
  ["pipe sizing", "water pipe size calculator", "plumbing pipe diameter", "supply pipe sizing"],
  [
    '{ name: "fixtureUnits", label: "Total Fixture Units", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{ value: "1", label: "Copper Type L" }, { value: "2", label: "CPVC" }, { value: "3", label: "PEX" }], defaultValue: "1" }',
    '{ name: "supplyPressure", label: "Supply Pressure (psi)", type: "number", min: 20, max: 100, defaultValue: 50 }',
    '{ name: "longestRun", label: "Longest Run (ft)", type: "number", min: 10, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const fixtureUnits = inputs.fixtureUnits as number;
    const material = parseInt(inputs.pipeMaterial as string);
    const pressure = inputs.supplyPressure as number;
    const longestRun = inputs.longestRun as number;
    const gpm = fixtureUnits <= 10 ? fixtureUnits * 1.0 : 10 + (fixtureUnits - 10) * 0.6;
    const pressureLossPerFoot = (pressure * 0.8) / longestRun;
    let mainSize = 0.75;
    if (gpm > 25) mainSize = 1.5;
    else if (gpm > 15) mainSize = 1.25;
    else if (gpm > 8) mainSize = 1.0;
    else mainSize = 0.75;
    const materialFactor = { 1: 1.0, 2: 1.05, 3: 1.0 };
    const adjustedSize = mainSize * (materialFactor[material] || 1.0);
    const branchSize = mainSize >= 1.0 ? 0.75 : 0.5;
    const velocity = gpm / (Math.PI * Math.pow(mainSize / 2, 2)) * 0.408;
    return {
      primary: { label: "Recommended Main Size", value: formatNumber(adjustedSize) + " inch" },
      details: [
        { label: "Estimated Flow Demand", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        { label: "Branch Line Size", value: formatNumber(branchSize) + " inch" },
        { label: "Available Pressure Loss", value: formatNumber(Math.round(pressureLossPerFoot * 100) / 100) + " psi/ft" },
        { label: "Estimated Velocity", value: formatNumber(Math.round(velocity * 10) / 10) + " ft/s" }
      ]
    };
  }`,
  [
    "Q: What size water supply pipe do I need?||A: Most homes use a 3/4-inch main supply line for up to 8 GPM flow. Larger homes with many fixtures may need 1-inch or 1-1/4-inch main lines. Branch lines are typically 1/2 or 3/4 inch.",
    "Q: What are fixture units in plumbing?||A: Fixture units are a standardized measure of water demand. A lavatory is 1 unit, a toilet is 2.5 units, a bathtub is 2 units, and a kitchen sink is 1.5 units.",
    "Q: Does pipe material affect sizing?||A: Yes, different materials have different friction characteristics. Copper is very smooth, PEX has slightly more friction at fittings due to smaller insert fittings, and CPVC has similar performance to copper."
  ],
  `GPM Demand = First 10 FU x 1.0 + Remaining FU x 0.6\nPressure Loss Budget = (Supply Pressure x 0.8) / Longest Run\nMain Size = Based on GPM demand lookup\nBranch Size = 0.5 or 0.75 inch based on main size`,
  ["pipe-flow-rate-calculator", "water-heater-sizing-calculator"]
);

add(
  "btu-heating-calculator",
  "BTU Heating Calculator",
  "Calculate the BTU heating capacity needed for a room or building based on square footage, insulation quality, climate zone, and ceiling height.",
  "Everyday",
  "everyday",
  "~",
  ["BTU calculator", "heating BTU calculator", "furnace sizing", "heating capacity calculator"],
  [
    '{ name: "squareFootage", label: "Area (sq ft)", type: "number", min: 50, max: 20000, defaultValue: 1500 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Poor (old, no insulation)" }, { value: "2", label: "Average (some insulation)" }, { value: "3", label: "Good (well insulated)" }, { value: "4", label: "Excellent (new construction)" }], defaultValue: "2" }',
    '{ name: "climateZone", label: "Climate Zone", type: "select", options: [{ value: "1", label: "Zone 1-2 (Hot/Warm)" }, { value: "2", label: "Zone 3-4 (Mixed)" }, { value: "3", label: "Zone 5-6 (Cold)" }, { value: "4", label: "Zone 7 (Very Cold)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const sqft = inputs.squareFootage as number;
    const ceiling = inputs.ceilingHeight as number;
    const insulation = parseInt(inputs.insulation as string);
    const climate = parseInt(inputs.climateZone as string);
    const baseBtuPerSqFt = { 1: 25, 2: 35, 3: 45, 4: 60 };
    const insulationFactor = { 1: 1.4, 2: 1.0, 3: 0.8, 4: 0.65 };
    const ceilingFactor = ceiling / 8;
    const baseBtu = sqft * (baseBtuPerSqFt[climate] || 35);
    const adjustedBtu = baseBtu * (insulationFactor[insulation] || 1.0) * ceilingFactor;
    const furnaceSize = Math.ceil(adjustedBtu / 10000) * 10000;
    const tonnage = Math.round(adjustedBtu / 12000 * 10) / 10;
    return {
      primary: { label: "Required BTU", value: formatNumber(Math.round(adjustedBtu)) + " BTU/hr" },
      details: [
        { label: "Base BTU Requirement", value: formatNumber(Math.round(baseBtu)) + " BTU/hr" },
        { label: "Recommended Furnace", value: formatNumber(furnaceSize) + " BTU/hr" },
        { label: "Equivalent Tonnage", value: formatNumber(tonnage) + " tons" },
        { label: "Ceiling Height Factor", value: formatNumber(Math.round(ceilingFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    "Q: How many BTU per square foot do I need?||A: In a moderate climate with average insulation, plan for about 30-35 BTU per square foot. Cold climates may need 45-60 BTU per square foot while warm climates need only 20-25.",
    "Q: How do I convert BTU to tons?||A: One ton of heating or cooling equals 12,000 BTU per hour. Divide your BTU requirement by 12,000 to get the tonnage needed.",
    "Q: Should I oversize my furnace?||A: Mild oversizing (10-20 percent) is acceptable, but significant oversizing causes short cycling, poor humidity control, and wasted energy. Proper sizing is more efficient and comfortable."
  ],
  `Base BTU = Square Footage x BTU Per Sq Ft (by climate zone)\nAdjusted BTU = Base BTU x Insulation Factor x (Ceiling Height / 8)\nFurnace Size = Rounded up to nearest 10,000 BTU\nTonnage = Adjusted BTU / 12,000`,
  ["duct-sizing-calculator", "heat-pump-cop-calculator"]
);

add(
  "duct-sizing-calculator",
  "Duct Sizing Calculator",
  "Calculate the correct HVAC duct dimensions based on airflow requirements, friction rate, and duct shape for efficient air distribution in heating and cooling systems.",
  "Everyday",
  "everyday",
  "~",
  ["duct sizing", "HVAC duct calculator", "air duct size", "ductwork sizing calculator"],
  [
    '{ name: "cfm", label: "Required Airflow (CFM)", type: "number", min: 50, max: 5000, defaultValue: 400 }',
    '{ name: "frictionRate", label: "Friction Rate (in. w.g. per 100 ft)", type: "select", options: [{ value: "0.06", label: "0.06 (quiet, residential)" }, { value: "0.08", label: "0.08 (standard residential)" }, { value: "0.10", label: "0.10 (commercial)" }], defaultValue: "0.08" }',
    '{ name: "ductShape", label: "Duct Shape", type: "select", options: [{ value: "1", label: "Round" }, { value: "2", label: "Rectangular" }], defaultValue: "1" }',
    '{ name: "maxVelocity", label: "Max Air Velocity (fpm)", type: "number", min: 300, max: 2000, defaultValue: 700 }'
  ],
  `(inputs) => {
    const cfm = inputs.cfm as number;
    const friction = parseFloat(inputs.frictionRate as string);
    const shape = parseInt(inputs.ductShape as string);
    const maxVel = inputs.maxVelocity as number;
    const areaSqIn = (cfm / maxVel) * 144;
    const roundDia = Math.sqrt(areaSqIn / Math.PI) * 2;
    const roundDiaStd = Math.ceil(roundDia);
    const actualArea = Math.PI * Math.pow(roundDiaStd / 2, 2);
    const actualVel = (cfm * 144) / actualArea;
    let rectW = 0;
    let rectH = 0;
    if (shape === 2) {
      rectW = Math.ceil(roundDiaStd * 1.2 / 2) * 2;
      rectH = Math.ceil(areaSqIn / rectW / 2) * 2;
      if (rectH < 4) rectH = 4;
    }
    const equivRound = shape === 2 ? Math.round(1.3 * Math.pow(rectW * rectH, 0.625) / Math.pow(rectW + rectH, 0.25)) : roundDiaStd;
    return {
      primary: { label: shape === 1 ? "Round Duct Diameter" : "Rectangular Duct Size", value: shape === 1 ? formatNumber(roundDiaStd) + " inches" : formatNumber(rectW) + " x " + formatNumber(rectH) + " inches" },
      details: [
        { label: "Required Cross-Section", value: formatNumber(Math.round(areaSqIn * 10) / 10) + " sq in" },
        { label: "Air Velocity", value: formatNumber(Math.round(actualVel)) + " fpm" },
        { label: "Equivalent Round Diameter", value: formatNumber(equivRound) + " inches" },
        { label: "Friction Rate", value: formatNumber(friction) + " in. w.g./100ft" }
      ]
    };
  }`,
  [
    "Q: What size duct do I need for 400 CFM?||A: For 400 CFM at standard residential friction rate, you need approximately a 10-inch round duct or an equivalent rectangular duct such as 12 x 8 inches.",
    "Q: What is friction rate in duct sizing?||A: Friction rate is the pressure drop per 100 feet of duct measured in inches of water gauge. Lower friction rates mean larger ducts but quieter operation and better efficiency.",
    "Q: Are round or rectangular ducts better?||A: Round ducts are more efficient because they have less surface area per unit of airflow, which reduces friction and heat loss. Rectangular ducts are used when height clearance is limited."
  ],
  `Cross-Section Area = (CFM / Max Velocity) x 144\nRound Diameter = sqrt(Area / Pi) x 2\nRectangular Equivalent = Based on equal friction method\nActual Velocity = (CFM x 144) / Actual Area`,
  ["btu-heating-calculator", "exhaust-fan-cfm-calculator"]
);

add(
  "refrigerant-charge-calculator",
  "Refrigerant Charge Calculator",
  "Estimate the refrigerant charge needed for HVAC systems based on line set length, system capacity, and refrigerant type for proper air conditioning performance.",
  "Science",
  "science",
  "A",
  ["refrigerant charge", "AC refrigerant calculator", "R-410A charge", "HVAC refrigerant amount"],
  [
    '{ name: "systemTons", label: "System Capacity (tons)", type: "select", options: [{ value: "1.5", label: "1.5 tons" }, { value: "2", label: "2 tons" }, { value: "2.5", label: "2.5 tons" }, { value: "3", label: "3 tons" }, { value: "3.5", label: "3.5 tons" }, { value: "4", label: "4 tons" }, { value: "5", label: "5 tons" }], defaultValue: "3" }',
    '{ name: "lineSetLength", label: "Line Set Length (ft)", type: "number", min: 10, max: 200, defaultValue: 25 }',
    '{ name: "factoryCharge", label: "Factory Line Set Length (ft)", type: "number", min: 10, max: 50, defaultValue: 15 }',
    '{ name: "refrigerantType", label: "Refrigerant Type", type: "select", options: [{ value: "1", label: "R-410A" }, { value: "2", label: "R-32" }, { value: "3", label: "R-22 (legacy)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const tons = parseFloat(inputs.systemTons as string);
    const lineLength = inputs.lineSetLength as number;
    const factoryLength = inputs.factoryCharge as number;
    const refType = parseInt(inputs.refrigerantType as string);
    const ozPerFt = { 1: 0.6, 2: 0.5, 3: 0.65 };
    const baseCharge = { 1: tons * 48, 2: tons * 40, 3: tons * 52 };
    const addlLength = Math.max(lineLength - factoryLength, 0);
    const addlCharge = addlLength * (ozPerFt[refType] || 0.6);
    const totalCharge = (baseCharge[refType] || tons * 48) + addlCharge;
    const totalLbs = totalCharge / 16;
    const refName = { 1: "R-410A", 2: "R-32", 3: "R-22" };
    return {
      primary: { label: "Total Charge", value: formatNumber(Math.round(totalCharge * 10) / 10) + " oz" },
      details: [
        { label: "Total in Pounds", value: formatNumber(Math.round(totalLbs * 100) / 100) + " lbs" },
        { label: "Factory Charge", value: formatNumber(Math.round((baseCharge[refType] || 0) * 10) / 10) + " oz" },
        { label: "Additional Charge", value: formatNumber(Math.round(addlCharge * 10) / 10) + " oz" },
        { label: "Refrigerant", value: refName[refType] || "R-410A" }
      ]
    };
  }`,
  [
    "Q: How much refrigerant does a 3-ton AC need?||A: A 3-ton system typically needs about 6 to 12 pounds of R-410A refrigerant, including the factory charge. Additional refrigerant is added based on the line set length beyond the factory default.",
    "Q: How is additional refrigerant charge calculated?||A: Most manufacturers specify adding about 0.6 ounces of R-410A per foot of line set beyond the factory-charged length, which is typically 15 to 25 feet.",
    "Q: What happens if the system is overcharged?||A: Overcharging causes high head pressure, reduced efficiency, compressor damage, and potential liquid slugging. Proper charge is critical for system performance and longevity."
  ],
  `Factory Charge = System Tons x Base Charge Per Ton\nAdditional Length = Line Set Length - Factory Length\nAdditional Charge = Additional Length x Oz Per Foot\nTotal Charge = Factory Charge + Additional Charge`,
  ["heat-pump-cop-calculator", "mini-split-sizing-calculator"]
);

add(
  "heat-pump-cop-calculator",
  "Heat Pump COP Calculator",
  "Calculate the coefficient of performance for heat pumps by comparing heating output to energy input across different operating temperatures and system types.",
  "Science",
  "science",
  "A",
  ["heat pump COP", "coefficient of performance", "heat pump efficiency", "COP calculator HVAC"],
  [
    '{ name: "heatingOutput", label: "Heating Output (BTU/hr)", type: "number", min: 5000, max: 200000, defaultValue: 36000 }',
    '{ name: "powerInput", label: "Electrical Input (Watts)", type: "number", min: 500, max: 30000, defaultValue: 3000 }',
    '{ name: "outdoorTemp", label: "Outdoor Temperature (F)", type: "number", min: -20, max: 70, defaultValue: 35 }',
    '{ name: "systemType", label: "System Type", type: "select", options: [{ value: "1", label: "Air Source" }, { value: "2", label: "Ground Source (Geothermal)" }, { value: "3", label: "Mini Split" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const heatingBtu = inputs.heatingOutput as number;
    const watts = inputs.powerInput as number;
    const outdoorF = inputs.outdoorTemp as number;
    const sysType = parseInt(inputs.systemType as string);
    const heatingWatts = heatingBtu / 3.412;
    const cop = heatingWatts / watts;
    const hspf = cop * 3.412;
    const electricHeatCost = 1.0;
    const heatPumpCost = electricHeatCost / cop;
    const savings = ((1 - heatPumpCost / electricHeatCost) * 100);
    const tempPenalty = outdoorF < 32 ? (32 - outdoorF) * 0.02 : 0;
    const adjustedCOP = Math.max(cop - tempPenalty, 1.0);
    const rating = adjustedCOP >= 4 ? "Excellent" : adjustedCOP >= 3 ? "Good" : adjustedCOP >= 2 ? "Average" : "Poor";
    return {
      primary: { label: "COP", value: formatNumber(Math.round(cop * 100) / 100) },
      details: [
        { label: "HSPF Equivalent", value: formatNumber(Math.round(hspf * 100) / 100) },
        { label: "Adjusted COP (for temp)", value: formatNumber(Math.round(adjustedCOP * 100) / 100) },
        { label: "Savings vs Electric Heat", value: formatNumber(Math.round(savings)) + "%" },
        { label: "Efficiency Rating", value: rating }
      ]
    };
  }`,
  [
    "Q: What is a good COP for a heat pump?||A: A COP of 3.0 or higher is considered good, meaning the system produces 3 units of heat for every 1 unit of electricity consumed. Ground source heat pumps can achieve COP of 4 to 5.",
    "Q: How does outdoor temperature affect COP?||A: Heat pump COP decreases as outdoor temperature drops because it becomes harder to extract heat from colder air. Below 25-30F, some air-source heat pumps need supplemental heating.",
    "Q: What is the difference between COP and HSPF?||A: COP is an instantaneous efficiency ratio while HSPF (Heating Seasonal Performance Factor) measures efficiency over an entire heating season. HSPF equals COP multiplied by 3.412."
  ],
  `COP = Heating Output (Watts) / Electrical Input (Watts)\nHeating Watts = BTU/hr / 3.412\nHSPF = COP x 3.412\nAdjusted COP = COP - Temperature Penalty`,
  ["btu-heating-calculator", "boiler-efficiency-calculator"]
);

add(
  "boiler-efficiency-calculator",
  "Boiler Efficiency Calculator",
  "Calculate boiler operating efficiency by comparing fuel input energy to useful heat output, accounting for stack losses, radiation losses, and combustion efficiency.",
  "Science",
  "science",
  "A",
  ["boiler efficiency", "combustion efficiency calculator", "boiler performance", "heating efficiency"],
  [
    '{ name: "fuelInput", label: "Fuel Input (BTU/hr)", type: "number", min: 10000, max: 5000000, defaultValue: 100000 }',
    '{ name: "steamOutput", label: "Useful Heat Output (BTU/hr)", type: "number", min: 5000, max: 5000000, defaultValue: 82000 }',
    '{ name: "stackTemp", label: "Stack Temperature (F)", type: "number", min: 200, max: 800, defaultValue: 350 }',
    '{ name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "1", label: "Natural Gas" }, { value: "2", label: "Propane" }, { value: "3", label: "Fuel Oil #2" }, { value: "4", label: "Electric" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fuelInput = inputs.fuelInput as number;
    const heatOutput = inputs.steamOutput as number;
    const stackTemp = inputs.stackTemp as number;
    const fuelType = parseInt(inputs.fuelType as string);
    const combustionEff = fuelType === 4 ? 100 : Math.max(70, 100 - (stackTemp - 300) * 0.05);
    const grossEff = (heatOutput / fuelInput) * 100;
    const radiationLoss = fuelInput * 0.02;
    const stackLoss = fuelInput * (1 - grossEff / 100) * 0.7;
    const netEff = grossEff * 0.98;
    const fuelCostPerMBTU = { 1: 10, 2: 25, 3: 20, 4: 30 };
    const annualFuelCost = (fuelInput / 1000000) * (fuelCostPerMBTU[fuelType] || 10) * 2000;
    const savingsIfUpgrade = annualFuelCost * (1 - grossEff / 95);
    return {
      primary: { label: "Gross Efficiency", value: formatNumber(Math.round(grossEff * 10) / 10) + "%" },
      details: [
        { label: "Net Efficiency", value: formatNumber(Math.round(netEff * 10) / 10) + "%" },
        { label: "Combustion Efficiency", value: formatNumber(Math.round(combustionEff * 10) / 10) + "%" },
        { label: "Estimated Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuelCost)) },
        { label: "Savings if Upgraded to 95%", value: "$" + formatNumber(Math.round(Math.abs(savingsIfUpgrade))) + "/yr" }
      ]
    };
  }`,
  [
    "Q: What is a good boiler efficiency?||A: Standard boilers operate at 80-85 percent efficiency. High-efficiency condensing boilers achieve 90-98 percent. Older boilers may operate at only 60-75 percent efficiency.",
    "Q: What is the difference between gross and net efficiency?||A: Gross efficiency measures heat output versus fuel input at the boiler. Net efficiency accounts for additional losses including radiation, piping, and standby losses throughout the system.",
    "Q: How does stack temperature indicate efficiency?||A: Lower stack temperatures generally indicate higher efficiency because less heat is escaping up the flue. Condensing boilers achieve stack temperatures below 130F by recovering latent heat."
  ],
  `Gross Efficiency = (Heat Output / Fuel Input) x 100\nNet Efficiency = Gross Efficiency x 0.98 (radiation loss)\nCombustion Efficiency = 100 - (Stack Temp - 300) x 0.05\nAnnual Cost = (Input / 1M BTU) x Fuel Cost x Operating Hours`,
  ["heat-pump-cop-calculator", "btu-heating-calculator"]
);

add(
  "radiant-floor-heating-calculator",
  "Radiant Floor Heating Calculator",
  "Calculate radiant floor heating requirements including tube spacing, water temperature, and BTU output per square foot for hydronic or electric radiant systems.",
  "Everyday",
  "everyday",
  "~",
  ["radiant floor heating", "hydronic floor heating calculator", "in-floor heating", "radiant heat BTU"],
  [
    '{ name: "floorArea", label: "Floor Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 500 }',
    '{ name: "heatLoss", label: "Room Heat Loss (BTU/sq ft/hr)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "floorType", label: "Floor Covering", type: "select", options: [{ value: "1", label: "Tile/Stone" }, { value: "2", label: "Hardwood" }, { value: "3", label: "Carpet" }, { value: "4", label: "Laminate" }], defaultValue: "1" }',
    '{ name: "systemType", label: "System Type", type: "select", options: [{ value: "1", label: "Hydronic (water)" }, { value: "2", label: "Electric" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const area = inputs.floorArea as number;
    const heatLoss = inputs.heatLoss as number;
    const floorType = parseInt(inputs.floorType as string);
    const sysType = parseInt(inputs.systemType as string);
    const totalBtu = area * heatLoss;
    const rValue = { 1: 0.5, 2: 1.0, 3: 2.0, 4: 0.8 };
    const floorR = rValue[floorType] || 1.0;
    const waterTemp = 85 + floorR * 15 + heatLoss * 0.5;
    const tubeSpacing = heatLoss <= 20 ? 12 : heatLoss <= 35 ? 9 : 6;
    const tubeLength = (area / tubeSpacing) * 12;
    const wattsPerSqFt = sysType === 2 ? heatLoss / 3.412 : 0;
    const electricWatts = wattsPerSqFt * area;
    const monthlyCost = sysType === 2 ? (electricWatts / 1000) * 0.12 * 8 * 30 : (totalBtu / 100000) * 1.0 * 8 * 30;
    return {
      primary: { label: "Total Heating Capacity", value: formatNumber(Math.round(totalBtu)) + " BTU/hr" },
      details: [
        { label: sysType === 1 ? "Water Temperature" : "Watts Per Sq Ft", value: sysType === 1 ? formatNumber(Math.round(waterTemp)) + " F" : formatNumber(Math.round(wattsPerSqFt * 10) / 10) + " W/sq ft" },
        { label: "Tube Spacing", value: formatNumber(tubeSpacing) + " inches" },
        { label: sysType === 1 ? "Total Tube Length" : "Total Wattage", value: sysType === 1 ? formatNumber(Math.round(tubeLength)) + " ft" : formatNumber(Math.round(electricWatts)) + " W" },
        { label: "Est. Monthly Cost (8hr/day)", value: "$" + formatNumber(Math.round(monthlyCost)) }
      ]
    };
  }`,
  [
    "Q: What temperature should radiant floor water be?||A: Hydronic radiant floors typically use water between 85-130F depending on heat loss and floor covering. Tile floors need lower temperatures than carpet because they conduct heat better.",
    "Q: How far apart should radiant floor tubes be?||A: Standard spacing is 9-12 inches for moderate heating needs. High heat loss areas may need 6-inch spacing. Closer spacing provides more even heating but requires more tubing.",
    "Q: Is radiant floor heating energy efficient?||A: Radiant floors are 25-30 percent more efficient than forced air because they heat objects directly, operate at lower temperatures, and eliminate duct losses. They also improve comfort."
  ],
  `Total BTU = Floor Area x Heat Loss Per Sq Ft\nWater Temp = 85 + (Floor R-Value x 15) + (Heat Loss x 0.5)\nTube Spacing = 12 in (low), 9 in (medium), 6 in (high heat loss)\nTube Length = (Area / Spacing) x 12`,
  ["btu-heating-calculator", "boiler-efficiency-calculator"]
);

add(
  "mini-split-sizing-calculator",
  "Mini Split Sizing Calculator",
  "Calculate the correct mini split heat pump size for a room based on square footage, insulation, sun exposure, and climate to ensure efficient heating and cooling.",
  "Everyday",
  "everyday",
  "~",
  ["mini split sizing", "ductless AC sizing", "mini split BTU calculator", "ductless heat pump size"],
  [
    '{ name: "roomSqFt", label: "Room Size (sq ft)", type: "number", min: 50, max: 3000, defaultValue: 400 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 16, defaultValue: 8 }',
    '{ name: "sunExposure", label: "Sun Exposure", type: "select", options: [{ value: "1", label: "Mostly Shaded" }, { value: "2", label: "Average" }, { value: "3", label: "Lots of Sun" }], defaultValue: "2" }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }, { value: "4", label: "Excellent" }], defaultValue: "2" }',
    '{ name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Mild" }, { value: "2", label: "Moderate" }, { value: "3", label: "Hot Summers / Cold Winters" }, { value: "4", label: "Extreme" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const sqft = inputs.roomSqFt as number;
    const ceiling = inputs.ceilingHeight as number;
    const sun = parseInt(inputs.sunExposure as string);
    const insulation = parseInt(inputs.insulation as string);
    const climate = parseInt(inputs.climate as string);
    const baseBtu = sqft * 25;
    const ceilingFactor = ceiling / 8;
    const sunFactor = { 1: 0.9, 2: 1.0, 3: 1.15 };
    const insFactor = { 1: 1.3, 2: 1.0, 3: 0.85, 4: 0.75 };
    const climFactor = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.4 };
    const adjustedBtu = baseBtu * ceilingFactor * (sunFactor[sun] || 1.0) * (insFactor[insulation] || 1.0) * (climFactor[climate] || 1.0);
    const standardSizes = [6000, 9000, 12000, 15000, 18000, 24000, 30000, 36000];
    let unitSize = 9000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= adjustedBtu) { unitSize = standardSizes[i]; break; }
      if (i === standardSizes.length - 1) unitSize = standardSizes[i];
    }
    const tons = unitSize / 12000;
    const seer = 20;
    const annualCool = (unitSize / seer) * 1000 / 1000 * 0.12 * 8 * 120;
    return {
      primary: { label: "Recommended Unit Size", value: formatNumber(unitSize) + " BTU" },
      details: [
        { label: "Calculated Requirement", value: formatNumber(Math.round(adjustedBtu)) + " BTU" },
        { label: "Unit Tonnage", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        { label: "Est. Annual Cooling Cost", value: "$" + formatNumber(Math.round(annualCool)) },
        { label: "Ceiling Factor", value: formatNumber(Math.round(ceilingFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    "Q: What size mini split do I need for a 400 sq ft room?||A: A 400 sq ft room with average insulation and climate typically needs a 9,000 or 12,000 BTU mini split. Rooms with poor insulation or extreme climates may need 15,000 BTU.",
    "Q: Can one mini split heat a whole house?||A: A single mini split can heat or cool one large open area effectively. For whole-house coverage, multi-zone systems with multiple indoor units connected to one outdoor compressor are recommended.",
    "Q: Are mini splits more efficient than central AC?||A: Yes, mini splits are typically 30-40 percent more efficient than central systems because they eliminate duct losses and use inverter compressors that adjust speed to match the load."
  ],
  `Base BTU = Square Footage x 25\nAdjusted BTU = Base x Ceiling Factor x Sun Factor x Insulation Factor x Climate Factor\nUnit Size = Next standard size above Adjusted BTU\nStandard sizes: 6K, 9K, 12K, 15K, 18K, 24K, 30K, 36K BTU`,
  ["btu-heating-calculator", "refrigerant-charge-calculator"]
);

add(
  "exhaust-fan-cfm-calculator",
  "Exhaust Fan CFM Calculator",
  "Calculate the required exhaust fan airflow in CFM for bathrooms, kitchens, and utility spaces based on room size, use type, and ventilation code requirements.",
  "Everyday",
  "everyday",
  "~",
  ["exhaust fan CFM", "bathroom fan size", "kitchen exhaust calculator", "ventilation fan sizing"],
  [
    '{ name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Bathroom" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Laundry Room" }, { value: "4", label: "Garage/Workshop" }], defaultValue: "1" }',
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 3, max: 50, defaultValue: 10 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 3, max: 50, defaultValue: 8 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 14, defaultValue: 8 }'
  ],
  `(inputs) => {
    const roomType = parseInt(inputs.roomType as string);
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceiling = inputs.ceilingHeight as number;
    const sqft = length * width;
    const volume = sqft * ceiling;
    const acph = { 1: 8, 2: 15, 3: 6, 4: 10 };
    const minCFM = { 1: 50, 2: 100, 3: 50, 4: 75 };
    const cfmByVolume = (volume * (acph[roomType] || 8)) / 60;
    const cfmBySqFt = roomType === 1 ? sqft * 1.0 : roomType === 2 ? sqft * 2.0 : sqft * 0.75;
    const requiredCFM = Math.max(cfmByVolume, cfmBySqFt, minCFM[roomType] || 50);
    const stdSizes = [50, 70, 80, 100, 110, 150, 200, 250, 300, 400, 500];
    let fanSize = 50;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredCFM) { fanSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) fanSize = stdSizes[i];
    }
    const sones = fanSize <= 80 ? 0.5 : fanSize <= 110 ? 1.0 : fanSize <= 200 ? 2.0 : 3.0;
    const roomTypeName = { 1: "Bathroom", 2: "Kitchen", 3: "Laundry", 4: "Garage" };
    return {
      primary: { label: "Required CFM", value: formatNumber(Math.round(requiredCFM)) + " CFM" },
      details: [
        { label: "Recommended Fan Size", value: formatNumber(fanSize) + " CFM" },
        { label: "Room Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
        { label: "Estimated Noise Level", value: formatNumber(sones) + " sones" },
        { label: "Room Type", value: roomTypeName[roomType] || "General" }
      ]
    };
  }`,
  [
    "Q: What size exhaust fan do I need for a bathroom?||A: For bathrooms up to 100 sq ft, use 1 CFM per square foot with a minimum of 50 CFM. Larger bathrooms need additional CFM for each enclosed fixture (toilet, shower, tub).",
    "Q: How many sones is a quiet exhaust fan?||A: Fans rated at 0.5 to 1.0 sones are very quiet. Fans at 1.0 to 2.0 sones are moderate. Anything above 3.0 sones is noticeably loud. Look for ENERGY STAR rated fans for quiet operation.",
    "Q: Do I need an exhaust fan if I have a window?||A: Most building codes require a mechanical exhaust fan in bathrooms regardless of windows. Windows do not provide consistent ventilation and cannot effectively remove moisture."
  ],
  `CFM by Volume = (Length x Width x Height x Air Changes/hr) / 60\nCFM by Area = Square Footage x CFM Per Sq Ft\nRequired CFM = Maximum of Volume, Area, and Code Minimum\nAir Changes: Bathroom=8, Kitchen=15, Laundry=6, Garage=10`,
  ["duct-sizing-calculator", "btu-heating-calculator"]
);

add(
  "grounding-electrode-calculator",
  "Grounding Electrode Calculator",
  "Calculate grounding electrode requirements including conductor size, ground rod specifications, and soil resistivity considerations for electrical system grounding per NEC.",
  "Science",
  "science",
  "A",
  ["grounding electrode", "ground rod calculator", "electrical grounding", "NEC grounding requirements"],
  [
    '{ name: "serviceSize", label: "Service Size (Amps)", type: "select", options: [{ value: "100", label: "100A" }, { value: "200", label: "200A" }, { value: "400", label: "400A" }, { value: "600", label: "600A" }], defaultValue: "200" }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1", label: "Wet Clay (low resistivity)" }, { value: "2", label: "Loam/Garden Soil" }, { value: "3", label: "Sandy Soil" }, { value: "4", label: "Rocky/Dry (high resistivity)" }], defaultValue: "2" }',
    '{ name: "rodMaterial", label: "Ground Rod Material", type: "select", options: [{ value: "1", label: "Copper-Bonded Steel (5/8 in)" }, { value: "2", label: "Galvanized Steel (5/8 in)" }, { value: "3", label: "Solid Copper (1/2 in)" }], defaultValue: "1" }',
    '{ name: "rodCount", label: "Number of Ground Rods", type: "number", min: 1, max: 8, defaultValue: 2 }'
  ],
  `(inputs) => {
    const serviceAmps = parseFloat(inputs.serviceSize as string);
    const soilType = parseInt(inputs.soilType as string);
    const rodMat = parseInt(inputs.rodMaterial as string);
    const rodCount = inputs.rodCount as number;
    const gecSize = serviceAmps <= 100 ? 8 : serviceAmps <= 200 ? 4 : serviceAmps <= 400 ? 2 : 1;
    const gecSizeLabel = gecSize === 8 ? "8 AWG" : gecSize === 4 ? "4 AWG" : gecSize === 2 ? "2 AWG" : "1/0 AWG";
    const soilResistivity = { 1: 25, 2: 100, 3: 300, 4: 1000 };
    const resistivity = soilResistivity[soilType] || 100;
    const singleRodR = (resistivity * 0.8) / 8;
    const totalR = singleRodR / rodCount;
    const meetsNEC = totalR <= 25 ? "Yes (under 25 ohms)" : "No - add more rods";
    const rodLength = 8;
    const totalRodLength = rodLength * rodCount;
    const minSpacing = rodLength * 2;
    return {
      primary: { label: "GEC Size", value: gecSizeLabel + " copper" },
      details: [
        { label: "Estimated Ground Resistance", value: formatNumber(Math.round(totalR * 10) / 10) + " ohms" },
        { label: "Meets NEC 25-Ohm Rule", value: meetsNEC },
        { label: "Total Rod Length", value: formatNumber(totalRodLength) + " ft (" + formatNumber(rodCount) + " rods)" },
        { label: "Minimum Rod Spacing", value: formatNumber(minSpacing) + " ft apart" }
      ]
    };
  }`,
  [
    "Q: How deep should a ground rod be?||A: NEC requires ground rods to be driven at least 8 feet into the earth. If rocky soil prevents full depth, the rod can be buried horizontally in a trench at least 30 inches deep.",
    "Q: Why do I need two ground rods?||A: NEC requires a second ground rod if a single rod does not achieve 25 ohms or less resistance to ground. In practice, two rods are almost always installed because testing is rarely performed.",
    "Q: What size grounding electrode conductor do I need?||A: For a 200-amp service, NEC requires a minimum 4 AWG copper grounding electrode conductor. Larger services require larger conductors per NEC Table 250.66."
  ],
  `GEC Size = Per NEC Table 250.66 based on service size\nSingle Rod Resistance = (Soil Resistivity x 0.8) / Rod Length\nTotal Resistance = Single Rod R / Number of Rods\nMinimum Rod Spacing = 2 x Rod Length`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "transformer-sizing-calculator",
  "Transformer Sizing Calculator",
  "Calculate the correct transformer kVA rating based on connected load, demand factor, future growth, and voltage configuration for commercial and industrial applications.",
  "Science",
  "science",
  "A",
  ["transformer sizing", "kVA calculator", "transformer capacity", "electrical transformer sizing"],
  [
    '{ name: "totalLoad", label: "Total Connected Load (kW)", type: "number", min: 1, max: 5000, defaultValue: 75 }',
    '{ name: "powerFactor", label: "Power Factor", type: "number", min: 0.5, max: 1, defaultValue: 0.85 }',
    '{ name: "demandFactor", label: "Demand Factor (%)", type: "number", min: 30, max: 100, defaultValue: 80 }',
    '{ name: "growthFactor", label: "Future Growth (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "voltageConfig", label: "Voltage Configuration", type: "select", options: [{ value: "1", label: "480V 3-Phase" }, { value: "2", label: "208V 3-Phase" }, { value: "3", label: "240V Single Phase" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const totalKW = inputs.totalLoad as number;
    const pf = inputs.powerFactor as number;
    const demandPct = inputs.demandFactor as number / 100;
    const growthPct = inputs.growthFactor as number / 100;
    const voltConfig = parseInt(inputs.voltageConfig as string);
    const demandKW = totalKW * demandPct;
    const futureKW = demandKW * (1 + growthPct);
    const kvaRequired = futureKW / pf;
    const stdSizes = [15, 25, 37.5, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500];
    let xfmrSize = 15;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= kvaRequired) { xfmrSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) xfmrSize = stdSizes[i];
    }
    const voltages = { 1: 480, 2: 208, 3: 240 };
    const phases = { 1: 3, 2: 3, 3: 1 };
    const voltage = voltages[voltConfig] || 480;
    const phase = phases[voltConfig] || 3;
    const fla = phase === 3 ? (xfmrSize * 1000) / (voltage * 1.732) : (xfmrSize * 1000) / voltage;
    const loading = (kvaRequired / xfmrSize) * 100;
    return {
      primary: { label: "Recommended Transformer", value: formatNumber(xfmrSize) + " kVA" },
      details: [
        { label: "Required kVA", value: formatNumber(Math.round(kvaRequired * 10) / 10) + " kVA" },
        { label: "Full Load Amps", value: formatNumber(Math.round(fla * 10) / 10) + " A" },
        { label: "Transformer Loading", value: formatNumber(Math.round(loading)) + "%" },
        { label: "Demand Load", value: formatNumber(Math.round(futureKW * 10) / 10) + " kW" }
      ]
    };
  }`,
  [
    "Q: How do I size a transformer?||A: Calculate total connected load in kW, apply the demand factor (typically 60-80 percent), add growth allowance (20-25 percent), and divide by power factor to get kVA. Select the next standard size up.",
    "Q: What is transformer demand factor?||A: Demand factor is the ratio of actual maximum demand to total connected load. Not all loads run simultaneously, so demand factor is typically 60-80 percent for commercial buildings.",
    "Q: Should I oversize a transformer?||A: Mild oversizing (loading at 65-80 percent) is ideal for efficiency and longevity. Severely oversized transformers waste energy through core losses. Undersized transformers overheat and fail prematurely."
  ],
  `Demand kW = Total Load x Demand Factor\nFuture kW = Demand kW x (1 + Growth Factor)\nRequired kVA = Future kW / Power Factor\nFLA (3-phase) = (kVA x 1000) / (Voltage x 1.732)`,
  ["electrical-panel-load-calculator", "motor-starter-sizing-calculator"]
);

add(
  "motor-starter-sizing-calculator",
  "Motor Starter Sizing Calculator",
  "Determine the correct motor starter, overload relay, and wire size for electric motors based on horsepower, voltage, and starting method per NEC requirements.",
  "Science",
  "science",
  "A",
  ["motor starter sizing", "motor overload calculator", "motor circuit sizing", "NEC motor starter"],
  [
    '{ name: "motorHP", label: "Motor Horsepower", type: "select", options: [{ value: "0.5", label: "1/2 HP" }, { value: "1", label: "1 HP" }, { value: "2", label: "2 HP" }, { value: "3", label: "3 HP" }, { value: "5", label: "5 HP" }, { value: "7.5", label: "7.5 HP" }, { value: "10", label: "10 HP" }, { value: "15", label: "15 HP" }], defaultValue: "5" }',
    '{ name: "voltage", label: "Voltage", type: "select", options: [{ value: "120", label: "120V 1-Phase" }, { value: "208", label: "208V 3-Phase" }, { value: "240", label: "240V 3-Phase" }, { value: "480", label: "480V 3-Phase" }], defaultValue: "208" }',
    '{ name: "startType", label: "Starting Method", type: "select", options: [{ value: "1", label: "Direct On Line (DOL)" }, { value: "2", label: "Soft Starter" }, { value: "3", label: "VFD" }], defaultValue: "1" }',
    '{ name: "serviceFactor", label: "Service Factor", type: "number", min: 1.0, max: 1.5, defaultValue: 1.15 }'
  ],
  `(inputs) => {
    const hp = parseFloat(inputs.motorHP as string);
    const voltage = parseFloat(inputs.voltage as string);
    const startType = parseInt(inputs.startType as string);
    const sf = inputs.serviceFactor as number;
    const phase = voltage >= 208 ? 3 : 1;
    const efficiency = 0.88;
    const fla = phase === 3 ? (hp * 746) / (voltage * 1.732 * efficiency * 0.85) : (hp * 746) / (voltage * efficiency * 0.85);
    const olRelay = fla * sf * 1.15;
    const breakerMultiplier = startType === 1 ? 2.5 : startType === 2 ? 1.75 : 1.5;
    const breakerSize = fla * breakerMultiplier;
    const stdBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];
    let breaker = 15;
    for (let i = 0; i < stdBreakers.length; i++) {
      if (stdBreakers[i] >= breakerSize) { breaker = stdBreakers[i]; break; }
      if (i === stdBreakers.length - 1) breaker = stdBreakers[i];
    }
    const wireSize = fla <= 15 ? "14 AWG" : fla <= 20 ? "12 AWG" : fla <= 30 ? "10 AWG" : fla <= 40 ? "8 AWG" : fla <= 55 ? "6 AWG" : fla <= 70 ? "4 AWG" : "2 AWG";
    const startTypeName = { 1: "DOL", 2: "Soft Starter", 3: "VFD" };
    return {
      primary: { label: "Motor FLA", value: formatNumber(Math.round(fla * 10) / 10) + " A" },
      details: [
        { label: "Overload Relay Setting", value: formatNumber(Math.round(olRelay * 10) / 10) + " A" },
        { label: "Branch Circuit Breaker", value: formatNumber(breaker) + " A" },
        { label: "Minimum Wire Size", value: wireSize },
        { label: "Start Method", value: startTypeName[startType] || "DOL" }
      ]
    };
  }`,
  [
    "Q: How do I size a motor starter?||A: Size the starter based on motor FLA and voltage. The overload relay is set to 115 percent of FLA times the service factor. The branch circuit breaker is sized at 250 percent of FLA for standard starters.",
    "Q: What is the advantage of a VFD over DOL starting?||A: VFDs provide soft starting with lower inrush current (1.5x vs 6-8x FLA), variable speed control, energy savings at partial loads, and reduced mechanical stress on equipment.",
    "Q: What is motor service factor?||A: Service factor (SF) indicates how much a motor can be continuously overloaded beyond nameplate HP. A 1.15 SF motor can run at 115 percent of rated load without damage under normal conditions."
  ],
  `FLA (3-phase) = (HP x 746) / (Voltage x 1.732 x Efficiency x PF)\nOverload Setting = FLA x Service Factor x 1.15\nBreaker Size = FLA x Start Type Multiplier\nDOL = 2.5x, Soft Start = 1.75x, VFD = 1.5x`,
  ["transformer-sizing-calculator", "power-factor-correction-calculator"]
);

add(
  "power-factor-correction-calculator",
  "Power Factor Correction Calculator",
  "Calculate the capacitor bank size needed to correct power factor from current to target values, reducing utility penalties and improving electrical system efficiency.",
  "Science",
  "science",
  "A",
  ["power factor correction", "capacitor bank sizing", "kVAR calculator", "PF correction"],
  [
    '{ name: "realPower", label: "Real Power (kW)", type: "number", min: 10, max: 10000, defaultValue: 200 }',
    '{ name: "currentPF", label: "Current Power Factor", type: "number", min: 0.5, max: 0.99, defaultValue: 0.75 }',
    '{ name: "targetPF", label: "Target Power Factor", type: "number", min: 0.85, max: 1, defaultValue: 0.95 }',
    '{ name: "voltage", label: "System Voltage", type: "select", options: [{ value: "208", label: "208V" }, { value: "240", label: "240V" }, { value: "480", label: "480V" }], defaultValue: "480" }'
  ],
  `(inputs) => {
    const kw = inputs.realPower as number;
    const currentPF = inputs.currentPF as number;
    const targetPF = inputs.targetPF as number;
    const voltage = parseFloat(inputs.voltage as string);
    const currentAngle = Math.acos(currentPF);
    const targetAngle = Math.acos(targetPF);
    const currentKVAR = kw * Math.tan(currentAngle);
    const targetKVAR = kw * Math.tan(targetAngle);
    const requiredKVAR = currentKVAR - targetKVAR;
    const currentKVA = kw / currentPF;
    const targetKVA = kw / targetPF;
    const kvaReduction = currentKVA - targetKVA;
    const currentSavings = kvaReduction * 1000 / (voltage * 1.732);
    const annualSavings = requiredKVAR * 3.5 * 12;
    return {
      primary: { label: "Required Capacitor Bank", value: formatNumber(Math.round(requiredKVAR * 10) / 10) + " kVAR" },
      details: [
        { label: "Current kVA Demand", value: formatNumber(Math.round(currentKVA * 10) / 10) + " kVA" },
        { label: "New kVA Demand", value: formatNumber(Math.round(targetKVA * 10) / 10) + " kVA" },
        { label: "Current Reduction", value: formatNumber(Math.round(currentSavings * 10) / 10) + " A" },
        { label: "Est. Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) }
      ]
    };
  }`,
  [
    "Q: What is power factor and why does it matter?||A: Power factor is the ratio of real power (kW) to apparent power (kVA). Low power factor means you draw more current than needed, increasing utility bills, cable losses, and transformer loading.",
    "Q: What power factor should I target?||A: Most utilities require a minimum of 0.90 and penalize below that. Targeting 0.95 to 0.98 is optimal. Correcting to unity (1.0) can cause leading power factor issues with light loads.",
    "Q: How do capacitor banks correct power factor?||A: Capacitors supply reactive power (kVAR) locally, reducing the reactive current drawn from the utility. This lowers apparent power demand, reduces losses, and improves voltage regulation."
  ],
  `Current kVAR = kW x tan(arccos(Current PF))\nTarget kVAR = kW x tan(arccos(Target PF))\nRequired Capacitor = Current kVAR - Target kVAR\nkVA Reduction = (kW / Current PF) - (kW / Target PF)`,
  ["transformer-sizing-calculator", "harmonic-distortion-calculator"]
);

add(
  "harmonic-distortion-calculator",
  "Harmonic Distortion Calculator",
  "Calculate total harmonic distortion (THD) in electrical systems from nonlinear loads such as VFDs, UPS systems, and LED lighting to assess power quality issues.",
  "Science",
  "science",
  "A",
  ["harmonic distortion", "THD calculator", "power quality harmonics", "electrical harmonics analysis"],
  [
    '{ name: "fundamentalCurrent", label: "Fundamental Current (A)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "thirdHarmonic", label: "3rd Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "fifthHarmonic", label: "5th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "seventhHarmonic", label: "7th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 14 }',
    '{ name: "eleventhHarmonic", label: "11th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 9 }'
  ],
  `(inputs) => {
    const i1 = inputs.fundamentalCurrent as number;
    const h3 = inputs.thirdHarmonic as number / 100;
    const h5 = inputs.fifthHarmonic as number / 100;
    const h7 = inputs.seventhHarmonic as number / 100;
    const h11 = inputs.eleventhHarmonic as number / 100;
    const thd = Math.sqrt(h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11) * 100;
    const totalRMS = i1 * Math.sqrt(1 + h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11);
    const neutralCurrent = i1 * h3 * 3;
    const kFactor = 1 + (h3 * h3 * 9 + h5 * h5 * 25 + h7 * h7 * 49 + h11 * h11 * 121);
    const status = thd <= 5 ? "Excellent (IEEE 519 compliant)" : thd <= 8 ? "Acceptable" : thd <= 20 ? "High - consider filtering" : "Excessive - requires filtering";
    return {
      primary: { label: "Total Harmonic Distortion", value: formatNumber(Math.round(thd * 10) / 10) + "%" },
      details: [
        { label: "Total RMS Current", value: formatNumber(Math.round(totalRMS * 10) / 10) + " A" },
        { label: "Neutral Current (3-phase)", value: formatNumber(Math.round(neutralCurrent * 10) / 10) + " A" },
        { label: "K-Factor", value: formatNumber(Math.round(kFactor * 10) / 10) },
        { label: "Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is an acceptable THD level?||A: IEEE 519 recommends current THD below 5 percent at the point of common coupling for most systems. Voltage THD should be below 5 percent for general systems and below 3 percent for sensitive equipment.",
    "Q: What causes harmonic distortion?||A: Nonlinear loads such as variable frequency drives, switching power supplies, LED drivers, UPS systems, and arc furnaces draw non-sinusoidal current that creates harmonic frequencies.",
    "Q: How do harmonics affect electrical equipment?||A: Harmonics cause transformer overheating, neutral conductor overloading, capacitor failure, motor vibration, breaker nuisance tripping, and interference with sensitive electronics."
  ],
  `THD = sqrt(H3^2 + H5^2 + H7^2 + H11^2) x 100\nTotal RMS = I1 x sqrt(1 + H3^2 + H5^2 + H7^2 + H11^2)\nNeutral Current = I1 x H3 x 3 (triplen harmonics)\nK-Factor = 1 + sum(Hn^2 x n^2)`,
  ["power-factor-correction-calculator", "transformer-sizing-calculator"]
);

add(
  "cable-tray-fill-calculator",
  "Cable Tray Fill Calculator",
  "Calculate cable tray fill area and capacity based on tray dimensions, cable sizes, and NEC fill requirements for organized and code-compliant cable management.",
  "Everyday",
  "everyday",
  "~",
  ["cable tray fill", "cable tray sizing", "NEC cable tray calculator", "cable management sizing"],
  [
    '{ name: "trayWidth", label: "Tray Width (inches)", type: "select", options: [{ value: "6", label: "6 inch" }, { value: "12", label: "12 inch" }, { value: "18", label: "18 inch" }, { value: "24", label: "24 inch" }, { value: "30", label: "30 inch" }, { value: "36", label: "36 inch" }], defaultValue: "12" }',
    '{ name: "trayDepth", label: "Tray Depth (inches)", type: "select", options: [{ value: "3", label: "3 inch" }, { value: "4", label: "4 inch" }, { value: "5", label: "5 inch" }, { value: "6", label: "6 inch" }], defaultValue: "4" }',
    '{ name: "cableDiameter", label: "Average Cable OD (inches)", type: "number", min: 0.2, max: 3, defaultValue: 0.75 }',
    '{ name: "cableCount", label: "Number of Cables", type: "number", min: 1, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const trayW = parseFloat(inputs.trayWidth as string);
    const trayD = parseFloat(inputs.trayDepth as string);
    const cableOD = inputs.cableDiameter as number;
    const cableCount = inputs.cableCount as number;
    const trayArea = trayW * trayD;
    const cableArea = Math.PI * Math.pow(cableOD / 2, 2);
    const totalCableArea = cableArea * cableCount;
    const fillPct = (totalCableArea / trayArea) * 100;
    const maxFillPct = 40;
    const maxCables = Math.floor((trayArea * maxFillPct / 100) / cableArea);
    const remainingCapacity = maxCables - cableCount;
    const passes = fillPct <= maxFillPct ? "Yes" : "No - tray too full";
    return {
      primary: { label: "Cable Tray Fill", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
      details: [
        { label: "Passes NEC Fill Limit (40%)", value: passes },
        { label: "Maximum Cables", value: formatNumber(maxCables) },
        { label: "Remaining Capacity", value: formatNumber(Math.max(remainingCapacity, 0)) + " cables" },
        { label: "Total Cable Area", value: formatNumber(Math.round(totalCableArea * 100) / 100) + " sq in" }
      ]
    };
  }`,
  [
    "Q: What is the NEC fill limit for cable trays?||A: NEC Article 392 generally limits cable tray fill to 40 percent of the cross-sectional area for power cables. Signal and control cables may have different limits based on cable type and voltage.",
    "Q: How do I choose cable tray size?||A: Calculate total cross-sectional area of all cables, then select a tray where that area is no more than 40 percent of the tray cross section. Allow 25 percent spare capacity for future additions.",
    "Q: What types of cable trays are available?||A: Common types include ladder, solid bottom, ventilated, wire mesh, and channel. Ladder trays are best for heavy power cables while wire mesh is ideal for data and communication cables."
  ],
  `Tray Area = Tray Width x Tray Depth\nCable Area = Pi x (Cable OD / 2)^2\nTotal Cable Area = Cable Area x Number of Cables\nFill Percentage = (Total Cable Area / Tray Area) x 100\nMax Cables = (Tray Area x 40%) / Cable Area`,
  ["conduit-fill-calculator", "wire-gauge-ampacity-calculator"]
);

add(
  "emergency-generator-sizing-calculator",
  "Emergency Generator Sizing Calculator",
  "Calculate the required emergency generator size in kW or kVA for backup power based on critical loads, motor starting requirements, and step loading sequence.",
  "Everyday",
  "everyday",
  "~",
  ["generator sizing", "backup generator calculator", "standby generator size", "emergency power calculator"],
  [
    '{ name: "lightingLoad", label: "Lighting Load (kW)", type: "number", min: 0, max: 500, defaultValue: 15 }',
    '{ name: "hvacLoad", label: "HVAC Load (kW)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "largestMotorHP", label: "Largest Motor (HP)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "criticalLoad", label: "Other Critical Loads (kW)", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "powerFactor", label: "Power Factor", type: "number", min: 0.7, max: 1, defaultValue: 0.8 }'
  ],
  `(inputs) => {
    const lighting = inputs.lightingLoad as number;
    const hvac = inputs.hvacLoad as number;
    const motorHP = inputs.largestMotorHP as number;
    const critical = inputs.criticalLoad as number;
    const pf = inputs.powerFactor as number;
    const totalRunKW = lighting + hvac + critical;
    const motorKW = motorHP * 0.746;
    const motorStartKW = motorKW * 3;
    const peakKW = totalRunKW + motorStartKW;
    const runningKW = totalRunKW + motorKW;
    const requiredKVA = peakKW / pf;
    const stdSizes = [20, 30, 45, 60, 80, 100, 125, 150, 200, 250, 300, 350, 400, 500, 600, 750, 1000];
    let genSize = 20;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredKVA) { genSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) genSize = stdSizes[i];
    }
    const loading = (runningKW / (genSize * pf)) * 100;
    const fuelGPH = genSize * 0.07;
    return {
      primary: { label: "Recommended Generator", value: formatNumber(genSize) + " kVA" },
      details: [
        { label: "Running Load", value: formatNumber(Math.round(runningKW * 10) / 10) + " kW" },
        { label: "Peak Load (motor start)", value: formatNumber(Math.round(peakKW * 10) / 10) + " kW" },
        { label: "Running Load Factor", value: formatNumber(Math.round(loading)) + "%" },
        { label: "Est. Fuel Consumption", value: formatNumber(Math.round(fuelGPH * 10) / 10) + " gal/hr" }
      ]
    };
  }`,
  [
    "Q: How do I size an emergency generator?||A: Add all running loads in kW, then add motor starting surge for the largest motor (typically 3x running kW). Divide by power factor to get kVA, then select the next standard generator size.",
    "Q: Why does motor starting affect generator sizing?||A: Motors draw 3-6 times their running current during startup. The generator must handle this inrush current without excessive voltage or frequency dip, often requiring a larger generator.",
    "Q: What is a good load factor for a generator?||A: Generators run most efficiently at 50-80 percent load factor. Below 30 percent causes wet stacking in diesel generators. Above 80 percent leaves insufficient margin for load transients."
  ],
  `Total Running kW = Lighting + HVAC + Critical Loads + Motor kW\nMotor Start kW = Motor HP x 0.746 x 3\nPeak kW = Running Loads + Motor Start kW\nRequired kVA = Peak kW / Power Factor`,
  ["transformer-sizing-calculator", "electrical-panel-load-calculator"]
);

add(
  "solar-inverter-sizing-calculator",
  "Solar Inverter Sizing Calculator",
  "Calculate the correct solar inverter size based on panel array capacity, system voltage, temperature derating, and desired DC-to-AC ratio for optimal solar performance.",
  "Science",
  "science",
  "A",
  ["solar inverter sizing", "inverter calculator", "solar system inverter", "DC to AC ratio solar"],
  [
    '{ name: "arrayKW", label: "Solar Array Size (kW DC)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "dcAcRatio", label: "DC-to-AC Ratio", type: "select", options: [{ value: "1.0", label: "1.0 (conservative)" }, { value: "1.15", label: "1.15 (standard)" }, { value: "1.25", label: "1.25 (moderate clipping)" }, { value: "1.35", label: "1.35 (aggressive)" }], defaultValue: "1.25" }',
    '{ name: "inverterType", label: "Inverter Type", type: "select", options: [{ value: "1", label: "String Inverter" }, { value: "2", label: "Microinverters" }, { value: "3", label: "Power Optimizers + String" }], defaultValue: "1" }',
    '{ name: "maxTemp", label: "Max Ambient Temperature (F)", type: "number", min: 70, max: 130, defaultValue: 95 }'
  ],
  `(inputs) => {
    const arrayKW = inputs.arrayKW as number;
    const dcAcRatio = parseFloat(inputs.dcAcRatio as string);
    const invType = parseInt(inputs.inverterType as string);
    const maxTemp = inputs.maxTemp as number;
    const inverterKW = arrayKW / dcAcRatio;
    const tempDerate = maxTemp > 95 ? Math.max(0.8, 1 - (maxTemp - 95) * 0.005) : 1.0;
    const deratedKW = inverterKW / tempDerate;
    const stdSizes = [3, 3.8, 5, 6, 7.6, 8, 10, 11.4, 12, 15, 20, 25, 30, 33.3, 40, 50, 60, 75, 100, 125];
    let invSize = 3;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= deratedKW) { invSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) invSize = stdSizes[i];
    }
    const actualRatio = arrayKW / invSize;
    const microCount = invType === 2 ? Math.ceil(arrayKW / 0.4) : 0;
    const annualKWh = arrayKW * 1400 * (invType === 2 ? 0.98 : 0.96);
    const clippingLoss = actualRatio > 1.3 ? (actualRatio - 1.0) * 2 : actualRatio > 1.15 ? (actualRatio - 1.0) * 0.5 : 0;
    return {
      primary: { label: invType === 2 ? "Microinverters Needed" : "Inverter Size", value: invType === 2 ? formatNumber(microCount) + " units" : formatNumber(invSize) + " kW" },
      details: [
        { label: "Actual DC/AC Ratio", value: formatNumber(Math.round(actualRatio * 100) / 100) },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Est. Annual Production", value: formatNumber(Math.round(annualKWh)) + " kWh" },
        { label: "Est. Clipping Loss", value: formatNumber(Math.round(clippingLoss * 100) / 100) + "%" }
      ]
    };
  }`,
  [
    "Q: What DC-to-AC ratio should I use?||A: A ratio of 1.15 to 1.25 is standard for most residential systems. Higher ratios reduce inverter cost but increase clipping losses during peak sun hours. A 1.25 ratio clips about 1-2 percent annually.",
    "Q: String inverter vs microinverters - which is better?||A: String inverters cost less but are affected by shade on any panel. Microinverters optimize each panel independently, performing better in shaded conditions and offering panel-level monitoring.",
    "Q: How does temperature affect solar inverter performance?||A: Inverters derate their output in high temperatures to prevent overheating. Above 95-105F ambient, output may reduce by 0.5 percent per degree. Ensure adequate ventilation and shade for the inverter."
  ],
  `Inverter kW = Array kW / DC-to-AC Ratio\nTemp Derate = 1 - (Temp - 95) x 0.005 (if above 95F)\nDerated Size = Inverter kW / Temp Derate Factor\nAnnual Production = Array kW x 1400 hrs x System Efficiency`,
  ["electrical-panel-load-calculator", "power-factor-correction-calculator"]
);
add(
  "retirement-income-gap-calculator",
  "Retirement Income Gap Calculator",
  "Calculate the gap between your expected retirement expenses and projected income sources to determine how much additional savings you need.",
  "Finance",
  "finance",
  "$",
  ["retirement income gap", "retirement shortfall", "retirement savings gap", "income gap analysis"],
  [
    '{ name: "monthlyExpenses", label: "Expected Monthly Expenses in Retirement ($)", type: "number", min: 500, max: 50000, defaultValue: 5000 }',
    '{ name: "socialSecurity", label: "Monthly Social Security ($)", type: "number", min: 0, max: 10000, defaultValue: 2000 }',
    '{ name: "pensionIncome", label: "Monthly Pension Income ($)", type: "number", min: 0, max: 20000, defaultValue: 0 }',
    '{ name: "otherIncome", label: "Other Monthly Income ($)", type: "number", min: 0, max: 20000, defaultValue: 500 }',
    '{ name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const expenses = inputs.monthlyExpenses as number;
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const other = inputs.otherIncome as number;
    const years = inputs.yearsInRetirement as number;
    const totalMonthlyIncome = ss + pension + other;
    const monthlyGap = Math.max(0, expenses - totalMonthlyIncome);
    const annualGap = monthlyGap * 12;
    const totalGapOverRetirement = annualGap * years;
    const coveragePct = expenses > 0 ? (totalMonthlyIncome / expenses) * 100 : 0;
    return {
      primary: { label: "Monthly Income Gap", value: "$" + formatNumber(Math.round(monthlyGap)) },
      details: [
        { label: "Total Monthly Income", value: "$" + formatNumber(Math.round(totalMonthlyIncome)) },
        { label: "Monthly Expenses", value: "$" + formatNumber(Math.round(expenses)) },
        { label: "Annual Gap", value: "$" + formatNumber(Math.round(annualGap)) },
        { label: "Total Gap Over Retirement", value: "$" + formatNumber(Math.round(totalGapOverRetirement)) },
        { label: "Income Coverage", value: formatNumber(Math.round(coveragePct * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What is a retirement income gap?", a: "A retirement income gap is the difference between your expected monthly expenses and guaranteed income sources like Social Security and pensions. This gap must be filled by savings withdrawals, investments, or other means." },
    { q: "How much should I plan for retirement expenses?", a: "A common guideline is to plan for 70 to 80 percent of your pre-retirement income, but actual needs vary. Healthcare, travel, and hobbies may increase costs, while reduced commuting and work expenses may lower them." },
    { q: "How can I close my retirement income gap?", a: "Options include saving more aggressively, delaying retirement, working part-time, reducing planned expenses, investing for growth, purchasing an annuity, or downsizing your home to free up equity." }
  ],
  `Monthly Gap = Monthly Expenses - (Social Security + Pension + Other Income)
Annual Gap = Monthly Gap x 12
Total Gap = Annual Gap x Years in Retirement`,
  ["retirement-income-calculator", "retirement-tax-calculator"]
);

add(
  "pension-benefit-estimator-calculator",
  "Pension Benefit Estimator Calculator",
  "Estimate your monthly pension benefit based on years of service, final average salary, and your pension plan multiplier percentage.",
  "Finance",
  "finance",
  "$",
  ["pension benefit estimator", "pension calculation", "defined benefit pension", "pension multiplier"],
  [
    '{ name: "finalAvgSalary", label: "Final Average Salary ($)", type: "number", min: 10000, max: 500000, defaultValue: 75000 }',
    '{ name: "yearsOfService", label: "Years of Service", type: "number", min: 1, max: 50, defaultValue: 25 }',
    '{ name: "multiplier", label: "Benefit Multiplier (%)", type: "number", min: 0.5, max: 4, defaultValue: 1.5 }',
    '{ name: "earlyRetirementReduction", label: "Early Retirement Reduction (%)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const salary = inputs.finalAvgSalary as number;
    const years = inputs.yearsOfService as number;
    const multiplier = inputs.multiplier as number;
    const reduction = inputs.earlyRetirementReduction as number;
    const annualBenefit = salary * (multiplier / 100) * years;
    const reducedBenefit = annualBenefit * (1 - reduction / 100);
    const monthlyBenefit = reducedBenefit / 12;
    const replacementRate = salary > 0 ? (reducedBenefit / salary) * 100 : 0;
    return {
      primary: { label: "Monthly Pension Benefit", value: "$" + formatNumber(Math.round(monthlyBenefit)) },
      details: [
        { label: "Annual Pension Benefit", value: "$" + formatNumber(Math.round(reducedBenefit)) },
        { label: "Before Early Reduction", value: "$" + formatNumber(Math.round(annualBenefit)) + "/yr" },
        { label: "Income Replacement Rate", value: formatNumber(Math.round(replacementRate * 10) / 10) + "%" },
        { label: "Total Service Credit", value: formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "What is a pension benefit multiplier?", a: "A pension benefit multiplier is the percentage of salary you earn for each year of service. Common multipliers range from 1 to 2.5 percent. For example, with a 1.5 percent multiplier and 30 years of service, your pension would be 45 percent of your final average salary." },
    { q: "What is final average salary?", a: "Final average salary is typically the average of your highest consecutive 3 to 5 years of earnings. Some plans use a different averaging period. This figure is a key component in calculating your defined benefit pension." },
    { q: "How does early retirement affect my pension?", a: "Retiring before your plan normal retirement age typically reduces your pension by 3 to 7 percent per year. The reduction compensates for the longer expected payout period." }
  ],
  `Annual Benefit = Final Average Salary x Multiplier % x Years of Service
Reduced Benefit = Annual Benefit x (1 - Early Retirement Reduction %)
Monthly Benefit = Reduced Benefit / 12`,
  ["pension-vs-lump-sum-calculator", "retirement-income-gap-calculator"]
);

add(
  "401k-employer-match-maximizer-calculator",
  "401k Employer Match Maximizer Calculator",
  "Determine the optimal 401k contribution rate to fully capture your employer match and calculate how much free money you may be leaving on the table.",
  "Finance",
  "finance",
  "$",
  ["401k employer match", "401k match maximizer", "employer match calculator", "maximize 401k match"],
  [
    '{ name: "annualSalary", label: "Annual Salary ($)", type: "number", min: 10000, max: 1000000, defaultValue: 75000 }',
    '{ name: "currentContribPct", label: "Your Current Contribution (%)", type: "number", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "matchPct", label: "Employer Match Rate (%)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "matchCapPct", label: "Match Cap (% of Salary)", type: "number", min: 0, max: 100, defaultValue: 6 }',
    '{ name: "annualLimit", label: "Annual 401k Limit ($)", type: "number", min: 1000, max: 100000, defaultValue: 23500 }'
  ],
  `(inputs) => {
    const salary = inputs.annualSalary as number;
    const contribPct = inputs.currentContribPct as number;
    const matchPct = inputs.matchPct as number;
    const matchCapPct = inputs.matchCapPct as number;
    const limit = inputs.annualLimit as number;
    const yourContrib = Math.min(salary * (contribPct / 100), limit);
    const eligibleForMatch = Math.min(salary * (contribPct / 100), salary * (matchCapPct / 100));
    const employerMatch = eligibleForMatch * (matchPct / 100);
    const optimalContribPct = matchCapPct;
    const optimalContrib = Math.min(salary * (optimalContribPct / 100), limit);
    const maxMatch = salary * (matchCapPct / 100) * (matchPct / 100);
    const missedMatch = Math.max(0, maxMatch - employerMatch);
    const totalAnnual = yourContrib + employerMatch;
    return {
      primary: { label: "Employer Match You Receive", value: "$" + formatNumber(Math.round(employerMatch)) },
      details: [
        { label: "Your Annual Contribution", value: "$" + formatNumber(Math.round(yourContrib)) },
        { label: "Maximum Possible Match", value: "$" + formatNumber(Math.round(maxMatch)) },
        { label: "Match Left on Table", value: "$" + formatNumber(Math.round(missedMatch)) },
        { label: "Total Annual (You + Employer)", value: "$" + formatNumber(Math.round(totalAnnual)) },
        { label: "Contribute at Least", value: formatNumber(optimalContribPct) + "% to max match" }
      ]
    };
  }`,
  [
    { q: "How does a 401k employer match work?", a: "An employer match is free money your company contributes to your 401k based on your own contributions. For example, a 50 percent match on the first 6 percent of salary means if you contribute 6 percent, your employer adds an additional 3 percent." },
    { q: "What does it mean to leave match money on the table?", a: "If you contribute less than the amount needed to get the full employer match, you are forfeiting free money. For example, if your employer matches up to 6 percent of salary but you only contribute 3 percent, you are missing half the potential match." },
    { q: "What is the 2024 401k contribution limit?", a: "For 2024, the employee contribution limit is $23,000 for those under 50 and $30,500 for those 50 and older (with the $7,500 catch-up). The combined employer plus employee limit is $69,000 or $76,500 with catch-up contributions." }
  ],
  `Employer Match = min(Your Contribution, Salary x Match Cap %) x Match Rate %
Match Left on Table = Maximum Match - Actual Match
Optimal Contribution = Match Cap % of Salary`,
  ["retirement-income-gap-calculator", "pension-benefit-estimator-calculator"]
);

add(
  "annuity-income-calculator",
  "Annuity Income Calculator",
  "Calculate the monthly income you can expect from a fixed or immediate annuity based on your lump sum investment, interest rate, and payout period.",
  "Finance",
  "finance",
  "$",
  ["annuity income", "annuity payout estimator", "immediate annuity calculator", "fixed annuity income"],
  [
    '{ name: "lumpSum", label: "Lump Sum Investment ($)", type: "number", min: 10000, max: 10000000, defaultValue: 250000 }',
    '{ name: "interestRate", label: "Annual Interest Rate (%)", type: "number", min: 0.5, max: 12, defaultValue: 5 }',
    '{ name: "payoutYears", label: "Payout Period (Years)", type: "number", min: 5, max: 50, defaultValue: 20 }',
    '{ name: "startAge", label: "Age at Annuity Start", type: "number", min: 50, max: 90, defaultValue: 65 }'
  ],
  `(inputs) => {
    const lump = inputs.lumpSum as number;
    const rate = inputs.interestRate as number / 100;
    const years = inputs.payoutYears as number;
    const startAge = inputs.startAge as number;
    const monthlyRate = rate / 12;
    const totalPayments = years * 12;
    const monthlyPayout = monthlyRate > 0 ? lump * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments)) : lump / totalPayments;
    const annualPayout = monthlyPayout * 12;
    const totalPayout = monthlyPayout * totalPayments;
    const totalInterest = totalPayout - lump;
    const endAge = startAge + years;
    return {
      primary: { label: "Monthly Annuity Income", value: "$" + formatNumber(Math.round(monthlyPayout)) },
      details: [
        { label: "Annual Income", value: "$" + formatNumber(Math.round(annualPayout)) },
        { label: "Total Payouts Over Period", value: "$" + formatNumber(Math.round(totalPayout)) },
        { label: "Total Interest Earned", value: "$" + formatNumber(Math.round(totalInterest)) },
        { label: "Payments Until Age", value: formatNumber(endAge) }
      ]
    };
  }`,
  [
    { q: "What is an immediate annuity?", a: "An immediate annuity is a contract where you pay a lump sum to an insurance company and begin receiving regular income payments right away, typically within 30 days. Payments can be fixed or variable and can last for a set period or for life." },
    { q: "Are annuity payments taxable?", a: "Part of each annuity payment from a non-qualified annuity is a tax-free return of principal, while the earnings portion is taxed as ordinary income. Qualified annuity payments from IRAs or 401k plans are fully taxable as ordinary income." },
    { q: "What is the difference between fixed and variable annuities?", a: "Fixed annuities provide guaranteed periodic payments at a set interest rate. Variable annuities invest in subaccounts similar to mutual funds, and payments fluctuate based on investment performance." }
  ],
  `Monthly Payment = (Lump Sum x Monthly Rate) / (1 - (1 + Monthly Rate)^(-Total Payments))
Monthly Rate = Annual Rate / 12
Total Payments = Payout Years x 12`,
  ["pension-vs-lump-sum-calculator", "retirement-income-gap-calculator"]
);

add(
  "retirement-healthcare-cost-calculator",
  "Retirement Healthcare Cost Calculator",
  "Estimate total out-of-pocket healthcare costs throughout retirement including Medicare premiums, supplemental insurance, prescriptions, and dental and vision expenses.",
  "Finance",
  "finance",
  "$",
  ["retirement healthcare cost", "healthcare cost in retirement", "medical costs retirement", "retirement medical expenses"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 50, max: 80, defaultValue: 65 }',
    '{ name: "retirementAge", label: "Retirement Age", type: "number", min: 55, max: 80, defaultValue: 65 }',
    '{ name: "lifeExpectancy", label: "Life Expectancy", type: "number", min: 70, max: 100, defaultValue: 85 }',
    '{ name: "monthlyMedicare", label: "Monthly Medicare Premium ($)", type: "number", min: 100, max: 1000, defaultValue: 175 }',
    '{ name: "monthlySupplemental", label: "Monthly Supplemental Insurance ($)", type: "number", min: 0, max: 500, defaultValue: 150 }',
    '{ name: "annualOutOfPocket", label: "Annual Out-of-Pocket Costs ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 }',
    '{ name: "inflationRate", label: "Healthcare Inflation Rate (%)", type: "number", min: 0, max: 15, defaultValue: 5 }'
  ],
  `(inputs) => {
    const currentAge = inputs.currentAge as number;
    const retireAge = inputs.retirementAge as number;
    const lifeExp = inputs.lifeExpectancy as number;
    const medicare = inputs.monthlyMedicare as number;
    const supplemental = inputs.monthlySupplemental as number;
    const oop = inputs.annualOutOfPocket as number;
    const inflation = inputs.inflationRate as number / 100;
    const yearsInRetirement = Math.max(0, lifeExp - retireAge);
    const yearsUntilRetire = Math.max(0, retireAge - currentAge);
    let totalCost = 0;
    for (let y = 0; y < yearsInRetirement; y++) {
      const yearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire + y);
      totalCost += yearCost;
    }
    const firstYearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire);
    const avgAnnualCost = yearsInRetirement > 0 ? totalCost / yearsInRetirement : 0;
    return {
      primary: { label: "Total Healthcare Cost in Retirement", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "First Year Cost", value: "$" + formatNumber(Math.round(firstYearCost)) },
        { label: "Average Annual Cost", value: "$" + formatNumber(Math.round(avgAnnualCost)) },
        { label: "Years in Retirement", value: formatNumber(yearsInRetirement) },
        { label: "Monthly Cost at Start", value: "$" + formatNumber(Math.round(firstYearCost / 12)) }
      ]
    };
  }`,
  [
    { q: "How much should I budget for healthcare in retirement?", a: "Fidelity estimates the average 65-year-old couple retiring in 2023 will need approximately $315,000 for healthcare costs throughout retirement. Individual needs vary based on health status, location, and coverage choices." },
    { q: "Does Medicare cover all healthcare costs?", a: "No. Medicare typically covers about 60 percent of healthcare expenses. You are still responsible for premiums, deductibles, copays, coinsurance, and services not covered like most dental, vision, hearing, and long-term care." },
    { q: "Why use a 5 percent healthcare inflation rate?", a: "Healthcare costs have historically risen faster than general inflation, averaging 5 to 7 percent annually over the past two decades. Using a higher rate provides a more realistic long-term projection." }
  ],
  `Year Cost = (Monthly Premiums x 12 + Annual Out-of-Pocket) x (1 + Inflation)^Year
Total = Sum of all Year Costs over retirement period`,
  ["retirement-income-gap-calculator", "retirement-tax-calculator"]
);

add(
  "reverse-mortgage-estimator-calculator",
  "Reverse Mortgage Estimator Calculator",
  "Estimate how much you could receive from a reverse mortgage (HECM) based on your home value, age, and current interest rates.",
  "Finance",
  "finance",
  "$",
  ["reverse mortgage calculator", "HECM calculator", "reverse mortgage estimator", "home equity conversion"],
  [
    '{ name: "homeValue", label: "Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 }',
    '{ name: "mortgageBalance", label: "Existing Mortgage Balance ($)", type: "number", min: 0, max: 5000000, defaultValue: 50000 }',
    '{ name: "borrowerAge", label: "Youngest Borrower Age", type: "number", min: 62, max: 95, defaultValue: 70 }',
    '{ name: "interestRate", label: "Expected Interest Rate (%)", type: "number", min: 2, max: 12, defaultValue: 6.5 }',
    '{ name: "hecmLimit", label: "FHA Lending Limit ($)", type: "number", min: 100000, max: 1500000, defaultValue: 1149825 }'
  ],
  `(inputs) => {
    const homeVal = inputs.homeValue as number;
    const balance = inputs.mortgageBalance as number;
    const age = inputs.borrowerAge as number;
    const rate = inputs.interestRate as number;
    const limit = inputs.hecmLimit as number;
    const maxClaimAmount = Math.min(homeVal, limit);
    const ageFactor = Math.min(0.75, Math.max(0.30, 0.30 + (age - 62) * 0.012 - rate * 0.015));
    const principalLimit = Math.round(maxClaimAmount * ageFactor);
    const closingCosts = Math.round(maxClaimAmount * 0.02 + 2500);
    const netAvailable = Math.max(0, principalLimit - balance - closingCosts);
    const monthlyPayout = Math.round(netAvailable / ((95 - age) * 12));
    return {
      primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(netAvailable) },
      details: [
        { label: "Principal Limit", value: "$" + formatNumber(principalLimit) },
        { label: "Less Existing Mortgage", value: "$" + formatNumber(Math.round(balance)) },
        { label: "Less Closing Costs", value: "$" + formatNumber(closingCosts) },
        { label: "Estimated Monthly Tenure Payment", value: "$" + formatNumber(monthlyPayout) },
        { label: "Max Claim Amount", value: "$" + formatNumber(Math.round(maxClaimAmount)) }
      ]
    };
  }`,
  [
    { q: "What is a reverse mortgage?", a: "A reverse mortgage, most commonly a Home Equity Conversion Mortgage (HECM), allows homeowners 62 and older to convert part of their home equity into cash without selling the home or making monthly mortgage payments. The loan is repaid when the borrower moves out, sells, or passes away." },
    { q: "How much can I borrow with a reverse mortgage?", a: "The amount depends on your age, home value, current interest rates, and the FHA lending limit. Generally, older borrowers with more valuable homes and lower interest rates can access a larger percentage of their equity." },
    { q: "What are the risks of a reverse mortgage?", a: "Risks include accruing interest that reduces home equity over time, potential fees and closing costs, and the requirement to maintain the home and pay property taxes and insurance. Heirs may inherit less equity or need to repay the loan." }
  ],
  `Max Claim Amount = min(Home Value, FHA Limit)
Principal Limit = Max Claim Amount x Age/Rate Factor
Net Available = Principal Limit - Existing Mortgage - Closing Costs`,
  ["retirement-income-gap-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "retirement-tax-bracket-calculator",
  "Retirement Tax Bracket Calculator",
  "Determine which federal tax bracket you will fall into during retirement based on combined income from Social Security, pensions, withdrawals, and other sources.",
  "Finance",
  "finance",
  "$",
  ["retirement tax bracket", "tax bracket in retirement", "retirement federal tax", "retired tax rate"],
  [
    '{ name: "socialSecurity", label: "Annual Social Security ($)", type: "number", min: 0, max: 100000, defaultValue: 24000 }',
    '{ name: "pensionIncome", label: "Annual Pension ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 }',
    '{ name: "withdrawals", label: "Annual IRA/401k Withdrawals ($)", type: "number", min: 0, max: 500000, defaultValue: 25000 }',
    '{ name: "otherIncome", label: "Other Taxable Income ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single" }, { value: "2", label: "Married Filing Jointly" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const withdrawals = inputs.withdrawals as number;
    const other = inputs.otherIncome as number;
    const status = parseInt(inputs.filingStatus as string);
    const provisionalIncome = ss * 0.5 + pension + withdrawals + other;
    const ssThreshold = status === 2 ? 44000 : 34000;
    const taxableSS = provisionalIncome > ssThreshold ? ss * 0.85 : provisionalIncome > (status === 2 ? 32000 : 25000) ? ss * 0.5 : 0;
    const standardDeduction = status === 2 ? 30000 : 15000;
    const totalIncome = taxableSS + pension + withdrawals + other;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);
    const brackets = status === 2
      ? [[23200, 0.10], [94300 - 23200, 0.12], [201050 - 94300, 0.22], [383900 - 201050, 0.24], [487450 - 383900, 0.32], [731200 - 487450, 0.35], [Infinity, 0.37]]
      : [[11600, 0.10], [47150 - 11600, 0.12], [100525 - 47150, 0.22], [191950 - 100525, 0.24], [243725 - 191950, 0.32], [609350 - 243725, 0.35], [Infinity, 0.37]];
    let tax = 0;
    let remaining = taxableIncome;
    let topRate = 0;
    for (const [width, rate] of brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, width);
      tax += taxable * rate;
      remaining -= taxable;
      topRate = rate;
    }
    const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
    return {
      primary: { label: "Marginal Tax Bracket", value: formatNumber(topRate * 100) + "%" },
      details: [
        { label: "Estimated Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
        { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
        { label: "Taxable Social Security", value: "$" + formatNumber(Math.round(taxableSS)) },
        { label: "After-Tax Income", value: "$" + formatNumber(Math.round(totalIncome - tax)) }
      ]
    };
  }`,
  [
    { q: "How is Social Security taxed in retirement?", a: "Up to 85 percent of Social Security benefits may be taxable depending on your provisional income. If provisional income exceeds $25,000 for singles or $32,000 for married couples, a portion of benefits becomes taxable." },
    { q: "What is the standard deduction for retirees?", a: "Retirees 65 and older receive an additional standard deduction of $1,950 for single filers or $1,550 per spouse for married filers, on top of the regular standard deduction." },
    { q: "Can I reduce my tax bracket in retirement?", a: "Strategies include Roth conversions in lower-income years, timing IRA withdrawals, managing capital gains, taking advantage of the higher standard deduction for those over 65, and choosing tax-efficient withdrawal sequencing." }
  ],
  `Provisional Income = 50% of SS + Pension + Withdrawals + Other
Taxable Income = Total Income - Standard Deduction
Tax = Sum of (Income in each bracket x bracket rate)`,
  ["retirement-tax-calculator", "retirement-income-gap-calculator"]
);

add(
  "roth-conversion-ladder-calculator",
  "Roth Conversion Ladder Calculator",
  "Plan a multi-year Roth conversion ladder strategy to move traditional IRA or 401k funds into a Roth IRA while minimizing total taxes paid over time.",
  "Finance",
  "finance",
  "$",
  ["Roth conversion ladder", "Roth conversion strategy", "IRA to Roth conversion plan", "multi-year Roth conversion"],
  [
    '{ name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 10000, max: 10000000, defaultValue: 500000 }',
    '{ name: "annualConversion", label: "Annual Conversion Amount ($)", type: "number", min: 1000, max: 1000000, defaultValue: 50000 }',
    '{ name: "currentTaxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 22 }',
    '{ name: "futureTaxRate", label: "Expected Future Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 24 }',
    '{ name: "yearsToConvert", label: "Years to Complete Conversions", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "growthRate", label: "Expected Growth Rate (%)", type: "number", min: 0, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const balance = inputs.traditionalBalance as number;
    const annualConv = inputs.annualConversion as number;
    const currentRate = inputs.currentTaxRate as number / 100;
    const futureRate = inputs.futureTaxRate as number / 100;
    const years = inputs.yearsToConvert as number;
    const growth = inputs.growthRate as number / 100;
    const totalConverted = Math.min(annualConv * years, balance);
    const taxOnConversions = totalConverted * currentRate;
    const taxIfWithdrawnLater = totalConverted * Math.pow(1 + growth, years) * futureRate;
    const taxSavings = taxIfWithdrawnLater - taxOnConversions;
    const rothValueAfter = totalConverted * Math.pow(1 + growth, years);
    const monthlyTaxCost = taxOnConversions / (years * 12);
    return {
      primary: { label: "Potential Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
      details: [
        { label: "Total Amount Converted", value: "$" + formatNumber(Math.round(totalConverted)) },
        { label: "Total Tax on Conversions", value: "$" + formatNumber(Math.round(taxOnConversions)) },
        { label: "Tax if Withdrawn Later (Traditional)", value: "$" + formatNumber(Math.round(taxIfWithdrawnLater)) },
        { label: "Roth Value After Growth", value: "$" + formatNumber(Math.round(rothValueAfter)) },
        { label: "Monthly Tax Cost", value: "$" + formatNumber(Math.round(monthlyTaxCost)) }
      ]
    };
  }`,
  [
    { q: "What is a Roth conversion ladder?", a: "A Roth conversion ladder is a strategy of converting a portion of traditional IRA or 401k funds to a Roth IRA each year over multiple years. This spreads the tax hit, potentially keeping you in lower tax brackets each year rather than converting everything at once." },
    { q: "When does a Roth conversion ladder make sense?", a: "It is most beneficial during years when your income is lower than usual, such as between early retirement and when Social Security or RMDs begin. Converting during low-income years means paying taxes at a lower rate than you would later." },
    { q: "How long do I have to wait to withdraw Roth conversions?", a: "Each Roth conversion has its own 5-year holding period before the converted amount can be withdrawn tax and penalty free. After age 59 and a half, earnings can also be withdrawn tax-free once the 5-year rule is met." }
  ],
  `Total Converted = Annual Conversion x Years (up to balance)
Tax on Conversions = Total Converted x Current Tax Rate
Future Tax Avoided = Total Converted x (1 + Growth)^Years x Future Rate
Savings = Future Tax Avoided - Tax on Conversions`,
  ["retirement-tax-bracket-calculator", "retirement-tax-calculator"]
);

add(
  "retirement-portfolio-withdrawal-calculator",
  "Retirement Portfolio Withdrawal Calculator",
  "Calculate sustainable withdrawal amounts from your retirement portfolio using various withdrawal rate strategies while accounting for inflation and investment returns.",
  "Finance",
  "finance",
  "$",
  ["retirement withdrawal rate", "safe withdrawal rate", "portfolio withdrawal calculator", "4 percent rule calculator"],
  [
    '{ name: "portfolioBalance", label: "Portfolio Balance ($)", type: "number", min: 10000, max: 50000000, defaultValue: 1000000 }',
    '{ name: "withdrawalRate", label: "Annual Withdrawal Rate (%)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 0, max: 15, defaultValue: 6 }',
    '{ name: "inflationRate", label: "Expected Inflation (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 30 }'
  ],
  `(inputs) => {
    const balance = inputs.portfolioBalance as number;
    const wr = inputs.withdrawalRate as number / 100;
    const returnRate = inputs.expectedReturn as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const firstYearWithdrawal = balance * wr;
    const monthlyWithdrawal = firstYearWithdrawal / 12;
    let remaining = balance;
    let totalWithdrawn = 0;
    let yearsDepleted = years;
    for (let y = 0; y < years; y++) {
      const withdrawal = firstYearWithdrawal * Math.pow(1 + inflation, y);
      remaining = remaining * (1 + returnRate) - withdrawal;
      totalWithdrawn += withdrawal;
      if (remaining <= 0) { yearsDepleted = y + 1; break; }
    }
    const endBalance = Math.max(0, remaining);
    const realReturn = returnRate - inflation;
    return {
      primary: { label: "First Year Withdrawal", value: "$" + formatNumber(Math.round(firstYearWithdrawal)) },
      details: [
        { label: "Monthly Withdrawal", value: "$" + formatNumber(Math.round(monthlyWithdrawal)) },
        { label: "Portfolio Lasts", value: formatNumber(yearsDepleted) + " years" },
        { label: "Ending Balance", value: "$" + formatNumber(Math.round(endBalance)) },
        { label: "Total Withdrawn", value: "$" + formatNumber(Math.round(totalWithdrawn)) },
        { label: "Real Return (after inflation)", value: formatNumber(Math.round(realReturn * 1000) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the 4 percent rule?", a: "The 4 percent rule suggests withdrawing 4 percent of your portfolio in the first year of retirement, then adjusting that dollar amount for inflation each year. Research by William Bengen found this approach historically sustained portfolios for at least 30 years." },
    { q: "Is the 4 percent rule still valid?", a: "Some financial planners now suggest a more conservative 3 to 3.5 percent rate due to lower expected future returns and longer retirements. Others argue that flexible spending strategies can support higher initial rates." },
    { q: "What happens if the market drops early in retirement?", a: "Poor returns early in retirement, known as sequence-of-returns risk, can significantly impact portfolio longevity. A major market decline in the first few years of retirement can deplete a portfolio much faster than the same decline later." }
  ],
  `First Year Withdrawal = Portfolio Balance x Withdrawal Rate
Each Year: Portfolio = Previous Balance x (1 + Return) - Inflation-Adjusted Withdrawal
Portfolio Lasts Until Balance Reaches Zero`,
  ["retirement-income-gap-calculator", "retirement-income-calculator"]
);

add(
  "sequence-of-returns-risk-calculator",
  "Sequence of Returns Risk Calculator",
  "Visualize how the order of investment returns impacts your retirement portfolio by comparing a good-first versus bad-first return sequence over your retirement.",
  "Finance",
  "finance",
  "$",
  ["sequence of returns risk", "retirement sequence risk", "return order risk", "early retirement risk"],
  [
    '{ name: "startingBalance", label: "Starting Balance ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 }',
    '{ name: "annualWithdrawal", label: "Annual Withdrawal ($)", type: "number", min: 5000, max: 500000, defaultValue: 40000 }',
    '{ name: "goodReturn", label: "Good Year Return (%)", type: "number", min: 5, max: 30, defaultValue: 15 }',
    '{ name: "badReturn", label: "Bad Year Return (%)", type: "number", min: -50, max: 0, defaultValue: -15 }',
    '{ name: "periodYears", label: "Analysis Period (Years)", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const start = inputs.startingBalance as number;
    const withdrawal = inputs.annualWithdrawal as number;
    const good = inputs.goodReturn as number / 100;
    const bad = inputs.badReturn as number / 100;
    const years = inputs.periodYears as number;
    const halfYears = Math.floor(years / 2);
    let goodFirst = start;
    let badFirst = start;
    for (let y = 0; y < years; y++) {
      const gfReturn = y < halfYears ? good : bad;
      const bfReturn = y < halfYears ? bad : good;
      goodFirst = Math.max(0, goodFirst * (1 + gfReturn) - withdrawal);
      badFirst = Math.max(0, badFirst * (1 + bfReturn) - withdrawal);
    }
    const avgReturn = (good + bad) / 2;
    let avgScenario = start;
    for (let y = 0; y < years; y++) {
      avgScenario = Math.max(0, avgScenario * (1 + avgReturn) - withdrawal);
    }
    const difference = goodFirst - badFirst;
    return {
      primary: { label: "Sequence Impact (Difference)", value: "$" + formatNumber(Math.round(Math.abs(difference))) },
      details: [
        { label: "Good Returns First - Ending", value: "$" + formatNumber(Math.round(goodFirst)) },
        { label: "Bad Returns First - Ending", value: "$" + formatNumber(Math.round(badFirst)) },
        { label: "Average Return Scenario", value: "$" + formatNumber(Math.round(avgScenario)) },
        { label: "Average Annual Return", value: formatNumber(Math.round(avgReturn * 1000) / 10) + "%" },
        { label: "Analysis Period", value: formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "What is sequence of returns risk?", a: "Sequence of returns risk is the danger that poor investment returns early in retirement can permanently impair your portfolio, even if average returns over the full period are acceptable. Withdrawing from a declining portfolio locks in losses." },
    { q: "How can I mitigate sequence of returns risk?", a: "Strategies include maintaining a cash reserve covering 1 to 2 years of expenses, using a bucket strategy, reducing withdrawals during market downturns, having flexible spending, and keeping a moderate allocation rather than being overly aggressive." },
    { q: "Why is the order of returns so important?", a: "When you are withdrawing from a portfolio, negative returns early reduce the base that must grow to sustain future withdrawals. The same average return produces vastly different outcomes depending on when the losses occur." }
  ],
  `Good First Scenario: Apply good returns for first half, bad returns for second half
Bad First Scenario: Apply bad returns for first half, good returns for second half
Each Year: Balance = Previous x (1 + Return) - Withdrawal
Sequence Impact = Good First Ending - Bad First Ending`,
  ["retirement-portfolio-withdrawal-calculator", "retirement-income-gap-calculator"]
);

add(
  "bucket-strategy-allocator-calculator",
  "Bucket Strategy Allocator Calculator",
  "Allocate your retirement portfolio across short-term, medium-term, and long-term buckets to manage cash flow and reduce sequence-of-returns risk.",
  "Finance",
  "finance",
  "$",
  ["bucket strategy", "retirement bucket plan", "time segmentation strategy", "retirement allocation buckets"],
  [
    '{ name: "totalPortfolio", label: "Total Portfolio Value ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 }',
    '{ name: "annualSpending", label: "Annual Spending Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 }',
    '{ name: "shortTermYears", label: "Short-Term Bucket (Years)", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "medTermYears", label: "Medium-Term Bucket (Years)", type: "number", min: 2, max: 10, defaultValue: 5 }',
    '{ name: "medTermReturn", label: "Medium-Term Expected Return (%)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "longTermReturn", label: "Long-Term Expected Return (%)", type: "number", min: 3, max: 15, defaultValue: 8 }'
  ],
  `(inputs) => {
    const total = inputs.totalPortfolio as number;
    const spending = inputs.annualSpending as number;
    const shortYrs = inputs.shortTermYears as number;
    const medYrs = inputs.medTermYears as number;
    const medReturn = inputs.medTermReturn as number;
    const longReturn = inputs.longTermReturn as number;
    const shortBucket = spending * shortYrs;
    const medBucket = spending * medYrs;
    const longBucket = Math.max(0, total - shortBucket - medBucket);
    const shortPct = total > 0 ? (shortBucket / total) * 100 : 0;
    const medPct = total > 0 ? (medBucket / total) * 100 : 0;
    const longPct = total > 0 ? (longBucket / total) * 100 : 0;
    const longGrowth5yr = longBucket * Math.pow(1 + longReturn / 100, 5);
    return {
      primary: { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) },
      details: [
        { label: "Short-Term Cash Bucket", value: "$" + formatNumber(Math.round(shortBucket)) + " (" + formatNumber(Math.round(shortPct)) + "%)" },
        { label: "Medium-Term Bond Bucket", value: "$" + formatNumber(Math.round(medBucket)) + " (" + formatNumber(Math.round(medPct)) + "%)" },
        { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) + " (" + formatNumber(Math.round(longPct)) + "%)" },
        { label: "Growth Bucket in 5 Years", value: "$" + formatNumber(Math.round(longGrowth5yr)) },
        { label: "Total Coverage", value: formatNumber(shortYrs + medYrs) + " years before growth bucket" }
      ]
    };
  }`,
  [
    { q: "What is the bucket strategy for retirement?", a: "The bucket strategy divides your retirement portfolio into three time-based segments: a short-term bucket of cash or equivalents for 1 to 2 years of expenses, a medium-term bucket of bonds and stable investments for 3 to 7 years, and a long-term growth bucket of stocks for beyond 7 years." },
    { q: "How does the bucket strategy reduce risk?", a: "By keeping several years of spending in safe, liquid investments, you avoid selling stocks during market downturns. The growth bucket has years to recover from volatility before you need to tap it." },
    { q: "How often should I refill the buckets?", a: "Typically you refill the short-term bucket annually by selling from the medium-term bucket when bonds perform well, or from the growth bucket during strong market years. Some advisors refill on a set schedule while others use market conditions as a guide." }
  ],
  `Short-Term Bucket = Annual Spending x Short-Term Years
Medium-Term Bucket = Annual Spending x Medium-Term Years
Long-Term Bucket = Total Portfolio - Short Bucket - Medium Bucket`,
  ["sequence-of-returns-risk-calculator", "retirement-portfolio-withdrawal-calculator"]
);

add(
  "senior-housing-cost-comparison-calculator",
  "Senior Housing Cost Comparison Calculator",
  "Compare monthly costs across different senior housing options including independent living, continuing care retirement communities, and aging in place.",
  "Finance",
  "finance",
  "$",
  ["senior housing cost", "senior living comparison", "continuing care retirement community", "aging in place cost"],
  [
    '{ name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 }',
    '{ name: "monthlyHomeExpenses", label: "Monthly Home Expenses ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 }',
    '{ name: "independentLiving", label: "Independent Living Monthly ($)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "ccrcEntryFee", label: "CCRC Entry Fee ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 }',
    '{ name: "ccrcMonthly", label: "CCRC Monthly Fee ($)", type: "number", min: 1000, max: 15000, defaultValue: 4000 }',
    '{ name: "yearsToCompare", label: "Comparison Period (Years)", type: "number", min: 5, max: 30, defaultValue: 15 }'
  ],
  `(inputs) => {
    const homeVal = inputs.currentHomeValue as number;
    const monthlyHome = inputs.monthlyHomeExpenses as number;
    const ilMonthly = inputs.independentLiving as number;
    const ccrcEntry = inputs.ccrcEntryFee as number;
    const ccrcMonthly = inputs.ccrcMonthly as number;
    const years = inputs.yearsToCompare as number;
    const agingInPlaceTotal = monthlyHome * 12 * years;
    const ilTotal = ilMonthly * 12 * years;
    const ilWithHomeSale = ilTotal - homeVal;
    const ccrcTotal = ccrcEntry + ccrcMonthly * 12 * years;
    const ccrcWithHomeSale = ccrcTotal - homeVal;
    const cheapest = Math.min(agingInPlaceTotal, ilTotal, ccrcTotal);
    const bestOption = cheapest === agingInPlaceTotal ? "Aging in Place" : cheapest === ilTotal ? "Independent Living" : "CCRC";
    return {
      primary: { label: "Most Affordable Option", value: bestOption },
      details: [
        { label: "Aging in Place Total", value: "$" + formatNumber(Math.round(agingInPlaceTotal)) },
        { label: "Independent Living Total", value: "$" + formatNumber(Math.round(ilTotal)) },
        { label: "CCRC Total (with entry fee)", value: "$" + formatNumber(Math.round(ccrcTotal)) },
        { label: "IL Net (after home sale)", value: "$" + formatNumber(Math.round(ilWithHomeSale)) },
        { label: "CCRC Net (after home sale)", value: "$" + formatNumber(Math.round(ccrcWithHomeSale)) }
      ]
    };
  }`,
  [
    { q: "What is a CCRC?", a: "A Continuing Care Retirement Community (CCRC) offers multiple levels of care in one location, from independent living to assisted living to skilled nursing. Residents typically pay a one-time entry fee plus monthly fees and can transition between care levels as needs change." },
    { q: "What does independent living typically include?", a: "Independent living communities typically include housing, meals, housekeeping, transportation, social activities, and building maintenance. Medical care and personal assistance are usually not included but may be available for additional fees." },
    { q: "Is aging in place always cheaper?", a: "Not necessarily. While aging in place avoids facility fees, costs for home modifications, in-home care, transportation, meal services, and home maintenance can add up significantly, especially as care needs increase over time." }
  ],
  `Aging in Place = Monthly Home Expenses x 12 x Years
Independent Living = Monthly Fee x 12 x Years
CCRC = Entry Fee + Monthly Fee x 12 x Years
Net Cost = Total - Home Sale Proceeds`,
  ["retirement-income-gap-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "home-care-cost-estimator-calculator",
  "Home Care Cost Estimator Calculator",
  "Estimate the monthly and annual cost of in-home care services based on hours needed, care level, and geographic location factors.",
  "Finance",
  "finance",
  "$",
  ["home care cost", "in-home care cost", "home health aide cost", "personal care cost estimator"],
  [
    '{ name: "hoursPerWeek", label: "Hours of Care Per Week", type: "number", min: 1, max: 168, defaultValue: 20 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 10, max: 75, defaultValue: 30 }',
    '{ name: "careLevel", label: "Care Level", type: "select", options: [{ value: "1", label: "Companion / Homemaker" }, { value: "2", label: "Personal Care Aide" }, { value: "3", label: "Certified Nursing Assistant" }, { value: "4", label: "Licensed Practical Nurse" }], defaultValue: "2" }',
    '{ name: "locationFactor", label: "Location Cost Factor", type: "select", options: [{ value: "0.85", label: "Rural / Low Cost" }, { value: "1.0", label: "Average / Suburban" }, { value: "1.2", label: "Urban / High Cost" }, { value: "1.4", label: "Major Metro / Very High Cost" }], defaultValue: "1.0" }',
    '{ name: "weeksPerYear", label: "Weeks of Care Per Year", type: "number", min: 1, max: 52, defaultValue: 52 }'
  ],
  `(inputs) => {
    const hours = inputs.hoursPerWeek as number;
    const rate = inputs.hourlyRate as number;
    const level = parseInt(inputs.careLevel as string);
    const locFactor = parseFloat(inputs.locationFactor as string);
    const weeks = inputs.weeksPerYear as number;
    const levelMultiplier = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.5 };
    const adjRate = rate * (levelMultiplier[level] || 1) * locFactor;
    const weeklyCost = hours * adjRate;
    const monthlyCost = weeklyCost * (weeks / 12);
    const annualCost = weeklyCost * weeks;
    const dailyEquivalent = hours > 0 ? adjRate * (hours / 7) : 0;
    return {
      primary: { label: "Monthly Home Care Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
      details: [
        { label: "Adjusted Hourly Rate", value: "$" + formatNumber(Math.round(adjRate * 100) / 100) },
        { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weeklyCost)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Daily Equivalent", value: "$" + formatNumber(Math.round(dailyEquivalent)) },
        { label: "Total Hours Per Year", value: formatNumber(Math.round(hours * weeks)) }
      ]
    };
  }`,
  [
    { q: "What is the average cost of home care?", a: "The national median cost for a home health aide is approximately $30 to $33 per hour. Costs vary significantly by location, ranging from $20 per hour in rural areas to over $40 per hour in major metropolitan areas." },
    { q: "Does Medicare cover home care?", a: "Medicare covers limited home health services when medically necessary and ordered by a doctor, including skilled nursing and therapy. It does not cover personal care, homemaker services, or around-the-clock care." },
    { q: "What is the difference between home care and home health care?", a: "Home care refers to non-medical assistance such as help with bathing, dressing, cooking, and housekeeping. Home health care involves medical services like wound care, medication management, and physical therapy, provided by licensed professionals." }
  ],
  `Adjusted Rate = Base Rate x Care Level Multiplier x Location Factor
Weekly Cost = Hours Per Week x Adjusted Rate
Monthly Cost = Weekly Cost x (Weeks Per Year / 12)
Annual Cost = Weekly Cost x Weeks Per Year`,
  ["retirement-healthcare-cost-calculator", "senior-housing-cost-comparison-calculator"]
);

add(
  "retirement-relocation-cost-calculator",
  "Retirement Relocation Cost Calculator",
  "Compare the financial impact of relocating in retirement by analyzing differences in housing costs, taxes, healthcare, and cost of living between two locations.",
  "Finance",
  "finance",
  "$",
  ["retirement relocation", "retirement moving cost", "retire in another state", "retirement cost of living comparison"],
  [
    '{ name: "currentMonthlyExpenses", label: "Current Monthly Expenses ($)", type: "number", min: 1000, max: 30000, defaultValue: 5000 }',
    '{ name: "costOfLivingDiff", label: "New Location Cost of Living Difference (%)", type: "number", min: -50, max: 50, defaultValue: -15 }',
    '{ name: "currentHomeValue", label: "Current Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 400000 }',
    '{ name: "newHomePrice", label: "New Home Price ($)", type: "number", min: 50000, max: 5000000, defaultValue: 300000 }',
    '{ name: "movingCosts", label: "Moving and Transition Costs ($)", type: "number", min: 0, max: 100000, defaultValue: 15000 }',
    '{ name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const currentExp = inputs.currentMonthlyExpenses as number;
    const colDiff = inputs.costOfLivingDiff as number / 100;
    const currentHome = inputs.currentHomeValue as number;
    const newHome = inputs.newHomePrice as number;
    const moving = inputs.movingCosts as number;
    const years = inputs.yearsInRetirement as number;
    const newMonthlyExp = currentExp * (1 + colDiff);
    const monthlySavings = currentExp - newMonthlyExp;
    const annualSavings = monthlySavings * 12;
    const homeEquityFreed = currentHome - newHome;
    const totalSavingsOverTime = annualSavings * years + homeEquityFreed - moving;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil((moving - homeEquityFreed) / monthlySavings) : 0;
    return {
      primary: { label: "Total Financial Impact", value: "$" + formatNumber(Math.round(totalSavingsOverTime)) },
      details: [
        { label: "New Monthly Expenses", value: "$" + formatNumber(Math.round(newMonthlyExp)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Home Equity Freed Up", value: "$" + formatNumber(Math.round(homeEquityFreed)) },
        { label: "Moving Costs", value: "$" + formatNumber(Math.round(moving)) },
        { label: "Break-Even Period", value: breakEvenMonths > 0 ? formatNumber(breakEvenMonths) + " months" : "Immediate savings" }
      ]
    };
  }`,
  [
    { q: "What are the best states to retire in for low taxes?", a: "States with no income tax include Florida, Texas, Nevada, Wyoming, Washington, Alaska, South Dakota, Tennessee, and New Hampshire. However, consider total tax burden including property taxes, sales tax, and estate taxes when comparing." },
    { q: "What costs should I consider when relocating in retirement?", a: "Beyond the obvious moving costs, consider differences in property taxes, income taxes, sales taxes, healthcare costs, insurance rates, utility costs, and proximity to family. Also factor in potential changes to your social network and lifestyle." },
    { q: "How do I calculate cost of living differences?", a: "Use cost of living indices from the Bureau of Economic Analysis or online calculators. These compare expenses like housing, food, transportation, healthcare, and utilities. A negative percentage means the new location is less expensive." }
  ],
  `New Monthly Expenses = Current x (1 + Cost of Living Difference %)
Monthly Savings = Current - New Expenses
Total Impact = (Annual Savings x Years) + Home Equity Freed - Moving Costs`,
  ["retirement-income-gap-calculator", "senior-housing-cost-comparison-calculator"]
);

add(
  "charitable-remainder-trust-calculator",
  "Charitable Remainder Trust Calculator",
  "Calculate the income stream, tax deduction, and remainder value of a charitable remainder trust (CRT) to plan your philanthropic and tax strategy.",
  "Finance",
  "finance",
  "$",
  ["charitable remainder trust", "CRT calculator", "charitable trust income", "planned giving calculator"],
  [
    '{ name: "assetValue", label: "Asset Value Donated ($)", type: "number", min: 50000, max: 50000000, defaultValue: 500000 }',
    '{ name: "payoutRate", label: "Annual Payout Rate (%)", type: "number", min: 5, max: 50, defaultValue: 7 }',
    '{ name: "trustTerm", label: "Trust Term (Years)", type: "number", min: 5, max: 30, defaultValue: 20 }',
    '{ name: "investmentReturn", label: "Expected Investment Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 }',
    '{ name: "taxRate", label: "Your Marginal Tax Rate (%)", type: "number", min: 10, max: 50, defaultValue: 32 }'
  ],
  `(inputs) => {
    const assetVal = inputs.assetValue as number;
    const payoutRate = inputs.payoutRate as number / 100;
    const term = inputs.trustTerm as number;
    const investReturn = inputs.investmentReturn as number / 100;
    const taxRate = inputs.taxRate as number / 100;
    const annualPayout = assetVal * payoutRate;
    const totalPayouts = annualPayout * term;
    let trustBalance = assetVal;
    for (let y = 0; y < term; y++) {
      trustBalance = trustBalance * (1 + investReturn) - annualPayout;
      if (trustBalance < 0) { trustBalance = 0; break; }
    }
    const remainderValue = Math.max(0, trustBalance);
    const remainderPct = assetVal > 0 ? (remainderValue / assetVal) * 100 : 0;
    const estimatedDeduction = assetVal * Math.max(0.10, 1 - payoutRate * term * 0.04);
    const taxSavings = estimatedDeduction * taxRate;
    return {
      primary: { label: "Annual Income from Trust", value: "$" + formatNumber(Math.round(annualPayout)) },
      details: [
        { label: "Monthly Income", value: "$" + formatNumber(Math.round(annualPayout / 12)) },
        { label: "Total Income Over Term", value: "$" + formatNumber(Math.round(totalPayouts)) },
        { label: "Estimated Charitable Remainder", value: "$" + formatNumber(Math.round(remainderValue)) },
        { label: "Estimated Tax Deduction", value: "$" + formatNumber(Math.round(estimatedDeduction)) },
        { label: "Estimated Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) }
      ]
    };
  }`,
  [
    { q: "What is a charitable remainder trust?", a: "A CRT is an irrevocable trust that provides income to you or other beneficiaries for a period of years or for life, after which the remaining assets go to a designated charity. You receive an income tax deduction in the year the trust is established." },
    { q: "What are the tax benefits of a CRT?", a: "You receive a partial income tax deduction for the present value of the future charitable gift. You avoid capital gains tax on appreciated assets donated to the trust. The trust itself is tax-exempt, allowing assets to grow without annual taxation." },
    { q: "What is the minimum payout rate for a CRT?", a: "The IRS requires a minimum annual payout rate of 5 percent and a maximum of 50 percent. Additionally, the present value of the remainder interest must be at least 10 percent of the initial contribution value." }
  ],
  `Annual Payout = Asset Value x Payout Rate
Trust Growth: Balance = Previous x (1 + Return) - Payout each year
Remainder = Trust balance after term expires
Tax Deduction = Present value of future charitable remainder`,
  ["retirement-tax-bracket-calculator", "retirement-income-gap-calculator"]
);

add(
  "required-savings-rate-calculator",
  "Required Savings Rate Calculator",
  "Calculate the percentage of income you need to save each year to reach your retirement savings goal based on current age, target retirement age, and expected returns.",
  "Finance",
  "finance",
  "$",
  ["required savings rate", "retirement savings rate", "how much to save for retirement", "savings rate calculator"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 18, max: 70, defaultValue: 35 }',
    '{ name: "retirementAge", label: "Target Retirement Age", type: "number", min: 50, max: 80, defaultValue: 65 }',
    '{ name: "annualIncome", label: "Annual Income ($)", type: "number", min: 20000, max: 2000000, defaultValue: 80000 }',
    '{ name: "currentSavings", label: "Current Retirement Savings ($)", type: "number", min: 0, max: 20000000, defaultValue: 50000 }',
    '{ name: "retirementGoal", label: "Retirement Savings Goal ($)", type: "number", min: 100000, max: 50000000, defaultValue: 1500000 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 1, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const age = inputs.currentAge as number;
    const retireAge = inputs.retirementAge as number;
    const income = inputs.annualIncome as number;
    const current = inputs.currentSavings as number;
    const goal = inputs.retirementGoal as number;
    const returnRate = inputs.expectedReturn as number / 100;
    const years = Math.max(1, retireAge - age);
    const futureValueOfCurrent = current * Math.pow(1 + returnRate, years);
    const gap = Math.max(0, goal - futureValueOfCurrent);
    const annuityFactor = returnRate > 0 ? (Math.pow(1 + returnRate, years) - 1) / returnRate : years;
    const annualSavingsNeeded = annuityFactor > 0 ? gap / annuityFactor : gap / years;
    const savingsRate = income > 0 ? (annualSavingsNeeded / income) * 100 : 0;
    const monthlySavings = annualSavingsNeeded / 12;
    return {
      primary: { label: "Required Savings Rate", value: formatNumber(Math.round(savingsRate * 10) / 10) + "%" },
      details: [
        { label: "Annual Savings Needed", value: "$" + formatNumber(Math.round(annualSavingsNeeded)) },
        { label: "Monthly Savings Needed", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Current Savings Future Value", value: "$" + formatNumber(Math.round(futureValueOfCurrent)) },
        { label: "Remaining Gap to Fill", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Years to Retirement", value: formatNumber(years) }
      ]
    };
  }`,
  [
    { q: "How much of my income should I save for retirement?", a: "A common guideline is to save 10 to 15 percent of your gross income, but the right amount depends on when you start, your retirement goals, and expected Social Security benefits. Starting later requires a higher savings rate." },
    { q: "What is the savings rate needed if I start late?", a: "Starting at 25 may require saving about 10 to 12 percent. Starting at 35 may require 15 to 20 percent. Starting at 45 may require 25 to 35 percent or more to accumulate the same retirement nest egg." },
    { q: "Does employer match count toward my savings rate?", a: "Yes, an employer match effectively increases your savings rate. If you contribute 6 percent and your employer matches 3 percent, your total savings rate is 9 percent. Always contribute at least enough to capture the full employer match." }
  ],
  `Future Value of Current Savings = Current x (1 + Return)^Years
Gap = Goal - Future Value of Current Savings
Annual Savings = Gap / ((1 + Return)^Years - 1) / Return)
Savings Rate = Annual Savings / Annual Income x 100`,
  ["retirement-income-gap-calculator", "401k-employer-match-maximizer-calculator"]
);

add(
  "retirement-spending-calculator",
  "Retirement Spending Calculator",
  "Project your total retirement spending needs by category including housing, healthcare, food, transportation, and leisure, adjusted for inflation over your retirement years.",
  "Finance",
  "finance",
  "$",
  ["retirement spending", "retirement budget", "retirement expenses calculator", "spending in retirement"],
  [
    '{ name: "monthlyHousing", label: "Monthly Housing ($)", type: "number", min: 0, max: 20000, defaultValue: 1500 }',
    '{ name: "monthlyHealthcare", label: "Monthly Healthcare ($)", type: "number", min: 0, max: 10000, defaultValue: 600 }',
    '{ name: "monthlyFood", label: "Monthly Food ($)", type: "number", min: 0, max: 5000, defaultValue: 800 }',
    '{ name: "monthlyTransport", label: "Monthly Transportation ($)", type: "number", min: 0, max: 3000, defaultValue: 400 }',
    '{ name: "monthlyLeisure", label: "Monthly Leisure and Travel ($)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "monthlyOther", label: "Monthly Other Expenses ($)", type: "number", min: 0, max: 10000, defaultValue: 400 }',
    '{ name: "inflationRate", label: "Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 }'
  ],
  `(inputs) => {
    const housing = inputs.monthlyHousing as number;
    const health = inputs.monthlyHealthcare as number;
    const food = inputs.monthlyFood as number;
    const transport = inputs.monthlyTransport as number;
    const leisure = inputs.monthlyLeisure as number;
    const other = inputs.monthlyOther as number;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const monthlyTotal = housing + health + food + transport + leisure + other;
    const annualTotal = monthlyTotal * 12;
    let totalSpending = 0;
    for (let y = 0; y < years; y++) {
      totalSpending += annualTotal * Math.pow(1 + inflation, y);
    }
    const lastYearSpending = annualTotal * Math.pow(1 + inflation, years - 1);
    const avgAnnual = totalSpending / years;
    return {
      primary: { label: "Total Lifetime Retirement Spending", value: "$" + formatNumber(Math.round(totalSpending)) },
      details: [
        { label: "Monthly Spending (Year 1)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Annual Spending (Year 1)", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Annual Spending (Final Year)", value: "$" + formatNumber(Math.round(lastYearSpending)) },
        { label: "Average Annual Spending", value: "$" + formatNumber(Math.round(avgAnnual)) },
        { label: "Inflation Impact", value: "$" + formatNumber(Math.round(totalSpending - annualTotal * years)) + " over " + formatNumber(years) + " years" }
      ]
    };
  }`,
  [
    { q: "How much will I spend in retirement?", a: "Most retirees spend 70 to 80 percent of their pre-retirement income, but this varies widely. Housing and healthcare typically represent the largest categories. Spending often follows a smile pattern: higher early on, declining in middle years, then rising again with increased healthcare needs." },
    { q: "Which expenses increase most in retirement?", a: "Healthcare costs tend to increase the most, often rising 5 to 7 percent annually. Property taxes, insurance premiums, and long-term care costs also tend to grow faster than general inflation." },
    { q: "Should I plan for the same spending throughout retirement?", a: "No. Research suggests retirees tend to spend more in the early active years on travel and hobbies, less in the middle quiet years, and more again in later years on healthcare and assistance. A dynamic spending plan is more realistic than assuming flat expenses." }
  ],
  `Monthly Total = Housing + Healthcare + Food + Transport + Leisure + Other
Annual Total = Monthly Total x 12
Year N Spending = Annual Total x (1 + Inflation)^N
Lifetime Total = Sum of all years`,
  ["retirement-income-gap-calculator", "retirement-portfolio-withdrawal-calculator"]
);

add(
  "pension-cola-impact-calculator",
  "Pension COLA Impact Calculator",
  "Calculate how a cost-of-living adjustment (COLA) affects the real purchasing power of your pension benefit over time compared to a pension without adjustments.",
  "Finance",
  "finance",
  "$",
  ["pension COLA", "cost of living adjustment pension", "pension inflation protection", "COLA impact retirement"],
  [
    '{ name: "monthlyPension", label: "Monthly Pension Benefit ($)", type: "number", min: 500, max: 20000, defaultValue: 2500 }',
    '{ name: "colaRate", label: "Annual COLA Rate (%)", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "inflationRate", label: "Expected Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 25 }'
  ],
  `(inputs) => {
    const pension = inputs.monthlyPension as number;
    const cola = inputs.colaRate as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.yearsInRetirement as number;
    const pensionWithCola = pension * Math.pow(1 + cola, years);
    const purchasingPowerWithCola = pensionWithCola / Math.pow(1 + inflation, years);
    const purchasingPowerNoCola = pension / Math.pow(1 + inflation, years);
    let totalWithCola = 0;
    let totalNoCola = 0;
    for (let y = 0; y < years; y++) {
      totalWithCola += pension * Math.pow(1 + cola, y) * 12;
      totalNoCola += pension * 12;
    }
    const extraFromCola = totalWithCola - totalNoCola;
    const realValueLossNoCola = pension - purchasingPowerNoCola;
    return {
      primary: { label: "Extra Lifetime Income from COLA", value: "$" + formatNumber(Math.round(extraFromCola)) },
      details: [
        { label: "Monthly Pension After " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(pensionWithCola)) },
        { label: "Real Purchasing Power (with COLA)", value: "$" + formatNumber(Math.round(purchasingPowerWithCola)) + "/mo" },
        { label: "Real Purchasing Power (no COLA)", value: "$" + formatNumber(Math.round(purchasingPowerNoCola)) + "/mo" },
        { label: "Total Lifetime Pension (with COLA)", value: "$" + formatNumber(Math.round(totalWithCola)) },
        { label: "Total Lifetime Pension (no COLA)", value: "$" + formatNumber(Math.round(totalNoCola)) }
      ]
    };
  }`,
  [
    { q: "What is a pension COLA?", a: "A pension Cost-of-Living Adjustment (COLA) is an annual increase to your pension payment, typically based on inflation measures like the CPI. It helps maintain your purchasing power as prices rise over time." },
    { q: "Do all pensions have COLA adjustments?", a: "No. Many private pensions do not include COLA provisions. Government pensions, Social Security, and military pensions typically include some form of COLA. If your pension lacks COLA, you need to plan for inflation eroding your benefit over time." },
    { q: "How much does inflation erode a fixed pension?", a: "At 3 percent annual inflation, a fixed pension loses about 26 percent of its purchasing power in 10 years and nearly 53 percent in 25 years. A $2,500 monthly pension would feel like only about $1,180 in todays dollars after 25 years." }
  ],
  `Pension After N Years = Monthly Pension x (1 + COLA)^N
Real Value = Nominal Value / (1 + Inflation)^N
Total COLA Benefit = Sum of COLA-adjusted payments - Sum of fixed payments`,
  ["pension-benefit-estimator-calculator", "retirement-income-gap-calculator"]
);

add(
  "social-security-spousal-benefit-calculator",
  "Social Security Spousal Benefit Calculator",
  "Calculate the optimal Social Security spousal benefit strategy by comparing individual and spousal benefit amounts at different claiming ages.",
  "Finance",
  "finance",
  "$",
  ["Social Security spousal benefit", "spousal benefit calculator", "spouse Social Security", "married Social Security"],
  [
    '{ name: "workerBenefitFRA", label: "Worker Benefit at FRA ($)", type: "number", min: 500, max: 10000, defaultValue: 2500 }',
    '{ name: "spouseBenefitFRA", label: "Spouse Own Benefit at FRA ($)", type: "number", min: 0, max: 10000, defaultValue: 800 }',
    '{ name: "workerClaimAge", label: "Worker Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 }',
    '{ name: "spouseClaimAge", label: "Spouse Claiming Age", type: "number", min: 62, max: 70, defaultValue: 67 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 }'
  ],
  `(inputs) => {
    const workerFRA = inputs.workerBenefitFRA as number;
    const spouseOwnFRA = inputs.spouseBenefitFRA as number;
    const workerAge = inputs.workerClaimAge as number;
    const spouseAge = inputs.spouseClaimAge as number;
    const fra = inputs.fra as number;
    const workerAdj = workerAge < fra ? workerFRA * (1 - (fra - workerAge) * 0.0667) : workerFRA * (1 + (workerAge - fra) * 0.08);
    const spouseOwnAdj = spouseAge < fra ? spouseOwnFRA * (1 - (fra - spouseAge) * 0.0667) : spouseOwnFRA * (1 + (spouseAge - fra) * 0.08);
    const maxSpousalAtFRA = workerFRA * 0.5;
    const spousalBenefit = Math.max(0, maxSpousalAtFRA - spouseOwnFRA);
    const spouseReducedSpousal = spouseAge < fra ? spousalBenefit * (1 - (fra - spouseAge) * 0.05) : spousalBenefit;
    const totalSpouseBenefit = spouseOwnAdj + Math.max(0, spouseReducedSpousal);
    const betterOption = totalSpouseBenefit > spouseOwnAdj ? "Spousal Benefit is Higher" : "Own Benefit is Higher";
    const combinedMonthly = workerAdj + totalSpouseBenefit;
    return {
      primary: { label: "Combined Monthly Benefit", value: "$" + formatNumber(Math.round(combinedMonthly)) },
      details: [
        { label: "Worker Monthly Benefit", value: "$" + formatNumber(Math.round(workerAdj)) },
        { label: "Spouse Total Monthly Benefit", value: "$" + formatNumber(Math.round(totalSpouseBenefit)) },
        { label: "Spouse Own Benefit (adjusted)", value: "$" + formatNumber(Math.round(spouseOwnAdj)) },
        { label: "Spousal Top-Up Amount", value: "$" + formatNumber(Math.round(Math.max(0, spouseReducedSpousal))) },
        { label: "Recommendation", value: betterOption }
      ]
    };
  }`,
  [
    { q: "What is the Social Security spousal benefit?", a: "The spousal benefit allows a married person to receive up to 50 percent of their higher-earning spouse benefit at full retirement age, if that amount is more than their own benefit. The higher-earning spouse must have filed for benefits for the spousal benefit to begin." },
    { q: "Can I receive both my own benefit and a spousal benefit?", a: "You cannot receive both in full. When you apply, Social Security automatically pays your own benefit first. If the spousal amount is higher, you receive a top-up to bring you to the spousal level. The combined amount equals the higher of the two." },
    { q: "Does the spousal benefit increase if I delay past FRA?", a: "No. Unlike your own benefit, the spousal benefit does not increase with delayed retirement credits past full retirement age. The maximum spousal benefit is 50 percent of the worker benefit at FRA." }
  ],
  `Worker Adjusted = FRA Benefit x (1 +/- age adjustment)
Max Spousal = 50% of Worker FRA Benefit
Spousal Top-Up = max(0, Max Spousal - Spouse Own FRA Benefit)
Combined = Worker Benefit + max(Spouse Own, Spouse Own + Top-Up)`,
  ["retirement-income-gap-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "long-term-care-needs-calculator",
  "Long-Term Care Needs Calculator",
  "Estimate the potential cost of long-term care services based on your age, health risk factors, and the type and duration of care you may need.",
  "Finance",
  "finance",
  "$",
  ["long-term care cost", "LTC needs estimator", "nursing care planning", "long-term care planning"],
  [
    '{ name: "currentAge", label: "Current Age", type: "number", min: 40, max: 80, defaultValue: 60 }',
    '{ name: "careType", label: "Expected Care Type", type: "select", options: [{ value: "1", label: "Home Health Aide" }, { value: "2", label: "Assisted Living Facility" }, { value: "3", label: "Nursing Home (Semi-Private)" }, { value: "4", label: "Nursing Home (Private Room)" }], defaultValue: "2" }',
    '{ name: "expectedDuration", label: "Expected Duration of Care (Years)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "yearsUntilNeed", label: "Estimated Years Until Care Needed", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "inflationRate", label: "LTC Cost Inflation (%)", type: "number", min: 2, max: 8, defaultValue: 4 }'
  ],
  `(inputs) => {
    const age = inputs.currentAge as number;
    const careType = parseInt(inputs.careType as string);
    const duration = inputs.expectedDuration as number;
    const yearsUntil = inputs.yearsUntilNeed as number;
    const inflation = inputs.inflationRate as number / 100;
    const currentCosts = { 1: 62000, 2: 64200, 3: 100375, 4: 116800 };
    const baseCost = currentCosts[careType] || 64200;
    const futureCost = baseCost * Math.pow(1 + inflation, yearsUntil);
    let totalCost = 0;
    for (let y = 0; y < duration; y++) {
      totalCost += futureCost * Math.pow(1 + inflation, y);
    }
    const monthlyCostAtStart = futureCost / 12;
    const needAge = age + yearsUntil;
    return {
      primary: { label: "Estimated Total LTC Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Annual Cost at Start of Care", value: "$" + formatNumber(Math.round(futureCost)) },
        { label: "Monthly Cost at Start of Care", value: "$" + formatNumber(Math.round(monthlyCostAtStart)) },
        { label: "Current Annual Cost (Today)", value: "$" + formatNumber(Math.round(baseCost)) },
        { label: "Estimated Age at Start of Care", value: formatNumber(needAge) },
        { label: "Care Duration", value: formatNumber(duration) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the average length of long-term care?", a: "The average person who reaches age 65 has about a 70 percent chance of needing long-term care. Women need care for an average of 3.7 years and men for about 2.2 years, though some individuals may need care for much longer." },
    { q: "How much does long-term care cost today?", a: "National median costs in 2023 are approximately $62,000 per year for a home health aide, $64,200 for assisted living, $100,375 for a semi-private nursing home room, and $116,800 for a private nursing home room." },
    { q: "What are the options to pay for long-term care?", a: "Options include long-term care insurance, personal savings, Medicaid (for those who qualify), hybrid life insurance with LTC riders, Health Savings Accounts, Veterans benefits, and reverse mortgages. Medicare covers only limited short-term skilled care." }
  ],
  `Future Annual Cost = Current Cost x (1 + Inflation)^Years Until Need
Total Cost = Sum of Future Cost x (1 + Inflation)^y for each year of care
Monthly Cost = Annual Cost / 12`,
  ["retirement-healthcare-cost-calculator", "home-care-cost-estimator-calculator"]
);

add(
  "retirement-account-consolidation-calculator",
  "Retirement Account Consolidation Calculator",
  "Evaluate the potential fee savings and simplification benefits of consolidating multiple retirement accounts into fewer accounts.",
  "Finance",
  "finance",
  "$",
  ["retirement account consolidation", "401k rollover calculator", "IRA consolidation", "combine retirement accounts"],
  [
    '{ name: "account1Balance", label: "Account 1 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 150000 }',
    '{ name: "account1Fee", label: "Account 1 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.85 }',
    '{ name: "account2Balance", label: "Account 2 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 75000 }',
    '{ name: "account2Fee", label: "Account 2 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 1.2 }',
    '{ name: "account3Balance", label: "Account 3 Balance ($)", type: "number", min: 0, max: 10000000, defaultValue: 50000 }',
    '{ name: "account3Fee", label: "Account 3 Annual Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.95 }',
    '{ name: "consolidatedFee", label: "Consolidated Account Fee (%)", type: "number", min: 0, max: 3, defaultValue: 0.25 }',
    '{ name: "yearsToProject", label: "Years to Project", type: "number", min: 5, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const b1 = inputs.account1Balance as number;
    const f1 = inputs.account1Fee as number / 100;
    const b2 = inputs.account2Balance as number;
    const f2 = inputs.account2Fee as number / 100;
    const b3 = inputs.account3Balance as number;
    const f3 = inputs.account3Fee as number / 100;
    const cf = inputs.consolidatedFee as number / 100;
    const years = inputs.yearsToProject as number;
    const totalBalance = b1 + b2 + b3;
    const currentFees = b1 * f1 + b2 * f2 + b3 * f3;
    const consolidatedFees = totalBalance * cf;
    const annualSavings = currentFees - consolidatedFees;
    const weightedFee = totalBalance > 0 ? (currentFees / totalBalance) * 100 : 0;
    let totalSavings = 0;
    for (let y = 0; y < years; y++) {
      totalSavings += annualSavings * Math.pow(1.06, y);
    }
    return {
      primary: { label: "Annual Fee Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
      details: [
        { label: "Current Total Fees", value: "$" + formatNumber(Math.round(currentFees)) + "/yr" },
        { label: "Consolidated Fees", value: "$" + formatNumber(Math.round(consolidatedFees)) + "/yr" },
        { label: "Current Weighted Fee", value: formatNumber(Math.round(weightedFee * 100) / 100) + "%" },
        { label: "Total Balance", value: "$" + formatNumber(Math.round(totalBalance)) },
        { label: "Projected Savings Over " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(totalSavings)) }
      ]
    };
  }`,
  [
    { q: "Should I consolidate my retirement accounts?", a: "Consolidation often makes sense when you have multiple old 401k plans with high fees. Benefits include simplified management, potentially lower fees, easier asset allocation, and streamlined required minimum distributions. However, consider any unique benefits of existing plans before rolling over." },
    { q: "What is the difference between a rollover and a transfer?", a: "A direct transfer (trustee-to-trustee) moves funds between accounts without you touching the money, avoiding withholding and penalties. A rollover gives you the funds for up to 60 days, during which you must deposit them into the new account to avoid taxes and penalties." },
    { q: "Can I roll a 401k into an IRA?", a: "Yes, you can roll a traditional 401k into a traditional IRA or a Roth 401k into a Roth IRA tax-free. Rolling a traditional 401k into a Roth IRA triggers a taxable Roth conversion on the full amount." }
  ],
  `Current Annual Fees = Sum of (Balance x Fee %) for each account
Consolidated Fees = Total Balance x New Fee %
Annual Savings = Current Fees - Consolidated Fees
Projected Savings = Sum of Annual Savings x (1.06)^year`,
  ["401k-employer-match-maximizer-calculator", "roth-conversion-ladder-calculator"]
);

add(
  "social-security-earnings-test-calculator",
  "Social Security Earnings Test Calculator",
  "Calculate how much of your Social Security benefits will be withheld if you continue working while collecting benefits before your full retirement age.",
  "Finance",
  "finance",
  "$",
  ["Social Security earnings test", "Social Security work limit", "working while collecting Social Security", "earnings limit Social Security"],
  [
    '{ name: "annualEarnings", label: "Expected Annual Earnings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 }',
    '{ name: "monthlyBenefit", label: "Monthly Social Security Benefit ($)", type: "number", min: 500, max: 10000, defaultValue: 1800 }',
    '{ name: "age", label: "Your Age", type: "number", min: 62, max: 69, defaultValue: 63 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", min: 66, max: 67, defaultValue: 67 }',
    '{ name: "earningsLimit", label: "Annual Earnings Limit ($)", type: "number", min: 10000, max: 100000, defaultValue: 22320 }'
  ],
  `(inputs) => {
    const earnings = inputs.annualEarnings as number;
    const benefit = inputs.monthlyBenefit as number;
    const age = inputs.age as number;
    const fra = inputs.fra as number;
    const limit = inputs.earningsLimit as number;
    const isYearOfFRA = age === fra - 1 || age === fra;
    const excessEarnings = Math.max(0, earnings - limit);
    const withheldRate = isYearOfFRA ? 3 : 2;
    const annualBenefit = benefit * 12;
    const amountWithheld = Math.min(annualBenefit, Math.floor(excessEarnings / withheldRate));
    const benefitReceived = annualBenefit - amountWithheld;
    const monthsWithheld = benefit > 0 ? Math.ceil(amountWithheld / benefit) : 0;
    const effectiveBenefit = benefitReceived / 12;
    return {
      primary: { label: "Annual Benefits Withheld", value: "$" + formatNumber(Math.round(amountWithheld)) },
      details: [
        { label: "Excess Earnings Above Limit", value: "$" + formatNumber(Math.round(excessEarnings)) },
        { label: "Withholding Rate", value: "$1 per $" + formatNumber(withheldRate) + " over limit" },
        { label: "Annual Benefits Received", value: "$" + formatNumber(Math.round(benefitReceived)) },
        { label: "Effective Monthly Benefit", value: "$" + formatNumber(Math.round(effectiveBenefit)) },
        { label: "Months of Benefits Withheld", value: formatNumber(monthsWithheld) }
      ]
    };
  }`,
  [
    { q: "What is the Social Security earnings test?", a: "If you collect Social Security before your full retirement age and earn more than the annual limit, benefits are temporarily reduced. In 2024, $1 is withheld for every $2 you earn above $22,320. In the year you reach FRA, $1 is withheld for every $3 above a higher limit." },
    { q: "Are withheld benefits lost forever?", a: "No. Benefits withheld due to the earnings test are not lost permanently. When you reach full retirement age, Social Security recalculates your benefit upward to credit you for the months benefits were withheld, resulting in higher monthly payments going forward." },
    { q: "Does the earnings test apply after full retirement age?", a: "No. Once you reach your full retirement age, the earnings test no longer applies. You can earn any amount without any reduction in your Social Security benefits." }
  ],
  `Excess Earnings = Annual Earnings - Earnings Limit
Before FRA Year: Withheld = Excess / 2
In FRA Year: Withheld = Excess / 3
Benefits Received = Annual Benefit - Amount Withheld`,
  ["social-security-spousal-benefit-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "medicare-irmaa-surcharge-calculator",
  "Medicare IRMAA Surcharge Calculator",
  "Calculate your Medicare Income-Related Monthly Adjustment Amount (IRMAA) surcharge based on your modified adjusted gross income from two years prior.",
  "Health",
  "health",
  "H",
  ["Medicare IRMAA", "Medicare surcharge", "Medicare income surcharge", "IRMAA calculator"],
  [
    '{ name: "magi", label: "Modified Adjusted Gross Income ($)", type: "number", min: 0, max: 5000000, defaultValue: 120000 }',
    '{ name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single / Head of Household" }, { value: "2", label: "Married Filing Jointly" }, { value: "3", label: "Married Filing Separately" }], defaultValue: "1" }',
    '{ name: "basePartB", label: "Standard Part B Premium ($/mo)", type: "number", min: 100, max: 500, defaultValue: 174.70 }',
    '{ name: "basePartD", label: "Base Part D Premium ($/mo)", type: "number", min: 0, max: 200, defaultValue: 55 }'
  ],
  `(inputs) => {
    const magi = inputs.magi as number;
    const status = parseInt(inputs.filingStatus as string);
    const baseB = inputs.basePartB as number;
    const baseD = inputs.basePartD as number;
    const single = [
      [103000, 0], [129000, 69.90], [161000, 174.70], [193000, 279.50], [500000, 384.30], [Infinity, 419.30]
    ];
    const joint = [
      [206000, 0], [258000, 69.90], [322000, 174.70], [386000, 279.50], [750000, 384.30], [Infinity, 419.30]
    ];
    const sep = [
      [103000, 0], [397000, 384.30], [Infinity, 419.30]
    ];
    const brackets = status === 2 ? joint : status === 3 ? sep : single;
    let partBSurcharge = 0;
    for (const [threshold, surcharge] of brackets) {
      if (magi <= threshold) { partBSurcharge = surcharge; break; }
    }
    const partDSurcharges = [0, 12.90, 33.30, 53.80, 74.20, 81.00];
    let bracketIndex = 0;
    for (let i = 0; i < brackets.length; i++) {
      if (magi <= brackets[i][0]) { bracketIndex = i; break; }
    }
    const partDSurcharge = partDSurcharges[Math.min(bracketIndex, partDSurcharges.length - 1)] || 0;
    const totalMonthlyPartB = baseB + partBSurcharge;
    const totalMonthlyPartD = baseD + partDSurcharge;
    const annualSurcharge = (partBSurcharge + partDSurcharge) * 12;
    return {
      primary: { label: "Monthly IRMAA Surcharge", value: "$" + formatNumber(Math.round((partBSurcharge + partDSurcharge) * 100) / 100) },
      details: [
        { label: "Part B Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartB * 100) / 100) },
        { label: "Part D Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartD * 100) / 100) },
        { label: "Part B Surcharge", value: "$" + formatNumber(Math.round(partBSurcharge * 100) / 100) + "/mo" },
        { label: "Part D Surcharge", value: "$" + formatNumber(Math.round(partDSurcharge * 100) / 100) + "/mo" },
        { label: "Annual IRMAA Cost", value: "$" + formatNumber(Math.round(annualSurcharge)) }
      ]
    };
  }`,
  [
    { q: "What is IRMAA?", a: "IRMAA is the Income-Related Monthly Adjustment Amount, a surcharge added to Medicare Part B and Part D premiums for higher-income beneficiaries. It is based on your modified adjusted gross income from two years prior." },
    { q: "How can I avoid or reduce IRMAA?", a: "Strategies include managing income in the two years before Medicare enrollment, timing Roth conversions carefully, using qualified charitable distributions from IRAs, and filing a life-changing event appeal (Form SSA-44) if your income has decreased due to retirement, divorce, or death of a spouse." },
    { q: "Does IRMAA apply every year?", a: "Yes, IRMAA is recalculated annually based on your most recent tax return available to Social Security (typically from two years prior). If your income drops, the surcharge may decrease or be eliminated the following year." }
  ],
  `IRMAA is determined by MAGI from 2 years prior
Part B Surcharge ranges from $0 to $419.30/month based on income brackets
Part D Surcharge ranges from $0 to $81.00/month
Total Monthly = Base Premium + IRMAA Surcharge`,
  ["retirement-tax-bracket-calculator", "retirement-healthcare-cost-calculator"]
);

add(
  "retirement-withdrawal-sequencing-calculator",
  "Retirement Withdrawal Sequencing Calculator",
  "Optimize the order of withdrawals from taxable, tax-deferred, and tax-free retirement accounts to minimize lifetime taxes paid.",
  "Finance",
  "finance",
  "$",
  ["withdrawal sequencing", "retirement withdrawal order", "tax-efficient withdrawal", "account withdrawal strategy"],
  [
    '{ name: "taxableBalance", label: "Taxable Account Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 200000 }',
    '{ name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 500000 }',
    '{ name: "rothBalance", label: "Roth IRA Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 150000 }',
    '{ name: "annualNeed", label: "Annual Withdrawal Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 60000 }',
    '{ name: "taxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 10, max: 40, defaultValue: 22 }',
    '{ name: "capitalGainsRate", label: "Capital Gains Tax Rate (%)", type: "number", min: 0, max: 25, defaultValue: 15 }'
  ],
  `(inputs) => {
    const taxable = inputs.taxableBalance as number;
    const traditional = inputs.traditionalBalance as number;
    const roth = inputs.rothBalance as number;
    const need = inputs.annualNeed as number;
    const taxRate = inputs.taxRate as number / 100;
    const cgRate = inputs.capitalGainsRate as number / 100;
    const totalAssets = taxable + traditional + roth;
    const taxFromTaxable = need * cgRate * 0.5;
    const taxFromTraditional = need * taxRate;
    const taxFromRoth = 0;
    const conventionalTax = taxFromTaxable;
    const taxableFirst = Math.min(need, taxable);
    const traditionalNext = Math.min(need - taxableFirst, traditional);
    const rothLast = Math.min(need - taxableFirst - traditionalNext, roth);
    const optimizedTax = taxableFirst * cgRate * 0.5 + traditionalNext * taxRate;
    const yearsOfWithdrawals = need > 0 ? Math.floor(totalAssets / need) : 0;
    return {
      primary: { label: "Tax on Optimal Withdrawal", value: "$" + formatNumber(Math.round(optimizedTax)) },
      details: [
        { label: "From Taxable Account", value: "$" + formatNumber(Math.round(taxableFirst)) + " (tax: $" + formatNumber(Math.round(taxableFirst * cgRate * 0.5)) + ")" },
        { label: "From Traditional IRA/401k", value: "$" + formatNumber(Math.round(traditionalNext)) + " (tax: $" + formatNumber(Math.round(traditionalNext * taxRate)) + ")" },
        { label: "From Roth IRA", value: "$" + formatNumber(Math.round(rothLast)) + " (tax: $0)" },
        { label: "If All From Traditional", value: "Tax: $" + formatNumber(Math.round(taxFromTraditional)) },
        { label: "Total Assets / Years Coverage", value: "$" + formatNumber(Math.round(totalAssets)) + " / " + formatNumber(yearsOfWithdrawals) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the optimal withdrawal order in retirement?", a: "The conventional approach is to withdraw from taxable accounts first, then tax-deferred accounts, and finally Roth accounts. This allows tax-free Roth assets to grow the longest. However, the optimal order depends on your specific tax situation and may vary year to year." },
    { q: "Why should I consider Roth withdrawals last?", a: "Roth withdrawals are tax-free and do not count as income for Social Security taxation or Medicare IRMAA purposes. By letting your Roth grow tax-free as long as possible, you maximize the compounding benefit and preserve a tax-free resource for higher-income years." },
    { q: "When might I deviate from the standard withdrawal order?", a: "Deviating may make sense when you have a low-income year where traditional withdrawals would be taxed at low rates, when you need to manage your tax bracket for IRMAA or Social Security purposes, or when you want to perform partial Roth conversions." }
  ],
  `Conventional Order: Taxable first, then Traditional, then Roth
Tax on Taxable = Withdrawal x Capital Gains Rate x Gain Portion
Tax on Traditional = Withdrawal x Marginal Tax Rate
Tax on Roth = $0`,
  ["roth-conversion-ladder-calculator", "retirement-tax-bracket-calculator"]
);

add(
  "early-retirement-fire-number-calculator",
  "Early Retirement FIRE Number Calculator",
  "Calculate your Financial Independence Retire Early (FIRE) number, the total investment portfolio needed to cover annual expenses indefinitely using the safe withdrawal rate.",
  "Finance",
  "finance",
  "$",
  ["FIRE number", "financial independence calculator", "early retirement number", "FIRE calculator retirement"],
  [
    '{ name: "annualExpenses", label: "Annual Living Expenses ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 }',
    '{ name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", min: 2, max: 6, defaultValue: 4 }',
    '{ name: "currentSavings", label: "Current Investment Portfolio ($)", type: "number", min: 0, max: 20000000, defaultValue: 300000 }',
    '{ name: "annualSavings", label: "Annual Savings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 }',
    '{ name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const expenses = inputs.annualExpenses as number;
    const wr = inputs.withdrawalRate as number / 100;
    const current = inputs.currentSavings as number;
    const savings = inputs.annualSavings as number;
    const returnRate = inputs.expectedReturn as number / 100;
    const fireNumber = wr > 0 ? expenses / wr : expenses * 25;
    const gap = Math.max(0, fireNumber - current);
    let yearsToFire = 0;
    let balance = current;
    if (savings > 0) {
      while (balance < fireNumber && yearsToFire < 100) {
        balance = balance * (1 + returnRate) + savings;
        yearsToFire++;
      }
    }
    const progressPct = fireNumber > 0 ? (current / fireNumber) * 100 : 0;
    const coastFireAge = returnRate > 0 ? Math.ceil(Math.log(fireNumber / Math.max(current, 1)) / Math.log(1 + returnRate)) : 0;
    return {
      primary: { label: "Your FIRE Number", value: "$" + formatNumber(Math.round(fireNumber)) },
      details: [
        { label: "Current Progress", value: formatNumber(Math.round(progressPct * 10) / 10) + "% ($" + formatNumber(Math.round(current)) + ")" },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Years to FIRE", value: savings > 0 && yearsToFire < 100 ? formatNumber(yearsToFire) + " years" : "N/A" },
        { label: "Coast FIRE (years, no more saving)", value: formatNumber(coastFireAge) + " years" },
        { label: "Monthly Expense Budget", value: "$" + formatNumber(Math.round(expenses / 12)) }
      ]
    };
  }`,
  [
    { q: "What is the FIRE number?", a: "Your FIRE number is the total investment portfolio needed to cover your annual expenses indefinitely using a safe withdrawal rate. With the traditional 4 percent rule, your FIRE number is 25 times your annual expenses." },
    { q: "What is Coast FIRE?", a: "Coast FIRE means you have saved enough that your portfolio will grow to your FIRE number by traditional retirement age without any additional contributions. You still need to earn enough to cover current expenses but no longer need to save." },
    { q: "Is the 4 percent rule reliable for early retirees?", a: "The 4 percent rule was originally designed for a 30-year retirement. Early retirees with 40 to 50 year horizons may want to use a lower withdrawal rate of 3 to 3.5 percent, or plan for flexible spending that adjusts based on portfolio performance." }
  ],
  `FIRE Number = Annual Expenses / Withdrawal Rate
Years to FIRE: Compound growth of (Current + Annual Savings) until reaching FIRE Number
Coast FIRE Years = ln(FIRE Number / Current Savings) / ln(1 + Return Rate)`,
  ["retirement-portfolio-withdrawal-calculator", "required-savings-rate-calculator"]
);
add(
  "earthquake-magnitude-converter",
  "Earthquake Magnitude Converter",
  "Convert between earthquake magnitude scales including Richter, moment magnitude, surface wave, and body wave magnitude with energy equivalents.",
  "Science",
  "science",
  "A",
  ["earthquake magnitude", "Richter scale", "moment magnitude", "seismic scale converter"],
  [
    '{ name: "magnitude", label: "Earthquake Magnitude", type: "number", min: 0, max: 10, defaultValue: 5 }',
    '{ name: "inputScale", label: "Input Scale", type: "select", options: [{ value: "1", label: "Moment Magnitude (Mw)" }, { value: "2", label: "Richter / Local (ML)" }, { value: "3", label: "Surface Wave (Ms)" }, { value: "4", label: "Body Wave (mb)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const mag = inputs.magnitude as number;
    const scale = parseFloat(inputs.inputScale as unknown as string);
    let mw = mag;
    if (scale === 2) mw = mag * 0.98 + 0.08;
    if (scale === 3) mw = (mag + 1.07) / 1.03;
    if (scale === 4) mw = (mag - 0.39) / 0.77;
    const ml = (mw - 0.08) / 0.98;
    const ms = mw * 1.03 - 1.07;
    const mb = mw * 0.77 + 0.39;
    const energyJoules = Math.pow(10, 1.5 * mw + 4.8);
    const tntTons = energyJoules / 4.184e9;
    let tntLabel = "";
    if (tntTons < 1000) tntLabel = formatNumber(Math.round(tntTons)) + " tons TNT";
    else if (tntTons < 1e6) tntLabel = formatNumber(Math.round(tntTons / 1000)) + " kilotons TNT";
    else tntLabel = formatNumber(Math.round(tntTons / 1e6)) + " megatons TNT";
    return {
      primary: { label: "Moment Magnitude (Mw)", value: formatNumber(parseFloat(mw.toFixed(2))) },
      details: [
        { label: "Richter / Local (ML)", value: formatNumber(parseFloat(ml.toFixed(2))) },
        { label: "Surface Wave (Ms)", value: formatNumber(parseFloat(ms.toFixed(2))) },
        { label: "Body Wave (mb)", value: formatNumber(parseFloat(mb.toFixed(2))) },
        { label: "Energy Released", value: tntLabel },
        { label: "Energy (Joules)", value: energyJoules.toExponential(2) + " J" }
      ]
    };
  }`,
  [
    { q: "What is the difference between Richter and moment magnitude?", a: "The Richter scale (local magnitude ML) was the original earthquake scale but saturates above 6.5. Moment magnitude (Mw) is more accurate for large earthquakes and is now the standard used by seismologists worldwide." },
    { q: "How much stronger is each whole number increase?", a: "Each whole number increase in magnitude represents roughly 31.6 times more energy released. A magnitude 7 earthquake releases about 1,000 times more energy than a magnitude 5." },
    { q: "What magnitude can humans feel?", a: "Most people can feel earthquakes starting around magnitude 3. Earthquakes below 2.5 are typically not felt but are recorded by instruments." }
  ],
  `Mw (from ML) = ML x 0.98 + 0.08
Mw (from Ms) = (Ms + 1.07) / 1.03
Mw (from mb) = (mb - 0.39) / 0.77
Energy (Joules) = 10^(1.5 x Mw + 4.8)`,
  ["seismic-wave-velocity-calculator", "tsunami-wave-speed-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "seismic-wave-velocity-calculator",
  "Seismic Wave Velocity Calculator",
  "Calculate P-wave and S-wave velocities through different rock types based on density and elastic moduli for seismic analysis.",
  "Science",
  "science",
  "A",
  ["seismic wave velocity", "P-wave speed", "S-wave speed", "seismic analysis", "rock wave propagation"],
  [
    '{ name: "rockType", label: "Rock Type", type: "select", options: [{ value: "1", label: "Granite" }, { value: "2", label: "Basalt" }, { value: "3", label: "Limestone" }, { value: "4", label: "Sandstone" }, { value: "5", label: "Shale" }, { value: "6", label: "Soil/Sediment" }], defaultValue: "1" }',
    '{ name: "depth", label: "Depth (km)", type: "number", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "saturation", label: "Saturation", type: "select", options: [{ value: "1", label: "Dry" }, { value: "1.1", label: "Partially Saturated" }, { value: "1.2", label: "Fully Saturated" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const rock = parseFloat(inputs.rockType as unknown as string);
    const depth = inputs.depth as number;
    const sat = parseFloat(inputs.saturation as unknown as string);
    const vpBase = { 1: 5500, 2: 6200, 3: 5000, 4: 3500, 5: 3000, 6: 1500 } as Record<number, number>;
    const vsBase = { 1: 3200, 2: 3400, 3: 2800, 4: 2000, 5: 1700, 6: 600 } as Record<number, number>;
    const densities = { 1: 2650, 2: 2900, 3: 2700, 4: 2350, 5: 2400, 6: 1800 } as Record<number, number>;
    const depthFactor = 1 + depth * 0.002;
    const vp = vpBase[rock] * depthFactor * sat;
    const vs = vsBase[rock] * depthFactor;
    const ratio = vp / vs;
    const density = densities[rock];
    const poisson = (Math.pow(ratio, 2) - 2) / (2 * (Math.pow(ratio, 2) - 1));
    return {
      primary: { label: "P-Wave Velocity", value: formatNumber(Math.round(vp)) + " m/s" },
      details: [
        { label: "S-Wave Velocity", value: formatNumber(Math.round(vs)) + " m/s" },
        { label: "Vp/Vs Ratio", value: formatNumber(parseFloat(ratio.toFixed(3))) },
        { label: "Rock Density", value: formatNumber(density) + " kg/m3" },
        { label: "Poisson Ratio", value: formatNumber(parseFloat(poisson.toFixed(3))) },
        { label: "Depth Factor", value: depthFactor.toFixed(3) }
      ]
    };
  }`,
  [
    { q: "What are P-waves and S-waves?", a: "P-waves (primary waves) are compressional waves that travel fastest and arrive first. S-waves (secondary waves) are shear waves that are slower but cause more ground shaking. S-waves cannot travel through liquids." },
    { q: "Why does wave velocity increase with depth?", a: "As depth increases, so does pressure, which compresses the rock and increases its elastic moduli. This causes seismic waves to travel faster through deeper rock layers." },
    { q: "What affects seismic wave velocity?", a: "Key factors include rock type, density, porosity, fluid saturation, confining pressure (depth), temperature, and fracturing. Saturated rocks transmit P-waves faster than dry rocks." }
  ],
  `Vp = BaseVp x DepthFactor x SaturationFactor
Vs = BaseVs x DepthFactor
Vp/Vs Ratio = Vp / Vs
Poisson Ratio = (Ratio^2 - 2) / (2 x (Ratio^2 - 1))`,
  ["earthquake-magnitude-converter", "rock-density-calculator", "slope-stability-factor-calculator"]
);

add(
  "mineral-hardness-comparison-calculator",
  "Mineral Hardness Comparison Calculator",
  "Compare mineral hardness values on the Mohs scale and estimate scratch resistance, absolute hardness, and practical durability ratings.",
  "Science",
  "science",
  "A",
  ["mineral hardness", "Mohs scale", "scratch resistance", "mineral comparison", "gemstone hardness"],
  [
    '{ name: "mineral1", label: "Mineral 1", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "7" }',
    '{ name: "mineral2", label: "Mineral 2", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "5" }'
  ],
  `(inputs) => {
    const m1 = parseFloat(inputs.mineral1 as unknown as string);
    const m2 = parseFloat(inputs.mineral2 as unknown as string);
    const absHardness = { 1: 1, 2: 3, 3: 9, 4: 21, 5: 48, 6: 72, 7: 100, 8: 200, 9: 400, 10: 1500 } as Record<number, number>;
    const names = { 1: "Talc", 2: "Gypsum", 3: "Calcite", 4: "Fluorite", 5: "Apatite", 6: "Orthoclase", 7: "Quartz", 8: "Topaz", 9: "Corundum", 10: "Diamond" } as Record<number, string>;
    const abs1 = absHardness[m1];
    const abs2 = absHardness[m2];
    const ratio = abs1 / abs2;
    const diff = m1 - m2;
    const canScratch = diff > 0 ? names[m1] + " scratches " + names[m2] : diff < 0 ? names[m2] + " scratches " + names[m1] : "Neither scratches the other";
    return {
      primary: { label: "Mohs Difference", value: formatNumber(Math.abs(diff)) + " levels" },
      details: [
        { label: "Scratch Result", value: canScratch },
        { label: names[m1] + " Absolute Hardness", value: formatNumber(abs1) },
        { label: names[m2] + " Absolute Hardness", value: formatNumber(abs2) },
        { label: "Absolute Hardness Ratio", value: formatNumber(parseFloat(ratio.toFixed(2))) + "x" },
        { label: "Harder Mineral", value: diff >= 0 ? names[m1] : names[m2] }
      ]
    };
  }`,
  [
    { q: "What is the Mohs hardness scale?", a: "The Mohs scale ranks mineral hardness from 1 (talc, softest) to 10 (diamond, hardest). A mineral can scratch any mineral with a lower number. It is a relative scale, not linear." },
    { q: "Why is the Mohs scale not linear?", a: "The absolute hardness difference between each Mohs level varies enormously. The jump from corundum (9) to diamond (10) is much larger than from talc (1) to corundum (9) in absolute terms." },
    { q: "What common items can test hardness?", a: "A fingernail is about 2.5, a copper penny about 3.5, a steel knife blade about 5.5, and a glass plate about 5.5 on the Mohs scale." }
  ],
  `Mohs Difference = |Hardness1 - Hardness2|
Absolute Hardness Ratio = AbsoluteHardness1 / AbsoluteHardness2
Scratch Test: Higher Mohs number scratches lower`,
  ["gemstone-carat-to-mm-calculator", "rock-density-calculator", "gold-ore-grade-value-calculator"]
);

add(
  "rock-density-calculator",
  "Rock Density Calculator",
  "Calculate rock density from mass and volume measurements, or estimate density by rock type with porosity and moisture content adjustments.",
  "Science",
  "science",
  "A",
  ["rock density", "mineral density", "specific gravity", "bulk density", "rock mass properties"],
  [
    '{ name: "rockType", label: "Rock Type", type: "select", options: [{ value: "2650", label: "Granite" }, { value: "2900", label: "Basalt" }, { value: "2710", label: "Limestone" }, { value: "2350", label: "Sandstone" }, { value: "2750", label: "Marble" }, { value: "2700", label: "Gneiss" }, { value: "0", label: "Custom (Enter Mass/Volume)" }], defaultValue: "2650" }',
    '{ name: "mass", label: "Sample Mass (grams)", type: "number", min: 0, max: 100000, defaultValue: 500 }',
    '{ name: "volume", label: "Sample Volume (cm3)", type: "number", min: 0, max: 50000, defaultValue: 190 }',
    '{ name: "porosity", label: "Porosity (%)", type: "number", min: 0, max: 60, defaultValue: 5 }',
    '{ name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const rockType = parseFloat(inputs.rockType as unknown as string);
    const mass = inputs.mass as number;
    const vol = inputs.volume as number;
    const porosity = inputs.porosity as number / 100;
    const moisture = inputs.moistureContent as number / 100;
    let grainDensity = rockType > 0 ? rockType : (vol > 0 ? (mass / vol) * 1000 : 0);
    const bulkDensity = grainDensity * (1 - porosity) + 1000 * porosity * moisture;
    const dryDensity = grainDensity * (1 - porosity);
    const specificGravity = grainDensity / 1000;
    const satDensity = grainDensity * (1 - porosity) + 1000 * porosity;
    const measuredDensity = vol > 0 ? (mass / vol) * 1000 : grainDensity;
    return {
      primary: { label: "Bulk Density", value: formatNumber(Math.round(bulkDensity)) + " kg/m3" },
      details: [
        { label: "Grain Density", value: formatNumber(Math.round(grainDensity)) + " kg/m3" },
        { label: "Dry Density", value: formatNumber(Math.round(dryDensity)) + " kg/m3" },
        { label: "Saturated Density", value: formatNumber(Math.round(satDensity)) + " kg/m3" },
        { label: "Specific Gravity", value: formatNumber(parseFloat(specificGravity.toFixed(3))) },
        { label: "Measured Density", value: formatNumber(Math.round(measuredDensity)) + " kg/m3" }
      ]
    };
  }`,
  [
    { q: "What is the difference between bulk and grain density?", a: "Grain density is the density of the solid mineral material only. Bulk density includes the pore spaces and any fluids filling them. Bulk density is always lower than or equal to grain density." },
    { q: "How does porosity affect rock density?", a: "Higher porosity means more void space and lower bulk density. A rock with 20% porosity has 20% of its volume as empty space, which significantly reduces its overall density." },
    { q: "What is the densest common rock?", a: "Among common rocks, basalt and gabbro are the densest at about 2,900 to 3,100 kg/m3. For comparison, granite averages about 2,650 kg/m3 and sandstone about 2,350 kg/m3." }
  ],
  `Bulk Density = Grain Density x (1 - Porosity) + Water Density x Porosity x Moisture
Dry Density = Grain Density x (1 - Porosity)
Specific Gravity = Grain Density / 1000`,
  ["mineral-hardness-comparison-calculator", "aggregate-volume-calculator", "excavation-volume-calculator"]
);

add(
  "well-drilling-cost-calculator",
  "Well Drilling Cost Calculator",
  "Estimate the total cost of drilling a water or monitoring well including per-foot drilling costs, casing, pump installation, and permits.",
  "Finance",
  "finance",
  "$",
  ["well drilling cost", "water well price", "borehole cost", "well installation estimate"],
  [
    '{ name: "depth", label: "Well Depth (feet)", type: "number", min: 20, max: 2000, defaultValue: 200 }',
    '{ name: "diameter", label: "Well Diameter (inches)", type: "select", options: [{ value: "4", label: "4 inch" }, { value: "6", label: "6 inch" }, { value: "8", label: "8 inch" }, { value: "12", label: "12 inch" }], defaultValue: "6" }',
    '{ name: "soilType", label: "Ground Conditions", type: "select", options: [{ value: "15", label: "Soft Soil ($15/ft)" }, { value: "25", label: "Clay/Gravel ($25/ft)" }, { value: "45", label: "Soft Rock ($45/ft)" }, { value: "65", label: "Hard Rock ($65/ft)" }], defaultValue: "25" }',
    '{ name: "pumpType", label: "Pump Type", type: "select", options: [{ value: "0", label: "None (Monitoring Well)" }, { value: "1500", label: "Submersible ($1,500)" }, { value: "3000", label: "Deep Well Jet ($3,000)" }, { value: "5000", label: "High-Capacity ($5,000)" }], defaultValue: "1500" }',
    '{ name: "permitCost", label: "Permit and Testing Fees ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const depth = inputs.depth as number;
    const diameter = parseFloat(inputs.diameter as unknown as string);
    const costPerFoot = parseFloat(inputs.soilType as unknown as string);
    const pump = parseFloat(inputs.pumpType as unknown as string);
    const permit = inputs.permitCost as number;
    const diameterMult = diameter / 6;
    const drillingCost = depth * costPerFoot * diameterMult;
    const casingCost = depth * 7 * diameterMult;
    const groutSeal = depth * 3;
    const total = drillingCost + casingCost + groutSeal + pump + permit;
    const costPerGallon = depth > 0 ? total / (depth * 0.5) : 0;
    return {
      primary: { label: "Total Well Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Drilling Cost", value: "$" + formatNumber(Math.round(drillingCost)) },
        { label: "Casing Cost", value: "$" + formatNumber(Math.round(casingCost)) },
        { label: "Grout and Seal", value: "$" + formatNumber(Math.round(groutSeal)) },
        { label: "Pump Installation", value: "$" + formatNumber(Math.round(pump)) },
        { label: "Permits and Testing", value: "$" + formatNumber(Math.round(permit)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to drill a well?", a: "Residential water wells typically cost $3,000 to $15,000 depending on depth, ground conditions, and diameter. Shallow wells in soft soil are cheapest, while deep wells through hard rock are most expensive." },
    { q: "How deep does a water well need to be?", a: "Residential wells are typically 100 to 400 feet deep. The required depth depends on the local water table, aquifer depth, and water quality at various levels." },
    { q: "Does well diameter affect cost?", a: "Yes, larger diameter wells cost more due to bigger drill bits, more casing material, and longer drilling time. A 4-inch well is standard for residential, while 8-12 inch wells are used for irrigation or commercial purposes." }
  ],
  `Drilling Cost = Depth x CostPerFoot x (Diameter / 6)
Casing Cost = Depth x $7 x (Diameter / 6)
Grout and Seal = Depth x $3
Total = Drilling + Casing + Grout + Pump + Permits`,
  ["groundwater-flow-rate-calculator", "aquifer-yield-calculator", "excavation-volume-calculator"]
);

add(
  "groundwater-flow-rate-calculator",
  "Groundwater Flow Rate Calculator",
  "Calculate groundwater flow velocity and discharge rate using hydraulic conductivity, hydraulic gradient, and aquifer cross-sectional area.",
  "Science",
  "science",
  "A",
  ["groundwater flow", "Darcy law", "hydraulic conductivity", "aquifer flow rate", "seepage velocity"],
  [
    '{ name: "hydraulicConductivity", label: "Hydraulic Conductivity (m/day)", type: "number", min: 0.001, max: 1000, defaultValue: 10 }',
    '{ name: "hydraulicGradient", label: "Hydraulic Gradient (m/m)", type: "number", min: 0.0001, max: 1, defaultValue: 0.01 }',
    '{ name: "crossSectionArea", label: "Cross-Sectional Area (m2)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "porosity", label: "Effective Porosity (%)", type: "number", min: 1, max: 60, defaultValue: 25 }'
  ],
  `(inputs) => {
    const K = inputs.hydraulicConductivity as number;
    const i = inputs.hydraulicGradient as number;
    const A = inputs.crossSectionArea as number;
    const n = inputs.porosity as number / 100;
    const darcyVelocity = K * i;
    const seepageVelocity = darcyVelocity / n;
    const discharge = K * i * A;
    const dailyVolume = discharge;
    const yearlyVolume = discharge * 365;
    const travelTime100m = n > 0 ? 100 / seepageVelocity : 0;
    return {
      primary: { label: "Darcy Velocity", value: formatNumber(parseFloat(darcyVelocity.toFixed(4))) + " m/day" },
      details: [
        { label: "Seepage Velocity", value: formatNumber(parseFloat(seepageVelocity.toFixed(4))) + " m/day" },
        { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/day" },
        { label: "Annual Volume", value: formatNumber(Math.round(yearlyVolume)) + " m3/year" },
        { label: "Travel Time (100m)", value: formatNumber(parseFloat(travelTime100m.toFixed(1))) + " days" },
        { label: "Effective Porosity", value: formatNumber(n * 100) + "%" }
      ]
    };
  }`,
  [
    { q: "What is Darcy velocity vs seepage velocity?", a: "Darcy velocity is the apparent flow rate through the entire cross-section. Seepage velocity is the actual speed water moves through pore spaces, which is always faster since water only flows through the pores, not the solid rock." },
    { q: "What is hydraulic conductivity?", a: "Hydraulic conductivity measures how easily water flows through soil or rock. Sand and gravel have high values (1-1000 m/day), while clay has very low values (less than 0.001 m/day)." },
    { q: "How fast does groundwater move?", a: "Groundwater typically moves very slowly, from centimeters per day to a few meters per day. In highly permeable gravel aquifers, it can move faster, but it is generally much slower than surface water." }
  ],
  `Darcy Velocity (v) = K x i
Seepage Velocity = v / n (effective porosity)
Discharge (Q) = K x i x A
Travel Time = Distance / Seepage Velocity`,
  ["well-drilling-cost-calculator", "aquifer-yield-calculator", "river-discharge-rate-calculator"]
);

add(
  "soil-compaction-test-calculator",
  "Soil Compaction Test Calculator",
  "Calculate soil compaction percentage, dry density, and moisture content from Proctor test data for construction quality control.",
  "Science",
  "science",
  "A",
  ["soil compaction", "Proctor test", "dry density", "compaction percentage", "construction soil testing"],
  [
    '{ name: "wetWeight", label: "Wet Soil Weight (grams)", type: "number", min: 100, max: 10000, defaultValue: 1850 }',
    '{ name: "moldVolume", label: "Mold Volume (cm3)", type: "number", min: 100, max: 5000, defaultValue: 944 }',
    '{ name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "maxDryDensity", label: "Max Dry Density - MDD (g/cm3)", type: "number", min: 1, max: 3, defaultValue: 1.85 }',
    '{ name: "optimumMoisture", label: "Optimum Moisture Content (%)", type: "number", min: 0, max: 40, defaultValue: 14 }'
  ],
  `(inputs) => {
    const wetWt = inputs.wetWeight as number;
    const moldVol = inputs.moldVolume as number;
    const mc = inputs.moistureContent as number;
    const mdd = inputs.maxDryDensity as number;
    const omc = inputs.optimumMoisture as number;
    const wetDensity = wetWt / moldVol;
    const dryDensity = wetDensity / (1 + mc / 100);
    const compaction = (dryDensity / mdd) * 100;
    const voidRatio = (2.65 / dryDensity) - 1;
    const saturation = mc > 0 ? (mc * dryDensity) / (voidRatio * 1) * 100 : 0;
    const pass = compaction >= 95 ? "PASS (>= 95%)" : "FAIL (< 95%)";
    return {
      primary: { label: "Compaction Percentage", value: formatNumber(parseFloat(compaction.toFixed(1))) + "%" },
      details: [
        { label: "Dry Density", value: formatNumber(parseFloat(dryDensity.toFixed(3))) + " g/cm3" },
        { label: "Wet Density", value: formatNumber(parseFloat(wetDensity.toFixed(3))) + " g/cm3" },
        { label: "Void Ratio", value: formatNumber(parseFloat(voidRatio.toFixed(3))) },
        { label: "QC Result (95% Spec)", value: pass },
        { label: "Moisture vs Optimum", value: (mc - omc >= 0 ? "+" : "") + formatNumber(parseFloat((mc - omc).toFixed(1))) + "%" }
      ]
    };
  }`,
  [
    { q: "What is a good soil compaction percentage?", a: "For most construction projects, 95% of the maximum dry density (standard Proctor) is the minimum acceptable compaction. Highway subgrades often require 98% or higher." },
    { q: "What is the Proctor test?", a: "The Proctor compaction test determines the optimal moisture content at which a soil reaches its maximum dry density. The standard test uses a specific compaction energy to establish the benchmark for field quality control." },
    { q: "Why is moisture content important for compaction?", a: "Too little moisture means soil particles cannot slide together efficiently. Too much moisture fills voids with water that cannot be compressed. The optimum moisture content allows maximum particle packing." }
  ],
  `Wet Density = Wet Weight / Mold Volume
Dry Density = Wet Density / (1 + Moisture Content / 100)
Compaction % = (Dry Density / Max Dry Density) x 100
Void Ratio = (Gs / Dry Density) - 1`,
  ["bearing-capacity-calculator", "slope-stability-factor-calculator", "excavation-volume-calculator"]
);

add(
  "bearing-capacity-calculator",
  "Bearing Capacity Calculator",
  "Calculate the ultimate and allowable bearing capacity of soil using Terzaghi bearing capacity equation for foundation design.",
  "Science",
  "science",
  "A",
  ["bearing capacity", "foundation design", "Terzaghi equation", "soil bearing strength", "footing design"],
  [
    '{ name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "frictionAngle", label: "Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 30 }',
    '{ name: "foundationWidth", label: "Foundation Width (m)", type: "number", min: 0.3, max: 20, defaultValue: 2 }',
    '{ name: "foundationDepth", label: "Foundation Depth (m)", type: "number", min: 0.3, max: 10, defaultValue: 1.5 }',
    '{ name: "soilUnitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 18 }',
    '{ name: "factorOfSafety", label: "Factor of Safety", type: "number", min: 1, max: 5, defaultValue: 3 }'
  ],
  `(inputs) => {
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number;
    const B = inputs.foundationWidth as number;
    const D = inputs.foundationDepth as number;
    const gamma = inputs.soilUnitWeight as number;
    const FOS = inputs.factorOfSafety as number;
    const phiRad = phi * Math.PI / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const Nc = (Nq - 1) / Math.tan(phiRad || 0.001);
    const Ngamma = 2 * (Nq + 1) * Math.tan(phiRad);
    const q = gamma * D;
    const qu = c * Nc + q * Nq + 0.5 * gamma * B * Ngamma;
    const qa = qu / FOS;
    return {
      primary: { label: "Allowable Bearing Capacity", value: formatNumber(Math.round(qa)) + " kPa" },
      details: [
        { label: "Ultimate Bearing Capacity", value: formatNumber(Math.round(qu)) + " kPa" },
        { label: "Nc Factor", value: formatNumber(parseFloat(Nc.toFixed(2))) },
        { label: "Nq Factor", value: formatNumber(parseFloat(Nq.toFixed(2))) },
        { label: "Ngamma Factor", value: formatNumber(parseFloat(Ngamma.toFixed(2))) },
        { label: "Overburden Pressure (q)", value: formatNumber(parseFloat(q.toFixed(1))) + " kPa" }
      ]
    };
  }`,
  [
    { q: "What is bearing capacity?", a: "Bearing capacity is the maximum pressure a soil can support from a foundation without failing through shear or excessive settlement. It determines the size and type of foundation needed for a structure." },
    { q: "What factor of safety is used for foundations?", a: "A factor of safety of 3 is standard for most building foundations. Critical structures may use higher values. The allowable bearing capacity is the ultimate capacity divided by the factor of safety." },
    { q: "What affects soil bearing capacity?", a: "Key factors include soil type, cohesion, internal friction angle, depth of foundation, groundwater level, and foundation width and shape. Clay soils rely on cohesion while sandy soils rely on friction." }
  ],
  `qu = c x Nc + q x Nq + 0.5 x gamma x B x Ngamma
qa = qu / Factor of Safety
Nq = e^(pi x tan(phi)) x tan^2(45 + phi/2)
Nc = (Nq - 1) / tan(phi)
Ngamma = 2(Nq + 1) x tan(phi)`,
  ["soil-compaction-test-calculator", "slope-stability-factor-calculator", "excavation-volume-calculator"]
);

add(
  "slope-stability-factor-calculator",
  "Slope Stability Factor Calculator",
  "Calculate the factor of safety for slope stability using the infinite slope method considering soil properties, slope angle, and water table.",
  "Science",
  "science",
  "A",
  ["slope stability", "factor of safety", "landslide risk", "slope angle", "geotechnical analysis"],
  [
    '{ name: "slopeAngle", label: "Slope Angle (degrees)", type: "number", min: 1, max: 80, defaultValue: 30 }',
    '{ name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "frictionAngle", label: "Internal Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 25 }',
    '{ name: "soilDepth", label: "Soil Depth to Failure Plane (m)", type: "number", min: 0.5, max: 30, defaultValue: 3 }',
    '{ name: "unitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 19 }',
    '{ name: "waterTable", label: "Water Table Condition", type: "select", options: [{ value: "0", label: "Dry Slope" }, { value: "0.5", label: "Water at Half Depth" }, { value: "1", label: "Fully Saturated" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const beta = inputs.slopeAngle as number * Math.PI / 180;
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number * Math.PI / 180;
    const H = inputs.soilDepth as number;
    const gamma = inputs.unitWeight as number;
    const waterRatio = parseFloat(inputs.waterTable as unknown as string);
    const gammaW = 9.81;
    const u = gammaW * H * waterRatio * Math.cos(beta) * Math.cos(beta);
    const normalStress = gamma * H * Math.cos(beta) * Math.cos(beta);
    const shearStress = gamma * H * Math.sin(beta) * Math.cos(beta);
    const shearStrength = c + (normalStress - u) * Math.tan(phi);
    const FOS = shearStress > 0 ? shearStrength / shearStress : 999;
    const status = FOS >= 1.5 ? "Stable" : FOS >= 1.0 ? "Marginally Stable" : "Unstable";
    return {
      primary: { label: "Factor of Safety", value: formatNumber(parseFloat(FOS.toFixed(3))) },
      details: [
        { label: "Stability Status", value: status },
        { label: "Shear Strength", value: formatNumber(parseFloat(shearStrength.toFixed(2))) + " kPa" },
        { label: "Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " kPa" },
        { label: "Normal Stress", value: formatNumber(parseFloat(normalStress.toFixed(2))) + " kPa" },
        { label: "Pore Water Pressure", value: formatNumber(parseFloat(u.toFixed(2))) + " kPa" }
      ]
    };
  }`,
  [
    { q: "What factor of safety is considered stable?", a: "A factor of safety of 1.5 or greater is generally considered stable for permanent slopes. Temporary construction slopes may use 1.25. Values below 1.0 indicate the slope will fail." },
    { q: "How does water affect slope stability?", a: "Water is the most common trigger for landslides. It increases pore water pressure, reduces the effective normal stress, and thus reduces the shear strength along the failure plane, dramatically lowering the factor of safety." },
    { q: "What is the infinite slope method?", a: "The infinite slope method analyzes a long, uniform slope by examining a thin slice of soil parallel to the surface. It works well for shallow, planar failures and is the simplest slope stability analysis method." }
  ],
  `FOS = Shear Strength / Shear Stress
Shear Strength = c + (Normal Stress - Pore Pressure) x tan(phi)
Normal Stress = gamma x H x cos^2(beta)
Shear Stress = gamma x H x sin(beta) x cos(beta)`,
  ["bearing-capacity-calculator", "soil-compaction-test-calculator", "excavation-volume-calculator"]
);

add(
  "tsunami-wave-speed-calculator",
  "Tsunami Wave Speed Calculator",
  "Calculate tsunami wave speed, wavelength, and arrival time based on ocean depth and distance using shallow water wave theory.",
  "Science",
  "science",
  "A",
  ["tsunami speed", "tsunami wave", "shallow water wave", "tsunami arrival time", "ocean wave calculator"],
  [
    '{ name: "oceanDepth", label: "Average Ocean Depth (meters)", type: "number", min: 10, max: 11000, defaultValue: 4000 }',
    '{ name: "distance", label: "Distance to Coast (km)", type: "number", min: 1, max: 20000, defaultValue: 1000 }',
    '{ name: "wavePeriod", label: "Wave Period (minutes)", type: "number", min: 5, max: 120, defaultValue: 20 }',
    '{ name: "initialHeight", label: "Initial Wave Height (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 }',
    '{ name: "coastalDepth", label: "Coastal Shelf Depth (m)", type: "number", min: 1, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const d = inputs.oceanDepth as number;
    const dist = inputs.distance as number;
    const T = inputs.wavePeriod as number * 60;
    const H0 = inputs.initialHeight as number;
    const dCoast = inputs.coastalDepth as number;
    const g = 9.81;
    const speed = Math.sqrt(g * d);
    const speedKmh = speed * 3.6;
    const wavelength = speed * T / 1000;
    const arrivalMinutes = (dist * 1000 / speed) / 60;
    const arrivalHours = arrivalMinutes / 60;
    const coastalSpeed = Math.sqrt(g * dCoast);
    const amplification = Math.pow(d / dCoast, 0.25);
    const coastalHeight = H0 * amplification;
    return {
      primary: { label: "Deep Water Speed", value: formatNumber(Math.round(speedKmh)) + " km/h" },
      details: [
        { label: "Wave Speed (m/s)", value: formatNumber(parseFloat(speed.toFixed(1))) + " m/s" },
        { label: "Wavelength", value: formatNumber(Math.round(wavelength)) + " km" },
        { label: "Arrival Time", value: formatNumber(parseFloat(arrivalHours.toFixed(2))) + " hours" },
        { label: "Coastal Wave Height", value: formatNumber(parseFloat(coastalHeight.toFixed(1))) + " m" },
        { label: "Amplification Factor", value: formatNumber(parseFloat(amplification.toFixed(2))) + "x" }
      ]
    };
  }`,
  [
    { q: "How fast do tsunamis travel?", a: "In deep ocean (4000m depth), tsunamis travel at about 700 km/h, as fast as a jet airplane. In shallow coastal waters, they slow to about 40-50 km/h but grow much taller." },
    { q: "Why do tsunamis grow taller near shore?", a: "As a tsunami enters shallow water, it slows down but its energy is compressed into a smaller volume. The wave height increases proportionally to the fourth root of the depth ratio, a process called shoaling." },
    { q: "Can you feel a tsunami in deep ocean?", a: "No. In deep water, a tsunami may be only 0.5 to 1 meter tall with a wavelength of hundreds of kilometers. Ships at sea would barely notice it passing underneath." }
  ],
  `Speed = sqrt(g x depth)
Wavelength = Speed x Period
Arrival Time = Distance / Speed
Coastal Height = Initial Height x (Ocean Depth / Coastal Depth)^0.25`,
  ["earthquake-magnitude-converter", "seismic-wave-velocity-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "volcanic-eruption-index-calculator",
  "Volcanic Eruption Index Calculator",
  "Estimate the Volcanic Explosivity Index (VEI) and eruption characteristics from ejected volume, plume height, and eruption duration.",
  "Science",
  "science",
  "A",
  ["volcanic eruption index", "VEI calculator", "eruption magnitude", "volcanic explosivity", "volcano eruption size"],
  [
    '{ name: "ejectaVolume", label: "Ejected Volume (cubic km)", type: "number", min: 0.00001, max: 10000, defaultValue: 1 }',
    '{ name: "plumeHeight", label: "Plume Height (km)", type: "number", min: 0.1, max: 50, defaultValue: 15 }',
    '{ name: "durationHours", label: "Eruption Duration (hours)", type: "number", min: 0.1, max: 10000, defaultValue: 12 }',
    '{ name: "eruptionType", label: "Eruption Style", type: "select", options: [{ value: "1", label: "Effusive (Lava Flow)" }, { value: "2", label: "Explosive (Strombolian)" }, { value: "3", label: "Plinian" }, { value: "4", label: "Ultra-Plinian" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const vol = inputs.ejectaVolume as number;
    const plume = inputs.plumeHeight as number;
    const duration = inputs.durationHours as number;
    const style = parseFloat(inputs.eruptionType as unknown as string);
    let vei = 0;
    if (vol >= 1000) vei = 8;
    else if (vol >= 100) vei = 7;
    else if (vol >= 10) vei = 6;
    else if (vol >= 1) vei = 5;
    else if (vol >= 0.1) vei = 4;
    else if (vol >= 0.01) vei = 3;
    else if (vol >= 0.001) vei = 2;
    else if (vol >= 0.0001) vei = 1;
    const descriptions = { 0: "Non-explosive", 1: "Gentle", 2: "Explosive", 3: "Severe", 4: "Cataclysmic", 5: "Paroxysmal", 6: "Colossal", 7: "Super-colossal", 8: "Mega-colossal" } as Record<number, string>;
    const energyJoules = vol * 1e9 * 2500 * 1000 * 9.81 * plume * 1000;
    const megatons = energyJoules / 4.184e15;
    const dischargeRate = vol / (duration / 3600);
    return {
      primary: { label: "Volcanic Explosivity Index", value: "VEI " + formatNumber(vei) },
      details: [
        { label: "Classification", value: descriptions[vei] || "Unknown" },
        { label: "Ejecta Volume", value: formatNumber(parseFloat(vol.toFixed(4))) + " km3" },
        { label: "Plume Height", value: formatNumber(plume) + " km" },
        { label: "Energy Equivalent", value: formatNumber(Math.round(megatons)) + " megatons TNT" },
        { label: "Discharge Rate", value: formatNumber(parseFloat(dischargeRate.toFixed(4))) + " km3/s" }
      ]
    };
  }`,
  [
    { q: "What is the Volcanic Explosivity Index?", a: "The VEI is a scale from 0 to 8 that measures the explosiveness of volcanic eruptions based primarily on the volume of ejected material. Each level represents a tenfold increase in ejecta volume." },
    { q: "What was the largest volcanic eruption in history?", a: "The largest known eruption was the Toba supervolcano about 75,000 years ago (VEI 8, ~2,800 km3). In recorded history, the 1815 eruption of Mount Tambora (VEI 7) was the largest, causing the Year Without a Summer." },
    { q: "How often do large eruptions occur?", a: "VEI 2-3 eruptions happen weekly to monthly worldwide. VEI 5 eruptions occur roughly once per decade. VEI 7 eruptions happen every few centuries, and VEI 8 supervolcano events occur every 50,000 to 100,000 years." }
  ],
  `VEI = log10(Ejecta Volume in m3) - 6 (approximately)
Energy = Volume x Density x g x Plume Height
Discharge Rate = Volume / Duration`,
  ["earthquake-magnitude-converter", "tsunami-wave-speed-calculator", "geothermal-gradient-calculator"]
);

add(
  "gemstone-carat-to-mm-calculator",
  "Gemstone Carat to MM Calculator",
  "Convert gemstone weight in carats to approximate dimensions in millimeters based on gem type, cut shape, and specific gravity.",
  "Conversion",
  "conversion",
  "R",
  ["carat to mm", "gemstone size", "diamond dimensions", "gem carat converter", "stone measurements"],
  [
    '{ name: "carats", label: "Weight (Carats)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "gemType", label: "Gemstone Type", type: "select", options: [{ value: "3.52", label: "Diamond (SG 3.52)" }, { value: "4.03", label: "Ruby/Sapphire (SG 4.03)" }, { value: "2.72", label: "Emerald (SG 2.72)" }, { value: "3.53", label: "Alexandrite (SG 3.53)" }, { value: "2.65", label: "Quartz/Amethyst (SG 2.65)" }, { value: "3.18", label: "Tourmaline (SG 3.18)" }], defaultValue: "3.52" }',
    '{ name: "cutShape", label: "Cut Shape", type: "select", options: [{ value: "1", label: "Round Brilliant" }, { value: "2", label: "Oval" }, { value: "3", label: "Princess (Square)" }, { value: "4", label: "Emerald Cut" }, { value: "5", label: "Pear" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const carats = inputs.carats as number;
    const sg = parseFloat(inputs.gemType as unknown as string);
    const cut = parseFloat(inputs.cutShape as unknown as string);
    const massGrams = carats * 0.2;
    const volumeMm3 = (massGrams / sg) * 1000;
    const depthRatios = { 1: 0.6, 2: 0.62, 3: 0.72, 4: 0.65, 5: 0.62 } as Record<number, number>;
    const widthRatios = { 1: 1, 2: 0.75, 3: 1, 4: 0.75, 5: 0.65 } as Record<number, number>;
    const depthR = depthRatios[cut];
    const widthR = widthRatios[cut];
    const diameter = Math.pow(volumeMm3 / (depthR * widthR * Math.PI / 4), 1/3) * (cut === 3 ? 0.95 : 1);
    const length = cut === 1 ? diameter : diameter / widthR;
    const width = cut === 1 ? diameter : diameter;
    const depth = diameter * depthR;
    return {
      primary: { label: "Estimated Diameter/Width", value: formatNumber(parseFloat(width.toFixed(2))) + " mm" },
      details: [
        { label: "Length", value: formatNumber(parseFloat(length.toFixed(2))) + " mm" },
        { label: "Depth", value: formatNumber(parseFloat(depth.toFixed(2))) + " mm" },
        { label: "Mass", value: formatNumber(parseFloat(massGrams.toFixed(4))) + " grams" },
        { label: "Volume", value: formatNumber(parseFloat(volumeMm3.toFixed(2))) + " mm3" },
        { label: "Specific Gravity", value: formatNumber(sg) }
      ]
    };
  }`,
  [
    { q: "How big is a 1 carat diamond?", a: "A 1 carat round brilliant diamond is approximately 6.5mm in diameter. However, the exact dimensions depend on the cut proportions and depth. Well-cut diamonds may appear larger face-up." },
    { q: "Does gemstone type affect size for the same carat weight?", a: "Yes, because different gems have different densities (specific gravity). A 1 carat emerald (SG 2.72) is physically larger than a 1 carat ruby (SG 4.03) because emerald is less dense." },
    { q: "What is a carat?", a: "A carat is a unit of weight equal to 200 milligrams (0.2 grams). It is the standard measure for gemstones. It should not be confused with karat, which measures gold purity." }
  ],
  `Mass (g) = Carats x 0.2
Volume (mm3) = Mass / Specific Gravity x 1000
Diameter = cube root of (Volume / (Depth Ratio x Width Ratio x pi/4))`,
  ["mineral-hardness-comparison-calculator", "gold-ore-grade-value-calculator", "rock-density-calculator"]
);

add(
  "gold-ore-grade-value-calculator",
  "Gold Ore Grade Value Calculator",
  "Calculate the value of gold ore based on grade (grams per tonne), tonnage, gold price, and estimated recovery rate from processing.",
  "Finance",
  "finance",
  "$",
  ["gold ore grade", "ore value", "gold mining value", "ore grade calculator", "gold recovery"],
  [
    '{ name: "oreGrade", label: "Ore Grade (g/tonne)", type: "number", min: 0.1, max: 500, defaultValue: 5 }',
    '{ name: "tonnage", label: "Ore Tonnage (tonnes)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "goldPrice", label: "Gold Price ($/oz)", type: "number", min: 500, max: 5000, defaultValue: 2000 }',
    '{ name: "recoveryRate", label: "Recovery Rate (%)", type: "number", min: 50, max: 99, defaultValue: 90 }',
    '{ name: "processingCost", label: "Processing Cost ($/tonne)", type: "number", min: 5, max: 200, defaultValue: 30 }'
  ],
  `(inputs) => {
    const grade = inputs.oreGrade as number;
    const tonnes = inputs.tonnage as number;
    const price = inputs.goldPrice as number;
    const recovery = inputs.recoveryRate as number / 100;
    const procCost = inputs.processingCost as number;
    const goldGrams = grade * tonnes;
    const recoveredGrams = goldGrams * recovery;
    const troyOz = recoveredGrams / 31.1035;
    const grossValue = troyOz * price;
    const totalProcessing = procCost * tonnes;
    const netValue = grossValue - totalProcessing;
    const valuePerTonne = tonnes > 0 ? netValue / tonnes : 0;
    const breakEvenGrade = (procCost * 31.1035) / (price * recovery);
    return {
      primary: { label: "Net Ore Value", value: "$" + formatNumber(Math.round(netValue)) },
      details: [
        { label: "Gross Gold Value", value: "$" + formatNumber(Math.round(grossValue)) },
        { label: "Recovered Gold", value: formatNumber(parseFloat(troyOz.toFixed(2))) + " troy oz" },
        { label: "Total Processing Cost", value: "$" + formatNumber(Math.round(totalProcessing)) },
        { label: "Net Value Per Tonne", value: "$" + formatNumber(parseFloat(valuePerTonne.toFixed(2))) },
        { label: "Break-Even Grade", value: formatNumber(parseFloat(breakEvenGrade.toFixed(2))) + " g/t" }
      ]
    };
  }`,
  [
    { q: "What is a good gold ore grade?", a: "A grade of 5 to 10 grams per tonne is considered good for open-pit mining. Underground mines typically need 8+ g/t to be profitable. Some high-grade deposits exceed 30 g/t." },
    { q: "What is the recovery rate?", a: "Recovery rate is the percentage of gold successfully extracted from ore during processing. Modern cyanide leaching achieves 85-95% recovery. Gravity methods recover 50-70% depending on ore characteristics." },
    { q: "What does break-even grade mean?", a: "Break-even grade is the minimum ore grade needed for the gold recovered to cover processing costs. Below this grade, mining the ore results in a financial loss." }
  ],
  `Total Gold = Grade x Tonnage
Recovered Gold = Total Gold x Recovery Rate
Troy Ounces = Recovered Grams / 31.1035
Net Value = (Troy Oz x Price) - (Tonnage x Processing Cost)
Break-Even Grade = (Processing Cost x 31.1035) / (Price x Recovery)`,
  ["mining-equipment-cost-per-ton-calculator", "gemstone-carat-to-mm-calculator", "coal-heating-value-calculator"]
);

add(
  "mining-equipment-cost-per-ton-calculator",
  "Mining Equipment Cost Per Ton Calculator",
  "Estimate the per-ton operating cost of mining equipment including fuel, maintenance, operator wages, and depreciation for different equipment types.",
  "Finance",
  "finance",
  "$",
  ["mining cost per ton", "mining equipment cost", "excavator cost", "haul truck cost", "mining operations"],
  [
    '{ name: "equipmentType", label: "Equipment Type", type: "select", options: [{ value: "1", label: "Excavator (200-ton class)" }, { value: "2", label: "Haul Truck (150-ton)" }, { value: "3", label: "Wheel Loader" }, { value: "4", label: "Drill Rig" }, { value: "5", label: "Dozer (D10/D11)" }], defaultValue: "1" }',
    '{ name: "tonsPerHour", label: "Production Rate (tons/hour)", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "hoursPerShift", label: "Hours Per Shift", type: "number", min: 4, max: 12, defaultValue: 10 }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "operatorWage", label: "Operator Hourly Wage ($)", type: "number", min: 15, max: 100, defaultValue: 35 }'
  ],
  `(inputs) => {
    const equip = parseFloat(inputs.equipmentType as unknown as string);
    const tph = inputs.tonsPerHour as number;
    const hours = inputs.hoursPerShift as number;
    const fuelPrice = inputs.fuelPrice as number;
    const wage = inputs.operatorWage as number;
    const fuelRates = { 1: 60, 2: 45, 3: 30, 4: 20, 5: 50 } as Record<number, number>;
    const maintRates = { 1: 250, 2: 180, 3: 120, 4: 150, 5: 200 } as Record<number, number>;
    const depreciationHr = { 1: 300, 2: 200, 3: 150, 4: 180, 5: 250 } as Record<number, number>;
    const fuelGph = fuelRates[equip];
    const fuelCostHr = fuelGph * fuelPrice;
    const maintCostHr = maintRates[equip];
    const depHr = depreciationHr[equip];
    const totalHourlyCost = fuelCostHr + maintCostHr + wage + depHr;
    const costPerTon = tph > 0 ? totalHourlyCost / tph : 0;
    const shiftCost = totalHourlyCost * hours;
    const shiftTons = tph * hours;
    return {
      primary: { label: "Cost Per Ton", value: "$" + formatNumber(parseFloat(costPerTon.toFixed(2))) },
      details: [
        { label: "Total Hourly Cost", value: "$" + formatNumber(Math.round(totalHourlyCost)) + "/hr" },
        { label: "Fuel Cost", value: "$" + formatNumber(Math.round(fuelCostHr)) + "/hr (" + fuelGph + " gal/hr)" },
        { label: "Maintenance Cost", value: "$" + formatNumber(maintRates[equip]) + "/hr" },
        { label: "Shift Total Cost", value: "$" + formatNumber(Math.round(shiftCost)) },
        { label: "Shift Production", value: formatNumber(shiftTons) + " tons" }
      ]
    };
  }`,
  [
    { q: "What is the biggest cost in mining operations?", a: "Fuel and maintenance are typically the largest equipment operating costs, often accounting for 60-70% of the total. Labor, depreciation, and tires/undercarriage make up the remainder." },
    { q: "How many tons can a large excavator move per hour?", a: "A 200-ton class hydraulic excavator can load 400 to 800 tons per hour depending on material type, swing angle, and truck positioning. Harder rock reduces productivity significantly." },
    { q: "How do you reduce mining cost per ton?", a: "Key strategies include maximizing equipment utilization, optimizing haul routes, matching truck and loader sizes, reducing idle time, and implementing preventive maintenance programs." }
  ],
  `Fuel Cost/hr = Gallons/hr x Fuel Price
Total Hourly Cost = Fuel + Maintenance + Operator Wage + Depreciation
Cost Per Ton = Total Hourly Cost / Tons Per Hour
Shift Cost = Hourly Cost x Hours Per Shift`,
  ["gold-ore-grade-value-calculator", "excavation-volume-calculator", "aggregate-volume-calculator"]
);

add(
  "land-survey-area-calculator",
  "Land Survey Area Calculator",
  "Calculate land area from survey measurements using traverse coordinates or simple length and width for rectangular, triangular, and irregular plots.",
  "Math",
  "math",
  "+",
  ["land survey area", "plot area", "survey calculator", "acreage calculator", "land measurement"],
  [
    '{ name: "plotShape", label: "Plot Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Triangle" }, { value: "3", label: "Trapezoid" }, { value: "4", label: "Irregular (4 sides)" }], defaultValue: "1" }',
    '{ name: "side1", label: "Side 1 / Length (meters)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "side2", label: "Side 2 / Width (meters)", type: "number", min: 1, max: 100000, defaultValue: 50 }',
    '{ name: "side3", label: "Side 3 (for trapezoid/irregular, meters)", type: "number", min: 0, max: 100000, defaultValue: 80 }',
    '{ name: "height", label: "Height/Perpendicular Distance (meters)", type: "number", min: 0, max: 100000, defaultValue: 50 }'
  ],
  `(inputs) => {
    const shape = parseFloat(inputs.plotShape as unknown as string);
    const s1 = inputs.side1 as number;
    const s2 = inputs.side2 as number;
    const s3 = inputs.side3 as number;
    const h = inputs.height as number;
    let areaSqm = 0;
    if (shape === 1) areaSqm = s1 * s2;
    else if (shape === 2) areaSqm = 0.5 * s1 * h;
    else if (shape === 3) areaSqm = 0.5 * (s1 + s3) * h;
    else areaSqm = 0.5 * (s1 + s3) * h;
    const acres = areaSqm / 4046.86;
    const hectares = areaSqm / 10000;
    const sqFeet = areaSqm * 10.7639;
    const perimeter = shape === 1 ? 2 * (s1 + s2) : shape === 2 ? s1 + s2 + Math.sqrt(s1 * s1 + h * h) : s1 + s2 + s3 + h;
    return {
      primary: { label: "Area", value: formatNumber(parseFloat(areaSqm.toFixed(2))) + " m2" },
      details: [
        { label: "Acres", value: formatNumber(parseFloat(acres.toFixed(4))) },
        { label: "Hectares", value: formatNumber(parseFloat(hectares.toFixed(4))) },
        { label: "Square Feet", value: formatNumber(Math.round(sqFeet)) },
        { label: "Perimeter", value: formatNumber(parseFloat(perimeter.toFixed(2))) + " m" },
        { label: "Shape", value: shape === 1 ? "Rectangle" : shape === 2 ? "Triangle" : shape === 3 ? "Trapezoid" : "Irregular" }
      ]
    };
  }`,
  [
    { q: "How many square meters in an acre?", a: "One acre equals 4,046.86 square meters or 43,560 square feet. It is roughly the size of a football field without the end zones." },
    { q: "What tools do land surveyors use?", a: "Modern land surveyors use total stations, GPS/GNSS receivers, and laser scanners. Traditional tools include theodolites, measuring chains, and level instruments. Software processes raw measurements into coordinates and areas." },
    { q: "How accurate are land surveys?", a: "Professional land surveys are typically accurate to within a few centimeters. Boundary surveys must meet legal accuracy standards that vary by jurisdiction, usually 1:5000 to 1:20000 precision ratios." }
  ],
  `Rectangle: Area = Length x Width
Triangle: Area = 0.5 x Base x Height
Trapezoid: Area = 0.5 x (Base1 + Base2) x Height
Acres = Area(m2) / 4046.86
Hectares = Area(m2) / 10000`,
  ["topographic-prominence-calculator", "excavation-volume-calculator", "gravel-calculator"]
);

add(
  "topographic-prominence-calculator",
  "Topographic Prominence Calculator",
  "Calculate the topographic prominence and isolation of a peak by comparing its summit elevation to the highest col connecting it to a higher peak.",
  "Science",
  "science",
  "A",
  ["topographic prominence", "peak prominence", "mountain elevation", "summit isolation", "peak bagging"],
  [
    '{ name: "summitElevation", label: "Summit Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 3000 }',
    '{ name: "colElevation", label: "Key Col Elevation (meters)", type: "number", min: 0, max: 8999, defaultValue: 2200 }',
    '{ name: "parentPeakElevation", label: "Parent Peak Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 4000 }',
    '{ name: "distanceToParent", label: "Distance to Parent Peak (km)", type: "number", min: 0.1, max: 1000, defaultValue: 25 }'
  ],
  `(inputs) => {
    const summit = inputs.summitElevation as number;
    const col = inputs.colElevation as number;
    const parent = inputs.parentPeakElevation as number;
    const dist = inputs.distanceToParent as number;
    const prominence = summit - col;
    const promRatio = summit > 0 ? (prominence / summit) * 100 : 0;
    const isolation = dist;
    const rise = parent - col;
    const colDepth = summit - col;
    const classification = prominence >= 1500 ? "Ultra-Prominent Peak" : prominence >= 600 ? "Major Peak" : prominence >= 150 ? "Notable Peak" : prominence >= 30 ? "Minor Peak" : "Subpeak";
    const lineOfSight = Math.sqrt(Math.pow(dist * 1000, 2) + Math.pow(parent - summit, 2)) / 1000;
    return {
      primary: { label: "Topographic Prominence", value: formatNumber(Math.round(prominence)) + " m" },
      details: [
        { label: "Prominence Ratio", value: formatNumber(parseFloat(promRatio.toFixed(1))) + "%" },
        { label: "Classification", value: classification },
        { label: "Isolation Distance", value: formatNumber(parseFloat(isolation.toFixed(1))) + " km" },
        { label: "Col Depth", value: formatNumber(Math.round(colDepth)) + " m" },
        { label: "Line-of-Sight to Parent", value: formatNumber(parseFloat(lineOfSight.toFixed(2))) + " km" }
      ]
    };
  }`,
  [
    { q: "What is topographic prominence?", a: "Prominence is the height of a peak above the lowest contour that encircles it but no higher peak. In simpler terms, it is how far you must descend from the summit before ascending a higher peak." },
    { q: "What is an ultra-prominent peak?", a: "An ultra-prominent peak has at least 1,500 meters (about 4,921 feet) of topographic prominence. There are roughly 1,524 ultra-prominent peaks worldwide. Mount Everest has the greatest prominence at 8,849 meters." },
    { q: "What is the difference between prominence and elevation?", a: "Elevation is the height above sea level. Prominence measures how much a peak stands out from its surroundings. A 3,000m peak next to a 2,900m ridge has only 100m prominence despite its high elevation." }
  ],
  `Prominence = Summit Elevation - Key Col Elevation
Prominence Ratio = (Prominence / Summit Elevation) x 100%
Line-of-Sight = sqrt(Distance^2 + Elevation Difference^2)`,
  ["land-survey-area-calculator", "slope-stability-factor-calculator", "river-discharge-rate-calculator"]
);

add(
  "river-discharge-rate-calculator",
  "River Discharge Rate Calculator",
  "Calculate river flow rate (discharge) using channel cross-section area and average velocity with Manning equation for open channel flow.",
  "Science",
  "science",
  "A",
  ["river discharge", "stream flow rate", "Manning equation", "channel flow", "water discharge calculator"],
  [
    '{ name: "channelWidth", label: "Channel Width (meters)", type: "number", min: 0.5, max: 5000, defaultValue: 10 }',
    '{ name: "avgDepth", label: "Average Depth (meters)", type: "number", min: 0.1, max: 50, defaultValue: 2 }',
    '{ name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.002 }',
    '{ name: "roughness", label: "Manning Roughness (n)", type: "select", options: [{ value: "0.025", label: "Clean, straight (0.025)" }, { value: "0.03", label: "Winding, some pools (0.030)" }, { value: "0.04", label: "Weedy, deep pools (0.040)" }, { value: "0.06", label: "Mountain stream, cobbles (0.060)" }, { value: "0.1", label: "Floodplain, heavy brush (0.100)" }], defaultValue: "0.03" }'
  ],
  `(inputs) => {
    const w = inputs.channelWidth as number;
    const d = inputs.avgDepth as number;
    const s = inputs.slope as number;
    const n = parseFloat(inputs.roughness as unknown as string);
    const area = w * d;
    const wettedPerimeter = w + 2 * d;
    const hydraulicRadius = area / wettedPerimeter;
    const velocity = (1 / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(s, 0.5);
    const discharge = velocity * area;
    const dischargeLps = discharge * 1000;
    const dischargeGpm = discharge * 15850.3;
    const dischargeCfs = discharge * 35.3147;
    return {
      primary: { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/s" },
      details: [
        { label: "Flow Velocity", value: formatNumber(parseFloat(velocity.toFixed(3))) + " m/s" },
        { label: "Discharge (CFS)", value: formatNumber(parseFloat(dischargeCfs.toFixed(1))) + " ft3/s" },
        { label: "Cross-Section Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Hydraulic Radius", value: formatNumber(parseFloat(hydraulicRadius.toFixed(3))) + " m" },
        { label: "Wetted Perimeter", value: formatNumber(parseFloat(wettedPerimeter.toFixed(2))) + " m" }
      ]
    };
  }`,
  [
    { q: "What is Manning equation?", a: "Manning equation calculates flow velocity in open channels based on the hydraulic radius, channel slope, and a roughness coefficient (n). It is one of the most widely used formulas in hydraulic engineering." },
    { q: "What affects river discharge?", a: "River discharge depends on channel size (width and depth), slope, and roughness. Rainfall, snowmelt, land use, and upstream dams also affect how much water flows through a river at any given time." },
    { q: "What is hydraulic radius?", a: "Hydraulic radius is the cross-sectional area of flow divided by the wetted perimeter. For wide, shallow channels, it approximately equals the average depth. It is a key parameter in flow calculations." }
  ],
  `V = (1/n) x R^(2/3) x S^(1/2) (Manning Equation)
Q = V x A
R = A / P (Hydraulic Radius)
A = Width x Depth
P = Width + 2 x Depth`,
  ["sediment-transport-calculator", "groundwater-flow-rate-calculator", "aquifer-yield-calculator"]
);

add(
  "sediment-transport-calculator",
  "Sediment Transport Calculator",
  "Estimate sediment transport capacity in rivers using flow velocity, particle size, and channel characteristics with the simplified Engelund-Hansen approach.",
  "Science",
  "science",
  "A",
  ["sediment transport", "bed load", "suspended sediment", "river erosion", "sediment yield"],
  [
    '{ name: "flowVelocity", label: "Flow Velocity (m/s)", type: "number", min: 0.1, max: 10, defaultValue: 1.5 }',
    '{ name: "waterDepth", label: "Water Depth (m)", type: "number", min: 0.1, max: 30, defaultValue: 2 }',
    '{ name: "channelWidth", label: "Channel Width (m)", type: "number", min: 1, max: 5000, defaultValue: 15 }',
    '{ name: "particleSize", label: "Median Particle Size (mm)", type: "select", options: [{ value: "0.1", label: "Fine Sand (0.1 mm)" }, { value: "0.5", label: "Medium Sand (0.5 mm)" }, { value: "2", label: "Coarse Sand (2 mm)" }, { value: "10", label: "Gravel (10 mm)" }, { value: "50", label: "Cobble (50 mm)" }], defaultValue: "0.5" }',
    '{ name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.1, defaultValue: 0.001 }'
  ],
  `(inputs) => {
    const V = inputs.flowVelocity as number;
    const d = inputs.waterDepth as number;
    const w = inputs.channelWidth as number;
    const D = parseFloat(inputs.particleSize as unknown as string) / 1000;
    const S = inputs.slope as number;
    const rhoW = 1000;
    const rhoS = 2650;
    const g = 9.81;
    const shearStress = rhoW * g * d * S;
    const shieldsParam = shearStress / ((rhoS - rhoW) * g * D);
    const criticalShields = 0.047;
    const transport = shieldsParam > criticalShields;
    const qs = 0.05 * rhoS * Math.pow(V, 2) * d * S / ((rhoS / rhoW - 1) * g * D * Math.sqrt((rhoS / rhoW - 1) * g * D));
    const totalTransport = Math.max(0, qs) * w;
    const dailyTons = totalTransport * 86400 / 1000;
    const annualTons = dailyTons * 365;
    return {
      primary: { label: "Transport Rate", value: formatNumber(parseFloat(totalTransport.toFixed(4))) + " kg/s" },
      details: [
        { label: "Daily Load", value: formatNumber(Math.round(dailyTons)) + " tonnes/day" },
        { label: "Annual Load", value: formatNumber(Math.round(annualTons)) + " tonnes/year" },
        { label: "Bed Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " Pa" },
        { label: "Shields Parameter", value: formatNumber(parseFloat(shieldsParam.toFixed(4))) },
        { label: "Transport Active", value: transport ? "Yes" : "No (below threshold)" }
      ]
    };
  }`,
  [
    { q: "What is sediment transport?", a: "Sediment transport is the movement of solid particles (sand, gravel, silt) by flowing water. It includes bed load (particles rolling along the bottom) and suspended load (particles carried in the water column)." },
    { q: "What is the Shields parameter?", a: "The Shields parameter is a dimensionless number comparing the forces trying to move a sediment particle (shear stress) to the forces keeping it in place (gravity). Transport begins when it exceeds a critical value of about 0.047." },
    { q: "Why does sediment transport matter?", a: "Sediment transport affects river channel shape, reservoir sedimentation, coastal erosion, water quality, and aquatic habitat. Understanding it is essential for dam design, flood control, and environmental management." }
  ],
  `Bed Shear Stress = rho_w x g x depth x slope
Shields Parameter = Shear Stress / ((rho_s - rho_w) x g x D)
Transport Rate (Engelund-Hansen) = 0.05 x rho_s x V^2 x d x S / ((SG-1) x g x D x sqrt((SG-1) x g x D))`,
  ["river-discharge-rate-calculator", "groundwater-flow-rate-calculator", "slope-stability-factor-calculator"]
);

add(
  "aquifer-yield-calculator",
  "Aquifer Yield Calculator",
  "Calculate the sustainable yield of an aquifer using transmissivity, storativity, and pumping test data for water supply planning.",
  "Science",
  "science",
  "A",
  ["aquifer yield", "well yield", "transmissivity", "sustainable pumping rate", "groundwater supply"],
  [
    '{ name: "transmissivity", label: "Transmissivity (m2/day)", type: "number", min: 1, max: 10000, defaultValue: 500 }',
    '{ name: "storativity", label: "Storativity", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.001 }',
    '{ name: "aquiferThickness", label: "Aquifer Thickness (m)", type: "number", min: 1, max: 500, defaultValue: 30 }',
    '{ name: "maxDrawdown", label: "Maximum Allowable Drawdown (m)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "wellRadius", label: "Well Radius (m)", type: "number", min: 0.05, max: 1, defaultValue: 0.15 }',
    '{ name: "pumpingDays", label: "Pumping Duration (days)", type: "number", min: 1, max: 365, defaultValue: 180 }'
  ],
  `(inputs) => {
    const T = inputs.transmissivity as number;
    const S = inputs.storativity as number;
    const b = inputs.aquiferThickness as number;
    const sw = inputs.maxDrawdown as number;
    const rw = inputs.wellRadius as number;
    const t = inputs.pumpingDays as number;
    const u = (rw * rw * S) / (4 * T * t);
    const W = -0.5772 - Math.log(u);
    const Q = (4 * Math.PI * T * sw) / W;
    const Qm3day = Q;
    const Qlpm = Q / 1.44;
    const Qgpm = Qlpm * 0.264172;
    const K = T / b;
    const specificCapacity = Q / sw;
    const totalVolume = Q * t;
    return {
      primary: { label: "Sustainable Yield", value: formatNumber(Math.round(Qm3day)) + " m3/day" },
      details: [
        { label: "Pumping Rate", value: formatNumber(parseFloat(Qlpm.toFixed(1))) + " L/min" },
        { label: "Pumping Rate (US)", value: formatNumber(parseFloat(Qgpm.toFixed(1))) + " gal/min" },
        { label: "Specific Capacity", value: formatNumber(parseFloat(specificCapacity.toFixed(2))) + " m3/day/m" },
        { label: "Hydraulic Conductivity", value: formatNumber(parseFloat(K.toFixed(2))) + " m/day" },
        { label: "Total Volume (" + t + " days)", value: formatNumber(Math.round(totalVolume)) + " m3" }
      ]
    };
  }`,
  [
    { q: "What is transmissivity?", a: "Transmissivity is the rate at which water flows through a unit width of aquifer for a unit hydraulic gradient. It equals hydraulic conductivity times aquifer thickness and is measured in m2/day. Higher values mean more productive aquifers." },
    { q: "What is storativity?", a: "Storativity (storage coefficient) is the volume of water released per unit area per unit decline in head. Confined aquifers have very low storativity (0.0001-0.001), while unconfined aquifers have higher values (0.01-0.3)." },
    { q: "How do you determine sustainable yield?", a: "Sustainable yield is determined through pumping tests, aquifer analysis, and long-term water balance studies. It must account for recharge rates, neighboring well interference, and environmental water needs." }
  ],
  `Q = (4 x pi x T x Drawdown) / W(u) (Theis Equation)
u = r^2 x S / (4 x T x t)
W(u) = -0.5772 - ln(u) (approximation)
Specific Capacity = Q / Drawdown
Hydraulic Conductivity = T / Aquifer Thickness`,
  ["groundwater-flow-rate-calculator", "well-drilling-cost-calculator", "river-discharge-rate-calculator"]
);

add(
  "geothermal-gradient-calculator",
  "Geothermal Gradient Calculator",
  "Calculate subsurface temperature at any depth using the geothermal gradient, surface temperature, and thermal conductivity of rock layers.",
  "Science",
  "science",
  "A",
  ["geothermal gradient", "subsurface temperature", "underground temperature", "geothermal energy", "heat flow"],
  [
    '{ name: "surfaceTemp", label: "Surface Temperature (C)", type: "number", min: -30, max: 50, defaultValue: 15 }',
    '{ name: "gradient", label: "Geothermal Gradient (C/km)", type: "number", min: 10, max: 100, defaultValue: 25 }',
    '{ name: "depth", label: "Target Depth (meters)", type: "number", min: 10, max: 10000, defaultValue: 3000 }',
    '{ name: "thermalConductivity", label: "Rock Thermal Conductivity (W/mK)", type: "number", min: 0.5, max: 7, defaultValue: 2.5 }',
    '{ name: "heatFlowDensity", label: "Heat Flow Density (mW/m2)", type: "number", min: 20, max: 200, defaultValue: 65 }'
  ],
  `(inputs) => {
    const Ts = inputs.surfaceTemp as number;
    const grad = inputs.gradient as number;
    const depth = inputs.depth as number;
    const k = inputs.thermalConductivity as number;
    const q = inputs.heatFlowDensity as number;
    const tempAtDepth = Ts + (grad * depth / 1000);
    const tempFromHeatFlow = Ts + (q * depth) / (k * 1000);
    const depthToBoiling = ((100 - Ts) / grad) * 1000;
    const heatFlowCalc = grad * k;
    const tempF = tempAtDepth * 9/5 + 32;
    const energyPotential = tempAtDepth > 150 ? "High (direct power generation)" : tempAtDepth > 90 ? "Medium (binary cycle power)" : tempAtDepth > 50 ? "Low (direct heating use)" : "Very low (heat pumps only)";
    return {
      primary: { label: "Temperature at Depth", value: formatNumber(parseFloat(tempAtDepth.toFixed(1))) + " C" },
      details: [
        { label: "Temperature (Fahrenheit)", value: formatNumber(parseFloat(tempF.toFixed(1))) + " F" },
        { label: "Heat Flow (calculated)", value: formatNumber(parseFloat(heatFlowCalc.toFixed(1))) + " mW/m2" },
        { label: "Depth to 100C", value: formatNumber(Math.round(depthToBoiling)) + " m" },
        { label: "Geothermal Potential", value: energyPotential },
        { label: "Temp from Heat Flow Model", value: formatNumber(parseFloat(tempFromHeatFlow.toFixed(1))) + " C" }
      ]
    };
  }`,
  [
    { q: "What is the average geothermal gradient?", a: "The average geothermal gradient is about 25 to 30 degrees Celsius per kilometer of depth. However, it varies widely from 10 C/km in old continental crust to over 80 C/km near volcanic areas and tectonic boundaries." },
    { q: "How deep do you need to drill for geothermal energy?", a: "For electricity generation, wells typically need to reach 150 C or higher, which is usually 2-5 km deep. For direct heating, shallower wells of 1-2 km may suffice. Geothermal heat pumps work at just 3-100 meters." },
    { q: "What is heat flow density?", a: "Heat flow density measures the rate of heat transfer from the Earth interior to the surface per unit area, in milliwatts per square meter. The global average is about 65 mW/m2, higher near plate boundaries and hotspots." }
  ],
  `Temperature at Depth = Surface Temp + (Gradient x Depth / 1000)
Heat Flow = Gradient x Thermal Conductivity
Depth to 100C = ((100 - Surface Temp) / Gradient) x 1000`,
  ["volcanic-eruption-index-calculator", "well-drilling-cost-calculator", "rock-density-calculator"]
);

add(
  "plate-tectonics-velocity-calculator",
  "Plate Tectonics Velocity Calculator",
  "Calculate tectonic plate movement rates, displacement over time, and convergence or divergence speeds between two plates.",
  "Science",
  "science",
  "A",
  ["plate tectonics velocity", "plate movement", "continental drift", "plate boundary speed", "tectonic rate"],
  [
    '{ name: "plate1Velocity", label: "Plate 1 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 60 }',
    '{ name: "plate1Direction", label: "Plate 1 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 315 }',
    '{ name: "plate2Velocity", label: "Plate 2 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 25 }',
    '{ name: "plate2Direction", label: "Plate 2 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 45 }',
    '{ name: "timeYears", label: "Time Period (million years)", type: "number", min: 0.1, max: 500, defaultValue: 10 }'
  ],
  `(inputs) => {
    const v1 = inputs.plate1Velocity as number;
    const d1 = inputs.plate1Direction as number * Math.PI / 180;
    const v2 = inputs.plate2Velocity as number;
    const d2 = inputs.plate2Direction as number * Math.PI / 180;
    const t = inputs.timeYears as number;
    const v1x = v1 * Math.sin(d1);
    const v1y = v1 * Math.cos(d1);
    const v2x = v2 * Math.sin(d2);
    const v2y = v2 * Math.cos(d2);
    const relVx = v1x - v2x;
    const relVy = v1y - v2y;
    const relVelocity = Math.sqrt(relVx * relVx + relVy * relVy);
    const relDirection = (Math.atan2(relVx, relVy) * 180 / Math.PI + 360) % 360;
    const displacementKm = relVelocity * t * 1e6 / 1e6;
    const plate1DisplKm = v1 * t * 1e6 / 1e6;
    const cmPerYear = relVelocity / 10;
    const boundaryType = relVelocity < 5 ? "Transform/Slow" : "Active Convergent/Divergent";
    return {
      primary: { label: "Relative Velocity", value: formatNumber(parseFloat(relVelocity.toFixed(1))) + " mm/yr" },
      details: [
        { label: "Relative Speed (cm/yr)", value: formatNumber(parseFloat(cmPerYear.toFixed(2))) + " cm/yr" },
        { label: "Relative Direction", value: formatNumber(Math.round(relDirection)) + " degrees" },
        { label: "Displacement in " + t + " Myr", value: formatNumber(Math.round(displacementKm)) + " km" },
        { label: "Plate 1 Travel in " + t + " Myr", value: formatNumber(Math.round(plate1DisplKm)) + " km" },
        { label: "Boundary Activity", value: boundaryType }
      ]
    };
  }`,
  [
    { q: "How fast do tectonic plates move?", a: "Most plates move 1 to 10 centimeters per year. The fastest is the Pacific Plate at about 7-10 cm/yr. The slowest plates, like the Antarctic Plate, move less than 2 cm/yr." },
    { q: "What happens at plate boundaries?", a: "At convergent boundaries, plates collide causing mountains, trenches, and subduction. At divergent boundaries, plates separate creating rift valleys and mid-ocean ridges. Transform boundaries cause lateral sliding and earthquakes." },
    { q: "How is plate velocity measured?", a: "Modern plate velocities are measured using GPS stations, satellite laser ranging, and very long baseline interferometry. Historical velocities are determined from magnetic anomalies on the ocean floor and hotspot tracks." }
  ],
  `Relative Velocity = sqrt((V1x - V2x)^2 + (V1y - V2y)^2)
Vx = V x sin(Direction), Vy = V x cos(Direction)
Displacement (km) = Relative Velocity (mm/yr) x Time (Myr)`,
  ["earthquake-magnitude-converter", "seismic-wave-velocity-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "coal-heating-value-calculator",
  "Coal Heating Value Calculator",
  "Calculate the heating value and energy content of coal based on rank, moisture content, ash content, and sulfur percentage.",
  "Science",
  "science",
  "A",
  ["coal heating value", "BTU coal", "coal energy", "coal rank", "calorific value"],
  [
    '{ name: "coalRank", label: "Coal Rank", type: "select", options: [{ value: "14000", label: "Anthracite (14,000 BTU/lb)" }, { value: "12500", label: "Bituminous (12,500 BTU/lb)" }, { value: "9500", label: "Sub-bituminous (9,500 BTU/lb)" }, { value: "6500", label: "Lignite (6,500 BTU/lb)" }], defaultValue: "12500" }',
    '{ name: "tonnage", label: "Coal Quantity (tonnes)", type: "number", min: 1, max: 1000000, defaultValue: 1000 }',
    '{ name: "moisture", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 8 }',
    '{ name: "ash", label: "Ash Content (%)", type: "number", min: 0, max: 40, defaultValue: 10 }',
    '{ name: "sulfur", label: "Sulfur Content (%)", type: "number", min: 0, max: 8, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const baseBTU = parseFloat(inputs.coalRank as unknown as string);
    const tonnes = inputs.tonnage as number;
    const moisture = inputs.moisture as number / 100;
    const ash = inputs.ash as number / 100;
    const sulfur = inputs.sulfur as number / 100;
    const effectiveFraction = 1 - moisture - ash;
    const actualBTU = baseBTU * effectiveFraction;
    const totalBTU = actualBTU * tonnes * 2204.62;
    const totalGJ = totalBTU * 0.001055 / 1000;
    const totalMWh = totalGJ / 3.6;
    const co2Tons = tonnes * effectiveFraction * 0.75 * 3.667;
    const so2Tons = tonnes * sulfur * 2;
    const pricePerTon = actualBTU > 10000 ? 80 : actualBTU > 7000 ? 50 : 30;
    return {
      primary: { label: "Effective Heating Value", value: formatNumber(Math.round(actualBTU)) + " BTU/lb" },
      details: [
        { label: "Total Energy", value: formatNumber(Math.round(totalGJ)) + " GJ" },
        { label: "Electrical Equivalent", value: formatNumber(Math.round(totalMWh)) + " MWh" },
        { label: "Combustible Fraction", value: (effectiveFraction * 100).toFixed(1) + "%" },
        { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons)) + " tonnes" },
        { label: "SO2 Emissions", value: formatNumber(parseFloat(so2Tons.toFixed(1))) + " tonnes" }
      ]
    };
  }`,
  [
    { q: "What is coal heating value?", a: "Heating value (calorific value) is the amount of energy released when coal is burned, measured in BTU per pound or megajoules per kilogram. It determines how much useful energy can be extracted from a given quantity of coal." },
    { q: "How do moisture and ash affect coal quality?", a: "Moisture and ash are non-combustible components that reduce the effective heating value. A coal with 10% moisture and 10% ash can only burn 80% of its mass as fuel, significantly lowering its energy output per ton." },
    { q: "What coal rank has the highest heating value?", a: "Anthracite has the highest heating value at about 14,000 BTU/lb, followed by bituminous (12,000-13,000), sub-bituminous (8,000-10,000), and lignite (5,500-7,500 BTU/lb)." }
  ],
  `Effective BTU/lb = Base BTU x (1 - Moisture - Ash)
Total Energy (BTU) = Effective BTU x Tonnes x 2204.62 lbs/tonne
Energy (GJ) = Total BTU x 0.001055 / 1000
CO2 = Tonnage x Combustible Fraction x Carbon Content x 3.667`,
  ["gold-ore-grade-value-calculator", "mining-equipment-cost-per-ton-calculator", "geothermal-gradient-calculator"]
);

add(
  "aggregate-volume-calculator",
  "Aggregate Volume Calculator",
  "Calculate the volume and weight of aggregate material needed for construction projects based on area, depth, and material type.",
  "Everyday",
  "everyday",
  "~",
  ["aggregate volume", "gravel amount", "crushed stone calculator", "fill material", "construction aggregate"],
  [
    '{ name: "length", label: "Area Length (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 10 }',
    '{ name: "width", label: "Area Width (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 5 }',
    '{ name: "depth", label: "Depth/Thickness (cm)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "materialType", label: "Material Type", type: "select", options: [{ value: "1500", label: "Pea Gravel (1,500 kg/m3)" }, { value: "1600", label: "Crushed Stone (1,600 kg/m3)" }, { value: "1700", label: "Compacted Gravel (1,700 kg/m3)" }, { value: "1400", label: "Sand (1,400 kg/m3)" }, { value: "2000", label: "Recycled Concrete (2,000 kg/m3)" }], defaultValue: "1600" }',
    '{ name: "compactionFactor", label: "Compaction Waste Factor (%)", type: "number", min: 0, max: 30, defaultValue: 10 }'
  ],
  `(inputs) => {
    const l = inputs.length as number;
    const w = inputs.width as number;
    const d = inputs.depth as number / 100;
    const density = parseFloat(inputs.materialType as unknown as string);
    const waste = inputs.compactionFactor as number / 100;
    const baseVolume = l * w * d;
    const totalVolume = baseVolume * (1 + waste);
    const weightKg = totalVolume * density;
    const weightTons = weightKg / 1000;
    const cubicYards = totalVolume * 1.30795;
    const area = l * w;
    const priceEstimate = weightTons * 25;
    return {
      primary: { label: "Total Volume Needed", value: formatNumber(parseFloat(totalVolume.toFixed(2))) + " m3" },
      details: [
        { label: "Weight", value: formatNumber(Math.round(weightKg)) + " kg (" + formatNumber(parseFloat(weightTons.toFixed(2))) + " tonnes)" },
        { label: "Cubic Yards", value: formatNumber(parseFloat(cubicYards.toFixed(2))) + " yd3" },
        { label: "Coverage Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Base Volume (no waste)", value: formatNumber(parseFloat(baseVolume.toFixed(2))) + " m3" },
        { label: "Estimated Cost ($25/tonne)", value: "$" + formatNumber(Math.round(priceEstimate)) }
      ]
    };
  }`,
  [
    { q: "How much aggregate do I need per square meter?", a: "It depends on depth. For a 10cm layer, you need 0.1 cubic meters per square meter. At typical crushed stone density (1,600 kg/m3), that is about 160 kg per square meter." },
    { q: "Should I add extra for waste and compaction?", a: "Yes. Aggregate compacts during installation and some material is lost during spreading. Adding 10-15% extra is standard practice. Compacted gravel may need even more as it settles significantly." },
    { q: "What size aggregate should I use?", a: "For driveways, use 3/4 inch crushed stone. For drainage, use larger 1.5 to 2 inch stone. For base layers under pavement, use a graded mix of sizes for maximum compaction and stability." }
  ],
  `Volume = Length x Width x (Depth / 100)
Total Volume = Volume x (1 + Waste Factor)
Weight = Total Volume x Material Density
Cubic Yards = Volume(m3) x 1.30795`,
  ["gravel-calculator", "excavation-volume-calculator", "land-survey-area-calculator"]
);

add(
  "excavation-volume-calculator",
  "Excavation Volume Calculator",
  "Calculate excavation volume, soil removal weight, truck loads needed, and disposal costs for construction site earthwork.",
  "Everyday",
  "everyday",
  "~",
  ["excavation volume", "earthwork calculator", "dig volume", "soil removal", "cut and fill"],
  [
    '{ name: "length", label: "Excavation Length (meters)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "width", label: "Excavation Width (meters)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "depth", label: "Excavation Depth (meters)", type: "number", min: 0.1, max: 50, defaultValue: 3 }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1400", label: "Loose Sand (1,400 kg/m3)" }, { value: "1700", label: "Clay (1,700 kg/m3)" }, { value: "1900", label: "Compacted Soil (1,900 kg/m3)" }, { value: "2500", label: "Rock (2,500 kg/m3)" }], defaultValue: "1700" }',
    '{ name: "swellFactor", label: "Swell Factor (%)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "truckCapacity", label: "Truck Capacity (m3)", type: "number", min: 5, max: 25, defaultValue: 12 }'
  ],
  `(inputs) => {
    const l = inputs.length as number;
    const w = inputs.width as number;
    const d = inputs.depth as number;
    const density = parseFloat(inputs.soilType as unknown as string);
    const swell = inputs.swellFactor as number / 100;
    const truck = inputs.truckCapacity as number;
    const bankVolume = l * w * d;
    const looseVolume = bankVolume * (1 + swell);
    const weight = bankVolume * density;
    const weightTons = weight / 1000;
    const truckLoads = Math.ceil(looseVolume / truck);
    const disposalCost = weightTons * 15;
    const haulCost = truckLoads * 150;
    const totalCost = disposalCost + haulCost;
    return {
      primary: { label: "Bank Volume", value: formatNumber(parseFloat(bankVolume.toFixed(2))) + " m3" },
      details: [
        { label: "Loose Volume (after swell)", value: formatNumber(parseFloat(looseVolume.toFixed(2))) + " m3" },
        { label: "Total Weight", value: formatNumber(Math.round(weightTons)) + " tonnes" },
        { label: "Truck Loads Required", value: formatNumber(truckLoads) + " loads" },
        { label: "Disposal Cost ($15/tonne)", value: "$" + formatNumber(Math.round(disposalCost)) },
        { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  }`,
  [
    { q: "What is the swell factor in excavation?", a: "When soil is dug up, it increases in volume because it loosens and air pockets form. This increase is called swell. Clay typically swells 20-30%, sand 10-15%, and rock 40-60%. You must account for this when planning truck loads." },
    { q: "How many truck loads for 100 cubic meters?", a: "For a standard 12m3 dump truck with 25% swell factor: 100 x 1.25 / 12 = about 11 truck loads. Always round up since you cannot have a partial load." },
    { q: "What is bank volume vs loose volume?", a: "Bank volume is the soil in its original compacted state in the ground. Loose volume is the greater amount of space it occupies after excavation due to swell. Loose volume is always greater than bank volume." }
  ],
  `Bank Volume = Length x Width x Depth
Loose Volume = Bank Volume x (1 + Swell Factor)
Weight = Bank Volume x Soil Density
Truck Loads = Loose Volume / Truck Capacity (rounded up)`,
  ["aggregate-volume-calculator", "gravel-calculator", "land-survey-area-calculator"]
);

add(
  "gravel-calculator",
  "Gravel Calculator",
  "Calculate gravel quantity needed for driveways, paths, and landscaping projects with weight, volume, cost, and delivery truck estimates.",
  "Everyday",
  "everyday",
  "~",
  ["gravel calculator", "driveway gravel", "landscaping stone", "gravel weight", "gravel coverage"],
  [
    '{ name: "area", label: "Area to Cover (sq meters)", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "thickness", label: "Gravel Thickness (cm)", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "gravelType", label: "Gravel Type", type: "select", options: [{ value: "1450", label: "Pea Gravel" }, { value: "1600", label: "Crushed Limestone" }, { value: "1550", label: "River Rock" }, { value: "1700", label: "Granite Chips" }, { value: "1350", label: "Lava Rock" }], defaultValue: "1600" }',
    '{ name: "pricePerTonne", label: "Price Per Tonne ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "deliveryFee", label: "Delivery Fee ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const area = inputs.area as number;
    const t = inputs.thickness as number / 100;
    const density = parseFloat(inputs.gravelType as unknown as string);
    const price = inputs.pricePerTonne as number;
    const delivery = inputs.deliveryFee as number;
    const volume = area * t;
    const volumeExtra = volume * 1.1;
    const weightKg = volumeExtra * density;
    const weightTonnes = weightKg / 1000;
    const cubicYards = volumeExtra * 1.30795;
    const materialCost = weightTonnes * price;
    const totalCost = materialCost + delivery;
    const bags25kg = Math.ceil(weightKg / 25);
    return {
      primary: { label: "Gravel Needed", value: formatNumber(parseFloat(weightTonnes.toFixed(2))) + " tonnes" },
      details: [
        { label: "Volume (with 10% extra)", value: formatNumber(parseFloat(volumeExtra.toFixed(2))) + " m3" },
        { label: "Cubic Yards", value: formatNumber(parseFloat(cubicYards.toFixed(2))) + " yd3" },
        { label: "25kg Bags Equivalent", value: formatNumber(bags25kg) + " bags" },
        { label: "Material Cost", value: "$" + formatNumber(Math.round(materialCost)) },
        { label: "Total Cost (incl. delivery)", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  }`,
  [
    { q: "How thick should driveway gravel be?", a: "A driveway typically needs 10 to 15 cm (4-6 inches) of gravel, usually applied in two layers: a coarser base layer and a finer top layer. Paths and patios need about 5-8 cm." },
    { q: "How much does a cubic meter of gravel weigh?", a: "Most gravel weighs 1,400 to 1,700 kg per cubic meter depending on type and moisture. Crushed limestone averages about 1,600 kg/m3, while lighter materials like lava rock weigh around 1,350 kg/m3." },
    { q: "Should I order extra gravel?", a: "Yes. Order 10-15% more than calculated to account for uneven ground, compaction settling, and spreading waste. It is better to have a small surplus than to run short mid-project." }
  ],
  `Volume = Area x Thickness
Volume with Extra = Volume x 1.10
Weight = Volume x Density
Material Cost = Weight(tonnes) x Price Per Tonne
Total = Material Cost + Delivery`,
  ["aggregate-volume-calculator", "excavation-volume-calculator", "land-survey-area-calculator"]
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch15.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch15.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch15.txt`);
console.log(`Registry saved to: scripts/new-regs-batch15.txt`);
