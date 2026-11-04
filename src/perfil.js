import React, { useContext } from 'react';
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
import { FarmContext } from './farmContext';
import COLORS from './theme/colors';
import HeaderBar from './components/HeaderBar';

export default function PerfilScreen({ navigation }) {
  const { producer, setProducer } = useContext(FarmContext) || {};

  const nomeExibicao = producer?.nome || 'Nome Alunila';
  const emailExibicao = producer?.email || 'namealunila@gmail.com';

  const menuItems = [
    {
      id: 'pedidos',
      titulo: 'Seus Pedidos',
      icon: 'receipt-outline',
      onPress: () => Alert.alert('Seus Pedidos', 'Você possui 12 pedidos concluídos com entrega de produtores locais.'),
    },
    {
      id: 'historico',
      titulo: 'Histórico',
      icon: 'time-outline',
      onPress: () => Alert.alert('Histórico', 'Histórico completo de compras e créditos de pegada de carbono.'),
    },
    {
      id: 'notificacoes',
      titulo: 'Notificações',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Notificações', 'Nenhuma nova notificação.'),
    },
  ];

  const handleQueroSerFornecedor = () => {
    Alert.alert(
      'Quero ser Fornecedor',
      'Cadastro de Novo Produtor:\n\nJunte-se à rede Horta 4.0! Você poderá certificar seus lotes com rastreabilidade via QR Code e conectar-se diretamente com consumidores conscientes.'
    );
  };

  const handleSair = () => {
    Alert.alert('Sair da Conta', 'Deseja realmente sair da sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          if (setProducer) setProducer(null);
          if (navigation && navigation.navigate) {
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A: Perfil */}
      <HeaderBar
        title="Perfil"
        rightIcon="log-out-outline"
        onRightPress={handleSair}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bloco Superior do Perfil com Avatar e Nome */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{nomeExibicao}</Text>
          <Text style={styles.userEmail}>{emailExibicao}</Text>

          {/* Linha de Estatísticas: 12 Pedidos | 4.8 Avaliação | 3 Fornecedores */}
          <View style={styles.statsRow}>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Fornecedores</Text>
            </View>
          </View>
        </View>

        {/* Menu de Ações (Seus Pedidos, Histórico, Notificações) */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuRow,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}
              accessibilityRole="button"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>{item.titulo}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9EB0A6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Quero ser Fornecedor */}
        <TouchableOpacity
          style={styles.supplierCtaCard}
          activeOpacity={0.85}
          onPress={handleQueroSerFornecedor}
          accessibilityRole="button"
        >
          <View style={styles.supplierCtaLeft}>
            <View style={styles.supplierIconCircle}>
              <MaterialCommunityIcons name="storefront-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.supplierCtaTextContainer}>
              <Text style={styles.supplierCtaTitle}>Quero ser Fornecedor</Text>
              <Text style={styles.supplierCtaSubtitle}>
                Seja um fornecedor - Junte-se à nossa rede
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
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
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E7F4EC',
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEF5F1',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2EBE5',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF4F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  supplierCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#D4E8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  supplierCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supplierIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supplierCtaTextContainer: {
    flex: 1,
  },
  supplierCtaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  supplierCtaSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
