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

type CommunityUpdateItem = {
  id: string;
  info: string;
  index: number;
  isVisible: boolean;
};

type CommunityUpdatesEditorProps = {
  user: User;
};

export function CommunityUpdatesEditor({ user }: CommunityUpdatesEditorProps) {
  const [items, setItems] = useState<CommunityUpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsRef = collection(db, "CommunityUpdates");
    const itemsQuery = query(itemsRef, orderBy("index", "asc"));

    return onSnapshot(
      itemsQuery,
      (snap) => {
        setItems(
          snap.docs.map((itemDoc) => {
            const data = itemDoc.data();
            return {
              id: itemDoc.id,
              info: String(data.info || ""),
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

  const updateItem = async (itemId: string, data: Partial<CommunityUpdateItem>) => {
    await updateDoc(doc(db, "CommunityUpdates", itemId), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const addItem = async () => {
    await addDoc(collection(db, "CommunityUpdates"), {
      info: "New update",
      index: nextIndex,
      isVisible: true,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  };

  const removeItem = (item: CommunityUpdateItem) => {
    Alert.alert("Delete update?", "This community update will be removed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "CommunityUpdates", item.id));
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
          Updates appear on the home screen. Higher index values appear first.
        </Text>
        <Button label="Add Update" icon="add-circle-outline" onPress={addItem} variant="secondary" />
      </View>

      {items.map((item) => (
        <View key={item.id} style={cardStyle}>
          <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 12 }}>
            <Field
              label="Update"
              value={item.info}
              onChangeText={(value) => updateItem(item.id, { info: value })}
              saveOnBlur
              multiline
            />
            <VisibilitySwitch
              value={item.isVisible}
              onValueChange={(value) => updateItem(item.id, { isVisible: value })}
            />
          </View>
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
