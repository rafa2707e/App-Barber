import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#1a1c12', '#000']} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
        
        {/* A LOGO VOLTOU AQUI */}
        <Image 
          source={require('../assets/Gemini_Generated_Image_38eda438eda438ed.png')} // Verifique se o nome do arquivo está correto
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.glassCard}>
          <Text style={styles.badge}>SISTEMA OPERACIONAL</Text>
          <Text style={styles.title}>BARBER<Text style={{color: '#4B5320'}}> OPS</Text></Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>IDENTIFICAÇÃO (E-MAIL)</Text>
            <TextInput
              style={styles.input}
              placeholder="operador@missao.com"
              placeholderTextColor="rgba(75, 83, 32, 0.4)"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CHAVE DE ACESSO</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="rgba(75, 83, 32, 0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('MainTabs', { user: { name: email.split('@')[0] || 'Soldado', role: 'client' }})}
          >
            <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>AUTENTICAR ACESSO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20, // Espaço entre a logo e o card
  },
  glassCard: {
    width: width * 0.88,
    padding: 25,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.3)',
    alignItems: 'center',
    shadowColor: "#4B5320",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  badge: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 15 },
  label: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.2)',
  },
  loginButton: { width: '100%', height: 55, marginTop: 15, borderRadius: 12, overflow: 'hidden' },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
});