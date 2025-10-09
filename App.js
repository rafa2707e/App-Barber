import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/PaymentScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import TimeSelectionScreen from './screens/TimeSelectionScreen';
import PhotoUploadScreen from './screens/PhotoUploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
  {user ? (
    <>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
      />
      <Stack.Screen name="Appointment" component={AppointmentScreen} />
      <Stack.Screen name="TimeSelection" component={TimeSelectionScreen} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </>
  ) : (
    <Stack.Screen name="Login">
      {props => <LoginScreen {...props} setUser={setUser} />}
    </Stack.Screen>
  )}
</Stack.Navigator>

    </NavigationContainer>
  );
}
