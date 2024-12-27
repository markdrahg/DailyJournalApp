// // screens/AddEntryScreen.js

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';

// export default function AddEntryScreen({ route }) {
//   const { onAdd } = route.params; // onAdd passed from HomeScreen
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const navigation = useNavigation();

//   const saveEntry = async () => {
//     if (!title.trim() || !content.trim()) {
//       Alert.alert('Validation', 'Please fill in both fields.');
//       return;
//     }

//     const newEntry = {
//       id: Date.now().toString(),
//       title,
//       content,
//       imageUri,
//       date: new Date().toLocaleDateString(),
//     };

//     try {
//       const storedEntries = await AsyncStorage.getItem('journalEntries');
//       const entries = storedEntries ? JSON.parse(storedEntries) : [];
//       entries.push(newEntry);
//       await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
//       onAdd(); // Notify HomeScreen to refresh entries
//       navigation.goBack(); // Go back to HomeScreen
//     } catch (error) {
//       console.error('Error saving entry:', error);
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri); // Set the selected image URI
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Title"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={[styles.input, styles.content]}
//         placeholder="Write your journal entry..."
//         value={content}
//         onChangeText={(text) => setContent(text.slice(0, 500))}
//         multiline
//       />
//       <Text style={styles.charCount}>{content.length}/500</Text>

//       <TouchableOpacity style={styles.button} onPress={pickImage}>
//         <Text style={styles.buttonText}>Add Image</Text>
//       </TouchableOpacity>

//       {imageUri && (
//         <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//       )}

//       <TouchableOpacity style={styles.button} onPress={saveEntry}>
//         <Text style={styles.buttonText}>Save</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
//   input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10, fontSize: 16 },
//   content: { height: 150, textAlignVertical: 'top' },
//   button: {
//     backgroundColor: '#6200ee',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   charCount: { textAlign: 'right', marginBottom: 20 },
//   imagePreview: { width: 100, height: 100, borderRadius: 10, marginTop: 10, marginBottom: 20 },
// });


// screens/AddEntryScreen.js with audio 1
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

export default function AddEntryScreen({ route }) {
  const { onAdd } = route.params; // onAdd passed from HomeScreen
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]); // Stores uploaded and recorded audio
  const [recording, setRecording] = useState(null); // Holds the recording instance
  const navigation = useNavigation();

  const saveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please fill in both fields.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      imageUri,
      audioFiles, // Save audio file URIs
      date: new Date().toLocaleDateString(),
    };

    try {
      const storedEntries = await AsyncStorage.getItem('journalEntries');
      const entries = storedEntries ? JSON.parse(storedEntries) : [];
      entries.push(newEntry);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
      onAdd(); // Notify HomeScreen to refresh entries
      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set the selected image URI
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (result.type === 'success') {
        setAudioFiles([...audioFiles, { uri: result.uri, name: result.name }]);
      }
    } catch (err) {
      console.error('Error picking audio file:', err);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to access microphone is required!');
        return;
      }
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioFiles([...audioFiles, { uri, name: `Recording-${audioFiles.length + 1}.m4a` }]);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.content]}
        placeholder="Write your journal entry..."
        value={content}
        onChangeText={(text) => setContent(text.slice(0, 500))}
        multiline
      />
      <Text style={styles.charCount}>{content.length}/500</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {/* Audio Upload Buttons */}
      <TouchableOpacity style={styles.button} onPress={pickAudioFile}>
        <Text style={styles.buttonText}>Upload Audio</Text>
      </TouchableOpacity>

      {recording ? (
        <TouchableOpacity style={styles.button} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={startRecording}>
          <Text style={styles.buttonText}>Record Audio</Text>
        </TouchableOpacity>
      )}

      {/* Display Audio Files */}
      {audioFiles.map((file, index) => (
        <Text key={index} style={styles.audioText}>
          {file.name}
        </Text>
      ))}

      <TouchableOpacity style={styles.button} onPress={saveEntry}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10, fontSize: 16 },
  content: { height: 150, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  charCount: { textAlign: 'right', marginBottom: 20 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, marginTop: 10, marginBottom: 20 },
  audioText: { fontSize: 14, marginTop: 10, color: '#333' },
});


