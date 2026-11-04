import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import HortasScreen from '../HortasScreen';
import CatalogoFornecedoresScreen from '../catalogoFornecedores';
import ScannerQRScreen from '../ScannerQRScreen';
import PerfilScreen from '../perfil';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const tabs = [
    {
      id: 'Inicio',
      label: 'Início',
      iconType: 'ionicons',
      iconName: 'home-outline',
      iconActive: 'home',
    },
    {
      id: 'Mapa',
      label: 'Mapa',
      iconType: 'ionicons',
      iconName: 'map-outline',
      iconActive: 'map',
    },
    {
      id: 'Fornecedores',
      label: 'Fornecedores',
      iconType: 'ionicons',
      iconName: 'people-outline',
      iconActive: 'people',
    },
    {
      id: 'QR',
      label: 'QR',
      iconType: 'material',
      iconName: 'qrcode-scan',
      iconActive: 'qrcode-scan',
    },
    {
      id: 'Perfil',
      label: 'Perfil',
      iconType: 'ionicons',
      iconName: 'person-outline',
      iconActive: 'person',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const color = isFocused ? COLORS.primary : '#8D9B92';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.id);
            }
          };

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tab.label}
            >
              <View style={styles.iconContainer}>
                {tab.iconType === 'material' ? (
                  <MaterialCommunityIcons
                    name={tab.iconName}
                    size={23}
                    color={color}
                  />
                ) : (
                  <Ionicons
                    name={isFocused ? tab.iconActive : tab.iconName}
                    size={22}
                    color={color}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  isFocused && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Inicio"
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={HortasScreen} />
      <Tab.Screen name="Fornecedores" component={CatalogoFornecedoresScreen} />
      <Tab.Screen name="QR" component={ScannerQRScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6EEE9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  container: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
