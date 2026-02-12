import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Comandante, preencha as credenciais.');
      return;
    }
    const mockUser = { email, name: email.split('@')[0], role: email.includes('admin') ? 'barber' : 'client' };
    navigation.replace('MainTabs', { user: mockUser });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={require('../assets/Gemini_Generated_Image_38eda438eda438ed.png')} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.brandName}>STUDIO<Text style={{color: '#4B5320'}}>HAIR</Text></Text>
        <Text style={styles.subtitle}>ELEGÂNCIA E ESTILO</Text>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Email Operacional" style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#555" />
          <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor="#555" />
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
          <Text style={styles.mainButtonText}>INICIAR SESSÃO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <Text style={styles.socialText}>LOGIN VIA GOOGLE</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  logo: { width: 200, height: 200, marginBottom: 10 },
  brandName: { color: '#FFF', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  subtitle: { color: '#4B5320', fontSize: 12, fontWeight: 'bold', marginBottom: 40, letterSpacing: 4 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { width: '100%', height: 55, backgroundColor: '#0A0A0A', borderRadius: 4, paddingHorizontal: 20, color: '#FFF', marginBottom: 15, borderWidth: 1, borderColor: '#4B5320' },
  mainButton: { width: '100%', height: 55, backgroundColor: '#4B5320', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },
  socialButton: { width: '100%', height: 50, borderBottomWidth: 1, borderBottomColor: '#333', justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  socialText: { color: '#888', fontSize: 12, fontWeight: 'bold' }
});