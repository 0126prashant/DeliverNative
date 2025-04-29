import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithPhone, isLoading } = useUserStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handleBack = () => {
    router.back();
  };
  
  const handleContinue = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      await loginWithPhone(phoneNumber);
      router.push({
        pathname: '/verify-otp',
        params: { phone: phoneNumber }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color={Colors.text} />
      </Pressable>
      
      <View style={styles.content}>
        <Text style={styles.title}>Login to your account</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to receive a verification code
        </Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          disabled={phoneNumber.length !== 10 || isLoading}
          loading={isLoading}
          fullWidth
          style={styles.continueButton}
        />
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  countryCode: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRightWidth: 0,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  continueButton: {
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
  },
});