import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// LINKS DE IMAGENS MAIS ESTÁVEIS
const LOOKBOOK_DATA = [
  { id: '1', title: 'AMERICANO ', img: 'https://i.pinimg.com/736x/a1/fa/e1/a1fae104675677cab2c00a742d60c3df.jpg' },
  { id: '2', title: 'BARBA ', img: 'https://img.freepik.com/fotos-gratis/jovem-arrumando-a-barba-no-barbeiro_23-2148985728.jpg' },
  { id: '3', title: 'MOICANO', img: 'https://i.pinimg.com/736x/0d/c6/94/0dc6949a520f4553cc59a3317d6b0869.jpg' },
  { id: '4', title: 'CORTE V', img: 'https://www.fashionbubbles.com/wp-content/uploads/2024/10/cabelo-em-v-masculino-1.jpg' },
];

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user;

  const LookbookItem = ({ item }) => (
    <View style={styles.lookbookCard}>
      <Image source={{ uri: item.img }} style={styles.lookbookImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.lookbookGradient}>
        <Text style={styles.lookbookTitle}>{item.title}</Text>
      </LinearGradient>
    </View>
  );

  const MenuCard = ({ title, description, imageUrl, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.cardWrapper}>
    <ImageBackground 
      // Esta linha abaixo é o segredo: ela detecta se é require() ou link de internet
      source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
      style={styles.cardBg} 
      imageStyle={{ borderRadius: 15 }}
    >
      <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']} style={styles.cardGradient}>
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardMainTitle}>{title}</Text>
            <Text style={styles.cardSubTitle}>{description}</Text>
          </View>
          <View style={styles.cardIconBox}>
             <Text style={{color: '#FFF', fontSize: 12}}>▶</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#000', '#12140d', '#000']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>OPERADOR ATIVO</Text>
            <Text style={styles.userName}>{user?.name?.toUpperCase() || 'RECRUTA'}</Text>
          </View>
          <View style={styles.avatarGlow}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'S'}</Text>
          </View>
        </View>

        {/* CARROSSEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>GALERIA DE ESTILOS</Text>
          <View style={styles.liveBadge}><Text style={styles.liveText}>TRENDS</Text></View>
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


       {/* LISTA DE COMANDOS COM OS NOMES REAIS DA PASTA */}
<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>CENTRAL DE COMANDO</Text>
</View>

<MenuCard 
  title="AGENDAR CORTE"
  description="Reserve seu horário agora."
  // USE EXATAMENTE ASSIM (Caminho Relativo):
  imageUrl={require('../assets/agendar.png')} 
  onPress={() => navigation.navigate('Appointment')}
/>

<MenuCard 
  title="RECOMENDAÇÃO COM IA"
  description="Análise de perfil facial."
  // USE EXATAMENTE ASSIM:
  imageUrl={require('../assets/ia.png')} 
  onPress={() => navigation.navigate('PhotoUpload')}
/>

<MenuCard 
  title="HISTÓRICO DE CORTE"
  description="Relatório de atendimentos."
  imageUrl={require('../assets/historico.png')}
  onPress={() => navigation.navigate('MyAppointments')}
/>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutTxt}>ENCERRAR SESSÃO</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MENU INFERIOR */}
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
  scrollContent: { padding: 20, paddingBottom: 150 },
  header: { marginTop: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { color: '#4B5320', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
  userName: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  avatarGlow: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#4B5320', shadowColor: '#4B5320', shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  sectionTitle: { color: '#4B5320', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  liveBadge: { backgroundColor: '#4B5320', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  liveText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },

  lookbookCard: { width: 150, height: 150, marginRight: 15, borderRadius: 20, overflow: 'hidden', backgroundColor: '#111' },
  lookbookImage: { width: '100%', height: '100%' },
  lookbookGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, justifyContent: 'center', paddingLeft: 15 },
  lookbookTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },

  cardWrapper: { height: 115, width: '100%', marginBottom: 15, borderRadius: 20 },
  cardBg: { flex: 1 },
  cardGradient: { flex: 1, justifyContent: 'flex-end', padding: 18, borderRadius: 20 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMainTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cardSubTitle: { color: '#CCC', fontSize: 11 },
  cardIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(75, 83, 32, 0.9)', justifyContent: 'center', alignItems: 'center' },

  logoutBtn: { marginTop: 15, alignItems: 'center', opacity: 0.3 },
  logoutTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  floatingTabContainer: { position: 'absolute', bottom: 35, left: 25, right: 25 },
  bottomTab: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(75, 83, 32, 0.4)',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#4B5320',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10
  },
  tabIcon: { fontSize: 22 }
});