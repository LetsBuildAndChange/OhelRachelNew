// MinyanTimes.js
import { db } from "@/lib/Firebase";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Firebase v9 modular SDK
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";

const TOP_INSET_TRIM = 10; // nudge content up slightly while staying clear of notch/island
const ROW_GAP = 12; // gap-3

// @ts-ignore
function MinyanTimeRow({ prayerName, time }) {
    const [isStacked, setIsStacked] = useState(false);
    const [rowWidth, setRowWidth] = useState(0);
    const nameWidth = useRef(0);
    const timeWidth = useRef(0);

    const updateLayout = useCallback(() => {
        if (rowWidth > 0 && nameWidth.current > 0 && timeWidth.current > 0) {
            setIsStacked(nameWidth.current + timeWidth.current + ROW_GAP > rowWidth);
        }
    }, [rowWidth]);

    useEffect(() => {
        nameWidth.current = 0;
        timeWidth.current = 0;
        visibleNameWidth.current = 0;
        visibleTimeWidth.current = 0;
        setIsStacked(false);
    }, [prayerName, time]);

    useEffect(() => {
        updateLayout();
    }, [updateLayout]);

    const onNameMeasure = useCallback(
        // @ts-ignore
        (e) => {
            nameWidth.current = e.nativeEvent.lines.reduce(
                // @ts-ignore
                (max, line) => Math.max(max, line.width),
                0
            );
            updateLayout();
        },
        [updateLayout]
    );

    const onTimeMeasure = useCallback(
        // @ts-ignore
        (e) => {
            timeWidth.current = e.nativeEvent.lines.reduce(
                // @ts-ignore
                (max, line) => Math.max(max, line.width),
                0
            );
            updateLayout();
        },
        [updateLayout]
    );

    const visibleNameWidth = useRef(0);
    const visibleTimeWidth = useRef(0);

    const checkVisibleOverflow = useCallback(() => {
        if (isStacked || rowWidth <= 0) return;
        if (visibleNameWidth.current > 0 && visibleTimeWidth.current > 0) {
            if (visibleNameWidth.current + visibleTimeWidth.current + ROW_GAP > rowWidth) {
                setIsStacked(true);
            }
        }
    }, [isStacked, rowWidth]);

    const onVisibleNameLayout = useCallback(
        // @ts-ignore
        (e) => {
            visibleNameWidth.current = e.nativeEvent.layout.width;
            checkVisibleOverflow();
        },
        [checkVisibleOverflow]
    );

    const onVisibleTimeLayout = useCallback(
        // @ts-ignore
        (e) => {
            visibleTimeWidth.current = e.nativeEvent.layout.width;
            checkVisibleOverflow();
        },
        [checkVisibleOverflow]
    );

    return (
        <View className="p-4">
            <View
                pointerEvents="none"
                style={{ position: "absolute", opacity: 0, top: 0, left: -9999 }}
            >
                <Text
                    className="text-base font-semibold text-neutral-800"
                    onTextLayout={onNameMeasure}
                    allowFontScaling
                >
                    {prayerName}
                </Text>
                <Text
                    className="text-base text-neutral-800"
                    onTextLayout={onTimeMeasure}
                    allowFontScaling
                >
                    {time}
                </Text>
            </View>

            <View onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
            {isStacked ? (
                <View className="flex-row items-start gap-3">
                    <Text
                        className="min-w-0 flex-1 text-base font-semibold text-neutral-800"
                        allowFontScaling
                    >
                        {prayerName}
                    </Text>
                    <Text
                        className="min-w-0 flex-1 text-right text-base text-neutral-800"
                        allowFontScaling
                    >
                        {time}
                    </Text>
                </View>
            ) : (
                <View className="flex-row items-center justify-between gap-3">
                    <Text
                        className="text-base font-semibold text-neutral-800"
                        numberOfLines={1}
                        allowFontScaling
                        onLayout={onVisibleNameLayout}
                    >
                        {prayerName}
                    </Text>
                    <Text
                        className="shrink-0 text-base text-neutral-800"
                        numberOfLines={1}
                        allowFontScaling
                        onLayout={onVisibleTimeLayout}
                    >
                        {time}
                    </Text>
                </View>
            )}
            </View>
        </View>
    );
}

export default function MinyanTimes() {
    const insets = useSafeAreaInsets();
    const topInset =
        insets.top > 44
            ? Math.max(insets.top - TOP_INSET_TRIM, 44)
            : insets.top;

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
            (error) => {
                console.error("[settings listener]", error);
                // Consider handling the error in UI
            }
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
        const qSections = query(sectionsRef, orderBy("index", "asc"), where("isVisible", "==", true));

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
                    const qItems = query(itemsRef, orderBy("index", "asc"), where("isVisible", "==", true));
                    const u = onSnapshot(
                        qItems,
                        (itemSnap) => {
                            const items = itemSnap.docs.map((it) => ({
                                id: it.id,
                                ...(it.data() || {}),
                            }));

                            // merged items into the correct section by id
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
            <View
                accessible={true}
                accessibilityLabel={`Prayer name: ${item.PrayerName} at time: ${item.Time}`}
                accessibilityRole="text"
            >
                <MinyanTimeRow prayerName={item.PrayerName} time={item.Time} />
            </View>
                
            </LinearGradient>
        </View>
    );

    if (loading) {
    return (
      <View className="flex-1 bg-neutral-50" style={{ paddingTop: topInset }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B59410" />
          <Text className="mt-2 text-gray-600">Loading Minyan Times...</Text>
        </View>
      </View>
    );
  }

    return (
        <View className="flex-1 bg-neutral-50" style={{ paddingTop: topInset }}>
        <SectionList
            className="bg-neutral-50"
            sections={sections}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
                <Text className="text-center text-xl font-semibold text-neutral-800 mt-2 mb-4">
                    {section.
                        // @ts-ignore
                    title}
                </Text>
            )}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerClassName="pt-2 pb-16"
            stickySectionHeadersEnabled={false}
        />
        </View>
    );
}