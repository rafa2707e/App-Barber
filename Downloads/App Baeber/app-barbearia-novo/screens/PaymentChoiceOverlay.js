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
          <TouchableOpacity style={[styles.button, {backgroundColor: '#D62828'}]} onPress={onPayNow} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Pagar com PIX</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: '#007BFF'}]} onPress={onPayAtBarber} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Pagar na Barbearia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#6C757D',
    fontSize: 16,
  },
});
