import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);

export default function BarberScheduleScreen() {
  return (
    <StyledSafeAreaView className="flex-1 bg-black justify-center items-center">
      <StyledText className="text-white text-2xl">Agenda do Barbeiro</StyledText>
    </StyledSafeAreaView>
  );
}
