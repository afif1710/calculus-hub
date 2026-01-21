import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EngagementRateCalculator() {
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [followers, setFollowers] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const likesNum = parseFloat(likes);
    const commentsNum = parseFloat(comments);
    const followersNum = parseFloat(followers);

    if (isNaN(likesNum) || isNaN(commentsNum) || isNaN(followersNum) || followersNum <= 0) {
      return null;
    }

    const engagementRate = ((likesNum + commentsNum) / followersNum) * 100;
    const totalEngagements = likesNum + commentsNum;

    return {
      engagementRate,
      totalEngagements,
      isGood: engagementRate >= 3,
    };
  }, [likes, comments, followers]);

  const reset = useCallback(() => {
    setLikes('');
    setComments('');
    setFollowers('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Engagement Rate: ${result.engagementRate.toFixed(2)}%\nTotal Engagements: ${result.totalEngagements.toLocaleString()}\nLikes: ${likes}\nComments: ${comments}\nFollowers: ${followers}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, likes, comments, followers]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="likes">Likes</Label>
          <Input
            id="likes"
            type="number"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="Enter number of likes"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments">Comments</Label>
          <Input
            id="comments"
            type="number"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter number of comments"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="followers">Followers</Label>
          <Input
            id="followers"
            type="number"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            placeholder="Enter number of followers"
            min="1"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Engagements</span>
              <span className="text-xl font-bold">
                {result.totalEngagements.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engagement Rate
              </span>
              <span className={`text-2xl font-bold ${result.isGood ? 'text-green-500' : 'text-yellow-500'}`}>
                {result.engagementRate.toFixed(2)}%
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              {result.isGood ? '✓ Good engagement rate (≥3%)' : 'Below average engagement rate (<3%)'}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate engagement rate
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
