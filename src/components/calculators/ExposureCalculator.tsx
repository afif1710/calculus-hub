import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Camera } from 'lucide-react';

const SHUTTER_SPEEDS = [
  '30', '15', '8', '4', '2', '1', '1/2', '1/4', '1/8', '1/15', '1/30', 
  '1/60', '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000', '1/8000'
];

const APERTURES = [
  'f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22', 'f/32'
];

const ISO_VALUES = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

export function ExposureCalculator() {
  const [mode, setMode] = useState<'aperture' | 'shutter' | 'iso'>('aperture');
  const [currentAperture, setCurrentAperture] = useState('f/5.6');
  const [currentShutter, setCurrentShutter] = useState('1/125');
  const [currentISO, setCurrentISO] = useState(400);
  const [newAperture, setNewAperture] = useState('f/8');
  const [newShutter, setNewShutter] = useState('1/60');
  const [newISO, setNewISO] = useState(800);
  const [copied, setCopied] = useState(false);

  // Convert values to EV stops
  const apertureToStops = (f: string) => {
    const fNumber = parseFloat(f.replace('f/', ''));
    return Math.log2(fNumber * fNumber);
  };

  const shutterToStops = (s: string) => {
    const value = s.includes('/') 
      ? 1 / parseFloat(s.split('/')[1]) 
      : parseFloat(s);
    return -Math.log2(value);
  };

  const isoToStops = (iso: number) => {
    return Math.log2(iso / 100);
  };

  const stopsToShutter = (stops: number): string => {
    const seconds = Math.pow(2, -stops);
    if (seconds >= 1) return Math.round(seconds).toString();
    const denominator = Math.round(1 / seconds);
    // Find closest standard value
    const shutterIndex = SHUTTER_SPEEDS.findIndex(s => {
      if (s.includes('/')) {
        return parseInt(s.split('/')[1]) >= denominator;
      }
      return parseFloat(s) >= seconds;
    });
    return SHUTTER_SPEEDS[Math.max(0, shutterIndex)] || '1/8000';
  };

  const stopsToAperture = (stops: number): string => {
    const fNumber = Math.sqrt(Math.pow(2, stops));
    // Find closest standard aperture
    return APERTURES.reduce((prev, curr) => {
      const prevF = parseFloat(prev.replace('f/', ''));
      const currF = parseFloat(curr.replace('f/', ''));
      return Math.abs(currF - fNumber) < Math.abs(prevF - fNumber) ? curr : prev;
    });
  };

  const stopsToISO = (stops: number): number => {
    const iso = 100 * Math.pow(2, stops);
    // Find closest standard ISO
    return ISO_VALUES.reduce((prev, curr) => 
      Math.abs(curr - iso) < Math.abs(prev - iso) ? curr : prev
    );
  };

  const result = useMemo(() => {
    const currentEV = 
      apertureToStops(currentAperture) + 
      shutterToStops(currentShutter) - 
      isoToStops(currentISO);

    if (mode === 'aperture') {
      // New aperture is fixed, calculate shutter or ISO
      const newApertureStops = apertureToStops(newAperture);
      const currentApertureStops = apertureToStops(currentAperture);
      const diff = newApertureStops - currentApertureStops;
      
      // Adjust shutter to compensate
      const newShutterStops = shutterToStops(currentShutter) - diff;
      return {
        aperture: newAperture,
        shutter: stopsToShutter(newShutterStops),
        iso: currentISO,
        evChange: -diff.toFixed(1),
      };
    }

    if (mode === 'shutter') {
      // New shutter is fixed, calculate aperture
      const newShutterStops = shutterToStops(newShutter);
      const currentShutterStops = shutterToStops(currentShutter);
      const diff = newShutterStops - currentShutterStops;
      
      // Adjust aperture to compensate
      const newApertureStops = apertureToStops(currentAperture) + diff;
      return {
        aperture: stopsToAperture(newApertureStops),
        shutter: newShutter,
        iso: currentISO,
        evChange: -diff.toFixed(1),
      };
    }

    if (mode === 'iso') {
      // New ISO is fixed, calculate shutter
      const newISOStops = isoToStops(newISO);
      const currentISOStops = isoToStops(currentISO);
      const diff = newISOStops - currentISOStops;
      
      // Adjust shutter to compensate
      const newShutterStops = shutterToStops(currentShutter) + diff;
      return {
        aperture: currentAperture,
        shutter: stopsToShutter(newShutterStops),
        iso: newISO,
        evChange: diff.toFixed(1),
      };
    }

    return null;
  }, [mode, currentAperture, currentShutter, currentISO, newAperture, newShutter, newISO]);

  const reset = useCallback(() => {
    setCurrentAperture('f/5.6');
    setCurrentShutter('1/125');
    setCurrentISO(400);
    setNewAperture('f/8');
    setNewShutter('1/60');
    setNewISO(800);
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `${result.aperture} | ${result.shutter}s | ISO ${result.iso}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          What do you want to change?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'aperture', label: 'Aperture' },
            { id: 'shutter', label: 'Shutter' },
            { id: 'iso', label: 'ISO' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as typeof mode)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                mode === m.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Settings */}
      <div className="p-4 rounded-xl bg-secondary/50">
        <h3 className="text-sm font-medium mb-3">Current Exposure</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Aperture</label>
            <select
              value={currentAperture}
              onChange={(e) => setCurrentAperture(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none text-sm"
            >
              {APERTURES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Shutter</label>
            <select
              value={currentShutter}
              onChange={(e) => setCurrentShutter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none text-sm"
            >
              {SHUTTER_SPEEDS.map((s) => (
                <option key={s} value={s}>{s}s</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">ISO</label>
            <select
              value={currentISO}
              onChange={(e) => setCurrentISO(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none text-sm"
            >
              {ISO_VALUES.map((iso) => (
                <option key={iso} value={iso}>{iso}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* New Setting Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          New {mode === 'aperture' ? 'Aperture' : mode === 'shutter' ? 'Shutter Speed' : 'ISO'}
        </label>
        {mode === 'aperture' && (
          <select
            value={newAperture}
            onChange={(e) => setNewAperture(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none"
          >
            {APERTURES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        )}
        {mode === 'shutter' && (
          <select
            value={newShutter}
            onChange={(e) => setNewShutter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none"
          >
            {SHUTTER_SPEEDS.map((s) => (
              <option key={s} value={s}>{s}s</option>
            ))}
          </select>
        )}
        {mode === 'iso' && (
          <select
            value={newISO}
            onChange={(e) => setNewISO(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none"
          >
            {ISO_VALUES.map((iso) => (
              <option key={iso} value={iso}>{iso}</option>
            ))}
          </select>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">Equivalent Exposure</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-xl ${mode === 'aperture' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
              <div className="text-xl font-bold">{result.aperture}</div>
              <div className="text-xs text-muted-foreground">Aperture</div>
            </div>
            <div className={`p-3 rounded-xl ${mode === 'shutter' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
              <div className="text-xl font-bold">{result.shutter}s</div>
              <div className="text-xs text-muted-foreground">Shutter</div>
            </div>
            <div className={`p-3 rounded-xl ${mode === 'iso' ? 'bg-primary/20' : 'bg-secondary/50'}`}>
              <div className="text-xl font-bold">{result.iso}</div>
              <div className="text-xs text-muted-foreground">ISO</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={copyResult}
          disabled={!result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
