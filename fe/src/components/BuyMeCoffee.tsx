import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import ConnectButton from "./ConnectButton";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { buildSendTipTransaction, getBuyMeCoffeeData } from "../lib/sui";
import StatsCard from "./StatsCard";
import TipHistory from "./TipHistory";
import TipForm from "./TipForm";

interface BuyMeCoffeeData {
  totalTipsReceived: string;
  totalTippers: string;
  tipCount: string;
  creator: string;
}

export default function BuyMeCoffee() {
  const [data, setData] = useState<BuyMeCoffeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const loadData = async () => {
    try {
      const result = await getBuyMeCoffeeData();
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load Buy Me Coffee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendTip = async (amount: string, message: string) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setSending(true);
    try {
      const senderAddress = account.address;
      if (!senderAddress) {
        throw new Error("No account found");
      }

      const tx = buildSendTipTransaction(amount, message);

      // Execute transaction
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("Tip sent successfully! ☕");
            setTimeout(loadData, 2000);
            setSending(false);
          },
          onError: (error: any) => {
            console.error("Error sending tip:", error);
            toast.error(error.message || "Failed to send tip");
            setSending(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Error sending tip:", error);
      toast.error(error.message || "Failed to send tip");
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">⚠️ Unable to load Buy Me Coffee data. Please check your configuration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Support the Creator</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Show your appreciation by sending a tip in SUI. Every contribution helps!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Tips" value={`${(parseInt(data.totalTipsReceived) / 1_000_000_000).toFixed(4)} SUI`} icon="💰" />
        <StatsCard title="Total Supporters" value={data.totalTippers} icon="👥" />
        <StatsCard title="Total Tips Count" value={data.tipCount} icon="☕" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tip Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Tip</h3>
          {account ? <TipForm onSubmit={handleSendTip} loading={sending} /> : <ConnectButton />}
        </div>

        {/* Tip History */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Tips</h3>
          <TipHistory />
        </div>
      </div>
    </div>
  );
}
