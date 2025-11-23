import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface TipFormProps {
  onSubmit: (amount: string, message: string) => void;
  loading: boolean;
}

export default function TipForm({ onSubmit, loading }: TipFormProps) {
  const currentAccount = useCurrentAccount();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    onSubmit(amount, message);
    
    // Reset form
    setAmount('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount (SUI)
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            step="0.0001"
            min="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            SUI
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Minimum: 0.0001 SUI
        </p>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a message of support..."
          rows={4}
          maxLength={200}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500 text-right">
          {message.length}/200
        </p>
      </div>

      {currentAccount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">From:</span>{' '}
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>☕</span>
            <span>Send Tip</span>
          </>
        )}
      </button>
    </form>
  );
}

