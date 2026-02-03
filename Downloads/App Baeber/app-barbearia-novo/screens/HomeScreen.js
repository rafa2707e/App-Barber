import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, SafeAreaView, Pressable } from 'react-native';
import { styled } from 'nativewind';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const AnimatedStyledView = styled(Animated.View);

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const AppointmentCard = ({ time, name, service, onBook }) => (
    <StyledView className="bg-gray-800 rounded-lg p-4 flex-row items-center justify-between mb-4">
      <StyledView className="flex-row items-center">
        <StyledView className="w-12 h-12 rounded-full bg-green-500 justify-center items-center mr-4">
          <StyledText className="text-white text-xl font-bold">{name.charAt(0)}</StyledText>
        </StyledView>
        <StyledView>
          <StyledText className="text-white font-bold">{time}</StyledText>
          <StyledText className="text-gray-400">{name}</StyledText>
          <StyledText className="text-gray-400 text-xs">{service}</StyledText>
        </StyledView>
      </StyledView>
      <TouchableOpacity onPress={onBook} className="bg-green-500 px-6 py-2 rounded-md">
        <StyledText className="text-white font-bold">BOOK</StyledText>
      </TouchableOpacity>
    </StyledView>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledScrollView className="p-5">
        <AnimatedStyledView style={{ opacity: fadeAnim }}>
          {/* --- Header --- */}
          <StyledView className="bg-gray-800 rounded-lg p-4 mb-6">
            <StyledView className="flex-row items-center">
              <FontAwesome name="brain" size={24} color="#6EBF8B" />
              <StyledView className="ml-4">
                <StyledText className="text-white font-bold text-lg">DISCOVER YOUR STYLE</StyledText>
                <StyledText className="text-gray-400">Use our AI to analyze your face</StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
          
          {/* --- Next Appointment --- */}
          <StyledText className="text-white text-lg font-semibold mb-3">NEXT APPOINTMENT</StyledText>
          <AppointmentCard time="Today, 10:00 AM" name="Barber João Silva" service="Haircut + Beard" onBook={() => {}} />

          {/* --- Book Now --- */}
          <StyledText className="text-white text-lg font-semibold mt-4 mb-3">BOOK NOW</StyledText>
          <AppointmentCard time="Josie 10:00 AM" name="Get Bear" service="(Get Bear)" onBook={() => {}} />

          {/* --- Available Times --- */}
          <StyledView className="mt-4">
            <StyledText className="text-white text-lg font-semibold mb-3">AVAILABLE</StyledText>
            <StyledView className="flex-row flex-wrap">
              {['11:00', '12:00', '14:00', '15:00'].map(time => (
                <StyledTouchableOpacity key={time} className="bg-gray-800 rounded-md py-3 px-5 mr-3 mb-3">
                  <StyledText className="text-white">{time}</StyledText>
                </StyledTouchableOpacity>
              ))}
              <StyledTouchableOpacity className="bg-green-500 rounded-md py-3 px-5 mb-3">
                <StyledText className="text-white">BLOCK TIME</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>

        </AnimatedStyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}
