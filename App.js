import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Contexto Global
import { FarmProvider } from './src/farmContext';

// Importação de Todas as Telas do Projeto
import LoginScreen from './src/login';
import PerfilScreen from './src/perfil';
import ProdutosSustentavelScreen from './src/produtoSustentavel';
import RastreabilidadeScreen from './src/rastreabilidade';
import CatalogoFornecedoresScreen from './src/catalogoFornecedores';
import PegadaCarbonoScreen from './src/pegadaCarbono';
import HortasScreen from './src/HortasScreen';
import ReceitasScreen from './src/ReceitasScreen';
import EducacaoAlimentarScreen from './src/EducacaoAlimentarScreen';
import EducacaoAmbientalScreen from './src/EducacaoAmbientalScreen';
import ScannerQRScreen from './src/ScannerQRScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <FarmProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#00875f" />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#f8f9fa' },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="ProdutosSustentavel" component={ProdutosSustentavelScreen} />
            <Stack.Screen name="Rastreabilidade" component={RastreabilidadeScreen} />
            <Stack.Screen name="CatalogoFornecedores" component={CatalogoFornecedoresScreen} />
            <Stack.Screen name="PegadaCarbono" component={PegadaCarbonoScreen} />
            <Stack.Screen name="Hortas" component={HortasScreen} />
            <Stack.Screen name="HortasScreen" component={HortasScreen} />
            <Stack.Screen name="Receitas" component={ReceitasScreen} />
            <Stack.Screen name="EducacaoAlimentar" component={EducacaoAlimentarScreen} />
            <Stack.Screen name="EducacaoAmbiental" component={EducacaoAmbientalScreen} />
            <Stack.Screen name="ScannerQR" component={ScannerQRScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FarmProvider>
    </SafeAreaProvider>
  );
}