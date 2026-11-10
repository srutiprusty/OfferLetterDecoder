import ai from "../utils/gemini.js";
import { extractionSchema } from "../utils/extractionSchema.js";
import Groq from "groq-sdk";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (model, prompt) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: extractionSchema,
          temperature: 0.1,
        },
      });

      return response;
    } catch (error) {
      const errorMessage = String(error.message || error);

      const isTemporary =
        /503|UNAVAILABLE|429|RESOURCE_EXHAUSTED|500|502|504/i.test(
          errorMessage,
        );

      if (!isTemporary || attempt === maxAttempts) {
        throw error;
      }

      const waitTime = 1000 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini temporarily unavailable. Retry ${attempt}/${maxAttempts} in ${waitTime}ms`,
      );

      await delay(waitTime);
    }
  }
};

export const extractOfferDetails = async (pdfText) => {
  const prompt = `
You are an expert Indian Employment Offer Letter Analyzer,
Compensation Analyst and Legal Clause Extraction Specialist.

Your task is to deeply analyze the COMPLETE offer letter and
extract ALL available information.

IMPORTANT:
Do not provide a short summary instead of structured extraction.
Do not skip information because it appears in tables, annexures,
footnotes, additional pages or paragraphs.

Return ONLY valid JSON matching the exact structure below.

========================================
1. OUTPUT JSON STRUCTURE
========================================

{
  "companyName": null,
  "jobRole": null,
  "currency": "INR",

  "salary": {
    "ctcAnnual": null,
    "fixedPayAnnual": null,
    "variablePayAnnual": null,
    "grossAnnual": null,

    "basicAnnual": null,
    "hraAnnual": null,
    "personalAllowanceAnnual": null,
    "specialAllowanceAnnual": null,
    "leaveTravelAllowanceAnnual": null,
    "foodCardAnnual": null,
    "communicationAllowanceAnnual": null,
    "cityAllowanceAnnual": null,

    "employeePFAnnual": null,
    "employerPFAnnual": null,
    "employerPFContributionRatePercent": null,

    "gratuityAnnual": null,
    "healthInsuranceAnnual": null,

    "joiningBonus": null,
    "relocationBonus": null
  },

  "componentConditions": [
    {
      "component": "",
      "condition": "",
      "evidenceQuote": ""
    }
  ],

  "clauses": [
    {
      "type": "employment_bond",
      "present": false,
      "amount": null,
      "amountFrequency": "unknown",
      "durationMonths": null,
      "noticePeriodDays": null,
      "plainLanguageSummary": "Not found in the document",
      "evidenceQuote": null
    }
  ],

  "missingInformation": []
}

========================================
2. GENERAL EXTRACTION RULES
========================================

1. Analyze every page provided in the document.
2. Extract information from tables, paragraphs, footnotes,
   annexures and additional schedules.
3. Do not skip any salary component.
4. Extract exact values whenever available.
5. Convert monthly amounts into annual amounts by multiplying
   by 12, only when the frequency is clear.
6. Never confuse monthly and annual amounts.
7. Never invent missing values.
8. Use null for unavailable numerical values.
9. Preserve the original meaning of every condition.
10. Every extracted condition and clause must have an exact
    supporting evidence quote.
11. Do not confuse employee PF with employer PF.
12. Do not confuse CTC, gross salary and take-home salary.
13. Do not create duplicate salary components.
14. Search the entire document for information before marking
    a field as missing.

========================================
3. COMPLETE SALARY EXTRACTION
========================================

Extract ALL the following components:

A. Overall compensation:

- ctcAnnual
- fixedPayAnnual
- variablePayAnnual
- grossAnnual

B. Fixed salary:

- basicAnnual
- hraAnnual
- personalAllowanceAnnual
- specialAllowanceAnnual
- leaveTravelAllowanceAnnual
- foodCardAnnual
- communicationAllowanceAnnual
- cityAllowanceAnnual

C. Retirement and employer benefits:

- employeePFAnnual
- employerPFAnnual
- employerPFContributionRatePercent
- gratuityAnnual
- healthInsuranceAnnual

D. Other payments:

- joiningBonus
- relocationBonus

IMPORTANT SALARY RULES:

1. Extract CTC from the total compensation table or offer summary.

2. Extract gross salary only when explicitly identified
   as gross salary in the document.

3. Extract fixedPayAnnual separately from variable pay.

4. For this application's calculation:
   fixedPayAnnual must exclude cityAllowanceAnnual because
   the salary calculator adds city allowance separately.

5. Do not include employer PF, gratuity or health insurance
   in fixed cash compensation.

6. Extract employee PF only when explicitly identified
   as an employee deduction/contribution.

7. Extract employer PF only when explicitly identified
   as an employer contribution.

8. If employer PF is specified as a percentage of basic salary,
   extract the percentage and calculate the annual contribution
   only when the calculation is directly supported by the document.

9. Never assume employee PF equals employer PF.

10. Personal Allowance and Special Allowance are separate fields.

11. Monthly Performance Pay and Performance Bonus are
    variable compensation, not joining bonuses.

12. Do not combine different salary components into one field.

13. If the document contains multiple salary tables,
    prefer the final applicable compensation structure.

========================================
4. COMPONENT CONDITIONS EXTRACTION
========================================

Extract ALL conditions associated with salary components.

Search specifically for:

1. Basic Salary
2. HRA
3. Personal Allowance
4. Special Allowance
5. Leave Travel Allowance (LTA)
6. Food Card
7. Communication Allowance
8. City Allowance
9. Monthly Performance Pay
10. Performance Bonus
11. Employee Provident Fund
12. Employer Provident Fund
13. Gratuity
14. Health Insurance
15. Joining Bonus
16. Relocation Bonus

For every component, investigate:

- Eligibility requirements.
- Minimum and maximum limits.
- Monthly and annual restrictions.
- Tax exemption conditions.
- Reimbursement requirements.
- Supporting document requirements.
- Performance requirements.
- Conditions for payment.
- Conditions under which the benefit can change.
- Conditions under which the benefit can stop.
- Employee contribution or salary recovery.
- Dependent coverage conditions.

Return each condition using EXACTLY:

{
  "component": "HRA",
  "condition": "Explain the actual condition in simple language.",
  "evidenceQuote": "Exact sentence from the offer letter."
}

IMPORTANT:

Do not return an empty array if conditions exist.

Do not use alternative keys such as:
- type
- description
- quote

Use only:
- component
- condition
- evidenceQuote

Do not invent conditions for components that have none.

========================================
5. EMPLOYMENT CLAUSE EXTRACTION
========================================

Extract these SIX clause categories separately.

A. employment_bond

Look for:
- Mandatory service period.
- Training bond.
- Service agreement.
- Bond amount.
- Repayment amount.
- Surety or guarantor requirements.
- Continuous service requirements.
- Leave without pay exclusions.
- Unauthorized absence exclusions.
- Conditions triggering repayment.

B. notice_period

Extract:
- Employee notice period.
- Employer notice period.
- Mandatory notice requirements.
- Payment in lieu of notice.
- Early relieving conditions.
- Damages for failure to serve notice.

C. variable_pay

Extract:
- Monthly performance pay.
- Annual variable pay.
- Performance bonus.
- Quarterly or annual payout.
- Performance evaluation requirements.
- Project allocation requirements.
- Company performance conditions.
- Active employment requirements on payout dates.

D. joining_bonus_clawback

Extract:
- Joining bonus amount.
- Repayment conditions.
- Minimum service requirements.
- Repayment duration.
- Conditions triggering repayment.

E. relocation_bonus_clawback

Extract:
- Relocation assistance amount.
- Repayment conditions.
- Minimum service requirements.
- Recovery conditions.

F. international_training_bond

Extract:
- International training requirements.
- Minimum service after international training.
- Additional bond agreements.
- Repayment obligations.
- Required service duration.

IMPORTANT:

Keep employment bond and international training bond
as two separate clauses.

For EVERY clause category, return an object.

If a clause is not found, return:

{
  "type": "joining_bonus_clawback",
  "present": false,
  "amount": null,
  "amountFrequency": "unknown",
  "durationMonths": null,
  "noticePeriodDays": null,
  "plainLanguageSummary": "Not found in the document",
  "evidenceQuote": null
}

Never omit a clause category.

========================================
6. MISSING INFORMATION
========================================

Identify information that cannot be confirmed.

Examples:

- Employee PF deduction not specified.
- Employer PF amount not specified.
- Professional tax not specified.
- Joining date not specified.
- Initial work location not specified.
- Joining bonus not specified.
- Relocation bonus not specified.
- Special allowance not specified.
- Exact insurance premium recovery not specified.

IMPORTANT:

Do not mark an item missing if it is explicitly available.

Do not mark an explicitly unavailable benefit as missing
if the document confirms that the benefit is not provided.

========================================
7. EVIDENCE EXTRACTION
========================================

For every extracted condition and employment clause:

- Copy the exact supporting sentence.
- Do not rewrite the evidence quote.
- Do not combine unrelated sentences.
- Preserve amounts, dates, percentages and durations.
- Do not generate fake evidence.

For salary components, use the relevant table values
and preserve their original monthly/annual meaning.

========================================
8. FINAL VALIDATION
========================================

Before returning JSON, verify:

1. Every salary field is present.
2. All salary amounts have the correct annual frequency.
3. No monthly amount has been mistaken for an annual amount.
4. Employee PF and employer PF are separate.
5. Fixed and variable compensation are separate.
6. City allowance is not double-counted.
7. CTC reconciliation is checked where sufficient values exist.
8. All six employment clause categories are present.
9. All component conditions use the correct JSON keys.
10. Every extracted clause contains supporting evidence.
11. No relevant information has been skipped.
12. Missing information is correctly identified.

Return valid JSON only.
No Markdown.
No explanations outside JSON.

========================================
COMPLETE OFFER LETTER TEXT
========================================

${pdfText}
`;

  const groqSchema = `
Return JSON using EXACTLY this structure:

{
  "companyName": null,
  "jobRole": null,
  "currency": "INR",
  "salary": {
    "ctcAnnual": null,
    "fixedPayAnnual": null,
    "variablePayAnnual": null,
    "grossAnnual": null,
    "basicAnnual": null,
    "hraAnnual": null,
    "personalAllowanceAnnual": null,
    "specialAllowanceAnnual": null,
    "leaveTravelAllowanceAnnual": null,
    "foodCardAnnual": null,
    "communicationAllowanceAnnual": null,
    "cityAllowanceAnnual": null,
    "employeePFAnnual": null,
    "employerPFAnnual": null,
    "employerPFContributionRatePercent": null,
    "gratuityAnnual": null,
    "healthInsuranceAnnual": null,
    "joiningBonus": null,
    "relocationBonus": null
  },
  "componentConditions": [],
  "clauses": [],
  "missingInformation": []
}

Rules:
- Every salary field must be present.
- Use null when information is unavailable.
- Do not omit the salary object.
- Follow all extraction instructions in the user prompt.
- Return JSON only.
`;
  //////////////////////////////////////////////////////changes///////////////////////////////////////////////
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  try {
    // Primary: Gemini
    console.log("Trying Gemini...");

    const response = await generateWithRetry(model, prompt);

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    try {
      return JSON.parse(response.text);
    } catch {
      throw new Error("Gemini returned invalid JSON.");
    }
  } catch (geminiError) {
    console.error("Gemini failed:", geminiError.message);
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    // Fallback: Groq
    console.log("Switching to Groq...");

    try {
      const response = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: groqSchema,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Groq returned an empty response.");
      }

      // console.log("Groq analysis successful.");

      // return JSON.parse(content);

      console.log("Groq analysis successful.");

      const parsedData = JSON.parse(content);

      // Debug AI response
      console.log("Groq response keys:", Object.keys(parsedData));

      console.log(
        "Groq salary object:",
        JSON.stringify(parsedData.salary, null, 2),
      );

      if (!parsedData.salary) {
        console.log("FULL GROQ RESPONSE:", content);

        throw new Error(
          "Groq response does not contain the required salary object.",
        );
      }

      return parsedData;
    } catch (groqError) {
      console.error("Groq failed:", groqError.message);

      throw new Error(
        `Both AI providers failed. Gemini: ${geminiError.message}. Groq: ${groqError.message}`,
      );
    }
  }
};
extractOfferDetails;
