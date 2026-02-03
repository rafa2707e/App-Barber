import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoUploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setRecommendations([]);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    // Simulação de análise IA
    setTimeout(() => {
      const exampleCuts = [
        { id: 1, title: 'Corte Clássico', image: require('../assets/logo.png') },
        { id: 2, title: 'Corte Moderno', image: require('../assets/logo.png') },
        { id: 3, title: 'Corte Curto', image: require('../assets/logo.png') },
      ];
      setRecommendations(exampleCuts);
      setLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Recomendação por IA</Text>
          <Text style={styles.subtitle}>Envie uma foto do seu rosto e receba sugestões de cortes.</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage} activeOpacity={0.8}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.uploadButtonText}>Selecionar Foto</Text>
            )}
          </TouchableOpacity>

          {image && (
            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage} activeOpacity={0.8} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analisar com IA</Text>
              )}
            </TouchableOpacity>
          )}

          {recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Nossas Recomendações:</Text>
              {recommendations.map((rec) => (
                <View key={rec.id} style={styles.recommendationCard}>
                  <Image source={rec.image} style={styles.recommendationImage} />
                  <Text style={styles.recommendationText}>{rec.title}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#6C757D',
  },
  uploadButton: {
    backgroundColor: '#F8F9FA',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  analyzeButton: {
    backgroundColor: '#D62828',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  recommendationImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  recommendationText: {
    color: '#212529',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
