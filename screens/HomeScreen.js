import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Animated } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.userInfoContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.userPhoto} />
          ) : (
            <View style={styles.userPhotoPlaceholder}>
              <Text style={styles.userInitial}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <Text style={styles.userName}>Olá, {user?.name || 'Usuário'}</Text>
        </View>

        <Image 
          source={require('../assets/barber-shop.jpg')} 
          style={styles.homeImage} 
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.buttonText}>Agendar Horário</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('PhotoUpload')}
          >
            <Text style={styles.buttonText}>Análise por IA</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  userPhoto: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userPhotoPlaceholder: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#4B5320', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  userInitial: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  homeImage: { width: '100%', height: 200, borderRadius: 20, marginBottom: 30 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { 
    flex: 1, backgroundColor: '#4B5320', borderRadius: 15, padding: 20, 
    marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#6B8E23' 
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  logoutButton: { marginTop: 30, alignItems: 'center' },
  logoutButtonText: { color: '#6B8E23', fontSize: 16, fontWeight: 'bold' }
});