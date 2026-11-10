// import pdf from "pdf-parse";

// export const extractPDFText = async (buffer) => {
//   try {
//     const result = await pdf(buffer);

//     const extractedText = result.text.replace(/\s+/g, " ").trim();

//     if (!extractedText) {
//       throw new Error("No readable text found. This may be a scanned PDF.");
//     }

//     return {
//       text: extractedText,
//       pages: result.numpages,
//     };
//   } catch (error) {
//     throw new Error(error.message || "Failed to extract PDF text.");
//   }
// };



import pdf from "pdf-parse";

export const extractPDFText = async (buffer) => {
  try {
    const pages = [];
    let pageNumber = 0;

    const result = await pdf(buffer, {
      pagerender: async (pageData) => {
        pageNumber++;

        const content = await pageData.getTextContent();

        const pageText = content.items
          .map((item) => item.str)
          .join(" ");

        pages.push({
          pageNumber,
          text: pageText,
        });

        return pageText;
      },
    });

    const text = pages.map((page) => page.text).join("\n");

    if (!text.trim()) {
      throw new Error(
        "No readable text found. This may be a scanned PDF."
      );
    }

    return {
      text,
      pages,
      pageCount: result.numpages,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to extract PDF.");
  }
};