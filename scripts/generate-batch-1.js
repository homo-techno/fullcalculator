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

// === BATCH 1: 100 NEW CALCULATORS ===

// #1 Sunroom Cost
add('sunroom-cost-calculator', 'Sunroom Cost Calculator',
  'Estimate the cost of adding a sunroom to your home based on size, type, and materials.',
  'Everyday', 'everyday', '~',
  ['sunroom cost', 'sunroom addition cost', 'four season room cost'],
  [
    '{ name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 50, max: 1000, defaultValue: 200 }',
    '{ name: "type", label: "Sunroom Type", type: "select", options: [{value:"3season",label:"3-Season"},{value:"4season",label:"4-Season"},{value:"solarium",label:"Solarium"}], defaultValue: "3season" }',
    '{ name: "foundation", label: "Foundation Type", type: "select", options: [{value:"slab",label:"Concrete Slab"},{value:"pier",label:"Pier & Beam"},{value:"deck",label:"Existing Deck"}], defaultValue: "slab" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const type = inputs.type as string;
      const found = inputs.foundation as string;
      if (!sqft || sqft <= 0) return null;
      const rates: Record<string, number> = { "3season": 150, "4season": 250, "solarium": 350 };
      const foundCost: Record<string, number> = { slab: 15, pier: 20, deck: 5 };
      const base = sqft * (rates[type] || 200);
      const fCost = sqft * (foundCost[found] || 15);
      const permits = 1500;
      const total = base + fCost + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction", value: "$" + formatNumber(base) },
          { label: "Foundation", value: "$" + formatNumber(fCost) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per sq ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    }`,
  [{ q: 'How much does a sunroom cost?', a: 'A 3-season sunroom costs $100-200 per sq ft, while a 4-season room costs $200-400 per sq ft.' },
   { q: 'Does a sunroom add home value?', a: 'Yes, sunrooms typically return 50-80% of their cost in added home value.' }],
  'Total = (Sq Ft x Rate per Type) + Foundation Cost + Permits',
  ['screened-porch-calculator', 'pergola-cost-calculator']
);

// #2 Porch Build Cost
add('porch-cost-calculator', 'Porch Cost Calculator',
  'Calculate the cost to build or renovate a front or back porch including materials and labor.',
  'Everyday', 'everyday', '~',
  ['porch cost', 'porch building cost', 'front porch cost'],
  [
    '{ name: "sqft", label: "Porch Area", type: "number", suffix: "sq ft", min: 20, max: 800, defaultValue: 150 }',
    '{ name: "type", label: "Porch Type", type: "select", options: [{value:"open",label:"Open Porch"},{value:"covered",label:"Covered Porch"},{value:"wraparound",label:"Wraparound"}], defaultValue: "covered" }',
    '{ name: "material", label: "Decking Material", type: "select", options: [{value:"wood",label:"Pressure-Treated Wood"},{value:"composite",label:"Composite"},{value:"pvc",label:"PVC"}], defaultValue: "wood" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const type = inputs.type as string;
      const mat = inputs.material as string;
      if (!sqft || sqft <= 0) return null;
      const typeRate: Record<string, number> = { open: 30, covered: 60, wraparound: 50 };
      const matRate: Record<string, number> = { wood: 15, composite: 30, pvc: 35 };
      const labor = sqft * (typeRate[type] || 50);
      const materials = sqft * (matRate[mat] || 20);
      const railing = Math.sqrt(sqft) * 4 * 25;
      const total = labor + materials + railing;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Decking material", value: "$" + formatNumber(materials) },
          { label: "Railing estimate", value: "$" + formatNumber(railing) },
        ],
      };
    }`,
  [{ q: 'How much does a porch cost?', a: 'An open porch costs $15-30 per sq ft while a covered porch costs $40-80 per sq ft depending on materials.' },
   { q: 'What is the best porch material?', a: 'Composite decking is durable and low-maintenance but costs more. Pressure-treated wood is the most affordable option.' }],
  'Total = Labor + Materials + Railing',
  ['deck-cost-calculator', 'screened-porch-calculator']
);

// #3 Carport Cost
add('carport-cost-calculator', 'Carport Cost Calculator',
  'Estimate the cost of building a carport including materials, foundation, and installation.',
  'Everyday', 'everyday', '~',
  ['carport cost', 'carport building cost', 'metal carport cost'],
  [
    '{ name: "cars", label: "Number of Cars", type: "select", options: [{value:"1",label:"1 Car"},{value:"2",label:"2 Cars"},{value:"3",label:"3 Cars"}], defaultValue: "2" }',
    '{ name: "material", label: "Material", type: "select", options: [{value:"metal",label:"Metal/Steel"},{value:"wood",label:"Wood"},{value:"aluminum",label:"Aluminum"}], defaultValue: "metal" }',
    '{ name: "attached", label: "Attached to House?", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"Freestanding"}], defaultValue: "no" }',
  ],
  `(inputs) => {
      const cars = parseInt(inputs.cars as string) || 2;
      const mat = inputs.material as string;
      const attached = inputs.attached as string;
      const sqft = cars * 12 * 20;
      const matRate: Record<string, number> = { metal: 15, wood: 25, aluminum: 30 };
      const rate = matRate[mat] || 20;
      const base = sqft * rate;
      const attachMod = attached === "yes" ? 0.8 : 1.0;
      const foundation = sqft * 8;
      const total = base * attachMod + foundation;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Size", value: sqft + " sq ft (" + cars + " car)" },
          { label: "Structure", value: "$" + formatNumber(base * attachMod) },
          { label: "Foundation", value: "$" + formatNumber(foundation) },
        ],
      };
    }`,
  [{ q: 'How much does a carport cost?', a: 'A basic metal carport costs $3,000-$6,000 for a single car and $6,000-$12,000 for two cars.' },
   { q: 'Is a carport cheaper than a garage?', a: 'Yes, carports typically cost 50-70% less than an enclosed garage of the same size.' }],
  'Total = (Sq Ft x Material Rate x Attachment Modifier) + Foundation',
  ['garage-door-cost-calculator', 'driveway-cost-calculator']
);

// #4 French Drain Cost
add('french-drain-calculator', 'French Drain Cost Calculator',
  'Calculate the cost to install a French drain for yard drainage or basement waterproofing.',
  'Everyday', 'everyday', '~',
  ['french drain cost', 'yard drainage cost', 'french drain calculator'],
  [
    '{ name: "length", label: "Drain Length", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "depth", label: "Trench Depth", type: "number", suffix: "inches", min: 12, max: 48, defaultValue: 24 }',
    '{ name: "location", label: "Location", type: "select", options: [{value:"exterior",label:"Exterior/Yard"},{value:"interior",label:"Interior/Basement"},{value:"footer",label:"Footer Drain"}], defaultValue: "exterior" }',
  ],
  `(inputs) => {
      const len = inputs.length as number;
      const depth = inputs.depth as number;
      const loc = inputs.location as string;
      if (!len || len <= 0) return null;
      const rates: Record<string, number> = { exterior: 25, interior: 55, footer: 70 };
      const rate = rates[loc] || 30;
      const depthMod = depth > 24 ? 1.3 : 1.0;
      const labor = len * rate * depthMod;
      const gravel = len * 0.15 * 35;
      const pipe = len * 3;
      const fabric = len * 1.5;
      const total = labor + gravel + pipe + fabric;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Gravel", value: "$" + formatNumber(gravel) },
          { label: "Pipe", value: "$" + formatNumber(pipe) },
          { label: "Landscape fabric", value: "$" + formatNumber(fabric) },
          { label: "Cost per foot", value: "$" + formatNumber(total / len) },
        ],
      };
    }`,
  [{ q: 'How much does a French drain cost?', a: 'Exterior French drains cost $20-40 per linear foot. Interior basement drains cost $40-80 per foot.' },
   { q: 'How long does a French drain last?', a: 'A properly installed French drain lasts 30-40 years with minimal maintenance.' }],
  'Total = Labor + Gravel + Pipe + Fabric',
  ['gutter-cost-calculator', 'basement-finishing-calculator']
);

// #5 Artificial Turf Cost
add('artificial-turf-cost-calculator', 'Artificial Turf Cost Calculator',
  'Estimate the cost of installing artificial grass including materials, base prep, and labor.',
  'Everyday', 'everyday', '~',
  ['artificial turf cost', 'fake grass cost', 'synthetic lawn cost'],
  [
    '{ name: "sqft", label: "Area", type: "number", suffix: "sq ft", min: 50, max: 5000, defaultValue: 500 }',
    '{ name: "grade", label: "Turf Grade", type: "select", options: [{value:"economy",label:"Economy"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" }',
    '{ name: "base", label: "Base Prep Needed", type: "select", options: [{value:"minimal",label:"Minimal (flat area)"},{value:"standard",label:"Standard"},{value:"heavy",label:"Heavy (grading needed)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const grade = inputs.grade as string;
      const base = inputs.base as string;
      if (!sqft || sqft <= 0) return null;
      const turfRate: Record<string, number> = { economy: 3, mid: 6, premium: 10 };
      const baseRate: Record<string, number> = { minimal: 2, standard: 4, heavy: 7 };
      const turfCost = sqft * (turfRate[grade] || 6);
      const baseCost = sqft * (baseRate[base] || 4);
      const labor = sqft * 4;
      const infill = sqft * 0.75;
      const total = turfCost + baseCost + labor + infill;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Turf material", value: "$" + formatNumber(turfCost) },
          { label: "Base preparation", value: "$" + formatNumber(baseCost) },
          { label: "Installation labor", value: "$" + formatNumber(labor) },
          { label: "Infill", value: "$" + formatNumber(infill) },
          { label: "Cost per sq ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    }`,
  [{ q: 'How much does artificial turf cost?', a: 'Installed artificial turf costs $8-18 per sq ft depending on quality and base preparation needed.' },
   { q: 'How long does artificial turf last?', a: 'Quality artificial turf lasts 15-25 years with proper maintenance.' }],
  'Total = Turf Material + Base Prep + Labor + Infill',
  ['sod-cost-calculator', 'lawn-care-cost-calculator']
);

// #6 Home Theater Cost
add('home-theater-cost-calculator', 'Home Theater Cost Calculator',
  'Estimate the cost of building a dedicated home theater room including equipment, seating, and acoustic treatment.',
  'Finance', 'finance', '$',
  ['home theater cost', 'home cinema cost', 'theater room cost'],
  [
    '{ name: "roomSize", label: "Room Size", type: "select", options: [{value:"small",label:"Small (under 150 sq ft)"},{value:"medium",label:"Medium (150-300 sq ft)"},{value:"large",label:"Large (300+ sq ft)"}], defaultValue: "medium" }',
    '{ name: "tier", label: "Equipment Tier", type: "select", options: [{value:"budget",label:"Budget"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" }',
    '{ name: "seats", label: "Number of Seats", type: "number", suffix: "seats", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "acoustic", label: "Acoustic Treatment", type: "select", options: [{value:"none",label:"None"},{value:"basic",label:"Basic Panels"},{value:"full",label:"Full Treatment"}], defaultValue: "basic" }',
  ],
  `(inputs) => {
      const roomSize = inputs.roomSize as string;
      const tier = inputs.tier as string;
      const seats = inputs.seats as number;
      const acoustic = inputs.acoustic as string;
      if (!seats || seats <= 0) return null;
      const projectorCost: Record<string, number> = { budget: 800, mid: 2500, premium: 6000 };
      const audioCost: Record<string, number> = { budget: 1200, mid: 3500, premium: 8000 };
      const screenCost: Record<string, number> = { small: 300, medium: 500, large: 900 };
      const seatCost: Record<string, number> = { budget: 300, mid: 600, premium: 1200 };
      const acousticCost: Record<string, number> = { none: 0, basic: 800, full: 3000 };
      const roomPrepCost: Record<string, number> = { small: 1500, medium: 2500, large: 4000 };
      const projector = projectorCost[tier] || 2500;
      const audio = audioCost[tier] || 3500;
      const screen = screenCost[roomSize] || 500;
      const seating = seats * (seatCost[tier] || 600);
      const acoustics = acousticCost[acoustic] || 800;
      const roomPrep = roomPrepCost[roomSize] || 2500;
      const wiring = 500;
      const total = projector + audio + screen + seating + acoustics + roomPrep + wiring;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Projector/Display", value: "$" + formatNumber(projector) },
          { label: "Audio System", value: "$" + formatNumber(audio) },
          { label: "Screen", value: "$" + formatNumber(screen) },
          { label: "Seating", value: "$" + formatNumber(seating) },
          { label: "Acoustic Treatment", value: "$" + formatNumber(acoustics) },
          { label: "Room Prep and Wiring", value: "$" + formatNumber(roomPrep + wiring) },
        ],
      };
    }`,
  [{ q: 'How much does a home theater cost?', a: 'A budget home theater can cost $5,000 to $10,000, while a mid-range setup runs $10,000 to $25,000. Premium builds can exceed $50,000.' },
   { q: 'Is a home theater a good investment?', a: 'A well-designed home theater can add value to your home and provide years of entertainment. It is a worthwhile investment for movie and sports enthusiasts.' }],
  'Total = Projector + Audio + Screen + (Seats x Seat Cost) + Acoustics + Room Prep + Wiring',
  ['soundproofing-cost-calculator', 'basement-finishing-calculator']
);

// #7 Closet Remodel
add('closet-remodel-calculator', 'Closet Remodel Calculator',
  'Estimate the cost to remodel or build a walk-in closet with custom shelving and organization systems.',
  'Everyday', 'everyday', '~',
  ['closet remodel cost', 'walk-in closet cost', 'custom closet cost'],
  [
    '{ name: "sqft", label: "Closet Size", type: "number", suffix: "sq ft", min: 10, max: 200, defaultValue: 50 }',
    '{ name: "system", label: "Organization System", type: "select", options: [{value:"wire",label:"Wire Shelving"},{value:"laminate",label:"Laminate"},{value:"wood",label:"Solid Wood"}], defaultValue: "laminate" }',
    '{ name: "features", label: "Extra Features", type: "select", options: [{value:"basic",label:"Basic (shelves only)"},{value:"standard",label:"Standard (shelves + drawers)"},{value:"deluxe",label:"Deluxe (island, lighting, mirror)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const system = inputs.system as string;
      const features = inputs.features as string;
      if (!sqft || sqft <= 0) return null;
      const systemRate: Record<string, number> = { wire: 8, laminate: 20, wood: 45 };
      const featureCost: Record<string, number> = { basic: 200, standard: 800, deluxe: 2500 };
      const materialCost = sqft * (systemRate[system] || 20);
      const laborCost = sqft * 15;
      const extras = featureCost[features] || 800;
      const painting = sqft * 3;
      const total = materialCost + laborCost + extras + painting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Organization System", value: "$" + formatNumber(materialCost) },
          { label: "Installation Labor", value: "$" + formatNumber(laborCost) },
          { label: "Extra Features", value: "$" + formatNumber(extras) },
          { label: "Painting and Finishing", value: "$" + formatNumber(painting) },
        ],
      };
    }`,
  [{ q: 'How much does a closet remodel cost?', a: 'A basic closet remodel with wire shelving costs $500 to $1,500. Custom wood systems in a walk-in closet range from $2,000 to $8,000 or more.' },
   { q: 'What is the best closet organization system?', a: 'Laminate systems offer a good balance of durability, appearance, and cost. Solid wood is the most premium option but costs significantly more.' }],
  'Total = (Sq Ft x System Rate) + Labor + Features + Painting',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #8 Sauna Cost
add('sauna-cost-calculator', 'Sauna Cost Calculator',
  'Estimate the cost to install a home sauna including the unit, electrical work, and finishing.',
  'Everyday', 'everyday', '~',
  ['sauna cost', 'home sauna cost', 'sauna installation cost'],
  [
    '{ name: "type", label: "Sauna Type", type: "select", options: [{value:"prefab",label:"Prefab Kit"},{value:"custom",label:"Custom Built"},{value:"infrared",label:"Infrared"}], defaultValue: "prefab" }',
    '{ name: "size", label: "Capacity", type: "select", options: [{value:"2",label:"2 Person"},{value:"4",label:"4 Person"},{value:"6",label:"6 Person"}], defaultValue: "4" }',
    '{ name: "location", label: "Location", type: "select", options: [{value:"indoor",label:"Indoor"},{value:"outdoor",label:"Outdoor"}], defaultValue: "indoor" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const size = parseInt(inputs.size as string) || 4;
      const location = inputs.location as string;
      const baseCost: Record<string, number> = { prefab: 3000, custom: 8000, infrared: 2000 };
      const sizeMultiplier: Record<number, number> = { 2: 0.7, 4: 1.0, 6: 1.4 };
      const unitCost = (baseCost[type] || 3000) * (sizeMultiplier[size] || 1.0);
      const electrical = type === "infrared" ? 500 : 1500;
      const ventilation = 600;
      const finishing = location === "indoor" ? 1200 : 800;
      const delivery = 300;
      const total = unitCost + electrical + ventilation + finishing + delivery;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Sauna Unit", value: "$" + formatNumber(unitCost) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Ventilation", value: "$" + formatNumber(ventilation) },
          { label: "Finishing and Prep", value: "$" + formatNumber(finishing) },
          { label: "Delivery", value: "$" + formatNumber(delivery) },
        ],
      };
    }`,
  [{ q: 'How much does a home sauna cost?', a: 'An infrared sauna kit starts at $1,500 to $3,000. A prefab traditional sauna costs $3,000 to $6,000. Custom-built saunas range from $6,000 to $15,000 or more.' },
   { q: 'Is a home sauna worth it?', a: 'A home sauna can provide health benefits including stress relief, muscle recovery, and improved circulation. It can also increase your home value by $5,000 to $10,000.' }],
  'Total = Unit Cost x Size Multiplier + Electrical + Ventilation + Finishing + Delivery',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #9 Hot Tub Cost
add('hot-tub-cost-calculator', 'Hot Tub Cost Calculator',
  'Estimate the total cost of owning a hot tub including purchase, installation, and annual operating expenses.',
  'Everyday', 'everyday', '~',
  ['hot tub cost', 'spa cost', 'jacuzzi cost'],
  [
    '{ name: "tier", label: "Hot Tub Tier", type: "select", options: [{value:"entry",label:"Entry Level"},{value:"mid",label:"Mid-Range"},{value:"luxury",label:"Luxury"}], defaultValue: "mid" }',
    '{ name: "seats", label: "Seating Capacity", type: "select", options: [{value:"3",label:"2-3 Person"},{value:"5",label:"4-5 Person"},{value:"7",label:"6-7 Person"}], defaultValue: "5" }',
    '{ name: "electrical", label: "Electrical Setup", type: "select", options: [{value:"120v",label:"120V Plug-In"},{value:"240v",label:"240V Dedicated Circuit"}], defaultValue: "240v" }',
    '{ name: "base", label: "Base/Pad Needed", type: "select", options: [{value:"existing",label:"Existing Pad"},{value:"concrete",label:"New Concrete Pad"},{value:"gravel",label:"Gravel Pad"}], defaultValue: "concrete" }',
  ],
  `(inputs) => {
      const tier = inputs.tier as string;
      const seats = parseInt(inputs.seats as string) || 5;
      const electrical = inputs.electrical as string;
      const base = inputs.base as string;
      const tubCost: Record<string, number> = { entry: 3000, mid: 7000, luxury: 14000 };
      const seatMod: Record<number, number> = { 3: 0.8, 5: 1.0, 7: 1.3 };
      const elecCost: Record<string, number> = { "120v": 200, "240v": 1200 };
      const baseCost: Record<string, number> = { existing: 0, concrete: 1500, gravel: 500 };
      const tub = (tubCost[tier] || 7000) * (seatMod[seats] || 1.0);
      const elec = elecCost[electrical] || 1200;
      const pad = baseCost[base] || 1500;
      const cover = 300;
      const delivery = 250;
      const annualEnergy = 600;
      const annualChemicals = 300;
      const total = tub + elec + pad + cover + delivery;
      return {
        primary: { label: "Estimated Purchase and Install", value: "$" + formatNumber(total) },
        details: [
          { label: "Hot Tub Unit", value: "$" + formatNumber(tub) },
          { label: "Electrical Work", value: "$" + formatNumber(elec) },
          { label: "Base/Pad", value: "$" + formatNumber(pad) },
          { label: "Cover and Delivery", value: "$" + formatNumber(cover + delivery) },
          { label: "Est. Annual Energy Cost", value: "$" + formatNumber(annualEnergy) },
          { label: "Est. Annual Chemical Cost", value: "$" + formatNumber(annualChemicals) },
        ],
      };
    }`,
  [{ q: 'How much does a hot tub cost?', a: 'Entry-level hot tubs cost $3,000 to $5,000. Mid-range models run $6,000 to $10,000. Luxury hot tubs can cost $12,000 to $20,000 or more.' },
   { q: 'How much does it cost to run a hot tub monthly?', a: 'Monthly operating costs average $50 to $100 for electricity and $20 to $30 for chemicals, depending on usage and climate.' }],
  'Total = Tub Cost x Size Modifier + Electrical + Pad + Cover + Delivery',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #10 Wine Cellar Cost
add('wine-cellar-cost-calculator', 'Wine Cellar Cost Calculator',
  'Estimate the cost to build a residential wine cellar including racking, climate control, and construction.',
  'Everyday', 'everyday', '~',
  ['wine cellar cost', 'wine room cost', 'wine storage cost'],
  [
    '{ name: "bottles", label: "Bottle Capacity", type: "number", suffix: "bottles", min: 50, max: 5000, defaultValue: 500 }',
    '{ name: "racking", label: "Racking Material", type: "select", options: [{value:"metal",label:"Metal Racks"},{value:"wood",label:"Redwood/Mahogany"},{value:"custom",label:"Custom Cabinetry"}], defaultValue: "wood" }',
    '{ name: "cooling", label: "Cooling System", type: "select", options: [{value:"selfcontained",label:"Self-Contained Unit"},{value:"split",label:"Split System"},{value:"ducted",label:"Ducted System"}], defaultValue: "split" }',
    '{ name: "space", label: "Space Type", type: "select", options: [{value:"existing",label:"Existing Room/Closet"},{value:"basement",label:"Basement Conversion"},{value:"new",label:"New Construction"}], defaultValue: "basement" }',
  ],
  `(inputs) => {
      const bottles = inputs.bottles as number;
      const racking = inputs.racking as string;
      const cooling = inputs.cooling as string;
      const space = inputs.space as string;
      if (!bottles || bottles <= 0) return null;
      const rackRate: Record<string, number> = { metal: 2, wood: 5, custom: 12 };
      const coolingCost: Record<string, number> = { selfcontained: 1500, split: 3500, ducted: 6000 };
      const spaceCost: Record<string, number> = { existing: 2000, basement: 5000, new: 12000 };
      const rackCost = bottles * (rackRate[racking] || 5);
      const coolCost = coolingCost[cooling] || 3500;
      const construction = spaceCost[space] || 5000;
      const insulation = 1500;
      const door = 800;
      const lighting = 600;
      const total = rackCost + coolCost + construction + insulation + door + lighting;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Wine Racking", value: "$" + formatNumber(rackCost) },
          { label: "Cooling System", value: "$" + formatNumber(coolCost) },
          { label: "Construction", value: "$" + formatNumber(construction) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Door and Lighting", value: "$" + formatNumber(door + lighting) },
          { label: "Cost per Bottle Slot", value: "$" + formatNumber(total / bottles) },
        ],
      };
    }`,
  [{ q: 'How much does a wine cellar cost?', a: 'A small wine closet conversion costs $5,000 to $15,000. A full basement wine cellar typically ranges from $15,000 to $50,000 depending on size and finishes.' },
   { q: 'What temperature should a wine cellar be?', a: 'A wine cellar should maintain 55 degrees Fahrenheit with 60-70 percent humidity for optimal long-term wine storage.' }],
  'Total = (Bottles x Rack Rate) + Cooling + Construction + Insulation + Door + Lighting',
  ['sunroom-cost-calculator', 'carport-cost-calculator']
);

// #11 Home Gym Cost
add('home-gym-cost-calculator', 'Home Gym Cost Calculator',
  'Estimate the cost to set up a home gym including equipment, flooring, and room preparation.',
  'Health', 'health', 'H',
  ['home gym cost', 'home gym setup cost', 'garage gym cost'],
  [
    '{ name: "sqft", label: "Gym Space", type: "number", suffix: "sq ft", min: 50, max: 1000, defaultValue: 200 }',
    '{ name: "level", label: "Equipment Level", type: "select", options: [{value:"basic",label:"Basic (cardio + free weights)"},{value:"intermediate",label:"Intermediate (+ cable machine)"},{value:"advanced",label:"Advanced (full power rack setup)"}], defaultValue: "intermediate" }',
    '{ name: "flooring", label: "Flooring Type", type: "select", options: [{value:"mats",label:"Rubber Mats"},{value:"rolled",label:"Rolled Rubber"},{value:"tiles",label:"Interlocking Tiles"}], defaultValue: "tiles" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const level = inputs.level as string;
      const flooring = inputs.flooring as string;
      if (!sqft || sqft <= 0) return null;
      const equipCost: Record<string, number> = { basic: 2000, intermediate: 5000, advanced: 10000 };
      const floorRate: Record<string, number> = { mats: 2, rolled: 4, tiles: 5 };
      const equipment = equipCost[level] || 5000;
      const floorCost = sqft * (floorRate[flooring] || 4);
      const mirrors = 400;
      const ventilation = 300;
      const storage = 250;
      const total = equipment + floorCost + mirrors + ventilation + storage;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Equipment", value: "$" + formatNumber(equipment) },
          { label: "Flooring", value: "$" + formatNumber(floorCost) },
          { label: "Mirrors", value: "$" + formatNumber(mirrors) },
          { label: "Ventilation", value: "$" + formatNumber(ventilation) },
          { label: "Storage and Accessories", value: "$" + formatNumber(storage) },
        ],
      };
    }`,
  [{ q: 'How much does a home gym cost?', a: 'A basic home gym setup costs $2,000 to $5,000. An intermediate setup with a cable machine runs $5,000 to $10,000. A fully equipped gym can cost $10,000 to $20,000 or more.' },
   { q: 'What is the minimum space needed for a home gym?', a: 'A minimum of 100 square feet is recommended for a basic home gym. For a full power rack and cable machine setup, plan for at least 200 square feet.' }],
  'Total = Equipment + (Sq Ft x Floor Rate) + Mirrors + Ventilation + Storage',
  ['sunroom-cost-calculator', 'artificial-turf-cost-calculator']
);

// #12 Mudroom Cost
add('mudroom-cost-calculator', 'Mudroom Cost Calculator',
  'Estimate the cost to build or remodel a mudroom with storage, flooring, and built-in features.',
  'Everyday', 'everyday', '~',
  ['mudroom cost', 'mudroom remodel cost', 'mudroom addition cost'],
  [
    '{ name: "sqft", label: "Mudroom Size", type: "number", suffix: "sq ft", min: 20, max: 200, defaultValue: 60 }',
    '{ name: "scope", label: "Project Scope", type: "select", options: [{value:"remodel",label:"Remodel Existing Space"},{value:"addition",label:"New Addition"}], defaultValue: "remodel" }',
    '{ name: "builtins", label: "Built-In Features", type: "select", options: [{value:"basic",label:"Basic (hooks and shelf)"},{value:"standard",label:"Standard (cubbies and bench)"},{value:"custom",label:"Custom Cabinetry"}], defaultValue: "standard" }',
    '{ name: "floor", label: "Flooring", type: "select", options: [{value:"vinyl",label:"Luxury Vinyl"},{value:"tile",label:"Ceramic Tile"},{value:"slate",label:"Slate/Stone"}], defaultValue: "tile" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const scope = inputs.scope as string;
      const builtins = inputs.builtins as string;
      const floor = inputs.floor as string;
      if (!sqft || sqft <= 0) return null;
      const scopeRate: Record<string, number> = { remodel: 50, addition: 150 };
      const builtinCost: Record<string, number> = { basic: 500, standard: 1500, custom: 4000 };
      const floorRate: Record<string, number> = { vinyl: 6, tile: 12, slate: 20 };
      const construction = sqft * (scopeRate[scope] || 50);
      const cabinetry = builtinCost[builtins] || 1500;
      const flooring = sqft * (floorRate[floor] || 12);
      const electrical = 400;
      const painting = sqft * 3;
      const total = construction + cabinetry + flooring + electrical + painting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction", value: "$" + formatNumber(construction) },
          { label: "Built-In Features", value: "$" + formatNumber(cabinetry) },
          { label: "Flooring", value: "$" + formatNumber(flooring) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Painting", value: "$" + formatNumber(painting) },
        ],
      };
    }`,
  [{ q: 'How much does a mudroom cost?', a: 'Remodeling an existing space into a mudroom costs $2,000 to $8,000. Adding a new mudroom addition costs $10,000 to $25,000 depending on size and finishes.' },
   { q: 'Does a mudroom add home value?', a: 'Yes, a well-designed mudroom can add $5,000 to $10,000 in home value and is a highly desirable feature for buyers in colder climates.' }],
  'Total = (Sq Ft x Scope Rate) + Built-Ins + Flooring + Electrical + Painting',
  ['porch-cost-calculator', 'sunroom-cost-calculator']
);

// #13 Dog Fence Cost
add('dog-fence-cost-calculator', 'Dog Fence Cost Calculator',
  'Estimate the cost of installing an invisible or wireless dog fence system for your yard.',
  'Everyday', 'everyday', '~',
  ['dog fence cost', 'invisible fence cost', 'wireless dog fence cost'],
  [
    '{ name: "type", label: "Fence Type", type: "select", options: [{value:"wireless",label:"Wireless"},{value:"inground",label:"In-Ground Wire"},{value:"gps",label:"GPS Collar System"}], defaultValue: "inground" }',
    '{ name: "area", label: "Yard Area", type: "number", suffix: "sq ft", min: 500, max: 50000, defaultValue: 5000 }',
    '{ name: "dogs", label: "Number of Dogs", type: "number", suffix: "dogs", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const area = inputs.area as number;
      const dogs = inputs.dogs as number;
      if (!area || area <= 0 || !dogs || dogs <= 0) return null;
      const perimeter = Math.sqrt(area) * 4;
      const baseCost: Record<string, number> = { wireless: 300, inground: 200, gps: 0 };
      const perFootCost: Record<string, number> = { wireless: 0, inground: 1.5, gps: 0 };
      const collarCost: Record<string, number> = { wireless: 100, inground: 75, gps: 400 };
      const installCost: Record<string, number> = { wireless: 100, inground: 500, gps: 0 };
      const base = baseCost[type] || 200;
      const wireCost = perimeter * (perFootCost[type] || 0);
      const collars = dogs * (collarCost[type] || 100);
      const install = installCost[type] || 200;
      const training = 200;
      const total = base + wireCost + collars + install + training;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Base System", value: "$" + formatNumber(base) },
          { label: "Wire/Perimeter", value: "$" + formatNumber(wireCost) },
          { label: "Collars (" + dogs + ")", value: "$" + formatNumber(collars) },
          { label: "Installation", value: "$" + formatNumber(install) },
          { label: "Training", value: "$" + formatNumber(training) },
          { label: "Est. Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
        ],
      };
    }`,
  [{ q: 'How much does an invisible dog fence cost?', a: 'A DIY in-ground fence system costs $200 to $500. Professional installation runs $1,000 to $2,500 depending on yard size. Wireless systems cost $300 to $600.' },
   { q: 'Do invisible fences work for all dogs?', a: 'Invisible fences work well for most dogs when combined with proper training. They may not be suitable for very stubborn breeds or dogs with high prey drive.' }],
  'Total = Base System + Wire Cost + (Dogs x Collar Cost) + Installation + Training',
  ['artificial-turf-cost-calculator', 'french-drain-calculator']
);

// #14 Chicken Run Cost
add('chicken-run-calculator', 'Chicken Run Cost Calculator',
  'Estimate the cost to build an outdoor chicken run enclosure for your backyard flock.',
  'Everyday', 'everyday', '~',
  ['chicken run cost', 'chicken enclosure cost', 'poultry run cost'],
  [
    '{ name: "chickens", label: "Number of Chickens", type: "number", suffix: "chickens", min: 2, max: 50, defaultValue: 6 }',
    '{ name: "material", label: "Frame Material", type: "select", options: [{value:"wood",label:"Pressure-Treated Wood"},{value:"metal",label:"Metal/Steel Pipe"},{value:"pvc",label:"PVC Pipe"}], defaultValue: "wood" }',
    '{ name: "covered", label: "Roof Type", type: "select", options: [{value:"open",label:"Open Top (netting)"},{value:"partial",label:"Partially Covered"},{value:"full",label:"Fully Roofed"}], defaultValue: "partial" }',
  ],
  `(inputs) => {
      const chickens = inputs.chickens as number;
      const material = inputs.material as string;
      const covered = inputs.covered as string;
      if (!chickens || chickens <= 0) return null;
      const sqftPerChicken = 10;
      const totalSqft = chickens * sqftPerChicken;
      const perimeter = Math.sqrt(totalSqft) * 4;
      const frameRate: Record<string, number> = { wood: 8, metal: 12, pvc: 5 };
      const roofCost: Record<string, number> = { open: 1, partial: 3, full: 6 };
      const frameCost = perimeter * (frameRate[material] || 8);
      const wireMesh = perimeter * 6 * 2;
      const roof = totalSqft * (roofCost[covered] || 3);
      const hardware = 100;
      const gate = 75;
      const total = frameCost + wireMesh + roof + hardware + gate;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Run Size", value: formatNumber(totalSqft) + " sq ft" },
          { label: "Frame Material", value: "$" + formatNumber(frameCost) },
          { label: "Wire Mesh/Fencing", value: "$" + formatNumber(wireMesh) },
          { label: "Roof/Cover", value: "$" + formatNumber(roof) },
          { label: "Hardware and Gate", value: "$" + formatNumber(hardware + gate) },
        ],
      };
    }`,
  [{ q: 'How much space does each chicken need in a run?', a: 'Each chicken needs a minimum of 10 square feet of outdoor run space. More space reduces stress and improves egg production.' },
   { q: 'How much does a chicken run cost?', a: 'A basic DIY chicken run for 6 chickens costs $200 to $600. A professionally built, fully covered run can cost $1,000 to $3,000.' }],
  'Total = Frame Cost + Wire Mesh + Roof + Hardware + Gate',
  ['artificial-turf-cost-calculator', 'french-drain-calculator']
);

// #15 Pizza Oven Cost
add('pizza-oven-cost-calculator', 'Pizza Oven Cost Calculator',
  'Estimate the cost of buying or building an outdoor pizza oven for your backyard.',
  'Everyday', 'everyday', '~',
  ['pizza oven cost', 'outdoor pizza oven cost', 'brick oven cost'],
  [
    '{ name: "type", label: "Oven Type", type: "select", options: [{value:"portable",label:"Portable (Ooni-style)"},{value:"prefab",label:"Prefab Kit"},{value:"custom",label:"Custom Brick/Stone"}], defaultValue: "prefab" }',
    '{ name: "fuel", label: "Fuel Type", type: "select", options: [{value:"wood",label:"Wood Fired"},{value:"gas",label:"Gas"},{value:"dual",label:"Dual Fuel"}], defaultValue: "wood" }',
    '{ name: "base", label: "Base/Stand", type: "select", options: [{value:"table",label:"Portable Table"},{value:"block",label:"Cinder Block Base"},{value:"stone",label:"Stone/Brick Counter"}], defaultValue: "block" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const fuel = inputs.fuel as string;
      const base = inputs.base as string;
      const ovenCost: Record<string, number> = { portable: 500, prefab: 2500, custom: 6000 };
      const fuelMod: Record<string, number> = { wood: 1.0, gas: 1.1, dual: 1.25 };
      const baseCost: Record<string, number> = { table: 100, block: 400, stone: 2000 };
      const oven = (ovenCost[type] || 2500) * (fuelMod[fuel] || 1.0);
      const stand = baseCost[base] || 400;
      const chimney = type === "custom" ? 800 : type === "prefab" ? 300 : 0;
      const tools = 150;
      const total = oven + stand + chimney + tools;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Oven Unit", value: "$" + formatNumber(oven) },
          { label: "Base/Stand", value: "$" + formatNumber(stand) },
          { label: "Chimney/Flue", value: "$" + formatNumber(chimney) },
          { label: "Tools and Accessories", value: "$" + formatNumber(tools) },
        ],
      };
    }`,
  [{ q: 'How much does an outdoor pizza oven cost?', a: 'Portable pizza ovens cost $300 to $800. Prefab kits run $2,000 to $5,000. Custom brick ovens can cost $5,000 to $15,000 including the base and chimney.' },
   { q: 'Is a pizza oven worth the investment?', a: 'A pizza oven can reach 800-900 degrees Fahrenheit and cook pizza in 60-90 seconds. It is an excellent investment for outdoor entertaining and cooking enthusiasts.' }],
  'Total = (Oven Cost x Fuel Modifier) + Base + Chimney + Tools',
  ['porch-cost-calculator', 'sunroom-cost-calculator']
);

// #16 Outdoor Kitchen Cost
add('outdoor-kitchen-cost-calculator', 'Outdoor Kitchen Cost Calculator',
  'Estimate the cost of building an outdoor kitchen with appliances, countertops, and utilities.',
  'Everyday', 'everyday', '~',
  ['outdoor kitchen cost', 'outdoor kitchen build cost', 'backyard kitchen cost'],
  [
    '{ name: "length", label: "Counter Length", type: "number", suffix: "linear ft", min: 4, max: 30, defaultValue: 10 }',
    '{ name: "tier", label: "Quality Tier", type: "select", options: [{value:"basic",label:"Basic (grill + counter)"},{value:"mid",label:"Mid (+ sink, fridge)"},{value:"premium",label:"Premium (+ pizza oven, bar)"}], defaultValue: "mid" }',
    '{ name: "counter", label: "Countertop Material", type: "select", options: [{value:"tile",label:"Tile"},{value:"granite",label:"Granite"},{value:"concrete",label:"Concrete"}], defaultValue: "granite" }',
    '{ name: "roof", label: "Overhead Cover", type: "select", options: [{value:"none",label:"No Cover"},{value:"pergola",label:"Pergola"},{value:"solid",label:"Solid Roof"}], defaultValue: "pergola" }',
  ],
  `(inputs) => {
      const length = inputs.length as number;
      const tier = inputs.tier as string;
      const counter = inputs.counter as string;
      const roof = inputs.roof as string;
      if (!length || length <= 0) return null;
      const applianceCost: Record<string, number> = { basic: 2000, mid: 5000, premium: 12000 };
      const counterRate: Record<string, number> = { tile: 40, granite: 80, concrete: 60 };
      const baseCost = length * 300;
      const appliances = applianceCost[tier] || 5000;
      const counterCost = length * 2.5 * (counterRate[counter] || 80);
      const roofCost: Record<string, number> = { none: 0, pergola: 3000, solid: 7000 };
      const roofing = roofCost[roof] || 0;
      const plumbing = tier === "basic" ? 0 : 1500;
      const gas = 800;
      const electrical = 600;
      const total = baseCost + appliances + counterCost + roofing + plumbing + gas + electrical;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Base Structure", value: "$" + formatNumber(baseCost) },
          { label: "Appliances", value: "$" + formatNumber(appliances) },
          { label: "Countertops", value: "$" + formatNumber(counterCost) },
          { label: "Overhead Cover", value: "$" + formatNumber(roofing) },
          { label: "Plumbing", value: "$" + formatNumber(plumbing) },
          { label: "Gas and Electrical", value: "$" + formatNumber(gas + electrical) },
        ],
      };
    }`,
  [{ q: 'How much does an outdoor kitchen cost?', a: 'A basic outdoor kitchen with a grill and counter costs $5,000 to $12,000. A mid-range setup runs $12,000 to $30,000. Premium outdoor kitchens can exceed $50,000.' },
   { q: 'Does an outdoor kitchen add home value?', a: 'An outdoor kitchen can increase home value by 100 to 200 percent of the investment cost, making it one of the best outdoor improvement returns.' }],
  'Total = Base Structure + Appliances + Countertops + Cover + Plumbing + Gas + Electrical',
  ['porch-cost-calculator', 'sunroom-cost-calculator']
);

// #17 Fire Pit Cost
add('fire-pit-cost-calculator', 'Fire Pit Cost Calculator',
  'Estimate the cost to build or install a fire pit in your backyard including materials and labor.',
  'Everyday', 'everyday', '~',
  ['fire pit cost', 'fire pit build cost', 'backyard fire pit cost'],
  [
    '{ name: "type", label: "Fire Pit Type", type: "select", options: [{value:"prefab",label:"Prefab/Kit"},{value:"stone",label:"Custom Stone/Brick"},{value:"gasline",label:"Gas Fire Pit"},{value:"table",label:"Fire Pit Table"}], defaultValue: "stone" }',
    '{ name: "size", label: "Diameter", type: "select", options: [{value:"small",label:"Small (30 in)"},{value:"medium",label:"Medium (42 in)"},{value:"large",label:"Large (54 in)"}], defaultValue: "medium" }',
    '{ name: "seating", label: "Seating Area", type: "select", options: [{value:"none",label:"No Built-In Seating"},{value:"wall",label:"Seating Wall"},{value:"bench",label:"Built-In Benches"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const size = inputs.size as string;
      const seating = inputs.seating as string;
      const baseCost: Record<string, number> = { prefab: 300, stone: 1500, gasline: 2500, table: 1200 };
      const sizeMod: Record<string, number> = { small: 0.8, medium: 1.0, large: 1.4 };
      const seatCost: Record<string, number> = { none: 0, wall: 1500, bench: 2500 };
      const pit = (baseCost[type] || 1500) * (sizeMod[size] || 1.0);
      const seats = seatCost[seating] || 0;
      const gasLine = type === "gasline" ? 800 : 0;
      const labor = type === "prefab" ? 200 : 800;
      const gravel = 200;
      const total = pit + seats + gasLine + labor + gravel;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Fire Pit", value: "$" + formatNumber(pit) },
          { label: "Seating", value: "$" + formatNumber(seats) },
          { label: "Gas Line", value: "$" + formatNumber(gasLine) },
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Gravel/Base", value: "$" + formatNumber(gravel) },
        ],
      };
    }`,
  [{ q: 'How much does a fire pit cost?', a: 'A prefab fire pit kit costs $200 to $500. A custom stone or brick fire pit costs $1,000 to $3,000. Gas fire pits run $2,000 to $5,000 with gas line installation.' },
   { q: 'Do you need a permit for a fire pit?', a: 'Many municipalities require a permit for permanent fire pits. Check local codes for setback requirements, typically 10-25 feet from structures.' }],
  'Total = (Pit Cost x Size Modifier) + Seating + Gas Line + Labor + Gravel',
  ['porch-cost-calculator', 'artificial-turf-cost-calculator']
);

// #18 Home Elevator Cost
add('home-elevator-cost-calculator', 'Home Elevator Cost Calculator',
  'Estimate the cost of installing a residential elevator including the unit, shaft construction, and permits.',
  'Everyday', 'everyday', '~',
  ['home elevator cost', 'residential elevator cost', 'house elevator cost'],
  [
    '{ name: "type", label: "Elevator Type", type: "select", options: [{value:"hydraulic",label:"Hydraulic"},{value:"traction",label:"Traction/Cable"},{value:"pneumatic",label:"Pneumatic (Vacuum)"}], defaultValue: "hydraulic" }',
    '{ name: "floors", label: "Number of Floors", type: "select", options: [{value:"2",label:"2 Floors"},{value:"3",label:"3 Floors"},{value:"4",label:"4 Floors"}], defaultValue: "2" }',
    '{ name: "finish", label: "Cab Finish", type: "select", options: [{value:"standard",label:"Standard"},{value:"custom",label:"Custom Wood"},{value:"luxury",label:"Luxury (glass/steel)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const floors = parseInt(inputs.floors as string) || 2;
      const finish = inputs.finish as string;
      const unitCost: Record<string, number> = { hydraulic: 30000, traction: 25000, pneumatic: 35000 };
      const floorAdd: Record<string, number> = { hydraulic: 10000, traction: 8000, pneumatic: 12000 };
      const finishCost: Record<string, number> = { standard: 0, custom: 5000, luxury: 15000 };
      const base = unitCost[type] || 30000;
      const extraFloors = (floors - 2) * (floorAdd[type] || 10000);
      const cab = finishCost[finish] || 0;
      const shaft = floors * 8000;
      const electrical = 3000;
      const permits = 2000;
      const total = base + extraFloors + cab + shaft + electrical + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Elevator Unit", value: "$" + formatNumber(base + extraFloors) },
          { label: "Cab Finish Upgrade", value: "$" + formatNumber(cab) },
          { label: "Shaft Construction", value: "$" + formatNumber(shaft) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Permits and Inspection", value: "$" + formatNumber(permits) },
        ],
      };
    }`,
  [{ q: 'How much does a home elevator cost?', a: 'A residential elevator typically costs $30,000 to $70,000 installed. Pneumatic vacuum elevators cost $35,000 to $60,000. Luxury custom elevators can exceed $100,000.' },
   { q: 'Does a home elevator add property value?', a: 'A home elevator can increase property value by 10 percent and makes the home accessible to aging-in-place residents and buyers with mobility needs.' }],
  'Total = Elevator Unit + Extra Floors + Cab Finish + Shaft + Electrical + Permits',
  ['sunroom-cost-calculator', 'carport-cost-calculator']
);

// #19 Storm Shelter Cost
add('storm-shelter-cost-calculator', 'Storm Shelter Cost Calculator',
  'Estimate the cost of installing a tornado or storm shelter for your home.',
  'Everyday', 'everyday', '~',
  ['storm shelter cost', 'tornado shelter cost', 'safe room cost'],
  [
    '{ name: "type", label: "Shelter Type", type: "select", options: [{value:"underground",label:"Underground (in-ground)"},{value:"aboveground",label:"Above-Ground Safe Room"},{value:"garage",label:"Garage Floor Unit"}], defaultValue: "underground" }',
    '{ name: "capacity", label: "Capacity", type: "select", options: [{value:"4",label:"2-4 People"},{value:"8",label:"6-8 People"},{value:"12",label:"10-12 People"}], defaultValue: "4" }',
    '{ name: "material", label: "Material", type: "select", options: [{value:"steel",label:"Steel"},{value:"concrete",label:"Reinforced Concrete"},{value:"fiberglass",label:"Fiberglass"}], defaultValue: "steel" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const capacity = parseInt(inputs.capacity as string) || 4;
      const material = inputs.material as string;
      const baseCost: Record<string, number> = { underground: 4000, aboveground: 5000, garage: 3500 };
      const capacityMod: Record<number, number> = { 4: 1.0, 8: 1.5, 12: 2.0 };
      const matMod: Record<string, number> = { steel: 1.0, concrete: 1.3, fiberglass: 0.9 };
      const base = (baseCost[type] || 4000) * (capacityMod[capacity] || 1.0) * (matMod[material] || 1.0);
      const installation = type === "underground" ? 2500 : 1000;
      const permits = 500;
      const ventilation = 300;
      const total = base + installation + permits + ventilation;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Shelter Unit", value: "$" + formatNumber(base) },
          { label: "Installation/Excavation", value: "$" + formatNumber(installation) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Ventilation System", value: "$" + formatNumber(ventilation) },
        ],
      };
    }`,
  [{ q: 'How much does a storm shelter cost?', a: 'Underground storm shelters cost $3,000 to $10,000 installed. Above-ground safe rooms cost $5,000 to $15,000. FEMA grants may cover part of the cost in eligible areas.' },
   { q: 'What is the safest type of storm shelter?', a: 'Underground shelters and reinforced concrete above-ground safe rooms are both rated for EF5 tornadoes. Underground shelters are generally considered the safest option.' }],
  'Total = (Base Cost x Capacity Mod x Material Mod) + Installation + Permits + Ventilation',
  ['carport-cost-calculator', 'french-drain-calculator']
);

// #20 Backup Generator Cost
add('backup-generator-cost-calculator', 'Backup Generator Cost Calculator',
  'Estimate the cost of a whole-home backup generator including installation and transfer switch.',
  'Everyday', 'everyday', '~',
  ['backup generator cost', 'whole home generator cost', 'standby generator cost'],
  [
    '{ name: "kw", label: "Generator Size", type: "select", options: [{value:"10",label:"10 kW (essentials)"},{value:"16",label:"16 kW (most circuits)"},{value:"22",label:"22 kW (whole home)"},{value:"30",label:"30+ kW (large home)"}], defaultValue: "22" }',
    '{ name: "fuel", label: "Fuel Type", type: "select", options: [{value:"natural",label:"Natural Gas"},{value:"propane",label:"Propane"},{value:"diesel",label:"Diesel"}], defaultValue: "natural" }',
    '{ name: "pad", label: "Installation Base", type: "select", options: [{value:"existing",label:"Existing Concrete Pad"},{value:"new",label:"New Concrete Pad"},{value:"gravel",label:"Gravel Pad"}], defaultValue: "new" }',
  ],
  `(inputs) => {
      const kw = parseInt(inputs.kw as string) || 22;
      const fuel = inputs.fuel as string;
      const pad = inputs.pad as string;
      const unitCost: Record<number, number> = { 10: 3000, 16: 4500, 22: 5500, 30: 8000 };
      const fuelMod: Record<string, number> = { natural: 1.0, propane: 1.1, diesel: 1.2 };
      const padCost: Record<string, number> = { existing: 0, new: 800, gravel: 300 };
      const generator = (unitCost[kw] || 5500) * (fuelMod[fuel] || 1.0);
      const transferSwitch = 1200;
      const electrical = 1500;
      const gasLine = fuel === "natural" ? 800 : fuel === "propane" ? 1200 : 0;
      const base = padCost[pad] || 800;
      const permits = 400;
      const total = generator + transferSwitch + electrical + gasLine + base + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Generator Unit (" + kw + " kW)", value: "$" + formatNumber(generator) },
          { label: "Transfer Switch", value: "$" + formatNumber(transferSwitch) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Fuel Line", value: "$" + formatNumber(gasLine) },
          { label: "Pad/Base", value: "$" + formatNumber(base) },
          { label: "Permits", value: "$" + formatNumber(permits) },
        ],
      };
    }`,
  [{ q: 'How much does a whole-home generator cost?', a: 'A standby generator costs $5,000 to $15,000 installed. A 22 kW unit that powers a whole home typically costs $8,000 to $12,000 with installation.' },
   { q: 'What size generator do I need for my house?', a: 'A 10 kW generator covers essential circuits. A 16-22 kW unit powers most or all of a typical home. Large homes with central AC may need 30 kW or more.' }],
  'Total = (Unit Cost x Fuel Mod) + Transfer Switch + Electrical + Fuel Line + Pad + Permits',
  ['carport-cost-calculator', 'french-drain-calculator']
);

// #21 Home Security Cost
add('home-security-cost-calculator', 'Home Security Cost Calculator',
  'Estimate the cost of a home security system including equipment, installation, and monitoring.',
  'Everyday', 'everyday', '~',
  ['home security cost', 'security system cost', 'home alarm cost'],
  [
    '{ name: "type", label: "System Type", type: "select", options: [{value:"diy",label:"DIY Wireless"},{value:"professional",label:"Professional Install"},{value:"smart",label:"Smart Home Integrated"}], defaultValue: "professional" }',
    '{ name: "cameras", label: "Number of Cameras", type: "number", suffix: "cameras", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "sensors", label: "Door/Window Sensors", type: "number", suffix: "sensors", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "monitoring", label: "Monitoring Plan", type: "select", options: [{value:"self",label:"Self-Monitoring"},{value:"basic",label:"Basic ($20/mo)"},{value:"premium",label:"Premium ($40/mo)"}], defaultValue: "basic" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const cameras = inputs.cameras as number;
      const sensors = inputs.sensors as number;
      const monitoring = inputs.monitoring as string;
      if (sensors < 0 || cameras < 0) return null;
      const panelCost: Record<string, number> = { diy: 200, professional: 400, smart: 600 };
      const cameraRate: Record<string, number> = { diy: 80, professional: 150, smart: 200 };
      const sensorRate: Record<string, number> = { diy: 20, professional: 30, smart: 40 };
      const installCost: Record<string, number> = { diy: 0, professional: 200, smart: 300 };
      const monthlyRate: Record<string, number> = { self: 0, basic: 20, premium: 40 };
      const panel = panelCost[type] || 400;
      const cams = cameras * (cameraRate[type] || 150);
      const sens = sensors * (sensorRate[type] || 30);
      const install = installCost[type] || 200;
      const monthly = monthlyRate[monitoring] || 20;
      const annual = monthly * 12;
      const upfront = panel + cams + sens + install;
      const threeYear = upfront + (annual * 3);
      return {
        primary: { label: "Upfront Equipment Cost", value: "$" + formatNumber(upfront) },
        details: [
          { label: "Control Panel", value: "$" + formatNumber(panel) },
          { label: "Cameras (" + cameras + ")", value: "$" + formatNumber(cams) },
          { label: "Sensors (" + sensors + ")", value: "$" + formatNumber(sens) },
          { label: "Installation", value: "$" + formatNumber(install) },
          { label: "Monthly Monitoring", value: "$" + formatNumber(monthly) + "/mo" },
          { label: "3-Year Total Cost", value: "$" + formatNumber(threeYear) },
        ],
      };
    }`,
  [{ q: 'How much does a home security system cost?', a: 'A DIY system costs $200 to $600 upfront. Professional systems cost $500 to $1,500 plus $20 to $50 per month for monitoring. Smart integrated systems cost $800 to $2,500.' },
   { q: 'Is professional monitoring worth it?', a: 'Professional monitoring provides 24/7 dispatch services and can lower homeowner insurance premiums by 5 to 20 percent, which can offset the monthly cost over time.' }],
  'Upfront = Panel + (Cameras x Rate) + (Sensors x Rate) + Installation; 3-Year = Upfront + (Monthly x 36)',
  ['carport-cost-calculator', 'sunroom-cost-calculator']
);

// #22 Smart Home Cost
add('smart-home-cost-calculator', 'Smart Home Cost Calculator',
  'Estimate the cost of automating your home with smart devices, hubs, and installation.',
  'Everyday', 'everyday', '~',
  ['smart home cost', 'home automation cost', 'smart home setup cost'],
  [
    '{ name: "rooms", label: "Number of Rooms", type: "number", suffix: "rooms", min: 1, max: 20, defaultValue: 6 }',
    '{ name: "tier", label: "Automation Level", type: "select", options: [{value:"basic",label:"Basic (lights + thermostat)"},{value:"mid",label:"Mid (+ locks, speakers)"},{value:"full",label:"Full (+ shades, sensors, hub)"}], defaultValue: "mid" }',
    '{ name: "install", label: "Installation", type: "select", options: [{value:"diy",label:"DIY Setup"},{value:"pro",label:"Professional Install"}], defaultValue: "diy" }',
  ],
  `(inputs) => {
      const rooms = inputs.rooms as number;
      const tier = inputs.tier as string;
      const install = inputs.install as string;
      if (!rooms || rooms <= 0) return null;
      const lightPerRoom = 2;
      const bulbCost = 15;
      const thermostat: Record<string, number> = { basic: 200, mid: 250, full: 300 };
      const lockCost: Record<string, number> = { basic: 0, mid: 200, full: 200 };
      const speakerCost: Record<string, number> = { basic: 0, mid: 50, full: 50 };
      const shadeCost: Record<string, number> = { basic: 0, mid: 0, full: 200 };
      const hubCost: Record<string, number> = { basic: 50, mid: 100, full: 300 };
      const lights = rooms * lightPerRoom * bulbCost;
      const therm = thermostat[tier] || 250;
      const locks = (lockCost[tier] || 0) * 2;
      const speakers = rooms * (speakerCost[tier] || 0);
      const shades = rooms * (shadeCost[tier] || 0);
      const hub = hubCost[tier] || 100;
      const installCost = install === "pro" ? rooms * 100 + 300 : 0;
      const total = lights + therm + locks + speakers + shades + hub + installCost;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Smart Lighting", value: "$" + formatNumber(lights) },
          { label: "Smart Thermostat", value: "$" + formatNumber(therm) },
          { label: "Smart Locks", value: "$" + formatNumber(locks) },
          { label: "Smart Speakers", value: "$" + formatNumber(speakers) },
          { label: "Smart Shades", value: "$" + formatNumber(shades) },
          { label: "Hub/Controller", value: "$" + formatNumber(hub) },
          { label: "Installation", value: "$" + formatNumber(installCost) },
        ],
      };
    }`,
  [{ q: 'How much does a smart home cost?', a: 'A basic smart home setup with lighting and thermostat costs $300 to $800. A mid-range setup with locks and speakers runs $1,000 to $3,000. Full automation can cost $3,000 to $10,000 or more.' },
   { q: 'What is the best smart home platform?', a: 'Popular platforms include Apple HomeKit, Google Home, and Amazon Alexa. Matter is a newer protocol that works across all platforms for broader device compatibility.' }],
  'Total = Lighting + Thermostat + Locks + Speakers + Shades + Hub + Installation',
  ['sunroom-cost-calculator', 'carport-cost-calculator']
);

// #23 Soundproofing Cost
add('soundproofing-cost-calculator', 'Soundproofing Cost Calculator',
  'Estimate the cost to soundproof a room including materials, labor, and acoustic treatments.',
  'Everyday', 'everyday', '~',
  ['soundproofing cost', 'room soundproofing cost', 'sound insulation cost'],
  [
    '{ name: "sqft", label: "Room Size (Wall Area)", type: "number", suffix: "sq ft", min: 50, max: 2000, defaultValue: 400 }',
    '{ name: "level", label: "Soundproofing Level", type: "select", options: [{value:"basic",label:"Basic (weatherstripping + caulk)"},{value:"moderate",label:"Moderate (+ mass loaded vinyl)"},{value:"full",label:"Full (+ double drywall + isolation)"}], defaultValue: "moderate" }',
    '{ name: "surfaces", label: "Surfaces to Treat", type: "select", options: [{value:"walls",label:"Walls Only"},{value:"wallsceiling",label:"Walls + Ceiling"},{value:"all",label:"Walls + Ceiling + Floor"}], defaultValue: "wallsceiling" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const level = inputs.level as string;
      const surfaces = inputs.surfaces as string;
      if (!sqft || sqft <= 0) return null;
      const levelRate: Record<string, number> = { basic: 3, moderate: 8, full: 18 };
      const surfaceMod: Record<string, number> = { walls: 1.0, wallsceiling: 1.4, all: 1.8 };
      const materialCost = sqft * (levelRate[level] || 8) * (surfaceMod[surfaces] || 1.4);
      const labor = sqft * 5 * (surfaceMod[surfaces] || 1.4);
      const door = 300;
      const sealant = 150;
      const total = materialCost + labor + door + sealant;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Soundproofing Materials", value: "$" + formatNumber(materialCost) },
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Solid Core Door", value: "$" + formatNumber(door) },
          { label: "Sealant and Weatherstripping", value: "$" + formatNumber(sealant) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to soundproof a room?', a: 'Basic soundproofing costs $1 to $5 per square foot. Moderate treatment with mass loaded vinyl runs $5 to $12 per square foot. Full soundproofing with double drywall and isolation clips costs $15 to $30 per square foot.' },
   { q: 'What is the most effective soundproofing method?', a: 'The most effective approach combines mass (double drywall), decoupling (isolation clips), damping (Green Glue), and absorption (insulation). No single method works as well as a layered approach.' }],
  'Total = (Sq Ft x Level Rate x Surface Modifier) + Labor + Door + Sealant',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #24 Home Office Build
add('home-office-build-calculator', 'Home Office Build Calculator',
  'Estimate the cost of building a dedicated home office space including furniture, technology, and finishing.',
  'Everyday', 'everyday', '~',
  ['home office cost', 'home office build cost', 'home office setup cost'],
  [
    '{ name: "sqft", label: "Office Size", type: "number", suffix: "sq ft", min: 40, max: 400, defaultValue: 120 }',
    '{ name: "scope", label: "Project Scope", type: "select", options: [{value:"convert",label:"Convert Existing Room"},{value:"partition",label:"Add Partition/Wall"},{value:"addition",label:"New Addition"}], defaultValue: "convert" }',
    '{ name: "furniture", label: "Furniture Level", type: "select", options: [{value:"basic",label:"Basic (desk + chair)"},{value:"mid",label:"Mid (+ shelves, filing)"},{value:"premium",label:"Premium (built-in cabinetry)"}], defaultValue: "mid" }',
    '{ name: "tech", label: "Technology Setup", type: "select", options: [{value:"minimal",label:"Minimal (outlets only)"},{value:"standard",label:"Standard (ethernet + outlets)"},{value:"advanced",label:"Advanced (+ dedicated circuit)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const scope = inputs.scope as string;
      const furniture = inputs.furniture as string;
      const tech = inputs.tech as string;
      if (!sqft || sqft <= 0) return null;
      const scopeRate: Record<string, number> = { convert: 10, partition: 40, addition: 150 };
      const furnitureCost: Record<string, number> = { basic: 800, mid: 2000, premium: 5000 };
      const techCost: Record<string, number> = { minimal: 200, standard: 600, advanced: 1500 };
      const construction = sqft * (scopeRate[scope] || 10);
      const furnishing = furnitureCost[furniture] || 2000;
      const technology = techCost[tech] || 600;
      const painting = sqft * 3;
      const lighting = 400;
      const total = construction + furnishing + technology + painting + lighting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction/Renovation", value: "$" + formatNumber(construction) },
          { label: "Furniture", value: "$" + formatNumber(furnishing) },
          { label: "Technology/Wiring", value: "$" + formatNumber(technology) },
          { label: "Painting", value: "$" + formatNumber(painting) },
          { label: "Lighting", value: "$" + formatNumber(lighting) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to build a home office?', a: 'Converting an existing room costs $1,000 to $5,000. Adding a partition wall runs $3,000 to $8,000. A new addition for a home office costs $15,000 to $40,000.' },
   { q: 'Is a home office tax deductible?', a: 'If you use a dedicated space regularly and exclusively for business, you may qualify for the home office deduction. Consult a tax professional for specific eligibility.' }],
  'Total = (Sq Ft x Scope Rate) + Furniture + Technology + Painting + Lighting',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #25 Bathroom Vanity Cost
add('bathroom-vanity-cost-calculator', 'Bathroom Vanity Cost Calculator',
  'Estimate the cost to replace or install a bathroom vanity including countertop, sink, and plumbing.',
  'Everyday', 'everyday', '~',
  ['bathroom vanity cost', 'vanity replacement cost', 'bathroom vanity install cost'],
  [
    '{ name: "width", label: "Vanity Width", type: "select", options: [{value:"24",label:"24 inches"},{value:"36",label:"36 inches"},{value:"48",label:"48 inches"},{value:"60",label:"60 inches (double)"}], defaultValue: "36" }',
    '{ name: "material", label: "Vanity Material", type: "select", options: [{value:"stock",label:"Stock/Ready-Made"},{value:"semicustom",label:"Semi-Custom"},{value:"custom",label:"Full Custom"}], defaultValue: "semicustom" }',
    '{ name: "counter", label: "Countertop", type: "select", options: [{value:"laminate",label:"Laminate"},{value:"marble",label:"Cultured Marble"},{value:"quartz",label:"Quartz"},{value:"granite",label:"Granite"}], defaultValue: "quartz" }',
    '{ name: "plumbing", label: "Plumbing Changes", type: "select", options: [{value:"none",label:"No Changes"},{value:"minor",label:"Minor (faucet swap)"},{value:"major",label:"Major (move pipes)"}], defaultValue: "minor" }',
  ],
  `(inputs) => {
      const width = parseInt(inputs.width as string) || 36;
      const material = inputs.material as string;
      const counter = inputs.counter as string;
      const plumbing = inputs.plumbing as string;
      const vanityCost: Record<string, number> = { stock: 300, semicustom: 800, custom: 2500 };
      const widthMod: Record<number, number> = { 24: 0.7, 36: 1.0, 48: 1.4, 60: 1.8 };
      const counterRate: Record<string, number> = { laminate: 15, marble: 30, quartz: 50, granite: 60 };
      const plumbCost: Record<string, number> = { none: 0, minor: 250, major: 800 };
      const vanity = (vanityCost[material] || 800) * (widthMod[width] || 1.0);
      const counterCost = (width / 12) * 2 * (counterRate[counter] || 50);
      const sink = 150;
      const faucet = 200;
      const plumb = plumbCost[plumbing] || 250;
      const labor = 400;
      const total = vanity + counterCost + sink + faucet + plumb + labor;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Vanity Cabinet", value: "$" + formatNumber(vanity) },
          { label: "Countertop", value: "$" + formatNumber(counterCost) },
          { label: "Sink", value: "$" + formatNumber(sink) },
          { label: "Faucet", value: "$" + formatNumber(faucet) },
          { label: "Plumbing Work", value: "$" + formatNumber(plumb) },
          { label: "Installation Labor", value: "$" + formatNumber(labor) },
        ],
      };
    }`,
  [{ q: 'How much does a bathroom vanity cost?', a: 'A stock vanity costs $200 to $800. Semi-custom vanities range from $500 to $2,000. Custom vanities can cost $2,000 to $5,000 or more depending on size and materials.' },
   { q: 'Can I install a bathroom vanity myself?', a: 'A handy homeowner can install a stock vanity in a few hours. However, any plumbing changes beyond a simple faucet swap are best handled by a licensed plumber.' }],
  'Total = (Vanity x Width Modifier) + Countertop + Sink + Faucet + Plumbing + Labor',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #26 Staircase Cost
add('staircase-cost-calculator', 'Staircase Cost Calculator',
  'Estimate the cost of building a new staircase or replacing an existing one.',
  'Everyday', 'everyday', '~',
  ['staircase cost', 'stair replacement cost', 'new staircase cost'],
  [
    '{ name: "type", label: "Staircase Type", type: "select", options: [{value:"straight",label:"Straight"},{value:"lshaped",label:"L-Shaped"},{value:"ushaped",label:"U-Shaped"},{value:"spiral",label:"Spiral"}], defaultValue: "straight" }',
    '{ name: "material", label: "Material", type: "select", options: [{value:"wood",label:"Hardwood"},{value:"metal",label:"Metal"},{value:"combo",label:"Wood + Metal Combo"}], defaultValue: "wood" }',
    '{ name: "stories", label: "Height", type: "select", options: [{value:"1",label:"One Story (12-14 steps)"},{value:"2",label:"Two Stories (24-28 steps)"}], defaultValue: "1" }',
    '{ name: "railing", label: "Railing Style", type: "select", options: [{value:"standard",label:"Standard Wood"},{value:"iron",label:"Wrought Iron"},{value:"glass",label:"Glass Panel"},{value:"cable",label:"Cable Rail"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const material = inputs.material as string;
      const stories = parseInt(inputs.stories as string) || 1;
      const railing = inputs.railing as string;
      const typeCost: Record<string, number> = { straight: 2000, lshaped: 3500, ushaped: 4500, spiral: 5000 };
      const matMod: Record<string, number> = { wood: 1.0, metal: 1.3, combo: 1.5 };
      const railCost: Record<string, number> = { standard: 800, iron: 2000, glass: 4000, cable: 2500 };
      const base = (typeCost[type] || 2000) * (matMod[material] || 1.0) * stories;
      const rails = (railCost[railing] || 800) * stories;
      const labor = 1500 * stories;
      const removal = 500;
      const finishing = 600 * stories;
      const total = base + rails + labor + removal + finishing;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Staircase Structure", value: "$" + formatNumber(base) },
          { label: "Railing", value: "$" + formatNumber(rails) },
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Old Staircase Removal", value: "$" + formatNumber(removal) },
          { label: "Finishing/Staining", value: "$" + formatNumber(finishing) },
        ],
      };
    }`,
  [{ q: 'How much does a new staircase cost?', a: 'A standard straight staircase costs $2,000 to $5,000. L-shaped and U-shaped designs run $4,000 to $10,000. Spiral staircases cost $5,000 to $15,000 depending on materials.' },
   { q: 'How long does it take to replace a staircase?', a: 'A standard staircase replacement takes 2 to 5 days. Custom designs with special materials may take 1 to 3 weeks including fabrication time.' }],
  'Total = (Type Cost x Material Mod x Stories) + Railing + Labor + Removal + Finishing',
  ['porch-cost-calculator', 'sunroom-cost-calculator']
);

// #27 Home Bar Cost
add('home-bar-cost-calculator', 'Home Bar Cost Calculator',
  'Estimate the cost of building a home bar including cabinetry, countertops, and amenities.',
  'Everyday', 'everyday', '~',
  ['home bar cost', 'wet bar cost', 'basement bar cost'],
  [
    '{ name: "length", label: "Bar Length", type: "number", suffix: "linear ft", min: 4, max: 20, defaultValue: 8 }',
    '{ name: "type", label: "Bar Type", type: "select", options: [{value:"dry",label:"Dry Bar (no plumbing)"},{value:"wet",label:"Wet Bar (sink)"},{value:"full",label:"Full Bar (sink + appliances)"}], defaultValue: "wet" }',
    '{ name: "counter", label: "Bar Top Material", type: "select", options: [{value:"butcher",label:"Butcher Block"},{value:"granite",label:"Granite"},{value:"quartz",label:"Quartz"},{value:"epoxy",label:"Live Edge/Epoxy"}], defaultValue: "granite" }',
  ],
  `(inputs) => {
      const length = inputs.length as number;
      const type = inputs.type as string;
      const counter = inputs.counter as string;
      if (!length || length <= 0) return null;
      const cabinetRate = 200;
      const counterRate: Record<string, number> = { butcher: 40, granite: 80, quartz: 70, epoxy: 100 };
      const typeCost: Record<string, number> = { dry: 0, wet: 2000, full: 5000 };
      const cabinetry = length * cabinetRate;
      const barTop = length * 2 * (counterRate[counter] || 80);
      const plumbAndAppliances = typeCost[type] || 2000;
      const backSplash = length * 2 * 20;
      const electrical = 500;
      const shelving = length * 50;
      const total = cabinetry + barTop + plumbAndAppliances + backSplash + electrical + shelving;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Cabinetry", value: "$" + formatNumber(cabinetry) },
          { label: "Bar Top", value: "$" + formatNumber(barTop) },
          { label: "Plumbing and Appliances", value: "$" + formatNumber(plumbAndAppliances) },
          { label: "Backsplash", value: "$" + formatNumber(backSplash) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Shelving and Display", value: "$" + formatNumber(shelving) },
        ],
      };
    }`,
  [{ q: 'How much does a home bar cost?', a: 'A basic dry bar costs $2,000 to $5,000. A wet bar with plumbing runs $5,000 to $15,000. A full bar with appliances can cost $10,000 to $25,000 or more.' },
   { q: 'Does a home bar add value to a house?', a: 'A well-built home bar can add value, especially in finished basements. Wet bars with plumbing offer more appeal to buyers than dry bars.' }],
  'Total = Cabinetry + Bar Top + Plumbing/Appliances + Backsplash + Electrical + Shelving',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #28 Murphy Bed Cost
add('murphy-bed-cost-calculator', 'Murphy Bed Cost Calculator',
  'Estimate the cost to install a wall bed (Murphy bed) including the unit, cabinetry, and installation.',
  'Everyday', 'everyday', '~',
  ['murphy bed cost', 'wall bed cost', 'fold up bed cost'],
  [
    '{ name: "size", label: "Bed Size", type: "select", options: [{value:"twin",label:"Twin"},{value:"full",label:"Full"},{value:"queen",label:"Queen"},{value:"king",label:"King"}], defaultValue: "queen" }',
    '{ name: "type", label: "Unit Type", type: "select", options: [{value:"kit",label:"DIY Kit"},{value:"prefab",label:"Pre-Built Unit"},{value:"custom",label:"Custom Built-In"}], defaultValue: "prefab" }',
    '{ name: "cabinets", label: "Side Cabinets", type: "select", options: [{value:"none",label:"No Side Cabinets"},{value:"shelves",label:"Open Shelves"},{value:"closed",label:"Closed Cabinets"}], defaultValue: "shelves" }',
  ],
  `(inputs) => {
      const size = inputs.size as string;
      const type = inputs.type as string;
      const cabinets = inputs.cabinets as string;
      const sizeCost: Record<string, number> = { twin: 0.7, full: 0.85, queen: 1.0, king: 1.3 };
      const typeCost: Record<string, number> = { kit: 800, prefab: 2000, custom: 5000 };
      const cabinetCost: Record<string, number> = { none: 0, shelves: 600, closed: 1200 };
      const unit = (typeCost[type] || 2000) * (sizeCost[size] || 1.0);
      const cabs = cabinetCost[cabinets] || 0;
      const mattress = 500;
      const installation = type === "kit" ? 300 : type === "prefab" ? 500 : 1500;
      const wallPrep = 200;
      const total = unit + cabs + mattress + installation + wallPrep;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Murphy Bed Unit", value: "$" + formatNumber(unit) },
          { label: "Side Cabinets", value: "$" + formatNumber(cabs) },
          { label: "Mattress", value: "$" + formatNumber(mattress) },
          { label: "Installation", value: "$" + formatNumber(installation) },
          { label: "Wall Preparation", value: "$" + formatNumber(wallPrep) },
        ],
      };
    }`,
  [{ q: 'How much does a Murphy bed cost?', a: 'A DIY Murphy bed kit costs $500 to $1,200. Pre-built units run $1,500 to $3,500. Custom built-in Murphy beds with cabinetry cost $4,000 to $10,000 or more.' },
   { q: 'Are Murphy beds comfortable?', a: 'Modern Murphy beds use standard mattresses up to 12 inches thick, so they are just as comfortable as a regular bed. The key is choosing a quality mattress.' }],
  'Total = (Unit Cost x Size Modifier) + Cabinets + Mattress + Installation + Wall Prep',
  ['sunroom-cost-calculator', 'porch-cost-calculator']
);

// #29 Attic Conversion
add('attic-conversion-calculator', 'Attic Conversion Cost Calculator',
  'Estimate the cost of converting an attic into livable space including framing, insulation, and finishing.',
  'Everyday', 'everyday', '~',
  ['attic conversion cost', 'attic remodel cost', 'attic finishing cost'],
  [
    '{ name: "sqft", label: "Attic Floor Area", type: "number", suffix: "sq ft", min: 100, max: 1000, defaultValue: 400 }',
    '{ name: "use", label: "Intended Use", type: "select", options: [{value:"bedroom",label:"Bedroom"},{value:"office",label:"Office/Studio"},{value:"suite",label:"Bedroom + Bathroom"}], defaultValue: "bedroom" }',
    '{ name: "dormer", label: "Dormers Needed", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1 Dormer"},{value:"2",label:"2 Dormers"}], defaultValue: "1" }',
    '{ name: "access", label: "Staircase", type: "select", options: [{value:"existing",label:"Existing Staircase"},{value:"new",label:"New Staircase Needed"}], defaultValue: "new" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const use = inputs.use as string;
      const dormers = parseInt(inputs.dormer as string) || 0;
      const access = inputs.access as string;
      if (!sqft || sqft <= 0) return null;
      const finishRate = 75;
      const finishing = sqft * finishRate;
      const insulation = sqft * 5;
      const electrical = sqft * 8;
      const dormerCost = dormers * 5000;
      const stairCost = access === "new" ? 3000 : 0;
      const bathroomAdd = use === "suite" ? 8000 : 0;
      const hvac = sqft * 6;
      const permits = 1500;
      const total = finishing + insulation + electrical + dormerCost + stairCost + bathroomAdd + hvac + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Framing and Finishing", value: "$" + formatNumber(finishing) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Dormers (" + dormers + ")", value: "$" + formatNumber(dormerCost) },
          { label: "Staircase", value: "$" + formatNumber(stairCost) },
          { label: "Bathroom Addition", value: "$" + formatNumber(bathroomAdd) },
          { label: "HVAC Extension", value: "$" + formatNumber(hvac) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    }`,
  [{ q: 'How much does an attic conversion cost?', a: 'A basic attic conversion costs $50 to $100 per square foot. Adding a bathroom increases the cost by $8,000 to $15,000. Dormers add $5,000 to $15,000 each.' },
   { q: 'What are the requirements for an attic conversion?', a: 'Most building codes require a minimum ceiling height of 7 feet over at least 50 percent of the floor area, adequate egress windows, and a permanent staircase.' }],
  'Total = Finishing + Insulation + Electrical + Dormers + Staircase + Bathroom + HVAC + Permits',
  ['sunroom-cost-calculator', 'carport-cost-calculator']
);

// #30 Garage Conversion
add('garage-conversion-calculator', 'Garage Conversion Cost Calculator',
  'Estimate the cost of converting a garage into livable space such as a bedroom, office, or apartment.',
  'Everyday', 'everyday', '~',
  ['garage conversion cost', 'garage to bedroom cost', 'garage remodel cost'],
  [
    '{ name: "sqft", label: "Garage Size", type: "number", suffix: "sq ft", min: 150, max: 800, defaultValue: 400 }',
    '{ name: "use", label: "Conversion Type", type: "select", options: [{value:"room",label:"Single Room"},{value:"suite",label:"Room + Bathroom"},{value:"adu",label:"Full ADU (kitchen + bath)"}], defaultValue: "room" }',
    '{ name: "door", label: "Garage Door", type: "select", options: [{value:"wall",label:"Replace with Wall + Window"},{value:"french",label:"Replace with French Doors"},{value:"keep",label:"Keep (insulate)"}], defaultValue: "wall" }',
    '{ name: "floor", label: "Flooring", type: "select", options: [{value:"laminate",label:"Laminate"},{value:"lvp",label:"Luxury Vinyl Plank"},{value:"hardwood",label:"Engineered Hardwood"}], defaultValue: "lvp" }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const use = inputs.use as string;
      const door = inputs.door as string;
      const floor = inputs.floor as string;
      if (!sqft || sqft <= 0) return null;
      const doorCost: Record<string, number> = { wall: 3000, french: 4000, keep: 500 };
      const floorRate: Record<string, number> = { laminate: 5, lvp: 7, hardwood: 12 };
      const wallsAndCeiling = sqft * 15;
      const insulation = sqft * 4;
      const flooring = sqft * (floorRate[floor] || 7);
      const doorWork = doorCost[door] || 3000;
      const electrical = sqft * 6;
      const hvac = sqft * 8;
      const bathroomCost = use === "suite" ? 8000 : use === "adu" ? 10000 : 0;
      const kitchenCost = use === "adu" ? 12000 : 0;
      const permits = 2000;
      const total = wallsAndCeiling + insulation + flooring + doorWork + electrical + hvac + bathroomCost + kitchenCost + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Walls and Ceiling", value: "$" + formatNumber(wallsAndCeiling) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Flooring", value: "$" + formatNumber(flooring) },
          { label: "Garage Door Conversion", value: "$" + formatNumber(doorWork) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "HVAC", value: "$" + formatNumber(hvac) },
          { label: "Bathroom", value: "$" + formatNumber(bathroomCost) },
          { label: "Kitchen", value: "$" + formatNumber(kitchenCost) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    }`,
  [{ q: 'How much does a garage conversion cost?', a: 'A basic garage conversion costs $10,000 to $25,000. Adding a bathroom increases costs by $8,000 to $15,000. A full ADU with kitchen and bath can cost $30,000 to $70,000.' },
   { q: 'Do you need a permit to convert a garage?', a: 'Yes, most jurisdictions require building permits for garage conversions. You will typically need to meet building codes for egress, ceiling height, insulation, and electrical.' }],
  'Total = Walls + Insulation + Flooring + Door + Electrical + HVAC + Bathroom + Kitchen + Permits',
  ['carport-cost-calculator', 'sunroom-cost-calculator']
);

// #31 Laundromat Startup Cost
add('laundromat-startup-calculator', 'Laundromat Startup Cost Calculator',
  'Estimate the cost to open a laundromat including machines, build-out, and operating capital.',
  'Finance', 'finance', '$',
  ['laundromat startup cost', 'laundromat investment', 'coin laundry cost'],
  [
    '{ name: "washers", label: "Number of Washers", type: "number", suffix: "units", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "dryers", label: "Number of Dryers", type: "number", suffix: "units", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "sqft", label: "Lease Space", type: "number", suffix: "sq ft", min: 500, max: 5000, defaultValue: 2000 }',
    '{ name: "buildout", label: "Build-Out Level", type: "select", options: [{value:"basic",label:"Basic Renovation"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" }',
  ],
  `(inputs) => {
      const washers = inputs.washers as number;
      const dryers = inputs.dryers as number;
      const sqft = inputs.sqft as number;
      const buildout = inputs.buildout as string;
      if (!washers || !dryers || !sqft) return null;
      const washerCost = washers * 1500;
      const dryerCost = dryers * 1200;
      const buildRates: Record<string, number> = { basic: 30, mid: 60, premium: 100 };
      const buildCost = sqft * (buildRates[buildout] || 60);
      const plumbing = washers * 800;
      const electrical = (washers + dryers) * 400;
      const permits = 3000;
      const workingCapital = 15000;
      const total = washerCost + dryerCost + buildCost + plumbing + electrical + permits + workingCapital;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Washers (" + washers + ")", value: "$" + formatNumber(washerCost) },
          { label: "Dryers (" + dryers + ")", value: "$" + formatNumber(dryerCost) },
          { label: "Build-Out", value: "$" + formatNumber(buildCost) },
          { label: "Plumbing", value: "$" + formatNumber(plumbing) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Working Capital", value: "$" + formatNumber(workingCapital) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to open a laundromat?', a: 'A coin laundromat typically costs $100,000 to $500,000 to open depending on size, equipment quality, and location build-out requirements.' },
   { q: 'How many washers and dryers does a laundromat need?', a: 'A small laundromat may start with 15 to 20 of each, while a large facility can have 50 or more. The ratio of washers to dryers is usually close to 1:1.' }],
  'Total = Washer Cost + Dryer Cost + Build-Out + Plumbing + Electrical + Permits + Working Capital',
  ['vending-machine-roi-calculator', 'car-wash-startup-calculator']
);

// #32 Vending Machine ROI
add('vending-machine-roi-calculator', 'Vending Machine ROI Calculator',
  'Calculate the return on investment for a vending machine business based on locations, revenue, and costs.',
  'Finance', 'finance', '$',
  ['vending machine ROI', 'vending machine profit', 'vending business return'],
  [
    '{ name: "machines", label: "Number of Machines", type: "number", suffix: "units", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "costPerMachine", label: "Cost per Machine", type: "number", suffix: "$", min: 1000, max: 15000, defaultValue: 4000 }',
    '{ name: "monthlyRevenue", label: "Monthly Revenue per Machine", type: "number", suffix: "$", min: 100, max: 5000, defaultValue: 800 }',
    '{ name: "monthlyCost", label: "Monthly Cost per Machine", type: "number", suffix: "$", min: 50, max: 2000, defaultValue: 300 }',
  ],
  `(inputs) => {
      const machines = inputs.machines as number;
      const costPer = inputs.costPerMachine as number;
      const rev = inputs.monthlyRevenue as number;
      const cost = inputs.monthlyCost as number;
      if (!machines || !costPer || !rev) return null;
      const totalInvestment = machines * costPer;
      const monthlyProfit = machines * (rev - cost);
      const annualProfit = monthlyProfit * 12;
      const paybackMonths = monthlyProfit > 0 ? Math.ceil(totalInvestment / monthlyProfit) : 0;
      const roi = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Annual ROI", value: formatNumber(roi) + "%" },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(totalInvestment) },
          { label: "Monthly Profit", value: "$" + formatNumber(monthlyProfit) },
          { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
          { label: "Payback Period", value: paybackMonths + " months" },
        ],
      };
    }`,
  [{ q: 'How much can you make from a vending machine?', a: 'A single vending machine in a good location can generate $200 to $1,000 per month in profit after restocking and maintenance costs.' },
   { q: 'How much does a vending machine cost?', a: 'New vending machines cost $3,000 to $10,000 depending on the type. Refurbished machines can be purchased for $1,000 to $4,000.' }],
  'ROI = (Annual Profit / Total Investment) x 100; Payback = Investment / Monthly Profit',
  ['laundromat-startup-calculator', 'atm-business-calculator']
);

// #33 Car Wash Startup Cost
add('car-wash-startup-calculator', 'Car Wash Startup Cost Calculator',
  'Estimate the cost to start a car wash business including equipment, construction, and initial operating expenses.',
  'Finance', 'finance', '$',
  ['car wash startup cost', 'car wash business cost', 'car wash investment'],
  [
    '{ name: "type", label: "Car Wash Type", type: "select", options: [{value:"self",label:"Self-Service Bay"},{value:"auto",label:"Automatic Tunnel"},{value:"hand",label:"Hand Wash"}], defaultValue: "self" }',
    '{ name: "bays", label: "Number of Bays or Lanes", type: "number", suffix: "bays", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "land", label: "Land and Construction", type: "select", options: [{value:"lease",label:"Lease Existing"},{value:"build",label:"Build New"},{value:"convert",label:"Convert Existing"}], defaultValue: "lease" }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const bays = inputs.bays as number;
      const land = inputs.land as string;
      if (!bays || bays <= 0) return null;
      const equipRates: Record<string, number> = { self: 15000, auto: 100000, hand: 5000 };
      const landCosts: Record<string, number> = { lease: 50000, build: 300000, convert: 100000 };
      const equipment = bays * (equipRates[type] || 15000);
      const landCost = landCosts[land] || 50000;
      const plumbing = bays * 8000;
      const permits = 5000;
      const signage = 10000;
      const workingCapital = 20000;
      const total = equipment + landCost + plumbing + permits + signage + workingCapital;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Equipment (" + bays + " bays)", value: "$" + formatNumber(equipment) },
          { label: "Land and Construction", value: "$" + formatNumber(landCost) },
          { label: "Plumbing and Water", value: "$" + formatNumber(plumbing) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Signage and Marketing", value: "$" + formatNumber(signage) },
          { label: "Working Capital", value: "$" + formatNumber(workingCapital) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to start a car wash?', a: 'A self-service car wash costs $50,000 to $200,000 to start. An automatic tunnel car wash can cost $500,000 to $2 million or more.' },
   { q: 'Is a car wash a good investment?', a: 'Car washes can be profitable with typical profit margins of 30 to 50 percent once established. Location and traffic volume are the most important factors.' }],
  'Total = Equipment + Land + Plumbing + Permits + Signage + Working Capital',
  ['laundromat-startup-calculator', 'mobile-detailing-calculator']
);

// #34 Food Trailer Cost
add('food-trailer-cost-calculator', 'Food Trailer Cost Calculator',
  'Calculate the startup costs for a food trailer business including the trailer, equipment, permits, and supplies.',
  'Finance', 'finance', '$',
  ['food trailer cost', 'food truck startup', 'mobile food business cost'],
  [
    '{ name: "trailerType", label: "Trailer Type", type: "select", options: [{value:"small",label:"Small (8-12 ft)"},{value:"medium",label:"Medium (14-18 ft)"},{value:"large",label:"Large (20-24 ft)"}], defaultValue: "medium" }',
    '{ name: "condition", label: "Condition", type: "select", options: [{value:"new",label:"New"},{value:"used",label:"Used"},{value:"custom",label:"Custom Build"}], defaultValue: "new" }',
    '{ name: "equipment", label: "Kitchen Equipment Level", type: "select", options: [{value:"basic",label:"Basic (grill, fryer)"},{value:"full",label:"Full Kitchen"},{value:"specialty",label:"Specialty (pizza oven, smoker)"}], defaultValue: "basic" }',
  ],
  `(inputs) => {
      const trailer = inputs.trailerType as string;
      const condition = inputs.condition as string;
      const equip = inputs.equipment as string;
      const trailerCosts: Record<string, number> = { small: 15000, medium: 25000, large: 40000 };
      const condMult: Record<string, number> = { new: 1.0, used: 0.6, custom: 1.5 };
      const equipCosts: Record<string, number> = { basic: 5000, full: 15000, specialty: 25000 };
      const baseCost = (trailerCosts[trailer] || 25000) * (condMult[condition] || 1.0);
      const equipCost = equipCosts[equip] || 5000;
      const permits = 3000;
      const wrap = 3500;
      const initialSupplies = 2000;
      const insurance = 2500;
      const total = baseCost + equipCost + permits + wrap + initialSupplies + insurance;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Trailer", value: "$" + formatNumber(baseCost) },
          { label: "Kitchen Equipment", value: "$" + formatNumber(equipCost) },
          { label: "Permits and Licenses", value: "$" + formatNumber(permits) },
          { label: "Vehicle Wrap", value: "$" + formatNumber(wrap) },
          { label: "Initial Supplies", value: "$" + formatNumber(initialSupplies) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
        ],
      };
    }`,
  [{ q: 'How much does a food trailer cost?', a: 'A new food trailer costs $15,000 to $50,000 depending on size. A fully equipped custom build can run $50,000 to $100,000 or more.' },
   { q: 'What permits do you need for a food trailer?', a: 'You typically need a food handler permit, mobile food vendor license, health department inspection, and a business license. Requirements vary by city and state.' }],
  'Total = Trailer Cost x Condition Multiplier + Equipment + Permits + Wrap + Supplies + Insurance',
  ['cleaning-business-calculator', 'lawn-care-business-calculator']
);

// #35 ATM Business
add('atm-business-calculator', 'ATM Business Calculator',
  'Calculate the revenue and return on investment for an ATM placement business.',
  'Finance', 'finance', '$',
  ['ATM business profit', 'ATM machine revenue', 'ATM investment return'],
  [
    '{ name: "atms", label: "Number of ATMs", type: "number", suffix: "units", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "costPerAtm", label: "Cost per ATM", type: "number", suffix: "$", min: 1000, max: 10000, defaultValue: 3000 }',
    '{ name: "txPerMonth", label: "Transactions per Month per ATM", type: "number", suffix: "tx", min: 50, max: 1000, defaultValue: 300 }',
    '{ name: "surcharge", label: "Surcharge per Transaction", type: "number", suffix: "$", min: 1, max: 5, defaultValue: 3 }',
  ],
  `(inputs) => {
      const atms = inputs.atms as number;
      const costPer = inputs.costPerAtm as number;
      const tx = inputs.txPerMonth as number;
      const surcharge = inputs.surcharge as number;
      if (!atms || !costPer || !tx || !surcharge) return null;
      const totalInvestment = atms * costPer;
      const monthlyGross = atms * tx * surcharge;
      const monthlyCosts = atms * 150;
      const monthlyNet = monthlyGross - monthlyCosts;
      const annualNet = monthlyNet * 12;
      const payback = monthlyNet > 0 ? Math.ceil(totalInvestment / monthlyNet) : 0;
      const roi = totalInvestment > 0 ? (annualNet / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Annual Net Profit", value: "$" + formatNumber(annualNet) },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(totalInvestment) },
          { label: "Monthly Gross Revenue", value: "$" + formatNumber(monthlyGross) },
          { label: "Monthly Operating Costs", value: "$" + formatNumber(monthlyCosts) },
          { label: "Monthly Net Profit", value: "$" + formatNumber(monthlyNet) },
          { label: "Annual ROI", value: formatNumber(roi) + "%" },
          { label: "Payback Period", value: payback + " months" },
        ],
      };
    }`,
  [{ q: 'How much does an ATM business make?', a: 'Each ATM can earn $200 to $1,000 per month in surcharge revenue depending on location and transaction volume. High-traffic locations generate the most income.' },
   { q: 'How much does an ATM cost?', a: 'A new ATM costs $2,000 to $8,000. Used machines can be purchased for $1,000 to $3,000. You also need cash to load the machines.' }],
  'Annual Profit = (ATMs x Transactions x Surcharge - Operating Costs) x 12; ROI = Annual Profit / Investment x 100',
  ['vending-machine-roi-calculator', 'laundromat-startup-calculator']
);

// #36 Storage Unit Investment
add('storage-unit-investment-calculator', 'Storage Unit Investment Calculator',
  'Estimate investment returns for a self-storage facility based on unit count, size mix, and occupancy.',
  'Finance', 'finance', '$',
  ['storage unit investment', 'self storage ROI', 'storage facility profit'],
  [
    '{ name: "units", label: "Number of Units", type: "number", suffix: "units", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "avgRent", label: "Average Monthly Rent per Unit", type: "number", suffix: "$", min: 30, max: 500, defaultValue: 120 }',
    '{ name: "occupancy", label: "Occupancy Rate", type: "number", suffix: "%", min: 50, max: 100, defaultValue: 85 }',
    '{ name: "totalInvestment", label: "Total Investment", type: "number", suffix: "$", min: 50000, max: 5000000, defaultValue: 500000 }',
  ],
  `(inputs) => {
      const units = inputs.units as number;
      const avgRent = inputs.avgRent as number;
      const occ = inputs.occupancy as number;
      const investment = inputs.totalInvestment as number;
      if (!units || !avgRent || !occ || !investment) return null;
      const occRate = occ / 100;
      const monthlyGross = units * avgRent * occRate;
      const annualGross = monthlyGross * 12;
      const opex = annualGross * 0.35;
      const noi = annualGross - opex;
      const capRate = investment > 0 ? (noi / investment) * 100 : 0;
      return {
        primary: { label: "Net Operating Income", value: "$" + formatNumber(noi) },
        details: [
          { label: "Monthly Gross Revenue", value: "$" + formatNumber(monthlyGross) },
          { label: "Annual Gross Revenue", value: "$" + formatNumber(annualGross) },
          { label: "Annual Operating Expenses (35%)", value: "$" + formatNumber(opex) },
          { label: "Cap Rate", value: formatNumber(capRate) + "%" },
          { label: "Occupied Units", value: formatNumber(Math.round(units * occRate)) },
        ],
      };
    }`,
  [{ q: 'Is self-storage a good investment?', a: 'Self-storage facilities often produce cap rates of 6 to 10 percent and have lower operating costs than many other real estate investments. Occupancy rates typically range from 85 to 95 percent.' },
   { q: 'How much does it cost to build a storage facility?', a: 'Building a self-storage facility costs $25 to $70 per square foot. A 50-unit facility can cost $250,000 to $1 million or more depending on location and construction type.' }],
  'NOI = (Units x Avg Rent x Occupancy x 12) - Operating Expenses; Cap Rate = NOI / Investment x 100',
  ['rental-yield-calculator', 'cap-rate-comparison-calculator']
);

// #37 Mobile Detailing
add('mobile-detailing-calculator', 'Mobile Detailing Calculator',
  'Estimate revenue and costs for a mobile auto detailing business based on services and volume.',
  'Finance', 'finance', '$',
  ['mobile detailing profit', 'auto detailing business', 'car detailing revenue'],
  [
    '{ name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 1, max: 40, defaultValue: 15 }',
    '{ name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "supplyCostPct", label: "Supply Cost Percentage", type: "number", suffix: "%", min: 5, max: 30, defaultValue: 10 }',
    '{ name: "startupCost", label: "Startup Equipment Cost", type: "number", suffix: "$", min: 1000, max: 30000, defaultValue: 5000 }',
  ],
  `(inputs) => {
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const supplyPct = inputs.supplyCostPct as number;
      const startup = inputs.startupCost as number;
      if (!jobs || !price) return null;
      const weeklyRevenue = jobs * price;
      const monthlyRevenue = weeklyRevenue * 4.33;
      const annualRevenue = monthlyRevenue * 12;
      const supplyCost = annualRevenue * (supplyPct / 100);
      const fuel = jobs * 52 * 8;
      const insurance = 2400;
      const annualProfit = annualRevenue - supplyCost - fuel - insurance;
      const payback = annualProfit > 0 ? Math.ceil(startup / (annualProfit / 12)) : 0;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Weekly Revenue", value: "$" + formatNumber(weeklyRevenue) },
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Supply Costs", value: "$" + formatNumber(supplyCost) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Payback Period", value: payback + " months" },
        ],
      };
    }`,
  [{ q: 'How much can you make with mobile detailing?', a: 'A mobile detailing business owner can earn $50,000 to $100,000 per year working solo. Revenue depends on pricing, volume, and services offered.' },
   { q: 'How much does it cost to start a mobile detailing business?', a: 'Startup costs range from $3,000 to $15,000 for equipment, supplies, and marketing. A pressure washer, buffer, and basic supplies are the minimum requirements.' }],
  'Annual Profit = (Jobs x Price x 52) - Supply Costs - Fuel - Insurance',
  ['car-wash-startup-calculator', 'pressure-washing-business-calculator']
);

// #38 Lawn Care Business
add('lawn-care-business-calculator', 'Lawn Care Business Calculator',
  'Estimate startup costs and revenue potential for a lawn care and landscaping business.',
  'Finance', 'finance', '$',
  ['lawn care business cost', 'lawn mowing business profit', 'landscaping startup'],
  [
    '{ name: "clientsPerWeek", label: "Clients per Week", type: "number", suffix: "clients", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "avgPrice", label: "Average Price per Lawn", type: "number", suffix: "$", min: 25, max: 200, defaultValue: 50 }',
    '{ name: "weeksPerYear", label: "Mowing Season Weeks", type: "number", suffix: "weeks", min: 20, max: 52, defaultValue: 32 }',
    '{ name: "equipmentCost", label: "Equipment Investment", type: "number", suffix: "$", min: 1000, max: 50000, defaultValue: 8000 }',
  ],
  `(inputs) => {
      const clients = inputs.clientsPerWeek as number;
      const price = inputs.avgPrice as number;
      const weeks = inputs.weeksPerYear as number;
      const equipment = inputs.equipmentCost as number;
      if (!clients || !price || !weeks) return null;
      const annualRevenue = clients * price * weeks;
      const fuel = clients * weeks * 5;
      const maintenance = equipment * 0.1;
      const insurance = 1800;
      const marketing = 1200;
      const annualExpenses = fuel + maintenance + insurance + marketing;
      const annualProfit = annualRevenue - annualExpenses;
      const profitPerClient = annualProfit / clients;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Equipment Maintenance", value: "$" + formatNumber(maintenance) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Profit per Client", value: "$" + formatNumber(profitPerClient) },
        ],
      };
    }`,
  [{ q: 'How much can you make with a lawn care business?', a: 'A solo lawn care operator can earn $30,000 to $60,000 per year. With a crew and more clients, annual revenue can exceed $100,000.' },
   { q: 'What equipment do you need to start a lawn care business?', a: 'At minimum you need a commercial mower, trimmer, blower, and a trailer. A basic setup costs $3,000 to $10,000. Commercial zero-turn mowers alone cost $3,000 to $12,000.' }],
  'Annual Profit = (Clients x Price x Weeks) - Fuel - Maintenance - Insurance - Marketing',
  ['pressure-washing-business-calculator', 'cleaning-business-calculator']
);

// #39 Cleaning Business
add('cleaning-business-calculator', 'Cleaning Business Calculator',
  'Estimate startup costs and revenue for a residential or commercial cleaning service.',
  'Finance', 'finance', '$',
  ['cleaning business startup', 'cleaning service pricing', 'janitorial business cost'],
  [
    '{ name: "type", label: "Service Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"both",label:"Both"}], defaultValue: "residential" }',
    '{ name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 3, max: 40, defaultValue: 12 }',
    '{ name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 50, max: 500, defaultValue: 130 }',
    '{ name: "employees", label: "Number of Cleaners", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 2 }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const employees = inputs.employees as number;
      if (!jobs || !price || !employees) return null;
      const annualRevenue = jobs * price * 52;
      const laborCost = employees > 1 ? (employees - 1) * 15 * 25 * 52 : 0;
      const supplies = annualRevenue * 0.05;
      const insurance = 2000 + employees * 500;
      const marketing = 2400;
      const vehicle = 3600;
      const annualExpenses = laborCost + supplies + insurance + marketing + vehicle;
      const annualProfit = annualRevenue - annualExpenses;
      const startupCost = 2000 + employees * 500;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Labor Costs", value: "$" + formatNumber(laborCost) },
          { label: "Supplies (5%)", value: "$" + formatNumber(supplies) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Vehicle Costs", value: "$" + formatNumber(vehicle) },
          { label: "Estimated Startup Cost", value: "$" + formatNumber(startupCost) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to start a cleaning business?', a: 'A basic cleaning business can start for $2,000 to $6,000 covering supplies, insurance, and marketing. Commercial cleaning requires more investment in equipment.' },
   { q: 'How much do cleaning businesses charge?', a: 'Residential cleaners charge $100 to $250 per home. Commercial cleaning rates vary from $0.05 to $0.20 per square foot depending on frequency and scope.' }],
  'Annual Profit = (Jobs x Price x 52) - Labor - Supplies - Insurance - Marketing - Vehicle',
  ['pressure-washing-business-calculator', 'lawn-care-business-calculator']
);

// #40 Pressure Washing Business
add('pressure-washing-business-calculator', 'Pressure Washing Business Calculator',
  'Calculate revenue and profit potential for a pressure washing business.',
  'Finance', 'finance', '$',
  ['pressure washing business profit', 'power washing revenue', 'pressure washing startup'],
  [
    '{ name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 100, max: 1000, defaultValue: 250 }',
    '{ name: "weeksPerYear", label: "Working Weeks per Year", type: "number", suffix: "weeks", min: 20, max: 52, defaultValue: 40 }',
    '{ name: "equipmentCost", label: "Equipment Cost", type: "number", suffix: "$", min: 2000, max: 30000, defaultValue: 6000 }',
  ],
  `(inputs) => {
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const weeks = inputs.weeksPerYear as number;
      const equipment = inputs.equipmentCost as number;
      if (!jobs || !price || !weeks) return null;
      const annualRevenue = jobs * price * weeks;
      const fuel = jobs * weeks * 10;
      const chemicals = jobs * weeks * 8;
      const insurance = 2400;
      const marketing = 1800;
      const maintenance = equipment * 0.15;
      const annualExpenses = fuel + chemicals + insurance + marketing + maintenance;
      const annualProfit = annualRevenue - annualExpenses;
      const roi = equipment > 0 ? (annualProfit / equipment) * 100 : 0;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Chemical Costs", value: "$" + formatNumber(chemicals) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Equipment ROI", value: formatNumber(roi) + "%" },
        ],
      };
    }`,
  [{ q: 'How much can you make pressure washing?', a: 'A solo pressure washing operator can earn $40,000 to $80,000 per year. Operators with crews and commercial contracts can exceed $150,000 in annual revenue.' },
   { q: 'What equipment do you need for pressure washing?', a: 'You need a commercial pressure washer (3,000+ PSI), surface cleaner, hoses, nozzles, chemical injector, and a trailer or truck-mounted setup. Basic startup equipment costs $3,000 to $10,000.' }],
  'Annual Profit = (Jobs x Price x Weeks) - Fuel - Chemicals - Insurance - Marketing - Maintenance',
  ['mobile-detailing-calculator', 'lawn-care-business-calculator']
);

// #41 House Flip Profit
add('flip-profit-calculator', 'House Flip Profit Calculator',
  'Analyze the potential profit from flipping a house including purchase, renovation, and selling costs.',
  'Finance', 'finance', '$',
  ['house flip profit', 'flip calculator', 'real estate flip ROI'],
  [
    '{ name: "purchasePrice", label: "Purchase Price", type: "number", suffix: "$", min: 10000, max: 2000000, defaultValue: 150000 }',
    '{ name: "rehabCost", label: "Renovation Cost", type: "number", suffix: "$", min: 5000, max: 500000, defaultValue: 40000 }',
    '{ name: "arv", label: "After Repair Value (ARV)", type: "number", suffix: "$", min: 50000, max: 3000000, defaultValue: 250000 }',
    '{ name: "holdMonths", label: "Hold Time", type: "number", suffix: "months", min: 1, max: 24, defaultValue: 5 }',
  ],
  `(inputs) => {
      const purchase = inputs.purchasePrice as number;
      const rehab = inputs.rehabCost as number;
      const arv = inputs.arv as number;
      const months = inputs.holdMonths as number;
      if (!purchase || !arv) return null;
      const closingBuy = purchase * 0.03;
      const closingSell = arv * 0.06;
      const agentFees = arv * 0.03;
      const holdingCosts = (purchase * 0.01) * months;
      const totalCost = purchase + rehab + closingBuy + closingSell + agentFees + holdingCosts;
      const profit = arv - totalCost;
      const roi = totalCost > 0 ? (profit / (purchase + rehab)) * 100 : 0;
      return {
        primary: { label: "Estimated Profit", value: "$" + formatNumber(profit) },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(purchase + rehab) },
          { label: "Closing Costs (Buy)", value: "$" + formatNumber(closingBuy) },
          { label: "Closing Costs (Sell)", value: "$" + formatNumber(closingSell) },
          { label: "Agent Fees (3%)", value: "$" + formatNumber(agentFees) },
          { label: "Holding Costs", value: "$" + formatNumber(holdingCosts) },
          { label: "ROI", value: formatNumber(roi) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the 70% rule in house flipping?', a: 'The 70 percent rule states you should not pay more than 70 percent of the after repair value minus renovation costs. For example, if ARV is $200,000 and repairs cost $30,000, your max offer should be $110,000.' },
   { q: 'How much profit should you make on a flip?', a: 'Most experienced flippers aim for a minimum profit of $25,000 to $30,000 per flip, or a return on investment of 15 to 25 percent.' }],
  'Profit = ARV - Purchase - Rehab - Closing Costs - Agent Fees - Holding Costs',
  ['rental-yield-calculator', 'airbnb-expense-calculator']
);

// #42 Airbnb Expense
add('airbnb-expense-calculator', 'Airbnb Expense Calculator',
  'Break down the monthly expenses of operating a short-term rental property on Airbnb or similar platforms.',
  'Finance', 'finance', '$',
  ['Airbnb expenses', 'short term rental costs', 'vacation rental expenses'],
  [
    '{ name: "monthlyRevenue", label: "Monthly Revenue", type: "number", suffix: "$", min: 500, max: 30000, defaultValue: 4000 }',
    '{ name: "mortgage", label: "Monthly Mortgage", type: "number", suffix: "$", min: 0, max: 10000, defaultValue: 1500 }',
    '{ name: "managementPct", label: "Management Fee", type: "number", suffix: "%", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "nightsPerMonth", label: "Occupied Nights per Month", type: "number", suffix: "nights", min: 1, max: 30, defaultValue: 22 }',
  ],
  `(inputs) => {
      const revenue = inputs.monthlyRevenue as number;
      const mortgage = inputs.mortgage as number;
      const mgmtPct = inputs.managementPct as number;
      const nights = inputs.nightsPerMonth as number;
      if (!revenue) return null;
      const platformFee = revenue * 0.03;
      const management = revenue * (mgmtPct / 100);
      const cleaning = nights > 0 ? Math.ceil(nights / 3) * 75 : 0;
      const utilities = 250;
      const supplies = 150;
      const insurance = 200;
      const maintenance = revenue * 0.05;
      const totalExpenses = mortgage + platformFee + management + cleaning + utilities + supplies + insurance + maintenance;
      const netIncome = revenue - totalExpenses;
      return {
        primary: { label: "Monthly Net Income", value: "$" + formatNumber(netIncome) },
        details: [
          { label: "Monthly Revenue", value: "$" + formatNumber(revenue) },
          { label: "Mortgage", value: "$" + formatNumber(mortgage) },
          { label: "Platform Fees (3%)", value: "$" + formatNumber(platformFee) },
          { label: "Management Fee", value: "$" + formatNumber(management) },
          { label: "Cleaning", value: "$" + formatNumber(cleaning) },
          { label: "Utilities", value: "$" + formatNumber(utilities) },
          { label: "Supplies and Maintenance", value: "$" + formatNumber(supplies + maintenance) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
        ],
      };
    }`,
  [{ q: 'What are the typical expenses for an Airbnb?', a: 'Typical Airbnb expenses include mortgage, cleaning fees, platform fees (3%), management fees (15-25%), utilities, insurance, supplies, and maintenance. Total expenses usually consume 40 to 70 percent of revenue.' },
   { q: 'Is Airbnb profitable after expenses?', a: 'Airbnb properties can be profitable with net margins of 20 to 40 percent in favorable markets. Occupancy rate and nightly rate are the key factors for profitability.' }],
  'Net Income = Revenue - Mortgage - Platform Fees - Management - Cleaning - Utilities - Supplies - Insurance - Maintenance',
  ['rental-yield-calculator', 'flip-profit-calculator']
);

// #43 Rental Yield
add('rental-yield-calculator', 'Rental Yield Calculator',
  'Calculate the gross and net rental yield percentage for an investment property.',
  'Finance', 'finance', '$',
  ['rental yield', 'property yield calculator', 'buy to let yield'],
  [
    '{ name: "propertyValue", label: "Property Value", type: "number", suffix: "$", min: 50000, max: 5000000, defaultValue: 300000 }',
    '{ name: "monthlyRent", label: "Monthly Rent", type: "number", suffix: "$", min: 200, max: 20000, defaultValue: 2000 }',
    '{ name: "annualExpenses", label: "Annual Expenses", type: "number", suffix: "$", min: 0, max: 100000, defaultValue: 8000 }',
  ],
  `(inputs) => {
      const value = inputs.propertyValue as number;
      const rent = inputs.monthlyRent as number;
      const expenses = inputs.annualExpenses as number;
      if (!value || !rent) return null;
      const annualRent = rent * 12;
      const grossYield = (annualRent / value) * 100;
      const netIncome = annualRent - expenses;
      const netYield = (netIncome / value) * 100;
      const monthlyNet = netIncome / 12;
      return {
        primary: { label: "Net Rental Yield", value: formatNumber(netYield) + "%" },
        details: [
          { label: "Gross Rental Yield", value: formatNumber(grossYield) + "%" },
          { label: "Annual Rental Income", value: "$" + formatNumber(annualRent) },
          { label: "Annual Expenses", value: "$" + formatNumber(expenses) },
          { label: "Net Annual Income", value: "$" + formatNumber(netIncome) },
          { label: "Monthly Net Income", value: "$" + formatNumber(monthlyNet) },
        ],
      };
    }`,
  [{ q: 'What is a good rental yield?', a: 'A gross rental yield of 5 to 8 percent is generally considered good. Net yields of 4 to 6 percent are typical for residential investment properties in most markets.' },
   { q: 'How do you calculate rental yield?', a: 'Gross yield equals annual rent divided by property value times 100. Net yield equals annual rent minus expenses divided by property value times 100.' }],
  'Gross Yield = (Annual Rent / Property Value) x 100; Net Yield = ((Annual Rent - Expenses) / Property Value) x 100',
  ['cap-rate-comparison-calculator', 'airbnb-expense-calculator']
);

// #44 Commercial Rent
add('commercial-rent-calculator', 'Commercial Rent Calculator',
  'Calculate the total cost of leasing commercial space including base rent, CAM charges, and other fees.',
  'Finance', 'finance', '$',
  ['commercial rent calculator', 'commercial lease cost', 'office rent calculator'],
  [
    '{ name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 200, max: 50000, defaultValue: 2000 }',
    '{ name: "pricePerSqft", label: "Annual Price per Sq Ft", type: "number", suffix: "$", min: 5, max: 200, defaultValue: 25 }',
    '{ name: "cam", label: "CAM Charges per Sq Ft", type: "number", suffix: "$", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "leaseYears", label: "Lease Term", type: "number", suffix: "years", min: 1, max: 15, defaultValue: 5 }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const price = inputs.pricePerSqft as number;
      const cam = inputs.cam as number;
      const years = inputs.leaseYears as number;
      if (!sqft || !price) return null;
      const annualBase = sqft * price;
      const annualCam = sqft * cam;
      const annualTotal = annualBase + annualCam;
      const monthlyTotal = annualTotal / 12;
      const totalLease = annualTotal * years;
      return {
        primary: { label: "Monthly Total Cost", value: "$" + formatNumber(monthlyTotal) },
        details: [
          { label: "Annual Base Rent", value: "$" + formatNumber(annualBase) },
          { label: "Annual CAM Charges", value: "$" + formatNumber(annualCam) },
          { label: "Annual Total", value: "$" + formatNumber(annualTotal) },
          { label: "Total Lease Cost (" + years + " years)", value: "$" + formatNumber(totalLease) },
          { label: "Effective Rate per Sq Ft", value: "$" + formatNumber(annualTotal / sqft) },
        ],
      };
    }`,
  [{ q: 'What is a CAM charge?', a: 'Common Area Maintenance (CAM) charges cover shared expenses like property taxes, insurance, landscaping, and common area upkeep. CAM charges typically add $5 to $15 per square foot per year.' },
   { q: 'How is commercial rent calculated?', a: 'Commercial rent is usually quoted as an annual price per square foot. The total cost includes base rent plus CAM charges, taxes, and insurance. A $25 per square foot rate for 2,000 square feet equals $50,000 per year.' }],
  'Monthly Cost = (Sq Ft x (Price per Sq Ft + CAM)) / 12; Total Lease = Annual Total x Years',
  ['triple-net-lease-calculator', 'cap-rate-comparison-calculator']
);

// #45 Triple Net Lease
add('triple-net-lease-calculator', 'Triple Net Lease Calculator',
  'Calculate the total cost of a triple net (NNN) lease including base rent, property taxes, insurance, and maintenance.',
  'Finance', 'finance', '$',
  ['triple net lease cost', 'NNN lease calculator', 'net lease calculator'],
  [
    '{ name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 500, max: 50000, defaultValue: 3000 }',
    '{ name: "baseRent", label: "Base Rent per Sq Ft (Annual)", type: "number", suffix: "$", min: 5, max: 100, defaultValue: 18 }',
    '{ name: "taxes", label: "Property Taxes per Sq Ft", type: "number", suffix: "$", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "insurance", label: "Insurance per Sq Ft", type: "number", suffix: "$", min: 0.5, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
      const sqft = inputs.sqft as number;
      const base = inputs.baseRent as number;
      const taxes = inputs.taxes as number;
      const insurance = inputs.insurance as number;
      if (!sqft || !base) return null;
      const maintenance = 1.5;
      const annualBase = sqft * base;
      const annualTaxes = sqft * taxes;
      const annualInsurance = sqft * insurance;
      const annualMaintenance = sqft * maintenance;
      const annualNNN = annualTaxes + annualInsurance + annualMaintenance;
      const annualTotal = annualBase + annualNNN;
      const monthlyTotal = annualTotal / 12;
      return {
        primary: { label: "Monthly Total Cost", value: "$" + formatNumber(monthlyTotal) },
        details: [
          { label: "Annual Base Rent", value: "$" + formatNumber(annualBase) },
          { label: "Annual Taxes (N)", value: "$" + formatNumber(annualTaxes) },
          { label: "Annual Insurance (N)", value: "$" + formatNumber(annualInsurance) },
          { label: "Annual Maintenance (N)", value: "$" + formatNumber(annualMaintenance) },
          { label: "Total NNN per Sq Ft", value: "$" + formatNumber(annualNNN / sqft) },
          { label: "Annual Total", value: "$" + formatNumber(annualTotal) },
        ],
      };
    }`,
  [{ q: 'What is a triple net lease?', a: 'A triple net (NNN) lease requires the tenant to pay base rent plus property taxes, building insurance, and maintenance costs. The landlord receives the base rent as net income.' },
   { q: 'How much are NNN charges?', a: 'NNN charges typically range from $5 to $15 per square foot per year. Property taxes are usually the largest portion, followed by insurance and maintenance.' }],
  'Monthly Cost = (Sq Ft x (Base Rent + Taxes + Insurance + Maintenance)) / 12',
  ['commercial-rent-calculator', 'cap-rate-comparison-calculator']
);

// #46 Cap Rate Comparison
add('cap-rate-comparison-calculator', 'Cap Rate Comparison Calculator',
  'Compare the capitalization rates of two investment properties to evaluate relative value.',
  'Finance', 'finance', '$',
  ['cap rate comparison', 'capitalization rate calculator', 'compare cap rates'],
  [
    '{ name: "price1", label: "Property A Price", type: "number", suffix: "$", min: 50000, max: 10000000, defaultValue: 400000 }',
    '{ name: "noi1", label: "Property A Annual NOI", type: "number", suffix: "$", min: 5000, max: 500000, defaultValue: 32000 }',
    '{ name: "price2", label: "Property B Price", type: "number", suffix: "$", min: 50000, max: 10000000, defaultValue: 550000 }',
    '{ name: "noi2", label: "Property B Annual NOI", type: "number", suffix: "$", min: 5000, max: 500000, defaultValue: 38000 }',
  ],
  `(inputs) => {
      const price1 = inputs.price1 as number;
      const noi1 = inputs.noi1 as number;
      const price2 = inputs.price2 as number;
      const noi2 = inputs.noi2 as number;
      if (!price1 || !noi1 || !price2 || !noi2) return null;
      const capA = (noi1 / price1) * 100;
      const capB = (noi2 / price2) * 100;
      const diff = capA - capB;
      const better = diff > 0 ? "Property A" : diff < 0 ? "Property B" : "Equal";
      return {
        primary: { label: "Better Cap Rate", value: better },
        details: [
          { label: "Property A Cap Rate", value: formatNumber(capA) + "%" },
          { label: "Property B Cap Rate", value: formatNumber(capB) + "%" },
          { label: "Difference", value: formatNumber(Math.abs(diff)) + " percentage points" },
          { label: "Property A Price per NOI Dollar", value: "$" + formatNumber(price1 / noi1) },
          { label: "Property B Price per NOI Dollar", value: "$" + formatNumber(price2 / noi2) },
        ],
      };
    }`,
  [{ q: 'What is a good cap rate?', a: 'Cap rates vary by market and property type. Generally, 4 to 6 percent is typical for low-risk properties in strong markets, while 8 to 12 percent indicates higher risk or secondary markets.' },
   { q: 'Is a higher cap rate better?', a: 'A higher cap rate means a higher return on investment but often indicates higher risk. Lower cap rates suggest safer, more stable investments but with lower returns.' }],
  'Cap Rate = (Net Operating Income / Property Price) x 100',
  ['rental-yield-calculator', 'storage-unit-investment-calculator']
);

// #47 Cost Per Lead
add('cost-per-lead-calculator', 'Cost Per Lead Calculator',
  'Calculate the cost per lead from your marketing campaigns to measure advertising efficiency.',
  'Finance', 'finance', '$',
  ['cost per lead', 'CPL calculator', 'marketing cost per lead'],
  [
    '{ name: "adSpend", label: "Total Ad Spend", type: "number", suffix: "$", min: 100, max: 1000000, defaultValue: 5000 }',
    '{ name: "leads", label: "Number of Leads Generated", type: "number", suffix: "leads", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "conversionRate", label: "Lead to Customer Rate", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "avgDealValue", label: "Average Deal Value", type: "number", suffix: "$", min: 10, max: 100000, defaultValue: 500 }',
  ],
  `(inputs) => {
      const spend = inputs.adSpend as number;
      const leads = inputs.leads as number;
      const convRate = inputs.conversionRate as number;
      const dealValue = inputs.avgDealValue as number;
      if (!spend || !leads) return null;
      const cpl = spend / leads;
      const customers = leads * (convRate / 100);
      const cpa = customers > 0 ? spend / customers : 0;
      const revenue = customers * dealValue;
      const roas = spend > 0 ? revenue / spend : 0;
      return {
        primary: { label: "Cost Per Lead", value: "$" + formatNumber(cpl) },
        details: [
          { label: "Total Leads", value: formatNumber(leads) },
          { label: "Estimated Customers", value: formatNumber(Math.round(customers)) },
          { label: "Cost Per Acquisition", value: "$" + formatNumber(cpa) },
          { label: "Estimated Revenue", value: "$" + formatNumber(revenue) },
          { label: "Return on Ad Spend", value: formatNumber(roas) + "x" },
        ],
      };
    }`,
  [{ q: 'What is a good cost per lead?', a: 'A good cost per lead varies by industry. B2B leads typically cost $30 to $200, while B2C leads cost $5 to $50. The key metric is whether the CPL allows profitable customer acquisition.' },
   { q: 'How do you reduce cost per lead?', a: 'Reduce CPL by improving ad targeting, optimizing landing pages, A/B testing ad creative, using retargeting campaigns, and focusing on channels that produce the highest quality leads.' }],
  'CPL = Total Ad Spend / Number of Leads; CPA = Ad Spend / Customers',
  ['customer-acquisition-cost-calculator', 'churn-rate-calculator']
);

// #48 Customer Acquisition Cost
add('customer-acquisition-cost-calculator', 'Customer Acquisition Cost Calculator',
  'Calculate the total cost of acquiring a new customer including all marketing and sales expenses.',
  'Finance', 'finance', '$',
  ['customer acquisition cost', 'CAC calculator', 'cost to acquire customer'],
  [
    '{ name: "marketingCost", label: "Monthly Marketing Spend", type: "number", suffix: "$", min: 100, max: 500000, defaultValue: 10000 }',
    '{ name: "salesCost", label: "Monthly Sales Team Cost", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 15000 }',
    '{ name: "newCustomers", label: "New Customers per Month", type: "number", suffix: "customers", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "ltv", label: "Customer Lifetime Value", type: "number", suffix: "$", min: 50, max: 100000, defaultValue: 2000 }',
  ],
  `(inputs) => {
      const marketing = inputs.marketingCost as number;
      const sales = inputs.salesCost as number;
      const customers = inputs.newCustomers as number;
      const ltv = inputs.ltv as number;
      if (!customers) return null;
      const totalCost = marketing + sales;
      const cac = totalCost / customers;
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;
      const paybackMonths = cac > 0 && ltv > 0 ? Math.ceil(cac / (ltv / 12)) : 0;
      const annualCac = totalCost * 12;
      return {
        primary: { label: "Customer Acquisition Cost", value: "$" + formatNumber(cac) },
        details: [
          { label: "Monthly Total Spend", value: "$" + formatNumber(totalCost) },
          { label: "Annual Acquisition Spend", value: "$" + formatNumber(annualCac) },
          { label: "LTV to CAC Ratio", value: formatNumber(ltvCacRatio) + ":1" },
          { label: "CAC Payback Period", value: paybackMonths + " months" },
          { label: "Customer Lifetime Value", value: "$" + formatNumber(ltv) },
        ],
      };
    }`,
  [{ q: 'What is a good LTV to CAC ratio?', a: 'A healthy LTV to CAC ratio is 3:1 or higher, meaning you earn three times what you spend to acquire each customer. A ratio below 1:1 means you are losing money on customer acquisition.' },
   { q: 'How do you calculate customer acquisition cost?', a: 'CAC equals total marketing and sales costs divided by the number of new customers acquired during that period. Include all salaries, ad spend, tools, and overhead related to acquisition.' }],
  'CAC = (Marketing Cost + Sales Cost) / New Customers; LTV:CAC = Lifetime Value / CAC',
  ['cost-per-lead-calculator', 'churn-rate-calculator']
);

// #49 SaaS MRR
add('saas-mrr-calculator', 'SaaS MRR Calculator',
  'Calculate monthly recurring revenue for a SaaS business including new, expansion, and churned revenue.',
  'Finance', 'finance', '$',
  ['SaaS MRR', 'monthly recurring revenue', 'SaaS revenue calculator'],
  [
    '{ name: "customers", label: "Total Customers", type: "number", suffix: "customers", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "arpu", label: "Average Revenue per User (Monthly)", type: "number", suffix: "$", min: 5, max: 10000, defaultValue: 50 }',
    '{ name: "newMRR", label: "New MRR This Month", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 3000 }',
    '{ name: "churnedMRR", label: "Churned MRR This Month", type: "number", suffix: "$", min: 0, max: 500000, defaultValue: 1000 }',
  ],
  `(inputs) => {
      const customers = inputs.customers as number;
      const arpu = inputs.arpu as number;
      const newMRR = inputs.newMRR as number;
      const churnedMRR = inputs.churnedMRR as number;
      if (!customers || !arpu) return null;
      const baseMRR = customers * arpu;
      const netNewMRR = newMRR - churnedMRR;
      const totalMRR = baseMRR + netNewMRR;
      const arr = totalMRR * 12;
      const revenueChurnRate = baseMRR > 0 ? (churnedMRR / baseMRR) * 100 : 0;
      return {
        primary: { label: "Total MRR", value: "$" + formatNumber(totalMRR) },
        details: [
          { label: "Base MRR", value: "$" + formatNumber(baseMRR) },
          { label: "New MRR", value: "$" + formatNumber(newMRR) },
          { label: "Churned MRR", value: "$" + formatNumber(churnedMRR) },
          { label: "Net New MRR", value: "$" + formatNumber(netNewMRR) },
          { label: "ARR (Annualized)", value: "$" + formatNumber(arr) },
          { label: "Revenue Churn Rate", value: formatNumber(revenueChurnRate) + "%" },
        ],
      };
    }`,
  [{ q: 'What is MRR?', a: 'Monthly Recurring Revenue (MRR) is the predictable monthly income from subscriptions. It equals the number of paying customers multiplied by the average revenue per user.' },
   { q: 'What is a good MRR growth rate?', a: 'A healthy SaaS company grows MRR by 10 to 20 percent month over month in early stages. Mature SaaS companies typically grow 5 to 10 percent monthly.' }],
  'MRR = Customers x ARPU + New MRR - Churned MRR; ARR = MRR x 12',
  ['churn-rate-calculator', 'burn-rate-calculator']
);

// #50 Churn Rate
add('churn-rate-calculator', 'Churn Rate Calculator',
  'Calculate customer churn rate and its impact on revenue and business growth.',
  'Finance', 'finance', '$',
  ['churn rate', 'customer churn calculator', 'attrition rate'],
  [
    '{ name: "startCustomers", label: "Customers at Start of Period", type: "number", suffix: "customers", min: 10, max: 1000000, defaultValue: 1000 }',
    '{ name: "lostCustomers", label: "Customers Lost During Period", type: "number", suffix: "customers", min: 0, max: 100000, defaultValue: 50 }',
    '{ name: "arpu", label: "Average Revenue per User (Monthly)", type: "number", suffix: "$", min: 5, max: 5000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const start = inputs.startCustomers as number;
      const lost = inputs.lostCustomers as number;
      const arpu = inputs.arpu as number;
      if (!start || start <= 0) return null;
      const churnRate = (lost / start) * 100;
      const retentionRate = 100 - churnRate;
      const lostRevenue = lost * arpu;
      const annualChurn = (1 - Math.pow(1 - lost / start, 12)) * 100;
      const remainingAfterYear = Math.round(start * Math.pow(1 - lost / start, 12));
      return {
        primary: { label: "Monthly Churn Rate", value: formatNumber(churnRate) + "%" },
        details: [
          { label: "Retention Rate", value: formatNumber(retentionRate) + "%" },
          { label: "Monthly Lost Revenue", value: "$" + formatNumber(lostRevenue) },
          { label: "Annualized Churn Rate", value: formatNumber(annualChurn) + "%" },
          { label: "Projected Customers After 1 Year", value: formatNumber(remainingAfterYear) },
          { label: "Annual Revenue Loss", value: "$" + formatNumber(lostRevenue * 12) },
        ],
      };
    }`,
  [{ q: 'What is a good churn rate?', a: 'For SaaS companies, a monthly churn rate of 2 to 5 percent is common. Enterprise SaaS should aim for under 1 percent monthly churn. Annual churn below 10 percent is considered excellent.' },
   { q: 'How do you reduce churn?', a: 'Reduce churn by improving onboarding, providing proactive customer support, gathering and acting on feedback, adding engagement features, and identifying at-risk customers early.' }],
  'Churn Rate = (Customers Lost / Starting Customers) x 100; Annual Churn = 1 - (1 - Monthly Churn)^12',
  ['saas-mrr-calculator', 'customer-acquisition-cost-calculator']
);

// #51 Burn Rate
add('burn-rate-calculator', 'Burn Rate Calculator',
  'Calculate your startup burn rate and remaining runway based on current cash and monthly expenses.',
  'Finance', 'finance', '$',
  ['burn rate calculator', 'startup runway', 'cash runway calculator'],
  [
    '{ name: "cashOnHand", label: "Cash on Hand", type: "number", suffix: "$", min: 1000, max: 50000000, defaultValue: 500000 }',
    '{ name: "monthlyExpenses", label: "Monthly Expenses", type: "number", suffix: "$", min: 1000, max: 5000000, defaultValue: 80000 }',
    '{ name: "monthlyRevenue", label: "Monthly Revenue", type: "number", suffix: "$", min: 0, max: 5000000, defaultValue: 30000 }',
  ],
  `(inputs) => {
      const cash = inputs.cashOnHand as number;
      const expenses = inputs.monthlyExpenses as number;
      const revenue = inputs.monthlyRevenue as number;
      if (!cash || !expenses) return null;
      const grossBurn = expenses;
      const netBurn = expenses - revenue;
      const grossRunway = grossBurn > 0 ? Math.floor(cash / grossBurn) : 0;
      const netRunway = netBurn > 0 ? Math.floor(cash / netBurn) : 0;
      const runwayDisplay = netBurn <= 0 ? "Profitable" : netRunway + " months";
      const annualBurn = netBurn * 12;
      return {
        primary: { label: "Net Runway", value: runwayDisplay },
        details: [
          { label: "Gross Burn Rate", value: "$" + formatNumber(grossBurn) + "/month" },
          { label: "Net Burn Rate", value: "$" + formatNumber(netBurn) + "/month" },
          { label: "Gross Runway", value: grossRunway + " months" },
          { label: "Annual Net Burn", value: "$" + formatNumber(annualBurn) },
          { label: "Monthly Revenue", value: "$" + formatNumber(revenue) },
        ],
      };
    }`,
  [{ q: 'What is burn rate?', a: 'Burn rate is the amount of money a startup spends each month in excess of revenue. Gross burn is total monthly spending. Net burn is monthly spending minus monthly revenue.' },
   { q: 'How much runway should a startup have?', a: 'Most investors and advisors recommend maintaining at least 12 to 18 months of runway. Start fundraising when you have 6 to 9 months of runway remaining.' }],
  'Net Burn = Monthly Expenses - Monthly Revenue; Runway = Cash on Hand / Net Burn',
  ['saas-mrr-calculator', 'churn-rate-calculator']
);

// #52 Stock Option
add('stock-option-calculator', 'Stock Option Calculator',
  'Calculate the potential value of employee stock options based on strike price, current price, and vesting schedule.',
  'Finance', 'finance', '$',
  ['stock option value', 'employee stock options', 'option value calculator'],
  [
    '{ name: "shares", label: "Number of Options", type: "number", suffix: "shares", min: 100, max: 1000000, defaultValue: 10000 }',
    '{ name: "strikePrice", label: "Strike Price", type: "number", suffix: "$", min: 0.01, max: 5000, defaultValue: 5 }',
    '{ name: "currentPrice", label: "Current or Expected Price", type: "number", suffix: "$", min: 0.01, max: 5000, defaultValue: 25 }',
    '{ name: "vestedPct", label: "Percent Vested", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
      const shares = inputs.shares as number;
      const strike = inputs.strikePrice as number;
      const current = inputs.currentPrice as number;
      const vestedPct = inputs.vestedPct as number;
      if (!shares || !strike || !current) return null;
      const spreadPerShare = Math.max(current - strike, 0);
      const totalValue = shares * spreadPerShare;
      const vestedShares = Math.round(shares * (vestedPct / 100));
      const vestedValue = vestedShares * spreadPerShare;
      const unvestedValue = totalValue - vestedValue;
      const taxEstimate = vestedValue * 0.32;
      return {
        primary: { label: "Total Option Value", value: "$" + formatNumber(totalValue) },
        details: [
          { label: "Spread per Share", value: "$" + formatNumber(spreadPerShare) },
          { label: "Vested Shares", value: formatNumber(vestedShares) },
          { label: "Vested Value", value: "$" + formatNumber(vestedValue) },
          { label: "Unvested Value", value: "$" + formatNumber(unvestedValue) },
          { label: "Estimated Tax on Exercise (32%)", value: "$" + formatNumber(taxEstimate) },
        ],
      };
    }`,
  [{ q: 'How are stock options taxed?', a: 'Incentive stock options (ISOs) may qualify for capital gains treatment if held for one year after exercise and two years after grant. Non-qualified options (NSOs) are taxed as ordinary income on the spread at exercise.' },
   { q: 'What is the strike price?', a: 'The strike price is the fixed price at which you can purchase company stock. If the current market price exceeds the strike price, your options are in the money and have value.' }],
  'Option Value = (Current Price - Strike Price) x Number of Shares; Vested Value = Option Value x Vested Percent',
  ['rsu-tax-calculator', 'espp-calculator']
);

// #53 RSU Tax
add('rsu-tax-calculator', 'RSU Tax Calculator',
  'Calculate the tax impact and net value of restricted stock units at vesting.',
  'Finance', 'finance', '$',
  ['RSU tax calculator', 'restricted stock unit tax', 'RSU vesting value'],
  [
    '{ name: "shares", label: "RSU Shares Vesting", type: "number", suffix: "shares", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "vestPrice", label: "Price at Vesting", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "taxRate", label: "Combined Tax Rate", type: "number", suffix: "%", min: 10, max: 55, defaultValue: 37 }',
    '{ name: "sellPrice", label: "Planned Sell Price", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 120 }',
  ],
  `(inputs) => {
      const shares = inputs.shares as number;
      const vestPrice = inputs.vestPrice as number;
      const taxRate = inputs.taxRate as number;
      const sellPrice = inputs.sellPrice as number;
      if (!shares || !vestPrice) return null;
      const grossValue = shares * vestPrice;
      const taxAtVest = grossValue * (taxRate / 100);
      const netAtVest = grossValue - taxAtVest;
      const sharesWithheld = Math.ceil(shares * (taxRate / 100));
      const sharesRemaining = shares - sharesWithheld;
      const additionalGain = (sellPrice - vestPrice) * sharesRemaining;
      const capGainsTax = additionalGain > 0 ? additionalGain * 0.20 : 0;
      const totalNet = netAtVest + additionalGain - capGainsTax;
      return {
        primary: { label: "Net Value at Vesting", value: "$" + formatNumber(netAtVest) },
        details: [
          { label: "Gross Value", value: "$" + formatNumber(grossValue) },
          { label: "Tax Withholding at Vesting", value: "$" + formatNumber(taxAtVest) },
          { label: "Shares Withheld for Tax", value: formatNumber(sharesWithheld) },
          { label: "Shares Remaining", value: formatNumber(sharesRemaining) },
          { label: "Additional Gain if Sold at $" + formatNumber(sellPrice), value: "$" + formatNumber(additionalGain) },
          { label: "Total Net Value (after all taxes)", value: "$" + formatNumber(totalNet) },
        ],
      };
    }`,
  [{ q: 'How are RSUs taxed?', a: 'RSUs are taxed as ordinary income at vesting based on the fair market value. Your employer typically withholds shares to cover taxes. Any additional gain after vesting is taxed as capital gains.' },
   { q: 'Should I sell RSUs immediately at vesting?', a: 'Many financial advisors recommend selling RSUs at vesting and diversifying, since holding concentrates risk in your employer stock. However, the decision depends on your financial situation and outlook for the stock.' }],
  'Net Value = (Shares x Vest Price) - (Gross Value x Tax Rate); Additional Gain = (Sell Price - Vest Price) x Remaining Shares',
  ['stock-option-calculator', 'espp-calculator']
);

// #54 ESPP
add('espp-calculator', 'ESPP Calculator',
  'Calculate the value and return of participating in an employee stock purchase plan.',
  'Finance', 'finance', '$',
  ['ESPP calculator', 'employee stock purchase plan', 'ESPP return'],
  [
    '{ name: "salary", label: "Annual Salary", type: "number", suffix: "$", min: 20000, max: 1000000, defaultValue: 100000 }',
    '{ name: "contributionPct", label: "Contribution Percent", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 10 }',
    '{ name: "discount", label: "ESPP Discount", type: "number", suffix: "%", min: 5, max: 15, defaultValue: 15 }',
    '{ name: "currentPrice", label: "Current Stock Price", type: "number", suffix: "$", min: 1, max: 5000, defaultValue: 150 }',
  ],
  `(inputs) => {
      const salary = inputs.salary as number;
      const contrib = inputs.contributionPct as number;
      const discount = inputs.discount as number;
      const price = inputs.currentPrice as number;
      if (!salary || !contrib || !price) return null;
      const annualContrib = salary * (contrib / 100);
      const maxContrib = Math.min(annualContrib, 25000);
      const purchasePrice = price * (1 - discount / 100);
      const sharesBought = Math.floor(maxContrib / purchasePrice);
      const marketValue = sharesBought * price;
      const instantGain = marketValue - (sharesBought * purchasePrice);
      const returnPct = purchasePrice > 0 ? (instantGain / (sharesBought * purchasePrice)) * 100 : 0;
      return {
        primary: { label: "Instant Gain", value: "$" + formatNumber(instantGain) },
        details: [
          { label: "Annual Contribution", value: "$" + formatNumber(maxContrib) },
          { label: "Purchase Price per Share", value: "$" + formatNumber(purchasePrice) },
          { label: "Shares Purchased", value: formatNumber(sharesBought) },
          { label: "Market Value", value: "$" + formatNumber(marketValue) },
          { label: "Effective Return", value: formatNumber(returnPct) + "%" },
        ],
      };
    }`,
  [{ q: 'How does an ESPP work?', a: 'An ESPP allows employees to purchase company stock at a discount, typically 15 percent below market price. Contributions are deducted from your paycheck over a purchase period, usually 6 months.' },
   { q: 'What is the ESPP contribution limit?', a: 'The IRS limits ESPP purchases to $25,000 worth of stock per calendar year, based on the fair market value at the start of the offering period.' }],
  'Instant Gain = (Market Price - Purchase Price) x Shares; Return = Gain / Cost x 100',
  ['stock-option-calculator', 'rsu-tax-calculator']
);

// #55 Backdoor Roth
add('backdoor-roth-calculator', 'Backdoor Roth Calculator',
  'Calculate the value of a backdoor Roth IRA conversion including tax impact and long-term growth.',
  'Finance', 'finance', '$',
  ['backdoor Roth IRA', 'Roth conversion calculator', 'backdoor Roth value'],
  [
    '{ name: "contribution", label: "Annual Contribution", type: "number", suffix: "$", min: 1000, max: 7000, defaultValue: 7000 }',
    '{ name: "years", label: "Years Until Retirement", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 20 }',
    '{ name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 7 }',
    '{ name: "taxRate", label: "Current Tax Rate", type: "number", suffix: "%", min: 10, max: 50, defaultValue: 32 }',
  ],
  `(inputs) => {
      const contrib = inputs.contribution as number;
      const years = inputs.years as number;
      const rate = inputs.returnRate as number;
      const taxRate = inputs.taxRate as number;
      if (!contrib || !years || !rate) return null;
      const r = rate / 100;
      const futureValue = contrib * ((Math.pow(1 + r, years) - 1) / r);
      const totalContributed = contrib * years;
      const growth = futureValue - totalContributed;
      const taxSaved = growth * (taxRate / 100);
      const traditionalAfterTax = futureValue * (1 - taxRate / 100);
      return {
        primary: { label: "Tax-Free Roth Value", value: "$" + formatNumber(futureValue) },
        details: [
          { label: "Total Contributions", value: "$" + formatNumber(totalContributed) },
          { label: "Investment Growth", value: "$" + formatNumber(growth) },
          { label: "Tax Saved vs Traditional", value: "$" + formatNumber(taxSaved) },
          { label: "Traditional IRA After Tax", value: "$" + formatNumber(traditionalAfterTax) },
          { label: "Roth Advantage", value: "$" + formatNumber(futureValue - traditionalAfterTax) },
        ],
      };
    }`,
  [{ q: 'What is a backdoor Roth IRA?', a: 'A backdoor Roth IRA is a strategy where you contribute to a traditional IRA and then convert it to a Roth IRA. This allows high-income earners who exceed Roth IRA income limits to still contribute to a Roth account.' },
   { q: 'Is there a limit on backdoor Roth conversions?', a: 'There is no income limit for Roth conversions, but the annual IRA contribution limit applies to the initial traditional IRA contribution. For 2024, this limit is $7,000 per year ($8,000 if age 50 or older).' }],
  'Future Value = Contribution x ((1 + Rate)^Years - 1) / Rate; Tax Saved = Growth x Tax Rate',
  ['mega-backdoor-roth-calculator', 'required-minimum-distribution-calculator']
);

// #56 Mega Backdoor Roth
add('mega-backdoor-roth-calculator', 'Mega Backdoor Roth Calculator',
  'Calculate the potential value of a mega backdoor Roth strategy using after-tax 401k contributions.',
  'Finance', 'finance', '$',
  ['mega backdoor Roth', 'after-tax 401k conversion', 'mega Roth calculator'],
  [
    '{ name: "afterTaxContrib", label: "Annual After-Tax 401k Contribution", type: "number", suffix: "$", min: 1000, max: 50000, defaultValue: 30000 }',
    '{ name: "years", label: "Years of Contributions", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 15 }',
    '{ name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 7 }',
    '{ name: "preTaxContrib", label: "Pre-Tax 401k Contribution", type: "number", suffix: "$", min: 0, max: 23500, defaultValue: 23000 }',
  ],
  `(inputs) => {
      const afterTax = inputs.afterTaxContrib as number;
      const years = inputs.years as number;
      const rate = inputs.returnRate as number;
      const preTax = inputs.preTaxContrib as number;
      if (!afterTax || !years || !rate) return null;
      const r = rate / 100;
      const megaRothFV = afterTax * ((Math.pow(1 + r, years) - 1) / r);
      const preTaxFV = preTax * ((Math.pow(1 + r, years) - 1) / r);
      const totalContrib = (afterTax + preTax) * years;
      const totalFV = megaRothFV + preTaxFV;
      const taxFreeGrowth = megaRothFV - (afterTax * years);
      return {
        primary: { label: "Mega Backdoor Roth Value", value: "$" + formatNumber(megaRothFV) },
        details: [
          { label: "After-Tax Contributions", value: "$" + formatNumber(afterTax * years) },
          { label: "Tax-Free Growth", value: "$" + formatNumber(taxFreeGrowth) },
          { label: "Pre-Tax 401k Value", value: "$" + formatNumber(preTaxFV) },
          { label: "Combined Retirement Value", value: "$" + formatNumber(totalFV) },
          { label: "Total Contributions", value: "$" + formatNumber(totalContrib) },
        ],
      };
    }`,
  [{ q: 'What is a mega backdoor Roth?', a: 'A mega backdoor Roth involves making after-tax contributions to your 401k (above the pre-tax limit) and then converting them to a Roth account. The total 401k limit including after-tax contributions is $69,000 for 2024.' },
   { q: 'Does every 401k plan allow mega backdoor Roth?', a: 'No, your plan must allow after-tax contributions and in-plan Roth conversions or in-service withdrawals. Not all employer plans offer these features, so you must check with your plan administrator.' }],
  'Mega Roth FV = After-Tax Contribution x ((1 + Rate)^Years - 1) / Rate',
  ['backdoor-roth-calculator', 'required-minimum-distribution-calculator']
);

// #57 Required Minimum Distribution
add('required-minimum-distribution-calculator', 'RMD Calculator',
  'Calculate the required minimum distribution from your retirement accounts based on age and balance.',
  'Finance', 'finance', '$',
  ['RMD calculator', 'required minimum distribution', 'IRA RMD calculation'],
  [
    '{ name: "balance", label: "Account Balance (Dec 31 Prior Year)", type: "number", suffix: "$", min: 1000, max: 20000000, defaultValue: 500000 }',
    '{ name: "age", label: "Your Age This Year", type: "number", suffix: "years", min: 73, max: 120, defaultValue: 75 }',
    '{ name: "taxRate", label: "Estimated Tax Rate", type: "number", suffix: "%", min: 10, max: 50, defaultValue: 24 }',
  ],
  `(inputs) => {
      const balance = inputs.balance as number;
      const age = inputs.age as number;
      const taxRate = inputs.taxRate as number;
      if (!balance || !age || age < 73) return null;
      const lifeExpTable: Record<number, number> = {73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,90:12.2,91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,97:7.8,98:7.3,99:6.8,100:6.4};
      const factor = lifeExpTable[Math.min(age, 100)] || 6.4;
      const rmd = balance / factor;
      const taxOwed = rmd * (taxRate / 100);
      const netDistribution = rmd - taxOwed;
      const monthlyRmd = rmd / 12;
      return {
        primary: { label: "Annual RMD", value: "$" + formatNumber(rmd) },
        details: [
          { label: "Account Balance", value: "$" + formatNumber(balance) },
          { label: "Distribution Factor", value: formatNumber(factor) },
          { label: "Estimated Tax", value: "$" + formatNumber(taxOwed) },
          { label: "Net After Tax", value: "$" + formatNumber(netDistribution) },
          { label: "Monthly Equivalent", value: "$" + formatNumber(monthlyRmd) },
        ],
      };
    }`,
  [{ q: 'When do RMDs start?', a: 'Under the SECURE 2.0 Act, RMDs begin at age 73 for those born between 1951 and 1959, and age 75 for those born in 1960 or later. Roth IRAs do not require RMDs during the owner lifetime.' },
   { q: 'What happens if you do not take your RMD?', a: 'Failing to take your full RMD results in a 25 percent excise tax on the amount not withdrawn. This penalty can be reduced to 10 percent if corrected within two years.' }],
  'RMD = Account Balance / Distribution Factor (based on IRS life expectancy table)',
  ['backdoor-roth-calculator', 'pension-vs-lump-sum-calculator']
);

// #58 Social Security Break-Even
add('social-security-break-even-calculator', 'Social Security Break-Even Calculator',
  'Determine the optimal age to claim Social Security by comparing cumulative benefits at different starting ages.',
  'Finance', 'finance', '$',
  ['Social Security break even', 'SS claiming age', 'Social Security calculator'],
  [
    '{ name: "benefit62", label: "Monthly Benefit at Age 62", type: "number", suffix: "$", min: 100, max: 5000, defaultValue: 1500 }',
    '{ name: "fra", label: "Full Retirement Age", type: "number", suffix: "years", min: 65, max: 67, defaultValue: 67 }',
    '{ name: "benefitFRA", label: "Monthly Benefit at FRA", type: "number", suffix: "$", min: 100, max: 5000, defaultValue: 2200 }',
    '{ name: "benefit70", label: "Monthly Benefit at Age 70", type: "number", suffix: "$", min: 100, max: 5000, defaultValue: 2700 }',
  ],
  `(inputs) => {
      const b62 = inputs.benefit62 as number;
      const fra = inputs.fra as number;
      const bFRA = inputs.benefitFRA as number;
      const b70 = inputs.benefit70 as number;
      if (!b62 || !bFRA || !b70) return null;
      const annual62 = b62 * 12;
      const annualFRA = bFRA * 12;
      const annual70 = b70 * 12;
      let breakEvenFRA = 0;
      let cum62 = 0;
      let cumFRA = 0;
      for (let age = 62; age <= 95; age++) {
        cum62 += annual62;
        if (age >= fra) cumFRA += annualFRA;
        if (cumFRA > cum62 && breakEvenFRA === 0) breakEvenFRA = age;
      }
      let breakEven70 = 0;
      cum62 = 0;
      let cum70 = 0;
      for (let age = 62; age <= 95; age++) {
        cum62 += annual62;
        if (age >= 70) cum70 += annual70;
        if (cum70 > cum62 && breakEven70 === 0) breakEven70 = age;
      }
      return {
        primary: { label: "Break-Even Age (FRA vs 62)", value: breakEvenFRA > 0 ? "Age " + breakEvenFRA : "Beyond 95" },
        details: [
          { label: "Annual Benefit at 62", value: "$" + formatNumber(annual62) },
          { label: "Annual Benefit at FRA", value: "$" + formatNumber(annualFRA) },
          { label: "Annual Benefit at 70", value: "$" + formatNumber(annual70) },
          { label: "Break-Even (70 vs 62)", value: breakEven70 > 0 ? "Age " + breakEven70 : "Beyond 95" },
          { label: "Extra Annual Income (70 vs 62)", value: "$" + formatNumber(annual70 - annual62) },
        ],
      };
    }`,
  [{ q: 'When should I claim Social Security?', a: 'If you expect to live past your break-even age, delaying benefits is usually better. Claiming at 70 provides the highest monthly benefit, about 77 percent more than claiming at 62.' },
   { q: 'How much does Social Security increase each year you wait?', a: 'Benefits increase approximately 6 to 7 percent per year from age 62 to your full retirement age, and 8 percent per year from FRA to age 70. There is no benefit to waiting past age 70.' }],
  'Break-Even Age = age where cumulative benefits from later claiming exceed cumulative benefits from earlier claiming',
  ['pension-vs-lump-sum-calculator', 'annuity-payout-calculator']
);

// #59 Pension vs Lump Sum
add('pension-vs-lump-sum-calculator', 'Pension vs Lump Sum Calculator',
  'Compare the value of receiving a monthly pension versus taking a lump sum payout.',
  'Finance', 'finance', '$',
  ['pension vs lump sum', 'pension calculator', 'lump sum vs annuity'],
  [
    '{ name: "monthlyPension", label: "Monthly Pension Amount", type: "number", suffix: "$", min: 500, max: 20000, defaultValue: 3000 }',
    '{ name: "lumpSum", label: "Lump Sum Offer", type: "number", suffix: "$", min: 50000, max: 5000000, defaultValue: 500000 }',
    '{ name: "yearsInRetirement", label: "Expected Years in Retirement", type: "number", suffix: "years", min: 5, max: 40, defaultValue: 25 }',
    '{ name: "investReturn", label: "Expected Investment Return", type: "number", suffix: "%", min: 1, max: 12, defaultValue: 5 }',
  ],
  `(inputs) => {
      const pension = inputs.monthlyPension as number;
      const lump = inputs.lumpSum as number;
      const years = inputs.yearsInRetirement as number;
      const ret = inputs.investReturn as number;
      if (!pension || !lump || !years) return null;
      const totalPension = pension * 12 * years;
      const r = ret / 100 / 12;
      const months = years * 12;
      const lumpFV = lump * Math.pow(1 + r, months);
      const monthlyFromLump = r > 0 ? (lump * r) / (1 - Math.pow(1 + r, -months)) : lump / months;
      const better = totalPension > lump ? "Pension" : "Lump Sum";
      const pensionImpliedReturn = lump > 0 ? ((totalPension / lump - 1) / years) * 100 : 0;
      return {
        primary: { label: "Better Option", value: better },
        details: [
          { label: "Total Pension Payments", value: "$" + formatNumber(totalPension) },
          { label: "Lump Sum Offered", value: "$" + formatNumber(lump) },
          { label: "Lump Sum Grown (" + ret + "%)", value: "$" + formatNumber(lumpFV) },
          { label: "Monthly Draw from Lump Sum", value: "$" + formatNumber(monthlyFromLump) },
          { label: "Pension vs Lump Draw Difference", value: "$" + formatNumber(pension - monthlyFromLump) + "/month" },
        ],
      };
    }`,
  [{ q: 'Should I take the pension or lump sum?', a: 'The best choice depends on your life expectancy, investment skill, other income sources, and need for survivor benefits. If you expect to live a long time and want guaranteed income, the pension is often better.' },
   { q: 'What is the break-even point for pension vs lump sum?', a: 'Divide the lump sum by the annual pension to get the break-even years. If the result is less than your expected retirement years, the pension may be the better choice.' }],
  'Total Pension = Monthly Payment x 12 x Years; Lump Sum Draw = (Lump x Rate) / (1 - (1 + Rate)^-Months)',
  ['annuity-payout-calculator', 'social-security-break-even-calculator']
);

// #60 Annuity Payout
add('annuity-payout-calculator', 'Annuity Payout Calculator',
  'Estimate the monthly payout from an annuity based on your investment amount, interest rate, and payout period.',
  'Finance', 'finance', '$',
  ['annuity payout', 'annuity payment calculator', 'annuity income'],
  [
    '{ name: "principal", label: "Annuity Investment", type: "number", suffix: "$", min: 10000, max: 5000000, defaultValue: 250000 }',
    '{ name: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "payoutYears", label: "Payout Period", type: "number", suffix: "years", min: 5, max: 40, defaultValue: 20 }',
    '{ name: "deferralYears", label: "Deferral Period", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 0 }',
  ],
  `(inputs) => {
      const principal = inputs.principal as number;
      const annualRate = inputs.rate as number;
      const payoutYears = inputs.payoutYears as number;
      const deferral = inputs.deferralYears as number;
      if (!principal || !annualRate || !payoutYears) return null;
      const r = annualRate / 100;
      const accumulated = principal * Math.pow(1 + r, deferral);
      const monthlyRate = r / 12;
      const months = payoutYears * 12;
      const monthlyPayout = monthlyRate > 0 ? (accumulated * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)) : accumulated / months;
      const annualPayout = monthlyPayout * 12;
      const totalPayout = monthlyPayout * months;
      const totalInterest = totalPayout - accumulated;
      return {
        primary: { label: "Monthly Payout", value: "$" + formatNumber(monthlyPayout) },
        details: [
          { label: "Accumulated Value (after deferral)", value: "$" + formatNumber(accumulated) },
          { label: "Annual Payout", value: "$" + formatNumber(annualPayout) },
          { label: "Total Payouts", value: "$" + formatNumber(totalPayout) },
          { label: "Total Interest Earned", value: "$" + formatNumber(totalInterest) },
          { label: "Payout to Investment Ratio", value: formatNumber(totalPayout / principal) + "x" },
        ],
      };
    }`,
  [{ q: 'What is an annuity?', a: 'An annuity is a financial product that provides regular payments over a specified period. You invest a lump sum with an insurance company, and they pay you a guaranteed income stream, either immediately or after a deferral period.' },
   { q: 'Are annuity payments taxable?', a: 'Yes, the interest portion of annuity payments is taxed as ordinary income. If you purchased the annuity with after-tax dollars, a portion of each payment is a tax-free return of principal based on an exclusion ratio.' }],
  'Monthly Payout = (Accumulated Value x Monthly Rate) / (1 - (1 + Monthly Rate)^-Months)',
  ['pension-vs-lump-sum-calculator', 'social-security-break-even-calculator']
);

// #61 Biological Age
add('biological-age-calculator', 'Biological Age Calculator',
  'Estimate your biological age versus your chronological age based on lifestyle factors.',
  'Health', 'health', 'H',
  ['biological age', 'real age calculator', 'body age test'],
  [
    '{ name: "age", label: "Chronological Age", type: "number", suffix: "years", min: 18, max: 100, defaultValue: 35 }',
    '{ name: "exercise", label: "Exercise (hours per week)", type: "number", suffix: "hrs", min: 0, max: 40, defaultValue: 3 }',
    '{ name: "sleep", label: "Average Sleep per Night", type: "number", suffix: "hours", min: 3, max: 12, defaultValue: 7 }',
    '{ name: "smoking", label: "Smoking Status", type: "select", options: [{value:"none",label:"Non-smoker"},{value:"former",label:"Former Smoker"},{value:"current",label:"Current Smoker"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const exercise = inputs.exercise as number;
      const sleep = inputs.sleep as number;
      const smoking = inputs.smoking as string;
      if (!age || age <= 0) return null;
      let bioAge = age;
      if (exercise >= 5) bioAge -= 3;
      else if (exercise >= 3) bioAge -= 1.5;
      else if (exercise < 1) bioAge += 2;
      if (sleep >= 7 && sleep <= 9) bioAge -= 1;
      else if (sleep < 6) bioAge += 3;
      else if (sleep > 9) bioAge += 1;
      const smokeMod: Record<string, number> = { none: 0, former: 2, current: 5 };
      bioAge += smokeMod[smoking] || 0;
      const diff = bioAge - age;
      const status = diff <= -2 ? "Younger than your age" : diff >= 2 ? "Older than your age" : "About your age";
      return {
        primary: { label: "Estimated Biological Age", value: formatNumber(Math.round(bioAge)) + " years" },
        details: [
          { label: "Chronological Age", value: formatNumber(age) + " years" },
          { label: "Difference", value: (diff > 0 ? "+" : "") + formatNumber(Math.round(diff * 10) / 10) + " years" },
          { label: "Assessment", value: status },
        ],
      };
    }`,
  [{ q: 'What is biological age?', a: 'Biological age is an estimate of how old your body functions compared to your actual chronological age, based on lifestyle and health factors.' },
   { q: 'Can you reverse biological aging?', a: 'Yes, improvements in exercise, sleep, diet, and stress management can help reduce your biological age over time.' }],
  'Biological Age = Chronological Age + Exercise Modifier + Sleep Modifier + Smoking Modifier',
  ['bmi-calculator', 'body-fat-calculator']
);

// #62 Sleep Debt
add('sleep-debt-calculator', 'Sleep Debt Calculator',
  'Calculate your accumulated sleep deficit over a week based on your actual versus recommended sleep.',
  'Health', 'health', 'H',
  ['sleep debt', 'sleep deficit calculator', 'sleep deprivation calculator'],
  [
    '{ name: "idealSleep", label: "Ideal Sleep per Night", type: "number", suffix: "hours", min: 5, max: 12, defaultValue: 8 }',
    '{ name: "actualSleep", label: "Actual Sleep per Night", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 6 }',
    '{ name: "days", label: "Number of Days", type: "number", suffix: "days", min: 1, max: 30, defaultValue: 7 }',
  ],
  `(inputs) => {
      const ideal = inputs.idealSleep as number;
      const actual = inputs.actualSleep as number;
      const days = inputs.days as number;
      if (!ideal || !actual || !days || ideal <= 0 || actual <= 0 || days <= 0) return null;
      const dailyDebt = ideal - actual;
      const totalDebt = dailyDebt * days;
      const recoveryDays = totalDebt > 0 ? Math.ceil(totalDebt / 2) : 0;
      const severity = totalDebt <= 0 ? "No debt" : totalDebt <= 5 ? "Mild" : totalDebt <= 10 ? "Moderate" : "Severe";
      return {
        primary: { label: "Total Sleep Debt", value: formatNumber(Math.max(0, totalDebt)) + " hours" },
        details: [
          { label: "Daily Deficit", value: formatNumber(Math.max(0, dailyDebt)) + " hours" },
          { label: "Severity", value: severity },
          { label: "Estimated Recovery Days", value: formatNumber(recoveryDays) + " days (sleeping 2 extra hrs)" },
        ],
      };
    }`,
  [{ q: 'What is sleep debt?', a: 'Sleep debt is the cumulative effect of not getting enough sleep over multiple nights, leading to fatigue and decreased cognitive performance.' },
   { q: 'How do you pay back sleep debt?', a: 'You can recover by gradually adding 1 to 2 extra hours of sleep per night. It is not recommended to try to sleep excessively in one session.' }],
  'Sleep Debt = (Ideal Sleep - Actual Sleep) x Number of Days',
  ['biological-age-calculator', 'calorie-calculator']
);

// #63 Hydration
add('hydration-calculator', 'Hydration Calculator',
  'Determine your recommended daily water intake based on weight, activity level, and climate.',
  'Health', 'health', 'H',
  ['hydration calculator', 'water intake calculator', 'daily water needs'],
  [
    '{ name: "weight", label: "Body Weight", type: "number", suffix: "lbs", min: 50, max: 500, defaultValue: 160 }',
    '{ name: "activity", label: "Activity Level", type: "select", options: [{value:"sedentary",label:"Sedentary"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"intense",label:"Very Active"}], defaultValue: "moderate" }',
    '{ name: "climate", label: "Climate", type: "select", options: [{value:"cool",label:"Cool"},{value:"temperate",label:"Temperate"},{value:"hot",label:"Hot and Humid"}], defaultValue: "temperate" }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const activity = inputs.activity as string;
      const climate = inputs.climate as string;
      if (!weight || weight <= 0) return null;
      let baseOz = weight * 0.5;
      const activityMod: Record<string, number> = { sedentary: 1.0, moderate: 1.2, active: 1.4, intense: 1.6 };
      const climateMod: Record<string, number> = { cool: 1.0, temperate: 1.1, hot: 1.3 };
      const totalOz = baseOz * (activityMod[activity] || 1.2) * (climateMod[climate] || 1.1);
      const cups = totalOz / 8;
      const liters = totalOz * 0.0295735;
      return {
        primary: { label: "Daily Water Intake", value: formatNumber(Math.round(totalOz)) + " oz" },
        details: [
          { label: "In Cups", value: formatNumber(Math.round(cups * 10) / 10) + " cups" },
          { label: "In Liters", value: formatNumber(Math.round(liters * 10) / 10) + " L" },
          { label: "Glasses (8 oz each)", value: formatNumber(Math.round(cups)) },
        ],
      };
    }`,
  [{ q: 'How much water should I drink per day?', a: 'A general guideline is half your body weight in ounces. For example, a 160 lb person should aim for about 80 oz per day, adjusted for activity and climate.' },
   { q: 'Does coffee count toward water intake?', a: 'Coffee does contribute to hydration but it has a mild diuretic effect. It is best to count it as about 50 to 75 percent of its volume toward your daily goal.' }],
  'Base Intake (oz) = Body Weight (lbs) x 0.5 x Activity Multiplier x Climate Multiplier',
  ['calorie-calculator', 'bmi-calculator']
);

// #64 Screen Time Impact
add('screen-time-impact-calculator', 'Screen Time Impact Calculator',
  'Assess the potential health effects of your daily screen time across devices.',
  'Health', 'health', 'H',
  ['screen time health', 'screen time calculator', 'digital wellness'],
  [
    '{ name: "phone", label: "Phone Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 3 }',
    '{ name: "computer", label: "Computer Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 4 }',
    '{ name: "tv", label: "TV Screen Time", type: "number", suffix: "hrs/day", min: 0, max: 16, defaultValue: 2 }',
    '{ name: "breaks", label: "Break Frequency", type: "select", options: [{value:"none",label:"Rarely Take Breaks"},{value:"some",label:"Every 1 to 2 Hours"},{value:"frequent",label:"Every 20 to 30 Minutes"}], defaultValue: "some" }',
  ],
  `(inputs) => {
      const phone = inputs.phone as number;
      const computer = inputs.computer as number;
      const tv = inputs.tv as number;
      const breaks = inputs.breaks as string;
      const total = (phone || 0) + (computer || 0) + (tv || 0);
      if (total <= 0) return null;
      let eyeStrainScore = total * 10;
      const breakMod: Record<string, number> = { none: 1.3, some: 1.0, frequent: 0.7 };
      eyeStrainScore *= breakMod[breaks] || 1.0;
      eyeStrainScore = Math.min(100, eyeStrainScore);
      const weeklyHrs = total * 7;
      const yearlyHrs = total * 365;
      const risk = eyeStrainScore < 30 ? "Low" : eyeStrainScore < 60 ? "Moderate" : "High";
      return {
        primary: { label: "Daily Screen Time", value: formatNumber(total) + " hours" },
        details: [
          { label: "Weekly Screen Time", value: formatNumber(weeklyHrs) + " hours" },
          { label: "Yearly Screen Time", value: formatNumber(Math.round(yearlyHrs)) + " hours" },
          { label: "Eye Strain Risk Score", value: formatNumber(Math.round(eyeStrainScore)) + " / 100 (" + risk + ")" },
        ],
      };
    }`,
  [{ q: 'How much screen time is too much?', a: 'For adults, more than 6 to 8 hours of non-work screen time per day is associated with negative health effects including eye strain, poor sleep, and sedentary lifestyle risks.' },
   { q: 'What is the 20-20-20 rule?', a: 'Every 20 minutes, look at something 20 feet away for 20 seconds. This helps reduce digital eye strain significantly.' }],
  'Eye Strain Score = Total Hours x 10 x Break Modifier (capped at 100)',
  ['biological-age-calculator', 'sleep-debt-calculator']
);

// #65 Posture Score
add('posture-score-calculator', 'Posture Assessment Calculator',
  'Evaluate your posture health based on daily habits and ergonomic factors.',
  'Health', 'health', 'H',
  ['posture score', 'posture assessment', 'ergonomic calculator'],
  [
    '{ name: "sittingHrs", label: "Sitting Hours per Day", type: "number", suffix: "hours", min: 0, max: 18, defaultValue: 8 }',
    '{ name: "exercise", label: "Stretching or Exercise", type: "select", options: [{value:"none",label:"None"},{value:"some",label:"2 to 3 times per week"},{value:"daily",label:"Daily"}], defaultValue: "some" }',
    '{ name: "ergonomic", label: "Ergonomic Setup", type: "select", options: [{value:"poor",label:"Poor (no adjustments)"},{value:"fair",label:"Fair (some adjustments)"},{value:"good",label:"Good (proper setup)"}], defaultValue: "fair" }',
  ],
  `(inputs) => {
      const sitting = inputs.sittingHrs as number;
      const exercise = inputs.exercise as string;
      const ergo = inputs.ergonomic as string;
      if (sitting === undefined || sitting < 0) return null;
      let score = 100;
      if (sitting > 10) score -= 30;
      else if (sitting > 6) score -= 15;
      else if (sitting > 3) score -= 5;
      const exerciseMod: Record<string, number> = { none: -20, some: 0, daily: 15 };
      score += exerciseMod[exercise] || 0;
      const ergoMod: Record<string, number> = { poor: -25, fair: -5, good: 10 };
      score += ergoMod[ergo] || 0;
      score = Math.max(0, Math.min(100, score));
      const rating = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor";
      return {
        primary: { label: "Posture Score", value: formatNumber(score) + " / 100" },
        details: [
          { label: "Rating", value: rating },
          { label: "Sitting Impact", value: sitting > 6 ? "High (consider standing desk)" : "Manageable" },
          { label: "Recommendation", value: score < 60 ? "Consider ergonomic improvements and daily stretching" : "Maintain current habits" },
        ],
      };
    }`,
  [{ q: 'How does sitting affect posture?', a: 'Prolonged sitting weakens core muscles and tightens hip flexors, leading to forward head posture and lower back pain over time.' },
   { q: 'What is a good posture score?', a: 'A score of 80 or above indicates excellent posture habits. Below 40 suggests significant improvements are needed in ergonomics and exercise.' }],
  'Posture Score = 100 - Sitting Penalty + Exercise Modifier + Ergonomic Modifier',
  ['screen-time-impact-calculator', 'biological-age-calculator']
);

// #66 Hearing Loss Risk
add('hearing-loss-risk-calculator', 'Hearing Loss Risk Calculator',
  'Assess your risk of noise-induced hearing loss based on daily noise exposure levels.',
  'Health', 'health', 'H',
  ['hearing loss risk', 'noise exposure calculator', 'hearing damage calculator'],
  [
    '{ name: "noiseLevel", label: "Average Noise Level", type: "number", suffix: "dB", min: 40, max: 140, defaultValue: 75 }',
    '{ name: "duration", label: "Exposure Duration", type: "number", suffix: "hours/day", min: 0.5, max: 24, defaultValue: 8 }',
    '{ name: "protection", label: "Hearing Protection", type: "select", options: [{value:"none",label:"None"},{value:"foam",label:"Foam Earplugs (-20 dB)"},{value:"muff",label:"Earmuffs (-25 dB)"},{value:"custom",label:"Custom Molded (-30 dB)"}], defaultValue: "none" }',
  ],
  `(inputs) => {
      const noise = inputs.noiseLevel as number;
      const duration = inputs.duration as number;
      const protection = inputs.protection as string;
      if (!noise || !duration) return null;
      const protectionDb: Record<string, number> = { none: 0, foam: 20, muff: 25, custom: 30 };
      const effectiveNoise = noise - (protectionDb[protection] || 0);
      const safeLimit = 85;
      const maxHours = effectiveNoise <= safeLimit ? 24 : 8 / Math.pow(2, (effectiveNoise - safeLimit) / 3);
      const exposureRatio = duration / maxHours;
      const risk = exposureRatio < 0.5 ? "Low" : exposureRatio < 1.0 ? "Moderate" : exposureRatio < 2.0 ? "High" : "Very High";
      return {
        primary: { label: "Hearing Risk Level", value: risk },
        details: [
          { label: "Effective Noise Level", value: formatNumber(Math.max(0, effectiveNoise)) + " dB" },
          { label: "Safe Exposure Limit", value: formatNumber(Math.round(maxHours * 100) / 100) + " hours" },
          { label: "Your Exposure Ratio", value: formatNumber(Math.round(exposureRatio * 100) / 100) + "x safe limit" },
        ],
      };
    }`,
  [{ q: 'At what decibel level does hearing damage occur?', a: 'Sustained exposure above 85 dB can cause hearing damage. The safe duration halves for every 3 dB increase above this threshold.' },
   { q: 'How effective is hearing protection?', a: 'Foam earplugs reduce noise by about 20 dB, earmuffs by 25 dB, and custom-molded plugs by up to 30 dB when properly fitted.' }],
  'Safe Hours = 8 / 2^((Effective dB - 85) / 3); Exposure Ratio = Duration / Safe Hours',
  ['decibel-addition-calculator', 'sound-wavelength-calculator']
);

// #67 Sun Exposure
add('sun-exposure-calculator', 'Sun Exposure Calculator',
  'Calculate safe sun exposure time based on your skin type, UV index, and sunscreen usage.',
  'Health', 'health', 'H',
  ['sun exposure time', 'safe sun calculator', 'UV exposure calculator'],
  [
    '{ name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{value:"1",label:"Type I - Very Fair"},{value:"2",label:"Type II - Fair"},{value:"3",label:"Type III - Medium"},{value:"4",label:"Type IV - Olive"},{value:"5",label:"Type V - Brown"},{value:"6",label:"Type VI - Dark"}], defaultValue: "2" }',
    '{ name: "uvIndex", label: "UV Index", type: "number", suffix: "", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "spf", label: "Sunscreen SPF", type: "number", suffix: "", min: 0, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
      const skinType = parseInt(inputs.skinType as string) || 2;
      const uvIndex = inputs.uvIndex as number;
      const spf = inputs.spf as number;
      if (!uvIndex || uvIndex <= 0) return null;
      const baseMins: Record<number, number> = { 1: 67, 2: 100, 3: 200, 4: 300, 5: 400, 6: 500 };
      const baseTime = (baseMins[skinType] || 100) / uvIndex;
      const protectedTime = spf > 0 ? baseTime * spf * 0.6 : baseTime;
      const vitDMins = Math.min(baseTime * 0.5, 30);
      return {
        primary: { label: "Safe Unprotected Time", value: formatNumber(Math.round(baseTime)) + " minutes" },
        details: [
          { label: "With SPF " + spf, value: formatNumber(Math.round(protectedTime)) + " minutes" },
          { label: "Vitamin D Exposure", value: formatNumber(Math.round(vitDMins)) + " minutes recommended" },
          { label: "UV Risk Level", value: uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : "Very High" },
        ],
      };
    }`,
  [{ q: 'How long can I stay in the sun without burning?', a: 'It depends on your skin type and UV index. Fair skin (Type I) may burn in as little as 5 to 10 minutes at high UV, while darker skin types can tolerate much longer.' },
   { q: 'Does sunscreen fully protect from UV?', a: 'Sunscreen extends your safe exposure time but does not block 100 percent of UV rays. SPF 30 blocks about 97 percent of UVB rays when applied correctly.' }],
  'Safe Time = Base Minutes for Skin Type / UV Index; Protected Time = Safe Time x SPF x 0.6',
  ['biological-age-calculator', 'hydration-calculator']
);

// #68 Blood Donation Eligibility
add('blood-donation-eligibility-calculator', 'Blood Donation Eligibility Calculator',
  'Check if you meet the basic eligibility requirements for blood donation.',
  'Health', 'health', 'H',
  ['blood donation eligibility', 'can I donate blood', 'blood donor calculator'],
  [
    '{ name: "age", label: "Age", type: "number", suffix: "years", min: 10, max: 100, defaultValue: 30 }',
    '{ name: "weight", label: "Weight", type: "number", suffix: "lbs", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "lastDonation", label: "Days Since Last Donation", type: "number", suffix: "days", min: 0, max: 3650, defaultValue: 60 }',
    '{ name: "health", label: "General Health", type: "select", options: [{value:"good",label:"Good Health"},{value:"cold",label:"Currently Ill"},{value:"chronic",label:"Chronic Condition"}], defaultValue: "good" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const weight = inputs.weight as number;
      const lastDon = inputs.lastDonation as number;
      const health = inputs.health as string;
      if (!age || !weight) return null;
      const issues: string[] = [];
      let eligible = true;
      if (age < 17) { issues.push("Must be at least 17 years old"); eligible = false; }
      if (age > 76) { issues.push("Age may require physician approval"); }
      if (weight < 110) { issues.push("Must weigh at least 110 lbs"); eligible = false; }
      if (lastDon < 56) { issues.push("Must wait 56 days between whole blood donations"); eligible = false; }
      if (health === "cold") { issues.push("Must be in good health on donation day"); eligible = false; }
      if (health === "chronic") { issues.push("Chronic conditions require physician clearance"); }
      return {
        primary: { label: "Eligibility Status", value: eligible ? "Likely Eligible" : "Currently Not Eligible" },
        details: [
          { label: "Age Check", value: age >= 17 ? "Pass" : "Fail" },
          { label: "Weight Check", value: weight >= 110 ? "Pass" : "Fail" },
          { label: "Notes", value: issues.length > 0 ? issues.join("; ") : "All basic checks passed" },
        ],
      };
    }`,
  [{ q: 'How often can I donate blood?', a: 'You can donate whole blood every 56 days (8 weeks). Platelet donations can be made every 7 days, up to 24 times per year.' },
   { q: 'What are the basic requirements to donate blood?', a: 'You must be at least 17 years old, weigh at least 110 pounds, be in good general health, and not have donated in the past 56 days.' }],
  'Eligibility = Age >= 17 AND Weight >= 110 lbs AND Days Since Last >= 56 AND Good Health',
  ['bmi-calculator', 'biological-age-calculator']
);

// #69 Vaccine Schedule
add('vaccine-schedule-calculator', 'Vaccine Schedule Calculator',
  'Determine recommended vaccination timing based on age and vaccine type.',
  'Health', 'health', 'H',
  ['vaccine schedule', 'vaccination timing', 'immunization calculator'],
  [
    '{ name: "age", label: "Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "vaccine", label: "Vaccine Type", type: "select", options: [{value:"flu",label:"Influenza (Yearly)"},{value:"tdap",label:"Tdap (Every 10 Years)"},{value:"shingles",label:"Shingles (50+)"},{value:"pneumo",label:"Pneumococcal (65+)"}], defaultValue: "flu" }',
    '{ name: "lastDose", label: "Years Since Last Dose", type: "number", suffix: "years", min: 0, max: 50, defaultValue: 1 }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const vaccine = inputs.vaccine as string;
      const lastDose = inputs.lastDose as number;
      if (!age || age < 0) return null;
      const schedules: Record<string, { interval: number; minAge: number; name: string }> = {
        flu: { interval: 1, minAge: 0, name: "Influenza" },
        tdap: { interval: 10, minAge: 11, name: "Tdap Booster" },
        shingles: { interval: 0, minAge: 50, name: "Shingles (Shingrix)" },
        pneumo: { interval: 0, minAge: 65, name: "Pneumococcal" },
      };
      const s = schedules[vaccine] || schedules.flu;
      const ageEligible = age >= s.minAge;
      const dueNow = s.interval > 0 ? lastDose >= s.interval : true;
      const nextDue = s.interval > 0 ? s.interval - lastDose : 0;
      const status = !ageEligible ? "Not yet age-eligible" : dueNow ? "Due now" : "Not yet due";
      return {
        primary: { label: s.name + " Status", value: status },
        details: [
          { label: "Age Eligible", value: ageEligible ? "Yes" : "No (minimum age " + s.minAge + ")" },
          { label: "Interval", value: s.interval > 0 ? "Every " + s.interval + " years" : "One-time series" },
          { label: "Next Due In", value: dueNow || !ageEligible ? "N/A" : formatNumber(Math.max(0, nextDue)) + " years" },
        ],
      };
    }`,
  [{ q: 'How often should I get a flu shot?', a: 'The influenza vaccine is recommended annually, ideally before flu season begins in October or November.' },
   { q: 'When should adults get the Tdap booster?', a: 'Adults should receive a Tdap booster every 10 years. The vaccine protects against tetanus, diphtheria, and pertussis.' }],
  'Status = Age >= Minimum Age AND Years Since Last >= Interval',
  ['biological-age-calculator', 'blood-donation-eligibility-calculator']
);

// #70 Allergy Severity
add('allergy-severity-calculator', 'Allergy Severity Calculator',
  'Score your allergy symptoms to assess severity and guide treatment decisions.',
  'Health', 'health', 'H',
  ['allergy severity', 'allergy score', 'allergy symptom calculator'],
  [
    '{ name: "sneezing", label: "Sneezing Frequency (per day)", type: "number", suffix: "times", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "congestion", label: "Nasal Congestion Severity", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" }',
    '{ name: "eyeItch", label: "Eye Itching or Watering", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"Mild"},{value:"2",label:"Moderate"},{value:"3",label:"Severe"}], defaultValue: "1" }',
    '{ name: "impact", label: "Impact on Daily Activities", type: "select", options: [{value:"0",label:"No Impact"},{value:"1",label:"Slight"},{value:"2",label:"Moderate"},{value:"3",label:"Cannot Function Normally"}], defaultValue: "1" }',
  ],
  `(inputs) => {
      const sneezing = inputs.sneezing as number;
      const congestion = parseInt(inputs.congestion as string) || 0;
      const eyeItch = parseInt(inputs.eyeItch as string) || 0;
      const impact = parseInt(inputs.impact as string) || 0;
      const sneezingScore = sneezing <= 3 ? 1 : sneezing <= 10 ? 2 : 3;
      const total = sneezingScore + congestion + eyeItch + impact;
      const maxScore = 12;
      const pct = Math.round((total / maxScore) * 100);
      const severity = total <= 3 ? "Mild" : total <= 6 ? "Moderate" : total <= 9 ? "Severe" : "Very Severe";
      const treatment = total <= 3 ? "Over-the-counter antihistamines" : total <= 6 ? "Daily antihistamines and nasal spray" : "Consult an allergist for prescription options";
      return {
        primary: { label: "Allergy Severity", value: severity + " (" + formatNumber(total) + " / " + maxScore + ")" },
        details: [
          { label: "Severity Percentage", value: formatNumber(pct) + "%" },
          { label: "Suggested Treatment", value: treatment },
          { label: "Daily Impact Level", value: impact === 0 ? "None" : impact === 1 ? "Slight" : impact === 2 ? "Moderate" : "Significant" },
        ],
      };
    }`,
  [{ q: 'How do you measure allergy severity?', a: 'Allergy severity is measured by combining symptom scores for sneezing, congestion, eye irritation, and impact on daily activities into a composite score.' },
   { q: 'When should I see an allergist?', a: 'If your allergy symptoms score moderate or higher, especially if over-the-counter medications do not provide adequate relief, you should consult a specialist.' }],
  'Severity Score = Sneezing Score + Congestion Score + Eye Score + Impact Score (0 to 12)',
  ['biological-age-calculator', 'hydration-calculator']
);

// #71 Sound Wavelength
add('sound-wavelength-calculator', 'Sound Wavelength Calculator',
  'Convert sound frequency to wavelength in air at a given temperature.',
  'Science', 'science', 'A',
  ['sound wavelength', 'frequency to wavelength', 'acoustic wavelength'],
  [
    '{ name: "frequency", label: "Frequency", type: "number", suffix: "Hz", min: 1, max: 100000, defaultValue: 440 }',
    '{ name: "temperature", label: "Air Temperature", type: "number", suffix: "C", min: -40, max: 60, defaultValue: 20 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const temp = inputs.temperature as number;
      if (!freq || freq <= 0) return null;
      const speedOfSound = 331.3 + 0.606 * (temp || 20);
      const wavelength = speedOfSound / freq;
      const wavelengthCm = wavelength * 100;
      const period = 1 / freq;
      return {
        primary: { label: "Wavelength", value: formatNumber(Math.round(wavelength * 10000) / 10000) + " m" },
        details: [
          { label: "Wavelength", value: formatNumber(Math.round(wavelengthCm * 100) / 100) + " cm" },
          { label: "Speed of Sound", value: formatNumber(Math.round(speedOfSound * 100) / 100) + " m/s" },
          { label: "Period", value: formatNumber(period.toFixed(6)) + " seconds" },
        ],
      };
    }`,
  [{ q: 'How is sound wavelength calculated?', a: 'Wavelength equals the speed of sound divided by frequency. The speed of sound in air is approximately 331.3 + 0.606 times the temperature in Celsius.' },
   { q: 'What is the wavelength of middle A (440 Hz)?', a: 'At 20 degrees Celsius, the wavelength of 440 Hz is approximately 0.78 meters or 78 centimeters.' }],
  'Wavelength = Speed of Sound / Frequency; Speed = 331.3 + 0.606 x Temperature',
  ['decibel-addition-calculator', 'frequency-calculator']
);

// #72 Decibel Addition
add('decibel-addition-calculator', 'Decibel Addition Calculator',
  'Combine two or more sound levels in decibels using logarithmic addition.',
  'Science', 'science', 'A',
  ['decibel addition', 'combine sound levels', 'dB calculator'],
  [
    '{ name: "db1", label: "Sound Source 1", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 70 }',
    '{ name: "db2", label: "Sound Source 2", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 70 }',
    '{ name: "db3", label: "Sound Source 3 (optional)", type: "number", suffix: "dB", min: 0, max: 200, defaultValue: 0 }',
  ],
  `(inputs) => {
      const db1 = inputs.db1 as number;
      const db2 = inputs.db2 as number;
      const db3 = inputs.db3 as number;
      if (db1 === undefined || db2 === undefined) return null;
      let sumIntensity = Math.pow(10, db1 / 10) + Math.pow(10, db2 / 10);
      if (db3 && db3 > 0) sumIntensity += Math.pow(10, db3 / 10);
      const combined = 10 * Math.log10(sumIntensity);
      const diff = combined - Math.max(db1, db2, db3 || 0);
      return {
        primary: { label: "Combined Level", value: formatNumber(Math.round(combined * 100) / 100) + " dB" },
        details: [
          { label: "Increase Over Loudest", value: "+" + formatNumber(Math.round(diff * 100) / 100) + " dB" },
          { label: "Combined Intensity", value: formatNumber(Math.round(sumIntensity)) + " (linear)" },
          { label: "Perception", value: diff >= 10 ? "Twice as loud" : diff >= 3 ? "Noticeably louder" : "Slightly louder" },
        ],
      };
    }`,
  [{ q: 'How do you add decibels together?', a: 'Decibels use a logarithmic scale, so you cannot simply add them. Instead, convert each to linear intensity, sum them, then convert back: dB_total = 10 x log10(sum of 10^(dB/10)).' },
   { q: 'How much louder is two identical sources combined?', a: 'Two identical sound sources produce a combined level 3 dB higher. A 10 dB increase is perceived as roughly twice as loud.' }],
  'Combined dB = 10 x log10(10^(dB1/10) + 10^(dB2/10) + ...)',
  ['sound-wavelength-calculator', 'hearing-loss-risk-calculator']
);

// #73 Earthquake Energy
add('earthquake-energy-calculator', 'Earthquake Energy Calculator',
  'Calculate the energy released by an earthquake from its Richter magnitude.',
  'Science', 'science', 'A',
  ['earthquake energy', 'richter scale energy', 'seismic energy calculator'],
  [
    '{ name: "magnitude", label: "Richter Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 5 }',
    '{ name: "compareMag", label: "Compare With Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 4 }',
  ],
  `(inputs) => {
      const mag = inputs.magnitude as number;
      const cmpMag = inputs.compareMag as number;
      if (mag === undefined || mag < 0) return null;
      const energy = Math.pow(10, 1.5 * mag + 4.8);
      const cmpEnergy = Math.pow(10, 1.5 * (cmpMag || 0) + 4.8);
      const ratio = energy / cmpEnergy;
      const tntTons = energy / 4.184e9;
      const label = mag < 3 ? "Minor" : mag < 5 ? "Light to Moderate" : mag < 7 ? "Strong" : "Major to Great";
      return {
        primary: { label: "Energy Released", value: energy.toExponential(2) + " Joules" },
        details: [
          { label: "TNT Equivalent", value: formatNumber(Math.round(tntTons * 100) / 100) + " tons" },
          { label: "Times Stronger Than M" + (cmpMag || 0), value: formatNumber(Math.round(ratio * 100) / 100) + "x" },
          { label: "Classification", value: label },
        ],
      };
    }`,
  [{ q: 'How much energy does a magnitude 5 earthquake release?', a: 'A magnitude 5 earthquake releases approximately 2 x 10^12 Joules of energy, equivalent to about 500 tons of TNT.' },
   { q: 'How much stronger is each magnitude increase?', a: 'Each whole number increase in magnitude represents roughly 31.6 times more energy released.' }],
  'Energy (Joules) = 10^(1.5 x Magnitude + 4.8)',
  ['terminal-velocity-calculator', 'escape-velocity-calculator']
);

// #74 Wind Chill
add('wind-chill-calculator', 'Wind Chill Calculator',
  'Calculate the wind chill factor from temperature and wind speed.',
  'Science', 'science', 'A',
  ['wind chill', 'wind chill factor', 'feels like temperature wind'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "F", min: -50, max: 50, defaultValue: 30 }',
    '{ name: "wind", label: "Wind Speed", type: "number", suffix: "mph", min: 3, max: 100, defaultValue: 15 }',
  ],
  `(inputs) => {
      const temp = inputs.temp as number;
      const wind = inputs.wind as number;
      if (temp === undefined || !wind || wind < 3) return null;
      const wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(wind, 0.16) + 0.4275 * temp * Math.pow(wind, 0.16);
      const frostbiteMinutes = wc < -20 ? Math.max(5, Math.round(30 + wc)) : wc < 0 ? 30 : 0;
      const danger = wc > 20 ? "Low" : wc > 0 ? "Moderate" : wc > -20 ? "High" : "Extreme";
      return {
        primary: { label: "Wind Chill Temperature", value: formatNumber(Math.round(wc)) + " F" },
        details: [
          { label: "Feels Like Drop", value: formatNumber(Math.round(temp - wc)) + " F colder" },
          { label: "Frostbite Risk", value: danger },
          { label: "Time to Frostbite", value: frostbiteMinutes > 0 ? formatNumber(frostbiteMinutes) + " minutes" : "Low risk at this level" },
        ],
      };
    }`,
  [{ q: 'How is wind chill calculated?', a: 'The NWS wind chill formula accounts for heat loss from exposed skin caused by wind and cold. It uses air temperature and wind speed to produce a feels-like temperature.' },
   { q: 'At what wind chill is it dangerous?', a: 'Wind chill below -20 F can cause frostbite on exposed skin within 30 minutes. Below -40 F, frostbite can occur in as little as 5 minutes.' }],
  'Wind Chill = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16',
  ['heat-index-calculator', 'dew-point-calculator']
);

// #75 Heat Index
add('heat-index-calculator', 'Heat Index Calculator',
  'Calculate the apparent temperature from air temperature and relative humidity.',
  'Science', 'science', 'A',
  ['heat index', 'feels like temperature', 'apparent temperature humidity'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "F", min: 80, max: 130, defaultValue: 90 }',
    '{ name: "humidity", label: "Relative Humidity", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
      const T = inputs.temp as number;
      const R = inputs.humidity as number;
      if (!T || !R) return null;
      const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127;
      const c4 = -0.22475541, c5 = -0.00683783, c6 = -0.05481717;
      const c7 = 0.00122874, c8 = 0.00085282, c9 = -0.00000199;
      const HI = c1 + c2*T + c3*R + c4*T*R + c5*T*T + c6*R*R + c7*T*T*R + c8*T*R*R + c9*T*T*R*R;
      const danger = HI < 80 ? "None" : HI < 91 ? "Caution" : HI < 104 ? "Extreme Caution" : HI < 126 ? "Danger" : "Extreme Danger";
      return {
        primary: { label: "Heat Index", value: formatNumber(Math.round(HI)) + " F" },
        details: [
          { label: "Feels Like Increase", value: "+" + formatNumber(Math.round(HI - T)) + " F over actual" },
          { label: "Danger Level", value: danger },
          { label: "Recommendation", value: HI >= 104 ? "Avoid prolonged outdoor activity" : HI >= 91 ? "Take frequent breaks and hydrate" : "Normal precautions" },
        ],
      };
    }`,
  [{ q: 'What is the heat index?', a: 'The heat index combines air temperature and relative humidity to determine how hot it actually feels to the human body, also known as the apparent temperature.' },
   { q: 'At what heat index is it dangerous?', a: 'A heat index above 104 F is considered dangerous with high risk of heat stroke. Above 126 F is classified as extreme danger.' }],
  'Heat Index = Rothfusz regression equation using temperature and relative humidity',
  ['wind-chill-calculator', 'dew-point-calculator']
);

// #76 Dew Point
add('dew-point-calculator', 'Dew Point Calculator',
  'Calculate the dew point temperature from air temperature and relative humidity.',
  'Science', 'science', 'A',
  ['dew point', 'dew point temperature', 'humidity dew point'],
  [
    '{ name: "temp", label: "Air Temperature", type: "number", suffix: "C", min: -40, max: 60, defaultValue: 25 }',
    '{ name: "humidity", label: "Relative Humidity", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
      const T = inputs.temp as number;
      const RH = inputs.humidity as number;
      if (T === undefined || !RH || RH <= 0) return null;
      const a = 17.27;
      const b = 237.7;
      const gamma = (a * T) / (b + T) + Math.log(RH / 100);
      const dewPoint = (b * gamma) / (a - gamma);
      const dewPointF = dewPoint * 9 / 5 + 32;
      const comfort = dewPoint < 10 ? "Dry and comfortable" : dewPoint < 16 ? "Comfortable" : dewPoint < 20 ? "Slightly humid" : dewPoint < 24 ? "Humid and uncomfortable" : "Oppressive";
      return {
        primary: { label: "Dew Point", value: formatNumber(Math.round(dewPoint * 10) / 10) + " C" },
        details: [
          { label: "Dew Point (Fahrenheit)", value: formatNumber(Math.round(dewPointF * 10) / 10) + " F" },
          { label: "Comfort Level", value: comfort },
          { label: "Spread (T - Dew Point)", value: formatNumber(Math.round((T - dewPoint) * 10) / 10) + " C" },
        ],
      };
    }`,
  [{ q: 'What is the dew point?', a: 'The dew point is the temperature at which air becomes saturated and water vapor begins to condense into dew or fog. A higher dew point means more moisture in the air.' },
   { q: 'What dew point is comfortable?', a: 'A dew point below 10 C (50 F) feels dry, 10 to 16 C (50 to 60 F) is comfortable, and above 20 C (68 F) feels oppressively humid.' }],
  'Dew Point = (237.7 x gamma) / (17.27 - gamma); gamma = (17.27 x T) / (237.7 + T) + ln(RH/100)',
  ['heat-index-calculator', 'wind-chill-calculator']
);

// #77 Altitude Pressure
add('altitude-pressure-calculator', 'Altitude Pressure Calculator',
  'Calculate atmospheric pressure at a given altitude using the barometric formula.',
  'Science', 'science', 'A',
  ['altitude pressure', 'atmospheric pressure altitude', 'barometric formula'],
  [
    '{ name: "altitude", label: "Altitude", type: "number", suffix: "meters", min: 0, max: 50000, defaultValue: 2000 }',
    '{ name: "seaLevelPressure", label: "Sea Level Pressure", type: "number", suffix: "hPa", min: 900, max: 1100, defaultValue: 1013.25 }',
    '{ name: "temperature", label: "Temperature at Sea Level", type: "number", suffix: "C", min: -50, max: 50, defaultValue: 15 }',
  ],
  `(inputs) => {
      const alt = inputs.altitude as number;
      const P0 = inputs.seaLevelPressure as number;
      const T0 = (inputs.temperature as number) + 273.15;
      if (alt === undefined || !P0 || !T0) return null;
      const g = 9.80665;
      const M = 0.0289644;
      const R = 8.31447;
      const L = 0.0065;
      const pressure = P0 * Math.pow((T0 - L * alt) / T0, (g * M) / (R * L));
      const pctSeaLevel = (pressure / P0) * 100;
      const oxygenPct = 20.9 * (pressure / 1013.25);
      return {
        primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100) / 100) + " hPa" },
        details: [
          { label: "Percent of Sea Level", value: formatNumber(Math.round(pctSeaLevel * 10) / 10) + "%" },
          { label: "Effective Oxygen", value: formatNumber(Math.round(oxygenPct * 10) / 10) + "% equivalent" },
          { label: "Altitude", value: formatNumber(alt) + " m (" + formatNumber(Math.round(alt * 3.28084)) + " ft)" },
        ],
      };
    }`,
  [{ q: 'How does pressure change with altitude?', a: 'Atmospheric pressure decreases roughly exponentially with altitude. At about 5,500 meters (18,000 ft), pressure is approximately half of sea level pressure.' },
   { q: 'At what altitude is breathing difficult?', a: 'Most people begin to feel altitude effects above 2,400 meters (8,000 ft). Above 8,000 meters (26,000 ft) is the death zone where supplemental oxygen is required.' }],
  'P = P0 x ((T0 - L x h) / T0)^(gM / RL) where L = 0.0065 K/m',
  ['escape-velocity-calculator', 'terminal-velocity-calculator']
);

// #78 Terminal Velocity
add('terminal-velocity-calculator', 'Terminal Velocity Calculator',
  'Calculate the terminal velocity of a falling object based on mass, drag, and area.',
  'Science', 'science', 'A',
  ['terminal velocity', 'falling speed calculator', 'drag force calculator'],
  [
    '{ name: "mass", label: "Object Mass", type: "number", suffix: "kg", min: 0.001, max: 10000, defaultValue: 80 }',
    '{ name: "area", label: "Cross-sectional Area", type: "number", suffix: "sq m", min: 0.001, max: 100, defaultValue: 0.7 }',
    '{ name: "dragCoeff", label: "Drag Coefficient", type: "number", suffix: "", min: 0.01, max: 3, defaultValue: 1.0 }',
    '{ name: "airDensity", label: "Air Density", type: "number", suffix: "kg/m3", min: 0.1, max: 2, defaultValue: 1.225 }',
  ],
  `(inputs) => {
      const m = inputs.mass as number;
      const A = inputs.area as number;
      const Cd = inputs.dragCoeff as number;
      const rho = inputs.airDensity as number;
      if (!m || !A || !Cd || !rho) return null;
      const g = 9.80665;
      const vt = Math.sqrt((2 * m * g) / (rho * Cd * A));
      const vtKmh = vt * 3.6;
      const vtMph = vt * 2.237;
      return {
        primary: { label: "Terminal Velocity", value: formatNumber(Math.round(vt * 100) / 100) + " m/s" },
        details: [
          { label: "In km/h", value: formatNumber(Math.round(vtKmh * 10) / 10) + " km/h" },
          { label: "In mph", value: formatNumber(Math.round(vtMph * 10) / 10) + " mph" },
          { label: "Drag Force at Terminal V", value: formatNumber(Math.round(m * g * 100) / 100) + " N (equals weight)" },
        ],
      };
    }`,
  [{ q: 'What is terminal velocity?', a: 'Terminal velocity is the maximum speed a falling object reaches when the drag force equals gravitational force, resulting in zero net acceleration.' },
   { q: 'What is the terminal velocity of a skydiver?', a: 'A typical skydiver in a belly-down position reaches about 55 m/s (120 mph). In a head-down position this increases to about 90 m/s (200 mph).' }],
  'Terminal Velocity = sqrt(2mg / (rho x Cd x A))',
  ['escape-velocity-calculator', 'altitude-pressure-calculator']
);

// #79 Escape Velocity
add('escape-velocity-calculator', 'Escape Velocity Calculator',
  'Calculate the escape velocity from a celestial body given its mass and radius.',
  'Science', 'science', 'A',
  ['escape velocity', 'planetary escape velocity', 'orbital mechanics'],
  [
    '{ name: "mass", label: "Body Mass", type: "number", suffix: "kg", min: 1e10, max: 2e30, defaultValue: 5.972e24 }',
    '{ name: "radius", label: "Body Radius", type: "number", suffix: "meters", min: 1000, max: 1e9, defaultValue: 6371000 }',
  ],
  `(inputs) => {
      const M = inputs.mass as number;
      const r = inputs.radius as number;
      if (!M || !r || r <= 0) return null;
      const G = 6.674e-11;
      const ve = Math.sqrt(2 * G * M / r);
      const veKmh = ve / 1000 * 3600;
      const veMph = ve * 2.237;
      const earthVe = 11186;
      const ratio = ve / earthVe;
      return {
        primary: { label: "Escape Velocity", value: formatNumber(Math.round(ve)) + " m/s" },
        details: [
          { label: "In km/s", value: formatNumber(Math.round(ve / 100) / 10) + " km/s" },
          { label: "In mph", value: formatNumber(Math.round(veMph)) + " mph" },
          { label: "Relative to Earth", value: formatNumber(Math.round(ratio * 1000) / 1000) + "x Earth escape velocity" },
        ],
      };
    }`,
  [{ q: 'What is escape velocity?', a: 'Escape velocity is the minimum speed an object needs to break free from a celestial body gravitational pull without further propulsion.' },
   { q: 'What is Earth escape velocity?', a: 'Earth escape velocity is approximately 11.2 km/s or about 25,000 mph, regardless of the object mass.' }],
  'Escape Velocity = sqrt(2GM / r) where G = 6.674 x 10^-11',
  ['orbital-period-calculator', 'terminal-velocity-calculator']
);

// #80 Orbital Period
add('orbital-period-calculator', 'Orbital Period Calculator',
  'Calculate the orbital period of a satellite or planet using Kepler third law.',
  'Science', 'science', 'A',
  ['orbital period', 'satellite orbit time', 'Kepler third law'],
  [
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (Orbital Radius)", type: "number", suffix: "km", min: 100, max: 1e9, defaultValue: 6771 }',
    '{ name: "centralMass", label: "Central Body Mass", type: "number", suffix: "kg", min: 1e10, max: 2e30, defaultValue: 5.972e24 }',
  ],
  `(inputs) => {
      const a = (inputs.semiMajorAxis as number) * 1000;
      const M = inputs.centralMass as number;
      if (!a || !M || a <= 0 || M <= 0) return null;
      const G = 6.674e-11;
      const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (G * M));
      const hours = T / 3600;
      const days = T / 86400;
      const altitude = a / 1000 - 6371;
      return {
        primary: { label: "Orbital Period", value: formatNumber(Math.round(T)) + " seconds" },
        details: [
          { label: "In Hours", value: formatNumber(Math.round(hours * 100) / 100) + " hours" },
          { label: "In Days", value: formatNumber(Math.round(days * 1000) / 1000) + " days" },
          { label: "Orbital Velocity", value: formatNumber(Math.round(2 * Math.PI * a / T)) + " m/s" },
        ],
      };
    }`,
  [{ q: 'What is Kepler third law?', a: 'Kepler third law states that the square of the orbital period is proportional to the cube of the semi-major axis: T squared = (4 pi squared / GM) x a cubed.' },
   { q: 'What is the orbital period of the ISS?', a: 'The International Space Station orbits at about 408 km altitude with a period of approximately 92 minutes or about 1.5 hours.' }],
  'T = 2 x pi x sqrt(a^3 / (G x M)) where a = semi-major axis, M = central body mass',
  ['escape-velocity-calculator', 'terminal-velocity-calculator']
);

// #81 Hex to RGB
add('hex-to-rgb-calculator', 'Hex to RGB Calculator',
  'Convert hexadecimal color codes to RGB values and vice versa.',
  'Conversion', 'conversion', 'R',
  ['hex to rgb', 'color code converter', 'hex color converter'],
  [
    '{ name: "hexColor", label: "Hex Color Code", type: "text", placeholder: "e.g. FF5733", defaultValue: "FF5733" }',
    '{ name: "red", label: "Red (R)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 255 }',
    '{ name: "green", label: "Green (G)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 87 }',
    '{ name: "blue", label: "Blue (B)", type: "number", suffix: "", min: 0, max: 255, defaultValue: 51 }',
  ],
  `(inputs) => {
      const hex = (inputs.hexColor as string || "").replace("#", "").trim();
      if (hex && hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        return {
          primary: { label: "RGB Values", value: "rgb(" + r + ", " + g + ", " + b + ")" },
          details: [
            { label: "Red", value: formatNumber(r) },
            { label: "Green", value: formatNumber(g) },
            { label: "Blue", value: formatNumber(b) },
            { label: "Hex", value: "#" + hex.toUpperCase() },
          ],
        };
      }
      const r = inputs.red as number;
      const g = inputs.green as number;
      const b = inputs.blue as number;
      if (r === undefined || g === undefined || b === undefined) return null;
      const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0").toUpperCase();
      const hexResult = "#" + toHex(r) + toHex(g) + toHex(b);
      return {
        primary: { label: "Hex Color", value: hexResult },
        details: [
          { label: "RGB", value: "rgb(" + r + ", " + g + ", " + b + ")" },
          { label: "Red", value: formatNumber(r) },
          { label: "Green", value: formatNumber(g) },
          { label: "Blue", value: formatNumber(b) },
        ],
      };
    }`,
  [{ q: 'What is a hex color code?', a: 'A hex color code is a 6-character string representing red, green, and blue values in hexadecimal (00 to FF). For example, FF0000 is pure red.' },
   { q: 'How do you convert hex to RGB?', a: 'Split the 6-digit hex into three pairs and convert each pair from base-16 to base-10. For example, FF = 255, 33 = 51.' }],
  'R = parseInt(hex[0..1], 16); G = parseInt(hex[2..3], 16); B = parseInt(hex[4..5], 16)',
  ['number-base-converter', 'ascii-converter']
);

// #82 Unix Timestamp
add('unix-timestamp-converter', 'Unix Timestamp Converter',
  'Convert between Unix epoch timestamps and human-readable dates.',
  'Conversion', 'conversion', 'R',
  ['unix timestamp', 'epoch converter', 'timestamp to date'],
  [
    '{ name: "timestamp", label: "Unix Timestamp (seconds)", type: "number", suffix: "", min: 0, max: 4102444800, defaultValue: 1700000000 }',
    '{ name: "year", label: "Year", type: "number", suffix: "", min: 1970, max: 2100, defaultValue: 2024 }',
    '{ name: "month", label: "Month", type: "number", suffix: "", min: 1, max: 12, defaultValue: 1 }',
    '{ name: "day", label: "Day", type: "number", suffix: "", min: 1, max: 31, defaultValue: 1 }',
  ],
  `(inputs) => {
      const ts = inputs.timestamp as number;
      if (ts !== undefined && ts >= 0) {
        const d = new Date(ts * 1000);
        const iso = d.toISOString();
        const utcStr = d.toUTCString();
        const daysFromNow = Math.round((ts * 1000 - Date.now()) / 86400000);
        return {
          primary: { label: "Date (UTC)", value: iso.replace("T", " ").replace(".000Z", " UTC") },
          details: [
            { label: "ISO 8601", value: iso },
            { label: "UTC String", value: utcStr },
            { label: "Days From Now", value: formatNumber(daysFromNow) },
          ],
        };
      }
      const year = inputs.year as number;
      const month = inputs.month as number;
      const day = inputs.day as number;
      if (!year) return null;
      const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
      const unixTs = Math.floor(date.getTime() / 1000);
      return {
        primary: { label: "Unix Timestamp", value: formatNumber(unixTs) },
        details: [
          { label: "ISO 8601", value: date.toISOString() },
          { label: "Milliseconds", value: formatNumber(unixTs * 1000) },
          { label: "Date", value: date.toUTCString() },
        ],
      };
    }`,
  [{ q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC, also known as the Unix epoch.' },
   { q: 'What is the Year 2038 problem?', a: 'Systems using 32-bit signed integers to store Unix timestamps will overflow on January 19, 2038. Modern systems use 64-bit integers to avoid this issue.' }],
  'Unix Timestamp = seconds since January 1, 1970 00:00:00 UTC',
  ['number-base-converter', 'hex-to-rgb-calculator']
);

// #83 Number Base Converter
add('number-base-converter', 'Number Base Converter',
  'Convert numbers between binary, octal, decimal, and hexadecimal bases.',
  'Conversion', 'conversion', 'R',
  ['number base converter', 'binary converter', 'hex converter'],
  [
    '{ name: "number", label: "Number to Convert", type: "text", placeholder: "e.g. 255", defaultValue: "255" }',
    '{ name: "fromBase", label: "From Base", type: "select", options: [{value:"2",label:"Binary (2)"},{value:"8",label:"Octal (8)"},{value:"10",label:"Decimal (10)"},{value:"16",label:"Hexadecimal (16)"}], defaultValue: "10" }',
  ],
  `(inputs) => {
      const numStr = (inputs.number as string || "").trim();
      const fromBase = parseInt(inputs.fromBase as string) || 10;
      if (!numStr) return null;
      const decimal = parseInt(numStr, fromBase);
      if (isNaN(decimal) || decimal < 0) return null;
      return {
        primary: { label: "Decimal", value: formatNumber(decimal) },
        details: [
          { label: "Binary (Base 2)", value: decimal.toString(2) },
          { label: "Octal (Base 8)", value: decimal.toString(8) },
          { label: "Hexadecimal (Base 16)", value: decimal.toString(16).toUpperCase() },
        ],
      };
    }`,
  [{ q: 'What are number bases?', a: 'A number base (or radix) defines how many unique digits are used. Decimal uses 10 digits (0 to 9), binary uses 2 (0 and 1), octal uses 8, and hexadecimal uses 16 (0 to F).' },
   { q: 'Why is hexadecimal used in computing?', a: 'Hexadecimal is a compact way to represent binary data. Each hex digit corresponds to exactly 4 binary digits, making it easier to read memory addresses and color codes.' }],
  'Decimal = sum of (digit x base^position); then convert to target base by repeated division',
  ['hex-to-rgb-calculator', 'ascii-converter']
);

// #84 ASCII Converter
add('ascii-converter', 'ASCII Converter',
  'Convert text characters to their ASCII code values and vice versa.',
  'Conversion', 'conversion', 'R',
  ['ascii converter', 'text to ascii', 'character code converter'],
  [
    '{ name: "text", label: "Text to Convert", type: "text", placeholder: "e.g. Hello", defaultValue: "Hello" }',
    '{ name: "codes", label: "ASCII Codes (space-separated)", type: "text", placeholder: "e.g. 72 101 108 108 111", defaultValue: "" }',
  ],
  `(inputs) => {
      const text = (inputs.text as string || "").trim();
      const codes = (inputs.codes as string || "").trim();
      if (text) {
        const asciiCodes = [];
        const hexCodes = [];
        for (let i = 0; i < Math.min(text.length, 50); i++) {
          asciiCodes.push(text.charCodeAt(i));
          hexCodes.push(text.charCodeAt(i).toString(16).toUpperCase().padStart(2, "0"));
        }
        return {
          primary: { label: "ASCII Codes", value: asciiCodes.join(" ") },
          details: [
            { label: "Hex Codes", value: hexCodes.join(" ") },
            { label: "Character Count", value: formatNumber(text.length) },
            { label: "Binary (first char)", value: text.charCodeAt(0).toString(2).padStart(8, "0") },
          ],
        };
      }
      if (codes) {
        const nums = codes.split(/\\s+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n <= 127);
        const result = nums.map(n => String.fromCharCode(n)).join("");
        return {
          primary: { label: "Text", value: result },
          details: [
            { label: "Character Count", value: formatNumber(nums.length) },
            { label: "Hex Codes", value: nums.map(n => n.toString(16).toUpperCase().padStart(2, "0")).join(" ") },
            { label: "ASCII Codes", value: nums.join(" ") },
          ],
        };
      }
      return null;
    }`,
  [{ q: 'What is ASCII?', a: 'ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns numeric values 0 to 127 to letters, digits, and symbols.' },
   { q: 'What is the ASCII value of A?', a: 'Uppercase A is 65, lowercase a is 97. The difference between uppercase and lowercase letters is always 32.' }],
  'ASCII Code = character encoding value (0 to 127 for standard ASCII)',
  ['hex-to-rgb-calculator', 'number-base-converter']
);

// #85 Roman Numeral Converter
add('roman-numeral-converter', 'Roman Numeral Converter',
  'Convert between decimal numbers and Roman numerals.',
  'Conversion', 'conversion', 'R',
  ['roman numeral converter', 'decimal to roman', 'roman to decimal'],
  [
    '{ name: "decimal", label: "Decimal Number", type: "number", suffix: "", min: 1, max: 3999, defaultValue: 2024 }',
  ],
  `(inputs) => {
      const num = inputs.decimal as number;
      if (!num || num < 1 || num > 3999) return null;
      const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
      const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
      let roman = "";
      let remaining = Math.floor(num);
      for (let i = 0; i < vals.length; i++) {
        while (remaining >= vals[i]) {
          roman += syms[i];
          remaining -= vals[i];
        }
      }
      const thousands = Math.floor(num / 1000);
      const hundreds = Math.floor((num % 1000) / 100);
      const tens = Math.floor((num % 100) / 10);
      const ones = num % 10;
      return {
        primary: { label: "Roman Numeral", value: roman },
        details: [
          { label: "Decimal Value", value: formatNumber(num) },
          { label: "Breakdown", value: "M:" + thousands + " C:" + hundreds + " X:" + tens + " I:" + ones },
          { label: "Character Count", value: formatNumber(roman.length) },
        ],
      };
    }`,
  [{ q: 'How do Roman numerals work?', a: 'Roman numerals use combinations of letters: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller value before a larger one means subtraction (IV=4).' },
   { q: 'What is the largest Roman numeral?', a: 'Standard Roman numerals can represent numbers up to 3999 (MMMCMXCIX). Larger numbers historically used bars or parentheses for multiplication by 1000.' }],
  'Build Roman numeral by repeatedly subtracting largest possible value (M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I)',
  ['number-base-converter', 'fibonacci-calculator']
);

// #86 Cooking Unit Converter
add('cooking-unit-converter', 'Cooking Unit Converter',
  'Convert between common cooking measurements including cups, tablespoons, teaspoons, and milliliters.',
  'Conversion', 'conversion', 'R',
  ['cooking converter', 'cups to ml', 'tablespoon to teaspoon'],
  [
    '{ name: "amount", label: "Amount", type: "number", suffix: "", min: 0.01, max: 10000, defaultValue: 1 }',
    '{ name: "fromUnit", label: "From Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "cup" }',
    '{ name: "toUnit", label: "To Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "ml" }',
  ],
  `(inputs) => {
      const amount = inputs.amount as number;
      const from = inputs.fromUnit as string;
      const to = inputs.toUnit as string;
      if (!amount || amount <= 0) return null;
      const toMl: Record<string, number> = { cup: 236.588, tbsp: 14.787, tsp: 4.929, ml: 1, liter: 1000, floz: 29.574 };
      const fromFactor = toMl[from] || 1;
      const toFactor = toMl[to] || 1;
      const result = amount * fromFactor / toFactor;
      const inMl = amount * fromFactor;
      return {
        primary: { label: "Result", value: formatNumber(Math.round(result * 1000) / 1000) + " " + to },
        details: [
          { label: "In Milliliters", value: formatNumber(Math.round(inMl * 100) / 100) + " ml" },
          { label: "In Cups", value: formatNumber(Math.round(inMl / 236.588 * 1000) / 1000) + " cups" },
          { label: "In Tablespoons", value: formatNumber(Math.round(inMl / 14.787 * 100) / 100) + " tbsp" },
        ],
      };
    }`,
  [{ q: 'How many tablespoons are in a cup?', a: 'There are 16 tablespoons in one US cup (236.6 ml). Each tablespoon equals 3 teaspoons.' },
   { q: 'How many ml in a cup?', a: 'One US cup equals approximately 236.6 milliliters. One metric cup used in some countries equals 250 milliliters.' }],
  'Result = Amount x (Source Unit in ml) / (Target Unit in ml)',
  ['shoe-size-converter', 'ring-size-converter']
);

// #87 Shoe Size Converter
add('shoe-size-converter', 'Shoe Size Converter',
  'Convert shoe sizes between US, UK, and EU sizing systems.',
  'Conversion', 'conversion', 'R',
  ['shoe size converter', 'US to EU shoe size', 'UK to US shoe size'],
  [
    '{ name: "size", label: "Shoe Size", type: "number", suffix: "", min: 1, max: 20, defaultValue: 10 }',
    '{ name: "system", label: "Size System", type: "select", options: [{value:"us_m",label:"US Mens"},{value:"us_w",label:"US Womens"},{value:"uk",label:"UK"},{value:"eu",label:"EU"}], defaultValue: "us_m" }',
    '{ name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" }',
  ],
  `(inputs) => {
      const size = inputs.size as number;
      const system = inputs.system as string;
      if (!size || size <= 0) return null;
      let usMen = size;
      if (system === "us_w") usMen = size - 1.5;
      else if (system === "uk") usMen = size + 0.5;
      else if (system === "eu") usMen = (size - 33.5) / 1.0;
      const usWomen = usMen + 1.5;
      const uk = usMen - 0.5;
      const eu = usMen + 33.5;
      const cm = usMen * 0.847 + 18.4;
      return {
        primary: { label: "Conversions", value: "US M:" + formatNumber(Math.round(usMen * 2) / 2) + " / EU:" + formatNumber(Math.round(eu)) },
        details: [
          { label: "US Mens", value: formatNumber(Math.round(usMen * 2) / 2) },
          { label: "US Womens", value: formatNumber(Math.round(usWomen * 2) / 2) },
          { label: "UK", value: formatNumber(Math.round(uk * 2) / 2) },
          { label: "EU", value: formatNumber(Math.round(eu)) },
        ],
      };
    }`,
  [{ q: 'How do US and EU shoe sizes compare?', a: 'EU sizes are roughly US mens size plus 33.5. For example, a US mens 10 is approximately EU 43 or 44.' },
   { q: 'What is the difference between US mens and womens sizes?', a: 'US womens sizes are typically 1.5 sizes larger than mens. A womens 8.5 is approximately the same as a mens 7.' }],
  'EU = US Mens + 33.5; UK = US Mens - 0.5; US Womens = US Mens + 1.5',
  ['ring-size-converter', 'cooking-unit-converter']
);

// #88 Ring Size Converter
add('ring-size-converter', 'Ring Size Converter',
  'Convert ring sizes between US, UK, and EU sizing standards with circumference.',
  'Conversion', 'conversion', 'R',
  ['ring size converter', 'ring size chart', 'finger size converter'],
  [
    '{ name: "size", label: "Ring Size (US)", type: "number", suffix: "", min: 3, max: 15, defaultValue: 7 }',
  ],
  `(inputs) => {
      const usSize = inputs.size as number;
      if (!usSize || usSize < 3 || usSize > 15) return null;
      const circumMm = 36.5 + (usSize - 1) * 2.55;
      const diameterMm = circumMm / Math.PI;
      const ukBase = "A".charCodeAt(0);
      const ukIndex = Math.round((usSize - 0.5) * 2);
      const ukLetter = String.fromCharCode(Math.min(ukBase + ukIndex, 90));
      const euSize = Math.round(circumMm);
      return {
        primary: { label: "Ring Size Conversions", value: "US " + usSize + " = EU " + euSize },
        details: [
          { label: "US Size", value: formatNumber(usSize) },
          { label: "EU Size", value: formatNumber(euSize) },
          { label: "Circumference", value: formatNumber(Math.round(circumMm * 10) / 10) + " mm" },
          { label: "Inner Diameter", value: formatNumber(Math.round(diameterMm * 10) / 10) + " mm" },
        ],
      };
    }`,
  [{ q: 'How are ring sizes measured?', a: 'Ring sizes are based on the inner circumference or diameter of the ring. US sizes use a numerical scale, while UK sizes use letters and EU sizes use millimeters of circumference.' },
   { q: 'How do I find my ring size?', a: 'Wrap a strip of paper around your finger, mark where it overlaps, and measure the length in millimeters. This gives you the circumference to match against a size chart.' }],
  'Circumference (mm) = 36.5 + (US Size - 1) x 2.55; EU Size = circumference rounded',
  ['shoe-size-converter', 'bra-size-converter']
);

// #89 Bra Size Converter
add('bra-size-converter', 'Bra Size Converter',
  'Convert bra sizes between US, UK, EU, and French sizing systems.',
  'Conversion', 'conversion', 'R',
  ['bra size converter', 'international bra sizes', 'bra size chart'],
  [
    '{ name: "band", label: "Band Size (US)", type: "number", suffix: "inches", min: 28, max: 48, defaultValue: 34 }',
    '{ name: "cup", label: "Cup Size (US)", type: "select", options: [{value:"A",label:"A"},{value:"B",label:"B"},{value:"C",label:"C"},{value:"D",label:"D"},{value:"DD",label:"DD"},{value:"DDD",label:"DDD/F"},{value:"G",label:"G"}], defaultValue: "C" }',
  ],
  `(inputs) => {
      const band = inputs.band as number;
      const cup = inputs.cup as string;
      if (!band || !cup) return null;
      const euBand = Math.round(band * 2.54);
      const frBand = euBand + 15;
      const cupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const ukCupMap: Record<string, string> = { A: "A", B: "B", C: "C", D: "D", DD: "DD", DDD: "E", G: "F" };
      const euCup = cupMap[cup] || cup;
      const ukCup = ukCupMap[cup] || cup;
      return {
        primary: { label: "US Size", value: band + cup },
        details: [
          { label: "UK Size", value: band + ukCup },
          { label: "EU Size", value: euBand + euCup },
          { label: "French Size", value: frBand + euCup },
          { label: "Band in cm", value: formatNumber(euBand) + " cm" },
        ],
      };
    }`,
  [{ q: 'How do bra sizes differ between countries?', a: 'Band sizes vary: US and UK use inches, EU uses centimeters, and French adds 15 cm to the EU measurement. Cup letters may also differ between systems.' },
   { q: 'How do I measure my bra size?', a: 'Measure your underbust for the band size (in inches for US). Then measure the fullest part of your bust. The difference in inches determines your cup size (1 inch = A, 2 inches = B, etc).' }],
  'EU Band = US Band x 2.54; French Band = EU Band + 15; Cup conversions vary by system',
  ['ring-size-converter', 'shoe-size-converter']
);

// #90 Wire Gauge Converter
add('wire-gauge-converter', 'Wire Gauge Converter',
  'Convert between American Wire Gauge (AWG) and metric wire diameter in millimeters.',
  'Conversion', 'conversion', 'R',
  ['wire gauge converter', 'AWG to mm', 'wire size converter'],
  [
    '{ name: "awg", label: "AWG Gauge Number", type: "number", suffix: "", min: 0, max: 40, defaultValue: 12 }',
  ],
  `(inputs) => {
      const awg = inputs.awg as number;
      if (awg === undefined || awg < 0 || awg > 40) return null;
      const diameterMm = 0.127 * Math.pow(92, (36 - awg) / 39);
      const diameterInch = diameterMm / 25.4;
      const areaMm2 = Math.PI * Math.pow(diameterMm / 2, 2);
      const resistancePerKm = 0.0175 / (areaMm2 / 1000000) / 1000;
      const maxAmps15 = awg <= 2 ? 95 - (awg * 10) : awg <= 10 ? 55 - (awg - 2) * 5 : awg <= 14 ? 20 - (awg - 10) * 2.5 : 10;
      return {
        primary: { label: "Wire Diameter", value: formatNumber(Math.round(diameterMm * 1000) / 1000) + " mm" },
        details: [
          { label: "Diameter (inches)", value: formatNumber(Math.round(diameterInch * 10000) / 10000) + " in" },
          { label: "Cross-section Area", value: formatNumber(Math.round(areaMm2 * 1000) / 1000) + " mm2" },
          { label: "Typical Max Amps (copper)", value: formatNumber(Math.round(Math.max(1, maxAmps15))) + " A" },
        ],
      };
    }`,
  [{ q: 'What is AWG?', a: 'American Wire Gauge is a standardized wire size system used primarily in North America. Lower AWG numbers indicate thicker wire with greater current-carrying capacity.' },
   { q: 'What AWG wire do I need for a 20 amp circuit?', a: 'A 20 amp circuit typically requires 12 AWG copper wire. For longer runs, you may need to use 10 AWG to compensate for voltage drop.' }],
  'Diameter (mm) = 0.127 x 92^((36 - AWG) / 39)',
  ['number-base-converter', 'hex-to-rgb-calculator']
);

// #91 Matrix Determinant
add('matrix-determinant-calculator', 'Matrix Determinant Calculator',
  'Calculate the determinant of a 2x2 or 3x3 matrix.',
  'Math', 'math', '+',
  ['matrix determinant', 'determinant calculator', '2x2 3x3 determinant'],
  [
    '{ name: "a11", label: "Row 1, Col 1", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 1 }',
    '{ name: "a12", label: "Row 1, Col 2", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 2 }',
    '{ name: "a21", label: "Row 2, Col 1", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 3 }',
    '{ name: "a22", label: "Row 2, Col 2", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 4 }',
  ],
  `(inputs) => {
      const a = inputs.a11 as number;
      const b = inputs.a12 as number;
      const c = inputs.a21 as number;
      const d = inputs.a22 as number;
      if (a === undefined || b === undefined || c === undefined || d === undefined) return null;
      const det = a * d - b * c;
      const invertible = det !== 0;
      const trace = a + d;
      return {
        primary: { label: "Determinant", value: formatNumber(det) },
        details: [
          { label: "Formula", value: "(" + a + " x " + d + ") - (" + b + " x " + c + ")" },
          { label: "Invertible", value: invertible ? "Yes (determinant is not zero)" : "No (determinant is zero)" },
          { label: "Trace", value: formatNumber(trace) },
        ],
      };
    }`,
  [{ q: 'What is a matrix determinant?', a: 'The determinant is a scalar value computed from a square matrix. For a 2x2 matrix [[a,b],[c,d]], the determinant is ad - bc. It indicates whether the matrix is invertible.' },
   { q: 'When is a matrix not invertible?', a: 'A matrix is not invertible (singular) when its determinant equals zero. This means the rows or columns are linearly dependent.' }],
  'det(2x2) = a11*a22 - a12*a21',
  ['vector-magnitude-calculator', 'combination-permutation-calculator']
);

// #92 Vector Magnitude
add('vector-magnitude-calculator', 'Vector Magnitude Calculator',
  'Calculate the magnitude (length) of a 2D or 3D vector.',
  'Math', 'math', '+',
  ['vector magnitude', 'vector length', 'vector norm calculator'],
  [
    '{ name: "x", label: "X Component", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 3 }',
    '{ name: "y", label: "Y Component", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 4 }',
    '{ name: "z", label: "Z Component (optional, 0 for 2D)", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const x = inputs.x as number;
      const y = inputs.y as number;
      const z = inputs.z as number || 0;
      if (x === undefined || y === undefined) return null;
      const mag = Math.sqrt(x * x + y * y + z * z);
      const is3D = z !== 0;
      const unitX = mag !== 0 ? x / mag : 0;
      const unitY = mag !== 0 ? y / mag : 0;
      const unitZ = mag !== 0 ? z / mag : 0;
      return {
        primary: { label: "Magnitude", value: formatNumber(Math.round(mag * 10000) / 10000) },
        details: [
          { label: "Dimension", value: is3D ? "3D" : "2D" },
          { label: "Unit Vector", value: "(" + (Math.round(unitX * 1000) / 1000) + ", " + (Math.round(unitY * 1000) / 1000) + (is3D ? ", " + (Math.round(unitZ * 1000) / 1000) : "") + ")" },
          { label: "Magnitude Squared", value: formatNumber(x * x + y * y + z * z) },
        ],
      };
    }`,
  [{ q: 'What is vector magnitude?', a: 'Vector magnitude is the length of a vector, calculated as the square root of the sum of the squares of its components. For a 2D vector (x, y), it is sqrt(x2 + y2).' },
   { q: 'What is a unit vector?', a: 'A unit vector has a magnitude of 1 and points in the same direction as the original vector. It is found by dividing each component by the magnitude.' }],
  'Magnitude = sqrt(x^2 + y^2 + z^2)',
  ['matrix-determinant-calculator', 'polar-to-cartesian-calculator']
);

// #93 Polar to Cartesian
add('polar-to-cartesian-calculator', 'Polar to Cartesian Calculator',
  'Convert polar coordinates (r, theta) to Cartesian coordinates (x, y) and vice versa.',
  'Math', 'math', '+',
  ['polar to cartesian', 'coordinate conversion', 'polar coordinates calculator'],
  [
    '{ name: "r", label: "Radius (r)", type: "number", suffix: "", min: 0, max: 10000, defaultValue: 5 }',
    '{ name: "theta", label: "Angle (theta)", type: "number", suffix: "degrees", min: 0, max: 360, defaultValue: 45 }',
  ],
  `(inputs) => {
      const r = inputs.r as number;
      const thetaDeg = inputs.theta as number;
      if (r === undefined || thetaDeg === undefined) return null;
      const thetaRad = thetaDeg * Math.PI / 180;
      const x = r * Math.cos(thetaRad);
      const y = r * Math.sin(thetaRad);
      const backR = Math.sqrt(x * x + y * y);
      const backTheta = Math.atan2(y, x) * 180 / Math.PI;
      return {
        primary: { label: "Cartesian Coordinates", value: "(" + formatNumber(Math.round(x * 10000) / 10000) + ", " + formatNumber(Math.round(y * 10000) / 10000) + ")" },
        details: [
          { label: "X", value: formatNumber(Math.round(x * 10000) / 10000) },
          { label: "Y", value: formatNumber(Math.round(y * 10000) / 10000) },
          { label: "Angle in Radians", value: formatNumber(Math.round(thetaRad * 10000) / 10000) + " rad" },
        ],
      };
    }`,
  [{ q: 'What are polar coordinates?', a: 'Polar coordinates describe a point using distance from the origin (r) and angle from the positive x-axis (theta), rather than x and y distances.' },
   { q: 'How do you convert polar to Cartesian?', a: 'Use x = r x cos(theta) and y = r x sin(theta). Make sure to convert degrees to radians first if needed by multiplying by pi/180.' }],
  'x = r x cos(theta); y = r x sin(theta)',
  ['vector-magnitude-calculator', 'matrix-determinant-calculator']
);

// #94 Fibonacci
add('fibonacci-calculator', 'Fibonacci Calculator',
  'Calculate the nth Fibonacci number and related properties.',
  'Math', 'math', '+',
  ['fibonacci calculator', 'fibonacci number', 'fibonacci sequence'],
  [
    '{ name: "n", label: "Position (n)", type: "number", suffix: "", min: 0, max: 70, defaultValue: 10 }',
  ],
  `(inputs) => {
      const n = inputs.n as number;
      if (n === undefined || n < 0 || n > 70) return null;
      let a = 0, b = 1;
      if (n === 0) { b = 0; }
      else {
        for (let i = 2; i <= n; i++) {
          const temp = a + b;
          a = b;
          b = temp;
        }
      }
      const fib = n === 0 ? 0 : b;
      const phi = (1 + Math.sqrt(5)) / 2;
      const ratioApprox = n >= 2 ? b / a : 0;
      const sequence = [];
      let sa = 0, sb = 1;
      for (let i = 0; i <= Math.min(n, 10); i++) {
        if (i === 0) sequence.push(0);
        else if (i === 1) sequence.push(1);
        else { const t = sa + sb; sa = sb; sb = t; sequence.push(sb); }
      }
      return {
        primary: { label: "F(" + n + ")", value: formatNumber(fib) },
        details: [
          { label: "Sequence", value: sequence.join(", ") + (n > 10 ? "..." : "") },
          { label: "Ratio F(n)/F(n-1)", value: n >= 2 ? formatNumber(Math.round(ratioApprox * 100000) / 100000) : "N/A" },
          { label: "Golden Ratio", value: formatNumber(Math.round(phi * 100000) / 100000) },
        ],
      };
    }`,
  [{ q: 'What is the Fibonacci sequence?', a: 'The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding numbers: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, and so on.' },
   { q: 'What is the golden ratio in Fibonacci?', a: 'The ratio of consecutive Fibonacci numbers approaches the golden ratio (approximately 1.61803) as n increases. This ratio appears frequently in nature and art.' }],
  'F(n) = F(n-1) + F(n-2) where F(0)=0, F(1)=1',
  ['prime-factorization-calculator', 'series-sum-calculator']
);

// #95 Prime Factorization
add('prime-factorization-calculator', 'Prime Factorization Calculator',
  'Find the prime factors of any positive integer.',
  'Math', 'math', '+',
  ['prime factorization', 'prime factors', 'factor calculator'],
  [
    '{ name: "number", label: "Number", type: "number", suffix: "", min: 2, max: 1000000, defaultValue: 360 }',
  ],
  `(inputs) => {
      const num = inputs.number as number;
      if (!num || num < 2 || num !== Math.floor(num)) return null;
      const factors: number[] = [];
      let n = num;
      for (let d = 2; d * d <= n; d++) {
        while (n % d === 0) {
          factors.push(d);
          n = n / d;
        }
      }
      if (n > 1) factors.push(n);
      const uniqueFactors = [...new Set(factors)];
      const isPrime = factors.length === 1;
      const factorCounts: Record<number, number> = {};
      factors.forEach(f => { factorCounts[f] = (factorCounts[f] || 0) + 1; });
      const exponentForm = Object.entries(factorCounts).map(([base, exp]) => exp > 1 ? base + "^" + exp : base).join(" x ");
      return {
        primary: { label: "Prime Factorization", value: factors.join(" x ") },
        details: [
          { label: "Exponent Form", value: exponentForm },
          { label: "Unique Prime Factors", value: uniqueFactors.join(", ") },
          { label: "Is Prime", value: isPrime ? "Yes" : "No" },
          { label: "Number of Factors", value: formatNumber(factors.length) },
        ],
      };
    }`,
  [{ q: 'What is prime factorization?', a: 'Prime factorization is the process of breaking down a number into a product of prime numbers. For example, 360 = 2 x 2 x 2 x 3 x 3 x 5.' },
   { q: 'Why is prime factorization important?', a: 'Prime factorization is fundamental in number theory, cryptography, and computing. It is used in RSA encryption and for finding greatest common divisors.' }],
  'Divide by smallest prime repeatedly: n / 2, n / 3, n / 5, ... until n = 1',
  ['fibonacci-calculator', 'combination-permutation-calculator']
);

// #96 Combination and Permutation
add('combination-permutation-calculator', 'Combination and Permutation Calculator',
  'Calculate combinations (nCr) and permutations (nPr) for a given n and r.',
  'Math', 'math', '+',
  ['combination calculator', 'permutation calculator', 'nCr nPr calculator'],
  [
    '{ name: "n", label: "Total Items (n)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 10 }',
    '{ name: "r", label: "Items Chosen (r)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 3 }',
  ],
  `(inputs) => {
      const n = inputs.n as number;
      const r = inputs.r as number;
      if (n === undefined || r === undefined || n < 0 || r < 0 || r > n) return null;
      const factorial = (x: number): number => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
      const perm = factorial(n) / factorial(n - r);
      const comb = perm / factorial(r);
      const nFact = factorial(n);
      return {
        primary: { label: "Combinations C(" + n + "," + r + ")", value: formatNumber(comb) },
        details: [
          { label: "Permutations P(" + n + "," + r + ")", value: formatNumber(perm) },
          { label: "n!", value: formatNumber(nFact) },
          { label: "Ratio C/P", value: formatNumber(Math.round(comb / (perm || 1) * 10000) / 10000) },
        ],
      };
    }`,
  [{ q: 'What is the difference between combinations and permutations?', a: 'Permutations count ordered arrangements (order matters), while combinations count unordered selections (order does not matter). P(n,r) = n!/(n-r)! and C(n,r) = n!/(r!(n-r)!).' },
   { q: 'When do I use combinations versus permutations?', a: 'Use permutations when the order of selection matters (like rankings or codes). Use combinations when order does not matter (like choosing team members or lottery numbers).' }],
  'C(n,r) = n! / (r! x (n-r)!); P(n,r) = n! / (n-r)!',
  ['prime-factorization-calculator', 'fibonacci-calculator']
);

// #97 Modular Arithmetic
add('modular-arithmetic-calculator', 'Modular Arithmetic Calculator',
  'Perform modular arithmetic operations including mod, modular exponentiation, and inverse.',
  'Math', 'math', '+',
  ['modular arithmetic', 'mod calculator', 'modulus calculator'],
  [
    '{ name: "a", label: "Number (a)", type: "number", suffix: "", min: -100000, max: 100000, defaultValue: 17 }',
    '{ name: "b", label: "Modulus (m)", type: "number", suffix: "", min: 1, max: 100000, defaultValue: 5 }',
    '{ name: "exp", label: "Exponent (optional)", type: "number", suffix: "", min: 0, max: 1000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const a = inputs.a as number;
      const m = inputs.b as number;
      const exp = inputs.exp as number || 0;
      if (a === undefined || !m || m <= 0) return null;
      const modResult = ((a % m) + m) % m;
      let modExp = 0;
      if (exp > 0) {
        let result = 1;
        let base = ((a % m) + m) % m;
        let e = exp;
        while (e > 0) {
          if (e % 2 === 1) result = (result * base) % m;
          base = (base * base) % m;
          e = Math.floor(e / 2);
        }
        modExp = result;
      }
      let inverse = -1;
      for (let i = 1; i < m; i++) {
        if ((modResult * i) % m === 1) { inverse = i; break; }
      }
      return {
        primary: { label: a + " mod " + m, value: formatNumber(modResult) },
        details: [
          { label: "a mod m", value: formatNumber(modResult) },
          { label: "Modular Inverse", value: inverse >= 0 ? formatNumber(inverse) : "Does not exist" },
          { label: "a^exp mod m", value: exp > 0 ? formatNumber(modExp) : "Enter exponent to compute" },
        ],
      };
    }`,
  [{ q: 'What is modular arithmetic?', a: 'Modular arithmetic is a system of arithmetic for integers where numbers wrap around after reaching a certain value called the modulus. For example, 17 mod 5 = 2.' },
   { q: 'What is a modular inverse?', a: 'The modular inverse of a (mod m) is a number x such that (a x x) mod m = 1. It exists only when a and m are coprime (their greatest common divisor is 1).' }],
  'a mod m = remainder of a / m; Modular Inverse: (a x x) mod m = 1',
  ['prime-factorization-calculator', 'logarithm-calculator']
);

// #98 Logarithm
add('logarithm-calculator', 'Logarithm Calculator',
  'Calculate logarithms with any base, including natural log and log base 10.',
  'Math', 'math', '+',
  ['logarithm calculator', 'log calculator', 'natural log calculator'],
  [
    '{ name: "value", label: "Value", type: "number", suffix: "", min: 0.0001, max: 1e15, defaultValue: 100 }',
    '{ name: "base", label: "Base", type: "number", suffix: "", min: 0.01, max: 1000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const value = inputs.value as number;
      const base = inputs.base as number;
      if (!value || value <= 0 || !base || base <= 0 || base === 1) return null;
      const result = Math.log(value) / Math.log(base);
      const ln = Math.log(value);
      const log10 = Math.log10(value);
      const log2 = Math.log2(value);
      return {
        primary: { label: "log base " + base + " of " + value, value: formatNumber(Math.round(result * 1000000) / 1000000) },
        details: [
          { label: "Natural Log (ln)", value: formatNumber(Math.round(ln * 1000000) / 1000000) },
          { label: "Log Base 10", value: formatNumber(Math.round(log10 * 1000000) / 1000000) },
          { label: "Log Base 2", value: formatNumber(Math.round(log2 * 1000000) / 1000000) },
        ],
      };
    }`,
  [{ q: 'What is a logarithm?', a: 'A logarithm answers the question: to what power must the base be raised to produce a given number? For example, log base 10 of 100 = 2 because 10^2 = 100.' },
   { q: 'What is the natural logarithm?', a: 'The natural logarithm (ln) uses the mathematical constant e (approximately 2.71828) as its base. It is fundamental in calculus, physics, and engineering.' }],
  'log_b(x) = ln(x) / ln(b) where ln is the natural logarithm',
  ['modular-arithmetic-calculator', 'series-sum-calculator']
);

// #99 Series Sum
add('series-sum-calculator', 'Series Sum Calculator',
  'Calculate the sum of arithmetic and geometric series given the first term, common difference or ratio, and number of terms.',
  'Math', 'math', '+',
  ['series sum', 'arithmetic series', 'geometric series calculator'],
  [
    '{ name: "firstTerm", label: "First Term (a)", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 1 }',
    '{ name: "commonValue", label: "Common Difference (d) or Ratio (r)", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 2 }',
    '{ name: "terms", label: "Number of Terms (n)", type: "number", suffix: "", min: 1, max: 1000, defaultValue: 10 }',
    '{ name: "type", label: "Series Type", type: "select", options: [{value:"arithmetic",label:"Arithmetic"},{value:"geometric",label:"Geometric"}], defaultValue: "arithmetic" }',
  ],
  `(inputs) => {
      const a = inputs.firstTerm as number;
      const cv = inputs.commonValue as number;
      const n = inputs.terms as number;
      const type = inputs.type as string;
      if (a === undefined || cv === undefined || !n || n <= 0) return null;
      let sum = 0;
      let lastTerm = 0;
      if (type === "arithmetic") {
        lastTerm = a + (n - 1) * cv;
        sum = n * (a + lastTerm) / 2;
      } else {
        if (cv === 1) { sum = a * n; lastTerm = a; }
        else { sum = a * (1 - Math.pow(cv, n)) / (1 - cv); lastTerm = a * Math.pow(cv, n - 1); }
      }
      return {
        primary: { label: "Sum of Series", value: formatNumber(Math.round(sum * 10000) / 10000) },
        details: [
          { label: "Series Type", value: type === "arithmetic" ? "Arithmetic" : "Geometric" },
          { label: "Last Term", value: formatNumber(Math.round(lastTerm * 10000) / 10000) },
          { label: "Number of Terms", value: formatNumber(n) },
          { label: "Average Term", value: formatNumber(Math.round(sum / n * 10000) / 10000) },
        ],
      };
    }`,
  [{ q: 'What is an arithmetic series?', a: 'An arithmetic series is the sum of terms with a constant difference between consecutive terms. For example, 2 + 4 + 6 + 8 has a common difference of 2.' },
   { q: 'What is a geometric series?', a: 'A geometric series is the sum of terms where each term is multiplied by a constant ratio. For example, 3 + 6 + 12 + 24 has a common ratio of 2.' }],
  'Arithmetic: S = n(a + last)/2; Geometric: S = a(1 - r^n)/(1 - r)',
  ['fibonacci-calculator', 'logarithm-calculator']
);

// #100 Complex Number
add('complex-number-calculator', 'Complex Number Calculator',
  'Perform operations on complex numbers including addition, multiplication, and magnitude.',
  'Math', 'math', '+',
  ['complex number calculator', 'imaginary number calculator', 'complex arithmetic'],
  [
    '{ name: "a1", label: "First Number - Real Part", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 3 }',
    '{ name: "b1", label: "First Number - Imaginary Part", type: "number", suffix: "i", min: -10000, max: 10000, defaultValue: 4 }',
    '{ name: "a2", label: "Second Number - Real Part", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 1 }',
    '{ name: "b2", label: "Second Number - Imaginary Part", type: "number", suffix: "i", min: -10000, max: 10000, defaultValue: 2 }',
  ],
  `(inputs) => {
      const a1 = inputs.a1 as number;
      const b1 = inputs.b1 as number;
      const a2 = inputs.a2 as number;
      const b2 = inputs.b2 as number;
      if (a1 === undefined || b1 === undefined || a2 === undefined || b2 === undefined) return null;
      const sumR = a1 + a2;
      const sumI = b1 + b2;
      const mulR = a1 * a2 - b1 * b2;
      const mulI = a1 * b2 + b1 * a2;
      const mag1 = Math.sqrt(a1 * a1 + b1 * b1);
      const mag2 = Math.sqrt(a2 * a2 + b2 * b2);
      const phase1 = Math.atan2(b1, a1) * 180 / Math.PI;
      const fmt = (r: number, i: number) => {
        const sign = i >= 0 ? "+" : "-";
        return r + " " + sign + " " + Math.abs(i) + "i";
      };
      return {
        primary: { label: "Sum", value: fmt(sumR, sumI) },
        details: [
          { label: "Product", value: fmt(mulR, mulI) },
          { label: "Magnitude of First", value: formatNumber(Math.round(mag1 * 10000) / 10000) },
          { label: "Magnitude of Second", value: formatNumber(Math.round(mag2 * 10000) / 10000) },
          { label: "Phase of First", value: formatNumber(Math.round(phase1 * 100) / 100) + " degrees" },
        ],
      };
    }`,
  [{ q: 'What is a complex number?', a: 'A complex number has a real part and an imaginary part, written as a + bi where i is the square root of -1. They extend the real numbers and are essential in many areas of mathematics and engineering.' },
   { q: 'How do you multiply complex numbers?', a: 'Multiply using the distributive property: (a + bi)(c + di) = (ac - bd) + (ad + bc)i. The key rule is that i squared equals -1.' }],
  'Sum: (a1+a2) + (b1+b2)i; Product: (a1a2-b1b2) + (a1b2+b1a2)i; Magnitude: sqrt(a^2+b^2)',
  ['vector-magnitude-calculator', 'matrix-determinant-calculator']
);

// =============================================================================
// FILE GENERATOR
// =============================================================================
function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc.replace(/"/g, '\\"')}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: [${c.kw.map(k => `"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '').replace(' Generator', '').replace(' Converter', '').replace(' Estimator', '')}",
    description: "${c.desc.split('.')[0].replace(/"/g, '\\"')}",
    fields: [
${c.fields.map(f => '      ' + f + ',').join('\n')}
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: [${c.rel.map(r => `"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq[0].q.replace(/"/g, '\\"')}", answer: "${c.faq[0].a.replace(/"/g, '\\"')}" },
    { question: "${c.faq[1].q.replace(/"/g, '\\"')}", answer: "${c.faq[1].a.replace(/"/g, '\\"')}" },
  ],
  formula: "${c.formula.replace(/"/g, '\\"')}",
};
`;
}

let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; console.log(`SKIP (file): ${c.slug}`); continue; }
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${eName(c.slug)} } from "./${c.slug}";`);
  regs.push(`  ${eName(c.slug)},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-batch1.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch1.txt'), regs.join('\n'));
console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);
console.log(`Imports saved to: scripts/new-imports-batch1.txt`);
console.log(`Registry saved to: scripts/new-regs-batch1.txt`);
