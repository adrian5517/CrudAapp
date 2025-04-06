import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, StatusBar } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  // Check if navbar should be hidden based on the current route
  const hideNavBar =
    segments.length === 0 ||
    segments[0] === "Signin" ||
    segments[0] === "CreateAccount" ||
    segments[0] === "ForgotPassword";

  return (
    <View style={styles.container}>
      {/* Show Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Stack Navigation for screens */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Signin" />
          <Stack.Screen name="Home" />
          <Stack.Screen name="Profile" />
          <Stack.Screen name="BookRide" />
          <Stack.Screen name="Rent" />
          <Stack.Screen name="History" />
        </Stack>
      </View>

      {/* Bottom Curved Navigation Bar */}
      {!hideNavBar && (
        <View style={styles.navBar}>
          {["Home", "Rent", "History", "Profile"].map((item, index) => {
            const isActive = segments[0] === item;
            return (
              <TouchableOpacity
                key={index}
                style={styles.navButton}
                onPress={() => router.push(`/${item}`)}
              >
                {isActive ? (
                  <View style={styles.activeButtonContainer}>
                    <FontAwesome5
                      name={getIconName(item)}
                      size={20}
                      color="#fff"
                    />
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
      return "home";
    case "Rent":
      return "building";
    case "History":
      return "clock";
    case "Profile":
      return "user";
    default:
      return "question-circle";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background for a clean look
  },
  content: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0, // Adjust for the status bar height
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 75,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
  },
  navText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6C757D",
    marginTop: 4,
  },
  activeButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b668c4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeNavText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 4,
  },
});
