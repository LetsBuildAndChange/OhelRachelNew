import { db } from "@/lib/Firebase";
import * as Clipboard from "expo-clipboard";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type DonationInfo = {
    zelleInfo: string;
    paypalURL: string;
    venmoInfo: string;
    venmoURL: string;
};

const Colors = {
    surface: "#FFFFFF",
    border: "#E2E8F0",
};

const cardStyle = {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
};

const bodyTextStyle = { fontSize: 16, lineHeight: 20, color: "#0F172A" as const };
const cardBodyStyle = { ...bodyTextStyle, marginTop: -3 };
const cardTitleStyle = { fontSize: 18, fontWeight: "700" as const, color: "#0F172A" as const };
const subsectionStyle = { fontSize: 14, lineHeight: 17, color: "#6B7280" as const, marginBottom: 2 };

const CONFIG = {
    PAYPAL_DONATION_URL: "https://www.paypal.com/donate?hosted_button_id=MHRPD75CUWEQN&Z3JncnB0=",
    VENMO_HANDLE: "Ohel-Rachel", // without @
    VENMO_NOTE: "Donation to Ohel Rachel", // default note
    ZELLE_EMAIL: "ohelrachel@yahoo.com",
};

const openLink = async (url: string) => {
    if (!url) {
    Alert.alert("Missing link", "This link is not configured.");
    return;
  }
    const supported = await Linking.canOpenURL(url);
    if (supported) return Linking.openURL(url);
    Alert.alert("Unable to open link", "Please try again.");
};


const copyToClipboard = async (text: string, label?: string) => {
    if (!text || text === "loading...") {
        Alert.alert("Not ready", "Please wait for donation details to load.");
        return;
    }
    try {
        await Clipboard.setStringAsync(text);
        Alert.alert("Copied", `${label ?? "Text"} copied to clipboard`);
    } catch {
        Alert.alert("Copy failed", "Please copy manually.");
    }
};

const shareText = async (message: string) => {
    try {
        await Share.share({ message });
    } catch (e) {
        // no-op
    }
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode; subsection: string }> = ({ title, children, subsection }) => (
    <View style={cardStyle}>
        <Text style={cardTitleStyle}>{title}</Text>
        <Text style={subsectionStyle}>{subsection}</Text>
        {children}
    </View>
);

const ActionButton: React.FC<{ label: string; onPress: () => void }>= ({ label, onPress }) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="bg-[#B59410] rounded-xl items-center justify-center py-3 px-4 mb-2 active:opacity-90"
        android_ripple={{ color: "#283a99" }}
    >
        <Text className="text-white font-bold text-sm">{label}</Text>
    </Pressable>
);
const SmallActionButton: React.FC<{ label: string; onPress: () => void }>= ({ label, onPress }) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="bg-[#B59410] rounded-lg items-center justify-center py-2 px-3 mb-2 active:opacity-90"
        android_ripple={{ color: "#283a99" }}
    >
        <Text className="text-white font-bold text-xs">{label}</Text>
    </Pressable>
);

const InlineCopyRow: React.FC<{ label: string; value: string }>= ({ label, value }) => (
    <View className="flex-row items-center justify-between bg-[#0e1630] border border-[#1f2b55] rounded-xl py-2.5 px-3 mb-2 gap-3">
        <Text className="text-[#9fb2ff] font-semibold text-sm">{label}</Text>
        <TouchableOpacity
            onPress={() => copyToClipboard(value, label)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Copy ${label}: ${value}`}
            accessibilityHint="Double tap to copy to clipboard"
        >
            <Text numberOfLines={1} className="text-[#9fb2ff] text-sm font-bold">{value}</Text>
        </TouchableOpacity>
    </View>
);


const DonationScreen: React.FC = () => {
    const [donations, setDonations] = useState<DonationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   
    const venmoWeb = `https://venmo.com/u/${CONFIG.VENMO_HANDLE}`;

    useEffect(() => {
        setLoading(true);
        const docref = doc(db, "DonationInfo", "info");
        const unsubscribe = onSnapshot(docref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as DonationInfo;
                setDonations(data);
            } else {
                setError("Donation information not found.");
            }
            setLoading(false); 
        },
        (err) => {
            console.error("Error fetching donation info:", err);
            setError("Failed to load donation information. Please try again later.");
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    //  useEffect(() => {
    //     if (error) {
    //         Alert.alert("Error", error, [{ text: "OK", onPress: () => setError(null) }]);
    //     }
         // TO READ MANY documents from a collection 
    //     const list = onSnapshot(docref, (onSnapshot) => {
    //             const items = onSnapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data()
    //             }));
    //             setDonations(items); // DONATIONS IS AN ARRAY OF DOCUMENTS
    //             setLoading(false);
    //         },
    //         () => setLoading(false)
    //     );
    //     return list;
    // }, []);

     if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50" edges={["top", "left", "right"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B59410" />
          <Text className="mt-2 text-gray-600">Loading Donation Info...</Text>
        </View>
      </SafeAreaView>
    );
  }

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top", "left", "right"]}>
        <ScrollView className="px-5" contentContainerClassName="pb-8">
            <Text className="text-[#0F172A] font-extrabold text-[28px] mt-4 mb-1">Support Our Community</Text>
            <Text className="text-[#0F172A] text-base leading-6 mb-4">Thank you for helping us sustain programs, services, and Torah learning.</Text>

            {/* Zelle */}
            <SectionCard title="Zelle (Preferred)" subsection={"Direct bank transfer"}>
                <Text style={cardBodyStyle} className="mb-3">Zelle transfers go directly to our account (No Platform Fees). In your banking app, choose Zelle and send to the details below. Click on the email address to copy it.</Text>
                <InlineCopyRow label="Email" value={donations?.zelleInfo ?? "loading..."} />
                <Text className="text-[#0F172A] text-xs mt-1">Note: Please add a memo (e.g., General Fund, Aliyah, or In honor/memory of...).</Text>
            </SectionCard>

            {/* Venmo */}
            <SectionCard title="Venmo" subsection={"Quick mobile payment"}>
                <Text style={cardBodyStyle} className="mb-3">Send a donation quickly through Venmo. Click on the username to copy it.</Text>
                <InlineCopyRow 
                label="Venmo"
                value={`@${donations?.venmoInfo ?? "loading..."}`} 
                />
                <View className="gap-2 mt-1">
                    <ActionButton label="Open Venmo Profile Page" onPress={() => donations?.venmoURL && openLink(donations.venmoURL)} />
                </View>
                <View className="flex-row gap-2 mt-1">
                    <SmallActionButton label="Share Link"
                     onPress={() => 
                     shareText(`Donate here: ${donations?.venmoURL}`)} 
                     />
                </View>
            
            </SectionCard>

            {/* Credit Card via PayPal */}
            <SectionCard title="Credit/Debit Card" subsection="Secure Payment Processing">
                <Text style={cardBodyStyle} className="mb-3">Use our secure PayPal page to donate with any major credit or debit card. {"\n"}Note: You do not need a PayPal account.</Text>
                <ActionButton 
                label="Open PayPal Donate Page" 
                onPress={() => donations?.paypalURL && openLink(donations.paypalURL)}
                />
                <View className="flex-row gap-2 mt-1">
                    <SmallActionButton label="Share Link"
                     onPress={() => 
                     shareText(`Donate here: ${donations?.paypalURL}`)} 
                     />
                </View>
            
            </SectionCard>

            {/* Tax / receipt info */}
            <View style={[cardStyle, { marginTop: 8 }]}>
                <Text className="text-[#0F172A] text-sm font-bold mb-1.5">Receipt Information</Text>
                <Text className="text-[#0F172A] text-xs leading-5">
                    Ohel Rachel Synagogue is a 501(c)(3) nonprofit. If you need a receipt, please email {CONFIG.ZELLE_EMAIL} with your name, amount, date, and payment method.
                </Text>
            </View>

            <Text className="text-[#0F172A] text-center mt-4 mb-2">Thank you for your generosity!</Text>
        </ScrollView>
        </SafeAreaView>
    );
};

export default DonationScreen;
