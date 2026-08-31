import { Link } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 🔴 COLOQUE SUA URL DO CODESPACES AQUI (Sem a barra / no final)
const API_BASE_URL = 'http://192.168.0.125:8000';

type FoodStatus = 'ok' | 'urgent' | 'expired';

type APIFoodItem = {
  id?: number;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  emoji: string;
};

type FoodItem = {
  id: string;
  slot: number;
  emoji: string;
  name: string;
  status: FoodStatus;
  expiryProgress: number;
};

type StorageSectionData = {
  id: string;
  title: string;
  emoji: string;
  chipLabel: string;
  cardColor: string;
  borderColor: string;
  items: FoodItem[];
};

const COLORS = {
  background: '#1C2833',
  card: '#243342',
  muted: '#253545',
  foreground: '#E8ECEF',
  mutedFg: '#7F9AAA',
  white80: 'rgba(255,255,255,0.80)',
  white40: 'rgba(255,255,255,0.40)',
  white20: 'rgba(255,255,255,0.20)',
  primary: '#3A7D5E',
  primaryFg: '#F7F9F9',
  accent: '#E8970D',
  ok: '#82E0AA',
  warning: '#E8C53A',
  urgent: '#E67E22',
  expired: '#E07A5F',
  border: 'rgba(232,236,239,0.08)',
  navBg: 'rgba(13,31,20,0.92)',
  fridgeCard: '#1e2f3d',
  fridgeBorder: '#4A90A4',
  pantryCard: '#28201a',
  pantryBorder: '#B07040',
} as const;

const LOCATION_CONFIG: Record<string, { title: string; emoji: string; cardColor: string; borderColor: string }> = {
  'Geladeira': { title: 'Geladeira', emoji: '🧊', cardColor: COLORS.fridgeCard, borderColor: COLORS.fridgeBorder },
  'Freezer': { title: 'Freezer', emoji: '❄️', cardColor: COLORS.fridgeCard, borderColor: COLORS.fridgeBorder },
  'Fruteira': { title: 'Fruteira', emoji: '🍑', cardColor: COLORS.pantryCard, borderColor: COLORS.pantryBorder },
  'Armário': { title: 'Armário', emoji: '🚪', cardColor: COLORS.pantryCard, borderColor: COLORS.pantryBorder },
  'Despensa': { title: 'Despensa', emoji: '🧺', cardColor: COLORS.pantryCard, borderColor: COLORS.pantryBorder },
};

// --- HELPER FUNCTIONS ---

const getDaysUntilExpiry = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateString);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatus = (days: number): FoodStatus => {
  if (days < 0) return 'expired';
  if (days <= 3) return 'urgent';
  return 'ok';
};

// --- MAIN COMPONENT ---

export default function HomeScreen() {
  const [apiItems, setApiItems] = useState<APIFoodItem[]>([]);
  const [statusSummary, setStatusSummary] = useState({ ok: 0, urgent: 0, expired: 0 });
  const [storageSections, setStorageSections] = useState<StorageSectionData[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      const data = await response.json();
      setApiItems(data);
      processItems(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  const processItems = (items: APIFoodItem[]) => {
    // 1. Calcular status para cada item
    const processedItems = items.map(item => ({
      ...item,
      days: getDaysUntilExpiry(item.expiryDate),
    }));

    // 2. Calcular STATUS_SUMMARY
    const summary = { ok: 0, urgent: 0, expired: 0 };
    processedItems.forEach(item => {
      const status = getStatus(item.days);
      summary[status]++;
    });
    setStatusSummary(summary);

    // 3. Agrupar por location e criar STORAGE_SECTIONS
    const groupedByLocation: Record<string, APIFoodItem[]> = {};
    processedItems.forEach(item => {
      if (!groupedByLocation[item.location]) {
        groupedByLocation[item.location] = [];
      }
      groupedByLocation[item.location].push(item);
    });

    // 4. Criar STORAGE_SECTIONS apenas para locations com itens
    const sections: StorageSectionData[] = Object.entries(groupedByLocation)
      .map(([location, locationItems]) => {
        const config = LOCATION_CONFIG[location] || { 
          title: location, 
          emoji: '📦', 
          cardColor: COLORS.card, 
          borderColor: COLORS.border 
        };

        return {
          id: location.toLowerCase().replace(/\s+/g, '-'),
          title: config.title,
          emoji: config.emoji,
          chipLabel: `${locationItems.length} item${locationItems.length !== 1 ? 'ns' : ''}`,
          cardColor: config.cardColor,
          borderColor: config.borderColor,
          items: locationItems.map((item, index) => ({
            id: `${item.id || index}`,
            slot: index + 1,
            emoji: item.emoji,
            name: item.name,
            status: getStatus(getDaysUntilExpiry(item.expiryDate)),
            expiryProgress: Math.max(0, Math.min(1, getDaysUntilExpiry(item.expiryDate) / 15)),
          })),
        };
      })
      .sort((a, b) => b.items.length - a.items.length); // Ordena por quantidade de itens

    setStorageSections(sections);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <StatsSegmentedBar summary={statusSummary} />
        <StorageSectionList sections={storageSections} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>Bom dia, Carol</Text>
        <Text style={styles.title}>Seu painel de alimentos</Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable style={styles.streakPill}>
          <MaterialCommunityIcons name="fire" size={14} color={COLORS.accent} />
          <Text style={styles.streakPillText}>11 dias</Text>
        </Pressable>
        <Pressable style={styles.searchButton}>
          <Ionicons name="search" size={18} color={COLORS.foreground} />
        </Pressable>
      </View>
    </View>
  );
}

function StatsSegmentedBar({ summary }: { summary: typeof STATUS_SUMMARY }) {
  const total = summary.ok + summary.urgent + summary.expired;

  return (
    <View style={styles.statsCard}>
      <View style={styles.segmentedBar}>
        <View style={[styles.segment, styles.okSegment, { flex: summary.ok }]} />
        <View style={[styles.segment, styles.urgentSegment, { flex: summary.urgent }]} />
        <View style={[styles.segment, styles.expiredSegment, { flex: summary.expired }]} />
      </View>

      <View style={styles.legendRow}>
        <LegendItem color={COLORS.ok} label="OK" value={summary.ok} total={total} />
        <LegendItem
          color={COLORS.urgent}
          label="Urgentes"
          value={summary.urgent}
          total={total}
        />
        <LegendItem
          color={COLORS.expired}
          label="Vencidos"
          value={summary.expired}
          total={total}
        />
      </View>
    </View>
  );
}

function LegendItem({
  color,
  label,
  value,
  total,
}: {
  color: string;
  label: string;
  value: number;
  total: number;
}) {
  const percentage = Math.round((value / total) * 100);

  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
      <Text style={styles.legendValue}>{percentage}%</Text>
    </View>
  );
}

function StorageSectionList({ sections }: { sections: StorageSectionData[] }) {
  return (
    <View style={styles.sectionList}>
      {sections.map((section) => (
        <StorageSection key={section.id} section={section} />
      ))}
    </View>
  );
}

function StorageSection({ section }: { section: StorageSectionData }) {
  return (
    <View
      style={[
        styles.storageSection,
        { backgroundColor: section.cardColor, borderColor: section.borderColor },
      ]}
    >
      <View style={styles.storageHeader}>
        <View style={styles.storageTitleWrap}>
          <Text style={styles.storageEmoji}>{section.emoji}</Text>
          <Text style={styles.storageTitle}>{section.title}</Text>
        </View>
        <View style={styles.storageChip}>
          <Text style={styles.storageChipText}>{section.chipLabel}</Text>
        </View>
      </View>

      <View style={styles.foodGrid}>
        {section.items.map((item) => (
          <FoodSlot key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

function FoodSlot({ item }: { item: FoodItem }) {
  return (
    <View style={styles.foodSlot}>
      <View style={styles.slotHeader}>
        <Text style={styles.slotSubLabel}>Slot {item.slot}</Text>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]} />
      </View>

      <View style={styles.slotContent}>
        <Text style={styles.slotEmoji}>{item.emoji}</Text>
        <Text numberOfLines={1} style={styles.slotName}>
          {item.name}
        </Text>
      </View>

      <View style={styles.expiryTrack}>
        <View
          style={[
            styles.expiryFill,
            {
              width: `${Math.round(item.expiryProgress * 100)}%`,
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        />
      </View>
    </View>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.navWrapper} pointerEvents="auto">
      <View style={styles.navBackground}>
        {/* HOME */}
        <Link href="/" asChild>
          <Pressable>
            <NavItem icon="home" label="Inicio" isActive />
          </Pressable>
        </Link>

        {/* OFENSIVA */}
        <Link href="/streak" asChild>
          <Pressable>
            <NavItem icon="flash" label="Ofensiva" />
          </Pressable>
        </Link>

        {/* BOTÃO + ADICIONAR */}
        <Link href="/add" asChild>
          <Pressable style={styles.fabButton}>
            <Ionicons name="add" size={30} color={COLORS.primaryFg} />
          </Pressable>
        </Link>

        {/* ALIMENTOS */}
        <Link href="/pantry" asChild>
          <Pressable>
            <NavItem icon="restaurant" label="Alimentos" />
          </Pressable>
        </Link>

        {/* PERFIL */}
        <Link href="/profile" asChild>
          <Pressable>
            <NavItem icon="person" label="Perfil" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  isActive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <Ionicons
        name={icon}
        size={19}
        color={isActive ? COLORS.foreground : COLORS.white40}
      />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </View>
  );
}

function getStatusColor(status: FoodStatus) {
  if (status === 'ok') return COLORS.ok;
  if (status === 'urgent') return COLORS.urgent;
  return COLORS.expired;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 128,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  greetingBlock: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    color: COLORS.white80,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  title: {
    color: COLORS.foreground,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    fontFamily: 'Nunito',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  streakPill: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPillText: {
    color: COLORS.foreground,
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'Nunito',
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  segmentedBar: {
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: COLORS.muted,
  },
  segment: {
    height: '100%',
  },
  okSegment: {
    backgroundColor: COLORS.ok,
  },
  urgentSegment: {
    backgroundColor: COLORS.urgent,
  },
  expiredSegment: {
    backgroundColor: COLORS.expired,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  legendText: {
    color: COLORS.white80,
    fontSize: 10,
    fontFamily: 'Nunito',
    fontWeight: '700',
  },
  legendValue: {
    color: COLORS.foreground,
    fontSize: 10,
    fontFamily: 'Nunito',
    fontWeight: '900',
  },
  sectionList: {
    gap: 14,
  },
  storageSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storageEmoji: {
    fontSize: 16,
  },
  storageTitle: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Nunito',
  },
  storageChip: {
    backgroundColor: COLORS.white20,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  storageChipText: {
    color: COLORS.foreground,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  foodSlot: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
    justifyContent: 'space-between',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotSubLabel: {
    color: COLORS.mutedFg,
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  statusTag: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  slotContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flex: 1,
  },
  slotEmoji: {
    fontSize: 22,
  },
  slotName: {
    color: COLORS.foreground,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  expiryTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.white20,
    overflow: 'hidden',
  },
  expiryFill: {
    height: '100%',
    borderRadius: 999,
  },
  navWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  navBackground: {
    width: '93%',
    minHeight: 72,
    borderRadius: 24,
    backgroundColor: COLORS.navBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1001,
    pointerEvents: 'auto',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 54,
    pointerEvents: 'auto',
  },
  navLabel: {
    color: COLORS.white40,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  navLabelActive: {
    color: COLORS.foreground,
  },
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: 'rgba(247,249,249,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowColor: '#000000',
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    pointerEvents: 'auto',
  },
});