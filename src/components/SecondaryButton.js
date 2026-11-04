import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import COLORS from '../theme/colors';

export default function SecondaryButton({
  title,
  onPress,
  icon,
  style,
  textStyle,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D2DFD8',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  text: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
