import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function PaymentMethodsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Payment Methods' }} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        
        <Pressable style={styles.paymentMethod}>
          <View style={styles.paymentIcon}>
            <Smartphone size={24} color={Colors.primary} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>UPI</Text>
            <Text style={styles.paymentSubtitle}>Pay using UPI apps</Text>
          </View>
        </Pressable>
        
        <Pressable style={styles.paymentMethod}>
          <View style={styles.paymentIcon}>
            <DollarSign size={24} color={Colors.primary} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Cash on Delivery</Text>
            <Text style={styles.paymentSubtitle}>Pay when your order arrives</Text>
          </View>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Payment Method</Text>
        
        <Pressable style={styles.addPaymentMethod}>
          <View style={styles.addPaymentIcon}>
            <CreditCard size={24} color={Colors.primary} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Add Credit/Debit Card</Text>
            <Text style={styles.paymentSubtitle}>Save your card for faster checkout</Text>
          </View>
        </Pressable>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Secure Payments</Text>
        <Text style={styles.infoText}>
          All payment information is stored securely. We do not store your credit card details.
        </Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: Colors.subtext,
  },
  addPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addPaymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoSection: {
    padding: 16,
    margin: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.subtext,
    lineHeight: 18,
  },
});