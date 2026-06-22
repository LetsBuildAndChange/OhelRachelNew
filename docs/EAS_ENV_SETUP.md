# EAS environment variables

Production iOS builds do not use your local `.env` file. Set the same `EXPO_PUBLIC_*` variables in EAS before running `eas build`.

## Option A: Expo dashboard

1. Open [expo.dev](https://expo.dev) → your project → **Environment variables**.
2. Add each variable below for the **production** environment (and **preview** if you use that profile).
3. Paste values from Firebase Console → Project settings → Your apps → Web app config.

## Option B: EAS CLI

Run once per variable (replace `YOUR_VALUE` with the value from Firebase):

```bash
eas env:create --name EXPO_PUBLIC_FIREBASE_API_KEY --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_APP_ID --value "YOUR_VALUE" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID --value "YOUR_VALUE" --environment production --visibility plaintext
```

List configured variables:

```bash
eas env:list --environment production
```

## Build and submit

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

Verify Firebase on a **physical device** with the production build before App Store submission.
