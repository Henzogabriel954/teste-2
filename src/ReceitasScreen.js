import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const receitas = [
  { id: '1', titulo: 'Salada Agroecológica com PANC', tempo: '15 min', nivel: 'Fácil' },
  { id: '2', titulo: 'Molho Pesto de Folhas de Cenoura', tempo: '10 min', nivel: 'Muito Fácil' },
  { id: '3', titulo: 'Sopa de Legumes da Horta', tempo: '30 min', nivel: 'Médio' },
];

export default function ReceitasScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Receitas Sustentáveis</Text>
      </View>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Text style={styles.subtitle}>Aproveitamento integral e receitas do campo à mesa</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card} accessibilityLabel={`Receita ${item.titulo}`}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#0A6B3A" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDetail}>⏱ {item.tempo} • {item.nivel}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: {
    backgroundColor: '#0A6B3A',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardInfo: { marginLeft: 14, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cardDetail: { fontSize: 13, color: '#777', marginTop: 4 },
});
