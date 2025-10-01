import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated } from 'react-native';
import { signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

export default function LoginScreen({ setUser }) {
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

  React.useEffect(() => {
    if (responseGoogle?.type === 'success') {
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((result) => {
        const user = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        setUser(user);
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
        const user = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        setUser(user);
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
    // Simulação de login
    const mockUser = { email, name: email.split('@')[0] };
    setUser(mockUser);
  };

  const handleGoogleLogin = () => {
    promptAsyncGoogle();
  };

  const handleFacebookLogin = () => {
    promptAsyncFacebook();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Seja Bem Vindo</Text>

        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor="#FFD700" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor="#FFD700" />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => handleLogin());
          }}
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => handleGoogleLogin());
          }}
        >
          <Text style={styles.loginButtonText}>Login com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#4267B2" }]}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => handleFacebookLogin());
          }}
        >
          <Text style={styles.loginButtonText}>Login com Facebook</Text>
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
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFD700",
  },
  card: {
    backgroundColor: "#222",
    width: "90%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#FFD700",
  },
  loginButton: {
    backgroundColor: "#FFD700",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialButton: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
});
