import { ReceiptIndianRupee } from "lucide-react";

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function TaxBreakdown({ salary, tax }) {
  const deductions = [
    {
      label: "Employee Provident Fund",
      amount: salary.employeePF,
    },
    {
      label: "Professional Tax",
      amount: salary.professionalTax,
    },
    {
      label: "Income Tax",
      amount: salary.incomeTax,
    },
  ];

  const totalDeductions = deductions.reduce(
    (total, item) => total + item.amount,
    0,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ReceiptIndianRupee size={21} />
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-ink">
            Deductions & Tax
          </h3>
          <p className="text-xs text-muted">Estimated annual deductions</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Annual Gross Salary</span>
          <span className="font-semibold text-ink">
            {formatCurrency(salary.grossAnnual)}
          </span>
        </div>

        {deductions.map((item) => (
          <div key={item.label} className="flex justify-between gap-3 text-sm">
            <span className="text-muted">{item.label}</span>
            <span className="font-semibold text-red-600">
              - {formatCurrency(item.amount)}
            </span>
          </div>
        ))}

        <div className="flex justify-between border-t border-gray-200 pt-4 text-sm">
          <span className="font-bold text-ink">Total Deductions</span>
          <span className="font-bold text-red-600">
            {formatCurrency(totalDeductions)}
          </span>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <div className="flex justify-between gap-3">
            <span className="text-sm font-semibold text-ink">
              Monthly In-hand
            </span>
            <span className="font-heading text-xl font-extrabold text-brand">
              {formatCurrency(salary.monthlyInHand)}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Estimated amount after the deductions shown above.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-semibold text-ink">Tax assumptions</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          {tax.regime} · {tax.financialYear}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">{tax.note}</p>
      </div>
    </div>
  );
}

export default TaxBreakdown;
