import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import PaymentScreen from './PaymentScreen';


export default function TimeSelectionScreen({ navigation }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const times = ['09:00', '09:30', '10:00', '14:00', '15:30', '17:00', '18:00', '19:30'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Disponíveis</Text>
      <FlatList
        data={times}
        numColumns={3}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.timeSlot, selectedTime === item && styles.selectedTime]}
            onPress={() => setSelectedTime(item)}
          >
            <Text style={styles.timeText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedTime && (
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => navigation.navigate('PaymentScreen')}
        >
          <Text style={styles.confirmText}>Confirmar para {selectedTime}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6B8E23', textAlign: 'center', marginVertical: 40 },
  timeSlot: { 
    flex: 1, backgroundColor: '#1A1A1A', margin: 5, padding: 15, 
    borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#333' 
  },
  selectedTime: { backgroundColor: '#4B5320', borderColor: '#6B8E23' },
  timeText: { color: '#FFF', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#4B5320', padding: 20, borderRadius: 15, marginTop: 20 },
  confirmText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }
});