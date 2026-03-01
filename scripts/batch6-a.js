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
