// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  // Function to fetch entries from AsyncStorage
  const fetchEntries = async () => {
    const storedEntries = await AsyncStorage.getItem('journalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  };

  useEffect(() => {
    fetchEntries(); // Fetch entries when the component is mounted
  }, []);

  // Pass this function to the ViewEntry screen to refresh entries after deletion
  const handleDelete = () => {
    fetchEntries(); // Refresh the list of entries
  };

  const handleAddEntry = () => {
    fetchEntries(); // Refresh the list of entries
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ViewEntry', { entry: item, onDelete: handleDelete })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEntry', { onAdd: handleAddEntry })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f8f8' },
  card: { padding: 20, marginVertical: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold' },
  date: { fontSize: 14, color: '#888' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#6200ee',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});
