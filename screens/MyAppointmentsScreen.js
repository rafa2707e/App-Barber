import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

export default function MyAppointmentsScreen({ navigation }) {
  const { user, supabase } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [filter,       setFilter]       = useState('all');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, barber:barber_id ( name, specialty )')
        .eq('client_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (e) {
      console.error('Erro agendamentos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancel = (id) => {
    Alert.alert('Cancelar agendamento', 'Tens a certeza?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Cancelar corte', style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id).eq('client_id', user.id);
          if (!error) fetchAppointments();
          else Alert.alert('Erro', 'Não foi possível cancelar.');
        }
      }
    ]);
  };

  const filtered = filter === 'all' ? appointments
    : filter === 'upcoming' ? appointments.filter(a => a.status === 'upcoming')
    : appointments.filter(a => a.status === 'done');

  const totalGasto    = appointments.filter(a => a.paid).reduce((s, a) => s + Number(a.price), 0);
  const totalCortes   = appointments.filter(a => a.status === 'done').length;
  const totalAgendado = appointments.filter(a => a.status === 'upcoming').length;

  const STATUS_COLOR = { upcoming: '#4B5320', done: '#2a5c2a', cancelled: '#5c2a2a' };
  const STATUS_LABEL = { upcoming: 'Agendado', done: 'Concluído', cancelled: 'Cancelado' };

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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchAppointments(); }}
            tintColor="#6B8E23"
          />
        }
      >
        <Text style={s.title}>Meus Cortes</Text>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statValue}>{totalCortes}</Text>
            <Text style={s.statLabel}>Cortes feitos</Text>
          </View>
          <View style={s.statBox}>
            <Text style={[s.statValue, { color: '#6B8E23' }]}>R${totalGasto}</Text>
            <Text style={s.statLabel}>Total gasto</Text>
          </View>
          <View style={s.statBox}>
            <Text style={[s.statValue, { color: '#4B8E8E' }]}>{totalAgendado}</Text>
            <Text style={s.statLabel}>Agendados</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={s.filters}>
          {[
            { key: 'all',      label: 'Todos'      },
            { key: 'upcoming', label: 'Futuros'    },
            { key: 'done',     label: 'Concluídos' },
          ].map(f => (
            <TouchableOpacity
              key={f.key}
              style={[s.filterBtn, filter === f.key && s.filterActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista */}
        {filtered.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyIcon}>✂️</Text>
            <Text style={s.emptyTitle}>Nenhum agendamento</Text>
            <Text style={s.emptyText}>Agenda o teu primeiro corte!</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('Appointment')}>
              <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
                <Text style={s.emptyBtnText}>AGENDAR AGORA</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : filtered.map(appt => (
          <View key={appt.id} style={[s.card, { borderLeftColor: STATUS_COLOR[appt.status] || '#333' }]}>
            <View style={s.cardTop}>
              <View style={[s.badge, { backgroundColor: (STATUS_COLOR[appt.status] || '#333') + '33' }]}>
                <Text style={[s.badgeText, { color: appt.status === 'cancelled' ? '#e05555' : '#6B8E23' }]}>
                  {STATUS_LABEL[appt.status]}
                </Text>
              </View>
              {appt.status === 'upcoming' && (
                <TouchableOpacity onPress={() => handleCancel(appt.id)}>
                  <Text style={s.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={s.cardService}>{appt.service}</Text>
            <Text style={s.cardBarber}>✂️ {appt.barber?.name || 'Barbeiro'}</Text>

            <View style={s.cardRow}>
              <Text style={s.cardDetail}>📅 {appt.date?.split('-').reverse().join('/')}</Text>
              <Text style={s.cardDetail}>🕐 {appt.time}</Text>
              <Text style={s.cardDetail}>💰 R$ {appt.price}</Text>
            </View>

            <Text style={[s.cardPaid, { color: appt.paid ? '#6B8E23' : '#8E6B23' }]}>
              {appt.paid ? `✅ Pago via ${appt.pay_method}` : '⏳ Pagar no local'}
            </Text>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={s.fabWrap}>
        <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('Appointment')}>
          <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
            <Text style={s.fabText}>+ AGENDAR CORTE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 56 },
  title:     { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  gradBtn:   { flex: 1, justifyContent: 'center', alignItems: 'center' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox:  { flex: 1, backgroundColor: '#0d0d0d', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#555', textAlign: 'center' },

  filters:         { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filterBtn:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#1a1a1a' },
  filterActive:    { backgroundColor: '#4B5320', borderColor: '#6B8E23' },
  filterText:      { color: '#555', fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },

  card:       { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1a1a1a', borderLeftWidth: 3 },
  cardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText:  { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  cancelText: { color: '#8E3A3A', fontSize: 12, fontWeight: 'bold' },
  cardService: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardBarber: { color: '#888', fontSize: 13, marginBottom: 10 },
  cardRow:    { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  cardDetail: { color: '#555', fontSize: 12 },
  cardPaid:   { fontSize: 12, fontWeight: '600' },

  emptyBox:    { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:   { fontSize: 48, marginBottom: 16 },
  emptyTitle:  { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyText:   { color: '#555', fontSize: 13, marginBottom: 24 },
  emptyBtn:    { height: 50, width: 200, borderRadius: 14, overflow: 'hidden' },
  emptyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  fabWrap: { position: 'absolute', bottom: 100, left: 20, right: 20 },
  fab:     { height: 54, borderRadius: 16, overflow: 'hidden' },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
});