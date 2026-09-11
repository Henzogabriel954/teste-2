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
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { FarmContext } from './farmContext'; // Importando o contexto global

export default function LoginScreen({ navigation }) {
  // Consumindo o contexto do produtor/usuário
  const { setProducer } = useContext(FarmContext);

  // Estados de controle da interface
  const [perfil, setPerfil] = useState('consumidor'); // 'consumidor' ou 'instituicao'
  const [modo, setModo] = useState('entrar'); // 'entrar' ou 'cadastrar'
  const [secureText, setSecureText] = useState(true);

  // Estados dos inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleAcaoPrincipal = () => {
    // Validação básica do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }
    if (modo === 'cadastrar' && senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    // Salvando os dados no contexto global antes de navegar
    setProducer({
      nome: nome || (perfil === 'consumidor' ? 'Produtor Rural' : 'Instituição Parceira'),
      email: email || 'usuario@nestleaf.com',
      tipoPerfil: perfil,
    });

    // Ao entrar ou cadastrar com sucesso, navega para a tela de Perfil
    if (navigation && navigation.navigate) {
      navigation.navigate('Perfil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Cabeçalho Verde */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerBrand}>NEST_LEAF</Text>
            <Text style={styles.headerTitle}>HORTA 4.0</Text>
            <Text style={styles.headerSubtitle}>
              Sustentabilidade e rastreabilidade do campo à mesa
            </Text>
          </View>

          {/* Caixa Branca Principal */}
          <View style={styles.cardContainer}>
            
            {/* Seletor de Perfil */}
            <Text style={styles.sectionLabel}>Qual é o seu perfil?</Text>
            <View style={styles.profileRow}>
              <TouchableOpacity
                style={[
                  styles.profileBtn,
                  perfil === 'consumidor' && styles.profileBtnActive,
                ]}
                onPress={() => setPerfil('consumidor')}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={perfil === 'consumidor' ? '#fff' : '#00875f'}
                />
                <Text
                  style={[
                    styles.profileText,
                    perfil === 'consumidor' && styles.profileTextActive,
                  ]}
                >
                  Consumidor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.profileBtn,
                  perfil === 'instituicao' && styles.profileBtnActive,
                ]}
                onPress={() => setPerfil('instituicao')}
              >
                <MaterialCommunityIcons
                  name="bank-outline"
                  size={20}
                  color={perfil === 'instituicao' ? '#fff' : '#00875f'}
                />
                <Text
                  style={[
                    styles.profileTextInst,
                    perfil === 'instituicao' && styles.profileTextActive,
                  ]}
                >
                  Instituição (ONG, Escola, Prefeitura)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Alternância Entrar / Cadastrar */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, modo === 'entrar' && styles.tabBtnActive]}
                onPress={() => setModo('entrar')}
              >
                <Text
                  style={[styles.tabText, modo === 'entrar' && styles.tabTextActive]}
                >
                  Entrar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, modo === 'cadastrar' && styles.tabBtnActive]}
                onPress={() => setModo('cadastrar')}
              >
                <Text
                  style={[styles.tabText, modo === 'cadastrar' && styles.tabTextActive]}
                >
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campos de Formulário */}
            {modo === 'cadastrar' && (
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={20} color="#555" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#888"
                  value={nome}
                  onChangeText={setNome}
                  accessibilityLabel="Nome completo"
                />
              </View>
            )}

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email ou nome@gmail.com"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                accessibilityLabel="Email"
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={modo === 'cadastrar' ? 'Crie uma senha' : 'Password'}
                placeholderTextColor="#888"
                secureTextEntry={secureText}
                value={senha}
                onChangeText={setSenha}
                autoCapitalize="none"
                autoComplete="password"
                accessibilityLabel="Senha"
              />
              <TouchableOpacity
                onPress={() => setSecureText(!secureText)}
                accessibilityLabel={secureText ? 'Mostrar senha' : 'Ocultar senha'}
                accessibilityRole="button"
              >
                <Ionicons
                  name={secureText ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            {/* Botão de Ação Principal */}
            <TouchableOpacity style={styles.mainButton} onPress={handleAcaoPrincipal}>
              <Text style={styles.mainButtonText}>
                {modo === 'entrar' ? 'ENTRAR' : 'CRIAR CONTA'}
              </Text>
            </TouchableOpacity>

            {/* Divisor "ou" */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>ou</Text>
              <View style={styles.line} />
            </View>

            {/* Botão Login com Google */}
            <TouchableOpacity style={styles.googleButton} onPress={handleAcaoPrincipal}>
              <FontAwesome name="google" size={18} color="#ea4335" style={{ marginRight: 10 }} />
              <Text style={styles.googleButtonText}>Login com Google</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#00875f',
    paddingTop: 40,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingHorizontal: 20,
  },
  headerBrand: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#e2f0d9',
    fontSize: 13,
    textAlign: 'center',
  },
  cardContainer: {
    width: '90%',
    marginTop: -25,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionLabel: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  profileBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  profileBtnActive: {
    backgroundColor: '#00875f',
    borderColor: '#00875f',
  },
  profileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00875f',
    marginTop: 6,
  },
  profileTextInst: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00875f',
    marginTop: 6,
    textAlign: 'center',
  },
  profileTextActive: {
    color: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#00875f',
    fontWeight: 'bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#fafafa',
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  mainButton: {
    backgroundColor: '#0f2c59',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});