import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const APPOINTMENTS = [
  { id: '1', data: '2025-07-15', hora: '14:30', barbeiro: 'João Silva',    servico: 'Degradê',       preco: 45, status: 'upcoming', pago: true,  metodo: 'PIX'    },
  { id: '2', data: '2025-06-28', hora: '10:00', barbeiro: 'Carlos Oliveira', servico: 'Visagismo',   preco: 80, status: 'done',     pago: true,  metodo: 'Cartão' },
  { id: '3', data: '2025-06-10', hora: '09:30', barbeiro: 'Pedro Santos',  servico: 'Corte Simples', preco: 35, status: 'done',     pago: true,  metodo: 'Local'  },
  { id: '4', data: '2025-05-22', hora: '16:00', barbeiro: 'João Silva',    servico: 'Corte + Barba', preco: 55, status: 'done',     pago: true,  metodo: 'PIX'    },
];

const STATUS_CONFIG = {
  upcoming: { label: 'Agendado',   color: '#1a6b8e', bg: '#0a1520', icon: '📅' },
  done:     { label: 'Concluído',  color: '#4B5320', bg: '#1a1f0a', icon: '✅' },
  cancelled:{ label: 'Cancelado',  color: '#8e1a1a', bg: '#1f0a0a', icon: '❌' },
};

export default function MyAppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleCancel = (id) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem a certeza que deseja cancelar este corte?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => setAppointments(prev =>
            prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
          ),
        },
      ]
    );
  };

  const filtered = activeFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === activeFilter);

  const totalGasto = appointments
    .filter(a => a.status === 'done')
    .reduce((s, a) => s + a.preco, 0);

  const formatDate = (d) => d.split('-').reverse().join('/');

  const AppCard = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.done;
    return (
      <View style={[styles.card, { borderLeftColor: cfg.color }]}>
        <View style={styles.cardTop}>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
            <Text style={styles.statusIcon}>{cfg.icon}</Text>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          {item.status === 'upcoming' && (
            <TouchableOpacity onPress={() => handleCancel(item.id)}>
              <Text style={styles.cancelLink}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.serviceName}>{item.servico}</Text>
        <Text style={styles.barberName}>✂️ {item.barbeiro}</Text>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{formatDate(item.data)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏰</Text>
            <Text style={styles.metaText}>{item.hora}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>💰</Text>
            <Text style={styles.metaText}>R$ {item.preco}</Text>
          </View>
        </View>

        <View style={styles.payRow}>
          <Text style={styles.payLabel}>
            {item.pago ? `✅ Pago via ${item.metodo}` : '⏳ Pagamento no local'}
          </Text>
        </View>

        {item.status === 'upcoming' && (
          <TouchableOpacity
            style={styles.rescheduleBtn}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.rescheduleTxt}>🔄 Reagendar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.badge}>MEU HISTÓRICO</Text>
            <Text style={styles.title}>Meus Cortes</Text>

            {/* Resumo */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{appointments.filter(a => a.status === 'done').length}</Text>
                <Text style={styles.summaryLabel}>Cortes feitos</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryValue, { color: '#6B8E23' }]}>R$ {totalGasto}</Text>
                <Text style={styles.summaryLabel}>Total gasto</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryValue, { color: '#1a6b8e' }]}>
                  {appointments.filter(a => a.status === 'upcoming').length}
                </Text>
                <Text style={styles.summaryLabel}>Agendados</Text>
              </View>
            </View>

            {/* Filtros */}
            <View style={styles.filterRow}>
              {[
                { key: 'all',      label: 'Todos' },
                { key: 'upcoming', label: 'Futuros' },
                { key: 'done',     label: 'Concluídos' },
              ].map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.chip, activeFilter === f.key && styles.chipActive]}
                  onPress={() => setActiveFilter(f.key)}
                >
                  <Text style={[styles.chipText, activeFilter === f.key && styles.chipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✂️</Text>
            <Text style={styles.emptyText}>Nenhum corte aqui</Text>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('Appointment')}
            >
              <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.bookBtnGrad}>
                <Text style={styles.bookBtnText}>AGENDAR AGORA</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => <AppCard item={item} />}
        ListFooterComponent={() => (
          filtered.length > 0 ? (
            <TouchableOpacity
              style={styles.newApptBtn}
              onPress={() => navigation.navigate('Appointment')}
            >
              <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.newApptGrad}>
                <Text style={styles.newApptText}>+ NOVO AGENDAMENTO</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  badge: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: '#111', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  summaryValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { color: '#555', fontSize: 9, marginTop: 3 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  chipActive: { backgroundColor: '#4B5320', borderColor: '#6B8E23' },
  chipText: { color: '#555', fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#FFF' },

  card: { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#1a1a1a', borderLeftWidth: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  statusIcon: { fontSize: 11 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  cancelLink: { color: '#8e1a1a', fontSize: 12, fontWeight: '600' },

  serviceName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  barberName: { color: '#666', fontSize: 13, marginBottom: 12 },

  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 12 },
  metaText: { color: '#888', fontSize: 12 },

  payRow: { borderTopWidth: 1, borderTopColor: '#1a1a1a', paddingTop: 10, marginTop: 4 },
  payLabel: { color: '#555', fontSize: 12 },

  rescheduleBtn: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#1a1f0a', borderRadius: 10, borderWidth: 1, borderColor: '#4B5320' },
  rescheduleTxt: { color: '#6B8E23', fontSize: 12, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 16 },
  emptyText: { color: '#444', fontSize: 15, marginBottom: 24 },
  bookBtn: { width: 220, height: 50, borderRadius: 14, overflow: 'hidden' },
  bookBtnGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bookBtnText: { color: '#FFF', fontWeight: 'bold' },

  newApptBtn: { height: 55, borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  newApptGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  newApptText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
});