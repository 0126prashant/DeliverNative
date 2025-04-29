import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products, categories } from '@/mocks/products';
import { Product } from '@/types';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

export default function SearchScreen() {
  const { query, filter } = useLocalSearchParams<{ query?: string, filter?: string }>();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(filter || null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);
  
  useEffect(() => {
    if (filter) {
      setActiveFilter(filter);
    }
  }, [filter]);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...products];
      
      // Apply search query filter
      if (searchQuery) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (activeFilter === 'offers') {
        results = results.filter(product => product.discountedPrice);
      } else if (activeFilter === 'popular') {
        results = [...results].sort((a, b) => b.rating - a.rating);
      } else if (activeFilter) {
        // Check if filter is a category
        const category = categories.find(cat => cat.id === activeFilter || cat.name.toLowerCase() === activeFilter.toLowerCase());
        if (category) {
          results = results.filter(product => 
            product.category.toLowerCase() === category.name.toLowerCase()
          );
        }
      }
      
      setFilteredProducts(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleFilterPress = () => {
    setShowFilterModal(!showFilterModal);
  };
  
  const handleCategoryPress = (categoryId: string) => {
    setActiveFilter(categoryId);
    setShowFilterModal(false);
  };
  
  const clearFilters = () => {
    setActiveFilter(null);
    setShowFilterModal(false);
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
      </View>
      
      <Pressable style={styles.filterButton} onPress={handleFilterPress}>
        <Filter size={20} color={activeFilter ? Colors.primary : Colors.text} />
      </Pressable>
    </View>
  );
  
  const renderFilterChips = () => {
    if (!activeFilter) return null;
    
    let filterName = activeFilter;
    if (activeFilter === 'offers') {
      filterName = 'Special Offers';
    } else if (activeFilter === 'popular') {
      filterName = 'Popular Items';
    } else {
      const category = categories.find(cat => cat.id === activeFilter);
      if (category) {
        filterName = category.name;
      }
    }
    
    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>{filterName}</Text>
          <Pressable onPress={clearFilters} hitSlop={8}>
            <Text style={styles.clearFilter}>✕</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  
  const renderFilterModal = () => {
    if (!showFilterModal) return null;
    
    return (
      <View style={styles.filterModal}>
        <Text style={styles.filterModalTitle}>Filter by Category</Text>
        <Pressable 
          style={[styles.filterOption, activeFilter === 'offers' && styles.activeFilterOption]} 
          onPress={() => handleCategoryPress('offers')}
        >
          <Text style={[styles.filterOptionText, activeFilter === 'offers' && styles.activeFilterOptionText]}>
            Special Offers
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.filterOption, activeFilter === 'popular' && styles.activeFilterOption]} 
          onPress={() => handleCategoryPress('popular')}
        >
          <Text style={[styles.filterOptionText, activeFilter === 'popular' && styles.activeFilterOptionText]}>
            Popular Items
          </Text>
        </Pressable>
        {categories.map(category => (
          <Pressable 
            key={category.id}
            style={[styles.filterOption, activeFilter === category.id && styles.activeFilterOption]} 
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={[styles.filterOptionText, activeFilter === category.id && styles.activeFilterOptionText]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
        <Pressable style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </Pressable>
      </View>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>
            Try a different search term or browse categories
          </Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleCategoryPress(item.id)}>
                <CategoryCard category={item} />
              </Pressable>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredProducts}
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
    );
  };
  
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilterChips()}
      {renderContent()}
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 6,
  },
  clearFilter: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  categoriesList: {
    paddingVertical: 16,
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
  filterModal: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  filterModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeFilterOption: {
    backgroundColor: `${Colors.primary}10`,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeFilterOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  clearFiltersButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});