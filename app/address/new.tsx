import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Building2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';

export default function NewAddressScreen() {
  const router = useRouter();
  const { addAddress } = useUserStore();
  
  const [addressType, setAddressType] = useState<'home' | 'work'>('home');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  const handleSave = () => {
    if (!address || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    addAddress({
      type: addressType,
      address,
      landmark,
      city,
      state,
      pincode,
      isDefault,
    });
    
    router.back();
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Address Type</Text>
        <View style={styles.addressTypeContainer}>
          <Pressable
            style={[styles.addressTypeButton, addressType === 'home' && styles.activeAddressType]}
            onPress={() => setAddressType('home')}
          >
            <Home size={20} color={addressType === 'home' ? Colors.primary : Colors.text} />
            <Text style={[styles.addressTypeText, addressType === 'home' && styles.activeAddressTypeText]}>
              Home
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.addressTypeButton, addressType === 'work' && styles.activeAddressType]}
            onPress={() => setAddressType('work')}
          >
            <Building2 size={20} color={addressType === 'work' ? Colors.primary : Colors.text} />
            <Text style={[styles.addressTypeText, addressType === 'work' && styles.activeAddressTypeText]}>
              Work
            </Text>
          </Pressable>
        </View>
        
        <Text style={styles.sectionTitle}>Address Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="House/Flat No., Building, Street"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Nearby landmark (optional)"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
          
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              placeholder="State"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pincode *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
        
        <Pressable 
          style={styles.checkboxContainer} 
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={styles.checkbox}>
            {isDefault && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </Pressable>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Save Address" 
          onPress={handleSave} 
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginRight: 12,
  },
  activeAddressType: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  addressTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
  activeAddressTypeText: {
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    padding: 16,
    marginBottom: 24,
  },
});