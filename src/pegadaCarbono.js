import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmContext } from './farmContext';

export default function PegadaCarbonoScreen({ navigation }) {
  const { carbonPoints } = useContext(FarmContext) || {};
  // Estados para os inputs interativos
  const [transporte, setTransporte] = useState(50);
  const [energia, setEnergia] = useState(30);

  // Cálculo fictício proporcional baseado nos sliders
  const emissaoTotal = (Number(transporte) * 0.5 + Number(energia) * 0.4).toFixed(1);
  const percentTransporte = Math.round((transporte * 0.5 / (emissaoTotal > 0 ? emissaoTotal : 1)) * 100);
  const percentEnergia = 100 - percentTransporte;

  const handleVoltar = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Perfil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleVoltar}
            style={styles.backButton}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pegada de Carbono</Text>
        </View>

        {/* Card de Boas-Vindas / Impacto */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Calcule seu Impacto</Text>
          <Text style={styles.welcomeSubtitle}>
            Monitore as emissões da sua produção para um futuro mais verde.
          </Text>
          <Text style={{ color: '#4ADE80', fontWeight: 'bold', marginTop: 10 }}>
            🌱 Saldo Ecológico: {carbonPoints || 150} pontos
          </Text>
          <View style={styles.iconContainer}>
            <Ionicons name="globe-outline" size={28} color="#4ADE80" />
          </View>
        </View>

        {/* Card de Controles (Sliders e Inputs) */}
        <View style={styles.card}>
          {/* Transporte */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Transporte (Km/semana)</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{transporte} Km</Text>
              </View>
            </View>
            
            {/* Simulação visual do Slider */}
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(transporte)}
              onChangeText={(val) => setTransporte(val.replace(/[^0-9]/g, ''))}
              accessibilityLabel="Transporte em quilômetros por semana"
            />
          </View>

          {/* Energia */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Energia (Consumo mensal)</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{energia} kwh</Text>
              </View>
            </View>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(energia)}
              onChangeText={(val) => setEnergia(val.replace(/[^0-9]/g, ''))}
              accessibilityLabel="Consumo mensal de energia em kWh"
            />
          </View>
        </View>

        {/* Card de Emissão Estimada */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Emissão Estimada</Text>
          
          <View style={styles.resultContainer}>
            {/* Gráfico circular simulado */}
            <View style={styles.circleGraph}>
              <Text style={styles.circleValue}>{emissaoTotal}</Text>
              <Text style={styles.circleUnit}>kg/ano</Text>
            </View>

            <View style={styles.statsBreakdown}>
              <View style={styles.statItem}>
                <Text style={styles.statPercent}>{isNaN(percentTransporte) ? 0 : percentTransporte}%</Text>
                <Text style={styles.statLabel}>Transporte</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statPercent}>{isNaN(percentEnergia) ? 0 : percentEnergia}%</Text>
                <Text style={styles.statLabel}>Energia</Text>
              </View>
            </View>
          </View>

          <View style={styles.statusAlert}>
            <Text style={styles.statusAlertText}>
              Sua emissão é considerada <Text style={{ fontWeight: 'bold' }}>Moderada.</Text>
            </Text>
          </View>
        </View>

        {/* Dicas para Reduzir */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Dicas para Reduzir</Text>
          
          <View style={styles.tipRow}>
            <MaterialCommunityIcons name="bike" size={24} color="#064E3B" style={styles.tipIcon} />
            <Text style={styles.tipText}>Utilize entregas consolidadas para reduzir viagens.</Text>
          </View>

          <View style={styles.tipRow}>
            <MaterialCommunityIcons name="solar-panel" size={24} color="#064E3B" style={styles.tipIcon} />
            <Text style={styles.tipText}>Invista em energia solar para o manejo dos lotes.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: '#0B192C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  welcomeTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    width: '80%',
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: { ios: 0.1, android: 0.2 }[Platform.OS] || 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#0A3981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  circleGraph: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  circleUnit: {
    fontSize: 12,
    color: '#4B5563',
  },
  statsBreakdown: {
    justifyContent: 'center',
  },
  statItem: {
    marginBottom: 8,
  },
  statPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusAlert: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusAlertText: {
    color: '#92400E',
    fontSize: 13,
  },
  tipsSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});