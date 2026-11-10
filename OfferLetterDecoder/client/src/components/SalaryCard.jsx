import { Wallet, IndianRupee, TrendingUp, Gift } from "lucide-react";

function SalaryCard({ title, amount, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <h3 className="mt-5 font-heading text-2xl font-extrabold text-ink">
        {amount}
      </h3>

      <p className="mt-2 text-xs text-muted">{subtitle}</p>
    </div>
  );
}

export default SalaryCard;
