// MinyanTimes.js
import React, { useEffect, useState } from "react";
import { Platform, SectionList, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./Firebase";
// Firebase v9 modular SDK
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

export default function MinyanTimes() {
    const [scheduleId, setScheduleId] = useState("default");
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1) listen to settings/app.currentScheduleId
    useEffect(() => {
        const settingsRef = doc(db, "settings", "app");
        const unsub = onSnapshot(
            settingsRef,
            (snap) => {
                const id = snap.data()?.currentScheduleId || "default";
                setScheduleId(id);
            },
            (err) => console.error("[settings listener]", err)
        );
        return unsub;
    }, []);

    // 2) when scheduleId changes, listen to its sections and items
    useEffect(() => {
        setLoading(true);

        const sectionsRef = collection(
            db,
            "settings",
            "app",
            "schedules",
            scheduleId,
            "sections"
        );
        const qSections = query(sectionsRef, orderBy("index", "asc"));

        let cleanupItems = () => {};

        const unsubSections = onSnapshot(
            qSections,
            (secSnap) => {
                const base = secSnap.docs.map((d) => {
                    const data = d.data() || {};
                    return {
                        id: d.id,
                        title: data.title || "",
                        index: typeof data.index === "number" ? data.index : 0,
                        data: [],
                    };
                });

                // show headers immediately (empty data arrays for a moment)
                // @ts-ignore
                setSections(base);

                // set up item listeners for each section
                /**
                 * @type {import("@firebase/firestore").Unsubscribe[]}
                 */
                const localUnsubs = [];
                base.forEach((section) => {
                    const itemsRef = collection(
                        db,
                        "settings",
                        "app",
                        "schedules",
                        scheduleId,
                        "sections",
                        section.id,
                        "items"
                    );
                    const qItems = query(itemsRef, orderBy("index", "asc"));
                    const u = onSnapshot(
                        qItems,
                        (itemSnap) => {
                            const items = itemSnap.docs.map((it) => ({
                                id: it.id,
                                ...(it.data() || {}),
                            }));

                            // merge items into the correct section by id
                            // @ts-ignore
                            setSections((prev) => {
                                const copy = prev.map((s) =>
                                    // @ts-ignore
                                    s.id === section.id ? { ...s, data: items } : s
                                );
                                return copy;
                            });

                            setLoading(false);
                        },
                        (err) => {
                            console.error("[items listener]", err);
                            setLoading(false);
                        }
                    );
                    localUnsubs.push(u);
                });

                cleanupItems = () => localUnsubs.forEach((u) => u());
            },
            (err) => {
                console.error("[sections listener]", err);
                setLoading(false);
            }
        );

        // cleanup when schedule changes or component unmounts
        return () => {
            unsubSections();
            cleanupItems();
        };
    }, [scheduleId]);

    const cardShadow =
        Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
            }
            : { elevation: 3 };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <View className="mx-4 rounded-full overflow-hidden" style={cardShadow}>
            <LinearGradient
                colors={["#E8D4C0", "#F0E5D8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View className="flex-row items-center justify-between p-4">
                    <Text className="text-base font-semibold text-neutral-800">
                        {item.PrayerName}
                    </Text>
                    <Text className="text-base text-neutral-800">{item.Time}</Text>
                </View>
            </LinearGradient>
        </View>
    );

    if (loading) return <Text>Loading…</Text>;

    return (
        <SectionList
            className="bg-neutral-50"
            sections={sections}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
                <Text className="text-center font-semibold text-neutral-800 mt-5 mb-4">
                    {section.
// @ts-ignore
                    title}
                </Text>
            )}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerClassName="py-8 pb-16"
            stickySectionHeadersEnabled={false}
        />
    );
}
