import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronRight, Filter } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types';

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [filter, setFilter] = useState<string | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  const filteredOrders = filter 
    ? orders.filter(order => order.status === filter)
    : orders;

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/admin/order/${orderId}`);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const applyFilter = (status: string | null) => {
    setFilter(status);
    setShowFilterOptions(false);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Pressable 
      style={styles.orderItem}
      onPress={() => navigateToOrderDetails(item.id)}
    >
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <View style={styles.orderDetails}>
          <Text style={styles.orderAmount}>₹{item.totalAmount}</Text>
          <Text style={styles.orderItems}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderStatus}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusTextColor(item.status) }
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        <ChevronRight size={16} color={Colors.darkGray} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Order Management',
        headerRight: () => (
          <Pressable onPress={toggleFilterOptions} style={styles.filterButton}>
            <Filter size={20} color={Colors.white} />
          </Pressable>
        ),
      }} />
      
      {filter && (
        <View style={styles.activeFilterContainer}>
          <Text style={styles.activeFilterText}>
            Filtered by: {getStatusText(filter)}
          </Text>
          <Pressable onPress={() => applyFilter(null)}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </Pressable>
        </View>
      )}
      
      {showFilterOptions && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterTitle}>Filter by Status</Text>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter(null)}
          >
            <Text style={[
              styles.filterOptionText,
              filter === null && styles.activeFilterOption
            ]}>
              All Orders
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('pending')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'pending' && styles.activeFilterOption
            ]}>
              Pending
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('confirmed')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'confirmed' && styles.activeFilterOption
            ]}>
              Confirmed
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('preparing')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'preparing' && styles.activeFilterOption
            ]}>
              Preparing
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('out_for_delivery')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'out_for_delivery' && styles.activeFilterOption
            ]}>
              Out for Delivery
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('delivered')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'delivered' && styles.activeFilterOption
            ]}>
              Delivered
            </Text>
          </Pressable>
          <Pressable 
            style={styles.filterOption} 
            onPress={() => applyFilter('cancelled')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'cancelled' && styles.activeFilterOption
            ]}>
              Cancelled
            </Text>
          </Pressable>
        </View>
      )}
      
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      )}
    </View>
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

function getStatusTextColor(status: string): string {
  switch (status) {
    case 'pending':
      return Colors.darkGray;
    case 'confirmed':
      return Colors.info;
    case 'preparing':
      return Colors.warning;
    case 'out_for_delivery':
      return Colors.primary;
    case 'delivered':
      return Colors.success;
    case 'cancelled':
      return Colors.error;
    default:
      return Colors.darkGray;
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
  filterButton: {
    marginRight: 16,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeFilterText: {
    fontSize: 14,
    color: Colors.text,
  },
  clearFilterText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
  },
  filterOptions: {
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    zIndex: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: 200,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 8,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeFilterOption: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 12,
  },
  orderItems: {
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
  },
});