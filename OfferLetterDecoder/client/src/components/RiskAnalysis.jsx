import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Wallet,
  Gift,
  FileWarning,
} from "lucide-react";

const icons = {
  "Employment Bond": FileWarning,
  "Notice Period": Clock,
  "Variable Pay": Wallet,
  "Joining Bonus Clawback": Gift,
};

const severityStyles = {
  high: {
    badge: "bg-red-50 text-red-700",
    icon: "bg-red-100 text-red-600",
  },
  medium: {
    badge: "bg-amber-50 text-amber-700",
    icon: "bg-amber-100 text-amber-600",
  },
  low: {
    badge: "bg-green-50 text-green-700",
    icon: "bg-green-100 text-green-600",
  },
};

function RiskAnalysis({ risks }) {
  const highRisks = risks.filter((risk) => risk.severity === "high").length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-ink">
              Clause Analysis
            </h3>
            <p className="text-xs text-muted">
              Important terms found in your offer
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
          {highRisks} High Priority
        </span>
      </div>

      <div className="space-y-4">
        {risks.map((risk) => {
          const Icon = icons[risk.title] || AlertTriangle;
          const styles = severityStyles[risk.severity];

          return (
            <div
              key={risk.title}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-ink">{risk.title}</h4>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${styles.badge}`}
                    >
                      {risk.status}
                    </span>
                  </div>

                  <p className="mt-2 font-heading text-lg font-bold text-ink">
                    {risk.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {risk.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-4">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-xs leading-5 text-amber-800">
          These are automated flags, not legal conclusions. Review the original
          clauses and clarify ambiguous conditions with HR before signing.
        </p>
      </div>
    </div>
  );
}

export default RiskAnalysis;
