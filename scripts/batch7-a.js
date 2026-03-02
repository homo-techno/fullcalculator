add('asphalt-paving-calculator', 'Asphalt Paving Calculator',
  'Calculate tons of asphalt needed for driveways and parking lots.',
  'Everyday', 'everyday', '~',
  ['asphalt tons', 'asphalt paving', 'driveway asphalt'],
  [
    '{ name: "length", label: "Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 50 }',
    '{ name: "width", label: "Width (ft)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "thickness", label: "Thickness (in)", type: "number", min: 1, max: 12, defaultValue: 3 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const t = inputs.thickness as number;
      if (!l || !w || !t) return null;
      const cubicFt = l * w * (t / 12);
      const tons = cubicFt * 145 / 2000;
      return {
        primary: { label: "Asphalt Needed", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        details: [
          { label: "Area", value: formatNumber(Math.round(l * w)) + " sq ft" },
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt)) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(tons * 100)) },
        ],
      };
  }`,
  [{ q: 'How thick should an asphalt driveway be?', a: 'A residential driveway typically needs 2 to 3 inches of asphalt.' },
   { q: 'How much does asphalt cost per ton?', a: 'Asphalt costs about $80 to $150 per ton depending on the region.' }],
  'Tons = (Length x Width x Thickness / 12) x 145 / 2000',
  ['gravel-calculator', 'concrete-calculator']
);

add('gravel-calculator', 'Gravel Calculator',
  'Estimate gravel tons needed to cover an area at a given depth.',
  'Everyday', 'everyday', '~',
  ['gravel tons', 'gravel coverage', 'gravel amount'],
  [
    '{ name: "length", label: "Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "width", label: "Width (ft)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "depth", label: "Depth (in)", type: "number", min: 1, max: 24, defaultValue: 4 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.depth as number;
      if (!l || !w || !d) return null;
      const cubicYards = (l * w * (d / 12)) / 27;
      const tons = cubicYards * 1.4;
      return {
        primary: { label: "Gravel Needed", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        details: [
          { label: "Cubic Yards", value: formatNumber(Math.round(cubicYards * 10) / 10) },
          { label: "Area", value: formatNumber(Math.round(l * w)) + " sq ft" },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(tons * 50)) },
        ],
      };
  }`,
  [{ q: 'How much does a ton of gravel cover?', a: 'One ton of gravel covers about 80 square feet at 2 inches deep.' },
   { q: 'How deep should a gravel driveway be?', a: 'A gravel driveway should be 4 to 6 inches deep with a compacted base.' }],
  'Tons = (Length x Width x Depth / 12) / 27 x 1.4',
  ['asphalt-paving-calculator', 'topsoil-calculator']
);

add('topsoil-calculator', 'Topsoil Calculator',
  'Calculate cubic yards of topsoil needed for your project.',
  'Everyday', 'everyday', '~',
  ['topsoil yards', 'topsoil amount', 'garden soil'],
  [
    '{ name: "length", label: "Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "width", label: "Width (ft)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "depth", label: "Depth (in)", type: "number", min: 1, max: 24, defaultValue: 6 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.depth as number;
      if (!l || !w || !d) return null;
      const cubicYards = (l * w * (d / 12)) / 27;
      const bags = Math.ceil(cubicYards * 27);
      return {
        primary: { label: "Topsoil Needed", value: formatNumber(Math.round(cubicYards * 10) / 10) + " cubic yards" },
        details: [
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicYards * 27)) },
          { label: "Area", value: formatNumber(Math.round(l * w)) + " sq ft" },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(cubicYards * 30)) },
        ],
      };
  }`,
  [{ q: 'How deep should topsoil be for a lawn?', a: 'Apply 4 to 6 inches of topsoil for establishing a new lawn.' },
   { q: 'How much does a cubic yard of topsoil weigh?', a: 'One cubic yard of topsoil weighs about 1,000 to 1,300 pounds.' }],
  'Cubic Yards = (Length x Width x Depth / 12) / 27',
  ['gravel-calculator', 'sod-calculator']
);

add('pool-pump-sizing-calculator', 'Pool Pump Sizing Calculator',
  'Determine the right pool pump GPM for your pool size.',
  'Everyday', 'everyday', '~',
  ['pool pump size', 'pool pump GPM', 'pool circulation'],
  [
    '{ name: "poolGallons", label: "Pool Volume (gallons)", type: "number", min: 1000, max: 100000, defaultValue: 15000 }',
    '{ name: "turnoverHours", label: "Turnover Time (hours)", type: "number", min: 4, max: 24, defaultValue: 8 }',
    '{ name: "pipeSize", label: "Pipe Diameter (in)", type: "select", options: [{ value: "1.5", label: "1.5 inch" }, { value: "2", label: "2 inch" }], defaultValue: "1.5" }',
  ],
  `(inputs) => {
      const gallons = inputs.poolGallons as number;
      const hours = inputs.turnoverHours as number;
      const pipe = inputs.pipeSize as string;
      if (!gallons || !hours) return null;
      const gpm = gallons / (hours * 60);
      const maxGpm = pipe === "2" ? 73 : 43;
      const recommended = Math.min(gpm, maxGpm);
      const hp = gpm <= 30 ? 0.75 : gpm <= 50 ? 1 : gpm <= 70 ? 1.5 : 2;
      return {
        primary: { label: "Required Flow Rate", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        details: [
          { label: "Max GPM for Pipe", value: formatNumber(maxGpm) + " GPM" },
          { label: "Recommended HP", value: formatNumber(hp) + " HP" },
          { label: "Gallons per Hour", value: formatNumber(Math.round(gpm * 60)) },
        ],
      };
  }`,
  [{ q: 'What size pump do I need for my pool?', a: 'Most residential pools need a 1 to 1.5 HP pump with 40 to 60 GPM flow.' },
   { q: 'How often should pool water turn over?', a: 'Pool water should turn over at least once every 8 to 12 hours.' }],
  'GPM = Pool Volume / (Turnover Hours x 60)',
  ['pool-volume-calculator', 'pool-heater-calculator']
);

add('hot-tub-cost-calculator', 'Hot Tub Cost Calculator',
  'Estimate monthly hot tub operating costs for energy and water.',
  'Finance', 'finance', '$',
  ['hot tub cost', 'spa operating cost', 'hot tub electricity'],
  [
    '{ name: "watts", label: "Heater Wattage", type: "number", min: 1000, max: 10000, defaultValue: 4000 }',
    '{ name: "hoursPerDay", label: "Hours per Day", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "electricRate", label: "Electric Rate ($/kWh)", type: "number", min: 0.01, max: 1, defaultValue: 0.13 }',
    '{ name: "chemicalCost", label: "Monthly Chemical Cost ($)", type: "number", min: 0, max: 200, defaultValue: 30 }',
  ],
  `(inputs) => {
      const watts = inputs.watts as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.electricRate as number;
      const chem = inputs.chemicalCost as number;
      if (!watts || !hours || !rate) return null;
      const kwhPerDay = (watts / 1000) * hours;
      const monthlyElectric = kwhPerDay * 30 * rate;
      const total = monthlyElectric + chem;
      return {
        primary: { label: "Monthly Operating Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Monthly Electricity", value: "$" + formatNumber(Math.round(monthlyElectric)) },
          { label: "Monthly Chemicals", value: "$" + formatNumber(Math.round(chem)) },
          { label: "kWh per Month", value: formatNumber(Math.round(kwhPerDay * 30)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(total * 12)) },
        ],
      };
  }`,
  [{ q: 'How much does it cost to run a hot tub monthly?', a: 'A typical hot tub costs $50 to $100 per month in electricity.' },
   { q: 'How can I reduce hot tub operating costs?', a: 'Use a quality cover, lower the temperature, and run the pump less.' }],
  'Monthly Cost = (Watts / 1000 x Hours x 30 x Rate) + Chemicals',
  ['pool-heater-calculator', 'electricity-cost-calculator']
);

add('sod-calculator', 'Sod Calculator',
  'Calculate the number of sod rolls needed for your lawn area.',
  'Everyday', 'everyday', '~',
  ['sod rolls', 'sod quantity', 'lawn sod'],
  [
    '{ name: "length", label: "Lawn Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 50 }',
    '{ name: "width", label: "Lawn Width (ft)", type: "number", min: 1, max: 500, defaultValue: 30 }',
    '{ name: "rollSize", label: "Roll Size (sq ft)", type: "select", options: [{ value: "9", label: "9 sq ft (standard)" }, { value: "10", label: "10 sq ft" }, { value: "16", label: "16 sq ft (large)" }], defaultValue: "9" }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const rollSz = parseFloat(inputs.rollSize as string);
      if (!l || !w || !rollSz) return null;
      const area = l * w;
      const areaWithWaste = area * 1.05;
      const rolls = Math.ceil(areaWithWaste / rollSz);
      return {
        primary: { label: "Sod Rolls Needed", value: formatNumber(rolls) + " rolls" },
        details: [
          { label: "Lawn Area", value: formatNumber(Math.round(area)) + " sq ft" },
          { label: "With 5% Waste", value: formatNumber(Math.round(areaWithWaste)) + " sq ft" },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(rolls * 4)) },
        ],
      };
  }`,
  [{ q: 'How many sod rolls do I need per 1000 sq ft?', a: 'You need about 112 standard rolls (9 sq ft each) per 1000 sq ft.' },
   { q: 'When is the best time to lay sod?', a: 'The best time is early fall or spring when temperatures are moderate.' }],
  'Rolls = (Length x Width x 1.05) / Roll Size',
  ['grass-seed-calculator', 'topsoil-calculator']
);

add('paver-calculator', 'Paver Calculator',
  'Calculate the number of pavers needed for a patio or walkway.',
  'Everyday', 'everyday', '~',
  ['paver count', 'patio pavers', 'paver estimate'],
  [
    '{ name: "areaLength", label: "Area Length (ft)", type: "number", min: 1, max: 500, defaultValue: 15 }',
    '{ name: "areaWidth", label: "Area Width (ft)", type: "number", min: 1, max: 200, defaultValue: 12 }',
    '{ name: "paverLength", label: "Paver Length (in)", type: "number", min: 2, max: 24, defaultValue: 8 }',
    '{ name: "paverWidth", label: "Paver Width (in)", type: "number", min: 2, max: 24, defaultValue: 4 }',
  ],
  `(inputs) => {
      const al = inputs.areaLength as number;
      const aw = inputs.areaWidth as number;
      const pl = inputs.paverLength as number;
      const pw = inputs.paverWidth as number;
      if (!al || !aw || !pl || !pw) return null;
      const areaSqFt = al * aw;
      const paverSqFt = (pl * pw) / 144;
      const count = Math.ceil((areaSqFt / paverSqFt) * 1.1);
      return {
        primary: { label: "Pavers Needed", value: formatNumber(count) + " pavers" },
        details: [
          { label: "Total Area", value: formatNumber(Math.round(areaSqFt)) + " sq ft" },
          { label: "Paver Area", value: formatNumber(Math.round(paverSqFt * 100) / 100) + " sq ft each" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  }`,
  [{ q: 'How many pavers per square foot?', a: 'For 4x8 inch pavers you need about 4.5 pavers per square foot.' },
   { q: 'Should I add extra pavers for waste?', a: 'Yes, order 10 percent extra for cuts, breakage, and future repairs.' }],
  'Pavers = (Area / Paver Area) x 1.10',
  ['gravel-calculator', 'concrete-calculator']
);

add('retaining-wall-block-calculator', 'Retaining Wall Block Calculator',
  'Estimate blocks needed to build a retaining wall.',
  'Everyday', 'everyday', '~',
  ['retaining wall blocks', 'wall block count', 'retaining wall'],
  [
    '{ name: "wallLength", label: "Wall Length (ft)", type: "number", min: 1, max: 500, defaultValue: 30 }',
    '{ name: "wallHeight", label: "Wall Height (ft)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "blockLength", label: "Block Length (in)", type: "number", min: 6, max: 24, defaultValue: 12 }',
    '{ name: "blockHeight", label: "Block Height (in)", type: "number", min: 3, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const wl = inputs.wallLength as number;
      const wh = inputs.wallHeight as number;
      const bl = inputs.blockLength as number;
      const bh = inputs.blockHeight as number;
      if (!wl || !wh || !bl || !bh) return null;
      const blocksPerRow = Math.ceil((wl * 12) / bl);
      const rows = Math.ceil((wh * 12) / bh);
      const total = Math.ceil(blocksPerRow * rows * 1.1);
      return {
        primary: { label: "Blocks Needed", value: formatNumber(total) + " blocks" },
        details: [
          { label: "Rows", value: formatNumber(rows) },
          { label: "Blocks per Row", value: formatNumber(blocksPerRow) },
          { label: "Wall Face Area", value: formatNumber(Math.round(wl * wh)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How many blocks for a retaining wall?', a: 'A 30 ft long, 3 ft high wall needs about 180 to 200 standard blocks.' },
   { q: 'Do retaining walls need drainage?', a: 'Yes, always install gravel backfill and drainage pipe behind the wall.' }],
  'Blocks = (Wall Length / Block Length) x (Wall Height / Block Height) x 1.10',
  ['gravel-calculator', 'concrete-calculator']
);

add('post-hole-concrete-calculator', 'Post Hole Concrete Calculator',
  'Calculate concrete bags needed per fence or deck post hole.',
  'Everyday', 'everyday', '~',
  ['post hole concrete', 'fence post concrete', 'post concrete bags'],
  [
    '{ name: "holeDiameter", label: "Hole Diameter (in)", type: "number", min: 4, max: 24, defaultValue: 10 }',
    '{ name: "holeDepth", label: "Hole Depth (in)", type: "number", min: 12, max: 60, defaultValue: 36 }',
    '{ name: "numPosts", label: "Number of Posts", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "bagSize", label: "Bag Size (lbs)", type: "select", options: [{ value: "50", label: "50 lb" }, { value: "60", label: "60 lb" }, { value: "80", label: "80 lb" }], defaultValue: "60" }',
  ],
  `(inputs) => {
      const dia = inputs.holeDiameter as number;
      const dep = inputs.holeDepth as number;
      const posts = inputs.numPosts as number;
      const bagLbs = parseFloat(inputs.bagSize as string);
      if (!dia || !dep || !posts || !bagLbs) return null;
      const radius = dia / 2 / 12;
      const depthFt = dep / 12;
      const cubicFtPerHole = Math.PI * radius * radius * depthFt;
      const lbsPerCuFt = 133;
      const bagsPerHole = Math.ceil((cubicFtPerHole * lbsPerCuFt) / bagLbs);
      const totalBags = bagsPerHole * posts;
      return {
        primary: { label: "Total Bags Needed", value: formatNumber(totalBags) + " bags" },
        details: [
          { label: "Bags per Post", value: formatNumber(bagsPerHole) },
          { label: "Cu Ft per Hole", value: formatNumber(Math.round(cubicFtPerHole * 100) / 100) },
          { label: "Total Concrete (lbs)", value: formatNumber(totalBags * bagLbs) },
        ],
      };
  }`,
  [{ q: 'How deep should a fence post hole be?', a: 'Dig post holes to one-third of the total post length, typically 24 to 36 inches.' },
   { q: 'How many bags of concrete per fence post?', a: 'Most standard fence posts need 1 to 3 bags of 60 lb concrete mix.' }],
  'Bags = (PI x (Dia/2)^2 x Depth x 133) / Bag Size per post',
  ['fence-calculator', 'concrete-calculator']
);

add('rain-barrel-savings-calculator', 'Rain Barrel Savings Calculator',
  'Estimate water savings and cost reduction from rain barrels.',
  'Finance', 'finance', '$',
  ['rain barrel savings', 'rainwater harvesting', 'water cost savings'],
  [
    '{ name: "roofSqFt", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 }',
    '{ name: "annualRainfall", label: "Annual Rainfall (in)", type: "number", min: 1, max: 100, defaultValue: 40 }',
    '{ name: "barrels", label: "Number of Barrels", type: "number", min: 1, max: 20, defaultValue: 2 }',
    '{ name: "waterRate", label: "Water Rate ($/1000 gal)", type: "number", min: 1, max: 30, defaultValue: 8 }',
  ],
  `(inputs) => {
      const roof = inputs.roofSqFt as number;
      const rain = inputs.annualRainfall as number;
      const barrels = inputs.barrels as number;
      const rate = inputs.waterRate as number;
      if (!roof || !rain || !barrels || !rate) return null;
      const gallonsPerYear = roof * rain * 0.623;
      const barrelCapacity = barrels * 55 * 52;
      const usable = Math.min(gallonsPerYear, barrelCapacity);
      const savings = (usable / 1000) * rate;
      return {
        primary: { label: "Annual Water Savings", value: formatNumber(Math.round(usable)) + " gallons" },
        details: [
          { label: "Annual Cost Savings", value: "$" + formatNumber(Math.round(savings)) },
          { label: "Total Roof Capture", value: formatNumber(Math.round(gallonsPerYear)) + " gal" },
          { label: "Barrel Capacity per Year", value: formatNumber(Math.round(barrelCapacity)) + " gal" },
        ],
      };
  }`,
  [{ q: 'How much water can a rain barrel collect?', a: 'A 55 gallon barrel can fill up in a single moderate rainstorm.' },
   { q: 'Are rain barrels worth the investment?', a: 'Yes, they can save $50 to $200 per year depending on water rates.' }],
  'Gallons = Roof Area x Rainfall x 0.623',
  ['gutter-rain-calculator', 'water-usage-calculator']
);

add('septic-tank-size-calculator', 'Septic Tank Size Calculator',
  'Determine the right septic tank capacity for your household.',
  'Everyday', 'everyday', '~',
  ['septic tank size', 'septic capacity', 'septic system'],
  [
    '{ name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "dailyUsage", label: "Daily Water Use (gal/person)", type: "number", min: 30, max: 200, defaultValue: 75 }',
  ],
  `(inputs) => {
      const beds = inputs.bedrooms as number;
      const occ = inputs.occupants as number;
      const usage = inputs.dailyUsage as number;
      if (!beds || !occ || !usage) return null;
      const dailyFlow = occ * usage;
      const minByBeds = beds <= 2 ? 750 : beds === 3 ? 1000 : beds === 4 ? 1250 : 1500;
      const minByFlow = Math.ceil(dailyFlow * 1.5 / 250) * 250;
      const recommended = Math.max(minByBeds, minByFlow);
      return {
        primary: { label: "Recommended Tank Size", value: formatNumber(recommended) + " gallons" },
        details: [
          { label: "Daily Flow", value: formatNumber(dailyFlow) + " gallons" },
          { label: "Min by Bedrooms", value: formatNumber(minByBeds) + " gallons" },
          { label: "Min by Flow", value: formatNumber(minByFlow) + " gallons" },
        ],
      };
  }`,
  [{ q: 'What size septic tank do I need for 3 bedrooms?', a: 'A 3 bedroom home typically requires a 1,000 gallon septic tank.' },
   { q: 'How often should a septic tank be pumped?', a: 'Pump your septic tank every 3 to 5 years depending on usage.' }],
  'Tank Size = max(Min by Bedrooms, Daily Flow x 1.5)',
  ['well-pump-sizing-calculator', 'water-usage-calculator']
);

add('well-pump-sizing-calculator', 'Well Pump Sizing Calculator',
  'Calculate the horsepower needed for a residential well pump.',
  'Science', 'science', 'A',
  ['well pump HP', 'well pump sizing', 'submersible pump'],
  [
    '{ name: "wellDepth", label: "Well Depth (ft)", type: "number", min: 20, max: 1000, defaultValue: 200 }',
    '{ name: "staticLevel", label: "Static Water Level (ft)", type: "number", min: 5, max: 500, defaultValue: 50 }',
    '{ name: "gpmNeeded", label: "Flow Rate Needed (GPM)", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "pipeDia", label: "Pipe Diameter (in)", type: "select", options: [{ value: "1", label: "1 inch" }, { value: "1.25", label: "1.25 inch" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const depth = inputs.wellDepth as number;
      const staticLvl = inputs.staticLevel as number;
      const gpm = inputs.gpmNeeded as number;
      const pipe = inputs.pipeDia as string;
      if (!depth || !staticLvl || !gpm) return null;
      const drawdown = 10;
      const totalHead = staticLvl + drawdown + 40;
      const frictionLoss = pipe === "1" ? depth * 0.02 : depth * 0.01;
      const tdh = totalHead + frictionLoss;
      const hp = (gpm * tdh) / (3960 * 0.6);
      const recommended = hp <= 0.5 ? 0.5 : hp <= 0.75 ? 0.75 : hp <= 1 ? 1 : hp <= 1.5 ? 1.5 : 2;
      return {
        primary: { label: "Recommended HP", value: formatNumber(recommended) + " HP" },
        details: [
          { label: "Total Dynamic Head", value: formatNumber(Math.round(tdh)) + " ft" },
          { label: "Calculated HP", value: formatNumber(Math.round(hp * 100) / 100) },
          { label: "Friction Loss", value: formatNumber(Math.round(frictionLoss)) + " ft" },
        ],
      };
  }`,
  [{ q: 'What HP pump do I need for a 200 ft well?', a: 'A 200 ft well typically needs a 0.75 to 1.5 HP submersible pump.' },
   { q: 'What is total dynamic head?', a: 'It is the sum of static level, drawdown, pressure, and friction loss.' }],
  'HP = (GPM x Total Dynamic Head) / (3960 x Efficiency)',
  ['septic-tank-size-calculator', 'water-usage-calculator']
);

add('french-drain-gravel-calculator', 'French Drain Gravel Calculator',
  'Calculate gravel needed for a french drain installation.',
  'Everyday', 'everyday', '~',
  ['french drain gravel', 'drain rock', 'french drain material'],
  [
    '{ name: "drainLength", label: "Drain Length (ft)", type: "number", min: 5, max: 500, defaultValue: 50 }',
    '{ name: "trenchWidth", label: "Trench Width (in)", type: "number", min: 6, max: 24, defaultValue: 12 }',
    '{ name: "trenchDepth", label: "Trench Depth (in)", type: "number", min: 12, max: 48, defaultValue: 24 }',
  ],
  `(inputs) => {
      const len = inputs.drainLength as number;
      const w = inputs.trenchWidth as number;
      const d = inputs.trenchDepth as number;
      if (!len || !w || !d) return null;
      const cubicFt = len * (w / 12) * (d / 12);
      const cubicYards = cubicFt / 27;
      const tons = cubicYards * 1.4;
      return {
        primary: { label: "Gravel Needed", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        details: [
          { label: "Cubic Yards", value: formatNumber(Math.round(cubicYards * 10) / 10) },
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt)) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(tons * 50)) },
        ],
      };
  }`,
  [{ q: 'What type of gravel is best for french drains?', a: 'Use washed 3/4 inch crushed stone or river rock for best drainage.' },
   { q: 'How deep should a french drain be?', a: 'A french drain should be 18 to 24 inches deep for proper function.' }],
  'Tons = (Length x Width x Depth / 12^2) / 27 x 1.4',
  ['gravel-calculator', 'gutter-rain-calculator']
);

add('gutter-rain-calculator', 'Gutter Rain Calculator',
  'Estimate rainwater volume collected from your roof gutters.',
  'Science', 'science', 'A',
  ['gutter rainwater', 'roof runoff', 'rain collection'],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 2000 }',
    '{ name: "rainfall", label: "Rainfall (inches)", type: "number", min: 0.1, max: 20, defaultValue: 1 }',
    '{ name: "efficiency", label: "Collection Efficiency (%)", type: "number", min: 50, max: 100, defaultValue: 85 }',
  ],
  `(inputs) => {
      const area = inputs.roofArea as number;
      const rain = inputs.rainfall as number;
      const eff = inputs.efficiency as number;
      if (!area || !rain || !eff) return null;
      const totalGallons = area * rain * 0.623;
      const collected = totalGallons * (eff / 100);
      const liters = collected * 3.785;
      return {
        primary: { label: "Water Collected", value: formatNumber(Math.round(collected)) + " gallons" },
        details: [
          { label: "Total Runoff", value: formatNumber(Math.round(totalGallons)) + " gallons" },
          { label: "Liters", value: formatNumber(Math.round(liters)) },
          { label: "Cubic Feet", value: formatNumber(Math.round(collected / 7.48)) },
        ],
      };
  }`,
  [{ q: 'How much rain can a roof collect?', a: 'A 2,000 sq ft roof collects about 1,246 gallons per inch of rain.' },
   { q: 'What affects rainwater collection efficiency?', a: 'Roof material, slope, gutter condition, and debris all affect efficiency.' }],
  'Gallons = Roof Area x Rainfall x 0.623 x Efficiency',
  ['rain-barrel-savings-calculator', 'french-drain-gravel-calculator']
);

add('attic-ventilation-calculator', 'Attic Ventilation Calculator',
  'Calculate the net free vent area needed for your attic.',
  'Everyday', 'everyday', '~',
  ['attic ventilation', 'attic vent area', 'roof ventilation'],
  [
    '{ name: "atticSqFt", label: "Attic Floor Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 }',
    '{ name: "vaporBarrier", label: "Vapor Barrier Installed", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const area = inputs.atticSqFt as number;
      const barrier = inputs.vaporBarrier as string;
      if (!area) return null;
      const ratio = barrier === "1" ? 300 : 150;
      const nfaSqFt = area / ratio;
      const nfaSqIn = nfaSqFt * 144;
      const intakeArea = nfaSqIn / 2;
      const exhaustArea = nfaSqIn / 2;
      return {
        primary: { label: "Total NFA Required", value: formatNumber(Math.round(nfaSqIn)) + " sq in" },
        details: [
          { label: "Ventilation Ratio", value: "1:" + formatNumber(ratio) },
          { label: "Intake Area Needed", value: formatNumber(Math.round(intakeArea)) + " sq in" },
          { label: "Exhaust Area Needed", value: formatNumber(Math.round(exhaustArea)) + " sq in" },
          { label: "NFA in Sq Ft", value: formatNumber(Math.round(nfaSqFt * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'What is the 1/150 ventilation rule?', a: 'It means 1 sq ft of vent area per 150 sq ft of attic without a vapor barrier.' },
   { q: 'Should intake and exhaust be balanced?', a: 'Yes, split vent area evenly between soffit intake and ridge exhaust.' }],
  'NFA = Attic Area / Ventilation Ratio (150 or 300)',
  ['insulation-calculator', 'roofing-calculator']
);

add('crawl-space-encapsulation-calculator', 'Crawl Space Encapsulation Calculator',
  'Estimate material costs for crawl space encapsulation.',
  'Finance', 'finance', '$',
  ['crawl space encapsulation', 'vapor barrier cost', 'crawl space sealing'],
  [
    '{ name: "length", label: "Crawl Space Length (ft)", type: "number", min: 5, max: 200, defaultValue: 40 }',
    '{ name: "width", label: "Crawl Space Width (ft)", type: "number", min: 5, max: 200, defaultValue: 30 }',
    '{ name: "wallHeight", label: "Wall Height (ft)", type: "number", min: 1, max: 6, defaultValue: 3 }',
    '{ name: "dehumidifier", label: "Include Dehumidifier", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const wh = inputs.wallHeight as number;
      const dehu = inputs.dehumidifier as string;
      if (!l || !w || !wh) return null;
      const floorArea = l * w;
      const wallArea = 2 * (l + w) * wh;
      const totalBarrier = floorArea + wallArea;
      const barrierCost = totalBarrier * 0.5;
      const tapeCost = (2 * (l + w) + l * 2) * 0.25;
      const dehuCost = dehu === "1" ? 800 : 0;
      const total = barrierCost + tapeCost + dehuCost;
      return {
        primary: { label: "Estimated Material Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Barrier Needed", value: formatNumber(Math.round(totalBarrier)) + " sq ft" },
          { label: "Barrier Cost", value: "$" + formatNumber(Math.round(barrierCost)) },
          { label: "Tape and Sealant", value: "$" + formatNumber(Math.round(tapeCost)) },
          { label: "Dehumidifier", value: "$" + formatNumber(dehuCost) },
        ],
      };
  }`,
  [{ q: 'How much does crawl space encapsulation cost?', a: 'DIY materials cost $1,500 to $5,000; professional install is $5,000 to $15,000.' },
   { q: 'Is crawl space encapsulation worth it?', a: 'Yes, it prevents moisture damage, mold, and improves energy efficiency.' }],
  'Cost = (Floor + Wall Area) x Barrier Rate + Tape + Dehumidifier',
  ['insulation-calculator', 'dehumidifier-calculator']
);

add('window-u-factor-calculator', 'Window U-Factor Calculator',
  'Calculate window U-factor for energy efficiency rating.',
  'Science', 'science', 'A',
  ['window U-factor', 'window insulation', 'window R-value'],
  [
    '{ name: "panes", label: "Number of Panes", type: "select", options: [{ value: "1", label: "Single" }, { value: "2", label: "Double" }, { value: "3", label: "Triple" }], defaultValue: "2" }',
    '{ name: "gasType", label: "Gas Fill", type: "select", options: [{ value: "air", label: "Air" }, { value: "argon", label: "Argon" }, { value: "krypton", label: "Krypton" }], defaultValue: "argon" }',
    '{ name: "lowE", label: "Low-E Coating", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const panes = parseInt(inputs.panes as string);
      const gas = inputs.gasType as string;
      const lowE = inputs.lowE as string;
      const baseU: Record<number, number> = { 1: 1.1, 2: 0.5, 3: 0.3 };
      let u = baseU[panes] || 0.5;
      if (gas === "argon") u -= 0.05;
      if (gas === "krypton") u -= 0.1;
      if (lowE === "1") u -= 0.08;
      u = Math.max(u, 0.15);
      const rValue = 1 / u;
      return {
        primary: { label: "U-Factor", value: formatNumber(Math.round(u * 100) / 100) },
        details: [
          { label: "R-Value", value: formatNumber(Math.round(rValue * 100) / 100) },
          { label: "Panes", value: formatNumber(panes) },
          { label: "Energy Star Qualified", value: u <= 0.3 ? "Yes" : "No" },
        ],
      };
  }`,
  [{ q: 'What is a good U-factor for windows?', a: 'A U-factor of 0.30 or lower is considered energy efficient.' },
   { q: 'What is the difference between U-factor and R-value?', a: 'U-factor measures heat transfer; R-value is its inverse measuring resistance.' }],
  'U-Factor = Base U - Gas Adjustment - Low-E Adjustment',
  ['insulation-calculator', 'energy-cost-calculator']
);

add('door-size-calculator', 'Door Size Calculator',
  'Calculate rough opening dimensions for standard doors.',
  'Everyday', 'everyday', '~',
  ['door rough opening', 'door size', 'door frame dimensions'],
  [
    '{ name: "doorWidth", label: "Door Width (in)", type: "number", min: 18, max: 72, defaultValue: 36 }',
    '{ name: "doorHeight", label: "Door Height (in)", type: "number", min: 60, max: 96, defaultValue: 80 }',
    '{ name: "doorType", label: "Door Type", type: "select", options: [{ value: "single", label: "Single" }, { value: "double", label: "Double" }, { value: "pocket", label: "Pocket" }], defaultValue: "single" }',
  ],
  `(inputs) => {
      const dw = inputs.doorWidth as number;
      const dh = inputs.doorHeight as number;
      const dtype = inputs.doorType as string;
      if (!dw || !dh) return null;
      let roWidth = dw + 2;
      if (dtype === "double") roWidth = (dw * 2) + 2;
      if (dtype === "pocket") roWidth = (dw * 2) + 1;
      const roHeight = dh + 2.5;
      return {
        primary: { label: "Rough Opening", value: formatNumber(roWidth) + '" x ' + formatNumber(roHeight) + '"' },
        details: [
          { label: "Rough Opening Width", value: formatNumber(roWidth) + ' inches' },
          { label: "Rough Opening Height", value: formatNumber(roHeight) + ' inches' },
          { label: "Door Type", value: dtype.charAt(0).toUpperCase() + dtype.slice(1) },
        ],
      };
  }`,
  [{ q: 'How much bigger is a rough opening than the door?', a: 'A rough opening is typically 2 inches wider and 2.5 inches taller.' },
   { q: 'What is the standard interior door size?', a: 'The standard interior door is 36 inches wide by 80 inches tall.' }],
  'Rough Opening = Door Size + Framing Allowance',
  ['window-u-factor-calculator', 'square-footage-calculator']
);

add('baseboard-length-calculator', 'Baseboard Length Calculator',
  'Calculate linear feet of baseboard trim for a room.',
  'Everyday', 'everyday', '~',
  ['baseboard trim', 'baseboard length', 'baseboard linear feet'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "doors", label: "Number of Doors", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "doorWidth", label: "Door Width (ft)", type: "number", min: 2, max: 8, defaultValue: 3 }',
  ],
  `(inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const doors = inputs.doors as number;
      const dw = inputs.doorWidth as number;
      if (!rl || !rw) return null;
      const perimeter = 2 * (rl + rw);
      const doorDeduct = doors * dw;
      const needed = perimeter - doorDeduct;
      const withWaste = Math.ceil(needed * 1.1);
      return {
        primary: { label: "Baseboard Needed", value: formatNumber(withWaste) + " linear ft" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Door Deduction", value: formatNumber(Math.round(doorDeduct)) + " ft" },
          { label: "Net Length", value: formatNumber(Math.round(needed)) + " ft" },
        ],
      };
  }`,
  [{ q: 'How do I measure baseboard needed?', a: 'Measure the room perimeter and subtract the width of all door openings.' },
   { q: 'How much extra baseboard should I buy?', a: 'Buy 10 percent extra to account for cuts, corners, and waste.' }],
  'Linear Feet = (2 x (Length + Width)) - (Doors x Door Width) x 1.1',
  ['crown-molding-calculator', 'chair-rail-calculator']
);

add('crown-molding-calculator', 'Crown Molding Calculator',
  'Calculate linear feet of crown molding for a room.',
  'Everyday', 'everyday', '~',
  ['crown molding', 'crown molding length', 'ceiling trim'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "pricePerFt", label: "Price per Foot ($)", type: "number", min: 0.5, max: 30, defaultValue: 3 }',
  ],
  `(inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const price = inputs.pricePerFt as number;
      if (!rl || !rw) return null;
      const perimeter = 2 * (rl + rw);
      const withWaste = Math.ceil(perimeter * 1.1);
      const cost = withWaste * price;
      const corners = 4;
      return {
        primary: { label: "Crown Molding Needed", value: formatNumber(withWaste) + " linear ft" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Inside Corners", value: formatNumber(corners) },
          { label: "Material Cost", value: "$" + formatNumber(Math.round(cost)) },
        ],
      };
  }`,
  [{ q: 'How is crown molding measured?', a: 'Measure the room perimeter and add 10 percent for waste and miters.' },
   { q: 'How much does crown molding cost?', a: 'Crown molding ranges from $1 to $10 per linear foot for material.' }],
  'Linear Feet = 2 x (Length + Width) x 1.10',
  ['baseboard-length-calculator', 'chair-rail-calculator']
);

add('wainscoting-calculator', 'Wainscoting Calculator',
  'Calculate the number of wainscoting panels for a room.',
  'Everyday', 'everyday', '~',
  ['wainscoting panels', 'wainscoting estimate', 'wall paneling'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "panelWidth", label: "Panel Width (in)", type: "number", min: 3, max: 48, defaultValue: 16 }',
    '{ name: "wallHeight", label: "Wainscoting Height (in)", type: "number", min: 24, max: 60, defaultValue: 36 }',
  ],
  `(inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const pw = inputs.panelWidth as number;
      const wh = inputs.wallHeight as number;
      if (!rl || !rw || !pw || !wh) return null;
      const perimeter = 2 * (rl + rw);
      const perimeterIn = perimeter * 12;
      const panels = Math.ceil(perimeterIn / pw);
      const wallArea = perimeter * (wh / 12);
      return {
        primary: { label: "Panels Needed", value: formatNumber(panels) + " panels" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Wall Coverage Area", value: formatNumber(Math.round(wallArea)) + " sq ft" },
          { label: "Wainscoting Height", value: formatNumber(wh) + " inches" },
        ],
      };
  }`,
  [{ q: 'What is the standard wainscoting height?', a: 'Standard wainscoting height is 32 to 36 inches from the floor.' },
   { q: 'How wide should wainscoting panels be?', a: 'Panels are typically 12 to 16 inches wide for a balanced look.' }],
  'Panels = (Room Perimeter x 12) / Panel Width',
  ['chair-rail-calculator', 'baseboard-length-calculator']
);

add('chair-rail-calculator', 'Chair Rail Calculator',
  'Calculate linear feet of chair rail molding for a room.',
  'Everyday', 'everyday', '~',
  ['chair rail', 'chair rail length', 'chair rail molding'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 }',
    '{ name: "doors", label: "Number of Doors", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "windows", label: "Number of Windows", type: "number", min: 0, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const doors = inputs.doors as number;
      const windows = inputs.windows as number;
      if (!rl || !rw) return null;
      const perimeter = 2 * (rl + rw);
      const doorDeduct = doors * 3;
      const windowDeduct = windows * 3;
      const net = perimeter - doorDeduct - windowDeduct;
      const withWaste = Math.ceil(net * 1.1);
      return {
        primary: { label: "Chair Rail Needed", value: formatNumber(withWaste) + " linear ft" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Door Deductions", value: formatNumber(Math.round(doorDeduct)) + " ft" },
          { label: "Window Deductions", value: formatNumber(Math.round(windowDeduct)) + " ft" },
        ],
      };
  }`,
  [{ q: 'What height should chair rail be installed?', a: 'Chair rail is typically installed 30 to 36 inches from the floor.' },
   { q: 'Does chair rail go around the whole room?', a: 'Chair rail usually runs the full perimeter, stopping at door casings.' }],
  'Linear Feet = (Perimeter - Door/Window Openings) x 1.10',
  ['baseboard-length-calculator', 'wainscoting-calculator']
);

add('tile-grout-calculator', 'Tile Grout Calculator',
  'Calculate grout amount needed for a tile installation.',
  'Everyday', 'everyday', '~',
  ['tile grout', 'grout amount', 'grout calculator'],
  [
    '{ name: "area", label: "Tile Area (sq ft)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "tileWidth", label: "Tile Width (in)", type: "number", min: 1, max: 48, defaultValue: 12 }',
    '{ name: "tileLength", label: "Tile Length (in)", type: "number", min: 1, max: 48, defaultValue: 12 }',
    '{ name: "groutWidth", label: "Grout Joint Width (in)", type: "number", min: 0.06, max: 1, defaultValue: 0.125 }',
    '{ name: "tileThickness", label: "Tile Thickness (in)", type: "number", min: 0.2, max: 1, defaultValue: 0.375 }',
  ],
  `(inputs) => {
      const area = inputs.area as number;
      const tw = inputs.tileWidth as number;
      const tl = inputs.tileLength as number;
      const gw = inputs.groutWidth as number;
      const tt = inputs.tileThickness as number;
      if (!area || !tw || !tl || !gw || !tt) return null;
      const jointLength = area * 144 * (1/tw + 1/tl);
      const groutVolume = jointLength * gw * tt;
      const lbs = groutVolume * 100 / 1728;
      const bags = Math.ceil(lbs / 25);
      return {
        primary: { label: "Grout Bags Needed", value: formatNumber(bags) + " bags (25 lb)" },
        details: [
          { label: "Grout Weight", value: formatNumber(Math.round(lbs * 10) / 10) + " lbs" },
          { label: "Joint Length", value: formatNumber(Math.round(jointLength / 12)) + " ft" },
          { label: "Tile Area", value: formatNumber(area) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How much grout do I need per square foot?', a: 'About 0.5 to 1.5 lbs per sq ft depending on tile size and joint width.' },
   { q: 'What size grout joint should I use?', a: 'Use 1/8 inch for rectified tile and 3/16 inch for standard tile.' }],
  'Grout = Area x Joint Length Factor x Joint Width x Thickness',
  ['shower-tile-calculator', 'backsplash-tile-calculator']
);

add('shower-tile-calculator', 'Shower Tile Calculator',
  'Calculate the number of tiles needed for shower walls.',
  'Everyday', 'everyday', '~',
  ['shower tile', 'shower wall tile', 'shower tile count'],
  [
    '{ name: "showerWidth", label: "Shower Width (in)", type: "number", min: 24, max: 120, defaultValue: 60 }',
    '{ name: "showerDepth", label: "Shower Depth (in)", type: "number", min: 24, max: 120, defaultValue: 36 }',
    '{ name: "wallHeight", label: "Tile Height (in)", type: "number", min: 36, max: 120, defaultValue: 84 }',
    '{ name: "tileSize", label: "Tile Size (in)", type: "select", options: [{ value: "4", label: "4x4" }, { value: "6", label: "6x6" }, { value: "12", label: "12x12" }], defaultValue: "12" }',
  ],
  `(inputs) => {
      const sw = inputs.showerWidth as number;
      const sd = inputs.showerDepth as number;
      const wh = inputs.wallHeight as number;
      const ts = parseFloat(inputs.tileSize as string);
      if (!sw || !sd || !wh || !ts) return null;
      const wallPerimeter = sw + (sd * 2);
      const wallArea = wallPerimeter * wh;
      const tileArea = ts * ts;
      const tiles = Math.ceil((wallArea / tileArea) * 1.1);
      const sqFt = Math.round(wallArea / 144);
      return {
        primary: { label: "Tiles Needed", value: formatNumber(tiles) + " tiles" },
        details: [
          { label: "Wall Area", value: formatNumber(sqFt) + " sq ft" },
          { label: "Tile Size", value: formatNumber(ts) + "x" + formatNumber(ts) + " in" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  }`,
  [{ q: 'How high should shower tile go?', a: 'Tile shower walls to at least 72 inches, or ceiling height for full coverage.' },
   { q: 'How many extra tiles should I order?', a: 'Order 10 to 15 percent extra for cuts, breakage, and future repairs.' }],
  'Tiles = ((Width + 2 x Depth) x Height / Tile Area) x 1.10',
  ['tile-grout-calculator', 'backsplash-tile-calculator']
);

add('backsplash-tile-calculator', 'Backsplash Tile Calculator',
  'Calculate tiles needed for a kitchen backsplash area.',
  'Everyday', 'everyday', '~',
  ['backsplash tile', 'kitchen backsplash', 'backsplash tile count'],
  [
    '{ name: "bsLength", label: "Backsplash Length (in)", type: "number", min: 12, max: 360, defaultValue: 120 }',
    '{ name: "bsHeight", label: "Backsplash Height (in)", type: "number", min: 4, max: 48, defaultValue: 18 }',
    '{ name: "tileWidth", label: "Tile Width (in)", type: "number", min: 1, max: 24, defaultValue: 4 }',
    '{ name: "tileHeight", label: "Tile Height (in)", type: "number", min: 1, max: 24, defaultValue: 4 }',
  ],
  `(inputs) => {
      const bl = inputs.bsLength as number;
      const bh = inputs.bsHeight as number;
      const tw = inputs.tileWidth as number;
      const th = inputs.tileHeight as number;
      if (!bl || !bh || !tw || !th) return null;
      const totalArea = bl * bh;
      const tileArea = tw * th;
      const tiles = Math.ceil((totalArea / tileArea) * 1.1);
      const sqFt = Math.round(totalArea / 144);
      return {
        primary: { label: "Tiles Needed", value: formatNumber(tiles) + " tiles" },
        details: [
          { label: "Backsplash Area", value: formatNumber(sqFt) + " sq ft" },
          { label: "Tile Size", value: formatNumber(tw) + "x" + formatNumber(th) + " in" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  }`,
  [{ q: 'How tall should a kitchen backsplash be?', a: 'A standard backsplash is 15 to 18 inches tall between counter and cabinets.' },
   { q: 'What tile size is best for a backsplash?', a: 'Subway tile (3x6) and 4x4 tiles are popular choices for backsplashes.' }],
  'Tiles = (Length x Height / Tile Area) x 1.10',
  ['tile-grout-calculator', 'shower-tile-calculator']
);
