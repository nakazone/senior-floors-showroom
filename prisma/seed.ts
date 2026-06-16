import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

const FLOOR_TEXTURE =
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80";
const ROOM_SCENE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function toPrice(displayPrice: number, type: ProductType): number {
  const divisor =
    type === ProductType.LVP
      ? 20
      : type === ProductType.ENGINEERED
        ? 25
        : 22;
  return Math.round((displayPrice / divisor) * 100) / 100;
}

const products = [
  {
    name: "Heritage Oak",
    series: "Prestige LVP",
    type: ProductType.LVP,
    colorFamily: "light-oak",
    style: ["modern", "farmhouse"],
    rooms: ["living-room", "kitchen", "office"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '7"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: true,
    displayPrice: 89,
    compareAtPrice: 99,
    stockSqFt: 12000,
    boxCoverageSqFt: 23.8,
    hexPrimary: "#C4A882",
    hexSecondary: "#B89060",
    description:
      "A warm light oak LVP with authentic grain variation, 20mil wear layer and full waterproof core. Ideal for busy households and open-plan living.",
  },
  {
    name: "Walnut Prestige",
    series: "Prestige LVP",
    type: ProductType.LVP,
    colorFamily: "dark",
    style: ["modern", "luxury"],
    rooms: ["living-room", "office"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '9"',
    length: '48"',
    finish: "Low Gloss",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: false,
    displayPrice: 109,
    stockSqFt: 8500,
    boxCoverageSqFt: 27.2,
    hexPrimary: "#7A5A3A",
    hexSecondary: "#5A3C28",
    description:
      "Wide-plank walnut tones with a refined low-gloss finish. Deep, rich color for statement interiors and executive home offices.",
  },
  {
    name: "Nordic Blonde",
    series: "Nordic Collection",
    type: ProductType.LVP,
    colorFamily: "light-oak",
    style: ["scandinavian", "contemporary"],
    rooms: ["bedroom", "living-room"],
    thickness: "6mm",
    wearLayer: "12 mil",
    width: '6"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "25 Year",
    waterproof: true,
    petFriendly: true,
    displayPrice: 79,
    stockSqFt: 15000,
    boxCoverageSqFt: 20.1,
    hexPrimary: "#E8D8B8",
    hexSecondary: "#DACAA0",
    description:
      "Pale Scandinavian blonde with a clean matte surface. Brightens bedrooms and minimalist living spaces without sacrificing durability.",
  },
  {
    name: "Ebony Reserve",
    series: "Dark Edition",
    type: ProductType.ENGINEERED,
    colorFamily: "dark",
    style: ["luxury", "contemporary"],
    rooms: ["living-room", "office"],
    thickness: "14mm",
    wearLayer: "4 mm",
    width: '5"',
    length: 'RL',
    finish: "Satin",
    installType: "glue-down",
    warranty: "35 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 219,
    stockSqFt: 4200,
    boxCoverageSqFt: 18.5,
    hexPrimary: "#2C1F12",
    hexSecondary: "#3A2820",
    description:
      "Premium engineered hardwood in deep ebony tones. A satin finish and real wood veneer deliver authentic luxury for formal living areas.",
  },
  {
    name: "Grand Oak Plank",
    series: "Grand Plank",
    type: ProductType.ENGINEERED,
    colorFamily: "natural",
    style: ["luxury", "farmhouse"],
    rooms: ["living-room", "kitchen"],
    thickness: "18mm",
    wearLayer: "6 mm",
    width: '12"',
    length: 'RL',
    finish: "UV Oil",
    installType: "float",
    warranty: "50 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 289,
    stockSqFt: 3100,
    boxCoverageSqFt: 24.0,
    hexPrimary: "#B89A6A",
    hexSecondary: "#CEB890",
    description:
      "Extra-wide engineered oak planks with a UV-oiled natural finish. The flagship Grand Plank collection for open-plan luxury homes.",
  },
  {
    name: "Barnwood Rustic",
    series: "Prestige LVP",
    type: ProductType.LVP,
    colorFamily: "brown",
    style: ["farmhouse", "contemporary"],
    rooms: ["basement", "living-room"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '7"',
    length: '48"',
    finish: "Hand Scraped",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: true,
    displayPrice: 99,
    stockSqFt: 9800,
    boxCoverageSqFt: 23.8,
    hexPrimary: "#6B4E2C",
    hexSecondary: "#7A5A3A",
    description:
      "Hand-scraped texture with reclaimed barnwood character. Fully waterproof for basements, mudrooms and high-traffic family zones.",
  },
  {
    name: "Ash Silver",
    series: "Nordic Collection",
    type: ProductType.LVP,
    colorFamily: "natural",
    style: ["scandinavian", "modern"],
    rooms: ["kitchen", "bedroom"],
    thickness: "6mm",
    wearLayer: "12 mil",
    width: '5"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "25 Year",
    waterproof: true,
    petFriendly: false,
    displayPrice: 85,
    stockSqFt: 11200,
    boxCoverageSqFt: 17.6,
    hexPrimary: "#C8BFAE",
    hexSecondary: "#D8D0C0",
    description:
      "Cool ash-grey tones with subtle silver undertones. A contemporary favorite for kitchens and spa-inspired bedrooms.",
  },
  {
    name: "Cognac Wide",
    series: "Grand Plank",
    type: ProductType.ENGINEERED,
    colorFamily: "brown",
    style: ["contemporary", "luxury"],
    rooms: ["bedroom", "living-room"],
    thickness: "20mm",
    wearLayer: "3 mm",
    width: '14"',
    length: 'RL',
    finish: "Wire Brushed",
    installType: "glue-down",
    warranty: "40 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 319,
    compareAtPrice: 375,
    stockSqFt: 2400,
    boxCoverageSqFt: 28.5,
    hexPrimary: "#8B5E3C",
    hexSecondary: "#A07048",
    description:
      "Ultra-wide cognac engineered planks with wire-brushed texture. Rich mid-tone warmth for designer bedrooms and great rooms.",
  },
  {
    name: "White Oak Premium",
    series: "Heritage Series",
    type: ProductType.ENGINEERED,
    colorFamily: "white-oak",
    style: ["modern", "scandinavian"],
    rooms: ["kitchen", "living-room"],
    thickness: "16mm",
    wearLayer: "5 mm",
    width: '8"',
    length: 'RL',
    finish: "Natural Oil",
    installType: "float",
    warranty: "45 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 249,
    stockSqFt: 5600,
    boxCoverageSqFt: 21.3,
    hexPrimary: "#DDD0B0",
    hexSecondary: "#C8BC98",
    description:
      "Classic white oak engineered hardwood with a natural oil finish. Timeless neutral tones for chef kitchens and modern living spaces.",
  },
  {
    name: "Midnight Walnut",
    series: "Dark Edition",
    type: ProductType.LVP,
    colorFamily: "dark",
    style: ["luxury", "modern"],
    rooms: ["living-room", "office"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '9"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: true,
    displayPrice: 119,
    stockSqFt: 7200,
    boxCoverageSqFt: 27.2,
    hexPrimary: "#3A2820",
    hexSecondary: "#2C1810",
    description:
      "Deep midnight walnut in an extra-wide LVP format. Dramatic dark flooring with full waterproof protection and pet-friendly durability.",
  },
  {
    name: "Honey Maple",
    series: "Prestige LVP",
    type: ProductType.LVP,
    colorFamily: "natural",
    style: ["farmhouse", "contemporary"],
    rooms: ["kitchen", "living-room", "basement"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '6"',
    length: '48"',
    finish: "Semi-Gloss",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: true,
    displayPrice: 95,
    stockSqFt: 10500,
    boxCoverageSqFt: 20.1,
    hexPrimary: "#C8965A",
    hexSecondary: "#D4A870",
    description:
      "Golden honey maple tones with a subtle semi-gloss sheen. Warm and inviting for kitchens, family rooms and finished basements.",
  },
  {
    name: "Smoke Grey",
    series: "Nordic Collection",
    type: ProductType.LVP,
    colorFamily: "brown",
    style: ["modern", "contemporary"],
    rooms: ["living-room", "office", "bedroom"],
    thickness: "6mm",
    wearLayer: "12 mil",
    width: '7"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "25 Year",
    waterproof: true,
    petFriendly: false,
    displayPrice: 89,
    stockSqFt: 13000,
    boxCoverageSqFt: 23.8,
    hexPrimary: "#8A8070",
    hexSecondary: "#9C9080",
    description:
      "Trending smoke grey LVP with balanced warm undertones. A versatile neutral that pairs with both modern and transitional interiors.",
  },
  // Generic demo products for end-to-end testing
  {
    name: "Demo Classic Oak",
    series: "Demo Collection",
    type: ProductType.LVP,
    colorFamily: "light-oak",
    style: ["modern", "contemporary"],
    rooms: ["living-room", "kitchen", "office"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '7"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "25 Year",
    waterproof: true,
    petFriendly: true,
    displayPrice: 69,
    compareAtPrice: 79,
    stockSqFt: 5000,
    boxCoverageSqFt: 23.8,
    hexPrimary: "#C8B090",
    hexSecondary: "#B89A78",
    description:
      "Generic light oak LVP for cart, checkout, compare and sample flows. Waterproof click-lock plank with everyday durability.",
  },
  {
    name: "Demo Waterproof Grey",
    series: "Demo Collection",
    type: ProductType.LVP,
    colorFamily: "natural",
    style: ["modern", "scandinavian"],
    rooms: ["kitchen", "basement", "office"],
    thickness: "6mm",
    wearLayer: "12 mil",
    width: '6"',
    length: '48"',
    finish: "Matte",
    installType: "click-lock",
    warranty: "25 Year",
    waterproof: true,
    petFriendly: true,
    displayPrice: 59,
    stockSqFt: 8000,
    boxCoverageSqFt: 20.1,
    hexPrimary: "#A8A090",
    hexSecondary: "#989080",
    description:
      "Generic grey waterproof LVP ideal for basement and kitchen filter pages. Budget-friendly option for calculator and quantity tests.",
  },
  {
    name: "Demo Engineered Maple",
    series: "Demo Collection",
    type: ProductType.ENGINEERED,
    colorFamily: "natural",
    style: ["contemporary", "farmhouse"],
    rooms: ["bedroom", "living-room"],
    thickness: "14mm",
    wearLayer: "4 mm",
    width: '8"',
    length: 'RL',
    finish: "Satin",
    installType: "float",
    warranty: "35 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 179,
    compareAtPrice: 199,
    stockSqFt: 3600,
    boxCoverageSqFt: 21.3,
    hexPrimary: "#D4B890",
    hexSecondary: "#C4A880",
    description:
      "Generic engineered maple for shop category and style filter testing. Float install with satin finish and natural grain.",
  },
  {
    name: "Demo Solid Cherry",
    series: "Heritage Series",
    type: ProductType.HARDWOOD,
    colorFamily: "brown",
    style: ["luxury", "contemporary"],
    rooms: ["living-room", "office"],
    thickness: "18mm",
    wearLayer: "6 mm",
    width: '5"',
    length: 'RL',
    finish: "Natural Oil",
    installType: "glue-down",
    warranty: "50 Year",
    waterproof: false,
    petFriendly: false,
    displayPrice: 349,
    stockSqFt: 1800,
    boxCoverageSqFt: 18.5,
    hexPrimary: "#7A4030",
    hexSecondary: "#6A3020",
    description:
      "Generic solid hardwood for HARDWOOD type filters and premium price-range tests. Glue-down install with rich cherry tones.",
  },
  {
    name: "Demo Limited Stock",
    series: "Demo Collection",
    type: ProductType.LVP,
    colorFamily: "white-oak",
    style: ["modern", "luxury"],
    rooms: ["bedroom", "office"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '9"',
    length: '48"',
    finish: "Low Gloss",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: false,
    displayPrice: 129,
    stockSqFt: 95,
    boxCoverageSqFt: 27.2,
    hexPrimary: "#E0D4C0",
    hexSecondary: "#D0C4B0",
    description:
      "Generic wide-plank white oak look with very low inventory. Use to test quantity limits and edge-case stock behavior.",
  },
  {
    name: "Demo Pet Pro Plank",
    series: "Prestige LVP",
    type: ProductType.LVP,
    colorFamily: "dark",
    style: ["farmhouse", "modern"],
    rooms: ["living-room", "kitchen", "basement"],
    thickness: "8mm",
    wearLayer: "20 mil",
    width: '7"',
    length: '48"',
    finish: "Hand Scraped",
    installType: "click-lock",
    warranty: "Lifetime Residential",
    waterproof: true,
    petFriendly: true,
    displayPrice: 99,
    stockSqFt: 6400,
    boxCoverageSqFt: 23.8,
    hexPrimary: "#5A4030",
    hexSecondary: "#4A3020",
    description:
      "Generic dark LVP with pet-friendly and waterproof badges. Good for AI finder, inspiration gallery and related-product tests.",
  },
] as const;

const galleryItems = [
  {
    roomType: "living-room",
    style: "modern",
    productSlug: "heritage-oak",
    imageUrl: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
  },
  {
    roomType: "bedroom",
    style: "scandinavian",
    productSlug: "nordic-blonde",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
  },
  {
    roomType: "kitchen",
    style: "contemporary",
    productSlug: "ash-silver",
    imageUrl: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80",
  },
  {
    roomType: "basement",
    style: "farmhouse",
    productSlug: "barnwood-rustic",
    imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
  },
  {
    roomType: "living-room",
    style: "modern",
    productSlug: "walnut-prestige",
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80",
  },
  {
    roomType: "living-room",
    style: "luxury",
    productSlug: "grand-oak-plank",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
  },
  {
    roomType: "bedroom",
    style: "contemporary",
    productSlug: "cognac-wide",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
  },
  {
    roomType: "kitchen",
    style: "modern",
    productSlug: "white-oak-premium",
    imageUrl: "https://images.unsplash.com/photo-1600489000022-c2086d3f50d5?w=900&q=80",
  },
  {
    roomType: "office",
    style: "modern",
    productSlug: "demo-classic-oak",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
  },
  {
    roomType: "basement",
    style: "modern",
    productSlug: "demo-waterproof-grey",
    imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
  },
  {
    roomType: "living-room",
    style: "luxury",
    productSlug: "demo-solid-cherry",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
  },
  {
    roomType: "bedroom",
    style: "modern",
    productSlug: "demo-limited-stock",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
  },
] as const;

const reviews = [
  {
    productSlug: "heritage-oak",
    customerName: "Sarah M.",
    rating: 5,
    comment:
      "Installed in our entire first floor. Looks incredible and has held up perfectly with two dogs and three kids.",
    verified: true,
  },
  {
    productSlug: "heritage-oak",
    customerName: "James T.",
    rating: 5,
    comment: "The Room Visualizer sold us before we even ordered samples. Exact match to what we saw online.",
    verified: true,
  },
  {
    productSlug: "nordic-blonde",
    customerName: "Elena R.",
    rating: 4,
    comment: "Beautiful light tone for our master bedroom. Installation was straightforward with click-lock.",
    verified: true,
  },
  {
    productSlug: "grand-oak-plank",
    customerName: "Michael K.",
    rating: 5,
    comment: "Worth every penny. The 12-inch wide planks completely transformed our open living area.",
    verified: true,
  },
  {
    productSlug: "barnwood-rustic",
    customerName: "Amanda P.",
    rating: 5,
    comment: "Perfect for our basement renovation. Waterproof core gives us total peace of mind.",
    verified: false,
  },
  {
    productSlug: "demo-classic-oak",
    customerName: "Test User",
    rating: 5,
    comment: "Great demo product for testing reviews, ratings and verified purchase badges.",
    verified: true,
  },
  {
    productSlug: "demo-waterproof-grey",
    customerName: "Alex D.",
    rating: 4,
    comment: "Solid grey tone for kitchens. Easy to compare side by side with other demo planks.",
    verified: true,
  },
  {
    productSlug: "demo-solid-cherry",
    customerName: "Pro Builder",
    rating: 5,
    comment: "Premium hardwood look for luxury room styling and trade discount checkout tests.",
    verified: false,
  },
] as const;

async function main() {
  console.log("Seeding Senior Floors Studio database...");

  await prisma.review.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  const productIdBySlug = new Map<string, string>();

  for (const item of products) {
    const slug = slugify(item.name);
    const pricePerSqFt = toPrice(item.displayPrice, item.type);
    const compareAtPrice =
      "compareAtPrice" in item && item.compareAtPrice
        ? toPrice(item.compareAtPrice, item.type)
        : null;

    const product = await prisma.product.create({
      data: {
        slug,
        name: item.name,
        series: item.series,
        description: item.description,
        type: item.type,
        colorFamily: item.colorFamily,
        style: [...item.style],
        rooms: [...item.rooms],
        thickness: item.thickness,
        wearLayer: item.wearLayer,
        width: item.width,
        length: item.length,
        finish: item.finish,
        installType: item.installType,
        warranty: item.warranty,
        waterproof: item.waterproof,
        petFriendly: item.petFriendly,
        pricePerSqFt,
        compareAtPrice,
        stockSqFt: item.stockSqFt,
        boxCoverageSqFt: item.boxCoverageSqFt,
        images: {
          create: [
            {
              url: FLOOR_TEXTURE,
              type: "gallery",
              position: 0,
            },
            {
              url: ROOM_SCENE,
              type: "room-scene",
              position: 1,
            },
            {
              url: FLOOR_TEXTURE,
              type: "macro-texture",
              position: 2,
            },
          ],
        },
        variants: {
          create: {
            colorName: item.name,
            hexPrimary: item.hexPrimary,
            hexSecondary: item.hexSecondary,
          },
        },
      },
    });

    productIdBySlug.set(slug, product.id);
    console.log(`  + ${item.name}`);
  }

  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: {
        imageUrl: item.imageUrl,
        roomType: item.roomType,
        style: item.style,
        productId: productIdBySlug.get(item.productSlug),
      },
    });
  }

  for (const item of reviews) {
    const productId = productIdBySlug.get(item.productSlug);
    if (!productId) continue;

    await prisma.review.create({
      data: {
        productId,
        customerName: item.customerName,
        rating: item.rating,
        comment: item.comment,
        verified: item.verified,
      },
    });
  }

  console.log(`\nSeeded ${products.length} products, ${galleryItems.length} gallery items, ${reviews.length} reviews.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
