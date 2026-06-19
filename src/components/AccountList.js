import React, { useCallback, useMemo, useState } from "react";
import { Droplet, Wallet, TrendingUp } from "lucide-react";
import accounts from "../models/accounts";
import configuration from "../configuration";
import Account from "./Account";

/**
 * Component that will have the list of the accounts
 * @returns HTML related to accounts
 */
const AccountList = () => {
  // per-account stats keyed by address: { available, deposits, roi }
  const [statsMap, setStatsMap] = useState({});

  // helper to record the latest stats reported by an Account row.
  // memoized so it stays stable across renders and doesn't retrigger
  // the data-loading effect in each Account row.
  const updateAccountStats = useCallback((address, stats) => {
    setStatsMap((prev) => ({ ...prev, [address]: stats }));
  }, []);

  const { totalAvailable, totalDeposits, avgRoi } = useMemo(() => {
    const values = Object.values(statsMap);

    // available total only counts accounts above the take-profits minimum
    const available = values.reduce(
      (sum, s) =>
        sum +
        (Number(s.deposits) > configuration.takeProfits.minimum
          ? Number(s.available) || 0
          : 0),
      0
    );
    const deposits = values.reduce(
      (sum, s) => sum + (Number(s.deposits) || 0),
      0
    );
    const roiValues = values
      .map((s) => Number(s.roi))
      .filter((r) => Number.isFinite(r));
    const roi = roiValues.length
      ? roiValues.reduce((a, b) => a + b, 0) / roiValues.length
      : 0;

    return {
      totalAvailable: available.toFixed(2),
      totalDeposits: deposits.toFixed(2),
      avgRoi: roi.toFixed(2),
    };
  }, [statsMap]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Monitor available rewards, deposits and ROI across your wallets.
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Droplet size={18} />}
          label="Total available"
          value={totalAvailable}
          accent="text-success"
        />
        <MetricCard
          icon={<Wallet size={18} />}
          label="Total deposits"
          value={totalDeposits}
          accent="text-base-content"
        />
        <MetricCard
          icon={<TrendingUp size={18} />}
          label="Avg ROI"
          value={`${avgRoi}%`}
          accent="text-info"
        />
      </div>

      {/* Accounts table */}
      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100/60">
        <table className="table">
          <thead>
            <tr className="border-base-300 text-info text-xs uppercase tracking-wider">
              <th>Name</th>
              <th>Address</th>
              <th>Available</th>
              <th>Deposits</th>
              <th>ROI</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <tr
                  key={account.address}
                  className="border-base-300 hover:bg-base-300/30 transition-colors"
                >
                  <Account
                    address={account.address}
                    alias={account.alias}
                    updateAccountStats={updateAccountStats}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-base-content/50"
                >
                  No accounts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Small summary metric tile used in the dashboard header strip.
 */
const MetricCard = ({ icon, label, value, accent }) => (
  <div className="rounded-2xl border border-base-300 bg-base-100/60 p-5">
    <div className="flex items-center gap-2 text-base-content/60 text-sm">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
    <div className={`mt-2 text-3xl font-semibold tabular-nums ${accent}`}>
      {value}
    </div>
  </div>
);

export default AccountList;
