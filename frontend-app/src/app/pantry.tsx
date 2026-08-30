import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Leaf, CheckCircle2, AlertTriangle, PackageOpen } from 'lucide-react-native';

// Baseado no nosso Design System[cite: 1]
const COLORS = {
  background: '#1C2833',
  card: '#243342',
  foreground: '#E8ECEF',
  mutedFg: '#7F9AAA',
  white20: 'rgba(255,255,255,0.20)',
  border: 'rgba(232,236,239,0.08)',
};

// 🔴 COLOQUE SUA URL DO CODESPACES AQUI (Sem a barra / no final)
const API_BASE_URL = 'https://symmetrical-trout-59g6jjpqprqh459v-8000.app.github.dev'

// --- TIPOS ---
type FoodItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  emoji: string;
};

type FilterType = 'all' | 'ok' | 'warning' | 'urgent' | 'expired';
type StatusType = 'ok' | 'warning' | 'urgent' | 'expired';

// --- HELPERS ---
const getDaysUntilExpiry = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateString);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatus = (days: number): StatusType => {
  if (days < 0) return 'expired';
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'warning';
  return 'ok';
};

const getStatusConfig = (days: number) => {
  if (days < 0) return { label: 'Vencido', color: '#E07A5F', bg: 'rgba(224,122,95,0.10)', border: 'rgba(224,122,95,0.25)' };
  if (days === 0) return { label: 'Hoje!', color: '#E67E22', bg: 'rgba(230,126,34,0.10)', border: 'rgba(230,126,34,0.25)' };
  if (days <= 3) return { label: `${days}d`, color: '#E67E22', bg: 'rgba(230,126,34,0.10)', border: 'rgba(230,126,34,0.25)' };
  if (days <= 7) return { label: `${days}d`, color: '#E8C53A', bg: 'rgba(232,197,58,0.10)', border: COLORS.border };
  return { label: `${days}d`, color: '#82E0AA', bg: 'rgba(130,224,170,0.10)', border: COLORS.border };
};

export default function PantryScreen() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  // Contadores dinâmicos
  const counts = {
    all: items.length,
    ok: items.filter(i => getStatus(getDaysUntilExpiry(i.expiryDate)) === 'ok').length,
    warning: items.filter(i => getStatus(getDaysUntilExpiry(i.expiryDate)) === 'warning').length,
    urgent: items.filter(i => getStatus(getDaysUntilExpiry(i.expiryDate)) === 'urgent').length,
    expired: items.filter(i => getStatus(getDaysUntilExpiry(i.expiryDate)) === 'expired').length,
  };

  // Aplicação do filtro e ordenação (mais críticos primeiro)
  const filteredItems = items
    .filter(i => filter === 'all' || getStatus(getDaysUntilExpiry(i.expiryDate)) === filter)
    .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Alimentos</Text>
        <Text style={styles.subtitle}>{counts.all} itens na dispensa</Text>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <FilterChip label="Todos" count={counts.all} isActive={filter === 'all'} color="#3A7D5E" onPress={() => setFilter('all')} />
          <FilterChip label="OK" count={counts.ok} isActive={filter === 'ok'} color="#3A7D5E" onPress={() => setFilter('ok')} />
          <FilterChip label="Atenção" count={counts.warning} isActive={filter === 'warning'} color="#E8C53A" onPress={() => setFilter('warning')} />
          <FilterChip label="Urgentes" count={counts.urgent} isActive={filter === 'urgent'} color="#E67E22" onPress={() => setFilter('urgent')} />
          <FilterChip label="Vencidos" count={counts.expired} isActive={filter === 'expired'} color="#E07A5F" onPress={() => setFilter('expired')} />
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerLayout}>
          <ActivityIndicator size="large" color="#3A7D5E" />
        </View>
      ) : filteredItems.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <Animated.FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={LinearTransition.springify()}
          renderItem={({ item }) => <FoodListRow item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function FilterChip({ label, count, isActive, color, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        isActive ? { backgroundColor: color, borderColor: color } : {}
      ]}
    >
      <Text style={[styles.filterChipText, isActive && { color: '#FFF' }]}>{label}</Text>
      <Text style={[styles.filterChipCount, isActive && { color: 'rgba(255,255,255,0.8)' }]}>{count}</Text>
    </Pressable>
  );
}

function FoodListRow({ item }: { item: FoodItem }) {
  const days = getDaysUntilExpiry(item.expiryDate);
  const config = getStatusConfig(days);

  return (
    <Animated.View entering={FadeInDown.duration(300)} style={[styles.foodRow, { borderColor: config.border }]}>
      <View style={styles.emojiAvatar}>
        <Text style={styles.emojiText}>{item.emoji}</Text>
      </View>
      
      <View style={styles.infoBlock}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.location}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.quantity} {item.unit}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
      </View>
    </Animated.View>
  );
}

function EmptyState({ filter }: { filter: FilterType }) {
  const states = {
    all: { icon: PackageOpen, color: COLORS.mutedFg, title: "Dispensa vazia", desc: "Adicione seu primeiro alimento." },
    expired: { icon: Leaf, color: '#82E0AA', title: "Nenhum item vencido!", desc: "Sua dispensa está saudável." },
    urgent: { icon: CheckCircle2, color: '#82E0AA', title: "Tudo sob controle.", desc: "Nenhum item urgente no momento." },
    warning: { icon: AlertTriangle, color: '#E8C53A', title: "Tudo tranquilo.", desc: "Nenhum item precisando de atenção." },
    ok: { icon: PackageOpen, color: COLORS.mutedFg, title: "Nenhum item OK", desc: "Verifique os outros filtros." },
  };

  const { icon: Icon, color, title, desc } = states[filter];

  return (
    <View style={styles.centerLayout}>
      <Icon size={48} color={color} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDesc}>{desc}</Text>
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.foreground,
    fontFamily: 'Nunito',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedFg,
    fontFamily: 'Nunito',
    marginTop: 4,
  },
  filtersWrapper: {
    marginBottom: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4, // shadow clearance
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mutedFg,
    fontFamily: 'Nunito',
  },
  filterChipCount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mutedFg,
    marginLeft: 6,
    opacity: 0.7,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Espaço para a BottomNav
    gap: 8,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  emojiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  infoBlock: {
    flex: 1,
    minWidth: 0, 
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
    fontFamily: 'Nunito',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    color: COLORS.mutedFg,
    fontFamily: 'Nunito',
  },
  metaDot: {
    fontSize: 10,
    color: COLORS.mutedFg,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Nunito',
  },
  centerLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // compensar BottomNav
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
    marginTop: 16,
    fontFamily: 'Nunito',
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.mutedFg,
    marginTop: 8,
    fontFamily: 'Nunito',
  }
});