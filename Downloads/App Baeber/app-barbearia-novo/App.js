import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import BarberScheduleScreen from './screens/BarberScheduleScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import TimeSelectionScreen from './screens/TimeSelectionScreen';
import PhotoUploadScreen from './screens/PhotoUploadScreen';
import ServiceSelectionScreen from './screens/ServiceSelectionScreen';
import PaymentScreen from './screens/PaymentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Tab Navigation Component ---
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#6EBF8B',
        },
        tabBarActiveTintColor: '#6EBF8B',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="Schedule"
        component={BarberScheduleScreen}
        options={{ title: 'Schedule' }}
      />
    </Tab.Navigator>
  );
}


// --- Main App Component ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="TimeSelection" component={TimeSelectionScreen} />
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}