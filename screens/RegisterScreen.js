import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Alert, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext'; // ← raiz do projecto

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [role,      setRole]      = useState('client');
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleRegister = async () => {
    if (!name.trim())        return Alert.alert('Atenção', 'Informe o seu nome.');
    if (!email.trim())       return Alert.alert('Atenção', 'Informe o seu e-mail.');
    if (!phone.trim())       return Alert.alert('Atenção', 'Informe o seu telefone.');
    if (password.length < 4) return Alert.alert('Atenção', 'Senha mínimo 4 caracteres.');
    if (password !== confirm) return Alert.alert('Atenção', 'As senhas não coincidem.');
    if (role === 'barber' && !specialty.trim())
      return Alert.alert('Atenção', 'Informe a sua especialidade.');

    setLoading(true);
    try {
      const user = await register({ name: name.trim(), email: email.trim(), password, role, phone: phone.trim(), specialty });
      if (user.role === 'barber') {
        navigation.replace('BarberTabs');
      } else {
        navigation.replace('ClientTabs');
      }
    } catch (err) {
      Alert.alert('Erro no cadastro', err.message);
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

          <Text style={styles.badge}>STUDIO HAIR</Text>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao pelotão</Text>

          {/* Selector de tipo de conta */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'client' && styles.roleBtnActive]}
              onPress={() => setRole('client')}
            >
              <Text style={styles.roleIcon}>👤</Text>
              <Text style={[styles.roleLabel, role === 'client' && styles.roleLabelActive]}>Cliente</Text>
              <Text style={styles.roleDesc}>Quero agendar cortes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'barber' && styles.roleBtnActive]}
              onPress={() => setRole('barber')}
            >
              <Text style={styles.roleIcon}>✂️</Text>
              <Text style={[styles.roleLabel, role === 'barber' && styles.roleLabelActive]}>Barbeiro</Text>
              <Text style={styles.roleDesc}>Quero gerir agenda</Text>
            </TouchableOpacity>
          </View>

          {/* Campos */}
          <View style={styles.form}>
            <Field label="NOME COMPLETO"  value={name}  onChange={setName}  placeholder="Seu nome completo" />
            <Field label="E-MAIL"         value={email} onChange={setEmail} placeholder="seu@email.com"
              keyboardType="email-address" autoCapitalize="none" />
            <Field label="TELEFONE"       value={phone} onChange={setPhone} placeholder="(11) 99999-9999"
              keyboardType="phone-pad" />

            {role === 'barber' && (
              <Field label="ESPECIALIDADE" value={specialty} onChange={setSpecialty}
                placeholder="Ex: Degradê, Barba, Visagismo..." />
            )}

            <View style={styles.fieldBox}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.passRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mínimo 4 caracteres"
                  placeholderTextColor="#333"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                  <Text>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={[styles.input, confirm && confirm !== password && { borderColor: '#8e1a1a' }]}
                placeholder="Repita a senha"
                placeholderTextColor="#333"
                secureTextEntry={!showPass}
                value={confirm}
                onChangeText={setConfirm}
              />
              {confirm !== '' && confirm !== password && (
                <Text style={styles.errorText}>As senhas não coincidem</Text>
              )}
            </View>

            <Text style={styles.termsText}>
              Ao cadastrar-se, aceita os{' '}
              <Text style={{ color: '#6B8E23' }}>Termos de Uso</Text>
              {' '}e{' '}
              <Text style={{ color: '#6B8E23' }}>Política de Privacidade</Text>.
            </Text>

            <TouchableOpacity
              style={[styles.registerBtn, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradBtn}>
                <Text style={styles.registerBtnText}>
                  {loading ? 'CRIANDO CONTA...' : `CRIAR CONTA ${role === 'barber' ? '✂️' : '👤'}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
              <Text style={styles.backLinkText}>
                Já tem conta?{' '}
                <Text style={{ color: '#6B8E23', fontWeight: 'bold' }}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType = 'default', autoCapitalize = 'words' }) {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#333"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll:   { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 60, paddingBottom: 50 },
  badge:    { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  title:    { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  subtitle: { color: '#444', fontSize: 13, marginBottom: 28, marginTop: 4 },

  roleRow: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 24 },
  roleBtn: {
    flex: 1, backgroundColor: '#0d0d0d', borderRadius: 18, padding: 18,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#1a1a1a',
  },
  roleBtnActive:   { borderColor: '#6B8E23', backgroundColor: '#1a1f0a' },
  roleIcon:        { fontSize: 28, marginBottom: 8 },
  roleLabel:       { color: '#666', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  roleLabelActive: { color: '#FFF' },
  roleDesc:        { color: '#333', fontSize: 10, textAlign: 'center' },

  form:     { width: '100%' },
  fieldBox: { marginBottom: 14 },
  label:    { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 7, marginLeft: 4 },
  input:    {
    height: 50, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12,
    paddingHorizontal: 15, color: '#FFF', borderWidth: 1,
    borderColor: 'rgba(75,83,32,0.2)', fontSize: 14,
  },
  passRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn:     { padding: 10 },
  errorText:  { color: '#8e1a1a', fontSize: 11, marginTop: 5, marginLeft: 4 },
  termsText:  { color: '#444', fontSize: 11, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  registerBtn: { height: 56, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  gradBtn:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  registerBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  backLink:    { alignItems: 'center', paddingVertical: 8 },
  backLinkText: { color: '#666', fontSize: 14 },
});