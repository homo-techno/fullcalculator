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

const F = (n, l, opts) => ({ n, l, t: 'number', ...opts });

const defs = [
  // Smart Home (5)
  {s:'smart-home-cost-calculator',t:'Smart Home Cost',c:'Everyday',cs:'everyday',i:'~',k:['smart home cost'],f:[F('devices','Devices',{min:1}),F('avgCost','Avg Cost/Device ($)',{dv:50})],u:'Total Cost'},
  {s:'smart-lock-roi-calculator',t:'Smart Lock ROI',c:'Everyday',cs:'everyday',i:'~',k:['smart lock calculator'],f:[F('lockCost','Lock Cost ($)',{dv:200}),F('keysCut','Keys Cut/Year ($)',{dv:25})],u:'Payback Months'},
  {s:'solar-battery-size-calculator',t:'Solar Battery Size',c:'Science',cs:'science',i:'A',k:['solar battery calculator'],f:[F('dailyUsage','Daily Usage (kWh)',{min:1}),F('backupDays','Backup Days',{dv:1})],u:'Battery Size (kWh)'},
  {s:'ev-home-charger-calculator',t:'EV Home Charger',c:'Everyday',cs:'everyday',i:'~',k:['ev charger cost'],f:[F('install','Install Cost ($)',{dv:1500}),F('monthlySavings','Gas Savings/Mo ($)',{dv:150})],u:'Payback Months'},
  {s:'smart-sprinkler-calculator',t:'Smart Sprinkler Savings',c:'Everyday',cs:'everyday',i:'~',k:['sprinkler savings'],f:[F('monthlyWater','Monthly Water ($)',{dv:80}),F('savings','Savings %',{dv:30})],u:'Annual Savings'},

  // Fitness gear (5)
  {s:'treadmill-cost-calculator',t:'Treadmill Cost',c:'Health',cs:'health',i:'H',k:['treadmill cost'],f:[F('price','Price ($)',{min:200}),F('monthly','Gym Saved/Mo ($)',{dv:50})],u:'Payback Months'},
  {s:'peloton-cost-calculator',t:'Peloton Cost',c:'Health',cs:'health',i:'H',k:['peloton cost analysis'],f:[F('bike','Bike Cost ($)',{dv:1500}),F('monthly','Subscription/Mo ($)',{dv:44}),F('months','Months',{dv:24})],u:'Total Cost'},
  {s:'home-sauna-cost-calculator',t:'Home Sauna Cost',c:'Health',cs:'health',i:'H',k:['sauna cost'],f:[F('type','Type (1=IR,2=trad)',{dv:1}),F('baseCost','Base Cost ($)',{dv:3000}),F('install','Install ($)',{dv:500})],u:'Total Cost'},
  {s:'cold-plunge-cost-calculator',t:'Cold Plunge Cost',c:'Health',cs:'health',i:'H',k:['cold plunge cost'],f:[F('unit','Unit Cost ($)',{dv:5000}),F('electric','Monthly Electric ($)',{dv:30}),F('months','Months',{dv:12})],u:'Annual Cost'},
  {s:'massage-gun-value-calculator',t:'Massage Gun Value',c:'Health',cs:'health',i:'H',k:['massage gun vs massage'],f:[F('gunCost','Gun Cost ($)',{dv:300}),F('massageCost','Massage Cost ($)',{dv:80}),F('freq','Massages/Month',{dv:2})],u:'Payback Months'},

  // Board games & hobbies (5)
  {s:'board-game-value-calculator',t:'Board Game Value',c:'Everyday',cs:'everyday',i:'~',k:['board game cost per play'],f:[F('price','Game Price ($)',{min:1}),F('plays','Times Played',{min:1})],u:'Cost/Play'},
  {s:'lego-cost-per-piece-calculator',t:'LEGO Cost Per Piece',c:'Everyday',cs:'everyday',i:'~',k:['lego price per piece'],f:[F('price','Set Price ($)',{min:1}),F('pieces','Piece Count',{min:1})],u:'Price/Piece'},
  {s:'model-train-track-calculator',t:'Model Train Track',c:'Everyday',cs:'everyday',i:'~',k:['model train layout'],f:[F('length','Layout Length (ft)',{min:2}),F('width','Layout Width (ft)',{min:2}),F('trackCost','Track/Ft ($)',{dv:3})],u:'Track Cost'},
  {s:'stamp-collection-value-calculator',t:'Stamp Collection Value',c:'Everyday',cs:'everyday',i:'~',k:['stamp value calculator'],f:[F('stamps','Number of Stamps',{min:1}),F('avgValue','Avg Value ($)',{dv:0.50})],u:'Collection Value'},
  {s:'coin-collection-value-calculator',t:'Coin Collection Value',c:'Everyday',cs:'everyday',i:'~',k:['coin collection value'],f:[F('coins','Number of Coins',{min:1}),F('avgValue','Avg Value ($)',{dv:5})],u:'Collection Value'},

  // Insurance niche (5)
  {s:'renters-insurance-calculator',t:'Renters Insurance',c:'Finance',cs:'finance',i:'$',k:['renters insurance cost'],f:[F('belongings','Belongings Value ($)',{min:1000}),F('deductible','Deductible ($)',{dv:500})],u:'Monthly Premium'},
  {s:'flood-insurance-calculator',t:'Flood Insurance',c:'Finance',cs:'finance',i:'$',k:['flood insurance cost'],f:[F('homeValue','Home Value ($)',{min:50000}),F('zone','Flood Zone (1-3)',{dv:2})],u:'Annual Premium'},
  {s:'earthquake-insurance-calculator',t:'Earthquake Insurance',c:'Finance',cs:'finance',i:'$',k:['earthquake insurance'],f:[F('homeValue','Home Value ($)',{min:50000}),F('zone','Seismic Zone (1-4)',{dv:2})],u:'Annual Premium'},
  {s:'cyber-insurance-calculator',t:'Cyber Insurance',c:'Finance',cs:'finance',i:'$',k:['cyber insurance cost'],f:[F('revenue','Annual Revenue ($)',{min:10000}),F('employees','Employees',{min:1})],u:'Annual Premium'},
  {s:'boat-insurance-calculator',t:'Boat Insurance',c:'Finance',cs:'finance',i:'$',k:['boat insurance cost'],f:[F('boatValue','Boat Value ($)',{min:1000}),F('length','Length (ft)',{min:10})],u:'Annual Premium'},

  // Niche math (5)
  {s:'napier-logarithm-calculator',t:'Napier Logarithm',c:'Math',cs:'math',i:'+',k:['napier logarithm'],f:[F('n','Number',{min:0.01}),F('base','Base',{dv:2.718})],u:'Log Result'},
  {s:'hyperbolic-sine-calculator',t:'Hyperbolic Sine',c:'Math',cs:'math',i:'+',k:['sinh calculator'],f:[F('x','Value',{})],u:'sinh(x)'},
  {s:'hyperbolic-cosine-calculator',t:'Hyperbolic Cosine',c:'Math',cs:'math',i:'+',k:['cosh calculator'],f:[F('x','Value',{})],u:'cosh(x)'},
  {s:'sigmoid-function-calculator',t:'Sigmoid Function',c:'Math',cs:'math',i:'+',k:['sigmoid calculator'],f:[F('x','Input Value',{}),F('k','Steepness',{dv:1})],u:'σ(x)'},
  {s:'softmax-calculator',t:'Softmax Function',c:'Math',cs:'math',i:'+',k:['softmax calculator'],f:[F('x1','Value 1',{dv:1}),F('x2','Value 2',{dv:2}),F('x3','Value 3',{dv:3})],u:'Probabilities'},
];

function genFile(d) {
  const name = eName(d.s);
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${name}: CalculatorDefinition = {
  slug: "${d.s}",
  title: "${d.t} Calculator",
  description: "Free ${d.t.toLowerCase()} calculator. Get instant results.",
  category: "${d.c}",
  categorySlug: "${d.cs}",
  icon: "${d.i}",
  keywords: [${d.k.map(k=>`"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${d.t}",
    description: "",
    fields: [
${d.f.map(f => {
  let s = `      { name: "${f.n}", label: "${f.l}", type: "number"`;
  if(f.min!==undefined) s+=`, min: ${f.min}`;
  if(f.max!==undefined) s+=`, max: ${f.max}`;
  if(f.dv!==undefined) s+=`, defaultValue: ${f.dv}`;
  return s+' },';
}).join('\n')}
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "${d.u}", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ${d.t.toLowerCase()}?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
`;
}

let gen = 0, skip = 0;
const imports = [], regs = [];

for (const d of defs) {
  if (existingSlugs.has(d.s)) { skip++; continue; }
  if (fs.existsSync(path.join(CALC_DIR, d.s + '.ts'))) { skip++; continue; }
  fs.writeFileSync(path.join(CALC_DIR, d.s + '.ts'), genFile(d));
  imports.push(`import { ${eName(d.s)} } from "./${d.s}";`);
  regs.push(`  ${eName(d.s)},`);
  gen++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-b6.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-b6.txt'), regs.join('\n'));
console.log(`Generated: ${gen} | Skipped: ${skip}`);
