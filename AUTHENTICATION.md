# Firebase Authentication Implementation

This document describes the Firebase Authentication implementation for the Social Data Gateway application.

## Features

- **Email/Password Authentication**: Users can register and login with email and password
- **Google Authentication**: Users can login using their Google account
- **Password Reset**: Users can reset their password via email
- **Protected Routes**: Unauthenticated users are redirected to the login page
- **User Profile**: Display user information and logout functionality
- **Persistent Sessions**: User sessions persist across browser refreshes

## Components

### Authentication Hook (`src/hooks/useAuth.tsx`)

- Provides authentication context throughout the application
- Manages user state and authentication methods
- Handles login, signup, logout, and password reset

### Login Form (`src/components/LoginForm.tsx`)

- Email/password login
- Google OAuth login
- Password reset functionality
- Form validation and error handling

### Signup Form (`src/components/SignupForm.tsx`)

- New user registration
- Email/password signup
- Google OAuth signup
- Password confirmation validation

### Password Reset Form (`src/components/PasswordResetForm.tsx`)

- Password reset via email
- Success confirmation
- Back to login navigation

### User Profile (`src/components/UserProfile.tsx`)

- Displays user information
- Avatar with initials fallback
- Logout functionality
- Dropdown menu interface

### Protected Route (`src/components/ProtectedRoute.tsx`)

- Wraps protected content
- Redirects unauthenticated users
- Loading state handling

### Authentication Page (`src/pages/AuthPage.tsx`)

- Combined login and signup interface
- Tab-based navigation
- Responsive design

## Setup Instructions

1. **Firebase Configuration**: Ensure your Firebase project is properly configured in `src/integrations/firebase/client.ts`

2. **Enable Authentication Methods**:

   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Google authentication
   - Configure authorized domains

3. **Google OAuth Setup**:

   - Add your domain to authorized domains in Firebase Console
   - Configure OAuth consent screen in Google Cloud Console if needed

4. **Environment Variables** (Optional):
   - Consider moving Firebase config to environment variables for production

## Usage

### Basic Authentication Flow

1. **Unauthenticated User**: Redirected to `/auth`
2. **Login/Signup**: User can choose between login and signup tabs
3. **Authentication**: User provides credentials or uses Google OAuth
4. **Redirect**: Authenticated user is redirected to `/home`
5. **Protected Content**: User can access the main application

### Programmatic Usage

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { currentUser, login, logout, signup } = useAuth();

  // Check if user is authenticated
  if (currentUser) {
    console.log("User:", currentUser.email);
  }

  // Login
  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
}
```

## Security Considerations

1. **Client-side Validation**: All forms include client-side validation
2. **Error Handling**: Proper error messages for authentication failures
3. **Loading States**: Prevents multiple submissions during authentication
4. **Route Protection**: Unauthenticated users cannot access protected routes
5. **Session Management**: Firebase handles secure session management

## Customization

### Styling

- All components use Tailwind CSS classes
- Consistent with the existing design system
- Responsive design for mobile and desktop

### Language

- Currently in Traditional Chinese
- Easy to internationalize by updating text strings

### Additional Providers

- Easy to add more authentication providers (Facebook, Twitter, etc.)
- Extend the `useAuth` hook with new methods

## Troubleshooting

### Common Issues

1. **Firebase Config Error**: Ensure Firebase configuration is correct
2. **Google OAuth Error**: Check authorized domains in Firebase Console
3. **CORS Issues**: Verify domain is added to authorized domains
4. **Password Reset**: Ensure email templates are configured in Firebase Console

### Debug Mode

- Check browser console for authentication errors
- Verify Firebase project settings
- Test with different browsers and devices
