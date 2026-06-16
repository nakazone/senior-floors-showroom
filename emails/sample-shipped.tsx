interface SampleShippedEmailProps {
  customerName: string;
  trackingNumber?: string;
}

export function SampleShippedEmail({
  customerName,
  trackingNumber,
}: SampleShippedEmailProps) {
  return (
    <div>
      <h1>Your samples are on the way, {customerName}!</h1>
      {trackingNumber ? <p>Tracking: {trackingNumber}</p> : null}
    </div>
  );
}
