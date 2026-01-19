import { useState, useMemo } from 'react';
import { Camera } from 'lucide-react';

export function DOFCalculator() {
  const [focal, setFocal] = useState(50);
  const [aperture, setAperture] = useState(1.8);
  const [distance, setDistance] = useState(5);
  const [coc, setCoc] = useState(0.029);

  const result = useMemo(() => {
    const f = Number(focal);
    const N = Number(aperture);
    const D = Number(distance);
    const c = Number(coc);

    if (f <= 0 || N <= 0 || D <= 0 || c <= 0) {
      return { error: 'All values must be positive' };
    }

    // Hyperfocal distance in meters
    const H = (f * f) / (N * c * 1000);
    
    // Near and far limits
    const near = (H * D) / (H + (D - f / 1000));
    const far = D >= H ? Infinity : (H * D) / (H - D);
    
    // Depth of field
    const dof = far === Infinity ? Infinity : far - near;

    return {
      hyperfocal: H,
      near: Math.max(0, near),
      far,
      dof,
      isInfinite: far === Infinity
    };
  }, [focal, aperture, distance, coc]);

  const formatDist = (d: number): string => {
    if (!isFinite(d)) return '∞';
    if (d >= 1) return `${d.toFixed(2)}m`;
    return `${(d * 100).toFixed(1)}cm`;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Focal Length (mm)</span>
          <input
            value={focal}
            onChange={e => setFocal(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Aperture (f/)</span>
          <input
            value={aperture}
            onChange={e => setAperture(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.1"
            min="0.7"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Subject Distance (m)</span>
          <input
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.1"
            min="0.1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Circle of Confusion (mm)</span>
          <select
            value={coc}
            onChange={e => setCoc(Number(e.target.value))}
            className="input-calc"
          >
            <option value={0.029}>Full Frame (0.029mm)</option>
            <option value={0.019}>APS-C (0.019mm)</option>
            <option value={0.015}>Micro 4/3 (0.015mm)</option>
            <option value={0.006}>1" Sensor (0.006mm)</option>
          </select>
        </label>
      </div>

      {'error' in result ? (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hyperfocal Distance</div>
              <div className="text-xl font-semibold">{formatDist(result.hyperfocal)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-sm text-muted-foreground">Near Limit</div>
              <div className="text-lg font-bold">{formatDist(result.near)}</div>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-sm text-muted-foreground">Far Limit</div>
              <div className="text-lg font-bold">{formatDist(result.far)}</div>
            </div>
            <div className="p-3 rounded-lg bg-primary/20 text-center">
              <div className="text-sm text-muted-foreground">DOF</div>
              <div className="text-lg font-bold gradient-text">
                {result.isInfinite ? '∞' : formatDist(result.dof)}
              </div>
            </div>
          </div>

          {/* Visual DOF indicator */}
          <div className="pt-4 border-t border-border">
            <div className="relative h-8 rounded-full bg-card overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
                style={{
                  left: result.isInfinite ? '20%' : `${(result.near / (result.far || 1)) * 100}%`,
                  width: result.isInfinite ? '80%' : `${((result.dof) / (result.far || 1)) * 100}%`,
                }}
              />
              <div
                className="absolute w-2 h-8 bg-foreground rounded"
                style={{ left: `${(distance / (result.isInfinite ? distance * 2 : result.far)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Near</span>
              <span>Subject</span>
              <span>Far</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
