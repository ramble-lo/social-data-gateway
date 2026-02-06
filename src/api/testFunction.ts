import { authenticatedFetch, getCloudFunctionUrl } from "./config";

/**
 * Test function to get Firestore data
 * Used for testing Cloud Function connectivity
 * Requires authentication
 */
export const callGetFirestoreData = async () => {
  const url = getCloudFunctionUrl("getFirestoreData");

  console.log(`Calling Cloud Function at: ${url}`);

  try {
    const response = await authenticatedFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Response status:", response.status);
      const text = await response.text();
      console.error("Response body:", text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling getFirestoreData:", error);
    throw error;
  }
};
