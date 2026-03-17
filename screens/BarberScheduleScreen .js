import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Switch, ActivityIndicator, RefreshControl, Modal, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const TIMES = [
  '09:00','09:30','10:00','11:00',
  '14:00','15:30','17:00','18:00','19:30'
];

const WEEKDAYS = [
  { key: 0, label: 'Dom' }, { key: 1, label: 'Seg' },
  { key: 2, label: 'Ter' }, { key: 3, label: 'Qua' },
  { key: 4, label: 'Qui' }, { key: 5, label: 'Sex' },
  { key: 6, label: 'Sáb' },
];

export default function BarberScheduleScreen() {
  const { user, supabase } = useAuth();

  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [isOpen,        setIsOpen]        = useState(true);
  const [blockedTimes,  setBlockedTimes]  = useState([]); // horários sempre bloqueados
  const [blockedDates,  setBlockedDates]  = useState([]); // datas específicas bloqueadas
  const [tab,           setTab]           = useState('status'); // status | times | dates
  const [modalVisible,  setModalVisible]  = useState(false);
  const [newDate,       setNewDate]       = useState('');
  const [newReason,     setNewReason]     = useState('');
  const [saving,        setSaving]        = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('*')
        .eq('barber_id', user.id);

      if (error) throw error;

      const closed  = data.find(d => d.type === 'closed');
      const times   = data.filter(d => d.type === 'time').map(d => d.time);
      const dates   = data.filter(d => d.type === 'day');

      setIsOpen(!closed);
      setBlockedTimes(times);
      setBlockedDates(dates);
    } catch (e) {
      console.error('Erro ao buscar bloqueios:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ── Abrir / Fechar barbearia ─────────────────────────────────────────────
  const toggleOpen = async (val) => {
    setSaving(true);
    try {
      if (val) {
        // Abrir — remove o registo 'closed'
        await supabase
          .from('blocked_slots')
          .delete()
          .eq('barber_id', user.id)
          .eq('type', 'closed');
      } else {
        // Fechar — insere registo 'closed'
        await supabase.from('blocked_slots').upsert({
          barber_id: user.id,
          type:      'closed',
          reason:    'Barbearia fechada',
        });
      }
      setIsOpen(val);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Bloquear / Desbloquear horário fixo ─────────────────────────────────
  const toggleTime = async (time) => {
    setSaving(true);
    try {
      const isBlocked = blockedTimes.includes(time);
      if (isBlocked) {
        await supabase
          .from('blocked_slots')
          .delete()
          .eq('barber_id', user.id)
          .eq('type', 'time')
          .eq('time', time);
        setBlockedTimes(prev => prev.filter(t => t !== time));
      } else {
        await supabase.from('blocked_slots').insert({
          barber_id: user.id,
          type:      'time',
          time,
          reason:    'Bloqueado',
        });
        setBlockedTimes(prev => [...prev, time]);
      }
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Bloquear data específica ─────────────────────────────────────────────
  const addBlockedDate = async () => {
    if (!newDate.trim()) return Alert.alert('Atenção', 'Informe a data.');

    // Valida formato DD/MM/AAAA
    const parts = newDate.split('/');
    if (parts.length !== 3) return Alert.alert('Atenção', 'Use o formato DD/MM/AAAA');
    const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('blocked_slots')
        .insert({
          barber_id: user.id,
          type:      'day',
          date:      iso,
          reason:    newReason || 'Folga',
        })
        .select()
        .single();

      if (error) throw error;
      setBlockedDates(prev => [...prev, data]);
      setModalVisible(false);
      setNewDate('');
      setNewReason('');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSaving(false);
    }
  };

  const removeBlockedDate = (id) => {
    Alert.alert('Remover bloqueio', 'Desbloquear este dia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          await supabase.from('blocked_slots').delete().eq('id', id);
          setBlockedDates(prev => prev.filter(d => d.id !== id));
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#6B8E23" size="large" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAll(); }} tintColor="#6B8E23" />}
      >
        {/* Header */}
        <Text style={s.headerSub}>GESTÃO DA AGENDA</Text>
        <Text style={s.headerTitle}>Disponibilidade ⚙️</Text>

        {/* Status atual */}
        <View style={[s.statusCard, { borderColor: isOpen ? '#4B5320' : '#5c2a2a' }]}>
          <LinearGradient
            colors={isOpen ? ['#0d1208', '#000'] : ['#1a0808', '#000']}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
          <View style={s.statusLeft}>
            <Text style={s.statusIcon}>{isOpen ? '🟢' : '🔴'}</Text>
            <View>
              <Text style={s.statusTitle}>
                {isOpen ? 'Barbearia Aberta' : 'Barbearia Fechada'}
              </Text>
              <Text style={s.statusSub}>
                {isOpen
                  ? 'Clientes podem agendar normalmente'
                  : 'Nenhum agendamento é possível agora'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOpen}
            onValueChange={toggleOpen}
            trackColor={{ false: '#3a1a1a', true: '#4B5320' }}
            thumbColor={isOpen ? '#6B8E23' : '#8E3a3a'}
            disabled={saving}
          />
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          {[
            { key: 'status', label: '🟢 Status'   },
            { key: 'times',  label: '⏰ Horários'  },
            { key: 'dates',  label: '📅 Dias'      },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.tabBtn, tab === t.key && s.tabBtnActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── STATUS ── */}
        {tab === 'status' && (
          <View>
            <Text style={s.sectionLabel}>RESUMO DOS BLOQUEIOS</Text>
            {[
              { icon: isOpen ? '✅' : '🔴', label: 'Estado actual',       value: isOpen ? 'Aberto' : 'Fechado'              },
              { icon: '⏰',                  label: 'Horários bloqueados',  value: `${blockedTimes.length} horário(s)`        },
              { icon: '📅',                  label: 'Dias bloqueados',      value: `${blockedDates.length} dia(s)`            },
            ].map(({ icon, label, value }) => (
              <View key={label} style={s.summaryRow}>
                <Text style={s.summaryIcon}>{icon}</Text>
                <Text style={s.summaryLabel}>{label}</Text>
                <Text style={s.summaryValue}>{value}</Text>
              </View>
            ))}

            <View style={s.tipBox}>
              <Text style={s.tipTitle}>💡 COMO FUNCIONA</Text>
              <Text style={s.tipText}>• <Text style={{ color: '#FFF' }}>Fechar barbearia</Text> — nenhum cliente consegue agendar</Text>
              <Text style={s.tipText}>• <Text style={{ color: '#FFF' }}>Bloquear horários</Text> — horários como almoço ficam indisponíveis todos os dias</Text>
              <Text style={s.tipText}>• <Text style={{ color: '#FFF' }}>Bloquear dias</Text> — folgas, feriados ou férias específicas</Text>
            </View>
          </View>
        )}

        {/* ── HORÁRIOS ── */}
        {tab === 'times' && (
          <View>
            <Text style={s.sectionLabel}>BLOQUEAR HORÁRIOS FIXOS</Text>
            <Text style={s.sectionSub}>Horários bloqueados ficam indisponíveis todos os dias</Text>
            <View style={s.slotsGrid}>
              {TIMES.map(time => {
                const blocked = blockedTimes.includes(time);
                return (
                  <TouchableOpacity
                    key={time}
                    style={[s.slot, blocked && s.slotBlocked]}
                    onPress={() => toggleTime(time)}
                    disabled={saving}
                  >
                    {blocked && (
                      <LinearGradient colors={['#1a0808','#000']} style={[StyleSheet.absoluteFill,{borderRadius:12}]} />
                    )}
                    <Text style={[s.slotTime, blocked && s.slotTimeBlocked]}>{time}</Text>
                    <Text style={s.slotIcon}>{blocked ? '🔒' : '✓'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {blockedTimes.length > 0 && (
              <View style={s.blockedList}>
                <Text style={s.sectionLabel}>HORÁRIOS BLOQUEADOS</Text>
                {blockedTimes.map(time => (
                  <View key={time} style={s.blockedRow}>
                    <Text style={s.blockedIcon}>🔒</Text>
                    <Text style={s.blockedTime}>{time}</Text>
                    <Text style={s.blockedReason}>Bloqueado todos os dias</Text>
                    <TouchableOpacity onPress={() => toggleTime(time)}>
                      <Text style={s.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── DIAS ── */}
        {tab === 'dates' && (
          <View>
            <Text style={s.sectionLabel}>DIAS BLOQUEADOS</Text>
            <Text style={s.sectionSub}>Folgas, feriados ou férias específicas</Text>

            <TouchableOpacity style={s.addBtn} onPress={() => setModalVisible(true)}>
              <LinearGradient colors={['#4B5320','#2d3314']} style={s.addBtnGrad}>
                <Text style={s.addBtnText}>+ BLOQUEAR DIA</Text>
              </LinearGradient>
            </TouchableOpacity>

            {blockedDates.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyIcon}>📅</Text>
                <Text style={s.emptyText}>Nenhum dia bloqueado</Text>
              </View>
            ) : blockedDates.map(item => (
              <View key={item.id} style={s.dateCard}>
                <View style={s.dateLeft}>
                  <Text style={s.dateIcon}>📅</Text>
                  <View>
                    <Text style={s.dateValue}>
                      {item.date?.split('-').reverse().join('/')}
                    </Text>
                    <Text style={s.dateReason}>{item.reason || 'Folga'}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeBlockedDate(item.id)} style={s.removeDateBtn}>
                  <Text style={s.removeDateText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Modal — adicionar dia bloqueado */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <LinearGradient colors={['#0d0d0d','#000']} style={StyleSheet.absoluteFill} borderRadius={20} />
            <Text style={s.modalTitle}>📅 Bloquear Dia</Text>

            <Text style={s.fieldLabel}>DATA (DD/MM/AAAA)</Text>
            <TextInput
              style={s.fieldInput}
              placeholder="Ex: 25/12/2026"
              placeholderTextColor="#333"
              value={newDate}
              onChangeText={setNewDate}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={s.fieldLabel}>MOTIVO</Text>
            <TextInput
              style={s.fieldInput}
              placeholder="Ex: Folga, Feriado, Férias..."
              placeholderTextColor="#333"
              value={newReason}
              onChangeText={setNewReason}
            />

            {/* Sugestões rápidas */}
            <View style={s.suggRow}>
              {['Folga', 'Feriado', 'Férias', 'Almoço'].map(r => (
                <TouchableOpacity key={r} style={s.suggBtn} onPress={() => setNewReason(r)}>
                  <Text style={s.suggText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancelBtn} onPress={() => { setModalVisible(false); setNewDate(''); setNewReason(''); }}>
                <Text style={s.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirmBtn} onPress={addBlockedDate} disabled={saving}>
                <LinearGradient colors={['#4B5320','#2d3314']} style={s.modalConfirmGrad}>
                  {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={s.modalConfirmText}>BLOQUEAR</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 56 },

  headerSub:   { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },

  statusCard:  { borderRadius: 18, padding: 18, marginBottom: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' },
  statusLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusIcon:  { fontSize: 28 },
  statusTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  statusSub:   { color: '#555', fontSize: 11 },

  tabs:         { flexDirection: 'row', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  tabBtn:       { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#4B5320' },
  tabText:      { color: '#555', fontSize: 11, fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },

  sectionLabel: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  sectionSub:   { color: '#444', fontSize: 11, marginBottom: 16 },

  summaryRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1a1a1a', gap: 12 },
  summaryIcon:  { fontSize: 20 },
  summaryLabel: { color: '#555', fontSize: 12, flex: 1 },
  summaryValue: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  tipBox:   { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#1a2210' },
  tipTitle: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 },
  tipText:  { color: '#444', fontSize: 12, lineHeight: 22 },

  slotsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  slot:            { width: '30%', paddingVertical: 16, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', borderWidth: 1, borderColor: '#1d1d1d', overflow: 'hidden', position: 'relative' },
  slotBlocked:     { borderColor: '#3a1a1a' },
  slotTime:        { color: '#777', fontWeight: 'bold', fontSize: 15 },
  slotTimeBlocked: { color: '#3a1a1a' },
  slotIcon:        { fontSize: 10, marginTop: 4, color: '#4B5320' },

  blockedList: { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  blockedRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#111', gap: 10 },
  blockedIcon: { fontSize: 16 },
  blockedTime: { color: '#FFF', fontWeight: 'bold', fontSize: 14, flex: 1 },
  blockedReason: { color: '#444', fontSize: 11 },
  removeBtn:   { color: '#5c2a2a', fontSize: 16, fontWeight: 'bold', padding: 4 },

  addBtn:    { height: 50, borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  addBtnGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },

  emptyBox:  { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { color: '#444', fontSize: 13 },

  dateCard:      { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1a1a1a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateLeft:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateIcon:      { fontSize: 22 },
  dateValue:     { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  dateReason:    { color: '#555', fontSize: 11, marginTop: 2 },
  removeDateBtn: { padding: 8 },
  removeDateText: { color: '#5c2a2a', fontSize: 18, fontWeight: 'bold' },

  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox:       { borderRadius: 20, padding: 24, margin: 16, borderWidth: 1, borderColor: '#1a2210', overflow: 'hidden' },
  modalTitle:     { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  fieldLabel:     { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  fieldInput:     { backgroundColor: '#111', borderRadius: 12, padding: 14, color: '#FFF', borderWidth: 1, borderColor: '#1a1a1a', fontSize: 14, marginBottom: 14 },
  suggRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  suggBtn:        { backgroundColor: '#1a2210', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#4B5320' },
  suggText:       { color: '#6B8E23', fontSize: 12, fontWeight: 'bold' },
  modalBtns:      { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  modalCancelText: { color: '#555', fontWeight: 'bold' },
  modalConfirmBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  modalConfirmGrad: { padding: 16, alignItems: 'center' },
  modalConfirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});