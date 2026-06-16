export interface NavLink {
  href: string;
  label: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export const shopMegaMenu: NavColumn[] = [
  {
    title: "By Type",
    links: [
      { href: "/shop/lvp-flooring", label: "LVP (Luxury Vinyl Plank)" },
      { href: "/shop/engineered-hardwood", label: "Engineered Hardwood" },
      { href: "/shop/luxury-vinyl-plank", label: "Luxury Vinyl Plank" },
      { href: "/shop/waterproof-flooring", label: "Waterproof Flooring" },
    ],
  },
  {
    title: "By Color",
    links: [
      { href: "/color/light-oak", label: "Light Oak" },
      { href: "/color/white-oak", label: "White Oak" },
      { href: "/color/natural", label: "Natural" },
      { href: "/color/brown", label: "Brown & Walnut" },
      { href: "/color/dark", label: "Dark & Espresso" },
    ],
  },
  {
    title: "By Style",
    links: [
      { href: "/style/modern", label: "Modern" },
      { href: "/style/contemporary", label: "Contemporary" },
      { href: "/style/farmhouse", label: "Farmhouse" },
      { href: "/style/scandinavian", label: "Scandinavian" },
      { href: "/style/luxury", label: "Luxury" },
    ],
  },
  {
    title: "By Room",
    links: [
      { href: "/room/living-room", label: "Living Room" },
      { href: "/room/bedroom", label: "Bedroom" },
      { href: "/room/basement", label: "Basement" },
      { href: "/room/kitchen", label: "Kitchen" },
      { href: "/room/office", label: "Office" },
    ],
  },
];

export const primaryNavLinks: NavLink[] = [
  { href: "/visualizer", label: "Visualizer" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/samples", label: "Samples" },
  { href: "/professionals", label: "Professionals" },
];

export const footerColumns: NavColumn[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop/lvp-flooring", label: "LVP Flooring" },
      { href: "/shop/engineered-hardwood", label: "Engineered Hardwood" },
      { href: "/shop/luxury-vinyl-plank", label: "Wide Plank" },
      { href: "/color/light-oak", label: "By Color" },
      { href: "/shop", label: "New Arrivals" },
      { href: "/shop", label: "All Products" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/visualizer", label: "Room Visualizer" },
      { href: "/ai-finder", label: "AI Floor Finder" },
      { href: "/tools/calculator", label: "Floor Calculator" },
      { href: "/compare", label: "Compare Floors" },
      { href: "/inspiration", label: "Inspiration Gallery" },
      { href: "/samples", label: "Free Samples" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/about", label: "FAQ" },
      { href: "/about", label: "Shipping Policy" },
      { href: "/about", label: "Returns" },
      { href: "/about", label: "Installation Guide" },
      { href: "/about", label: "Warranty" },
      { href: "/about", label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/professionals", label: "Professionals" },
      { href: "/pro/apply", label: "Pro Application" },
      { href: "/about", label: "Careers" },
      { href: "/about", label: "Privacy Policy" },
      { href: "/about", label: "Terms of Use" },
    ],
  },
];
