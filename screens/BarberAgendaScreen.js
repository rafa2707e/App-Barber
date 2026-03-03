import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const FILTERS = ['Todos', 'Agendados', 'Em Andamento', 'Concluídos'];

export default function BarberAgendaScreen() {
  const { user, supabase } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [filter,       setFilter]       = useState('Todos');
  const [tab,          setTab]          = useState('agenda'); // agenda | caixa | stats
  const [stats,        setStats]        = useState({ cortesHoje: 0, cortesMes: 0, recebido: 0, pendente: 0 });

  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    await Promise.all([fetchAppointments(), fetchStats()]);
    setLoading(false);
    setRefreshing(false);
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, client:client_id ( name, phone )')
      .eq('barber_id', user.id)
      .eq('date', today)
      .order('time', { ascending: true });

    if (!error) setAppointments(data || []);
  };

  const fetchStats = async () => {
    const monthStart = today.slice(0, 7) + '-01';

    const [{ count: cortesHoje }, { count: cortesMes }, { data: pagos }, { data: pendentes }] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true })
        .eq('barber_id', user.id).eq('date', today).neq('status', 'cancelled'),
      supabase.from('appointments').select('*', { count: 'exact', head: true })
        .eq('barber_id', user.id).gte('date', monthStart).neq('status', 'cancelled'),
      supabase.from('appointments').select('price')
        .eq('barber_id', user.id).eq('date', today).eq('paid', true),
      supabase.from('appointments').select('price')
        .eq('barber_id', user.id).eq('paid', false).neq('status', 'cancelled'),
    ]);

    const recebido = (pagos || []).reduce((s, a) => s + Number(a.price), 0);
    const pendente = (pendentes || []).reduce((s, a) => s + Number(a.price), 0);

    setStats({ cortesHoje: cortesHoje || 0, cortesMes: cortesMes || 0, recebido, pendente });
  };

  const markDone = async (id) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'done' })
      .eq('id', id).eq('barber_id', user.id);
    if (!error) fetchAll();
  };

  const markPaid = async (id) => {
    Alert.alert('Confirmar pagamento', 'Marcar como pago no local?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar', onPress: async () => {
          const { error } = await supabase
            .from('appointments')
            .update({ paid: true, pay_method: 'Local' })
            .eq('id', id).eq('barber_id', user.id);
          if (!error) fetchAll();
        }
      }
    ]);
  };

  const filtered = filter === 'Todos' ? appointments
    : filter === 'Agendados'     ? appointments.filter(a => a.status === 'upcoming')
    : filter === 'Em Andamento'  ? appointments.filter(a => a.status === 'upcoming' && !a.paid)
    : appointments.filter(a => a.status === 'done');

  const STATUS_COLOR = { upcoming: '#4B5320', done: '#2a5c2a', cancelled: '#5c2a2a' };
  const STATUS_LABEL = { upcoming: 'Marcado', done: 'Concluído', cancelled: 'Cancelado' };

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
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAll(); }} tintColor="#6B8E23" />
        }
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerSub}>PAINEL DO BARBEIRO</Text>
            <Text style={s.headerTitle}>Agenda de Hoje</Text>
            <Text style={s.headerDate}>{todayFormatted}</Text>
          </View>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{user?.name?.[0] || '✂️'}</Text>
          </View>
        </View>

        {/* Stats cards */}
        <View style={s.statsRow}>
          {[
            { icon: '👥', value: stats.cortesHoje, label: 'Clientes'  },
            { icon: '✅', value: stats.cortesMes,  label: 'Este mês'  },
            { icon: '💚', value: `R$${stats.recebido}`, label: 'Recebido' },
            { icon: '⏳', value: `R$${stats.pendente}`, label: 'Pendente' },
          ].map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={s.tabs}>
          {[
            { key: 'agenda', label: '📅 Agenda' },
            { key: 'caixa',  label: '💰 Caixa'  },
            { key: 'stats',  label: '📊 Stats'  },
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

        {/* Filtros de status */}
        {tab === 'agenda' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll}>
              {FILTERS.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[s.filterBtn, filter === f && s.filterActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[s.filterText, filter === f && s.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.clientCount}>{filtered.length} cliente{filtered.length !== 1 ? 's' : ''}</Text>

            {filtered.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyIcon}>📅</Text>
                <Text style={s.emptyTitle}>Sem agendamentos hoje</Text>
                <Text style={s.emptyText}>Quando clientes agendarem aparecem aqui em tempo real.</Text>
              </View>
            ) : filtered.map(appt => (
              <View key={appt.id} style={[s.card, { borderLeftColor: STATUS_COLOR[appt.status] || '#333' }]}>
                <View style={s.cardTop}>
                  <View style={s.cardTimeBox}>
                    <Text style={s.cardTime}>{appt.time}</Text>
                  </View>
                  <View style={s.cardInfo}>
                    <Text style={s.cardName}>{appt.client?.name || 'Cliente'}</Text>
                    <Text style={s.cardService}>{appt.service}</Text>
                    <View style={s.cardRow}>
                      <Text style={s.cardPrice}>💰 R$ {appt.price}</Text>
                      <Text style={[s.cardPaid, { color: appt.paid ? '#6B8E23' : '#8E6B23' }]}>
                        {appt.paid ? `✅ Pago · ${appt.pay_method}` : '⏳ Pagar no local'}
                      </Text>
                    </View>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: (STATUS_COLOR[appt.status] || '#333') + '33' }]}>
                    <Text style={[s.statusText, { color: appt.status === 'done' ? '#6B8E23' : '#8E8E23' }]}>
                      {STATUS_LABEL[appt.status]}
                    </Text>
                  </View>
                </View>

                {/* Acções */}
                {appt.status === 'upcoming' && (
                  <View style={s.actions}>
                    {!appt.paid && (
                      <TouchableOpacity style={s.actionBtnGreen} onPress={() => markPaid(appt.id)}>
                        <Text style={s.actionBtnText}>💵 RECEBER</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={s.actionBtnDark} onPress={() => markDone(appt.id)}>
                      <Text style={s.actionBtnText}>✅ CONCLUIR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {tab === 'caixa' && (
          <View style={s.caixaBox}>
            <Text style={s.caixaTitle}>💰 RESUMO DO DIA</Text>
            {[
              { label: 'Total recebido hoje', value: `R$ ${stats.recebido}`, color: '#6B8E23' },
              { label: 'Pendente de receber', value: `R$ ${stats.pendente}`, color: '#8E8E23' },
              { label: 'Cortes hoje',         value: stats.cortesHoje,       color: '#FFF'    },
              { label: 'Cortes este mês',     value: stats.cortesMes,        color: '#FFF'    },
              { label: 'Total do mês (pago)', value: `R$ ${stats.recebido}`, color: '#6B8E23' },
            ].map(({ label, value, color }) => (
              <View key={label} style={s.caixaRow}>
                <Text style={s.caixaLabel}>{label}</Text>
                <Text style={[s.caixaValue, { color }]}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === 'stats' && (
          <View style={s.statsBox}>
            <Text style={s.statsTitle}>📊 ESTATÍSTICAS</Text>
            <Text style={s.statsComingSoon}>
              Gráficos e estatísticas detalhadas em breve.{'\n'}
              Por agora consulta os dados na aba Caixa.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 56 },

  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerSub:  { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  headerDate: { color: '#555', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#4B5320', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },

  statsRow:  { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard:  { flex: 1, backgroundColor: '#0d0d0d', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  statIcon:  { fontSize: 20, marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { color: '#555', fontSize: 9, textAlign: 'center' },

  tabs:       { flexDirection: 'row', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a' },
  tabBtn:     { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#4B5320' },
  tabText:    { color: '#555', fontSize: 12, fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },

  filtersScroll: { marginBottom: 12 },
  filterBtn:    { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#1a1a1a', marginRight: 8 },
  filterActive: { backgroundColor: '#4B5320', borderColor: '#6B8E23' },
  filterText:   { color: '#555', fontSize: 12, fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },
  clientCount:  { color: '#444', fontSize: 11, marginBottom: 12 },

  card:      { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1a1a1a', borderLeftWidth: 3 },
  cardTop:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTimeBox: { backgroundColor: '#111', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center' },
  cardTime:  { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cardInfo:  { flex: 1 },
  cardName:  { color: '#FFF', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
  cardService: { color: '#888', fontSize: 12, marginBottom: 4 },
  cardRow:   { flexDirection: 'row', gap: 10, alignItems: 'center' },
  cardPrice: { color: '#555', fontSize: 11 },
  cardPaid:  { fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },

  actions:        { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtnGreen: { flex: 1, backgroundColor: '#1a2210', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#4B5320' },
  actionBtnDark:  { flex: 1, backgroundColor: '#111', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  actionBtnText:  { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  emptyBox:   { alignItems: 'center', paddingVertical: 50 },
  emptyIcon:  { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyText:  { color: '#444', fontSize: 12, textAlign: 'center', lineHeight: 18 },

  caixaBox:   { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  caixaTitle: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  caixaRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111' },
  caixaLabel: { color: '#666', fontSize: 13 },
  caixaValue: { fontSize: 15, fontWeight: 'bold' },

  statsBox:      { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1a1a1a', alignItems: 'center' },
  statsTitle:    { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  statsComingSoon: { color: '#444', fontSize: 13, textAlign: 'center', lineHeight: 22 },
});