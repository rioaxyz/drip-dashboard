import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import accounts from "../models/accounts";

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
    <div>
      <div>
        {connectors.map((connector) => (
          <button
            className="w-52"
            disabled={!connector.ready}
            key={connector.id}
            onClick={
              isConnected ? () => disconnect() : () => connect({ connector })
            }
          >
            <div>{isConnected ? "Disconnect " : "Connect Wallet"}</div>
          </button>
        ))}
        {isConnected && (
          <div className="absolute active-account-info">
            ℹ Current Account is {account?.alias}
          </div>
        )}
        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
};

export default WalletSection;
