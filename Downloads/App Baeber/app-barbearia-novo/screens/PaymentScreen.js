import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Animated, SafeAreaView } from 'react-native';

export default function PaymentScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePayment = (method) => {
    if (!amount) {
      Alert.alert('Erro', 'Digite um valor');
      return;
    }
    Alert.alert('Sucesso', `Pagamento de R$ ${amount} realizado com ${method} com sucesso!`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Pagamento</Text>
        <TextInput
          placeholder="Valor (R$)"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={[styles.button, {backgroundColor: '#D62828'}]} onPress={() => handlePayment('Cartão')} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Pagar com Cartão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#007BFF'}]} onPress={() => handlePayment('PIX')} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Pagar com PIX</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#212529',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  button: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
