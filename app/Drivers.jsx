import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Drivers = () => {
  const navigation = useNavigation();
  const drivers = [
    { name: 'John Doe', car: 'Toyota Vios - ABC1234' },
    { name: 'Michael Smith', car: 'Honda Civic - XYZ5678' },
    { name: 'Sarah Johnson', car: 'Ford Ranger - LMN9101' },
    { name: 'Emily Davis', car: 'Nissan Altima - QRS2345' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Drivers</Text>
      <ScrollView style={styles.scrollContainer}>
        {drivers.map((driver, index) => (
          <View key={index} style={styles.driverCard}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.carText}>{driver.car}</Text>
            <HoverableButton
              onPress={() => navigation.navigate('BookNewRide', { driver })}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const HoverableButton = ({ onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.bookButton,
        isHovered && { backgroundColor: "#34495E" }, // Lighter navy blue for hover effect
      ]}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>Book Ride</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 24,
    marginTop: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  carText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: "#2C3E50", // Dark navy blue for default state
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Ensures text visibility
  },
});

export default Drivers;
