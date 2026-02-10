import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Animated } from 'react-native';

export default function PaymentScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handlePayment = (method) => {
    if (!amount) {
      Alert.alert('Erro', 'Digite o valor do serviço');
      return;
    }
    Alert.alert('Sucesso', `Pagamento via ${method} confirmado!`);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>
      
      <TextInput
        placeholder="Valor R$ 0,00"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.button} onPress={() => handlePayment('PIX')}>
        <Text style={styles.buttonText}>Pagar com PIX</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handlePayment('Cartão')}>
        <Text style={styles.buttonText}>Cartão de Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#6B8E23', textAlign: 'center', marginBottom: 30 },
  input: { 
    width: '100%', height: 55, borderColor: '#4B5320', borderWidth: 1, 
    borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, color: '#FFF', backgroundColor: '#1A1A1A' 
  },
  button: { 
    backgroundColor: '#4B5320', width: '100%', height: 55, 
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 10, alignItems: 'center' },
  backButtonText: { color: '#6B8E23', fontWeight: 'bold' }
});