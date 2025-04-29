import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Package, Truck, Users, LogOut, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAdminStore } from '@/store/adminStore';
import { useOrderStore } from '@/store/orderStore';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminStore();
  const { orders } = useOrderStore();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed'
  ).length;
  
  const activeDeliveries = orders.filter(order => 
    order.status === 'preparing' || order.status === 'out_for_delivery'
  ).length;

  const handleLogout = () => {
    logout();
    router.replace('/admin');
  };

  const navigateTo = (route: string) => {
    router.push(route);
  };

  if (!isAuthenticated) return null;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Admin Dashboard',
        headerRight: () => (
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={Colors.white} />
          </Pressable>
        ),
      }} />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, Admin</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${Colors.primary}20` }]}>
            <Package size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${Colors.info}20` }]}>
            <Truck size={24} color={Colors.info} />
          </View>
          <Text style={styles.statValue}>{activeDeliveries}</Text>
          <Text style={styles.statLabel}>Active Deliveries</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: `${Colors.success}20` }]}>
            <Users size={24} color={Colors.success} />
          </View>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Management</Text>
        
        <Pressable 
          style={styles.menuItem} 
          onPress={() => navigateTo('/admin/orders')}
        >
          <View style={styles.menuIconContainer}>
            <Package size={20} color={Colors.secondary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Order Management</Text>
            <ChevronRight size={20} color={Colors.darkGray} />
          </View>
        </Pressable>
        
        <Pressable 
          style={styles.menuItem} 
          onPress={() => navigateTo('/admin/delivery-personnel')}
        >
          <View style={styles.menuIconContainer}>
            <Truck size={20} color={Colors.secondary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Delivery Personnel</Text>
            <ChevronRight size={20} color={Colors.darkGray} />
          </View>
        </Pressable>
      </View>
      
      <View style={styles.recentOrdersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Pressable onPress={() => navigateTo('/admin/orders')}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        
        {orders.length > 0 ? (
          orders.slice(0, 3).map(order => (
            <Pressable 
              key={order.id} 
              style={styles.orderItem}
              onPress={() => navigateTo(`/admin/order/${order.id}`)}
            >
              <View>
                <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.orderStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
                <ChevronRight size={16} color={Colors.darkGray} />
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders available</Text>
        )}
      </View>
    </ScrollView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return `${Colors.darkGray}20`;
    case 'confirmed':
      return `${Colors.info}20`;
    case 'preparing':
      return `${Colors.warning}20`;
    case 'out_for_delivery':
      return `${Colors.primary}20`;
    case 'delivered':
      return `${Colors.success}20`;
    case 'cancelled':
      return `${Colors.error}20`;
    default:
      return `${Colors.darkGray}20`;
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoutButton: {
    marginRight: 16,
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 16,
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
    backgroundColor: `${Colors.secondary}10`,
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
  recentOrdersSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.subtext,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  noOrdersText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    paddingVertical: 16,
  },
});