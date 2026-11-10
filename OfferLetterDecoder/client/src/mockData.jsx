export const mockOffer = {
  company: "Tech Solutions Pvt. Ltd.",
  role: "Software Engineer",
  candidate: "Candidate",
  fileName: "Software_Engineer_Offer.pdf",

  salary: {
    ctc: 650000,
    fixedPay: 550000,
    variablePay: 100000,
    grossAnnual: 520000,
    basic: 260000,
    hra: 130000,
    specialAllowance: 130000,
    employerPF: 31200,
    employeePF: 31200,
    professionalTax: 2400,
    incomeTax: 0,
    monthlyInHand: 40533,
  },

  tax: {
    regime: "New Tax Regime",
    financialYear: "FY 2026-27",
    taxableIncome: 0,
    annualTax: 0,
    note: "Illustrative placeholder. Actual tax requires verified salary components and applicable tax rules.",
  },

  risks: [
    {
      title: "Employment Bond",
      value: "₹1,00,000",
      description:
        "The offer mentions a bond amount of ₹1 lakh if you leave before completing the specified service period.",
      severity: "high",
      status: "Review required",
    },
    {
      title: "Notice Period",
      value: "90 Days",
      description:
        "A 90-day notice period may make switching jobs more difficult.",
      severity: "medium",
      status: "Long notice period",
    },
    {
      title: "Variable Pay",
      value: "₹1,00,000",
      description:
        "A portion of your CTC is performance-linked and may not be guaranteed.",
      severity: "medium",
      status: "Variable component",
    },
    {
      title: "Joining Bonus Clawback",
      value: "Not detected",
      description:
        "No joining bonus repayment condition was identified in this sample.",
      severity: "low",
      status: "Not detected",
    },
  ],
};
