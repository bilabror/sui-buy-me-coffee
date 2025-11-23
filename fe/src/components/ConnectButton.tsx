import { useWallets, useConnectWallet } from '@mysten/dapp-kit';
import { useState } from 'react';

export default function ConnectButton() {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = (walletName: string) => {
    const wallet = wallets.find((w) => w.name === walletName);
    if (wallet) {
      connect(
        { wallet },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
  };

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Wallets Found
          </h4>
          <p className="text-gray-600">
            Please install a Sui wallet extension to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h4>
        <p className="text-gray-600 mb-6">
          Connect your Sui wallet to send tips and support the creator
        </p>
      </div>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2 max-w-md mx-auto">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-900 font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-between"
            >
              <span>{wallet.name}</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-gray-600 hover:text-gray-800 text-sm py-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
