import {
  PlaceholderPage,
  createPlaceholderMetadata,
} from "@/components/shared/placeholder-page";

export const metadata = createPlaceholderMetadata(
  "About",
  "Learn about Senior Floors Studio and our commitment to premium flooring.",
);

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About Senior Floors Studio"
      description="Our story, craftsmanship standards and showroom experience."
    />
  );
}
