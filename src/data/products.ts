import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Metropolitan Tech Blazer',
    price: 145,
    originalPrice: 185,
    rating: 4.8,
    reviewCount: 34,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#2C3E50' },
      { name: 'Executive Navy', hex: '#1B263B' },
      { name: 'Sandstone Beige', hex: '#D2B48C' }
    ],
    description: 'Designed for the modern city commuter, this breathable water-repellent tech blazer combines performance fabric with sharp sartorial lines. Features hidden zipper security pockets and comfortable 4-way stretch material from our local downtown workshop.',
    tag: 'Sale',
    localStock: 4,
    deliveryTime: '90-Min Delivery',
    reviews: [
      { id: 'r1_1', author: 'Devon K.', rating: 5, comment: 'Phenomenal tailoring! The stretch material makes my subway commute infinitely better. Got it delivered in an hour flat.', date: 'May 12, 2026' },
      { id: 'r1_2', author: 'Marcus V.', rating: 4, comment: 'Great utility pockets, looks sharp with both tees and button-downs. Fits slightly slim, suggest sizing up.', date: 'May 04, 2026' }
    ]
  },
  {
    id: 'p2',
    name: 'Alpine Ribknit Crew Sweater',
    price: 95,
    rating: 4.9,
    reviewCount: 48,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=700&auto=format&fit=crop&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#EAE6DF' },
      { name: 'Forest Moss', hex: '#3E4A3D' },
      { name: 'Crimson Rust', hex: '#8C2E24' }
    ],
    description: 'Knit locally using sustainable, ultra-soft ethical merino wool. The chunky ribbing contours smoothly offering rich substance and snug insulation without bulk. Features ribbed sleeves and standard fit.',
    tag: 'Bestseller',
    localStock: 8,
    deliveryTime: 'Same Day Delivery',
    reviews: [
      { id: 'r2_1', author: 'Elena R.', rating: 5, comment: 'The wool is zero itch! Truly soft as a cloud and beautifully warm. Delivered by bike courier in perfect shape.', date: 'May 18, 2026' },
      { id: 'r2_2', author: 'Sarah P.', rating: 5, comment: 'Perfect addition to my autumn capsule. Craftsmanship is top tier, beautiful ribbing details.', date: 'April 29, 2026' }
    ]
  },
  {
    id: 'p3',
    name: 'Saffron Duster Jacket',
    price: 110,
    rating: 4.6,
    reviewCount: 19,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Marigold Yellow', hex: '#E29B2E' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    description: 'Make a bold statement with our fluid mid-weight open duster. Features sleek geometric collarless lapels, raw-edge design accents, and organic cotton twill weaving. Curated for local style lovers.',
    tag: 'New',
    localStock: 2,
    deliveryTime: '2-Hr Delivery',
    reviews: [
      { id: 'r3_1', author: 'Liam S.', rating: 4, comment: 'Incredible shade of marigold. Perfect transitional coat. Fabric drapes beautifully.', date: 'May 15, 2026' }
    ]
  },
  {
    id: 'p4',
    name: 'Heritage Trench Utility Coat',
    price: 195,
    originalPrice: 240,
    rating: 4.7,
    reviewCount: 22,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'British Kakhi', hex: '#C2B280' },
      { name: 'Soot Black', hex: '#2B2B2B' }
    ],
    description: 'A structural double-breasted update to the iconic trench, featuring dense weatherproofing, robust storm flaps, and standard metal double-buckles. Sourced from local cotton mills.',
    tag: 'Limited',
    localStock: 3,
    deliveryTime: '3-Hr Delivery',
    reviews: [
      { id: 'r4_1', author: 'Aria M.', rating: 5, comment: 'Heavy, premium canvas. This coat will easily last a decade. Stunning craftsmanship.', date: 'May 10, 2026' }
    ]
  },
  {
    id: 'p5',
    name: 'Artisanal Organic Tailored Pants',
    price: 88,
    rating: 4.5,
    reviewCount: 29,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=80',
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Rustic Camel', hex: '#B38B6D' },
      { name: 'Stonewash Indigo', hex: '#4A5B6B' },
      { name: 'Gravel Grey', hex: '#778899' }
    ],
    description: 'The blueprint of comfortable dress-casual dressing. Woven with organic cotton canvas mixed with flexible bamboo fibers, detailed with real horn-style buttons and an adjustable interior drawstring.',
    localStock: 12,
    deliveryTime: 'Same Day Delivery',
    reviews: [
      { id: 'r5_1', author: 'Jonathan H.', rating: 5, comment: 'Looks structured like premium trousers, feels like soft sweatpants. Magic fabric!', date: 'May 01, 2026' }
    ]
  },
  {
    id: 'p6',
    name: 'Premium Everyday Tee',
    price: 36,
    rating: 4.7,
    reviewCount: 112,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage Black', hex: '#1E1E1E' },
      { name: 'Alabaster White', hex: '#F9F6F0' },
      { name: 'Sage Green', hex: '#8F9779' }
    ],
    description: 'We spent eighteen months refining our basic silhouette. Cut from heavyweight 240GSM extra-long staple Supima cotton, featuring double-needle neck stitches that retain form forever.',
    tag: 'Bestseller',
    localStock: 25,
    deliveryTime: '90-Min Delivery',
    reviews: [
      { id: 'r6_1', author: 'Tyler R.', rating: 5, comment: 'The thick collar and structural drape are immaculate. Best blank T-shirt ever created.', date: 'May 16, 2026' },
      { id: 'r6_2', author: 'Chloe S.', rating: 4, comment: 'Beautiful heavy quality. Soft but structured. Hand-delivery within 2 hours was insane!', date: 'May 14, 2026' }
    ]
  },
  {
    id: 'p7',
    name: 'Courier Saddle Leather Bag',
    price: 160,
    rating: 4.9,
    reviewCount: 37,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=80',
    sizes: ['One Size'],
    colors: [
      { name: 'Raw Mahogany', hex: '#5C4033' },
      { name: 'Raven Black', hex: '#1A1A1A' }
    ],
    description: 'Handcrafted by boutique leather artisans close to local quarters. Features dense brass buckles, modular internal sleeve divider for 14-inch laptops, and rich oil-tanned finish that gains deep patina with use.',
    tag: 'Limited',
    localStock: 1,
    deliveryTime: 'Same Day Delivery',
    reviews: [
      { id: 'r7_1', author: 'Nadia B.', rating: 5, comment: 'The smell of the authentic full-grain leather is hypnotic. Absolute masterpiece, custom numbered from local design warehouse!', date: 'May 19, 2026' }
    ]
  },
  {
    id: 'p8',
    name: 'Merino Thermal Beanie',
    price: 28,
    rating: 4.4,
    reviewCount: 54,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d435353?w=700&auto=format&fit=crop&q=80',
    sizes: ['One Size'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#EAE6DF' },
      { name: 'Midnight Charcoal', hex: '#2C3E50' },
      { name: 'Foliage Green', hex: '#4F5D2F' }
    ],
    description: 'Minimalist double-layered waffle-knit design that fits perfectly or rolls up high. Perfect for windy local transits.',
    localStock: 15,
    deliveryTime: '90-Min Delivery',
    reviews: [
      { id: 'r8_1', author: 'Hugo L.', rating: 4, comment: 'Perfect stretch, is warm but doesn’t sweat my scalp. Very tidy design.', date: 'April 15, 2026' }
    ]
  }
];

export const CITIES = ['San Francisco', 'New York', 'Brooklyn', 'Los Angeles', 'Seattle', 'Chicago'];

export const DELIVERY_OPTIONS = [
  { id: 'del_express', name: 'Rapid Courier (Bike/Scooter)', price: 12.99, time: '1-2 Hours Delivery' },
  { id: 'del_same', name: 'Same-Day Local Delivery', price: 4.99, time: 'By 7:00 PM Today' },
  { id: 'del_overnight', name: 'Premium Overnight Delivery', price: 8.99, time: 'By 9:00 AM Tomorrow' }
];
