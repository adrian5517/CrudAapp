import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookNewAccommodation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { room } = route.params || {}; // Get selected room details

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false); // Control check-in calendar visibility
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false); // Control check-out calendar visibility
  const [showCheckInTime, setShowCheckInTime] = useState(false);
  const [showCheckOutTime, setShowCheckOutTime] = useState(false);

  const handleBookAccommodation = async () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Error', 'Please select both check-in and check-out dates and times.');
      return;
    }

    const now = new Date();
    if (checkInTime < now || checkOutTime < now) {
      Alert.alert('Error', 'Check-in and check-out times must be in the future.');
      return;
    }

    const newBooking = {
      name: room?.name || 'Unknown Room',
      type: room?.type || 'Unknown Type',
      price: room?.price || 'Unknown Price',
      location: room?.location || 'Unknown Location',
      bookingDate: `${checkInDate} ${checkInTime.toLocaleTimeString()}`,
      status: 'booked', // Add status field
    };

    try {
      const storedProperties = await AsyncStorage.getItem('properties');
      const properties = storedProperties ? JSON.parse(storedProperties) : [];
      properties.push(newBooking);
      await AsyncStorage.setItem('properties', JSON.stringify(properties)); // Save to storage
    } catch (error) {
      console.error("Error saving booking:", error);
    }

    Alert.alert('Success', 'Your accommodation has been booked!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home'), // Navigate back to Home
      },
    ]);

    // Reset fields
    setCheckInDate('');
    setCheckOutDate('');
    setCheckInTime(new Date());
    setCheckOutTime(new Date());
  };

  const onChangeCheckInTime = (event, selectedDate) => {
    const currentDate = selectedDate || checkInTime;
    setShowCheckInTime(false);

    if (currentDate < new Date()) {
      Alert.alert('Error', 'Check-in time must be in the future.');
      return;
    }

    setCheckInTime(currentDate);
  };

  const onChangeCheckOutTime = (event, selectedDate) => {
    const currentDate = selectedDate || checkOutTime;
    setShowCheckOutTime(false);

    if (currentDate < new Date()) {
      Alert.alert('Error', 'Check-out time must be in the future.');
      return;
    }

    setCheckOutTime(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Accommodation</Text>

      {room && (
        <View style={styles.roomInfo}>
          <Text style={styles.label}>Room: {room.name}</Text>
          <Text style={styles.label}>Type: {room.type}</Text>
          <Text style={styles.label}>Price: {room.price}</Text>
          <Text style={styles.label}>Location: {room.location}</Text>
        </View>
      )}

      {/* Calendar for Check-in Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Check-in Date</Text>
        <TouchableOpacity onPress={() => setShowCheckInCalendar(true)}>
          <Text style={styles.input}>
            {checkInDate || 'Select Check-in Date'}
          </Text>
        </TouchableOpacity>
        {showCheckInCalendar && (
          <Calendar
            markedDates={{ [checkInDate]: { selected: true, selectedColor: '#4CAF50' } }}
            onDayPress={(day) => {
              setCheckInDate(day.dateString);
              setShowCheckInCalendar(false); // Hide calendar after selecting a date
            }}
          />
        )}
      </View>

      {/* Calendar for Check-out Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Check-out Date</Text>
        <TouchableOpacity onPress={() => setShowCheckOutCalendar(true)}>
          <Text style={styles.input}>
            {checkOutDate || 'Select Check-out Date'}
          </Text>
        </TouchableOpacity>
        {showCheckOutCalendar && (
          <Calendar
            markedDates={{ [checkOutDate]: { selected: true, selectedColor: '#4CAF50' } }}
            onDayPress={(day) => {
              setCheckOutDate(day.dateString);
              setShowCheckOutCalendar(false); // Hide calendar after selecting a date
            }}
          />
        )}
      </View>

      {/* Time Picker for Check-in */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Check-in Time</Text>
        <TouchableOpacity onPress={() => setShowCheckInTime(true)}>
          <Text style={styles.input}>
            {checkInTime.toLocaleTimeString() || 'Select Check-in Time'}
          </Text>
        </TouchableOpacity>
        {showCheckInTime && (
          <DateTimePicker
            value={checkInTime}
            mode="time"
            is24Hour={true}
            onChange={onChangeCheckInTime}
          />
        )}
      </View>

      {/* Time Picker for Check-out */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Check-out Time</Text>
        <TouchableOpacity onPress={() => setShowCheckOutTime(true)}>
          <Text style={styles.input}>
            {checkOutTime.toLocaleTimeString() || 'Select Check-out Time'}
          </Text>
        </TouchableOpacity>
        {showCheckOutTime && (
          <DateTimePicker
            value={checkOutTime}
            mode="time"
            is24Hour={true}
            onChange={onChangeCheckOutTime}
          />
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleBookAccommodation}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookNewAccommodation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 24,
    marginTop: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  roomInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
