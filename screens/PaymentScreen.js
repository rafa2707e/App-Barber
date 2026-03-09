import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Alert, TextInput, Image, ActivityIndicator, Clipboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const EDGE_URL         = 'https://reieucbrjzdfqkdudvnp.supabase.co/functions/v1/create-paymente';
const NOTIFY_URL       = 'https://reieucbrjzdfqkdudvnp.supabase.co/functions/v1/send-notification';

const SERVICES = [
  { name: 'Corte Simples',      price: 35, icon: '✂️', duration: '30min', bg: '#1a2210' },
  { name: 'Corte + Barba',      price: 55, icon: '🪒', duration: '50min', bg: '#1a1810' },
  { name: 'Degradê',            price: 45, icon: '💈', duration: '40min', bg: '#101a1a' },
  { name: 'Visagismo Completo', price: 80, icon: '👑', duration: '75min', bg: '#1a1020' },
  { name: 'Barba',              price: 25, icon: '🧔', duration: '25min', bg: '#101510' },
];

export default function PaymentScreen({ navigation, route }) {
  const { user, supabase } = useAuth();
  const { selectedDate, selectedTime, barber: paramBarber, service: preService, price: prePrice } = route?.params || {};

  const [step,            setStep]            = useState(preService ? 'method' : 'service');
  const [selectedService, setSelectedService] = useState(preService ? { name: preService, price: prePrice } : null);
  const [payMethod,       setPayMethod]       = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [pixData,         setPixData]         = useState(null);
  const [appointmentId,   setAppointmentId]   = useState(null);
  const [barber,          setBarber]          = useState(paramBarber || null);

  const [cpf,        setCpf]        = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV,    setCardCVV]    = useState('');

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const formattedDate = selectedDate ? selectedDate.split('-').reverse().join('/') : '—';

  useEffect(() => { if (!barber) fetchBarber(); }, []);

  const fetchBarber = async () => {
    try {
      const { data } = await supabase
        .from('profiles').select('id, name, specialty, push_token')
        .eq('role', 'barber').limit(1).single();
      if (data) setBarber(data);
    } catch (e) { console.warn('Erro barbeiro:', e); }
  };

  const createAppointment = async (method) => {
    if (!user?.id) throw new Error('Utilizador não autenticado');
    let barbeiro = barber;
    if (!barbeiro?.id) {
      const { data } = await supabase.from('profiles')
        .select('id, name, push_token').eq('role', 'barber').limit(1).single();
      barbeiro = data;
      setBarber(data);
    }
    if (!barbeiro?.id) throw new Error('Nenhum barbeiro encontrado');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id:  user.id,
        barber_id:  barbeiro.id,
        service:    selectedService.name,
        price:      selectedService.price,
        date:       selectedDate || new Date().toISOString().split('T')[0],
        time:       selectedTime || '09:00',
        pay_method: method,
        paid:       false,
        status:     'upcoming',
      })
      .select().single();

    if (error) throw new Error('Erro ao criar agendamento: ' + error.message);

    // Notifica o barbeiro em segundo plano
    notifyBarber(barbeiro, data);

    return data.id;
  };

  // Envia notificação push ao barbeiro
  const notifyBarber = async (barbeiro, appt) => {
    try {
      if (!barbeiro?.push_token) return;
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(NOTIFY_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          to:    barbeiro.push_token,
          title: '✂️ Novo agendamento!',
          body:  `${user.name || 'Cliente'} agendou ${appt.service} para ${appt.date?.split('-').reverse().join('/')} às ${appt.time}`,
          data:  { appointmentId: appt.id },
        }),
      });
    } catch (e) { console.warn('Erro notificação barbeiro:', e); }
  };

  const callEdge = async (body) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(EDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success && json.error) throw new Error(json.error);
    return json;
  };

  const handlePix = async () => {
    if (!cpf.trim()) return Alert.alert('Atenção', 'Informe o seu CPF para gerar o PIX.');
    setLoading(true);
    try {
      const apptId = await createAppointment('PIX');
      setAppointmentId(apptId);
      const result = await callEdge({
        method: 'PIX', amount: selectedService.price,
        description: selectedService.name, appointmentId: apptId,
        email: user.email, payerName: user.name, cpf,
      });
      setPixData(result);
      setStep('pix');
    } catch (err) { Alert.alert('Erro PIX', err.message); }
    finally { setLoading(false); }
  };

  const handlePixConfirm = async () => {
    setLoading(true);
    try {
      await supabase.from('appointments').update({ paid: true, pay_method: 'PIX' }).eq('id', appointmentId);
      showSuccess();
    } catch { showSuccess(); }
    finally { setLoading(false); }
  };

  const handleCard = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV || !cpf)
      return Alert.alert('Atenção', 'Preenche todos os campos.');
    setLoading(true);
    try {
      const apptId = await createAppointment('Cartao');
      setAppointmentId(apptId);
      const result = await callEdge({
        method: 'Cartao', amount: selectedService.price,
        description: selectedService.name, appointmentId: apptId,
        email: user.email, cpf, token: 'TEST_CARD_TOKEN', installments: 1,
      });
      if (result.success) {
        await supabase.from('appointments').update({ paid: true }).eq('id', apptId);
        showSuccess();
      } else throw new Error(result.message || 'Pagamento recusado');
    } catch (err) { Alert.alert('Erro no cartão', err.message); }
    finally { setLoading(false); }
  };

  const handleLocal = async () => {
    setLoading(true);
    try {
      await createAppointment('Local');
      showSuccess();
    } catch (err) { Alert.alert('Erro', err.message); }
    finally { setLoading(false); }
  };

  const showSuccess = () => {
    setSuccess(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const goHome = () => navigation.popToTop();

  // ══ SUCESSO ══════════════════════════════════════════════════════════════
  if (success) {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0a0f05', '#000']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.successScroll}>
          <Animated.View style={{ alignItems: 'center', opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View style={s.successRing}>
              <LinearGradient colors={['#4B5320', '#2d3314']} style={s.successCircle}>
                <Text style={s.successCheck}>✓</Text>
              </LinearGradient>
            </View>
            <Text style={s.successTitle}>Agendamento Confirmado!</Text>
            <Text style={s.successSub}>O barbeiro foi notificado 💈</Text>
            <View style={s.receiptCard}>
              <View style={s.receiptHead}>
                <Text style={s.receiptTitle}>🧾  COMPROVANTE</Text>
                <View style={s.paidBadge}><Text style={s.paidBadgeText}>CONFIRMADO</Text></View>
              </View>
              {[
                { label: 'Serviço',   value: selectedService?.name  },
                { label: 'Barbeiro',  value: barber?.name || '—'    },
                { label: 'Data',      value: formattedDate           },
                { label: 'Horário',   value: selectedTime || '—'    },
                { label: 'Pagamento', value: payMethod || 'Local'   },
              ].map(({ label, value }) => (
                <View key={label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{label}</Text>
                  <Text style={s.receiptValue}>{value}</Text>
                </View>
              ))}
              <View style={[s.receiptRow, s.receiptTotal]}>
                <Text style={s.receiptTotalLabel}>TOTAL</Text>
                <Text style={s.receiptTotalValue}>R$ {selectedService?.price},00</Text>
              </View>
            </View>
            <TouchableOpacity style={s.homeBtn} onPress={goHome}>
              <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
                <Text style={s.homeBtnText}>VOLTAR AO INÍCIO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ══ PIX AGUARDANDO ═══════════════════════════════════════════════════════
  if (step === 'pix' && pixData) {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.badge}>PAGAMENTO PIX</Text>
          <Text style={s.title}>Escaneia o QR Code</Text>
          <View style={s.pixBox}>
            {pixData.qrCodeBase64 ? (
              <Image source={{ uri: `data:image/png;base64,${pixData.qrCodeBase64}` }} style={s.qrImage} resizeMode="contain" />
            ) : (
              <View style={s.qrPlaceholder}><View style={s.qrInner} /></View>
            )}
            <Text style={s.qrLabel}>QR CODE PIX · MERCADO PAGO</Text>
            <Text style={s.qrAmount}>R$ {selectedService?.price},00</Text>
          </View>
          <TouchableOpacity style={s.copyBtn} onPress={() => { Clipboard.setString(pixData.qrCode || ''); Alert.alert('Copiado!', 'Chave PIX copiada.'); }}>
            <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
              <Text style={s.copyBtnText}>📋  COPIAR CHAVE PIX</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={s.pixKeyBox}>
            <Text style={s.pixKeyLabel}>PIX COPIA E COLA</Text>
            <Text style={s.pixKeyValue} numberOfLines={3}>{pixData.qrCode || '—'}</Text>
          </View>
          {['Abra o app do seu banco', 'Escaneie o QR Code ou cole a chave', `Confirme o valor: R$ ${selectedService?.price},00`, 'Toque em "Já paguei" abaixo'].map((t, i) => (
            <Text key={i} style={s.pixStep}>{i + 1}. {t}</Text>
          ))}
          <TouchableOpacity style={[s.confirmBtn, loading && { opacity: 0.6 }]} onPress={handlePixConfirm} disabled={loading}>
            <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={s.confirmBtnText}>JÁ PAGUEI ✓</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={s.backBtn} onPress={() => setStep('method')}>
          <Text style={s.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ══ SERVIÇO ══════════════════════════════════════════════════════════════
  if (step === 'service') {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.badge}>PASSO 1 DE 2</Text>
          <Text style={s.title}>Qual serviço?</Text>
          <Text style={s.subtitle}>Selecione o que vai fazer hoje</Text>
          {SERVICES.map(svc => {
            const sel = selectedService?.name === svc.name;
            return (
              <TouchableOpacity key={svc.name} style={[s.serviceCard, sel && s.serviceCardSel]} onPress={() => setSelectedService(svc)}>
                {sel && <LinearGradient colors={['#1a2210','#111']} style={[StyleSheet.absoluteFill,{borderRadius:16}]} />}
                <View style={[s.svcIconBox, { backgroundColor: svc.bg }]}><Text style={s.svcIcon}>{svc.icon}</Text></View>
                <View style={s.svcInfo}>
                  <Text style={[s.svcName, sel && { color: '#FFF' }]}>{svc.name}</Text>
                  <Text style={s.svcDuration}>⏱ {svc.duration}</Text>
                </View>
                <View style={[s.svcBadge, sel && s.svcBadgeSel]}>
                  <Text style={[s.svcPrice, sel && { color: '#FFF' }]}>R$ {svc.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
        <View style={s.fixedFooter}>
          <TouchableOpacity style={s.nextBtn} disabled={!selectedService} onPress={() => setStep('method')}>
            <LinearGradient colors={selectedService ? ['#4B5320','#2d3314'] : ['#1a1a1a','#111']} style={s.gradBtn}>
              <Text style={[s.nextBtnText, !selectedService && { color: '#333' }]}>
                {selectedService ? `CONTINUAR  ·  R$ ${selectedService.price},00  →` : 'SELECIONE UM SERVIÇO'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ══ PAGAMENTO ════════════════════════════════════════════════════════════
  return (
    <View style={s.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.badge}>PASSO 2 DE 2</Text>
        <Text style={s.title}>Como pagar?</Text>

        <View style={s.summaryBox}>
          <Text style={s.sectionLabel}>RESUMO</Text>
          <View style={s.summaryRow}><Text style={s.summaryLabel2}>Serviço</Text><Text style={s.summaryVal}>{selectedService?.name}</Text></View>
          {barber && <View style={s.summaryRow}><Text style={s.summaryLabel2}>Barbeiro</Text><Text style={s.summaryVal}>{barber.name}</Text></View>}
          {selectedDate && <View style={s.summaryRow}><Text style={s.summaryLabel2}>Data / Hora</Text><Text style={s.summaryVal}>{formattedDate}  {selectedTime}</Text></View>}
          <View style={[s.summaryRow, s.summaryTotalRow]}>
            <Text style={s.summaryTotalLabel}>TOTAL</Text>
            <Text style={s.summaryTotalVal}>R$ {selectedService?.price},00</Text>
          </View>
        </View>

        {[
          { id: 'PIX',    icon: '⚡', title: 'PIX',              sub: 'Instantâneo · Mercado Pago · QR Code real' },
          { id: 'Cartao', icon: '💳', title: 'Cartão de Crédito', sub: 'Visa, Mastercard, Elo · Mercado Pago'     },
          { id: 'Local',  icon: '🏪', title: 'Pagar no Local',    sub: 'Pague na barbearia no dia do corte'       },
        ].map(m => (
          <TouchableOpacity key={m.id} style={[s.methodCard, payMethod === m.id && s.methodCardSel]} onPress={() => setPayMethod(m.id)}>
            <View style={s.methodIconBox}><Text style={s.methodIcon}>{m.icon}</Text></View>
            <View style={s.methodInfo}>
              <Text style={[s.methodTitle, payMethod === m.id && { color: '#FFF' }]}>{m.title}</Text>
              <Text style={s.methodSub}>{m.sub}</Text>
            </View>
            <Text style={[s.methodArrow, payMethod === m.id && { color: '#6B8E23' }]}>›</Text>
          </TouchableOpacity>
        ))}

        {(payMethod === 'PIX' || payMethod === 'Cartao') && (
          <View style={s.fieldBox}>
            <Text style={s.fieldLabel}>CPF DO PAGADOR</Text>
            <TextInput style={s.fieldInput} placeholder="000.000.000-00" placeholderTextColor="#333" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={14} />
          </View>
        )}

        {payMethod === 'Cartao' && (
          <View style={s.cardForm}>
            <Text style={s.sectionLabel}>DADOS DO CARTÃO</Text>
            <View style={s.cardPreview}>
              <LinearGradient colors={['#1a2210','#0d0d0d']} style={s.cardPreviewGrad}>
                <Text style={s.cardPreviewBank}>STUDIO HAIR</Text>
                <Text style={s.cardPreviewNum}>{cardNumber || '**** **** **** ****'}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={s.cardPreviewLabel}>{cardName || 'NOME NO CARTÃO'}</Text>
                  <Text style={s.cardPreviewLabel}>{cardExpiry || 'MM/AA'}</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={s.fieldBox}>
              <Text style={s.fieldLabel}>NÚMERO DO CARTÃO</Text>
              <TextInput style={s.fieldInput} placeholder="0000 0000 0000 0000" placeholderTextColor="#333" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" maxLength={19} />
            </View>
            <View style={s.fieldBox}>
              <Text style={s.fieldLabel}>NOME NO CARTÃO</Text>
              <TextInput style={s.fieldInput} placeholder="Como está no cartão" placeholderTextColor="#333" value={cardName} onChangeText={setCardName} autoCorrect={false} />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>VALIDADE</Text>
                <TextInput style={s.fieldInput} placeholder="MM/AA" placeholderTextColor="#333" value={cardExpiry} onChangeText={setCardExpiry} keyboardType="numeric" maxLength={5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>CVV</Text>
                <TextInput style={s.fieldInput} placeholder="123" placeholderTextColor="#333" value={cardCVV} onChangeText={setCardCVV} keyboardType="numeric" maxLength={4} secureTextEntry />
              </View>
            </View>
          </View>
        )}

        {payMethod && (
          <TouchableOpacity style={[s.confirmBtn, loading && { opacity: 0.6 }]} disabled={loading}
            onPress={payMethod === 'PIX' ? handlePix : payMethod === 'Cartao' ? handleCard : handleLocal}>
            <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
              {loading ? <ActivityIndicator color="#FFF" /> :
                <Text style={s.confirmBtnText}>
                  {payMethod === 'PIX' ? '⚡ GERAR QR CODE PIX →' : payMethod === 'Cartao' ? '💳 PAGAR COM CARTÃO →' : '✅ CONFIRMAR AGENDAMENTO →'}
                </Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
      <TouchableOpacity style={s.backBtn} onPress={() => preService ? navigation.goBack() : setStep('service')}>
        <Text style={s.backText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#000' },
  scroll:     { padding: 24, paddingTop: 56, paddingBottom: 40 },
  badge:      { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  title:      { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  subtitle:   { color: '#555', fontSize: 13, marginBottom: 24 },
  sectionLabel: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 14 },
  gradBtn:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn:    { position: 'absolute', top: 14, left: 20, padding: 8 },
  backText:   { color: '#4B5320', fontWeight: 'bold', fontSize: 13 },
  serviceCard:    { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden', position: 'relative' },
  serviceCardSel: { borderColor: '#4B5320' },
  svcIconBox:     { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  svcIcon:        { fontSize: 24 },
  svcInfo:        { flex: 1 },
  svcName:        { color: '#999', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  svcDuration:    { color: '#444', fontSize: 11 },
  svcBadge:       { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  svcBadgeSel:    { backgroundColor: '#4B5320' },
  svcPrice:       { color: '#777', fontWeight: 'bold', fontSize: 14 },
  fixedFooter:    { position: 'absolute', bottom: 36, left: 20, right: 20 },
  nextBtn:        { height: 58, borderRadius: 16, overflow: 'hidden' },
  nextBtnText:    { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  summaryBox:        { backgroundColor: '#0d0d0d', borderRadius: 18, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel2:     { color: '#555', fontSize: 12 },
  summaryVal:        { color: '#FFF', fontSize: 13 },
  summaryTotalRow:   { borderTopWidth: 1, borderTopColor: '#1a1a1a', marginTop: 8, paddingTop: 12 },
  summaryTotalLabel: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  summaryTotalVal:   { color: '#6B8E23', fontSize: 22, fontWeight: 'bold' },
  methodCard:    { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  methodCardSel: { borderColor: '#4B5320', backgroundColor: '#0d1208' },
  methodIconBox: { width: 48, height: 48, backgroundColor: '#1a1a1a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  methodIcon:    { fontSize: 22 },
  methodInfo:    { flex: 1 },
  methodTitle:   { color: '#999', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  methodSub:     { color: '#444', fontSize: 11 },
  methodArrow:   { color: '#222', fontSize: 26 },
  fieldBox:   { marginBottom: 14 },
  fieldLabel: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  fieldInput: { backgroundColor: '#0d0d0d', borderRadius: 12, padding: 14, color: '#FFF', borderWidth: 1, borderColor: '#1a1a1a', fontSize: 14 },
  cardForm:         { backgroundColor: '#0d0d0d', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a' },
  cardPreview:      { borderRadius: 16, overflow: 'hidden', marginBottom: 18, height: 110 },
  cardPreviewGrad:  { flex: 1, padding: 20, justifyContent: 'space-between' },
  cardPreviewBank:  { color: '#6B8E23', fontWeight: 'bold', fontSize: 13, letterSpacing: 2 },
  cardPreviewNum:   { color: '#FFF', fontSize: 16, letterSpacing: 3, fontWeight: 'bold' },
  cardPreviewLabel: { color: '#555', fontSize: 10, letterSpacing: 1 },
  confirmBtn:     { height: 56, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
  pixBox:        { alignItems: 'center', backgroundColor: '#0d0d0d', borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#1a2210' },
  qrImage:       { width: 200, height: 200, marginBottom: 12 },
  qrPlaceholder: { width: 160, height: 160, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4B5320', marginBottom: 12 },
  qrInner:       { width: 90, height: 90, backgroundColor: '#4B5320', borderRadius: 6 },
  qrLabel:       { color: '#444', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  qrAmount:      { color: '#6B8E23', fontSize: 24, fontWeight: 'bold' },
  copyBtn:       { height: 52, borderRadius: 14, overflow: 'hidden', marginBottom: 14, alignSelf: 'stretch' },
  copyBtnText:   { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  pixKeyBox:     { backgroundColor: '#0d0d0d', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  pixKeyLabel:   { color: '#444', fontSize: 8, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  pixKeyValue:   { color: '#FFF', fontSize: 11, lineHeight: 18 },
  pixStep:       { color: '#555', fontSize: 12, marginBottom: 8, lineHeight: 20 },
  successScroll:     { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, paddingVertical: 60 },
  successRing:       { marginBottom: 28 },
  successCircle:     { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  successCheck:      { color: '#FFF', fontSize: 52, fontWeight: 'bold' },
  successTitle:      { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  successSub:        { color: '#555', fontSize: 14, marginBottom: 32 },
  receiptCard:       { width: '100%', backgroundColor: '#0d0d0d', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1a2210', marginBottom: 28 },
  receiptHead:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  receiptTitle:      { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  paidBadge:         { backgroundColor: '#1a2210', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#4B5320' },
  paidBadgeText:     { color: '#6B8E23', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  receiptRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#111' },
  receiptLabel:      { color: '#555', fontSize: 12 },
  receiptValue:      { color: '#FFF', fontSize: 12, fontWeight: '600' },
  receiptTotal:      { borderBottomWidth: 0, marginTop: 4, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1a2210' },
  receiptTotalLabel: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  receiptTotalValue: { color: '#6B8E23', fontSize: 20, fontWeight: 'bold' },
  homeBtn:           { width: '100%', height: 58, borderRadius: 16, overflow: 'hidden' },
  homeBtnText:       { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
});