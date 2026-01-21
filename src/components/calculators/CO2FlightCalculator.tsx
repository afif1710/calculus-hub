import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Plane, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CO2FlightCalculator() {
  const [distance, setDistance] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [copied, setCopied] = useState(false);

  const CO2_PER_KM = 0.115; // kg CO2 per passenger per km (average)

  const result = useMemo(() => {
    const distanceNum = parseFloat(distance);
    const passengersNum = parseFloat(passengers);

    if (isNaN(distanceNum) || isNaN(passengersNum) || distanceNum <= 0 || passengersNum <= 0) {
      return null;
    }

    const multiplier = isRoundTrip ? 2 : 1;
    const co2PerPerson = distanceNum * CO2_PER_KM * multiplier;
    const totalCO2 = co2PerPerson * passengersNum;
    const treesToOffset = Math.ceil(totalCO2 / 21); // ~21kg CO2 absorbed per tree per year

    return {
      co2PerPerson,
      totalCO2,
      treesToOffset,
      distanceTotal: distanceNum * multiplier,
    };
  }, [distance, passengers, isRoundTrip]);

  const reset = useCallback(() => {
    setDistance('');
    setPassengers('1');
    setIsRoundTrip(false);
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `CO2 Flight Impact\nDistance: ${result.distanceTotal.toLocaleString()} km ${isRoundTrip ? '(round trip)' : '(one way)'}\nCO2 per Person: ${result.co2PerPerson.toFixed(1)} kg\nTotal CO2 (${passengers} passenger${parseFloat(passengers) > 1 ? 's' : ''}): ${result.totalCO2.toFixed(1)} kg\nTrees to Offset: ${result.treesToOffset}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, passengers, isRoundTrip]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="distance">Flight Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter flight distance in km"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Input
            id="passengers"
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="1"
            min="1"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="roundTrip"
            checked={isRoundTrip}
            onChange={(e) => setIsRoundTrip(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <Label htmlFor="roundTrip" className="cursor-pointer">Round trip</Label>
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Plane className="w-4 h-4" />
                CO2 per Person
              </span>
              <span className="text-xl font-bold">
                {result.co2PerPerson.toFixed(1)} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">
                Total CO2 Emissions
              </span>
              <span className="text-2xl font-bold text-orange-500">
                {result.totalCO2.toFixed(1)} kg
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" />
                Trees to Offset (1 year)
              </span>
              <span className="text-lg font-semibold text-green-500">
                {result.treesToOffset} tree{result.treesToOffset > 1 ? 's' : ''}
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              Based on {CO2_PER_KM} kg CO2 per km (average economy class)
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter distance to calculate carbon footprint
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={copyResult} disabled={!result} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
      </div>
    </div>
  );
}
