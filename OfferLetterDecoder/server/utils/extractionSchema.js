import { Type } from "@google/genai";

const nullableNumber = {
  type: [Type.NUMBER, Type.NULL],
};

const nullableString = {
  type: [Type.STRING, Type.NULL],
};

export const extractionSchema = {
  type: Type.OBJECT,

  properties: {
    companyName: nullableString,
    jobRole: nullableString,

    currency: {
      type: Type.STRING,
    },

    salary: {
      type: Type.OBJECT,
      properties: {
        ctcAnnual: nullableNumber,
        fixedPayAnnual: nullableNumber,
        variablePayAnnual: nullableNumber,
        grossAnnual: nullableNumber,

        basicAnnual: nullableNumber,
        hraAnnual: nullableNumber,
        personalAllowanceAnnual: nullableNumber,
        specialAllowanceAnnual: nullableNumber,

        leaveTravelAllowanceAnnual: nullableNumber,
        foodCardAnnual: nullableNumber,
        communicationAllowanceAnnual: nullableNumber,
        cityAllowanceAnnual: nullableNumber,

        employeePFAnnual: nullableNumber,
        employerPFAnnual: nullableNumber,
        employerPFContributionRatePercent: nullableNumber,

        gratuityAnnual: nullableNumber,
        healthInsuranceAnnual: nullableNumber,

        joiningBonus: nullableNumber,
        relocationBonus: nullableNumber,
      },

      required: [
        "ctcAnnual",
        "fixedPayAnnual",
        "variablePayAnnual",
        "grossAnnual",
        "basicAnnual",
        "hraAnnual",
        "personalAllowanceAnnual",
        "specialAllowanceAnnual",
        "leaveTravelAllowanceAnnual",
        "foodCardAnnual",
        "communicationAllowanceAnnual",
        "cityAllowanceAnnual",
        "employeePFAnnual",
        "employerPFAnnual",
        "employerPFContributionRatePercent",
        "gratuityAnnual",
        "healthInsuranceAnnual",
        "joiningBonus",
        "relocationBonus",
      ],
    },

    // Conditions attached to individual salary components
    componentConditions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: {
            type: Type.STRING,
          },
          condition: {
            type: Type.STRING,
          },
          evidenceQuote: nullableString,
        },
        required: ["component", "condition", "evidenceQuote"],
      },
    },

    clauses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              "employment_bond",
              "notice_period",
              "variable_pay",
              "joining_bonus_clawback",
              "relocation_bonus_clawback",
              "international_training_bond",
            ],
          },

          present: {
            type: Type.BOOLEAN,
          },

          amount: nullableNumber,

          amountFrequency: {
            type: Type.STRING,
            enum: ["one_time", "monthly", "annual", "unknown"],
          },

          durationMonths: nullableNumber,
          noticePeriodDays: nullableNumber,

          plainLanguageSummary: {
            type: Type.STRING,
          },

          evidenceQuote: nullableString,
        },

        required: [
          "type",
          "present",
          "amount",
          "amountFrequency",
          "durationMonths",
          "noticePeriodDays",
          "plainLanguageSummary",
          "evidenceQuote",
        ],
      },
    },

    missingInformation: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
  },

  required: [
    "companyName",
    "jobRole",
    "currency",
    "salary",
    "componentConditions",
    "clauses",
    "missingInformation",
  ],
};
