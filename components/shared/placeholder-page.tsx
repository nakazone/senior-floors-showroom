interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function createPlaceholderMetadata(
  title: string,
  description?: string,
) {
  return {
    title,
    description: description ?? `${title} - Senior Floors Studio`,
  };
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="section-padding pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner">
        <span className="eyebrow">Coming Soon</span>
        <h1 className="display-heading mb-4">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-walnut">{description}</p>
        ) : null}
      </div>
    </main>
  );
}
