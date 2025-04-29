import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useOrderStore } from '@/store/orderStore';
import OrderCard from '@/components/OrderCard';

export default function OrdersScreen() {
  const { orders } = useOrderStore();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'My Orders' }} />
      
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here
          </Text>
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
  ordersList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
  },
});