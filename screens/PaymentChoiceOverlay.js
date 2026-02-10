import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function PaymentChoiceOverlay({ visible, onClose, onPayNow, onPayAtBarber }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Como deseja pagar?</Text>
          <TouchableOpacity style={styles.button} onPress={onPayNow}>
            <Text style={styles.buttonText}>Pagar Agora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPayAtBarber}>
            <Text style={styles.buttonText}>Pagar com o Barbeiro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#111', padding: 30, borderRadius: 20, width: '85%', 
    alignItems: 'center', borderWidth: 1, borderColor: '#4B5320' 
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  button: { backgroundColor: '#4B5320', width: '100%', padding: 15, borderRadius: 10, marginBottom: 10 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  cancelButtonText: { color: '#6B8E23' }
});