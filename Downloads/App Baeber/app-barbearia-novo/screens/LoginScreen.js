import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Animated, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const AnimatedStyledView = styled(Animated.View);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    androidClientId: 'your-android-client-id',
    iosClientId: 'your-ios-client-id',
    webClientId: 'your-web-client-id',
  });

  const [requestFacebook, responseFacebook, promptAsyncFacebook] = Facebook.useAuthRequest({
    clientId: 'your-facebook-app-id',
  });

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (responseGoogle?.type === 'success') {
      const { id_token } = responseGoogle.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace('Home'))
        .catch((error) => Alert.alert('Error', error.message));
    }
  }, [responseGoogle]);

  useEffect(() => {
    if (responseFacebook?.type === 'success') {
      const { access_token } = responseFacebook.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace('Home'))
        .catch((error) => Alert.alert('Error', error.message));
    }
  }, [responseFacebook]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    console.log('Login attempt with:', email, password);
    navigation.replace('Home');
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <AnimatedStyledView className="flex-1 justify-center items-center p-5" style={{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }}>
        <FontAwesome name="cut" size={60} color="#6EBF8B" />
        <StyledText className="text-white text-4xl font-bold mt-4 mb-12">CUTFIND</StyledText>

        <StyledTextInput
          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 mb-4 border border-gray-700"
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <StyledTextInput
          className="w-full bg-gray-800 text-white rounded-md px-4 py-3 mb-6 border border-gray-700"
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <StyledTouchableOpacity className="w-full bg-green-500 rounded-md py-4 mb-4" onPress={handleLogin} activeOpacity={0.8}>
          <StyledText className="text-center text-white font-bold text-lg">LOGIN</StyledText>
        </StyledTouchableOpacity>
        
        <StyledView className="flex-row justify-center items-center w-full mb-4">
            <StyledView className="h-px bg-gray-700 flex-1" />
            <StyledText className="text-gray-400 px-4">OR</StyledText>
            <StyledView className="h-px bg-gray-700 flex-1" />
        </StyledView>

        <StyledTouchableOpacity className="w-full bg-gray-800 rounded-md py-3 mb-4 flex-row justify-center items-center" onPress={() => promptAsyncGoogle()} activeOpacity={0.8}>
            <FontAwesome name="google" size={20} color="#FFFFFF" style={{marginRight: 10}}/>
            <StyledText className="text-center text-white font-bold">Continue with Google</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="w-full bg-gray-800 rounded-md py-3 flex-row justify-center items-center" onPress={() => promptAsyncFacebook()} activeOpacity={0.8}>
            <FontAwesome name="facebook" size={20} color="#FFFFFF" style={{marginRight: 10}}/>
            <StyledText className="text-center text-white font-bold">Continue with Facebook</StyledText>
        </StyledTouchableOpacity>

        <StyledView className="flex-row mt-8">
          <StyledText className="text-gray-400">Don't have an account? </StyledText>
          <StyledTouchableOpacity>
            <StyledText className="text-green-500 font-bold">Sign up</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledTouchableOpacity className="mt-4">
          <StyledText className="text-gray-400">Barber Access</StyledText>
        </StyledTouchableOpacity>
      </AnimatedStyledView>
    </StyledSafeAreaView>
  );
}
