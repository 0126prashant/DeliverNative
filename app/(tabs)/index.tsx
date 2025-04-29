import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MapPin, ChevronRight } from 'lucide-react-native';
import * as Location from 'expo-location';
import Colors from '@/constants/colors';
import { categories, products } from '@/mocks/products';
import { useUserStore } from '@/store/userStore';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

export default function HomeScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const featuredProducts = products.filter(product => product.discountedPrice);
  const popularProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  
  useEffect(() => {
    if (Platform.OS !== 'web' && !user?.currentLocation?.coords) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for delivery services.');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Get address from coordinates
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addresses.length > 0) {
        const address = addresses[0];
        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.region,
          address.postalCode
        ].filter(Boolean).join(', ');
        
        updateUserProfile({
          currentLocation: {
            address: formattedAddress,
            coords: location.coords
          }
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        params: { query: searchQuery }
      });
    }
  };

  const handleLocationPress = () => {
    router.push('/location-picker');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.locationContainer} onPress={handleLocationPress}>
          <MapPin size={18} color={Colors.primary} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliverTo}>DELIVER TO</Text>
            <Text style={styles.location} numberOfLines={1}>
              {isLoadingLocation 
                ? 'Detecting location...' 
                : user?.currentLocation?.address || 'Set your location'}
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.darkGray} />
        </Pressable>
        
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
      </View>
      
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Premium Dry Fruits</Text>
          <Text style={styles.bannerSubtitle}>Delivered in 30 minutes</Text>
        </View>
      </View>
      
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryCard category={item} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <Pressable onPress={() => router.push('/search?filter=offers')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        
        <FlatList
          data={featuredProducts}
          renderItem={({ item }) => <ProductCard product={item} horizontal />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <Pressable onPress={() => router.push('/search?filter=popular')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        
        <View style={styles.productsGrid}>
          {popularProducts.map(product => (
            <View key={product.id} style={styles.productItem}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 6,
  },
  deliverTo: {
    fontSize: 10,
    color: Colors.darkGray,
  },
  location: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    marginTop: 4,
  },
  categoriesSection: {
    marginTop: 24,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  productItem: {
    width: '48%',
  },
});