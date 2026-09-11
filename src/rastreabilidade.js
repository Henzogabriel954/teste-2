import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// Dados dos fornecedores reais com suas localizações exatas
const fornecedoresMapeados = [
  {
    id: 'emerson',
    nome: 'Hortifruti Primavera (Emerson Amorim)',
    tipo: 'Horta Orgânica / Familiar',
    local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
    contato: '43 99967-0744',
    coordenadas: { latitude: -23.3085, longitude: -51.1650 },
  },
  {
    id: 'kawai',
    nome: 'Recanto Kawai (Tadao e Marlene)',
    tipo: 'Morangos Agroecológicos',
    local: 'Rua Sibipiruna, Condomínio Itaúna - Ibiporã / PR',
    contato: '43 99941-2196',
    coordenadas: { latitude: -23.3130, longitude: -51.1600 },
  },
];

export default function RastreabilidadeScreen({ route, navigation }) {
  const mapRef = useRef(null);

  // Fornecedor enviado por parâmetro (ou o primeiro como padrão)
  const fornecedorParam = route?.params?.fornecedor;
  const initialFornecedor =
    fornecedoresMapeados.find((f) => f.id === fornecedorParam?.id) ||
    fornecedorParam ||
    fornecedoresMapeados[0];

  const [fornecedorAtivo, setFornecedorAtivo] = useState(initialFornecedor);

  // Região inicial centralizada no fornecedor selecionado
  const [region, setRegion] = useState({
    latitude: initialFornecedor.coordenadas?.latitude || -23.3085,
    longitude: initialFornecedor.coordenadas?.longitude || -51.1650,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  });

  // Atualiza a seleção e centraliza o mapa quando o parâmetro muda
  useEffect(() => {
    if (route?.params?.fornecedor) {
      const f = route.params.fornecedor;
      const coords = f.coordenadas || {
        latitude: f.id === 'kawai' ? -23.3130 : -23.3085,
        longitude: f.id === 'kawai' ? -51.1600 : -51.1650,
      };
      setFornecedorAtivo({ ...f, coordenadas: coords });
      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion(newRegion, 800);
      }
    }
  }, [route?.params?.fornecedor]);

  // Abre a rota no aplicativo externo de mapas buscando apenas pelo endereço
  const abrirNoGoogleMaps = async (fornecedor = fornecedorAtivo) => {
    const query = encodeURIComponent(fornecedor.local);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao abrir o mapa.');
    }
  };

  const selecionarPin = (fornecedor) => {
    setFornecedorAtivo(fornecedor);
    if (mapRef.current && fornecedor.coordenadas && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(
        {
          latitude: fornecedor.coordenadas.latitude,
          longitude: fornecedor.coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        600
      );
    }
  };

  // Renderiza o mapa de forma segura e compatível com Web e Mobile
  const renderMap = () => {
    if (Platform.OS === 'web') {
      // No navegador Web: usa React.createElement para renderizar iframe do Google Maps sem quebrar o JSX do React Native
      const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fornecedorAtivo.local)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      return (
        <View style={StyleSheet.absoluteFillObject}>
          {React.createElement('iframe', {
            title: 'Mapa de Rastreabilidade',
            width: '100%',
            height: '100%',
            style: {
              border: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#e5e3df',
            },
            src: embedUrl,
            loading: 'lazy',
          })}
        </View>
      );
    }

    // No Mobile (Android / iOS): renderiza MapView nativo
    return (
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
      >
        {/* Marcador Real 1: Hortifruti Primavera (Emerson Amorim) */}
        <Marker
          coordinate={{ latitude: -23.3085, longitude: -51.1650 }}
          title="Hortifruti Primavera (Emerson Amorim)"
          description="Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR"
          onPress={() => selecionarPin(fornecedoresMapeados[0])}
        >
          <View
            style={[
              styles.markerPin,
              fornecedorAtivo?.id === 'emerson' && styles.markerPinActive,
            ]}
          >
            <MaterialCommunityIcons name="sprout" size={18} color="#fff" />
          </View>
        </Marker>

        {/* Marcador Real 2: Recanto Kawai (Tadao e Marlene) */}
        <Marker
          coordinate={{ latitude: -23.3130, longitude: -51.1600 }}
          title="Recanto Kawai (Tadao e Marlene)"
          description="Rua Sibipiruna, Condomínio Itaúna - Ibiporã / PR"
          onPress={() => selecionarPin(fornecedoresMapeados[1])}
        >
          <View
            style={[
              styles.markerPin,
              { backgroundColor: '#00875f' },
              fornecedorAtivo?.id === 'kawai' && styles.markerPinActive,
            ]}
          >
            <Ionicons name="location" size={18} color="#fff" />
          </View>
        </Marker>
      </MapView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho Verde com Trilhas de Navegação */}
      <View style={styles.header}>
        <View style={styles.topRowHeader}>
          <TouchableOpacity
            onPress={() => navigation && navigation.goBack && navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('Perfil')}>
              <Text style={styles.breadcrumbTitle}>Perfil</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbTitle}> | </Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('CatalogoFornecedores')}>
              <Text style={styles.breadcrumbTitle}>Catálogo</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbTitle}> | Rastreabilidade</Text>
          </View>
        </View>

        {/* Botão "Abrir no Maps externo" */}
        <TouchableOpacity
          style={styles.mapExternalButton}
          onPress={() => abrirNoGoogleMaps(fornecedorAtivo)}
          accessibilityLabel="Abrir rota no Google Maps externo"
          accessibilityRole="button"
        >
          <Text style={styles.mapExternalButtonText}>Abrir no Maps</Text>
          <Ionicons name="open-outline" size={14} color="#00875f" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Componente do Mapa no Aplicativo */}
      <View style={styles.mapContainer}>
        {/* Renderiza o mapa web ou mobile */}
        {renderMap()}

        {/* Chips de seleção rápida sobre o mapa */}
        <View style={styles.topSelectorOverlay}>
          {fornecedoresMapeados.map((item) => {
            const isActive = fornecedorAtivo?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.topSelectorChip, isActive && styles.topSelectorChipActive]}
                onPress={() => selecionarPin(item)}
                accessibilityLabel={`Selecionar ${item.nome}`}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={item.id === 'kawai' ? 'fruit-cherries' : 'sprout'}
                  size={15}
                  color={isActive ? '#fff' : '#00875f'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.topSelectorText, isActive && styles.topSelectorTextActive]}>
                  {item.id === 'kawai' ? 'Recanto Kawai' : 'Hortifruti Primavera'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card Flutuante mostrando o endereço e dados da descrição */}
        <View style={styles.supplierCardFloating}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.supplierCardTitle} numberOfLines={1}>
                {fornecedorAtivo.nome}
              </Text>
              <Text style={styles.supplierCardType}>{fornecedorAtivo.tipo}</Text>
            </View>
            <View style={styles.pinBadge}>
              <Ionicons name="navigate" size={14} color="#00875f" />
            </View>
          </View>

          {/* Endereço completo exibido na descrição */}
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={16} color="#00875f" style={{ marginRight: 6 }} />
            <Text style={styles.supplierAddressText}>
              {fornecedorAtivo.local}
            </Text>
          </View>

          {fornecedorAtivo.contato && (
            <View style={styles.phoneBox}>
              <Feather name="phone" size={14} color="#666" style={{ marginRight: 6 }} />
              <Text style={styles.supplierPhoneText}>{fornecedorAtivo.contato}</Text>
            </View>
          )}

          {/* Botões de Ação na Base do Card */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={() => abrirNoGoogleMaps(fornecedorAtivo)}
              accessibilityLabel="Traçar rota no Google Maps"
              accessibilityRole="button"
            >
              <Ionicons name="navigate-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.navigateBtnText}>Traçar Rota no Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => navigation && navigation.navigate('Hortas', { hortaData: fornecedorAtivo })}
              accessibilityLabel="Ver registros da horta"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="book-open-outline" size={16} color="#00875f" style={{ marginRight: 4 }} />
              <Text style={styles.detailsBtnText}>Ver Horta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Flutuante Inferior Direito: Rastrear Lote com a Câmera */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation && navigation.navigate('ScannerQR')}
          accessibilityLabel="Abrir câmera e escanear QR Code"
          accessibilityRole="button"
        >
          <View style={styles.qrIconContainer}>
            <MaterialCommunityIcons name="camera-iris" size={20} color="#00875f" />
          </View>
          <Text style={styles.floatingButtonText}>Escanear QR Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00875f',
  },
  header: {
    backgroundColor: '#00875f',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  breadcrumbTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapExternalButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 32,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mapExternalButtonText: {
    color: '#00875f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  topSelectorOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
  },
  topSelectorChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  topSelectorChipActive: {
    backgroundColor: '#00875f',
    borderColor: '#00875f',
  },
  topSelectorText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#333',
  },
  topSelectorTextActive: {
    color: '#fff',
  },
  markerPin: {
    backgroundColor: '#d32f2f',
    padding: 7,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  markerPinActive: {
    borderWidth: 3,
    borderColor: '#ffd700',
    transform: [{ scale: 1.15 }],
  },
  supplierCardFloating: {
    position: 'absolute',
    bottom: 72,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e8f5e9',
    zIndex: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  supplierCardTitle: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#111',
  },
  supplierCardType: {
    fontSize: 11.5,
    color: '#00875f',
    fontWeight: '600',
    marginTop: 1,
  },
  pinBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  supplierAddressText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginBottom: 8,
  },
  supplierPhoneText: {
    fontSize: 11.5,
    color: '#555',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  navigateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00875f',
    paddingVertical: 9,
    borderRadius: 8,
  },
  navigateBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  detailsBtnText: {
    color: '#00875f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 10,
  },
  qrIconContainer: {
    marginRight: 5,
  },
  floatingButtonText: {
    color: '#111',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
});