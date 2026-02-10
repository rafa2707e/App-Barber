import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importe TODAS as suas telas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import TimeSelectionScreen from './screens/TimeSelectionScreen';
import PhotoUploadScreen from './screens/PhotoUploadScreen';
import MyAppointmentsScreen from './screens/MyAppointmentsScreen';
import BarberAgendaScreen from './screens/BarberAgendaScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- COMPONENTE DO MENU INFERIOR (TABS) ---
function TabNavigator({ route }) {
  const user = route.params?.user;
  const isBarber = user?.role === 'barber';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000', borderTopColor: '#4B5320', borderTopWidth: 2, height: 60, paddingBottom: 5 },
        tabBarActiveTintColor: '#6B8E23',
        tabBarInactiveTintColor: '#555',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        initialParams={{ user }}
        options={{ tabBarIcon: ({ color }) => <Icon name="home" size={26} color={color} />, tabBarLabel: 'Início' }}
      />
      <Tab.Screen 
        name="AgendaTab" 
        component={isBarber ? BarberAgendaScreen : MyAppointmentsScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="calendar-clock" size={26} color={color} />, tabBarLabel: isBarber ? 'Agenda' : 'Meus Cortes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="account" size={26} color={color} />, tabBarLabel: 'Perfil' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="cog" size={26} color={color} />, tabBarLabel: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL (STACK) ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 1. Tela de Login aparece primeiro */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* 2. O Menu de Abas (que contém a Home) */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* 3. Telas "Escondidas" que não ficam no menu mas precisam ser acessadas */}
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="TimeSelection" component={TimeSelectionScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}