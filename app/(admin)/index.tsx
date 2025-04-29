import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Lock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      await login(username, password);
      router.replace('/admin/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Admin Login' }} />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={40} color={Colors.secondary} />
        </View>
        
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to access the admin dashboard
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <Button 
          title="Login" 
          onPress={handleLogin} 
          loading={isLoading}
          disabled={isLoading || !username || !password}
          fullWidth
          style={styles.loginButton}
        />
        
        <Text style={styles.helpText}>
          For demo purposes, use: admin / admin123
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 32,
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
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 12,
  },
  helpText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginTop: 24,
  },
});