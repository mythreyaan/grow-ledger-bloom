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
                      getUserRole() == 'farmer';
      
      // Users can read/write their own plants
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      
      // Authorities can read all plants for claim verification
      allow read: if request.auth != null && getUserRole() == 'authority';
    }

    // Claims collection - for subsidy/insurance verification
    match /claims/{claimId} {
      // Farmers can create their own claims and read their own claims
      allow create: if request.auth != null && request.resource.data.farmerId == request.auth.uid;
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.farmerId ||
        getUserRole() == 'authority'
      );
      // Only authorities can update claims
      allow update: if request.auth != null && getUserRole() == 'authority';
      allow delete: if false; // Claims cannot be deleted
    }

    // User roles collection
    match /userRoles/{userId} {
      // Users can read their own role
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only allow creation during signup (handled in code)
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Only authorities can update roles
      allow write: if request.auth != null && getUserRole() == 'authority';
    }
  }
}
```

## Features Included

✅ **Firebase Authentication** - Email/password sign up and login with OTP verification
✅ **Firestore Database** - Real-time user-specific plant data storage
✅ **Role-Based Access Control** - Farmer and Government Authority roles
✅ **Subsidy & Insurance Claims** - Blockchain-verified crop claim submission and approval
✅ **OTP Verification** - Secure authentication for sign up/in and plant registration
✅ **AI Care Suggestions** - Smart recommendations based on plant data
✅ **AI Predictions** - ML-powered predictions for watering, growth, and stress detection
✅ **Analytics Dashboard** - Charts and trends for plant data
✅ **Weather Integration** - Real-time weather data (OpenWeather API)
✅ **Hardware Integration** - Manual and automatic sensor tracking (6-hour intervals)
✅ **Blockchain Verification** - Growth records with hash verification
✅ **Web3 Wallet** - MetaMask integration for blockchain features

## User Roles

### Farmer (Default)
- Add and manage their own plants
- Record growth data manually (with OTP + image) or via hardware sensors (auto every 6 hours)
- Submit subsidy and insurance claims for government verification
- View AI predictions and care suggestions
- Track claim status (pending/approved/rejected)
- Access personal analytics dashboard

### Government Authority
- Review and verify all submitted claims
- Approve or reject subsidy/insurance requests with remarks
- View all plants in the system for claim verification
- Access comprehensive analytics and claim statistics
- Cannot add or modify plant data (read-only access)

## Claim Verification System

The platform includes a complete subsidy and insurance verification system:

### For Farmers:
1. Submit claims for registered plants
2. Choose scheme type (Subsidy or Insurance)
3. Specify claim amount in INR (₹)
4. Track claim status in real-time
5. View authority remarks for approved/rejected claims

### For Authorities:
1. View all pending claims in a centralized dashboard
2. Access plant growth data linked to each claim
3. Approve or reject claims with detailed remarks
4. Generate blockchain-verified certificates (coming soon)
5. View analytics on claim distribution and approval rates

## Usage

1. **Sign Up**: Create account with email/password and select your role (Farmer/Authority)
2. **OTP Verification**: Complete OTP verification for secure authentication (Demo OTP: 123456)
3. **Add Plants**: Register plants with OTP verification and choose recording mode:
   - **Manual**: Record data manually with OTP verification and image attachment
   - **Automatic**: Connect hardware sensors for automatic recording every 6 hours
4. **Submit Claims**: Farmers can submit subsidy/insurance claims linked to their plants
5. **Verify Claims**: Authorities review and approve/reject claims with remarks
6. **Track Growth**: Get AI-powered care suggestions and predictions
7. **View Analytics**: Access comprehensive dashboards for plant and claim data
8. **Connect Wallet**: Link MetaMask wallet for blockchain verification

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
- Demo OTP is set to "123456" for testing purposes
- Automatic hardware recording captures data every 6 hours
- Claims are immutable once submitted (blockchain principle)
- Authorities cannot delete claims, only approve/reject with remarks

## Government Schemes Supported

This platform is designed to support Tamil Nadu government schemes including:
- **PMFBY** (Pradhan Mantri Fasal Bima Yojana) - Crop Insurance
- **Organic Farming Subsidies** - Financial support for organic cultivation
- **State Agricultural Subsidies** - Various state-level support schemes

The blockchain-verified growth data ensures transparent and tamper-proof claim verification.
