import React, {PropsWithChildren, useEffect, useState} from "react";
import { ScrollView, View, Image, StatusBar, FlatList, Text, Pressable} from "react-native";
import {images} from "@/constants/images";
import { SafeAreaView } from 'react-native-safe-area-context';
import {db} from "@/lib/Firebase";
import {collection, onSnapshot} from "firebase/firestore";

const Colors = {
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

function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                marginTop: 12,
                backgroundColor: Colors.gold,
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

/** Reusable bits */

function CardTitle({ children }: PropsWithChildren) {
    return (
        <Text style={{ fontSize: 18, fontWeight: "700", color: Colors.text, marginBottom: 8 }}>
            {children}
        </Text>
    );
}

function Card({ children }: PropsWithChildren) {
    return (
        <View
            style={{
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
            }}
        >
            {children}
        </View>
    );
}

const renderItem = ({item}: any) => {
    return(
        <View style={{ gap: 6 }}>
            <Text className = {"mb-2 text-[#0F172A]"} style={{ fontSize: 16, color: Colors.text, gap:3 }}>{item.info}</Text>
        </View>

    );
}

 function HomeScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const q = collection(db, "Events");
        const list = onSnapshot(q, (onSnapshot) => {
                const items = onSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(items);
                setLoading(false);
            },
            () => setLoading(false)
        );
        return list;
    }, []);

     if (loading) return <Text>Loading…</Text>;

    // @ts-ignore
    return (

        <SafeAreaView style={{flex: 1, backgroundColor: Colors.bg}}>
            <StatusBar barStyle="dark-content"/>
            <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 32}}>
                {/* Hero */}
                <View style={{alignItems: "center", marginBottom: 20}}>
                    <Image
                        source={images.newlogo}
                        style={{width: 150, height: 150, marginBottom: 8, resizeMode: "contain"}}
                    />
                    <Text style={{fontSize: 28, fontWeight: "700", color: Colors.text}}>
                        Ohel Rachel
                    </Text>
                    <Text style={{fontSize: 16, color: Colors.muted, marginTop: 6, textAlign: "center"}}>
                        Welcome — explore events, minyan times, and ways to contribute.
                    </Text>
                </View>

                {/* Info card */}
                <Card>
                    <CardTitle>Welcome</CardTitle>
                    <Text style={{fontSize: 16, lineHeight: 18, color: Colors.text, gap:3}}>
                        We’re delighted to have you here. Discover our events and learning,
                        and see how to support the community.
                    </Text>
                </Card>

                <Card>
                    <CardTitle>Upcoming Events/Classes</CardTitle>
                {/*<FlatList*/}
                {/*    ListHeaderComponent = {*/}
                {/*        <CardTitle>Upcoming Events/Classes</CardTitle>*/}
                {/*    }*/}
                {/*    data = {events}*/}
                {/*    keyExtractor = {(item: { id: any; }) => item.id.toString()}*/}
                {/*    renderItem = {renderItem}*/}
                {/*/>*/}
                    {
                        events.map((item) => <View key={item.id} style={{gap: 6}}>
                        <Text className = {"mb-2 text-[#0F172A]"} style={{ fontSize: 16, color: Colors.text, gap:3 }}>{item.info}</Text>
                        </View>)
                    }
                </Card>
                {/* Upcoming card */}
            </ScrollView>
        </SafeAreaView>
    );
}


export default HomeScreen;