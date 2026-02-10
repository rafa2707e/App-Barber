import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

export default function PhotoUploadScreen() {
  const [image, setImage] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Análise de Visagismo</Text>
      <Text style={styles.description}>Envie uma foto para nossa IA recomendar o melhor corte para seu rosto.</Text>
      
      <View style={styles.uploadArea}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Nenhuma foto selecionada</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.buttonText}>Tirar Foto / Galeria</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#1A1A1A', borderColor: '#4B5320', borderWidth: 1 }]}>
        <Text style={[styles.buttonText, { color: '#6B8E23' }]}>Iniciar Análise Tática</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6B8E23', textAlign: 'center', marginTop: 40 },
  description: { color: '#AAA', textAlign: 'center', marginVertical: 20 },
  uploadArea: { width: '100%', height: 250, backgroundColor: '#1A1A1A', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#4B5320' },
  placeholderText: { color: '#555' },
  preview: { width: '100%', height: '100%', borderRadius: 20 },
  mainButton: { backgroundColor: '#4B5320', padding: 18, borderRadius: 12, marginTop: 15, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});