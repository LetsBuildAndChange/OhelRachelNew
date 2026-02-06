import { Stack } from "expo-router";
import ErrorBoundary, { ErrorFallback } from "./ErrorBoundary";
import './globals.css';

export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
