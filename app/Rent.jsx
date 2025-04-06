import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Accommodations = () => {
  const navigation = useNavigation();
  const rooms = [
    { name: 'Cozy Studio Apartment', type: 'Studio', price: '₱1,500/night', location: 'Downtown Naga' },
    { name: 'Affordable Boarding House', type: 'Boarding House', price: '₱3,000/month', location: 'Naga City Center' },
    { name: 'Comfortable Motel Room', type: 'Motel', price: '₱1,200/night', location: 'Consolacion, Naga' },
    { name: 'Spacious Apartment', type: 'Apartment', price: '₱2,500/night', location: 'Pili, CamSur' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Accommodations</Text>
      <ScrollView style={styles.scrollContainer}>
        {rooms.map((room, index) => (
          <View key={index} style={styles.roomCard}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomType}>{room.type}</Text>
            <Text style={styles.roomPrice}>{room.price}</Text>
            <Text style={styles.roomLocation}>{room.location}</Text>
            <HoverableButton
              onPress={() => navigation.navigate('BookNewRide', { room })}
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
      <Text style={styles.buttonText}>Book Now</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Softer background color
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 24,
    marginTop: 12,
    textAlign: "center", // Center the header
  },
  scrollContainer: {
    flex: 1,
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Increased shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  roomName: {
    fontSize: 20, // Larger font size
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: "#888888", // Softer text color
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 18, // Larger font size
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  roomLocation: {
    fontSize: 14,
    color: "#888888", // Softer text color
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: "#b668c4", // Dark navy blue for default state
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Ensures text visibility
  },
});

export default Accommodations;
