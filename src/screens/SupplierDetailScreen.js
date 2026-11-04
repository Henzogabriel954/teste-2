import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import HeaderBar from '../components/HeaderBar';
import TagChip from '../components/TagChip';
import PrimaryButton from '../components/PrimaryButton';
import FORNECEDORES from '../services/fornecedoresData';

export default function SupplierDetailScreen({ route, navigation }) {
  const fornecedor = route?.params?.fornecedor || FORNECEDORES[0];

  const handleContato = (tipo, valor) => {
    if (tipo === 'tel') {
      Linking.openURL(`tel:${valor.replace(/[^0-9]/g, '')}`).catch(() => {
        Alert.alert('Contato', valor);
      });
    } else if (tipo === 'email') {
      Linking.openURL(`mailto:${valor}`).catch(() => {
        Alert.alert('Email', valor);
      });
    }
  };

  const handleVerProdutos = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('ProdutosSustentavel', { fornecedor });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Verde #0A6B3A */}
      <HeaderBar
        title="Perfil do Fornecedor"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner de Capa (Foto da Plantação) */}
        <View style={styles.bannerWrapper}>
          <Image source={fornecedor.imagemCapa} style={styles.bannerImage} />
          
          {/* Avatar Circular Sobreposto */}
          <View style={styles.avatarWrapper}>
            <Image source={fornecedor.imagemAvatar} style={styles.avatarImage} />
          </View>
        </View>

        {/* Informações Principais */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{fornecedor.nome}</Text>
          <TagChip label={fornecedor.tipo} style={styles.typeTag} />

          <Text style={styles.description}>
            {fornecedor.bio}
          </Text>

          {/* Lista de Contato e Metadados */}
          <View style={styles.contactCard}>
            {/* Endereço */}
            <View style={styles.contactRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-sharp" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.contactText}>{fornecedor.endereco}</Text>
            </View>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handleContato('email', fornecedor.email)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={[styles.contactText, styles.linkText]}>{fornecedor.email}</Text>
            </TouchableOpacity>

            {/* Telefone */}
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => handleContato('tel', fornecedor.telefone)}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="call-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={[styles.contactText, styles.linkText]}>{fornecedor.telefone}</Text>
            </TouchableOpacity>

            {/* Avaliação */}
            <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
              <View style={styles.iconCircle}>
                <Ionicons name="star" size={18} color={COLORS.star} />
              </View>
              <View style={styles.ratingInfoRow}>
                <Text style={styles.ratingLabel}>Avaliação</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={13} color={COLORS.star} style={{ marginRight: 3 }} />
                  <Text style={styles.ratingBadgeText}>
                    {fornecedor.avaliacao} ({fornecedor.numAvaliacoes})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Botão de Ação "Ver produtos" */}
          <PrimaryButton
            title="Ver produtos"
            onPress={handleVerProdutos}
            style={styles.actionButton}
          />
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
    paddingBottom: 24,
  },
  bannerWrapper: {
    width: '100%',
    height: 170,
    backgroundColor: '#C5DCCB',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 44,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -36,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  typeTag: {
    marginBottom: 14,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  contactCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    marginBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6F2',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  ratingInfoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingBadgeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '700',
  },
  actionButton: {
    width: '100%',
    height: 48,
  },
});
