import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  StatusBar,
  Dimensions,
  Platform,
  TextInput
} from 'react-native';
// ✅ FIX: SafeAreaView importado de 'react-native-safe-area-context' em vez de 'react-native'
// Instalar com: npx expo install react-native-safe-area-context
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { 
  Camera, 
  Scissors, 
  RefreshCcw, 
  Sparkles, 
  Calendar, 
  Upload,
  CheckCircle2,
  Key
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MODEL_NAME = "gemini-2.5-flash-lite";

// ─── Mapa de estilos → imagens Unsplash relevantes ───────────────────────────
// A IA retorna palavras-chave no texto; este mapa faz o match para uma foto
// de referência condizente com o estilo recomendado.
const STYLE_IMAGE_MAP = [
  { keywords: ['undercut', 'under cut'],         url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400' },
  { keywords: ['fade', 'degradê', 'degradado'],  url: 'https://images.unsplash.com/photo-1621605815841-217feee60ad1?w=400' },
  { keywords: ['pompadour', 'pompadore'],         url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400' },
  { keywords: ['buzz', 'máquina', 'curto'],       url: 'https://images.unsplash.com/photo-1599351431247-f579338af7d2?w=400' },
  { keywords: ['texturizado', 'texture', 'crop'], url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400' },
  { keywords: ['clássico', 'classico', 'lateral'],url: 'https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=400' },
  { keywords: ['quiff', 'volume'],                url: 'https://images.unsplash.com/photo-1605497787690-1c53bb62b8c0?w=400' },
];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1599351431247-f579338af7d2?w=400',
  'https://images.unsplash.com/photo-1621605815841-217feee60ad1?w=400',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
];

/**
 * Escolhe a imagem de referência com base nas palavras do diagnóstico da IA.
 * Se nenhuma keyword bater, retorna uma imagem aleatória do fallback.
 */
function escolherImagemReferencia(texto) {
  const lower = texto.toLowerCase();
  for (const entry of STYLE_IMAGE_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.url;
    }
  }
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

export default function App() {
  const [image, setImage]   = useState(null);
  const [base64, setBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  // API do Gemini para fazer a chamada 
  const [apiKey, setApiKey]   = useState('AIzaSyDkG2W_u-JPJdQ_pKrwpugHancBmNRck08');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permissão Necessária", 
            "O acesso à galeria é necessario para fazer a analise facil"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const resultPicker = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], 
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5, 
        base64: true,
      });

      if (!resultPicker.canceled) {
        setImage(resultPicker.assets[0].uri);
        setBase64(resultPicker.assets[0].base64);
        setResult(null);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
    }
  };
// Chamada da API do Gemini pafa fazer a analise 
  const analisarVisagismo = async () => {
    
    if (!apiKey.trim()) {
      Alert.alert(
        "Chave de API em Falta",
        "Insira a sua Google Gemini API Key antes de gerar o diagnóstico. Toque no ícone 🔑 no cabeçalho."
      );
      setShowKeyInput(true);
      return;
    }

    if (!base64) {
      Alert.alert("Atenção", "Selecione uma fotografia antes de iniciar a análise.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { 
                  text: `Atua como um barbeiro profissional experiente e com cortes modernos.
Analisa cuidadosamente o formato do rosto nesta imagem e recomenda o melhor estilo de corte de cabelo masculino.
Responde APENAS em português do Brasil.
Formato da resposta (máximo algumas frases): [Nome do corte e estilo]: [breve justificação técnica].
Exemplo: "mid-fade ou corte americano: equilibra rosto oval, suaviza a mandíbula e realça o volume no topo."` 
                },
                { inlineData: { mimeType: "image/jpeg", data: base64 } }
              ]
            }]
          })
        }
      );

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 400) throw new Error("API Key inválida ou pedido mal formado.");
        if (response.status === 403) throw new Error("API Key sem permissão. Verifique se a Gemini API está ativa no Google Cloud.");
        if (response.status === 429) throw new Error("Limite de pedidos atingido (429).\n\nAguarde 1 minuto e tente novamente.\nPlano gratuito: 15 pedidos/minuto.");
        throw new Error(json.error?.message || `Erro HTTP ${response.status}`);
      }

      const data = json;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("A IA não retornou um diagnóstico válido.");

      // ✅ MELHORIA: Imagem de referência escolhida com base nas palavras do diagnóstico
      const referenceImg = escolherImagemReferencia(text);

      setResult({
        texto: text.trim(),
        fotoCorte: referenceImg,
      });

    } catch (error) {
      console.error('[Visagismo IA]', error);
      Alert.alert(
        "Falha na Análise", 
        error.message || "Erro na comunicação com o servidor de IA. Verifique a sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetar = () => {
    setImage(null);
    setBase64(null);
    setResult(null);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Scissors color="#98FB98" size={32} />
            </View>
            <Text style={styles.title}>VISAGISMO PRO</Text>
            <Text style={styles.version}>ENGINE: {MODEL_NAME.split('-')[1].toUpperCase()} NEXT</Text>

            {/* Botão para mostrar/ocultar campo da API Key */}
            <TouchableOpacity 
              style={styles.keyButton} 
              onPress={() => setShowKeyInput(v => !v)}
            >
              <Key color={apiKey ? '#98FB98' : '#555'} size={14} />
              <Text style={[styles.keyButtonText, apiKey && styles.keyButtonTextActive]}>
                {apiKey ? 'API KEY ✓' : 'INSERIR API KEY'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campo de API Key (expansível) */}
          {showKeyInput && (
            <View style={styles.keyInputContainer}>
              <TextInput
                style={styles.keyInput}
                placeholder="Cole aqui a sua Gemini API Key..."
                placeholderTextColor="#333"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.keyHint}>
                Obtenha a sua chave em: aistudio.google.com/apikey
              </Text>
            </View>
          )}

          {/* VIEWFINDER */}
          <View style={styles.viewfinder}>
            {image ? (
              <View style={styles.imageBox}>
                <Image source={{ uri: image }} style={styles.mainPhoto} />
                {!loading && (
                  <TouchableOpacity style={styles.refreshBtn} onPress={resetar}>
                    <RefreshCcw color="#98FB98" size={22} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity style={styles.emptyState} onPress={pickImage}>
                <Camera color="#222" size={55} />
                <Text style={styles.emptyStateText}>IMPORTAR FOTO DO CLIENTE</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* BOTÕES */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={pickImage} 
              disabled={loading}
            >
              <Upload color="#555" size={18} />
              <Text style={styles.secondaryButtonText}>MUDAR FOTOGRAFIA</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryButton, (!image || loading) && styles.disabledButton]} 
              onPress={analisarVisagismo}
              disabled={!image || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Sparkles color="#000" size={20} />
                  <Text style={styles.primaryButtonText}>GERAR DIAGNÓSTICO</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* RESULTADO */}
          {result && (
            <View style={styles.resultPanel}>
              <View style={styles.resultHeader}>
                <CheckCircle2 color="#98FB98" size={18} />
                <Text style={styles.resultBadge}>PARECER TÉCNICO</Text>
              </View>
              
              <View style={styles.resultBody}>
                <View style={styles.textContainer}>
                  <Text style={styles.resultMessage}>"{result.texto}"</Text>
                </View>
                
                <View style={styles.refContainer}>
                  <Image 
                    source={{ uri: result.fotoCorte }} 
                    style={styles.refThumbnail}
                    // ✅ MELHORIA: fallback visual se a imagem falhar a carregar
                    onError={() => setResult(prev => ({
                      ...prev, 
                      fotoCorte: FALLBACK_IMAGES[0]
                    }))}
                  />
                  <Text style={styles.refLabel}>REFERÊNCIA</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => Alert.alert("Agenda", "Função de agendamento em desenvolvimento.")}
              >
                <Calendar color="#000" size={18} />
                <Text style={styles.ctaButtonText}>AGENDAR HORÁRIO</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.footerText}>Visagismo IA v2.2 • Pro Edition</Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center' },

  header: { alignItems: 'center', marginVertical: 30, width: '100%' },
  headerIcon: { 
    backgroundColor: '#0a0a0a', 
    padding: 18, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: '#1a1a1a',
    marginBottom: 15
  },
  title: { fontSize: 26, fontWeight: '900', color: '#98FB98', letterSpacing: 4 },
  version: { fontSize: 8, color: '#333', letterSpacing: 2, fontWeight: '800', marginTop: 6 },

  keyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    backgroundColor: '#050505',
  },
  keyButtonText: { color: '#444', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  keyButtonTextActive: { color: '#98FB98' },

  keyInputContainer: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#080808',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  keyInput: {
    color: '#ccc',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    paddingVertical: 6,
  },
  keyHint: {
    color: '#333',
    fontSize: 9,
    marginTop: 8,
    letterSpacing: 0.5,
  },

  viewfinder: { width: '100%', alignItems: 'center' },
  emptyState: { 
    width: '100%', 
    aspectRatio: 3/4, 
    backgroundColor: '#050505', 
    borderRadius: 35, 
    borderWidth: 1.5, 
    borderColor: '#111', 
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: { color: '#222', fontWeight: '900', marginTop: 18, fontSize: 10, letterSpacing: 1.5 },
  imageBox: { 
    width: '100%', 
    aspectRatio: 3/4, 
    borderRadius: 35, 
    overflow: 'hidden', 
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#1a1a1a'
  },
  mainPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
  refreshBtn: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    padding: 12, 
    borderRadius: 18 
  },

  buttonContainer: { width: '100%', marginTop: 25, gap: 12 },
  secondaryButton: { 
    height: 55, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: '#111', 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10
  },
  secondaryButtonText: { color: '#555', fontWeight: '700', fontSize: 13 },
  primaryButton: { 
    height: 65, 
    backgroundColor: '#98FB98', 
    borderRadius: 18, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 12,
  },
  disabledButton: { opacity: 0.25 },
  primaryButtonText: { color: '#000', fontWeight: '900', fontSize: 16 },

  resultPanel: { 
    width: '100%', 
    backgroundColor: '#080808', 
    borderRadius: 30, 
    padding: 24, 
    marginTop: 35, 
    borderWidth: 1, 
    borderColor: '#111' 
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  resultBadge: { color: '#98FB98', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  resultBody: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  textContainer: { flex: 1 },
  resultMessage: { color: '#ccc', fontSize: 15, fontWeight: '500', fontStyle: 'italic', lineHeight: 22 },
  refContainer: { alignItems: 'center' },
  refThumbnail: { width: 85, height: 85, borderRadius: 15, backgroundColor: '#000', borderWidth: 1, borderColor: '#1a1a1a' },
  refLabel: { color: '#222', fontSize: 8, fontWeight: '900', marginTop: 6 },
  ctaButton: { 
    backgroundColor: '#FFF', 
    height: 55, 
    borderRadius: 16, 
    marginTop: 25, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 10
  },
  ctaButtonText: { color: '#000', fontWeight: '800', fontSize: 15 },
  footerText: { marginTop: 40, marginBottom: 20, color: '#111', fontSize: 9, fontWeight: 'bold' }
});