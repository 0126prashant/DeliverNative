import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { User, Phone, Plus, X, Edit, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useDeliveryPersonnelStore } from '@/store/deliveryPersonnelStore';
import Button from '@/components/Button';

export default function DeliveryPersonnelScreen() {
  const { 
    deliveryPersonnel, 
    addDeliveryPersonnel, 
    updateDeliveryPersonnel,
    removeDeliveryPersonnel,
    isLoading 
  } = useDeliveryPersonnelStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleAddPersonnel = () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    addDeliveryPersonnel({
      name,
      phone,
      isAvailable,
    });

    setName('');
    setPhone('');
    setIsAvailable(true);
    setShowAddModal(false);
  };

  const handleEditPersonnel = () => {
    if (!selectedPersonnel || !name || !phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    updateDeliveryPersonnel(selectedPersonnel, {
      name,
      phone,
      isAvailable,
    });

    setName('');
    setPhone('');
    setIsAvailable(true);
    setSelectedPersonnel(null);
    setShowEditModal(false);
  };

  const handleRemovePersonnel = (id: string) => {
    Alert.alert(
      'Remove Delivery Person',
      'Are you sure you want to remove this delivery person?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeDeliveryPersonnel(id);
          },
        },
      ]
    );
  };

  const openEditModal = (id: string) => {
    const personnel = deliveryPersonnel.find(p => p.id === id);
    if (personnel) {
      setSelectedPersonnel(id);
      setName(personnel.name);
      setPhone(personnel.phone);
      setIsAvailable(personnel.isAvailable);
      setShowEditModal(true);
    }
  };

  const renderPersonnelItem = ({ item }: { item: any }) => (
    <View style={styles.personnelItem}>
      <View style={styles.personnelInfo}>
        <View style={styles.personnelIcon}>
          <User size={20} color={Colors.secondary} />
        </View>
        <View>
          <Text style={styles.personnelName}>{item.name}</Text>
          <View style={styles.phoneContainer}>
            <Phone size={14} color={Colors.subtext} />
            <Text style={styles.personnelPhone}>{item.phone}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.personnelActions}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isAvailable ? `${Colors.success}20` : `${Colors.error}20` }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.isAvailable ? Colors.success : Colors.error }
          ]}>
            {item.isAvailable ? 'Available' : 'Busy'}
          </Text>
        </View>
        
        <Pressable 
          style={styles.actionButton} 
          onPress={() => openEditModal(item.id)}
        >
          <Edit size={18} color={Colors.secondary} />
        </Pressable>
        
        <Pressable 
          style={styles.actionButton} 
          onPress={() => handleRemovePersonnel(item.id)}
        >
          <Trash2 size={18} color={Colors.error} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Delivery Personnel',
        headerRight: () => (
          <Pressable 
            onPress={() => {
              setName('');
              setPhone('');
              setIsAvailable(true);
              setShowAddModal(true);
            }} 
            style={styles.addButton}
          >
            <Plus size={20} color={Colors.white} />
          </Pressable>
        ),
      }} />
      
      {deliveryPersonnel.length > 0 ? (
        <FlatList
          data={deliveryPersonnel}
          renderItem={renderPersonnelItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.personnelList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No delivery personnel added yet</Text>
          <Button 
            title="Add Delivery Person" 
            onPress={() => {
              setName('');
              setPhone('');
              setIsAvailable(true);
              setShowAddModal(true);
            }}
            style={styles.emptyButton}
          />
        </View>
      )}
      
      {/* Add Personnel Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Delivery Person</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X size={20} color={Colors.text} />
              </Pressable>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            <Pressable 
              style={styles.checkboxContainer} 
              onPress={() => setIsAvailable(!isAvailable)}
            >
              <View style={styles.checkbox}>
                {isAvailable && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>Available for delivery</Text>
            </Pressable>
            
            <Button 
              title="Add Delivery Person" 
              onPress={handleAddPersonnel} 
              loading={isLoading}
              disabled={isLoading || !name || !phone}
              fullWidth
              style={styles.modalButton}
            />
          </View>
        </View>
      )}
      
      {/* Edit Personnel Modal */}
      {showEditModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Delivery Person</Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <X size={20} color={Colors.text} />
              </Pressable>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            <Pressable 
              style={styles.checkboxContainer} 
              onPress={() => setIsAvailable(!isAvailable)}
            >
              <View style={styles.checkbox}>
                {isAvailable && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.checkboxLabel}>Available for delivery</Text>
            </Pressable>
            
            <Button 
              title="Update Delivery Person" 
              onPress={handleEditPersonnel} 
              loading={isLoading}
              disabled={isLoading || !name || !phone}
              fullWidth
              style={styles.modalButton}
            />
          </View>
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
  addButton: {
    marginRight: 16,
  },
  personnelList: {
    padding: 16,
  },
  personnelItem: {
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
  personnelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  personnelName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personnelPhone: {
    fontSize: 14,
    color: Colors.subtext,
    marginLeft: 4,
  },
  personnelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 16,
  },
  emptyButton: {
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  modalButton: {
    marginTop: 8,
  },
});