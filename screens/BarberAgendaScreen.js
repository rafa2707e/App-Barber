import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function BarberAgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda do Pelotão</Text>
      <Text style={styles.empty}>Nenhum cliente agendado para hoje.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#6B8E23', fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  empty: { color: '#555', textAlign: 'center', marginTop: 50 }
});