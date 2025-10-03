# TODO: Implement User Profile Photo Support

## Backend Steps
- [ ] Install multer dependency in habit_tracker_backend
- [ ] Create uploads directory in habit_tracker_backend
- [ ] Update User model (habit_tracker_backend/models/User.js) to add profileImage field
- [ ] Update main server file (habit_tracker_backend/index.js) to serve static files from /uploads
- [ ] Update authController.js: Modify signup to handle optional profileImage upload; add updateProfile function with multer for image handling
- [ ] Update auth routes (habit_tracker_backend/routes/auth.js) to add protected POST /profile endpoint

## Frontend Steps
- [ ] Install expo-image-picker in habit_tracker_ui
- [ ] Update AuthContext.tsx: Add updateProfile method to handle image upload via FormData
- [ ] Update signup.tsx: Integrate ImagePicker, allow optional image selection, use FormData for signup API call
- [ ] Update UserProfileModal.tsx: Add edit mode with ImagePicker for photo change, upload button to call updateProfile, refresh user data
- [ ] Update Header.tsx: Display user profileImage if available, with fallback to initials

## Testing & Followup
- [ ] Restart backend server and Expo dev server
- [ ] Test signup with/without image: Verify storage in /uploads and DB update
- [ ] Test profile update: Change image in modal, verify update and display
- [ ] Handle edge cases: No image, invalid file types/sizes, permissions
- [ ] Update TODO.md as steps complete
