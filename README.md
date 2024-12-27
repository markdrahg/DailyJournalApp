- cd DailyJournalApp
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
- npm run android
- npm run ios # requires an iOS device or macOS for access to an iOS simulator
- npm run web

Structure:

DailyJournalApp/
├── App.js
├── components/
│ ├── EntryCard.js // Displays individual entries in a list or grid
│ ├── AddEntryForm.js // Form for adding/editing entries
│ └── VoiceRecorder.js // Handles recording and playing voice notes
├── screens/
│ ├── HomeScreen.js // Displays all journal entries
│ ├── AddEntryScreen.js // Add/edit journal entry
│ ├── ViewEntryScreen.js // Full view of a single entry
├── utils/
│ └── storage.js // AsyncStorage utility functions
└── assets/ // Audio and image files
