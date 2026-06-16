/** Senior Floors brand tokens shared with site + landing. */
export const brand = {
  colors: {
    primary: "#1a2036",
    primaryHover: "#252b47",
    primaryDark: "#14192b",
    primaryLight: "#2a3150",
    secondary: "#d6b598",
    secondaryHover: "#e0c4a8",
    secondaryDark: "#c4a588",
    textDark: "#1a2036",
    textLight: "#4a5568",
    textMuted: "#718096",
    bgLight: "#f7f8fc",
    bgWhite: "#ffffff",
    border: "#e2e8f0",
    success: "#48bb78",
  },
  logo: {
    localPath: "/assets/logoSeniorFloors.png",
    remoteUrl:
      process.env.NEXT_PUBLIC_BRAND_LOGO_URL ??
      "https://senior-floors.com/assets/logoSeniorFloors.png",
    alt: "Senior Floors",
  },
  mainSiteUrl: "https://senior-floors.com",
  fonts: {
    sans: "var(--font-inter)",
  },
  motion: {
    transition: "all 0.3s ease",
    hoverLift: "-translate-y-0.5",
    cardHoverLift: "-translate-y-[5px]",
  },
} as const;
