import { useAccounts, useCurrentAccount, useCurrentWallet, useSwitchAccount } from "@mysten/dapp-kit";
import { useState, useRef, useEffect } from "react";

export default function WalletMenu() {
  const { currentWallet } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const { mutate: switchAccount } = useSwitchAccount();
  const accounts = useAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!currentAccount || !currentWallet) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    if (currentWallet) {
      await currentWallet.features["standard:disconnect"]?.disconnect();
    }
    setIsOpen(false);
  };

  // const handleSwitchWallet = async (walletName: string) => {
  //   if (currentWallet && walletName !== currentWallet.name) {
  //     // Disconnect current wallet first
  //     if (currentWallet.features["standard:disconnect"]) {
  //       await currentWallet.features["standard:disconnect"].disconnect();
  //     }
  //     // Connect new wallet
  //     const wallet = accounts.find((w: any) => w.name === walletName);
  //     if (wallet && wallet.features["standard:connect"]) {
  //       await wallet.features["standard:connect"].connect();
  //     }
  //   }
  //   setIsOpen(false);
  // };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="font-medium">{formatAddress(currentAccount?.address || "")}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* Current Account */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Connected Account</p>
            <p className="text-sm font-medium text-gray-900 break-all">{currentAccount?.address || ""}</p>
            <p className="text-xs text-gray-500 mt-1">{currentWallet.name}</p>
          </div>

          {/* Switch Wallet Section */}
          {accounts.length > 1 && (
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Switch Wallet</p>
              <div className="space-y-1">
                {accounts.map((account) => (
                  <button
                    key={account.address}
                    // onClick={() => handleSwitchWallet(wallet.address)}
                    onClick={() => {
                      switchAccount(
                        { account },
                        {
                          onSuccess: () => {
                            setIsOpen(false);
                          },
                        }
                      );
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      account.address === currentAccount?.address ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{account.address.slice(0, 10)}...{account.address.slice(-10)}</span>
                      {account.address === currentAccount?.address && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disconnect Button */}
          <div className="px-4 pt-2 border-t border-gray-200">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
