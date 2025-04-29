import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { categories, products } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => 
    category && p.category.toLowerCase() === category.name.toLowerCase()
  );
  
  if (!category) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Category not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: category.name }} />
      
      {categoryProducts.length > 0 ? (
        <FlatList
          data={categoryProducts}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} />
            </View>
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found in this category</Text>
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
  productsList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 8,
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
    textAlign: 'center',
  },
});