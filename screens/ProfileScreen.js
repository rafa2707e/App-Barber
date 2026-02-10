import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.name}>Recruta Usuário</Text>
      </View>
      <TouchableOpacity style={styles.button}><Text style={styles.btnText}>Editar Perfil</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { alignItems: 'center', marginTop: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4B5320' },
  name: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  button: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  btnText: { color: '#6B8E23', fontWeight: 'bold' }
});