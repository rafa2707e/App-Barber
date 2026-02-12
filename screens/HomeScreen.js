import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user;

  // Função para renderizar os cards da lista principal
  const MenuCard = ({ title, description, imageUrl, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <ImageBackground 
        source={{ uri: imageUrl }} 
        style={styles.cardBg} 
        // Aumentei a opacidade para 0.7 para as imagens ficarem bem mais fortes
        imageStyle={{ borderRadius: 15, opacity: 0.7 }}
      >
        <View style={styles.cardOverlay}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
          <View style={styles.arrowCircle}>
             <Text style={styles.cardArrow}>▶</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HEADER - PERFIL */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.welcome}>Bem-vindo, Soldado</Text>
              <Text style={styles.name}>{user?.name || 'Recruta'}</Text>
            </View>
          </View>
        </View>

        {/* STATUS RÁPIDO */}
        <View style={styles.missionInfo}>
          <Text style={styles.missionText}>Próximo Corte: <Text style={{color: '#FFF'}}>15 FEV - 14:30h</Text></Text>
        </View>

        {/* LISTA DE OPÇÕES COM IMAGENS VIVAS */}
        <MenuCard 
          title="AGENDAR MISSÃO"
          description="Selecione seu barbeiro e o horário operacional."
          imageUrl="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500" 
          onPress={() => navigation.navigate('BarberSelection')}
        />

        <MenuCard 
          title="ANÁLISE VISAGISTA"
          description="Inteligência artificial para camuflagem e estilo."
          imageUrl="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=500"
          onPress={() => navigation.navigate('PhotoUpload')}
        />

        <MenuCard 
          title="HISTÓRICO DE CORTES"
          description="Relatório de missões e estilos anteriores."
          imageUrl="https://images.unsplash.com/photo-1512690118299-a9a7504168e7?q=80&w=500"
          onPress={() => navigation.navigate('MyAppointments')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>ENCERRAR SESSÃO</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MENU DE NAVEGAÇÃO INFERIOR ÚNICO */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabTextActive}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MyAppointments')}>
          <Text style={styles.tabIcon}>📜</Text>
          <Text style={styles.tabText}>Histórico</Text>
        </TouchableOpacity>

        {user?.role === 'barber' && (
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('BarberAgenda')}>
            <Text style={styles.tabIcon}>💈</Text>
            <Text style={styles.tabText}>Agenda</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabText}>Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4B5320', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  welcome: { color: '#4B5320', fontSize: 12, fontWeight: 'bold' },
  name: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  missionInfo: { marginBottom: 25, paddingLeft: 5 },
  missionText: { color: '#4B5320', fontSize: 14, fontWeight: 'bold' },

  // Estilo dos Cards
  cardContainer: {
    height: 120, // Aumentei um pouco a altura para destacar a foto
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#0A0A0A',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4B5320',
    elevation: 8,
    shadowColor: '#4B5320',
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  cardBg: { flex: 1, justifyContent: 'center' },
  cardOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', // Menos opacidade no overlay para a foto brilhar
    borderRadius: 15,
  },
  cardTitle: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10 
  },
  cardDescription: { 
    color: '#FFF', // Texto em branco para melhor leitura sobre a imagem viva
    fontSize: 11, 
    marginTop: 4,
    fontWeight: '500'
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(75, 83, 32, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardArrow: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  logoutButton: { marginTop: 10, alignItems: 'center', padding: 20 },
  logoutText: { color: '#333', fontSize: 11, fontWeight: 'bold' },

  // Menu Inferior Unificado
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    height: 75,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 2,
    borderTopColor: '#4B5320',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 15,
  },
  tabItem: { alignItems: 'center' },
  tabIcon: { fontSize: 22, marginBottom: 4 },
  tabText: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  tabTextActive: { color: '#4B5320', fontSize: 10, fontWeight: 'bold' }
});