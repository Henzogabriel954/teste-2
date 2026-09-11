import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Animated,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { plantasDemonstracao } from './produtoSustentavel';

export default function ScannerQRScreen({ navigation }) {
  // Resolução dinâmica exata da tela do celular
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraKey, setCameraKey] = useState(1);
  const [cameraPronta, setCameraPronta] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrEncontrado, setQrEncontrado] = useState(false);
  const [resultadoLote, setResultadoLote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // Tamanho do quadrado do leitor proporcional à resolução do celular
  const scanSize = Math.min(
    Math.round(screenWidth * 0.70),
    Math.round(screenHeight * 0.38),
    280
  );

  // Animações: laser de escaneamento e pulso de trava
  const laserAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Remonta a câmera e reinicia estados ao ganhar foco
  useEffect(() => {
    if (isFocused) {
      setCameraKey((prev) => prev + 1);
      setScanned(false);
      setQrEncontrado(false);
      setResultadoLote(null);
      setModalVisible(false);
    }
  }, [isFocused]);

  // Solicita permissão da câmera caso ainda não tenha
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Animação contínua da linha laser verde varrendo o quadrado
  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: scanSize - 8,
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

  // Efeito de pulso quando o QR Code é detectado
  const dispararEfeitoQuadrado = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.08,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Processamento da leitura do QR Code
  const handleBarcodeScanned = (scanningResult) => {
    if (scanned) return;
    setScanned(true);

    const rawData = String(scanningResult?.data || '');

    // Cerca o QR com o quadrado verde e dispara vibração
    setQrEncontrado(true);
    dispararEfeitoQuadrado();

    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(120);
      } catch (e) {}
    }

    // Identifica se foi Alface Roxa ou Salsinha
    let plantaIdentificada = null;
    const dataUpper = rawData.toUpperCase();

    if (
      dataUpper.includes('ALF-ROXA') ||
      dataUpper.includes('ALFACE ROXA') ||
      dataUpper.includes('LOTE-ALF')
    ) {
      plantaIdentificada =
        plantasDemonstracao.find((p) => p.id === 'alface-roxa') || plantasDemonstracao[0];
    } else if (
      dataUpper.includes('SAL-2026') ||
      dataUpper.includes('SALSINHA') ||
      dataUpper.includes('LOTE-SAL')
    ) {
      plantaIdentificada =
        plantasDemonstracao.find((p) => p.id === 'salsinha') || plantasDemonstracao[1];
    } else {
      plantaIdentificada = {
        id: 'lote-generico',
        nome: 'Lote Horta 4.0 Identificado',
        variedade: 'Cultura Registrada no Sistema',
        icone: 'qrcode-scan',
        corIcone: '#00875f',
        corBadge: '#e8f5e9',
        textoBadge: '#1b5e20',
        lote: 'LOTE-VERIFICADO',
        local: 'Gleba Primavera, Estrada das Três Figueiras - Ibiporã / PR',
        produtor: 'Emerson Amorim (Hortifruti Primavera)',
        assistencia: 'Felipe Furlan (IDR-Paraná)',
        dataPlantio: 'Agosto/2026',
        tempoColheita: 'Pronto para consumo',
        aduboOrganico: 'Sim (Certificação Orgânica)',
        agrotoxicos: 'Não (Zero Químicos)',
        irrigacao: 'Manejo Sustentável',
        manejo: rawData || 'Lote rastreado pelo sistema Horta 4.0.',
      };
    }

    setResultadoLote(plantaIdentificada);

    // Aguarda meio segundo para o usuário ver o quadrado cercando o QR e abre o modal
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };

  const reiniciarLeitor = () => {
    setScanned(false);
    setQrEncontrado(false);
    setResultadoLote(null);
    setModalVisible(false);
  };

  const simularLeitura = (plantaId) => {
    const p = plantasDemonstracao.find((item) => item.id === plantaId) || plantasDemonstracao[0];
    handleBarcodeScanned({ data: p.lote });
  };

  // Se permissão da câmera ainda não foi concedida
  if (!permission?.granted && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#d32f2f" />
        <Text style={styles.permissionTitle}>Permissão da Câmera Necessária</Text>
        <Text style={styles.permissionText}>
          Para ler as etiquetas e QR Codes impressos das plantas, permita o acesso à câmera do celular.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir Acesso à Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backLinkButton}
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
        >
          <Text style={styles.backLinkText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { width: screenWidth, height: screenHeight }]}>
      {/* 1. FEED DA CÂMERA EM TELA CHEIA */}
      {Platform.OS !== 'web' && isFocused && permission?.granted ? (
        <CameraView
          key={`camera-feed-${cameraKey}`}
          style={[StyleSheet.absoluteFillObject, { width: screenWidth, height: screenHeight }]}
          facing="back"
          enableTorch={torchOn ? true : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onCameraReady={() => setCameraPronta(true)}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      ) : Platform.OS === 'web' ? (
        <View style={[styles.webCameraContainer, { width: screenWidth, height: screenHeight }]}>
          <MaterialCommunityIcons name="webcam" size={48} color="#00875f" />
          <Text style={styles.webCameraTitle}>Câmera Aberta no Navegador</Text>
          <Text style={styles.webCameraSub}>
            No navegador, use os botões abaixo para simular a leitura do QR Code impresso:
          </Text>
          <View style={styles.webSimRow}>
            <TouchableOpacity
              style={[styles.webSimBtn, { backgroundColor: '#8e24aa' }]}
              onPress={() => simularLeitura('alface-roxa')}
            >
              <Text style={styles.webSimBtnText}>🥬 Ler QR Alface Roxa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.webSimBtn, { backgroundColor: '#2e7d32' }]}
              onPress={() => simularLeitura('salsinha')}
            >
              <Text style={styles.webSimBtnText}>🌱 Ler QR Salsinha</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* 2. QUADRADO DO LEITOR EM CENTRO ABSOLUTO HORIZONTAL E VERTICAL */}
      {/* Utiliza alignItems e justifyContent center sobre a tela toda, garantindo centro 100% perfeito */}
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
          {/* 4 Cantoneiras verdes destacadas */}
          <View
            style={[
              styles.bracket,
              styles.bracketTopLeft,
              qrEncontrado && styles.bracketSuccess,
            ]}
          />
          <View
            style={[
              styles.bracket,
              styles.bracketTopRight,
              qrEncontrado && styles.bracketSuccess,
            ]}
          />
          <View
            style={[
              styles.bracket,
              styles.bracketBottomLeft,
              qrEncontrado && styles.bracketSuccess,
            ]}
          />
          <View
            style={[
              styles.bracket,
              styles.bracketBottomRight,
              qrEncontrado && styles.bracketSuccess,
            ]}
          />

          {/* Linha laser verde animada durante a busca */}
          {!qrEncontrado && (
            <Animated.View
              style={[
                styles.laserLine,
                {
                  transform: [{ translateY: laserAnim }],
                },
              ]}
            />
          )}

          {/* Ponto central de mira */}
          {!qrEncontrado && (
            <View style={styles.crosshairContainer}>
              <View style={styles.crosshairDot} />
            </View>
          )}

          {/* Trava visual quando o QR Code é cercado com sucesso */}
          {qrEncontrado && (
            <View style={styles.detectedSquareOverlay}>
              <Ionicons name="checkmark-circle" size={48} color="#00e676" />
              <Text style={styles.detectedSquareText}>QR Code Cercado!</Text>
              <Text style={styles.detectedSquareSubtext}>Abrindo ficha técnica...</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* 3. CAMADA DE CONTROLES: TOPO E BASE */}
      <SafeAreaView
        style={[styles.controlsOverlay, { width: screenWidth, height: screenHeight }]}
        pointerEvents="box-none"
      >
        {/* CABEÇALHO SUPERIOR */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() => navigation && navigation.goBack && navigation.goBack()}
            accessibilityLabel="Fechar leitor"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Leitor de QR Code</Text>
            <Text style={styles.headerSubtitle}>Horta 4.0 • Rastreabilidade</Text>
          </View>

          {Platform.OS !== 'web' ? (
            <TouchableOpacity
              style={[styles.headerCircleBtn, torchOn && styles.torchActiveBtn]}
              onPress={() => setTorchOn(!torchOn)}
              accessibilityLabel="Alternar lanterna"
              accessibilityRole="button"
            >
              <Ionicons
                name={torchOn ? 'flash' : 'flash-off'}
                size={20}
                color={torchOn ? '#ffd700' : '#fff'}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* ESPAÇO CENTRAL LIVRE (O quadrado central está posicionado abaixo dele) */}
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* BASE INFERIOR (Instruções e botões centralizados) */}
        <View style={styles.bottomBar} pointerEvents="box-none">
          <View style={[styles.promptBadge, qrEncontrado && styles.promptBadgeSuccess]}>
            <Ionicons
              name={qrEncontrado ? 'checkmark-circle-outline' : 'scan-outline'}
              size={18}
              color={qrEncontrado ? '#00e676' : '#fff'}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.scannerPrompt}>
              {qrEncontrado
                ? 'Lote reconhecido com sucesso!'
                : 'Centralize o QR Code no quadrado'}
            </Text>
          </View>

          <Text style={styles.plantHintText}>
            Etiquetas impressas: Alface Roxa ou Salsinha
          </Text>

          <View style={styles.quickTestRow}>
            <TouchableOpacity
              style={styles.quickTestChip}
              onPress={() => simularLeitura('alface-roxa')}
              activeOpacity={0.7}
              accessibilityLabel="Simular leitura de Alface Roxa"
              accessibilityRole="button"
            >
              <Text style={styles.quickTestChipEmoji}>🥬</Text>
              <Text style={styles.quickTestChipText}>Alface Roxa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTestChip}
              onPress={() => simularLeitura('salsinha')}
              activeOpacity={0.7}
              accessibilityLabel="Simular leitura de Salsinha"
              accessibilityRole="button"
            >
              <Text style={styles.quickTestChipEmoji}>🌱</Text>
              <Text style={styles.quickTestChipText}>Salsinha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ========================================================================= */}
      {/* 4. MODAL COM OS DADOS RASTREADOS DO LOTE (ABRE APÓS O QR SER CERCADO) */}
      {/* ========================================================================= */}
      {resultadoLote && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={reiniciarLeitor}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalDragHandle} />

              <View style={styles.modalProductHeader}>
                <View
                  style={[
                    styles.modalIconCircle,
                    { backgroundColor: resultadoLote.corBadge || '#e8f5e9' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={resultadoLote.icone || 'sprout'}
                    size={32}
                    color={resultadoLote.corIcone || '#00875f'}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={15}
                      color="#00875f"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.verifiedText}>Lote Autêntico • Horta 4.0</Text>
                  </View>
                  <Text style={styles.modalTitle}>{resultadoLote.nome}</Text>
                  <Text style={styles.modalSubtitle}>{resultadoLote.variedade}</Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="pricetag-outline"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Identificador do Lote:</Text>
                  <Text style={[styles.infoValue, { fontWeight: 'bold', color: '#111' }]}>
                    {resultadoLote.lote}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Data do Plantio:</Text>
                  <Text style={styles.infoValue}>{resultadoLote.dataPlantio}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Colheita Prevista:</Text>
                  <Text style={styles.infoValue}>{resultadoLote.tempoColheita}</Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="leaf"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Adubação:</Text>
                  <Text style={[styles.infoValue, { color: '#2e7d32', fontWeight: '600' }]}>
                    {resultadoLote.aduboOrganico}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Agrotóxicos:</Text>
                  <Text style={[styles.infoValue, { color: '#15803d', fontWeight: 'bold' }]}>
                    {resultadoLote.agrotoxicos}
                  </Text>
                </View>

                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                  <Feather
                    name="info"
                    size={16}
                    color="#00875f"
                    style={[styles.infoIcon, { marginTop: 2 }]}
                  />
                  <Text style={styles.infoLabel}>Manejo Técnico:</Text>
                  <Text style={[styles.infoValue, { flex: 1, lineHeight: 18 }]}>
                    {resultadoLote.manejo}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="certificate"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Assistência:</Text>
                  <Text style={styles.infoValue}>{resultadoLote.assistencia}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#00875f"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Origem:</Text>
                  <Text style={[styles.infoValue, { flex: 1 }]}>{resultadoLote.local}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    setModalVisible(false);
                    if (navigation && navigation.navigate) {
                      navigation.navigate('Rastreabilidade');
                    }
                  }}
                  accessibilityLabel="Ver localização desta horta no Mapa"
                  accessibilityRole="button"
                >
                  <Ionicons name="map" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.modalPrimaryBtnText}>Ver no Mapa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={reiniciarLeitor}
                  accessibilityLabel="Escanear outro QR Code"
                  accessibilityRole="button"
                >
                  <Ionicons name="scan-outline" size={16} color="#00875f" style={{ marginRight: 4 }} />
                  <Text style={styles.modalSecondaryBtnText}>Escanear Outro</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#00875f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backLinkButton: {
    marginTop: 16,
    padding: 8,
  },
  backLinkText: {
    color: '#666',
    fontSize: 14,
  },

  // Simulação Web
  webCameraContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  webCameraTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 12,
  },
  webCameraSub: {
    color: '#cbd5e1',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    maxWidth: 320,
  },
  webSimRow: {
    flexDirection: 'row',
    gap: 12,
  },
  webSimBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  webSimBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // QUADRADO CENTRALIZADO
  viewfinderBox: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.40)',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  viewfinderBoxSuccess: {
    borderColor: '#00e676',
    borderWidth: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.20)',
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 10,
  },
  bracket: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: '#00e676',
  },
  bracketSuccess: {
    borderColor: '#00e676',
    width: 46,
    height: 46,
  },
  bracketTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4.5,
    borderLeftWidth: 4.5,
    borderTopLeftRadius: 20,
  },
  bracketTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4.5,
    borderRightWidth: 4.5,
    borderTopRightRadius: 20,
  },
  bracketBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderBottomLeftRadius: 20,
  },
  bracketBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderBottomRightRadius: 20,
  },
  laserLine: {
    width: '100%',
    height: 3.5,
    backgroundColor: '#00e676',
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  crosshairContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  },
  detectedSquareOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  detectedSquareText: {
    color: '#00e676',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  detectedSquareSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 3,
  },

  // CAMADA DE CONTROLES
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchActiveBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.35)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#00e676',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },

  // BASE
  bottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    marginBottom: 8,
  },
  promptBadgeSuccess: {
    backgroundColor: 'rgba(0, 135, 95, 0.85)',
    borderColor: '#00e676',
  },
  scannerPrompt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  plantHintText: {
    color: 'rgba(255, 255, 255, 0.80)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
  },
  quickTestRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  quickTestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  quickTestChipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  quickTestChipText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },

  // MODAL SHEET
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },
  modalDragHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalProductHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  verifiedText: {
    color: '#00875f',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#666',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    width: 22,
    marginRight: 4,
  },
  infoLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#555',
    width: 130,
  },
  infoValue: {
    fontSize: 12.5,
    color: '#222',
    flex: 1,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00875f',
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalPrimaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalSecondaryBtnText: {
    color: '#00875f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
