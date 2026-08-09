import {
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Factory,
  Gamepad2,
  Gem,
  Hammer,
  Luggage,
  PawPrint,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface MegaMenuLink {
  label: string;
  href: string;
  badge?: "new" | "hot" | "sale";
}

export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuPromo {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

export interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  columns: MegaMenuColumn[];
  promo: MegaMenuPromo;
}

export const navCategories: NavCategory[] = [
  {
    label: "Electronics",
    href: "/category/electronics",
    icon: Smartphone,
    columns: [
      {
        title: "Mobiles & Tablets",
        links: [
          { label: "Smartphones", href: "/category/electronics/smartphones", badge: "hot" },
          { label: "Tablets", href: "/category/electronics/tablets" },
          { label: "Smartwatches", href: "/category/electronics/smartwatches", badge: "new" },
          { label: "Mobile Accessories", href: "/category/electronics/mobile-accessories" },
          { label: "Power Banks", href: "/category/electronics/power-banks" },
        ],
      },
      {
        title: "Computers & Laptops",
        links: [
          { label: "Laptops", href: "/category/electronics/laptops" },
          { label: "Desktops", href: "/category/electronics/desktops" },
          { label: "Monitors", href: "/category/electronics/monitors" },
          { label: "Keyboards & Mice", href: "/category/electronics/keyboards-mice" },
          { label: "Storage & Drives", href: "/category/electronics/storage" },
        ],
      },
      {
        title: "Audio & Cameras",
        links: [
          { label: "Headphones", href: "/category/electronics/headphones" },
          { label: "Speakers", href: "/category/electronics/speakers" },
          { label: "Cameras", href: "/category/electronics/cameras" },
          { label: "Action Cameras", href: "/category/electronics/action-cameras" },
          { label: "Drones", href: "/category/electronics/drones", badge: "new" },
        ],
      },
      {
        title: "Smart Home",
        links: [
          { label: "Smart Lighting", href: "/category/electronics/smart-lighting" },
          { label: "Security Cameras", href: "/category/electronics/security-cameras" },
          { label: "Smart Plugs", href: "/category/electronics/smart-plugs" },
          { label: "Robot Vacuums", href: "/category/electronics/robot-vacuums" },
          { label: "Smart Displays", href: "/category/electronics/smart-displays" },
        ],
      },
    ],
    promo: {
      title: "Up to 60% off",
      subtitle: "Smart gadgets & accessories — weekly deals",
      cta: "Shop Electronics",
      href: "/deals/electronics",
    },
  },
  {
    label: "Fashion",
    href: "/category/fashion",
    icon: Shirt,
    columns: [
      {
        title: "Women's Fashion",
        links: [
          { label: "Dresses", href: "/category/fashion/women/dresses", badge: "new" },
          { label: "Tops & Tees", href: "/category/fashion/women/tops" },
          { label: "Ethnic Wear", href: "/category/fashion/women/ethnic" },
          { label: "Activewear", href: "/category/fashion/women/activewear" },
          { label: "Outerwear", href: "/category/fashion/women/outerwear" },
        ],
      },
      {
        title: "Men's Fashion",
        links: [
          { label: "Shirts", href: "/category/fashion/men/shirts" },
          { label: "T-Shirts", href: "/category/fashion/men/t-shirts" },
          { label: "Jeans & Trousers", href: "/category/fashion/men/jeans" },
          { label: "Suits & Blazers", href: "/category/fashion/men/suits" },
          { label: "Activewear", href: "/category/fashion/men/activewear" },
        ],
      },
      {
        title: "Footwear",
        links: [
          { label: "Sneakers", href: "/category/fashion/footwear/sneakers", badge: "hot" },
          { label: "Formal Shoes", href: "/category/fashion/footwear/formal" },
          { label: "Sandals & Slippers", href: "/category/fashion/footwear/sandals" },
          { label: "Boots", href: "/category/fashion/footwear/boots" },
          { label: "Sports Shoes", href: "/category/fashion/footwear/sports" },
        ],
      },
      {
        title: "Bags & Accessories",
        links: [
          { label: "Handbags", href: "/category/fashion/accessories/handbags" },
          { label: "Backpacks", href: "/category/fashion/accessories/backpacks" },
          { label: "Wallets", href: "/category/fashion/accessories/wallets" },
          { label: "Belts", href: "/category/fashion/accessories/belts" },
          { label: "Sunglasses", href: "/category/fashion/accessories/sunglasses" },
        ],
      },
    ],
    promo: {
      title: "New Season",
      subtitle: "Fresh arrivals from verified fashion sellers",
      cta: "Shop Fashion",
      href: "/deals/fashion",
    },
  },
  {
    label: "Home & Living",
    href: "/category/home-living",
    icon: Sofa,
    columns: [
      {
        title: "Furniture",
        links: [
          { label: "Sofas & Couches", href: "/category/home-living/sofas" },
          { label: "Beds & Mattresses", href: "/category/home-living/beds" },
          { label: "Tables & Chairs", href: "/category/home-living/tables-chairs" },
          { label: "Wardrobes", href: "/category/home-living/wardrobes" },
          { label: "Office Furniture", href: "/category/home-living/office-furniture" },
        ],
      },
      {
        title: "Kitchen & Dining",
        links: [
          { label: "Cookware", href: "/category/home-living/cookware" },
          { label: "Dinnerware", href: "/category/home-living/dinnerware" },
          { label: "Kitchen Appliances", href: "/category/home-living/kitchen-appliances", badge: "hot" },
          { label: "Storage & Organization", href: "/category/home-living/storage" },
          { label: "Cutlery", href: "/category/home-living/cutlery" },
        ],
      },
      {
        title: "Home Decor",
        links: [
          { label: "Wall Art", href: "/category/home-living/wall-art" },
          { label: "Lighting", href: "/category/home-living/lighting" },
          { label: "Rugs & Carpets", href: "/category/home-living/rugs" },
          { label: "Curtains", href: "/category/home-living/curtains" },
          { label: "Clocks", href: "/category/home-living/clocks" },
        ],
      },
      {
        title: "Garden & Outdoor",
        links: [
          { label: "Outdoor Furniture", href: "/category/home-living/outdoor-furniture" },
          { label: "Garden Tools", href: "/category/home-living/garden-tools" },
          { label: "Planters", href: "/category/home-living/planters" },
          { label: "Grills & Outdoor Cooking", href: "/category/home-living/grills" },
          { label: "Patio Heaters", href: "/category/home-living/patio-heaters", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Furnish for Less",
      subtitle: "Save big on furniture & home decor",
      cta: "Shop Home & Living",
      href: "/deals/home-living",
    },
  },
  {
    label: "Beauty & Health",
    href: "/category/beauty-health",
    icon: Sparkles,
    columns: [
      {
        title: "Skincare",
        links: [
          { label: "Moisturizers", href: "/category/beauty-health/moisturizers" },
          { label: "Cleansers", href: "/category/beauty-health/cleansers" },
          { label: "Serums & Oils", href: "/category/beauty-health/serums", badge: "hot" },
          { label: "Sunscreen", href: "/category/beauty-health/sunscreen" },
          { label: "Face Masks", href: "/category/beauty-health/masks" },
        ],
      },
      {
        title: "Makeup",
        links: [
          { label: "Face", href: "/category/beauty-health/makeup/face" },
          { label: "Eyes", href: "/category/beauty-health/makeup/eyes" },
          { label: "Lips", href: "/category/beauty-health/makeup/lips" },
          { label: "Makeup Tools", href: "/category/beauty-health/makeup/tools" },
          { label: "Makeup Sets", href: "/category/beauty-health/makeup/sets" },
        ],
      },
      {
        title: "Hair Care",
        links: [
          { label: "Shampoo & Conditioner", href: "/category/beauty-health/hair/shampoo" },
          { label: "Hair Styling", href: "/category/beauty-health/hair/styling" },
          { label: "Hair Color", href: "/category/beauty-health/hair/color" },
          { label: "Hair Tools", href: "/category/beauty-health/hair/tools" },
        ],
      },
      {
        title: "Health & Wellness",
        links: [
          { label: "Vitamins & Supplements", href: "/category/beauty-health/wellness/vitamins" },
          { label: "Personal Care", href: "/category/beauty-health/wellness/personal-care" },
          { label: "Medical Supplies", href: "/category/beauty-health/wellness/medical" },
          { label: "Fitness Nutrition", href: "/category/beauty-health/wellness/fitness-nutrition", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Buy 1 Get 1",
      subtitle: "On selected beauty & wellness brands",
      cta: "Shop Beauty",
      href: "/deals/beauty-health",
    },
  },
  {
    label: "Industrial & B2B",
    href: "/category/industrial-b2b",
    icon: Factory,
    columns: [
      {
        title: "Machinery & Equipment",
        links: [
          { label: "Industrial Machinery", href: "/category/industrial-b2b/machinery" },
          { label: "Construction Equipment", href: "/category/industrial-b2b/construction" },
          { label: "Packaging Machinery", href: "/category/industrial-b2b/packaging-machinery" },
          { label: "Agricultural Machinery", href: "/category/industrial-b2b/agricultural" },
        ],
      },
      {
        title: "Raw Materials",
        links: [
          { label: "Metals & Alloys", href: "/category/industrial-b2b/metals" },
          { label: "Plastics & Polymers", href: "/category/industrial-b2b/plastics" },
          { label: "Textiles & Fabrics", href: "/category/industrial-b2b/textiles" },
          { label: "Chemicals", href: "/category/industrial-b2b/chemicals" },
        ],
      },
      {
        title: "Office & Business Supplies",
        links: [
          { label: "Office Electronics", href: "/category/industrial-b2b/office-electronics" },
          { label: "Stationery", href: "/category/industrial-b2b/stationery" },
          { label: "Printing & Packaging", href: "/category/industrial-b2b/printing-packaging" },
          { label: "Safety Equipment", href: "/category/industrial-b2b/safety-equipment" },
        ],
      },
      {
        title: "Tools & Hardware",
        links: [
          { label: "Power Tools", href: "/category/industrial-b2b/power-tools" },
          { label: "Hand Tools", href: "/category/industrial-b2b/hand-tools" },
          { label: "Fasteners", href: "/category/industrial-b2b/fasteners" },
          { label: "Measuring Instruments", href: "/category/industrial-b2b/measuring-instruments" },
        ],
      },
    ],
    promo: {
      title: "Bulk Orders",
      subtitle: "Request a custom quote from verified suppliers",
      cta: "Request Quote",
      href: "/b2b/request-quote",
    },
  },
  {
    label: "Sports & Outdoors",
    href: "/category/sports-outdoors",
    icon: Dumbbell,
    columns: [
      {
        title: "Exercise & Fitness",
        links: [
          { label: "Gym Equipment", href: "/category/sports-outdoors/gym-equipment" },
          { label: "Yoga & Pilates", href: "/category/sports-outdoors/yoga" },
          { label: "Cardio Machines", href: "/category/sports-outdoors/cardio" },
          { label: "Strength Training", href: "/category/sports-outdoors/strength" },
        ],
      },
      {
        title: "Outdoor Recreation",
        links: [
          { label: "Camping & Hiking", href: "/category/sports-outdoors/camping" },
          { label: "Cycling", href: "/category/sports-outdoors/cycling" },
          { label: "Fishing", href: "/category/sports-outdoors/fishing" },
          { label: "Travel Gear", href: "/category/sports-outdoors/travel-gear" },
        ],
      },
      {
        title: "Team Sports",
        links: [
          { label: "Football", href: "/category/sports-outdoors/football" },
          { label: "Cricket", href: "/category/sports-outdoors/cricket" },
          { label: "Basketball", href: "/category/sports-outdoors/basketball" },
          { label: "Badminton", href: "/category/sports-outdoors/badminton" },
        ],
      },
      {
        title: "Sportswear",
        links: [
          { label: "Activewear", href: "/category/sports-outdoors/activewear" },
          { label: "Sports Shoes", href: "/category/sports-outdoors/sports-shoes" },
          { label: "Sports Accessories", href: "/category/sports-outdoors/accessories", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Gear Up",
      subtitle: "Top brands for fitness & outdoor adventures",
      cta: "Shop Sports",
      href: "/deals/sports-outdoors",
    },
  },
  {
    label: "Automotive",
    href: "/category/automotive",
    icon: Car,
    columns: [
      {
        title: "Car Accessories",
        links: [
          { label: "Interior Accessories", href: "/category/automotive/interior" },
          { label: "Exterior Accessories", href: "/category/automotive/exterior" },
          { label: "Car Electronics", href: "/category/automotive/electronics" },
          { label: "Car Care", href: "/category/automotive/care" },
        ],
      },
      {
        title: "Parts & Spares",
        links: [
          { label: "Engine Parts", href: "/category/automotive/engine-parts" },
          { label: "Brakes & Suspension", href: "/category/automotive/brakes-suspension" },
          { label: "Lighting", href: "/category/automotive/lighting" },
          { label: "Tyres & Wheels", href: "/category/automotive/tyres-wheels" },
        ],
      },
      {
        title: "Motorcycle",
        links: [
          { label: "Helmets & Gear", href: "/category/automotive/helmets-gear" },
          { label: "Parts & Accessories", href: "/category/automotive/moto-parts" },
          { label: "Riding Gear", href: "/category/automotive/riding-gear" },
        ],
      },
      {
        title: "Tools & Equipment",
        links: [
          { label: "Diagnostic Tools", href: "/category/automotive/diagnostic-tools" },
          { label: "Garage Equipment", href: "/category/automotive/garage-equipment" },
          { label: "Lubricants & Fluids", href: "/category/automotive/lubricants" },
        ],
      },
    ],
    promo: {
      title: "Genuine Parts",
      subtitle: "Verified sellers, fast worldwide shipping",
      cta: "Shop Automotive",
      href: "/deals/automotive",
    },
  },
  {
    label: "Books & Stationery",
    href: "/category/books-stationery",
    icon: BookOpen,
    columns: [
      {
        title: "Books",
        links: [
          { label: "Fiction", href: "/category/books-stationery/fiction" },
          { label: "Non-Fiction", href: "/category/books-stationery/non-fiction" },
          { label: "Children's Books", href: "/category/books-stationery/childrens" },
          { label: "Academic & Textbooks", href: "/category/books-stationery/academic" },
        ],
      },
      {
        title: "Stationery & Office",
        links: [
          { label: "Notebooks & Diaries", href: "/category/books-stationery/notebooks" },
          { label: "Pens & Writing", href: "/category/books-stationery/pens" },
          { label: "Art Supplies", href: "/category/books-stationery/art-supplies", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Back to School",
      subtitle: "Notebooks, pens & supplies at low prices",
      cta: "Shop Stationery",
      href: "/deals/books-stationery",
    },
  },
  {
    label: "Toys & Games",
    href: "/category/toys-games",
    icon: Gamepad2,
    columns: [
      {
        title: "Toys",
        links: [
          { label: "Action Figures", href: "/category/toys-games/action-figures" },
          { label: "Building Sets", href: "/category/toys-games/building-sets", badge: "hot" },
          { label: "Educational Toys", href: "/category/toys-games/educational" },
          { label: "Outdoor Toys", href: "/category/toys-games/outdoor" },
        ],
      },
      {
        title: "Games",
        links: [
          { label: "Board Games", href: "/category/toys-games/board-games" },
          { label: "Puzzles", href: "/category/toys-games/puzzles" },
          { label: "Video Games", href: "/category/toys-games/video-games", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Playtime Deals",
      subtitle: "Top-rated toys and games for every age",
      cta: "Shop Toys",
      href: "/deals/toys-games",
    },
  },
  {
    label: "Groceries & Gourmet",
    href: "/category/groceries-gourmet",
    icon: ShoppingBasket,
    columns: [
      {
        title: "Pantry Staples",
        links: [
          { label: "Rice & Grains", href: "/category/groceries-gourmet/rice-grains" },
          { label: "Cooking Oils", href: "/category/groceries-gourmet/oils" },
          { label: "Spices & Seasonings", href: "/category/groceries-gourmet/spices" },
        ],
      },
      {
        title: "Snacks & Beverages",
        links: [
          { label: "Snacks", href: "/category/groceries-gourmet/snacks" },
          { label: "Tea & Coffee", href: "/category/groceries-gourmet/tea-coffee" },
          { label: "Gourmet & Specialty", href: "/category/groceries-gourmet/gourmet", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "Pantry Restock",
      subtitle: "Everyday essentials delivered to your door",
      cta: "Shop Groceries",
      href: "/deals/groceries-gourmet",
    },
  },
  {
    label: "Pet Supplies",
    href: "/category/pet-supplies",
    icon: PawPrint,
    columns: [
      {
        title: "Food & Treats",
        links: [
          { label: "Dog Food", href: "/category/pet-supplies/dog-food" },
          { label: "Cat Food", href: "/category/pet-supplies/cat-food" },
          { label: "Treats", href: "/category/pet-supplies/treats" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Beds & Furniture", href: "/category/pet-supplies/beds" },
          { label: "Toys", href: "/category/pet-supplies/toys" },
          { label: "Grooming", href: "/category/pet-supplies/grooming", badge: "hot" },
        ],
      },
    ],
    promo: {
      title: "Happy Pets",
      subtitle: "Food, toys & care essentials for your pets",
      cta: "Shop Pet Supplies",
      href: "/deals/pet-supplies",
    },
  },
  {
    label: "Baby & Kids",
    href: "/category/baby-kids",
    icon: Baby,
    columns: [
      {
        title: "Baby Care",
        links: [
          { label: "Diapers & Wipes", href: "/category/baby-kids/diapers" },
          { label: "Feeding", href: "/category/baby-kids/feeding" },
          { label: "Baby Gear", href: "/category/baby-kids/gear" },
        ],
      },
      {
        title: "Kids",
        links: [
          { label: "Kids' Clothing", href: "/category/baby-kids/clothing", badge: "new" },
          { label: "School Bags", href: "/category/baby-kids/school-bags" },
          { label: "Kids' Footwear", href: "/category/baby-kids/footwear" },
        ],
      },
    ],
    promo: {
      title: "Little Ones",
      subtitle: "Everything for baby & kids, all in one place",
      cta: "Shop Baby & Kids",
      href: "/deals/baby-kids",
    },
  },
  {
    label: "Jewelry & Watches",
    href: "/category/jewelry-watches",
    icon: Gem,
    columns: [
      {
        title: "Jewelry",
        links: [
          { label: "Necklaces", href: "/category/jewelry-watches/necklaces" },
          { label: "Earrings", href: "/category/jewelry-watches/earrings" },
          { label: "Rings", href: "/category/jewelry-watches/rings", badge: "hot" },
        ],
      },
      {
        title: "Watches",
        links: [
          { label: "Men's Watches", href: "/category/jewelry-watches/mens-watches" },
          { label: "Women's Watches", href: "/category/jewelry-watches/womens-watches" },
        ],
      },
    ],
    promo: {
      title: "Shine Bright",
      subtitle: "Elegant jewelry & watches at honest prices",
      cta: "Shop Jewelry",
      href: "/deals/jewelry-watches",
    },
  },
  {
    label: "Tools & Home Improvement",
    href: "/category/tools-home-improvement",
    icon: Hammer,
    columns: [
      {
        title: "Hand & Power Tools",
        links: [
          { label: "Power Drills", href: "/category/tools-home-improvement/drills" },
          { label: "Hand Tools", href: "/category/tools-home-improvement/hand-tools" },
          { label: "Tool Storage", href: "/category/tools-home-improvement/storage" },
        ],
      },
      {
        title: "Home Improvement",
        links: [
          { label: "Paint & Supplies", href: "/category/tools-home-improvement/paint" },
          { label: "Plumbing", href: "/category/tools-home-improvement/plumbing" },
          { label: "Electrical", href: "/category/tools-home-improvement/electrical", badge: "new" },
        ],
      },
    ],
    promo: {
      title: "DIY Essentials",
      subtitle: "Tools & supplies for every home project",
      cta: "Shop Tools",
      href: "/deals/tools-home-improvement",
    },
  },
  {
    label: "Travel & Luggage",
    href: "/category/travel-luggage",
    icon: Luggage,
    columns: [
      {
        title: "Luggage",
        links: [
          { label: "Suitcases", href: "/category/travel-luggage/suitcases", badge: "sale" },
          { label: "Duffel Bags", href: "/category/travel-luggage/duffel-bags" },
          { label: "Travel Backpacks", href: "/category/travel-luggage/backpacks" },
        ],
      },
      {
        title: "Travel Accessories",
        links: [
          { label: "Packing Organizers", href: "/category/travel-luggage/organizers" },
          { label: "Travel Pillows", href: "/category/travel-luggage/pillows" },
          { label: "Adapters & Electronics", href: "/category/travel-luggage/adapters" },
        ],
      },
    ],
    promo: {
      title: "Pack Smart",
      subtitle: "Durable luggage & travel gear for every trip",
      cta: "Shop Travel",
      href: "/deals/travel-luggage",
    },
  },
];
