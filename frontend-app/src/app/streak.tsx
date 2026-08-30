import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Flame, Star, CheckCircle } from 'lucide-react-native';

const COLORS = {
  background: '#1C2833',
  card: '#243342',
  primary: '#3A7D5E',
  amber: '#E8970D',
  muted: '#7F9AAA',
  white: '#FFFFFF',
  border: 'rgba(232,236,239,0.08)',
};

let streak: number = 17;
let items: any[] = [];
let expiredCount: number = 0;

export default function StreakScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Animated.ScrollView 
        entering={FadeInDown.duration(400).springify()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader />
        <BigStreakCard />
        <LevelCard />
        <AchievementsSection />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function PageHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Ofensiva</Text>
      <Text style={styles.subtitle}>Seu histórico de dias consecutivos</Text>
    </View>
  );
}

function BigStreakCard() {
  const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];
  const todayIdx = (new Date().getDay() + 6) % 7;
  
  const activeIndices = new Set(
    Array.from({ length: Math.min(streak, 7) }, (_, i) => (todayIdx - i + 7) % 7)
  );

  if (streak === 0) {
    return (
      <LinearGradient colors={['#1e4535', '#19382a', '#132b1f']} style={styles.bigCard}>
        <Text style={styles.zeroStreakTitle}>Recomeçar é a parte mais corajosa 💪</Text>
        <Text style={styles.zeroStreakSub}>Adicione um alimento hoje para iniciar sua nova ofensiva.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1e4535', '#19382a', '#132b1f']} style={styles.bigCard}>
      {/* Círculos decorativos */}
      <View style={[styles.decoCircle, styles.decoTopRight]} />
      <View style={[styles.decoCircle, styles.decoBottomLeft]} />

      <View style={styles.streakLabelWrap}>
        <Text style={styles.streakLabel}>Ofensiva atual</Text>
      </View>

      <View style={styles.streakCounterRow}>
        <Flame size={44} color={COLORS.amber} fill={COLORS.amber} />
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakUnit}>dias</Text>
      </View>

      <View style={styles.weekStrip}>
        {weekDays.map((day, idx) => {
          const isActive = activeIndices.has(idx);
          const isToday = idx === todayIdx;

          return (
            <View key={idx} style={styles.dayCell}>
              <View style={[
                styles.dayBlock,
                isActive && styles.dayBlockActive,
                isToday && !isActive && styles.dayBlockToday
              ]}>
                {isActive && <Flame size={13} color="#7a3b00" fill="#7a3b00" />}
              </View>
              <Text style={[styles.dayInitial, isActive && styles.dayInitialActive]}>{day}</Text>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

function LevelCard() {
  const levelNames = ["Iniciante", "Dedicado", "Expert", "Mestre"];
  const levelEmoji = ["🌱", "⚡", "🏆", "👑"];
  const thresholds = [7, 14, 30, 30];
  
  const level = streak >= 30 ? 4 : streak >= 14 ? 3 : streak >= 7 ? 2 : 1;
  const nextThreshold = level === 4 ? 30 : thresholds[level - 1];
  const progressPercent = level >= 4 ? 100 : Math.min((streak / nextThreshold) * 100, 100);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(progressPercent, { duration: 1000 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.levelCard}>
      <View style={styles.levelRow}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelName}>{levelEmoji[level - 1]} {levelNames[level - 1]}</Text>
          <Text style={styles.levelSub}>Nível {level} de 4</Text>
        </View>
        <Text style={styles.progressLabel}>
          {level >= 4 ? 'Nível Máximo' : `${streak}/${nextThreshold}d para Nível ${level + 1}`}
        </Text>
      </View>
      
      <View style={styles.xpTrack}>
        <Animated.View style={[styles.xpFillWrapper, animatedStyle]}>
          <LinearGradient 
            colors={['#3A7D5E', '#52A87C']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }} 
            style={StyleSheet.absoluteFill} 
          />
        </Animated.View>
      </View>
    </View>
  );
}

function AchievementsSection() {
  const rawAchievements = [
    { emoji: "🔥", label: "Primeira chama", desc: "1 dia consecutivo", target: 1, current: streak, unlocked: streak >= 1 },
    { emoji: "⚡", label: "Semana perfeita", desc: "7 dias seguidos", target: 7, current: streak, unlocked: streak >= 7 },
    { emoji: "🏆", label: "Quinzena", desc: "14 dias seguidos", target: 14, current: streak, unlocked: streak >= 14 },
    { emoji: "👑", label: "Mestre do mês", desc: "30 dias seguidos", target: 30, current: streak, unlocked: streak >= 30 },
    { emoji: "🌿", label: "Zero desperdício", desc: "Sem vencidos hoje", target: 1, current: expiredCount === 0 ? 1 : 0, unlocked: expiredCount === 0 },
    { emoji: "📦", label: "Dispensa cheia", desc: "10+ itens cadastrados", target: 10, current: items.length, unlocked: items.length >= 10 },
  ];

  const achievements = [...rawAchievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

  return (
    <View style={styles.achievementsSection}>
      <View style={styles.sectionHeader}>
        <Star size={18} color={COLORS.amber} fill={COLORS.amber} />
        <Text style={styles.sectionTitle}>Conquistas</Text>
      </View>

      <View style={styles.achievementsGrid}>
        {achievements.map((ach, idx) => (
          <View 
            key={idx} 
            style={[
              styles.achievementCard, 
              ach.unlocked ? styles.achCardUnlocked : styles.achCardLocked
            ]}
          >
            <Text style={styles.achEmoji}>{ach.emoji}</Text>
            <Text style={styles.achTitle}>{ach.label}</Text>
            <Text style={styles.achDesc}>{ach.desc}</Text>
            
            {ach.unlocked ? (
              <View style={styles.unlockedRow}>
                <CheckCircle size={10} color={COLORS.primary} />
                <Text style={styles.unlockedText}>Conquistada</Text>
              </View>
            ) : (
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>{Math.min(ach.current, ach.target)}/{ach.target}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    gap: 20,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Nunito',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontFamily: 'Nunito',
    marginTop: 4,
  },
  bigCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  decoTopRight: {
    width: 160,
    height: 160,
    top: -10,
    right: -10,
  },
  decoBottomLeft: {
    width: 96,
    height: 96,
    bottom: 8,
    left: -6,
  },
  zeroStreakTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: 'Nunito',
    textAlign: 'center',
    marginBottom: 8,
  },
  zeroStreakSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Nunito',
    textAlign: 'center',
  },
  streakLabelWrap: {
    backgroundColor: 'rgba(130,224,170,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  streakLabel: {
    color: 'rgba(130,224,170,0.8)',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
  },
  streakCounterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 24,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Nunito',
    lineHeight: 80,
  },
  streakUnit: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(130,224,170,0.60)',
    fontFamily: 'Nunito',
  },
  weekStrip: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  dayBlock: {
    width: '100%',
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBlockActive: {
    backgroundColor: COLORS.amber,
    shadowColor: COLORS.amber,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dayBlockToday: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  dayInitial: {
    fontSize: 10,
    color: COLORS.muted,
    fontFamily: 'Nunito',
    fontWeight: '700',
  },
  dayInitialActive: {
    color: COLORS.white,
  },
  levelCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  levelInfo: {
    gap: 2,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Nunito',
  },
  levelSub: {
    fontSize: 12,
    color: COLORS.muted,
    fontFamily: 'Nunito',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Nunito',
  },
  xpTrack: {
    height: 12,
    backgroundColor: '#2C3E50',
    borderRadius: 999,
    overflow: 'hidden',
  },
  xpFillWrapper: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  achievementsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Nunito',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  achCardUnlocked: {
    backgroundColor: COLORS.card,
    borderColor: 'rgba(58,125,94,0.3)',
    opacity: 1,
  },
  achCardLocked: {
    backgroundColor: 'rgba(36,51,66,0.30)',
    borderColor: 'rgba(232,236,239,0.05)',
    opacity: 0.40,
  },
  achEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  achTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Nunito',
  },
  achDesc: {
    fontSize: 10,
    color: COLORS.muted,
    fontFamily: 'Nunito',
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'Nunito',
  },
  progressRow: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
    fontFamily: 'Nunito',
  },
});