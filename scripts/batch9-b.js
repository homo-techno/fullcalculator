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
