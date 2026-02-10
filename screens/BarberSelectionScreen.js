import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const barbers = [
  { id: '1', name: 'João Silva', skill: 'Corte e Barba' },
  { id: '2', name: 'Pedro Santos', skill: 'Especialista em Degradê' },
  { id: '3', name: 'Carlos Oliveira', skill: 'Visagista' },
];

export default function BarberSelectionScreen({ navigation }) {
  const [selectedBarber, setSelectedBarber] = useState(null);

  const handleSelect = (barber) => {
    setSelectedBarber(barber);
    navigation.navigate('TimeSelection', { barber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu Barbeiro</Text>
      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.barberItem, 
              selectedBarber?.id === item.id && styles.selected
            ]}
            onPress={() => handleSelect(item)}
          >
            <View>
              <Text style={styles.barberText}>{item.name}</Text>
              <Text style={styles.skillText}>{item.skill}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { fontSize: 25, fontWeight: 'bold', color: '#6B8E23', marginBottom: 20, textAlign: 'center', marginTop: 40 },
  barberItem: { 
    backgroundColor: '#1A1A1A', padding: 20, borderRadius: 12, 
    marginBottom: 15, borderWidth: 1, borderColor: '#333' 
  },
  selected: { borderColor: '#6B8E23', backgroundColor: '#4B5320' },
  barberText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  skillText: { color: '#AAA', fontSize: 14 }
});