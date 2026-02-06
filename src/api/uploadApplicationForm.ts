import { getCloudFunctionUrl, fileToBase64 } from "./config";

export interface UploadApplicationFormResponse {
  success: boolean;
  message: string;
  processedCount: number;
  skippedCount?: number;
  duplicateCount?: number;
}

/**
 * Upload Excel file to Cloud Function for processing application form data
 * @param file - Excel file (.xlsx, .xls, .csv)
 * @returns Processing result with counts
 */
export const callUploadApplicationForm = async (
  file: File,
): Promise<UploadApplicationFormResponse> => {
  const url = getCloudFunctionUrl("uploadApplicationForm");

  console.log(`Uploading Excel file to Cloud Function at: ${url}`);

  try {
    // Convert file to Base64
    const fileBase64 = await fileToBase64(file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileBase64,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      console.error("Response status:", response.status);
      const text = await response.text();
      console.error("Response body:", text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UploadApplicationFormResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling uploadApplicationForm:", error);
    throw error;
  }
};
