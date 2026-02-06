import { isDevMode } from "@/lib/utils";

// Project configuration
export const PROJECT_ID = "xinlong-d2";
export const REGION = "us-central1";

/**
 * Get the Cloud Function URL based on environment
 * - Development: Uses local emulator
 * - Production: Uses deployed Cloud Functions
 */
export const getCloudFunctionUrl = (functionName: string): string => {
  let url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${functionName}`;

  if (isDevMode()) {
    url = `http://localhost:5001/${PROJECT_ID}/${REGION}/${functionName}`;

    // If accessing via IP (e.g. 192.168.x.x), point to that IP:5001
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      url = `http://${window.location.hostname}:5001/${PROJECT_ID}/${REGION}/${functionName}`;
    }
  }

  return url;
};

/**
 * Convert File to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
