import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { readContracts } from "@wagmi/core";
import Web3 from "web3";
import { ChevronDown } from "lucide-react";
import TakeProfitsButton from "./TakeProfitsButton";
import CompoundButton from "./CompoundButton";
import CONTRACT_ADDRESSES from "../constants/contract-addresses";
import configuration from "../configuration";
import DRIP_FAUCET_ABI from "../constants/abis/drip-faucet-abi";

/**
 * Shorten a wallet address for display, e.g. 0x4f3c…a3c1
 * @param {String} address
 * @returns {String}
 */
const shortenAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

/**
 * Component that will handle the individual account information
 * @param {Object} props - {String} address, {String} account alias, {Function} updateAccountStats
 * @returns HTML table cells with the account information
 */
const Account = ({ address, alias, updateAccountStats }) => {
  const [available, setAvailable] = useState(0);
  const [deposits, setDeposits] = useState(0);
  const [roi, setRoi] = useState(0);
  const { isConnected, address: selectedAddress } = useAccount();
  const buttonDisabled = !isConnected || selectedAddress !== address;
  const loadAccount = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // reload the account every 5 minutes (300000ms)
      loadAccount.current(address);
    }, 300000);
    return () => {
      clearInterval(intervalId);
    };
  }, [address]);

  useEffect(() => {
    /**
     * Function will load claim and available/deposit information for the
     * address passed in
     * @param {String} address - the account address
     */
    loadAccount.current = async (address) => {
      const baseParams = {
        address: CONTRACT_ADDRESSES.DRIP_FAUCET,
        abi: DRIP_FAUCET_ABI,
        args: [address],
      };

      const data = await readContracts({
        contracts: [
          {
            ...baseParams,
            functionName: "claimsAvailable",
          },
          {
            ...baseParams,
            functionName: "userInfo",
          },
        ],
      });

      if (data) {
        // compute the available
        let raw = Web3.utils.fromWei(data[0].result, "ether");
        const currAvailable = parseFloat(raw).toFixed(2);

        // compute the deposits
        raw = Web3.utils.fromWei(data[1].result[2], "ether");
        const currDeposits = parseFloat(raw).toFixed(2);

        // compute the roi for the account
        const currRoi =
          Number(currDeposits) > 0
            ? ((currAvailable / currDeposits) * 100).toFixed(2)
            : "0.00";

        setAvailable(currAvailable);
        setDeposits(currDeposits);
        setRoi(currRoi);

        // report the latest stats up to the dashboard totals
        updateAccountStats(address, {
          available: currAvailable,
          deposits: currDeposits,
          roi: currRoi,
        });
      }
    };

    if (address) {
      loadAccount.current(address);
    }
  }, [address, updateAccountStats]);

  return (
    <>
      <td>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-base-300 text-info flex items-center justify-center text-xs font-semibold">
            {alias?.charAt(0)?.toUpperCase()}
          </div>
          <span className="font-medium">{alias}</span>
        </div>
      </td>
      <td>
        <span
          className="font-mono text-sm text-base-content/60"
          title={address}
        >
          {shortenAddress(address)}
        </span>
      </td>
      <td className="font-medium text-success tabular-nums">{available}</td>
      <td className="tabular-nums">{deposits}</td>
      <td className="text-info tabular-nums">{roi}%</td>
      <td className="text-right">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className={`btn btn-sm gap-1 ${
              buttonDisabled
                ? "btn-ghost text-base-content/30"
                : "btn-ghost text-primary"
            }`}
          >
            Actions
            <ChevronDown size={14} />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 border border-base-300 rounded-box w-52"
          >
            {deposits > configuration.takeProfits.minimum && (
              <li>
                <TakeProfitsButton
                  disabled={buttonDisabled}
                  roi={roi}
                  address={address}
                  loadAccount={loadAccount}
                />
              </li>
            )}
            <li>
              <CompoundButton
                disabled={buttonDisabled}
                roi={roi}
                address={address}
                loadAccount={loadAccount}
              />
            </li>
          </ul>
        </div>
      </td>
    </>
  );
};

export default Account;
