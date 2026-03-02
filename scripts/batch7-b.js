add('firewood-btu-calculator', 'Firewood BTU Calculator',
  'Estimate BTU output by wood type and volume.',
  'Science', 'science', 'A',
  ['firewood btu', 'wood heat output'],
  [
    '{ name: "woodType", label: "Wood Type", type: "select", options: [{ value: "20", label: "Oak (20M BTU/cord)" }, { value: "18", label: "Maple (18M BTU/cord)" }, { value: "15", label: "Pine (15M BTU/cord)" }, { value: "17", label: "Birch (17M BTU/cord)" }], defaultValue: "20" }',
    '{ name: "cords", label: "Number of Cords", type: "number", min: 0.25, max: 50, defaultValue: 2 }',
    '{ name: "efficiency", label: "Stove Efficiency (%)", type: "number", min: 30, max: 95, defaultValue: 75 }',
  ],
  `(inputs) => {
      const btuPerCord = Number(inputs.woodType as number);
      const c = inputs.cords as number;
      const eff = inputs.efficiency as number;
      const totalBtu = btuPerCord * 1000000 * c;
      const usable = totalBtu * (eff / 100);
      return {
        primary: { label: "Usable BTU", value: formatNumber(Math.round(usable)) },
        details: [
          { label: "Gross BTU", value: formatNumber(Math.round(totalBtu)) },
          { label: "Heat Lost", value: formatNumber(Math.round(totalBtu - usable)) + " BTU" },
        ],
      };
  }`,
  [{ q: 'Which wood produces the most heat?', a: 'Hardwoods like oak and hickory produce the most BTU per cord.' },
   { q: 'What is a cord of wood?', a: 'A cord is a stack of wood measuring 4 by 4 by 8 feet.' }],
  'Usable BTU = BTU/cord x Cords x Efficiency/100',
  []
);

add('pellet-stove-cost-calculator', 'Pellet Stove Cost Calculator',
  'Estimate annual pellet stove heating cost.',
  'Finance', 'finance', '$',
  ['pellet stove cost', 'pellet heating'],
  [
    '{ name: "bagsPerMonth", label: "Bags Per Month", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "costPerBag", label: "Cost Per Bag ($)", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "months", label: "Heating Months", type: "number", min: 1, max: 12, defaultValue: 5 }',
  ],
  `(inputs) => {
      const bags = inputs.bagsPerMonth as number;
      const cost = inputs.costPerBag as number;
      const m = inputs.months as number;
      const annual = bags * cost * m;
      const monthly = bags * cost;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) },
        details: [
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
          { label: "Total Bags", value: formatNumber(bags * m) },
        ],
      };
  }`,
  [{ q: 'How many bags of pellets do I need per day?', a: 'Most stoves burn one to three bags per day depending on heat setting.' },
   { q: 'Are pellet stoves cheaper than gas?', a: 'Pellet stoves can be cheaper in areas where pellets are affordable.' }],
  'Annual Cost = Bags/Month x Cost/Bag x Months',
  []
);

add('heat-pump-savings-calculator', 'Heat Pump Savings Calculator',
  'Compare heat pump cost versus furnace cost.',
  'Finance', 'finance', '$',
  ['heat pump savings', 'furnace comparison'],
  [
    '{ name: "furnaceCost", label: "Annual Furnace Cost ($)", type: "number", min: 100, max: 10000, defaultValue: 1500 }',
    '{ name: "heatPumpCost", label: "Annual Heat Pump Cost ($)", type: "number", min: 100, max: 10000, defaultValue: 800 }',
    '{ name: "installCost", label: "Heat Pump Install Cost ($)", type: "number", min: 1000, max: 30000, defaultValue: 5000 }',
  ],
  `(inputs) => {
      const furnace = inputs.furnaceCost as number;
      const hp = inputs.heatPumpCost as number;
      const install = inputs.installCost as number;
      const annualSavings = furnace - hp;
      const payback = annualSavings > 0 ? install / annualSavings : 0;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Payback Period", value: payback > 0 ? formatNumber(Math.round(payback * 10) / 10) + " years" : "No savings" },
          { label: "10-Year Savings", value: "$" + formatNumber(Math.round(annualSavings * 10 - install)) },
        ],
      };
  }`,
  [{ q: 'How long does a heat pump last?', a: 'Heat pumps typically last 15 to 20 years with regular maintenance.' },
   { q: 'Do heat pumps work in cold climates?', a: 'Modern cold-climate heat pumps work well down to negative 15 degrees F.' }],
  'Annual Savings = Furnace Cost - Heat Pump Cost',
  []
);

add('duct-insulation-calculator', 'Duct Insulation Calculator',
  'Estimate energy savings from insulating ductwork.',
  'Science', 'science', 'A',
  ['duct insulation', 'duct r-value'],
  [
    '{ name: "ductLength", label: "Duct Length (ft)", type: "number", min: 1, max: 500, defaultValue: 50 }',
    '{ name: "ductDiameter", label: "Duct Diameter (in)", type: "number", min: 4, max: 24, defaultValue: 8 }',
    '{ name: "tempDiff", label: "Temperature Difference (F)", type: "number", min: 5, max: 80, defaultValue: 30 }',
    '{ name: "rValue", label: "Insulation R-Value", type: "number", min: 2, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const len = inputs.ductLength as number;
      const dia = inputs.ductDiameter as number;
      const dt = inputs.tempDiff as number;
      const r = inputs.rValue as number;
      const surfaceArea = Math.PI * (dia / 12) * len;
      const heatLossUninsulated = surfaceArea * dt / 1;
      const heatLossInsulated = surfaceArea * dt / r;
      const saved = heatLossUninsulated - heatLossInsulated;
      return {
        primary: { label: "BTU/hr Saved", value: formatNumber(Math.round(saved)) },
        details: [
          { label: "Duct Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
          { label: "Uninsulated Loss", value: formatNumber(Math.round(heatLossUninsulated)) + " BTU/hr" },
        ],
      };
  }`,
  [{ q: 'What R-value is best for ducts?', a: 'R-6 or R-8 insulation is recommended for most duct systems.' },
   { q: 'Should I insulate all ducts?', a: 'Insulate ducts in unconditioned spaces like attics and crawl spaces.' }],
  'Savings = Surface Area x TempDiff x (1 - 1/R)',
  []
);

add('air-filter-replacement-calculator', 'Air Filter Replacement Calculator',
  'Plan filter replacements and estimate annual cost.',
  'Everyday', 'everyday', '~',
  ['air filter schedule', 'filter replacement cost'],
  [
    '{ name: "filterCost", label: "Filter Cost ($)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "changeInterval", label: "Change Interval (days)", type: "number", min: 14, max: 365, defaultValue: 90 }',
    '{ name: "numUnits", label: "Number of Units", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const cost = inputs.filterCost as number;
      const interval = inputs.changeInterval as number;
      const units = inputs.numUnits as number;
      const changesPerYear = Math.ceil(365 / interval);
      const annualCost = changesPerYear * cost * units;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        details: [
          { label: "Changes Per Year", value: formatNumber(changesPerYear * units) },
          { label: "Cost Per Change", value: "$" + formatNumber(Math.round(cost * units)) },
        ],
      };
  }`,
  [{ q: 'How often should I change my air filter?', a: 'Standard filters should be changed every 30 to 90 days.' },
   { q: 'Do expensive filters last longer?', a: 'Higher quality filters can last up to 6 or 12 months.' }],
  'Annual Cost = (365 / Interval) x Cost x Units',
  []
);

add('water-heater-cost-calculator', 'Water Heater Cost Calculator',
  'Estimate annual water heating energy cost.',
  'Finance', 'finance', '$',
  ['water heater cost', 'hot water cost'],
  [
    '{ name: "gallonsPerDay", label: "Gallons Per Day", type: "number", min: 10, max: 200, defaultValue: 50 }',
    '{ name: "tempRise", label: "Temperature Rise (F)", type: "number", min: 20, max: 100, defaultValue: 60 }',
    '{ name: "energyCost", label: "Energy Cost ($/kWh)", type: "number", min: 0.01, max: 1, defaultValue: 0.12 }',
    '{ name: "efficiency", label: "Efficiency (%)", type: "number", min: 50, max: 99, defaultValue: 90 }',
  ],
  `(inputs) => {
      const gal = inputs.gallonsPerDay as number;
      const rise = inputs.tempRise as number;
      const rate = inputs.energyCost as number;
      const eff = inputs.efficiency as number;
      const btuPerDay = gal * 8.34 * rise;
      const kwhPerDay = btuPerDay / 3412 / (eff / 100);
      const annualCost = kwhPerDay * rate * 365;
      return {
        primary: { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        details: [
          { label: "Daily kWh", value: formatNumber(Math.round(kwhPerDay * 10) / 10) },
          { label: "Monthly Cost", value: "$" + formatNumber(Math.round(annualCost / 12)) },
        ],
      };
  }`,
  [{ q: 'How much hot water does a household use?', a: 'An average household uses 40 to 60 gallons of hot water per day.' },
   { q: 'What temperature should I set my water heater?', a: 'Set your water heater to 120 degrees F for safety and efficiency.' }],
  'Annual Cost = (Gallons x 8.34 x Rise / 3412 / Eff) x Rate x 365',
  []
);

add('tankless-water-heater-savings-calculator', 'Tankless Water Heater Savings Calculator',
  'Compare tankless versus tank water heater costs.',
  'Finance', 'finance', '$',
  ['tankless savings', 'tankless vs tank'],
  [
    '{ name: "tankAnnual", label: "Tank Annual Cost ($)", type: "number", min: 50, max: 3000, defaultValue: 500 }',
    '{ name: "tanklessAnnual", label: "Tankless Annual Cost ($)", type: "number", min: 50, max: 3000, defaultValue: 350 }',
    '{ name: "installDiff", label: "Extra Install Cost ($)", type: "number", min: 0, max: 10000, defaultValue: 1500 }',
  ],
  `(inputs) => {
      const tank = inputs.tankAnnual as number;
      const tankless = inputs.tanklessAnnual as number;
      const install = inputs.installDiff as number;
      const annual = tank - tankless;
      const payback = annual > 0 ? install / annual : 0;
      const tenYear = annual * 10 - install;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annual)) },
        details: [
          { label: "Payback Period", value: payback > 0 ? formatNumber(Math.round(payback * 10) / 10) + " years" : "No savings" },
          { label: "10-Year Net Savings", value: "$" + formatNumber(Math.round(tenYear)) },
        ],
      };
  }`,
  [{ q: 'How long do tankless water heaters last?', a: 'Tankless water heaters typically last 20 or more years.' },
   { q: 'Are tankless heaters worth it?', a: 'They are worth it if your payback period is under 5 years.' }],
  'Annual Savings = Tank Cost - Tankless Cost',
  []
);

add('sump-pump-sizing-calculator', 'Sump Pump Sizing Calculator',
  'Determine sump pump capacity needed for your pit.',
  'Everyday', 'everyday', '~',
  ['sump pump size', 'sump pump gph'],
  [
    '{ name: "pitDiameter", label: "Pit Diameter (in)", type: "number", min: 10, max: 36, defaultValue: 18 }',
    '{ name: "waterRise", label: "Water Rise Rate (in/min)", type: "number", min: 0.1, max: 10, defaultValue: 1 }',
    '{ name: "headHeight", label: "Discharge Head (ft)", type: "number", min: 2, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const dia = inputs.pitDiameter as number;
      const rise = inputs.waterRise as number;
      const head = inputs.headHeight as number;
      const pitArea = Math.PI * Math.pow(dia / 2, 2);
      const cubicInPerMin = pitArea * rise;
      const gpm = cubicInPerMin / 231;
      const gph = gpm * 60;
      const recommended = Math.ceil(gph * (1 + head * 0.05));
      return {
        primary: { label: "Recommended GPH", value: formatNumber(recommended) },
        details: [
          { label: "Inflow Rate", value: formatNumber(Math.round(gpm * 100) / 100) + " GPM" },
          { label: "Head Loss Factor", value: formatNumber(Math.round((1 + head * 0.05) * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'What size sump pump do I need?', a: 'Most homes need a pump rated at 2000 to 3000 GPH.' },
   { q: 'Should I get a backup sump pump?', a: 'A battery backup pump is recommended for power outage protection.' }],
  'GPH = Pit Area x Rise Rate / 231 x 60 x Head Factor',
  []
);

add('dehumidifier-sizing-calculator', 'Dehumidifier Sizing Calculator',
  'Find the right dehumidifier capacity for your room.',
  'Everyday', 'everyday', '~',
  ['dehumidifier size', 'dehumidifier pints'],
  [
    '{ name: "sqft", label: "Room Size (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 500 }',
    '{ name: "dampness", label: "Dampness Level", type: "select", options: [{ value: "1", label: "Slightly Damp" }, { value: "1.4", label: "Moderately Damp" }, { value: "1.8", label: "Very Damp" }, { value: "2.2", label: "Wet" }], defaultValue: "1.4" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const factor = Number(inputs.dampness as number);
      const basePints = sqft * 0.06;
      const pints = Math.ceil(basePints * factor);
      return {
        primary: { label: "Capacity Needed", value: formatNumber(pints) + " pints/day" },
        details: [
          { label: "Room Size", value: formatNumber(sqft) + " sq ft" },
          { label: "Base Capacity", value: formatNumber(Math.round(basePints)) + " pints/day" },
        ],
      };
  }`,
  [{ q: 'What size dehumidifier do I need?', a: 'Use 30 pints for damp 500 sq ft or 50 pints for wet areas.' },
   { q: 'Where should I place a dehumidifier?', a: 'Place it in the dampest area with good air circulation.' }],
  'Pints/Day = Sq Ft x 0.06 x Dampness Factor',
  []
);

add('humidifier-sizing-calculator', 'Humidifier Sizing Calculator',
  'Determine humidifier output for your home size.',
  'Everyday', 'everyday', '~',
  ['humidifier size', 'humidifier gallons'],
  [
    '{ name: "sqft", label: "Home Size (sq ft)", type: "number", min: 200, max: 10000, defaultValue: 1500 }',
    '{ name: "tightness", label: "Home Tightness", type: "select", options: [{ value: "0.5", label: "Tight (New)" }, { value: "1", label: "Average" }, { value: "1.5", label: "Loose (Old)" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const tight = Number(inputs.tightness as number);
      const gallonsPerDay = (sqft / 1000) * 2 * tight;
      return {
        primary: { label: "Output Needed", value: formatNumber(Math.round(gallonsPerDay * 10) / 10) + " gal/day" },
        details: [
          { label: "Home Size", value: formatNumber(sqft) + " sq ft" },
          { label: "Tightness Factor", value: formatNumber(tight) + "x" },
        ],
      };
  }`,
  [{ q: 'What humidity level is ideal?', a: 'Keep indoor humidity between 30 and 50 percent for comfort.' },
   { q: 'Do I need a whole-house humidifier?', a: 'Homes over 1500 sq ft benefit from a whole-house unit.' }],
  'Gallons/Day = (Sq Ft / 1000) x 2 x Tightness',
  []
);

add('air-purifier-room-size-calculator', 'Air Purifier Room Size Calculator',
  'Find the CADR rating needed for your room.',
  'Everyday', 'everyday', '~',
  ['air purifier cadr', 'air purifier size'],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 4, max: 100, defaultValue: 15 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 4, max: 100, defaultValue: 12 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 }',
    '{ name: "changes", label: "Air Changes Per Hour", type: "number", min: 2, max: 8, defaultValue: 4 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.ceilingHeight as number;
      const ach = inputs.changes as number;
      const volume = l * w * h;
      const cadr = Math.ceil(volume * ach / 60);
      return {
        primary: { label: "Minimum CADR", value: formatNumber(cadr) + " CFM" },
        details: [
          { label: "Room Volume", value: formatNumber(volume) + " cu ft" },
          { label: "Room Area", value: formatNumber(l * w) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'What CADR rating do I need?', a: 'Choose a CADR at least two-thirds of the room area in sq ft.' },
   { q: 'How many air changes per hour are ideal?', a: 'Four to six air changes per hour is recommended for allergy relief.' }],
  'CADR = Length x Width x Height x ACH / 60',
  []
);

add('generator-sizing-calculator', 'Generator Sizing Calculator',
  'Calculate total generator wattage needed.',
  'Science', 'science', 'A',
  ['generator size', 'generator wattage'],
  [
    '{ name: "runningWatts", label: "Total Running Watts", type: "number", min: 100, max: 50000, defaultValue: 3000 }',
    '{ name: "startingExtra", label: "Largest Starting Surge (W)", type: "number", min: 0, max: 20000, defaultValue: 2000 }',
    '{ name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
  ],
  `(inputs) => {
      const running = inputs.runningWatts as number;
      const surge = inputs.startingExtra as number;
      const margin = inputs.safetyMargin as number;
      const peakWatts = running + surge;
      const recommended = Math.ceil(peakWatts * (1 + margin / 100));
      return {
        primary: { label: "Recommended Watts", value: formatNumber(recommended) + " W" },
        details: [
          { label: "Running Load", value: formatNumber(running) + " W" },
          { label: "Peak Load", value: formatNumber(peakWatts) + " W" },
        ],
      };
  }`,
  [{ q: 'What size generator do I need for my house?', a: 'Most homes need 5000 to 7500 watts for essential circuits.' },
   { q: 'What appliances use the most wattage?', a: 'Air conditioners and well pumps have the highest surge demands.' }],
  'Recommended = (Running + Surge) x (1 + Margin/100)',
  []
);

add('transfer-switch-calculator', 'Transfer Switch Calculator',
  'Determine transfer switch amperage needed.',
  'Science', 'science', 'A',
  ['transfer switch size', 'transfer switch amps'],
  [
    '{ name: "generatorWatts", label: "Generator Watts", type: "number", min: 1000, max: 50000, defaultValue: 7500 }',
    '{ name: "voltage", label: "Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "240" }',
    '{ name: "circuits", label: "Number of Circuits", type: "number", min: 4, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const watts = inputs.generatorWatts as number;
      const volts = Number(inputs.voltage as number);
      const circuits = inputs.circuits as number;
      const amps = watts / volts;
      const switchSize = Math.ceil(amps / 10) * 10;
      return {
        primary: { label: "Switch Size", value: formatNumber(switchSize) + " A" },
        details: [
          { label: "Calculated Amps", value: formatNumber(Math.round(amps * 10) / 10) + " A" },
          { label: "Circuits Supported", value: formatNumber(circuits) },
        ],
      };
  }`,
  [{ q: 'What size transfer switch do I need?', a: 'Match the switch amperage to your generator output rating.' },
   { q: 'Do I need an automatic transfer switch?', a: 'Automatic switches are best for standby generators.' }],
  'Amps = Generator Watts / Voltage',
  []
);

add('electrical-panel-load-calculator', 'Electrical Panel Load Calculator',
  'Calculate total electrical panel load in amps.',
  'Science', 'science', 'A',
  ['panel load', 'electrical load calculation'],
  [
    '{ name: "totalWatts", label: "Total Connected Watts", type: "number", min: 1000, max: 100000, defaultValue: 20000 }',
    '{ name: "voltage", label: "Service Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "240" }',
    '{ name: "demandFactor", label: "Demand Factor (%)", type: "number", min: 30, max: 100, defaultValue: 80 }',
  ],
  `(inputs) => {
      const watts = inputs.totalWatts as number;
      const volts = Number(inputs.voltage as number);
      const demand = inputs.demandFactor as number;
      const adjustedWatts = watts * (demand / 100);
      const amps = adjustedWatts / volts;
      const panelSize = Math.ceil(amps / 50) * 50;
      return {
        primary: { label: "Panel Size Needed", value: formatNumber(panelSize) + " A" },
        details: [
          { label: "Calculated Load", value: formatNumber(Math.round(amps)) + " A" },
          { label: "Adjusted Watts", value: formatNumber(Math.round(adjustedWatts)) + " W" },
        ],
      };
  }`,
  [{ q: 'What size panel do most homes need?', a: 'Most modern homes use a 200-amp electrical panel.' },
   { q: 'What is demand factor?', a: 'Demand factor accounts for not all loads running at once.' }],
  'Amps = Total Watts x Demand Factor / Voltage',
  []
);

add('circuit-breaker-sizing-calculator', 'Circuit Breaker Sizing Calculator',
  'Determine the correct breaker size for a load.',
  'Science', 'science', 'A',
  ['breaker size', 'circuit breaker amps'],
  [
    '{ name: "loadWatts", label: "Load Watts", type: "number", min: 100, max: 50000, defaultValue: 1800 }',
    '{ name: "voltage", label: "Circuit Voltage", type: "select", options: [{ value: "120", label: "120V" }, { value: "240", label: "240V" }], defaultValue: "120" }',
    '{ name: "continuous", label: "Continuous Load", type: "select", options: [{ value: "1", label: "No" }, { value: "0.8", label: "Yes (80% rule)" }], defaultValue: "0.8" }',
  ],
  `(inputs) => {
      const watts = inputs.loadWatts as number;
      const volts = Number(inputs.voltage as number);
      const factor = Number(inputs.continuous as number);
      const amps = watts / volts;
      const requiredBreaker = amps / factor;
      const sizes = [15, 20, 25, 30, 40, 50, 60, 70, 80, 100];
      const breakerSize = sizes.find(s => s >= requiredBreaker) || 100;
      return {
        primary: { label: "Breaker Size", value: formatNumber(breakerSize) + " A" },
        details: [
          { label: "Load Amps", value: formatNumber(Math.round(amps * 10) / 10) + " A" },
          { label: "Required Minimum", value: formatNumber(Math.round(requiredBreaker * 10) / 10) + " A" },
        ],
      };
  }`,
  [{ q: 'What is the 80 percent rule?', a: 'Continuous loads must not exceed 80 percent of breaker rating.' },
   { q: 'When do I need a 20-amp breaker?', a: 'Use 20-amp breakers for kitchen, bathroom, and laundry circuits.' }],
  'Breaker = (Watts / Voltage) / Continuous Factor',
  []
);

add('conduit-fill-calculator', 'Conduit Fill Calculator',
  'Calculate conduit fill percentage for wires.',
  'Science', 'science', 'A',
  ['conduit fill', 'wire fill percentage'],
  [
    '{ name: "conduitSize", label: "Conduit Diameter (in)", type: "select", options: [{ value: "0.622", label: "1/2 inch" }, { value: "0.824", label: "3/4 inch" }, { value: "1.049", label: "1 inch" }, { value: "1.38", label: "1-1/4 inch" }], defaultValue: "0.824" }',
    '{ name: "wireCount", label: "Number of Wires", type: "number", min: 1, max: 50, defaultValue: 4 }',
    '{ name: "wireDiameter", label: "Wire Diameter (in)", type: "number", min: 0.05, max: 1, defaultValue: 0.2 }',
  ],
  `(inputs) => {
      const conduit = Number(inputs.conduitSize as number);
      const count = inputs.wireCount as number;
      const wire = inputs.wireDiameter as number;
      const conduitArea = Math.PI * Math.pow(conduit / 2, 2);
      const wireArea = Math.PI * Math.pow(wire / 2, 2) * count;
      const fillPct = (wireArea / conduitArea) * 100;
      const maxFill = count > 2 ? 40 : count === 2 ? 31 : 53;
      return {
        primary: { label: "Fill Percentage", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
        details: [
          { label: "Max Allowed Fill", value: formatNumber(maxFill) + "%" },
          { label: "Status", value: fillPct <= maxFill ? "Within Code" : "Over Limit" },
        ],
      };
  }`,
  [{ q: 'What is the maximum conduit fill?', a: 'NEC allows 40 percent fill for three or more wires in conduit.' },
   { q: 'Why does conduit fill matter?', a: 'Overfilling causes heat buildup and makes pulling wires difficult.' }],
  'Fill % = (Wire Area x Count / Conduit Area) x 100',
  []
);

add('pipe-flow-rate-calculator', 'Pipe Flow Rate Calculator',
  'Calculate water flow rate through a pipe.',
  'Science', 'science', 'A',
  ['pipe flow rate', 'water flow gpm'],
  [
    '{ name: "diameter", label: "Pipe Diameter (in)", type: "number", min: 0.25, max: 12, defaultValue: 1 }',
    '{ name: "velocity", label: "Flow Velocity (ft/s)", type: "number", min: 0.5, max: 20, defaultValue: 5 }',
  ],
  `(inputs) => {
      const dia = inputs.diameter as number;
      const vel = inputs.velocity as number;
      const areaFt = Math.PI * Math.pow((dia / 12) / 2, 2);
      const cfs = areaFt * vel;
      const gpm = cfs * 448.83;
      return {
        primary: { label: "Flow Rate", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        details: [
          { label: "Pipe Area", value: formatNumber(Math.round(areaFt * 10000) / 10000) + " sq ft" },
          { label: "Flow (CFS)", value: formatNumber(Math.round(cfs * 1000) / 1000) },
        ],
      };
  }`,
  [{ q: 'What is a typical flow velocity?', a: 'Residential water pipes typically flow at 4 to 8 feet per second.' },
   { q: 'How does pipe size affect flow?', a: 'Doubling diameter increases flow capacity by about four times.' }],
  'GPM = Pi x (D/24)^2 x Velocity x 448.83',
  []
);

add('pipe-pressure-drop-calculator', 'Pipe Pressure Drop Calculator',
  'Estimate pressure loss in a pipe run.',
  'Science', 'science', 'A',
  ['pressure drop', 'pipe friction loss'],
  [
    '{ name: "length", label: "Pipe Length (ft)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "diameter", label: "Pipe Diameter (in)", type: "number", min: 0.5, max: 12, defaultValue: 1 }',
    '{ name: "flowRate", label: "Flow Rate (GPM)", type: "number", min: 0.5, max: 500, defaultValue: 10 }',
  ],
  `(inputs) => {
      const len = inputs.length as number;
      const dia = inputs.diameter as number;
      const gpm = inputs.flowRate as number;
      const vel = (gpm * 0.4085) / Math.pow(dia / 2, 2);
      const frictionFactor = 0.02;
      const headLoss = frictionFactor * (len / (dia / 12)) * Math.pow(vel, 2) / (2 * 32.2);
      const psi = headLoss * 0.433;
      return {
        primary: { label: "Pressure Drop", value: formatNumber(Math.round(psi * 10) / 10) + " PSI" },
        details: [
          { label: "Head Loss", value: formatNumber(Math.round(headLoss * 10) / 10) + " ft" },
          { label: "Velocity", value: formatNumber(Math.round(vel * 10) / 10) + " ft/s" },
        ],
      };
  }`,
  [{ q: 'What causes pressure drop?', a: 'Friction between water and pipe walls causes pressure loss.' },
   { q: 'How do I reduce pressure drop?', a: 'Use larger diameter pipes or shorter runs to reduce loss.' }],
  'Head Loss = f x (L/D) x V^2 / (2g)',
  []
);

add('sprinkler-head-calculator', 'Sprinkler Head Calculator',
  'Calculate sprinkler heads needed for your lawn.',
  'Everyday', 'everyday', '~',
  ['sprinkler heads', 'irrigation layout'],
  [
    '{ name: "lawnArea", label: "Lawn Area (sq ft)", type: "number", min: 100, max: 100000, defaultValue: 5000 }',
    '{ name: "headRadius", label: "Spray Radius (ft)", type: "number", min: 5, max: 50, defaultValue: 15 }',
    '{ name: "overlap", label: "Overlap Percent (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
  ],
  `(inputs) => {
      const area = inputs.lawnArea as number;
      const radius = inputs.headRadius as number;
      const overlap = inputs.overlap as number;
      const coveragePerHead = Math.PI * Math.pow(radius, 2);
      const effectiveCoverage = coveragePerHead * (1 - overlap / 100);
      const heads = Math.ceil(area / effectiveCoverage);
      return {
        primary: { label: "Heads Needed", value: formatNumber(heads) },
        details: [
          { label: "Coverage Per Head", value: formatNumber(Math.round(effectiveCoverage)) + " sq ft" },
          { label: "Total Coverage", value: formatNumber(Math.round(heads * effectiveCoverage)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How far apart should sprinkler heads be?', a: 'Space heads at the same distance as their spray radius.' },
   { q: 'Why is overlap important?', a: 'Overlap ensures even coverage and prevents dry spots.' }],
  'Heads = Lawn Area / (Pi x Radius^2 x (1 - Overlap/100))',
  []
);

add('drip-irrigation-calculator', 'Drip Irrigation Calculator',
  'Determine number of drip emitters needed.',
  'Everyday', 'everyday', '~',
  ['drip emitters', 'drip irrigation planning'],
  [
    '{ name: "bedLength", label: "Bed Length (ft)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "rows", label: "Number of Rows", type: "number", min: 1, max: 20, defaultValue: 2 }',
    '{ name: "spacing", label: "Emitter Spacing (in)", type: "number", min: 4, max: 36, defaultValue: 12 }',
    '{ name: "flowRate", label: "Emitter Flow (GPH)", type: "number", min: 0.25, max: 4, defaultValue: 1 }',
  ],
  `(inputs) => {
      const len = inputs.bedLength as number;
      const rows = inputs.rows as number;
      const spacing = inputs.spacing as number;
      const flow = inputs.flowRate as number;
      const emittersPerRow = Math.ceil((len * 12) / spacing);
      const totalEmitters = emittersPerRow * rows;
      const totalGph = totalEmitters * flow;
      return {
        primary: { label: "Emitters Needed", value: formatNumber(totalEmitters) },
        details: [
          { label: "Per Row", value: formatNumber(emittersPerRow) },
          { label: "Total Flow", value: formatNumber(Math.round(totalGph * 10) / 10) + " GPH" },
        ],
      };
  }`,
  [{ q: 'How far apart should drip emitters be?', a: 'Space emitters 12 inches apart for most garden plants.' },
   { q: 'How long should I run drip irrigation?', a: 'Run drip systems for 30 to 60 minutes per watering session.' }],
  'Emitters = (Bed Length x 12 / Spacing) x Rows',
  []
);

add('pond-volume-calculator', 'Pond Volume Calculator',
  'Calculate the water volume of a pond.',
  'Science', 'science', 'A',
  ['pond volume', 'pond gallons'],
  [
    '{ name: "length", label: "Pond Length (ft)", type: "number", min: 2, max: 200, defaultValue: 10 }',
    '{ name: "width", label: "Pond Width (ft)", type: "number", min: 2, max: 200, defaultValue: 8 }',
    '{ name: "avgDepth", label: "Average Depth (ft)", type: "number", min: 0.5, max: 20, defaultValue: 3 }',
    '{ name: "shape", label: "Shape Factor", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "0.85", label: "Oval" }, { value: "0.5", label: "Irregular" }], defaultValue: "0.85" }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.avgDepth as number;
      const sf = Number(inputs.shape as number);
      const cubicFt = l * w * d * sf;
      const gallons = cubicFt * 7.48;
      return {
        primary: { label: "Volume", value: formatNumber(Math.round(gallons)) + " gallons" },
        details: [
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt)) },
          { label: "Liters", value: formatNumber(Math.round(gallons * 3.785)) },
        ],
      };
  }`,
  [{ q: 'How do I measure pond depth?', a: 'Take multiple depth readings and use the average.' },
   { q: 'How many gallons per cubic foot?', a: 'One cubic foot of water equals 7.48 gallons.' }],
  'Gallons = L x W x D x Shape Factor x 7.48',
  []
);

add('pond-liner-calculator', 'Pond Liner Calculator',
  'Calculate pond liner dimensions needed.',
  'Everyday', 'everyday', '~',
  ['pond liner size', 'pond liner dimensions'],
  [
    '{ name: "length", label: "Pond Length (ft)", type: "number", min: 2, max: 200, defaultValue: 10 }',
    '{ name: "width", label: "Pond Width (ft)", type: "number", min: 2, max: 200, defaultValue: 8 }',
    '{ name: "maxDepth", label: "Maximum Depth (ft)", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "overlap", label: "Edge Overlap (ft)", type: "number", min: 1, max: 4, defaultValue: 2 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.maxDepth as number;
      const o = inputs.overlap as number;
      const linerLength = l + 2 * d + 2 * o;
      const linerWidth = w + 2 * d + 2 * o;
      const area = linerLength * linerWidth;
      return {
        primary: { label: "Liner Size", value: formatNumber(Math.round(linerLength)) + " x " + formatNumber(Math.round(linerWidth)) + " ft" },
        details: [
          { label: "Total Area", value: formatNumber(Math.round(area)) + " sq ft" },
          { label: "Extra Per Side", value: formatNumber(d + o) + " ft" },
        ],
      };
  }`,
  [{ q: 'What material is best for pond liners?', a: 'EPDM rubber is the most durable and flexible liner material.' },
   { q: 'How much overlap do I need?', a: 'Allow at least 1 to 2 feet of overlap on all edges.' }],
  'Liner = (Length + 2xDepth + 2xOverlap) x (Width + 2xDepth + 2xOverlap)',
  []
);

add('greenhouse-heating-calculator', 'Greenhouse Heating Calculator',
  'Calculate BTU needed to heat a greenhouse.',
  'Science', 'science', 'A',
  ['greenhouse btu', 'greenhouse heating'],
  [
    '{ name: "length", label: "Greenhouse Length (ft)", type: "number", min: 4, max: 200, defaultValue: 20 }',
    '{ name: "width", label: "Greenhouse Width (ft)", type: "number", min: 4, max: 100, defaultValue: 10 }',
    '{ name: "height", label: "Average Height (ft)", type: "number", min: 6, max: 20, defaultValue: 8 }',
    '{ name: "tempDiff", label: "Temperature Difference (F)", type: "number", min: 10, max: 80, defaultValue: 40 }',
    '{ name: "coverType", label: "Cover Type", type: "select", options: [{ value: "1.2", label: "Single Glass" }, { value: "0.8", label: "Double Glass" }, { value: "1.0", label: "Single Poly" }, { value: "0.6", label: "Double Poly" }], defaultValue: "1.0" }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      const dt = inputs.tempDiff as number;
      const k = Number(inputs.coverType as number);
      const surfaceArea = 2 * (l * h) + 2 * (w * h) + l * w;
      const btu = surfaceArea * dt * k;
      return {
        primary: { label: "BTU Required", value: formatNumber(Math.round(btu)) + " BTU/hr" },
        details: [
          { label: "Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
          { label: "Heat Loss Factor", value: formatNumber(k) },
        ],
      };
  }`,
  [{ q: 'How do I heat a small greenhouse?', a: 'Electric heaters or propane units work well for small greenhouses.' },
   { q: 'What temperature should a greenhouse be?', a: 'Keep nighttime temperature above 50 F for most plants.' }],
  'BTU = Surface Area x Temp Diff x Cover Factor',
  []
);

add('compost-bin-size-calculator', 'Compost Bin Size Calculator',
  'Determine compost bin volume for your waste.',
  'Everyday', 'everyday', '~',
  ['compost bin size', 'compost volume'],
  [
    '{ name: "people", label: "People in Household", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "yardWaste", label: "Yard Waste (bags/week)", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "turnFrequency", label: "Turn Frequency (weeks)", type: "number", min: 1, max: 8, defaultValue: 2 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const yard = inputs.yardWaste as number;
      const turn = inputs.turnFrequency as number;
      const kitchenCuFtWeek = people * 0.5;
      const yardCuFtWeek = yard * 3;
      const totalWeekly = kitchenCuFtWeek + yardCuFtWeek;
      const binVolume = Math.ceil(totalWeekly * turn * 4);
      return {
        primary: { label: "Bin Volume", value: formatNumber(binVolume) + " cu ft" },
        details: [
          { label: "Weekly Kitchen Waste", value: formatNumber(kitchenCuFtWeek) + " cu ft" },
          { label: "Weekly Yard Waste", value: formatNumber(yardCuFtWeek) + " cu ft" },
        ],
      };
  }`,
  [{ q: 'How big should a compost bin be?', a: 'A bin of at least 27 cubic feet heats up properly for composting.' },
   { q: 'How long does composting take?', a: 'Finished compost is usually ready in 2 to 6 months.' }],
  'Volume = (Kitchen + Yard Waste per week) x Turn Freq x 4',
  []
);

add('chicken-coop-size-calculator', 'Chicken Coop Size Calculator',
  'Calculate coop and run size for your flock.',
  'Everyday', 'everyday', '~',
  ['chicken coop size', 'coop dimensions'],
  [
    '{ name: "chickens", label: "Number of Chickens", type: "number", min: 1, max: 200, defaultValue: 6 }',
    '{ name: "coopSqFt", label: "Coop Space Per Bird (sq ft)", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "runSqFt", label: "Run Space Per Bird (sq ft)", type: "number", min: 5, max: 20, defaultValue: 10 }',
  ],
  `(inputs) => {
      const birds = inputs.chickens as number;
      const coopPer = inputs.coopSqFt as number;
      const runPer = inputs.runSqFt as number;
      const coopArea = birds * coopPer;
      const runArea = birds * runPer;
      const totalArea = coopArea + runArea;
      return {
        primary: { label: "Coop Size", value: formatNumber(coopArea) + " sq ft" },
        details: [
          { label: "Run Size", value: formatNumber(runArea) + " sq ft" },
          { label: "Total Area", value: formatNumber(totalArea) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How much space does each chicken need?', a: 'Allow 4 sq ft of coop and 10 sq ft of run per bird.' },
   { q: 'Do chickens need a covered run?', a: 'A covered run protects chickens from predators and weather.' }],
  'Coop Area = Chickens x Sq Ft Per Bird',
  []
);
