import { auth, db } from "@/lib/Firebase";
import { Ionicons } from "@expo/vector-icons";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminShell } from "./AdminShell";
import { ClassesEditor } from "./ClassesEditor";
import { CommunityUpdatesEditor } from "./CommunityUpdatesEditor";
import { ContactEditor } from "./ContactEditor";
import { DonationEditor } from "./DonationEditor";
import { EventsEditor } from "./EventsEditor";
import { MinyanEditor } from "./MinyanEditor";
import { Button } from "./components/Button";
import { Colors } from "./components/colors";
import { Field } from "./components/Field";

export type AdminSectionId =
  | "minyan"
  | "events"
  | "classes"
  | "community-updates"
  | "contact"
  | "donation";

type AdminSection = {
  id: AdminSectionId;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "minyan",
    title: "Minyan Times",
    description: "Prayer schedules and sections",
    icon: "time-outline",
  },
  {
    id: "events",
    title: "Events",
    description: "Upcoming events, flyers, and RSVP links",
    icon: "calendar-outline",
  },
  {
    id: "classes",
    title: "Weekly Classes",
    description: "Class titles, times, teachers, and topics",
    icon: "book-outline",
  },
  {
    id: "community-updates",
    title: "Community Updates",
    description: "Short announcements on the home screen",
    icon: "megaphone-outline",
  },
  {
    id: "contact",
    title: "Contact Info",
    description: "Contact Us section text",
    icon: "call-outline",
  },
  {
    id: "donation",
    title: "Donation Info",
    description: "Zelle, PayPal, and Venmo details",
    icon: "heart-outline",
  },
];

const SECTION_TITLES: Record<AdminSectionId, string> = {
  minyan: "Minyan Times",
  events: "Events",
  classes: "Weekly Classes",
  "community-updates": "Community Updates",
  contact: "Contact Info",
  donation: "Donation Info",
};

function SectionPicker({
  onSelect,
}: {
  onSelect: (sectionId: AdminSectionId) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: Colors.muted, fontSize: 15 }}>
        Choose what you want to edit.
      </Text>
      {ADMIN_SECTIONS.map((section) => (
        <Pressable
          key={section.id}
          onPress={() => onSelect(section.id)}
          accessibilityRole="button"
          accessibilityLabel={section.title}
          style={({ pressed }) => ({
            backgroundColor: Colors.surface,
            borderColor: Colors.border,
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: "row",
            gap: 14,
            opacity: pressed ? 0.85 : 1,
            padding: 16,
          })}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#FEF9E7",
              borderRadius: 8,
              height: 44,
              justifyContent: "center",
              width: 44,
            }}
          >
            <Ionicons name={section.icon} size={22} color={Colors.gold} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: Colors.text, fontSize: 17, fontWeight: "700" }}>{section.title}</Text>
            <Text style={{ color: Colors.muted, fontSize: 14 }}>{section.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

function ActiveEditor({ sectionId, user }: { sectionId: AdminSectionId; user: User }) {
  switch (sectionId) {
    case "minyan":
      return <MinyanEditor user={user} />;
    case "events":
      return <EventsEditor user={user} />;
    case "classes":
      return <ClassesEditor user={user} />;
    case "community-updates":
      return <CommunityUpdatesEditor user={user} />;
    case "contact":
      return <ContactEditor user={user} />;
    case "donation":
      return <DonationEditor user={user} />;
  }
}

export default function AdminScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSectionId | null>(null);
  const userUid = user?.uid ?? null;

  useEffect(() => {
    const fallbackReadyTimer = setTimeout(() => {
      setAuthReady(true);
    }, 1500);

    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        clearTimeout(fallbackReadyTimer);
        setUser(nextUser);
        setAuthReady(true);
        if (!nextUser) {
          setAdminChecked(true);
          setIsAdmin(false);
          setActiveSection(null);
        }
      },
      () => {
        clearTimeout(fallbackReadyTimer);
        setUser(null);
        setAuthReady(true);
        setAdminChecked(true);
        setIsAdmin(false);
        setActiveSection(null);
      }
    );

    return () => {
      clearTimeout(fallbackReadyTimer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userUid) {
      setAdminChecked(true);
      setIsAdmin(false);
      return;
    }

    setAdminChecked(false);
    let isCancelled = false;
    const adminRef = doc(db, "admins", userUid);

    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    }, 3000);

    const checkAdmin = async () => {
      try {
        const snap = await getDoc(adminRef);
        if (isCancelled) return;

        clearTimeout(fallbackTimer);
        setIsAdmin(snap.exists());
        setAdminChecked(true);
      } catch {
        if (isCancelled) return;

        clearTimeout(fallbackTimer);
        setIsAdmin(false);
        setAdminChecked(true);
      }
    };

    checkAdmin();

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [userUid]);

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

  if (!authReady || !adminChecked) {
    return (
      <View style={{ alignItems: "center", backgroundColor: Colors.bg, flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={{ color: Colors.muted, fontSize: 14, marginTop: 12 }}>Loading admin...</Text>
        {user?.email ? (
          <Text style={{ color: Colors.muted, fontSize: 12, marginTop: 4 }}>
            Checking admin access for {user.email}
          </Text>
        ) : null}
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
              <Button
                label={signingIn ? "Signing In" : "Sign In"}
                icon="log-in-outline"
                onPress={signIn}
                disabled={signingIn}
              />
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

  if (!activeSection) {
    return (
      <AdminShell title="Admin" email={user.email || ""}>
        <SectionPicker onSelect={setActiveSection} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={SECTION_TITLES[activeSection]}
      email={user.email || ""}
      onBack={() => setActiveSection(null)}
    >
      <ActiveEditor sectionId={activeSection} user={user} />
    </AdminShell>
  );
}
