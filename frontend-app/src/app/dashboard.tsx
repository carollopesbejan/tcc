import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- PALETA DE CORES ---
const colors = {
  background: "#1C2833",
  card: "#243342",
  muted: "#253545",
  secondary: "#2C3E50",
  foreground: "#E8ECEF",
  mutedFg: "#7F9AAA",
  white80: "rgba(255,255,255,0.80)",
  white40: "rgba(255,255,255,0.40)",
  white20: "rgba(255,255,255,0.20)",
  primary: "#3A7D5E",
  primaryFg: "#F7F9F9",
  accent: "#E8970D",
  ok: "#82E0AA",
  warning: "#E8C53A",
  urgent: "#E67E22",
  expired: "#E07A5F",
  border: "rgba(232,236,239,0.08)",
  navBg: "rgba(13,31,20,0.92)",
};

// --- DADOS MOCKADOS ---
const mockStats = { ok: 8, warning: 0, urgent: 2, expired: 1 };
const mockStorage = [
  {
    id: '1',
    name: 'Geladeira',
    bg: '#1e2f3d',
    border: '#4A90A4',
    icon: 'fridge-outline',
    items: [
      { id: 'i1', name: 'Leite', expiry: '2d', status: 'urgent', emoji: '🥛' },
      { id: 'i2', name: 'Ovos', expiry: '10d', status: 'ok', emoji: '🥚' },
    ]
  },
  {
    id: '2',
    name: 'Despensa',
    bg: '#28201a',
    border: '#B07040',
    icon: 'package-variant-closed',
    items: [
      { id: 'i3', name: 'Arroz', expiry: 'Vencido', status: 'expired', emoji: '🍚' },
    ]
  }
];

// --- SUBCOMPONENTES ---

const Header = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>Olá, Maria 👋</Text>
      <Text style={styles.title}>Minha Dispensa</Text>
    </View>
    <View style={styles.headerActions}>
      <View style={styles.streakPill}>
        <MaterialCommunityIcons name="fire" size={14} color={colors.accent} />
        <Text style={styles.streakText}>12</Text>
      </View>
      <TouchableOpacity style={styles.searchBtn}>
        <Ionicons name="search" size={18} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  </View>
);

const StatsSegmentedBar = () => {
  const total = mockStats.ok + mockStats.warning + mockStats.urgent + mockStats.expired;
  
  return (
    <View style={styles.statsContainer}>
      <View style={styles.segmentBarTrack}>
        {/* Proporções simuladas para o visual */}
        <View style={[styles.segment, { width: '60%', backgroundColor: colors.ok }]} />
        <View style={[styles.segment, { width: '20%', backgroundColor: colors.urgent }]} />
        <View style={[styles.segment, { width: '10%', backgroundColor: colors.expired }]} />
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.ok }]} />
          <Text style={styles.legendLabel}><Text style={[styles.legendCount, { color: colors.ok }]}>{mockStats.ok}</Text> OK</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.urgent }]} />
          <Text style={styles.legendLabel}><Text style={[styles.legendCount, { color: colors.urgent }]}>{mockStats.urgent}</Text> Urgentes</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.expired }]} />
          <Text style={styles.legendLabel}><Text style={[styles.legendCount, { color: colors.expired }]}>{mockStats.expired}</Text> Vencidos</Text>
        </View>
      </View>
    </View>
  );
};

const BottomNavigation = () => (
  <View style={styles.bottomNav}>
    <View style={styles.navInner}>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="home" size={24} color={colors.primary} />
        <Text style={[styles.navLabel, { color: colors.primary }]}>Início</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem}>
        <MaterialCommunityIcons name="fire" size={24} color={colors.mutedFg} />
        <Text style={styles.navLabel}>Ofensiva</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.specialBtn}>
        <Ionicons name="add" size={32} color={colors.primaryFg} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <View>
          <MaterialCommunityIcons name="food-apple" size={24} color={colors.mutedFg} />
          <View style={styles.badge}><Text style={styles.badgeText}>!</Text></View>
        </View>
        <Text style={styles.navLabel}>Alimentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="person" size={24} color={colors.mutedFg} />
        <Text style={styles.navLabel}>Perfil</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- COMPONENTE PRINCIPAL ---

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />
        <StatsSegmentedBar />

        {/* Lista de Seções de Armazenamento */}
        {mockStorage.map((section) => (
          <View key={section.id} style={[styles.storageCard, { backgroundColor: section.bg, borderColor: section.border }]}>
            <View style={[styles.sectionHeader, { borderBottomColor: section.border }]}>
              <MaterialCommunityIcons name={section.icon as any} size={20} color={colors.foreground} />
              <Text style={styles.sectionTitle}>{section.name}</Text>
              <View style={styles.chipsRow}>
                <Text style={styles.subLabel}>{section.items.length}/9 slots</Text>
              </View>
            </View>
            
            <View style={styles.foodGrid}>
              {section.items.map((item, index) => (
                <View key={item.id} style={[styles.slot, { borderColor: colors.border }]}>
                  <Text style={styles.slotNumber}>{index + 1}</Text>
                  <View style={styles.slotContent}>
                    <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                    <Text style={styles.slotName} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <View style={[styles.expiryTrack, { backgroundColor: colors.muted }]}>
                    <View style={[styles.segment, { width: '100%', backgroundColor: colors[item.status as keyof typeof colors] }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Espaço para a BottomNavigation
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  greeting: {
    fontFamily: "Nunito",
    fontSize: 12,
    fontWeight: "500",
    color: colors.mutedFg,
  },
  title: {
    fontFamily: "Nunito",
    fontSize: 24,
    fontWeight: "900",
    color: colors.foreground,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(232,151,13,0.10)",
    borderWidth: 1,
    borderColor: "rgba(232,151,13,0.20)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontFamily: "Nunito",
    fontSize: 12,
    fontWeight: "900",
    color: colors.accent,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    gap: 8,
    marginVertical: 8,
  },
  segmentBarTrack: {
    height: 16,
    width: "100%",
    flexDirection: "row",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },
  segment: {
    height: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: "Nunito",
    fontSize: 12,
    fontWeight: "500",
    color: colors.mutedFg,
  },
  legendCount: {
    fontWeight: "900",
    fontSize: 14,
  },
  storageCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontFamily: "Nunito",
    fontSize: 14,
    fontWeight: "900",
    color: colors.foreground,
    flex: 1,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subLabel: {
    fontFamily: "Nunito",
    fontSize: 10,
    fontWeight: "500",
    color: colors.white40,
  },
  foodGrid: {
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slot: {
    width: '30%', // Aproximadamente 3 colunas
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    flexDirection: "column",
    overflow: "hidden",
  },
  slotNumber: {
    fontFamily: "Nunito",
    fontSize: 10,
    fontWeight: "900",
    color: colors.white20,
    position: 'absolute',
    top: 6,
    left: 8,
  },
  slotContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  slotName: {
    fontFamily: "Nunito",
    fontSize: 10,
    fontWeight: "900",
    color: colors.white80,
    textAlign: "center",
    marginTop: 4,
  },
  expiryTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 4,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.navBg,
  },
  navInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24, 
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    fontFamily: "Nunito",
    fontSize: 10,
    fontWeight: "700",
    color: colors.mutedFg,
  },
  specialBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    marginTop: -20, // Elevação
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 12,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  }
});