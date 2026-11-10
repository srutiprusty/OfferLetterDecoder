
import { extractPDFText } from "../utils/pdfService.js";
import { extractOfferDetails } from "../utils/aiservice.js";
import { calculateSalary } from "../utils/salaryCalculation.js";
import { filterRelevantPages } from "../utils/pageFilter.js";

export const analyzeOffer = async (req, res) => {
  try {
    // 1. Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an offer letter PDF.",
      });
    }

    const buffer = req.file.buffer;

    // 2. Verify PDF signature
    const pdfSignature = Buffer.from("%PDF-");
    const signaturePosition = buffer.indexOf(pdfSignature);

    if (signaturePosition === -1 || signaturePosition > 1024) {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF file.",
      });
    }

    // 3. Extract PDF text
    let extractedPDF;

    try {
      extractedPDF = await extractPDFText(buffer);
    } catch (error) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }

    if (extractedPDF.text.length > 80000) {
      return res.status(413).json({
        success: false,
        message: "The extracted document is too large to analyze.",
      });
    }

    // Declare outside the inner try so metadata can access them
    let relevantPages = [];
    let filteredText = "";
    let offerDetails;

    // 4. Filter pages and extract offer details
    try {
      relevantPages = filterRelevantPages(extractedPDF.pages);

      if (!relevantPages.length) {
        return res.status(422).json({
          success: false,
          message: "Could not identify salary or employment details.",
        });
      }

      filteredText = relevantPages
        .map((page) => `PAGE ${page.pageNumber}\n${page.text}`)
        .join("\n\n");

      console.log("Total pages:", extractedPDF.pageCount);
      console.log(
        "Selected pages:",
        relevantPages.map((page) => page.pageNumber),
      );
      console.log("Original characters:", extractedPDF.text.length);
      console.log("Filtered characters:", filteredText.length);

      offerDetails = await extractOfferDetails(filteredText);
    } catch (error) {
      console.error("AI extraction failed:", error.message);

      return res.status(502).json({
        success: false,
        message: "Unable to analyze the offer letter. Please try again.",
      });
    }

    // 5. Validate AI extraction
    if (!offerDetails?.salary) {
      console.log("Invalid AI extraction:", offerDetails);

      return res.status(422).json({
        success: false,
        message: "AI could not extract salary information.",
        extractedData: offerDetails,
      });
    }

    // 6. Calculate salary
    const salaryAnalysis = calculateSalary(offerDetails);

    // 7. Combine extracted data and calculated analysis
    const result = {
      ...offerDetails,
      salaryAnalysis,
    };

    // 8. Return response
    return res.status(200).json({
      success: true,
      message: "Offer letter analyzed successfully.",
      data: result,
      metadata: {
        totalPages: extractedPDF.pageCount,
        selectedPages: relevantPages.map((page) => page.pageNumber),
        extractedCharacters: extractedPDF.text.length,
        filteredCharacters: filteredText.length,
        fileName: req.file.originalname,
      },
    });
  } catch (error) {
    console.error("Offer analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing the offer.",
    });
  }
};
