import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function HeaderBar({
  title = 'Horta 4.0',
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandIconContainer}>
              <Ionicons name="leaf" size={20} color="#FFFFFF" />
            </View>
          )}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            accessibilityRole="button"
          >
            <Ionicons name={rightIcon} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
