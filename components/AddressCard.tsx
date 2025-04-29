import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Home, Building2, Edit, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selectable?: boolean;
}

export default function AddressCard({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  selectable = false,
}: AddressCardProps) {
  const AddressIcon = address.type === 'home' ? Home : Building2;

  return (
    <Pressable
      style={[
        styles.container,
        selected && styles.selectedContainer,
        selectable && styles.selectableContainer,
      ]}
      onPress={selectable ? onSelect : undefined}
    >
      <View style={styles.iconContainer}>
        <AddressIcon size={20} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>{address.type.toUpperCase()}</Text>
          {address.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>}
        </View>
        <Text style={styles.addressText}>{address.address}</Text>
        {address.landmark && <Text style={styles.landmark}>Landmark: {address.landmark}</Text>}
        <Text style={styles.cityState}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
        
        {!selectable && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable style={styles.actionButton} onPress={onEdit}>
                <Edit size={16} color={Colors.primary} />
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
            )}
            {onDelete && (
              <Pressable style={styles.actionButton} onPress={onDelete}>
                <Trash2 size={16} color={Colors.error} />
                <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
      {selectable && selected && (
        <View style={styles.radioOuter}>
          <View style={styles.radioInner} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  selectableContainer: {
    paddingRight: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  addressText: {
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
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  radioOuter: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});