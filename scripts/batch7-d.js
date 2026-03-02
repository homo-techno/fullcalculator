add('under-cabinet-lighting-calculator', 'Under Cabinet Lighting Calculator',
  'Estimate LED strip length and wattage for under cabinet lights.',
  'Everyday', 'everyday', '~',
  ['under cabinet lighting', 'LED strip calculator'],
  [
    '{ name: "cabinetLength", label: "Total Cabinet Length (ft)", type: "number", min: 1, max: 50, defaultValue: 10 }',
    '{ name: "wattsPerFt", label: "Watts Per Foot", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "sections", label: "Number of Sections", type: "number", min: 1, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const len = inputs.cabinetLength as number;
      const wpf = inputs.wattsPerFt as number;
      const sec = inputs.sections as number;
      if (!len || !wpf || !sec) return null;
      const totalWatts = len * wpf;
      const perSection = Math.round((len / sec) * 100) / 100;
      const amps12v = Math.round((totalWatts / 12) * 100) / 100;
      return {
        primary: { label: "Total Wattage", value: formatNumber(totalWatts) + " W" },
        details: [
          { label: "Strip Length Per Section", value: formatNumber(perSection) + " ft" },
          { label: "Current at 12V", value: formatNumber(amps12v) + " A" },
          { label: "Recommended PSU", value: formatNumber(Math.ceil(amps12v * 1.2)) + " A" },
        ],
      };
  }`,
  [{ q: 'What wattage do I need for under cabinet lights?', a: 'Most LED strips use 3 to 5 watts per foot for good task lighting.' },
   { q: 'Should I use 12V or 24V strips?', a: 'Use 12V for short runs under 16 feet and 24V for longer runs.' }],
  'Total Wattage = Cabinet Length x Watts Per Foot',
  []
);

add('ceiling-height-calculator', 'Ceiling Height Calculator',
  'Determine ideal ceiling height based on room dimensions.',
  'Everyday', 'everyday', '~',
  ['ceiling height', 'room proportion calculator'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 100, defaultValue: 16 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 100, defaultValue: 12 }',
    '{ name: "actualHeight", label: "Actual Ceiling Height (ft)", type: "number", min: 6, max: 30, defaultValue: 8 }',
  ],
  `(inputs) => {
      const len = inputs.roomLength as number;
      const wid = inputs.roomWidth as number;
      const actual = inputs.actualHeight as number;
      if (!len || !wid || !actual) return null;
      const avgDim = (len + wid) / 2;
      const idealHeight = Math.round((avgDim * 0.6) * 10) / 10;
      const diff = Math.round((actual - idealHeight) * 10) / 10;
      const roomVol = Math.round(len * wid * actual);
      return {
        primary: { label: "Ideal Ceiling Height", value: formatNumber(idealHeight) + " ft" },
        details: [
          { label: "Actual Height", value: formatNumber(actual) + " ft" },
          { label: "Difference", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " ft" },
          { label: "Room Volume", value: formatNumber(roomVol) + " cu ft" },
        ],
      };
  }`,
  [{ q: 'What is the standard ceiling height?', a: 'Standard ceiling height in most homes is 8 to 9 feet.' },
   { q: 'Do higher ceilings cost more to heat?', a: 'Yes. Each extra foot of height adds roughly 10% to heating costs.' }],
  'Ideal Height = (Room Length + Room Width) / 2 x 0.6',
  []
);

add('staircase-carpet-calculator', 'Staircase Carpet Calculator',
  'Calculate carpet needed for stairs including treads and risers.',
  'Everyday', 'everyday', '~',
  ['staircase carpet', 'stair carpet calculator'],
  [
    '{ name: "steps", label: "Number of Steps", type: "number", min: 1, max: 50, defaultValue: 13 }',
    '{ name: "treadDepth", label: "Tread Depth (in)", type: "number", min: 6, max: 24, defaultValue: 10 }',
    '{ name: "riserHeight", label: "Riser Height (in)", type: "number", min: 4, max: 12, defaultValue: 7 }',
    '{ name: "stairWidth", label: "Stair Width (in)", type: "number", min: 24, max: 60, defaultValue: 36 }',
  ],
  `(inputs) => {
      const steps = inputs.steps as number;
      const tread = inputs.treadDepth as number;
      const riser = inputs.riserHeight as number;
      const width = inputs.stairWidth as number;
      if (!steps || !tread || !riser || !width) return null;
      const perStep = (tread + riser + 2) / 12;
      const totalLength = Math.round(perStep * steps * 100) / 100;
      const sqFt = Math.round(totalLength * (width / 12) * 100) / 100;
      const withWaste = Math.round(sqFt * 1.1 * 100) / 100;
      return {
        primary: { label: "Carpet Needed", value: formatNumber(withWaste) + " sq ft" },
        details: [
          { label: "Carpet Length", value: formatNumber(totalLength) + " ft" },
          { label: "Area Without Waste", value: formatNumber(sqFt) + " sq ft" },
          { label: "Waste Allowance (10%)", value: formatNumber(Math.round((withWaste - sqFt) * 100) / 100) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How much extra carpet should I buy for stairs?', a: 'Add 10% to 15% extra for waste, cuts, and alignment.' },
   { q: 'Can I carpet stairs myself?', a: 'Yes, but professional install is recommended for safety.' }],
  'Carpet Length = (Tread + Riser + 2 in) / 12 x Steps',
  []
);

add('window-treatment-calculator', 'Window Treatment Calculator',
  'Calculate curtain width and rod length for windows.',
  'Everyday', 'everyday', '~',
  ['curtain size', 'window treatment sizing'],
  [
    '{ name: "windowWidth", label: "Window Width (in)", type: "number", min: 12, max: 200, defaultValue: 48 }',
    '{ name: "windowHeight", label: "Window Height (in)", type: "number", min: 12, max: 120, defaultValue: 60 }',
    '{ name: "fullness", label: "Fullness Multiplier", type: "select", options: [{ value: "1.5", label: "1.5x (Casual)" }, { value: "2", label: "2x (Standard)" }, { value: "2.5", label: "2.5x (Luxurious)" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const full = inputs.fullness as number;
      if (!ww || !wh || !full) return null;
      const rodLength = Math.round(ww + 12);
      const curtainWidth = Math.round(ww * full);
      const curtainLength = Math.round(wh + 4);
      const panels = Math.ceil(curtainWidth / 54);
      return {
        primary: { label: "Total Curtain Width", value: formatNumber(curtainWidth) + " in" },
        details: [
          { label: "Rod Length", value: formatNumber(rodLength) + " in" },
          { label: "Curtain Length", value: formatNumber(curtainLength) + " in" },
          { label: "Number of Panels (54 in wide)", value: String(panels) },
        ],
      };
  }`,
  [{ q: 'How wide should curtains be?', a: 'Curtains should be 1.5 to 2.5 times the window width for fullness.' },
   { q: 'How far above the window should a rod go?', a: 'Mount the rod 4 to 6 inches above the window frame.' }],
  'Curtain Width = Window Width x Fullness Multiplier',
  []
);

add('blinds-size-calculator', 'Blinds Size Calculator',
  'Calculate window blinds dimensions for inside or outside mount.',
  'Everyday', 'everyday', '~',
  ['blinds size', 'window blinds dimensions'],
  [
    '{ name: "windowWidth", label: "Window Opening Width (in)", type: "number", min: 8, max: 200, defaultValue: 36 }',
    '{ name: "windowHeight", label: "Window Opening Height (in)", type: "number", min: 8, max: 120, defaultValue: 48 }',
    '{ name: "mountType", label: "Mount Type", type: "select", options: [{ value: "1", label: "Inside Mount" }, { value: "2", label: "Outside Mount" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const mount = inputs.mountType as number;
      if (!ww || !wh || !mount) return null;
      let blindWidth, blindHeight;
      if (mount === 1) {
        blindWidth = Math.round((ww - 0.25) * 100) / 100;
        blindHeight = Math.round(wh * 100) / 100;
      } else {
        blindWidth = Math.round((ww + 3) * 100) / 100;
        blindHeight = Math.round((wh + 3) * 100) / 100;
      }
      const area = Math.round(blindWidth * blindHeight * 100) / 100;
      return {
        primary: { label: "Blind Width", value: formatNumber(blindWidth) + " in" },
        details: [
          { label: "Blind Height", value: formatNumber(blindHeight) + " in" },
          { label: "Blind Area", value: formatNumber(Math.round(area / 144 * 100) / 100) + " sq ft" },
          { label: "Mount Type", value: mount === 1 ? "Inside Mount" : "Outside Mount" },
        ],
      };
  }`,
  [{ q: 'What is inside mount vs outside mount?', a: 'Inside mount fits within the window frame. Outside mount covers it.' },
   { q: 'How much smaller should inside mount blinds be?', a: 'Deduct about 1/4 inch from the width for inside mount blinds.' }],
  'Inside: Width = Opening - 0.25 in; Outside: Width = Opening + 3 in',
  []
);

add('tv-viewing-distance-calculator', 'TV Viewing Distance Calculator',
  'Find the optimal viewing distance for your TV size.',
  'Everyday', 'everyday', '~',
  ['TV viewing distance', 'TV distance calculator'],
  [
    '{ name: "tvSize", label: "TV Screen Size (in diagonal)", type: "number", min: 20, max: 120, defaultValue: 55 }',
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "4K (Ultra HD)" }, { value: "3", label: "8K" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const size = inputs.tvSize as number;
      const res = inputs.resolution as number;
      if (!size || !res) return null;
      const multiplier = res === 1 ? 1.6 : res === 2 ? 1.0 : 0.75;
      const minDist = Math.round(size * multiplier * 10) / 10;
      const maxDist = Math.round(size * multiplier * 1.5 * 10) / 10;
      const heightFt = Math.round(size * 0.49 / 12 * 10) / 10;
      return {
        primary: { label: "Optimal Distance", value: formatNumber(minDist) + " - " + formatNumber(maxDist) + " in" },
        details: [
          { label: "Minimum Distance", value: formatNumber(Math.round(minDist / 12 * 10) / 10) + " ft" },
          { label: "Maximum Distance", value: formatNumber(Math.round(maxDist / 12 * 10) / 10) + " ft" },
          { label: "Screen Height", value: formatNumber(heightFt) + " ft" },
        ],
      };
  }`,
  [{ q: 'How far should I sit from a 65 inch TV?', a: 'For 4K, sit about 5.4 to 8.1 feet away from a 65 inch TV.' },
   { q: 'Does resolution affect viewing distance?', a: 'Yes. Higher resolution allows you to sit closer without seeing pixels.' }],
  'Distance = TV Size x Resolution Multiplier',
  []
);

add('projector-screen-size-calculator', 'Projector Screen Size Calculator',
  'Calculate projector screen size from throw distance.',
  'Everyday', 'everyday', '~',
  ['projector screen size', 'throw distance calculator'],
  [
    '{ name: "throwDist", label: "Throw Distance (ft)", type: "number", min: 3, max: 50, defaultValue: 12 }',
    '{ name: "throwRatio", label: "Throw Ratio", type: "number", min: 0.3, max: 4, defaultValue: 1.5 }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "1.78", label: "16:9" }, { value: "2.35", label: "2.35:1" }, { value: "1.33", label: "4:3" }], defaultValue: "1.78" }',
  ],
  `(inputs) => {
      const dist = inputs.throwDist as number;
      const ratio = inputs.throwRatio as number;
      const ar = inputs.aspectRatio as number;
      if (!dist || !ratio || !ar) return null;
      const screenWidthFt = dist / ratio;
      const screenWidthIn = Math.round(screenWidthFt * 12 * 10) / 10;
      const screenHeightIn = Math.round(screenWidthIn / ar * 10) / 10;
      const diagonal = Math.round(Math.sqrt(screenWidthIn * screenWidthIn + screenHeightIn * screenHeightIn) * 10) / 10;
      return {
        primary: { label: "Screen Diagonal", value: formatNumber(diagonal) + " in" },
        details: [
          { label: "Screen Width", value: formatNumber(screenWidthIn) + " in" },
          { label: "Screen Height", value: formatNumber(screenHeightIn) + " in" },
          { label: "Throw Distance", value: formatNumber(dist) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is throw ratio?', a: 'Throw ratio is the distance to the screen divided by the screen width.' },
   { q: 'What throw ratio is best for home theater?', a: 'A throw ratio of 1.3 to 1.6 works well for most home setups.' }],
  'Screen Width = Throw Distance / Throw Ratio',
  []
);

add('speaker-placement-calculator', 'Speaker Placement Calculator',
  'Calculate optimal speaker angles and distances for surround sound.',
  'Science', 'science', 'A',
  ['speaker placement', 'surround sound setup'],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 6, max: 60, defaultValue: 18 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 6, max: 40, defaultValue: 14 }',
    '{ name: "seatingDist", label: "Seating Distance from Front (ft)", type: "number", min: 4, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const len = inputs.roomLength as number;
      const wid = inputs.roomWidth as number;
      const seat = inputs.seatingDist as number;
      if (!len || !wid || !seat) return null;
      const halfW = wid / 2;
      const frontAngle = Math.round(Math.atan2(halfW, seat) * (180 / Math.PI) * 10) / 10;
      const surrDist = Math.round(Math.sqrt(halfW * halfW + 0) * 10) / 10;
      const rearDist = Math.round((len - seat) * 10) / 10;
      const idealFront = Math.round(seat * 10) / 10;
      return {
        primary: { label: "Front Speaker Angle", value: formatNumber(frontAngle) + " degrees" },
        details: [
          { label: "Front Speaker Distance", value: formatNumber(idealFront) + " ft" },
          { label: "Side Surround Distance", value: formatNumber(surrDist) + " ft" },
          { label: "Rear Wall Distance", value: formatNumber(rearDist) + " ft" },
        ],
      };
  }`,
  [{ q: 'What angle should front speakers be at?', a: 'Front speakers should be at 22 to 30 degrees from center.' },
   { q: 'Should all speakers be the same distance?', a: 'Ideally yes. Equal distance provides balanced sound arrival.' }],
  'Front Angle = arctan(Half Room Width / Seating Distance)',
  []
);

add('ethernet-cable-calculator', 'Ethernet Cable Calculator',
  'Calculate total ethernet cable length for network runs.',
  'Science', 'science', 'A',
  ['ethernet cable length', 'network cable calculator'],
  [
    '{ name: "runs", label: "Number of Cable Runs", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "avgDistance", label: "Avg Run Distance (ft)", type: "number", min: 5, max: 300, defaultValue: 50 }',
    '{ name: "slackPerRun", label: "Slack Per Run (ft)", type: "number", min: 0, max: 20, defaultValue: 6 }',
  ],
  `(inputs) => {
      const runs = inputs.runs as number;
      const avgDist = inputs.avgDistance as number;
      const slack = inputs.slackPerRun as number;
      if (!runs || !avgDist) return null;
      const perRun = avgDist + slack;
      const totalFt = Math.round(perRun * runs);
      const boxes = Math.ceil(totalFt / 1000);
      const leftover = boxes * 1000 - totalFt;
      return {
        primary: { label: "Total Cable Needed", value: formatNumber(totalFt) + " ft" },
        details: [
          { label: "Per Run (with slack)", value: formatNumber(perRun) + " ft" },
          { label: "1000 ft Boxes Needed", value: String(boxes) },
          { label: "Leftover Cable", value: formatNumber(leftover) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is the max length for an ethernet run?', a: 'Cat5e and Cat6 support runs up to 328 feet or 100 meters.' },
   { q: 'How much slack should I leave?', a: 'Leave 6 to 10 feet of slack at each end for termination.' }],
  'Total Cable = (Avg Distance + Slack) x Number of Runs',
  []
);

add('wifi-access-point-calculator', 'WiFi Access Point Calculator',
  'Estimate the number of access points for wireless coverage.',
  'Science', 'science', 'A',
  ['wifi access point', 'wireless coverage calculator'],
  [
    '{ name: "areaSqFt", label: "Total Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 5000 }',
    '{ name: "coveragePerAp", label: "Coverage Per AP (sq ft)", type: "number", min: 200, max: 5000, defaultValue: 1500 }',
    '{ name: "users", label: "Expected Users", type: "number", min: 1, max: 1000, defaultValue: 30 }',
  ],
  `(inputs) => {
      const area = inputs.areaSqFt as number;
      const covPerAp = inputs.coveragePerAp as number;
      const users = inputs.users as number;
      if (!area || !covPerAp || !users) return null;
      const apByCoverage = Math.ceil(area / covPerAp);
      const apByUsers = Math.ceil(users / 25);
      const recommended = Math.max(apByCoverage, apByUsers);
      const usersPerAp = Math.round(users / recommended);
      return {
        primary: { label: "Access Points Needed", value: String(recommended) },
        details: [
          { label: "APs by Coverage", value: String(apByCoverage) },
          { label: "APs by User Density", value: String(apByUsers) },
          { label: "Users Per AP", value: String(usersPerAp) },
        ],
      };
  }`,
  [{ q: 'How many devices can one access point handle?', a: 'A typical enterprise AP supports 25 to 50 concurrent devices.' },
   { q: 'Do walls reduce WiFi coverage?', a: 'Yes. Concrete and brick walls can reduce range by 30% to 50%.' }],
  'APs Needed = max(Area / Coverage Per AP, Users / 25)',
  []
);

add('ups-battery-calculator', 'UPS Battery Calculator',
  'Estimate UPS runtime based on battery capacity and load.',
  'Science', 'science', 'A',
  ['UPS runtime', 'battery backup calculator'],
  [
    '{ name: "upsVa", label: "UPS Rating (VA)", type: "number", min: 100, max: 20000, defaultValue: 1500 }',
    '{ name: "loadWatts", label: "Total Load (W)", type: "number", min: 10, max: 20000, defaultValue: 500 }',
    '{ name: "batteryAh", label: "Battery Capacity (Ah)", type: "number", min: 1, max: 200, defaultValue: 9 }',
  ],
  `(inputs) => {
      const va = inputs.upsVa as number;
      const load = inputs.loadWatts as number;
      const ah = inputs.batteryAh as number;
      if (!va || !load || !ah) return null;
      const batteryV = 12;
      const batteryWh = batteryV * ah;
      const efficiency = 0.85;
      const runtime = Math.round((batteryWh * efficiency / load) * 60 * 10) / 10;
      const loadPercent = Math.round((load / (va * 0.6)) * 100);
      return {
        primary: { label: "Estimated Runtime", value: formatNumber(runtime) + " min" },
        details: [
          { label: "Battery Energy", value: formatNumber(batteryWh) + " Wh" },
          { label: "Load Percentage", value: formatNumber(Math.min(loadPercent, 999)) + "%" },
          { label: "Efficiency Factor", value: "85%" },
        ],
      };
  }`,
  [{ q: 'How long will a UPS last?', a: 'Runtime depends on battery size and load. Lower load means longer runtime.' },
   { q: 'What size UPS do I need for a PC?', a: 'A 1000 to 1500 VA UPS handles most desktop computer setups.' }],
  'Runtime (min) = (Battery Ah x 12V x 0.85 / Load W) x 60',
  []
);

add('server-rack-calculator', 'Server Rack Calculator',
  'Calculate rack units needed for server equipment.',
  'Science', 'science', 'A',
  ['server rack units', 'rack space calculator'],
  [
    '{ name: "servers", label: "Number of 1U Servers", type: "number", min: 0, max: 42, defaultValue: 6 }',
    '{ name: "switches", label: "Number of 1U Switches", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "patchPanels", label: "Number of 1U Patch Panels", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "ups", label: "Number of 2U UPS Units", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const servers = inputs.servers as number;
      const switches = inputs.switches as number;
      const panels = inputs.patchPanels as number;
      const ups = inputs.ups as number;
      const totalU = servers + switches + panels + (ups * 2);
      const spacers = Math.floor(totalU / 6);
      const totalWithSpacers = totalU + spacers;
      const racksNeeded = Math.ceil(totalWithSpacers / 42);
      return {
        primary: { label: "Total Rack Units", value: String(totalWithSpacers) + " U" },
        details: [
          { label: "Equipment Units", value: String(totalU) + " U" },
          { label: "Spacers / Blanks", value: String(spacers) + " U" },
          { label: "42U Racks Needed", value: String(racksNeeded) },
        ],
      };
  }`,
  [{ q: 'What is a rack unit?', a: 'A rack unit (U) is 1.75 inches of vertical rack space.' },
   { q: 'How many servers fit in a standard rack?', a: 'A standard 42U rack holds up to 42 one-unit servers theoretically.' }],
  'Total U = Servers + Switches + Panels + (UPS x 2) + Spacers',
  []
);

add('data-transfer-time-calculator', 'Data Transfer Time Calculator',
  'Estimate file transfer time based on size and speed.',
  'Science', 'science', 'A',
  ['data transfer time', 'file transfer calculator'],
  [
    '{ name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 100000, defaultValue: 10 }',
    '{ name: "speed", label: "Transfer Speed (Mbps)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "overhead", label: "Protocol Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const size = inputs.fileSize as number;
      const speed = inputs.speed as number;
      const overhead = inputs.overhead as number;
      if (!size || !speed) return null;
      const effectiveSpeed = speed * (1 - overhead / 100);
      const sizeMb = size * 1024 * 8;
      const seconds = Math.round(sizeMb / effectiveSpeed * 10) / 10;
      const minutes = Math.round(seconds / 60 * 10) / 10;
      const hours = Math.round(seconds / 3600 * 100) / 100;
      return {
        primary: { label: "Transfer Time", value: seconds < 120 ? formatNumber(seconds) + " sec" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed)) + " Mbps" },
          { label: "File Size", value: formatNumber(size) + " GB" },
          { label: "Hours", value: formatNumber(hours) },
        ],
      };
  }`,
  [{ q: 'Why is my transfer slower than the rated speed?', a: 'Protocol overhead and network congestion reduce real throughput.' },
   { q: 'What is Mbps vs MBps?', a: 'Mbps is megabits per second. MBps is megabytes. Divide Mbps by 8 for MBps.' }],
  'Time = (File Size in Mb) / Effective Speed',
  []
);

add('bandwidth-calculator', 'Bandwidth Calculator',
  'Calculate bandwidth needs based on users and usage type.',
  'Science', 'science', 'A',
  ['bandwidth calculator', 'internet speed needs'],
  [
    '{ name: "users", label: "Number of Users", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "usageType", label: "Usage Type", type: "select", options: [{ value: "1", label: "Basic (email/web)" }, { value: "3", label: "Standard (video calls)" }, { value: "8", label: "Heavy (streaming/cloud)" }], defaultValue: "3" }',
    '{ name: "concurrency", label: "Concurrency (%)", type: "number", min: 10, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
      const users = inputs.users as number;
      const usage = inputs.usageType as number;
      const conc = inputs.concurrency as number;
      if (!users || !usage || !conc) return null;
      const concurrentUsers = Math.ceil(users * conc / 100);
      const totalMbps = Math.round(concurrentUsers * usage * 10) / 10;
      const recommended = Math.round(totalMbps * 1.3);
      return {
        primary: { label: "Recommended Bandwidth", value: formatNumber(recommended) + " Mbps" },
        details: [
          { label: "Concurrent Users", value: formatNumber(concurrentUsers) },
          { label: "Calculated Need", value: formatNumber(totalMbps) + " Mbps" },
          { label: "Per User", value: formatNumber(usage) + " Mbps" },
        ],
      };
  }`,
  [{ q: 'How much bandwidth per user?', a: 'Plan 1 to 3 Mbps for basic use and 5 to 10 Mbps for video calls.' },
   { q: 'What is concurrency?', a: 'Concurrency is the percentage of users active at the same time.' }],
  'Bandwidth = Concurrent Users x Per User Mbps x 1.3',
  []
);

add('ip-subnet-calculator', 'IP Subnet Calculator',
  'Calculate subnet mask, host count, and address range.',
  'Science', 'science', 'A',
  ['subnet calculator', 'IP subnet mask'],
  [
    '{ name: "cidr", label: "CIDR Prefix Length", type: "number", min: 1, max: 30, defaultValue: 24 }',
    '{ name: "subnetsNeeded", label: "Subnets Needed", type: "number", min: 1, max: 256, defaultValue: 1 }',
  ],
  `(inputs) => {
      const cidr = inputs.cidr as number;
      const subnets = inputs.subnetsNeeded as number;
      if (!cidr || !subnets) return null;
      const totalHosts = Math.pow(2, 32 - cidr) - 2;
      const subnetBits = Math.ceil(Math.log2(subnets));
      const newCidr = Math.min(cidr + subnetBits, 30);
      const hostsPerSubnet = Math.pow(2, 32 - newCidr) - 2;
      const octets = [0, 0, 0, 0];
      let bits = cidr;
      for (let i = 0; i < 4; i++) {
        if (bits >= 8) { octets[i] = 255; bits -= 8; }
        else if (bits > 0) { octets[i] = 256 - Math.pow(2, 8 - bits); bits = 0; }
      }
      const mask = octets.join(".");
      return {
        primary: { label: "Usable Hosts", value: formatNumber(Math.max(totalHosts, 0)) },
        details: [
          { label: "Subnet Mask", value: mask },
          { label: "New CIDR (with subnets)", value: "/" + String(newCidr) },
          { label: "Hosts Per Subnet", value: formatNumber(Math.max(hostsPerSubnet, 0)) },
        ],
      };
  }`,
  [{ q: 'What is CIDR notation?', a: 'CIDR notation like /24 defines how many bits are used for the network.' },
   { q: 'How many hosts in a /24 subnet?', a: 'A /24 subnet has 254 usable host addresses.' }],
  'Usable Hosts = 2^(32 - CIDR) - 2',
  []
);

add('raid-capacity-calculator', 'RAID Capacity Calculator',
  'Calculate usable capacity of a RAID disk array.',
  'Science', 'science', 'A',
  ['RAID capacity', 'disk array calculator'],
  [
    '{ name: "diskCount", label: "Number of Disks", type: "number", min: 2, max: 24, defaultValue: 4 }',
    '{ name: "diskSize", label: "Disk Size (TB)", type: "number", min: 0.1, max: 20, defaultValue: 2 }',
    '{ name: "raidLevel", label: "RAID Level", type: "select", options: [{ value: "0", label: "RAID 0 (Stripe)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single Parity)" }, { value: "6", label: "RAID 6 (Double Parity)" }, { value: "10", label: "RAID 10 (Mirror+Stripe)" }], defaultValue: "5" }',
  ],
  `(inputs) => {
      const disks = inputs.diskCount as number;
      const size = inputs.diskSize as number;
      const raid = inputs.raidLevel as number;
      if (!disks || !size) return null;
      let usable = 0;
      let fault = 0;
      if (raid === 0) { usable = disks * size; fault = 0; }
      else if (raid === 1) { usable = size; fault = disks - 1; }
      else if (raid === 5) { usable = (disks - 1) * size; fault = 1; }
      else if (raid === 6) { usable = (disks - 2) * size; fault = 2; }
      else if (raid === 10) { usable = Math.floor(disks / 2) * size; fault = 1; }
      const rawTotal = disks * size;
      const efficiency = Math.round((usable / rawTotal) * 100);
      return {
        primary: { label: "Usable Capacity", value: formatNumber(Math.round(usable * 100) / 100) + " TB" },
        details: [
          { label: "Raw Capacity", value: formatNumber(rawTotal) + " TB" },
          { label: "Storage Efficiency", value: formatNumber(efficiency) + "%" },
          { label: "Fault Tolerance", value: String(fault) + " disk(s)" },
        ],
      };
  }`,
  [{ q: 'Which RAID level is best?', a: 'RAID 5 or 6 offers a good balance of capacity and redundancy.' },
   { q: 'Does RAID replace backups?', a: 'No. RAID is not a backup. You still need separate backup copies.' }],
  'RAID 5 Usable = (Disks - 1) x Disk Size',
  []
);

add('backup-storage-calculator', 'Backup Storage Calculator',
  'Estimate storage needed for backup retention policies.',
  'Science', 'science', 'A',
  ['backup storage', 'backup size calculator'],
  [
    '{ name: "dataSize", label: "Data Size (GB)", type: "number", min: 1, max: 1000000, defaultValue: 500 }',
    '{ name: "dailyChange", label: "Daily Change Rate (%)", type: "number", min: 0.1, max: 100, defaultValue: 5 }',
    '{ name: "retentionDays", label: "Retention Period (days)", type: "number", min: 1, max: 365, defaultValue: 30 }',
  ],
  `(inputs) => {
      const data = inputs.dataSize as number;
      const change = inputs.dailyChange as number;
      const days = inputs.retentionDays as number;
      if (!data || !change || !days) return null;
      const fullBackup = data;
      const incrementalSize = data * (change / 100);
      const totalIncremental = incrementalSize * (days - 1);
      const totalStorage = Math.round((fullBackup + totalIncremental) * 100) / 100;
      const totalTB = Math.round(totalStorage / 1024 * 100) / 100;
      return {
        primary: { label: "Total Backup Storage", value: totalStorage > 1024 ? formatNumber(totalTB) + " TB" : formatNumber(Math.round(totalStorage)) + " GB" },
        details: [
          { label: "Full Backup Size", value: formatNumber(fullBackup) + " GB" },
          { label: "Daily Incremental", value: formatNumber(Math.round(incrementalSize * 100) / 100) + " GB" },
          { label: "Retention Period", value: String(days) + " days" },
        ],
      };
  }`,
  [{ q: 'What is an incremental backup?', a: 'An incremental backup only saves data that changed since the last backup.' },
   { q: 'How long should I retain backups?', a: 'Retain daily backups for 30 days and monthly backups for one year.' }],
  'Total = Full Backup + (Daily Change x (Retention Days - 1))',
  []
);

add('print-time-3d-calculator', '3D Print Time Calculator',
  'Estimate 3D printing time from volume and settings.',
  'Science', 'science', 'A',
  ['3D print time', 'print duration calculator'],
  [
    '{ name: "volume", label: "Part Volume (cm3)", type: "number", min: 0.1, max: 10000, defaultValue: 50 }',
    '{ name: "layerHeight", label: "Layer Height (mm)", type: "number", min: 0.05, max: 0.6, defaultValue: 0.2 }',
    '{ name: "printSpeed", label: "Print Speed (mm/s)", type: "number", min: 10, max: 300, defaultValue: 60 }',
    '{ name: "infill", label: "Infill (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const layer = inputs.layerHeight as number;
      const speed = inputs.printSpeed as number;
      const infill = inputs.infill as number;
      if (!vol || !layer || !speed) return null;
      const effectiveVol = vol * (0.3 + infill / 100 * 0.7);
      const layerArea = effectiveVol * 1000 / (layer);
      const pathLength = layerArea / 0.4;
      const timeSeconds = pathLength / speed;
      const hours = Math.round(timeSeconds / 3600 * 10) / 10;
      const minutes = Math.round(timeSeconds / 60);
      return {
        primary: { label: "Estimated Print Time", value: hours >= 1 ? formatNumber(hours) + " hrs" : formatNumber(minutes) + " min" },
        details: [
          { label: "Effective Volume", value: formatNumber(Math.round(effectiveVol * 10) / 10) + " cm3" },
          { label: "Total Path Length", value: formatNumber(Math.round(pathLength / 1000)) + " m" },
          { label: "Layer Height", value: formatNumber(layer) + " mm" },
        ],
      };
  }`,
  [{ q: 'Does layer height affect print time?', a: 'Yes. Thinner layers increase quality but double the print time.' },
   { q: 'What is a good print speed?', a: 'Most FDM printers work well at 40 to 80 mm per second.' }],
  'Time = Path Length / Print Speed',
  []
);

add('filament-usage-calculator', 'Filament Usage Calculator',
  'Calculate 3D printer filament needed for a print job.',
  'Science', 'science', 'A',
  ['filament usage', '3D filament calculator'],
  [
    '{ name: "volume", label: "Part Volume (cm3)", type: "number", min: 0.1, max: 10000, defaultValue: 30 }',
    '{ name: "infill", label: "Infill (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "density", label: "Filament Density (g/cm3)", type: "number", min: 0.5, max: 3, defaultValue: 1.24 }',
    '{ name: "spoolWeight", label: "Spool Weight (g)", type: "number", min: 100, max: 5000, defaultValue: 1000 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const infill = inputs.infill as number;
      const density = inputs.density as number;
      const spool = inputs.spoolWeight as number;
      if (!vol || !density || !spool) return null;
      const effectiveVol = vol * (0.3 + infill / 100 * 0.7);
      const weightG = Math.round(effectiveVol * density * 100) / 100;
      const lengthM = Math.round(effectiveVol / (Math.PI * 0.08625 * 0.08625) / 100 * 100) / 100;
      const spoolFraction = Math.round((weightG / spool) * 100);
      return {
        primary: { label: "Filament Weight", value: formatNumber(weightG) + " g" },
        details: [
          { label: "Filament Length", value: formatNumber(lengthM) + " m" },
          { label: "Spool Usage", value: formatNumber(spoolFraction) + "%" },
          { label: "Effective Volume", value: formatNumber(Math.round(effectiveVol * 10) / 10) + " cm3" },
        ],
      };
  }`,
  [{ q: 'How much filament does a print use?', a: 'Most small prints use 10 to 50 grams of filament.' },
   { q: 'What is PLA density?', a: 'PLA filament has a density of about 1.24 grams per cubic centimeter.' }],
  'Weight = Effective Volume x Filament Density',
  []
);

add('laser-cutting-cost-calculator', 'Laser Cutting Cost Calculator',
  'Estimate cost for a laser cutting job by material and time.',
  'Finance', 'finance', '$',
  ['laser cutting cost', 'laser cut estimate'],
  [
    '{ name: "cutLength", label: "Total Cut Length (in)", type: "number", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "materialThick", label: "Material Thickness (mm)", type: "number", min: 0.5, max: 25, defaultValue: 3 }',
    '{ name: "ratePerMin", label: "Machine Rate ($/min)", type: "number", min: 0.5, max: 20, defaultValue: 3 }',
    '{ name: "materialCost", label: "Material Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 25 }',
  ],
  `(inputs) => {
      const cutLen = inputs.cutLength as number;
      const thick = inputs.materialThick as number;
      const rate = inputs.ratePerMin as number;
      const matCost = inputs.materialCost as number;
      if (!cutLen || !thick || !rate) return null;
      const speedIpm = Math.max(5, 120 / thick);
      const cutTimeMin = Math.round(cutLen / speedIpm * 100) / 100;
      const machineCost = Math.round(cutTimeMin * rate * 100) / 100;
      const totalCost = Math.round((machineCost + matCost) * 100) / 100;
      return {
        primary: { label: "Total Job Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Machine Cost", value: "$" + formatNumber(machineCost) },
          { label: "Material Cost", value: "$" + formatNumber(matCost) },
        ],
      };
  }`,
  [{ q: 'What affects laser cutting cost?', a: 'Material thickness, cut length, and machine rate are the main factors.' },
   { q: 'Is laser cutting expensive?', a: 'Laser cutting is cost effective for detailed cuts and small batches.' }],
  'Total Cost = (Cut Length / Speed) x Rate + Material Cost',
  []
);

add('cnc-machining-cost-calculator', 'CNC Machining Cost Calculator',
  'Estimate CNC machining time and cost for a part.',
  'Finance', 'finance', '$',
  ['CNC machining cost', 'CNC time estimate'],
  [
    '{ name: "materialVolume", label: "Material Volume (in3)", type: "number", min: 0.1, max: 5000, defaultValue: 20 }',
    '{ name: "removalRate", label: "Removal Rate (in3/min)", type: "number", min: 0.01, max: 10, defaultValue: 0.5 }',
    '{ name: "machineRate", label: "Machine Rate ($/hr)", type: "number", min: 10, max: 500, defaultValue: 75 }',
    '{ name: "setupTime", label: "Setup Time (min)", type: "number", min: 0, max: 480, defaultValue: 30 }',
  ],
  `(inputs) => {
      const vol = inputs.materialVolume as number;
      const removal = inputs.removalRate as number;
      const rate = inputs.machineRate as number;
      const setup = inputs.setupTime as number;
      if (!vol || !removal || !rate) return null;
      const cutTimeMin = Math.round(vol / removal * 10) / 10;
      const totalMin = cutTimeMin + setup;
      const totalHrs = Math.round(totalMin / 60 * 100) / 100;
      const cost = Math.round(totalHrs * rate * 100) / 100;
      return {
        primary: { label: "Total Machining Cost", value: "$" + formatNumber(cost) },
        details: [
          { label: "Cut Time", value: formatNumber(cutTimeMin) + " min" },
          { label: "Total Time (with setup)", value: formatNumber(totalMin) + " min" },
          { label: "Total Hours", value: formatNumber(totalHrs) + " hrs" },
        ],
      };
  }`,
  [{ q: 'What affects CNC machining cost?', a: 'Material hardness, part complexity, and machine rate drive cost.' },
   { q: 'What is a typical CNC machine rate?', a: 'CNC machine rates range from $50 to $150 per hour typically.' }],
  'Cost = ((Volume / Removal Rate) + Setup Time) / 60 x Rate',
  []
);

add('injection-molding-cost-calculator', 'Injection Molding Cost Calculator',
  'Calculate per-part cost for injection molded parts.',
  'Finance', 'finance', '$',
  ['injection molding cost', 'per part mold cost'],
  [
    '{ name: "moldCost", label: "Mold Cost ($)", type: "number", min: 100, max: 500000, defaultValue: 15000 }',
    '{ name: "partCount", label: "Total Parts", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "materialPerPart", label: "Material Per Part ($)", type: "number", min: 0.01, max: 50, defaultValue: 0.25 }',
    '{ name: "cycleTime", label: "Cycle Time (sec)", type: "number", min: 5, max: 300, defaultValue: 30 }',
  ],
  `(inputs) => {
      const mold = inputs.moldCost as number;
      const parts = inputs.partCount as number;
      const matPer = inputs.materialPerPart as number;
      const cycle = inputs.cycleTime as number;
      if (!mold || !parts || !matPer || !cycle) return null;
      const machineRate = 40;
      const laborPerPart = Math.round((cycle / 3600) * machineRate * 100) / 100;
      const moldPerPart = Math.round((mold / parts) * 100) / 100;
      const totalPerPart = Math.round((moldPerPart + matPer + laborPerPart) * 100) / 100;
      const totalCost = Math.round(totalPerPart * parts);
      return {
        primary: { label: "Cost Per Part", value: "$" + formatNumber(totalPerPart) },
        details: [
          { label: "Mold Amortization Per Part", value: "$" + formatNumber(moldPerPart) },
          { label: "Material Per Part", value: "$" + formatNumber(matPer) },
          { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  }`,
  [{ q: 'How much does an injection mold cost?', a: 'Simple molds start around $3000. Complex molds can exceed $100000.' },
   { q: 'How many parts before injection molding is worth it?', a: 'Injection molding is cost effective above about 1000 parts typically.' }],
  'Per Part = (Mold Cost / Parts) + Material + Labor',
  []
);

add('pcb-trace-width-calculator', 'PCB Trace Width Calculator',
  'Calculate PCB trace width needed for a given current.',
  'Science', 'science', 'A',
  ['PCB trace width', 'trace current calculator'],
  [
    '{ name: "current", label: "Current (A)", type: "number", min: 0.01, max: 30, defaultValue: 1 }',
    '{ name: "copperWeight", label: "Copper Weight (oz)", type: "number", min: 0.5, max: 4, defaultValue: 1 }',
    '{ name: "tempRise", label: "Temp Rise (C)", type: "number", min: 5, max: 100, defaultValue: 10 }',
    '{ name: "layer", label: "Layer", type: "select", options: [{ value: "1", label: "External" }, { value: "2", label: "Internal" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const current = inputs.current as number;
      const copper = inputs.copperWeight as number;
      const tempRise = inputs.tempRise as number;
      const layer = inputs.layer as number;
      if (!current || !copper || !tempRise) return null;
      const thickness = copper * 1.378;
      const k = layer === 1 ? 0.048 : 0.024;
      const area = Math.pow(current / (k * Math.pow(tempRise, 0.44)), 1 / 0.725);
      const widthMils = Math.round((area / thickness) * 100) / 100;
      const widthMm = Math.round(widthMils * 0.0254 * 100) / 100;
      return {
        primary: { label: "Trace Width", value: formatNumber(widthMils) + " mils" },
        details: [
          { label: "Width (mm)", value: formatNumber(widthMm) + " mm" },
          { label: "Cross Section Area", value: formatNumber(Math.round(area * 100) / 100) + " mil2" },
          { label: "Copper Thickness", value: formatNumber(Math.round(thickness * 100) / 100) + " mils" },
        ],
      };
  }`,
  [{ q: 'What standard is used for PCB trace width?', a: 'IPC-2221 provides the standard formula for trace width calculations.' },
   { q: 'Do internal layers need wider traces?', a: 'Yes. Internal layers dissipate less heat and need wider traces.' }],
  'Area = (Current / (k x TempRise^0.44))^(1/0.725)',
  []
);

add('heat-sink-calculator', 'Heat Sink Calculator',
  'Calculate required heat sink thermal resistance.',
  'Science', 'science', 'A',
  ['heat sink calculator', 'thermal resistance'],
  [
    '{ name: "powerW", label: "Power Dissipation (W)", type: "number", min: 0.1, max: 500, defaultValue: 10 }',
    '{ name: "maxJunctionTemp", label: "Max Junction Temp (C)", type: "number", min: 50, max: 200, defaultValue: 125 }',
    '{ name: "ambientTemp", label: "Ambient Temp (C)", type: "number", min: 0, max: 60, defaultValue: 25 }',
    '{ name: "thetaJC", label: "Junction-to-Case Theta (C/W)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }',
  ],
  `(inputs) => {
      const power = inputs.powerW as number;
      const maxTj = inputs.maxJunctionTemp as number;
      const ambient = inputs.ambientTemp as number;
      const thetaJC = inputs.thetaJC as number;
      if (!power || !maxTj || !thetaJC) return null;
      const totalTheta = (maxTj - ambient) / power;
      const thetaCS = 0.5;
      const thetaHS = Math.round((totalTheta - thetaJC - thetaCS) * 100) / 100;
      const junctionTemp = Math.round(ambient + power * (thetaJC + thetaCS + Math.max(thetaHS, 0)));
      return {
        primary: { label: "Required Heat Sink Theta", value: formatNumber(Math.max(thetaHS, 0)) + " C/W" },
        details: [
          { label: "Total Thermal Budget", value: formatNumber(Math.round(totalTheta * 100) / 100) + " C/W" },
          { label: "Junction Temp (est.)", value: formatNumber(junctionTemp) + " C" },
          { label: "Feasible", value: thetaHS > 0 ? "Yes" : "No - reduce power or raise max temp" },
        ],
      };
  }`,
  [{ q: 'What is thermal resistance?', a: 'Thermal resistance measures how well heat flows, in degrees C per watt.' },
   { q: 'Lower thermal resistance is better?', a: 'Yes. Lower C/W means the heat sink dissipates heat more effectively.' }],
  'Theta HS = (Tj Max - Ambient) / Power - Theta JC - Theta CS',
  []
);

add('stepper-motor-torque-calculator', 'Stepper Motor Torque Calculator',
  'Calculate stepper motor torque needed for a given load.',
  'Science', 'science', 'A',
  ['stepper motor torque', 'motor sizing calculator'],
  [
    '{ name: "loadWeight", label: "Load Weight (kg)", type: "number", min: 0.01, max: 500, defaultValue: 2 }',
    '{ name: "leadScrew", label: "Lead Screw Pitch (mm/rev)", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "acceleration", label: "Acceleration (mm/s2)", type: "number", min: 1, max: 50000, defaultValue: 1000 }',
    '{ name: "friction", label: "Friction Coefficient", type: "number", min: 0.01, max: 1, defaultValue: 0.15 }',
  ],
  `(inputs) => {
      const mass = inputs.loadWeight as number;
      const pitch = inputs.leadScrew as number;
      const accel = inputs.acceleration as number;
      const mu = inputs.friction as number;
      if (!mass || !pitch || !accel || !mu) return null;
      const gravity = 9.81;
      const frictionForce = mass * gravity * mu;
      const accelForce = mass * accel / 1000;
      const totalForce = frictionForce + accelForce;
      const torqueNm = Math.round(totalForce * pitch / (2 * Math.PI * 1000) * 10000) / 10000;
      const torqueOzIn = Math.round(torqueNm * 141.612 * 10) / 10;
      const safetyTorque = Math.round(torqueNm * 2 * 10000) / 10000;
      return {
        primary: { label: "Required Torque", value: formatNumber(torqueOzIn) + " oz-in" },
        details: [
          { label: "Torque (Nm)", value: formatNumber(torqueNm) + " Nm" },
          { label: "With 2x Safety Factor", value: formatNumber(Math.round(safetyTorque * 141.612 * 10) / 10) + " oz-in" },
          { label: "Total Linear Force", value: formatNumber(Math.round(totalForce * 100) / 100) + " N" },
        ],
      };
  }`,
  [{ q: 'What safety factor should I use?', a: 'Use a 2x safety factor to ensure the motor handles peak loads.' },
   { q: 'Does speed affect torque?', a: 'Yes. Stepper motors lose torque as speed increases.' }],
  'Torque = Total Force x Pitch / (2 x PI x 1000)',
  []
);