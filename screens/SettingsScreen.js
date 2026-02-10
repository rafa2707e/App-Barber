import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.item}>Notificações: ON</Text>
      <Text style={styles.item}>Modo Escuro: Ativado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#6B8E23', fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  item: { color: '#FFF', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' }
});