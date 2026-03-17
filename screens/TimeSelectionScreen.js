import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const TIMES = [
  { time: '09:00', period: 'Manhã' }, { time: '09:30', period: 'Manhã' },
  { time: '10:00', period: 'Manhã' }, { time: '11:00', period: 'Manhã' },
  { time: '14:00', period: 'Tarde' }, { time: '15:30', period: 'Tarde' },
  { time: '17:00', period: 'Tarde' }, { time: '18:00', period: 'Noite' },
  { time: '19:30', period: 'Noite' },
];

export default function TimeSelectionScreen({ navigation, route }) {
  const { supabase } = useAuth();
  const [selectedTime,   setSelectedTime]   = useState(null);
  const [occupiedTimes,  setOccupiedTimes]  = useState([]);
  const [blockedTimes,   setBlockedTimes]   = useState([]);
  const [isClosed,       setIsClosed]       = useState(false);
  const [isDayBlocked,   setIsDayBlocked]   = useState(false);
  const [loading,        setLoading]        = useState(true);

  const { selectedDate, barber, service, price } = route?.params || {};
  const formattedDate = selectedDate ? selectedDate.split('-').reverse().join('/') : '—';
  const periods = ['Manhã', 'Tarde', 'Noite'];
  const icons   = { 'Manhã': '🌅', 'Tarde': '☀️', 'Noite': '🌙' };

  useEffect(() => { if (selectedDate) fetchAll(); }, [selectedDate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Busca barbeiro
      let barberId = barber?.id;
      if (!barberId) {
        const { data } = await supabase
          .from('profiles').select('id').eq('role', 'barber').limit(1).single();
        barberId = data?.id;
      }

      // Busca horários já agendados
      const { data: appts } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', selectedDate)
        .eq('barber_id', barberId)
        .neq('status', 'cancelled');

      // Busca bloqueios do barbeiro
      const { data: blocks } = await supabase
        .from('blocked_slots')
        .select('*')
        .eq('barber_id', barberId);

      if (appts) setOccupiedTimes(appts.map(a => a.time));

      if (blocks) {
        // Verifica se barbearia está fechada
        const closed = blocks.some(b => b.type === 'closed');
        setIsClosed(closed);

        // Verifica se o dia específico está bloqueado
        const dayBlocked = blocks.some(b => b.type === 'day' && b.date === selectedDate);
        setIsDayBlocked(dayBlocked);

        // Horários fixos bloqueados
        const times = blocks.filter(b => b.type === 'time').map(b => b.time);
        setBlockedTimes(times);
      }
    } catch (e) {
      console.warn('Erro ao buscar disponibilidade:', e);
    } finally {
      setLoading(false);
    }
  };

  const isUnavailable = (time) =>
    occupiedTimes.includes(time) || blockedTimes.includes(time);

  const handleSelectTime = (time) => {
    if (isUnavailable(time)) return;
    setSelectedTime(time);
  };

  // Barbearia fechada ou dia bloqueado
  if (!loading && (isClosed || isDayBlocked)) {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
        <View style={s.closedBox}>
          <Text style={s.closedIcon}>{isClosed ? '🔴' : '📅'}</Text>
          <Text style={s.closedTitle}>
            {isClosed ? 'Barbearia Fechada' : 'Dia Indisponível'}
          </Text>
          <Text style={s.closedSub}>
            {isClosed
              ? 'A barbearia está temporariamente fechada.\nTente novamente mais tarde.'
              : `O dia ${formattedDate} está bloqueado pelo barbeiro.\nEscolha outra data.`}
          </Text>
          <TouchableOpacity style={s.closedBtn} onPress={() => navigation.goBack()}>
            <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
              <Text style={s.closedBtnText}>← ESCOLHER OUTRA DATA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.badge}>PASSO 3 DE 3</Text>
        <Text style={s.title}>Escolha o Horário</Text>

        {/* Resumo */}
        <View style={s.summaryCard}>
          <Text style={s.sectionTitle}>RESUMO DO AGENDAMENTO</Text>
          <View style={s.summaryRow}>
            {[
              { icon: '✂️', label: 'BARBEIRO', value: barber?.name || 'Barbeiro' },
              { icon: '💈', label: 'SERVIÇO',  value: service || 'Corte'         },
              { icon: '📅', label: 'DATA',     value: formattedDate               },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={s.divider} />}
                <View style={s.summaryItem}>
                  <Text style={s.summaryIcon}>{item.icon}</Text>
                  <Text style={s.summaryLabel}>{item.label}</Text>
                  <Text style={s.summaryValue}>{item.value}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
          {price && (
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Valor</Text>
              <Text style={s.priceValue}>R$ {price},00</Text>
            </View>
          )}
        </View>

        {/* Legenda */}
        <View style={s.legendRow}>
          {[
            { color: '#111',    border: '#1d1d1d', label: 'Disponível'  },
            { color: '#4B5320', border: '#6B8E23', label: 'Selecionado' },
            { color: '#1a0a0a', border: '#3a1a1a', label: 'Indisponível'},
          ].map(({ color, border, label }) => (
            <View key={label} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: color, borderColor: border }]} />
              <Text style={s.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color="#6B8E23" size="large" />
            <Text style={s.loadingText}>A verificar disponibilidade...</Text>
          </View>
        ) : (
          periods.map(period => (
            <View key={period} style={s.periodSection}>
              <View style={s.periodHeader}>
                <Text style={s.periodIcon}>{icons[period]}</Text>
                <Text style={s.periodLabel}>{period}</Text>
                <View style={s.periodLine} />
              </View>
              <View style={s.slotsGrid}>
                {TIMES.filter(t => t.period === period).map(({ time }) => {
                  const sel         = selectedTime === time;
                  const unavailable = isUnavailable(time);
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[s.slot, sel && s.slotSel, unavailable && s.slotOccupied]}
                      onPress={() => handleSelectTime(time)}
                      disabled={unavailable}
                      activeOpacity={unavailable ? 1 : 0.7}
                    >
                      {sel && !unavailable && (
                        <LinearGradient colors={['#4B5320','#2d3314']} style={[StyleSheet.absoluteFill,{borderRadius:12}]} />
                      )}
                      <Text style={[s.slotTime, sel && s.slotTimeSel, unavailable && s.slotTimeOccupied]}>
                        {time}
                      </Text>
                      {sel        && <Text style={s.checkIcon}>✓</Text>}
                      {unavailable && <Text style={s.lockIcon}>🔒</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <View style={s.tipBox}>
          <Text style={s.tipText}>
            {occupiedTimes.length + blockedTimes.length > 0
              ? `🔒 ${occupiedTimes.length + blockedTimes.length} horário(s) indisponível(eis) neste dia.`
              : '💡 Todos os horários estão disponíveis para esta data.'}
          </Text>
        </View>
      </ScrollView>

      {selectedTime && (
        <View style={s.footer}>
          <View style={s.footerInfo}>
            <Text style={s.footerLabel}>Horário selecionado</Text>
            <Text style={s.footerTime}>{selectedTime} · {formattedDate}</Text>
          </View>
          <TouchableOpacity
            style={s.confirmBtn}
            onPress={() => navigation.navigate('Payment', { selectedTime, selectedDate, barber, service, price })}
          >
            <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
              <Text style={s.confirmText}>CONFIRMAR E PAGAR →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll:    { padding: 24, paddingTop: 56, paddingBottom: 180 },
  badge:     { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  title:     { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },

  closedBox:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  closedIcon:   { fontSize: 64, marginBottom: 20 },
  closedTitle:  { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  closedSub:    { color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  closedBtn:    { width: '100%', height: 54, borderRadius: 14, overflow: 'hidden' },
  closedBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  summaryCard:  { backgroundColor: '#0d0d0d', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 16 },
  sectionTitle: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryItem:  { flex: 1, alignItems: 'center' },
  summaryIcon:  { fontSize: 22, marginBottom: 6 },
  summaryLabel: { color: '#444', fontSize: 8, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  summaryValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  divider:      { width: 1, height: 50, backgroundColor: '#1a1a1a' },
  priceRow:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  priceLabel:   { color: '#555', fontSize: 12 },
  priceValue:   { color: '#6B8E23', fontSize: 18, fontWeight: 'bold' },

  legendRow:  { flexDirection: 'row', gap: 16, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 12, height: 12, borderRadius: 4, borderWidth: 1 },
  legendText: { color: '#555', fontSize: 11 },

  loadingBox:  { alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: '#555', fontSize: 12, marginTop: 12 },

  periodSection: { marginBottom: 24 },
  periodHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  periodIcon:    { fontSize: 16 },
  periodLabel:   { color: '#888', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  periodLine:    { flex: 1, height: 1, backgroundColor: '#1a1a1a' },

  slotsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot:             { width: '30%', paddingVertical: 16, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', borderWidth: 1, borderColor: '#1d1d1d', overflow: 'hidden', position: 'relative' },
  slotSel:          { borderColor: '#6B8E23' },
  slotOccupied:     { backgroundColor: '#1a0a0a', borderColor: '#3a1a1a', opacity: 0.5 },
  slotTime:         { color: '#777', fontWeight: 'bold', fontSize: 15 },
  slotTimeSel:      { color: '#FFF' },
  slotTimeOccupied: { color: '#2a1010' },
  checkIcon:        { position: 'absolute', top: 4, right: 6, color: '#6B8E23', fontSize: 10 },
  lockIcon:         { position: 'absolute', top: 3, right: 5, fontSize: 9 },

  tipBox:  { backgroundColor: '#0a0d07', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1a2210' },
  tipText: { color: '#444', fontSize: 11, lineHeight: 18 },

  footer:      { position: 'absolute', bottom: 50, left: 20, right: 20, backgroundColor: '#0d0d0d', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#1a1a1a', elevation: 20 },
  footerInfo:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  footerLabel: { color: '#555', fontSize: 11 },
  footerTime:  { color: '#6B8E23', fontSize: 11, fontWeight: 'bold' },
  confirmBtn:  { height: 52, borderRadius: 14, overflow: 'hidden' },
  gradBtn:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  backBtn:     { position: 'absolute', top: 14, left: 20, padding: 8 },
  backText:    { color: '#4B5320', fontWeight: 'bold', fontSize: 13 },
});