import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './theme/colors';
import HeaderBar from './components/HeaderBar';
import TagChip from './components/TagChip';

export default function EducacaoAmbientalScreen({ navigation }) {
  const modulos = [
    {
      id: 'dicas',
      titulo: 'Dicas Sustentáveis',
      descricao: 'Pequenas ações, grandes impactos',
      icon: 'leaf-outline',
      onPress: () => {
        Alert.alert(
          'Dicas Sustentáveis',
          '• Reutilize a água do cozimento de vegetais para regar plantas.\n• Faça rotação de culturas para manter o solo rico.\n• Prefira adubos orgânicos e biofertilizantes.'
        );
      },
    },
    {
      id: 'videos',
      titulo: 'Vídeos e Artigos',
      descricao: 'Conhecimento que transforma',
      icon: 'play-circle-outline',
      onPress: () => {
        if (navigation && navigation.navigate) {
          navigation.navigate('EducacaoAlimentar');
        } else {
          Alert.alert('Vídeos e Artigos', 'Conteúdos sobre compostagem, minhocário e manejo orgânico.');
        }
      },
    },
    {
      id: 'quiz',
      titulo: 'Quiz',
      descricao: 'Teste seus conhecimentos',
      icon: 'help-circle-outline',
      onPress: () => {
        Alert.alert(
          'Quiz Sustentável',
          'Pergunta: Qual é o benefício do controle biológico de pragas?\n\nA) Elimina o uso de venenos químicos e preserva polinizadores como as abelhas.'
        );
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A: ← Educação */}
      <HeaderBar
        title="Educação"
        showBack={navigation && navigation.canGoBack()}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card Destaque Principal: Horta na Escola */}
        <View style={styles.featuredCard}>
          <Image
            source={require('../assets/hortaEmerson/mudasMorango.jpeg')}
            style={styles.featuredImage}
          />
          <View style={styles.featuredBody}>
            <View style={styles.featuredHeaderRow}>
              <Text style={styles.featuredTitle}>Horta na Escola</Text>
              <TagChip label="Agroecologia" />
            </View>
            <Text style={styles.featuredDescription}>
              Aprenda sobre agricultura sustentável, nutrição e o impacto das suas escolhas no planeta.
            </Text>
          </View>
        </View>

        {/* Lista de Módulos Educacionais */}
        <View style={styles.modulesCard}>
          {modulos.map((modulo, index) => (
            <TouchableOpacity
              key={modulo.id}
              style={[
                styles.moduleRow,
                index === modulos.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.75}
              onPress={modulo.onPress}
              accessibilityRole="button"
            >
              <View style={styles.moduleLeft}>
                <View style={styles.moduleIconCircle}>
                  <Ionicons name={modulo.icon} size={20} color={COLORS.primary} />
                </View>
                <View style={styles.moduleTextContainer}>
                  <Text style={styles.moduleTitle}>{modulo.titulo}</Text>
                  <Text style={styles.moduleDescription}>{modulo.descricao}</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9EB0A6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner Inferior: Juntos por um futuro mais verde! */}
        <View style={styles.communityBanner}>
          <View style={styles.bannerLeafIcon}>
            <MaterialCommunityIcons name="sprout" size={26} color="#7AE0A3" />
          </View>
          <Text style={styles.communityBannerText}>
            Juntos por um{'\n'}futuro mais verde!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DFE8E2',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  featuredBody: {
    padding: 16,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  featuredDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  modulesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF4F0',
  },
  moduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  moduleDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  communityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerLeafIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  communityBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
});
