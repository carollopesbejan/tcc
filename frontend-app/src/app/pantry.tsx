import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#1C2833',
  card: '#243342',
  muted: '#253545',
  foreground: '#E8ECEF',
  mutedForeground: '#7F9AAA',
  primary: '#3A7D5E',
  primaryFg: '#F7F9F9',
  accent: '#E8970D',
  ok: '#82E0AA',
  warning: '#E8C53A',
  urgent: '#E67E22',
  expired: '#E07A5F',
  border: 'rgba(232, 236, 239, 0.08)',
};

type FilterType = 'all' | 'ok' | 'urgent' | 'expired';

type FoodItemData = {
  id: string;
  emoji: string;
  name: string;
  location: string;
  quantity: string;
  status: 'ok' | 'urgent' | 'expired';
  daysLeft: number | string;
};

const MOCK_FOODS: FoodItemData[] = [
  {
    id: '1',
    emoji: '🍎',
    name: 'Maçã Vermelha',
    location: 'Fruteira',
    quantity: '5 un',
    status: 'ok',
    daysLeft: 5,
  },
  {
    id: '2',
    emoji: '🥛',
    name: 'Leite Integral',
    location: 'Geladeira',
    quantity: '2 l',
    status: 'urgent',
    daysLeft: 'Hoje!',
  },
  {
    id: '3',
    emoji: '🍗',
    name: 'Frango Congelado',
    location: 'Freezer',
    quantity: '1.2 kg',
    status: 'ok',
    daysLeft: 45,
  },
  {
    id: '4',
    emoji: '🍞',
    name: 'Pão de Forma',
    location: 'Armário',
    quantity: '1 un',
    status: 'expired',
    daysLeft: 'Vencido',
  },
  {
    id: '5',
    emoji: '🥕',
    name: 'Cenoura',
    location: 'Geladeira',
    quantity: '500 g',
    status: 'ok',
    daysLeft: 8,
  },
  {
    id: '6',
    emoji: '☕',
    name: 'Café Coado',
    location: 'Armário',
    quantity: '250 g',
    status: 'ok',
    daysLeft: 30,
  },
  {
    id: '7',
    emoji: '🍌',
    name: 'Banana',
    location: 'Fruteira',
    quantity: '6 un',
    status: 'urgent',
    daysLeft: 'Hoje!',
  },
  {
    id: '8',
    emoji: '🥦',
    name: 'Brócolis',
    location: 'Geladeira',
    quantity: '200 g',
    status: 'ok',
    daysLeft: 3,
  },
  {
    id: '9',
    emoji: '🧀',
    name: 'Queijo Meia Cura',
    location: 'Geladeira',
    quantity: '300 g',
    status: 'ok',
    daysLeft: 12,
  },
  {
    id: '10',
    emoji: '🍒',
    name: 'Morango',
    location: 'Geladeira',
    quantity: '300 g',
    status: 'expired',
    daysLeft: 'Vencido',
  },
  {
    id: '11',
    emoji: '🥒',
    name: 'Pepino em Conserva',
    location: 'Despensa',
    quantity: '1 pct',
    status: 'ok',
    daysLeft: 60,
  },
  {
    id: '12',
    emoji: '🌾',
    name: 'Arroz Integral',
    location: 'Despensa',
    quantity: '2 kg',
    status: 'ok',
    daysLeft: 120,
  },
  {
    id: '13',
    emoji: '🍫',
    name: 'Chocolate 70%',
    location: 'Armário',
    quantity: '100 g',
    status: 'ok',
    daysLeft: 90,
  },
  {
    id: '14',
    emoji: '🥜',
    name: 'Amendoim',
    location: 'Despensa',
    quantity: '500 g',
    status: 'ok',
    daysLeft: 45,
  },
  {
    id: '15',
    emoji: '🧈',
    name: 'Manteiga',
    location: 'Geladeira',
    quantity: '200 g',
    status: 'urgent',
    daysLeft: 'Hoje!',
  },
  {
    id: '16',
    emoji: '🍚',
    name: 'Feijão Cozido',
    location: 'Freezer',
    quantity: '500 g',
    status: 'ok',
    daysLeft: 30,
  },
  {
    id: '17',
    emoji: '🥬',
    name: 'Alface Crespa',
    location: 'Geladeira',
    quantity: '1 un',
    status: 'urgent',
    daysLeft: 'Hoje!',
  },
];

export default function PantryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const filteredFoods = MOCK_FOODS.filter((food) => {
    if (selectedFilter === 'all') return true;
    return food.status === selectedFilter;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Alimentos</Text>
          <Text style={styles.screenSubtitle}>
            {MOCK_FOODS.length} itens na dispensa
          </Text>
        </View>
      </View>

      <FilterChipsRow
        filters={['all', 'ok', 'urgent', 'expired']}
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <FoodList foods={filteredFoods} />
    </SafeAreaView>
  );
}

interface FilterChipsRowProps {
  filters: FilterType[];
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

function FilterChipsRow({ filters, selected, onSelect }: FilterChipsRowProps) {
  const filterLabels: Record<FilterType, string> = {
    all: 'Todos',
    ok: 'OK',
    urgent: 'Urgentes',
    expired: 'Vencidos',
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterChipsScroll}>
      {filters.map((filter) => (
        <Pressable
          key={filter}
          style={[
            styles.filterChip,
            selected === filter && styles.filterChipSelected,
          ]}
          onPress={() => onSelect(filter)}>
          <Text
            style={[
              styles.filterChipText,
              selected === filter && styles.filterChipTextSelected,
            ]}>
            {filterLabels[filter]}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

interface FoodListProps {
  foods: FoodItemData[];
}

function FoodList({ foods }: FoodListProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.foodListContent}
      showsVerticalScrollIndicator={false}>
      {foods.map((food) => (
        <FoodListRow key={food.id} food={food} />
      ))}
    </ScrollView>
  );
}

interface FoodListRowProps {
  food: FoodItemData;
}

function FoodListRow({ food }: FoodListRowProps) {
  const router = useRouter();
  
  return (
    <Pressable style={styles.foodListRow} onPress={() => router.push(`/`)}>
      <EmojiAvatar emoji={food.emoji} />

      <NameBlock
        name={food.name}
        location={food.location}
        quantity={food.quantity}
      />

      <StatusBadge status={food.status} daysLeft={food.daysLeft} />

      <ChevronRight size={20} color={COLORS.mutedForeground} />
    </Pressable>
  );
}

interface EmojiAvatarProps {
  emoji: string;
}

function EmojiAvatar({ emoji }: EmojiAvatarProps) {
  return (
    <View style={styles.emojiAvatar}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </View>
  );
}

interface NameBlockProps {
  name: string;
  location: string;
  quantity: string;
}

function NameBlock({ name, location, quantity }: NameBlockProps) {
  return (
    <View style={styles.nameBlock}>
      <Text style={styles.foodName}>{name}</Text>
      <Text style={styles.foodMeta}>
        {location} • {quantity}
      </Text>
    </View>
  );
}

interface StatusBadgeProps {
  status: 'ok' | 'urgent' | 'expired';
  daysLeft: number | string;
}

function StatusBadge({ status, daysLeft }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'ok':
        return { backgroundColor: COLORS.ok };
      case 'urgent':
        return { backgroundColor: COLORS.urgent };
      case 'expired':
        return { backgroundColor: COLORS.expired };
    }
  };

  const getBadgeText = () => {
    if (typeof daysLeft === 'string') return daysLeft;
    return `${daysLeft}d`;
  };

  return (
    <View style={[styles.statusBadge, getBadgeStyle()]}>
      <Text style={styles.statusBadgeText}>{getBadgeText()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },
  filterChipsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: COLORS.primaryFg,
    fontWeight: '600',
  },
  foodListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  foodListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 12,
  },
  emojiAvatar: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.muted,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  nameBlock: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 2,
  },
  foodMeta: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  statusBadge: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
