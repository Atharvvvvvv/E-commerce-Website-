import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Enforce environment variable security for initial accounts
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@store.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "AdminSecurePassword123!";
  const userEmail = process.env.SEED_USER_EMAIL || "customer@store.local";
  const userPassword = process.env.SEED_USER_PASSWORD || "CustomerSecurePassword123!";

  if (process.env.NODE_ENV === "production" && (!process.env.SEED_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD === "AdminSecurePassword123!")) {
    throw new Error("SECURITY ABORT: Refusing to seed default administrator credentials into a production environment!");
  }

  // 2. Hash passwords
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
  const userHashedPassword = await bcrypt.hash(userPassword, 10);

  // 3. Upsert Users (prevents duplicates when re-seeding)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Store Administrator",
      passwordHash: adminHashedPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Alex Customer",
      passwordHash: userHashedPassword,
      role: Role.USER,
    },
  });

  console.log(`✓ Admin user created/verified: ${admin.email}`);
  console.log(`✓ Customer user created/verified: ${customer.email}`);

  // 4. Seed Categories
  const categoriesData = [
    { name: "Electronics", slug: "electronics", description: "Audio, computing, and smart accessories." },
    { name: "Apparel", slug: "apparel", description: "Minimalist, high-durability wardrobe staples." },
    { name: "Home & Living", slug: "home-living", description: "Thoughtfully crafted ceramics, lighting, and decor." },
    { name: "Stationery", slug: "stationery", description: "Archival notebooks, writing instruments, and desk organizers." },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }

  console.log(`✓ Seeded ${categoriesData.length} categories`);

  // 5. Seed Initial Curated Products
  const sampleProducts = [
    {
      name: "Matte Black Mechanical Keyboard",
      slug: "matte-black-mechanical-keyboard",
      description: "Custom hot-swappable tactile switches with anodized aluminum casing and braided detachable USB-C cable.",
      price: 149.00,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      categorySlug: "electronics",
    },
    {
      name: "Active Noise-Cancelling Headphones",
      slug: "anc-wireless-headphones",
      description: "Precision 40mm drivers with 38-hour battery longevity and memory foam ear cushions.",
      price: 279.00,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      categorySlug: "electronics",
    },
    {
      name: "Heavyweight Cotton Oversized Tee",
      slug: "heavyweight-cotton-tee",
      description: "280 GSM combed organic cotton with reinforced collar stitching and relaxed drop-shoulder cut.",
      price: 42.00,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      categorySlug: "apparel",
    },
    {
      name: "Merino Wool Everyday Beanie",
      slug: "merino-wool-beanie",
      description: "100% extra-fine Merino wool rib-knit beanie designed for temperature regulation and non-itch comfort.",
      price: 36.00,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      categorySlug: "apparel",
    },
    {
      name: "Stoneware Ceramic Pour-Over Set",
      slug: "ceramic-pour-over-set",
      description: "Hand-thrown stoneware dripper with heat-resistant borosilicate glass server and bamboo coaster.",
      price: 58.00,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      categorySlug: "home-living",
    },
    {
      name: "Dimmable Ambient Brass Desk Lamp",
      slug: "ambient-brass-desk-lamp",
      description: "Solid brushed brass lamp with warm 2700K integrated LED and rotary tactile dimmer.",
      price: 185.00,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      categorySlug: "home-living",
    },
    {
      name: "Linen-Bound Hardcover Dot Grid Journal",
      slug: "linen-bound-dot-journal",
      description: "160 pages of 120 GSM fountain-pen friendly paper with dual ribbon markers and expandable back pocket.",
      price: 28.00,
      stock: 60,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      categorySlug: "stationery",
    },
    {
      name: "Rollerball Machined Titanium Pen",
      slug: "machined-titanium-pen",
      description: "Grade 5 titanium barrel with Schmidt ceramic rollerball refill and deep-carry pocket clip.",
      price: 89.00,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
      categorySlug: "stationery",
    },
  ];

  for (const product of sampleProducts) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: categoryId,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: categoryId,
        isActive: true,
      },
    });
  }

  console.log(`✓ Seeded ${sampleProducts.length} sample catalog products`);
  console.log("✅ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
