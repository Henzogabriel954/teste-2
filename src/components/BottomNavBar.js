import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function BottomNavBar({
  activeTab = 'Inicio',
  navigation,
}) {
  const tabs = [
    {
      id: 'Inicio',
      label: 'Início',
      screen: 'HortasScreen',
      iconType: 'ionicons',
      iconName: 'home-outline',
      iconActive: 'home',
    },
    {
      id: 'Mapa',
      label: 'Mapa',
      screen: 'HortasScreen',
      iconType: 'ionicons',
      iconName: 'map-outline',
      iconActive: 'map',
    },
    {
      id: 'Fornecedores',
      label: 'Fornecedores',
      screen: 'CatalogoFornecedores',
      iconType: 'ionicons',
      iconName: 'people-outline',
      iconActive: 'people',
    },
    {
      id: 'QR',
      label: 'QR',
      screen: 'ScannerQR',
      iconType: 'material',
      iconName: 'qrcode-scan',
      iconActive: 'qrcode-scan',
    },
    {
      id: 'Perfil',
      label: 'Perfil',
      screen: 'Perfil',
      iconType: 'ionicons',
      iconName: 'person-outline',
      iconActive: 'person',
    },
  ];

  const handleTabPress = (tab) => {
    if (!navigation || !navigation.navigate) return;
    if (tab.id === activeTab && tab.screen === 'HortasScreen') return;
    navigation.navigate(tab.screen);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const color = isActive ? COLORS.primary : '#8D9B92';

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab)}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
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
                    name={isActive ? tab.iconActive : tab.iconName}
                    size={22}
                    color={color}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  isActive && styles.tabLabelActive,
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
    height: 60,
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
