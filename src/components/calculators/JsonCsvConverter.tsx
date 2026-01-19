import { useState, useMemo } from 'react';
import { Download, ArrowRightLeft } from 'lucide-react';

export function JsonCsvConverter() {
  const [jsonText, setJsonText] = useState('[\n  {"name": "Alice", "age": 30, "city": "NYC"},\n  {"name": "Bob", "age": 25, "city": "LA"}\n]');
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastConverted, setLastConverted] = useState<'json' | 'csv' | null>(null);

  const toCsv = () => {
    try {
      setError(null);
      const arr = JSON.parse(jsonText);
      if (!Array.isArray(arr)) throw new Error('JSON must be an array of objects');
      if (arr.length === 0) throw new Error('Array is empty');
      
      const keys = Array.from(new Set(arr.flatMap(obj => Object.keys(obj))));
      const rows = [keys.join(',')];
      
      for (const row of arr) {
        const values = keys.map(k => {
          const val = row[k] ?? '';
          // Escape commas and quotes
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        rows.push(values.join(','));
      }
      
      setCsvText(rows.join('\n'));
      setLastConverted('csv');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // Parse CSV line handling quoted values with commas
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const toJson = () => {
    try {
      setError(null);
      const lines = csvText.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) throw new Error('CSV must have at least a header and one row');
      
      const keys = parseCsvLine(lines[0]);
      const result = lines.slice(1).map(line => {
        const values = parseCsvLine(line);
        return Object.fromEntries(keys.map((k, i) => [k, values[i] ?? '']));
      });
      
      setJsonText(JSON.stringify(result, null, 2));
      setLastConverted('json');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">JSON</span>
            {jsonText && (
              <button
                onClick={() => downloadFile(jsonText, 'data.json', 'application/json')}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            )}
          </div>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className={`input-calc h-48 font-mono text-sm ${lastConverted === 'json' ? 'ring-2 ring-primary/50' : ''}`}
            placeholder='[{"key": "value"}]'
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">CSV</span>
            {csvText && (
              <button
                onClick={() => downloadFile(csvText, 'data.csv', 'text/csv')}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            )}
          </div>
          <textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            className={`input-calc h-48 font-mono text-sm ${lastConverted === 'csv' ? 'ring-2 ring-primary/50' : ''}`}
            placeholder="name,age,city&#10;Alice,30,NYC"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={toCsv} className="btn-calc flex items-center gap-2">
          JSON <ArrowRightLeft className="w-4 h-4" /> CSV
        </button>
        <button onClick={toJson} className="btn-calc flex items-center gap-2">
          CSV <ArrowRightLeft className="w-4 h-4" /> JSON
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
