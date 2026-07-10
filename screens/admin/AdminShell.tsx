import { auth } from "@/lib/Firebase";
import { signOut } from "firebase/auth";
import React, { PropsWithChildren } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./components/Button";
import { Colors } from "./components/colors";

type AdminShellProps = PropsWithChildren<{
  title: string;
  email: string;
  onBack?: () => void;
}>;

export function AdminShell({ title, email, onBack, children }: AdminShellProps) {
  return (
    <SafeAreaView style={{ backgroundColor: Colors.bg, flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ gap: 16, padding: 20, paddingBottom: 48 }}>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            {onBack ? (
              <Button label="Back" icon="arrow-back-outline" onPress={onBack} variant="secondary" />
            ) : null}
            <Text style={{ color: Colors.text, fontSize: 28, fontWeight: "800", marginTop: onBack ? 12 : 0 }}>
              {title}
            </Text>
            <Text style={{ color: Colors.muted, fontSize: 14, marginTop: 4 }}>{email}</Text>
          </View>
          <Button label="Sign Out" icon="log-out-outline" onPress={() => signOut(auth)} variant="secondary" />
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
