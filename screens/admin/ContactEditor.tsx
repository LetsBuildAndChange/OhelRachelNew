import { db } from "@/lib/Firebase";
import { User } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "./components/Button";
import { cardStyle, Colors } from "./components/colors";
import { Field } from "./components/Field";

type ContactEditorProps = {
  user: User;
};

export function ContactEditor({ user }: ContactEditorProps) {
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const contactRef = doc(db, "ContactInfo", "info");
    return onSnapshot(
      contactRef,
      (snap) => {
        setInfo(snap.exists() ? String(snap.data()?.info || "") : "");
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "ContactInfo", "info"),
        {
          info,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        },
        { merge: true }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator color={Colors.gold} />;
  }

  return (
    <View style={cardStyle}>
      <Text style={{ color: Colors.muted, fontSize: 14 }}>
        This text appears in the Contact Us section on the home screen.
      </Text>
      <Field label="Contact Info" value={info} onChangeText={setInfo} multiline />
      <Button
        label={saving ? "Saving..." : "Save Contact Info"}
        icon="save-outline"
        onPress={save}
        disabled={saving}
      />
    </View>
  );
}
