import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ImageBackground, Dimensions, FlatList, Image, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

const LOOKBOOK_DATA = [
  { id: '1', title: 'AMERICANO',  img: 'https://i.pinimg.com/736x/a1/fa/e1/a1fae104675677cab2c00a742d60c3df.jpg' },
  { id: '2', title: 'BARBA',      img: 'https://img.freepik.com/fotos-gratis/jovem-arrumando-a-barba-no-barbeiro_23-2148985728.jpg' },
  { id: '3', title: 'MOICANO',    img: 'https://i.pinimg.com/736x/0d/c6/94/0dc6949a520f4553cc59a3317d6b0869.jpg' },
  { id: '4', title: 'CORTE V',    img: 'https://www.fashionbubbles.com/wp-content/uploads/2024/10/cabelo-em-v-masculino-1.jpg' },
];

export default function HomeScreen({ navigation }) {
  const { user, supabase } = useAuth();
  const [isOpen,   setIsOpen]   = useState(null); // null = carregando
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      // Busca o barbeiro
      const { data: barber } = await supabase
        .from('profiles').select('id').eq('role', 'barber').limit(1).single();

      if (!barber) { setIsOpen(true); setLoading(false); return; }

      // Verifica se barbearia está fechada
      const { data: blocks } = await supabase
        .from('blocked_slots')
        .select('type')
        .eq('barber_id', barber.id)
        .eq('type', 'closed');

      setIsOpen(!blocks || blocks.length === 0);
    } catch (e) {
      console.warn('Erro ao buscar status:', e);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = () => {
    if (!isOpen) return;
    navigation.navigate('Appointment');
  };

  const LookbookItem = ({ item }) => (
    <View style={s.lookbookCard}>
      <Image source={{ uri: item.img }} style={s.lookbookImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={s.lookbookGradient}>
        <Text style={s.lookbookTitle}>{item.title}</Text>
      </LinearGradient>
    </View>
  );

  const MenuCard = ({ title, description, imageUrl, onPress, disabled }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={[s.cardWrapper, disabled && { opacity: 0.4 }]}
      disabled={disabled}
    >
      <ImageBackground
        source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
        style={s.cardBg}
        imageStyle={{ borderRadius: 15 }}
      >
        <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']} style={s.cardGradient}>
          <View style={s.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardMainTitle}>{title}</Text>
              <Text style={s.cardSubTitle}>{description}</Text>
            </View>
            <View style={s.cardIconBox}>
              <Text style={{ color: '#FFF', fontSize: 12 }}>▶</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const initials = user?.name?.charAt(0).toUpperCase() || 'S';

  return (
    <View style={s.mainContainer}>
      <LinearGradient colors={['#000', '#12140d', '#000']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={s.header}>
          <View>
            <Text style={s.welcomeText}>OPERADOR ATIVO</Text>
            <Text style={s.userName}>{user?.name?.toUpperCase() || 'BEM VINDO'}</Text>
          </View>
          <View style={s.avatarGlow}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* STATUS DA BARBEARIA */}
        {loading ? (
          <View style={s.statusLoading}>
            <ActivityIndicator color="#6B8E23" size="small" />
            <Text style={s.statusLoadingText}>Verificando status...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[s.statusCard, { borderColor: isOpen ? '#4B5320' : '#5c2a2a' }]}
            onPress={fetchStatus}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isOpen ? ['#0d1208', '#000'] : ['#1a0808', '#000']}
              style={StyleSheet.absoluteFill}
              borderRadius={16}
            />
            <View style={s.statusLeft}>
              <View style={[s.statusDot, { backgroundColor: isOpen ? '#4B5320' : '#8E2a2a' }]}>
                <Text style={s.statusDotIcon}>{isOpen ? '✓' : '✕'}</Text>
              </View>
              <View>
                <Text style={s.statusTitle}>
                  {isOpen ? 'Barbearia Aberta' : 'Barbearia Fechada'}
                </Text>
                <Text style={s.statusSub}>
                  {isOpen
                    ? 'Agendamentos disponíveis agora'
                    : 'Não aceitando agendamentos no momento'}
                </Text>
              </View>
            </View>
            <View style={[s.statusBadge, { backgroundColor: isOpen ? '#1a2210' : '#2a1010' }]}>
              <Text style={[s.statusBadgeText, { color: isOpen ? '#6B8E23' : '#8E4444' }]}>
                {isOpen ? 'ABERTO' : 'FECHADO'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* GALERIA */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>GALERIA DE ESTILOS</Text>
          <View style={s.liveBadge}><Text style={s.liveText}>TRENDS</Text></View>
        </View>

        <FlatList
          data={LOOKBOOK_DATA}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          snapToInterval={215}
          decelerationRate="fast"
          contentContainerStyle={{ marginBottom: 30 }}
          renderItem={({ item }) => <LookbookItem item={item} />}
        />

        {/* MENU */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>CENTRAL DE COMANDO</Text>
        </View>

        {/* Card Agendar — desabilitado se fechado */}
        <TouchableOpacity
          onPress={handleAgendar}
          activeOpacity={isOpen ? 0.8 : 1}
          style={[s.cardWrapper, !isOpen && s.cardDisabled]}
        >
          <ImageBackground
            source={require('../assets/agendar.png')}
            style={s.cardBg}
            imageStyle={{ borderRadius: 15 }}
          >
            <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']} style={s.cardGradient}>
              <View style={s.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardMainTitle}>AGENDAR CORTE</Text>
                  <Text style={s.cardSubTitle}>
                    {isOpen ? 'Reserve seu horário agora.' : '🔴 Barbearia fechada no momento'}
                  </Text>
                </View>
                <View style={[s.cardIconBox, !isOpen && { backgroundColor: 'rgba(142,42,42,0.9)' }]}>
                  <Text style={{ color: '#FFF', fontSize: 12 }}>{isOpen ? '▶' : '🔒'}</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <MenuCard
          title="ANÁLISE COM IA"
          description="Análise de perfil facial e recomendação de corte"
          imageUrl={require('../assets/ia.png')}
          onPress={() => navigation.navigate('PhotoUpload')}
        />

        <MenuCard
          title="HISTÓRICO DE CORTES"
          description="Todos os seus cortes anteriores"
          imageUrl={require('../assets/historico.png')}
          onPress={() => navigation.navigate('MyAppointments')}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 20, paddingBottom: 120, paddingTop: 0 },

  header:      { marginTop: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
  userName:    { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  avatarGlow:  { width: 45, height: 45, borderRadius: 25, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#4B5320' },
  avatarText:  { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  statusLoading:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  statusLoadingText: { color: '#555', fontSize: 12 },
  statusCard:  { borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' },
  statusLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusDot:   { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statusDotIcon: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  statusTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 3 },
  statusSub:   { color: '#555', fontSize: 11 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusBadgeText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  sectionTitle:  { color: '#4B5320', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  liveBadge:     { backgroundColor: '#4B5320', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  liveText:      { color: '#FFF', fontSize: 8, fontWeight: 'bold' },

  lookbookCard:     { width: 150, height: 150, marginRight: 15, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111' },
  lookbookImage:    { width: '100%', height: '100%' },
  lookbookGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, justifyContent: 'center', paddingLeft: 15 },
  lookbookTitle:    { color: '#FFF', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },

  cardWrapper:  { height: 115, width: '100%', marginBottom: 15, borderRadius: 20 },
  cardDisabled: { opacity: 0.5 },
  cardBg:       { flex: 1 },
  cardGradient: { flex: 1, justifyContent: 'flex-end', padding: 18, borderRadius: 20 },
  cardContent:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMainTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cardSubTitle:  { color: '#CCC', fontSize: 11 },
  cardIconBox:   { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(75,83,32,0.9)', justifyContent: 'center', alignItems: 'center' },
});