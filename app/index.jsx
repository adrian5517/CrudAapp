import { Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const windowWidth = Dimensions.get('window').width;

export default function Index() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/Signin");
  };

  const handleSignUp = () => {
    router.push("/CreateAccount");
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/rentify-img.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Find your perfect stay with Rentify</Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonTextAlt}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Light gray background for a clean look
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 450, // Responsive logo size
    height: 450,
    borderRadius: 12,
  },
  tagline: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280', // Neutral gray for tagline
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  signInButton: {
    backgroundColor: '#b668c4', // Bright blue for primary action
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: '#f9fafb', // Soft white for secondary action
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextAlt: {
    color: '#1f2937', // Darker gray for contrast
    fontSize: 18,
    fontWeight: '600',
  },
});
