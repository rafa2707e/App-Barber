import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Image, Dimensions, KeyboardAvoidingView,
  Platform, ScrollView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext'; // ← raiz do projecto

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preenche o e-mail e a senha.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      // Redireciona conforme o tipo de conta
      if (user.role === 'barber') {
        navigation.replace('BarberTabs');
      } else {
        navigation.replace('ClientTabs');
      }
    } catch (err) {
      Alert.alert('Erro ao entrar', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#000', '#1a1c12', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>

          <Image
            source={require('../assets/Gemini_Generated_Image_38eda438eda438ed.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.badge}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.title}>STUDIO <Text style={{ color: '#4B5320' }}>HAIR</Text></Text>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#333"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#333"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradBtn}>
                <Text style={styles.btnText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Não tem conta?{' '}
                <Text style={{ color: '#6B8E23', fontWeight: 'bold' }}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

            {/* Contas de teste */}
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>👤  CONTAS DE TESTE</Text>
              <Text style={styles.hintText}>Cliente  →  cliente@studio.com  /  1234</Text>
              <Text style={styles.hintText}>Barbeiro →  barbeiro@studio.com  /  1234</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingVertical: 50 },
  logo: { width: 160, height: 160, marginBottom: 16 },
  card: {
    width: width * 0.9, padding: 26, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(75,83,32,0.3)', alignItems: 'center',
  },
  badge:  { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  title:  { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 28 },
  fieldBox: { width: '100%', marginBottom: 14 },
  label:  { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 7, marginLeft: 4 },
  input:  {
    height: 50, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12,
    paddingHorizontal: 15, color: '#FFF', borderWidth: 1,
    borderColor: 'rgba(75,83,32,0.2)', fontSize: 14,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn:  { padding: 10 },
  eyeIcon: { fontSize: 18 },
  loginBtn: { width: '100%', height: 54, borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  gradBtn:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText:  { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  divider:  { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1a1a1a' },
  dividerText: { color: '#333', marginHorizontal: 12, fontSize: 12 },
  registerText: { color: '#666', fontSize: 14 },
  hintBox: {
    marginTop: 20, backgroundColor: '#0d0d0d', borderRadius: 12,
    padding: 14, width: '100%', borderWidth: 1, borderColor: '#1a1a1a',
  },
  hintTitle: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  hintText:  { color: '#444', fontSize: 11, marginBottom: 3 },
});