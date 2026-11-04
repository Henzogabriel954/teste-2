import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Platform,
  Animated,
  useWindowDimensions,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from './theme/colors';
import PrimaryButton from './components/PrimaryButton';
import SecondaryButton from './components/SecondaryButton';
import { plantasDemonstracao } from './produtoSustentavel';

// Assets dos QR Codes da pasta qrcodes/
const QR_ASSETS = {
  alface: require('../qrcodes/qrcode_alface_roxa.png'),
  salsinha: require('../qrcodes/qrcode_salsinha.png'),
};

// Componente para WebRTC em navegadores
function WebCameraFeed() {
  const videoRef = useRef(null);
  useEffect(() => {
    let stream = null;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch(() => {});
            };
          }
        })
        .catch((err) => console.warn('Webcam error:', err));
    }
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}

export default function ScannerQRScreen({ navigation }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraKey, setCameraKey] = useState(1);
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrEncontrado, setQrEncontrado] = useState(false);
  const [resultadoLote, setResultadoLote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderDrawerVisible, setFolderDrawerVisible] = useState(false);

  // Tamanho do quadrado do leitor
  const scanSize = Math.min(Math.round(screenWidth * 0.72), 270);
  const laserAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Reinicia estados ao focar a tela
  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setQrEncontrado(false);
      setResultadoLote(null);
      setModalVisible(false);
    }
  }, [isFocused]);

  // Solicita permissão se ainda não concedida no dispositivo físico
  useEffect(() => {
    if (Platform.OS !== 'web' && (!permission || !permission.granted)) {
      requestPermission();
    }
  }, []);

  // Animação contínua da linha de laser verde
  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: scanSize - 16,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [scanSize]);

  // Efeito de pulso ao detectar o QR Code
  const dispararEfeitoQuadrado = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.08,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Processamento do código escaneado
  const handleBarcodeScanned = (scanningResult) => {
    if (scanned) return;
    setScanned(true);
    setQrEncontrado(true);
    dispararEfeitoQuadrado();

    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(100);
      } catch (e) {}
    }

    const rawData = String(scanningResult?.data || scanningResult || '').toUpperCase();

    let identificada = null;
    if (
      rawData.includes('ALF-ROXA') ||
      rawData.includes('ALFACE') ||
      rawData.includes('ALFACE ROXA')
    ) {
      identificada = plantasDemonstracao.find((p) => p.id === 'alface-roxa') || plantasDemonstracao[0];
    } else if (
      rawData.includes('SAL-2026') ||
      rawData.includes('SALSINHA') ||
      rawData.includes('LOTE-SAL')
    ) {
      identificada = plantasDemonstracao.find((p) => p.id === 'salsinha') || plantasDemonstracao[1];
    } else {
      identificada = {
        id: 'lote-verificado',
        nome: 'Hortaliça Agroecológica Verificada',
        variedade: 'Cultivo Registrado no Horta 4.0',
        lote: rawData || 'LOTE-VERIFICADO-2026',
        produtor: 'Emerson Amorim (Hortifruti Primavera)',
        local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
        assistencia: 'Felipe Furlan (IDR-Paraná)',
        dataPlantio: 'Agosto/2026',
        tempoColheita: 'Pronto para colheita',
        aduboOrganico: 'Sim (Compostagem e biofertilizante)',
        agrotoxicos: 'Não (100% Livre - Manejo Orgânico)',
        irrigacao: 'Gotejamento automatizado',
        manejo: 'Manejo agroecológico certificado, solo preservado e zero defensivos químicos.',
      };
    }

    setResultadoLote(identificada);
    setFolderDrawerVisible(false);

    setTimeout(() => {
      setModalVisible(true);
    }, 450);
  };

  const handleSelecionarQRPasta = (plantaId) => {
    const planta = plantasDemonstracao.find((p) => p.id === plantaId) || plantasDemonstracao[0];
    handleBarcodeScanned(planta.lote);
  };

  const handleResetLeitor = () => {
    setScanned(false);
    setQrEncontrado(false);
    setResultadoLote(null);
    setModalVisible(false);
    setCameraKey((k) => k + 1);
  };

  // Se estiver carregando permissão no nativo
  if (Platform.OS !== 'web' && !permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Iniciando câmera...</Text>
      </View>
    );
  }

  // Se a permissão não foi concedida no dispositivo nativo
  if (Platform.OS !== 'web' && !permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionIconCircle}>
          <Ionicons name="camera" size={54} color={COLORS.primary} />
        </View>
        <Text style={styles.permissionTitle}>Permissão da Câmera</Text>
        <Text style={styles.permissionSub}>
          O Horta 4.0 precisa de acesso à câmera para ler os QR Codes nas etiquetas dos alimentos e verificar a procedência agroecológica.
        </Text>

        <PrimaryButton
          title="Permitir Acesso à Câmera"
          onPress={requestPermission}
          style={{ width: '100%', marginTop: 20 }}
        />

        <SecondaryButton
          title="Ler QR Code da Pasta (qrcodes/)"
          onPress={() => setFolderDrawerVisible(true)}
          style={{ width: '100%', marginTop: 12 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { width: screenWidth, height: screenHeight }]}>
      {/* 1. CAMADA DE FUNDO: A CÂMERA NATIVA DIRETA EM TELA CHEIA (SEM INTERMEDIÁRIOS) */}
      {Platform.OS !== 'web' && isFocused && permission?.granted ? (
        <CameraView
          key={`camera-direct-${cameraKey}`}
          style={[StyleSheet.absoluteFillObject, { width: screenWidth, height: screenHeight }]}
          facing="back"
          enableTorch={torchOn ? true : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      ) : Platform.OS === 'web' ? (
        <WebCameraFeed />
      ) : null}

      {/* 2. CAMADA DA MIRA: TOTALMENTE TRANSPARENTE E CENTRALIZADA */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.viewfinderBox,
            {
              width: scanSize,
              height: scanSize,
              transform: [{ scale: pulseAnim }],
            },
            qrEncontrado && styles.viewfinderBoxSuccess,
          ]}
        >
          {/* 4 Cantos Verdes Luminosos */}
          <View style={[styles.bracket, styles.bracketTopLeft, qrEncontrado && styles.bracketSuccess]} />
          <View style={[styles.bracket, styles.bracketTopRight, qrEncontrado && styles.bracketSuccess]} />
          <View style={[styles.bracket, styles.bracketBottomLeft, qrEncontrado && styles.bracketSuccess]} />
          <View style={[styles.bracket, styles.bracketBottomRight, qrEncontrado && styles.bracketSuccess]} />

          {/* Linha Laser Animada */}
          {!qrEncontrado && (
            <Animated.View
              style={[
                styles.laserLine,
                {
                  transform: [{ translateY: laserAnim }],
                  width: scanSize - 20,
                },
              ]}
            />
          )}

          {/* Ponto sutil central de mira */}
          {!qrEncontrado && <View style={styles.crosshairDot} />}

          {/* Trava visual de sucesso */}
          {qrEncontrado && (
            <View style={styles.detectedSquareOverlay}>
              <Ionicons name="checkmark-circle" size={48} color="#00E676" />
              <Text style={styles.detectedSquareText}>QR Code Identificado!</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* 3. CAMADA DE CONTROLES: CABEÇALHO E BASE */}
      <SafeAreaView
        style={[styles.controlsOverlay, { width: screenWidth, height: screenHeight }]}
        pointerEvents="box-none"
        edges={['top', 'left', 'right', 'bottom']}
      >
        {/* Cabeçalho Flutuante com Botão Voltar e Lanterna */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() => navigation && navigation.goBack && navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Rastreabilidade</Text>
            <Text style={styles.headerSubtitle}>Horta 4.0 • Mira Ativa</Text>
          </View>

          <TouchableOpacity
            style={[styles.headerCircleBtn, torchOn && styles.torchActiveBtn]}
            onPress={() => setTorchOn(!torchOn)}
            accessibilityRole="button"
            accessibilityLabel="Alternar lanterna"
          >
            <Ionicons
              name={torchOn ? 'flash' : 'flash-off'}
              size={20}
              color={torchOn ? '#FFD700' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Espaço flexível para deixar a mira desobstruída */}
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* Rodapé Flutuante com Instruções e Botão da Pasta */}
        <View style={styles.bottomControlsContainer}>
          <View style={styles.instructionBadge}>
            <Text style={styles.instructionText}>
              Aponte a câmera para o QR Code do produto
            </Text>
          </View>

          <TouchableOpacity
            style={styles.folderBtn}
            activeOpacity={0.85}
            onPress={() => setFolderDrawerVisible(true)}
            accessibilityRole="button"
          >
            <Ionicons name="folder-open-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.folderBtnText}>Ler QR Code da Pasta (qrcodes/)</Text>
          </TouchableOpacity>

          {scanned && (
            <SecondaryButton
              title="Escanear Outro QR Code"
              onPress={handleResetLeitor}
              style={styles.resetBtn}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Modal / Gaveta: Escolher QR Code da Pasta qrcodes/ */}
      <Modal
        visible={folderDrawerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFolderDrawerVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerCard}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>QR Codes da Pasta qrcodes/</Text>
                <Text style={styles.drawerSubtitle}>
                  Selecione um QR Code gerado para testar ou imprimir:
                </Text>
              </View>
              <TouchableOpacity onPress={() => setFolderDrawerVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.drawerList}>
              <TouchableOpacity
                style={styles.qrCardItem}
                activeOpacity={0.85}
                onPress={() => handleSelecionarQRPasta('alface-roxa')}
              >
                <Image source={QR_ASSETS.alface} style={styles.qrThumbnail} />
                <View style={styles.qrCardInfo}>
                  <Text style={styles.qrCardTitle}>🥬 Alface Roxa Orgânica</Text>
                  <Text style={styles.qrCardBatch}>Lote: LOTE-ALF-ROXA-2026</Text>
                  <Text style={styles.qrCardOrigin}>Hortifruti Primavera • Ibiporã/PR</Text>
                  <View style={styles.qrActionBadge}>
                    <Text style={styles.qrActionBadgeText}>Escanear este Lote →</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.qrCardItem}
                activeOpacity={0.85}
                onPress={() => handleSelecionarQRPasta('salsinha')}
              >
                <Image source={QR_ASSETS.salsinha} style={styles.qrThumbnail} />
                <View style={styles.qrCardInfo}>
                  <Text style={styles.qrCardTitle}>🌱 Salsinha Especial</Text>
                  <Text style={styles.qrCardBatch}>Lote: LOTE-SAL-2026-08</Text>
                  <Text style={styles.qrCardOrigin}>Hortifruti Primavera • Ibiporã/PR</Text>
                  <View style={styles.qrActionBadge}>
                    <Text style={styles.qrActionBadgeText}>Escanear este Lote →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes da Rastreabilidade Encontrada */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleResetLeitor}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalSuccessIcon}>
                <Ionicons name="checkmark-circle" size={32} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Lote Rastreado com Sucesso!</Text>
                <Text style={styles.modalSubTitle}>Certificação Horta 4.0</Text>
              </View>
              <TouchableOpacity onPress={handleResetLeitor} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {resultadoLote && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.productName}>{resultadoLote.nome}</Text>
                <Text style={styles.productVariety}>{resultadoLote.variedade}</Text>

                <View style={styles.organicSealRow}>
                  <View style={styles.organicSealBadge}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
                    <Text style={styles.organicSealText}>100% Livre de Agrotóxicos</Text>
                  </View>
                  <View style={styles.batchPill}>
                    <Text style={styles.batchPillText}>{resultadoLote.lote}</Text>
                  </View>
                </View>

                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={18} color={COLORS.primary} style={styles.detailIcon} />
                    <View style={styles.detailTextCol}>
                      <Text style={styles.detailLabel}>Produtor Responsável</Text>
                      <Text style={styles.detailValue}>{resultadoLote.produtor}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={18} color={COLORS.primary} style={styles.detailIcon} />
                    <View style={styles.detailTextCol}>
                      <Text style={styles.detailLabel}>Origem da Propriedade</Text>
                      <Text style={styles.detailValue}>{resultadoLote.local}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="school-outline" size={18} color={COLORS.primary} style={styles.detailIcon} />
                    <View style={styles.detailTextCol}>
                      <Text style={styles.detailLabel}>Assistência Técnica</Text>
                      <Text style={styles.detailValue}>{resultadoLote.assistencia}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.primary} style={styles.detailIcon} />
                    <View style={styles.detailTextCol}>
                      <Text style={styles.detailLabel}>Ciclo de Cultivo</Text>
                      <Text style={styles.detailValue}>
                        Plantio: {resultadoLote.dataPlantio} • Colheita: {resultadoLote.tempoColheita}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Ionicons name="leaf-outline" size={18} color={COLORS.primary} style={styles.detailIcon} />
                    <View style={styles.detailTextCol}>
                      <Text style={styles.detailLabel}>Manejo e Adubação</Text>
                      <Text style={styles.detailValue}>
                        {resultadoLote.aduboOrganico || resultadoLote.manejo}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.carbonBadge}>
                  <MaterialCommunityIcons name="molecule-co2" size={24} color={COLORS.primary} />
                  <Text style={styles.carbonText}>
                    Pegada de carbono compensada: 0,12 kg CO₂e por maço
                  </Text>
                </View>

                <PrimaryButton
                  title="Escanear Outro Produto"
                  onPress={handleResetLeitor}
                  style={{ marginTop: 18 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },

  // Camada da Mira Flutuante (100% transparente para passar o vídeo da câmera)
  viewfinderBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
  },
  viewfinderBoxSuccess: {
    borderColor: '#00E676',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  bracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#39E07B',
  },
  bracketSuccess: {
    borderColor: '#00E676',
    borderWidth: 5,
  },
  bracketTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4.5,
    borderLeftWidth: 4.5,
    borderTopLeftRadius: 18,
  },
  bracketTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4.5,
    borderRightWidth: 4.5,
    borderTopRightRadius: 18,
  },
  bracketBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderBottomLeftRadius: 18,
  },
  bracketBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderBottomRightRadius: 18,
  },
  laserLine: {
    position: 'absolute',
    top: 8,
    height: 3,
    backgroundColor: '#39E07B',
    borderRadius: 2,
    shadowColor: '#39E07B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  crosshairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  detectedSquareOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedSquareText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Camada de Controles Sobreposta
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 6,
  },
  headerCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  torchActiveBtn: {
    backgroundColor: '#0A6B3A',
    borderColor: '#FFD700',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: '#B8D5C4',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  bottomControlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 18,
    alignItems: 'center',
  },
  instructionBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  folderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  folderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resetBtn: {
    marginTop: 10,
    width: '100%',
  },

  // Gaveta de QR Codes da pasta
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  drawerCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '75%',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF4F0',
    paddingBottom: 12,
  },
  drawerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  drawerList: {
    paddingBottom: 10,
  },
  qrCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: '#DFE8E3',
  },
  qrThumbnail: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4E0D8',
    marginRight: 14,
  },
  qrCardInfo: {
    flex: 1,
  },
  qrCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  qrCardBatch: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  qrCardOrigin: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  qrActionBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4EC',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  qrActionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closeBtn: {
    padding: 6,
  },

  // Modal de Detalhes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF5F1',
    paddingBottom: 12,
  },
  modalSuccessIcon: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modalSubTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalScroll: {
    marginTop: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  productVariety: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  organicSealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  organicSealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  organicSealText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 5,
  },
  batchPill: {
    backgroundColor: '#F1F5F3',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  batchPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5C52',
  },
  detailsCard: {
    backgroundColor: '#F9FBFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DFECE4',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF4F0',
  },
  detailIcon: {
    marginRight: 10,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '700',
    marginTop: 1,
  },
  carbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7F2',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  carbonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
    flex: 1,
  },
});
