/**
 * App.js
 * 
 * TODOS os ficheiros estão na RAIZ do projecto.
 * Estrutura esperada:
 * 
 * /
 * ├── App.js
 * ├── AuthContext.js        ← novo
 * ├── LoginScreen.js        ← substituir
 * ├── RegisterScreen.js     ← novo
 * ├── ProfileScreen.js      ← substituir
 * ├── HomeScreen.js
 * ├── AppointmentScreen.js
 * ├── BarberSelectionScreen.js
 * ├── TimeSelectionScreen.js  ← substituir
 * ├── PaymentScreen.js        ← substituir
 * ├── MyAppointmentsScreen.js ← substituir
 * ├── PhotoUploadScreen.js
 * ├── BarberAgendaScreen.js   ← substituir
 * └── SettingsScreen.js
 *
 * Instalações necessárias (se ainda não tiveres):
 *   npx expo install @react-native-async-storage/async-storage
 *   npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
 *   npx expo install react-native-screens react-native-safe-area-context
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

// ── Contexto de autenticação (raiz do projecto) ───────────────────────────────
import { AuthProvider, useAuth } from './AuthContext';

// ── Ecrãs de autenticação ─────────────────────────────────────────────────────
import LoginScreen    from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// ── Ecrãs do cliente ──────────────────────────────────────────────────────────
import HomeScreen            from './screens/HomeScreen';
import AppointmentScreen     from './screens/AppointmentScreen';
import BarberSelectionScreen from './screens/BarberSelectionScreen';
import TimeSelectionScreen   from './screens/TimeSelectionScreen';
import PaymentScreen         from './screens/PaymentScreen';
import MyAppointmentsScreen  from './screens/MyAppointmentsScreen';
import PhotoUploadScreen     from './screens/PhotoUploadScreen';
import ProfileScreen         from './screens/ProfileScreen';

// ── Ecrãs do barbeiro ─────────────────────────────────────────────────────────
import BarberAgendaScreen from './screens/BarberAgendaScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─────────────────────────────────────────────────────────────────────────────
// TAB BAR REUTILIZÁVEL
// ─────────────────────────────────────────────────────────────────────────────
function CustomTabBar({ tabs, state, navigation }) {
  return (
    <View style={tabStyles.wrapper}>
      <View style={tabStyles.container}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.route}
              style={tabStyles.tabItem}
              onPress={() => navigation.navigate(tab.route)}
            >
              <Text style={tabStyles.icon}>{tab.icon}</Text>
              <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
                {tab.label}
              </Text>
              {isFocused && <View style={tabStyles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS DO CLIENTE  (Home · Cortes · Perfil)
// ─────────────────────────────────────────────────────────────────────────────
function ClientTabs() {
  const TABS = [
    { route: 'Home',           icon: '🏠', label: 'Início' },
    { route: 'MyAppointments', icon: '📜', label: 'Cortes' },
    { route: 'Profile',        icon: '👤', label: 'Perfil' },
  ];
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar tabs={TABS} {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"           component={HomeScreen}           />
      <Tab.Screen name="MyAppointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="Profile"        component={ProfileScreen}        />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABS DO BARBEIRO  (Agenda · Perfil)
// ─────────────────────────────────────────────────────────────────────────────
function BarberTabs() {
  const TABS = [
    { route: 'BarberAgenda',  icon: '📅', label: 'Agenda' },
    { route: 'BarberProfile', icon: '👤', label: 'Perfil' },
  ];
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar tabs={TABS} {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="BarberAgenda"  component={BarberAgendaScreen} />
      <Tab.Screen name="BarberProfile" component={ProfileScreen}      />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATOR RAIZ
// Ao iniciar: mostra loading → verifica sessão → redireciona automaticamente
// ─────────────────────────────────────────────────────────────────────────────
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#6B8E23" size="large" />
        <Text style={{ color: '#4B5320', marginTop: 14, fontSize: 11, letterSpacing: 2 }}>
          STUDIO HAIR
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Autenticação */}
      <Stack.Screen name="Login"    component={LoginScreen}    />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Área do cliente */}
      <Stack.Screen name="ClientTabs"      component={ClientTabs}            />
      <Stack.Screen name="Appointment"     component={AppointmentScreen}     />
      <Stack.Screen name="BarberSelection" component={BarberSelectionScreen} />
      <Stack.Screen name="TimeSelection"   component={TimeSelectionScreen}   />
      <Stack.Screen name="Payment"         component={PaymentScreen}         />
      <Stack.Screen name="PhotoUpload"     component={PhotoUploadScreen}     />

      {/* Área do barbeiro */}
      <Stack.Screen name="BarberTabs" component={BarberTabs} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const tabStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(8,8,8,0.97)',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(75,83,32,0.35)',
    shadowColor: '#4B5320',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon:        { fontSize: 20 },
  label:       { color: '#444', fontSize: 9, fontWeight: 'bold', marginTop: 3, letterSpacing: 0.5 },
  labelActive: { color: '#6B8E23' },
  dot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B8E23',
  },
});