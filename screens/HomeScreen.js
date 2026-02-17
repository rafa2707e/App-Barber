import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user;

  const MenuCard = ({ title, description, imageUrl, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardWrapper}>
      <ImageBackground source={{ uri: imageUrl }} style={styles.cardBg} imageStyle={{ borderRadius: 25 }}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubTitle}>{description}</Text>
            </View>
            <View style={styles.cardIconBox}>
               <Text style={{color: '#FFF', fontSize: 12}}>➔</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#050505', '#12140d']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Luxo */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>OPERADOR ATIVO</Text>
            <Text style={styles.userName}>{user?.name?.toUpperCase() || 'RECRUTA'}</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* Card de Próxima Missão Estilizado */}
        <View style={styles.nextMission}>
           <Text style={styles.nextMissionLabel}>PRÓXIMO OBJETIVO</Text>
           <Text style={styles.nextMissionDate}>HOJE ÀS 14:30 - <Text style={{color: '#4B5320'}}>SGT. JOÃO</Text></Text>
        </View>

        <MenuCard 
          title="AGENDAR CORTE"
          description="Inicie um novo agendamento tático."
          imageUrl="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500"
          onPress={() => navigation.navigate('Appointment')}
        />

        <MenuCard 
          title="VISAGISMO IA"
          description="Escaneamento facial para melhor camuflagem."
          imageUrl="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=500"
          onPress={() => navigation.navigate('PhotoUpload')}
        />

        <MenuCard 
          title="HISTÓRICO"
          description="Verifique o relatório de missões passadas."
          imageUrl="https://images.unsplash.com/photo-1512690118299-a9a7504168e7?q=80&w=500"
          onPress={() => navigation.navigate('MyAppointments')}
        />
      </ScrollView>

      {/* O SEU MENU FLUTUANTE PREMIUM */}
      <View style={styles.floatingTabContainer}>
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem}><Text style={styles.tabIcon}>🏠</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MyAppointments')}><Text style={styles.tabIcon}>📜</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.tabIcon}>👤</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  scrollContent: { padding: 25, paddingBottom: 120 },
  header: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4B5320', borderWidth: 2, borderColor: 'rgba(75, 83, 32, 0.4)' },
  
  nextMission: { padding: 20, backgroundColor: 'rgba(75, 83, 32, 0.1)', borderRadius: 20, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(75, 83, 32, 0.2)' },
  nextMissionLabel: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  nextMissionDate: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  cardWrapper: { height: 160, width: '100%', marginBottom: 20, elevation: 15 },
  cardBg: { flex: 1 },
  cardGradient: { flex: 1, justifyContent: 'flex-end', padding: 20, borderRadius: 25 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  cardSubTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  cardIconBox: { width: 35, height: 35, borderRadius: 10, backgroundColor: 'rgba(75, 83, 32, 0.8)', justifyContent: 'center', alignItems: 'center' },

  floatingTabContainer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  bottomTab: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.5)',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#4B5320',
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  tabIcon: { fontSize: 22 }
});