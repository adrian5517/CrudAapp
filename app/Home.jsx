import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedBookingDate, setUpdatedBookingDate] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadProperties = async () => {
        try {
          const storedProperties = await AsyncStorage.getItem('properties');
          console.log("Stored Properties:", storedProperties); // Debugging line
          if (storedProperties) {
            setProperties(JSON.parse(storedProperties));
          } else {
            // If no properties are found, set some sample properties
            const sampleProperties = [
              {
                name: 'Property 1',
                type: 'Hotel',
                location: 'Location 1',
                price: '1000',
                bookingDate: '2023-04-05',
                status: 'booked', // Ensure status is included
              },
              {
                name: 'Property 2',
                type: 'Apartment',
                location: 'Location 2',
                price: '2000',
                bookingDate: '2023-04-06',
                status: 'booked', // Ensure status is included
              }
            ];
            await AsyncStorage.setItem('properties', JSON.stringify(sampleProperties));
            setProperties(sampleProperties); // Adding sample properties if empty
          }
        } catch (error) {
          console.error("Error loading properties:", error);
        }
      };
      loadProperties();
    }, [])
  );

  const handleEditProperty = (index) => {
    setSelectedPropertyIndex(index);
    setUpdatedPrice(properties[index].price);
    setUpdatedBookingDate(properties[index].bookingDate);
    setModalVisible(true);
  };

  const saveUpdatedProperty = async () => {
    if (!updatedPrice || !updatedBookingDate) {
      Alert.alert('Error', 'Price and Booking Date cannot be empty.');
      return;
    }

    let updatedProperties = [...properties];
    updatedProperties[selectedPropertyIndex] = {
      ...updatedProperties[selectedPropertyIndex],
      price: updatedPrice,
      bookingDate: updatedBookingDate,
    };

    setProperties(updatedProperties);
    await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));

    Alert.alert('Success', 'Property details updated successfully!', [
      { text: 'OK', onPress: () => setModalVisible(false) }
    ]);
  };

  const deleteProperty = async () => {
    if (selectedPropertyIndex === null) {
      Alert.alert('Error', 'No property selected to cancel.');
      return;
    }

    let updatedProperties = [...properties];
    const canceledProperty = {
      ...updatedProperties[selectedPropertyIndex],
      status: 'canceled',
      date: new Date().toLocaleString(),
    };

    // Remove from current properties
    updatedProperties = updatedProperties.filter((_, index) => index !== selectedPropertyIndex);
    setProperties(updatedProperties); // Update the state to refresh the UI
    await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));

    // Add to property history
    try {
      const storedHistory = await AsyncStorage.getItem('propertyHistory');
      const propertyHistory = storedHistory ? JSON.parse(storedHistory) : [];
      propertyHistory.push(canceledProperty); // Add the canceled property to history
      await AsyncStorage.setItem('propertyHistory', JSON.stringify(propertyHistory));

      Alert.alert('Success', 'Property has been canceled and added to history.', [
        { text: 'OK', onPress: () => {
          setModalVisible(false); // Close the modal
          setSelectedPropertyIndex(null); // Reset the selected property index
        }}
      ]);
    } catch (error) {
      console.error("Error saving to property history:", error);
    }
  };

  const handleCancelProperty = (index) => {
    setSelectedPropertyIndex(index); // Set the selected property index
    deleteProperty(); // Call the deleteProperty function
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Booked Properties</Text>
      <ScrollView>
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <View key={index} style={styles.propertyCard}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.propertyType}>{property.type}</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>
              <Text style={styles.propertyPrice}>{property.price}</Text>
              <Text style={styles.propertyBookingDate}>Booked on: {property.bookingDate}</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => handleEditProperty(index)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleCancelProperty(index)} // Pass the index to handleCancelProperty
              >
                <Text style={styles.deleteButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyStateText}>No properties booked.</Text>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Property</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Update Price"
              value={updatedPrice}
              onChangeText={setUpdatedPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Update Booking Date"
              value={updatedBookingDate}
              onChangeText={setUpdatedBookingDate}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={saveUpdatedProperty}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F9FAFB', // Softer background color
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center', // Center the header
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Increased shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  propertyName: {
    fontSize: 20, // Larger font size
    fontWeight: '700',
    color: '#1A1A1A',
  },
  propertyType: {
    fontSize: 14,
    color: '#888888', // Softer text color
  },
  propertyLocation: {
    fontSize: 14,
    color: '#888888', // Softer text color
  },
  propertyPrice: {
    fontSize: 18, // Larger font size
    fontWeight: '600',
    color: '#2C3E50',
  },
  propertyBookingDate: {
    fontSize: 14,
    color: '#888888', // Softer text color
  },
  editButton: {
    backgroundColor: '#b668c4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fbf1ef',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor:'#e57373',
    borderWidth: 1,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%', // Increased width for better spacing
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22, // Larger font size
    fontWeight: '700',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    padding: 14, // Increased padding
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;