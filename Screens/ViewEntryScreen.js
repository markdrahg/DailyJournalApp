// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// export default function ViewEntryScreen({ route }) {
//   const { entry, onDelete } = route.params; // onDelete passed from HomeScreen
//   const navigation = useNavigation();

//   const deleteEntry = async () => {
//     try {
//       const storedEntries = await AsyncStorage.getItem('journalEntries');
//       const entries = storedEntries ? JSON.parse(storedEntries) : [];
//       const updatedEntries = entries.filter((item) => item.id !== entry.id);
//       await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
//       onDelete(); // Notify HomeScreen to refresh entries
//       navigation.goBack(); // Go back to HomeScreen
//     } catch (error) {
//       console.error('Error deleting entry:', error);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert(
//       'Delete Entry',
//       'Are you sure you want to delete this entry?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', onPress: deleteEntry, style: 'destructive' },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{entry.title}</Text>
//       <Text style={styles.date}>{entry.date}</Text>
//       <Text style={styles.content}>{entry.content}</Text>
//       {entry.imageUri && (
//         <Image source={{ uri: entry.imageUri }} style={styles.imagePreview} />
//       )}
//       <TouchableOpacity style={styles.button} onPress={confirmDelete}>
//         <Text style={styles.buttonText}>Delete Entry</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   date: { fontSize: 16, color: '#888', marginBottom: 20 },
//   content: { fontSize: 18, lineHeight: 24, marginBottom: 30 },
//   button: {
//     backgroundColor: '#e53935',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   imagePreview: {
//     width: 300,
//     height: 200,
//     borderRadius: 10,
//     marginVertical: 20,
//     alignSelf: 'center',
//   },
// });



// 2
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// import { Audio } from 'expo-av';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// export default function ViewEntryScreen({ route }) {
//   const { entry, onDelete } = route.params;
//   const navigation = useNavigation();
//   const [sound, setSound] = useState(null);

//   const deleteEntry = async () => {
//     try {
//       const storedEntries = await AsyncStorage.getItem('journalEntries');
//       const entries = storedEntries ? JSON.parse(storedEntries) : [];
//       const updatedEntries = entries.filter((item) => item.id !== entry.id);
//       await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
//       onDelete();
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error deleting entry:', error);
//     }
//   };

//   const confirmDelete = () => {
//     Alert.alert(
//       'Delete Entry',
//       'Are you sure you want to delete this entry?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', onPress: deleteEntry, style: 'destructive' },
//       ],
//       { cancelable: true }
//     );
//   };

//   const playAudio = async () => {
//     try {
//       if (entry.audioUri) {
//         const { sound } = await Audio.Sound.createAsync({ uri: entry.audioUri });
//         setSound(sound);
//         await sound.playAsync();
//       } else {
//         Alert.alert('No Audio', 'No audio file attached to this entry.');
//       }
//     } catch (error) {
//       console.error('Error playing audio:', error);
//     }
//   };

//   useEffect(() => {
//     return sound
//       ? () => {
//           sound.unloadAsync(); // Cleanup sound on unmount
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{entry.title}</Text>
//       <Text style={styles.date}>{entry.date}</Text>
//       <Text style={styles.content}>{entry.content}</Text>

//       {entry.imageUri && (
//         <Image source={{ uri: entry.imageUri }} style={styles.imagePreview} />
//       )}

//       {entry.audioUri && (
//         <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
//           <Text style={styles.buttonText}>Play Audio</Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity style={styles.button} onPress={confirmDelete}>
//         <Text style={styles.buttonText}>Delete Entry</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   date: { fontSize: 16, color: '#888', marginBottom: 20 },
//   content: { fontSize: 18, lineHeight: 24, marginBottom: 30 },
//   button: {
//     backgroundColor: '#e53935',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   audioButton: {
//     backgroundColor: '#6200ee',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   imagePreview: {
//     width: 300,
//     height: 200,
//     borderRadius: 10,
//     marginVertical: 20,
//     alignSelf: 'center',
//   },
// });





import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ViewEntryScreen({ route }) {
  const { entry, onDelete } = route.params;
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);

  const deleteEntry = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journalEntries');
      const entries = storedEntries ? JSON.parse(storedEntries) : [];
      const updatedEntries = entries.filter((item) => item.id !== entry.id);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      onDelete();
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteEntry, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const playAudio = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Cleanup sound on unmount
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.date}>{entry.date}</Text>
      <Text style={styles.content}>{entry.content}</Text>

      {entry.imageUri && (
        <Image source={{ uri: entry.imageUri }} style={styles.imagePreview} />
      )}

      {entry.imageUris && (
        <View >
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.imagePreview} />
          ))}
        </View>
      )}

      {/* Loop through audio files */}
      {entry.audioFiles && entry.audioFiles.length > 0 ? (
        entry.audioFiles.map((file, index) => (
          <TouchableOpacity
            key={index}
            style={styles.audioButton}
            onPress={() => playAudio(file.uri)}
          >
            <Text style={styles.buttonText}>{file.name || `Audio ${index + 1}`}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noAudioText}>No audio files attached to this entry.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={confirmDelete}>
        <Text style={styles.buttonText}>Delete Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  date: { fontSize: 16, color: '#888', marginBottom: 20 },
  content: { fontSize: 18, lineHeight: 24, marginBottom: 30 },
  button: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  audioButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imagePreview: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'center',
  },
  noAudioText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
});
