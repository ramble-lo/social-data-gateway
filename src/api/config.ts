import { auth } from "@/integrations/firebase/client";
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

/**
 * Authenticated fetch wrapper that automatically adds Firebase Auth ID token
 * Use this for all Cloud Function API calls that require authentication
 * @param url - The URL to fetch
 * @param options - Fetch options (optional)
 * @returns Promise<Response>
 * @throws Error if user is not authenticated
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const idToken = await currentUser.getIdToken();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${idToken}`);

  return fetch(url, {
    ...options,
    headers,
  });
};
