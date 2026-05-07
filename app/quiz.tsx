// app/quiz.tsx

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getQuizData } from "../data/quizIndex";

type RawQuestion = {
  question_number: string;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation?: string;
};

type RawSection = {
  context?: string;
  questions: RawQuestion[];
};

type QuizQuestion = {
  id: string;
  questionNumber: string;
  context?: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type RouteParams = {
  paper?: string | string[];
  paperType?: string | string[];
  subject?: string | string[];
  year?: string | string[];
};

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function normalizeQuizData(data: unknown): QuizQuestion[] {
  if (!Array.isArray(data)) return [];

  const firstItem = data[0] as any;

  // Case 1: section-based structure: [{ context, questions: [...] }, ...]
  if (firstItem && Array.isArray(firstItem.questions)) {
    const sections = data as RawSection[];

    const normalized: QuizQuestion[] = [];

    sections.forEach((section) => {
      section.questions.forEach((q) => {
        const answerIndex = Number(q.answer) - 1;

        normalized.push({
          id: q.question_number,
          questionNumber: q.question_number,
          context: section.context?.trim() || undefined,
          question: q.question,
          options: ["1", "2", "3", "4"].map((key) => q.options?.[key] ?? ""),
          answerIndex,
          explanation: q.explanation ?? "",
        });
      });
    });

    return normalized;
  }

  // Case 2: already-flat question structure
  if (firstItem && "options" in firstItem && "answer" in firstItem) {
    const flatQuestions = data as RawQuestion[];

    return flatQuestions.map((q) => ({
      id: q.question_number,
      questionNumber: q.question_number,
      question: q.question,
      options: ["1", "2", "3", "4"].map((key) => q.options?.[key] ?? ""),
      answerIndex: Number(q.answer) - 1,
      explanation: q.explanation ?? "",
    }));
  }

  return [];
}

function calculateStats(
  questions: QuizQuestion[],
  selectedAnswers: Record<string, number>
) {
  let attempted = 0;
  let correct = 0;
  let wrong = 0;

  questions.forEach((q) => {
    const ans = selectedAnswers[q.id];
    if (ans === undefined) return;

    attempted += 1;
    if (ans === q.answerIndex) correct += 1;
    else wrong += 1;
  });

  const left = questions.length - attempted;
  return { attempted, correct, wrong, left };
}

export default function QuizScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const params = useLocalSearchParams<RouteParams>();

  const paper = firstValue(params.paper);
  const paperType = firstValue(params.paperType);
  const subject = firstValue(params.subject);
  const year = firstValue(params.year);

  const colors = {
    background: isDark ? "#0B1020" : "#F6F8FC",
    card: isDark ? "#121A2B" : "#FFFFFF",
    text: isDark ? "#F5F7FF" : "#0F172A",
    subText: isDark ? "#9CA8C3" : "#64748B",
    border: isDark ? "#243049" : "#E2E8F0",
    purple: "#6D3DF5",
    green: "#22C55E",
    red: "#EF4444",
    blue: "#3B82F6",
    muted: isDark ? "#334155" : "#CBD5E1",
  };

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const questionsRef = useRef<QuizQuestion[]>([]);
  const selectedAnswersRef = useRef<Record<number, number>>({});
  const secondsLeftRef = useRef(90 * 60);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    try {
      const data = getQuizData({
        paper,
        paperType,
        subject,
        year,
      });

      const normalized = normalizeQuizData(data);

      if (!normalized.length) {
        Alert.alert(
          "Quiz Not Available",
          `No quiz found for:\n\n${paper}\n${paperType}\n${subject}\n${year}`
        );
        setQuestions([]);
        return;
      }

      setQuestions(normalized);

      setCurrentIndex(0);
      setSelectedAnswers({});
      setBookmarked({});
      setSecondsLeft(90 * 60);
    } catch (error) {
      console.log("Quiz loading error:", error);
      Alert.alert("Error", "Something went wrong while loading the quiz.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [paper, paperType, subject, year]);

  useEffect(() => {
    if (!questions.length) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: questions.length ? (currentIndex + 1) / questions.length : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, progressAnim, questions.length]);

  const currentQuestion = questions[currentIndex];

  const selectedAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : undefined;

  const stats = useMemo(() => {
    return calculateStats(questions, selectedAnswers);
  }, [questions, selectedAnswers]);

  const timeText = useMemo(() => {
    const h = Math.floor(secondsLeft / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;

    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }, [secondsLeft]);

  const answerQuestion = (optionIndex: number) => {
    if (!currentQuestion) return;

    if (selectedAnswers[currentQuestion.id] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const goPrevious = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const goNext = () => {
    if (currentIndex >= questions.length - 1) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const jumpToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const handleSubmit = (forced = false, forcedTimeLeft?: number) => {
    const latestQuestions = questionsRef.current;
    const latestAnswers = selectedAnswersRef.current;
    const latestStats = calculateStats(latestQuestions, latestAnswers);
    const timeLeftValue =
      typeof forcedTimeLeft === "number" ? forcedTimeLeft : secondsLeftRef.current;

    const finish = () => {
      router.replace({
        pathname: "/result",
        params: {
          paper,
          paperType,
          subject,
          year,
          total: String(latestQuestions.length),
          attempted: String(latestStats.attempted),
          correct: String(latestStats.correct),
          wrong: String(latestStats.wrong),
          left: String(latestStats.left),
          score: String(latestStats.correct),
          timeLeft: String(timeLeftValue),
          answers: JSON.stringify(latestAnswers),
        },
      });
    };

    if (forced) {
      finish();
      return;
    }

    Alert.alert(
      "Submit test?",
      `Attempted: ${latestStats.attempted}\nCorrect: ${latestStats.correct}\nWrong: ${latestStats.wrong}\nLeft: ${latestStats.left}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Submit", style: "default", onPress: finish },
      ]
    );
  };

  const setBookmark = () => {
    if (!currentQuestion) return;
    setBookmarked((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const optionState = (optionIndex: number) => {
    if (!currentQuestion || selectedAnswer === undefined) return "idle";

    if (
      optionIndex === currentQuestion.answerIndex &&
      selectedAnswer !== currentQuestion.answerIndex
    ) {
      return "correct";
    }

    if (
      optionIndex === selectedAnswer &&
      selectedAnswer !== currentQuestion.answerIndex
    ) {
      return "wrong";
    }

    if (
      optionIndex === selectedAnswer &&
      selectedAnswer === currentQuestion.answerIndex
    ) {
      return "correct";
    }

    return "idle";
  };

  const infoCards = [
    { label: "Attempted", value: stats.attempted, color: colors.green },
    { label: "Wrong", value: stats.wrong, color: colors.red },
    { label: "Left", value: stats.left, color: colors.muted },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.subText, fontSize: 16 }}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>
            No questions found
          </Text>
          <Text
            style={{
              color: colors.subText,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Add quiz data for this route key and you are good to go.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="arrow-left" size={24} color={colors.purple} />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {paper} {paperType ? `(${paperType})` : "(Urdu Medium)"}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subText }]}>
              Subject: {subject || "—"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSubmit(false)}
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.submitText, { color: colors.purple }]}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.topCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.timerBox}>
            <View
              style={[
                styles.timerIcon,
                { backgroundColor: `${colors.purple}15` },
              ]}
            >
              <Ionicons name="time-outline" size={22} color={colors.purple} />
            </View>

            <View>
              <Text style={[styles.topLabel, { color: colors.subText }]}>
                Time Left
              </Text>
              <Text style={[styles.timerText, { color: colors.purple }]}>
                {timeText}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {infoCards.map((item) => (
              <View key={item.label} style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <View
                    style={[
                      styles.statDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={[styles.topLabel, { color: colors.subText }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.gridCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.gridWrap}>
            {questions.map((q, index) => {
              const answer = selectedAnswers[q.id];
              const isAnswered = answer !== undefined;
              const isCorrect = answer === q.answerIndex;
              const isCurrent = index === currentIndex;

              let borderColor = colors.border;
              let textColor = colors.text;
              let bgColor = colors.card;

              if (isAnswered && isCorrect) {
                borderColor = colors.green;
                textColor = colors.green;
                bgColor = `${colors.green}12`;
              } else if (isAnswered && !isCorrect) {
                borderColor = colors.red;
                textColor = colors.red;
                bgColor = `${colors.red}12`;
              } else if (isCurrent) {
                borderColor = colors.purple;
                textColor = colors.purple;
                bgColor = `${colors.purple}12`;
              }

              return (
                <TouchableOpacity
                  key={q.id}
                  activeOpacity={0.85}
                  onPress={() => jumpToQuestion(index)}
                  style={[
                    styles.gridCell,
                    {
                      borderColor,
                      backgroundColor: bgColor,
                    },
                  ]}
                >
                  <Text style={[styles.gridCellText, { color: textColor }]}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.questionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.questionHeader}>
            <Text style={[styles.questionCounter, { color: colors.purple }]}>
              Question {currentIndex + 1} of {questions.length}
            </Text>

            <TouchableOpacity activeOpacity={0.85} onPress={setBookmark}>
              <Ionicons
                name={bookmarked[currentQuestion.id] ? "bookmark" : "bookmark-outline"}
                size={24}
                color={colors.purple}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: colors.border },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: colors.purple,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.questionBox,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? "#0F172A" : "#FBFCFF",
              },
            ]}
          >
            {currentQuestion.context ? (
              <Text
                style={{
                  color: colors.subText,
                  fontSize: 14,
                  lineHeight: 22,
                  marginBottom: 12,
                  textAlign: "right",
                }}
              >
                {currentQuestion.context}
              </Text>
            ) : null}

            <Text style={[styles.questionText, { color: colors.text }]}>
              {currentQuestion.questionNumber}. {currentQuestion.question}
            </Text>
          </View>

          <View style={styles.optionList}>
            {currentQuestion.options.map((option, index) => {
              const state = optionState(index);
              const isSelected = selectedAnswer === index;

              const styleByState =
                state === "correct"
                  ? {
                      borderColor: colors.green,
                      backgroundColor: `${colors.green}12`,
                      textColor: colors.green,
                    }
                  : state === "wrong"
                    ? {
                        borderColor: colors.red,
                        backgroundColor: `${colors.red}12`,
                        textColor: colors.red,
                      }
                    : {
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                        textColor: colors.text,
                      };

              const rightAnswerVisible =
                selectedAnswer !== undefined && index === currentQuestion.answerIndex;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.85}
                  disabled={selectedAnswer !== undefined}
                  onPress={() => answerQuestion(index)}
                  style={[
                    styles.optionItem,
                    {
                      borderColor: styleByState.borderColor,
                      backgroundColor: styleByState.backgroundColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        borderColor:
                          state === "correct"
                            ? colors.green
                            : state === "wrong"
                              ? colors.red
                              : colors.muted,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.radioInner,
                        {
                          backgroundColor:
                            isSelected || rightAnswerVisible
                              ? state === "wrong"
                                ? colors.red
                                : colors.green
                              : "transparent",
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {String.fromCharCode(65 + index)}.
                  </Text>

                  <Text
                    style={[
                      styles.optionText,
                      { color: styleByState.textColor, flex: 1 },
                    ]}
                  >
                    {option}
                  </Text>

                  {state === "correct" && (
                    <Feather name="check-circle" size={20} color={colors.green} />
                  )}
                  {state === "wrong" && (
                    <Feather name="x-circle" size={20} color={colors.red} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedAnswer !== undefined &&
            selectedAnswer !== currentQuestion.answerIndex && (
              <View
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: isDark ? "rgba(239,68,68,0.08)" : "#FEF2F2",
                  borderWidth: 1,
                  borderColor: `${colors.red}30`,
                }}
              >
                <Text
                  style={{
                    color: colors.red,
                    fontWeight: "800",
                    textAlign: "right",
                  }}
                >
                  Correct Answer:{" "}
                  {currentQuestion.options[currentQuestion.answerIndex] ?? "—"}
                </Text>
              </View>
            )}

          {selectedAnswer !== undefined && (
            <View
              style={[
                styles.explanationCard,
                {
                  backgroundColor: isDark ? "rgba(34,197,94,0.08)" : "#F0FFF4",
                  borderColor: `${colors.green}30`,
                },
              ]}
            >
              <View style={styles.explanationHeader}>
                <View style={styles.explanationIcon}>
                  <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    size={24}
                    color={colors.green}
                  />
                </View>
                <Text style={[styles.explanationTitle, { color: colors.green }]}>
                  Explanation
                </Text>
              </View>

              <Text style={[styles.explanationText, { color: colors.text }]}>
                {currentQuestion.explanation || "No explanation added yet."}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={goPrevious}
            disabled={currentIndex === 0}
            style={[
              styles.navButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: currentIndex === 0 ? 0.5 : 1,
              },
            ]}
          >
            <Feather name="arrow-left" size={18} color={colors.purple} />
            <Text style={[styles.navButtonText, { color: colors.purple }]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentIndex < questions.length - 1 ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={goNext}
              style={[
                styles.navButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.navButtonText, { color: colors.purple }]}>
                Next
              </Text>
              <Feather name="arrow-right" size={18} color={colors.purple} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSubmit(false)}
              style={[
                styles.navButton,
                {
                  backgroundColor: colors.purple,
                  borderColor: colors.purple,
                },
              ]}
            >
              <Text style={[styles.navButtonText, { color: "#FFFFFF" }]}>
                Finish
              </Text>
              <Feather name="check" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  headerButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  submitButton: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "800",
  },
  topCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timerIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  topLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  timerText: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
  },
  gridCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 14,
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridCell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridCellText: {
    fontSize: 14,
    fontWeight: "800",
  },
  questionCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 28,
    borderWidth: 1,
    padding: 16,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: "800",
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  questionBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },
  questionText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "right",
    fontWeight: "700",
  },
  optionList: {
    marginTop: 16,
    gap: 12,
  },
  optionItem: {
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 66,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "800",
  },
  optionText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    textAlign: "right",
  },
  explanationCard: {
    marginTop: 16,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  explanationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "right",
  },
  bottomNav: {
    marginHorizontal: 20,
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },
});