import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function EducacaoAmbientalScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Educação Ambiental</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="tree" size={32} color="#00875f" />
          <Text style={styles.cardTitle}>Preservação e Ciclos Naturais</Text>
          <Text style={styles.cardText}>
            Compostagem, uso racional da água, energia limpa e respeito aos ciclos do solo garantem a segurança alimentar das próximas gerações.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: {
    backgroundColor: '#00875f',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginTop: 12, marginBottom: 8, textAlign: 'center' },
  cardText: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22 },
});
