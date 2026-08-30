import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FoodStatus = 'ok' | 'urgent' | 'expired';

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

const STATUS_SUMMARY = {
  ok: 14,
  urgent: 5,
  expired: 2,
};

const STORAGE_SECTIONS: StorageSectionData[] = [
  {
    id: 'fridge',
    title: 'Geladeira',
    emoji: '🧊',
    chipLabel: '6 itens',
    cardColor: COLORS.fridgeCard,
    borderColor: COLORS.fridgeBorder,
    items: [
      { id: 'f-1', slot: 1, emoji: '🥛', name: 'Leite', status: 'urgent', expiryProgress: 0.24 },
      { id: 'f-2', slot: 2, emoji: '🍓', name: 'Morangos', status: 'expired', expiryProgress: 0.08 },
      { id: 'f-3', slot: 3, emoji: '🧀', name: 'Queijo', status: 'ok', expiryProgress: 0.82 },
      { id: 'f-4', slot: 4, emoji: '🥬', name: 'Alface', status: 'urgent', expiryProgress: 0.3 },
      { id: 'f-5', slot: 5, emoji: '🍗', name: 'Frango', status: 'ok', expiryProgress: 0.72 },
      { id: 'f-6', slot: 6, emoji: '🧈', name: 'Manteiga', status: 'ok', expiryProgress: 0.9 },
    ],
  },
  {
    id: 'pantry',
    title: 'Despensa',
    emoji: '🧺',
    chipLabel: '7 itens',
    cardColor: COLORS.pantryCard,
    borderColor: COLORS.pantryBorder,
    items: [
      { id: 'p-1', slot: 1, emoji: '🍝', name: 'Macarrao', status: 'ok', expiryProgress: 0.95 },
      { id: 'p-2', slot: 2, emoji: '🥫', name: 'Molho', status: 'urgent', expiryProgress: 0.4 },
      { id: 'p-3', slot: 3, emoji: '🌾', name: 'Arroz', status: 'ok', expiryProgress: 0.87 },
      { id: 'p-4', slot: 4, emoji: '🫘', name: 'Feijao', status: 'ok', expiryProgress: 0.8 },
      { id: 'p-5', slot: 5, emoji: '🫒', name: 'Azeitona', status: 'expired', expiryProgress: 0.18 },
      { id: 'p-6', slot: 6, emoji: '🍪', name: 'Biscoitos', status: 'ok', expiryProgress: 0.67 },
      { id: 'p-7', slot: 7, emoji: '🍯', name: 'Mel', status: 'ok', expiryProgress: 0.74 },
    ],
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <StatsSegmentedBar summary={STATUS_SUMMARY} />
        <StorageSectionList sections={STORAGE_SECTIONS} />
      </ScrollView>

      <BottomNavigation router={router} />
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

function BottomNavigation({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <View style={styles.navWrapper}>
      <View style={styles.navBackground}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/')}
        >
          <NavItem icon="home" label="Inicio" isActive />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/streak')}
        >
          <NavItem icon="flash" label="Ofensiva" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/add')}
        >
          <Pressable style={styles.fabButton}>
            <Ionicons name="add" size={30} color={COLORS.primaryFg} />
          </Pressable>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/pantry')}
        >
          <NavItem icon="restaurant" label="Alimentos" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/profile')}
        >
          <NavItem icon="person" label="Perfil" />
        </TouchableOpacity>
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
    <Pressable style={styles.navItem}>
      <Ionicons
        name={icon}
        size={19}
        color={isActive ? COLORS.foreground : COLORS.white40}
      />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </Pressable>
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
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 54,
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
  },
});
