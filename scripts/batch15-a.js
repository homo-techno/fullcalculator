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
