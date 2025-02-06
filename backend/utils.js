import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPdf(pdfFile) {
    try {
        // Asegurarse de que se tiene un Buffer nativo
        const pdfBuffer = Buffer.isBuffer(pdfFile) ? pdfFile : Buffer.from(pdfFile.data || pdfFile);
        
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}
