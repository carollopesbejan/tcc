import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  border: 'rgba(232, 236, 239, 0.08)',
  success: '#82E0AA',
};

const CATEGORIES = [
  'Frutas🍎',
  'Laticínios🥛',
  'Carnes🍗',
  'Bebidas☕',
  'Grãos🌾',
  'Snacks🍪',
  'Outros📦',
];

const LOCATIONS = [
  'Geladeira🧊',
  'Freezer❄️',
  'Fruteira🍑',
  'Armário🚪',
  'Despensa📦',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'un', 'lata', 'pct'];

export default function AddScreen() {
  const router = useRouter();
  const [foodName, setFoodName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('un');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const handleAdd = () => {
    if (foodName && selectedCategory && selectedLocation && quantity && selectedDate) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFoodName('');
        setSelectedCategory(null);
        setSelectedLocation(null);
        setQuantity('');
        setSelectedUnit('un');
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader onBackPress={() => router.back()} />

        {showSuccess && <SuccessBanner />}

        <View style={styles.section}>
          <LabeledInput
            label="Nome do alimento"
            placeholder="Ex: Maçã, Frango..."
            value={foodName}
            onChangeText={setFoodName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Categoria</Text>
          <CategoryGrid
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Local de Armazenamento</Text>
          <LocationChips
            locations={LOCATIONS}
            selected={selectedLocation}
            onSelect={setSelectedLocation}
          />
        </View>

        <View style={styles.section}>
          <QuantityUnitRow
            quantity={quantity}
            onQuantityChange={setQuantity}
            unit={selectedUnit}
            onUnitPress={() => setShowUnitPicker(true)}
          />
        </View>

        <View style={styles.section}>
          <DateInput
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        </View>

        <View style={styles.section}>
          <PrimaryButton
            label="Adicionar à Dispensa"
            onPress={handleAdd}
          />
        </View>
      </ScrollView>

      <UnitPickerModal
        visible={showUnitPicker}
        selected={selectedUnit}
        units={UNITS}
        onSelect={(unit) => {
          setSelectedUnit(unit);
          setShowUnitPicker(false);
        }}
        onClose={() => setShowUnitPicker(false)}
      />
    </SafeAreaView>
  );
}

function ScreenHeader({ onBackPress }: { onBackPress: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color={COLORS.foreground} />
      </Pressable>
      <Text style={styles.screenTitle}>Adicionar</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

function SuccessBanner() {
  return (
    <View style={styles.successBanner}>
      <Text style={styles.successText}>✓ Alimento adicionado com sucesso!</Text>
    </View>
  );
}

interface LabeledInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

function LabeledInput({ label, placeholder, value, onChangeText }: LabeledInputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mutedForeground}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

interface CategoryGridProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string) => void;
}

function CategoryGrid({ categories, selected, onSelect }: CategoryGridProps) {
  return (
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.categoryChip,
            selected === category && styles.categoryChipSelected,
          ]}
          onPress={() => onSelect(category)}>
          <Text style={styles.categoryChipText}>{category}</Text>
        </Pressable>
      ))}
    </View>
  );
}

interface LocationChipsProps {
  locations: string[];
  selected: string | null;
  onSelect: (location: string) => void;
}

function LocationChips({ locations, selected, onSelect }: LocationChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.locationChipsScroll}>
      {locations.map((location) => (
        <Pressable
          key={location}
          style={[
            styles.locationChip,
            selected === location && styles.locationChipSelected,
          ]}
          onPress={() => onSelect(location)}>
          <Text style={styles.locationChipText}>{location}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

interface QuantityUnitRowProps {
  quantity: string;
  onQuantityChange: (text: string) => void;
  unit: string;
  onUnitPress: () => void;
}

function QuantityUnitRow({
  quantity,
  onQuantityChange,
  unit,
  onUnitPress,
}: QuantityUnitRowProps) {
  return (
    <View>
      <Text style={styles.label}>Quantidade</Text>
      <View style={styles.quantityRow}>
        <TextInput
          style={styles.quantityInput}
          placeholder="0"
          placeholderTextColor={COLORS.mutedForeground}
          value={quantity}
          onChangeText={onQuantityChange}
          keyboardType="decimal-pad"
        />
        <Pressable style={styles.unitButton} onPress={onUnitPress}>
          <Text style={styles.unitButtonText}>{unit}</Text>
        </Pressable>
      </View>
    </View>
  );
}

interface DateInputProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

function DateInput({ date, onDateChange }: DateInputProps) {
  const handlePress = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    onDateChange(tomorrow);
  };

  return (
    <View>
      <Text style={styles.label}>Data de Expiração</Text>
      <Pressable style={styles.dateButton} onPress={handlePress}>
        <Calendar size={20} color={COLORS.primary} />
        <Text style={styles.dateButtonText}>
          {date.toLocaleDateString('pt-BR')}
        </Text>
      </Pressable>
    </View>
  );
}

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Plus size={20} color={COLORS.primaryFg} />
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

interface UnitPickerModalProps {
  visible: boolean;
  selected: string;
  units: string[];
  onSelect: (unit: string) => void;
  onClose: () => void;
}

function UnitPickerModal({
  visible,
  selected,
  units,
  onSelect,
  onClose,
}: UnitPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione a unidade</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {units.map((unit) => (
              <Pressable
                key={unit}
                style={[
                  styles.modalOption,
                  selected === unit && styles.modalOptionSelected,
                ]}
                onPress={() => onSelect(unit)}>
                <Text
                  style={[
                    styles.modalOptionText,
                    selected === unit && styles.modalOptionTextSelected,
                  ]}>
                  {unit}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.foreground,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    width: '23%',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.foreground,
    textAlign: 'center',
  },
  locationChipsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  locationChip: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  locationChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  locationChipText: {
    fontSize: 13,
    color: COLORS.foreground,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.foreground,
  },
  unitButton: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    minWidth: 70,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.foreground,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryFg,
  },
  successBanner: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C2833',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  modalClose: {
    fontSize: 24,
    color: COLORS.mutedForeground,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 14,
    color: COLORS.foreground,
  },
  modalOptionTextSelected: {
    color: COLORS.primaryFg,
    fontWeight: '600',
  },
});
