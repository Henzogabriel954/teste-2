import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Contexto Global
import { FarmProvider } from './src/farmContext';
import COLORS from './src/theme/colors';

// Navegação Principal de Abas Fixas (Início, Mapa, Fornecedores, QR, Perfil)
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Tela de Entrada
import LoginScreen from './src/login';

// Telas de Detalhes e Fluxos Acessíveis a partir das Abas
import SupplierDetailScreen from './src/screens/SupplierDetailScreen';
import PegadaCarbonoScreen from './src/pegadaCarbono';
import EducacaoAmbientalScreen from './src/EducacaoAmbientalScreen';
import ProdutosSustentavelScreen from './src/produtoSustentavel';
import ReceitasScreen from './src/ReceitasScreen';
import EducacaoAlimentarScreen from './src/EducacaoAlimentarScreen';

// Telas individuais mantidas para navegação direta/legada
import HortasScreen from './src/HortasScreen';
import CatalogoFornecedoresScreen from './src/catalogoFornecedores';
import ScannerQRScreen from './src/ScannerQRScreen';
import PerfilScreen from './src/perfil';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <FarmProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={COLORS.primary} />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            {/* 1. Login (Autenticação) */}
            <Stack.Screen name="Login" component={LoginScreen} />

            {/* Hub Central de Abas Fixas (Início, Mapa, Fornecedores, QR, Perfil) */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />

            {/* Telas de Detalhe e Submódulos */}
            <Stack.Screen name="SupplierDetail" component={SupplierDetailScreen} />
            <Stack.Screen name="PegadaCarbono" component={PegadaCarbonoScreen} />
            <Stack.Screen name="EducacaoAmbiental" component={EducacaoAmbientalScreen} />
            <Stack.Screen name="ProdutosSustentavel" component={ProdutosSustentavelScreen} />
            <Stack.Screen name="Receitas" component={ReceitasScreen} />
            <Stack.Screen name="EducacaoAlimentar" component={EducacaoAlimentarScreen} />

            {/* Rotas de compatibilidade direta caso algum componente chame nominalmente */}
            <Stack.Screen name="HortasScreen" component={MainTabNavigator} />
            <Stack.Screen name="Hortas" component={MainTabNavigator} />
            <Stack.Screen name="CatalogoFornecedores" component={CatalogoFornecedoresScreen} />
            <Stack.Screen name="ScannerQR" component={ScannerQRScreen} />
            <Stack.Screen name="Rastreabilidade" component={ScannerQRScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FarmProvider>
    </SafeAreaProvider>
  );
}
