import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { CONFIG } from "../config";
import { Transaction } from "@mysten/sui/transactions";

export function getSuiClient(): SuiClient {
  const rpcUrl = CONFIG.RPC_URL || getFullnodeUrl(CONFIG.NETWORK as "testnet" | "mainnet" | "devnet");
  return new SuiClient({ url: rpcUrl });
}

export async function getBuyMeCoffeeData() {
  const client = getSuiClient();
  const object = await client.getObject({
    id: CONFIG.BUY_ME_COFFEE_ID,
    options: {
      showContent: true,
      showType: true,
    },
  });

  if (!object.data?.content || !("fields" in object.data.content)) {
    throw new Error("Invalid object data");
  }

  const fields = object.data.content.fields as any;

  return {
    totalTipsReceived: fields.total_tips_received || "0",
    totalTippers: fields.total_tippers || "0",
    tipCount: fields.tips?.length?.toString() || "0",
    creator: fields.creator || "",
  };
}

export const buildSendTipTransaction = (amount: string, message: string) => {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(amount) * 1_000_000_000)]);

  tx.moveCall({
    target: `${CONFIG.PACKAGE_ID}::sui_buy_me_coffee::buy_coffee`,
    arguments: [tx.object(CONFIG.BUY_ME_COFFEE_ID), coin, tx.pure.string(message)],
  });
  return tx;
};
