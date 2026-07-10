# Admin Setup

The in-app admin editor is available at `/admin`. It is not shown in the public tab bar.

Open the app and navigate to `/admin` (e.g. via Expo dev tools or deep link), then sign in with an admin account. After sign-in, choose a section from the menu to edit.

---

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

Deploy `firestore.rules` so only admins can write app content.

```sh
firebase deploy --only firestore:rules
```

## 5. Open the editor

Open `/admin`, sign in with the admin account, then pick a section:

| Section | Firestore path | What it controls |
|---------|----------------|------------------|
| Minyan Times | `settings/app/schedules/{scheduleId}/sections/.../items/...` | Prayer schedules on the Minyan tab |
| Events | `Event/{id}` | Upcoming events on the home screen |
| Weekly Classes | `Classes/{id}` | Class listings on the home screen |
| Community Updates | `CommunityUpdates/{id}` | Announcements on the home screen |
| Contact Info | `ContactInfo/info` | Contact Us text on the home screen |
| Donation Info | `DonationInfo/info` | Zelle, PayPal, and Venmo details on the Donation tab |

### Minyan notes

- Set the active schedule ID under **Minyan Times** to switch which schedule the app displays.
- Sections and prayer times support a visibility toggle for draft content.

### Events notes

- `imageUrl` can be an `https://` link or a bundled asset filename (e.g. `BuildingFundraiserFlyer.png`).
- `eventUrl` is the RSVP or external link opened from the event card.
- Events must have `isVisible: true` to appear in the app.

### List collections (Classes, Community Updates, Events)

- Use **index** to control display order.
- Use the **Visible** toggle to hide items without deleting them.
