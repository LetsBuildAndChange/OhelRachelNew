# Ohel Rachel

A cross-platform React Native mobile app for the Ohel Rachel community, built with Expo and TypeScript.

## Overview

Ohel Rachel is a community and religious app providing members with real-time access to prayer schedules, events, donation options, and more. The app features a tab-based navigation interface with real-time data synchronization through Firebase Firestore.

## Why I Built This

The community previously relied on group chats and word-of-mouth to distribute information about events and prayer schedules. This led to inconsistent communication and missed updates.

I built Ohel Rachel to centralize announcements, schedules, and donation options into a single real-time mobile platform accessible to all community members.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) 54 with React Native 0.81.5
- **Router**: Expo Router (~6.0.14) for file-based routing with tab navigation
- **Language**: TypeScript with mixed .ts and .tsx files
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native) with custom theme
- **Backend**: Firebase Firestore for real-time data
- **UI Components**: React Native Paper + Expo Vector Icons
- **Build**: EAS Build configured for cloud builds

## Features

- **Home Tab**: Community dashboard and announcements
- **Events Tab**: Upcoming community events calendar
- **Minyan Times Tab**: Real-time prayer schedule with live section visibility
- **Donation Tab**: Secure donation interface
- **"About Us" Action**: Community information access


## Engineering Decisions

- Real-Time Updates: Implemented Firestore onSnapshot listeners to enable reactive UI updates without requiring app reloads.
- Backend-Controlled Visibility: Designed schedule sections with visibility flags, allowing administrators to modify displayed content instantly.
- Type Safety: Used TypeScript to enforce Firestore data consistency and reduce runtime errors.
- Deployment Strategy: Chose Expo + EAS Build to simplify provisioning, certificate management, and production builds.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd OhelRachelNew
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npx expo start
```

Choose your platform:
- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web**: Press `w`
- **Expo Go**: Scan QR code with Expo Go app


## Production Deployment

The application is configured for production builds using EAS Build.

iOS distribution configured

Pending Apple Developer approval for public App Store release



