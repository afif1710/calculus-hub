import { useState } from 'react';
import { Package, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type SafetyStockMode = 'units' | 'days';

export function ReorderPointCalculator() {
  const [avgDailySales, setAvgDailySales] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [safetyStockMode, setSafetyStockMode] = useState<SafetyStockMode>('units');
  const [safetyStock, setSafetyStock] = useState('');
  const [showEOQ, setShowEOQ] = useState(false);
  const [orderCost, setOrderCost] = useState('');
  const [holdingCost, setHoldingCost] = useState('');
  const [result, setResult] = useState<{
    reorderPoint: number;
    safetyStockUnits: number;
    leadTimeDemand: number;
    eoq?: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const dailySales = parseFloat(avgDailySales);
    const leadDays = parseFloat(leadTime);
    const safety = parseFloat(safetyStock) || 0;

    if (isNaN(dailySales) || isNaN(leadDays) || dailySales <= 0 || leadDays < 0) {
      toast.error('Please enter valid daily sales and lead time');
      return;
    }

    const leadTimeDemand = dailySales * leadDays;
    const safetyStockUnits = safetyStockMode === 'days' ? safety * dailySales : safety;
    const reorderPoint = leadTimeDemand + safetyStockUnits;

    let eoq: number | undefined;
    if (showEOQ) {
      const D = dailySales * 365; // Annual demand
      const S = parseFloat(orderCost);
      const H = parseFloat(holdingCost);
      if (!isNaN(S) && !isNaN(H) && S > 0 && H > 0) {
        eoq = Math.sqrt((2 * D * S) / H);
      }
    }

    setResult({
      reorderPoint: Math.ceil(reorderPoint),
      safetyStockUnits: Math.ceil(safetyStockUnits),
      leadTimeDemand: Math.ceil(leadTimeDemand),
      eoq: eoq ? Math.ceil(eoq) : undefined,
    });
  };

  const handleReset = () => {
    setAvgDailySales('');
    setLeadTime('');
    setSafetyStock('');
    setOrderCost('');
    setHoldingCost('');
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    let text = `Reorder Point: ${result.reorderPoint} units\nLead Time Demand: ${result.leadTimeDemand} units\nSafety Stock: ${result.safetyStockUnits} units`;
    if (result.eoq) {
      text += `\nEOQ (Suggested Order Qty): ${result.eoq} units`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Avg Daily Sales (units)</label>
          <input
            type="number"
            value={avgDailySales}
            onChange={e => setAvgDailySales(e.target.value)}
            className="input-calc"
            placeholder="50"
            min="0"
            step="1"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Lead Time (days)</label>
          <input
            type="number"
            value={leadTime}
            onChange={e => setLeadTime(e.target.value)}
            className="input-calc"
            placeholder="7"
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">Safety Stock</span>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setSafetyStockMode('units')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                safetyStockMode === 'units' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              Units
            </button>
            <button
              onClick={() => setSafetyStockMode('days')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                safetyStockMode === 'days' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              Days
            </button>
          </div>
        </div>
        <input
          type="number"
          value={safetyStock}
          onChange={e => setSafetyStock(e.target.value)}
          className="input-calc"
          placeholder={safetyStockMode === 'units' ? '100' : '3'}
          min="0"
        />
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showEOQ}
            onChange={e => setShowEOQ(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-secondary"
          />
          <span className="text-sm font-medium text-foreground">Calculate EOQ (suggested order quantity)</span>
        </label>
        
        {showEOQ && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Order Cost ($)</label>
              <input
                type="number"
                value={orderCost}
                onChange={e => setOrderCost(e.target.value)}
                className="input-calc"
                placeholder="25"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Holding Cost/unit/year ($)</label>
              <input
                type="number"
                value={holdingCost}
                onChange={e => setHoldingCost(e.target.value)}
                className="input-calc"
                placeholder="2"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          Calculate Reorder Point
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            <div className="text-center pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground block">Reorder Point</span>
              <span className="text-3xl font-bold gradient-text">
                {result.reorderPoint.toLocaleString()} units
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground block">Lead Time Demand</span>
                <span className="text-lg font-semibold text-foreground">
                  {result.leadTimeDemand.toLocaleString()} units
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Safety Stock</span>
                <span className="text-lg font-semibold text-foreground">
                  {result.safetyStockUnits.toLocaleString()} units
                </span>
              </div>
            </div>

            {result.eoq && (
              <div className="pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground block">EOQ (Suggested Order Qty)</span>
                <span className="text-lg font-semibold text-green-400">
                  {result.eoq.toLocaleString()} units
                </span>
              </div>
            )}
          </div>

          <Button variant="secondary" onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </Button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <Package className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Calculate when to reorder inventory based on daily sales, lead time, and safety stock.
        </span>
      </div>
    </div>
  );
}
