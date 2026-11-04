import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from './theme/colors';
import HeaderBar from './components/HeaderBar';
import FORNECEDORES from './services/fornecedoresData';

export default function CatalogoFornecedoresScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const categorias = ['Todos', 'Orgânico', 'Agroecológico'];

  const fornecedoresFiltrados = FORNECEDORES.filter((f) => {
    const matchBusca =
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      f.endereco.toLowerCase().includes(busca.toLowerCase()) ||
      f.produtos.some((p) => p.toLowerCase().includes(busca.toLowerCase()));

    if (categoriaAtiva === 'Todos') return matchBusca;
    return matchBusca && f.categoria === categoriaAtiva;
  });

  const handleAbrirDetalhes = (fornecedor) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('SupplierDetail', { fornecedor });
    }
  };

  const renderSupplierItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleAbrirDetalhes(item)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${item.nome}`}
    >
      {/* Imagem / Logo Circular */}
      <View style={styles.avatarContainer}>
        <Image source={item.imagemAvatar} style={styles.avatarImage} />
      </View>

      {/* Informações Centrais */}
      <View style={styles.infoContainer}>
        <Text style={styles.supplierName}>{item.nome}</Text>
        <Text style={styles.supplierType}>{item.tipo}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaDistance}>{item.distancia}</Text>
          <View style={styles.metaRating}>
            <Ionicons name="star" size={13} color={COLORS.star} />
            <Text style={styles.ratingText}>{item.avaliacao}</Text>
          </View>
        </View>
      </View>

      {/* Seta Chevron Indicativa */}
      <Ionicons name="chevron-forward" size={18} color="#A0AFA6" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A */}
      <HeaderBar
        title="Fornecedores"
        showBack={navigation && navigation.canGoBack()}
        onBack={() => navigation.goBack()}
        rightIcon="search-outline"
      />

      <View style={styles.container}>
        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#7E8F85" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome ou especialidade..."
              placeholderTextColor="#90A197"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </View>

        {/* Filtros em Pílulas (Todos, Orgânico, Agroecológico) */}
        <View style={styles.filterRow}>
          {categorias.map((cat) => {
            const isActive = categoriaAtiva === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoriaAtiva(cat)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lista de Fornecedores */}
        <FlatList
          data={fornecedoresFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderSupplierItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={42} color="#A7B9B0" />
              <Text style={styles.emptyText}>Nenhum fornecedor encontrado.</Text>
            </View>
          }
        />
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
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#DFE8E3',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E3DC',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57675E',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3ECE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDF5F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DCE8E1',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
  },
  supplierName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  supplierType: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDistance: {
    fontSize: 11,
    color: '#718379',
    fontWeight: '600',
    marginRight: 12,
  },
  metaRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: '700',
    marginLeft: 3,
  },
  chevron: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#819389',
  },
});
