import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StreakScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Streak</Text>
        <Text style={styles.subtitle}>Sua sequência de hábitos</Text>

        <View style={styles.card}>
          <Text style={styles.bigNumber}>14</Text>
          <Text style={styles.cardText}>dias consecutivos</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  bigNumber: {
    color: '#f59e0b',
    fontSize: 52,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
});
