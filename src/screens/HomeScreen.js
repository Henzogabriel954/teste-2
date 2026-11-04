import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import HeaderBar from '../components/HeaderBar';
import TagChip from '../components/TagChip';
import PrimaryButton from '../components/PrimaryButton';
import FORNECEDORES from '../services/fornecedoresData';
import { FarmContext } from '../farmContext';

export default function HomeScreen({ navigation }) {
  const { producer } = useContext(FarmContext) || {};
  const fornecedorDestaque = FORNECEDORES[0]; // Horta do Sol

  const pillars = [
    {
      id: 'rastreabilidade',
      titulo: 'Rastreabilidade\nde produtos',
      iconName: 'qrcode-scan',
      iconType: 'material',
      color: COLORS.primary,
      onPress: () => navigation.navigate('QR'),
    },
    {
      id: 'carbono',
      titulo: 'Pegada de\ncarbono',
      iconName: 'cloud-outline',
      iconType: 'ionicons',
      color: COLORS.techBlue,
      onPress: () => navigation.navigate('PegadaCarbono'),
    },
    {
      id: 'consumo',
      titulo: 'Consumo\nconsciente',
      iconName: 'people-outline',
      iconType: 'ionicons',
      color: COLORS.secondary,
      onPress: () => navigation.navigate('Fornecedores'),
    },
    {
      id: 'educacao',
      titulo: 'Educação\nambiental',
      iconName: 'sprout',
      iconType: 'material',
      color: COLORS.primary,
      onPress: () => navigation.navigate('EducacaoAmbiental'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A */}
      <HeaderBar
        title="Horta 4.0"
        rightIcon="notifications-outline"
        onRightPress={() => Alert.alert('Notificações', 'Você está em dia com as novidades.')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner de Boas-Vindas */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTagline}>
            Tecnologia e natureza juntas por um futuro mais sustentável.
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Conectando agricultores, consumidores e o planeta através da rastreabilidade, da educação e de práticas sustentáveis.
          </Text>
        </View>

        {/* 4 Pilares Centrais do Horta 4.0 */}
        <View style={styles.pillarsGrid}>
          {pillars.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.pillarCard}
              activeOpacity={0.8}
              onPress={item.onPress}
              accessibilityRole="button"
            >
              <View style={[styles.pillarIconBox, { backgroundColor: '#EBF6F0' }]}>
                {item.iconType === 'material' ? (
                  <MaterialCommunityIcons name={item.iconName} size={24} color={item.color} />
                ) : (
                  <Ionicons name={item.iconName} size={24} color={item.color} />
                )}
              </View>
              <Text style={styles.pillarText}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Destaque: Produtor Agroecológico da Semana */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Produtor em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Fornecedores')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.featuredSupplierCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SupplierDetail', { fornecedor: fornecedorDestaque })}
        >
          <Image source={fornecedorDestaque.imagemCapa} style={styles.featuredSupplierImage} />
          <View style={styles.featuredSupplierBody}>
            <View style={styles.featuredSupplierHeader}>
              <Text style={styles.supplierName}>{fornecedorDestaque.nome}</Text>
              <TagChip label={fornecedorDestaque.tipo} />
            </View>
            <Text style={styles.supplierBio} numberOfLines={2}>
              {fornecedorDestaque.bio}
            </Text>

            <View style={styles.supplierMetaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
                <Text style={styles.metaText}>{fornecedorDestaque.distancia}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={13} color={COLORS.star} />
                <Text style={styles.metaText}>
                  {fornecedorDestaque.avaliacao} ({fornecedorDestaque.numAvaliacoes})
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card CTA: Escanear Rastreabilidade */}
        <View style={styles.scanCtaCard}>
          <View style={styles.scanCtaContent}>
            <View style={styles.scanCtaTextCol}>
              <Text style={styles.scanCtaTitle}>Rastreie seu alimento</Text>
              <Text style={styles.scanCtaSubtitle}>
                Aponte a câmera para a etiqueta QR Code do maço e confira a origem sustentável.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.scanCtaBtn}
              onPress={() => navigation.navigate('QR')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFFFFF" />
              <Text style={styles.scanCtaBtnText}>Escanear</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 24,
  },
  welcomeBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DFECE4',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeTagline: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 23,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  pillarCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillarText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  featuredSupplierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DFE8E2',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredSupplierImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredSupplierBody: {
    padding: 14,
  },
  featuredSupplierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  supplierBio: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  supplierMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginLeft: 3,
  },
  scanCtaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  scanCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanCtaTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  scanCtaTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  scanCtaSubtitle: {
    color: '#D2EAD9',
    fontSize: 11.5,
    lineHeight: 16,
  },
  scanCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  scanCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});
