import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoUploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    });
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Selecione uma imagem primeiro');
      return;
    }

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      // Simulação de análise IA - mostrar 3 imagens de exemplo
      const exampleCuts = [
        { id: 1, title: 'Corte Clássico', image: require('../assets/logo.png') }, // Usar logo como placeholder
        { id: 2, title: 'Corte Moderno', image: require('../assets/logo.png') },
        { id: 3, title: 'Corte Curto', image: require('../assets/logo.png') },
      ];
      setRecommendations(exampleCuts);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Upload de Foto para IA</Text>
        <Text style={styles.subtitle}>Tire ou selecione uma foto do seu rosto para recomendações personalizadas</Text>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}

        <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
          <Text style={styles.analyzeButtonText}>Analisar com IA</Text>
        </TouchableOpacity>

        {recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recomendações de Corte:</Text>
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationItem}>
                <Image source={rec.image} style={styles.recommendationImage} />
                <Text style={styles.recommendationText}>{rec.title}</Text>
              </View>
            ))}
          </View>
        )}

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
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
  },
  analyzeButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    marginTop: 20,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFD700',
    textAlign: 'center',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  recommendationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  recommendationText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
