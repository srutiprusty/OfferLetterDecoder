const keywords = [
  "salary",
  "compensation",
  "ctc",
  "gross",
  "basic salary",
  "basic pay",
  "allowance",
  "remuneration",
  "provident fund",
  "gratuity",
  "performance pay",
  "variable pay",
  "service agreement",
  "training expenditure",
  "bond",
  "notice period",
  "joining bonus",
  "relocation bonus",
  "clawback",
  "repayment",
  "recovery of bonus",
  "minimum service",
];

export const filterRelevantPages = (pages) => {
  return pages.filter((page) => {
    const text = page.text.toLowerCase();

    const matches = keywords.filter((keyword) =>
      text.includes(keyword)
    );

    return matches.length > 0;
  });
};