import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useUserStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    
    // Validate email format
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({ name, email });
      setIsLoading(false);
      router.back();
    }, 500);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user?.phone || ''}
            editable={false}
          />
          <Text style={styles.helperText}>Phone number cannot be changed</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Save Changes" 
          onPress={handleSave} 
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />
      </View>
    </View>
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
  inputContainer: {
    marginBottom: 20,
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
    paddingVertical: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: Colors.lightGray,
    color: Colors.subtext,
  },
  helperText: {
    fontSize: 12,
    color: Colors.subtext,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});