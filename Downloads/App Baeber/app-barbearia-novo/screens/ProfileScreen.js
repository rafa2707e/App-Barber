import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const DUMMY_GALLERY = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1583271299446-5a4653e1b76e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1599842057879-9b7a696d04e3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1615284219488-32ce5972a513?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1614283233556-f35b74021725?w=500&h=500&fit=crop',
];

export default function ProfileScreen() {
  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
        <StyledImage
          source={{ uri: 'https://images.unsplash.com/photo-1583271299446-5a4653e1b76e?w=500&h=500&fit=crop' }}
          className="w-32 h-32 rounded-full mb-4 border-2 border-green-500"
        />
        <StyledText className="text-white text-2xl font-bold">Alex Chen</StyledText>
        <StyledText className="text-gray-400 text-sm mb-8">Member since 2023</StyledText>

        <StyledText className="text-white text-xl font-bold mb-4">STYLE GALLERY</StyledText>
        
        <StyledView className="flex-row flex-wrap justify-center">
          {DUMMY_GALLERY.map((url, index) => (
            <StyledImage
              key={index}
              source={{ uri: url }}
              className="w-28 h-28 rounded-md m-1"
            />
          ))}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}