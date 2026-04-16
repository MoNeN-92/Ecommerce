import type { Locale } from "@/lib/i18n/config";

type Messages = {
  nav: {
    products: string;
    deals: string;
    account: string;
    cart: string;
    wishlist: string;
    admin: string;
    signIn: string;
    signOut: string;
  };
  home: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trending: string;
    categories: string;
    featuredDeals: string;
    trust: string;
  };
  catalog: {
    filters: string;
    sort: string;
    newest: string;
    priceLowHigh: string;
    priceHighLow: string;
    popularity: string;
    inStock: string;
    brand: string;
    category: string;
    noResults: string;
  };
  product: {
    addToCart: string;
    buyNow: string;
    related: string;
    specs: string;
    inStock: string;
    outOfStock: string;
    reviews: string;
  };
  cart: {
    title: string;
    empty: string;
    checkout: string;
    subtotal: string;
    shipping: string;
    total: string;
  };
  checkout: {
    title: string;
    guestTitle: string;
    orderSummary: string;
    placeOrder: string;
    payment: string;
    address: string;
  };
  account: {
    title: string;
    orders: string;
    addresses: string;
    profile: string;
  };
  admin: {
    dashboard: string;
    products: string;
    orders: string;
    categories: string;
    analytics: string;
  };
};

const messages: Record<Locale, Messages> = {
  ka: {
    nav: {
      products: "პროდუქტები",
      deals: "აქციები",
      account: "ანგარიში",
      cart: "კალათა",
      wishlist: "სურვილები",
      admin: "ადმინი",
      signIn: "შესვლა",
      signOut: "გასვლა"
    },
    home: {
      headline: "სწრაფი ელექტრონიკა ქართული ბაზრისთვის",
      subheadline:
        "მობილურები, ყურსასმენები, დამტენები და ყოველდღიური გაჯეტები სწრაფი მიწოდებით მთელ საქართველოში.",
      ctaPrimary: "პროდუქტების ნახვა",
      ctaSecondary: "დღის შეთავაზებები",
      trending: "ტრენდული პროდუქტები",
      categories: "პოპულარული კატეგორიები",
      featuredDeals: "რჩეული შეთავაზებები",
      trust: "ოფიციალური გარანტია და უსაფრთხო გადახდა"
    },
    catalog: {
      filters: "ფილტრები",
      sort: "სორტირება",
      newest: "უახლესი",
      priceLowHigh: "ფასი: ზრდადი",
      priceHighLow: "ფასი: კლებადი",
      popularity: "პოპულარობა",
      inStock: "მარაგში",
      brand: "ბრენდი",
      category: "კატეგორია",
      noResults: "პროდუქტები ვერ მოიძებნა"
    },
    product: {
      addToCart: "კალათაში დამატება",
      buyNow: "ახლავე ყიდვა",
      related: "მსგავსი პროდუქტები",
      specs: "ტექნიკური მახასიათებლები",
      inStock: "მარაგშია",
      outOfStock: "ამოწურულია",
      reviews: "შეფასებები"
    },
    cart: {
      title: "კალათა",
      empty: "კალათა ცარიელია",
      checkout: "გადახდა",
      subtotal: "ჯამი",
      shipping: "მიწოდება",
      total: "სულ"
    },
    checkout: {
      title: "შეკვეთის გაფორმება",
      guestTitle: "სტუმრის შეკვეთა",
      orderSummary: "შეკვეთის შეჯამება",
      placeOrder: "შეკვეთის დადასტურება",
      payment: "გადახდა",
      address: "მისამართი"
    },
    account: {
      title: "ჩემი ანგარიში",
      orders: "შეკვეთები",
      addresses: "მისამართები",
      profile: "პროფილი"
    },
    admin: {
      dashboard: "ადმინისტრირება",
      products: "პროდუქტები",
      orders: "შეკვეთები",
      categories: "კატეგორიები",
      analytics: "ანალიტიკა"
    }
  },
  en: {
    nav: {
      products: "Products",
      deals: "Deals",
      account: "Account",
      cart: "Cart",
      wishlist: "Wishlist",
      admin: "Admin",
      signIn: "Sign in",
      signOut: "Sign out"
    },
    home: {
      headline: "Fast electronics retail built for Georgia",
      subheadline:
        "Phones, headphones, chargers, and daily tech essentials with fast delivery across Georgia.",
      ctaPrimary: "Browse products",
      ctaSecondary: "Today’s deals",
      trending: "Trending products",
      categories: "Popular categories",
      featuredDeals: "Featured deals",
      trust: "Official warranty and secure payments"
    },
    catalog: {
      filters: "Filters",
      sort: "Sort",
      newest: "Newest",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      popularity: "Popularity",
      inStock: "In stock",
      brand: "Brand",
      category: "Category",
      noResults: "No products found"
    },
    product: {
      addToCart: "Add to cart",
      buyNow: "Buy now",
      related: "Related products",
      specs: "Technical specifications",
      inStock: "In stock",
      outOfStock: "Out of stock",
      reviews: "Reviews"
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      checkout: "Checkout",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total"
    },
    checkout: {
      title: "Checkout",
      guestTitle: "Guest checkout",
      orderSummary: "Order summary",
      placeOrder: "Place order",
      payment: "Payment",
      address: "Address"
    },
    account: {
      title: "My account",
      orders: "Orders",
      addresses: "Addresses",
      profile: "Profile"
    },
    admin: {
      dashboard: "Admin",
      products: "Products",
      orders: "Orders",
      categories: "Categories",
      analytics: "Analytics"
    }
  }
};

export function getMessages(locale: Locale) {
  return messages[locale];
}
