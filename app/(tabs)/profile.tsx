import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, MapPin, Package, CreditCard, LogOut, ChevronRight, Edit2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import Button from '@/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const { orders } = useOrderStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setIsLoggingOut(true);
            setTimeout(() => {
              logout();
              setIsLoggingOut(false);
            }, 500);
          },
        },
      ]
    );
  };
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleAddresses = () => {
    router.push('/profile/addresses');
  };
  
  const handleOrders = () => {
    router.push('/profile/orders');
  };
  
  const handlePaymentMethods = () => {
    router.push('/profile/payment-methods');
  };
  
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <User size={80} color={Colors.lightGray} />
        <Text style={styles.authTitle}>Login to your account</Text>
        <Text style={styles.authSubtitle}>
          Login to view your profile, track orders, and more
        </Text>
        <Button 
          title="Login" 
          onPress={handleLogin} 
          style={styles.loginButton}
        />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] || user?.phone?.[0] || 'U'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>
        <Pressable style={styles.editButton} onPress={handleEditProfile}>
          <Edit2 size={16} color={Colors.white} />
        </Pressable>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.addresses.length || 0}</Text>
          <Text style={styles.statLabel}>Addresses</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Pressable style={styles.menuItem} onPress={handleOrders}>
          <View style={styles.menuIconContainer}>
            <Package size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>My Orders</Text>
            <ChevronRight size={20} color={Colors.darkGray} />
          </View>
        </Pressable>
        
        <Pressable style={styles.menuItem} onPress={handleAddresses}>
          <View style={styles.menuIconContainer}>
            <MapPin size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Saved Addresses</Text>
            <ChevronRight size={20} color={Colors.darkGray} />
          </View>
        </Pressable>
        
        <Pressable style={styles.menuItem} onPress={handlePaymentMethods}>
          <View style={styles.menuIconContainer}>
            <CreditCard size={20} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Payment Methods</Text>
            <ChevronRight size={20} color={Colors.darkGray} />
          </View>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Pressable style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
});