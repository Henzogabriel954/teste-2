import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './theme/colors';
import HeaderBar from './components/HeaderBar';
import PrimaryButton from './components/PrimaryButton';

export default function PegadaCarbonoScreen({ navigation }) {
  const [detalheCategoria, setDetalheCategoria] = useState(null);

  const categorias = [
    {
      id: 'alimentacao',
      nome: 'Alimentação',
      valor: '1,2 tCO₂e',
      iconName: 'food-apple-outline',
      iconType: 'material',
      dica: 'Consumir alimentos locais de hortas agroecológicas reduz a pegada de transporte e refrigeração em até 30%.',
    },
    {
      id: 'transporte',
      nome: 'Transporte',
      valor: '0,6 tCO₂e',
      iconName: 'car-outline',
      iconType: 'ionicons',
      dica: 'Priorize caminhada, bicicleta ou transporte coletivo para deslocamentos curtos na sua região.',
    },
    {
      id: 'energia',
      nome: 'Energia',
      valor: '0,4 tCO₂e',
      iconName: 'flash-outline',
      iconType: 'ionicons',
      dica: 'Aproveite a luz solar natural e utilize lâmpadas LED de alta eficiência energética.',
    },
    {
      id: 'residuos',
      nome: 'Resíduos',
      valor: '0,2 tCO₂e',
      iconName: 'trash-outline',
      iconType: 'ionicons',
      dica: 'A compostagem doméstica de restos orgânicos evita a emissão de gás metano em aterros.',
    },
  ];

  const handleVerDicas = () => {
    Alert.alert(
      'Dicas de Redução de Carbono',
      '1. Compre direto de produtores da Horta 4.0\n2. Realize compostagem de restos de alimentos\n3. Evite sacolas plásticas de uso único\n4. Reduza o desperdício alimentar planejando suas refeições.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A */}
      <HeaderBar
        title="Pegada de Carbono"
        showBack={navigation && navigation.canGoBack()}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Título e Subtítulo da Tela */}
        <View style={styles.introHeader}>
          <Text style={styles.pageTitle}>Calcule sua pegada de carbono</Text>
          <Text style={styles.pageSubtitle}>
            Entenda o impacto das suas escolhas no meio ambiente.
          </Text>
        </View>

        {/* Card Destaque: Seu Impacto (2,4 tCO₂e/ano e -10%) */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <View style={styles.leafIconCircle}>
              <Ionicons name="leaf" size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.impactLabel}>Seu impacto</Text>
              <Text style={styles.impactValue}>2,4 tCO₂e/ano</Text>
            </View>
          </View>

          {/* Badge Comparativo */}
          <View style={styles.comparisonBadge}>
            <Text style={styles.comparisonBadgeText}>-10% que a média nacional</Text>
          </View>
        </View>

        {/* Lista de Categorias de Emissão */}
        <View style={styles.categoriesList}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              activeOpacity={0.75}
              onPress={() => {
                setDetalheCategoria(cat);
                Alert.alert(`${cat.nome} (${cat.valor})`, cat.dica);
              }}
              accessibilityRole="button"
            >
              <View style={styles.categoryLeft}>
                <View style={styles.categoryIconCircle}>
                  {cat.iconType === 'material' ? (
                    <MaterialCommunityIcons name={cat.iconName} size={20} color={COLORS.primary} />
                  ) : (
                    <Ionicons name={cat.iconName} size={20} color={COLORS.primary} />
                  )}
                </View>
                <View>
                  <Text style={styles.categoryName}>{cat.nome}</Text>
                  <Text style={styles.categoryValue}>{cat.valor}</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9DB0A5" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Ver Dicas de Redução */}
        <PrimaryButton
          title="Ver dicas de redução"
          onPress={handleVerDicas}
          style={styles.tipsButton}
        />
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
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 28,
  },
  introHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DFE9E3',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leafIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAF6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  impactLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  comparisonBadge: {
    backgroundColor: '#E7F5ED',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  comparisonBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  categoriesList: {
    marginBottom: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  categoryValue: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tipsButton: {
    height: 50,
  },
});
