import React from "react";
import { Linking, Platform, Share, Text, TouchableOpacity, View, ScrollView, Alert, Pressable } from "react-native";
// If you're using Expo, uncomment this and `expo install expo-clipboard`
// import * as Clipboard from "expo-clipboard";
// If you're using bare RN, install: `@react-native-clipboard/clipboard`
// import Clipboard from '@react-native-clipboard/clipboard';

/**
 * —— Quick setup ——
 * 1) Fill in the config below with your real info.
 * 2) Optionally add QR images to your project and show them in the UI.
 * 3) Wire this screen into your navigator (e.g., React Navigation) as "Donate".
 *
 * —— NativeWind ——
 * This screen is styled using NativeWind (Tailwind for RN). Make sure you have:
 * - `nativewind` installed and configured (babel plugin + tailwind config for RN)
 * - `className` props enabled (NativeWind handles it automatically)
 */
const CONFIG = {
    PAYPAL_DONATION_URL: "https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID",
    VENMO_HANDLE: "YourVenmoHandle", // without @
    VENMO_NOTE: "Donation to Ohel Rachel", // default note
    ZELLE_NAME: "Ohel Rachel Synagogue",
    ZELLE_EMAIL: "donations@yourexample.org",
    ZELLE_PHONE: "+1 (555) 123-4567",
};

async function openLink(url: string) {
    const supported = await Linking.canOpenURL(url);
    if (supported) return Linking.openURL(url);
    Alert.alert("Unable to open link", "Please try again.");
}

async function copyToClipboard(text: string, label?: string) {
    try {
        // Expo version:
        // await Clipboard.setStringAsync(text);

        // Bare RN version:
        // Clipboard.setString(text);

        Alert.alert("Copied", `${label ?? "Text"} copied to clipboard`);
    } catch (e) {
        Alert.alert("Copy failed", "Please copy manually.");
    }
}

async function shareText(message: string) {
    try {
        await Share.share({ message });
    } catch (e) {
        // no-op
    }
}

// ---- Typed props (no React.FC) ----
type SectionCardProps = { title: string; children: React.ReactNode };
function SectionCard({ title, children }: SectionCardProps) {
    return (
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-md">
            <Text className="text-gray-900 text-base font-bold mb-2">{title}</Text>
            {children}
        </View>
    );
}

type ActionButtonProps = { label: string; onPress: () => void };
function ActionButton({ label, onPress }: ActionButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-blue-600 rounded-xl items-center justify-center py-3 px-4 mb-2 active:opacity-90"
            android_ripple={{ color: "#d0d7ff" }}
        >
            <Text className="text-white font-bold text-sm">{label}</Text>
        </Pressable>
    );
}

type InlineCopyRowProps = { label: string; value: string };
function InlineCopyRow({ label, value }: InlineCopyRowProps) {
    return (
        <View className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3 mb-2 gap-3">
            <Text className="text-gray-600 font-semibold text-sm">{label}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(value, label)} className="max-w-[70%]">
                <Text numberOfLines={1} className="text-gray-900 text-sm font-bold">{value}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function DonationScreen() {
    const paypalWeb = CONFIG.PAYPAL_DONATION_URL;
    const venmoDeep = Platform.select<string | undefined>({
        ios: `venmo://pay?recipients=${CONFIG.VENMO_HANDLE}&note=${encodeURIComponent(CONFIG.VENMO_NOTE)}`,
        android: `venmo://paycharge?txn=pay&recipients=${CONFIG.VENMO_HANDLE}&note=${encodeURIComponent(CONFIG.VENMO_NOTE)}`,
        default: undefined,
    });
    const venmoWeb = `https://venmo.com/u/${CONFIG.VENMO_HANDLE}`;

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="bg-gray-50 px-5">
            <Text className="text-gray-900 font-extrabold text-[28px] mt-9 mb-1">Support Our Community</Text>
            <Text className="text-gray-600 text-base leading-6 mb-4">Thank you for helping us sustain programs, services, and Torah learning.</Text>

            {/* Credit Card via PayPal */}
            <SectionCard title="Credit/Debit Card (via PayPal)">
                <Text className="text-gray-700 text-[15px] leading-5 mb-3">Use our secure PayPal page to donate with any major credit or debit card. You do not need a PayPal account.</Text>
                <ActionButton label="Open PayPal Donate" onPress={() => openLink(paypalWeb)} />
                <View className="flex-row gap-2 mt-1">
                    <ActionButton label="Share Link" onPress={() => shareText(`Donate here: ${paypalWeb}`)} />
                </View>
            </SectionCard>

            {/* Venmo */}
            <SectionCard title="Venmo">
                <Text className="text-gray-700 text-[15px] leading-5 mb-3">Send a donation quickly through Venmo. Please include a note like Donation or your intended fund.</Text>
                <InlineCopyRow label="Venmo" value={`@${CONFIG.VENMO_HANDLE}`} />
                <View className="gap-2 mt-1">
                    {!!venmoDeep && <ActionButton label="Open in Venmo App" onPress={() => openLink(venmoDeep)} />}
                    <ActionButton label="Open Venmo Profile (Web)" onPress={() => openLink(venmoWeb)} />
                </View>
                {/* Optional: QR image */}
                {/* <Image source={require('../assets/venmo-qr.png')} className="w-full h-44 mt-2 rounded-xl" resizeMode="contain" /> */}
            </SectionCard>

            {/* Zelle */}
            <SectionCard title="Zelle">
                <Text className="text-gray-700 text-[15px] leading-5 mb-3">Zelle transfers go directly to our account (no platform fees). In your banking app, choose Zelle and send to the details below.</Text>
                <InlineCopyRow label="Account Name" value={CONFIG.ZELLE_NAME} />
                <InlineCopyRow label="Email" value={CONFIG.ZELLE_EMAIL} />
                <InlineCopyRow label="Phone" value={CONFIG.ZELLE_PHONE} />
                <Text className="text-gray-600 text-xs mt-1">Note: Please add a memo (e.g., General Fund, Aliyah, or In honor/memory of...).</Text>
                {/* Optional: QR image */}
                {/* <Image source={require('../assets/zelle-qr.png')} className="w-full h-44 mt-2 rounded-xl" resizeMode="contain" /> */}
            </SectionCard>

            {/* Tax / receipt info */}
            <View className="mt-2 bg-white border border-gray-200 rounded-xl p-3.5">
                <Text className="text-gray-900 text-sm font-bold mb-1.5">Tax & Receipt Information</Text>
                <Text className="text-gray-600 text-xs leading-5">
                    Ohel Rachel Synagogue is a 501(c)(3) nonprofit. Donations may be tax-deductible in the United States. If you need a receipt, please email {CONFIG.ZELLE_EMAIL} with your name, amount, date, and payment method.
                </Text>
            </View>

            <Text className="text-blue-600 text-center mt-4 font-semibold">Thank you for your generosity!</Text>
        </ScrollView>
    );
}
