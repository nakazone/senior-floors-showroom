export const siteConfig = {
  name: "Senior Floors",
  studioLabel: "Studio Showroom",
  tagline: "Premium Flooring, Curated for Your Home.",
  description:
    "Shop premium LVP and engineered hardwood flooring online. Visualize, compare, order samples and buy with confidence from Senior Floors.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://showroom.senior-floors.com",
  mainSiteUrl: "https://senior-floors.com",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "(720) 751-9813",
  phoneTel: "+17207519813",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "contact@senior-floors.com",
  address: {
    street: "7900 E Union Ave",
    city: "Denver",
    state: "CO",
    zip: "80237",
  },
  serviceArea:
    "Denver, Cherry Creek, Greenwood Village, Lakewood, Morrison, DTC and the metro area",
  social: {
    linkedin: "https://linkedin.com/company/seniorfloors",
    instagram: "https://www.instagram.com/seniorfloors/",
    facebook: "https://www.facebook.com/seniorflooring",
    pinterest: "https://pinterest.com/seniorfloors",
    youtube: "https://youtube.com/@seniorfloors",
  },
} as const;
