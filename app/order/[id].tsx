import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin, Package, Phone, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useOrderStore } from '@/store/orderStore';
import OrderTracker from '@/components/OrderTracker';
import Button from '@/components/Button';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, cancelOrder, isLoading } = useOrderStore();
  
  const order = getOrderById(id);
  
  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
        <Button 
          title="Go to Orders" 
          onPress={() => router.push('/profile/orders')} 
          style={styles.backButton}
        />
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(order.id);
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Order #${order.id.slice(-6)}` }} />
      
      <View style={styles.section}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
            <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
          </View>
          {order.status === 'pending' || order.status === 'confirmed' ? (
            <Button 
              title="Cancel" 
              onPress={handleCancelOrder} 
              variant="outline" 
              size="small"
              loading={isLoading}
              disabled={isLoading}
            />
          ) : null}
        </View>
        
        <OrderTracker status={order.status} />
        
        {order.trackingInfo?.deliveryPerson && (
          <View style={styles.deliveryPersonContainer}>
            <View style={styles.deliveryPersonHeader}>
              <User size={20} color={Colors.primary} />
              <Text style={styles.deliveryPersonTitle}>Delivery Partner</Text>
            </View>
            <View style={styles.deliveryPersonInfo}>
              <Text style={styles.deliveryPersonName}>{order.trackingInfo.deliveryPerson.name}</Text>
              <Pressable style={styles.callButton}>
                <Phone size={16} color={Colors.primary} />
                <Text style={styles.callText}>Call</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Package size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Order Items</Text>
        </View>
        
        {order.items.map((item, index) => (
          <View key={`${item.product.id}-${index}`} style={styles.orderItem}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemWeight}>{item.product.weight}</Text>
            </View>
            <Text style={styles.itemPrice}>
              ₹{(item.product.discountedPrice || item.product.price) * item.quantity}
            </Text>
          </View>
        ))}
        
        <View style={styles.divider} />
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Items Total</Text>
          <Text style={styles.priceValue}>₹{order.totalAmount - 40}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery Fee</Text>
          <Text style={styles.priceValue}>₹40</Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Delivery Address</Text>
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressType}>{order.deliveryAddress.type.toUpperCase()}</Text>
          <Text style={styles.address}>{order.deliveryAddress.address}</Text>
          {order.deliveryAddress.landmark && (
            <Text style={styles.landmark}>Landmark: {order.deliveryAddress.landmark}</Text>
          )}
          <Text style={styles.cityState}>
            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Payment Method</Text>
          <Text style={styles.paymentValue}>
            {order.paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
          </Text>
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Payment Status</Text>
          <View style={[
            styles.paymentStatusBadge,
            { backgroundColor: order.paymentStatus === 'completed' ? `${Colors.success}20` : `${Colors.warning}20` }
          ]}>
            <Text style={[
              styles.paymentStatusText,
              { color: order.paymentStatus === 'completed' ? Colors.success : Colors.warning }
            ]}>
              {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.helpSection}>
        <Text style={styles.helpText}>Need help with your order?</Text>
        <Button 
          title="Contact Support" 
          onPress={() => {}} 
          variant="outline"
          style={styles.helpButton}
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
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.subtext,
  },
  deliveryPersonContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  deliveryPersonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryPersonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  deliveryPersonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  callText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 30,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  itemWeight: {
    fontSize: 12,
    color: Colors.subtext,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  addressContainer: {
    marginTop: 4,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  landmark: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  cityState: {
    fontSize: 14,
    color: Colors.subtext,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helpSection: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  helpButton: {
    minWidth: 150,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});