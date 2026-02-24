Ohel Rachel

A cross-platform React Native mobile app built with Expo and TypeScript to centralize community communication, prayer schedules, and donations.

(App Store link will be added upon public release.)

Overview

Ohel Rachel provides community members with real-time access to prayer schedules, events, announcements, and donation options. The app uses Firebase Firestore to synchronize data dynamically, ensuring users always see the latest updates without manual refresh.

Why I Built This

The community previously relied on group chats and word-of-mouth to distribute updates about events and prayer schedules. This led to inconsistent communication and missed information.

I built Ohel Rachel to create a centralized, real-time platform that delivers reliable updates to all members through a single mobile application.

Tech Stack

Framework: Expo (React Native 0.81)

Language: TypeScript

Routing: Expo Router (file-based navigation)

Backend: Firebase Firestore (real-time database)

Styling: NativeWind (Tailwind for React Native)

UI Components: React Native Paper + Expo Vector Icons

Build & Distribution: EAS Build (App Store deployment)

Features

Real-time prayer schedule updates

Dynamic schedule section visibility controlled from backend

Community event listings

Donation integration

Cross-platform support (iOS / Android)

Engineering Decisions

Real-Time Updates: Implemented Firestore onSnapshot listeners to enable reactive UI updates without requiring app reloads.

Backend-Controlled Visibility: Designed schedule sections with visibility flags, allowing administrators to modify displayed content instantly.

Type Safety: Used TypeScript to enforce Firestore data consistency and reduce runtime errors.

Deployment Strategy: Chose Expo + EAS Build to simplify provisioning, certificate management, and production builds.

Getting Started
Installation
git clone <repository-url>
cd OhelRachelNew
npm install
Development
npx expo start

Press i for iOS

Press a for Android

Press w for Web

Production Deployment

The application is configured for production builds using EAS Build.

iOS distribution configured

Pending Apple Developer approval for public App Store release

License

[Add license information]