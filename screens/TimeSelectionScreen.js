import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Animated, Modal } from 'react-native';

export default function TimeSelectionScreen({ navigation, route }) {
  const { selectedDate } = route.params || {};
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paymentChoiceVisible, setPaymentChoiceVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
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
    setPaymentChoiceVisible(true);
  };

  const handlePayPIX = () => {
    setPaymentChoiceVisible(false);
    const appointment = {
      barber: 'Barbeiro Principal',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      user: 'user@example.com',
      payment: 'pix',
    };
    Alert.alert('Sucesso', `Agendamento confirmado. Pagamento via PIX.`);
    navigation.navigate('Home');
  };

  const handlePayCard = () => {
    setPaymentChoiceVisible(false);
    const appointment = {
      barber: 'Barbeiro Principal',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      user: 'user@example.com',
      payment: 'card',
    };
    Alert.alert('Sucesso', `Agendamento confirmado. Pagamento com cartão.`);
    navigation.navigate('Home');
  };

  const handleClosePaymentChoice = () => {
    setPaymentChoiceVisible(false);
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
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Selecionar Horário</Text>
        <Text style={styles.subtitle}>Data: {selectedDate ? formatDate(selectedDate) : 'Nenhuma data selecionada'}</Text>

        <FlatList
          data={availableTimes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.timeItem, selectedTime === item && styles.selected]}
              onPress={() => {
                Animated.sequence([
                  Animated.timing(fadeAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
                  Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                ]).start(() => handleSelect(item));
              }}
            >
              <Text style={[styles.timeText, selectedTime === item && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => navigation.goBack());
          }}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={paymentChoiceVisible}
        onRequestClose={handleClosePaymentChoice}
      >
        <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Como deseja pagar?</Text>
        <TouchableOpacity style={styles.modalButton} onPress={handlePayPIX}>
          <Text style={styles.modalButtonText}>Pagar com PIX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={handlePayCard}>
          <Text style={styles.modalButtonText}>Pagar com Cartão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClosePaymentChoice}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
      </Modal>
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  timeItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#FFD700',
  },
  timeText: {
    color: '#FFF',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
