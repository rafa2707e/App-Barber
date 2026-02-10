import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated } from 'react-native';
import { signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

// Adicionamos a prop 'navigation' que o Stack Navigator nos envia automaticamente
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    androidClientId: 'your-android-client-id',
    iosClientId: 'your-ios-client-id',
    webClientId: 'your-web-client-id',
  });

  const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest({
    clientId: 'your-facebook-app-id',
  });

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Lógica de Sucesso após Login (Firebase ou Mock)
  const onLoginSuccess = (userData) => {
    // Definimos aqui se o usuário é barbeiro ou não (exemplo: por email)
    const userWithRole = {
      ...userData,
      role: userData.email === 'barbeiro@teste.com' ? 'barber' : 'client'
    };

    // 'replace' impede que o usuário volte para a tela de login ao apertar o botão 'voltar'
    navigation.replace('MainTabs', { user: userWithRole });
  };

  React.useEffect(() => {
    if (responseGoogle?.type === 'success') {
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((result) => {
        onLoginSuccess({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        });
      }).catch((error) => {
        Alert.alert('Erro', error.message);
      });
    }
  }, [responseGoogle]);

  React.useEffect(() => {
    if (responseFacebook?.type === 'success') {
      const { access_token } = responseFacebook.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential).then((result) => {
        onLoginSuccess({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        });
      }).catch((error) => {
        Alert.alert('Erro', error.message);
      });
    }
  }, [responseFacebook]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }
    // Para teste rápido: se o email for 'admin', loga como barbeiro
    const mockUser = { 
      email, 
      name: email.split('@')[0],
      role: email.includes('admin') ? 'barber' : 'client' 
    };
    onLoginSuccess(mockUser);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Gemini_Generated_Image_38eda438eda438ed.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Seja Bem Vindo</Text>

        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          keyboardType="email-address" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          placeholderTextColor="#888" 
        />
        <TextInput 
          placeholder="Senha" 
          style={styles.input} 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
          placeholderTextColor="#888" 
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => handleLogin());
          }}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
          onPress={() => promptAsyncGoogle()}
        >
          <Text style={styles.socialButtonText}>Login com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#4267B2" }]}
          onPress={() => promptAsyncFacebook()}
        >
          <Text style={styles.socialButtonText}>Login com Facebook</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: "#6B8E23", 
    letterSpacing: 2 
  },
  card: { 
    backgroundColor: "#1A1A1A", 
    width: "90%", 
    padding: 25, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: "#4B5320", 
    alignItems: "center" 
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: { 
    width: "100%", 
    height: 50, 
    borderColor: "#4B5320", 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    color: "#FFF" 
  },
  button: { 
    backgroundColor: "#4B5320", 
    width: "100%", 
    height: 50, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  socialButton: { 
    width: "100%", 
    height: 50, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 15 
  },
  socialButtonText: { 
    color: "#FFF", 
    fontWeight: "bold" 
  }
});