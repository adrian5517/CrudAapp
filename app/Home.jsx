import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [rides, setRides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRideIndex, setSelectedRideIndex] = useState(null);
  const [updatedPickup, setUpdatedPickup] = useState('');
  const [updatedDropoff, setUpdatedDropoff] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadRides = async () => {
        try {
          const storedRides = await AsyncStorage.getItem('rides');
          if (storedRides) {
            setRides(JSON.parse(storedRides));
          }
        } catch (error) {
          console.error("Error loading rides:", error);
        }
      };
      loadRides();
    }, [])
  );

  const handleEditRide = (index) => {
    setSelectedRideIndex(index);
    setUpdatedPickup(rides[index].pickupLocation);
    setUpdatedDropoff(rides[index].dropoffLocation);
    setModalVisible(true);
  };

  const saveUpdatedRide = async () => {
    if (!updatedPickup || !updatedDropoff) {
      Alert.alert('Error', 'Pickup and Drop-off locations cannot be empty.');
      return;
    }

    let updatedRides = [...rides];
    updatedRides[selectedRideIndex] = {
      ...updatedRides[selectedRideIndex],
      pickupLocation: updatedPickup,
      dropoffLocation: updatedDropoff,
    };

    setRides(updatedRides);
    await AsyncStorage.setItem('rides', JSON.stringify(updatedRides));

    Alert.alert('Success', 'Ride updated successfully!', [
      { text: 'OK', onPress: () => setModalVisible(false) }
    ]);
  };

  const markRideAsCompleted = async () => {
    let updatedRides = [...rides];
    const completedRide = {
      ...updatedRides[selectedRideIndex],
      status: 'completed', // Changed from 'Completed'
      date: new Date().toLocaleString(),
    };

    // Remove from current rides
    updatedRides = updatedRides.filter((_, index) => index !== selectedRideIndex);
    setRides(updatedRides);
    await AsyncStorage.setItem('rides', JSON.stringify(updatedRides));

    // Add to ride history
    try {
      const storedHistory = await AsyncStorage.getItem('rideHistory');
      const rideHistory = storedHistory ? JSON.parse(storedHistory) : [];
      rideHistory.push(completedRide);
      await AsyncStorage.setItem('rideHistory', JSON.stringify(rideHistory));
    } catch (error) {
      console.error("Error saving to history:", error);
    }

    Alert.alert('Success', 'Ride marked as completed!', [
      { text: 'OK', onPress: () => setModalVisible(false) }
    ]);
  };

  const deleteRide = async () => {
    let updatedRides = [...rides];
    const canceledRide = {
      ...updatedRides[selectedRideIndex],
      status: 'canceled', // Changed from 'Canceled'
      date: new Date().toLocaleString(),
    };

    // Remove from current rides
    updatedRides = updatedRides.filter((_, index) => index !== selectedRideIndex);
    setRides(updatedRides);
    await AsyncStorage.setItem('rides', JSON.stringify(updatedRides));

    // Add to ride history
    try {
      const storedHistory = await AsyncStorage.getItem('rideHistory');
      const rideHistory = storedHistory ? JSON.parse(storedHistory) : [];
      rideHistory.push(canceledRide);
      await AsyncStorage.setItem('rideHistory', JSON.stringify(rideHistory));
    } catch (error) {
      console.error("Error saving to history:", error);
    }

    Alert.alert('Success', 'Ride canceled successfully!', [
      { text: 'OK', onPress: () => setModalVisible(false) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Upcoming Rides</Text>

      <ScrollView style={styles.scrollContainer}>
        {rides.length > 0 ? (
          rides.map((ride, index) => (
            <TouchableOpacity key={index} style={styles.rideCard} onPress={() => handleEditRide(index)}>
              <Text style={styles.rideText}>Driver: {ride.driver}</Text>
              <Text style={styles.rideText}>Car: {ride.car}</Text>
              <Text style={styles.rideText}>Pickup: {ride.pickupLocation}</Text>
              <Text style={styles.rideText}>Drop-off: {ride.dropoffLocation}</Text>
              <Text style={styles.rideEditText}>Tap to Edit</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyStateText}>No upcoming rides.</Text>
        )}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Ride Details</Text>

            <Text style={styles.label}>Pickup Location</Text>
            <TextInput
              style={styles.input}
              value={updatedPickup}
              onChangeText={setUpdatedPickup}
              placeholder="Enter new pickup location"
            />

            <Text style={styles.label}>Drop-off Location</Text>
            <TextInput
              style={styles.input}
              value={updatedDropoff}
              onChangeText={setUpdatedDropoff}
              placeholder="Enter new drop-off location"
            />

            <View style={styles.buttonGrid}>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={saveUpdatedRide}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.successButton]} 
                  onPress={markRideAsCompleted}
                >
                  <Text style={styles.buttonText}>Success</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.deleteButton]} 
                  onPress={deleteRide}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.closeButton]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  rideCard: {
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
  rideText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },
  rideEditText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    color: "#333333",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  buttonGrid: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  successButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  closeButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;