add(
  "dental-crown-cost-calculator",
  "Dental Crown Cost Calculator",
  "Estimate dental crown cost based on material type and location factors.",
  "Finance",
  "finance",
  "$",
  ["dental crown cost", "crown material price", "dental restoration cost"],
  [
    '{ name: "material", label: "Crown Material", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Ceramic" }, { value: "3", label: "Gold" }, { value: "4", label: "Porcelain-Fused-Metal" }] }',
    '{ name: "crowns", label: "Number of Crowns", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const material = inputs.material as string;
    const crowns = inputs.crowns as number;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1200, "2": 1400, "3": 1800, "4": 1000 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Ceramic", "3": "Gold", "4": "Porcelain-Fused-Metal" };
    const unitCost = prices[material] || 1200;
    const totalBefore = unitCost * crowns;
    const covered = totalBefore * (insurance / 100);
    const outOfPocket = totalBefore - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Crown", value: "$" + formatNumber(unitCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(totalBefore) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How much does a dental crown cost without insurance?", a: "A dental crown typically costs $800 to $1800 depending on the material chosen." },
    { q: "Which crown material lasts the longest?", a: "Gold crowns tend to last the longest, often 20 years or more with proper care." },
    { q: "Does insurance cover dental crowns?", a: "Most dental plans cover 50% of crown costs after the deductible is met." }
  ],
  "Out-of-Pocket = (Cost per Crown x Number of Crowns) x (1 - Insurance% / 100)",
  ["dental-bridge-cost-calculator", "dental-veneer-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "dental-bridge-cost-calculator",
  "Dental Bridge Cost Calculator",
  "Calculate dental bridge cost based on the number of units and material.",
  "Finance",
  "finance",
  "$",
  ["dental bridge cost", "bridge units price", "tooth replacement cost"],
  [
    '{ name: "units", label: "Number of Bridge Units", type: "number", min: 3, max: 14, defaultValue: 3 }',
    '{ name: "material", label: "Material Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Zirconia" }, { value: "3", label: "Metal" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const units = inputs.units as number;
    const material = inputs.material as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 900, "2": 1100, "3": 700 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Zirconia", "3": "Metal" };
    const perUnit = prices[material] || 900;
    const total = perUnit * units;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Unit", value: "$" + formatNumber(perUnit) },
        { label: "Total Cost", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How many units are in a typical dental bridge?", a: "A standard bridge has 3 units: two crowns on anchor teeth and one pontic." },
    { q: "How long does a dental bridge last?", a: "Dental bridges typically last 5 to 15 years with good oral hygiene." },
    { q: "Is a bridge cheaper than an implant?", a: "Bridges generally cost less upfront, but implants may be more cost-effective long term." }
  ],
  "Out-of-Pocket = (Cost per Unit x Units) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-veneer-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "dental-veneer-cost-calculator",
  "Dental Veneer Cost Calculator",
  "Estimate the cost of dental veneers per tooth by material type.",
  "Finance",
  "finance",
  "$",
  ["dental veneer cost", "porcelain veneer price", "cosmetic dentistry cost"],
  [
    '{ name: "teeth", label: "Number of Teeth", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "veneerType", label: "Veneer Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Composite" }, { value: "3", label: "Lumineers" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const teeth = inputs.teeth as number;
    const veneerType = inputs.veneerType as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1500, "2": 600, "3": 1200 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Composite", "3": "Lumineers" };
    const perTooth = prices[veneerType] || 1500;
    const total = perTooth * teeth;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Veneer Type", value: names[veneerType] || "Porcelain" },
        { label: "Cost per Tooth", value: "$" + formatNumber(perTooth) },
        { label: "Subtotal", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "Are dental veneers covered by insurance?", a: "Veneers are usually considered cosmetic and not covered by dental insurance." },
    { q: "How long do porcelain veneers last?", a: "Porcelain veneers typically last 10 to 15 years with proper care." },
    { q: "What is the difference between veneers and lumineers?", a: "Lumineers are thinner and require less tooth preparation than traditional veneers." }
  ],
  "Total Cost = (Cost per Tooth x Number of Teeth) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "teeth-whitening-cost-calculator"]
);

add(
  "orthodontic-payment-calculator",
  "Orthodontic Payment Calculator",
  "Calculate monthly payment plans for braces or clear aligners.",
  "Finance",
  "finance",
  "$",
  ["braces monthly payment", "orthodontic cost plan", "aligner payment calculator"],
  [
    '{ name: "totalCost", label: "Total Treatment Cost ($)", type: "number", min: 1000, max: 15000, defaultValue: 5000 }',
    '{ name: "downPayment", label: "Down Payment ($)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "months", label: "Payment Months", type: "number", min: 6, max: 60, defaultValue: 24 }',
    '{ name: "insurance", label: "Insurance Benefit ($)", type: "number", min: 0, max: 5000, defaultValue: 1500 }'
  ],
  `(inputs) => {
    const totalCost = inputs.totalCost as number;
    const downPayment = inputs.downPayment as number;
    const months = inputs.months as number;
    const insurance = inputs.insurance as number;
    const remaining = totalCost - downPayment - insurance;
    const monthlyPayment = remaining > 0 ? remaining / months : 0;
    return {
      primary: { label: "Monthly Payment", value: "$" + formatNumber(monthlyPayment) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalCost) },
        { label: "Down Payment", value: "$" + formatNumber(downPayment) },
        { label: "Insurance Benefit", value: "$" + formatNumber(insurance) },
        { label: "Remaining Balance", value: "$" + formatNumber(remaining > 0 ? remaining : 0) },
        { label: "Payment Duration", value: months + " months" }
      ]
    };
  }`,
  [
    { q: "How much do braces cost on average?", a: "Traditional metal braces cost between $3000 and $7000 depending on complexity." },
    { q: "Do orthodontists offer payment plans?", a: "Most orthodontists offer in-house payment plans with little or no interest." },
    { q: "Does insurance cover braces?", a: "Many dental plans cover $1000 to $2000 for orthodontic treatment, especially for minors." }
  ],
  "Monthly Payment = (Total Cost - Down Payment - Insurance) / Months",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "dental-veneer-cost-calculator"]
);

add(
  "dental-cleaning-frequency-calculator",
  "Dental Cleaning Frequency Calculator",
  "Determine the recommended dental cleaning interval based on risk factors.",
  "Health",
  "health",
  "H",
  ["dental cleaning schedule", "teeth cleaning frequency", "dental hygiene interval"],
  [
    '{ name: "gumDisease", label: "History of Gum Disease", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "smoker", label: "Tobacco Use", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "diabetes", label: "Diabetes", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "brushFreq", label: "Daily Brushing Frequency", type: "number", min: 0, max: 5, defaultValue: 2 }'
  ],
  `(inputs) => {
    const gumDisease = inputs.gumDisease as string;
    const smoker = inputs.smoker as string;
    const diabetes = inputs.diabetes as string;
    const brushFreq = inputs.brushFreq as number;
    let riskScore = 0;
    if (gumDisease === "1") riskScore += 3;
    if (smoker === "1") riskScore += 2;
    if (diabetes === "1") riskScore += 2;
    if (brushFreq < 2) riskScore += 1;
    let intervalMonths = 6;
    let riskLevel = "Low";
    if (riskScore >= 5) { intervalMonths = 3; riskLevel = "High"; }
    else if (riskScore >= 3) { intervalMonths = 4; riskLevel = "Moderate"; }
    const visitsPerYear = Math.round(12 / intervalMonths);
    return {
      primary: { label: "Recommended Interval", value: intervalMonths + " months" },
      details: [
        { label: "Risk Level", value: riskLevel },
        { label: "Visits per Year", value: formatNumber(visitsPerYear) },
        { label: "Risk Score", value: formatNumber(riskScore) + " / 8" }
      ]
    };
  }`,
  [
    { q: "How often should I get my teeth cleaned?", a: "Most adults should get a dental cleaning every 6 months, or more often with risk factors." },
    { q: "Does smoking affect dental cleaning frequency?", a: "Yes, smokers are at higher risk for gum disease and may need cleanings every 3 to 4 months." },
    { q: "Why do diabetics need more frequent cleanings?", a: "Diabetes increases the risk of gum infections, making more frequent cleanings important." }
  ],
  "Interval = Base 6 months, adjusted down for gum disease, smoking, diabetes, and low brushing",
  ["dental-crown-cost-calculator", "teeth-whitening-cost-calculator", "root-canal-cost-calculator"]
);

add(
  "root-canal-cost-calculator",
  "Root Canal Cost Calculator",
  "Estimate root canal treatment cost by tooth type and insurance coverage.",
  "Finance",
  "finance",
  "$",
  ["root canal cost", "endodontic treatment price", "root canal insurance"],
  [
    '{ name: "toothType", label: "Tooth Type", type: "select", options: [{ value: "1", label: "Front Tooth" }, { value: "2", label: "Premolar" }, { value: "3", label: "Molar" }] }',
    '{ name: "crownNeeded", label: "Crown Needed After", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }',
    '{ name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const toothType = inputs.toothType as string;
    const crownNeeded = inputs.crownNeeded as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 700, "2": 900, "3": 1200 };
    const names: Record<string, string> = { "1": "Front Tooth", "2": "Premolar", "3": "Molar" };
    const rcCost = prices[toothType] || 700;
    const crownCost = crownNeeded === "1" ? 1200 : 0;
    const total = rcCost + crownCost;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Tooth Type", value: names[toothType] || "Front Tooth" },
        { label: "Root Canal Cost", value: "$" + formatNumber(rcCost) },
        { label: "Crown Cost", value: "$" + formatNumber(crownCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  }`,
  [
    { q: "How much does a root canal cost on a molar?", a: "A molar root canal typically costs $1000 to $1500 before insurance." },
    { q: "Do you always need a crown after a root canal?", a: "Molars and premolars usually need crowns, but front teeth may not require one." },
    { q: "Does insurance cover root canals?", a: "Most dental plans cover 50% to 80% of root canal costs after the deductible." }
  ],
  "Out-of-Pocket = (Root Canal Cost + Crown Cost) x (1 - Insurance% / 100)",
  ["dental-crown-cost-calculator", "dental-bridge-cost-calculator", "dental-cleaning-frequency-calculator"]
);

add(
  "teeth-whitening-cost-calculator",
  "Teeth Whitening Cost Calculator",
  "Compare teeth whitening costs across different methods.",
  "Finance",
  "finance",
  "$",
  ["teeth whitening cost", "dental whitening price", "bleaching treatment cost"],
  [
    '{ name: "method", label: "Whitening Method", type: "select", options: [{ value: "1", label: "In-Office Professional" }, { value: "2", label: "Take-Home Trays" }, { value: "3", label: "Over-the-Counter Strips" }, { value: "4", label: "Whitening Toothpaste" }] }',
    '{ name: "sessions", label: "Number of Sessions or Boxes", type: "number", min: 1, max: 12, defaultValue: 1 }'
  ],
  `(inputs) => {
    const method = inputs.method as string;
    const sessions = inputs.sessions as number;
    const prices: Record<string, number> = { "1": 650, "2": 300, "3": 45, "4": 8 };
    const names: Record<string, string> = { "1": "In-Office Professional", "2": "Take-Home Trays", "3": "OTC Strips", "4": "Whitening Toothpaste" };
    const perSession = prices[method] || 650;
    const total = perSession * sessions;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Method", value: names[method] || "In-Office" },
        { label: "Cost per Session/Box", value: "$" + formatNumber(perSession) },
        { label: "Quantity", value: formatNumber(sessions) }
      ]
    };
  }`,
  [
    { q: "How much does professional teeth whitening cost?", a: "In-office professional whitening typically costs $500 to $1000 per session." },
    { q: "Is teeth whitening covered by insurance?", a: "Teeth whitening is cosmetic and not covered by dental insurance plans." },
    { q: "How long do whitening results last?", a: "Professional whitening results can last 6 months to 2 years depending on habits." }
  ],
  "Total Cost = Cost per Session x Number of Sessions",
  ["dental-veneer-cost-calculator", "dental-cleaning-frequency-calculator", "dental-crown-cost-calculator"]
);

add(
  "vet-visit-cost-calculator",
  "Vet Visit Cost Calculator",
  "Estimate veterinary visit costs based on visit type and pet size.",
  "Finance",
  "finance",
  "$",
  ["vet visit cost", "veterinary exam price", "animal clinic cost"],
  [
    '{ name: "visitType", label: "Visit Type", type: "select", options: [{ value: "1", label: "Routine Checkup" }, { value: "2", label: "Sick Visit" }, { value: "3", label: "Emergency" }] }',
    '{ name: "petSize", label: "Pet Size", type: "select", options: [{ value: "1", label: "Small (under 20 lbs)" }, { value: "2", label: "Medium (20-50 lbs)" }, { value: "3", label: "Large (over 50 lbs)" }] }',
    '{ name: "labWork", label: "Lab Work Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }'
  ],
  `(inputs) => {
    const visitType = inputs.visitType as string;
    const petSize = inputs.petSize as string;
    const labWork = inputs.labWork as string;
    const visitCosts: Record<string, number> = { "1": 55, "2": 100, "3": 250 };
    const sizeMultiplier: Record<string, number> = { "1": 1.0, "2": 1.15, "3": 1.3 };
    const visitNames: Record<string, string> = { "1": "Routine Checkup", "2": "Sick Visit", "3": "Emergency" };
    const baseCost = visitCosts[visitType] || 55;
    const multiplier = sizeMultiplier[petSize] || 1.0;
    const examCost = Math.round(baseCost * multiplier);
    const labCost = labWork === "1" ? 150 : 0;
    const total = examCost + labCost;
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Visit Type", value: visitNames[visitType] || "Routine" },
        { label: "Exam Fee", value: "$" + formatNumber(examCost) },
        { label: "Lab Work", value: "$" + formatNumber(labCost) }
      ]
    };
  }`,
  [
    { q: "How much does a routine vet visit cost?", a: "A routine vet checkup typically costs $50 to $100 without additional tests." },
    { q: "Why do emergency vet visits cost more?", a: "Emergency visits include after-hours staffing and urgent diagnostic equipment use." },
    { q: "Does pet size affect vet costs?", a: "Larger pets may cost more for medications, anesthesia, and some procedures." }
  ],
  "Total = (Base Visit Cost x Size Multiplier) + Lab Work Cost",
  ["pet-vaccination-schedule-calculator", "pet-dental-cost-calculator", "pet-spay-neuter-cost-calculator"]
);

add(
  "pet-vaccination-schedule-calculator",
  "Pet Vaccination Schedule Calculator",
  "Determine the next vaccination due date and cost for your pet.",
  "Health",
  "health",
  "H",
  ["pet vaccination schedule", "dog vaccine timing", "cat vaccine due date"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "ageMonths", label: "Pet Age (months)", type: "number", min: 1, max: 240, defaultValue: 12 }',
    '{ name: "lastVaccine", label: "Months Since Last Vaccine", type: "number", min: 0, max: 36, defaultValue: 6 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const ageMonths = inputs.ageMonths as number;
    const lastVaccine = inputs.lastVaccine as number;
    let intervalMonths = 12;
    if (ageMonths < 4) intervalMonths = 1;
    else if (ageMonths < 16) intervalMonths = 3;
    const monthsUntilDue = Math.max(0, intervalMonths - lastVaccine);
    const costPerVisit = petType === "1" ? 85 : 70;
    const status = monthsUntilDue === 0 ? "Overdue or Due Now" : "Due in " + monthsUntilDue + " months";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Vaccination Status", value: status },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Vaccine Interval", value: intervalMonths + " months" },
        { label: "Estimated Cost per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Pet Age", value: ageMonths + " months" }
      ]
    };
  }`,
  [
    { q: "How often do dogs need vaccinations?", a: "Puppies need vaccines every 3 to 4 weeks until 16 weeks, then annually." },
    { q: "What are core vaccines for cats?", a: "Core cat vaccines include FVRCP and rabies, required for all cats." },
    { q: "How much do pet vaccinations cost?", a: "Pet vaccinations typically cost $50 to $100 per visit depending on the vaccines." }
  ],
  "Months Until Due = Vaccine Interval - Months Since Last Vaccine",
  ["vet-visit-cost-calculator", "pet-weight-calculator", "pet-dental-cost-calculator"]
);

add(
  "pet-spay-neuter-cost-calculator",
  "Pet Spay Neuter Cost Calculator",
  "Estimate spay or neuter surgery cost based on pet type and weight.",
  "Finance",
  "finance",
  "$",
  ["spay neuter cost", "pet sterilization price", "dog neuter cost"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "gender", label: "Gender", type: "select", options: [{ value: "1", label: "Female (Spay)" }, { value: "2", label: "Male (Neuter)" }] }',
    '{ name: "weight", label: "Pet Weight (lbs)", type: "number", min: 2, max: 200, defaultValue: 30 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const gender = inputs.gender as string;
    const weight = inputs.weight as number;
    let baseCost = 200;
    if (petType === "2") baseCost = 150;
    if (gender === "1") baseCost += 100;
    let weightSurcharge = 0;
    if (weight > 50) weightSurcharge = 50;
    if (weight > 100) weightSurcharge = 100;
    const total = baseCost + weightSurcharge;
    const procedure = gender === "1" ? "Spay" : "Neuter";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Procedure", value: procedure },
        { label: "Base Cost", value: "$" + formatNumber(baseCost) },
        { label: "Weight Surcharge", value: "$" + formatNumber(weightSurcharge) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to spay a dog?", a: "Spaying a dog typically costs $200 to $500 depending on size and location." },
    { q: "Is neutering cheaper than spaying?", a: "Yes, neutering is generally less expensive because it is a simpler procedure." },
    { q: "Are there low-cost spay neuter programs?", a: "Many communities offer low-cost clinics that can reduce the cost to $50 to $150." }
  ],
  "Total = Base Cost (by pet type and gender) + Weight Surcharge",
  ["vet-visit-cost-calculator", "pet-dental-cost-calculator", "pet-weight-calculator"]
);

add(
  "pet-dental-cost-calculator",
  "Pet Dental Cost Calculator",
  "Estimate pet dental cleaning and extraction costs.",
  "Finance",
  "finance",
  "$",
  ["pet dental cleaning cost", "dog teeth cleaning price", "cat dental cost"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "extractions", label: "Teeth Extractions Needed", type: "number", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "xrays", label: "Dental X-Rays Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const extractions = inputs.extractions as number;
    const xrays = inputs.xrays as string;
    const cleaningCost = petType === "1" ? 300 : 250;
    const extractionCost = extractions * 75;
    const xrayCost = xrays === "1" ? 150 : 0;
    const anesthesiaCost = 200;
    const total = cleaningCost + extractionCost + xrayCost + anesthesiaCost;
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Cleaning", value: "$" + formatNumber(cleaningCost) },
        { label: "Extractions (" + extractions + ")", value: "$" + formatNumber(extractionCost) },
        { label: "X-Rays", value: "$" + formatNumber(xrayCost) },
        { label: "Anesthesia", value: "$" + formatNumber(anesthesiaCost) }
      ]
    };
  }`,
  [
    { q: "How much does a dog dental cleaning cost?", a: "Dog dental cleanings typically cost $300 to $700 including anesthesia." },
    { q: "Do pets need anesthesia for dental cleaning?", a: "Yes, pets require general anesthesia for a thorough and safe dental cleaning." },
    { q: "How often should pets get dental cleanings?", a: "Most veterinarians recommend annual dental cleanings for dogs and cats." }
  ],
  "Total = Cleaning + (Extractions x $75) + X-Rays + Anesthesia",
  ["vet-visit-cost-calculator", "pet-vaccination-schedule-calculator", "pet-spay-neuter-cost-calculator"]
);

add(
  "pet-weight-calculator",
  "Pet Weight Calculator",
  "Estimate ideal pet weight based on breed size category and age.",
  "Health",
  "health",
  "H",
  ["ideal pet weight", "dog weight chart", "cat weight range"],
  [
    '{ name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] }',
    '{ name: "breedSize", label: "Breed Size", type: "select", options: [{ value: "1", label: "Small" }, { value: "2", label: "Medium" }, { value: "3", label: "Large" }, { value: "4", label: "Giant" }] }',
    '{ name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 1, max: 250, defaultValue: 30 }'
  ],
  `(inputs) => {
    const petType = inputs.petType as string;
    const breedSize = inputs.breedSize as string;
    const currentWeight = inputs.currentWeight as number;
    let idealMin = 8;
    let idealMax = 15;
    if (petType === "1") {
      const ranges: Record<string, number[]> = { "1": [5, 20], "2": [20, 50], "3": [50, 90], "4": [90, 150] };
      const range = ranges[breedSize] || [20, 50];
      idealMin = range[0];
      idealMax = range[1];
    } else {
      idealMin = 7;
      idealMax = 12;
    }
    const idealMid = (idealMin + idealMax) / 2;
    const diff = currentWeight - idealMid;
    let status = "At Ideal Weight";
    if (currentWeight < idealMin) status = "Underweight";
    else if (currentWeight > idealMax) status = "Overweight";
    return {
      primary: { label: "Weight Status", value: status },
      details: [
        { label: "Ideal Range", value: idealMin + " - " + idealMax + " lbs" },
        { label: "Current Weight", value: currentWeight + " lbs" },
        { label: "Difference from Midpoint", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How do I know if my dog is overweight?", a: "You should be able to feel ribs easily and see a waist when viewed from above." },
    { q: "What is the ideal weight for a cat?", a: "Most domestic cats should weigh between 7 and 12 pounds depending on breed." },
    { q: "How can I help my pet lose weight?", a: "Reduce portion sizes, increase exercise, and consult your vet for a safe plan." }
  ],
  "Status = Current Weight compared to Ideal Range (by pet type and breed size)",
  ["pet-vaccination-schedule-calculator", "vet-visit-cost-calculator", "horse-weight-calculator"]
);

add(
  "horse-feed-calculator",
  "Horse Feed Calculator",
  "Calculate daily horse feed amounts based on weight and activity level.",
  "Everyday",
  "everyday",
  "~",
  ["horse feed amount", "equine nutrition calculator", "horse hay requirement"],
  [
    '{ name: "horseWeight", label: "Horse Weight (lbs)", type: "number", min: 500, max: 2500, defaultValue: 1100 }',
    '{ name: "activity", label: "Activity Level", type: "select", options: [{ value: "1", label: "Light" }, { value: "2", label: "Moderate" }, { value: "3", label: "Heavy" }, { value: "4", label: "Very Heavy" }] }',
    '{ name: "hayQuality", label: "Hay Quality", type: "select", options: [{ value: "1", label: "Good" }, { value: "2", label: "Average" }, { value: "3", label: "Poor" }] }'
  ],
  `(inputs) => {
    const horseWeight = inputs.horseWeight as number;
    const activity = inputs.activity as string;
    const hayQuality = inputs.hayQuality as string;
    const hayPercent = 0.02;
    const dailyHay = horseWeight * hayPercent;
    const grainMultipliers: Record<string, number> = { "1": 0.005, "2": 0.0075, "3": 0.01, "4": 0.0125 };
    const qualityAdj: Record<string, number> = { "1": 1.0, "2": 1.1, "3": 1.2 };
    const grainMult = grainMultipliers[activity] || 0.005;
    const qualMult = qualityAdj[hayQuality] || 1.0;
    const dailyGrain = horseWeight * grainMult;
    const adjustedHay = dailyHay * qualMult;
    const totalFeed = adjustedHay + dailyGrain;
    return {
      primary: { label: "Total Daily Feed", value: formatNumber(totalFeed) + " lbs" },
      details: [
        { label: "Daily Hay", value: formatNumber(adjustedHay) + " lbs" },
        { label: "Daily Grain/Concentrate", value: formatNumber(dailyGrain) + " lbs" },
        { label: "Horse Weight", value: formatNumber(horseWeight) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How much hay should a horse eat daily?", a: "A horse should eat about 1.5% to 2% of its body weight in hay per day." },
    { q: "Do active horses need more grain?", a: "Yes, horses in heavy work need more grain or concentrate for energy demands." },
    { q: "Can a horse eat too much hay?", a: "Overfeeding hay is rare, but poor-quality hay can cause digestive issues." }
  ],
  "Total Daily Feed = (Weight x 2% x Quality Adj) + (Weight x Activity Grain%)",
  ["horse-weight-calculator", "pet-weight-calculator", "pet-vaccination-schedule-calculator"]
);

add(
  "horse-weight-calculator",
  "Horse Weight Calculator",
  "Estimate horse weight using heart girth and body length measurements.",
  "Health",
  "health",
  "H",
  ["horse weight estimate", "equine weight tape", "horse body condition"],
  [
    '{ name: "heartGirth", label: "Heart Girth (inches)", type: "number", min: 40, max: 100, defaultValue: 72 }',
    '{ name: "bodyLength", label: "Body Length (inches)", type: "number", min: 40, max: 100, defaultValue: 65 }'
  ],
  `(inputs) => {
    const heartGirth = inputs.heartGirth as number;
    const bodyLength = inputs.bodyLength as number;
    const weight = (heartGirth * heartGirth * bodyLength) / 330;
    const weightKg = weight * 0.4536;
    return {
      primary: { label: "Estimated Weight", value: formatNumber(Math.round(weight)) + " lbs" },
      details: [
        { label: "Weight in Kg", value: formatNumber(Math.round(weightKg)) + " kg" },
        { label: "Heart Girth", value: heartGirth + " in" },
        { label: "Body Length", value: bodyLength + " in" }
      ]
    };
  }`,
  [
    { q: "How do you measure horse heart girth?", a: "Measure around the barrel just behind the elbow and over the withers." },
    { q: "How accurate is the weight tape method?", a: "The girth and length formula is typically accurate within 50 to 100 pounds." },
    { q: "Why is knowing a horse weight important?", a: "Accurate weight is essential for proper feeding, deworming, and medication dosing." }
  ],
  "Weight (lbs) = (Heart Girth^2 x Body Length) / 330",
  ["horse-feed-calculator", "pet-weight-calculator", "vet-visit-cost-calculator"]
);

add(
  "pill-dosage-calculator",
  "Pill Dosage Calculator",
  "Calculate pill dosage based on body weight and prescribed dose rate.",
  "Health",
  "health",
  "H",
  ["pill dosage by weight", "tablet dose calculator", "medication dosage weight"],
  [
    '{ name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 300, defaultValue: 70 }',
    '{ name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 10 }',
    '{ name: "pillStrength", label: "Pill Strength (mg)", type: "number", min: 1, max: 1000, defaultValue: 500 }',
    '{ name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 2 }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const pillStrength = inputs.pillStrength as number;
    const frequency = inputs.frequency as number;
    const totalDailyDose = bodyWeight * doseRate * frequency;
    const singleDose = bodyWeight * doseRate;
    const pillsPerDose = singleDose / pillStrength;
    const pillsPerDay = pillsPerDose * frequency;
    return {
      primary: { label: "Pills per Dose", value: formatNumber(Math.ceil(pillsPerDose * 10) / 10) },
      details: [
        { label: "Single Dose", value: formatNumber(singleDose) + " mg" },
        { label: "Total Daily Dose", value: formatNumber(totalDailyDose) + " mg" },
        { label: "Pills per Day", value: formatNumber(Math.ceil(pillsPerDay * 10) / 10) },
        { label: "Doses per Day", value: formatNumber(frequency) }
      ]
    };
  }`,
  [
    { q: "How is pill dosage calculated by weight?", a: "Multiply the dose rate (mg/kg) by body weight (kg) to get the dose in mg." },
    { q: "Should I round pill dosages up or down?", a: "Always consult your prescriber before rounding doses, especially with potent drugs." },
    { q: "What if the calculated dose is between pill sizes?", a: "A pharmacist can advise whether to round up, round down, or split tablets." }
  ],
  "Pills per Dose = (Body Weight x Dose Rate) / Pill Strength",
  ["liquid-medication-calculator", "medication-half-life-calculator", "iv-drip-rate-calculator"]
);

add(
  "liquid-medication-calculator",
  "Liquid Medication Calculator",
  "Calculate liquid medication dose by body weight and concentration.",
  "Health",
  "health",
  "H",
  ["liquid medication dose", "suspension dosage calculator", "pediatric liquid dose"],
  [
    '{ name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 15 }',
    '{ name: "concentration", label: "Concentration (mg/mL)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const concentration = inputs.concentration as number;
    const frequency = inputs.frequency as number;
    const singleDoseMg = bodyWeight * doseRate;
    const singleDoseMl = singleDoseMg / concentration;
    const dailyMl = singleDoseMl * frequency;
    const dailyMg = singleDoseMg * frequency;
    return {
      primary: { label: "Volume per Dose", value: formatNumber(Math.round(singleDoseMl * 10) / 10) + " mL" },
      details: [
        { label: "Dose per Administration", value: formatNumber(singleDoseMg) + " mg" },
        { label: "Total Daily Volume", value: formatNumber(Math.round(dailyMl * 10) / 10) + " mL" },
        { label: "Total Daily Dose", value: formatNumber(dailyMg) + " mg" },
        { label: "Frequency", value: frequency + " times per day" }
      ]
    };
  }`,
  [
    { q: "How do you calculate liquid medication dosage?", a: "Divide the required dose (mg) by the concentration (mg/mL) to get the volume." },
    { q: "Why are liquid medications used for children?", a: "Liquids allow precise dosing for smaller body weights and are easier to swallow." },
    { q: "How should liquid medications be measured?", a: "Use an oral syringe or dosing cup for accuracy instead of household spoons." }
  ],
  "Volume (mL) = (Body Weight x Dose Rate) / Concentration",
  ["pill-dosage-calculator", "iv-drip-rate-calculator", "medication-half-life-calculator"]
);

add(
  "iv-drip-rate-calculator",
  "IV Drip Rate Calculator",
  "Calculate intravenous drip rate in drops per minute.",
  "Health",
  "health",
  "H",
  ["iv drip rate", "drops per minute calculator", "intravenous flow rate"],
  [
    '{ name: "volume", label: "Total Volume (mL)", type: "number", min: 10, max: 5000, defaultValue: 1000 }',
    '{ name: "hours", label: "Infusion Time (hours)", type: "number", min: 0.5, max: 48, defaultValue: 8 }',
    '{ name: "dropFactor", label: "Drop Factor (gtt/mL)", type: "select", options: [{ value: "10", label: "10 gtt/mL (Macro)" }, { value: "15", label: "15 gtt/mL (Macro)" }, { value: "20", label: "20 gtt/mL (Macro)" }, { value: "60", label: "60 gtt/mL (Micro)" }] }'
  ],
  `(inputs) => {
    const volume = inputs.volume as number;
    const hours = inputs.hours as number;
    const dropFactor = parseInt(inputs.dropFactor as string);
    const totalMinutes = hours * 60;
    const mlPerHour = volume / hours;
    const dropsPerMin = (volume * dropFactor) / totalMinutes;
    return {
      primary: { label: "Drip Rate", value: formatNumber(Math.round(dropsPerMin)) + " gtt/min" },
      details: [
        { label: "Flow Rate", value: formatNumber(Math.round(mlPerHour * 10) / 10) + " mL/hr" },
        { label: "Total Volume", value: formatNumber(volume) + " mL" },
        { label: "Infusion Time", value: hours + " hours" },
        { label: "Drop Factor", value: dropFactor + " gtt/mL" }
      ]
    };
  }`,
  [
    { q: "How do you calculate IV drip rate?", a: "Drip rate equals volume times drop factor divided by time in minutes." },
    { q: "What is the difference between macro and micro drip?", a: "Macro drip sets deliver 10 to 20 gtt/mL while micro drip delivers 60 gtt/mL." },
    { q: "Why is accurate IV drip rate important?", a: "Incorrect rates can cause fluid overload or under-delivery of critical medications." }
  ],
  "Drip Rate (gtt/min) = (Volume x Drop Factor) / (Hours x 60)",
  ["liquid-medication-calculator", "pill-dosage-calculator", "medication-half-life-calculator"]
);

add(
  "medication-half-life-calculator",
  "Medication Half Life Calculator",
  "Estimate drug clearance time based on half-life and doses taken.",
  "Health",
  "health",
  "H",
  ["drug half life calculator", "medication clearance time", "drug elimination rate"],
  [
    '{ name: "halfLife", label: "Half-Life (hours)", type: "number", min: 0.5, max: 200, defaultValue: 6 }',
    '{ name: "dose", label: "Last Dose (mg)", type: "number", min: 1, max: 5000, defaultValue: 500 }',
    '{ name: "targetPercent", label: "Clearance Target (%)", type: "number", min: 90, max: 99, defaultValue: 97 }'
  ],
  `(inputs) => {
    const halfLife = inputs.halfLife as number;
    const dose = inputs.dose as number;
    const targetPercent = inputs.targetPercent as number;
    const targetFraction = 1 - (targetPercent / 100);
    const halfLives = Math.log(targetFraction) / Math.log(0.5);
    const totalHours = halfLives * halfLife;
    const totalDays = totalHours / 24;
    const remainingMg = dose * targetFraction;
    return {
      primary: { label: "Time to Clear", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Half-Lives Needed", value: formatNumber(Math.round(halfLives * 10) / 10) },
        { label: "Clearance Time in Days", value: formatNumber(Math.round(totalDays * 10) / 10) + " days" },
        { label: "Remaining in Body", value: formatNumber(Math.round(remainingMg * 100) / 100) + " mg" },
        { label: "Target Clearance", value: targetPercent + "%" }
      ]
    };
  }`,
  [
    { q: "How many half-lives does it take to clear a drug?", a: "It takes about 5 half-lives to clear approximately 97% of a drug from the body." },
    { q: "What affects drug half-life?", a: "Liver function, kidney function, age, and body composition all affect half-life." },
    { q: "Does half-life determine dosing frequency?", a: "Yes, drugs with shorter half-lives generally need to be taken more frequently." }
  ],
  "Hours = (ln(1 - Target%/100) / ln(0.5)) x Half-Life",
  ["pill-dosage-calculator", "liquid-medication-calculator", "iv-drip-rate-calculator"]
);

add(
  "prescription-cost-calculator",
  "Prescription Cost Calculator",
  "Estimate out-of-pocket prescription cost with insurance and coupons.",
  "Finance",
  "finance",
  "$",
  ["prescription cost estimate", "rx cost with insurance", "medication price calculator"],
  [
    '{ name: "retailPrice", label: "Retail Price ($)", type: "number", min: 1, max: 10000, defaultValue: 200 }',
    '{ name: "insuranceType", label: "Insurance Tier", type: "select", options: [{ value: "1", label: "Tier 1 Generic" }, { value: "2", label: "Tier 2 Preferred Brand" }, { value: "3", label: "Tier 3 Non-Preferred" }, { value: "4", label: "No Insurance" }] }',
    '{ name: "coupon", label: "Coupon Discount ($)", type: "number", min: 0, max: 5000, defaultValue: 0 }',
    '{ name: "quantity", label: "Quantity (days supply)", type: "number", min: 7, max: 90, defaultValue: 30 }'
  ],
  `(inputs) => {
    const retailPrice = inputs.retailPrice as number;
    const insuranceType = inputs.insuranceType as string;
    const coupon = inputs.coupon as number;
    const quantity = inputs.quantity as number;
    const copays: Record<string, number> = { "1": 10, "2": 35, "3": 70, "4": 0 };
    const copay = copays[insuranceType] || 0;
    let cost = retailPrice;
    if (insuranceType !== "4") {
      cost = copay;
    }
    cost = Math.max(0, cost - coupon);
    const annualCost = cost * (365 / quantity);
    const tierName: Record<string, string> = { "1": "Tier 1 Generic", "2": "Tier 2 Preferred", "3": "Tier 3 Non-Preferred", "4": "No Insurance" };
    return {
      primary: { label: "Your Cost", value: "$" + formatNumber(cost) },
      details: [
        { label: "Insurance Tier", value: tierName[insuranceType] || "None" },
        { label: "Retail Price", value: "$" + formatNumber(retailPrice) },
        { label: "Copay", value: "$" + formatNumber(copay) },
        { label: "Coupon Savings", value: "$" + formatNumber(coupon) },
        { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    { q: "How can I reduce my prescription costs?", a: "Use generics, manufacturer coupons, or prescription discount cards to save money." },
    { q: "What are insurance drug tiers?", a: "Tiers rank drugs by cost: Tier 1 generics are cheapest, Tier 3 brands cost the most." },
    { q: "Is a 90-day supply cheaper than 30-day?", a: "Yes, 90-day supplies usually offer lower per-dose costs at mail-order pharmacies." }
  ],
  "Cost = Copay (by tier) or Retail Price (no insurance) - Coupon Discount",
  ["pill-dosage-calculator", "liquid-medication-calculator", "medication-half-life-calculator"]
);

add(
  "eyeglass-prescription-calculator",
  "Eyeglass Prescription Calculator",
  "Estimate lens thickness based on prescription strength and lens type.",
  "Health",
  "health",
  "H",
  ["eyeglass lens thickness", "prescription lens calculator", "lens index guide"],
  [
    '{ name: "sphere", label: "Sphere Power (diopters)", type: "number", min: -20, max: 20, defaultValue: -3 }',
    '{ name: "lensIndex", label: "Lens Index", type: "select", options: [{ value: "1", label: "1.50 Standard" }, { value: "2", label: "1.59 Polycarbonate" }, { value: "3", label: "1.67 High Index" }, { value: "4", label: "1.74 Ultra High Index" }] }',
    '{ name: "frameWidth", label: "Frame Lens Width (mm)", type: "number", min: 40, max: 70, defaultValue: 52 }'
  ],
  `(inputs) => {
    const sphere = inputs.sphere as number;
    const lensIndex = inputs.lensIndex as string;
    const frameWidth = inputs.frameWidth as number;
    const indexValues: Record<string, number> = { "1": 1.50, "2": 1.59, "3": 1.67, "4": 1.74 };
    const indexNames: Record<string, string> = { "1": "1.50 Standard", "2": "1.59 Polycarbonate", "3": "1.67 High Index", "4": "1.74 Ultra High Index" };
    const idx = indexValues[lensIndex] || 1.50;
    const absSphere = Math.abs(sphere);
    const radius = frameWidth / 2;
    const edgeThickness = sphere < 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const centerThickness = sphere > 0 ? 1.5 + (absSphere * radius) / (2 * (idx - 1) * 10) : 1.5;
    const maxThickness = Math.max(edgeThickness, centerThickness);
    return {
      primary: { label: "Max Lens Thickness", value: formatNumber(Math.round(maxThickness * 10) / 10) + " mm" },
      details: [
        { label: "Lens Index", value: indexNames[lensIndex] || "Standard" },
        { label: "Edge Thickness", value: formatNumber(Math.round(edgeThickness * 10) / 10) + " mm" },
        { label: "Center Thickness", value: formatNumber(Math.round(centerThickness * 10) / 10) + " mm" },
        { label: "Sphere Power", value: sphere + " D" }
      ]
    };
  }`,
  [
    { q: "What lens index should I choose?", a: "Prescriptions over -4 or +4 benefit from 1.67 or 1.74 high index lenses." },
    { q: "Are thinner lenses worth the extra cost?", a: "For strong prescriptions, high index lenses are lighter and more comfortable." },
    { q: "Does frame size affect lens thickness?", a: "Yes, larger frames require thicker lenses, especially for strong prescriptions." }
  ],
  "Thickness = Base + (|Sphere| x Radius) / (2 x (Index - 1) x 10)",
  ["contact-lens-cost-calculator", "pupillary-distance-calculator", "reading-glasses-strength-calculator"]
);

add(
  "contact-lens-cost-calculator",
  "Contact Lens Cost Calculator",
  "Calculate annual contact lens costs by type and replacement schedule.",
  "Finance",
  "finance",
  "$",
  ["contact lens cost", "annual contacts price", "daily vs monthly lens cost"],
  [
    '{ name: "lensType", label: "Lens Type", type: "select", options: [{ value: "1", label: "Daily Disposable" }, { value: "2", label: "Bi-Weekly" }, { value: "3", label: "Monthly" }] }',
    '{ name: "boxPrice", label: "Price per Box ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "lensesPerBox", label: "Lenses per Box", type: "number", min: 3, max: 90, defaultValue: 30 }',
    '{ name: "solutionMonthly", label: "Solution Cost per Month ($)", type: "number", min: 0, max: 30, defaultValue: 8 }'
  ],
  `(inputs) => {
    const lensType = inputs.lensType as string;
    const boxPrice = inputs.boxPrice as number;
    const lensesPerBox = inputs.lensesPerBox as number;
    const solutionMonthly = inputs.solutionMonthly as number;
    const names: Record<string, string> = { "1": "Daily Disposable", "2": "Bi-Weekly", "3": "Monthly" };
    let lensesPerYear = 0;
    if (lensType === "1") lensesPerYear = 730;
    else if (lensType === "2") lensesPerYear = 52;
    else lensesPerYear = 24;
    const boxesNeeded = Math.ceil(lensesPerYear / lensesPerBox);
    const lensCost = boxesNeeded * boxPrice;
    const solutionCost = lensType === "1" ? 0 : solutionMonthly * 12;
    const totalAnnual = lensCost + solutionCost;
    return {
      primary: { label: "Annual Cost", value: "$" + formatNumber(totalAnnual) },
      details: [
        { label: "Lens Type", value: names[lensType] || "Monthly" },
        { label: "Boxes per Year", value: formatNumber(boxesNeeded) },
        { label: "Lens Cost", value: "$" + formatNumber(lensCost) },
        { label: "Solution Cost", value: "$" + formatNumber(solutionCost) }
      ]
    };
  }`,
  [
    { q: "Are daily contacts more expensive than monthlies?", a: "Daily contacts cost more per lens but eliminate solution costs and reduce infection risk." },
    { q: "How many boxes of contacts do I need per year?", a: "It depends on the type: daily users need about 24 boxes, monthly users need about 8." },
    { q: "Does insurance cover contact lenses?", a: "Vision insurance often provides an annual contact lens allowance of $100 to $200." }
  ],
  "Annual Cost = (Boxes Needed x Box Price) + (Solution Cost x 12)",
  ["eyeglass-prescription-calculator", "eye-exam-cost-calculator", "pupillary-distance-calculator"]
);

add(
  "pupillary-distance-calculator",
  "Pupillary Distance Calculator",
  "Estimate pupillary distance from frame measurements and fit.",
  "Health",
  "health",
  "H",
  ["pupillary distance measurement", "PD calculator glasses", "interpupillary distance"],
  [
    '{ name: "rightPD", label: "Right Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 31 }',
    '{ name: "leftPD", label: "Left Eye PD (mm)", type: "number", min: 20, max: 45, defaultValue: 32 }',
    '{ name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "1", label: "Child (4-12)" }, { value: "2", label: "Teen (13-17)" }, { value: "3", label: "Adult (18+)" }] }'
  ],
  `(inputs) => {
    const rightPD = inputs.rightPD as number;
    const leftPD = inputs.leftPD as number;
    const ageGroup = inputs.ageGroup as string;
    const totalPD = rightPD + leftPD;
    const ranges: Record<string, number[]> = { "1": [43, 54], "2": [54, 62], "3": [57, 72] };
    const range = ranges[ageGroup] || [57, 72];
    let status = "Within Normal Range";
    if (totalPD < range[0]) status = "Below Normal Range";
    else if (totalPD > range[1]) status = "Above Normal Range";
    const groupNames: Record<string, string> = { "1": "Child", "2": "Teen", "3": "Adult" };
    return {
      primary: { label: "Total PD", value: totalPD + " mm" },
      details: [
        { label: "Right Eye PD", value: rightPD + " mm" },
        { label: "Left Eye PD", value: leftPD + " mm" },
        { label: "Normal Range", value: range[0] + " - " + range[1] + " mm" },
        { label: "Status", value: status },
        { label: "Age Group", value: groupNames[ageGroup] || "Adult" }
      ]
    };
  }`,
  [
    { q: "What is pupillary distance used for?", a: "PD is used to align the optical center of lenses with your pupils for clear vision." },
    { q: "What is the average adult PD?", a: "The average adult PD ranges from 57 to 65 mm, with 63 mm being common." },
    { q: "Can I measure my own PD?", a: "Yes, you can use a ruler and mirror or a smartphone app to measure your PD at home." }
  ],
  "Total PD = Right Eye PD + Left Eye PD",
  ["eyeglass-prescription-calculator", "reading-glasses-strength-calculator", "contact-lens-cost-calculator"]
);

add(
  "reading-glasses-strength-calculator",
  "Reading Glasses Strength Calculator",
  "Estimate reading lens power based on age and reading distance.",
  "Health",
  "health",
  "H",
  ["reading glasses power", "magnification strength by age", "presbyopia lens calculator"],
  [
    '{ name: "age", label: "Age (years)", type: "number", min: 35, max: 80, defaultValue: 50 }',
    '{ name: "readingDistance", label: "Preferred Reading Distance (inches)", type: "number", min: 8, max: 24, defaultValue: 14 }',
    '{ name: "currentRx", label: "Current Distance Rx (diopters)", type: "number", min: -10, max: 10, defaultValue: 0 }'
  ],
  `(inputs) => {
    const age = inputs.age as number;
    const readingDistance = inputs.readingDistance as number;
    const currentRx = inputs.currentRx as number;
    let addPower = 0;
    if (age < 40) addPower = 0.75;
    else if (age < 45) addPower = 1.0;
    else if (age < 50) addPower = 1.5;
    else if (age < 55) addPower = 2.0;
    else if (age < 60) addPower = 2.25;
    else addPower = 2.5;
    const distanceMeters = readingDistance * 0.0254;
    const diopterForDistance = 1 / distanceMeters;
    const adjustedAdd = Math.round((addPower + (diopterForDistance - 2.5) * 0.25) * 4) / 4;
    const finalAdd = Math.max(0.75, Math.min(3.5, adjustedAdd));
    return {
      primary: { label: "Suggested Add Power", value: "+" + finalAdd.toFixed(2) + " D" },
      details: [
        { label: "Age-Based Power", value: "+" + addPower.toFixed(2) + " D" },
        { label: "Reading Distance", value: readingDistance + " inches" },
        { label: "Current Distance Rx", value: currentRx.toFixed(2) + " D" }
      ]
    };
  }`,
  [
    { q: "At what age do you need reading glasses?", a: "Most people begin needing reading glasses between ages 40 and 45 due to presbyopia." },
    { q: "How do I choose reading glasses strength?", a: "Start with lower power and increase until text is clear at your preferred distance." },
    { q: "Can reading glasses damage your eyes?", a: "No, wearing reading glasses does not damage your eyes or worsen your vision." }
  ],
  "Add Power = Age-based baseline adjusted for preferred reading distance",
  ["eyeglass-prescription-calculator", "pupillary-distance-calculator", "blue-light-exposure-calculator"]
);

add(
  "eye-exam-cost-calculator",
  "Eye Exam Cost Calculator",
  "Estimate eye exam costs based on exam type and insurance coverage.",
  "Finance",
  "finance",
  "$",
  ["eye exam cost", "vision exam price", "optometrist visit cost"],
  [
    '{ name: "examType", label: "Exam Type", type: "select", options: [{ value: "1", label: "Routine Vision" }, { value: "2", label: "Contact Lens Fitting" }, { value: "3", label: "Comprehensive Medical" }] }',
    '{ name: "insurance", label: "Vision Insurance", type: "select", options: [{ value: "0", label: "No Insurance" }, { value: "1", label: "Vision Plan" }, { value: "2", label: "Medical Insurance" }] }',
    '{ name: "additionalTests", label: "Additional Tests", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Retinal Imaging ($40)" }, { value: "2", label: "Visual Field Test ($50)" }, { value: "3", label: "Both ($90)" }] }'
  ],
  `(inputs) => {
    const examType = inputs.examType as string;
    const insurance = inputs.insurance as string;
    const additionalTests = inputs.additionalTests as string;
    const examPrices: Record<string, number> = { "1": 100, "2": 150, "3": 250 };
    const examNames: Record<string, string> = { "1": "Routine Vision", "2": "Contact Lens Fitting", "3": "Comprehensive Medical" };
    const testCosts: Record<string, number> = { "0": 0, "1": 40, "2": 50, "3": 90 };
    const baseCost = examPrices[examType] || 100;
    const testCost = testCosts[additionalTests] || 0;
    let copay = 0;
    let coverageDesc = "No Insurance";
    if (insurance === "1") { copay = baseCost - 15; coverageDesc = "Vision Plan"; }
    else if (insurance === "2") { copay = baseCost - 35; coverageDesc = "Medical Insurance"; }
    const oop = (baseCost - copay) + testCost;
    return {
      primary: { label: "Your Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Exam Type", value: examNames[examType] || "Routine" },
        { label: "Base Exam Price", value: "$" + formatNumber(baseCost) },
        { label: "Additional Tests", value: "$" + formatNumber(testCost) },
        { label: "Coverage", value: coverageDesc },
        { label: "Insurance Covers", value: "$" + formatNumber(copay) }
      ]
    };
  }`,
  [
    { q: "How much does an eye exam cost without insurance?", a: "A routine eye exam typically costs $75 to $200 without insurance coverage." },
    { q: "How often should I get an eye exam?", a: "Adults should get a comprehensive eye exam every 1 to 2 years." },
    { q: "Does vision insurance cover contact lens fittings?", a: "Many vision plans cover part of the contact lens fitting fee but may not cover it fully." }
  ],
  "Your Cost = (Base Price - Insurance Coverage) + Additional Test Costs",
  ["contact-lens-cost-calculator", "eyeglass-prescription-calculator", "pupillary-distance-calculator"]
);

add(
  "blue-light-exposure-calculator",
  "Blue Light Exposure Calculator",
  "Estimate daily blue light dose from screen time and devices.",
  "Health",
  "health",
  "H",
  ["blue light exposure", "screen time blue light", "digital eye strain calculator"],
  [
    '{ name: "phoneHours", label: "Phone Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 4 }',
    '{ name: "computerHours", label: "Computer Screen Time (hours/day)", type: "number", min: 0, max: 18, defaultValue: 6 }',
    '{ name: "tvHours", label: "TV Screen Time (hours/day)", type: "number", min: 0, max: 12, defaultValue: 2 }',
    '{ name: "blueFilter", label: "Blue Light Filter", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Software Filter" }, { value: "2", label: "Blue Light Glasses" }] }'
  ],
  `(inputs) => {
    const phoneHours = inputs.phoneHours as number;
    const computerHours = inputs.computerHours as number;
    const tvHours = inputs.tvHours as number;
    const blueFilter = inputs.blueFilter as string;
    const phoneBlue = phoneHours * 0.9;
    const computerBlue = computerHours * 0.7;
    const tvBlue = tvHours * 0.4;
    let totalBlue = phoneBlue + computerBlue + tvBlue;
    let filterReduction = 0;
    if (blueFilter === "1") filterReduction = 0.30;
    else if (blueFilter === "2") filterReduction = 0.50;
    const filteredBlue = totalBlue * (1 - filterReduction);
    const totalScreenTime = phoneHours + computerHours + tvHours;
    let riskLevel = "Low";
    if (filteredBlue > 8) riskLevel = "High";
    else if (filteredBlue > 5) riskLevel = "Moderate";
    return {
      primary: { label: "Daily Blue Light Score", value: formatNumber(Math.round(filteredBlue * 10) / 10) },
      details: [
        { label: "Total Screen Time", value: formatNumber(totalScreenTime) + " hours" },
        { label: "Phone Contribution", value: formatNumber(Math.round(phoneBlue * 10) / 10) },
        { label: "Computer Contribution", value: formatNumber(Math.round(computerBlue * 10) / 10) },
        { label: "TV Contribution", value: formatNumber(Math.round(tvBlue * 10) / 10) },
        { label: "Filter Reduction", value: (filterReduction * 100) + "%" },
        { label: "Risk Level", value: riskLevel }
      ]
    };
  }`,
  [
    { q: "Does blue light from screens damage your eyes?", a: "Research is ongoing, but prolonged exposure may contribute to digital eye strain." },
    { q: "Do blue light glasses actually work?", a: "Blue light glasses can reduce exposure by up to 50% and may reduce eye fatigue." },
    { q: "How can I reduce blue light exposure?", a: "Use night mode settings, take screen breaks, and consider blue light filtering glasses." }
  ],
  "Blue Light Score = (Phone x 0.9 + Computer x 0.7 + TV x 0.4) x (1 - Filter%)",
  ["reading-glasses-strength-calculator", "eyeglass-prescription-calculator", "eye-exam-cost-calculator"]
);
