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

// ===== NURSING & CLINICAL (20) =====
add('glasgow-coma-calc','Glasgow Coma Scale','Health','health','H',['glasgow coma scale calculator'],[F('eye','Eye Response (1-4)',{min:1,max:4}),F('verbal','Verbal Response (1-5)',{min:1,max:5}),F('motor','Motor Response (1-6)',{min:1,max:6})],'GCS Score');
add('pain-scale-assessment','Pain Scale Assessment','Health','health','H',['pain scale calculator'],[F('pain','Pain Level (0-10)',{min:0,max:10}),F('interference','Activity Interference (0-10)',{dv:5})],'Pain Category');
add('fall-risk-morse','Fall Risk Morse','Health','health','H',['morse fall scale calculator'],[F('fallHistory','Fall History (0-25)',{min:0,max:25}),F('diagnosis','Secondary Diagnosis (0-15)',{min:0,max:15}),F('ambulatory','Ambulatory Aid (0-30)',{min:0,max:30})],'Risk Score');
add('braden-scale','Braden Scale','Health','health','H',['braden scale calculator','pressure ulcer'],[F('sensory','Sensory (1-4)',{min:1,max:4}),F('moisture','Moisture (1-4)',{min:1,max:4}),F('activity','Activity (1-4)',{min:1,max:4})],'Braden Score');
add('news2-score','NEWS2 Score','Health','health','H',['news2 calculator','early warning'],[F('respRate','Resp Rate',{min:1}),F('spo2','SpO2 %',{min:50}),F('systolic','Systolic BP',{min:40})],'NEWS2 Score');
add('fluid-balance','Fluid Balance','Health','health','H',['fluid balance calculator'],[F('intake','Total Intake (mL)',{min:0}),F('output','Total Output (mL)',{min:0})],'Balance (mL)');
add('urine-output-calc','Urine Output','Health','health','H',['urine output calculator'],[F('volume','Volume (mL)',{min:0}),F('hours','Hours',{min:0.5}),F('weight','Weight (kg)',{min:1})],'mL/kg/hr');
add('tube-feeding-rate','Tube Feeding Rate','Health','health','H',['tube feeding calculator'],[F('calories','Calorie Goal',{min:500}),F('formula','Formula Cal/mL',{dv:1.5})],'Rate (mL/hr)');
add('bmi-pediatric','Pediatric BMI','Health','health','H',['pediatric bmi calculator'],[F('weight','Weight (kg)',{min:2}),F('height','Height (cm)',{min:40}),F('age','Age (years)',{min:2})],'BMI Percentile');
add('gestational-diabetes-risk','Gestational Diabetes Risk','Health','health','H',['gestational diabetes calculator'],[F('age','Age',{min:18}),F('bmi','Pre-pregnancy BMI',{min:15}),F('familyHistory','Family History (0-1)',{dv:0})],'Risk Score');
add('pediatric-dose-weight','Pediatric Dose by Weight','Health','health','H',['pediatric dose calculator'],[F('weight','Weight (kg)',{min:1}),F('dosePerKg','Dose/kg (mg)',{min:0.01})],'Dose (mg)');
add('nutritional-screening','Nutritional Screening','Health','health','H',['malnutrition screening calculator'],[F('bmi','BMI',{min:10}),F('weightLoss','Unintended Weight Loss % (3mo)',{dv:0}),F('appetite','Reduced Appetite (0-2)',{dv:0})],'Risk Score');
add('wound-measurement','Wound Measurement','Health','health','H',['wound measurement calculator'],[F('length','Length (cm)',{min:0.1}),F('width','Width (cm)',{min:0.1}),F('depth','Depth (cm)',{dv:0})],'Area (cm²)');
add('blood-transfusion-vol','Blood Transfusion Volume','Health','health','H',['blood transfusion calculator'],[F('weight','Weight (kg)',{min:1}),F('desiredHb','Desired Hb (g/dL)',{min:1}),F('currentHb','Current Hb (g/dL)',{min:1})],'Volume (mL)');
add('dosage-by-bsa','Dosage by BSA','Health','health','H',['bsa dosage calculator'],[F('height','Height (cm)',{min:50}),F('weight','Weight (kg)',{min:1})],'BSA (m²)');
add('corrected-qtc','Corrected QTc','Health','health','H',['qtc calculator'],[F('qt','QT Interval (ms)',{min:100}),F('rr','RR Interval (ms)',{min:200})],'QTc (ms)','QTc = QT / √(RR/1000)');
add('blood-alcohol-calc','Blood Alcohol Content','Health','health','H',['bac calculator detailed'],[F('drinks','Standard Drinks',{min:0.5}),F('weight','Weight (lbs)',{min:80}),F('hours','Hours Drinking',{min:0.5})],'BAC %');
add('caffeine-half-life','Caffeine Half Life','Health','health','H',['caffeine half life calculator'],[F('amount','Caffeine (mg)',{min:10}),F('hours','Hours',{min:0})],'Remaining (mg)');
add('water-intake-calc','Water Intake','Health','health','H',['water intake calculator detailed'],[F('weight','Weight (lbs)',{min:50}),F('exercise','Exercise Min/Day',{dv:30})],'Oz/Day');
add('sleep-cycle-calc','Sleep Cycle','Health','health','H',['sleep cycle calculator'],[F('bedtime','Bedtime (24hr)',{dv:23}),F('cycles','Desired Cycles',{dv:5})],'Wake Time');

// ===== ENGINEERING (25) =====
add('beam-deflection','Beam Deflection','Science','science','A',['beam deflection calculator'],[F('load','Load (N)',{min:1}),F('length','Length (m)',{min:0.1}),F('ei','EI (N·m²)',{min:1})],'Max Deflection (mm)');
add('column-buckling','Column Buckling','Science','science','A',['euler buckling calculator'],[F('e','E (Pa)',{dv:200e9}),F('i','I (m⁴)',{min:1e-10}),F('length','Length (m)',{min:0.1})],'Critical Load (N)','Pcr = π²EI/L²');
add('weld-strength','Weld Strength','Science','science','A',['weld strength calculator'],[F('throat','Throat Size (mm)',{min:1}),F('length','Weld Length (mm)',{min:1}),F('allowable','Allowable Stress (MPa)',{dv:124})],'Capacity (kN)');
add('bolt-torque-calc','Bolt Torque','Science','science','A',['bolt torque calculator'],[F('diameter','Bolt Diameter (mm)',{min:3}),F('clampForce','Clamp Force (N)',{min:100}),F('friction','Friction Coeff',{dv:0.2})],'Torque (N·m)');
add('bearing-life','Bearing Life','Science','science','A',['bearing life calculator'],[F('c','Dynamic Rating (kN)',{min:0.1}),F('p','Load (kN)',{min:0.1}),F('rpm','RPM',{min:1})],'Life (hours)','L10 = (C/P)^3 × 10^6 / (60×RPM)');
add('heat-exchanger','Heat Exchanger','Science','science','A',['heat exchanger calculator'],[F('flow','Flow Rate (kg/s)',{min:0.01}),F('cp','Specific Heat (J/kg·K)',{dv:4186}),F('deltaT','ΔT (°C)',{min:0.1})],'Heat Transfer (W)');
add('pump-power','Pump Power','Science','science','A',['pump power calculator'],[F('flow','Flow Rate (m³/s)',{min:0.001}),F('head','Head (m)',{min:0.1}),F('density','Density (kg/m³)',{dv:1000})],'Power (W)');
add('pipe-flow-velocity','Pipe Flow Velocity','Science','science','A',['pipe flow calculator'],[F('flow','Flow Rate (m³/s)',{min:0.001}),F('diameter','Pipe Diameter (m)',{min:0.01})],'Velocity (m/s)');
add('orifice-flow','Orifice Flow','Science','science','A',['orifice plate calculator'],[F('cd','Discharge Coeff',{dv:0.62}),F('area','Orifice Area (m²)',{min:0.0001}),F('dp','Pressure Drop (Pa)',{min:0})],'Flow Rate (m³/s)');
add('fan-law','Fan Law','Science','science','A',['fan law calculator'],[F('rpm1','RPM 1',{min:1}),F('rpm2','RPM 2',{min:1}),F('cfm1','CFM 1',{min:1})],'CFM 2');
add('compressor-power','Compressor Power','Science','science','A',['compressor power calculator'],[F('flow','Flow Rate (cfm)',{min:1}),F('pressureRatio','Pressure Ratio',{min:1})],'Power (HP)');
add('thermal-conductivity','Thermal Conductivity','Science','science','A',['thermal conductivity calculator'],[F('power','Power (W)',{min:0.01}),F('thickness','Thickness (m)',{min:0.001}),F('area','Area (m²)',{min:0.001})],'k (W/m·K)');
add('thermal-resistance','Thermal Resistance','Science','science','A',['thermal resistance calculator'],[F('thickness','Thickness (m)',{min:0.001}),F('conductivity','k (W/m·K)',{min:0.01}),F('area','Area (m²)',{min:0.001})],'R (K/W)');
add('radiation-heat','Radiation Heat Transfer','Science','science','A',['radiation heat calculator','stefan boltzmann'],[F('emissivity','Emissivity',{dv:0.9}),F('area','Area (m²)',{min:0.001}),F('temp','Temperature (K)',{min:1})],'Power (W)');
add('convection-heat','Convection Heat Transfer','Science','science','A',['convection calculator'],[F('h','h (W/m²·K)',{min:0.1}),F('area','Area (m²)',{min:0.001}),F('deltaT','ΔT (°C)',{min:0.1})],'Heat (W)','Q = hAΔT');
add('nusselt-number','Nusselt Number','Science','science','A',['nusselt number calculator'],[F('h','h (W/m²·K)',{min:0.1}),F('length','Length (m)',{min:0.001}),F('k','k (W/m·K)',{min:0.01})],'Nu','Nu = hL/k');
add('prandtl-number','Prandtl Number','Science','science','A',['prandtl number calculator'],[F('cp','Cp (J/kg·K)',{dv:4186}),F('mu','Dynamic Viscosity (Pa·s)',{dv:0.001}),F('k','k (W/m·K)',{dv:0.6})],'Pr','Pr = μCp/k');
add('grashof-number','Grashof Number','Science','science','A',['grashof number calculator'],[F('beta','β (1/K)',{dv:0.003}),F('deltaT','ΔT (°C)',{min:0.1}),F('length','Length (m)',{min:0.01})],'Gr');
add('rayleigh-number','Rayleigh Number','Science','science','A',['rayleigh number calculator'],[F('grashof','Grashof Number',{min:1}),F('prandtl','Prandtl Number',{dv:0.71})],'Ra','Ra = Gr × Pr');
add('weber-number','Weber Number','Science','science','A',['weber number calculator'],[F('density','Density (kg/m³)',{dv:1000}),F('velocity','Velocity (m/s)',{min:0.01}),F('length','Length (m)',{min:0.001})],'We');
add('strouhal-number','Strouhal Number','Science','science','A',['strouhal number calculator'],[F('frequency','Frequency (Hz)',{min:0.01}),F('length','Length (m)',{min:0.001}),F('velocity','Velocity (m/s)',{min:0.01})],'St');
add('euler-number-flow','Euler Number','Science','science','A',['euler number fluid calculator'],[F('dp','Pressure Drop (Pa)',{min:0}),F('density','Density (kg/m³)',{dv:1000}),F('velocity','Velocity (m/s)',{min:0.01})],'Eu');
add('cavitation-number','Cavitation Number','Science','science','A',['cavitation number calculator'],[F('pressure','Reference Pressure (Pa)',{min:1}),F('vapor','Vapor Pressure (Pa)',{min:0}),F('velocity','Velocity (m/s)',{min:0.01})],'σ');
add('stress-strain-curve','Stress-Strain','Science','science','A',['stress strain calculator'],[F('force','Force (N)',{min:0}),F('area','Area (m²)',{min:0.0001}),F('origLength','Original Length (m)',{min:0.001})],'Stress (Pa)');
add('fatigue-life','Fatigue Life','Science','science','A',['fatigue life calculator','s-n curve'],[F('stressAmp','Stress Amplitude (MPa)',{min:1}),F('fatigueStr','Fatigue Strength (MPa)',{dv:200}),F('exponent','Exponent',{dv:3})],'Cycles to Failure');

// ===== DIGITAL & TECH (25) =====
add('bandwidth-calc','Bandwidth','Everyday','everyday','~',['bandwidth calculator'],[F('fileSize','File Size (MB)',{min:0.1}),F('speed','Speed (Mbps)',{min:0.1})],'Download Time (s)');
add('data-transfer-time','Data Transfer Time','Everyday','everyday','~',['data transfer time calculator'],[F('size','Size (GB)',{min:0.01}),F('speed','Speed (Mbps)',{min:0.1})],'Transfer Time');
add('video-file-size','Video File Size','Everyday','everyday','~',['video file size calculator'],[F('duration','Duration (min)',{min:1}),F('bitrate','Bitrate (Mbps)',{dv:5})],'File Size (MB)');
add('audio-file-size','Audio File Size','Everyday','everyday','~',['audio file size calculator'],[F('duration','Duration (min)',{min:1}),F('bitrate','Bitrate (kbps)',{dv:320})],'File Size (MB)');
add('image-resolution','Image Resolution','Everyday','everyday','~',['image resolution calculator'],[F('width','Width (px)',{min:1}),F('height','Height (px)',{min:1}),F('dpi','DPI',{dv:300})],'Print Size (in)');
add('screen-ppi','Screen PPI','Everyday','everyday','~',['screen ppi calculator'],[F('width','Width (px)',{min:100}),F('height','Height (px)',{min:100}),F('diagonal','Diagonal (in)',{min:1})],'PPI');
add('aspect-ratio','Aspect Ratio','Everyday','everyday','~',['aspect ratio calculator'],[F('width','Width',{min:1}),F('height','Height',{min:1})],'Aspect Ratio');
add('color-hex-to-rgb','Hex to RGB','Conversion','conversion','R',['hex to rgb converter'],[F('red','Red (0-255)',{min:0,max:255}),F('green','Green (0-255)',{min:0,max:255}),F('blue','Blue (0-255)',{min:0,max:255})],'Hex Code');
add('subnet-hosts','Subnet Hosts','Everyday','everyday','~',['subnet calculator hosts'],[F('prefix','CIDR Prefix',{min:1,max:30})],'Usable Hosts','Hosts = 2^(32-prefix) - 2');
add('raid-capacity','RAID Capacity','Everyday','everyday','~',['raid calculator'],[F('disks','Number of Disks',{min:2}),F('diskSize','Disk Size (TB)',{min:0.1}),F('raidLevel','RAID Level (0-6)',{dv:5})],'Usable TB');
add('server-uptime','Server Uptime','Everyday','everyday','~',['uptime calculator'],[F('nines','Nines (1-6)',{min:1,max:6})],'Downtime/Year (min)');
add('api-rate-limit','API Rate Limit','Everyday','everyday','~',['api rate limit calculator'],[F('requests','Requests/Month',{min:1}),F('limit','Rate Limit/Min',{min:1})],'% Limit Used');
add('cloud-storage-cost','Cloud Storage Cost','Everyday','everyday','~',['cloud storage calculator'],[F('storage','Storage (GB)',{min:1}),F('costPerGB','Cost/GB ($)',{dv:0.023})],'Monthly Cost ($)');
add('cloud-compute-cost','Cloud Compute Cost','Everyday','everyday','~',['cloud compute calculator'],[F('instances','Instances',{min:1}),F('costPerHr','Cost/Hr ($)',{dv:0.05}),F('hours','Hours/Month',{dv:720})],'Monthly Cost ($)');
add('dns-propagation-time','DNS Propagation','Everyday','everyday','~',['dns propagation calculator'],[F('ttl','TTL (seconds)',{dv:3600}),F('hops','Estimated Hops',{dv:5})],'Max Propagation (hrs)');
add('password-entropy','Password Entropy','Everyday','everyday','~',['password strength calculator'],[F('length','Length',{min:1}),F('charsetSize','Character Set Size',{dv:95})],'Entropy (bits)','H = L × log2(N)');
add('hash-rate-profit','Hash Rate Profit','Finance','finance','$',['hash rate calculator'],[F('hashRate','Hash Rate (TH/s)',{min:0.01}),F('power','Power (W)',{min:100}),F('elecCost','Elec ($/kWh)',{dv:0.10})],'Daily Profit ($)');
add('nft-royalty','NFT Royalty','Finance','finance','$',['nft royalty calculator'],[F('salePrice','Sale Price ($)',{min:0.01}),F('royaltyPct','Royalty %',{dv:5}),F('volume','Monthly Sales',{min:1})],'Monthly Royalty ($)');
add('saas-mrr','SaaS MRR','Finance','finance','$',['mrr calculator'],[F('customers','Customers',{min:1}),F('arpu','ARPU ($)',{min:0.01})],'MRR ($)','MRR = Customers × ARPU');
add('saas-arr','SaaS ARR','Finance','finance','$',['arr calculator'],[F('mrr','MRR ($)',{min:1})],'ARR ($)','ARR = MRR × 12');
add('churn-rate-calc','Churn Rate','Finance','finance','$',['churn rate calculator detailed'],[F('lost','Lost Customers',{min:0}),F('startOfPeriod','Start of Period Customers',{min:1})],'Churn Rate %');
add('cohort-retention','Cohort Retention','Finance','finance','$',['cohort retention calculator'],[F('initial','Initial Users',{min:1}),F('remaining','Remaining Users',{min:0})],'Retention %');
add('ltv-cac-ratio','LTV:CAC Ratio','Finance','finance','$',['ltv cac ratio calculator'],[F('ltv','LTV ($)',{min:0.01}),F('cac','CAC ($)',{min:0.01})],'LTV:CAC Ratio');
add('email-roi','Email Marketing ROI','Finance','finance','$',['email roi calculator'],[F('revenue','Revenue ($)',{min:0}),F('cost','Cost ($)',{min:0.01})],'ROI %');
add('cpm-calc','CPM Calculator','Finance','finance','$',['cpm calculator advertising'],[F('cost','Total Cost ($)',{min:0.01}),F('impressions','Impressions',{min:1})],'CPM ($)','CPM = Cost/Impressions × 1000');

// ===== GEOMETRY & SHAPES (25) =====
add('ellipse-area','Ellipse Area','Math','math','+',['ellipse area calculator'],[F('a','Semi-Major Axis',{min:0.01}),F('b','Semi-Minor Axis',{min:0.01})],'Area','A = πab');
add('ellipse-perimeter','Ellipse Perimeter','Math','math','+',['ellipse perimeter calculator'],[F('a','Semi-Major Axis',{min:0.01}),F('b','Semi-Minor Axis',{min:0.01})],'Perimeter');
add('ellipsoid-volume','Ellipsoid Volume','Math','math','+',['ellipsoid volume calculator'],[F('a','Semi-Axis A',{min:0.01}),F('b','Semi-Axis B',{min:0.01}),F('c','Semi-Axis C',{min:0.01})],'Volume');
add('torus-volume','Torus Volume','Math','math','+',['torus volume calculator'],[F('R','Major Radius',{min:0.01}),F('r','Minor Radius',{min:0.01})],'Volume','V = 2π²Rr²');
add('torus-surface-area','Torus Surface Area','Math','math','+',['torus surface area'],[F('R','Major Radius',{min:0.01}),F('r','Minor Radius',{min:0.01})],'Surface Area');
add('frustum-volume','Frustum Volume','Math','math','+',['frustum volume calculator'],[F('r1','Top Radius',{min:0}),F('r2','Bottom Radius',{min:0.01}),F('h','Height',{min:0.01})],'Volume');
add('paraboloid-volume','Paraboloid Volume','Math','math','+',['paraboloid volume calculator'],[F('radius','Radius',{min:0.01}),F('height','Height',{min:0.01})],'Volume');
add('regular-polygon-area','Regular Polygon Area','Math','math','+',['regular polygon area calculator'],[F('sides','Number of Sides',{min:3}),F('sideLength','Side Length',{min:0.01})],'Area');
add('irregular-polygon','Irregular Polygon Area','Math','math','+',['irregular polygon area'],[F('base','Base',{min:0.01}),F('height','Height',{min:0.01})],'Area');
add('annulus-area','Annulus Area','Math','math','+',['annulus area calculator'],[F('R','Outer Radius',{min:0.01}),F('r','Inner Radius',{min:0})],'Area','A = π(R² - r²)');
add('sector-area','Sector Area','Math','math','+',['sector area calculator'],[F('radius','Radius',{min:0.01}),F('angle','Angle (°)',{min:0.01,max:360})],'Area');
add('segment-area','Segment Area','Math','math','+',['circle segment area'],[F('radius','Radius',{min:0.01}),F('angle','Central Angle (°)',{min:0.01,max:360})],'Area');
add('chord-length','Chord Length','Math','math','+',['chord length calculator'],[F('radius','Radius',{min:0.01}),F('angle','Central Angle (°)',{min:0.01,max:360})],'Chord Length');
add('arc-length-calc','Arc Length','Math','math','+',['arc length calculator'],[F('radius','Radius',{min:0.01}),F('angle','Angle (°)',{min:0.01})],'Arc Length');
add('herons-formula','Heron Formula','Math','math','+',['heron formula calculator'],[F('a','Side A',{min:0.01}),F('b','Side B',{min:0.01}),F('c','Side C',{min:0.01})],'Triangle Area');
add('law-of-cosines','Law of Cosines','Math','math','+',['law of cosines calculator'],[F('a','Side A',{min:0.01}),F('b','Side B',{min:0.01}),F('C','Angle C (°)',{min:0.01,max:179})],'Side C');
add('law-of-sines','Law of Sines','Math','math','+',['law of sines calculator'],[F('a','Side A',{min:0.01}),F('A','Angle A (°)',{min:0.01,max:179}),F('B','Angle B (°)',{min:0.01,max:179})],'Side B');
add('golden-ratio','Golden Ratio','Math','math','+',['golden ratio calculator'],[F('value','Value',{min:0.01}),F('direction','Multiply(1) or Divide(2)',{dv:1})],'Golden Partner');
add('fibonacci-calc','Fibonacci Number','Math','math','+',['fibonacci calculator'],[F('n','Position (n)',{min:1,max:70})],'F(n)');
add('pascal-triangle','Pascal Triangle','Math','math','+',['pascal triangle calculator'],[F('row','Row',{min:0,max:30}),F('col','Column',{min:0})],'Value','C(n,k)');
add('degrees-to-radians','Degrees to Radians','Conversion','conversion','R',['degrees to radians'],[F('degrees','Degrees',{})],'Radians','rad = deg × π/180');
add('radians-to-degrees','Radians to Degrees','Conversion','conversion','R',['radians to degrees'],[F('radians','Radians',{})],'Degrees');
add('gradians-to-degrees','Gradians to Degrees','Conversion','conversion','R',['gradians to degrees'],[F('gradians','Gradians',{min:0})],'Degrees');
add('spherical-coordinates','Spherical Coordinates','Math','math','+',['spherical coordinates calculator'],[F('r','r (radius)',{min:0}),F('theta','θ (polar °)',{min:0,max:180}),F('phi','φ (azimuthal °)',{min:0,max:360})],'(x, y, z)');
add('cylindrical-coordinates','Cylindrical Coordinates','Math','math','+',['cylindrical coordinates'],[F('r','r (radius)',{min:0}),F('theta','θ (°)',{min:0,max:360}),F('z','z',{})],'(x, y, z)');

// ===== MISCELLANEOUS HIGH-VALUE (55) =====
add('shipping-cost-calc','Shipping Cost','Everyday','everyday','~',['shipping cost calculator'],[F('weight','Weight (lbs)',{min:0.1}),F('length','Length (in)',{min:1}),F('distance','Distance (miles)',{min:1})],'Cost ($)');
add('customs-duty','Customs Duty','Finance','finance','$',['customs duty calculator'],[F('value','Item Value ($)',{min:0.01}),F('dutyRate','Duty Rate %',{dv:5})],'Duty ($)');
add('import-tax','Import Tax','Finance','finance','$',['import tax calculator'],[F('value','CIF Value ($)',{min:0.01}),F('dutyRate','Duty Rate %',{dv:5}),F('vatRate','VAT Rate %',{dv:0})],'Total Tax ($)');
add('currency-conversion','Currency Conversion','Finance','finance','$',['currency converter calculator'],[F('amount','Amount',{min:0.01}),F('rate','Exchange Rate',{min:0.001})],'Converted Amount');
add('tip-split','Tip Split','Everyday','everyday','~',['tip split calculator'],[F('bill','Bill ($)',{min:0.01}),F('tipPct','Tip %',{dv:18}),F('people','People',{min:1})],'Per Person ($)');
add('discount-percentage','Discount Percentage','Everyday','everyday','~',['discount percentage calculator'],[F('original','Original Price ($)',{min:0.01}),F('sale','Sale Price ($)',{min:0})],'Discount %');
add('price-per-unit-calc','Price Per Unit','Everyday','everyday','~',['price per unit calculator'],[F('price','Price ($)',{min:0.01}),F('quantity','Quantity',{min:0.01}),F('unit','Unit Size',{dv:1})],'Price/Unit ($)');
add('sales-tax-calc','Sales Tax','Finance','finance','$',['sales tax calculator simple'],[F('price','Price ($)',{min:0.01}),F('taxRate','Tax Rate %',{dv:8})],'Total ($)');
add('vat-calc','VAT Calculator','Finance','finance','$',['vat calculator'],[F('amount','Amount ($)',{min:0.01}),F('vatRate','VAT Rate %',{dv:20})],'Inc VAT ($)');
add('gst-calc','GST Calculator','Finance','finance','$',['gst calculator'],[F('amount','Amount ($)',{min:0.01}),F('gstRate','GST Rate %',{dv:10})],'Inc GST ($)');
add('property-stamp-duty','Stamp Duty','Finance','finance','$',['stamp duty calculator'],[F('price','Property Price ($)',{min:10000}),F('rate','Rate %',{dv:3})],'Stamp Duty ($)');
add('land-transfer-tax','Land Transfer Tax','Finance','finance','$',['land transfer tax calculator'],[F('price','Price ($)',{min:10000}),F('rate','Rate %',{dv:2})],'LTT ($)');
add('closing-cost-estimate','Closing Cost','Finance','finance','$',['closing cost calculator'],[F('homePrice','Home Price ($)',{min:50000}),F('percentage','Closing Cost %',{dv:3})],'Closing Costs ($)');
add('title-insurance-cost','Title Insurance','Finance','finance','$',['title insurance calculator'],[F('homePrice','Home Price ($)',{min:50000}),F('rate','Rate per $1000',{dv:5})],'Premium ($)');
add('home-inspection-cost','Home Inspection Cost','Everyday','everyday','~',['home inspection calculator'],[F('sqft','Square Feet',{min:500}),F('age','Home Age (years)',{dv:20})],'Cost ($)');
add('appraisal-cost','Appraisal Cost','Finance','finance','$',['appraisal cost calculator'],[F('homeValue','Home Value ($)',{min:50000}),F('complexity','Complexity (1-3)',{dv:1})],'Appraisal Fee ($)');
add('cell-phone-plan-cost','Cell Phone Plan Cost','Everyday','everyday','~',['cell phone plan calculator'],[F('lines','Lines',{min:1}),F('data','Data (GB)',{dv:10}),F('baseCost','Base Cost ($)',{dv:40})],'Monthly Total ($)');
add('internet-speed-needs','Internet Speed Needs','Everyday','everyday','~',['internet speed calculator'],[F('devices','Connected Devices',{min:1}),F('streaming','4K Streams',{dv:1}),F('gaming','Gaming Devices',{dv:0})],'Recommended Mbps');
add('electric-bill-estimate','Electric Bill Estimate','Everyday','everyday','~',['electric bill calculator'],[F('kwh','Monthly kWh',{min:100}),F('rate','Rate ($/kWh)',{dv:0.13})],'Monthly Bill ($)');
add('gas-bill-estimate','Gas Bill Estimate','Everyday','everyday','~',['gas bill calculator'],[F('therms','Monthly Therms',{min:1}),F('rate','Rate ($/Therm)',{dv:1.20})],'Monthly Bill ($)');
add('water-bill-estimate','Water Bill Estimate','Everyday','everyday','~',['water bill calculator'],[F('gallons','Monthly Gallons',{min:100}),F('rate','Rate ($/1000 gal)',{dv:5})],'Monthly Bill ($)');
add('lawn-mowing-cost','Lawn Mowing Cost','Everyday','everyday','~',['lawn mowing calculator'],[F('sqft','Lawn Sq Ft',{min:500}),F('frequency','Times/Month',{dv:4}),F('costPerMow','Cost/Mow ($)',{dv:40})],'Monthly ($)');
add('snow-removal-cost','Snow Removal Cost','Everyday','everyday','~',['snow removal calculator'],[F('driveway','Driveway Sq Ft',{min:100}),F('events','Snow Events/Year',{dv:15}),F('costPerEvent','Cost/Event ($)',{dv:50})],'Annual ($)');
add('tree-removal-cost','Tree Removal Cost','Everyday','everyday','~',['tree removal calculator'],[F('height','Tree Height (ft)',{min:10}),F('diameter','Trunk Diameter (in)',{min:4})],'Cost ($)');
add('gutter-cleaning-cost','Gutter Cleaning Cost','Everyday','everyday','~',['gutter cleaning calculator'],[F('linearFeet','Linear Feet',{min:50}),F('stories','Stories',{dv:1})],'Cost ($)');
add('pressure-washing-cost','Pressure Washing Cost','Everyday','everyday','~',['pressure washing calculator'],[F('sqft','Square Feet',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:0.30})],'Total ($)');
add('chimney-sweep-cost','Chimney Sweep Cost','Everyday','everyday','~',['chimney sweep calculator'],[F('chimneys','Chimneys',{min:1}),F('baseCost','Base Cost ($)',{dv:200}),F('condition','Condition (1-3)',{dv:1})],'Total ($)');
add('pest-control-cost','Pest Control Cost','Everyday','everyday','~',['pest control calculator'],[F('sqft','Home Sq Ft',{min:500}),F('treatment','Treatment Type (1-3)',{dv:1}),F('frequency','Visits/Year',{dv:4})],'Annual ($)');
add('home-warranty-cost','Home Warranty Cost','Everyday','everyday','~',['home warranty calculator'],[F('planType','Plan Type (1-3)',{dv:2}),F('serviceCall','Service Call ($)',{dv:75})],'Annual Cost ($)');
add('hoa-cost','HOA Cost Analysis','Finance','finance','$',['hoa cost calculator'],[F('monthly','Monthly HOA ($)',{min:1}),F('years','Years',{min:1})],'Total HOA Paid ($)');
add('umbrella-insurance','Umbrella Insurance Cost','Finance','finance','$',['umbrella insurance calculator'],[F('coverage','Coverage ($ millions)',{min:1}),F('basePremium','Base Premium ($)',{dv:200})],'Annual Premium ($)');
add('identity-theft-cost','Identity Theft Cost','Finance','finance','$',['identity theft calculator'],[F('accounts','Compromised Accounts',{min:1}),F('avgLoss','Avg Loss/Account ($)',{dv:500})],'Total Exposure ($)');
add('notary-cost','Notary Cost','Finance','finance','$',['notary cost calculator'],[F('documents','Documents',{min:1}),F('costPerDoc','Cost/Document ($)',{dv:15})],'Total ($)');
add('passport-renewal-cost','Passport Renewal Cost','Everyday','everyday','~',['passport renewal calculator'],[F('type','Type (1=book,2=card)',{dv:1}),F('expedited','Expedited (0-1)',{dv:0})],'Total Cost ($)');
add('visa-application-cost','Visa Application Cost','Everyday','everyday','~',['visa cost calculator'],[F('type','Visa Type (1-5)',{dv:1}),F('applicants','Applicants',{min:1})],'Total ($)');

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
fs.writeFileSync(path.join(__dirname, 'new-imports-c.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-c.txt'), regs.join('\n'));
console.log(`Generated: ${gen} | Skipped: ${skip} | Defs: ${defs.length}`);
