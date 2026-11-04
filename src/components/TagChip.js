import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function TagChip({ label, icon = 'leaf', style, textStyle }) {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={COLORS.primary}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
