import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { getDemoCategoryImage, getDemoProductImages } from "./demo-media";

const prisma = new PrismaClient();
const shouldReset = process.env.SEED_RESET === "true";

const categories = [
  {
    slug: "phones",
    nameKa: "ტელეფონები",
    nameEn: "Phones",
    descriptionKa: "ფლაგმანები და ყოველდღიური სმარტფონები წამყვანი ბრენდებისგან.",
    descriptionEn: "Flagship and everyday smartphones from top brands.",
    featured: true,
    image: getDemoCategoryImage("phones")
  },
  {
    slug: "headphones",
    nameKa: "ყურსასმენები",
    nameEn: "Headphones",
    descriptionKa: "უსადენო, პრემიუმ და ყოველდღიური აუდიო მოწყობილობები.",
    descriptionEn: "Wireless, premium, and everyday audio devices.",
    featured: true,
    image: getDemoCategoryImage("headphones")
  },
  {
    slug: "chargers",
    nameKa: "დამტენები",
    nameEn: "Chargers",
    descriptionKa: "სწრაფი დამტენები, კაბელები და ენერგიის აქსესუარები.",
    descriptionEn: "Fast chargers, cables, and power accessories.",
    featured: true,
    image: getDemoCategoryImage("chargers")
  },
  {
    slug: "gadgets",
    nameKa: "გაჯეტები",
    nameEn: "Gadgets",
    descriptionKa: "ჭკვიანი საათები, ტაბლეტები და ყოველდღიური ტექნიკა.",
    descriptionEn: "Smartwatches, tablets, and everyday tech.",
    featured: true,
    image: getDemoCategoryImage("gadgets")
  }
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildSku(brand: string, model: string) {
  const brandCode = brand.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();
  const modelCode = model.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
  return `${brandCode}-${modelCode}`;
}

function buildKeywords(brand: string, model: string, categorySlug: string) {
  const words = model
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .slice(0, 3);

  return Array.from(new Set([brand.toLowerCase(), ...words, categorySlug]));
}

function buildProduct({
  categorySlug,
  brand,
  model,
  descriptionKa,
  descriptionEn,
  shortKa,
  shortEn,
  price,
  compareAtPrice,
  stock,
  featured = false,
  topProduct = false,
  installmentAvailable = true,
  specs
}: {
  categorySlug: "phones" | "headphones" | "chargers" | "gadgets";
  brand: string;
  model: string;
  descriptionKa: string;
  descriptionEn: string;
  shortKa: string;
  shortEn: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  featured?: boolean;
  topProduct?: boolean;
  installmentAvailable?: boolean;
  specs: Record<string, string>;
}) {
  const slug = slugify(`${brand} ${model}`);
  const fullName = `${brand} ${model}`;

  return {
    slug,
    sku: buildSku(brand, model),
    brand,
    categorySlug,
    nameKa: fullName,
    nameEn: fullName,
    shortDescriptionKa: shortKa,
    shortDescriptionEn: shortEn,
    descriptionKa,
    descriptionEn,
    seoTitleKa: `${fullName} ონლაინ მაღაზიაში საქართველოში`,
    seoTitleEn: `${fullName} in our online store in Georgia`,
    seoDescriptionKa: `${fullName} სწრაფი მიწოდებით, გარანტიით და უსაფრთხო შეკვეთით.`,
    seoDescriptionEn: `${fullName} with fast delivery, warranty, and secure ordering.`,
    price: price.toFixed(2),
    compareAtPrice: compareAtPrice ? compareAtPrice.toFixed(2) : null,
    stock,
    featured,
    published: true,
    topProduct,
    installmentAvailable,
    metaKeywords: buildKeywords(brand, model, categorySlug),
    images: getDemoProductImages(categorySlug),
    specs
  };
}

const products = [
  buildProduct({
    categorySlug: "phones",
    brand: "Apple",
    model: "iPhone 15 Pro 256GB",
    shortKa: "ტიტანის კორპუსი, სწრაფი ჩიპი და მაღალი კლასის კამერები.",
    shortEn: "Titanium body, fast chipset, and premium cameras.",
    descriptionKa: "iPhone 15 Pro 256GB განკუთვნილია მათთვის, ვისაც სჭირდება მაღალი წარმადობა, გამძლე მასალა და საიმედო კამერის სისტემა ყოველდღიური გამოყენებისთვის.",
    descriptionEn: "iPhone 15 Pro 256GB is designed for users who need strong performance, durable materials, and a reliable camera system for daily use.",
    price: 3799,
    compareAtPrice: 3999,
    stock: 14,
    featured: true,
    topProduct: true,
    installmentAvailable: true,
    specs: { display: "6.1-inch OLED", storage: "256GB", chip: "A17 Pro", camera: "48MP", battery: "3274mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Apple",
    model: "iPhone 15 128GB",
    shortKa: "სტაბილური მუშაობა, ხარისხიანი ეკრანი და Apple-ის ეკოსისტემა.",
    shortEn: "Stable performance, quality display, and Apple ecosystem integration.",
    descriptionKa: "iPhone 15 128GB არის დაბალანსებული არჩევანი ყოველდღიური კომუნიკაციის, ფოტოების და მობილური სამუშაოსთვის.",
    descriptionEn: "iPhone 15 128GB is a balanced choice for communication, photography, and mobile work.",
    price: 2999,
    compareAtPrice: 3199,
    stock: 18,
    featured: true,
    installmentAvailable: true,
    specs: { display: "6.1-inch OLED", storage: "128GB", chip: "A16 Bionic", camera: "48MP", battery: "3349mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Apple",
    model: "iPhone 14 128GB",
    shortKa: "გამოცდილი მოდელი ყოველდღიური მოხმარებისთვის.",
    shortEn: "A proven model for everyday use.",
    descriptionKa: "iPhone 14 128GB გამოირჩევა საიმედო მუშაობით, კარგი კამერით და ენერგოეფექტური სისტემით.",
    descriptionEn: "iPhone 14 128GB offers reliable performance, a capable camera, and efficient battery behavior.",
    price: 2399,
    compareAtPrice: 2599,
    stock: 9,
    specs: { display: "6.1-inch OLED", storage: "128GB", chip: "A15 Bionic", camera: "12MP Dual", battery: "3279mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Samsung",
    model: "Galaxy S25 128GB",
    shortKa: "პრემიუმ Android გამოცდილება და ნათელი AMOLED ეკრანი.",
    shortEn: "Premium Android experience with a vivid AMOLED display.",
    descriptionKa: "Galaxy S25 128GB უზრუნველყოფს სწრაფ სისტემას, ხარისხიან კამერებს და კომფორტულ დიზაინს ყოველდღიური გამოყენებისთვის.",
    descriptionEn: "Galaxy S25 128GB delivers speed, capable cameras, and a comfortable design for everyday use.",
    price: 2899,
    compareAtPrice: 3099,
    stock: 18,
    featured: true,
    topProduct: true,
    installmentAvailable: true,
    specs: { display: "6.2-inch AMOLED", storage: "128GB", ram: "12GB", camera: "50MP", battery: "4500mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Samsung",
    model: "Galaxy S24 FE 256GB",
    shortKa: "ძლიერი მახასიათებლები დაბალანსებულ ფასში.",
    shortEn: "Strong specifications at a balanced price.",
    descriptionKa: "Galaxy S24 FE 256GB განკუთვნილია მათთვის, ვისაც სურს ფართო მეხსიერება და კარგი ეკრანი კონკურენტულ ფასში.",
    descriptionEn: "Galaxy S24 FE 256GB is for customers who want generous storage and a strong display at a competitive price.",
    price: 2199,
    compareAtPrice: 2399,
    stock: 16,
    featured: true,
    installmentAvailable: true,
    specs: { display: "6.4-inch AMOLED", storage: "256GB", ram: "8GB", camera: "50MP", battery: "4700mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Xiaomi",
    model: "14T Pro 512GB",
    shortKa: "მაღალი მეხსიერება და სწრაფი დამუხტვა.",
    shortEn: "Large storage and fast charging.",
    descriptionKa: "Xiaomi 14T Pro 512GB გამოირჩევა ფართო მეხსიერებით, სწრაფი დამუხტვით და ძლიერი წარმადობით.",
    descriptionEn: "Xiaomi 14T Pro 512GB stands out with large storage, rapid charging, and strong performance.",
    price: 2099,
    compareAtPrice: 2299,
    stock: 13,
    featured: true,
    installmentAvailable: true,
    specs: { display: "6.67-inch AMOLED", storage: "512GB", ram: "12GB", camera: "50MP", battery: "5000mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Xiaomi",
    model: "Redmi Note 14 Pro 256GB",
    shortKa: "საშუალო კლასის გამართული არჩევანი დიდი ეკრანით.",
    shortEn: "A reliable mid-range choice with a large display.",
    descriptionKa: "Redmi Note 14 Pro 256GB აერთიანებს დიდ ეკრანს, კარგ ბატარეას და ყოველდღიური ამოცანებისთვის საკმარის წარმადობას.",
    descriptionEn: "Redmi Note 14 Pro 256GB combines a large display, strong battery life, and enough performance for everyday tasks.",
    price: 1199,
    compareAtPrice: 1349,
    stock: 22,
    installmentAvailable: true,
    specs: { display: "6.67-inch AMOLED", storage: "256GB", ram: "8GB", camera: "200MP", battery: "5110mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Google",
    model: "Pixel 9 128GB",
    shortKa: "სუფთა Android და ძლიერი კამერა.",
    shortEn: "Clean Android software and a strong camera.",
    descriptionKa: "Pixel 9 128GB განკუთვნილია მათთვის, ვისაც სურს სუფთა სისტემური გამოცდილება და მაღალი ხარისხის ფოტოები.",
    descriptionEn: "Pixel 9 128GB is built for users who want a clean software experience and high-quality photography.",
    price: 2499,
    compareAtPrice: 2699,
    stock: 10,
    featured: true,
    installmentAvailable: true,
    specs: { display: "6.3-inch OLED", storage: "128GB", ram: "12GB", camera: "50MP", battery: "4700mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Nothing",
    model: "Phone 2a 256GB",
    shortKa: "გამორჩეული დიზაინი და გამართული ყოველდღიური მუშაობა.",
    shortEn: "Distinctive design with smooth daily performance.",
    descriptionKa: "Nothing Phone 2a 256GB კარგი არჩევანია მათთვის, ვისაც სურს განსხვავებული დიზაინი და სტაბილური Android გამოცდილება.",
    descriptionEn: "Nothing Phone 2a 256GB is a strong choice for users who want a distinctive design and stable Android experience.",
    price: 1399,
    compareAtPrice: 1499,
    stock: 12,
    specs: { display: "6.7-inch AMOLED", storage: "256GB", ram: "12GB", camera: "50MP Dual", battery: "5000mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "OnePlus",
    model: "12R 256GB",
    shortKa: "სწრაფი ეკრანი და მაღალი წარმადობა.",
    shortEn: "Fast display and strong overall performance.",
    descriptionKa: "OnePlus 12R 256GB გამოირჩევა მაღალი განახლების ეკრანით, სწრაფი ჩიპით და გამძლე ბატარეით.",
    descriptionEn: "OnePlus 12R 256GB features a high-refresh display, a fast chipset, and dependable battery life.",
    price: 1899,
    compareAtPrice: 2049,
    stock: 11,
    installmentAvailable: true,
    specs: { display: "6.78-inch AMOLED", storage: "256GB", ram: "16GB", camera: "50MP", battery: "5500mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Honor",
    model: "200 Pro 512GB",
    shortKa: "ფართო მეხსიერება და შთამბეჭდავი ეკრანი.",
    shortEn: "Large storage and an impressive display.",
    descriptionKa: "Honor 200 Pro 512GB შექმნილია მათთვის, ვისაც სჭირდება მეტი მეხსიერება და ხარისხიანი გამოსახულება.",
    descriptionEn: "Honor 200 Pro 512GB is made for buyers who need more storage and a quality visual experience.",
    price: 1999,
    compareAtPrice: 2149,
    stock: 8,
    installmentAvailable: true,
    specs: { display: "6.78-inch OLED", storage: "512GB", ram: "12GB", camera: "50MP Triple", battery: "5200mAh" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "Motorola",
    model: "Edge 50 Fusion 256GB",
    shortKa: "თხელი კორპუსი და გამართული ყოველდღიური სისტემა.",
    shortEn: "Slim body with smooth day-to-day performance.",
    descriptionKa: "Motorola Edge 50 Fusion 256GB არის კომფორტული არჩევანი მათთვის, ვისაც უყვარს მსუბუქი დიზაინი და სტაბილური მუშაობა.",
    descriptionEn: "Motorola Edge 50 Fusion 256GB is a comfortable choice for users who prefer a light design and stable performance.",
    price: 1499,
    compareAtPrice: 1649,
    stock: 14,
    specs: { display: "6.7-inch pOLED", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5000mAh" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Sony",
    model: "WH-1000XM5",
    shortKa: "პრემიუმ ხმაურის ჩახშობა და კომფორტული ტარება.",
    shortEn: "Premium noise cancelling and comfortable wear.",
    descriptionKa: "Sony WH-1000XM5 არის მაღალი კლასის არჩევანი მუშაობისთვის, მოგზაურობისთვის და ყოველდღიური მუსიკისთვის.",
    descriptionEn: "Sony WH-1000XM5 is a high-end choice for work, travel, and everyday listening.",
    price: 999,
    compareAtPrice: 1149,
    stock: 11,
    featured: true,
    installmentAvailable: true,
    specs: { type: "Over-ear", connectivity: "Bluetooth 5.2", battery: "30 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Apple",
    model: "AirPods Pro 2 USB-C",
    shortKa: "ადაპტური ხმა და აქტიური ხმაურის ჩახშობა.",
    shortEn: "Adaptive audio with active noise cancellation.",
    descriptionKa: "AirPods Pro 2 USB-C კარგი არჩევანია Apple-ის ეკოსისტემაში სწრაფი დაკავშირებისა და კომფორტული გამოყენებისთვის.",
    descriptionEn: "AirPods Pro 2 USB-C is a strong option inside the Apple ecosystem, with fast pairing and comfortable everyday use.",
    price: 799,
    compareAtPrice: 899,
    stock: 20,
    featured: true,
    topProduct: true,
    installmentAvailable: true,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.3", battery: "6 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "JBL",
    model: "Tune 770NC",
    shortKa: "ყოველდღიური უსადენო ყურსასმენები ხმაურის ჩახშობით.",
    shortEn: "Everyday wireless headphones with noise cancelling.",
    descriptionKa: "JBL Tune 770NC აერთიანებს მსუბუქ კონსტრუქციას, კარგ ბატარეას და მარტივ მართვას.",
    descriptionEn: "JBL Tune 770NC combines a light build, strong battery life, and simple controls.",
    price: 349,
    compareAtPrice: 399,
    stock: 24,
    specs: { type: "Over-ear", connectivity: "Bluetooth 5.3", battery: "70 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "JBL",
    model: "Wave Beam",
    shortKa: "კომპაქტური ყურსასმენები ყოველდღიური გამოყენებისთვის.",
    shortEn: "Compact earbuds for daily use.",
    descriptionKa: "JBL Wave Beam არის პრაქტიკული არჩევანი ზარებისთვის, მუსიკისთვის და გადაადგილებისას გამოსაყენებლად.",
    descriptionEn: "JBL Wave Beam is a practical option for calls, music, and commuting.",
    price: 159,
    compareAtPrice: 189,
    stock: 30,
    installmentAvailable: false,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.2", battery: "8 hours", noiseCancelling: "No" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Anker",
    model: "Soundcore Liberty 4 NC",
    shortKa: "ხანგრძლივი ბატარეა და აქტიური ხმაურის ჩახშობა.",
    shortEn: "Long battery life with active noise cancellation.",
    descriptionKa: "Soundcore Liberty 4 NC გთავაზობთ დაბალანსებულ ხმას და კომფორტულ ფორმას ყოველდღიური გამოყენებისთვის.",
    descriptionEn: "Soundcore Liberty 4 NC offers balanced sound and a comfortable fit for daily use.",
    price: 279,
    compareAtPrice: 329,
    stock: 19,
    installmentAvailable: false,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.3", battery: "10 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Samsung",
    model: "Galaxy Buds3 Pro",
    shortKa: "კომპაქტური ფორმა და კარგი ხმის ხარისხი.",
    shortEn: "Compact fit with high-quality sound.",
    descriptionKa: "Galaxy Buds3 Pro შექმნილია მათთვის, ვისაც სურს მსუბუქი ყურსასმენები და მკაფიო ხმა.",
    descriptionEn: "Galaxy Buds3 Pro is designed for users who want lightweight earbuds and clear sound.",
    price: 499,
    compareAtPrice: 549,
    stock: 15,
    installmentAvailable: true,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.4", battery: "7 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Beats",
    model: "Studio Pro",
    shortKa: "გამოკვეთილი ხმა და პრემიუმ მასალები.",
    shortEn: "Bold sound with premium materials.",
    descriptionKa: "Beats Studio Pro გათვლილია მათთვის, ვისაც ძლიერი ხმა და გამორჩეული დიზაინი ურჩევნია.",
    descriptionEn: "Beats Studio Pro is aimed at buyers who prefer powerful sound and distinctive design.",
    price: 949,
    compareAtPrice: 1099,
    stock: 9,
    installmentAvailable: true,
    specs: { type: "Over-ear", connectivity: "Bluetooth 5.3", battery: "40 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Sony",
    model: "WF-1000XM5",
    shortKa: "მცირე ზომა და მაღალი კლასის ხმა.",
    shortEn: "Compact design with premium sound quality.",
    descriptionKa: "Sony WF-1000XM5 შესაფერისია მათთვის, ვისაც სურს მცირე ზომის, მაგრამ ძლიერი უსადენო ყურსასმენები.",
    descriptionEn: "Sony WF-1000XM5 suits buyers who want compact but powerful true wireless earbuds.",
    price: 749,
    compareAtPrice: 829,
    stock: 13,
    installmentAvailable: true,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.3", battery: "8 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Xiaomi",
    model: "Buds 5",
    shortKa: "კარგი ხმა და ხელმისაწვდომი ფასი.",
    shortEn: "Good sound at an accessible price.",
    descriptionKa: "Xiaomi Buds 5 განკუთვნილია ყოველდღიური მუსიკის მოსასმენად და კომფორტული ზარებისთვის.",
    descriptionEn: "Xiaomi Buds 5 is built for everyday listening and comfortable voice calls.",
    price: 229,
    compareAtPrice: 259,
    stock: 28,
    installmentAvailable: false,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.4", battery: "6.5 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Marshall",
    model: "Major V",
    shortKa: "კლასიკური დიზაინი და გამძლე ბატარეა.",
    shortEn: "Classic styling with long battery life.",
    descriptionKa: "Marshall Major V აერთიანებს ცნობილ დიზაინს და ძლიერ ბატარეას მოგზაურობისა და ყოველდღიური გამოყენებისთვის.",
    descriptionEn: "Marshall Major V combines a familiar design with long battery life for travel and daily use.",
    price: 459,
    compareAtPrice: 519,
    stock: 12,
    installmentAvailable: false,
    specs: { type: "On-ear", connectivity: "Bluetooth 5.3", battery: "100 hours", noiseCancelling: "No" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Bose",
    model: "QuietComfort Ultra",
    shortKa: "მაღალი კლასის კომფორტი და დახვეწილი ხმა.",
    shortEn: "Premium comfort with refined sound.",
    descriptionKa: "QuietComfort Ultra განკუთვნილია მათთვის, ვისაც სურს მაქსიმალური კომფორტი და დამუშავებული ხმა.",
    descriptionEn: "QuietComfort Ultra is for buyers who want premium comfort and refined sound quality.",
    price: 1199,
    compareAtPrice: 1299,
    stock: 7,
    featured: true,
    installmentAvailable: true,
    specs: { type: "Over-ear", connectivity: "Bluetooth 5.3", battery: "24 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "headphones",
    brand: "Huawei",
    model: "FreeBuds 6i",
    shortKa: "კომპაქტური ფორმა და გამართული მიკროფონები.",
    shortEn: "Compact shape with reliable microphones.",
    descriptionKa: "Huawei FreeBuds 6i კარგი არჩევანია ზარებისთვის, მუსიკისთვის და ყოველდღიური გადაადგილებისთვის.",
    descriptionEn: "Huawei FreeBuds 6i is a good choice for calls, music, and everyday commuting.",
    price: 189,
    compareAtPrice: 219,
    stock: 21,
    installmentAvailable: false,
    specs: { type: "In-ear", connectivity: "Bluetooth 5.3", battery: "8 hours", noiseCancelling: "Yes" }
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Anker",
    model: "GaNPrime 100W Charger",
    shortKa: "ძლიერი მრავალპორტიანი დამტენი რამდენიმე მოწყობილობისთვის.",
    shortEn: "Powerful multi-port charger for several devices.",
    descriptionKa: "Anker GaNPrime 100W Charger გათვლილია ლეპტოპების, ტელეფონებისა და აქსესუარების სწრაფად დასამუხტად.",
    descriptionEn: "Anker GaNPrime 100W Charger is built to charge laptops, phones, and accessories quickly.",
    price: 259,
    compareAtPrice: 299,
    stock: 25,
    specs: { ports: "2x USB-C, 1x USB-A", output: "100W", technology: "GaN", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Ugreen",
    model: "Nexode 65W Charger",
    shortKa: "კომპაქტური GaN დამტენი სამუშაო და მოგზაურობისთვის.",
    shortEn: "Compact GaN charger for work and travel.",
    descriptionKa: "Ugreen Nexode 65W Charger არის პრაქტიკული არჩევანი ტელეფონისა და ლეპტოპის დასამუხტად ერთდროულად.",
    descriptionEn: "Ugreen Nexode 65W Charger is a practical option for charging a phone and laptop at the same time.",
    price: 169,
    compareAtPrice: 199,
    stock: 27,
    specs: { ports: "2x USB-C, 1x USB-A", output: "65W", technology: "GaN", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Baseus",
    model: "GaN5 Pro 140W Charger",
    shortKa: "მაღალი სიმძლავრე პროფესიონალური მოწყობილობებისთვის.",
    shortEn: "High output for demanding devices.",
    descriptionKa: "Baseus GaN5 Pro 140W Charger შესაფერისია მძლავრი ლეპტოპებისა და რამდენიმე მოწყობილობის ერთდროულად დასამუხტად.",
    descriptionEn: "Baseus GaN5 Pro 140W Charger is suitable for power-hungry laptops and charging several devices at once.",
    price: 279,
    compareAtPrice: 319,
    stock: 17,
    specs: { ports: "2x USB-C, 1x USB-A", output: "140W", technology: "GaN", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Apple",
    model: "20W USB-C Power Adapter",
    shortKa: "მცირე ზომის დამტენი ყოველდღიური გამოყენებისთვის.",
    shortEn: "Compact charger for everyday use.",
    descriptionKa: "Apple 20W USB-C Power Adapter არის სტანდარტული და საიმედო არჩევანი iPhone-ისა და AirPods-ისთვის.",
    descriptionEn: "Apple 20W USB-C Power Adapter is a standard and reliable choice for iPhone and AirPods users.",
    price: 79,
    compareAtPrice: 99,
    stock: 40,
    specs: { ports: "1x USB-C", output: "20W", technology: "Standard", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Samsung",
    model: "45W Super Fast Charger",
    shortKa: "სწრაფი დამტენი Galaxy სერიისთვის.",
    shortEn: "Fast charger for the Galaxy lineup.",
    descriptionKa: "Samsung 45W Super Fast Charger განკუთვნილია Galaxy მოწყობილობების სწრაფად დასამუხტად.",
    descriptionEn: "Samsung 45W Super Fast Charger is designed to quickly charge Galaxy devices.",
    price: 99,
    compareAtPrice: 119,
    stock: 33,
    specs: { ports: "1x USB-C", output: "45W", technology: "PPS", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Belkin",
    model: "BoostCharge 25W Charger",
    shortKa: "საიმედო კედლის დამტენი ყოველდღიური მოხმარებისთვის.",
    shortEn: "Reliable wall charger for daily use.",
    descriptionKa: "Belkin BoostCharge 25W Charger კარგი არჩევანია ერთი მოწყობილობის სწრაფად დასამუხტად სახლში ან ოფისში.",
    descriptionEn: "Belkin BoostCharge 25W Charger is a solid option for fast charging one device at home or in the office.",
    price: 69,
    compareAtPrice: 85,
    stock: 26,
    specs: { ports: "1x USB-C", output: "25W", technology: "PD", cable: "Not included" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Anker",
    model: "737 Power Bank 24000mAh",
    shortKa: "ძლიერი გარე ბატარეა მოგზაურობისთვის.",
    shortEn: "Powerful battery pack for travel.",
    descriptionKa: "Anker 737 Power Bank 24000mAh უზრუნველყოფს რამდენიმე მოწყობილობის დამუხტვას ელექტრო ქსელის გარეშე.",
    descriptionEn: "Anker 737 Power Bank 24000mAh keeps several devices charged away from a wall outlet.",
    price: 399,
    compareAtPrice: 459,
    stock: 12,
    specs: { capacity: "24000mAh", output: "140W", ports: "2x USB-C, 1x USB-A", display: "Digital" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Baseus",
    model: "Magnetic Power Bank 10000mAh",
    shortKa: "მაგნიტური გარე ბატარეა iPhone-ისთვის.",
    shortEn: "Magnetic power bank for iPhone users.",
    descriptionKa: "Baseus Magnetic Power Bank 10000mAh მოსახერხებელია გადაადგილებისას ტელეფონის უსადენოდ დასამუხტად.",
    descriptionEn: "Baseus Magnetic Power Bank 10000mAh is convenient for wirelessly charging a phone while on the move.",
    price: 149,
    compareAtPrice: 179,
    stock: 23,
    specs: { capacity: "10000mAh", output: "20W", charging: "MagSafe compatible", cable: "USB-C" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Ugreen",
    model: "USB-C to USB-C Cable 100W",
    shortKa: "მაღალი სიმძლავრის კაბელი სწრაფი დამუხტვისთვის.",
    shortEn: "High-power cable for fast charging.",
    descriptionKa: "Ugreen USB-C to USB-C Cable 100W განკუთვნილია ტელეფონების, ტაბლეტებისა და ლეპტოპების სწრაფად დასამუხტად.",
    descriptionEn: "Ugreen USB-C to USB-C Cable 100W is built for fast charging phones, tablets, and laptops.",
    price: 29,
    compareAtPrice: 39,
    stock: 60,
    specs: { length: "1.5m", output: "100W", connector: "USB-C", material: "Braided" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Anker",
    model: "USB-C to Lightning Cable",
    shortKa: "საიმედო კაბელი Apple მოწყობილობებისთვის.",
    shortEn: "Reliable cable for Apple devices.",
    descriptionKa: "Anker USB-C to Lightning Cable არის გამძლე არჩევანი iPhone-ისა და AirPods-ის დასამუხტად.",
    descriptionEn: "Anker USB-C to Lightning Cable is a durable option for charging iPhone and AirPods devices.",
    price: 39,
    compareAtPrice: 49,
    stock: 54,
    specs: { length: "1.8m", output: "27W", connector: "Lightning", material: "Braided" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Samsung",
    model: "Wireless Charger Duo",
    shortKa: "ორ მოწყობილობაზე ერთდროული დამუხტვა.",
    shortEn: "Charge two devices at the same time.",
    descriptionKa: "Samsung Wireless Charger Duo პრაქტიკულია ტელეფონისა და ყურსასმენების ერთდროულად დასამუხტად.",
    descriptionEn: "Samsung Wireless Charger Duo is practical for charging a phone and earbuds at the same time.",
    price: 159,
    compareAtPrice: 189,
    stock: 15,
    specs: { output: "15W", charging: "Wireless", devices: "2", connector: "USB-C" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Belkin",
    model: "3-in-1 Wireless Charging Stand",
    shortKa: "ტელეფონის, საათისა და ყურსასმენების ერთიანად დამუხტვა.",
    shortEn: "Charge a phone, watch, and earbuds together.",
    descriptionKa: "Belkin 3-in-1 Wireless Charging Stand კომფორტულია სამუშაო მაგიდისთვის და ყოველდღიური გამოყენებისთვის.",
    descriptionEn: "Belkin 3-in-1 Wireless Charging Stand is ideal for desks and daily charging routines.",
    price: 329,
    compareAtPrice: 379,
    stock: 8,
    specs: { output: "15W", charging: "Wireless", devices: "3", connector: "USB-C" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Google",
    model: "Pixel Watch 3",
    shortKa: "ჭკვიანი საათი ჯანმრთელობისა და შეტყობინებების კონტროლისთვის.",
    shortEn: "Smartwatch for wellness and notifications.",
    descriptionKa: "Pixel Watch 3 აერთიანებს თანამედროვე დიზაინს, შეტყობინებებს და ჯანმრთელობის მონიტორინგს ერთ მოწყობილობაში.",
    descriptionEn: "Pixel Watch 3 combines a modern design, notifications, and wellness tracking in one device.",
    price: 1199,
    compareAtPrice: 1299,
    stock: 7,
    specs: { display: "1.4-inch AMOLED", battery: "24 hours", connectivity: "Bluetooth/Wi-Fi", os: "Wear OS" },
    installmentAvailable: false
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Apple",
    model: "Watch Series 10 46mm",
    shortKa: "სმარტ საათი ყოველდღიური ჯანმრთელობისა და კომუნიკაციისთვის.",
    shortEn: "Smartwatch for wellness and everyday communication.",
    descriptionKa: "Apple Watch Series 10 46mm განკუთვნილია მათთვის, ვისაც სურს აქტივობის მონიტორინგი და სწრაფი შეტყობინებები.",
    descriptionEn: "Apple Watch Series 10 46mm is for users who want activity tracking and quick notifications.",
    price: 1499,
    compareAtPrice: 1599,
    stock: 10,
    featured: true,
    installmentAvailable: true,
    specs: { display: "1.9-inch OLED", battery: "18 hours", connectivity: "GPS", material: "Aluminum" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Samsung",
    model: "Galaxy Watch7 44mm",
    shortKa: "Android მომხმარებლებისთვის პრაქტიკული ჭკვიანი საათი.",
    shortEn: "A practical smartwatch for Android users.",
    descriptionKa: "Galaxy Watch7 44mm აერთიანებს ჯანმრთელობის ფუნქციებს, შეტყობინებებს და კომფორტულ ყოველდღიურ გამოყენებას.",
    descriptionEn: "Galaxy Watch7 44mm combines health features, notifications, and comfortable everyday use.",
    price: 999,
    compareAtPrice: 1099,
    stock: 13,
    installmentAvailable: true,
    specs: { display: "1.5-inch AMOLED", battery: "40 hours", connectivity: "Bluetooth/Wi-Fi", material: "Armor Aluminum" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Xiaomi",
    model: "Smart Band 9 Pro",
    shortKa: "კომპაქტური ფიტნეს სამაჯური დიდი ეკრანით.",
    shortEn: "Compact fitness band with a large display.",
    descriptionKa: "Smart Band 9 Pro კარგი არჩევანია ყოველდღიური აქტივობის, ნაბიჯებისა და ძილის კონტროლისთვის.",
    descriptionEn: "Smart Band 9 Pro is a good choice for tracking activity, steps, and sleep every day.",
    price: 249,
    compareAtPrice: 289,
    stock: 31,
    installmentAvailable: false,
    specs: { display: "1.74-inch AMOLED", battery: "14 days", connectivity: "Bluetooth", waterResistance: "5ATM" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Apple",
    model: "iPad Air 11 128GB",
    shortKa: "მსუბუქი ტაბლეტი სწავლასა და სამუშაოსთვის.",
    shortEn: "Lightweight tablet for study and work.",
    descriptionKa: "iPad Air 11 128GB კომფორტულია სწავლებისთვის, ჩანაწერებისთვის და მობილური მუშაობისთვის.",
    descriptionEn: "iPad Air 11 128GB is comfortable for studying, note-taking, and mobile productivity.",
    price: 2199,
    compareAtPrice: 2349,
    stock: 9,
    installmentAvailable: true,
    specs: { display: "11-inch Liquid Retina", storage: "128GB", chip: "M2", camera: "12MP" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Samsung",
    model: "Galaxy Tab S9 FE 256GB",
    shortKa: "ტაბლეტი სამუშაოსა და გართობისთვის.",
    shortEn: "Tablet for productivity and entertainment.",
    descriptionKa: "Galaxy Tab S9 FE 256GB კარგი არჩევანია მათთვის, ვისაც სურს დიდი ეკრანი და სტილუსის მხარდაჭერა.",
    descriptionEn: "Galaxy Tab S9 FE 256GB is a strong option for buyers who want a large display and stylus support.",
    price: 1699,
    compareAtPrice: 1849,
    stock: 11,
    installmentAvailable: true,
    specs: { display: "10.9-inch LCD", storage: "256GB", ram: "8GB", stylus: "Included" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Amazon",
    model: "Kindle Paperwhite 16GB",
    shortKa: "ელწიგნების წამკითხველი გრძელი ბატარეით.",
    shortEn: "E-reader with long battery life.",
    descriptionKa: "Kindle Paperwhite 16GB მოსახერხებელია კითხვისთვის როგორც სახლში, ასევე მოგზაურობისას.",
    descriptionEn: "Kindle Paperwhite 16GB is convenient for reading both at home and while traveling.",
    price: 499,
    compareAtPrice: 559,
    stock: 14,
    installmentAvailable: false,
    specs: { display: "6.8-inch E-Ink", storage: "16GB", battery: "Up to 10 weeks", lighting: "Adjustable" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "DJI",
    model: "Osmo Mobile 7",
    shortKa: "სმარტფონის გიმბალი სტაბილური ვიდეოსთვის.",
    shortEn: "Smartphone gimbal for stable video capture.",
    descriptionKa: "DJI Osmo Mobile 7 ხელს უწყობს გლუვ ვიდეოს გადაღებას მოგზაურობისა და ყოველდღიური ჩანაწერებისთვის.",
    descriptionEn: "DJI Osmo Mobile 7 helps capture smooth video for travel and everyday content creation.",
    price: 399,
    compareAtPrice: 449,
    stock: 10,
    installmentAvailable: false,
    specs: { type: "Gimbal", stabilization: "3-axis", battery: "10 hours", connectivity: "Bluetooth" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "GoPro",
    model: "Hero 13 Black",
    shortKa: "სამოქმედო კამერა მოგზაურობისა და სპორტისთვის.",
    shortEn: "Action camera for travel and sports.",
    descriptionKa: "GoPro Hero 13 Black განკუთვნილია მაღალი ხარისხის ვიდეოს გადასაღებად რთულ გარემოში.",
    descriptionEn: "GoPro Hero 13 Black is designed for capturing high-quality video in demanding conditions.",
    price: 1399,
    compareAtPrice: 1499,
    stock: 8,
    installmentAvailable: true,
    specs: { video: "5.3K", stabilization: "HyperSmooth", battery: "1900mAh", waterproof: "10m" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Xiaomi",
    model: "Mi TV Stick 4K",
    shortKa: "კომპაქტური მედია მოწყობილობა ტელევიზორისთვის.",
    shortEn: "Compact media streaming device for TVs.",
    descriptionKa: "Mi TV Stick 4K ამატებს სტრიმინგის შესაძლებლობას ტელევიზორს მარტივად და სწრაფად.",
    descriptionEn: "Mi TV Stick 4K adds streaming features to a television quickly and easily.",
    price: 169,
    compareAtPrice: 199,
    stock: 20,
    installmentAvailable: false,
    specs: { resolution: "4K", os: "Android TV", memory: "2GB RAM", storage: "8GB" }
  }),
  buildProduct({
    categorySlug: "gadgets",
    brand: "Apple",
    model: "AirTag 4 Pack",
    shortKa: "ნივთების მარტივი პოვნისთვის.",
    shortEn: "For easy item tracking.",
    descriptionKa: "AirTag 4 Pack მოსახერხებელია გასაღებების, ჩანთისა და სხვა ნივთების სწრაფად მოსაძებნად.",
    descriptionEn: "AirTag 4 Pack is convenient for quickly finding keys, bags, and other personal items.",
    price: 349,
    compareAtPrice: 399,
    stock: 25,
    installmentAvailable: false,
    specs: { connectivity: "Bluetooth", network: "Find My", battery: "Replaceable", pack: "4 units" }
  }),
  buildProduct({
    categorySlug: "phones",
    brand: "OnePlus",
    model: "12R 256GB",
    shortKa: "სწრაფი Android ტელეფონი დიდი ბატარეით.",
    shortEn: "Fast Android phone with a large battery.",
    descriptionKa: "OnePlus 12R 256GB გათვლილია მომხმარებელზე, ვისაც სურს სწრაფი სისტემა, დიდი ეკრანი და გამძლე ბატარეა ყოველდღიური დატვირთვისთვის.",
    descriptionEn: "OnePlus 12R 256GB is built for users who want fast software, a large display, and dependable battery life for daily use.",
    price: 1799,
    compareAtPrice: 1949,
    stock: 12,
    installmentAvailable: true,
    specs: { display: "6.78-inch AMOLED", storage: "256GB", ram: "16GB", camera: "50MP", battery: "5500mAh" }
  }),
  buildProduct({
    categorySlug: "chargers",
    brand: "Baseus",
    model: "Power Bank 20000mAh 65W",
    shortKa: "ტევადი პორტატული დამტენი ლეპტოპისა და ტელეფონისთვის.",
    shortEn: "High-capacity portable charger for laptops and phones.",
    descriptionKa: "Baseus Power Bank 20000mAh 65W მოსახერხებელია მოგზაურობისას და ოფისგარეთ მუშაობისას, როცა ერთდროულად რამდენიმე მოწყობილობის დამუხტვა გჭირდებათ.",
    descriptionEn: "Baseus Power Bank 20000mAh 65W is ideal for travel and work outside the office when you need to charge multiple devices on the go.",
    price: 249,
    compareAtPrice: 299,
    stock: 27,
    installmentAvailable: false,
    specs: { capacity: "20000mAh", output: "65W", ports: "USB-C + USB-A", charging: "Fast charge" }
  })
];

async function resetDatabase() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (shouldReset) {
    await resetDatabase();
  }

  const adminPassword = await hash("Admin123!", 12);

  await prisma.user.upsert({
    where: {
      email: "admin@teqstore.ge"
    },
    update: {
      name: "Store Admin",
      password: adminPassword,
      role: Role.ADMIN,
      locale: "ka",
      phone: "+995555000111"
    },
    create: {
      email: "admin@teqstore.ge",
      name: "Store Admin",
      password: adminPassword,
      role: Role.ADMIN,
      locale: "ka",
      phone: "+995555000111"
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany({
      select: {
        id: true,
        slug: true
      }
    })).map((category) => [category.slug, category.id])
  );

  for (const product of products) {
    const { categorySlug, ...rest } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...rest,
        categoryId: categoryMap[categorySlug]
      },
      create: {
        ...rest,
        categoryId: categoryMap[categorySlug]
      }
    });
  }

  console.log(
    shouldReset
      ? `Seed completed with reset. Added ${products.length} demo products.`
      : `Seed completed in safe mode. Added or updated ${products.length} demo products.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
