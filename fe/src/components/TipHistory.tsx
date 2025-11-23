import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { CONFIG } from '../config';

interface Tip {
  sender: string;
  amount: string;
  message: string;
  timestamp: number;
}

export default function TipHistory() {
  const client = useSuiClient();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTipHistory = async () => {
      try {
        const object = await client.getObject({
          id: CONFIG.BUY_ME_COFFEE_ID,
          options: {
            showContent: true,
            showType: true,
          },
        });

        if (object.data?.content && 'fields' in object.data.content) {
          const fields = object.data.content.fields as any;
          const tipsArray = fields.tips || [];
          
          // Convert tips array to our format
          const formattedTips: Tip[] = tipsArray.map((tip: any) => ({
            sender: tip.fields?.sender || tip.sender || '',
            amount: tip.fields?.amount || tip.amount || '0',
            message: tip.fields?.message 
              ? new TextDecoder().decode(
                  new Uint8Array(
                    (tip.fields.message as number[]).map((n: number) => n & 0xff)
                  )
                )
              : tip.message || '',
            timestamp: tip.fields?.timestamp || tip.timestamp || 0,
          }));

          // Sort by timestamp (newest first)
          formattedTips.sort((a, b) => b.timestamp - a.timestamp);
          setTips(formattedTips.slice(0, 10)); // Show last 10 tips
        }
      } catch (error) {
        console.error('Error loading tip history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTipHistory();
    const interval = setInterval(loadTipHistory, 10000);
    return () => clearInterval(interval);
  }, [client]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tips yet. Be the first to support! ☕</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {tips.map((tip, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(Number(tip.timestamp)).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                {(parseInt(tip.amount) / 1_000_000_000).toFixed(4)} SUI
              </p>
            </div>
          </div>
          {tip.message && (
            <p className="text-sm text-gray-700 mt-2 italic">
              "{tip.message}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

