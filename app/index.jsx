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
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/eyytrike-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.signUpButton]} onPress={handleSignUp}>
          <Text style={styles.buttonTextAlt}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Light background color
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40, // Slightly reduced for balance
  },
  logo: {
    maxWidth: 300,
    maxHeight: 300, 
    borderRadius: 12, // Rounded logo edges
  },
  buttonContainer: {
    width: '100%',
    gap: 20, // Spacing between buttons
  },
  signInButton: {
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 25, // Fully rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 20, // Additional padding for touch size
  },
  signUpButton: {
    backgroundColor: '#f1f5f9', // Soft light gray
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db', // Soft border color
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600', // Slightly bold
  },
  buttonTextAlt: {
    color: '#1e293b', // Darker text color for contrast
    fontSize: 18,
    fontWeight: '600',
  },
});
