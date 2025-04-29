import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MapPin, Package, User, Phone, Truck } from 'lucide-react-native';

import { useOrderStore } from '@/store/orderStore';
import { useDeliveryPersonnelStore } from '@/store/deliveryPersonnelStore';
import Button from '@/components/Button';
import OrderTracker from '@/components/OrderTracker';
import Colors from '@/constants/Colors';

export default function AdminOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, isLoading } = useOrderStore();
  const { deliveryPersonnel } = useDeliveryPersonnelStore();
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const order = getOrderById(id);
  
  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert(
      'Update Order Status',
      `Are you sure you want to update the status to ${getStatusText(newStatus)}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await updateOrderStatus(order.id, newStatus);
              Alert.alert('Success', 'Order status updated successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to update order status');
            }
          },
        },
      ]
    );
  };

  const handleAssignDeliveryPerson = (personnelId: string) => {
    const selectedPersonnel = deliveryPersonnel.find(p => p.id === personnelId);
    
    if (selectedPersonnel) {
      Alert.alert(
        'Assign Delivery Person',
        `Assign ${selectedPersonnel.name} to this order?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Assign',
            onPress: async () => {
              try {
                await updateOrderStatus(order.id, 'out_for_delivery', {
                  deliveryPerson: {
                    name: selectedPersonnel.name,
                    phone: selectedPersonnel.phone,
                    image: selectedPersonnel.image,
                  }
                });
                setShowAssignModal(false);
                Alert.alert('Success', 'Delivery person assigned successfully');
              } catch (error) {
                Alert.alert('Error', 'Failed to assign delivery person');
              }
            },
          },
        ]
      );
    }
  };

  const getNextStatus = () => {
    switch (order.status) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'out_for_delivery';
      case 'out_for_delivery':
        return 'delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id.slice(-6)}` }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusTextColor(order.status) }
              ]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>
          
          <OrderTracker status={order.status} />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color={Colors.secondary} />
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
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.secondary} />
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
        
        {order.trackingInfo?.deliveryPerson ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Truck size={20} color={Colors.secondary} />
              <Text style={styles.sectionTitle}>Delivery Person</Text>
            </View>
            
            <View style={styles.deliveryPersonContainer}>
              <View style={styles.deliveryPersonInfo}>
                <View style={styles.deliveryPersonIcon}>
                  <User size={20} color={Colors.secondary} />
                </View>
                <View>
                  <Text style={styles.deliveryPersonName}>
                    {order.trackingInfo.deliveryPerson.name}
                  </Text>
                  <Text style={styles.deliveryPersonPhone}>
                    {order.trackingInfo.deliveryPerson.phone}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          order.status === 'preparing' && (
            <View style={styles.section}>
              <Button 
                title="Assign Delivery Person" 
                onPress={() => setShowAssignModal(true)}
                variant="outline"
                fullWidth
              />
            </View>
          )
        )}
        
        {order.status !== 'delivered' && order.status !== 'cancelled' && nextStatus && (
          <View style={styles.actionSection}>
            <Button 
              title={`Mark as ${getStatusText(nextStatus)}`} 
              onPress={() => handleUpdateStatus(nextStatus)}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />
          </View>
        )}
        
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <View style={styles.actionSection}>
            <Button 
              title="Cancel Order" 
              onPress={() => handleUpdateStatus('cancelled')}
              variant="outline"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />
          </View>
        )}
      </ScrollView>
      
      {showAssignModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Assign Delivery Person</Text>
            
            <ScrollView style={styles.personnelList}>
              {deliveryPersonnel.map(person => (
                <Pressable 
                  key={person.id}
                  style={styles.personnelItem}
                  onPress={() => handleAssignDeliveryPerson(person.id)}
                >
                  <View style={styles.personnelIcon}>
                    <User size={20} color={Colors.secondary} />
                  </View>
                  <View style={styles.personnelInfo}>
                    <Text style={styles.personnelName}>{person.name}</Text>
                    <Text style={styles.personnelPhone}>{person.phone}</Text>
                  </View>
                  <View style={styles.personnelStatus}>
                    <Text style={[
                      styles.personnelStatusText,
                      { color: person.isAvailable ? Colors.success : Colors.error }
                    ]}>
                      {person.isAvailable ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            
            <Button 
              title="Cancel" 
              onPress={() => setShowAssignModal(false)}
              variant="outline"
              fullWidth
              style={styles.modalCancelButton}
            />
          </View>
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
  orderHeader: {
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.subtext,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
  deliveryPersonContainer: {
    marginTop: 4,
  },
  deliveryPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryPersonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  deliveryPersonPhone: {
    fontSize: 14,
    color: Colors.subtext,
  },
  actionSection: {
    margin: 16,
    marginBottom: 0,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  personnelList: {
    maxHeight: 300,
  },
  personnelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  personnelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  personnelInfo: {
    flex: 1,
  },
  personnelName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  personnelPhone: {
    fontSize: 14,
    color: Colors.subtext,
  },
  personnelStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  personnelStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalCancelButton: {
    marginTop: 16,
  },
});