/** Senior Floors brand tokens shared with site + landing. */
export const brand = {
  colors: {
    primary: "#1a2036",
    primaryHover: "#252b47",
    primaryDark: "#14192b",
    secondary: "#d6b598",
    secondaryHover: "#e0c4a8",
    textDark: "#1a2036",
    textLight: "#4a5568",
    textMuted: "#718096",
    bgLight: "#f7f8fc",
    bgWhite: "#ffffff",
    border: "#e2e8f0",
  },
  logo: {
    localPath: "/assets/logoSeniorFloors.png",
    remoteUrl:
      process.env.NEXT_PUBLIC_BRAND_LOGO_URL ??
      "https://www.senior-floors.com/logoSeniorFloors.png",
    alt: "Senior Floors",
  },
  fonts: {
    sans: "var(--font-inter)",
  },
} as const;
