import { isDevMode } from "@/lib/utils";

// Replace these with your actual project details if they differ
const PROJECT_ID = "xinlong-d2";
const REGION = "us-central1";
const FUNCTION_NAME = "getFirestoreData";

export const callGetFirestoreData = async () => {
  // Construct the URL based on the environment
  // Local emulator: http://localhost:5001/xinlong-d2/us-central1/getFirestoreData
  // Production: https://us-central1-xinlong-d2.cloudfunctions.net/getFirestoreData

  let url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`;

  if (isDevMode()) {
    url = `http://localhost:5001/${PROJECT_ID}/${REGION}/${FUNCTION_NAME}`;
    // If the browser is accessing via a specific IP/Hostname, let's try to infer API location
    // However, if the user manually set port forwarding, direct localhost is usually safer.
    // If user needs to access from other devices, they should configure emulator host.

    // We try to detect if we are on localhost or not.
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      // If accessing via IP (e.g. 192.168.x.x), try to point to that IP:5001
      url = `http://${window.location.hostname}:5001/${PROJECT_ID}/${REGION}/${FUNCTION_NAME}`;
    }
  }

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
