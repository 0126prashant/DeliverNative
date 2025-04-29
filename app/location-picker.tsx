import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Navigation, ChevronRight } from 'lucide-react-native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';

export default function LocationPickerScreen() {
  const router = useRouter();
  const { updateUserProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [addresses, setAddresses] = useState<Location.LocationGeocodedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Location.LocationGeocodedAddress | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // Get address from coordinates
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        setAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
        }
      } catch (error) {
        setErrorMsg('Could not fetch location. Please try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSelectLocation = () => {
    if (selectedAddress) {
      // Format the address
      const formattedAddress = [
        selectedAddress.name,
        selectedAddress.street,
        selectedAddress.city,
        selectedAddress.region,
        selectedAddress.postalCode,
        selectedAddress.country
      ].filter(Boolean).join(', ');
      
      // Update user's location
      updateUserProfile({ 
        currentLocation: {
          address: formattedAddress,
          coords: location?.coords
        }
      });
      
      router.back();
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch current location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: Location.LocationGeocodedAddress) => {
    return [
      address.name,
      address.street,
      address.city,
      address.region,
      address.postalCode
    ].filter(Boolean).join(', ');
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Select Location' }} />
        <View style={styles.webNotice}>
          <MapPin size={40} color={Colors.primary} />
          <Text style={styles.webNoticeTitle}>Location Services</Text>
          <Text style={styles.webNoticeText}>
            Location services are limited on web. Please use the mobile app for full functionality.
          </Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.webButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Select Location' }} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching your location...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button 
            title="Try Again" 
            onPress={handleUseCurrentLocation} 
            style={styles.tryAgainButton}
          />
        </View>
      ) : (
        <>
          <View style={styles.currentLocationButton}>
            <Pressable style={styles.currentLocationContent} onPress={handleUseCurrentLocation}>
              <Navigation size={20} color={Colors.primary} />
              <Text style={styles.currentLocationText}>Use current location</Text>
            </Pressable>
          </View>
          
          <Text style={styles.sectionTitle}>Select an address</Text>
          
          <ScrollView style={styles.addressList}>
            {addresses.map((address, index) => (
              <Pressable 
                key={index}
                style={[
                  styles.addressItem,
                  selectedAddress === address && styles.selectedAddressItem
                ]}
                onPress={() => setSelectedAddress(address)}
              >
                <View style={styles.addressContent}>
                  <MapPin 
                    size={20} 
                    color={selectedAddress === address ? Colors.primary : Colors.darkGray} 
                  />
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressText}>{formatAddress(address)}</Text>
                  </View>
                </View>
                {selectedAddress === address && (
                  <ChevronRight size={20} color={Colors.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
          
          <View style={styles.footer}>
            <Button 
              title="Confirm Location" 
              onPress={handleSelectLocation} 
              disabled={!selectedAddress}
              fullWidth
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.subtext,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  tryAgainButton: {
    marginTop: 16,
  },
  currentLocationButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currentLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 16,
  },
  addressList: {
    flex: 1,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedAddressItem: {
    backgroundColor: `${Colors.primary}10`,
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webNoticeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  webNoticeText: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  webButton: {
    marginTop: 16,
  },
});