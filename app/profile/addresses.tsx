import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import AddressCard from '@/components/AddressCard';
import Button from '@/components/Button';

export default function AddressesScreen() {
  const { select } = useLocalSearchParams<{ select?: string }>();
  const router = useRouter();
  const { user, deleteAddress, setDefaultAddress } = useUserStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const isSelecting = select === 'true';
  
  const handleAddAddress = () => {
    router.push('/address/new');
  };
  
  const handleEditAddress = (addressId: string) => {
    router.push(`/address/edit/${addressId}`);
  };
  
  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAddress(addressId);
          },
        },
      ]
    );
  };
  
  const handleSelectAddress = (addressId: string) => {
    if (isSelecting) {
      setSelectedAddressId(addressId);
    }
  };
  
  const handleConfirmSelection = () => {
    if (selectedAddressId) {
      setDefaultAddress(selectedAddressId);
      router.back();
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: isSelecting ? 'Select Address' : 'Saved Addresses',
        headerRight: isSelecting ? undefined : () => (
          <Button 
            title="Add New" 
            onPress={handleAddAddress} 
            variant="outline"
            size="small"
            style={styles.headerButton}
          />
        ),
      }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {user?.addresses && user.addresses.length > 0 ? (
          <View style={styles.addressesContainer}>
            {user.addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                selected={isSelecting && selectedAddressId === address.id}
                onSelect={() => handleSelectAddress(address.id)}
                onEdit={() => handleEditAddress(address.id)}
                onDelete={() => handleDeleteAddress(address.id)}
                selectable={isSelecting}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any saved addresses yet</Text>
          </View>
        )}
      </ScrollView>
      
      {!isSelecting && (
        <View style={styles.footer}>
          <Button 
            title="Add New Address" 
            onPress={handleAddAddress} 
            fullWidth
            icon={Plus}
          />
        </View>
      )}
      
      {isSelecting && (
        <View style={styles.footer}>
          <Button 
            title="Confirm Selection" 
            onPress={handleConfirmSelection} 
            fullWidth
            disabled={!selectedAddressId}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  addressesContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});