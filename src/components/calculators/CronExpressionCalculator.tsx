import { useState, useMemo } from 'react';
import { Clock, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const minuteOptions = [
  { value: '*', label: 'Every minute' },
  { value: '0', label: 'At minute 0' },
  { value: '15', label: 'At minute 15' },
  { value: '30', label: 'At minute 30' },
  { value: '45', label: 'At minute 45' },
  { value: '*/5', label: 'Every 5 minutes' },
  { value: '*/10', label: 'Every 10 minutes' },
  { value: '*/15', label: 'Every 15 minutes' },
  { value: '*/30', label: 'Every 30 minutes' },
];

const hourOptions = [
  { value: '*', label: 'Every hour' },
  { value: '0', label: 'Midnight (0)' },
  { value: '6', label: '6 AM' },
  { value: '9', label: '9 AM' },
  { value: '12', label: 'Noon (12)' },
  { value: '18', label: '6 PM' },
  { value: '21', label: '9 PM' },
  { value: '*/2', label: 'Every 2 hours' },
  { value: '*/6', label: 'Every 6 hours' },
  { value: '*/12', label: 'Every 12 hours' },
];

const dayOfMonthOptions = [
  { value: '*', label: 'Every day' },
  { value: '1', label: '1st of month' },
  { value: '15', label: '15th of month' },
  { value: '1,15', label: '1st & 15th' },
  { value: 'L', label: 'Last day of month' },
];

const monthOptions = [
  { value: '*', label: 'Every month' },
  { value: '1', label: 'January' },
  { value: '1,4,7,10', label: 'Quarterly' },
  { value: '1,7', label: 'Jan & Jul' },
  { value: '*/3', label: 'Every 3 months' },
];

const dayOfWeekOptions = [
  { value: '*', label: 'Every day' },
  { value: '1-5', label: 'Mon-Fri (Weekdays)' },
  { value: '0,6', label: 'Sat-Sun (Weekends)' },
  { value: '1', label: 'Monday only' },
  { value: '5', label: 'Friday only' },
  { value: '0', label: 'Sunday only' },
];

export function CronExpressionCalculator() {
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const cronExpression = useMemo(() => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const humanReadable = useMemo(() => {
    const parts: string[] = [];
    
    // Minute description
    if (minute === '*') {
      parts.push('Every minute');
    } else if (minute.startsWith('*/')) {
      parts.push(`Every ${minute.slice(2)} minutes`);
    } else {
      parts.push(`At minute ${minute}`);
    }

    // Hour description
    if (hour !== '*') {
      if (hour.startsWith('*/')) {
        parts.push(`every ${hour.slice(2)} hours`);
      } else {
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        parts.push(`at ${hour12}:00 ${ampm}`);
      }
    }

    // Day of month
    if (dayOfMonth !== '*') {
      if (dayOfMonth === 'L') {
        parts.push('on the last day of the month');
      } else if (dayOfMonth.includes(',')) {
        parts.push(`on days ${dayOfMonth} of the month`);
      } else {
        parts.push(`on day ${dayOfMonth} of the month`);
      }
    }

    // Month
    if (month !== '*') {
      if (month.startsWith('*/')) {
        parts.push(`every ${month.slice(2)} months`);
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const months = month.split(',').map(m => monthNames[parseInt(m) - 1] || m).join(', ');
        parts.push(`in ${months}`);
      }
    }

    // Day of week
    if (dayOfWeek !== '*') {
      const dayNames: Record<string, string> = {
        '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
        '4': 'Thursday', '5': 'Friday', '6': 'Saturday',
        '1-5': 'weekdays (Mon-Fri)', '0,6': 'weekends (Sat-Sun)'
      };
      parts.push(`on ${dayNames[dayOfWeek] || dayOfWeek}`);
    }

    return parts.join(', ');
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const handleReset = () => {
    setMinute('0');
    setHour('*');
    setDayOfMonth('*');
    setMonth('*');
    setDayOfWeek('*');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    toast.success('Cron expression copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Minute</label>
          <select
            value={minute}
            onChange={e => setMinute(e.target.value)}
            className="input-calc bg-background"
          >
            {minuteOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Hour</label>
          <select
            value={hour}
            onChange={e => setHour(e.target.value)}
            className="input-calc bg-background"
          >
            {hourOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Day of Month</label>
          <select
            value={dayOfMonth}
            onChange={e => setDayOfMonth(e.target.value)}
            className="input-calc bg-background"
          >
            {dayOfMonthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Month</label>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="input-calc bg-background"
          >
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Day of Week</label>
          <select
            value={dayOfWeek}
            onChange={e => setDayOfWeek(e.target.value)}
            className="input-calc bg-background"
          >
            {dayOfWeekOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Button variant="outline" onClick={handleReset} className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" /> Reset to Default
      </Button>

      <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Cron Expression</span>
          <code className="block text-2xl font-mono font-bold gradient-text">
            {cronExpression}
          </code>
        </div>
        <div className="pt-3 border-t border-border/50">
          <span className="text-sm text-muted-foreground block mb-1">Human Readable</span>
          <span className="text-foreground">{humanReadable}</span>
        </div>
      </div>

      <Button variant="secondary" onClick={handleCopy} className="w-full">
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied!' : 'Copy Cron Expression'}
      </Button>

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Generate cron expressions using dropdowns. Format: minute hour day month weekday
        </span>
      </div>
    </div>
  );
}
