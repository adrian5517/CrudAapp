import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideHistory = () => {
  const [activeTab, setActiveTab] = useState('completed');
  const [successRides, setSuccessRides] = useState([]);
  const [canceledRides, setCanceledRides] = useState([]);

  useEffect(() => {
    loadRideHistory();
  }, []);

  const loadRideHistory = async () => {
    try {
      const storedRides = await AsyncStorage.getItem('rideHistory');
      if (storedRides) {
        const rides = JSON.parse(storedRides);
        setSuccessRides(rides.filter(ride => ride.status === 'completed'));
        setCanceledRides(rides.filter(ride => ride.status === 'canceled'));
      }
    } catch (error) {
      console.error("Error loading ride history:", error);
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const RideCard = ({ ride }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideCardHeader}>
        <Text style={[
          styles.statusIndicator, 
          { color: ride.status === 'completed' ? '#4CAF50' : '#F44336' }
        ]}>●</Text>
        <Text style={styles.dateText}>{ride.date}</Text>
      </View>
      <View style={styles.rideCardContent}>
        <View style={styles.rideInfo}>
          <Text style={styles.driverName}>{ride.driver}</Text>
          <Text style={styles.carInfo}>{ride.car}</Text>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.dot} />
            <Text style={styles.locationText}>{ride.pickupLocation}</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.locationRow}>
            <View style={[styles.dot, styles.destinationDot]} />
            <Text style={styles.locationText}>{ride.dropoffLocation}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Ride History</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'completed' && styles.activeTab]}
          onPress={() => handleTabPress('completed')}
        >
          <Text style={styles.tabText}>Completed</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: '#4CAF50' }]}>
              {successRides.length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'canceled' && styles.activeTab]}
          onPress={() => handleTabPress('canceled')}
        >
          <Text style={styles.tabText}>Canceled</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: '#F44336' }]}>
              {canceledRides.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.ridesContainer}>
        {activeTab === 'completed' ? 
          successRides.map((ride, index) => (
            <RideCard key={`success-${index}`} ride={ride} />
          ))
          :
          canceledRides.map((ride, index) => (
            <RideCard key={`canceled-${index}`} ride={ride} />
          ))
        }
        {((activeTab === 'completed' && successRides.length === 0) ||
          (activeTab === 'canceled' && canceledRides.length === 0)) && (
          <Text style={styles.emptyStateText}>No {activeTab} rides found.</Text>
        )}
      </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
  ridesContainer: {
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
  rideCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    color: '#4CAF50',
    marginRight: 8,
    fontSize: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  rideCardContent: {
    gap: 16,
  },
  rideInfo: {
    marginBottom: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  carInfo: {
    fontSize: 14,
    color: "#666666",
  },
  locationContainer: {
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  verticalLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#F5F6FA',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 24,
  },
});

export default RideHistory;