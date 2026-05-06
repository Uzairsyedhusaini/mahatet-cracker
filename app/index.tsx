import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 52) / 2;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7FB" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={26} color="#1B1558" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.logo}>
              Mahatet-
              <Text style={styles.logoHighlight}>cracker</Text>
            </Text>

            <Text style={styles.tagline}>
              Crack the Mahatet exam. Create your future.
            </Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={26}
              color="#1B1558"
            />
          </TouchableOpacity>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.helloText}>
                Hello, Aspirant! 👋
              </Text>

              <Text style={styles.heroTitle}>
                Let’s crack{"\n"}
                <Text style={styles.heroHighlight}>Mahatet!</Text>
              </Text>

              <Text style={styles.heroDescription}>
                Focused practice.{"\n"}
                Better scores.{"\n"}
                Your success starts here.
              </Text>
            </View>

            <View style={styles.heroIconWrapper}>
              <MaterialCommunityIcons
                name="target"
                size={100}
                color="#6C4DFF"
              />
            </View>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* PYQ */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickCard}
            onPress={() => router.push("/tests")}
          >
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "#EEE8FF" },
              ]}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={34}
                color="#6C4DFF"
              />
            </View>

            <Text style={styles.cardTitle}>PYQ</Text>

            <Text style={styles.cardDescription}>
              Previous year papers
            </Text>

            <View style={styles.arrowContainer}>
              <Feather
                name="arrow-right"
                size={18}
                color="#6C4DFF"
              />
            </View>
          </TouchableOpacity>

          {/* QUIZZES */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickCard}
          >
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "#FFF1E8" },
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={34}
                color="#FF8A3D"
              />
            </View>

            <Text style={styles.cardTitle}>Quizzes</Text>

            <Text style={styles.cardDescription}>
              Topic-wise practice
            </Text>

            <View style={styles.arrowContainer}>
              <Feather
                name="arrow-right"
                size={18}
                color="#FF8A3D"
              />
            </View>
          </TouchableOpacity>

          {/* SAVED */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickCard}
          >
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "#EAF9F0" },
              ]}
            >
              <Ionicons
                name="bookmark-outline"
                size={34}
                color="#32B768"
              />
            </View>

            <Text style={styles.cardTitle}>Saved</Text>

            <Text style={styles.cardDescription}>
              Saved quizzes & tests
            </Text>

            <View style={styles.arrowContainer}>
              <Feather
                name="arrow-right"
                size={18}
                color="#32B768"
              />
            </View>
          </TouchableOpacity>

          {/* PROGRESS */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickCard}
          >
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: "#E9F3FF" },
              ]}
            >
              <Ionicons
                name="stats-chart-outline"
                size={34}
                color="#3B82F6"
              />
            </View>

            <Text style={styles.cardTitle}>Progress</Text>

            <Text style={styles.cardDescription}>
              Track your growth
            </Text>

            <View style={styles.arrowContainer}>
              <Feather
                name="arrow-right"
                size={18}
                color="#3B82F6"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* CONTINUE LEARNING */}
        <Text style={styles.sectionTitle2}>
          Continue Learning
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.continueCard}
        >
          <View style={styles.continueLeft}>
            <View style={styles.continueIcon}>
              <Ionicons
                name="book-outline"
                size={26}
                color="#6C4DFF"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.continueTitle}>
                Child Development Quiz
              </Text>

              <Text style={styles.continueSubtitle}>
                Mahatet Paper 1
              </Text>

              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>

          <Text style={styles.progressText}>60%</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeNav}>
            <Ionicons name="home" size={22} color="#6C4DFF" />
          </View>

          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="document-text-outline"
            size={22}
            color="#8E8E93"
          />

          <Text style={styles.navText}>PYQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="list-outline"
            size={22}
            color="#8E8E93"
          />

          <Text style={styles.navText}>Quizzes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="bookmark-outline"
            size={22}
            color="#8E8E93"
          />

          <Text style={styles.navText}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#8E8E93"
          />

          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    alignItems: "center",
    flex: 1,
  },

  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B1558",
  },

  logoHighlight: {
    color: "#FF8A3D",
  },

  tagline: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  heroCard: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: "#F1EEFF",
    borderRadius: 30,
    padding: 24,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  helloText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "900",
    color: "#1B1558",
  },

  heroHighlight: {
    color: "#FF8A3D",
  },

  heroDescription: {
    marginTop: 18,
    fontSize: 18,
    color: "#5B5B5B",
    lineHeight: 30,
  },

  heroIconWrapper: {
    marginLeft: 10,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1B1558",
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  quickCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B1558",
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    minHeight: 40,
  },

  arrowContainer: {
    marginTop: 20,
  },

  sectionTitle2: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B1558",
    marginTop: 18,
    marginBottom: 16,
    paddingHorizontal: 18,
  },

  continueCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  continueLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  continueIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEE8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  continueTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1558",
  },

  continueSubtitle: {
    marginTop: 4,
    marginBottom: 10,
    color: "#6C4DFF",
    fontSize: 14,
  },

  progressBar: {
    width: "90%",
    height: 6,
    borderRadius: 10,
    backgroundColor: "#E6E6EB",
    overflow: "hidden",
  },

  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#6C4DFF",
  },

  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6C4DFF",
    marginLeft: 10,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },

  navItem: {
    alignItems: "center",
  },

  activeNav: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEE8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  activeNavText: {
    color: "#6C4DFF",
    fontSize: 12,
    fontWeight: "700",
  },

  navText: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 4,
  },
});