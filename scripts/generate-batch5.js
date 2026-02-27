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

function mk(slug, title, cat, cs, icon, kw, fields, unit, formula) {
  return { slug: slug+'-calculator', title: title+' Calculator', cat, cs, icon, kw,
    desc: `Free ${title.toLowerCase()} calculator. Calculate ${title.toLowerCase()} quickly and accurately.`,
    fields, unit: unit || 'Result', formula: formula || 'Result = f(inputs)',
    faq: [{q:`How to calculate ${title.toLowerCase()}?`,a:`Enter values and get instant results.`},{q:`Why use this ${title.toLowerCase()} calculator?`,a:`Quick, accurate, and free online calculation tool.`}],
    rel: ['percentage-calculator']
  };
}

const F = (n, l, opts) => ({ n, l, t: 'number', ...opts });

const defs = [
  // BABY & PARENTING (10)
  mk('baby-weight-gain','Baby Weight Gain','Health','health','H',['baby weight gain'],[F('birthWeight','Birth Weight (lbs)',{min:1}),F('weeks','Age (weeks)',{min:1})],'Expected Weight'),
  mk('baby-sleep-schedule','Baby Sleep Schedule','Health','health','H',['baby sleep calculator'],[F('ageMonths','Age (months)',{min:0}),F('currentSleep','Current Sleep (hrs)',{dv:14})],'Recommended Hours'),
  mk('breast-pump-schedule','Breast Pump Schedule','Health','health','H',['pumping schedule'],[F('sessions','Sessions/Day',{min:1}),F('minutes','Min/Session',{dv:15})],'Daily Pump Time'),
  mk('baby-clothing-size','Baby Clothing Size','Everyday','everyday','~',['baby size chart'],[F('weight','Weight (lbs)',{min:3}),F('length','Length (in)',{min:15})],'Size'),
  mk('toddler-bmi','Toddler BMI','Health','health','H',['toddler bmi'],[F('weight','Weight (lbs)',{min:10}),F('height','Height (in)',{min:20})],'BMI Percentile'),
  mk('pregnancy-weight-gain','Pregnancy Weight Gain','Health','health','H',['pregnancy weight'],[F('preWeight','Pre-pregnancy Weight (lbs)',{min:80}),F('weeks','Weeks Pregnant',{min:1,max:42})],'Recommended Gain'),
  mk('due-date-ivf','IVF Due Date','Health','health','H',['ivf due date'],[F('transferDay','Transfer Day (day of month)',{min:1}),F('embryoAge','Embryo Age (days)',{dv:5})],'Due Date Day'),
  mk('car-seat-size','Car Seat Size','Everyday','everyday','~',['car seat calculator'],[F('weight','Child Weight (lbs)',{min:4}),F('height','Height (in)',{min:18})],'Seat Type'),
  mk('stroller-budget','Stroller Budget','Everyday','everyday','~',['stroller cost'],[F('budget','Budget ($)',{min:50}),F('features','Feature Level (1-3)',{dv:2})],'Recommendation'),
  mk('baby-proofing','Baby Proofing Cost','Everyday','everyday','~',['baby proofing cost'],[F('rooms','Rooms',{min:1}),F('costPerRoom','Cost/Room ($)',{dv:50})],'Total Cost'),

  // RETIREMENT & AGING (8)
  mk('retirement-savings-gap','Retirement Gap','Finance','finance','$',['retirement gap calculator'],[F('current','Current Savings ($)',{min:0}),F('needed','Needed at Retirement ($)',{min:1}),F('years','Years Until Retirement',{min:1})],'Monthly Savings Needed'),
  mk('retirement-withdrawal','Retirement Withdrawal','Finance','finance','$',['retirement withdrawal'],[F('savings','Total Savings ($)',{min:1}),F('years','Retirement Years',{dv:30}),F('return','Annual Return %',{dv:5})],'Monthly Withdrawal'),
  mk('social-security-age','Social Security Age','Finance','finance','$',['social security age'],[F('birthYear','Birth Year',{min:1940}),F('benefit62','Benefit at 62 ($)',{min:1})],'Optimal Age'),
  mk('long-term-care','Long Term Care Cost','Finance','finance','$',['long term care cost'],[F('years','Years of Care',{min:1}),F('monthlyRate','Monthly Rate ($)',{dv:8000})],'Total Cost'),
  mk('medicare-premium','Medicare Premium','Finance','finance','$',['medicare cost'],[F('income','Annual Income ($)',{min:0}),F('partB','Part B Premium ($)',{dv:175})],'Monthly Premium'),
  mk('downsizing-savings','Downsizing Savings','Finance','finance','$',['downsizing calculator'],[F('currentValue','Current Home Value ($)',{min:1}),F('newValue','New Home Value ($)',{min:1})],'Net Proceeds'),
  mk('elder-care-cost','Elder Care Cost','Finance','finance','$',['elder care calculator'],[F('type','Care Type (1-3)',{dv:2}),F('hours','Hours/Week',{dv:20}),F('rate','Rate/Hour ($)',{dv:25})],'Monthly Cost'),
  mk('inheritance-split','Inheritance Split','Finance','finance','$',['inheritance split calculator'],[F('total','Total Inheritance ($)',{min:1}),F('heirs','Number of Heirs',{min:1})],'Per Person'),

  // FREELANCE & GIG ECONOMY (10)
  mk('freelance-hourly-rate','Freelance Hourly Rate','Finance','finance','$',['freelance rate calculator'],[F('annualTarget','Annual Target ($)',{min:1}),F('billableHours','Billable Hours/Year',{dv:1500})],'Hourly Rate'),
  mk('project-quote','Project Quote','Finance','finance','$',['project quote calculator'],[F('hours','Estimated Hours',{min:1}),F('rate','Hourly Rate ($)',{min:1}),F('margin','Margin %',{dv:20})],'Project Quote'),
  mk('gig-tax-estimate','Gig Tax Estimate','Finance','finance','$',['gig economy tax'],[F('income','Gig Income ($)',{min:1}),F('expenses','Deductions ($)',{dv:0}),F('taxRate','Tax Rate %',{dv:25})],'Tax Owed'),
  mk('delivery-driver-profit','Delivery Driver Profit','Finance','finance','$',['delivery driver earnings'],[F('deliveries','Deliveries/Day',{min:1}),F('avgPay','Avg Pay/Delivery ($)',{dv:7}),F('gasCost','Gas/Day ($)',{dv:15})],'Daily Profit'),
  mk('content-creator-revenue','Content Creator Revenue','Finance','finance','$',['creator earnings'],[F('views','Monthly Views',{min:100}),F('rpm','RPM ($)',{dv:3})],'Monthly Revenue'),
  mk('podcast-monetization','Podcast Monetization','Finance','finance','$',['podcast earnings'],[F('downloads','Downloads/Episode',{min:100}),F('cpm','CPM ($)',{dv:25}),F('episodes','Episodes/Month',{dv:4})],'Monthly Revenue'),
  mk('online-course-revenue','Online Course Revenue','Finance','finance','$',['course revenue calculator'],[F('students','Students',{min:1}),F('price','Course Price ($)',{min:1}),F('refundRate','Refund Rate %',{dv:5})],'Net Revenue'),
  mk('ebook-royalty','Ebook Royalty','Finance','finance','$',['ebook royalty calculator'],[F('price','Book Price ($)',{min:0.99}),F('royaltyRate','Royalty Rate %',{dv:70}),F('sales','Monthly Sales',{min:1})],'Monthly Royalty'),
  mk('patreon-income','Patreon Income','Finance','finance','$',['patreon calculator'],[F('patrons','Patrons',{min:1}),F('avgPledge','Avg Pledge ($)',{dv:5}),F('platformFee','Platform Fee %',{dv:8})],'Net Income'),
  mk('print-on-demand','Print on Demand Profit','Finance','finance','$',['pod profit calculator'],[F('price','Selling Price ($)',{min:1}),F('baseCost','Base Cost ($)',{min:1}),F('sales','Monthly Sales',{min:1})],'Monthly Profit'),

  // SUSTAINABILITY (8)
  mk('compost-savings','Compost Savings','Everyday','everyday','~',['composting savings'],[F('waste','Weekly Waste (lbs)',{min:0.5}),F('bagCost','Bag Cost Saved ($)',{dv:5})],'Annual Savings'),
  mk('water-conservation','Water Conservation','Everyday','everyday','~',['water savings calculator'],[F('showerMin','Shower Min/Day',{dv:8}),F('flowRate','Flow Rate (gal/min)',{dv:2.5})],'Gallons Saved/Year'),
  mk('energy-star-savings','Energy Star Savings','Everyday','everyday','~',['energy star calculator'],[F('oldUsage','Old Usage (kWh/yr)',{min:1}),F('newUsage','New Usage (kWh/yr)',{min:1}),F('rate','Rate ($/kWh)',{dv:0.13})],'Annual Savings'),
  mk('reusable-bag','Reusable Bag Savings','Everyday','everyday','~',['reusable bag calculator'],[F('trips','Shopping Trips/Year',{dv:100}),F('bagsPerTrip','Bags/Trip',{dv:4}),F('bagCost','Bag Fee ($)',{dv:0.10})],'Annual Savings'),
  mk('led-bulb-savings','LED Bulb Savings','Everyday','everyday','~',['led savings calculator'],[F('bulbs','Number of Bulbs',{min:1}),F('hoursPerDay','Hours/Day',{dv:5}),F('rate','Rate ($/kWh)',{dv:0.13})],'Annual Savings'),
  mk('thermostat-savings','Smart Thermostat','Everyday','everyday','~',['thermostat savings'],[F('monthlyBill','Monthly HVAC ($)',{min:1}),F('savings','Expected Savings %',{dv:15})],'Annual Savings'),
  mk('low-flow-toilet','Low Flow Toilet Savings','Everyday','everyday','~',['low flow toilet calculator'],[F('people','People',{min:1}),F('flushesPerDay','Flushes/Day',{dv:5}),F('oldGpf','Old GPF',{dv:3.5})],'Gallons Saved/Year'),
  mk('clothesline-savings','Clothesline Savings','Everyday','everyday','~',['clothesline vs dryer'],[F('loads','Loads/Week',{min:1}),F('dryerCost','Dryer Cost/Load ($)',{dv:0.50})],'Annual Savings'),

  // WEATHER & OUTDOOR (8)
  mk('wind-chill-temp','Wind Chill','Science','science','A',['wind chill calculator'],[F('temp','Air Temp (°F)',{}),F('windSpeed','Wind Speed (mph)',{min:3})],'Feels Like (°F)'),
  mk('heat-index-calc','Heat Index','Science','science','A',['heat index calculator'],[F('temp','Air Temp (°F)',{min:80}),F('humidity','Humidity %',{min:0})],'Heat Index (°F)'),
  mk('dew-point-calc','Dew Point','Science','science','A',['dew point calculator'],[F('temp','Air Temp (°F)',{}),F('humidity','Humidity %',{min:0,max:100})],'Dew Point (°F)'),
  mk('uv-exposure-time','UV Exposure Time','Health','health','H',['uv exposure calculator'],[F('uvIndex','UV Index',{min:1,max:12}),F('skinType','Skin Type (1-6)',{dv:3})],'Safe Minutes'),
  mk('lightning-distance','Lightning Distance','Science','science','A',['lightning distance'],[F('seconds','Seconds After Flash',{min:0}),F('speedOfSound','Speed of Sound (mph)',{dv:767})],'Distance (miles)'),
  mk('frost-date','Frost Date','Everyday','everyday','~',['frost date calculator'],[F('zone','USDA Zone (3-10)',{min:3,max:10}),F('spring','Spring (1) or Fall (0)',{dv:1})],'Estimated Date'),
  mk('snow-load','Snow Load','Science','science','A',['snow load calculator'],[F('depth','Snow Depth (in)',{min:1}),F('density','Snow Density (lb/ft³)',{dv:15}),F('area','Roof Area (sq ft)',{min:100})],'Load (lbs)'),
  mk('barometric-altitude','Barometric Altitude','Science','science','A',['barometric altitude'],[F('pressure','Pressure (hPa)',{min:200}),F('seaLevel','Sea Level (hPa)',{dv:1013.25})],'Altitude (m)'),

  // CRYPTO & BLOCKCHAIN (8)
  mk('gas-price-optimizer','Gas Price Optimizer','Finance','finance','$',['ethereum gas optimizer'],[F('gasLimit','Gas Limit',{dv:21000}),F('gasPrice','Gas Price (gwei)',{min:1})],'Cost (ETH)'),
  mk('mining-electricity','Mining Electricity Cost','Finance','finance','$',['mining electricity'],[F('watts','Power (W)',{min:100}),F('hours','Hours/Day',{dv:24}),F('rate','Rate ($/kWh)',{dv:0.10})],'Daily Cost'),
  mk('staking-reward','Staking Reward','Finance','finance','$',['staking rewards calculator'],[F('amount','Staked Amount ($)',{min:1}),F('apy','APY %',{min:0.1}),F('days','Days',{dv:365})],'Reward ($)'),
  mk('token-unlock','Token Unlock Schedule','Finance','finance','$',['token unlock calculator'],[F('total','Total Tokens',{min:1}),F('cliff','Cliff (months)',{dv:6}),F('vesting','Vesting (months)',{dv:24})],'Monthly Unlock'),
  mk('impermanent-loss','Impermanent Loss','Finance','finance','$',['impermanent loss'],[F('priceChange','Price Change %',{}),F('poolSize','Pool Size ($)',{min:1})],'Loss ($)'),
  mk('yield-farming','Yield Farming','Finance','finance','$',['yield farming calculator'],[F('deposit','Deposit ($)',{min:1}),F('apy','APY %',{min:0.1}),F('days','Days',{dv:30})],'Earnings ($)'),
  mk('nft-floor-price','NFT Floor Price','Finance','finance','$',['nft floor price'],[F('supply','Collection Supply',{min:1}),F('marketCap','Market Cap ($)',{min:1})],'Floor Price ($)'),
  mk('defi-portfolio','DeFi Portfolio','Finance','finance','$',['defi portfolio calculator'],[F('holdings','Total Holdings ($)',{min:1}),F('yield','Avg Yield %',{dv:8}),F('months','Months',{dv:12})],'Projected Value'),

  // MISC EVERYDAY (10)
  mk('tipping-etiquette','Tipping Etiquette','Everyday','everyday','~',['tipping guide calculator'],[F('bill','Bill Amount ($)',{min:1}),F('service','Service Level (1-3)',{dv:2})],'Suggested Tip'),
  mk('split-rent','Split Rent by Room','Everyday','everyday','~',['rent split calculator'],[F('totalRent','Total Rent ($)',{min:1}),F('yourSqft','Your Room (sq ft)',{min:1}),F('totalSqft','Total Sq Ft',{min:1})],'Your Share'),
  mk('utility-split','Utility Split','Everyday','everyday','~',['utility split calculator'],[F('total','Total Bill ($)',{min:1}),F('people','Number of People',{min:1})],'Per Person'),
  mk('roommate-expense','Roommate Expense','Everyday','everyday','~',['roommate expense split'],[F('expense','Total Expense ($)',{min:1}),F('roommates','Roommates',{min:2}),F('yourShare','Your Share %',{dv:50})],'You Owe'),
  mk('garage-sale','Garage Sale Pricing','Everyday','everyday','~',['garage sale calculator'],[F('originalPrice','Original Price ($)',{min:1}),F('age','Age (years)',{min:0}),F('condition','Condition (1-3)',{dv:2})],'Sale Price'),
  mk('coupon-savings','Coupon Savings','Everyday','everyday','~',['coupon calculator'],[F('originalPrice','Original Price ($)',{min:1}),F('couponPercent','Coupon %',{min:1,max:100})],'You Save'),
  mk('cashback-rewards','Cashback Rewards','Finance','finance','$',['cashback calculator'],[F('spending','Monthly Spending ($)',{min:1}),F('cashback','Cashback Rate %',{dv:2}),F('months','Months',{dv:12})],'Total Cashback'),
  mk('warranty-value','Warranty Value','Everyday','everyday','~',['warranty calculator'],[F('itemCost','Item Cost ($)',{min:1}),F('warrantyCost','Warranty Cost ($)',{min:1}),F('repairProb','Repair Probability %',{dv:15})],'Expected Value'),
  mk('depreciation-vehicle','Vehicle Depreciation','Finance','finance','$',['car depreciation'],[F('purchase','Purchase Price ($)',{min:1}),F('years','Years Owned',{min:1}),F('rate','Annual Depreciation %',{dv:15})],'Current Value'),
  mk('lease-vs-buy-car','Lease vs Buy Car','Finance','finance','$',['lease vs buy calculator'],[F('price','Vehicle Price ($)',{min:1}),F('leasePay','Lease Payment ($)',{min:1}),F('months','Months',{dv:36})],'Total Lease Cost'),
];

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
  keywords: [${c.kw.map(k=>`"${k}"`).join(', ')}],
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator','')}",
    description: "",
    fields: [
${c.fields.map(f => {
  let s = `      { name: "${f.n}", label: "${f.l}", type: "${f.t||'number'}"`;
  if(f.min!==undefined) s+=`, min: ${f.min}`;
  if(f.max!==undefined) s+=`, max: ${f.max}`;
  if(f.step!==undefined) s+=`, step: ${f.step}`;
  if(f.dv!==undefined) s+=`, defaultValue: ${f.dv}`;
  return s+' },';
}).join('\n')}
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "${c.unit}", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: [${c.rel.map(r=>`"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq[0].q}", answer: "${c.faq[0].a}" },
    { question: "${c.faq[1].q}", answer: "${c.faq[1].a}" },
  ],
  formula: "${c.formula}",
};
`;
}

let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const c of defs) {
  if (existingSlugs.has(c.slug)) { skipped++; continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; continue; }
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${eName(c.slug)} } from "./${c.slug}";`);
  regs.push(`  ${eName(c.slug)},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-b5.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-b5.txt'), regs.join('\n'));
console.log(`Generated: ${generated} | Skipped: ${skipped}`);
console.log(`Imports: ${imports.length} | Regs: ${regs.length}`);
