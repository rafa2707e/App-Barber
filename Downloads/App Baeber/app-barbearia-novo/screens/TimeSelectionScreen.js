import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Animated, SafeAreaView } from 'react-native';

export default function TimeSelectionScreen({ navigation, route }) {
  const { selectedDate } = route.params || {};
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Simular busca de horários disponíveis
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    setAvailableTimes(times);
  }, []);

  const handleSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert('Erro', 'Selecione um horário');
      return;
    }
    navigation.navigate('ServiceSelection', { selectedDate, selectedTime });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Text style={styles.title}>Selecionar Horário</Text>
        <Text style={styles.subtitle}>Data: {selectedDate ? formatDate(selectedDate) : 'Nenhuma data selecionada'}</Text>

        <FlatList
          data={availableTimes}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.timeItem, selectedTime === item && styles.selected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.timeText, selectedTime === item && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={styles.confirmButtonText}>Confirmar Horário</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#6C757D',
    textAlign: 'center',
  },
  timeItem: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  selected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  timeText: {
    color: '#212529',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  confirmButton: {
    backgroundColor: '#D62828',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
