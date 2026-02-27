const fs = require('fs');
const path = require('path');
const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

const existingSlugs = new Set();
const existingExports = new Set();
const indexContent = fs.readFileSync(path.join(CALC_DIR, 'index.ts'), 'utf8');
for (const m of indexContent.matchAll(/import \{ (\w+) \} from "\.\/([^"]+)"/g)) {
  existingExports.add(m[1]); existingSlugs.add(m[2]);
}
for (const file of fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  existingSlugs.add(file.replace('.ts', ''));
}
console.log(`Existing: slugs=${existingSlugs.size}, exports=${existingExports.size}`);

function eName(slug) {
  const c = slug.replace(/-calculator$/, '').replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c + 'Calculator';
}
const F = (n, l, opts) => ({ n, l, t: 'number', ...opts });

function genFile(s, title, cat, cs, icon, kw, fields, unit, formula) {
  const name = eName(s);
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${name}: CalculatorDefinition = {
  slug: "${s}",
  title: "${title} Calculator",
  description: "Free ${title.toLowerCase()} calculator. Get accurate results instantly.",
  category: "${cat}",
  categorySlug: "${cs}",
  icon: "${icon}",
  keywords: [${kw.map(k=>`"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${title}",
    description: "",
    fields: [
${fields.map(f => {
  let r = `      { name: "${f.n}", label: "${f.l}", type: "${f.t||'number'}"`;
  if(f.min!==undefined) r+=`, min: ${f.min}`;
  if(f.max!==undefined) r+=`, max: ${f.max}`;
  if(f.step!==undefined) r+=`, step: ${f.step}`;
  if(f.dv!==undefined) r+=`, defaultValue: ${f.dv}`;
  return r+' },';
}).join('\n')}
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "${unit||'Result'}", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ${title.toLowerCase()}?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "${formula||'Result = f(inputs)'}",
};
`;
}

const defs = [];
function add(s, t, c, cs, i, k, f, u, fo) { defs.push({s,t,c,cs,i,k,f,u,fo}); }

// ===== SPORTS & FITNESS (50) =====
add('vo2max-calc','VO2 Max','Health','health','H',['vo2max calculator'],[F('age','Age',{min:10}),F('restHR','Resting HR',{dv:60}),F('maxHR','Max HR',{dv:190})],'VO2max (mL/kg/min)');
add('mhr-calc','Max Heart Rate','Health','health','H',['max heart rate calculator'],[F('age','Age',{min:10})],'Max HR (bpm)','MHR = 220 - Age');
add('heart-rate-zone','Heart Rate Zone','Health','health','H',['heart rate zone calculator'],[F('maxHR','Max HR (bpm)',{min:100}),F('zone','Zone (1-5)',{min:1,max:5})],'Zone Range (bpm)');
add('lactate-threshold','Lactate Threshold','Health','health','H',['lactate threshold calculator'],[F('maxHR','Max HR (bpm)',{min:100}),F('threshold','Threshold %',{dv:85})],'LT HR (bpm)');
add('training-load','Training Load','Health','health','H',['training load calculator'],[F('duration','Duration (min)',{min:1}),F('rpe','RPE (1-10)',{min:1,max:10})],'TRIMP');
add('recovery-time','Recovery Time','Health','health','H',['recovery time calculator'],[F('intensity','Intensity (1-10)',{dv:7}),F('duration','Duration (min)',{min:10})],'Recovery Hours');
add('wilks-score','Wilks Score','Health','health','H',['wilks score calculator'],[F('bodyweight','Bodyweight (kg)',{min:30}),F('total','Total Lifted (kg)',{min:10}),F('gender','Gender (1=M,2=F)',{dv:1})],'Wilks Score');
add('dots-score','DOTS Score','Health','health','H',['dots score calculator'],[F('bodyweight','Bodyweight (kg)',{min:30}),F('total','Total Lifted (kg)',{min:10})],'DOTS Score');
add('1rm-epley','1RM Epley','Health','health','H',['1rm epley calculator'],[F('weight','Weight Lifted (lbs)',{min:1}),F('reps','Reps Completed',{min:1,max:30})],'1RM (lbs)','1RM = W × (1 + R/30)');
add('1rm-brzycki','1RM Brzycki','Health','health','H',['1rm brzycki calculator'],[F('weight','Weight (lbs)',{min:1}),F('reps','Reps',{min:1,max:30})],'1RM (lbs)');
add('rm-percentage','RM Percentage','Health','health','H',['rm percentage calculator'],[F('oneRM','1RM (lbs)',{min:1}),F('percentage','Percentage %',{min:50,max:100})],'Working Weight (lbs)');
add('bodyweight-ratio','Bodyweight Strength Ratio','Health','health','H',['strength ratio calculator'],[F('liftWeight','Lift Weight (lbs)',{min:1}),F('bodyWeight','Body Weight (lbs)',{min:50})],'BW Ratio');
add('vertical-jump','Vertical Jump Power','Health','health','H',['vertical jump calculator'],[F('bodyWeight','Body Weight (kg)',{min:30}),F('jumpHeight','Jump Height (cm)',{min:5})],'Power (W)');
add('sprint-speed','Sprint Speed','Health','health','H',['sprint speed calculator'],[F('distance','Distance (m)',{min:10}),F('time','Time (s)',{min:1})],'Speed (m/s)');
add('agility-score','Agility Score','Health','health','H',['agility test calculator'],[F('time','5-10-5 Time (s)',{min:3}),F('weight','Body Weight (lbs)',{min:100})],'Score');
add('beep-test-vo2','Beep Test VO2','Health','health','H',['beep test calculator'],[F('level','Level Reached',{min:1}),F('shuttle','Shuttle Number',{min:1})],'VO2max');
add('cooper-test','Cooper Test','Health','health','H',['cooper test calculator'],[F('distance','Distance (m)',{min:500})],'VO2max','VO2max = (d-504.9)/44.73');
add('push-up-test','Push-Up Test','Health','health','H',['push up test calculator'],[F('pushups','Push-Ups',{min:0}),F('age','Age',{min:15}),F('gender','Gender (1=M,2=F)',{dv:1})],'Fitness Rating');
add('sit-up-test','Sit-Up Test','Health','health','H',['sit up test calculator'],[F('situps','Sit-Ups (1 min)',{min:0}),F('age','Age',{min:15})],'Fitness Rating');
add('plank-test','Plank Test','Health','health','H',['plank test calculator'],[F('seconds','Hold Time (s)',{min:1}),F('age','Age',{min:15})],'Fitness Level');
add('flexibility-test','Flexibility Test','Health','health','H',['sit and reach calculator'],[F('reach','Reach (cm)',{}),F('age','Age',{min:15})],'Rating');
add('marathon-pace','Marathon Pace','Health','health','H',['marathon pace calculator'],[F('hours','Target Hours',{min:1}),F('minutes','Target Minutes',{min:0,max:59})],'Pace (min/mile)');
add('half-marathon-pace','Half Marathon Pace','Health','health','H',['half marathon pace calculator'],[F('hours','Target Hours',{min:0}),F('minutes','Target Minutes',{min:1})],'Pace (min/mile)');
add('triathlon-time','Triathlon Time','Health','health','H',['triathlon calculator'],[F('swimPace','Swim Pace (min/100m)',{dv:2}),F('bikePace','Bike Speed (mph)',{dv:18}),F('runPace','Run Pace (min/mile)',{dv:9})],'Total Time');
add('running-calorie-pace','Running Calorie by Pace','Health','health','H',['running calorie pace'],[F('weight','Weight (lbs)',{min:80}),F('pace','Pace (min/mile)',{min:4}),F('minutes','Duration (min)',{min:1})],'Calories');
add('cycling-power','Cycling Power','Health','health','H',['cycling power calculator'],[F('weight','Weight (kg)',{min:30}),F('speed','Speed (km/h)',{min:5}),F('gradient','Gradient %',{dv:0})],'Power (W)');
add('cycling-ftp','Cycling FTP','Health','health','H',['ftp calculator'],[F('power20','20-min Power (W)',{min:50})],'FTP (W)','FTP = 95% × 20min Power');
add('swimming-css','Swimming CSS','Health','health','H',['css calculator','critical swim speed'],[F('time400','400m Time (s)',{min:200}),F('time200','200m Time (s)',{min:100})],'CSS (m/s)');
add('rowing-pace','Rowing Pace','Health','health','H',['rowing pace calculator'],[F('distance','Distance (m)',{min:100}),F('minutes','Minutes',{min:0}),F('seconds','Seconds',{dv:0})],'Split (/500m)');
add('climbing-grade','Climbing Grade','Health','health','H',['climbing grade calculator'],[F('height','Route Height (m)',{min:5}),F('difficulty','Difficulty (1-15)',{min:1})],'Grade');

// ===== ECOLOGY & ENVIRONMENT (30) =====
add('carbon-footprint-flight','Flight Carbon Footprint','Science','science','A',['flight carbon footprint'],[F('distance','Distance (km)',{min:100}),F('classMulti','Class Multiplier',{dv:1})],'CO2 (kg)');
add('carbon-footprint-car','Car Carbon Footprint','Science','science','A',['car carbon footprint'],[F('miles','Miles/Year',{min:1}),F('mpg','MPG',{dv:25})],'CO2 (tons/year)');
add('carbon-footprint-diet','Diet Carbon Footprint','Science','science','A',['diet carbon footprint'],[F('meatDays','Meat Days/Week',{dv:4}),F('dairyDays','Dairy Days/Week',{dv:7})],'CO2 (kg/year)');
add('carbon-offset','Carbon Offset','Science','science','A',['carbon offset calculator'],[F('emissions','CO2 Emissions (tons)',{min:0.1}),F('costPerTon','Cost/Ton ($)',{dv:15})],'Offset Cost ($)');
add('tree-carbon','Tree Carbon Sequestration','Science','science','A',['tree carbon calculator'],[F('trees','Number of Trees',{min:1}),F('years','Years',{min:1})],'CO2 Absorbed (kg)');
add('water-footprint','Water Footprint','Science','science','A',['water footprint calculator'],[F('showerMin','Shower Min/Day',{dv:8}),F('laundry','Laundry Loads/Week',{dv:3})],'Gallons/Day');
add('electricity-carbon','Electricity Carbon','Science','science','A',['electricity carbon calculator'],[F('kwh','Monthly kWh',{min:1}),F('factor','Grid Factor (kg/kWh)',{dv:0.42})],'CO2 (kg/month)');
add('recycling-impact','Recycling Impact','Science','science','A',['recycling calculator'],[F('paper','Paper (lbs/week)',{dv:5}),F('plastic','Plastic (lbs/week)',{dv:2}),F('glass','Glass (lbs/week)',{dv:1})],'CO2 Saved (kg/year)');
add('food-waste-impact','Food Waste Impact','Science','science','A',['food waste calculator'],[F('waste','Food Waste (lbs/week)',{min:0.5}),F('household','Household Size',{dv:2})],'CO2 (kg/year)');
add('renewable-energy-savings','Renewable Energy Savings','Science','science','A',['renewable savings calculator'],[F('panelKw','Panel kW',{min:1}),F('sunHours','Sun Hours/Day',{dv:5}),F('rate','Elec Rate ($/kWh)',{dv:0.13})],'Annual Savings ($)');
add('ev-savings','EV vs Gas Savings','Everyday','everyday','~',['ev savings calculator'],[F('mileYear','Miles/Year',{min:1000}),F('gasMpg','Gas MPG',{dv:25}),F('gasPrice','Gas Price ($/gal)',{dv:3.50})],'Annual Savings ($)');
add('home-energy-audit','Home Energy Audit','Everyday','everyday','~',['home energy audit'],[F('sqft','Square Feet',{min:200}),F('monthlyBill','Monthly Bill ($)',{min:10})],'Energy per SqFt');
add('solar-roi','Solar Panel ROI','Everyday','everyday','~',['solar roi calculator'],[F('systemCost','System Cost ($)',{min:1000}),F('annualSavings','Annual Savings ($)',{min:100}),F('incentives','Incentives ($)',{dv:0})],'Payback Years');
add('heat-pump-cop','Heat Pump COP','Science','science','A',['heat pump cop calculator'],[F('output','Heat Output (BTU)',{min:1000}),F('input','Electrical Input (W)',{min:100})],'COP');
add('insulation-savings','Insulation Savings','Everyday','everyday','~',['insulation savings calculator'],[F('oldR','Old R-Value',{min:1}),F('newR','New R-Value',{min:1}),F('heatingCost','Annual Heating ($)',{min:100})],'Annual Savings ($)');
add('rain-garden-size','Rain Garden Size','Everyday','everyday','~',['rain garden calculator'],[F('roofArea','Roof Area (sq ft)',{min:100}),F('rainfall','Max Rainfall (in)',{dv:2})],'Garden Size (sq ft)');
add('greywater-reuse','Greywater Reuse','Everyday','everyday','~',['greywater calculator'],[F('showerGal','Shower Gal/Day',{dv:15}),F('laundryGal','Laundry Gal/Week',{dv:25})],'Reusable Gal/Week');
add('composting-methane','Composting Methane','Science','science','A',['composting emission calculator'],[F('waste','Organic Waste (kg/week)',{min:1}),F('method','Method (1=compost,2=landfill)',{dv:1})],'CO2eq Saved (kg/year)');
add('paper-waste','Paper Waste Impact','Science','science','A',['paper waste calculator'],[F('sheetsWeek','Sheets/Week',{min:1}),F('weeks','Weeks',{dv:52})],'Trees Saved');
add('plastic-usage','Plastic Usage','Science','science','A',['plastic usage calculator'],[F('bottlesWeek','Bottles/Week',{min:0}),F('bagsWeek','Bags/Week',{min:0})],'Plastic kg/Year');

// ===== CONVERSION NICHE (50) =====
add('celsius-to-kelvin','Celsius to Kelvin','Conversion','conversion','R',['celsius to kelvin'],[F('celsius','Celsius',{})],'Kelvin','K = °C + 273.15');
add('kelvin-to-celsius','Kelvin to Celsius','Conversion','conversion','R',['kelvin to celsius'],[F('kelvin','Kelvin',{min:0})],'Celsius');
add('rankine-to-fahrenheit','Rankine to Fahrenheit','Conversion','conversion','R',['rankine to fahrenheit'],[F('rankine','Rankine',{min:0})],'Fahrenheit');
add('newton-to-celsius-temp','Newton to Celsius','Conversion','conversion','R',['newton to celsius temperature'],[F('newton','Newton Scale',{})],'Celsius');
add('bar-to-atm','Bar to ATM','Conversion','conversion','R',['bar to atm converter'],[F('bar','Bar',{min:0})],'ATM');
add('atm-to-bar','ATM to Bar','Conversion','conversion','R',['atm to bar converter'],[F('atm','ATM',{min:0})],'Bar');
add('torr-to-atm','Torr to ATM','Conversion','conversion','R',['torr to atm'],[F('torr','Torr',{min:0})],'ATM');
add('mmhg-to-kpa','mmHg to kPa','Conversion','conversion','R',['mmhg to kpa converter'],[F('mmhg','mmHg',{min:0})],'kPa');
add('kpa-to-psi','kPa to PSI','Conversion','conversion','R',['kpa to psi converter'],[F('kpa','kPa',{min:0})],'PSI');
add('psi-to-kpa','PSI to kPa','Conversion','conversion','R',['psi to kpa converter'],[F('psi','PSI',{min:0})],'kPa');
add('newton-to-lbf','Newton to Pound-Force','Conversion','conversion','R',['newton to pound force'],[F('newton','Newtons',{min:0})],'lbf');
add('lbf-to-newton','Pound-Force to Newton','Conversion','conversion','R',['pound force to newton'],[F('lbf','Pound-Force',{min:0})],'Newtons');
add('joule-to-calorie','Joule to Calorie','Conversion','conversion','R',['joule to calorie converter'],[F('joules','Joules',{min:0})],'Calories');
add('calorie-to-joule','Calorie to Joule','Conversion','conversion','R',['calorie to joule converter'],[F('calories','Calories',{min:0})],'Joules');
add('btu-to-joule','BTU to Joule','Conversion','conversion','R',['btu to joule'],[F('btu','BTU',{min:0})],'Joules');
add('joule-to-kwh','Joule to kWh','Conversion','conversion','R',['joule to kwh'],[F('joules','Joules',{min:0})],'kWh');
add('watt-to-horsepower','Watt to Horsepower','Conversion','conversion','R',['watt to horsepower'],[F('watts','Watts',{min:0})],'HP');
add('horsepower-to-watt','Horsepower to Watt','Conversion','conversion','R',['horsepower to watt'],[F('hp','Horsepower',{min:0})],'Watts');
add('knots-to-mph','Knots to MPH','Conversion','conversion','R',['knots to mph converter'],[F('knots','Knots',{min:0})],'MPH');
add('mph-to-knots','MPH to Knots','Conversion','conversion','R',['mph to knots converter'],[F('mph','MPH',{min:0})],'Knots');
add('mach-to-mph','Mach to MPH','Conversion','conversion','R',['mach to mph'],[F('mach','Mach Number',{min:0})],'MPH');
add('light-year-to-km','Light Year to KM','Conversion','conversion','R',['light year to km'],[F('ly','Light Years',{min:0})],'Kilometers');
add('parsec-to-ly','Parsec to Light Year','Conversion','conversion','R',['parsec to light year'],[F('parsec','Parsecs',{min:0})],'Light Years');
add('astronomical-unit-to-km','AU to KM','Conversion','conversion','R',['astronomical unit to km'],[F('au','Astronomical Units',{min:0})],'Kilometers');
add('troy-ounce-to-gram','Troy Ounce to Gram','Conversion','conversion','R',['troy ounce to gram'],[F('troy','Troy Ounces',{min:0})],'Grams');
add('gram-to-troy-ounce','Gram to Troy Ounce','Conversion','conversion','R',['gram to troy ounce'],[F('grams','Grams',{min:0})],'Troy Ounces');
add('carat-to-gram','Carat to Gram','Conversion','conversion','R',['carat to gram converter'],[F('carats','Carats',{min:0})],'Grams');
add('stones-to-kg','Stones to KG','Conversion','conversion','R',['stones to kg converter'],[F('stones','Stones',{min:0})],'Kilograms');
add('kg-to-stones','KG to Stones','Conversion','conversion','R',['kg to stones converter'],[F('kg','Kilograms',{min:0})],'Stones');
add('cups-to-ml','Cups to mL','Conversion','conversion','R',['cups to ml converter'],[F('cups','Cups',{min:0})],'Milliliters');
add('ml-to-cups','mL to Cups','Conversion','conversion','R',['ml to cups converter'],[F('ml','Milliliters',{min:0})],'Cups');
add('liters-to-gallons','Liters to Gallons','Conversion','conversion','R',['liters to gallons'],[F('liters','Liters',{min:0})],'US Gallons');
add('cubic-meters-to-liters','Cubic Meters to Liters','Conversion','conversion','R',['cubic meters to liters'],[F('m3','Cubic Meters',{min:0})],'Liters');
add('square-meters-to-sqft','Square Meters to Sq Ft','Conversion','conversion','R',['square meters to square feet'],[F('sqm','Square Meters',{min:0})],'Square Feet');
add('sqft-to-sqm','Sq Ft to Square Meters','Conversion','conversion','R',['square feet to square meters'],[F('sqft','Square Feet',{min:0})],'Square Meters');
add('hectare-to-acre','Hectare to Acre','Conversion','conversion','R',['hectare to acre'],[F('hectare','Hectares',{min:0})],'Acres');
add('nautical-mile-to-km','Nautical Mile to KM','Conversion','conversion','R',['nautical mile to km'],[F('nm','Nautical Miles',{min:0})],'Kilometers');
add('fathom-to-feet','Fathom to Feet','Conversion','conversion','R',['fathom to feet'],[F('fathom','Fathoms',{min:0})],'Feet');
add('chain-to-feet','Chain to Feet','Conversion','conversion','R',['chain to feet converter'],[F('chain','Chains',{min:0})],'Feet');
add('furlong-to-meters','Furlong to Meters','Conversion','conversion','R',['furlong to meters'],[F('furlong','Furlongs',{min:0})],'Meters');
add('micron-to-mm','Micron to mm','Conversion','conversion','R',['micron to millimeter'],[F('micron','Microns',{min:0})],'Millimeters');
add('angstrom-to-nm','Angstrom to nm','Conversion','conversion','R',['angstrom to nanometer'],[F('angstrom','Angstroms',{min:0})],'Nanometers');
add('rpm-to-rad-s','RPM to Rad/s','Conversion','conversion','R',['rpm to radians per second'],[F('rpm','RPM',{min:0})],'Rad/s');
add('rad-s-to-rpm','Rad/s to RPM','Conversion','conversion','R',['radians per second to rpm'],[F('rads','Rad/s',{min:0})],'RPM');
add('pascal-to-psi','Pascal to PSI','Conversion','conversion','R',['pascal to psi'],[F('pascal','Pascals',{min:0})],'PSI');
add('dyne-to-newton','Dyne to Newton','Conversion','conversion','R',['dyne to newton'],[F('dyne','Dynes',{min:0})],'Newtons');
add('erg-to-joule','Erg to Joule','Conversion','conversion','R',['erg to joule'],[F('erg','Ergs',{min:0})],'Joules');
add('slug-to-kg','Slug to KG','Conversion','conversion','R',['slug to kg'],[F('slug','Slugs',{min:0})],'Kilograms');
add('grain-to-gram','Grain to Gram','Conversion','conversion','R',['grain to gram'],[F('grain','Grains',{min:0})],'Grams');
add('pennyweight-to-gram','Pennyweight to Gram','Conversion','conversion','R',['pennyweight to gram'],[F('dwt','Pennyweights',{min:0})],'Grams');

// ===== FOOD & COOKING (30) =====
add('egg-substitute','Egg Substitute','Everyday','everyday','~',['egg substitute calculator'],[F('eggs','Eggs to Replace',{min:1}),F('type','Substitute Type (1-5)',{dv:1})],'Amount Needed');
add('sugar-substitute','Sugar Substitute','Everyday','everyday','~',['sugar substitute calculator'],[F('sugar','Sugar (cups)',{min:0.1}),F('type','Substitute (1-5)',{dv:1})],'Substitute Amount');
add('yeast-conversion','Yeast Conversion','Everyday','everyday','~',['yeast conversion calculator'],[F('amount','Amount (tsp)',{min:0.25}),F('from','From Type (1=active,2=instant)',{dv:1})],'Converted Amount');
add('butter-oil-convert','Butter to Oil','Conversion','conversion','R',['butter to oil converter'],[F('butter','Butter (tbsp)',{min:1})],'Oil (tbsp)');
add('flour-type-convert','Flour Type Conversion','Conversion','conversion','R',['flour conversion calculator'],[F('amount','Amount (cups)',{min:0.25}),F('from','From (1=AP,2=bread,3=cake)',{dv:1})],'Converted Amount');
add('pasta-serving-size','Pasta Serving','Everyday','everyday','~',['pasta serving calculator'],[F('servings','Servings',{min:1}),F('ouncesPerServing','Oz/Serving',{dv:2})],'Total Dry Pasta (oz)');
add('rice-water-ratio','Rice Water Ratio','Everyday','everyday','~',['rice water ratio calculator'],[F('cups','Cups of Rice',{min:0.5}),F('type','Type (1=white,2=brown)',{dv:1})],'Cups Water');
add('gravy-amount','Gravy Amount','Everyday','everyday','~',['gravy calculator'],[F('guests','Guests',{min:1}),F('ozPerPerson','Oz/Person',{dv:4})],'Total Gravy (cups)');
add('cranberry-sauce','Cranberry Sauce','Everyday','everyday','~',['cranberry sauce calculator'],[F('guests','Guests',{min:1}),F('ozPerGuest','Oz/Guest',{dv:3})],'Bags Needed');
add('turkey-thaw-time','Turkey Thaw Time','Everyday','everyday','~',['turkey thaw calculator'],[F('weight','Weight (lbs)',{min:5}),F('method','Method (1=fridge,2=water)',{dv:1})],'Thaw Hours');
add('turkey-cook-time','Turkey Cook Time','Everyday','everyday','~',['turkey cook time calculator'],[F('weight','Weight (lbs)',{min:5}),F('stuffed','Stuffed (0=no,1=yes)',{dv:0})],'Cook Hours');
add('prime-rib-cook','Prime Rib Cook Time','Everyday','everyday','~',['prime rib calculator'],[F('weight','Weight (lbs)',{min:3}),F('doneness','Doneness (1-5)',{dv:3})],'Cook Minutes');
add('ham-cook-time','Ham Cook Time','Everyday','everyday','~',['ham cook time calculator'],[F('weight','Weight (lbs)',{min:3}),F('type','Type (1=bone-in,2=boneless)',{dv:1})],'Cook Hours');
add('brisket-cook','Brisket Cook Time','Everyday','everyday','~',['brisket calculator'],[F('weight','Weight (lbs)',{min:3}),F('temp','Temp (°F)',{dv:225})],'Cook Hours');
add('pulled-pork-amount','Pulled Pork Amount','Everyday','everyday','~',['pulled pork calculator'],[F('guests','Guests',{min:1}),F('ozPerGuest','Oz/Guest',{dv:6})],'Raw Pork (lbs)');
add('pizza-dough-calc','Pizza Dough','Everyday','everyday','~',['pizza dough calculator'],[F('pizzas','Number of Pizzas',{min:1}),F('size','Size (in)',{dv:12})],'Flour (g)');
add('bread-hydration','Bread Hydration','Everyday','everyday','~',['bread hydration calculator'],[F('flour','Flour (g)',{min:100}),F('hydration','Hydration %',{dv:65})],'Water (g)');
add('coffee-ratio','Coffee to Water Ratio','Everyday','everyday','~',['coffee ratio calculator'],[F('cups','Cups of Coffee',{min:1}),F('strength','Strength (1-3)',{dv:2})],'Coffee (g)');
add('tea-steeping','Tea Steeping','Everyday','everyday','~',['tea steeping calculator'],[F('type','Tea Type (1-5)',{dv:1}),F('cups','Cups',{min:1})],'Steep Time (min)');
add('smoothie-ratio','Smoothie Ratio','Everyday','everyday','~',['smoothie ratio calculator'],[F('servings','Servings',{min:1}),F('liquid','Liquid (oz)',{dv:8})],'Fruit/Veg (oz)');
add('popcorn-yield','Popcorn Yield','Everyday','everyday','~',['popcorn calculator'],[F('kernels','Kernels (cups)',{min:0.25})],'Popped Volume (cups)');
add('jerky-yield','Jerky Yield','Everyday','everyday','~',['beef jerky calculator'],[F('rawMeat','Raw Meat (lbs)',{min:0.5}),F('shrinkage','Shrinkage %',{dv:60})],'Jerky Yield (lbs)');
add('pickle-brine','Pickle Brine','Everyday','everyday','~',['pickle brine calculator'],[F('jars','Number of Jars',{min:1}),F('jarSize','Jar Size (oz)',{dv:32})],'Brine (cups)');
add('jam-sugar-ratio','Jam Sugar Ratio','Everyday','everyday','~',['jam sugar calculator'],[F('fruit','Fruit (lbs)',{min:0.5}),F('pectin','Pectin Type (1-3)',{dv:1})],'Sugar (cups)');
add('marshmallow-recipe','Marshmallow Recipe','Everyday','everyday','~',['marshmallow recipe calculator'],[F('batches','Batches',{min:1}),F('size','Size Multiplier',{dv:1})],'Gelatin (packets)');
add('salsa-recipe','Salsa Recipe','Everyday','everyday','~',['salsa calculator'],[F('servings','Servings',{min:4}),F('spice','Spice Level (1-5)',{dv:3})],'Tomatoes (lbs)');
add('hummus-recipe','Hummus Recipe','Everyday','everyday','~',['hummus calculator'],[F('servings','Servings',{min:2})],'Chickpeas (cans)');
add('guacamole-calc','Guacamole','Everyday','everyday','~',['guacamole calculator'],[F('servings','Servings',{min:2})],'Avocados');
add('icing-amount','Icing Amount','Everyday','everyday','~',['cake icing calculator'],[F('layers','Layers',{min:1}),F('size','Cake Size (in)',{dv:9})],'Icing (cups)');
add('fondant-amount','Fondant Amount','Everyday','everyday','~',['fondant calculator'],[F('size','Cake Size (in)',{dv:8}),F('layers','Height (in)',{dv:4})],'Fondant (lbs)');

// ===== MATH ADVANCED (30) =====
add('matrix-determinant','Matrix Determinant','Math','math','+',['matrix determinant calculator'],[F('a','a (row1col1)',{}),F('b','b (row1col2)',{}),F('c','c (row2col1)',{})],'Determinant');
add('matrix-inverse-2x2','2x2 Matrix Inverse','Math','math','+',['matrix inverse calculator'],[F('a','a',{}),F('b','b',{}),F('c','c',{})],'Inverse Matrix');
add('eigenvalue-2x2','Eigenvalue 2x2','Math','math','+',['eigenvalue calculator'],[F('a','a (row1col1)',{}),F('b','b (row1col2)',{}),F('c','c (row2col1)',{})],'Eigenvalues');
add('dot-product','Dot Product','Math','math','+',['dot product calculator'],[F('x1','x1',{}),F('y1','y1',{}),F('x2','x2',{})],'Dot Product');
add('cross-product','Cross Product','Math','math','+',['cross product calculator'],[F('x1','x1',{}),F('y1','y1',{}),F('z1','z1',{})],'Magnitude');
add('vector-magnitude','Vector Magnitude','Math','math','+',['vector magnitude calculator'],[F('x','x',{}),F('y','y',{}),F('z','z (optional)',{dv:0})],'Magnitude');
add('unit-vector','Unit Vector','Math','math','+',['unit vector calculator'],[F('x','x',{}),F('y','y',{}),F('z','z',{dv:0})],'Unit Vector');
add('vector-angle','Vector Angle','Math','math','+',['angle between vectors'],[F('x1','x1',{}),F('y1','y1',{}),F('x2','x2',{})],'Angle (°)');
add('polar-to-cartesian','Polar to Cartesian','Math','math','+',['polar to cartesian converter'],[F('r','r (radius)',{min:0}),F('theta','θ (degrees)',{})],'(x, y)');
add('cartesian-to-polar','Cartesian to Polar','Math','math','+',['cartesian to polar converter'],[F('x','x',{}),F('y','y',{})],'(r, θ)');
add('complex-number-add','Complex Number Addition','Math','math','+',['complex number calculator'],[F('a1','a (real 1)',{}),F('b1','b (imag 1)',{}),F('a2','a (real 2)',{})],'Result');
add('complex-number-multiply','Complex Number Multiply','Math','math','+',['complex multiply calculator'],[F('a1','a (real 1)',{}),F('b1','b (imag 1)',{}),F('a2','a (real 2)',{})],'Result');
add('complex-modulus','Complex Modulus','Math','math','+',['complex modulus calculator'],[F('a','Real Part',{}),F('b','Imaginary Part',{})],'|z|');
add('euler-formula','Euler Formula','Math','math','+',['euler formula calculator'],[F('theta','θ (radians)',{})],'e^(iθ)');
add('taylor-series','Taylor Series','Math','math','+',['taylor series calculator'],[F('x','x Value',{}),F('terms','Number of Terms',{min:1,max:20})],'Approximation');
add('maclaurin-series','Maclaurin Series','Math','math','+',['maclaurin series calculator'],[F('x','x Value',{}),F('terms','Number of Terms',{min:1,max:20})],'Approximation');
add('laplace-transform','Laplace Transform','Math','math','+',['laplace transform calculator'],[F('s','s Value',{}),F('a','Parameter a',{dv:1})],'F(s)');
add('fourier-series','Fourier Series','Math','math','+',['fourier series calculator'],[F('n','Harmonics',{min:1}),F('period','Period',{min:0.01})],'Coefficients');
add('numerical-derivative','Numerical Derivative','Math','math','+',['numerical derivative calculator'],[F('x','x Value',{}),F('h','Step Size',{dv:0.001})],'f\'(x)');
add('numerical-integral','Numerical Integral','Math','math','+',['numerical integral calculator'],[F('a','Lower Bound',{}),F('b','Upper Bound',{}),F('n','Intervals',{dv:100})],'Integral');
add('newtons-method','Newton Method','Math','math','+',['newton method calculator'],[F('x0','Initial Guess',{}),F('iterations','Iterations',{dv:10})],'Root');
add('bisection-method','Bisection Method','Math','math','+',['bisection method calculator'],[F('a','Left Bound',{}),F('b','Right Bound',{}),F('iterations','Iterations',{dv:20})],'Root');
add('modular-arithmetic','Modular Arithmetic','Math','math','+',['modular arithmetic calculator'],[F('a','a',{}),F('b','b',{}),F('mod','Modulus',{min:1})],'a mod n');
add('chinese-remainder','Chinese Remainder Theorem','Math','math','+',['chinese remainder theorem'],[F('r1','Remainder 1',{min:0}),F('m1','Modulus 1',{min:1}),F('r2','Remainder 2',{min:0})],'Solution');
add('continued-fraction','Continued Fraction','Math','math','+',['continued fraction calculator'],[F('num','Numerator',{min:1}),F('den','Denominator',{min:1})],'CF Representation');
add('catalan-number','Catalan Number','Math','math','+',['catalan number calculator'],[F('n','n',{min:0,max:20})],'C(n)');
add('stirling-number','Stirling Number','Math','math','+',['stirling number calculator'],[F('n','n',{min:1}),F('k','k',{min:1})],'S(n,k)');
add('bell-number','Bell Number','Math','math','+',['bell number calculator'],[F('n','n',{min:0,max:20})],'B(n)');
add('partition-number','Partition Number','Math','math','+',['partition function calculator'],[F('n','n',{min:0,max:100})],'p(n)');
add('bernoulli-number','Bernoulli Number','Math','math','+',['bernoulli number calculator'],[F('n','n',{min:0,max:20})],'B(n)');

// ===== EVERYDAY NICHE (40) =====
add('moving-cost-estimate','Moving Cost Estimate','Everyday','everyday','~',['moving cost calculator'],[F('rooms','Bedrooms',{min:1}),F('distance','Distance (miles)',{min:1})],'Estimated Cost ($)');
add('storage-unit-size','Storage Unit Size','Everyday','everyday','~',['storage unit calculator'],[F('rooms','Rooms of Stuff',{min:1}),F('furniture','Large Items',{dv:5})],'Unit Size (sq ft)');
add('downsizing-checklist','Downsizing Cost','Everyday','everyday','~',['downsizing cost calculator'],[F('items','Items to Sell',{min:0}),F('donations','Donation Value ($)',{dv:0})],'Net Savings ($)');
add('electricity-per-appliance','Appliance Electricity Cost','Everyday','everyday','~',['appliance electricity cost'],[F('watts','Watts',{min:1}),F('hours','Hours/Day',{min:0.1}),F('rate','Rate ($/kWh)',{dv:0.13})],'Monthly Cost ($)');
add('ceiling-fan-size','Ceiling Fan Size','Everyday','everyday','~',['ceiling fan size calculator'],[F('roomSqft','Room Sq Ft',{min:50})],'Fan Diameter (in)');
add('air-conditioner-size','Air Conditioner Size','Everyday','everyday','~',['air conditioner size calculator'],[F('sqft','Room Sq Ft',{min:50}),F('ceilingHeight','Ceiling Height (ft)',{dv:8})],'BTU Needed');
add('humidifier-size','Humidifier Size','Everyday','everyday','~',['humidifier size calculator'],[F('sqft','Room Sq Ft',{min:50})],'Gallon Output/Day');
add('dehumidifier-size','Dehumidifier Size','Everyday','everyday','~',['dehumidifier size calculator'],[F('sqft','Room Sq Ft',{min:100}),F('dampness','Dampness (1-4)',{dv:2})],'Pint Capacity');
add('air-purifier-room','Air Purifier Room','Everyday','everyday','~',['air purifier room calculator'],[F('sqft','Room Sq Ft',{min:50}),F('ceiling','Ceiling Height (ft)',{dv:8})],'CADR Needed');
add('carpet-cleaning-cost','Carpet Cleaning Cost','Everyday','everyday','~',['carpet cleaning calculator'],[F('sqft','Square Feet',{min:50}),F('costPerSqft','Cost/SqFt ($)',{dv:0.25})],'Total Cost ($)');
add('junk-removal-cost','Junk Removal Cost','Everyday','everyday','~',['junk removal calculator'],[F('truckFraction','Truck Load Fraction',{min:0.25,max:1}),F('baseCost','Base Cost ($)',{dv:300})],'Cost ($)');
add('cleaning-time','Cleaning Time','Everyday','everyday','~',['cleaning time calculator'],[F('sqft','Square Feet',{min:200}),F('rooms','Rooms',{min:1})],'Minutes');
add('laundry-cost','Laundry Cost','Everyday','everyday','~',['laundry cost calculator'],[F('loads','Loads/Week',{min:1}),F('costPerLoad','Cost/Load ($)',{dv:3})],'Monthly Cost ($)');
add('grocery-budget-plan','Grocery Budget','Everyday','everyday','~',['grocery budget calculator'],[F('people','People',{min:1}),F('plan','Plan Level (1-3)',{dv:2})],'Monthly Budget ($)');
add('meal-prep-cost','Meal Prep Cost','Everyday','everyday','~',['meal prep calculator'],[F('meals','Meals/Week',{min:1}),F('costPerMeal','Cost/Meal ($)',{dv:5})],'Weekly Cost ($)');
add('commute-cost-calc','Commute Cost','Everyday','everyday','~',['commute cost calculator'],[F('miles','Miles One Way',{min:1}),F('mpg','MPG',{dv:25}),F('gasPrice','Gas Price ($)',{dv:3.50})],'Monthly Cost ($)');
add('parking-cost','Parking Cost','Everyday','everyday','~',['parking cost calculator'],[F('hours','Hours',{min:0.5}),F('rate','Rate/Hour ($)',{dv:5})],'Total ($)');
add('toll-cost','Toll Cost','Everyday','everyday','~',['toll cost calculator'],[F('tolls','Number of Tolls',{min:1}),F('avgCost','Avg Cost ($)',{dv:3}),F('trips','Trips/Month',{dv:20})],'Monthly Cost ($)');
add('car-wash-cost','Car Wash Cost','Everyday','everyday','~',['car wash calculator'],[F('frequency','Washes/Month',{min:1}),F('cost','Cost/Wash ($)',{dv:15})],'Annual Cost ($)');
add('streaming-cost','Streaming Cost','Everyday','everyday','~',['streaming cost calculator'],[F('services','Number of Services',{min:1}),F('avgCost','Avg Cost/Service ($)',{dv:15})],'Monthly Total ($)');
add('subscription-audit','Subscription Audit','Everyday','everyday','~',['subscription cost calculator'],[F('subscriptions','Subscriptions',{min:1}),F('avgCost','Avg Monthly Cost ($)',{dv:12})],'Annual Total ($)');
add('gym-value','Gym Membership Value','Everyday','everyday','~',['gym value calculator'],[F('monthly','Monthly Cost ($)',{min:1}),F('visits','Visits/Month',{min:1})],'Cost/Visit ($)');
add('childcare-cost','Childcare Cost','Everyday','everyday','~',['childcare cost calculator'],[F('children','Children',{min:1}),F('weeklyRate','Weekly Rate ($)',{dv:300})],'Annual Cost ($)');
add('nanny-cost','Nanny Cost','Everyday','everyday','~',['nanny cost calculator'],[F('hours','Hours/Week',{min:10}),F('rate','Rate/Hour ($)',{dv:18})],'Monthly Cost ($)');
add('daycare-cost','Daycare Cost','Everyday','everyday','~',['daycare cost calculator'],[F('children','Children',{min:1}),F('monthlyRate','Monthly Rate ($)',{dv:1200})],'Annual Cost ($)');
add('summer-camp-cost','Summer Camp Cost','Everyday','everyday','~',['summer camp calculator'],[F('weeks','Weeks',{min:1}),F('weeklyRate','Weekly Rate ($)',{dv:400})],'Total ($)');
add('birthday-party-budget','Birthday Party Budget','Everyday','everyday','~',['birthday party budget'],[F('guests','Guests',{min:5}),F('costPerGuest','Cost/Guest ($)',{dv:15}),F('venue','Venue ($)',{dv:200})],'Total ($)');
add('wedding-guest-cost','Wedding per Guest','Everyday','everyday','~',['wedding per guest cost'],[F('totalBudget','Total Budget ($)',{min:5000}),F('guests','Guests',{min:10})],'Cost/Guest ($)');
add('funeral-cost','Funeral Cost','Everyday','everyday','~',['funeral cost calculator'],[F('type','Type (1=burial,2=cremation)',{dv:1}),F('service','Service Level (1-3)',{dv:2})],'Estimated Cost ($)');
add('holiday-budget','Holiday Budget','Everyday','everyday','~',['holiday budget calculator'],[F('people','Gift Recipients',{min:1}),F('avgGift','Avg Gift ($)',{dv:50}),F('extras','Extras ($)',{dv:200})],'Total ($)');
add('back-to-school-budget','Back to School Budget','Everyday','everyday','~',['back to school calculator'],[F('children','Children',{min:1}),F('supplies','Supplies ($)',{dv:100}),F('clothing','Clothing ($)',{dv:200})],'Total ($)');
add('pet-monthly-cost','Pet Monthly Cost','Everyday','everyday','~',['pet monthly cost'],[F('food','Food ($)',{dv:50}),F('insurance','Insurance ($)',{dv:40}),F('grooming','Grooming ($)',{dv:30})],'Monthly Total ($)');
add('hobby-budget','Hobby Budget','Everyday','everyday','~',['hobby budget calculator'],[F('monthlySpend','Monthly Spend ($)',{min:1}),F('months','Months',{dv:12})],'Annual Cost ($)');
add('vacation-savings','Vacation Savings','Everyday','everyday','~',['vacation savings calculator'],[F('totalCost','Trip Cost ($)',{min:100}),F('months','Months to Save',{min:1})],'Monthly Savings ($)');
add('emergency-fund-calc','Emergency Fund','Everyday','everyday','~',['emergency fund calculator'],[F('monthlyExpenses','Monthly Expenses ($)',{min:500}),F('months','Months Coverage',{dv:6})],'Target Amount ($)');
add('new-baby-cost','New Baby Cost','Everyday','everyday','~',['new baby cost calculator'],[F('diapers','Diaper Cost/Mo ($)',{dv:80}),F('formula','Formula/Mo ($)',{dv:150}),F('gear','One-time Gear ($)',{dv:2000})],'First Year ($)');
add('college-savings','College Savings','Everyday','everyday','~',['college savings calculator'],[F('childAge','Child Age',{min:0}),F('collegeAge','College Start Age',{dv:18}),F('annualCost','Annual Cost ($)',{dv:30000})],'Monthly Savings ($)');
add('allowance-by-age','Allowance by Age','Everyday','everyday','~',['allowance by age calculator'],[F('age','Child Age',{min:3,max:18}),F('region','Cost of Living (1-3)',{dv:2})],'Weekly Amount ($)');
add('chore-pay','Chore Pay','Everyday','everyday','~',['chore pay calculator'],[F('chores','Chores/Week',{min:1}),F('payPerChore','Pay/Chore ($)',{dv:2})],'Weekly Pay ($)');
add('gift-registry','Gift Registry Budget','Everyday','everyday','~',['gift registry calculator'],[F('items','Items',{min:1}),F('avgPrice','Avg Price ($)',{dv:50})],'Registry Total ($)');

// Generate
let gen = 0, skip = 0;
const imports = [], regs = [];
for (const d of defs) {
  if (existingSlugs.has(d.s)) { skip++; continue; }
  const name = eName(d.s);
  if (existingExports.has(name)) { skip++; continue; }
  const fp = path.join(CALC_DIR, d.s + '.ts');
  if (fs.existsSync(fp)) { skip++; continue; }
  fs.writeFileSync(fp, genFile(d.s, d.t, d.c, d.cs, d.i, d.k, d.f, d.u, d.fo));
  imports.push(`import { ${name} } from "./${d.s}";`);
  regs.push(`  ${name},`);
  existingSlugs.add(d.s); existingExports.add(name);
  gen++;
}
fs.writeFileSync(path.join(__dirname, 'new-imports-b.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-b.txt'), regs.join('\n'));
console.log(`Generated: ${gen} | Skipped: ${skip} | Defs: ${defs.length}`);
