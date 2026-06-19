import React from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { bsc } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Droplet } from "lucide-react";
import WalletSection from "./components/WalletSection";
import HelpSection from "./components/HelpSection";
import AccountList from "./components/AccountList";
import NotificationDialog from "./components/NoticationDialog";
import NotificationContext from "./contexts/NotificationContext";

// BSC RPC endpoint. The default wagmi publicProvider rotates onto endpoints
// (e.g. ankr) that now require an API key, which breaks contract reads. Use a
// keyless Binance data-seed node by default, overridable via env for a private
// endpoint (Alchemy/QuickNode/etc.) — see .env.example.
const BSC_RPC_URL =
  process.env.REACT_APP_BSC_RPC_URL || "https://bsc-dataseed.binance.org";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc],
  [
    jsonRpcProvider({
      rpc: () => ({ http: BSC_RPC_URL }),
    }),
    publicProvider(),
  ]
);

// create the Wagmi config, we are only supporting Metamask as of now
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
});

const App = () => {
  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen w-full text-base-content">
        <header className="sticky top-0 z-20 border-b border-base-300/70 bg-base-200/80 backdrop-blur">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Droplet className="text-primary-content" size={20} fill="currentColor" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Drip Dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HelpSection />
              <WalletSection />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
          <NotificationContext>
            <NotificationDialog />
            <AccountList />
          </NotificationContext>
        </main>
      </div>
    </WagmiConfig>
  );
};

export default App;
