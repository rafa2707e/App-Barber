import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Dimensions, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ─── Dados simulados (substitua por API/Firebase em produção) ────────────────
const MOCK_APPOINTMENTS = [
  { id: '1', client: 'Rafael Souza',    service: 'Degradê',          time: '09:00', price: 45,  paid: true,  payMethod: 'PIX',    status: 'done'    },
  { id: '2', client: 'Lucas Ferreira',  service: 'Corte + Barba',    time: '10:00', price: 55,  paid: true,  payMethod: 'Cartão', status: 'done'    },
  { id: '3', client: 'Bruno Alves',     service: 'Corte Simples',    time: '11:00', price: 35,  paid: false, payMethod: 'Local',  status: 'pending' },
  { id: '4', client: 'Mateus Costa',    service: 'Visagismo',        time: '14:00', price: 80,  paid: true,  payMethod: 'PIX',    status: 'upcoming'},
  { id: '5', client: 'Davi Lima',       service: 'Barba',            time: '15:30', price: 25,  paid: false, payMethod: 'Local',  status: 'upcoming'},
  { id: '6', client: 'Pedro Nunes',     service: 'Degradê',          time: '17:00', price: 45,  paid: true,  payMethod: 'PIX',    status: 'upcoming'},
];

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

const STATUS_CONFIG = {
  done:     { label: 'Concluído',  color: '#4B5320', bg: '#1a1f0a' },
  pending:  { label: 'Em Analise', color: '#B8860B', bg: '#1a1500' },
  upcoming: { label: 'Marcado',   color: '#1a6b8e', bg: '#0a1520' },
};

export default function BarberAgendaScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('agenda');   // 'agenda' | 'payments' | 'stats'
  const [filter, setFilter] = useState('all');            // 'all' | 'done' | 'upcoming' | 'pending'
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const switchTab = (tab) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  // Métricas financeiras
  const totalRecebido  = MOCK_APPOINTMENTS.filter(a => a.paid).reduce((s, a) => s + a.price, 0);
  const totalPendente  = MOCK_APPOINTMENTS.filter(a => !a.paid).reduce((s, a) => s + a.price, 0);
  const totalCortes    = MOCK_APPOINTMENTS.length;
  const totalConcluido = MOCK_APPOINTMENTS.filter(a => a.status === 'done').length;

  const filteredList = filter === 'all'
    ? MOCK_APPOINTMENTS
    : MOCK_APPOINTMENTS.filter(a => a.status === filter);

  // ─── CARD DE AGENDAMENTO ─────────────────────────────────────────────────
  const AppointmentCard = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={[styles.apptCard, { borderLeftColor: cfg.color }]}>
        <View style={styles.apptTop}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.clientName}>{item.client}</Text>
            <Text style={styles.serviceName}>{item.service}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <View style={styles.apptBottom}>
          <View style={styles.apptMeta}>
            <Text style={styles.metaIcon}>💰</Text>
            <Text style={styles.metaText}>R$ {item.price},00</Text>
          </View>
          <View style={styles.apptMeta}>
            <Text style={styles.metaIcon}>{item.paid ? '✅' : '⏳'}</Text>
            <Text style={[styles.metaText, { color: item.paid ? '#6B8E23' : '#B8860B' }]}>
              {item.paid ? `Pago · ${item.payMethod}` : 'Pagar no local'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ─── ABA: AGENDA ────────────────────────────────────────────────────────
  const renderAgenda = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {[
          { key: 'all',      label: 'Todos' },
          { key: 'upcoming', label: 'Agendados' },
          { key: 'pending',  label: 'Em Andamento' },
          { key: 'done',     label: 'Concluídos' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.listCount}>{filteredList.length} clientes</Text>

      {filteredList.map(item => <AppointmentCard key={item.id} item={item} />)}
    </Animated.View>
  );

  // ─── ABA: PAGAMENTOS ────────────────────────────────────────────────────
  const renderPayments = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Cards de resumo */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderColor: '#4B5320' }]}>
          <Text style={styles.metricLabel}>RECEBIDO</Text>
          <Text style={[styles.metricValue, { color: '#6B8E23' }]}>R$ {totalRecebido}</Text>
          <Text style={styles.metricSub}>hoje</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#B8860B' }]}>
          <Text style={styles.metricLabel}>PENDENTE</Text>
          <Text style={[styles.metricValue, { color: '#B8860B' }]}>R$ {totalPendente}</Text>
          <Text style={styles.metricSub}>a receber</Text>
        </View>
      </View>

      {/* Breakdown por método */}
      <Text style={styles.sectionLabel}>BREAKDOWN POR MÉTODO</Text>

      {['PIX', 'Cartão', 'Local'].map(method => {
        const items = MOCK_APPOINTMENTS.filter(a => a.payMethod === method && a.paid);
        const total = items.reduce((s, a) => s + a.price, 0);
        const pct   = totalRecebido > 0 ? (total / totalRecebido) * 100 : 0;
        const icons = { PIX: '⚡', Cartão: '💳', Local: '🏪' };
        return (
          <View key={method} style={styles.breakdownRow}>
            <Text style={styles.breakdownIcon}>{icons[method]}</Text>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={styles.breakdownLabel}>{method}</Text>
                <Text style={styles.breakdownValue}>R$ {total}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
            </View>
            <Text style={styles.breakdownPct}>{Math.round(pct)}%</Text>
          </View>
        );
      })}

      {/* Lista de transações */}
      <Text style={styles.sectionLabel}>TRANSAÇÕES DO DIA</Text>
      {MOCK_APPOINTMENTS.filter(a => a.paid).map(item => (
        <View key={item.id} style={styles.txRow}>
          <View>
            <Text style={styles.txClient}>{item.client}</Text>
            <Text style={styles.txService}>{item.service} · {item.time}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>+ R$ {item.price}</Text>
            <Text style={styles.txMethod}>{item.payMethod}</Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  // ─── ABA: STATS ─────────────────────────────────────────────────────────
  const renderStats = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.statsGrid}>
        {[
          { label: 'Total Cortes',  value: totalCortes,    icon: '✂️',  color: '#6B8E23' },
          { label: 'Concluídos',    value: totalConcluido, icon: '✅',  color: '#4B5320' },
          { label: 'Faturamento',   value: `R$${totalRecebido}`, icon: '💰', color: '#B8860B' },
          { label: 'Ticket Médio',  value: `R$${Math.round(totalRecebido / (totalConcluido || 1))}`, icon: '📊', color: '#1a6b8e' },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, { borderColor: s.color }]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>SERVIÇOS MAIS PEDIDOS</Text>
      {['Degradê', 'Corte + Barba', 'Corte Simples', 'Visagismo', 'Barba'].map((s, i) => {
        const count = MOCK_APPOINTMENTS.filter(a => a.service === s).length;
        const pct   = (count / totalCortes) * 100;
        return count > 0 ? (
          <View key={s} style={styles.serviceStatRow}>
            <Text style={styles.serviceStatName}>{s}</Text>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: '#4B5320' }]} />
              </View>
            </View>
            <Text style={styles.serviceStatCount}>{count}x</Text>
          </View>
        ) : null;
      })}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerBadge}>PAINEL DO BARBEIRO</Text>
            <Text style={styles.headerTitle}>Agenda de Hoje</Text>
            <Text style={styles.headerDate}>{TODAY}</Text>
          </View>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>✂️</Text>
          </View>
        </View>

        {/* MINI CARDS TOPO */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {[
            { icon: '👥', value: totalCortes,    label: 'Clientes' },
            { icon: '✅', value: totalConcluido, label: 'Concluídos' },
            { icon: '💚', value: `R$${totalRecebido}`, label: 'Recebido' },
            { icon: '⏳', value: `R$${totalPendente}`, label: 'Pendente' },
          ].map((c, i) => (
            <View key={i} style={styles.miniCard}>
              <Text style={styles.miniIcon}>{c.icon}</Text>
              <Text style={styles.miniValue}>{c.value}</Text>
              <Text style={styles.miniLabel}>{c.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* TABS */}
        <View style={styles.tabBar}>
          {[
            { key: 'agenda',   label: '📅 Agenda' },
            { key: 'payments', label: '💰 Caixa' },
            { key: 'stats',    label: '📊 Stats' },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => switchTab(t.key)}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'agenda'   && renderAgenda()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'stats'    && renderStats()}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerBadge: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginTop: 2 },
  headerDate: { color: '#555', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  avatarBox: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#111', borderWidth: 1, borderColor: '#4B5320', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22 },

  miniCard: { backgroundColor: '#111', borderRadius: 14, padding: 14, marginRight: 10, alignItems: 'center', minWidth: 85, borderWidth: 1, borderColor: '#1a1a1a' },
  miniIcon: { fontSize: 20, marginBottom: 4 },
  miniValue: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  miniLabel: { color: '#555', fontSize: 9, marginTop: 2 },

  tabBar: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 16, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#4B5320' },
  tabText: { color: '#555', fontWeight: 'bold', fontSize: 12 },
  tabTextActive: { color: '#FFF' },

  // Filtros
  filterRow: { marginBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#111', marginRight: 8, borderWidth: 1, borderColor: '#222' },
  filterChipActive: { backgroundColor: '#4B5320', borderColor: '#6B8E23' },
  filterText: { color: '#555', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  listCount: { color: '#444', fontSize: 11, marginBottom: 12 },

  // Appointment card
  apptCard: { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 16, marginBottom: 10, borderLeftWidth: 3, borderWidth: 1, borderColor: '#1a1a1a' },
  apptTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  timeBox: { backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  timeText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  clientName: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  serviceName: { color: '#666', fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  apptBottom: { flexDirection: 'row', gap: 16 },
  apptMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 12 },
  metaText: { color: '#666', fontSize: 12 },

  // Payments
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metricCard: { flex: 1, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, borderWidth: 1 },
  metricLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  metricValue: { fontSize: 26, fontWeight: 'bold', marginTop: 4 },
  metricSub: { color: '#444', fontSize: 10, marginTop: 2 },
  sectionLabel: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 14, marginTop: 8 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  breakdownIcon: { fontSize: 18 },
  breakdownLabel: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  breakdownValue: { color: '#6B8E23', fontWeight: 'bold' },
  breakdownPct: { color: '#555', fontSize: 11, width: 35, textAlign: 'right' },
  barBg: { height: 6, backgroundColor: '#1a1a1a', borderRadius: 3 },
  barFill: { height: 6, backgroundColor: '#6B8E23', borderRadius: 3 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111' },
  txClient: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  txService: { color: '#555', fontSize: 11, marginTop: 2 },
  txAmount: { color: '#6B8E23', fontWeight: 'bold', fontSize: 16 },
  txMethod: { color: '#444', fontSize: 10, marginTop: 2 },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { width: (width - 52) / 2, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 1 },
  statIcon: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#555', fontSize: 10, marginTop: 4 },
  serviceStatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  serviceStatName: { color: '#FFF', fontSize: 13, width: 110 },
  serviceStatCount: { color: '#6B8E23', fontWeight: 'bold', width: 30, textAlign: 'right' },
});