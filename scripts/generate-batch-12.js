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

// === BATCH 12: 100 CALCULATORS ===

add(
  "exposure-triangle-calculator",
  "Exposure Triangle Calculator",
  "Calculate the relationship between aperture, shutter speed, and ISO to achieve correct exposure for any lighting scenario.",
  "Science",
  "science",
  "A",
  ["exposure triangle", "photography exposure", "aperture shutter speed ISO", "camera exposure calculator"],
  [
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 5.6 }',
    '{ name: "shutterSpeed", label: "Shutter Speed (1/x sec)", type: "number", min: 1, max: 8000, defaultValue: 125 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 102400, defaultValue: 100 }',
    '{ name: "targetEv", label: "Target EV (Exposure Value)", type: "number", min: -6, max: 20, defaultValue: 12 }'
  ],
  `(inputs) => {
    const aperture = inputs.aperture as number;
    const shutter = inputs.shutterSpeed as number;
    const iso = inputs.iso as number;
    const targetEv = inputs.targetEv as number;
    const ev = Math.log2(aperture * aperture * shutter) - Math.log2(iso / 100);
    const evRounded = Math.round(ev * 100) / 100;
    const diff = evRounded - targetEv;
    const stopsOff = Math.round(diff * 10) / 10;
    const suggestion = diff > 0.5 ? "Overexposed — increase shutter speed or close aperture" : diff < -0.5 ? "Underexposed — decrease shutter speed or open aperture" : "Exposure is within acceptable range";
    return {
      primary: { label: "Current EV", value: formatNumber(evRounded) },
      details: [
        { label: "Target EV", value: formatNumber(targetEv) },
        { label: "Stops Off Target", value: (stopsOff > 0 ? "+" : "") + formatNumber(stopsOff) },
        { label: "Assessment", value: suggestion }
      ]
    };
  }`,
  [
    { q: "What is the exposure triangle?", a: "The exposure triangle describes the relationship between aperture, shutter speed, and ISO. Changing one setting requires adjusting another to maintain the same exposure." },
    { q: "What EV value represents daylight?", a: "Bright daylight is typically around EV 14-15, overcast days around EV 12, and indoor lighting around EV 5-8." },
    { q: "How does ISO affect image quality?", a: "Higher ISO values increase sensor sensitivity but also introduce more digital noise. Use the lowest ISO that still allows proper exposure." }
  ],
  `EV = log2(aperture^2 x shutter_speed) - log2(ISO / 100)
Stops Off = Current EV - Target EV`,
  ["depth-of-field-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "camera-sensor-crop-factor-calculator",
  "Camera Sensor Crop Factor Calculator",
  "Calculate equivalent focal length and field of view based on your camera sensor size and crop factor.",
  "Science",
  "science",
  "A",
  ["crop factor", "sensor crop", "equivalent focal length", "camera sensor size", "APS-C crop factor"],
  [
    '{ name: "focalLength", label: "Lens Focal Length (mm)", type: "number", min: 1, max: 2000, defaultValue: 50 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame (1.0x)" }, { value: "2", label: "APS-C Canon (1.6x)" }, { value: "3", label: "APS-C Nikon/Sony (1.5x)" }, { value: "4", label: "Micro Four Thirds (2.0x)" }, { value: "5", label: "1-inch (2.7x)" }], defaultValue: "3" }',
    '{ name: "aperture", label: "Lens Aperture (f-stop)", type: "number", min: 0.7, max: 64, defaultValue: 1.8 }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const sensorType = parseInt(inputs.sensorType as string);
    const aperture = inputs.aperture as number;
    const cropFactors = [0, 1.0, 1.6, 1.5, 2.0, 2.7];
    const crop = cropFactors[sensorType];
    const eqFocal = Math.round(fl * crop * 10) / 10;
    const eqAperture = Math.round(aperture * crop * 10) / 10;
    const fovFull = 2 * Math.atan(36 / (2 * fl)) * (180 / Math.PI);
    const fovCropped = 2 * Math.atan(36 / (2 * eqFocal)) * (180 / Math.PI);
    return {
      primary: { label: "Equivalent Focal Length", value: formatNumber(eqFocal) + " mm" },
      details: [
        { label: "Crop Factor", value: formatNumber(crop) + "x" },
        { label: "Equivalent Aperture (DOF)", value: "f/" + formatNumber(eqAperture) },
        { label: "Field of View (Full Frame)", value: formatNumber(Math.round(fovFull * 10) / 10) + "°" },
        { label: "Field of View (Cropped)", value: formatNumber(Math.round(fovCropped * 10) / 10) + "°" }
      ]
    };
  }`,
  [
    { q: "What is crop factor?", a: "Crop factor is the ratio of a full frame sensor diagonal to your camera sensor diagonal. It multiplies the effective focal length of any lens mounted on that camera." },
    { q: "Does crop factor affect aperture?", a: "Crop factor does not change the actual light-gathering ability of a lens, but it does affect the equivalent depth of field. A 50mm f/1.8 on APS-C gives DOF similar to a 75mm f/2.7 on full frame." },
    { q: "Is a higher crop factor better or worse?", a: "Neither. A higher crop factor gives more reach (useful for wildlife and sports) but a narrower field of view (disadvantage for landscapes and architecture)." }
  ],
  `Equivalent Focal Length = Actual Focal Length x Crop Factor
Equivalent Aperture (DOF) = Actual Aperture x Crop Factor
Field of View = 2 x atan(sensor_width / (2 x focal_length))`,
  ["depth-of-field-calculator", "lens-focal-length-calculator"]
);

add(
  "hyperfocal-distance-calculator",
  "Hyperfocal Distance Calculator",
  "Calculate the hyperfocal distance for maximum depth of field in landscape and street photography.",
  "Science",
  "science",
  "A",
  ["hyperfocal distance", "landscape focus", "maximum depth of field", "infinity focus"],
  [
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 1, max: 1200, defaultValue: 35 }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 11 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame" }, { value: "2", label: "APS-C" }, { value: "3", label: "Micro Four Thirds" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const ap = inputs.aperture as number;
    const sensorType = parseInt(inputs.sensorType as string);
    const cocValues = [0, 0.03, 0.02, 0.015];
    const coc = cocValues[sensorType];
    const hyperfocalMm = (fl * fl) / (ap * coc) + fl;
    const hyperfocalM = Math.round(hyperfocalMm / 1000 * 100) / 100;
    const nearLimitM = Math.round(hyperfocalM / 2 * 100) / 100;
    const hyperfocalFt = Math.round(hyperfocalM * 3.281 * 100) / 100;
    return {
      primary: { label: "Hyperfocal Distance", value: formatNumber(hyperfocalM) + " m" },
      details: [
        { label: "Hyperfocal Distance (ft)", value: formatNumber(hyperfocalFt) + " ft" },
        { label: "Near Sharp Limit", value: formatNumber(nearLimitM) + " m" },
        { label: "Far Sharp Limit", value: "Infinity" },
        { label: "Circle of Confusion", value: formatNumber(coc) + " mm" }
      ]
    };
  }`,
  [
    { q: "What is hyperfocal distance?", a: "Hyperfocal distance is the closest focusing distance at which everything from half that distance to infinity appears acceptably sharp. It maximizes depth of field." },
    { q: "When should I use hyperfocal distance?", a: "Hyperfocal focusing is ideal for landscape, street, and architectural photography where you want maximum sharpness from foreground to background." },
    { q: "Does sensor size affect hyperfocal distance?", a: "Yes. Smaller sensors have a smaller circle of confusion, which results in a shorter hyperfocal distance for the same focal length and aperture." }
  ],
  `Hyperfocal Distance = (focal_length^2) / (aperture x CoC) + focal_length
Near Limit = Hyperfocal / 2`,
  ["depth-of-field-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "flash-guide-number-calculator",
  "Flash Guide Number Calculator",
  "Calculate flash exposure distance, required power, and guide number relationships for speedlight and studio flash photography.",
  "Science",
  "science",
  "A",
  ["flash guide number", "speedlight calculator", "flash distance", "flash power", "GN calculator"],
  [
    '{ name: "guideNumber", label: "Flash Guide Number (m at ISO 100)", type: "number", min: 5, max: 200, defaultValue: 36 }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 5.6 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 12800, defaultValue: 100 }',
    '{ name: "powerLevel", label: "Flash Power", type: "select", options: [{ value: "1", label: "1/1 (Full)" }, { value: "2", label: "1/2" }, { value: "4", label: "1/4" }, { value: "8", label: "1/8" }, { value: "16", label: "1/16" }, { value: "32", label: "1/32" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const gn = inputs.guideNumber as number;
    const aperture = inputs.aperture as number;
    const iso = inputs.iso as number;
    const power = parseInt(inputs.powerLevel as string);
    const isoFactor = Math.sqrt(iso / 100);
    const powerFactor = Math.sqrt(1 / power);
    const effectiveGN = gn * isoFactor * powerFactor;
    const maxDist = Math.round(effectiveGN / aperture * 100) / 100;
    const maxDistFt = Math.round(maxDist * 3.281 * 100) / 100;
    return {
      primary: { label: "Maximum Flash Distance", value: formatNumber(maxDist) + " m" },
      details: [
        { label: "Distance (ft)", value: formatNumber(maxDistFt) + " ft" },
        { label: "Effective Guide Number", value: formatNumber(Math.round(effectiveGN * 10) / 10) },
        { label: "ISO Factor", value: formatNumber(Math.round(isoFactor * 100) / 100) + "x" },
        { label: "Power Factor", value: formatNumber(Math.round(powerFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    { q: "What is a flash guide number?", a: "The guide number (GN) indicates flash power. It equals the product of flash-to-subject distance and aperture at ISO 100. Higher GN means more powerful flash." },
    { q: "How does ISO affect flash distance?", a: "Doubling ISO increases effective flash distance by about 1.4x (square root of 2). Going from ISO 100 to 400 doubles the effective distance." },
    { q: "What guide number do I need?", a: "For indoor events, GN 36-58 is typical. Outdoor or large venue photography may require GN 58 or higher, or multiple flashes." }
  ],
  `Effective GN = Base GN x sqrt(ISO / 100) x sqrt(1 / power)
Max Distance = Effective GN / Aperture`,
  ["exposure-triangle-calculator", "lighting-setup-cost-calculator"]
);

add(
  "time-lapse-interval-calculator",
  "Time-Lapse Interval Calculator",
  "Calculate optimal interval, total shots, and storage requirements for time-lapse photography and video.",
  "Everyday",
  "everyday",
  "~",
  ["time-lapse calculator", "timelapse interval", "intervalometer", "time lapse shooting"],
  [
    '{ name: "eventDuration", label: "Event Duration (minutes)", type: "number", min: 1, max: 14400, defaultValue: 60 }',
    '{ name: "outputLength", label: "Desired Output Length (seconds)", type: "number", min: 1, max: 600, defaultValue: 30 }',
    '{ name: "fps", label: "Output Frame Rate (fps)", type: "select", options: [{ value: "24", label: "24 fps (Cinema)" }, { value: "25", label: "25 fps (PAL)" }, { value: "30", label: "30 fps (NTSC)" }, { value: "60", label: "60 fps (Smooth)" }], defaultValue: "24" }',
    '{ name: "fileSizeMB", label: "Avg Photo Size (MB)", type: "number", min: 1, max: 100, defaultValue: 25 }'
  ],
  `(inputs) => {
    const duration = inputs.eventDuration as number;
    const outputLen = inputs.outputLength as number;
    const fps = parseInt(inputs.fps as string);
    const fileSize = inputs.fileSizeMB as number;
    const totalFrames = outputLen * fps;
    const intervalSec = (duration * 60) / totalFrames;
    const storageGB = Math.round(totalFrames * fileSize / 1024 * 100) / 100;
    const intervalRounded = Math.round(intervalSec * 10) / 10;
    return {
      primary: { label: "Shooting Interval", value: formatNumber(intervalRounded) + " seconds" },
      details: [
        { label: "Total Frames Needed", value: formatNumber(totalFrames) },
        { label: "Storage Required", value: formatNumber(storageGB) + " GB" },
        { label: "Output Duration", value: formatNumber(outputLen) + " sec at " + formatNumber(fps) + " fps" },
        { label: "Event Duration", value: formatNumber(duration) + " minutes" }
      ]
    };
  }`,
  [
    { q: "What interval should I use for time-lapse?", a: "It depends on the subject. Clouds typically use 3-5 second intervals, sunsets 5-10 seconds, stars 20-30 seconds, and construction projects 5-15 minutes." },
    { q: "How many photos do I need for a time-lapse?", a: "At 24 fps, you need 720 photos for a 30-second video. At 30 fps, you need 900 photos for the same duration." },
    { q: "What frame rate should I use for time-lapse?", a: "24 fps gives a cinematic look, 30 fps is standard for web video, and 25 fps is used for PAL broadcast." }
  ],
  `Interval = (Event Duration in seconds) / (Output Length x FPS)
Total Frames = Output Length x FPS
Storage = Total Frames x File Size`,
  ["video-bitrate-estimator", "video-storage-estimator"]
);

add(
  "video-bitrate-estimator",
  "Video Bitrate Calculator",
  "Calculate recommended video bitrate and file size based on resolution, frame rate, codec, and content type.",
  "Everyday",
  "everyday",
  "~",
  ["video bitrate", "video file size calculator", "encoding bitrate", "streaming bitrate"],
  [
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "720p (1280x720)" }, { value: "2", label: "1080p (1920x1080)" }, { value: "3", label: "1440p (2560x1440)" }, { value: "4", label: "4K (3840x2160)" }, { value: "5", label: "8K (7680x4320)" }], defaultValue: "2" }',
    '{ name: "fps", label: "Frame Rate", type: "select", options: [{ value: "24", label: "24 fps" }, { value: "30", label: "30 fps" }, { value: "60", label: "60 fps" }, { value: "120", label: "120 fps" }], defaultValue: "30" }',
    '{ name: "codec", label: "Codec", type: "select", options: [{ value: "1", label: "H.264 (AVC)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "AV1" }], defaultValue: "1" }',
    '{ name: "duration", label: "Duration (minutes)", type: "number", min: 1, max: 600, defaultValue: 10 }'
  ],
  `(inputs) => {
    const res = parseInt(inputs.resolution as string);
    const fps = parseInt(inputs.fps as string);
    const codec = parseInt(inputs.codec as string);
    const duration = inputs.duration as number;
    const baseRates = [0, 5, 10, 20, 45, 150];
    const baseMbps = baseRates[res];
    const fpsMultiplier = fps / 30;
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.0 : 0.55;
    const bitrate = Math.round(baseMbps * fpsMultiplier * codecMultiplier * 10) / 10;
    const fileSizeGB = Math.round(bitrate * duration * 60 / 8 / 1024 * 100) / 100;
    const fileSizeMB = Math.round(bitrate * duration * 60 / 8);
    return {
      primary: { label: "Recommended Bitrate", value: formatNumber(bitrate) + " Mbps" },
      details: [
        { label: "File Size", value: fileSizeGB >= 1 ? formatNumber(fileSizeGB) + " GB" : formatNumber(fileSizeMB) + " MB" },
        { label: "Duration", value: formatNumber(duration) + " minutes" },
        { label: "FPS Multiplier", value: formatNumber(Math.round(fpsMultiplier * 100) / 100) + "x" },
        { label: "Codec Efficiency", value: formatNumber(codecMultiplier) + "x" }
      ]
    };
  }`,
  [
    { q: "What bitrate should I use for YouTube uploads?", a: "YouTube recommends 8 Mbps for 1080p at 30fps with H.264, 12 Mbps for 1080p at 60fps, and 35-45 Mbps for 4K at 30fps." },
    { q: "Is H.265 better than H.264?", a: "H.265 (HEVC) achieves roughly the same quality at 40-50% lower bitrate compared to H.264, but encoding is slower and not all devices support it." },
    { q: "What is ProRes used for?", a: "ProRes is an editing codec used in professional post-production. It has high bitrates but is optimized for editing performance rather than delivery." }
  ],
  `Bitrate = Base Rate x (FPS / 30) x Codec Multiplier
File Size (GB) = Bitrate (Mbps) x Duration (sec) / 8 / 1024`,
  ["video-storage-estimator", "video-render-time-estimator"]
);

add(
  "film-budget-estimator",
  "Film Budget Estimator",
  "Estimate total production budget for short films, music videos, and independent productions based on crew, equipment, and shooting days.",
  "Finance",
  "finance",
  "$",
  ["film budget", "video production cost", "movie budget calculator", "film production budget"],
  [
    '{ name: "shootDays", label: "Number of Shooting Days", type: "number", min: 1, max: 120, defaultValue: 5 }',
    '{ name: "crewSize", label: "Crew Size", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "avgDayRate", label: "Avg Crew Day Rate ($)", type: "number", min: 50, max: 5000, defaultValue: 350 }',
    '{ name: "equipmentPerDay", label: "Equipment Rental per Day ($)", type: "number", min: 0, max: 50000, defaultValue: 1500 }',
    '{ name: "locationPerDay", label: "Location Cost per Day ($)", type: "number", min: 0, max: 20000, defaultValue: 500 }',
    '{ name: "postDays", label: "Post-Production Days", type: "number", min: 0, max: 180, defaultValue: 10 }'
  ],
  `(inputs) => {
    const shootDays = inputs.shootDays as number;
    const crewSize = inputs.crewSize as number;
    const dayRate = inputs.avgDayRate as number;
    const equipment = inputs.equipmentPerDay as number;
    const location = inputs.locationPerDay as number;
    const postDays = inputs.postDays as number;
    const crewCost = crewSize * dayRate * shootDays;
    const equipCost = equipment * shootDays;
    const locCost = location * shootDays;
    const postCost = postDays * 500;
    const contingency = Math.round((crewCost + equipCost + locCost + postCost) * 0.1);
    const total = crewCost + equipCost + locCost + postCost + contingency;
    return {
      primary: { label: "Estimated Total Budget", value: "$" + formatNumber(total) },
      details: [
        { label: "Crew Costs", value: "$" + formatNumber(crewCost) },
        { label: "Equipment Costs", value: "$" + formatNumber(equipCost) },
        { label: "Location Costs", value: "$" + formatNumber(locCost) },
        { label: "Post-Production", value: "$" + formatNumber(postCost) },
        { label: "Contingency (10%)", value: "$" + formatNumber(contingency) }
      ]
    };
  }`,
  [
    { q: "What percentage of a film budget goes to crew?", a: "Crew costs typically represent 40-60% of an independent film budget, including above-the-line talent (director, producer, lead actors) and below-the-line crew." },
    { q: "How much contingency should I budget?", a: "Industry standard is 10-15% contingency for independent productions. Studio films may allocate 5-10% because of more detailed planning." },
    { q: "What does post-production cost?", a: "Post-production typically costs 15-30% of the overall budget. This includes editing, color grading, sound design, music licensing, and visual effects." }
  ],
  `Total Budget = Crew Costs + Equipment + Location + Post-Production + Contingency (10%)
Crew Costs = Crew Size x Day Rate x Shooting Days`,
  ["film-crew-size-estimator", "wedding-videography-cost-calculator"]
);

add(
  "golden-ratio-composition-calculator",
  "Golden Ratio Composition Calculator",
  "Calculate golden ratio guide points, phi grid lines, and golden spiral placement for photographic and artistic composition.",
  "Math",
  "math",
  "+",
  ["golden ratio composition", "phi grid photography", "golden spiral", "rule of thirds alternative"],
  [
    '{ name: "imageWidth", label: "Image Width (px)", type: "number", min: 100, max: 20000, defaultValue: 1920 }',
    '{ name: "imageHeight", label: "Image Height (px)", type: "number", min: 100, max: 20000, defaultValue: 1080 }',
    '{ name: "orientation", label: "Orientation", type: "select", options: [{ value: "1", label: "Landscape" }, { value: "2", label: "Portrait" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const w = inputs.imageWidth as number;
    const h = inputs.imageHeight as number;
    const orientation = parseInt(inputs.orientation as string);
    const phi = 1.618;
    const effW = orientation === 1 ? w : h;
    const effH = orientation === 1 ? h : w;
    const vLine1 = Math.round(effW / phi);
    const vLine2 = Math.round(effW - effW / phi);
    const hLine1 = Math.round(effH / phi);
    const hLine2 = Math.round(effH - effH / phi);
    const powerPoint1X = vLine2;
    const powerPoint1Y = hLine2;
    const powerPoint2X = vLine1;
    const powerPoint2Y = hLine1;
    return {
      primary: { label: "Primary Power Point", value: formatNumber(powerPoint1X) + ", " + formatNumber(powerPoint1Y) + " px" },
      details: [
        { label: "Secondary Power Point", value: formatNumber(powerPoint2X) + ", " + formatNumber(powerPoint2Y) + " px" },
        { label: "Vertical Phi Lines", value: formatNumber(vLine2) + " px & " + formatNumber(vLine1) + " px" },
        { label: "Horizontal Phi Lines", value: formatNumber(hLine2) + " px & " + formatNumber(hLine1) + " px" },
        { label: "Image Dimensions", value: formatNumber(effW) + " x " + formatNumber(effH) + " px" }
      ]
    };
  }`,
  [
    { q: "What is the golden ratio in photography?", a: "The golden ratio (1.618) creates a compositional grid similar to the rule of thirds but with more mathematically harmonious proportions. It places key elements at natural focal points." },
    { q: "How is the phi grid different from rule of thirds?", a: "The phi grid places lines at approximately 38% and 62% rather than at 33% and 66%. This subtle shift creates compositions that many find more naturally balanced." },
    { q: "Where should I place my subject?", a: "Place your primary subject at one of the power points — the intersections of the phi grid lines. These points naturally attract the viewer's eye." }
  ],
  `Phi Grid Vertical Lines: W / 1.618 and W - W / 1.618
Phi Grid Horizontal Lines: H / 1.618 and H - H / 1.618
Power Points: intersections of phi grid lines`,
  ["golden-ratio-crop-calculator", "print-resolution-calculator"]
);

add(
  "video-storage-estimator",
  "Video Storage Estimator",
  "Calculate total storage needed for video projects based on resolution, codec, frame rate, and shooting duration.",
  "Everyday",
  "everyday",
  "~",
  ["video storage", "camera card size", "memory card calculator", "video footage storage"],
  [
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" }',
    '{ name: "codec", label: "Recording Codec", type: "select", options: [{ value: "1", label: "H.264 (Compressed)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "RAW" }], defaultValue: "1" }',
    '{ name: "fps", label: "Frame Rate (fps)", type: "number", min: 24, max: 240, defaultValue: 30 }',
    '{ name: "duration", label: "Total Recording Time (hours)", type: "number", min: 0.1, max: 100, defaultValue: 2 }'
  ],
  `(inputs) => {
    const res = parseInt(inputs.resolution as string);
    const codec = parseInt(inputs.codec as string);
    const fps = inputs.fps as number;
    const hours = inputs.duration as number;
    const baseGBperHour = [0, 15, 45, 90, 180];
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.5 : codec === 4 ? 8.0 : 1.0;
    const fpsMultiplier = fps / 30;
    const storageGB = Math.round(baseGBperHour[res] * codecMultiplier * fpsMultiplier * hours * 10) / 10;
    const storageTB = Math.round(storageGB / 1024 * 100) / 100;
    const cardsNeeded = Math.ceil(storageGB / 128);
    return {
      primary: { label: "Total Storage Needed", value: storageGB >= 1024 ? formatNumber(storageTB) + " TB" : formatNumber(storageGB) + " GB" },
      details: [
        { label: "Storage (GB)", value: formatNumber(storageGB) + " GB" },
        { label: "128GB Cards Needed", value: formatNumber(cardsNeeded) },
        { label: "Data Rate", value: formatNumber(Math.round(storageGB / hours / 3.6 * 10) / 10) + " MB/s" },
        { label: "Recording Duration", value: formatNumber(hours) + " hours" }
      ]
    };
  }`,
  [
    { q: "How much storage does 4K video use?", a: "4K H.264 at 30fps uses approximately 45 GB per hour. RAW 4K can use 300-400 GB per hour depending on the camera." },
    { q: "What size memory card do I need for video?", a: "For a full day of 4K shooting (6-8 hours), plan for at least 256-512 GB in H.264, or several terabytes for RAW formats." },
    { q: "What card speed do I need for 4K?", a: "4K recording typically requires write speeds of at least 60-100 MB/s. RAW recording may need 300 MB/s or faster." }
  ],
  `Storage (GB) = Base Rate x Codec Multiplier x (FPS / 30) x Hours
Base Rates: 1080p = 15 GB/hr, 4K = 45 GB/hr, 6K = 90 GB/hr, 8K = 180 GB/hr (H.264)`,
  ["video-bitrate-estimator", "photo-backup-storage-calculator"]
);

add(
  "green-screen-distance-calculator",
  "Green Screen Distance Calculator",
  "Calculate optimal distances between subject, green screen, and lights to minimize spill and achieve clean keying.",
  "Everyday",
  "everyday",
  "~",
  ["green screen distance", "chroma key setup", "green screen lighting", "chromakey calculator"],
  [
    '{ name: "screenWidth", label: "Green Screen Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "screenHeight", label: "Green Screen Height (ft)", type: "number", min: 4, max: 30, defaultValue: 9 }',
    '{ name: "subjectCount", label: "Number of Subjects", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "lensFL", label: "Lens Focal Length (mm)", type: "number", min: 16, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const screenW = inputs.screenWidth as number;
    const screenH = inputs.screenHeight as number;
    const subjects = inputs.subjectCount as number;
    const fl = inputs.lensFL as number;
    const subjectToScreen = Math.max(6, Math.round(screenW * 0.5));
    const minSpillDist = 6 + (subjects - 1) * 2;
    const subjectDist = Math.max(subjectToScreen, minSpillDist);
    const cameraToSubject = Math.round(fl / 10 * subjects * 1.5);
    const totalDepth = subjectDist + cameraToSubject;
    const lightToScreen = Math.round(screenW * 0.6);
    return {
      primary: { label: "Subject to Screen Distance", value: formatNumber(subjectDist) + " ft" },
      details: [
        { label: "Camera to Subject", value: formatNumber(cameraToSubject) + " ft" },
        { label: "Total Room Depth Needed", value: formatNumber(totalDepth) + " ft" },
        { label: "Screen Lights Distance", value: formatNumber(lightToScreen) + " ft from screen" },
        { label: "Min Screen Coverage", value: formatNumber(screenW) + " x " + formatNumber(screenH) + " ft" }
      ]
    };
  }`,
  [
    { q: "How far should the subject be from the green screen?", a: "At minimum 6-8 feet to avoid green spill on the subject. More distance gives cleaner results but requires a larger screen." },
    { q: "What color green screen is best?", a: "Chroma key green (Pantone 354C) is the most common. Blue screens are preferred for scenes with green elements or for digital skin tone preservation." },
    { q: "How do I light a green screen?", a: "Light the screen evenly and separately from your subject. Place lights 4-6 feet from the screen at 45 degree angles to minimize hot spots." }
  ],
  `Subject Distance = max(6 ft, Screen Width x 0.5)
Camera Distance = Focal Length / 10 x Subjects x 1.5
Total Depth = Subject Distance + Camera Distance`,
  ["lighting-setup-cost-calculator", "film-budget-estimator"]
);

add(
  "color-temperature-converter-calculator",
  "Color Temperature Converter",
  "Convert between color temperatures in Kelvin, mired values, and CRI ratings for photography and videography white balance.",
  "Conversion",
  "conversion",
  "R",
  ["color temperature", "kelvin to mired", "white balance", "CTO CTO gel", "color temperature converter"],
  [
    '{ name: "kelvin", label: "Color Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 5600 }',
    '{ name: "targetKelvin", label: "Target Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 3200 }',
    '{ name: "lightSource", label: "Light Source Reference", type: "select", options: [{ value: "1", label: "Daylight (5600K)" }, { value: "2", label: "Tungsten (3200K)" }, { value: "3", label: "Fluorescent (4000K)" }, { value: "4", label: "LED Panel (5000K)" }, { value: "5", label: "Candlelight (1900K)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const kelvin = inputs.kelvin as number;
    const target = inputs.targetKelvin as number;
    const source = parseInt(inputs.lightSource as string);
    const mired = Math.round(1000000 / kelvin);
    const targetMired = Math.round(1000000 / target);
    const miredShift = targetMired - mired;
    const gelNeeded = Math.abs(miredShift) > 100 ? "Full CTO/CTB" : Math.abs(miredShift) > 50 ? "1/2 CTO/CTB" : Math.abs(miredShift) > 25 ? "1/4 CTO/CTB" : "None or 1/8 gel";
    const direction = miredShift > 0 ? "Warming (CTO)" : miredShift < 0 ? "Cooling (CTB)" : "No shift needed";
    return {
      primary: { label: "Mired Shift Required", value: formatNumber(miredShift) + " mired" },
      details: [
        { label: "Source Mired Value", value: formatNumber(mired) },
        { label: "Target Mired Value", value: formatNumber(targetMired) },
        { label: "Gel Recommendation", value: gelNeeded },
        { label: "Direction", value: direction }
      ]
    };
  }`,
  [
    { q: "What is mired value?", a: "Mired (micro reciprocal degree) equals 1,000,000 divided by the color temperature in Kelvin. Mired shifts are more perceptually uniform than Kelvin differences." },
    { q: "What is the difference between CTO and CTB gels?", a: "CTO (Color Temperature Orange) warms light, shifting it toward tungsten. CTB (Color Temperature Blue) cools light, shifting it toward daylight." },
    { q: "What white balance should I set for mixed lighting?", a: "Set your camera to match the dominant light source, then use gels on secondary lights to match. Or shoot RAW and adjust in post-production." }
  ],
  `Mired = 1,000,000 / Kelvin
Mired Shift = Target Mired - Source Mired
Positive shift = warming, Negative shift = cooling`,
  ["exposure-triangle-calculator", "lighting-setup-cost-calculator"]
);

add(
  "photo-print-cost-calculator",
  "Photo Print Cost Per Unit Calculator",
  "Calculate cost per print, profit margins, and break-even pricing for photography print sales and lab orders.",
  "Finance",
  "finance",
  "$",
  ["photo print cost", "photography pricing", "print profit calculator", "photo lab cost"],
  [
    '{ name: "labCost", label: "Lab Cost Per Print ($)", type: "number", min: 0.1, max: 500, defaultValue: 2.5 }',
    '{ name: "shippingCost", label: "Shipping Cost Per Order ($)", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "printsPerOrder", label: "Avg Prints Per Order", type: "number", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "sellingPrice", label: "Selling Price Per Print ($)", type: "number", min: 0.5, max: 1000, defaultValue: 15 }',
    '{ name: "monthlyOrders", label: "Estimated Monthly Orders", type: "number", min: 1, max: 1000, defaultValue: 20 }'
  ],
  `(inputs) => {
    const labCost = inputs.labCost as number;
    const shipping = inputs.shippingCost as number;
    const perOrder = inputs.printsPerOrder as number;
    const price = inputs.sellingPrice as number;
    const orders = inputs.monthlyOrders as number;
    const costPerPrint = labCost + shipping / perOrder;
    const profitPerPrint = price - costPerPrint;
    const marginPct = Math.round(profitPerPrint / price * 100 * 10) / 10;
    const monthlyRevenue = price * perOrder * orders;
    const monthlyCost = costPerPrint * perOrder * orders;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    return {
      primary: { label: "Profit Per Print", value: "$" + formatNumber(Math.round(profitPerPrint * 100) / 100) },
      details: [
        { label: "Total Cost Per Print", value: "$" + formatNumber(Math.round(costPerPrint * 100) / 100) },
        { label: "Profit Margin", value: formatNumber(marginPct) + "%" },
        { label: "Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
        { label: "Monthly Profit", value: "$" + formatNumber(Math.round(monthlyProfit)) }
      ]
    };
  }`,
  [
    { q: "What is a good profit margin for photo prints?", a: "Professional photographers typically aim for 60-80% margins on prints. This accounts for shooting time, editing, and business overhead beyond just the print cost." },
    { q: "How much should I charge for prints?", a: "Price prints at 2.5 to 4 times your cost of goods. A print costing $5 to produce should sell for $12.50 to $20 minimum." },
    { q: "Should I offer different print sizes?", a: "Yes. Larger prints have higher perceived value and profit margins. Many photographers make most print revenue from 11x14 and larger sizes." }
  ],
  `Cost Per Print = Lab Cost + (Shipping / Prints Per Order)
Profit Per Print = Selling Price - Cost Per Print
Margin = Profit / Selling Price x 100`,
  ["film-budget-estimator", "wedding-videography-cost-calculator"]
);

add(
  "video-render-time-estimator",
  "Video Render Time Estimator",
  "Estimate video rendering and export time based on project settings, hardware, and complexity.",
  "Everyday",
  "everyday",
  "~",
  ["video render time", "export time calculator", "rendering speed", "video encoding time"],
  [
    '{ name: "duration", label: "Project Duration (minutes)", type: "number", min: 1, max: 300, defaultValue: 10 }',
    '{ name: "resolution", label: "Output Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Project Complexity", type: "select", options: [{ value: "1", label: "Simple (cuts only)" }, { value: "2", label: "Moderate (color + transitions)" }, { value: "3", label: "Complex (VFX + compositing)" }, { value: "4", label: "Heavy VFX (3D + particles)" }], defaultValue: "2" }',
    '{ name: "hardware", label: "Hardware Tier", type: "select", options: [{ value: "1", label: "Entry (integrated GPU)" }, { value: "2", label: "Mid-range (dedicated GPU)" }, { value: "3", label: "High-end (RTX 4080+)" }, { value: "4", label: "Workstation (multi-GPU)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const res = parseInt(inputs.resolution as string);
    const complexity = parseInt(inputs.complexity as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 3, 6, 12][res];
    const complexMultiplier = [0, 1, 2.5, 5, 10][complexity];
    const hwSpeed = [0, 0.3, 1, 2.5, 5][hardware];
    const renderMinutes = Math.round(duration * resMultiplier * complexMultiplier / hwSpeed);
    const renderHours = Math.floor(renderMinutes / 60);
    const renderMins = renderMinutes % 60;
    const renderTimeStr = renderHours > 0 ? renderHours + "h " + renderMins + "m" : renderMins + " minutes";
    const ratio = Math.round(renderMinutes / duration * 10) / 10;
    return {
      primary: { label: "Estimated Render Time", value: renderTimeStr },
      details: [
        { label: "Render Time (minutes)", value: formatNumber(renderMinutes) },
        { label: "Render-to-Real Ratio", value: formatNumber(ratio) + ":1" },
        { label: "Project Duration", value: formatNumber(duration) + " min" },
        { label: "Effective Speed", value: ratio <= 1 ? "Faster than real-time" : formatNumber(ratio) + "x slower than real-time" }
      ]
    };
  }`,
  [
    { q: "Why does rendering take so long?", a: "Rendering processes every frame individually, applying effects, color grading, and compression. A 10-minute 4K video at 30fps has 18,000 frames to process." },
    { q: "Does GPU matter for video rendering?", a: "Yes, significantly. A dedicated GPU can speed up rendering by 3-10x compared to CPU-only rendering, especially for effects-heavy projects." },
    { q: "How can I speed up rendering?", a: "Use proxy editing, enable GPU acceleration, render at lower resolution for previews, and close other applications during export." }
  ],
  `Render Time = Duration x Resolution Multiplier x Complexity Multiplier / Hardware Speed
Render Ratio = Render Time / Project Duration`,
  ["video-bitrate-estimator", "video-storage-estimator"]
);

add(
  "drone-flight-time-calculator",
  "Drone Flight Time Calculator",
  "Calculate effective filming time, battery requirements, and coverage area for aerial photography and videography drone missions.",
  "Everyday",
  "everyday",
  "~",
  ["drone flight time", "drone battery calculator", "aerial photography time", "drone filming duration"],
  [
    '{ name: "batteryCapacity", label: "Battery Capacity (mAh)", type: "number", min: 1000, max: 30000, defaultValue: 5000 }',
    '{ name: "maxFlightTime", label: "Rated Max Flight Time (min)", type: "number", min: 5, max: 60, defaultValue: 30 }',
    '{ name: "batteries", label: "Number of Batteries", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "windCondition", label: "Wind Conditions", type: "select", options: [{ value: "1", label: "Calm (< 5 mph)" }, { value: "2", label: "Light (5-15 mph)" }, { value: "3", label: "Moderate (15-25 mph)" }], defaultValue: "1" }',
    '{ name: "payload", label: "Extra Payload", type: "select", options: [{ value: "1", label: "None (stock camera)" }, { value: "2", label: "Light (< 200g)" }, { value: "3", label: "Heavy (200g+)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const capacity = inputs.batteryCapacity as number;
    const maxTime = inputs.maxFlightTime as number;
    const batteries = inputs.batteries as number;
    const wind = parseInt(inputs.windCondition as string);
    const payload = parseInt(inputs.payload as string);
    const windReduction = [0, 1.0, 0.8, 0.6][wind];
    const payloadReduction = [0, 1.0, 0.9, 0.75][payload];
    const safetyMargin = 0.8;
    const effectivePerBattery = Math.round(maxTime * windReduction * payloadReduction * safetyMargin * 10) / 10;
    const totalFlightMin = Math.round(effectivePerBattery * batteries * 10) / 10;
    const filmableMin = Math.round(totalFlightMin * 0.7 * 10) / 10;
    const swapTime = (batteries - 1) * 3;
    const totalSessionMin = Math.round(totalFlightMin + swapTime);
    return {
      primary: { label: "Total Flight Time", value: formatNumber(totalFlightMin) + " min" },
      details: [
        { label: "Per Battery (effective)", value: formatNumber(effectivePerBattery) + " min" },
        { label: "Usable Filming Time", value: formatNumber(filmableMin) + " min" },
        { label: "Total Session (with swaps)", value: formatNumber(totalSessionMin) + " min" },
        { label: "Battery Swaps", value: formatNumber(batteries - 1) }
      ]
    };
  }`,
  [
    { q: "How long can a drone fly on one battery?", a: "Consumer drones typically fly 20-40 minutes per battery. Wind, payload, cold temperatures, and aggressive flying reduce this significantly." },
    { q: "How many batteries should I bring for a shoot?", a: "For professional shoots, bring at least 3-4 fully charged batteries. Plan for 60-70% of rated flight time as actual filming time." },
    { q: "Does wind really affect battery life that much?", a: "Yes. Moderate winds (15-25 mph) can reduce flight time by 30-40% as the drone constantly fights to maintain position." }
  ],
  `Effective Time = Max Time x Wind Factor x Payload Factor x 0.8 (safety)
Total Flight = Effective Time Per Battery x Number of Batteries
Filmable Time = Total Flight x 0.7 (transit/setup overhead)`,
  ["time-lapse-interval-calculator", "video-storage-estimator"]
);

add(
  "photo-backup-storage-calculator",
  "Photo Backup Storage Calculator",
  "Calculate total backup storage needs and costs for photographers based on shooting volume, file types, and backup strategy.",
  "Everyday",
  "everyday",
  "~",
  ["photo backup storage", "photographer storage", "photo archive calculator", "backup drive size"],
  [
    '{ name: "shootsPerMonth", label: "Shoots Per Month", type: "number", min: 1, max: 60, defaultValue: 8 }',
    '{ name: "photosPerShoot", label: "Photos Per Shoot", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "avgFileSizeMB", label: "Avg RAW File Size (MB)", type: "number", min: 5, max: 150, defaultValue: 30 }',
    '{ name: "keepRate", label: "Keep Rate (%)", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "backupCopies", label: "Number of Backup Copies", type: "select", options: [{ value: "1", label: "1 copy (no redundancy)" }, { value: "2", label: "2 copies (3-2-1 basic)" }, { value: "3", label: "3 copies (3-2-1 full)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const shoots = inputs.shootsPerMonth as number;
    const photosPerShoot = inputs.photosPerShoot as number;
    const fileSize = inputs.avgFileSizeMB as number;
    const keepRate = inputs.keepRate as number;
    const copies = parseInt(inputs.backupCopies as string);
    const monthlyPhotos = shoots * photosPerShoot;
    const keptPhotos = Math.round(monthlyPhotos * keepRate / 100);
    const monthlyGB = Math.round(keptPhotos * fileSize / 1024 * 10) / 10;
    const yearlyGB = Math.round(monthlyGB * 12 * 10) / 10;
    const yearlyTB = Math.round(yearlyGB / 1024 * 100) / 100;
    const totalWithBackups = Math.round(yearlyGB * copies * 10) / 10;
    const totalTB = Math.round(totalWithBackups / 1024 * 100) / 100;
    const costEstimate = Math.round(totalTB * 25 * 100) / 100;
    return {
      primary: { label: "Annual Storage Needed", value: yearlyTB >= 1 ? formatNumber(yearlyTB) + " TB" : formatNumber(yearlyGB) + " GB" },
      details: [
        { label: "Monthly New Data", value: formatNumber(monthlyGB) + " GB" },
        { label: "Photos Kept Per Month", value: formatNumber(keptPhotos) },
        { label: "Total With Backups", value: totalTB >= 1 ? formatNumber(totalTB) + " TB" : formatNumber(totalWithBackups) + " GB" },
        { label: "Est. HDD Cost/Year", value: "$" + formatNumber(costEstimate) + " (at ~$25/TB)" }
      ]
    };
  }`,
  [
    { q: "What is the 3-2-1 backup rule?", a: "Keep 3 copies of your data on 2 different types of media with 1 copy stored offsite. This protects against hardware failure, theft, and natural disasters." },
    { q: "How much storage does a professional photographer need?", a: "A busy wedding or event photographer may generate 2-5 TB per year. Commercial and studio photographers often need less, around 500 GB to 2 TB." },
    { q: "Should I keep all RAW files?", a: "Many professionals keep all RAW files from delivered shoots permanently. Storage is cheaper than reshooting. Budget for long-term archival storage." }
  ],
  `Monthly Data = Shoots x Photos x Keep Rate x File Size
Annual Storage = Monthly Data x 12
Total = Annual Storage x Number of Backup Copies`,
  ["video-storage-estimator", "photo-print-cost-calculator"]
);

add(
  "wedding-videography-cost-calculator",
  "Wedding Videography Cost Calculator",
  "Estimate wedding videography pricing based on coverage hours, crew size, deliverables, and add-on services.",
  "Finance",
  "finance",
  "$",
  ["wedding videography cost", "wedding video pricing", "videographer rates", "wedding film cost"],
  [
    '{ name: "hours", label: "Coverage Hours", type: "number", min: 1, max: 16, defaultValue: 8 }',
    '{ name: "videographers", label: "Number of Videographers", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "deliverables", label: "Deliverables", type: "select", options: [{ value: "1", label: "Highlight Film Only" }, { value: "2", label: "Highlight + Ceremony" }, { value: "3", label: "Full Coverage Edit" }, { value: "4", label: "Full + Same-Day Edit" }], defaultValue: "2" }',
    '{ name: "region", label: "Market Region", type: "select", options: [{ value: "1", label: "Budget Market" }, { value: "2", label: "Average Market" }, { value: "3", label: "Premium Market" }, { value: "4", label: "Luxury Market" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const hours = inputs.hours as number;
    const videographers = inputs.videographers as number;
    const deliverables = parseInt(inputs.deliverables as string);
    const region = parseInt(inputs.region as string);
    const regionMultiplier = [0, 0.6, 1.0, 1.8, 3.0][region];
    const deliverableBase = [0, 1200, 1800, 2800, 4000][deliverables];
    const hourlyRate = 150 * regionMultiplier;
    const coverageCost = Math.round(hours * hourlyRate * videographers);
    const deliverableCost = Math.round(deliverableBase * regionMultiplier);
    const editingHours = deliverables === 1 ? 15 : deliverables === 2 ? 25 : deliverables === 3 ? 40 : 55;
    const total = coverageCost + deliverableCost;
    return {
      primary: { label: "Estimated Package Price", value: "$" + formatNumber(total) },
      details: [
        { label: "Coverage Cost", value: "$" + formatNumber(coverageCost) },
        { label: "Deliverable Cost", value: "$" + formatNumber(deliverableCost) },
        { label: "Estimated Editing Hours", value: formatNumber(editingHours) + " hours" },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / (hours + editingHours))) + "/hr" }
      ]
    };
  }`,
  [
    { q: "How much does wedding videography cost?", a: "Average wedding videography costs range from $1,500 to $3,500 in average markets. Luxury markets and premium deliverables can run $5,000 to $15,000 or more." },
    { q: "Do I need two videographers?", a: "A second videographer captures additional angles during the ceremony and reception. They are highly recommended for coverage of events with 100+ guests." },
    { q: "How long does editing take?", a: "A highlight film typically takes 15-25 hours to edit. Full ceremony and reception coverage can take 40-60 hours of post-production work." }
  ],
  `Package Price = Coverage Cost + Deliverable Cost
Coverage Cost = Hours x Hourly Rate x Videographers
Hourly Rate = $150 x Region Multiplier`,
  ["film-budget-estimator", "photo-print-cost-calculator"]
);

add(
  "film-crew-size-estimator",
  "Film Crew Size Estimator",
  "Estimate the ideal crew size and key positions needed based on project type, budget level, and production complexity.",
  "Everyday",
  "everyday",
  "~",
  ["film crew size", "production crew calculator", "video crew", "crew positions needed"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Social Media / YouTube" }, { value: "2", label: "Corporate Video" }, { value: "3", label: "Music Video" }, { value: "4", label: "Short Film" }, { value: "5", label: "Feature Film" }], defaultValue: "3" }',
    '{ name: "budgetLevel", label: "Budget Level", type: "select", options: [{ value: "1", label: "Micro (< $5K)" }, { value: "2", label: "Low ($5K-$25K)" }, { value: "3", label: "Mid ($25K-$100K)" }, { value: "4", label: "High ($100K+)" }], defaultValue: "2" }',
    '{ name: "shootDays", label: "Shooting Days", type: "number", min: 1, max: 60, defaultValue: 3 }',
    '{ name: "locations", label: "Number of Locations", type: "number", min: 1, max: 20, defaultValue: 2 }'
  ],
  `(inputs) => {
    const project = parseInt(inputs.projectType as string);
    const budget = parseInt(inputs.budgetLevel as string);
    const shootDays = inputs.shootDays as number;
    const locations = inputs.locations as number;
    const baseCrews = [[0,0,0,0,0,0],[0,1,3,5,8,15],[0,2,5,8,12,20],[0,3,8,12,18,30],[0,5,12,18,25,50]];
    const baseCrew = baseCrews[budget][project];
    const locationAdj = locations > 3 ? Math.ceil((locations - 3) * 0.5) : 0;
    const totalCrew = baseCrew + locationAdj;
    const dayRateAvg = budget === 1 ? 150 : budget === 2 ? 300 : budget === 3 ? 500 : 750;
    const crewBudget = totalCrew * dayRateAvg * shootDays;
    const keyPositions = totalCrew <= 3 ? "Director, DP, Sound" : totalCrew <= 8 ? "Director, DP, AC, Gaffer, Sound, PA" : totalCrew <= 15 ? "Director, AD, DP, AC, Gaffer, Grip, Sound, HMU, PA x2" : "Full department heads + support crew";
    return {
      primary: { label: "Recommended Crew Size", value: formatNumber(totalCrew) + " people" },
      details: [
        { label: "Key Positions", value: keyPositions },
        { label: "Estimated Crew Budget", value: "$" + formatNumber(crewBudget) },
        { label: "Avg Day Rate", value: "$" + formatNumber(dayRateAvg) + "/person" },
        { label: "Total Crew Days", value: formatNumber(totalCrew * shootDays) }
      ]
    };
  }`,
  [
    { q: "What is the minimum crew for a professional video?", a: "A skeleton crew of 2-3 people (director/DP, sound, and PA) can produce quality content. Music videos and short films typically need 5-12 people." },
    { q: "What positions should I hire first?", a: "After the director, prioritize a director of photography, sound recordist, and one production assistant. These cover the most critical production needs." },
    { q: "How much should I budget for crew?", a: "Crew typically represents 40-60% of production budget. Day rates vary widely: $150-300 for PAs, $500-1500 for department heads." }
  ],
  `Base Crew = Project Type x Budget Matrix
Location Adjustment = (Locations - 3) x 0.5 if > 3 locations
Crew Budget = Total Crew x Avg Day Rate x Shoot Days`,
  ["film-budget-estimator", "lighting-setup-cost-calculator"]
);

add(
  "motion-blur-shutter-speed-calculator",
  "Motion Blur Shutter Speed Calculator",
  "Calculate the ideal shutter speed for creative motion blur or sharp action freeze based on subject speed and distance.",
  "Science",
  "science",
  "A",
  ["motion blur", "shutter speed", "action freeze", "camera motion blur", "panning speed"],
  [
    '{ name: "subjectSpeed", label: "Subject Speed", type: "number", min: 1, max: 1000, defaultValue: 30 }',
    '{ name: "speedUnit", label: "Speed Unit", type: "select", options: [{ value: "1", label: "mph" }, { value: "2", label: "km/h" }, { value: "3", label: "ft/s" }], defaultValue: "1" }',
    '{ name: "distance", label: "Subject Distance (ft)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 600, defaultValue: 100 }',
    '{ name: "intent", label: "Creative Intent", type: "select", options: [{ value: "1", label: "Freeze Action (sharp)" }, { value: "2", label: "Slight Motion Blur" }, { value: "3", label: "Creative Motion Blur" }, { value: "4", label: "Panning (background blur)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const speed = inputs.subjectSpeed as number;
    const unit = parseInt(inputs.speedUnit as string);
    const dist = inputs.distance as number;
    const fl = inputs.focalLength as number;
    const intent = parseInt(inputs.intent as string);
    const speedFtPerSec = unit === 1 ? speed * 1.467 : unit === 2 ? speed * 0.911 : speed;
    const angularSpeed = (speedFtPerSec / dist) * (180 / Math.PI);
    const blurPx = angularSpeed * fl / 50;
    const freezeShutter = Math.ceil(blurPx * 50);
    const intentMultiplier = [0, 1.0, 0.3, 0.1, 0.15][intent];
    const targetShutter = Math.max(1, Math.round(freezeShutter * intentMultiplier));
    const shutterStr = "1/" + targetShutter;
    const actualBlurPx = Math.round(blurPx / targetShutter * 50 * 10) / 10;
    return {
      primary: { label: "Recommended Shutter Speed", value: shutterStr + " sec" },
      details: [
        { label: "Subject Angular Speed", value: formatNumber(Math.round(angularSpeed * 100) / 100) + " deg/s" },
        { label: "Estimated Blur", value: formatNumber(actualBlurPx) + " pixels" },
        { label: "Subject Speed", value: formatNumber(Math.round(speedFtPerSec * 10) / 10) + " ft/s" },
        { label: "Freeze Shutter", value: "1/" + formatNumber(freezeShutter) + " sec" }
      ]
    };
  }`,
  [
    { q: "What shutter speed freezes action?", a: "To freeze fast action like sports, use 1/500 or faster. For birds in flight use 1/1000 to 1/2000. Cars and motorcycles may need 1/2000 or faster." },
    { q: "How do I create intentional motion blur?", a: "Use a slower shutter speed relative to the subject motion. For waterfalls, try 1/4 to 2 seconds. For light trails, use 5-30 seconds." },
    { q: "What is panning?", a: "Panning means moving the camera to follow a moving subject while using a slower shutter speed. This keeps the subject relatively sharp while blurring the background to convey speed." }
  ],
  `Angular Speed = (Speed / Distance) x (180 / PI)
Freeze Shutter = Angular Speed x Focal Length / 50 x 50
Target Shutter = Freeze Shutter x Intent Multiplier`,
  ["exposure-triangle-calculator", "hyperfocal-distance-calculator"]
);

add(
  "aspect-ratio-resize-calculator",
  "Aspect Ratio Resize Calculator",
  "Calculate new dimensions when resizing images or video while maintaining or converting between aspect ratios.",
  "Conversion",
  "conversion",
  "R",
  ["aspect ratio resize", "image resize calculator", "video aspect ratio", "resolution converter"],
  [
    '{ name: "sourceWidth", label: "Source Width (px)", type: "number", min: 1, max: 15360, defaultValue: 1920 }',
    '{ name: "sourceHeight", label: "Source Height (px)", type: "number", min: 1, max: 8640, defaultValue: 1080 }',
    '{ name: "targetRatio", label: "Target Aspect Ratio", type: "select", options: [{ value: "1", label: "16:9 (Widescreen)" }, { value: "2", label: "4:3 (Standard)" }, { value: "3", label: "1:1 (Square)" }, { value: "4", label: "9:16 (Vertical/TikTok)" }, { value: "5", label: "21:9 (Ultrawide)" }, { value: "6", label: "Keep Original" }], defaultValue: "1" }',
    '{ name: "targetWidth", label: "Target Width (px, 0=auto)", type: "number", min: 0, max: 15360, defaultValue: 0 }'
  ],
  `(inputs) => {
    const sw = inputs.sourceWidth as number;
    const sh = inputs.sourceHeight as number;
    const ratio = parseInt(inputs.targetRatio as string);
    const tw = inputs.targetWidth as number;
    const sourceRatio = sw / sh;
    const sourceGCD = (a, b) => b === 0 ? a : sourceGCD(b, a % b);
    const ratios = [0, 16/9, 4/3, 1, 9/16, 21/9, sourceRatio];
    const targetAR = ratios[ratio];
    const ratioLabels = ["", "16:9", "4:3", "1:1", "9:16", "21:9", Math.round(sourceRatio * 100) / 100 + ":1"];
    let finalW, finalH;
    if (tw > 0) {
      finalW = tw;
      finalH = Math.round(tw / targetAR);
    } else {
      finalW = sw;
      finalH = Math.round(sw / targetAR);
    }
    const cropW = Math.min(sw, Math.round(sh * targetAR));
    const cropH = Math.min(sh, Math.round(sw / targetAR));
    const megapixels = Math.round(finalW * finalH / 1000000 * 10) / 10;
    return {
      primary: { label: "Output Dimensions", value: formatNumber(finalW) + " x " + formatNumber(finalH) + " px" },
      details: [
        { label: "Target Aspect Ratio", value: ratioLabels[ratio] },
        { label: "Source Aspect Ratio", value: formatNumber(Math.round(sourceRatio * 100) / 100) + ":1" },
        { label: "Crop Region", value: formatNumber(cropW) + " x " + formatNumber(cropH) + " px" },
        { label: "Output Megapixels", value: formatNumber(megapixels) + " MP" }
      ]
    };
  }`,
  [
    { q: "What aspect ratio is best for social media?", a: "Instagram feeds use 1:1 or 4:5, Stories and Reels use 9:16, YouTube uses 16:9, and TikTok uses 9:16. Each platform has its preferred ratio." },
    { q: "What happens when I change aspect ratio?", a: "Changing aspect ratio requires either cropping (cutting parts of the image), letterboxing (adding black bars), or stretching (distorting the image). Cropping is usually preferred." },
    { q: "What is the most common video aspect ratio?", a: "16:9 is the standard for most video content including TV, YouTube, and streaming. Cinema uses wider ratios like 2.39:1 or 21:9." }
  ],
  `Output Height = Width / Aspect Ratio
Crop Width = min(Source Width, Source Height x Aspect Ratio)
Crop Height = min(Source Height, Source Width / Aspect Ratio)`,
  ["golden-ratio-composition-calculator", "print-resolution-calculator"]
);

add(
  "film-grain-iso-calculator",
  "Film Grain ISO Equivalent Calculator",
  "Convert between analog film grain sizes and digital ISO equivalents, and estimate visible noise levels for film simulation.",
  "Conversion",
  "conversion",
  "R",
  ["film grain", "ISO equivalent", "analog film digital", "film stock ISO", "grain size"],
  [
    '{ name: "filmStock", label: "Film Stock Type", type: "select", options: [{ value: "1", label: "Kodak Portra 160" }, { value: "2", label: "Kodak Portra 400" }, { value: "3", label: "Kodak Portra 800" }, { value: "4", label: "Fuji Superia 400" }, { value: "5", label: "Ilford HP5 Plus 400" }, { value: "6", label: "Kodak Tri-X 400" }, { value: "7", label: "Ilford Delta 3200" }], defaultValue: "2" }',
    '{ name: "pushStops", label: "Push/Pull (stops)", type: "number", min: -2, max: 3, defaultValue: 0 }',
    '{ name: "scanResolution", label: "Scan Resolution (DPI)", type: "number", min: 300, max: 10000, defaultValue: 4000 }',
    '{ name: "format", label: "Film Format", type: "select", options: [{ value: "1", label: "35mm" }, { value: "2", label: "Medium Format (120)" }, { value: "3", label: "Large Format (4x5)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const stock = parseInt(inputs.filmStock as string);
    const push = inputs.pushStops as number;
    const scanDPI = inputs.scanResolution as number;
    const format = parseInt(inputs.format as string);
    const baseISOs = [0, 160, 400, 800, 400, 400, 400, 3200];
    const grainSizes = [0, 6, 8, 11, 9, 10, 10, 16];
    const baseISO = baseISOs[stock];
    const effectiveISO = Math.round(baseISO * Math.pow(2, push));
    const grainSize = grainSizes[stock] + push * 2;
    const formatGrainReduction = [0, 1.0, 0.5, 0.25][format];
    const visibleGrain = Math.round(grainSize * formatGrainReduction * 10) / 10;
    const digitalEquivISO = Math.round(effectiveISO * formatGrainReduction);
    const grainChar = visibleGrain < 6 ? "Very Fine" : visibleGrain < 9 ? "Fine" : visibleGrain < 12 ? "Moderate" : "Coarse";
    const megapixels35 = Math.round(scanDPI * 1.42 * scanDPI * 0.94 / 1000000 * 10) / 10;
    return {
      primary: { label: "Effective ISO", value: formatNumber(effectiveISO) },
      details: [
        { label: "Digital Noise Equivalent", value: "~ISO " + formatNumber(digitalEquivISO) },
        { label: "Grain Character", value: grainChar + " (" + formatNumber(visibleGrain) + "/20)" },
        { label: "Scan Resolution", value: formatNumber(megapixels35) + " MP equivalent" },
        { label: "Push/Pull", value: push >= 0 ? "+" + formatNumber(push) + " stops" : formatNumber(push) + " stops" }
      ]
    };
  }`,
  [
    { q: "Does pushing film increase grain?", a: "Yes. Pushing film (underexposing and overdeveloping) increases grain noticeably. Each stop of push increases visible grain. Pulling film reduces grain slightly." },
    { q: "How does film format affect grain?", a: "Larger film formats show less visible grain when printed at the same size because less enlargement is needed. Medium format shows about half the grain of 35mm." },
    { q: "What film stock has the finest grain?", a: "Among common stocks, Kodak Portra 160 and Fuji Velvia 50 have extremely fine grain. For black and white, Ilford Delta 100 and Kodak T-Max 100 are very fine-grained." }
  ],
  `Effective ISO = Base ISO x 2^(push stops)
Visible Grain = Base Grain + (Push x 2) x Format Reduction
Digital Equiv = Effective ISO x Format Grain Reduction`,
  ["exposure-triangle-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "lighting-setup-cost-calculator",
  "Lighting Setup Cost Calculator",
  "Estimate the cost of photography and video lighting equipment packages for different production levels.",
  "Finance",
  "finance",
  "$",
  ["lighting equipment cost", "studio lighting budget", "video light setup", "photography lighting kit"],
  [
    '{ name: "setupType", label: "Setup Type", type: "select", options: [{ value: "1", label: "Beginner YouTube" }, { value: "2", label: "Portrait Studio" }, { value: "3", label: "Product Photography" }, { value: "4", label: "Video Production" }, { value: "5", label: "Film Set" }], defaultValue: "2" }',
    '{ name: "quality", label: "Equipment Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Professional" }], defaultValue: "2" }',
    '{ name: "lightsCount", label: "Number of Lights", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "includeModifiers", label: "Include Modifiers", type: "select", options: [{ value: "1", label: "Basic (reflectors)" }, { value: "2", label: "Standard (softboxes + reflectors)" }, { value: "3", label: "Full (soft boxes, scrims, flags, gels)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const setup = parseInt(inputs.setupType as string);
    const quality = parseInt(inputs.quality as string);
    const lights = inputs.lightsCount as number;
    const modifiers = parseInt(inputs.includeModifiers as string);
    const perLightCost = [0, [0, 50, 200, 600], [0, 100, 350, 900], [0, 80, 300, 800], [0, 150, 500, 1200], [0, 300, 800, 2000]][setup][quality];
    const modCost = [0, 30, 100, 300][modifiers] * lights;
    const standsCost = lights * [0, 25, 60, 150][quality];
    const accessoryCost = [0, 50, 150, 400][quality];
    const lightsCost = perLightCost * lights;
    const total = lightsCost + modCost + standsCost + accessoryCost;
    return {
      primary: { label: "Total Lighting Setup Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Lights Cost", value: "$" + formatNumber(lightsCost) + " (" + formatNumber(lights) + " lights)" },
        { label: "Modifiers", value: "$" + formatNumber(modCost) },
        { label: "Stands & Mounts", value: "$" + formatNumber(standsCost) },
        { label: "Accessories", value: "$" + formatNumber(accessoryCost) }
      ]
    };
  }`,
  [
    { q: "How many lights do I need for portraits?", a: "A classic portrait setup uses 2-3 lights: a key light, fill light, and optional hair/rim light. One-light setups with a reflector can also produce excellent results." },
    { q: "Are LED lights better than strobes?", a: "LEDs offer continuous light (great for video and beginners) and lower heat. Strobes provide more power per dollar and freeze motion. Many studios use both." },
    { q: "What light modifiers should I start with?", a: "Start with a large softbox or umbrella for your key light and a reflector for fill. Add a strip box for rim light as your second modifier." }
  ],
  `Total = (Light Cost x Count) + (Modifier Cost x Count) + Stands + Accessories
Costs vary by equipment tier and setup type`,
  ["film-budget-estimator", "green-screen-distance-calculator"]
);

add(
  "video-360-stitching-time-calculator",
  "360 Video Stitching Time Calculator",
  "Estimate processing time for stitching 360-degree video from multi-camera rigs based on resolution and hardware.",
  "Everyday",
  "everyday",
  "~",
  ["360 video stitching", "VR video processing", "360 camera stitching time", "panoramic video"],
  [
    '{ name: "duration", label: "Video Duration (minutes)", type: "number", min: 1, max: 120, defaultValue: 10 }',
    '{ name: "cameras", label: "Number of Cameras/Lenses", type: "number", min: 2, max: 24, defaultValue: 6 }',
    '{ name: "outputRes", label: "Output Resolution", type: "select", options: [{ value: "1", label: "4K (3840x1920)" }, { value: "2", label: "5.7K (5760x2880)" }, { value: "3", label: "8K (7680x3840)" }, { value: "4", label: "12K (11520x5760)" }], defaultValue: "2" }',
    '{ name: "hardware", label: "Processing Hardware", type: "select", options: [{ value: "1", label: "Laptop (integrated)" }, { value: "2", label: "Desktop (dedicated GPU)" }, { value: "3", label: "Workstation (high-end GPU)" }, { value: "4", label: "Cloud Rendering" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const cameras = inputs.cameras as number;
    const outputRes = parseInt(inputs.outputRes as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 2, 5, 12][outputRes];
    const cameraMultiplier = cameras / 6;
    const hwSpeed = [0, 0.2, 1, 3, 6][hardware];
    const stitchMinutes = Math.round(duration * resMultiplier * cameraMultiplier * 8 / hwSpeed);
    const stitchHours = Math.floor(stitchMinutes / 60);
    const stitchMins = stitchMinutes % 60;
    const timeStr = stitchHours > 0 ? stitchHours + "h " + stitchMins + "m" : stitchMins + " minutes";
    const ratio = Math.round(stitchMinutes / duration * 10) / 10;
    const storageGB = Math.round(duration * resMultiplier * cameras * 0.5 * 10) / 10;
    return {
      primary: { label: "Estimated Stitching Time", value: timeStr },
      details: [
        { label: "Processing Ratio", value: formatNumber(ratio) + ":1 (process:real)" },
        { label: "Source Footage", value: formatNumber(cameras) + " streams x " + formatNumber(duration) + " min" },
        { label: "Estimated Source Storage", value: formatNumber(storageGB) + " GB" },
        { label: "Stitching Minutes", value: formatNumber(stitchMinutes) }
      ]
    };
  }`,
  [
    { q: "How long does 360 video stitching take?", a: "Stitching time depends heavily on resolution and hardware. A 10-minute 5.7K clip can take 20-60 minutes on a desktop with a dedicated GPU." },
    { q: "Can I stitch 360 video in real time?", a: "Real-time stitching is possible for 4K output with hardware encoders and optimized rigs, but quality is lower than offline stitching." },
    { q: "What software is used for 360 stitching?", a: "Popular options include Insta360 Studio, Mistika VR, AutoPano Video Pro, and PTGui Pro. Some cameras like Insta360 and GoPro MAX include proprietary software." }
  ],
  `Stitch Time = Duration x Resolution Multiplier x (Cameras / 6) x 8 / Hardware Speed
Source Storage = Duration x Resolution x Cameras x 0.5 GB`,
  ["video-render-time-estimator", "video-storage-estimator"]
);

add(
  "lens-compression-distance-calculator",
  "Lens Compression Distance Calculator",
  "Calculate the apparent background compression effect at different focal lengths and subject distances for portrait photography.",
  "Science",
  "science",
  "A",
  ["lens compression", "focal length compression", "portrait lens distance", "background compression"],
  [
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 14, max: 600, defaultValue: 85 }',
    '{ name: "subjectDist", label: "Subject Distance (ft)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "bgDist", label: "Background Distance (ft)", type: "number", min: 2, max: 2000, defaultValue: 50 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame" }, { value: "2", label: "APS-C (1.5x)" }, { value: "3", label: "Micro Four Thirds (2.0x)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const subDist = inputs.subjectDist as number;
    const bgDist = inputs.bgDist as number;
    const sensor = parseInt(inputs.sensorType as string);
    const cropFactor = [0, 1.0, 1.5, 2.0][sensor];
    const eqFL = fl * cropFactor;
    const compressionRatio = Math.round(bgDist / subDist * 100) / 100;
    const bgMagnification = Math.round(fl / 50 * 100) / 100;
    const fov = 2 * Math.atan(36 / (2 * eqFL)) * (180 / Math.PI);
    const bgApparentSize = Math.round(bgMagnification * 100);
    const perspective = eqFL < 35 ? "Wide — exaggerated perspective, distant background" : eqFL < 70 ? "Normal — natural perspective" : eqFL < 135 ? "Telephoto — compressed, flattering portraits" : "Super telephoto — extreme compression";
    return {
      primary: { label: "Background Magnification", value: formatNumber(bgMagnification) + "x vs 50mm" },
      details: [
        { label: "Compression Ratio", value: formatNumber(compressionRatio) + ":1" },
        { label: "Equivalent Focal Length", value: formatNumber(Math.round(eqFL)) + " mm" },
        { label: "Field of View", value: formatNumber(Math.round(fov * 10) / 10) + "°" },
        { label: "Perspective Character", value: perspective }
      ]
    };
  }`,
  [
    { q: "What is lens compression?", a: "Lens compression is the apparent flattening of depth when using longer focal lengths from farther away. The background appears larger and closer relative to the subject." },
    { q: "What focal length is best for portraits?", a: "85mm to 135mm (full frame equivalent) is ideal for portraits. These focal lengths provide flattering perspective and pleasant background compression." },
    { q: "Does crop factor affect compression?", a: "Crop factor changes the effective field of view but not the actual perspective. A 50mm on APS-C frames like a 75mm on full frame, but the perspective compression is determined by the subject distance, not the focal length itself." }
  ],
  `Background Magnification = Focal Length / 50
Compression Ratio = Background Distance / Subject Distance
Field of View = 2 x atan(36 / (2 x Equivalent FL))`,
  ["camera-sensor-crop-factor-calculator", "depth-of-field-calculator"]
);

add(
  "pixel-density-ppi-calculator",
  "Pixel Density PPI Calculator",
  "Calculate pixels per inch (PPI) for displays and prints to determine sharpness and optimal viewing distance for photography.",
  "Conversion",
  "conversion",
  "R",
  ["pixel density", "PPI calculator", "pixels per inch", "screen resolution density", "retina display"],
  [
    '{ name: "widthPx", label: "Width (pixels)", type: "number", min: 1, max: 15360, defaultValue: 3840 }',
    '{ name: "heightPx", label: "Height (pixels)", type: "number", min: 1, max: 8640, defaultValue: 2160 }',
    '{ name: "diagonal", label: "Diagonal Size (inches)", type: "number", min: 1, max: 120, defaultValue: 27 }'
  ],
  `(inputs) => {
    const w = inputs.widthPx as number;
    const h = inputs.heightPx as number;
    const diag = inputs.diagonal as number;
    const diagPx = Math.sqrt(w * w + h * h);
    const ppi = Math.round(diagPx / diag * 10) / 10;
    const optimalViewDist = Math.round(3438 / ppi * 10) / 10;
    const isRetina = ppi > 200 ? "Yes (> 200 PPI)" : ppi > 150 ? "Borderline" : "No (< 150 PPI)";
    const totalPixels = w * h;
    const megapixels = Math.round(totalPixels / 1000000 * 10) / 10;
    const dotPitch = Math.round(25.4 / ppi * 1000) / 1000;
    return {
      primary: { label: "Pixel Density", value: formatNumber(ppi) + " PPI" },
      details: [
        { label: "Retina Quality", value: isRetina },
        { label: "Optimal Viewing Distance", value: formatNumber(optimalViewDist) + " inches" },
        { label: "Dot Pitch", value: formatNumber(dotPitch) + " mm" },
        { label: "Total Pixels", value: formatNumber(megapixels) + " MP (" + formatNumber(totalPixels) + ")" }
      ]
    };
  }`,
  [
    { q: "What PPI is considered 'retina' quality?", a: "Apple defines retina as when pixels are indistinguishable at normal viewing distance — roughly 220+ PPI for phones held at 10 inches, and 110+ PPI for monitors at 20 inches." },
    { q: "What PPI should I use for photo prints?", a: "300 PPI is the standard for high-quality photo prints. 150 PPI is acceptable for large prints viewed from a distance. Billboards can use 10-30 PPI." },
    { q: "Does higher PPI always mean better?", a: "Above a certain PPI, the human eye cannot distinguish individual pixels. For desktop monitors at typical viewing distance, 110-140 PPI is standard and 200+ is excellent." }
  ],
  `PPI = sqrt(Width^2 + Height^2) / Diagonal Size
Optimal Viewing Distance = 3438 / PPI (in inches)
Dot Pitch = 25.4 / PPI (in mm)`,
  ["print-resolution-calculator", "aspect-ratio-resize-calculator", "nd-filter-exposure-calculator"]
);

add(
  "nd-filter-exposure-calculator",
  "ND Filter Exposure Calculator",
  "Calculate adjusted exposure settings when using neutral density filters for long exposure photography.",
  "Science",
  "science",
  "A",
  ["ND filter", "neutral density filter", "long exposure calculator", "ND stops", "ND filter exposure"],
  [
    '{ name: "baseShutter", label: "Base Shutter Speed (1/x sec)", type: "number", min: 1, max: 8000, defaultValue: 125 }',
    '{ name: "ndStops", label: "ND Filter Strength (stops)", type: "select", options: [{ value: "1", label: "1 stop (ND2)" }, { value: "2", label: "2 stops (ND4)" }, { value: "3", label: "3 stops (ND8)" }, { value: "6", label: "6 stops (ND64)" }, { value: "10", label: "10 stops (ND1000)" }, { value: "15", label: "15 stops (ND32768)" }], defaultValue: "6" }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 11 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 12800, defaultValue: 100 }'
  ],
  `(inputs) => {
    const baseShutter = inputs.baseShutter as number;
    const ndStops = parseInt(inputs.ndStops as string);
    const aperture = inputs.aperture as number;
    const iso = inputs.iso as number;
    const baseSeconds = 1 / baseShutter;
    const newSeconds = baseSeconds * Math.pow(2, ndStops);
    const ndFactor = Math.pow(2, ndStops);
    let shutterStr;
    if (newSeconds < 1) {
      shutterStr = "1/" + Math.round(1 / newSeconds) + " sec";
    } else if (newSeconds < 60) {
      shutterStr = Math.round(newSeconds * 10) / 10 + " seconds";
    } else {
      const mins = Math.floor(newSeconds / 60);
      const secs = Math.round(newSeconds % 60);
      shutterStr = mins + "m " + secs + "s";
    }
    return {
      primary: { label: "New Shutter Speed", value: shutterStr },
      details: [
        { label: "Base Shutter", value: "1/" + formatNumber(baseShutter) + " sec" },
        { label: "ND Factor", value: formatNumber(ndFactor) + "x (ND" + formatNumber(ndFactor) + ")" },
        { label: "Stops of Reduction", value: formatNumber(ndStops) + " stops" },
        { label: "New Exposure Time", value: formatNumber(Math.round(newSeconds * 100) / 100) + " sec" }
      ]
    };
  }`,
  [
    { q: "What ND filter should I buy first?", a: "A 6-stop (ND64) is the most versatile choice. It allows long exposures in daylight for smooth water and cloud effects while still being usable in lower light." },
    { q: "Can I stack ND filters?", a: "Yes, stacking filters adds their stop values together. A 3-stop and 6-stop stacked equals 9 stops. However, stacking can introduce vignetting and reduce image quality." },
    { q: "What is a 10-stop ND filter used for?", a: "A 10-stop ND filter is used for extreme long exposures in bright daylight — turning a 1/125 second exposure into about 8 seconds, creating smooth water and streaked clouds." }
  ],
  `New Shutter Speed = Base Shutter Speed x 2^(ND stops)
ND Factor = 2^(stops)
Example: ND64 = 6 stops = 64x light reduction`,
  ["exposure-triangle-calculator", "motion-blur-shutter-speed-calculator"]
);
add(
  "flight-fuel-cost-estimator-calculator",
  "Flight Fuel Cost Estimator Calculator",
  "Estimate fuel costs for a flight based on distance, aircraft type, and fuel price per gallon.",
  "Finance",
  "finance",
  "$",
  ["flight fuel cost", "aviation fuel", "jet fuel calculator", "airplane fuel expense"],
  [
    '{ name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 1500 }',
    '{ name: "aircraftType", label: "Aircraft Type", type: "select", options: [{ value: "1", label: "Small Prop (10 gal/hr)" }, { value: "2", label: "Turboprop (60 gal/hr)" }, { value: "3", label: "Light Jet (150 gal/hr)" }, { value: "4", label: "Mid-Size Jet (250 gal/hr)" }, { value: "5", label: "Heavy Jet (450 gal/hr)" }], defaultValue: "3" }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 2, max: 15, defaultValue: 6.5 }',
    '{ name: "cruiseSpeed", label: "Cruise Speed (mph)", type: "number", min: 100, max: 600, defaultValue: 450 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const aircraftType = inputs.aircraftType as string;
    const fuelPrice = inputs.fuelPrice as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const burnRates: Record<string, number> = { "1": 10, "2": 60, "3": 150, "4": 250, "5": 450 };
    const burnRate = burnRates[aircraftType] || 150;
    const flightHours = distance / cruiseSpeed;
    const totalGallons = burnRate * flightHours;
    const totalCost = totalGallons * fuelPrice;
    const costPerMile = totalCost / distance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Flight Time", value: formatNumber(Math.round(flightHours * 10) / 10) + " hours" },
        { label: "Fuel Burned", value: formatNumber(Math.round(totalGallons)) + " gallons" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does jet fuel cost?", a: "Jet-A fuel typically costs $5 to $8 per gallon at most FBOs, though prices vary by location and volume." },
    { q: "How much fuel does a private jet burn per hour?", a: "Light jets burn about 100 to 200 gallons per hour, mid-size jets 200 to 300, and heavy jets 350 to 500+ gallons per hour." },
    { q: "What affects flight fuel costs the most?", a: "Distance, aircraft size, headwinds, altitude, payload weight, and fuel prices at the departure airport all significantly impact fuel costs." }
  ],
  `Total Fuel Cost = (Distance / Cruise Speed) x Burn Rate x Fuel Price
Cost Per Mile = Total Fuel Cost / Distance`,
  ["flight-cost-per-mile-calculator", "road-trip-cost-calculator", "travel-budget-calculator"]
);

add(
  "jet-lag-recovery-time-calculator",
  "Jet Lag Recovery Time Calculator",
  "Estimate how many days it takes to recover from jet lag based on time zones crossed, travel direction, and personal factors.",
  "Health",
  "health",
  "H",
  ["jet lag recovery", "time zone adjustment", "circadian rhythm recovery", "travel fatigue"],
  [
    '{ name: "timeZonesCrossed", label: "Time Zones Crossed", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "direction", label: "Travel Direction", type: "select", options: [{ value: "1", label: "Eastbound" }, { value: "2", label: "Westbound" }], defaultValue: "1" }',
    '{ name: "age", label: "Your Age", type: "number", min: 10, max: 100, defaultValue: 35 }',
    '{ name: "sleepQuality", label: "Usual Sleep Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const zones = inputs.timeZonesCrossed as number;
    const direction = inputs.direction as string;
    const age = inputs.age as number;
    const sleepQuality = parseInt(inputs.sleepQuality as string);
    const baseDaysPerZone = direction === "1" ? 1.5 : 1.0;
    const baseDays = zones * baseDaysPerZone;
    const ageFactor = age > 50 ? 1.3 : age > 35 ? 1.1 : 1.0;
    const sleepFactor = [1.3, 1.0, 0.8][sleepQuality - 1] || 1.0;
    const recoveryDays = Math.round(baseDays * ageFactor * sleepFactor * 10) / 10;
    const peakSymptomDay = Math.min(Math.round(recoveryDays * 0.3), zones);
    const melatoninStartDay = direction === "1" ? 1 : 0;
    return {
      primary: { label: "Estimated Recovery Time", value: formatNumber(recoveryDays) + " days" },
      details: [
        { label: "Direction", value: direction === "1" ? "Eastbound (harder)" : "Westbound (easier)" },
        { label: "Peak Symptom Day", value: "Day " + formatNumber(peakSymptomDay) },
        { label: "Start Melatonin", value: "Day " + formatNumber(melatoninStartDay) + " at destination" },
        { label: "Age Adjustment", value: ageFactor > 1 ? "+" + formatNumber(Math.round((ageFactor - 1) * 100)) + "%" : "None" }
      ]
    };
  }`,
  [
    { q: "Why is eastbound jet lag worse?", a: "Traveling east shortens your day, requiring you to fall asleep earlier. The body naturally runs on a cycle slightly longer than 24 hours, making it easier to stay up later (westbound) than to sleep earlier." },
    { q: "How long does jet lag last per time zone?", a: "A common rule of thumb is 1 day per time zone crossed going east, and about two-thirds of a day per zone going west." },
    { q: "What helps jet lag recovery?", a: "Sunlight exposure at the right times, melatonin supplements, staying hydrated, avoiding alcohol, and gradually shifting sleep times before departure all help." }
  ],
  `Recovery Days (East) = Zones x 1.5 x Age Factor x Sleep Factor
Recovery Days (West) = Zones x 1.0 x Age Factor x Sleep Factor`,
  ["jet-lag-calculator", "travel-budget-calculator", "time-zone-meeting-calculator"]
);

add(
  "travel-daily-budget-calculator",
  "Travel Daily Budget Calculator",
  "Plan your daily travel budget by destination cost level, travel style, and trip length to estimate total trip expenses.",
  "Finance",
  "finance",
  "$",
  ["travel daily budget", "trip cost planner", "per diem travel", "vacation daily spend"],
  [
    '{ name: "costLevel", label: "Destination Cost Level", type: "select", options: [{ value: "1", label: "Budget (SE Asia, Central America)" }, { value: "2", label: "Moderate (Eastern Europe, Mexico)" }, { value: "3", label: "Average (US, Spain, Italy)" }, { value: "4", label: "Expensive (UK, Japan, Australia)" }, { value: "5", label: "Very Expensive (Switzerland, Norway)" }], defaultValue: "3" }',
    '{ name: "travelStyle", label: "Travel Style", type: "select", options: [{ value: "1", label: "Backpacker" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Luxury" }], defaultValue: "2" }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 365, defaultValue: 10 }',
    '{ name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 2 }'
  ],
  `(inputs) => {
    const costLevel = parseInt(inputs.costLevel as string);
    const travelStyle = parseInt(inputs.travelStyle as string);
    const tripDays = inputs.tripDays as number;
    const travelers = inputs.travelers as number;
    const baseCosts = [25, 50, 100, 150, 200];
    const styleMult = [0.6, 1.0, 2.5];
    const dailyCostPP = baseCosts[costLevel - 1] * styleMult[travelStyle - 1];
    const dailyTotal = dailyCostPP * travelers;
    const tripTotal = dailyTotal * tripDays;
    const accommodation = Math.round(dailyCostPP * 0.4 * 100) / 100;
    const food = Math.round(dailyCostPP * 0.3 * 100) / 100;
    const transport = Math.round(dailyCostPP * 0.15 * 100) / 100;
    const activities = Math.round(dailyCostPP * 0.15 * 100) / 100;
    return {
      primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(tripTotal)) },
      details: [
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyCostPP)) },
        { label: "Accommodation/day/person", value: "$" + formatNumber(accommodation) },
        { label: "Food/day/person", value: "$" + formatNumber(food) },
        { label: "Transport/day/person", value: "$" + formatNumber(transport) },
        { label: "Activities/day/person", value: "$" + formatNumber(activities) }
      ]
    };
  }`,
  [
    { q: "How much should I budget per day for travel?", a: "Budget travelers can spend $30 to $50 per day in cheap destinations. Mid-range travelers typically spend $100 to $200 per day in average-cost countries." },
    { q: "What percentage of a travel budget goes to accommodation?", a: "Accommodation typically accounts for 30 to 50 percent of a daily travel budget, followed by food at 25 to 35 percent." },
    { q: "How can I reduce daily travel costs?", a: "Stay in hostels or guesthouses, eat local street food, use public transportation, travel in the off-season, and book attractions in advance for discounts." }
  ],
  `Daily Cost Per Person = Base Cost x Style Multiplier
Total Trip Cost = Daily Cost x Travelers x Trip Days`,
  ["travel-budget-calculator", "currency-exchange-calculator", "hotel-vs-airbnb-calculator"]
);

add(
  "cruise-cabin-cost-comparison-calculator",
  "Cruise Cabin Cost Comparison Calculator",
  "Compare the total cost of different cruise cabin types including per-night rates, gratuities, and onboard expenses.",
  "Finance",
  "finance",
  "$",
  ["cruise cabin cost", "cruise comparison", "cruise budget", "cruise fare calculator"],
  [
    '{ name: "cabinType", label: "Cabin Type", type: "select", options: [{ value: "1", label: "Interior" }, { value: "2", label: "Ocean View" }, { value: "3", label: "Balcony" }, { value: "4", label: "Suite" }], defaultValue: "2" }',
    '{ name: "nightlyRate", label: "Nightly Rate Per Person ($)", type: "number", min: 30, max: 2000, defaultValue: 150 }',
    '{ name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 }',
    '{ name: "passengers", label: "Number of Passengers", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "dailyOnboard", label: "Est. Daily Onboard Spending ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const cabinType = inputs.cabinType as string;
    const nightlyRate = inputs.nightlyRate as number;
    const cruiseNights = inputs.cruiseNights as number;
    const passengers = inputs.passengers as number;
    const dailyOnboard = inputs.dailyOnboard as number;
    const cabinNames: Record<string, string> = { "1": "Interior", "2": "Ocean View", "3": "Balcony", "4": "Suite" };
    const gratPerDay = 16;
    const fareCost = nightlyRate * cruiseNights * passengers;
    const totalGrat = gratPerDay * cruiseNights * passengers;
    const totalOnboard = dailyOnboard * cruiseNights * passengers;
    const portFees = 125 * passengers;
    const grandTotal = fareCost + totalGrat + totalOnboard + portFees;
    const perNightTotal = grandTotal / cruiseNights;
    return {
      primary: { label: "Total Cruise Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cabin Type", value: cabinNames[cabinType] || "Standard" },
        { label: "Fare Total", value: "$" + formatNumber(Math.round(fareCost)) },
        { label: "Gratuities", value: "$" + formatNumber(Math.round(totalGrat)) },
        { label: "Onboard Spending", value: "$" + formatNumber(Math.round(totalOnboard)) },
        { label: "Port Fees & Taxes", value: "$" + formatNumber(portFees) },
        { label: "Cost Per Night (all-in)", value: "$" + formatNumber(Math.round(perNightTotal)) }
      ]
    };
  }`,
  [
    { q: "How much does a cruise really cost per person?", a: "Beyond the advertised fare, expect to add $100 to $200 per person per day for gratuities, drinks, excursions, and onboard spending." },
    { q: "Are cruise gratuities mandatory?", a: "Most cruise lines automatically charge $14 to $20 per person per day in gratuities. You can sometimes adjust this amount at guest services." },
    { q: "Which cruise cabin type offers the best value?", a: "Interior cabins offer the lowest price point. Balcony cabins are often considered the best value since the added cost per night is modest for a significantly better experience." }
  ],
  `Grand Total = (Nightly Rate x Nights x Passengers) + Gratuities + Onboard Spending + Port Fees`,
  ["travel-budget-calculator", "hotel-vs-airbnb-calculator", "travel-insurance-value-calculator"]
);

add(
  "passport-renewal-timeline-calculator",
  "Passport Renewal Timeline Calculator",
  "Estimate passport processing time and costs based on processing speed, application type, and expediting options.",
  "Everyday",
  "everyday",
  "~",
  ["passport renewal", "passport processing time", "passport timeline", "passport expedite"],
  [
    '{ name: "processingType", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Routine (8-11 weeks)" }, { value: "2", label: "Expedited (5-7 weeks)" }, { value: "3", label: "Urgent/Agency (same day-2 weeks)" }], defaultValue: "1" }',
    '{ name: "applicationType", label: "Application Type", type: "select", options: [{ value: "1", label: "Adult Renewal (mail)" }, { value: "2", label: "First-Time Adult" }, { value: "3", label: "Child Under 16" }, { value: "4", label: "Lost/Stolen Replacement" }], defaultValue: "1" }',
    '{ name: "needPassportCard", label: "Add Passport Card?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$30)" }], defaultValue: "0" }',
    '{ name: "travelDate", label: "Days Until Travel", type: "number", min: 0, max: 365, defaultValue: 60 }'
  ],
  `(inputs) => {
    const processingType = parseInt(inputs.processingType as string);
    const applicationType = parseInt(inputs.applicationType as string);
    const needCard = inputs.needPassportCard as string;
    const travelDate = inputs.travelDate as number;
    const processingWeeks = [[8, 11], [5, 7], [0, 2]];
    const range = processingWeeks[processingType - 1] || [8, 11];
    const minDays = range[0] * 7;
    const maxDays = range[1] * 7;
    const baseFee = applicationType === 3 ? 100 : 130;
    const executionFee = applicationType === 1 ? 0 : 35;
    const expediteFee = processingType >= 2 ? 60 : 0;
    const cardFee = needCard === "1" ? 30 : 0;
    const totalCost = baseFee + executionFee + expediteFee + cardFee;
    const willArrive = travelDate >= minDays;
    return {
      primary: { label: "Total Passport Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Processing Time", value: formatNumber(range[0]) + " - " + formatNumber(range[1]) + " weeks" },
        { label: "Application Fee", value: "$" + formatNumber(baseFee) },
        { label: "Execution Fee", value: "$" + formatNumber(executionFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Ready Before Travel?", value: willArrive ? "Likely Yes" : "Cutting It Close - Consider Faster Option" }
      ]
    };
  }`,
  [
    { q: "How long does a passport renewal take?", a: "Routine processing takes 8 to 11 weeks. Expedited processing takes 5 to 7 weeks. Urgent processing at a passport agency can be done in 1 to 2 business days." },
    { q: "How much does a passport cost?", a: "An adult passport book costs $130 for renewal by mail, plus $35 execution fee for first-time applicants. Expediting adds $60." },
    { q: "Can I renew my passport if it expired over 5 years ago?", a: "If your passport expired more than 5 years ago, you must apply in person as a first-time applicant with new photos and documentation." }
  ],
  `Total Cost = Application Fee + Execution Fee + Expedite Fee + Card Fee
Processing Range varies by speed selected`,
  ["travel-budget-calculator", "travel-insurance-value-calculator", "currency-exchange-calculator"]
);

add(
  "airline-miles-value-calculator",
  "Airline Miles Value Calculator",
  "Calculate the monetary value of your airline miles and whether redeeming for a flight is worth it versus paying cash.",
  "Finance",
  "finance",
  "$",
  ["airline miles value", "frequent flyer points", "miles redemption", "miles worth calculator"],
  [
    '{ name: "milesRequired", label: "Miles Required for Redemption", type: "number", min: 1000, max: 500000, defaultValue: 25000 }',
    '{ name: "cashPrice", label: "Cash Price of Same Flight ($)", type: "number", min: 50, max: 20000, defaultValue: 350 }',
    '{ name: "taxesOnAward", label: "Taxes/Fees on Award Ticket ($)", type: "number", min: 0, max: 1000, defaultValue: 25 }',
    '{ name: "totalMilesBalance", label: "Your Total Miles Balance", type: "number", min: 0, max: 5000000, defaultValue: 50000 }'
  ],
  `(inputs) => {
    const milesRequired = inputs.milesRequired as number;
    const cashPrice = inputs.cashPrice as number;
    const taxesOnAward = inputs.taxesOnAward as number;
    const totalMilesBalance = inputs.totalMilesBalance as number;
    const netCashSavings = cashPrice - taxesOnAward;
    const centsPerMile = (netCashSavings / milesRequired) * 100;
    const remainingMiles = totalMilesBalance - milesRequired;
    const worthIt = centsPerMile >= 1.2;
    return {
      primary: { label: "Value Per Mile", value: formatNumber(Math.round(centsPerMile * 100) / 100) + " cents" },
      details: [
        { label: "Cash Savings", value: "$" + formatNumber(Math.round(netCashSavings)) },
        { label: "Redemption Worth It?", value: worthIt ? "Yes (above 1.2 cpp)" : "Below average value" },
        { label: "Remaining Miles", value: formatNumber(remainingMiles) },
        { label: "Miles Balance After", value: remainingMiles >= 0 ? formatNumber(remainingMiles) : "Not enough miles" }
      ]
    };
  }`,
  [
    { q: "How much is an airline mile worth?", a: "On average, airline miles are worth 1 to 2 cents each, though premium cabin international redemptions can yield 3 to 10 cents per mile." },
    { q: "When should I use miles instead of cash?", a: "Use miles when the redemption value exceeds 1.2 cents per mile, especially for premium cabin tickets or expensive routes where cash prices are high." },
    { q: "Do airline miles expire?", a: "Many programs no longer expire miles, but some still do after 18 to 24 months of account inactivity. Check your specific program rules." }
  ],
  `Value Per Mile (cents) = ((Cash Price - Award Taxes) / Miles Required) x 100`,
  ["points-value-calculator", "flight-cost-per-mile-calculator", "travel-budget-calculator"]
);

add(
  "hotel-points-value-calculator",
  "Hotel Points Value Calculator",
  "Determine the value of your hotel loyalty points by comparing point redemptions against cash rates.",
  "Finance",
  "finance",
  "$",
  ["hotel points value", "hotel loyalty", "hotel reward points", "hotel redemption value"],
  [
    '{ name: "pointsRequired", label: "Points Required Per Night", type: "number", min: 1000, max: 200000, defaultValue: 30000 }',
    '{ name: "cashRate", label: "Cash Rate Per Night ($)", type: "number", min: 30, max: 5000, defaultValue: 200 }',
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 3 }',
    '{ name: "freeNightThreshold", label: "Free Night After X Paid Nights", type: "number", min: 0, max: 10, defaultValue: 4 }'
  ],
  `(inputs) => {
    const pointsPerNight = inputs.pointsRequired as number;
    const cashRate = inputs.cashRate as number;
    const nights = inputs.nights as number;
    const freeNightThreshold = inputs.freeNightThreshold as number;
    const totalPointsNeeded = pointsPerNight * nights;
    const totalCashCost = cashRate * nights;
    const centsPerPoint = (cashRate / pointsPerNight) * 100;
    const freeNights = freeNightThreshold > 0 ? Math.floor(nights / freeNightThreshold) : 0;
    const freeNightSavings = freeNights * cashRate;
    const effectiveSavings = totalCashCost;
    return {
      primary: { label: "Point Value", value: formatNumber(Math.round(centsPerPoint * 100) / 100) + " cents/point" },
      details: [
        { label: "Total Points Needed", value: formatNumber(totalPointsNeeded) },
        { label: "Cash Equivalent", value: "$" + formatNumber(Math.round(totalCashCost)) },
        { label: "Bonus Free Nights Earned", value: formatNumber(freeNights) },
        { label: "Free Night Savings", value: "$" + formatNumber(Math.round(freeNightSavings)) }
      ]
    };
  }`,
  [
    { q: "How much are hotel points worth?", a: "Hotel points typically range from 0.4 to 1.2 cents per point. Marriott Bonvoy points average about 0.7 cents, Hilton Honors about 0.5 cents, and Hyatt points about 1.5 to 2 cents." },
    { q: "When should I use hotel points?", a: "Points are most valuable during peak seasons, at luxury properties, or when cash rates are high relative to the points required." },
    { q: "Do hotel points expire?", a: "Most hotel programs keep points active as long as you have account activity every 12 to 24 months, which includes earning or redeeming points." }
  ],
  `Cents Per Point = (Cash Rate Per Night / Points Per Night) x 100
Total Points Needed = Points Per Night x Nights`,
  ["points-value-calculator", "hotel-vs-airbnb-calculator", "travel-budget-calculator"]
);

add(
  "luggage-weight-converter-calculator",
  "Luggage Weight Converter Calculator",
  "Convert luggage weight between pounds and kilograms and check against common airline limits for carry-on and checked bags.",
  "Conversion",
  "conversion",
  "R",
  ["luggage weight converter", "baggage weight", "kg to lbs luggage", "airline weight limit"],
  [
    '{ name: "weight", label: "Luggage Weight", type: "number", min: 0.1, max: 200, defaultValue: 50 }',
    '{ name: "unit", label: "Weight Unit", type: "select", options: [{ value: "1", label: "Pounds (lb)" }, { value: "2", label: "Kilograms (kg)" }], defaultValue: "1" }',
    '{ name: "bagType", label: "Bag Type", type: "select", options: [{ value: "1", label: "Carry-On (limit ~15-22 lb / 7-10 kg)" }, { value: "2", label: "Checked Bag (limit ~50 lb / 23 kg)" }, { value: "3", label: "Oversize Checked (limit ~70 lb / 32 kg)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const unit = inputs.unit as string;
    const bagType = parseInt(inputs.bagType as string);
    const weightLb = unit === "1" ? weight : weight * 2.20462;
    const weightKg = unit === "2" ? weight : weight / 2.20462;
    const limits = [[22, 10], [50, 23], [70, 32]];
    const limit = limits[bagType - 1] || [50, 23];
    const overLb = weightLb - limit[0];
    const overKg = weightKg - limit[1];
    const isOver = weightLb > limit[0];
    const overweightFee = isOver ? (overLb > 20 ? 200 : 100) : 0;
    return {
      primary: { label: "Weight", value: formatNumber(Math.round(weightLb * 10) / 10) + " lb / " + formatNumber(Math.round(weightKg * 10) / 10) + " kg" },
      details: [
        { label: "Airline Limit", value: formatNumber(limit[0]) + " lb / " + formatNumber(limit[1]) + " kg" },
        { label: "Status", value: isOver ? "OVERWEIGHT by " + formatNumber(Math.round(overLb * 10) / 10) + " lb" : "Within limit" },
        { label: "Estimated Overweight Fee", value: "$" + formatNumber(overweightFee) },
        { label: "Weight to Remove", value: isOver ? formatNumber(Math.round(overLb * 10) / 10) + " lb / " + formatNumber(Math.round(overKg * 10) / 10) + " kg" : "None" }
      ]
    };
  }`,
  [
    { q: "What is the standard checked bag weight limit?", a: "Most airlines limit checked bags to 50 pounds (23 kg) for economy class. Business and first class often allow 70 pounds (32 kg)." },
    { q: "How much is the overweight baggage fee?", a: "Typically $100 for bags 51 to 70 pounds and $200 for bags 71 to 100 pounds, though fees vary by airline." },
    { q: "How do I weigh my luggage at home?", a: "Use a handheld luggage scale or stand on a bathroom scale holding your bag, then subtract your body weight." }
  ],
  `Kilograms = Pounds / 2.20462
Pounds = Kilograms x 2.20462`,
  ["luggage-weight-calculator", "travel-budget-calculator", "flight-cost-per-mile-calculator"]
);

add(
  "duty-free-savings-calculator",
  "Duty Free Savings Calculator",
  "Calculate potential savings on duty-free purchases versus domestic retail prices including tax exemptions.",
  "Finance",
  "finance",
  "$",
  ["duty free savings", "tax free shopping", "airport shopping savings", "duty free value"],
  [
    '{ name: "retailPrice", label: "Retail Price at Home ($)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "dutyFreePrice", label: "Duty Free Price ($)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "localTaxRate", label: "Local Sales Tax Rate (%)", type: "number", min: 0, max: 25, defaultValue: 8.5 }',
    '{ name: "quantity", label: "Quantity", type: "number", min: 1, max: 50, defaultValue: 1 }',
    '{ name: "dutyAllowance", label: "Duty Exemption Allowance ($)", type: "number", min: 0, max: 10000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const retailPrice = inputs.retailPrice as number;
    const dutyFreePrice = inputs.dutyFreePrice as number;
    const localTaxRate = inputs.localTaxRate as number;
    const quantity = inputs.quantity as number;
    const dutyAllowance = inputs.dutyAllowance as number;
    const retailTotal = retailPrice * quantity * (1 + localTaxRate / 100);
    const dfTotal = dutyFreePrice * quantity;
    const savings = retailTotal - dfTotal;
    const savingsPct = (savings / retailTotal) * 100;
    const overAllowance = Math.max(dfTotal - dutyAllowance, 0);
    const dutyOwed = overAllowance * 0.03;
    const netSavings = savings - dutyOwed;
    return {
      primary: { label: "Net Savings", value: "$" + formatNumber(Math.round(netSavings * 100) / 100) },
      details: [
        { label: "Retail Total (with tax)", value: "$" + formatNumber(Math.round(retailTotal * 100) / 100) },
        { label: "Duty Free Total", value: "$" + formatNumber(Math.round(dfTotal * 100) / 100) },
        { label: "Savings Percentage", value: formatNumber(Math.round(savingsPct * 10) / 10) + "%" },
        { label: "Over Duty Allowance", value: "$" + formatNumber(Math.round(overAllowance)) },
        { label: "Estimated Duty Owed", value: "$" + formatNumber(Math.round(dutyOwed * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "Is duty free really cheaper?", a: "Duty free items save you the local sales tax and sometimes import duties. Savings are typically 10 to 30 percent on alcohol, tobacco, and perfume but less on electronics." },
    { q: "What is the US duty free allowance?", a: "US residents returning from abroad can bring back $800 worth of goods duty-free. The next $1,000 is taxed at a flat 3 percent rate." },
    { q: "What items are best to buy duty free?", a: "Spirits, wine, cigarettes, perfume, and luxury cosmetics offer the best savings duty free since they carry the highest domestic taxes." }
  ],
  `Net Savings = (Retail Price x (1 + Tax Rate) x Qty) - (Duty Free Price x Qty) - Duty Owed`,
  ["travel-budget-calculator", "currency-exchange-calculator", "travel-insurance-value-calculator"]
);

add(
  "visa-processing-time-calculator",
  "Visa Processing Time Calculator",
  "Estimate visa processing times and costs based on destination, visa type, and application method.",
  "Everyday",
  "everyday",
  "~",
  ["visa processing time", "visa application", "visa cost estimator", "visa timeline"],
  [
    '{ name: "visaType", label: "Visa Type", type: "select", options: [{ value: "1", label: "Tourist/Visitor" }, { value: "2", label: "Business" }, { value: "3", label: "Student" }, { value: "4", label: "Work/Employment" }, { value: "5", label: "Transit" }], defaultValue: "1" }',
    '{ name: "processing", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Standard" }, { value: "2", label: "Expedited" }, { value: "3", label: "Rush/Premium" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Application Complexity", type: "select", options: [{ value: "1", label: "Simple (e-Visa available)" }, { value: "2", label: "Moderate (embassy required)" }, { value: "3", label: "Complex (interview required)" }], defaultValue: "2" }',
    '{ name: "daysUntilTrip", label: "Days Until Trip", type: "number", min: 1, max: 365, defaultValue: 45 }'
  ],
  `(inputs) => {
    const visaType = parseInt(inputs.visaType as string);
    const processing = parseInt(inputs.processing as string);
    const complexity = parseInt(inputs.complexity as string);
    const daysUntilTrip = inputs.daysUntilTrip as number;
    const baseWeeks = [[2, 4], [3, 6], [4, 8], [6, 16], [1, 2]];
    const range = baseWeeks[visaType - 1] || [2, 4];
    const speedMult = [1, 0.6, 0.3][processing - 1] || 1;
    const complexMult = [0.5, 1, 1.5][complexity - 1] || 1;
    const minWeeks = Math.max(Math.round(range[0] * speedMult * complexMult * 10) / 10, 0.5);
    const maxWeeks = Math.round(range[1] * speedMult * complexMult * 10) / 10;
    const baseFee = [50, 80, 100, 200, 30][visaType - 1] || 50;
    const expediteFee = processing === 2 ? 50 : processing === 3 ? 150 : 0;
    const totalFee = baseFee + expediteFee;
    const enoughTime = daysUntilTrip >= minWeeks * 7;
    return {
      primary: { label: "Estimated Processing Time", value: formatNumber(minWeeks) + " - " + formatNumber(maxWeeks) + " weeks" },
      details: [
        { label: "Application Fee", value: "$" + formatNumber(totalFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Apply By Date", value: "At least " + formatNumber(Math.round(maxWeeks * 7)) + " days before travel" },
        { label: "Enough Time?", value: enoughTime ? "Yes" : "Apply immediately or expedite" }
      ]
    };
  }`,
  [
    { q: "How long does a tourist visa take to process?", a: "Tourist visas typically take 2 to 6 weeks for standard processing. E-visas for many countries can be processed in 1 to 5 business days." },
    { q: "How much does a visa application cost?", a: "Tourist visas range from $20 to $200 depending on the destination. US B1/B2 visas cost $185, Schengen visas cost about 80 euros." },
    { q: "Can I expedite my visa application?", a: "Many countries offer expedited processing for an additional fee, typically cutting processing time in half. Some premium services guarantee processing within days." }
  ],
  `Processing Time = Base Weeks x Speed Multiplier x Complexity Factor
Total Cost = Base Fee + Expedite Fee`,
  ["passport-renewal-timeline-calculator", "travel-budget-calculator", "travel-insurance-value-calculator"]
);

add(
  "international-calling-cost-calculator",
  "International Calling Cost Calculator",
  "Compare the cost of international calls using different methods including carrier, VoIP, and calling cards.",
  "Everyday",
  "everyday",
  "~",
  ["international calling cost", "overseas call rates", "calling abroad", "roaming charges"],
  [
    '{ name: "minutesPerDay", label: "Minutes Per Day", type: "number", min: 1, max: 300, defaultValue: 15 }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 180, defaultValue: 14 }',
    '{ name: "carrierRate", label: "Carrier Rate ($/min)", type: "number", min: 0.01, max: 10, defaultValue: 1.5 }',
    '{ name: "voipRate", label: "VoIP/WiFi Rate ($/min)", type: "number", min: 0, max: 2, defaultValue: 0.02 }',
    '{ name: "internationalPlan", label: "Carrier International Plan ($/day)", type: "number", min: 0, max: 20, defaultValue: 10 }'
  ],
  `(inputs) => {
    const minutesPerDay = inputs.minutesPerDay as number;
    const tripDays = inputs.tripDays as number;
    const carrierRate = inputs.carrierRate as number;
    const voipRate = inputs.voipRate as number;
    const internationalPlan = inputs.internationalPlan as number;
    const totalMinutes = minutesPerDay * tripDays;
    const carrierCost = totalMinutes * carrierRate;
    const voipCost = totalMinutes * voipRate;
    const planCost = internationalPlan * tripDays;
    const cheapest = Math.min(carrierCost, voipCost, planCost);
    const bestOption = cheapest === voipCost ? "VoIP/WiFi Calling" : cheapest === planCost ? "International Plan" : "Pay-Per-Minute";
    return {
      primary: { label: "Best Option Cost", value: "$" + formatNumber(Math.round(cheapest * 100) / 100) },
      details: [
        { label: "Best Option", value: bestOption },
        { label: "Carrier Pay-Per-Minute", value: "$" + formatNumber(Math.round(carrierCost * 100) / 100) },
        { label: "VoIP/WiFi Calling", value: "$" + formatNumber(Math.round(voipCost * 100) / 100) },
        { label: "International Plan", value: "$" + formatNumber(Math.round(planCost * 100) / 100) },
        { label: "Total Minutes", value: formatNumber(totalMinutes) }
      ]
    };
  }`,
  [
    { q: "What is the cheapest way to call internationally?", a: "VoIP apps like WhatsApp, Skype, and FaceTime over WiFi are virtually free. For calls to landlines, services like Google Voice or Skype credit cost 1 to 5 cents per minute." },
    { q: "How much do international roaming charges cost?", a: "Without a plan, carrier roaming charges can be $1 to $5 per minute. Most carriers offer international day passes for $5 to $12 per day." },
    { q: "Should I get a local SIM card when traveling?", a: "A local SIM card is often the cheapest option for extended trips, providing local rates and data. Many countries offer tourist SIM cards for $10 to $30." }
  ],
  `Carrier Cost = Minutes/Day x Trip Days x Carrier Rate
VoIP Cost = Total Minutes x VoIP Rate
Plan Cost = Daily Plan Fee x Trip Days`,
  ["travel-budget-calculator", "travel-daily-budget-calculator", "currency-exchange-calculator"]
);

add(
  "travel-vaccination-cost-calculator",
  "Travel Vaccination Cost Calculator",
  "Estimate the total cost of required and recommended travel vaccinations for your destination.",
  "Health",
  "health",
  "H",
  ["travel vaccination cost", "travel immunization", "travel health", "vaccine cost estimator"],
  [
    '{ name: "numVaccines", label: "Number of Vaccines Needed", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "avgCostPerVaccine", label: "Average Cost Per Vaccine ($)", type: "number", min: 20, max: 500, defaultValue: 150 }',
    '{ name: "consultFee", label: "Travel Clinic Consultation ($)", type: "number", min: 0, max: 300, defaultValue: 50 }',
    '{ name: "malariaWeeks", label: "Weeks of Malaria Prophylaxis", type: "number", min: 0, max: 52, defaultValue: 0 }',
    '{ name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const numVaccines = inputs.numVaccines as number;
    const avgCost = inputs.avgCostPerVaccine as number;
    const consultFee = inputs.consultFee as number;
    const malariaWeeks = inputs.malariaWeeks as number;
    const travelers = inputs.travelers as number;
    const vaccineCost = numVaccines * avgCost;
    const malariaCost = malariaWeeks > 0 ? malariaWeeks * 12 : 0;
    const perPersonTotal = vaccineCost + consultFee + malariaCost;
    const grandTotal = perPersonTotal * travelers;
    return {
      primary: { label: "Total Vaccination Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Vaccines Cost", value: "$" + formatNumber(Math.round(vaccineCost * travelers)) },
        { label: "Consultation Fee", value: "$" + formatNumber(Math.round(consultFee * travelers)) },
        { label: "Malaria Prophylaxis", value: "$" + formatNumber(Math.round(malariaCost * travelers)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPersonTotal)) }
      ]
    };
  }`,
  [
    { q: "Which travel vaccines are most expensive?", a: "Yellow Fever ($200 to $350), Japanese Encephalitis ($300 to $400 for the series), and Rabies ($300 to $800 for the 3-dose series) are typically the most expensive." },
    { q: "Does insurance cover travel vaccinations?", a: "Some insurance plans cover recommended travel vaccines. Hepatitis A and B, Tdap, and flu shots are often covered, but yellow fever and Japanese encephalitis usually are not." },
    { q: "How far in advance should I get travel vaccines?", a: "Ideally 4 to 8 weeks before travel. Some vaccines require multiple doses over several weeks to be fully effective." }
  ],
  `Total Cost = (Vaccines x Avg Cost + Consultation + Malaria Meds) x Travelers`,
  ["travel-budget-calculator", "travel-insurance-value-calculator", "travel-daily-budget-calculator"]
);

add(
  "airport-parking-cost-calculator",
  "Airport Parking Cost Calculator",
  "Compare airport parking costs across different options including economy, garage, valet, and off-site lots.",
  "Finance",
  "finance",
  "$",
  ["airport parking cost", "airport parking comparison", "long term parking", "airport parking rates"],
  [
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 60, defaultValue: 7 }',
    '{ name: "economyRate", label: "Economy Lot Daily Rate ($)", type: "number", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "garageRate", label: "Garage Daily Rate ($)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "offSiteRate", label: "Off-Site Lot Daily Rate ($)", type: "number", min: 2, max: 25, defaultValue: 7 }',
    '{ name: "rideshareEach", label: "Rideshare Each Way ($)", type: "number", min: 10, max: 150, defaultValue: 35 }'
  ],
  `(inputs) => {
    const tripDays = inputs.tripDays as number;
    const economyRate = inputs.economyRate as number;
    const garageRate = inputs.garageRate as number;
    const offSiteRate = inputs.offSiteRate as number;
    const rideshareEach = inputs.rideshareEach as number;
    const economyTotal = economyRate * tripDays;
    const garageTotal = garageRate * tripDays;
    const offSiteTotal = offSiteRate * tripDays;
    const rideshareTotal = rideshareEach * 2;
    const cheapest = Math.min(economyTotal, garageTotal, offSiteTotal, rideshareTotal);
    const bestOption = cheapest === rideshareTotal ? "Rideshare" : cheapest === offSiteTotal ? "Off-Site Lot" : cheapest === economyTotal ? "Economy Lot" : "Garage";
    return {
      primary: { label: "Best Option", value: bestOption + " - $" + formatNumber(Math.round(cheapest)) },
      details: [
        { label: "Economy Lot", value: "$" + formatNumber(Math.round(economyTotal)) },
        { label: "Garage Parking", value: "$" + formatNumber(Math.round(garageTotal)) },
        { label: "Off-Site Lot", value: "$" + formatNumber(Math.round(offSiteTotal)) },
        { label: "Rideshare (round trip)", value: "$" + formatNumber(Math.round(rideshareTotal)) },
        { label: "Savings vs Garage", value: "$" + formatNumber(Math.round(garageTotal - cheapest)) }
      ]
    };
  }`,
  [
    { q: "How much does airport parking cost?", a: "Airport parking ranges from $5 to $15 per day for economy lots, $15 to $40 per day for covered garages, and $3 to $10 per day for off-site lots with shuttles." },
    { q: "When is rideshare cheaper than parking?", a: "Rideshare is typically cheaper than parking for trips of 3 days or fewer, especially at airports with expensive parking." },
    { q: "How can I save on airport parking?", a: "Book online in advance for discounts, use off-site lots with shuttle service, compare rates on apps, or use airport loyalty programs that include free parking perks." }
  ],
  `Option Cost = Daily Rate x Trip Days
Rideshare Cost = Per Trip Rate x 2`,
  ["travel-budget-calculator", "commute-cost-calculator", "road-trip-cost-calculator"]
);

add(
  "road-trip-fuel-planner-calculator",
  "Road Trip Fuel Planner Calculator",
  "Plan fuel stops and total fuel costs for a road trip based on distance, vehicle efficiency, and tank size.",
  "Everyday",
  "everyday",
  "~",
  ["road trip fuel planner", "gas stop planner", "fuel stop calculator", "road trip gas cost"],
  [
    '{ name: "totalDistance", label: "Total Trip Distance (miles)", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 5, max: 100, defaultValue: 28 }',
    '{ name: "tankSize", label: "Tank Size (gallons)", type: "number", min: 5, max: 50, defaultValue: 14 }',
    '{ name: "gasPrice", label: "Avg Gas Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 3.5 }',
    '{ name: "refillAt", label: "Refill at % Tank Remaining", type: "number", min: 5, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const totalDistance = inputs.totalDistance as number;
    const mpg = inputs.mpg as number;
    const tankSize = inputs.tankSize as number;
    const gasPrice = inputs.gasPrice as number;
    const refillAt = inputs.refillAt as number;
    const rangePerTank = mpg * tankSize;
    const usableRange = rangePerTank * (1 - refillAt / 100);
    const totalGallons = totalDistance / mpg;
    const totalFuelCost = totalGallons * gasPrice;
    const numStops = Math.max(Math.ceil(totalDistance / usableRange) - 1, 0);
    const milesPerStop = numStops > 0 ? Math.round(totalDistance / (numStops + 1)) : totalDistance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalFuelCost * 100) / 100) },
      details: [
        { label: "Total Gallons Needed", value: formatNumber(Math.round(totalGallons * 10) / 10) },
        { label: "Range Per Tank", value: formatNumber(Math.round(rangePerTank)) + " miles" },
        { label: "Fuel Stops Needed", value: formatNumber(numStops) },
        { label: "Avg Miles Between Stops", value: formatNumber(milesPerStop) + " miles" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(gasPrice / mpg * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fuel cost for a road trip?", a: "Divide total distance by your vehicle MPG to get gallons needed, then multiply by the average gas price along your route." },
    { q: "How often should I stop for gas on a road trip?", a: "Plan stops when your tank reaches about a quarter full. In remote areas, fill up whenever possible as stations may be far apart." },
    { q: "Does highway driving use more or less fuel?", a: "Most vehicles are most efficient at 45 to 65 mph. Highway driving at moderate speeds is typically more fuel efficient than city driving, but speeds above 65 mph reduce efficiency." }
  ],
  `Total Gallons = Distance / MPG
Total Fuel Cost = Total Gallons x Gas Price
Stops = ceil(Distance / Usable Range) - 1`,
  ["road-trip-cost-calculator", "commute-cost-calculator", "travel-budget-calculator"]
);

add(
  "flight-carbon-offset-calculator",
  "Flight Carbon Offset Calculator",
  "Calculate the carbon emissions from your flight and the cost to offset them through carbon credits.",
  "Science",
  "science",
  "A",
  ["flight carbon offset", "aviation emissions", "CO2 flight calculator", "carbon credit flight"],
  [
    '{ name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 2500 }',
    '{ name: "cabinClass", label: "Cabin Class", type: "select", options: [{ value: "1", label: "Economy" }, { value: "2", label: "Premium Economy" }, { value: "3", label: "Business" }, { value: "4", label: "First Class" }], defaultValue: "1" }',
    '{ name: "roundTrip", label: "Round Trip?", type: "select", options: [{ value: "1", label: "One Way" }, { value: "2", label: "Round Trip" }], defaultValue: "2" }',
    '{ name: "offsetPrice", label: "Carbon Offset Price ($/ton CO2)", type: "number", min: 5, max: 100, defaultValue: 15 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const cabinClass = parseInt(inputs.cabinClass as string);
    const roundTrip = inputs.roundTrip as string;
    const offsetPrice = inputs.offsetPrice as number;
    const distKm = distance * 1.60934;
    const multiplier = roundTrip === "2" ? 2 : 1;
    const classFactor = [1, 1.6, 2.9, 4.0][cabinClass - 1] || 1;
    const emissionFactor = distKm < 1500 ? 0.000255 : distKm < 4000 ? 0.000195 : 0.000170;
    const co2Tons = (distKm * emissionFactor * classFactor * multiplier);
    const offsetCost = co2Tons * offsetPrice;
    const treesEquivalent = Math.round(co2Tons / 0.022);
    return {
      primary: { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons * 100) / 100) + " metric tons" },
      details: [
        { label: "Offset Cost", value: "$" + formatNumber(Math.round(offsetCost * 100) / 100) },
        { label: "Distance", value: formatNumber(Math.round(distKm)) + " km (" + formatNumber(distance) + " mi)" },
        { label: "Class Multiplier", value: formatNumber(classFactor) + "x" },
        { label: "Equivalent Trees for 1 Year", value: formatNumber(treesEquivalent) + " trees" }
      ]
    };
  }`,
  [
    { q: "How much CO2 does a flight produce?", a: "A round-trip economy flight from New York to London produces about 1 to 1.5 metric tons of CO2 per passenger, roughly equal to driving 3,000 to 4,000 miles." },
    { q: "Why does business class have higher emissions?", a: "Premium cabins take up more floor space per passenger, meaning fewer people per flight. Business class produces about 3 times more emissions per passenger than economy." },
    { q: "Do carbon offsets actually help?", a: "Quality carbon offsets fund projects like reforestation and renewable energy. Look for Gold Standard or Verified Carbon Standard certifications for credible offsets." }
  ],
  `CO2 (tons) = Distance (km) x Emission Factor x Class Factor x Trip Multiplier
Offset Cost = CO2 Tons x Price Per Ton`,
  ["carbon-footprint-calculator", "tree-planting-offset-calculator", "travel-budget-calculator"]
);

add(
  "timezone-overlap-calculator",
  "Timezone Overlap Calculator",
  "Find overlapping working hours between two time zones for scheduling meetings with international contacts.",
  "Everyday",
  "everyday",
  "~",
  ["timezone overlap", "time zone meeting planner", "international meeting time", "working hours overlap"],
  [
    '{ name: "yourOffset", label: "Your UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: -5 }',
    '{ name: "theirOffset", label: "Their UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: 1 }',
    '{ name: "workStart", label: "Work Day Start Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 9 }',
    '{ name: "workEnd", label: "Work Day End Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 17 }'
  ],
  `(inputs) => {
    const yourOffset = inputs.yourOffset as number;
    const theirOffset = inputs.theirOffset as number;
    const workStart = inputs.workStart as number;
    const workEnd = inputs.workEnd as number;
    const diff = theirOffset - yourOffset;
    const theirStartInYourTime = workStart + diff;
    const theirEndInYourTime = workEnd + diff;
    const overlapStart = Math.max(workStart, theirStartInYourTime);
    const overlapEnd = Math.min(workEnd, theirEndInYourTime);
    const overlapHours = Math.max(overlapEnd - overlapStart, 0);
    const formatHour = (h: number) => {
      const normalized = ((h % 24) + 24) % 24;
      const ampm = normalized >= 12 ? "PM" : "AM";
      const hour12 = normalized % 12 || 12;
      return hour12 + ":00 " + ampm;
    };
    return {
      primary: { label: "Overlapping Work Hours", value: formatNumber(overlapHours) + " hours" },
      details: [
        { label: "Time Difference", value: formatNumber(Math.abs(diff)) + " hours " + (diff > 0 ? "ahead" : "behind") },
        { label: "Your Working Hours", value: formatHour(workStart) + " - " + formatHour(workEnd) },
        { label: "Their Hours (your time)", value: formatHour(theirStartInYourTime) + " - " + formatHour(theirEndInYourTime) },
        { label: "Best Meeting Window", value: overlapHours > 0 ? formatHour(overlapStart) + " - " + formatHour(overlapEnd) + " your time" : "No overlap" }
      ]
    };
  }`,
  [
    { q: "How do I find overlapping work hours across time zones?", a: "Convert both schedules to the same time zone, then find the intersection of working hours. Tools and calculators can automate this." },
    { q: "What is the biggest time difference possible?", a: "The maximum time difference is 26 hours, between UTC-12 (Baker Island) and UTC+14 (Line Islands, Kiribati)." },
    { q: "How do I handle meetings across many time zones?", a: "Rotate meeting times to share the inconvenience, use async communication when possible, and record meetings for those who cannot attend live." }
  ],
  `Time Difference = Their Offset - Your Offset
Overlap = max(0, min(Your End, Their End in Your Time) - max(Your Start, Their Start in Your Time))`,
  ["time-zone-meeting-calculator", "travel-budget-calculator", "jet-lag-recovery-time-calculator"]
);

add(
  "sailing-distance-calculator",
  "Sailing Distance Calculator",
  "Calculate sailing time and distance between waypoints based on boat speed, wind conditions, and current.",
  "Everyday",
  "everyday",
  "~",
  ["sailing distance", "nautical distance", "sailing time", "boat trip planner"],
  [
    '{ name: "distance", label: "Distance (nautical miles)", type: "number", min: 1, max: 5000, defaultValue: 120 }',
    '{ name: "boatSpeed", label: "Hull Speed / Avg Speed (knots)", type: "number", min: 1, max: 30, defaultValue: 6 }',
    '{ name: "currentKnots", label: "Current (knots, negative=against)", type: "number", min: -5, max: 5, defaultValue: 0.5 }',
    '{ name: "windEffect", label: "Wind Effect on Speed (%)", type: "number", min: -50, max: 50, defaultValue: 10 }',
    '{ name: "hoursPerDay", label: "Sailing Hours Per Day", type: "number", min: 4, max: 24, defaultValue: 10 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const boatSpeed = inputs.boatSpeed as number;
    const currentKnots = inputs.currentKnots as number;
    const windEffect = inputs.windEffect as number;
    const hoursPerDay = inputs.hoursPerDay as number;
    const effectiveSpeed = Math.max((boatSpeed * (1 + windEffect / 100)) + currentKnots, 0.5);
    const totalHours = distance / effectiveSpeed;
    const sailingDays = totalHours / hoursPerDay;
    const distStatute = distance * 1.15078;
    const distKm = distance * 1.852;
    return {
      primary: { label: "Total Sailing Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Sailing Days", value: formatNumber(Math.round(sailingDays * 10) / 10) + " days" },
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed * 10) / 10) + " knots" },
        { label: "Distance (statute miles)", value: formatNumber(Math.round(distStatute * 10) / 10) },
        { label: "Distance (km)", value: formatNumber(Math.round(distKm * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "How fast does a sailboat travel?", a: "Cruising sailboats average 5 to 8 knots. Racing sailboats can exceed 15 knots. A boat's hull speed in knots is approximately 1.34 times the square root of waterline length in feet." },
    { q: "How far can a sailboat travel in a day?", a: "A typical cruising sailboat covers 100 to 150 nautical miles per day in favorable conditions, sailing for 20 to 24 hours." },
    { q: "How does current affect sailing time?", a: "Favorable currents of 1 to 2 knots can significantly reduce travel time, while adverse currents can add hours or days to a passage." }
  ],
  `Effective Speed = (Boat Speed x (1 + Wind Effect%)) + Current
Sailing Time = Distance / Effective Speed
Sailing Days = Total Hours / Hours Per Day`,
  ["boat-fuel-consumption-calculator", "hull-speed-calculator", "anchor-rode-calculator"]
);

add(
  "nautical-mile-converter-calculator",
  "Nautical Mile Converter Calculator",
  "Convert distances between nautical miles, statute miles, kilometers, and meters for marine and aviation use.",
  "Conversion",
  "conversion",
  "R",
  ["nautical mile converter", "nm to miles", "nm to km", "maritime distance converter"],
  [
    '{ name: "value", label: "Distance Value", type: "number", min: 0.01, max: 100000, defaultValue: 100 }',
    '{ name: "fromUnit", label: "Convert From", type: "select", options: [{ value: "1", label: "Nautical Miles (nm)" }, { value: "2", label: "Statute Miles (mi)" }, { value: "3", label: "Kilometers (km)" }, { value: "4", label: "Meters (m)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const value = inputs.value as number;
    const fromUnit = inputs.fromUnit as string;
    let nm = 0;
    if (fromUnit === "1") nm = value;
    else if (fromUnit === "2") nm = value / 1.15078;
    else if (fromUnit === "3") nm = value / 1.852;
    else nm = value / 1852;
    const mi = nm * 1.15078;
    const km = nm * 1.852;
    const m = nm * 1852;
    const ft = m * 3.28084;
    return {
      primary: { label: "Nautical Miles", value: formatNumber(Math.round(nm * 10000) / 10000) + " nm" },
      details: [
        { label: "Statute Miles", value: formatNumber(Math.round(mi * 10000) / 10000) + " mi" },
        { label: "Kilometers", value: formatNumber(Math.round(km * 10000) / 10000) + " km" },
        { label: "Meters", value: formatNumber(Math.round(m * 100) / 100) + " m" },
        { label: "Feet", value: formatNumber(Math.round(ft * 100) / 100) + " ft" }
      ]
    };
  }`,
  [
    { q: "What is a nautical mile?", a: "A nautical mile is 1,852 meters or 1.15078 statute miles. It is based on one minute of arc of latitude on Earth, making it useful for navigation." },
    { q: "Why do ships and planes use nautical miles?", a: "Nautical miles correspond directly to degrees of latitude, making chart-based navigation easier. One degree of latitude equals 60 nautical miles." },
    { q: "What is a knot?", a: "A knot is one nautical mile per hour. The term comes from the old practice of counting knots on a rope trailing behind a ship to measure speed." }
  ],
  `1 Nautical Mile = 1.15078 Statute Miles = 1.852 Kilometers = 1,852 Meters`,
  ["sailing-distance-calculator", "hull-speed-calculator", "boat-fuel-consumption-calculator"]
);

add(
  "flight-layover-optimizer-calculator",
  "Flight Layover Optimizer Calculator",
  "Evaluate whether a layover is worth it by comparing total travel time and savings against a direct flight.",
  "Finance",
  "finance",
  "$",
  ["layover optimizer", "flight connection", "layover worth it", "flight savings layover"],
  [
    '{ name: "directPrice", label: "Direct Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 600 }',
    '{ name: "layoverPrice", label: "Layover Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 350 }',
    '{ name: "directHours", label: "Direct Flight Time (hours)", type: "number", min: 0.5, max: 24, defaultValue: 5 }',
    '{ name: "layoverTotalHours", label: "Layover Total Travel Time (hours)", type: "number", min: 1, max: 48, defaultValue: 10 }',
    '{ name: "hourlyValue", label: "Value of Your Time ($/hour)", type: "number", min: 10, max: 500, defaultValue: 40 }'
  ],
  `(inputs) => {
    const directPrice = inputs.directPrice as number;
    const layoverPrice = inputs.layoverPrice as number;
    const directHours = inputs.directHours as number;
    const layoverTotalHours = inputs.layoverTotalHours as number;
    const hourlyValue = inputs.hourlyValue as number;
    const priceSavings = directPrice - layoverPrice;
    const extraHours = layoverTotalHours - directHours;
    const timeCost = extraHours * hourlyValue;
    const netSavings = priceSavings - timeCost;
    const worthIt = netSavings > 0;
    const breakEvenHourlyValue = extraHours > 0 ? priceSavings / extraHours : 0;
    return {
      primary: { label: "Net Savings", value: "$" + formatNumber(Math.round(netSavings)) },
      details: [
        { label: "Price Savings", value: "$" + formatNumber(Math.round(priceSavings)) },
        { label: "Extra Travel Time", value: formatNumber(Math.round(extraHours * 10) / 10) + " hours" },
        { label: "Time Cost", value: "$" + formatNumber(Math.round(timeCost)) },
        { label: "Worth It?", value: worthIt ? "Yes - Take the Layover" : "No - Take the Direct Flight" },
        { label: "Break-Even Time Value", value: "$" + formatNumber(Math.round(breakEvenHourlyValue)) + "/hour" }
      ]
    };
  }`,
  [
    { q: "When is a layover worth the savings?", a: "A layover is worth it when the ticket savings exceed the value of your extra time spent traveling. Consider fatigue, missed connection risk, and stress in your calculation." },
    { q: "What is a good layover length?", a: "Domestic layovers of 1 to 2 hours are ideal. International layovers should be at least 2 to 3 hours for customs and terminal changes." },
    { q: "What happens if I miss a connection?", a: "If booked on one ticket, the airline will rebook you on the next available flight. If on separate tickets, you bear the cost and risk of rebooking." }
  ],
  `Net Savings = (Direct Price - Layover Price) - (Extra Hours x Hourly Value)
Break-Even Value = Price Savings / Extra Hours`,
  ["flight-cost-per-mile-calculator", "travel-budget-calculator", "airline-miles-value-calculator"]
);

add(
  "travel-tip-by-country-calculator",
  "Travel Tip by Country Calculator",
  "Calculate appropriate tip amounts based on country tipping customs, service type, and bill amount.",
  "Everyday",
  "everyday",
  "~",
  ["travel tipping", "tip by country", "international tipping", "tipping customs abroad"],
  [
    '{ name: "region", label: "Region/Country", type: "select", options: [{ value: "1", label: "USA/Canada (15-20%)" }, { value: "2", label: "UK/Ireland (10-15%)" }, { value: "3", label: "Western Europe (5-10%)" }, { value: "4", label: "Japan/Korea (0% - Not Expected)" }, { value: "5", label: "Middle East (10-15%)" }, { value: "6", label: "Latin America (10%)" }, { value: "7", label: "Australia/NZ (0-10%)" }, { value: "8", label: "Southeast Asia (5-10%)" }], defaultValue: "1" }',
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1", label: "Restaurant" }, { value: "2", label: "Taxi/Driver" }, { value: "3", label: "Hotel Porter" }, { value: "4", label: "Tour Guide" }], defaultValue: "1" }',
    '{ name: "billAmount", label: "Bill Amount (local currency)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "serviceQuality", label: "Service Quality", type: "select", options: [{ value: "1", label: "Below Average" }, { value: "2", label: "Average" }, { value: "3", label: "Excellent" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const region = parseInt(inputs.region as string);
    const serviceType = parseInt(inputs.serviceType as string);
    const billAmount = inputs.billAmount as number;
    const serviceQuality = parseInt(inputs.serviceQuality as string);
    const tipRanges: Record<number, number[]> = {
      1: [15, 18, 22], 2: [10, 12, 15], 3: [5, 8, 10],
      4: [0, 0, 0], 5: [10, 12, 15], 6: [8, 10, 12],
      7: [0, 5, 10], 8: [5, 8, 10]
    };
    const ranges = tipRanges[region] || [10, 15, 20];
    const tipPct = ranges[serviceQuality - 1] || ranges[1];
    const tipAmount = billAmount * (tipPct / 100);
    const totalBill = billAmount + tipAmount;
    const notes: Record<number, string> = {
      1: "Tipping is expected and customary",
      2: "Check if service charge is included",
      3: "Small tips appreciated, not required",
      4: "Tipping can be considered rude",
      5: "Tipping is appreciated",
      6: "Tipping is appreciated but not mandatory",
      7: "Tipping is not expected but appreciated",
      8: "Small tips for good service"
    };
    return {
      primary: { label: "Recommended Tip", value: formatNumber(Math.round(tipAmount * 100) / 100) },
      details: [
        { label: "Tip Percentage", value: formatNumber(tipPct) + "%" },
        { label: "Total with Tip", value: formatNumber(Math.round(totalBill * 100) / 100) },
        { label: "Cultural Note", value: notes[region] || "Ask locally" }
      ]
    };
  }`,
  [
    { q: "Should I tip in Japan?", a: "Tipping is generally not practiced in Japan and can sometimes be considered rude. Excellent service is the cultural standard and does not require a monetary reward." },
    { q: "Is tipping expected in Europe?", a: "In most of Western Europe, a 5 to 10 percent tip is appreciated but not mandatory. Many restaurants include a service charge. Check your bill before adding extra." },
    { q: "How much should I tip a tour guide?", a: "In the US, tip tour guides $5 to $10 per person for a half-day tour and $10 to $20 for a full day. In other countries, $2 to $5 per person is common." }
  ],
  `Tip Amount = Bill Amount x (Tip Percentage / 100)
Total = Bill Amount + Tip Amount`,
  ["tipping-etiquette-calculator", "travel-daily-budget-calculator", "currency-exchange-calculator"]
);

add(
  "backpacking-gear-weight-calculator",
  "Backpacking Gear Weight Calculator",
  "Calculate your total pack weight including base weight, consumables, and worn items to optimize your backpacking load.",
  "Everyday",
  "everyday",
  "~",
  ["backpacking gear weight", "pack weight calculator", "hiking weight", "backpack load"],
  [
    '{ name: "shelterWeight", label: "Shelter Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3.5 }',
    '{ name: "sleepSystem", label: "Sleep System Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3 }',
    '{ name: "packWeight", label: "Backpack Weight (lb)", type: "number", min: 0.5, max: 10, defaultValue: 3 }',
    '{ name: "otherGear", label: "Other Base Gear (lb)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "foodPerDay", label: "Food Weight Per Day (lb)", type: "number", min: 0.5, max: 5, defaultValue: 2 }',
    '{ name: "waterLiters", label: "Water Carried (liters)", type: "number", min: 0.5, max: 8, defaultValue: 2 }',
    '{ name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 30, defaultValue: 3 }'
  ],
  `(inputs) => {
    const shelter = inputs.shelterWeight as number;
    const sleep = inputs.sleepSystem as number;
    const pack = inputs.packWeight as number;
    const otherGear = inputs.otherGear as number;
    const foodPerDay = inputs.foodPerDay as number;
    const waterLiters = inputs.waterLiters as number;
    const tripDays = inputs.tripDays as number;
    const baseWeight = shelter + sleep + pack + otherGear;
    const foodWeight = foodPerDay * tripDays;
    const waterWeight = waterLiters * 2.20462;
    const totalWeight = baseWeight + foodWeight + waterWeight;
    const category = baseWeight < 10 ? "Ultralight" : baseWeight < 15 ? "Lightweight" : baseWeight < 20 ? "Traditional" : "Heavy";
    const totalKg = totalWeight / 2.20462;
    return {
      primary: { label: "Total Pack Weight", value: formatNumber(Math.round(totalWeight * 10) / 10) + " lb" },
      details: [
        { label: "Base Weight", value: formatNumber(Math.round(baseWeight * 10) / 10) + " lb" },
        { label: "Category", value: category },
        { label: "Food Weight", value: formatNumber(Math.round(foodWeight * 10) / 10) + " lb" },
        { label: "Water Weight", value: formatNumber(Math.round(waterWeight * 10) / 10) + " lb" },
        { label: "Total in Kilograms", value: formatNumber(Math.round(totalKg * 10) / 10) + " kg" }
      ]
    };
  }`,
  [
    { q: "What is a good base weight for backpacking?", a: "Ultralight is under 10 pounds, lightweight is 10 to 15 pounds, and traditional is 15 to 20 pounds. The big three (shelter, sleep system, pack) account for most of the base weight." },
    { q: "How much food should I carry per day?", a: "Plan for 1.5 to 2.5 pounds of food per day, providing about 2,500 to 4,500 calories depending on activity level and conditions." },
    { q: "How much water should I carry?", a: "Carry 1 to 2 liters between reliable water sources. In arid conditions, you may need 4 or more liters at a time." }
  ],
  `Base Weight = Shelter + Sleep System + Pack + Other Gear
Total Weight = Base Weight + (Food/Day x Days) + Water Weight`,
  ["travel-budget-calculator", "luggage-weight-converter-calculator", "travel-daily-budget-calculator"]
);

add(
  "ski-resort-value-comparison-calculator",
  "Ski Resort Value Comparison Calculator",
  "Compare the per-run and per-hour value of different ski resorts based on lift ticket price, vertical, and runs.",
  "Finance",
  "finance",
  "$",
  ["ski resort value", "lift ticket comparison", "ski cost calculator", "ski resort comparison"],
  [
    '{ name: "liftTicketPrice", label: "Lift Ticket Price ($)", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "verticalFeet", label: "Vertical Drop (feet)", type: "number", min: 200, max: 6000, defaultValue: 2500 }',
    '{ name: "totalRuns", label: "Total Runs Available", type: "number", min: 5, max: 300, defaultValue: 80 }',
    '{ name: "skiHours", label: "Hours You Will Ski", type: "number", min: 1, max: 10, defaultValue: 6 }',
    '{ name: "runsPerHour", label: "Est. Runs Per Hour", type: "number", min: 1, max: 15, defaultValue: 4 }'
  ],
  `(inputs) => {
    const price = inputs.liftTicketPrice as number;
    const vertical = inputs.verticalFeet as number;
    const totalRuns = inputs.totalRuns as number;
    const skiHours = inputs.skiHours as number;
    const runsPerHour = inputs.runsPerHour as number;
    const totalRunsTaken = Math.round(skiHours * runsPerHour);
    const costPerRun = price / totalRunsTaken;
    const costPerHour = price / skiHours;
    const totalVertical = totalRunsTaken * vertical;
    const costPer1000Vert = (price / totalVertical) * 1000;
    return {
      primary: { label: "Cost Per Run", value: "$" + formatNumber(Math.round(costPerRun * 100) / 100) },
      details: [
        { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
        { label: "Total Runs You Will Take", value: formatNumber(totalRunsTaken) },
        { label: "Total Vertical Skied", value: formatNumber(totalVertical) + " ft" },
        { label: "Cost Per 1,000 ft Vertical", value: "$" + formatNumber(Math.round(costPer1000Vert * 100) / 100) },
        { label: "Runs Available", value: formatNumber(totalRuns) }
      ]
    };
  }`,
  [
    { q: "How much do lift tickets cost?", a: "Major resorts range from $100 to $250 per day. Smaller regional resorts charge $40 to $100. Season passes often pay for themselves in 4 to 7 days of skiing." },
    { q: "What makes a ski resort good value?", a: "High vertical drop, many runs, short lift lines, and lower ticket prices all contribute to better value. More runs per hour means lower cost per run." },
    { q: "Are multi-day passes worth it?", a: "Multi-day passes typically save 10 to 25 percent per day compared to single-day tickets, and season passes are the best value for frequent skiers." }
  ],
  `Cost Per Run = Ticket Price / Total Runs Taken
Cost Per Hour = Ticket Price / Ski Hours
Total Vertical = Runs x Vertical Drop`,
  ["travel-budget-calculator", "travel-daily-budget-calculator", "hotel-vs-airbnb-calculator"]
);

add(
  "rental-car-cost-comparison-calculator",
  "Rental Car Cost Comparison Calculator",
  "Compare total rental car costs including insurance, fuel, tolls, and fees to find the cheapest option.",
  "Finance",
  "finance",
  "$",
  ["rental car cost", "car rental comparison", "rental car total cost", "rental car calculator"],
  [
    '{ name: "dailyRate", label: "Daily Rental Rate ($)", type: "number", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "rentalDays", label: "Rental Days", type: "number", min: 1, max: 60, defaultValue: 5 }',
    '{ name: "insurancePerDay", label: "Insurance Per Day ($)", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "estimatedMiles", label: "Estimated Miles Driven", type: "number", min: 10, max: 5000, defaultValue: 300 }',
    '{ name: "carMpg", label: "Car MPG", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", min: 2, max: 10, defaultValue: 3.5 }'
  ],
  `(inputs) => {
    const dailyRate = inputs.dailyRate as number;
    const rentalDays = inputs.rentalDays as number;
    const insurancePerDay = inputs.insurancePerDay as number;
    const estimatedMiles = inputs.estimatedMiles as number;
    const carMpg = inputs.carMpg as number;
    const gasPrice = inputs.gasPrice as number;
    const rentalCost = dailyRate * rentalDays;
    const insuranceCost = insurancePerDay * rentalDays;
    const fuelCost = (estimatedMiles / carMpg) * gasPrice;
    const taxes = rentalCost * 0.15;
    const totalCost = rentalCost + insuranceCost + fuelCost + taxes;
    const costPerDay = totalCost / rentalDays;
    const costPerMile = totalCost / estimatedMiles;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Rental Fee", value: "$" + formatNumber(Math.round(rentalCost)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insuranceCost)) },
        { label: "Fuel Estimate", value: "$" + formatNumber(Math.round(fuelCost * 100) / 100) },
        { label: "Taxes & Fees (~15%)", value: "$" + formatNumber(Math.round(taxes * 100) / 100) },
        { label: "True Cost Per Day", value: "$" + formatNumber(Math.round(costPerDay * 100) / 100) },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "Do I need rental car insurance?", a: "Check if your personal auto insurance or credit card covers rentals. If not, the collision damage waiver at $15 to $30 per day is worth considering for peace of mind." },
    { q: "How can I save money on rental cars?", a: "Book in advance, compare rates across agencies, decline insurance if already covered, return with a full tank, and avoid airport location surcharges." },
    { q: "What hidden fees should I watch for?", a: "Airport surcharges, additional driver fees, underage driver fees, GPS rental charges, toll transponder fees, and prepaid fuel options can significantly increase costs." }
  ],
  `Total Cost = (Daily Rate x Days) + (Insurance x Days) + Fuel + Taxes
Fuel = (Miles / MPG) x Gas Price`,
  ["road-trip-cost-calculator", "travel-budget-calculator", "commute-cost-calculator"]
);

add(
  "flight-time-estimator-calculator",
  "Flight Time Estimator Calculator",
  "Estimate total door-to-door travel time for a flight including airport time, flight duration, and ground transport.",
  "Everyday",
  "everyday",
  "~",
  ["flight time estimator", "total travel time", "door to door flight time", "air travel time"],
  [
    '{ name: "flightHours", label: "Flight Duration (hours)", type: "number", min: 0.5, max: 20, defaultValue: 4 }',
    '{ name: "flightType", label: "Flight Type", type: "select", options: [{ value: "1", label: "Domestic" }, { value: "2", label: "International" }], defaultValue: "1" }',
    '{ name: "driveToAirport", label: "Drive to Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 45 }',
    '{ name: "driveFromAirport", label: "Drive from Dest. Airport (minutes)", type: "number", min: 5, max: 180, defaultValue: 30 }',
    '{ name: "checkedBags", label: "Checked Bags?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const flightHours = inputs.flightHours as number;
    const flightType = inputs.flightType as string;
    const driveToAirport = inputs.driveToAirport as number;
    const driveFromAirport = inputs.driveFromAirport as number;
    const checkedBags = inputs.checkedBags as string;
    const earlyArrival = flightType === "2" ? 180 : 120;
    const securityMin = flightType === "2" ? 45 : 30;
    const baggageClaim = checkedBags === "1" ? 30 : 0;
    const customsMin = flightType === "2" ? 45 : 0;
    const boardingMin = 30;
    const taxiMin = 15;
    const totalMinutes = driveToAirport + earlyArrival + (flightHours * 60) + taxiMin + customsMin + baggageClaim + driveFromAirport;
    const totalHours = totalMinutes / 60;
    const overheadMinutes = totalMinutes - (flightHours * 60);
    const overheadPct = (overheadMinutes / totalMinutes) * 100;
    return {
      primary: { label: "Total Door-to-Door Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Flight Time", value: formatNumber(flightHours) + " hours" },
        { label: "Ground/Airport Overhead", value: formatNumber(Math.round(overheadMinutes)) + " minutes" },
        { label: "Arrive at Airport Before", value: formatNumber(earlyArrival) + " min early" },
        { label: "Security Estimate", value: formatNumber(securityMin) + " min" },
        { label: "Overhead % of Total", value: formatNumber(Math.round(overheadPct)) + "%" }
      ]
    };
  }`,
  [
    { q: "How early should I arrive at the airport?", a: "Arrive 2 hours before domestic flights and 3 hours before international flights. During peak travel seasons, add an extra 30 minutes." },
    { q: "How long does baggage claim take?", a: "Bags typically appear 20 to 45 minutes after landing for domestic flights. International flights with customs can take 30 to 60 minutes total." },
    { q: "Why is door-to-door time important?", a: "For short trips, airport overhead can make driving competitive with flying. A 2-hour flight often takes 5 to 6 hours door-to-door." }
  ],
  `Total Time = Drive To + Early Arrival + Flight + Taxi + Customs + Baggage + Drive From`,
  ["flight-cost-per-mile-calculator", "travel-budget-calculator", "airport-parking-cost-calculator"]
);

add(
  "cruise-packing-list-calculator",
  "Cruise Packing List Calculator",
  "Calculate the recommended number of outfits, formal wear, and essentials to pack based on cruise length and type.",
  "Everyday",
  "everyday",
  "~",
  ["cruise packing list", "cruise packing calculator", "what to pack cruise", "cruise wardrobe"],
  [
    '{ name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 }',
    '{ name: "cruiseType", label: "Cruise Type", type: "select", options: [{ value: "1", label: "Casual (river/expedition)" }, { value: "2", label: "Contemporary (Carnival, Royal)" }, { value: "3", label: "Premium (Celebrity, Holland)" }, { value: "4", label: "Luxury (Regent, Silversea)" }], defaultValue: "2" }',
    '{ name: "portDays", label: "Port Days", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "laundryAvailable", label: "Onboard Laundry?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const nights = inputs.cruiseNights as number;
    const cruiseType = parseInt(inputs.cruiseType as string);
    const portDays = inputs.portDays as number;
    const laundry = inputs.laundryAvailable as string;
    const laundryFactor = laundry === "1" ? 0.6 : 1;
    const formalNights = cruiseType === 1 ? 0 : cruiseType === 2 ? Math.floor(nights / 4) : cruiseType === 3 ? Math.floor(nights / 3) : Math.floor(nights / 2);
    const casualOutfits = Math.ceil((nights - formalNights) * laundryFactor);
    const formalOutfits = Math.ceil(formalNights * laundryFactor);
    const swimsuits = Math.min(Math.ceil(nights / 3), 4);
    const shoreOutfits = Math.min(portDays, casualOutfits);
    const totalOutfits = casualOutfits + formalOutfits;
    const estimatedWeight = totalOutfits * 1.5 + swimsuits * 0.5 + 5;
    return {
      primary: { label: "Total Outfits Needed", value: formatNumber(totalOutfits) },
      details: [
        { label: "Casual/Smart Casual", value: formatNumber(casualOutfits) },
        { label: "Formal/Dressy", value: formatNumber(formalOutfits) },
        { label: "Formal Nights", value: formatNumber(formalNights) },
        { label: "Swimsuits", value: formatNumber(swimsuits) },
        { label: "Shore Excursion Outfits", value: formatNumber(shoreOutfits) },
        { label: "Est. Clothing Weight", value: formatNumber(Math.round(estimatedWeight * 10) / 10) + " lb" }
      ]
    };
  }`,
  [
    { q: "How many outfits do I need for a 7-day cruise?", a: "For a 7-night cruise, plan for 5 to 6 casual outfits, 1 to 2 formal outfits, 2 to 3 swimsuits, and shore excursion clothes. Mix and match to pack lighter." },
    { q: "What are formal nights on a cruise?", a: "Formal nights typically occur once per 3 to 4 cruise nights. Men wear suits or tuxedos, women wear cocktail dresses or evening gowns. Contemporary lines are more relaxed." },
    { q: "How can I pack lighter for a cruise?", a: "Choose a color-coordinated wardrobe, use mix-and-match pieces, take advantage of onboard laundry, and remember that casual dining options do not require dressy clothes." }
  ],
  `Formal Nights = Cruise Nights / Formality Factor
Total Outfits = Casual + Formal (adjusted for laundry)`,
  ["cruise-cabin-cost-comparison-calculator", "luggage-weight-converter-calculator", "travel-budget-calculator"]
);
add(
  "uv-protection-factor-calculator",
  "UV Protection Factor Calculator",
  "Calculate how long sunscreen protects you from UV radiation based on SPF, skin type, and UV index for safe sun exposure.",
  "Health",
  "health",
  "H",
  ["uv protection", "spf calculator", "sunscreen", "uv index", "sun exposure time"],
  [
    '{ name: "spf", label: "Sunscreen SPF", type: "select", options: [{ value: "15", label: "SPF 15" }, { value: "30", label: "SPF 30" }, { value: "50", label: "SPF 50" }, { value: "70", label: "SPF 70" }, { value: "100", label: "SPF 100" }], defaultValue: "30" }',
    '{ name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{ value: "1", label: "Type I - Very Fair" }, { value: "2", label: "Type II - Fair" }, { value: "3", label: "Type III - Medium" }, { value: "4", label: "Type IV - Olive" }, { value: "5", label: "Type V - Brown" }, { value: "6", label: "Type VI - Dark" }], defaultValue: "2" }',
    '{ name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const spf = inputs.spf as number;
    const skinType = inputs.skinType as number;
    const uvIndex = inputs.uvIndex as number;
    const baseTimes = [5, 10, 15, 25, 35, 45];
    const baseMinutes = baseTimes[skinType - 1] || 10;
    const uvAdjust = 10 / uvIndex;
    const protectedMinutes = baseMinutes * spf * uvAdjust;
    const hours = Math.floor(protectedMinutes / 60);
    const mins = Math.round(protectedMinutes % 60);
    const reapplyMinutes = Math.min(protectedMinutes * 0.8, 120);
    const uvBlocked = ((spf - 1) / spf) * 100;
    return {
      primary: { label: "Protected Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Total Protected Minutes", value: formatNumber(Math.round(protectedMinutes)) + " min" },
        { label: "UV Radiation Blocked", value: formatNumber(Math.round(uvBlocked * 10) / 10) + "%" },
        { label: "Recommended Reapply After", value: formatNumber(Math.round(reapplyMinutes)) + " min" },
        { label: "Base Burn Time (No SPF)", value: formatNumber(Math.round(baseMinutes * uvAdjust)) + " min" }
      ]
    };
  }`,
  [
    "Q: How does SPF protect against UV radiation?||A: SPF (Sun Protection Factor) indicates how much longer you can stay in the sun before burning compared to unprotected skin. SPF 30 allows roughly 30 times your natural burn time.",
    "Q: Does higher SPF mean proportionally more protection?||A: No. SPF 30 blocks about 97% of UVB rays while SPF 50 blocks about 98%. The difference diminishes as SPF increases.",
    "Q: How often should I reapply sunscreen?||A: Dermatologists recommend reapplying every 2 hours regardless of SPF, and immediately after swimming or sweating."
  ],
  `Protected Time = Base Burn Time x SPF x (10 / UV Index)\nUV Blocked % = ((SPF - 1) / SPF) x 100`,
  ["wind-chill-calculator", "heat-index-calculator", "solar-panel-savings-calculator"]
);

add(
  "rainfall-collection-calculator",
  "Rainfall Collection Calculator",
  "Estimate how much rainwater you can collect from your roof based on catchment area, local rainfall, and collection efficiency.",
  "Science",
  "science",
  "A",
  ["rainfall collection", "rainwater collection", "roof catchment", "water harvesting", "rain barrel"],
  [
    '{ name: "roofArea", label: "Roof Catchment Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 1500 }',
    '{ name: "annualRainfall", label: "Annual Rainfall (inches)", type: "number", min: 1, max: 120, defaultValue: 36 }',
    '{ name: "efficiency", label: "Collection Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 80 }'
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const annualRainfall = inputs.annualRainfall as number;
    const efficiency = inputs.efficiency as number;
    const gallonsPerInchPerSqFt = 0.623;
    const totalGallons = roofArea * annualRainfall * gallonsPerInchPerSqFt * (efficiency / 100);
    const monthlyGallons = totalGallons / 12;
    const liters = totalGallons * 3.785;
    const avgHouseholdDaily = 80;
    const daysSupply = totalGallons / avgHouseholdDaily;
    return {
      primary: { label: "Annual Collection", value: formatNumber(Math.round(totalGallons)) + " gallons" },
      details: [
        { label: "Monthly Average", value: formatNumber(Math.round(monthlyGallons)) + " gallons" },
        { label: "Annual Collection (Liters)", value: formatNumber(Math.round(liters)) + " L" },
        { label: "Days of Household Supply", value: formatNumber(Math.round(daysSupply)) + " days" },
        { label: "Efficiency Loss", value: formatNumber(Math.round(totalGallons / (efficiency / 100) - totalGallons)) + " gallons" }
      ]
    };
  }`,
  [
    "Q: How much water can I collect from my roof?||A: A 1,000 sq ft roof receiving 1 inch of rain can yield roughly 623 gallons. Actual collection depends on roof material and gutter efficiency.",
    "Q: What is a good collection efficiency?||A: Most residential systems achieve 75-85% efficiency. Metal roofs perform better than asphalt shingles.",
    "Q: Can collected rainwater be used for drinking?||A: Rainwater can be potable with proper filtration and treatment, but many people use it for irrigation, toilet flushing, and laundry."
  ],
  `Annual Gallons = Roof Area x Annual Rainfall x 0.623 x (Efficiency / 100)\nMonthly = Annual / 12`,
  ["rainwater-harvesting-calculator", "solar-panel-savings-calculator", "carbon-footprint-calculator"]
);

add(
  "solar-panel-payback-calculator",
  "Solar Panel Payback Calculator",
  "Calculate the break-even timeline for solar panel installation based on system cost, energy production, electricity rates, and incentives.",
  "Finance",
  "finance",
  "$",
  ["solar payback", "solar roi", "solar panel break even", "solar investment", "solar energy savings"],
  [
    '{ name: "systemCost", label: "Total System Cost ($)", type: "number", min: 1000, max: 100000, defaultValue: 20000 }',
    '{ name: "annualProduction", label: "Annual Production (kWh)", type: "number", min: 500, max: 30000, defaultValue: 8000 }',
    '{ name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.50, defaultValue: 0.13 }',
    '{ name: "incentivePercent", label: "Tax Credit / Incentive (%)", type: "number", min: 0, max: 50, defaultValue: 30 }'
  ],
  `(inputs) => {
    const systemCost = inputs.systemCost as number;
    const annualProduction = inputs.annualProduction as number;
    const electricityRate = inputs.electricityRate as number;
    const incentivePercent = inputs.incentivePercent as number;
    const netCost = systemCost * (1 - incentivePercent / 100);
    const annualSavings = annualProduction * electricityRate;
    const paybackYears = netCost / annualSavings;
    const twentyYearSavings = annualSavings * 20 - netCost;
    const roi = (twentyYearSavings / netCost) * 100;
    const monthlySavings = annualSavings / 12;
    return {
      primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
      details: [
        { label: "Net System Cost (After Incentives)", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "20-Year Net Savings", value: "$" + formatNumber(Math.round(twentyYearSavings)) },
        { label: "20-Year ROI", value: formatNumber(Math.round(roi)) + "%" }
      ]
    };
  }`,
  [
    "Q: How long does it take for solar panels to pay for themselves?||A: Most residential solar systems pay for themselves in 6-12 years depending on location, electricity rates, and incentives.",
    "Q: What is the federal solar tax credit?||A: The US federal Investment Tax Credit (ITC) allows homeowners to deduct 30% of the cost of a solar system from their federal taxes.",
    "Q: Do solar panels increase home value?||A: Studies show solar panels increase home value by an average of 3-4%, often exceeding the cost of the system."
  ],
  `Net Cost = System Cost x (1 - Incentive%)\nPayback Years = Net Cost / (Annual kWh x Rate)\n20-Year Savings = (Annual Savings x 20) - Net Cost`,
  ["solar-panel-savings-calculator", "carbon-footprint-calculator", "rainfall-collection-calculator"]
);

add(
  "carbon-footprint-offset-calculator",
  "Carbon Footprint Offset Calculator",
  "Calculate the number of trees or carbon credits needed to offset your annual carbon footprint from driving, flights, and home energy.",
  "Science",
  "science",
  "A",
  ["carbon offset", "carbon neutrality", "tree planting", "carbon credits", "emissions offset"],
  [
    '{ name: "drivingMiles", label: "Annual Driving Miles", type: "number", min: 0, max: 100000, defaultValue: 12000 }',
    '{ name: "flightHours", label: "Annual Flight Hours", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "homeKwh", label: "Monthly Home Electricity (kWh)", type: "number", min: 0, max: 5000, defaultValue: 900 }',
    '{ name: "creditCost", label: "Carbon Credit Cost ($/ton)", type: "number", min: 5, max: 100, defaultValue: 15 }'
  ],
  `(inputs) => {
    const drivingMiles = inputs.drivingMiles as number;
    const flightHours = inputs.flightHours as number;
    const homeKwh = inputs.homeKwh as number;
    const creditCost = inputs.creditCost as number;
    const drivingCO2 = drivingMiles * 0.000404;
    const flightCO2 = flightHours * 0.255;
    const homeCO2 = homeKwh * 12 * 0.000417;
    const totalCO2 = drivingCO2 + flightCO2 + homeCO2;
    const treesNeeded = Math.ceil(totalCO2 / 0.022);
    const creditsCost = totalCO2 * creditCost;
    return {
      primary: { label: "Total Annual CO2", value: formatNumber(Math.round(totalCO2 * 100) / 100) + " metric tons" },
      details: [
        { label: "Driving Emissions", value: formatNumber(Math.round(drivingCO2 * 100) / 100) + " tons" },
        { label: "Flight Emissions", value: formatNumber(Math.round(flightCO2 * 100) / 100) + " tons" },
        { label: "Home Energy Emissions", value: formatNumber(Math.round(homeCO2 * 100) / 100) + " tons" },
        { label: "Trees Needed to Offset", value: formatNumber(treesNeeded) + " trees" },
        { label: "Carbon Credit Cost", value: "$" + formatNumber(Math.round(creditsCost)) }
      ]
    };
  }`,
  [
    "Q: How much CO2 does one tree absorb per year?||A: A mature tree absorbs approximately 22 kg (48 lbs) of CO2 per year, though this varies by species and growing conditions.",
    "Q: What is a carbon credit?||A: A carbon credit represents one metric ton of CO2 removed from or prevented from entering the atmosphere, traded on voluntary and compliance markets.",
    "Q: What is the average American carbon footprint?||A: The average American produces approximately 16 metric tons of CO2 per year, well above the global average of about 4 tons."
  ],
  `Driving CO2 = Miles x 0.000404 tons/mile\nFlight CO2 = Hours x 0.255 tons/hour\nHome CO2 = kWh x 12 x 0.000417 tons/kWh\nTrees = Total CO2 / 0.022`,
  ["carbon-footprint-calculator", "tree-carbon-calculator", "solar-panel-payback-calculator"]
);

add(
  "recycling-savings-calculator",
  "Recycling Savings Calculator",
  "Estimate the environmental and financial savings from recycling paper, plastic, glass, and aluminum compared to landfill disposal.",
  "Science",
  "science",
  "A",
  ["recycling savings", "recycling calculator", "waste diversion", "recycling benefits", "landfill reduction"],
  [
    '{ name: "paperLbs", label: "Paper Recycled (lbs/month)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "plasticLbs", label: "Plastic Recycled (lbs/month)", type: "number", min: 0, max: 200, defaultValue: 8 }',
    '{ name: "glassLbs", label: "Glass Recycled (lbs/month)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "aluminumLbs", label: "Aluminum Recycled (lbs/month)", type: "number", min: 0, max: 100, defaultValue: 4 }'
  ],
  `(inputs) => {
    const paperLbs = inputs.paperLbs as number;
    const plasticLbs = inputs.plasticLbs as number;
    const glassLbs = inputs.glassLbs as number;
    const aluminumLbs = inputs.aluminumLbs as number;
    const co2Paper = paperLbs * 12 * 1.17;
    const co2Plastic = plasticLbs * 12 * 1.5;
    const co2Glass = glassLbs * 12 * 0.31;
    const co2Aluminum = aluminumLbs * 12 * 8.14;
    const totalCO2Lbs = co2Paper + co2Plastic + co2Glass + co2Aluminum;
    const totalCO2Tons = totalCO2Lbs / 2204.6;
    const energySaved = paperLbs * 12 * 4100 + plasticLbs * 12 * 5774 + glassLbs * 12 * 42 + aluminumLbs * 12 * 14000;
    const energySavedKwh = energySaved / 3412;
    const landfillSaved = (paperLbs + plasticLbs + glassLbs + aluminumLbs) * 12;
    return {
      primary: { label: "Annual CO2 Saved", value: formatNumber(Math.round(totalCO2Tons * 100) / 100) + " tons" },
      details: [
        { label: "Total CO2 Saved", value: formatNumber(Math.round(totalCO2Lbs)) + " lbs" },
        { label: "Energy Saved", value: formatNumber(Math.round(energySavedKwh)) + " kWh" },
        { label: "Landfill Waste Avoided", value: formatNumber(landfillSaved) + " lbs/year" },
        { label: "Equivalent Trees Planted", value: formatNumber(Math.round(totalCO2Tons / 0.022)) }
      ]
    };
  }`,
  [
    "Q: How much CO2 does recycling one ton of paper save?||A: Recycling one ton of paper saves approximately 1.17 tons of CO2 compared to manufacturing from virgin pulp.",
    "Q: Which material saves the most energy when recycled?||A: Aluminum recycling saves up to 95% of the energy needed to produce new aluminum from raw bauxite ore.",
    "Q: What percentage of waste is recyclable?||A: Approximately 75% of waste is recyclable, but only about 30% is actually recycled in the United States."
  ],
  `CO2 Saved = (Paper x 1.17) + (Plastic x 1.5) + (Glass x 0.31) + (Aluminum x 8.14) lbs/lb\nAnnual = Monthly x 12`,
  ["carbon-footprint-offset-calculator", "carbon-footprint-calculator", "recycling-impact"]
);

add(
  "rainwater-tank-size-calculator",
  "Rainwater Tank Size Calculator",
  "Determine the optimal rainwater storage tank size based on roof area, rainfall patterns, and daily water usage requirements.",
  "Everyday",
  "everyday",
  "~",
  ["rainwater tank", "water tank sizing", "cistern calculator", "rain storage", "water storage tank"],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 2000 }',
    '{ name: "monthlyRainfall", label: "Average Monthly Rainfall (inches)", type: "number", min: 0.5, max: 15, defaultValue: 3 }',
    '{ name: "dailyUsage", label: "Daily Water Usage (gallons)", type: "number", min: 1, max: 200, defaultValue: 50 }',
    '{ name: "dryDays", label: "Longest Dry Spell (days)", type: "number", min: 1, max: 120, defaultValue: 30 }'
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const monthlyRainfall = inputs.monthlyRainfall as number;
    const dailyUsage = inputs.dailyUsage as number;
    const dryDays = inputs.dryDays as number;
    const monthlyCollection = roofArea * monthlyRainfall * 0.623 * 0.8;
    const dailyCollection = monthlyCollection / 30;
    const reserveNeeded = dailyUsage * dryDays;
    const recommendedTank = Math.ceil(reserveNeeded / 50) * 50;
    const surplusDeficit = dailyCollection - dailyUsage;
    const daysAutonomy = recommendedTank / dailyUsage;
    return {
      primary: { label: "Recommended Tank Size", value: formatNumber(recommendedTank) + " gallons" },
      details: [
        { label: "Daily Collection Potential", value: formatNumber(Math.round(dailyCollection)) + " gallons" },
        { label: "Daily Usage", value: formatNumber(dailyUsage) + " gallons" },
        { label: "Daily Surplus/Deficit", value: formatNumber(Math.round(surplusDeficit)) + " gallons" },
        { label: "Reserve for Dry Spell", value: formatNumber(reserveNeeded) + " gallons" },
        { label: "Days of Autonomy", value: formatNumber(Math.round(daysAutonomy)) + " days" }
      ]
    };
  }`,
  [
    "Q: How do I choose the right rainwater tank size?||A: Consider your daily water usage, the length of dry spells in your area, and your roof catchment area. A tank should hold enough water for your longest expected dry period.",
    "Q: What shapes are available for rainwater tanks?||A: Tanks come in round, slimline, and underground options. Slimline tanks fit against walls while round tanks are more cost-effective per gallon.",
    "Q: Do I need a pump for a rainwater tank?||A: If the tank is elevated, gravity can feed water. Otherwise, a small pump is needed for pressurized applications like irrigation or household use."
  ],
  `Monthly Collection = Roof Area x Rainfall x 0.623 x 0.8\nReserve = Daily Usage x Dry Days\nRecommended Tank = Reserve rounded up to nearest 50 gallons`,
  ["rainfall-collection-calculator", "rainwater-harvesting-calculator", "solar-panel-payback-calculator"]
);

add(
  "air-quality-health-impact-calculator",
  "Air Quality Health Impact Calculator",
  "Assess the health impact of air pollution levels based on AQI, exposure duration, and activity level for respiratory risk awareness.",
  "Health",
  "health",
  "H",
  ["air quality", "aqi calculator", "pollution health", "respiratory risk", "air pollution index"],
  [
    '{ name: "aqi", label: "Air Quality Index (AQI)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "exposureHours", label: "Daily Outdoor Exposure (hours)", type: "number", min: 0, max: 24, defaultValue: 3 }',
    '{ name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Light (walking)" }, { value: "2", label: "Moderate (jogging)" }, { value: "3", label: "Heavy (running/sports)" }], defaultValue: "1" }',
    '{ name: "sensitive", label: "Sensitive Group", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (asthma, elderly, children)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const aqi = inputs.aqi as number;
    const exposureHours = inputs.exposureHours as number;
    const activityLevel = inputs.activityLevel as number;
    const sensitive = inputs.sensitive as number;
    const breathingMultiplier = [1, 2.5, 5][activityLevel - 1];
    const sensitiveMultiplier = sensitive === 1 ? 1.5 : 1;
    const effectiveDose = aqi * (exposureHours / 24) * breathingMultiplier * sensitiveMultiplier;
    let riskLevel = "Low";
    let recommendation = "Normal outdoor activity is safe";
    if (effectiveDose > 300) { riskLevel = "Very High"; recommendation = "Avoid all outdoor exertion"; }
    else if (effectiveDose > 150) { riskLevel = "High"; recommendation = "Reduce prolonged outdoor exertion"; }
    else if (effectiveDose > 75) { riskLevel = "Moderate"; recommendation = "Sensitive groups should limit outdoor exertion"; }
    else if (effectiveDose > 35) { riskLevel = "Low-Moderate"; recommendation = "Unusually sensitive people should reduce outdoor activity"; }
    const annualExposure = effectiveDose * 365;
    return {
      primary: { label: "Risk Level", value: riskLevel },
      details: [
        { label: "Effective Daily Dose", value: formatNumber(Math.round(effectiveDose)) + " AQI-hours" },
        { label: "Annualized Exposure", value: formatNumber(Math.round(annualExposure)) + " AQI-hours/year" },
        { label: "Breathing Rate Multiplier", value: formatNumber(breathingMultiplier) + "x" },
        { label: "Recommendation", value: recommendation }
      ]
    };
  }`,
  [
    "Q: What is AQI and what do the numbers mean?||A: AQI (Air Quality Index) ranges from 0-500. 0-50 is good, 51-100 moderate, 101-150 unhealthy for sensitive groups, 151-200 unhealthy, 201-300 very unhealthy, 301+ hazardous.",
    "Q: Who is in a sensitive group for air quality?||A: Sensitive groups include children, older adults, people with asthma or lung disease, and people with heart disease.",
    "Q: Does exercise increase pollution exposure?||A: Yes, heavy exercise can increase your breathing rate 5-10 times compared to rest, proportionally increasing the amount of pollutants inhaled."
  ],
  `Effective Dose = AQI x (Hours / 24) x Activity Multiplier x Sensitivity Multiplier\nRisk thresholds: Low (<35), Moderate (35-75), High (75-150), Very High (>150)`,
  ["uv-protection-factor-calculator", "heat-index-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "deforestation-impact-calculator",
  "Deforestation Impact Calculator",
  "Estimate the environmental impact of deforestation including lost carbon sequestration, biodiversity loss, and water cycle disruption.",
  "Science",
  "science",
  "A",
  ["deforestation", "forest loss", "carbon sequestration loss", "biodiversity impact", "tree loss calculator"],
  [
    '{ name: "hectares", label: "Area Deforested (hectares)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "forestType", label: "Forest Type", type: "select", options: [{ value: "1", label: "Tropical Rainforest" }, { value: "2", label: "Temperate Forest" }, { value: "3", label: "Boreal Forest" }, { value: "4", label: "Mangrove" }], defaultValue: "1" }',
    '{ name: "yearsLost", label: "Forest Age (years)", type: "number", min: 10, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const hectares = inputs.hectares as number;
    const forestType = inputs.forestType as number;
    const yearsLost = inputs.yearsLost as number;
    const carbonPerHectare = [180, 120, 90, 220][forestType - 1];
    const speciesPerHectare = [400, 150, 60, 300][forestType - 1];
    const waterRetentionLiters = [8000000, 5000000, 4000000, 12000000][forestType - 1];
    const carbonReleased = hectares * carbonPerHectare;
    const speciesAffected = Math.round(hectares * speciesPerHectare * 0.01);
    const waterLoss = hectares * waterRetentionLiters;
    const waterLossMillionLiters = waterLoss / 1000000;
    const treesLost = hectares * 400;
    const yearsToRecover = yearsLost * 1.5;
    return {
      primary: { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " metric tons CO2" },
      details: [
        { label: "Trees Destroyed", value: formatNumber(treesLost) },
        { label: "Species Potentially Affected", value: formatNumber(speciesAffected) },
        { label: "Water Retention Lost", value: formatNumber(Math.round(waterLossMillionLiters)) + " million liters" },
        { label: "Estimated Recovery Time", value: formatNumber(Math.round(yearsToRecover)) + " years" }
      ]
    };
  }`,
  [
    "Q: How much CO2 does deforestation release?||A: Deforestation accounts for approximately 10% of global CO2 emissions. A single hectare of tropical forest stores about 180 metric tons of carbon.",
    "Q: Can deforested areas recover?||A: Secondary forests can regrow, but it takes 100-200 years to approach the biodiversity and carbon storage of old-growth forest.",
    "Q: Which forests store the most carbon?||A: Mangrove forests store the most carbon per hectare, followed by tropical rainforests, temperate forests, and boreal forests."
  ],
  `Carbon Released = Hectares x Carbon per Hectare\nSpecies Affected = Hectares x Species Density x 0.01\nRecovery Time = Forest Age x 1.5`,
  ["carbon-footprint-offset-calculator", "tree-carbon-calculator", "soil-erosion-rate-calculator"]
);

add(
  "ocean-acidification-calculator",
  "Ocean Acidification Calculator",
  "Model the impact of CO2 absorption on ocean pH levels and the effects on marine ecosystems based on emissions scenarios.",
  "Science",
  "science",
  "A",
  ["ocean acidification", "ocean pH", "marine impact", "co2 ocean absorption", "coral reef impact"],
  [
    '{ name: "co2ppm", label: "Atmospheric CO2 (ppm)", type: "number", min: 280, max: 1000, defaultValue: 420 }',
    '{ name: "yearsProjected", label: "Years to Project", type: "number", min: 1, max: 200, defaultValue: 50 }',
    '{ name: "annualIncrease", label: "Annual CO2 Increase (ppm)", type: "number", min: 0, max: 10, defaultValue: 2.5 }'
  ],
  `(inputs) => {
    const co2ppm = inputs.co2ppm as number;
    const yearsProjected = inputs.yearsProjected as number;
    const annualIncrease = inputs.annualIncrease as number;
    const preindustrialCO2 = 280;
    const preindustrialPH = 8.18;
    const futureCO2 = co2ppm + (annualIncrease * yearsProjected);
    const currentPH = preindustrialPH - 0.0576 * Math.log(co2ppm / preindustrialCO2);
    const futurePH = preindustrialPH - 0.0576 * Math.log(futureCO2 / preindustrialCO2);
    const phDrop = currentPH - futurePH;
    const coralRisk = futurePH < 7.8 ? "Critical" : futurePH < 7.95 ? "Severe" : futurePH < 8.05 ? "Moderate" : "Low";
    const acidityIncrease = (Math.pow(10, -(futurePH)) / Math.pow(10, -(preindustrialPH)) - 1) * 100;
    return {
      primary: { label: "Projected Ocean pH", value: formatNumber(Math.round(futurePH * 1000) / 1000) },
      details: [
        { label: "Current Ocean pH", value: formatNumber(Math.round(currentPH * 1000) / 1000) },
        { label: "pH Drop Over Period", value: formatNumber(Math.round(phDrop * 1000) / 1000) },
        { label: "Projected CO2 Level", value: formatNumber(Math.round(futureCO2)) + " ppm" },
        { label: "Acidity Increase vs Pre-Industrial", value: formatNumber(Math.round(acidityIncrease)) + "%" },
        { label: "Coral Reef Risk Level", value: coralRisk }
      ]
    };
  }`,
  [
    "Q: What is ocean acidification?||A: Ocean acidification is the decrease in ocean pH caused by absorption of atmospheric CO2. The ocean has absorbed about 30% of human-produced CO2, lowering pH by 0.1 since pre-industrial times.",
    "Q: How does ocean acidification affect marine life?||A: Lower pH reduces carbonate availability, making it harder for corals, shellfish, and plankton to build shells and skeletons, threatening entire marine food chains.",
    "Q: Can ocean acidification be reversed?||A: If CO2 emissions are reduced dramatically, ocean pH can slowly recover over thousands of years, but the current rate of change is 100 times faster than any natural period."
  ],
  `Ocean pH = 8.18 - 0.0576 x ln(CO2 / 280)\nFuture CO2 = Current CO2 + (Annual Increase x Years)\nAcidity Change = (10^(-future pH) / 10^(-8.18) - 1) x 100%`,
  ["carbon-footprint-offset-calculator", "deforestation-impact-calculator", "permafrost-thaw-rate-calculator"]
);

add(
  "permafrost-thaw-rate-calculator",
  "Permafrost Thaw Rate Calculator",
  "Estimate permafrost degradation and methane release based on temperature rise, soil type, and ice content for climate impact modeling.",
  "Science",
  "science",
  "A",
  ["permafrost thaw", "permafrost melting", "methane release", "arctic warming", "frozen ground"],
  [
    '{ name: "tempRise", label: "Temperature Increase Above Baseline (°C)", type: "number", min: 0.5, max: 10, defaultValue: 2 }',
    '{ name: "areaKm2", label: "Permafrost Area (km²)", type: "number", min: 1, max: 1000000, defaultValue: 1000 }',
    '{ name: "iceContent", label: "Ice Content (%)", type: "number", min: 10, max: 90, defaultValue: 50 }',
    '{ name: "years", label: "Time Period (years)", type: "number", min: 1, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const tempRise = inputs.tempRise as number;
    const areaKm2 = inputs.areaKm2 as number;
    const iceContent = inputs.iceContent as number;
    const years = inputs.years as number;
    const thawRateCmPerYear = tempRise * 3.5;
    const totalThawCm = thawRateCmPerYear * years;
    const carbonPerKm2 = 1500 * (iceContent / 100);
    const totalCarbonStored = areaKm2 * carbonPerKm2;
    const percentThawed = Math.min((totalThawCm / 300) * 100, 100);
    const carbonReleased = totalCarbonStored * (percentThawed / 100) * 0.1;
    const methaneReleased = carbonReleased * 0.023;
    const co2Equivalent = methaneReleased * 28 + carbonReleased * (1 - 0.023);
    return {
      primary: { label: "Estimated Thaw Depth", value: formatNumber(Math.round(totalThawCm)) + " cm" },
      details: [
        { label: "Thaw Rate", value: formatNumber(Math.round(thawRateCmPerYear * 10) / 10) + " cm/year" },
        { label: "Area Percent Thawed", value: formatNumber(Math.round(percentThawed)) + "%" },
        { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " tons" },
        { label: "Methane Released", value: formatNumber(Math.round(methaneReleased)) + " tons CH4" },
        { label: "CO2 Equivalent", value: formatNumber(Math.round(co2Equivalent)) + " tons CO2e" }
      ]
    };
  }`,
  [
    "Q: What is permafrost?||A: Permafrost is ground that remains frozen for at least two consecutive years. It covers about 25% of the Northern Hemisphere's land surface and stores massive amounts of organic carbon.",
    "Q: Why is permafrost thaw dangerous?||A: Thawing permafrost releases stored carbon as CO2 and methane, creating a feedback loop that accelerates warming. Methane is 28 times more potent than CO2 as a greenhouse gas.",
    "Q: How fast is permafrost thawing?||A: Arctic permafrost is warming at about 0.3-0.5°C per decade. Some regions have lost meters of permafrost depth over the past 50 years."
  ],
  `Thaw Depth = Temperature Rise x 3.5 cm/year x Years\nPercent Thawed = (Thaw Depth / 300) x 100\nCarbon Released = Stored Carbon x % Thawed x 0.1\nCO2 Equivalent = (CH4 x 28) + CO2`,
  ["ocean-acidification-calculator", "deforestation-impact-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "drought-severity-index-calculator",
  "Drought Severity Index Calculator",
  "Calculate drought severity using precipitation deficits, temperature anomalies, and soil moisture to assess agricultural and water supply risk.",
  "Science",
  "science",
  "A",
  ["drought index", "drought severity", "precipitation deficit", "water shortage", "drought monitor"],
  [
    '{ name: "actualPrecip", label: "Actual Precipitation (inches)", type: "number", min: 0, max: 50, defaultValue: 2 }',
    '{ name: "normalPrecip", label: "Normal Precipitation (inches)", type: "number", min: 0.5, max: 50, defaultValue: 4 }',
    '{ name: "tempAnomaly", label: "Temperature Above Normal (°F)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "soilMoisture", label: "Soil Moisture (%)", type: "number", min: 0, max: 100, defaultValue: 30 }'
  ],
  `(inputs) => {
    const actualPrecip = inputs.actualPrecip as number;
    const normalPrecip = inputs.normalPrecip as number;
    const tempAnomaly = inputs.tempAnomaly as number;
    const soilMoisture = inputs.soilMoisture as number;
    const precipDeficit = ((normalPrecip - actualPrecip) / normalPrecip) * 100;
    const precipIndex = precipDeficit * 0.4;
    const tempIndex = tempAnomaly * 3;
    const moistureIndex = (100 - soilMoisture) * 0.3;
    const severityScore = precipIndex + tempIndex + moistureIndex;
    let category = "D0 - Abnormally Dry";
    if (severityScore >= 80) category = "D4 - Exceptional Drought";
    else if (severityScore >= 60) category = "D3 - Extreme Drought";
    else if (severityScore >= 45) category = "D2 - Severe Drought";
    else if (severityScore >= 30) category = "D1 - Moderate Drought";
    const cropImpact = severityScore > 60 ? "Major crop losses likely" : severityScore > 40 ? "Reduced yields expected" : "Minimal crop impact";
    return {
      primary: { label: "Drought Severity", value: category },
      details: [
        { label: "Severity Score", value: formatNumber(Math.round(severityScore)) },
        { label: "Precipitation Deficit", value: formatNumber(Math.round(precipDeficit)) + "%" },
        { label: "Temperature Contribution", value: formatNumber(Math.round(tempIndex)) + " pts" },
        { label: "Soil Moisture Contribution", value: formatNumber(Math.round(moistureIndex)) + " pts" },
        { label: "Agricultural Impact", value: cropImpact }
      ]
    };
  }`,
  [
    "Q: What are the drought severity categories?||A: The US Drought Monitor uses five categories: D0 (Abnormally Dry), D1 (Moderate), D2 (Severe), D3 (Extreme), and D4 (Exceptional Drought).",
    "Q: How does temperature affect drought?||A: Higher temperatures increase evapotranspiration, pulling more moisture from soil and plants, intensifying drought conditions even without reduced rainfall.",
    "Q: What is soil moisture and why does it matter?||A: Soil moisture is the water content in soil. It directly affects plant growth, groundwater recharge, and the severity of drought impacts on agriculture."
  ],
  `Severity Score = (Precip Deficit% x 0.4) + (Temp Anomaly x 3) + ((100 - Soil Moisture%) x 0.3)\nD0 < 30, D1 30-45, D2 45-60, D3 60-80, D4 > 80`,
  ["evapotranspiration-rate-calculator", "soil-erosion-rate-calculator", "growing-degree-days-calculator"]
);

add(
  "flood-risk-assessment-calculator",
  "Flood Risk Assessment Calculator",
  "Evaluate flood risk for a property based on elevation, proximity to water, rainfall intensity, and soil drainage characteristics.",
  "Everyday",
  "everyday",
  "~",
  ["flood risk", "flood assessment", "flood zone", "flooding probability", "flood insurance"],
  [
    '{ name: "elevationFt", label: "Elevation Above Floodplain (ft)", type: "number", min: 0, max: 100, defaultValue: 8 }',
    '{ name: "distanceToWater", label: "Distance to Nearest Water Body (ft)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "rainfallIntensity", label: "Max 24hr Rainfall (inches)", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "soilDrainage", label: "Soil Drainage", type: "select", options: [{ value: "1", label: "Well-Drained (Sandy)" }, { value: "2", label: "Moderate (Loam)" }, { value: "3", label: "Poor (Clay)" }, { value: "4", label: "Very Poor (Hardpan)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const elevationFt = inputs.elevationFt as number;
    const distanceToWater = inputs.distanceToWater as number;
    const rainfallIntensity = inputs.rainfallIntensity as number;
    const soilDrainage = inputs.soilDrainage as number;
    const elevScore = Math.max(0, 100 - elevationFt * 5);
    const distScore = Math.max(0, 100 - distanceToWater * 0.02);
    const rainScore = rainfallIntensity * 8;
    const drainMultiplier = [0.5, 0.75, 1.2, 1.5][soilDrainage - 1];
    const riskScore = (elevScore * 0.35 + distScore * 0.25 + rainScore * 0.25) * drainMultiplier;
    const clampedScore = Math.min(Math.max(riskScore, 0), 100);
    let riskLevel = "Low";
    let zone = "Zone X";
    if (clampedScore >= 75) { riskLevel = "Very High"; zone = "Zone A (Special Flood Hazard)"; }
    else if (clampedScore >= 55) { riskLevel = "High"; zone = "Zone AE"; }
    else if (clampedScore >= 35) { riskLevel = "Moderate"; zone = "Zone B/X (shaded)"; }
    const annualProbability = clampedScore / 100 * 0.26;
    const insuranceEstimate = clampedScore >= 55 ? 2500 : clampedScore >= 35 ? 1200 : 500;
    return {
      primary: { label: "Flood Risk Level", value: riskLevel + " (" + formatNumber(Math.round(clampedScore)) + "/100)" },
      details: [
        { label: "Estimated FEMA Zone", value: zone },
        { label: "Annual Flood Probability", value: formatNumber(Math.round(annualProbability * 1000) / 10) + "%" },
        { label: "Elevation Risk Score", value: formatNumber(Math.round(elevScore)) + "/100" },
        { label: "Estimated Annual Insurance", value: "$" + formatNumber(insuranceEstimate) }
      ]
    };
  }`,
  [
    "Q: What are FEMA flood zones?||A: FEMA flood zones range from Zone A (high risk, 1% annual flood chance) to Zone X (low risk). Zones determine insurance requirements and building codes.",
    "Q: Is flood insurance required?||A: Federally-backed mortgages in Special Flood Hazard Areas (Zones A and V) require flood insurance. It is optional but recommended elsewhere.",
    "Q: What factors increase flood risk most?||A: Low elevation relative to nearby water bodies, poor soil drainage, proximity to rivers or coasts, and high rainfall intensity are the strongest predictors."
  ],
  `Risk Score = (Elevation Score x 0.35 + Distance Score x 0.25 + Rain Score x 0.25) x Drainage Multiplier\nElevation Score = max(0, 100 - Elevation x 5)`,
  ["rainfall-collection-calculator", "drought-severity-index-calculator", "hurricane-preparedness-cost-calculator"]
);

add(
  "wildfire-risk-calculator",
  "Wildfire Risk Calculator",
  "Assess wildfire risk for your property based on vegetation density, slope, distance to wildland, humidity, and wind conditions.",
  "Everyday",
  "everyday",
  "~",
  ["wildfire risk", "fire danger", "wildland fire", "fire risk assessment", "defensible space"],
  [
    '{ name: "vegetationDensity", label: "Vegetation Density", type: "select", options: [{ value: "1", label: "Sparse (desert/urban)" }, { value: "2", label: "Moderate (mixed)" }, { value: "3", label: "Dense (forest/chaparral)" }], defaultValue: "2" }',
    '{ name: "slopePercent", label: "Terrain Slope (%)", type: "number", min: 0, max: 100, defaultValue: 15 }',
    '{ name: "defensibleSpace", label: "Defensible Space (ft)", type: "number", min: 0, max: 300, defaultValue: 100 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 80, defaultValue: 15 }'
  ],
  `(inputs) => {
    const vegetationDensity = inputs.vegetationDensity as number;
    const slopePercent = inputs.slopePercent as number;
    const defensibleSpace = inputs.defensibleSpace as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const vegScore = [15, 40, 70][vegetationDensity - 1];
    const slopeScore = Math.min(slopePercent * 0.5, 30);
    const defenseReduction = Math.min(defensibleSpace / 3, 30);
    const humidityScore = Math.max(0, (50 - humidity) * 0.6);
    const windScore = windSpeed * 0.4;
    const rawRisk = vegScore + slopeScore + humidityScore + windScore - defenseReduction;
    const riskScore = Math.min(Math.max(rawRisk, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 75) riskLevel = "Extreme";
    else if (riskScore >= 55) riskLevel = "High";
    else if (riskScore >= 35) riskLevel = "Moderate";
    const fireSpreadRate = (windSpeed * 0.1 + slopePercent * 0.05) * vegetationDensity;
    const recommendedSpace = riskScore >= 55 ? 200 : riskScore >= 35 ? 100 : 50;
    return {
      primary: { label: "Wildfire Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Vegetation Risk", value: formatNumber(vegScore) + "/70" },
        { label: "Slope Risk Contribution", value: formatNumber(Math.round(slopeScore)) + "/30" },
        { label: "Defensible Space Benefit", value: "-" + formatNumber(Math.round(defenseReduction)) + " pts" },
        { label: "Est. Fire Spread Rate", value: formatNumber(Math.round(fireSpreadRate * 10) / 10) + " chains/hr" },
        { label: "Recommended Defensible Space", value: formatNumber(recommendedSpace) + " ft" }
      ]
    };
  }`,
  [
    "Q: What is defensible space?||A: Defensible space is the area around a building where vegetation is managed to reduce fire risk. Most fire agencies recommend at least 100 feet of defensible space.",
    "Q: How does slope affect wildfire?||A: Fire travels faster uphill because heat rises and preheats vegetation above. A fire on a 30% slope can spread twice as fast as on flat ground.",
    "Q: What are the most fire-resistant building materials?||A: Metal roofing, stucco walls, tempered glass windows, and fiber cement siding are among the most fire-resistant residential materials."
  ],
  `Risk Score = Vegetation Score + Slope Score + Humidity Score + Wind Score - Defensible Space Reduction\nFire Spread = (Wind x 0.1 + Slope x 0.05) x Vegetation Density`,
  ["wildfire-prep-calculator", "wind-chill-calculator", "drought-severity-index-calculator"]
);

add(
  "tornado-safety-distance-calculator",
  "Tornado Safety Distance Calculator",
  "Calculate a safe distance from a tornado based on estimated size, wind speed, and projectile risk for emergency decision-making.",
  "Science",
  "science",
  "A",
  ["tornado distance", "tornado safety", "tornado wind speed", "fujita scale", "tornado shelter"],
  [
    '{ name: "efRating", label: "Enhanced Fujita Rating", type: "select", options: [{ value: "0", label: "EF0 (65-85 mph)" }, { value: "1", label: "EF1 (86-110 mph)" }, { value: "2", label: "EF2 (111-135 mph)" }, { value: "3", label: "EF3 (136-165 mph)" }, { value: "4", label: "EF4 (166-200 mph)" }, { value: "5", label: "EF5 (200+ mph)" }], defaultValue: "2" }',
    '{ name: "tornadoWidth", label: "Estimated Width (yards)", type: "number", min: 10, max: 3000, defaultValue: 300 }',
    '{ name: "movingSpeed", label: "Tornado Speed (mph)", type: "number", min: 5, max: 70, defaultValue: 30 }',
    '{ name: "timeToShelter", label: "Time to Reach Shelter (minutes)", type: "number", min: 1, max: 60, defaultValue: 10 }'
  ],
  `(inputs) => {
    const efRating = inputs.efRating as number;
    const tornadoWidth = inputs.tornadoWidth as number;
    const movingSpeed = inputs.movingSpeed as number;
    const timeToShelter = inputs.timeToShelter as number;
    const maxWinds = [85, 110, 135, 165, 200, 250][efRating];
    const debrisRadius = tornadoWidth * (1 + efRating * 0.5);
    const safeDistanceMiles = (movingSpeed * timeToShelter / 60) + (debrisRadius / 1760) + 0.5;
    const safeDistanceFt = safeDistanceMiles * 5280;
    const warningTimeMin = (safeDistanceMiles / movingSpeed) * 60;
    let shelterAdvice = "Interior room on lowest floor";
    if (efRating >= 4) shelterAdvice = "Underground shelter or safe room required";
    else if (efRating >= 2) shelterAdvice = "Basement or reinforced interior room";
    return {
      primary: { label: "Minimum Safe Distance", value: formatNumber(Math.round(safeDistanceMiles * 10) / 10) + " miles" },
      details: [
        { label: "Safe Distance (feet)", value: formatNumber(Math.round(safeDistanceFt)) + " ft" },
        { label: "Max Wind Speed", value: formatNumber(maxWinds) + " mph" },
        { label: "Debris Throw Radius", value: formatNumber(Math.round(debrisRadius)) + " yards" },
        { label: "Warning Time Needed", value: formatNumber(Math.round(warningTimeMin)) + " min" },
        { label: "Shelter Recommendation", value: shelterAdvice }
      ]
    };
  }`,
  [
    "Q: What is the Enhanced Fujita Scale?||A: The EF Scale rates tornadoes from EF0 (weakest, 65-85 mph) to EF5 (most violent, 200+ mph) based on observed damage and estimated wind speeds.",
    "Q: How far can tornado debris be thrown?||A: Strong tornadoes (EF3+) can loft debris miles from the tornado. Personal items have been found over 200 miles from their origin.",
    "Q: What is the safest place during a tornado?||A: An underground shelter or basement offers the best protection. Without one, an interior room on the lowest floor away from windows is recommended."
  ],
  `Safe Distance = (Speed x Time / 60) + (Debris Radius / 1760) + 0.5 miles\nDebris Radius = Width x (1 + EF Rating x 0.5)`,
  ["wind-chill-calculator", "hurricane-preparedness-cost-calculator", "wildfire-risk-calculator"]
);

add(
  "hurricane-preparedness-cost-calculator",
  "Hurricane Preparedness Cost Calculator",
  "Estimate the cost of hurricane preparation including shutters, supplies, generator, and evacuation expenses by storm category.",
  "Finance",
  "finance",
  "$",
  ["hurricane cost", "hurricane preparedness", "storm preparation", "hurricane supplies", "evacuation cost"],
  [
    '{ name: "category", label: "Hurricane Category", type: "select", options: [{ value: "1", label: "Category 1 (74-95 mph)" }, { value: "2", label: "Category 2 (96-110 mph)" }, { value: "3", label: "Category 3 (111-129 mph)" }, { value: "4", label: "Category 4 (130-156 mph)" }, { value: "5", label: "Category 5 (157+ mph)" }], defaultValue: "2" }',
    '{ name: "homeSize", label: "Home Size (sq ft)", type: "number", min: 500, max: 10000, defaultValue: 1800 }',
    '{ name: "householdSize", label: "Household Members", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "hasGenerator", label: "Own a Generator", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const category = inputs.category as number;
    const homeSize = inputs.homeSize as number;
    const householdSize = inputs.householdSize as number;
    const hasGenerator = inputs.hasGenerator as number;
    const shutterCost = homeSize * [0.5, 1.0, 2.0, 3.5, 5.0][category - 1];
    const suppliesCost = householdSize * [75, 120, 200, 300, 400][category - 1];
    const generatorCost = hasGenerator === 1 ? 0 : (category >= 3 ? 2500 : category >= 2 ? 1500 : 0);
    const fuelCost = category * 75;
    const evacuationCost = category >= 3 ? householdSize * 250 : 0;
    const totalCost = shutterCost + suppliesCost + generatorCost + fuelCost + evacuationCost;
    const daysPrep = [1, 2, 3, 5, 7][category - 1];
    return {
      primary: { label: "Total Preparation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Storm Shutters/Protection", value: "$" + formatNumber(Math.round(shutterCost)) },
        { label: "Emergency Supplies", value: "$" + formatNumber(Math.round(suppliesCost)) },
        { label: "Generator", value: hasGenerator === 1 ? "Already owned" : "$" + formatNumber(generatorCost) },
        { label: "Fuel Costs", value: "$" + formatNumber(fuelCost) },
        { label: "Evacuation Costs", value: evacuationCost > 0 ? "$" + formatNumber(evacuationCost) : "Not needed" },
        { label: "Recommended Prep Days", value: formatNumber(daysPrep) + " days" }
      ]
    };
  }`,
  [
    "Q: What supplies do I need for a hurricane?||A: Essential supplies include water (1 gallon per person per day for 7 days), non-perishable food, medications, flashlights, batteries, first aid kit, and important documents.",
    "Q: When should I evacuate for a hurricane?||A: Evacuate when ordered by local authorities, typically for Category 3+ hurricanes in coastal areas. Leave early to avoid traffic congestion.",
    "Q: How much does a whole-house generator cost?||A: Portable generators cost $500-$2,000 while standby whole-house generators range from $2,000-$15,000 installed."
  ],
  `Total = Shutters + Supplies + Generator + Fuel + Evacuation\nShutters = Home Size x Category Multiplier\nSupplies = Household Size x Category Rate`,
  ["hurricane-prep-cost-calculator", "flood-risk-assessment-calculator", "tornado-safety-distance-calculator"]
);

add(
  "lightning-strike-probability-calculator",
  "Lightning Strike Probability Calculator",
  "Estimate the probability of a lightning strike based on location flash density, elevation, structure height, and exposure time.",
  "Science",
  "science",
  "A",
  ["lightning probability", "lightning strike", "thunderstorm risk", "lightning safety", "flash density"],
  [
    '{ name: "flashDensity", label: "Local Flash Density (strikes/km²/year)", type: "number", min: 0.1, max: 50, defaultValue: 6 }',
    '{ name: "structureHeight", label: "Structure Height (ft)", type: "number", min: 5, max: 2000, defaultValue: 30 }',
    '{ name: "structureArea", label: "Structure Footprint (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 2000 }',
    '{ name: "exposureHours", label: "Annual Outdoor Exposure (hours)", type: "number", min: 0, max: 8760, defaultValue: 500 }'
  ],
  `(inputs) => {
    const flashDensity = inputs.flashDensity as number;
    const structureHeight = inputs.structureHeight as number;
    const structureArea = inputs.structureArea as number;
    const exposureHours = inputs.exposureHours as number;
    const heightMeters = structureHeight * 0.3048;
    const areaSqM = structureArea * 0.0929;
    const effectiveArea = areaSqM + 9 * Math.PI * heightMeters * heightMeters;
    const effectiveAreaKm2 = effectiveArea / 1000000;
    const annualStrikeProbStructure = 1 - Math.exp(-flashDensity * effectiveAreaKm2);
    const personalExposureFraction = exposureHours / 8760;
    const personalBodyArea = 0.0000001;
    const personalRisk = flashDensity * personalBodyArea * personalExposureFraction;
    const yearsForFiftyPercent = Math.log(2) / Math.max(annualStrikeProbStructure, 0.0001);
    return {
      primary: { label: "Annual Structure Strike Probability", value: formatNumber(Math.round(annualStrikeProbStructure * 10000) / 100) + "%" },
      details: [
        { label: "Effective Collection Area", value: formatNumber(Math.round(effectiveArea)) + " m²" },
        { label: "Personal Annual Risk", value: "1 in " + formatNumber(Math.round(1 / Math.max(personalRisk, 0.0000001))) },
        { label: "Years for 50% Chance (Structure)", value: formatNumber(Math.round(yearsForFiftyPercent)) + " years" },
        { label: "Local Flash Density", value: formatNumber(flashDensity) + " strikes/km²/year" }
      ]
    };
  }`,
  [
    "Q: What are the odds of being struck by lightning?||A: The annual risk of being struck by lightning in the US is about 1 in 1,222,000. Over a lifetime (80 years), it rises to about 1 in 15,300.",
    "Q: What is flash density?||A: Flash density measures the number of lightning strikes per square kilometer per year. Florida has the highest in the US at 12-15 strikes/km²/year.",
    "Q: Does a lightning rod prevent strikes?||A: Lightning rods do not prevent strikes but safely conduct the electrical charge to the ground, protecting the structure from fire and damage."
  ],
  `Effective Area = Structure Area + 9π x Height²\nAnnual Probability = 1 - e^(-Flash Density x Effective Area in km²)\nPersonal Risk = Flash Density x Body Area x (Exposure Hours / 8760)`,
  ["tornado-safety-distance-calculator", "flood-risk-assessment-calculator", "lightning-rod-calculator"]
);

add(
  "snow-load-calculator",
  "Snow Load Calculator",
  "Calculate the weight of accumulated snow on a roof based on snow depth, density, roof area, and pitch for structural safety assessment.",
  "Science",
  "science",
  "A",
  ["snow load", "roof snow weight", "snow density", "structural load", "roof collapse prevention"],
  [
    '{ name: "snowDepth", label: "Snow Depth (inches)", type: "number", min: 1, max: 120, defaultValue: 18 }',
    '{ name: "snowType", label: "Snow Type", type: "select", options: [{ value: "1", label: "Fresh Powder (5 lb/ft³)" }, { value: "2", label: "Settled Snow (15 lb/ft³)" }, { value: "3", label: "Packed Snow (25 lb/ft³)" }, { value: "4", label: "Ice/Sleet (50 lb/ft³)" }], defaultValue: "2" }',
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 2000 }',
    '{ name: "roofPitch", label: "Roof Pitch (degrees)", type: "number", min: 0, max: 60, defaultValue: 25 }'
  ],
  `(inputs) => {
    const snowDepth = inputs.snowDepth as number;
    const snowType = inputs.snowType as number;
    const roofArea = inputs.roofArea as number;
    const roofPitch = inputs.roofPitch as number;
    const densityPCF = [5, 15, 25, 50][snowType - 1];
    const pitchFactor = Math.cos(roofPitch * Math.PI / 180);
    const depthFt = snowDepth / 12;
    const psfLoad = depthFt * densityPCF * pitchFactor;
    const totalWeight = psfLoad * roofArea;
    const totalTons = totalWeight / 2000;
    let riskLevel = "Safe";
    if (psfLoad >= 60) riskLevel = "Critical - Immediate Action Required";
    else if (psfLoad >= 40) riskLevel = "High - Consider Snow Removal";
    else if (psfLoad >= 25) riskLevel = "Moderate - Monitor Closely";
    const typicalRoofCapacity = 40;
    const percentCapacity = (psfLoad / typicalRoofCapacity) * 100;
    return {
      primary: { label: "Snow Load", value: formatNumber(Math.round(psfLoad * 10) / 10) + " psf" },
      details: [
        { label: "Total Weight on Roof", value: formatNumber(Math.round(totalWeight)) + " lbs (" + formatNumber(Math.round(totalTons * 10) / 10) + " tons)" },
        { label: "Snow Density", value: formatNumber(densityPCF) + " lb/ft³" },
        { label: "Pitch Reduction Factor", value: formatNumber(Math.round(pitchFactor * 100) / 100) },
        { label: "Risk Level", value: riskLevel },
        { label: "% of Typical Roof Capacity", value: formatNumber(Math.round(percentCapacity)) + "%" }
      ]
    };
  }`,
  [
    "Q: How much does snow weigh on a roof?||A: Fresh powder weighs about 5 lbs per cubic foot while packed snow can weigh 25+ lbs. One foot of packed snow on a 2,000 sq ft roof is over 50,000 lbs.",
    "Q: When should I remove snow from my roof?||A: Most residential roofs can handle 20-40 psf. Consider removal when loads approach 30 psf or if you see signs of structural stress like cracking or sagging.",
    "Q: Does roof pitch affect snow load?||A: Yes, steeper roofs shed snow more easily. Roofs above 60 degrees typically shed most snow naturally, reducing the effective load."
  ],
  `Load (psf) = (Snow Depth / 12) x Density x cos(Pitch)\nTotal Weight = Load x Roof Area\n% Capacity = Load / 40 psf x 100`,
  ["snow-load-roof-calculator", "ice-dam-prevention-calculator", "frost-depth-calculator"]
);

add(
  "ice-dam-risk-calculator",
  "Ice Dam Risk Calculator",
  "Evaluate ice dam risk on your roof based on insulation levels, attic temperature, roof slope, and outdoor conditions.",
  "Everyday",
  "everyday",
  "~",
  ["ice dam", "roof ice", "ice dam prevention", "attic insulation", "roof ventilation"],
  [
    '{ name: "atticInsulation", label: "Attic Insulation R-Value", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "outsideTemp", label: "Outside Temperature (°F)", type: "number", min: -30, max: 35, defaultValue: 20 }',
    '{ name: "roofSlope", label: "Roof Slope (degrees)", type: "number", min: 5, max: 60, defaultValue: 30 }',
    '{ name: "snowDepth", label: "Snow on Roof (inches)", type: "number", min: 1, max: 48, defaultValue: 12 }',
    '{ name: "hasVentilation", label: "Adequate Roof Ventilation", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const atticInsulation = inputs.atticInsulation as number;
    const outsideTemp = inputs.outsideTemp as number;
    const roofSlope = inputs.roofSlope as number;
    const snowDepth = inputs.snowDepth as number;
    const hasVentilation = inputs.hasVentilation as number;
    const insulationRisk = Math.max(0, 100 - atticInsulation * 2.5);
    const tempRisk = outsideTemp < 10 ? 20 : outsideTemp < 25 ? 40 : outsideTemp <= 32 ? 60 : 10;
    const snowRisk = Math.min(snowDepth * 3, 50);
    const slopeReduction = Math.min(roofSlope * 0.3, 15);
    const ventReduction = hasVentilation === 1 ? 15 : 0;
    const riskScore = Math.min(Math.max(insulationRisk * 0.35 + tempRisk * 0.25 + snowRisk * 0.25 - slopeReduction - ventReduction, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 65) riskLevel = "High";
    else if (riskScore >= 40) riskLevel = "Moderate";
    const recommendedR = 49;
    const insulationGap = Math.max(0, recommendedR - atticInsulation);
    return {
      primary: { label: "Ice Dam Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Insulation Risk Factor", value: formatNumber(Math.round(insulationRisk)) + "/100" },
        { label: "Temperature Risk Factor", value: formatNumber(tempRisk) + "/100" },
        { label: "Snow Depth Risk", value: formatNumber(Math.round(snowRisk)) + "/50" },
        { label: "Current R-Value", value: "R-" + formatNumber(atticInsulation) },
        { label: "Insulation Upgrade Needed", value: insulationGap > 0 ? "Add R-" + formatNumber(insulationGap) : "Adequate" }
      ]
    };
  }`,
  [
    "Q: What causes ice dams?||A: Ice dams form when heat escaping through the roof melts snow, which refreezes at the colder roof edge, creating a dam that traps water and can cause leaks.",
    "Q: How do I prevent ice dams?||A: The best prevention is proper attic insulation (R-49+), adequate roof ventilation, and sealing air leaks from the living space into the attic.",
    "Q: Can ice dams damage my roof?||A: Yes, ice dams can lift shingles, damage gutters, and force water under roofing materials, causing leaks, mold, and structural damage inside the home."
  ],
  `Risk = (Insulation Risk x 0.35) + (Temp Risk x 0.25) + (Snow Risk x 0.25) - Slope Reduction - Ventilation Reduction\nInsulation Risk = max(0, 100 - R-Value x 2.5)`,
  ["ice-dam-prevention-calculator", "snow-load-calculator", "frost-depth-calculator"]
);

add(
  "frost-depth-calculator",
  "Frost Depth Calculator",
  "Estimate the frost penetration depth in soil based on freezing degree days, soil type, and moisture content for foundation and pipe planning.",
  "Science",
  "science",
  "A",
  ["frost depth", "frost line", "freezing depth", "frost penetration", "footing depth"],
  [
    '{ name: "freezingDegreeDays", label: "Freezing Degree Days (°F-days)", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1", label: "Sand/Gravel" }, { value: "2", label: "Silt/Loam" }, { value: "3", label: "Clay" }, { value: "4", label: "Peat/Organic" }], defaultValue: "2" }',
    '{ name: "moistureContent", label: "Soil Moisture (%)", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "snowCover", label: "Snow Cover Depth (inches)", type: "number", min: 0, max: 48, defaultValue: 6 }'
  ],
  `(inputs) => {
    const freezingDegreeDays = inputs.freezingDegreeDays as number;
    const soilType = inputs.soilType as number;
    const moistureContent = inputs.moistureContent as number;
    const snowCover = inputs.snowCover as number;
    const thermalDiffusivity = [1.2, 0.9, 0.65, 0.5][soilType - 1];
    const moistureFactor = 1 - (moistureContent / 200);
    const snowReduction = 1 - Math.min(snowCover * 0.02, 0.6);
    const frostDepthInches = 2.4 * Math.sqrt(freezingDegreeDays * thermalDiffusivity) * moistureFactor * snowReduction;
    const frostDepthFeet = frostDepthInches / 12;
    const recommendedFooting = Math.ceil((frostDepthInches + 6) / 6) * 6;
    const pipeDepthInches = frostDepthInches + 12;
    const soilNames = ["Sand/Gravel", "Silt/Loam", "Clay", "Peat/Organic"];
    return {
      primary: { label: "Estimated Frost Depth", value: formatNumber(Math.round(frostDepthInches)) + " inches (" + formatNumber(Math.round(frostDepthFeet * 10) / 10) + " ft)" },
      details: [
        { label: "Soil Type", value: soilNames[soilType - 1] },
        { label: "Thermal Diffusivity Factor", value: formatNumber(thermalDiffusivity) },
        { label: "Snow Cover Reduction", value: formatNumber(Math.round((1 - snowReduction) * 100)) + "%" },
        { label: "Recommended Footing Depth", value: formatNumber(recommendedFooting) + " inches" },
        { label: "Recommended Pipe Depth", value: formatNumber(Math.round(pipeDepthInches)) + " inches" }
      ]
    };
  }`,
  [
    "Q: What is frost depth and why does it matter?||A: Frost depth is how deep the ground freezes in winter. Building foundations and water pipes must be placed below the frost line to prevent heaving and freezing.",
    "Q: What are freezing degree days?||A: Freezing degree days measure cumulative cold. For each day the average temperature is below 32°F, the difference is added. Example: a day averaging 22°F adds 10 FDD.",
    "Q: How does snow cover affect frost depth?||A: Snow acts as insulation, reducing frost penetration. A consistent 12-inch snow cover can reduce frost depth by 20-40% compared to bare ground."
  ],
  `Frost Depth = 2.4 x sqrt(FDD x Thermal Diffusivity) x Moisture Factor x Snow Reduction\nMoisture Factor = 1 - (Moisture% / 200)\nSnow Reduction = 1 - min(Snow x 0.02, 0.6)`,
  ["snow-load-calculator", "ice-dam-risk-calculator", "growing-degree-days-calculator"]
);

add(
  "growing-degree-days-calculator",
  "Growing Degree Days Calculator",
  "Calculate accumulated growing degree days for crop planning based on daily temperatures and base temperature for your crop type.",
  "Science",
  "science",
  "A",
  ["growing degree days", "gdd calculator", "crop heat units", "planting calculator", "agriculture degree days"],
  [
    '{ name: "avgHighTemp", label: "Average Daily High (°F)", type: "number", min: 30, max: 120, defaultValue: 78 }',
    '{ name: "avgLowTemp", label: "Average Daily Low (°F)", type: "number", min: 10, max: 90, defaultValue: 55 }',
    '{ name: "baseTemp", label: "Base Temperature (°F)", type: "number", min: 32, max: 65, defaultValue: 50 }',
    '{ name: "daysInPeriod", label: "Growing Period (days)", type: "number", min: 1, max: 365, defaultValue: 120 }'
  ],
  `(inputs) => {
    const avgHighTemp = inputs.avgHighTemp as number;
    const avgLowTemp = inputs.avgLowTemp as number;
    const baseTemp = inputs.baseTemp as number;
    const daysInPeriod = inputs.daysInPeriod as number;
    const dailyAvg = (avgHighTemp + avgLowTemp) / 2;
    const dailyGDD = Math.max(dailyAvg - baseTemp, 0);
    const totalGDD = dailyGDD * daysInPeriod;
    const cornMaturity = 2700;
    const tomatoMaturity = 1400;
    const wheatMaturity = 2000;
    const cornDays = dailyGDD > 0 ? Math.round(cornMaturity / dailyGDD) : 0;
    const tomatoDays = dailyGDD > 0 ? Math.round(tomatoMaturity / dailyGDD) : 0;
    const wheatDays = dailyGDD > 0 ? Math.round(wheatMaturity / dailyGDD) : 0;
    return {
      primary: { label: "Total GDD Accumulated", value: formatNumber(Math.round(totalGDD)) + " GDD" },
      details: [
        { label: "Daily GDD", value: formatNumber(Math.round(dailyGDD * 10) / 10) },
        { label: "Daily Average Temperature", value: formatNumber(Math.round(dailyAvg * 10) / 10) + " °F" },
        { label: "Corn Maturity (2700 GDD)", value: cornDays > 0 ? formatNumber(cornDays) + " days" : "Insufficient heat" },
        { label: "Tomato Maturity (1400 GDD)", value: tomatoDays > 0 ? formatNumber(tomatoDays) + " days" : "Insufficient heat" },
        { label: "Wheat Maturity (2000 GDD)", value: wheatDays > 0 ? formatNumber(wheatDays) + " days" : "Insufficient heat" }
      ]
    };
  }`,
  [
    "Q: What are Growing Degree Days?||A: GDD measure accumulated heat above a base temperature that drives plant growth. Each day contributes the difference between the average temperature and the base temperature (if positive).",
    "Q: What base temperature should I use?||A: Common bases are 50°F for corn, wheat, and most warm-season crops, and 40°F for cool-season crops like peas and lettuce.",
    "Q: How are GDD used in agriculture?||A: GDD help predict crop maturity dates, optimal planting windows, pest emergence, and harvest timing more accurately than calendar dates alone."
  ],
  `Daily GDD = max((High + Low) / 2 - Base Temp, 0)\nTotal GDD = Daily GDD x Number of Days\nDays to Maturity = Required GDD / Daily GDD`,
  ["drought-severity-index-calculator", "evapotranspiration-rate-calculator", "frost-depth-calculator"]
);

add(
  "evapotranspiration-rate-calculator",
  "Evapotranspiration Rate Calculator",
  "Estimate daily evapotranspiration rate for irrigation planning using temperature, humidity, wind speed, and solar radiation data.",
  "Science",
  "science",
  "A",
  ["evapotranspiration", "ET rate", "irrigation water loss", "crop water use", "water evaporation rate"],
  [
    '{ name: "avgTemp", label: "Average Temperature (°F)", type: "number", min: 32, max: 120, defaultValue: 75 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 50 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 8 }',
    '{ name: "solarHours", label: "Daily Sunshine Hours", type: "number", min: 0, max: 16, defaultValue: 10 }',
    '{ name: "cropCoeff", label: "Crop Coefficient (Kc)", type: "number", min: 0.2, max: 1.5, defaultValue: 1.0 }'
  ],
  `(inputs) => {
    const avgTemp = inputs.avgTemp as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const solarHours = inputs.solarHours as number;
    const cropCoeff = inputs.cropCoeff as number;
    const tempC = (avgTemp - 32) * 5 / 9;
    const satVaporPressure = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    const actualVaporPressure = satVaporPressure * (humidity / 100);
    const vaporDeficit = satVaporPressure - actualVaporPressure;
    const solarRadiation = solarHours * 2.5;
    const windMs = windSpeed * 0.447;
    const etRef = (0.408 * solarRadiation + 0.063 * (tempC + 273) * windMs * vaporDeficit) / (1 + 0.34 * windMs);
    const etCrop = etRef * cropCoeff;
    const inchesPerDay = etCrop / 25.4;
    const weeklyInches = inchesPerDay * 7;
    const monthlyGallonsPer1000sqft = inchesPerDay * 30 * 623;
    return {
      primary: { label: "Daily ET Rate", value: formatNumber(Math.round(inchesPerDay * 100) / 100) + " inches/day" },
      details: [
        { label: "Reference ET (ETo)", value: formatNumber(Math.round(etRef * 100) / 100) + " mm/day" },
        { label: "Crop ET (ETc)", value: formatNumber(Math.round(etCrop * 100) / 100) + " mm/day" },
        { label: "Weekly Water Need", value: formatNumber(Math.round(weeklyInches * 100) / 100) + " inches" },
        { label: "Monthly per 1000 sq ft", value: formatNumber(Math.round(monthlyGallonsPer1000sqft)) + " gallons" },
        { label: "Vapor Pressure Deficit", value: formatNumber(Math.round(vaporDeficit * 100) / 100) + " kPa" }
      ]
    };
  }`,
  [
    "Q: What is evapotranspiration?||A: Evapotranspiration (ET) is the combined water loss from soil evaporation and plant transpiration. It determines how much water crops and landscapes need.",
    "Q: What is a crop coefficient (Kc)?||A: The crop coefficient adjusts reference ET for specific crops. Typical values: turf grass 0.8, corn 1.2, vegetables 0.7-1.0, trees 0.5-0.9.",
    "Q: How does ET affect irrigation scheduling?||A: Irrigation should replace water lost to ET. If daily ET is 0.25 inches, you need 0.25 inches of irrigation or rain to maintain soil moisture."
  ],
  `ETo = (0.408 x Solar Radiation + 0.063 x (Temp+273) x Wind x VPD) / (1 + 0.34 x Wind)\nETc = ETo x Crop Coefficient\nVPD = Saturation VP - Actual VP`,
  ["growing-degree-days-calculator", "drought-severity-index-calculator", "rainfall-collection-calculator"]
);

add(
  "soil-erosion-rate-calculator",
  "Soil Erosion Rate Calculator",
  "Estimate annual soil loss using the Universal Soil Loss Equation based on rainfall, soil type, slope, cover, and conservation practices.",
  "Science",
  "science",
  "A",
  ["soil erosion", "USLE calculator", "soil loss", "erosion rate", "topsoil loss"],
  [
    '{ name: "rainfallFactor", label: "Rainfall Erosivity (R factor)", type: "number", min: 10, max: 700, defaultValue: 200 }',
    '{ name: "soilErodibility", label: "Soil Erodibility (K factor)", type: "number", min: 0.01, max: 0.70, defaultValue: 0.30 }',
    '{ name: "slopeLength", label: "Slope Length (ft)", type: "number", min: 10, max: 1000, defaultValue: 200 }',
    '{ name: "slopePercent", label: "Slope Steepness (%)", type: "number", min: 0.5, max: 50, defaultValue: 5 }',
    '{ name: "coverFactor", label: "Cover Management (C factor)", type: "number", min: 0.001, max: 1.0, defaultValue: 0.15 }'
  ],
  `(inputs) => {
    const R = inputs.rainfallFactor as number;
    const K = inputs.soilErodibility as number;
    const slopeLength = inputs.slopeLength as number;
    const slopePercent = inputs.slopePercent as number;
    const C = inputs.coverFactor as number;
    const LS = Math.pow(slopeLength / 72.6, 0.5) * (0.065 + 0.045 * slopePercent + 0.0065 * slopePercent * slopePercent);
    const P = 1.0;
    const soilLoss = R * K * LS * C * P;
    const soilLossMetric = soilLoss * 0.224;
    let toleranceLevel = "Within Tolerance";
    if (soilLoss > 10) toleranceLevel = "Severe - Immediate action needed";
    else if (soilLoss > 5) toleranceLevel = "Above Tolerance - Conservation needed";
    else if (soilLoss > 3) toleranceLevel = "Near Tolerance Limit";
    const yearsToLoseInch = soilLoss > 0 ? Math.round(150 / soilLoss) : 999;
    const percentReductionWithCover = Math.round((1 - 0.003 / C) * 100);
    return {
      primary: { label: "Annual Soil Loss", value: formatNumber(Math.round(soilLoss * 100) / 100) + " tons/acre/year" },
      details: [
        { label: "Soil Loss (metric)", value: formatNumber(Math.round(soilLossMetric * 100) / 100) + " tonnes/ha/year" },
        { label: "LS Factor (Topography)", value: formatNumber(Math.round(LS * 100) / 100) },
        { label: "Erosion Status", value: toleranceLevel },
        { label: "Years to Lose 1 Inch Topsoil", value: formatNumber(yearsToLoseInch) + " years" },
        { label: "Soil Tolerance (T value)", value: "5 tons/acre/year" }
      ]
    };
  }`,
  [
    "Q: What is the Universal Soil Loss Equation?||A: The USLE (A = R x K x LS x C x P) predicts average annual soil erosion from rainfall based on climate, soil, topography, land cover, and conservation practices.",
    "Q: What is soil tolerance (T value)?||A: The T value is the maximum rate of soil erosion that permits sustained crop production, typically 3-5 tons per acre per year for most US agricultural soils.",
    "Q: How can I reduce soil erosion?||A: Key practices include maintaining vegetative cover, contour farming, terracing, no-till agriculture, cover crops, and riparian buffer strips."
  ],
  `A = R x K x LS x C x P (Universal Soil Loss Equation)\nLS = (Length/72.6)^0.5 x (0.065 + 0.045s + 0.0065s²)\nTolerance (T) = 5 tons/acre/year`,
  ["deforestation-impact-calculator", "drought-severity-index-calculator", "evapotranspiration-rate-calculator"]
);

add(
  "compost-volume-calculator",
  "Compost Volume Calculator",
  "Calculate the right compost bin dimensions and estimate composting time based on material volume, green-to-brown ratio, and turning frequency.",
  "Everyday",
  "everyday",
  "~",
  ["compost calculator", "compost bin dimensions", "composting time", "green brown ratio", "compost pile"],
  [
    '{ name: "greenLbs", label: "Green Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "brownLbs", label: "Brown Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "turningFreq", label: "Turning Frequency", type: "select", options: [{ value: "1", label: "Weekly" }, { value: "2", label: "Bi-weekly" }, { value: "3", label: "Monthly" }, { value: "4", label: "Rarely" }], defaultValue: "2" }',
    '{ name: "weeks", label: "Collection Period (weeks)", type: "number", min: 4, max: 52, defaultValue: 12 }'
  ],
  `(inputs) => {
    const greenLbs = inputs.greenLbs as number;
    const brownLbs = inputs.brownLbs as number;
    const turningFreq = inputs.turningFreq as number;
    const weeks = inputs.weeks as number;
    const totalLbs = (greenLbs + brownLbs) * weeks;
    const volumeCuFt = totalLbs / 25;
    const ratio = brownLbs / Math.max(greenLbs, 0.1);
    const turningDays = [60, 90, 150, 240][turningFreq - 1];
    const ratioAdjust = ratio >= 2 && ratio <= 4 ? 1 : ratio < 2 ? 1.3 : 1.2;
    const compostDays = Math.round(turningDays * ratioAdjust);
    const binSideFt = Math.pow(volumeCuFt, 1 / 3);
    const roundedSide = Math.ceil(binSideFt * 2) / 2;
    const idealRatio = "2:1 to 4:1";
    let ratioStatus = "Optimal";
    if (ratio < 2) ratioStatus = "Too much green - add browns";
    else if (ratio > 4) ratioStatus = "Too much brown - add greens";
    return {
      primary: { label: "Bin Volume Needed", value: formatNumber(Math.round(volumeCuFt)) + " cubic feet" },
      details: [
        { label: "Recommended Bin Size", value: formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " ft" },
        { label: "Brown:Green Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + ":1" },
        { label: "Ratio Status", value: ratioStatus + " (ideal " + idealRatio + ")" },
        { label: "Estimated Composting Time", value: formatNumber(compostDays) + " days" },
        { label: "Total Material Weight", value: formatNumber(totalLbs) + " lbs" }
      ]
    };
  }`,
  [
    "Q: What is the ideal green-to-brown ratio for composting?||A: The ideal carbon-to-nitrogen ratio is 25-30:1, which roughly translates to 2-4 parts brown material to 1 part green material by weight.",
    "Q: How often should I turn my compost?||A: Turning weekly produces compost fastest (6-8 weeks). Bi-weekly turning takes about 3 months. Passive composting without turning can take 6-12 months.",
    "Q: What size compost bin do I need?||A: A minimum of 3x3x3 feet (27 cubic feet) is recommended for efficient composting, as smaller piles cannot generate enough heat for rapid decomposition."
  ],
  `Volume = Total Weight / 25 lbs per cu ft\nBin Side = cube root of Volume\nCompost Time = Base Days x Ratio Adjustment\nBrown:Green Ratio = Brown lbs / Green lbs`,
  ["compost-bin-size-calculator", "recycling-savings-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "wind-chill-extended-calculator",
  "Wind Chill Extended Calculator",
  "Calculate wind chill temperature with frostbite risk assessment and exposure time limits for cold weather safety planning.",
  "Science",
  "science",
  "A",
  ["wind chill extended", "frostbite risk", "cold exposure", "hypothermia risk", "windchill frostbite time"],
  [
    '{ name: "airTemp", label: "Air Temperature (°F)", type: "number", min: -60, max: 50, defaultValue: 10 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3, max: 80, defaultValue: 25 }',
    '{ name: "exposureMinutes", label: "Exposure Duration (minutes)", type: "number", min: 1, max: 480, defaultValue: 30 }',
    '{ name: "skinCovered", label: "Skin Coverage", type: "select", options: [{ value: "1", label: "Face & hands exposed" }, { value: "2", label: "Only face exposed" }, { value: "3", label: "Fully covered" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const airTemp = inputs.airTemp as number;
    const windSpeed = inputs.windSpeed as number;
    const exposureMinutes = inputs.exposureMinutes as number;
    const skinCovered = inputs.skinCovered as number;
    const windChill = 35.74 + 0.6215 * airTemp - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * airTemp * Math.pow(windSpeed, 0.16);
    const effectiveWC = Math.round(windChill);
    let frostbiteTime = "No immediate risk";
    if (effectiveWC <= -60) frostbiteTime = "Under 5 minutes";
    else if (effectiveWC <= -40) frostbiteTime = "5-10 minutes";
    else if (effectiveWC <= -20) frostbiteTime = "10-30 minutes";
    else if (effectiveWC <= 0) frostbiteTime = "30-60 minutes";
    const coverageMultiplier = [1, 1.5, 3][skinCovered - 1];
    const safeExposureBase = effectiveWC <= -40 ? 5 : effectiveWC <= -20 ? 15 : effectiveWC <= 0 ? 30 : effectiveWC <= 20 ? 60 : 120;
    const safeExposure = Math.round(safeExposureBase * coverageMultiplier);
    const exposureRisk = exposureMinutes > safeExposure ? "Exceeds safe limit" : "Within safe range";
    let dangerLevel = "Low";
    if (effectiveWC <= -40) dangerLevel = "Extreme Danger";
    else if (effectiveWC <= -20) dangerLevel = "High Danger";
    else if (effectiveWC <= 0) dangerLevel = "Moderate Danger";
    else if (effectiveWC <= 20) dangerLevel = "Low Danger";
    return {
      primary: { label: "Wind Chill Temperature", value: formatNumber(effectiveWC) + " °F" },
      details: [
        { label: "Danger Level", value: dangerLevel },
        { label: "Frostbite Risk", value: frostbiteTime },
        { label: "Safe Exposure Time", value: formatNumber(safeExposure) + " min" },
        { label: "Your Exposure", value: exposureRisk + " (" + formatNumber(exposureMinutes) + " min)" },
        { label: "Actual Air Temperature", value: formatNumber(airTemp) + " °F" }
      ]
    };
  }`,
  [
    "Q: How is wind chill calculated?||A: The NWS wind chill formula uses air temperature and wind speed: WC = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16, where T is temperature (°F) and V is wind speed (mph).",
    "Q: At what wind chill does frostbite occur?||A: Frostbite can occur in as little as 5 minutes when wind chill drops below -40°F. At -20°F wind chill, frostbite risk begins within 30 minutes on exposed skin.",
    "Q: Does wind chill affect objects like car engines?||A: No. Wind chill only affects warm-blooded creatures. Objects cool faster in wind but cannot cool below the actual air temperature."
  ],
  `Wind Chill = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16\nSafe Exposure = Base Time x Coverage Multiplier\nFrostbite risk increases rapidly below -20°F wind chill`,
  ["wind-chill-calculator", "heat-index-calculator", "frost-depth-calculator"]
);

add(
  "heat-index-activity-calculator",
  "Heat Index Activity Calculator",
  "Calculate the heat index with activity-specific safety guidelines including hydration needs, rest intervals, and heat illness risk levels.",
  "Health",
  "health",
  "H",
  ["heat index activity", "heat safety", "heat illness prevention", "hydration calculator", "heat stress"],
  [
    '{ name: "temperature", label: "Temperature (°F)", type: "number", min: 75, max: 130, defaultValue: 92 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
    '{ name: "activityType", label: "Activity Type", type: "select", options: [{ value: "1", label: "Sedentary / Office" }, { value: "2", label: "Light Exercise" }, { value: "3", label: "Moderate Exercise" }, { value: "4", label: "Heavy Labor / Sports" }], defaultValue: "3" }',
    '{ name: "duration", label: "Activity Duration (minutes)", type: "number", min: 10, max: 480, defaultValue: 60 }'
  ],
  `(inputs) => {
    const temperature = inputs.temperature as number;
    const humidity = inputs.humidity as number;
    const activityType = inputs.activityType as number;
    const duration = inputs.duration as number;
    const T = temperature;
    const R = humidity;
    const HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
    const activityMultiplier = [1, 1.2, 1.5, 2.0][activityType - 1];
    const effectiveHI = HI * activityMultiplier;
    let riskLevel = "Low";
    let hydrationOzPerHour = 8;
    let restInterval = "No additional rest needed";
    if (effectiveHI >= 175) { riskLevel = "Extreme Danger - Cancel activity"; hydrationOzPerHour = 48; restInterval = "Do not continue"; }
    else if (effectiveHI >= 145) { riskLevel = "Danger"; hydrationOzPerHour = 32; restInterval = "10 min rest every 20 min"; }
    else if (effectiveHI >= 120) { riskLevel = "Extreme Caution"; hydrationOzPerHour = 24; restInterval = "10 min rest every 30 min"; }
    else if (effectiveHI >= 100) { riskLevel = "Caution"; hydrationOzPerHour = 16; restInterval = "5 min rest every 30 min"; }
    const totalHydration = (hydrationOzPerHour * duration) / 60;
    return {
      primary: { label: "Heat Index", value: formatNumber(Math.round(HI)) + " °F" },
      details: [
        { label: "Activity-Adjusted Index", value: formatNumber(Math.round(effectiveHI)) + " °F equivalent" },
        { label: "Risk Level", value: riskLevel },
        { label: "Hydration Needed", value: formatNumber(hydrationOzPerHour) + " oz/hour" },
        { label: "Total Hydration for Session", value: formatNumber(Math.round(totalHydration)) + " oz" },
        { label: "Rest Interval", value: restInterval }
      ]
    };
  }`,
  [
    "Q: What is the heat index?||A: The heat index combines air temperature and humidity to determine the perceived temperature and risk of heat-related illness. High humidity prevents sweat evaporation, making it feel hotter.",
    "Q: How much water should I drink during exercise in heat?||A: The American College of Sports Medicine recommends 16-32 oz per hour during exercise in hot conditions, depending on intensity and conditions.",
    "Q: What are the signs of heat exhaustion?||A: Symptoms include heavy sweating, weakness, cold/pale/clammy skin, nausea, fast/weak pulse, and fainting. Move to a cool place and hydrate immediately."
  ],
  `Heat Index = -42.379 + 2.049T + 10.143R - 0.225TR - ... (Rothfusz regression)\nEffective HI = HI x Activity Multiplier\nHydration varies by risk level: 8-48 oz/hour`,
  ["heat-index-calculator", "uv-protection-factor-calculator", "wind-chill-extended-calculator"]
);
add(
  "yarn-yardage-calculator",
  "Yarn Yardage Calculator",
  "Calculate how much yarn you need for knitting or crochet projects based on project type, size, and yarn weight.",
  "Everyday",
  "everyday",
  "~",
  ["yarn yardage", "knitting yarn calculator", "crochet yarn amount", "yarn estimator"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Scarf" }, { value: "2", label: "Blanket" }, { value: "3", label: "Sweater" }, { value: "4", label: "Hat" }, { value: "5", label: "Socks" }], defaultValue: "1" }',
    '{ name: "yarnWeight", label: "Yarn Weight", type: "select", options: [{ value: "1", label: "Lace" }, { value: "2", label: "Fingering" }, { value: "3", label: "DK" }, { value: "4", label: "Worsted" }, { value: "5", label: "Bulky" }], defaultValue: "4" }',
    '{ name: "projectSize", label: "Project Size", type: "select", options: [{ value: "1", label: "Small" }, { value: "2", label: "Medium" }, { value: "3", label: "Large" }, { value: "4", label: "Extra Large" }], defaultValue: "2" }',
    '{ name: "skeinYardage", label: "Yards Per Skein", type: "number", min: 50, max: 1000, defaultValue: 220 }'
  ],
  `(inputs) => {
    const projectType = parseInt(inputs.projectType as string);
    const yarnWeight = parseInt(inputs.yarnWeight as string);
    const projectSize = parseInt(inputs.projectSize as string);
    const skeinYardage = inputs.skeinYardage as number;
    const baseYardage = { 1: 300, 2: 1200, 3: 1500, 4: 150, 5: 400 };
    const weightMultiplier = { 1: 1.6, 2: 1.3, 3: 1.0, 4: 0.85, 5: 0.65 };
    const sizeMultiplier = { 1: 0.7, 2: 1.0, 3: 1.3, 4: 1.6 };
    const base = baseYardage[projectType] || 300;
    const wMult = weightMultiplier[yarnWeight] || 1.0;
    const sMult = sizeMultiplier[projectSize] || 1.0;
    const totalYards = Math.round(base * wMult * sMult);
    const skeinsNeeded = Math.ceil(totalYards / skeinYardage);
    const totalMeters = Math.round(totalYards * 0.9144);
    return {
      primary: { label: "Total Yards Needed", value: formatNumber(totalYards) + " yds" },
      details: [
        { label: "Total Meters", value: formatNumber(totalMeters) + " m" },
        { label: "Skeins Needed", value: formatNumber(skeinsNeeded) },
        { label: "Total Skein Yardage", value: formatNumber(skeinsNeeded * skeinYardage) + " yds" }
      ]
    };
  }`,
  [
    { q: "How do I estimate yarn yardage for a project?", a: "Yardage depends on project type, size, and yarn weight. Thinner yarns generally require more yardage because they have more yards per ounce, while bulkier yarns cover more area per yard." },
    { q: "Should I buy extra yarn?", a: "Yes, it is wise to buy 10 to 15 percent more than your estimate. Dye lots can vary, so purchasing all your yarn at once ensures color consistency." },
    { q: "Does yarn weight affect how much I need?", a: "Absolutely. Lace weight yarn uses the most yardage while bulky yarn uses the least for the same project because thicker yarn covers more area per stitch." }
  ],
  `Total Yards = Base Yardage (by project type) x Yarn Weight Multiplier x Size Multiplier
Skeins Needed = ceil(Total Yards / Yards Per Skein)`,
  ["crochet-hook-size-calculator", "fabric-yardage-calculator"]
);

add(
  "quilt-fabric-calculator",
  "Quilt Fabric Calculator",
  "Estimate total fabric yardage needed for quilt tops, backing, and binding based on quilt dimensions and block size.",
  "Everyday",
  "everyday",
  "~",
  ["quilt fabric", "quilting yardage", "quilt calculator", "patchwork fabric"],
  [
    '{ name: "quiltWidth", label: "Quilt Width (inches)", type: "number", min: 20, max: 120, defaultValue: 60 }',
    '{ name: "quiltLength", label: "Quilt Length (inches)", type: "number", min: 20, max: 120, defaultValue: 80 }',
    '{ name: "blockSize", label: "Block Size (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", min: 0.25, max: 1, defaultValue: 0.25 }',
    '{ name: "fabricWidth", label: "Fabric Width (inches)", type: "number", min: 36, max: 60, defaultValue: 44 }'
  ],
  `(inputs) => {
    const quiltWidth = inputs.quiltWidth as number;
    const quiltLength = inputs.quiltLength as number;
    const blockSize = inputs.blockSize as number;
    const seam = inputs.seamAllowance as number;
    const fabricWidth = inputs.fabricWidth as number;
    const cutBlock = blockSize + seam * 2;
    const blocksAcross = Math.ceil(quiltWidth / blockSize);
    const blocksDown = Math.ceil(quiltLength / blockSize);
    const totalBlocks = blocksAcross * blocksDown;
    const blocksPerRow = Math.floor(fabricWidth / cutBlock);
    const rowsNeeded = Math.ceil(totalBlocks / blocksPerRow);
    const topYardage = Math.ceil((rowsNeeded * cutBlock) / 36 * 10) / 10;
    const backingYardage = Math.ceil((quiltLength + 8) / 36 * (Math.ceil((quiltWidth + 8) / fabricWidth)) * 10) / 10;
    const bindingYardage = Math.ceil(((quiltWidth + quiltLength) * 2 + 20) / (fabricWidth * 6) * 36) / 36;
    const bindingRounded = Math.ceil(bindingYardage * 10) / 10;
    return {
      primary: { label: "Top Fabric Needed", value: formatNumber(topYardage) + " yards" },
      details: [
        { label: "Total Blocks", value: formatNumber(totalBlocks) },
        { label: "Backing Fabric", value: formatNumber(backingYardage) + " yards" },
        { label: "Binding Fabric", value: formatNumber(bindingRounded) + " yards" },
        { label: "Blocks Per Fabric Row", value: formatNumber(blocksPerRow) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fabric for a quilt?", a: "Determine the number of blocks, account for seam allowances, then calculate how many blocks fit across your fabric width to find how many rows you need to cut." },
    { q: "How much extra fabric should I buy for quilting?", a: "Buy 10 to 20 percent extra to account for cutting mistakes, shrinkage, and fabric defects. Pre-wash cotton fabrics as they can shrink up to 5 percent." },
    { q: "What is a standard quilt seam allowance?", a: "The standard quilting seam allowance is one quarter inch. This is smaller than garment sewing which typically uses five eighths of an inch." }
  ],
  `Top Fabric = (Rows Needed x Cut Block Size) / 36 yards
Backing = (Quilt Length + 8) / 36 x Widths Needed
Binding = Perimeter / (Fabric Width x 6 strips per yard)`,
  ["fabric-yardage-calculator", "yarn-yardage-calculator"]
);

add(
  "candle-making-wax-calculator",
  "Candle Making Wax Calculator",
  "Calculate the amount of wax, fragrance oil, and dye needed for candle making based on container volume and wax type.",
  "Everyday",
  "everyday",
  "~",
  ["candle wax calculator", "candle making", "wax weight", "fragrance load"],
  [
    '{ name: "containerVolume", label: "Container Volume (oz)", type: "number", min: 1, max: 64, defaultValue: 8 }',
    '{ name: "numCandles", label: "Number of Candles", type: "number", min: 1, max: 100, defaultValue: 6 }',
    '{ name: "waxType", label: "Wax Type", type: "select", options: [{ value: "1", label: "Soy Wax" }, { value: "2", label: "Paraffin" }, { value: "3", label: "Coconut Wax" }, { value: "4", label: "Beeswax" }], defaultValue: "1" }',
    '{ name: "fragrancePercent", label: "Fragrance Load (%)", type: "number", min: 0, max: 15, defaultValue: 8 }'
  ],
  `(inputs) => {
    const containerVol = inputs.containerVolume as number;
    const numCandles = inputs.numCandles as number;
    const waxType = parseInt(inputs.waxType as string);
    const fragPercent = inputs.fragrancePercent as number;
    const densityFactor = { 1: 0.86, 2: 0.9, 3: 0.84, 4: 0.96 };
    const density = densityFactor[waxType] || 0.86;
    const waxPerCandle = containerVol * density;
    const totalWaxOz = waxPerCandle * numCandles;
    const totalWaxLbs = totalWaxOz / 16;
    const fragranceOz = totalWaxOz * (fragPercent / 100);
    const dyeOz = totalWaxOz * 0.002;
    return {
      primary: { label: "Total Wax Needed", value: formatNumber(Math.round(totalWaxLbs * 100) / 100) + " lbs" },
      details: [
        { label: "Wax Per Candle", value: formatNumber(Math.round(waxPerCandle * 100) / 100) + " oz" },
        { label: "Total Wax (oz)", value: formatNumber(Math.round(totalWaxOz * 10) / 10) + " oz" },
        { label: "Fragrance Oil Needed", value: formatNumber(Math.round(fragranceOz * 100) / 100) + " oz" },
        { label: "Dye Needed", value: formatNumber(Math.round(dyeOz * 100) / 100) + " oz" }
      ]
    };
  }`,
  [
    { q: "How much wax do I need for a candle?", a: "Multiply your container volume in ounces by the wax density factor. Soy wax weighs about 0.86 oz per fluid oz, so an 8 oz container needs roughly 6.9 oz of wax by weight." },
    { q: "What is a good fragrance load for candles?", a: "Most waxes handle 6 to 10 percent fragrance load. Soy wax typically maxes out around 10 to 12 percent. Going too high can cause sweating or poor burn quality." },
    { q: "What is the difference between soy and paraffin wax?", a: "Soy wax is natural and burns cleaner but has a lower scent throw. Paraffin is petroleum-based with stronger scent throw but produces more soot." }
  ],
  `Wax Per Candle (oz) = Container Volume x Wax Density Factor
Total Wax = Wax Per Candle x Number of Candles
Fragrance Oil = Total Wax x (Fragrance Load % / 100)`,
  ["soap-making-lye-calculator", "resin-art-volume-calculator"]
);

add(
  "soap-making-lye-calculator",
  "Soap Making Lye Calculator",
  "Calculate the correct amount of lye (sodium hydroxide) and water needed for cold process soap making based on oil weights and SAP values.",
  "Science",
  "science",
  "A",
  ["soap lye calculator", "saponification", "cold process soap", "NaOH calculator"],
  [
    '{ name: "oilWeight", label: "Total Oil Weight (oz)", type: "number", min: 4, max: 200, defaultValue: 32 }',
    '{ name: "oilType", label: "Primary Oil", type: "select", options: [{ value: "1", label: "Olive Oil" }, { value: "2", label: "Coconut Oil" }, { value: "3", label: "Palm Oil" }, { value: "4", label: "Lard/Tallow" }, { value: "5", label: "Castor Oil" }], defaultValue: "1" }',
    '{ name: "superfat", label: "Superfat (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "waterRatio", label: "Water:Lye Ratio", type: "select", options: [{ value: "1.5", label: "1.5:1 (Less Water)" }, { value: "2", label: "2:1 (Standard)" }, { value: "2.5", label: "2.5:1 (More Water)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const oilWeight = inputs.oilWeight as number;
    const oilType = parseInt(inputs.oilType as string);
    const superfat = inputs.superfat as number;
    const waterRatio = parseFloat(inputs.waterRatio as string);
    const sapValues = { 1: 0.1353, 2: 0.1910, 3: 0.1413, 4: 0.1405, 5: 0.1286 };
    const sap = sapValues[oilType] || 0.1353;
    const lyeNeeded = oilWeight * sap * (1 - superfat / 100);
    const waterNeeded = lyeNeeded * waterRatio;
    const totalBatchWeight = oilWeight + lyeNeeded + waterNeeded;
    return {
      primary: { label: "Lye (NaOH) Needed", value: formatNumber(Math.round(lyeNeeded * 100) / 100) + " oz" },
      details: [
        { label: "Water Needed", value: formatNumber(Math.round(waterNeeded * 100) / 100) + " oz" },
        { label: "SAP Value Used", value: formatNumber(sap) },
        { label: "Total Batch Weight", value: formatNumber(Math.round(totalBatchWeight * 100) / 100) + " oz" },
        { label: "Superfat Amount", value: formatNumber(superfat) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the SAP value?", a: "SAP (saponification value) indicates how much lye is needed to convert one ounce of a specific oil into soap. Each oil has a unique SAP value." },
    { q: "Why do I need superfat?", a: "Superfatting leaves a percentage of oils unsaponified in the finished soap. This makes the soap more moisturizing and provides a safety margin to ensure no excess lye remains." },
    { q: "Is lye dangerous?", a: "Yes, sodium hydroxide is a caustic chemical. Always wear gloves and eye protection. Add lye to water, never water to lye, to avoid a dangerous exothermic reaction." }
  ],
  `Lye = Oil Weight x SAP Value x (1 - Superfat% / 100)
Water = Lye x Water:Lye Ratio
Total Batch Weight = Oil + Lye + Water`,
  ["candle-making-wax-calculator", "resin-art-volume-calculator"]
);

add(
  "resin-art-volume-calculator",
  "Resin Art Volume Calculator",
  "Calculate the amount of epoxy resin and hardener needed for art projects based on mold dimensions and resin type.",
  "Everyday",
  "everyday",
  "~",
  ["resin volume", "epoxy calculator", "resin art", "casting resin amount"],
  [
    '{ name: "shape", label: "Mold Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Circle" }, { value: "3", label: "Irregular (approx)" }], defaultValue: "1" }',
    '{ name: "length", label: "Length/Diameter (inches)", type: "number", min: 1, max: 60, defaultValue: 12 }',
    '{ name: "width", label: "Width (inches, for rectangle)", type: "number", min: 1, max: 60, defaultValue: 8 }',
    '{ name: "depth", label: "Depth (inches)", type: "number", min: 0.1, max: 6, defaultValue: 0.5 }',
    '{ name: "mixRatio", label: "Resin Mix Ratio", type: "select", options: [{ value: "1", label: "1:1 by Volume" }, { value: "2", label: "2:1 by Volume" }, { value: "3", label: "3:1 by Volume" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const shape = parseInt(inputs.shape as string);
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const mixRatio = parseInt(inputs.mixRatio as string);
    let volumeCuIn = 0;
    if (shape === 1) {
      volumeCuIn = length * width * depth;
    } else if (shape === 2) {
      volumeCuIn = Math.PI * Math.pow(length / 2, 2) * depth;
    } else {
      volumeCuIn = length * width * depth * 0.75;
    }
    const volumeFlOz = volumeCuIn * 0.554;
    const extraFactor = 1.1;
    const totalFlOz = volumeFlOz * extraFactor;
    const ratioTotal = mixRatio === 1 ? 2 : mixRatio === 2 ? 3 : 4;
    const resinPart = totalFlOz * (mixRatio === 1 ? 1 : mixRatio) / ratioTotal;
    const hardenerPart = totalFlOz / ratioTotal;
    return {
      primary: { label: "Total Mixed Resin", value: formatNumber(Math.round(totalFlOz * 10) / 10) + " fl oz" },
      details: [
        { label: "Resin Part", value: formatNumber(Math.round(resinPart * 10) / 10) + " fl oz" },
        { label: "Hardener Part", value: formatNumber(Math.round(hardenerPart * 10) / 10) + " fl oz" },
        { label: "Mold Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Includes 10% Extra", value: "Yes" }
      ]
    };
  }`,
  [
    { q: "How do I measure resin for a project?", a: "Calculate the volume of your mold in cubic inches, convert to fluid ounces, then add 10 percent extra for mixing losses and surface tension." },
    { q: "What is the difference between 1:1 and 2:1 resin?", a: "A 1:1 ratio means equal parts resin and hardener. A 2:1 ratio means twice as much resin as hardener. The ratio is set by the manufacturer and must be followed exactly." },
    { q: "Can I pour thick layers of resin?", a: "Most table-top resins should be poured in layers of one quarter inch or less. Deep pour resins can handle 1 to 2 inches at a time. Pouring too thick causes excessive heat and cracking." }
  ],
  `Volume (cu in) = Length x Width x Depth (rectangle) or Pi x r^2 x Depth (circle)
Volume (fl oz) = Volume (cu in) x 0.554
Total = Volume (fl oz) x 1.10 (10% extra)`,
  ["candle-making-wax-calculator", "soap-making-lye-calculator"]
);

add(
  "leather-working-cost-calculator",
  "Leather Working Cost Calculator",
  "Estimate material costs for leather projects based on leather type, area needed, hardware, and thread.",
  "Finance",
  "finance",
  "$",
  ["leather cost", "leathercraft budget", "leather project cost", "leather material"],
  [
    '{ name: "leatherArea", label: "Leather Area Needed (sq ft)", type: "number", min: 0.5, max: 50, defaultValue: 4 }',
    '{ name: "leatherType", label: "Leather Type", type: "select", options: [{ value: "1", label: "Vegetable Tanned" }, { value: "2", label: "Chrome Tanned" }, { value: "3", label: "Exotic (Snake/Croc)" }, { value: "4", label: "Suede" }], defaultValue: "1" }',
    '{ name: "hardwareCount", label: "Hardware Pieces (snaps, rivets)", type: "number", min: 0, max: 50, defaultValue: 6 }',
    '{ name: "hardwareType", label: "Hardware Quality", type: "select", options: [{ value: "1", label: "Basic Brass" }, { value: "2", label: "Solid Brass" }, { value: "3", label: "Stainless Steel" }], defaultValue: "1" }',
    '{ name: "threadLength", label: "Thread Needed (yards)", type: "number", min: 1, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const area = inputs.leatherArea as number;
    const type = parseInt(inputs.leatherType as string);
    const hwCount = inputs.hardwareCount as number;
    const hwType = parseInt(inputs.hardwareType as string);
    const thread = inputs.threadLength as number;
    const leatherPrice = { 1: 12, 2: 8, 3: 35, 4: 6 };
    const hwPrice = { 1: 0.5, 2: 1.5, 3: 2.0 };
    const threadPricePerYard = 0.15;
    const leatherCost = area * (leatherPrice[type] || 12);
    const hardwareCost = hwCount * (hwPrice[hwType] || 0.5);
    const threadCost = thread * threadPricePerYard;
    const totalCost = leatherCost + hardwareCost + threadCost;
    return {
      primary: { label: "Total Material Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Leather Cost", value: "$" + formatNumber(Math.round(leatherCost * 100) / 100) },
        { label: "Hardware Cost", value: "$" + formatNumber(Math.round(hardwareCost * 100) / 100) },
        { label: "Thread Cost", value: "$" + formatNumber(Math.round(threadCost * 100) / 100) },
        { label: "Cost Per Sq Ft", value: "$" + formatNumber(leatherPrice[type] || 12) }
      ]
    };
  }`,
  [
    { q: "How much does leather cost per square foot?", a: "Vegetable tanned leather costs around 8 to 15 dollars per square foot. Exotic leathers like snake or crocodile can cost 25 to 50 dollars or more per square foot." },
    { q: "What type of leather is best for beginners?", a: "Vegetable tanned leather is ideal for beginners. It is firm, easy to cut, accepts dye well, and can be tooled and stamped." },
    { q: "How much leather do I need for a wallet?", a: "A simple bifold wallet typically requires about 1 to 1.5 square feet of leather depending on the design and number of card slots." }
  ],
  `Total Cost = (Leather Area x Price Per Sq Ft) + (Hardware Count x Price Per Piece) + (Thread Yards x Price Per Yard)`,
  ["candle-making-wax-calculator", "jewelry-wire-calculator"]
);

add(
  "pottery-kiln-firing-cost-calculator",
  "Pottery Kiln Firing Cost Calculator",
  "Estimate electricity or gas cost for pottery kiln firings based on kiln size, cone temperature, and energy rates.",
  "Finance",
  "finance",
  "$",
  ["kiln cost", "pottery firing cost", "kiln electricity", "ceramics firing"],
  [
    '{ name: "kilnKw", label: "Kiln Power (kW)", type: "number", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "coneTemp", label: "Cone Temperature", type: "select", options: [{ value: "1", label: "Cone 06 (Bisque, ~1830F)" }, { value: "2", label: "Cone 6 (Mid-Fire, ~2230F)" }, { value: "3", label: "Cone 10 (High-Fire, ~2380F)" }], defaultValue: "2" }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.12 }',
    '{ name: "firingsPerMonth", label: "Firings Per Month", type: "number", min: 1, max: 30, defaultValue: 4 }'
  ],
  `(inputs) => {
    const kilnKw = inputs.kilnKw as number;
    const cone = parseInt(inputs.coneTemp as string);
    const rate = inputs.electricRate as number;
    const firings = inputs.firingsPerMonth as number;
    const firingHours = { 1: 8, 2: 10, 3: 12 };
    const hours = firingHours[cone] || 10;
    const kwhPerFiring = kilnKw * hours * 0.65;
    const costPerFiring = kwhPerFiring * rate;
    const monthlyCost = costPerFiring * firings;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Cost Per Firing", value: "$" + formatNumber(Math.round(costPerFiring * 100) / 100) },
      details: [
        { label: "kWh Per Firing", value: formatNumber(Math.round(kwhPerFiring * 10) / 10) + " kWh" },
        { label: "Firing Duration", value: formatNumber(hours) + " hours" },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to fire a kiln?", a: "A typical cone 6 firing in an 8 kW kiln costs around 5 to 8 dollars in electricity at average US rates. Larger kilns and higher temperatures increase the cost." },
    { q: "Why is the duty cycle 65 percent?", a: "Electric kilns cycle their elements on and off to maintain temperature. On average they draw about 65 percent of their rated power over a full firing cycle." },
    { q: "Is gas or electric cheaper for pottery firing?", a: "Gas kilns can be cheaper at high temperatures (cone 10) but have higher upfront costs. Electric kilns are simpler and more common for home potters." }
  ],
  `kWh Per Firing = Kiln kW x Firing Hours x 0.65 (duty cycle)
Cost Per Firing = kWh x Electricity Rate
Monthly Cost = Cost Per Firing x Firings Per Month`,
  ["candle-making-wax-calculator", "leather-working-cost-calculator"]
);

add(
  "cross-stitch-fabric-calculator",
  "Cross Stitch Fabric Calculator",
  "Calculate the fabric dimensions and thread amounts needed for cross stitch projects based on pattern size and fabric count.",
  "Everyday",
  "everyday",
  "~",
  ["cross stitch fabric", "aida cloth calculator", "cross stitch size", "needlework fabric"],
  [
    '{ name: "patternWidth", label: "Pattern Width (stitches)", type: "number", min: 10, max: 1000, defaultValue: 100 }',
    '{ name: "patternHeight", label: "Pattern Height (stitches)", type: "number", min: 10, max: 1000, defaultValue: 80 }',
    '{ name: "fabricCount", label: "Fabric Count", type: "select", options: [{ value: "11", label: "11 count Aida" }, { value: "14", label: "14 count Aida" }, { value: "16", label: "16 count Aida" }, { value: "18", label: "18 count Aida" }, { value: "28", label: "28 count Evenweave" }], defaultValue: "14" }',
    '{ name: "margin", label: "Border Margin (inches)", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const count = parseInt(inputs.fabricCount as string);
    const margin = inputs.margin as number;
    const stitchCount = count >= 28 ? count / 2 : count;
    const designWidth = pw / stitchCount;
    const designHeight = ph / stitchCount;
    const fabricWidth = designWidth + margin * 2;
    const fabricHeight = designHeight + margin * 2;
    const totalStitches = pw * ph;
    const flossPerStitch = 0.012;
    const estimatedSkeins = Math.ceil(totalStitches * flossPerStitch / 8);
    return {
      primary: { label: "Fabric Size Needed", value: formatNumber(Math.round(fabricWidth * 10) / 10) + " x " + formatNumber(Math.round(fabricHeight * 10) / 10) + " inches" },
      details: [
        { label: "Design Size", value: formatNumber(Math.round(designWidth * 10) / 10) + " x " + formatNumber(Math.round(designHeight * 10) / 10) + " inches" },
        { label: "Total Stitches", value: formatNumber(totalStitches) },
        { label: "Estimated Skeins (all colors)", value: formatNumber(estimatedSkeins) },
        { label: "Effective Count", value: formatNumber(stitchCount) + " stitches/inch" }
      ]
    };
  }`,
  [
    { q: "What fabric count should I use for cross stitch?", a: "Beginners should start with 14 count Aida. Higher counts like 18 count produce finer details but are harder to see. 28 count evenweave is stitched over two threads." },
    { q: "How much margin should I leave around my design?", a: "Leave at least 3 inches on each side for framing. If your piece will be mounted in a large frame, leave 4 to 6 inches." },
    { q: "How do I estimate thread for a cross stitch project?", a: "A general rule is about 1 skein of 8-yard floss per 500 to 700 stitches, though this varies with coverage density and number of thread strands used." }
  ],
  `Design Size = Pattern Stitches / Fabric Count
Fabric Size = Design Size + (Margin x 2) on each dimension
Estimated Skeins = (Total Stitches x 0.012 yards per stitch) / 8 yards per skein`,
  ["embroidery-thread-calculator", "quilt-fabric-calculator"]
);

add(
  "embroidery-thread-calculator",
  "Embroidery Thread Calculator",
  "Estimate embroidery thread or floss usage based on design area, stitch density, and number of colors.",
  "Everyday",
  "everyday",
  "~",
  ["embroidery thread", "floss calculator", "embroidery supplies", "thread estimator"],
  [
    '{ name: "designArea", label: "Design Area (sq inches)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "coverage", label: "Stitch Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "stitchType", label: "Primary Stitch Type", type: "select", options: [{ value: "1", label: "Satin Stitch" }, { value: "2", label: "Fill Stitch" }, { value: "3", label: "Running/Outline" }], defaultValue: "2" }',
    '{ name: "strands", label: "Number of Strands", type: "select", options: [{ value: "1", label: "1 Strand" }, { value: "2", label: "2 Strands" }, { value: "3", label: "3 Strands" }, { value: "6", label: "6 Strands" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const area = inputs.designArea as number;
    const coverage = inputs.coverage as number;
    const numColors = inputs.numColors as number;
    const stitchType = parseInt(inputs.stitchType as string);
    const strands = parseInt(inputs.strands as string);
    const densityFactor = { 1: 1.3, 2: 1.0, 3: 0.5 };
    const density = densityFactor[stitchType] || 1.0;
    const coveredArea = area * (coverage / 100);
    const threadYards = coveredArea * density * strands * 2.5;
    const yardsPerSkein = 8.7;
    const totalSkeins = Math.ceil(threadYards / yardsPerSkein);
    const skeinsPerColor = Math.max(1, Math.ceil(totalSkeins / numColors));
    return {
      primary: { label: "Total Thread Needed", value: formatNumber(Math.round(threadYards * 10) / 10) + " yards" },
      details: [
        { label: "Total Skeins", value: formatNumber(totalSkeins) },
        { label: "Avg Skeins Per Color", value: formatNumber(skeinsPerColor) },
        { label: "Covered Area", value: formatNumber(Math.round(coveredArea * 10) / 10) + " sq in" },
        { label: "Strands Used", value: formatNumber(strands) }
      ]
    };
  }`,
  [
    { q: "How many strands of embroidery floss should I use?", a: "Two strands is the most common for standard embroidery. Use one strand for fine detail and three or more for bold textures. Cross stitch on 14 count Aida typically uses two strands." },
    { q: "How much thread does a satin stitch use?", a: "Satin stitch uses about 30 percent more thread than fill stitch because the thread lies flat on the surface with minimal back stitching." },
    { q: "How many yards are in a skein of embroidery floss?", a: "A standard DMC embroidery floss skein contains 8.7 yards (approximately 8 meters) of six-strand cotton thread." }
  ],
  `Thread (yards) = Covered Area x Density Factor x Strands x 2.5
Total Skeins = Thread Yards / 8.7 yards per skein
Avg Per Color = Total Skeins / Number of Colors`,
  ["cross-stitch-fabric-calculator", "yarn-yardage-calculator"]
);

add(
  "scrapbook-page-layout-calculator",
  "Scrapbook Page Layout Calculator",
  "Plan scrapbook page layouts by calculating photo sizes, spacing, and number of photos that fit on a page.",
  "Everyday",
  "everyday",
  "~",
  ["scrapbook layout", "photo page planner", "scrapbook design", "photo layout"],
  [
    '{ name: "pageSize", label: "Page Size", type: "select", options: [{ value: "8.5", label: "8.5 x 8.5 inches" }, { value: "12", label: "12 x 12 inches" }, { value: "6", label: "6 x 8 inches" }], defaultValue: "12" }',
    '{ name: "photoWidth", label: "Photo Width (inches)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "photoHeight", label: "Photo Height (inches)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "spacing", label: "Spacing Between Photos (inches)", type: "number", min: 0.1, max: 2, defaultValue: 0.5 }',
    '{ name: "margin", label: "Page Margin (inches)", type: "number", min: 0.25, max: 2, defaultValue: 0.75 }'
  ],
  `(inputs) => {
    const pageW = parseFloat(inputs.pageSize as string);
    const pageH = pageW === 6 ? 8 : pageW;
    const photoW = inputs.photoWidth as number;
    const photoH = inputs.photoHeight as number;
    const spacing = inputs.spacing as number;
    const margin = inputs.margin as number;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;
    const photosAcross = Math.floor((usableW + spacing) / (photoW + spacing));
    const photosDown = Math.floor((usableH + spacing) / (photoH + spacing));
    const totalPhotos = photosAcross * photosDown;
    const usedW = photosAcross * photoW + (photosAcross - 1) * spacing;
    const usedH = photosDown * photoH + (photosDown - 1) * spacing;
    const remainW = Math.round((usableW - usedW) * 100) / 100;
    const remainH = Math.round((usableH - usedH) * 100) / 100;
    return {
      primary: { label: "Photos Per Page", value: formatNumber(totalPhotos) },
      details: [
        { label: "Grid Layout", value: formatNumber(photosAcross) + " x " + formatNumber(photosDown) },
        { label: "Usable Area", value: formatNumber(Math.round(usableW * 10) / 10) + " x " + formatNumber(Math.round(usableH * 10) / 10) + " in" },
        { label: "Remaining Width", value: formatNumber(remainW) + " in" },
        { label: "Remaining Height", value: formatNumber(remainH) + " in" }
      ]
    };
  }`,
  [
    { q: "What is the standard scrapbook page size?", a: "The most common scrapbook page size is 12 x 12 inches. Other popular sizes include 8.5 x 8.5 and 6 x 8 inches for mini albums." },
    { q: "How many photos should I put on a scrapbook page?", a: "A well-balanced 12 x 12 page typically has 2 to 5 photos. Too many photos can look cluttered. Leave space for journaling and embellishments." },
    { q: "What size should I print scrapbook photos?", a: "Common print sizes for scrapbooking are 4 x 6, 3 x 4, and 2 x 3 inches. Mix sizes for visual interest." }
  ],
  `Photos Across = floor((Usable Width + Spacing) / (Photo Width + Spacing))
Photos Down = floor((Usable Height + Spacing) / (Photo Height + Spacing))
Total Photos = Photos Across x Photos Down`,
  ["card-making-supplies-calculator", "cross-stitch-fabric-calculator"]
);

add(
  "wood-turning-blank-size-calculator",
  "Wood Turning Blank Size Calculator",
  "Calculate the minimum wood blank dimensions needed for turned bowls, spindles, and vessels including waste allowance.",
  "Everyday",
  "everyday",
  "~",
  ["wood turning blank", "lathe blank size", "bowl blank", "wood turning calculator"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Bowl" }, { value: "2", label: "Spindle/Pen" }, { value: "3", label: "Vase/Vessel" }, { value: "4", label: "Platter" }], defaultValue: "1" }',
    '{ name: "finishedDiameter", label: "Finished Diameter (inches)", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "finishedHeight", label: "Finished Height/Depth (inches)", type: "number", min: 0.5, max: 18, defaultValue: 3 }',
    '{ name: "wallThickness", label: "Wall Thickness (inches)", type: "number", min: 0.125, max: 1, defaultValue: 0.25 }'
  ],
  `(inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const finDiam = inputs.finishedDiameter as number;
    const finHeight = inputs.finishedHeight as number;
    const wall = inputs.wallThickness as number;
    const wasteMargin = 1;
    const chuckAllowance = projType === 1 || projType === 3 ? 0.75 : 0.5;
    const blankDiam = finDiam + wasteMargin * 2;
    const blankThick = projType === 2 ? finDiam + wasteMargin : finHeight + chuckAllowance + wasteMargin;
    const volumeCuIn = Math.PI * Math.pow(blankDiam / 2, 2) * blankThick;
    const boardFeet = volumeCuIn / 144;
    return {
      primary: { label: "Blank Size", value: formatNumber(Math.round(blankDiam * 10) / 10) + " x " + formatNumber(Math.round(blankThick * 10) / 10) + " inches" },
      details: [
        { label: "Blank Diameter", value: formatNumber(Math.round(blankDiam * 10) / 10) + " in" },
        { label: "Blank Thickness", value: formatNumber(Math.round(blankThick * 10) / 10) + " in" },
        { label: "Blank Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Board Feet", value: formatNumber(Math.round(boardFeet * 100) / 100) + " BF" }
      ]
    };
  }`,
  [
    { q: "How much extra wood do I need for turning?", a: "Add at least 1 inch to the diameter and 0.75 to 1 inch to the height for waste from truing, tenon creation, and final finishing cuts." },
    { q: "What is a tenon in wood turning?", a: "A tenon is a cylindrical nub left on the bottom of a bowl blank that fits into a chuck to hold the piece securely on the lathe during turning." },
    { q: "What wood is best for turning?", a: "Cherry, maple, walnut, and ash are excellent turning woods. Green (wet) wood is easier to turn but must be dried slowly to prevent cracking." }
  ],
  `Blank Diameter = Finished Diameter + (Waste Margin x 2)
Blank Thickness = Finished Height + Chuck Allowance + Waste Margin
Board Feet = (Pi x r^2 x Thickness) / 144`,
  ["leather-working-cost-calculator", "quilt-fabric-calculator"]
);

add(
  "model-railroad-scale-calculator",
  "Model Railroad Scale Calculator",
  "Convert real-world dimensions to model railroad scale dimensions for popular scales including HO, N, O, and G.",
  "Conversion",
  "conversion",
  "R",
  ["model railroad scale", "model train scale", "HO scale converter", "miniature scale"],
  [
    '{ name: "realLength", label: "Real-World Length (feet)", type: "number", min: 0.1, max: 5000, defaultValue: 50 }',
    '{ name: "realWidth", label: "Real-World Width (feet)", type: "number", min: 0.1, max: 500, defaultValue: 12 }',
    '{ name: "realHeight", label: "Real-World Height (feet)", type: "number", min: 0.1, max: 500, defaultValue: 15 }',
    '{ name: "scale", label: "Model Scale", type: "select", options: [{ value: "220", label: "Z Scale (1:220)" }, { value: "160", label: "N Scale (1:160)" }, { value: "87", label: "HO Scale (1:87)" }, { value: "48", label: "O Scale (1:48)" }, { value: "22.5", label: "G Scale (1:22.5)" }], defaultValue: "87" }'
  ],
  `(inputs) => {
    const realL = inputs.realLength as number;
    const realW = inputs.realWidth as number;
    const realH = inputs.realHeight as number;
    const scale = parseFloat(inputs.scale as string);
    const modelL = realL * 12 / scale;
    const modelW = realW * 12 / scale;
    const modelH = realH * 12 / scale;
    const modelLmm = modelL * 25.4;
    const modelWmm = modelW * 25.4;
    const modelHmm = modelH * 25.4;
    return {
      primary: { label: "Model Length", value: formatNumber(Math.round(modelL * 100) / 100) + " inches" },
      details: [
        { label: "Model Width", value: formatNumber(Math.round(modelW * 100) / 100) + " inches" },
        { label: "Model Height", value: formatNumber(Math.round(modelH * 100) / 100) + " inches" },
        { label: "Length (mm)", value: formatNumber(Math.round(modelLmm * 10) / 10) + " mm" },
        { label: "Width (mm)", value: formatNumber(Math.round(modelWmm * 10) / 10) + " mm" },
        { label: "Scale Ratio", value: "1:" + formatNumber(scale) }
      ]
    };
  }`,
  [
    { q: "What is the most popular model railroad scale?", a: "HO scale (1:87) is the most popular worldwide. It offers a good balance between detail and space requirements." },
    { q: "How do I convert real dimensions to scale?", a: "Divide the real dimension by the scale ratio. For HO scale, divide by 87. A 50-foot building becomes about 6.9 inches in HO." },
    { q: "How much space do I need for a model railroad?", a: "A basic HO layout needs at least a 4 by 8 foot table. N scale can fit in smaller spaces. O and G scale require significantly more room." }
  ],
  `Model Dimension (inches) = Real Dimension (feet) x 12 / Scale Ratio
Model Dimension (mm) = Model Dimension (inches) x 25.4`,
  ["miniature-painting-cost-calculator", "wood-turning-blank-size-calculator"]
);

add(
  "miniature-painting-cost-calculator",
  "Miniature Painting Cost Calculator",
  "Estimate paint, brush, and supply costs for miniature painting projects based on number of minis and detail level.",
  "Finance",
  "finance",
  "$",
  ["miniature painting cost", "mini painting supplies", "warhammer paint", "model painting budget"],
  [
    '{ name: "numMinis", label: "Number of Miniatures", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "miniSize", label: "Miniature Scale", type: "select", options: [{ value: "1", label: "28mm (Standard)" }, { value: "2", label: "32mm (Heroic)" }, { value: "3", label: "54mm (Large)" }, { value: "4", label: "75mm+ (Display)" }], defaultValue: "1" }',
    '{ name: "detailLevel", label: "Detail Level", type: "select", options: [{ value: "1", label: "Tabletop (3 colors)" }, { value: "2", label: "Good (5-8 colors)" }, { value: "3", label: "High (10+ colors)" }, { value: "4", label: "Competition" }], defaultValue: "2" }',
    '{ name: "paintBrand", label: "Paint Brand Tier", type: "select", options: [{ value: "1", label: "Budget ($2-3/bottle)" }, { value: "2", label: "Standard ($4-5/bottle)" }, { value: "3", label: "Premium ($6-8/bottle)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const numMinis = inputs.numMinis as number;
    const miniSize = parseInt(inputs.miniSize as string);
    const detail = parseInt(inputs.detailLevel as string);
    const brand = parseInt(inputs.paintBrand as string);
    const colorsNeeded = { 1: 3, 2: 7, 3: 12, 4: 18 };
    const paintPrice = { 1: 2.5, 2: 4.5, 3: 7 };
    const sizeMultiplier = { 1: 1, 2: 1.2, 3: 2, 4: 3 };
    const colors = colorsNeeded[detail] || 7;
    const pricePerBottle = paintPrice[brand] || 4.5;
    const sizeMult = sizeMultiplier[miniSize] || 1;
    const paintCost = colors * pricePerBottle;
    const mlPerMini = 0.3 * sizeMult;
    const bottleMl = 17;
    const bottlesConsumed = Math.ceil((numMinis * mlPerMini * colors) / (bottleMl * colors)) ;
    const brushCost = detail >= 3 ? 25 : 12;
    const primerCost = Math.ceil(numMinis / 20) * 12;
    const totalCost = paintCost + brushCost + primerCost;
    return {
      primary: { label: "Paint Set Cost", value: "$" + formatNumber(Math.round(paintCost * 100) / 100) },
      details: [
        { label: "Colors Needed", value: formatNumber(colors) },
        { label: "Brush Cost", value: "$" + formatNumber(brushCost) },
        { label: "Primer Cost", value: "$" + formatNumber(primerCost) },
        { label: "Total Startup Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much paint do I need for miniatures?", a: "A standard 17ml bottle of miniature paint covers approximately 50 to 60 standard 28mm miniatures with a single thin coat of one color." },
    { q: "What paints are best for beginners?", a: "Citadel, Vallejo, and Army Painter are popular choices. Vallejo offers the best value while Citadel has the widest hobby support." },
    { q: "Do I need to prime miniatures?", a: "Yes, priming provides a surface for paint to adhere to. Spray primer is fastest; brush-on primer works for small batches." }
  ],
  `Paint Set Cost = Number of Colors x Price Per Bottle
Primer Cost = ceil(Minis / 20) x Spray Can Price
Total Startup = Paint + Brushes + Primer`,
  ["model-railroad-scale-calculator", "leather-working-cost-calculator"]
);

add(
  "bead-pattern-calculator",
  "Bead Pattern Calculator",
  "Calculate the number of beads needed for bead weaving, loom work, or stringing projects based on pattern dimensions and bead size.",
  "Everyday",
  "everyday",
  "~",
  ["bead calculator", "bead pattern", "bead weaving", "seed bead count"],
  [
    '{ name: "patternWidth", label: "Pattern Width (beads)", type: "number", min: 5, max: 500, defaultValue: 40 }',
    '{ name: "patternHeight", label: "Pattern Height (rows)", type: "number", min: 5, max: 500, defaultValue: 50 }',
    '{ name: "beadSize", label: "Bead Size", type: "select", options: [{ value: "1", label: "15/0 (1.5mm)" }, { value: "2", label: "11/0 (2.2mm)" }, { value: "3", label: "8/0 (3mm)" }, { value: "4", label: "6/0 (4mm)" }], defaultValue: "2" }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Loom" }, { value: "2", label: "Peyote" }, { value: "3", label: "Brick Stitch" }, { value: "4", label: "Right Angle Weave" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const beadSize = parseInt(inputs.beadSize as string);
    const numColors = inputs.numColors as number;
    const technique = parseInt(inputs.technique as string);
    const beadMm = { 1: 1.5, 2: 2.2, 3: 3, 4: 4 };
    const mm = beadMm[beadSize] || 2.2;
    const wasteFactor = { 1: 1.05, 2: 1.08, 3: 1.08, 4: 1.12 };
    const waste = wasteFactor[technique] || 1.05;
    const totalBeads = Math.ceil(pw * ph * waste);
    const beadsPerColor = Math.ceil(totalBeads / numColors);
    const widthInches = Math.round(pw * mm / 25.4 * 100) / 100;
    const heightInches = Math.round(ph * mm / 25.4 * 100) / 100;
    const gramsPerBead = { 1: 0.02, 2: 0.04, 3: 0.1, 4: 0.2 };
    const totalGrams = Math.round(totalBeads * (gramsPerBead[beadSize] || 0.04) * 10) / 10;
    return {
      primary: { label: "Total Beads Needed", value: formatNumber(totalBeads) },
      details: [
        { label: "Avg Beads Per Color", value: formatNumber(beadsPerColor) },
        { label: "Finished Width", value: formatNumber(widthInches) + " inches" },
        { label: "Finished Height", value: formatNumber(heightInches) + " inches" },
        { label: "Total Weight", value: formatNumber(totalGrams) + " grams" }
      ]
    };
  }`,
  [
    { q: "How many beads are in a gram?", a: "For size 11/0 seed beads, there are approximately 110 beads per gram. Larger beads like 6/0 have about 10 per gram, while tiny 15/0 have about 290 per gram." },
    { q: "Why add a waste factor?", a: "The waste factor accounts for beads lost during work, irregular beads that must be discarded, and extras needed for tension adjustments in the weaving technique." },
    { q: "What is the difference between peyote and loom beading?", a: "Loom beading uses a loom to hold warp threads and creates a flat fabric quickly. Peyote stitch is off-loom and more portable but slower. Both produce similar-looking flat beadwork." }
  ],
  `Total Beads = Pattern Width x Pattern Height x Waste Factor
Finished Size (inches) = Beads x Bead Size (mm) / 25.4
Weight (grams) = Total Beads x Grams Per Bead`,
  ["jewelry-wire-calculator", "embroidery-thread-calculator"]
);

add(
  "macrame-cord-calculator",
  "Macrame Cord Calculator",
  "Calculate the total cord length needed for macrame projects based on finished length, knot type, and number of cords.",
  "Everyday",
  "everyday",
  "~",
  ["macrame cord", "macrame rope calculator", "macrame length", "macrame supplies"],
  [
    '{ name: "finishedLength", label: "Finished Project Length (inches)", type: "number", min: 6, max: 120, defaultValue: 36 }',
    '{ name: "numCords", label: "Number of Cords", type: "number", min: 2, max: 100, defaultValue: 16 }',
    '{ name: "knotType", label: "Primary Knot Type", type: "select", options: [{ value: "1", label: "Square Knots" }, { value: "2", label: "Spiral/Half Hitch" }, { value: "3", label: "Gathering Knots" }, { value: "4", label: "Berry Knots" }], defaultValue: "1" }',
    '{ name: "cordThickness", label: "Cord Thickness (mm)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "density", label: "Knot Density", type: "select", options: [{ value: "1", label: "Loose/Airy" }, { value: "2", label: "Medium" }, { value: "3", label: "Dense/Tight" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const finLength = inputs.finishedLength as number;
    const numCords = inputs.numCords as number;
    const knotType = parseInt(inputs.knotType as string);
    const cordThick = inputs.cordThickness as number;
    const density = parseInt(inputs.density as string);
    const knotMultiplier = { 1: 4, 2: 5, 3: 3.5, 4: 6 };
    const densityMult = { 1: 0.8, 2: 1.0, 3: 1.3 };
    const thickMult = 1 + (cordThick - 3) * 0.05;
    const mult = (knotMultiplier[knotType] || 4) * (densityMult[density] || 1) * thickMult;
    const cordLength = Math.round(finLength * mult);
    const totalLength = cordLength * numCords;
    const totalFeet = Math.round(totalLength / 12);
    const totalYards = Math.round(totalFeet / 3 * 10) / 10;
    return {
      primary: { label: "Length Per Cord", value: formatNumber(cordLength) + " inches" },
      details: [
        { label: "Total Cord Needed", value: formatNumber(totalFeet) + " feet" },
        { label: "Total in Yards", value: formatNumber(totalYards) + " yards" },
        { label: "Number of Cords", value: formatNumber(numCords) },
        { label: "Multiplier Used", value: formatNumber(Math.round(mult * 10) / 10) + "x" }
      ]
    };
  }`,
  [
    { q: "How much cord do I need for macrame?", a: "A general rule is to cut cords 3 to 5 times the finished length. Dense patterns with complex knots may need up to 6 to 8 times the finished length." },
    { q: "What size cord is best for macrame?", a: "3mm to 5mm cord is most popular for wall hangings. 1 to 2mm works for jewelry. 6mm or larger is used for plant hangers and large pieces." },
    { q: "Should I cut all cords the same length?", a: "For most patterns, yes. If your design has outer cords that remain unknotted, those can be shorter. Always err on the side of too long since you can trim but cannot add." }
  ],
  `Cord Length = Finished Length x Knot Multiplier x Density Factor x Thickness Factor
Total Cord = Cord Length x Number of Cords`,
  ["yarn-yardage-calculator", "jewelry-wire-calculator"]
);

add(
  "calligraphy-ink-usage-calculator",
  "Calligraphy Ink Usage Calculator",
  "Estimate ink consumption for calligraphy projects based on writing area, nib size, and ink type.",
  "Everyday",
  "everyday",
  "~",
  ["calligraphy ink", "ink usage calculator", "fountain pen ink", "calligraphy supplies"],
  [
    '{ name: "numPages", label: "Number of Pages", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "linesPerPage", label: "Lines Per Page", type: "number", min: 1, max: 50, defaultValue: 20 }',
    '{ name: "nibSize", label: "Nib Size", type: "select", options: [{ value: "1", label: "Fine (0.5-1mm)" }, { value: "2", label: "Medium (1.5-2mm)" }, { value: "3", label: "Broad (2.5-4mm)" }, { value: "4", label: "Extra Broad (5mm+)" }], defaultValue: "2" }',
    '{ name: "inkType", label: "Ink Type", type: "select", options: [{ value: "1", label: "Iron Gall" }, { value: "2", label: "Carbon/Sumi" }, { value: "3", label: "Fountain Pen Ink" }, { value: "4", label: "Gouache/Watercolor" }], defaultValue: "1" }',
    '{ name: "lineLength", label: "Average Line Length (inches)", type: "number", min: 2, max: 12, defaultValue: 7 }'
  ],
  `(inputs) => {
    const pages = inputs.numPages as number;
    const lines = inputs.linesPerPage as number;
    const nib = parseInt(inputs.nibSize as string);
    const inkType = parseInt(inputs.inkType as string);
    const lineLen = inputs.lineLength as number;
    const nibFactor = { 1: 0.003, 2: 0.006, 3: 0.012, 4: 0.02 };
    const inkFactor = { 1: 1.0, 2: 1.2, 3: 0.8, 4: 1.5 };
    const mlPerInch = (nibFactor[nib] || 0.006) * (inkFactor[inkType] || 1.0);
    const totalInches = pages * lines * lineLen;
    const totalMl = totalInches * mlPerInch;
    const bottles30ml = Math.ceil(totalMl / 30);
    const dipLoads = Math.round(totalMl / 0.05);
    return {
      primary: { label: "Total Ink Needed", value: formatNumber(Math.round(totalMl * 10) / 10) + " ml" },
      details: [
        { label: "30ml Bottles Needed", value: formatNumber(bottles30ml) },
        { label: "Total Writing Length", value: formatNumber(Math.round(totalInches / 12)) + " feet" },
        { label: "Estimated Dip Loads", value: formatNumber(dipLoads) },
        { label: "Ink Per Page", value: formatNumber(Math.round(totalMl / pages * 100) / 100) + " ml" }
      ]
    };
  }`,
  [
    { q: "How long does a bottle of calligraphy ink last?", a: "A 30ml bottle of calligraphy ink can last 50 to 200 pages depending on nib width and writing density. Fine nibs use much less ink than broad nibs." },
    { q: "What ink is best for calligraphy beginners?", a: "Iron gall ink is traditional and flows well from a dip pen. Sumi ink is great for brush calligraphy. Fountain pen inks are convenient but may feather on some papers." },
    { q: "Does nib size affect ink consumption?", a: "Yes, significantly. A broad nib can use 4 to 6 times more ink than a fine nib because it deposits a wider line of ink on the paper." }
  ],
  `Ink Per Inch = Nib Factor x Ink Type Factor
Total Ink (ml) = Pages x Lines Per Page x Line Length x Ink Per Inch
Bottles = ceil(Total Ink / 30 ml)`,
  ["card-making-supplies-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "paper-crafting-sheets-calculator",
  "Paper Crafting Sheets Calculator",
  "Calculate how many sheets of cardstock or paper are needed for crafting projects based on cuts per sheet and quantities.",
  "Everyday",
  "everyday",
  "~",
  ["paper crafting", "cardstock calculator", "paper cutting", "craft paper sheets"],
  [
    '{ name: "sheetWidth", label: "Sheet Width (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "sheetHeight", label: "Sheet Height (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "cutWidth", label: "Cut Piece Width (inches)", type: "number", min: 0.5, max: 12, defaultValue: 4.25 }',
    '{ name: "cutHeight", label: "Cut Piece Height (inches)", type: "number", min: 0.5, max: 12, defaultValue: 5.5 }',
    '{ name: "quantity", label: "Pieces Needed", type: "number", min: 1, max: 500, defaultValue: 24 }',
    '{ name: "wasteMargin", label: "Blade Waste (inches)", type: "number", min: 0, max: 0.25, defaultValue: 0.0625 }'
  ],
  `(inputs) => {
    const sw = inputs.sheetWidth as number;
    const sh = inputs.sheetHeight as number;
    const cw = inputs.cutWidth as number;
    const ch = inputs.cutHeight as number;
    const qty = inputs.quantity as number;
    const waste = inputs.wasteMargin as number;
    const effectCW = cw + waste;
    const effectCH = ch + waste;
    const orient1 = Math.floor(sw / effectCW) * Math.floor(sh / effectCH);
    const orient2 = Math.floor(sw / effectCH) * Math.floor(sh / effectCW);
    const cutsPerSheet = Math.max(orient1, orient2);
    const sheetsNeeded = Math.ceil(qty / Math.max(cutsPerSheet, 1));
    const totalCuts = sheetsNeeded * cutsPerSheet;
    const wastePercent = Math.round((1 - (cutsPerSheet * cw * ch) / (sw * sh)) * 100);
    return {
      primary: { label: "Sheets Needed", value: formatNumber(sheetsNeeded) },
      details: [
        { label: "Cuts Per Sheet", value: formatNumber(cutsPerSheet) },
        { label: "Total Pieces Cut", value: formatNumber(totalCuts) },
        { label: "Leftover Pieces", value: formatNumber(totalCuts - qty) },
        { label: "Sheet Waste", value: formatNumber(wastePercent) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the standard cardstock sheet size?", a: "The most common cardstock sizes for crafting are 8.5 x 11 inches (letter) and 12 x 12 inches (scrapbook size). A7 card bases are typically cut from 8.5 x 11 sheets." },
    { q: "How thick should cardstock be for card making?", a: "Card bases typically use 65 to 110 lb cardstock. 80 lb is a good all-purpose weight. Lighter weights work for layering and decorative panels." },
    { q: "Should I account for blade waste when cutting?", a: "Yes, trimmer blades remove a tiny amount of material. For precise work, add 1/16 inch per cut to your calculations." }
  ],
  `Cuts Per Sheet = max(floor(W/cw) x floor(H/ch), floor(W/ch) x floor(H/cw))
Sheets Needed = ceil(Quantity / Cuts Per Sheet)
Waste % = (1 - (Cuts x Cut Area) / Sheet Area) x 100`,
  ["card-making-supplies-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "stained-glass-area-calculator",
  "Stained Glass Area Calculator",
  "Calculate glass area, lead came or copper foil, and solder needed for stained glass panel projects.",
  "Everyday",
  "everyday",
  "~",
  ["stained glass area", "stained glass calculator", "lead came", "copper foil glass"],
  [
    '{ name: "panelWidth", label: "Panel Width (inches)", type: "number", min: 4, max: 72, defaultValue: 18 }',
    '{ name: "panelHeight", label: "Panel Height (inches)", type: "number", min: 4, max: 72, defaultValue: 24 }',
    '{ name: "numPieces", label: "Number of Glass Pieces", type: "number", min: 2, max: 200, defaultValue: 25 }',
    '{ name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Copper Foil (Tiffany)" }, { value: "2", label: "Lead Came" }], defaultValue: "1" }',
    '{ name: "glassPrice", label: "Glass Price ($/sq ft)", type: "number", min: 3, max: 50, defaultValue: 10 }'
  ],
  `(inputs) => {
    const pw = inputs.panelWidth as number;
    const ph = inputs.panelHeight as number;
    const pieces = inputs.numPieces as number;
    const tech = parseInt(inputs.technique as string);
    const glassPrice = inputs.glassPrice as number;
    const panelArea = pw * ph;
    const panelAreaSqFt = panelArea / 144;
    const wasteFactor = 1.33;
    const glassNeeded = panelAreaSqFt * wasteFactor;
    const glassCost = glassNeeded * glassPrice;
    const avgPerimeter = Math.sqrt(panelArea / pieces) * 4;
    const totalSeamLength = (pieces * avgPerimeter) / 2;
    const borderLength = (pw + ph) * 2;
    const totalCameLength = Math.round(totalSeamLength + borderLength);
    const solderOz = tech === 1 ? Math.round(totalCameLength * 0.06 * 10) / 10 : Math.round(pieces * 0.3 * 10) / 10;
    return {
      primary: { label: "Glass Needed", value: formatNumber(Math.round(glassNeeded * 100) / 100) + " sq ft" },
      details: [
        { label: "Glass Cost", value: "$" + formatNumber(Math.round(glassCost * 100) / 100) },
        { label: "Came/Foil Length", value: formatNumber(totalCameLength) + " inches" },
        { label: "Solder Needed", value: formatNumber(solderOz) + " oz" },
        { label: "Panel Area", value: formatNumber(Math.round(panelAreaSqFt * 100) / 100) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much extra glass should I buy for stained glass?", a: "Buy 30 to 40 percent more glass than the panel area to account for cutting waste, breakage, and irregular shapes. Complex curved pieces have higher waste." },
    { q: "What is the difference between copper foil and lead came?", a: "Copper foil (Tiffany method) wraps each piece in adhesive-backed foil and solders joints. Lead came uses H-shaped lead strips between pieces. Foil allows finer detail; came is more traditional." },
    { q: "How much solder do I need?", a: "For copper foil, estimate about 0.5 to 1 pound of solder per 4 square feet of panel. Lead came uses less solder since joints are only at intersections." }
  ],
  `Glass Needed = (Panel Width x Height / 144) x 1.33 waste factor
Came Length = (Pieces x Avg Perimeter / 2) + Border
Solder = Came Length x Usage Factor`,
  ["mosaic-tile-calculator", "resin-art-volume-calculator"]
);

add(
  "mosaic-tile-calculator",
  "Mosaic Tile Calculator",
  "Calculate the number of mosaic tiles, grout, and adhesive needed for mosaic art projects based on area and tile size.",
  "Everyday",
  "everyday",
  "~",
  ["mosaic tile calculator", "mosaic art supplies", "tessera count", "mosaic grout"],
  [
    '{ name: "projectWidth", label: "Project Width (inches)", type: "number", min: 2, max: 120, defaultValue: 18 }',
    '{ name: "projectHeight", label: "Project Height (inches)", type: "number", min: 2, max: 120, defaultValue: 18 }',
    '{ name: "tileSize", label: "Tile Size", type: "select", options: [{ value: "0.375", label: "3/8 inch Micro" }, { value: "0.5", label: "1/2 inch Mini" }, { value: "0.75", label: "3/4 inch Standard" }, { value: "1", label: "1 inch Large" }], defaultValue: "0.75" }',
    '{ name: "groutGap", label: "Grout Gap (inches)", type: "number", min: 0.03, max: 0.25, defaultValue: 0.0625 }',
    '{ name: "coverage", label: "Coverage (%)", type: "number", min: 50, max: 100, defaultValue: 95 }'
  ],
  `(inputs) => {
    const pw = inputs.projectWidth as number;
    const ph = inputs.projectHeight as number;
    const tileSize = parseFloat(inputs.tileSize as string);
    const gap = inputs.groutGap as number;
    const coverage = inputs.coverage as number;
    const projectArea = pw * ph;
    const coveredArea = projectArea * (coverage / 100);
    const tileWithGap = tileSize + gap;
    const tilesAcross = Math.floor(pw / tileWithGap);
    const tilesDown = Math.floor(ph / tileWithGap);
    const totalTiles = Math.ceil(tilesAcross * tilesDown * (coverage / 100));
    const wasteTiles = Math.ceil(totalTiles * 0.15);
    const tilesToBuy = totalTiles + wasteTiles;
    const groutArea = coveredArea - (totalTiles * tileSize * tileSize);
    const groutOz = Math.round(Math.max(groutArea, 0) * 0.5 * 10) / 10;
    return {
      primary: { label: "Tiles Needed (with waste)", value: formatNumber(tilesToBuy) },
      details: [
        { label: "Exact Tile Count", value: formatNumber(totalTiles) },
        { label: "Extra for Waste (15%)", value: formatNumber(wasteTiles) },
        { label: "Grout Needed", value: formatNumber(groutOz) + " oz" },
        { label: "Project Area", value: formatNumber(Math.round(projectArea * 10) / 10) + " sq in" }
      ]
    };
  }`,
  [
    { q: "How many mosaic tiles do I need?", a: "Divide your project area by the tile area (including grout gaps), then add 10 to 15 percent for breakage and waste during cutting." },
    { q: "What size mosaic tile is best for beginners?", a: "Three quarter inch tiles are the most versatile for beginners. They are large enough to handle easily but small enough for good detail." },
    { q: "How much grout do I need for mosaics?", a: "Grout amount depends on gap width and tile thickness. A general rule is about 0.5 ounces per square inch of grout area for standard craft mosaics." }
  ],
  `Tiles = floor(Width / (Tile + Gap)) x floor(Height / (Tile + Gap)) x Coverage%
Tiles to Buy = Tiles + 15% waste
Grout = Grout Area x 0.5 oz per sq inch`,
  ["stained-glass-area-calculator", "resin-art-volume-calculator"]
);

add(
  "crochet-hook-size-calculator",
  "Crochet Hook Size Calculator",
  "Determine the recommended crochet hook size based on yarn weight, gauge swatch measurements, and desired fabric density.",
  "Everyday",
  "everyday",
  "~",
  ["crochet hook size", "crochet gauge", "hook recommendation", "crochet calculator"],
  [
    '{ name: "yarnWeight", label: "Yarn Weight", type: "select", options: [{ value: "1", label: "Lace (0)" }, { value: "2", label: "Fingering (1)" }, { value: "3", label: "Sport (2)" }, { value: "4", label: "DK (3)" }, { value: "5", label: "Worsted (4)" }, { value: "6", label: "Bulky (5)" }, { value: "7", label: "Super Bulky (6)" }], defaultValue: "5" }',
    '{ name: "swatchStitches", label: "Stitches in 4-inch Swatch", type: "number", min: 4, max: 40, defaultValue: 16 }',
    '{ name: "targetStitches", label: "Target Stitches per 4 inches", type: "number", min: 4, max: 40, defaultValue: 16 }',
    '{ name: "density", label: "Desired Fabric Feel", type: "select", options: [{ value: "1", label: "Tight/Dense" }, { value: "2", label: "Standard" }, { value: "3", label: "Loose/Drapey" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const yarnWeight = parseInt(inputs.yarnWeight as string);
    const swatchSt = inputs.swatchStitches as number;
    const targetSt = inputs.targetStitches as number;
    const density = parseInt(inputs.density as string);
    const baseHookMm = { 1: 2.0, 2: 2.75, 3: 3.5, 4: 4.0, 5: 5.0, 6: 6.5, 7: 9.0 };
    const baseMm = baseHookMm[yarnWeight] || 5.0;
    const gaugeAdj = (swatchSt - targetSt) * 0.25;
    const densityAdj = density === 1 ? -0.5 : density === 3 ? 0.5 : 0;
    const hookMm = Math.round((baseMm + gaugeAdj + densityAdj) * 4) / 4;
    const usLetters = { 2.0: "B/1", 2.25: "B/1", 2.75: "C/2", 3.25: "D/3", 3.5: "E/4", 3.75: "F/5", 4.0: "G/6", 4.5: "7", 5.0: "H/8", 5.5: "I/9", 6.0: "J/10", 6.5: "K/10.5", 8.0: "L/11", 9.0: "M/13", 10.0: "N/15" };
    const closest = Object.keys(usLetters).map(Number).reduce((a, b) => Math.abs(b - hookMm) < Math.abs(a - hookMm) ? b : a);
    const usLetter = usLetters[closest] || "--";
    return {
      primary: { label: "Recommended Hook", value: formatNumber(hookMm) + " mm" },
      details: [
        { label: "US Letter Size", value: usLetter },
        { label: "Base Hook for Yarn", value: formatNumber(baseMm) + " mm" },
        { label: "Gauge Adjustment", value: (gaugeAdj >= 0 ? "+" : "") + formatNumber(gaugeAdj) + " mm" },
        { label: "Density Adjustment", value: (densityAdj >= 0 ? "+" : "") + formatNumber(densityAdj) + " mm" }
      ]
    };
  }`,
  [
    { q: "How do I choose a crochet hook size?", a: "Start with the hook size recommended on the yarn label. Make a gauge swatch and adjust up if your stitches are too tight or down if too loose." },
    { q: "Does hook material affect gauge?", a: "Yes. Aluminum hooks tend to produce tighter stitches while bamboo and wood hooks give slightly looser gauge due to friction differences." },
    { q: "What is gauge in crochet?", a: "Gauge is the number of stitches and rows per inch or per 4 inches. Matching gauge ensures your finished project is the correct size." }
  ],
  `Hook (mm) = Base Hook Size + Gauge Adjustment + Density Adjustment
Gauge Adj = (Swatch Stitches - Target Stitches) x 0.25 mm`,
  ["yarn-yardage-calculator", "cross-stitch-fabric-calculator"]
);

add(
  "sewing-pattern-sizing-calculator",
  "Sewing Pattern Sizing Calculator",
  "Determine your sewing pattern size and adjustments needed based on body measurements and ease preferences.",
  "Everyday",
  "everyday",
  "~",
  ["sewing pattern size", "pattern sizing", "sewing measurements", "garment ease"],
  [
    '{ name: "bust", label: "Bust Measurement (inches)", type: "number", min: 28, max: 60, defaultValue: 36 }',
    '{ name: "waist", label: "Waist Measurement (inches)", type: "number", min: 22, max: 55, defaultValue: 28 }',
    '{ name: "hip", label: "Hip Measurement (inches)", type: "number", min: 30, max: 60, defaultValue: 38 }',
    '{ name: "ease", label: "Desired Ease", type: "select", options: [{ value: "1", label: "Close-fitting (+1-2 in)" }, { value: "2", label: "Standard (+3-4 in)" }, { value: "3", label: "Loose (+5-6 in)" }, { value: "4", label: "Oversized (+8+ in)" }], defaultValue: "2" }',
    '{ name: "patternType", label: "Pattern Type", type: "select", options: [{ value: "1", label: "Top/Blouse" }, { value: "2", label: "Dress" }, { value: "3", label: "Pants/Skirt" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const bust = inputs.bust as number;
    const waist = inputs.waist as number;
    const hip = inputs.hip as number;
    const ease = parseInt(inputs.ease as string);
    const patternType = parseInt(inputs.patternType as string);
    const easeValues = { 1: 1.5, 2: 3.5, 3: 5.5, 4: 8 };
    const easeAmt = easeValues[ease] || 3.5;
    const bustWithEase = bust + easeAmt;
    const waistWithEase = waist + easeAmt;
    const hipWithEase = hip + easeAmt;
    const sizeChart = [
      { size: 4, bust: 31.5, waist: 23.5, hip: 33.5 },
      { size: 6, bust: 32.5, waist: 24.5, hip: 34.5 },
      { size: 8, bust: 33.5, waist: 25.5, hip: 35.5 },
      { size: 10, bust: 35, waist: 27, hip: 37 },
      { size: 12, bust: 36.5, waist: 28.5, hip: 38.5 },
      { size: 14, bust: 38, waist: 30, hip: 40 },
      { size: 16, bust: 40, waist: 32, hip: 42 },
      { size: 18, bust: 42, waist: 34, hip: 44 },
      { size: 20, bust: 44, waist: 36, hip: 46 }
    ];
    const primary = patternType === 3 ? hip : bust;
    const matchField = patternType === 3 ? "hip" : "bust";
    let bestSize = sizeChart[0];
    for (let i = 0; i < sizeChart.length; i++) {
      if (primary <= sizeChart[i][matchField]) {
        bestSize = sizeChart[i];
        break;
      }
      if (i === sizeChart.length - 1) bestSize = sizeChart[i];
    }
    const bustDiff = Math.round((bust - bestSize.bust) * 10) / 10;
    const waistDiff = Math.round((waist - bestSize.waist) * 10) / 10;
    const hipDiff = Math.round((hip - bestSize.hip) * 10) / 10;
    return {
      primary: { label: "Pattern Size", value: formatNumber(bestSize.size) },
      details: [
        { label: "Bust Adjustment", value: (bustDiff >= 0 ? "+" : "") + formatNumber(bustDiff) + " in" },
        { label: "Waist Adjustment", value: (waistDiff >= 0 ? "+" : "") + formatNumber(waistDiff) + " in" },
        { label: "Hip Adjustment", value: (hipDiff >= 0 ? "+" : "") + formatNumber(hipDiff) + " in" },
        { label: "Ease Added", value: formatNumber(easeAmt) + " inches" }
      ]
    };
  }`,
  [
    { q: "How do I find my sewing pattern size?", a: "Measure your bust, waist, and hips at the fullest points. Compare to the pattern size chart. For tops, match your bust. For skirts and pants, match your hip measurement." },
    { q: "What is ease in sewing?", a: "Ease is extra room built into a pattern beyond your body measurements. Wearing ease allows movement. Design ease creates the style silhouette." },
    { q: "What if I am between pattern sizes?", a: "Cut the larger size and adjust fit during construction. You can also grade between sizes, cutting one size at the bust and another at the hip." }
  ],
  `Pattern Size = Closest size match to primary measurement (bust for tops, hip for bottoms)
Adjustments = Body Measurement - Pattern Size Chart Measurement`,
  ["quilt-fabric-calculator", "fabric-yardage-calculator"]
);

add(
  "tie-dye-fabric-calculator",
  "Tie-Dye Fabric Calculator",
  "Calculate dye powder, soda ash, and water quantities for tie-dye projects based on fabric weight and number of items.",
  "Everyday",
  "everyday",
  "~",
  ["tie dye calculator", "fabric dye amount", "tie dye supplies", "dye powder calculator"],
  [
    '{ name: "numItems", label: "Number of Items", type: "number", min: 1, max: 50, defaultValue: 6 }',
    '{ name: "itemWeight", label: "Avg Item Weight (oz)", type: "number", min: 2, max: 32, defaultValue: 6 }',
    '{ name: "dyeType", label: "Dye Type", type: "select", options: [{ value: "1", label: "Procion MX (powder)" }, { value: "2", label: "Liquid Dye" }, { value: "3", label: "All-Purpose (Rit)" }], defaultValue: "1" }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "intensity", label: "Color Intensity", type: "select", options: [{ value: "1", label: "Pastel" }, { value: "2", label: "Medium" }, { value: "3", label: "Dark/Vibrant" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const numItems = inputs.numItems as number;
    const itemWeight = inputs.itemWeight as number;
    const dyeType = parseInt(inputs.dyeType as string);
    const numColors = inputs.numColors as number;
    const intensity = parseInt(inputs.intensity as string);
    const totalFabricOz = numItems * itemWeight;
    const tspPerOzFabric = { 1: 0.15, 2: 0.5, 3: 0.3 };
    const intensityMult = { 1: 0.5, 2: 1.0, 3: 2.0 };
    const dyePerOz = (tspPerOzFabric[dyeType] || 0.15) * (intensityMult[intensity] || 1.0);
    const totalDyeTsp = totalFabricOz * dyePerOz;
    const dyePerColor = Math.round(totalDyeTsp / numColors * 10) / 10;
    const sodaAshTsp = totalFabricOz * 0.2;
    const waterCups = totalFabricOz * 0.5;
    return {
      primary: { label: "Total Dye Needed", value: formatNumber(Math.round(totalDyeTsp * 10) / 10) + " tsp" },
      details: [
        { label: "Dye Per Color", value: formatNumber(dyePerColor) + " tsp" },
        { label: "Soda Ash", value: formatNumber(Math.round(sodaAshTsp * 10) / 10) + " tsp" },
        { label: "Water for Dye", value: formatNumber(Math.round(waterCups * 10) / 10) + " cups" },
        { label: "Total Fabric Weight", value: formatNumber(totalFabricOz) + " oz" }
      ]
    };
  }`,
  [
    { q: "How much dye do I need for tie-dye?", a: "For Procion MX dye, use about 2 to 4 teaspoons of dye powder per 8 ounces of fabric for medium colors. Double for dark or vibrant results." },
    { q: "What is soda ash for in tie-dye?", a: "Soda ash (sodium carbonate) is a fixative that raises the pH to allow fiber-reactive dyes like Procion MX to bond permanently with cotton fibers." },
    { q: "Can I tie-dye polyester?", a: "Standard fiber-reactive dyes only work on natural fibers like cotton. Polyester requires disperse dyes and high heat. Cotton or cotton blends with at least 60 percent cotton work best." }
  ],
  `Total Dye (tsp) = Total Fabric Weight x Dye Rate x Intensity Multiplier
Dye Per Color = Total Dye / Number of Colors
Soda Ash = Fabric Weight x 0.2 tsp per oz`,
  ["candle-making-wax-calculator", "soap-making-lye-calculator"]
);

add(
  "flower-arrangement-cost-calculator",
  "Flower Arrangement Cost Calculator",
  "Estimate the cost of floral arrangements based on flower types, quantities, and arrangement style.",
  "Finance",
  "finance",
  "$",
  ["flower arrangement cost", "floral budget", "bouquet price", "wedding flowers cost"],
  [
    '{ name: "arrangementType", label: "Arrangement Type", type: "select", options: [{ value: "1", label: "Bouquet" }, { value: "2", label: "Centerpiece" }, { value: "3", label: "Corsage/Boutonniere" }, { value: "4", label: "Large Urn/Altar" }], defaultValue: "1" }',
    '{ name: "flowerTier", label: "Flower Tier", type: "select", options: [{ value: "1", label: "Budget (Carnations, Daisies)" }, { value: "2", label: "Mid-Range (Roses, Lilies)" }, { value: "3", label: "Premium (Peonies, Orchids)" }], defaultValue: "2" }',
    '{ name: "numArrangements", label: "Number of Arrangements", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "greenery", label: "Greenery Level", type: "select", options: [{ value: "1", label: "Minimal" }, { value: "2", label: "Standard" }, { value: "3", label: "Lush/Full" }], defaultValue: "2" }',
    '{ name: "season", label: "Season", type: "select", options: [{ value: "1", label: "In Season" }, { value: "2", label: "Off Season" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const arrType = parseInt(inputs.arrangementType as string);
    const tier = parseInt(inputs.flowerTier as string);
    const numArr = inputs.numArrangements as number;
    const greenery = parseInt(inputs.greenery as string);
    const season = parseInt(inputs.season as string);
    const baseCost = { 1: 45, 2: 55, 3: 15, 4: 120 };
    const tierMult = { 1: 0.6, 2: 1.0, 3: 1.8 };
    const greeneryAdd = { 1: 0, 2: 8, 3: 18 };
    const seasonMult = season === 2 ? 1.3 : 1.0;
    const costPerArr = ((baseCost[arrType] || 45) * (tierMult[tier] || 1.0) + (greeneryAdd[greenery] || 8)) * seasonMult;
    const totalCost = costPerArr * numArr;
    const deliveryFee = totalCost > 200 ? 0 : 25;
    const grandTotal = totalCost + deliveryFee;
    return {
      primary: { label: "Cost Per Arrangement", value: "$" + formatNumber(Math.round(costPerArr * 100) / 100) },
      details: [
        { label: "Total for All", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Number of Arrangements", value: formatNumber(numArr) },
        { label: "Delivery Fee", value: deliveryFee === 0 ? "Free (over $200)" : "$" + formatNumber(deliveryFee) },
        { label: "Grand Total", value: "$" + formatNumber(Math.round(grandTotal * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much do flower arrangements cost?", a: "A simple bouquet starts around 25 to 40 dollars. Centerpieces run 40 to 80 dollars. Large altar arrangements can cost 100 to 300 dollars or more depending on flowers used." },
    { q: "Are wedding flowers more expensive?", a: "Wedding flowers often cost more due to design time, delivery, setup, and the expectation of premium blooms. Valentine's Day and Mother's Day also drive prices up." },
    { q: "How can I save money on flowers?", a: "Use in-season flowers, choose more greenery, use budget-friendly blooms as filler, and keep arrangements smaller. Buying wholesale for DIY arrangements can save 40 to 60 percent." }
  ],
  `Cost Per Arrangement = (Base Cost x Flower Tier Multiplier + Greenery Add-on) x Season Multiplier
Total Cost = Cost Per Arrangement x Number of Arrangements`,
  ["candle-making-wax-calculator", "leather-working-cost-calculator"]
);

add(
  "card-making-supplies-calculator",
  "Card Making Supplies Calculator",
  "Calculate cardstock, envelopes, and embellishment quantities for handmade card projects.",
  "Everyday",
  "everyday",
  "~",
  ["card making supplies", "handmade card calculator", "greeting card materials", "cardstock calculator"],
  [
    '{ name: "numCards", label: "Number of Cards", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "cardSize", label: "Card Size", type: "select", options: [{ value: "1", label: "A2 (4.25x5.5)" }, { value: "2", label: "A6 (4.5x6.25)" }, { value: "3", label: "A7 (5x7)" }, { value: "4", label: "Square (5.5x5.5)" }], defaultValue: "1" }',
    '{ name: "layers", label: "Number of Card Layers", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "embellishments", label: "Embellishment Level", type: "select", options: [{ value: "1", label: "None/Minimal" }, { value: "2", label: "Moderate (ribbon, gems)" }, { value: "3", label: "Elaborate (die cuts, stamps)" }], defaultValue: "2" }',
    '{ name: "includeEnvelopes", label: "Include Envelopes", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const numCards = inputs.numCards as number;
    const cardSize = parseInt(inputs.cardSize as string);
    const layers = inputs.layers as number;
    const embLevel = parseInt(inputs.embellishments as string);
    const inclEnv = parseInt(inputs.includeEnvelopes as string);
    const cardDims = { 1: [8.5, 5.5], 2: [9, 6.25], 3: [10, 7], 4: [11, 5.5] };
    const dims = cardDims[cardSize] || [8.5, 5.5];
    const sheetArea = 12 * 12;
    const cardArea = dims[0] * dims[1];
    const cardsPerSheet = Math.floor(sheetArea / cardArea);
    const baseSheetsNeeded = Math.ceil(numCards / Math.max(cardsPerSheet, 1));
    const totalSheets = baseSheetsNeeded * layers;
    const embCostPer = { 1: 0.1, 2: 0.5, 3: 1.5 };
    const sheetCost = totalSheets * 0.5;
    const embCost = numCards * (embCostPer[embLevel] || 0.5);
    const envCost = inclEnv === 1 ? numCards * 0.25 : 0;
    const totalCost = sheetCost + embCost + envCost;
    const costPerCard = totalCost / numCards;
    return {
      primary: { label: "Cardstock Sheets Needed", value: formatNumber(totalSheets) },
      details: [
        { label: "Cards Per Sheet", value: formatNumber(cardsPerSheet) },
        { label: "Cardstock Cost", value: "$" + formatNumber(Math.round(sheetCost * 100) / 100) },
        { label: "Embellishment Cost", value: "$" + formatNumber(Math.round(embCost * 100) / 100) },
        { label: "Cost Per Card", value: "$" + formatNumber(Math.round(costPerCard * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to make handmade cards?", a: "A simple handmade card costs about 50 cents to 1 dollar in materials. Elaborate cards with die cuts, stamps, and special papers can cost 2 to 5 dollars each." },
    { q: "What cardstock weight is best for card making?", a: "Use 80 to 110 lb cardstock for card bases. Lighter weights (65 lb) work for decorative layers. Heavier weights can be difficult to fold cleanly." },
    { q: "What size envelopes do I need?", a: "A2 cards use A2 envelopes (4.375 x 5.75). A7 cards use A7 envelopes (5.25 x 7.25). Always buy envelopes slightly larger than the card." }
  ],
  `Sheets = ceil(Cards / Cards Per Sheet) x Layers
Cost = (Sheets x $0.50) + (Cards x Embellishment Cost) + Envelope Cost
Cost Per Card = Total Cost / Number of Cards`,
  ["paper-crafting-sheets-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "jewelry-wire-calculator",
  "Jewelry Wire Calculator",
  "Calculate wire length, gauge recommendations, and cost for jewelry making projects based on design type and dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["jewelry wire", "wire wrapping calculator", "beading wire", "jewelry making supplies"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Simple Chain/Necklace" }, { value: "2", label: "Wire Wrapped Pendant" }, { value: "3", label: "Bracelet" }, { value: "4", label: "Earrings (pair)" }, { value: "5", label: "Wire Wrapped Ring" }], defaultValue: "1" }',
    '{ name: "designLength", label: "Finished Length (inches)", type: "number", min: 1, max: 36, defaultValue: 18 }',
    '{ name: "wireGauge", label: "Wire Gauge", type: "select", options: [{ value: "1", label: "18 gauge (Heavy)" }, { value: "2", label: "20 gauge (Medium)" }, { value: "3", label: "22 gauge (Fine)" }, { value: "4", label: "24 gauge (Thin)" }, { value: "5", label: "26 gauge (Extra Thin)" }], defaultValue: "3" }',
    '{ name: "wireMaterial", label: "Wire Material", type: "select", options: [{ value: "1", label: "Copper" }, { value: "2", label: "Sterling Silver" }, { value: "3", label: "Gold-Filled" }, { value: "4", label: "Craft Wire" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Design Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const designLen = inputs.designLength as number;
    const gauge = parseInt(inputs.wireGauge as string);
    const material = parseInt(inputs.wireMaterial as string);
    const complexity = parseInt(inputs.complexity as string);
    const projMultiplier = { 1: 1.3, 2: 5, 3: 1.5, 4: 3, 5: 4 };
    const complexMult = { 1: 1.0, 2: 1.5, 3: 2.5 };
    const mult = (projMultiplier[projType] || 1.5) * (complexMult[complexity] || 1.5);
    const wireInches = Math.round(designLen * mult);
    const wireFeet = Math.round(wireInches / 12 * 10) / 10;
    const pricePerFoot = { 1: 0.15, 2: 2.5, 3: 4.0, 4: 0.08 };
    const gaugePriceMult = { 1: 2.0, 2: 1.5, 3: 1.0, 4: 0.7, 5: 0.5 };
    const costPerFt = (pricePerFoot[material] || 0.15) * (gaugePriceMult[gauge] || 1.0);
    const totalCost = wireFeet * costPerFt;
    return {
      primary: { label: "Wire Needed", value: formatNumber(wireInches) + " inches" },
      details: [
        { label: "Wire in Feet", value: formatNumber(wireFeet) + " ft" },
        { label: "Cost Per Foot", value: "$" + formatNumber(Math.round(costPerFt * 100) / 100) },
        { label: "Total Wire Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Multiplier Used", value: formatNumber(Math.round(mult * 10) / 10) + "x" }
      ]
    };
  }`,
  [
    { q: "How much wire do I need for a wrapped pendant?", a: "A wire-wrapped pendant typically requires 3 to 5 feet of wire depending on stone size and wrapping complexity. Practice pieces first to get an accurate estimate." },
    { q: "What gauge wire is best for jewelry?", a: "20 gauge is good for structural elements and ear wires. 22 to 24 gauge works for wire wrapping. 26 gauge is used for intricate weaving and coiling." },
    { q: "Is sterling silver wire worth the cost?", a: "Sterling silver produces professional results and does not cause skin reactions. For practice and learning, use copper wire which behaves similarly at a fraction of the cost." }
  ],
  `Wire Needed = Finished Length x Project Multiplier x Complexity Multiplier
Cost = Wire (feet) x Price Per Foot x Gauge Multiplier`,
  ["bead-pattern-calculator", "leather-working-cost-calculator"]
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch12.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch12.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch12.txt`);
console.log(`Registry saved to: scripts/new-regs-batch12.txt`);
