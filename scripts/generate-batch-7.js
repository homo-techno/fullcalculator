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

// === BATCH 7: 100 CALCULATORS ===

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
add(
  "concrete-driveway-cost-calculator",
  "Concrete Driveway Cost Calculator",
  "Estimate the cost of a concrete driveway by area and thickness.",
  "Finance",
  "finance",
  "$",
  ["concrete", "driveway", "cost", "paving"],
  [
    '{ name: "length", label: "Driveway Length (ft)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "width", label: "Driveway Width (ft)", type: "number", min: 8, max: 50, defaultValue: 16 }',
    '{ name: "thickness", label: "Thickness (inches)", type: "number", min: 3, max: 8, defaultValue: 4 }',
    '{ name: "pricePerYard", label: "Price per Cubic Yard ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const thickness = inputs.thickness as number;
    const pricePerYard = inputs.pricePerYard as number;
    const areaSqFt = length * width;
    const volumeCuFt = areaSqFt * (thickness / 12);
    const cubicYards = volumeCuFt / 27;
    const totalCost = cubicYards * pricePerYard;
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Area", value: formatNumber(areaSqFt) + " sq ft" },
        { label: "Cubic Yards Needed", value: formatNumber(cubicYards) }
      ]
    };
  }`,
  [
    { q: "How thick should a concrete driveway be?", a: "A residential driveway should be at least 4 inches thick." },
    { q: "How long does concrete take to cure?", a: "Concrete reaches full strength in about 28 days." }
  ],
  "Volume = Length x Width x (Thickness / 12); Cost = (Volume / 27) x Price per Cubic Yard",
  ["epoxy-floor-calculator", "countertop-square-footage-calculator"]
);

add(
  "epoxy-floor-calculator",
  "Epoxy Floor Calculator",
  "Calculate epoxy coating needed for a garage floor.",
  "Everyday",
  "everyday",
  "~",
  ["epoxy", "garage", "floor", "coating"],
  [
    '{ name: "length", label: "Floor Length (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "width", label: "Floor Width (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "coverageRate", label: "Coverage per Gallon (sq ft)", type: "number", min: 100, max: 500, defaultValue: 250 }',
    '{ name: "coats", label: "Number of Coats", type: "number", min: 1, max: 4, defaultValue: 2 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const coverageRate = inputs.coverageRate as number;
    const coats = inputs.coats as number;
    const area = length * width;
    const gallonsPerCoat = area / coverageRate;
    const totalGallons = gallonsPerCoat * coats;
    return {
      primary: { label: "Total Epoxy Needed", value: formatNumber(totalGallons) + " gallons" },
      details: [
        { label: "Floor Area", value: formatNumber(area) + " sq ft" },
        { label: "Gallons per Coat", value: formatNumber(gallonsPerCoat) }
      ]
    };
  }`,
  [
    { q: "How many coats of epoxy are recommended?", a: "Two coats are recommended for most garage floors." },
    { q: "How long between epoxy coats?", a: "Wait 12 to 24 hours between coats of epoxy." }
  ],
  "Total Gallons = (Length x Width / Coverage Rate) x Number of Coats",
  ["concrete-driveway-cost-calculator", "home-gym-space-calculator"]
);

add(
  "garage-door-size-calculator",
  "Garage Door Size Calculator",
  "Determine the right garage door dimensions for your opening.",
  "Everyday",
  "everyday",
  "~",
  ["garage", "door", "size", "dimensions"],
  [
    '{ name: "openingWidth", label: "Opening Width (ft)", type: "number", min: 6, max: 30, defaultValue: 16 }',
    '{ name: "openingHeight", label: "Opening Height (ft)", type: "number", min: 6, max: 14, defaultValue: 7 }',
    '{ name: "cars", label: "Number of Cars", type: "select", options: [{ value: "1", label: "1 Car" }, { value: "2", label: "2 Cars" }, { value: "3", label: "3 Cars" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const openingWidth = inputs.openingWidth as number;
    const openingHeight = inputs.openingHeight as number;
    const cars = inputs.cars as number;
    const recommendedWidth = cars * 9;
    const recommendedHeight = 7;
    const fits = openingWidth >= recommendedWidth && openingHeight >= recommendedHeight;
    return {
      primary: { label: "Recommended Door Size", value: recommendedWidth + " x " + recommendedHeight + " ft" },
      details: [
        { label: "Your Opening", value: openingWidth + " x " + openingHeight + " ft" },
        { label: "Fits Standard Door", value: fits ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "What is a standard single garage door size?", a: "A standard single garage door is 9 feet wide by 7 feet tall." },
    { q: "What is a standard double garage door size?", a: "A standard double garage door is 16 feet wide by 7 feet tall." }
  ],
  "Recommended Width = Number of Cars x 9 ft; Standard Height = 7 ft",
  ["home-gym-space-calculator", "billiard-room-size-calculator"]
);

add(
  "pergola-shade-calculator",
  "Pergola Shade Calculator",
  "Estimate shade coverage area from a pergola structure.",
  "Everyday",
  "everyday",
  "~",
  ["pergola", "shade", "coverage", "outdoor"],
  [
    '{ name: "pergolaLength", label: "Pergola Length (ft)", type: "number", min: 4, max: 40, defaultValue: 12 }',
    '{ name: "pergolaWidth", label: "Pergola Width (ft)", type: "number", min: 4, max: 40, defaultValue: 10 }',
    '{ name: "slatCoverage", label: "Slat Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const pergolaLength = inputs.pergolaLength as number;
    const pergolaWidth = inputs.pergolaWidth as number;
    const slatCoverage = inputs.slatCoverage as number;
    const totalArea = pergolaLength * pergolaWidth;
    const shadedArea = totalArea * (slatCoverage / 100);
    return {
      primary: { label: "Shaded Area", value: formatNumber(shadedArea) + " sq ft" },
      details: [
        { label: "Total Pergola Area", value: formatNumber(totalArea) + " sq ft" },
        { label: "Shade Percentage", value: slatCoverage + "%" }
      ]
    };
  }`,
  [
    { q: "How much shade does a pergola provide?", a: "A typical pergola provides 50 to 75 percent shade coverage." },
    { q: "What is the best pergola slat spacing?", a: "Slats spaced 1 to 2 inches apart provide good shade balance." }
  ],
  "Shaded Area = Length x Width x (Slat Coverage / 100)",
  ["landscape-lighting-calculator", "sandbox-sand-calculator"]
);

add(
  "trampoline-weight-limit-calculator",
  "Trampoline Weight Limit Calculator",
  "Estimate the maximum user weight for a trampoline size.",
  "Everyday",
  "everyday",
  "~",
  ["trampoline", "weight", "limit", "safety"],
  [
    '{ name: "diameter", label: "Trampoline Diameter (ft)", type: "number", min: 6, max: 20, defaultValue: 14 }',
    '{ name: "springCount", label: "Number of Springs", type: "number", min: 36, max: 150, defaultValue: 96 }',
    '{ name: "users", label: "Number of Users", type: "number", min: 1, max: 4, defaultValue: 1 }',
  ],
  `(inputs) => {
    const diameter = inputs.diameter as number;
    const springCount = inputs.springCount as number;
    const users = inputs.users as number;
    const baseWeight = diameter * 20 + springCount * 1.5;
    const perUser = baseWeight / users;
    return {
      primary: { label: "Max Weight Limit", value: formatNumber(baseWeight) + " lbs" },
      details: [
        { label: "Max per User", value: formatNumber(perUser) + " lbs" },
        { label: "Number of Users", value: formatNumber(users) }
      ]
    };
  }`,
  [
    { q: "What is a typical trampoline weight limit?", a: "Most 14 foot trampolines support 250 to 400 pounds." },
    { q: "Can multiple people jump at once?", a: "Manufacturers recommend only one jumper at a time for safety." }
  ],
  "Max Weight = Diameter x 20 + Spring Count x 1.5",
  ["swing-set-spacing-calculator", "basketball-court-size-calculator"]
);

add(
  "swing-set-spacing-calculator",
  "Swing Set Spacing Calculator",
  "Calculate proper spacing for swing set layout.",
  "Everyday",
  "everyday",
  "~",
  ["swing", "set", "spacing", "playground"],
  [
    '{ name: "swings", label: "Number of Swings", type: "number", min: 1, max: 8, defaultValue: 3 }',
    '{ name: "swingWidth", label: "Swing Seat Width (in)", type: "number", min: 12, max: 30, defaultValue: 18 }',
    '{ name: "beamHeight", label: "Beam Height (ft)", type: "number", min: 6, max: 14, defaultValue: 8 }',
  ],
  `(inputs) => {
    const swings = inputs.swings as number;
    const swingWidth = inputs.swingWidth as number;
    const beamHeight = inputs.beamHeight as number;
    const spacingInches = swingWidth + 6;
    const edgeClearance = 24;
    const totalWidthInches = swings * spacingInches + 2 * edgeClearance;
    const totalWidthFeet = totalWidthInches / 12;
    const safetyZone = beamHeight * 2;
    return {
      primary: { label: "Total Beam Length", value: formatNumber(totalWidthFeet) + " ft" },
      details: [
        { label: "Spacing Between Swings", value: formatNumber(spacingInches) + " in" },
        { label: "Front/Back Safety Zone", value: formatNumber(safetyZone) + " ft" }
      ]
    };
  }`,
  [
    { q: "How far apart should swings be?", a: "Swings should be at least 24 inches apart center to center." },
    { q: "What is a safe fall zone for swings?", a: "The fall zone should extend twice the beam height in all directions." }
  ],
  "Total Width = (Swings x (Seat Width + 6)) + 48 inches edge clearance",
  ["trampoline-weight-limit-calculator", "sandbox-sand-calculator"]
);

add(
  "sandbox-sand-calculator",
  "Sandbox Sand Calculator",
  "Calculate the volume of sand needed to fill a sandbox.",
  "Everyday",
  "everyday",
  "~",
  ["sandbox", "sand", "volume", "playground"],
  [
    '{ name: "length", label: "Sandbox Length (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "width", label: "Sandbox Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "depth", label: "Sand Depth (inches)", type: "number", min: 3, max: 24, defaultValue: 12 }',
    '{ name: "bagWeight", label: "Bag Weight (lbs)", type: "number", min: 25, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const bagWeight = inputs.bagWeight as number;
    const volumeCuFt = length * width * (depth / 12);
    const totalWeight = volumeCuFt * 100;
    const bags = Math.ceil(totalWeight / bagWeight);
    return {
      primary: { label: "Sand Volume", value: formatNumber(volumeCuFt) + " cu ft" },
      details: [
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Bags Needed", value: formatNumber(bags) }
      ]
    };
  }`,
  [
    { q: "How deep should sandbox sand be?", a: "Sandbox sand should be at least 12 inches deep for good play." },
    { q: "What type of sand is best for sandboxes?", a: "Use washed play sand that is free of dust and contaminants." }
  ],
  "Volume = Length x Width x (Depth / 12); Weight = Volume x 100 lbs per cu ft",
  ["swing-set-spacing-calculator", "pergola-shade-calculator"]
);

add(
  "basketball-court-size-calculator",
  "Basketball Court Size Calculator",
  "Get court dimensions by basketball court type.",
  "Everyday",
  "everyday",
  "~",
  ["basketball", "court", "size", "dimensions"],
  [
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Full NBA" }, { value: "2", label: "Full College" }, { value: "3", label: "Half Court" }, { value: "4", label: "High School" }], defaultValue: "3" }',
    '{ name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 }',
  ],
  `(inputs) => {
    const courtType = inputs.courtType as number;
    const surfaceCost = inputs.surfaceCost as number;
    let length = 94;
    let width = 50;
    if (courtType === 2) { length = 94; width = 50; }
    if (courtType === 3) { length = 47; width = 50; }
    if (courtType === 4) { length = 84; width = 50; }
    const area = length * width;
    const cost = area * surfaceCost;
    return {
      primary: { label: "Court Dimensions", value: length + " x " + width + " ft" },
      details: [
        { label: "Total Area", value: formatNumber(area) + " sq ft" },
        { label: "Surface Cost", value: "$" + formatNumber(cost) }
      ]
    };
  }`,
  [
    { q: "How big is an NBA basketball court?", a: "An NBA court is 94 feet long by 50 feet wide." },
    { q: "What is the size of a half court?", a: "A half court is 47 feet long by 50 feet wide." }
  ],
  "Area = Court Length x Court Width; Cost = Area x Surface Cost per Sq Ft",
  ["tennis-court-cost-calculator", "batting-cage-size-calculator"]
);

add(
  "tennis-court-cost-calculator",
  "Tennis Court Cost Calculator",
  "Estimate the cost of building a tennis court.",
  "Finance",
  "finance",
  "$",
  ["tennis", "court", "cost", "construction"],
  [
    '{ name: "surfaceType", label: "Surface Type", type: "select", options: [{ value: "1", label: "Hard Court" }, { value: "2", label: "Clay" }, { value: "3", label: "Grass" }], defaultValue: "1" }',
    '{ name: "fencing", label: "Include Fencing", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
    '{ name: "lighting", label: "Include Lighting", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "0" }',
  ],
  `(inputs) => {
    const surfaceType = inputs.surfaceType as number;
    const fencing = inputs.fencing as number;
    const lighting = inputs.lighting as number;
    const courtArea = 78 * 36;
    let baseCost = 25000;
    if (surfaceType === 2) baseCost = 35000;
    if (surfaceType === 3) baseCost = 50000;
    const fencingCost = fencing === 1 ? 8000 : 0;
    const lightingCost = lighting === 1 ? 12000 : 0;
    const totalCost = baseCost + fencingCost + lightingCost;
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Court Area", value: formatNumber(courtArea) + " sq ft" },
        { label: "Base Surface Cost", value: "$" + formatNumber(baseCost) },
        { label: "Fencing Cost", value: "$" + formatNumber(fencingCost) },
        { label: "Lighting Cost", value: "$" + formatNumber(lightingCost) }
      ]
    };
  }`,
  [
    { q: "How much does a tennis court cost?", a: "A basic hard court costs around 25000 to 50000 dollars." },
    { q: "What is the standard tennis court size?", a: "A standard tennis court is 78 feet long by 36 feet wide." }
  ],
  "Total Cost = Base Surface Cost + Fencing Cost + Lighting Cost",
  ["basketball-court-size-calculator", "concrete-driveway-cost-calculator"]
);

add(
  "batting-cage-size-calculator",
  "Batting Cage Size Calculator",
  "Determine batting cage dimensions for your space.",
  "Everyday",
  "everyday",
  "~",
  ["batting", "cage", "size", "baseball"],
  [
    '{ name: "cageType", label: "Cage Type", type: "select", options: [{ value: "1", label: "Softball" }, { value: "2", label: "Baseball" }, { value: "3", label: "Youth" }], defaultValue: "2" }',
    '{ name: "cages", label: "Number of Cages", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
    const cageType = inputs.cageType as number;
    const cages = inputs.cages as number;
    let length = 70;
    let width = 14;
    let height = 12;
    if (cageType === 1) { length = 55; width = 14; height = 12; }
    if (cageType === 3) { length = 50; width = 12; height = 10; }
    const totalWidth = width * cages;
    const area = length * totalWidth;
    return {
      primary: { label: "Cage Dimensions", value: length + " x " + width + " x " + height + " ft" },
      details: [
        { label: "Total Width for All Cages", value: formatNumber(totalWidth) + " ft" },
        { label: "Total Footprint", value: formatNumber(area) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How long should a batting cage be?", a: "A standard baseball batting cage is 70 feet long." },
    { q: "How wide is a batting cage?", a: "A standard batting cage is 12 to 14 feet wide." }
  ],
  "Cage Length varies by type; Total Width = Cage Width x Number of Cages",
  ["basketball-court-size-calculator", "archery-range-calculator"]
);

add(
  "archery-range-calculator",
  "Archery Range Calculator",
  "Calculate archery range safety zone dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["archery", "range", "safety", "shooting"],
  [
    '{ name: "distance", label: "Shooting Distance (yards)", type: "number", min: 10, max: 100, defaultValue: 20 }',
    '{ name: "lanes", label: "Number of Lanes", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "laneWidth", label: "Lane Width (ft)", type: "number", min: 4, max: 10, defaultValue: 5 }',
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const lanes = inputs.lanes as number;
    const laneWidth = inputs.laneWidth as number;
    const rangeLengthFt = distance * 3 + 30;
    const rangeWidth = lanes * laneWidth + 10;
    const totalArea = rangeLengthFt * rangeWidth;
    return {
      primary: { label: "Range Length", value: formatNumber(rangeLengthFt) + " ft" },
      details: [
        { label: "Range Width", value: formatNumber(rangeWidth) + " ft" },
        { label: "Total Area Needed", value: formatNumber(totalArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How far behind the target is the safety zone?", a: "Allow at least 30 feet of buffer behind the target backstop." },
    { q: "How wide should an archery lane be?", a: "Each archery lane should be at least 5 feet wide." }
  ],
  "Range Length = (Distance in yards x 3) + 30 ft buffer; Width = Lanes x Lane Width + 10",
  ["batting-cage-size-calculator", "dart-board-height-calculator"]
);

add(
  "dart-board-height-calculator",
  "Dart Board Height Calculator",
  "Get official dart board mounting dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["dart", "board", "height", "mounting"],
  [
    '{ name: "gameType", label: "Game Type", type: "select", options: [{ value: "1", label: "Steel Tip" }, { value: "2", label: "Soft Tip" }], defaultValue: "1" }',
    '{ name: "wallWidth", label: "Available Wall Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
  ],
  `(inputs) => {
    const gameType = inputs.gameType as number;
    const wallWidth = inputs.wallWidth as number;
    const bullseyeHeight = 68;
    const throwDistance = gameType === 1 ? 93.25 : 96;
    const boardDiameter = 18;
    const minWidth = 3;
    const fits = wallWidth >= minWidth;
    return {
      primary: { label: "Bullseye Height", value: bullseyeHeight + " inches from floor" },
      details: [
        { label: "Throw Distance", value: throwDistance + " inches" },
        { label: "Board Diameter", value: boardDiameter + " inches" },
        { label: "Wall Width OK", value: fits ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "How high should a dart board be?", a: "The bullseye should be 5 feet 8 inches from the floor." },
    { q: "How far do you stand from a dart board?", a: "The steel tip throwing distance is 7 feet 9.25 inches." }
  ],
  "Bullseye Height = 68 inches; Throw Distance = 93.25 (steel) or 96 (soft) inches",
  ["billiard-room-size-calculator", "archery-range-calculator"]
);

add(
  "billiard-room-size-calculator",
  "Billiard Room Size Calculator",
  "Calculate the room size needed for a pool table.",
  "Everyday",
  "everyday",
  "~",
  ["billiard", "pool", "table", "room", "size"],
  [
    '{ name: "tableSize", label: "Table Size", type: "select", options: [{ value: "7", label: "7 ft Bar" }, { value: "8", label: "8 ft Standard" }, { value: "9", label: "9 ft Tournament" }], defaultValue: "8" }',
    '{ name: "cueLength", label: "Cue Length (inches)", type: "number", min: 36, max: 62, defaultValue: 58 }',
  ],
  `(inputs) => {
    const tableSize = inputs.tableSize as number;
    const cueLength = inputs.cueLength as number;
    const tableWidths = { 7: 40, 8: 44, 9: 50 };
    const tableLengths = { 7: 80, 8: 88, 9: 100 };
    const tw = tableWidths[tableSize] || 44;
    const tl = tableLengths[tableSize] || 88;
    const roomWidth = (tw + 2 * cueLength) / 12;
    const roomLength = (tl + 2 * cueLength) / 12;
    const roomArea = roomWidth * roomLength;
    return {
      primary: { label: "Minimum Room Size", value: formatNumber(roomLength) + " x " + formatNumber(roomWidth) + " ft" },
      details: [
        { label: "Table Playing Surface", value: tl + " x " + tw + " in" },
        { label: "Room Area Needed", value: formatNumber(roomArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How big a room for a pool table?", a: "An 8 foot table needs at least a 13 by 17 foot room." },
    { q: "What is the standard pool cue length?", a: "A standard pool cue is 58 inches long." }
  ],
  "Room Dimension = (Table Dimension + 2 x Cue Length) / 12",
  ["dart-board-height-calculator", "home-gym-space-calculator"]
);

add(
  "home-gym-space-calculator",
  "Home Gym Space Calculator",
  "Calculate the floor space needed for a home gym.",
  "Everyday",
  "everyday",
  "~",
  ["home", "gym", "space", "fitness"],
  [
    '{ name: "equipment", label: "Equipment Pieces", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "avgFootprint", label: "Avg Equipment Size (sq ft)", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "freeWeight", label: "Free Weight Area (sq ft)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "stretchArea", label: "Stretch Area (sq ft)", type: "number", min: 0, max: 150, defaultValue: 40 }',
  ],
  `(inputs) => {
    const equipment = inputs.equipment as number;
    const avgFootprint = inputs.avgFootprint as number;
    const freeWeight = inputs.freeWeight as number;
    const stretchArea = inputs.stretchArea as number;
    const equipmentArea = equipment * avgFootprint;
    const walkways = equipmentArea * 0.3;
    const totalArea = equipmentArea + walkways + freeWeight + stretchArea;
    return {
      primary: { label: "Total Space Needed", value: formatNumber(totalArea) + " sq ft" },
      details: [
        { label: "Equipment Area", value: formatNumber(equipmentArea) + " sq ft" },
        { label: "Walkway Space", value: formatNumber(walkways) + " sq ft" },
        { label: "Free Weight Area", value: formatNumber(freeWeight) + " sq ft" },
        { label: "Stretch Area", value: formatNumber(stretchArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much space for a home gym?", a: "A basic home gym needs at least 100 to 200 square feet." },
    { q: "What ceiling height is best for a gym?", a: "A ceiling height of at least 8 feet is recommended." }
  ],
  "Total Area = Equipment x Avg Size x 1.3 + Free Weight Area + Stretch Area",
  ["billiard-room-size-calculator", "epoxy-floor-calculator"]
);

add(
  "sauna-heater-calculator",
  "Sauna Heater Calculator",
  "Calculate the heater kW needed for your sauna room.",
  "Science",
  "science",
  "A",
  ["sauna", "heater", "kW", "room"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 7 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 6 }',
    '{ name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 7 }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Good" }, { value: "2", label: "Average" }, { value: "3", label: "Poor" }], defaultValue: "1" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const insulation = inputs.insulation as number;
    const volumeCuFt = length * width * height;
    const volumeCuM = volumeCuFt * 0.0283168;
    let kw = volumeCuM * 1.0;
    if (insulation === 2) kw = volumeCuM * 1.3;
    if (insulation === 3) kw = volumeCuM * 1.6;
    return {
      primary: { label: "Heater Size Needed", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Volume in Cubic Meters", value: formatNumber(volumeCuM) + " cu m" }
      ]
    };
  }`,
  [
    { q: "How many kW per cubic meter for a sauna?", a: "Use about 1 kW per cubic meter for a well insulated sauna." },
    { q: "What temperature should a sauna be?", a: "A traditional sauna should be between 150 and 195 degrees F." }
  ],
  "kW = Volume in Cubic Meters x Insulation Factor (1.0 to 1.6)",
  ["steam-room-generator-calculator", "home-gym-space-calculator"]
);

add(
  "steam-room-generator-calculator",
  "Steam Room Generator Calculator",
  "Calculate steam generator size for your steam room.",
  "Science",
  "science",
  "A",
  ["steam", "room", "generator", "spa"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 6 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 5 }',
    '{ name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 8 }',
    '{ name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Tile / Stone" }, { value: "2", label: "Acrylic" }, { value: "3", label: "Natural Stone" }], defaultValue: "1" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const wallType = inputs.wallType as number;
    const volumeCuFt = length * width * height;
    let factor = 1.0;
    if (wallType === 2) factor = 0.8;
    if (wallType === 3) factor = 1.5;
    const adjustedVolume = volumeCuFt * factor;
    const kw = adjustedVolume / 30;
    return {
      primary: { label: "Generator Size", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Adjusted Volume", value: formatNumber(adjustedVolume) + " cu ft" }
      ]
    };
  }`,
  [
    { q: "How is steam generator size determined?", a: "Generator size is based on room volume and wall material type." },
    { q: "What wall material is best for steam rooms?", a: "Ceramic tile and porcelain are the most popular choices." }
  ],
  "kW = (Volume x Material Factor) / 30",
  ["sauna-heater-calculator", "home-gym-space-calculator"]
);

add(
  "wine-cellar-capacity-calculator",
  "Wine Cellar Capacity Calculator",
  "Estimate the number of bottles a wine cellar can hold.",
  "Everyday",
  "everyday",
  "~",
  ["wine", "cellar", "capacity", "bottles"],
  [
    '{ name: "length", label: "Cellar Length (ft)", type: "number", min: 3, max: 40, defaultValue: 10 }',
    '{ name: "width", label: "Cellar Width (ft)", type: "number", min: 3, max: 40, defaultValue: 8 }',
    '{ name: "wallCoverage", label: "Wall Rack Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 70 }',
    '{ name: "rackDepth", label: "Rack Depth (bottles)", type: "number", min: 1, max: 5, defaultValue: 1 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const wallCoverage = inputs.wallCoverage as number;
    const rackDepth = inputs.rackDepth as number;
    const perimeter = 2 * (length + width);
    const rackWallFt = perimeter * (wallCoverage / 100);
    const bottlesPerFt = 12;
    const totalBottles = Math.floor(rackWallFt * bottlesPerFt * rackDepth);
    return {
      primary: { label: "Bottle Capacity", value: formatNumber(totalBottles) + " bottles" },
      details: [
        { label: "Rack Wall Length", value: formatNumber(rackWallFt) + " ft" },
        { label: "Cellar Area", value: formatNumber(length * width) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How many bottles per linear foot of racking?", a: "Standard wine racks hold about 12 bottles per linear foot." },
    { q: "What temperature is best for wine storage?", a: "Wine should be stored between 55 and 58 degrees Fahrenheit." }
  ],
  "Bottles = Rack Wall Length x 12 bottles per ft x Rack Depth",
  ["bookshelf-capacity-calculator", "kitchen-island-size-calculator"]
);

add(
  "bookshelf-capacity-calculator",
  "Bookshelf Capacity Calculator",
  "Estimate the number of books a bookshelf can hold.",
  "Everyday",
  "everyday",
  "~",
  ["bookshelf", "books", "capacity", "storage"],
  [
    '{ name: "shelfWidth", label: "Shelf Width (inches)", type: "number", min: 12, max: 96, defaultValue: 36 }',
    '{ name: "shelves", label: "Number of Shelves", type: "number", min: 1, max: 12, defaultValue: 5 }',
    '{ name: "bookThickness", label: "Avg Book Thickness (inches)", type: "number", min: 0.5, max: 3, defaultValue: 1 }',
  ],
  `(inputs) => {
    const shelfWidth = inputs.shelfWidth as number;
    const shelves = inputs.shelves as number;
    const bookThickness = inputs.bookThickness as number;
    const booksPerShelf = Math.floor(shelfWidth / bookThickness);
    const totalBooks = booksPerShelf * shelves;
    return {
      primary: { label: "Total Book Capacity", value: formatNumber(totalBooks) + " books" },
      details: [
        { label: "Books per Shelf", value: formatNumber(booksPerShelf) },
        { label: "Number of Shelves", value: formatNumber(shelves) }
      ]
    };
  }`,
  [
    { q: "How many books fit on a 36 inch shelf?", a: "About 25 to 36 average sized books fit on a 36 inch shelf." },
    { q: "What is a standard bookshelf width?", a: "Standard bookshelves are 24 to 36 inches wide." }
  ],
  "Books per Shelf = Shelf Width / Avg Book Thickness; Total = Books per Shelf x Shelves",
  ["closet-organizer-calculator", "wine-cellar-capacity-calculator"]
);

add(
  "closet-organizer-calculator",
  "Closet Organizer Calculator",
  "Calculate closet storage capacity and layout options.",
  "Everyday",
  "everyday",
  "~",
  ["closet", "organizer", "storage", "wardrobe"],
  [
    '{ name: "closetWidth", label: "Closet Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "closetDepth", label: "Closet Depth (ft)", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "closetHeight", label: "Closet Height (ft)", type: "number", min: 6, max: 10, defaultValue: 8 }',
    '{ name: "hangingRatio", label: "Hanging Space (%)", type: "number", min: 0, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const closetWidth = inputs.closetWidth as number;
    const closetDepth = inputs.closetDepth as number;
    const closetHeight = inputs.closetHeight as number;
    const hangingRatio = inputs.hangingRatio as number;
    const totalLinearFt = closetWidth;
    const hangingFt = totalLinearFt * (hangingRatio / 100);
    const shelfFt = totalLinearFt - hangingFt;
    const hangingItems = Math.floor(hangingFt * 12);
    const shelfItems = Math.floor(shelfFt * closetHeight * 2);
    return {
      primary: { label: "Hanging Items Capacity", value: formatNumber(hangingItems) + " items" },
      details: [
        { label: "Hanging Rod Length", value: formatNumber(hangingFt) + " ft" },
        { label: "Shelf Section", value: formatNumber(shelfFt) + " ft" },
        { label: "Folded Item Capacity", value: formatNumber(shelfItems) + " items" }
      ]
    };
  }`,
  [
    { q: "How much hanging space do I need?", a: "Most people need about 4 to 6 feet of hanging rod space." },
    { q: "What is the ideal closet depth?", a: "A minimum depth of 24 inches is needed for hanging clothes." }
  ],
  "Hanging Items = Hanging Feet x 12; Shelf Items = Shelf Feet x Height x 2",
  ["bookshelf-capacity-calculator", "kitchen-island-size-calculator"]
);

add(
  "kitchen-island-size-calculator",
  "Kitchen Island Size Calculator",
  "Determine the right kitchen island dimensions for your space.",
  "Everyday",
  "everyday",
  "~",
  ["kitchen", "island", "size", "dimensions"],
  [
    '{ name: "kitchenLength", label: "Kitchen Length (ft)", type: "number", min: 8, max: 40, defaultValue: 16 }',
    '{ name: "kitchenWidth", label: "Kitchen Width (ft)", type: "number", min: 8, max: 40, defaultValue: 12 }',
    '{ name: "clearance", label: "Walkway Clearance (ft)", type: "number", min: 3, max: 5, defaultValue: 4 }',
  ],
  `(inputs) => {
    const kitchenLength = inputs.kitchenLength as number;
    const kitchenWidth = inputs.kitchenWidth as number;
    const clearance = inputs.clearance as number;
    const islandLength = kitchenLength - 2 * clearance;
    const islandWidth = kitchenWidth - 2 * clearance;
    const maxIslandLength = Math.max(islandLength, 2);
    const maxIslandWidth = Math.min(Math.max(islandWidth, 2), 4);
    const islandArea = maxIslandLength * maxIslandWidth;
    return {
      primary: { label: "Max Island Size", value: formatNumber(maxIslandLength) + " x " + formatNumber(maxIslandWidth) + " ft" },
      details: [
        { label: "Island Counter Area", value: formatNumber(islandArea) + " sq ft" },
        { label: "Walkway Clearance", value: clearance + " ft on each side" }
      ]
    };
  }`,
  [
    { q: "How much clearance around a kitchen island?", a: "Allow at least 36 to 48 inches of clearance on all sides." },
    { q: "What is a good kitchen island size?", a: "A common island size is 4 feet long by 2 feet wide." }
  ],
  "Island Length = Kitchen Length - 2 x Clearance; Width capped at 4 ft",
  ["countertop-square-footage-calculator", "cabinet-hardware-calculator"]
);

add(
  "countertop-square-footage-calculator",
  "Countertop Square Footage Calculator",
  "Calculate total countertop area for your kitchen.",
  "Everyday",
  "everyday",
  "~",
  ["countertop", "square", "footage", "kitchen"],
  [
    '{ name: "sections", label: "Number of Sections", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "avgLength", label: "Avg Section Length (ft)", type: "number", min: 1, max: 20, defaultValue: 6 }',
    '{ name: "depth", label: "Counter Depth (inches)", type: "number", min: 12, max: 36, defaultValue: 25 }',
    '{ name: "pricePerSqFt", label: "Price per Sq Ft ($)", type: "number", min: 5, max: 300, defaultValue: 60 }',
  ],
  `(inputs) => {
    const sections = inputs.sections as number;
    const avgLength = inputs.avgLength as number;
    const depth = inputs.depth as number;
    const pricePerSqFt = inputs.pricePerSqFt as number;
    const depthFt = depth / 12;
    const totalSqFt = sections * avgLength * depthFt;
    const totalCost = totalSqFt * pricePerSqFt;
    return {
      primary: { label: "Total Countertop Area", value: formatNumber(totalSqFt) + " sq ft" },
      details: [
        { label: "Depth in Feet", value: formatNumber(depthFt) + " ft" },
        { label: "Estimated Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "What is a standard countertop depth?", a: "Standard kitchen countertop depth is 25 inches." },
    { q: "How much does granite countertop cost?", a: "Granite costs about 40 to 100 dollars per square foot installed." }
  ],
  "Total Sq Ft = Sections x Avg Length x (Depth / 12); Cost = Sq Ft x Price",
  ["kitchen-island-size-calculator", "cabinet-hardware-calculator"]
);

add(
  "cabinet-hardware-calculator",
  "Cabinet Hardware Calculator",
  "Calculate the number of knobs and pulls needed for cabinets.",
  "Everyday",
  "everyday",
  "~",
  ["cabinet", "hardware", "knobs", "pulls"],
  [
    '{ name: "doors", label: "Number of Doors", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "drawers", label: "Number of Drawers", type: "number", min: 0, max: 40, defaultValue: 10 }',
    '{ name: "knobPrice", label: "Knob Price ($)", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "pullPrice", label: "Pull Price ($)", type: "number", min: 1, max: 80, defaultValue: 8 }',
  ],
  `(inputs) => {
    const doors = inputs.doors as number;
    const drawers = inputs.drawers as number;
    const knobPrice = inputs.knobPrice as number;
    const pullPrice = inputs.pullPrice as number;
    const knobs = doors;
    const pulls = drawers;
    const totalPieces = knobs + pulls;
    const totalCost = knobs * knobPrice + pulls * pullPrice;
    return {
      primary: { label: "Total Hardware Pieces", value: formatNumber(totalPieces) },
      details: [
        { label: "Knobs for Doors", value: formatNumber(knobs) },
        { label: "Pulls for Drawers", value: formatNumber(pulls) },
        { label: "Total Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "Should I use knobs or pulls on cabinets?", a: "Knobs are common on doors and pulls are common on drawers." },
    { q: "What size pulls for kitchen cabinets?", a: "The most popular pull sizes are 3 inch and 4 inch centers." }
  ],
  "Knobs = Number of Doors; Pulls = Number of Drawers; Cost = Knobs x Price + Pulls x Price",
  ["countertop-square-footage-calculator", "kitchen-island-size-calculator"]
);

add(
  "lighting-lumen-calculator",
  "Lighting Lumen Calculator",
  "Calculate the lumens needed for a room by purpose.",
  "Science",
  "science",
  "A",
  ["lighting", "lumens", "room", "brightness"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Living Room" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Bedroom" }, { value: "4", label: "Office" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const roomType = inputs.roomType as number;
    const area = length * width;
    let lumensPerSqFt = 20;
    if (roomType === 2) lumensPerSqFt = 40;
    if (roomType === 3) lumensPerSqFt = 15;
    if (roomType === 4) lumensPerSqFt = 50;
    const totalLumens = area * lumensPerSqFt;
    const bulbs60W = Math.ceil(totalLumens / 800);
    return {
      primary: { label: "Total Lumens Needed", value: formatNumber(totalLumens) + " lumens" },
      details: [
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Lumens per Sq Ft", value: formatNumber(lumensPerSqFt) },
        { label: "Equivalent 60W Bulbs", value: formatNumber(bulbs60W) }
      ]
    };
  }`,
  [
    { q: "How many lumens per square foot?", a: "Kitchens need 40, living rooms 20, and bedrooms 15 lumens." },
    { q: "How many lumens is a 60W bulb?", a: "A standard 60 watt incandescent bulb produces about 800 lumens." }
  ],
  "Total Lumens = Room Area x Lumens per Sq Ft (varies by room type)",
  ["recessed-lighting-calculator", "landscape-lighting-calculator"]
);

add(
  "recessed-lighting-calculator",
  "Recessed Lighting Calculator",
  "Calculate recessed light spacing and quantity needed.",
  "Everyday",
  "everyday",
  "~",
  ["recessed", "lighting", "spacing", "ceiling"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 }',
  ],
  `(inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const spacing = ceilingHeight / 2;
    const rows = Math.ceil(roomLength / spacing);
    const cols = Math.ceil(roomWidth / spacing);
    const totalLights = rows * cols;
    return {
      primary: { label: "Lights Needed", value: formatNumber(totalLights) },
      details: [
        { label: "Recommended Spacing", value: formatNumber(spacing) + " ft" },
        { label: "Rows", value: formatNumber(rows) },
        { label: "Columns", value: formatNumber(cols) }
      ]
    };
  }`,
  [
    { q: "How far apart should recessed lights be?", a: "Space recessed lights at half the ceiling height apart." },
    { q: "How far from the wall should recessed lights be?", a: "Place recessed lights about 2 to 3 feet from the wall." }
  ],
  "Spacing = Ceiling Height / 2; Lights = Rows x Columns",
  ["lighting-lumen-calculator", "landscape-lighting-calculator"]
);

add(
  "landscape-lighting-calculator",
  "Landscape Lighting Calculator",
  "Calculate landscape lighting fixtures and total wattage.",
  "Everyday",
  "everyday",
  "~",
  ["landscape", "lighting", "outdoor", "wattage"],
  [
    '{ name: "pathLength", label: "Path Length (ft)", type: "number", min: 5, max: 500, defaultValue: 60 }',
    '{ name: "spacing", label: "Fixture Spacing (ft)", type: "number", min: 4, max: 20, defaultValue: 8 }',
    '{ name: "wattsPerFixture", label: "Watts per Fixture", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "accentLights", label: "Accent Lights", type: "number", min: 0, max: 30, defaultValue: 4 }',
  ],
  `(inputs) => {
    const pathLength = inputs.pathLength as number;
    const spacing = inputs.spacing as number;
    const wattsPerFixture = inputs.wattsPerFixture as number;
    const accentLights = inputs.accentLights as number;
    const pathLights = Math.ceil(pathLength / spacing) + 1;
    const totalFixtures = pathLights + accentLights;
    const totalWatts = totalFixtures * wattsPerFixture;
    return {
      primary: { label: "Total Fixtures", value: formatNumber(totalFixtures) },
      details: [
        { label: "Path Lights", value: formatNumber(pathLights) },
        { label: "Accent Lights", value: formatNumber(accentLights) },
        { label: "Total Wattage", value: formatNumber(totalWatts) + " W" }
      ]
    };
  }`,
  [
    { q: "How far apart should path lights be?", a: "Space path lights 6 to 8 feet apart for even illumination." },
    { q: "What wattage for landscape lights?", a: "Low voltage LED landscape lights use 3 to 8 watts each." }
  ],
  "Path Lights = (Path Length / Spacing) + 1; Total Watts = Total Fixtures x Watts",
  ["recessed-lighting-calculator", "lighting-lumen-calculator"]
);
add('under-cabinet-lighting-calculator', 'Under Cabinet Lighting Calculator',
  'Estimate LED strip length and wattage for under cabinet lights.',
  'Everyday', 'everyday', '~',
  ['under cabinet lighting', 'LED strip calculator'],
  [
    '{ name: "cabinetLength", label: "Total Cabinet Length (ft)", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "wattsPerFt", label: "Watts Per Foot", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "sections", label: "Number of Sections", type: "number", min: 1, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const len = inputs.cabinetLength as number;
      const wpf = inputs.wattsPerFt as number;
      const sec = inputs.sections as number;
      if (!len || !wpf || !sec) return null;
      const totalWatts = len * wpf;
      const perSection = Math.round((len / sec) * 100) / 100;
      const amps12v = Math.round((totalWatts / 12) * 100) / 100;
      return {
        primary: { label: "Total Wattage", value: formatNumber(totalWatts) + " W" },
        details: [
          { label: "Strip Length Per Section", value: formatNumber(perSection) + " ft" },
          { label: "Current at 12V", value: formatNumber(amps12v) + " A" },
          { label: "Recommended PSU", value: formatNumber(Math.ceil(amps12v * 1.2)) + " A" },
        ],
      };
  }`,
  [{ q: 'What wattage do I need for under cabinet lights?', a: 'Most LED strips use 3 to 5 watts per foot for good task lighting.' },
   { q: 'Should I use 12V or 24V strips?', a: 'Use 12V for short runs under 16 feet and 24V for longer runs.' }],
  'Total Wattage = Cabinet Length x Watts Per Foot',
  []
);

add('ceiling-height-calculator', 'Ceiling Height Calculator',
  'Determine ideal ceiling height based on room dimensions.',
  'Everyday', 'everyday', '~',
  ['ceiling height', 'room proportion calculator'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 100, defaultValue: 16 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 100, defaultValue: 12 }',
    '{ name: "actualHeight", label: "Actual Ceiling Height (ft)", type: "number", min: 6, max: 30, defaultValue: 8 }',
  ],
  `(inputs) => {
      const len = inputs.roomLength as number;
      const wid = inputs.roomWidth as number;
      const actual = inputs.actualHeight as number;
      if (!len || !wid || !actual) return null;
      const avgDim = (len + wid) / 2;
      const idealHeight = Math.round((avgDim * 0.6) * 10) / 10;
      const diff = Math.round((actual - idealHeight) * 10) / 10;
      const roomVol = Math.round(len * wid * actual);
      return {
        primary: { label: "Ideal Ceiling Height", value: formatNumber(idealHeight) + " ft" },
        details: [
          { label: "Actual Height", value: formatNumber(actual) + " ft" },
          { label: "Difference", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " ft" },
          { label: "Room Volume", value: formatNumber(roomVol) + " cu ft" },
        ],
      };
  }`,
  [{ q: 'What is the standard ceiling height?', a: 'Standard ceiling height in most homes is 8 to 9 feet.' },
   { q: 'Do higher ceilings cost more to heat?', a: 'Yes. Each extra foot of height adds roughly 10% to heating costs.' }],
  'Ideal Height = (Room Length + Room Width) / 2 x 0.6',
  []
);

add('staircase-carpet-calculator', 'Staircase Carpet Calculator',
  'Calculate carpet needed for stairs including treads and risers.',
  'Everyday', 'everyday', '~',
  ['staircase carpet', 'stair carpet calculator'],
  [
    '{ name: "steps", label: "Number of Steps", type: "number", min: 1, max: 50, defaultValue: 13 }',
    '{ name: "treadDepth", label: "Tread Depth (in)", type: "number", min: 6, max: 24, defaultValue: 10 }',
    '{ name: "riserHeight", label: "Riser Height (in)", type: "number", min: 4, max: 12, defaultValue: 7 }',
    '{ name: "stairWidth", label: "Stair Width (in)", type: "number", min: 24, max: 60, defaultValue: 36 }',
  ],
  `(inputs) => {
      const steps = inputs.steps as number;
      const tread = inputs.treadDepth as number;
      const riser = inputs.riserHeight as number;
      const width = inputs.stairWidth as number;
      if (!steps || !tread || !riser || !width) return null;
      const perStep = (tread + riser + 2) / 12;
      const totalLength = Math.round(perStep * steps * 100) / 100;
      const sqFt = Math.round(totalLength * (width / 12) * 100) / 100;
      const withWaste = Math.round(sqFt * 1.1 * 100) / 100;
      return {
        primary: { label: "Carpet Needed", value: formatNumber(withWaste) + " sq ft" },
        details: [
          { label: "Carpet Length", value: formatNumber(totalLength) + " ft" },
          { label: "Area Without Waste", value: formatNumber(sqFt) + " sq ft" },
          { label: "Waste Allowance (10%)", value: formatNumber(Math.round((withWaste - sqFt) * 100) / 100) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How much extra carpet should I buy for stairs?', a: 'Add 10% to 15% extra for waste, cuts, and alignment.' },
   { q: 'Can I carpet stairs myself?', a: 'Yes, but professional install is recommended for safety.' }],
  'Carpet Length = (Tread + Riser + 2 in) / 12 x Steps',
  []
);

add('window-treatment-calculator', 'Window Treatment Calculator',
  'Calculate curtain width and rod length for windows.',
  'Everyday', 'everyday', '~',
  ['curtain size', 'window treatment sizing'],
  [
    '{ name: "windowWidth", label: "Window Width (in)", type: "number", min: 12, max: 200, defaultValue: 48 }',
    '{ name: "windowHeight", label: "Window Height (in)", type: "number", min: 12, max: 120, defaultValue: 60 }',
    '{ name: "fullness", label: "Fullness Multiplier", type: "select", options: [{ value: "1.5", label: "1.5x (Casual)" }, { value: "2", label: "2x (Standard)" }, { value: "2.5", label: "2.5x (Luxurious)" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const full = inputs.fullness as number;
      if (!ww || !wh || !full) return null;
      const rodLength = Math.round(ww + 12);
      const curtainWidth = Math.round(ww * full);
      const curtainLength = Math.round(wh + 4);
      const panels = Math.ceil(curtainWidth / 54);
      return {
        primary: { label: "Total Curtain Width", value: formatNumber(curtainWidth) + " in" },
        details: [
          { label: "Rod Length", value: formatNumber(rodLength) + " in" },
          { label: "Curtain Length", value: formatNumber(curtainLength) + " in" },
          { label: "Number of Panels (54 in wide)", value: String(panels) },
        ],
      };
  }`,
  [{ q: 'How wide should curtains be?', a: 'Curtains should be 1.5 to 2.5 times the window width for fullness.' },
   { q: 'How far above the window should a rod go?', a: 'Mount the rod 4 to 6 inches above the window frame.' }],
  'Curtain Width = Window Width x Fullness Multiplier',
  []
);

add('blinds-size-calculator', 'Blinds Size Calculator',
  'Calculate window blinds dimensions for inside or outside mount.',
  'Everyday', 'everyday', '~',
  ['blinds size', 'window blinds dimensions'],
  [
    '{ name: "windowWidth", label: "Window Opening Width (in)", type: "number", min: 8, max: 200, defaultValue: 36 }',
    '{ name: "windowHeight", label: "Window Opening Height (in)", type: "number", min: 8, max: 120, defaultValue: 48 }',
    '{ name: "mountType", label: "Mount Type", type: "select", options: [{ value: "1", label: "Inside Mount" }, { value: "2", label: "Outside Mount" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const mount = inputs.mountType as number;
      if (!ww || !wh || !mount) return null;
      let blindWidth, blindHeight;
      if (mount === 1) {
        blindWidth = Math.round((ww - 0.25) * 100) / 100;
        blindHeight = Math.round(wh * 100) / 100;
      } else {
        blindWidth = Math.round((ww + 3) * 100) / 100;
        blindHeight = Math.round((wh + 3) * 100) / 100;
      }
      const area = Math.round(blindWidth * blindHeight * 100) / 100;
      return {
        primary: { label: "Blind Width", value: formatNumber(blindWidth) + " in" },
        details: [
          { label: "Blind Height", value: formatNumber(blindHeight) + " in" },
          { label: "Blind Area", value: formatNumber(Math.round(area / 144 * 100) / 100) + " sq ft" },
          { label: "Mount Type", value: mount === 1 ? "Inside Mount" : "Outside Mount" },
        ],
      };
  }`,
  [{ q: 'What is inside mount vs outside mount?', a: 'Inside mount fits within the window frame. Outside mount covers it.' },
   { q: 'How much smaller should inside mount blinds be?', a: 'Deduct about 1/4 inch from the width for inside mount blinds.' }],
  'Inside: Width = Opening - 0.25 in; Outside: Width = Opening + 3 in',
  []
);

add('tv-viewing-distance-calculator', 'TV Viewing Distance Calculator',
  'Find the optimal viewing distance for your TV size.',
  'Everyday', 'everyday', '~',
  ['TV viewing distance', 'TV distance calculator'],
  [
    '{ name: "tvSize", label: "TV Screen Size (in diagonal)", type: "number", min: 20, max: 120, defaultValue: 55 }',
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "4K (Ultra HD)" }, { value: "3", label: "8K" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const size = inputs.tvSize as number;
      const res = inputs.resolution as number;
      if (!size || !res) return null;
      const multiplier = res === 1 ? 1.6 : res === 2 ? 1.0 : 0.75;
      const minDist = Math.round(size * multiplier * 10) / 10;
      const maxDist = Math.round(size * multiplier * 1.5 * 10) / 10;
      const heightFt = Math.round(size * 0.49 / 12 * 10) / 10;
      return {
        primary: { label: "Optimal Distance", value: formatNumber(minDist) + " - " + formatNumber(maxDist) + " in" },
        details: [
          { label: "Minimum Distance", value: formatNumber(Math.round(minDist / 12 * 10) / 10) + " ft" },
          { label: "Maximum Distance", value: formatNumber(Math.round(maxDist / 12 * 10) / 10) + " ft" },
          { label: "Screen Height", value: formatNumber(heightFt) + " ft" },
        ],
      };
  }`,
  [{ q: 'How far should I sit from a 65 inch TV?', a: 'For 4K, sit about 5.4 to 8.1 feet away from a 65 inch TV.' },
   { q: 'Does resolution affect viewing distance?', a: 'Yes. Higher resolution allows you to sit closer without seeing pixels.' }],
  'Distance = TV Size x Resolution Multiplier',
  []
);

add('projector-screen-size-calculator', 'Projector Screen Size Calculator',
  'Calculate projector screen size from throw distance.',
  'Everyday', 'everyday', '~',
  ['projector screen size', 'throw distance calculator'],
  [
    '{ name: "throwDist", label: "Throw Distance (ft)", type: "number", min: 3, max: 50, defaultValue: 12 }',
    '{ name: "throwRatio", label: "Throw Ratio", type: "number", min: 0.3, max: 4, defaultValue: 1.5 }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "1.78", label: "16:9" }, { value: "2.35", label: "2.35:1" }, { value: "1.33", label: "4:3" }], defaultValue: "1.78" }',
  ],
  `(inputs) => {
      const dist = inputs.throwDist as number;
      const ratio = inputs.throwRatio as number;
      const ar = inputs.aspectRatio as number;
      if (!dist || !ratio || !ar) return null;
      const screenWidthFt = dist / ratio;
      const screenWidthIn = Math.round(screenWidthFt * 12 * 10) / 10;
      const screenHeightIn = Math.round(screenWidthIn / ar * 10) / 10;
      const diagonal = Math.round(Math.sqrt(screenWidthIn * screenWidthIn + screenHeightIn * screenHeightIn) * 10) / 10;
      return {
        primary: { label: "Screen Diagonal", value: formatNumber(diagonal) + " in" },
        details: [
          { label: "Screen Width", value: formatNumber(screenWidthIn) + " in" },
          { label: "Screen Height", value: formatNumber(screenHeightIn) + " in" },
          { label: "Throw Distance", value: formatNumber(dist) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is throw ratio?', a: 'Throw ratio is the distance to the screen divided by the screen width.' },
   { q: 'What throw ratio is best for home theater?', a: 'A throw ratio of 1.3 to 1.6 works well for most home setups.' }],
  'Screen Width = Throw Distance / Throw Ratio',
  []
);

add('speaker-placement-calculator', 'Speaker Placement Calculator',
  'Calculate optimal speaker angles and distances for surround sound.',
  'Science', 'science', 'A',
  ['speaker placement', 'surround sound setup'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 6, max: 60, defaultValue: 18 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 6, max: 40, defaultValue: 14 }',
    '{ name: "seatingDist", label: "Seating Distance from Front (ft)", type: "number", min: 4, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const len = inputs.roomLength as number;
      const wid = inputs.roomWidth as number;
      const seat = inputs.seatingDist as number;
      if (!len || !wid || !seat) return null;
      const halfW = wid / 2;
      const frontAngle = Math.round(Math.atan2(halfW, seat) * (180 / Math.PI) * 10) / 10;
      const surrDist = Math.round(Math.sqrt(halfW * halfW + 0) * 10) / 10;
      const rearDist = Math.round((len - seat) * 10) / 10;
      const idealFront = Math.round(seat * 10) / 10;
      return {
        primary: { label: "Front Speaker Angle", value: formatNumber(frontAngle) + " degrees" },
        details: [
          { label: "Front Speaker Distance", value: formatNumber(idealFront) + " ft" },
          { label: "Side Surround Distance", value: formatNumber(surrDist) + " ft" },
          { label: "Rear Wall Distance", value: formatNumber(rearDist) + " ft" },
        ],
      };
  }`,
  [{ q: 'What angle should front speakers be at?', a: 'Front speakers should be at 22 to 30 degrees from center.' },
   { q: 'Should all speakers be the same distance?', a: 'Ideally yes. Equal distance provides balanced sound arrival.' }],
  'Front Angle = arctan(Half Room Width / Seating Distance)',
  []
);

add('ethernet-cable-calculator', 'Ethernet Cable Calculator',
  'Calculate total ethernet cable length for network runs.',
  'Science', 'science', 'A',
  ['ethernet cable length', 'network cable calculator'],
  [
    '{ name: "runs", label: "Number of Cable Runs", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "avgDistance", label: "Avg Run Distance (ft)", type: "number", min: 5, max: 300, defaultValue: 50 }',
    '{ name: "slackPerRun", label: "Slack Per Run (ft)", type: "number", min: 0, max: 20, defaultValue: 6 }',
  ],
  `(inputs) => {
      const runs = inputs.runs as number;
      const avgDist = inputs.avgDistance as number;
      const slack = inputs.slackPerRun as number;
      if (!runs || !avgDist) return null;
      const perRun = avgDist + slack;
      const totalFt = Math.round(perRun * runs);
      const boxes = Math.ceil(totalFt / 1000);
      const leftover = boxes * 1000 - totalFt;
      return {
        primary: { label: "Total Cable Needed", value: formatNumber(totalFt) + " ft" },
        details: [
          { label: "Per Run (with slack)", value: formatNumber(perRun) + " ft" },
          { label: "1000 ft Boxes Needed", value: String(boxes) },
          { label: "Leftover Cable", value: formatNumber(leftover) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is the max length for an ethernet run?', a: 'Cat5e and Cat6 support runs up to 328 feet or 100 meters.' },
   { q: 'How much slack should I leave?', a: 'Leave 6 to 10 feet of slack at each end for termination.' }],
  'Total Cable = (Avg Distance + Slack) x Number of Runs',
  []
);

add('wifi-access-point-calculator', 'WiFi Access Point Calculator',
  'Estimate the number of access points for wireless coverage.',
  'Science', 'science', 'A',
  ['wifi access point', 'wireless coverage calculator'],
  [
    '{ name: "areaSqFt", label: "Total Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 5000 }',
    '{ name: "coveragePerAp", label: "Coverage Per AP (sq ft)", type: "number", min: 200, max: 5000, defaultValue: 1500 }',
    '{ name: "users", label: "Expected Users", type: "number", min: 1, max: 1000, defaultValue: 30 }',
  ],
  `(inputs) => {
      const area = inputs.areaSqFt as number;
      const covPerAp = inputs.coveragePerAp as number;
      const users = inputs.users as number;
      if (!area || !covPerAp || !users) return null;
      const apByCoverage = Math.ceil(area / covPerAp);
      const apByUsers = Math.ceil(users / 25);
      const recommended = Math.max(apByCoverage, apByUsers);
      const usersPerAp = Math.round(users / recommended);
      return {
        primary: { label: "Access Points Needed", value: String(recommended) },
        details: [
          { label: "APs by Coverage", value: String(apByCoverage) },
          { label: "APs by User Density", value: String(apByUsers) },
          { label: "Users Per AP", value: String(usersPerAp) },
        ],
      };
  }`,
  [{ q: 'How many devices can one access point handle?', a: 'A typical enterprise AP supports 25 to 50 concurrent devices.' },
   { q: 'Do walls reduce WiFi coverage?', a: 'Yes. Concrete and brick walls can reduce range by 30% to 50%.' }],
  'APs Needed = max(Area / Coverage Per AP, Users / 25)',
  []
);

add('ups-battery-calculator', 'UPS Battery Calculator',
  'Estimate UPS runtime based on battery capacity and load.',
  'Science', 'science', 'A',
  ['UPS runtime', 'battery backup calculator'],
  [
    '{ name: "upsVa", label: "UPS Rating (VA)", type: "number", min: 100, max: 20000, defaultValue: 1500 }',
    '{ name: "loadWatts", label: "Total Load (W)", type: "number", min: 10, max: 20000, defaultValue: 500 }',
    '{ name: "batteryAh", label: "Battery Capacity (Ah)", type: "number", min: 1, max: 200, defaultValue: 9 }',
  ],
  `(inputs) => {
      const va = inputs.upsVa as number;
      const load = inputs.loadWatts as number;
      const ah = inputs.batteryAh as number;
      if (!va || !load || !ah) return null;
      const batteryV = 12;
      const batteryWh = batteryV * ah;
      const efficiency = 0.85;
      const runtime = Math.round((batteryWh * efficiency / load) * 60 * 10) / 10;
      const loadPercent = Math.round((load / (va * 0.6)) * 100);
      return {
        primary: { label: "Estimated Runtime", value: formatNumber(runtime) + " min" },
        details: [
          { label: "Battery Energy", value: formatNumber(batteryWh) + " Wh" },
          { label: "Load Percentage", value: formatNumber(Math.min(loadPercent, 999)) + "%" },
          { label: "Efficiency Factor", value: "85%" },
        ],
      };
  }`,
  [{ q: 'How long will a UPS last?', a: 'Runtime depends on battery size and load. Lower load means longer runtime.' },
   { q: 'What size UPS do I need for a PC?', a: 'A 1000 to 1500 VA UPS handles most desktop computer setups.' }],
  'Runtime (min) = (Battery Ah x 12V x 0.85 / Load W) x 60',
  []
);

add('server-rack-calculator', 'Server Rack Calculator',
  'Calculate rack units needed for server equipment.',
  'Science', 'science', 'A',
  ['server rack units', 'rack space calculator'],
  [
    '{ name: "servers", label: "Number of 1U Servers", type: "number", min: 0, max: 42, defaultValue: 6 }',
    '{ name: "switches", label: "Number of 1U Switches", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "patchPanels", label: "Number of 1U Patch Panels", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "ups", label: "Number of 2U UPS Units", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const servers = inputs.servers as number;
      const switches = inputs.switches as number;
      const panels = inputs.patchPanels as number;
      const ups = inputs.ups as number;
      const totalU = servers + switches + panels + (ups * 2);
      const spacers = Math.floor(totalU / 6);
      const totalWithSpacers = totalU + spacers;
      const racksNeeded = Math.ceil(totalWithSpacers / 42);
      return {
        primary: { label: "Total Rack Units", value: String(totalWithSpacers) + " U" },
        details: [
          { label: "Equipment Units", value: String(totalU) + " U" },
          { label: "Spacers / Blanks", value: String(spacers) + " U" },
          { label: "42U Racks Needed", value: String(racksNeeded) },
        ],
      };
  }`,
  [{ q: 'What is a rack unit?', a: 'A rack unit (U) is 1.75 inches of vertical rack space.' },
   { q: 'How many servers fit in a standard rack?', a: 'A standard 42U rack holds up to 42 one-unit servers theoretically.' }],
  'Total U = Servers + Switches + Panels + (UPS x 2) + Spacers',
  []
);

add('data-transfer-time-calculator', 'Data Transfer Time Calculator',
  'Estimate file transfer time based on size and speed.',
  'Science', 'science', 'A',
  ['data transfer time', 'file transfer calculator'],
  [
    '{ name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 100000, defaultValue: 10 }',
    '{ name: "speed", label: "Transfer Speed (Mbps)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "overhead", label: "Protocol Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const size = inputs.fileSize as number;
      const speed = inputs.speed as number;
      const overhead = inputs.overhead as number;
      if (!size || !speed) return null;
      const effectiveSpeed = speed * (1 - overhead / 100);
      const sizeMb = size * 1024 * 8;
      const seconds = Math.round(sizeMb / effectiveSpeed * 10) / 10;
      const minutes = Math.round(seconds / 60 * 10) / 10;
      const hours = Math.round(seconds / 3600 * 100) / 100;
      return {
        primary: { label: "Transfer Time", value: seconds < 120 ? formatNumber(seconds) + " sec" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed)) + " Mbps" },
          { label: "File Size", value: formatNumber(size) + " GB" },
          { label: "Hours", value: formatNumber(hours) },
        ],
      };
  }`,
  [{ q: 'Why is my transfer slower than the rated speed?', a: 'Protocol overhead and network congestion reduce real throughput.' },
   { q: 'What is Mbps vs MBps?', a: 'Mbps is megabits per second. MBps is megabytes. Divide Mbps by 8 for MBps.' }],
  'Time = (File Size in Mb) / Effective Speed',
  []
);

add('bandwidth-calculator', 'Bandwidth Calculator',
  'Calculate bandwidth needs based on users and usage type.',
  'Science', 'science', 'A',
  ['bandwidth calculator', 'internet speed needs'],
  [
    '{ name: "users", label: "Number of Users", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "usageType", label: "Usage Type", type: "select", options: [{ value: "1", label: "Basic (email/web)" }, { value: "3", label: "Standard (video calls)" }, { value: "8", label: "Heavy (streaming/cloud)" }], defaultValue: "3" }',
    '{ name: "concurrency", label: "Concurrency (%)", type: "number", min: 10, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
      const users = inputs.users as number;
      const usage = inputs.usageType as number;
      const conc = inputs.concurrency as number;
      if (!users || !usage || !conc) return null;
      const concurrentUsers = Math.ceil(users * conc / 100);
      const totalMbps = Math.round(concurrentUsers * usage * 10) / 10;
      const recommended = Math.round(totalMbps * 1.3);
      return {
        primary: { label: "Recommended Bandwidth", value: formatNumber(recommended) + " Mbps" },
        details: [
          { label: "Concurrent Users", value: formatNumber(concurrentUsers) },
          { label: "Calculated Need", value: formatNumber(totalMbps) + " Mbps" },
          { label: "Per User", value: formatNumber(usage) + " Mbps" },
        ],
      };
  }`,
  [{ q: 'How much bandwidth per user?', a: 'Plan 1 to 3 Mbps for basic use and 5 to 10 Mbps for video calls.' },
   { q: 'What is concurrency?', a: 'Concurrency is the percentage of users active at the same time.' }],
  'Bandwidth = Concurrent Users x Per User Mbps x 1.3',
  []
);

add('ip-subnet-calculator', 'IP Subnet Calculator',
  'Calculate subnet mask, host count, and address range.',
  'Science', 'science', 'A',
  ['subnet calculator', 'IP subnet mask'],
  [
    '{ name: "cidr", label: "CIDR Prefix Length", type: "number", min: 1, max: 30, defaultValue: 24 }',
    '{ name: "subnetsNeeded", label: "Subnets Needed", type: "number", min: 1, max: 256, defaultValue: 1 }',
  ],
  `(inputs) => {
      const cidr = inputs.cidr as number;
      const subnets = inputs.subnetsNeeded as number;
      if (!cidr || !subnets) return null;
      const totalHosts = Math.pow(2, 32 - cidr) - 2;
      const subnetBits = Math.ceil(Math.log2(subnets));
      const newCidr = Math.min(cidr + subnetBits, 30);
      const hostsPerSubnet = Math.pow(2, 32 - newCidr) - 2;
      const octets = [0, 0, 0, 0];
      let bits = cidr;
      for (let i = 0; i < 4; i++) {
        if (bits >= 8) { octets[i] = 255; bits -= 8; }
        else if (bits > 0) { octets[i] = 256 - Math.pow(2, 8 - bits); bits = 0; }
      }
      const mask = octets.join(".");
      return {
        primary: { label: "Usable Hosts", value: formatNumber(Math.max(totalHosts, 0)) },
        details: [
          { label: "Subnet Mask", value: mask },
          { label: "New CIDR (with subnets)", value: "/" + String(newCidr) },
          { label: "Hosts Per Subnet", value: formatNumber(Math.max(hostsPerSubnet, 0)) },
        ],
      };
  }`,
  [{ q: 'What is CIDR notation?', a: 'CIDR notation like /24 defines how many bits are used for the network.' },
   { q: 'How many hosts in a /24 subnet?', a: 'A /24 subnet has 254 usable host addresses.' }],
  'Usable Hosts = 2^(32 - CIDR) - 2',
  []
);

add('raid-capacity-calculator', 'RAID Capacity Calculator',
  'Calculate usable capacity of a RAID disk array.',
  'Science', 'science', 'A',
  ['RAID capacity', 'disk array calculator'],
  [
    '{ name: "diskCount", label: "Number of Disks", type: "number", min: 2, max: 24, defaultValue: 4 }',
    '{ name: "diskSize", label: "Disk Size (TB)", type: "number", min: 0.1, max: 20, defaultValue: 2 }',
    '{ name: "raidLevel", label: "RAID Level", type: "select", options: [{ value: "0", label: "RAID 0 (Stripe)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single Parity)" }, { value: "6", label: "RAID 6 (Double Parity)" }, { value: "10", label: "RAID 10 (Mirror+Stripe)" }], defaultValue: "5" }',
  ],
  `(inputs) => {
      const disks = inputs.diskCount as number;
      const size = inputs.diskSize as number;
      const raid = inputs.raidLevel as number;
      if (!disks || !size) return null;
      let usable = 0;
      let fault = 0;
      if (raid === 0) { usable = disks * size; fault = 0; }
      else if (raid === 1) { usable = size; fault = disks - 1; }
      else if (raid === 5) { usable = (disks - 1) * size; fault = 1; }
      else if (raid === 6) { usable = (disks - 2) * size; fault = 2; }
      else if (raid === 10) { usable = Math.floor(disks / 2) * size; fault = 1; }
      const rawTotal = disks * size;
      const efficiency = Math.round((usable / rawTotal) * 100);
      return {
        primary: { label: "Usable Capacity", value: formatNumber(Math.round(usable * 100) / 100) + " TB" },
        details: [
          { label: "Raw Capacity", value: formatNumber(rawTotal) + " TB" },
          { label: "Storage Efficiency", value: formatNumber(efficiency) + "%" },
          { label: "Fault Tolerance", value: String(fault) + " disk(s)" },
        ],
      };
  }`,
  [{ q: 'Which RAID level is best?', a: 'RAID 5 or 6 offers a good balance of capacity and redundancy.' },
   { q: 'Does RAID replace backups?', a: 'No. RAID is not a backup. You still need separate backup copies.' }],
  'RAID 5 Usable = (Disks - 1) x Disk Size',
  []
);

add('backup-storage-calculator', 'Backup Storage Calculator',
  'Estimate storage needed for backup retention policies.',
  'Science', 'science', 'A',
  ['backup storage', 'backup size calculator'],
  [
    '{ name: "dataSize", label: "Data Size (GB)", type: "number", min: 1, max: 1000000, defaultValue: 500 }',
    '{ name: "dailyChange", label: "Daily Change Rate (%)", type: "number", min: 0.1, max: 100, defaultValue: 5 }',
    '{ name: "retentionDays", label: "Retention Period (days)", type: "number", min: 1, max: 365, defaultValue: 30 }',
  ],
  `(inputs) => {
      const data = inputs.dataSize as number;
      const change = inputs.dailyChange as number;
      const days = inputs.retentionDays as number;
      if (!data || !change || !days) return null;
      const fullBackup = data;
      const incrementalSize = data * (change / 100);
      const totalIncremental = incrementalSize * (days - 1);
      const totalStorage = Math.round((fullBackup + totalIncremental) * 100) / 100;
      const totalTB = Math.round(totalStorage / 1024 * 100) / 100;
      return {
        primary: { label: "Total Backup Storage", value: totalStorage > 1024 ? formatNumber(totalTB) + " TB" : formatNumber(Math.round(totalStorage)) + " GB" },
        details: [
          { label: "Full Backup Size", value: formatNumber(fullBackup) + " GB" },
          { label: "Daily Incremental", value: formatNumber(Math.round(incrementalSize * 100) / 100) + " GB" },
          { label: "Retention Period", value: String(days) + " days" },
        ],
      };
  }`,
  [{ q: 'What is an incremental backup?', a: 'An incremental backup only saves data that changed since the last backup.' },
   { q: 'How long should I retain backups?', a: 'Retain daily backups for 30 days and monthly backups for one year.' }],
  'Total = Full Backup + (Daily Change x (Retention Days - 1))',
  []
);

add('print-time-3d-calculator', '3D Print Time Calculator',
  'Estimate 3D printing time from volume and settings.',
  'Science', 'science', 'A',
  ['3D print time', 'print duration calculator'],
  [
    '{ name: "volume", label: "Part Volume (cm3)", type: "number", min: 0.1, max: 10000, defaultValue: 50 }',
    '{ name: "layerHeight", label: "Layer Height (mm)", type: "number", min: 0.05, max: 0.6, defaultValue: 0.2 }',
    '{ name: "printSpeed", label: "Print Speed (mm/s)", type: "number", min: 10, max: 300, defaultValue: 60 }',
    '{ name: "infill", label: "Infill (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const layer = inputs.layerHeight as number;
      const speed = inputs.printSpeed as number;
      const infill = inputs.infill as number;
      if (!vol || !layer || !speed) return null;
      const effectiveVol = vol * (0.3 + infill / 100 * 0.7);
      const layerArea = effectiveVol * 1000 / (layer);
      const pathLength = layerArea / 0.4;
      const timeSeconds = pathLength / speed;
      const hours = Math.round(timeSeconds / 3600 * 10) / 10;
      const minutes = Math.round(timeSeconds / 60);
      return {
        primary: { label: "Estimated Print Time", value: hours >= 1 ? formatNumber(hours) + " hrs" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Volume", value: formatNumber(Math.round(effectiveVol * 10) / 10) + " cm3" },
          { label: "Total Path Length", value: formatNumber(Math.round(pathLength / 1000)) + " m" },
          { label: "Layer Height", value: formatNumber(layer) + " mm" },
        ],
      };
  }`,
  [{ q: 'Does layer height affect print time?', a: 'Yes. Thinner layers increase quality but double the print time.' },
   { q: 'What is a good print speed?', a: 'Most FDM printers work well at 40 to 80 mm per second.' }],
  'Time = Path Length / Print Speed',
  []
);

add('filament-usage-calculator', 'Filament Usage Calculator',
  'Calculate 3D printer filament needed for a print job.',
  'Science', 'science', 'A',
  ['filament usage', '3D filament calculator'],
  [
    '{ name: "volume", label: "Part Volume (cm3)", type: "number", min: 0.1, max: 10000, defaultValue: 30 }',
    '{ name: "infill", label: "Infill (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "density", label: "Filament Density (g/cm3)", type: "number", min: 0.5, max: 3, defaultValue: 1.24 }',
    '{ name: "spoolWeight", label: "Spool Weight (g)", type: "number", min: 100, max: 5000, defaultValue: 1000 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const infill = inputs.infill as number;
      const density = inputs.density as number;
      const spool = inputs.spoolWeight as number;
      if (!vol || !density || !spool) return null;
      const effectiveVol = vol * (0.3 + infill / 100 * 0.7);
      const weightG = Math.round(effectiveVol * density * 100) / 100;
      const lengthM = Math.round(effectiveVol / (Math.PI * 0.08625 * 0.08625) / 100 * 100) / 100;
      const spoolFraction = Math.round((weightG / spool) * 100);
      return {
        primary: { label: "Filament Weight", value: formatNumber(weightG) + " g" },
        details: [
          { label: "Filament Length", value: formatNumber(lengthM) + " m" },
          { label: "Spool Usage", value: formatNumber(spoolFraction) + "%" },
          { label: "Effective Volume", value: formatNumber(Math.round(effectiveVol * 10) / 10) + " cm3" },
        ],
      };
  }`,
  [{ q: 'How much filament does a print use?', a: 'Most small prints use 10 to 50 grams of filament.' },
   { q: 'What is PLA density?', a: 'PLA filament has a density of about 1.24 grams per cubic centimeter.' }],
  'Weight = Effective Volume x Filament Density',
  []
);

add('laser-cutting-cost-calculator', 'Laser Cutting Cost Calculator',
  'Estimate cost for a laser cutting job by material and time.',
  'Finance', 'finance', '$',
  ['laser cutting cost', 'laser cut estimate'],
  [
    '{ name: "cutLength", label: "Total Cut Length (in)", type: "number", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "materialThick", label: "Material Thickness (mm)", type: "number", min: 0.5, max: 25, defaultValue: 3 }',
    '{ name: "ratePerMin", label: "Machine Rate ($/min)", type: "number", min: 0.5, max: 20, defaultValue: 3 }',
    '{ name: "materialCost", label: "Material Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 25 }',
  ],
  `(inputs) => {
      const cutLen = inputs.cutLength as number;
      const thick = inputs.materialThick as number;
      const rate = inputs.ratePerMin as number;
      const matCost = inputs.materialCost as number;
      if (!cutLen || !thick || !rate) return null;
      const speedIpm = Math.max(5, 120 / thick);
      const cutTimeMin = Math.round(cutLen / speedIpm * 100) / 100;
      const machineCost = Math.round(cutTimeMin * rate * 100) / 100;
      const totalCost = Math.round((machineCost + matCost) * 100) / 100;
      return {
        primary: { label: "Total Job Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Machine Cost", value: "$" + formatNumber(machineCost) },
          { label: "Material Cost", value: "$" + formatNumber(matCost) },
        ],
      };
  }`,
  [{ q: 'What affects laser cutting cost?', a: 'Material thickness, cut length, and machine rate are the main factors.' },
   { q: 'Is laser cutting expensive?', a: 'Laser cutting is cost effective for detailed cuts and small batches.' }],
  'Total Cost = (Cut Length / Speed) x Rate + Material Cost',
  []
);

add('cnc-machining-cost-calculator', 'CNC Machining Cost Calculator',
  'Estimate CNC machining time and cost for a part.',
  'Finance', 'finance', '$',
  ['CNC machining cost', 'CNC time estimate'],
  [
    '{ name: "materialVolume", label: "Material Volume (in3)", type: "number", min: 0.1, max: 5000, defaultValue: 20 }',
    '{ name: "removalRate", label: "Removal Rate (in3/min)", type: "number", min: 0.01, max: 10, defaultValue: 0.5 }',
    '{ name: "machineRate", label: "Machine Rate ($/hr)", type: "number", min: 10, max: 500, defaultValue: 75 }',
    '{ name: "setupTime", label: "Setup Time (min)", type: "number", min: 0, max: 480, defaultValue: 30 }',
  ],
  `(inputs) => {
      const vol = inputs.materialVolume as number;
      const removal = inputs.removalRate as number;
      const rate = inputs.machineRate as number;
      const setup = inputs.setupTime as number;
      if (!vol || !removal || !rate) return null;
      const cutTimeMin = Math.round(vol / removal * 10) / 10;
      const totalMin = cutTimeMin + setup;
      const totalHrs = Math.round(totalMin / 60 * 100) / 100;
      const cost = Math.round(totalHrs * rate * 100) / 100;
      return {
        primary: { label: "Total Machining Cost", value: "$" + formatNumber(cost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Total Time (with setup)", value: formatNumber(totalMin) + " min" },
          { label: "Total Hours", value: formatNumber(totalHrs) + " hrs" },
        ],
      };
  }`,
  [{ q: 'What affects CNC machining cost?', a: 'Material hardness, part complexity, and machine rate drive cost.' },
   { q: 'What is a typical CNC machine rate?', a: 'CNC machine rates range from $50 to $150 per hour typically.' }],
  'Cost = ((Volume / Removal Rate) + Setup Time) / 60 x Rate',
  []
);

add('injection-molding-cost-calculator', 'Injection Molding Cost Calculator',
  'Calculate per-part cost for injection molded parts.',
  'Finance', 'finance', '$',
  ['injection molding cost', 'per part mold cost'],
  [
    '{ name: "moldCost", label: "Mold Cost ($)", type: "number", min: 100, max: 500000, defaultValue: 15000 }',
    '{ name: "partCount", label: "Total Parts", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "materialPerPart", label: "Material Per Part ($)", type: "number", min: 0.01, max: 50, defaultValue: 0.25 }',
    '{ name: "cycleTime", label: "Cycle Time (sec)", type: "number", min: 5, max: 300, defaultValue: 30 }',
  ],
  `(inputs) => {
      const mold = inputs.moldCost as number;
      const parts = inputs.partCount as number;
      const matPer = inputs.materialPerPart as number;
      const cycle = inputs.cycleTime as number;
      if (!mold || !parts || !matPer || !cycle) return null;
      const machineRate = 40;
      const laborPerPart = Math.round((cycle / 3600) * machineRate * 100) / 100;
      const moldPerPart = Math.round((mold / parts) * 100) / 100;
      const totalPerPart = Math.round((moldPerPart + matPer + laborPerPart) * 100) / 100;
      const totalCost = Math.round(totalPerPart * parts);
      return {
        primary: { label: "Cost Per Part", value: "$" + formatNumber(totalPerPart) },
        details: [
          { label: "Mold Amortization Per Part", value: "$" + formatNumber(moldPerPart) },
          { label: "Material Per Part", value: "$" + formatNumber(matPer) },
          { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  }`,
  [{ q: 'How much does an injection mold cost?', a: 'Simple molds start around $3000. Complex molds can exceed $100000.' },
   { q: 'How many parts before injection molding is worth it?', a: 'Injection molding is cost effective above about 1000 parts typically.' }],
  'Per Part = (Mold Cost / Parts) + Material + Labor',
  []
);

add('pcb-trace-width-calculator', 'PCB Trace Width Calculator',
  'Calculate PCB trace width needed for a given current.',
  'Science', 'science', 'A',
  ['PCB trace width', 'trace current calculator'],
  [
    '{ name: "current", label: "Current (A)", type: "number", min: 0.01, max: 30, defaultValue: 1 }',
    '{ name: "copperWeight", label: "Copper Weight (oz)", type: "number", min: 0.5, max: 4, defaultValue: 1 }',
    '{ name: "tempRise", label: "Temp Rise (C)", type: "number", min: 5, max: 100, defaultValue: 10 }',
    '{ name: "layer", label: "Layer", type: "select", options: [{ value: "1", label: "External" }, { value: "2", label: "Internal" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const current = inputs.current as number;
      const copper = inputs.copperWeight as number;
      const tempRise = inputs.tempRise as number;
      const layer = inputs.layer as number;
      if (!current || !copper || !tempRise) return null;
      const thickness = copper * 1.378;
      const k = layer === 1 ? 0.048 : 0.024;
      const area = Math.pow(current / (k * Math.pow(tempRise, 0.44)), 1 / 0.725);
      const widthMils = Math.round((area / thickness) * 100) / 100;
      const widthMm = Math.round(widthMils * 0.0254 * 100) / 100;
      return {
        primary: { label: "Trace Width", value: formatNumber(widthMils) + " mils" },
        details: [
          { label: "Width (mm)", value: formatNumber(widthMm) + " mm" },
          { label: "Cross Section Area", value: formatNumber(Math.round(area * 100) / 100) + " mil2" },
          { label: "Copper Thickness", value: formatNumber(Math.round(thickness * 100) / 100) + " mils" },
        ],
      };
  }`,
  [{ q: 'What standard is used for PCB trace width?', a: 'IPC-2221 provides the standard formula for trace width calculations.' },
   { q: 'Do internal layers need wider traces?', a: 'Yes. Internal layers dissipate less heat and need wider traces.' }],
  'Area = (Current / (k x TempRise^0.44))^(1/0.725)',
  []
);

add('heat-sink-calculator', 'Heat Sink Calculator',
  'Calculate required heat sink thermal resistance.',
  'Science', 'science', 'A',
  ['heat sink calculator', 'thermal resistance'],
  [
    '{ name: "powerW", label: "Power Dissipation (W)", type: "number", min: 0.1, max: 500, defaultValue: 10 }',
    '{ name: "maxJunctionTemp", label: "Max Junction Temp (C)", type: "number", min: 50, max: 200, defaultValue: 125 }',
    '{ name: "ambientTemp", label: "Ambient Temp (C)", type: "number", min: 0, max: 60, defaultValue: 25 }',
    '{ name: "thetaJC", label: "Junction-to-Case Theta (C/W)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }',
  ],
  `(inputs) => {
      const power = inputs.powerW as number;
      const maxTj = inputs.maxJunctionTemp as number;
      const ambient = inputs.ambientTemp as number;
      const thetaJC = inputs.thetaJC as number;
      if (!power || !maxTj || !thetaJC) return null;
      const totalTheta = (maxTj - ambient) / power;
      const thetaCS = 0.5;
      const thetaHS = Math.round((totalTheta - thetaJC - thetaCS) * 100) / 100;
      const junctionTemp = Math.round(ambient + power * (thetaJC + thetaCS + Math.max(thetaHS, 0)));
      return {
        primary: { label: "Required Heat Sink Theta", value: formatNumber(Math.max(thetaHS, 0)) + " C/W" },
        details: [
          { label: "Total Thermal Budget", value: formatNumber(Math.round(totalTheta * 100) / 100) + " C/W" },
          { label: "Junction Temp (est.)", value: formatNumber(junctionTemp) + " C" },
          { label: "Feasible", value: thetaHS > 0 ? "Yes" : "No - reduce power or raise max temp" },
        ],
      };
  }`,
  [{ q: 'What is thermal resistance?', a: 'Thermal resistance measures how well heat flows, in degrees C per watt.' },
   { q: 'Lower thermal resistance is better?', a: 'Yes. Lower C/W means the heat sink dissipates heat more effectively.' }],
  'Theta HS = (Tj Max - Ambient) / Power - Theta JC - Theta CS',
  []
);

add('stepper-motor-torque-calculator', 'Stepper Motor Torque Calculator',
  'Calculate stepper motor torque needed for a given load.',
  'Science', 'science', 'A',
  ['stepper motor torque', 'motor sizing calculator'],
  [
    '{ name: "loadWeight", label: "Load Weight (kg)", type: "number", min: 0.01, max: 500, defaultValue: 2 }',
    '{ name: "leadScrew", label: "Lead Screw Pitch (mm/rev)", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "acceleration", label: "Acceleration (mm/s2)", type: "number", min: 1, max: 50000, defaultValue: 1000 }',
    '{ name: "friction", label: "Friction Coefficient", type: "number", min: 0.01, max: 1, defaultValue: 0.15 }',
  ],
  `(inputs) => {
      const mass = inputs.loadWeight as number;
      const pitch = inputs.leadScrew as number;
      const accel = inputs.acceleration as number;
      const mu = inputs.friction as number;
      if (!mass || !pitch || !accel || !mu) return null;
      const gravity = 9.81;
      const frictionForce = mass * gravity * mu;
      const accelForce = mass * accel / 1000;
      const totalForce = frictionForce + accelForce;
      const torqueNm = Math.round(totalForce * pitch / (2 * Math.PI * 1000) * 10000) / 10000;
      const torqueOzIn = Math.round(torqueNm * 141.612 * 10) / 10;
      const safetyTorque = Math.round(torqueNm * 2 * 10000) / 10000;
      return {
        primary: { label: "Required Torque", value: formatNumber(torqueOzIn) + " oz-in" },
        details: [
          { label: "Torque (Nm)", value: formatNumber(torqueNm) + " Nm" },
          { label: "With 2x Safety Factor", value: formatNumber(Math.round(safetyTorque * 141.612 * 10) / 10) + " oz-in" },
          { label: "Total Linear Force", value: formatNumber(Math.round(totalForce * 100) / 100) + " N" },
        ],
      };
  }`,
  [{ q: 'What safety factor should I use?', a: 'Use a 2x safety factor to ensure the motor handles peak loads.' },
   { q: 'Does speed affect torque?', a: 'Yes. Stepper motors lose torque as speed increases.' }],
  'Torque = Total Force x Pitch / (2 x PI x 1000)',
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch7.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch7.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch7.txt`);
console.log(`Registry saved to: scripts/new-regs-batch7.txt`);
