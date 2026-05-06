import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MAHATET Cracker</Text>
      <Text style={styles.subtitle}>Home Screen 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
});