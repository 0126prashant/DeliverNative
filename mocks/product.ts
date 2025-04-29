import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Nuts',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Dried Fruits',
    image: 'https://images.unsplash.com/photo-1596591868231-05e586abf2fb?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Seeds',
    image: 'https://images.unsplash.com/photo-1574570231616-bfceabd9b2c6?q=80&w=2012&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Trail Mixes',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=2067&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Gift Packs',
    image: 'https://images.unsplash.com/photo-1607920592519-bab2a80efd55?q=80&w=2070&auto=format&fit=crop'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Cashews',
    description: 'Crunchy, delicious cashews that are perfect for snacking or adding to your favorite recipes.',
    price: 599,
    discountedPrice: 499,
    image: 'https://images.unsplash.com/photo-1563412885-e335dc95c512?q=80&w=2574&auto=format&fit=crop',
    category: 'Nuts',
    weight: '250g',
    inStock: true,
    rating: 4.8,
    nutritionalInfo: {
      calories: '160 kcal per 30g',
      protein: '5g per 30g',
      fat: '13g per 30g',
      carbs: '9g per 30g'
    },
    tags: ['premium', 'healthy', 'protein-rich']
  },
  {
    id: '2',
    name: 'Organic Almonds',
    description: 'Naturally grown almonds that are packed with nutrients and great taste.',
    price: 699,
    discountedPrice: 649,
    image: 'https://images.unsplash.com/photo-1574570039896-36186a210e0b?q=80&w=2574&auto=format&fit=crop',
    category: 'Nuts',
    weight: '500g',
    inStock: true,
    rating: 4.7,
    nutritionalInfo: {
      calories: '170 kcal per 30g',
      protein: '6g per 30g',
      fat: '15g per 30g',
      carbs: '6g per 30g'
    },
    tags: ['organic', 'healthy', 'protein-rich']
  },
  {
    id: '3',
    name: 'Golden Raisins',
    description: 'Sweet and juicy golden raisins that add natural sweetness to any dish.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1596591868231-05e586abf2fb?q=80&w=2070&auto=format&fit=crop',
    category: 'Dried Fruits',
    weight: '200g',
    inStock: true,
    rating: 4.5,
    nutritionalInfo: {
      calories: '130 kcal per 30g',
      protein: '1g per 30g',
      fat: '0g per 30g',
      carbs: '31g per 30g'
    },
    tags: ['sweet', 'natural', 'no-added-sugar']
  },
  {
    id: '4',
    name: 'Dried Apricots',
    description: 'Soft and tangy dried apricots that are perfect for snacking or baking.',
    price: 399,
    discountedPrice: 349,
    image: 'https://images.unsplash.com/photo-1596591868252-07ca4d16b5fb?q=80&w=2070&auto=format&fit=crop',
    category: 'Dried Fruits',
    weight: '250g',
    inStock: true,
    rating: 4.6,
    nutritionalInfo: {
      calories: '80 kcal per 30g',
      protein: '1g per 30g',
      fat: '0g per 30g',
      carbs: '18g per 30g'
    },
    tags: ['tangy', 'fiber-rich', 'no-added-sugar']
  },
  {
    id: '5',
    name: 'Roasted Pistachios',
    description: 'Lightly salted and roasted pistachios that are irresistibly delicious.',
    price: 799,
    discountedPrice: 749,
    image: 'https://images.unsplash.com/photo-1574570039896-2d5c1e1e24f4?q=80&w=2574&auto=format&fit=crop',
    category: 'Nuts',
    weight: '200g',
    inStock: true,
    rating: 4.9,
    nutritionalInfo: {
      calories: '160 kcal per 30g',
      protein: '6g per 30g',
      fat: '13g per 30g',
      carbs: '8g per 30g'
    },
    tags: ['roasted', 'salted', 'premium']
  },
  {
    id: '6',
    name: 'Mixed Dried Berries',
    description: 'A delicious mix of cranberries, blueberries, and strawberries.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1596591868252-07ca4d16b5fb?q=80&w=2070&auto=format&fit=crop',
    category: 'Dried Fruits',
    weight: '150g',
    inStock: true,
    rating: 4.7,
    nutritionalInfo: {
      calories: '100 kcal per 30g',
      protein: '0g per 30g',
      fat: '0g per 30g',
      carbs: '24g per 30g'
    },
    tags: ['antioxidants', 'mixed', 'berries']
  },
  {
    id: '7',
    name: 'Pumpkin Seeds',
    description: 'Nutrient-rich pumpkin seeds that are great for snacking or adding to salads.',
    price: 349,
    discountedPrice: 299,
    image: 'https://images.unsplash.com/photo-1574570231616-bfceabd9b2c6?q=80&w=2012&auto=format&fit=crop',
    category: 'Seeds',
    weight: '200g',
    inStock: true,
    rating: 4.5,
    nutritionalInfo: {
      calories: '150 kcal per 30g',
      protein: '7g per 30g',
      fat: '13g per 30g',
      carbs: '5g per 30g'
    },
    tags: ['zinc-rich', 'protein', 'healthy']
  },
  {
    id: '8',
    name: 'Premium Trail Mix',
    description: 'A perfect blend of nuts, seeds, and dried fruits for an energy boost.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=2067&auto=format&fit=crop',
    category: 'Trail Mixes',
    weight: '300g',
    inStock: true,
    rating: 4.8,
    nutritionalInfo: {
      calories: '140 kcal per 30g',
      protein: '5g per 30g',
      fat: '9g per 30g',
      carbs: '12g per 30g'
    },
    tags: ['energy', 'mixed', 'on-the-go']
  },
  {
    id: '9',
    name: 'Luxury Dry Fruit Gift Box',
    description: 'An elegant assortment of premium dry fruits and nuts in a beautiful gift box.',
    price: 1299,
    discountedPrice: 1199,
    image: 'https://images.unsplash.com/photo-1607920592519-bab2a80efd55?q=80&w=2070&auto=format&fit=crop',
    category: 'Gift Packs',
    weight: '750g',
    inStock: true,
    rating: 4.9,
    tags: ['gift', 'premium', 'assortment']
  },
  {
    id: '10',
    name: 'Walnuts',
    description: 'Brain-shaped nuts that are actually good for your brain! Rich in omega-3 fatty acids.',
    price: 699,
    discountedPrice: 649,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=2069&auto=format&fit=crop',
    category: 'Nuts',
    weight: '250g',
    inStock: true,
    rating: 4.7,
    nutritionalInfo: {
      calories: '190 kcal per 30g',
      protein: '4g per 30g',
      fat: '18g per 30g',
      carbs: '4g per 30g'
    },
    tags: ['omega-3', 'brain-health', 'premium']
  }
];