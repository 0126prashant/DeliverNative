import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Star, MinusCircle, PlusCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products } from '@/mocks/products';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/Button';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = products.find(p => p.id === id);
  const { addToCart, removeFromCart, getItemQuantity } = useCartStore();
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition'>('description');
  
  const quantity = getItemQuantity(id);
  
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };
  
  const handleBuyNow = () => {
    if (quantity === 0) {
      addToCart(product);
    }
    router.push('/checkout');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.weight}>{product.weight}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                <Star size={16} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{product.discountedPrice || product.price}</Text>
              {product.discountedPrice && (
                <Text style={styles.originalPrice}>₹{product.price}</Text>
              )}
              {product.discountedPrice && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'description' && styles.activeTab]}
              onPress={() => setActiveTab('description')}
            >
              <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
                Description
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
              onPress={() => setActiveTab('nutrition')}
            >
              <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
                Nutrition
              </Text>
            </Pressable>
          </View>
          
          {activeTab === 'description' ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{product.description}</Text>
              {product.tags && (
                <View style={styles.tagsContainer}>
                  {product.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.nutritionContainer}>
              {product.nutritionalInfo ? (
                <>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                    <Text style={styles.nutritionValue}>{product.nutritionalInfo.calories}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                    <Text style={styles.nutritionValue}>{product.nutritionalInfo.protein}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                    <Text style={styles.nutritionValue}>{product.nutritionalInfo.fat}</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>Carbohydrates</Text>
                    <Text style={styles.nutritionValue}>{product.nutritionalInfo.carbs}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.noNutritionText}>Nutritional information not available</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          {quantity > 0 ? (
            <View style={styles.quantityControls}>
              <Pressable onPress={handleRemoveFromCart} hitSlop={8}>
                <MinusCircle size={28} color={Colors.primary} />
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
              <Pressable onPress={handleAddToCart} hitSlop={8}>
                <PlusCircle size={28} color={Colors.primary} />
              </Pressable>
            </View>
          ) : (
            <Button 
              title="Add to Cart" 
              onPress={handleAddToCart} 
              variant="outline"
              size="large"
              style={styles.addButton}
            />
          )}
        </View>
        <Button 
          title="Buy Now" 
          onPress={handleBuyNow} 
          size="large"
          style={styles.buyButton}
        />
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
  image: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.lightGray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  weight: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.darkGray,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: `${Colors.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.subtext,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.subtext,
  },
  nutritionContainer: {
    marginBottom: 16,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nutritionLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  noNutritionText: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quantityContainer: {
    flex: 1,
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    flex: 1,
  },
  buyButton: {
    flex: 1,
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