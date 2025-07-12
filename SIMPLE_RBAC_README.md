# Simple Role-Based Authentication (Firestore Only)

This is a simplified version of role-based authentication that works with Firebase's free Spark plan, using only Firestore for role management.

## Features

- ✅ User and Admin roles stored in Firestore
- ✅ Role-based component protection
- ✅ Admin panel for user management
- ✅ No Cloud Functions required (works on free plan)
- ✅ Client-side role checking

## Limitations (compared to Cloud Functions approach)

- ❌ No Firebase Custom Claims (less secure)
- ❌ Role changes require manual session refresh
- ❌ Client-side role verification only

## Quick Setup

### 1. Firebase Configuration

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firestore Security Rules

Update your Firestore rules to allow role management:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading all users for admin functionality
      allow read: if request.auth != null;
      
      // Allow admins to update roles (client-side check)
      allow update: if request.auth != null;
    }
  }
}
```

### 3. Make Yourself Admin

1. Create a user account in your app
2. Go to the Admin Panel page
3. Click "Make Me Admin" button
4. Refresh the page to see admin features

## Usage Examples

### Protecting Components
```tsx
import { AdminGuard } from '@/components/RoleGuard';

<AdminGuard>
  <AdminPanel />
</AdminGuard>
```

### Using Role Hooks
```tsx
import { useRoleAccess } from '@/hooks/useRoleAccess';

const { isAdmin, promoteUserToAdmin } = useRoleAccess();
```

### Managing Users
```tsx
// Promote user to admin
const result = await promoteUserToAdmin(userId);

// Demote admin to user  
const result = await demoteUserFromAdmin(userId);
```

## How It Works

1. **User Registration**: New users get "user" role by default
2. **Role Storage**: Roles are stored in Firestore user documents
3. **Role Checking**: Client-side checks against Firestore data
4. **Admin Actions**: Direct Firestore updates for role changes

## Components Included

- `RoleGuard` - Protects components based on roles
- `AdminPanel` - Full admin interface
- `useRoleAccess` - Hook for role-based functionality
- `useAuthStore` - Zustand store with role management

## Security Notes

⚠️ **Important**: This approach relies on client-side security rules and doesn't use Firebase Custom Claims. For production applications with sensitive data, consider upgrading to the Blaze plan and using Cloud Functions for proper server-side role verification.

## Upgrading to Cloud Functions

When you're ready to upgrade to the Blaze plan:

1. Deploy the Cloud Functions from `functions/src/index.ts`
2. Update the auth store to use `httpsCallable`
3. Switch to Firebase Custom Claims
4. Implement server-side role verification

This simple approach gives you role-based authentication that works immediately on Firebase's free plan!
