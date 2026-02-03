import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import moment from 'moment';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TIME_SLOTS = [
  '09:30 AM', '09:00 AM', '11:00 AM', 
  '10:00 AM', '10:30 AM', '01:00 PM',
  '01:30 PM', '02:00 PM', '02:30 PM',
];

export default function AppointmentScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedTime, setSelectedTime] = useState(null);

  const week = Array.from({ length: 7 }, (_, i) => moment().add(i, 'days'));

  return (
    <StyledSafeAreaView className="flex-1 bg-black">
      <StyledScrollView className="p-5">
        <StyledText className="text-white text-2xl font-bold mb-6">Select Date & Time</StyledText>

        {/* --- Weekday Selector --- */}
        <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {week.map(day => (
            <StyledTouchableOpacity 
              key={day.format('YYYY-MM-DD')}
              className={`py-3 px-4 rounded-lg mr-3 ${selectedDate.isSame(day, 'day') ? 'bg-green-500' : 'bg-gray-800'}`}
              onPress={() => setSelectedDate(day)}
            >
              <StyledText className="text-white text-center font-bold">{day.format('ddd').toUpperCase()}</StyledText>
              <StyledText className="text-white text-2xl font-bold">{day.format('DD')}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledScrollView>

        {/* --- Time Slot Selector --- */}
        <StyledView className="flex-row flex-wrap justify-between mb-8">
          {TIME_SLOTS.map(time => (
            <StyledTouchableOpacity 
              key={time}
              className={`w-[32%] py-4 rounded-lg mb-2 ${selectedTime === time ? 'bg-green-500' : 'bg-gray-800'}`}
              onPress={() => setSelectedTime(time)}
            >
              <StyledText className="text-white text-center font-bold">{time}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
        
        {/* --- Payment Method --- */}
        <StyledText className="text-white text-xl font-bold mb-4">Payment Method</StyledText>
        <StyledView className="bg-gray-800 rounded-lg p-4">
            <StyledView className="flex-row justify-between items-center">
                <StyledText className="text-white font-bold">Loyalty Card</StyledText>
                <StyledText className="text-green-500 font-bold">+$45.00</StyledText>
            </StyledView>
            <StyledText className="text-gray-400">App Fee: $1.00</StyledText>
        </StyledView>

      </StyledScrollView>
    </StyledSafeAreaView>
  );
}