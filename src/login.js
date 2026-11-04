import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FarmContext } from './farmContext';
import COLORS from './theme/colors';
import HortaLogo from './components/HortaLogo';
import PrimaryButton from './components/PrimaryButton';
import SecondaryButton from './components/SecondaryButton';

export default function LoginScreen({ navigation }) {
  const { setProducer } = useContext(FarmContext) || {};

  const [modo, setModo] = useState('entrar'); // 'entrar' ou 'cadastrar'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEntrar = () => {
    if (email && !email.includes('@')) {
      Alert.alert('Email inválido', 'Por favor insira um endereço de e-mail válido.');
      return;
    }

    if (setProducer) {
      setProducer({
        nome: nome || 'Nome Alunila',
        email: email || 'namealunila@gmail.com',
        tipoPerfil: 'consumidor',
      });
    }

    // Navega para as abas principais (Início/Mapa/Fornecedores/QR/Perfil)
    if (navigation && navigation.navigate) {
      navigation.navigate('MainTabs');
    }
  };

  const handleEsqueceuSenha = () => {
    Alert.alert(
      'Redefinição de Senha',
      'Um link de recuperação será enviado para o seu e-mail cadastrado.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo e Cabeçalho */}
          <View style={styles.headerContainer}>
            <HortaLogo size={140} />
            <Text style={styles.brandTitle}>Horta 4.0</Text>
            <Text style={styles.brandSubtitle}>
              Rastreabilidade, pegada de carbono e consumo consciente.
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {modo === 'cadastrar' && (
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#9AA8A0"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email ou nome@gmail.com"
                placeholderTextColor="#9AA8A0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Input Senha */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Senha"
                placeholderTextColor="#9AA8A0"
                secureTextEntry={!showPassword}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                accessibilityRole="button"
                accessibilityLabel="Mostrar ou ocultar senha"
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Botão Entrar / Cadastrar */}
            <PrimaryButton
              title={modo === 'entrar' ? 'ENTRAR' : 'CADASTRAR'}
              onPress={handleEntrar}
              style={styles.mainButton}
            />

            {/* Divisor "Ou" */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão Criar uma conta / Já tenho conta */}
            <SecondaryButton
              title={modo === 'entrar' ? 'Criar uma conta' : 'Já tenho uma conta'}
              onPress={() => setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')}
              style={styles.secondaryButton}
            />

            {/* Esqueceu sua senha? */}
            <TouchableOpacity
              onPress={handleEsqueceuSenha}
              style={styles.forgotContainer}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 14,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#DFE8E3',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  mainButton: {
    marginTop: 6,
    height: 50,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEE7E2',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#8A9990',
    fontWeight: '600',
  },
  secondaryButton: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#C5D8CD',
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 6,
  },
  forgotText: {
    fontSize: 13,
    color: '#657B6F',
    fontWeight: '500',
  },
});
