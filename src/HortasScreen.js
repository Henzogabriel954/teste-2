import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './theme/colors';
import HeaderBar from './components/HeaderBar';
import TagChip from './components/TagChip';
import FORNECEDORES from './services/fornecedoresData';

const { width } = Dimensions.get('window');

// Tenta importar MapView de react-native-maps com fallback elegante
let MapView = null;
let Marker = null;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
} catch (e) {
  // Fallback em ambientes web/harness sem módulos nativos
}

export default function HortasScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(FORNECEDORES[0]);

  const fornecedoresFiltrados = FORNECEDORES.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.tipo.toLowerCase().includes(busca.toLowerCase()) ||
    f.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  const handleVerDetalhes = (fornecedor) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('SupplierDetail', { fornecedor });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A */}
      <HeaderBar
        title="Horta 4.0"
        rightIcon="notifications-outline"
        onRightPress={() => Alert.alert('Notificações', 'Você não possui notificações pendentes.')}
      />

      <View style={styles.container}>
        {/* Barra de Pesquisa Flutuante */}
        <View style={styles.searchFloatingWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#68786E" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar locais, produtores..."
              placeholderTextColor="#8F9E95"
              value={busca}
              onChangeText={setBusca}
            />
            <TouchableOpacity
              onPress={() => Alert.alert('Filtros', 'Filtros avançados de distância e certificação orgânica.')}
              style={styles.filterButton}
              accessibilityRole="button"
              accessibilityLabel="Filtro"
            >
              <Ionicons name="options-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Visualização de Mapa (Nativo ou Canvas Ilustrado Fiel) */}
        <View style={styles.mapArea}>
          {MapView && Platform.OS !== 'web' ? (
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: -23.3085,
                longitude: -51.1650,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
            >
              {fornecedoresFiltrados.map((item) => (
                <Marker
                  key={item.id}
                  coordinate={item.coordenadas}
                  onPress={() => setFornecedorSelecionado(item)}
                >
                  <View style={[
                    styles.customMarker,
                    fornecedorSelecionado.id === item.id && styles.customMarkerActive,
                  ]}>
                    <Ionicons name="leaf" size={16} color="#FFFFFF" />
                  </View>
                </Marker>
              ))}
            </MapView>
          ) : (
            // Mapa Visual Estilizado idêntico ao poster (ruas, áreas verdes e pins)
            <View style={styles.mapCanvas}>
              {/* Vias do Mapa */}
              <View style={[styles.mapRoad, { top: 90, left: -20, width: '120%', transform: [{ rotate: '25deg' }] }]} />
              <View style={[styles.mapRoad, { top: 220, left: -20, width: '120%', transform: [{ rotate: '-15deg' }] }]} />
              <View style={[styles.mapRoad, { top: -20, left: 140, height: '120%', width: 14, transform: [{ rotate: '10deg' }] }]} />
              <View style={[styles.mapRoad, { top: -20, left: 260, height: '120%', width: 10, transform: [{ rotate: '-20deg' }] }]} />
              
              {/* Áreas Verdes de Preservação / Fazendas */}
              <View style={[styles.mapGreenZone, { top: 60, right: 30, width: 100, height: 75 }]} />
              <View style={[styles.mapGreenZone, { bottom: 140, left: 20, width: 120, height: 90 }]} />
              <View style={[styles.mapWaterZone, { top: 180, right: 20, width: 60, height: 60 }]} />

              {/* Pins dos Fornecedores mapeados na tela */}
              {fornecedoresFiltrados.map((f, index) => {
                const isSelected = fornecedorSelecionado.id === f.id;
                // Posições espalhadas proporcionais
                const positions = [
                  { top: '35%', left: '46%' }, // Horta do Sol (centro)
                  { top: '22%', left: '25%' },
                  { top: '18%', left: '72%' },
                  { top: '55%', left: '68%' },
                  { top: '62%', left: '22%' },
                ];
                const pos = positions[index % positions.length];

                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setFornecedorSelecionado(f)}
                    style={[
                      styles.mapPinContainer,
                      pos,
                      isSelected && styles.mapPinActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.pinBubble, isSelected && styles.pinBubbleActive]}>
                      <Ionicons name="leaf" size={14} color="#FFFFFF" />
                    </View>
                    <View style={styles.pinTip} />
                  </TouchableOpacity>
                );
              })}

              {/* Indicador de Localização Atual do Usuário (Ponto Azul) */}
              <View style={styles.userLocationDot}>
                <View style={styles.userLocationPulse} />
              </View>

              {/* Botão de Centralizar / Mira */}
              <TouchableOpacity
                style={styles.recenterButton}
                onPress={() => setFornecedorSelecionado(FORNECEDORES[0])}
                accessibilityRole="button"
                accessibilityLabel="Centralizar localização"
              >
                <Ionicons name="locate" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Card Flutuante Inferior com o Fornecedor Selecionado (Ex: Horta do Sol) */}
        {fornecedorSelecionado && (
          <View style={styles.floatingCardContainer}>
            <View style={styles.supplierCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="leaf" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.cardMainInfo}>
                  <Text style={styles.cardSupplierName} numberOfLines={1}>
                    {fornecedorSelecionado.nome}
                  </Text>
                  <TagChip label={fornecedorSelecionado.tipo} style={styles.supplierTag} />
                  
                  <View style={styles.cardMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
                      <Text style={styles.metaText}>{fornecedorSelecionado.distancia}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={13} color={COLORS.star} />
                      <Text style={styles.metaText}>
                        {fornecedorSelecionado.avaliacao} ({fornecedorSelecionado.numAvaliacoes})
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botão Ver Detalhes */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleVerDetalhes(fornecedorSelecionado)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8EFEA',
    position: 'relative',
  },
  searchFloatingWrapper: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#D4E2D9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  filterButton: {
    padding: 6,
  },
  mapArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E4EDE7',
    position: 'relative',
    overflow: 'hidden',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4E0D8',
  },
  mapGreenZone: {
    position: 'absolute',
    backgroundColor: '#CDE5D6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#BCDBC6',
  },
  mapWaterZone: {
    position: 'absolute',
    backgroundColor: '#D1E8F2',
    borderRadius: 30,
  },
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mapPinActive: {
    zIndex: 15,
    transform: [{ scale: 1.15 }],
  },
  pinBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinBubbleActive: {
    backgroundColor: '#0F8349',
    borderColor: '#FFF',
    borderWidth: 2.5,
  },
  pinTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 0,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  customMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  customMarkerActive: {
    backgroundColor: COLORS.secondary,
    transform: [{ scale: 1.2 }],
  },
  userLocationDot: {
    position: 'absolute',
    top: '48%',
    left: '52%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
  },
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  floatingCardContainer: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    zIndex: 25,
  },
  supplierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2ECE6',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardSupplierName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  supplierTag: {
    marginTop: 2,
    marginBottom: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginLeft: 3,
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
