import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Animated } from 'react-native';

export default function AppointmentScreen({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('TimeSelection', { selectedDate: date });
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Selecione uma Data</Text>
        <Text style={styles.monthTitle}>{formatMonth(currentMonth)}</Text>

        <FlatList
          data={daysInMonth.filter(date => date)}
          keyExtractor={(item) => item.toISOString()}
          renderItem={({ item: date }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                isToday(date) && styles.today,
                selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDate,
                isPast(date) && styles.pastDate,
              ]}
              onPress={() => !isPast(date) && handleDateSelect(date)}
              disabled={isPast(date)}
            >
              <Text style={[
                styles.dateText,
                isToday(date) && styles.todayText,
                selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedText,
                isPast(date) && styles.pastText,
              ]}>
                {date.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Animated.sequence([
              Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
              Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => navigation.goBack());
          }}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD700',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFD700',
  },
  dateItem: {
    backgroundColor: '#FFD700',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  today: {
    backgroundColor: '#FFA500',
  },
  selectedDate: {
    backgroundColor: '#FF4500',
  },
  pastDate: {
    backgroundColor: '#666',
  },
  dateText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayText: {
    color: '#FFF',
  },
  selectedText: {
    color: '#FFF',
  },
  pastText: {
    color: '#999',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
