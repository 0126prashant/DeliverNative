import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const { verifyOtp, isLoading, isAuthenticated } = useUserStore();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendOtp = () => {
    if (!canResend) return;
    
    setCanResend(false);
    setTimer(30);
    
    // Simulate OTP resend
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number.');
    
    // Restart timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }
    
    try {
      await verifyOtp(otpString);
      // Navigation is handled by the useEffect that watches isAuthenticated
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color={Colors.text} />
      </Pressable>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to {phone}
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={styles.otpInput}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        
        <Button 
          title="Verify" 
          onPress={handleVerify} 
          disabled={otp.join('').length !== 4 || isLoading}
          loading={isLoading}
          fullWidth
          style={styles.verifyButton}
        />
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <Pressable onPress={handleResendOtp} disabled={!canResend}>
            <Text style={[styles.resendAction, !canResend && styles.resendDisabled]}>
              {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
            </Text>
          </Pressable>
        </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  resendAction: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  resendDisabled: {
    color: Colors.darkGray,
  },
});