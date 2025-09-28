import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // controla login
  const [user, setUser] = useState({ name: 'Usuário' }); // info do usuário

  // Se estiver logado, mostrar Home
  if (isLoggedIn) {
    return (
      <ScrollView style={styles.homeContainer}>
        <Text style={styles.title}>Bem-vindo, {user.name}!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Perfil do usuário')}
        >
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Configurações')}
        >
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsLoggedIn(false)} // logout
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </ScrollView>
    );
  }

  // Tela de login
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.card}>
        <Text style={styles.title}>Seja Bem Vindo</Text>

        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setIsLoggedIn(true)} // simula login
        >
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
          onPress={() => setIsLoggedIn(true)}
        >
          <Text style={styles.loginButtonText}>Login com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#4267B2" }]}
          onPress={() => setIsLoggedIn(true)}
        >
          <Text style={styles.loginButtonText}>Login com Facebook</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
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
  homeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#000",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
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
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
