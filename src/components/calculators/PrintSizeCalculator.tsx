import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Image } from 'lucide-react';

const PRINT_PRESETS = [
  { name: '4×6"', width: 4, height: 6 },
  { name: '5×7"', width: 5, height: 7 },
  { name: '8×10"', width: 8, height: 10 },
  { name: '11×14"', width: 11, height: 14 },
  { name: '16×20"', width: 16, height: 20 },
  { name: '20×24"', width: 20, height: 24 },
  { name: '24×36"', width: 24, height: 36 },
  { name: 'A4', width: 8.27, height: 11.69 },
  { name: 'A3', width: 11.69, height: 16.54 },
];

const DPI_OPTIONS = [
  { dpi: 72, label: 'Screen (72 DPI)', quality: 'Low' },
  { dpi: 150, label: 'Draft (150 DPI)', quality: 'Medium' },
  { dpi: 300, label: 'Photo (300 DPI)', quality: 'High' },
  { dpi: 600, label: 'Fine Art (600 DPI)', quality: 'Very High' },
];

export function PrintSizeCalculator() {
  const [mode, setMode] = useState<'dimensions' | 'resolution'>('dimensions');
  
  // For calculating required resolution
  const [printWidth, setPrintWidth] = useState('8');
  const [printHeight, setPrintHeight] = useState('10');
  const [targetDPI, setTargetDPI] = useState(300);
  
  // For calculating max print size
  const [imageWidth, setImageWidth] = useState('4000');
  const [imageHeight, setImageHeight] = useState('3000');
  const [minDPI, setMinDPI] = useState(300);
  
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === 'dimensions') {
      const width = parseFloat(printWidth);
      const height = parseFloat(printHeight);
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) return null;

      const requiredWidth = Math.ceil(width * targetDPI);
      const requiredHeight = Math.ceil(height * targetDPI);
      const megapixels = (requiredWidth * requiredHeight) / 1000000;
      const aspectRatio = width / height;

      return {
        width: requiredWidth,
        height: requiredHeight,
        megapixels: megapixels.toFixed(1),
        aspectRatio: aspectRatio.toFixed(2),
        fileSize: ((requiredWidth * requiredHeight * 3) / 1048576).toFixed(1), // Approximate uncompressed
      };
    }

    if (mode === 'resolution') {
      const imgW = parseInt(imageWidth);
      const imgH = parseInt(imageHeight);
      if (isNaN(imgW) || isNaN(imgH) || imgW <= 0 || imgH <= 0) return null;

      const maxWidthInches = imgW / minDPI;
      const maxHeightInches = imgH / minDPI;
      const megapixels = (imgW * imgH) / 1000000;
      const aspectRatio = imgW / imgH;

      // Find suggested prints
      const suggestedPrints = PRINT_PRESETS.filter(p => {
        const fitsWidth = p.width <= maxWidthInches;
        const fitsHeight = p.height <= maxHeightInches;
        // Also check rotated
        const fitsWidthRot = p.height <= maxWidthInches;
        const fitsHeightRot = p.width <= maxHeightInches;
        return (fitsWidth && fitsHeight) || (fitsWidthRot && fitsHeightRot);
      });

      return {
        maxWidth: maxWidthInches.toFixed(1),
        maxHeight: maxHeightInches.toFixed(1),
        maxWidthCm: (maxWidthInches * 2.54).toFixed(1),
        maxHeightCm: (maxHeightInches * 2.54).toFixed(1),
        megapixels: megapixels.toFixed(1),
        aspectRatio: aspectRatio.toFixed(2),
        suggestedPrints,
      };
    }

    return null;
  }, [mode, printWidth, printHeight, targetDPI, imageWidth, imageHeight, minDPI]);

  const selectPreset = (preset: typeof PRINT_PRESETS[0]) => {
    setPrintWidth(preset.width.toString());
    setPrintHeight(preset.height.toString());
  };

  const reset = useCallback(() => {
    setPrintWidth('8');
    setPrintHeight('10');
    setTargetDPI(300);
    setImageWidth('4000');
    setImageHeight('3000');
    setMinDPI(300);
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      let text = '';
      if ('width' in result) {
        text = `${result.width} × ${result.height} pixels at ${targetDPI} DPI`;
      } else {
        text = `Max print size: ${result.maxWidth}" × ${result.maxHeight}" at ${minDPI} DPI`;
      }
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, targetDPI, minDPI]);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('dimensions')}
          className={`py-3 rounded-xl text-sm font-medium transition-colors ${
            mode === 'dimensions' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
          }`}
        >
          Print → Resolution
        </button>
        <button
          onClick={() => setMode('resolution')}
          className={`py-3 rounded-xl text-sm font-medium transition-colors ${
            mode === 'resolution' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
          }`}
        >
          Resolution → Print
        </button>
      </div>

      {mode === 'dimensions' ? (
        <>
          {/* Print Size Presets */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Common Print Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {PRINT_PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    printWidth === preset.width.toString() && printHeight === preset.height.toString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Width (inches)
              </label>
              <input
                type="number"
                value={printWidth}
                onChange={(e) => setPrintWidth(e.target.value)}
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Height (inches)
              </label>
              <input
                type="number"
                value={printHeight}
                onChange={(e) => setPrintHeight(e.target.value)}
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* DPI Selection */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Print Quality (DPI)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DPI_OPTIONS.map((option) => (
                <button
                  key={option.dpi}
                  onClick={() => setTargetDPI(option.dpi)}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    targetDPI === option.dpi ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <div className="font-medium text-sm">{option.dpi} DPI</div>
                  <div className={`text-xs ${targetDPI === option.dpi ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {option.quality} quality
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Image Resolution Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Image Width (px)
              </label>
              <input
                type="number"
                value={imageWidth}
                onChange={(e) => setImageWidth(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Image Height (px)
              </label>
              <input
                type="number"
                value={imageHeight}
                onChange={(e) => setImageHeight(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Minimum DPI */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Minimum Print Quality (DPI)
            </label>
            <select
              value={minDPI}
              onChange={(e) => setMinDPI(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            >
              {DPI_OPTIONS.map((option) => (
                <option key={option.dpi} value={option.dpi}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium">
              {mode === 'dimensions' ? 'Required Resolution' : 'Maximum Print Size'}
            </span>
          </div>

          {'width' in result ? (
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {result.width} × {result.height}
              </div>
              <div className="text-muted-foreground text-sm mb-4">pixels</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="font-medium">{result.megapixels} MP</div>
                  <div className="text-xs text-muted-foreground">Megapixels</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="font-medium">{result.aspectRatio}</div>
                  <div className="text-xs text-muted-foreground">Aspect Ratio</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="font-medium">~{result.fileSize} MB</div>
                  <div className="text-xs text-muted-foreground">Uncompressed</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {result.maxWidth}" × {result.maxHeight}"
              </div>
              <div className="text-muted-foreground text-sm mb-4">
                ({result.maxWidthCm} × {result.maxHeightCm} cm)
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="font-medium">{result.megapixels} MP</div>
                  <div className="text-xs text-muted-foreground">Your Image</div>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="font-medium">{result.aspectRatio}</div>
                  <div className="text-xs text-muted-foreground">Aspect Ratio</div>
                </div>
              </div>
              {result.suggestedPrints.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Suggested print sizes:</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {result.suggestedPrints.map((p) => (
                      <span key={p.name} className="px-2 py-1 text-xs rounded bg-secondary/50">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
