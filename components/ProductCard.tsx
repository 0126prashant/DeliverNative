import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MinusCircle, PlusCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export default function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, removeFromCart, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(product.id);

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <Pressable 
      style={[
        styles.container, 
        horizontal ? styles.horizontalContainer : {}
      ]} 
      onPress={handlePress}
    >
      <Image
        source={{ uri: product.image }}
        style={[
          styles.image,
          horizontal ? styles.horizontalImage : {}
        ]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.weight}>{product.weight}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.discountedPrice || product.price}</Text>
          {product.discountedPrice && (
            <Text style={styles.originalPrice}>₹{product.price}</Text>
          )}
        </View>
        
        <View style={styles.actionContainer}>
          {quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <Pressable onPress={handleRemoveFromCart} hitSlop={8}>
                <MinusCircle size={24} color={Colors.primary} />
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
              <Pressable onPress={handleAddToCart} hitSlop={8}>
                <PlusCircle size={24} color={Colors.primary} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>ADD</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 120,
  },
  image: {
    height: 120,
    width: '100%',
    backgroundColor: Colors.lightGray,
  },
  horizontalImage: {
    width: 120,
    height: '100%',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  weight: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
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
});