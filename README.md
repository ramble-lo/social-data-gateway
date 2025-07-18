# Social Data Gateway

The Social Data Gateway is a comprehensive, web-based platform designed to streamline community activity management for the Xinglong Social Housing (興隆社宅 2 區). It provides a centralized system for managing event registrations, participant data, and communication. The application features role-based access for administrators and residents, ensuring secure and efficient data handling.

## Key Features

- **User Authentication**: Secure login and registration using email/password and Google OAuth, powered by Firebase Authentication.
- **Role-Based Access Control**: Differentiated user experiences for administrators and residents.
  - **Admin View**: Includes features for uploading registration data from Excel files, viewing all registration history, and managing participant lists.
  - **User View**: Provides quick links to important resources and a view of their registration history.
- **Data Management**:
  - **Excel Upload**: Admins can upload event registration data in `.xlsx` format.
  - **Registration History**: A paginated view of all historical registration data.
  - **Participant List**: A paginated and searchable list of all unique participants.
- **Responsive UI**: A modern and responsive user interface built with **React**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**.
- **Client-Side Routing**: A seamless single-page application (SPA) experience using **React Router**.
- **State Management**: Efficient data fetching and caching with **TanStack Query**.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn UI
- **Routing**: React Router
- **State Management**: TanStack Query (React Query)
- **Backend & Authentication**: Firebase
- **Form Handling**: React Hook Form, Zod
- **Linting**: ESLint

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project with Authentication and Firestore enabled.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ramble-lo/social-data-gateway.git
    cd social-data-gateway
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    - Create a `src/integrations/firebase/client.ts` file.
    - Add your Firebase project configuration to this file. You can get this from your Firebase project settings.

    ```typescript
    // src/integrations/firebase/client.ts
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export { app, auth, db };
    ```

### Running the Application

- **Development Mode:**

  ```bash
  yarn dev
  ```

  This will start the Vite development server, typically at `http://localhost:5173`.

- **Production Build:**

  ```bash
  yarn build
  ```

  This will create a `dist` directory with the optimized production build.

- **Preview Production Build:**
  ```bash
  yarn preview
  ```
  This will serve the production build locally for testing.

## Available Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the application for production.
- `yarn lint`: Lints the codebase using ESLint.
- `yarn preview`: Serves the production build locally.
