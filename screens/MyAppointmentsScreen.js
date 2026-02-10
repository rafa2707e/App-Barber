import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MyAppointmentsScreen() {
  const meusCortes = [
    { id: '1', data: '20/10', hora: '14:30', barbeiro: 'João Silva' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Missões</Text>
      <FlatList
        data={meusCortes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>📅 {item.data} às {item.hora}</Text>
            <Text style={styles.subText}>Barbeiro: {item.barbeiro}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, color: '#6B8E23', fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  card: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#4B5320' },
  text: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  subText: { color: '#888', marginTop: 5 }
});