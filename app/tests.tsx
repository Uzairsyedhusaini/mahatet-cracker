import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Step =
  | "paper"
  | "paper2Type"
  | "subject"
  | "year";

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

const paper1Subjects = [
  {
    name: "Urdu",
    icon: "book-open-page-variant",
    color: "#8B5CF6",
  },
  {
    name: "English",
    icon: "book",
    color: "#3B82F6",
  },
  {
    name: "Maths",
    icon: "calculator",
    color: "#F97316",
  },
  {
    name: "CDP",
    icon: "lightbulb-on",
    color: "#22C55E",
  },
];

const mathsScienceSubjects = [
  {
    name: "Urdu",
    icon: "book-open-page-variant",
    color: "#8B5CF6",
  },
  {
    name: "English",
    icon: "book",
    color: "#3B82F6",
  },
  {
    name: "Maths",
    icon: "calculator",
    color: "#F97316",
  },
  {
    name: "CDP",
    icon: "lightbulb-on",
    color: "#22C55E",
  },
  {
    name: "Science",
    icon: "flask",
    color: "#06B6D4",
  },
];

const socialScienceSubjects = [
  {
    name: "Urdu",
    icon: "book-open-page-variant",
    color: "#8B5CF6",
  },
  {
    name: "English",
    icon: "book",
    color: "#3B82F6",
  },
  {
    name: "CDP",
    icon: "lightbulb-on",
    color: "#22C55E",
  },
  {
    name: "Social Science",
    icon: "earth",
    color: "#F97316",
  },
];

export default function TestsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#F8FAFC" : "#0F172A",
    subText: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
    purple: "#8B5CF6",
  };

  const [step, setStep] = useState<Step>("paper");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedPaperType, setSelectedPaperType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const subjects = useMemo(() => {
    if (selectedPaper === "Paper 1") {
      return paper1Subjects;
    }

    if (selectedPaperType === "Maths-Science") {
      return mathsScienceSubjects;
    }

    return socialScienceSubjects;
  }, [selectedPaper, selectedPaperType]);

  const goBack = () => {
    if (step === "paper") {
      router.back();
    } else if (step === "paper2Type") {
      setStep("paper");
    } else if (step === "subject") {
      if (selectedPaper === "Paper 2") {
        setStep("paper2Type");
      } else {
        setStep("paper");
      }
    } else if (step === "year") {
      setStep("subject");
    }
  };

  const handleYearSelect = (year: string) => {
    router.push({
      pathname: "/quiz",
      params: {
        paper: selectedPaper,
        paperType: selectedPaperType,
        subject: selectedSubject,
        year,
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={goBack}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={colors.purple}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              {step === "paper" && "Select Paper"}
              {step === "paper2Type" && "Select Paper Type"}
              {step === "subject" && "Select Subject"}
              {step === "year" && "Select Year"}
            </Text>

            <Text style={[styles.subtitle, { color: colors.subText }]}>
              {step === "paper" &&
                "Choose the paper you want to practice"}
              {step === "paper2Type" &&
                "Choose your Paper 2 category"}
              {step === "subject" &&
                "Choose a subject to start practicing"}
              {step === "year" &&
                "Choose a year to practice PYQs"}
            </Text>
          </View>
        </View>

        {/* PAPER SELECTION */}
        {step === "paper" && (
          <>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={90}
                color="#8B5CF6"
              />

              <Text
                style={[
                  styles.heroTitle,
                  { color: colors.text },
                ]}
              >
                Choose Your Paper
              </Text>

              <Text
                style={[
                  styles.heroText,
                  { color: colors.subText },
                ]}
              >
                MAHATET exam consists of two papers.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.paperCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setSelectedPaper("Paper 1");
                setStep("subject");
              }}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "#F3E8FF" },
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={34}
                  color="#8B5CF6"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paperTitle,
                    { color: colors.text },
                  ]}
                >
                  Paper 1
                </Text>

                <Text
                  style={[
                    styles.paperDesc,
                    { color: colors.subText },
                  ]}
                >
                  For Classes 1st to 5th
                </Text>
              </View>

              <Feather
                name="arrow-right"
                size={24}
                color="#8B5CF6"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.paperCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setSelectedPaper("Paper 2");
                setStep("paper2Type");
              }}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "#FFF7ED" },
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={34}
                  color="#F97316"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paperTitle,
                    { color: colors.text },
                  ]}
                >
                  Paper 2
                </Text>

                <Text
                  style={[
                    styles.paperDesc,
                    { color: colors.subText },
                  ]}
                >
                  For Classes 6th to 8th
                </Text>
              </View>

              <Feather
                name="arrow-right"
                size={24}
                color="#F97316"
              />
            </TouchableOpacity>
          </>
        )}

        {/* PAPER 2 TYPE */}
        {step === "paper2Type" && (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.paper2TypeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setSelectedPaperType("Maths-Science");
                setStep("subject");
              }}
            >
              <View style={styles.paper2Image}>
                <MaterialCommunityIcons
                  name="calculator-variant-outline"
                  size={60}
                  color="#8B5CF6"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paperTitle,
                    { color: colors.text },
                  ]}
                >
                  Maths-Science
                </Text>

                <Text
                  style={[
                    styles.paperDesc,
                    { color: colors.subText },
                  ]}
                >
                  Practice PYQs from Mathematics and Science
                </Text>
              </View>

              <Feather
                name="arrow-right"
                size={24}
                color="#8B5CF6"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.paper2TypeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setSelectedPaperType("Social Science");
                setStep("subject");
              }}
            >
              <View style={styles.paper2Image}>
                <MaterialCommunityIcons
                  name="earth"
                  size={60}
                  color="#3B82F6"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paperTitle,
                    { color: colors.text },
                  ]}
                >
                  Social Science
                </Text>

                <Text
                  style={[
                    styles.paperDesc,
                    { color: colors.subText },
                  ]}
                >
                  Practice PYQs from SST
                </Text>
              </View>

              <Feather
                name="arrow-right"
                size={24}
                color="#3B82F6"
              />
            </TouchableOpacity>
          </>
        )}

        {/* SUBJECTS */}
        {step === "subject" && (
          <View style={styles.subjectGrid}>
            {subjects.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={[
                  styles.subjectCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setSelectedSubject(item.name);
                  setStep("year");
                }}
              >
                <View
                  style={[
                    styles.subjectIcon,
                    {
                      backgroundColor: `${item.color}15`,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={48}
                    color={item.color}
                  />
                </View>

                <Text
                  style={[
                    styles.subjectTitle,
                    { color: colors.text },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.subjectDesc,
                    { color: colors.subText },
                  ]}
                >
                  Previous year questions
                </Text>

                <View
                  style={[
                    styles.arrowCircle,
                    {
                      backgroundColor: `${item.color}15`,
                    },
                  ]}
                >
                  <Feather
                    name="arrow-right"
                    size={20}
                    color={item.color}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* YEAR SELECTION */}
        {step === "year" && (
          <>
            {YEARS.map((year, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={[
                  styles.yearCard,
                  {
                    backgroundColor: colors.card,
                    borderColor:
                      index === 0
                        ? "#8B5CF6"
                        : colors.border,
                  },
                ]}
                onPress={() => handleYearSelect(year)}
              >
                <View style={styles.yearLeft}>
                  <View
                    style={[
                      styles.yearIcon,
                      {
                        backgroundColor: "#F3E8FF",
                      },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#8B5CF6"
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.yearText,
                        { color: colors.text },
                      ]}
                    >
                      {year}
                    </Text>

                    {index === 0 && (
                      <Text
                        style={[
                          styles.latestText,
                          { color: colors.subText },
                        ]}
                      >
                        Latest Year
                      </Text>
                    )}
                  </View>
                </View>

                <Feather
                  name="chevron-right"
                  size={24}
                  color="#8B5CF6"
                />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 25,
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 24,
  },

  heroCard: {
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 15,
  },

  heroText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  paperCard: {
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  iconBox: {
    width: 75,
    height: 75,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  paperTitle: {
    fontSize: 24,
    fontWeight: "800",
  },

  paperDesc: {
    fontSize: 15,
    marginTop: 4,
    lineHeight: 22,
  },

  paper2TypeCard: {
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  paper2Image: {
    width: 90,
    height: 90,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginRight: 18,
  },

  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  subjectCard: {
    width: "48%",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    alignItems: "center",
    borderWidth: 1,
  },

  subjectIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  subjectTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  subjectDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  arrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  yearCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
  },

  yearLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  yearIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  yearText: {
    fontSize: 28,
    fontWeight: "800",
  },

  latestText: {
    marginTop: 4,
    fontSize: 14,
  },
});