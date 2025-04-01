import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookNewRide = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { driver } = route.params || {}; // Get selected driver

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  // Handle booking a ride
  const handleBookRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Error', 'Please enter both pickup and drop-off locations.');
      return;
    }

    const newRide = {
      driver: driver?.name || 'Unknown Driver',
      car: driver?.car || 'Unknown Car',
      pickupLocation,
      dropoffLocation,
    };

    try {
      const storedRides = await AsyncStorage.getItem('rides');
      const rides = storedRides ? JSON.parse(storedRides) : [];
      rides.push(newRide);
      await AsyncStorage.setItem('rides', JSON.stringify(rides)); // Save to storage
    } catch (error) {
      console.error("Error saving ride:", error);
    }

    Alert.alert('Success', 'Your ride has been booked!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home'), // Navigate back to Home
      },
    ]);

    // Reset fields
    setPickupLocation('');
    setDropoffLocation('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>

      {driver && (
        <View style={styles.driverInfo}>
          <Text style={styles.label}>Driver: {driver.name}</Text>
          <Text style={styles.label}>Car: {driver.car}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickupLocation}
          onChangeText={setPickupLocation}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Drop-off Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter drop-off location"
          value={dropoffLocation}
          onChangeText={setDropoffLocation}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleBookRide}>
        <Text style={styles.buttonText}>Confirm Ride</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookNewRide;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA', 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1A1A1A', 
    marginBottom: 24,
    marginTop: 12
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    color: '#666666', 
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  driverInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
