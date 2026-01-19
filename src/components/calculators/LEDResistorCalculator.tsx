import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Lightbulb } from 'lucide-react';

const LED_COLORS = [
  { name: 'Red', voltage: 1.8, wavelength: '620-750nm' },
  { name: 'Orange', voltage: 2.0, wavelength: '590-620nm' },
  { name: 'Yellow', voltage: 2.1, wavelength: '570-590nm' },
  { name: 'Green', voltage: 2.2, wavelength: '495-570nm' },
  { name: 'Blue', voltage: 3.2, wavelength: '450-495nm' },
  { name: 'White', voltage: 3.3, wavelength: 'N/A' },
  { name: 'UV', voltage: 3.4, wavelength: '10-400nm' },
  { name: 'IR', voltage: 1.2, wavelength: '>750nm' },
];

const STANDARD_RESISTORS = [
  1, 1.5, 2.2, 3.3, 4.7, 6.8, 10, 15, 22, 33, 47, 68, 100, 150, 220, 330, 470, 680,
  1000, 1500, 2200, 3300, 4700, 6800, 10000,
];

export function LEDResistorCalculator() {
  const [supplyVoltage, setSupplyVoltage] = useState('5');
  const [ledVoltage, setLedVoltage] = useState('2.0');
  const [ledCurrent, setLedCurrent] = useState('20');
  const [ledCount, setLedCount] = useState('1');
  const [configuration, setConfiguration] = useState<'series' | 'parallel'>('series');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const vs = parseFloat(supplyVoltage);
    const vf = parseFloat(ledVoltage);
    const if_ma = parseFloat(ledCurrent);
    const count = parseInt(ledCount);

    if (isNaN(vs) || isNaN(vf) || isNaN(if_ma) || isNaN(count)) return null;
    if (vs <= 0 || vf <= 0 || if_ma <= 0 || count <= 0) return null;

    const if_a = if_ma / 1000;
    let resistance: number;
    let totalLedVoltage: number;
    let current: number;
    let power: number;

    if (configuration === 'series') {
      totalLedVoltage = vf * count;
      if (vs <= totalLedVoltage) {
        return { error: 'Supply voltage must be greater than total LED voltage drop' };
      }
      resistance = (vs - totalLedVoltage) / if_a;
      current = if_ma;
      power = (vs - totalLedVoltage) * if_a;
    } else {
      // Parallel - each LED needs its own resistor or one shared with same current
      totalLedVoltage = vf;
      if (vs <= totalLedVoltage) {
        return { error: 'Supply voltage must be greater than LED voltage drop' };
      }
      resistance = (vs - totalLedVoltage) / (if_a * count);
      current = if_ma * count;
      power = (vs - totalLedVoltage) * (if_a * count);
    }

    // Find nearest standard resistor value
    const nearestStandard = STANDARD_RESISTORS.reduce((prev, curr) =>
      Math.abs(curr - resistance) < Math.abs(prev - resistance) ? curr : prev
    );

    // Calculate actual current with standard resistor
    const actualCurrent = configuration === 'series'
      ? ((vs - totalLedVoltage) / nearestStandard) * 1000
      : ((vs - totalLedVoltage) / nearestStandard) * 1000;

    // Power rating needed (with 2x safety margin)
    const powerRating = power * 2;
    const recommendedWattage = powerRating <= 0.125 ? '1/8W' :
      powerRating <= 0.25 ? '1/4W' :
      powerRating <= 0.5 ? '1/2W' :
      powerRating <= 1 ? '1W' : '2W+';

    return {
      exact: resistance.toFixed(2),
      standard: nearestStandard,
      power: (power * 1000).toFixed(2),
      powerRating: recommendedWattage,
      actualCurrent: actualCurrent.toFixed(2),
      totalVoltage: totalLedVoltage.toFixed(2),
    };
  }, [supplyVoltage, ledVoltage, ledCurrent, ledCount, configuration]);

  const selectLedColor = (voltage: number) => {
    setLedVoltage(voltage.toFixed(1));
  };

  const reset = useCallback(() => {
    setSupplyVoltage('5');
    setLedVoltage('2.0');
    setLedCurrent('20');
    setLedCount('1');
    setConfiguration('series');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      const text = `Resistor: ${result.standard}Ω (${result.powerRating})\nExact: ${result.exact}Ω\nActual Current: ${result.actualCurrent}mA`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Supply Voltage */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Supply Voltage (V)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={supplyVoltage}
            onChange={(e) => setSupplyVoltage(e.target.value)}
            step="0.1"
            min="0"
            className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
          <div className="flex gap-1">
            {['3.3', '5', '9', '12'].map((v) => (
              <button
                key={v}
                onClick={() => setSupplyVoltage(v)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  supplyVoltage === v ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LED Color Presets */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          LED Color (Forward Voltage)
        </label>
        <div className="flex flex-wrap gap-2">
          {LED_COLORS.map((led) => (
            <button
              key={led.name}
              onClick={() => selectLedColor(led.voltage)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                ledVoltage === led.voltage.toFixed(1) ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {led.name} ({led.voltage}V)
            </button>
          ))}
        </div>
      </div>

      {/* LED Specs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            LED Forward Voltage (V)
          </label>
          <input
            type="number"
            value={ledVoltage}
            onChange={(e) => setLedVoltage(e.target.value)}
            step="0.1"
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            LED Current (mA)
          </label>
          <input
            type="number"
            value={ledCurrent}
            onChange={(e) => setLedCurrent(e.target.value)}
            step="1"
            min="1"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* LED Count & Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Number of LEDs
          </label>
          <input
            type="number"
            value={ledCount}
            onChange={(e) => setLedCount(e.target.value)}
            min="1"
            max="20"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Configuration
          </label>
          <div className="flex rounded-xl overflow-hidden border border-border">
            <button
              onClick={() => setConfiguration('series')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                configuration === 'series' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Series
            </button>
            <button
              onClick={() => setConfiguration('parallel')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                configuration === 'parallel' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Parallel
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          {'error' in result ? (
            <div className="text-center text-destructive">{result.error}</div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-3xl font-bold gradient-text">{result.standard}Ω</div>
                  <div className="text-sm text-muted-foreground">Recommended resistor</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50 text-center">
                  <div className="font-medium">{result.exact}Ω</div>
                  <div className="text-xs text-muted-foreground">Calculated</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50 text-center">
                  <div className="font-medium">{result.powerRating}</div>
                  <div className="text-xs text-muted-foreground">Min. Power Rating</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50 text-center">
                  <div className="font-medium">{result.actualCurrent}mA</div>
                  <div className="text-xs text-muted-foreground">Actual Current</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50 text-center">
                  <div className="font-medium">{result.power}mW</div>
                  <div className="text-xs text-muted-foreground">Power Dissipation</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formula */}
      <div className="p-4 rounded-xl bg-secondary/30 text-sm">
        <p className="font-medium mb-2">Formula:</p>
        <p className="font-mono text-muted-foreground">
          R = (Vs - Vf) / If
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Where: Vs = Supply Voltage, Vf = LED Forward Voltage, If = LED Current
        </p>
      </div>

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
          disabled={!result || 'error' in result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
