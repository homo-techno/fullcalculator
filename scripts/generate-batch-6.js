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

// === BATCH 6: 50 CALCULATORS ===

// #1 Pet Food Cost Calculator
add('pet-food-cost-calculator', 'Pet Food Cost Calculator',
  'Estimate monthly pet food expenses based on weight and feeding.',
  'Finance', 'finance', '$',
  ['pet food cost', 'dog food budget'],
  [
    '{ name: "weight", label: "Pet Weight (lbs)", type: "number", min: 1, max: 200, defaultValue: 40 }',
    '{ name: "foodPricePerBag", label: "Price Per Bag ($)", type: "number", min: 1, max: 200, defaultValue: 45 }',
    '{ name: "bagSize", label: "Bag Size (lbs)", type: "number", min: 1, max: 50, defaultValue: 30 }',
    '{ name: "dailyFeeding", label: "Daily Feeding (cups)", type: "number", min: 0.25, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
      const weight = inputs.weight as number;
      const price = inputs.foodPricePerBag as number;
      const bagSize = inputs.bagSize as number;
      const cups = inputs.dailyFeeding as number;
      if (!weight || !price || !bagSize || !cups) return null;
      const lbsPerCup = 0.25;
      const dailyLbs = cups * lbsPerCup;
      const daysPerBag = bagSize / dailyLbs;
      const monthlyCost = (30 / daysPerBag) * price;
      const yearlyCost = monthlyCost * 12;
      return {
        primary: { label: "Monthly Food Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Days Per Bag", value: formatNumber(Math.round(daysPerBag)) },
          { label: "Daily Cost", value: "$" + formatNumber(Math.round((monthlyCost / 30) * 100) / 100) },
          { label: "Yearly Cost", value: "$" + formatNumber(Math.round(yearlyCost)) },
        ],
      };
  }`,
  [{ q: 'How much food does a dog need daily?', a: 'Most dogs need about 1 cup per 20 lbs of body weight per day.' },
   { q: 'Is expensive dog food worth it?', a: 'Higher quality food can reduce vet bills and improve health long term.' }],
  'Monthly Cost = (30 / Days Per Bag) x Price Per Bag',
  []
);

// #2 Pet Insurance Cost Calculator
add('pet-insurance-cost-calculator', 'Pet Insurance Cost Calculator',
  'Estimate monthly pet insurance premiums by age and breed size.',
  'Finance', 'finance', '$',
  ['pet insurance cost', 'dog insurance estimate'],
  [
    '{ name: "petAge", label: "Pet Age (years)", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "breed", label: "Breed Size", type: "select", options: [{ value: 1, label: "Small" }, { value: 2, label: "Medium" }, { value: 3, label: "Large" }], defaultValue: 2 }',
    '{ name: "coverageLevel", label: "Coverage Level", type: "select", options: [{ value: 1, label: "Basic" }, { value: 2, label: "Standard" }, { value: 3, label: "Premium" }], defaultValue: 2 }',
  ],
  `(inputs) => {
      const age = inputs.petAge as number;
      const breed = inputs.breed as number;
      const coverage = inputs.coverageLevel as number;
      if (!age) return null;
      const baseRate = 25;
      const breedMultiplier = breed === 1 ? 0.8 : breed === 2 ? 1.0 : 1.3;
      const coverageMultiplier = coverage === 1 ? 0.6 : coverage === 2 ? 1.0 : 1.5;
      const ageMultiplier = 1 + (age * 0.08);
      const monthly = baseRate * breedMultiplier * coverageMultiplier * ageMultiplier;
      const annual = monthly * 12;
      return {
        primary: { label: "Monthly Premium", value: "$" + formatNumber(Math.round(monthly * 100) / 100) },
        details: [
          { label: "Annual Premium", value: "$" + formatNumber(Math.round(annual)) },
          { label: "Age Factor", value: formatNumber(Math.round(ageMultiplier * 100) / 100) + "x" },
          { label: "Breed Factor", value: formatNumber(breedMultiplier) + "x" },
        ],
      };
  }`,
  [{ q: 'When should I get pet insurance?', a: 'Enroll when your pet is young for the lowest premiums.' },
   { q: 'Does pet insurance cover pre-existing conditions?', a: 'Most plans do not cover pre-existing conditions.' }],
  'Premium = Base Rate x Breed Factor x Coverage Factor x Age Factor',
  []
);

// #3 Dog Age Calculator
add('dog-age-calculator', 'Dog Age Calculator',
  'Convert dog years to human years based on size.',
  'Everyday', 'everyday', '~',
  ['dog age in human years', 'dog year calculator'],
  [
    '{ name: "dogAge", label: "Dog Age (years)", type: "number", min: 0.5, max: 25, defaultValue: 5 }',
    '{ name: "size", label: "Dog Size", type: "select", options: [{ value: 1, label: "Small (under 20 lbs)" }, { value: 2, label: "Medium (20-50 lbs)" }, { value: 3, label: "Large (over 50 lbs)" }], defaultValue: 2 }',
  ],
  `(inputs) => {
      const age = inputs.dogAge as number;
      const size = inputs.size as number;
      if (!age) return null;
      let humanAge;
      if (age <= 2) {
        humanAge = age * 12;
      } else {
        const rate = size === 1 ? 4 : size === 2 ? 5 : 6;
        humanAge = 24 + (age - 2) * rate;
      }
      const lifeExpectancy = size === 1 ? 15 : size === 2 ? 12 : 10;
      const remainingDog = Math.max(0, lifeExpectancy - age);
      return {
        primary: { label: "Human Years", value: formatNumber(Math.round(humanAge)) },
        details: [
          { label: "Dog Age", value: formatNumber(age) + " years" },
          { label: "Avg Life Expectancy", value: formatNumber(lifeExpectancy) + " years" },
          { label: "Est. Remaining Years", value: formatNumber(Math.round(remainingDog * 10) / 10) },
        ],
      };
  }`,
  [{ q: 'Is 1 dog year really 7 human years?', a: 'No. Dogs age faster early on. The rate varies by size.' },
   { q: 'Do small dogs live longer?', a: 'Yes, small breeds typically live 12 to 16 years on average.' }],
  'Human Years = 24 + (Dog Age - 2) x Size Rate (for dogs over 2)',
  []
);

// #4 Aquarium Volume Calculator
add('aquarium-volume-calculator', 'Aquarium Volume Calculator',
  'Calculate fish tank water volume from dimensions.',
  'Science', 'science', 'A',
  ['aquarium volume', 'fish tank gallons'],
  [
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 120, defaultValue: 24 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 60, defaultValue: 12 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 48, defaultValue: 16 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!l || !w || !h) return null;
      const cubicIn = l * w * h;
      const gallons = cubicIn / 231;
      const liters = gallons * 3.785;
      const waterWeightLbs = gallons * 8.34;
      return {
        primary: { label: "Volume", value: formatNumber(Math.round(gallons * 10) / 10) + " gallons" },
        details: [
          { label: "Liters", value: formatNumber(Math.round(liters * 10) / 10) },
          { label: "Cubic Inches", value: formatNumber(Math.round(cubicIn)) },
          { label: "Water Weight", value: formatNumber(Math.round(waterWeightLbs)) + " lbs" },
        ],
      };
  }`,
  [{ q: 'How many fish per gallon?', a: 'A common guideline is 1 inch of fish per gallon of water.' },
   { q: 'Should I fill the tank completely?', a: 'Leave about 1 inch of space at the top for gas exchange.' }],
  'Gallons = (Length x Width x Height) / 231',
  []
);

// #5 Pet Medication Dosage Calculator
add('pet-medication-dosage-calculator', 'Pet Medication Dosage Calculator',
  'Calculate pet medication dose based on weight.',
  'Health', 'health', 'H',
  ['pet medication dose', 'dog medicine dosage'],
  [
    '{ name: "petWeight", label: "Pet Weight (lbs)", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "dosePerKg", label: "Dose Per kg (mg)", type: "number", min: 0.1, max: 500, defaultValue: 10 }',
    '{ name: "frequency", label: "Doses Per Day", type: "number", min: 1, max: 4, defaultValue: 2 }',
  ],
  `(inputs) => {
      const weightLbs = inputs.petWeight as number;
      const dosePerKg = inputs.dosePerKg as number;
      const freq = inputs.frequency as number;
      if (!weightLbs || !dosePerKg || !freq) return null;
      const weightKg = weightLbs * 0.4536;
      const singleDose = weightKg * dosePerKg;
      const dailyDose = singleDose * freq;
      const weeklyDose = dailyDose * 7;
      return {
        primary: { label: "Single Dose", value: formatNumber(Math.round(singleDose * 10) / 10) + " mg" },
        details: [
          { label: "Weight (kg)", value: formatNumber(Math.round(weightKg * 10) / 10) },
          { label: "Daily Total", value: formatNumber(Math.round(dailyDose * 10) / 10) + " mg" },
          { label: "Weekly Total", value: formatNumber(Math.round(weeklyDose)) + " mg" },
        ],
      };
  }`,
  [{ q: 'Can I use human medicine for pets?', a: 'Never give pets human medicine without consulting a veterinarian.' },
   { q: 'How do I convert lbs to kg for dosing?', a: 'Divide the weight in pounds by 2.205 to get kilograms.' }],
  'Dose = Weight (kg) x Dose Per kg',
  []
);

// #6 BPM to Milliseconds Calculator
add('bpm-to-ms-calculator', 'BPM to Milliseconds Calculator',
  'Convert beats per minute to milliseconds for music production.',
  'Conversion', 'conversion', 'R',
  ['bpm to ms', 'tempo to milliseconds'],
  [
    '{ name: "bpm", label: "BPM", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "subdivision", label: "Note Subdivision", type: "select", options: [{ value: 1, label: "Quarter Note" }, { value: 2, label: "Eighth Note" }, { value: 4, label: "Sixteenth Note" }], defaultValue: 1 }',
  ],
  `(inputs) => {
      const bpm = inputs.bpm as number;
      const sub = inputs.subdivision as number;
      if (!bpm) return null;
      const quarterMs = 60000 / bpm;
      const noteMs = quarterMs / sub;
      const dottedMs = noteMs * 1.5;
      const tripletMs = noteMs * (2 / 3);
      return {
        primary: { label: "Note Duration", value: formatNumber(Math.round(noteMs * 100) / 100) + " ms" },
        details: [
          { label: "Quarter Note", value: formatNumber(Math.round(quarterMs * 100) / 100) + " ms" },
          { label: "Dotted Duration", value: formatNumber(Math.round(dottedMs * 100) / 100) + " ms" },
          { label: "Triplet Duration", value: formatNumber(Math.round(tripletMs * 100) / 100) + " ms" },
        ],
      };
  }`,
  [{ q: 'Why convert BPM to milliseconds?', a: 'Delay and reverb effects need time values in milliseconds.' },
   { q: 'What is a dotted note?', a: 'A dotted note is 1.5 times the duration of a regular note.' }],
  'Milliseconds = 60000 / BPM / Subdivision',
  []
);

// #7 Speaker Wire Gauge Calculator
add('speaker-wire-gauge-calculator', 'Speaker Wire Gauge Calculator',
  'Determine the right speaker wire gauge for your setup.',
  'Science', 'science', 'A',
  ['speaker wire gauge', 'speaker cable calculator'],
  [
    '{ name: "distance", label: "Distance (ft)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "impedance", label: "Speaker Impedance (ohms)", type: "number", min: 2, max: 16, defaultValue: 8 }',
    '{ name: "watts", label: "Amplifier Watts", type: "number", min: 1, max: 2000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const dist = inputs.distance as number;
      const imp = inputs.impedance as number;
      const watts = inputs.watts as number;
      if (!dist || !imp || !watts) return null;
      const totalLength = dist * 2;
      const maxResistance = imp * 0.05;
      const resistancePerFt16 = 0.00409;
      const resistancePerFt14 = 0.00257;
      const resistancePerFt12 = 0.00162;
      const r16 = totalLength * resistancePerFt16;
      const r14 = totalLength * resistancePerFt14;
      const r12 = totalLength * resistancePerFt12;
      let gauge = "16 AWG";
      if (r16 > maxResistance) gauge = "14 AWG";
      if (r14 > maxResistance) gauge = "12 AWG";
      const powerLoss = (r16 / (imp + r16)) * 100;
      return {
        primary: { label: "Recommended Gauge", value: gauge },
        details: [
          { label: "Total Wire Length", value: formatNumber(totalLength) + " ft" },
          { label: "Max Resistance", value: formatNumber(Math.round(maxResistance * 1000) / 1000) + " ohms" },
          { label: "Power Loss (16 AWG)", value: formatNumber(Math.round(powerLoss * 100) / 100) + "%" },
        ],
      };
  }`,
  [{ q: 'Does speaker wire gauge matter?', a: 'Yes. Thicker wire reduces signal loss over longer distances.' },
   { q: 'When should I use 12 AWG wire?', a: 'Use 12 AWG for runs over 50 feet or low impedance speakers.' }],
  'Recommended gauge based on 5% max impedance loss threshold',
  []
);

// #8 Room Acoustics Calculator
add('room-acoustics-calculator', 'Room Acoustics Calculator',
  'Estimate room reverb time using the Sabine equation.',
  'Science', 'science', 'A',
  ['room acoustics', 'reverb time calculator'],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 5, max: 200, defaultValue: 20 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 5, max: 200, defaultValue: 15 }',
    '{ name: "height", label: "Room Height (ft)", type: "number", min: 7, max: 30, defaultValue: 9 }',
    '{ name: "absorption", label: "Surface Type", type: "select", options: [{ value: 1, label: "Hard (tile/concrete)" }, { value: 2, label: "Medium (drywall)" }, { value: 3, label: "Soft (carpet/drapes)" }], defaultValue: 2 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      const absType = inputs.absorption as number;
      if (!l || !w || !h) return null;
      const volume = l * w * h;
      const surfaceArea = 2 * (l * w + l * h + w * h);
      const coeff = absType === 1 ? 0.05 : absType === 2 ? 0.15 : 0.35;
      const totalAbsorption = surfaceArea * coeff;
      const rt60 = (0.049 * volume) / totalAbsorption;
      return {
        primary: { label: "RT60 Reverb Time", value: formatNumber(Math.round(rt60 * 100) / 100) + " seconds" },
        details: [
          { label: "Room Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
          { label: "Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
          { label: "Total Absorption", value: formatNumber(Math.round(totalAbsorption)) + " sabins" },
        ],
      };
  }`,
  [{ q: 'What is RT60?', a: 'RT60 is the time it takes for sound to decay by 60 dB in a room.' },
   { q: 'What is a good RT60 for a studio?', a: 'Recording studios typically target 0.3 to 0.5 seconds of RT60.' }],
  'RT60 = 0.049 x Volume / Total Absorption (Sabine equation)',
  []
);

// #9 Audio File Size Calculator
add('audio-file-size-calculator', 'Audio File Size Calculator',
  'Estimate uncompressed audio file size from recording settings.',
  'Science', 'science', 'A',
  ['audio file size', 'wav file size calculator'],
  [
    '{ name: "duration", label: "Duration (minutes)", type: "number", min: 0.1, max: 600, defaultValue: 5 }',
    '{ name: "sampleRate", label: "Sample Rate (Hz)", type: "number", min: 8000, max: 192000, defaultValue: 44100 }',
    '{ name: "bitDepth", label: "Bit Depth", type: "number", min: 8, max: 32, defaultValue: 16 }',
    '{ name: "channels", label: "Channels", type: "number", min: 1, max: 8, defaultValue: 2 }',
  ],
  `(inputs) => {
      const dur = inputs.duration as number;
      const rate = inputs.sampleRate as number;
      const bits = inputs.bitDepth as number;
      const ch = inputs.channels as number;
      if (!dur || !rate || !bits || !ch) return null;
      const seconds = dur * 60;
      const bytes = seconds * rate * (bits / 8) * ch;
      const megabytes = bytes / (1024 * 1024);
      const gigabytes = megabytes / 1024;
      return {
        primary: { label: "File Size", value: formatNumber(Math.round(megabytes * 100) / 100) + " MB" },
        details: [
          { label: "Bytes", value: formatNumber(Math.round(bytes)) },
          { label: "Gigabytes", value: formatNumber(Math.round(gigabytes * 1000) / 1000) + " GB" },
          { label: "Bitrate", value: formatNumber(Math.round(rate * bits * ch / 1000)) + " kbps" },
        ],
      };
  }`,
  [{ q: 'How big is a 3-minute WAV file?', a: 'A stereo 44.1kHz 16-bit WAV is about 30 MB for 3 minutes.' },
   { q: 'Does higher sample rate improve quality?', a: '44.1kHz is sufficient for most audio. Higher rates help with editing.' }],
  'Size = Duration x Sample Rate x (Bit Depth / 8) x Channels',
  []
);

// #10 Music Royalty Calculator
add('music-royalty-calculator', 'Music Royalty Calculator',
  'Estimate streaming royalty earnings by platform.',
  'Finance', 'finance', '$',
  ['streaming royalties', 'spotify royalty calculator'],
  [
    '{ name: "streams", label: "Number of Streams", type: "number", min: 1, max: 100000000, defaultValue: 10000 }',
    '{ name: "platform", label: "Platform", type: "select", options: [{ value: 1, label: "Spotify" }, { value: 2, label: "Apple Music" }, { value: 3, label: "YouTube Music" }], defaultValue: 1 }',
  ],
  `(inputs) => {
      const streams = inputs.streams as number;
      const platform = inputs.platform as number;
      if (!streams) return null;
      const ratePerStream = platform === 1 ? 0.004 : platform === 2 ? 0.008 : 0.002;
      const gross = streams * ratePerStream;
      const distributorCut = gross * 0.15;
      const net = gross - distributorCut;
      const platformName = platform === 1 ? "Spotify" : platform === 2 ? "Apple Music" : "YouTube Music";
      return {
        primary: { label: "Estimated Earnings", value: "$" + formatNumber(Math.round(net * 100) / 100) },
        details: [
          { label: "Platform", value: platformName },
          { label: "Rate Per Stream", value: "$" + formatNumber(ratePerStream) },
          { label: "Gross Revenue", value: "$" + formatNumber(Math.round(gross * 100) / 100) },
          { label: "Distributor Fee (15%)", value: "$" + formatNumber(Math.round(distributorCut * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'How much does Spotify pay per stream?', a: 'Spotify pays roughly $0.003 to $0.005 per stream on average.' },
   { q: 'Which platform pays the most per stream?', a: 'Apple Music generally pays the highest per-stream rate.' }],
  'Earnings = Streams x Rate Per Stream x (1 - Distributor Fee)',
  []
);

// #11 Depth of Field Calculator
add('depth-of-field-calculator', 'Depth of Field Calculator',
  'Calculate depth of field from camera settings.',
  'Science', 'science', 'A',
  ['depth of field', 'dof calculator photography'],
  [
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 1, max: 1200, defaultValue: 50 }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 2.8 }',
    '{ name: "subjectDist", label: "Subject Distance (m)", type: "number", min: 0.1, max: 1000, defaultValue: 3 }',
    '{ name: "sensorSize", label: "Sensor Size", type: "select", options: [{ value: 1, label: "Full Frame" }, { value: 2, label: "APS-C" }, { value: 3, label: "Micro 4/3" }], defaultValue: 1 }',
  ],
  `(inputs) => {
      const fl = inputs.focalLength as number;
      const ap = inputs.aperture as number;
      const dist = inputs.subjectDist as number;
      const sensor = inputs.sensorSize as number;
      if (!fl || !ap || !dist) return null;
      const coc = sensor === 1 ? 0.03 : sensor === 2 ? 0.02 : 0.015;
      const distMm = dist * 1000;
      const hyperfocal = (fl * fl) / (ap * coc) + fl;
      const nearDist = (distMm * (hyperfocal - fl)) / (hyperfocal + distMm - 2 * fl);
      const farDist = (distMm * (hyperfocal - fl)) / (hyperfocal - distMm);
      const dof = farDist > 0 ? farDist - nearDist : Infinity;
      const dofM = dof / 1000;
      return {
        primary: { label: "Depth of Field", value: dofM > 100 ? "Infinite" : formatNumber(Math.round(dofM * 100) / 100) + " m" },
        details: [
          { label: "Near Limit", value: formatNumber(Math.round(nearDist / 10) / 100) + " m" },
          { label: "Far Limit", value: farDist > 0 ? formatNumber(Math.round(farDist / 10) / 100) + " m" : "Infinity" },
          { label: "Hyperfocal Distance", value: formatNumber(Math.round(hyperfocal / 1000 * 100) / 100) + " m" },
        ],
      };
  }`,
  [{ q: 'What controls depth of field?', a: 'Aperture, focal length, and subject distance all affect DOF.' },
   { q: 'How do I get a blurry background?', a: 'Use a wide aperture (low f-stop) and get close to your subject.' }],
  'DOF = Far Limit - Near Limit (using circle of confusion)',
  []
);

// #12 Print Resolution Calculator
add('print-resolution-calculator', 'Print Resolution Calculator',
  'Calculate maximum print size from pixel dimensions and DPI.',
  'Conversion', 'conversion', 'R',
  ['print resolution', 'pixels to print size'],
  [
    '{ name: "widthPx", label: "Image Width (px)", type: "number", min: 1, max: 50000, defaultValue: 4000 }',
    '{ name: "heightPx", label: "Image Height (px)", type: "number", min: 1, max: 50000, defaultValue: 3000 }',
    '{ name: "dpi", label: "Print DPI", type: "number", min: 72, max: 1200, defaultValue: 300 }',
  ],
  `(inputs) => {
      const wPx = inputs.widthPx as number;
      const hPx = inputs.heightPx as number;
      const dpi = inputs.dpi as number;
      if (!wPx || !hPx || !dpi) return null;
      const wIn = wPx / dpi;
      const hIn = hPx / dpi;
      const wCm = wIn * 2.54;
      const hCm = hIn * 2.54;
      const megapixels = (wPx * hPx) / 1000000;
      return {
        primary: { label: "Print Size", value: formatNumber(Math.round(wIn * 10) / 10) + " x " + formatNumber(Math.round(hIn * 10) / 10) + " in" },
        details: [
          { label: "Size (cm)", value: formatNumber(Math.round(wCm * 10) / 10) + " x " + formatNumber(Math.round(hCm * 10) / 10) },
          { label: "Megapixels", value: formatNumber(Math.round(megapixels * 10) / 10) + " MP" },
          { label: "Total Pixels", value: formatNumber(wPx * hPx) },
        ],
      };
  }`,
  [{ q: 'What DPI is best for printing?', a: '300 DPI is the standard for high-quality photo prints.' },
   { q: 'Can I print at 150 DPI?', a: '150 DPI is acceptable for large prints viewed from a distance.' }],
  'Print Size = Pixels / DPI',
  []
);

// #13 Golden Ratio Crop Calculator
add('golden-ratio-crop-calculator', 'Golden Ratio Crop Calculator',
  'Calculate golden ratio crop dimensions for images.',
  'Math', 'math', '+',
  ['golden ratio crop', 'golden rectangle calculator'],
  [
    '{ name: "width", label: "Image Width (px)", type: "number", min: 1, max: 50000, defaultValue: 1920 }',
    '{ name: "height", label: "Image Height (px)", type: "number", min: 1, max: 50000, defaultValue: 1080 }',
  ],
  `(inputs) => {
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!w || !h) return null;
      const phi = 1.618;
      const currentRatio = w / h;
      let cropW, cropH;
      if (currentRatio > phi) {
        cropH = h;
        cropW = Math.round(h * phi);
      } else {
        cropW = w;
        cropH = Math.round(w / phi);
      }
      const removedPx = (w * h) - (cropW * cropH);
      return {
        primary: { label: "Golden Crop", value: formatNumber(cropW) + " x " + formatNumber(cropH) + " px" },
        details: [
          { label: "Original Size", value: formatNumber(w) + " x " + formatNumber(h) + " px" },
          { label: "Current Ratio", value: formatNumber(Math.round(currentRatio * 1000) / 1000) },
          { label: "Pixels Removed", value: formatNumber(removedPx) },
        ],
      };
  }`,
  [{ q: 'What is the golden ratio?', a: 'The golden ratio is approximately 1.618, found throughout nature and art.' },
   { q: 'Why use the golden ratio for cropping?', a: 'It creates visually balanced and aesthetically pleasing compositions.' }],
  'Golden Width = Height x 1.618 (or Height = Width / 1.618)',
  []
);

// #14 Photo Storage Calculator
add('photo-storage-calculator', 'Photo Storage Calculator',
  'Estimate storage space needed for your photo library.',
  'Science', 'science', 'A',
  ['photo storage estimate', 'camera storage calculator'],
  [
    '{ name: "photoCount", label: "Number of Photos", type: "number", min: 1, max: 1000000, defaultValue: 5000 }',
    '{ name: "avgSizeMB", label: "Avg Photo Size (MB)", type: "number", min: 0.5, max: 100, defaultValue: 5 }',
    '{ name: "rawPercent", label: "RAW Photos (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
  ],
  `(inputs) => {
      const count = inputs.photoCount as number;
      const avgMB = inputs.avgSizeMB as number;
      const rawPct = inputs.rawPercent as number;
      if (!count || !avgMB) return null;
      const rawCount = Math.round(count * (rawPct / 100));
      const jpegCount = count - rawCount;
      const rawAvg = avgMB * 5;
      const totalMB = (jpegCount * avgMB) + (rawCount * rawAvg);
      const totalGB = totalMB / 1024;
      const totalTB = totalGB / 1024;
      return {
        primary: { label: "Storage Needed", value: formatNumber(Math.round(totalGB * 10) / 10) + " GB" },
        details: [
          { label: "JPEG Photos", value: formatNumber(jpegCount) },
          { label: "RAW Photos", value: formatNumber(rawCount) },
          { label: "Total (TB)", value: formatNumber(Math.round(totalTB * 100) / 100) + " TB" },
        ],
      };
  }`,
  [{ q: 'How big is a RAW photo file?', a: 'RAW files are typically 20 to 50 MB depending on the camera sensor.' },
   { q: 'How many photos fit on 1 TB?', a: 'About 200,000 JPEG photos at 5 MB each fit on 1 TB.' }],
  'Storage = (JPEG Count x Avg Size) + (RAW Count x RAW Size)',
  []
);

// #15 Fabric Yardage Calculator
add('fabric-yardage-calculator', 'Fabric Yardage Calculator',
  'Calculate fabric yardage needed for a sewing project.',
  'Everyday', 'everyday', '~',
  ['fabric yardage', 'sewing fabric calculator'],
  [
    '{ name: "garmentLength", label: "Garment Length (in)", type: "number", min: 1, max: 120, defaultValue: 30 }',
    '{ name: "garmentWidth", label: "Garment Width (in)", type: "number", min: 1, max: 80, defaultValue: 24 }',
    '{ name: "fabricWidth", label: "Fabric Width (in)", type: "number", min: 36, max: 120, defaultValue: 45 }',
    '{ name: "pieces", label: "Number of Pieces", type: "number", min: 1, max: 20, defaultValue: 2 }',
  ],
  `(inputs) => {
      const gl = inputs.garmentLength as number;
      const gw = inputs.garmentWidth as number;
      const fw = inputs.fabricWidth as number;
      const pcs = inputs.pieces as number;
      if (!gl || !gw || !fw || !pcs) return null;
      const piecesAcross = Math.floor(fw / gw);
      const rows = Math.ceil(pcs / piecesAcross);
      const totalLengthIn = rows * (gl + 2);
      const yards = totalLengthIn / 36;
      const meters = yards * 0.9144;
      return {
        primary: { label: "Fabric Needed", value: formatNumber(Math.round(yards * 100) / 100) + " yards" },
        details: [
          { label: "Pieces Across Fabric", value: formatNumber(piecesAcross) },
          { label: "Rows Needed", value: formatNumber(rows) },
          { label: "Meters", value: formatNumber(Math.round(meters * 100) / 100) + " m" },
        ],
      };
  }`,
  [{ q: 'How much extra fabric should I buy?', a: 'Buy 10 to 15 percent extra for pattern matching and mistakes.' },
   { q: 'What is standard fabric width?', a: 'Most apparel fabric is 44 to 45 inches wide.' }],
  'Yards = (Rows x (Garment Length + Seam Allowance)) / 36',
  []
);

// #16 Quilt Size Calculator
add('quilt-size-calculator', 'Quilt Size Calculator',
  'Calculate finished quilt size from block dimensions.',
  'Everyday', 'everyday', '~',
  ['quilt size', 'quilt block calculator'],
  [
    '{ name: "blockSize", label: "Block Size (in)", type: "number", min: 2, max: 24, defaultValue: 12 }',
    '{ name: "blocksWide", label: "Blocks Wide", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "blocksLong", label: "Blocks Long", type: "number", min: 1, max: 20, defaultValue: 6 }',
    '{ name: "borderWidth", label: "Border Width (in)", type: "number", min: 0, max: 12, defaultValue: 3 }',
  ],
  `(inputs) => {
      const block = inputs.blockSize as number;
      const wide = inputs.blocksWide as number;
      const long = inputs.blocksLong as number;
      const border = inputs.borderWidth as number;
      if (!block || !wide || !long) return null;
      const innerW = block * wide;
      const innerH = block * long;
      const totalW = innerW + (border * 2);
      const totalH = innerH + (border * 2);
      const totalBlocks = wide * long;
      const sqFt = (totalW * totalH) / 144;
      return {
        primary: { label: "Finished Size", value: formatNumber(totalW) + " x " + formatNumber(totalH) + " in" },
        details: [
          { label: "Total Blocks", value: formatNumber(totalBlocks) },
          { label: "Inner Size", value: formatNumber(innerW) + " x " + formatNumber(innerH) + " in" },
          { label: "Area", value: formatNumber(Math.round(sqFt * 10) / 10) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'What size quilt fits a queen bed?', a: 'A queen quilt is typically 86 by 86 inches or larger.' },
   { q: 'How much border should I add?', a: 'Most quilts use a 3 to 6 inch border on all sides.' }],
  'Finished Size = (Block Size x Blocks) + (Border x 2)',
  []
);

// #17 Yarn Yardage Calculator
add('yarn-yardage-calculator', 'Yarn Yardage Calculator',
  'Estimate yarn yardage needed for a knitting project.',
  'Everyday', 'everyday', '~',
  ['yarn yardage', 'knitting yarn calculator'],
  [
    '{ name: "stitchesPerInch", label: "Stitches Per Inch", type: "number", min: 1, max: 12, defaultValue: 5 }',
    '{ name: "rowsPerInch", label: "Rows Per Inch", type: "number", min: 1, max: 15, defaultValue: 7 }',
    '{ name: "width", label: "Project Width (in)", type: "number", min: 1, max: 100, defaultValue: 20 }',
    '{ name: "length", label: "Project Length (in)", type: "number", min: 1, max: 200, defaultValue: 60 }',
  ],
  `(inputs) => {
      const spi = inputs.stitchesPerInch as number;
      const rpi = inputs.rowsPerInch as number;
      const w = inputs.width as number;
      const l = inputs.length as number;
      if (!spi || !rpi || !w || !l) return null;
      const totalStitches = (spi * w) * (rpi * l);
      const yarnPerStitch = 1.5;
      const totalInches = totalStitches * yarnPerStitch;
      const totalYards = totalInches / 36;
      const skeins = Math.ceil(totalYards / 220);
      return {
        primary: { label: "Yarn Needed", value: formatNumber(Math.round(totalYards)) + " yards" },
        details: [
          { label: "Total Stitches", value: formatNumber(totalStitches) },
          { label: "Skeins (220 yd)", value: formatNumber(skeins) },
          { label: "Meters", value: formatNumber(Math.round(totalYards * 0.9144)) + " m" },
        ],
      };
  }`,
  [{ q: 'How do I figure stitches per inch?', a: 'Knit a 4-inch swatch and count the stitches, then divide by 4.' },
   { q: 'How much extra yarn should I buy?', a: 'Buy one extra skein to account for gauge differences and mistakes.' }],
  'Yards = Total Stitches x Yarn Per Stitch / 36',
  []
);

// #18 Candle Wax Calculator
add('candle-wax-calculator', 'Candle Wax Calculator',
  'Calculate wax and fragrance needed for candle making.',
  'Everyday', 'everyday', '~',
  ['candle wax calculator', 'candle making supply'],
  [
    '{ name: "containerVolume", label: "Container Volume (oz)", type: "number", min: 1, max: 64, defaultValue: 8 }',
    '{ name: "numberOfCandles", label: "Number of Candles", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "fragrancePercent", label: "Fragrance Load (%)", type: "number", min: 0, max: 12, defaultValue: 8 }',
  ],
  `(inputs) => {
      const vol = inputs.containerVolume as number;
      const count = inputs.numberOfCandles as number;
      const fragPct = inputs.fragrancePercent as number;
      if (!vol || !count) return null;
      const totalOz = vol * count;
      const waxOz = totalOz * (1 - fragPct / 100);
      const fragOz = totalOz * (fragPct / 100);
      const waxLbs = waxOz / 16;
      return {
        primary: { label: "Total Wax Needed", value: formatNumber(Math.round(waxLbs * 100) / 100) + " lbs" },
        details: [
          { label: "Wax (oz)", value: formatNumber(Math.round(waxOz * 10) / 10) },
          { label: "Fragrance Oil (oz)", value: formatNumber(Math.round(fragOz * 10) / 10) },
          { label: "Total Volume", value: formatNumber(totalOz) + " oz" },
        ],
      };
  }`,
  [{ q: 'What is a safe fragrance load?', a: 'Most waxes support 6 to 10 percent fragrance load by weight.' },
   { q: 'How much wax fills an 8 oz jar?', a: 'An 8 oz jar typically needs about 6 oz of wax by weight.' }],
  'Wax (lbs) = (Container Oz x Candles x (1 - Fragrance %)) / 16',
  []
);

// #19 Seed Spacing Calculator
add('seed-spacing-calculator', 'Seed Spacing Calculator',
  'Calculate how many seeds you need per row.',
  'Everyday', 'everyday', '~',
  ['seed spacing', 'garden seed calculator'],
  [
    '{ name: "rowLength", label: "Row Length (ft)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "seedSpacing", label: "Seed Spacing (in)", type: "number", min: 1, max: 48, defaultValue: 6 }',
    '{ name: "numberOfRows", label: "Number of Rows", type: "number", min: 1, max: 100, defaultValue: 4 }',
  ],
  `(inputs) => {
      const rowLen = inputs.rowLength as number;
      const spacing = inputs.seedSpacing as number;
      const rows = inputs.numberOfRows as number;
      if (!rowLen || !spacing || !rows) return null;
      const rowLenIn = rowLen * 12;
      const seedsPerRow = Math.floor(rowLenIn / spacing) + 1;
      const totalSeeds = seedsPerRow * rows;
      const withExtra = Math.ceil(totalSeeds * 1.1);
      return {
        primary: { label: "Total Seeds Needed", value: formatNumber(totalSeeds) },
        details: [
          { label: "Seeds Per Row", value: formatNumber(seedsPerRow) },
          { label: "With 10% Extra", value: formatNumber(withExtra) },
          { label: "Total Row Length", value: formatNumber(rowLen * rows) + " ft" },
        ],
      };
  }`,
  [{ q: 'Why add extra seeds?', a: 'Not all seeds germinate. Adding 10 percent extra ensures full coverage.' },
   { q: 'Does spacing vary by plant type?', a: 'Yes. Check seed packets for recommended spacing per variety.' }],
  'Seeds Per Row = (Row Length in inches / Spacing) + 1',
  []
);

// #20 Raised Bed Soil Calculator
add('raised-bed-soil-calculator', 'Raised Bed Soil Calculator',
  'Calculate soil volume needed for a raised garden bed.',
  'Everyday', 'everyday', '~',
  ['raised bed soil', 'garden soil calculator'],
  [
    '{ name: "length", label: "Bed Length (ft)", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "width", label: "Bed Width (ft)", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "depth", label: "Bed Depth (in)", type: "number", min: 4, max: 36, defaultValue: 12 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.depth as number;
      if (!l || !w || !d) return null;
      const cubicFt = l * w * (d / 12);
      const cubicYd = cubicFt / 27;
      const bags = Math.ceil(cubicFt / 1);
      const tons = cubicYd * 1.1;
      return {
        primary: { label: "Soil Needed", value: formatNumber(Math.round(cubicYd * 100) / 100) + " cubic yards" },
        details: [
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt * 10) / 10) },
          { label: "Bags (1 cu ft)", value: formatNumber(bags) },
          { label: "Approx Weight", value: formatNumber(Math.round(tons * 100) / 100) + " tons" },
        ],
      };
  }`,
  [{ q: 'How deep should a raised bed be?', a: 'Most vegetables need at least 12 inches of soil depth.' },
   { q: 'What soil mix is best for raised beds?', a: 'A mix of topsoil, compost, and perlite works well for most plants.' }],
  'Cubic Yards = Length x Width x (Depth / 12) / 27',
  []
);

// #21 Fertilizer Rate Calculator
add('fertilizer-rate-calculator', 'Fertilizer Rate Calculator',
  'Calculate fertilizer needed for your lawn area.',
  'Everyday', 'everyday', '~',
  ['fertilizer rate', 'lawn fertilizer calculator'],
  [
    '{ name: "lawnArea", label: "Lawn Area (sq ft)", type: "number", min: 100, max: 200000, defaultValue: 5000 }',
    '{ name: "nRatio", label: "Nitrogen % on Bag", type: "number", min: 1, max: 50, defaultValue: 20 }',
    '{ name: "applicationRate", label: "Rate (lbs N per 1000 sq ft)", type: "number", min: 0.25, max: 5, defaultValue: 1 }',
  ],
  `(inputs) => {
      const area = inputs.lawnArea as number;
      const nPct = inputs.nRatio as number;
      const rate = inputs.applicationRate as number;
      if (!area || !nPct || !rate) return null;
      const nNeeded = (area / 1000) * rate;
      const productNeeded = nNeeded / (nPct / 100);
      const bags = Math.ceil(productNeeded / 25);
      return {
        primary: { label: "Product Needed", value: formatNumber(Math.round(productNeeded * 10) / 10) + " lbs" },
        details: [
          { label: "Nitrogen Needed", value: formatNumber(Math.round(nNeeded * 100) / 100) + " lbs" },
          { label: "Bags (25 lb)", value: formatNumber(bags) },
          { label: "Coverage", value: formatNumber(area) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How often should I fertilize my lawn?', a: 'Most lawns benefit from fertilizing 3 to 4 times per year.' },
   { q: 'What does the N-P-K ratio mean?', a: 'N is nitrogen, P is phosphorus, K is potassium on the bag label.' }],
  'Product (lbs) = (Area / 1000) x Application Rate / (N% / 100)',
  []
);

// #22 Plant Spacing Calculator
add('plant-spacing-calculator', 'Plant Spacing Calculator',
  'Calculate how many plants fit in a garden bed.',
  'Everyday', 'everyday', '~',
  ['plant spacing', 'garden plant calculator'],
  [
    '{ name: "bedLength", label: "Bed Length (ft)", type: "number", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "bedWidth", label: "Bed Width (ft)", type: "number", min: 1, max: 50, defaultValue: 4 }',
    '{ name: "spacing", label: "Plant Spacing (in)", type: "number", min: 3, max: 48, defaultValue: 12 }',
  ],
  `(inputs) => {
      const l = inputs.bedLength as number;
      const w = inputs.bedWidth as number;
      const sp = inputs.spacing as number;
      if (!l || !w || !sp) return null;
      const lIn = l * 12;
      const wIn = w * 12;
      const plantsPerRow = Math.floor(lIn / sp) + 1;
      const rows = Math.floor(wIn / sp) + 1;
      const totalPlants = plantsPerRow * rows;
      const bedArea = l * w;
      return {
        primary: { label: "Total Plants", value: formatNumber(totalPlants) },
        details: [
          { label: "Plants Per Row", value: formatNumber(plantsPerRow) },
          { label: "Number of Rows", value: formatNumber(rows) },
          { label: "Bed Area", value: formatNumber(bedArea) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'What happens if plants are too close together?', a: 'Crowded plants compete for light and nutrients, reducing yield.' },
   { q: 'Can I use closer spacing in raised beds?', a: 'Yes, raised bed soil is richer so slightly closer spacing works.' }],
  'Total Plants = (Length / Spacing + 1) x (Width / Spacing + 1)',
  []
);

// #23 Boat Fuel Consumption Calculator
add('boat-fuel-consumption-calculator', 'Boat Fuel Consumption Calculator',
  'Estimate boat fuel usage for a trip by engine and speed.',
  'Everyday', 'everyday', '~',
  ['boat fuel consumption', 'marine fuel calculator'],
  [
    '{ name: "engineHP", label: "Engine Horsepower", type: "number", min: 5, max: 2000, defaultValue: 150 }',
    '{ name: "speed", label: "Speed (knots)", type: "number", min: 1, max: 60, defaultValue: 20 }',
    '{ name: "distance", label: "Distance (nm)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const hp = inputs.engineHP as number;
      const spd = inputs.speed as number;
      const dist = inputs.distance as number;
      if (!hp || !spd || !dist) return null;
      const gph = hp * 0.1 * (spd / 20);
      const hours = dist / spd;
      const totalGallons = gph * hours;
      const nmpg = dist / totalGallons;
      return {
        primary: { label: "Fuel Needed", value: formatNumber(Math.round(totalGallons * 10) / 10) + " gallons" },
        details: [
          { label: "Gallons Per Hour", value: formatNumber(Math.round(gph * 10) / 10) },
          { label: "Trip Time", value: formatNumber(Math.round(hours * 10) / 10) + " hours" },
          { label: "NM Per Gallon", value: formatNumber(Math.round(nmpg * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'How do I reduce fuel consumption?', a: 'Slow down. Running at hull speed greatly reduces fuel burn.' },
   { q: 'What is a nautical mile?', a: 'A nautical mile equals 1.15 statute miles or 1,852 meters.' }],
  'Fuel = GPH x (Distance / Speed)',
  []
);

// #24 Anchor Rode Calculator
add('anchor-rode-calculator', 'Anchor Rode Calculator',
  'Calculate anchor line length for safe anchoring.',
  'Everyday', 'everyday', '~',
  ['anchor rode length', 'anchor scope calculator'],
  [
    '{ name: "waterDepth", label: "Water Depth (ft)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "tideRange", label: "Tide Range (ft)", type: "number", min: 0, max: 30, defaultValue: 4 }',
    '{ name: "scope", label: "Scope Ratio", type: "number", min: 3, max: 10, defaultValue: 7 }',
  ],
  `(inputs) => {
      const depth = inputs.waterDepth as number;
      const tide = inputs.tideRange as number;
      const scope = inputs.scope as number;
      if (!depth || !scope) return null;
      const maxDepth = depth + tide;
      const bowHeight = 4;
      const totalDepth = maxDepth + bowHeight;
      const rodeLength = totalDepth * scope;
      const swingRadius = Math.sqrt(rodeLength * rodeLength - totalDepth * totalDepth);
      return {
        primary: { label: "Rode Needed", value: formatNumber(Math.round(rodeLength)) + " ft" },
        details: [
          { label: "Max Depth (with tide)", value: formatNumber(maxDepth) + " ft" },
          { label: "Total Depth (with bow)", value: formatNumber(totalDepth) + " ft" },
          { label: "Swing Radius", value: formatNumber(Math.round(swingRadius)) + " ft" },
        ],
      };
  }`,
  [{ q: 'What scope ratio should I use?', a: 'Use 7:1 for normal conditions and 10:1 for storms.' },
   { q: 'What is anchor rode?', a: 'Rode is the line and chain connecting your anchor to the boat.' }],
  'Rode = (Water Depth + Tide + Bow Height) x Scope Ratio',
  []
);

// #25 Hull Speed Calculator
add('hull-speed-calculator', 'Hull Speed Calculator',
  'Calculate maximum displacement hull speed for a boat.',
  'Science', 'science', 'A',
  ['hull speed', 'boat hull speed calculator'],
  [
    '{ name: "waterlengthFt", label: "Waterline Length (ft)", type: "number", min: 5, max: 300, defaultValue: 30 }',
  ],
  `(inputs) => {
      const lwl = inputs.waterlengthFt as number;
      if (!lwl) return null;
      const hullSpeedKnots = 1.34 * Math.sqrt(lwl);
      const hullSpeedMph = hullSpeedKnots * 1.15078;
      const hullSpeedKmh = hullSpeedKnots * 1.852;
      return {
        primary: { label: "Hull Speed", value: formatNumber(Math.round(hullSpeedKnots * 100) / 100) + " knots" },
        details: [
          { label: "MPH", value: formatNumber(Math.round(hullSpeedMph * 100) / 100) },
          { label: "km/h", value: formatNumber(Math.round(hullSpeedKmh * 100) / 100) },
          { label: "Waterline Length", value: formatNumber(lwl) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is hull speed?', a: 'Hull speed is the max efficient speed of a displacement hull boat.' },
   { q: 'Can a boat exceed hull speed?', a: 'Yes, with enough power, but fuel consumption rises dramatically.' }],
  'Hull Speed = 1.34 x sqrt(Waterline Length)',
  []
);
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch6.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch6.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch6.txt`);
console.log(`Registry saved to: scripts/new-regs-batch6.txt`);
