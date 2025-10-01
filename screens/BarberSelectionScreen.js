import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const barbers = [
  { id: '1', name: 'João Silva' },
  { id: '2', name: 'Pedro Santos' },
  { id: '3', name: 'Carlos Oliveira' },
];

export default function BarberSelectionScreen({ navigation }) {
  const [selectedBarber, setSelectedBarber] = useState(null);

  const handleSelect = (barber) => {
    setSelectedBarber(barber);
    // Passar barbeiro selecionado para próxima tela
    navigation.navigate('TimeSelection', { barber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Barbeiro</Text>
      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.barberItem, selectedBarber?.id === item.id && styles.selected]}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.barberText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFD700',
  },
  barberItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#FFD700',
  },
  barberText: {
    color: '#FFF',
    fontSize: 16,
  },
});
