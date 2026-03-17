import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider, useAuth } from './AuthContext';

import OnboardingScreen      from './screens/OnboardingScreen';
import LoginScreen           from './screens/LoginScreen';
import RegisterScreen        from './screens/RegisterScreen';
import HomeScreen            from './screens/HomeScreen';
import AppointmentScreen     from './screens/AppointmentScreen';
import BarberSelectionScreen from './screens/BarberSelectionScreen';
import TimeSelectionScreen   from './screens/TimeSelectionScreen';
import PaymentScreen         from './screens/PaymentScreen';
import MyAppointmentsScreen  from './screens/MyAppointmentsScreen';
import PhotoUploadScreen     from './screens/PhotoUploadScreen';
import ProfileScreen         from './screens/ProfileScreen';
import BarberAgendaScreen    from './screens/BarberAgendaScreen';
import BarberScheduleScreen  from './screens/BarberScheduleScreen ';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

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
              <Text style={isFocused ? tabStyles.iconActive : tabStyles.icon}>{tab.icon}</Text>
              <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>{tab.label}</Text>
              {isFocused && <View style={tabStyles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ClientTabs() {
  const TABS = [
    { route: 'Home',           icon: '🏠', label: 'Início' },
    { route: 'MyAppointments', icon: '📋', label: 'Cortes' },
    { route: 'Profile',        icon: '👤', label: 'Perfil'  },
  ];
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar tabs={TABS} {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"           component={HomeScreen}           />
      <Tab.Screen name="MyAppointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="Profile"        component={ProfileScreen}        />
    </Tab.Navigator>
  );
}

function BarberTabs() {
  const TABS = [
    { route: 'BarberAgenda',    icon: '📅', label: 'Agenda'   },
    { route: 'BarberSchedule',  icon: '⚙️', label: 'Horários' },
    { route: 'BarberProfile',   icon: '👤', label: 'Perfil'   },
  ];
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar tabs={TABS} {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="BarberAgenda"   component={BarberAgendaScreen}   />
      <Tab.Screen name="BarberSchedule" component={BarberScheduleScreen} />
      <Tab.Screen name="BarberProfile"  component={ProfileScreen}        />
    </Tab.Navigator>
  );
}

function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs"      component={ClientTabs}            />
      <Stack.Screen name="Appointment"     component={AppointmentScreen}     />
      <Stack.Screen name="BarberSelection" component={BarberSelectionScreen} />
      <Stack.Screen name="TimeSelection"   component={TimeSelectionScreen}   />
      <Stack.Screen name="Payment"         component={PaymentScreen}         />
      <Stack.Screen name="PhotoUpload"     component={PhotoUploadScreen}     />
    </Stack.Navigator>
  );
}

function BarberNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BarberTabs" component={BarberTabs} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen}    />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    if (user?.id) checkOnboarding(user.id);
    else if (!loading) setOnboardingDone(true);
  }, [user, loading]);

  const checkOnboarding = async (userId) => {
    const key  = `onboarding_done_${userId}`;
    const done = await AsyncStorage.getItem(key);
    setOnboardingDone(done === 'true');
  };

  const finishOnboarding = async () => {
    if (user?.id) {
      await AsyncStorage.setItem(`onboarding_done_${user.id}`, 'true');
    }
    setOnboardingDone(true);
  };

  if (loading || onboardingDone === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#6B8E23" size="large" />
        <Text style={{ color: '#4B5320', marginTop: 14, fontSize: 11, letterSpacing: 2 }}>
          STUDIO HAIR
        </Text>
      </View>
    );
  }

  if (!user)           return <AuthNavigator />;
  if (!onboardingDone) return <OnboardingScreen role={user.role} onFinish={finishOnboarding} />;
  if (user.role === 'barber') return <BarberNavigator />;
  return <ClientNavigator />;
}

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
  wrapper:   { position: 'absolute', bottom: 28, left: 20, right: 20 },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(6,6,6,0.98)',
    borderRadius: 32,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(75,83,32,0.3)',
    shadowColor: '#4B5320',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  tabItem:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon:        { fontSize: 20, opacity: 0.25 },
  iconActive:  { fontSize: 22 },
  label:       { color: '#2a2a2a', fontSize: 9, fontWeight: 'bold', marginTop: 3, letterSpacing: 0.5 },
  labelActive: { color: '#6B8E23' },
  dot:         { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#6B8E23' },
});