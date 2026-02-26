import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext'; // ← raiz do projecto

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name,  setName]  = useState(user?.name  || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleSave = () => {
    // TODO MongoDB: fetch('PUT /api/users/:id', { name, phone })
    Alert.alert('Guardado!', 'Perfil actualizado com sucesso.');
    setEditing(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const isBarber = user?.role === 'barber';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <View style={[styles.roleBadge, isBarber && styles.roleBadgeBarber]}>
            <Text style={styles.roleIcon}>{isBarber ? '✂️' : '👤'}</Text>
            <Text style={styles.roleText}>{isBarber ? 'BARBEIRO' : 'CLIENTE'}</Text>
          </View>
        </View>

        {/* Dados pessoais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>DADOS PESSOAIS</Text>
            <TouchableOpacity onPress={() => setEditing(v => !v)}>
              <Text style={styles.editLink}>{editing ? 'Cancelar' : '✏️ Editar'}</Text>
            </TouchableOpacity>
          </View>
          <InfoRow label="NOME"          value={name}        editing={editing} onChange={setName}  />
          <InfoRow label="E-MAIL"        value={user?.email} editing={false}   />
          <InfoRow label="TELEFONE"      value={phone}       editing={editing} onChange={setPhone} keyboardType="phone-pad" />
          <InfoRow label="TIPO DE CONTA" value={isBarber ? 'Barbeiro' : 'Cliente'} editing={false} />
          {editing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradBtn}>
                <Text style={styles.saveBtnText}>GUARDAR ALTERAÇÕES</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Estatísticas do cliente */}
        {!isBarber && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>MINHA ACTIVIDADE</Text>
            <View style={styles.statsRow}>
              <StatBox icon="✂️" value="4"    label="Cortes"   />
              <StatBox icon="💰" value="R$215" label="Gasto"    />
              <StatBox icon="⭐" value="4.8"   label="Avaliação" />
            </View>
          </View>
        )}

        {/* Acções */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CONTA</Text>
          <ActionRow icon="🔔" label="Notificações" onPress={() => Alert.alert('Em breve', 'A caminho!')} />
          <ActionRow icon="🔒" label="Alterar Senha" onPress={() => Alert.alert('Em breve', 'A caminho!')} />
          <ActionRow icon="📋" label="Termos de Uso" onPress={() => Alert.alert('Termos', 'Termos do Studio Hair.')} />
          <ActionRow icon="🆘" label="Suporte"       onPress={() => Alert.alert('Suporte', 'suporte@studiohair.com')} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪  SAIR DA CONTA</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Studio Hair v1.0</Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, editing, onChange, keyboardType = 'default' }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {editing && onChange ? (
        <TextInput style={styles.infoInput} value={value} onChangeText={onChange} keyboardType={keyboardType} autoCorrect={false} />
      ) : (
        <Text style={styles.infoValue}>{value || '—'}</Text>
      )}
    </View>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionRow({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 55, paddingBottom: 50 },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar:        { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText:    { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  roleBadge:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0d1a24', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#1a3a4a' },
  roleBadgeBarber: { backgroundColor: '#1a1f0a', borderColor: '#4B5320' },
  roleIcon:      { fontSize: 12 },
  roleText:      { color: '#6B8E23', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  card:       { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle:  { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2 },
  editLink:   { color: '#6B8E23', fontSize: 12, fontWeight: '600' },

  infoRow:   { borderBottomWidth: 1, borderBottomColor: '#111', paddingVertical: 12 },
  infoLabel: { color: '#444', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  infoValue: { color: '#FFF', fontSize: 15 },
  infoInput: { color: '#FFF', fontSize: 15, borderBottomWidth: 1, borderBottomColor: '#4B5320', paddingBottom: 4 },

  saveBtn:     { height: 48, borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  gradBtn:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statBox:  { alignItems: 'center' },
  statIcon:  { fontSize: 22, marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#555', fontSize: 10, marginTop: 2 },

  actionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111', gap: 12 },
  actionIcon:  { fontSize: 18, width: 24 },
  actionLabel: { color: '#FFF', flex: 1, fontSize: 14 },
  actionArrow: { color: '#444', fontSize: 20 },

  logoutBtn:  { backgroundColor: '#1a0a0a', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#3a1a1a', marginTop: 8 },
  logoutText: { color: '#8e3a3a', fontWeight: 'bold', fontSize: 14 },
  version:    { color: '#1a1a1a', fontSize: 9, textAlign: 'center', marginTop: 24 },
});