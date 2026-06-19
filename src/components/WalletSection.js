import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import accounts from "../models/accounts";
import { Wallet, LogOut } from "lucide-react";

/**
 * @returns HTML with wallet connect button and information on active connected account
 */
const WalletSection = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const account = accounts.find((a) => {
    return a.address === address;
  });

  return (
    <div className="flex items-center gap-3">
      {isConnected && (
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-success/15 text-success border border-success/30">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          {account?.alias || "Connected"}
        </span>
      )}
      {connectors.map((connector) => (
        <button
          className={`btn btn-sm gap-2 normal-case ${
            isConnected ? "btn-ghost" : "btn-primary"
          }`}
          disabled={!connector.ready}
          key={connector.id}
          onClick={
            isConnected ? () => disconnect() : () => connect({ connector })
          }
        >
          {isConnected ? (
            <>
              <LogOut size={16} /> Disconnect
            </>
          ) : (
            <>
              <Wallet size={16} /> Connect wallet
            </>
          )}
        </button>
      ))}
      {error && (
        <div className="text-error text-xs max-w-[12rem]">{error.message}</div>
      )}
    </div>
  );
};

export default WalletSection;
