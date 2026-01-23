import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, AlertTriangle } from 'lucide-react';

export function JWTDecoderCalculator() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [copied, setCopied] = useState<'header' | 'payload' | null>(null);

  const result = useMemo(() => {
    if (!token.trim()) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format. Expected 3 parts separated by dots.' };
    }

    try {
      // Decode Base64URL to Base64
      const base64UrlToBase64 = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const padding = base64.length % 4;
        if (padding) {
          base64 += '='.repeat(4 - padding);
        }
        return base64;
      };

      const header = JSON.parse(atob(base64UrlToBase64(parts[0])));
      const payload = JSON.parse(atob(base64UrlToBase64(parts[1])));

      // Check expiration
      let expInfo = null;
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        expInfo = {
          date: expDate.toISOString(),
          expired: expDate < now,
          relative: expDate < now 
            ? 'Expired' 
            : `Expires in ${Math.round((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`
        };
      }

      return { header, payload, signature: parts[2], expInfo };
    } catch (e) {
      return { error: 'Could not decode JWT. Invalid Base64 or JSON.' };
    }
  }, [token]);

  const reset = useCallback(() => {
    setToken('');
  }, []);

  const copySection = useCallback((section: 'header' | 'payload') => {
    if (result && !('error' in result)) {
      const data = section === 'header' ? result.header : result.payload;
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(section);
      setTimeout(() => setCopied(null), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <span className="text-amber-500">
          This only decodes the JWT. It does NOT verify the signature.
        </span>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-mono text-xs"
          placeholder="Paste your JWT token here..."
        />
      </div>

      {/* Results */}
      {result && (
        'error' in result ? (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {result.error}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-red-400">Header</span>
                <button
                  onClick={() => copySection('header')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied === 'header' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <pre className="text-xs font-mono overflow-x-auto text-muted-foreground">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-400">Payload</span>
                <button
                  onClick={() => copySection('payload')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied === 'payload' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <pre className="text-xs font-mono overflow-x-auto text-muted-foreground max-h-48 overflow-y-auto">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>

            {/* Expiration Info */}
            {result.expInfo && (
              <div className={`p-3 rounded-lg text-sm ${
                result.expInfo.expired 
                  ? 'bg-red-500/10 border border-red-500/30 text-red-500' 
                  : 'bg-green-500/10 border border-green-500/30 text-green-500'
              }`}>
                <div className="font-medium">{result.expInfo.relative}</div>
                <div className="text-xs opacity-70">{result.expInfo.date}</div>
              </div>
            )}

            {/* Signature */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border">
              <span className="text-sm font-medium text-cyan-400">Signature</span>
              <p className="text-xs font-mono text-muted-foreground mt-2 break-all">
                {result.signature}
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                ⚠️ Signature not verified
              </p>
            </div>
          </div>
        )
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
