import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image, // Import Image component
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon library

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Sign-In API Call
  const handleSignIn = async () => {
    console.log("Signing in with:", email, password);
    setLoading(true);

    try {
      const response = await fetch("https://nagamedserver.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful:", data);
        setErrorMessage("");

        if (data.token) {
          await AsyncStorage.setItem("authToken", data.token);
        }
        if (data.name) {
          await AsyncStorage.setItem("fullName", data.fullname);
        }

        router.push("/Home");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          {/* Replace text-based logo with image */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/title-logo.png")}
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.sign}>Sign In</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email" // Placeholder for email
              placeholderTextColor="#A0A0A0" // Light gray placeholder color
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.input, styles.passwordContainer]}>
              <TextInput
                style={styles.passwordField}
                placeholder="Enter your password" // Placeholder for password
                placeholderTextColor="#A0A0A0" // Light gray placeholder color
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword} // Toggle visibility
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
    marginTop: -30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 300, // Adjust width as needed
    height: 300, // Adjust height as needed
    resizeMode: "contain",
  },
  sign: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#1170B3",
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between TextInput and Icon
    paddingHorizontal: 12,
  },
  passwordField: {
    flex: 1,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 8,
  },
  signInButton: {
    backgroundColor: "#b668c4",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#28B6F6",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
