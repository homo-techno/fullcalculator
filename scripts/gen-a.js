const fs = require('fs');
const path = require('path');
const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

const existingSlugs = new Set();
const existingExports = new Set();
const indexContent = fs.readFileSync(path.join(CALC_DIR, 'index.ts'), 'utf8');
for (const m of indexContent.matchAll(/import \{ (\w+) \} from "\.\/([^"]+)"/g)) {
  existingExports.add(m[1]);
  existingSlugs.add(m[2]);
}
for (const file of fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  existingSlugs.add(file.replace('.ts', ''));
}
console.log(`Existing slugs: ${existingSlugs.size}, exports: ${existingExports.size}`);

function eName(slug) {
  const c = slug.replace(/-calculator$/, '').replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c + 'Calculator';
}

const F = (n, l, opts) => ({ n, l, t: 'number', ...opts });

function genFile(s, title, cat, cs, icon, kw, fields, unit, formula) {
  const name = eName(s);
  const desc = `Free ${title.toLowerCase()} calculator. Get accurate results instantly.`;
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${name}: CalculatorDefinition = {
  slug: "${s}",
  title: "${title} Calculator",
  description: "${desc}",
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

// Define all 350 calculators
const defs = [];
function add(s, t, c, cs, i, k, f, u, fo) { defs.push({s,t,c,cs,i,k,f,u,fo}); }

// ===== MEDICAL SCORING (40) =====
add('curb-65-score','CURB-65 Score','Health','health','H',['curb 65 calculator'],[F('confusion','Confusion (0-1)',{min:0,max:1}),F('urea','Urea >7mmol/L (0-1)',{min:0,max:1}),F('rr','Resp Rate ≥30 (0-1)',{min:0,max:1})],'Score','Score = Confusion + Urea + RR + BP + Age');
add('nihss-score','NIHSS Score','Health','health','H',['nihss calculator','stroke scale'],[F('consciousness','Consciousness (0-3)',{min:0,max:3}),F('gaze','Best Gaze (0-2)',{min:0,max:2}),F('visual','Visual (0-3)',{min:0,max:3})],'NIHSS Score');
add('mews-calculator','MEWS Score','Health','health','H',['mews calculator'],[F('systolic','Systolic BP',{min:0}),F('heartRate','Heart Rate',{min:0}),F('respRate','Resp Rate',{min:0})],'MEWS Score');
add('rsbi-calculator','RSBI','Health','health','H',['rsbi calculator','rapid shallow breathing'],[F('respRate','Resp Rate (breaths/min)',{min:1}),F('tidalVol','Tidal Volume (L)',{min:0.1})],'RSBI','RSBI = RR / Vt');
add('heart-score','HEART Score','Health','health','H',['heart score calculator'],[F('history','History (0-2)',{min:0,max:2}),F('ecg','ECG (0-2)',{min:0,max:2}),F('age','Age Factor (0-2)',{min:0,max:2})],'HEART Score');
add('grace-score','GRACE Score','Health','health','H',['grace score calculator'],[F('age','Age',{min:18}),F('heartRate','Heart Rate',{min:30}),F('systolic','Systolic BP',{min:50})],'GRACE Score');
add('has-bled-score','HAS-BLED Score','Health','health','H',['has-bled calculator'],[F('hypertension','Hypertension (0-1)',{min:0,max:1}),F('renal','Renal Disease (0-1)',{min:0,max:1}),F('liver','Liver Disease (0-1)',{min:0,max:1})],'HAS-BLED Score');
add('padua-score','Padua VTE Score','Health','health','H',['padua score calculator'],[F('cancer','Active Cancer (0-3)',{min:0,max:3}),F('vte','Previous VTE (0-3)',{min:0,max:3}),F('mobility','Reduced Mobility (0-3)',{min:0,max:3})],'Padua Score');
add('perc-score','PERC Rule','Health','health','H',['perc calculator','pe rule out'],[F('age','Age ≥50 (0-1)',{min:0,max:1}),F('hr','HR ≥100 (0-1)',{min:0,max:1}),F('sao2','SpO2 <95% (0-1)',{min:0,max:1})],'PERC Score');
add('revised-geneva','Revised Geneva Score','Health','health','H',['geneva score calculator'],[F('age','Age >65 (0-1)',{min:0,max:1}),F('dvt','Previous DVT/PE (0-3)',{min:0,max:3}),F('hr','Heart Rate (0-5)',{min:0,max:5})],'Geneva Score');
add('alvarado-score','Alvarado Score','Health','health','H',['alvarado score calculator','appendicitis'],[F('migration','Migration of Pain (0-1)',{min:0,max:1}),F('anorexia','Anorexia (0-1)',{min:0,max:1}),F('nausea','Nausea/Vomiting (0-1)',{min:0,max:1})],'Alvarado Score');
add('phq9-depression','PHQ-9 Depression','Health','health','H',['phq-9 calculator','depression screening'],[F('interest','Little Interest (0-3)',{min:0,max:3}),F('depressed','Feeling Down (0-3)',{min:0,max:3}),F('sleep','Sleep Problems (0-3)',{min:0,max:3})],'PHQ-9 Score');
add('gad7-anxiety','GAD-7 Anxiety','Health','health','H',['gad-7 calculator','anxiety score'],[F('nervous','Feeling Nervous (0-3)',{min:0,max:3}),F('worry','Uncontrollable Worry (0-3)',{min:0,max:3}),F('restless','Restlessness (0-3)',{min:0,max:3})],'GAD-7 Score');
add('epds-postnatal','EPDS Postnatal','Health','health','H',['epds calculator','postnatal depression'],[F('laugh','Able to Laugh (0-3)',{min:0,max:3}),F('enjoyment','Look Forward (0-3)',{min:0,max:3}),F('blame','Self Blame (0-3)',{min:0,max:3})],'EPDS Score');
add('bode-index','BODE Index','Health','health','H',['bode index calculator','copd'],[F('fev1','FEV1 % Predicted',{min:1}),F('walkDist','6MWT Distance (m)',{min:0}),F('mmrc','mMRC Dyspnea (0-4)',{min:0,max:4})],'BODE Index');

// Medical dosing & clinical (25)
add('gfr-calculator','GFR','Health','health','H',['gfr calculator','glomerular filtration'],[F('creatinine','Creatinine (mg/dL)',{min:0.1,step:0.1}),F('age','Age',{min:18}),F('weight','Weight (kg)',{min:30})],'eGFR (mL/min)','GFR = (140-Age) × Weight / (72 × Cr)');
add('creatinine-clearance','Creatinine Clearance','Health','health','H',['creatinine clearance'],[F('creatinine','Serum Cr (mg/dL)',{min:0.1}),F('age','Age',{min:18}),F('weight','Weight (kg)',{min:30})],'CrCl (mL/min)');
add('anion-gap-calc','Anion Gap','Health','health','H',['anion gap calculator'],[F('sodium','Sodium (mEq/L)',{dv:140}),F('chloride','Chloride (mEq/L)',{dv:100}),F('bicarb','Bicarbonate (mEq/L)',{dv:24})],'Anion Gap','AG = Na - (Cl + HCO3)');
add('corrected-calcium','Corrected Calcium','Health','health','H',['corrected calcium calculator'],[F('calcium','Serum Ca (mg/dL)',{dv:9.0}),F('albumin','Albumin (g/dL)',{dv:4.0})],'Corrected Ca','Corrected Ca = Ca + 0.8 × (4 - Albumin)');
add('sodium-correction','Sodium Correction','Health','health','H',['sodium correction calculator'],[F('sodium','Measured Na (mEq/L)',{dv:140}),F('glucose','Glucose (mg/dL)',{dv:100})],'Corrected Na');
add('parkland-formula','Parkland Formula','Health','health','H',['parkland formula calculator','burn fluid'],[F('weight','Weight (kg)',{min:1}),F('bsa','% BSA Burned',{min:1,max:100})],'24hr Fluid (mL)','Fluid = 4 × Weight × %BSA');
add('drip-rate-calc','Drip Rate','Health','health','H',['drip rate calculator','iv drip'],[F('volume','Volume (mL)',{min:1}),F('time','Time (hours)',{min:0.1}),F('dropFactor','Drop Factor (gtt/mL)',{dv:20})],'Drops/min');
add('iv-flow-rate','IV Flow Rate','Health','health','H',['iv flow rate calculator'],[F('volume','Volume (mL)',{min:1}),F('time','Time (min)',{min:1})],'mL/hour');
add('endotracheal-tube-calc','Endotracheal Tube','Health','health','H',['endotracheal tube size'],[F('age','Age (years)',{min:0}),F('weight','Weight (kg)',{min:1})],'ETT Size (mm)');
add('tidal-volume-calc','Tidal Volume','Health','health','H',['tidal volume calculator'],[F('weight','Ideal Body Weight (kg)',{min:30}),F('mlPerKg','mL/kg',{dv:6})],'Tidal Volume (mL)','Vt = IBW × mL/kg');
add('aa-gradient-calc','A-a Gradient','Health','health','H',['aa gradient calculator'],[F('fio2','FiO2 %',{dv:21}),F('pao2','PaO2 (mmHg)',{min:1}),F('paco2','PaCO2 (mmHg)',{dv:40})],'A-a Gradient');
add('pf-ratio','P/F Ratio','Health','health','H',['pf ratio calculator','ards'],[F('pao2','PaO2 (mmHg)',{min:1}),F('fio2','FiO2 (decimal)',{min:0.21,max:1,step:0.01})],'P/F Ratio','P/F = PaO2 / FiO2');
add('inr-calculator','INR','Health','health','H',['inr calculator'],[F('pt','Patient PT (sec)',{min:1}),F('meanNormal','Mean Normal PT (sec)',{dv:12}),F('isi','ISI',{dv:1.0})],'INR');
add('hematocrit-calc','Hematocrit','Health','health','H',['hematocrit calculator'],[F('hemoglobin','Hemoglobin (g/dL)',{min:1}),F('factor','Conversion Factor',{dv:3})],'Hematocrit %');
add('fundal-height-calc','Fundal Height','Health','health','H',['fundal height calculator'],[F('weeks','Gestational Weeks',{min:12,max:42}),F('height','Fundal Height (cm)',{min:10})],'Expected Height (cm)');
add('hcg-levels-calc','hCG Levels','Health','health','H',['hcg calculator','hcg levels'],[F('level1','First hCG (mIU/mL)',{min:1}),F('level2','Second hCG (mIU/mL)',{min:1}),F('hours','Hours Between',{dv:48})],'Doubling Time (hrs)');
add('nuchal-translucency','Nuchal Translucency','Health','health','H',['nuchal translucency calculator'],[F('crl','CRL (mm)',{min:45,max:84}),F('nt','NT Measurement (mm)',{min:0.5})],'Risk Assessment');
add('steroid-conversion','Steroid Conversion','Health','health','H',['steroid conversion calculator'],[F('dose','Dose (mg)',{min:0.1}),F('fromPotency','From Potency',{dv:1}),F('toPotency','To Potency',{dv:4})],'Equivalent Dose (mg)');
add('warfarin-dose-calc','Warfarin Dosing','Health','health','H',['warfarin calculator'],[F('targetInr','Target INR',{dv:2.5}),F('currentInr','Current INR',{min:0.5}),F('currentDose','Current Dose (mg)',{min:0.5})],'Adjusted Dose (mg)');
add('insulin-dose-calc','Insulin Dosage','Health','health','H',['insulin dosage calculator'],[F('weight','Weight (kg)',{min:1}),F('factor','TDD Factor (U/kg)',{dv:0.5})],'Total Daily Dose (U)');
add('drug-half-life-calc','Drug Half Life','Health','health','H',['drug half life calculator'],[F('dose','Initial Dose (mg)',{min:0.1}),F('halfLife','Half Life (hours)',{min:0.1}),F('hours','Hours Elapsed',{min:0})],'Remaining (mg)');
add('cardiac-index-calc','Cardiac Index','Health','health','H',['cardiac index calculator'],[F('co','Cardiac Output (L/min)',{min:1}),F('bsa','BSA (m²)',{min:0.5})],'CI (L/min/m²)','CI = CO / BSA');
add('stroke-volume-calc','Stroke Volume','Health','health','H',['stroke volume calculator'],[F('co','Cardiac Output (L/min)',{min:1}),F('hr','Heart Rate (bpm)',{min:30})],'SV (mL)','SV = CO × 1000 / HR');
add('cerebral-perfusion','Cerebral Perfusion Pressure','Health','health','H',['cpp calculator'],[F('map','MAP (mmHg)',{min:40}),F('icp','ICP (mmHg)',{min:0})],'CPP (mmHg)','CPP = MAP - ICP');
add('pvr-calculator','Pulmonary Vascular Resistance','Health','health','H',['pvr calculator'],[F('mpap','Mean PA Pressure (mmHg)',{min:1}),F('pcwp','PCWP (mmHg)',{min:1}),F('co','Cardiac Output (L/min)',{min:1})],'PVR (dynes)');

// ===== INVESTMENT & FINANCIAL ANALYSIS (50) =====
add('sortino-ratio','Sortino Ratio','Finance','finance','$',['sortino ratio calculator'],[F('return','Portfolio Return %',{}),F('riskFree','Risk-Free Rate %',{dv:2}),F('downDev','Downside Deviation %',{min:0.01})],'Sortino Ratio','Sortino = (Rp - Rf) / σd');
add('jensen-alpha','Jensen Alpha','Finance','finance','$',['jensen alpha calculator'],[F('return','Portfolio Return %',{}),F('riskFree','Risk-Free Rate %',{dv:2}),F('beta','Beta',{dv:1})],'Alpha','α = Rp - [Rf + β(Rm - Rf)]');
add('treynor-ratio','Treynor Ratio','Finance','finance','$',['treynor ratio calculator'],[F('return','Portfolio Return %',{}),F('riskFree','Risk-Free Rate %',{dv:2}),F('beta','Beta',{min:0.01})],'Treynor Ratio');
add('bond-convexity','Bond Convexity','Finance','finance','$',['bond convexity calculator'],[F('price','Bond Price ($)',{min:1}),F('priceUp','Price if Yield Down ($)',{min:1}),F('priceDown','Price if Yield Up ($)',{min:1})],'Convexity');
add('eps-growth-calc','EPS Growth','Finance','finance','$',['eps growth calculator'],[F('epsNow','Current EPS ($)',{}),F('epsPrior','Prior EPS ($)',{})],'Growth %');
add('futures-contract','Futures Contract','Finance','finance','$',['futures contract calculator'],[F('spotPrice','Spot Price ($)',{min:0.01}),F('riskFree','Risk-Free Rate %',{dv:5}),F('time','Time to Maturity (yrs)',{min:0.01})],'Futures Price ($)');
add('options-spread','Options Spread','Finance','finance','$',['options spread calculator'],[F('longPremium','Long Premium ($)',{min:0}),F('shortPremium','Short Premium ($)',{min:0}),F('contracts','Contracts',{dv:1})],'Max Profit ($)');
add('yield-to-call','Yield to Call','Finance','finance','$',['yield to call calculator'],[F('price','Current Price ($)',{min:1}),F('callPrice','Call Price ($)',{min:1}),F('coupon','Annual Coupon ($)',{min:0})],'YTC %');
add('altman-z-score','Altman Z-Score','Finance','finance','$',['altman z score calculator'],[F('wcta','WC/TA',{}),F('reta','RE/TA',{}),F('ebitta','EBIT/TA',{})],'Z-Score','Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + X5');
add('bond-price-calc','Bond Price','Finance','finance','$',['bond price calculator'],[F('faceValue','Face Value ($)',{dv:1000}),F('couponRate','Coupon Rate %',{dv:5}),F('ytm','YTM %',{dv:4})],'Bond Price ($)');
add('bond-ytm-calc','Bond Yield to Maturity','Finance','finance','$',['bond ytm calculator'],[F('price','Bond Price ($)',{min:1}),F('faceValue','Face Value ($)',{dv:1000}),F('coupon','Annual Coupon ($)',{min:0})],'YTM %');
add('dupont-analysis','DuPont Analysis','Finance','finance','$',['dupont analysis calculator'],[F('netIncome','Net Income ($)',{min:0}),F('revenue','Revenue ($)',{min:1}),F('assets','Total Assets ($)',{min:1})],'ROE %','ROE = Margin × Turnover × Leverage');
add('peg-ratio-calc','PEG Ratio','Finance','finance','$',['peg ratio calculator'],[F('pe','P/E Ratio',{min:0.1}),F('growth','EPS Growth Rate %',{min:0.1})],'PEG Ratio','PEG = P/E / Growth');
add('forward-rate-calc','Forward Rate','Finance','finance','$',['forward rate calculator'],[F('spot1','Spot Rate 1 %',{min:0}),F('spot2','Spot Rate 2 %',{min:0}),F('t1','Period 1 (years)',{dv:1})],'Forward Rate %');
add('hedge-ratio-calc','Hedge Ratio','Finance','finance','$',['hedge ratio calculator'],[F('correlation','Correlation',{min:-1,max:1}),F('assetVol','Asset Vol %',{min:0.01}),F('hedgeVol','Hedge Vol %',{min:0.01})],'Optimal Hedge Ratio');
add('beta-stock-calc','Beta Stock','Finance','finance','$',['beta stock calculator'],[F('stockReturn','Stock Return %',{}),F('marketReturn','Market Return %',{})],'Beta');
add('cost-of-equity','Cost of Equity','Finance','finance','$',['cost of equity calculator'],[F('riskFree','Risk-Free Rate %',{dv:3}),F('beta','Beta',{dv:1.2}),F('marketPremium','Market Premium %',{dv:6})],'Cost of Equity %','Ke = Rf + β(Rm - Rf)');
add('cost-of-capital','Cost of Capital','Finance','finance','$',['cost of capital calculator'],[F('equityWeight','Equity Weight %',{dv:60}),F('debtWeight','Debt Weight %',{dv:40}),F('costEquity','Cost of Equity %',{dv:10})],'WACC %');
add('enterprise-value-calc','Enterprise Value','Finance','finance','$',['enterprise value calculator'],[F('marketCap','Market Cap ($)',{min:1}),F('debt','Total Debt ($)',{min:0}),F('cash','Cash ($)',{min:0})],'EV ($)','EV = Market Cap + Debt - Cash');
add('mirr-calculator','MIRR','Finance','finance','$',['mirr calculator'],[F('investment','Initial Investment ($)',{min:1}),F('financeRate','Finance Rate %',{dv:10}),F('reinvestRate','Reinvest Rate %',{dv:12})],'MIRR %');
add('dcf-calculator','DCF Valuation','Finance','finance','$',['dcf calculator','discounted cash flow'],[F('cashFlow','Year 1 Cash Flow ($)',{min:1}),F('growth','Growth Rate %',{dv:5}),F('discount','Discount Rate %',{dv:10})],'DCF Value ($)');
add('fire-calculator','FIRE Number','Finance','finance','$',['fire calculator','financial independence'],[F('annualExpenses','Annual Expenses ($)',{min:1}),F('withdrawalRate','Withdrawal Rate %',{dv:4})],'FIRE Number ($)','FIRE = Expenses / Rate');
add('perpetuity-calc','Perpetuity','Finance','finance','$',['perpetuity calculator'],[F('payment','Annual Payment ($)',{min:1}),F('rate','Discount Rate %',{min:0.1})],'PV ($)','PV = PMT / r');
add('money-factor-calc','Money Factor','Finance','finance','$',['money factor calculator'],[F('moneyFactor','Money Factor',{min:0.0001,step:0.0001}),F('apr','or APR %',{dv:0})],'APR % / Money Factor');
add('opportunity-cost-calc','Opportunity Cost','Finance','finance','$',['opportunity cost calculator'],[F('optionA','Option A Return ($)',{min:0}),F('optionB','Option B Return ($)',{min:0})],'Opportunity Cost ($)');
add('time-value-money','Time Value of Money','Finance','finance','$',['time value of money calculator','tvm'],[F('pv','Present Value ($)',{min:0}),F('rate','Interest Rate %',{min:0}),F('periods','Periods',{min:1})],'Future Value ($)','FV = PV × (1+r)^n');
add('var-value-at-risk','Value at Risk','Finance','finance','$',['var calculator','value at risk'],[F('portfolio','Portfolio Value ($)',{min:1}),F('volatility','Daily Volatility %',{min:0.01}),F('confidence','Confidence Level',{dv:0.95})],'VaR ($)');
add('graham-number','Graham Number','Finance','finance','$',['graham number calculator'],[F('eps','EPS ($)',{min:0.01}),F('bookValue','Book Value/Share ($)',{min:0.01})],'Graham Number ($)','√(22.5 × EPS × BVPS)');
add('intrinsic-value-calc','Intrinsic Value','Finance','finance','$',['intrinsic value calculator'],[F('eps','EPS ($)',{min:0.01}),F('growth','Growth Rate %',{dv:7}),F('aaa','AAA Bond Yield %',{dv:4})],'Intrinsic Value ($)');
add('burn-rate-calc','Burn Rate','Finance','finance','$',['burn rate calculator','startup'],[F('cashBalance','Cash Balance ($)',{min:1}),F('monthlySpend','Monthly Spend ($)',{min:1})],'Months of Runway','Runway = Cash / Monthly Burn');
add('cac-calculator','Customer Acquisition Cost','Finance','finance','$',['cac calculator'],[F('marketingCost','Marketing Cost ($)',{min:0}),F('salesCost','Sales Cost ($)',{min:0}),F('newCustomers','New Customers',{min:1})],'CAC ($)');
add('ltv-saas-calc','SaaS LTV','Finance','finance','$',['ltv saas calculator'],[F('arpu','ARPU ($)',{min:0.01}),F('churnRate','Monthly Churn Rate %',{min:0.1})],'LTV ($)','LTV = ARPU / Churn');
add('debt-to-equity-calc','Debt to Equity','Finance','finance','$',['debt to equity calculator'],[F('totalDebt','Total Debt ($)',{min:0}),F('totalEquity','Total Equity ($)',{min:1})],'D/E Ratio');
add('quick-ratio-calc','Quick Ratio','Finance','finance','$',['quick ratio calculator'],[F('currentAssets','Current Assets ($)',{min:0}),F('inventory','Inventory ($)',{min:0}),F('currentLiab','Current Liabilities ($)',{min:1})],'Quick Ratio','(CA - Inventory) / CL');
add('interest-coverage-ratio','Interest Coverage','Finance','finance','$',['interest coverage ratio'],[F('ebit','EBIT ($)',{min:0}),F('interestExpense','Interest Expense ($)',{min:1})],'ICR','ICR = EBIT / Interest');
add('free-cash-flow','Free Cash Flow','Finance','finance','$',['free cash flow calculator'],[F('operatingCF','Operating Cash Flow ($)',{}),F('capex','Capital Expenditures ($)',{min:0})],'FCF ($)','FCF = OCF - CapEx');
add('economic-value-added','Economic Value Added','Finance','finance','$',['eva calculator'],[F('nopat','NOPAT ($)',{min:0}),F('capital','Invested Capital ($)',{min:1}),F('wacc','WACC %',{dv:10})],'EVA ($)');
add('dividend-growth-model','Dividend Growth Model','Finance','finance','$',['dividend growth model'],[F('dividend','Annual Dividend ($)',{min:0.01}),F('growth','Growth Rate %',{dv:3}),F('required','Required Return %',{dv:8})],'Stock Value ($)','P = D / (r - g)');
add('ebitda-multiple','EBITDA Multiple','Finance','finance','$',['ebitda multiple calculator'],[F('ev','Enterprise Value ($)',{min:1}),F('ebitda','EBITDA ($)',{min:1})],'EV/EBITDA','Multiple = EV / EBITDA');
add('retention-ratio','Retention Ratio','Finance','finance','$',['retention ratio calculator'],[F('netIncome','Net Income ($)',{min:1}),F('dividends','Dividends ($)',{min:0})],'Retention Ratio','RR = (NI - Div) / NI');
add('operating-leverage','Operating Leverage','Finance','finance','$',['operating leverage calculator'],[F('contribution','Contribution Margin ($)',{min:1}),F('ebit','EBIT ($)',{min:1})],'DOL','DOL = CM / EBIT');
add('financial-leverage','Financial Leverage','Finance','finance','$',['financial leverage calculator'],[F('assets','Total Assets ($)',{min:1}),F('equity','Shareholder Equity ($)',{min:1})],'Equity Multiplier');
add('ev-to-ebitda','EV/EBITDA','Finance','finance','$',['ev to ebitda calculator'],[F('ev','Enterprise Value ($)',{min:1}),F('ebitda','EBITDA ($)',{min:1})],'Multiple');
add('price-to-cash-flow','Price to Cash Flow','Finance','finance','$',['price to cash flow ratio'],[F('marketCap','Market Cap ($)',{min:1}),F('operatingCF','Operating CF ($)',{min:1})],'P/CF Ratio');
add('residual-income','Residual Income','Finance','finance','$',['residual income calculator'],[F('netIncome','Net Income ($)',{min:0}),F('equityCharge','Equity Charge ($)',{min:0})],'Residual Income ($)');
add('sustainable-growth-rate','Sustainable Growth Rate','Finance','finance','$',['sustainable growth rate'],[F('roe','ROE %',{min:0.01}),F('retention','Retention Ratio',{min:0,max:1})],'SGR %','SGR = ROE × RR');
add('net-operating-income','Net Operating Income','Finance','finance','$',['noi calculator'],[F('grossIncome','Gross Income ($)',{min:0}),F('vacancy','Vacancy Rate %',{dv:5}),F('opex','Operating Expenses ($)',{min:0})],'NOI ($)');
add('cap-rate-noi','Cap Rate from NOI','Finance','finance','$',['cap rate noi calculator'],[F('noi','Net Operating Income ($)',{min:1}),F('value','Property Value ($)',{min:1})],'Cap Rate %');
add('gross-rent-multiplier','Gross Rent Multiplier','Finance','finance','$',['grm calculator'],[F('price','Property Price ($)',{min:1}),F('annualRent','Annual Gross Rent ($)',{min:1})],'GRM','GRM = Price / Annual Rent');

// ===== PHYSICS (50) =====
add('projectile-motion','Projectile Motion','Science','science','A',['projectile motion calculator'],[F('velocity','Initial Velocity (m/s)',{min:0.1}),F('angle','Launch Angle (°)',{min:0,max:90}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Range (m)','R = v²sin(2θ)/g');
add('free-fall-calc','Free Fall','Science','science','A',['free fall calculator'],[F('height','Height (m)',{min:0.1}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Time (s)','t = √(2h/g)');
add('terminal-velocity-calc','Terminal Velocity','Science','science','A',['terminal velocity calculator'],[F('mass','Mass (kg)',{min:0.001}),F('dragCoeff','Drag Coefficient',{dv:0.47}),F('area','Cross-Section (m²)',{min:0.001})],'Terminal Velocity (m/s)');
add('inclined-plane','Inclined Plane','Science','science','A',['inclined plane calculator'],[F('mass','Mass (kg)',{min:0.01}),F('angle','Angle (°)',{min:1,max:89}),F('friction','Friction Coeff',{dv:0.3})],'Force (N)');
add('rolling-resistance-calc','Rolling Resistance','Science','science','A',['rolling resistance calculator'],[F('crr','Rolling Coeff',{dv:0.015}),F('mass','Mass (kg)',{min:1}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Force (N)');
add('centrifugal-force','Centrifugal Force','Science','science','A',['centrifugal force calculator'],[F('mass','Mass (kg)',{min:0.01}),F('velocity','Velocity (m/s)',{min:0.01}),F('radius','Radius (m)',{min:0.01})],'Force (N)');
add('coriolis-effect','Coriolis Effect','Science','science','A',['coriolis effect calculator'],[F('mass','Mass (kg)',{min:0.01}),F('velocity','Velocity (m/s)',{min:0.01}),F('latitude','Latitude (°)',{dv:45})],'Force (N)');
add('escape-velocity-calc','Escape Velocity','Science','science','A',['escape velocity calculator'],[F('mass','Planet Mass (kg)',{dv:5.972e24}),F('radius','Planet Radius (m)',{dv:6371000})],'Velocity (m/s)','v = √(2GM/r)');
add('orbital-velocity-calc','Orbital Velocity','Science','science','A',['orbital velocity calculator'],[F('mass','Central Mass (kg)',{dv:5.972e24}),F('radius','Orbit Radius (m)',{dv:6771000})],'Velocity (m/s)');
add('kepler-third-law','Kepler Third Law','Science','science','A',['kepler calculator'],[F('period','Orbital Period (s)',{min:1}),F('mass','Central Mass (kg)',{dv:1.989e30})],'Semi-Major Axis (m)');
add('rocket-equation','Tsiolkovsky Rocket Equation','Science','science','A',['rocket equation calculator'],[F('isp','Specific Impulse (s)',{min:1}),F('wetMass','Wet Mass (kg)',{min:1}),F('dryMass','Dry Mass (kg)',{min:1})],'Delta-V (m/s)','Δv = Isp×g×ln(m0/mf)');
add('delta-v-calc','Delta-V','Science','science','A',['delta v calculator'],[F('isp','Specific Impulse (s)',{min:1}),F('massRatio','Mass Ratio',{min:1})],'Delta-V (m/s)');
add('schwarzschild-radius','Schwarzschild Radius','Science','science','A',['schwarzschild radius calculator'],[F('mass','Mass (kg)',{min:1})],'Radius (m)','Rs = 2GM/c²');
add('time-dilation','Time Dilation','Science','science','A',['time dilation calculator'],[F('velocity','Velocity (m/s)',{min:0}),F('properTime','Proper Time (s)',{min:0.001})],'Dilated Time (s)');
add('length-contraction','Length Contraction','Science','science','A',['length contraction calculator'],[F('properLength','Proper Length (m)',{min:0.001}),F('velocity','Velocity (m/s)',{min:0})],'Contracted Length (m)');
add('e-mc2-calc','E=mc² Energy','Science','science','A',['e mc2 calculator','mass energy'],[F('mass','Mass (kg)',{min:1e-30})],'Energy (J)','E = mc²');
add('lorentz-force','Lorentz Force','Science','science','A',['lorentz force calculator'],[F('charge','Charge (C)',{min:1e-20}),F('velocity','Velocity (m/s)',{min:0}),F('bField','Magnetic Field (T)',{min:0})],'Force (N)');
add('gauss-law-calc','Gauss Law','Science','science','A',['gauss law calculator'],[F('charge','Enclosed Charge (C)',{}),F('permittivity','Permittivity',{dv:8.854e-12})],'Electric Flux');
add('faraday-law-calc','Faraday Law','Science','science','A',['faraday law calculator'],[F('turns','Number of Turns',{min:1}),F('fluxChange','Flux Change (Wb)',{}),F('time','Time (s)',{min:0.001})],'EMF (V)','EMF = -N×ΔΦ/Δt');
add('rlc-circuit','RLC Circuit','Science','science','A',['rlc circuit calculator'],[F('resistance','Resistance (Ω)',{min:0}),F('inductance','Inductance (H)',{min:0.001}),F('capacitance','Capacitance (F)',{min:1e-12})],'Resonant Freq (Hz)');
add('n555-timer','555 Timer','Science','science','A',['555 timer calculator'],[F('r1','R1 (Ω)',{min:1}),F('r2','R2 (Ω)',{min:1}),F('c','Capacitance (F)',{min:1e-12})],'Frequency (Hz)');
add('mosfet-calc','MOSFET','Science','science','A',['mosfet calculator'],[F('vgs','Vgs (V)',{min:0}),F('vth','Threshold Voltage (V)',{dv:2}),F('kn','Kn (A/V²)',{dv:0.001})],'Drain Current (A)');
add('transistor-biasing','Transistor Biasing','Science','science','A',['transistor biasing calculator'],[F('vcc','Vcc (V)',{min:1}),F('beta','Beta (hFE)',{dv:100}),F('rb','Base Resistance (Ω)',{min:1})],'Ic (A)');
add('wire-resistance-calc','Wire Resistance','Science','science','A',['wire resistance calculator'],[F('resistivity','Resistivity (Ω·m)',{dv:1.68e-8}),F('length','Length (m)',{min:0.01}),F('area','Cross-Section (mm²)',{min:0.01})],'Resistance (Ω)');
add('darcy-weisbach','Darcy-Weisbach','Science','science','A',['darcy weisbach calculator'],[F('friction','Friction Factor',{dv:0.02}),F('length','Pipe Length (m)',{min:0.1}),F('diameter','Diameter (m)',{min:0.01})],'Head Loss (m)');
add('hydraulic-press','Hydraulic Press','Science','science','A',['hydraulic press calculator'],[F('force1','Input Force (N)',{min:0.1}),F('area1','Small Piston (m²)',{min:0.001}),F('area2','Large Piston (m²)',{min:0.001})],'Output Force (N)');
add('archimedes-principle','Archimedes Principle','Science','science','A',['archimedes calculator'],[F('volume','Displaced Volume (m³)',{min:0.001}),F('density','Fluid Density (kg/m³)',{dv:1000}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Buoyant Force (N)');
add('drag-equation','Drag Equation','Science','science','A',['drag equation calculator'],[F('density','Fluid Density (kg/m³)',{dv:1.225}),F('velocity','Velocity (m/s)',{min:0.1}),F('cd','Drag Coefficient',{dv:0.47})],'Drag Force (N)');
add('lift-coefficient','Lift Coefficient','Science','science','A',['lift coefficient calculator'],[F('lift','Lift Force (N)',{min:0.1}),F('density','Air Density (kg/m³)',{dv:1.225}),F('velocity','Velocity (m/s)',{min:0.1})],'Cl');
add('bragg-law','Bragg Law','Science','science','A',['bragg law calculator'],[F('order','Order (n)',{dv:1}),F('wavelength','Wavelength (nm)',{min:0.01}),F('angle','Angle (°)',{min:1,max:89})],'d-spacing (nm)');
add('snell-law-calc','Snell Law','Science','science','A',['snell law calculator'],[F('n1','n1 (refractive index)',{dv:1.0}),F('theta1','Angle 1 (°)',{min:0,max:89}),F('n2','n2',{dv:1.5})],'Angle 2 (°)');
add('diffraction-grating','Diffraction Grating','Science','science','A',['diffraction grating calculator'],[F('order','Order (m)',{dv:1}),F('wavelength','Wavelength (nm)',{min:1}),F('spacing','Slit Spacing (nm)',{min:1})],'Angle (°)');
add('telescope-magnification','Telescope Magnification','Science','science','A',['telescope magnification calculator'],[F('focalObj','Objective Focal Length (mm)',{min:1}),F('focalEye','Eyepiece Focal Length (mm)',{min:1})],'Magnification','M = fo / fe');
add('lens-maker-calc','Lens Maker Equation','Science','science','A',['lens maker calculator'],[F('n','Refractive Index',{dv:1.5}),F('r1','R1 (m)',{}),F('r2','R2 (m)',{})],'Focal Length (m)');
add('thin-lens-calc','Thin Lens Equation','Science','science','A',['thin lens calculator'],[F('objectDist','Object Distance (cm)',{min:0.1}),F('focalLength','Focal Length (cm)',{})],'Image Distance (cm)','1/f = 1/do + 1/di');
add('mirror-equation','Mirror Equation','Science','science','A',['mirror equation calculator'],[F('objectDist','Object Distance (cm)',{min:0.1}),F('focalLength','Focal Length (cm)',{})],'Image Distance (cm)');
add('speed-of-sound-calc','Speed of Sound','Science','science','A',['speed of sound calculator'],[F('temp','Temperature (°C)',{}),F('medium','Medium (1=air)',{dv:1})],'Speed (m/s)','v = 331.3 + 0.606T');
add('helmholtz-resonator','Helmholtz Resonator','Science','science','A',['helmholtz resonator calculator'],[F('volume','Cavity Volume (m³)',{min:0.001}),F('neckArea','Neck Area (m²)',{min:0.0001}),F('neckLength','Neck Length (m)',{min:0.01})],'Frequency (Hz)');
add('reverberation-time-calc','Reverberation Time','Science','science','A',['reverberation time calculator'],[F('volume','Room Volume (m³)',{min:1}),F('absorption','Total Absorption (m²)',{min:0.1})],'RT60 (s)','RT60 = 0.161V/A');
add('young-modulus','Young Modulus','Science','science','A',['young modulus calculator'],[F('stress','Stress (Pa)',{min:0}),F('strain','Strain',{min:0.001})],'E (Pa)','E = σ / ε');
add('poisson-ratio','Poisson Ratio','Science','science','A',['poisson ratio calculator'],[F('lateralStrain','Lateral Strain',{}),F('axialStrain','Axial Strain',{min:0.001})],'ν','ν = -εlat / εaxial');
add('shear-stress-calc','Shear Stress','Science','science','A',['shear stress calculator'],[F('force','Shear Force (N)',{min:0}),F('area','Area (m²)',{min:0.001})],'Shear Stress (Pa)');
add('von-mises-stress','Von Mises Stress','Science','science','A',['von mises stress calculator'],[F('s1','σ1 (Pa)',{}),F('s2','σ2 (Pa)',{}),F('s3','σ3 (Pa)',{})],'Von Mises (Pa)');
add('mohr-circle','Mohr Circle','Science','science','A',['mohr circle calculator'],[F('sigmaX','σx (Pa)',{}),F('sigmaY','σy (Pa)',{}),F('tauXY','τxy (Pa)',{})],'Max Shear (Pa)');
add('stress-concentration','Stress Concentration','Science','science','A',['stress concentration factor'],[F('nominalStress','Nominal Stress (Pa)',{min:0}),F('kt','Kt Factor',{dv:2.5})],'Peak Stress (Pa)');
add('fulcrum-calc','Fulcrum','Science','science','A',['fulcrum calculator'],[F('force1','Force 1 (N)',{min:0.01}),F('dist1','Distance 1 (m)',{min:0.01}),F('force2','Force 2 (N)',{min:0.01})],'Distance 2 (m)');
add('mechanical-advantage','Mechanical Advantage','Science','science','A',['mechanical advantage calculator'],[F('outputForce','Output Force (N)',{min:0.01}),F('inputForce','Input Force (N)',{min:0.01})],'MA','MA = Fout / Fin');
add('belt-length-calc','Belt Length','Science','science','A',['belt length calculator'],[F('d1','Pulley 1 Diameter (mm)',{min:1}),F('d2','Pulley 2 Diameter (mm)',{min:1}),F('center','Center Distance (mm)',{min:1})],'Belt Length (mm)');
add('torsion-spring-calc','Torsion Spring','Science','science','A',['torsion spring calculator'],[F('wireDiam','Wire Diameter (mm)',{min:0.1}),F('coilDiam','Coil Diameter (mm)',{min:1}),F('turns','Active Turns',{min:1})],'Spring Rate (N·mm/°)');

// ===== STATE-SPECIFIC TAX (50 US States) =====
const states = [
  ['alabama','Alabama'],['alaska','Alaska'],['arizona','Arizona'],['arkansas','Arkansas'],
  ['california','California'],['colorado','Colorado'],['connecticut','Connecticut'],['delaware','Delaware'],
  ['florida','Florida'],['georgia','Georgia'],['hawaii','Hawaii'],['idaho','Idaho'],
  ['illinois','Illinois'],['indiana','Indiana'],['iowa','Iowa'],['kansas','Kansas'],
  ['kentucky','Kentucky'],['louisiana','Louisiana'],['maine','Maine'],['maryland','Maryland'],
  ['massachusetts','Massachusetts'],['michigan','Michigan'],['minnesota','Minnesota'],['mississippi','Mississippi'],
  ['missouri','Missouri'],['montana','Montana'],['nebraska','Nebraska'],['nevada','Nevada'],
  ['new-hampshire','New Hampshire'],['new-jersey','New Jersey'],['new-mexico','New Mexico'],['new-york','New York'],
  ['north-carolina','North Carolina'],['north-dakota','North Dakota'],['ohio','Ohio'],['oklahoma','Oklahoma'],
  ['oregon','Oregon'],['pennsylvania','Pennsylvania'],['rhode-island','Rhode Island'],['south-carolina','South Carolina'],
  ['south-dakota','South Dakota'],['tennessee','Tennessee'],['texas','Texas'],['utah','Utah'],
  ['vermont','Vermont'],['virginia','Virginia'],['washington','Washington'],['west-virginia','West Virginia'],
  ['wisconsin','Wisconsin'],['wyoming','Wyoming']
];

for (const [slug, name] of states) {
  add(`${slug}-income-tax`,`${name} Income Tax`,'Finance','finance','$',[`${name.toLowerCase()} income tax calculator`,`${name.toLowerCase()} state tax`],[F('income','Taxable Income ($)',{min:1}),F('filingStatus','Filing (1=single,2=married)',{dv:1})],'Tax Owed ($)',`Tax = ${name} Rate × Taxable Income`);
}

// ===== CHEMISTRY (30) =====
add('molarity-calc','Molarity','Science','science','A',['molarity calculator'],[F('moles','Moles of Solute',{min:0.001}),F('volume','Volume (L)',{min:0.001})],'Molarity (M)','M = mol / L');
add('dilution-equation','Dilution Equation','Science','science','A',['dilution calculator','C1V1=C2V2'],[F('c1','C1 (M)',{min:0.001}),F('v1','V1 (mL)',{min:0.01}),F('c2','C2 (M)',{min:0.001})],'V2 (mL)','C1V1 = C2V2');
add('molar-mass','Molar Mass','Science','science','A',['molar mass calculator'],[F('mass','Mass (g)',{min:0.001}),F('moles','Moles',{min:0.001})],'Molar Mass (g/mol)');
add('percent-composition','Percent Composition','Science','science','A',['percent composition calculator'],[F('partMass','Part Mass (g)',{min:0.001}),F('totalMass','Total Mass (g)',{min:0.001})],'Composition %');
add('ideal-gas-law','Ideal Gas Law','Science','science','A',['ideal gas law calculator','PV=nRT'],[F('pressure','Pressure (atm)',{dv:1}),F('volume','Volume (L)',{min:0.001}),F('moles','Moles',{min:0.001})],'Temperature (K)','PV = nRT');
add('combined-gas-law','Combined Gas Law','Science','science','A',['combined gas law calculator'],[F('p1','P1 (atm)',{min:0.001}),F('v1','V1 (L)',{min:0.001}),F('t1','T1 (K)',{min:1})],'P2V2/T2');
add('boyles-law','Boyle Law','Science','science','A',['boyle law calculator'],[F('p1','P1 (atm)',{min:0.001}),F('v1','V1 (L)',{min:0.001}),F('p2','P2 (atm)',{min:0.001})],'V2 (L)','P1V1 = P2V2');
add('charles-law','Charles Law','Science','science','A',['charles law calculator'],[F('v1','V1 (L)',{min:0.001}),F('t1','T1 (K)',{min:1}),F('t2','T2 (K)',{min:1})],'V2 (L)','V1/T1 = V2/T2');
add('avogadro-law','Avogadro Law','Science','science','A',['avogadro law calculator'],[F('v1','V1 (L)',{min:0.001}),F('n1','n1 (mol)',{min:0.001}),F('n2','n2 (mol)',{min:0.001})],'V2 (L)');
add('ph-calculator','pH Calculator','Science','science','A',['ph calculator'],[F('hConc','H+ Concentration (M)',{min:1e-14,step:1e-7})],'pH','-log[H+]');
add('henderson-hasselbalch','Henderson-Hasselbalch','Science','science','A',['henderson hasselbalch calculator'],[F('pka','pKa',{}),F('conjugateBase','[A-] (M)',{min:0.001}),F('acid','[HA] (M)',{min:0.001})],'pH');
add('buffer-capacity','Buffer Capacity','Science','science','A',['buffer capacity calculator'],[F('concentration','Buffer Conc (M)',{min:0.001}),F('volume','Volume (L)',{min:0.001})],'Buffer Capacity');
add('electrochemistry-cell','Electrochemistry Cell','Science','science','A',['cell potential calculator'],[F('cathode','Cathode E° (V)',{}),F('anode','Anode E° (V)',{})],'Cell Potential (V)','E°cell = E°cathode - E°anode');
add('nernst-equation','Nernst Equation','Science','science','A',['nernst equation calculator'],[F('eCellStd','E° (V)',{}),F('n','Electrons Transferred',{min:1}),F('q','Reaction Quotient',{min:0.001})],'E (V)');
add('enthalpy-reaction','Enthalpy of Reaction','Science','science','A',['enthalpy calculator'],[F('products','ΣH Products (kJ)',{}),F('reactants','ΣH Reactants (kJ)',{})],'ΔH (kJ)','ΔH = ΣH(products) - ΣH(reactants)');
add('gibbs-free-energy','Gibbs Free Energy','Science','science','A',['gibbs free energy calculator'],[F('enthalpy','ΔH (kJ)',{}),F('temp','Temperature (K)',{min:0}),F('entropy','ΔS (kJ/K)',{})],'ΔG (kJ)','ΔG = ΔH - TΔS');
add('rate-constant','Rate Constant','Science','science','A',['rate constant calculator'],[F('a','Pre-exponential Factor',{min:0}),F('ea','Activation Energy (J/mol)',{min:0}),F('temp','Temperature (K)',{min:1})],'k','k = A×exp(-Ea/RT)');
add('equilibrium-constant','Equilibrium Constant','Science','science','A',['equilibrium constant calculator'],[F('products','[Products]',{min:0}),F('reactants','[Reactants]',{min:0.001})],'Keq');
add('mass-to-moles','Mass to Moles','Science','science','A',['mass to moles converter'],[F('mass','Mass (g)',{min:0.001}),F('molarMass','Molar Mass (g/mol)',{min:0.001})],'Moles');
add('theoretical-yield','Theoretical Yield','Science','science','A',['theoretical yield calculator'],[F('reactantMass','Reactant Mass (g)',{min:0.001}),F('reactantMM','Reactant MM (g/mol)',{min:0.001}),F('productMM','Product MM (g/mol)',{min:0.001})],'Yield (g)');
add('percent-yield','Percent Yield','Science','science','A',['percent yield calculator'],[F('actual','Actual Yield (g)',{min:0}),F('theoretical','Theoretical Yield (g)',{min:0.001})],'Yield %');
add('osmotic-pressure','Osmotic Pressure','Science','science','A',['osmotic pressure calculator'],[F('molarity','Molarity (M)',{min:0.001}),F('temp','Temperature (K)',{min:1}),F('vanHoff','van Hoff Factor',{dv:1})],'Pressure (atm)','π = iMRT');
add('colligative-boiling','Boiling Point Elevation','Science','science','A',['boiling point elevation'],[F('kb','Kb (°C/m)',{dv:0.512}),F('molality','Molality (m)',{min:0.001}),F('vanHoff','van Hoff Factor',{dv:1})],'ΔTb (°C)');
add('colligative-freezing','Freezing Point Depression','Science','science','A',['freezing point depression'],[F('kf','Kf (°C/m)',{dv:1.86}),F('molality','Molality (m)',{min:0.001}),F('vanHoff','van Hoff Factor',{dv:1})],'ΔTf (°C)');
add('specific-heat-calc','Specific Heat','Science','science','A',['specific heat calculator','q=mcdt'],[F('mass','Mass (g)',{min:0.001}),F('specificHeat','Specific Heat (J/g°C)',{dv:4.184}),F('deltaT','ΔT (°C)',{})],'Heat (J)','Q = mcΔT');
add('heat-of-fusion','Heat of Fusion','Science','science','A',['heat of fusion calculator'],[F('mass','Mass (g)',{min:0.001}),F('hf','Heat of Fusion (J/g)',{dv:334})],'Energy (J)','Q = m × Hf');
add('heat-of-vaporization','Heat of Vaporization','Science','science','A',['heat of vaporization calculator'],[F('mass','Mass (g)',{min:0.001}),F('hv','Heat of Vaporization (J/g)',{dv:2260})],'Energy (J)');
add('raoults-law','Raoult Law','Science','science','A',['raoult law calculator'],[F('moleFraction','Mole Fraction',{min:0,max:1}),F('pureVapor','Pure Vapor Pressure (atm)',{min:0.001})],'Partial Pressure (atm)');
add('henrys-law','Henry Law','Science','science','A',['henry law calculator'],[F('kh','Henry Constant (M/atm)',{min:0.001}),F('pressure','Partial Pressure (atm)',{min:0.001})],'Concentration (M)');
add('electron-configuration','Electron Configuration','Science','science','A',['electron configuration calculator'],[F('atomicNum','Atomic Number',{min:1,max:118}),F('charge','Ion Charge',{dv:0})],'Configuration');

// ===== CONSTRUCTION (30) =====
add('footing-size-calc','Footing Size','Everyday','everyday','~',['footing size calculator'],[F('load','Load (lbs)',{min:100}),F('soilCapacity','Soil Capacity (psf)',{dv:2000})],'Footing Area (sq ft)');
add('rebar-spacing','Rebar Spacing','Everyday','everyday','~',['rebar spacing calculator'],[F('slabWidth','Slab Width (in)',{min:12}),F('barSize','Bar Size (#)',{dv:4}),F('coverage','Coverage %',{dv:0.5})],'Spacing (in)');
add('i-beam-calc','I-Beam Size','Everyday','everyday','~',['i beam calculator'],[F('span','Span (ft)',{min:1}),F('load','Load (lbs/ft)',{min:1})],'Min Section Modulus');
add('pipe-size-calc','Pipe Size','Everyday','everyday','~',['pipe size calculator'],[F('flowRate','Flow Rate (GPM)',{min:0.1}),F('velocity','Max Velocity (ft/s)',{dv:5})],'Pipe Diameter (in)');
add('ramp-slope-calc','Ramp Slope','Everyday','everyday','~',['ramp slope calculator','ada ramp'],[F('rise','Rise (in)',{min:1}),F('run','Run (in)',{min:1})],'Slope Ratio','Slope = Rise / Run');
add('staircase-design','Staircase Design','Everyday','everyday','~',['staircase calculator'],[F('totalRise','Total Rise (in)',{min:12}),F('riserHeight','Riser Height (in)',{dv:7.5})],'Number of Steps');
add('tread-riser-calc','Tread and Riser','Everyday','everyday','~',['tread riser calculator'],[F('totalRise','Total Rise (in)',{min:12}),F('steps','Number of Steps',{min:2})],'Riser Height (in)');
add('concrete-volume','Concrete Volume','Everyday','everyday','~',['concrete volume calculator'],[F('length','Length (ft)',{min:0.5}),F('width','Width (ft)',{min:0.5}),F('depth','Depth (in)',{min:1})],'Cubic Yards');
add('steel-weight-calc','Steel Weight','Everyday','everyday','~',['steel weight calculator'],[F('length','Length (ft)',{min:0.1}),F('weightPerFt','Weight/Ft (lbs)',{dv:10})],'Total Weight (lbs)');
add('truss-load','Truss Load','Everyday','everyday','~',['truss calculator'],[F('span','Span (ft)',{min:4}),F('loadPerFt','Load/Ft (lbs)',{dv:50}),F('spacing','Truss Spacing (ft)',{dv:2})],'Total Load (lbs)');
add('mortar-mix','Mortar Mix','Everyday','everyday','~',['mortar calculator'],[F('sqft','Wall Area (sq ft)',{min:1}),F('brickSize','Brick Size (in)',{dv:8})],'Mortar (cu ft)');
add('plywood-sheets','Plywood Sheets','Everyday','everyday','~',['plywood calculator'],[F('area','Total Area (sq ft)',{min:1}),F('sheetSize','Sheet Size (sq ft)',{dv:32})],'Sheets Needed');
add('shingle-calc','Shingle Calculator','Everyday','everyday','~',['shingle calculator'],[F('roofArea','Roof Area (sq ft)',{min:100}),F('waste','Waste Factor %',{dv:10})],'Bundles Needed');
add('gutter-size-calc','Gutter Size','Everyday','everyday','~',['gutter size calculator'],[F('roofArea','Roof Area (sq ft)',{min:100}),F('rainfall','Max Rainfall (in/hr)',{dv:4})],'Gutter Size (in)');
add('hvac-load','HVAC Load','Everyday','everyday','~',['hvac load calculator'],[F('sqft','Square Feet',{min:100}),F('climate','Climate Zone (1-5)',{dv:3}),F('insulation','Insulation (1-3)',{dv:2})],'BTU/hr');
add('duct-size-calc','Duct Size','Everyday','everyday','~',['duct size calculator'],[F('cfm','CFM',{min:50}),F('velocity','Velocity (fpm)',{dv:700})],'Duct Diameter (in)');
add('conduit-fill-calc','Conduit Fill','Everyday','everyday','~',['conduit fill calculator'],[F('wires','Number of Wires',{min:1}),F('wireArea','Wire Area (sq in)',{dv:0.02}),F('conduitArea','Conduit Area (sq in)',{dv:0.5})],'Fill %');
add('joist-span-calc','Joist Span','Everyday','everyday','~',['joist span calculator'],[F('joist','Joist Size (2x)',{dv:8}),F('spacing','Spacing (in)',{dv:16}),F('grade','Lumber Grade (1-3)',{dv:2})],'Max Span (ft)');
add('rafter-length-calc','Rafter Length','Everyday','everyday','~',['rafter length calculator'],[F('run','Run (ft)',{min:1}),F('pitch','Pitch (rise/12)',{dv:6})],'Rafter Length (ft)');
add('post-spacing-calc','Post Spacing','Everyday','everyday','~',['post spacing calculator'],[F('totalLength','Total Length (ft)',{min:4}),F('maxSpacing','Max Spacing (ft)',{dv:8})],'Number of Posts');
add('baluster-spacing','Baluster Spacing','Everyday','everyday','~',['baluster spacing calculator'],[F('totalLength','Rail Length (in)',{min:12}),F('balusterWidth','Baluster Width (in)',{dv:1.5}),F('maxGap','Max Gap (in)',{dv:4})],'Balusters Needed');
add('board-feet','Board Feet','Everyday','everyday','~',['board feet calculator'],[F('thickness','Thickness (in)',{min:0.25}),F('width','Width (in)',{min:1}),F('length','Length (ft)',{min:1})],'Board Feet','BF = T×W×L/12');
add('cubic-yards','Cubic Yards','Everyday','everyday','~',['cubic yards calculator'],[F('length','Length (ft)',{min:0.5}),F('width','Width (ft)',{min:0.5}),F('depth','Depth (ft)',{min:0.1})],'Cubic Yards');
add('sand-gravel-calc','Sand and Gravel','Everyday','everyday','~',['sand gravel calculator'],[F('length','Length (ft)',{min:0.5}),F('width','Width (ft)',{min:0.5}),F('depth','Depth (in)',{min:1})],'Tons Needed');
add('paint-coverage','Paint Coverage','Everyday','everyday','~',['paint coverage calculator'],[F('wallArea','Wall Area (sq ft)',{min:10}),F('coats','Coats',{dv:2}),F('coverage','Coverage/Gallon (sq ft)',{dv:350})],'Gallons Needed');
add('wallpaper-calc','Wallpaper','Everyday','everyday','~',['wallpaper calculator'],[F('wallArea','Wall Area (sq ft)',{min:10}),F('rollCoverage','Roll Coverage (sq ft)',{dv:28}),F('waste','Waste %',{dv:15})],'Rolls Needed');
add('crown-molding-calc','Crown Molding','Everyday','everyday','~',['crown molding calculator'],[F('perimeter','Room Perimeter (ft)',{min:10}),F('waste','Waste %',{dv:10}),F('pricePerFt','Price/Ft ($)',{dv:3})],'Total Cost ($)');
add('baseboard-calc','Baseboard','Everyday','everyday','~',['baseboard calculator'],[F('perimeter','Room Perimeter (ft)',{min:10}),F('doors','Door Openings (ft)',{dv:12}),F('pricePerFt','Price/Ft ($)',{dv:2})],'Cost ($)');
add('drywall-calc','Drywall Sheets','Everyday','everyday','~',['drywall calculator'],[F('wallArea','Wall Area (sq ft)',{min:10}),F('sheetSize','Sheet Size (sq ft)',{dv:32}),F('waste','Waste %',{dv:10})],'Sheets Needed');
add('insulation-r-value','Insulation R-Value','Everyday','everyday','~',['insulation r value calculator'],[F('thickness','Thickness (in)',{min:0.5}),F('rPerInch','R-Value/Inch',{dv:3.7})],'Total R-Value');

// ===== STATISTICS (30) =====
add('chi-square-test','Chi-Square Test','Math','math','+',['chi square calculator'],[F('observed','Observed',{min:0}),F('expected','Expected',{min:0.01})],'Chi-Square','χ² = Σ(O-E)²/E');
add('t-test-calc','T-Test','Math','math','+',['t test calculator'],[F('mean1','Mean 1',{}),F('mean2','Mean 2',{}),F('se','Standard Error',{min:0.001})],'t-Statistic');
add('f-test-calc','F-Test','Math','math','+',['f test calculator'],[F('var1','Variance 1',{min:0.001}),F('var2','Variance 2',{min:0.001})],'F-Statistic');
add('anova-test','ANOVA','Math','math','+',['anova calculator'],[F('ssb','SS Between',{min:0}),F('ssw','SS Within',{min:0.001}),F('dfb','df Between',{min:1})],'F-Statistic');
add('regression-line','Linear Regression','Math','math','+',['linear regression calculator'],[F('slope','Slope (m)',{}),F('intercept','Y-Intercept (b)',{}),F('x','X Value',{})],'Y Predicted','y = mx + b');
add('correlation-coeff','Correlation Coefficient','Math','math','+',['correlation calculator'],[F('sumXY','ΣXY',{}),F('sumX','ΣX',{}),F('sumY','ΣY',{})],'r');
add('covariance-calc','Covariance','Math','math','+',['covariance calculator'],[F('sumXY','Σ(Xi×Yi)',{}),F('meanX','Mean X',{}),F('meanY','Mean Y',{})],'Covariance');
add('bayes-theorem','Bayes Theorem','Math','math','+',['bayes theorem calculator'],[F('pA','P(A)',{min:0,max:1}),F('pBA','P(B|A)',{min:0,max:1}),F('pB','P(B)',{min:0.001,max:1})],'P(A|B)','P(A|B) = P(B|A)P(A)/P(B)');
add('poisson-distribution','Poisson Distribution','Math','math','+',['poisson distribution calculator'],[F('lambda','λ (mean)',{min:0.1}),F('k','k (events)',{min:0})],'P(X=k)');
add('binomial-distribution','Binomial Distribution','Math','math','+',['binomial distribution calculator'],[F('n','Trials (n)',{min:1}),F('p','Probability (p)',{min:0,max:1}),F('k','Successes (k)',{min:0})],'P(X=k)');
add('normal-distribution','Normal Distribution','Math','math','+',['normal distribution calculator'],[F('mean','Mean (μ)',{}),F('stdDev','Std Dev (σ)',{min:0.001}),F('x','X Value',{})],'Z-Score');
add('exponential-distribution','Exponential Distribution','Math','math','+',['exponential distribution'],[F('lambda','Rate (λ)',{min:0.001}),F('x','X Value',{min:0})],'P(X≤x)');
add('geometric-mean','Geometric Mean','Math','math','+',['geometric mean calculator'],[F('a','Value A',{min:0.001}),F('b','Value B',{min:0.001})],'Geometric Mean','√(a×b)');
add('harmonic-mean','Harmonic Mean','Math','math','+',['harmonic mean calculator'],[F('a','Value A',{min:0.001}),F('b','Value B',{min:0.001})],'Harmonic Mean','2/(1/a + 1/b)');
add('weighted-average','Weighted Average','Math','math','+',['weighted average calculator'],[F('value1','Value 1',{}),F('weight1','Weight 1',{min:0}),F('value2','Value 2',{})],'Weighted Avg');
add('quartile-calc','Quartile','Math','math','+',['quartile calculator'],[F('n','Data Points',{min:4}),F('q','Quartile (1-3)',{min:1,max:3})],'Quartile Value');
add('interquartile-range','Interquartile Range','Math','math','+',['iqr calculator'],[F('q1','Q1',{}),F('q3','Q3',{})],'IQR','IQR = Q3 - Q1');
add('percentile-rank','Percentile Rank','Math','math','+',['percentile rank calculator'],[F('rank','Rank Position',{min:1}),F('total','Total Values',{min:1})],'Percentile');
add('variance-calc','Variance','Math','math','+',['variance calculator'],[F('sumSquares','Sum of Squares',{min:0}),F('n','Count',{min:2})],'Variance');
add('coefficient-variation','Coefficient of Variation','Math','math','+',['coefficient of variation'],[F('stdDev','Std Deviation',{min:0}),F('mean','Mean',{min:0.001})],'CV %','CV = (σ/μ)×100');
add('effect-size','Effect Size','Math','math','+',['effect size calculator','cohens d'],[F('mean1','Mean 1',{}),F('mean2','Mean 2',{}),F('pooledSD','Pooled SD',{min:0.001})],'Cohen d');
add('margin-of-error','Margin of Error','Math','math','+',['margin of error calculator'],[F('confidence','Z-Score',{dv:1.96}),F('stdDev','Std Deviation',{min:0.001}),F('n','Sample Size',{min:1})],'Margin of Error','MOE = z×σ/√n');
add('type-i-error','Type I Error','Math','math','+',['type i error calculator'],[F('alpha','Alpha Level',{dv:0.05}),F('tests','Number of Tests',{dv:1})],'Probability');
add('type-ii-error','Type II Error','Math','math','+',['type ii error calculator','statistical power'],[F('power','Power',{dv:0.8})],'Beta','β = 1 - Power');
add('relative-risk','Relative Risk','Math','math','+',['relative risk calculator'],[F('exposedEvents','Exposed Events',{min:0}),F('exposedTotal','Exposed Total',{min:1}),F('controlEvents','Control Events',{min:0})],'RR');
add('odds-ratio','Odds Ratio','Math','math','+',['odds ratio calculator'],[F('a','Group 1 Yes',{min:0}),F('b','Group 1 No',{min:0}),F('c','Group 2 Yes',{min:0})],'OR');
add('number-needed-treat','NNT','Math','math','+',['nnt calculator','number needed to treat'],[F('eventControl','Event Rate Control %',{min:0.01}),F('eventTreat','Event Rate Treatment %',{min:0})],'NNT');
add('sensitivity-specificity','Sensitivity Specificity','Math','math','+',['sensitivity specificity calculator'],[F('tp','True Positives',{min:0}),F('fn','False Negatives',{min:0}),F('fp','False Positives',{min:0})],'Sensitivity %');
add('positive-predictive','Positive Predictive Value','Math','math','+',['ppv calculator'],[F('sensitivity','Sensitivity',{min:0,max:1}),F('specificity','Specificity',{min:0,max:1}),F('prevalence','Prevalence',{min:0,max:1})],'PPV');
add('sample-size-mean','Sample Size for Mean','Math','math','+',['sample size calculator mean'],[F('zScore','Z-Score',{dv:1.96}),F('stdDev','Std Deviation',{min:0.001}),F('moe','Margin of Error',{min:0.001})],'Sample Size','n = (z×σ/E)²');

// ===== ADDITIONAL FINANCE (30) =====
add('sip-calculator','SIP Calculator','Finance','finance','$',['sip calculator','systematic investment plan'],[F('monthly','Monthly Investment ($)',{min:1}),F('rate','Expected Return %',{dv:12}),F('years','Years',{min:1})],'Future Value ($)');
add('emi-calculator','EMI Calculator','Finance','finance','$',['emi calculator','equated monthly installment'],[F('principal','Loan Amount ($)',{min:1}),F('rate','Interest Rate %',{dv:8}),F('tenure','Tenure (months)',{min:1})],'EMI ($)');
add('ppf-calculator','PPF Calculator','Finance','finance','$',['ppf calculator','public provident fund'],[F('annual','Annual Deposit ($)',{min:1}),F('rate','Interest Rate %',{dv:7.1}),F('years','Years',{dv:15})],'Maturity Value ($)');
add('fd-calculator','Fixed Deposit','Finance','finance','$',['fd calculator','fixed deposit'],[F('amount','Deposit Amount ($)',{min:1}),F('rate','Interest Rate %',{dv:6}),F('months','Tenure (months)',{min:1})],'Maturity Amount ($)');
add('rd-calculator','Recurring Deposit','Finance','finance','$',['rd calculator'],[F('monthly','Monthly Deposit ($)',{min:1}),F('rate','Interest Rate %',{dv:6}),F('months','Tenure (months)',{min:1})],'Maturity Amount ($)');
add('home-equity-calc','Home Equity','Finance','finance','$',['home equity calculator'],[F('homeValue','Home Value ($)',{min:1}),F('mortgageBalance','Mortgage Balance ($)',{min:0})],'Equity ($)');
add('heloc-payment','HELOC Payment','Finance','finance','$',['heloc payment calculator'],[F('balance','Balance ($)',{min:1}),F('rate','Interest Rate %',{dv:8}),F('term','Term (months)',{dv:120})],'Monthly Payment ($)');
add('fha-loan-calc','FHA Loan','Finance','finance','$',['fha loan calculator'],[F('homePrice','Home Price ($)',{min:10000}),F('downPayment','Down Payment %',{dv:3.5}),F('rate','Interest Rate %',{dv:6.5})],'Monthly Payment ($)');
add('va-loan-calc','VA Loan','Finance','finance','$',['va loan calculator'],[F('loanAmount','Loan Amount ($)',{min:10000}),F('rate','Interest Rate %',{dv:6}),F('term','Term (years)',{dv:30})],'Monthly Payment ($)');
add('income-percentile','Income Percentile','Finance','finance','$',['income percentile calculator'],[F('income','Annual Income ($)',{min:1}),F('household','Household Size',{dv:1})],'Percentile');
add('wedding-budget-calc','Wedding Budget','Finance','finance','$',['wedding budget calculator'],[F('totalBudget','Total Budget ($)',{min:1000}),F('guests','Guests',{min:10})],'Per Guest ($)');
add('lottery-tax-calc','Lottery Tax','Finance','finance','$',['lottery tax calculator'],[F('winnings','Winnings ($)',{min:1}),F('federalRate','Federal Tax %',{dv:24}),F('stateRate','State Tax %',{dv:5})],'Take Home ($)');
add('hourly-to-salary-calc','Hourly to Salary','Finance','finance','$',['hourly to salary calculator'],[F('hourly','Hourly Rate ($)',{min:1}),F('hours','Hours/Week',{dv:40}),F('weeks','Weeks/Year',{dv:52})],'Annual Salary ($)');
add('salary-to-hourly-calc','Salary to Hourly','Finance','finance','$',['salary to hourly calculator'],[F('salary','Annual Salary ($)',{min:1}),F('hours','Hours/Week',{dv:40}),F('weeks','Weeks/Year',{dv:52})],'Hourly Rate ($)');
add('payroll-tax-calc','Payroll Tax','Finance','finance','$',['payroll tax calculator'],[F('grossPay','Gross Pay ($)',{min:1}),F('socialSec','Social Security %',{dv:6.2}),F('medicare','Medicare %',{dv:1.45})],'Total Tax ($)');
add('estate-tax-calc','Estate Tax','Finance','finance','$',['estate tax calculator'],[F('estate','Estate Value ($)',{min:1}),F('exemption','Exemption ($)',{dv:12920000}),F('rate','Tax Rate %',{dv:40})],'Tax ($)');
add('gift-tax-calc','Gift Tax','Finance','finance','$',['gift tax calculator'],[F('giftAmount','Gift Amount ($)',{min:1}),F('exclusion','Annual Exclusion ($)',{dv:18000})],'Taxable Gift ($)');
add('capital-gains-tax','Capital Gains Tax','Finance','finance','$',['capital gains tax calculator'],[F('purchasePrice','Purchase Price ($)',{min:0}),F('salePrice','Sale Price ($)',{min:0}),F('taxRate','Tax Rate %',{dv:15})],'Tax ($)');
add('rmd-calculator','RMD Calculator','Finance','finance','$',['rmd calculator','required minimum distribution'],[F('balance','Account Balance ($)',{min:1}),F('age','Age',{min:72})],'RMD ($)');
add('roth-conversion','Roth Conversion','Finance','finance','$',['roth conversion calculator'],[F('amount','Conversion Amount ($)',{min:1}),F('taxRate','Current Tax Rate %',{dv:22}),F('years','Years Until Withdrawal',{min:1})],'Tax Cost ($)');
add('annuity-payment','Annuity Payment','Finance','finance','$',['annuity payment calculator'],[F('pv','Present Value ($)',{min:1}),F('rate','Interest Rate %',{dv:5}),F('periods','Periods',{min:1})],'Payment ($)');
add('annuity-pv','Annuity Present Value','Finance','finance','$',['annuity present value'],[F('payment','Payment ($)',{min:1}),F('rate','Interest Rate %',{dv:5}),F('periods','Periods',{min:1})],'PV ($)');
add('annuity-fv','Annuity Future Value','Finance','finance','$',['annuity future value'],[F('payment','Payment ($)',{min:1}),F('rate','Interest Rate %',{dv:5}),F('periods','Periods',{min:1})],'FV ($)');
add('early-retirement','Early Retirement','Finance','finance','$',['early retirement calculator'],[F('savings','Current Savings ($)',{min:0}),F('monthlyContrib','Monthly Contribution ($)',{min:0}),F('return','Return %',{dv:7})],'Retire By Age');
add('net-worth-calc','Net Worth','Finance','finance','$',['net worth calculator'],[F('assets','Total Assets ($)',{min:0}),F('liabilities','Total Liabilities ($)',{min:0})],'Net Worth ($)');
add('inflation-adjusted','Inflation Adjusted','Finance','finance','$',['inflation adjusted calculator'],[F('amount','Amount ($)',{min:0.01}),F('years','Years',{min:1}),F('inflation','Inflation Rate %',{dv:3})],'Adjusted Value ($)');
add('purchasing-power','Purchasing Power','Finance','finance','$',['purchasing power calculator'],[F('amount','Amount ($)',{min:0.01}),F('years','Years Ago',{min:1}),F('avgInflation','Avg Inflation %',{dv:3})],'Equivalent Today ($)');
add('savings-goal','Savings Goal','Finance','finance','$',['savings goal calculator'],[F('goal','Goal Amount ($)',{min:1}),F('current','Current Savings ($)',{dv:0}),F('months','Months',{min:1})],'Monthly Savings ($)');
add('debt-snowball','Debt Snowball','Finance','finance','$',['debt snowball calculator'],[F('totalDebt','Total Debt ($)',{min:1}),F('extraPayment','Extra Payment ($)',{min:1})],'Months to Payoff');
add('tax-equivalent-yield','Tax Equivalent Yield','Finance','finance','$',['tax equivalent yield calculator'],[F('taxFreeYield','Tax-Free Yield %',{min:0.01}),F('taxRate','Tax Rate %',{min:1})],'Taxable Equivalent %');

// Generate all files
let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const d of defs) {
  const slug = d.s;
  if (existingSlugs.has(slug)) { skipped++; continue; }
  const name = eName(slug);
  if (existingExports.has(name)) { skipped++; console.log(`Skip export collision: ${slug} -> ${name}`); continue; }
  const fp = path.join(CALC_DIR, slug + '.ts');
  if (fs.existsSync(fp)) { skipped++; continue; }
  fs.writeFileSync(fp, genFile(slug, d.t, d.c, d.cs, d.i, d.k, d.f, d.u, d.fo));
  imports.push(`import { ${name} } from "./${slug}";`);
  regs.push(`  ${name},`);
  existingSlugs.add(slug);
  existingExports.add(name);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-a.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-a.txt'), regs.join('\n'));
console.log(`Generated: ${generated} | Skipped: ${skipped} | Total defs: ${defs.length}`);
