// Configuration for the Buy Me Coffee app
// Update these values after deploying your contract

export const CONFIG = {
  // Your deployed package ID (get this after publishing)
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || "",

  // The BuyMeCoffee shared object ID (created on init)
  BUY_ME_COFFEE_ID: import.meta.env.VITE_BUY_ME_COFFEE_ID || "",

  // Sui network (testnet, mainnet, or devnet)
  NETWORK: import.meta.env.VITE_NETWORK || "testnet",

  // RPC URL (optional, uses default if not provided)
  RPC_URL: import.meta.env.VITE_RPC_URL || "",
} as const;

// Validate configuration
if (!CONFIG.PACKAGE_ID || !CONFIG.BUY_ME_COFFEE_ID) {
  console.warn("⚠️ Missing configuration! Please set VITE_PACKAGE_ID and VITE_BUY_ME_COFFEE_ID in .env file");
}
