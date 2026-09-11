import React, { useState, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { FarmContext } from './farmContext';

// Dados mockados das 2 plantas cadastradas cujos QR Codes foram gerados para impressão
export const plantasDemonstracao = [
  {
    id: 'alface-roxa',
    nome: 'Alface Roxa Orgânica',
    variedade: 'Lactuca sativa var. crispa (Folhas Roxas)',
    icone: 'leaf',
    corIcone: '#8e24aa',
    corBadge: '#f3e5f5',
    textoBadge: '#7b1fa2',
    lote: 'LOTE-ALF-ROXA-2026',
    local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
    produtor: 'Emerson Amorim (Hortifruti Primavera)',
    assistencia: 'Felipe Furlan (IDR-Paraná)',
    dataPlantio: '15/08/2026',
    tempoColheita: '35 dias (Colheita estimada: 20/09/2026)',
    areaCanteiro: 'Canteiro 03 • 250 m²',
    aduboOrganico: 'Sim (Compostagem aerada e torta de mamona)',
    agrotoxicos: 'Não (100% Livre - Manejo Agroecológico)',
    irrigacao: 'Gotejamento automatizado com água tratada',
    manejo:
      'Cultivo consorciado com alecrim para repelência natural de pulgões. Solo coberto com palhada de arroz para retenção de umidade e enriquecimento microbiológico.',
    statusEtiqueta: 'Etiqueta QR Impressa e Anexada ao Lote',
  },
  {
    id: 'salsinha',
    nome: 'Salsinha Especial',
    variedade: 'Petroselinum crispum (Crespa / Lisa)',
    icone: 'sprout',
    corIcone: '#2e7d32',
    corBadge: '#e8f5e9',
    textoBadge: '#1b5e20',
    lote: 'LOTE-SAL-2026-08',
    local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
    produtor: 'Emerson Amorim (Hortifruti Primavera)',
    assistencia: 'Felipe Furlan (IDR-Paraná)',
    dataPlantio: '22/08/2026',
    tempoColheita: '45 dias (Colheita estimada: 05/10/2026)',
    areaCanteiro: 'Canteiro 05 • 180 m²',
    aduboOrganico: 'Sim (Húmus de minhoca e esterco bovino curtido)',
    agrotoxicos: 'Não (100% Livre - Manejo Agroecológico)',
    irrigacao: 'Microaspersão programada ao amanhecer',
    manejo:
      'Canteiro suspenso drenado, adubação verde prévia. Colheita por desfolha das hastes externas, preservando o miolo da planta para colheitas sucessivas a cada 15 dias.',
    statusEtiqueta: 'Etiqueta QR Impressa e Anexada ao Lote',
  },
];

export default function ProdutosSustentavelScreen({ navigation }) {
  const { registrarDiarioCampo, setLotes } = useContext(FarmContext) || {};

  // Abas principais: 'plantas', 'modelos', 'diario'
  const [activeTab, setActiveTab] = useState('plantas');

  // Filtro na aba de plantas: 'todas', 'alface-roxa', 'salsinha'
  const [plantaSelecionada, setPlantaSelecionada] = useState('todas');

  // Estados dos Accordions de Modelos Sustentáveis
  const [expandedAgro, setExpandedAgro] = useState(true);
  const [expandedOrg, setExpandedOrg] = useState(false);
  const [expandedRegen, setExpandedRegen] = useState(false);
  const [expandedPerm, setExpandedPerm] = useState(false);

  // Estados do Diário de Campo para novo lote
  const [cultura, setCultura] = useState('Alface');
  const [dataPlantio, setDataPlantio] = useState('');
  const [tempoColheita, setTempoColheita] = useState('');
  const [lote, setLote] = useState('');
  const [usaAduboOrganico, setUsaAduboOrganico] = useState(true);
  const [usaAgrotoxicos, setUsaAgrotoxicos] = useState(false);
  const [manejo, setManejo] = useState('');

  const culturasOpcoes = ['Alface', 'Tomate', 'Cebolinha', 'Salsinha'];

  // Plantas exibidas na listagem
  const plantasExibidas =
    plantaSelecionada === 'todas'
      ? plantasDemonstracao
      : plantasDemonstracao.filter((p) => p.id === plantaSelecionada);

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Produção & Lotes</Text>
          <Text style={styles.headerSubtitle}>Plantas Cadastradas • Horta 4.0</Text>
        </View>
        <TouchableOpacity
          style={styles.headerCameraBtn}
          onPress={() => navigation && navigation.navigate('ScannerQR')}
          accessibilityLabel="Abrir Câmera para Escanear QR Code"
          accessibilityRole="button"
        >
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Abas Superiores */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'plantas' && styles.tabButtonActive]}
          onPress={() => setActiveTab('plantas')}
        >
          <Text
            style={[styles.tabText, activeTab === 'plantas' && styles.tabTextActive]}
            numberOfLines={1}
          >
            Plantas Cadastradas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'modelos' && styles.tabButtonActive]}
          onPress={() => setActiveTab('modelos')}
        >
          <Text style={[styles.tabText, activeTab === 'modelos' && styles.tabTextActive]}>
            Modelos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'diario' && styles.tabButtonActive]}
          onPress={() => setActiveTab('diario')}
        >
          <Text style={[styles.tabText, activeTab === 'diario' && styles.tabTextActive]}>
            Novo Lote
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ========================================================================= */}
          {/* ABA 1: AS 2 PLANTAS CADASTRADAS (ALFACE ROXA E SALSINHA)                 */}
          {/* ========================================================================= */}
          {activeTab === 'plantas' && (
            <View>
              {/* Banner Informativo sobre Etiquetas de Impressão */}
              <View style={styles.demoBanner}>
                <MaterialCommunityIcons name="printer-check" size={28} color="#00875f" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.demoBannerTitle}>Etiquetas QR Code Prontas para Impressão</Text>
                  <Text style={styles.demoBannerSubtitle}>
                    Os QR Codes de <Text style={{ fontWeight: 'bold' }}>Alface Roxa</Text> e{' '}
                    <Text style={{ fontWeight: 'bold' }}>Salsinha</Text> foram salvos em{' '}
                    <Text style={{ fontWeight: 'bold', color: '#00875f' }}>qrcodes_para_imprimir.html</Text> prontos para imprimir e colar nos maços.
                  </Text>
                  <TouchableOpacity
                    style={styles.openScannerBtn}
                    onPress={() => navigation && navigation.navigate('ScannerQR')}
                    accessibilityLabel="Abrir Câmera e Escanear QR Code"
                    accessibilityRole="button"
                  >
                    <MaterialCommunityIcons name="camera-iris" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.openScannerBtnText}>Abrir Câmera para Escanear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Seletor de visualização (Filtros de Plantas) */}
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    plantaSelecionada === 'todas' && styles.filterChipActive,
                  ]}
                  onPress={() => setPlantaSelecionada('todas')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      plantaSelecionada === 'todas' && styles.filterChipTextActive,
                    ]}
                  >
                    Ver Ambas (2)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    plantaSelecionada === 'alface-roxa' && styles.filterChipActiveRoxa,
                  ]}
                  onPress={() => setPlantaSelecionada('alface-roxa')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      plantaSelecionada === 'alface-roxa' && styles.filterChipTextActive,
                    ]}
                  >
                    🥬 Alface Roxa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    plantaSelecionada === 'salsinha' && styles.filterChipActiveVerde,
                  ]}
                  onPress={() => setPlantaSelecionada('salsinha')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      plantaSelecionada === 'salsinha' && styles.filterChipTextActive,
                    ]}
                  >
                    🌱 Salsinha
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Cards das Plantas Cadastradas */}
              {plantasExibidas.map((planta) => (
                <View key={planta.id} style={styles.plantCard}>
                  {/* Cabeçalho do Card */}
                  <View style={styles.plantHeader}>
                    <View
                      style={[
                        styles.plantIconCircle,
                        { backgroundColor: planta.corBadge },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={planta.icone}
                        size={28}
                        color={planta.corIcone}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.plantTitle}>{planta.nome}</Text>
                      <Text style={styles.plantSubtitle}>{planta.variedade}</Text>
                      <View style={[styles.loteBadge, { backgroundColor: planta.corBadge }]}>
                        <Text style={[styles.loteBadgeText, { color: planta.textoBadge }]}>
                          Lote: {planta.lote}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status da Etiqueta Impressa */}
                  <View style={styles.qrStatusBox}>
                    <Ionicons name="pricetag-outline" size={16} color="#00875f" style={{ marginRight: 6 }} />
                    <Text style={styles.qrStatusText}>{planta.statusEtiqueta}</Text>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* Ficha Técnica de Rastreabilidade */}
                  <Text style={styles.infoSectionHeader}>Ficha Técnica de Cultivo:</Text>

                  <View style={styles.specRow}>
                    <Ionicons name="calendar-outline" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Data de Plantio:</Text>
                    <Text style={styles.specValue}>{planta.dataPlantio}</Text>
                  </View>

                  <View style={styles.specRow}>
                    <Ionicons name="time-outline" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Ciclo / Colheita:</Text>
                    <Text style={styles.specValue}>{planta.tempoColheita}</Text>
                  </View>

                  <View style={styles.specRow}>
                    <MaterialCommunityIcons name="leaf" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Adubo Orgânico:</Text>
                    <Text style={[styles.specValue, { color: '#2e7d32', fontWeight: 'bold' }]}>
                      {planta.aduboOrganico}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <MaterialCommunityIcons name="shield-check" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Agrotóxicos:</Text>
                    <Text style={[styles.specValue, { color: '#15803d', fontWeight: 'bold' }]}>
                      {planta.agrotoxicos}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <Ionicons name="water-outline" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Irrigação:</Text>
                    <Text style={styles.specValue}>{planta.irrigacao}</Text>
                  </View>

                  <View style={[styles.specRow, { alignItems: 'flex-start' }]}>
                    <Feather name="info" size={15} color="#00875f" style={[styles.specIcon, { marginTop: 2 }]} />
                    <Text style={styles.specLabel}>Manejo:</Text>
                    <Text style={[styles.specValue, { flex: 1, lineHeight: 18 }]}>
                      {planta.manejo}
                    </Text>
                  </View>

                  <View style={styles.specRow}>
                    <MaterialCommunityIcons name="certificate" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Assistência:</Text>
                    <Text style={styles.specValue}>{planta.assistencia}</Text>
                  </View>

                  <View style={styles.specRow}>
                    <Ionicons name="location-outline" size={15} color="#00875f" style={styles.specIcon} />
                    <Text style={styles.specLabel}>Origem:</Text>
                    <Text style={[styles.specValue, { flex: 1 }]}>{planta.local}</Text>
                  </View>

                  {/* Botão de ação: Ver Horta no Mapa */}
                  <TouchableOpacity
                    style={styles.cardActionButton}
                    onPress={() => navigation && navigation.navigate('Rastreabilidade')}
                    accessibilityLabel={`Ver localização de ${planta.nome} no mapa`}
                    accessibilityRole="button"
                  >
                    <Ionicons name="map-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.cardActionButtonText}>Ver Localização no Mapa</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: MODELOS SUSTENTÁVEIS DE PRODUÇÃO                                  */}
          {/* ========================================================================= */}
          {activeTab === 'modelos' && (
            <>
              <View style={styles.introCard}>
                <Text style={styles.introText}>
                  Entenda os diferentes modelos de produção sustentável que respeitam o meio ambiente.
                </Text>
              </View>

              {/* Agroecologia */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpandedAgro(!expandedAgro)}
                >
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name="sprout" size={22} color="#2e7d32" />
                    <Text style={styles.cardTitle}>Agroecologia</Text>
                  </View>
                  <Ionicons
                    name={expandedAgro ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
                <Text style={styles.cardSubtitle}>Foco na biodiversidade e equilíbrio</Text>

                {expandedAgro && (
                  <Text style={styles.cardBody}>
                    Promove a biodiversidade, o manejo natural do solo, adubação verde e o controle
                    biológico de pragas sem agrotóxicos sintéticos.
                  </Text>
                )}
              </View>

              {/* Agricultura Orgânica */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpandedOrg(!expandedOrg)}
                >
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name="leaf" size={22} color="#2e7d32" />
                    <Text style={styles.cardTitle}>Agricultura Orgânica</Text>
                  </View>
                  <Ionicons
                    name={expandedOrg ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
                <Text style={styles.cardSubtitle}>Sem fertilizantes e defensivos químicos</Text>

                {expandedOrg && (
                  <Text style={styles.cardBody}>
                    Baseia-se na não utilização de agrotóxicos e fertilizantes solúveis, utilizando
                    compostagem e métodos preventivos de sanidade.
                  </Text>
                )}
              </View>

              {/* Agricultura Regenerativa */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpandedRegen(!expandedRegen)}
                >
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name="recycle" size={22} color="#2e7d32" />
                    <Text style={styles.cardTitle}>Agricultura Regenerativa</Text>
                  </View>
                  <Ionicons
                    name={expandedRegen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
                <Text style={styles.cardSubtitle}>Recuperação ativa da saúde do solo</Text>

                {expandedRegen && (
                  <Text style={styles.cardBody}>
                    Focada em regenerar a saúde do solo, aumentar a retenção hídrica e capturar
                    carbono da atmosfera por meio da cobertura viva contínua.
                  </Text>
                )}
              </View>

              {/* Permacultura */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setExpandedPerm(!expandedPerm)}
                >
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons name="earth" size={22} color="#2e7d32" />
                    <Text style={styles.cardTitle}>Permacultura</Text>
                  </View>
                  <Ionicons
                    name={expandedPerm ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
                <Text style={styles.cardSubtitle}>Design Ecológico Integrado</Text>

                {expandedPerm && (
                  <Text style={styles.cardBody}>
                    Cria ecossistemas produtivos integrando moradia, captação de água, energia e
                    alimentos em harmonia com a natureza.
                  </Text>
                )}
              </View>
            </>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: DIÁRIO DE CAMPO (REGISTRO DINÂMICO DE NOVO LOTE)                   */}
          {/* ========================================================================= */}
          {activeTab === 'diario' && (
            <View style={styles.diarioContainer}>
              <Text style={styles.sectionTitle}>Registrar Novo Lote de Produção</Text>
              <Text style={styles.sectionSubtitle}>
                Cadastre as informações técnicas do lote para emissão da etiqueta de rastreabilidade.
              </Text>

              <Text style={styles.label}>Cultura:</Text>
              <View style={styles.culturaRow}>
                {culturasOpcoes.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.culturaBtn, cultura === item && styles.culturaBtnActive]}
                    onPress={() => setCultura(item)}
                  >
                    <Text
                      style={[
                        styles.culturaBtnText,
                        cultura === item && styles.culturaBtnTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Identificação do Lote:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: LOTE-TOMATE-2026"
                placeholderTextColor="#888"
                value={lote}
                onChangeText={setLote}
                accessibilityLabel="Identificação do Lote"
              />

              <Text style={styles.label}>Data do Plantio:</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#888"
                value={dataPlantio}
                onChangeText={setDataPlantio}
                accessibilityLabel="Data do Plantio"
              />

              <Text style={styles.label}>Tempo estimado para colheita:</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 45 dias"
                placeholderTextColor="#888"
                value={tempoColheita}
                onChangeText={setTempoColheita}
                accessibilityLabel="Tempo estimado para colheita"
              />

              {/* Switches para Adubo e Agrotóxicos */}
              <View style={styles.switchRow}>
                <Text style={styles.labelSwitch}>Utilizou Adubo Orgânico?</Text>
                <Switch
                  value={usaAduboOrganico}
                  onValueChange={setUsaAduboOrganico}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={usaAduboOrganico ? '#2e7d32' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.labelSwitch}>Utilizou Agrotóxicos?</Text>
                <Switch
                  value={usaAgrotoxicos}
                  onValueChange={setUsaAgrotoxicos}
                  trackColor={{ false: '#767577', true: '#ff8181' }}
                  thumbColor={usaAgrotoxicos ? '#d32f2f' : '#f4f3f4'}
                />
              </View>

              <Text style={styles.label}>Como foi feito o manejo?</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Descreva práticas de irrigação, controle de pragas, adubação..."
                placeholderTextColor="#888"
                multiline
                value={manejo}
                onChangeText={setManejo}
                accessibilityLabel="Descrição do manejo"
              />

              {/* Botão Registrar Lote */}
              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => {
                  if (registrarDiarioCampo) registrarDiarioCampo(cultura);
                  if (setLotes) {
                    setLotes((prev) => [
                      ...prev,
                      {
                        id: String(Date.now()),
                        cultura,
                        lote: lote || `LOTE-${Date.now()}`,
                        dataPlantio: dataPlantio || 'Hoje',
                        tempoColheita: tempoColheita || 'A definir',
                        aduboOrganico: usaAduboOrganico,
                        agrotoxicos: usaAgrotoxicos,
                        manejo,
                      },
                    ]);
                  }
                  Alert.alert('Sucesso', 'Novo lote registrado com sucesso no diário de campo!');
                }}
              >
                <MaterialCommunityIcons name="check-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.generateButtonText}>Registrar Lote no Diário</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    backgroundColor: '#00875f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#d1e7dd',
    fontSize: 12,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#00875f',
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  demoBannerTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  demoBannerSubtitle: {
    fontSize: 12,
    color: '#388e3c',
    marginTop: 2,
    lineHeight: 17,
  },
  headerCameraBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginLeft: 10,
  },
  openScannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00875f',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  openScannerBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#00875f',
    borderColor: '#00875f',
  },
  filterChipActiveRoxa: {
    backgroundColor: '#8e24aa',
    borderColor: '#8e24aa',
  },
  filterChipActiveVerde: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  plantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#eef2f5',
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
  },
  plantSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  loteBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  loteBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  qrStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fdfa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  qrStatusText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 14,
  },
  infoSectionHeader: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specIcon: {
    width: 22,
    marginRight: 4,
  },
  specLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  specValue: {
    fontSize: 12.5,
    color: '#222',
    flex: 1,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f2c59',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
  },
  cardActionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  introCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  introText: {
    color: '#1b5e20',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 30,
  },
  cardBody: {
    fontSize: 13,
    color: '#444',
    marginTop: 10,
    lineHeight: 19,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  diarioContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#666',
    marginBottom: 14,
  },
  label: {
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  culturaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 6,
  },
  culturaBtn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  culturaBtnActive: {
    backgroundColor: '#00875f',
    borderColor: '#00875f',
  },
  culturaBtnText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  culturaBtnTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fafafa',
    color: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  labelSwitch: {
    color: '#333',
    fontSize: 13,
  },
  generateButton: {
    backgroundColor: '#00875f',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 18,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});