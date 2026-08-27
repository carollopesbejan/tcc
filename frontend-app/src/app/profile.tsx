import { Bell, Package, Settings, Trophy } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  background: '#1C2833', card: '#243342', muted: '#253545', secondary: '#2C3E50',
  foreground: '#E8ECEF', mutedForeground: '#7F9AAA', primary: '#3A7D5E', primaryFg: '#F7F9F9',
  accent: '#E8970D', border: 'rgba(232, 236, 239, 0.08)',
};

const PROFILE_STATS = [
  { value: '12🔥', label: 'Ofensiva' },
  { value: '1.240⭐', label: 'Pontos' },
  { value: '8📅', label: 'Semanas' },
];

const STRINGS = { profileTitle: 'Perfil', userName: 'Maria Silva', userEmail: 'maria@email.com', signOut: 'Sair da conta' };

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{STRINGS.profileTitle}</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👩‍🍳</Text></View>
          <View style={styles.identity}><Text style={styles.userName}>{STRINGS.userName}</Text><Text style={styles.email}>{STRINGS.userEmail}</Text><Text style={styles.level}>Nível 4 • Cozinheira experiente</Text></View>
        </View>
        <View style={styles.statsRow}>{PROFILE_STATS.map((stat) => <View key={stat.label} style={styles.stat}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}</View>
        <View style={styles.menuCard}>
          <MenuItem icon={Bell} label="Notificações" sub="Lembretes e atualizações" />
          <MenuItem icon={Settings} label="Configurações" sub="Preferências da conta" />
          <MenuItem icon={Package} label="Minha despensa" sub="Gerencie seus alimentos" />
          <MenuItem icon={Trophy} label="Conquistas" sub="Veja seu progresso" />
        </View>
        <Pressable style={styles.signOut}><Text style={styles.signOutText}>{STRINGS.signOut}</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon: Icon, label, sub }: { icon: typeof Bell; label: string; sub: string }) {
  return <Pressable style={styles.menuItem}><View style={styles.iconBox}><Icon size={20} color={COLORS.accent} /></View><View style={styles.menuCopy}><Text style={styles.menuLabel}>{label}</Text><Text style={styles.menuSub}>{sub}</Text></View><Text style={styles.chevron}>›</Text></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 20 },
  screenTitle: { color: COLORS.foreground, fontSize: 24, lineHeight: 30, fontWeight: '900', fontFamily: 'Nunito' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 34 }, identity: { flex: 1, gap: 4 }, userName: { color: COLORS.foreground, fontSize: 16, fontWeight: '900', fontFamily: 'Nunito' }, email: { color: COLORS.mutedForeground, fontSize: 12, fontWeight: '400', fontFamily: 'Nunito' }, level: { color: COLORS.primaryFg, fontSize: 11, fontWeight: '700', fontFamily: 'Nunito' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.muted, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12 },
  stat: { flex: 1, alignItems: 'center', gap: 4 }, statValue: { color: COLORS.foreground, fontSize: 14, fontWeight: '900', fontFamily: 'Nunito' }, statLabel: { color: COLORS.mutedForeground, fontSize: 11, fontWeight: '400', fontFamily: 'Nunito' },
  menuCard: { backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border }, iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' }, menuCopy: { flex: 1, gap: 2 }, menuLabel: { color: COLORS.foreground, fontSize: 14, fontWeight: '700', fontFamily: 'Nunito' }, menuSub: { color: COLORS.mutedForeground, fontSize: 11, fontWeight: '400', fontFamily: 'Nunito' }, chevron: { color: COLORS.mutedForeground, fontSize: 26 }, signOut: { alignItems: 'center', paddingVertical: 12 }, signOutText: { color: COLORS.accent, fontSize: 14, fontWeight: '700', fontFamily: 'Nunito' },
});