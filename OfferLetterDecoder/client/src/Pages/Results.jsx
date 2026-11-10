import { useState } from "react";

const formatCurrency = (value, currency = "INR") => {
  if (value === null || value === undefined) return "Not specified";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const Section = ({ title, description, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const MetricCard = ({ label, value, description }) => (
  <div className="rounded-xl border border-gray-200 p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);

const DetailRow = ({ label, value, note, strong = false }) => (
  <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p
        className={`text-sm ${strong ? "font-semibold text-gray-900" : "text-gray-700"}`}
      >
        {label}
      </p>
      {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
    </div>
    <p
      className={`text-sm sm:text-right ${strong ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}
    >
      {value ?? "Not specified"}
    </p>
  </div>
);

const Evidence = ({ quote }) => {
  const [open, setOpen] = useState(false);

  if (!quote) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs font-medium text-orange-600 hover:text-orange-700"
      >
        {open ? "Hide evidence −" : "View offer letter evidence +"}
      </button>

      {open && (
        <blockquote className="mt-2 rounded-lg bg-gray-50 p-3 text-xs leading-6 text-gray-600">
          "{quote}"
        </blockquote>
      )}
    </div>
  );
};

const StatusBadge = ({ present }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
      present ? "bg-orange-50 text-orange-700" : "bg-gray-100 text-gray-600"
    }`}
  >
    {present ? "Found" : "Not found"}
  </span>
);

const clauseLabels = {
  employment_bond: "Employment Bond",
  notice_period: "Notice Period",
  variable_pay: "Variable Pay",
  joining_bonus_clawback: "Joining Bonus Clawback",
  relocation_bonus_clawback: "Relocation Bonus Clawback",
  international_training_bond: "International Training Bond",
};

const Results = ({ file, analysis, onBack, metadata }) => {
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);

  if (!analysis) return null;

  const {
    companyName,
    jobRole,
    currency = "INR",
    salary = {},
    salaryAnalysis = {},
    clauses = [],
    componentConditions = [],
    missingInformation = [],
  } = analysis;

  const {
    compensation = {},
    tax = {},
    deductions = {},
    estimatedMonthlyInHand,
    estimatedMonthlyCompensationBeforeDeductions,
    assumptions = [],
  } = salaryAnalysis;

  const format = (value) => formatCurrency(value, currency);

  const salaryComponents = [
    ["Basic Salary", salary.basicAnnual],
    ["HRA", salary.hraAnnual],
    ["Personal Allowance", salary.personalAllowanceAnnual],
    ["Special Allowance", salary.specialAllowanceAnnual],
    ["Leave Travel Allowance", salary.leaveTravelAllowanceAnnual],
    ["Food Card", salary.foodCardAnnual],
    ["Communication Allowance", salary.communicationAllowanceAnnual],
  ];

  const employerBenefits = [
    ["Employer PF", salary.employerPFAnnual],
    ["Gratuity", salary.gratuityAnnual],
    ["Health Insurance", salary.healthInsuranceAnnual],
  ];

  const visibleConditions = showAllConditions
    ? componentConditions
    : componentConditions.slice(0, 5);

  const insuranceCondition = componentConditions.find((item) =>
    item.component?.toLowerCase().includes("health insurance"),
  );

  const verificationItems = [...missingInformation];

  if (
    insuranceCondition &&
    /recovered from salary/i.test(insuranceCondition.condition || "")
  ) {
    verificationItems.push(
      "The exact amount of the mandatory Higher Hospitalisation insurance premium recovered from salary is not specified.",
    );
  }

  const fixedCompensation = compensation.fixedAnnualCompensation;
  const variablePay = compensation.variablePayAnnual;
  const employerPF = salary.employerPFAnnual ?? 0;
  const gratuity = salary.gratuityAnnual ?? 0;
  const insurance = salary.healthInsuranceAnnual ?? 0;

  const hasCTCReconciliation =
    fixedCompensation != null &&
    variablePay != null &&
    salary.employerPFAnnual != null &&
    salary.gratuityAnnual != null &&
    salary.healthInsuranceAnnual != null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="mb-3 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              ← Back to upload
            </button>

            <h1 className="text-2xl font-bold text-gray-900">Offer Analysis</h1>

            <p className="mt-1 text-sm text-gray-500">
              {file?.name || metadata?.fileName || "Uploaded offer letter"}
            </p>
          </div>

          <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            Analysis completed
          </span>
        </div>

        {/* Company */}
        <div className="rounded-2xl bg-gray-900 p-5 text-white md:p-6">
          <p className="text-sm text-gray-400">Company</p>

          <h2 className="mt-1 text-xl font-semibold">
            {companyName || "Company not identified"}
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            {jobRole || "Job role not identified"}
          </p>

          <p className="mt-3 text-xs text-gray-400">
            Currency: {currency}
            {" · "}
            Tax regime: {salaryAnalysis.taxRegime || "Not specified"}
            {salaryAnalysis.taxYear && ` · Tax year: ${salaryAnalysis.taxYear}`}
          </p>
        </div>

        {/* 1. Compensation Summary */}
        <Section
          title="1. Compensation Summary"
          description="Your headline salary figures at a glance."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Annual CTC"
              value={format(salary.ctcAnnual)}
              description="Total cost to company"
            />

            <MetricCard
              label="Fixed Annual Compensation"
              value={format(compensation.fixedAnnualCompensation)}
            />

            <MetricCard
              label="Variable Annual Pay"
              value={format(compensation.variablePayAnnual)}
              description="Performance-based"
            />

            <MetricCard
              label="Monthly Compensation"
              value={format(estimatedMonthlyCompensationBeforeDeductions)}
              description="Before employee deductions"
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            Monthly compensation includes the estimated fixed and variable
            components. It is not confirmed take-home pay and may differ based
            on actual performance payouts, deductions and payroll adjustments.
          </p>
        </Section>

        {/* 2. Salary Breakdown */}
        <Section
          title="2. Salary Breakdown"
          description="Understand your salary components and employer-provided benefits."
        >
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Fixed pay components
          </h3>

          <DetailRow
            label="Fixed pay subtotal"
            value={format(salary.fixedPayAnnual)}
            note="Salary components before city allowance"
            strong
          />

          {salaryComponents.map(([label, value]) =>
            value !== null && value !== undefined ? (
              <DetailRow key={label} label={label} value={format(value)} />
            ) : null,
          )}

          {salary.cityAllowanceAnnual != null && (
            <DetailRow
              label="City Allowance"
              value={format(salary.cityAllowanceAnnual)}
              note="Included in fixed annual compensation"
            />
          )}

          <div className="mt-3 rounded-lg bg-gray-50 px-4">
            <DetailRow
              label="Total fixed annual compensation"
              value={format(compensation.fixedAnnualCompensation)}
              strong
            />
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Employer benefits included in CTC
            </h3>

            {employerBenefits.map(([label, value]) =>
              value !== null && value !== undefined ? (
                <DetailRow key={label} label={label} value={format(value)} />
              ) : null,
            )}

            <DetailRow
              label="Employer PF contribution rate"
              value={
                salary.employerPFContributionRatePercent != null
                  ? `${salary.employerPFContributionRatePercent}%`
                  : "Not specified"
              }
            />
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              CTC reconciliation
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              How the annual CTC is calculated from compensation and employer
              benefits.
            </p>

            <div className="mt-3">
              <DetailRow
                label="Fixed compensation"
                value={format(fixedCompensation)}
              />

              <DetailRow label="Variable pay" value={format(variablePay)} />

              <DetailRow
                label="Employer PF"
                value={format(salary.employerPFAnnual)}
              />

              <DetailRow
                label="Gratuity"
                value={format(salary.gratuityAnnual)}
              />

              <DetailRow
                label="Health insurance"
                value={format(salary.healthInsuranceAnnual)}
              />
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3">
              {hasCTCReconciliation && (
                <DetailRow
                  label="Total calculated CTC"
                  value={format(
                    fixedCompensation +
                      variablePay +
                      employerPF +
                      gratuity +
                      insurance,
                  )}
                  strong
                />
              )}

              <DetailRow
                label="CTC mentioned in offer"
                value={format(salary.ctcAnnual)}
                strong
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Employer PF, gratuity and health insurance are included in the CTC
              calculation but are not paid directly as monthly cash.
            </p>
          </div>
        </Section>

        {/* 3. Tax & Take-Home */}
        <Section
          title="3. Tax & Estimated Take-Home"
          description="Estimated tax and deductions based on the available information."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Estimated Taxable Income"
              value={format(tax.estimatedTaxableIncome)}
            />

            <MetricCard
              label="Annual Income Tax + Cess"
              value={format(tax.totalAnnualTax)}
            />

            <MetricCard
              label="Estimated Monthly TDS"
              value={format(tax.monthlyTDS)}
            />
          </div>

          <div className="mt-5">
            <DetailRow
              label="Employee PF deduction"
              value={format(deductions.employeePFAnnual)}
            />

            <DetailRow
              label="Professional tax"
              value={format(deductions.professionalTaxAnnual)}
            />
          </div>

          <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-900">
              Estimated monthly in-hand salary
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-700">
              {estimatedMonthlyInHand != null
                ? format(estimatedMonthlyInHand)
                : "Cannot be determined yet"}
            </p>

            <p className="mt-2 text-xs leading-5 text-orange-800">
              {estimatedMonthlyInHand != null
                ? "This is an estimate, not a guaranteed payroll amount."
                : "Employee PF and/or professional tax information is missing. The actual in-hand salary cannot yet be reliably calculated."}
            </p>
          </div>
        </Section>

        {/* 4. Employment Clauses */}
        <Section
          title="4. Important Employment Clauses"
          description="Understand the obligations and conditions mentioned in your offer."
        >
          <div className="space-y-4">
            {clauses.map((clause, index) => {
              const label =
                clauseLabels[clause.type] ||
                clause.type?.replaceAll("_", " ") ||
                `Clause ${index + 1}`;

              return (
                <div
                  key={clause.type || index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold capitalize text-gray-900">
                      {label}
                    </h3>

                    <StatusBadge present={clause.present} />
                  </div>

                  {clause.present && (
                    <>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {clause.plainLanguageSummary ||
                          "Details were not extracted."}
                      </p>

                      <div className="mt-3">
                        {clause.amount != null && (
                          <DetailRow
                            label="Amount"
                            value={format(clause.amount)}
                          />
                        )}

                        {clause.durationMonths != null && (
                          <DetailRow
                            label="Duration"
                            value={`${clause.durationMonths} months`}
                          />
                        )}

                        {clause.noticePeriodDays != null && (
                          <DetailRow
                            label="Notice period"
                            value={`${clause.noticePeriodDays} days`}
                          />
                        )}

                        {clause.amountFrequency &&
                          clause.amountFrequency !== "unknown" && (
                            <DetailRow
                              label="Frequency"
                              value={clause.amountFrequency.replaceAll(
                                "_",
                                " ",
                              )}
                            />
                          )}
                      </div>

                      <Evidence quote={clause.evidenceQuote} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* 5. Allowance Conditions */}
        <Section
          title="5. Allowance & Salary Component Conditions"
          description="Check restrictions and conditions attached to your salary components."
        >
          <div className="space-y-4">
            {visibleConditions.map((condition, index) => (
              <div
                key={`${condition.component || "condition"}-${index}`}
                className="rounded-xl border border-gray-200 p-4"
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {condition.component || "Salary component"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {condition.condition || "No condition details available."}
                </p>

                <Evidence quote={condition.evidenceQuote} />
              </div>
            ))}
          </div>

          {componentConditions.length > 5 && (
            <button
              onClick={() => setShowAllConditions(!showAllConditions)}
              className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              {showAllConditions
                ? "Show less"
                : `Show all ${componentConditions.length} conditions`}
            </button>
          )}
        </Section>

        {/* 6. Things to Verify */}
        <Section
          title="6. Things to Verify Before Accepting"
          description="Important details to confirm with the employer."
        >
          {verificationItems.length > 0 ? (
            <div className="space-y-3">
              {verificationItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl bg-amber-50 p-3"
                >
                  <span className="mt-0.5 font-semibold text-amber-600">!</span>

                  <p className="text-sm leading-6 text-amber-900">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No missing information was identified.
            </p>
          )}

          {assumptions.length > 0 && (
            <div className="mt-5 border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-gray-800">
                  Calculation assumptions ({assumptions.length})
                </span>

                <span className="text-sm text-orange-600">
                  {showAssumptions ? "Hide −" : "View +"}
                </span>
              </button>

              {showAssumptions && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
                  {assumptions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Section>

        {/* Disclaimer */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs leading-6 text-gray-500">
            OfferLens provides an AI-assisted interpretation of your offer
            letter. Salary figures, tax calculations and clause summaries are
            estimates based on extracted information. Always verify important
            terms with the employer and consult a qualified tax professional
            when needed.
          </p>

          {metadata && (
            <p className="mt-2 text-xs text-gray-400">
              Analyzed {metadata.pages ?? "—"} pages
              {metadata.extractedCharacters != null &&
                ` · ${metadata.extractedCharacters.toLocaleString("en-IN")} characters extracted`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
