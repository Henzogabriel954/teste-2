import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Lista completa das hortas cadastradas no projeto Horta 4.0
export const listaHortasCadastradas = [
  {
    id: 'emerson',
    nome: 'Hortifruti Primavera',
    responsavel: 'Emerson Amorim',
    tipo: 'Horta Familiar / Orgânica',
    local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
    contato: '43 99967-0744',
    area: '5.000 m²',
    assistencia: 'Felipe Furlan (IDR-Paraná)',
    produtos: ['Alface', 'Tomate', 'Pepino', 'Pimentão', 'Abobrinha'],
    imagemCapa: require('../assets/hortaEmerson/lotepedeAlface.jpeg'),
    fotosGaleria: [
      {
        id: '1',
        titulo: 'Visão Geral dos Canteiros',
        subtitulo: 'Panorama dos canteiros de cultivo',
        setor: 'Gleba Primavera • 5.000 m²',
        categoria: 'Panorâmica',
        imagem: require('../assets/hortaEmerson/folhasTotal.jpeg'),
        descricao: 'Visão panorâmica da propriedade de Emerson Amorim em Ibiporã/PR. Canteiros bem espaçados, solo com cobertura orgânica e rotação de culturas.',
      },
      {
        id: '2',
        titulo: 'Canteiro de Alface Crespa',
        subtitulo: 'Lote de folhosas em desenvolvimento',
        setor: 'Lote 01 • Folhosas',
        categoria: 'Folhosas',
        imagem: require('../assets/hortaEmerson/lotepedeAlface.jpeg'),
        descricao: 'Canteiro comercial de alface crespa com alta densidade e vigor vegetativo.',
      },
      {
        id: '3',
        titulo: 'Pé de Alface Selecionado',
        subtitulo: 'Ponto ideal de colheita e saúde foliar',
        setor: 'Lote 01 • Detalhe',
        categoria: 'Folhosas',
        imagem: require('../assets/hortaEmerson/pedeAlface.jpeg'),
        descricao: 'Detalhe de um pé de alface pronto para colheita, demonstrando formação foliar saudável.',
      },
      {
        id: '4',
        titulo: 'Canteiro de Pés de Tomateiro',
        subtitulo: 'Plantio tutorado em frutificação',
        setor: 'Lote 02 • Tomates',
        categoria: 'Frutos',
        imagem: require('../assets/hortaEmerson/pedeTomate.jpeg'),
        descricao: 'Tomateiros conduzidos em sistema tutorado para boa aeração e incidência de luz solar.',
      },
      {
        id: '5',
        titulo: 'Colheita de Tomates Frescos',
        subtitulo: 'Frutos selecionados de alta qualidade',
        setor: 'Lote 02 • Pós-Colheita',
        categoria: 'Frutos',
        imagem: require('../assets/hortaEmerson/tomate.jpeg'),
        descricao: 'Tomates recém-colhidos na horta do Emerson, selecionados para distribuição direta.',
      },
      {
        id: '6',
        titulo: 'Área de Plantio e Solo',
        subtitulo: 'Preparo orgânico do solo',
        setor: 'Área de Expansão',
        categoria: 'Panorâmica',
        imagem: require('../assets/hortaEmerson/locPlantio.jpeg'),
        descricao: 'Área de canteiros preparados para o plantio com cobertura vegetal morta para conservação da umidade.',
      },
    ],
  },
  {
    id: 'kawai',
    nome: 'Recanto Kawai',
    responsavel: 'Alcides Tadao Kuriki / Marlene Kobayasi',
    tipo: 'Horta Familiar / Morangos Agroecológicos',
    local: 'Rua Sibipiruna, Condomínio Itaúna - Ibiporã / PR',
    contato: '43 99941-2196',
    area: '3 Estufas de Cultivo',
    assistencia: 'Ana',
    produtos: ['Morango'],
    imagemCapa: require('../assets/hortaEmerson/morango.jpeg'),
    fotosGaleria: [
      {
        id: 'k1',
        titulo: 'Produção de Morangos',
        subtitulo: 'Cultivo protegido em estufa',
        setor: 'Condomínio Itaúna • 3 Estufas',
        categoria: 'Frutos',
        imagem: require('../assets/hortaEmerson/morango.jpeg'),
        descricao: 'Produção agroecológica de morangos de alto padrão conduzida por Tadao e Marlene em Ibiporã.',
      },
      {
        id: 'k2',
        titulo: 'Mudas de Morango na Estufa',
        subtitulo: 'Desenvolvimento das mudas em bancadas suspensas',
        setor: 'Estufa 01 • Mudas',
        categoria: 'Mudas',
        imagem: require('../assets/hortaEmerson/mudasMorango.jpeg'),
        descricao: 'Cultivo em substrato protegido e irrigação por gotejamento na horta do Recanto Kawai.',
      },
    ],
  },
];

export default function HortasScreen({ route, navigation }) {
  // Inicializa com a horta enviada por parâmetro ou a primeira (Emerson)
  const initialHorta = route?.params?.hortaData || listaHortasCadastradas[0];
  const [selectedHortaId, setSelectedHortaId] = useState(initialHorta.id);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  // Horta atualmente selecionada
  const hortaAtual =
    listaHortasCadastradas.find((h) => h.id === selectedHortaId) || listaHortasCadastradas[0];

  // Filtro da galeria de fotos
  const fotosGaleria = hortaAtual.fotosGaleria || [];
  const categorias = ['Todas', ...new Set(fotosGaleria.map((f) => f.categoria))];

  const fotosFiltradas =
    categoriaAtiva === 'Todas'
      ? fotosGaleria
      : fotosGaleria.filter((f) => f.categoria === categoriaAtiva);

  const abrirModalFoto = (foto) => setFotoSelecionada(foto);
  const fecharModalFoto = () => setFotoSelecionada(null);

  const navegarFotoModal = (direcao) => {
    if (!fotoSelecionada) return;
    const currentIndex = fotosGaleria.findIndex((f) => f.id === fotoSelecionada.id);
    let nextIndex = currentIndex + direcao;
    if (nextIndex < 0) nextIndex = fotosGaleria.length - 1;
    if (nextIndex >= fotosGaleria.length) nextIndex = 0;
    setFotoSelecionada(fotosGaleria[nextIndex]);
  };

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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Hortas Cadastradas</Text>
          <Text style={styles.headerSubtitle}>Unidades de cultivo • Ibiporã - PR</Text>
        </View>
        <TouchableOpacity
          style={styles.mapHeaderButton}
          onPress={() => navigation && navigation.navigate('Rastreabilidade', { fornecedor: hortaAtual })}
          accessibilityLabel="Ver no Mapa"
          accessibilityRole="button"
        >
          <Ionicons name="map-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seletor de Horta (Tabs no topo) */}
        <Text style={styles.sectionLabel}>Selecione a Unidade Cadastrada:</Text>
        <View style={styles.hortaSelectorRow}>
          {listaHortasCadastradas.map((horta) => {
            const isActive = horta.id === selectedHortaId;
            return (
              <TouchableOpacity
                key={horta.id}
                style={[styles.hortaTab, isActive && styles.hortaTabActive]}
                onPress={() => {
                  setSelectedHortaId(horta.id);
                  setCategoriaAtiva('Todas');
                }}
                accessibilityLabel={`Selecionar ${horta.nome}`}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="sprout"
                  size={18}
                  color={isActive ? '#fff' : '#00875f'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[styles.hortaTabText, isActive && styles.hortaTabTextActive]}
                  numberOfLines={1}
                >
                  {horta.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card de Informações Completas do Produtor */}
        <View style={styles.producerCard}>
          <View style={styles.producerHeader}>
            <Image source={hortaAtual.imagemCapa} style={styles.producerAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Unidade Ativa • Horta 4.0</Text>
              </View>
              <Text style={styles.producerName}>{hortaAtual.responsavel}</Text>
              <Text style={styles.farmTitle}>{hortaAtual.nome}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#00875f" style={styles.infoIcon} />
            <Text style={styles.infoText}>{hortaAtual.local}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="maximize-2" size={15} color="#00875f" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Área/Estrutura: <Text style={styles.boldText}>{hortaAtual.area}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="phone" size={15} color="#00875f" style={styles.infoIcon} />
            <Text style={styles.infoText}>Contato direto: {hortaAtual.contato}</Text>
          </View>

          {hortaAtual.assistencia && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={16}
                color="#00875f"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Assistência Técnica: {hortaAtual.assistencia}</Text>
            </View>
          )}

          {/* Tags de Culturas Produzidas */}
          <Text style={[styles.sectionLabel, { marginTop: 10, marginBottom: 6 }]}>
            Culturas Produzidas:
          </Text>
          <View style={styles.tagsContainer}>
            {hortaAtual.produtos?.map((prod, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{prod}</Text>
              </View>
            ))}
          </View>

          {/* Botão Ver no Mapa desta Horta */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation && navigation.navigate('Rastreabilidade', { fornecedor: hortaAtual })}
            accessibilityLabel="Ver localização desta horta no Mapa"
            accessibilityRole="button"
          >
            <Ionicons name="location" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.mapButtonText}>Ver no Mapa de Rastreabilidade</Text>
          </TouchableOpacity>
        </View>

        {/* Título da Seção de Registros Fotográficos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registros Fotográficos da Horta</Text>
          <Text style={styles.sectionSubtitle}>
            Fotos reais dos canteiros, mudas e colheitas • Toque para ampliar
          </Text>
        </View>

        {/* Filtros de Categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, categoriaAtiva === cat && styles.filterChipActive]}
              onPress={() => setCategoriaAtiva(cat)}
              accessibilityLabel={`Filtrar por ${cat}`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.filterChipText,
                  categoriaAtiva === cat && styles.filterChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Fotos dos Canteiros */}
        {fotosFiltradas.map((foto) => (
          <TouchableOpacity
            key={foto.id}
            style={styles.photoCard}
            activeOpacity={0.88}
            onPress={() => abrirModalFoto(foto)}
            accessibilityLabel={`Foto: ${foto.titulo}`}
            accessibilityRole="button"
          >
            <Image source={foto.imagem} style={styles.cardImage} resizeMode="cover" />

            <View style={styles.cardOverlay}>
              <View style={styles.cardCategoryBadge}>
                <Text style={styles.cardCategoryText}>{foto.categoria}</Text>
              </View>
              <View style={styles.zoomHint}>
                <Ionicons name="scan-outline" size={16} color="#fff" />
                <Text style={styles.zoomHintText}>Ampliar</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{foto.titulo}</Text>
              <Text style={styles.cardSector}>{foto.setor}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {foto.descricao}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal para Visualizar a Foto em Alta Resolução */}
      {fotoSelecionada && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!fotoSelecionada}
          onRequestClose={fecharModalFoto}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalCategoryBadge}>{fotoSelecionada.categoria}</Text>
                  <Text style={styles.modalCounter}>
                    {fotosGaleria.findIndex((f) => f.id === fotoSelecionada.id) + 1} de{' '}
                    {fotosGaleria.length}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={fecharModalFoto}
                  style={styles.modalCloseButton}
                  accessibilityLabel="Fechar foto"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalImageContainer}>
                <Image
                  source={fotoSelecionada.imagem}
                  style={styles.modalImage}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNavLeft]}
                  onPress={() => navegarFotoModal(-1)}
                  accessibilityLabel="Foto anterior"
                  accessibilityRole="button"
                >
                  <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNavRight]}
                  onPress={() => navegarFotoModal(1)}
                  accessibilityLabel="Próxima foto"
                  accessibilityRole="button"
                >
                  <Ionicons name="chevron-forward" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{fotoSelecionada.titulo}</Text>
                <Text style={styles.modalSector}>{fotoSelecionada.setor}</Text>
                <Text style={styles.modalDescription}>{fotoSelecionada.descricao}</Text>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: {
    backgroundColor: '#00875f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  backButton: { marginRight: 12, padding: 4 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#d1e7dd', fontSize: 12, marginTop: 2 },
  mapHeaderButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  content: { padding: 16, paddingBottom: 32 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  hortaSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  hortaTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
  hortaTabActive: {
    backgroundColor: '#00875f',
    borderColor: '#00875f',
  },
  hortaTabText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#333',
  },
  hortaTabTextActive: {
    color: '#fff',
  },
  producerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  producerHeader: { flexDirection: 'row', alignItems: 'center' },
  producerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#eee',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00875f', marginRight: 6 },
  statusText: { color: '#00875f', fontSize: 11, fontWeight: 'bold' },
  producerName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  farmTitle: { fontSize: 13, color: '#666' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoIcon: { width: 22, marginRight: 6 },
  infoText: { fontSize: 12.5, color: '#555', flex: 1 },
  boldText: { fontWeight: 'bold', color: '#222' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, gap: 6 },
  tagBadge: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagBadgeText: { color: '#15803d', fontSize: 11, fontWeight: '600' },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f2c59',
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a1a1a' },
  sectionSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  filterScroll: { paddingVertical: 8, marginBottom: 12, gap: 8 },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: '#00875f', borderColor: '#00875f' },
  filterChipText: { fontSize: 12.5, fontWeight: '600', color: '#555' },
  filterChipTextActive: { color: '#fff' },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: { width: '100%', height: 190, backgroundColor: '#e8e8e8' },
  cardOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCategoryText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  zoomHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 135, 95, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  zoomHintText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  cardSector: { fontSize: 12, fontWeight: '600', color: '#00875f', marginTop: 2, marginBottom: 6 },
  cardDescription: { fontSize: 12.5, color: '#555', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.94)', justifyContent: 'center' },
  modalContent: { flex: 1, justifyContent: 'space-between' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  modalHeaderInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalCategoryBadge: {
    backgroundColor: '#00875f',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalCounter: { color: '#ccc', fontSize: 13 },
  modalCloseButton: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)' },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  modalImage: { width: width - 24, height: '100%', maxHeight: 380 },
  modalNavButton: {
    position: 'absolute',
    top: '45%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNavLeft: { left: 12 },
  modalNavRight: { right: 12 },
  modalDetails: {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalSector: { color: '#4ade80', fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  modalDescription: { color: '#e0e0e0', fontSize: 13, lineHeight: 20 },
});