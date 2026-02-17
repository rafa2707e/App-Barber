import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importação das suas telas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import TimeSelectionScreen from './screens/TimeSelectionScreen';
import PhotoUploadScreen from './screens/PhotoUploadScreen';
import MyAppointmentsScreen from './screens/MyAppointmentsScreen';
import BarberAgendaScreen from './screens/BarberAgendaScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import BarberSelectionScreen from './screens/BarberSelectionScreen'; // Certifique-se de que o nome do arquivo está correto

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- CONFIGURAÇÃO DO MENU DE ABAS (TABS) ---
// Escondemos o estilo padrão para usar o seu design customizado na HomeScreen
function TabNavigator({ route }) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Isso remove o menu antigo/padrão
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ user }} 
      />
      <Tab.Screen 
        name="MyAppointments" 
        component={MyAppointmentsScreen} 
        initialParams={{ user }} 
      />
      <Tab.Screen 
        name="BarberAgenda" 
        component={BarberAgendaScreen} 
        initialParams={{ user }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={{ user }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        initialParams={{ user }} 
      />
    </Tab.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL (STACK) ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 1. Login inicial */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* 2. Menu Principal (Abas) */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* 3. Telas de Fluxo de Agendamento e Outros */}
        <Stack.Screen name="BarberSelection" component={BarberSelectionScreen} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="TimeSelection" component={TimeSelectionScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}