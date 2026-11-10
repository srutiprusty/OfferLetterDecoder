const NEW_TAX_REGIME = {
  standardDeduction: 75000,
  slabs: [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.1 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.2 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.3 },
  ],
  cess: 0.04,
};

const calculateIncomeTax = (taxableIncome) => {
  let remainingIncome = Math.max(0, taxableIncome);
  let previousLimit = 0;
  let tax = 0;

  for (const slab of NEW_TAX_REGIME.slabs) {
    const taxableInSlab = Math.max(
      0,
      Math.min(remainingIncome, slab.limit - previousLimit),
    );

    tax += taxableInSlab * slab.rate;
    remainingIncome -= taxableInSlab;

    if (remainingIncome <= 0) break;

    previousLimit = slab.limit;
  }

  const cess = tax * NEW_TAX_REGIME.cess;

  return {
    incomeTax: Math.round(tax),
    cess: Math.round(cess),
    totalTax: Math.round(tax + cess),
  };
};

export const calculateSalary = (offerData, options = {}) => {
  // const salary = offerData.salary;

  // if (!salary) {
  //   throw new Error("Salary information is missing.");
  // }

  const salary = offerData?.salary;

if (!salary || typeof salary !== "object") {
  throw new Error(
    "Salary object missing from AI extraction."
  );
}

if (
  salary.ctcAnnual == null &&
  salary.fixedPayAnnual == null &&
  salary.grossAnnual == null
) {
  throw new Error(
    "No usable salary figures found in offer letter."
  );
}

  const employeePFAnnual =
    options.employeePFAnnual !== undefined
      ? options.employeePFAnnual
      : salary.employeePFAnnual;

  const professionalTaxAnnual = options.professionalTaxAnnual ?? null;

  // Annual compensation components
  const fixedPay = salary.fixedPayAnnual ?? 0;
  const variablePay = salary.variablePayAnnual ?? 0;
  const cityAllowance = salary.cityAllowanceAnnual ?? 0;

  // Separate fixed and variable compensation
  const fixedAnnualCompensation = fixedPay + cityAllowance;

  const annualCompensation = fixedAnnualCompensation + variablePay;

  // Monthly values
  const monthlyFixedCompensation = Math.round(fixedAnnualCompensation / 12);

  const monthlyVariableCompensation = Math.round(variablePay / 12);

  const monthlyTotalCompensation = Math.round(annualCompensation / 12);

  // Tax calculation
  const taxableIncome = Math.max(
    0,
    annualCompensation - NEW_TAX_REGIME.standardDeduction,
  );

  const tax = calculateIncomeTax(taxableIncome);

  // Check whether deductions are available
  const hasEmployeePF = Number.isFinite(employeePFAnnual);
  const hasProfessionalTax = Number.isFinite(professionalTaxAnnual);

  const knownEmployeePF = hasEmployeePF ? employeePFAnnual : 0;
  const knownProfessionalTax = hasProfessionalTax ? professionalTaxAnnual : 0;

  // Calculate in-hand only when both deductions are known
  const estimatedMonthlyInHand =
    hasEmployeePF && hasProfessionalTax
      ? Math.round(
          (annualCompensation -
            tax.totalTax -
            knownEmployeePF -
            knownProfessionalTax) /
            12,
        )
      : null;

  // Compensation after estimated income tax, before other deductions
  const estimatedMonthlyCompensationBeforeDeductions = Math.round(
    (annualCompensation - tax.totalTax) / 12,
  );

  return {
    taxRegime: "New Tax Regime",
    taxYear: "2026-27",

    compensation: {
      fixedAnnualCompensation,
      variablePayAnnual: variablePay,
      annualCompensation,

      monthlyFixedCompensation,
      monthlyVariableCompensation,
      monthlyTotalCompensation,
    },

    tax: {
      standardDeduction: NEW_TAX_REGIME.standardDeduction,
      estimatedTaxableIncome: taxableIncome,
      annualIncomeTax: tax.incomeTax,
      cess: tax.cess,
      totalAnnualTax: tax.totalTax,
      monthlyTDS: Math.round(tax.totalTax / 12),
    },

    deductions: {
      employeePFAnnual: hasEmployeePF ? employeePFAnnual : null,
      professionalTaxAnnual: hasProfessionalTax ? professionalTaxAnnual : null,
    },

    estimatedMonthlyInHand,

    estimatedMonthlyCompensationBeforeDeductions,

    assumptions: [
      "New tax regime is used.",
      "Standard deduction of Rs. 75,000 is applied.",
      "Fixed compensation includes the fixed components identified in the offer letter.",
      "Variable pay is shown separately and is not guaranteed.",
      "Employer PF, gratuity and health insurance are excluded from monthly compensation.",
      "Professional tax is not included unless supplied.",
      "Restricted allowances and reimbursements may not be received as unrestricted cash.",
    ],

    warnings: [
      ...(!hasEmployeePF
        ? ["Employee PF deduction is not specified in the offer letter."]
        : []),

      ...(!hasProfessionalTax
        ? [
            "Professional tax is not included because the applicable work location is unconfirmed.",
          ]
        : []),

      "Variable pay depends on the conditions mentioned in the offer letter.",
      "Fixed compensation may include allowances with usage or reimbursement restrictions.",
      "Actual salary credited may differ due to payroll policies, insurance recovery, reimbursements and attendance.",
    ],
  };
};
