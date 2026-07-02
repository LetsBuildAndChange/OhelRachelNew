import { db } from "@/lib/Firebase";
import { Ionicons } from "@expo/vector-icons";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    ImageSourcePropType,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
    gold: "#D4AF37",     //  gold
    bg: "#F8FAFC",       // soft light background
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#475569",
    border: "#E2E8F0",
};

type ClassItem = {
    id: string;
    title: string;
    time?: string;
    teacher?: string;
    topic?: string;
    index: number;
    isVisible: boolean;
};

type EventItem = {
    id: string;
    title: string;
    date?: string;
    time?: string;
    description?: string;
    imageUrl?: string;
    eventUrl?: string;
    urlTitle?: string;
    urlDescription?: string;
    index: number;
    isVisible: boolean;
};

const LOCAL_EVENT_IMAGES: Record<string, ImageSourcePropType> = {
    "BuildingFundraiserFlyer.png": require("@/assets/images/BuildingFundraiserFlyer.png"),
};

function getEventImageSource(imageUrl: string): ImageSourcePropType | null {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return { uri: imageUrl };
    }
    const filename = imageUrl.split("/").pop() || imageUrl;
    return LOCAL_EVENT_IMAGES[imageUrl] ?? LOCAL_EVENT_IMAGES[filename] ?? null;
}

function normalizeEventUrl(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
}

async function openEventUrl(url: string) {
    const normalized = normalizeEventUrl(url);
    try {
        await Linking.openURL(normalized);
    } catch {
        Alert.alert("Unable to open link", "Please try again.");
    }
}


type PrimaryButtonProps = {
    label: string;
    onPress: () => void;
}

function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            {({ pressed }) => (
                <Animated.View
                    style={{
                        marginTop: 10,
                        transform: [{ scale }],
                        backgroundColor: pressed ? "#B8961E" : Colors.gold,
                        borderRadius: 10,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        shadowColor: Colors.gold,
                        shadowOpacity: 0.35,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 3,
                        borderWidth: 1,
                        borderColor: "#C49B20",
                        alignSelf: "flex-start",
                    }}
                >
                    <Ionicons name="link-outline" size={14} color="#1F2937" />
                    <Text style={{ color: "#1F2937", fontWeight: "700", fontSize: 13, letterSpacing: 0.2 }}>
                        {label}
                    </Text>
                    <Ionicons name="open-outline" size={12} color="#1F2937" style={{ opacity: 0.7 }} />
                </Animated.View>
            )}
        </Pressable>
    );
}

/** Reusable bits */

function CardTitle({ children, showDivider = true }: PropsWithChildren<{ showDivider?: boolean }>) {
    return (
        <Text style={{
            fontSize: 20,
            fontWeight: "700",
            color: Colors.text,
            paddingBottom: showDivider ? 10 : 0,
            marginBottom: showDivider ? 10 : 8,
            borderBottomWidth: showDivider ? 1 : 0,
            borderBottomColor: Colors.border,
        }}>
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

function getRowDividerStyle(isLast: boolean) {
    return {
        marginBottom: isLast ? 0 : 12,
        paddingBottom: isLast ? 0 : 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: Colors.border,
    };
}

type ClassRowProps = {
    classItem: ClassItem;
    isLast: boolean;
};

function ClassRow({ classItem, isLast }: ClassRowProps) {
    const timeTeacher = [classItem.time, classItem.teacher].filter(Boolean).join(" • ");
    const topic = classItem.topic?.trim();

    return (
        <View style={getRowDividerStyle(isLast)}>
            <Text style={{ fontSize: 18.5, fontWeight: "700", color: Colors.text, marginBottom: 4 }}>
                {classItem.title}
            </Text>
            {timeTeacher ? (
                <Text style={{ fontSize: 16, color: Colors.muted, marginBottom: topic ? 4 : 0 }}>
                    {timeTeacher}
                </Text>
            ) : null}
            {topic ? (
                <Text style={{ fontSize: 17, color: Colors.text, lineHeight: 22 }}>
                    {topic}
                </Text>
            ) : null}
        </View>
    );
}

type EventRowProps = {
    event: EventItem;
    isLast: boolean;
    onImagePress: (source: ImageSourcePropType) => void;
};

function EventRow({ event, isLast, onImagePress }: EventRowProps) {
    const dateTime = [event.date, event.time].filter(Boolean).join(" • ");
    const imageSource = event.imageUrl ? getEventImageSource(event.imageUrl) : null;

    return (
        <View style={getRowDividerStyle(isLast)}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: Colors.text, marginBottom: 4 }}>
                {event.title}
            </Text>
            {dateTime ? (
                <Text style={{ fontSize: 16, color: Colors.muted, marginBottom: event.description ? 4 : 0 }}>
                    {dateTime}
                </Text>
            ) : null}
            {event.description ? (
                <Text style={{ fontSize: 17, color: Colors.text, lineHeight: 22 }}>
                    {event.description}
                </Text>
            ) : null}
            {imageSource ? (
                <View style={{ marginTop: 12 }}>
                    <Pressable
                        onPress={() => onImagePress(imageSource)}
                        accessibilityRole="button"
                        accessibilityLabel={`Enlarge flyer for ${event.title}`}
                    >
                        <Image
                            source={imageSource}
                            style={{ width: "100%", height: 180, borderRadius: 8 }}
                            resizeMode="contain"
                        />
                    </Pressable>
                    <Text style={{ fontSize: 14, color: Colors.muted, marginTop: 6 }}>
                        Tap flyer to enlarge
                    </Text>
                </View>
            ) : null}
            {event.eventUrl ? (
                <>
                    {event.urlDescription ? (
                        <Text style={{ fontSize: 15, color: Colors.text, marginTop: 11 }}>
                            {event.urlDescription}
                        </Text>
                    ) : null}
                    <PrimaryButton
                        label={event.urlTitle ?? "Click here for RSVP Link"}
                        onPress={() => openEventUrl(event.eventUrl!)}
                    />
                </>
            ) : null}
        </View>
    );
}

 function HomeScreen() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState<any | null>(null);
    const [loadingContactInfo, setLoadingContactInfo] = useState(true);
    const [errorContactInfo, setErrorContactInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [communityUpdates, setCommunityUpdates] = useState<any[]>([]);
    const [loadingCommunityUpdates, setLoadingCommunityUpdates] = useState(true);
    const [errorCommunityUpdates, setErrorCommunityUpdates] = useState<string | null>(null);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<ImageSourcePropType | null>(null);
    // WEEKLY CLASSES COLLECTION LISTENER
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, "Classes"),
            (snapshot) => {
                const items = snapshot.docs
                    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ClassItem))
                    .filter((item) => item.isVisible !== false)
                    .sort((a, b) => Number(a.index) - Number(b.index));
                setClasses(items);
                setLoading(false);
            },
            (err) => {
                console.error("Classes error:", err.message);
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);
    // COMMUNITY UPDATES COLLECTION LISTENER
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, "CommunityUpdates"),
            (snapshot) => {
                const items = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() } as any))
                    .filter((item) => item.isVisible !== false)
                    .sort((a, b) => Number(b.index) - Number(a.index));
                setCommunityUpdates(items);
                setLoadingCommunityUpdates(false);
            },
            (err) => {
                console.error("CommunityUpdates error:", err.message);
                setErrorCommunityUpdates(err.message);
                setLoadingCommunityUpdates(false);
            }
        );
        return unsubscribe;
    }, []);
    // EVENT COLLECTION LISTENER
    useEffect(() => {
        setLoadingEvents(true);
        const unsubscribe = onSnapshot(
            collection(db, "Event"),
            (snapshot) => {
                const items = snapshot.docs
                    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as EventItem))
                    .filter((item) => item.isVisible === true)
                    .sort((a, b) => Number(a.index) - Number(b.index));
                setEvents(items);
                setLoadingEvents(false);
            },
            (err) => {
                console.error("Event error:", err.message);
                setErrorEvents(err.message);
                setLoadingEvents(false);
            }
        );
        return unsubscribe;
    }, []);
    // CONTACT INFO COLLECTION FireBase Listener
    useEffect(() => {
        setLoadingContactInfo(true);
        const unsubscribe = onSnapshot(
            doc(db, "ContactInfo", "info"),
            (snapshot) => {
                if (snapshot.exists()) {
                    setContactInfo(snapshot.data() as any);
                } else {
                    setErrorContactInfo("Contact information not found.");
                }
                setLoadingContactInfo(false);
            },
            (err) => {
                console.error("ContactInfo error:", err.message);
                setErrorContactInfo(err.message);
                setLoadingContactInfo(false);
            }
        );
        return unsubscribe;
    }, []);

     if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#B59410" />
        <Text className="mt-2 text-gray-600">Loading Home Page...</Text>
      </View>
    );
  }

    // @ts-ignore
    return (

        <SafeAreaView style={{flex: 1, backgroundColor: Colors.bg}} edges={["top", "left", "right"]}>
            <StatusBar barStyle="dark-content"/>
            <ScrollView contentContainerStyle={{padding: 20}}>
                {/* Hero */}
                <View style={{alignItems: "center", marginBottom: 20}}>
                    <Image
                        source={require("@/assets/images/NewAppLogo.png")}
                        style={{width: 200, height: 170, marginBottom: 8}}
                        resizeMode="contain"
                    />
                    <Text style={{fontSize: 26, fontWeight: "700", color: Colors.text}}>
                        Ohel Rachel
                    </Text>
                    <Text style={{fontSize: 16, color: Colors.muted, marginTop: 6, textAlign: "center"}}>
                    Explore events, classes, minyan times, community updates, and ways to contribute.
                    </Text>
                </View>

                {/* Welcome card */}
                {/* <Card>
                    <CardTitle>Welcome</CardTitle>
                    <Text style={{fontSize: 17, lineHeight: 20, color: Colors.text, gap:3}}>
                        We’re delighted to have you here. Discover our events, minyanim, and learning,
                        and see how to support the community.
                    </Text>
                </Card> */}

                <View style={styles.cardStyle}>
                    <CardTitle>Weekly Classes</CardTitle>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.gold} />
                    ) : error ? (
                        <Text style={styles.textStyle}>Unable to load classes.</Text>
                    ) : classes.length > 0 ? (
                        classes.map((classItem, index) => (
                            <ClassRow
                                key={classItem.id}
                                classItem={classItem}
                                isLast={index === classes.length - 1}
                            />
                        ))
                    ) : (
                        <Text style={styles.textStyle}>No upcoming classes.</Text>
                    )}
                </View>
            
            <View style={styles.cardStyle}>
                <CardTitle>Upcoming Events</CardTitle>
                {loadingEvents ? (
                    <ActivityIndicator size="small" color={Colors.gold} />
                ) : errorEvents ? (
                    <Text style={styles.textStyle}>Unable to load events.</Text>
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <EventRow
                            key={event.id}
                            event={event}
                            isLast={index === events.length - 1}
                            onImagePress={setExpandedImage}
                        />
                    ))
                ) : (
                    <Text style={styles.textStyle}>No upcoming events yet.</Text>
                )}
            </View>

            <View style={styles.cardStyle}>
                <CardTitle showDivider={true}>Community Updates</CardTitle>
                {communityUpdates.length > 0 ? (
                    communityUpdates.map((item, index) =>
                        <Text
                            key={item.id}
                            style={{
                                fontSize: 17,
                                color: Colors.text,
                                marginBottom: index < communityUpdates.length - 1 ? 12 : 0,
                            }}
                        >
                            {item.info}
                        </Text>
                    )
                ) : (
                    <Text style={styles.textStyle}>No community updates.</Text>
                )}
            </View>

            <View style={styles.cardStyle}>
                <CardTitle showDivider={true}>Contact Us</CardTitle>
                <Text style={styles.textStyle}>
                    {contactInfo?.info}
                </Text>
            </View>
            </ScrollView>

            <Modal
                visible={expandedImage !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setExpandedImage(null)}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center" }}>
                    <Pressable
                        onPress={() => setExpandedImage(null)}
                        style={{
                            position: "absolute",
                            top: 56,
                            right: 20,
                            zIndex: 1,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderRadius: 20,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Close image"
                    >
                        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Close</Text>
                    </Pressable>
                    {expandedImage ? (
                        <Image
                            source={expandedImage}
                            style={{ width: "100%", height: "80%" }}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const styles = {
    cardStyle: { 
        backgroundColor: Colors.surface,
                borderRadius: 16,
                paddingTop: 12,
                paddingHorizontal: 16,
                paddingBottom: 16,
                borderWidth: 1,
                borderColor: Colors.border,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
    },
    textStyle: {
         fontSize: 17, 
         color: Colors.text 
        
    }
};


export default HomeScreen;