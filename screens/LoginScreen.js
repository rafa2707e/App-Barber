import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Instale: npx expo install expo-linear-gradient

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Fundo com degradê tático */}
      <LinearGradient
        colors={['#000000', '#1a1c12', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.glassCard, { opacity: fadeAnim }]}>
        <Text style={styles.badge}>SISTEMA DE ACESSO</Text>
        <Text style={styles.title}>BARBER<Text style={{color: '#4B5320'}}> OPS</Text></Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-MAIL DO OPERADOR</Text>
          <TextInput
            style={styles.input}
            placeholder="soldado@missao.com"
            placeholderTextColor="rgba(75, 83, 32, 0.5)"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CÓDIGO DE SEGURANÇA</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(75, 83, 32, 0.5)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('MainTabs', { user: { name: email.split('@')[0], role: 'client' }})}
        >
          <LinearGradient
            colors={['#4B5320', '#2d3314']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>INICIAR MISSÃO</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  glassCard: {
    width: width * 0.85,
    padding: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.3)',
    alignItems: 'center',
    // Glow sutil
    shadowColor: "#4B5320",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  badge: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 40, letterSpacing: 1 },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.2)',
  },
  loginButton: { width: '100%', height: 55, marginTop: 20, borderRadius: 12, overflow: 'hidden' },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});