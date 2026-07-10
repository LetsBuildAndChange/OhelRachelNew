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
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Button } from "./components/Button";
import { cardStyle, Colors } from "./components/colors";
import { Field } from "./components/Field";
import { VisibilitySwitch } from "./components/VisibilitySwitch";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  eventUrl: string;
  urlTitle: string;
  index: number;
  isVisible: boolean;
};

type EventsEditorProps = {
  user: User;
};

export function EventsEditor({ user }: EventsEditorProps) {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsRef = collection(db, "Event");
    const itemsQuery = query(itemsRef, orderBy("index", "asc"));

    return onSnapshot(
      itemsQuery,
      (snap) => {
        setItems(
          snap.docs.map((itemDoc) => {
            const data = itemDoc.data();
            return {
              id: itemDoc.id,
              title: String(data.title || ""),
              date: String(data.date || ""),
              time: String(data.time || ""),
              description: String(data.description || ""),
              imageUrl: String(data.imageUrl || ""),
              eventUrl: String(data.eventUrl || ""),
              urlTitle: String(data.urlTitle || ""),
              index: typeof data.index === "number" ? data.index : 0,
              isVisible: data.isVisible === true,
            };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const nextIndex = useMemo(
    () => items.reduce((highest, item) => Math.max(highest, item.index), -1) + 1,
    [items]
  );

  const updateItem = async (itemId: string, data: Partial<EventItem>) => {
    await updateDoc(doc(db, "Event", itemId), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const addItem = async () => {
    await addDoc(collection(db, "Event"), {
      title: "New Event",
      date: "",
      time: "",
      description: "",
      imageUrl: "",
      eventUrl: "",
      urlTitle: "",
      index: nextIndex,
      isVisible: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const removeItem = (item: EventItem) => {
    Alert.alert("Delete event?", `${item.title || "This event"} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "Event", item.id));
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator color={Colors.gold} />;
  }

  return (
    <>
      <View style={{ ...cardStyle, gap: 12 }}>
        <Text style={{ color: Colors.muted, fontSize: 14 }}>
          For imageUrl, use an https:// link or a bundled asset filename such as BuildingFundraiserFlyer.png.
        </Text>
        <Button label="Add Event" icon="add-circle-outline" onPress={addItem} variant="secondary" />
      </View>

      {items.map((item) => (
        <View key={item.id} style={cardStyle}>
          <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 12 }}>
            <Field
              label="Title"
              value={item.title}
              onChangeText={(value) => updateItem(item.id, { title: value })}
              saveOnBlur
            />
            <VisibilitySwitch
              value={item.isVisible}
              onValueChange={(value) => updateItem(item.id, { isVisible: value })}
            />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <Field
              label="Date"
              value={item.date}
              onChangeText={(value) => updateItem(item.id, { date: value })}
              placeholder="March 15, 2026"
              saveOnBlur
            />
            <Field
              label="Time"
              value={item.time}
              onChangeText={(value) => updateItem(item.id, { time: value })}
              placeholder="7:30 PM"
              saveOnBlur
            />
          </View>
          <Field
            label="Description"
            value={item.description}
            onChangeText={(value) => updateItem(item.id, { description: value })}
            saveOnBlur
            multiline
          />
          <Field
            label="Image URL"
            value={item.imageUrl}
            onChangeText={(value) => updateItem(item.id, { imageUrl: value })}
            placeholder="https://... or BuildingFundraiserFlyer.png"
            saveOnBlur
          />
          <Field
            label="RSVP / Event URL"
            value={item.eventUrl}
            onChangeText={(value) => updateItem(item.id, { eventUrl: value })}
            placeholder="https://..."
            saveOnBlur
          />
          <Field
            label="Link Button Label"
            value={item.urlTitle}
            onChangeText={(value) => updateItem(item.id, { urlTitle: value })}
            placeholder="Click here for RSVP Link"
            saveOnBlur
          />
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <Field
              label="Index"
              value={String(item.index)}
              onChangeText={(value) => {
                const parsed = Number.parseInt(value, 10);
                if (!Number.isNaN(parsed)) {
                  updateItem(item.id, { index: parsed });
                }
              }}
              saveOnBlur
            />
            <Button label="Delete" icon="trash-outline" onPress={() => removeItem(item)} variant="danger" />
          </View>
        </View>
      ))}
    </>
  );
}
