/**
 * AuthContext.js
 * Coloca este ficheiro na RAIZ do projecto (mesmo nível que App.js)
 *
 * Instalação necessária:
 *   npx expo install @react-native-async-storage/async-storage
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// Utilizadores de teste — substitui por chamadas MongoDB quando estiver pronto
const MOCK_USERS = [
  { id: '1', name: 'João Barbeiro',  email: 'barbeiro@studio.com', password: '1234', role: 'barber', phone: '11999990001' },
  { id: '2', name: 'Rafael Cliente', email: 'cliente@studio.com',  password: '1234', role: 'client', phone: '11999990002' },
];

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura sessão guardada ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@studiohair_user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {
        console.warn('Erro ao restaurar sessão:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // TODO MongoDB: substituir por fetch('POST /api/auth/login', { email, password })
  const login = async (email, password) => {
    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('E-mail ou senha incorrectos.');
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role, phone: found.phone };
    await AsyncStorage.setItem('@studiohair_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  // TODO MongoDB: substituir por fetch('POST /api/auth/register', { ... })
  const register = async ({ name, email, password, role, phone, specialty }) => {
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Este e-mail já está registado.');
    const newUser = { id: String(Date.now()), name, email, password, role, phone, specialty };
    MOCK_USERS.push(newUser);
    const sessionUser = { id: newUser.id, name, email, role, phone };
    await AsyncStorage.setItem('@studiohair_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@studiohair_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}