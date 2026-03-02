import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Clipboard, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SERVICES = [
  { name: 'Corte Simples',      price: 35, icon: '✂️', duration: '30min', color: '#1a2210' },
  { name: 'Corte + Barba',      price: 55, icon: '🪒', duration: '50min', color: '#1a1810' },
  { name: 'Degradê',            price: 45, icon: '💈', duration: '40min', color: '#101a1a' },
  { name: 'Visagismo Completo', price: 80, icon: '👑', duration: '75min', color: '#1a1020' },
  { name: 'Barba',              price: 25, icon: '🧔', duration: '25min', color: '#101510' },
];

const PIX_KEY = 'estudio-hair@pix.com.br';

export default function PaymentScreen({ navigation, route }) {
  const { selectedDate, selectedTime, barber, service: preService, price: prePrice } = route?.params || {};

  const [step, setStep]           = useState(preService ? 'method' : 'service');
  const [selectedService, setSelectedService] = useState(
    preService ? { name: preService, price: prePrice } : null
  );
  const [payMethod, setPayMethod] = useState(null);
  const [success, setSuccess]     = useState(false);
  const [cardNum, setCardNum]     = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [step]);

  const formattedDate = selectedDate
    ? selectedDate.split('-').reverse().join('/')
    : '—';

  const handleSuccess = () => {
    setSuccess(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // ── TELA DE SUCESSO ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0a0f05', '#000']} style={StyleSheet.absoluteFill} />
        <Animated.View style={[s.successContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={s.successCircle}>
            <LinearGradient colors={['#4B5320', '#2d3314']} style={s.successCircleInner}>
              <Text style={s.successIcon}>✓</Text>
            </LinearGradient>
          </View>
          <Text style={s.successTitle}>Agendamento Confirmado!</Text>
          <Text style={s.successSubtitle}>Até breve na barbearia 💈</Text>

          <View style={s.receiptCard}>
            <Text style={s.receiptTitle}>🧾  COMPROVANTE</Text>
            {[
              { label: 'Serviço',    value: selectedService?.name },
              { label: 'Barbeiro',   value: barber?.name || 'João Silva' },
              { label: 'Data',       value: formattedDate },
              { label: 'Horário',    value: selectedTime || '—' },
              { label: 'Pagamento',  value: payMethod },
              { label: 'Total',      value: `R$ ${selectedService?.price},00` },
              { label: 'Status',     value: '✅ CONFIRMADO' },
            ].map(({ label, value }) => (
              <View key={label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{label}</Text>
                <Text style={[s.receiptValue, label === 'Total' && { color: '#6B8E23', fontWeight: 'bold' }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={s.homeBtn} onPress={() => navigation.replace('ClientTabs')}>
            <LinearGradient colors={['#4B5320', '#2d3314']} style={s.gradBtn}>
              <Text style={s.homeBtnText}>VOLTAR AO INÍCIO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ── PASSO 1: ESCOLHER SERVIÇO ───────────────────────────────────────────────
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
              <TouchableOpacity
                key={svc.name}
                style={[s.serviceCard, sel && s.serviceCardSel]}
                onPress={() => setSelectedService(svc)}
              >
                {sel && <LinearGradient colors={['#1a2210','#111']} style={[StyleSheet.absoluteFill,{borderRadius:16}]} />}
                <View style={[s.serviceIconBox, { backgroundColor: svc.color }]}>
                  <Text style={s.serviceIcon}>{svc.icon}</Text>
                </View>
                <View style={s.serviceInfo}>
                  <Text style={[s.serviceName, sel && { color: '#FFF' }]}>{svc.name}</Text>
                  <Text style={s.serviceDuration}>⏱ {svc.duration}</Text>
                </View>
                <View style={[s.servicePriceBadge, sel && s.servicePriceBadgeSel]}>
                  <Text style={[s.servicePrice, sel && { color: '#FFF' }]}>R$ {svc.price}</Text>
                </View>
                {sel && <View style={s.serviceCheckDot}><Text style={{color:'#6B8E23',fontSize:12}}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.fixedFooter}>
          <TouchableOpacity
            style={[s.nextBtn, !selectedService && s.nextBtnDisabled]}
            disabled={!selectedService}
            onPress={() => setStep('method')}
          >
            <LinearGradient colors={selectedService ? ['#4B5320','#2d3314'] : ['#1a1a1a','#111']} style={s.gradBtn}>
              <Text style={[s.nextBtnText, !selectedService && { color: '#444' }]}>
                {selectedService ? `ESCOLHER PAGAMENTO → R$ ${selectedService.price},00` : 'ESCOLHER FORMA DE PAGAMENTO →'}
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

  // ── PASSO 2: FORMA DE PAGAMENTO ─────────────────────────────────────────────
  if (step === 'method') {
    return (
      <View style={s.container}>
        <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.badge}>PASSO 2 DE 2</Text>
          <Text style={s.title}>Como pagar?</Text>

          {/* Resumo */}
          <View style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel2}>SERVIÇO</Text>
              <Text style={s.summaryVal}>{selectedService?.name}</Text>
            </View>
            <View style={[s.summaryRow, { borderTopWidth: 1, borderTopColor: '#1a1a1a', marginTop: 10, paddingTop: 10 }]}>
              <Text style={s.summaryLabel2}>TOTAL</Text>
              <Text style={s.totalVal}>R$ {selectedService?.price},00</Text>
            </View>
            {selectedDate && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel2}>DATA / HORA</Text>
                <Text style={s.summaryVal}>{formattedDate}  {selectedTime || ''}</Text>
              </View>
            )}
          </View>

          {/* Métodos */}
          {[
            { id: 'PIX',    icon: '⚡', title: 'PIX',               sub: 'Pagamento instantâneo · Aprovação imediata' },
            { id: 'Cartao', icon: '💳', title: 'Cartão de Crédito',  sub: 'Visa, Mastercard, Elo · Até 3x sem juros'  },
            { id: 'Local',  icon: '🏪', title: 'Pagar no Local',     sub: 'Pague na barbearia no dia do corte'         },
          ].map(m => (
            <TouchableOpacity
              key={m.id}
              style={[s.methodCard, payMethod === m.id && s.methodCardSel]}
              onPress={() => setPayMethod(m.id)}
            >
              <View style={s.methodIconBox}><Text style={s.methodIcon}>{m.icon}</Text></View>
              <View style={s.methodInfo}>
                <Text style={[s.methodTitle, payMethod === m.id && { color: '#FFF' }]}>{m.title}</Text>
                <Text style={s.methodSub}>{m.sub}</Text>
              </View>
              <Text style={[s.methodArrow, payMethod === m.id && { color: '#6B8E23' }]}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Detalhe PIX */}
          {payMethod === 'PIX' && (
            <View style={s.pixBox}>
              <View style={s.qrBox}>
                <View style={s.qrPlaceholder}>
                  <View style={s.qrInner} />
                </View>
                <Text style={s.qrLabel}>QR CODE PIX</Text>
                <Text style={s.qrAmount}>R$ {selectedService?.price},00</Text>
              </View>
              <TouchableOpacity style={s.copyBtn} onPress={() => { Clipboard.setString(PIX_KEY); Alert.alert('Copiado!', 'Chave PIX copiada.'); }}>
                <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
                  <Text style={s.copyBtnText}>📋  COPIAR CHAVE PIX</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={s.pixKeyBox}>
                <Text style={s.pixKeyLabel}>CHAVE PIX</Text>
                <Text style={s.pixKeyValue}>{PIX_KEY}</Text>
              </View>
              {['Abra o app do seu banco','Escaneie o QR Code ou cole a chave',`Confirme o valor: R$ ${selectedService?.price},00`,'Toque em "Já paguei" abaixo'].map((step, i) => (
                <Text key={i} style={s.pixStep}>{i + 1}. {step}</Text>
              ))}
              <TouchableOpacity style={s.paidBtn} onPress={handleSuccess}>
                <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
                  <Text style={s.paidBtnText}>JÁ PAGUEI ✓</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {payMethod === 'Local' && (
            <TouchableOpacity style={s.continueBtn} onPress={handleSuccess}>
              <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
                <Text style={s.continueBtnText}>CONFIRMAR AGENDAMENTO →</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {payMethod === 'Cartao' && (
            <View style={s.cardBox}>
              <Text style={s.cardLabel}>NÚMERO DO CARTÃO</Text>
              <View style={s.cardInput}><Text style={s.cardInputText}>**** **** **** ****</Text></View>
              <Text style={s.cardNote}>💳 Integração com Mercado Pago em breve</Text>
              <TouchableOpacity style={s.continueBtn} onPress={handleSuccess}>
                <LinearGradient colors={['#4B5320','#2d3314']} style={s.gradBtn}>
                  <Text style={s.continueBtnText}>CONFIRMAR →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={s.backBtn} onPress={() => preService ? navigation.goBack() : setStep('service')}>
          <Text style={s.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 24, paddingTop: 56, paddingBottom: 120 },
  badge: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  subtitle: { color: '#555', fontSize: 13, marginBottom: 24 },

  // Serviços
  serviceCard: { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a', overflow: 'hidden', position: 'relative' },
  serviceCardSel: { borderColor: '#4B5320' },
  serviceIconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  serviceIcon: { fontSize: 24 },
  serviceInfo: { flex: 1 },
  serviceName: { color: '#aaa', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  serviceDuration: { color: '#444', fontSize: 11 },
  servicePriceBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  servicePriceBadgeSel: { backgroundColor: '#4B5320' },
  servicePrice: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  serviceCheckDot: { position: 'absolute', top: 8, right: 8 },

  fixedFooter: { position: 'absolute', bottom: 36, left: 20, right: 20 },
  nextBtn: { height: 56, borderRadius: 16, overflow: 'hidden' },
  nextBtnDisabled: {},
  nextBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },
  gradBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Resumo
  summaryBox: { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summaryLabel2: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  summaryVal: { color: '#FFF', fontSize: 14 },
  totalVal: { color: '#6B8E23', fontSize: 22, fontWeight: 'bold' },

  // Métodos
  methodCard: { backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  methodCardSel: { borderColor: '#4B5320', backgroundColor: '#0d1208' },
  methodIconBox: { width: 46, height: 46, backgroundColor: '#1a1a1a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  methodIcon: { fontSize: 22 },
  methodInfo: { flex: 1 },
  methodTitle: { color: '#aaa', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  methodSub: { color: '#444', fontSize: 11 },
  methodArrow: { color: '#333', fontSize: 22 },

  // PIX
  pixBox: { backgroundColor: '#0d0d0d', borderRadius: 20, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#1a2210' },
  qrBox: { alignItems: 'center', marginBottom: 16 },
  qrPlaceholder: { width: 150, height: 150, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4B5320', marginBottom: 12 },
  qrInner: { width: 80, height: 80, backgroundColor: '#4B5320', borderRadius: 4 },
  qrLabel: { color: '#444', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  qrAmount: { color: '#6B8E23', fontSize: 20, fontWeight: 'bold' },
  copyBtn: { height: 50, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  copyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  pixKeyBox: { backgroundColor: '#111', borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#1a1a1a' },
  pixKeyLabel: { color: '#444', fontSize: 8, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  pixKeyValue: { color: '#FFF', fontSize: 13 },
  pixStep: { color: '#555', fontSize: 12, marginBottom: 6, lineHeight: 18 },
  paidBtn: { height: 54, borderRadius: 14, overflow: 'hidden', marginTop: 16 },
  paidBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  // Cartão
  cardBox: { backgroundColor: '#0d0d0d', borderRadius: 20, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#1a1a1a' },
  cardLabel: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  cardInput: { backgroundColor: '#111', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#222', marginBottom: 12 },
  cardInputText: { color: '#555', fontSize: 16, letterSpacing: 4 },
  cardNote: { color: '#444', fontSize: 11, marginBottom: 16, textAlign: 'center' },
  continueBtn: { height: 54, borderRadius: 14, overflow: 'hidden' },
  continueBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // Sucesso
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCircle: { marginBottom: 24 },
  successCircleInner: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  successIcon: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
  successTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  successSubtitle: { color: '#555', fontSize: 14, marginBottom: 32 },
  receiptCard: { width: '100%', backgroundColor: '#0d0d0d', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1a2210', marginBottom: 24 },
  receiptTitle: { color: '#4B5320', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#111' },
  receiptLabel: { color: '#555', fontSize: 12 },
  receiptValue: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  homeBtn: { width: '100%', height: 56, borderRadius: 16, overflow: 'hidden' },
  homeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },

  backBtn: { position: 'absolute', top: 14, left: 20, padding: 8 },
  backText: { color: '#4B5320', fontWeight: 'bold', fontSize: 13 },
});