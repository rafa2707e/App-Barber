import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, SafeAreaView } from 'react-native';

const services = [
  { id: '1', name: 'Cabelo' },
  { id: '2', name: 'Cabelo + Barba' },
  { id: '3', name: 'Barba' },
  { id: '4', name: 'Sobrancelha' },
];

export default function ServiceSelectionScreen({ navigation, route }) {
  const { selectedDate, selectedTime } = route.params || {};
  const [selectedService, setSelectedService] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelect = (service) => {
    setSelectedService(service);
  };

  const handleConfirm = () => {
    if (!selectedService) {
      Alert.alert('Erro', 'Selecione um tipo de corte');
      return;
    }
    navigation.navigate('Payment', { selectedDate, selectedTime, selectedService });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Text style={styles.title}>Selecione o Serviço</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.serviceItem, selectedService?.id === item.id && styles.selected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.serviceText, selectedService?.id === item.id && styles.selectedText]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    marginBottom: 30,
    textAlign: 'center',
    color: '#212529',
  },
  serviceItem: {
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
  serviceText: {
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
