import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Animated } from 'react-native';

export default function PaymentScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePayment = (method) => {
    if (!amount) {
      Alert.alert('Erro', 'Digite um valor');
      return;
    }
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      Alert.alert('Sucesso', `Pagamento de R$ ${amount} realizado com ${method} com sucesso!`);
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Pagamento</Text>
        <TextInput
          placeholder="Valor (R$)"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#FFD700"
        />
        <TouchableOpacity style={styles.button} onPress={() => handlePayment('Cartão')}>
          <Text style={styles.buttonText}>Pagar com Cartão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePayment('PIX')}>
          <Text style={styles.buttonText}>Pagar com PIX</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFD700',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#222',
    color: '#FFD700',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
