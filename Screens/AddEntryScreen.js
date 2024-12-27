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







// // screens/AddEntryScreen.js with audio 1
// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// import { Audio } from 'expo-av';

// export default function AddEntryScreen({ route }) {
//   const { onAdd } = route.params; // onAdd passed from HomeScreen
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const [audioFiles, setAudioFiles] = useState([]); // Stores uploaded and recorded audio
//   const [recording, setRecording] = useState(null); // Holds the recording instance
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
//       audioFiles, // Save audio file URIs
//       date: new Date().toLocaleDateString(),
//     };

//     try {
//       const storedEntries = await AsyncStorage.getItem('journalEntries');
//       const entries = storedEntries ? JSON.parse(storedEntries) : [];
//       entries.push(newEntry);
//       await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
//       onAdd(); // Notify HomeScreen to refresh entries
//       navigation.goBack();
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

//   const pickAudioFile = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
//       if (result.type === 'success') {
//         setAudioFiles([...audioFiles, { uri: result.uri, name: result.name }]);
//       }
//     } catch (err) {
//       console.error('Error picking audio file:', err);
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const permission = await Audio.requestPermissionsAsync();
//       if (!permission.granted) {
//         alert('Permission to access microphone is required!');
//         return;
//       }
//       const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       setRecording(recording);
//     } catch (err) {
//       console.error('Failed to start recording:', err);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setAudioFiles([...audioFiles, { uri, name: `Recording-${audioFiles.length + 1}.m4a` }]);
//       setRecording(null);
//     } catch (err) {
//       console.error('Failed to stop recording:', err);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
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
//       {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

//       {/* Audio Upload Buttons */}
//       <TouchableOpacity style={styles.button} onPress={pickAudioFile}>
//         <Text style={styles.buttonText}>Upload Audio</Text>
//       </TouchableOpacity>

//       {recording ? (
//         <TouchableOpacity style={styles.button} onPress={stopRecording}>
//           <Text style={styles.buttonText}>Stop Recording</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={startRecording}>
//           <Text style={styles.buttonText}>Record Audio</Text>
//         </TouchableOpacity>
//       )}

//       {/* Display Audio Files */}
//       {audioFiles.map((file, index) => (
//         <Text key={index} style={styles.audioText}>
//           {file.name}
//         </Text>
//       ))}

//       <TouchableOpacity style={styles.button} onPress={saveEntry}>
//         <Text style={styles.buttonText}>Save</Text>
//       </TouchableOpacity>
//     </ScrollView>
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
//   audioText: { fontSize: 14, marginTop: 10, color: '#333' },
// });






// screens/AddEntryScreen.js with fixed animations and recording cleanup
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ScrollView, Animated } from 'react-native';
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
  const [imageUris, setImageUris] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]); // Stores uploaded and recorded audio
  const [recording, setRecording] = useState(null); // Holds the recording instance
  const [menuVisible, setMenuVisible] = useState(false); // Controls visibility of menu buttons
  const navigation = useNavigation();

  // Animation values
  const buttonAnimation = useState(new Animated.Value(0))[0];

  // Cleanup effect for recording
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
        setRecording(null);
      }
    };
  }, [recording]);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
    Animated.spring(buttonAnimation, {
      toValue: menuVisible ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

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
      imageUris,
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

  //1
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     // mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     mediaTypes: ['images'],
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImageUri(result.assets[0].uri); // Set the selected image URI
  //   }
  // };




  const pickImage = async () => {
    console.log('stage 1..');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result && !result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri; // Get the URI from the first asset
      console.log('Selected Image URI:', uri);
      setImageUris((prevUris) => [...prevUris, uri]);
    } else {
      console.log('Image selection was canceled or invalid');
    }
  };
  
  useEffect(() => {
    console.log('Updated Image URIs:', imageUris);
  }, [imageUris]);
  


  const pickAudioFile = async () => {
    console.log('stage 1');
    try {
      console.log('stage 2');
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      console.log('Result:', result);
  
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        console.log('stage 3');
        const file = result.assets[0];
        setAudioFiles([...audioFiles, { uri: file.uri, name: file.name }]);
        console.log('stage 4');
      } else {
        console.log('No file selected or operation canceled');
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
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioFiles([...audioFiles, { uri, name: `Recording-${audioFiles.length + 1}.m4a` }]);
        setRecording(null);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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

        {/* Display picked images */}
        {/* {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />} */}

        {imageUris.length > 0 && (
          <View style={styles.imageContainer}>
            {imageUris.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </View>
        )}

        {/* Display picked audio */}
        {audioFiles.map((file, index) => (
          <Text key={index} style={styles.audioText}>
            {file.name}
          </Text>
        ))}
      </ScrollView>

      {/* Animated Buttons */}
            
      
            {/*Save Button */}
            <Animated.View style={[styles.menuButton, { transform: [{ translateY: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, -160] }) }] }]}>
                  <TouchableOpacity style={styles.SaveButtonON} onPress={saveEntry}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
            </Animated.View>
      
      
             {/*visisbility check for Add Image */}
             <Animated.View style={[styles.menuButton, { transform: [{ translateY: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, -100] }) }] }]}>
              {menuVisible ? (
                  <TouchableOpacity style={styles.circleButtonON} onPress={pickImage}>
                    <Text style={styles.buttonText}>Add Image</Text>
                  </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.circleButtonOFF}>
                  <Text style={styles.buttonText}>.</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
      
              {/*visisbility check for Upload Audio */}
            <Animated.View style={[styles.menuButton, { transform: [{ translateY: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, -60] }) }] }]}>
              {menuVisible ? (
                  <TouchableOpacity style={styles.circleButtonON} onPress={pickAudioFile}>
                    <Text style={styles.buttonText}>Upload Audio</Text>
                  </TouchableOpacity>
              ) : (
                  <TouchableOpacity style={styles.circleButtonOFF}>
                    <Text style={styles.buttonText}>.</Text>
                  </TouchableOpacity>
              )}
            </Animated.View>
      
      
              {/*visisbility check for Record Audio */}
            <Animated.View style={[styles.menuButton, { transform: [{ translateY: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, -20] }) }] }]}>
              {menuVisible ? (
                <TouchableOpacity 
                style={[styles.circleButtonON, recording ? styles.circleButtonRed : {}]} 
                onPress={recording ? stopRecording : startRecording}
              >
                <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
              </TouchableOpacity>
                
              ) : (
                <TouchableOpacity style={styles.circleButtonFF}>
                  <Text style={styles.buttonText}>.</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
      
      

      <TouchableOpacity style={styles.floatingButton} onPress={toggleMenu}>
        <Text style={styles.floatingButtonText}>{menuVisible ? '-' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10, fontSize: 16 },
  content: { height: 150, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', marginBottom: 20 },
  imagePreview: { width: 100, height: 100, borderRadius: 10, marginTop: 10, marginBottom: 20 },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  audioText: { fontSize: 14, marginTop: 10, color: '#333' },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    SaveButtonON: {
    width: 140,
    height: 39,
    borderRadius: 10,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  circleButtonON: {
    width: 140,
    height: 39,
    borderRadius: 10,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleButtonRed: {
    width: 140,
    height: 39,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  circleButtonFF: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  menuButton: {
    position: 'absolute',
    bottom: 90,
    right: 40,
  },
});