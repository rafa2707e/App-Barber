import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name,    setName]    = useState(user?.name  || '');
  const [phone,   setPhone]   = useState(user?.phone || '');

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => {
          await logout();
          // Navegação automática — App.js detecta user=null e vai para Login
        },
      },
    ]);
  };

  const handleSave = async () => {
    await updateProfile({ name, phone });
    Alert.alert('Guardado!', 'Perfil actualizado.');
    setEditing(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const isBarber = user?.role === 'barber';

  return (
    <View style={s.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.avatarSection}>
          <LinearGradient colors={['#4B5320', '#2d3314']} style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </LinearGradient>
          <Text style={s.userName}>{user?.name || '—'}</Text>
          <View style={[s.roleBadge, isBarber && s.roleBadgeBarber]}>
            <Text style={s.roleIcon}>{isBarber ? '✂️' : '👤'}</Text>
            <Text style={s.roleText}>{isBarber ? 'BARBEIRO' : 'CLIENTE'}</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>DADOS PESSOAIS</Text>
            <TouchableOpacity onPress={() => setEditing(v => !v)}>
              <Text style={s.editLink}>{editing ? 'Cancelar' : '✏️ Editar'}</Text>
            </TouchableOpacity>
          </View>
          <InfoRow label="NOME"     value={name}        editing={editing} onChange={setName}  />
          <InfoRow label="E-MAIL"   value={user?.email} editing={false}   />
          <InfoRow label="TELEFONE" value={phone}       editing={editing} onChange={setPhone} keyboardType="phone-pad" />
          <InfoRow label="CONTA"    value={isBarber ? 'Barbeiro' : 'Cliente'} editing={false} />
          {editing && (
            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
                <Text style={s.saveBtnText}>GUARDAR ALTERAÇÕES</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>CONTA</Text>
          <ActionRow icon="🔔" label="Notificações" onPress={() => Alert.alert('Em breve', 'A caminho!')} />
          <ActionRow icon="🔒" label="Alterar Senha" onPress={() => Alert.alert('Em breve', 'A caminho!')} />
          <ActionRow icon="📋" label="Termos de Uso" onPress={() => Alert.alert('Termos', 'Termos do Studio Hair.')} />
          <ActionRow icon="🆘" label="Suporte"       onPress={() => Alert.alert('Suporte', 'suporte@studiohair.com')} />
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>🚪  SAIR DA CONTA</Text>
        </TouchableOpacity>

        <Text style={s.version}>Studio Hair v1.0</Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, editing, onChange, keyboardType = 'default' }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      {editing && onChange
        ? <TextInput style={s.infoInput} value={value} onChangeText={onChange} keyboardType={keyboardType} autoCorrect={false} />
        : <Text style={s.infoValue}>{value || '—'}</Text>
      }
    </View>
  );
}

function ActionRow({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={s.actionRow} onPress={onPress}>
      <Text style={s.actionIcon}>{icon}</Text>
      <Text style={s.actionLabel}>{label}</Text>
      <Text style={s.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 55, paddingBottom: 100 },
  avatarSection:   { alignItems: 'center', marginBottom: 24 },
  avatar:          { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText:      { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  userName:        { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  roleBadge:       { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0d1a24', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#1a3a4a' },
  roleBadgeBarber: { backgroundColor: '#1a1f0a', borderColor: '#4B5320' },
  roleIcon:        { fontSize: 12 },
  roleText:        { color: '#6B8E23', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  card:       { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle:  { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2 },
  editLink:   { color: '#6B8E23', fontSize: 12, fontWeight: '600' },
  infoRow:    { borderBottomWidth: 1, borderBottomColor: '#111', paddingVertical: 12 },
  infoLabel:  { color: '#444', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  infoValue:  { color: '#FFF', fontSize: 15 },
  infoInput:  { color: '#FFF', fontSize: 15, borderBottomWidth: 1, borderBottomColor: '#4B5320', paddingBottom: 4 },
  saveBtn:    { height: 48, borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  gradBtn:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  actionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111', gap: 12 },
  actionIcon:  { fontSize: 18, width: 24 },
  actionLabel: { color: '#FFF', flex: 1, fontSize: 14 },
  actionArrow: { color: '#444', fontSize: 20 },
  logoutBtn:  { backgroundColor: '#1a0a0a', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#3a1a1a', marginTop: 8 },
  logoutText: { color: '#8e3a3a', fontWeight: 'bold', fontSize: 14 },
  version:    { color: '#1a1a1a', fontSize: 9, textAlign: 'center', marginTop: 24 },
});