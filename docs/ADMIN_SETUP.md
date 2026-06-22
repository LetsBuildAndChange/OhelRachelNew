# Admin Setup (v2 — not in v1 release)

The in-app admin editor is **not shipped in v1**. Source lives at `screens/AdminScreen.tsx` for a future release.

Until then, update minyan times and donation info in the **Firebase Console** (Firestore). Deployed `firestore.rules` still allow public read; client writes require an admin account when the app editor is enabled.

When you enable the admin feature, wire the screen back into `app/_layout.tsx` as route `admin` (or move the file to `app/admin.tsx`).

---

## Planned setup (when enabling admin)

The admin editor will live at `/admin`. It will not be shown in the public tab bar.

## 1. Enable sign in

In Firebase Console, enable Authentication with email/password.

## 2. Create the admin user

Create the admin account in Firebase Authentication, then copy its `uid`.

## 3. Grant admin access

Create this Firestore document:

```text
admins/{uid}
```

The document can be empty, or it can include helpful fields:

```json
{
  "email": "admin@example.com",
  "role": "admin"
}
```

## 4. Deploy rules

Deploy `firestore.rules` so only admins can edit minyan times.

```sh
firebase deploy --only firestore:rules
```

## 5. Open the editor

Open `/admin`, sign in with the admin account, and edit the active schedule.
