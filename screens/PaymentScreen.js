import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  Animated, ScrollView, Dimensions, Clipboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Serviços disponíveis
const SERVICES = [
  { id: '1', name: 'Corte Simples',    price: 35 },
  { id: '2', name: 'Corte + Barba',    price: 55 },
  { id: '3', name: 'Degradê',          price: 45 },
  { id: '4', name: 'Visagismo Completo', price: 80 },
  { id: '5', name: 'Barba',            price: 25 },
];

// Chave PIX fictícia (substitua pela real em produção)
const PIX_KEY = '00020126580014br.gov.bcb.pix0136estudio-hair@pix.com.br5204000053039865802BR5925STUDIO HAIR BARBEARIA6009SAO PAULO62140510StudioHair6304ABCD';

export default function PaymentScreen({ navigation, route }) {
  const { selectedTime, selectedDate, barber } = route?.params || {};

  const [step, setStep] = useState('service');   // 'service' | 'method' | 'pix' | 'card' | 'success'
  const [selectedService, setSelectedService] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [processing, setProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      callback();
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleConfirmPayment = (method) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      fadeTransition(() => setStep('success'));
    }, 2000);
  };

  const copyPix = () => {
    Clipboard.setString(PIX_KEY);
    Alert.alert('Copiado!', 'Chave PIX copiada para a área de transferência.');
  };

  // ─── ECRÃ: Selecionar Serviço ────────────────────────────────────────────
  const renderServiceStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.stepLabel}>PASSO 1 DE 2</Text>
      <Text style={styles.title}>Qual serviço?</Text>
      <Text style={styles.subtitle}>Selecione o que vai fazer hoje</Text>

      {SERVICES.map(s => (
        <TouchableOpacity
          key={s.id}
          style={[styles.serviceCard, selectedService?.id === s.id && styles.serviceCardSelected]}
          onPress={() => setSelectedService(s)}
        >
          <Text style={styles.serviceName}>{s.name}</Text>
          <View style={[styles.priceTag, selectedService?.id === s.id && styles.priceTagSelected]}>
            <Text style={styles.priceText}>R$ {s.price}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.primaryBtn, !selectedService && styles.disabledBtn]}
        disabled={!selectedService}
        onPress={() => fadeTransition(() => setStep('method'))}
      >
        <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientBtn}>
          <Text style={styles.primaryBtnText}>ESCOLHER FORMA DE PAGAMENTO →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── ECRÃ: Escolher Método ───────────────────────────────────────────────
  const renderMethodStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.stepLabel}>PASSO 2 DE 2</Text>
      <Text style={styles.title}>Como pagar?</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>SERVIÇO</Text>
        <Text style={styles.summaryValue}>{selectedService?.name}</Text>
        <View style={styles.summaryDivider} />
        <Text style={styles.summaryLabel}>TOTAL</Text>
        <Text style={styles.summaryTotal}>R$ {selectedService?.price},00</Text>
        {selectedDate && <Text style={styles.summaryMeta}>📅 {selectedDate.split('-').reverse().join('/')}  {selectedTime && `⏰ ${selectedTime}`}</Text>}
        {barber && <Text style={styles.summaryMeta}>✂️ {barber.name}</Text>}
      </View>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => fadeTransition(() => setStep('pix'))}
      >
        <Text style={styles.methodIcon}>⚡</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.methodTitle}>PIX</Text>
          <Text style={styles.methodSubtitle}>Pagamento instantâneo • Aprovação imediata</Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => fadeTransition(() => setStep('card'))}
      >
        <Text style={styles.methodIcon}>💳</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.methodTitle}>Cartão de Crédito</Text>
          <Text style={styles.methodSubtitle}>Visa, Mastercard, Elo • Até 3x sem juros</Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, { borderColor: '#333' }]}
        onPress={() => {
          Alert.alert('Agendado!', 'Pagamento será feito no local. Seu horário está reservado!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        }}
      >
        <Text style={styles.methodIcon}>🏪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.methodTitle}>Pagar no Local</Text>
          <Text style={styles.methodSubtitle}>Pague na barbearia no dia do corte</Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => fadeTransition(() => setStep('service'))}>
        <Text style={styles.backLinkText}>← Voltar</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── ECRÃ: PIX ──────────────────────────────────────────────────────────
  const renderPixStep = () => (
    <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
      <Text style={styles.title}>Pagamento via PIX</Text>
      <Text style={styles.subtitle}>Escaneie o QR Code ou copie a chave</Text>

      {/* QR Code simulado visualmente */}
      <View style={styles.qrContainer}>
        <View style={styles.qrBox}>
          <Text style={styles.qrPlaceholder}>▣</Text>
          <Text style={styles.qrLabel}>QR CODE PIX</Text>
          <Text style={styles.qrAmount}>R$ {selectedService?.price},00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.pixCopyBtn} onPress={copyPix}>
        <Text style={styles.pixCopyText}>📋  COPIAR CHAVE PIX</Text>
      </TouchableOpacity>

      <View style={styles.pixKeyBox}>
        <Text style={styles.pixKeyLabel}>CHAVE PIX</Text>
        <Text style={styles.pixKeyValue} numberOfLines={2}>estudio-hair@pix.com.br</Text>
      </View>

      <View style={styles.pixSteps}>
        <Text style={styles.pixStepText}>1. Abra o app do seu banco</Text>
        <Text style={styles.pixStepText}>2. Escaneie o QR Code ou cole a chave</Text>
        <Text style={styles.pixStepText}>3. Confirme o valor: <Text style={{ color: '#6B8E23', fontWeight: 'bold' }}>R$ {selectedService?.price},00</Text></Text>
        <Text style={styles.pixStepText}>4. Toque em "Já paguei" abaixo</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => handleConfirmPayment('PIX')}
        disabled={processing}
      >
        <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientBtn}>
          <Text style={styles.primaryBtnText}>{processing ? 'VERIFICANDO...' : 'JÁ PAGUEI ✓'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => fadeTransition(() => setStep('method'))}>
        <Text style={styles.backLinkText}>← Voltar</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── ECRÃ: Cartão ───────────────────────────────────────────────────────
  const renderCardStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.title}>Cartão de Crédito</Text>

      {/* Card visual preview */}
      <LinearGradient colors={['#2d3314', '#4B5320']} style={styles.cardPreview}>
        <Text style={styles.cardPreviewNumber}>
          {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <Text style={styles.cardPreviewLabel}>{cardName || 'NOME NO CARTÃO'}</Text>
          <Text style={styles.cardPreviewLabel}>{cardExpiry || 'MM/AA'}</Text>
        </View>
      </LinearGradient>

      <View style={styles.cardField}>
        <Text style={styles.fieldLabel}>NÚMERO DO CARTÃO</Text>
        <View style={styles.fieldInput}>
          <Text
            style={styles.fieldText}
            onPress={() => {}}
          >{cardNumber || '                '}</Text>
        </View>
      </View>

      {/* Nota: Em produção use TextInput real — simplificado aqui para demo */}
      <Text style={styles.cardNote}>
        💡 Integre com Stripe, Mercado Pago ou Adyen para processamento real de cartão.
      </Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => handleConfirmPayment('Cartão')}
        disabled={processing}
      >
        <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientBtn}>
          <Text style={styles.primaryBtnText}>{processing ? 'PROCESSANDO...' : `PAGAR R$ ${selectedService?.price},00`}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => fadeTransition(() => setStep('method'))}>
        <Text style={styles.backLinkText}>← Voltar</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── ECRÃ: Sucesso ──────────────────────────────────────────────────────
  const renderSuccessStep = () => (
    <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', paddingTop: 40 }}>
      <View style={styles.successIcon}>
        <Text style={{ fontSize: 50 }}>✅</Text>
      </View>
      <Text style={styles.successTitle}>PAGAMENTO CONFIRMADO!</Text>
      <Text style={styles.successSubtitle}>O seu corte está agendado.</Text>

      <View style={styles.receiptBox}>
        <Text style={styles.receiptTitle}>COMPROVANTE</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Serviço</Text>
          <Text style={styles.receiptValue}>{selectedService?.name}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Valor</Text>
          <Text style={styles.receiptValue}>R$ {selectedService?.price},00</Text>
        </View>
        {selectedDate && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Data</Text>
            <Text style={styles.receiptValue}>{selectedDate.split('-').reverse().join('/')}</Text>
          </View>
        )}
        {selectedTime && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Horário</Text>
            <Text style={styles.receiptValue}>{selectedTime}</Text>
          </View>
        )}
        {barber && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Barbeiro</Text>
            <Text style={styles.receiptValue}>{barber.name}</Text>
          </View>
        )}
        <View style={[styles.receiptRow, { borderTopWidth: 1, borderTopColor: '#333', marginTop: 8, paddingTop: 8 }]}>
          <Text style={[styles.receiptLabel, { color: '#6B8E23', fontWeight: 'bold' }]}>STATUS</Text>
          <Text style={[styles.receiptValue, { color: '#6B8E23' }]}>✓ PAGO</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <LinearGradient colors={['#4B5320', '#2d3314']} style={styles.gradientBtn}>
          <Text style={styles.primaryBtnText}>VOLTAR AO INÍCIO</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#0d0f08', '#000']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 'service' && renderServiceStep()}
        {step === 'method'  && renderMethodStep()}
        {step === 'pix'     && renderPixStep()}
        {step === 'card'    && renderCardStep()}
        {step === 'success' && renderSuccessStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 60 },

  stepLabel: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  subtitle: { color: '#666', marginBottom: 25, fontSize: 13 },

  // Serviços
  serviceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#111', borderRadius: 14, padding: 18, marginBottom: 10,
    borderWidth: 1, borderColor: '#222'
  },
  serviceCardSelected: { borderColor: '#6B8E23', backgroundColor: '#1a1f0a' },
  serviceName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  priceTag: { backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  priceTagSelected: { backgroundColor: '#4B5320' },
  priceText: { color: '#FFF', fontWeight: 'bold' },

  // Método
  summaryBox: {
    backgroundColor: '#111', borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a'
  },
  summaryLabel: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  summaryValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  summaryDivider: { height: 1, backgroundColor: '#222', marginVertical: 12 },
  summaryTotal: { color: '#6B8E23', fontSize: 28, fontWeight: 'bold', marginTop: 2 },
  summaryMeta: { color: '#555', fontSize: 12, marginTop: 8 },

  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#111', borderRadius: 14, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: '#4B5320'
  },
  methodIcon: { fontSize: 26 },
  methodTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  methodSubtitle: { color: '#555', fontSize: 11, marginTop: 2 },
  methodArrow: { color: '#6B8E23', fontSize: 24 },

  // PIX
  qrContainer: { marginVertical: 20 },
  qrBox: {
    width: 180, height: 180, backgroundColor: '#111', borderRadius: 20,
    borderWidth: 2, borderColor: '#4B5320', justifyContent: 'center', alignItems: 'center'
  },
  qrPlaceholder: { fontSize: 80, color: '#4B5320' },
  qrLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginTop: 4 },
  qrAmount: { color: '#6B8E23', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  pixCopyBtn: {
    backgroundColor: '#1a1f0a', borderWidth: 1, borderColor: '#4B5320',
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 30, marginBottom: 16
  },
  pixCopyText: { color: '#6B8E23', fontWeight: 'bold', fontSize: 14 },
  pixKeyBox: {
    backgroundColor: '#111', borderRadius: 12, padding: 14, width: '100%', marginBottom: 20
  },
  pixKeyLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  pixKeyValue: { color: '#FFF', fontSize: 13, marginTop: 4 },
  pixSteps: { width: '100%', backgroundColor: '#0d0d0d', borderRadius: 12, padding: 16, marginBottom: 24 },
  pixStepText: { color: '#888', fontSize: 13, marginBottom: 8 },

  // Cartão
  cardPreview: {
    borderRadius: 18, padding: 24, marginBottom: 24, height: 120, justifyContent: 'center'
  },
  cardPreviewNumber: { color: '#FFF', fontSize: 18, letterSpacing: 3, fontWeight: '300' },
  cardPreviewLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  cardField: { marginBottom: 14 },
  fieldLabel: { color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6 },
  fieldInput: {
    backgroundColor: '#111', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#2a2a2a'
  },
  fieldText: { color: '#666', fontSize: 15 },
  cardNote: { color: '#444', fontSize: 11, textAlign: 'center', marginBottom: 24, lineHeight: 18 },

  // Sucesso
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#6B8E23', marginBottom: 8 },
  successSubtitle: { color: '#666', fontSize: 14, marginBottom: 30 },
  receiptBox: {
    backgroundColor: '#111', borderRadius: 16, padding: 20, width: '100%',
    borderWidth: 1, borderColor: '#222', marginBottom: 30
  },
  receiptTitle: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  receiptLabel: { color: '#666', fontSize: 13 },
  receiptValue: { color: '#FFF', fontSize: 13, fontWeight: '600' },

  // Botões
  primaryBtn: { width: '100%', height: 58, borderRadius: 16, overflow: 'hidden', marginTop: 8, marginBottom: 8 },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  disabledBtn: { opacity: 0.3 },
  backLink: { alignItems: 'center', marginTop: 12, paddingVertical: 8 },
  backLinkText: { color: '#4B5320', fontWeight: 'bold' },
});