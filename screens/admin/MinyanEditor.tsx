import { db } from "@/lib/Firebase";
import { User } from "firebase/auth";
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
import { ActivityIndicator, Alert, Switch, Text, View } from "react-native";
import { Button } from "./components/Button";
import { cardStyle, Colors } from "./components/colors";
import { Field } from "./components/Field";

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

type MinyanEditorProps = {
  user: User;
};

export function MinyanEditor({ user }: MinyanEditorProps) {
  const [scheduleId, setScheduleId] = useState("default");
  const [scheduleDraft, setScheduleDraft] = useState("default");
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    const settingsRef = doc(db, "settings", "app");
    return onSnapshot(settingsRef, (snap) => {
      const currentScheduleId = snap.data()?.currentScheduleId || "default";
      setScheduleId(currentScheduleId);
      setScheduleDraft(currentScheduleId);
    });
  }, []);

  useEffect(() => {
    if (!scheduleId) return;

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
  }, [scheduleId]);

  const nextSectionIndex = useMemo(
    () => sections.reduce((highest, section) => Math.max(highest, section.index), -1) + 1,
    [sections]
  );

  const updateSection = async (sectionId: string, data: Partial<Section>) => {
    await updateDoc(doc(db, "settings", "app", "schedules", scheduleId, "sections", sectionId), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const updateItem = async (sectionId: string, itemId: string, data: Partial<MinyanItem>) => {
    await updateDoc(
      doc(db, "settings", "app", "schedules", scheduleId, "sections", sectionId, "items", itemId),
      {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }
    );
  };

  const addSection = async () => {
    await addDoc(collection(db, "settings", "app", "schedules", scheduleId, "sections"), {
      title: "New Section",
      index: nextSectionIndex,
      isVisible: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const setActiveSchedule = async () => {
    const nextScheduleId = scheduleDraft.trim() || "default";

    await updateDoc(doc(db, "settings", "app"), {
      currentScheduleId: nextScheduleId,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
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
        createdBy: user.uid,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
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

  return (
    <>
      <View style={{ ...cardStyle, gap: 12 }}>
        <Field label="Active Schedule" value={scheduleDraft} onChangeText={setScheduleDraft} />
        <Button label="Set Active" icon="checkmark-circle-outline" onPress={setActiveSchedule} />
        <Button label="Add Section" icon="add-circle-outline" onPress={addSection} variant="secondary" />
      </View>

      {loadingSchedule ? <ActivityIndicator color={Colors.gold} /> : null}

      {sections.map((section) => (
        <View key={section.id} style={cardStyle}>
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
    </>
  );
}
