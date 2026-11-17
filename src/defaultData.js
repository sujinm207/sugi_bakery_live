/* Snapshot of the menu bundled at build time.
   Only used if the API can't be reached, so the shop still renders
   something instead of an empty page. The live source of truth is
   server/data/products.json, edited through /admin. */

export const DEFAULT_PRODUCTS = [
  {
    id: 1, name: 'Banana Chips', emoji: '🍌', tag: 'Kerala Classic', tagStyle: 'crispy',
    description: 'Crispy golden banana chips made from fresh Kerala bananas',
    image: '/images/banana_chips_outdoor.webp',
    sizes: [{ name: '250g', price: 80 }, { name: '500g', price: 160 }, { name: '1kg', price: 320 }]
  },
  {
    id: 2, name: 'Mixture', emoji: '🥜', tag: 'Crowd Favourite', tagStyle: 'classic',
    description: 'Traditional South Indian mixture with peanuts, curry leaves and spices',
    image: '/images/mixture_snacks.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 3, name: 'Seeval', emoji: '🍜', tag: 'Tea Time', tagStyle: 'crispy',
    description: 'Thin and crispy rice noodles, perfect tea-time snack',
    image: '/images/seeval.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 4, name: 'Karasev', emoji: '🌶️', tag: 'Spicy', tagStyle: 'hot',
    description: 'Spicy and crunchy gram flour noodles with authentic taste',
    image: '/images/karasev.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 5, name: 'Oma Podi', emoji: '🌿', tag: 'Traditional', tagStyle: 'classic',
    description: "Traditional grandmother's recipe podi with aromatic spices",
    image: '/images/omapodi.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 6, name: 'Arisi Muruku', emoji: '🌀', tag: 'Extra Crunchy', tagStyle: 'crispy',
    description: 'Spiral-shaped rice flour snack, crispy and delicious',
    image: '/images/muruku.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 7, name: 'Pakoda', emoji: '🥟', tag: 'Fried Fresh', tagStyle: 'classic',
    description: 'Crispy deep-fried fritters with spices and herbs',
    image: '/images/pakkoda_image.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 8, name: 'Masala Kadalai', emoji: '🥜', tag: 'Masala', tagStyle: 'hot',
    description: 'Spicy roasted peanuts with aromatic masala coating',
    image: '/images/kadalai_image.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  },
  {
    id: 9, name: 'Red Andhra Murukku', emoji: '🌶️', tag: 'Fiery Hot', tagStyle: 'hot',
    description: 'Spicy red chili flavored murukku from Andhra style',
    image: '/images/red-andhra-murukku.webp',
    sizes: [{ name: '250g', price: 60 }, { name: '500g', price: 120 }, { name: '1kg', price: 240 }]
  }
];

export const DEFAULT_SETTINGS = {
  name: 'Sugi Bakery',
  tagline: 'Handmade snacks from Kanyakumari',
  phone: '+91 96774 94302',
  phoneRaw: '919677494302',
  address: 'Madhavapuram Junction\nKanyakumari — 629702',
  hours: 'Mon–Sat: 9:00 AM – 10:00 PM\nSun: 10:00 AM – 10:00 PM',
  freeDeliveryAbove: 500,
  promo: [
    '🚚 FREE HOME DELIVERY on orders above ₹500',
    '👐 Handmade in small batches',
    '🌿 Locally sourced ingredients',
    '🥨 Traditional South Indian recipes'
  ]
};
