import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TIMES = ['09:00', '09:30', '10:00', '11:00', '14:00', '15:30', '17:00', '18:00', '19:30'];

export default function TimeSelectionScreen({ navigation, route }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const { selectedDate, barber } = route?.params || {};

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />

      <Text style={styles.badge}>PASSO 3 DE 3</Text>
      <Text style={styles.title}>Horários Disponíveis</Text>
      {selectedDate && (
        <Text style={styles.subtitle}>
          📅 {selectedDate.split('-').reverse().join('/')}
          {barber ? `  ·  ✂️ ${barber.name}` : ''}
        </Text>
      )}

      <FlatList
        data={TIMES}
        numColumns={3}
        keyExtractor={item => item}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.slot, selectedTime === item && styles.slotSelected]}
            onPress={() => setSelectedTime(item)}
          >
            <Text style={[styles.slotText, selectedTime === item && styles.slotTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedTime && (
        <View style={styles.footer}>
          <Text style={styles.selectedInfo}>✅ {selectedTime} selecionado</Text>

          {/* ✅ CORRIGIDO: navega para 'Payment' (nome registado no App.js) 
              e passa todos os dados para o comprovante */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => navigation.navigate('Payment', {
              selectedTime,
              selectedDate,
              barber,
            })}
          >
            <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientBtn}>
              <Text style={styles.confirmText}>CONFIRMAR E PAGAR →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, paddingTop: 60 },
  badge:    { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  title:    { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  subtitle: { color: '#555', fontSize: 13, marginBottom: 24 },

  grid: { paddingBottom: 20 },
  slot: {
    flex: 1, margin: 6, paddingVertical: 16, borderRadius: 12,
    backgroundColor: '#111', alignItems: 'center',
    borderWidth: 1, borderColor: '#222',
  },
  slotSelected: { backgroundColor: '#1a1f0a', borderColor: '#6B8E23' },
  slotText: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  slotTextSelected: { color: '#6B8E23' },

  footer: { marginTop: 10, gap: 12 },
  selectedInfo: { color: '#6B8E23', fontWeight: 'bold', textAlign: 'center', fontSize: 13 },
  confirmBtn: { height: 58, borderRadius: 16, overflow: 'hidden' },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },

  backBtn: { alignSelf: 'center', marginTop: 16, paddingVertical: 8 },
  backText: { color: '#4B5320', fontWeight: 'bold' },
});