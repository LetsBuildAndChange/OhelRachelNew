import { app, db } from "@/lib/Firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);
import { Ionicons } from "@expo/vector-icons";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Colors = {
  bg: "#F8FAFC",
  border: "#E2E8F0",
  danger: "#B91C1C",
  gold: "#B59410",
  muted: "#475569",
  surface: "#FFFFFF",
  text: "#0F172A",
};

type Section = {
  id: string;
  title: string;
  index: number;
  isVisible: boolean;
  items: MinyanItem[];
};

type MinyanItem = {
  id: string;
  PrayerName: string;
  Time: string;
  index: number;
  isVisible: boolean;
};

function Button({
  label,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const backgroundColor =
    variant === "primary" ? Colors.gold : variant === "danger" ? "#FEE2E2" : "#F8FAFC";
  const color = variant === "danger" ? Colors.danger : variant === "primary" ? "#1F2937" : Colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor,
        borderColor: variant === "primary" ? Colors.gold : Colors.border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
      })}
    >
      {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text style={{ color, fontSize: 15, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  saveOnBlur = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  saveOnBlur?: boolean;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const displayedValue = saveOnBlur ? draft : value;
  const changeText = saveOnBlur ? setDraft : onChangeText;
  const commitDraft = () => {
    if (saveOnBlur && draft !== value) {
      onChangeText(draft);
    }
  };

  return (
    <View style={{ flex: 1, gap: 6, minWidth: 130 }}>
      <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: "700" }}>{label}</Text>
      <TextInput
        value={displayedValue}
        onBlur={commitDraft}
        onChangeText={changeText}
        onSubmitEditing={commitDraft}
        placeholder={placeholder}
        autoCapitalize="none"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: Colors.border,
          borderRadius: 8,
          borderWidth: 1,
          color: Colors.text,
          fontSize: 16,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
    </View>
  );
}

export default function AdminScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [scheduleId, setScheduleId] = useState("default");
  const [scheduleDraft, setScheduleDraft] = useState("default");
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      setAdminChecked(false);
      setIsAdmin(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setAdminChecked(true);
      return;
    }

    const adminRef = doc(db, "admins", user.uid);
    return onSnapshot(
      adminRef,
      (snap) => {
        setIsAdmin(snap.exists());
        setAdminChecked(true);
      },
      () => {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    );
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    const settingsRef = doc(db, "settings", "app");
    return onSnapshot(settingsRef, (snap) => {
      const currentScheduleId = snap.data()?.currentScheduleId || "default";
      setScheduleId(currentScheduleId);
      setScheduleDraft(currentScheduleId);
    });
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !scheduleId) return;

    setLoadingSchedule(true);
    const sectionsRef = collection(db, "settings", "app", "schedules", scheduleId, "sections");
    const sectionsQuery = query(sectionsRef, orderBy("index", "asc"));
    let cleanupItems = () => {};

    const unsubscribeSections = onSnapshot(
      sectionsQuery,
      (sectionSnap) => {
        cleanupItems();
        const nextSections = sectionSnap.docs.map((sectionDoc) => {
          const data = sectionDoc.data();
          return {
            id: sectionDoc.id,
            title: String(data.title || ""),
            index: typeof data.index === "number" ? data.index : 0,
            isVisible: data.isVisible !== false,
            items: [],
          };
        });

        setSections(nextSections);

        const itemUnsubs = nextSections.map((section) => {
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

          return onSnapshot(query(itemsRef, orderBy("index", "asc")), (itemSnap) => {
            const items = itemSnap.docs.map((itemDoc) => {
              const data = itemDoc.data();
              return {
                id: itemDoc.id,
                PrayerName: String(data.PrayerName || ""),
                Time: String(data.Time || ""),
                index: typeof data.index === "number" ? data.index : 0,
                isVisible: data.isVisible !== false,
              };
            });

            setSections((current) =>
              current.map((currentSection) =>
                currentSection.id === section.id ? { ...currentSection, items } : currentSection
              )
            );
            setLoadingSchedule(false);
          });
        });

        cleanupItems = () => itemUnsubs.forEach((unsubscribe) => unsubscribe());
        if (nextSections.length === 0) setLoadingSchedule(false);
      },
      () => setLoadingSchedule(false)
    );

    return () => {
      unsubscribeSections();
      cleanupItems();
    };
  }, [isAdmin, scheduleId]);

  const nextSectionIndex = useMemo(
    () => sections.reduce((highest, section) => Math.max(highest, section.index), -1) + 1,
    [sections]
  );

  const signIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing sign in", "Enter the admin email and password.");
      return;
    }

    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch {
      Alert.alert("Sign in failed", "Check the email and password, then try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const updateSection = async (sectionId: string, data: Partial<Section>) => {
    await updateDoc(doc(db, "settings", "app", "schedules", scheduleId, "sections", sectionId), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid || null,
    });
  };

  const updateItem = async (sectionId: string, itemId: string, data: Partial<MinyanItem>) => {
    await updateDoc(
      doc(db, "settings", "app", "schedules", scheduleId, "sections", sectionId, "items", itemId),
      {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || null,
      }
    );
  };

  const addSection = async () => {
    await addDoc(collection(db, "settings", "app", "schedules", scheduleId, "sections"), {
      title: "New Section",
      index: nextSectionIndex,
      isVisible: true,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || null,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid || null,
    });
  };

  const setActiveSchedule = async () => {
    const nextScheduleId = scheduleDraft.trim() || "default";

    await updateDoc(doc(db, "settings", "app"), {
      currentScheduleId: nextScheduleId,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid || null,
    });
  };

  const addItem = async (section: Section) => {
    const nextItemIndex =
      section.items.reduce((highest, item) => Math.max(highest, item.index), -1) + 1;

    await addDoc(
      collection(db, "settings", "app", "schedules", scheduleId, "sections", section.id, "items"),
      {
        PrayerName: "New Prayer",
        Time: "",
        index: nextItemIndex,
        isVisible: true,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || null,
      }
    );
  };

  const removeItem = (sectionId: string, item: MinyanItem) => {
    Alert.alert("Delete time?", `${item.PrayerName || "This time"} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(
            doc(db, "settings", "app", "schedules", scheduleId, "sections", sectionId, "items", item.id)
          );
        },
      },
    ]);
  };

  if (!authReady || !adminChecked) {
    return (
      <View style={{ alignItems: "center", backgroundColor: Colors.bg, flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ backgroundColor: Colors.bg, flex: 1 }} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ gap: 16, padding: 20 }}>
            <Text style={{ color: Colors.text, fontSize: 28, fontWeight: "800" }}>Admin</Text>
            <View
              style={{
                backgroundColor: Colors.surface,
                borderColor: Colors.border,
                borderRadius: 8,
                borderWidth: 1,
                gap: 14,
                padding: 16,
              }}
            >
              <Field label="Email" value={email} onChangeText={setEmail} placeholder="admin@example.com" />
              <View style={{ gap: 6 }}>
                <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: "700" }}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: Colors.border,
                    borderRadius: 8,
                    borderWidth: 1,
                    color: Colors.text,
                    fontSize: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                />
              </View>
              <Button label={signingIn ? "Signing In" : "Sign In"} icon="log-in-outline" onPress={signIn} disabled={signingIn} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={{ backgroundColor: Colors.bg, flex: 1 }} edges={["top", "left", "right"]}>
        <View style={{ gap: 16, padding: 20 }}>
          <Text style={{ color: Colors.text, fontSize: 28, fontWeight: "800" }}>Admin</Text>
          <Text style={{ color: Colors.muted, fontSize: 16 }}>
            This account does not have admin access.
          </Text>
          <Button label="Sign Out" icon="log-out-outline" onPress={() => signOut(auth)} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.bg, flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ gap: 16, padding: 20, paddingBottom: 48 }}>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.text, fontSize: 28, fontWeight: "800" }}>Minyan Admin</Text>
            <Text style={{ color: Colors.muted, fontSize: 14, marginTop: 4 }}>{user.email}</Text>
          </View>
          <Button label="Sign Out" icon="log-out-outline" onPress={() => signOut(auth)} variant="secondary" />
        </View>

        <View
          style={{
            backgroundColor: Colors.surface,
            borderColor: Colors.border,
            borderRadius: 8,
            borderWidth: 1,
            gap: 12,
            padding: 16,
          }}
        >
          <Field
            label="Active Schedule"
            value={scheduleDraft}
            onChangeText={setScheduleDraft}
          />
          <Button label="Set Active" icon="checkmark-circle-outline" onPress={setActiveSchedule} />
          <Button label="Add Section" icon="add-circle-outline" onPress={addSection} variant="secondary" />
        </View>

        {loadingSchedule ? <ActivityIndicator color={Colors.gold} /> : null}

        {sections.map((section) => (
          <View
            key={section.id}
            style={{
              backgroundColor: Colors.surface,
              borderColor: Colors.border,
              borderRadius: 8,
              borderWidth: 1,
              gap: 14,
              padding: 16,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
              <Field
                label="Section"
                value={section.title}
                onChangeText={(value) => updateSection(section.id, { title: value })}
                saveOnBlur
              />
              <View style={{ alignItems: "center", gap: 6 }}>
                <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: "700" }}>Visible</Text>
                <Switch
                  value={section.isVisible}
                  onValueChange={(value) => updateSection(section.id, { isVisible: value })}
                  trackColor={{ false: "#CBD5E1", true: "#E8D4A2" }}
                  thumbColor={section.isVisible ? Colors.gold : "#F8FAFC"}
                />
              </View>
            </View>

            {section.items.map((item) => (
              <View
                key={item.id}
                style={{
                  borderColor: Colors.border,
                  borderRadius: 8,
                  borderWidth: 1,
                  gap: 12,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  <Field
                    label="Prayer"
                    value={item.PrayerName}
                    onChangeText={(value) => updateItem(section.id, item.id, { PrayerName: value })}
                    saveOnBlur
                  />
                  <Field
                    label="Time"
                    value={item.Time}
                    onChangeText={(value) => updateItem(section.id, item.id, { Time: value })}
                    placeholder="7:00 AM"
                    saveOnBlur
                  />
                </View>
                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
                    <Text style={{ color: Colors.muted, fontSize: 14, fontWeight: "700" }}>Visible</Text>
                    <Switch
                      value={item.isVisible}
                      onValueChange={(value) => updateItem(section.id, item.id, { isVisible: value })}
                      trackColor={{ false: "#CBD5E1", true: "#E8D4A2" }}
                      thumbColor={item.isVisible ? Colors.gold : "#F8FAFC"}
                    />
                  </View>
                  <Button
                    label="Delete"
                    icon="trash-outline"
                    onPress={() => removeItem(section.id, item)}
                    variant="danger"
                  />
                </View>
              </View>
            ))}

            <Button label="Add Time" icon="add-outline" onPress={() => addItem(section)} variant="secondary" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
