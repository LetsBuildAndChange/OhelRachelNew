import { db } from "@/lib/Firebase";
import { User } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "./components/Button";
import { cardStyle, Colors } from "./components/colors";
import { Field } from "./components/Field";

type DonationInfo = {
  zelleInfo: string;
  paypalURL: string;
  venmoInfo: string;
  venmoURL: string;
};

type DonationEditorProps = {
  user: User;
};

const emptyDonation: DonationInfo = {
  zelleInfo: "",
  paypalURL: "",
  venmoInfo: "",
  venmoURL: "",
};

export function DonationEditor({ user }: DonationEditorProps) {
  const [donation, setDonation] = useState<DonationInfo>(emptyDonation);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const donationRef = doc(db, "DonationInfo", "info");
    return onSnapshot(
      donationRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setDonation({
            zelleInfo: String(data.zelleInfo || ""),
            paypalURL: String(data.paypalURL || ""),
            venmoInfo: String(data.venmoInfo || ""),
            venmoURL: String(data.venmoURL || ""),
          });
        } else {
          setDonation(emptyDonation);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const updateField = (field: keyof DonationInfo, value: string) => {
    setDonation((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "DonationInfo", "info"),
        {
          ...donation,
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
        These values appear on the Donation screen.
      </Text>
      <Field
        label="Zelle Email"
        value={donation.zelleInfo}
        onChangeText={(value) => updateField("zelleInfo", value)}
        placeholder="email@example.com"
      />
      <Field
        label="PayPal URL"
        value={donation.paypalURL}
        onChangeText={(value) => updateField("paypalURL", value)}
        placeholder="https://www.paypal.com/donate?..."
      />
      <Field
        label="Venmo Handle"
        value={donation.venmoInfo}
        onChangeText={(value) => updateField("venmoInfo", value)}
        placeholder="Ohel-Rachel"
      />
      <Field
        label="Venmo URL"
        value={donation.venmoURL}
        onChangeText={(value) => updateField("venmoURL", value)}
        placeholder="https://venmo.com/u/..."
      />
      <Button
        label={saving ? "Saving..." : "Save Donation Info"}
        icon="save-outline"
        onPress={save}
        disabled={saving}
      />
    </View>
  );
}
