import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Navigation, ChevronRight, Edit2, Check, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';

export default function LocationPickerScreen() {
  const router = useRouter();
  const { updateUserProfile, user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [addresses, setAddresses] = useState<Location.LocationGeocodedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Location.LocationGeocodedAddress | null>(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

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
          setCustomAddress(formatAddress(addresses[0]));
        }
      } catch (error) {
        setErrorMsg('Could not fetch location. Please try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSelectLocation = () => {
    if (selectedAddress || customAddress) {
      // Determine which address to use - custom or selected
      const formattedAddress = editingAddress || !selectedAddress
        ? customAddress
        : formatAddress(selectedAddress);
      
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
        setCustomAddress(formatAddress(addresses[0]));
        setEditingAddress(false);
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

  const toggleEditAddress = () => {
    if (editingAddress) {
      // If we're saving, keep the custom address
      setEditingAddress(false);
    } else {
      // If we're starting to edit, initialize with current address
      if (selectedAddress && !customAddress) {
        setCustomAddress(formatAddress(selectedAddress));
      }
      setEditingAddress(true);
    }
  };

  const cancelEditAddress = () => {
    if (selectedAddress) {
      setCustomAddress(formatAddress(selectedAddress));
    }
    setEditingAddress(false);
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
          <Text style={styles.loadingText}>Detecting your location...</Text>
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
          <View style={styles.addressContainer}>
            {/* Current Location Button */}
            <Pressable style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
              <View style={styles.currentLocationContent}>
                <Navigation size={20} color={Colors.primary} />
                <Text style={styles.currentLocationText}>Use current location</Text>
              </View>
            </Pressable>

            <Text style={styles.sectionTitle}>Your Location</Text>
            
            {editingAddress ? (
              <View style={styles.editAddressContainer}>
                <TextInput
                  style={styles.addressInput}
                  value={customAddress}
                  onChangeText={setCustomAddress}
                  multiline
                  placeholder="Enter your complete address"
                />
                <View style={styles.editButtonsRow}>
                  <Pressable onPress={cancelEditAddress} style={styles.cancelButton}>
                    <X size={18} color={Colors.error} />
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={toggleEditAddress} style={styles.saveButton}>
                    <Check size={18} color={Colors.white} />
                    <Text style={styles.saveText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.selectedAddressContainer}>
                <View style={styles.addressContent}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={styles.addressText}>
                    {customAddress || (selectedAddress ? formatAddress(selectedAddress) : 'No address selected')}
                  </Text>
                </View>
                <Pressable onPress={toggleEditAddress} style={styles.editButton}>
                  <Edit2 size={16} color={Colors.primary} />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>
            )}

            {addresses.length > 0 && !editingAddress && (
              <>
                <Text style={styles.sectionSubtitle}>Nearby Addresses</Text>
                <ScrollView style={styles.addressList}>
                  {addresses.map((address, index) => (
                    <Pressable 
                      key={index}
                      style={[
                        styles.addressItem,
                        selectedAddress === address && styles.selectedAddressItem
                      ]}
                      onPress={() => {
                        setSelectedAddress(address);
                        setCustomAddress(formatAddress(address));
                      }}
                    >
                      <View style={styles.addressItemContent}>
                        <MapPin 
                          size={20} 
                          color={selectedAddress === address ? Colors.primary : Colors.darkGray} 
                        />
                        <View style={styles.addressDetails}>
                          <Text style={styles.addressItemText}>{formatAddress(address)}</Text>
                        </View>
                      </View>
                      {selectedAddress === address && (
                        <ChevronRight size={20} color={Colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
            
            <Text style={styles.helpText}>
              You can use your current location or enter a custom address manually.
            </Text>
            
            <Button 
              title="Confirm Location" 
              onPress={handleSelectLocation} 
              disabled={!selectedAddress && !customAddress}
              fullWidth
              style={styles.confirmButton}
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
  addressContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  currentLocationButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  selectedAddressContainer: {
    flexDirection: 'row',
    backgroundColor: `${Colors.primary}10`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    padding: 6,
  },
  editText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  editAddressContainer: {
    backgroundColor: `${Colors.primary}10`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addressInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  cancelText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  addressList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  addressItemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedAddressItem: {
    backgroundColor: `${Colors.primary}10`,
  },
  helpText: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 16,
    marginTop: 8,
  },
  confirmButton: {
    marginTop: 'auto',
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