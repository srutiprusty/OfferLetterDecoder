import { IndianRupee } from "lucide-react";

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function SalaryBreakdown({ salary }) {
  const items = [
    { label: "Basic Salary", amount: salary.basic },
    { label: "House Rent Allowance", amount: salary.hra },
    { label: "Special Allowance", amount: salary.specialAllowance },
    { label: "Variable Pay", amount: salary.variablePay },
    { label: "Employer PF", amount: salary.employerPF },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand">
          <IndianRupee size={21} />
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-ink">
            Salary Breakdown
          </h3>
          <p className="text-xs text-muted">Annual salary components</p>
        </div>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const percentage =
            salary.ctc > 0 ? (item.amount / salary.ctc) * 100 : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="text-muted">{item.label}</span>
                <span className="font-semibold text-ink">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between border-t border-gray-200 pt-5">
        <span className="font-bold text-ink">Total CTC</span>
        <span className="font-heading text-xl font-extrabold text-brand">
          {formatCurrency(salary.ctc)}
        </span>
      </div>
    </div>
  );
}

export default SalaryBreakdown;
