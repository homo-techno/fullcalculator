add('board-foot-calculator', 'Board Foot Calculator',
  'Calculate board feet from lumber thickness, width, and length.',
  'Everyday', 'everyday', '~',
  ['board foot', 'lumber calculator', 'board feet'],
  [
    '{ name: "thickness", label: "Thickness (inches)", type: "number", min: 0.25, max: 12, defaultValue: 1 }',
    '{ name: "width", label: "Width (inches)", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "length", label: "Length (feet)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "qty", label: "Number of Boards", type: "number", min: 1, max: 500, defaultValue: 1 }',
  ],
  `(inputs) => {
      const t = inputs.thickness as number;
      const w = inputs.width as number;
      const l = inputs.length as number;
      const q = inputs.qty as number;
      if (!t || !w || !l || !q) return null;
      const bf = (t * w * l) / 12;
      const total = Math.round(bf * q * 100) / 100;
      return {
        primary: { label: "Total Board Feet", value: formatNumber(total) + " BF" },
        details: [
          { label: "Board Feet Per Piece", value: formatNumber(Math.round(bf * 100) / 100) + " BF" },
          { label: "Number of Boards", value: formatNumber(q) },
        ],
      };
  }`,
  [{ q: 'What is a board foot?', a: 'A board foot is a volume unit equal to 1 inch thick by 12 inches wide by 12 inches long.' },
   { q: 'How do I price lumber?', a: 'Multiply the total board feet by the price per board foot for your species.' }],
  'Board Feet = (Thickness x Width x Length) / 12',
  []
);

add('plywood-sheet-calculator', 'Plywood Sheet Calculator',
  'Determine how many plywood sheets you need for a project.',
  'Everyday', 'everyday', '~',
  ['plywood calculator', 'sheet goods calculator'],
  [
    '{ name: "areaLength", label: "Project Length (ft)", type: "number", min: 1, max: 200, defaultValue: 12 }',
    '{ name: "areaWidth", label: "Project Width (ft)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "sheetL", label: "Sheet Length (ft)", type: "number", min: 1, max: 10, defaultValue: 8 }',
    '{ name: "sheetW", label: "Sheet Width (ft)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "waste", label: "Waste Factor (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const al = inputs.areaLength as number;
      const aw = inputs.areaWidth as number;
      const sl = inputs.sheetL as number;
      const sw = inputs.sheetW as number;
      const wf = inputs.waste as number;
      if (!al || !aw || !sl || !sw) return null;
      const totalArea = al * aw;
      const sheetArea = sl * sw;
      const sheetsRaw = totalArea / sheetArea;
      const sheets = Math.ceil(sheetsRaw * (1 + wf / 100));
      return {
        primary: { label: "Sheets Needed", value: formatNumber(sheets) },
        details: [
          { label: "Total Area", value: formatNumber(totalArea) + " sq ft" },
          { label: "Area Per Sheet", value: formatNumber(sheetArea) + " sq ft" },
          { label: "Waste Included", value: wf + "%" },
        ],
      };
  }`,
  [{ q: 'What is the standard plywood sheet size?', a: 'The standard size is 4 feet by 8 feet, which equals 32 square feet.' },
   { q: 'How much waste should I plan for?', a: 'Plan for 10 to 15 percent waste for most rectangular projects.' }],
  'Sheets = ceil((Area / Sheet Area) x (1 + Waste%))',
  []
);

add('wood-shrinkage-calculator', 'Wood Shrinkage Calculator',
  'Estimate dimensional change in wood from moisture shifts.',
  'Science', 'science', 'A',
  ['wood shrinkage', 'moisture content calculator'],
  [
    '{ name: "dimension", label: "Current Dimension (inches)", type: "number", min: 0.1, max: 48, defaultValue: 6 }',
    '{ name: "mcStart", label: "Starting Moisture Content (%)", type: "number", min: 0, max: 30, defaultValue: 12 }',
    '{ name: "mcEnd", label: "Final Moisture Content (%)", type: "number", min: 0, max: 30, defaultValue: 7 }',
    '{ name: "coeff", label: "Shrinkage Coefficient (%)", type: "number", min: 0.1, max: 0.5, defaultValue: 0.25 }',
  ],
  `(inputs) => {
      const dim = inputs.dimension as number;
      const mcS = inputs.mcStart as number;
      const mcE = inputs.mcEnd as number;
      const co = inputs.coeff as number;
      if (!dim || mcS === undefined || mcE === undefined || !co) return null;
      const change = dim * (mcS - mcE) * (co / 100);
      const finalDim = Math.round((dim - change) * 1000) / 1000;
      const changePct = Math.round(((change / dim) * 100) * 100) / 100;
      return {
        primary: { label: "Final Dimension", value: formatNumber(finalDim) + " in" },
        details: [
          { label: "Dimensional Change", value: formatNumber(Math.round(Math.abs(change) * 1000) / 1000) + " in" },
          { label: "Percentage Change", value: formatNumber(changePct) + "%" },
          { label: "Direction", value: change > 0 ? "Shrinkage" : "Expansion" },
        ],
      };
  }`,
  [{ q: 'What causes wood to shrink?', a: 'Wood shrinks as it loses moisture below the fiber saturation point of about 28%.' },
   { q: 'Which direction shrinks more?', a: 'Tangential shrinkage is roughly twice the radial shrinkage.' }],
  'Change = Dimension x (MC Start - MC End) x Coefficient',
  []
);

add('wood-stain-coverage-calculator', 'Wood Stain Coverage Calculator',
  'Calculate the amount of stain needed for a wood surface.',
  'Everyday', 'everyday', '~',
  ['wood stain calculator', 'stain coverage'],
  [
    '{ name: "area", label: "Surface Area (sq ft)", type: "number", min: 1, max: 5000, defaultValue: 200 }',
    '{ name: "coverage", label: "Stain Coverage (sq ft/gal)", type: "number", min: 50, max: 600, defaultValue: 250 }',
    '{ name: "coats", label: "Number of Coats", type: "number", min: 1, max: 5, defaultValue: 2 }',
  ],
  `(inputs) => {
      const area = inputs.area as number;
      const cov = inputs.coverage as number;
      const coats = inputs.coats as number;
      if (!area || !cov || !coats) return null;
      const gallons = Math.round((area * coats / cov) * 100) / 100;
      const quarts = Math.ceil(gallons * 4);
      return {
        primary: { label: "Stain Needed", value: formatNumber(gallons) + " gal" },
        details: [
          { label: "Quarts Needed", value: formatNumber(quarts) },
          { label: "Total Coverage Area", value: formatNumber(area * coats) + " sq ft" },
          { label: "Coats", value: formatNumber(coats) },
        ],
      };
  }`,
  [{ q: 'How much area does a gallon of stain cover?', a: 'Most wood stains cover 200 to 300 square feet per gallon on smooth wood.' },
   { q: 'Do I need multiple coats of stain?', a: 'Two coats provide richer color and more consistent results.' }],
  'Gallons = (Area x Coats) / Coverage Per Gallon',
  []
);

add('dowel-joint-calculator', 'Dowel Joint Calculator',
  'Find the right dowel size and spacing for wood joints.',
  'Everyday', 'everyday', '~',
  ['dowel joint', 'dowel spacing calculator'],
  [
    '{ name: "boardThick", label: "Board Thickness (inches)", type: "number", min: 0.25, max: 4, defaultValue: 0.75 }',
    '{ name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 96, defaultValue: 24 }',
    '{ name: "spacing", label: "Dowel Spacing (inches)", type: "number", min: 1, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const thick = inputs.boardThick as number;
      const jl = inputs.jointLength as number;
      const sp = inputs.spacing as number;
      if (!thick || !jl || !sp) return null;
      const dowelDia = Math.round((thick / 2) * 8) / 8;
      const dowelDepth = Math.round(dowelDia * 3 * 100) / 100;
      const numDowels = Math.floor(jl / sp) + 1;
      return {
        primary: { label: "Recommended Dowel Diameter", value: formatNumber(dowelDia) + " in" },
        details: [
          { label: "Dowel Depth Per Side", value: formatNumber(dowelDepth) + " in" },
          { label: "Number of Dowels", value: formatNumber(numDowels) },
          { label: "Actual Spacing", value: formatNumber(Math.round((jl / (numDowels - 1)) * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'How do I choose dowel size?', a: 'Use a dowel diameter that is about half the board thickness.' },
   { q: 'How deep should dowel holes be?', a: 'Drill holes about 3 times the dowel diameter deep on each side.' }],
  'Dowel Diameter = Board Thickness / 2; Count = floor(Length / Spacing) + 1',
  []
);

add('miter-angle-calculator', 'Miter Angle Calculator',
  'Calculate miter saw angle for multi-sided corners.',
  'Math', 'math', '+',
  ['miter angle', 'miter saw calculator', 'corner angle'],
  [
    '{ name: "sides", label: "Number of Sides", type: "number", min: 3, max: 36, defaultValue: 4 }',
    '{ name: "cornerAngle", label: "Corner Angle Override (degrees)", type: "number", min: 0, max: 360, defaultValue: 0 }',
  ],
  `(inputs) => {
      const sides = inputs.sides as number;
      const override = inputs.cornerAngle as number;
      if (!sides) return null;
      const interiorAngle = override > 0 ? override : ((sides - 2) * 180) / sides;
      const miterAngle = Math.round((interiorAngle / 2) * 1000) / 1000;
      const sawSetting = Math.round((90 - miterAngle) * 1000) / 1000;
      return {
        primary: { label: "Miter Saw Setting", value: formatNumber(sawSetting) + " degrees" },
        details: [
          { label: "Interior Angle", value: formatNumber(interiorAngle) + " degrees" },
          { label: "Miter Angle", value: formatNumber(miterAngle) + " degrees" },
          { label: "Number of Sides", value: formatNumber(sides) },
        ],
      };
  }`,
  [{ q: 'What miter angle do I need for a square corner?', a: 'Set the miter saw to 45 degrees for a standard 90 degree corner.' },
   { q: 'How do I calculate a miter for an octagon?', a: 'An octagon has 135 degree interior angles so the saw setting is 22.5 degrees.' }],
  'Saw Setting = 90 - (Interior Angle / 2)',
  []
);

add('wood-screw-pilot-hole-calculator', 'Wood Screw Pilot Hole Calculator',
  'Determine the correct pilot hole diameter for wood screws.',
  'Everyday', 'everyday', '~',
  ['pilot hole', 'wood screw calculator'],
  [
    '{ name: "screwGauge", label: "Screw Gauge Number", type: "number", min: 2, max: 14, defaultValue: 8 }',
    '{ name: "woodType", label: "Wood Type", type: "select", options: [{ value: "soft", label: "Softwood" }, { value: "hard", label: "Hardwood" }], defaultValue: "soft" }',
  ],
  `(inputs) => {
      const gauge = inputs.screwGauge as number;
      const wood = inputs.woodType as string;
      if (!gauge) return null;
      const majorDia = 0.06 + gauge * 0.013;
      const softPilot = Math.round(majorDia * 0.65 * 1000) / 1000;
      const hardPilot = Math.round(majorDia * 0.85 * 1000) / 1000;
      const pilot = wood === "hard" ? hardPilot : softPilot;
      const pilot64 = Math.round(pilot * 64);
      return {
        primary: { label: "Pilot Hole Diameter", value: formatNumber(pilot) + " in (" + pilot64 + "/64)" },
        details: [
          { label: "Screw Major Diameter", value: formatNumber(Math.round(majorDia * 1000) / 1000) + " in" },
          { label: "Wood Type", value: wood === "hard" ? "Hardwood" : "Softwood" },
          { label: "Ratio Used", value: wood === "hard" ? "85%" : "65%" },
        ],
      };
  }`,
  [{ q: 'Do I always need a pilot hole?', a: 'Hardwoods always need pilot holes. Softwoods benefit from them to prevent splitting.' },
   { q: 'What happens without a pilot hole?', a: 'The wood can split, especially near edges, and the screw may not seat properly.' }],
  'Pilot = Major Diameter x Factor (65% softwood, 85% hardwood)',
  []
);

add('weld-filler-metal-calculator', 'Weld Filler Metal Calculator',
  'Estimate filler metal weight for a welding joint.',
  'Science', 'science', 'A',
  ['weld filler metal', 'welding rod calculator'],
  [
    '{ name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 1000, defaultValue: 24 }',
    '{ name: "crossSection", label: "Weld Cross Section (sq in)", type: "number", min: 0.001, max: 5, defaultValue: 0.1 }',
    '{ name: "density", label: "Metal Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 }',
    '{ name: "waste", label: "Waste Factor (%)", type: "number", min: 0, max: 50, defaultValue: 15 }',
  ],
  `(inputs) => {
      const jl = inputs.jointLength as number;
      const cs = inputs.crossSection as number;
      const den = inputs.density as number;
      const wf = inputs.waste as number;
      if (!jl || !cs || !den) return null;
      const volume = jl * cs;
      const weightNet = volume * den;
      const weightTotal = Math.round(weightNet * (1 + wf / 100) * 1000) / 1000;
      return {
        primary: { label: "Filler Metal Needed", value: formatNumber(weightTotal) + " lb" },
        details: [
          { label: "Net Weight", value: formatNumber(Math.round(weightNet * 1000) / 1000) + " lb" },
          { label: "Weld Volume", value: formatNumber(Math.round(volume * 1000) / 1000) + " cu in" },
          { label: "Waste Factor", value: wf + "%" },
        ],
      };
  }`,
  [{ q: 'What density should I use for steel?', a: 'Mild steel has a density of about 0.283 pounds per cubic inch.' },
   { q: 'Why add a waste factor?', a: 'Waste accounts for spatter, stub ends, and grinding losses during welding.' }],
  'Weight = Joint Length x Cross Section x Density x (1 + Waste%)',
  []
);

add('weld-heat-input-calculator', 'Weld Heat Input Calculator',
  'Calculate heat input for arc welding processes.',
  'Science', 'science', 'A',
  ['weld heat input', 'welding energy calculator'],
  [
    '{ name: "voltage", label: "Arc Voltage (V)", type: "number", min: 10, max: 50, defaultValue: 25 }',
    '{ name: "amperage", label: "Welding Current (A)", type: "number", min: 50, max: 500, defaultValue: 200 }',
    '{ name: "travelSpeed", label: "Travel Speed (in/min)", type: "number", min: 1, max: 60, defaultValue: 10 }',
    '{ name: "efficiency", label: "Process Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 80 }',
  ],
  `(inputs) => {
      const v = inputs.voltage as number;
      const a = inputs.amperage as number;
      const ts = inputs.travelSpeed as number;
      const eff = inputs.efficiency as number;
      if (!v || !a || !ts || !eff) return null;
      const heatRaw = (v * a * 60) / ts;
      const heatNet = Math.round(heatRaw * (eff / 100));
      const kjPerIn = Math.round(heatNet / 1000 * 100) / 100;
      return {
        primary: { label: "Heat Input", value: formatNumber(kjPerIn) + " kJ/in" },
        details: [
          { label: "Gross Heat Input", value: formatNumber(Math.round(heatRaw / 1000 * 100) / 100) + " kJ/in" },
          { label: "Arc Power", value: formatNumber(v * a) + " W" },
          { label: "Efficiency", value: eff + "%" },
        ],
      };
  }`,
  [{ q: 'Why does heat input matter?', a: 'Heat input affects the weld microstructure, distortion, and residual stress.' },
   { q: 'What is a typical efficiency for MIG welding?', a: 'MIG or GMAW typically has a process efficiency of 80 to 85 percent.' }],
  'Heat Input (kJ/in) = (Voltage x Amps x 60 / Travel Speed) x Efficiency / 1000',
  []
);

add('metal-weight-calculator', 'Metal Weight Calculator',
  'Calculate the weight of a metal piece by shape and alloy.',
  'Science', 'science', 'A',
  ['metal weight', 'steel weight calculator'],
  [
    '{ name: "shape", label: "Shape", type: "select", options: [{ value: "flat", label: "Flat Plate" }, { value: "round", label: "Round Bar" }, { value: "tube", label: "Round Tube" }], defaultValue: "flat" }',
    '{ name: "length", label: "Length (inches)", type: "number", min: 0.1, max: 1000, defaultValue: 24 }',
    '{ name: "dim1", label: "Width or OD (inches)", type: "number", min: 0.01, max: 100, defaultValue: 4 }',
    '{ name: "dim2", label: "Thickness or Wall (inches)", type: "number", min: 0.01, max: 20, defaultValue: 0.25 }',
    '{ name: "density", label: "Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 }',
  ],
  `(inputs) => {
      const shape = inputs.shape as string;
      const len = inputs.length as number;
      const d1 = inputs.dim1 as number;
      const d2 = inputs.dim2 as number;
      const den = inputs.density as number;
      if (!len || !d1 || !d2 || !den) return null;
      var vol = 0;
      if (shape === "round") {
        vol = Math.PI * Math.pow(d1 / 2, 2) * len;
      } else if (shape === "tube") {
        var innerR = (d1 / 2) - d2;
        vol = Math.PI * (Math.pow(d1 / 2, 2) - Math.pow(innerR, 2)) * len;
      } else {
        vol = d1 * d2 * len;
      }
      var weight = Math.round(vol * den * 1000) / 1000;
      return {
        primary: { label: "Weight", value: formatNumber(weight) + " lb" },
        details: [
          { label: "Volume", value: formatNumber(Math.round(vol * 1000) / 1000) + " cu in" },
          { label: "Shape", value: shape === "flat" ? "Flat Plate" : shape === "round" ? "Round Bar" : "Round Tube" },
          { label: "Length", value: formatNumber(len) + " in" },
        ],
      };
  }`,
  [{ q: 'What density should I use for aluminum?', a: 'Aluminum alloys have a density of about 0.098 pounds per cubic inch.' },
   { q: 'How do I weigh stainless steel?', a: 'Use a density of 0.289 pounds per cubic inch for 304 stainless steel.' }],
  'Weight = Volume x Density',
  []
);

add('sheet-metal-bend-calculator', 'Sheet Metal Bend Calculator',
  'Calculate bend allowance and deduction for sheet metal.',
  'Science', 'science', 'A',
  ['bend allowance', 'sheet metal calculator'],
  [
    '{ name: "angle", label: "Bend Angle (degrees)", type: "number", min: 1, max: 180, defaultValue: 90 }',
    '{ name: "radius", label: "Inside Bend Radius (inches)", type: "number", min: 0.01, max: 10, defaultValue: 0.125 }',
    '{ name: "thickness", label: "Material Thickness (inches)", type: "number", min: 0.005, max: 2, defaultValue: 0.06 }',
    '{ name: "kFactor", label: "K-Factor", type: "number", min: 0.1, max: 0.5, defaultValue: 0.33 }',
  ],
  `(inputs) => {
      const ang = inputs.angle as number;
      const r = inputs.radius as number;
      const t = inputs.thickness as number;
      const k = inputs.kFactor as number;
      if (!ang || !r || !t || !k) return null;
      const radians = ang * Math.PI / 180;
      const ba = radians * (r + k * t);
      const ossb = (r + t) * Math.tan((ang / 2) * Math.PI / 180);
      const bd = 2 * ossb - ba;
      return {
        primary: { label: "Bend Allowance", value: formatNumber(Math.round(ba * 10000) / 10000) + " in" },
        details: [
          { label: "Bend Deduction", value: formatNumber(Math.round(bd * 10000) / 10000) + " in" },
          { label: "Outside Setback", value: formatNumber(Math.round(ossb * 10000) / 10000) + " in" },
          { label: "K-Factor", value: formatNumber(k) },
        ],
      };
  }`,
  [{ q: 'What is the K-factor?', a: 'The K-factor is the ratio of the neutral axis location to the material thickness.' },
   { q: 'What K-factor should I use for mild steel?', a: 'Use 0.33 for air bending and 0.42 for bottom bending mild steel.' }],
  'BA = (PI/180) x Angle x (Radius + K x Thickness)',
  []
);

add('tap-drill-size-calculator', 'Tap Drill Size Calculator',
  'Calculate the tap drill diameter for threaded holes.',
  'Science', 'science', 'A',
  ['tap drill', 'thread tap calculator'],
  [
    '{ name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.25 }',
    '{ name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 20 }',
    '{ name: "threadPct", label: "Thread Percentage (%)", type: "number", min: 50, max: 100, defaultValue: 75 }',
  ],
  `(inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      const pct = inputs.threadPct as number;
      if (!maj || !tpi || !pct) return null;
      const pitch = 1 / tpi;
      const basicPD = maj - 0.6495 * pitch;
      const drillSize = maj - (pct / 100) * 0.6495 * 2 * pitch;
      var drill64 = Math.round(drillSize * 64);
      return {
        primary: { label: "Tap Drill Size", value: formatNumber(Math.round(drillSize * 10000) / 10000) + " in" },
        details: [
          { label: "Nearest 64th", value: drill64 + "/64 in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Engagement", value: pct + "%" },
        ],
      };
  }`,
  [{ q: 'What thread percentage should I use?', a: 'Use 75 percent for most applications. Going above 80 percent adds little strength.' },
   { q: 'How do I find threads per inch?', a: 'Use a thread pitch gauge or count threads over one inch of the fastener.' }],
  'Drill = Major Dia - Thread% x 1.299 x Pitch',
  []
);

add('thread-pitch-calculator', 'Thread Pitch Calculator',
  'Calculate thread dimensions from gauge and pitch.',
  'Science', 'science', 'A',
  ['thread pitch', 'thread gauge calculator'],
  [
    '{ name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.5 }',
    '{ name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 13 }',
  ],
  `(inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      if (!maj || !tpi) return null;
      const pitch = 1 / tpi;
      const pitchDia = Math.round((maj - 0.6495 * pitch) * 10000) / 10000;
      const minorDia = Math.round((maj - 1.299 * pitch) * 10000) / 10000;
      const threadDepth = Math.round((0.6134 * pitch) * 10000) / 10000;
      return {
        primary: { label: "Pitch Diameter", value: formatNumber(pitchDia) + " in" },
        details: [
          { label: "Minor Diameter", value: formatNumber(minorDia) + " in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Depth", value: formatNumber(threadDepth) + " in" },
        ],
      };
  }`,
  [{ q: 'What is the pitch diameter?', a: 'The pitch diameter is where the thread width equals the space between threads.' },
   { q: 'What is the difference between UNC and UNF?', a: 'UNC is coarse thread with fewer TPI. UNF is fine thread with more TPI.' }],
  'Pitch Dia = Major - 0.6495 x Pitch; Minor = Major - 1.299 x Pitch',
  []
);

add('fabric-shrinkage-calculator', 'Fabric Shrinkage Calculator',
  'Calculate how much extra fabric to buy before pre-shrinking.',
  'Everyday', 'everyday', '~',
  ['fabric shrinkage', 'pre-shrink calculator'],
  [
    '{ name: "finishedLength", label: "Finished Length Needed (inches)", type: "number", min: 1, max: 500, defaultValue: 45 }',
    '{ name: "finishedWidth", label: "Finished Width Needed (inches)", type: "number", min: 1, max: 120, defaultValue: 36 }',
    '{ name: "shrinkLength", label: "Length Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "shrinkWidth", label: "Width Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const fl = inputs.finishedLength as number;
      const fw = inputs.finishedWidth as number;
      const sl = inputs.shrinkLength as number;
      const sw = inputs.shrinkWidth as number;
      if (!fl || !fw) return null;
      const cutLength = Math.round((fl / (1 - sl / 100)) * 100) / 100;
      const cutWidth = Math.round((fw / (1 - sw / 100)) * 100) / 100;
      const extraL = Math.round((cutLength - fl) * 100) / 100;
      const extraW = Math.round((cutWidth - fw) * 100) / 100;
      return {
        primary: { label: "Cut Length Before Wash", value: formatNumber(cutLength) + " in" },
        details: [
          { label: "Cut Width Before Wash", value: formatNumber(cutWidth) + " in" },
          { label: "Extra Length", value: formatNumber(extraL) + " in" },
          { label: "Extra Width", value: formatNumber(extraW) + " in" },
        ],
      };
  }`,
  [{ q: 'How much does cotton shrink?', a: 'Cotton typically shrinks 3 to 5 percent in length and 2 to 3 percent in width.' },
   { q: 'Should I always pre-shrink fabric?', a: 'Yes. Pre-shrink washable fabrics before cutting to avoid a too-small finished item.' }],
  'Cut Length = Finished Length / (1 - Shrinkage%)',
  []
);

add('seam-allowance-calculator', 'Seam Allowance Calculator',
  'Calculate total fabric dimensions including seam allowances.',
  'Everyday', 'everyday', '~',
  ['seam allowance', 'sewing calculator'],
  [
    '{ name: "finishedLength", label: "Finished Length (inches)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "finishedWidth", label: "Finished Width (inches)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", min: 0.125, max: 2, defaultValue: 0.625 }',
    '{ name: "seamSides", label: "Sides with Seams", type: "number", min: 1, max: 4, defaultValue: 4 }',
  ],
  `(inputs) => {
      const fl = inputs.finishedLength as number;
      const fw = inputs.finishedWidth as number;
      const sa = inputs.seamAllowance as number;
      const sides = inputs.seamSides as number;
      if (!fl || !fw || !sa || !sides) return null;
      var addL = sides >= 3 ? sa * 2 : sa;
      var addW = sides >= 2 ? sa * 2 : sa;
      if (sides === 1) { addL = sa; addW = 0; }
      var cutL = fl + addL;
      var cutW = fw + addW;
      return {
        primary: { label: "Cut Length", value: formatNumber(cutL) + " in" },
        details: [
          { label: "Cut Width", value: formatNumber(cutW) + " in" },
          { label: "Seam Allowance Per Side", value: formatNumber(sa) + " in" },
          { label: "Total Seam Addition", value: formatNumber(Math.round((addL + addW) * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'What is the standard seam allowance?', a: 'The standard seam allowance is 5/8 inch (0.625 inches) for most garments.' },
   { q: 'When should I use a narrower seam?', a: 'Use 1/4 inch seams for quilting and 3/8 inch for lightweight fabrics.' }],
  'Cut Size = Finished Size + (Seam Allowance x 2) per dimension',
  []
);

add('button-spacing-calculator', 'Button Spacing Calculator',
  'Calculate even button placement on a garment.',
  'Everyday', 'everyday', '~',
  ['button spacing', 'button placement calculator'],
  [
    '{ name: "placketLength", label: "Placket Length (inches)", type: "number", min: 2, max: 60, defaultValue: 24 }',
    '{ name: "numButtons", label: "Number of Buttons", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "topOffset", label: "Top Offset (inches)", type: "number", min: 0, max: 5, defaultValue: 0.75 }',
    '{ name: "bottomOffset", label: "Bottom Offset (inches)", type: "number", min: 0, max: 5, defaultValue: 0.75 }',
  ],
  `(inputs) => {
      const pl = inputs.placketLength as number;
      const nb = inputs.numButtons as number;
      const to = inputs.topOffset as number;
      const bo = inputs.bottomOffset as number;
      if (!pl || !nb) return null;
      const usable = pl - to - bo;
      const spacing = Math.round((usable / (nb - 1)) * 1000) / 1000;
      var positions = [];
      for (var i = 0; i < nb; i++) {
        positions.push(Math.round((to + i * spacing) * 100) / 100);
      }
      return {
        primary: { label: "Button Spacing", value: formatNumber(spacing) + " in" },
        details: [
          { label: "Usable Length", value: formatNumber(Math.round(usable * 100) / 100) + " in" },
          { label: "First Button Position", value: formatNumber(to) + " in from top" },
          { label: "Last Button Position", value: formatNumber(positions[positions.length - 1]) + " in from top" },
        ],
      };
  }`,
  [{ q: 'How far apart should buttons be?', a: 'Buttons are typically spaced 2.5 to 4 inches apart on a shirt.' },
   { q: 'Where should the top button go?', a: 'Place the top button about 0.5 to 1 inch below the neckline edge.' }],
  'Spacing = (Placket Length - Top Offset - Bottom Offset) / (Buttons - 1)',
  []
);

add('elastic-length-calculator', 'Elastic Length Calculator',
  'Calculate the cutting length for elastic in a garment.',
  'Everyday', 'everyday', '~',
  ['elastic length', 'elastic calculator sewing'],
  [
    '{ name: "bodyMeasure", label: "Body Measurement (inches)", type: "number", min: 5, max: 80, defaultValue: 30 }',
    '{ name: "stretchRatio", label: "Stretch Ratio (%)", type: "number", min: 50, max: 95, defaultValue: 80 }',
    '{ name: "overlapAllowance", label: "Overlap Allowance (inches)", type: "number", min: 0, max: 3, defaultValue: 1 }',
  ],
  `(inputs) => {
      const body = inputs.bodyMeasure as number;
      const ratio = inputs.stretchRatio as number;
      const overlap = inputs.overlapAllowance as number;
      if (!body || !ratio) return null;
      const relaxedLen = Math.round((body * ratio / 100) * 100) / 100;
      const cutLen = Math.round((relaxedLen + overlap) * 100) / 100;
      const stretch = Math.round((body - relaxedLen) * 100) / 100;
      return {
        primary: { label: "Cut Elastic Length", value: formatNumber(cutLen) + " in" },
        details: [
          { label: "Relaxed Elastic Length", value: formatNumber(relaxedLen) + " in" },
          { label: "Stretch Needed", value: formatNumber(stretch) + " in" },
          { label: "Overlap Included", value: formatNumber(overlap) + " in" },
        ],
      };
  }`,
  [{ q: 'What stretch ratio should I use?', a: 'Use 75 to 85 percent of the body measurement for comfortable elastic fit.' },
   { q: 'How much overlap do I need?', a: 'Add 0.5 to 1 inch of overlap for joining the elastic ends together.' }],
  'Cut Length = (Body Measurement x Stretch Ratio) + Overlap',
  []
);

add('crop-yield-calculator', 'Crop Yield Calculator',
  'Estimate expected crop yield per acre from field data.',
  'Science', 'science', 'A',
  ['crop yield', 'harvest yield calculator'],
  [
    '{ name: "rowLength", label: "Row Length (feet)", type: "number", min: 10, max: 5280, defaultValue: 1000 }',
    '{ name: "rowSpacing", label: "Row Spacing (inches)", type: "number", min: 6, max: 60, defaultValue: 30 }',
    '{ name: "plantSpacing", label: "Plant Spacing (inches)", type: "number", min: 2, max: 48, defaultValue: 8 }',
    '{ name: "yieldPerPlant", label: "Yield Per Plant (lb)", type: "number", min: 0.01, max: 50, defaultValue: 0.5 }',
    '{ name: "acres", label: "Total Acres", type: "number", min: 0.1, max: 10000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const rl = inputs.rowLength as number;
      const rs = inputs.rowSpacing as number;
      const ps = inputs.plantSpacing as number;
      const ypp = inputs.yieldPerPlant as number;
      const ac = inputs.acres as number;
      if (!rl || !rs || !ps || !ypp || !ac) return null;
      const rowsPerAcre = Math.floor(43560 / (rl * rs / 12));
      const plantsPerRow = Math.floor(rl * 12 / ps);
      const plantsPerAcre = rowsPerAcre * plantsPerRow;
      const yieldPerAcre = Math.round(plantsPerAcre * ypp);
      var totalYield = Math.round(yieldPerAcre * ac);
      return {
        primary: { label: "Yield Per Acre", value: formatNumber(yieldPerAcre) + " lb" },
        details: [
          { label: "Total Yield", value: formatNumber(totalYield) + " lb" },
          { label: "Plants Per Acre", value: formatNumber(plantsPerAcre) },
          { label: "Rows Per Acre", value: formatNumber(rowsPerAcre) },
        ],
      };
  }`,
  [{ q: 'How do I estimate yield per plant?', a: 'Weigh the harvest of a sample row and divide by the number of plants.' },
   { q: 'What affects crop yield?', a: 'Soil fertility, water, sunlight, spacing, and pest control all affect yield.' }],
  'Yield/Acre = Plants Per Acre x Yield Per Plant',
  []
);

add('seed-rate-calculator', 'Seed Rate Calculator',
  'Calculate seeding rate per acre for planting.',
  'Science', 'science', 'A',
  ['seed rate', 'planting rate calculator'],
  [
    '{ name: "desiredPlants", label: "Desired Plants Per Acre", type: "number", min: 100, max: 500000, defaultValue: 32000 }',
    '{ name: "germRate", label: "Germination Rate (%)", type: "number", min: 10, max: 100, defaultValue: 92 }',
    '{ name: "seedsPerLb", label: "Seeds Per Pound", type: "number", min: 10, max: 500000, defaultValue: 1500 }',
    '{ name: "acres", label: "Total Acres", type: "number", min: 0.1, max: 10000, defaultValue: 40 }',
  ],
  `(inputs) => {
      const dp = inputs.desiredPlants as number;
      const gr = inputs.germRate as number;
      const spl = inputs.seedsPerLb as number;
      const ac = inputs.acres as number;
      if (!dp || !gr || !spl || !ac) return null;
      const seedsNeeded = Math.ceil(dp / (gr / 100));
      const lbsPerAcre = Math.round((seedsNeeded / spl) * 100) / 100;
      const totalLbs = Math.round(lbsPerAcre * ac * 100) / 100;
      return {
        primary: { label: "Seed Rate", value: formatNumber(lbsPerAcre) + " lb/acre" },
        details: [
          { label: "Seeds Needed Per Acre", value: formatNumber(seedsNeeded) },
          { label: "Total Seed Needed", value: formatNumber(totalLbs) + " lb" },
          { label: "Adjusted for Germination", value: gr + "%" },
        ],
      };
  }`,
  [{ q: 'What is a typical corn seeding rate?', a: 'Corn is typically planted at 28000 to 36000 seeds per acre.' },
   { q: 'Why adjust for germination rate?', a: 'Not all seeds germinate, so you plant extra to reach the desired stand count.' }],
  'Seed Rate (lb/acre) = (Desired Plants / Germination%) / Seeds Per Pound',
  []
);

add('irrigation-water-calculator', 'Irrigation Water Calculator',
  'Estimate irrigation water needs for crops per acre.',
  'Science', 'science', 'A',
  ['irrigation water', 'crop water calculator'],
  [
    '{ name: "etRate", label: "ET Rate (inches/day)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 }',
    '{ name: "rainfall", label: "Weekly Rainfall (inches)", type: "number", min: 0, max: 10, defaultValue: 0.5 }',
    '{ name: "efficiency", label: "System Efficiency (%)", type: "number", min: 30, max: 100, defaultValue: 75 }',
    '{ name: "acres", label: "Irrigated Acres", type: "number", min: 0.1, max: 10000, defaultValue: 80 }',
  ],
  `(inputs) => {
      const et = inputs.etRate as number;
      const rain = inputs.rainfall as number;
      const eff = inputs.efficiency as number;
      const ac = inputs.acres as number;
      if (!et || !eff || !ac) return null;
      const weeklyET = et * 7;
      const netNeed = Math.max(0, weeklyET - rain);
      const grossNeed = Math.round((netNeed / (eff / 100)) * 100) / 100;
      var gallonsPerAcre = Math.round(grossNeed * 27154);
      var totalGallons = Math.round(gallonsPerAcre * ac);
      return {
        primary: { label: "Weekly Irrigation Need", value: formatNumber(grossNeed) + " in/acre" },
        details: [
          { label: "Gallons Per Acre Per Week", value: formatNumber(gallonsPerAcre) },
          { label: "Total Gallons Per Week", value: formatNumber(totalGallons) },
          { label: "Net Crop Need", value: formatNumber(Math.round(netNeed * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'What is ET rate?', a: 'ET is evapotranspiration, the rate at which a crop uses water through evaporation and transpiration.' },
   { q: 'What irrigation efficiency should I use?', a: 'Use 75% for sprinkler, 85% for center pivot, and 90% for drip irrigation.' }],
  'Irrigation = (ET x 7 - Rainfall) / Efficiency',
  []
);

add('livestock-feed-calculator', 'Livestock Feed Calculator',
  'Calculate daily feed requirements per animal.',
  'Everyday', 'everyday', '~',
  ['livestock feed', 'cattle feed calculator'],
  [
    '{ name: "animalWeight", label: "Animal Weight (lb)", type: "number", min: 50, max: 3000, defaultValue: 1200 }',
    '{ name: "intakePct", label: "Dry Matter Intake (%BW)", type: "number", min: 1, max: 5, defaultValue: 2.5 }',
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "days", label: "Feeding Period (days)", type: "number", min: 1, max: 365, defaultValue: 120 }',
  ],
  `(inputs) => {
      const wt = inputs.animalWeight as number;
      const pct = inputs.intakePct as number;
      const num = inputs.numAnimals as number;
      const days = inputs.days as number;
      if (!wt || !pct || !num || !days) return null;
      const dailyPerHead = Math.round(wt * pct / 100 * 100) / 100;
      const dailyTotal = Math.round(dailyPerHead * num * 100) / 100;
      const totalFeed = Math.round(dailyTotal * days);
      var totalTons = Math.round(totalFeed / 2000 * 10) / 10;
      return {
        primary: { label: "Daily Feed Per Head", value: formatNumber(dailyPerHead) + " lb" },
        details: [
          { label: "Daily Herd Total", value: formatNumber(dailyTotal) + " lb" },
          { label: "Total Feed Needed", value: formatNumber(totalFeed) + " lb" },
          { label: "Total in Tons", value: formatNumber(totalTons) + " tons" },
        ],
      };
  }`,
  [{ q: 'How much does a cow eat per day?', a: 'A cow eats about 2 to 3 percent of its body weight in dry matter per day.' },
   { q: 'Does feed intake change by season?', a: 'Yes. Cold weather increases intake and hot weather decreases it.' }],
  'Daily Feed = Animal Weight x Intake Percentage',
  []
);

add('hay-bale-calculator', 'Hay Bale Calculator',
  'Calculate hay bales needed for winter feeding.',
  'Everyday', 'everyday', '~',
  ['hay bale', 'hay storage calculator'],
  [
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 2000, defaultValue: 30 }',
    '{ name: "dailyHay", label: "Hay Per Animal Per Day (lb)", type: "number", min: 5, max: 50, defaultValue: 25 }',
    '{ name: "feedingDays", label: "Feeding Days", type: "number", min: 30, max: 365, defaultValue: 150 }',
    '{ name: "baleWeight", label: "Bale Weight (lb)", type: "number", min: 40, max: 2000, defaultValue: 1200 }',
    '{ name: "wastePct", label: "Hay Waste (%)", type: "number", min: 0, max: 40, defaultValue: 15 }',
  ],
  `(inputs) => {
      const na = inputs.numAnimals as number;
      const dh = inputs.dailyHay as number;
      const fd = inputs.feedingDays as number;
      const bw = inputs.baleWeight as number;
      const wp = inputs.wastePct as number;
      if (!na || !dh || !fd || !bw) return null;
      const totalHay = na * dh * fd;
      const withWaste = Math.round(totalHay * (1 + wp / 100));
      const bales = Math.ceil(withWaste / bw);
      var totalTons = Math.round(withWaste / 2000 * 10) / 10;
      return {
        primary: { label: "Bales Needed", value: formatNumber(bales) },
        details: [
          { label: "Total Hay", value: formatNumber(withWaste) + " lb" },
          { label: "Total in Tons", value: formatNumber(totalTons) + " tons" },
          { label: "Waste Included", value: wp + "%" },
        ],
      };
  }`,
  [{ q: 'How much waste should I plan for?', a: 'Plan for 10 to 20 percent waste depending on storage and feeding method.' },
   { q: 'How much hay does a horse need daily?', a: 'A horse typically needs 15 to 25 pounds of hay per day.' }],
  'Bales = (Animals x Daily Hay x Days x (1 + Waste%)) / Bale Weight',
  []
);

add('pasture-stocking-rate-calculator', 'Pasture Stocking Rate Calculator',
  'Calculate how many animals a pasture can support.',
  'Science', 'science', 'A',
  ['stocking rate', 'pasture capacity calculator'],
  [
    '{ name: "pastureAcres", label: "Pasture Size (acres)", type: "number", min: 1, max: 50000, defaultValue: 100 }',
    '{ name: "forageProd", label: "Forage Production (lb DM/acre/year)", type: "number", min: 500, max: 15000, defaultValue: 4000 }',
    '{ name: "utilization", label: "Utilization Rate (%)", type: "number", min: 20, max: 80, defaultValue: 50 }',
    '{ name: "auDemand", label: "Animal Unit Demand (lb DM/month)", type: "number", min: 400, max: 1200, defaultValue: 780 }',
    '{ name: "grazingMonths", label: "Grazing Months", type: "number", min: 1, max: 12, defaultValue: 7 }',
  ],
  `(inputs) => {
      const ac = inputs.pastureAcres as number;
      const fp = inputs.forageProd as number;
      const ut = inputs.utilization as number;
      const aud = inputs.auDemand as number;
      const gm = inputs.grazingMonths as number;
      if (!ac || !fp || !ut || !aud || !gm) return null;
      var availForage = ac * fp * (ut / 100);
      var demandPerAU = aud * gm;
      var animalUnits = Math.floor(availForage / demandPerAU);
      var acresPerAU = Math.round((ac / animalUnits) * 10) / 10;
      return {
        primary: { label: "Animal Units Supported", value: formatNumber(animalUnits) },
        details: [
          { label: "Acres Per Animal Unit", value: formatNumber(acresPerAU) },
          { label: "Available Forage", value: formatNumber(Math.round(availForage)) + " lb DM" },
          { label: "Demand Per Animal Unit", value: formatNumber(demandPerAU) + " lb DM" },
        ],
      };
  }`,
  [{ q: 'What is an animal unit?', a: 'An animal unit is one 1000 lb cow with a calf, consuming about 780 lb DM per month.' },
   { q: 'What utilization rate should I use?', a: 'Use 50% for sustainable grazing to maintain pasture health.' }],
  'Animal Units = (Acres x Forage x Utilization%) / (Monthly Demand x Months)',
  []
);

add('grain-bin-capacity-calculator', 'Grain Bin Capacity Calculator',
  'Calculate grain storage capacity of a cylindrical bin.',
  'Science', 'science', 'A',
  ['grain bin', 'grain storage calculator'],
  [
    '{ name: "diameter", label: "Bin Diameter (feet)", type: "number", min: 6, max: 120, defaultValue: 30 }',
    '{ name: "eaveHeight", label: "Eave Height (feet)", type: "number", min: 5, max: 60, defaultValue: 20 }',
    '{ name: "peakHeight", label: "Peak Height Above Eave (feet)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "bushelsPerCuFt", label: "Bushels Per Cubic Foot", type: "number", min: 0.5, max: 1.5, defaultValue: 0.8 }',
  ],
  `(inputs) => {
      const d = inputs.diameter as number;
      const eh = inputs.eaveHeight as number;
      const pk = inputs.peakHeight as number;
      const bpf = inputs.bushelsPerCuFt as number;
      if (!d || !eh || !bpf) return null;
      const r = d / 2;
      const cylVol = Math.PI * r * r * eh;
      const coneVol = (1 / 3) * Math.PI * r * r * pk;
      const totalVol = cylVol + coneVol;
      var bushels = Math.round(totalVol * bpf);
      var tons = Math.round(bushels * 56 / 2000 * 10) / 10;
      return {
        primary: { label: "Capacity", value: formatNumber(bushels) + " bushels" },
        details: [
          { label: "Total Volume", value: formatNumber(Math.round(totalVol)) + " cu ft" },
          { label: "Approximate Tons (corn)", value: formatNumber(tons) },
          { label: "Bin Floor Area", value: formatNumber(Math.round(Math.PI * r * r)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How do I convert bushels to tons?', a: 'For corn, multiply bushels by 56 and divide by 2000 to get short tons.' },
   { q: 'What is the standard bushel conversion?', a: 'One bushel equals 1.2445 cubic feet, or about 0.8 bushels per cubic foot.' }],
  'Bushels = (Cylinder Vol + Cone Vol) x Bushels Per Cu Ft',
  []
);

add('tractor-pto-calculator', 'Tractor PTO Calculator',
  'Estimate PTO horsepower needs for implements.',
  'Science', 'science', 'A',
  ['tractor PTO', 'PTO horsepower calculator'],
  [
    '{ name: "implementHP", label: "Implement PTO Requirement (HP)", type: "number", min: 5, max: 500, defaultValue: 45 }',
    '{ name: "ptoEfficiency", label: "PTO Efficiency (%)", type: "number", min: 70, max: 100, defaultValue: 86 }',
    '{ name: "altitude", label: "Altitude (feet)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
  ],
  `(inputs) => {
      const ihp = inputs.implementHP as number;
      const eff = inputs.ptoEfficiency as number;
      const alt = inputs.altitude as number;
      const margin = inputs.safetyMargin as number;
      if (!ihp || !eff) return null;
      var altDerate = 1 - (alt / 1000) * 0.035;
      if (altDerate < 0.5) altDerate = 0.5;
      var engineHP = ihp / (eff / 100);
      var adjustedHP = engineHP / altDerate;
      var recommended = Math.ceil(adjustedHP * (1 + margin / 100));
      return {
        primary: { label: "Recommended Engine HP", value: formatNumber(recommended) + " HP" },
        details: [
          { label: "Engine HP at Sea Level", value: formatNumber(Math.round(engineHP * 10) / 10) + " HP" },
          { label: "Altitude Derating", value: formatNumber(Math.round((1 - altDerate) * 100)) + "%" },
          { label: "Safety Margin", value: margin + "%" },
        ],
      };
  }`,
  [{ q: 'What is PTO efficiency?', a: 'PTO efficiency is the percentage of engine power that reaches the PTO shaft, typically 83 to 87%.' },
   { q: 'How does altitude affect tractor power?', a: 'Engines lose about 3.5 percent of power for every 1000 feet of altitude.' }],
  'Engine HP = (Implement HP / PTO Efficiency) / Altitude Factor x (1 + Margin)',
  []
);
