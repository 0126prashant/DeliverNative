import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useOrderStore } from '@/store/orderStore';
import Button from '@/components/Button';

export default function PaymentSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { getOrderById } = useOrderStore();
  
  const order = getOrderById(orderId);
  
  useEffect(() => {
    if (!order) {
      router.replace('/');
    }
  }, [order, router]);
  
  const handleViewOrder = () => {
    router.push(`/order/${orderId}`);
  };
  
  const handleContinueShopping = () => {
    router.push('/');
  };
  
  if (!order) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={80} color={Colors.success} />
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully and will be delivered soon.
        </Text>
        
        <View style={styles.orderInfo}>
          <View style={styles.orderDetail}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderValue}>#{order.id.slice(-6)}</Text>
          </View>
          
          <View style={styles.orderDetail}>
            <Text style={styles.orderLabel}>Amount Paid</Text>
            <Text style={styles.orderValue}>₹{order.totalAmount}</Text>
          </View>
          
          <View style={styles.orderDetail}>
            <Text style={styles.orderLabel}>Payment Method</Text>
            <Text style={styles.orderValue}>
              {order.paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
            </Text>
          </View>
        </View>
        
        <View style={styles.estimatedDelivery}>
          <Text style={styles.estimatedLabel}>Estimated Delivery</Text>
          <Text style={styles.estimatedTime}>
            {order.estimatedDelivery 
              ? new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Within 30 minutes'}
          </Text>
        </View>
      </View>
      
      <View style={styles.buttons}>
        <Button 
          title="View Order" 
          onPress={handleViewOrder} 
          variant="outline"
          style={styles.viewOrderButton}
        />
        <Button 
          title="Continue Shopping" 
          onPress={handleContinueShopping}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfo: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  estimatedDelivery: {
    alignItems: 'center',
  },
  estimatedLabel: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  buttons: {
    marginBottom: 24,
  },
  viewOrderButton: {
    marginBottom: 12,
  },
  continueButton: {
  },
});