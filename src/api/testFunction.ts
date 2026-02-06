import { getCloudFunctionUrl } from "./config";

/**
 * Test function to get Firestore data
 * Used for testing Cloud Function connectivity
 */
export const callGetFirestoreData = async () => {
  const url = getCloudFunctionUrl("getFirestoreData");

  console.log(`Calling Cloud Function at: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
