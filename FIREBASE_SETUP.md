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
    // Helper function to check user role
    function getUserRole() {
      return get(/databases/$(database)/documents/userRoles/$(request.auth.uid)).data.role;
    }

    // Plants collection - role-based access
    match /plants/{plantId} {
      // Farmers can create and manage their own plants
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId &&
                      getUserRole() in ['farmer', 'admin'];
      
      // Farmers can read/write their own plants
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      
      // Researchers can read all plants but not write
      allow read: if request.auth != null && getUserRole() == 'researcher';
      
      // Admins can read/write all plants
      allow read, write: if request.auth != null && getUserRole() == 'admin';
    }

    // User roles collection
    match /userRoles/{userId} {
      // Users can read their own role
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only allow creation during signup (handled in code)
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can update roles
      allow write: if request.auth != null && getUserRole() == 'admin';
    }
  }
}
```

## Features Included

✅ **Firebase Authentication** - Email/password sign up and login
✅ **Firestore Database** - Real-time user-specific plant data storage
✅ **Role-Based Access Control** - Farmer, Researcher, and Admin roles
✅ **AI Care Suggestions** - Smart recommendations based on plant data
✅ **AI Predictions** - ML-powered predictions for watering, growth, and stress detection
✅ **Analytics Dashboard** - Charts and trends for plant data
✅ **Weather Integration** - Real-time weather data (OpenWeather API)
✅ **Hardware Integration** - Manual and automatic sensor tracking
✅ **Blockchain Verification** - Growth records with hash verification
✅ **Web3 Wallet** - MetaMask integration for blockchain features

## User Roles

### Farmer (Default)
- Add and manage their own plants
- Record growth data manually or via hardware
- View AI predictions and care suggestions
- Access personal analytics dashboard

### Researcher
- View all plants in the system (read-only)
- Access analytics and trends across all data
- Cannot add or modify plant data
- Perfect for data analysis and research purposes

### Admin
- Full access to all plants
- Can manage any plant data
- Approve or verify records before blockchain entry
- Manage user roles (requires manual Firestore update)

## Usage

1. Sign up with your email and password (default role: Farmer)
2. Add your first plant (if you're a Farmer or Admin)
3. Track growth manually or connect hardware sensors
4. Get AI-powered care suggestions and predictions
5. View analytics dashboard for trends and insights
6. Connect MetaMask wallet for blockchain verification

## Weather API Setup (Optional)

To enable live weather data:

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your free API key
3. Open `src/hooks/useWeather.ts`
4. Replace `'demo'` with your actual API key:

```typescript
const WEATHER_API_KEY = 'your_actual_api_key_here';
```

## Notes

- All plant data is stored per user in Firestore
- Firebase API keys are safe to use in frontend code
- The app works offline with Firestore's local persistence
- Real-time updates sync across all your devices
- Weather widget shows demo data until you add your API key
- AI predictions improve with more data points (7+ records recommended)
