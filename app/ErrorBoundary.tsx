import React from 'react';
import { Pressable, Text, View } from 'react-native';

type FallbackProps = {
  error: Error | null;
  resetError: () => void;
};
// an error boundary component that catches errors in its children and displays a fallback UI
export function ErrorFallback({ error, resetError }: FallbackProps) {
  return (
    <View className="flex-1 items-center justify-center bg-red-50 p-4">
      <Text className="text-red-700 font-bold text-lg">Something went wrong</Text>
      <Text className="text-red-600 text-sm mt-2 text-center">{error?.message}</Text>
      <Pressable onPress={resetError} className="mt-4 bg-red-600 px-4 py-2 rounded">
        <Text className="text-white font-semibold">Try Again</Text>
      </Pressable>
    </View>
  );
}

interface Props {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Uncaught error:', error, info);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      const Fallback = this.props.FallbackComponent ?? ErrorFallback;
      return <Fallback error={this.state.error} resetError={this.reset} />;
    }

    return this.props.children as React.ReactElement;
  }
}
