import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { FarmContext } from './farmContext';

export default function PerfilScreen({ navigation }) {
  const { producer, carbonPoints } = useContext(FarmContext) || {};

  const nomeExibicao = producer?.nome || 'Produtor Rural';
  const emailExibicao = producer?.email || 'produtor@nestleaf.com';
  const tipoPerfil = producer?.tipoPerfil === 'instituicao' ? 'Instituição Parceira' : 'Consumidor / Produtor';

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
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cartão de Perfil Flutuante */}
        <View style={styles.profileCard}>
          <View style={styles.greenBackgroundBox} />
          
          {/* Avatar / Ícone de Perfil */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>
              {producer?.tipoPerfil === 'instituicao' ? '🏛️' : '👩‍🌾'}
            </Text>
          </View>

          {/* Informações do Usuário */}
          <Text style={styles.userName}>{nomeExibicao}</Text>
          <Text style={styles.userEmail}>{emailExibicao}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{tipoPerfil}</Text>
          </View>

          {/* Estatísticas (Pedidos, Avaliação, Pontos Carbono) */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{carbonPoints || 150}</Text>
              <Text style={styles.statLabel}>Pontos Eco</Text>
            </View>
          </View>
        </View>

        {/* Seção de Navegação Rápida entre Módulos */}
        <Text style={styles.sectionHeading}>Acessar Módulos do Sistema</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation && navigation.navigate('ProdutosSustentavel')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Caderno de Campo & Lotes</Text>
                <Text style={styles.menuSubtext}>Modelos sustentáveis e registro de lotes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation && navigation.navigate('ScannerQR')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="qrcode-scan" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Escanear QR Code (Câmera)</Text>
                <Text style={styles.menuSubtext}>Aponte a câmera para ler as etiquetas dos lotes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('CatalogoFornecedores')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="storefront-outline" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Catálogo de Fornecedores</Text>
                <Text style={styles.menuSubtext}>Hortas locais e produtores cadastrados</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('Rastreabilidade')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Rastreabilidade & Mapa</Text>
                <Text style={styles.menuSubtext}>Localização geográfica e lotes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('PegadaCarbono')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="leaf" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Calculadora de Carbono</Text>
                <Text style={styles.menuSubtext}>Monitore emissões de transporte e energia</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('Hortas')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="sprout" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Hortas Cadastradas</Text>
                <Text style={styles.menuSubtext}>Lista de unidades e hortas comunitárias</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('Receitas')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Receitas Sustentáveis</Text>
                <Text style={styles.menuSubtext}>Pratos ecológicos e aproveitamento integral</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('EducacaoAlimentar')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="food-apple-outline" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Educação Alimentar</Text>
                <Text style={styles.menuSubtext}>Alimentação saudável e consciente</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation && navigation.navigate('EducacaoAmbiental')}
          >
            <View style={styles.menuLeft}>
              <MaterialCommunityIcons name="tree-outline" size={22} color="#00875f" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Educação Ambiental</Text>
                <Text style={styles.menuSubtext}>Preservação e ciclos naturais</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => navigation && navigation.navigate('Login')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuText, { color: '#d32f2f' }]}>Sair / Trocar de Conta</Text>
                <Text style={styles.menuSubtext}>Voltar para tela de login</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Seção "Quero ser Fornecedor" */}
        <Text style={styles.sectionHeading}>Quero ser Fornecedor</Text>
        <View style={styles.supplierCard}>
          <Text style={styles.supplierDescription}>
            Cadastre sua propriedade e venda para o varejo, governo ou instituições.
          </Text>
          <TouchableOpacity 
            style={styles.supplierButton}
            onPress={() => navigation && navigation.navigate('CatalogoFornecedores')}
          >
            <Text style={styles.supplierButtonText}>VER CATÁLOGO & SOLICITAR CADASTRO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 20,
  },
  greenBackgroundBox: {
    width: '100%',
    height: 90,
    backgroundColor: '#00875f',
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -38,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  roleBadgeText: {
    color: '#00875f',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 14,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00875f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#f0f0f0',
  },
  menuGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  menuSubtext: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
  },
  supplierCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  supplierDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  supplierButton: {
    backgroundColor: '#0f2c59',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  supplierButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});