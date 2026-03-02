add('antenna-gain-calculator', 'Antenna Gain Calculator',
  'Calculate antenna gain in dBi from efficiency and aperture.',
  'Science', 'science', 'A',
  ['antenna gain', 'dBi calculator'],
  [
    '{ name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 100000, defaultValue: 2400 }',
    '{ name: "diameter", label: "Dish Diameter (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 }',
    '{ name: "efficiency", label: "Aperture Efficiency (%)", type: "number", min: 10, max: 100, defaultValue: 55 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const dia = inputs.diameter as number;
      const eff = inputs.efficiency as number;
      if (!freq || !dia || !eff) return null;
      const wavelength = 300 / freq;
      const area = Math.PI * Math.pow(dia / 2, 2);
      const gainLinear = (eff / 100) * 4 * Math.PI * area / Math.pow(wavelength, 2);
      const gainDbi = Math.round(10 * Math.log10(gainLinear) * 100) / 100;
      return {
        primary: { label: "Antenna Gain", value: formatNumber(gainDbi) + " dBi" },
        details: [
          { label: "Wavelength", value: formatNumber(Math.round(wavelength * 1000) / 1000) + " m" },
          { label: "Aperture Area", value: formatNumber(Math.round(area * 1000) / 1000) + " sq m" },
          { label: "Linear Gain", value: formatNumber(Math.round(gainLinear * 100) / 100) },
        ],
      };
  }`,
  [{ q: 'What is antenna gain in dBi?', a: 'Gain in dBi is the directional power relative to an isotropic radiator.' },
   { q: 'Does a larger dish mean more gain?', a: 'Yes. Doubling the diameter roughly adds 6 dB of gain.' }],
  'Gain (dBi) = 10 log10(efficiency x 4 pi A / wavelength^2)',
  []
);

add('link-budget-calculator', 'Link Budget Calculator',
  'Calculate RF link margin from transmit power and losses.',
  'Science', 'science', 'A',
  ['link budget', 'RF link margin calculator'],
  [
    '{ name: "txPower", label: "Transmit Power (dBm)", type: "number", min: -30, max: 60, defaultValue: 30 }',
    '{ name: "txGain", label: "Tx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 }',
    '{ name: "rxGain", label: "Rx Antenna Gain (dBi)", type: "number", min: 0, max: 60, defaultValue: 10 }',
    '{ name: "pathLoss", label: "Path Loss (dB)", type: "number", min: 0, max: 300, defaultValue: 100 }',
    '{ name: "rxSensitivity", label: "Rx Sensitivity (dBm)", type: "number", min: -130, max: 0, defaultValue: -90 }',
  ],
  `(inputs) => {
      const txP = inputs.txPower as number;
      const txG = inputs.txGain as number;
      const rxG = inputs.rxGain as number;
      const pl = inputs.pathLoss as number;
      const rxS = inputs.rxSensitivity as number;
      if (txP === undefined || !txG || !rxG || !pl || !rxS) return null;
      const received = txP + txG + rxG - pl;
      const margin = Math.round((received - rxS) * 100) / 100;
      return {
        primary: { label: "Link Margin", value: formatNumber(margin) + " dB" },
        details: [
          { label: "Received Power", value: formatNumber(received) + " dBm" },
          { label: "EIRP", value: formatNumber(txP + txG) + " dBm" },
          { label: "Status", value: margin > 0 ? "Link Viable" : "Link Fails" },
        ],
      };
  }`,
  [{ q: 'What is a link budget?', a: 'It sums gains and subtracts losses to find the received signal margin.' },
   { q: 'What link margin is considered safe?', a: 'A margin of at least 10 dB provides a reliable link.' }],
  'Margin = Tx Power + Tx Gain + Rx Gain - Path Loss - Rx Sensitivity',
  []
);

add('free-space-path-loss-calculator', 'Free Space Path Loss Calculator',
  'Calculate free space path loss in dB for a given distance.',
  'Science', 'science', 'A',
  ['FSPL', 'free space path loss'],
  [
    '{ name: "frequency", label: "Frequency (MHz)", type: "number", min: 1, max: 300000, defaultValue: 2400 }',
    '{ name: "distance", label: "Distance (km)", type: "number", min: 0.001, max: 100000, defaultValue: 1 }',
  ],
  `(inputs) => {
      const freq = inputs.frequency as number;
      const dist = inputs.distance as number;
      if (!freq || !dist) return null;
      const fspl = Math.round((20 * Math.log10(dist) + 20 * Math.log10(freq) + 32.44) * 100) / 100;
      const wavelength = Math.round(300 / freq * 10000) / 10000;
      return {
        primary: { label: "Free Space Path Loss", value: formatNumber(fspl) + " dB" },
        details: [
          { label: "Frequency", value: formatNumber(freq) + " MHz" },
          { label: "Distance", value: formatNumber(dist) + " km" },
          { label: "Wavelength", value: formatNumber(wavelength) + " m" },
        ],
      };
  }`,
  [{ q: 'What is free space path loss?', a: 'It is the signal attenuation over distance in open air with no obstacles.' },
   { q: 'Does FSPL depend on frequency?', a: 'Yes. Higher frequencies have greater free space path loss.' }],
  'FSPL (dB) = 20 log10(d) + 20 log10(f) + 32.44',
  []
);

add('coax-cable-loss-calculator', 'Coax Cable Loss Calculator',
  'Calculate signal attenuation through coaxial cable.',
  'Science', 'science', 'A',
  ['coax loss', 'cable attenuation calculator'],
  [
    '{ name: "cableLength", label: "Cable Length (ft)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "lossPerFt", label: "Loss Per 100 ft (dB)", type: "number", min: 0.1, max: 50, defaultValue: 6.1 }',
    '{ name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "connLoss", label: "Loss Per Connector (dB)", type: "number", min: 0, max: 3, defaultValue: 0.5 }',
  ],
  `(inputs) => {
      const len = inputs.cableLength as number;
      const lossPer = inputs.lossPerFt as number;
      const conn = inputs.connectors as number;
      const connL = inputs.connLoss as number;
      if (!len || !lossPer) return null;
      const cableLoss = Math.round(len / 100 * lossPer * 100) / 100;
      const connectorLoss = Math.round(conn * connL * 100) / 100;
      const totalLoss = Math.round((cableLoss + connectorLoss) * 100) / 100;
      return {
        primary: { label: "Total Loss", value: formatNumber(totalLoss) + " dB" },
        details: [
          { label: "Cable Loss", value: formatNumber(cableLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connectorLoss) + " dB" },
          { label: "Cable Length", value: formatNumber(len) + " ft" },
        ],
      };
  }`,
  [{ q: 'What causes loss in coaxial cable?', a: 'Resistance in the conductor and dielectric absorption cause signal loss.' },
   { q: 'Which coax cable has the lowest loss?', a: 'LMR-400 and similar low-loss cables are best for long runs.' }],
  'Total Loss = (Length / 100 x Loss per 100 ft) + (Connectors x Connector Loss)',
  []
);

add('fiber-optic-loss-calculator', 'Fiber Optic Loss Calculator',
  'Calculate total loss in a fiber optic link.',
  'Science', 'science', 'A',
  ['fiber optic loss', 'fiber link budget'],
  [
    '{ name: "fiberLength", label: "Fiber Length (km)", type: "number", min: 0.01, max: 200, defaultValue: 10 }',
    '{ name: "fiberLoss", label: "Fiber Loss (dB/km)", type: "number", min: 0.1, max: 5, defaultValue: 0.35 }',
    '{ name: "splices", label: "Number of Splices", type: "number", min: 0, max: 50, defaultValue: 4 }',
    '{ name: "connectors", label: "Number of Connectors", type: "number", min: 0, max: 20, defaultValue: 2 }',
  ],
  `(inputs) => {
      const len = inputs.fiberLength as number;
      const loss = inputs.fiberLoss as number;
      const splices = inputs.splices as number;
      const conn = inputs.connectors as number;
      if (!len || !loss) return null;
      const fiberAtten = Math.round(len * loss * 100) / 100;
      const spliceLoss = Math.round(splices * 0.1 * 100) / 100;
      const connLoss = Math.round(conn * 0.5 * 100) / 100;
      const total = Math.round((fiberAtten + spliceLoss + connLoss) * 100) / 100;
      return {
        primary: { label: "Total Link Loss", value: formatNumber(total) + " dB" },
        details: [
          { label: "Fiber Attenuation", value: formatNumber(fiberAtten) + " dB" },
          { label: "Splice Loss", value: formatNumber(spliceLoss) + " dB" },
          { label: "Connector Loss", value: formatNumber(connLoss) + " dB" },
        ],
      };
  }`,
  [{ q: 'What is typical fiber loss per km?', a: 'Single mode fiber has about 0.35 dB/km at 1310 nm wavelength.' },
   { q: 'How much loss does a splice add?', a: 'A fusion splice adds about 0.1 dB of loss.' }],
  'Total = (Length x dB/km) + (Splices x 0.1) + (Connectors x 0.5)',
  []
);

add('signal-to-noise-calculator', 'Signal to Noise Calculator',
  'Calculate signal-to-noise ratio in decibels.',
  'Science', 'science', 'A',
  ['SNR calculator', 'signal to noise ratio'],
  [
    '{ name: "signalPower", label: "Signal Power (dBm)", type: "number", min: -120, max: 60, defaultValue: -40 }',
    '{ name: "noisePower", label: "Noise Power (dBm)", type: "number", min: -150, max: 0, defaultValue: -90 }',
  ],
  `(inputs) => {
      const sig = inputs.signalPower as number;
      const noise = inputs.noisePower as number;
      if (sig === undefined || noise === undefined) return null;
      const snr = Math.round((sig - noise) * 100) / 100;
      const sigLin = Math.pow(10, sig / 10);
      const noiseLin = Math.pow(10, noise / 10);
      const ratioLin = Math.round(sigLin / noiseLin * 100) / 100;
      const quality = snr > 40 ? "Excellent" : snr > 25 ? "Good" : snr > 15 ? "Fair" : "Poor";
      return {
        primary: { label: "SNR", value: formatNumber(snr) + " dB" },
        details: [
          { label: "Linear Ratio", value: formatNumber(ratioLin) },
          { label: "Signal Quality", value: quality },
          { label: "Signal Power", value: formatNumber(sig) + " dBm" },
        ],
      };
  }`,
  [{ q: 'What is a good SNR value?', a: 'An SNR above 25 dB is considered good for most communication systems.' },
   { q: 'How is SNR calculated in dB?', a: 'SNR in dB equals signal power in dBm minus noise power in dBm.' }],
  'SNR (dB) = Signal Power (dBm) - Noise Power (dBm)',
  []
);

add('sampling-rate-calculator', 'Sampling Rate Calculator',
  'Calculate the minimum Nyquist sampling rate.',
  'Science', 'science', 'A',
  ['Nyquist rate', 'sampling frequency calculator'],
  [
    '{ name: "maxFrequency", label: "Max Signal Frequency (Hz)", type: "number", min: 1, max: 100000000000, defaultValue: 20000 }',
    '{ name: "oversampling", label: "Oversampling Factor", type: "number", min: 1, max: 64, defaultValue: 1 }',
  ],
  `(inputs) => {
      const fMax = inputs.maxFrequency as number;
      const over = inputs.oversampling as number;
      if (!fMax || !over) return null;
      const nyquist = 2 * fMax;
      const actual = nyquist * over;
      const period = Math.round(1 / actual * 1e12) / 1e6;
      return {
        primary: { label: "Minimum Sampling Rate", value: formatNumber(nyquist) + " Hz" },
        details: [
          { label: "With Oversampling", value: formatNumber(actual) + " Hz" },
          { label: "Sample Period", value: formatNumber(period) + " us" },
          { label: "Oversampling Factor", value: formatNumber(over) + "x" },
        ],
      };
  }`,
  [{ q: 'What is the Nyquist theorem?', a: 'It states the sampling rate must be at least twice the maximum frequency.' },
   { q: 'Why use oversampling?', a: 'Oversampling improves resolution and reduces aliasing artifacts.' }],
  'Nyquist Rate = 2 x Maximum Frequency',
  []
);

add('fft-bin-resolution-calculator', 'FFT Bin Resolution Calculator',
  'Calculate FFT frequency resolution from sample rate and size.',
  'Science', 'science', 'A',
  ['FFT resolution', 'frequency bin calculator'],
  [
    '{ name: "sampleRate", label: "Sample Rate (Hz)", type: "number", min: 1, max: 1000000000, defaultValue: 44100 }',
    '{ name: "fftSize", label: "FFT Size (points)", type: "number", min: 16, max: 1048576, defaultValue: 4096 }',
  ],
  `(inputs) => {
      const fs = inputs.sampleRate as number;
      const n = inputs.fftSize as number;
      if (!fs || !n) return null;
      const binRes = Math.round(fs / n * 10000) / 10000;
      const maxFreq = fs / 2;
      const numBins = n / 2;
      const windowTime = Math.round(n / fs * 10000) / 10000;
      return {
        primary: { label: "Frequency Resolution", value: formatNumber(binRes) + " Hz" },
        details: [
          { label: "Number of Bins", value: formatNumber(numBins) },
          { label: "Max Frequency", value: formatNumber(maxFreq) + " Hz" },
          { label: "Window Duration", value: formatNumber(windowTime) + " s" },
        ],
      };
  }`,
  [{ q: 'How do I improve FFT frequency resolution?', a: 'Increase the FFT size or lower the sample rate to get finer bins.' },
   { q: 'What is an FFT bin?', a: 'Each bin represents a frequency range equal to sample rate divided by FFT size.' }],
  'Bin Resolution = Sample Rate / FFT Size',
  []
);

add('decibel-addition-calculator', 'Decibel Addition Calculator',
  'Add two or more decibel levels together correctly.',
  'Science', 'science', 'A',
  ['dB addition', 'decibel sum calculator'],
  [
    '{ name: "db1", label: "Level 1 (dB)", type: "number", min: 0, max: 200, defaultValue: 90 }',
    '{ name: "db2", label: "Level 2 (dB)", type: "number", min: 0, max: 200, defaultValue: 87 }',
    '{ name: "db3", label: "Level 3 (dB, 0 to skip)", type: "number", min: 0, max: 200, defaultValue: 0 }',
  ],
  `(inputs) => {
      const d1 = inputs.db1 as number;
      const d2 = inputs.db2 as number;
      const d3 = inputs.db3 as number;
      if (!d1 && !d2) return null;
      let sum = Math.pow(10, d1 / 10) + Math.pow(10, d2 / 10);
      if (d3 > 0) sum += Math.pow(10, d3 / 10);
      const total = Math.round(10 * Math.log10(sum) * 100) / 100;
      const increase = Math.round((total - Math.max(d1, d2, d3)) * 100) / 100;
      return {
        primary: { label: "Combined Level", value: formatNumber(total) + " dB" },
        details: [
          { label: "Increase Over Loudest", value: formatNumber(increase) + " dB" },
          { label: "Source Count", value: d3 > 0 ? "3" : "2" },
          { label: "Loudest Source", value: formatNumber(Math.max(d1, d2, d3)) + " dB" },
        ],
      };
  }`,
  [{ q: 'Can you simply add dB values?', a: 'No. Decibels are logarithmic, so you must convert to linear first.' },
   { q: 'What does adding two equal dB levels give?', a: 'Two equal sources add about 3 dB to the individual level.' }],
  'Total dB = 10 log10(10^(dB1/10) + 10^(dB2/10) + ...)',
  []
);

add('sound-intensity-calculator', 'Sound Intensity Calculator',
  'Calculate sound intensity in watts per square meter from dB.',
  'Science', 'science', 'A',
  ['sound intensity', 'dB to intensity'],
  [
    '{ name: "spl", label: "Sound Pressure Level (dB)", type: "number", min: 0, max: 194, defaultValue: 85 }',
  ],
  `(inputs) => {
      const spl = inputs.spl as number;
      if (spl === undefined) return null;
      const refIntensity = 1e-12;
      const intensity = refIntensity * Math.pow(10, spl / 10);
      const pressure = 0.00002 * Math.pow(10, spl / 20);
      const desc = spl < 60 ? "Quiet" : spl < 85 ? "Moderate" : spl < 120 ? "Loud" : "Dangerous";
      return {
        primary: { label: "Sound Intensity", value: intensity.toExponential(3) + " W/sq m" },
        details: [
          { label: "Sound Pressure", value: (Math.round(pressure * 10000) / 10000) + " Pa" },
          { label: "SPL", value: formatNumber(spl) + " dB" },
          { label: "Loudness Category", value: desc },
        ],
      };
  }`,
  [{ q: 'What is the reference intensity for dB?', a: 'The reference is 10^-12 W/sq m, the threshold of human hearing.' },
   { q: 'At what dB level is sound dangerous?', a: 'Prolonged exposure above 85 dB can cause hearing damage.' }],
  'Intensity = 10^-12 x 10^(SPL/10) W/sq m',
  []
);

add('reverberation-distance-calculator', 'Reverberation Distance Calculator',
  'Calculate the critical distance in a room from RT60.',
  'Science', 'science', 'A',
  ['critical distance', 'reverberation distance'],
  [
    '{ name: "roomVolume", label: "Room Volume (cu m)", type: "number", min: 10, max: 100000, defaultValue: 200 }',
    '{ name: "rt60", label: "RT60 Reverberation Time (s)", type: "number", min: 0.1, max: 10, defaultValue: 1.2 }',
  ],
  `(inputs) => {
      const vol = inputs.roomVolume as number;
      const rt = inputs.rt60 as number;
      if (!vol || !rt) return null;
      const absorption = 0.161 * vol / rt;
      const dc = Math.round(0.057 * Math.sqrt(vol / rt) * 1000) / 1000;
      return {
        primary: { label: "Critical Distance", value: formatNumber(dc) + " m" },
        details: [
          { label: "RT60", value: formatNumber(rt) + " s" },
          { label: "Total Absorption", value: formatNumber(Math.round(absorption * 100) / 100) + " sabins" },
          { label: "Room Volume", value: formatNumber(vol) + " cu m" },
        ],
      };
  }`,
  [{ q: 'What is critical distance?', a: 'It is the distance where direct sound and reverberant sound are equal.' },
   { q: 'What is a good RT60 for a studio?', a: 'A recording studio typically targets an RT60 of 0.3 to 0.5 seconds.' }],
  'Dc = 0.057 x sqrt(Volume / RT60)',
  []
);

add('lens-focal-length-calculator', 'Lens Focal Length Calculator',
  'Calculate focal length from object and image distances.',
  'Science', 'science', 'A',
  ['focal length', 'thin lens calculator'],
  [
    '{ name: "objectDist", label: "Object Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 30 }',
    '{ name: "imageDist", label: "Image Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 60 }',
  ],
  `(inputs) => {
      const dO = inputs.objectDist as number;
      const dI = inputs.imageDist as number;
      if (!dO || !dI) return null;
      const f = Math.round(1 / (1 / dO + 1 / dI) * 1000) / 1000;
      const mag = Math.round(dI / dO * 1000) / 1000;
      const power = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Magnification", value: formatNumber(mag) + "x" },
          { label: "Optical Power", value: formatNumber(power) + " diopters" },
          { label: "Image Type", value: dI > 0 ? "Real" : "Virtual" },
        ],
      };
  }`,
  [{ q: 'What is the thin lens equation?', a: '1/f = 1/do + 1/di where f is focal length and d is distance.' },
   { q: 'What does a shorter focal length mean?', a: 'A shorter focal length means a stronger, more converging lens.' }],
  '1/f = 1/object_distance + 1/image_distance',
  []
);

add('magnifying-glass-calculator', 'Magnifying Glass Calculator',
  'Calculate magnification from the focal length of a lens.',
  'Science', 'science', 'A',
  ['magnification', 'magnifying glass power'],
  [
    '{ name: "focalLength", label: "Focal Length (cm)", type: "number", min: 0.5, max: 100, defaultValue: 10 }',
    '{ name: "nearPoint", label: "Near Point Distance (cm)", type: "number", min: 15, max: 40, defaultValue: 25 }',
  ],
  `(inputs) => {
      const f = inputs.focalLength as number;
      const np = inputs.nearPoint as number;
      if (!f || !np) return null;
      const magRelaxed = Math.round(np / f * 100) / 100;
      const magStrained = Math.round((np / f + 1) * 100) / 100;
      const powerDiopters = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Magnification (relaxed)", value: formatNumber(magRelaxed) + "x" },
        details: [
          { label: "Magnification (strained)", value: formatNumber(magStrained) + "x" },
          { label: "Lens Power", value: formatNumber(powerDiopters) + " diopters" },
          { label: "Focal Length", value: formatNumber(f) + " cm" },
        ],
      };
  }`,
  [{ q: 'How is magnification calculated?', a: 'Magnification equals the near point distance divided by the focal length.' },
   { q: 'What is the standard near point?', a: 'The standard near point of the human eye is 25 cm.' }],
  'Magnification = Near Point / Focal Length',
  []
);

add('mirror-focal-point-calculator', 'Mirror Focal Point Calculator',
  'Calculate the focal point of a concave mirror.',
  'Science', 'science', 'A',
  ['concave mirror', 'mirror focal point'],
  [
    '{ name: "radiusCurvature", label: "Radius of Curvature (cm)", type: "number", min: 1, max: 10000, defaultValue: 40 }',
    '{ name: "objectDist", label: "Object Distance (cm)", type: "number", min: 1, max: 100000, defaultValue: 60 }',
  ],
  `(inputs) => {
      const r = inputs.radiusCurvature as number;
      const dO = inputs.objectDist as number;
      if (!r || !dO) return null;
      const f = r / 2;
      const dI = Math.round(1 / (1 / f - 1 / dO) * 100) / 100;
      const mag = Math.round(-dI / dO * 1000) / 1000;
      const imageType = dI > 0 ? "Real and Inverted" : "Virtual and Upright";
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Image Distance", value: formatNumber(dI) + " cm" },
          { label: "Magnification", value: formatNumber(Math.abs(mag)) + "x" },
          { label: "Image Type", value: imageType },
        ],
      };
  }`,
  [{ q: 'How is focal length related to radius of curvature?', a: 'The focal length is exactly half the radius of curvature.' },
   { q: 'When does a concave mirror form a virtual image?', a: 'When the object is between the focal point and the mirror surface.' }],
  'f = R / 2; 1/f = 1/do + 1/di',
  []
);

add('snells-law-calculator', 'Snell Law Calculator',
  'Calculate the angle of refraction using Snell law.',
  'Science', 'science', 'A',
  ['Snell law', 'refraction angle calculator'],
  [
    '{ name: "n1", label: "Refractive Index n1", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "n2", label: "Refractive Index n2", type: "number", min: 1, max: 4, defaultValue: 1.5 }',
    '{ name: "angle1", label: "Incident Angle (degrees)", type: "number", min: 0, max: 90, defaultValue: 30 }',
  ],
  `(inputs) => {
      const n1 = inputs.n1 as number;
      const n2 = inputs.n2 as number;
      const theta1 = inputs.angle1 as number;
      if (!n1 || !n2 || theta1 === undefined) return null;
      const rad1 = theta1 * Math.PI / 180;
      const sinTheta2 = n1 * Math.sin(rad1) / n2;
      if (Math.abs(sinTheta2) > 1) {
        const critAngle = Math.round(Math.asin(n2 / n1) * 180 / Math.PI * 100) / 100;
        return { primary: { label: "Result", value: "Total Internal Reflection" }, details: [{ label: "Critical Angle", value: formatNumber(critAngle) + " deg" }] };
      }
      const theta2 = Math.round(Math.asin(sinTheta2) * 180 / Math.PI * 100) / 100;
      return {
        primary: { label: "Refracted Angle", value: formatNumber(theta2) + " deg" },
        details: [
          { label: "Incident Angle", value: formatNumber(theta1) + " deg" },
          { label: "n1", value: formatNumber(n1) },
          { label: "n2", value: formatNumber(n2) },
        ],
      };
  }`,
  [{ q: 'What is Snell law?', a: 'n1 sin(theta1) = n2 sin(theta2) describes light bending at an interface.' },
   { q: 'What causes total internal reflection?', a: 'It occurs when light goes from a denser to a less dense medium above critical angle.' }],
  'n1 sin(theta1) = n2 sin(theta2)',
  []
);

add('diffraction-grating-calculator', 'Diffraction Grating Calculator',
  'Calculate diffraction angles from grating line spacing.',
  'Science', 'science', 'A',
  ['diffraction grating', 'grating angle calculator'],
  [
    '{ name: "wavelength", label: "Wavelength (nm)", type: "number", min: 100, max: 2000, defaultValue: 550 }',
    '{ name: "linesMm", label: "Lines Per mm", type: "number", min: 10, max: 10000, defaultValue: 600 }',
    '{ name: "order", label: "Diffraction Order", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const wl = inputs.wavelength as number;
      const lines = inputs.linesMm as number;
      const m = inputs.order as number;
      if (!wl || !lines || !m) return null;
      const d = 1e6 / lines;
      const sinTheta = m * wl / d;
      if (sinTheta > 1) return { primary: { label: "Result", value: "Order not observable" }, details: [{ label: "Reason", value: "sin(theta) exceeds 1" }] };
      const theta = Math.round(Math.asin(sinTheta) * 180 / Math.PI * 100) / 100;
      return {
        primary: { label: "Diffraction Angle", value: formatNumber(theta) + " deg" },
        details: [
          { label: "Grating Spacing", value: formatNumber(Math.round(d * 100) / 100) + " nm" },
          { label: "Order", value: formatNumber(m) },
          { label: "Wavelength", value: formatNumber(wl) + " nm" },
        ],
      };
  }`,
  [{ q: 'What is a diffraction grating?', a: 'It is a surface with many parallel slits that disperses light by wavelength.' },
   { q: 'What does diffraction order mean?', a: 'Order is the integer m in d sin(theta) = m x wavelength.' }],
  'd sin(theta) = m x wavelength',
  []
);

add('youngs-modulus-calculator', 'Young Modulus Calculator',
  'Calculate stress-to-strain ratio for a material.',
  'Science', 'science', 'A',
  ['Young modulus', 'elastic modulus calculator'],
  [
    '{ name: "force", label: "Applied Force (N)", type: "number", min: 0.1, max: 10000000, defaultValue: 1000 }',
    '{ name: "area", label: "Cross Section Area (sq mm)", type: "number", min: 0.01, max: 100000, defaultValue: 100 }',
    '{ name: "originalLength", label: "Original Length (mm)", type: "number", min: 1, max: 100000, defaultValue: 1000 }',
    '{ name: "extension", label: "Extension (mm)", type: "number", min: 0.001, max: 1000, defaultValue: 0.5 }',
  ],
  `(inputs) => {
      const f = inputs.force as number;
      const a = inputs.area as number;
      const l0 = inputs.originalLength as number;
      const dl = inputs.extension as number;
      if (!f || !a || !l0 || !dl) return null;
      const stress = f / (a * 1e-6);
      const strain = dl / l0;
      const modulus = stress / strain;
      const modulusGpa = Math.round(modulus / 1e9 * 1000) / 1000;
      const stressMpa = Math.round(stress / 1e6 * 1000) / 1000;
      return {
        primary: { label: "Young Modulus", value: formatNumber(modulusGpa) + " GPa" },
        details: [
          { label: "Stress", value: formatNumber(stressMpa) + " MPa" },
          { label: "Strain", value: formatNumber(Math.round(strain * 100000) / 100000) },
          { label: "Extension", value: formatNumber(dl) + " mm" },
        ],
      };
  }`,
  [{ q: 'What is Young modulus?', a: 'It is the ratio of stress to strain, measuring material stiffness.' },
   { q: 'What are typical Young modulus values?', a: 'Steel is about 200 GPa, aluminum is about 70 GPa.' }],
  'E = (F / A) / (dL / L0)',
  []
);

add('thermal-conductivity-calculator', 'Thermal Conductivity Calculator',
  'Calculate heat flow through a material slab.',
  'Science', 'science', 'A',
  ['thermal conductivity', 'heat transfer calculator'],
  [
    '{ name: "conductivity", label: "Conductivity (W/m K)", type: "number", min: 0.01, max: 500, defaultValue: 0.6 }',
    '{ name: "area", label: "Area (sq m)", type: "number", min: 0.001, max: 1000, defaultValue: 1 }',
    '{ name: "thickness", label: "Thickness (m)", type: "number", min: 0.001, max: 10, defaultValue: 0.1 }',
    '{ name: "tempDiff", label: "Temperature Difference (K)", type: "number", min: 0.1, max: 1000, defaultValue: 20 }',
  ],
  `(inputs) => {
      const k = inputs.conductivity as number;
      const a = inputs.area as number;
      const t = inputs.thickness as number;
      const dT = inputs.tempDiff as number;
      if (!k || !a || !t || !dT) return null;
      const heatFlow = Math.round(k * a * dT / t * 100) / 100;
      const rValue = Math.round(t / k * 1000) / 1000;
      return {
        primary: { label: "Heat Flow", value: formatNumber(heatFlow) + " W" },
        details: [
          { label: "Thermal Resistance", value: formatNumber(rValue) + " m2 K/W" },
          { label: "Conductivity", value: formatNumber(k) + " W/m K" },
          { label: "Temperature Difference", value: formatNumber(dT) + " K" },
        ],
      };
  }`,
  [{ q: 'What is thermal conductivity?', a: 'It measures how well a material conducts heat, in watts per meter kelvin.' },
   { q: 'What material has the highest thermal conductivity?', a: 'Diamond has the highest at about 2000 W/m K.' }],
  'Q = k x A x dT / thickness',
  []
);

add('specific-heat-calculator', 'Specific Heat Calculator',
  'Calculate energy needed for a temperature change.',
  'Science', 'science', 'A',
  ['specific heat', 'heat energy calculator'],
  [
    '{ name: "mass", label: "Mass (kg)", type: "number", min: 0.001, max: 100000, defaultValue: 1 }',
    '{ name: "specificHeat", label: "Specific Heat (J/kg K)", type: "number", min: 1, max: 10000, defaultValue: 4186 }',
    '{ name: "tempChange", label: "Temperature Change (K)", type: "number", min: 0.1, max: 5000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const m = inputs.mass as number;
      const c = inputs.specificHeat as number;
      const dT = inputs.tempChange as number;
      if (!m || !c || !dT) return null;
      const energy = m * c * dT;
      const energyKj = Math.round(energy / 1000 * 100) / 100;
      const energyCal = Math.round(energy / 4.184 * 100) / 100;
      return {
        primary: { label: "Energy Required", value: formatNumber(energyKj) + " kJ" },
        details: [
          { label: "Energy (J)", value: formatNumber(Math.round(energy * 100) / 100) + " J" },
          { label: "Energy (cal)", value: formatNumber(energyCal) + " cal" },
          { label: "Mass", value: formatNumber(m) + " kg" },
        ],
      };
  }`,
  [{ q: 'What is specific heat capacity?', a: 'It is the energy needed to raise 1 kg of a substance by 1 kelvin.' },
   { q: 'What is the specific heat of water?', a: 'Water has a specific heat of about 4186 J/kg K.' }],
  'Q = mass x specific heat x temperature change',
  []
);

add('viscosity-calculator', 'Viscosity Calculator',
  'Calculate dynamic viscosity from shear stress and rate.',
  'Science', 'science', 'A',
  ['viscosity', 'fluid viscosity calculator'],
  [
    '{ name: "shearStress", label: "Shear Stress (Pa)", type: "number", min: 0.0001, max: 100000, defaultValue: 10 }',
    '{ name: "shearRate", label: "Shear Rate (1/s)", type: "number", min: 0.001, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const stress = inputs.shearStress as number;
      const rate = inputs.shearRate as number;
      if (!stress || !rate) return null;
      const viscosity = stress / rate;
      const viscCp = Math.round(viscosity * 1000 * 1000) / 1000;
      const kinematic = Math.round(viscosity / 1000 * 1e6 * 1000) / 1000;
      return {
        primary: { label: "Dynamic Viscosity", value: formatNumber(Math.round(viscosity * 10000) / 10000) + " Pa s" },
        details: [
          { label: "Viscosity (cP)", value: formatNumber(viscCp) + " cP" },
          { label: "Shear Stress", value: formatNumber(stress) + " Pa" },
          { label: "Shear Rate", value: formatNumber(rate) + " 1/s" },
        ],
      };
  }`,
  [{ q: 'What is dynamic viscosity?', a: 'It measures a fluid resistance to flow under an applied shear stress.' },
   { q: 'What is the viscosity of water?', a: 'Water at 20 degrees C has a viscosity of about 1 cP or 0.001 Pa s.' }],
  'Viscosity = Shear Stress / Shear Rate',
  []
);

add('reynolds-number-calculator', 'Reynolds Number Calculator',
  'Calculate the Reynolds number to determine flow regime.',
  'Science', 'science', 'A',
  ['Reynolds number', 'flow regime calculator'],
  [
    '{ name: "velocity", label: "Flow Velocity (m/s)", type: "number", min: 0.001, max: 1000, defaultValue: 2 }',
    '{ name: "diameter", label: "Pipe Diameter (m)", type: "number", min: 0.001, max: 10, defaultValue: 0.05 }',
    '{ name: "density", label: "Fluid Density (kg/cu m)", type: "number", min: 0.1, max: 20000, defaultValue: 1000 }',
    '{ name: "viscosity", label: "Dynamic Viscosity (Pa s)", type: "number", min: 0.000001, max: 100, defaultValue: 0.001 }',
  ],
  `(inputs) => {
      const v = inputs.velocity as number;
      const d = inputs.diameter as number;
      const rho = inputs.density as number;
      const mu = inputs.viscosity as number;
      if (!v || !d || !rho || !mu) return null;
      const re = Math.round(rho * v * d / mu * 100) / 100;
      const regime = re < 2300 ? "Laminar" : re < 4000 ? "Transitional" : "Turbulent";
      return {
        primary: { label: "Reynolds Number", value: formatNumber(re) },
        details: [
          { label: "Flow Regime", value: regime },
          { label: "Velocity", value: formatNumber(v) + " m/s" },
          { label: "Pipe Diameter", value: formatNumber(d) + " m" },
        ],
      };
  }`,
  [{ q: 'What does Reynolds number indicate?', a: 'It predicts whether flow is laminar, transitional, or turbulent.' },
   { q: 'At what Reynolds number does turbulence start?', a: 'Flow becomes turbulent above approximately 4000 in a pipe.' }],
  'Re = density x velocity x diameter / viscosity',
  []
);

add('buoyancy-calculator', 'Buoyancy Calculator',
  'Calculate the buoyant force on a submerged object.',
  'Science', 'science', 'A',
  ['buoyancy', 'buoyant force calculator'],
  [
    '{ name: "volume", label: "Object Volume (cu m)", type: "number", min: 0.0001, max: 10000, defaultValue: 0.01 }',
    '{ name: "fluidDensity", label: "Fluid Density (kg/cu m)", type: "number", min: 0.1, max: 20000, defaultValue: 1000 }',
    '{ name: "objectMass", label: "Object Mass (kg)", type: "number", min: 0.001, max: 1000000, defaultValue: 5 }',
  ],
  `(inputs) => {
      const vol = inputs.volume as number;
      const rho = inputs.fluidDensity as number;
      const mass = inputs.objectMass as number;
      if (!vol || !rho || !mass) return null;
      const buoyantForce = Math.round(rho * vol * 9.81 * 100) / 100;
      const weight = Math.round(mass * 9.81 * 100) / 100;
      const netForce = Math.round((buoyantForce - weight) * 100) / 100;
      const floats = buoyantForce >= weight ? "Floats" : "Sinks";
      return {
        primary: { label: "Buoyant Force", value: formatNumber(buoyantForce) + " N" },
        details: [
          { label: "Object Weight", value: formatNumber(weight) + " N" },
          { label: "Net Force", value: formatNumber(netForce) + " N" },
          { label: "Result", value: floats },
        ],
      };
  }`,
  [{ q: 'What is Archimedes principle?', a: 'The buoyant force equals the weight of displaced fluid.' },
   { q: 'When does an object float?', a: 'An object floats when the buoyant force equals or exceeds its weight.' }],
  'Buoyant Force = fluid density x volume x g',
  []
);

add('spring-constant-calculator', 'Spring Constant Calculator',
  'Calculate spring stiffness using Hooke law.',
  'Science', 'science', 'A',
  ['spring constant', 'Hooke law calculator'],
  [
    '{ name: "force", label: "Applied Force (N)", type: "number", min: 0.01, max: 100000, defaultValue: 10 }',
    '{ name: "displacement", label: "Displacement (m)", type: "number", min: 0.0001, max: 10, defaultValue: 0.05 }',
  ],
  `(inputs) => {
      const f = inputs.force as number;
      const x = inputs.displacement as number;
      if (!f || !x) return null;
      const k = Math.round(f / x * 100) / 100;
      const pe = Math.round(0.5 * k * x * x * 10000) / 10000;
      const kNm = Math.round(k / 1000 * 1000) / 1000;
      return {
        primary: { label: "Spring Constant", value: formatNumber(k) + " N/m" },
        details: [
          { label: "Stored Energy", value: formatNumber(pe) + " J" },
          { label: "Force Applied", value: formatNumber(f) + " N" },
          { label: "Displacement", value: formatNumber(x) + " m" },
        ],
      };
  }`,
  [{ q: 'What is Hooke law?', a: 'F = k x says force is proportional to spring displacement.' },
   { q: 'What does a higher spring constant mean?', a: 'A higher k means a stiffer spring that requires more force to stretch.' }],
  'k = F / x (Hooke law)',
  []
);

add('pendulum-period-calculator', 'Pendulum Period Calculator',
  'Calculate the period of a simple pendulum.',
  'Science', 'science', 'A',
  ['pendulum period', 'simple pendulum calculator'],
  [
    '{ name: "length", label: "Pendulum Length (m)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "gravity", label: "Gravity (m/s2)", type: "number", min: 0.1, max: 30, defaultValue: 9.81 }',
  ],
  `(inputs) => {
      const l = inputs.length as number;
      const g = inputs.gravity as number;
      if (!l || !g) return null;
      const period = Math.round(2 * Math.PI * Math.sqrt(l / g) * 10000) / 10000;
      const frequency = Math.round(1 / period * 10000) / 10000;
      const angularFreq = Math.round(2 * Math.PI * frequency * 1000) / 1000;
      return {
        primary: { label: "Period", value: formatNumber(period) + " s" },
        details: [
          { label: "Frequency", value: formatNumber(frequency) + " Hz" },
          { label: "Angular Frequency", value: formatNumber(angularFreq) + " rad/s" },
          { label: "Length", value: formatNumber(l) + " m" },
        ],
      };
  }`,
  [{ q: 'Does pendulum mass affect the period?', a: 'No. The period depends only on length and gravity, not mass.' },
   { q: 'What is the formula for a simple pendulum?', a: 'T = 2 pi sqrt(L / g) for small angle oscillations.' }],
  'T = 2 pi sqrt(L / g)',
  []
);

add('projectile-range-calculator', 'Projectile Range Calculator',
  'Calculate the horizontal distance of a projectile.',
  'Science', 'science', 'A',
  ['projectile range', 'projectile motion calculator'],
  [
    '{ name: "velocity", label: "Launch Velocity (m/s)", type: "number", min: 0.1, max: 10000, defaultValue: 20 }',
    '{ name: "angle", label: "Launch Angle (degrees)", type: "number", min: 1, max: 89, defaultValue: 45 }',
    '{ name: "height", label: "Launch Height (m)", type: "number", min: 0, max: 10000, defaultValue: 0 }',
  ],
  `(inputs) => {
      const v = inputs.velocity as number;
      const deg = inputs.angle as number;
      const h = inputs.height as number;
      if (!v || !deg) return null;
      const g = 9.81;
      const rad = deg * Math.PI / 180;
      const vx = v * Math.cos(rad);
      const vy = v * Math.sin(rad);
      const tUp = vy / g;
      const maxH = h + vy * tUp - 0.5 * g * tUp * tUp;
      const tTotal = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
      const range = Math.round(vx * tTotal * 100) / 100;
      return {
        primary: { label: "Range", value: formatNumber(range) + " m" },
        details: [
          { label: "Max Height", value: formatNumber(Math.round(maxH * 100) / 100) + " m" },
          { label: "Time of Flight", value: formatNumber(Math.round(tTotal * 100) / 100) + " s" },
          { label: "Launch Angle", value: formatNumber(deg) + " deg" },
        ],
      };
  }`,
  [{ q: 'What angle gives maximum range?', a: '45 degrees gives the maximum range on level ground with no air resistance.' },
   { q: 'Does launch height affect range?', a: 'Yes. A higher launch point increases the total range.' }],
  'Range = vx x (vy + sqrt(vy^2 + 2gh)) / g',
  []
);
