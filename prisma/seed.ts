import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

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
    image: "https://placehold.co/800x600?text=Phones"
  },
  {
    slug: "headphones",
    nameKa: "ყურსასმენები",
    nameEn: "Headphones",
    descriptionKa: "უსადენო, გეიმინგ და პრემიუმ აუდიო აქსესუარები.",
    descriptionEn: "Wireless, gaming, and premium audio accessories.",
    featured: true,
    image: "https://placehold.co/800x600?text=Headphones"
  },
  {
    slug: "chargers",
    nameKa: "დამტენები",
    nameEn: "Chargers",
    descriptionKa: "სწრაფი დამტენები, კაბელები და ენერგიის აქსესუარები.",
    descriptionEn: "Fast chargers, cables, and power accessories.",
    featured: true,
    image: "https://placehold.co/800x600?text=Chargers"
  },
  {
    slug: "gadgets",
    nameKa: "გაჯეტები",
    nameEn: "Gadgets",
    descriptionKa: "ჭკვიანი საათები, სამაგიდო ტექნიკა და პორტატული მოწყობილობები.",
    descriptionEn: "Smartwatches, desktop tech, and portable devices.",
    featured: false,
    image: "https://placehold.co/800x600?text=Gadgets"
  }
];

const products = [
  {
    slug: "iphone-15-pro-256gb",
    sku: "APL-IP15P-256",
    brand: "Apple",
    categorySlug: "phones",
    nameKa: "iPhone 15 Pro 256GB",
    nameEn: "iPhone 15 Pro 256GB",
    shortDescriptionKa: "ტიტანის კორპუსი, A17 Pro და პრო კამერის სისტემა.",
    shortDescriptionEn: "Titanium body, A17 Pro and a pro camera system.",
    descriptionKa: "iPhone 15 Pro გამოირჩევა მსუბუქი ტიტანის ჩარჩოთი, 120Hz ProMotion ეკრანით და Apple-ის ახალი ჩიპით.",
    descriptionEn: "iPhone 15 Pro delivers a lightweight titanium frame, a 120Hz ProMotion display, and Apple’s new chipset.",
    seoTitleKa: "Apple iPhone 15 Pro 256GB თბილისში სწრაფი მიწოდებით",
    seoTitleEn: "Apple iPhone 15 Pro 256GB with fast delivery in Tbilisi",
    seoDescriptionKa: "შეიძინე iPhone 15 Pro 256GB ოფიციალური გარანტიით და უსაფრთხო გადახდით.",
    seoDescriptionEn: "Buy iPhone 15 Pro 256GB with warranty and secure checkout.",
    price: "3799.00",
    compareAtPrice: "3999.00",
    stock: 14,
    featured: true,
    published: true,
    topProduct: true,
    installmentAvailable: true,
    metaKeywords: ["iphone", "apple", "smartphone", "256gb"],
    images: [
      "https://placehold.co/900x900?text=iPhone+15+Pro+Front",
      "https://placehold.co/900x900?text=iPhone+15+Pro+Back",
      "https://placehold.co/900x900?text=iPhone+15+Pro+Side"
    ],
    specs: {
      display: "6.1-inch OLED",
      storage: "256GB",
      ram: "8GB",
      camera: "48MP Main",
      battery: "3274mAh"
    }
  },
  {
    slug: "samsung-galaxy-s25-128gb",
    sku: "SMS-S25-128",
    brand: "Samsung",
    categorySlug: "phones",
    nameKa: "Samsung Galaxy S25 128GB",
    nameEn: "Samsung Galaxy S25 128GB",
    shortDescriptionKa: "დახვეწილი AMOLED ეკრანი და Galaxy AI ფუნქციები.",
    shortDescriptionEn: "Vivid AMOLED panel and Galaxy AI features.",
    descriptionKa: "Galaxy S25 განკუთვნილია მათთვის, ვისაც სურს პრემიუმ Android გამოცდილება სწრაფი კამერით და ხანგრძლივი ბატარეით.",
    descriptionEn: "Galaxy S25 is for shoppers who want a premium Android experience with fast cameras and lasting battery life.",
    seoTitleKa: "Samsung Galaxy S25 128GB ონლაინ მაღაზია საქართველოში",
    seoTitleEn: "Samsung Galaxy S25 128GB online store in Georgia",
    seoDescriptionKa: "Galaxy S25 თბილისში და რეგიონებში მიწოდებით. შეკვეთა ონლაინ.",
    seoDescriptionEn: "Galaxy S25 with delivery across Georgia. Order online.",
    price: "2899.00",
    compareAtPrice: "3099.00",
    stock: 18,
    featured: true,
    published: true,
    topProduct: true,
    installmentAvailable: true,
    metaKeywords: ["samsung", "galaxy", "android", "smartphone"],
    images: [
      "https://placehold.co/900x900?text=Galaxy+S25+Front",
      "https://placehold.co/900x900?text=Galaxy+S25+Back"
    ],
    specs: {
      display: "6.2-inch Dynamic AMOLED",
      storage: "128GB",
      ram: "12GB",
      camera: "50MP Main",
      battery: "4500mAh"
    }
  },
  {
    slug: "sony-wh-1000xm5",
    sku: "SNY-XM5-BLK",
    brand: "Sony",
    categorySlug: "headphones",
    nameKa: "Sony WH-1000XM5",
    nameEn: "Sony WH-1000XM5",
    shortDescriptionKa: "პრემიუმ ANC ყურსასმენები მოგზაურობისა და ოფისისთვის.",
    shortDescriptionEn: "Premium ANC headphones for travel and work.",
    descriptionKa: "WH-1000XM5 გთავაზობთ კლასის წამყვან ხმაურის ჩამხშობს, მსუბუქ კონსტრუქციას და მაღალი დონის მიკროფონებს.",
    descriptionEn: "WH-1000XM5 combines class-leading noise cancelling, a lighter build, and excellent microphones.",
    seoTitleKa: "Sony WH-1000XM5 ხმაურის ჩამხშობი ყურსასმენები",
    seoTitleEn: "Sony WH-1000XM5 noise cancelling headphones",
    seoDescriptionKa: "Sony XM5 პრემიუმ აუდიო და სწრაფი მიწოდება საქართველოს მასშტაბით.",
    seoDescriptionEn: "Sony XM5 premium audio with fast delivery in Georgia.",
    price: "999.00",
    compareAtPrice: "1149.00",
    stock: 11,
    featured: true,
    published: true,
    topProduct: false,
    installmentAvailable: true,
    metaKeywords: ["sony", "headphones", "anc", "wireless"],
    images: [
      "https://placehold.co/900x900?text=Sony+XM5+Front",
      "https://placehold.co/900x900?text=Sony+XM5+Side"
    ],
    specs: {
      connectivity: "Bluetooth 5.2",
      battery: "30 hours",
      weight: "250g",
      audio: "30mm driver"
    }
  },
  {
    slug: "anker-ganprime-100w",
    sku: "ANK-GAN-100W",
    brand: "Anker",
    categorySlug: "chargers",
    nameKa: "Anker GaNPrime 100W Charger",
    nameEn: "Anker GaNPrime 100W Charger",
    shortDescriptionKa: "100W სწრაფი დამტენი USB-C ლეპტოპებისა და ტელეფონებისთვის.",
    shortDescriptionEn: "100W fast charger for USB-C laptops and phones.",
    descriptionKa: "GaNPrime 100W უზრუნველყოფს მაღალი სიმძლავრის დამუხტვას კომპაქტურ კორპუსში რამდენიმე მოწყობილობისთვის.",
    descriptionEn: "GaNPrime 100W delivers high output charging in a compact body for multiple devices.",
    seoTitleKa: "Anker 100W GaN სწრაფი დამტენი საქართველოში",
    seoTitleEn: "Anker 100W GaN fast charger in Georgia",
    seoDescriptionKa: "იყიდე Anker GaNPrime 100W სწრაფი დამტენი ტექნიკისთვის.",
    seoDescriptionEn: "Shop the Anker GaNPrime 100W fast charger.",
    price: "259.00",
    compareAtPrice: "299.00",
    stock: 25,
    featured: false,
    published: true,
    topProduct: false,
    installmentAvailable: false,
    metaKeywords: ["anker", "charger", "gan", "usb-c"],
    images: [
      "https://placehold.co/900x900?text=Anker+GaNPrime+100W"
    ],
    specs: {
      ports: "2x USB-C, 1x USB-A",
      output: "100W Max",
      technology: "GaN"
    }
  },
  {
    slug: "apple-airpods-pro-2",
    sku: "APL-APP2-USBC",
    brand: "Apple",
    categorySlug: "headphones",
    nameKa: "AirPods Pro 2 USB-C",
    nameEn: "AirPods Pro 2 USB-C",
    shortDescriptionKa: "აქტიური ხმაურის ჩახშობა და ადაპტური აუდიო.",
    shortDescriptionEn: "Active noise cancellation and adaptive audio.",
    descriptionKa: "AirPods Pro 2 იდეალურია Apple ეკოსისტემისთვის სწრაფი დაწყვილებითა და გამჭვირვალე ხმის რეჟიმით.",
    descriptionEn: "AirPods Pro 2 fit perfectly into the Apple ecosystem with instant pairing and transparency mode.",
    seoTitleKa: "AirPods Pro 2 USB-C საუკეთესო ფასი თბილისში",
    seoTitleEn: "AirPods Pro 2 USB-C best price in Tbilisi",
    seoDescriptionKa: "AirPods Pro 2 გარანტიით და სწრაფი მიწოდებით.",
    seoDescriptionEn: "AirPods Pro 2 with warranty and fast delivery.",
    price: "799.00",
    compareAtPrice: "899.00",
    stock: 20,
    featured: true,
    published: true,
    topProduct: true,
    installmentAvailable: true,
    metaKeywords: ["airpods", "apple", "wireless earbuds"],
    images: [
      "https://placehold.co/900x900?text=AirPods+Pro+2",
      "https://placehold.co/900x900?text=AirPods+Case"
    ],
    specs: {
      connectivity: "Bluetooth 5.3",
      battery: "6 hours",
      case: "USB-C charging case",
      audio: "Adaptive EQ"
    }
  },
  {
    slug: "google-pixel-watch-3",
    sku: "GGL-PW3-45",
    brand: "Google",
    categorySlug: "gadgets",
    nameKa: "Google Pixel Watch 3",
    nameEn: "Google Pixel Watch 3",
    shortDescriptionKa: "Wear OS საათი ჯანმრთელობისა და შეტყობინებების კონტროლისთვის.",
    shortDescriptionEn: "Wear OS smartwatch for wellness and notifications.",
    descriptionKa: "Pixel Watch 3 აერთიანებს თანამედროვე დიზაინს, ჯანმრთელობის მონიტორინგს და Google სერვისებთან ინტეგრაციას.",
    descriptionEn: "Pixel Watch 3 brings a refined design, wellness tracking, and deep Google service integration.",
    seoTitleKa: "Google Pixel Watch 3 ჭკვიანი საათი საქართველოში",
    seoTitleEn: "Google Pixel Watch 3 smartwatch in Georgia",
    seoDescriptionKa: "შეუკვეთე Pixel Watch 3 ონლაინ მაღაზიიდან.",
    seoDescriptionEn: "Order Pixel Watch 3 from our online store.",
    price: "1199.00",
    compareAtPrice: "1299.00",
    stock: 7,
    featured: false,
    published: true,
    topProduct: false,
    installmentAvailable: false,
    metaKeywords: ["pixel watch", "google", "smartwatch"],
    images: [
      "https://placehold.co/900x900?text=Pixel+Watch+3"
    ],
    specs: {
      display: "1.4-inch AMOLED",
      battery: "24 hours",
      connectivity: "Bluetooth/Wi-Fi",
      os: "Wear OS"
    }
  }
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
      ? "Seed completed with reset."
      : "Seed completed in safe mode. Existing data was preserved."
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
