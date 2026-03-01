add('ink-coverage-calculator', 'Ink Coverage Calculator',
  'Estimate print ink coverage and cartridge life.',
  'Everyday', 'everyday', '~',
  ['ink coverage', 'print ink estimator'],
  [
    '{ name: "pageCount", label: "Page Count", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "coverage", label: "Coverage (%)", type: "number", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "cartridgeYield", label: "Cartridge Yield (pages)", type: "number", min: 1, max: 50000, defaultValue: 2500 }',
  ],
  `(inputs) => {
      const pages = inputs.pageCount as number;
      const cov = inputs.coverage as number;
      const yield_ = inputs.cartridgeYield as number;
      if (!pages || !cov || !yield_) return null;
      const adjustedYield = Math.round(yield_ * (5 / cov));
      const cartridgesNeeded = Math.ceil(pages / adjustedYield);
      const pagesRemaining = adjustedYield * cartridgesNeeded - pages;
      return {
        primary: { label: "Cartridges Needed", value: String(cartridgesNeeded) },
        details: [
          { label: "Adjusted Yield Per Cartridge", value: formatNumber(adjustedYield) + " pages" },
          { label: "Pages Remaining", value: formatNumber(pagesRemaining) },
          { label: "Coverage Factor", value: (cov / 5).toFixed(1) + "x" },
        ],
      };
  }`,
  [{ q: 'What is standard ink coverage?', a: 'Standard ink coverage is about 5% of the page area.' },
   { q: 'Does color printing use more ink?', a: 'Yes. Color printing uses multiple cartridges and more total ink.' }],
  'Adjusted Yield = Rated Yield x (5 / Coverage%)',
  []
);

add('paper-weight-converter-calculator', 'Paper Weight Converter Calculator',
  'Convert paper weight from GSM to US bond weight.',
  'Conversion', 'conversion', 'R',
  ['gsm to bond', 'paper weight conversion'],
  [
    '{ name: "gsm", label: "GSM (g/m²)", type: "number", min: 1, max: 600, defaultValue: 80 }',
  ],
  `(inputs) => {
      const gsm = inputs.gsm as number;
      if (!gsm) return null;
      const bond = Math.round(gsm * 0.2661 * 100) / 100;
      const cover = Math.round(gsm * 0.3697 * 100) / 100;
      const category = gsm <= 90 ? "Light / Copy paper" : gsm <= 170 ? "Medium / Brochure" : "Heavy / Card stock";
      return {
        primary: { label: "US Bond Weight", value: bond.toFixed(1) + " lb" },
        details: [
          { label: "Cover Weight", value: cover.toFixed(1) + " lb" },
          { label: "Category", value: category },
          { label: "GSM", value: formatNumber(gsm) + " g/m²" },
        ],
      };
  }`,
  [{ q: 'What is GSM?', a: 'GSM is grams per square meter, the international paper weight standard.' },
   { q: 'What GSM is standard copy paper?', a: 'Standard copy paper is typically 75 to 80 GSM.' }],
  'Bond Weight = GSM x 0.2661',
  []
);

add('bleed-margin-calculator', 'Bleed Margin Calculator',
  'Calculate print document size with bleed margins.',
  'Everyday', 'everyday', '~',
  ['print bleed', 'bleed margin calculator'],
  [
    '{ name: "docWidth", label: "Document Width (in)", type: "number", min: 0.5, max: 100, defaultValue: 8.5 }',
    '{ name: "docHeight", label: "Document Height (in)", type: "number", min: 0.5, max: 100, defaultValue: 11 }',
    '{ name: "bleed", label: "Bleed (in)", type: "number", min: 0.0625, max: 2, defaultValue: 0.125 }',
  ],
  `(inputs) => {
      const w = inputs.docWidth as number;
      const h = inputs.docHeight as number;
      const b = inputs.bleed as number;
      if (!w || !h || !b) return null;
      const totalW = Math.round((w + 2 * b) * 1000) / 1000;
      const totalH = Math.round((h + 2 * b) * 1000) / 1000;
      const safeW = Math.round((w - 2 * b) * 1000) / 1000;
      const safeH = Math.round((h - 2 * b) * 1000) / 1000;
      return {
        primary: { label: "Total Size With Bleed", value: totalW + " x " + totalH + " in" },
        details: [
          { label: "Safe Area", value: safeW + " x " + safeH + " in" },
          { label: "Bleed Per Side", value: b + " in" },
          { label: "Total Bleed Added", value: (2 * b) + " in each axis" },
        ],
      };
  }`,
  [{ q: 'What is a standard bleed size?', a: '0.125 inches (1/8 inch) is the standard bleed for most printers.' },
   { q: 'Why is bleed needed?', a: 'Bleed prevents white edges after trimming printed documents.' }],
  'Total Size = Document Size + (2 x Bleed)',
  []
);

add('color-contrast-ratio-calculator', 'Color Contrast Ratio Calculator',
  'Calculate WCAG color contrast ratio from luminance.',
  'Science', 'science', 'A',
  ['wcag contrast', 'color contrast ratio'],
  [
    '{ name: "fgLuminance", label: "Foreground Luminance (0-1)", type: "number", min: 0, max: 1, defaultValue: 0.05 }',
    '{ name: "bgLuminance", label: "Background Luminance (0-1)", type: "number", min: 0, max: 1, defaultValue: 1 }',
  ],
  `(inputs) => {
      const fg = inputs.fgLuminance as number;
      const bg = inputs.bgLuminance as number;
      if (fg === undefined || bg === undefined) return null;
      const lighter = Math.max(fg, bg);
      const darker = Math.min(fg, bg);
      const ratio = Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
      const aaLarge = ratio >= 3 ? "Pass" : "Fail";
      const aaNormal = ratio >= 4.5 ? "Pass" : "Fail";
      const aaaNormal = ratio >= 7 ? "Pass" : "Fail";
      return {
        primary: { label: "Contrast Ratio", value: ratio + ":1" },
        details: [
          { label: "WCAG AA (normal text)", value: aaNormal },
          { label: "WCAG AA (large text)", value: aaLarge },
          { label: "WCAG AAA (normal text)", value: aaaNormal },
        ],
      };
  }`,
  [{ q: 'What contrast ratio is needed for WCAG AA?', a: '4.5:1 for normal text and 3:1 for large text.' },
   { q: 'What is relative luminance?', a: 'A measure of light intensity from 0 (black) to 1 (white).' }],
  'Ratio = (L1 + 0.05) / (L2 + 0.05)',
  []
);

add('dpi-calculator', 'DPI Calculator',
  'Calculate dots per inch from print dimensions.',
  'Conversion', 'conversion', 'R',
  ['dpi calculator', 'print dpi'],
  [
    '{ name: "widthPx", label: "Width (pixels)", type: "number", min: 1, max: 50000, defaultValue: 3000 }',
    '{ name: "printWidth", label: "Print Width (in)", type: "number", min: 0.5, max: 100, defaultValue: 10 }',
  ],
  `(inputs) => {
      const px = inputs.widthPx as number;
      const pw = inputs.printWidth as number;
      if (!px || !pw) return null;
      const dpi = Math.round(px / pw);
      return {
        primary: { label: "DPI", value: String(dpi) },
        details: [
          { label: "Quality", value: dpi >= 300 ? "Print quality" : dpi >= 150 ? "Acceptable" : "Low resolution" },
          { label: "Width", value: formatNumber(px) + " px" },
          { label: "Print Width", value: pw + " in" },
        ],
      };
  }`,
  [{ q: 'What DPI is needed for printing?', a: '300 DPI is standard for high quality prints.' },
   { q: 'What DPI is used for web images?', a: '72 DPI is the standard resolution for web display.' }],
  'DPI = Pixels / Print Size (inches)',
  []
);

add('led-resistor-calculator', 'LED Resistor Calculator',
  'Calculate the resistor value needed for an LED circuit.',
  'Science', 'science', 'A',
  ['led resistor', 'led resistor value'],
  [
    '{ name: "supplyVoltage", label: "Supply Voltage (V)", type: "number", min: 0.1, max: 240, defaultValue: 5 }',
    '{ name: "ledVoltage", label: "LED Forward Voltage (V)", type: "number", min: 0.1, max: 12, defaultValue: 2 }',
    '{ name: "ledCurrent", label: "LED Current (mA)", type: "number", min: 0.1, max: 1000, defaultValue: 20 }',
  ],
  `(inputs) => {
      const vs = inputs.supplyVoltage as number;
      const vf = inputs.ledVoltage as number;
      const i = inputs.ledCurrent as number;
      if (!vs || !vf || !i || vs <= vf) return null;
      const r = (vs - vf) / (i / 1000);
      const power = ((vs - vf) * (i / 1000)) * 1000;
      const standard = [10,22,33,47,68,100,150,220,330,470,680,1000,1500,2200,3300,4700];
      const nearest = standard.reduce((a, b) => Math.abs(b - r) < Math.abs(a - r) ? b : a);
      return {
        primary: { label: "Resistor Value", value: Math.round(r) + " ohms" },
        details: [
          { label: "Nearest Standard", value: nearest + " ohms" },
          { label: "Power Dissipated", value: Math.round(power) + " mW" },
          { label: "Voltage Drop", value: (vs - vf).toFixed(1) + " V" },
        ],
      };
  }`,
  [{ q: 'Why do LEDs need a resistor?', a: 'LEDs need a resistor to limit current and prevent burnout.' },
   { q: 'What is forward voltage?', a: 'The voltage drop across the LED when it is conducting current.' }],
  'R = (Vsupply - Vled) / I',
  []
);

add('battery-life-calculator', 'Battery Life Calculator',
  'Estimate battery runtime from capacity and load.',
  'Science', 'science', 'A',
  ['battery life', 'battery runtime calculator'],
  [
    '{ name: "capacity", label: "Battery Capacity (mAh)", type: "number", min: 1, max: 1000000, defaultValue: 3000 }',
    '{ name: "loadCurrent", label: "Load Current (mA)", type: "number", min: 0.1, max: 100000, defaultValue: 500 }',
  ],
  `(inputs) => {
      const cap = inputs.capacity as number;
      const load = inputs.loadCurrent as number;
      if (!cap || !load) return null;
      const hours = cap / load;
      const mins = Math.round(hours * 60);
      const days = Math.round(hours / 24 * 100) / 100;
      return {
        primary: { label: "Battery Life", value: hours.toFixed(1) + " hours" },
        details: [
          { label: "Minutes", value: formatNumber(mins) },
          { label: "Days", value: String(days) },
          { label: "Efficiency Note", value: "Actual life is ~80% of ideal" },
        ],
      };
  }`,
  [{ q: 'What does mAh mean?', a: 'Milliamp-hours, a measure of battery charge capacity.' },
   { q: 'Why is actual battery life less?', a: 'Heat, voltage sag, and circuit inefficiency reduce actual runtime.' }],
  'Battery Life (hours) = Capacity (mAh) / Load (mA)',
  []
);

add('solar-battery-sizing-calculator', 'Solar Battery Sizing Calculator',
  'Size a solar battery bank for off-grid use.',
  'Science', 'science', 'A',
  ['solar battery size', 'battery bank calculator'],
  [
    '{ name: "dailyUsage", label: "Daily Usage (Wh)", type: "number", min: 1, max: 100000, defaultValue: 5000 }',
    '{ name: "autonomyDays", label: "Autonomy Days", type: "number", min: 1, max: 14, defaultValue: 2 }',
    '{ name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 6, max: 48, defaultValue: 12 }',
    '{ name: "depthOfDischarge", label: "Depth of Discharge (%)", type: "number", min: 10, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
      const daily = inputs.dailyUsage as number;
      const days = inputs.autonomyDays as number;
      const voltage = inputs.batteryVoltage as number;
      const dod = inputs.depthOfDischarge as number;
      if (!daily || !days || !voltage || !dod) return null;
      const totalWh = daily * days;
      const requiredWh = totalWh / (dod / 100);
      const ah = Math.round(requiredWh / voltage);
      return {
        primary: { label: "Battery Bank Size", value: formatNumber(ah) + " Ah" },
        details: [
          { label: "Total Energy Needed", value: formatNumber(totalWh) + " Wh" },
          { label: "Required Capacity (Wh)", value: formatNumber(Math.round(requiredWh)) },
          { label: "System Voltage", value: voltage + " V" },
        ],
      };
  }`,
  [{ q: 'What is depth of discharge?', a: 'The percentage of battery capacity that is used before recharging.' },
   { q: 'How many autonomy days should I plan?', a: 'Two to three days is typical for most residential solar setups.' }],
  'Ah = (Daily Wh x Autonomy Days) / (DoD x Voltage)',
  []
);

add('voltage-divider-calculator', 'Voltage Divider Calculator',
  'Calculate output voltage of a resistive divider.',
  'Science', 'science', 'A',
  ['voltage divider', 'resistor voltage divider'],
  [
    '{ name: "inputVoltage", label: "Input Voltage (V)", type: "number", min: 0.1, max: 1000, defaultValue: 12 }',
    '{ name: "r1", label: "R1 (ohms)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "r2", label: "R2 (ohms)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
  ],
  `(inputs) => {
      const vin = inputs.inputVoltage as number;
      const r1 = inputs.r1 as number;
      const r2 = inputs.r2 as number;
      if (!vin || !r1 || !r2) return null;
      const vout = vin * (r2 / (r1 + r2));
      const current = vin / (r1 + r2) * 1000;
      const ratio = r2 / (r1 + r2);
      return {
        primary: { label: "Output Voltage", value: vout.toFixed(3) + " V" },
        details: [
          { label: "Divider Ratio", value: ratio.toFixed(4) },
          { label: "Current Through Divider", value: current.toFixed(3) + " mA" },
          { label: "Power in R1", value: ((vin - vout) * current / 1000).toFixed(3) + " W" },
        ],
      };
  }`,
  [{ q: 'What is a voltage divider?', a: 'Two resistors in series that produce a lower output voltage.' },
   { q: 'Can a voltage divider power a load?', a: 'Not efficiently. It is best for signal level shifting only.' }],
  'Vout = Vin x R2 / (R1 + R2)',
  []
);

add('capacitor-charge-calculator', 'Capacitor Charge Calculator',
  'Calculate RC circuit charge time to a target level.',
  'Science', 'science', 'A',
  ['rc charge time', 'capacitor charge calculator'],
  [
    '{ name: "resistance", label: "Resistance (ohms)", type: "number", min: 1, max: 100000000, defaultValue: 10000 }',
    '{ name: "capacitance", label: "Capacitance (uF)", type: "number", min: 0.001, max: 1000000, defaultValue: 100 }',
    '{ name: "targetPercent", label: "Target Charge (%)", type: "number", min: 1, max: 99, defaultValue: 63 }',
  ],
  `(inputs) => {
      const r = inputs.resistance as number;
      const c = inputs.capacitance as number;
      const target = inputs.targetPercent as number;
      if (!r || !c || !target) return null;
      const tau = r * (c / 1000000);
      const time = -tau * Math.log(1 - target / 100);
      const timeConst5 = 5 * tau;
      return {
        primary: { label: "Charge Time", value: (time * 1000).toFixed(2) + " ms" },
        details: [
          { label: "Time Constant (tau)", value: (tau * 1000).toFixed(3) + " ms" },
          { label: "Full Charge (5 tau)", value: (timeConst5 * 1000).toFixed(2) + " ms" },
          { label: "Target", value: target + "%" },
        ],
      };
  }`,
  [{ q: 'What is a time constant?', a: 'Tau = R x C. It is the time to reach 63.2% charge.' },
   { q: 'How long to fully charge a capacitor?', a: 'About 5 time constants to reach 99.3% of full charge.' }],
  'Time = -R x C x ln(1 - target%)',
  []
);

add('profit-margin-per-unit-calculator', 'Profit Margin Per Unit Calculator',
  'Calculate per-unit profit margin from price and cost.',
  'Finance', 'finance', '$',
  ['per unit profit', 'unit profit margin'],
  [
    '{ name: "sellingPrice", label: "Selling Price ($)", type: "number", min: 0.01, max: 1000000, defaultValue: 25 }',
    '{ name: "costPrice", label: "Cost Price ($)", type: "number", min: 0.01, max: 1000000, defaultValue: 10 }',
    '{ name: "quantity", label: "Quantity", type: "number", min: 1, max: 10000000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const sell = inputs.sellingPrice as number;
      const cost = inputs.costPrice as number;
      const qty = inputs.quantity as number;
      if (!sell || !cost || !qty) return null;
      const profitPerUnit = sell - cost;
      const marginPct = (profitPerUnit / sell) * 100;
      const totalProfit = profitPerUnit * qty;
      return {
        primary: { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profitPerUnit * 100) / 100) },
        details: [
          { label: "Margin", value: marginPct.toFixed(1) + "%" },
          { label: "Total Profit", value: "$" + formatNumber(Math.round(totalProfit * 100) / 100) },
          { label: "Total Revenue", value: "$" + formatNumber(Math.round(sell * qty * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'What is a good profit margin?', a: 'It varies by industry but 10-20% net margin is generally healthy.' },
   { q: 'Is markup the same as margin?', a: 'No. Markup is based on cost, margin is based on selling price.' }],
  'Profit Per Unit = Selling Price - Cost Price',
  []
);

add('shipping-cost-estimator-calculator', 'Shipping Cost Estimator Calculator',
  'Estimate shipping cost from weight and dimensions.',
  'Everyday', 'everyday', '~',
  ['shipping cost', 'shipping estimator'],
  [
    '{ name: "weight", label: "Weight (lbs)", type: "number", min: 0.1, max: 2000, defaultValue: 5 }',
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 200, defaultValue: 12 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 200, defaultValue: 8 }',
  ],
  `(inputs) => {
      const wt = inputs.weight as number;
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!wt || !l || !w || !h) return null;
      const dimWeight = Math.round((l * w * h) / 139 * 100) / 100;
      const billable = Math.max(wt, dimWeight);
      const cost = Math.round(billable * 1.5 * 100) / 100;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(cost) },
        details: [
          { label: "Actual Weight", value: wt + " lbs" },
          { label: "Dimensional Weight", value: dimWeight + " lbs" },
          { label: "Billable Weight", value: billable + " lbs" },
        ],
      };
  }`,
  [{ q: 'What is dimensional weight?', a: 'A pricing method using package volume instead of actual weight.' },
   { q: 'Why is my shipping cost higher than expected?', a: 'Carriers charge the greater of actual weight or dimensional weight.' }],
  'DIM Weight = (L x W x H) / 139; Cost = Billable Weight x Rate',
  []
);

add('hourly-to-salary-calculator', 'Hourly to Salary Calculator',
  'Convert hourly wage to annual salary.',
  'Finance', 'finance', '$',
  ['hourly to salary', 'hourly wage to annual'],
  [
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 0.01, max: 10000, defaultValue: 25 }',
    '{ name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 1, max: 168, defaultValue: 40 }',
    '{ name: "weeksPerYear", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 52 }',
  ],
  `(inputs) => {
      const rate = inputs.hourlyRate as number;
      const hpw = inputs.hoursPerWeek as number;
      const wpy = inputs.weeksPerYear as number;
      if (!rate || !hpw || !wpy) return null;
      const annual = rate * hpw * wpy;
      const monthly = annual / 12;
      const biweekly = rate * hpw * 2;
      return {
        primary: { label: "Annual Salary", value: "$" + formatNumber(Math.round(annual)) },
        details: [
          { label: "Monthly Income", value: "$" + formatNumber(Math.round(monthly)) },
          { label: "Biweekly Pay", value: "$" + formatNumber(Math.round(biweekly)) },
          { label: "Weekly Pay", value: "$" + formatNumber(Math.round(rate * hpw)) },
        ],
      };
  }`,
  [{ q: 'How many work hours in a year?', a: '2,080 hours based on 40 hours per week for 52 weeks.' },
   { q: 'Should I include overtime?', a: 'Use your average weekly hours including overtime if consistent.' }],
  'Annual Salary = Hourly Rate x Hours/Week x Weeks/Year',
  []
);

add('business-loan-payment-calculator', 'Business Loan Payment Calculator',
  'Calculate monthly payment for a business loan.',
  'Finance', 'finance', '$',
  ['business loan payment', 'loan payment calculator'],
  [
    '{ name: "loanAmount", label: "Loan Amount ($)", type: "number", min: 1, max: 100000000, defaultValue: 50000 }',
    '{ name: "annualRate", label: "Annual Interest Rate (%)", type: "number", min: 0.1, max: 50, defaultValue: 7 }',
    '{ name: "termMonths", label: "Term (months)", type: "number", min: 1, max: 600, defaultValue: 60 }',
  ],
  `(inputs) => {
      const p = inputs.loanAmount as number;
      const r = inputs.annualRate as number;
      const n = inputs.termMonths as number;
      if (!p || !r || !n) return null;
      const mr = r / 100 / 12;
      const payment = p * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
      const totalPaid = payment * n;
      const totalInterest = totalPaid - p;
      return {
        primary: { label: "Monthly Payment", value: "$" + formatNumber(Math.round(payment * 100) / 100) },
        details: [
          { label: "Total Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
          { label: "Total Interest", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Interest to Principal Ratio", value: (totalInterest / p * 100).toFixed(1) + "%" },
        ],
      };
  }`,
  [{ q: 'What is a typical business loan rate?', a: 'Rates range from 5% to 30% depending on credit and loan type.' },
   { q: 'How does term length affect payments?', a: 'Longer terms lower monthly payments but increase total interest.' }],
  'Payment = P x r(1+r)^n / ((1+r)^n - 1)',
  []
);

add('sales-tax-reverse-calculator', 'Sales Tax Reverse Calculator',
  'Find the pre-tax price from a tax-inclusive total.',
  'Finance', 'finance', '$',
  ['reverse sales tax', 'pre-tax price calculator'],
  [
    '{ name: "totalAmount", label: "Total Amount ($)", type: "number", min: 0.01, max: 100000000, defaultValue: 107.50 }',
    '{ name: "taxRate", label: "Tax Rate (%)", type: "number", min: 0.01, max: 100, defaultValue: 7.5 }',
  ],
  `(inputs) => {
      const total = inputs.totalAmount as number;
      const rate = inputs.taxRate as number;
      if (!total || !rate) return null;
      const preTax = Math.round(total / (1 + rate / 100) * 100) / 100;
      const taxAmount = Math.round((total - preTax) * 100) / 100;
      return {
        primary: { label: "Pre-Tax Price", value: "$" + formatNumber(preTax) },
        details: [
          { label: "Tax Amount", value: "$" + formatNumber(taxAmount) },
          { label: "Tax Rate", value: rate + "%" },
          { label: "Total Paid", value: "$" + formatNumber(total) },
        ],
      };
  }`,
  [{ q: 'How do I reverse-calculate sales tax?', a: 'Divide the total by (1 + tax rate as a decimal).' },
   { q: 'Is sales tax included in the listed price?', a: 'In the US, sales tax is usually added at checkout, not included.' }],
  'Pre-Tax = Total / (1 + Tax Rate / 100)',
  []
);

add('wallpaper-calculator', 'Wallpaper Calculator',
  'Calculate the number of wallpaper rolls needed.',
  'Everyday', 'everyday', '~',
  ['wallpaper rolls', 'wallpaper calculator'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 200, defaultValue: 12 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 4, max: 30, defaultValue: 8 }',
    '{ name: "rollLength", label: "Roll Length (ft)", type: "number", min: 10, max: 100, defaultValue: 33 }',
  ],
  `(inputs) => {
      const l = inputs.roomLength as number;
      const w = inputs.roomWidth as number;
      const ch = inputs.ceilingHeight as number;
      const rl = inputs.rollLength as number;
      if (!l || !w || !ch || !rl) return null;
      const perimeter = 2 * (l + w);
      const wallArea = perimeter * ch;
      const rollWidth = 1.75;
      const rollCoverage = rl * rollWidth;
      const rolls = Math.ceil(wallArea / rollCoverage * 1.1);
      return {
        primary: { label: "Rolls Needed", value: String(rolls) },
        details: [
          { label: "Wall Area", value: formatNumber(Math.round(wallArea)) + " sq ft" },
          { label: "Perimeter", value: formatNumber(perimeter) + " ft" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  }`,
  [{ q: 'How much extra wallpaper should I buy?', a: 'Add 10-15% for pattern matching and waste.' },
   { q: 'What is the standard wallpaper roll width?', a: 'Standard rolls are 20.5 or 27 inches wide.' }],
  'Rolls = Wall Area / Roll Coverage x 1.1',
  []
);

add('fence-material-calculator', 'Fence Material Calculator',
  'Calculate fence posts and boards needed.',
  'Everyday', 'everyday', '~',
  ['fence calculator', 'fence material estimator'],
  [
    '{ name: "fenceLength", label: "Fence Length (ft)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "fenceHeight", label: "Fence Height (ft)", type: "number", min: 2, max: 12, defaultValue: 6 }',
    '{ name: "postSpacing", label: "Post Spacing (ft)", type: "number", min: 4, max: 12, defaultValue: 8 }',
  ],
  `(inputs) => {
      const len = inputs.fenceLength as number;
      const ht = inputs.fenceHeight as number;
      const sp = inputs.postSpacing as number;
      if (!len || !ht || !sp) return null;
      const posts = Math.ceil(len / sp) + 1;
      const sections = posts - 1;
      const boardsPerSection = Math.ceil(sp * 12 / 5.5);
      const totalBoards = boardsPerSection * sections;
      const rails = sections * (ht > 4 ? 3 : 2);
      return {
        primary: { label: "Posts Needed", value: String(posts) },
        details: [
          { label: "Fence Boards", value: formatNumber(totalBoards) },
          { label: "Rails", value: formatNumber(rails) },
          { label: "Sections", value: String(sections) },
        ],
      };
  }`,
  [{ q: 'How deep should fence posts be set?', a: 'Set posts at least one-third of their length underground.' },
   { q: 'What is standard fence post spacing?', a: '6 to 8 feet is standard for most residential fences.' }],
  'Posts = (Length / Spacing) + 1',
  []
);

add('gutter-downspout-calculator', 'Gutter Downspout Calculator',
  'Size gutters and downspouts for your roof.',
  'Everyday', 'everyday', '~',
  ['gutter sizing', 'downspout calculator'],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 50, max: 100000, defaultValue: 1500 }',
    '{ name: "rainfall", label: "Rainfall Intensity (in/hr)", type: "number", min: 0.5, max: 15, defaultValue: 4 }',
  ],
  `(inputs) => {
      const area = inputs.roofArea as number;
      const rain = inputs.rainfall as number;
      if (!area || !rain) return null;
      const flowRate = area * rain * 0.0104;
      const gutterSize = flowRate <= 5.5 ? "5-inch K-style" : "6-inch K-style";
      const downspouts = Math.max(1, Math.ceil(area / 600));
      const dsSize = flowRate / downspouts <= 5 ? "2x3 inch" : "3x4 inch";
      return {
        primary: { label: "Gutter Size", value: gutterSize },
        details: [
          { label: "Flow Rate", value: flowRate.toFixed(1) + " gal/min" },
          { label: "Downspouts Needed", value: String(downspouts) },
          { label: "Downspout Size", value: dsSize },
        ],
      };
  }`,
  [{ q: 'How many downspouts do I need?', a: 'One downspout per 600 square feet of roof area is typical.' },
   { q: 'What gutter size is most common?', a: '5-inch K-style gutters are the most common for residential use.' }],
  'Flow Rate = Roof Area x Rainfall x 0.0104',
  []
);

add('ceiling-fan-size-calculator', 'Ceiling Fan Size Calculator',
  'Find the right ceiling fan size for your room.',
  'Everyday', 'everyday', '~',
  ['ceiling fan size', 'fan size calculator'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 3, max: 100, defaultValue: 14 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 3, max: 100, defaultValue: 12 }',
  ],
  `(inputs) => {
      const l = inputs.roomLength as number;
      const w = inputs.roomWidth as number;
      if (!l || !w) return null;
      const area = l * w;
      let fanSize = "";
      if (area <= 75) fanSize = "29-36 inches";
      else if (area <= 144) fanSize = "36-42 inches";
      else if (area <= 225) fanSize = "44-50 inches";
      else if (area <= 400) fanSize = "50-54 inches";
      else fanSize = "54-72 inches or two fans";
      return {
        primary: { label: "Recommended Fan Size", value: fanSize },
        details: [
          { label: "Room Area", value: formatNumber(area) + " sq ft" },
          { label: "Room Dimensions", value: l + " x " + w + " ft" },
          { label: "Fans Needed", value: area > 400 ? "Consider 2 fans" : "1 fan" },
        ],
      };
  }`,
  [{ q: 'How high should a ceiling fan hang?', a: 'At least 7 feet from the floor and 8-10 inches from the ceiling.' },
   { q: 'Does fan size affect airflow?', a: 'Yes. Larger fans move more air at lower speeds for greater comfort.' }],
  'Fan size based on room area in square feet',
  []
);

add('blood-pressure-risk-calculator', 'Blood Pressure Risk Calculator',
  'Estimate cardiovascular risk from blood pressure.',
  'Health', 'health', 'H',
  ['blood pressure risk', 'cv risk calculator'],
  [
    '{ name: "systolic", label: "Systolic (mmHg)", type: "number", min: 70, max: 250, defaultValue: 120 }',
    '{ name: "diastolic", label: "Diastolic (mmHg)", type: "number", min: 40, max: 150, defaultValue: 80 }',
    '{ name: "age", label: "Age", type: "number", min: 18, max: 120, defaultValue: 45 }',
    '{ name: "smoker", label: "Smoker", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }], defaultValue: 0 }',
  ],
  `(inputs) => {
      const sys = inputs.systolic as number;
      const dia = inputs.diastolic as number;
      const age = inputs.age as number;
      const smoker = inputs.smoker as number;
      if (!sys || !dia || !age) return null;
      let category = "";
      if (sys < 120 && dia < 80) category = "Normal";
      else if (sys < 130 && dia < 80) category = "Elevated";
      else if (sys < 140 || dia < 90) category = "Stage 1 Hypertension";
      else if (sys >= 140 || dia >= 90) category = "Stage 2 Hypertension";
      else category = "Unknown";
      const ageFactor = age > 55 ? 1.5 : 1.0;
      const smokeFactor = smoker === 1 ? 1.5 : 1.0;
      const riskScore = Math.min(100, Math.round(((sys - 90) / 1.6) * ageFactor * smokeFactor) / 10);
      const riskLevel = riskScore < 3 ? "Low" : riskScore < 6 ? "Moderate" : "High";
      return {
        primary: { label: "BP Category", value: category },
        details: [
          { label: "Risk Score", value: riskScore.toFixed(1) + " / 10" },
          { label: "Risk Level", value: riskLevel },
          { label: "MAP", value: Math.round(dia + (sys - dia) / 3) + " mmHg" },
        ],
      };
  }`,
  [{ q: 'What is normal blood pressure?', a: 'Normal blood pressure is below 120/80 mmHg.' },
   { q: 'Does smoking affect blood pressure?', a: 'Yes. Smoking raises blood pressure and increases cardiovascular risk.' }],
  'BP Category based on AHA guidelines; MAP = DBP + (SBP - DBP) / 3',
  []
);

add('creatinine-clearance-calculator', 'Creatinine Clearance Calculator',
  'Estimate kidney function with Cockcroft-Gault.',
  'Health', 'health', 'H',
  ['creatinine clearance', 'cockcroft gault calculator'],
  [
    '{ name: "age", label: "Age", type: "number", min: 18, max: 120, defaultValue: 50 }',
    '{ name: "weight", label: "Weight (kg)", type: "number", min: 20, max: 300, defaultValue: 70 }',
    '{ name: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", min: 0.1, max: 30, defaultValue: 1.0 }',
    '{ name: "gender", label: "Gender", type: "select", options: [{ value: 1, label: "Male" }, { value: 2, label: "Female" }], defaultValue: 1 }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const wt = inputs.weight as number;
      const cr = inputs.creatinine as number;
      const gender = inputs.gender as number;
      if (!age || !wt || !cr) return null;
      let crcl = ((140 - age) * wt) / (72 * cr);
      if (gender === 2) crcl *= 0.85;
      crcl = Math.round(crcl * 10) / 10;
      const stage = crcl >= 90 ? "Normal" : crcl >= 60 ? "Mild decrease" : crcl >= 30 ? "Moderate decrease" : crcl >= 15 ? "Severe decrease" : "Kidney failure";
      return {
        primary: { label: "CrCl", value: crcl + " mL/min" },
        details: [
          { label: "Kidney Function", value: stage },
          { label: "Gender Factor", value: gender === 2 ? "0.85 (female)" : "1.0 (male)" },
          { label: "Formula", value: "Cockcroft-Gault" },
        ],
      };
  }`,
  [{ q: 'What is creatinine clearance?', a: 'A measure of how well the kidneys filter creatinine from the blood.' },
   { q: 'What is a normal creatinine clearance?', a: 'Normal is approximately 90-120 mL/min for healthy adults.' }],
  'CrCl = ((140 - Age) x Weight) / (72 x Creatinine) x GenderFactor',
  []
);

add('anion-gap-calculator', 'Anion Gap Calculator',
  'Calculate serum anion gap from electrolytes.',
  'Health', 'health', 'H',
  ['anion gap', 'anion gap calculator'],
  [
    '{ name: "sodium", label: "Sodium (mEq/L)", type: "number", min: 100, max: 200, defaultValue: 140 }',
    '{ name: "chloride", label: "Chloride (mEq/L)", type: "number", min: 70, max: 140, defaultValue: 104 }',
    '{ name: "bicarbonate", label: "Bicarbonate (mEq/L)", type: "number", min: 5, max: 50, defaultValue: 24 }',
  ],
  `(inputs) => {
      const na = inputs.sodium as number;
      const cl = inputs.chloride as number;
      const hco3 = inputs.bicarbonate as number;
      if (!na || !cl || !hco3) return null;
      const ag = na - (cl + hco3);
      const status = ag > 12 ? "Elevated" : ag < 3 ? "Low" : "Normal";
      return {
        primary: { label: "Anion Gap", value: ag + " mEq/L" },
        details: [
          { label: "Status", value: status },
          { label: "Normal Range", value: "3-12 mEq/L" },
          { label: "Formula", value: "Na - (Cl + HCO3)" },
        ],
      };
  }`,
  [{ q: 'What is the normal anion gap?', a: 'The normal anion gap is 3 to 12 mEq/L.' },
   { q: 'What causes a high anion gap?', a: 'Common causes include ketoacidosis, lactic acidosis, and toxins.' }],
  'Anion Gap = Na - (Cl + HCO3)',
  []
);

add('parkland-formula-calculator', 'Parkland Formula Calculator',
  'Calculate burn fluid resuscitation volume.',
  'Health', 'health', 'H',
  ['parkland formula', 'burn resuscitation calculator'],
  [
    '{ name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 300, defaultValue: 70 }',
    '{ name: "burnPercentTBSA", label: "Burn % TBSA", type: "number", min: 1, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
      const wt = inputs.bodyWeight as number;
      const tbsa = inputs.burnPercentTBSA as number;
      if (!wt || !tbsa) return null;
      const total24 = 4 * wt * tbsa;
      const first8 = Math.round(total24 / 2);
      const next16 = total24 - first8;
      const hourlyFirst8 = Math.round(first8 / 8);
      const hourlyNext16 = Math.round(next16 / 16);
      return {
        primary: { label: "Total 24h Fluid", value: formatNumber(total24) + " mL" },
        details: [
          { label: "First 8 Hours", value: formatNumber(first8) + " mL" },
          { label: "Rate (first 8h)", value: formatNumber(hourlyFirst8) + " mL/hr" },
          { label: "Rate (next 16h)", value: formatNumber(hourlyNext16) + " mL/hr" },
        ],
      };
  }`,
  [{ q: 'What is the Parkland formula?', a: '4 mL x body weight (kg) x burn % TBSA for 24-hour fluid volume.' },
   { q: 'How is the fluid distributed?', a: 'Half in the first 8 hours, the remaining half over the next 16 hours.' }],
  'Fluid (mL) = 4 x Weight (kg) x %TBSA',
  []
);

add('rebar-spacing-calculator', 'Rebar Spacing Calculator',
  'Calculate rebar pieces needed for a concrete slab.',
  'Everyday', 'everyday', '~',
  ['rebar spacing', 'rebar calculator'],
  [
    '{ name: "slabLength", label: "Slab Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "slabWidth", label: "Slab Width (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "spacing", label: "Rebar Spacing (in)", type: "number", min: 4, max: 36, defaultValue: 12 }',
  ],
  `(inputs) => {
      const l = inputs.slabLength as number;
      const w = inputs.slabWidth as number;
      const sp = inputs.spacing as number;
      if (!l || !w || !sp) return null;
      const spFt = sp / 12;
      const lengthBars = Math.ceil(w / spFt) + 1;
      const widthBars = Math.ceil(l / spFt) + 1;
      const totalBars = lengthBars + widthBars;
      const totalLinFt = lengthBars * l + widthBars * w;
      return {
        primary: { label: "Total Rebar Pieces", value: String(totalBars) },
        details: [
          { label: "Lengthwise Bars", value: String(lengthBars) },
          { label: "Widthwise Bars", value: String(widthBars) },
          { label: "Total Linear Feet", value: formatNumber(Math.round(totalLinFt)) },
        ],
      };
  }`,
  [{ q: 'What is standard rebar spacing?', a: '12 inches on center is common for residential slabs.' },
   { q: 'What size rebar for a slab?', a: 'Number 4 (1/2 inch) rebar is typical for residential concrete.' }],
  'Bars = (Slab Dimension / Spacing) + 1 in each direction',
  []
);

add('stair-stringer-calculator', 'Stair Stringer Calculator',
  'Calculate stair rise, run, and stringer length.',
  'Everyday', 'everyday', '~',
  ['stair stringer', 'stair calculator'],
  [
    '{ name: "totalRise", label: "Total Rise (in)", type: "number", min: 6, max: 240, defaultValue: 108 }',
    '{ name: "riserHeight", label: "Riser Height (in)", type: "number", min: 4, max: 10, defaultValue: 7.5 }',
  ],
  `(inputs) => {
      const rise = inputs.totalRise as number;
      const riser = inputs.riserHeight as number;
      if (!rise || !riser) return null;
      const steps = Math.round(rise / riser);
      const actualRiser = Math.round(rise / steps * 100) / 100;
      const tread = 10.5;
      const totalRun = (steps - 1) * tread;
      const stringerLen = Math.sqrt(rise * rise + totalRun * totalRun);
      return {
        primary: { label: "Number of Steps", value: String(steps) },
        details: [
          { label: "Actual Riser Height", value: actualRiser.toFixed(2) + " in" },
          { label: "Total Run", value: totalRun.toFixed(1) + " in" },
          { label: "Stringer Length", value: (stringerLen / 12).toFixed(1) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is the ideal riser height?', a: 'Building codes typically require risers between 7 and 7.75 inches.' },
   { q: 'What is a standard tread depth?', a: 'A minimum of 10 inches is required by most building codes.' }],
  'Steps = Total Rise / Riser Height; Stringer = sqrt(Rise^2 + Run^2)',
  []
);
