import { useState, useMemo } from 'react';
import { Network } from 'lucide-react';

function cidrToMask(cidr: number): string {
  const mask = Array(4).fill(0)
    .map((_, i) => Math.min(8, Math.max(0, cidr - i * 8)))
    .map(n => n === 0 ? 0 : (~((1 << (8 - n)) - 1) & 0xff));
  return mask.join('.');
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff
  ].join('.');
}

export function SubnetCalculator() {
  const [cidr, setCidr] = useState('192.168.1.0/24');

  const result = useMemo(() => {
    try {
      const [ip, suffix] = cidr.split('/');
      const prefixLength = Number(suffix);
      
      if (!ip || Number.isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
        return { error: 'Invalid CIDR notation (e.g., 192.168.1.0/24)' };
      }
      
      const octets = ip.split('.');
      if (octets.length !== 4 || octets.some(o => {
        const n = parseInt(o);
        return isNaN(n) || n < 0 || n > 255;
      })) {
        return { error: 'Invalid IP address' };
      }

      const mask = cidrToMask(prefixLength);
      const hosts = prefixLength === 32 ? 1 : prefixLength === 31 ? 2 : Math.pow(2, 32 - prefixLength) - 2;
      
      const ipLong = ipToLong(ip);
      const maskLong = ipToLong(mask);
      const networkLong = ipLong & maskLong;
      const broadcastLong = networkLong | (~maskLong >>> 0);
      
      const network = longToIp(networkLong);
      const broadcast = longToIp(broadcastLong);
      const firstHost = prefixLength >= 31 ? network : longToIp(networkLong + 1);
      const lastHost = prefixLength >= 31 ? broadcast : longToIp(broadcastLong - 1);

      return {
        mask,
        wildcardMask: longToIp(~maskLong >>> 0),
        network,
        broadcast,
        firstHost,
        lastHost,
        hosts,
        prefixLength
      };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [cidr]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">CIDR Notation</span>
        <div className="flex gap-2">
          <input
            value={cidr}
            onChange={e => setCidr(e.target.value)}
            className="input-calc flex-1 font-mono"
            placeholder="192.168.1.0/24"
          />
          <div className="w-12 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Network className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {'error' in result ? (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Netmask</div>
              <div className="text-lg font-mono font-medium">{result.mask}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Wildcard Mask</div>
              <div className="text-lg font-mono font-medium">{result.wildcardMask}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Network Address</div>
              <div className="text-lg font-mono font-medium">{result.network}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Broadcast Address</div>
              <div className="text-lg font-mono font-medium">{result.broadcast}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Host Range</div>
            <div className="flex items-center gap-2 font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-card">{result.firstHost}</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-lg bg-card">{result.lastHost}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border text-center">
            <div className="text-sm text-muted-foreground">Usable Hosts</div>
            <div className="text-3xl font-bold gradient-text">{result.hosts.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
