import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
  TouchableOpacity, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CLIENT_SLIDES = [
  {
    icon:   '✂️',
    title:  'Bem-vindo ao\nStudio Hair',
    sub:    'A barbearia premium\nna palma da sua mão',
    color1: '#0a0f05',
    color2: '#1a2210',
    accent: '#6B8E23',
    tag:    'STUDIO HAIR',
  },
  {
    icon:   '📅',
    title:  'Agende em\nSegundos',
    sub:    'Escolha o dia e horário perfeito\nsem filas, sem espera, sem stress',
    color1: '#050a0f',
    color2: '#101a22',
    accent: '#4B8E8E',
    tag:    'AGENDAMENTO',
  },
  {
    icon:   '🤖',
    title:  'Inteligência\nArtificial',
    sub:    'O app aprende seus cortes favoritos\ne sugere o melhor horário para você',
    color1: '#0a0510',
    color2: '#1a1030',
    accent: '#8E4B8E',
    tag:    'IA NO APP',
  },
  {
    icon:   '⚡',
    title:  'Pague com\nPIX na hora',
    sub:    'Pagamento instantâneo e seguro\nAgendamento confirmado em segundos',
    color1: '#0f0a05',
    color2: '#221a10',
    accent: '#8E7A4B',
    tag:    'PAGAMENTO',
  },
];

const BARBER_SLIDES = [
  {
    icon:   '✂️',
    title:  'Bem-vindo,\nBarbeiro!',
    sub:    'Gerencie sua barbearia com\nprofissionalismo e tecnologia',
    color1: '#0a0f05',
    color2: '#1a2210',
    accent: '#6B8E23',
    tag:    'STUDIO HAIR PRO',
  },
  {
    icon:   '📅',
    title:  'Agenda\nCompleta',
    sub:    'Veja todos os horários agendados\nem tempo real, direto no app',
    color1: '#050a0f',
    color2: '#101a22',
    accent: '#4B8E8E',
    tag:    'AGENDA',
  },
  {
    icon:   '🗓️',
    title:  'Flexibilidade\nTotal',
    sub:    'Bloqueie dias de folga, feriados\ne defina sua própria grade de horários',
    color1: '#0a0510',
    color2: '#1a1030',
    accent: '#8E4B8E',
    tag:    'FLEXIBILIDADE',
  },
  {
    icon:   '💰',
    title:  'PIX Direto\nno App',
    sub:    'Clientes pagam pelo app antes do corte\nChega de esperar pagamento na hora',
    color1: '#050f05',
    color2: '#102210',
    accent: '#4B8E5A',
    tag:    'FINANCEIRO',
  },
  {
    icon:   '🤖',
    title:  'IA para\nBarbeiros',
    sub:    'Relatórios inteligentes, previsão\nde movimento e dicas para crescer',
    color1: '#0a0510',
    color2: '#1a1030',
    accent: '#8E4B8E',
    tag:    'INTELIGÊNCIA',
  },
  {
    icon:   '📊',
    title:  'Controle\nFinanceiro',
    sub:    'Veja quanto ganhou hoje, na semana\ne no mês. Tudo organizado para você',
    color1: '#0f0a05',
    color2: '#221a10',
    accent: '#8E7A4B',
    tag:    'DASHBOARD',
  },
];

export default function OnboardingScreen({ role = 'client', onFinish }) {
  const SLIDES = role === 'barber' ? BARBER_SLIDES : CLIENT_SLIDES;
  const [slide, setSlide] = useState(0);

  const iconScale    = useRef(new Animated.Value(0)).current;
  const iconRotate   = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY       = useRef(new Animated.Value(40)).current;
  const subOpacity   = useRef(new Animated.Value(0)).current;
  const subY         = useRef(new Animated.Value(20)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const btnScale     = useRef(new Animated.Value(0.8)).current;
  const particle1    = useRef(new Animated.Value(0)).current;
  const particle2    = useRef(new Animated.Value(0)).current;
  const particle3    = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { animateSlide(); }, [slide]);

  const animateSlide = () => {
    iconScale.setValue(0);
    iconRotate.setValue(0);
    titleOpacity.setValue(0);
    titleY.setValue(40);
    subOpacity.setValue(0);
    subY.setValue(20);
    btnOpacity.setValue(0);
    btnScale.setValue(0.8);
    particle1.setValue(0);
    particle2.setValue(0);
    particle3.setValue(0);

    Animated.timing(progressAnim, {
      toValue: (slide + 1) / SLIDES.length,
      duration: 400,
      useNativeDriver: false,
    }).start();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale,  { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
        Animated.timing(iconRotate, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.stagger(100, [
          Animated.timing(particle1, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(particle2, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(particle3, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(titleY,       { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(subY,       { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(btnScale,   { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      onFinish();
    }
  };

  const current = SLIDES[slide];
  const isLast  = slide === SLIDES.length - 1;

  const spin = iconRotate.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
  });
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  const p1Y = particle1.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
  const p1O = particle1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });
  const p2Y = particle2.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const p2O = particle2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });
  const p3Y = particle3.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });
  const p3O = particle3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <LinearGradient
        colors={['#000', current.color1, current.color2, '#000']}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.3, 0.7, 1]}
      />

      <View style={[s.circle, s.circle1, { borderColor: current.accent + '15' }]} />
      <View style={[s.circle, s.circle2, { borderColor: current.accent + '10' }]} />
      <View style={[s.circle, s.circle3, { borderColor: current.accent + '08' }]} />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={s.skipBtn} onPress={onFinish}>
          <Text style={s.skipText}>Pular</Text>
        </TouchableOpacity>
      )}

      {/* Slide indicator */}
      <View style={s.slideIndicator}>
        <Text style={[s.slideTag, { color: current.accent }]}>{current.tag}</Text>
        <Text style={s.slideCount}>{slide + 1} / {SLIDES.length}</Text>
      </View>

      {/* Conteúdo */}
      <View style={s.content}>
        <View style={s.iconWrapper}>
          <Animated.Text style={[s.particle, { transform: [{ translateY: p1Y }, { translateX: -30 }], opacity: p1O }]}>✨</Animated.Text>
          <Animated.Text style={[s.particle, { transform: [{ translateY: p2Y }, { translateX: 30 }],  opacity: p2O }]}>⭐</Animated.Text>
          <Animated.Text style={[s.particle, { transform: [{ translateY: p3Y }, { translateX: 0 }],   opacity: p3O }]}>💫</Animated.Text>

          <View style={[s.iconRing, { borderColor: current.accent + '40' }]}>
            <LinearGradient colors={[current.color2, '#000']} style={s.iconBg}>
              <Animated.Text style={[s.iconText, { transform: [{ scale: iconScale }, { rotate: spin }] }]}>
                {current.icon}
              </Animated.Text>
            </LinearGradient>
          </View>
        </View>

        <Animated.Text style={[s.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
          {current.title}
        </Animated.Text>

        <Animated.Text style={[s.sub, { opacity: subOpacity, transform: [{ translateY: subY }] }]}>
          {current.sub}
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.progressBar}>
          <Animated.View style={[s.progressFill, { width: progressWidth, backgroundColor: current.accent }]} />
        </View>

        <View style={s.dots}>
          {SLIDES.map((sl, i) => (
            <TouchableOpacity key={i} onPress={() => setSlide(i)}>
              <View style={[
                s.dot,
                { backgroundColor: i === slide ? current.accent : '#222' },
                i === slide && { width: 24 },
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View style={[s.btnWrapper, { opacity: btnOpacity, transform: [{ scale: btnScale }] }]}>
          <TouchableOpacity style={s.btn} onPress={handleNext}>
            <LinearGradient
              colors={[current.accent, current.accent + 'AA']}
              style={s.btnGrad}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={s.btnText}>
                {isLast ? '🚀  VAMOS LÁ!' : 'PRÓXIMO  →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  circle:    { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  circle1:   { width: 300, height: 300, top: height * 0.1,   left: -80   },
  circle2:   { width: 400, height: 400, top: height * 0.3,   right: -120 },
  circle3:   { width: 500, height: 500, bottom: height * 0.1, left: -150  },

  skipBtn:  { position: 'absolute', top: 52, right: 24, zIndex: 10, padding: 8 },
  skipText: { color: '#555', fontSize: 13, fontWeight: '600' },

  slideIndicator: { position: 'absolute', top: 52, left: 24, flexDirection: 'row', alignItems: 'center', gap: 10 },
  slideTag:       { fontSize: 9, fontWeight: 'bold', letterSpacing: 2 },
  slideCount:     { color: '#333', fontSize: 11 },

  content:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconWrapper: { marginBottom: 36, alignItems: 'center', justifyContent: 'center' },
  iconRing:    { width: 150, height: 150, borderRadius: 75, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  iconBg:      { width: 128, height: 128, borderRadius: 64, justifyContent: 'center', alignItems: 'center' },
  iconText:    { fontSize: 60 },
  particle:    { position: 'absolute', fontSize: 16 },

  title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 16, letterSpacing: 0.5, lineHeight: 44 },
  sub:   { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 26 },

  footer:       { paddingHorizontal: 32, paddingBottom: 52 },
  progressBar:  { height: 2, backgroundColor: '#111', borderRadius: 2, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  dots:         { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 },
  dot:          { width: 8, height: 8, borderRadius: 4 },
  btnWrapper:   { borderRadius: 18, overflow: 'hidden' },
  btn:          { borderRadius: 18, overflow: 'hidden' },
  btnGrad:      { paddingVertical: 18, alignItems: 'center', borderRadius: 18 },
  btnText:      { color: '#FFF', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
});