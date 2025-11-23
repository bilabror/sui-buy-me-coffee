import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider } from "@mysten/dapp-kit";
import BuyMeCoffee from "./components/BuyMeCoffee";
import Header from "./components/Header";
import { CONFIG } from "./config";
import { getFullnodeUrl } from "@mysten/sui/client";
import { WalletProvider } from "@mysten/dapp-kit";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  const network = CONFIG.NETWORK as "testnet" | "mainnet" | "devnet";
  const rpcUrl = CONFIG.RPC_URL || getFullnodeUrl(network);

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={{
          [network]: { url: rpcUrl },
        }}
        defaultNetwork={network}
      >
        <WalletProvider autoConnect>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Toaster position="top-right" />
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <BuyMeCoffee />
            </main>

            <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                <p>Built with ❤️ on Sui Blockchain</p>
                {/* <p>
                  Source code:{" "}
                  <a href="https://github.com/sui-buy-me-coffee" target="_blank" rel="noopener noreferrer">
                    https://github.com/sui-buy-me-coffee
                  </a>
                </p> */}
              </div>
            </footer>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
