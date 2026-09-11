import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Lista dos fornecedores reais com descrição e endereço cadastrado
export const listaFornecedores = [
  {
    id: 'emerson',
    nome: 'Hortifruti Primavera (Emerson Amorim)',
    tipo: 'Horta Familiar / Orgânica',
    local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
    contato: '43 99967-0744',
    responsavel: 'Emerson Amorim',
    area: '5.000 m²',
    produtos: ['Alface', 'Tomate', 'Pepino', 'Pimentão', 'Abobrinha'],
    coordenadas: { latitude: -23.3085, longitude: -51.1650 },
    imagemCapa: require('../assets/hortaEmerson/lotepedeAlface.jpeg'),
  },
  {
    id: 'kawai',
    nome: 'Recanto Kawai (Tadao e Marlene)',
    tipo: 'Horta Familiar / Morangos Agroecológicos',
    local: 'Rua Sibipiruna, Condomínio Itaúna - Ibiporã / PR',
    contato: '43 99941-2196',
    responsavel: 'Alcides Tadao Kuriki / Marlene Kobayasi',
    area: '3 Estufas de Cultivo',
    produtos: ['Morango'],
    coordenadas: { latitude: -23.3130, longitude: -51.1600 },
    imagemCapa: require('../assets/hortaEmerson/morango.jpeg'),
  },
];

export default function CatalogoFornecedoresScreen({ navigation }) {
  const [busca, setBusca] = useState('');

  // Filtra por nome, local/endereço ou produto
  const fornecedoresFiltrados = listaFornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(busca.toLowerCase()) ||
    fornecedor.local.toLowerCase().includes(busca.toLowerCase()) ||
    fornecedor.produtos.some((p) => p.toLowerCase().includes(busca.toLowerCase()))
  );

  // Ao clicar no fornecedor, abre o mapa no aplicativo com o endereço da descrição
  const handleAbrirNoMapaDoApp = (fornecedor) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Rastreabilidade', { fornecedor });
    }
  };

  // Abre diretamente no Google Maps externo pesquisando apenas pelo endereço
  const handleAbrirNoGoogleMapsExterno = async (fornecedor) => {
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
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao abrir o mapa.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho Verde */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catálogo de{'\n'}Fornecedores</Text>
      </View>

      <FlatList
        data={fornecedoresFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar fornecedor por nome, produto ou endereço..."
                placeholderTextColor="#888"
                value={busca}
                onChangeText={setBusca}
                accessibilityLabel="Buscar fornecedor"
              />
            </View>

            <Text style={styles.helperText}>
              Toque em qualquer fornecedor para abrir a localização e o endereço no mapa do aplicativo.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => handleAbrirNoMapaDoApp(item)}
            accessibilityLabel={`Abrir localização de ${item.nome} no mapa`}
            accessibilityRole="button"
          >
            <Image source={item.imagemCapa} style={styles.cardImage} />

            <View style={styles.cardInfo}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.nome}
                </Text>
              </View>

              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{item.tipo}</Text>
              </View>

              {/* Endereço na descrição */}
              <View style={styles.infoRow}>
                <Ionicons name="location" size={15} color="#00875f" style={{ marginRight: 5 }} />
                <Text style={styles.addressText} numberOfLines={2}>
                  {item.local}
                </Text>
              </View>

              {/* Telefone */}
              <View style={styles.infoRow}>
                <Feather name="phone" size={13} color="#666" style={{ marginRight: 5 }} />
                <Text style={styles.infoText}>{item.contato}</Text>
              </View>

              {/* Botão de ação para abrir o mapa com o endereço */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.openMapBadge}
                  onPress={() => handleAbrirNoMapaDoApp(item)}
                  accessibilityLabel="Ver no Mapa do App"
                  accessibilityRole="button"
                >
                  <Ionicons name="map" size={14} color="#00875f" style={{ marginRight: 4 }} />
                  <Text style={styles.openMapText}>Ver no Mapa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.openExternalMapBtn}
                  onPress={() => handleAbrirNoGoogleMapsExterno(item)}
                  accessibilityLabel="Abrir no Google Maps"
                  accessibilityRole="button"
                >
                  <Ionicons name="open-outline" size={14} color="#555" style={{ marginRight: 3 }} />
                  <Text style={styles.openExternalMapText}>Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: {
    backgroundColor: '#00875f',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginBottom: 8 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', lineHeight: 28 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardImage: { width: 85, height: 85, borderRadius: 12, backgroundColor: '#eee' },
  cardInfo: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111', flex: 1 },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    marginVertical: 4,
  },
  badgeText: { fontSize: 10.5, fontWeight: 'bold', color: '#0288d1' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 },
  addressText: { fontSize: 12, color: '#333', fontWeight: '500', flex: 1, lineHeight: 16 },
  infoText: { fontSize: 12, color: '#666' },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  openMapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openMapText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#00875f',
  },
  openExternalMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openExternalMapText: {
    fontSize: 11.5,
    color: '#555',
    fontWeight: '600',
  },
});