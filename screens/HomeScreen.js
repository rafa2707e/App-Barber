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
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => navigation.replace('Login'));
  };

  const handleSchedule = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Appointment'));
  };

  const handleIA = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => navigation.navigate('PhotoUpload'));
  };

  return (
    <ScrollView style={styles.homeContainer}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={require('../assets/barber-home.png')} style={styles.homeImage} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSchedule}>
            <Text style={styles.buttonText}>Agendar Corte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleIA}>
            <Text style={styles.buttonText}>Recomendação IA 🤖✨</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.userPhoto} />
          ) : (
            <View style={styles.userPhotoPlaceholder}>
              <Text style={styles.userInitial}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <Text style={styles.userName}>Olá, {user?.name || user?.email || 'Usuário'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  homeImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
