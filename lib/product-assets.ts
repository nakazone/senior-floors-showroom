export function getProductAssetUrls(slug: string) {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  if (!base) {
    return null;
  }

  const normalizedBase = base.replace(/\/$/, "");

  return {
    installationGuide: `${normalizedBase}/docs/${slug}/installation-guide.pdf`,
    warranty: `${normalizedBase}/docs/${slug}/warranty.pdf`,
    technicalSheet: `${normalizedBase}/docs/${slug}/technical-sheet.pdf`,
  };
}
