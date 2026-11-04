import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function PrimaryButton({
  title,
  onPress,
  icon,
  arrow = false,
  style,
  textStyle,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {arrow && (
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
            style={styles.iconRight}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9FB8AB',
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
