# Firebase Setup Guide for GrowLedger Bloom

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name and follow the setup wizard
4. Enable Google Analytics (optional)

## Step 2: Register Your Web App

1. In your Firebase project, click the web icon (</>) to register a web app
2. Give your app a nickname (e.g., "GrowLedger Bloom")
3. You'll receive your Firebase configuration object

## Step 3: Update Firebase Configuration

1. Open `src/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // From Firebase Console
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click **Save**

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a Firestore location (closest to your users)
5. Click **Enable**

## Step 6: Configure Firestore Security Rules

In the **Rules** tab of Firestore, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Plants collection - users can only access their own plants
    match /plants/{plantId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Features Included

✅ **Firebase Authentication** - Email/password sign up and login
✅ **Firestore Database** - Real-time user-specific plant data storage
✅ **AI Care Suggestions** - Smart recommendations based on plant data
✅ **Hardware Integration** - Manual and automatic sensor tracking
✅ **Blockchain Verification** - Growth records with hash verification

## Usage

1. Sign up with your email and password
2. Add your first plant
3. Track growth manually or connect hardware sensors
4. Get AI-powered care suggestions based on your plant data

## Notes

- All plant data is stored per user in Firestore
- Firebase API keys are safe to use in frontend code
- The app works offline with Firestore's local persistence
- Real-time updates sync across all your devices
