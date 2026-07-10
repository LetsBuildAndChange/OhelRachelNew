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

type ClassItem = {
  id: string;
  title: string;
  time: string;
  teacher: string;
  topic: string;
  index: number;
  isVisible: boolean;
};

type ClassesEditorProps = {
  user: User;
};

export function ClassesEditor({ user }: ClassesEditorProps) {
  const [items, setItems] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsRef = collection(db, "Classes");
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
              time: String(data.time || ""),
              teacher: String(data.teacher || ""),
              topic: String(data.topic || ""),
              index: typeof data.index === "number" ? data.index : 0,
              isVisible: data.isVisible !== false,
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

  const updateItem = async (itemId: string, data: Partial<ClassItem>) => {
    await updateDoc(doc(db, "Classes", itemId), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const addItem = async () => {
    await addDoc(collection(db, "Classes"), {
      title: "New Class",
      time: "",
      teacher: "",
      topic: "",
      index: nextIndex,
      isVisible: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const removeItem = (item: ClassItem) => {
    Alert.alert("Delete class?", `${item.title || "This class"} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "Classes", item.id));
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
          Weekly classes appear on the home screen, ordered by index.
        </Text>
        <Button label="Add Class" icon="add-circle-outline" onPress={addItem} variant="secondary" />
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
              label="Time"
              value={item.time}
              onChangeText={(value) => updateItem(item.id, { time: value })}
              placeholder="Shabbos 8:00 PM"
              saveOnBlur
            />
            <Field
              label="Teacher"
              value={item.teacher}
              onChangeText={(value) => updateItem(item.id, { teacher: value })}
              saveOnBlur
            />
          </View>
          <Field
            label="Topic"
            value={item.topic}
            onChangeText={(value) => updateItem(item.id, { topic: value })}
            saveOnBlur
            multiline
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
