export const heroSlides = [
  {
    id: "lvp",
    label: "Luxury Vinyl Plank",
    videoUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero/lvp.mp4`
      : "",
    posterUrl:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1920&q=80",
    gradient: "from-[#C4A882] via-[#A07848] to-[#B89060]",
  },
  {
    id: "engineered",
    label: "Engineered Hardwood",
    videoUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero/engineered.mp4`
      : "",
    posterUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    gradient: "from-[#8B6B42] via-[#6B4E2C] to-[#7A5A3A]",
  },
  {
    id: "hardwood",
    label: "Hardwood",
    videoUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero/hardwood.mp4`
      : "",
    posterUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80",
    gradient: "from-[#4A3020] via-[#3A2418] to-[#2C1810]",
  },
] as const;

export const featuredCollections = [
  {
    title: "LVP Flooring",
    subtitle: "Waterproof & Pet Friendly",
    description:
      "Luxury vinyl plank with authentic wood looks, built for high-traffic modern living.",
    href: "/shop/lvp-flooring",
    gradient: "from-[#C4A882]/80 via-[#A07848]/60 to-[#D4B890]/40",
    accent: "#C4A882",
  },
  {
    title: "Engineered Hardwood",
    subtitle: "Real Wood Beauty",
    description:
      "Premium engineered planks with real wood veneers and decades of lasting performance.",
    href: "/shop/engineered-hardwood",
    gradient: "from-[#8B6B42]/80 via-[#6B4E2C]/60 to-[#A07852]/40",
    accent: "#8B6B42",
  },
  {
    title: "Waterproof Flooring",
    subtitle: "Any Room, Any Climate",
    description:
      "From kitchens to basements - floors that handle moisture without compromising style.",
    href: "/shop/waterproof-flooring",
    gradient: "from-[#7B9E87]/50 via-[#5C4A32]/40 to-[#A68B5B]/30",
    accent: "#7B9E87",
  },
] as const;

export const marqueeItems = [
  "LVP",
  "Engineered Hardwood",
  "Wide Plank",
  "Waterproof",
  "Pet Friendly",
  "Free Samples",
  "Stripe Checkout",
  "Apple Pay",
  "Google Pay",
  "AI Floor Finder",
] as const;

export const mockReviews = [
  {
    id: "1",
    customerName: "Sarah M.",
    rating: 5,
    comment:
      "Installed Heritage Oak in our entire first floor. Looks incredible and has held up perfectly with two dogs and three kids.",
    verified: true,
  },
  {
    id: "2",
    customerName: "James T.",
    rating: 5,
    comment:
      "The Room Visualizer sold us before we even ordered samples. Exact match to what we saw online.",
    verified: true,
  },
  {
    id: "3",
    customerName: "Michael K.",
    rating: 5,
    comment:
      "Grand Oak Plank completely transformed our open living area. Worth every penny.",
    verified: true,
  },
  {
    id: "4",
    customerName: "Elena R.",
    rating: 4,
    comment:
      "Beautiful light tone for our master bedroom. Installation was straightforward with click-lock.",
    verified: true,
  },
] as const;

export const mockGalleryItems = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
    roomType: "living-room",
    style: "modern",
    productName: "Heritage Oak",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
    roomType: "bedroom",
    style: "scandinavian",
    productName: "Nordic Blonde",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80",
    roomType: "kitchen",
    style: "contemporary",
    productName: "Ash Silver",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
    roomType: "basement",
    style: "farmhouse",
    productName: "Barnwood Rustic",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
    roomType: "living-room",
    style: "luxury",
    productName: "Grand Oak Plank",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1600489000022-c2086d3f50d5?w=900&q=80",
    roomType: "kitchen",
    style: "modern",
    productName: "White Oak Premium",
  },
] as const;

export const aggregateRating = {
  ratingValue: 4.9,
  reviewCount: 284,
  bestRating: 5,
  worstRating: 4,
} as const;
