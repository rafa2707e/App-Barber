import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) setProfile(data);
    } catch (e) {
      console.warn('Erro ao buscar perfil:', e);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role, phone, specialty }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, phone: phone || '', specialty: specialty || '' }
      }
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      await new Promise(r => setTimeout(r, 1000));
      await fetchProfile(data.user.id);
    }
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('E-mail ou senha incorrectos');
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async ({ name, phone }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, phone })
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProfile(data);
    return data;
  };

  const currentUser = profile ? {
    id:        profile.id,
    name:      profile.name,
    email:     profile.email || user?.email,
    role:      profile.role,
    phone:     profile.phone,
    specialty: profile.specialty,
  } : null;

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      rawUser: user,
      profile,
      loading,
      login,
      register,
      logout,
      updateProfile,
      supabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}