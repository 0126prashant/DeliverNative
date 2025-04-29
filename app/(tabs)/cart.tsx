import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';

export default function CartScreen() {
  const router = useRouter();
  const { items, getTotalItems, getTotalAmount, clearCart } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const [isClearing, setIsClearing] = useState(false);
  
  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();
  const deliveryFee = totalAmount > 0 ? 40 : 0;
  const totalPayable = totalAmount + deliveryFee;
  
  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };
  
  if (totalItems === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={80} color={Colors.lightGray} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Browse our products and add items to your cart
        </Text>
        <Button 
          title="Start Shopping" 
          onPress={() => router.push('/')} 
          style={styles.shopButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          <Pressable onPress={handleClearCart} disabled={isClearing}>
            <Text style={styles.clearText}>Clear Cart</Text>
          </Pressable>
        </View>
        
        <View style={styles.itemsContainer}>
          {items.map(item => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items Total</Text>
            <Text style={styles.summaryValue}>₹{totalAmount}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalPayable}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerTotal}>₹{totalPayable}</Text>
            <Text style={styles.footerItems}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
          </View>
          <Button 
            title="Proceed to Checkout" 
            onPress={handleCheckout} 
            size="large"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  clearText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 100,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  footerItems: {
    fontSize: 12,
    color: Colors.subtext,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    marginTop: 16,
  },
});