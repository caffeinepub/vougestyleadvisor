# vougestyleadvisor – /yo-admin Panel

## Current State
- `/yo-private`: Dark, moody password-protected gallery. Password stored in Firebase at `privateGallery/password`. Media items stored at `privateGallery/items`.
- `/admin`: Full admin panel with Firebase email/password authentication (Firebase Auth).
- No `/yo-admin` route exists yet.

## Requested Changes (Diff)

### Add
- New page `YoAdminPage` at route `/yo-admin`
- Firebase email/password login gate (same auth as `/admin`)
- After login: dark-themed admin dashboard with 3 sections:
  1. **Upload Media** – upload images or videos to Cloudinary (preset: `vougestyleadvisor`, cloud: `doj0aeuvi`), then save the Cloudinary URL + type (image/video) + timestamp to Firebase at `privateGallery/items`
  2. **Manage Gallery** – grid view of all current gallery items with delete button on each
  3. **Change Password** – form to update the gallery access password stored in Firebase at `privateGallery/password`
- Route registered in App.tsx; nav/footer hidden on this route

### Modify
- `App.tsx`: add `/yo-admin` route pointing to `YoAdminPage`; hide nav/footer on this route

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/YoAdminPage.tsx` with:
   - Firebase Auth login form (dark styled)
   - Post-login dashboard: Upload, Gallery Management, Change Password tabs
   - Cloudinary unsigned upload (widget or fetch)
   - Firebase CRUD for `privateGallery/items` and `privateGallery/password`
2. Update `App.tsx` to register the route and hide nav/footer for `/yo-admin`
