import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function AppointmentScreen({ navigation }) {
  const [selected, setSelected] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamento Tático</Text>
      <Text style={styles.subtitle}>Selecione o dia da missão</Text>

      <View style={styles.calendarWrapper}>
        <Calendar
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
          }}
          theme={{
            backgroundColor: '#1A1A1A',
            calendarBackground: '#1A1A1A',
            textSectionTitleColor: '#6B8E23',
            selectedDayBackgroundColor: '#4B5320',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6B8E23',
            dayTextColor: '#ffffff',
            textDisabledColor: '#444',
            dotColor: '#6B8E23',
            monthTextColor: '#6B8E23',
            indicatorColor: '#6B8E23',
            arrowColor: '#6B8E23',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
        />
      </View>

      {selected ? (
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.infoText}>Dia selecionado: {selected.split('-').reverse().join('/')}</Text>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => navigation.navigate('TimeSelection', { selectedDate: selected })}
          >
            <Text style={styles.nextButtonText}>Ver Horários Disponíveis</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#6B8E23', textAlign: 'center', marginTop: 40 },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: 30 },
  calendarWrapper: { 
    borderRadius: 15, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#4B5320',
    backgroundColor: '#1A1A1A',
    elevation: 10
  },
  footer: { marginTop: 30, alignItems: 'center' },
  infoText: { color: '#FFF', marginBottom: 15, fontSize: 16 },
  nextButton: { 
    backgroundColor: '#4B5320', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6B8E23'
  },
  nextButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 20, alignSelf: 'center' },
  backButtonText: { color: '#6B8E23', fontWeight: 'bold' }
});