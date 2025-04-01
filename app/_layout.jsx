import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  const hideNavBar =
    segments.length === 0 ||
    segments[0] === "Signin" ||
    segments[0] === "CreateAccount" ||
    segments[0] === "ForgotPassword";

  const isHome = segments.length === 0 || segments[0] === "Home";

  return (
    <View style={styles.container}>
      {!hideNavBar && (
        <View style={styles.header}>
          {!isHome && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerText}>
            Eyy<Text style={styles.med}>Trike</Text>
          </Text>
          <View style={styles.iconPlaceholder} />
        </View>
      )}

      {/* Stack Navigation */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Signin" />
          <Stack.Screen name="Home" />
          <Stack.Screen name="Profile" />
          <Stack.Screen name="BookRide" />
          <Stack.Screen name="Drivers" />
        </Stack>
      </View>

      {/* Bottom Curved Navigation Bar */}
      {!hideNavBar && (
        <View style={styles.navBar}>
          {["Home", "Drivers", "RideHistory", "Profile"].map((item, index) => {
            const isActive = segments[0] === item;
            return (
              <TouchableOpacity key={index} style={styles.navButton} onPress={() => router.push(`/${item}`)}>
                {isActive ? (
                  <View style={styles.activeButtonContainer}>
                    <FontAwesome5 name={getIconName(item)} size={20} color="#fff" />
                    <Text style={styles.activeNavText}>{item}</Text>
                  </View>
                ) : (
                  <>
                    <FontAwesome5 name={getIconName(item)} size={20} color="#333" />
                    <Text style={styles.navText}>{item}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

function getIconName(name) {
  switch (name) {
    case "Home":
      return "home"; // Existing icon
    case "Drivers":
      return "car"; // New icon for RideHistory
    case "RideHistory":
      return "history"; // New icon for Drivers
    case "Profile":
      return "user"; // Existing icon
    default:
      return "question-circle"; // Default icon
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70, // Reduced from 90
    backgroundColor: "#fff",
    paddingHorizontal: 20, // Reduced from 25
    elevation: 2, // Added shadow for Android
    shadowColor: "#000", // Added shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 24, // Reduced from 30
    fontWeight: "800",
    color: "#8A2BE2", // Violet for "Eyy"
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  med: {
    fontSize: 24, // Reduced from 30
    fontWeight: "800",
    color: "#28A745", // Green for "Trike"
  },
  iconButton: {
    padding: 8, // Reduced from 10
    zIndex: 2,
    opacity: 1, // For press animation
  },
  iconPlaceholder: {
    width: 30, // Reduced from 40
    zIndex: 2,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    width: "100%",
    height: 65, // Reduced from 80
    backgroundColor: "#E9ECEF", // Light gray to match white
    paddingBottom: 15, // Reduced from 27
    position: "absolute",
    bottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 5,
  },
  navText: {
    fontSize: 9, // Reduced from 10
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  activeButtonContainer: {
    width: 70, // Reduced from 90
    height: 70, // Reduced from 90
    borderRadius: 35,
    backgroundColor: "#6C757D", // Dark gray for active button
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3, // Reduced from 5
    borderWidth: 3, // Reduced from 5
    borderColor: "#f5f5f5",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    transform: [{ scale: 0.95 }], // Added scale effect when active
  },
  activeNavText: {
    fontSize: 9, // Reduced from 10
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
});
