import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

type RouteValue = string | string[] | undefined;

function getFirstValue(value: RouteValue): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function toNumber(value: RouteValue, fallback = 0): number {
  const raw = getFirstValue(value);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getPerformanceLabel(percentage: number) {
  if (percentage >= 90) {
    return {
      title: "Outstanding",
      subtitle: "That was a beast mode performance.",
      icon: "trophy-outline" as const,
    };
  }

  if (percentage >= 75) {
    return {
      title: "Strong Result",
      subtitle: "Solid work. A little polish and you are flying.",
      icon: "flash-outline" as const,
    };
  }

  if (percentage >= 50) {
    return {
      title: "Decent Attempt",
      subtitle: "Not bad. Now we squeeze out the weak spots.",
      icon: "trending-up-outline" as const,
    };
  }

  return {
    title: "Needs More Work",
    subtitle: "Good news: this is fixable with practice.",
    icon: "reload-outline" as const,
  };
}

export default function ResultScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const params = useLocalSearchParams<{
    paper?: RouteValue;
    paperType?: RouteValue;
    subject?: RouteValue;
    year?: RouteValue;
    total?: RouteValue;
    attempted?: RouteValue;
    correct?: RouteValue;
    wrong?: RouteValue;
    left?: RouteValue;
    score?: RouteValue;
    timeLeft?: RouteValue;
    answers?: RouteValue;
  }>();

  const paper = getFirstValue(params.paper);
  const paperType = getFirstValue(params.paperType);
  const subject = getFirstValue(params.subject);
  const year = getFirstValue(params.year);

  const total = toNumber(params.total);
  const attempted = toNumber(params.attempted);
  const correct = toNumber(params.correct);
  const wrong = toNumber(params.wrong);
  const left = toNumber(params.left);
  const score = toNumber(params.score, correct);
  const timeLeft = toNumber(params.timeLeft);

  const answers = getFirstValue(params.answers);

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const performance = useMemo(
    () => getPerformanceLabel(percentage),
    [percentage]
  );

  const primary = isDark ? "#A78BFA" : "#7C3AED";
  const background = isDark ? "#0B1220" : "#F8FAFC";
  const card = isDark ? "#121A2A" : "#FFFFFF";
  const cardSoft = isDark ? "#1A2436" : "#F1F5F9";
  const text = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#223049" : "#E2E8F0";
  const success = "#22C55E";
  const danger = "#EF4444";
  const warning = "#F59E0B";

  const paperLabel = [paper, paperType, subject, year]
    .filter(Boolean)
    .join(" • ");

  const details = [
    {
      label: "Correct",
      value: String(correct),
      icon: "checkmark-circle-outline" as const,
      color: success,
    },
    {
      label: "Wrong",
      value: String(wrong),
      icon: "close-circle-outline" as const,
      color: danger,
    },
    {
      label: "Unanswered",
      value: String(left),
      icon: "help-circle-outline" as const,
      color: warning,
    },
    {
      label: "Attempted",
      value: String(attempted),
      icon: "sparkles-outline" as const,
      color: primary,
    },
  ];

  const handleRetry = () => {
    router.replace("/tests");
  };

  const handleHome = () => {
    router.replace("/");
  };

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.iconBadge, { backgroundColor: `${primary}18` }]}>
              <Ionicons name="analytics-outline" size={22} color={primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: text }]}>Test Completed</Text>
              <Text style={[styles.subtitle, { color: muted }]}>
                Here is your score breakdown and performance summary.
              </Text>
            </View>
          </View>

          {paperLabel ? (
            <View style={[styles.metaPill, { backgroundColor: cardSoft }]}>
              <Ionicons name="school-outline" size={16} color={muted} />
              <Text style={[styles.metaPillText, { color: muted }]} numberOfLines={1}>
                {paperLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.scoreCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <View style={styles.scoreTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionLabel, { color: muted }]}>Your Score</Text>
              <Text style={[styles.scoreText, { color: text }]}>
                {correct}/{total}
              </Text>
              <Text style={[styles.percentText, { color: primary }]}>{percentage}%</Text>
            </View>

            <View style={[styles.ringWrap, { borderColor: `${primary}22` }]}>
              <View style={[styles.ringInner, { backgroundColor: `${primary}14` }]}>
                <Ionicons name={performance.icon} size={28} color={primary} />
              </View>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(0, Math.min(percentage, 100))}%`,
                  backgroundColor: primary,
                },
              ]}
            />
          </View>

          <Text style={[styles.performanceTitle, { color: text }]}>
            {performance.title}
          </Text>
          <Text style={[styles.performanceSubtitle, { color: muted }]}>
            {performance.subtitle}
          </Text>
        </View>

        <View style={styles.grid}>
          {details.map((item) => (
            <View
              key={item.label}
              style={[
                styles.statCard,
                { backgroundColor: card, borderColor: border },
              ]}
            >
              <View style={[styles.statIcon, { backgroundColor: `${item.color}14` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <Text style={[styles.sectionHeader, { color: text }]}>Session Summary</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Time left</Text>
            <Text style={[styles.infoValue, { color: text }]}>{formatTime(timeLeft)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Accuracy</Text>
            <Text style={[styles.infoValue, { color: text }]}>
              {total > 0 ? `${Math.round((correct / total) * 100)}%` : "0%"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Mistakes</Text>
            <Text style={[styles.infoValue, { color: text }]}>{wrong}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Questions attempted</Text>
            <Text style={[styles.infoValue, { color: text }]}>{attempted}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: muted }]}>Score</Text>
            <Text style={[styles.infoValue, { color: text }]}>{score}</Text>
          </View>
        </View>

        <View
          style={[
            styles.noticeCard,
            { backgroundColor: cardSoft, borderColor: border },
          ]}
        >
          <View style={styles.noticeRow}>
            <Ionicons name="create-outline" size={18} color={muted} />
            <Text style={[styles.noticeTitle, { color: text }]}>Answer review</Text>
          </View>
          <Text style={[styles.noticeText, { color: muted }]}>
            Answers captured in route params: {answers ? "available" : "not provided"}.
            This space is ready for future answer review, weak-topic analysis, and
            explanation breakdowns.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>

          <Pressable
            onPress={handleHome}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: card,
                borderColor: border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Ionicons name="home-outline" size={18} color={text} />
            <Text style={[styles.secondaryButtonText, { color: text }]}>Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  headerCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
  },
  metaPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 260,
  },
  scoreCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  scoreTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scoreText: {
    marginTop: 6,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
  },
  percentText: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "800",
  },
  ringWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.18)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  performanceSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47.8%",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  noticeCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },
});