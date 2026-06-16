interface WelcomeEmailProps {
  customerName: string;
}

export function WelcomeEmail({ customerName }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome to Senior Floors Studio, {customerName}!</h1>
      <p>Explore our premium LVP and engineered hardwood collections.</p>
    </div>
  );
}
