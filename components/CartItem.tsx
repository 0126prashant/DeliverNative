import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { addToCart, removeFromCart, removeItemCompletely } = useCartStore();
  const { product, quantity } = item;

  const handleAdd = () => {
    addToCart(product);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleDelete = () => {
    removeItemCompletely(product.id);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.weight}>{product.weight}</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.discountedPrice || product.price}</Text>
            {product.discountedPrice && (
              <Text style={styles.originalPrice}>₹{product.price}</Text>
            )}
          </View>
          <View style={styles.quantityContainer}>
            <Pressable onPress={handleRemove} hitSlop={8}>
              <MinusCircle size={22} color={Colors.primary} />
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable onPress={handleAdd} hitSlop={8}>
              <PlusCircle size={22} color={Colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>
      <Pressable style={styles.deleteButton} onPress={handleDelete} hitSlop={8}>
        <Trash2 size={18} color={Colors.error} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  weight: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.darkGray,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});