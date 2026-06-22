# Copilot Instructions for OhelRachelNew

## Project Overview
**OhelRachelNew** is a cross-platform React Native mobile app built with Expo and TypeScript. It's a community/religious app (based on naming) featuring multiple feature tabs (home, events, minyan times, videos, donation, etc.) and real-time data pulled from Firebase Firestore.

## Architecture & Key Patterns

### Tech Stack
- **Framework**: Expo 54 with React Native 0.81.5
- **Router**: Expo Router (~6.0.14) for file-based routing with tab navigation
- **Styling**: NativeWind (Tailwind CSS for React Native) + custom Tailwind theme
- **Backend**: Firebase (Firestore for real-time data, v12.1.0)
- **Language**: TypeScript (with mixed .ts, .tsx, .js files)
- **UI**: React Native Paper components, Expo vector icons

### Folder Structure
```
app/                    # File-based routes (Expo Router)
├── (tabs)/             # Tab-based navigation layout
│   ├── _layout.tsx     # Tab config & TabIcon component
│   ├── index.tsx       # Home tab
│   ├── Events.tsx      # Events tab
│   ├── donation.tsx    # Donation tab
│   ├── videos.tsx      # Videos tab
│   ├── MinyanTimes.js  # Real-time prayer schedule (complex Firestore queries)
│   └── Firebase.js     # Firestore initialization
├── _layout.tsx         # Root layout wrapping tabs
└── globals.css         # Global styling
Components/            # Reusable UI components (YoutubeEmbed.tsx)
constants/             # Icon & image imports
interfaces/            # TypeScript types (Movie, TrendingMovie interfaces)
lib/                   # Shared utilities (Firebase.js master config)
```

### Critical Data Flow Pattern
**Real-time Firestore hierarchy** (see [MinyanTimes.js](app/(tabs)/MinyanTimes.js)):
- `settings/app` → stores `currentScheduleId`
- `settings/app/schedules/{scheduleId}/sections` → prayer schedule sections
- Each section contains time slots with `isVisible` flag
- Components use `onSnapshot()` listeners for reactive updates when data changes

### Styling Architecture
**Tailwind with NativeWind** ([tailwind.config.js](tailwind.config.js)):
- Custom color palette: `primary` (gold), `secondary` (sky blue), `light/dark` shades
- Classes applied inline: `className="text-primary font-semibold"`
- Some inline styles still used for dynamic values (opacity, borderRadius)
- Content paths configured for `app/**/*.{js,jsx,ts,tsx}`

## Developer Workflows

### Setup & Running
```bash
npm install                    # Install dependencies
npx expo start                 # Start dev server
# Choose: i (iOS), a (Android), w (web), or use Expo Go
npm run lint                   # Run ESLint
npm run reset-project          # Clean slate for new development
```

### Key Build Targets
- **iOS**: `npm run ios` (requires Xcode, simulators)
- **Android**: `npm run android` (requires Android Studio emulator)
- **Web**: `npm run web` (runs in browser)
- **EAS Build**: Configured in [eas.json](eas.json) for cloud builds

### Firebase Credentials
Firebase config is **hardcoded in** [lib/Firebase.js](lib/Firebase.js) and [app/(tabs)/Firebase.js](app/(tabs)/Firebase.js) — both initialize the same Firestore instance. No environment variables used (see [app.json](app.json) for secrets management via EAS).

## Project Conventions

### Import Aliases
- `@/*` resolves to root directory (e.g., `@/components/Button` → `./components/Button`)
- Configured in [tsconfig.json](tsconfig.json)

### Component Structure
- **Tabs**: Use Expo Router's `<Tabs>` with `screenOptions` for bar styling
- **Custom icons**: All icons stored in `assets/icons/`, imported via [constants/icons.ts](constants/icons.ts) with `@ts-ignore` comments


### Naming Conventions
- Tab screens: lowercase with `.tsx` extension (e.g., `donation.tsx`)
- Components: PascalCase (e.g., `YoutubeEmbed.tsx`)
- Utilities: lowercase (e.g., `Firebase.js`)

### Mixed TypeScript & JavaScript
- Most new code is `.tsx`/.ts`, but utilities use `.js` (e.g., MinyanTimes.js, Firebase.js)
- TypeScript config allows this; enable `checkJs: true` to validate JS files

## Critical Files & Integration Points

| File | Purpose |
|------|---------|
| [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) | Tab navigation config, custom TabIcon component |
| [app/(tabs)/MinyanTimes.js](app/(tabs)/MinyanTimes.js) | Complex nested Firestore queries with real-time listeners |
| [lib/Firebase.js](lib/Firebase.js) | Master Firestore instance export (`db`) used throughout |
| [tailwind.config.js](tailwind.config.js) | Theme colors & content paths |
| [app/globals.css](app/globals.css) | Global NativeWind styles |

## Common Tasks

- **Add a new tab**: Create file in `app/(tabs)/`, update `_layout.tsx` Tabs config, add icon to [constants/icons.ts](constants/icons.ts)
- **Connect to Firestore**: Import `db` from `@/lib/Firebase`, use `collection()`, `query()`, `onSnapshot()`
- **Customize colors**: Edit theme colors in [tailwind.config.js](tailwind.config.js), reference via `className="text-[color-name]"`
- **Platform-specific code**: Use file extensions (e.g., `.ios.tsx`, `.android.tsx`) with Expo Router auto-selection
