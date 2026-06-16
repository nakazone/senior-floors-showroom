export const siteConfig = {
  name: "Senior Floors Studio",
  tagline: "Luxury Flooring, Reimagined.",
  description:
    "Explore, visualize and order premium LVP and engineered hardwood flooring from the comfort of your home.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio.senior-floors.com",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "(954) 555-0100",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "studio@senior-floors.com",
  address: {
    street: "123 Flooring Blvd",
    city: "Fort Lauderdale",
    state: "FL",
    zip: "33301",
  },
  social: {
    linkedin: "https://linkedin.com/company/seniorfloors",
    instagram: "https://instagram.com/seniorfloors",
    facebook: "https://facebook.com/seniorfloors",
    pinterest: "https://pinterest.com/seniorfloors",
    youtube: "https://youtube.com/@seniorfloors",
  },
} as const;
