// import {ScrollView, Text, View, Image} from "react-native";
// import React from "react";
//
// export default function IndexContent() {
//     return (
//      <View className={"flex-1 bg-primary"}>
//       <ScrollView>
//       <Text className={"text-3xl font-bold mt-20 mb-3 text-center w-full color-dark-200"}>
//           Welcome to Ohel Rachel!</Text>
//           <Image
//               source={images.newlogo}
//               style={{
//                   width: 132, // equivalent to w-48
//                   height: 102, // equivalent to h-40
//                   marginTop: 15, // equivalent to mt-20
//                   marginBottom: 20, // equivalent to mb-5
//                   marginLeft: 'auto',
//                   marginRight: 'auto',
//               }}
//               resizeMode="contain"
//               fadeDuration={0}
//               progressiveRenderingEnabled={true}
//           />
//           <View className={"items-center justify-between mb-4 p-4 rounded-xl bg-fourth"}>
//               {/*<Text className="text-2xl font-bold text-center">*/}
//               {/*    About Us*/}
//               {/*</Text>*/}
//           <Text className="text-lg text-center">
//               Welcome! We are delighted to have you here! Explore our events, lectures, and ways to
//               contribute to our thriving community.
//           </Text>
//           </View>
//           <View className={"flex-row items-center justify-between mb-4 p-4 rounded-xl bg-fourth"}>
//           <Text className="text-lg text-left">
//               Upcoming Events: {"\n"}
//               Join us for Kiddush after Shacharit 9:00 am Minyan! {"\n"}
//               Stay tuned for the new building updates!
//           </Text>
//           </View>
//
//       </ScrollView>
//     </View>
//   );
// }
import React, {PropsWithChildren} from "react";
import { SafeAreaView, ScrollView, View, Image, StatusBar } from "react-native";
import { Text, Pressable } from "react-native";
import {images} from "@/constants/images";

const BRAND = {
    gold: "#D4AF37",     // <- your gold
    bg: "#F8FAFC",       // soft light background
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#475569",
    border: "#E2E8F0",
};

type PrimaryButtonProps = {
    label: string;
    onPress: () => void;
}

export default function HomeScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BRAND.bg }}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
                {/* Hero */}
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <Image
                        source={images.newlogo}
                        style={{ width: 150, height: 150, marginBottom: 8, resizeMode: "contain" }}
                    />
                    <Text style={{ fontSize: 28, fontWeight: "700", color: BRAND.text }}>
                        Ohel Rachel
                    </Text>
                    <Text style={{ fontSize: 16, color: BRAND.muted, marginTop: 6, textAlign: "center" }}>
                        Welcome — explore events, minyan times, and ways to contribute.
                    </Text>
                </View>

                {/* Info card */}
                <Card>
                    <CardTitle>Welcome</CardTitle>
                    <Text style={{ fontSize: 16, lineHeight: 22, color: BRAND.text }}>
                        We’re delighted to have you here. Discover our events and learning,
                        and see how to support the community.
                    </Text>
                </Card>

                {/* Upcoming card */}
                <Card>
                    <CardTitle>Upcoming</CardTitle>
                    <View style={{ gap: 6 }}>
                        <Text style={{ fontSize: 16, color: BRAND.text }}>Kiddush after Shacharit — 9:00 AM</Text>
                        <Text style={{ fontSize: 16, color: BRAND.text }}>New building updates coming soon</Text>
                    </View>
                    <PrimaryButton
                        label="View all events"
                        onPress={() => {}}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

/** Reusable bits */
function Card({ children }: PropsWithChildren) {
    return (
        <View
            style={{
                backgroundColor: BRAND.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: BRAND.border,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
            }}
        >
            {children}
        </View>
    );
}

function CardTitle({ children }: PropsWithChildren) {
    return (
        <Text style={{ fontSize: 18, fontWeight: "700", color: BRAND.text, marginBottom: 8 }}>
            {children}
        </Text>
    );
}

function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                marginTop: 12,
                backgroundColor: BRAND.gold,
                opacity: pressed ? 0.9 : 1,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
            })}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <Text style={{ color: "#1F2937", fontWeight: "700", fontSize: 16 }}>
                {label}
            </Text>
        </Pressable>
    );
}
