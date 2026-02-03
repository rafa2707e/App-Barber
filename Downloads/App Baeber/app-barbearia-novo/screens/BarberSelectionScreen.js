import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, SafeAreaView } from 'react-native';

const barbers = [
  { id: '1', name: 'João Silva' },
  { id: '2', name: 'Pedro Santos' },
  { id: '3', name: 'Carlos Oliveira' },
];

export default function BarberSelectionScreen({ navigation }) {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelect = (barber) => {
    setSelectedBarber(barber);
    navigation.navigate('Appointment', { barber });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Text style={styles.title}>Selecione um Barbeiro</Text>
        <FlatList
          data={barbers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.barberItem, selectedBarber?.id === item.id && styles.selected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.barberText, selectedBarber?.id === item.id && styles.selectedText]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#212529',
  },
  barberItem: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  selected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  barberText: {
    color: '#212529',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
