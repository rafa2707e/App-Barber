import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { registerForPushNotifications, savePushToken } from './NotificationService';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sessão actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user);
      else setLoading(false);
    });

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user);
      else { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (authUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const currentUser = profile
        ? { ...profile }
        : { id: authUser.id, email: authUser.email, name: authUser.email.split('@')[0], role: 'client' };

      setUser(currentUser);

      // Regista push token em segundo plano
      registerAndSaveToken(authUser.id);

    } catch (e) {
      console.error('loadProfile error:', e);
      setUser({ id: authUser.id, email: authUser.email, name: authUser.email.split('@')[0], role: 'client' });
    } finally {
      setLoading(false);
    }
  };

  const registerAndSaveToken = async (userId) => {
    try {
      const token = await registerForPushNotifications();
      if (token) await savePushToken(supabase, userId, token);
    } catch (e) {
      console.warn('Push token error:', e);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, name, role = 'client') => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role } },
    });
    if (error) throw error;

    // Cria perfil manualmente
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, name, role, phone: '', specialty: '',
      });
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user?.id) return;
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (!error) setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}