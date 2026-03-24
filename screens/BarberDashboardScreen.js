
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width - 48 - 120 - 40;

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function BarberDashboardScreen() {
  const { user, supabase } = useAuth();
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [metrics,      setMetrics]      = useState(null);
  const [monthlyData,  setMonthlyData]  = useState([]);
  const [services,     setServices]     = useState([]);
  const [payments,     setPayments]     = useState({ PIX: 0, Local: 0, Cartao: 0 });
  const [period,       setPeriod]       = useState('mes'); // mes | semana | ano

  const today      = new Date();
  const monthStart = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-01`;
  const weekStart  = new Date(today); weekStart.setDate(today.getDate() - 7);
  const yearStart  = `${today.getFullYear()}-01-01`;

  useEffect(() => { fetchAll(); }, [period]);

  const fetchAll = async () => {
    try {
      const dateFrom = period === 'semana'
        ? weekStart.toISOString().split('T')[0]
        : period === 'ano' ? yearStart : monthStart;

      const { data: appts, error } = await supabase
        .from('appointments')
        .select('service, price, paid, pay_method, date, status')
        .eq('barber_id', user.id)
        .gte('date', dateFrom)
        .neq('status', 'cancelled');

      if (error) throw error;

      // ── Métricas principais ─────────────────────────────────────────────
      const total       = appts.length;
      const ganhos      = appts.filter(a => a.paid).reduce((s, a) => s + Number(a.price), 0);
      const pendente    = appts.filter(a => !a.paid).reduce((s, a) => s + Number(a.price), 0);
      const ticketMedio = total > 0 ? Math.round(ganhos / total) : 0;

      // Cortes hoje
      const todayStr  = today.toISOString().split('T')[0];
      const hoje      = appts.filter(a => a.date === todayStr).length;

      // Taxa de ocupação (horários disponíveis por dia * dias do período)
      const diasPeriodo = period === 'semana' ? 7 : period === 'mes' ? 30 : 365;
      const slotsTotal  = diasPeriodo * 9; // 9 horários por dia
      const ocupacao    = slotsTotal > 0 ? Math.min(100, Math.round((total / slotsTotal) * 100)) : 0;

      setMetrics({ total, ganhos, pendente, ticketMedio, hoje, ocupacao });

      // ── Serviços mais pedidos ───────────────────────────────────────────
      const svcMap = {};
      appts.forEach(a => {
        svcMap[a.service] = (svcMap[a.service] || 0) + 1;
      });
      const svcList = Object.entries(svcMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setServices(svcList);

      // ── Métodos de pagamento ────────────────────────────────────────────
      const pmMap = { PIX: 0, Local: 0, Cartao: 0 };
      appts.filter(a => a.paid).forEach(a => {
        const pm = a.pay_method || 'Local';
        pmMap[pm] = (pmMap[pm] || 0) + 1;
      });
      setPayments(pmMap);

      // ── Dados mensais (últimos 6 meses) ─────────────────────────────────
      await fetchMonthly();

    } catch (e) {
      console.error('Dashboard error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMonthly = async () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d     = new Date();
      d.setMonth(d.getMonth() - i);
      const year  = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const from  = `${year}-${month}-01`;
      const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
      const to    = `${year}-${month}-${lastDay}`;

      const { data } = await supabase
        .from('appointments')
        .select('price, paid')
        .eq('barber_id', user.id)
        .gte('date', from)
        .lte('date', to)
        .neq('status', 'cancelled');

      const ganhos = (data || []).filter(a => a.paid).reduce((s, a) => s + Number(a.price), 0);
      const cortes = (data || []).length;
      months.push({ label: MONTHS[d.getMonth()], ganhos, cortes });
    }
    setMonthlyData(months);
  };

  const maxGanhos = Math.max(...monthlyData.map(m => m.ganhos), 1);

  const pmTotal = Object.values(payments).reduce((s, v) => s + v, 0) || 1;
  const pmPct   = (key) => Math.round((payments[key] / pmTotal) * 100);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#6B8E23" size="large" />
        <Text style={{ color: '#4B5320', marginTop: 12, fontSize: 11, letterSpacing: 2 }}>CARREGANDO DASHBOARD</Text>
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
        <Text style={s.headerSub}>PAINEL FINANCEIRO</Text>
        <Text style={s.headerTitle}>Dashboard 📊</Text>

        {/* Selector de período */}
        <View style={s.periodRow}>
          {[
            { key: 'semana', label: '7 dias'  },
            { key: 'mes',    label: 'Mês'     },
            { key: 'ano',    label: 'Ano'     },
          ].map(p => (
            <TouchableOpacity
              key={p.key}
              style={[s.periodBtn, period === p.key && s.periodBtnActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[s.periodText, period === p.key && s.periodTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Cards de métricas ── */}
        <View style={s.metricsGrid}>
          <MetricCard
            label="Ganhos"
            value={`R$ ${metrics?.ganhos?.toLocaleString('pt-BR') || 0}`}
            sub={`R$ ${metrics?.pendente || 0} pendente`}
            color="#6B8E23"
          />
          <MetricCard
            label="Cortes"
            value={metrics?.total || 0}
            sub={`${metrics?.hoje || 0} hoje`}
            color="#4B8E8E"
          />
          <MetricCard
            label="Ticket médio"
            value={`R$ ${metrics?.ticketMedio || 0}`}
            sub="por corte"
            color="#8E7A4B"
          />
          <MetricCard
            label="Ocupação"
            value={`${metrics?.ocupacao || 0}%`}
            sub="dos horários"
            color="#8E4B8E"
          />
        </View>

        {/* ── Gráfico de barras — últimos 6 meses ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>GANHOS — ÚLTIMOS 6 MESES</Text>
          <View style={s.chartArea}>
            {monthlyData.map((m, i) => {
              const barH = maxGanhos > 0 ? Math.max(4, (m.ganhos / maxGanhos) * 120) : 4;
              const isLast = i === monthlyData.length - 1;
              return (
                <View key={i} style={s.chartCol}>
                  <Text style={[s.chartValue, isLast && { color: '#6B8E23' }]}>
                    {m.ganhos >= 1000 ? `${(m.ganhos/1000).toFixed(1)}k` : m.ganhos}
                  </Text>
                  <View style={s.chartBarBg}>
                    <LinearGradient
                      colors={isLast ? ['#6B8E23', '#4B5320'] : ['#2a3510', '#1a2210']}
                      style={[s.chartBar, { height: barH }]}
                    />
                  </View>
                  <Text style={[s.chartLabel, isLast && { color: '#6B8E23' }]}>{m.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Serviços mais pedidos ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>SERVIÇOS MAIS PEDIDOS</Text>
          {services.length === 0 ? (
            <Text style={s.emptyText}>Nenhum serviço neste período</Text>
          ) : (
            services.map(({ name, count }, i) => {
              const maxCount = services[0]?.count || 1;
              const pct = (count / maxCount);
              return (
                <View key={name} style={s.serviceRow}>
                  <View style={s.serviceRankBox}>
                    <Text style={s.serviceRank}>{i + 1}</Text>
                  </View>
                  <View style={s.serviceInfo}>
                    <View style={s.serviceTopRow}>
                      <Text style={s.serviceName}>{name}</Text>
                      <Text style={s.serviceCount}>{count}x</Text>
                    </View>
                    <View style={s.serviceBarBg}>
                      <View style={[s.serviceBar, { width: `${Math.round(pct * 100)}%` }]} />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ── Métodos de pagamento ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>MÉTODOS DE PAGAMENTO</Text>
          <View style={s.pmRow}>
            {[
              { key: 'PIX',    icon: '⚡', color: '#4B8E5A', label: 'PIX'    },
              { key: 'Local',  icon: '🏪', color: '#8E7A4B', label: 'Local'  },
              { key: 'Cartao', icon: '💳', color: '#4B5E8E', label: 'Cartão' },
            ].map(({ key, icon, color, label }) => (
              <View key={key} style={[s.pmCard, { borderColor: color + '40' }]}>
                <Text style={[s.pmIcon]}>{icon}</Text>
                <Text style={[s.pmPct, { color }]}>{pmPct(key)}%</Text>
                <Text style={s.pmLabel}>{label}</Text>
                <Text style={s.pmCount}>{payments[key] || 0} pag.</Text>
              </View>
            ))}
          </View>

          {/* Barra de progresso combinada */}
          <View style={s.pmBarRow}>
            {[
              { key: 'PIX',    color: '#4B8E5A' },
              { key: 'Local',  color: '#8E7A4B' },
              { key: 'Cartao', color: '#4B5E8E' },
            ].map(({ key, color }) => {
              const pct = pmPct(key);
              if (pct === 0) return null;
              return (
                <View
                  key={key}
                  style={[s.pmBarSegment, { flex: pct, backgroundColor: color }]}
                />
              );
            })}
          </View>
        </View>

        {/* ── Resumo financeiro ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>RESUMO FINANCEIRO</Text>
          {[
            { label: 'Total recebido',    value: `R$ ${metrics?.ganhos?.toLocaleString('pt-BR') || 0}`, color: '#6B8E23' },
            { label: 'Pendente de receber', value: `R$ ${metrics?.pendente || 0}`,                      color: '#8E8E23' },
            { label: 'Total de cortes',   value: metrics?.total || 0,                                   color: '#FFF'    },
            { label: 'Ticket médio',      value: `R$ ${metrics?.ticketMedio || 0}`,                     color: '#FFF'    },
            { label: 'Cortes hoje',       value: metrics?.hoje || 0,                                    color: '#FFF'    },
            { label: 'Taxa de ocupação',  value: `${metrics?.ocupacao || 0}%`,                          color: '#4B8E8E' },
          ].map(({ label, value, color }) => (
            <View key={label} style={s.resumoRow}>
              <Text style={s.resumoLabel}>{label}</Text>
              <Text style={[s.resumoValue, { color }]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <View style={s.metricCard}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={[s.metricValue, { color }]}>{value}</Text>
      <Text style={s.metricSub}>{sub}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 20, paddingTop: 56 },

  headerSub:   { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 16 },

  periodRow:       { flexDirection: 'row', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  periodBtn:       { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  periodBtnActive: { backgroundColor: '#4B5320' },
  periodText:      { color: '#555', fontSize: 12, fontWeight: 'bold' },
  periodTextActive: { color: '#FFF' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metricCard:  { width: '47.5%', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  metricLabel: { color: '#555', fontSize: 11, marginBottom: 6 },
  metricValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  metricSub:   { color: '#444', fontSize: 11 },

  card:      { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a' },
  cardTitle: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  emptyText: { color: '#444', fontSize: 12, textAlign: 'center', paddingVertical: 20 },

  chartArea:   { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingTop: 10 },
  chartCol:    { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartValue:  { color: '#444', fontSize: 9, marginBottom: 4, textAlign: 'center' },
  chartBarBg:  { width: '70%', justifyContent: 'flex-end' },
  chartBar:    { width: '100%', borderRadius: 4 },
  chartLabel:  { color: '#555', fontSize: 10, marginTop: 6 },

  serviceRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  serviceRankBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  serviceRank:   { color: '#4B5320', fontSize: 11, fontWeight: 'bold' },
  serviceInfo:   { flex: 1 },
  serviceTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  serviceName:   { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  serviceCount:  { color: '#555', fontSize: 12 },
  serviceBarBg:  { height: 6, backgroundColor: '#1a1a1a', borderRadius: 3, overflow: 'hidden' },
  serviceBar:    { height: '100%', backgroundColor: '#4B5320', borderRadius: 3 },

  pmRow:        { flexDirection: 'row', gap: 10, marginBottom: 16 },
  pmCard:       { flex: 1, backgroundColor: '#111', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1 },
  pmIcon:       { fontSize: 20, marginBottom: 6 },
  pmPct:        { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  pmLabel:      { color: '#555', fontSize: 10, marginBottom: 2 },
  pmCount:      { color: '#444', fontSize: 10 },
  pmBarRow:     { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2 },
  pmBarSegment: { height: '100%' },

  resumoRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#111' },
  resumoLabel: { color: '#666', fontSize: 13 },
  resumoValue: { fontSize: 14, fontWeight: 'bold' },
});