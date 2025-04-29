import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Linking, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, CreditCard, ChevronRight, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import CartItem from '@/components/CartItem';
import AddressCard from '@/components/AddressCard';
import Button from '@/components/Button';

// List of supported UPI apps
const UPI_APPS = [
  {
    name: 'Google Pay',
    package: 'com.google.android.apps.nbu.paisa.user',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1024px-Google_Pay_Logo_%282020%29.svg.png'
  },
  {
    name: 'PhonePe',
    package: 'com.phonepe.app',
    icon: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png'
  },
  {
    name: 'Paytm',
    package: 'net.one97.paytm',
    icon: 'https://logos-world.net/wp-content/uploads/2020/11/Paytm-Symbol.png'
  },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { placeOrder, isLoading } = useOrderStore();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    user?.addresses.find(addr => addr.isDefault)?.id || user?.addresses[0]?.id || null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [showUpiApps, setShowUpiApps] = useState(false);
  
  const totalAmount = getTotalAmount();
  const deliveryFee = 40;
  const totalPayable = totalAmount + deliveryFee;
  
  const selectedAddress = user?.addresses.find(addr => addr.id === selectedAddressId);
  
  const handleAddAddress = () => {
    router.push('/address/new');
  };
  
  const handleSelectAddress = () => {
    router.push('/profile/addresses?select=true');
  };
  
  const handleSelectPayment = () => {
    Alert.alert(
      'Select Payment Method',
      'Choose your payment method',
      [
        {
          text: 'UPI',
          onPress: () => {
            setSelectedPaymentMethod('upi');
            setShowUpiApps(true);
          },
        },
        {
          text: 'Cash on Delivery',
          onPress: () => {
            setSelectedPaymentMethod('cod');
            setShowUpiApps(false);
            setSelectedUpiApp(null);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleUpiAppSelect = (appName: string) => {
    setSelectedUpiApp(appName);
    setShowUpiApps(false);
  };

  const toggleUpiApps = () => {
    setShowUpiApps(!showUpiApps);
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    // For UPI payment, initiate payment flow
    if (selectedPaymentMethod === 'upi') {
      if (!selectedUpiApp) {
        Alert.alert('Select UPI App', 'Please select a UPI app to continue with payment');
        setShowUpiApps(true);
        return;
      }

      try {
        // Generate a unique merchant transaction ID
        const txnId = `ORDER${Date.now()}`;
        const orderId = `ORD${Math.floor(1000 + Math.random() * 9000)}`;
        const merchantId = 'DELIVERY_APP';

        // Construct UPI URL with transaction details
        const upiUrl = `upi://pay?pa=example@upi&pn=DeliveryApp&am=${totalPayable}&cu=INR&tn=Order Payment&tr=${txnId}&mc=${merchantId}&tid=${orderId}`;
        
        // Log the URL for debugging (in a real app, use proper logging)
        console.log('UPI Payment URL:', upiUrl);

        // Check if the URL can be opened
        const canOpen = await Linking.canOpenURL(upiUrl);
        
        if (canOpen) {
          // Place the order first in database
          const order = await placeOrder(items, selectedAddress, selectedPaymentMethod);
          
          // Then open the UPI app
          await Linking.openURL(upiUrl);
          
          // Clear cart and navigate to success
          clearCart();
          router.push({
            pathname: '/payment-success',
            params: { orderId: order.id }
          });
        } else {
          throw new Error("Can't open UPI app");
        }
      } catch (error) {
        console.error('UPI payment error:', error);
        Alert.alert('Payment Error', 'Failed to open UPI payment app. Please try another payment method.');
      }
    } else {
      // For Cash on Delivery, proceed as before
      try {
        const order = await placeOrder(items, selectedAddress, selectedPaymentMethod);
        clearCart();
        router.push({
          pathname: '/payment-success',
          params: { orderId: order.id }
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            {user?.addresses.length ? (
              <Pressable onPress={handleSelectAddress}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            ) : null}
          </View>
          
          {selectedAddress ? (
            <AddressCard address={selectedAddress} />
          ) : (
            <Pressable style={styles.addAddressButton} onPress={handleAddAddress}>
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </Pressable>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <CreditCard size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
          </View>
          
          <Pressable style={styles.paymentOption} onPress={handleSelectPayment}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentMethod}>
                {selectedPaymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
              </Text>
              {selectedPaymentMethod === 'upi' && (
                <Text style={styles.paymentDescription}>
                  {selectedUpiApp ? `Pay using ${selectedUpiApp}` : 'Select a UPI app'}
                </Text>
              )}
              {selectedPaymentMethod === 'cod' && (
                <Text style={styles.paymentDescription}>
                  Pay when your order is delivered
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={Colors.darkGray} />
          </Pressable>

          {/* UPI Apps Selection */}
          {showUpiApps && selectedPaymentMethod === 'upi' && (
            <View style={styles.upiAppsContainer}>
              <Text style={styles.upiAppsTitle}>Select UPI App</Text>
              <View style={styles.upiAppsList}>
                {UPI_APPS.map((app) => (
                  <Pressable
                    key={app.name}
                    style={[
                      styles.upiAppItem,
                      selectedUpiApp === app.name && styles.selectedUpiApp
                    ]}
                    onPress={() => handleUpiAppSelect(app.name)}
                  >
                    <Image source={{ uri: app.icon }} style={styles.upiAppIcon} />
                    <Text style={styles.upiAppName}>{app.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} readonly />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Total</Text>
            <Text style={styles.priceValue}>₹{totalAmount}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>₹{deliveryFee}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalPayable}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerTotal}>₹{totalPayable}</Text>
            <Text style={styles.viewDetails}>View price details</Text>
          </View>
          <Button 
            title={selectedPaymentMethod === 'upi' ? 'Pay Now' : 'Place Order'} 
            onPress={handlePlaceOrder} 
            size="large"
            loading={isLoading}
            disabled={!selectedAddress || isLoading}
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
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  changeText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 12,
    color: Colors.subtext,
  },
  // UPI app selection styles
  upiAppsContainer: {
    marginTop: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 16,
  },
  upiAppsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  upiAppsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upiAppItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  selectedUpiApp: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  upiAppIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  upiAppName: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.text,
  },
  itemsContainer: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  priceValue: {
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
  viewDetails: {
    fontSize: 12,
    color: Colors.primary,
  },
});